import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildBusinessInventorySourceUrl,
  getOfficialMetroPartnerFit,
} from "../src/lib/businessInventory.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;
const RUN_DATE = "2026-06-24";
const DEFAULT_BATCH_ID = "greater-vancouver-official-priority-research-batch-001";
const OPERATOR_SUMMARY_PATH = path.resolve(
  __dirname,
  "../public/operator/greaterVancouverOfficialBusinessInventorySummary.json",
);
const DEFAULT_OUTPUT_CSV = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-priority-research-batch-001.csv",
);
const DEFAULT_OUTPUT_SUMMARY = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-priority-research-batch-001-summary.json",
);

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArgs(argv) {
  const options = {
    operatorSummaryPath: OPERATOR_SUMMARY_PATH,
    outputCsv: DEFAULT_OUTPUT_CSV,
    outputSummary: DEFAULT_OUTPUT_SUMMARY,
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
    batchId: DEFAULT_BATCH_ID,
    municipality: "all",
    tier: "priority",
  };

  for (const arg of argv) {
    if (arg.startsWith("--operator-summary=")) {
      options.operatorSummaryPath = path.resolve(process.cwd(), arg.slice(19));
    } else if (arg.startsWith("--output-csv=")) {
      options.outputCsv = path.resolve(process.cwd(), arg.slice(13));
    } else if (arg.startsWith("--output-summary=")) {
      options.outputSummary = path.resolve(process.cwd(), arg.slice(17));
    } else if (arg.startsWith("--limit=")) {
      const parsed = Number(arg.slice(8));
      if (Number.isFinite(parsed) && parsed > 0) {
        options.limit = Math.floor(parsed);
      }
    } else if (arg.startsWith("--offset=")) {
      const parsed = Number(arg.slice(9));
      if (Number.isFinite(parsed) && parsed >= 0) {
        options.offset = Math.floor(parsed);
      }
    } else if (arg.startsWith("--batch-id=")) {
      const value = normalizeText(arg.slice(11));
      if (value) {
        options.batchId = value;
      }
    } else if (arg.startsWith("--municipality=")) {
      const value = normalizeText(arg.slice(15));
      if (value) {
        options.municipality = value;
      }
    } else if (arg.startsWith("--tier=")) {
      const value = normalizeText(arg.slice(7)).toLowerCase();
      if (["priority", "review", "holdout", "all"].includes(value)) {
        options.tier = value;
      }
    }
  }

  return options;
}

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

function compareRows(left, right) {
  return (
    right.partnerFitScore - left.partnerFitScore
    || normalizeText(left.localArea).localeCompare(normalizeText(right.localArea))
    || normalizeText(left.businessName).localeCompare(normalizeText(right.businessName))
    || normalizeText(left.streetAddress).localeCompare(normalizeText(right.streetAddress))
  );
}

function selectDiversifiedBatch(records, limit) {
  const grouped = new Map();

  for (const record of records) {
    const municipality = normalizeText(record.municipality) || "Unknown";
    const existing = grouped.get(municipality) || [];
    existing.push(record);
    grouped.set(municipality, existing);
  }

  const orderedMunicipalities = Array.from(grouped.entries())
    .sort(
      (left, right) =>
        right[1].length - left[1].length
        || left[0].localeCompare(right[0]),
    )
    .map(([municipality]) => municipality);

  for (const rows of grouped.values()) {
    rows.sort(compareRows);
  }

  const selected = [];
  while (selected.length < limit) {
    let addedInRound = false;

    for (const municipality of orderedMunicipalities) {
      const rows = grouped.get(municipality) || [];
      const next = rows.shift();
      if (!next) continue;
      selected.push(next);
      addedInRound = true;
      if (selected.length >= limit) {
        break;
      }
    }

    if (!addedInRound) {
      break;
    }
  }

  return selected;
}

