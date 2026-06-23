import type {
  BusinessProspect,
  BusinessReplyBridgeReplayRecord,
  BusinessReplyLog,
  BrainRun,
  BusinessSubmission,
  BusinessInboundMirrorEntry,
  CityAtlasData,
  GrowthEvent,
  LaunchGate,
  ManualReplyLog,
  NewsletterLead,
  PackageId,
  SavedItem,
} from "../types";
import { shouldTreatProspectAsPartnerAnchor } from "./businessProspectRole";
import { slugify } from "./format";

const STORAGE_KEY = "cityatlas.launch.package.v1";
const STORAGE_SCHEMA_VERSION = 2;

interface CityAtlasPersistedData {
  schemaVersion?: number;
  launchGates?: Array<Pick<LaunchGate, "id" | "status">>;
  submissions?: BusinessSubmission[];
  newsletterLeads?: NewsletterLead[];
  savedItems?: SavedItem[];
  growthEvents?: GrowthEvent[];
  revenueExperiments?: CityAtlasData["revenueExperiments"];
  businessProspects?: BusinessProspect[];
  manualReplyLogs?: ManualReplyLog[];
  businessInboundMirror?: BusinessInboundMirrorEntry[];
  businessReplyBridgeReplays?: BusinessReplyBridgeReplayRecord[];
  businessReplyLogs?: BusinessReplyLog[];
  brainRuns?: BrainRun[];
  auditLogs?: CityAtlasData["auditLogs"];
}

const seedDataPromise = import("../data/seed").then(({ seedData }) => cloneData(seedData));
let defaultBaseDataCache: CityAtlasData | null = null;
let defaultFullDataCache: CityAtlasData | null = null;

let cityGrowthModulePromise: Promise<typeof import("./cityGrowth")> | null = null;
let businessInboundPreviewModulePromise: Promise<typeof import("./businessInboundPreview")> | null =
  null;

function loadCityGrowthModule() {
  cityGrowthModulePromise ??= import("./cityGrowth");
  return cityGrowthModulePromise;
}

function loadBusinessInboundPreviewModule() {
  businessInboundPreviewModulePromise ??= import("./businessInboundPreview");
  return businessInboundPreviewModulePromise;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createEmptyCityAtlasData(): CityAtlasData {
  return {
    sources: [],
    businesses: [],
    events: [],
    offers: [],
    guides: [],
    sourceBackedPlaces: [],
    cityRolloutTargets: [],
    cityMissions: [],
    packages: [],
    launchGates: [],
    submissions: [],
    newsletterLeads: [],
    savedItems: [],
    growthEvents: [],
    revenueExperiments: [],
    growthPlays: [],
    proofSprints: [],
    proofCandidates: [],
    businessProspects: [],
    manualReplyLogs: [],
    businessInboundMirror: [],
    businessReplyBridgeReplays: [],
    businessReplyLogs: [],
    brainRuns: [],
    auditLogs: [],
  };
}

async function buildBaseData(): Promise<CityAtlasData> {
  const seed = await seedDataPromise;
  const baseData = cloneData(seed);
  defaultBaseDataCache = cloneData(baseData);
  return baseData;
}

export async function loadCityAtlasGrowthData(
  persisted: Pick<CityAtlasPersistedData, "businessInboundMirror" | "businessProspects"> = {},
) {
  const seed = await seedDataPromise;
  const [
    { buildDefaultBusinessProspects, buildDefaultCityRolloutTargets, mergeBusinessProspects },
    { compactBusinessProtectedInboundMirrorEntries },
  ] = await Promise.all([loadCityGrowthModule(), loadBusinessInboundPreviewModule()]);
  const cityRolloutTargets = buildDefaultCityRolloutTargets();
  const businessProspects = mergeBusinessProspects(
    buildDefaultBusinessProspects(seed),
    persisted.businessProspects ?? [],
  );
  const businessInboundMirror = compactBusinessProtectedInboundMirrorEntries(
    persisted.businessInboundMirror ?? [],
  );

  defaultFullDataCache = cloneData({
    ...seed,
    cityRolloutTargets,
    businessProspects,
    businessInboundMirror,
  });

  return {
    cityRolloutTargets,
    businessProspects,
    businessInboundMirror,
  };
}

function readPersistedCityAtlasData() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Partial<CityAtlasData> & CityAtlasPersistedData;
  } catch {
    return null;
  }
}

