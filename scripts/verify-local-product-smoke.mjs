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
const protectedRoutesOverride = process.env.CITYATLAS_SMOKE_EXPECT_PROTECTED_ROUTES;
const expectProtectedPreviewRoutes =
  protectedRoutesOverride === "1"
    ? true
    : protectedRoutesOverride === "0"
      ? false
      : !useExistingServer || previewPort !== 5178;
const baseUrl = `http://127.0.0.1:${previewPort}`;
const navigationWaitUntil = useExistingServer ? "domcontentloaded" : "networkidle";
const failures = [];
const warnings = [];

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function ensureFeaturedRoute(page, expectedPattern, message) {
  const routeLabel = await page.locator(".planner-fridge-route").first().innerText();
  ensure(
    expectedPattern.test(routeLabel),
    `${message} Featured route label was: ${routeLabel}`,
  );
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
      && (url.startsWith(`${baseUrl}/assets/`) || url.startsWith(`${baseUrl}/src/`));

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
  try {
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
  } catch {
    // A route can finish a client-side navigation during the scroll prep on dev.
    // Still attempt the screenshot so the smoke reflects rendered UI, not helper timing.
  }
  try {
    await page.screenshot({ path, fullPage: true, timeout: 60_000 });
  } catch (error) {
    noteWarning(
      "screenshot",
      `Could not capture ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
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
    const searchButton = page.getByRole("button", { name: /Search direct/i }).first();
    await searchButton.click();
    const searchInput = page.getByLabel("Search CityAtlas");
    await searchInput.waitFor();
    const activeElementId = await page.evaluate(() => document.activeElement?.getAttribute("id"));
    ensure(
      activeElementId === "home-place-search-input",
      `Homepage search button should focus the direct-search input. Active element id was "${activeElementId}".`,
    );
    const requestLink = page.getByRole("link", { name: /Start business request/i }).first();
    const requestHref = await requestLink.getAttribute("href");
    ensure(
      Boolean(requestHref && requestHref.includes("/for-businesses/submit")),
      `Homepage business request link should open the request form. Got "${requestHref}".`,
    );
    await requestLink.click();
    await page.waitForURL(`${baseUrl}/for-businesses/submit`);

    return {
      route: "/for-businesses/submit",
      screenshot,
    };
  });

  await runStep(steps, "desktop home two-step picker and search", async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: navigationWaitUntil });
    await page.getByRole("button", { name: /Weekend plan/i }).first().click();
    await page.getByRole("link", { name: /Weekend route starters/i }).first().click();
    await page.waitForURL(`${baseUrl}/vancouver/weekend-route-starters`);
    const mapBodyText = await page.locator("body").innerText();
    ensure(
      /weekend/i.test(mapBodyText),
      "Homepage two-step picker did not open the selected weekend starters page.",
    );

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
    await page.getByRole("heading", { level: 1, name: /What kind of day is it\?/i }).waitFor();
    await page.getByRole("link", { name: /Open the first visit Vancouver page/i }).click();
    await page.waitForURL(`${baseUrl}/vancouver/first-time-visitor-starters`);
    const bodyText = await page.locator("body").innerText();
    ensure(
      /first-time|visitor|vancouver/i.test(bodyText),
      "First-visit starters route did not render recognizable visitor-start text.",
    );

    return {
      route: "/vancouver/first-time-visitor-starters",
      screenshot: await saveScreenshot(page, "desktop-first-visit-starters.png"),
    };
  });

  await runStep(steps, "desktop city page render", async () => {
    await page.goto(`${baseUrl}/vancouver`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /What kind of day is it\?/i }).waitFor();
    const pickerChoiceCount = await page.locator(".city-door-card").count();
    ensure(
      pickerChoiceCount >= 5,
      `Expected at least 5 giant city-door choices, found ${pickerChoiceCount}.`,
    );
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
    await page.getByRole("heading", { level: 1, name: /What do you need today/i }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /I'm visiting Vancouver|I live here - plan my day|Just show me one good plan/i.test(bodyText),
      "Guide door did not render the main chooser options.",
    );
    const guideDoorCount = await page.locator(".guide-door-photo img").count();
    ensure(guideDoorCount >= 3, `Expected 3 image-backed guide door choices, found ${guideDoorCount}.`);

    return {
      route: "/vancouver/guides",
      screenshot: await saveScreenshot(page, "desktop-guide-library.png"),
    };
  });

  await runStep(steps, "desktop route chooser guide render", async () => {
    await page.goto(`${baseUrl}/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", {
      level: 1,
      name: /Which easy Vancouver guide should you open today/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Focused next options|Try a different starting page|Need a focused page next|Pick the day type first|Rainy day|Visitor start/i.test(bodyText),
      "Route chooser guide did not render the focused next-page routing module.",
    );

    return {
      route: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
      screenshot: await saveScreenshot(page, "desktop-route-chooser-guide.png"),
    };
  });

  await runStep(steps, "desktop about render", async () => {
    await page.goto(`${baseUrl}/about`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Cities should feel easier to love/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Dear city wanderer|The CityAtlas founder/i.test(bodyText),
      "About page did not render the founder-letter story.",
    );
    ensure(
      /city is not a spreadsheet|The goal is not more scrolling|What CityAtlas believes/i.test(bodyText),
      "About page did not render the simplified founder vision copy.",
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
      name: /What do you want to do first\?/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /See local places|Browse more Vancouver guides|Local places to open next/i.test(bodyText),
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
    ensure(/Let's pick your Toronto start/i.test(guideHubText), "Toronto guide hub did not render the Toronto question-led heading.");
    await page.getByRole("link", { name: /First-time visitor starting points/i }).first().click();
    await page.waitForURL(`${baseUrl}/toronto/first-time-visitor-starters`);
    await page.getByRole("link", { name: /Read the Toronto destination guide/i }).click();
    await page.waitForURL(`${baseUrl}/toronto/guides/where-should-a-first-time-toronto-visitor-start`);
    await page.getByRole("heading", {
      level: 1,
      name: /What do you want to do first\?/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /first-time Toronto visitor|Open example (route|plan)|Open route map|Plan preview|Route preview|Toronto First Arrival Loop/i.test(bodyText),
      "Toronto pilot guide did not render the first-time visitor plan handoff.",
    );
    await page.locator('a[href="/toronto/missions#mission-toronto-first-arrival-loop"]').first().click();
    await page.waitForURL(/\/toronto\/missions#mission-toronto-first-arrival-loop$/);
    await ensureFeaturedRoute(
      page,
      /Toronto First Arrival Loop/i,
      "Toronto missions page did not feature the clicked first-arrival route after guide handoff.",
    );

    return {
      route: "/toronto/missions#mission-toronto-first-arrival-loop",
      screenshot: await saveScreenshot(page, "desktop-toronto-pilot.png"),
    };
  });

  await runStep(steps, "desktop Toronto weekend navigation", async () => {
    await page.goto(`${baseUrl}/toronto/guides`, { waitUntil: navigationWaitUntil });
    await page.locator('a[href="/toronto/weekend-route-starters"]').first().click();
    await page.waitForURL(`${baseUrl}/toronto/weekend-route-starters`);
    await page.locator('a[href="/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day"]').first().click();
    await page.waitForURL(`${baseUrl}/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`);
    await page.getByRole("heading", {
      level: 1,
      name: /What do you want to do first\?/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Toronto weekend planning guide|Open Toronto weekend starters|Toronto Weekend Waterfront Loop|weekend anchor/i.test(bodyText),
      "Toronto weekend guide did not render the weekend plan handoff.",
    );
    await page.locator('a[href="/toronto/missions#mission-toronto-weekend-waterfront-loop"]').first().click();
    await page.waitForURL(/\/toronto\/missions#mission-toronto-weekend-waterfront-loop$/);
    await ensureFeaturedRoute(
      page,
      /Toronto Weekend Waterfront Loop/i,
      "Toronto missions page did not feature the clicked weekend route after guide handoff.",
    );

    return {
      route: "/toronto/missions#mission-toronto-weekend-waterfront-loop",
      screenshot: await saveScreenshot(page, "desktop-toronto-weekend.png"),
    };
  });

  await runStep(steps, "desktop cafe guide route handoff", async () => {
    await page.goto(`${baseUrl}/vancouver/guides/how-to-pick-a-work-friendly-vancouver-cafe`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", {
      level: 1,
      name: /What do you want to do first\?/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Open route with map|Open (saved |example )?plan( with map)?|Plan preview|Route preview|Focus Block Flex Route/i.test(bodyText),
      "Cafe guide did not render the new plan handoff.",
    );
    await page.locator('a[href="/vancouver/missions#mission-focus-block-flex"]').first().click();
    await page.waitForURL(/\/vancouver\/missions#mission-focus-block-flex$/);
    await ensureFeaturedRoute(
      page,
      /Focus Block Flex/i,
      "Missions page did not feature the clicked focus-block route after the cafe guide handoff.",
    );
    await page.getByRole("link", { name: /Open map in planner/i }).click();
    await page.waitForURL(/\/planner\?route=mission-focus-block-flex#planner-active-route$/);
    await page.getByRole("heading", { level: 1, name: /Focus Block Flex/i }).waitFor();

    return {
      route: "/planner?route=mission-focus-block-flex#planner-active-route",
      screenshot: await saveScreenshot(page, "desktop-cafe-guide-route.png"),
    };
  });

  await runStep(steps, "desktop planner save and share", async () => {
    await page.goto(`${baseUrl}/planner`, { waitUntil: navigationWaitUntil });
    await page.locator(".mission-full-bleed-map-frame").waitFor();

    const clearPlannerButton = page.getByRole("button", { name: /Clear (saved list|planner)/i });
    if (await clearPlannerButton.count()) {
      await clearPlannerButton.first().click();
      await page.getByRole("button", { name: /Confirm clear/i }).click();
    }

    await page.getByRole("button", { name: /Choose a ready-made plan/i }).click();
    await page.locator("#planner-explore-more details[open]").waitFor();
    const readyCards = page.locator(".planner-ready-route-card");
    const readyCardCount = await readyCards.count();
    ensure(readyCardCount >= 3, `Expected at least 3 ready-made plan cards, found ${readyCardCount}.`);
    const firstReadyCard = readyCards.first();
    const routeTitle = (await firstReadyCard.locator("h3").innerText()).trim();
    ensure(Boolean(routeTitle), "Planner did not expose a ready-made route title.");
    await firstReadyCard.getByRole("button", { name: /Open map plan|Showing on map/i }).click();
    await page.locator(".mission-plan-rail-header").filter({ hasText: routeTitle }).waitFor();
    await page.locator(".mission-full-bleed-map-frame").waitFor();

    const keepPlanButton = page.locator(".mission-plan-rail-keep-section").getByRole("button", {
      name: /Keep this plan/i,
    });
    await keepPlanButton.scrollIntoViewIfNeeded();
    await keepPlanButton.click();
    await page.locator(".planner-saved-route-card").filter({ hasText: routeTitle }).waitFor();
    await page.locator(".planner-saved-route-card").filter({ hasText: routeTitle }).getByRole("button", {
      name: /Open map plan|Showing on map/i,
    }).click();
    await page.locator(".mission-plan-rail-header").filter({ hasText: routeTitle }).waitFor();

    const shareSummary = page.locator(".planner-share-group summary").first();
    await shareSummary.scrollIntoViewIfNeeded();
    await shareSummary.click();
    await page.locator(".share-draft").getByRole("button", { name: /Copy (share text|route summary|plan summary)/i }).click();
    const shareSuccess = page.locator(".planner-share-group .local-success").filter({
      hasText: /(route|plan) (text|summary) copied|(route|plan) (text|summary) is ready|ready below/i,
    });
    await shareSuccess.waitFor();
    const successText = await shareSuccess.innerText();
    ensure(
      /(route|plan) (text|summary) copied|(route|plan) (text|summary) is ready|ready below/i.test(successText),
      `Planner share draft message was not shown. Got "${successText}".`,
    );

    return {
      route: "/planner",
      savedRoute: routeTitle,
      screenshot: await saveScreenshot(page, "desktop-planner.png"),
    };
  });

  await runStep(steps, "desktop saved plans alias opens planner", async () => {
    await page.goto(`${baseUrl}/saved-plans`, { waitUntil: navigationWaitUntil });
    await page.getByText(/Your saved plans/i).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Your saved plans|Browse ready-made routes|No saved plans yet/i.test(bodyText),
      "Saved-plans alias did not open the Planner saved-plan area.",
    );
    ensure(
      !/CityAtlas does not have that page yet|Pick this ready-made route first/i.test(bodyText),
      "Saved-plans alias opened the wrong surface instead of Planner.",
    );

    return {
      route: "/saved-plans",
      screenshot: await saveScreenshot(page, "desktop-saved-plans-alias.png"),
    };
  });

  await runStep(steps, "desktop ready-made routes alias render", async () => {
    await page.goto(`${baseUrl}/ready-made-routes`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", { level: 1, name: /Pick this ready-made route first/i }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /This page is the route library|Open map in planner|Ready-made route/i.test(bodyText),
      "Ready-made routes alias did not render the route-library handoff.",
    );

    return {
      route: "/ready-made-routes",
      screenshot: await saveScreenshot(page, "desktop-ready-made-routes.png"),
    };
  });

  await runStep(steps, "desktop business pricing render", async () => {
    await page.goto(`${baseUrl}/for-businesses/pricing`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Get found by Vancouver locals/i,
    }).waitFor();
    await page.getByText(/\$0 - Today/i).waitFor();
    await page.getByText(/See the real CityAtlas output first/i).waitFor();
    await page.getByText(/Current reply proof/i).waitFor();
    await page.getByText(/Live replies sent/i).waitFor();
    const pathCards = await page.locator(".pricing-path-card").count();
    ensure(pathCards >= 1, `Expected a free-first pricing boundary card, found ${pathCards}.`);
    const proofExamples = await page.locator(".pricing-output-preview-card-link").count();
    ensure(proofExamples >= 2, `Expected at least 2 live proof examples on pricing, found ${proofExamples}.`);
    const firstChooseHref = await page
      .getByRole("link", { name: /Request free review|Start the free review/i })
      .first()
      .getAttribute("href");
    ensure(
      Boolean(firstChooseHref && firstChooseHref.includes("/for-businesses/submit")),
      `Pricing hero should link to the business request form. Got "${firstChooseHref}".`,
    );
    const packageDisclosure = page.locator("#pricing-paid-options summary").first();
    if (await packageDisclosure.count()) {
      await packageDisclosure.scrollIntoViewIfNeeded();
      await packageDisclosure.click();
    }
    const packageCards = await page.locator(".pricing-choice-card").count();
    ensure(packageCards >= 3, `Expected at least 3 package cards after opening pricing options, found ${packageCards}.`);

    return {
      route: "/for-businesses/pricing",
      packageCards,
      screenshot: await saveScreenshot(page, "desktop-business-pricing.png"),
    };
  });

  await runStep(steps, "desktop business fit call render", async () => {
    await page.goto(`${baseUrl}/for-businesses/book-call`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Book a short CityAtlas fit call/i,
    }).waitFor();
    await page.getByText(/Current reply proof/i).waitFor();
    await page.getByText(/Live replies sent/i).waitFor();
    const packageSelect = page.getByLabel("Package, if you already know");
    const packageValue = await packageSelect.inputValue();
    ensure(
      packageValue === "",
      `Expected no default package on the fit-call page, got "${packageValue}".`,
    );
    const checkoutDisclosureCountBefore = await page
      .locator(".submission-support-disclosure")
      .filter({ hasText: /Already sure about the paid path/i })
      .count();
    ensure(
      checkoutDisclosureCountBefore === 0,
      `Expected no checkout disclosure before choosing a package, found ${checkoutDisclosureCountBefore}.`,
    );
    await packageSelect.selectOption("city_partner");
    const checkoutDisclosure = page
      .locator(".submission-support-disclosure")
      .filter({ hasText: /Already sure about the paid path/i });
    await checkoutDisclosure.waitFor();

    return {
      route: "/for-businesses/book-call",
      screenshot: await saveScreenshot(page, "desktop-business-book-call.png"),
    };
  });

  await runStep(steps, "desktop partner preview render", async () => {
    await page.goto(`${baseUrl}/for-businesses/partner-preview`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /See what CityAtlas can already build for a local business/i,
    }).waitFor();
    await page.getByText(/Current reply proof/i).waitFor();
    await page.getByText(/Live replies sent/i).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /host(ed)? (meal|visit|experience)|host a visit or service|hosted meal, service, walkthrough, or offering/i.test(bodyText),
      "Partner preview did not explain the hosted experience ask.",
    );
    ensure(
      /first reply is a fit note|Paid packages stay optional|free reviewed request/i.test(bodyText),
      "Partner preview did not render the request-first or paid-optional framing.",
    );
    const proofCards = await page.locator(".partner-proof-card").count();
    ensure(proofCards >= 2, `Expected at least 2 partner-preview proof example cards, found ${proofCards}.`);
    await page.getByText(/Start with the free request, get the fit note back/i).waitFor();

    return {
      route: "/for-businesses/partner-preview",
      screenshot: await saveScreenshot(page, "desktop-partner-preview.png"),
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
    const businessName = `Smoke Test Bistro ${Date.now()}`;
    await page.goto(`${baseUrl}/for-businesses/submit?package=signature_partner`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", { level: 1, name: /Start a simple business request/i }).waitFor();
    await page.getByText(/Step 1 of 3/i).waitFor();
    await page.getByText(/Question 1 of 3/i).waitFor();
    await page.getByText(/What's your business called\?/i).waitFor();
    await page.getByText(/What the first reply can look like/i).waitFor();
    const proofDisclosure = page.locator(".submission-proof-disclosure");
    await proofDisclosure.getByText(/See live examples and current reply proof/i).waitFor();
    await proofDisclosure.locator("summary").click();
    await page.getByText(/Current reply handling/i).waitFor();
    await page.getByText(/Live replies sent/i).waitFor();
    const proofLinks = await page.locator(".submission-proof-link-card").count();
    ensure(proofLinks >= 2, `Expected at least 2 business-request proof links, found ${proofLinks}.`);
    await proofDisclosure.locator("summary").click();
    const desktopBusinessSubmitScreenshot = await saveScreenshot(page, "desktop-business-submit.png");
    await page.getByLabel("Business name").fill(businessName);
    await page.getByRole("button", { name: /Next question/i }).click();
    await page.getByText(/Question 2 of 3/i).waitFor();
    await page.getByLabel("Neighborhood").fill("Gastown");
    await page.getByRole("button", { name: /Next question/i }).click();
    await page.getByText(/Question 3 of 3/i).waitFor();
    await page.getByLabel("Reply email").fill("hello@smoke-bistro.example");
    await page.getByRole("button", { name: /^Next$/i }).click();
    await page.getByLabel("What you want help with").waitFor();
    await page.getByLabel("What you want help with").fill("Smoke test request for local visibility help.");
    await page.getByRole("button", { name: /^Next$/i }).click();
    await page.locator(".submission-review-card").getByText(/^Ready to send$/i).waitFor();
    const packageInterest = await page.getByLabel("Package direction").inputValue();
    ensure(
      packageInterest === "signature_partner",
      `Expected signature_partner query prefill, got "${packageInterest}".`,
    );
    await page.getByLabel("Category").fill("Restaurant");
    await page.getByLabel("Website or Instagram").fill("https://smoke-bistro.example");
    await page.getByLabel("Contact name").fill("Jordan");
    const backupDisclosure = page
      .locator(".submission-support-disclosure")
      .filter({ hasText: /If your email app does not open/i });
    await backupDisclosure.locator("summary").click();
    await page.getByRole("button", { name: /Copy request/i }).click();
    await page.getByText(/Copied\./i).waitFor();
    await page.getByRole("button", { name: /Save for later/i }).click();
    await page.getByText(/We got your request on this device/i).waitFor();
    await page.getByRole("link", { name: /Open request status/i }).waitFor();
    const savedDraftDisclosure = page
      .locator(".submission-support-disclosure")
      .filter({ hasText: /Saved drafts on this device/i });
    await savedDraftDisclosure.locator("summary").click();
    await savedDraftDisclosure.getByText(businessName).waitFor();

    return {
      route: "/for-businesses/submit",
      businessName,
      screenshot: desktopBusinessSubmitScreenshot,
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

    const adminHoldText = await page.locator("body").innerText();
    if (/operator console is intentionally stripped from this build/i.test(adminHoldText)) {
      return {
        route: "/admin",
        access: "held",
        screenshot: await saveScreenshot(page, "desktop-admin-held.png"),
      };
    }

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
    const adminHoldText = await page.locator("body").innerText();
    if (/operator console is intentionally stripped from this build/i.test(adminHoldText)) {
      return {
        route: "/admin",
        access: "held",
      };
    }
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
    const adminHoldText = await page.locator("body").innerText();
    if (/operator console is intentionally stripped from this build/i.test(adminHoldText)) {
      return {
        route: "/admin",
        access: "held",
        screenshot: await saveScreenshot(page, "desktop-admin.png"),
      };
    }
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
    await page.getByRole("heading", { level: 1, name: /What kind of day is it\?/i }).waitFor();
    const pickerChoiceCount = await page.locator(".city-door-card").count();
    ensure(pickerChoiceCount >= 5, `Expected at least 5 mobile city-door choices, found ${pickerChoiceCount}.`);

    return {
      route: "/vancouver",
      screenshot: await saveScreenshot(page, "mobile-city.png"),
    };
  });

  await runStep(steps, "mobile Toronto pilot render", async () => {
    await page.goto(`${baseUrl}/toronto/guides/where-should-a-first-time-toronto-visitor-start`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", {
      level: 1,
      name: /What do you want to do first\?/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Open example (route|plan)|Open route map|Plan preview|Route preview|Toronto First Arrival Loop/i.test(bodyText),
      "Mobile Toronto first-visit guide did not show the plan handoff.",
    );
    await page.locator('a[href="/toronto/missions#mission-toronto-first-arrival-loop"]').first().click();
    await page.waitForURL(/\/toronto\/missions#mission-toronto-first-arrival-loop$/);
    await ensureFeaturedRoute(
      page,
      /Toronto First Arrival Loop/i,
      "Mobile Toronto missions page did not feature the clicked first-arrival route after guide handoff.",
    );

    return {
      route: "/toronto/missions#mission-toronto-first-arrival-loop",
      screenshot: await saveScreenshot(page, "mobile-toronto-pilot.png"),
    };
  });

  await runStep(steps, "mobile Toronto weekend render", async () => {
    await page.goto(`${baseUrl}/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", {
      level: 1,
      name: /What do you want to do first\?/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Open route with map|Open (saved |example )?plan( with map)?|Plan preview|Route preview|Toronto Weekend Waterfront Loop/i.test(bodyText),
      "Mobile Toronto weekend guide did not show the plan handoff.",
    );
    await page.locator('a[href="/toronto/missions#mission-toronto-weekend-waterfront-loop"]').first().click();
    await page.waitForURL(/\/toronto\/missions#mission-toronto-weekend-waterfront-loop$/);
    await ensureFeaturedRoute(
      page,
      /Toronto Weekend Waterfront Loop/i,
      "Mobile Toronto missions page did not feature the clicked weekend route after guide handoff.",
    );

    return {
      route: "/toronto/missions#mission-toronto-weekend-waterfront-loop",
      screenshot: await saveScreenshot(page, "mobile-toronto-weekend.png"),
    };
  });

  await runStep(steps, "mobile guide library render", async () => {
    await page.goto(`${baseUrl}/vancouver/guides`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /What do you need today/i,
    }).waitFor();
    const guideDoorCount = await page.locator(".guide-door-photo img").count();
    ensure(guideDoorCount >= 3, `Expected 3 mobile image-backed guide door choices, found ${guideDoorCount}.`);

    return {
      route: "/vancouver/guides",
      screenshot: await saveScreenshot(page, "mobile-guide-library.png"),
    };
  });

  await runStep(steps, "mobile about render", async () => {
    await page.goto(`${baseUrl}/about`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Cities should feel easier to love/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Dear city wanderer|The CityAtlas founder|What CityAtlas believes/i.test(bodyText),
      "Mobile about page did not render the founder-letter story.",
    );

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
      name: /What do you want to do first\?/i,
    }).waitFor();

    return {
      route: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
      screenshot: await saveScreenshot(page, "mobile-guide-detail.png"),
    };
  });

  await runStep(steps, "mobile neighborhood chooser route preview", async () => {
    await page.goto(`${baseUrl}/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", {
      level: 1,
      name: /What do you want to do first\?/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Open example (route|plan)|Open route map|Route ready now|Plan ready now|Example (route|plan) preview|Plan preview/i.test(bodyText),
      "Neighborhood chooser did not render the plan preview handoff.",
    );

    return {
      route: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
      screenshot: await saveScreenshot(page, "mobile-neighborhood-chooser-guide.png"),
    };
  });

  await runStep(steps, "mobile cafe guide route preview", async () => {
    await page.goto(`${baseUrl}/vancouver/guides/how-to-pick-a-work-friendly-vancouver-cafe`, {
      waitUntil: navigationWaitUntil,
    });
    await page.getByRole("heading", {
      level: 1,
      name: /What do you want to do first\?/i,
    }).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /Open route with map|Open (saved |example )?plan( with map)?|Plan preview|Route preview|Focus Block Flex Route/i.test(bodyText),
      "Mobile cafe guide did not render the plan handoff.",
    );
    await page.locator('a[href="/vancouver/missions#mission-focus-block-flex"]').first().click();
    await page.waitForURL(/\/vancouver\/missions#mission-focus-block-flex$/);
    await ensureFeaturedRoute(
      page,
      /Focus Block Flex/i,
      "Mobile missions page did not feature the clicked focus-block route after cafe guide handoff.",
    );

    return {
      route: "/vancouver/missions#mission-focus-block-flex",
      screenshot: await saveScreenshot(page, "mobile-cafe-guide-route.png"),
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
    await page.locator(".mission-full-bleed-map-frame").waitFor();
    const firstChip = page.locator(".planner-chip").first();
    await firstChip.scrollIntoViewIfNeeded();
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
    await page.getByRole("heading", { level: 1, name: /Start a simple business request/i }).waitFor();
    await page.getByText(/Step 1 of 3/i).waitFor();
    await page.getByText(/Question 1 of 3/i).waitFor();
    await page.getByText(/What's your business called\?/i).waitFor();
    await page.getByText(/What the first reply can look like/i).waitFor();
    const proofDisclosure = page.locator(".submission-proof-disclosure");
    await proofDisclosure.getByText(/See live examples and current reply proof/i).waitFor();
    await proofDisclosure.locator("summary").click();
    await page.getByText(/Current reply handling/i).waitFor();
    await page.getByText(/Live replies sent/i).waitFor();
    const proofLinks = await page.locator(".submission-proof-link-card").count();
    ensure(proofLinks >= 2, `Expected at least 2 mobile business-request proof links, found ${proofLinks}.`);
    await proofDisclosure.locator("summary").click();
    await page.getByRole("button", { name: /Next question/i }).waitFor();
    await page.getByLabel("Business name").waitFor();
    ensure((await page.getByLabel("Neighborhood").count()) === 0, "Neighborhood should stay hidden until question 2.");
    ensure((await page.getByLabel("Reply email").count()) === 0, "Reply email should stay hidden until question 3.");

    return {
      route: "/for-businesses/submit",
      screenshot: await saveScreenshot(page, "mobile-business-submit.png"),
    };
  });

  await runStep(steps, "mobile business pricing render", async () => {
    await page.goto(`${baseUrl}/for-businesses/pricing`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Get found by Vancouver locals/i,
    }).waitFor();
    await page.getByText(/\$0 - Today/i).waitFor();
    await page.getByText(/See the real CityAtlas output first/i).waitFor();
    await page.getByText(/Current reply proof/i).waitFor();
    await page.getByText(/Live replies sent/i).waitFor();
    const pathCards = await page.locator(".pricing-path-card").count();
    ensure(pathCards >= 1, `Expected a free-first pricing boundary card on mobile, found ${pathCards}.`);
    const proofExamples = await page.locator(".pricing-output-preview-card-link").count();
    ensure(proofExamples >= 2, `Expected at least 2 mobile live proof examples on pricing, found ${proofExamples}.`);
    const packageDisclosure = page.locator("#pricing-paid-options summary").first();
    if (await packageDisclosure.count()) {
      await packageDisclosure.scrollIntoViewIfNeeded();
      await packageDisclosure.click();
    }
    const packageCards = await page.locator(".pricing-choice-card").count();
    ensure(packageCards >= 3, `Expected at least 3 pricing cards on mobile after opening options, found ${packageCards}.`);

    return {
      route: "/for-businesses/pricing",
      packageCards,
      screenshot: await saveScreenshot(page, "mobile-business-pricing.png"),
    };
  });

  await runStep(steps, "mobile business fit call render", async () => {
    await page.goto(`${baseUrl}/for-businesses/book-call`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /Book a short CityAtlas fit call/i,
    }).waitFor();
    await page.getByText(/Current reply proof/i).waitFor();
    await page.getByText(/Live replies sent/i).waitFor();
    const packageValue = await page.getByLabel("Package, if you already know").inputValue();
    ensure(
      packageValue === "",
      `Expected no default package on the mobile fit-call page, got "${packageValue}".`,
    );

    return {
      route: "/for-businesses/book-call",
      screenshot: await saveScreenshot(page, "mobile-business-book-call.png"),
    };
  });

  await runStep(steps, "mobile partner preview render", async () => {
    await page.goto(`${baseUrl}/for-businesses/partner-preview`, { waitUntil: navigationWaitUntil });
    await page.getByRole("heading", {
      level: 1,
      name: /See what CityAtlas can already build for a local business/i,
    }).waitFor();
    await page.getByText(/Current reply proof/i).waitFor();
    await page.getByText(/Live replies sent/i).waitFor();
    const bodyText = await page.locator("body").innerText();
    ensure(
      /host(ed)? (meal|visit|experience)|host a visit or service|hosted meal, service, walkthrough, or offering/i.test(bodyText),
      "Mobile partner preview did not explain the hosted experience ask.",
    );
    ensure(
      /first reply is a fit note|Paid packages stay optional|free reviewed request/i.test(bodyText),
      "Mobile partner preview did not render the request-first or paid-optional framing.",
    );
    const proofCards = await page.locator(".partner-proof-card").count();
    ensure(proofCards >= 2, `Expected at least 2 mobile partner-preview proof example cards, found ${proofCards}.`);

    return {
      route: "/for-businesses/partner-preview",
      screenshot: await saveScreenshot(page, "mobile-partner-preview.png"),
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

    const adminHoldText = await page.locator("body").innerText();
    if (/operator console is intentionally stripped from this build/i.test(adminHoldText)) {
      return {
        route: "/admin",
        access: "held",
        screenshot: await saveScreenshot(page, "mobile-admin.png"),
      };
    }

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
