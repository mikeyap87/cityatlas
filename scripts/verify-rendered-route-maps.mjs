import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import {
  getSourceBackedCollectionForGuide,
  getSourceBackedCollectionForPath,
  sourceBackedCollectionMeta,
} from "../src/lib/sourceBackedCollections.ts";
import {
  loadPlaywright,
  startVitePreviewServer,
  waitForServer,
} from "./browser-proof-support.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distIndexPath = join(root, "dist/index.html");
const previewPort = Number(process.env.CITYATLAS_RENDERED_ROUTE_MAP_PORT || "4382");
const configuredBaseUrl = process.env.CITYATLAS_RENDERED_ROUTE_MAP_BASE_URL?.replace(/\/+$/u, "");
const useExistingServer = process.env.CITYATLAS_RENDERED_ROUTE_MAP_USE_EXISTING_SERVER === "1";
const baseUrl = configuredBaseUrl || `http://127.0.0.1:${previewPort}`;
const compactReport = process.env.CITYATLAS_RENDERED_ROUTE_MAP_COMPACT === "1";

function getGuidePath(guide) {
  return `/${guide.citySlug ?? "vancouver"}/guides/${guide.slug}`;
}

function getCollectionForPath(path) {
  const directCollection = getSourceBackedCollectionForPath(path);

  if (directCollection) {
    return directCollection;
  }

  const matchingGuide = seedData.guides.find((guide) => getGuidePath(guide) === path);

  return matchingGuide ? getSourceBackedCollectionForGuide(matchingGuide) : null;
}

function getRouteMapOptionsForGuide(guide) {
  const seenCollections = new Set();

  return (guide.resourceLinks ?? [])
    .map((link) => {
      const collection = getCollectionForPath(link.path);

      if (!collection || seenCollections.has(collection)) {
        return null;
      }

      seenCollections.add(collection);

      return {
        collection,
        path: link.path,
      };
    })
    .filter(Boolean);
}

function getRouteMapEntries() {
  const collectionPaths = Object.values(sourceBackedCollectionMeta).map((meta) => meta.path);
  const guidePaths = seedData.guides
    .filter((guide) => Boolean(getSourceBackedCollectionForGuide(guide)))
    .map((guide) => getGuidePath(guide));
  const directEntries = [...new Set([...collectionPaths, ...guidePaths])].map((path) => ({
    path,
    mode: "direct",
    expectedLinkCount: 1,
  }));
  const chooserEntries = seedData.guides
    .filter((guide) => !getSourceBackedCollectionForGuide(guide))
    .map((guide) => ({
      guide,
      options: getRouteMapOptionsForGuide(guide),
    }))
    .filter((entry) => entry.options.length > 0)
    .map(({ guide, options }) => ({
      path: getGuidePath(guide),
      mode: "options",
      expectedLinkCount: Math.min(options.length, 6),
    }));

  return [...directEntries, ...chooserEntries];
}

async function stopPreviewServer(server) {
  const child = server?.child;
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);

  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL");
    await new Promise((resolve) => child.once("exit", resolve));
  }
}

async function waitForExternalBaseUrl(url, timeoutMs = 30_000) {
  const startedAt = Date.now();
  let lastError = "";

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status < 500) {
        return;
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(
    `Base URL did not become ready at ${url} within ${timeoutMs}ms.${lastError ? ` Last error: ${lastError}` : ""}`,
  );
}

function inspectMapsHref(href, route) {
  if (!href) {
    return `${route}: missing Google Maps href`;
  }

  const parsed = new URL(href);
  const failures = [];

  if (parsed.origin !== "https://www.google.com") {
    failures.push(`${route}: wrong Google host`);
  }

  if (parsed.pathname !== "/maps/dir/") {
    failures.push(`${route}: wrong Google Maps path`);
  }

  if (parsed.searchParams.get("api") !== "1") {
    failures.push(`${route}: missing api=1`);
  }

  if (parsed.searchParams.get("travelmode") !== "walking") {
    failures.push(`${route}: wrong travel mode`);
  }

  if (!parsed.searchParams.get("origin")) {
    failures.push(`${route}: missing origin`);
  }

  if (!parsed.searchParams.get("destination")) {
    failures.push(`${route}: missing destination`);
  }

  return failures;
}

