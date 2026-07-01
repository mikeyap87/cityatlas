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
const useExistingServer = process.env.CITYATLAS_PAID_TRAFFIC_USE_EXISTING_SERVER === "1";
const navigationWaitUntil = useExistingServer ? "domcontentloaded" : "networkidle";
const ANALYTICS_CONSENT_STORAGE_KEY = "cityatlas.analytics.consent.v1";
const ANALYTICS_SCRIPT_ID = "cityatlas-ga4-script";
const TRAFFIC_CONTEXT_STORAGE_KEY = "cityatlas.traffic.context.v1";
const landingPath = "/?utm_source=paid_test&utm_medium=cpc&utm_campaign=city_partner_qa&utm_content=hero_business_cta";

const requiredEvents = [
  "page_view",
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

async function readAnalyticsRuntimeReadiness(page) {
  return page.evaluate(() => window.__cityatlasAnalyticsReadiness ?? null);
}

async function readPersistedData(page) {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem("cityatlas.launch.package.v1");
    return raw ? JSON.parse(raw) : null;
  });
}

async function readAnalyticsProof(page) {
  return page.evaluate(({ consentKey, scriptId }) => {
    const dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
    const toTuple = (entry) => {
      if (Array.isArray(entry)) return entry;
      if (entry && typeof entry === "object" && "length" in entry) {
        return Array.from(entry);
      }
      return null;
    };
    const hasTuple = (matcher) =>
      dataLayer.some((entry) => {
        const tuple = toTuple(entry);
        return Boolean(tuple) && matcher(tuple);
      });

    return {
      consentState: window.localStorage.getItem(consentKey),
      bannerVisible: Boolean(document.querySelector('[aria-label="Analytics choice"]')),
      scriptInjected: Boolean(document.getElementById(scriptId)),
      configuredMeasurementId: window.__cityatlasAnalyticsState?.configuredMeasurementId ?? "",
      consentUpdated: hasTuple((entry) => entry[0] === "consent" && entry[1] === "update"),
      configured: hasTuple((entry) => entry[0] === "config"),
      pageViewForwarded: hasTuple((entry) => entry[0] === "event" && entry[1] === "page_view"),
    };
  }, { consentKey: ANALYTICS_CONSENT_STORAGE_KEY, scriptId: ANALYTICS_SCRIPT_ID });
}

