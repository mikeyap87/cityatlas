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
const DEFAULT_CSV_PATH = path.join(OUTPUT_DIR, "vancouver-service-send-packet.csv");
const DEFAULT_JSON_PATH = path.join(OUTPUT_DIR, "vancouver-service-send-packet.json");
const DEFAULT_SUMMARY_PATH = path.join(OUTPUT_DIR, "vancouver-service-send-packet-summary.json");
const DEFAULT_LIVE_SEND_LEDGER_PATH = path.join(OUTPUT_DIR, "vancouver-service-live-send-ledger.json");

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeEmail(value) {
  return normalizeText(value).replace(/^mailto:/i, "").toLowerCase();
}

function isUsableEmail(value) {
  const email = normalizeEmail(value);
  if (!email) return false;
  if (/[<>\s]/.test(email)) return false;
  if (/u003e|u003c|%3e|%3c|&gt;|&lt;|&#/.test(email)) return false;
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

const MUNICIPALITY_PRIORITY = [
  "Vancouver",
  "Langley",
  "Township of Langley",
  "Burnaby",
  "Richmond",
  "Coquitlam",
  "Surrey",
  "North Vancouver",
  "West Vancouver",
  "Port Coquitlam",
  "Port Moody",
  "New Westminster",
  "Delta",
  "Maple Ridge",
  "Pitt Meadows",
  "White Rock",
];

const MUNICIPALITY_PRIORITY_LOOKUP = new Map(
  MUNICIPALITY_PRIORITY.map((municipality, index) => [normalizeKey(municipality), index]),
);

const GREATER_VANCOUVER_PATTERN =
  /\b(burnaby|richmond|surrey|north vancouver|west vancouver|coquitlam|port coquitlam|port moody|delta|maple ridge|pitt meadows|white rock|langley|new westminster|greater vancouver|metro vancouver|lower mainland|fraser valley)\b/i;
const REVIEW_FIRST_SOURCE_PATTERN = /\b(greater vancouver official|official review donor)\b/i;
const GENERIC_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "me.com",
  "msn.com",
  "outlook.com",
  "yahoo.ca",
  "yahoo.com",
]);
const BUSINESS_TOKEN_STOPWORDS = new Set([
  "and",
  "bc",
  "canada",
  "canadian",
  "city",
  "co",
  "company",
  "corp",
  "corporation",
  "inc",
  "incorporated",
  "ltd",
  "limited",
  "the",
  "vancouver",
]);

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

function normalizeDomain(value) {
  return normalizeKey(value)
    .replace(/^www\./, "")
    .split("/")
    .at(0)
    ?.replace(/[^a-z0-9.-]/g, "")
    ?? "";
}

function getEmailDomain(value) {
  const email = normalizeEmail(value);
  if (!email.includes("@")) return "";
  return normalizeDomain(email.split("@").pop());
}

