import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_MANIFEST_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-daily-send-window/current/manifest.json",
);
const DEFAULT_OUTPUT_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-daily-send-results.json",
);
const DEFAULT_SENDER = "michael.yap.87@gmail.com";
const DEFAULT_CHANNEL = "gmail";
const DEFAULT_APPROVAL_STATUS = "owner_approved";
const DEFAULT_OUTREACH_STATUS = "sent_manual";
const DEFAULT_RELATIONSHIP_WARMTH = "unknown";

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRanks(value) {
  return new Set(
    normalizeText(value)
      .split(",")
      .map((entry) => Number(entry.trim()))
      .filter((entry) => Number.isFinite(entry) && entry > 0)
      .map((entry) => Math.floor(entry)),
  );
}

function parseArgs(argv) {
  const options = {
    manifestPath: DEFAULT_MANIFEST_PATH,
    outputPath: DEFAULT_OUTPUT_PATH,
    sender: DEFAULT_SENDER,
    channel: DEFAULT_CHANNEL,
    approvalStatus: DEFAULT_APPROVAL_STATUS,
    outreachStatus: DEFAULT_OUTREACH_STATUS,
    relationshipWarmth: DEFAULT_RELATIONSHIP_WARMTH,
    messageId: "",
    threadId: "",
    sentRanks: new Set(),
    recordAll: false,
    note: "",
  };

  for (const arg of argv) {
    if (arg.startsWith("--manifest=")) {
      options.manifestPath = path.resolve(process.cwd(), arg.slice(11));
    } else if (arg.startsWith("--output=")) {
      options.outputPath = path.resolve(process.cwd(), arg.slice(9));
    } else if (arg.startsWith("--sender=")) {
      options.sender = normalizeText(arg.slice(9)) || DEFAULT_SENDER;
    } else if (arg.startsWith("--channel=")) {
      options.channel = normalizeText(arg.slice(10)) || DEFAULT_CHANNEL;
    } else if (arg.startsWith("--approval-status=")) {
      options.approvalStatus = normalizeText(arg.slice(18)) || DEFAULT_APPROVAL_STATUS;
    } else if (arg.startsWith("--outreach-status=")) {
      options.outreachStatus = normalizeText(arg.slice(18)) || DEFAULT_OUTREACH_STATUS;
    } else if (arg.startsWith("--relationship-warmth=")) {
      options.relationshipWarmth =
        normalizeText(arg.slice(22)) || DEFAULT_RELATIONSHIP_WARMTH;
    } else if (arg.startsWith("--message-id=")) {
      options.messageId = normalizeText(arg.slice(13));
    } else if (arg.startsWith("--thread-id=")) {
      options.threadId = normalizeText(arg.slice(12));
    } else if (arg.startsWith("--sent-ranks=")) {
      options.sentRanks = parseRanks(arg.slice(13));
    } else if (arg === "--all=1" || arg === "--all") {
      options.recordAll = true;
    } else if (arg.startsWith("--note=")) {
      options.note = normalizeText(arg.slice(7));
    }
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rawManifest = await fs.readFile(options.manifestPath, "utf8");
  const manifest = JSON.parse(rawManifest);
  const manifestRows = Array.isArray(manifest?.rows) ? manifest.rows : [];

  const selectedRows =
    options.recordAll
      ? manifestRows
      : options.sentRanks.size > 0
      ? manifestRows.filter((row) => options.sentRanks.has(Number(row.rank)))
      : [];

  const sentAt = new Date().toISOString();
  const rows = selectedRows.map((row) => ({
    businessName: normalizeText(row.businessName),
    neighborhood: normalizeText(row.neighborhood),
    cityName: normalizeText(row.cityName),
    category: normalizeText(row.category),
    sourceLabel: normalizeText(row.sourceLabel),
    email: normalizeText(row.email).toLowerCase(),
    subject: normalizeText(row.subject),
    approvalStatus: options.approvalStatus,
    outreachStatus: options.outreachStatus,
    relationshipWarmth: options.relationshipWarmth,
    sender: options.sender,
    channel: options.channel,
    sentAt,
    lastUpdatedAt: sentAt,
    messageId: options.messageId,
    threadId: options.threadId,
    note:
      options.note
      || "Owner-approved automated Gmail send recorded from the CityAtlas daily send window.",
  }));

  const summary = {
    generatedAt: sentAt,
    manifestPath: options.manifestPath,
    outputPath: options.outputPath,
    sender: options.sender,
    channel: options.channel,
    selectedCount: manifestRows.length,
    recordedCount: rows.length,
    recordAll: options.recordAll,
    sentRanks: [...options.sentRanks].sort((left, right) => left - right),
    rows,
  };

  await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
  await fs.writeFile(options.outputPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
