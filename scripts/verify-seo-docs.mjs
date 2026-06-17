import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import {
  buildCityBusinessRollups,
  buildDefaultBusinessProspects,
  buildDefaultCityRolloutTargets,
} from "../src/lib/cityGrowth.ts";
import { isBusinessProspectPromotionCandidate } from "../src/lib/businessProspectOps.ts";
import {
  getSourceBackedCollectionForGuide,
  sourceBackedCollectionMeta,
} from "../src/lib/sourceBackedCollections.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const seoDocsDir = join(root, "docs/seo-aeo-geo");
const readmePath = join(root, "README.md");
const structureProofPath = join(root, "output/seo/local-structure-proof.json");
const outputDir = join(root, "output/seo");

const guideCount = seedData.guides.length;
const sourceBackedCollectionCount = Object.keys(sourceBackedCollectionMeta).length;
const sourceBackedPlaceCount = seedData.sourceBackedPlaces.length;
const usefulPieceCount = guideCount + sourceBackedCollectionCount;
const cityRolloutTargets = buildDefaultCityRolloutTargets();
const businessProspects = buildDefaultBusinessProspects(seedData);
const cityRollups = buildCityBusinessRollups({
  businessProspects,
  cityRolloutTargets,
  guides: seedData.guides,
});
const seededCities = cityRollups.filter((rollup) => rollup.totalProspects > 0);
const vancouverRollup = cityRollups.find((rollup) => rollup.cityKey === "vancouver");
const vancouverPromotionCandidates = businessProspects.filter(
  (prospect) =>
    prospect.cityKey === "vancouver" &&
    isBusinessProspectPromotionCandidate(prospect),
);
const guideResourceLinkedCount = seedData.guides.filter(
  (guide) => Array.isArray(guide.resourceLinks) && guide.resourceLinks.length > 0,
).length;
const mappedGuideCollectionCount = new Set(
  seedData.guides
    .map((guide) => getSourceBackedCollectionForGuide(guide))
    .filter((value) => value !== null),
).size;
const structureProof = existsSync(structureProofPath)
  ? JSON.parse(readFileSync(structureProofPath, "utf8"))
  : null;
const checkedRouteCount = Number(structureProof?.checkedRouteCount ?? 0);

const failures = [];

function walkMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(path));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path);
    }
  }
  return files;
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function relative(path) {
  return path.replace(`${root}/`, "");
}

const requiredPacketPaths = [
  "docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md",
  "docs/seo-aeo-geo/CITY_ROLLOUT_READINESS_PACKET.md",
  "docs/seo-aeo-geo/EXA_DISCOVERY_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_FIRST_BATCH_PACKET.md",
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_CONNECTOR_WARM_PATH_PACKET.md",
  "docs/seo-aeo-geo/CITY_CONNECTOR_WARM_PATH_PACKET.md",
];

for (const packet of requiredPacketPaths) {
  check(existsSync(join(root, packet)), `Missing required packet ${packet}.`);
}

const filesWithCurrentTruth = [
  "docs/seo-aeo-geo/CURRENT_LOCAL_PROOF_SNAPSHOT.md",
  "docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/FIRST_TIME_VISITOR_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/WELLNESS_RESET_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/OUT_OF_TOWN_GUEST_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/WEEKEND_ROUTE_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/SUNDAY_PLAN_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/GARDEN_DAY_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/STARTER_PACK_GUIDE_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTE_CHOOSER_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/CITY_ROLLOUT_READINESS_PACKET.md",
  "docs/seo-aeo-geo/EXA_DISCOVERY_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_FIRST_BATCH_PACKET.md",
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_CONNECTOR_WARM_PATH_PACKET.md",
  "docs/seo-aeo-geo/CITY_CONNECTOR_WARM_PATH_PACKET.md",
];

