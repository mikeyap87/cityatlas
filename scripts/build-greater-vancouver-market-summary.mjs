import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { roamPublicBusinessWaveSeeds } from "../src/data/roamPublicBusinessWaveSeeds.ts";
import { vancouverRestaurantReviewBusinessSeeds } from "../src/data/vancouverRestaurantReviewBusinessSeeds.ts";
import { vancouverServiceReviewBusinessSeeds } from "../src/data/vancouverServiceReviewBusinessSeeds.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_JSON_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-market-summary.json",
);
const OUTPUT_DOC_PATH = path.resolve(
  __dirname,
  "../docs/seo-aeo-geo/GREATER_VANCOUVER_EXPANSION_STATUS.md",
);

const TARGET_MUNICIPALITIES = [
  "Vancouver",
  "Burnaby",
  "Richmond",
  "Surrey",
  "New Westminster",
  "North Vancouver",
  "West Vancouver",
  "Coquitlam",
  "Port Coquitlam",
  "Port Moody",
  "Delta",
  "Maple Ridge",
  "Pitt Meadows",
  "White Rock",
  "Langley",
];

const MUNICIPALITY_MATCHERS = [
  { label: "North Vancouver", pattern: /\bnorth vancouver\b/i },
  { label: "West Vancouver", pattern: /\bwest vancouver\b/i },
  { label: "Port Coquitlam", pattern: /\bport coquitlam\b/i },
  { label: "Port Moody", pattern: /\bport moody\b/i },
  { label: "New Westminster", pattern: /\bnew westminster\b/i },
  { label: "Maple Ridge", pattern: /\bmaple ridge\b/i },
  { label: "Pitt Meadows", pattern: /\bpitt meadows\b/i },
  { label: "White Rock", pattern: /\bwhite rock\b/i },
  { label: "Coquitlam", pattern: /\bcoquitlam\b/i },
  { label: "Burnaby", pattern: /\bburnaby\b/i },
  { label: "Richmond", pattern: /\brichmond\b/i },
  { label: "Surrey", pattern: /\bsurrey\b/i },
  { label: "Delta", pattern: /\bdelta\b/i },
  { label: "Langley", pattern: /\blangley\b/i },
  { label: "Vancouver", pattern: /\bvancouver\b/i },
];

function getMunicipality(row) {
  return row.municipality || "Vancouver";
}

function countBy(rows, predicate) {
  return rows.filter(predicate).length;
}

function collectMentionedMunicipalities(rows) {
  const mentions = new Set();
  for (const row of rows) {
    const text = [
      row.businessName,
      row.neighborhood,
      row.municipality,
      row.sourceProof,
      row.notes,
    ]
      .filter(Boolean)
      .join(" ");
    for (const matcher of MUNICIPALITY_MATCHERS) {
      if (matcher.label === "Vancouver") {
        continue;
      }
      if (matcher.pattern.test(text)) {
        mentions.add(matcher.label);
      }
    }
  }
  return Array.from(mentions).sort((left, right) => left.localeCompare(right));
}

function collectMentionedMunicipalitiesFromDonorRows(rows) {
  return collectMentionedMunicipalities(
    rows.map((row) => ({
      businessName: row.businessName,
      neighborhood: row.neighborhood,
      municipality: row.cityName || "Vancouver",
      sourceProof: row.sourceProof,
      notes: row.notes,
    })),
  );
}

function buildLaneSummary(rows) {
  const municipalities = new Set(rows.map((row) => getMunicipality(row)));
  return {
    totalRows: rows.length,
    ownerReviewReadyCount: countBy(rows, (row) => row.approvalStatus === "ready_for_owner_review"),
    emailReadyCount: countBy(rows, (row) => row.contactReadiness === "email_ready"),
    sentManualCount: countBy(rows, (row) => row.outreachStatus === "sent_manual"),
    metroAreaRowCount: countBy(rows, (row) => row.marketScope === "metro_area"),
    explicitMunicipalities: Array.from(municipalities).sort((left, right) =>
      left.localeCompare(right),
    ),
    mentionedMunicipalities: collectMentionedMunicipalities(rows),
  };
}

function buildMunicipalityRow(municipality, restaurantRows, serviceRows, mentionOnlyMunicipalities) {
  const restaurantMunicipalityRows = restaurantRows.filter(
    (row) => getMunicipality(row) === municipality,
  );
  const serviceMunicipalityRows = serviceRows.filter((row) => getMunicipality(row) === municipality);
  const totalRows = restaurantMunicipalityRows.length + serviceMunicipalityRows.length;
  const status =
    totalRows > 0
      ? "Active queue"
      : mentionOnlyMunicipalities.has(municipality)
        ? "Mention only"
        : "Not in queue yet";

  return {
    municipality,
    restaurantRows: restaurantMunicipalityRows.length,
    restaurantOwnerReviewReadyCount: countBy(
      restaurantMunicipalityRows,
      (row) => row.approvalStatus === "ready_for_owner_review",
    ),
    restaurantSentManualCount: countBy(
      restaurantMunicipalityRows,
      (row) => row.outreachStatus === "sent_manual",
    ),
    serviceRows: serviceMunicipalityRows.length,
    serviceOwnerReviewReadyCount: countBy(
      serviceMunicipalityRows,
      (row) => row.approvalStatus === "ready_for_owner_review",
    ),
    serviceSentManualCount: countBy(
      serviceMunicipalityRows,
      (row) => row.outreachStatus === "sent_manual",
    ),
    status,
  };
}

