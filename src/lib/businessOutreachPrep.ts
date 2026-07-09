import type { BusinessProspect } from "../types";
import {
  classifyBusinessProspectRole,
  isPartnerEligibleProspect,
} from "./cityGrowth.ts";

export interface BusinessOutreachDraft {
  subject: string;
  opening: string;
  body: string;
  angle: string;
}

export type BusinessBatchLane =
  | "culture"
  | "hospitality"
  | "hotel_guest"
  | "event_group"
  | "wellness"
  | "local_business"
  | "other";

export interface BusinessProofBatchCandidate {
  prospectId: string;
  businessName: string;
  category: string;
  segment: string;
  neighborhood: string;
  batchLane: BusinessBatchLane;
  sourceLane: string;
  role: "partner_candidate" | "partner_and_anchor";
  stage: "Rehearsal ready" | "Review first" | "Hold";
  score: number;
  contactRoute: string;
  whyChosen: string;
  missing: string[];
  draft: BusinessOutreachDraft;
}

export interface BusinessProofBatchBrief {
  readiness: number;
  status: "Needs local prep" | "Ready for owner inbox rehearsal";
  title: string;
  summary: string;
  cityKey: string;
  cityName: string;
  selectedCount: number;
  rehearsalReadyCount: number;
  reviewFirstCount: number;
  distinctBatchLaneCount: number;
  distinctSourceLaneCount: number;
  nextAction: string;
  candidates: BusinessProofBatchCandidate[];
  reviewPacket: string[];
  guardrails: string[];
}

export interface BusinessOwnerInboxBrief {
  readiness: number;
  title: string;
  summary: string;
  candidateName: string;
  candidateStage: string;
  draftSubject: string;
  nextAction: string;
  checklist: string[];
  blockedBy: string[];
}

const blockedOutreachStates = new Set<BusinessProspect["outreachStatus"]>([
  "sent_manual",
  "replied",
  "do_not_contact",
]);

const batchLanePriority: BusinessBatchLane[] = [
  "culture",
  "hospitality",
  "hotel_guest",
  "event_group",
  "wellness",
  "local_business",
  "other",
];

export function buildBusinessProofBatchBrief(
  prospects: BusinessProspect[],
  cityKey = "vancouver",
) {
  const cityProspects = prospects.filter(
    (prospect) =>
      prospect.cityKey === cityKey &&
      isPartnerEligibleProspect(prospect) &&
      !blockedOutreachStates.has(prospect.outreachStatus),
  );
  const sorted = cityProspects
    .map(buildBusinessProofCandidate)
    .sort((left, right) => right.score - left.score || left.businessName.localeCompare(right.businessName));
  const candidates = selectBatchCandidates(sorted);
  const rehearsalReadyCount = candidates.filter((candidate) => candidate.stage === "Rehearsal ready").length;
  const reviewFirstCount = candidates.filter((candidate) => candidate.stage === "Review first").length;
  const distinctBatchLaneCount = new Set(candidates.map((candidate) => candidate.batchLane)).size;
  const distinctSourceLaneCount = new Set(candidates.map((candidate) => candidate.sourceLane)).size;
  const status = rehearsalReadyCount > 0 && candidates.length >= 3
    ? "Ready for owner inbox rehearsal"
    : "Needs local prep";
  const cityName = prospects.find((prospect) => prospect.cityKey === cityKey)?.cityName
    || cityKey.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    readiness: getReadiness(candidates),
    status,
    title:
      status === "Ready for owner inbox rehearsal"
        ? "CityAtlas has a tiny business proof batch ready for rehearsal"
        : "CityAtlas business proof batch still needs cleanup",
    summary:
      status === "Ready for owner inbox rehearsal"
        ? "Use one exact draft on your own inbox first, then decide whether any real business should ever see the note."
        : "Keep this local until at least one rehearsal-ready business draft and a full 3-5 target packet exist.",
    cityKey,
    cityName,
    selectedCount: candidates.length,
    rehearsalReadyCount,
    reviewFirstCount,
    distinctBatchLaneCount,
    distinctSourceLaneCount,
    nextAction:
      status === "Ready for owner inbox rehearsal"
        ? "Run one owner-inbox rehearsal with the strongest direct-email candidate. Do not contact the business from CityAtlas."
        : candidates.length < 3
          ? "Widen the partner-eligible city queue before trying to rehearse outreach."
          : "Improve direct-email and source-proof quality until at least one candidate is rehearsal-ready.",
    candidates,
    reviewPacket: buildReviewPacket(candidates),
    guardrails: [
      "Keep the first batch to 3-5 exact businesses.",
      "Use only public official-site contact paths.",
      "Run one owner-inbox rehearsal before any outside send is even considered.",
      "Do not auto-follow up, submit contact forms, or send from CityAtlas.",
      "Do not treat public business interest as confirmed until a real reply exists.",
    ],
  } satisfies BusinessProofBatchBrief;
}

