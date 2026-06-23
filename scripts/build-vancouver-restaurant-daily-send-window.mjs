import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_INPUT_JSON = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-send-packet.json",
);
const DEFAULT_OUTPUT_DIR = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-daily-send-window/current",
);
const DEFAULT_LIMIT = 40;

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

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const raw = await fs.readFile(options.inputJson, "utf8");
  const rows = JSON.parse(raw);

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
      category: row.category,
      sourceLabel: row.sourceLabel,
      batchStage: row.batchStage,
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
