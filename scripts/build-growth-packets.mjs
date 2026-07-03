import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import {
  buildCityRolloutInsights,
  buildCityBusinessRollups,
  buildDefaultBusinessProspects,
  buildDefaultCityRolloutTargets,
  businessProspectImportHeaders,
  classifyBusinessProspectRole,
  listUnseededCityInsights,
  rankFollowOnCityInsights,
} from "../src/lib/cityGrowth.ts";
import {
  buildBusinessProofCandidate,
  buildBusinessOwnerInboxBrief,
  buildBusinessProofBatchBrief,
} from "../src/lib/businessOutreachPrep.ts";
import {
  buildBusinessProspectPromotionLaneCounts,
  getBusinessProspectNextStep,
  getBusinessProspectPromotionLabel,
  getBusinessProspectPromotionLane,
  getBusinessProspectPromotionScore,
  isBusinessProspectPromotionCandidate,
} from "../src/lib/businessProspectOps.ts";
import {
  buildConnectorCityRollups,
  buildNamedConnectorLaneSummaries,
  listConnectorWarmPathRows,
  listNamedConnectorRows,
  listOrganizationConnectorRows,
} from "../src/lib/cityConnectorWarmPaths.ts";
import {
  buildCityOutreachRehearsalRollups,
  listOutreachOutcomeRows,
  listOutreachWindowRows,
} from "../src/lib/cityOutreachRehearsalTruth.ts";
import { getSourceBackedCollectionForGuide } from "../src/lib/sourceBackedCollections.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docsDir = join(root, "docs/seo-aeo-geo");
const outputDir = join(root, "output/growth");
const structureProofPath = join(root, "output/seo/local-structure-proof.json");

const generatedAt = new Date().toISOString();
const formattedDate = new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
  new Date(generatedAt),
);

function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function formatCityNameList(cityNames) {
  if (cityNames.length === 0) return "";
  if (cityNames.length === 1) return cityNames[0];
  if (cityNames.length === 2) return `${cityNames[0]} and ${cityNames[1]}`;
  return `${cityNames.slice(0, -1).join(", ")}, and ${cityNames.at(-1)}`;
}

const cityRolloutTargets = buildDefaultCityRolloutTargets();
const businessProspects = buildDefaultBusinessProspects(seedData);
const cityRollups = buildCityBusinessRollups({
  businessProspects,
  cityRolloutTargets,
  guides: seedData.guides,
});
const cityRolloutInsights = buildCityRolloutInsights(cityRollups, cityRolloutTargets);
const seededCities = cityRollups.filter((rollup) => rollup.totalProspects > 0);
const preparedCities = cityRollups.filter((rollup) => rollup.status === "Prepared");
const buildingCities = cityRollups.filter((rollup) => rollup.status === "Building");
const queuedCities = cityRollups.filter((rollup) => rollup.status === "Queued");
const vancouverRollup = cityRollups.find((rollup) => rollup.cityKey === "vancouver");
const businessBatch = buildBusinessProofBatchBrief(businessProspects, "vancouver");
const ownerInboxBrief = buildBusinessOwnerInboxBrief(businessBatch);
const vancouverProspects = businessProspects.filter((prospect) => prospect.cityKey === "vancouver");
const vancouverEmailReadyProspects = vancouverProspects.filter(
  (prospect) => prospect.contactReadiness === "email_ready" && prospect.email.trim(),
);
const vancouverContactPathReadyProspects = vancouverProspects.filter(
  (prospect) => prospect.contactReadiness === "contact_path_ready",
);
const vancouverNeedsResearchProspects = vancouverProspects.filter(
  (prospect) => prospect.contactReadiness === "needs_research",
);
const vancouverPromotionCandidates = vancouverProspects.filter((prospect) =>
  isBusinessProspectPromotionCandidate(prospect),
);
const followOnEmailReadyProspects = businessProspects.filter(
  (prospect) =>
    prospect.cityKey !== "vancouver" &&
    prospect.contactReadiness === "email_ready" &&
    prospect.email.trim(),
);
const followOnContactPathReadyProspects = businessProspects.filter(
  (prospect) =>
    prospect.cityKey !== "vancouver" &&
    prospect.contactReadiness === "contact_path_ready",
);
const followOnPromotionCandidates = businessProspects.filter(
  (prospect) =>
    prospect.cityKey !== "vancouver" &&
    isBusinessProspectPromotionCandidate(prospect),
);
const connectorCityRollups = buildConnectorCityRollups(businessProspects);
const connectorRollupByCityKey = new Map(
  connectorCityRollups.map((rollup) => [rollup.cityKey, rollup]),
);
const vancouverConnectorRollup = connectorRollupByCityKey.get("vancouver");
const vancouverConnectorRows = listConnectorWarmPathRows("vancouver");
const vancouverNamedConnectorRows = listNamedConnectorRows("vancouver");
const vancouverOrganizationConnectorRows = listOrganizationConnectorRows("vancouver");
const vancouverNamedConnectorLaneSummaries = buildNamedConnectorLaneSummaries("vancouver");
const followOnConnectorRows = listOrganizationConnectorRows().filter(
  (row) => row.cityKey !== "vancouver",
);
const connectorCoveredCityRollups = connectorCityRollups.filter(
  (rollup) => rollup.cityKey !== "vancouver" && rollup.organizationConnectorCount > 0,
);
const connectorGapCityRollups = cityRollups.filter(
  (rollup) =>
    rollup.cityKey !== "vancouver" &&
    rollup.totalProspects > 0 &&
    !connectorRollupByCityKey.has(rollup.cityKey),
);
const outreachRehearsalRollups = buildCityOutreachRehearsalRollups(businessProspects);
const outreachRehearsalRollupByCityKey = new Map(
  outreachRehearsalRollups.map((rollup) => [rollup.cityKey, rollup]),
);
const vancouverOutreachRehearsalRollup = outreachRehearsalRollupByCityKey.get("vancouver");
const torontoOutreachRehearsalRollup = outreachRehearsalRollupByCityKey.get("toronto");
const vancouverOutreachWindowRows = listOutreachWindowRows("vancouver", businessProspects);
const followOnOutreachWindowRows = listOutreachWindowRows(undefined, businessProspects).filter(
  (row) => row.cityKey !== "vancouver",
);
const vancouverOutreachOutcomeRows = listOutreachOutcomeRows("vancouver", businessProspects);
const businessProspectById = new Map(businessProspects.map((prospect) => [prospect.id, prospect]));

const sourceBackedCollectionCount = new Set(
  seedData.sourceBackedPlaces.map((place) => place.collection),
).size;
const sourceBackedPlaceCount = seedData.sourceBackedPlaces.length;
const guideCount = seedData.guides.length;
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

if (!vancouverRollup) {
  throw new Error("Missing Vancouver rollout truth.");
}

if (!vancouverConnectorRollup) {
  throw new Error("Missing Vancouver connector warm-path truth.");
}

if (!vancouverOutreachRehearsalRollup) {
  throw new Error("Missing Vancouver outreach rehearsal truth.");
}

const followOnCityInsights = rankFollowOnCityInsights(cityRolloutInsights);
const followOnBatchInsights = followOnCityInsights.slice(0, 8).map((insight) => {
  const batch = buildBusinessProofBatchBrief(businessProspects, insight.rollup.cityKey);
  const ownerInbox = buildBusinessOwnerInboxBrief(batch);

  return {
    insight,
    batch,
    ownerInbox,
  };
});
const zeroSeedCityInsights = listUnseededCityInsights(cityRolloutInsights);
const followOnOwnerInboxReadyCount = followOnBatchInsights.filter(
  ({ ownerInbox }) => ownerInbox.blockedBy.length === 0,
).length;
const followOnThresholdReadyCount = followOnBatchInsights.filter(
  ({ insight }) => insight.missingThresholds.length === 0,
).length;
const followOnCombinedReadyCount = followOnBatchInsights.filter(
  ({ insight, ownerInbox }) =>
    insight.missingThresholds.length === 0 && ownerInbox.blockedBy.length === 0,
).length;
const followOnActivePacketCount = followOnBatchInsights.filter(({ insight }) =>
  insight.target?.phase !== "later_global_wave",
).length;
const followOnResearchOnlyPacketCount = followOnBatchInsights.filter(({ insight }) =>
  insight.target?.phase === "later_global_wave",
).length;
const followOnActiveOwnerInboxReadyCount = followOnBatchInsights.filter(
  ({ insight, ownerInbox }) =>
    insight.target?.phase !== "later_global_wave" && ownerInbox.blockedBy.length === 0,
).length;
const followOnResearchOnlyOwnerInboxReadyCount = followOnBatchInsights.filter(
  ({ insight, ownerInbox }) =>
    insight.target?.phase === "later_global_wave" && ownerInbox.blockedBy.length === 0,
).length;

const vancouverSourceLaneCounts = businessProspects
  .filter((prospect) => prospect.cityKey === "vancouver")
  .reduce((counts, prospect) => {
    const key = prospect.sourceLabel || "Unknown source lane";
    counts.set(key, (counts.get(key) || 0) + 1);
    return counts;
  }, new Map());

const vancouverSourceLanes = [...vancouverSourceLaneCounts.entries()]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));

const vancouverSourceBackedAnchorCount = vancouverProspects.filter(
  (prospect) => prospect.sourceType === "source_backed_place",
).length;
const vancouverFounderProofCount = vancouverProspects.filter(
  (prospect) => prospect.sourceType === "proof_candidate",
).length;
const vancouverRoamPartnerSeedCount = vancouverProspects.filter(
  (prospect) => /Roam partner research donor/i.test(prospect.sourceLabel),
).length;
const vancouverRoamPublicBusinessWaveCount = vancouverProspects.filter(
  (prospect) => /Roam public business wave donor/i.test(prospect.sourceLabel),
).length;
const vancouverRoamCitySourcingCount = vancouverProspects.filter(
  (prospect) => /Roam city-sourcing donor/i.test(prospect.sourceLabel),
).length;
const vancouverRoomsVenueSeedCount = vancouverProspects.filter(
  (prospect) =>
    /Rooms host-space donor/i.test(prospect.sourceLabel) &&
    !/review donor/i.test(prospect.sourceLabel),
).length;
const vancouverRoomsReviewSeedCount = vancouverProspects.filter(
  (prospect) => /Rooms host-space review donor/i.test(prospect.sourceLabel),
).length;
const vancouverRoomsReviewContactPathReadyCount = vancouverProspects.filter(
  (prospect) =>
    /Rooms host-space review donor/i.test(prospect.sourceLabel) &&
    prospect.contactReadiness === "contact_path_ready",
).length;
const vancouverRoomsReviewNeedsResearchCount = vancouverProspects.filter(
  (prospect) =>
    /Rooms host-space review donor/i.test(prospect.sourceLabel) &&
    prospect.contactReadiness === "needs_research",
).length;

const sharedPatternCounts = cityRolloutTargets.reduce((counts, target) => {
  counts.set(target.sharedPattern, (counts.get(target.sharedPattern) || 0) + 1);
  return counts;
}, new Map());

