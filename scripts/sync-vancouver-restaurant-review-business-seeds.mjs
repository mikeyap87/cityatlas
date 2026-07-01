import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_EMAIL_IMPORT_CSV = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-contact-research-batch-001-email-candidate-review-import.csv",
);
const DEFAULT_CONTACT_IMPORT_CSV = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-contact-research-batch-001-contact-path-review-import.csv",
);
const DEFAULT_EMAIL_REVIEW_CSV = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-contact-research-batch-001-email-candidate-review.csv",
);
const DEFAULT_CONTACT_REVIEW_CSV = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-contact-research-batch-001-contact-path-review.csv",
);
const DEFAULT_SEND_LEDGER_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-live-send-ledger.json",
);
const DEFAULT_OUTPUT_PATH = path.resolve(
  __dirname,
  "../src/data/vancouverRestaurantReviewBusinessSeeds.ts",
);
const DEFAULT_SUMMARY_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-review-seed-summary.json",
);
const DEFAULT_SHORTLIST_CSV_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-owner-review-shortlist.csv",
);
const DEFAULT_SHORTLIST_JSON_PATH = path.resolve(
  __dirname,
  "../output/growth/vancouver-restaurant-owner-review-shortlist.json",
);
const DEFAULT_SHORTLIST_DOC_PATH = path.resolve(
  __dirname,
  "../docs/seo-aeo-geo/VANCOUVER_RESTAURANT_OWNER_REVIEW_SHORTLIST.md",
);
const DEFAULT_SHORTLIST_LIMIT = 15;

