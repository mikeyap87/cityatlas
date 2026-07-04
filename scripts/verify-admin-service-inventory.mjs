import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { loadPlaywright, wait } from "./browser-proof-support.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/qa/admin-service-inventory");
const baseUrl = `http://127.0.0.1:${process.env.CITYATLAS_ADMIN_QA_PORT || "5178"}`;
const navigationWaitUntil = "domcontentloaded";
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

function extractLeadingNumber(value) {
  const match = value.match(/(\d[\d,]*)/);
  return match ? Number(match[1].replaceAll(",", "")) : NaN;
}

async function saveScreenshot(page, fileName) {
  mkdirSync(outputDir, { recursive: true });
  const path = join(outputDir, fileName);
  await page.screenshot({ path, fullPage: true });
  return relative(root, path);
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
    if (url.startsWith(baseUrl) && !abortedImageRequest) {
      bucket.requestFailures.push(`${url} :: ${errorText}`);
    }
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      bucket.consoleErrors.push(message.text());
    }
  });
}

async function runCheck(results, name, fn) {
  console.log(`Running: ${name}`);
  try {
    results.push({
      name,
      status: "passed",
      ...(await fn()),
    });
  } catch (error) {
    results.push({
      name,
      status: "failed",
      error: noteFailure(name, error),
    });
  }
}

