import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import {
  getSourceBackedCollectionForGuide,
  sourceBackedCollectionMeta,
} from "../src/lib/sourceBackedCollections.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const seoDocsDir = join(root, "docs/seo-aeo-geo");
const structureProofPath = join(root, "output/seo/local-structure-proof.json");

const blockStart = "<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->";
const blockEnd = "<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->";

const guideCount = seedData.guides.length;
const sourceBackedCollectionCount = Object.keys(sourceBackedCollectionMeta).length;
const sourceBackedPlaceCount = seedData.sourceBackedPlaces.length;
const usefulPieceCount = guideCount + sourceBackedCollectionCount;
const mappedGuideCollectionCount = new Set(
  seedData.guides
    .map((guide) => getSourceBackedCollectionForGuide(guide))
    .filter((value) => value !== null),
).size;
const guideResourceLinkedCount = seedData.guides.filter(
  (guide) => Array.isArray(guide.resourceLinks) && guide.resourceLinks.length > 0,
).length;
const structureProof = existsSync(structureProofPath)
  ? JSON.parse(readFileSync(structureProofPath, "utf8"))
  : null;
const checkedRouteCount = Number(structureProof?.checkedRouteCount ?? 0);

function walkMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(path));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path);
    }
  }
  return files;
}

function buildDateLabel() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Vancouver",
  }).format(new Date());
}

function buildTruthBlock() {
  const lines = [
    "## Current Shared Machine Truth",
    "",
    `- Synced ${buildDateLabel()} from current repo truth.`,
    `- Current local machine truth: \`${usefulPieceCount}\` useful pieces, \`${guideCount}\` guides, \`${sourceBackedCollectionCount}\` source-backed wedge collections, \`${sourceBackedPlaceCount}\` source-backed anchors, and \`${mappedGuideCollectionCount}\` mapped guide-to-collection links.`,
    `- all \`${guideResourceLinkedCount}\` current guides now have at least one direct-path internal link into another CityAtlas page.`,
    `- \`npm run seo:structure:proof\` currently passes across \`${checkedRouteCount}\` key routes.`,
  ];

  return `${blockStart}\n${lines.join("\n")}\n${blockEnd}`;
}

const truthBlock = buildTruthBlock();
const files = walkMarkdownFiles(seoDocsDir);
const updatedFiles = [];

for (const file of files) {
  const contents = readFileSync(file, "utf8");
  const blockPattern = new RegExp(`${blockStart}[\\s\\S]*?${blockEnd}`, "m");
  const nextContents = blockPattern.test(contents)
    ? contents.replace(blockPattern, truthBlock)
    : `${contents.trimEnd()}\n\n${truthBlock}\n`;

  if (nextContents !== contents) {
    writeFileSync(file, nextContents);
    updatedFiles.push(file.replace(`${root}/`, ""));
  }
}

console.log("CityAtlas SEO doc-truth sync");
console.log(
  JSON.stringify(
    {
      usefulPieceCount,
      guideCount,
      sourceBackedCollectionCount,
      sourceBackedPlaceCount,
      mappedGuideCollectionCount,
      guideResourceLinkedCount,
      checkedRouteCount,
      updatedFileCount: updatedFiles.length,
      updatedFiles,
    },
    null,
    2,
  ),
);
