import type {
  BusinessInventoryRecord,
  BusinessInventorySummary,
  BusinessProspect,
} from "../types";
import type { BusinessProspectImportInput } from "./cityGrowth";
import { createBusinessProspectsFromImportInputs } from "./cityGrowth.ts";
import { shouldTreatProspectAsPartnerAnchor } from "./businessProspectRole.ts";

const OFFICIAL_VANCOUVER_FOOD_SOURCE_LABEL =
  "Official Vancouver business licence inventory";
const OFFICIAL_VANCOUVER_SERVICE_SOURCE_LABEL =
  "Official Vancouver service business inventory";
const OFFICIAL_GREATER_VANCOUVER_SOURCE_LABEL =
  "Official Greater Vancouver business inventory";
const REVIEWED_SERVICE_SOURCE_LABEL = "CityAtlas reviewed service business inventory";
const OFFICIAL_METRO_PRIORITY_CATEGORY_PRIMARY = new Set([
  "restaurant",
  "beauty",
  "wellness",
  "fitness",
  "hospitality",
  "events",
  "automotive",
  "home-services",
  "retail",
]);
const FOOD_CATEGORY_PATTERNS = [
  /restaurant/i,
  /limited service food/i,
  /cafe/i,
  /coffee/i,
  /bar/i,
  /bakery/i,
  /food/i,
  /brew/i,
  /bistro/i,
];
const OFFICIAL_METRO_HOLDOUT_PATTERNS = [
  /adult services|body rub|escort/i,
  /house rental|short term rental|vacation rental|airbnb/i,
  /financial institutions|bank|credit union|money mart|payday/i,
  /government|public school|private school|college|university|church|temple|mosque|religious/i,
];
const OFFICIAL_METRO_REVIEW_PATTERNS = [
  /home-based|business - non resident|non resident|mobile business/i,
  /inter-municipal business licence|imbl/i,
  /office - general|consultant|professional practitioner/i,
  /warehouse|wholesale|manufacturer|manufacturers|industrial services|mail order|trucking|cartage/i,
  /general services|sales\b|unknown/i,
  /contractor/i,
];
const OFFICIAL_METRO_PRIORITY_PATTERNS = [
  /restaurant|cafe|coffee|bakery|brew|bistro|pub|bar\b/i,
  /salon|spa|massage|esthetician|barber|nail|personal service(?!.*adult)/i,
  /fitness|gym|yoga|pilates|wellness|recovery/i,
  /hotel|inn|gallery|museum|venue|event/i,
  /auto repair|repair shop|detailing|car wash|tire|mechanic|automotive/i,
  /cleaning|janitorial|plumbing|electrical|pest|landscap/i,
  /florist|pet groom|retail trader|retail merchant/i,
];

export type OfficialMetroPartnerFitTier = "priority" | "review" | "holdout";