function getUrlHostname(value) {
  const raw = normalizeText(value);
  if (!raw) return "";
  try {
    return normalizeDomain(new URL(raw).hostname);
  } catch {
    return normalizeDomain(raw.replace(/^https?:\/\//i, ""));
  }
}

function getBusinessTokens(value) {
  return normalizeKey(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !BUSINESS_TOKEN_STOPWORDS.has(token));
}

function hasBusinessDomainOverlap(prospect, domain) {
  if (!domain) return true;
  const domainText = normalizeKey(domain);
  return getBusinessTokens(prospect.businessName).some((token) => domainText.includes(token));
}

function getContactQualityIssue(prospect) {
  const sourceLabel = normalizeText(prospect.sourceLabel);
  const emailDomain = getEmailDomain(prospect.email);
  if (!REVIEW_FIRST_SOURCE_PATTERN.test(sourceLabel) || !emailDomain || GENERIC_EMAIL_DOMAINS.has(emailDomain)) {
    return "";
  }

  const websiteHost = getUrlHostname(prospect.website || prospect.sourceUrl);
  const contactHost = getUrlHostname(prospect.contactPath);
  const emailDomainMatchesBusiness = hasBusinessDomainOverlap(prospect, emailDomain);
  if (
    !emailDomainMatchesBusiness
    && (websiteHost.endsWith(`.${emailDomain}`) || contactHost.endsWith(`.${emailDomain}`))
  ) {
    return `Hold for contact QA: ${emailDomain} looks like a contact-platform domain for ${prospect.businessName}, not the business contact itself.`;
  }

  const candidateDomains = [emailDomain, websiteHost, contactHost].filter(Boolean);
  const hasOverlap = candidateDomains.some((domain) => hasBusinessDomainOverlap(prospect, domain));
  if (hasOverlap) return "";

  return `Hold for contact QA: email/domain ${emailDomain} does not clearly match ${prospect.businessName}.`;
}

function getMunicipalityLabel(prospect) {
  return normalizeText(prospect.municipality || prospect.cityName || "Unknown");
}

function getBusinessTypeLabel(prospect) {
  return normalizeText(prospect.category || prospect.segment || prospect.sourceLabel || "Unknown");
}

function getMunicipalityPriority(prospectOrRow) {
  const municipality = normalizeKey(prospectOrRow.municipality || prospectOrRow.cityName);
  return MUNICIPALITY_PRIORITY_LOOKUP.get(municipality) ?? Number.MAX_SAFE_INTEGER;
}

function buildCountMap(rows, labelGetter, limit = Number.MAX_SAFE_INTEGER) {
  const counts = new Map();
  for (const row of rows) {
    const label = normalizeText(labelGetter(row));
    if (!label) continue;
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  return Object.fromEntries(
    Array.from(counts.entries())
      .sort((left, right) => {
        if (right[1] !== left[1]) {
          return right[1] - left[1];
        }
        return left[0].localeCompare(right[0]);
      })
      .slice(0, limit),
  );
}

function looksLikeServiceLane(prospect) {
  return isServiceBusinessProspect(prospect);
}

function getAngle(prospect, candidate) {
  const text = normalizeKey(`${prospect.category} ${prospect.segment}`);
  if (/repair|cleaning|detail|mobile service|home service|clinic/.test(text)) {
    return "a trusted local service, convenience, or problem-solving angle";
  }
  if (/hotel|guest|concierge/.test(text)) {
    return "a guest-hosting, out-of-town visitor, or concierge-support angle";
  }
  if (/wellness|\bspa\b|massage|fitness|recovery/.test(text)) {
    return "a Vancouver wellness reset, recovery, or team-reset angle";
  }
  if (/event|venue|planner|production|gallery|museum|cultural|entertainment/.test(text)) {
    return "a hosted-visit, celebration, or culture-route angle";
  }
  if (/coworking|studio|creator/.test(text)) {
    return "a workday-base, creative-neighborhood, or local-service angle";
  }
  return candidate.draft.angle || "a Vancouver local-discovery angle";
}

function getBatchLabel(prospect) {
  const text = normalizeKey(`${prospect.category} ${prospect.segment}`);
  if (/repair|cleaning|detail|mobile service|home service|clinic|auto/.test(text)) {
    return "service businesses";
  }
  if (/hotel|guest|concierge/.test(text)) {
    return "hotel and guest-service businesses";
  }
  if (/wellness|\bspa\b|massage|fitness|recovery/.test(text)) {
    return "wellness and recovery businesses";
  }
  if (/event|venue|planner|production|gallery|museum|cultural|entertainment/.test(text)) {
    return "event, venue, and culture businesses";
  }
  if (/coworking|studio|creator/.test(text)) {
    return "studio and creative-service businesses";
  }
  return "trusted local businesses";
}

function getCoverageLabel(prospect) {
  if (prospect.marketScope === "metro_area") {
    return "Greater Vancouver";
  }
  if (normalizeText(prospect.municipality) && normalizeText(prospect.municipality) !== "Vancouver") {
    return "Greater Vancouver";
  }

  const text = [
    prospect.businessName,
    prospect.municipality,
    prospect.neighborhood,
    prospect.category,
    prospect.segment,
    prospect.notes,
    prospect.sourceProof,
  ]
    .filter(Boolean)
    .join(" ");
  return GREATER_VANCOUVER_PATTERN.test(text) ? "Greater Vancouver" : "Vancouver";
}

function getHostedAsk(prospect) {
  const text = normalizeKey(`${prospect.businessName} ${prospect.category} ${prospect.segment}`);
  if (/auto|repair|mechanic|tire|body shop|detailing|detail/.test(text)) {
    return "a complimentary diagnostic, inspection, detail sample, or small service for Michael, with one guest included when the service naturally supports two people";
  }
  if (/cleaning|home service|house|maid|janitorial|mobile service/.test(text)) {
    return "a complimentary walkthrough, sample clean, or service credit that lets Michael understand the service quality firsthand";
  }
  if (/wellness|\bspa\b|massage|fitness|recovery|clinic|physio|chiro|yoga/.test(text)) {
    return "a complimentary treatment, class, recovery session, or wellness experience for Michael and one guest";
  }
  if (/hotel|guest|concierge|accommodation|inn|suite/.test(text)) {
    return "a complimentary property walkthrough, hosted visit, or guest-experience preview for Michael and one guest";
  }
  if (/event|venue|planner|production|gallery|museum|cultural|entertainment/.test(text)) {
    return "a complimentary site walkthrough, hosted visit, or sample experience for Michael and one guest";
  }
  if (/coworking|studio|creator|workspace/.test(text)) {
    return "a complimentary walkthrough, day pass, studio session, or service sample for Michael and one guest";
  }
  return "a complimentary hosted visit, service sample, walkthrough, or offering for Michael and one guest";
}

function buildSubject(prospect) {
  return `CityAtlas feature idea for ${prospect.businessName}`;
}

function buildBody(prospect, candidate) {
  const angle = getAngle(prospect, candidate);
  const batchLabel = getBatchLabel(prospect);
  const coverageLabel = getCoverageLabel(prospect);
  const hostedAsk = getHostedAsk(prospect);
  const neighborhood = normalizeText(prospect.neighborhood);
  const neighborhoodLine = neighborhood
    ? `- the ${neighborhood} route, neighborhood, or guide where you fit best`
    : "- the route, neighborhood, or guide where you fit best";

  return [
    `Hi ${prospect.businessName} team,`,
    "",
    "I run CityAtlas, a Vancouver-first discovery site built around local routes, neighborhood guides, and trusted local businesses instead of flat listings.",
    "",
    `I'm reviewing a small batch of ${coverageLabel} ${batchLabel} right now, with a few others already in the review list, and ${prospect.businessName} looks like a strong fit for ${angle}.`,
    "",
    "There is no fee to be considered for this first batch.",
    "The first yes is not a paid package; it is simply a preview conversation so we can see if the fit is real.",
    "Here is the plain-English partner preview: https://city.univenturestudio.com/for-businesses/partner-preview",
    "",
    "If helpful, I can send over a short preview showing:",
    "- the CityAtlas angle I think fits you",
    neighborhoodLine,
    "- the one visit, service, booking, or planning angle that reads most clearly",
    "",
    `If the preview feels useful and you want to move ahead, the first ask is simple: ${hostedAsk}, so I can build the feature with accurate detail.`,
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
  if (getContactQualityIssue(prospect)) return "review_only";
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
    .filter((prospect) => isUsableEmail(prospect.email))
    .filter((prospect) => looksLikeServiceLane(prospect));
  const liveLedgerMatchedCount = currentRows.filter((prospect) => findLiveLedgerEntry(liveLedgerLookup, prospect)).length;

  const unsentRows = currentRows
    .filter((prospect) => !["sent_manual", "replied", "do_not_contact"].includes(prospect.outreachStatus))
    .filter((prospect) => !findLiveLedgerEntry(liveLedgerLookup, prospect))
    .map((prospect) => {
      const candidate = buildBusinessProofCandidate(prospect);
      const contactQualityIssue = getContactQualityIssue(prospect);
      return {
        businessName: prospect.businessName,
        email: prospect.email,
        subject: buildSubject(prospect),
        body: buildBody(prospect, candidate),
        cityName: prospect.cityName,
        municipality: getMunicipalityLabel(prospect),
        coverageLabel: getCoverageLabel(prospect),
        neighborhood: prospect.neighborhood,
        category: prospect.category,
        businessType: getBusinessTypeLabel(prospect),
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
        hostedAsk: getHostedAsk(prospect),
        contactQualityIssue,
        nextStep: contactQualityIssue || candidate.missing.join(" | ") || "Ready for the next reviewed send decision.",
        notes: prospect.notes,
      };
    })
    .sort((left, right) => {
      if (left.currentSendStatus !== right.currentSendStatus) {
        return left.currentSendStatus.localeCompare(right.currentSendStatus);
      }
      if (getMunicipalityPriority(left) !== getMunicipalityPriority(right)) {
        return getMunicipalityPriority(left) - getMunicipalityPriority(right);
      }
      if (right.promotionScore !== left.promotionScore) {
        return right.promotionScore - left.promotionScore;
      }
      return left.businessName.localeCompare(right.businessName);
    });

  const ownerReviewReadyRows = unsentRows.filter((row) => row.currentSendStatus === "owner_review_ready");
  const reviewOnlyRows = unsentRows.filter((row) => row.currentSendStatus === "review_only");
  const approvedButUnsentRows = unsentRows.filter((row) => row.currentSendStatus === "approved_but_not_sent_here");
  const contactQualityIssueRows = unsentRows.filter((row) => row.contactQualityIssue);

  const summary = {
    generatedAt: new Date().toISOString(),
    totalServiceEmailRowsInQueue: currentRows.length,
    unsentServiceEmailRows: unsentRows.length,
    ownerReviewReadyRows: ownerReviewReadyRows.length,
    reviewOnlyRows: reviewOnlyRows.length,
    approvedButUnsentRows: approvedButUnsentRows.length,
    contactQualityIssueRows: contactQualityIssueRows.length,
    municipalityPriority: MUNICIPALITY_PRIORITY,
    ownerReviewReadyByMunicipality: buildCountMap(ownerReviewReadyRows, (row) => row.municipality),
    ownerReviewReadyByType: buildCountMap(ownerReviewReadyRows, (row) => row.businessType, 10),
    unsentByMunicipality: buildCountMap(unsentRows, (row) => row.municipality),
    unsentByType: buildCountMap(unsentRows, (row) => row.businessType, 10),
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
          "municipality",
          "coverageLabel",
          "neighborhood",
          "category",
          "businessType",
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
          "hostedAsk",
          "contactQualityIssue",
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
