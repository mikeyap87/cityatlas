import { seedData } from "../data/seed";
import type {
  BusinessProspect,
  BusinessReplyBridgeReplayRecord,
  BusinessReplyLog,
  BrainRun,
  BusinessSubmission,
  BusinessInboundMirrorEntry,
  CityAtlasData,
  GrowthEvent,
  ManualReplyLog,
  NewsletterLead,
  PackageId,
  SavedItem,
} from "../types";
import {
  buildDefaultBusinessProspects,
  buildDefaultCityRolloutTargets,
  countPartnerEligibleProspects,
  mergeBusinessProspects,
} from "./cityGrowth";
import { compactBusinessProtectedInboundMirrorEntries } from "./businessInboundPreview";
import { slugify } from "./format";

const STORAGE_KEY = "cityatlas.launch.package.v1";

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function cloneSeed(): CityAtlasData {
  return JSON.parse(JSON.stringify(seedData)) as CityAtlasData;
}

function buildDefaultData(): CityAtlasData {
  const seed = cloneSeed();
  return {
    ...seed,
    cityRolloutTargets: buildDefaultCityRolloutTargets(),
    businessProspects: buildDefaultBusinessProspects(seed),
  };
}

export function loadCityAtlasData(): CityAtlasData {
  if (typeof window === "undefined") return buildDefaultData();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return buildDefaultData();
  try {
    const parsed = JSON.parse(raw) as CityAtlasData;
    const seed = buildDefaultData();
    const defaultCityRolloutTargets = seed.cityRolloutTargets;
    const defaultBusinessProspects = seed.businessProspects;
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
      cityRolloutTargets: defaultCityRolloutTargets,
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
      businessProspects: mergeBusinessProspects(
        defaultBusinessProspects,
        parsed.businessProspects ?? [],
      ),
      manualReplyLogs: parsed.manualReplyLogs ?? [],
      businessInboundMirror: compactBusinessProtectedInboundMirrorEntries(
        parsed.businessInboundMirror ?? [],
      ),
      businessReplyBridgeReplays: parsed.businessReplyBridgeReplays ?? [],
      businessReplyLogs: parsed.businessReplyLogs ?? [],
      brainRuns: parsed.brainRuns ?? [],
      auditLogs: parsed.auditLogs ?? [],
    };
  } catch {
    return buildDefaultData();
  }
}

export function saveCityAtlasData(data: CityAtlasData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetCityAtlasData() {
  window.localStorage.removeItem(STORAGE_KEY);
  return buildDefaultData();
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
  const partnerEligible = countPartnerEligibleProspects(prospects);
  const contactReady = prospects.filter(
    (prospect) => prospect.contactReadiness !== "needs_research",
  ).length;
  return `Prepared ${importedCount} local business prospect row(s). CityAtlas now has ${prospects.length} unique prospects, ${partnerEligible} partner-eligible rows, ${contactReady} with a usable contact path, and no outreach was sent.`;
}
