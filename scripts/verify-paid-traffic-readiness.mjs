import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadPlaywright,
  startVitePreviewServer,
  waitForServer,
} from "./browser-proof-support.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/qa");
const screenshotPath = join(outputDir, "paid-traffic-business-request.png");
const reportPath = join(outputDir, "paid-traffic-readiness.json");
const previewPort = Number(process.env.CITYATLAS_PAID_TRAFFIC_PORT || "4281");
const baseUrl = `http://127.0.0.1:${previewPort}`;
const strict = process.argv.includes("--strict");

const requiredEvents = [
  "page_view",
  "business_funnel_cta_clicked",
  "business_pricing_viewed",
  "business_package_cta_clicked",
  "business_request_form_viewed",
  "business_submission_saved",
  "business_request_saved_for_later",
];

function hasExternalAnalyticsDestination() {
  const hasMeasurementId = Boolean(process.env.VITE_GA_MEASUREMENT_ID || process.env.VITE_ANALYTICS_ID);
  const provider = process.env.VITE_CITYATLAS_ANALYTICS_PROVIDER || (hasMeasurementId ? "ga4" : "");
  return Boolean(provider && hasMeasurementId);
}

function noteFailure(failures, scope, error) {
  const message = error instanceof Error ? error.message : String(error);
  failures.push(`${scope}: ${message}`);
}

function eventExists(events, name, predicate = () => true) {
  return events.some((event) => event.name === name && predicate(event));
}

async function readPersistedData(page) {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem("cityatlas.launch.package.v1");
    return raw ? JSON.parse(raw) : null;
  });
}

async function main() {
  const server = startVitePreviewServer({
    root,
    port: previewPort,
  });
  const { chromium } = loadPlaywright();
  const failures = [];
  const blockers = [];
  const warnings = [];
  let browser;

  mkdirSync(outputDir, { recursive: true });

  try {
    await waitForServer(baseUrl, () => server.getLogs());
    browser = await chromium.launch({
      headless: true,
      channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || undefined,
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
      colorScheme: "light",
    });
    await context.addInitScript(() => {
      window.localStorage.removeItem("cityatlas.launch.package.v1");
      window.localStorage.removeItem("cityatlas.traffic.context.v1");
      window.localStorage.removeItem("cityatlas.analytics.debug.v1");
    });

    const page = await context.newPage();
    await page.goto(
      `${baseUrl}/?utm_source=paid_test&utm_medium=cpc&utm_campaign=city_partner_qa&utm_content=hero_business_cta`,
      { waitUntil: "networkidle" },
    );

    await page.getByRole("link", { name: /For Vancouver businesses/i }).click();
    await page.waitForURL(`${baseUrl}/for-businesses/pricing`);
    await page.getByRole("link", { name: /Start with City Partner/i }).click();
    await page.waitForURL(`${baseUrl}/for-businesses/submit?package=city_partner`);

    await page.getByLabel("Business name").fill("Paid Traffic QA Bistro");
    await page.getByLabel("Category").fill("Restaurant");
    await page.getByLabel("Neighborhood").fill("Kitsilano");
    await page.getByLabel("Website or Instagram").fill("https://paid-traffic-qa.example");
    await page.getByLabel("Contact name").fill("Taylor");
    await page.getByLabel("Email").fill("hello@paid-traffic-qa.example");
    await page
      .getByLabel("What you want help with")
      .fill("We want a stronger Kitsilano page, better guide placement, and one clear launch offer.");
    await page.getByRole("button", { name: /Save draft for later/i }).click();
    await page.getByText(/Your draft is saved in this browser/i).waitFor();
    await page.locator(".submission-row").filter({ hasText: "Paid Traffic QA Bistro" }).waitFor();
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await page.waitForFunction(() => {
      const raw = window.localStorage.getItem("cityatlas.launch.package.v1");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return (
        Array.isArray(parsed.submissions) &&
        parsed.submissions.some((submission) => submission.businessName === "Paid Traffic QA Bistro") &&
        Array.isArray(parsed.growthEvents) &&
        parsed.growthEvents.length >= 6
      );
    });

    const persisted = await readPersistedData(page);
    const growthEvents = persisted?.growthEvents ?? [];
    const submissions = persisted?.submissions ?? [];
    const eventNames = growthEvents.map((event) => event.name);
    const missingEvents = requiredEvents.filter((eventName) => !eventNames.includes(eventName));

    if (missingEvents.length > 0) {
      noteFailure(failures, "conversion event coverage", `Missing events: ${missingEvents.join(", ")}`);
    }

    if (
      !eventExists(
        growthEvents,
        "page_view",
        (event) => event.detail?.utm_source === "paid_test" && event.detail?.utm_campaign === "city_partner_qa",
      )
    ) {
      noteFailure(failures, "campaign attribution", "UTM context did not persist into page-view tracking.");
    }

    if (
      !eventExists(
        growthEvents,
        "business_package_cta_clicked",
        (event) => event.detail?.packageId === "city_partner",
      )
    ) {
      noteFailure(failures, "package intent", "City Partner package click was not captured.");
    }

    if (
      !submissions.some(
        (submission) =>
          submission.businessName === "Paid Traffic QA Bistro" &&
          submission.packageInterest === "city_partner",
      )
    ) {
      noteFailure(failures, "business request capture", "Business request was not saved with City Partner interest.");
    }

    if (!hasExternalAnalyticsDestination()) {
      blockers.push(
        "No external analytics destination is configured. Local event proof is useful for QA, but paid traffic needs real visitor and conversion measurement.",
      );
    }

    blockers.push(
      "Hosted ad-landing proof is not verified by this local command. Run hosted smoke after an approved deploy before buying traffic.",
    );

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      strict,
      paidTrafficReady: failures.length === 0 && blockers.length === 0,
      localBusinessFunnelPassed: failures.length === 0,
      measurementReady: hasExternalAnalyticsDestination(),
      failures,
      blockers,
      warnings,
      proof: {
        screenshot: "output/qa/paid-traffic-business-request.png",
        savedBusinessRequest: submissions.some(
          (submission) => submission.businessName === "Paid Traffic QA Bistro",
        ),
        capturedEvents: eventNames,
      },
      revenueStory: {
        trafficSource: "Business-side paid traffic to the Vancouver business offer.",
        landingPromise: "Make a Vancouver business easier to find through one clearer page, guide fit, or offer.",
        firstUsefulMoment: "The business submits one clear request with package interest and contact path.",
        primaryAsk: "Start a business request.",
        revenueEvent: "Qualified request that can be reviewed before payment opens.",
      },
    };

    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log("CityAtlas paid-traffic readiness");
    console.log(JSON.stringify(report, null, 2));

    if (failures.length > 0 || (strict && blockers.length > 0)) {
      process.exitCode = 1;
    }
  } catch (error) {
    noteFailure(failures, "paid traffic verifier", error);
    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      strict,
      paidTrafficReady: false,
      localBusinessFunnelPassed: false,
      measurementReady: hasExternalAnalyticsDestination(),
      failures,
      blockers,
      warnings,
    };
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log("CityAtlas paid-traffic readiness");
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
    server.child.kill("SIGTERM");
  }
}

await main();
