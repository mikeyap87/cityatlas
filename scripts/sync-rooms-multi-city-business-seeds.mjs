import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFiles = [
  "../../rooms/data/outreach/rooms-toronto-host-space-draft-packet-2026-06-13.csv",
  "../../rooms/data/outreach/rooms-los-angeles-host-space-draft-packet-2026-06-13.csv",
  "../../rooms/data/outreach/rooms-new-york-host-space-draft-packet-2026-06-13.csv",
  "../../rooms/data/outreach/rooms-miami-host-space-draft-packet-2026-06-13.csv",
  "../../rooms/data/outreach/rooms-london-host-space-draft-packet-2026-06-13.csv",
  "../../rooms/data/outreach/rooms-tokyo-host-space-draft-packet-2026-06-13.csv",
  "../../rooms/data/outreach/rooms-dubai-host-space-draft-packet-2026-06-13.csv",
].map((relativePath) => path.resolve(__dirname, relativePath));

const outputPath = path.resolve(__dirname, "../src/data/roomsMultiCityBusinessSeeds.ts");
const allowedSecondaryListingLocalitiesByCity = {
  toronto: new Set(["toronto-on", "north-york-on"]),
  "los-angeles": new Set(["los-angeles-ca"]),
  miami: new Set(["miami-fl", "miami-beach-fl"]),
  "new-york": new Set(["new-york-ny", "brooklyn-ny", "staten-island-ny"]),
};
const freeEmailDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "icloud.com",
  "me.com",
  "outlook.com",
  "yahoo.com",
  "yahoo.ca",
  "yahoo.co.uk",
]);

