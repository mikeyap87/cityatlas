import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadPlaywright } from "./browser-proof-support.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/qa/live-analytics-proof");
const reportPath = join(outputDir, "network-summary.json");
const screenshotDir = join(outputDir, "network-proof");
const baseUrl = process.env.CITYATLAS_LIVE_BASE_URL || "https://city.univenturestudio.com";
const expectedMeasurementId =
  process.env.CITYATLAS_EXPECTED_GA_MEASUREMENT_ID ||
  process.env.VITE_GA_MEASUREMENT_ID ||
  process.env.VITE_ANALYTICS_ID ||
  "";
const consentKey = "cityatlas.analytics.consent.v1";
const resetGuardKey = "cityatlas.live.analytics.proof.reset.v1";
const analyticsDebugKey = "cityatlas.analytics.debug.v1";
const launchStorageKey = "cityatlas.launch.package.v1";
const requiredHostedFunnelEvents = [
  "business_pricing_viewed",
  "business_partner_preview_viewed",
  "business_partner_preview_cta_clicked",
  "business_request_saved_for_later",
];

function isAnalyticsScriptRequest(urlString) {
  try {
    const url = new URL(urlString);
    return url.hostname === "www.googletagmanager.com" && url.pathname === "/gtag/js";
  } catch {
    return false;
  }
}

function isAnalyticsCollectRequest(urlString) {
  try {
    const url = new URL(urlString);
    const isGoogleAnalyticsHost =
      url.hostname === "www.google-analytics.com" ||
      url.hostname === "google-analytics.com" ||
      url.hostname.endsWith(".google-analytics.com");
    return isGoogleAnalyticsHost && (url.pathname === "/g/collect" || url.pathname === "/collect");
  } catch {
    return false;
  }
}

function summarizeRequest(urlString, responseStatus = null) {
  try {
    const url = new URL(urlString);
    return {
      url: urlString,
      host: url.hostname,
      path: url.pathname,
      measurementId: url.searchParams.get("tid") || "",
      eventName: url.searchParams.get("en") || "",
      responseStatus,
    };
  } catch {
    return {
      url: urlString,
      host: "",
      path: "",
      measurementId: "",
      eventName: "",
      responseStatus,
    };
  }
}

