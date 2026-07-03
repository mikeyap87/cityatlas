import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  blockedPhrases,
  publicSeedBlockedRules,
  publicSeedSections,
} from "./public-copy-safety-rules.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/seo");
const seedPath = join(root, "src/data/seed.ts");

const scanTargets = [
  "src/app/CityAtlasApp.tsx",
  "src/app/router.ts",
  "src/components",
  "src/config/site.ts",
  "src/features/public",
  "src/features/business",
  "src/features/legal",
  "src/lib/cityPaths.ts",
  "src/lib/experiments.ts",
  "src/lib/seo.ts",
  "src/lib/sourceBackedCollections.ts",
  "public/llms.txt",
].map((target) => join(root, target));

function walk(path) {
  const stats = statSync(path);
  if (stats.isFile()) {
    return [path];
  }

  if (!stats.isDirectory()) {
    return [];
  }

  const files = [];
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const entryPath = join(path, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
      continue;
    }
    if (entry.isFile() && /\.(ts|tsx|md)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function getLineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function snippetFor(source, index, length) {
  const start = Math.max(0, index - 36);
  const end = Math.min(source.length, index + length + 36);
  return source
    .slice(start, end)
    .replace(/\s+/g, " ")
    .trim();
}

function scanSeedPublicSections(path) {
  if (!existsSync(path)) {
    return [];
  }

  const lines = readFileSync(path, "utf8").split("\n");
  const findings = [];
  let currentSection = "";

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const sectionMatch = line.match(/^\s{2}([A-Za-z][A-Za-z0-9_]*)\s*:/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
    }

    if (!publicSeedSections.has(currentSection)) {
      continue;
    }

    for (const rule of publicSeedBlockedRules) {
      rule.pattern.lastIndex = 0;
      const matches = [...line.matchAll(rule.pattern)];
      for (const match of matches) {
        findings.push({
          file: relative(root, path),
          line: lineIndex + 1,
          phrase: rule.label,
          reason: rule.reason,
          snippet: line.trim(),
          section: currentSection,
        });
      }
    }
  }

  return findings;
}

const files = scanTargets
  .filter((target) => existsSync(target))
  .flatMap((target) => walk(target))
  .sort((left, right) => left.localeCompare(right));

const findings = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const lowered = source.toLowerCase();

  for (const rule of blockedPhrases) {
    let searchIndex = lowered.indexOf(rule.phrase);
    while (searchIndex !== -1) {
      findings.push({
        file: relative(root, file),
        line: getLineNumber(source, searchIndex),
        phrase: rule.phrase,
        reason: rule.reason,
        snippet: snippetFor(source, searchIndex, rule.phrase.length),
      });
      searchIndex = lowered.indexOf(rule.phrase, searchIndex + rule.phrase.length);
    }
  }
}

findings.push(...scanSeedPublicSections(seedPath));

const report = {
  generatedAt: new Date().toISOString(),
  checkedFileCount: files.length,
  checkedFiles: files.map((file) => relative(root, file)),
  checkedSeedSections: [...publicSeedSections],
  blockedPhraseCount: blockedPhrases.length,
  publicSeedBlockedPhraseCount: publicSeedBlockedRules.length,
  findingCount: findings.length,
  findings,
  passed: findings.length === 0,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  join(outputDir, "public-copy-safety-proof.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log("CityAtlas public-copy safety proof");
console.log(JSON.stringify(report, null, 2));

if (findings.length > 0) {
  process.exitCode = 1;
}