const categoryMap = {
  cultural_space: {
    category: "Cultural space",
    segment: "Venue and cultural partner",
  },
  restaurant_bar: {
    category: "Restaurant / bar",
    segment: "Hospitality and hosted-visit partner",
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
  coworking_space: {
    category: "Coworking space",
    segment: "Founder event and gathering partner",
  },
  host_space: {
    category: "Host space",
    segment: "Community and hosted-visit partner",
  },
  podcast_or_studio: {
    category: "Studio",
    segment: "Creator salon and private-event partner",
  },
  studio_space: {
    category: "Studio",
    segment: "Creator salon and private-event partner",
  },
  entertainment_venue: {
    category: "Entertainment venue",
    segment: "Atmosphere-led event partner",
  },
  experience_space: {
    category: "Experience space",
    segment: "Experience-led local partner",
  },
  community_space: {
    category: "Community space",
    segment: "Community and local-gathering partner",
  },
};

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

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSourceDomain(url) {
  try {
    return new URL(String(url)).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function getRegistrableDomain(domainOrUrl) {
  const hostname = String(domainOrUrl || "").includes("://")
    ? getSourceDomain(domainOrUrl)
    : String(domainOrUrl || "").replace(/^www\./, "").toLowerCase();
  const parts = hostname.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return hostname;
  }

  const last = parts.at(-1) || "";
  const secondLast = parts.at(-2) || "";
  if (last.length === 2 && secondLast.length <= 3 && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  return parts.slice(-2).join(".");
}

function isFreeEmailDomain(domain) {
  return freeEmailDomains.has(String(domain || "").toLowerCase());
}

function getSecondaryListingLocality(url) {
  try {
    const parsed = new URL(String(url));
    if (parsed.hostname.replace(/^www\./, "").toLowerCase() !== "eventective.com") {
      return "";
    }

    const [segment] = parsed.pathname
      .split("/")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

    return /^[a-z-]+$/.test(segment || "") ? segment : "";
  } catch {
    return "";
  }
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

function normalizeRow(row, packetName) {
  const details = categoryMap[row.category] || {
    category: "Local business",
    segment: "CityAtlas donor business partner",
  };
  const officialUrl = row.officialUrl || row.sourceUrl || "";
  const sourceUrl = row.sourceUrl || officialUrl;
  const sourcedFromSecondaryListing = Boolean(sourceUrl && officialUrl && sourceUrl !== officialUrl);
  const cityName = row.city.trim();
  const email = row.to.toLowerCase();
  const emailDomain = email.split("@")[1] || "";
  const officialRegistrableDomain = getRegistrableDomain(officialUrl);
  const emailRegistrableDomain = getRegistrableDomain(emailDomain);
  const hasEmailDomainMismatch =
    Boolean(email && emailRegistrableDomain && officialRegistrableDomain) &&
    !isFreeEmailDomain(emailDomain) &&
    emailRegistrableDomain !== officialRegistrableDomain;
  const keptEmail = hasEmailDomainMismatch ? "" : email;
  const contactPath = keptEmail ? "" : officialUrl;
  const contactPathType = keptEmail ? "" : "contact_page";

  return {
    cityKey: slugify(cityName),
    cityName,
    businessName: row.name,
    neighborhood: "",
    category: details.category,
    segment: details.segment,
    sourceUrl: officialUrl,
    website: officialUrl,
    email: keptEmail,
    contactPath,
    contactPathType,
    sourceProof: sourcedFromSecondaryListing
      ? `Rooms donor research from ${packetName}. Official site is linked, but the donor packet sourced this contact through a secondary public listing that still needs re-verification before any send.${hasEmailDomainMismatch ? ` Imported custom-domain email ${email} did not match the official site domain ${officialRegistrableDomain}, so CityAtlas downgraded this row to official-site contact-path review.` : ""}`
      : `Rooms donor research from ${packetName} using the official public business source.${hasEmailDomainMismatch ? ` Imported custom-domain email ${email} did not match the official site domain ${officialRegistrableDomain}, so CityAtlas downgraded this row to official-site contact-path review.` : ""}`,
    notes: sourcedFromSecondaryListing
      ? `Imported from ${packetName} for local CityAtlas review only. The original donor packet paired this row with a secondary public listing (${sourceUrl}) and marked it for manual review before any send.${hasEmailDomainMismatch ? ` The imported custom-domain email ${email} did not match the official site domain, so this row stays contact-path review until a human re-verifies the right inbox.` : ""} Original donor blocker: ${row.sendBlockers}`
      : `Imported from ${packetName} for local CityAtlas review only.${hasEmailDomainMismatch ? ` The imported custom-domain email ${email} did not match the official site domain, so this row stays contact-path review until a human re-verifies the right inbox.` : ""} Original donor blocker: ${row.sendBlockers}`,
    contactConfidence: hasEmailDomainMismatch
      ? "low"
      : sourcedFromSecondaryListing
        ? "medium"
        : "high",
    donorSourceLabel: sourcedFromSecondaryListing
      ? "Rooms multi-city donor (official site plus secondary public listing)"
      : "Rooms multi-city donor (official public source)",
    _emailDomainMismatch: hasEmailDomainMismatch,
  };
}

function shouldKeepRow(seed, { sourceUrl, officialUrl }) {
  if (!sourceUrl || sourceUrl === officialUrl) {
    return { keep: true, reason: "" };
  }

  if (getSourceDomain(sourceUrl) !== "eventective.com") {
    return { keep: true, reason: "" };
  }

  const listingLocality = getSecondaryListingLocality(sourceUrl);
  if (!listingLocality) {
    return {
      keep: false,
      reason: "secondaryListingMissingLocality",
    };
  }

  const allowedLocalities = allowedSecondaryListingLocalitiesByCity[seed.cityKey];
  if (!allowedLocalities) {
    return { keep: true, reason: "" };
  }

  if (!allowedLocalities.has(listingLocality)) {
    return {
      keep: false,
      reason: "secondaryListingCityMismatch",
    };
  }

  return { keep: true, reason: "" };
}

const allSeeds = [];
const counters = {
  kept: 0,
  secondaryListingCityMismatch: 0,
  secondaryListingMissingLocality: 0,
  emailDomainMismatch: 0,
};

for (const sourcePath of sourceFiles) {
  const csv = await fs.readFile(sourcePath, "utf8");
  const [header, ...rows] = parseCsv(csv);
  const keys = header.map((value) => value.trim());
  const packetName = `the Rooms reviewed ${path.basename(sourcePath, ".csv").replaceAll("-", " ")}`;
  const seeds = rows.flatMap((values) => {
    const row = Object.fromEntries(keys.map((key, index) => [key, values[index] ?? ""]));
    const normalized = normalizeRow(row, packetName);
    const decision = shouldKeepRow(normalized, {
      sourceUrl: row.sourceUrl || "",
      officialUrl: row.officialUrl || row.sourceUrl || "",
    });

    if (!decision.keep) {
      counters[decision.reason] += 1;
      return [];
    }

    if (normalized._emailDomainMismatch) {
      counters.emailDomainMismatch += 1;
    }

    counters.kept += 1;
    return [normalized];
  });

  allSeeds.push(...seeds);
}

const fileContents = `// Generated by scripts/sync-rooms-multi-city-business-seeds.mjs
// Sources:
${sourceFiles.map((sourcePath) => `// - ${path.relative(path.resolve(__dirname, ".."), sourcePath)}`).join("\n")}

export const roomsMultiCityBusinessSeeds = [
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
      seedCount: allSeeds.length,
      cityCount: Object.keys(byCity).length,
      byCity,
      counters,
    },
    null,
    2,
  ),
);