const phaseCounts = cityRolloutTargets.reduce((counts, target) => {
  counts.set(target.phase, (counts.get(target.phase) || 0) + 1);
  return counts;
}, new Map());

const vancouverLaneBreakdown = buildBusinessProspectPromotionLaneCounts(vancouverProspects);
const vancouverPromotionLaneBreakdown = buildBusinessProspectPromotionLaneCounts(
  vancouverPromotionCandidates,
);

const vancouverEmailSegmentCounts = vancouverEmailReadyProspects.reduce((counts, prospect) => {
  const label = `${prospect.category} / ${prospect.segment}`;
  counts.set(label, (counts.get(label) || 0) + 1);
  return counts;
}, new Map());

const followOnEmailCityCounts = followOnEmailReadyProspects.reduce((counts, prospect) => {
  counts.set(prospect.cityName, (counts.get(prospect.cityName) || 0) + 1);
  return counts;
}, new Map());
const followOnPromotionCityCounts = followOnPromotionCandidates.reduce((counts, prospect) => {
  counts.set(prospect.cityName, (counts.get(prospect.cityName) || 0) + 1);
  return counts;
}, new Map());

const vancouverTopEmailSegments = [...vancouverEmailSegmentCounts.entries()]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  .slice(0, 8);

const followOnEmailCityBreakdown = [...followOnEmailCityCounts.entries()]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
const followOnPromotionCityBreakdown = [...followOnPromotionCityCounts.entries()]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
const preparedCityNames = preparedCities.map((rollup) => rollup.cityName);

function formatPercent(value) {
  return `${value}%`;
}

