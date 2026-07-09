import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;
const RUN_DATE = "2026-06-21";
const PROFILE_CONFIG = {
  restaurant: {
    label: "restaurant",
    inputJson: path.resolve(__dirname, "../public/operator/vancouverOfficialFoodInventory.json"),
    outputCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001.csv",
    ),
    outputSummary: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-summary.json",
    ),
    batchId: "vancouver-restaurant-contact-research-batch-001",
    includeRecord(record) {
      const businessType = normalizeText(record.businessType);
      return (
        businessType === "Restaurant"
        || businessType === "Limited Service Food Establishment"
      );
    },
    nextStep:
      "Find the official website first, then the contact or private dining page, and only copy a public email if the business publishes one.",
    rowNotes:
      "Imported from the official Vancouver restaurant licence inventory. The raw city dataset did not include website, phone, or email fields for this row.",
    summaryNotes: [
      "Google Places can help find official websites and phones, but it does not expose business email addresses directly.",
      "Every public email should still be copied from the business's own official site before any outreach queue is widened.",
      "This batch is for local research only and does not imply send approval.",
    ],
    qualityScore() {
      return 0;
    },
  },
  service: {
    label: "service",
    inputJson: path.resolve(__dirname, "../public/operator/vancouverOfficialServiceInventory.json"),
    outputCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001.csv",
    ),
    outputSummary: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-summary.json",
    ),
    batchId: "vancouver-service-contact-research-batch-001",
    includeRecord(record) {
      return normalizeText(record.sourceScope) === "vancouver_services_issued_2026";
    },
    nextStep:
      "Find the official website first, then the contact, booking, or inquiry page, and only copy a public email if the business publishes one.",
    rowNotes:
      "Imported from the official Vancouver service-business inventory. The raw city dataset did not include website, phone, or email fields for this row.",
    summaryNotes: [
      "Google Places can help find official websites and phones, but it still does not expose business email addresses directly.",
      "Every public email should still be copied from the business's own official site before any outreach queue is widened.",
      "This batch is for local research only and does not imply send approval.",
    ],
    qualityScore(record) {
      const displayName = buildDisplayName(record);
      const streetAddress = normalizeText(record.streetAddress);
      const businessType = normalizeText(record.businessType);
      let score = 0;
      if (displayName && !/^\(.+\)$/.test(displayName)) score += 20;
      if (streetAddress) score += 10;
      if (/vehicle|repair|maintenance/.test(businessType)) score += 6;
      if (/fitness|sport/.test(businessType)) score += 4;
      if (/beauty/.test(businessType)) score += 2;
      if (normalizeText(record.localArea) === "Out of Town") score -= 12;
      return score;
    },
  },
};

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArgs(argv) {
  const profileArg = argv.find((arg) => arg.startsWith("--profile="));
  const requestedProfile = normalizeText(profileArg?.slice(10) || "restaurant").toLowerCase();
  const profile = PROFILE_CONFIG[requestedProfile] ? requestedProfile : "restaurant";
  const defaults = PROFILE_CONFIG[profile];
  const options = {
    profile,
    inputJson: defaults.inputJson,
    outputCsv: defaults.outputCsv,
    outputSummary: defaults.outputSummary,
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
    batchId: defaults.batchId,
  };

  for (const arg of argv) {
    if (arg.startsWith("--profile=")) {
      continue;
    }
    if (arg.startsWith("--input-json=")) {
      options.inputJson = path.resolve(process.cwd(), arg.slice(13));
    } else if (arg.startsWith("--output-csv=")) {
      options.outputCsv = path.resolve(process.cwd(), arg.slice(13));
    } else if (arg.startsWith("--output-summary=")) {
      options.outputSummary = path.resolve(process.cwd(), arg.slice(17));
    } else if (arg.startsWith("--limit=")) {
      const parsed = Number(arg.split("=")[1]);
      if (Number.isFinite(parsed) && parsed > 0) {
        options.limit = Math.floor(parsed);
      }
    } else if (arg.startsWith("--offset=")) {
      const parsed = Number(arg.split("=")[1]);
      if (Number.isFinite(parsed) && parsed >= 0) {
        options.offset = Math.floor(parsed);
      }
    } else if (arg.startsWith("--batch-id=")) {
      const value = normalizeText(arg.slice(11));
      if (value) {
        options.batchId = value;
      }
    }
  }

  return options;
}