export function buildBusinessOwnerInboxBrief(
  batch: BusinessProofBatchBrief,
) {
  const candidate = batch.candidates.find((item) => item.stage === "Rehearsal ready");
  const blockedBy = [
    batch.selectedCount < 3 ? "Add enough partner-eligible businesses to reach a real 3-5 target packet." : "",
    !candidate ? "Choose one business with a direct public email before running an inbox rehearsal." : "",
  ].filter(Boolean);

  return {
    readiness: blockedBy.length === 0 ? 92 : Math.max(12, 92 - blockedBy.length * 28),
    title:
      blockedBy.length === 0
        ? "Owner inbox rehearsal is ready"
        : "Owner inbox rehearsal still needs setup",
    summary:
      blockedBy.length === 0
        ? "Test one CityAtlas draft in your own inbox first so sender identity, tone, and reply routing can be judged safely."
        : "This lane stays local until one direct-email business draft is ready for rehearsal.",
    candidateName: candidate?.businessName || "No rehearsal candidate chosen yet",
    candidateStage: candidate?.stage || "Not selected",
    draftSubject: candidate?.draft.subject || "No draft subject yet",
    nextAction:
      blockedBy.length === 0
        ? "Send one draft to the owner inbox only, review it, and keep every outside send blocked."
        : blockedBy[0],
    checklist: [
      "Use only one real business draft for the rehearsal.",
      "Keep the target inbox as your own inbox, not a business contact.",
      "Check sender name, subject line, body tone, and reply path.",
      "Keep the first note free of pricing, urgency, partnership claims, or fake familiarity.",
      "Log the rehearsal result before any real outreach approval is considered.",
    ],
    blockedBy,
  } satisfies BusinessOwnerInboxBrief;
}

export function buildBusinessProofCandidate(prospect: BusinessProspect): BusinessProofBatchCandidate {
  const role = classifyBusinessProspectRole(prospect);
  const missing = getMissingItems(prospect, role);
  const draft = buildBusinessOutreachDraft(prospect);
  const stage = getStage(prospect, missing);

  return {
    prospectId: prospect.id,
    businessName: prospect.businessName,
    category: prospect.category,
    segment: prospect.segment,
    neighborhood: prospect.neighborhood || "Not set yet",
    batchLane: getBusinessBatchLane(prospect),
    sourceLane: getBusinessSourceLane(prospect),
    role: role === "anchor_only" ? "partner_and_anchor" : role,
    stage,
    score: getPriorityScore(prospect, role, stage),
    contactRoute: prospect.email || prospect.contactPath || prospect.contactPathType,
    whyChosen: getWhyChosen(prospect, role),
    missing,
    draft,
  };
}

function selectBatchCandidates(sorted: BusinessProofBatchCandidate[]) {
  const selected: BusinessProofBatchCandidate[] = [];
  const selectedIds = new Set<string>();
  const laneCounts = new Map<BusinessBatchLane, number>();
  const sourceLaneCounts = new Map<string, number>();

  const addCandidate = (candidate: BusinessProofBatchCandidate) => {
    selected.push(candidate);
    selectedIds.add(candidate.prospectId);
    laneCounts.set(candidate.batchLane, (laneCounts.get(candidate.batchLane) || 0) + 1);
    sourceLaneCounts.set(candidate.sourceLane, (sourceLaneCounts.get(candidate.sourceLane) || 0) + 1);
  };

  for (const lane of batchLanePriority) {
    const candidate = pickPreferredLaneCandidate(
      sorted,
      lane,
      selectedIds,
      new Set(sourceLaneCounts.keys()),
    );
    if (!candidate) {
      continue;
    }

    addCandidate(candidate);

    if (selected.length >= 5) {
      return selected;
    }
  }

  for (const candidate of sorted) {
    if (selectedIds.has(candidate.prospectId)) {
      continue;
    }
    if ((laneCounts.get(candidate.batchLane) || 0) >= 2) {
      continue;
    }
    if ((sourceLaneCounts.get(candidate.sourceLane) || 0) >= 2) {
      continue;
    }

    addCandidate(candidate);

    if (selected.length >= 5) {
      return selected;
    }
  }

  for (const candidate of sorted) {
    if (selectedIds.has(candidate.prospectId)) {
      continue;
    }

    addCandidate(candidate);

    if (selected.length >= 5) {
      break;
    }
  }

  return selected;
}

