import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { siteConfig } from "../src/config/site.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/seo");
const publicDir = join(root, "public");
const failures = [];

function check(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith("--")) continue;
    const key = part.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function extractSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function discoverKeyFile() {
  const candidates = readdirSync(publicDir)
    .filter((name) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(name))
    .map((name) => {
      const key = name.replace(/\.txt$/, "");
      const contents = readFileSync(join(publicDir, name), "utf8").trim();
      return {
        fileName: name,
        key,
        contents,
      };
    })
    .filter((entry) => entry.contents === entry.key);

  return candidates[0] ?? null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = normalizeBaseUrl(
    typeof args["base-url"] === "string"
      ? args["base-url"]
      : `https://${siteConfig.targetDomain}`,
  );
  const endpoint =
    typeof args.endpoint === "string" ? args.endpoint : "https://www.bing.com/indexnow";
  const dryRun = args["dry-run"] === true;

  const keyFile = discoverKeyFile();
  check(Boolean(keyFile), "No root IndexNow key file was found in public/.");

  const sitemap = readFileSync(join(publicDir, "sitemap.xml"), "utf8");
  const discoveredUrls = extractSitemapUrls(sitemap);
  const host = new URL(`${baseUrl}/`).host;
  const urlList = [...new Set(
    discoveredUrls.filter((url) => {
      try {
        return new URL(url).host === host;
      } catch {
        return false;
      }
    }),
  )];

  check(urlList.length > 0, `No sitemap URLs matched host ${host}.`);

  const payload = {
    host,
    key: keyFile?.key ?? null,
    keyLocation: keyFile ? `${baseUrl}/${keyFile.fileName}` : null,
    urlList,
  };

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    endpoint,
    dryRun,
    keyFile: keyFile?.fileName ?? null,
    urlCount: urlList.length,
    sampleUrls: urlList.slice(0, 5),
    payload,
    failures,
  };

  if (!dryRun && failures.length === 0) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    report.response = {
      status: response.status,
      ok: response.ok,
      body: await response.text(),
    };

    check(
      response.status === 200 || response.status === 202,
      `IndexNow endpoint returned ${response.status}.`,
    );
  }

  report.passed = failures.length === 0;

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(
    join(outputDir, "indexnow-submit-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  console.log("CityAtlas IndexNow submission");
  console.log(JSON.stringify(report, null, 2));

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

await main();
