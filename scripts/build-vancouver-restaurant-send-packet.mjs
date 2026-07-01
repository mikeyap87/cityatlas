import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import { buildDefaultBusinessProspects } from "../src/lib/cityGrowth.ts";
import { buildBusinessProofCandidate } from "../src/lib/businessOutreachPrep.ts";
import { isServiceBusinessProspect } from "../src/lib/businessInventory.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "../output/growth");
const DEFAULT_CSV_PATH = path.join(OUTPUT_DIR, "vancouver-restaurant-send-packet.csv");
const DEFAULT_JSON_PATH = path.join(OUTPUT_DIR, "vancouver-restaurant-send-packet.json");
const DEFAULT_SUMMARY_PATH = path.join(OUTPUT_DIR, "vancouver-restaurant-send-packet-summary.json");
const DEFAULT_LIVE_SEND_LEDGER_PATH = path.join(OUTPUT_DIR, "vancouver-restaurant-live-send-ledger.json");

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value) {
  return normalizeText(value).toLowerCase();
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

function buildLiveLedgerKeys(row) {
  const businessName = normalizeKey(row.businessName);
  const neighborhood = normalizeKey(row.neighborhood);
  const email = normalizeKey(normalizeText(row.email).replace(/^mailto:/i, ""));
  return [
    `${businessName}::${neighborhood}::${email}`,
    `${businessName}::${email}`,
    email,
  ].filter((value, index, values) => value && values.indexOf(value) === index);
}

function createLiveLedgerLookup(entries) {
  const lookup = new Map();
  for (const entry of entries) {
    for (const key of buildLiveLedgerKeys(entry)) {
      if (!lookup.has(key)) {
        lookup.set(key, entry);
      }
    }
  }
  return lookup;
}

function findLiveLedgerEntry(lookup, row) {
  for (const key of buildLiveLedgerKeys(row)) {
    const match = lookup.get(key);
    if (match) {
      return match;
    }
  }
  return null;
}

function escapeCsv(value) {
  const text = String(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function looksLikeRestaurantLane(prospect) {
  if (isServiceBusinessProspect(prospect)) {
    return false;
  }

  const combined = [
    prospect.businessName,
    prospect.category,
    prospect.segment,
    prospect.sourceLabel,
  ]
    .filter(Boolean)
    .join(" ");
  const text = normalizeKey(combined);

  if (/college|educational|school|cafeteria|golf|frozen food|caterer/.test(text)) {
    return false;
  }

  return /\b(?:restaurant|bar|pub|bistro|grill|kitchen|cafe|cafes|coffee|bakery|sushi|pizza|ramen|tavern|dinner|hospitality|wine|yakiniku|afghan|indian|chicken|eatery)\b/.test(
    text,
  );
}

function getAngle(prospect, candidate) {
  const text = normalizeKey(`${prospect.category} ${prospect.segment}`);
  if (/bar|pub|wine|tavern/.test(text)) {
    return "a Vancouver night-out, drinks, or hosted-evening angle";
  }
  if (/cafe|coffee|bakery/.test(text)) {
    return "a Vancouver cafe, neighborhood stop, or low-friction local route angle";
  }
  if (/sushi|pizza|ramen|afghan|indian|yakiniku|restaurant|kitchen|grill|bistro|chicken/.test(text)) {
    return "a Vancouver dining or night-out angle";
  }
  return candidate.draft.angle || "a Vancouver local-discovery angle";
}

function buildSubject(prospect) {
  return `CityAtlas feature idea for ${prospect.businessName}`;
}

function buildBody(prospect, candidate) {
  const angle = getAngle(prospect, candidate);
  const neighborhood = normalizeText(prospect.neighborhood);
  const neighborhoodLine = neighborhood
    ? `- the ${neighborhood} route, neighborhood, or guide where you fit best`
    : "- the route, neighborhood, or guide where you fit best";

  return [
    `Hi ${prospect.businessName} team,`,
    "",
    "I run CityAtlas, a Vancouver discovery site built around local routes and neighborhood guides instead of flat listings.",
    "",
    `I already have ${prospect.businessName} in my local review queue for ${angle}, and I think there is a strong fit for a complimentary preview feature or route placement draft.`,
    "",
    "If helpful, I can send over a short preview showing:",
    "- the CityAtlas angle I think fits you",
    neighborhoodLine,
    "- the one booking, visit, or planning angle that reads most clearly",
    "",
    "If the fit feels good, I would love to line up a hosted visit so I can experience it properly and build the feature with accurate detail.",
    "",
    "Worth sending over a quick preview?",
    "",
    "Michael",
    "CityAtlas",
    "https://city.univenturestudio.com",
  ].join("\n");
}

function getCurrentSendStatus(prospect) {
  if (prospect.outreachStatus === "sent_manual") return "already_sent";
  if (prospect.outreachStatus === "replied") return "replied";
  if (prospect.outreachStatus === "do_not_contact") return "do_not_contact";
  if (prospect.approvalStatus === "owner_approved") return "approved_but_not_sent_here";
  if (prospect.approvalStatus === "ready_for_owner_review") return "owner_review_ready";
  return "review_only";
}

async function main() {
  const liveLedgerInput = await readJsonOrNull(DEFAULT_LIVE_SEND_LEDGER_PATH);
  const liveLedgerEntries = Array.isArray(liveLedgerInput)
    ? liveLedgerInput
    : Array.isArray(liveLedgerInput?.rows)
      ? liveLedgerInput.rows
      : [];
  const liveLedgerLookup = createLiveLedgerLookup(liveLedgerEntries);
  const businessProspects = buildDefaultBusinessProspects(seedData);
  const currentRows = businessProspects
    .filter((prospect) => prospect.cityKey === "vancouver")
    .filter((prospect) => Boolean(normalizeText(prospect.email)))
    .filter((prospect) => looksLikeRestaurantLane(prospect));
  const liveLedgerMatchedCount = currentRows.filter((prospect) => findLiveLedgerEntry(liveLedgerLookup, prospect)).length;

  const unsentRows = currentRows
    .filter((prospect) => !["sent_manual", "replied", "do_not_contact"].includes(prospect.outreachStatus))
    .filter((prospect) => !findLiveLedgerEntry(liveLedgerLookup, prospect))
    .map((prospect) => {
      const candidate = buildBusinessProofCandidate(prospect);
      return {
        businessName: prospect.businessName,
        email: prospect.email,
        subject: buildSubject(prospect),
        body: buildBody(prospect, candidate),
        cityName: prospect.cityName,
        neighborhood: prospect.neighborhood,
        category: prospect.category,
        segment: prospect.segment,
        sourceLabel: prospect.sourceLabel,
        sourceUrl: prospect.sourceUrl,
        website: prospect.website,
        approvalStatus: prospect.approvalStatus,
        outreachStatus: prospect.outreachStatus,
        currentSendStatus: getCurrentSendStatus(prospect),
        batchStage: candidate.stage,
        batchLane: candidate.batchLane,
        promotionScore: candidate.score,
        personalizationAngle: getAngle(prospect, candidate),
        nextStep: candidate.missing.join(" | ") || "Ready for the next reviewed send decision.",
        notes: prospect.notes,
      };
    })
    .sort((left, right) => {
      if (left.currentSendStatus !== right.currentSendStatus) {
        return left.currentSendStatus.localeCompare(right.currentSendStatus);
      }
      if (right.promotionScore !== left.promotionScore) {
        return right.promotionScore - left.promotionScore;
      }
      return left.businessName.localeCompare(right.businessName);
    });

  const summary = {
    generatedAt: new Date().toISOString(),
    totalRestaurantEmailRowsInQueue: currentRows.length,
    unsentRestaurantEmailRows: unsentRows.length,
    ownerReviewReadyRows: unsentRows.filter((row) => row.currentSendStatus === "owner_review_ready").length,
    reviewOnlyRows: unsentRows.filter((row) => row.currentSendStatus === "review_only").length,
    approvedButUnsentRows: unsentRows.filter((row) => row.currentSendStatus === "approved_but_not_sent_here").length,
    liveLedgerSuppressionCount: liveLedgerMatchedCount,
    liveSendLedgerPath: DEFAULT_LIVE_SEND_LEDGER_PATH,
    outputCsv: DEFAULT_CSV_PATH,
    outputJson: DEFAULT_JSON_PATH,
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await Promise.all([
    fs.writeFile(
      DEFAULT_CSV_PATH,
      buildCsv(
        [
          "businessName",
          "email",
          "subject",
          "body",
          "cityName",
          "neighborhood",
          "category",
          "segment",
          "sourceLabel",
          "sourceUrl",
          "website",
          "approvalStatus",
          "outreachStatus",
          "currentSendStatus",
          "batchStage",
          "batchLane",
          "promotionScore",
          "personalizationAngle",
          "nextStep",
          "notes",
        ],
        unsentRows,
      ),
      "utf8",
    ),
    fs.writeFile(DEFAULT_JSON_PATH, `${JSON.stringify(unsentRows, null, 2)}\n`, "utf8"),
    fs.writeFile(DEFAULT_SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
