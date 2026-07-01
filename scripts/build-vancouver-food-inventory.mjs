import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE =
  "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/business-licences/records";
const DATASET_URL = "https://opendata.vancouver.ca/explore/dataset/business-licences/";
const OUTPUT_CSV = path.resolve(
  __dirname,
  "../output/growth/vancouver-current-year-food-inventory.csv",
);
const OUTPUT_SUMMARY = path.resolve(
  __dirname,
  "../output/growth/vancouver-current-year-food-inventory-summary.json",
);
const OUTPUT_OPERATOR_JSON = path.resolve(
  __dirname,
  "../public/operator/vancouverOfficialFoodInventory.json",
);
const OUTPUT_OPERATOR_SUMMARY_JSON = path.resolve(
  __dirname,
  "../public/operator/vancouverOfficialFoodInventorySummary.json",
);
const PAGE_SIZE = 100;
const FOOD_TYPES = ["Restaurant", "Limited Service Food Establishment"];
const RUN_DATE = "2026-06-21";
const USE_EXISTING_CSV = process.argv.includes("--from-existing-csv");

function buildWhereClause() {
  return `status="Issued" and folderyear="26" and businesstype in ("${FOOD_TYPES.join('","')}")`;
}

function buildPageUrl(offset) {
  const url = new URL(API_BASE);
  url.searchParams.set("where", buildWhereClause());
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order_by", "city asc, localarea asc, businesstype asc, businessname asc");
  return url.toString();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "CityAtlas local inventory builder",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : -1;
}

function choosePreferredRecord(existing, incoming) {
  if (!existing) return incoming;

  const existingRevision = toNumber(existing.licencerevisionnumber);
  const incomingRevision = toNumber(incoming.licencerevisionnumber);
  if (incomingRevision !== existingRevision) {
    return incomingRevision > existingRevision ? incoming : existing;
  }

  const existingIssued = Date.parse(existing.issueddate || "");
  const incomingIssued = Date.parse(incoming.issueddate || "");
  if (Number.isFinite(existingIssued) && Number.isFinite(incomingIssued) && incomingIssued !== existingIssued) {
    return incomingIssued > existingIssued ? incoming : existing;
  }

  return existing;
}

function dedupeRecords(records) {
  const byLicense = new Map();

  for (const record of records) {
    const key =
      record.licencenumber ||
      [record.businessname, record.house, record.street, record.folderyear].filter(Boolean).join("|");
    byLicense.set(key, choosePreferredRecord(byLicense.get(key), record));
  }

  return Array.from(byLicense.values());
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildStreetAddress(record) {
  const unit = normalizeText(record.unit);
  const unitType = normalizeText(record.unittype);
  const unitLabel = unit ? normalizeText([unitType, unit].filter(Boolean).join(" ")) : "";
  return normalizeText([unitLabel, record.house, record.street].filter(Boolean).join(" "));
}

function getLatLon(record) {
  if (record.geo_point_2d?.lat != null && record.geo_point_2d?.lon != null) {
    return {
      latitude: String(record.geo_point_2d.lat),
      longitude: String(record.geo_point_2d.lon),
    };
  }

  const coordinates = record.geom?.geometry?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    return {
      latitude: String(coordinates[1]),
      longitude: String(coordinates[0]),
    };
  }

  return { latitude: "", longitude: "" };
}

function mapCategoryPrimary(businesstype) {
  if (businesstype === "Restaurant") return "restaurant";
  if (businesstype === "Limited Service Food Establishment") return "limited-service-food";
  return "";
}

function buildInventoryId(record) {
  const base = normalizeText(record.licencenumber || record.licencersn || record.businessname)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `vancouver-food-${base}`;
}

function toInventoryRow(record) {
  const { latitude, longitude } = getLatLon(record);
  return {
    inventoryId: buildInventoryId(record),
    sourceSystem: "vancouver_business_licences",
    sourceScope: "vancouver_food_issued_2026",
    sourceRecordId: normalizeText(
      [record.folderyear, record.licencersn, record.licencerevisionnumber].filter(Boolean).join("-"),
    ),
    licenseYear: normalizeText(record.folderyear),
    licenseStatus: normalizeText(record.status),
    businessName: normalizeText(record.businessname),
    businessTradeName: normalizeText(record.businesstradename),
    businessType: normalizeText(record.businesstype),
    businessSubtype: normalizeText(record.businesssubtype),
    categoryPrimary: mapCategoryPrimary(record.businesstype),
    categorySecondary: "",
    cuisine: "",
    cityName: "Vancouver",
    municipality: "Vancouver",
    sourceCityRaw: normalizeText(record.city),
    localArea: normalizeText(record.localarea),
    streetAddress: buildStreetAddress(record),
    postalCode: normalizeText(record.postalcode),
    latitude,
    longitude,
    website: "",
    menuUrl: "",
    publicContactPath: "",
    publicContactType: "",
    email: "",
    phone: "",
    officialSourceUrl: DATASET_URL,
    osmSourceUrl: "",
    verificationStatus: "official_licence_only",
    contactReadiness: "needs_research",
    outreachPriority: "",
    notes:
      "Imported from the official City of Vancouver business licences dataset. Website, cuisine, and contact fields still need official-site verification.",
    lastVerifiedDate: RUN_DATE,
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

function compareRows(left, right) {
  return (
    left.cityName.localeCompare(right.cityName) ||
    left.localArea.localeCompare(right.localArea) ||
    left.businessType.localeCompare(right.businessType) ||
    left.businessName.localeCompare(right.businessName)
  );
}

function countBy(items, getKey) {
  const counts = new Map();
  for (const item of items) {
    const key = normalizeText(getKey(item)) || "Unknown";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Object.fromEntries(
    Array.from(counts.entries()).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])),
  );
}

