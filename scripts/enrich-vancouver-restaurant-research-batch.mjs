import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Outscraper from "outscraper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_LIMIT = 100;
const DEFAULT_PLACES_BATCH_SIZE = 50;
const DEFAULT_CONTACTS_BATCH_SIZE = 50;
const DEFAULT_ASYNC_POLL_MS = 3000;
const DEFAULT_ASYNC_MAX_POLLS = 240;
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
    label: "restaurant",
    input: path.resolve(__dirname, "../output/growth/vancouver-restaurant-contact-research-batch-001.csv"),
    outputCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-enriched.csv",
    ),
    outputJson: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-enriched.json",
    ),
    outputSummary: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-enriched-summary.json",
    ),
    reviewCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-review.csv",
    ),
    reviewSummary: path.resolve(
      __dirname,
      "../output/growth/vancouver-restaurant-contact-research-batch-001-review-summary.json",
    ),
    isCategoryFit(value) {
      return /(restaurant|cafe|coffee|bakery|bar|bistro|doughnut|dessert|burger|hamburger|pub|sushi|pizza|grill|eatery|food|hookah|tea)/i.test(
        normalizeText(value),
      );
    },
    buildImportSourceLabel(reviewDecision) {
      if (reviewDecision === "email_candidate_review") {
        return "Outscraper restaurant email candidate review";
      }
      if (reviewDecision === "contact_path_review") {
        return "Outscraper restaurant contact-path review";
      }
      return "Outscraper restaurant research review";
    },
    buildImportSegment(row) {
      const subtype = normalizeText(row.businessSubtype);
      if (subtype) return subtype;
      if (normalizeText(row.businessType) === "Limited Service Food Establishment") {
        return "Cafe and quick-service food";
      }
      return "Restaurant";
    },
    buildImportCategory(row) {
      return pickFirst(row.categoryFromSite, row.outscraperPlaceType, row.businessType, "Restaurant");
    },
    buildImportNotes(row, reviewDecision, reviewReason) {
      return [
        `Imported from Vancouver restaurant Outscraper review batch ${normalizeText(row.researchBatchId) || "001"}.`,
        `Review decision: ${reviewDecision.replaceAll("_", " ")}.`,
        `Review reason: ${trimSentenceEnding(reviewReason)}.`,
        normalizeText(row.nextStep),
      ]
        .filter(Boolean)
        .join(" ");
    },
  },
  service: {
    label: "service",
    input: path.resolve(__dirname, "../output/growth/vancouver-service-contact-research-batch-001.csv"),
    outputCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-enriched.csv",
    ),
    outputJson: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-enriched.json",
    ),
    outputSummary: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-enriched-summary.json",
    ),
    reviewCsv: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-review.csv",
    ),
    reviewSummary: path.resolve(
      __dirname,
      "../output/growth/vancouver-service-contact-research-batch-001-review-summary.json",
    ),
    isCategoryFit(value) {
      return /(beauty|salon|nail|wellness|spa|massage|fitness|sport|recovery|hotel|hospitality|concierge|guest|event|venue|cultural|museum|gallery|entertainment|cater|repair|maintenance|cleaning|detail|detailing|vehicle|automotive|mechanic|home service|mobile service|clinic|therapy|studio|coworking|community)/i.test(
        normalizeText(value),
      );
    },
    buildImportSourceLabel(reviewDecision) {
      if (reviewDecision === "email_candidate_review") {
        return "Outscraper service email candidate review";
      }
      if (reviewDecision === "contact_path_review") {
        return "Outscraper service contact-path review";
      }
      return "Outscraper service research review";
    },
    buildImportSegment(row) {
      return pickFirst(row.businessSubtype, row.outscraperPlaceType, row.businessType, "Service business");
    },
    buildImportCategory(row) {
      return pickFirst(
        row.categoryFromSite,
        row.outscraperPlaceType,
        row.businessSubtype,
        row.businessType,
        "Service business",
      );
    },
    buildImportNotes(row, reviewDecision, reviewReason) {
      return [
        `Imported from Vancouver service Outscraper review batch ${normalizeText(row.researchBatchId) || "001"}.`,
        `Review decision: ${reviewDecision.replaceAll("_", " ")}.`,
        `Review reason: ${trimSentenceEnding(reviewReason)}.`,
        normalizeText(row.nextStep),
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
    input: defaults.input,
    outputCsv: defaults.outputCsv,
    outputJson: defaults.outputJson,
    outputSummary: defaults.outputSummary,
    reviewCsv: defaults.reviewCsv,
    reviewSummary: defaults.reviewSummary,
    limit: DEFAULT_LIMIT,
    offset: 0,
    placesBatchSize: DEFAULT_PLACES_BATCH_SIZE,
    contactsBatchSize: DEFAULT_CONTACTS_BATCH_SIZE,
    asyncPollMs: DEFAULT_ASYNC_POLL_MS,
    asyncMaxPolls: DEFAULT_ASYNC_MAX_POLLS,
    placeCheckpoint: "",
    contactCheckpoint: "",
    reusePlaceCheckpoint: false,
    reuseContactCheckpoint: false,
  };

  for (const arg of argv) {
    if (arg.startsWith("--profile=")) continue;
    if (arg.startsWith("--input=")) options.input = path.resolve(process.cwd(), arg.slice(8));
    if (arg.startsWith("--output-csv=")) options.outputCsv = path.resolve(process.cwd(), arg.slice(13));
    if (arg.startsWith("--output-json=")) options.outputJson = path.resolve(process.cwd(), arg.slice(14));
    if (arg.startsWith("--output-summary=")) {
      options.outputSummary = path.resolve(process.cwd(), arg.slice(17));
    }
    if (arg.startsWith("--review-csv=")) {
      options.reviewCsv = path.resolve(process.cwd(), arg.slice(13));
    }
    if (arg.startsWith("--review-summary=")) {
      options.reviewSummary = path.resolve(process.cwd(), arg.slice(17));
    }
    if (arg.startsWith("--limit=")) {
      const parsed = Number(arg.slice(8));
      if (Number.isFinite(parsed) && parsed > 0) options.limit = Math.floor(parsed);
    }
    if (arg.startsWith("--offset=")) {
      const parsed = Number(arg.slice(9));
      if (Number.isFinite(parsed) && parsed >= 0) options.offset = Math.floor(parsed);
    }
    if (arg.startsWith("--places-batch-size=")) {
      const parsed = Number(arg.slice(20));
      if (Number.isFinite(parsed) && parsed > 0) options.placesBatchSize = Math.floor(parsed);
    }
    if (arg.startsWith("--contacts-batch-size=")) {
      const parsed = Number(arg.slice(22));
      if (Number.isFinite(parsed) && parsed > 0) options.contactsBatchSize = Math.floor(parsed);
    }
    if (arg.startsWith("--async-poll-ms=")) {
      const parsed = Number(arg.slice(16));
      if (Number.isFinite(parsed) && parsed > 0) options.asyncPollMs = Math.floor(parsed);
    }
    if (arg.startsWith("--async-max-polls=")) {
      const parsed = Number(arg.slice(18));
      if (Number.isFinite(parsed) && parsed > 0) options.asyncMaxPolls = Math.floor(parsed);
    }
    if (arg.startsWith("--place-checkpoint=")) {
      options.placeCheckpoint = path.resolve(process.cwd(), arg.slice(19));
    }
    if (arg.startsWith("--contact-checkpoint=")) {
      options.contactCheckpoint = path.resolve(process.cwd(), arg.slice(21));
    }
    if (arg === "--reuse-place-checkpoint=1" || arg === "--reuse-place-checkpoint") {
      options.reusePlaceCheckpoint = true;
    }
    if (arg === "--reuse-contact-checkpoint=1" || arg === "--reuse-contact-checkpoint") {
      options.reuseContactCheckpoint = true;
    }
  }

  if (!options.placeCheckpoint) {
    options.placeCheckpoint = deriveCheckpointPath(options.outputCsv, "places-checkpoint");
  }
  if (!options.contactCheckpoint) {
    options.contactCheckpoint = deriveCheckpointPath(options.outputCsv, "contacts-checkpoint");
  }

  return options;
}

