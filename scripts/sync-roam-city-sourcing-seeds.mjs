import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(
  __dirname,
  "../../roam-relaxation/storage/automation/homepage-city-sourcing",
);
const targetCityKeys = [
  "vancouver",
  "toronto",
  "calgary",
  "montreal",
  "ottawa",
  "seattle",
  "san-francisco",
  "los-angeles",
  "new-york",
  "miami",
  "tokyo",
  "lisbon",
  "barcelona",
  "mexico-city",
  "berlin",
  "chicago",
  "austin",
  "portland",
  "denver",
  "boston",
  "washington-dc",
  "san-diego",
  "atlanta",
];

const outputPath = path.resolve(__dirname, "../src/data/roamCitySourcingSeeds.ts");
const blockedSourceDomains = new Set([
  "discoverbarcelona.city",
  "getyourguide.com",
  "kijiji.ca",
  "salondiscover.com",
  "whereig.com",
]);
const blockedBusinessNamePatterns = [
  /^not acceptable!?$/i,
  /^getyourguide$/i,
  /^\d{3}\s+(bad gateway|error|not found|service unavailable)$/i,
  /^where is /i,
  / located in /i,
  /\[[^\]]+/,
];
const namedHtmlEntities = new Map([
  ["amp", "&"],
  ["apos", "'"],
  ["gt", ">"],
  ["lt", "<"],
  ["nbsp", " "],
  ["quot", '"'],
  ["rsquo", "'"],
]);
const beautyNoisePattern =
  /\b(barber|beauty|brow(?:s)?|cuts?|hair|lashes?|makeup|nail|salon|shaves?|waxing)\b/i;
const strongWellnessCuePattern =
  /\b(bodywork|massage|recovery|salt cave|stretch|therap(?:y|eutic)|wellness)\b/i;
const wellnessCuePattern =
  /\b(bodywork|massage|recovery|salt cave|sauna|spa|stretch|therap(?:y|eutic)|wellness)\b/i;
const genericMarketplaceNamePattern = /^(about|contact|home|services?)$/i;
const ambiguousMarketplaceNamePattern = /\b(dream|elements?|family|studio)\b/i;
const comparisonListiclePattern =
  /\b(best|compare|comparison|guide|review|reviews|top)\b|口コミ|ランキング|比較|おすすめ/i;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
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
  return String(value || "").replace(
    /&(#x?[0-9a-f]+|[a-z]+);/gi,
    (match, entity) => {
      const normalized = entity.toLowerCase();
      if (normalized.startsWith("#x")) {
        const codePoint = Number.parseInt(normalized.slice(2), 16);
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
      }
      if (normalized.startsWith("#")) {
        const codePoint = Number.parseInt(normalized.slice(1), 10);
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
      }
      return namedHtmlEntities.get(normalized) ?? match;
    },
  );
}

function normalizeText(value) {
  return decodeHtmlEntities(value)
    .replace(/\s+/g, " ")
    .trim();
}

