import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import { buildDefaultBusinessProspects } from "../src/lib/cityGrowth.ts";
import { buildBusinessProofCandidate } from "../src/lib/businessOutreachPrep.ts";
import { isServiceBusinessProspect } from "../src/lib/businessInventory.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SEND_LEDGER_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-live-send-ledger.json",
);
const DEFAULT_ENRICHED_CSV = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-contact-research-batch-001-enriched.csv",
);
const DEFAULT_REVIEW_CSV = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-contact-research-batch-001-review.csv",
);
const DEFAULT_OUTPUT_PATH = path.resolve(
  __dirname,
  "../src/data/vancouverServiceReviewBusinessSeeds.ts",
);
const DEFAULT_SUMMARY_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-review-seed-summary.json",
);
const DEFAULT_SHORTLIST_CSV_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-owner-review-shortlist.csv",
);
const DEFAULT_SHORTLIST_JSON_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-service-owner-review-shortlist.json",
);
const DEFAULT_SHORTLIST_DOC_PATH = path.resolve(
  __dirname,
  "../docs/seo-aeo-geo/VANCOUVER_SERVICE_OWNER_REVIEW_SHORTLIST.md",
);
const DEFAULT_SHORTLIST_LIMIT = 20;
const SERVICE_REVIEW_BATCH_ID = "cityatlas-vancouver-service-owner-review-donor-2026-06-22";
const METRO_AREA_PATTERN =
  /\b(greater vancouver|metro vancouver|lower mainland|fraser valley)\b/i;
const MUNICIPALITY_MATCHERS = [
  { label: "North Vancouver", pattern: /\bnorth vancouver\b/i },
  { label: "West Vancouver", pattern: /\bwest vancouver\b/i },
  { label: "Port Coquitlam", pattern: /\bport coquitlam\b/i },
  { label: "Port Moody", pattern: /\bport moody\b/i },
  { label: "New Westminster", pattern: /\bnew westminster\b/i },
  { label: "Maple Ridge", pattern: /\bmaple ridge\b/i },
  { label: "Pitt Meadows", pattern: /\bpitt meadows\b/i },
  { label: "White Rock", pattern: /\bwhite rock\b/i },
  { label: "Coquitlam", pattern: /\bcoquitlam\b/i },
  { label: "Burnaby", pattern: /\bburnaby\b/i },
  { label: "Richmond", pattern: /\brichmond\b/i },
  { label: "Surrey", pattern: /\bsurrey\b/i },
  { label: "Delta", pattern: /\bdelta\b/i },
  { label: "Langley", pattern: /\blangley\b/i },
  { label: "Vancouver", pattern: /\bvancouver\b/i },
];

function findMunicipalityLabel(text, includeVancouver = true) {
  for (const matcher of MUNICIPALITY_MATCHERS) {
    if (!includeVancouver && matcher.label === "Vancouver") {
      continue;
    }
    if (matcher.pattern.test(text)) {
      return matcher.label;
    }
  }
  return "";
}

function countMentionedMunicipalities(...values) {
  const text = values.filter(Boolean).join(" ");
  return new Set(
    MUNICIPALITY_MATCHERS
      .filter((matcher) => matcher.label !== "Vancouver" && matcher.pattern.test(text))
      .map((matcher) => matcher.label),
  ).size;
}

function parseArgs(argv) {
  const options = {
    sendLedgerPath: DEFAULT_SEND_LEDGER_PATH,
    enrichedCsv: DEFAULT_ENRICHED_CSV,
    reviewCsv: DEFAULT_REVIEW_CSV,
    outputPath: DEFAULT_OUTPUT_PATH,
    summaryPath: DEFAULT_SUMMARY_PATH,
    shortlistCsvPath: DEFAULT_SHORTLIST_CSV_PATH,
    shortlistJsonPath: DEFAULT_SHORTLIST_JSON_PATH,
    shortlistDocPath: DEFAULT_SHORTLIST_DOC_PATH,
    shortlistLimit: DEFAULT_SHORTLIST_LIMIT,
  };

  for (const arg of argv) {
    if (arg.startsWith("--send-ledger-path=")) {
      options.sendLedgerPath = path.resolve(process.cwd(), arg.slice(19));
    } else if (arg.startsWith("--enriched-csv=")) {
      options.enrichedCsv = path.resolve(process.cwd(), arg.slice(15));
    } else if (arg.startsWith("--review-csv=")) {
      options.reviewCsv = path.resolve(process.cwd(), arg.slice(13));
    } else if (arg.startsWith("--output-path=")) {
      options.outputPath = path.resolve(process.cwd(), arg.slice(14));
    } else if (arg.startsWith("--summary-path=")) {
      options.summaryPath = path.resolve(process.cwd(), arg.slice(15));
    } else if (arg.startsWith("--shortlist-csv-path=")) {
      options.shortlistCsvPath = path.resolve(process.cwd(), arg.slice(21));
    } else if (arg.startsWith("--shortlist-json-path=")) {
      options.shortlistJsonPath = path.resolve(process.cwd(), arg.slice(22));
    } else if (arg.startsWith("--shortlist-doc-path=")) {
      options.shortlistDocPath = path.resolve(process.cwd(), arg.slice(21));
    } else if (arg.startsWith("--shortlist-limit=")) {
      const parsed = Number(arg.slice(18));
      if (Number.isFinite(parsed) && parsed > 0) {
        options.shortlistLimit = Math.max(1, Math.round(parsed));
      }
    }
  }

  return options;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
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

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value) {
  return normalizeText(value).toLowerCase();
}

