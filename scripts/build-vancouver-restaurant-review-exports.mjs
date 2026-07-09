import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUSINESS_PROSPECT_IMPORT_HEADERS = [
  "businessName",
  "email",
  "contactName",
  "cityName",
  "neighborhood",
  "category",
  "segment",
  "sourceLabel",
  "sourceUrl",
  "website",
  "contactPath",
  "notes",
  "relationshipWarmth",
];
const PROFILE_CONFIG = {
  restaurant: {
    enrichedCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-enriched.csv",
    ),
    reviewCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-review.csv",
    ),
    outputSummary: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-review-exports-summary.json",
    ),
    importSourceLabel(reviewDecision) {
      if (reviewDecision === "email_candidate_review") {
        return "Outscraper restaurant email candidate review";
      }
      if (reviewDecision === "contact_path_review") {
        return "Outscraper restaurant contact-path review";
      }
      return "Outscraper restaurant research review";
    },
    importSegment(row) {
      const subtype = normalizeText(row.businessSubtype);
      if (subtype) return subtype;
      if (normalizeText(row.businessType) === "Limited Service Food Establishment") {
        return "Cafe and quick-service food";
      }
      return "Restaurant";
    },
    importCategory(enrichedRow, reviewRow) {
      return pickFirst(
        enrichedRow.categoryFromSite,
        reviewRow.categoryFromSite,
        enrichedRow.outscraperPlaceType,
        enrichedRow.businessType,
        "Restaurant",
      );
    },
    importNotes(enrichedRow, reviewRow) {
      return [
        `Imported from Vancouver restaurant Outscraper review batch ${normalizeText(reviewRow.researchBatchId) || "001"}.`,
        `Review decision: ${reviewRow.reviewDecision.replaceAll("_", " ")}.`,
        `Review reason: ${trimSentenceEnding(reviewRow.reviewReason)}.`,
        normalizeText(enrichedRow.nextStep),
      ]
        .filter(Boolean)
        .join(" ");
    },
  },
  service: {
    enrichedCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-enriched.csv",
    ),
    reviewCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-review.csv",
    ),
    outputSummary: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-review-exports-summary.json",
    ),
    importSourceLabel(reviewDecision) {
      if (reviewDecision === "email_candidate_review") {
        return "Outscraper service email candidate review";
      }
      if (reviewDecision === "contact_path_review") {
        return "Outscraper service contact-path review";
      }
      return "Outscraper service research review";
    },
    importSegment(row) {
      return pickFirst(row.businessSubtype, row.outscraperPlaceType, row.businessType, "Service business");
    },
    importCategory(enrichedRow, reviewRow) {
      return pickFirst(
        enrichedRow.categoryFromSite,
        reviewRow.categoryFromSite,
        enrichedRow.outscraperPlaceType,
        enrichedRow.businessSubtype,
        enrichedRow.businessType,
        "Service business",
      );
    },
    importNotes(enrichedRow, reviewRow) {
      return [
        `Imported from Vancouver service Outscraper review batch ${normalizeText(reviewRow.researchBatchId) || "001"}.`,
        `Review decision: ${reviewRow.reviewDecision.replaceAll("_", " ")}.`,
        `Review reason: ${trimSentenceEnding(reviewRow.reviewReason)}.`,
        normalizeText(enrichedRow.nextStep),
      ]
        .filter(Boolean)
        .join(" ");
    },
  },
};

