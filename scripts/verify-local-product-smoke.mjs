import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadPlaywright,
  startVitePreviewServer,
  wait,
  waitForServer,
} from "./browser-proof-support.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/qa");
const screenshotDir = join(outputDir, "local-product-smoke");
const distIndexPath = join(root, "dist/index.html");
const previewPort = Number(process.env.CITYATLAS_SMOKE_PORT || "4278");
const useExistingServer = process.env.CITYATLAS_SMOKE_USE_EXISTING_SERVER === "1";
const expectProtectedPreviewRoutes =
  process.env.CITYATLAS_SMOKE_EXPECT_PROTECTED_ROUTES === "1" || !useExistingServer;
const baseUrl = `http://127.0.0.1:${previewPort}`;
const navigationWaitUntil = useExistingServer ? "domcontentloaded" : "networkidle";
const failures = [];
const warnings = [];

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function noteFailure(scope, error) {
  const message = error instanceof Error ? error.message : String(error);
  failures.push(`${scope}: ${message}`);
  return message;
}

function noteWarning(scope, message) {
  warnings.push(`${scope}: ${message}`);
}

async function closeSafely(target, scope) {
  if (!target) {
    return;
  }

  try {
    await Promise.race([
      target.close(),
      wait(5_000).then(() => {
        throw new Error("close timed out");
      }),
    ]);
  } catch (error) {
    noteWarning(scope, error instanceof Error ? error.message : String(error));
  }
}

function attachRuntimeCapture(page, bucket) {
  page.on("pageerror", (error) => {
    bucket.pageErrors.push(error.message);
  });
  page.on("requestfailed", (request) => {
    const url = request.url();
    const errorText = request.failure()?.errorText ?? "request failed";
    const abortedImageRequest =
      errorText === "net::ERR_ABORTED" && request.resourceType() === "image";
    const abortedChunkRequest =
      errorText === "net::ERR_ABORTED"
      && request.resourceType() === "script"
      && url.startsWith(`${baseUrl}/assets/`);

    // Navigating between pages can cancel in-flight same-origin images without affecting users.
    if (url.startsWith(baseUrl) && !abortedImageRequest && !abortedChunkRequest) {
      bucket.requestFailures.push(`${url} :: ${errorText}`);
    }
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      bucket.consoleErrors.push(message.text());
    }
  });
}

async function saveScreenshot(page, fileName) {
  mkdirSync(screenshotDir, { recursive: true });
  const path = join(screenshotDir, fileName);
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const maxScrollTop = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    ) - window.innerHeight;
    const step = Math.max(Math.round(window.innerHeight * 0.82), 320);

    for (let scrollTop = 0; scrollTop < maxScrollTop; scrollTop += step) {
      window.scrollTo(0, Math.min(scrollTop, maxScrollTop));
      await pause(80);
    }

    window.scrollTo(0, maxScrollTop);
    await pause(120);
    window.scrollTo(0, 0);
    await pause(120);
  });
  await page.screenshot({ path, fullPage: true });
  return `output/qa/local-product-smoke/${fileName}`;
}

async function runStep(steps, name, fn) {
  console.log(`Running: ${name}`);
  try {
    const detail = await fn();
    steps.push({
      name,
      status: "passed",
      ...detail,
    });
    console.log(`Passed: ${name}`);
  } catch (error) {
    steps.push({
      name,
      status: "failed",
      error: noteFailure(name, error),
    });
    console.log(`Failed: ${name}`);
  }
}

