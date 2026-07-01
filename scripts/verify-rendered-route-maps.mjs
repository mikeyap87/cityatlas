import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import {
  getSourceBackedCollectionForGuide,
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
const useExistingServer = process.env.CITYATLAS_RENDERED_ROUTE_MAP_USE_EXISTING_SERVER === "1";
const baseUrl = `http://127.0.0.1:${previewPort}`;

function getRouteMapPaths() {
  const collectionPaths = Object.values(sourceBackedCollectionMeta).map((meta) => meta.path);
  const guidePaths = seedData.guides
    .filter((guide) => Boolean(getSourceBackedCollectionForGuide(guide)))
    .map((guide) => `/${guide.citySlug ?? "vancouver"}/guides/${guide.slug}`);

  return [...new Set([...collectionPaths, ...guidePaths])];
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

async function inspectRoute(page, route, viewportName) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });

  const panel = page.locator(".route-map-panel");
  const panelCount = await panel.count();
  const link = page.locator(".route-map-panel a[href^='https://www.google.com/maps/dir/']");
  const linkCount = await link.count();
  const href = linkCount === 1 ? await link.first().getAttribute("href") : null;
  const visibleText = panelCount === 1 ? await panel.first().innerText() : "";
  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  const failures = [];

  if (panelCount !== 1) {
    failures.push(`${route} (${viewportName}): expected 1 route map panel, found ${panelCount}`);
  }

  if (linkCount !== 1) {
    failures.push(`${route} (${viewportName}): expected 1 Google Maps link, found ${linkCount}`);
  }

  if (!visibleText.includes("Open in Google Maps")) {
    failures.push(`${route} (${viewportName}): panel missing Google Maps action text`);
  }

  if (layout.scrollWidth > layout.viewportWidth + 1) {
    failures.push(
      `${route} (${viewportName}): horizontal overflow ${layout.scrollWidth}px > ${layout.viewportWidth}px`,
    );
  }

  const hrefFailures = inspectMapsHref(href, `${route} (${viewportName})`);
  if (Array.isArray(hrefFailures)) {
    failures.push(...hrefFailures);
  } else {
    failures.push(hrefFailures);
  }

  return {
    route,
    viewport: viewportName,
    panelCount,
    linkCount,
    href,
    horizontalOverflow: layout.scrollWidth > layout.viewportWidth + 1,
    failures,
  };
}

async function main() {
  const routes = getRouteMapPaths();
  const failures = [];
  const reports = [];
  const server = useExistingServer
    ? null
    : startVitePreviewServer({ root, port: previewPort, distIndexPath });

  try {
    if (server) {
      await waitForServer(baseUrl, () => server.getLogs());
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

      for (const route of routes) {
        for (const [viewportName, page] of [
          ["desktop", desktopPage],
          ["mobile", mobilePage],
        ]) {
          try {
            const report = await inspectRoute(page, route, viewportName);
            reports.push(report);
            failures.push(...report.failures);
          } catch (error) {
            failures.push(
              `${route} (${viewportName}): ${error instanceof Error ? error.message : String(error)}`,
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
    routeCount: routes.length,
    checkedViewports: ["desktop", "mobile"],
    failureCount: failures.length,
    failures,
    passed: failures.length === 0,
    reports: reports.map(({ route, viewport, panelCount, linkCount, horizontalOverflow }) => ({
      route,
      viewport,
      panelCount,
      linkCount,
      horizontalOverflow,
    })),
  };

  console.log("CityAtlas rendered route-map proof");
  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) {
    process.exit(1);
  }
}

await main();
