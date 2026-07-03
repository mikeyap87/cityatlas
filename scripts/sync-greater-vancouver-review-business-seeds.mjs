import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ENRICHED_CSV = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-priority-research-batch-001-enriched.csv",
);
const DEFAULT_REVIEW_CSV = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-priority-research-batch-001-review.csv",
);
const DEFAULT_RESEARCH_CSV = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-priority-research-batch-001.csv",
);
const DEFAULT_OUTPUT_PATH = path.resolve(
  __dirname,
  "../src/data/greaterVancouverReviewBusinessSeeds.ts",
);
const DEFAULT_SUMMARY_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-review-seed-summary.json",
);
const DEFAULT_SHORTLIST_CSV_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-owner-review-shortlist.csv",
);
const DEFAULT_SHORTLIST_JSON_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-owner-review-shortlist.json",
);
const DEFAULT_SHORTLIST_DOC_PATH = path.resolve(
  __dirname,
  "../docs/seo-aeo-geo/GREATER_VANCOUVER_OWNER_REVIEW_SHORTLIST.md",
);
const DEFAULT_SHORTLIST_LIMIT = 30;

function parseArgs(argv) {
  const options = {
    enrichedCsv: DEFAULT_ENRICHED_CSV,
    reviewCsv: DEFAULT_REVIEW_CSV,
    researchCsv: DEFAULT_RESEARCH_CSV,
    outputPath: DEFAULT_OUTPUT_PATH,
    summaryPath: DEFAULT_SUMMARY_PATH,
    shortlistCsvPath: DEFAULT_SHORTLIST_CSV_PATH,
    shortlistJsonPath: DEFAULT_SHORTLIST_JSON_PATH,
    shortlistDocPath: DEFAULT_SHORTLIST_DOC_PATH,
    shortlistLimit: DEFAULT_SHORTLIST_LIMIT,
  };

  for (const arg of argv) {
    if (arg.startsWith("--enriched-csv=")) {
      options.enrichedCsv = path.resolve(process.cwd(), arg.slice(15));
    } else if (arg.startsWith("--review-csv=")) {
      options.reviewCsv = path.resolve(process.cwd(), arg.slice(13));
    } else if (arg.startsWith("--research-csv=")) {
      options.researchCsv = path.resolve(process.cwd(), arg.slice(15));
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

function pickFirst(...values) {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return "";
}

function getEmailDomain(email) {
  const normalized = normalizeText(email).toLowerCase();
  if (!normalized.includes("@")) return "";
  return normalized.split("@").pop() || "";
}

function isLikelyPersonalMailbox(domain) {
  return new Set([
    "gmail.com",
    "googlemail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
    "me.com",
    "live.com",
    "shaw.ca",
    "telus.net",
  ]).has(normalizeText(domain).toLowerCase());
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

function buildReviewKey(row) {
  return `${normalizeText(row.researchBatchId)}::${normalizeText(row.sequence)}`;
}

function inferContactPathType(contactPath) {
  const normalized = normalizeKey(contactPath);
  if (!normalized) return "needs_manual_lookup";
  if (normalized.startsWith("mailto:")) return "direct_email";
  if (/^tel:/.test(normalized)) return "phone_or_text";
  if (/instagram/.test(normalized)) return "instagram_dm";
  if (/book|booking|reserve|events?|private|group|banquet|meeting|rental|inquiry|contact/.test(normalized)) {
    return "private_events_form";
  }
  return "contact_page";
}

function buildPhoneContactPath(phone) {
  const normalized = normalizeText(phone);
  if (!normalized) return "";
  return `tel:${normalized}`;
}

function buildFallbackReviewRows(researchRows) {
  return researchRows.map((row) => {
    const hasEmail = Boolean(normalizeText(row.publicEmail));
    const hasContactPath = Boolean(
      normalizeText(row.contactPage)
      || normalizeText(row.officialWebsite)
      || normalizeText(row.publicPhone),
    );
    let reviewDecision = "manual_research_needed";
    let reviewReason = "Official-source research still needs a verified public contact route.";
    if (hasEmail) {
      reviewDecision = "email_candidate_review";
      reviewReason = isLikelyPersonalMailbox(getEmailDomain(row.publicEmail))
        ? "Official municipal inventory exposed a public email, but it uses a personal-style mailbox and should stay review-first."
        : "Official municipal inventory already exposed a public email that still needs manual owner review.";
    } else if (normalizeText(row.publicPhone)) {
      reviewDecision = "contact_path_review";
      reviewReason =
        "Official municipal inventory exposed a public phone number, but no verified website or direct email yet.";
    } else if (hasContactPath) {
      reviewDecision = "contact_path_review";
      reviewReason =
        "Official municipal inventory exposed a public contact path, but no clean direct email is ready yet.";
    }

    return {
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
      reviewDecision,
      reviewReason,
      contactPage: row.contactPage,
      outscraperPlaceName: "",
      outscraperPlaceType: "",
      outscraperPlaceRating: "",
      outscraperPlaceReviewCount: "",
    };
  });
}

function buildCategory(enrichedRow, reviewRow) {
  return normalizeText(
    enrichedRow.categoryFromSite
    || reviewRow.categoryFromSite
    || enrichedRow.categoryPrimary
    || enrichedRow.outscraperPlaceType
    || enrichedRow.businessSubtype
    || enrichedRow.businessType
    || "Local business",
  );
}

function buildSegment(enrichedRow) {
  return normalizeText(
    enrichedRow.businessSubtype
    || enrichedRow.outscraperPlaceType
    || enrichedRow.businessType
    || "Local business",
  );
}

function buildResearchSignal(enrichedRow, reviewRow) {
  const rating = normalizeText(reviewRow.outscraperPlaceRating || enrichedRow.outscraperPlaceRating);
  const reviewCount = normalizeText(
    reviewRow.outscraperPlaceReviewCount || enrichedRow.outscraperPlaceReviewCount,
  );
  if (rating && reviewCount) {
    return `Google Maps research signal: ${rating} rating from ${reviewCount} reviews.`;
  }
  if (rating) {
    return `Google Maps research signal: ${rating} rating.`;
  }
  return "";
}

function buildWhyNow(categoryText, municipality) {
  const text = normalizeKey(categoryText);
  if (/restaurant|cafe|coffee|bakery|brew|bistro|pub|bar/.test(text)) {
    return `${municipality} food-and-drink row with a clean local-discovery angle and a usable public contact route.`;
  }
  if (/salon|spa|massage|esthetician|barber|nail|fitness|gym|yoga|pilates|wellness|recovery/.test(text)) {
    return `${municipality} wellness or personal-service row that can strengthen the non-restaurant side of CityAtlas.`;
  }
  if (/hotel|inn|gallery|museum|venue|event/.test(text)) {
    return `${municipality} visitor, culture, or hosted-outing row with strong guide and itinerary potential.`;
  }
  if (/auto repair|repair shop|detailing|car wash|tire|mechanic|automotive/.test(text)) {
    return `${municipality} automotive-service row that expands CityAtlas into useful everyday-service discovery.`;
  }
  if (/cleaning|janitorial|plumbing|electrical|pest|landscap/.test(text)) {
    return `${municipality} home or workday service row that broadens CityAtlas beyond dining without losing local fit.`;
  }
  if (/florist|pet groom|retail trader|retail merchant/.test(text)) {
    return `${municipality} local retail or specialty-service row with neighborhood-guide potential.`;
  }
  return `${municipality} local-business row with usable public contact proof for a broader CityAtlas partner lane.`;
}

function buildCategoryPriorityBonus(categoryText) {
  const text = normalizeKey(categoryText);
  if (/restaurant|cafe|coffee|bakery|brew|bistro|pub|bar/.test(text)) return 22;
  if (/salon|spa|massage|esthetician|barber|nail|fitness|gym|yoga|pilates|wellness|recovery/.test(text)) {
    return 20;
  }
  if (/hotel|inn|gallery|museum|venue|event/.test(text)) return 18;
  if (/auto repair|repair shop|detailing|car wash|tire|mechanic|automotive/.test(text)) return 17;
  if (/cleaning|janitorial|plumbing|electrical|pest|landscap/.test(text)) return 16;
  if (/florist|pet groom|retail trader|retail merchant/.test(text)) return 13;
  return 10;
}

function buildOwnerReviewPriority({ partnerFitScore, email, contactPath, category }) {
  const base = Number(partnerFitScore) || 0;
  const contactBonus = email ? 36 : contactPath ? 14 : 0;
  return base + contactBonus + buildCategoryPriorityBonus(category);
}

function buildSeedProof(enrichedRow, reviewRow) {
  const proofBits = [
    normalizeText(reviewRow.reviewDecision) === "email_candidate_review"
      ? "CityAtlas matched a public business email during the Greater Vancouver official review batch."
      : "CityAtlas matched a public official contact path during the Greater Vancouver official review batch.",
    normalizeText(enrichedRow.municipality)
      ? `Municipality: ${normalizeText(enrichedRow.municipality)}.`
      : "",
    trimSentenceEnding(reviewRow.reviewReason)
      ? `Review reason: ${trimSentenceEnding(reviewRow.reviewReason)}.`
      : "",
    buildResearchSignal(enrichedRow, reviewRow),
  ];

  return proofBits.filter(Boolean).join(" ");
}

function buildSeedNotes(enrichedRow, reviewRow, promotedToOwnerReview) {
  const noteBits = [
    `Imported from Greater Vancouver official review batch ${normalizeText(reviewRow.researchBatchId) || "001"} for local CityAtlas review only.`,
    normalizeText(enrichedRow.municipality)
      ? `Municipality: ${normalizeText(enrichedRow.municipality)}.`
      : "",
    `Review decision: ${normalizeText(reviewRow.reviewDecision).replaceAll("_", " ")}.`,
    trimSentenceEnding(reviewRow.reviewReason)
      ? `Review reason: ${trimSentenceEnding(reviewRow.reviewReason)}.`
      : "",
    normalizeText(enrichedRow.partnerFitReason)
      ? `Partner-fit reason: ${trimSentenceEnding(enrichedRow.partnerFitReason)}.`
      : "",
    normalizeText(reviewRow.outscraperPlaceName)
      ? `Matched place: ${normalizeText(reviewRow.outscraperPlaceName)}.`
      : "",
    buildResearchSignal(enrichedRow, reviewRow),
    promotedToOwnerReview
      ? "This row is staged as owner-review-ready inside the no-send Greater Vancouver email lane."
      : normalizeText(enrichedRow.publicEmail)
        ? "Keep this row review-first until the exact public email and local fit are rechecked."
        : "Keep this row in contact-path review until a direct email or cleaner official route is confirmed.",
    "No outreach, public publishing, or route assignment happened automatically.",
  ];

  return noteBits.filter(Boolean).join(" ");
}

function buildSeedRowMergeKey(row) {
  const businessName = normalizeKey(row.businessName);
  const municipality = normalizeKey(row.municipality);
  const email = normalizeKey(normalizeText(row.email).replace(/^mailto:/i, ""));
  const url = normalizeKey(row.sourceUrl || row.website || row.contactPath);
  return email
    ? `${businessName}::${municipality}::${email}`
    : `${businessName}::${municipality}::${url}`;
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
  return (incoming.ownerReviewPriority || 0) > (existing.ownerReviewPriority || 0)
    ? incoming
    : existing;
}

function renderSeedRow(row) {
  const fields = [
    `businessName: '${escapeString(row.businessName)}'`,
    `neighborhood: '${escapeString(row.neighborhood)}'`,
    `municipality: '${escapeString(row.municipality || "Vancouver")}'`,
    `marketScope: '${escapeString(row.marketScope || "metro_area")}'`,
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
    "// Generated by scripts/sync-greater-vancouver-review-business-seeds.mjs",
    "// @ts-nocheck",
    "// Sources:",
    ...sourcePaths.map((sourcePath) => `// - ${path.relative(path.dirname(DEFAULT_OUTPUT_PATH), sourcePath)}`),
    "",
    "export const greaterVancouverReviewBusinessSeeds = [",
    ...seedRows.map(renderSeedRow),
    "];",
    "",
  ];

  return lines.join("\n");
}

function buildShortlistDomainKey(candidate) {
  return normalizeKey(
    candidate.website
    || candidate.email
    || `${candidate.businessName}::${candidate.municipality}`,
  );
}

function buildShortlistMarkdown(shortlist, summary) {
  const lines = [
    "# Greater Vancouver Owner Review Shortlist",
    "",
    `Updated: ${summary.generatedAt.slice(0, 10)}`,
    "",
    "This is the current no-send owner-review shortlist generated from the verified Greater Vancouver official priority research lane already staged inside CityAtlas.",
    "",
    "## Honest status",
    "",
    `- Imported official metro review rows considered in this run: ${summary.importedOfficialReviewRows}`,
    `- Imported metro rows promoted into the local seed layer: ${summary.totalSeedRows}`,
    `- Email-ready metro rows promoted into owner-review-ready: ${summary.ownerReviewReadyCount}`,
    `- Contact-path-only metro rows kept review-first: ${summary.reviewOnlyCount}`,
    `- Municipalities currently represented: ${summary.municipalities.join(", ")}`,
    `- Current shortlist size: ${summary.shortlistCount}`,
    "- No outreach, public publishing, or route assignment happened automatically.",
    "",
    "## Best first owner review list",
    "",
    "| Rank | Business | Municipality | Neighborhood | Category | Email | Why now |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...shortlist.map((candidate, index) =>
      `| ${index + 1} | ${candidate.businessName} | ${candidate.municipality} | ${candidate.neighborhood || "Unknown"} | ${candidate.category} | ${candidate.email || "-"} | ${candidate.whyNow} |`
    ),
    "",
    "## Next move",
    "",
    "1. Use the new metro seed lane inside admin to review direct-email rows before any wider outreach decision.",
    "2. Keep contact-path-only metro rows blocked from live sending until the official contact route is rechecked.",
    "3. Expand the next metro batch only after this first priority slice looks clean in admin.",
    "",
  ];

  return lines.join("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const generatedAt = new Date().toISOString();
  const [hasEnrichedCsv, hasReviewCsv, hasResearchCsv] = await Promise.all([
    fileExists(options.enrichedCsv),
    fileExists(options.reviewCsv),
    fileExists(options.researchCsv),
  ]);

  let enrichedRows = [];
  let reviewRows = [];
  let sourceMode = "provider_review";

  if (hasEnrichedCsv && hasReviewCsv) {
    const [enrichedText, reviewText] = await Promise.all([
      fs.readFile(options.enrichedCsv, "utf8"),
      fs.readFile(options.reviewCsv, "utf8"),
    ]);
    enrichedRows = parseCsv(enrichedText);
    reviewRows = parseCsv(reviewText);
  } else if (hasResearchCsv) {
    const researchText = await fs.readFile(options.researchCsv, "utf8");
    enrichedRows = parseCsv(researchText);
    reviewRows = buildFallbackReviewRows(enrichedRows);
    sourceMode = "official_research_fallback";
  } else {
    throw new Error(
      "No metro enriched/review files or research CSV were found. Run the metro research batch first.",
    );
  }

  const enrichedByKey = new Map(enrichedRows.map((row) => [buildReviewKey(row), row]));

  const seedRows = [];
  const shortlistRows = [];

  for (const reviewRow of reviewRows) {
    const decision = normalizeText(reviewRow.reviewDecision);
    if (!["email_candidate_review", "contact_path_review"].includes(decision)) {
      continue;
    }

    const enrichedRow = enrichedByKey.get(buildReviewKey(reviewRow));
    if (!enrichedRow) {
      continue;
    }

    const municipality = normalizeText(enrichedRow.municipality || enrichedRow.cityName || "Vancouver");
    const neighborhood = normalizeText(enrichedRow.localArea || municipality);
    const category = buildCategory(enrichedRow, reviewRow);
    const segment = buildSegment(enrichedRow);
    const email =
      decision === "email_candidate_review"
        ? normalizeText(enrichedRow.publicEmail).toLowerCase()
        : "";
    const personalMailbox = isLikelyPersonalMailbox(getEmailDomain(email));
    const phoneContactPath = !email ? buildPhoneContactPath(enrichedRow.publicPhone) : "";
    const contactPath = email
      ? `mailto:${email}`
      : pickFirst(
          enrichedRow.contactPage,
          enrichedRow.privateDiningPage,
          enrichedRow.officialWebsite,
          phoneContactPath,
          enrichedRow.officialSourceUrl,
        );
    const promotedToOwnerReview = Boolean(email) && !personalMailbox;
    const whyNow = buildWhyNow(`${category} ${segment}`, municipality);
    const ownerReviewPriority = buildOwnerReviewPriority({
      partnerFitScore: enrichedRow.partnerFitScore,
      email,
      contactPath,
      category: `${category} ${segment}`,
    });

    const row = {
      businessName: normalizeText(enrichedRow.businessName),
      neighborhood,
      municipality,
      marketScope: municipality !== "Vancouver" ? "metro_area" : "city_only",
      category,
      segment,
      sourceUrl: pickFirst(
        enrichedRow.officialWebsite,
        enrichedRow.contactPage,
        enrichedRow.officialSourceUrl,
      ),
      website: normalizeText(enrichedRow.officialWebsite),
      email,
      contactPath,
      contactPathType: email
        ? "direct_email"
        : phoneContactPath && contactPath === phoneContactPath
          ? "phone_or_text"
          : inferContactPathType(contactPath),
      contactReadiness: email
        ? "email_ready"
        : contactPath
          ? "contact_path_ready"
          : "needs_research",
      sourceProof: buildSeedProof(enrichedRow, reviewRow),
      notes: buildSeedNotes(enrichedRow, reviewRow, promotedToOwnerReview),
      contactConfidence: email ? (personalMailbox ? "medium" : "high") : contactPath ? "medium" : "low",
      donorSourceLabel:
        decision === "email_candidate_review"
          ? "Greater Vancouver official review donor (email candidate)"
          : "Greater Vancouver official review donor (contact path)",
      approvalStatus: promotedToOwnerReview ? "ready_for_owner_review" : "review_only",
      outreachStatus: "not_started",
      relationshipWarmth: "unknown",
      lastUpdatedAt: generatedAt,
      ownerReviewPriority,
      whyNow,
    };

    seedRows.push(row);
  }

  const mergedSeedMap = seedRows.reduce((map, row) => {
    const key = buildSeedRowMergeKey(row);
    map.set(key, choosePreferredSeedRow(map.get(key), row));
    return map;
  }, new Map());

  const sortedSeedRows = Array.from(mergedSeedMap.values()).sort((left, right) =>
    (right.approvalStatus === "ready_for_owner_review" ? 1 : 0)
      - (left.approvalStatus === "ready_for_owner_review" ? 1 : 0)
    || (right.contactReadiness === "email_ready" ? 1 : 0)
      - (left.contactReadiness === "email_ready" ? 1 : 0)
    || (right.ownerReviewPriority || 0) - (left.ownerReviewPriority || 0)
    || left.businessName.localeCompare(right.businessName)
  );

  const shortlistCandidates = sortedSeedRows
    .filter((row) => row.approvalStatus === "ready_for_owner_review")
    .map((row) => ({
      rank: "",
      businessName: row.businessName,
      neighborhood: row.neighborhood,
      municipality: row.municipality,
      category: row.category,
      segment: row.segment,
      email: row.email,
      website: row.website,
      shortlistScore: String(row.ownerReviewPriority || 0),
      whyNow: row.whyNow,
    }));

  const shortlist = [];
  const seenShortlistKeys = new Set();
  for (const candidate of shortlistCandidates) {
    const key = buildShortlistDomainKey(candidate);
    if (seenShortlistKeys.has(key)) {
      continue;
    }
    seenShortlistKeys.add(key);
    shortlist.push(candidate);
    if (shortlist.length >= options.shortlistLimit) {
      break;
    }
  }

  shortlist.forEach((candidate, index) => {
    candidate.rank = String(index + 1);
  });

  const renderableSeedRows = sortedSeedRows.map(
    ({ ownerReviewPriority, whyNow, ...row }) => row,
  );

  const summary = {
    ok: true,
    generatedAt,
    sourceMode,
    inputFiles: {
      enrichedCsv: hasEnrichedCsv ? options.enrichedCsv : "",
      reviewCsv: hasReviewCsv ? options.reviewCsv : "",
      researchCsv: sourceMode === "official_research_fallback" ? options.researchCsv : "",
    },
    outputFiles: {
      seedData: options.outputPath,
      shortlistCsv: options.shortlistCsvPath,
      shortlistJson: options.shortlistJsonPath,
      shortlistDoc: options.shortlistDocPath,
      summary: options.summaryPath,
    },
    importedOfficialReviewRows: reviewRows.length,
    importedOfficialSeedRows: renderableSeedRows.length,
    totalSeedRows: renderableSeedRows.length,
    ownerReviewReadyCount: renderableSeedRows.filter(
      (row) => row.approvalStatus === "ready_for_owner_review",
    ).length,
    reviewOnlyCount: renderableSeedRows.filter((row) => row.approvalStatus === "review_only").length,
    municipalities: [...new Set(renderableSeedRows.map((row) => row.municipality || "Vancouver"))].sort(),
    shortlistCount: shortlist.length,
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
        sourceMode === "official_research_fallback"
          ? [options.researchCsv]
          : [options.enrichedCsv, options.reviewCsv],
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
          "municipality",
          "category",
          "segment",
          "email",
          "website",
          "shortlistScore",
          "whyNow",
        ],
        shortlist,
      ),
      "utf8",
    ),
    fs.writeFile(options.shortlistJsonPath, `${JSON.stringify(shortlist, null, 2)}\n`, "utf8"),
    fs.writeFile(options.shortlistDocPath, `${buildShortlistMarkdown(shortlist, summary)}\n`, "utf8"),
    fs.writeFile(options.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