for (const file of filesWithCurrentTruth) {
  const contents = readFileSync(join(root, file), "utf8");
  check(
    contents.includes(`\`${usefulPieceCount}\` useful pieces`),
    `${file} is missing current useful-piece truth ${usefulPieceCount}.`,
  );
  check(
    contents.includes(`\`${guideCount}\` guides`) ||
      contents.includes(`\`${guideCount}\` answer-first guides`),
    `${file} is missing current guide truth ${guideCount}.`,
  );
  check(
    contents.includes(`\`${sourceBackedCollectionCount}\` source-backed wedge collections`) ||
      contents.includes(`\`${sourceBackedCollectionCount}\` source-backed wedges in the local package`),
    `${file} is missing current source-backed collection truth ${sourceBackedCollectionCount}.`,
  );
  check(
    contents.includes(`\`${sourceBackedPlaceCount}\` source-backed anchors`) ||
      contents.includes(`\`${sourceBackedPlaceCount}\` source-backed place anchors`),
    `${file} is missing current source-backed anchor truth ${sourceBackedPlaceCount}.`,
  );
}

const releaseFilesWithMappingTruth = [
  "docs/seo-aeo-geo/CURRENT_LOCAL_PROOF_SNAPSHOT.md",
  "docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_LOCAL_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/UBC_DISCOVERY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_FIRST_BATCH_PACKET.md",
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md",
];

for (const file of releaseFilesWithMappingTruth) {
  const contents = readFileSync(join(root, file), "utf8");
  check(
    contents.includes(`\`${mappedGuideCollectionCount}\` mapped guide-to-collection links`) ||
      contents.includes(`\`${mappedGuideCollectionCount}\` mapped guide collections`),
    `${file} is missing current mapped guide-to-collection truth ${mappedGuideCollectionCount}.`,
  );
}

const forbiddenPhrases = [
  "full five-queue source-backed ladder",
  "behind the seven source-backed queues",
];

check(Boolean(structureProof), "Missing required structure-proof artifact output/seo/local-structure-proof.json.");
check(checkedRouteCount > 0, "Structure-proof artifact is missing checkedRouteCount.");

for (const file of [readmePath, ...walkMarkdownFiles(seoDocsDir)]) {
  const contents = readFileSync(file, "utf8");
  for (const phrase of forbiddenPhrases) {
    check(!contents.includes(phrase), `${relative(file)} still contains stale phrase: "${phrase}".`);
  }
}

const docsThatMustMentionDirectLinkTruth = [
  "docs/seo-aeo-geo/CURRENT_LOCAL_PROOF_SNAPSHOT.md",
  "docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_FIRST_BATCH_PACKET.md",
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md",
];

for (const file of docsThatMustMentionDirectLinkTruth) {
  const contents = readFileSync(join(root, file), "utf8");
  check(
    contents.includes(`\`${guideResourceLinkedCount}\` guides with direct-path internal links`) ||
      contents.includes(`all \`${guideResourceLinkedCount}\` current guides now have at least one direct-path internal link`) ||
      contents.includes(`all \`${guideResourceLinkedCount}\` guides currently have at least one direct-path internal link`),
    `${file} is missing current direct-path internal-link truth ${guideResourceLinkedCount}.`,
  );
}

const docsThatMustMentionStructureRouteTruth = [
  "docs/seo-aeo-geo/CURRENT_LOCAL_PROOF_SNAPSHOT.md",
  "docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_FIRST_BATCH_PACKET.md",
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md",
];

for (const file of docsThatMustMentionStructureRouteTruth) {
  const contents = readFileSync(join(root, file), "utf8");
  check(
    contents.includes(`checked route count: \`${checkedRouteCount}\``) ||
      contents.includes(`across \`${checkedRouteCount}\` key routes`) ||
      contents.includes(`passes across \`${checkedRouteCount}\` key routes`),
    `${file} is missing current structure route-count truth ${checkedRouteCount}.`,
  );
}

const queuedHostedGapDocs = [
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md",
  "docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md",
];