function buildMarkdown(summary) {
  const lines = [
    "# Greater Vancouver Expansion Status",
    "",
    `Updated: ${summary.generatedAt.slice(0, 10)}`,
    "",
    "This is the current local truth for the Vancouver-first business machine. A row counts as Greater Vancouver when it is tied to a non-Vancouver municipality or clearly serves more than Vancouver.",
    "",
    "## Current truth",
    "",
    `- Restaurant review rows in the Vancouver lane: ${summary.restaurant.totalRows}`,
    `- Restaurant owner-review-ready rows: ${summary.restaurant.ownerReviewReadyCount}`,
    `- Restaurant rows currently tagged as Greater Vancouver: ${summary.restaurant.metroAreaRowCount}`,
    `- Service review rows in the Vancouver lane: ${summary.service.totalRows}`,
    `- Service owner-review-ready rows: ${summary.service.ownerReviewReadyCount}`,
    `- Service rows currently tagged as Greater Vancouver: ${summary.service.metroAreaRowCount}`,
    `- Explicit municipalities with at least one queued row: ${summary.explicitMunicipalities.join(", ")}`,
    `- Mention-only municipalities found in service-area or proof notes: ${summary.mentionOnlyMunicipalities.length ? summary.mentionOnlyMunicipalities.join(", ") : "None"}`,
    `- Municipalities with no current queue coverage yet: ${summary.uncoveredMunicipalities.length ? summary.uncoveredMunicipalities.join(", ") : "None"}`,
    "",
    "## Municipality coverage",
    "",
    "| Municipality | Restaurant rows | Restaurant owner review | Restaurant sent | Service rows | Service owner review | Service sent | Status |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...summary.municipalityRows.map((row) =>
      `| ${row.municipality} | ${row.restaurantRows} | ${row.restaurantOwnerReviewReadyCount} | ${row.restaurantSentManualCount} | ${row.serviceRows} | ${row.serviceOwnerReviewReadyCount} | ${row.serviceSentManualCount} | ${row.status} |`,
    ),
    "",
    "## Honest read",
    "",
    "- The machine is now metro-aware locally. Off-Vancouver rows no longer get flattened back into plain Vancouver by default.",
    "- Actual off-Vancouver coverage is still thin. Burnaby, Richmond, North Vancouver, and West Vancouver have some real rows in the queue today, but Surrey, Coquitlam, Langley, and most of the rest are not yet backed by explicit reviewed queue rows.",
    "- Some service businesses do mention a wider Lower Mainland service area in their public copy. That is useful context, but it is not the same thing as having a real municipality-by-municipality inventory.",
    "",
    "## Next move",
    "",
    "1. Keep the current Vancouver-first queue and outreach lane intact.",
    "2. Add dedicated source pulls for the next municipalities instead of relying on accidental spillover.",
    "3. Start with Burnaby, Richmond, Surrey, Coquitlam, and Langley because they matter most for real metro coverage and owner leverage.",
    "",
  ];

  return lines.join("\n");
}

async function main() {
  const generatedAt = new Date().toISOString();
  const restaurantRows = vancouverRestaurantReviewBusinessSeeds;
  const serviceRows = vancouverServiceReviewBusinessSeeds;
  const metroServiceDonorRows = roamPublicBusinessWaveSeeds.filter((row) => row.cityKey === "vancouver");
  const restaurant = buildLaneSummary(restaurantRows);
  const service = buildLaneSummary(serviceRows);
  const donorMentionedMunicipalities = collectMentionedMunicipalitiesFromDonorRows(metroServiceDonorRows);
  const explicitMunicipalities = Array.from(
    new Set([...restaurant.explicitMunicipalities, ...service.explicitMunicipalities]),
  ).sort((left, right) => left.localeCompare(right));
  const mentionedMunicipalities = Array.from(
    new Set([
      ...restaurant.mentionedMunicipalities,
      ...service.mentionedMunicipalities,
      ...donorMentionedMunicipalities,
    ]),
  ).sort((left, right) => left.localeCompare(right));
  const mentionOnlyMunicipalities = mentionedMunicipalities.filter(
    (municipality) => !explicitMunicipalities.includes(municipality),
  );
  const uncoveredMunicipalities = TARGET_MUNICIPALITIES.filter(
    (municipality) =>
      !explicitMunicipalities.includes(municipality)
      && !mentionOnlyMunicipalities.includes(municipality),
  );
  const municipalityRows = TARGET_MUNICIPALITIES.map((municipality) =>
    buildMunicipalityRow(
      municipality,
      restaurantRows,
      serviceRows,
      new Set(mentionOnlyMunicipalities),
    ),
  );

  const summary = {
    ok: true,
    generatedAt,
    restaurant,
    service,
    explicitMunicipalities,
    mentionedMunicipalities,
    donorMentionedMunicipalities,
    mentionOnlyMunicipalities,
    uncoveredMunicipalities,
    municipalityRows,
    outputFiles: {
      summary: OUTPUT_JSON_PATH,
      doc: OUTPUT_DOC_PATH,
    },
  };

  await Promise.all([
    fs.writeFile(OUTPUT_JSON_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
    fs.writeFile(OUTPUT_DOC_PATH, `${buildMarkdown(summary)}\n`, "utf8"),
  ]);

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