function parseArgs(argv) {
  const options = {
    emailImportCsv: DEFAULT_EMAIL_IMPORT_CSV,
    contactImportCsv: DEFAULT_CONTACT_IMPORT_CSV,
    emailReviewCsv: DEFAULT_EMAIL_REVIEW_CSV,
    contactReviewCsv: DEFAULT_CONTACT_REVIEW_CSV,
    sendLedgerPath: DEFAULT_SEND_LEDGER_PATH,
    outputPath: DEFAULT_OUTPUT_PATH,
    summaryPath: DEFAULT_SUMMARY_PATH,
    shortlistCsvPath: DEFAULT_SHORTLIST_CSV_PATH,
    shortlistJsonPath: DEFAULT_SHORTLIST_JSON_PATH,
    shortlistDocPath: DEFAULT_SHORTLIST_DOC_PATH,
    shortlistLimit: DEFAULT_SHORTLIST_LIMIT,
  };

  for (const arg of argv) {
    if (arg.startsWith("--email-import-csv=")) {
      options.emailImportCsv = path.resolve(process.cwd(), arg.slice(19));
    } else if (arg.startsWith("--contact-import-csv=")) {
      options.contactImportCsv = path.resolve(process.cwd(), arg.slice(21));
    } else if (arg.startsWith("--email-review-csv=")) {
      options.emailReviewCsv = path.resolve(process.cwd(), arg.slice(19));
    } else if (arg.startsWith("--contact-review-csv=")) {
      options.contactReviewCsv = path.resolve(process.cwd(), arg.slice(21));
    } else if (arg.startsWith("--send-ledger-path=")) {
      options.sendLedgerPath = path.resolve(process.cwd(), arg.slice(19));
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

function formatDecision(value) {
  return normalizeText(value).replaceAll("_", " ");
}

function formatNumber(value) {
  return Number.isFinite(value) ? new Intl.NumberFormat("en-US").format(value) : "";
}

function toNumber(value) {
  const normalized = normalizeText(value).replaceAll(",", "");
  if (!normalized) return NaN;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
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

function looksLikeFoodBusiness(value) {
  return /restaurant|cafe|coffee|bakery|bar|bistro|grill|kitchen|pub|sushi|pizza|ramen|eatery|dining|chicken|afghan|indian|yakiniku|fusion/.test(
    normalizeKey(value),
  );
}

function looksLikeOffCategory(value) {
  return /caterer|frozen food|golf|educational|cafeteria|private school|school/.test(
    normalizeKey(value),
  );
}

function buildImportKeys(row) {
  const businessName = normalizeKey(row.businessName);
  const neighborhood = normalizeKey(row.neighborhood);
  const url = normalizeKey(row.sourceUrl || row.website);
  const email = normalizeKey(
    normalizeText(row.email || row.contactPath).replace(/^mailto:/i, ""),
  );

  return [
    `${businessName}::${neighborhood}::${url}`,
    `${businessName}::${neighborhood}::${email}`,
    `${businessName}::${url}`,
    `${businessName}::${email}`,
    `${businessName}::${neighborhood}`,
  ].filter((value, index, values) => value !== "::" && values.indexOf(value) === index);
}

function buildReviewKeys(row) {
  const businessName = normalizeKey(row.businessName);
  const neighborhood = normalizeKey(row.localArea);
  const url = normalizeKey(row.officialWebsite || row.contactPage || row.officialSourceUrl);
  const email = normalizeKey(row.publicEmail);

  return [
    `${businessName}::${neighborhood}::${url}`,
    `${businessName}::${neighborhood}::${email}`,
    `${businessName}::${url}`,
    `${businessName}::${email}`,
    `${businessName}::${neighborhood}`,
  ].filter((value, index, values) => value !== "::" && values.indexOf(value) === index);
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
  if (businessName && email && !neighborhood) {
    keys.push(`${businessName}::${email}`);
  }
  if (email && !businessName) {
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

function matchImportRows(importRows, reviewRows) {
  const remainingReviews = reviewRows.slice();
  const pairs = [];
  const unmatchedImports = [];

  for (const importRow of importRows) {
    const importKeys = buildImportKeys(importRow);
    let matchedIndex = -1;

    for (let index = 0; index < remainingReviews.length; index += 1) {
      const reviewRow = remainingReviews[index];
      const reviewKeys = buildReviewKeys(reviewRow);
      if (importKeys.some((key) => reviewKeys.includes(key))) {
        matchedIndex = index;
        break;
      }
    }

    if (matchedIndex === -1) {
      unmatchedImports.push(importRow);
      continue;
    }

    const [reviewRow] = remainingReviews.splice(matchedIndex, 1);
    pairs.push({ importRow, reviewRow });
  }

  return {
    pairs,
    unmatchedImports,
    unmatchedReviews: remainingReviews,
  };
}

function inferContactPathType(contactPath) {
  const normalized = normalizeKey(contactPath);
  if (!normalized) return "needs_manual_lookup";
  if (normalized.startsWith("mailto:")) return "direct_email";
  if (/instagram/.test(normalized)) return "instagram_dm";
  if (/private|events|event|book|booking|group|banquet|meeting|rental/.test(normalized)) {
    return "private_events_form";
  }
  return "contact_page";
}

function buildLaneSourceLabel(lane) {
  return lane === "email_candidate_review"
    ? "Vancouver restaurant review donor (email candidate)"
    : "Vancouver restaurant review donor (contact-path review)";
}

function buildSeedProof(pair, lane) {
  const proofBits = [
    lane === "email_candidate_review"
      ? "CityAtlas matched a public business email during the Vancouver restaurant review batch."
      : "CityAtlas matched a public official contact path during the Vancouver restaurant review batch.",
    trimSentenceEnding(pair.reviewRow.reviewReason)
      ? `Review reason: ${trimSentenceEnding(pair.reviewRow.reviewReason)}.`
      : "",
  ];

  const rating = toNumber(pair.reviewRow.outscraperPlaceRating);
  const reviewCount = toNumber(pair.reviewRow.outscraperPlaceReviewCount);
  if (Number.isFinite(rating)) {
    const ratingText = Number.isFinite(reviewCount)
      ? `Google Maps research signal: ${rating.toFixed(1)} rating from ${formatNumber(reviewCount)} reviews.`
      : `Google Maps research signal: ${rating.toFixed(1)} rating.`;
    proofBits.push(ratingText);
  }

  return proofBits.filter(Boolean).join(" ");
}

function buildSeedNotes(pair, lane, promotedToOwnerReview) {
  const noteBits = [
    `Imported from Vancouver restaurant Outscraper review batch ${normalizeText(pair.reviewRow.researchBatchId) || "001"} for local CityAtlas review only.`,
    `Review decision: ${formatDecision(pair.reviewRow.reviewDecision)}.`,
    trimSentenceEnding(pair.reviewRow.reviewReason)
      ? `Review reason: ${trimSentenceEnding(pair.reviewRow.reviewReason)}.`
      : "",
    normalizeText(pair.reviewRow.outscraperPlaceName)
      ? `Matched place: ${normalizeText(pair.reviewRow.outscraperPlaceName)}.`
      : "",
  ];

  const rating = toNumber(pair.reviewRow.outscraperPlaceRating);
  const reviewCount = toNumber(pair.reviewRow.outscraperPlaceReviewCount);
  if (Number.isFinite(rating)) {
    noteBits.push(
      Number.isFinite(reviewCount)
        ? `Research signal: ${rating.toFixed(1)} rating from ${formatNumber(reviewCount)} reviews.`
        : `Research signal: ${rating.toFixed(1)} rating.`,
    );
  }

  if (lane === "email_candidate_review") {
    noteBits.push(
      promotedToOwnerReview
        ? "This row is staged as owner-review-ready inside the no-send email lane."
        : "Keep this row review-first until the category fit and exact email are rechecked manually.",
    );
  } else {
    noteBits.push(
      "Keep this row in contact-path review until the exact official form or page is reverified manually.",
    );
  }

  noteBits.push("No outreach, public publishing, or route assignment happened automatically.");
  return noteBits.filter(Boolean).join(" ");
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

function shouldPromoteToOwnerReview(pair) {
  const categorySignals = [
    pair.importRow.category,
    pair.importRow.segment,
    pair.reviewRow.categoryFromSite,
    pair.reviewRow.outscraperPlaceType,
    pair.reviewRow.businessType,
    pair.reviewRow.businessSubtype,
    pair.reviewRow.businessName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    Boolean(normalizeText(pair.importRow.email))
    && looksLikeFoodBusiness(categorySignals)
    && !looksLikeOffCategory(categorySignals)
  );
}

function scoreShortlistCandidate(candidate) {
  const rating = toNumber(candidate.reviewRow.outscraperPlaceRating);
  const reviewCount = toNumber(candidate.reviewRow.outscraperPlaceReviewCount);
  const categoryText = [
    candidate.seed.category,
    candidate.seed.segment,
    candidate.reviewRow.outscraperPlaceType,
  ]
    .filter(Boolean)
    .join(" ");
  const categoryScore =
    /restaurant|bistro|bar|pub|grill|kitchen|sushi|pizza|ramen|afghan|indian|yakiniku/.test(
      normalizeKey(categoryText),
    )
      ? 24
      : /cafe|coffee|bakery/.test(normalizeKey(categoryText))
        ? 12
        : 0;
  const ratingScore = Number.isFinite(rating) ? rating * 25 : 0;
  const popularityScore = Number.isFinite(reviewCount) ? Math.min(reviewCount, 5000) / 35 : 0;
  return Math.round(ratingScore + popularityScore + categoryScore + 10);
}

function buildShortlistReason(candidate) {
  const rating = toNumber(candidate.reviewRow.outscraperPlaceRating);
  const reviewCount = toNumber(candidate.reviewRow.outscraperPlaceReviewCount);
  const category = normalizeText(candidate.seed.category || candidate.reviewRow.outscraperPlaceType || "Restaurant");

  if (Number.isFinite(rating) && Number.isFinite(reviewCount)) {
    return `${category} with a visible direct email plus a ${rating.toFixed(1)} rating from ${formatNumber(reviewCount)} reviews.`;
  }

  return `${category} with a visible direct email and a clean owner-review-first fit for the Vancouver queue.`;
}

function buildShortlistDomainKey(candidate) {
  return (
    getDomain(candidate.seed.website)
    || getDomain(candidate.seed.email)
    || `${normalizeKey(candidate.seed.businessName)}::${normalizeKey(candidate.seed.neighborhood)}`
  );
}

function estimateMergedRowCount(seedRows) {
  const merged = [];

  for (const row of seedRows) {
    const rowUrl = normalizeKey(row.sourceUrl || row.website);
    const rowEmail = normalizeKey(row.email);
    const rowNameCity = `${normalizeKey(row.businessName)}::vancouver`;
    const match = merged.find((current) => {
      const currentUrl = normalizeKey(current.sourceUrl || current.website);
      const currentEmail = normalizeKey(current.email);
      const currentNameCity = `${normalizeKey(current.businessName)}::vancouver`;

      if (rowUrl && currentUrl && rowUrl === currentUrl) return true;
      if (rowEmail && currentEmail && rowEmail === currentEmail) return true;
      return rowNameCity === currentNameCity;
    });

    if (!match) {
      merged.push(row);
    }
  }

  return merged.length;
}

function renderSeedRow(row) {
  const fields = [
    `businessName: '${escapeString(row.businessName)}'`,
    `neighborhood: '${escapeString(row.neighborhood)}'`,
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
    "// Generated by scripts/sync-vancouver-restaurant-review-business-seeds.mjs",
    "// Sources:",
    ...sourcePaths.map((sourcePath) => `// - ${path.relative(path.dirname(DEFAULT_OUTPUT_PATH), sourcePath)}`),
    "",
    "export const vancouverRestaurantReviewBusinessSeeds = [",
    ...seedRows.map(renderSeedRow),
    "];",
    "",
  ];

  return lines.join("\n");
}

function buildShortlistRows(shortlist) {
  return shortlist.map((candidate, index) => {
    const rating = toNumber(candidate.reviewRow.outscraperPlaceRating);
    const reviewCount = toNumber(candidate.reviewRow.outscraperPlaceReviewCount);
    return {
      rank: String(index + 1),
      businessName: candidate.seed.businessName,
      neighborhood: candidate.seed.neighborhood,
      category: candidate.seed.category,
      segment: candidate.seed.segment,
      email: candidate.seed.email,
      website: candidate.seed.website,
      rating: Number.isFinite(rating) ? rating.toFixed(1) : "",
      reviewCount: Number.isFinite(reviewCount) ? String(Math.round(reviewCount)) : "",
      shortlistScore: String(candidate.shortlistScore),
      whyNow: candidate.whyNow,
    };
  });
}

function buildShortlistMarkdown(shortlist, summary) {
  const lines = [
    "# Vancouver Restaurant Owner Review Shortlist",
    "",
    `Updated: ${summary.generatedAt.slice(0, 10)}`,
    "",
    "This is the current no-send owner-review shortlist generated from the reviewed Vancouver restaurant batch already on disk.",
    "",
    "## Honest status",
    "",
    `- Raw email-candidate rows in this batch: ${summary.emailCandidateRowCount}`,
    `- Raw contact-path review rows in this batch: ${summary.contactPathRowCount}`,
    `- Rows promoted into owner-review-ready email lane: ${summary.ownerReviewReadyCount}`,
    `- Current shortlist size: ${summary.shortlistCount}`,
    `- Estimated merged queue impact after duplicate collapse: ${summary.mergedQueueEstimateCount} rows`,
    "- No outreach, public publishing, or route assignment happened automatically.",
    "",
    "## Best first owner review list",
    "",
    "| Rank | Business | Neighborhood | Category | Rating | Reviews | Email | Why now |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...shortlist.map((candidate, index) => {
      const rating = toNumber(candidate.reviewRow.outscraperPlaceRating);
      const reviewCount = toNumber(candidate.reviewRow.outscraperPlaceReviewCount);
      return `| ${index + 1} | ${candidate.seed.businessName} | ${candidate.seed.neighborhood || "Unknown"} | ${candidate.seed.category} | ${Number.isFinite(rating) ? rating.toFixed(1) : "-"} | ${Number.isFinite(reviewCount) ? formatNumber(reviewCount) : "-"} | ${candidate.seed.email || "-"} | ${candidate.whyNow} |`;
    }),
    "",
  ];

  if (summary.heldBackExamples.length > 0) {
    lines.push("## Held back from owner-review promotion");
    lines.push("");
    lines.push(
      `These rows stayed review-only because the matched category looked off for a restaurant-first outreach lane: ${summary.heldBackExamples.join(", ")}.`,
    );
    lines.push("");
  }

  lines.push("## Next move");
  lines.push("");
  lines.push("1. Recheck the shortlist emails on the official sites.");
  lines.push("2. Decide which 5 to 10 rows actually deserve a manual founder preview.");
  lines.push("3. Keep every contact-path and off-category row blocked until a human confirms the right route.");
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const requiredInputs = [
    options.emailImportCsv,
    options.contactImportCsv,
    options.emailReviewCsv,
    options.contactReviewCsv,
  ];
  const missingInputs = [];

  for (const inputPath of requiredInputs) {
    if (!(await fileExists(inputPath))) {
      missingInputs.push(inputPath);
    }
  }

  if (missingInputs.length > 0) {
    const summary = {
      ok: true,
      skipped: true,
      reason: "Restaurant review inputs are not present on disk yet.",
      missingInputs,
      outputPath: options.outputPath,
    };
    await fs.mkdir(path.dirname(options.summaryPath), { recursive: true });
    await fs.writeFile(options.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  const [
    emailImportText,
    contactImportText,
    emailReviewText,
    contactReviewText,
  ] = await Promise.all([
    fs.readFile(options.emailImportCsv, "utf8"),
    fs.readFile(options.contactImportCsv, "utf8"),
    fs.readFile(options.emailReviewCsv, "utf8"),
    fs.readFile(options.contactReviewCsv, "utf8"),
  ]);

  let sendLedgerEntries = [];
  if (await fileExists(options.sendLedgerPath)) {
    const sendLedgerText = await fs.readFile(options.sendLedgerPath, "utf8");
    const parsedSendLedger = JSON.parse(sendLedgerText);
    sendLedgerEntries = Array.isArray(parsedSendLedger)
      ? parsedSendLedger
      : Array.isArray(parsedSendLedger.rows)
        ? parsedSendLedger.rows
        : [];
  }
  const sendLedgerLookup = createSendLedgerLookup(sendLedgerEntries);

  const emailImportRows = parseCsv(emailImportText);
  const contactImportRows = parseCsv(contactImportText);
  const emailReviewRows = parseCsv(emailReviewText);
  const contactReviewRows = parseCsv(contactReviewText);

  const emailMatches = matchImportRows(emailImportRows, emailReviewRows);
  const contactMatches = matchImportRows(contactImportRows, contactReviewRows);
  const generatedAt = new Date().toISOString();

  const seedRows = [
    ...emailMatches.pairs.map(({ importRow, reviewRow }) => {
      const promotedToOwnerReview = shouldPromoteToOwnerReview({ importRow, reviewRow });
      const email = normalizeText(importRow.email).toLowerCase();
      const contactPath = email ? `mailto:${email}` : normalizeText(importRow.contactPath);
      return applySendLedgerOverride({
        businessName: normalizeText(importRow.businessName),
        neighborhood: normalizeText(importRow.neighborhood),
        category: normalizeText(importRow.category || reviewRow.categoryFromSite || "Restaurant"),
        segment: normalizeText(importRow.segment || reviewRow.businessSubtype || "Restaurant"),
        sourceUrl: normalizeText(importRow.sourceUrl || importRow.website),
        website: normalizeText(importRow.website || importRow.sourceUrl),
        email,
        contactPath,
        contactPathType: "direct_email",
        contactReadiness: "email_ready",
        sourceProof: buildSeedProof({ importRow, reviewRow }, "email_candidate_review"),
        notes: buildSeedNotes(
          { importRow, reviewRow },
          "email_candidate_review",
          promotedToOwnerReview,
        ),
        contactConfidence: "high",
        donorSourceLabel: buildLaneSourceLabel("email_candidate_review"),
        approvalStatus: promotedToOwnerReview ? "ready_for_owner_review" : "review_only",
        outreachStatus: "not_started",
        relationshipWarmth: "unknown",
        lastUpdatedAt: generatedAt,
        reviewRow,
      }, findSendLedgerEntry(sendLedgerLookup, { businessName: importRow.businessName, neighborhood: importRow.neighborhood, email }));
    }),
    ...contactMatches.pairs.map(({ importRow, reviewRow }) => {
      const contactPath = normalizeText(importRow.contactPath || importRow.sourceUrl || importRow.website);
      return applySendLedgerOverride({
        businessName: normalizeText(importRow.businessName),
        neighborhood: normalizeText(importRow.neighborhood),
        category: normalizeText(importRow.category || reviewRow.categoryFromSite || "Restaurant"),
        segment: normalizeText(importRow.segment || reviewRow.businessSubtype || "Restaurant"),
        sourceUrl: normalizeText(importRow.sourceUrl || importRow.website),
        website: normalizeText(importRow.website || importRow.sourceUrl),
        email: "",
        contactPath,
        contactPathType: inferContactPathType(contactPath),
        contactReadiness: "contact_path_ready",
        sourceProof: buildSeedProof({ importRow, reviewRow }, "contact_path_review"),
        notes: buildSeedNotes({ importRow, reviewRow }, "contact_path_review", false),
        contactConfidence: contactPath && contactPath !== normalizeText(importRow.sourceUrl) ? "medium" : "low",
        donorSourceLabel: buildLaneSourceLabel("contact_path_review"),
        approvalStatus: "review_only",
        outreachStatus: "not_started",
        relationshipWarmth: "unknown",
        lastUpdatedAt: generatedAt,
        reviewRow,
      }, findSendLedgerEntry(sendLedgerLookup, { businessName: importRow.businessName, neighborhood: importRow.neighborhood, email: importRow.email }));
    }),
  ]
    .sort((left, right) => {
      const approvalCompare =
        (left.approvalStatus === "ready_for_owner_review" ? 1 : 0)
        - (right.approvalStatus === "ready_for_owner_review" ? 1 : 0);
      if (approvalCompare !== 0) return -approvalCompare;
      const readinessCompare =
        (left.contactReadiness === "email_ready" ? 1 : 0)
        - (right.contactReadiness === "email_ready" ? 1 : 0);
      if (readinessCompare !== 0) return -readinessCompare;
      return left.businessName.localeCompare(right.businessName);
    });

  const shortlistCandidates = seedRows
    .filter((row) => row.approvalStatus === "ready_for_owner_review")
    .map((row) => ({
      seed: {
        businessName: row.businessName,
        neighborhood: row.neighborhood,
        category: row.category,
        segment: row.segment,
        sourceUrl: row.sourceUrl,
        website: row.website,
        email: row.email,
      },
      reviewRow: row.reviewRow,
      shortlistScore: 0,
      whyNow: "",
    }))
    .map((candidate) => ({
      ...candidate,
      shortlistScore: scoreShortlistCandidate(candidate),
      whyNow: buildShortlistReason(candidate),
    }))
    .sort(
      (left, right) =>
        right.shortlistScore - left.shortlistScore
        || left.seed.businessName.localeCompare(right.seed.businessName),
    );

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

  const heldBackExamples = Array.from(
    new Set(
      emailMatches.pairs
        .filter((pair) => !shouldPromoteToOwnerReview(pair))
        .map((pair) => normalizeText(pair.importRow.businessName))
        .filter(Boolean),
    ),
  ).slice(0, 8);

  const renderableSeedRows = seedRows.map(({ reviewRow, ...row }) => row);
  const shortlistRows = buildShortlistRows(shortlist);
  const mergedQueueEstimateCount = estimateMergedRowCount(renderableSeedRows);

  const summary = {
    ok: true,
    skipped: false,
    generatedAt,
    inputFiles: {
      emailImportCsv: options.emailImportCsv,
      contactImportCsv: options.contactImportCsv,
      emailReviewCsv: options.emailReviewCsv,
      contactReviewCsv: options.contactReviewCsv,
      sendLedgerPath: options.sendLedgerPath,
    },
    outputFiles: {
      seedData: options.outputPath,
      shortlistCsv: options.shortlistCsvPath,
      shortlistJson: options.shortlistJsonPath,
      shortlistDoc: options.shortlistDocPath,
      summary: options.summaryPath,
    },
    emailCandidateRowCount: emailMatches.pairs.length,
    contactPathRowCount: contactMatches.pairs.length,
    totalSeedRows: renderableSeedRows.length,
    ownerReviewReadyCount: renderableSeedRows.filter(
      (row) => row.approvalStatus === "ready_for_owner_review",
    ).length,
    reviewOnlyCount: renderableSeedRows.filter((row) => row.approvalStatus === "review_only").length,
    sentManualCount: renderableSeedRows.filter((row) => row.outreachStatus === "sent_manual").length,
    shortlistCount: shortlist.length,
    mergedQueueEstimateCount,
    heldBackExamples,
    unmatchedImportRows: {
      email: emailMatches.unmatchedImports.map((row) => row.businessName),
      contactPath: contactMatches.unmatchedImports.map((row) => row.businessName),
    },
    unmatchedReviewRows: {
      email: emailMatches.unmatchedReviews.map((row) => row.businessName),
      contactPath: contactMatches.unmatchedReviews.map((row) => row.businessName),
    },
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
        await fileExists(options.sendLedgerPath)
          ? [...requiredInputs, options.sendLedgerPath]
          : requiredInputs,
      ),
      "utf8",
    ),
    fs.writeFile(
      options.shortlistCsvPath,
      buildCsv(
        [
          "rank",
          "businessName",
          "neighborhood",
          "category",
          "segment",
          "email",
          "website",
          "rating",
          "reviewCount",
          "shortlistScore",
          "whyNow",
        ],
        shortlistRows,
      ),
      "utf8",
    ),
    fs.writeFile(
      options.shortlistJsonPath,
      `${JSON.stringify(shortlistRows, null, 2)}\n`,
      "utf8",
    ),
    fs.writeFile(
      options.shortlistDocPath,
      `${buildShortlistMarkdown(shortlist, summary)}\n`,
      "utf8",
    ),
    fs.writeFile(options.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