function pickPreferredLaneCandidate(
  candidates: BusinessProofBatchCandidate[],
  lane: BusinessBatchLane,
  selectedIds: Set<string>,
  selectedSourceLanes: Set<string>,
) {
  const laneCandidates = candidates.filter(
    (candidate) => candidate.batchLane === lane && !selectedIds.has(candidate.prospectId),
  );

  if (laneCandidates.length === 0) {
    return null;
  }

  if (lane === "event_group") {
    return laneCandidates.find((candidate) =>
      !selectedSourceLanes.has(candidate.sourceLane)
      && /event venue|private-group|event-space|venue/i.test(
        `${candidate.category} ${candidate.segment}`,
      ),
    ) || laneCandidates.find((candidate) =>
      /event venue|private-group|event-space|venue/i.test(
        `${candidate.category} ${candidate.segment}`,
      ),
    ) || laneCandidates[0];
  }

  return laneCandidates.find((candidate) => !selectedSourceLanes.has(candidate.sourceLane))
    || laneCandidates[0];
}

function buildBusinessOutreachDraft(prospect: BusinessProspect): BusinessOutreachDraft {
  const cityName = prospect.cityName || "Vancouver";
  const angle = getDraftAngle(prospect, cityName);
  const subject = getDraftSubject(prospect, cityName);
  const opening = `Hi ${prospect.businessName} team,`;
  const body = [
    opening,
    "",
    `I'm with CityAtlas, a city guide focused on source-backed local routes and better local business visibility in ${cityName}.`,
    "",
    `We're preparing a small manual review batch for ${angle}. If CityAtlas drafted a factual mention or visibility page for ${prospect.businessName}, would you be open to a quick review of the details before anything public is treated as final?`,
    "",
    "No rush and no obligation. We're keeping the first batch small and review-first so the quality stays real.",
    "",
    "Best,",
    "CityAtlas team",
    "CityAtlas",
    "https://city.univenturestudio.com",
    "",
    'If this is not relevant, no worries and I will not follow up without a separate reason.',
  ].join("\n");

  return {
    subject,
    opening,
    body,
    angle,
  };
}

function getDraftSubject(prospect: BusinessProspect, cityName: string) {
  const text = `${prospect.category} ${prospect.segment}`.toLowerCase();
  if (/hotel|guest|concierge/.test(text)) {
    return `Possible CityAtlas guest-guide visibility for ${prospect.businessName}`;
  }
  if (/event|celebration|planner|venue/.test(text)) {
    return `Possible CityAtlas hosted-visit feature for ${prospect.businessName}`;
  }
  if (/wellness|recovery|spa/.test(text)) {
    return `Possible CityAtlas wellness-route feature for ${prospect.businessName}`;
  }
  return `Possible CityAtlas ${cityName} feature for ${prospect.businessName}`;
}

function getDraftAngle(prospect: BusinessProspect, cityName: string) {
  const text = `${prospect.category} ${prospect.segment}`.toLowerCase();
  if (/hotel|guest|concierge/.test(text)) {
    return `${cityName} guest-hosting, first-visit, and premium hotel-support routes`;
  }
  if (/event|celebration|planner|venue/.test(text)) {
    return `${cityName} hosted-visit, celebration, and private-group planning routes`;
  }
  if (/wellness|recovery|spa/.test(text)) {
    return `${cityName} wellness reset and workplace planning routes`;
  }
  return `${cityName} local-discovery and business-visibility routes`;
}

function getMissingItems(
  prospect: BusinessProspect,
  role: ReturnType<typeof classifyBusinessProspectRole>,
) {
  const missing: string[] = [];
  if (!prospect.sourceProof.trim()) missing.push("Add source proof before review.");
  if (prospect.contactReadiness === "needs_research") {
    missing.push("Find a usable public contact path before rehearsal.");
  }
  if (!prospect.email && prospect.contactReadiness !== "needs_research") {
    missing.push("Direct email is still missing, so this is review-first rather than rehearsal-ready.");
  }
  if (prospect.sourceType === "manual_import") {
    missing.push("Reverify the imported contact path on the official source before any real send.");
  }
  if (prospect.sourceType === "source_backed_place" && role === "partner_and_anchor" && !prospect.email) {
    missing.push("This anchor can support public city guidance, but it still needs a cleaner business-development route.");
  }
  return missing;
}

