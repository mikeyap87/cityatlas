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
const baseUrl = `http://127.0.0.1:${previewPort}`;
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

function attachRuntimeCapture(page, bucket) {
  page.on("pageerror", (error) => {
    bucket.pageErrors.push(error.message);
  });
  page.on("requestfailed", (request) => {
    const url = request.url();
    if (url.startsWith(baseUrl)) {
      bucket.requestFailures.push(`${url} :: ${request.failure()?.errorText ?? "request failed"}`);
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
  await page.screenshot({ path, fullPage: true });
  return `output/qa/local-product-smoke/${fileName}`;
}

async function runStep(steps, name, fn) {
  try {
    const detail = await fn();
    steps.push({
      name,
      status: "passed",
      ...detail,
    });
  } catch (error) {
    steps.push({
      name,
      status: "failed",
      error: noteFailure(name, error),
    });
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

  await runStep(steps, "desktop home newsletter save", async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    const heroHeading = (await page.locator("h1").first().innerText()).trim();
    ensure(/vancouver/i.test(heroHeading), `Homepage hero heading should mention Vancouver, got "${heroHeading}".`);

    await page.getByLabel("Email address").fill("smoke-cityatlas@example.com");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.locator(".referral-box code").waitFor();
    const referralCode = (await page.locator(".referral-box code").textContent())?.trim();
    ensure(Boolean(referralCode), "Homepage newsletter save did not reveal a referral code.");

    return {
      route: "/",
      referralCode,
      screenshot: await saveScreenshot(page, "desktop-home.png"),
    };
  });

  await runStep(steps, "desktop home map and search", async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.locator(".map-stop-kits").click();
    await page.waitForURL(`${baseUrl}/vancouver/kitsilano-scenic-starters`);
    const mapBodyText = await page.locator("body").innerText();
    ensure(/kitsilano/i.test(mapBodyText), "Homepage route map did not open the Kitsilano page.");

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
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
    await page.goto(`${baseUrl}/vancouver`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1, name: /Explore Vancouver/i }).waitFor();
    await page.getByRole("link", { name: /Open Kitsilano/i }).click();
    await page.waitForURL(`${baseUrl}/vancouver/kitsilano-scenic-starters`);
    const bodyText = await page.locator("body").innerText();
    ensure(/kitsilano/i.test(bodyText), "Kitsilano starters route did not render recognizable Kitsilano text.");

    return {
      route: "/vancouver/kitsilano-scenic-starters",
      screenshot: await saveScreenshot(page, "desktop-kitsilano-starters.png"),
    };
  });

  await runStep(steps, "desktop Toronto pilot navigation", async () => {
    await page.goto(`${baseUrl}/toronto/guides`, { waitUntil: "networkidle" });
    await page.getByRole("heading", {
      level: 1,
      name: /Toronto guide preview and official source route pages/i,
    }).waitFor();
    await page.getByRole("link", { name: /First-time visitor starting points/i }).click();
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
    await page.goto(`${baseUrl}/toronto/guides`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: /Toronto weekend starting points/i }).click();
    await page.waitForURL(`${baseUrl}/toronto/weekend-route-starters`);
    await page.getByRole("link", { name: /Read the Toronto weekend guide/i }).click();
    await page.waitForURL(`${baseUrl}/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`);
    const bodyText = await page.locator("body").innerText();
    ensure(/Toronto weekend route/i.test(bodyText), "Toronto weekend guide did not render recognizable weekend-route copy.");

    return {
      route: "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
      screenshot: await saveScreenshot(page, "desktop-toronto-weekend.png"),
    };
  });

  await runStep(steps, "desktop planner save and share", async () => {
    await page.goto(`${baseUrl}/planner`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1, name: /Build a Vancouver itinerary/i }).waitFor();
    const firstChip = page.locator(".planner-chip").first();
    const chipLabel = (await firstChip.locator("span").innerText()).trim();
    ensure(Boolean(chipLabel), "Planner did not expose a saveable chip label.");
    await firstChip.click();
    await page.locator(".saved-row").filter({ hasText: chipLabel }).waitFor();
    await page.getByRole("button", { name: /Prepare share text/i }).click();
    await page.locator(".local-success").waitFor();
    const successText = await page.locator(".local-success").innerText();
    ensure(
      /share draft prepared/i.test(successText),
      `Planner share draft message was not shown. Got "${successText}".`,
    );

    return {
      route: "/planner",
      savedItem: chipLabel,
      screenshot: await saveScreenshot(page, "desktop-planner.png"),
    };
  });

  await runStep(steps, "desktop business request save", async () => {
    const businessName = "Smoke Test Bistro";
    await page.goto(`${baseUrl}/for-businesses/submit?package=signature_partner`, {
      waitUntil: "networkidle",
    });
    await page.getByRole("heading", { level: 1, name: /Start a CityAtlas business request/i }).waitFor();
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
    await page.getByLabel("Notes for review").fill("Smoke test request for local review flow.");
    await page.getByRole("button", { name: /Save review request/i }).click();
    await page.locator(".submission-row").filter({ hasText: businessName }).waitFor();

    return {
      route: "/for-businesses/submit",
      businessName,
      screenshot: await saveScreenshot(page, "desktop-business-submit.png"),
    };
  });

  await runStep(steps, "desktop private preview render", async () => {
    await page.goto(`${baseUrl}/private-preview/date-night`, { waitUntil: "networkidle" });
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
    const businessMachinePanel = page
      .locator("article.admin-panel.large")
      .filter({ hasText: "No-send business prospect queue" })
      .first();
    const csv = [
      "businessName,email,contactName,cityName,neighborhood,category,segment,sourceLabel,sourceUrl,website,contactPath,notes,relationshipWarmth",
      `${importedBusinessName},hello@smokegallery.example,Taylor,Vancouver,Mount Pleasant,Gallery,Arts venue,Manual source,https://smokegallery.example,https://smokegallery.example,https://smokegallery.example/contact,Smoke import row for local QA,medium`,
    ].join("\n");

    await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1, name: /CityAtlas launch readiness/i }).waitFor();
    await page.getByLabel("EXA or manual research rows").fill(csv);
    const previewSummary = page.locator(".prospect-import-preview strong").first();
    await previewSummary.waitFor();
    const previewText = await previewSummary.innerText();
    ensure(
      /1\/1 rows are safe to add locally/i.test(previewText),
      `Import preview did not report a safe row. Got "${previewText}".`,
    );

    await page.getByRole("button", { name: /Add importable rows to local queue/i }).click();
    await page.waitForFunction(() => {
      const field = document.querySelector('textarea[placeholder*="businessName,email"]');
      return field instanceof HTMLTextAreaElement && field.value === "";
    });
    ensure(
      !(await page.locator(".prospect-import-preview").isVisible().catch(() => false)),
      "Import preview should close after adding the importable row.",
    );
    await page.waitForFunction((businessName) =>
      Array.from(document.querySelectorAll(".business-prospect-row")).some((row) =>
        row.textContent?.includes(String(businessName)),
      ),
    importedBusinessName);
    await page.getByLabel("Queue focus").selectOption("email_ready");
    await page.getByText(/Vancouver queue focus: Email-ready/i).waitFor();
    await page.getByLabel("Review city").selectOption("toronto");
    await page.getByText(/Toronto queue focus: Email-ready/i).waitFor();
    await page.getByLabel("Queue focus").selectOption("contact_path_ready");
    await page.getByText(/Toronto queue focus: Contact-path review/i).waitFor();
    await page.getByLabel("Review city").selectOption("vancouver");
    await page.getByLabel("Queue focus").selectOption("promotion_candidates");
    await page.getByText(/Vancouver queue focus: Promotion candidates/i).waitFor();
    await page.getByLabel("Queue focus").selectOption("all");
    await page.getByText(/Vancouver queue focus: All rows/i).waitFor();

    return {
      route: "/admin",
      importedBusinessName,
    };
  });

  await runStep(steps, "desktop admin reply log", async () => {
    const replySummary = "Smoke test reply summary for local QA.";
    const nextStep = "Keep this in local review only after smoke.";
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
    const before = await page.locator(".brain-run-row").count();
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

  await context.close();
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
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.locator("h1").first().waitFor();
    const heading = (await page.locator("h1").first().innerText()).trim();
    ensure(/vancouver/i.test(heading), `Mobile homepage heading should mention Vancouver, got "${heading}".`);

    return {
      route: "/",
      screenshot: await saveScreenshot(page, "mobile-home.png"),
    };
  });

  await runStep(steps, "mobile Toronto pilot render", async () => {
    await page.goto(`${baseUrl}/toronto/first-time-visitor-starters`, { waitUntil: "networkidle" });
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
    await page.goto(`${baseUrl}/toronto/weekend-route-starters`, { waitUntil: "networkidle" });
    await page.getByRole("heading", {
      level: 1,
      name: /Toronto weekend route starting points/i,
    }).waitFor();

    return {
      route: "/toronto/weekend-route-starters",
      screenshot: await saveScreenshot(page, "mobile-toronto-weekend.png"),
    };
  });

  await runStep(steps, "mobile planner render and save", async () => {
    await page.goto(`${baseUrl}/planner`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1, name: /Build a Vancouver itinerary/i }).waitFor();
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
    await page.goto(`${baseUrl}/for-businesses/submit`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1, name: /Start a CityAtlas business request/i }).waitFor();
    await page.getByRole("button", { name: /Save review request/i }).waitFor();

    return {
      route: "/for-businesses/submit",
      screenshot: await saveScreenshot(page, "mobile-business-submit.png"),
    };
  });

  await runStep(steps, "mobile admin render", async () => {
    await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1, name: /CityAtlas launch readiness/i }).waitFor();
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
    await page.goto(`${baseUrl}/private-preview/date-night`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1, name: /Vancouver Date Night route preview/i }).waitFor();

    return {
      route: "/private-preview/date-night",
      screenshot: await saveScreenshot(page, "mobile-private-preview.png"),
    };
  });

  await context.close();
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
      channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || "chrome",
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
      await browser.close();
    }
    server?.child.kill("SIGTERM");
  }
}

await main();
