import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import { getGuideHubPath, getGuidePath } from "../src/lib/cityPaths.ts";
import {
  getSourceBackedCollectionForGuide,
  sourceBackedCollectionMeta,
} from "../src/lib/sourceBackedCollections.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const sitemap = readFileSync(join(root, "public/sitemap.xml"), "utf8");
const llms = readFileSync(join(root, "public/llms.txt"), "utf8");

const guideRoutes = seedData.guides.map((guide) => getGuidePath(guide));
const collectionEntries = Object.entries(sourceBackedCollectionMeta);
const collectionPaths = collectionEntries.map(([, meta]) => meta.path);
const guideHubPaths = new Set(seedData.guides.map((guide) => getGuideHubPath(guide)));
for (const [, meta] of collectionEntries) {
  guideHubPaths.add(meta.guideHubPath ?? "/vancouver/guides");
}
const internalResourcePaths = new Set([
  "/",
  "/about",
  "/editorial-standards",
  "/for-businesses/pricing",
  "/planner",
  "/privacy",
  "/terms",
  "/vancouver",
  "/vancouver/guides",
  "/vancouver/missions",
  ...guideHubPaths,
  ...guideRoutes,
  ...collectionPaths,
]);
const mappedGuideCollections = new Set(
  seedData.guides
    .map((guide) => getSourceBackedCollectionForGuide(guide))
    .filter((value) => value !== null),
);

const collectionPlaceCounts = seedData.sourceBackedPlaces.reduce((counts, place) => {
  counts[place.collection] = (counts[place.collection] ?? 0) + 1;
  return counts;
}, {});

const failures = [];

function check(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function checkNonEmpty(value, label) {
  check(typeof value === "string" && value.trim().length > 0, label);
}

for (const guide of seedData.guides) {
  checkNonEmpty(guide.queryClass, `Guide ${guide.slug} is missing queryClass.`);
  checkNonEmpty(guide.proofNote, `Guide ${guide.slug} is missing proofNote.`);
  checkNonEmpty(guide.proofSource, `Guide ${guide.slug} is missing proofSource.`);
  checkNonEmpty(
    guide.internalLinkTarget,
    `Guide ${guide.slug} is missing internalLinkTarget.`,
  );
  checkNonEmpty(guide.ctaPath, `Guide ${guide.slug} is missing ctaPath.`);
  check(
    Array.isArray(guide.resourceLinks) && guide.resourceLinks.length > 0,
    `Guide ${guide.slug} should include at least one direct internal resource link.`,
  );
  for (const link of guide.resourceLinks ?? []) {
    checkNonEmpty(link.title, `Guide ${guide.slug} has a resource link missing title.`);
    checkNonEmpty(link.path, `Guide ${guide.slug} has a resource link missing path.`);
    checkNonEmpty(
      link.description,
      `Guide ${guide.slug} has a resource link missing description.`,
    );
    check(
      link.path.startsWith("/"),
      `Guide ${guide.slug} has a resource link path that should be absolute: ${link.path}.`,
    );
    check(
      link.path !== getGuidePath(guide),
      `Guide ${guide.slug} should not self-link in resourceLinks.`,
    );
    check(
      internalResourcePaths.has(link.path),
      `Guide ${guide.slug} points to unknown internal resource path ${link.path}.`,
    );
  }
  check(sitemap.includes(getGuidePath(guide)), `Sitemap is missing guide route ${guide.slug}.`);
  check(llms.includes(getGuidePath(guide)), `llms.txt is missing guide route ${guide.slug}.`);
}

for (const [collectionId, meta] of collectionEntries) {
  checkNonEmpty(meta.pageTitle, `Collection ${collectionId} is missing pageTitle.`);
  checkNonEmpty(meta.pageDescription, `Collection ${collectionId} is missing pageDescription.`);
  check(
    (collectionPlaceCounts[collectionId] ?? 0) === 5,
    `Collection ${collectionId} should have 5 source-backed anchors but has ${collectionPlaceCounts[collectionId] ?? 0}.`,
  );
  check(sitemap.includes(meta.path), `Sitemap is missing source-backed route ${meta.path}.`);
  check(llms.includes(meta.path), `llms.txt is missing source-backed route ${meta.path}.`);
  check(
    mappedGuideCollections.has(collectionId),
    `No guide currently maps back to source-backed collection ${collectionId}.`,
  );
}

for (const place of seedData.sourceBackedPlaces) {
  checkNonEmpty(
    place.officialSourceUrl,
    `Source-backed place ${place.slug} is missing officialSourceUrl.`,
  );
  checkNonEmpty(
    place.sourceCheckedAt,
    `Source-backed place ${place.slug} is missing sourceCheckedAt.`,
  );
  check(
    place.correctionPath === "/editorial-standards",
    `Source-backed place ${place.slug} should point corrections to /editorial-standards.`,
  );
  check(
    place.verifiedFacts.length > 0,
    `Source-backed place ${place.slug} should include verifiedFacts.`,
  );
  check(
    place.claimBoundaries.length > 0,
    `Source-backed place ${place.slug} should include claimBoundaries.`,
  );
}

check(seedData.guides.length >= 10, "CityAtlas should keep at least 10 answer-first guides.");
check(collectionPaths.length >= 3, "CityAtlas should keep at least 3 source-backed collections.");

const report = {
  generatedAt: new Date().toISOString(),
  usefulPieceCount: seedData.guides.length + collectionPaths.length,
  guideCount: seedData.guides.length,
  sourceBackedCollectionCount: collectionPaths.length,
  sourceBackedPlaceCount: seedData.sourceBackedPlaces.length,
  mappedGuideCollectionCount: mappedGuideCollections.size,
  guideResourceLinkedCount: seedData.guides.filter((guide) => (guide.resourceLinks?.length ?? 0) > 0)
    .length,
  failures,
  passed: failures.length === 0,
};

mkdirSync(join(root, "output/seo"), { recursive: true });
writeFileSync(
  join(root, "output/seo/local-content-machine-proof.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log("CityAtlas SEO content-machine proof");
console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