function getStage(prospect: BusinessProspect, missing: string[]) {
  if (prospect.sourceType === "manual_import" && prospect.contactConfidence !== "high") {
    return "Review first";
  }
  if (prospect.outreachStatus === "approved_to_send" || prospect.outreachStatus === "draft_ready") {
    return "Rehearsal ready";
  }
  if (prospect.email && missing.every((item) => !/Find a usable public contact path/i.test(item))) {
    return "Rehearsal ready";
  }
  if (prospect.contactReadiness === "contact_path_ready") return "Review first";
  return "Hold";
}

function getPriorityScore(
  prospect: BusinessProspect,
  role: ReturnType<typeof classifyBusinessProspectRole>,
  stage: BusinessProofBatchCandidate["stage"],
) {
  const readiness =
    prospect.contactReadiness === "email_ready"
      ? 30
      : prospect.contactReadiness === "contact_path_ready"
        ? 14
        : 2;
  const source =
    prospect.sourceType === "manual_import"
      ? 14
      : prospect.sourceType === "proof_candidate"
        ? 10
        : 5;
  const roleBonus = role === "partner_candidate" ? 12 : 7;
  const stageBonus = stage === "Rehearsal ready" ? 16 : stage === "Review first" ? 8 : 0;
  const warmth =
    prospect.relationshipWarmth === "high"
      ? 6
      : prospect.relationshipWarmth === "medium"
        ? 3
        : 0;
  const confidence =
    prospect.contactConfidence === "high"
      ? 6
      : prospect.contactConfidence === "medium"
        ? 2
        : -2;
  return readiness + source + roleBonus + stageBonus + warmth + confidence;
}

function getWhyChosen(
  prospect: BusinessProspect,
  role: ReturnType<typeof classifyBusinessProspectRole>,
) {
  if (role === "partner_candidate") {
    return `${prospect.businessName} already behaves like a business-development target, not just a public city anchor.`;
  }
  return `${prospect.businessName} helps public city guidance and could become a business-development target once the contact route is clearer.`;
}

export function getBusinessSourceLane(prospect: BusinessProspect) {
  if (prospect.sourceType === "manual_import") {
    if (/city-sourcing donor/i.test(prospect.sourceLabel)) return "Roam city-sourcing donor";
    if (/rooms/i.test(prospect.sourceLabel)) return "Rooms venue donor seed";
    if (/roam/i.test(prospect.sourceLabel)) return "Roam donor business seed";
    return "CityAtlas donor business seed";
  }
  if (prospect.sourceType === "proof_candidate") return "CityAtlas founder proof queue";
  if (prospect.sourceType === "source_backed_place") return "CityAtlas source-backed anchor";
  return "CityAtlas manual review";
}

export function getBusinessBatchLane(prospect: BusinessProspect): BusinessBatchLane {
  const text = `${prospect.category} ${prospect.segment}`.toLowerCase();

  if (/cultural|gallery|museum/.test(text)) return "culture";
  if (/restaurant|bar|hospitality|cocktail|dinner|nightlife/.test(text)) return "hospitality";
  if (/hotel|guest|concierge/.test(text)) return "hotel_guest";
  if (/event|venue|planner|celebration|private-group/.test(text)) return "event_group";
  if (/wellness|recovery|massage|spa/.test(text)) return "wellness";
  if (/local business|coworking|studio|experience/.test(text)) return "local_business";
  return "other";
}

function buildReviewPacket(candidates: BusinessProofBatchCandidate[]) {
  if (candidates.length === 0) {
    return ["No business proof batch exists yet."];
  }
  return candidates.map((candidate, index) => {
    const blockerText = candidate.missing.length > 0
      ? ` Missing: ${candidate.missing.join(" ")}`
      : "";
    return `${index + 1}. ${candidate.businessName} - ${candidate.stage}. Batch lane: ${candidate.batchLane}. Source lane: ${candidate.sourceLane}. ${candidate.whyChosen}${blockerText}`;
  });
}

function getReadiness(candidates: BusinessProofBatchCandidate[]) {
  if (candidates.length === 0) return 0;
  const score = candidates.reduce((sum, candidate) => {
    if (candidate.stage === "Rehearsal ready") return sum + 100;
    if (candidate.stage === "Review first") return sum + 65;
    return sum + 25;
  }, 0);
  return Math.round(score / candidates.length);
}