function trimSentenceEnding(value) {
  return normalizeText(value).replace(/[.?!]+$/, "");
}

function escapeString(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r/g, "")
    .replace(/\n/g, "\\n")
    .replace(/'/g, "\\'");
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

function getDomain(value) {
  const normalized = normalizeText(value)
    .replace(/^mailto:/i, "")
    .replace(/^https?:\/\//i, "");
  if (!normalized) return "";

  if (normalized.includes("@") && !normalized.includes("/")) {
    return normalized.split("@").pop()?.toLowerCase() ?? "";
  }

  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return normalized
      .split("/")
      .shift()
      ?.replace(/^www\./, "")
      .toLowerCase() ?? "";
  }
}

function buildSendLedgerKeys(row) {
  const businessName = normalizeKey(row.businessName);
  const neighborhood = normalizeKey(row.neighborhood);
  const email = normalizeKey(
    normalizeText(row.email || row.contactPath).replace(/^mailto:/i, ""),
  );

  const keys = [];
  if (businessName && neighborhood && email) {
    keys.push(`${businessName}::${neighborhood}::${email}`);
  }
  if (businessName && email) {
    keys.push(`${businessName}::${email}`);
  }
  if (email) {
    keys.push(email);
  }

  return keys.filter((value, index, values) => value && values.indexOf(value) === index);
}

function createSendLedgerLookup(entries) {
  const lookup = new Map();
  for (const entry of entries) {
    for (const key of buildSendLedgerKeys(entry)) {
      if (!lookup.has(key)) {
        lookup.set(key, entry);
      }
    }
  }
  return lookup;
}

function findSendLedgerEntry(lookup, row) {
  for (const key of buildSendLedgerKeys(row)) {
    const match = lookup.get(key);
    if (match) {
      return match;
    }
  }
  return null;
}

function inferMunicipalityFromValues(...values) {
  const [explicitMunicipality, cityName, neighborhood, businessName, sourceUrl, website, address] =
    values.map((value) => normalizeText(value));

  const explicitMatch = findMunicipalityLabel(explicitMunicipality);
  if (explicitMatch) {
    return explicitMatch;
  }

  const locationFieldMatch = findMunicipalityLabel(
    [cityName, neighborhood, address].filter(Boolean).join(" "),
    false,
  );
  if (locationFieldMatch) {
    return locationFieldMatch;
  }

  const cityMatch = findMunicipalityLabel(cityName);
  if (cityMatch) {
    return cityMatch;
  }

  const neighborhoodMatch = findMunicipalityLabel(neighborhood);
  if (neighborhoodMatch) {
    return neighborhoodMatch;
  }

  const primaryMatch = findMunicipalityLabel(
    [businessName, sourceUrl, website].filter(Boolean).join(" "),
    false,
  );
  if (primaryMatch) {
    return primaryMatch;
  }

  return "Vancouver";
}

function inferMarketScope(row) {
  const text = [
    row.municipality,
    row.businessName,
    row.neighborhood,
    row.sourceUrl,
    row.website,
    row.email,
    row.contactPath,
    row.sourceProof,
    row.notes,
  ]
    .filter(Boolean)
    .join(" ");
  return row.municipality && row.municipality !== "Vancouver"
    ? "metro_area"
    : METRO_AREA_PATTERN.test(text) || countMentionedMunicipalities(text) > 0
      ? "metro_area"
      : "city_only";
}

function isServiceReviewGeneratedProspect(prospect) {
  return /service-owner-review-donor/i.test(normalizeText(prospect.importBatchId));
}

function isExternallyHandledServiceProspect(prospect) {
  return (
    !isServiceReviewGeneratedProspect(prospect)
    && (
      prospect.approvalStatus !== "review_only"
      || ["sent_manual", "replied", "do_not_contact"].includes(prospect.outreachStatus)
    )
  );
}

function buildWhyNowFromCategoryText(text, fallback = "") {
  if (/repair|cleaning|detail|mobile service|home service|clinic/.test(text)) {
    return "Rare direct-email local service row that could support a trust-first convenience or service-feature angle.";
  }
  if (/hotel|guest|concierge/.test(text)) {
    return "Strong guest-service and out-of-town visitor fit with a public contact route already visible.";
  }
  if (/wellness|spa|massage|fitness|recovery/.test(text)) {
    return "Clear wellness-route fit with a service category CityAtlas can feature without pretending to be a flat directory.";
  }
  if (/event|venue|planner|production|gallery|museum|cultural|entertainment/.test(text)) {
    return "Strong hosted-visit, venue, or culture angle with a public route for a founder preview.";
  }
  if (/coworking|studio|creator/.test(text)) {
    return "Useful local-service or workday-base angle with a public contact path already in the queue.";
  }
  if (/caterer/.test(text)) {
    return "Hosted-gathering and office-event fit with an email-ready public route.";
  }
  return fallback || "Useful service-business visibility fit for a CityAtlas founder preview.";
}

function buildWhyNowText(prospect, candidate) {
  const text = normalizeKey(`${prospect.category} ${prospect.segment}`);
  return buildWhyNowFromCategoryText(text, candidate.draft.angle);
}

function buildCategoryPriorityBonus(text) {
  return /repair|cleaning|detail|mobile service|home service|clinic/.test(text)
    ? 30
    : /hotel|guest|concierge/.test(text)
      ? 26
      : /wellness|spa|massage|fitness|recovery/.test(text)
        ? 24
        : /event|venue|planner|production|gallery|museum|cultural|entertainment/.test(text)
          ? 20
          : /coworking|studio|creator/.test(text)
            ? 16
            : /caterer/.test(text)
              ? 14
              : 10;
}

function buildOwnerReviewPriorityFromParts({
  category,
  segment,
  contactConfidence,
  relationshipWarmth,
  sourceLabel,
  baseScore = 0,
}) {
  const text = normalizeKey(`${category} ${segment}`);
  const categoryBonus = buildCategoryPriorityBonus(text);
  const confidenceBonus =
    contactConfidence === "high"
      ? 10
      : contactConfidence === "medium"
        ? 6
        : 2;
  const warmthBonus =
    relationshipWarmth === "high"
      ? 8
      : relationshipWarmth === "medium"
        ? 4
        : relationshipWarmth === "low"
          ? 1
          : 0;
  const sourceBonus =
    /roam partner research donor|roam public business wave donor/i.test(sourceLabel)
      ? 8
      : /rooms host-space donor|rooms host-space review donor/i.test(sourceLabel)
        ? 5
        : /restaurant review donor|service review donor|outscraper service/i.test(sourceLabel)
          ? 3
          : 0;

  return baseScore + categoryBonus + confidenceBonus + warmthBonus + sourceBonus;
}

function buildOwnerReviewPriority(prospect, candidate) {
  return buildOwnerReviewPriorityFromParts({
    category: prospect.category,
    segment: prospect.segment,
    contactConfidence: prospect.contactConfidence,
    relationshipWarmth: prospect.relationshipWarmth,
    sourceLabel: prospect.sourceLabel,
    baseScore: candidate.score,
  });
}

function shouldPromoteToOwnerReview(prospect) {
  return (
    Boolean(normalizeText(prospect.email))
    && prospect.contactReadiness === "email_ready"
    && !["sent_manual", "replied", "do_not_contact"].includes(prospect.outreachStatus)
  );
}

function buildSeedProof(prospect, candidate) {
  const proofBits = [
    "CityAtlas staged this Vancouver service-business row in the reviewed founder outreach lane for local owner review only.",
    normalizeText(prospect.sourceLabel)
      ? `Original source lane: ${trimSentenceEnding(prospect.sourceLabel)}.`
      : "",
    candidate.draft.angle
      ? `Suggested CityAtlas angle: ${trimSentenceEnding(candidate.draft.angle)}.`
      : "",
  ];

  return proofBits.filter(Boolean).join(" ");
}

function buildSeedNotes(prospect, candidate, promotedToOwnerReview) {
  const noteBits = [
    "Imported from the current Vancouver service-business partner queue for local CityAtlas review only.",
    normalizeText(prospect.sourceType)
      ? `Source type: ${normalizeText(prospect.sourceType).replaceAll("_", " ")}.`
      : "",
    normalizeText(prospect.sourceLabel)
      ? `Original source lane: ${normalizeText(prospect.sourceLabel)}.`
      : "",
    candidate.batchLane ? `Batch lane: ${candidate.batchLane}.` : "",
    candidate.stage ? `Stage: ${candidate.stage}.` : "",
    candidate.missing.length > 0 ? `Missing: ${candidate.missing.join(" ")}` : "",
    promotedToOwnerReview
      ? "This row is staged as owner-review-ready inside the no-send service email lane."
      : prospect.email
        ? "Keep this row review-first until the exact public email and category fit are rechecked."
        : "Keep this row in contact-path review until a direct email or cleaner official route is confirmed.",
    "No outreach, public publishing, or route assignment happened automatically.",
  ];

  return noteBits.filter(Boolean).join(" ");
}

function looksLikeServiceReviewCategory(value) {
  return /(beauty|salon|nail|wellness|spa|massage|fitness|sport|recovery|hotel|hospitality|concierge|guest|event|venue|cultural|museum|gallery|entertainment|cater|repair|maintenance|cleaning|detail|detailing|vehicle|automotive|mechanic|home service|mobile service|clinic|therapy|studio|coworking|community)/i.test(
    normalizeText(value),
  );
}

function buildReviewKey(row) {
  return `${normalizeText(row.researchBatchId)}::${normalizeText(row.sequence)}`;
}

function inferContactPathType(contactPath) {
  const normalized = normalizeKey(contactPath);
  if (!normalized) return "needs_manual_lookup";
  if (normalized.startsWith("mailto:")) return "direct_email";
  if (/instagram/.test(normalized)) return "instagram_dm";
  if (/book|booking|reserve|events?|private|group|banquet|meeting|rental|inquiry|contact/.test(normalized)) {
    return "private_events_form";
  }
  return "contact_page";
}

function buildServiceReviewImportCategory(enrichedRow, reviewRow) {
  return normalizeText(
    enrichedRow.categoryFromSite
    || reviewRow.categoryFromSite
    || enrichedRow.outscraperPlaceType
    || enrichedRow.businessSubtype
    || enrichedRow.businessType
    || "Service business",
  );
}

function buildServiceReviewImportSegment(enrichedRow) {
  return normalizeText(
    enrichedRow.businessSubtype
    || enrichedRow.outscraperPlaceType
    || enrichedRow.businessType
    || "Service business",
  );
}

function buildServiceReviewSeedProof(enrichedRow, reviewRow) {
  const proofBits = [
    reviewRow.reviewDecision === "email_candidate_review"
      ? "CityAtlas matched a public business email during the Vancouver service review batch."
      : "CityAtlas matched a public official contact path during the Vancouver service review batch.",
    trimSentenceEnding(reviewRow.reviewReason)
      ? `Review reason: ${trimSentenceEnding(reviewRow.reviewReason)}.`
      : "",
  ];

  return proofBits.filter(Boolean).join(" ");
}

function buildServiceReviewSeedNotes(enrichedRow, reviewRow, promotedToOwnerReview) {
  const noteBits = [
    `Imported from Vancouver service Outscraper review batch ${normalizeText(reviewRow.researchBatchId) || "001"} for local CityAtlas review only.`,
    `Review decision: ${normalizeText(reviewRow.reviewDecision).replaceAll("_", " ")}.`,
    trimSentenceEnding(reviewRow.reviewReason)
      ? `Review reason: ${trimSentenceEnding(reviewRow.reviewReason)}.`
      : "",
    normalizeText(reviewRow.outscraperPlaceName)
      ? `Matched place: ${normalizeText(reviewRow.outscraperPlaceName)}.`
      : "",
    promotedToOwnerReview
      ? "This row is staged as owner-review-ready inside the no-send service email lane."
      : normalizeText(enrichedRow.publicEmail)
        ? "Keep this row review-first until the exact public email and service fit are rechecked."
        : "Keep this row in contact-path review until a direct email or cleaner official route is confirmed.",
    "No outreach, public publishing, or route assignment happened automatically.",
  ];

  return noteBits.filter(Boolean).join(" ");
}

function buildServiceReviewSeedRows(enrichedRows, reviewRows, sendLedgerLookup, generatedAt) {
  const enrichedByKey = new Map(enrichedRows.map((row) => [buildReviewKey(row), row]));
  const seedRows = [];

  for (const reviewRow of reviewRows) {
    if (!["email_candidate_review", "contact_path_review"].includes(normalizeText(reviewRow.reviewDecision))) {
      continue;
    }

    const enrichedRow = enrichedByKey.get(buildReviewKey(reviewRow));
    if (!enrichedRow) {
      continue;
    }

    const email = normalizeText(
      reviewRow.reviewDecision === "email_candidate_review" ? enrichedRow.publicEmail : "",
    ).toLowerCase();
    const category = buildServiceReviewImportCategory(enrichedRow, reviewRow);
    const segment = buildServiceReviewImportSegment(enrichedRow);
    const contactPath = email
      ? `mailto:${email}`
      : normalizeText(
          enrichedRow.contactPage
          || enrichedRow.privateDiningPage
          || enrichedRow.officialWebsite
          || enrichedRow.officialSourceUrl,
        );
    const contactPathType = email ? "direct_email" : inferContactPathType(contactPath);
    const contactReadiness = email
      ? "email_ready"
      : contactPath
        ? "contact_path_ready"
        : "needs_research";
    const promotedToOwnerReview =
      Boolean(email) && looksLikeServiceReviewCategory(`${category} ${segment}`);
    const municipality = inferMunicipalityFromValues(
      enrichedRow.cityName,
      enrichedRow.localArea,
      enrichedRow.businessName,
      enrichedRow.officialWebsite,
      enrichedRow.contactPage,
      enrichedRow.outscraperPlaceName,
      enrichedRow.outscraperFullAddress,
      reviewRow.outscraperPlaceName,
      reviewRow.reviewReason,
    );
    const baseRow = {
      businessName: normalizeText(enrichedRow.businessName),
      neighborhood: normalizeText(enrichedRow.localArea),
      municipality,
      category,
      segment,
      sourceUrl: normalizeText(
        enrichedRow.officialWebsite
        || enrichedRow.contactPage
        || enrichedRow.officialSourceUrl,
      ),
      website: normalizeText(enrichedRow.officialWebsite),
      email,
      contactPath,
      contactPathType,
      contactReadiness,
      sourceProof: buildServiceReviewSeedProof(enrichedRow, reviewRow),
      notes: buildServiceReviewSeedNotes(enrichedRow, reviewRow, promotedToOwnerReview),
      contactConfidence: email ? "high" : contactPath ? "medium" : "low",
      donorSourceLabel:
        reviewRow.reviewDecision === "email_candidate_review"
          ? "Official service review email"
          : "Official service review path",
      approvalStatus: promotedToOwnerReview ? "ready_for_owner_review" : "review_only",
      outreachStatus: "not_started",
      relationshipWarmth: "unknown",
      lastUpdatedAt: generatedAt,
      ownerReviewPriority: buildOwnerReviewPriorityFromParts({
        category,
        segment,
        contactConfidence: email ? "high" : contactPath ? "medium" : "low",
        relationshipWarmth: "unknown",
        sourceLabel:
          reviewRow.reviewDecision === "email_candidate_review"
            ? "Official service review email"
            : "Official service review path",
        baseScore: reviewRow.reviewDecision === "email_candidate_review" ? 36 : 20,
      }),
      whyNow: buildWhyNowFromCategoryText(
        normalizeKey(`${category} ${segment}`),
        "Useful official-inventory service row for a CityAtlas founder preview.",
      ),
      originalSourceLabel:
        reviewRow.reviewDecision === "email_candidate_review"
          ? "Official service review email"
          : "Official service review path",
      batchLane:
        reviewRow.reviewDecision === "email_candidate_review"
          ? "service_email_review"
          : "service_contact_review",
      stage:
        reviewRow.reviewDecision === "email_candidate_review"
          ? "Rehearsal ready"
          : "Review first",
    };

    baseRow.marketScope = inferMarketScope(baseRow);

    seedRows.push(applySendLedgerOverride(baseRow, findSendLedgerEntry(sendLedgerLookup, baseRow)));
  }

  return seedRows;
}

function buildSeedRowMergeKey(row) {
  const businessName = normalizeKey(row.businessName);
  const neighborhood = normalizeKey(row.neighborhood);
  const email = normalizeKey(normalizeText(row.email).replace(/^mailto:/i, ""));
  const url = normalizeKey(row.sourceUrl || row.website || row.contactPath);
  return email
    ? `${businessName}::${neighborhood}::${email}`
    : `${businessName}::${neighborhood}::${url}`;
}

function choosePreferredSeedRow(existing, incoming) {
  if (!existing) return incoming;
  const existingApproval = existing.approvalStatus === "ready_for_owner_review" ? 1 : 0;
  const incomingApproval = incoming.approvalStatus === "ready_for_owner_review" ? 1 : 0;
  if (incomingApproval !== existingApproval) {
    return incomingApproval > existingApproval ? incoming : existing;
  }
  if (incoming.contactReadiness !== existing.contactReadiness) {
    return incoming.contactReadiness === "email_ready" ? incoming : existing;
  }
  if ((incoming.ownerReviewPriority || 0) !== (existing.ownerReviewPriority || 0)) {
    return (incoming.ownerReviewPriority || 0) > (existing.ownerReviewPriority || 0)
      ? incoming
      : existing;
  }
  return existing;
}

function applySendLedgerOverride(row, entry) {
  if (!entry) {
    return row;
  }

  const noteBits = [row.notes];
  const note = normalizeText(entry.note);
  if (note) {
    noteBits.push(note);
  } else {
    const sentAt = normalizeText(entry.sentAt);
    const messageId = normalizeText(entry.messageId);
    const messageBits = ["Owner-approved live Gmail send recorded"];
    if (sentAt) {
      messageBits.push(`on ${sentAt}`);
    }
    if (messageId) {
      messageBits.push(`with Gmail message id ${messageId}`);
    }
    noteBits.push(`${messageBits.join(" ")}.`);
  }

  return {
    ...row,
    approvalStatus: normalizeText(entry.approvalStatus) || row.approvalStatus,
    outreachStatus: normalizeText(entry.outreachStatus) || row.outreachStatus,
    relationshipWarmth: normalizeText(entry.relationshipWarmth) || row.relationshipWarmth,
    lastUpdatedAt: normalizeText(entry.lastUpdatedAt || entry.sentAt) || row.lastUpdatedAt,
    notes: noteBits.filter(Boolean).join(" | "),
  };
}

function renderSeedRow(row) {
  const fields = [
    `businessName: '${escapeString(row.businessName)}'`,
    `neighborhood: '${escapeString(row.neighborhood)}'`,
    `municipality: '${escapeString(row.municipality || "Vancouver")}'`,
    `marketScope: '${escapeString(row.marketScope || inferMarketScope(row))}'`,
    `category: '${escapeString(row.category)}'`,
    `segment: '${escapeString(row.segment)}'`,
    `sourceUrl: '${escapeString(row.sourceUrl)}'`,
    `website: '${escapeString(row.website)}'`,
    `email: '${escapeString(row.email)}'`,
    `contactPath: '${escapeString(row.contactPath)}'`,
    `contactPathType: '${escapeString(row.contactPathType)}'`,
    `contactReadiness: '${escapeString(row.contactReadiness)}'`,
    `sourceProof: '${escapeString(row.sourceProof)}'`,
    `notes: '${escapeString(row.notes)}'`,
    `contactConfidence: '${escapeString(row.contactConfidence)}'`,
    `donorSourceLabel: '${escapeString(row.donorSourceLabel)}'`,
    `approvalStatus: '${escapeString(row.approvalStatus)}'`,
    `outreachStatus: '${escapeString(row.outreachStatus)}'`,
    `relationshipWarmth: '${escapeString(row.relationshipWarmth)}'`,
    `lastUpdatedAt: '${escapeString(row.lastUpdatedAt)}'`,
  ];

  return `  {\n    ${fields.join(",\n    ")},\n  },`;
}

function buildSeedFile(seedRows, sourcePaths) {
  const lines = [
    "// Generated by scripts/sync-vancouver-service-review-business-seeds.mjs",
    "// @ts-nocheck",
    "// Sources:",
    ...sourcePaths.map((sourcePath) => `// - ${path.relative(path.dirname(DEFAULT_OUTPUT_PATH), sourcePath)}`),
    "",
    "export const vancouverServiceReviewBusinessSeeds = [",
    ...seedRows.map(renderSeedRow),
    "];",
    "",
  ];

  return lines.join("\n");
}

function buildShortlistDomainKey(candidate) {
  return (
    getDomain(candidate.seed.website)
    || getDomain(candidate.seed.email)
    || `${normalizeKey(candidate.seed.businessName)}::${normalizeKey(candidate.seed.neighborhood)}`
  );
}

function buildShortlistRows(shortlist) {
  return shortlist.map((candidate, index) => ({
    rank: String(index + 1),
    businessName: candidate.seed.businessName,
    neighborhood: candidate.seed.neighborhood,
    municipality: candidate.seed.municipality || "Vancouver",
    category: candidate.seed.category,
    segment: candidate.seed.segment,
    email: candidate.seed.email,
    website: candidate.seed.website,
    shortlistScore: String(candidate.shortlistScore),
    whyNow: candidate.whyNow,
  }));
}

function buildShortlistMarkdown(shortlist, summary) {
  const lines = [
    "# Vancouver Service Owner Review Shortlist",
    "",
    `Updated: ${summary.generatedAt.slice(0, 10)}`,
    "",
    "This is the current no-send owner-review shortlist generated from the reviewed Vancouver service-business queue already staged inside CityAtlas.",
    "",
    "## Honest status",
    "",
    `- Total Vancouver service prospects considered in this run: ${summary.totalServiceProspects}`,
    `- Imported official service review rows folded in from Outscraper: ${summary.importedOfficialSeedRows}`,
    `- Service seed rows regenerated: ${summary.totalSeedRows}`,
    `- Email-ready service rows promoted into owner-review-ready: ${summary.ownerReviewReadyCount}`,
    `- Rows currently tagged as Greater Vancouver rather than Vancouver-only: ${summary.metroAreaRowCount}`,
    `- Contact-path or hold rows kept review-only: ${summary.reviewOnlyCount}`,
    `- Already-sent service rows preserved from the live ledger: ${summary.sentManualCount}`,
    `- Current shortlist size: ${summary.shortlistCount}`,
    "- No outreach, public publishing, or route assignment happened automatically.",
    "",
    "## Best first owner review list",
    "",
    "| Rank | Business | Municipality | Neighborhood | Category | Email | Why now |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...shortlist.map((candidate, index) => {
      const neighborhood = candidate.seed.neighborhood || "Unknown";
      return `| ${index + 1} | ${candidate.seed.businessName} | ${candidate.seed.municipality || "Vancouver"} | ${neighborhood} | ${candidate.seed.category} | ${candidate.seed.email || "-"} | ${candidate.whyNow} |`;
    }),
    "",
    "## Next move",
    "",
    "1. Let the service send packet pull from this owner-review-ready email lane.",
    "2. Keep contact-path-only service rows blocked from live sending until a cleaner route is found.",
    "3. Expand into more auto, repair, cleaning, and home-service rows only if we add a fresh donor source beyond the current queue.",
    "",
  ];

  return lines.join("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sendLedgerInput = await readJsonOrNull(options.sendLedgerPath);
  const sendLedgerEntries = Array.isArray(sendLedgerInput)
    ? sendLedgerInput
    : Array.isArray(sendLedgerInput?.rows)
      ? sendLedgerInput.rows
      : [];
  const sendLedgerLookup = createSendLedgerLookup(sendLedgerEntries);
  const generatedAt = new Date().toISOString();
  const [hasEnrichedCsv, hasReviewCsv] = await Promise.all([
    fileExists(options.enrichedCsv),
    fileExists(options.reviewCsv),
  ]);

  const prospects = buildDefaultBusinessProspects(seedData);
  const serviceProspects = prospects
    .filter((prospect) => prospect.cityKey === "vancouver")
    .filter(isServiceBusinessProspect)
    .filter(
      (prospect) =>
        isServiceReviewGeneratedProspect(prospect) || !isExternallyHandledServiceProspect(prospect),
    );

  const stagedRows = serviceProspects.map((prospect) => {
    const candidate = buildBusinessProofCandidate(prospect);
    const promotedToOwnerReview = shouldPromoteToOwnerReview(prospect);
    const municipality = inferMunicipalityFromValues(
      prospect.municipality,
      prospect.cityName,
      prospect.neighborhood,
      prospect.businessName,
      prospect.sourceUrl,
      prospect.website,
      prospect.sourceProof,
      prospect.notes,
    );
    const baseRow = {
      businessName: normalizeText(prospect.businessName),
      neighborhood: normalizeText(prospect.neighborhood),
      municipality,
      category: normalizeText(prospect.category),
      segment: normalizeText(prospect.segment),
      sourceUrl: normalizeText(prospect.sourceUrl),
      website: normalizeText(prospect.website),
      email: normalizeText(prospect.email).toLowerCase(),
      contactPath: normalizeText(prospect.contactPath),
      contactPathType: normalizeText(prospect.contactPathType),
      contactReadiness: normalizeText(prospect.contactReadiness),
      sourceProof: buildSeedProof(prospect, candidate),
      notes: buildSeedNotes(prospect, candidate, promotedToOwnerReview),
      contactConfidence: normalizeText(prospect.contactConfidence),
      donorSourceLabel: promotedToOwnerReview ? "Service review email" : "Service review path",
      approvalStatus: promotedToOwnerReview ? "ready_for_owner_review" : "review_only",
      outreachStatus: normalizeText(prospect.outreachStatus) || "not_started",
      relationshipWarmth: normalizeText(prospect.relationshipWarmth) || "unknown",
      lastUpdatedAt: generatedAt,
      ownerReviewPriority: buildOwnerReviewPriority(prospect, candidate),
      whyNow: buildWhyNowText(prospect, candidate),
      originalSourceLabel: normalizeText(prospect.sourceLabel),
      batchLane: candidate.batchLane,
      stage: candidate.stage,
    };

    baseRow.marketScope =
      prospect.marketScope === "metro_area" || inferMarketScope(baseRow) === "metro_area"
        ? "metro_area"
        : "city_only";

    return applySendLedgerOverride(baseRow, findSendLedgerEntry(sendLedgerLookup, baseRow));
  });

  let importedReviewRows = [];
  let importedSeedRows = [];
  if (hasEnrichedCsv && hasReviewCsv) {
    const [enrichedText, reviewText] = await Promise.all([
      fs.readFile(options.enrichedCsv, "utf8"),
      fs.readFile(options.reviewCsv, "utf8"),
    ]);
    const enrichedRows = parseCsv(enrichedText);
    importedReviewRows = parseCsv(reviewText);
    importedSeedRows = buildServiceReviewSeedRows(
      enrichedRows,
      importedReviewRows,
      sendLedgerLookup,
      generatedAt,
    );
  }

  const mergedSeedMap = [...stagedRows, ...importedSeedRows].reduce((map, row) => {
      const key = buildSeedRowMergeKey(row);
      map.set(key, choosePreferredSeedRow(map.get(key), row));
      return map;
    }, new Map());
  const seedRows = Array.from(mergedSeedMap.values());

  const sortedSeedRows = seedRows
    .sort((left, right) => {
      const approvalCompare =
        (left.approvalStatus === "ready_for_owner_review" ? 1 : 0)
        - (right.approvalStatus === "ready_for_owner_review" ? 1 : 0);
      if (approvalCompare !== 0) return -approvalCompare;
      const readinessCompare =
        (left.contactReadiness === "email_ready" ? 1 : 0)
        - (right.contactReadiness === "email_ready" ? 1 : 0);
      if (readinessCompare !== 0) return -readinessCompare;
      if (right.ownerReviewPriority !== left.ownerReviewPriority) {
        return right.ownerReviewPriority - left.ownerReviewPriority;
      }
      return left.businessName.localeCompare(right.businessName);
    });

  const shortlistCandidates = sortedSeedRows
    .filter((row) => row.approvalStatus === "ready_for_owner_review")
    .filter((row) => row.outreachStatus !== "sent_manual")
    .map((row) => ({
      seed: {
        businessName: row.businessName,
        neighborhood: row.neighborhood,
        municipality: row.municipality,
        category: row.category,
        segment: row.segment,
        website: row.website,
        email: row.email,
      },
      shortlistScore: row.ownerReviewPriority,
      whyNow: row.whyNow,
    }));

  const shortlist = [];
  const seenShortlistKeys = new Set();
  for (const candidate of shortlistCandidates) {
    const shortlistKey = buildShortlistDomainKey(candidate);
    if (seenShortlistKeys.has(shortlistKey)) {
      continue;
    }
    seenShortlistKeys.add(shortlistKey);
    shortlist.push(candidate);
    if (shortlist.length >= options.shortlistLimit) {
      break;
    }
  }

  const renderableSeedRows = sortedSeedRows.map(
    ({ ownerReviewPriority, whyNow, originalSourceLabel, batchLane, stage, ...row }) => row,
  );
  const shortlistRows = buildShortlistRows(shortlist);
  const importedEmailCandidateCount = importedReviewRows.filter(
    (row) => normalizeText(row.reviewDecision) === "email_candidate_review",
  ).length;
  const importedContactPathCount = importedReviewRows.filter(
    (row) => normalizeText(row.reviewDecision) === "contact_path_review",
  ).length;

  const summary = {
    ok: true,
    skipped: false,
    generatedAt,
    inputFiles: {
      sendLedgerPath: options.sendLedgerPath,
      enrichedCsv: hasEnrichedCsv ? options.enrichedCsv : "",
      reviewCsv: hasReviewCsv ? options.reviewCsv : "",
    },
    outputFiles: {
      seedData: options.outputPath,
      shortlistCsv: options.shortlistCsvPath,
      shortlistJson: options.shortlistJsonPath,
      shortlistDoc: options.shortlistDocPath,
      summary: options.summaryPath,
    },
    totalServiceProspects: serviceProspects.length,
    importedOfficialReviewRows: importedReviewRows.length,
    importedOfficialEmailCandidateRows: importedEmailCandidateCount,
    importedOfficialContactPathRows: importedContactPathCount,
    importedOfficialSeedRows: importedSeedRows.length,
    totalSeedRows: renderableSeedRows.length,
    emailReadyRows: renderableSeedRows.filter((row) => row.contactReadiness === "email_ready").length,
    ownerReviewReadyCount: renderableSeedRows.filter(
      (row) => row.approvalStatus === "ready_for_owner_review",
    ).length,
    metroAreaRowCount: renderableSeedRows.filter((row) => row.marketScope === "metro_area").length,
    municipalities: [...new Set(renderableSeedRows.map((row) => row.municipality || "Vancouver"))].sort(),
    reviewOnlyCount: renderableSeedRows.filter((row) => row.approvalStatus === "review_only").length,
    sentManualCount: renderableSeedRows.filter((row) => row.outreachStatus === "sent_manual").length,
    shortlistCount: shortlist.length,
    categories: [...new Set(renderableSeedRows.map((row) => row.category))].sort(),
  };

  await Promise.all([
    fs.mkdir(path.dirname(options.outputPath), { recursive: true }),
    fs.mkdir(path.dirname(options.summaryPath), { recursive: true }),
    fs.mkdir(path.dirname(options.shortlistCsvPath), { recursive: true }),
    fs.mkdir(path.dirname(options.shortlistJsonPath), { recursive: true }),
    fs.mkdir(path.dirname(options.shortlistDocPath), { recursive: true }),
  ]);

  await Promise.all([
    fs.writeFile(
      options.outputPath,
      buildSeedFile(
        renderableSeedRows,
        [
          ...(sendLedgerEntries.length > 0 ? [options.sendLedgerPath] : []),
          path.resolve(__dirname, "../src/data/seed.ts"),
          ...(hasEnrichedCsv ? [options.enrichedCsv] : []),
          ...(hasReviewCsv ? [options.reviewCsv] : []),
        ],
      ),
      "utf8",
    ),
    fs.writeFile(
      options.shortlistCsvPath,
      buildCsv(
        ["rank", "businessName", "neighborhood", "municipality", "category", "segment", "email", "website", "shortlistScore", "whyNow"],
        shortlistRows,
      ),
      "utf8",
    ),
    fs.writeFile(options.shortlistJsonPath, `${JSON.stringify(shortlistRows, null, 2)}\n`, "utf8"),
    fs.writeFile(options.shortlistDocPath, `${buildShortlistMarkdown(shortlist, summary)}\n`, "utf8"),
    fs.writeFile(options.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
