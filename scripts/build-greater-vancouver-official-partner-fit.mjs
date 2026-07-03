import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildBusinessInventorySourceUrl,
  getOfficialMetroPartnerFit,
} from "../src/lib/businessInventory.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPERATOR_SUMMARY_PATH = path.resolve(
  __dirname,
  "../public/operator/greaterVancouverOfficialBusinessInventorySummary.json",
);
const OUTPUT_SUMMARY_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-partner-fit-summary.json",
);
const OUTPUT_ALL_CSV_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-partner-fit.csv",
);
const OUTPUT_PRIORITY_CSV_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-partner-fit-priority.csv",
);
const OUTPUT_DOC_PATH = path.resolve(
  __dirname,
  "../docs/seo-aeo-geo/GREATER_VANCOUVER_PARTNER_FIT_STATUS.md",
);

function escapeCsv(value) {
  const text = String(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function sortRows(rows) {
  return rows.slice().sort((left, right) =>
    right.partnerFitScore - left.partnerFitScore
    || left.municipality.localeCompare(right.municipality)
    || left.businessType.localeCompare(right.businessType)
    || left.businessName.localeCompare(right.businessName)
  );
}

function summarizeByMunicipality(rows) {
  const summary = {};
  for (const row of rows) {
    const bucket = summary[row.municipality] ?? {
      priority: 0,
      review: 0,
      holdout: 0,
    };
    bucket[row.partnerFitTier] += 1;
    summary[row.municipality] = bucket;
  }
  return summary;
}

function summarizeTopBusinessTypes(rows, limit = 12) {
  const counts = new Map();
  for (const row of rows) {
    const label = row.businessType || row.categoryPrimary || "Unlabeled priority rows";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([businessType, count]) => ({ businessType, count }));
}

function buildMarkdown(summary) {
  const lines = [
    "# Greater Vancouver Partner-Fit Status",
    "",
    `Updated: ${summary.generatedAt.slice(0, 10)}`,
    "",
    "This is the current local reduction layer for the verified Greater Vancouver official inventory. It separates likely first-pass partner targets from rows that should stay review-first or holdout.",
    "",
    "## Current truth",
    "",
    `- Total verified official metro rows now in the local builder: ${summary.recordCount}`,
    `- Priority rows for first-pass partner review: ${summary.tierCounts.priority}`,
    `- Review-first rows that may still be useful but need more judgment: ${summary.tierCounts.review}`,
    `- Holdout rows kept out of bulk staging by default: ${summary.tierCounts.holdout}`,
    `- Municipalities currently included: ${summary.includedMunicipalities.join(", ")}`,
    "",
    "## Municipality split",
    "",
    "| Municipality | Priority | Review-first | Holdout |",
    "| --- | --- | --- | --- |",
    ...Object.entries(summary.byMunicipality).map(([municipality, counts]) =>
      `| ${municipality} | ${counts.priority} | ${counts.review} | ${counts.holdout} |`
    ),
    "",
    "## Top priority business types",
    "",
    ...summary.topPriorityBusinessTypes.map(
      (entry, index) => `${index + 1}. ${entry.businessType} (${entry.count})`,
    ),
    "",
    "## Honest read",
    "",
    "- This layer does not claim these rows are outreach-ready. It only makes the official inventory more usable by surfacing cleaner first-pass targets before obvious low-fit noise.",
    "- Holdout rows still exist in the full inventory, but they stay out of bulk staging by default so rentals, adult services, banks, and similar low-fit classes do not dominate the queue.",
    "- Richmond is still excluded from this reduction layer because it remains fetch-blocked from the current lane.",
    "",
    "## Output files",
    "",
    `- Full scored CSV: \`${path.relative(path.resolve(__dirname, ".."), OUTPUT_ALL_CSV_PATH)}\``,
    `- Priority shortlist CSV: \`${path.relative(path.resolve(__dirname, ".."), OUTPUT_PRIORITY_CSV_PATH)}\``,
    `- Summary JSON: \`${path.relative(path.resolve(__dirname, ".."), OUTPUT_SUMMARY_PATH)}\``,
    "",
  ];

  return lines.join("\n");
}

async function loadOperatorRows() {
  const operatorSummary = JSON.parse(await fs.readFile(OPERATOR_SUMMARY_PATH, "utf8"));
  const municipalityFiles = operatorSummary.municipalityFiles ?? {};
  const rows = [];

  for (const municipality of operatorSummary.includedMunicipalities ?? []) {
    const publicPath = municipalityFiles[municipality];
    if (!publicPath) continue;
    const localPath = path.resolve(__dirname, `../public${publicPath}`);
    const municipalityRows = JSON.parse(await fs.readFile(localPath, "utf8"));
    rows.push(...municipalityRows);
  }

  return {
    operatorSummary,
    rows,
  };
}

async function main() {
  const { operatorSummary, rows } = await loadOperatorRows();
  const scoredRows = sortRows(
    rows.map((record) => {
      const fit = getOfficialMetroPartnerFit(record);
      return {
        municipality: record.municipality,
        businessName: record.businessTradeName || record.businessName,
        businessType: record.businessType,
        businessSubtype: record.businessSubtype,
        categoryPrimary: record.categoryPrimary,
        streetAddress: record.streetAddress,
        localArea: record.localArea,
        email: record.email,
        phone: record.phone,
        licenseStatus: record.licenseStatus,
        publicContactPath: record.publicContactPath,
        officialSourceUrl: buildBusinessInventorySourceUrl(record),
        partnerFitTier: fit.tier,
        partnerFitReason: fit.reason,
        partnerFitFlags: fit.flags.join("; "),
        partnerFitScore: fit.score,
        lastVerifiedDate: record.lastVerifiedDate,
      };
    }),
  );
  const priorityRows = scoredRows.filter((row) => row.partnerFitTier === "priority");
  const tierCounts = scoredRows.reduce(
    (counts, row) => {
      counts[row.partnerFitTier] += 1;
      return counts;
    },
    {
      priority: 0,
      review: 0,
      holdout: 0,
    },
  );
  const summary = {
    ok: true,
    generatedAt: new Date().toISOString(),
    recordCount: scoredRows.length,
    includedMunicipalities: operatorSummary.includedMunicipalities ?? [],
    tierCounts,
    byMunicipality: summarizeByMunicipality(scoredRows),
    topPriorityBusinessTypes: summarizeTopBusinessTypes(priorityRows),
    outputFiles: {
      summary: OUTPUT_SUMMARY_PATH,
      allCsv: OUTPUT_ALL_CSV_PATH,
      priorityCsv: OUTPUT_PRIORITY_CSV_PATH,
      doc: OUTPUT_DOC_PATH,
    },
  };

  await Promise.all([
    fs.writeFile(OUTPUT_SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
    fs.writeFile(OUTPUT_ALL_CSV_PATH, buildCsv(scoredRows), "utf8"),
    fs.writeFile(OUTPUT_PRIORITY_CSV_PATH, buildCsv(priorityRows), "utf8"),
    fs.writeFile(OUTPUT_DOC_PATH, `${buildMarkdown(summary)}\n`, "utf8"),
  ]);

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