async function main() {
  const server = useExistingServer
    ? null
    : startVitePreviewServer({
      root,
      port: previewPort,
    });
  const { chromium } = loadPlaywright();
  const failures = [];
  const blockers = [];
  const warnings = [];
  const analyticsProof = {
    externalDestinationConfigured: hasExternalAnalyticsDestination(),
    runtimeReadiness: null,
    bannerVisibleBeforeConsent: false,
    scriptInjectedBeforeConsent: false,
    bannerVisibleAfterConsent: false,
    consentStoredAfterChoice: false,
    scriptInjectedAfterConsent: false,
    configuredAfterConsent: false,
    pageViewForwardedAfterConsent: false,
  };
  let browser;

  mkdirSync(outputDir, { recursive: true });

  try {
    if (!useExistingServer) {
      await waitForServer(baseUrl, () => (server ? server.getLogs() : "Using an existing preview server."));
    }
    browser = await chromium.launch({
      headless: true,
      channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || undefined,
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
      colorScheme: "light",
    });
    try {
      await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseUrl });
    } catch {
      warnings.push("Browser did not allow clipboard-read permission for request-copy attribution proof.");
    }
    await context.addInitScript(() => {
      window.localStorage.removeItem("cityatlas.launch.package.v1");
      window.localStorage.removeItem("cityatlas.traffic.context.v1");
      window.localStorage.removeItem("cityatlas.analytics.debug.v1");
      window.localStorage.removeItem("cityatlas.analytics.consent.v1");
    });

    const page = await context.newPage();
    if (useExistingServer) {
      await page.goto(`${baseUrl}/`, { waitUntil: navigationWaitUntil });
      await page.evaluate(
        ({ contextKey, path }) => {
          const url = new URL(path, window.location.origin);
          window.localStorage.setItem(
            contextKey,
            JSON.stringify({
              firstLandingPath: url.pathname,
              latestLandingPath: `${url.pathname}${url.search}`,
              referrer: "direct",
              utm_source: url.searchParams.get("utm_source") || "",
              utm_medium: url.searchParams.get("utm_medium") || "",
              utm_campaign: url.searchParams.get("utm_campaign") || "",
              utm_content: url.searchParams.get("utm_content") || "",
              utm_term: url.searchParams.get("utm_term") || "",
            }),
          );
          window.history.replaceState({}, "", path);
        },
        { contextKey: TRAFFIC_CONTEXT_STORAGE_KEY, path: landingPath },
      );
    } else {
      await page.goto(`${baseUrl}${landingPath}`, { waitUntil: navigationWaitUntil });
    }

    const runtimeReadiness = await readAnalyticsRuntimeReadiness(page);
    const externalDestinationConfigured =
      Boolean(runtimeReadiness?.hasExternalDestination) || hasExternalAnalyticsDestination();

    analyticsProof.externalDestinationConfigured = externalDestinationConfigured;
    analyticsProof.runtimeReadiness = runtimeReadiness;

    if (externalDestinationConfigured) {
      await page.getByLabel("Analytics choice").waitFor();
      const beforeConsent = await readAnalyticsProof(page);
      analyticsProof.bannerVisibleBeforeConsent = beforeConsent.bannerVisible;
      analyticsProof.scriptInjectedBeforeConsent = beforeConsent.scriptInjected;

      if (!beforeConsent.bannerVisible) {
        noteFailure(failures, "analytics consent", "Consent banner did not appear when external analytics was configured.");
      }

      if (beforeConsent.scriptInjected) {
        noteFailure(failures, "analytics consent", "Analytics script loaded before consent.");
      }

      await page.getByRole("button", { name: /Allow analytics/i }).click();
      await page.waitForFunction(
        ({ consentKey, scriptId }) =>
          window.localStorage.getItem(consentKey) === "granted" &&
          Boolean(document.getElementById(scriptId)),
        { consentKey: ANALYTICS_CONSENT_STORAGE_KEY, scriptId: ANALYTICS_SCRIPT_ID },
      );

      const afterConsent = await readAnalyticsProof(page);
      analyticsProof.bannerVisibleAfterConsent = afterConsent.bannerVisible;
      analyticsProof.consentStoredAfterChoice = afterConsent.consentState === "granted";
      analyticsProof.scriptInjectedAfterConsent = afterConsent.scriptInjected;
      analyticsProof.configuredAfterConsent =
        afterConsent.configured && afterConsent.consentUpdated && Boolean(afterConsent.configuredMeasurementId);
      analyticsProof.pageViewForwardedAfterConsent = afterConsent.pageViewForwarded;

      if (afterConsent.bannerVisible) {
        noteFailure(failures, "analytics consent", "Consent banner stayed visible after allowing analytics.");
      }

      if (!afterConsent.configured || !afterConsent.consentUpdated || !afterConsent.scriptInjected) {
        noteFailure(failures, "analytics consent", "Analytics was not fully configured after consent.");
      }

      if (!afterConsent.pageViewForwarded) {
        noteFailure(failures, "analytics consent", "Granting consent did not forward the landing page view.");
      }
    }

    await page.getByRole("link", { name: "For businesses" }).click();
    await page.waitForURL(`${baseUrl}/for-businesses/pricing`);
    await page.getByRole("link", { name: /Request City Partner review|Start with City Partner|Start City Partner request/i }).click();
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
    await page.getByRole("button", { name: /Copy request/i }).click();
    await page.getByText(/Copied\./i).waitFor();
    let copiedRequestText = "";
    try {
      copiedRequestText = await page.evaluate(async () => {
        if (!window.navigator.clipboard?.readText) {
          return "";
        }
        return window.navigator.clipboard.readText();
      });
    } catch {
      warnings.push("Browser could not read the copied request text for campaign-attribution proof.");
    }
    await page.getByRole("button", { name: /Save for later/i }).click();
    await page.getByText(/Your request is saved on this device/i).waitFor();
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

    if (copiedRequestText) {
      const copiedRequestHasCampaignContext =
        copiedRequestText.includes("Campaign / referral context:") &&
        copiedRequestText.includes("UTM source: paid_test") &&
        copiedRequestText.includes("UTM medium: cpc") &&
        copiedRequestText.includes("UTM campaign: city_partner_qa");

      if (!copiedRequestHasCampaignContext) {
        noteFailure(
          failures,
          "request attribution",
          "Copied business request did not include paid-campaign context.",
        );
      }
    } else {
      warnings.push("Copied request attribution was not directly readable in this browser run.");
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

    if (!externalDestinationConfigured) {
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
      measurementReady: externalDestinationConfigured,
      failures,
      blockers,
      warnings,
      proof: {
        screenshot: "output/qa/paid-traffic-business-request.png",
        savedBusinessRequest: submissions.some(
          (submission) => submission.businessName === "Paid Traffic QA Bistro",
        ),
        capturedEvents: eventNames,
        analytics: analyticsProof,
        copiedRequestHasCampaignContext: copiedRequestText
          ? copiedRequestText.includes("UTM campaign: city_partner_qa")
          : null,
      },
      revenueStory: {
        trafficSource: "Business-side paid traffic to the Vancouver business offer.",
        landingPromise: "Make a Vancouver business easier to find through one clearer page, guide fit, or offer.",
        firstUsefulMoment: "The business submits one clear request with package interest and contact path.",
        primaryAsk: "Start a business request.",
        revenueEvent:
          "Qualified request that can be reviewed and converted manually, while hosted checkout exists for clear package choices.",
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
      measurementReady: analyticsProof.externalDestinationConfigured,
      failures,
      blockers,
      warnings,
      proof: {
        analytics: analyticsProof,
      },
    };
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log("CityAtlas paid-traffic readiness");
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
    server?.child.kill("SIGTERM");
  }
}

await main();
