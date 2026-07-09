import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SERVICE_DAILY_SEND_LIMIT } from "./lib/cityatlas-daily-send-limits.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_INPUT_JSON = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-send-packet.json",
);
const DEFAULT_INPUT_CSV = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-send-packet.csv",
);
const DEFAULT_OUTPUT_DIR = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-daily-send-window/current",
);
const DEFAULT_LIMIT = SERVICE_DAILY_SEND_LIMIT;
const INPUT_READ_TIMEOUT_MS = 3000;

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function parseArgs(argv) {
  const options = {
    inputJson: DEFAULT_INPUT_JSON,
    inputCsv: DEFAULT_INPUT_CSV,
    outputDir: DEFAULT_OUTPUT_DIR,
    limit: DEFAULT_LIMIT,
  };

  for (const arg of argv) {
    if (arg.startsWith("--input-json=")) {
      options.inputJson = path.resolve(process.cwd(), arg.slice(13));
    } else if (arg.startsWith("--output-dir=")) {
      options.outputDir = path.resolve(process.cwd(), arg.slice(13));
    } else if (arg.startsWith("--limit=")) {
      const parsed = Number(arg.slice(8));
      if (Number.isFinite(parsed) && parsed > 0) {
        options.limit = Math.floor(parsed);
      }
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

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonWithTimeout(targetPath, timeoutMs) {
  const raw = await fs.readFile(targetPath, "utf8", {
    signal: AbortSignal.timeout(timeoutMs),
  });
  return JSON.parse(raw);
}

async function readPacketRows(options) {
  if (path.extname(options.inputJson).toLowerCase() === ".csv") {
    const csvRaw = await fs.readFile(options.inputJson, "utf8");
    return parseCsv(csvRaw);
  }

  try {
    const rows = await readJsonWithTimeout(options.inputJson, INPUT_READ_TIMEOUT_MS);
    if (Array.isArray(rows)) {
      return rows;
    }
  } catch (error) {
    const fallbackExists = await fileExists(options.inputCsv);
    if (!fallbackExists) {
      throw error;
    }
  }

  const csvRaw = await fs.readFile(options.inputCsv, "utf8");
  return parseCsv(csvRaw);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rows = await readPacketRows(options);

  const selected = rows
    .filter((row) => row.currentSendStatus === "owner_review_ready")
    .slice(0, options.limit);

  await fs.rm(options.outputDir, { recursive: true, force: true });
  await fs.mkdir(options.outputDir, { recursive: true });

  const manifestRows = [];
  for (const [index, row] of selected.entries()) {
    const fileBase = `${String(index + 1).padStart(3, "0")}-${slugify(row.businessName || "business") || "business"}`;
    const bodyFile = path.join(options.outputDir, `${fileBase}.txt`);
    await fs.writeFile(bodyFile, `${row.body}\n`, "utf8");
    manifestRows.push({
      rank: index + 1,
      businessName: row.businessName,
      email: row.email,
      subject: row.subject,
      bodyFile,
      neighborhood: row.neighborhood,
      cityName: row.cityName,
      municipality: row.municipality || row.cityName,
      coverageLabel: row.coverageLabel,
      category: row.category,
      businessType: row.businessType,
      sourceLabel: row.sourceLabel,
      batchStage: row.batchStage,
      personalizationAngle: row.personalizationAngle,
      hostedAsk: row.hostedAsk,
      currentSendStatus: row.currentSendStatus,
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    inputJson: options.inputJson,
    outputDir: options.outputDir,
    limit: options.limit,
    selectedCount: manifestRows.length,
    rows: manifestRows,
  };

  await fs.writeFile(
    path.join(options.outputDir, "manifest.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
