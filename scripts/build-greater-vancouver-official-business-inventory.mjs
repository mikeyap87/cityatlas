import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  GREATER_VANCOUVER_SOURCE_RUN_DATE,
  getGreaterVancouverInventoryReadySources,
} from "./lib/greater-vancouver-official-sources.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_CSV_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-business-inventory.csv",
);
const OUTPUT_SUMMARY_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-business-inventory-summary.json",
);
const LEGACY_OPERATOR_JSON_PATH = path.resolve(
  __dirname,
  "../public/operator/greaterVancouverOfficialBusinessInventory.json",
);
const OPERATOR_SUMMARY_PATH = path.resolve(
  __dirname,
  "../public/operator/greaterVancouverOfficialBusinessInventorySummary.json",
);
const USER_AGENT = "CityAtlas official metro inventory builder";

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getMappedFieldValue(attributes, mapping) {
  const fieldNames = Array.isArray(mapping) ? mapping : [mapping];
  for (const fieldName of fieldNames) {
    if (!fieldName) continue;
    const value = attributes[fieldName];
    if (value == null) continue;
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return "";
}

function buildStreetAddressFromParts(unit, house, street) {
  const unitLabel = normalizeText(unit);
  const houseLabel = normalizeText(house);
  const streetLabel = normalizeText(street);
  if (!unitLabel) {
    return normalizeText([houseLabel, streetLabel].filter(Boolean).join(" "));
  }
  return normalizeText([`Unit ${unitLabel}`, houseLabel, streetLabel].filter(Boolean).join(", "));
}

function inferPrimaryCategory(...values) {
  const combined = values.map((value) => normalizeText(value).toLowerCase()).join(" ");
  if (!combined) return "business";
  if (/restaurant|food|cafe|coffee|bakery|pizza|bar|eatery|deli|brew/.test(combined)) return "restaurant";
  if (/beauty|salon|spa|nail|lashes|hair|barber/.test(combined)) return "beauty";
  if (/vehicle|auto|automotive|tire|repair|detailing|wash/.test(combined)) return "automotive";
  if (/fitness|gym|yoga|pilates|training|sport/.test(combined)) return "fitness";
  if (/clinic|wellness|massage|physio|health|dental|medical|acupuncture|acupressure|chiropr/.test(combined)) {
    return "wellness";
  }
  if (/cleaning|maintenance|plumbing|electrical|hvac|contractor|renovation|lawn|handyman|roof|pest/.test(combined)) {
    return "home-services";
  }
  if (/hotel|lodging|hospitality|accommodation/.test(combined)) return "hospitality";
  if (/event|venue|wedding|banquet|party|studio|gallery|museum/.test(combined)) return "events";
  if (/retail|merchant|shop|store/.test(combined)) return "retail";
  return "business";
}

function getLatLon(source, feature) {
  const fieldMap = source.fieldMap;
  if (fieldMap.latitude && fieldMap.longitude) {
    const latitude = feature.attributes[fieldMap.latitude];
    const longitude = feature.attributes[fieldMap.longitude];
    if (latitude != null && longitude != null) {
      return {
        latitude: String(latitude),
        longitude: String(longitude),
      };
    }
  }

  if (feature.geometry?.y != null && feature.geometry?.x != null) {
    return {
      latitude: String(feature.geometry.y),
      longitude: String(feature.geometry.x),
    };
  }

  return { latitude: "", longitude: "" };
}

function parseLicenseYear(rawValue) {
  if (rawValue == null || rawValue === "") return "";
  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    return new Date(rawValue).toISOString().slice(0, 4);
  }
  const normalized = normalizeText(rawValue);
  if (/^\d{4}$/.test(normalized)) return normalized;
  const parsed = Date.parse(normalized);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString().slice(0, 4) : "";
}

function buildInventoryId(source, attributes) {
  const sourceId = normalizeText(attributes[source.fieldMap.id]);
  const businessName = getMappedFieldValue(attributes, source.fieldMap.businessName);
  return `${slugify(source.municipality)}-official-${slugify(sourceId || businessName || "row")}`;
}

