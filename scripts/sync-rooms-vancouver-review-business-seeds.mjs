import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reviewedSourcePath = path.resolve(
  __dirname,
  "../../rooms/data/outreach/vancouver-host-space-draft-packet-2026-06-13.csv",
);
const reviewQueueSourcePath = path.resolve(
  __dirname,
  "../../rooms/data/outreach/vancouver-host-space-prospects-2026-06-13.csv",
);
const contactReviewPacketSourcePath = path.resolve(
  __dirname,
  "../../rooms/data/outreach/contact-form-review-packet-vancouver-2026-06-13.csv",
);
const browserbaseReviewSourcePath = path.resolve(
  __dirname,
  "../../rooms/data/outreach/browserbase-contact-form-review-vancouver-2026-06-13.json",
);
const outputPath = path.resolve(__dirname, "../src/data/roomsVancouverReviewBusinessSeeds.ts");

const categoryMap = {
  community_space: {
    category: "Community space",
    segment: "Community and local-gathering partner",
  },
  coworking_space: {
    category: "Coworking space",
    segment: "Founder event and gathering partner",
  },
  cultural_space: {
    category: "Cultural space",
    segment: "Venue and cultural partner",
  },
  entertainment_venue: {
    category: "Entertainment venue",
    segment: "Atmosphere-led event partner",
  },
  event_venue: {
    category: "Event venue",
    segment: "Private-group and hosted-visit partner",
  },
  hotel_event_space: {
    category: "Hotel",
    segment: "Guest services and event-space partner",
  },
  hotel_or_club_space: {
    category: "Hotel or club space",
    segment: "Private-group and hospitality partner",
  },
  podcast_or_studio: {
    category: "Studio",
    segment: "Creator salon and private-event partner",
  },
  restaurant_bar: {
    category: "Restaurant / bar",
    segment: "Hospitality and hosted-visit partner",
  },
  studio_space: {
    category: "Studio",
    segment: "Creator salon and private-event partner",
  },
};

const blockedOfficialDomains = new Set([
  "eventective.com",
  "facebook.com",
  "instagram.com",
  "tiktok.com",
  "x.com",
]);

const statusRank = {
  email_ready: 3,
  contact_form_ready: 2,
  manual_review: 1,
};

const confidenceRank = {
  high: 3,
  medium: 2,
  low: 1,
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        field += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(field);
      field = "";
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

function escapeString(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&amp;/gi, "&")
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, "\"")
    .replace(/&nbsp;/gi, " ");
}