function buildPersistedCityAtlasData(
  data: CityAtlasData,
  existing: Partial<CityAtlasPersistedData> = {},
): CityAtlasPersistedData {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    launchGates: data.launchGates.map((gate) => ({
      id: gate.id,
      status: gate.status,
    })),
    submissions: data.submissions,
    newsletterLeads: data.newsletterLeads,
    savedItems: data.savedItems,
    growthEvents: data.growthEvents,
    revenueExperiments: data.revenueExperiments,
    businessProspects:
      data.businessProspects.length > 0
        ? data.businessProspects
        : existing.businessProspects ?? [],
    manualReplyLogs: data.manualReplyLogs,
    businessInboundMirror: data.businessInboundMirror,
    businessReplyBridgeReplays: data.businessReplyBridgeReplays,
    businessReplyLogs: data.businessReplyLogs,
    brainRuns: data.brainRuns,
    auditLogs: data.auditLogs,
  };
}

export async function loadCityAtlasData(
  options: { includeGrowthData?: boolean } = {},
): Promise<CityAtlasData> {
  const includeGrowthData = options.includeGrowthData ?? false;
  const parsed = readPersistedCityAtlasData();
  const seed = await buildBaseData();
  if (!parsed) {
    if (!includeGrowthData) {
      return seed;
    }

    const growthData = await loadCityAtlasGrowthData();
    return {
      ...seed,
      ...growthData,
    };
  }

  const growthData = includeGrowthData
    ? await loadCityAtlasGrowthData({
        businessProspects: parsed.businessProspects,
        businessInboundMirror: parsed.businessInboundMirror,
      })
    : null;
  const seedCandidates = new Map(seed.proofCandidates.map((candidate) => [candidate.id, candidate]));
  const seedLaunchGates = new Map(seed.launchGates.map((gate) => [gate.id, gate]));
  const parsedRevenueExperiments = parsed.revenueExperiments ?? [];
  const mergedRevenueExperiments = [
    ...seed.revenueExperiments.map(
      (experiment) =>
        parsedRevenueExperiments.find((item) => item.id === experiment.id) ?? experiment,
    ),
    ...parsedRevenueExperiments.filter(
      (experiment) =>
        !seed.revenueExperiments.some((seedExperiment) => seedExperiment.id === experiment.id),
    ),
  ];

  return {
    ...seed,
    ...parsed,
    sources: seed.sources,
    businesses: seed.businesses,
    events: seed.events,
    offers: seed.offers,
    guides: seed.guides,
    sourceBackedPlaces: seed.sourceBackedPlaces,
    cityRolloutTargets: growthData?.cityRolloutTargets ?? [],
    cityMissions: seed.cityMissions,
    packages: seed.packages,
    launchGates: (parsed.launchGates ?? seed.launchGates).map((gate) => {
      const seedGate = seedLaunchGates.get(gate.id);
      return seedGate
        ? {
            ...seedGate,
            status: gate.status,
          }
        : gate;
    }),
    submissions: parsed.submissions ?? [],
    newsletterLeads: parsed.newsletterLeads ?? [],
    savedItems: parsed.savedItems ?? [],
    growthEvents: parsed.growthEvents ?? [],
    revenueExperiments: mergedRevenueExperiments,
    growthPlays: seed.growthPlays,
    proofSprints: seed.proofSprints,
    proofCandidates: (parsed.proofCandidates ?? seed.proofCandidates).map((candidate) => {
      const seedCandidate = seedCandidates.get(candidate.id);
      return {
        ...(seedCandidate ?? {}),
        ...candidate,
        sourceUrl: seedCandidate?.sourceUrl ?? candidate.sourceUrl,
        sourceStatus: seedCandidate?.sourceStatus ?? candidate.sourceStatus,
        fitScore: seedCandidate?.fitScore ?? candidate.fitScore,
        routeAngle: seedCandidate?.routeAngle ?? candidate.routeAngle,
        contactPathType: seedCandidate?.contactPathType ?? candidate.contactPathType,
        contactPath: seedCandidate?.contactPath ?? candidate.contactPath,
        contactSourceUrl: seedCandidate?.contactSourceUrl ?? candidate.contactSourceUrl,
        contactConfidence: seedCandidate?.contactConfidence ?? candidate.contactConfidence,
        contactResearchNote:
          seedCandidate?.contactResearchNote ?? candidate.contactResearchNote,
        lastContactResearchAt:
          seedCandidate?.lastContactResearchAt ?? candidate.lastContactResearchAt,
        riskNotes: seedCandidate?.riskNotes ?? candidate.riskNotes,
        nextStep: seedCandidate?.nextStep ?? candidate.nextStep,
      };
    }),
    businessProspects: growthData?.businessProspects ?? parsed.businessProspects ?? [],
    manualReplyLogs: parsed.manualReplyLogs ?? [],
    businessInboundMirror: growthData?.businessInboundMirror ?? parsed.businessInboundMirror ?? [],
    businessReplyBridgeReplays: parsed.businessReplyBridgeReplays ?? [],
    businessReplyLogs: parsed.businessReplyLogs ?? [],
    brainRuns: parsed.brainRuns ?? [],
    auditLogs: parsed.auditLogs ?? [],
  };
}