for (const file of queuedHostedGapDocs) {
  const contents = readFileSync(join(root, file), "utf8");
  check(contents.includes("hosted `sitemap.xml`"), `${file} is missing hosted sitemap truth.`);
  check(contents.includes("hosted `llms.txt`"), `${file} is missing hosted llms truth.`);
  check(
    contents.includes("hosted canonical and JSON-LD behavior") ||
      contents.includes("hosted canonical, title, description, and JSON-LD behavior") ||
      contents.includes("hosted title, description, robots, canonical, and JSON-LD behavior"),
    `${file} is missing hosted metadata/canonical gap truth.`,
  );
  check(contents.includes("guide-to-collection"), `${file} is missing guide-to-collection gap truth.`);
}

const docsThatMustReferenceProofStack = [
  "docs/seo-aeo-geo/CURRENT_LOCAL_PROOF_SNAPSHOT.md",
  "docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md",
  "docs/seo-aeo-geo/README.md",
];

for (const file of docsThatMustReferenceProofStack) {
  const contents = readFileSync(join(root, file), "utf8");
  check(contents.includes("npm run seo:proof:stack"), `${file} is missing the aggregate proof-stack command.`);
  check(
    contents.includes("output/seo/local-proof-stack.json"),
    `${file} is missing the aggregate proof-stack artifact path.`,
  );
}

const docsThatMustReferenceDocProofArtifact = [
  "docs/seo-aeo-geo/CURRENT_LOCAL_PROOF_SNAPSHOT.md",
  "docs/seo-aeo-geo/README.md",
];

for (const file of docsThatMustReferenceDocProofArtifact) {
  const contents = readFileSync(join(root, file), "utf8");
  check(
    contents.includes("output/seo/local-doc-proof.json"),
    `${file} is missing the local doc-proof artifact path.`,
  );
}

const growthPacketDocs = [
  "docs/seo-aeo-geo/CITY_ROLLOUT_READINESS_PACKET.md",
  "docs/seo-aeo-geo/EXA_DISCOVERY_APPROVAL_PACKET.md",
  "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md",
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md",
];

for (const file of growthPacketDocs) {
  const contents = readFileSync(join(root, file), "utf8");
  check(
    contents.includes(`\`${cityRolloutTargets.length}\` city targets`),
    `${file} is missing current city-target truth ${cityRolloutTargets.length}.`,
  );
  check(
    contents.includes(`\`${seededCities.length}\` seeded cities`),
    `${file} is missing current seeded-city truth ${seededCities.length}.`,
  );
}

