import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  blockedPhrases,
  publicSeedBlockedRules,
} from "./public-copy-safety-rules.mjs";
import {
  loadPlaywright,
  startVitePreviewServer,
  waitForServer,
} from "./browser-proof-support.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/seo");
const sitemapPath = join(root, "public/sitemap.xml");
const distIndexPath = join(root, "dist/index.html");
const previewPort = Number(process.env.CITYATLAS_RENDERED_COPY_PORT || "4378");
const useExistingServer = process.env.CITYATLAS_RENDERED_COPY_USE_EXISTING_SERVER === "1";
const baseUrl = `http://127.0.0.1:${previewPort}`;

function snippetFor(source, index, length) {
  const start = Math.max(0, index - 48);
  const end = Math.min(source.length, index + length + 48);
  return source
    .slice(start, end)
    .replace(/\s+/g, " ")
    .trim();
}

function extractSitemapRoutes(xml) {
  const paths = [];
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const match of matches) {
    const value = match[1]?.trim();
    if (!value) continue;
    const url = new URL(value);
    if (!paths.includes(url.pathname)) {
      paths.push(url.pathname);
    }
  }
  return paths;
}

async function stopPreviewServer(server) {
  const child = server?.child;
  if (!child) {
    return;
  }

  if (child.exitCode !== null || child.signalCode !== null) {
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

async function main() {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const routes = extractSitemapRoutes(sitemap);
  const findings = [];
  const routeReports = [];
  const failures = [];
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
      const context = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        colorScheme: "light",
      });
      const page = await context.newPage();

      for (const route of routes) {
        const url = `${baseUrl}${route}`;
        try {
          await page.goto(url, { waitUntil: "networkidle" });
          const visibleText = (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
          const lowered = visibleText.toLowerCase();
          const title = await page.title();

          routeReports.push({
            route,
            title,
            visibleTextLength: visibleText.length,
          });

          for (const rule of blockedPhrases) {
            let searchIndex = lowered.indexOf(rule.phrase);
            while (searchIndex !== -1) {
              findings.push({
                route,
                title,
                phrase: rule.phrase,
                reason: rule.reason,
                snippet: snippetFor(visibleText, searchIndex, rule.phrase.length),
              });
              searchIndex = lowered.indexOf(rule.phrase, searchIndex + rule.phrase.length);
            }
          }

          for (const rule of publicSeedBlockedRules) {
            rule.pattern.lastIndex = 0;
            const matches = [...visibleText.matchAll(rule.pattern)];
            for (const match of matches) {
              const index = match.index ?? 0;
              findings.push({
                route,
                title,
                phrase: rule.label,
                reason: rule.reason,
                snippet: snippetFor(visibleText, index, match[0].length),
              });
            }
          }
        } catch (error) {
          failures.push(
            `${route}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }

      await context.close();
    } finally {
      await browser.close();
    }
  } finally {
    await stopPreviewServer(server);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    checkedRouteCount: routes.length,
    checkedRoutes: routes,
    blockedPhraseCount: blockedPhrases.length,
    renderedBlockedPhraseCount: publicSeedBlockedRules.length,
    routeReports,
    failureCount: failures.length,
    failures,
    findingCount: findings.length,
    findings,
    passed: failures.length === 0 && findings.length === 0,
  };

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(
    join(outputDir, "rendered-public-copy-safety-proof.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  console.log("CityAtlas rendered public-copy safety proof");
  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) {
    process.exitCode = 1;
  }
}

await main();