export function saveCityAtlasData(data: CityAtlasData) {
  if (typeof window === "undefined") return;
  const existing = readPersistedCityAtlasData();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(buildPersistedCityAtlasData(data, existing ?? {})),
  );
}

export function resetCityAtlasData() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  if (defaultFullDataCache) {
    return cloneData(defaultFullDataCache);
  }
  if (defaultBaseDataCache) {
    return cloneData(defaultBaseDataCache);
  }
  return createEmptyCityAtlasData();
}

export function createNewsletterLead(
  email: string,
  interest: NewsletterLead["interest"],
): NewsletterLead {
  const referralCode = `atlas-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id: createId("lead"),
    email: email.trim(),
    interest,
    referralCode,
    createdAt: new Date().toISOString(),
  };
}

export function createBusinessSubmission(input: {
  businessName: string;
  category: string;
  neighborhood: string;
  contactName: string;
  email: string;
  website: string;
  message: string;
  packageInterest?: PackageId;
}): BusinessSubmission {
  return {
    id: createId(slugify(input.businessName) || "submission"),
    businessName: input.businessName.trim(),
    category: input.category.trim(),
    neighborhood: input.neighborhood.trim(),
    contactName: input.contactName.trim(),
    email: input.email.trim(),
    website: input.website.trim(),
    message: input.message.trim(),
    packageInterest: input.packageInterest,
    status: "review_queue",
    createdAt: new Date().toISOString(),
  };
}

export function audit(action: string, entityType: string, entityId: string, summary: string) {
  return {
    id: createId("audit"),
    action,
    entityType,
    entityId,
    summary,
    createdAt: new Date().toISOString(),
  };
}

export function createSavedItem(
  itemType: SavedItem["itemType"],
  itemId: string,
  label: string,
): SavedItem {
  return {
    id: createId("save"),
    itemType,
    itemId,
    label,
    createdAt: new Date().toISOString(),
  };
}

export function createGrowthEvent(
  name: string,
  path: string,
  detail: GrowthEvent["detail"] = {},
): GrowthEvent {
  return {
    id: createId("event"),
    name,
    path,
    detail,
    createdAt: new Date().toISOString(),
  };
}

export function createManualReplyLog(
  input: Omit<ManualReplyLog, "id" | "createdAt">,
): ManualReplyLog {
  return {
    id: createId("reply"),
    ...input,
    createdAt: new Date().toISOString(),
  };
}

export function createBusinessReplyLog(
  input: Omit<BusinessReplyLog, "id" | "createdAt">,
): BusinessReplyLog {
  return {
    id: createId("business-reply"),
    ...input,
    createdAt: new Date().toISOString(),
  };
}

export function createBusinessReplyBridgeReplayRecord(
  input: Omit<BusinessReplyBridgeReplayRecord, "id">,
): BusinessReplyBridgeReplayRecord {
  return {
    id: createId("business-bridge"),
    ...input,
  };
}

export function createBusinessInboundMirrorEntry(
  input: Omit<BusinessInboundMirrorEntry, "id">,
): BusinessInboundMirrorEntry {
  return {
    id: createId("business-mirror"),
    ...input,
  };
}

export function createBrainRun(input: Omit<BrainRun, "id" | "createdAt">): BrainRun {
  return {
    id: createId("brain"),
    ...input,
    createdAt: new Date().toISOString(),
  };
}

export function createBusinessProspectAuditSummary(
  prospects: BusinessProspect[],
  importedCount: number,
) {
  const partnerEligible = prospects.filter((prospect) => shouldTreatProspectAsPartnerAnchor(prospect)).length;
  const contactReady = prospects.filter(
    (prospect) => prospect.contactReadiness !== "needs_research",
  ).length;
  return `Prepared ${importedCount} local business prospect row(s). CityAtlas now has ${prospects.length} unique prospects, ${partnerEligible} partner-eligible rows, ${contactReady} with a usable contact path, and no outreach was sent.`;
}