function normalizeText(value) {
  return decodeHtmlEntities(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getDomain(url) {
  try {
    return new URL(String(url)).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function isBlockedOfficialUrl(url) {
  const domain = getDomain(url);
  if (!domain) {
    return true;
  }

  for (const blockedDomain of blockedOfficialDomains) {
    if (domain === blockedDomain || domain.endsWith(`.${blockedDomain}`)) {
      return true;
    }
  }

  return false;
}

function chooseOfficialUrl(row) {
  if (row.officialUrl && !isBlockedOfficialUrl(row.officialUrl)) {
    return row.officialUrl;
  }

  if (row.sourceUrl && !isBlockedOfficialUrl(row.sourceUrl)) {
    return row.sourceUrl;
  }

  return "";
}

function looksOutsideVancouverMetro(row) {
  const combined = normalizeText(
    `${row.name || row.businessName || ""} ${row.city || ""} ${row.country || ""} ${row.officialUrl || ""} ${row.sourceUrl || ""}`,
  ).toLowerCase();

  return /\bvictoria\b|\bvancouver island\b/.test(combined);
}

function splitMultiValue(value) {
  return String(value || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isUsefulContactUrl(url) {
  if (!url) {
    return false;
  }

  return !(
    /\/wp-json\/|\/oembed\/|[?&]feed=|[?&]ical=|\/wp-content\/plugins\//i.test(url)
    || /\.(css|gif|ico|jpe?g|json|png|svg|webp)([?#]|$)/i.test(url)
  );
}

function chooseSupplementalContactPath(row, fallbackUrl) {
  const candidates = [
    fallbackUrl,
    ...splitMultiValue(row.contactUrls),
  ].filter((candidate) => candidate && isUsefulContactUrl(candidate));

  return candidates.find((candidate) =>
    /(contact|book|booking|bookings|event|events|meeting|meetings|banquet|private|rental|rentals|venue)/i.test(
      candidate,
    ),
  ) || candidates[0] || fallbackUrl;
}

function inferContactPathType(url) {
  if (/(book|booking|bookings|event|events|group|meeting|meetings|banquet|private|rental|rentals|venue)/i.test(url)) {
    return "private_events_form";
  }

  return "contact_page";
}

function getCategoryDetails(categoryKey) {
  return categoryMap[categoryKey] || {
    category: "Local business",
    segment: "Vancouver business partner",
  };
}

function buildIdentity(row) {
  return {
    email: String(row.selectedEmail || row.to || "").trim().toLowerCase(),
    name: normalizeText(row.name || row.businessName || ""),
    url: chooseOfficialUrl(row).toLowerCase(),
  };
}

function buildSeedIdentity(seed) {
  return {
    email: String(seed.email || "").trim().toLowerCase(),
    name: normalizeText(seed.businessName || ""),
    url: String(seed.sourceUrl || seed.website || "").trim().toLowerCase(),
  };
}

function isRepresented(identity, existingIdentities) {
  return (
    (identity.email && existingIdentities.emails.has(identity.email)) ||
    (identity.name && existingIdentities.names.has(identity.name)) ||
    (identity.url && existingIdentities.urls.has(identity.url))
  );
}

function buildExistingIdentities(rows) {
  const names = new Set();
  const emails = new Set();
  const urls = new Set();

  for (const row of rows) {
    const identity = buildIdentity(row);
    if (identity.name) names.add(identity.name);
    if (identity.email) emails.add(identity.email);
    if (identity.url) urls.add(identity.url);
  }

  return { names, emails, urls };
}

function formatSeed(seed) {
  const keys = [
    "businessName",
    "neighborhood",
    "category",
    "segment",
    "sourceUrl",
    "website",
    "email",
    "contactPath",
    "contactPathType",
    "contactReadiness",
    "sourceProof",
    "notes",
    "contactConfidence",
    "donorSourceLabel",
  ];

  return [
    "  {",
    ...keys.map((key) => `    ${key}: '${escapeString(seed[key])}',`),
    "  },",
  ].join("\n");
}

function buildNotes(status, row, sourceUrl) {
  const sourceHint =
    row.sourceUrl && row.sourceUrl !== sourceUrl
      ? ` Secondary public listing captured in donor research: ${row.sourceUrl}.`
      : "";
  const reviewHint =
    status === "contact_form_ready"
      ? " Rooms marked this row contact-form-ready, but CityAtlas still needs manual confirmation of the exact official form path before any outreach."
      : " Rooms kept this row in manual review, so CityAtlas should treat it as research-only until the official contact path is re-verified.";
  const riskFlags = row.riskFlags ? ` Risk flags: ${row.riskFlags}.` : "";
  const reviewNotes = row.reviewNotes ? ` Original donor review note: ${row.reviewNotes}` : "";

  return `Imported from the wider Rooms Vancouver host-space review queue for local CityAtlas review only.${sourceHint}${reviewHint}${riskFlags}${reviewNotes}`;
}

function buildSourceProof(status, row, sourceUrl) {
  const officialSource = row.sourceUrl && row.sourceUrl !== sourceUrl
    ? "Official site is preserved here, but the donor queue also referenced a secondary public listing that should not be treated as final proof for outreach."
    : "The row keeps the official public business source as the review anchor.";

  if (status === "contact_form_ready") {
    return `Rooms donor research from the wider Vancouver host-space review queue marked this business as contact-form-ready. ${officialSource}`;
  }

  return `Rooms donor research from the wider Vancouver host-space review queue kept this business in manual review. ${officialSource}`;
}

function normalizeSeed(row) {
  const status = String(row.status || "").trim();
  const officialUrl = chooseOfficialUrl(row);
  if (!officialUrl) {
    return null;
  }

  const businessName = decodeHtmlEntities(row.name || "").trim();
  if (!businessName) {
    return null;
  }

  const details = getCategoryDetails(row.category);
  const usedSecondaryListing = Boolean(row.sourceUrl && row.sourceUrl !== officialUrl);
  const confidence = usedSecondaryListing ? "medium" : "high";
  const base = {
    businessName,
    neighborhood: "",
    category: details.category,
    segment: details.segment,
    sourceUrl: officialUrl,
    website: officialUrl,
    email: "",
    contactPath: "",
    contactPathType: "needs_manual_lookup",
    contactReadiness: "needs_research",
    sourceProof: buildSourceProof(status, row, officialUrl),
    notes: buildNotes(status, row, officialUrl),
    contactConfidence: status === "manual_review" ? "low" : confidence,
    donorSourceLabel: usedSecondaryListing
      ? "Rooms host-space review donor (official site plus secondary public listing)"
      : "Rooms host-space review donor (official public source)",
    reviewStatus: status,
    relevanceScore: Number.parseFloat(String(row.relevanceScore || "0")) || 0,
  };

  if (status === "email_ready") {
    const email = String(row.selectedEmail || "").trim().toLowerCase();
    if (!email) {
      return null;
    }

    return {
      ...base,
      email,
      contactPath: "",
      contactPathType: "direct_email",
      contactReadiness: "email_ready",
      contactConfidence: confidence,
    };
  }

  if (status === "contact_form_ready") {
    const exactPathType = inferContactPathType(officialUrl);
    return {
      ...base,
      contactPath: officialUrl,
      contactPathType: exactPathType,
      contactReadiness: "contact_path_ready",
      contactConfidence: exactPathType === "private_events_form" ? confidence : "low",
    };
  }

  if (status === "manual_review") {
    return {
      ...base,
      contactConfidence: "low",
    };
  }

  return null;
}

function normalizeBrowserbaseReviewSeed(review) {
  if (String(review.city || "").trim() !== "Vancouver") {
    return null;
  }

  if (looksOutsideVancouverMetro(review)) {
    return null;
  }

  if (review.recommendedAction !== "promote_to_email_review") {
    return null;
  }

  const officialUrl = chooseOfficialUrl(review);
  if (!officialUrl) {
    return null;
  }

  const email = splitMultiValue(review.discoveredEmails?.join?.(";") || review.discoveredEmails || "")
    .map((value) => value.toLowerCase())
    .find(Boolean);
  if (!email) {
    return null;
  }

  const details = getCategoryDetails(review.category);
  const guardrails = Array.isArray(review.guardrails)
    ? review.guardrails.join("; ")
    : "";

  return {
    businessName: decodeHtmlEntities(review.name || "").trim(),
    neighborhood: "",
    category: details.category,
    segment: details.segment,
    sourceUrl: officialUrl,
    website: officialUrl,
    email,
    contactPath: "",
    contactPathType: "direct_email",
    contactReadiness: "email_ready",
    sourceProof:
      "Rooms Browserbase contact-form review found a public email on the official business page during read-only inspection. No contact form was submitted and no business was contacted.",
    notes:
      `Imported from the Rooms Browserbase Vancouver contact review for local CityAtlas review only. Recommended action: ${review.recommendedAction}.` +
      (guardrails ? ` Guardrails: ${guardrails}.` : "") +
      (review.personalizationAngle ? ` Original donor angle: ${review.personalizationAngle}` : ""),
    contactConfidence: "high",
    donorSourceLabel: "Rooms Browserbase review donor (official public source)",
    reviewStatus: "email_ready",
    relevanceScore: Math.max(0, 100 - (Number(review.reviewRank || 0) || 0)),
  };
}

function normalizeContactReviewPacketSeed(row) {
  if (String(row.city || "").trim() !== "Vancouver") {
    return null;
  }

  if (looksOutsideVancouverMetro(row)) {
    return null;
  }

  const officialUrl = chooseOfficialUrl(row);
  if (!officialUrl) {
    return null;
  }

  const businessName = decodeHtmlEntities(row.name || "").trim();
  if (!businessName) {
    return null;
  }

  const details = getCategoryDetails(row.category);
  const contactPath = chooseSupplementalContactPath(row, officialUrl);
  const contactPathType = inferContactPathType(contactPath);
  const guardrails = String(row.guardrails || "").trim();

  return {
    businessName,
    neighborhood: "",
    category: details.category,
    segment: details.segment,
    sourceUrl: officialUrl,
    website: officialUrl,
    email: "",
    contactPath,
    contactPathType,
    contactReadiness: "contact_path_ready",
    sourceProof:
      "Rooms donor research from the Vancouver contact-form review packet identified an official contact or booking path during review-only inspection. No form was submitted and no business was contacted.",
    notes:
      "Imported from the Rooms Vancouver contact-form review packet for local CityAtlas review only." +
      (guardrails ? ` Guardrails: ${guardrails}.` : "") +
      (row.personalizationAngle ? ` Original donor angle: ${row.personalizationAngle}` : ""),
    contactConfidence: contactPathType === "private_events_form" ? "medium" : "low",
    donorSourceLabel: "Rooms contact-form review donor (official public source)",
    reviewStatus: "contact_form_ready",
    relevanceScore: Number.parseFloat(String(row.relevanceScore || "0")) || 0,
  };
}

function shouldReplace(existingSeed, nextSeed) {
  if (statusRank[nextSeed.reviewStatus] !== statusRank[existingSeed.reviewStatus]) {
    return statusRank[nextSeed.reviewStatus] > statusRank[existingSeed.reviewStatus];
  }

  if (confidenceRank[nextSeed.contactConfidence] !== confidenceRank[existingSeed.contactConfidence]) {
    return confidenceRank[nextSeed.contactConfidence] > confidenceRank[existingSeed.contactConfidence];
  }

  return nextSeed.relevanceScore > existingSeed.relevanceScore;
}

function seedsMatch(left, right) {
  return (
    (left.email && right.email && left.email === right.email) ||
    (left.sourceUrl && right.sourceUrl && left.sourceUrl === right.sourceUrl) ||
    normalizeText(left.businessName) === normalizeText(right.businessName)
  );
}

const reviewedCsv = await fs.readFile(reviewedSourcePath, "utf8");
const [reviewedHeader, ...reviewedRows] = parseCsv(reviewedCsv);
const reviewedKeys = reviewedHeader.map((value) => value.trim());
const reviewedObjects = reviewedRows.map((values) =>
  Object.fromEntries(reviewedKeys.map((key, index) => [key, values[index] ?? ""])),
);
const existingIdentities = buildExistingIdentities(reviewedObjects);

const reviewQueueCsv = await fs.readFile(reviewQueueSourcePath, "utf8");
const [reviewQueueHeader, ...reviewQueueRows] = parseCsv(reviewQueueCsv);
const reviewQueueKeys = reviewQueueHeader.map((value) => value.trim());
const rawRows = reviewQueueRows.map((values) =>
  Object.fromEntries(reviewQueueKeys.map((key, index) => [key, values[index] ?? ""])),
);

const keptSeeds = [];
const counters = {
  alreadyRepresented: 0,
  blockedOfficialUrl: 0,
  browserbasePromoted: 0,
  browserbaseSkippedAlreadyRepresented: 0,
  browserbaseSkippedOutOfMetro: 0,
  contactReviewPacketAdded: 0,
  contactReviewPacketSkippedAlreadyRepresented: 0,
  contactReviewPacketSkippedOutOfMetro: 0,
  dedupedWithinReviewQueue: 0,
  kept: 0,
  skippedNonVancouver: 0,
  skippedUnsupportedStatus: 0,
};

for (const row of rawRows) {
  if (String(row.city || "").trim() !== "Vancouver") {
    counters.skippedNonVancouver += 1;
    continue;
  }

  if (row.status === "already_sent") {
    counters.skippedUnsupportedStatus += 1;
    continue;
  }

  const officialUrl = chooseOfficialUrl(row);
  if (!officialUrl) {
    counters.blockedOfficialUrl += 1;
    continue;
  }

  const identity = {
    email: String(row.selectedEmail || "").trim().toLowerCase(),
    name: normalizeText(row.name || ""),
    url: officialUrl.toLowerCase(),
  };

  if (isRepresented(identity, existingIdentities)) {
    counters.alreadyRepresented += 1;
    continue;
  }

  const normalizedSeed = normalizeSeed(row);
  if (!normalizedSeed) {
    counters.skippedUnsupportedStatus += 1;
    continue;
  }

  const duplicateIndex = keptSeeds.findIndex((candidate) => seedsMatch(candidate, normalizedSeed));
  if (duplicateIndex >= 0) {
    counters.dedupedWithinReviewQueue += 1;
    if (shouldReplace(keptSeeds[duplicateIndex], normalizedSeed)) {
      keptSeeds[duplicateIndex] = normalizedSeed;
    }
    continue;
  }

  keptSeeds.push(normalizedSeed);
  counters.kept += 1;
}

function upsertSupplementalSeed(seed, counterKeyAdded, counterKeySkipped) {
  const seedIdentity = buildSeedIdentity(seed);
  if (isRepresented(seedIdentity, existingIdentities)) {
    counters[counterKeySkipped] += 1;
    return;
  }

  const duplicateIndex = keptSeeds.findIndex((candidate) => seedsMatch(candidate, seed));
  if (duplicateIndex >= 0) {
    if (shouldReplace(keptSeeds[duplicateIndex], seed)) {
      keptSeeds[duplicateIndex] = seed;
      counters[counterKeyAdded] += 1;
      return;
    }

    counters[counterKeySkipped] += 1;
    return;
  }

  keptSeeds.push(seed);
  counters[counterKeyAdded] += 1;
}

const browserbaseReviewContents = await fs.readFile(browserbaseReviewSourcePath, "utf8");
const browserbaseReviewPacket = JSON.parse(browserbaseReviewContents);
for (const review of browserbaseReviewPacket.reviews || []) {
  if (String(review.city || "").trim() === "Vancouver" && looksOutsideVancouverMetro(review)) {
    counters.browserbaseSkippedOutOfMetro += 1;
    continue;
  }

  const supplementalSeed = normalizeBrowserbaseReviewSeed(review);
  if (!supplementalSeed) {
    continue;
  }

  upsertSupplementalSeed(
    supplementalSeed,
    "browserbasePromoted",
    "browserbaseSkippedAlreadyRepresented",
  );
}

const contactReviewCsv = await fs.readFile(contactReviewPacketSourcePath, "utf8");
const [contactReviewHeader, ...contactReviewRows] = parseCsv(contactReviewCsv);
const contactReviewKeys = contactReviewHeader.map((value) => value.trim());
for (const values of contactReviewRows) {
  const row = Object.fromEntries(contactReviewKeys.map((key, index) => [key, values[index] ?? ""]));

  if (String(row.city || "").trim() === "Vancouver" && looksOutsideVancouverMetro(row)) {
    counters.contactReviewPacketSkippedOutOfMetro += 1;
    continue;
  }

  const supplementalSeed = normalizeContactReviewPacketSeed(row);
  if (!supplementalSeed) {
    continue;
  }

  upsertSupplementalSeed(
    supplementalSeed,
    "contactReviewPacketAdded",
    "contactReviewPacketSkippedAlreadyRepresented",
  );
}

keptSeeds.sort((left, right) => {
  if (statusRank[right.reviewStatus] !== statusRank[left.reviewStatus]) {
    return statusRank[right.reviewStatus] - statusRank[left.reviewStatus];
  }
  return right.relevanceScore - left.relevanceScore;
});

const fileContents = `// Generated by scripts/sync-rooms-vancouver-review-business-seeds.mjs
// Sources:
// - ${path.relative(path.resolve(__dirname, ".."), reviewedSourcePath)}
// - ${path.relative(path.resolve(__dirname, ".."), reviewQueueSourcePath)}
// - ${path.relative(path.resolve(__dirname, ".."), contactReviewPacketSourcePath)}
// - ${path.relative(path.resolve(__dirname, ".."), browserbaseReviewSourcePath)}

export const roomsVancouverReviewBusinessSeeds = [
${keptSeeds.map(formatSeed).join("\n")}
];
`;

await fs.writeFile(outputPath, fileContents, "utf8");

const byReadiness = keptSeeds.reduce((accumulator, seed) => {
  accumulator[seed.contactReadiness] = (accumulator[seed.contactReadiness] || 0) + 1;
  return accumulator;
}, {});

console.log(
  JSON.stringify(
    {
      ok: true,
      outputPath,
      seedCount: keptSeeds.length,
      byReadiness,
      counters,
    },
    null,
    2,
  ),
);