function summarizeByMunicipality(rows) {
  const counts = {};
  for (const row of rows) {
    const key = row.municipality || "Unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

async function loadOperatorRows(operatorSummaryPath) {
  const operatorSummary = JSON.parse(await fs.readFile(operatorSummaryPath, "utf8"));
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

function mapResearchRow(record, index, batchId, fit) {
  const displayName = normalizeText(record.businessTradeName || record.businessName);
  const rawEmail = normalizeText(record.email).toLowerCase();
  const rawContactPath = normalizeText(record.publicContactPath || record.website);
  return {
    researchBatchId: batchId,
    sequence: String(index + 1),
    cityName: normalizeText(record.cityName || record.municipality || "Vancouver"),
    municipality: normalizeText(record.municipality),
    localArea: normalizeText(record.localArea),
    businessName: displayName,
    legalBusinessName: normalizeText(record.businessName),
    businessType: normalizeText(record.businessType),
    businessSubtype: normalizeText(record.businessSubtype),
    categoryPrimary: normalizeText(record.categoryPrimary),
    categorySecondary: normalizeText(record.categorySecondary),
    streetAddress: normalizeText(record.streetAddress),
    postalCode: normalizeText(record.postalCode),
    sourceRecordId: normalizeText(record.sourceRecordId),
    inventoryId: normalizeText(record.inventoryId),
    officialSourceUrl: normalizeText(buildBusinessInventorySourceUrl(record)),
    officialWebsite: normalizeText(record.website),
    contactPage: rawContactPath,
    privateDiningPage: "",
    publicEmail: rawEmail,
    publicPhone: normalizeText(record.phone),
    categoryFromSite: normalizeText(record.categoryPrimary),
    cuisineFromSite: normalizeText(record.cuisine),
    researchSource: rawEmail || rawContactPath || record.phone
      ? "Official Greater Vancouver municipal business inventory"
      : "",
    researchStatus: rawEmail
      ? "public_email_found"
      : rawContactPath || record.website
        ? "contact_path_found"
        : "needs_official_site_lookup",
    sendEligibility: rawEmail
      ? "email_ready_for_manual_review"
      : rawContactPath || record.website
        ? "contact_path_ready"
        : "not_send_ready",
    nextStep:
      "Find the official website first, then the contact or booking page, and only keep direct business emails that the business publishes publicly.",
    notes:
      "Imported from the verified Greater Vancouver official business inventory. Treat this as local research only until the official site and contact path are rechecked.",
    partnerFitTier: fit.tier,
    partnerFitReason: fit.reason,
    partnerFitFlags: fit.flags.join("; "),
    partnerFitScore: String(fit.score),
    lastSeededAt: RUN_DATE,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { operatorSummary, rows } = await loadOperatorRows(options.operatorSummaryPath);
  const requestedMunicipality = normalizeText(options.municipality).toLowerCase();

  const filteredRecords = rows
    .map((record) => ({ record, fit: getOfficialMetroPartnerFit(record) }))
    .filter(({ record, fit }) => {
      if (options.tier !== "all" && fit.tier !== options.tier) {
        return false;
      }
      if (
        requestedMunicipality !== "all"
        && normalizeText(record.municipality).toLowerCase() !== requestedMunicipality
      ) {
        return false;
      }
      return true;
    })
    .map(({ record, fit }) => ({
      ...record,
      partnerFitTier: fit.tier,
      partnerFitReason: fit.reason,
      partnerFitFlags: fit.flags.join("; "),
      partnerFitScore: fit.score,
    }))
    .sort(compareRows);

  const selectedRecords = selectDiversifiedBatch(
    filteredRecords.slice(options.offset),
    options.limit,
  );
  const researchRows = selectedRecords.map((record, index) =>
    mapResearchRow(record, index, options.batchId, {
      tier: record.partnerFitTier,
      reason: record.partnerFitReason,
      flags: normalizeText(record.partnerFitFlags)
        ? record.partnerFitFlags.split(/\s*;\s*/).filter(Boolean)
        : [],
      score: record.partnerFitScore,
    })
  );

  const summary = {
    ok: true,
    generatedAt: new Date().toISOString(),
    runDate: RUN_DATE,
    batchId: options.batchId,
    selectedCount: researchRows.length,
    totalEligibleCount: filteredRecords.length,
    limit: options.limit,
    offset: options.offset,
    tier: options.tier,
    municipality: requestedMunicipality === "all" ? "all" : options.municipality,
    includedMunicipalities: operatorSummary.includedMunicipalities ?? [],
    selectedByMunicipality: summarizeByMunicipality(researchRows),
    outputCsv: options.outputCsv,
    outputSummary: options.outputSummary,
  };

  await fs.mkdir(path.dirname(options.outputCsv), { recursive: true });
  await Promise.all([
    fs.writeFile(options.outputCsv, buildCsv(researchRows), "utf8"),
    fs.writeFile(options.outputSummary, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