function parseArgs(argv) {
  const profileArg = argv.find((arg) => arg.startsWith("--profile="));
  const requestedProfile = normalizeText(profileArg?.slice(10) || "restaurant").toLowerCase();
  const profile = PROFILE_CONFIG[requestedProfile] ? requestedProfile : "restaurant";
  const defaults = PROFILE_CONFIG[profile];
  const options = {
    profile,
    enrichedCsv: defaults.enrichedCsv,
    reviewCsv: defaults.reviewCsv,
    outputSummary: defaults.outputSummary,
  };

  for (const arg of argv) {
    if (arg.startsWith("--profile=")) {
      continue;
    }
    if (arg.startsWith("--enriched-csv=")) {
      options.enrichedCsv = path.resolve(process.cwd(), arg.slice(15));
    }
    if (arg.startsWith("--review-csv=")) {
      options.reviewCsv = path.resolve(process.cwd(), arg.slice(13));
    }
    if (arg.startsWith("--output-summary=")) {
      options.outputSummary = path.resolve(process.cwd(), arg.slice(17));
    }
  }

  return options;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (inQuotes) {
      if (character === '"' && nextCharacter === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      inQuotes = true;
      continue;
    }
    if (character === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    if (character === "\r") {
      continue;
    }

    field += character;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers = [], ...dataRows] = rows;
  return dataRows
    .filter((currentRow) => currentRow.some((value) => value.trim().length > 0))
    .map((currentRow) =>
      Object.fromEntries(headers.map((header, columnIndex) => [header, currentRow[columnIndex] ?? ""])),
    );
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

function buildCsvWithHeaders(headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function trimSentenceEnding(value) {
  return normalizeText(value).replace(/[.?!]+$/, "");
}

function pickFirst(...values) {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return "";
}

function slugifyDecision(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveDecisionCsvPath(baseCsvPath, decision) {
  const parsed = path.parse(baseCsvPath);
  const stem = parsed.name.endsWith("-review")
    ? parsed.name.slice(0, -7)
    : parsed.name;
  return path.join(parsed.dir, `${stem}-${slugifyDecision(decision)}.csv`);
}

function deriveDecisionImportCsvPath(baseCsvPath, decision) {
  const parsed = path.parse(baseCsvPath);
  const stem = parsed.name.endsWith("-review")
    ? parsed.name.slice(0, -7)
    : parsed.name;
  return path.join(parsed.dir, `${stem}-${slugifyDecision(decision)}-import.csv`);
}

function buildReviewKey(row) {
  return `${normalizeText(row.researchBatchId)}::${normalizeText(row.sequence)}`;
}
function buildBusinessProspectImportRows(pairs, profileConfig) {
  return pairs.map(({ enrichedRow, reviewRow }) => ({
    businessName: normalizeText(enrichedRow.businessName),
    email:
      reviewRow.reviewDecision === "email_candidate_review"
        ? normalizeText(enrichedRow.publicEmail)
        : "",
    contactName: "",
    cityName: normalizeText(enrichedRow.cityName || "Vancouver"),
    neighborhood: normalizeText(enrichedRow.localArea),
    category: profileConfig.importCategory(enrichedRow, reviewRow),
    segment: profileConfig.importSegment(enrichedRow),
    sourceLabel: profileConfig.importSourceLabel(reviewRow.reviewDecision),
    sourceUrl: pickFirst(
      enrichedRow.officialWebsite,
      enrichedRow.contactPage,
      enrichedRow.officialSourceUrl,
    ),
    website: pickFirst(enrichedRow.officialWebsite),
    contactPath:
      reviewRow.reviewDecision === "email_candidate_review"
        ? pickFirst(
            normalizeText(enrichedRow.publicEmail)
              ? `mailto:${normalizeText(enrichedRow.publicEmail).toLowerCase()}`
              : "",
            enrichedRow.contactPage,
            enrichedRow.officialWebsite,
            enrichedRow.officialSourceUrl,
          )
        : pickFirst(
            enrichedRow.contactPage,
            enrichedRow.privateDiningPage,
            enrichedRow.officialWebsite,
            enrichedRow.officialSourceUrl,
          ),
    notes: profileConfig.importNotes(enrichedRow, reviewRow),
    relationshipWarmth: "unknown",
  }));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const profileConfig = PROFILE_CONFIG[options.profile];
  const [enrichedCsv, reviewCsv] = await Promise.all([
    fs.readFile(options.enrichedCsv, "utf8"),
    fs.readFile(options.reviewCsv, "utf8"),
  ]);
  const enrichedRows = parseCsv(enrichedCsv);
  const reviewRows = parseCsv(reviewCsv);
  const enrichedByKey = new Map(enrichedRows.map((row) => [buildReviewKey(row), row]));
  const pairedRows = reviewRows
    .map((reviewRow) => ({
      reviewRow,
      enrichedRow: enrichedByKey.get(buildReviewKey(reviewRow)),
    }))
    .filter((entry) => entry.enrichedRow);

  const splitReviewOutputs = {};
  const splitImportOutputs = {};
  const countsByDecision = {};

  for (const { reviewRow } of pairedRows) {
    countsByDecision[reviewRow.reviewDecision] = (countsByDecision[reviewRow.reviewDecision] ?? 0) + 1;
  }

  const pairedByDecision = new Map();
  for (const pair of pairedRows) {
    const existing = pairedByDecision.get(pair.reviewRow.reviewDecision) || [];
    existing.push(pair);
    pairedByDecision.set(pair.reviewRow.reviewDecision, existing);
  }

  await fs.mkdir(path.dirname(options.outputSummary), { recursive: true });

  const writeJobs = [];
  for (const [reviewDecision, pairs] of pairedByDecision.entries()) {
    const decisionCsvPath = deriveDecisionCsvPath(options.reviewCsv, reviewDecision);
    splitReviewOutputs[reviewDecision] = decisionCsvPath;
    writeJobs.push(
      fs.writeFile(
        decisionCsvPath,
        buildCsv(pairs.map((pair) => pair.reviewRow)),
        "utf8",
      ),
    );

    if (reviewDecision === "email_candidate_review" || reviewDecision === "contact_path_review") {
      const importCsvPath = deriveDecisionImportCsvPath(options.reviewCsv, reviewDecision);
      splitImportOutputs[reviewDecision] = importCsvPath;
      writeJobs.push(
        fs.writeFile(
          importCsvPath,
          buildCsvWithHeaders(
            BUSINESS_PROSPECT_IMPORT_HEADERS,
            buildBusinessProspectImportRows(pairs, profileConfig),
          ),
          "utf8",
        ),
      );
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    profile: options.profile,
    enrichedCsv: options.enrichedCsv,
    reviewCsv: options.reviewCsv,
    pairedRowCount: pairedRows.length,
    countsByDecision,
    splitReviewOutputs,
    splitImportOutputs,
  };

  writeJobs.push(
    fs.writeFile(options.outputSummary, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  );

  await Promise.all(writeJobs);

  console.log(
    JSON.stringify(
      {
        ok: true,
        outputSummary: options.outputSummary,
        pairedRowCount: pairedRows.length,
        countsByDecision,
        splitReviewOutputs,
        splitImportOutputs,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