function formatLabel(value) {
  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderCityThresholds(insight) {
  const target = insight.target;
  if (!target) return "Missing target thresholds.";

  return [
    `${target.minimumPreparedBusinesses} unique prospects`,
    `${target.minimumPartnerCandidates} partner-eligible rows`,
    `${target.minimumContactReadyBusinesses} contact-ready rows`,
    `${target.minimumSourceBackedCollections} source-backed collection starter`,
  ].join(", ");
}

function escapeCsv(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(headers, rows) {
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ].join("\n");
}

function renderSharedPatternLabel(pattern) {
  switch (pattern) {
    case "shared_with_roam_and_rooms":
      return "Shared with Roam and Rooms";
    case "shared_with_roam":
      return "Shared with Roam only";
    case "shared_with_rooms":
      return "Shared with Rooms only";
    default:
      return formatLabel(pattern);
  }
}

function renderPhaseLabel(phase) {
  switch (phase) {
    case "proof_city":
      return "Proof city";
    case "next_wave":
      return "Next wave";
    case "expansion_wave":
      return "Expansion wave";
    case "later_global_wave":
      return "Later global wave";
    default:
      return formatLabel(phase);
  }
}

function renderThresholdGapSummary(missingThresholds) {
  return missingThresholds.length > 0
    ? missingThresholds.map((gap) => `${gap.remaining} more ${gap.label}`).join("; ")
    : "No local threshold gap remains.";
}

function getFollowOnPacketMode(insight) {
  return insight.target?.phase === "later_global_wave"
    ? "research_only"
    : "active_follow_on";
}

function getFollowOnEffectiveOwnerInboxStatus(insight, ownerInbox) {
  if (getFollowOnPacketMode(insight) === "research_only") {
    return "Held for later-wave research only";
  }
  return ownerInbox.title;
}

function getFollowOnEffectiveNextAction(insight, batch, ownerInbox) {
  if (getFollowOnPacketMode(insight) === "research_only") {
    return "Keep this city in donor-truth and template mode until earlier North American proof is stronger.";
  }
  return ownerInbox.blockedBy.length === 0
    ? batch.nextAction
    : ownerInbox.nextAction;
}

function renderCurrentSharedMachineTruthBlock() {
  return [
    "<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->",
    "## Current Shared Machine Truth",
    "",
    `- Synced ${formattedDate} from current repo truth.`,
    `- \`${usefulPieceCount}\` useful pieces`,
    `- \`${guideCount}\` guides`,
    `- \`${sourceBackedCollectionCount}\` source-backed wedge collections`,
    `- \`${sourceBackedPlaceCount}\` source-backed anchors`,
    `- \`${mappedGuideCollectionCount}\` mapped guide-to-collection links`,
    `- all \`${guideResourceLinkedCount}\` current guides now have at least one direct-path internal link into another CityAtlas page.`,
    `- \`npm run seo:structure:proof\` currently passes across \`${checkedRouteCount}\` key routes.`,
    "<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->",
  ].join("\n");
}

function renderRolloutPacket() {
  const topFollowOnBlock = followOnCityInsights
    .slice(0, 8)
    .map((insight, index) => {
      const { rollup, target, missingThresholds } = insight;
      return [
        `### ${index + 1}. ${rollup.cityName}`,
        "",
        `- Status: \`${rollup.status}\``,
        `- Progress: \`${formatPercent(rollup.progress)}\``,
        `- Current queue: \`${rollup.totalProspects}\` unique, \`${rollup.partnerCandidateCount}\` partner-eligible, \`${rollup.contactReadyCount}\` contact-ready, \`${rollup.emailReadyCount}\` email-ready`,
        `- Promotion-candidate rows: \`${followOnPromotionCityCounts.get(rollup.cityName) || 0}\` non-email partner rows with a clear next manual step`,
        `- Release threshold: ${renderCityThresholds(insight)}`,
        `- Planned wedge: ${target?.wedge || "Missing target wedge"}`,
        `- Why it belongs in the queue: ${target?.rationale || "Missing target rationale"}`,
        `- Missing before it can count as locally prepared: ${renderThresholdGapSummary(missingThresholds)}`,
        `- Current next action: ${rollup.nextAction}`,
      ].join("\n");
    })
    .join("\n\n");

  const zeroSeedBlock =
    zeroSeedCityInsights.length > 0
      ? zeroSeedCityInsights
          .map((insight) => {
            const { rollup, target } = insight;
            return `- ${rollup.cityName}: ${target?.wedge || "Missing wedge"} (${target?.sharedPattern || "pattern unknown"})`;
          })
          .join("\n")
      : "- Every current target city has at least one local queue row.";

  const sourceLaneBlock = vancouverSourceLanes
    .map(([lane, count]) => `- ${lane}: \`${count}\` Vancouver rows`)
    .join("\n");

  return `# CityAtlas Multi-City Rollout Readiness Packet

Updated: ${formattedDate}

Generated from local repo truth by \`npm run growth:packets\`.

## Current Local Proof Basis

- \`npm run growth:verify\` is the baseline local machine check for rollout and queue truth.
- \`${usefulPieceCount}\` useful pieces
- \`${guideCount}\` answer-first guides
- \`${sourceBackedCollectionCount}\` source-backed wedge collections
- \`${sourceBackedPlaceCount}\` source-backed place anchors
- \`${cityRolloutTargets.length}\` city targets in the reusable rollout map
- \`${seededCities.length}\` seeded cities already have at least one local business queue
- \`${preparedCities.length}\` prepared ${pluralize(preparedCities.length, "city")}
- \`${buildingCities.length}\` building cities
- \`${queuedCities.length}\` queued cities with no seeded rows yet

## Vancouver Proof City Truth

- Vancouver status: \`${vancouverRollup.status}\`
- Vancouver progress: \`${formatPercent(vancouverRollup.progress)}\`
- Vancouver queue: \`${vancouverRollup.totalProspects}\` unique prospects
- Vancouver partner-eligible rows: \`${vancouverRollup.partnerCandidateCount}\`
- Vancouver anchor-only rows: \`${vancouverRollup.anchorOnlyCount}\`
- Vancouver contact-ready rows: \`${vancouverRollup.contactReadyCount}\`
- Vancouver email-ready rows: \`${vancouverRollup.emailReadyCount}\`
- Vancouver source-backed collections: \`${vancouverRollup.sourceBackedCollections}\`
- Vancouver proof-batch selected count: \`${businessBatch.selectedCount}\`
- Vancouver rehearsal-ready candidates: \`${businessBatch.rehearsalReadyCount}\`
- Owner inbox rehearsal status: \`${ownerInboxBrief.title}\`

## Vancouver Source Lanes

${sourceLaneBlock}

## Strongest Follow-On Cities From Current Queue Truth

${topFollowOnBlock}

## Cities Still Missing Seed Rows

${zeroSeedBlock}

## Release Rule For Every City

- Keep the city queue local and no-send first.
- Add one useful city wedge before broad city copy.
- Prefer official public contact paths over guessed personal contacts.
- Keep real-business claims review-first until a route, source policy, and contact proof all line up.
- Treat outreach readiness as separate from publication readiness.

## What Is Still Unverified

- No non-Vancouver public city release is live yet.
- No non-Vancouver source-backed collection has hosted smoke proof.
- No EXA-powered or paid discovery batch has been approved or run.
- No multi-city outreach, CRM sync, or provider send is approved from CityAtlas.

## Best Next Local Move

1. Keep Vancouver as the proof city while widening only the business rows that improve the public city surface or the first tiny review-first outreach packet.
2. Use Toronto, New York, Los Angeles, and Miami as the strongest next queue candidates because their local counts are already closest to threshold.
3. Use the follow-on outreach ladder packet for exact 3 to 5 local rehearsal candidates per city instead of treating raw queue counts as enough.
4. Keep the lower-seed later-wave cities in template and query-map mode until the first non-Vancouver city gets a real source-backed wedge packet.
`;
}

function renderVancouverBusinessMachinePacket() {
  const sourceLaneBlock = vancouverSourceLanes
    .map(([lane, count]) => `- ${lane}: \`${count}\` Vancouver rows`)
    .join("\n");
  const promotionLaneBlock = vancouverPromotionLaneBreakdown.length > 0
    ? vancouverPromotionLaneBreakdown
        .map(([lane, count]) => `- ${getBusinessProspectPromotionLabel(lane)}: \`${count}\` Vancouver rows`)
        .join("\n")
    : "- No non-email promotion candidates are staged yet.";

  const followOnBlock = followOnCityInsights
    .slice(0, 6)
    .map((insight) => {
      const { rollup } = insight;
      return `- ${rollup.cityName}: \`${rollup.totalProspects}\` unique, \`${rollup.contactReadyCount}\` contact-ready, \`${rollup.emailReadyCount}\` email-ready`;
    })
    .join("\n");

  return `# Vancouver Business Machine Packet

Updated: ${formattedDate}

## Current Local Truth

Local proof from \`npm run growth:verify\` now shows:

- \`${vancouverRollup.totalProspects}\` unique Vancouver prospect rows
- \`${vancouverRollup.partnerCandidateCount}\` partner-eligible rows
- \`${vancouverRollup.anchorOnlyCount}\` anchor-only rows
- \`${vancouverRollup.contactReadyCount}\` contact-ready rows
- \`${vancouverRollup.emailReadyCount}\` email-ready rows
- \`${vancouverRollup.sourceBackedCollections}\` source-backed collection lanes still covered
- \`${vancouverRollup.guideCount}\` useful Vancouver guides in the current library
- \`${businessProspects.length}\` total staged business prospects across the shared CityAtlas machine
- all \`${seededCities.length}\` rollout cities now have at least one local no-send business queue
- \`${preparedCities.length}\` ${pluralize(preparedCities.length, "city", "cities")} currently ${pluralize(preparedCities.length, "meets", "meet")} the local prepared threshold${preparedCityNames.length > 0 ? `: ${formatCityNameList(preparedCityNames)}` : ""}

This packet is generated from current repo truth by \`npm run growth:packets\` so the Vancouver business machine no longer drifts behind the live local counts.

## What Counts As A Prospect Now

CityAtlas keeps three different kinds of Vancouver coverage visible:

1. \`anchor_only\`
   Source-backed city anchors that strengthen answer-first guidance but are not yet good outreach targets.

2. \`partner_and_anchor\`
   Places that help public city guidance and could also matter for a future partnership or visibility conversation.

3. \`partner_candidate\`
   Outreach-relevant rows from founder proof work, donor research, or later approved imports.

The admin console shows partner-eligible versus anchor-only counts so the business machine does not pretend every guide anchor is already a real business-development lead.

The admin console also keeps three guarded prep lanes:

- exact 3 to 5 target proof-batch selection with owner-inbox rehearsal rules
- local-only supervised execution staging with a tiny allowlist, dry-run review checkpoints, and one explicit live-review slot
- preview-only business reply rehearsal with protected local mirror entries and replay safety

## Seed Sources In The Machine

The current Vancouver queue is built from seven local layers:

- Source-backed CityAtlas anchors: \`${vancouverSourceBackedAnchorCount}\` rows
- Founder proof-sprint rows already staged inside CityAtlas: \`${vancouverFounderProofCount}\` rows
- Roam Relaxation donor seed layer imported from official-site partner research: \`${vancouverRoamPartnerSeedCount}\` rows
- Roam public-business-wave donor layer imported from saved Roam provider-discovery fixtures: \`${vancouverRoamPublicBusinessWaveCount}\` rows
- Synced Rooms Vancouver email-ready donor layer: \`${vancouverRoomsVenueSeedCount}\` rows
- Wider synced Rooms Vancouver review donor layer: \`${vancouverRoomsReviewSeedCount}\` rows
- Roam city-sourcing donor layer recovered from multiple qualifying preview artifacts: \`${vancouverRoamCitySourcingCount}\` rows

The wider Rooms Vancouver review donor layer adds:

- \`${vancouverRoomsReviewContactPathReadyCount}\` review-first contact-path-ready Vancouver rows
- \`${vancouverRoomsReviewNeedsResearchCount}\` research-only Vancouver rows
- Browserbase/manual-browser-only notes without turning contact-form rows into send-ready rows

The current Vancouver source lanes are:

${sourceLaneBlock}

## Promotion Lanes Closest To Rehearsal

- \`${vancouverPromotionCandidates.length}\` non-email partner rows already have a visible public route or a clear next manual step.

${promotionLaneBlock}

This keeps the next cleanup wave honest: CityAtlas can prioritize the rows closest to owner review instead of pretending every contact-path row is equally ready.

All donor rows remain local-only and labeled for re-verification before any outreach or public claim.

## Shared Univenture Rollout Pattern

The active CityAtlas city-target map currently covers \`${cityRolloutTargets.length}\` city targets, and all \`${seededCities.length}\` seeded cities already have at least one local queue row. Vancouver stays the proof city while the same queue-first pattern is prepared for the rest of the ladder.

Current strongest follow-on city queues:

${followOnBlock}

The rule stays the same for every city: build the internal queue first, keep it no-send, prove one useful city wedge, then package public release work behind a separate approval step.

## Discovery And Outreach Prep

CityAtlas is prepared for the same discovery and outreach discipline used elsewhere in Univenture:

- EXA stays discovery-only, not a send rail.
- Official/public business contact paths stay preferred over guessed personal emails.
- CityAtlas now also carries the Rooms rehearsal overlay: \`${vancouverOutreachRehearsalRollup.windowRowCount}\` Vancouver supervised-send-window rows matched to the current queue plus \`${vancouverOutreachRehearsalRollup.outcomeLedgerCount}\` borrowed outcome-ledger rows for bounce and suppression truth.
- The first real CityAtlas outreach batch should follow the Rooms pattern: a tiny exact-recipient manual proof batch, not volume.
- Owner-inbox rehearsal should happen before any real send so sender identity, subject line, and reply routing are checked safely.
- The supervised execution lane is now staged locally, but it remains non-sending and approval-gated.
- Gmail stays fallback and manual escalation only, not the main machine rail.
- The reply-memory path is Resend-first in structure but still preview-only locally.
- No automatic scraping run, provider send, live inbox webhook, CRM sync, or outreach send is active in CityAtlas right now.

Recommended future env prep only:

\`\`\`bash
EXA_API_KEY=
CITYATLAS_OUTREACH_MAILING_ADDRESS=
\`\`\`

Those values do not unlock sending by themselves.

## Safe Next Move

The next strongest local batch is:

1. Keep using the generated business machine packet and the deduped admin rollup as truth instead of older queue counts.
2. Use the new Vancouver and follow-on promotion-candidate exports to clean the exact rows closest to rehearsal before any later live outreach decision exists.
3. Keep Toronto, Los Angeles, New York, and Miami as the highest-leverage next-city queues while Vancouver keeps widening the proof-city business density.
4. Rehearse the preview-only reply rail locally so inbound packet matching, protected mirror truth, and replay safety are proven before any live inbox connector is even considered.
5. Keep the first CityAtlas-specific proof batch inside the Rooms-style tiny-batch and owner-inbox-rehearsal rules before any live outreach approval is considered.

${renderCurrentSharedMachineTruthBlock()}
`;
}

function renderVancouverBusinessFirstBatchPacket() {
  const candidateBlock = businessBatch.candidates
    .map((candidate, index) => {
      const prospect = businessProspectById.get(candidate.prospectId);
      const contactLine = candidate.contactRoute || "Needs cleaner public contact route";
      const website = prospect?.sourceUrl || prospect?.website || "Missing official source route";
      return [
        `### ${index + 1}. ${candidate.businessName}`,
        "",
        `- Lane: ${formatLabel(candidate.batchLane)} / ${candidate.segment.toLowerCase()}`,
        `- Contact path now: \`${contactLine}\``,
        `- Source route: \`${website}\``,
        `- Why this belongs: ${candidate.whyChosen}`,
        `- Current state: ${candidate.stage.toLowerCase()}, ${candidate.sourceLane.toLowerCase()}, reverify before any send`,
      ].join("\n");
    })
    .join("\n\n");

  return `# Vancouver Business First Batch Packet

Updated: ${formattedDate}

## Purpose

This is the first CityAtlas business-development packet for Vancouver. It is local-only and no-send.

It exists so CityAtlas can reuse the safer Rooms launch pattern:

- exact tiny batch
- exact public contact route
- exact reason each target belongs in the batch
- owner-inbox rehearsal before any outside send
- no automation, no volume, no contact-form submission, and no live outreach by default

## Batch Rules

- Keep the first batch to 3 to 5 targets.
- Use only public business contact paths already visible on official sources.
- Re-verify each address on the source page before any real send.
- Do one owner-inbox rehearsal first.
- Do not use EXA, Gmail, Resend, a CRM, or any other provider as a send rail from CityAtlas without a separate approval step.
- Keep the packet mixed across culture, hospitality, hotel/guest, event, and wellness lanes when the local queue supports it.

## Recommended First Batch

${candidateBlock}

## Owner-Inbox Rehearsal Rule

Before any real CityAtlas outreach approval:

1. Write one exact CityAtlas draft for one target.
2. Send that draft only to the owner inbox first.
3. Check sender identity, subject line, reply routing, tone, and footer.
4. Log the rehearsal result.
5. Only then decide whether a real 3 to 5 target manual batch is worth approving.

## What Still Needs Approval

- Any real send
- Any provider connection
- Any EXA-powered broad discovery run
- Any automated follow-up logic
- Any CRM sync
- Any contact-form submission
- Any public claim that these businesses are CityAtlas partners

${renderCurrentSharedMachineTruthBlock()}
`;
}

function renderExaPacket() {
  const prioritizedScopes = followOnCityInsights
    .slice(0, 5)
    .map((insight, index) => {
      const { rollup, target } = insight;
      return [
        `### ${index + 1}. ${rollup.cityName}`,
        "",
        `- Current status: \`${rollup.status}\` at \`${formatPercent(rollup.progress)}\` progress`,
        `- Current local queue: \`${rollup.totalProspects}\` unique, \`${rollup.contactReadyCount}\` contact-ready, \`${rollup.emailReadyCount}\` email-ready`,
        `- Why EXA would be useful here: ${target?.wedge || "Missing wedge"} still needs a first source-backed collection starter and deeper public-contact density.`,
        `- Guardrail: keep the batch small, review-first, and local-only until CityAtlas proves the rows belong in the queue.`,
      ].join("\n");
    })
    .join("\n\n");

  const vancouverDrafts = businessBatch.candidates
    .map(
      (candidate) =>
        `- ${candidate.businessName}: ${candidate.category} / ${candidate.segment} (${candidate.stage}; ${formatLabel(candidate.batchLane)}; ${candidate.sourceLane})`,
    )
    .join("\n");

  return `# CityAtlas EXA Discovery Approval Packet

Updated: ${formattedDate}

Generated from local repo truth by \`npm run growth:packets\`.

## Purpose

This packet exists to keep EXA in the right lane for CityAtlas.

EXA can help widen the local no-send queue, especially for Vancouver business density and the next city wave, but it is discovery-only. It is not a send rail, not a CRM unlock, and not proof that CityAtlas should publish or contact a business.

## Current Local Preconditions

- \`npm run growth:verify\` currently passes.
- \`${usefulPieceCount}\` useful pieces
- \`${guideCount}\` answer-first guides
- \`${sourceBackedCollectionCount}\` source-backed wedge collections
- \`${sourceBackedPlaceCount}\` source-backed place anchors
- \`${cityRolloutTargets.length}\` city targets remain in the reusable rollout map.
- \`${seededCities.length}\` seeded cities already have local queue coverage.
- Vancouver currently has \`${vancouverRollup.totalProspects}\` unique rows, \`${vancouverRollup.contactReadyCount}\` contact-ready rows, and \`${vancouverRollup.emailReadyCount}\` email-ready rows.
- Vancouver already has \`${vancouverPromotionCandidates.length}\` non-email promotion candidates to clean up before a paid discovery batch needs to widen the queue.
- The first CityAtlas business packet already has \`${businessBatch.selectedCount}\` selected targets and \`${businessBatch.rehearsalReadyCount}\` rehearsal-ready candidates.
- The current packet spans \`${businessBatch.distinctBatchLaneCount}\` business lanes across \`${businessBatch.distinctSourceLaneCount}\` donor/source lanes.
- Owner inbox rehearsal remains \`${ownerInboxBrief.title}\`.
- Free donor sync already merges every qualifying Roam preview artifact per city, absorbs saved Roam public-business-wave fixtures where they exist, keeps the reviewed Rooms Vancouver email-ready layer, and adds the wider Rooms Vancouver review queue without promoting manual-review rows to send-ready.

## Exact Import Shape CityAtlas Already Supports

\`\`\`csv
${businessProspectImportHeaders.join(",")}
\`\`\`

The admin import lane already previews duplicates, warnings, and importable rows before anything enters the local queue.

## Recommended First EXA Scopes

### Vancouver density top-up

- Use EXA only to widen review-first Vancouver rows that strengthen the live route surface or the exact 3-5 business rehearsal packet.
- Favor official contact pages, guest-services pages, private-event pages, venue-rental pages, and visible business emails.
- Avoid generic listicle pulls, personal staff data, and third-party directory-only contacts.

Current rehearsal packet businesses:

${vancouverDrafts}

${prioritizedScopes}

## Required Guardrails Before Any Paid Run

- One city at a time.
- One exact lane at a time, such as hospitality, cultural venues, wellness, or hosted-event routes.
- Keep the first paid run small enough for human review before import.
- Re-verify every imported contact path on an official public source before any real outreach is ever considered.
- Do not let EXA output create public partner claims, visible listings, or outreach-ready status automatically.
- Keep all results local until a human has reviewed the rows inside CityAtlas.

## What Approval Must Cover

- Exact city scope
- Exact lane or query family
- Exact spend cap
- Exact raw-row cap
- Exact reviewer
- Exact storage destination
- Exact rule for what gets rejected before import

## What EXA Still Does Not Unlock

- No outreach send
- No Gmail, Resend, CRM, or provider activation
- No public business publication
- No partner claim
- No bypass of owner inbox rehearsal
- No bypass of the real-world source policy

## Best Next Safe Move

1. Keep using donor-sync and manual import preview for free queue growth until the next city or Vancouver lane is exact enough to justify a paid run.
2. If a paid discovery step becomes worth it, approve one city, one lane, one capped batch, and one local reviewer first.
3. Treat the imported rows as research candidates only until CityAtlas re-verifies them on official sources and chooses a tiny next packet manually.
`;
}

function renderVancouverOutreachPrepPacket() {
  const laneBlock = vancouverLaneBreakdown
    .map(([lane, count]) => `- ${getBusinessProspectPromotionLabel(lane)}: \`${count}\` Vancouver rows`)
    .join("\n");

  const segmentBlock = vancouverTopEmailSegments
    .map(([segment, count]) => `- ${segment}: \`${count}\` email-ready rows`)
    .join("\n");

  const candidateBlock = businessBatch.candidates
    .map((candidate, index) =>
      [
        `### ${index + 1}. ${candidate.businessName}`,
        "",
        `- Stage: \`${candidate.stage}\``,
        `- Batch lane: \`${formatLabel(candidate.batchLane)}\``,
        `- Role: \`${formatLabel(candidate.role)}\``,
        `- Contact route: ${candidate.contactRoute}`,
        `- Source lane: ${candidate.sourceLane}`,
        `- Why this is in the packet: ${candidate.whyChosen}`,
        `- Missing before any real send: ${candidate.missing.length > 0 ? candidate.missing.join(" ") : "No local prep blocker remains, but the outside send is still gated."}`,
      ].join("\n"),
    )
    .join("\n\n");

  const followOnEmailBlock = followOnEmailCityBreakdown
    .slice(0, 8)
    .map(([cityName, count]) => `- ${cityName}: \`${count}\` email-ready rows`)
    .join("\n");
  const followOnPromotionBlock = followOnPromotionCityBreakdown
    .slice(0, 8)
    .map(([cityName, count]) => `- ${cityName}: \`${count}\` promotion-candidate rows`)
    .join("\n");

  return `# CityAtlas Vancouver Outreach Prep Packet

Updated: ${formattedDate}

Generated from local repo truth by \`npm run growth:packets\`.

## Current Local Truth

- Vancouver queue: \`${vancouverRollup.totalProspects}\` unique rows
- Vancouver partner-eligible rows: \`${vancouverRollup.partnerCandidateCount}\`
- Vancouver contact-ready rows: \`${vancouverRollup.contactReadyCount}\`
- Vancouver email-ready rows: \`${vancouverRollup.emailReadyCount}\`
- Vancouver promotion-candidate rows: \`${vancouverPromotionCandidates.length}\`
- Proof-batch selected count: \`${businessBatch.selectedCount}\`
- Rehearsal-ready candidates: \`${businessBatch.rehearsalReadyCount}\`
- Distinct batch lanes in packet: \`${businessBatch.distinctBatchLaneCount}\`
- Distinct donor/source lanes in packet: \`${businessBatch.distinctSourceLaneCount}\`
- Owner inbox rehearsal: \`${ownerInboxBrief.title}\`
- The Roam city-sourcing donor sync now merges every qualifying local preview artifact for a city and rejects obvious directory/search-result noise before CityAtlas stages those rows.
- The reusable Roam public-business-wave donor sync adds official-contact wellness/service businesses from saved public-business fixtures without widening CityAtlas into paid EXA or live scraping.
- The wider Rooms Vancouver review donor layer now adds contact-form-ready and research-only businesses without pretending they are all email-ready.

## Imported Rooms Rehearsal Overlay

- Vancouver supervised-send-window overlap: \`${vancouverOutreachRehearsalRollup.windowRowCount}\` Rooms rows and \`${vancouverOutreachRehearsalRollup.matchedProspectCount}\` clean current CityAtlas matches
- Vancouver borrowed outcome ledger: \`${vancouverOutreachRehearsalRollup.outcomeLedgerCount}\` rows, including \`${vancouverOutreachRehearsalRollup.bouncedCount}\` bounced outcome${vancouverOutreachRehearsalRollup.bouncedCount === 1 ? "" : "s"} and \`${vancouverOutreachRehearsalRollup.suppressedCount}\` exact-address suppression lesson${vancouverOutreachRehearsalRollup.suppressedCount === 1 ? "" : "s"}
- Toronto supervised-send-window overlap: \`${torontoOutreachRehearsalRollup?.matchedProspectCount ?? 0}\` current CityAtlas matches from \`${torontoOutreachRehearsalRollup?.windowRowCount ?? 0}\` Rooms rehearsal rows
- Unmatched follow-on rehearsal rows stay outside CityAtlas queue truth until their city/entity fit is clean enough for the current rollout boundary.

## Vancouver Action-Lane Mix

${laneBlock}

## Strongest Vancouver Email-Ready Segments

${segmentBlock}

## Current Tiny-Batch Candidates

${candidateBlock}

## Local Exports Ready Now

- \`output/growth/vancouver-email-ready-prospects.csv\` contains the current local Vancouver direct-email queue with batch lane, source lane, stage, and score for review-only outreach prep.
- \`output/growth/vancouver-promotion-candidates.csv\` contains the current local Vancouver non-email partner rows ranked by the next manual step that could move them closer to rehearsal.
- \`output/growth/vancouver-contact-path-review-prospects.csv\` contains the current local Vancouver contact-form and official-path review queue with confidence, source route, and no-submit notes.
- \`output/growth/vancouver-needs-research-prospects.csv\` contains the current local Vancouver rows that still need better public contact research before any rehearsal.
- \`output/growth/vancouver-rehearsal-window.csv\` contains the borrowed Rooms Vancouver supervised-send-window overlay plus matched CityAtlas stage, source lane, and any borrowed outcome-lesson columns.
- \`output/growth/follow-on-city-email-ready-prospects.csv\` contains the current local non-Vancouver direct-email queue with the same provenance fields for reusable city rollout prep.
- \`output/growth/follow-on-city-promotion-candidates.csv\` contains the current local non-Vancouver promotion queue so the next city wave can clean near-ready rows before a bigger research step is proposed.
- \`output/growth/follow-on-city-contact-path-review-prospects.csv\` contains the current local non-Vancouver review-first contact-path queue for the next city wave.
- \`output/growth/follow-on-city-rehearsal-window.csv\` contains the borrowed follow-on-city supervised-send-window rows and shows which ones cleanly map into the current CityAtlas queue.
- \`output/growth/city-outreach-rehearsal-truth.json\` keeps the reusable city-by-city rehearsal overlay summary in one place.
- All ten exports stay local-only and do not unlock outreach by themselves.

## Follow-On City Email Density From The Shared Map

${followOnEmailBlock}

## Follow-On City Promotion Density From The Shared Map

${followOnPromotionBlock}

## Reusable Outreach Sequence Borrowed From Rooms And Roam

1. Keep the queue local and no-send first.
2. Rehearse one exact message in the owner inbox before any outside send is considered.
3. Hold the first business packet to 3 to 5 exact recipients.
4. Log replies, bounces, wrong-contact redirects, and concerns before widening volume.
5. Treat provider setup, EXA, and any future automation as separate approval gates rather than hidden defaults.

## What Is Still Blocked

- No automated outreach is enabled in CityAtlas.
- No provider send lane, CRM sync, or reply ingestion is active from CityAtlas.
- No EXA-powered paid discovery run has been approved or executed.
- No exported row should be treated as a public partner claim or a send approval.

## Best Next Safe Move

1. Keep widening Vancouver email-ready density only where it strengthens the source-backed public city surface or the exact first manual packet.
2. Use the exported CSVs to clean owner-review scope before any later outreach activation work is even proposed.
3. Keep follow-on cities in queue-building mode until one non-Vancouver wedge earns a real source-backed collection starter.
`;
}

function renderFollowOnCityOutreachLadderPacket() {
  const cityBlock = followOnBatchInsights
    .map(({ insight, batch, ownerInbox }, index) => {
      const { rollup, target, missingThresholds } = insight;
      const candidateBlock = batch.candidates
        .slice(0, 3)
        .map(
          (candidate) =>
            `  - ${candidate.businessName} (${candidate.stage}; ${formatLabel(candidate.batchLane)}; ${candidate.contactRoute || "needs cleaner contact route"})`,
        )
        .join("\n");
      const phaseCaveat = target?.phase === "later_global_wave"
        ? "Later-wave caveat: even with enough local donor rows for a rehearsal packet, this city stays research-only until earlier North American proof is stronger."
        : missingThresholds.length > 0
          ? `City rollout caveat: ${renderThresholdGapSummary(missingThresholds)}`
          : "City rollout caveat: local queue thresholds are met, but hosted source-backed release proof is still separate.";
      const packetMode = getFollowOnPacketMode(insight);
      const effectiveOwnerInboxStatus = getFollowOnEffectiveOwnerInboxStatus(insight, ownerInbox);
      const effectiveNextAction = getFollowOnEffectiveNextAction(insight, batch, ownerInbox);

      return [
        `### ${index + 1}. ${rollup.cityName}`,
        "",
        `- Phase and status: ${renderPhaseLabel(rollup.phase)} / \`${rollup.status}\` at \`${formatPercent(rollup.progress)}\` progress`,
        `- Packet mode: \`${packetMode === "research_only" ? "Research-only" : "Active follow-on"}\``,
        `- Queue truth: \`${rollup.totalProspects}\` unique · \`${rollup.contactReadyCount}\` contact-ready · \`${rollup.emailReadyCount}\` email-ready`,
        `- Tiny-batch packet: \`${batch.selectedCount}\` selected · \`${batch.rehearsalReadyCount}\` rehearsal-ready · \`${batch.distinctBatchLaneCount}\` business lanes · \`${batch.distinctSourceLaneCount}\` source lanes`,
        `- Owner inbox rehearsal: \`${effectiveOwnerInboxStatus}\``,
        `- City rollout blocker: ${phaseCaveat}`,
        `- Next local action: ${effectiveNextAction}`,
        `- Example candidates:`,
        candidateBlock || "  - No candidate staged yet.",
      ].join("\n");
    })
    .join("\n\n");

  return `# CityAtlas Follow-On City Outreach Ladder Packet

Updated: ${formattedDate}

Generated from local repo truth by \`npm run growth:packets\`.

## Why This Packet Exists

CityAtlas already had reusable follow-on city queue truth, but not one exact packet for the next-city outreach-prep layer.

This packet stages the same safer tiny-batch logic used for Vancouver across the strongest follow-on cities:

- exact 3 to 5 local candidates per city
- owner-inbox rehearsal status per city
- clear separation between queue depth and real city readiness
- no-send, no-provider, no-publication truth

## Current Ladder Summary

- \`${cityRolloutTargets.length}\` city targets remain in the reusable rollout map
- \`${seededCities.length}\` seeded cities already have local queue coverage
- \`${followOnBatchInsights.length}\` follow-on cities currently have an exact tiny-batch packet staged locally
- \`${followOnActivePacketCount}\` of those cities are active next-wave or expansion-wave packets
- \`${followOnActiveOwnerInboxReadyCount}\` active follow-on cities are ready for an owner-inbox rehearsal
- \`${followOnThresholdReadyCount}\` of those cities already meet the local queue threshold for city-readiness
- \`${followOnCombinedReadyCount}\` city currently satisfies both local threshold readiness and owner-inbox rehearsal readiness
- \`${followOnResearchOnlyPacketCount}\` later-wave cities already have donor-backed rehearsal packets staged locally, but \`${followOnResearchOnlyOwnerInboxReadyCount}\` of those remain intentionally held in research-only mode

## Exact Follow-On City Packet Truth

${cityBlock}

## What Batch-Ready Does Not Mean

- A rehearsal-ready city is not the same as a public-release-ready city.
- A city with enough donor emails is not the same as a city with a source-backed wedge starter.
- An owner-inbox-ready packet is not permission for a real send.
- London, Dubai, Tokyo, and other later-wave cities can still stay research-only even when donor rows are strong enough for local rehearsal packaging.

## Local Exports Ready Now

- \`docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md\`
- \`output/growth/follow-on-city-batch-briefs.json\`
- \`output/growth/follow-on-city-first-batch-candidates.csv\`

These stay local-only. They exist so the next city wave can move with exact proof instead of vague queue counts.

## Best Next Safe Move

1. Keep Toronto as the clearest second-city packet because it is still the closest next-wave city to the local threshold and already has an owner-inbox-ready batch.
2. Treat Los Angeles and Miami as the strongest outreach-prep cities that still need one source-backed collection starter before release packaging.
3. Treat New York as queue-strong but rehearsal-blocked until one exact candidate is clean enough for the owner inbox.
4. Keep London, Dubai, Tokyo, and the rest of the later wave in research-only mode even if their donor rows are already strong enough for local rehearsal packets.

${renderCurrentSharedMachineTruthBlock()}
`;
}

function renderCityRolloutOperatorPacket() {
  const patternBlock = [...sharedPatternCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([pattern, count]) => `- ${renderSharedPatternLabel(pattern)}: \`${count}\` cities`)
    .join("\n");

  const phaseBlock = [...phaseCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([phase, count]) => `- ${renderPhaseLabel(phase)}: \`${count}\` cities`)
    .join("\n");

  const cityBlock = followOnCityInsights
    .slice(0, 8)
    .map((insight, index) => {
      const { rollup, target, missingThresholds } = insight;
      return [
        `### ${index + 1}. ${rollup.cityName}`,
        "",
        `- Shared pattern: ${renderSharedPatternLabel(target?.sharedPattern || "shared_with_roam")}`,
        `- Current status: \`${rollup.status}\` at \`${formatPercent(rollup.progress)}\` progress`,
        `- Queue truth: \`${rollup.totalProspects}\` unique · \`${rollup.contactReadyCount}\` contact-ready · \`${rollup.emailReadyCount}\` email-ready`,
        `- Promotion candidates: \`${followOnPromotionCityCounts.get(rollup.cityName) || 0}\` non-email partner rows`,
        `- Planned wedge: ${target?.wedge || "Missing target wedge"}`,
        `- Missing before local-ready packaging: ${renderThresholdGapSummary(missingThresholds)}`,
      ].join("\n");
    })
    .join("\n\n");

  return `# CityAtlas City Rollout Operator Packet

Updated: ${formattedDate}

Generated from local repo truth by \`npm run growth:packets\`.

## Shared City Map Alignment

${patternBlock}

## Rollout Phases In The Current Ladder

${phaseBlock}

## Strongest Follow-On Cities Right Now

${cityBlock}

## Borrowed Outreach Rehearsal Coverage

- Vancouver: \`${vancouverOutreachRehearsalRollup.windowRowCount}\` borrowed Rooms rehearsal rows matched, \`${vancouverOutreachRehearsalRollup.outcomeLedgerCount}\` historical outcome rows, and \`${vancouverOutreachRehearsalRollup.suppressedCount}\` exact-address suppression lesson${vancouverOutreachRehearsalRollup.suppressedCount === 1 ? "" : "s"} carried forward locally
- Toronto: \`${torontoOutreachRehearsalRollup?.matchedProspectCount ?? 0}\` clean CityAtlas matches from \`${torontoOutreachRehearsalRollup?.windowRowCount ?? 0}\` borrowed Rooms rehearsal rows, with \`${torontoOutreachRehearsalRollup?.unmatchedWindowCount ?? 0}\` row${torontoOutreachRehearsalRollup?.unmatchedWindowCount === 1 ? "" : "s"} intentionally kept outside the current queue boundary
- These overlays stay review-only. They sharpen queue truth and batch discipline, but they do not unlock a provider rail or a live send decision.

## Reusable Local-Ready City Template

Every future city should stay inside the same rule set:

1. Seed the city queue first from donor packets, official-source anchors, or later approved discovery batches.
2. Reach the city threshold for unique prospects, partner-eligible rows, contact-ready rows, and one source-backed collection starter.
3. Package one answer-first wedge before broad city copy or a generic destination shell.
4. Keep outreach prep, business publication, and city-page release as separate approval tracks.
5. Do not let EXA, a CSV export, or a donor import imply that the city is launch-ready by itself.

## Local Operator Exports

- \`output/growth/city-rollout-readiness.json\`
- \`output/growth/city-rollout-operator.json\`
- \`docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md\`
- \`output/growth/follow-on-city-batch-briefs.json\`
- \`output/growth/follow-on-city-first-batch-candidates.csv\`
- \`output/growth/follow-on-city-email-ready-prospects.csv\`
- \`output/growth/follow-on-city-promotion-candidates.csv\`
- \`output/growth/follow-on-city-contact-path-review-prospects.csv\`
- \`output/growth/follow-on-city-rehearsal-window.csv\`
- \`output/growth/city-outreach-rehearsal-truth.json\`

These files are the reusable handoff layer for the next-city queue and the exact tiny-batch rehearsal packet. They stay local-only until a separate city wedge and release packet exist.

The Roam city-sourcing donor layer now merges every qualifying local preview artifact for a city and rejects obvious directory/search-result noise before CityAtlas stages those rows.
The reusable Roam public-business-wave donor layer adds official-contact wellness/service businesses from saved Roam public-business fixtures where those artifacts already exist.

## What Is Still Unverified

- No non-Vancouver city has a live source-backed public release.
- No non-Vancouver city has hosted smoke proof for its first wedge.
- No non-Vancouver city has an approved outreach packet, provider lane, or public business publication path.

## Best Next Safe Move

1. Keep Toronto, New York, Los Angeles, and Miami as the highest-leverage shared-city queue targets.
2. Choose one of those cities for the first non-Vancouver source-backed collection starter instead of widening all cities at once.
3. Use the same local-only operator packet and CSV export pattern for every new city so the rollout machine stays consistent.
`;
}

function renderVancouverConnectorWarmPathPacket() {
  const namedLaneBlock = vancouverNamedConnectorLaneSummaries
    .map(
      (lane) =>
        `- ${lane.laneLabel}: \`${lane.count}\` named warm paths (${lane.names.join(", ")})`,
    )
    .join("\n");

  const namedConnectorBlock = vancouverNamedConnectorRows
    .map((row, index) => {
      return [
        `### ${index + 1}. ${row.targetName}`,
        "",
        `- Lane: ${row.laneLabel}`,
        `- Role: ${row.secondaryLabel}`,
        `- Organization: ${row.organization}`,
        `- Confidence: \`${row.confidence}\``,
        `- Best public contact path: \`${row.publicContactPath}\``,
        `- Why this matters: ${row.whyItMatters}`,
      ].join("\n");
    })
    .join("\n\n");

  const organizationConnectorBlock = vancouverOrganizationConnectorRows
    .slice(0, 6)
    .map(
      (row) =>
        `- ${row.targetName}: ${row.secondaryLabel} · \`${row.confidence}\` confidence · ${row.whyItMatters}`,
    )
    .join("\n");

  return `# Vancouver Connector Warm-Path Packet

Updated: ${formattedDate}

Generated from local repo truth by \`npm run growth:packets\`.

## Purpose

This packet stages the safer relationship layer behind CityAtlas's Vancouver business machine.

It does not unlock outreach.

It exists so CityAtlas can reuse the strongest local Rooms connector research without pretending that raw business rows and warm-path connectors are the same thing.

## Current Vancouver Warm-Path Truth

- \`${vancouverRollup.totalProspects}\` unique Vancouver prospects
- \`${vancouverRollup.contactReadyCount}\` contact-ready Vancouver business rows
- \`${vancouverRollup.emailReadyCount}\` email-ready Vancouver business rows
- \`${vancouverConnectorRollup.organizationConnectorCount}\` organization-level Vancouver connectors
- \`${vancouverConnectorRollup.namedConnectorCount}\` named Vancouver warm paths
- \`${vancouverConnectorRollup.namedLaneCount}\` named connector lanes
- \`${vancouverConnectorRollup.highConfidenceCount}\` high-confidence connector rows

## Named Connector Lanes

${namedLaneBlock}

## Best Named Warm Paths Right Now

${namedConnectorBlock}

## Best Organization-Level Connectors Right Now

${organizationConnectorBlock}

These organization rows stay useful even when a named person is already staged, because the organization route can remain the fallback public proof path.

## Local Export

- \`docs/seo-aeo-geo/VANCOUVER_CONNECTOR_WARM_PATH_PACKET.md\`
- \`output/growth/vancouver-connector-warm-paths.csv\`
- \`output/growth/city-connector-warm-paths.json\`

## What This Still Does Not Unlock

- No warm intro claim
- No outreach send
- No partnership claim
- No event attendance claim
- No city unlock claim

## Best Next Safe Move

1. Use the named Vancouver warm-path rows to review which founder, culture, and operator connectors best match the current no-send proof batch.
2. Keep organization-level connector pages as fallback public routes rather than widening into more cold-path outreach logic.
3. Only package a real warm-intro or named-person outreach step after the current business queue, reply rail, and supervised staging lanes stay clean.

${renderCurrentSharedMachineTruthBlock()}
`;
}

function renderCityConnectorWarmPathPacket() {
  const followOnConnectorCityBlock = connectorCoveredCityRollups
    .map((rollup, index) => {
      return [
        `### ${index + 1}. ${rollup.cityName}`,
        "",
        `- Connector stack: \`${rollup.organizationConnectorCount}\` organization connectors`,
        `- Current business queue: \`${rollup.alignedProspectCount}\` unique · \`${rollup.alignedContactReadyCount}\` contact-ready · \`${rollup.alignedEmailReadyCount}\` email-ready`,
        `- Status: \`${rollup.status}\``,
        `- Next safe move: ${rollup.nextAction}`,
      ].join("\n");
    })
    .join("\n\n");

  const connectorGapBlock = connectorGapCityRollups
    .map(
      (rollup) =>
        `- ${rollup.cityName}: \`${rollup.totalProspects}\` unique · \`${rollup.contactReadyCount}\` contact-ready · \`${rollup.emailReadyCount}\` email-ready, but no connector stack is staged yet`,
    )
    .join("\n");

  return `# City Connector Warm-Path Packet

Updated: ${formattedDate}

Generated from local repo truth by \`npm run growth:packets\`.

## Purpose

This packet keeps the city-launch relationship layer separate from the raw business queue.

CityAtlas can now stage both:

- business prospect density
- warm-path city connectors

without pretending those two systems are interchangeable.

## Current Shared Connector Truth

- \`${seededCities.length}\` seeded business-queue cities in the CityAtlas rollout map
- \`${connectorCoveredCityRollups.length + 1}\` cities with staged Rooms-derived connector stacks
- \`${connectorCoveredCityRollups.reduce((sum, rollup) => sum + rollup.organizationConnectorCount, vancouverConnectorRollup.organizationConnectorCount)}\` total organization-level connector rows
- \`${vancouverConnectorRollup.namedConnectorCount}\` named warm-path rows, currently all in Vancouver

## Connector-Covered Cities With Queue Density

${followOnConnectorCityBlock}

## Seeded Cities Still Missing Connector Coverage

${connectorGapBlock}

## Local Exports

- \`docs/seo-aeo-geo/CITY_CONNECTOR_WARM_PATH_PACKET.md\`
- \`output/growth/follow-on-city-connector-warm-paths.csv\`
- \`output/growth/city-connector-warm-paths.json\`

## What This Still Does Not Unlock

- No multi-city outreach
- No provider activation
- No public city-partner claims
- No warm-intro automation

## Best Next Safe Move

1. Treat Toronto as the strongest next city where connector coverage and business queue depth are both already staged locally.
2. Keep New York, Miami, Los Angeles, London, Dubai, and Tokyo as connector-covered expansion cities behind the same no-send rule.
3. Add named-person warm paths to the next city only after owner review shows the organization-level connector packet is worth deepening.

${renderCurrentSharedMachineTruthBlock()}
`;
}

const vancouverEmailExportHeaders = [
  "businessName",
  "cityName",
  "neighborhood",
  "category",
  "segment",
  "batchLane",
  "role",
  "batchStage",
  "batchScore",
  "email",
  "contactPath",
  "contactPathType",
  "promotionLane",
  "promotionScore",
  "nextStep",
  "sourceLane",
  "sourceLabel",
  "relationshipWarmth",
  "approvalStatus",
  "outreachStatus",
  "notes",
];

const vancouverEmailExportRows = vancouverEmailReadyProspects
  .map((prospect) => {
    const candidate = buildBusinessProofCandidate(prospect);

    return {
      businessName: prospect.businessName,
      cityName: prospect.cityName,
      neighborhood: prospect.neighborhood,
      category: prospect.category,
      segment: prospect.segment,
      batchLane: candidate.batchLane,
      role: classifyBusinessProspectRole(prospect),
      batchStage: candidate.stage,
      batchScore: candidate.score,
      email: prospect.email,
      contactPath: prospect.contactPath,
      contactPathType: prospect.contactPathType,
      promotionLane: getBusinessProspectPromotionLabel(getBusinessProspectPromotionLane(prospect)),
      promotionScore: getBusinessProspectPromotionScore(prospect),
      nextStep: getBusinessProspectNextStep(prospect),
      sourceLane: candidate.sourceLane,
      sourceLabel: prospect.sourceLabel,
      relationshipWarmth: prospect.relationshipWarmth,
      approvalStatus: prospect.approvalStatus,
      outreachStatus: prospect.outreachStatus,
      notes: prospect.notes,
    };
  })
  .sort((left, right) => {
    if (left.role !== right.role) return left.role.localeCompare(right.role);
    if (left.batchLane !== right.batchLane) return left.batchLane.localeCompare(right.batchLane);
    if (left.category !== right.category) return left.category.localeCompare(right.category);
    return left.businessName.localeCompare(right.businessName);
  });

const followOnEmailExportRows = followOnEmailReadyProspects
  .map((prospect) => {
    const candidate = buildBusinessProofCandidate(prospect);

    return {
      businessName: prospect.businessName,
      cityName: prospect.cityName,
      neighborhood: prospect.neighborhood,
      category: prospect.category,
      segment: prospect.segment,
      batchLane: candidate.batchLane,
      role: classifyBusinessProspectRole(prospect),
      batchStage: candidate.stage,
      batchScore: candidate.score,
      email: prospect.email,
      contactPath: prospect.contactPath,
      contactPathType: prospect.contactPathType,
      promotionLane: getBusinessProspectPromotionLabel(getBusinessProspectPromotionLane(prospect)),
      promotionScore: getBusinessProspectPromotionScore(prospect),
      nextStep: getBusinessProspectNextStep(prospect),
      sourceLane: candidate.sourceLane,
      sourceLabel: prospect.sourceLabel,
      relationshipWarmth: prospect.relationshipWarmth,
      approvalStatus: prospect.approvalStatus,
      outreachStatus: prospect.outreachStatus,
      notes: prospect.notes,
    };
  })
  .sort((left, right) => {
    if (left.cityName !== right.cityName) return left.cityName.localeCompare(right.cityName);
    if (left.role !== right.role) return left.role.localeCompare(right.role);
    if (left.batchLane !== right.batchLane) return left.batchLane.localeCompare(right.batchLane);
    return left.businessName.localeCompare(right.businessName);
  });

const reviewQueueExportHeaders = [
  "businessName",
  "cityName",
  "neighborhood",
  "category",
  "segment",
  "contactReadiness",
  "contactPath",
  "contactPathType",
  "contactConfidence",
  "promotionLane",
  "promotionScore",
  "nextStep",
  "batchLane",
  "role",
  "batchStage",
  "batchScore",
  "sourceLane",
  "sourceLabel",
  "sourceUrl",
  "website",
  "approvalStatus",
  "outreachStatus",
  "notes",
];

function buildReviewQueueExportRows(prospects) {
  return prospects
    .map((prospect) => {
      const candidate = buildBusinessProofCandidate(prospect);

      return {
        businessName: prospect.businessName,
        cityName: prospect.cityName,
        neighborhood: prospect.neighborhood,
        category: prospect.category,
        segment: prospect.segment,
        contactReadiness: prospect.contactReadiness,
        contactPath: prospect.contactPath,
        contactPathType: prospect.contactPathType,
        contactConfidence: prospect.contactConfidence,
        promotionLane: getBusinessProspectPromotionLabel(getBusinessProspectPromotionLane(prospect)),
        promotionScore: getBusinessProspectPromotionScore(prospect),
        nextStep: getBusinessProspectNextStep(prospect),
        batchLane: candidate.batchLane,
        role: classifyBusinessProspectRole(prospect),
        batchStage: candidate.stage,
        batchScore: candidate.score,
        sourceLane: candidate.sourceLane,
        sourceLabel: prospect.sourceLabel,
        sourceUrl: prospect.sourceUrl,
        website: prospect.website,
        approvalStatus: prospect.approvalStatus,
        outreachStatus: prospect.outreachStatus,
        notes: prospect.notes,
      };
    })
    .sort((left, right) => {
      if (left.cityName !== right.cityName) return left.cityName.localeCompare(right.cityName);
      if (right.promotionScore !== left.promotionScore) return right.promotionScore - left.promotionScore;
      if (left.contactReadiness !== right.contactReadiness) {
        return left.contactReadiness.localeCompare(right.contactReadiness);
      }
      if (left.batchLane !== right.batchLane) return left.batchLane.localeCompare(right.batchLane);
      return left.businessName.localeCompare(right.businessName);
    });
}

const vancouverContactPathReviewRows = buildReviewQueueExportRows(vancouverContactPathReadyProspects);
const vancouverNeedsResearchRows = buildReviewQueueExportRows(vancouverNeedsResearchProspects);
const followOnContactPathReviewRows = buildReviewQueueExportRows(followOnContactPathReadyProspects);
const vancouverPromotionRows = buildReviewQueueExportRows(vancouverPromotionCandidates);
const followOnPromotionRows = buildReviewQueueExportRows(followOnPromotionCandidates);
const outreachRehearsalExportHeaders = [
  "businessName",
  "cityName",
  "matched",
  "matchedContactReadiness",
  "matchedBatchStage",
  "matchedSourceLane",
  "email",
  "officialUrl",
  "sourceUrl",
  "sourceType",
  "sendStatus",
  "approvalStatus",
  "suppressionStatus",
  "deliveryStatus",
  "replyStatus",
  "outcomeStatus",
  "ownerNextAction",
  "guardrails",
];

function buildOutcomeKey(businessName, email) {
  return `${String(businessName || "").trim().toLowerCase()}::${String(email || "").trim().toLowerCase()}`;
}

const vancouverOutcomeRowByKey = new Map(
  vancouverOutreachOutcomeRows.map((row) => [buildOutcomeKey(row.businessName, row.email), row]),
);

function buildOutreachRehearsalExportRows(rows) {
  return rows.map((row) => {
    const outcome = vancouverOutcomeRowByKey.get(buildOutcomeKey(row.businessName, row.email));

    return {
      businessName: row.businessName,
      cityName: row.cityName,
      matched: row.matched ? "yes" : "no",
      matchedContactReadiness: row.matchedContactReadiness,
      matchedBatchStage: row.matchedBatchStage,
      matchedSourceLane: row.matchedSourceLane,
      email: row.email,
      officialUrl: row.officialUrl,
      sourceUrl: row.sourceUrl,
      sourceType: row.sourceType,
      sendStatus: row.sendStatus,
      approvalStatus: row.approvalStatus,
      suppressionStatus: outcome?.suppressionStatus || row.suppressionStatus,
      deliveryStatus: outcome?.deliveryStatus || "",
      replyStatus: outcome?.replyStatus || "",
      outcomeStatus: outcome?.outcomeStatus || "",
      ownerNextAction: outcome?.ownerNextAction || "",
      guardrails: row.guardrails,
    };
  });
}

const vancouverOutreachRehearsalExportRows = buildOutreachRehearsalExportRows(
  vancouverOutreachWindowRows,
);
const followOnOutreachRehearsalExportRows = buildOutreachRehearsalExportRows(
  followOnOutreachWindowRows,
);
const connectorExportHeaders = [
  "cityName",
  "routeType",
  "laneLabel",
  "targetName",
  "secondaryLabel",
  "organization",
  "audience",
  "confidence",
  "publicContactPath",
  "sourceUrl",
  "accessDate",
  "whyItMatters",
  "alignedProspectCount",
  "alignedContactReadyCount",
  "alignedEmailReadyCount",
  "status",
  "nextAction",
  "notes",
];

function buildConnectorExportRows(rows) {
  return rows.map((row) => {
    const rollup = connectorRollupByCityKey.get(row.cityKey);

    return {
      cityName: row.cityName,
      routeType: row.routeType,
      laneLabel: row.laneLabel,
      targetName: row.targetName,
      secondaryLabel: row.secondaryLabel,
      organization: row.organization,
      audience: row.audience,
      confidence: row.confidence,
      publicContactPath: row.publicContactPath,
      sourceUrl: row.sourceUrl,
      accessDate: row.accessDate,
      whyItMatters: row.whyItMatters,
      alignedProspectCount: rollup?.alignedProspectCount ?? 0,
      alignedContactReadyCount: rollup?.alignedContactReadyCount ?? 0,
      alignedEmailReadyCount: rollup?.alignedEmailReadyCount ?? 0,
      status: rollup?.status ?? "not_staged",
      nextAction: rollup?.nextAction ?? "",
      notes: row.notes,
    };
  });
}

const vancouverConnectorExportRows = buildConnectorExportRows(vancouverConnectorRows);
const followOnConnectorExportRows = buildConnectorExportRows(followOnConnectorRows);
const followOnBatchExportHeaders = [
  "cityName",
  "cityKey",
  "phase",
  "packetMode",
  "rolloutStatus",
  "rolloutProgress",
  "ownerInboxStatus",
  "effectiveOwnerInboxStatus",
  "batchStatus",
  "selectedBatchCount",
  "rehearsalReadyCount",
  "distinctBatchLanes",
  "distinctSourceLanes",
  "missingThresholds",
  "businessName",
  "category",
  "segment",
  "batchLane",
  "stage",
  "score",
  "contactRoute",
  "sourceLane",
  "role",
  "draftSubject",
  "whyChosen",
  "missing",
  "sourceUrl",
  "website",
  "email",
  "notes",
];
const followOnBatchExportRows = followOnBatchInsights.flatMap(({ insight, batch, ownerInbox }) =>
  batch.candidates.map((candidate) => {
    const prospect = businessProspectById.get(candidate.prospectId);
    return {
      cityName: insight.rollup.cityName,
      cityKey: insight.rollup.cityKey,
      phase: insight.rollup.phase,
      packetMode: getFollowOnPacketMode(insight),
      rolloutStatus: insight.rollup.status,
      rolloutProgress: insight.rollup.progress,
      ownerInboxStatus: ownerInbox.title,
      effectiveOwnerInboxStatus: getFollowOnEffectiveOwnerInboxStatus(insight, ownerInbox),
      batchStatus: batch.status,
      selectedBatchCount: batch.selectedCount,
      rehearsalReadyCount: batch.rehearsalReadyCount,
      distinctBatchLanes: batch.distinctBatchLaneCount,
      distinctSourceLanes: batch.distinctSourceLaneCount,
      missingThresholds: renderThresholdGapSummary(insight.missingThresholds),
      businessName: candidate.businessName,
      category: candidate.category,
      segment: candidate.segment,
      batchLane: candidate.batchLane,
      stage: candidate.stage,
      score: candidate.score,
      contactRoute: candidate.contactRoute,
      sourceLane: candidate.sourceLane,
      role: candidate.role,
      draftSubject: candidate.draft.subject,
      whyChosen: candidate.whyChosen,
      missing: candidate.missing.join(" | "),
      sourceUrl: prospect?.sourceUrl || "",
      website: prospect?.website || "",
      email: prospect?.email || "",
      notes: prospect?.notes || "",
    };
  }),
);

const rolloutReport = {
  generatedAt,
  summary: {
    usefulPieceCount,
    guideCount,
    sourceBackedCollectionCount,
    sourceBackedPlaceCount,
    cityTargets: cityRolloutTargets.length,
    seededCities: seededCities.length,
    preparedCities: preparedCities.length,
    buildingCities: buildingCities.length,
    queuedCities: queuedCities.length,
  },
  vancouver: vancouverRollup,
  followOnCities: followOnCityInsights.slice(0, 8),
  zeroSeedCities: zeroSeedCityInsights,
  vancouverSourceLanes: vancouverSourceLanes.map(([lane, count]) => ({ lane, count })),
};

const vancouverBusinessMachineReport = {
  generatedAt,
  summary: {
    totalProspects: vancouverRollup.totalProspects,
    partnerEligible: vancouverRollup.partnerCandidateCount,
    anchorOnly: vancouverRollup.anchorOnlyCount,
    contactReady: vancouverRollup.contactReadyCount,
    emailReady: vancouverRollup.emailReadyCount,
    promotionCandidates: vancouverPromotionRows.length,
    sourceBackedCollections: vancouverRollup.sourceBackedCollections,
    guideCount: vancouverRollup.guideCount,
    totalStagedProspects: businessProspects.length,
    preparedCities: preparedCities.length,
    seededCities: seededCities.length,
  },
  layers: {
    sourceBackedAnchors: vancouverSourceBackedAnchorCount,
    founderProof: vancouverFounderProofCount,
    roamPartnerSeed: vancouverRoamPartnerSeedCount,
    connectorOrganizations: vancouverConnectorRollup.organizationConnectorCount,
    connectorNamedWarmPaths: vancouverConnectorRollup.namedConnectorCount,
    roomsVenueSeed: vancouverRoomsVenueSeedCount,
    roomsReviewSeed: vancouverRoomsReviewSeedCount,
    roamCitySourcing: vancouverRoamCitySourcingCount,
  },
  reviewQueues: {
    promotionCandidates: vancouverPromotionRows.length,
    contactPathReady: vancouverContactPathReviewRows.length,
    needsResearch: vancouverNeedsResearchRows.length,
  },
  promotionLanes: vancouverPromotionLaneBreakdown.map(([lane, count]) => ({ lane, count })),
  sourceLanes: vancouverSourceLanes.map(([lane, count]) => ({ lane, count })),
  strongestFollowOnCities: followOnCityInsights.slice(0, 6),
};

const cityConnectorWarmPathReport = {
  generatedAt,
  summary: {
    seededCities: seededCities.length,
    connectorCoveredCities: connectorCoveredCityRollups.length + 1,
    organizationConnectorCount:
      connectorCoveredCityRollups.reduce(
        (sum, rollup) => sum + rollup.organizationConnectorCount,
        vancouverConnectorRollup.organizationConnectorCount,
      ),
    namedConnectorCount: vancouverConnectorRollup.namedConnectorCount,
  },
  vancouver: {
    rollup: vancouverConnectorRollup,
    namedLanes: vancouverNamedConnectorLaneSummaries,
  },
  connectorCoveredCities: connectorCoveredCityRollups,
  connectorGapCities: connectorGapCityRollups.map((rollup) => ({
    cityKey: rollup.cityKey,
    cityName: rollup.cityName,
    totalProspects: rollup.totalProspects,
    contactReadyCount: rollup.contactReadyCount,
    emailReadyCount: rollup.emailReadyCount,
  })),
};

const cityOutreachRehearsalReport = {
  generatedAt,
  summary: {
    cityCount: outreachRehearsalRollups.length,
    windowRowCount: outreachRehearsalRollups.reduce((sum, rollup) => sum + rollup.windowRowCount, 0),
    matchedProspectCount: outreachRehearsalRollups.reduce(
      (sum, rollup) => sum + rollup.matchedProspectCount,
      0,
    ),
    outcomeLedgerCount: outreachRehearsalRollups.reduce(
      (sum, rollup) => sum + rollup.outcomeLedgerCount,
      0,
    ),
  },
  cities: outreachRehearsalRollups,
};

const vancouverOutreachPrepReport = {
  generatedAt,
  summary: {
    totalProspects: vancouverRollup.totalProspects,
    partnerEligible: vancouverRollup.partnerCandidateCount,
    contactReady: vancouverRollup.contactReadyCount,
    emailReady: vancouverRollup.emailReadyCount,
    promotionCandidates: vancouverPromotionRows.length,
    contactPathReady: vancouverContactPathReviewRows.length,
    needsResearch: vancouverNeedsResearchRows.length,
    selectedBatchCount: businessBatch.selectedCount,
    rehearsalReadyCount: businessBatch.rehearsalReadyCount,
    distinctBatchLaneCount: businessBatch.distinctBatchLaneCount,
    distinctSourceLaneCount: businessBatch.distinctSourceLaneCount,
    ownerInboxStatus: ownerInboxBrief.title,
    borrowedRehearsalWindowRows: vancouverOutreachRehearsalRollup.windowRowCount,
    borrowedOutcomeRows: vancouverOutreachRehearsalRollup.outcomeLedgerCount,
  },
  laneCounts: vancouverLaneBreakdown.map(([lane, count]) => ({ lane, count })),
  topEmailSegments: vancouverTopEmailSegments.map(([segment, count]) => ({ segment, count })),
  batchCandidates: businessBatch.candidates,
  rehearsalOverlay: {
    vancouver: vancouverOutreachRehearsalRollup,
    toronto: torontoOutreachRehearsalRollup,
  },
  reviewQueues: {
    vancouverPromotionCandidatesCsv: "output/growth/vancouver-promotion-candidates.csv",
    vancouverContactPathReadyCsv: "output/growth/vancouver-contact-path-review-prospects.csv",
    vancouverNeedsResearchCsv: "output/growth/vancouver-needs-research-prospects.csv",
    followOnPromotionCandidatesCsv: "output/growth/follow-on-city-promotion-candidates.csv",
    followOnContactPathReadyCsv: "output/growth/follow-on-city-contact-path-review-prospects.csv",
  },
  exports: {
    vancouverEmailReadyCsv: "output/growth/vancouver-email-ready-prospects.csv",
    followOnCityEmailReadyCsv: "output/growth/follow-on-city-email-ready-prospects.csv",
    vancouverRehearsalWindowCsv: "output/growth/vancouver-rehearsal-window.csv",
    followOnCityRehearsalWindowCsv: "output/growth/follow-on-city-rehearsal-window.csv",
    cityOutreachRehearsalTruthJson: "output/growth/city-outreach-rehearsal-truth.json",
  },
};

const cityRolloutOperatorReport = {
  generatedAt,
  summary: {
    cityTargets: cityRolloutTargets.length,
    seededCities: seededCities.length,
    preparedCities: preparedCities.length,
    buildingCities: buildingCities.length,
    queuedCities: queuedCities.length,
  },
  sharedPatterns: [...sharedPatternCounts.entries()].map(([pattern, count]) => ({ pattern, count })),
  phases: [...phaseCounts.entries()].map(([phase, count]) => ({ phase, count })),
  strongestFollowOnCities: followOnCityInsights.slice(0, 8),
  followOnEmailCities: followOnEmailCityBreakdown.map(([cityName, count]) => ({ cityName, count })),
  followOnPromotionCities: followOnPromotionCityBreakdown.map(([cityName, count]) => ({ cityName, count })),
  connectorCoveredCities: connectorCoveredCityRollups,
  outreachRehearsal: outreachRehearsalRollups,
  followOnContactPathCities: [...followOnContactPathReadyProspects.reduce((counts, prospect) => {
    counts.set(prospect.cityName, (counts.get(prospect.cityName) || 0) + 1);
    return counts;
  }, new Map()).entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([cityName, count]) => ({ cityName, count })),
};
const followOnCityBatchReport = {
  generatedAt,
  summary: {
    cityCount: followOnBatchInsights.length,
    activePacketCities: followOnActivePacketCount,
    researchOnlyPacketCities: followOnResearchOnlyPacketCount,
    activeOwnerInboxReadyCities: followOnActiveOwnerInboxReadyCount,
    researchOnlyOwnerInboxReadyCities: followOnResearchOnlyOwnerInboxReadyCount,
    thresholdReadyCities: followOnThresholdReadyCount,
    combinedReadyCities: followOnCombinedReadyCount,
  },
  cities: followOnBatchInsights.map(({ insight, batch, ownerInbox }) => ({
    rollup: insight.rollup,
    target: insight.target,
    missingThresholds: insight.missingThresholds,
    packetMode: getFollowOnPacketMode(insight),
    batchSummary: {
      readiness: batch.readiness,
      status: batch.status,
      selectedCount: batch.selectedCount,
      rehearsalReadyCount: batch.rehearsalReadyCount,
      reviewFirstCount: batch.reviewFirstCount,
      distinctBatchLaneCount: batch.distinctBatchLaneCount,
      distinctSourceLaneCount: batch.distinctSourceLaneCount,
      nextAction: batch.nextAction,
      effectiveNextAction: getFollowOnEffectiveNextAction(insight, batch, ownerInbox),
    },
    ownerInbox: {
      ...ownerInbox,
      effectiveStatus: getFollowOnEffectiveOwnerInboxStatus(insight, ownerInbox),
    },
    candidates: batch.candidates,
  })),
};

const exaReport = {
  generatedAt,
  summary: {
    cityTargets: cityRolloutTargets.length,
    seededCities: seededCities.length,
    vancouverProspects: vancouverRollup.totalProspects,
    vancouverContactReady: vancouverRollup.contactReadyCount,
    vancouverEmailReady: vancouverRollup.emailReadyCount,
    vancouverPromotionCandidates: vancouverPromotionRows.length,
    selectedBatchCount: businessBatch.selectedCount,
    rehearsalReadyCount: businessBatch.rehearsalReadyCount,
    distinctBatchLaneCount: businessBatch.distinctBatchLaneCount,
    distinctSourceLaneCount: businessBatch.distinctSourceLaneCount,
    ownerInboxStatus: ownerInboxBrief.title,
  },
  prioritizedScopes: followOnCityInsights.slice(0, 5),
  vancouverBatch: businessBatch.candidates,
};

mkdirSync(docsDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

writeFileSync(
  join(docsDir, "CITY_ROLLOUT_READINESS_PACKET.md"),
  `${renderRolloutPacket()}\n`,
);
writeFileSync(
  join(docsDir, "VANCOUVER_BUSINESS_MACHINE_PACKET.md"),
  `${renderVancouverBusinessMachinePacket()}\n`,
);
writeFileSync(
  join(docsDir, "VANCOUVER_BUSINESS_FIRST_BATCH_PACKET.md"),
  `${renderVancouverBusinessFirstBatchPacket()}\n`,
);
writeFileSync(
  join(docsDir, "EXA_DISCOVERY_APPROVAL_PACKET.md"),
  `${renderExaPacket()}\n`,
);
writeFileSync(
  join(docsDir, "VANCOUVER_OUTREACH_PREP_PACKET.md"),
  `${renderVancouverOutreachPrepPacket()}\n`,
);
writeFileSync(
  join(docsDir, "CITY_ROLLOUT_OPERATOR_PACKET.md"),
  `${renderCityRolloutOperatorPacket()}\n`,
);
writeFileSync(
  join(docsDir, "FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md"),
  `${renderFollowOnCityOutreachLadderPacket()}\n`,
);
writeFileSync(
  join(docsDir, "VANCOUVER_CONNECTOR_WARM_PATH_PACKET.md"),
  `${renderVancouverConnectorWarmPathPacket()}\n`,
);
writeFileSync(
  join(docsDir, "CITY_CONNECTOR_WARM_PATH_PACKET.md"),
  `${renderCityConnectorWarmPathPacket()}\n`,
);
writeFileSync(
  join(outputDir, "city-rollout-readiness.json"),
  `${JSON.stringify(rolloutReport, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "vancouver-business-machine.json"),
  `${JSON.stringify(vancouverBusinessMachineReport, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "exa-discovery-approval.json"),
  `${JSON.stringify(exaReport, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "vancouver-outreach-prep.json"),
  `${JSON.stringify(vancouverOutreachPrepReport, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "city-rollout-operator.json"),
  `${JSON.stringify(cityRolloutOperatorReport, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "follow-on-city-batch-briefs.json"),
  `${JSON.stringify(followOnCityBatchReport, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "city-connector-warm-paths.json"),
  `${JSON.stringify(cityConnectorWarmPathReport, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "city-outreach-rehearsal-truth.json"),
  `${JSON.stringify(cityOutreachRehearsalReport, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "vancouver-email-ready-prospects.csv"),
  `${toCsv(vancouverEmailExportHeaders, vancouverEmailExportRows)}\n`,
);
writeFileSync(
  join(outputDir, "follow-on-city-email-ready-prospects.csv"),
  `${toCsv(vancouverEmailExportHeaders, followOnEmailExportRows)}\n`,
);
writeFileSync(
  join(outputDir, "vancouver-promotion-candidates.csv"),
  `${toCsv(reviewQueueExportHeaders, vancouverPromotionRows)}\n`,
);
writeFileSync(
  join(outputDir, "vancouver-contact-path-review-prospects.csv"),
  `${toCsv(reviewQueueExportHeaders, vancouverContactPathReviewRows)}\n`,
);
writeFileSync(
  join(outputDir, "vancouver-needs-research-prospects.csv"),
  `${toCsv(reviewQueueExportHeaders, vancouverNeedsResearchRows)}\n`,
);
writeFileSync(
  join(outputDir, "follow-on-city-promotion-candidates.csv"),
  `${toCsv(reviewQueueExportHeaders, followOnPromotionRows)}\n`,
);
writeFileSync(
  join(outputDir, "follow-on-city-contact-path-review-prospects.csv"),
  `${toCsv(reviewQueueExportHeaders, followOnContactPathReviewRows)}\n`,
);
writeFileSync(
  join(outputDir, "follow-on-city-first-batch-candidates.csv"),
  `${toCsv(followOnBatchExportHeaders, followOnBatchExportRows)}\n`,
);
writeFileSync(
  join(outputDir, "vancouver-rehearsal-window.csv"),
  `${toCsv(outreachRehearsalExportHeaders, vancouverOutreachRehearsalExportRows)}\n`,
);
writeFileSync(
  join(outputDir, "follow-on-city-rehearsal-window.csv"),
  `${toCsv(outreachRehearsalExportHeaders, followOnOutreachRehearsalExportRows)}\n`,
);
writeFileSync(
  join(outputDir, "vancouver-connector-warm-paths.csv"),
  `${toCsv(connectorExportHeaders, vancouverConnectorExportRows)}\n`,
);
writeFileSync(
  join(outputDir, "follow-on-city-connector-warm-paths.csv"),
  `${toCsv(connectorExportHeaders, followOnConnectorExportRows)}\n`,
);

console.log("CityAtlas growth packets");
console.log(
  JSON.stringify(
    {
      generatedAt,
      packetPaths: [
        "docs/seo-aeo-geo/CITY_ROLLOUT_READINESS_PACKET.md",
        "docs/seo-aeo-geo/VANCOUVER_BUSINESS_MACHINE_PACKET.md",
        "docs/seo-aeo-geo/VANCOUVER_BUSINESS_FIRST_BATCH_PACKET.md",
        "docs/seo-aeo-geo/EXA_DISCOVERY_APPROVAL_PACKET.md",
        "docs/seo-aeo-geo/VANCOUVER_OUTREACH_PREP_PACKET.md",
        "docs/seo-aeo-geo/CITY_ROLLOUT_OPERATOR_PACKET.md",
        "docs/seo-aeo-geo/FOLLOW_ON_CITY_OUTREACH_LADDER_PACKET.md",
        "docs/seo-aeo-geo/VANCOUVER_CONNECTOR_WARM_PATH_PACKET.md",
        "docs/seo-aeo-geo/CITY_CONNECTOR_WARM_PATH_PACKET.md",
      ],
      artifactPaths: [
        "output/growth/city-rollout-readiness.json",
        "output/growth/vancouver-business-machine.json",
        "output/growth/exa-discovery-approval.json",
        "output/growth/vancouver-outreach-prep.json",
        "output/growth/city-rollout-operator.json",
        "output/growth/follow-on-city-batch-briefs.json",
        "output/growth/city-connector-warm-paths.json",
        "output/growth/city-outreach-rehearsal-truth.json",
        "output/growth/vancouver-email-ready-prospects.csv",
        "output/growth/follow-on-city-email-ready-prospects.csv",
        "output/growth/vancouver-promotion-candidates.csv",
        "output/growth/vancouver-contact-path-review-prospects.csv",
        "output/growth/vancouver-needs-research-prospects.csv",
        "output/growth/follow-on-city-promotion-candidates.csv",
        "output/growth/follow-on-city-contact-path-review-prospects.csv",
        "output/growth/follow-on-city-first-batch-candidates.csv",
        "output/growth/vancouver-rehearsal-window.csv",
        "output/growth/follow-on-city-rehearsal-window.csv",
        "output/growth/vancouver-connector-warm-paths.csv",
        "output/growth/follow-on-city-connector-warm-paths.csv",
      ],
      summary: rolloutReport.summary,
    },
    null,
    2,
  ),
);