async function waitForAnalyticsTraffic(events, predicate, timeoutMs = 15_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (predicate(events)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return predicate(events);
}

async function settleHostedPage(page, extraDelayMs = 1_500) {
  try {
    await page.waitForLoadState("load", { timeout: 10_000 });
  } catch {
    // Some hosted pages can keep secondary requests alive longer than the
    // core route load. Give the page a short settle window instead of hanging.
  }

  await page.waitForTimeout(extraDelayMs);
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

async function saveHostedScreenshot(page, fileName, screenshotFailures) {
  const relativePath = `output/qa/live-analytics-proof/network-proof/${fileName}`;

  try {
    await page.screenshot({
      path: join(screenshotDir, fileName),
      fullPage: false,
      timeout: 20_000,
    });

    return relativePath;
  } catch (error) {
    screenshotFailures.push({
      screenshot: relativePath,
      message: formatError(error),
    });

    return null;
  }
}

async function getHostedAnalyticsRuntimeState(page) {
  return page.evaluate((storageKey) => ({
    consentStored: window.localStorage.getItem(storageKey),
    analyticsReadiness: window.__cityatlasAnalyticsReadiness ?? null,
    hasGtag: typeof window.gtag === "function",
    hasDataLayer: Array.isArray(window.dataLayer),
    dataLayerLength: Array.isArray(window.dataLayer) ? window.dataLayer.length : 0,
    hasGoogleTagManager: Boolean(window.google_tag_manager),
    analyticsState: window.__cityatlasAnalyticsState ?? null,
    hasConsentBanner: Boolean(document.querySelector('[aria-label="Analytics choice"]')),
  }), consentKey);
}

async function getHostedDataLayerState(page) {
  return page.evaluate(() => {
    const dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
    const toTuple = (entry) => {
      if (Array.isArray(entry)) return entry;
      if (entry && typeof entry === "object" && "length" in entry) {
        return Array.from(entry);
      }
      return null;
    };
    const tuples = dataLayer
      .map((entry) => toTuple(entry))
      .filter((entry) => Array.isArray(entry));

    return {
      tupleCount: tuples.length,
      eventNames: tuples
        .filter((entry) => entry[0] === "event" && typeof entry[1] === "string")
        .map((entry) => entry[1]),
      configMeasurementIds: tuples
        .filter((entry) => entry[0] === "config" && typeof entry[1] === "string")
        .map((entry) => entry[1]),
      consentUpdates: tuples.filter((entry) => entry[0] === "consent").length,
    };
  });
}

async function grantAnalyticsConsent(page) {
  const before = await getHostedAnalyticsRuntimeState(page);
  if (before.consentStored === "granted") {
    return {
      method: "already-granted",
      before,
      after: before,
    };
  }

  const consentBanner = page.getByLabel("Analytics choice");
  try {
    await consentBanner.waitFor({ timeout: 6_000 });
    await page.getByRole("button", { name: /Allow analytics/i }).click();
    await page.waitForFunction(
      ([storageKey]) => window.localStorage.getItem(storageKey) === "granted",
      [consentKey],
    );

    return {
      method: "visible-banner",
      before,
      after: await getHostedAnalyticsRuntimeState(page),
    };
  } catch {
    // The live site can hide the banner if external analytics is not configured
    // or if the stored state has already moved past pending. Set consent directly
    // and reload so the proof can distinguish a missing GA destination from a UI timeout.
  }

  await page.evaluate((storageKey) => {
    window.localStorage.setItem(storageKey, "granted");
  }, consentKey);
  await page.reload({ waitUntil: "domcontentloaded" });
  await settleHostedPage(page);

  return {
    method: "storage-grant-reload",
    before,
    after: await getHostedAnalyticsRuntimeState(page),
  };
}

async function main() {
  const { chromium } = loadPlaywright();
  const analyticsEvents = [];
  const consoleMessages = [];
  const pageErrors = [];
  const screenshots = [];
  const screenshotFailures = [];
  const failures = [];
  const warnings = [];
  let googleTagManagerReady = false;
  let manualReconfiguredProbeObserved = false;
  let consentGrantResult = null;
  let browser;

  const capture = async (page, fileName) => {
    const screenshot = await saveHostedScreenshot(page, fileName, screenshotFailures);
    if (screenshot) {
      screenshots.push(screenshot);
    }
  };

  mkdirSync(outputDir, { recursive: true });
  mkdirSync(screenshotDir, { recursive: true });

  try {
    browser = await chromium.launch({
      headless: true,
      channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || undefined,
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
      colorScheme: "light",
    });

    context.on("request", (request) => {
      const url = request.url();
      if (!isAnalyticsScriptRequest(url) && !isAnalyticsCollectRequest(url)) {
        return;
      }

      analyticsEvents.push(
        summarizeRequest(url, "requested"),
      );
    });

    context.on("requestfinished", async (request) => {
      const url = request.url();
      if (!isAnalyticsScriptRequest(url) && !isAnalyticsCollectRequest(url)) {
        return;
      }

      const response = await request.response();
      analyticsEvents.push(
        summarizeRequest(url, response ? response.status() : null),
      );
    });

    context.on("requestfailed", (request) => {
      const url = request.url();
      if (!isAnalyticsScriptRequest(url) && !isAnalyticsCollectRequest(url)) {
        return;
      }

      analyticsEvents.push(
        summarizeRequest(url, `failed:${request.failure()?.errorText || "unknown"}`),
      );
    });

    await context.addInitScript(() => {
      try {
        if (window.location.origin !== "https://city.univenturestudio.com") {
          return;
        }

        if (!window.localStorage.getItem("cityatlas.live.analytics.proof.reset.v1")) {
          window.localStorage.removeItem("cityatlas.analytics.debug.v1");
          window.localStorage.removeItem("cityatlas.analytics.consent.v1");
          window.localStorage.removeItem("cityatlas.traffic.context.v1");
          window.localStorage.removeItem("cityatlas.launch.package.v1");
          window.localStorage.setItem("cityatlas.live.analytics.proof.reset.v1", "done");
        }
      } catch {
        // Ignore init-script storage errors so the hosted proof can continue.
      }
    });

    const page = await context.newPage();
    page.on("console", (message) => {
      consoleMessages.push({
        type: message.type(),
        text: message.text(),
      });
    });
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });
    await page.goto(
      `${baseUrl}/?utm_source=live_ga4_check&utm_medium=cpc&utm_campaign=cityatlas_live_measurement&utm_content=proof_run`,
      { waitUntil: "domcontentloaded" },
    );
    await settleHostedPage(page);
    await capture(page, "home-before-consent.png");

    const beforeConsentEventCount = analyticsEvents.length;
    consentGrantResult = await grantAnalyticsConsent(page);

    await waitForAnalyticsTraffic(
      analyticsEvents,
      (events) => events.some((event) => event.path === "/gtag/js"),
    );

    try {
      await page.waitForFunction(() => Boolean(window.google_tag_manager), undefined, { timeout: 10_000 });
      googleTagManagerReady = true;
    } catch {
      googleTagManagerReady = false;
    }

    await page.evaluate(() => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "cityatlas_debug_probe", {
          page_path: window.location.pathname,
          debug_mode: true,
        });
      }
    });

    await waitForAnalyticsTraffic(
      analyticsEvents,
      (events) => events.some((event) => event.eventName === "cityatlas_debug_probe"),
    );

    if (googleTagManagerReady) {
      await page.evaluate(() => {
        const measurementId = window.__cityatlasAnalyticsState?.configuredMeasurementId;
        if (!measurementId || typeof window.gtag !== "function") {
          return;
        }

        window.gtag("config", measurementId, {
          send_page_view: false,
          anonymize_ip: true,
        });
        window.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        window.gtag("event", "cityatlas_debug_probe_reconfigured", {
          page_path: window.location.pathname,
          debug_mode: true,
        });
      });

      manualReconfiguredProbeObserved = await waitForAnalyticsTraffic(
        analyticsEvents,
        (events) => events.some((event) => event.eventName === "cityatlas_debug_probe_reconfigured"),
      );
    }

    await capture(page, "home-after-consent.png");
    await page.goto(`${baseUrl}/for-businesses/pricing`, { waitUntil: "domcontentloaded" });
    await settleHostedPage(page);
    await capture(page, "pricing-after-consent.png");

    await page.goto(`${baseUrl}/for-businesses/partner-preview`, { waitUntil: "domcontentloaded" });
    await settleHostedPage(page);
    await page.getByRole("heading", { name: /How a CityAtlas business feature starts|What CityAtlas needs from a local partner/i }).waitFor();
    await capture(page, "partner-preview-after-consent.png");

    await waitForAnalyticsTraffic(
      analyticsEvents,
      (events) => events.some((event) => event.eventName === "business_partner_preview_viewed"),
    );

    await page.getByRole("link", { name: /Start business request|Start free review/i }).first().click();
    await page.waitForURL(/\/for-businesses\/submit/);

    await waitForAnalyticsTraffic(
      analyticsEvents,
      (events) => events.some((event) => event.eventName === "business_partner_preview_cta_clicked"),
    );

    await page.goto(`${baseUrl}/for-businesses/submit?package=city_partner`, { waitUntil: "domcontentloaded" });
    await settleHostedPage(page);
    await page.getByLabel("Business name").fill("Live Analytics Proof Bistro");
    await page.getByLabel("Category").fill("Restaurant");
    await page.getByLabel("Neighborhood").fill("Gastown");
    await page.getByLabel(/Website|Instagram/i).fill("https://live-analytics-proof.example");
    await page.getByLabel("Contact name").fill("Jordan");
    await page.getByLabel("Email").fill("hello@live-analytics-proof.example");
    await page
      .getByLabel(/What you want help with|Notes for review/i)
      .fill("Checking the live analytics path from the homepage through the business request save action.");
    await page.getByRole("button", { name: /Save for later|Save draft for later|Save review request/i }).click();
    await page.getByText(/Live Analytics Proof Bistro/i).waitFor();
    await capture(page, "submit-after-save.png");

    await waitForAnalyticsTraffic(
      analyticsEvents,
      (events) => events.some((event) => event.eventName === "business_request_saved_for_later"),
    );

    const uniqueMeasurementIds = [...new Set(analyticsEvents.map((event) => event.measurementId).filter(Boolean))];
    const eventNames = [...new Set(analyticsEvents.map((event) => event.eventName).filter(Boolean))];
    const scriptRequests = analyticsEvents.filter((event) => event.path === "/gtag/js");
    const collectRequests = analyticsEvents.filter(
      (event) => event.path === "/g/collect" || event.path === "/collect",
    );
    const localDebugState = await page.evaluate(({ debugKey, launchKey }) => {
      const readJson = (storage, key) => {
        try {
          const raw = storage.getItem(key);
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      };

      const debugEntries = Array.isArray(readJson(window.localStorage, debugKey))
        ? readJson(window.localStorage, debugKey)
        : [];
      const launchState = readJson(window.localStorage, launchKey);
      const growthEvents = Array.isArray(launchState?.growthEvents) ? launchState.growthEvents : [];

      return {
        debugEventNames: debugEntries
          .map((entry) => (entry && typeof entry === "object" ? entry.name : ""))
          .filter(Boolean),
        growthEventNames: growthEvents
          .map((entry) => (entry && typeof entry === "object" ? entry.name : ""))
          .filter(Boolean),
      };
    }, { debugKey: analyticsDebugKey, launchKey: launchStorageKey });
    const runtimeState = await page.evaluate(() => ({
      analyticsReadiness: window.__cityatlasAnalyticsReadiness ?? null,
      hasGtag: typeof window.gtag === "function",
      hasDataLayer: Array.isArray(window.dataLayer),
      dataLayerLength: Array.isArray(window.dataLayer) ? window.dataLayer.length : 0,
      hasGoogleTagManager: Boolean(window.google_tag_manager),
      analyticsState: window.__cityatlasAnalyticsState ?? null,
    }));
    const dataLayerState = await getHostedDataLayerState(page);
    const consentStored = await page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      consentKey,
    );
    const resetGuardStored = await page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      resetGuardKey,
    );
    const configuredMeasurementId = runtimeState.analyticsState?.configuredMeasurementId || "";
    const effectiveExpectedMeasurementId = expectedMeasurementId || configuredMeasurementId;
    const scriptLoadedExpectedMeasurementId = effectiveExpectedMeasurementId
      ? scriptRequests.some((event) => event.url.includes(`id=${effectiveExpectedMeasurementId}`))
      : false;
    const missingDebugEvents = requiredHostedFunnelEvents.filter(
      (name) => !localDebugState.debugEventNames.includes(name),
    );
    const missingGrowthEvents = requiredHostedFunnelEvents.filter(
      (name) => !localDebugState.growthEventNames.includes(name),
    );
    const missingDataLayerEvents = requiredHostedFunnelEvents.filter(
      (name) => !dataLayerState.eventNames.includes(name),
    );
    const collectRequestsObserved = collectRequests.length > 0;

    if (beforeConsentEventCount > 0) {
      failures.push("Analytics requests were observed before consent was granted.");
    }

    if (consentStored !== "granted") {
      failures.push("Hosted analytics consent was not stored as granted after the opt-in action.");
    }

    if (!runtimeState.analyticsState?.scriptInjected || !runtimeState.hasGtag || !runtimeState.hasDataLayer) {
      failures.push("Hosted analytics runtime did not fully initialize after consent.");
    }

    if (effectiveExpectedMeasurementId && !scriptLoadedExpectedMeasurementId) {
      failures.push(`Hosted GA script did not load the expected measurement id ${effectiveExpectedMeasurementId}.`);
    }

    if (missingDebugEvents.length > 0 || missingGrowthEvents.length > 0) {
      failures.push(
        `Hosted business-funnel events were missing from local proof state: ${[
          ...new Set([...missingDebugEvents, ...missingGrowthEvents]),
        ].join(", ")}.`,
      );
    }

    if (missingDataLayerEvents.length > 0) {
      warnings.push(
        `Hosted dataLayer did not expose every required funnel event tuple: ${missingDataLayerEvents.join(", ")}.`,
      );
    }

    if (!collectRequestsObserved) {
      warnings.push(
        "No Google Analytics collect request was observed in this headless browser run; treat external GA collection as unverified unless provider-side analytics confirms receipt.",
      );
    }

    const status = failures.length > 0
      ? "failed"
      : collectRequestsObserved
        ? "hosted_ga_collect_verified"
        : "hosted_site_instrumentation_verified_ga_collect_not_observed";

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      status,
      expectedMeasurementId,
      effectiveExpectedMeasurementId,
      consentStored,
      resetGuardStored,
      consentGrantResult,
      beforeConsentAnalyticsRequests: beforeConsentEventCount,
      observedScriptRequests: scriptRequests,
      observedCollectRequests: collectRequests,
      uniqueMeasurementIds,
      eventNames,
      dataLayerState,
      manualProbeObserved: eventNames.includes("cityatlas_debug_probe"),
      manualReconfiguredProbeObserved,
      partnerPreviewViewedObserved: eventNames.includes("business_partner_preview_viewed"),
      partnerPreviewCtaObserved: eventNames.includes("business_partner_preview_cta_clicked"),
      googleTagManagerReady,
      runtimeState,
      localDebugState,
      consoleMessages,
      pageErrors,
      screenshotFailures,
      failures,
      warnings,
      siteInstrumentationVerified: failures.length === 0,
      collectRequestsObserved,
      scriptLoadedExpectedMeasurementId,
      matchedExpectedMeasurementId: expectedMeasurementId
        ? uniqueMeasurementIds.includes(expectedMeasurementId)
        : null,
      proof: {
        screenshots,
      },
    };

    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

await main();