async function main() {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || undefined,
  });
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
  const checks = [];
  attachRuntimeCapture(page, runtime);

  try {
    await runCheck(checks, "public homepage render", async () => {
      await page.goto(`${baseUrl}/`, { waitUntil: navigationWaitUntil });
      await page.locator("h1").first().waitFor();
      const heading = (await page.locator("h1").first().innerText()).trim();
      ensure(/vancouver/i.test(heading), `Homepage hero should mention Vancouver. Got "${heading}".`);
      return {
        route: "/",
        screenshot: await saveScreenshot(page, "homepage.png"),
      };
    });

    await runCheck(checks, "public guide library render", async () => {
      await page.goto(`${baseUrl}/vancouver/guides`, { waitUntil: navigationWaitUntil });
      await page.getByRole("heading", {
        level: 1,
        name: /Vancouver guides for easier local plans/i,
      }).waitFor();
      return {
        route: "/vancouver/guides",
        screenshot: await saveScreenshot(page, "guides.png"),
      };
    });

    await runCheck(checks, "public offers render", async () => {
      await page.goto(`${baseUrl}/vancouver/offers`, { waitUntil: navigationWaitUntil });
      await page.getByRole("heading", {
        level: 1,
        name: /Vancouver offers worth checking before a detour/i,
      }).waitFor();
      return {
        route: "/vancouver/offers",
        screenshot: await saveScreenshot(page, "offers.png"),
      };
    });

    await runCheck(checks, "public city page render", async () => {
      await page.goto(`${baseUrl}/vancouver`, { waitUntil: navigationWaitUntil });
      await page.getByRole("heading", {
        level: 1,
        name: /Find the right Vancouver start first/i,
      }).waitFor();
      return {
        route: "/vancouver",
        screenshot: await saveScreenshot(page, "city.png"),
      };
    });

    await runCheck(checks, "admin combined inventory render", async () => {
      await page.goto(`${baseUrl}/admin`, { waitUntil: navigationWaitUntil });
      await page.getByRole("heading", { level: 1, name: /CityAtlas operator console/i }).waitFor();
      await page.getByText(/Business database first/i).waitFor();
      const inventoryPanel = page
        .locator("article.admin-panel.large")
        .filter({ hasText: "business database" })
        .first();
      await inventoryPanel.waitFor();

      const metricTexts = await inventoryPanel.locator(".proof-candidate-summary span").evaluateAll((nodes) =>
        nodes.map((node) => node.textContent?.replace(/\s+/g, " ").trim() ?? ""),
      );
      const serviceMetricText = metricTexts.find((text) => /Service businesses/i.test(text)) ?? "";
      const officialServiceMetricText = metricTexts.find((text) => /Official service/i.test(text)) ?? "";
      const officialFoodMetricText = metricTexts.find((text) => /Official food/i.test(text)) ?? "";
      const officialMetroMetricText = metricTexts.find((text) => /Official metro/i.test(text)) ?? "";
      const serviceCount = extractLeadingNumber(serviceMetricText);
      const officialServiceCount = extractLeadingNumber(officialServiceMetricText);
      const officialFoodCount = extractLeadingNumber(officialFoodMetricText);
      const officialMetroCount = extractLeadingNumber(officialMetroMetricText);

      ensure(Number.isFinite(serviceCount) && serviceCount > 0, `Expected service-business inventory rows, got "${serviceMetricText}".`);
      ensure(Number.isFinite(officialServiceCount) && officialServiceCount > 0, `Expected official-service inventory rows, got "${officialServiceMetricText}".`);
      ensure(Number.isFinite(officialFoodCount) && officialFoodCount > 0, `Expected official-food inventory rows, got "${officialFoodMetricText}".`);
      ensure(Number.isFinite(officialMetroCount) && officialMetroCount > 0, `Expected official-metro inventory rows, got "${officialMetroMetricText}".`);

      return {
        route: "/admin",
        metricTexts,
        screenshot: await saveScreenshot(page, "admin-combined.png"),
      };
    });

    await runCheck(checks, "admin service-only filter", async () => {
      await page.goto(`${baseUrl}/admin`, { waitUntil: navigationWaitUntil });
      await page.getByRole("heading", { level: 1, name: /CityAtlas operator console/i }).waitFor();
      const inventorySourceOptions = await page.getByLabel("Inventory source").locator("option").evaluateAll((options) =>
        options.map((option) => (option instanceof HTMLOptionElement
          ? {
              value: option.value,
              label: option.textContent?.trim() ?? "",
            }
          : {
              value: "",
              label: "",
            })),
      );
      await page.getByLabel("Inventory source").selectOption("service_businesses");
      await page.getByText(/reviewed service inventory/i).waitFor();
      await wait(250);

      const inventoryPanel = page
        .locator("article.admin-panel.large")
        .filter({ hasText: "business database" })
        .first();
      const sampleRows = await inventoryPanel.locator(".business-prospect-row").evaluateAll((rows) =>
        rows.slice(0, 8).map((row) => row.textContent?.replace(/\s+/g, " ").trim() ?? ""),
      );
      const businessTypeOptions = await page.getByLabel("Business type").locator("option").evaluateAll((options) =>
        options.map((option) => (option instanceof HTMLOptionElement ? option.textContent?.trim() ?? "" : "")),
      );
      const serviceSignals = [
        "hotel",
        "wellness",
        "spa",
        "gallery",
        "studio",
        "event",
        "venue",
        "cowork",
        "salon",
        "hospitality",
      ];

      ensure(sampleRows.length > 0, "Expected service-only inventory rows to render.");
      ensure(
        sampleRows.some((row) =>
          serviceSignals.some((signal) => row.toLowerCase().includes(signal)),
        ),
        `Service-only rows did not show recognizable non-restaurant businesses. Samples: ${JSON.stringify(sampleRows)}.`,
      );

      return {
        route: "/admin",
        inventorySourceOptions,
        businessTypeOptions,
        sampleRows,
        screenshot: await saveScreenshot(page, "admin-service-only.png"),
      };
    });

    await runCheck(checks, "admin official-service filter", async () => {
      await page.goto(`${baseUrl}/admin`, { waitUntil: navigationWaitUntil });
      await page.getByRole("heading", { level: 1, name: /CityAtlas operator console/i }).waitFor();
      await page.getByLabel("Inventory source").selectOption("official_service");
      await page.getByText("Official Vancouver service inventory", { exact: true }).waitFor();
      await wait(250);

      const inventoryPanel = page
        .locator("article.admin-panel.large")
        .filter({ hasText: "business database" })
        .first();
      const sampleRows = await inventoryPanel.locator(".business-prospect-row").evaluateAll((rows) =>
        rows.slice(0, 8).map((row) => row.textContent?.replace(/\s+/g, " ").trim() ?? ""),
      );
      const serviceSignals = [
        "repair",
        "clean",
        "detailing",
        "beauty",
        "fitness",
        "vehicle",
        "maintenance",
      ];

      ensure(sampleRows.length > 0, "Expected official-service inventory rows to render.");
      ensure(
        sampleRows.some((row) =>
          serviceSignals.some((signal) => row.toLowerCase().includes(signal)),
        ),
        `Official-service rows did not show recognizable service businesses. Samples: ${JSON.stringify(sampleRows)}.`,
      );

      return {
        route: "/admin",
        sampleRows,
        screenshot: await saveScreenshot(page, "admin-official-service.png"),
      };
    });

    await runCheck(checks, "admin official-food filter", async () => {
      await page.goto(`${baseUrl}/admin`, { waitUntil: navigationWaitUntil });
      await page.getByRole("heading", { level: 1, name: /CityAtlas operator console/i }).waitFor();
      await page.getByLabel("Inventory source").selectOption("official_food");
      await page.getByText("Official Vancouver food inventory", { exact: true }).waitFor();
      await wait(250);

      const inventoryPanel = page
        .locator("article.admin-panel.large")
        .filter({ hasText: "business database" })
        .first();
      const sampleRows = await inventoryPanel.locator(".business-prospect-row").evaluateAll((rows) =>
        rows.slice(0, 8).map((row) => row.textContent?.replace(/\s+/g, " ").trim() ?? ""),
      );

      ensure(sampleRows.length > 0, "Expected official-food inventory rows to render.");

      return {
        route: "/admin",
        sampleRows,
        screenshot: await saveScreenshot(page, "admin-official-food.png"),
      };
    });

    await runCheck(checks, "admin official-metro filter", async () => {
      await page.goto(`${baseUrl}/admin`, { waitUntil: navigationWaitUntil });
      await page.getByRole("heading", { level: 1, name: /CityAtlas operator console/i }).waitFor();
      const inventoryPanel = page
        .locator("article.admin-panel.large")
        .filter({ hasText: "business database" })
        .first();
      await page.getByLabel("Inventory source").selectOption("official_metro");
      const metroMunicipalitySelect = page.getByLabel("Metro municipality");
      await metroMunicipalitySelect.waitFor();
      const municipalityOptions = await metroMunicipalitySelect.locator("option").evaluateAll((options) =>
        options.map((option) => (option instanceof HTMLOptionElement ? option.textContent?.trim() ?? "" : "")),
      );
      const loadStartedAt = Date.now();
      const municipalitySignals = ["Surrey", "Coquitlam", "Township of Langley"];
      try {
        await page.waitForFunction(
          ({ signals }) =>
            Array.from(document.querySelectorAll(".business-prospect-row")).some((row) => {
              const text = row.textContent || "";
              return signals.some((signal) => text.includes(signal));
            }),
          { signals: municipalitySignals },
          { timeout: 120_000 },
        );
      } catch (error) {
        const panelSnapshot = await inventoryPanel.innerText();
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${message}\nPanel snapshot:\n${panelSnapshot.slice(0, 4000)}`);
      }
      if (municipalityOptions.includes("Burnaby")) {
        await metroMunicipalitySelect.selectOption("Burnaby");
        await page.waitForFunction(
          () =>
            Array.from(document.querySelectorAll(".business-prospect-row")).some((row) =>
              (row.textContent || "").includes("Burnaby"),
            ),
          undefined,
          { timeout: 30_000 },
        );
      }
      if (municipalityOptions.includes("Coquitlam")) {
        await metroMunicipalitySelect.selectOption("Coquitlam");
        await page.waitForFunction(
          () =>
            Array.from(document.querySelectorAll(".business-prospect-row")).some((row) =>
              (row.textContent || "").includes("Coquitlam"),
            ),
          undefined,
          { timeout: 30_000 },
        );
      }
      await wait(500);

      const sampleRows = await inventoryPanel.locator(".business-prospect-row").evaluateAll((rows) =>
        rows.slice(0, 10).map((row) => row.textContent?.replace(/\s+/g, " ").trim() ?? ""),
      );

      ensure(sampleRows.length > 0, "Expected official-metro inventory rows to render.");
      ensure(
        sampleRows.some((row) =>
          municipalitySignals.some((signal) => row.includes(signal)),
        ),
        `Official-metro rows did not show recognizable metro municipalities. Samples: ${JSON.stringify(sampleRows)}.`,
      );

      return {
        route: "/admin",
        loadDurationMs: Date.now() - loadStartedAt,
        municipalityOptions,
        sampleRows,
        screenshot: await saveScreenshot(page, "admin-official-metro.png"),
      };
    });
  } finally {
    await context.close();
    await browser.close();
  }

  if (runtime.pageErrors.length > 0) {
    noteFailure("runtime page errors", new Error(runtime.pageErrors.join(" | ")));
  }
  if (runtime.requestFailures.length > 0) {
    noteFailure("runtime request failures", new Error(runtime.requestFailures.join(" | ")));
  }
  if (runtime.consoleErrors.length > 0) {
    noteWarning("runtime console errors", runtime.consoleErrors.join(" | "));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    passed: failures.length === 0,
    failures,
    warnings,
    checks,
  };

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) {
    process.exitCode = 1;
  }
}

await main();
