import type {
  AuditLog,
  BrainRun,
  BusinessInboundMirrorEntry,
  BusinessProspect,
  BusinessReplyBridgeReplayRecord,
  BusinessReplyLog,
  BusinessSubmission,
  CityMission,
  CityAtlasData,
  GrowthEvent,
  ManualReplyLog,
  MissionPlanState,
  NewsletterLead,
  SavedItem,
  TravelMode,
} from "../types";
import { seedData } from "../data/seed";

const CITYATLAS_STORAGE_KEY = "cityatlas.launch.package.v1";

const MUTABLE_KEYS: Array<keyof CityAtlasData> = [
  "launchGates",
  "submissions",
  "newsletterLeads",
  "savedItems",
  "missionPlans",
  "growthEvents",
  "businessProspects",
  "manualReplyLogs",
  "businessInboundMirror",
  "businessReplyBridgeReplays",
  "businessReplyLogs",
  "brainRuns",
  "auditLogs",
];

const GROWTH_ONLY_KEYS: Array<keyof CityAtlasData> = [
  "businessProspects",
  "manualReplyLogs",
  "businessInboundMirror",
  "businessReplyBridgeReplays",
  "businessReplyLogs",
  "brainRuns",
  "auditLogs",
];

function cloneSeedData(): CityAtlasData {
  if (typeof structuredClone === "function") {
    return structuredClone(seedData);
  }

  return JSON.parse(JSON.stringify(seedData)) as CityAtlasData;
}

function readStoredData() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CITYATLAS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<CityAtlasData>) : null;
  } catch {
    return null;
  }
}

function writeStoredData(data: CityAtlasData) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CITYATLAS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota and serialization issues in local-only mode.
  }
}

function mergeData(stored: Partial<CityAtlasData> | null) {
  const base = cloneSeedData();
  if (!stored) return base;

  const next = { ...base } as CityAtlasData;
  for (const key of MUTABLE_KEYS) {
    const value = stored[key];
    if (value !== undefined) {
      ((next as unknown) as Record<string, unknown>)[key] = value as unknown;
    }
  }
  return next;
}

function stripGrowthData(data: CityAtlasData) {
  const next = { ...data } as CityAtlasData;
  const emptySeed = (cloneSeedData() as unknown) as Record<string, unknown>;
  for (const key of GROWTH_ONLY_KEYS) {
    ((next as unknown) as Record<string, unknown>)[key] = emptySeed[key];
  }
  return next;
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function buildReferralCode(email: string) {
  return email
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 18) || "cityatlas";
}

export function createEmptyCityAtlasData() {
  return cloneSeedData();
}

export function resetCityAtlasData() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CITYATLAS_STORAGE_KEY);
  }
  return cloneSeedData();
}

export async function loadCityAtlasData({ includeGrowthData = false }: { includeGrowthData?: boolean } = {}) {
  const merged = mergeData(readStoredData());
  return includeGrowthData ? merged : stripGrowthData(merged);
}

export async function loadCityAtlasGrowthData(_: {
  businessProspects?: BusinessProspect[];
  businessInboundMirror?: BusinessInboundMirrorEntry[];
} = {}) {
  const merged = mergeData(readStoredData());
  return GROWTH_ONLY_KEYS.reduce((accumulator, key) => {
    ((accumulator as unknown) as Record<string, unknown>)[key] = ((merged as unknown) as Record<string, unknown>)[key];
    return accumulator;
  }, {} as Pick<CityAtlasData, typeof GROWTH_ONLY_KEYS[number]>);
}

export function saveCityAtlasData(data: CityAtlasData) {
  writeStoredData(data);
}

export function audit(
  action: string,
  entityType: string,
  entityId: string,
  summary: string,
): AuditLog {
  return {
    id: createId("audit"),
    action,
    entityType,
    entityId,
    summary,
    createdAt: nowIso(),
  };
}

export function createBusinessProspectAuditSummary(
  prospects: BusinessProspect[],
  importedCount: number,
) {
  return `Imported ${importedCount} prospect(s). Queue now holds ${prospects.length} reviewed row(s).`;
}

export function createBusinessSubmission(
  input: Omit<BusinessSubmission, "id" | "status" | "createdAt">,
): BusinessSubmission {
  return {
    id: createId("submission"),
    ...input,
    status: "review_queue",
    createdAt: nowIso(),
  };
}

export function createNewsletterLead(
  email: string,
  interest: NewsletterLead["interest"],
): NewsletterLead {
  return {
    id: createId("lead"),
    email,
    interest,
    referralCode: buildReferralCode(email),
    createdAt: nowIso(),
  };
}

export function createSavedItem(
  itemType: SavedItem["itemType"],
  itemId: string,
  label: string,
): SavedItem {
  return {
    id: createId("saved"),
    itemType,
    itemId,
    label,
    createdAt: nowIso(),
  };
}

export function createMissionPlan(
  mission: CityMission,
  travelMode: TravelMode = mission.defaultTravelMode,
): MissionPlanState {
  const timestamp = nowIso();
  return {
    missionId: mission.id,
    travelMode,
    selectedStartTime: mission.startOptions?.[0],
    steps: mission.steps.map((_, index) => ({
      stepIndex: index,
      status: "pending",
      updatedAt: timestamp,
    })),
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createGrowthEvent(
  name: string,
  path: string,
  detail: GrowthEvent["detail"] = {},
): GrowthEvent {
  return {
    id: createId("growth"),
    name,
    path,
    detail,
    createdAt: nowIso(),
  };
}

export function createManualReplyLog(
  input: Omit<ManualReplyLog, "id" | "createdAt">,
): ManualReplyLog {
  return {
    id: createId("manual-reply"),
    ...input,
    createdAt: nowIso(),
  };
}

export function createBusinessReplyBridgeReplayRecord(
  input: Omit<BusinessReplyBridgeReplayRecord, "id">,
): BusinessReplyBridgeReplayRecord {
  return {
    id: createId("reply-replay"),
    ...input,
  };
}

export function createBusinessReplyLog(
  input: Omit<BusinessReplyLog, "id" | "createdAt">,
): BusinessReplyLog {
  return {
    id: createId("reply-log"),
    ...input,
    createdAt: nowIso(),
  };
}

export function createBrainRun(
  input: Omit<BrainRun, "id" | "createdAt">,
): BrainRun {
  return {
    id: createId("brain-run"),
    ...input,
    createdAt: nowIso(),
  };
}
