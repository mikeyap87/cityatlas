import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  RESTAURANT_DAILY_SEND_LIMIT,
  SERVICE_DAILY_SEND_LIMIT,
} from "./lib/cityatlas-daily-send-limits.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "output/growth");
const operatorDir = path.join(root, "public/operator");

const lanes = [
  {
    id: "restaurant",
    label: "Restaurants",
    packetPath: path.join(outputDir, "vancouver-restaurant-send-packet.json"),
    summaryPath: path.join(outputDir, "vancouver-restaurant-send-packet-summary.json"),
    ledgerPath: path.join(outputDir, "vancouver-restaurant-live-send-ledger.json"),
    dailyLimit: RESTAURANT_DAILY_SEND_LIMIT,
  },
  {
    id: "service",
    label: "Services",
    packetPath: path.join(outputDir, "vancouver-service-send-packet.json"),
    summaryPath: path.join(outputDir, "vancouver-service-send-packet-summary.json"),
    ledgerPath: path.join(outputDir, "vancouver-service-live-send-ledger.json"),
    dailyLimit: SERVICE_DAILY_SEND_LIMIT,
  },
];

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

async function readJsonOrFallback(targetPath, fallback) {
  try {
    return JSON.parse(await fs.readFile(targetPath, "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

function countBy(rows, labelGetter, limit = Number.MAX_SAFE_INTEGER) {
  const counts = new Map();
  for (const row of rows) {
    const label = normalizeText(labelGetter(row)) || "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Object.fromEntries(
    Array.from(counts.entries())
      .sort((left, right) => {
        if (right[1] !== left[1]) return right[1] - left[1];
        return left[0].localeCompare(right[0]);
      })
      .slice(0, limit),
  );
}

function mergeCounts(...countObjects) {
  const merged = new Map();
  for (const countObject of countObjects) {
    for (const [label, count] of Object.entries(countObject ?? {})) {
      merged.set(label, (merged.get(label) ?? 0) + Number(count || 0));
    }
  }
  return Object.fromEntries(
    Array.from(merged.entries()).sort((left, right) => {
      if (right[1] !== left[1]) return right[1] - left[1];
      return left[0].localeCompare(right[0]);
    }),
  );
}

function takeCount(countObject, labels) {
  return labels.reduce((total, label) => total + Number(countObject?.[label] ?? 0), 0);
}

function topEntries(countObject, limit = 6) {
  return Object.entries(countObject ?? {})
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count;
      return left.label.localeCompare(right.label);
    })
    .slice(0, limit);
}

async function summarizeLane(lane) {
  const packetRows = await readJsonOrFallback(lane.packetPath, []);
  const summary = await readJsonOrFallback(lane.summaryPath, {});
  const ledger = await readJsonOrFallback(lane.ledgerPath, { rows: [] });
  const ownerReviewReadyRows = packetRows.filter(
    (row) => row.currentSendStatus === "owner_review_ready",
  );
  const reviewOnlyRows = packetRows.filter((row) => row.currentSendStatus === "review_only");
  const nextWindowRows = ownerReviewReadyRows.slice(0, lane.dailyLimit);

  const ownerReviewReadyByMunicipality =
    summary.ownerReviewReadyByMunicipality
    ?? countBy(ownerReviewReadyRows, (row) => row.municipality || row.cityName);
  const ownerReviewReadyByType =
    summary.ownerReviewReadyByType
    ?? countBy(ownerReviewReadyRows, (row) => row.businessType || row.category, 15);

  return {
    id: lane.id,
    label: lane.label,
    generatedAt: summary.generatedAt || "",
    dailyLimit: lane.dailyLimit,
    totalEmailRowsInQueue:
      summary.totalRestaurantEmailRowsInQueue
      ?? summary.totalServiceEmailRowsInQueue
      ?? packetRows.length,
    unsentEmailRows:
      summary.unsentRestaurantEmailRows
      ?? summary.unsentServiceEmailRows
      ?? packetRows.length,
    ownerReviewReadyRows: summary.ownerReviewReadyRows ?? ownerReviewReadyRows.length,
    reviewOnlyRows: summary.reviewOnlyRows ?? reviewOnlyRows.length,
    approvedButUnsentRows: summary.approvedButUnsentRows ?? 0,
    alreadySentRows: Array.isArray(ledger.rows) ? ledger.rows.length : 0,
    liveLedgerSuppressionCount: summary.liveLedgerSuppressionCount ?? 0,
    ownerReviewReadyByMunicipality,
    ownerReviewReadyByType,
    nextWindowPreview: nextWindowRows.map((row, index) => ({
      rank: index + 1,
      businessName: row.businessName,
      municipality: row.municipality || row.cityName || "Unknown",
      category: row.businessType || row.category || "Unknown",
      email: row.email,
      subject: row.subject,
    })),
  };
}

function buildMarkdown(status) {
  const laneSections = status.lanes.map((lane) => {
    const cities = topEntries(lane.ownerReviewReadyByMunicipality)
      .map((entry) => `${entry.label}: ${entry.count}`)
      .join(", ");
    const types = topEntries(lane.ownerReviewReadyByType)
      .map((entry) => `${entry.label}: ${entry.count}`)
      .join(", ");
    const previewRows = lane.nextWindowPreview
      .slice(0, 8)
      .map((row) => `- ${row.businessName} (${row.municipality}, ${row.category})`)
      .join("\n");

    return `## ${lane.label}

- Owner-review-ready remaining: ${lane.ownerReviewReadyRows}
- Unsent rows: ${lane.unsentEmailRows}
- Already sent in live ledger: ${lane.alreadySentRows}
- Daily window limit: ${lane.dailyLimit}
- Top cities: ${cities || "None"}
- Top types: ${types || "None"}

Next window preview:
${previewRows || "- None"}`;
  });

  return `# CityAtlas Outreach Queue Status

Generated: ${status.generatedAt}

## Combined

- Owner-review-ready remaining: ${status.combined.ownerReviewReadyRows}
- Unsent rows: ${status.combined.unsentEmailRows}
- Already sent in live ledgers: ${status.combined.alreadySentRows}
- Next daily window capacity: ${status.combined.nextDailyWindowLimit}
- Estimated daily windows remaining: ${status.combined.estimatedDailyWindowsRemaining}
- Langley and Township of Langley owner-review-ready rows: ${status.combined.langleyOwnerReviewReadyRows}

Best next move: ${status.bestNextMove}

${laneSections.join("\n\n")}
`;
}

async function main() {
  const laneSummaries = [];
  for (const lane of lanes) {
    laneSummaries.push(await summarizeLane(lane));
  }

  const ownerReviewReadyByMunicipality = mergeCounts(
    ...laneSummaries.map((lane) => lane.ownerReviewReadyByMunicipality),
  );
  const ownerReviewReadyByType = mergeCounts(
    ...laneSummaries.map((lane) => lane.ownerReviewReadyByType),
  );
  const ownerReviewReadyRows = laneSummaries.reduce(
    (sum, lane) => sum + lane.ownerReviewReadyRows,
    0,
  );
  const nextDailyWindowLimit = laneSummaries.reduce((sum, lane) => sum + lane.dailyLimit, 0);
  const status = {
    generatedAt: new Date().toISOString(),
    scope: "cityatlas_vancouver_and_greater_vancouver_outreach_queue",
    publicPartnerPreviewUrl: "https://city.univenturestudio.com/for-businesses/partner-preview",
    lanes: laneSummaries,
    combined: {
      unsentEmailRows: laneSummaries.reduce((sum, lane) => sum + lane.unsentEmailRows, 0),
      ownerReviewReadyRows,
      reviewOnlyRows: laneSummaries.reduce((sum, lane) => sum + lane.reviewOnlyRows, 0),
      alreadySentRows: laneSummaries.reduce((sum, lane) => sum + lane.alreadySentRows, 0),
      nextDailyWindowLimit,
      estimatedDailyWindowsRemaining:
        nextDailyWindowLimit > 0 ? Math.ceil(ownerReviewReadyRows / nextDailyWindowLimit) : null,
      langleyOwnerReviewReadyRows: takeCount(ownerReviewReadyByMunicipality, [
        "Langley",
        "Township of Langley",
      ]),
      ownerReviewReadyByMunicipality,
      ownerReviewReadyByType,
    },
    bestNextMove:
      ownerReviewReadyRows > 0
        ? "Let the next daily automation send only the manifest rows inside the 100/day cap, then reply quickly to interested businesses with the partner-preview link and hosted-experience ask only when the fit is clear."
        : "Rebuild the restaurant and service send packets before the next automation window.",
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(operatorDir, { recursive: true });

  const json = `${JSON.stringify(status, null, 2)}\n`;
  const markdown = buildMarkdown(status);
  await fs.writeFile(path.join(outputDir, "cityatlas-outreach-queue-status.json"), json, "utf8");
  await fs.writeFile(path.join(outputDir, "cityatlas-outreach-queue-status.md"), markdown, "utf8");
  await fs.writeFile(path.join(operatorDir, "cityatlasOutreachQueueStatus.json"), json, "utf8");

  console.log(JSON.stringify(status, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