async function runDesktopFlow(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  const runtime = {
    consoleErrors: [],
    pageErrors: [],
    requestFailures: [],
  };
  const steps = [];
  attachRuntimeCapture(page, runtime);

  await runStep(steps, "desktop home contact funnel", async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: navigationWaitUntil });
    const heroHeading = (await page.locator("h1").first().innerText()).trim();
    ensure(/vancouver/i.test(heroHeading), `Homepage hero heading should mention Vancouver, got "${heroHeading}".`);
    const screenshot = await saveScreenshot(page, "desktop-home.png");
    const requestLink = page.getByRole("link", { name: /Start business request/i }).first();
    const emailLink = page.getByRole("link", { name: /Email CityAtlas/i }).first();
    const requestHref = await requestLink.getAttribute("href");
    const emailHref = await emailLink.getAttribute("href");
    ensure(
      Boolean(requestHref && requestHref.includes("/for-businesses/submit")),
      `Homepage business request link should open the request form. Got "${requestHref}".`,
    );
    ensure(
      Boolean(emailHref && emailHref.startsWith("mailto:")),
      `Homepage email link should open a mailto draft. Got "${emailHref}".`,
    );
    await requestLink.click();
    await page.waitForURL(`${baseUrl}/for-businesses/submit`);

    return {
      route: "/for-businesses/submit",
      emailHref,
      screenshot,
    };
  });

  await runStep(steps, "desktop home area picker and search", async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: navigationWaitUntil });
    await page.getByRole("link", { name: /Kitsilano/i }).first().click();
    await page.waitForURL(`${baseUrl}/vancouver/kitsilano-scenic-starters`);
    const mapBodyText = await page.locator("body").innerText();
    ensure(/kitsilano/i.test(mapBodyText), "Homepage starting-point links did not open the Kitsilano page.");

    await page.goto(`${baseUrl}/`, { waitUntil: navigationWaitUntil });
    await page.getByLabel("Search CityAtlas").fill("first evening");
    const firstResult = page.locator(".hero-search-result").first();
    await firstResult.waitFor();
    const href = await firstResult.getAttribute("href");
    ensure(Boolean(href && href.startsWith("/")), "Homepage search did not surface a clickable route.");
    await firstResult.click();
    await page.waitForURL(`${baseUrl}${href}`);

    return {
      route: href,
      screenshot: await saveScreenshot(page, "desktop-home-search.png"),
    };
  });

  await runStep(steps, "desktop city starter navigation", async () => {
    await page.goto(`${baseUrl}/vancouver`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Find the right Vancouver start first/i }).waitFor();
    await page.getByRole("link", { name: /Kitsilano/i }).first().click();
    await page.waitForURL(`${baseUrl}/vancouver/kitsilano-scenic-starters`);
    const bodyText = await page.locator("body").innerText();
    ensure(/kitsilano/i.test(bodyText), "Kitsilano starters route did not render recognizable Kitsilano text.");

    return {
      route: "/vancouver/kitsilano-scenic-starters",
      screenshot: await saveScreenshot(page, "desktop-kitsilano-starters.png"),
    };
  });

  await runStep(steps, "desktop city page render", async () => {
    await page.goto(`${baseUrl}/vancouver`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Find the right Vancouver start first/i }).waitFor();
    const quickStartCount = await page.locator(".city-search-quick-link").count();
    ensure(quickStartCount >= 4, `Expected at least 4 city quick-start cards, found ${quickStartCount}.`);
    const businessImages = page.locator(".business-card img");
    const businessImageCount = await businessImages.count();
    ensure(businessImageCount >= 5, `Expected at least 5 source-backed business cards, found ${businessImageCount}.`);

    for (let index = 0; index < Math.min(5, businessImageCount); index += 1) {
      const image = businessImages.nth(index);
      await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(({ selector, imageIndex }) => {
        const images = Array.from(document.querySelectorAll(selector));
        const target = images[imageIndex];
        return target instanceof HTMLImageElement && target.currentSrc.length > 0 && target.naturalWidth > 0;
      }, { selector: ".business-card img", imageIndex: index });
    }

    const businessImageSources = await businessImages.evaluateAll((images) =>
      images.slice(0, 5).map((image) => (image instanceof HTMLImageElement ? image.currentSrc : "")),
    );
    ensure(
      businessImageSources.every((src) => src.includes("/assets/businesses/")),
      `Expected source-backed business cards to use venue-image assets. Got ${JSON.stringify(businessImageSources)}.`,
    );

    return {
      route: "/vancouver",
      screenshot: await saveScreenshot(page, "desktop-city.png"),
    };
  });

  await runStep(steps, "desktop guide library render", async () => {
    await page.goto(`${baseUrl}/vancouver/guides`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Vancouver guides for easier local plans/i }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Visitors and hosts|first arrivals, repeat visits, and guest plans/i.test(bodyText),
      "Guide library did not render the visitor-and-host section.",
    );

    return {
      route: "/vancouver/guides",
      screenshot: await saveScreenshot(page, "desktop-guide-library.png"),
    };
  });

  await runStep(steps, "desktop about render", async () => {
    await page.goto(`${baseUrl}/about`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /CityAtlas helps people choose the right Vancouver start/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Toronto already shows|same shape can expand into the next city/i.test(bodyText),
      "About page did not render the Toronto expansion signal.",
    );

    return {
      route: "/about",
      screenshot: await saveScreenshot(page, "desktop-about.png"),
    };
  });

  await runStep(steps, "desktop guide detail render", async () => {
    await page.goto(`${baseUrl}/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", {
      level: 1,
      name: /Where Should A First-Time Vancouver Visitor Start/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Open official places|Need the broader plan next/i.test(bodyText),
      "Guide detail did not render the follow-through guidance section.",
    );

    return {
      route: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
      screenshot: await saveScreenshot(page, "desktop-guide-detail.png"),
    };
  });

  await runStep(steps, "desktop business detail render", async () => {
    await page.goto(`${baseUrl}/vancouver/businesses/published-on-main`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Published on Main/i }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /What CityAtlas checks before a page is listed/i.test(bodyText),
      "Business detail page did not render the source-backed guidance.",
    );

    return {
      route: "/vancouver/businesses/published-on-main",
      screenshot: await saveScreenshot(page, "desktop-business-detail.png"),
    };
  });

  await runStep(steps, "desktop events render", async () => {
    await page.goto(`${baseUrl}/vancouver/events`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Vancouver event ideas that can shape the day/i }).waitFor();
    const eventCards = await page.locator(".compact-card").count();
    ensure(eventCards >= 1, `Expected at least 1 event card, found ${eventCards}.`);

    return {
      route: "/vancouver/events",
      screenshot: await saveScreenshot(page, "desktop-events.png"),
    };
  });

  await runStep(steps, "desktop Toronto pilot navigation", async () => {
    await page.goto(`${baseUrl}/toronto/guides`, { waitUntil: navigationWaitUntil });
    await page.locator("h1").waitFor();
    const guideHubText = await page.locator("body").innerText();
    ensure(/Toronto starting pages and guides/i.test(guideHubText), "Toronto guide hub did not render the Toronto starter heading.");
    await page.getByRole("link", { name: /First-time visitor starting points/i }).first().click();
    await page.waitForURL(`${baseUrl}/toronto/first-time-visitor-starters`);
    await page.getByRole("link", { name: /Read the Toronto destination guide/i }).click();
    await page.waitForURL(`${baseUrl}/toronto/guides/where-should-a-first-time-toronto-visitor-start`);
    const bodyText = await page.locator("body").innerText();
    ensure(/first-time Toronto visitor/i.test(bodyText), "Toronto pilot guide did not render recognizable first-time visitor copy.");

    return {
      route: "/toronto/guides/where-should-a-first-time-toronto-visitor-start",
      screenshot: await saveScreenshot(page, "desktop-toronto-pilot.png"),
    };
  });

  await runStep(steps, "desktop Toronto weekend navigation", async () => {
    await page.goto(`${baseUrl}/toronto/guides`, { waitUntil: navigationWaitUntil });
    await page.getByRole("link", { name: /Toronto weekend starting points/i }).click();
    await page.waitForURL(`${baseUrl}/toronto/weekend-route-starters`);
    await page.getByRole("link", { name: /Read the Toronto weekend guide/i }).click();
    await page.waitForURL(`${baseUrl}/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`);
    await page.getByRole("heading", {
      level: 1,
      name: /How To Build A Toronto Weekend Plan Without Crossing The City All Day/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Toronto weekend planning guide|choose the kind of Toronto weekend first|weekend visitors/i.test(bodyText),
      "Toronto weekend guide did not render recognizable Toronto weekend guidance.",
    );

    return {
      route: "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
      screenshot: await saveScreenshot(page, "desktop-toronto-weekend.png"),
    };
  });

  await runStep(steps, "desktop planner save and share", async () => {
    await page.goto(`${baseUrl}/planner`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Build a simple Vancouver plan you can keep/i }).waitFor();
    const firstChip = page.locator(".planner-chip").first();
    const chipLabel = (await firstChip.locator("span").innerText()).trim();
    ensure(Boolean(chipLabel), "Planner did not expose a saveable chip label.");
    await firstChip.click();
    await page.locator(".saved-row").filter({ hasText: chipLabel }).waitFor();
    await page.getByRole("button", { name: /Prepare share text/i }).click();
    await page.locator(".local-success").waitFor();
    const successText = await page.locator(".local-success").innerText();
    ensure(
      /share text is ready here/i.test(successText),
      `Planner share draft message was not shown. Got "${successText}".`,
    );

    return {
      route: "/planner",
      savedItem: chipLabel,
      screenshot: await saveScreenshot(page, "desktop-planner.png"),
    };
  });

  await runStep(steps, "desktop business pricing render", async () => {
    await page.goto(`${baseUrl}/for-businesses/pricing`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Choose the right first CityAtlas package for your Vancouver business/i,
    }).waitFor();
    const pricingCardSelector = ".pricing-choice-card, .pricing-card";
    const packageCards = await page.locator(pricingCardSelector).count();
    ensure(packageCards >= 3, `Expected at least 3 pricing cards, found ${packageCards}.`);
    const firstChooseHref = await page
      .locator(".pricing-choice-card a.button, .pricing-card a.button")
      .first()
      .getAttribute("href");
    ensure(
      Boolean(firstChooseHref && firstChooseHref.includes("/for-businesses/submit?package=")),
      `Pricing cards should link to a prefilled business request. Got "${firstChooseHref}".`,
    );

    return {
      route: "/for-businesses/pricing",
      packageCards,
      screenshot: await saveScreenshot(page, "desktop-business-pricing.png"),
    };
  });

  await runStep(steps, "desktop terms render", async () => {
    await page.goto(`${baseUrl}/terms`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /CityAtlas terms for the public site/i }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(/What the public site includes today/i.test(bodyText), "Terms page did not render the public-site summary cards.");

    return {
      route: "/terms",
      screenshot: await saveScreenshot(page, "desktop-terms.png"),
    };
  });

  await runStep(steps, "desktop privacy render", async () => {
    await page.goto(`${baseUrl}/privacy`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /How CityAtlas handles data today/i }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(/What stays on this device/i.test(bodyText), "Privacy page did not render the device-storage summary cards.");

    return {
      route: "/privacy",
      screenshot: await saveScreenshot(page, "desktop-privacy.png"),
    };
  });

  await runStep(steps, "desktop business request draft save", async () => {
    const businessName = "Smoke Test Bistro";
    await page.goto(`${baseUrl}/for-businesses/submit?package=signature_partner`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", { level: 1, name: /Tell CityAtlas what should improve first/i }).waitFor();
    const packageInterest = await page.getByLabel("Package interest").inputValue();
    ensure(
      packageInterest === "signature_partner",
      `Expected signature_partner query prefill, got "${packageInterest}".`,
    );

    await page.getByLabel("Business name").fill(businessName);
    await page.getByLabel("Category").fill("Restaurant");
    await page.getByLabel("Neighborhood").fill("Gastown");
    await page.getByLabel("Website").fill("https://smoke-bistro.example");
    await page.getByLabel("Contact name").fill("Jordan");
    await page.getByLabel("Email").fill("hello@smoke-bistro.example");
    await page.getByLabel("What you want help with").fill("Smoke test request for local visibility help.");
    await page.getByRole("button", { name: /Save draft for later/i }).click();
    await page.getByText(/Your draft is saved in this browser/i).waitFor();
    await page.locator(".submission-row").filter({ hasText: businessName }).waitFor();

    return {
      route: "/for-businesses/submit",
      businessName,
      screenshot: await saveScreenshot(page, "desktop-business-submit.png"),
    };
  });

  await runStep(steps, "desktop private preview render", async () => {
    await page.goto(`${baseUrl}/private-preview/date-night`, { waitUntil: navigationWaitUntil });
    if (expectProtectedPreviewRoutes) {
      await page.getByRole("heading", {
        level: 1,
        name: /only available inside a protected sharing flow/i,
      }).waitFor();
      const bodyText = await page.locator("body").innerText();
      ensure(
        /shared selectively|outside the public cityatlas experience/i.test(bodyText),
        "Protected preview route did not render the expected sharing guardrail copy.",
      );

      return {
        route: "/private-preview/date-night",
        access: "protected",
        screenshot: await saveScreenshot(page, "desktop-private-preview.png"),
      };
    }

    await page.getByRole("heading", { level: 1, name: /Vancouver Date Night route preview/i }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(/review-only surface/i.test(bodyText), "Private preview did not render the review-only safety copy.");

    return {
      route: "/private-preview/date-night",
      screenshot: await saveScreenshot(page, "desktop-private-preview.png"),
    };
  });

  await runStep(steps, "desktop admin import preview and add", async () => {
    const importedBusinessName = "Smoke Test Gallery";
    const csv = [
      "businessName,email,contactName,cityName,neighborhood,category,segment,sourceLabel,sourceUrl,website,contactPath,notes,relationshipWarmth",
      `${importedBusinessName},hello@smokegallery.example,Taylor,Vancouver,Mount Pleasant,Gallery,Arts venue,Manual source,https://smokegallery.example,https://smokegallery.example,https://smokegallery.example/contact,Smoke import row for local QA,medium`,
    ].join("\n");

    if (expectProtectedPreviewRoutes) {
      return {
        route: "/admin",
        access: "protected",
      };
    }

    await page.goto(`${baseUrl}/admin`, { waitUntil: navigationWaitUntil });

    await page.getByRole("heading", { level: 1, name: /CityAtlas operator console/i }).waitFor();
    await page.getByRole("button", { name: /Queue cleanup/i }).click();
    await page.getByText(/No-send business prospect queue/i).waitFor();
    const queueTotalBefore = await page.locator(".proof-candidate-summary").first().locator("strong").first().innerText();
    await page.locator(".admin-disclosure summary").click();
    await page.getByLabel("EXA or manual research rows").waitFor({ state: "visible" });
    await page.getByLabel("EXA or manual research rows").fill(csv);
    const previewSummary = page.locator(".prospect-import-preview strong").first();
    await previewSummary.waitFor();
    const previewText = await previewSummary.innerText();
    ensure(
      /1\/1 rows are safe to add locally/i.test(previewText),
      `Import preview did not report a safe row. Got "${previewText}".`,
    );

    await page.getByRole("button", { name: /Add importable rows to local queue/i }).click();
    await page.waitForFunction((beforeCount) => {
      const nextCount = Number(
        document.querySelector(".proof-candidate-summary strong")?.textContent ?? "0",
      );
      return Number.isFinite(nextCount) && nextCount > Number(beforeCount);
    }, Number(queueTotalBefore.replace(/[^\d]/g, "")));
    await page.getByLabel("Queue focus").selectOption("email_ready");
    await page.getByText(/Vancouver queue focus: Email-ready/i).waitFor();
    await page.getByLabel("Active city").selectOption("toronto");
    await page.getByText(/Toronto queue focus: Email-ready/i).waitFor();
    await page.getByLabel("Queue focus").selectOption("contact_path_ready");
    await page.getByText(/Toronto queue focus: Contact-path review/i).waitFor();
    await page.getByLabel("Active city").selectOption("vancouver");
    await page.getByLabel("Queue focus").selectOption("promotion_candidates");
    await page.getByText(/Vancouver queue focus: Promotion candidates/i).waitFor();
    await page.getByLabel("Queue focus").selectOption("all");
    await page.getByText(/Vancouver queue focus: All rows/i).waitFor();

    return {
      route: "/admin",
      importedBusinessName,
      queueTotalBefore,
    };
  });

  await runStep(steps, "desktop admin reply log", async () => {
    if (expectProtectedPreviewRoutes) {
      return {
        route: "/admin",
        access: "protected",
      };
    }

    const replySummary = "Smoke test reply summary for local QA.";
    const nextStep = "Keep this in local review only after smoke.";
    await page.getByRole("button", { name: /Outreach rehearsal/i }).click();
    await page.getByLabel("Reply summary").waitFor();
    await page.getByLabel("Reply summary").fill(replySummary);
    await page.getByLabel("Next step").fill(nextStep);
    await page.getByRole("button", { name: /Log manual reply/i }).click();
    await page.locator(".reply-log-row").filter({ hasText: replySummary }).waitFor();

    return {
      route: "/admin",
      replySummary,
    };
  });

  await runStep(steps, "desktop admin brain save", async () => {
    if (expectProtectedPreviewRoutes) {
      return {
        route: "/admin",
        access: "protected",
        screenshot: await saveScreenshot(page, "desktop-admin.png"),
      };
    }

    const before = await page.locator(".brain-run-row").count();
    await page.getByRole("button", { name: /Signals \+ controls/i }).click();
    await page.getByText(/Local command engine/i).waitFor();
    await page.getByRole("button", { name: "Save run", exact: true }).click();
    await page.waitForTimeout(150);
    const after = await page.locator(".brain-run-row").count();
    ensure(after > before, `Expected saved brain runs to increase, but count stayed at ${after}.`);

    return {
      route: "/admin",
      before,
      after,
      screenshot: await saveScreenshot(page, "desktop-admin.png"),
    };
  });

  await closeSafely(context, "desktop context close");
  return {
    viewport: "desktop",
    steps,
    runtime,
  };
}

