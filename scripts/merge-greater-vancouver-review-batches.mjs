import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "../output/growth");
const DEFAULT_ENRICHED_OUTPUT = path.join(
  OUTPUT_DIR,
  "greater-vancouver-official-priority-research-batch-all-enriched.csv",
);
const DEFAULT_REVIEW_OUTPUT = path.join(
  OUTPUT_DIR,
  "greater-vancouver-official-priority-research-batch-all-review.csv",
);
const DEFAULT_SUMMARY_OUTPUT = path.join(
  OUTPUT_DIR,
  "greater-vancouver-official-priority-research-batch-all-merge-summary.json",
);

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArgs(argv) {
  const options = {
    outputDir: OUTPUT_DIR,
    enrichedOutput: DEFAULT_ENRICHED_OUTPUT,
    reviewOutput: DEFAULT_REVIEW_OUTPUT,
    summaryOutput: DEFAULT_SUMMARY_OUTPUT,
  };

  for (const arg of argv) {
    if (arg.startsWith("--output-dir=")) {
      options.outputDir = path.resolve(process.cwd(), arg.slice(13));
    } else if (arg.startsWith("--enriched-output=")) {
      options.enrichedOutput = path.resolve(process.cwd(), arg.slice(18));
    } else if (arg.startsWith("--review-output=")) {
      options.reviewOutput = path.resolve(process.cwd(), arg.slice(16));
    } else if (arg.startsWith("--summary-output=")) {
      options.summaryOutput = path.resolve(process.cwd(), arg.slice(17));
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
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function buildRowKey(row) {
  return `${normalizeText(row.researchBatchId)}::${normalizeText(row.sequence)}`;
}

function compareRows(left, right) {
  const batchCompare = normalizeText(left.researchBatchId).localeCompare(normalizeText(right.researchBatchId));
  if (batchCompare !== 0) return batchCompare;
  return Number(left.sequence || 0) - Number(right.sequence || 0);
}

function batchSortKey(fileName) {
  const match = fileName.match(/batch-(\d+)-/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number(match[1]);
}

async function readCsvRows(targetPath) {
  return parseCsv(await fs.readFile(targetPath, "utf8"));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const files = await fs.readdir(options.outputDir);

  const enrichedFiles = files
    .filter((file) => /^greater-vancouver-official-priority-research-batch-\d+-enriched\.csv$/.test(file))
    .sort((left, right) => batchSortKey(left) - batchSortKey(right) || left.localeCompare(right));

  const includedBatches = [];
  const mergedEnriched = [];
  const mergedReview = [];
  const enrichedSeen = new Set();
  const reviewSeen = new Set();

  for (const enrichedFile of enrichedFiles) {
    const batchId = enrichedFile.replace("-enriched.csv", "");
    const reviewFile = `${batchId}-review.csv`;
    if (!files.includes(reviewFile)) {
      continue;
    }

    const enrichedPath = path.join(options.outputDir, enrichedFile);
    const reviewPath = path.join(options.outputDir, reviewFile);
    const [enrichedRows, reviewRows] = await Promise.all([
      readCsvRows(enrichedPath),
      readCsvRows(reviewPath),
    ]);

    includedBatches.push({
      batchId,
      enrichedFile: enrichedPath,
      reviewFile: reviewPath,
      enrichedRowCount: enrichedRows.length,
      reviewRowCount: reviewRows.length,
    });

    for (const row of enrichedRows) {
      const key = buildRowKey(row);
      if (enrichedSeen.has(key)) continue;
      enrichedSeen.add(key);
      mergedEnriched.push(row);
    }

    for (const row of reviewRows) {
      const key = buildRowKey(row);
      if (reviewSeen.has(key)) continue;
      reviewSeen.add(key);
      mergedReview.push(row);
    }
  }

  mergedEnriched.sort(compareRows);
  mergedReview.sort(compareRows);

  const summary = {
    ok: true,
    generatedAt: new Date().toISOString(),
    includedBatchCount: includedBatches.length,
    includedBatches,
    mergedEnrichedRowCount: mergedEnriched.length,
    mergedReviewRowCount: mergedReview.length,
    outputFiles: {
      enrichedCsv: options.enrichedOutput,
      reviewCsv: options.reviewOutput,
      summary: options.summaryOutput,
    },
  };

  await fs.mkdir(path.dirname(options.enrichedOutput), { recursive: true });
  await Promise.all([
    fs.writeFile(options.enrichedOutput, buildCsv(mergedEnriched), "utf8"),
    fs.writeFile(options.reviewOutput, buildCsv(mergedReview), "utf8"),
    fs.writeFile(options.summaryOutput, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