function getSourceDomain(url) {
  try {
    return new URL(String(url)).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function slugify(value) {
  return normalizeText(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePhone(value) {
  const trimmed = normalizeText(value);
  if (!trimmed) return "";
  return `tel:${trimmed.replace(/\s+/g, "")}`;
}

function getDomainCore(hostname) {
  const parts = String(hostname || "")
    .split(".")
    .filter(Boolean);
  if (parts.length <= 2) {
    return parts[0] || "";
  }

  const last = parts.at(-1) || "";
  const secondLast = parts.at(-2) || "";
  if (last.length === 2 && secondLast.length <= 3) {
    return parts.at(-3) || parts[0] || "";
  }

  return secondLast;
}

function formatFallbackWord(word) {
  const lower = String(word || "").toLowerCase();
  if (!lower) return "";
  if (["dc", "la", "llc", "ltd", "nyc"].includes(lower)) {
    return lower.toUpperCase();
  }
  return lower[0].toUpperCase() + lower.slice(1);
}

function getDomainFallbackName(url) {
  const sourceDomain = getSourceDomain(url);
  const domainCore = getDomainCore(sourceDomain);
  if (!domainCore) return "";

  const humanized = normalizeText(
    domainCore
      .replace(/bodywork/gi, " bodywork ")
      .replace(/massage/gi, " massage ")
      .replace(/masseuse/gi, " masseuse ")
      .replace(/selfcare/gi, " self care ")
      .replace(/stretch/gi, " stretch ")
      .replace(/wellness/gi, " wellness ")
      .replace(/[-_]+/g, " "),
  );

  return humanized
    .split(/\s+/)
    .filter(Boolean)
    .map(formatFallbackWord)
    .join(" ");
}

function isCityNameTitle(businessName, cityName) {
  const normalizedBusiness = slugify(businessName);
  const normalizedCity = slugify(cityName);
  return Boolean(normalizedBusiness && normalizedCity && normalizedBusiness === normalizedCity);
}

function normalizeBusinessName(rawName, { cityName, sourceUrl, website }) {
  const decodedName = normalizeText(rawName);
  const domainFallbackName = getDomainFallbackName(sourceUrl || website);

  if (!decodedName) {
    return domainFallbackName;
  }

  const withoutMarketingSuffix = decodedName.replace(/\s*:\s*.+$/, "").trim();
  const withoutJapaneseBrackets = withoutMarketingSuffix.replace(/【[^】]*】/g, "").trim();
  const separatorTrimmed = withoutJapaneseBrackets.includes("｜") && slugify(withoutJapaneseBrackets).startsWith(slugify(cityName))
    ? withoutJapaneseBrackets.split("｜").at(-1)?.trim() || withoutJapaneseBrackets
    : withoutJapaneseBrackets;
  const commaSegments = separatorTrimmed
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (/^home$/i.test(separatorTrimmed) || isCityNameTitle(separatorTrimmed, cityName)) {
    return domainFallbackName || separatorTrimmed;
  }

  if (commaSegments.length >= 3) {
    return domainFallbackName || commaSegments[0];
  }

  if (separatorTrimmed.length >= 72 && domainFallbackName) {
    return domainFallbackName;
  }

  return separatorTrimmed;
}

function isSuspiciousMarketplaceWellnessTitle(businessName) {
  const normalized = normalizeText(businessName);
  const words = normalized
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return true;
  if (wellnessCuePattern.test(normalized)) return false;
  if (beautyNoisePattern.test(normalized)) return true;
  if (genericMarketplaceNamePattern.test(normalized)) return true;
  if (words.length === 1) return true;
  if (words.length <= 2 && ambiguousMarketplaceNamePattern.test(normalized)) return true;
  return false;
}

function getArtifactScore(artifact) {
  const intakeReadyCsv = artifact?.row?.intakeReadyCsv?.trim() || "";
  const intakeReady = Number(artifact?.row?.intakeReady || 0);
  const previewStatus = Number(artifact?.row?.previewStatus || 0);
  const usesDefaultQuery =
    artifact?.runOptions?.queryStrategy === "default" || /query-default/.test(artifact.fileName);

  return [
    intakeReadyCsv.length > 0 ? 1 : 0,
    intakeReady,
    usesDefaultQuery ? 1 : 0,
    previewStatus === 200 ? 1 : 0,
    intakeReadyCsv.length,
  ];
}

function compareScores(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return right[index] - left[index];
    }
  }
  return 0;
}

function getCategoryDetails(prospectType, fitNotes = "") {
  const text = normalizeText(`${prospectType} ${fitNotes}`).toLowerCase();
  if (/massage|recovery|wellness|spa|bodywork/.test(text)) {
    return {
      category: "Wellness",
      segment: "Mobile massage and recovery partner",
    };
  }
  return {
    category: "Local business",
    segment: "City rollout donor prospect",
  };
}

function formatSeed(seed) {
  const keys = [
    "cityKey",
    "cityName",
    "businessName",
    "neighborhood",
    "category",
    "segment",
    "sourceUrl",
    "website",
    "email",
    "contactPath",
    "contactPathType",
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

const fileNames = await fs.readdir(sourceDir);
const selectedArtifacts = [];

for (const cityKey of targetCityKeys) {
  const matchingFileNames = fileNames.filter(
    (fileName) =>
      fileName.startsWith(`${cityKey}__`) &&
      fileName.endsWith(".json") &&
      !fileName.includes("__summary"),
  );

  if (!matchingFileNames.length) {
    continue;
  }

  const artifacts = await Promise.all(
    matchingFileNames.map(async (fileName) => {
      const sourcePath = path.join(sourceDir, fileName);
      const parsed = JSON.parse(await fs.readFile(sourcePath, "utf8"));
      return {
        fileName,
        parsed,
        sourcePath,
        score: getArtifactScore(parsed),
      };
    }),
  );

  artifacts.sort((left, right) => {
    const scoreComparison = compareScores(left.score, right.score);
    if (scoreComparison !== 0) return scoreComparison;
    return left.fileName.localeCompare(right.fileName);
  });

  const qualifyingArtifacts = artifacts.filter((artifact) => {
    const intakeReadyCsv = artifact?.parsed?.row?.intakeReadyCsv?.trim() || "";
    const previewStatus = Number(artifact?.parsed?.row?.previewStatus || 0);
    return intakeReadyCsv.length > 0 && previewStatus === 200;
  });

  if (qualifyingArtifacts.length > 0) {
    selectedArtifacts.push(...qualifyingArtifacts);
    continue;
  }

  selectedArtifacts.push(artifacts[0]);
}

const sourceFiles = selectedArtifacts.map((artifact) => artifact.sourcePath);
const rawSeeds = [];

for (const artifact of selectedArtifacts) {
  const { parsed, sourcePath } = artifact;
  const row = parsed?.row;
  const intakeReadyCsv = row?.intakeReadyCsv;
  if (!row?.city || !intakeReadyCsv) {
    continue;
  }

  const [header, ...lines] = parseCsv(intakeReadyCsv);
  const keys = header.map((value) => value.trim());

  for (const values of lines) {
    const sourceRow = Object.fromEntries(keys.map((key, index) => [key, values[index] ?? ""]));
    const cityName = normalizeText(sourceRow.city || row.city);
    const categoryDetails = getCategoryDetails(sourceRow.prospectType, sourceRow.fitNotes);
    const sourceUrl = normalizeText(sourceRow.sourceUrl || sourceRow.website);
    const website = normalizeText(sourceRow.website || sourceRow.sourceUrl);
    const originalBusinessName = normalizeText(sourceRow.businessName);
    const businessName = normalizeBusinessName(originalBusinessName, {
      cityName,
      sourceUrl,
      website,
    });
    const email = normalizeText(sourceRow.email).toLowerCase();
    const phonePath = normalizePhone(sourceRow.phone);
    const contactPath = email
      ? `mailto:${email}`
      : phonePath || website || sourceUrl;
    const contactPathType = email
      ? "direct_email"
      : phonePath
        ? "phone_or_text"
        : "contact_page";
    const fitNotes = normalizeText(sourceRow.fitNotes);
    const sourceEvidence = normalizeText(sourceRow.sourceEvidence);
    const donorTitleNote =
      businessName && originalBusinessName && businessName !== originalBusinessName
        ? `Original donor title: ${originalBusinessName}.`
        : "";

    rawSeeds.push({
      cityKey: slugify(cityName),
      cityName,
      businessName,
      neighborhood: "",
      category: categoryDetails.category,
      segment: categoryDetails.segment,
      sourceUrl,
      website,
      email,
      contactPath,
      contactPathType,
      sourceProof: sourceEvidence || `Roam city-sourcing donor research from ${path.basename(sourcePath)}.`,
      notes: normalizeText(
        `Imported from Roam city-sourcing preview for local CityAtlas review only. ${fitNotes} ${donorTitleNote} Original donor next step: review trust and outreach before any send.`,
      ),
      contactConfidence: email ? "high" : phonePath ? "medium" : "low",
      donorSourceLabel: email
        ? "Roam city-sourcing donor (public business contact)"
        : phonePath
          ? "Roam city-sourcing donor (public phone path)"
          : "Roam city-sourcing donor (public business page)",
    });
  }
}

function normalizeMatchValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

function getReadinessRank(seed) {
  if (seed.email) return 2;
  if (seed.contactPath) return 1;
  return 0;
}

function getConfidenceRank(value) {
  switch (value) {
    case "high":
      return 2;
    case "medium":
      return 1;
    default:
      return 0;
  }
}

function chooseLonger(left, right) {
  const leftText = String(left || "");
  const rightText = String(right || "");
  if (!leftText) return rightText;
  if (!rightText) return leftText;
  return rightText.length > leftText.length ? rightText : leftText;
}

function joinUnique(left, right) {
  const parts = [left, right]
    .flatMap((value) => String(value || "").split(" | "))
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set(parts)].join(" | ");
}

function seedsMatch(left, right) {
  if (left.cityKey !== right.cityKey) return false;

  const leftUrl = normalizeMatchValue(left.sourceUrl || left.website);
  const rightUrl = normalizeMatchValue(right.sourceUrl || right.website);
  if (leftUrl && rightUrl && leftUrl === rightUrl) return true;

  const leftEmail = normalizeMatchValue(left.email);
  const rightEmail = normalizeMatchValue(right.email);
  if (leftEmail && rightEmail && leftEmail === rightEmail) return true;

  const leftName = normalizeMatchValue(left.businessName);
  const rightName = normalizeMatchValue(right.businessName);
  return Boolean(leftName && rightName && leftName === rightName);
}

function mergeSeed(current, next) {
  const nextIsBetter =
    getReadinessRank(next) > getReadinessRank(current)
    || (getReadinessRank(next) === getReadinessRank(current)
      && getConfidenceRank(next.contactConfidence) > getConfidenceRank(current.contactConfidence));

  return {
    ...current,
    ...(nextIsBetter ? next : {}),
    cityKey: current.cityKey,
    cityName: chooseLonger(current.cityName, next.cityName),
    businessName: chooseLonger(current.businessName, next.businessName),
    neighborhood: chooseLonger(current.neighborhood, next.neighborhood),
    category: chooseLonger(current.category, next.category),
    segment: chooseLonger(current.segment, next.segment),
    sourceUrl: chooseLonger(current.sourceUrl, next.sourceUrl),
    website: chooseLonger(current.website, next.website),
    email: chooseLonger(current.email, next.email),
    contactPath: chooseLonger(current.contactPath, next.contactPath),
    contactPathType: nextIsBetter ? next.contactPathType : current.contactPathType,
    sourceProof: joinUnique(current.sourceProof, next.sourceProof),
    notes: joinUnique(current.notes, next.notes),
    contactConfidence:
      getConfidenceRank(next.contactConfidence) > getConfidenceRank(current.contactConfidence)
        ? next.contactConfidence
        : current.contactConfidence,
    donorSourceLabel: chooseLonger(current.donorSourceLabel, next.donorSourceLabel),
  };
}

function dedupeSeeds(seeds) {
  const merged = [];

  for (const seed of seeds) {
    const existingIndex = merged.findIndex((current) => seedsMatch(current, seed));
    if (existingIndex === -1) {
      merged.push(seed);
      continue;
    }

    merged[existingIndex] = mergeSeed(merged[existingIndex], seed);
  }

  return merged.sort((left, right) => {
    const cityCompare = left.cityName.localeCompare(right.cityName);
    if (cityCompare !== 0) return cityCompare;
    return left.businessName.localeCompare(right.businessName);
  });
}

function isLikelyBusinessSeed(seed) {
  const businessName = normalizeText(seed.businessName);
  const sourceDomain = getSourceDomain(seed.sourceUrl || seed.website);

  if (!businessName) return false;
  if (blockedSourceDomains.has(sourceDomain)) return false;
  if (blockedBusinessNamePatterns.some((pattern) => pattern.test(businessName))) return false;
  if (comparisonListiclePattern.test(businessName) && !strongWellnessCuePattern.test(businessName)) {
    return false;
  }
  if (/口コミ|ランキング|比較|おすすめ/i.test(businessName)) {
    return false;
  }
  if (beautyNoisePattern.test(businessName) && !strongWellnessCuePattern.test(businessName)) {
    return false;
  }
  if (sourceDomain === "fresha.com" && isSuspiciousMarketplaceWellnessTitle(businessName)) {
    return false;
  }

  return true;
}

const acceptedSeeds = rawSeeds.filter(isLikelyBusinessSeed);
const allSeeds = dedupeSeeds(acceptedSeeds);

const fileContents = `// Generated by scripts/sync-roam-city-sourcing-seeds.mjs
// Sources:
${sourceFiles.map((sourcePath) => `// - ${path.relative(path.resolve(__dirname, ".."), sourcePath)}`).join("\n")}

export const roamCitySourcingSeeds = [
${allSeeds.map(formatSeed).join("\n")}
];
`;

await fs.writeFile(outputPath, fileContents, "utf8");

const byCity = allSeeds.reduce((accumulator, seed) => {
  accumulator[seed.cityKey] = (accumulator[seed.cityKey] || 0) + 1;
  return accumulator;
}, {});

console.log(
  JSON.stringify(
    {
      ok: true,
      outputPath,
      rawSeedCount: rawSeeds.length,
      acceptedSeedCount: acceptedSeeds.length,
      rejectedRowCount: rawSeeds.length - acceptedSeeds.length,
      seedCount: allSeeds.length,
      dedupedAwayCount: acceptedSeeds.length - allSeeds.length,
      artifactCount: selectedArtifacts.length,
      cityCount: Object.keys(byCity).length,
      byCity,
    },
    null,
    2,
  ),
);