export type OfficialMetroPartnerFit = {
  tier: OfficialMetroPartnerFitTier;
  reason: string;
  score: number;
  flags: string[];
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function isFoodLikeLabel(value: string) {
  return FOOD_CATEGORY_PATTERNS.some((pattern) => pattern.test(value));
}

function mapServiceCategoryPrimary(category: string, segment: string) {
  const categoryValue = normalizeText(category);
  const segmentValue = normalizeText(segment);
  const combined = `${categoryValue} ${segmentValue}`.trim();

  if (/beauty|salon|nail/.test(combined)) return "beauty";
  if (/vehicle|detail|wash|automotive|mechanic/.test(combined)) return "automotive";
  if (/repair|maintenance|cleaning|home service/.test(combined)) return "home-services";
  if (/fitness|sport/.test(combined)) return "fitness";
  if (/hotel|hospitality|concierge|guest/.test(combined)) return "hospitality";
  if (/wellness|spa|massage|fitness|recovery/.test(combined)) return "wellness";
  if (/event|celebration|production/.test(combined)) return "events";
  if (/venue|cultural|museum|gallery|entertainment|host space|club/.test(combined)) {
    return "venue";
  }
  if (/studio|creator|salon/.test(combined)) return "studio";
  if (/coworking/.test(combined)) return "coworking";
  if (/community/.test(combined)) return "community";
  return "service-business";
}

function isBlockedServiceCategory(category: string, segment: string) {
  const combined = `${normalizeText(category)} ${normalizeText(segment)}`.trim();
  return /college|educational|school|cafeteria|golf|frozen food/.test(combined);
}

function isSupportedServiceCategory(category: string, segment: string) {
  const combined = `${normalizeText(category)} ${normalizeText(segment)}`.trim();

  return /hotel|hospitality|concierge|guest|wellness|spa|massage|fitness|sport|recovery|event|celebration|production|venue|cultural|museum|gallery|entertainment|host space|club|studio|creator|salon|beauty|coworking|community|caterer|clinic|repair|maintenance|cleaning|detailing|vehicle|wash|automotive|mechanic|home service|mobile service/.test(
    combined,
  );
}

function getServiceProspectScore(prospect: BusinessProspect) {
  const readiness =
    prospect.contactReadiness === "email_ready"
      ? 30
      : prospect.contactReadiness === "contact_path_ready"
        ? 18
        : 4;
  const confidence =
    prospect.contactConfidence === "high"
      ? 12
      : prospect.contactConfidence === "medium"
        ? 7
        : 2;
  const warmth =
    prospect.relationshipWarmth === "high"
      ? 7
      : prospect.relationshipWarmth === "medium"
        ? 4
      : prospect.relationshipWarmth === "low"
        ? 2
        : 1;
  const approval =
    prospect.approvalStatus === "owner_approved"
      ? 6
      : prospect.approvalStatus === "ready_for_owner_review"
        ? 4
        : 1;
  return readiness + confidence + warmth + approval;
}

function choosePreferredServiceProspect(existing: BusinessProspect | undefined, incoming: BusinessProspect) {
  if (!existing) return incoming;

  const existingScore = getServiceProspectScore(existing);
  const incomingScore = getServiceProspectScore(incoming);
  if (incomingScore !== existingScore) {
    return incomingScore > existingScore ? incoming : existing;
  }

  const existingUpdated = Date.parse(existing.lastUpdatedAt || "");
  const incomingUpdated = Date.parse(incoming.lastUpdatedAt || "");
  if (Number.isFinite(existingUpdated) && Number.isFinite(incomingUpdated) && incomingUpdated !== existingUpdated) {
    return incomingUpdated > existingUpdated ? incoming : existing;
  }

  return existing;
}

function buildServiceInventoryKey(prospect: BusinessProspect) {
  return [
    normalizeText(prospect.cityName),
    normalizeText(prospect.businessName),
    normalizeText(prospect.website || prospect.sourceUrl || prospect.id),
  ].join("|");
}

function buildServiceInventoryId(prospect: BusinessProspect) {
  return `cityatlas-service-${prospect.id}`;
}

function getServiceVerificationStatus(prospect: BusinessProspect) {
  if (prospect.contactConfidence === "high") {
    return "reviewed_public_contact_path";
  }
  if (prospect.contactConfidence === "medium") {
    return "official_source_needs_contact_review";
  }
  return "needs_manual_review";
}

function getServiceLastVerifiedDate(prospect: BusinessProspect) {
  const parsed = Date.parse(prospect.lastUpdatedAt || "");
  if (!Number.isFinite(parsed)) return "";
  return new Date(parsed).toISOString().slice(0, 10);
}

function isReviewedServiceInventoryRecord(record: BusinessInventoryRecord) {
  return record.sourceSystem === "cityatlas_service_partner_inventory";
}

function isOfficialServiceInventoryRecord(record: BusinessInventoryRecord) {
  return record.sourceSystem === "vancouver_business_licences"
    && record.sourceScope === "vancouver_services_issued_2026";
}

function isOfficialFoodInventoryRecord(record: BusinessInventoryRecord) {
  return record.sourceSystem === "vancouver_business_licences"
    && record.sourceScope === "vancouver_food_issued_2026";
}

function isOfficialMetroInventoryRecord(record: BusinessInventoryRecord) {
  return record.sourceSystem !== "cityatlas_service_partner_inventory"
    && record.sourceSystem !== "vancouver_business_licences";
}

function buildOfficialMetroPartnerFitText(record: BusinessInventoryRecord) {
  return normalizeText(
    [
      record.businessName,
      record.businessTradeName,
      record.businessType,
      record.businessSubtype,
      record.categoryPrimary,
      record.categorySecondary,
      record.localArea,
      record.streetAddress,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function buildOfficialMetroPartnerFitFlags(text: string) {
  const flags: string[] = [];

  if (/adult services|body rub|escort/i.test(text)) flags.push("sensitive");
  if (/house rental|short term rental|vacation rental|airbnb/i.test(text)) {
    flags.push("rental");
  }
  if (/financial institutions|bank|credit union|money mart|payday/i.test(text)) {
    flags.push("finance");
  }
  if (/home-based|business - non resident|non resident|mobile business/i.test(text)) {
    flags.push("offsite_or_mobile");
  }
  if (/inter-municipal business licence|imbl/i.test(text)) {
    flags.push("intermunicipal");
  }
  if (/office - general|consultant|professional practitioner/i.test(text)) {
    flags.push("office_or_professional");
  }
  if (/warehouse|wholesale|manufacturer|manufacturers|industrial services|mail order|trucking|cartage/i.test(text)) {
    flags.push("backoffice_or_industrial");
  }
  if (/government|public school|private school|college|university|church|temple|mosque|religious/i.test(text)) {
    flags.push("institutional");
  }
  if (/contractor/i.test(text)) flags.push("contractor");

  return flags;
}

export function getOfficialMetroPartnerFit(record: BusinessInventoryRecord): OfficialMetroPartnerFit {
  if (!isOfficialMetroInventoryRecord(record)) {
    return {
      tier: "review",
      reason: "Not part of the official Greater Vancouver inventory lane.",
      score: 0,
      flags: [],
    };
  }

  const text = buildOfficialMetroPartnerFitText(record);
  const flags = buildOfficialMetroPartnerFitFlags(text);
  const isHoldout = OFFICIAL_METRO_HOLDOUT_PATTERNS.some((pattern) => pattern.test(text));
  const needsReview = OFFICIAL_METRO_REVIEW_PATTERNS.some((pattern) => pattern.test(text));
  const looksPriority =
    OFFICIAL_METRO_PRIORITY_CATEGORY_PRIMARY.has(record.categoryPrimary)
    || OFFICIAL_METRO_PRIORITY_PATTERNS.some((pattern) => pattern.test(text));

  if (isHoldout) {
    return {
      tier: "holdout",
      reason:
        "Low-fit or sensitive licence class for first-pass partnership outreach. Keep it out of the default shortlist.",
      score: 25,
      flags,
    };
  }

  if (looksPriority && !needsReview) {
    return {
      tier: "priority",
      reason:
        "Likely public-facing consumer business type and a cleaner first-pass partnership candidate.",
      score:
        200
        + (record.email ? 25 : 0)
        + (record.phone ? 10 : 0)
        + (record.localArea ? 5 : 0)
        + (record.streetAddress && !/business - non resident/i.test(record.streetAddress) ? 10 : 0),
      flags,
    };
  }

  if (looksPriority) {
    return {
      tier: "review",
      reason:
        "Potential fit, but the licence reads as home-based, mobile, contractor, non-resident, or back-office and should stay review-first.",
      score:
        120
        + (record.email ? 20 : 0)
        + (record.phone ? 8 : 0)
        + (record.localArea ? 5 : 0),
      flags,
    };
  }

  return {
    tier: "review",
    reason:
      "Needs manual review before outreach because the public-facing partnership fit is unclear from the licence class alone.",
    score:
      90
      + (record.email ? 15 : 0)
      + (record.phone ? 5 : 0)
      + (record.localArea ? 5 : 0),
    flags,
  };
}

export function sortOfficialMetroInventoryRecords(records: BusinessInventoryRecord[]) {
  return records.slice().sort((left, right) => {
    const leftFit = getOfficialMetroPartnerFit(left);
    const rightFit = getOfficialMetroPartnerFit(right);
    return (
      rightFit.score - leftFit.score
      || left.businessType.localeCompare(right.businessType)
      || left.localArea.localeCompare(right.localArea)
      || left.businessName.localeCompare(right.businessName)
    );
  });
}

export function isServiceBusinessProspect(prospect: BusinessProspect) {
  return (
    !isFoodLikeLabel(prospect.category)
    && !isBlockedServiceCategory(prospect.category, prospect.segment)
    && isSupportedServiceCategory(prospect.category, prospect.segment)
    && shouldTreatProspectAsPartnerAnchor(prospect)
  );
}

export function mapServiceProspectToInventoryRecord(
  prospect: BusinessProspect,
): BusinessInventoryRecord {
  return {
    inventoryId: buildServiceInventoryId(prospect),
    sourceSystem: "cityatlas_service_partner_inventory",
    sourceScope: `${prospect.cityKey}_reviewed_service_business_inventory`,
    sourceRecordId: prospect.id,
    licenseYear: "",
    licenseStatus: "reviewed_local",
    businessName: prospect.businessName,
    businessTradeName: "",
    businessType: prospect.category,
    businessSubtype: prospect.segment,
    categoryPrimary: mapServiceCategoryPrimary(prospect.category, prospect.segment),
    categorySecondary: prospect.contactPathType,
    cuisine: "",
    cityName: prospect.cityName,
    municipality: prospect.municipality || prospect.cityName,
    sourceCityRaw: prospect.cityName,
    localArea: prospect.neighborhood,
    streetAddress: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    website: prospect.website,
    menuUrl: "",
    publicContactPath: prospect.contactPath,
    publicContactType: prospect.contactPathType,
    email: prospect.email,
    phone: "",
    officialSourceUrl: prospect.sourceUrl,
    osmSourceUrl: "",
    verificationStatus: getServiceVerificationStatus(prospect),
    contactReadiness: prospect.contactReadiness,
    outreachPriority: prospect.outreachStatus,
    notes: [
      prospect.notes,
      `Source lane: ${prospect.sourceLabel}.`,
      "Already staged in the local CityAtlas queue.",
      "No outreach, public publishing, or route assignment happened automatically.",
    ]
      .filter(Boolean)
      .join(" "),
    lastVerifiedDate: getServiceLastVerifiedDate(prospect),
  };
}

export function createServiceBusinessInventoryRecords(prospects: BusinessProspect[]) {
  const byBusiness = new Map<string, BusinessProspect>();

  for (const prospect of prospects) {
    if (!isServiceBusinessProspect(prospect)) continue;
    const key = buildServiceInventoryKey(prospect);
    byBusiness.set(key, choosePreferredServiceProspect(byBusiness.get(key), prospect));
  }

  return Array.from(byBusiness.values())
    .map(mapServiceProspectToInventoryRecord)
    .sort(
      (left, right) =>
        left.businessType.localeCompare(right.businessType)
        || left.localArea.localeCompare(right.localArea)
        || left.businessName.localeCompare(right.businessName),
    );
}

export function buildBusinessInventorySummary(
  records: BusinessInventoryRecord[],
  sourceScope: string,
): BusinessInventorySummary {
  const byBusinessType: Record<string, number> = {};
  const byLocalArea: Record<string, number> = {};
  const byCity: Record<string, number> = {};

  for (const record of records) {
    const businessType = record.businessType || "Unknown";
    const localArea = record.localArea || "Unknown";
    const city = record.cityName || record.municipality || "Unknown";
    byBusinessType[businessType] = (byBusinessType[businessType] ?? 0) + 1;
    byLocalArea[localArea] = (byLocalArea[localArea] ?? 0) + 1;
    byCity[city] = (byCity[city] ?? 0) + 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    recordCount: records.length,
    byBusinessType,
    byLocalArea,
    byCity,
    sourceScope,
  };
}

export function buildBusinessInventorySourceUrl(record: BusinessInventoryRecord) {
  return record.sourceRecordId
    ? `${record.officialSourceUrl}#${record.sourceRecordId}`
    : record.officialSourceUrl;
}

export function mapBusinessInventoryRecordToImportInput(
  record: BusinessInventoryRecord,
): BusinessProspectImportInput {
  const isLimitedService = record.businessType === "Limited Service Food Establishment";
  const isReviewedServiceInventory = isReviewedServiceInventoryRecord(record);
  const isOfficialServiceInventory = isOfficialServiceInventoryRecord(record);
  const isOfficialMetroInventory = isOfficialMetroInventoryRecord(record);
  const isServiceLikeOfficialMetroInventory =
    isOfficialMetroInventory && !isFoodLikeLabel(record.businessType || record.categoryPrimary);
  const displayName = record.businessTradeName || record.businessName;
  const locationBits = [record.streetAddress, record.postalCode, record.localArea].filter(Boolean);
  const subtype = record.businessSubtype ? `Subtype: ${record.businessSubtype}.` : "";

  return {
    businessName: displayName,
    email: "",
    contactName: "",
    cityName: record.cityName || record.municipality || "Vancouver",
    municipality: record.municipality || record.cityName || "Vancouver",
    neighborhood: record.localArea,
    category: record.businessType,
    segment: isReviewedServiceInventory || isOfficialServiceInventory || isServiceLikeOfficialMetroInventory
      ? record.businessSubtype || record.businessType || "Service business"
      : isLimitedService
        ? "Cafe and quick-service food"
        : "Restaurant",
    sourceLabel: isReviewedServiceInventory
      ? REVIEWED_SERVICE_SOURCE_LABEL
      : isOfficialServiceInventory
        ? OFFICIAL_VANCOUVER_SERVICE_SOURCE_LABEL
        : isOfficialMetroInventory
          ? OFFICIAL_GREATER_VANCOUVER_SOURCE_LABEL
          : OFFICIAL_VANCOUVER_FOOD_SOURCE_LABEL,
    sourceUrl: buildBusinessInventorySourceUrl(record),
    website: record.website,
    contactPath: record.publicContactPath || record.officialSourceUrl,
    notes: [
      isReviewedServiceInventory
        ? "Imported from the reviewed CityAtlas service-business inventory for local review only."
        : isOfficialServiceInventory
          ? "Imported from the official City of Vancouver service-business inventory for local review only."
          : isOfficialMetroInventory
            ? "Imported from the verified Greater Vancouver municipal business inventory for local review only."
            : "Imported from the official City of Vancouver food-business inventory for local review only.",
      locationBits.length > 0 ? `Location: ${locationBits.join(", ")}.` : "",
      record.municipality && record.municipality !== record.cityName
        ? `Municipality: ${record.municipality}.`
        : "",
      subtype,
      "No outreach, public publishing, or route assignment happened automatically.",
    ]
      .filter(Boolean)
      .join(" "),
    relationshipWarmth: "unknown",
  };
}

export function createBusinessProspectsFromInventoryRecords(records: BusinessInventoryRecord[]) {
  const hasReviewedServiceInventory = records.some(isReviewedServiceInventoryRecord);
  const hasOfficialFoodInventory = records.some(isOfficialFoodInventoryRecord);
  const hasOfficialServiceInventory = records.some(isOfficialServiceInventoryRecord);
  const hasOfficialMetroInventory = records.some(isOfficialMetroInventoryRecord);
  const importBatchId =
    hasReviewedServiceInventory
    && (hasOfficialFoodInventory || hasOfficialServiceInventory || hasOfficialMetroInventory)
      ? "cityatlas-combined-operator-inventory"
      : hasOfficialMetroInventory
        ? "cityatlas-official-greater-vancouver-inventory"
        : hasOfficialFoodInventory && hasOfficialServiceInventory
        ? "cityatlas-official-vancouver-operator-inventory"
        : hasReviewedServiceInventory
        ? "cityatlas-reviewed-service-inventory"
        : hasOfficialServiceInventory
          ? "cityatlas-official-vancouver-service"
          : "cityatlas-official-vancouver-food";

  return createBusinessProspectsFromImportInputs(
    records.map(mapBusinessInventoryRecordToImportInput),
    importBatchId,
  );
}

function buildInventoryStageNameKey(displayName: string, cityName: string) {
  return `${displayName.trim().toLowerCase()}::${cityName.trim().toLowerCase()}`;
}

export function buildBusinessInventoryStageLookup(prospects: BusinessProspect[]) {
  const sourceUrls = new Set<string>();
  const nameCityKeys = new Set<string>();

  for (const prospect of prospects) {
    if (prospect.sourceUrl) {
      sourceUrls.add(prospect.sourceUrl);
    }
    nameCityKeys.add(
      buildInventoryStageNameKey(prospect.businessName, prospect.cityName || "Vancouver"),
    );
  }

  return {
    sourceUrls,
    nameCityKeys,
  };
}

export function isBusinessInventoryRecordStagedInLookup(
  record: BusinessInventoryRecord,
  lookup: ReturnType<typeof buildBusinessInventoryStageLookup>,
) {
  const sourceUrl = buildBusinessInventorySourceUrl(record);
  const displayName = record.businessTradeName || record.businessName;
  const cityName = record.cityName || record.municipality || "Vancouver";

  return (
    lookup.sourceUrls.has(sourceUrl)
    || lookup.nameCityKeys.has(buildInventoryStageNameKey(displayName, cityName))
  );
}

export function getBusinessInventoryImportSourceLabel(records: BusinessInventoryRecord[]) {
  const hasReviewedServiceInventory = records.some(isReviewedServiceInventoryRecord);
  const hasOfficialFoodInventory = records.some(isOfficialFoodInventoryRecord);
  const hasOfficialServiceInventory = records.some(isOfficialServiceInventoryRecord);
  const hasOfficialMetroInventory = records.some(isOfficialMetroInventoryRecord);

  if (
    hasReviewedServiceInventory
    && (hasOfficialFoodInventory || hasOfficialServiceInventory || hasOfficialMetroInventory)
  ) {
    return "combined_operator_inventory";
  }
  if (hasReviewedServiceInventory) {
    return "reviewed_service_business_inventory";
  }
  if (hasOfficialMetroInventory) {
    return "official_greater_vancouver_business_inventory";
  }
  if (hasOfficialFoodInventory && hasOfficialServiceInventory) {
    return "official_vancouver_operator_inventory";
  }
  if (hasOfficialServiceInventory) {
    return "official_vancouver_service_business_inventory";
  }
  return "official_vancouver_business_licence_inventory";
}

export function isBusinessInventoryRecordStaged(
  record: BusinessInventoryRecord,
  prospects: BusinessProspect[],
) {
  return isBusinessInventoryRecordStagedInLookup(
    record,
    buildBusinessInventoryStageLookup(prospects),
  );
}