function chunkArray(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function parseEnvFile(text) {
  const entries = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    entries[key] = value;
  }
  return entries;
}

async function loadLocalEnv() {
  for (const relativePath of [".env.local", ".env"]) {
    const absolute = path.resolve(process.cwd(), relativePath);
    try {
      const file = await fs.readFile(absolute, "utf8");
      const entries = parseEnvFile(file);
      for (const [key, value] of Object.entries(entries)) {
        if (!(key in process.env)) {
          process.env[key] = value;
        }
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }
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

function deriveCheckpointPath(outputCsvPath, suffix) {
  const parsed = path.parse(outputCsvPath);
  return path.join(parsed.dir, `${parsed.name}-${suffix}.json`);
}

async function readJsonIfExists(targetPath) {
  try {
    return JSON.parse(await fs.readFile(targetPath, "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function waitForAsyncRequest(client, response, label, pollMs, maxPolls) {
  const requestId = response?.id || response?.requestId;
  if (!requestId) {
    throw new Error(`${label} did not return an async request id.`);
  }

  for (let attempt = 1; attempt <= maxPolls; attempt += 1) {
    const status = await client.getRequestArchive(requestId);
    const normalizedStatus = normalizeText(status?.status).toLowerCase();

    if (status?.error || status?.errorMessage) {
      throw new Error(`${label} failed: ${status.error || status.errorMessage}`);
    }

    if (status?.data || normalizedStatus === "success" || normalizedStatus === "completed") {
      return status?.data ?? status;
    }

    if (normalizedStatus === "failed" || normalizedStatus === "error") {
      throw new Error(`${label} failed with status ${status.status || "unknown"}.`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  throw new Error(`${label} timed out after ${maxPolls} polls.`);
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function trimSentenceEnding(value) {
  return normalizeText(value).replace(/[.?!]+$/, "");
}

function normalizeDomain(value) {
  const text = normalizeText(value).toLowerCase();
  if (!text) return "";
  const withoutProtocol = text.replace(/^https?:\/\//, "");
  const [host] = withoutProtocol.split("/");
  return host.replace(/^www\./, "");
}

function getRegistrableDomain(value) {
  const domain = normalizeDomain(value);
  if (!domain) return "";
  const parts = domain.split(".").filter(Boolean);
  if (parts.length <= 2) return domain;
  return parts.slice(-2).join(".");
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function pickFirst(...values) {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return "";
}

function buildPlaceQuery(row) {
  return [
    row.businessName,
    row.streetAddress,
    row.cityName || "Vancouver",
    "BC",
    "Canada",
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(", ");
}

function pickBestPlace(placeResults) {
  const places = toArray(placeResults);
  return places[0] ?? null;
}

function getPlaceWebsite(place) {
  return pickFirst(place?.site, place?.website, place?.domain);
}

function getPlacePhone(place) {
  return pickFirst(place?.phone, place?.phone_1, place?.phoneNumber);
}

function getPlaceCategory(place) {
  return pickFirst(place?.category, place?.type, place?.subtype);
}

function getPlaceCuisine(place) {
  return pickFirst(place?.cuisine, place?.food_type);
}

function getPlaceRating(place) {
  const value = place?.rating ?? place?.stars ?? "";
  return normalizeText(value);
}

function getPlaceReviewCount(place) {
  const value =
    place?.reviews ??
    place?.reviews_count ??
    place?.reviewsCount ??
    place?.review_count ??
    "";
  return normalizeText(value);
}

function extractEmails(contactRecord) {
  const merged = [
    ...toArray(contactRecord?.emails),
    ...toArray(contactRecord?.contacts),
  ];
  return merged
    .map((entry) =>
      typeof entry === "string"
        ? { value: normalizeText(entry), source: "" }
        : {
            value: normalizeText(entry?.value),
            source: normalizeText(entry?.source),
          })
    .filter((entry) => entry.value);
}

function extractPhones(contactRecord) {
  const phoneValues = [
    ...toArray(contactRecord?.phones).map((entry) => normalizeText(entry?.value ?? entry)),
    ...["phone_1", "phone_2", "phone_3"].map((key) => normalizeText(contactRecord?.[key])),
  ];
  return Array.from(new Set(phoneValues.filter(Boolean)));
}

function extractSocials(contactRecord) {
  const socials = contactRecord?.socials && typeof contactRecord.socials === "object"
    ? Object.values(contactRecord.socials).map((value) => normalizeText(value)).filter(Boolean)
    : [];
  return Array.from(new Set(socials));
}

function rankEmailEntry(entry) {
  const value = normalizeText(entry?.value).toLowerCase();
  if (!value.includes("@")) return -1000;
  const localPart = value.split("@")[0] || "";
  if (/^(info|hello|contact|events?|bookings?|reservations?|support|main|office|sales|admin|inquiries?|guestservices|marketing)$/.test(localPart)) {
    return 100;
  }
  if (/^(team|general|careers|community|concierge|private|groups?)$/.test(localPart)) {
    return 80;
  }
  if (normalizeText(entry?.source)) {
    return 60;
  }
  return 25;
}

function pickBestEmail(emailEntries) {
  return [...emailEntries]
    .sort(
      (left, right) =>
        rankEmailEntry(right) - rankEmailEntry(left)
        || normalizeText(left.value).localeCompare(normalizeText(right.value)),
    )[0];
}

function buildSendEligibility(row, profileConfig) {
  const hasOfficialWebsite = Boolean(normalizeText(row.officialWebsite));
  const hasContactPath = Boolean(normalizeText(row.contactPage) || normalizeText(row.privateDiningPage));
  const email = normalizeText(row.publicEmail);
  const emailDomain = getRegistrableDomain(email.split("@")[1] || "");
  const websiteDomain = getRegistrableDomain(row.officialWebsite);
  const categoryFit = profileConfig.isCategoryFit(
    [row.categoryFromSite, row.outscraperPlaceType, row.businessSubtype, row.businessType].join(" "),
  );
  const likelyPersonalMailbox = isLikelyPersonalMailbox(emailDomain);
  const domainMismatch = emailDomain && websiteDomain && emailDomain !== websiteDomain;

  if (email && categoryFit && !likelyPersonalMailbox && !domainMismatch) {
    return "email_ready_for_manual_review";
  }

  if (hasOfficialWebsite || hasContactPath) {
    return "contact_path_ready";
  }
  return "not_send_ready";
}

function buildResearchStatus(row, profileConfig) {
  if (buildSendEligibility(row, profileConfig) === "email_ready_for_manual_review") {
    return "public_email_found";
  }
  if (normalizeText(row.contactPage) || normalizeText(row.officialWebsite)) return "contact_path_found";
  return "needs_manual_review";
}

function isLikelyPersonalMailbox(domain) {
  return new Set([
    "gmail.com",
    "googlemail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "telus.net",
    "shaw.ca",
    "sasktel.net",
    "icloud.com",
    "me.com",
    "live.com",
  ]).has(normalizeText(domain).toLowerCase());
}

function buildReviewDecision(row, profileConfig) {
  const combinedCategory = [
    row.categoryFromSite,
    row.outscraperPlaceType,
    row.businessSubtype,
    row.businessType,
  ].join(" ");
  const email = normalizeText(row.publicEmail);
  const emailDomain = getRegistrableDomain(email.split("@")[1] || "");
  const websiteDomain = getRegistrableDomain(row.officialWebsite);
  const categoryFit = profileConfig.isCategoryFit(combinedCategory);
  const likelyPersonalMailbox = isLikelyPersonalMailbox(emailDomain);
  const domainMismatch = emailDomain && websiteDomain && emailDomain !== websiteDomain;

  if (!normalizeText(row.outscraperPlaceName)) {
    return "manual_match_needed";
  }
  if (normalizeText(row.categoryFromSite) && !categoryFit) {
    return "suspect_match_review";
  }
  if (email && likelyPersonalMailbox) {
    return "contact_path_review";
  }
  if (email && domainMismatch) {
    return "contact_path_review";
  }
  if (row.sendEligibility === "email_ready_for_manual_review") {
    return "email_candidate_review";
  }
  if (row.sendEligibility === "contact_path_ready") {
    return "contact_path_review";
  }
  return "manual_research_needed";
}

function buildReviewReason(row, profileConfig) {
  const category = normalizeText(row.categoryFromSite || row.outscraperPlaceType);
  const email = normalizeText(row.publicEmail);
  const emailDomain = getRegistrableDomain(email.split("@")[1] || "");
  const websiteDomain = getRegistrableDomain(row.officialWebsite);

  if (!normalizeText(row.outscraperPlaceName)) return "No place match returned.";
  if (category && !profileConfig.isCategoryFit(category)) {
    return `Matched category looks off: ${category}.`;
  }
  if (email && isLikelyPersonalMailbox(emailDomain)) {
    return `Found email uses a personal or franchise-style mailbox: ${email}.`;
  }
  if (email && emailDomain && websiteDomain && emailDomain !== websiteDomain) {
    return `Email domain ${emailDomain} does not match website domain ${websiteDomain}.`;
  }
  if (row.sendEligibility === "email_ready_for_manual_review") {
    return "Found a business-domain-style email that still needs manual owner review.";
  }
  if (row.sendEligibility === "contact_path_ready") {
    return "Website or contact path found, but no clean business-domain email is ready yet.";
  }
  return "Still needs manual official-site research.";
}

function buildReviewRows(rows, profileConfig) {
  return rows.map((row) => ({
    researchBatchId: row.researchBatchId,
    sequence: row.sequence,
    businessName: row.businessName,
    localArea: row.localArea,
    streetAddress: row.streetAddress,
    officialWebsite: row.officialWebsite,
    publicEmail: row.publicEmail,
    publicPhone: row.publicPhone,
    categoryFromSite: row.categoryFromSite,
    sendEligibility: row.sendEligibility,
    reviewDecision: buildReviewDecision(row, profileConfig),
    reviewReason: buildReviewReason(row, profileConfig),
    contactPage: row.contactPage,
    outscraperPlaceName: row.outscraperPlaceName,
    outscraperPlaceType: row.outscraperPlaceType,
    outscraperPlaceRating: row.outscraperPlaceRating,
    outscraperPlaceReviewCount: row.outscraperPlaceReviewCount,
  }));
}

function summarizeReviewRows(rows) {
  const counts = {};
  for (const row of rows) {
    counts[row.reviewDecision] = (counts[row.reviewDecision] ?? 0) + 1;
  }
  return {
    generatedAt: new Date().toISOString(),
    selectedCount: rows.length,
    byDecision: counts,
  };
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
    ? parsed.name.slice(0, -"review".length - 1)
    : parsed.name;
  return path.join(parsed.dir, `${stem}-${slugifyDecision(decision)}.csv`);
}

function deriveDecisionImportCsvPath(baseCsvPath, decision) {
  const parsed = path.parse(baseCsvPath);
  const stem = parsed.name.endsWith("-review")
    ? parsed.name.slice(0, -"review".length - 1)
    : parsed.name;
  return path.join(parsed.dir, `${stem}-${slugifyDecision(decision)}-import.csv`);
}

function groupRowsByDecision(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const existing = grouped.get(row.reviewDecision) || [];
    existing.push(row);
    grouped.set(row.reviewDecision, existing);
  }
  return grouped;
}

function buildBusinessProspectImportRows(rows, reviewDecision, profileConfig) {
  return rows.map((row) => ({
    businessName: normalizeText(row.businessName),
    email: reviewDecision === "email_candidate_review" ? normalizeText(row.publicEmail) : "",
    contactName: "",
    cityName: normalizeText(row.cityName || "Vancouver"),
    neighborhood: normalizeText(row.localArea),
    category: profileConfig.buildImportCategory(row),
    segment: profileConfig.buildImportSegment(row),
    sourceLabel: profileConfig.buildImportSourceLabel(reviewDecision),
    sourceUrl: pickFirst(row.officialWebsite, row.contactPage, row.officialSourceUrl),
    website: pickFirst(row.officialWebsite),
    contactPath:
      reviewDecision === "email_candidate_review"
        ? pickFirst(
            normalizeText(row.publicEmail)
              ? `mailto:${normalizeText(row.publicEmail).toLowerCase()}`
              : "",
            row.contactPage,
            row.officialWebsite,
            row.officialSourceUrl,
          )
        : pickFirst(row.contactPage, row.privateDiningPage, row.officialWebsite, row.officialSourceUrl),
    notes: profileConfig.buildImportNotes(
      row,
      reviewDecision,
      buildReviewReason(row, profileConfig),
    ),
    relationshipWarmth: "unknown",
  }));
}

function summarize(rows) {
  const matchedPlaceCount = rows.filter((row) => normalizeText(row.outscraperPlaceName)).length;
  const websiteFoundCount = rows.filter((row) => normalizeText(row.officialWebsite)).length;
  const emailFoundCount = rows.filter((row) => normalizeText(row.publicEmail)).length;
  const contactPathFoundCount = rows.filter(
    (row) => normalizeText(row.contactPage) || normalizeText(row.privateDiningPage),
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    selectedCount: rows.length,
    matchedPlaceCount,
    websiteFoundCount,
    contactPathFoundCount,
    emailFoundCount,
    emailReadyForManualReviewCount: rows.filter(
      (row) => row.sendEligibility === "email_ready_for_manual_review",
    ).length,
    contactPathReadyCount: rows.filter((row) => row.sendEligibility === "contact_path_ready").length,
    stillBlockedCount: rows.filter((row) => row.sendEligibility === "not_send_ready").length,
  };
}

async function main() {
  await loadLocalEnv();
  const options = parseArgs(process.argv.slice(2));
  const profileConfig = PROFILE_CONFIG[options.profile];
  const allowEnrichment = process.env.CITYATLAS_ALLOW_OUTSCRAPER_ENRICHMENT === "1";
  const apiKey = process.env.OUTSCRAPER_API_KEY || "";

  if (!allowEnrichment) {
    throw new Error(
      "CITYATLAS_ALLOW_OUTSCRAPER_ENRICHMENT=1 is required before running a paid Outscraper enrichment batch.",
    );
  }

  if (!apiKey) {
    throw new Error("OUTSCRAPER_API_KEY is missing. Add it to .env.local before running this script.");
  }

  const csv = await fs.readFile(options.input, "utf8");
  const allRows = parseCsv(csv);
  const rows = allRows.slice(options.offset, options.offset + options.limit);
  const queries = rows.map(buildPlaceQuery);
  const client = new Outscraper(apiKey);
  console.log(
    `Starting Outscraper ${profileConfig.label} enrichment for rows ${options.offset + 1}-${options.offset + rows.length} of ${allRows.length}.`,
  );

  let matchedPlaces = [];
  const placeCheckpoint = options.reusePlaceCheckpoint
    ? await readJsonIfExists(options.placeCheckpoint)
    : null;
  if (placeCheckpoint && Array.isArray(placeCheckpoint.matchedPlaces) && placeCheckpoint.matchedPlaces.length > 0) {
    matchedPlaces = placeCheckpoint.matchedPlaces.slice(0, rows.length);
    if (matchedPlaces.length === rows.length) {
      console.log(`Reused place checkpoint with ${matchedPlaces.length} rows.`);
    } else {
      console.log(`Reused partial place checkpoint with ${matchedPlaces.length} rows.`);
    }
  }
  if (matchedPlaces.length === rows.length) {
    // already fully restored from checkpoint
  } else {
    const completedPlaceCount = matchedPlaces.length;
    const remainingQueries = queries.slice(completedPlaceCount);
    const queryBatches = chunkArray(remainingQueries, options.placesBatchSize);
    for (const [batchIndex, queryBatch] of queryBatches.entries()) {
      console.log(`Places batch ${batchIndex + 1}/${queryBatches.length} (${queryBatch.length} queries)`);
      const placeResponse = await client.googleMapsSearch(
        queryBatch,
        1,
        "en",
        "ca",
        0,
        false,
        null,
        true,
      );
      const batchResults = await waitForAsyncRequest(
        client,
        placeResponse,
        `Places batch ${batchIndex + 1}/${queryBatches.length}`,
        options.asyncPollMs,
        options.asyncMaxPolls,
      );
      for (let index = 0; index < queryBatch.length; index += 1) {
        matchedPlaces.push(pickBestPlace(batchResults[index]));
      }
      await fs.mkdir(path.dirname(options.placeCheckpoint), { recursive: true });
      await fs.writeFile(
        options.placeCheckpoint,
        `${JSON.stringify({ generatedAt: new Date().toISOString(), matchedPlaces }, null, 2)}\n`,
        "utf8",
      );
    }
  }

  const domains = Array.from(
    new Set(
      matchedPlaces
        .map(getPlaceWebsite)
        .map(normalizeDomain)
        .filter(Boolean),
      ),
  );
  const savedContactCheckpoint = options.reuseContactCheckpoint
    ? await readJsonIfExists(options.contactCheckpoint)
    : null;
  const contactResults = Array.isArray(savedContactCheckpoint?.rows)
    ? savedContactCheckpoint.rows
    : [];
  const completedDomains = new Set(
    contactResults
      .map((entry) => normalizeDomain(entry?.domain || entry?.query || ""))
      .filter(Boolean),
  );
  const domainBatches = chunkArray(domains, options.contactsBatchSize);
  for (const [batchIndex, domainBatch] of domainBatches.entries()) {
    const pendingDomains = domainBatch.filter((domain) => !completedDomains.has(normalizeDomain(domain)));
    if (pendingDomains.length === 0) {
      continue;
    }
    console.log(`Contacts batch ${batchIndex + 1}/${domainBatches.length} (${pendingDomains.length} domains)`);
    const batchResults = pendingDomains.length > 0
      ? await waitForAsyncRequest(
          client,
          await client.emailsAndContacts(pendingDomains, null, true),
          `Contacts batch ${batchIndex + 1}/${domainBatches.length}`,
          options.asyncPollMs,
          options.asyncMaxPolls,
        )
      : [];
    contactResults.push(...toArray(batchResults));
    for (const domain of pendingDomains) {
      completedDomains.add(normalizeDomain(domain));
    }
    await fs.mkdir(path.dirname(options.contactCheckpoint), { recursive: true });
    await fs.writeFile(
      options.contactCheckpoint,
      `${JSON.stringify({ generatedAt: new Date().toISOString(), rows: contactResults }, null, 2)}\n`,
      "utf8",
    );
  }
  const contactsByDomain = new Map(
    toArray(contactResults).map((entry) => [normalizeDomain(entry?.domain || entry?.query || ""), entry]),
  );

  const enrichedRows = rows.map((row, index) => {
    const place = matchedPlaces[index];
    const officialWebsite = getPlaceWebsite(place);
    const domain = normalizeDomain(officialWebsite);
    const contactRecord = contactsByDomain.get(domain);
    const emailEntries = extractEmails(contactRecord);
    const bestEmail = pickBestEmail(emailEntries);
    const contactPhones = extractPhones(contactRecord);
    const socials = extractSocials(contactRecord);
    const contactPage = pickFirst(contactRecord?.contact_page, officialWebsite);

    const enriched = {
      ...row,
      officialWebsite,
      contactPage,
      privateDiningPage: normalizeText(row.privateDiningPage),
      publicEmail: normalizeText(bestEmail?.value),
      publicEmailEvidence: normalizeText(bestEmail?.source),
      allFoundEmails: emailEntries.map((entry) => entry.value).join("; "),
      publicPhone: pickFirst(getPlacePhone(place), contactPhones[0], row.publicPhone),
      allFoundPhones: contactPhones.join("; "),
      categoryFromSite: pickFirst(getPlaceCategory(place), row.categoryFromSite),
      cuisineFromSite: pickFirst(getPlaceCuisine(place), row.cuisineFromSite),
      researchSource: [
        normalizeText(place ? "Outscraper Google Maps Places API" : ""),
        normalizeText(contactRecord ? "Outscraper Domain Emails & Contacts API" : ""),
      ]
        .filter(Boolean)
        .join(" + "),
      outscraperQuery: queries[index],
      outscraperPlaceName: pickFirst(place?.name),
      outscraperFullAddress: pickFirst(place?.full_address, place?.address),
      outscraperPlacePhone: getPlacePhone(place),
      outscraperPlaceSite: officialWebsite,
      outscraperPlaceRating: getPlaceRating(place),
      outscraperPlaceReviewCount: getPlaceReviewCount(place),
      outscraperPlaceType: getPlaceCategory(place),
      outscraperGoogleId: pickFirst(place?.google_id),
      outscraperPlaceId: pickFirst(place?.place_id),
      outscraperSocials: socials.join("; "),
      outscraperEmailSourceCount: String(emailEntries.length),
    };

    return {
      ...enriched,
      researchStatus: buildResearchStatus(enriched, profileConfig),
      sendEligibility: buildSendEligibility(enriched, profileConfig),
      nextStep:
        buildSendEligibility(enriched, profileConfig) === "email_ready_for_manual_review"
          ? "Recheck the official site email, confirm it fits outreach, and move this row into manual owner review."
          : buildSendEligibility(enriched, profileConfig) === "contact_path_ready"
            ? "Open the official contact path and decide whether this should stay review-first or move into email research."
            : "Keep researching the official site manually before this row enters any send queue.",
      notes: [
        row.notes,
        place ? "Matched through Outscraper place search." : "No place match returned yet.",
        contactRecord ? "Domain contact enrichment returned public website contact data." : "No domain contact data returned yet.",
      ]
        .filter(Boolean)
        .join(" "),
    };
  });

  const summary = summarize(enrichedRows);
  const reviewRows = buildReviewRows(enrichedRows, profileConfig);
  const reviewSummary = summarizeReviewRows(reviewRows);
  const splitReviewRows = groupRowsByDecision(reviewRows);
  const splitReviewOutputs = {};
  const splitImportOutputs = {};

  for (const [reviewDecision, rowsForDecision] of splitReviewRows.entries()) {
    splitReviewOutputs[reviewDecision] = deriveDecisionCsvPath(options.reviewCsv, reviewDecision);
  }

  for (const reviewDecision of ["email_candidate_review", "contact_path_review"]) {
    const enrichedRowsForDecision = enrichedRows.filter(
      (row) => buildReviewDecision(row, profileConfig) === reviewDecision,
    );
    if (enrichedRowsForDecision.length === 0) continue;
    splitImportOutputs[reviewDecision] = {
      file: deriveDecisionImportCsvPath(options.reviewCsv, reviewDecision),
      rows: buildBusinessProspectImportRows(
        enrichedRowsForDecision,
        reviewDecision,
        profileConfig,
      ),
    };
  }

  await fs.mkdir(path.dirname(options.outputCsv), { recursive: true });
  await Promise.all([
    fs.writeFile(options.outputCsv, buildCsv(enrichedRows), "utf8"),
    fs.writeFile(options.outputJson, `${JSON.stringify(enrichedRows, null, 2)}\n`, "utf8"),
    fs.writeFile(options.outputSummary, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
    fs.writeFile(options.reviewCsv, buildCsv(reviewRows), "utf8"),
    fs.writeFile(options.reviewSummary, `${JSON.stringify(reviewSummary, null, 2)}\n`, "utf8"),
    ...Array.from(splitReviewRows.entries()).map(([reviewDecision, rowsForDecision]) =>
      fs.writeFile(splitReviewOutputs[reviewDecision], buildCsv(rowsForDecision), "utf8"),
    ),
    ...Object.values(splitImportOutputs).map((entry) =>
      fs.writeFile(
        entry.file,
        buildCsvWithHeaders(BUSINESS_PROSPECT_IMPORT_HEADERS, entry.rows),
        "utf8",
      ),
    ),
  ]);

  console.log(
    JSON.stringify(
      {
        ok: true,
        input: options.input,
        outputCsv: options.outputCsv,
        outputJson: options.outputJson,
        outputSummary: options.outputSummary,
        reviewCsv: options.reviewCsv,
        reviewSummary: options.reviewSummary,
        profile: options.profile,
        splitReviewOutputs,
        splitImportOutputs: Object.fromEntries(
          Object.entries(splitImportOutputs).map(([decision, entry]) => [decision, entry.file]),
        ),
        selectedCount: rows.length,
        offset: options.offset,
        matchedPlaceCount: summary.matchedPlaceCount,
        websiteFoundCount: summary.websiteFoundCount,
        emailFoundCount: summary.emailFoundCount,
      },
      null,
      2,
    ),
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