function buildDisplayName(record) {
  return normalizeText(record.businessTradeName || record.businessName);
}

function compareRows(left, right, profileConfig) {
  const qualityDiff = profileConfig.qualityScore(right) - profileConfig.qualityScore(left);
  if (qualityDiff !== 0) return qualityDiff;
  return (
    normalizeText(left.localArea).localeCompare(normalizeText(right.localArea))
    || buildDisplayName(left).localeCompare(buildDisplayName(right))
    || normalizeText(left.streetAddress).localeCompare(normalizeText(right.streetAddress))
  );
}

function selectDiversifiedBatch(records, limit, profileConfig) {
  const grouped = new Map();

  for (const record of records) {
    const area = normalizeText(record.localArea) || "Unknown";
    const existing = grouped.get(area) || [];
    existing.push(record);
    grouped.set(area, existing);
  }

  const orderedAreas = Array.from(grouped.entries())
    .sort(
      (left, right) =>
        right[1].length - left[1].length
        || left[0].localeCompare(right[0]),
    )
    .map(([area]) => area);

  for (const rows of grouped.values()) {
    rows.sort((left, right) => compareRows(left, right, profileConfig));
  }

  const selected = [];

  while (selected.length < limit) {
    let addedInRound = false;

    for (const area of orderedAreas) {
      const rows = grouped.get(area) || [];
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

function mapRow(record, index, batchId, profileConfig) {
  const displayName = buildDisplayName(record);
  return {
    researchBatchId: batchId,
    sequence: String(index + 1),
    cityName: normalizeText(record.cityName || record.municipality || "Vancouver"),
    localArea: normalizeText(record.localArea),
    businessName: displayName,
    legalBusinessName: normalizeText(record.businessName),
    businessType: normalizeText(record.businessType),
    businessSubtype: normalizeText(record.businessSubtype),
    streetAddress: normalizeText(record.streetAddress),
    postalCode: normalizeText(record.postalCode),
    sourceRecordId: normalizeText(record.sourceRecordId),
    inventoryId: normalizeText(record.inventoryId),
    officialSourceUrl: normalizeText(record.officialSourceUrl),
    officialWebsite: "",
    contactPage: "",
    privateDiningPage: "",
    publicEmail: "",
    publicPhone: "",
    categoryFromSite: "",
    cuisineFromSite: "",
    researchSource: "",
    researchStatus: "needs_official_site_lookup",
    sendEligibility: "not_send_ready",
    nextStep: profileConfig.nextStep,
    notes: profileConfig.rowNotes,
    lastSeededAt: RUN_DATE,
  };
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

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const profileConfig = PROFILE_CONFIG[options.profile];
  const raw = await fs.readFile(options.inputJson, "utf8");
  const records = JSON.parse(raw);
  const filteredRecords = records
    .filter((record) => profileConfig.includeRecord(record))
    .sort((left, right) => compareRows(left, right, profileConfig));
  const researchRows = selectDiversifiedBatch(
    filteredRecords.slice(options.offset),
    options.limit,
    profileConfig,
  ).map((record, index) => mapRow(record, index, options.batchId, profileConfig));

  const summary = {
    generatedAt: new Date().toISOString(),
    runDate: RUN_DATE,
    profile: options.profile,
    sourceFile: options.inputJson,
    batchId: options.batchId,
    limit: options.limit,
    offset: options.offset,
    selectedCount: researchRows.length,
    localAreas: Array.from(new Set(researchRows.map((row) => row.localArea))).filter(Boolean),
    researchStatus: "needs_official_site_lookup",
    sendEligibility: "not_send_ready",
    notes: profileConfig.summaryNotes,
  };

  await fs.mkdir(path.dirname(options.outputCsv), { recursive: true });
  await Promise.all([
    fs.writeFile(options.outputCsv, buildCsv(researchRows), "utf8"),
    fs.writeFile(options.outputSummary, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);

  console.log(`Vancouver ${profileConfig.label} research batch`);
  console.log(
    JSON.stringify(
      {
        outputCsv: options.outputCsv,
        outputSummary: options.outputSummary,
        batchId: options.batchId,
        offset: options.offset,
        selectedCount: researchRows.length,
      },
      null,
      2,
    ),
  );
}

await main();
