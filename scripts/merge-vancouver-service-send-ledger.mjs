import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_INPUT_RESULTS = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-daily-send-results.json",
);
const DEFAULT_LEDGER_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-live-send-ledger.json",
);

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildKey(row) {
  return [
    normalizeText(row.businessName).toLowerCase(),
    normalizeText(row.neighborhood).toLowerCase(),
    normalizeText(row.email).toLowerCase(),
  ].join("::");
}

function parseArgs(argv) {
  const options = {
    inputResults: DEFAULT_INPUT_RESULTS,
    ledgerPath: DEFAULT_LEDGER_PATH,
  };

  for (const arg of argv) {
    if (arg.startsWith("--input-results=")) {
      options.inputResults = path.resolve(process.cwd(), arg.slice(16));
    } else if (arg.startsWith("--ledger-path=")) {
      options.ledgerPath = path.resolve(process.cwd(), arg.slice(14));
    }
  }

  return options;
}

async function readJsonOrNull(targetPath) {
  try {
    return JSON.parse(await fs.readFile(targetPath, "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = await readJsonOrNull(options.inputResults);
  if (!input) {
    throw new Error(`Input results file not found: ${options.inputResults}`);
  }

  const ledger = (await readJsonOrNull(options.ledgerPath)) || {
    generatedAt: new Date().toISOString(),
    sender: "michael.yap.87@gmail.com",
    channel: "gmail",
    scope: "vancouver_service_owner_review_ready_batch_001",
    rows: [],
  };

  const incomingRows = Array.isArray(input) ? input : Array.isArray(input.rows) ? input.rows : [];
  const merged = new Map((ledger.rows || []).map((row) => [buildKey(row), row]));
  for (const row of incomingRows) {
    merged.set(buildKey(row), row);
  }

  const nextLedger = {
    ...ledger,
    generatedAt: new Date().toISOString(),
    rows: [...merged.values()].sort(
      (left, right) =>
        normalizeText(left.businessName).localeCompare(normalizeText(right.businessName))
        || normalizeText(left.neighborhood).localeCompare(normalizeText(right.neighborhood))
        || normalizeText(left.email).localeCompare(normalizeText(right.email)),
    ),
  };

  await fs.mkdir(path.dirname(options.ledgerPath), { recursive: true });
  await fs.writeFile(options.ledgerPath, `${JSON.stringify(nextLedger, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        ok: true,
        ledgerPath: options.ledgerPath,
        mergedRowCount: nextLedger.rows.length,
        addedOrUpdatedCount: incomingRows.length,
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