async function fetchAllRecords() {
  const records = [];
  let offset = 0;
  let totalCount = null;

  while (true) {
    const payload = await fetchJson(buildPageUrl(offset));
    if (totalCount == null) {
      totalCount = Number(payload.total_count || 0);
    }

    const page = Array.isArray(payload.results) ? payload.results : [];
    records.push(...page);

    if (page.length < PAGE_SIZE || records.length >= totalCount) {
      return { records, totalCount };
    }

    offset += PAGE_SIZE;
  }
}

async function loadInventoryRows() {
  if (USE_EXISTING_CSV) {
    const existingCsv = await fs.readFile(OUTPUT_CSV, "utf8");
    const inventoryRows = parseCsv(existingCsv).sort(compareRows);
    return {
      mode: "from_existing_csv",
      fetchedRecords: inventoryRows.length,
      reportedTotalCount: inventoryRows.length,
      dedupedRows: inventoryRows.length,
      inventoryRows,
    };
  }

  const { records, totalCount } = await fetchAllRecords();
  const deduped = dedupeRecords(records);
  const inventoryRows = deduped.map(toInventoryRow).sort(compareRows);
  return {
    mode: "live_api",
    fetchedRecords: records.length,
    reportedTotalCount: totalCount,
    dedupedRows: inventoryRows.length,
    inventoryRows,
  };
}

async function main() {
  const inventoryLoad = await loadInventoryRows();
  const inventoryRows = inventoryLoad.inventoryRows;
  const csv = buildCsv(inventoryRows);
  const operatorSummary = {
    generatedAt: `${RUN_DATE}T00:00:00-07:00`,
    recordCount: inventoryRows.length,
    byBusinessType: countBy(inventoryRows, (row) => row.businessType),
    byLocalArea: countBy(inventoryRows, (row) => row.localArea),
    byCity: countBy(inventoryRows, (row) => row.cityName),
    sourceScope: "vancouver_food_issued_2026",
  };

  const summary = {
    generatedAt: `${RUN_DATE}T00:00:00-07:00`,
    source: {
      datasetUrl: DATASET_URL,
      apiBase: API_BASE,
      mode: inventoryLoad.mode,
    },
    filters: {
      status: "Issued",
      folderyear: "26",
      businesstype: FOOD_TYPES,
    },
    counts: {
      fetchedRecords: inventoryLoad.fetchedRecords,
      reportedTotalCount: inventoryLoad.reportedTotalCount,
      dedupedRows: inventoryLoad.dedupedRows,
    },
    breakdowns: {
      byBusinessType: countBy(inventoryRows, (row) => row.businessType),
      byLocalArea: countBy(inventoryRows, (row) => row.localArea),
      byCity: countBy(inventoryRows, (row) => row.cityName),
      bySourceCityRaw: countBy(inventoryRows, (row) => row.sourceCityRaw),
    },
    outputFiles: {
      csv: OUTPUT_CSV,
      summary: OUTPUT_SUMMARY,
      operatorJson: OUTPUT_OPERATOR_JSON,
      operatorSummaryJson: OUTPUT_OPERATOR_SUMMARY_JSON,
    },
  };

  await fs.mkdir(path.dirname(OUTPUT_OPERATOR_JSON), { recursive: true });
  await fs.writeFile(OUTPUT_CSV, csv, "utf8");
  await fs.writeFile(OUTPUT_SUMMARY, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  await fs.writeFile(OUTPUT_OPERATOR_JSON, `${JSON.stringify(inventoryRows, null, 2)}\n`, "utf8");
  await fs.writeFile(
    OUTPUT_OPERATOR_SUMMARY_JSON,
    `${JSON.stringify(operatorSummary, null, 2)}\n`,
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        sourceMode: inventoryLoad.mode,
        fetchedRecords: inventoryLoad.fetchedRecords,
        dedupedRows: inventoryLoad.dedupedRows,
        csv: OUTPUT_CSV,
        summary: OUTPUT_SUMMARY,
        operatorJson: OUTPUT_OPERATOR_JSON,
        operatorSummaryJson: OUTPUT_OPERATOR_SUMMARY_JSON,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