function mapFeatureToInventoryRow(source, feature) {
  const attributes = feature.attributes ?? {};
  const fieldMap = source.fieldMap;
  const businessName = getMappedFieldValue(attributes, fieldMap.businessName);
  const businessType = getMappedFieldValue(attributes, fieldMap.businessType);
  const businessSubtype = getMappedFieldValue(attributes, fieldMap.businessSubtype);
  const localArea = getMappedFieldValue(attributes, fieldMap.localArea);
  const streetAddress = fieldMap.streetAddress
    ? getMappedFieldValue(attributes, fieldMap.streetAddress)
    : buildStreetAddressFromParts(
      getMappedFieldValue(attributes, fieldMap.addressUnit),
      getMappedFieldValue(attributes, fieldMap.addressHouse),
      getMappedFieldValue(attributes, fieldMap.addressStreet),
    );
  const postalCode = getMappedFieldValue(attributes, fieldMap.postalCode);
  const phone = getMappedFieldValue(attributes, fieldMap.phone);
  const email = getMappedFieldValue(attributes, fieldMap.email);
  const { latitude, longitude } = getLatLon(source, feature);

  return {
    inventoryId: buildInventoryId(source, attributes),
    sourceSystem: source.sourceSystem,
    sourceScope: source.sourceScope,
    sourceRecordId: normalizeText(attributes[fieldMap.id]),
    licenseYear: parseLicenseYear(fieldMap.approvedDate ? attributes[fieldMap.approvedDate] : ""),
    licenseStatus: source.sourceSystem === "surrey_business_directory"
      ? "active_directory"
      : "active_business_licence",
    businessName,
    businessTradeName: "",
    businessType,
    businessSubtype,
    categoryPrimary: inferPrimaryCategory(businessType, businessSubtype, businessName),
    categorySecondary: businessSubtype,
    cuisine: "",
    cityName: source.municipality,
    municipality: source.municipality,
    sourceCityRaw: source.municipality,
    localArea,
    streetAddress,
    postalCode,
    latitude,
    longitude,
    website: "",
    menuUrl: "",
    publicContactPath: "",
    publicContactType: "",
    email,
    phone,
    officialSourceUrl: source.datasetUrl,
    osmSourceUrl: "",
    verificationStatus: source.sourceSystem === "surrey_business_directory"
      ? "official_directory_only"
      : "official_licence_only",
    contactReadiness: "needs_research",
    outreachPriority: "",
    notes: normalizeText(
      `Imported from the official ${source.ownerLabel} municipal business dataset. Website, email, and public contact-path fields still need official-site verification before outreach or public business claims.`,
    ),
    lastVerifiedDate: GREATER_VANCOUVER_SOURCE_RUN_DATE,
  };
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

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": USER_AGENT,
    },
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status} ${response.statusText}: ${url}`);
  }

  return response.json();
}

function buildCountUrl(source) {
  const url = new URL(`${source.datasetUrl}/query`);
  url.searchParams.set("where", source.queryWhere);
  url.searchParams.set("returnCountOnly", "true");
  url.searchParams.set("f", "json");
  return url.toString();
}

function buildPageUrl(source, offset) {
  const url = new URL(`${source.datasetUrl}/query`);
  const outFields = Array.from(
    new Set(
      Object.values(source.fieldMap)
        .flat()
        .filter(Boolean),
    ),
  );

  url.searchParams.set("where", source.queryWhere);
  url.searchParams.set("outFields", outFields.join(","));
  url.searchParams.set("resultOffset", String(offset));
  url.searchParams.set("resultRecordCount", String(source.pageSize));
  url.searchParams.set("orderByFields", `${source.fieldMap.id} asc`);
  url.searchParams.set("returnGeometry", source.returnGeometry ? "true" : "false");
  if (source.returnGeometry) {
    url.searchParams.set("outSR", "4326");
  }
  url.searchParams.set("f", "json");
  return url.toString();
}

async function fetchSourceFeatures(source) {
  const countPayload = await fetchJson(buildCountUrl(source));
  const totalCount = Number(countPayload.count ?? 0);
  const features = [];

  for (let offset = 0; offset < totalCount;) {
    const pagePayload = await fetchJson(buildPageUrl(source, offset));
    if (pagePayload.error) {
      throw new Error(
        `ArcGIS query error for ${source.ownerLabel}: ${JSON.stringify(pagePayload.error)}`,
      );
    }
    const pageFeatures = Array.isArray(pagePayload.features) ? pagePayload.features : [];
    features.push(...pageFeatures);
    if (pageFeatures.length === 0) {
      break;
    }
    offset += pageFeatures.length;
  }

  return {
    totalCount,
    features,
  };
}

function buildSummary(rows, sourceResults) {
  const byMunicipality = {};
  const byCategoryPrimary = {};

  for (const row of rows) {
    byMunicipality[row.municipality] = (byMunicipality[row.municipality] ?? 0) + 1;
    byCategoryPrimary[row.categoryPrimary] = (byCategoryPrimary[row.categoryPrimary] ?? 0) + 1;
  }

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    sourceScope: "greater_vancouver_verified_official_business_inventory",
    includedMunicipalities: sourceResults.map((result) => result.municipality),
    recordCount: rows.length,
    byMunicipality,
    byCategoryPrimary,
    sourceResults: sourceResults.map((result) => ({
      municipality: result.municipality,
      sourceLabel: result.ownerLabel,
      liveCount: result.liveCount,
      fetchedRows: result.fetchedRows,
      datasetUrl: result.datasetUrl,
    })),
    outputFiles: {
      csv: OUTPUT_CSV_PATH,
      summary: OUTPUT_SUMMARY_PATH,
      operatorSummary: OPERATOR_SUMMARY_PATH,
      operatorJsonByMunicipality: Object.fromEntries(
        sourceResults.map((result) => [
          result.municipality,
          getOperatorMunicipalityJsonPath(result.municipality),
        ]),
      ),
    },
  };
}

function buildOperatorInventoryRow(row) {
  return {
    inventoryId: row.inventoryId,
    sourceSystem: row.sourceSystem,
    sourceScope: row.sourceScope,
    sourceRecordId: row.sourceRecordId,
    businessName: row.businessName,
    businessType: row.businessType,
    businessSubtype: row.businessSubtype,
    categoryPrimary: row.categoryPrimary,
    cityName: row.cityName,
    municipality: row.municipality,
    localArea: row.localArea,
    streetAddress: row.streetAddress,
    postalCode: row.postalCode,
    email: row.email,
    phone: row.phone,
    officialSourceUrl: row.officialSourceUrl,
    verificationStatus: row.verificationStatus,
    contactReadiness: row.contactReadiness,
    notes: row.notes,
    lastVerifiedDate: row.lastVerifiedDate,
  };
}

function buildMunicipalityFileSlug(municipality) {
  return slugify(municipality);
}

function getOperatorMunicipalityJsonPath(municipality) {
  return path.resolve(
    __dirname,
    `../public/operator/greaterVancouverOfficialBusinessInventory-${buildMunicipalityFileSlug(municipality)}.json`,
  );
}

async function main() {
  const sources = getGreaterVancouverInventoryReadySources();
  const sourceResults = [];
  const rows = [];

  for (const source of sources) {
    const result = await fetchSourceFeatures(source);
    const sourceRows = result.features
      .map((feature) => mapFeatureToInventoryRow(source, feature))
      .filter((row) => row.businessName);

    sourceResults.push({
      municipality: source.municipality,
      ownerLabel: source.ownerLabel,
      liveCount: result.totalCount,
      fetchedRows: sourceRows.length,
      datasetUrl: source.datasetUrl,
    });
    rows.push(...sourceRows);
  }

  rows.sort(
    (left, right) =>
      left.municipality.localeCompare(right.municipality)
      || left.businessType.localeCompare(right.businessType)
      || left.localArea.localeCompare(right.localArea)
      || left.businessName.localeCompare(right.businessName),
  );

  const summary = buildSummary(rows, sourceResults);
  const operatorRowsByMunicipality = Object.fromEntries(
    sourceResults.map((result) => [result.municipality, []]),
  );
  for (const row of rows) {
    operatorRowsByMunicipality[row.municipality].push(buildOperatorInventoryRow(row));
  }
  const operatorSummary = {
    ...summary,
    municipalityFiles: Object.fromEntries(
      sourceResults.map((result) => [
        result.municipality,
        `/operator/greaterVancouverOfficialBusinessInventory-${buildMunicipalityFileSlug(result.municipality)}.json`,
      ]),
    ),
  };

  await Promise.all([
    fs.writeFile(OUTPUT_CSV_PATH, buildCsv(rows), "utf8"),
    fs.writeFile(OUTPUT_SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
    fs.writeFile(OPERATOR_SUMMARY_PATH, JSON.stringify(operatorSummary), "utf8"),
    fs.rm(LEGACY_OPERATOR_JSON_PATH, { force: true }),
    ...Object.entries(operatorRowsByMunicipality).map(([municipality, municipalityRows]) =>
      fs.writeFile(
        getOperatorMunicipalityJsonPath(municipality),
        JSON.stringify(municipalityRows),
        "utf8",
      )
    ),
  ]);

  process.stdout.write(`${JSON.stringify(operatorSummary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