async function runMobileFlow(browser) {
  const { devices } = loadPlaywright();
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    colorScheme: "light",
  });
  const page = await context.newPage();
  const runtime = {
    consoleErrors: [],
    pageErrors: [],
    requestFailures: [],
  };
  const steps = [];
  attachRuntimeCapture(page, runtime);

  await runStep(steps, "mobile home render", async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: navigationWaitUntil });
    await page.locator("h1").first().waitFor();
    const heading = (await page.locator("h1").first().innerText()).trim();
    ensure(/vancouver/i.test(heading), `Mobile homepage heading should mention Vancouver, got "${heading}".`);

    return {
      route: "/",
      screenshot: await saveScreenshot(page, "mobile-home.png"),
    };
  });

  await runStep(steps, "mobile city page render", async () => {
    await page.goto(`${baseUrl}/vancouver`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Find the right Vancouver start first/i }).waitFor();

    return {
      route: "/vancouver",
      screenshot: await saveScreenshot(page, "mobile-city.png"),
    };
  });

  await runStep(steps, "mobile Toronto pilot render", async () => {
    await page.goto(`${baseUrl}/toronto/first-time-visitor-starters`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Toronto first-time visitor starting points/i,
    }).waitFor();

    return {
      route: "/toronto/first-time-visitor-starters",
      screenshot: await saveScreenshot(page, "mobile-toronto-pilot.png"),
    };
  });

  await runStep(steps, "mobile Toronto weekend render", async () => {
    await page.goto(`${baseUrl}/toronto/weekend-route-starters`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Toronto weekend.*starting points/i,
    }).waitFor();

    return {
      route: "/toronto/weekend-route-starters",
      screenshot: await saveScreenshot(page, "mobile-toronto-weekend.png"),
    };
  });

  await runStep(steps, "mobile guide library render", async () => {
    await page.goto(`${baseUrl}/vancouver/guides`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Vancouver guides for easier local plans/i,
    }).waitFor();

    return {
      route: "/vancouver/guides",
      screenshot: await saveScreenshot(page, "mobile-guide-library.png"),
    };
  });

  await runStep(steps, "mobile about render", async () => {
    await page.goto(`${baseUrl}/about`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /CityAtlas helps people choose the right Vancouver start/i,
    }).waitFor();

    return {
      route: "/about",
      screenshot: await saveScreenshot(page, "mobile-about.png"),
    };
  });

  await runStep(steps, "mobile guide detail render", async () => {
    await page.goto(`${baseUrl}/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", {
      level: 1,
      name: /Where Should A First-Time Vancouver Visitor Start/i,
    }).waitFor();

    return {
      route: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
      screenshot: await saveScreenshot(page, "mobile-guide-detail.png"),
    };
  });

  await runStep(steps, "mobile business detail render", async () => {
    await page.goto(`${baseUrl}/vancouver/businesses/published-on-main`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Published on Main/i }).waitFor();

    return {
      route: "/vancouver/businesses/published-on-main",
      screenshot: await saveScreenshot(page, "mobile-business-detail.png"),
    };
  });

  await runStep(steps, "mobile planner render and save", async () => {
    await page.goto(`${baseUrl}/planner`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Build a simple Vancouver plan you can keep/i }).waitFor();
    const firstChip = page.locator(".planner-chip").first();
    const chipLabel = (await firstChip.locator("span").innerText()).trim();
    await firstChip.click();
    await page.locator(".saved-row").filter({ hasText: chipLabel }).waitFor();

    return {
      route: "/planner",
      savedItem: chipLabel,
      screenshot: await saveScreenshot(page, "mobile-planner.png"),
    };
  });

  await runStep(steps, "mobile business request render", async () => {
    await page.goto(`${baseUrl}/for-businesses/submit`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Tell CityAtlas what should improve first/i }).waitFor();
    await page.getByRole("button", { name: /Open email draft/i }).waitFor();

    return {
      route: "/for-businesses/submit",
      screenshot: await saveScreenshot(page, "mobile-business-submit.png"),
    };
  });

  await runStep(steps, "mobile business pricing render", async () => {
    await page.goto(`${baseUrl}/for-businesses/pricing`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Choose the right first CityAtlas package for your Vancouver business/i,
    }).waitFor();
    const pricingCardSelector = ".pricing-choice-card, .pricing-card";
    const packageCards = await page.locator(pricingCardSelector).count();
    ensure(packageCards >= 3, `Expected at least 3 pricing cards on mobile, found ${packageCards}.`);

    return {
      route: "/for-businesses/pricing",
      packageCards,
      screenshot: await saveScreenshot(page, "mobile-business-pricing.png"),
    };
  });

  await runStep(steps, "mobile offers render", async () => {
    await page.goto(`${baseUrl}/vancouver/offers`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Vancouver offers worth checking before a detour/i }).waitFor();

    return {
      route: "/vancouver/offers",
      screenshot: await saveScreenshot(page, "mobile-offers.png"),
    };
  });

  await runStep(steps, "mobile terms render", async () => {
    await page.goto(`${baseUrl}/terms`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /CityAtlas terms for the public site/i }).waitFor();

    return {
      route: "/terms",
      screenshot: await saveScreenshot(page, "mobile-terms.png"),
    };
  });

  await runStep(steps, "mobile admin render", async () => {
    if (expectProtectedPreviewRoutes) {
      return {
        route: "/admin",
        access: "protected",
      };
    }

    await page.goto(`${baseUrl}/admin`, { waitUntil: navigationWaitUntil });

    await page.getByRole("heading", { level: 1, name: /CityAtlas operator console/i }).waitFor();
    await page.getByRole("button", { name: /Queue cleanup/i }).click();
    await page.getByLabel("Queue focus").selectOption("needs_research");
    await page.getByText(/Vancouver queue focus: Needs research/i).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(/Owner console/i.test(bodyText), "Mobile admin page did not render the owner-console section.");

    return {
      route: "/admin",
      screenshot: await saveScreenshot(page, "mobile-admin.png"),
    };
  });

  await runStep(steps, "mobile private preview render", async () => {
    await page.goto(`${baseUrl}/private-preview/date-night`, { waitUntil: navigationWaitUntil });
    if (expectProtectedPreviewRoutes) {
      await page.getByRole("heading", {
        level: 1,
        name: /only available inside a protected sharing flow/i,
      }).waitFor();
      const bodyText = await page.locator("body").innerText();
      ensure(
        /shared selectively|outside the public cityatlas experience/i.test(bodyText),
        "Protected mobile preview route did not render the expected sharing guardrail copy.",
      );

      return {
        route: "/private-preview/date-night",
        access: "protected",
        screenshot: await saveScreenshot(page, "mobile-private-preview.png"),
      };
    }

    await page.getByRole("heading", { level: 1, name: /Vancouver Date Night route preview/i }).waitFor();

    return {
      route: "/private-preview/date-night",
      screenshot: await saveScreenshot(page, "mobile-private-preview.png"),
    };
  });

  await closeSafely(context, "mobile context close");
  return {
    viewport: "mobile",
    steps,
    runtime,
  };
}

function summarizeRuntime(scope, runtime) {
  if (runtime.pageErrors.length > 0) {
    noteFailure(scope, new Error(`Page errors: ${runtime.pageErrors.join(" | ")}`));
  }
  if (runtime.requestFailures.length > 0) {
    noteFailure(scope, new Error(`Same-origin request failures: ${runtime.requestFailures.join(" | ")}`));
  }
  if (runtime.consoleErrors.length > 0) {
    noteWarning(scope, `Console errors observed: ${runtime.consoleErrors.join(" | ")}`);
  }
}

async function main() {
  const server = useExistingServer
    ? null
    : startVitePreviewServer({ root, port: previewPort, distIndexPath });
  const { chromium } = loadPlaywright();
  mkdirSync(outputDir, { recursive: true });

  let browser;

  try {
    if (!useExistingServer) {
      await waitForServer(
        baseUrl,
        () => server?.getLogs() || { stdout: "Using existing server.", stderr: "" },
      );
    }
    browser = await chromium.launch({
      headless: true,
      channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || undefined,
    });

    const desktop = await runDesktopFlow(browser);
    const mobile = await runMobileFlow(browser);
    summarizeRuntime("desktop runtime", desktop.runtime);
    summarizeRuntime("mobile runtime", mobile.runtime);

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      serverMode: useExistingServer ? "existing" : "preview",
      passed: failures.length === 0,
      failures,
      warnings,
      summary: {
        desktopStepsPassed: desktop.steps.filter((step) => step.status === "passed").length,
        desktopStepsFailed: desktop.steps.filter((step) => step.status === "failed").length,
        mobileStepsPassed: mobile.steps.filter((step) => step.status === "passed").length,
        mobileStepsFailed: mobile.steps.filter((step) => step.status === "failed").length,
      },
      desktop,
      mobile,
    };

    writeFileSync(join(outputDir, "local-product-smoke.json"), `${JSON.stringify(report, null, 2)}\n`);
    console.log("CityAtlas local product smoke");
    console.log(JSON.stringify(report, null, 2));

    if (!report.passed) {
      process.exitCode = 1;
    }
  } finally {
    if (browser) {
      await closeSafely(browser, "browser close");
    }
    server?.child.kill("SIGTERM");
  }
}

await main();