const exaPacketContents = readFileSync(
  join(root, "docs/seo-aeo-geo/EXA_DISCOVERY_APPROVAL_PACKET.md"),
  "utf8",
);
const vancouverBusinessMachineContents = readFileSync(
  join(root, "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md"),
  "utf8",
);
const vancouverOutreachPrepContents = readFileSync(
  join(root, "docs/seo-aeo-geo/VANCOUVER_OUTREACH_PREP_PACKET.md"),
  "utf8",
);
const cityRolloutOperatorContents = readFileSync(
  join(root, "docs/seo-aeo-geo/CITY_ROLLOUT_OPERATOR_PACKET.md"),
  "utf8",
);
const followOnCityLadderContents = readFileSync(
  join(root, "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md"),
  "utf8",
);
const vancouverConnectorPacketContents = readFileSync(
  join(root, "docs/seo-aeo-geo/VANCOUVER_CONNECTOR_WARM_PATH_PACKET.md"),
  "utf8",
);
const cityConnectorPacketContents = readFileSync(
  join(root, "docs/seo-aeo-geo/CITY_CONNECTOR_WARM_PATH_PACKET.md"),
  "utf8",
);
check(
  exaPacketContents.includes("discovery-only"),
  "docs/seo-aeo-geo/EXA_DISCOVERY_APPROVAL_PACKET.md is missing discovery-only guardrail truth.",
);
check(
  exaPacketContents.includes("owner inbox rehearsal"),
  "docs/seo-aeo-geo/EXA_DISCOVERY_APPROVAL_PACKET.md is missing owner inbox rehearsal guardrail truth.",
);
if (vancouverRollup) {
  check(
    vancouverBusinessMachineContents.includes(`\`${vancouverRollup.totalProspects}\` unique Vancouver prospect rows`),
    "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md is missing current Vancouver queue truth.",
  );
  check(
    vancouverBusinessMachineContents.includes(`\`${vancouverRollup.contactReadyCount}\` contact-ready rows`),
    "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md is missing current Vancouver contact-ready truth.",
  );
  check(
    vancouverBusinessMachineContents.includes(`\`${vancouverPromotionCandidates.length}\` non-email partner rows`),
    "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md is missing current Vancouver promotion-candidate truth.",
  );
}
check(
  vancouverOutreachPrepContents.includes("vancouver-promotion-candidates.csv"),
  "docs/seo-aeo-geo/VANCOUVER_OUTREACH_PREP_PACKET.md is missing the Vancouver promotion-candidate export.",
);
check(
  vancouverOutreachPrepContents.includes("vancouver-contact-path-review-prospects.csv"),
  "docs/seo-aeo-geo/VANCOUVER_OUTREACH_PREP_PACKET.md is missing the Vancouver contact-path review export.",
);
check(
  vancouverOutreachPrepContents.includes("vancouver-needs-research-prospects.csv"),
  "docs/seo-aeo-geo/VANCOUVER_OUTREACH_PREP_PACKET.md is missing the Vancouver needs-research export.",
);
check(
  cityRolloutOperatorContents.includes("follow-on-city-contact-path-review-prospects.csv"),
  "docs/seo-aeo-geo/CITY_ROLLOUT_OPERATOR_PACKET.md is missing the follow-on contact-path review export.",
);
check(
  cityRolloutOperatorContents.includes("follow-on-city-promotion-candidates.csv"),
  "docs/seo-aeo-geo/CITY_ROLLOUT_OPERATOR_PACKET.md is missing the follow-on promotion-candidate export.",
);
check(
  followOnCityLadderContents.includes("follow-on-city-batch-briefs.json"),
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md is missing the follow-on batch-brief export.",
);
check(
  followOnCityLadderContents.includes("follow-on-city-first-batch-candidates.csv"),
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md is missing the follow-on first-batch candidate export.",
);
check(
  followOnCityLadderContents.includes("owner-inbox rehearsal") ||
    followOnCityLadderContents.includes("Owner inbox rehearsal"),
  "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md is missing owner-inbox rehearsal truth.",
);
check(
  vancouverConnectorPacketContents.includes("vancouver-connector-warm-paths.csv"),
  "docs/seo-aeo-geo/VANCOUVER_CONNECTOR_WARM_PATH_PACKET.md is missing the Vancouver connector export.",
);
check(
  cityConnectorPacketContents.includes("follow-on-city-connector-warm-paths.csv"),
  "docs/seo-aeo-geo/CITY_CONNECTOR_WARM_PATH_PACKET.md is missing the follow-on connector export.",
);
check(
  cityConnectorPacketContents.includes("city-connector-warm-paths.json"),
  "docs/seo-aeo-geo/CITY_CONNECTOR_WARM_PATH_PACKET.md is missing the connector summary artifact.",
);

const report = {
  generatedAt: new Date().toISOString(),
  usefulPieceCount,
  guideCount,
  sourceBackedCollectionCount,
  sourceBackedPlaceCount,
  mappedGuideCollectionCount,
  guideResourceLinkedCount,
  checkedRouteCount,
  checkedFiles: filesWithCurrentTruth.length,
  failures,
  passed: failures.length === 0,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "local-doc-proof.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log("CityAtlas SEO doc-proof");
console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