async function inspectRoute(page, entry, viewportName) {
  await page.goto(`${baseUrl}${entry.path}`, { waitUntil: "networkidle" });

  const panelSelector = entry.mode === "options" ? ".route-map-options-panel" : ".route-map-panel";
  const panel = page.locator(panelSelector);
  try {
    await panel.first().waitFor({ state: "attached", timeout: 5_000 });
  } catch {
    // Count below records the missing panel as a test failure with route context.
  }
  const panelCount = await panel.count();
  const hrefs = await page.evaluate((selector) => {
    return Array.from(
      document.querySelectorAll(`${selector} a[href^="https://www.google.com/maps/dir/"]`),
    ).map((link) => link.href);
  }, panelSelector);
  const linkCount = hrefs.length;
  const visibleText = panelCount === 1 ? await panel.first().innerText() : "";
  const normalizedVisibleText = visibleText.toLowerCase();
  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  const failures = [];

  if (panelCount !== 1) {
    failures.push(`${entry.path} (${viewportName}): expected 1 route map panel, found ${panelCount}`);
  }

  if (linkCount !== entry.expectedLinkCount) {
    failures.push(
      `${entry.path} (${viewportName}): expected ${entry.expectedLinkCount} Google Maps link(s), found ${linkCount}`,
    );
  }

  if (!normalizedVisibleText.includes("open route in google maps")) {
    failures.push(`${entry.path} (${viewportName}): panel missing Google Maps action text`);
  }

  if (entry.mode === "direct") {
    for (const requiredText of ["plan window", "typical stop", "best mode", "route shape"]) {
      if (!normalizedVisibleText.includes(requiredText)) {
        failures.push(`${entry.path} (${viewportName}): direct panel missing ${requiredText}`);
      }
    }
  }

  if (entry.mode === "options") {
    if (!normalizedVisibleText.includes("stops")) {
      failures.push(`${entry.path} (${viewportName}): option panel missing stop-count metadata`);
    }

    if (!normalizedVisibleText.includes("hr")) {
      failures.push(`${entry.path} (${viewportName}): option panel missing route-window metadata`);
    }
  }

  if (layout.scrollWidth > layout.viewportWidth + 1) {
    failures.push(
      `${entry.path} (${viewportName}): horizontal overflow ${layout.scrollWidth}px > ${layout.viewportWidth}px`,
    );
  }

  for (const [index, href] of hrefs.entries()) {
    const hrefFailures = inspectMapsHref(href, `${entry.path} (${viewportName}) link ${index + 1}`);
    if (Array.isArray(hrefFailures)) {
      failures.push(...hrefFailures);
    } else {
      failures.push(hrefFailures);
    }
  }

  return {
    route: entry.path,
    mode: entry.mode,
    viewport: viewportName,
    panelCount,
    linkCount,
    horizontalOverflow: layout.scrollWidth > layout.viewportWidth + 1,
    failures,
  };
}

async function main() {
  const entries = getRouteMapEntries();
  const failures = [];
  const reports = [];
  const server = configuredBaseUrl || useExistingServer
    ? null
    : startVitePreviewServer({ root, port: previewPort, distIndexPath });

  try {
    if (server) {
      await waitForServer(baseUrl, () => server.getLogs());
    } else {
      await waitForExternalBaseUrl(baseUrl);
    }

    const { chromium } = loadPlaywright();
    const browser = await chromium.launch({ headless: true });

    try {
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        colorScheme: "light",
      });
      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        colorScheme: "light",
      });
      const desktopPage = await desktopContext.newPage();
      const mobilePage = await mobileContext.newPage();

      for (const entry of entries) {
        for (const [viewportName, page] of [
          ["desktop", desktopPage],
          ["mobile", mobilePage],
        ]) {
          try {
            const report = await inspectRoute(page, entry, viewportName);
            reports.push(report);
            failures.push(...report.failures);
          } catch (error) {
            failures.push(
              `${entry.path} (${viewportName}): ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }
      }

      await desktopContext.close();
      await mobileContext.close();
    } finally {
      await browser.close();
    }
  } finally {
    await stopPreviewServer(server);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    routeCount: entries.length,
    directRouteCount: entries.filter((entry) => entry.mode === "direct").length,
    routeChooserCount: entries.filter((entry) => entry.mode === "options").length,
    checkedViewports: ["desktop", "mobile"],
    failureCount: failures.length,
    failures,
    passed: failures.length === 0,
    ...(compactReport
      ? {
          reportSummary: {
            checkedPages: reports.length,
            directRoutePageChecks: reports.filter((entry) => entry.mode === "direct").length,
            routeChooserPageChecks: reports.filter((entry) => entry.mode === "options").length,
          },
        }
      : {
          reports: reports.map(({ route, mode, viewport, panelCount, linkCount, horizontalOverflow }) => ({
            route,
            mode,
            viewport,
            panelCount,
            linkCount,
            horizontalOverflow,
          })),
        }),
  };

  console.log("CityAtlas rendered route-map proof");
  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) {
    process.exit(1);
  }
}

await main();
