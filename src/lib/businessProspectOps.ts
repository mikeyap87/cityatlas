import type { BusinessProspect } from "../types";
import { shouldTreatProspectAsPartnerAnchor } from "./businessProspectRole.ts";

type BusinessProspectRole =
  | "anchor_only"
  | "partner_candidate"
  | "partner_and_anchor";

export type BusinessProspectPromotionLane =
  | "email_ready"
  | "protected_email_review"
  | "private_form_review"
  | "phone_text_review"
  | "official_path_review"
  | "warm_intro_review"
  | "manual_lookup"
  | "anchor_support_only";

const promotionLaneRank: Record<BusinessProspectPromotionLane, number> = {
  email_ready: 7,
  protected_email_review: 6,
  private_form_review: 5,
  phone_text_review: 4,
  official_path_review: 3,
  warm_intro_review: 2,
  manual_lookup: 1,
  anchor_support_only: 0,
};

function classifyProspectRole(prospect: BusinessProspect): BusinessProspectRole {
  if (prospect.sourceType !== "source_backed_place") {
    return "partner_candidate";
  }

  if (shouldTreatProspectAsPartnerAnchor(prospect)) {
    return "partner_and_anchor";
  }

  return "anchor_only";
}

function isPartnerEligible(prospect: BusinessProspect) {
  return classifyProspectRole(prospect) !== "anchor_only";
}

export function getBusinessProspectPromotionLane(
  prospect: BusinessProspect,
): BusinessProspectPromotionLane {
  if (prospect.email.trim()) {
    return "email_ready";
  }

  if (
    !isPartnerEligible(prospect)
    && classifyProspectRole(prospect) === "anchor_only"
  ) {
    return "anchor_support_only";
  }

  switch (prospect.contactPathType) {
    case "protected_email_link":
      return "protected_email_review";
    case "private_events_form":
      return "private_form_review";
    case "phone_or_text":
      return "phone_text_review";
    case "warm_intro":
      return "warm_intro_review";
    case "contact_page":
    case "official_site":
    case "reservation_platform":
      return "official_path_review";
    case "instagram_dm":
    case "needs_manual_lookup":
      return "manual_lookup";
    case "direct_email":
      return "email_ready";
    default:
      return prospect.contactReadiness === "needs_research"
        ? "manual_lookup"
        : "official_path_review";
  }
}

export function getBusinessProspectPromotionLabel(
  lane: BusinessProspectPromotionLane,
) {
  switch (lane) {
    case "email_ready":
      return "Email-ready";
    case "protected_email_review":
      return "Protected-email review";
    case "private_form_review":
      return "Private-form review";
    case "phone_text_review":
      return "Phone/text review";
    case "official_path_review":
      return "Official-path review";
    case "warm_intro_review":
      return "Warm-intro review";
    case "manual_lookup":
      return "Manual lookup";
    default:
      return "Anchor support only";
  }
}

export function getBusinessProspectNextStep(prospect: BusinessProspect) {
  const lane = getBusinessProspectPromotionLane(prospect);

  switch (lane) {
    case "email_ready":
      return "Reverify the public email on the official source before any owner-inbox rehearsal.";
    case "protected_email_review":
      return "Open the official site manually and confirm the protected email resolves to the right team before any rehearsal.";
    case "private_form_review":
      return "Confirm the official private-events or group-booking path and keep every submission blocked.";
    case "phone_text_review":
      return "Decide whether the public phone or text route is acceptable and capture a human note before rehearsal.";
    case "official_path_review":
      return "Confirm the best official contact page or form path in a manual browser before any outreach prep widens.";
    case "warm_intro_review":
      return "Keep this in a manual intro lane and do not let it drift into automated outreach.";
    case "anchor_support_only":
      return "Keep this as source-backed city coverage until a separate business-development route becomes relevant.";
    default:
      return "Find a stronger public contact path or direct email before this can move into rehearsal prep.";
  }
}

export function getBusinessProspectPromotionScore(prospect: BusinessProspect) {
  const lane = getBusinessProspectPromotionLane(prospect);
  const role = classifyProspectRole(prospect);
  const laneScore =
    lane === "email_ready"
      ? 120
      : lane === "protected_email_review"
        ? 88
        : lane === "private_form_review"
          ? 84
          : lane === "phone_text_review"
            ? 80
            : lane === "official_path_review"
              ? 74
              : lane === "warm_intro_review"
                ? 70
                : lane === "manual_lookup"
                  ? 38
                  : 18;
  const roleScore =
    role === "partner_candidate"
      ? 18
      : role === "partner_and_anchor"
        ? 10
        : 0;
  const confidenceScore =
    prospect.contactConfidence === "high"
      ? 12
      : prospect.contactConfidence === "medium"
        ? 7
        : 2;
  const warmthScore =
    prospect.relationshipWarmth === "high"
      ? 8
      : prospect.relationshipWarmth === "medium"
        ? 4
        : prospect.relationshipWarmth === "low"
          ? 1
          : 0;
  const sourceScore =
    prospect.sourceType === "manual_import"
      ? 10
      : prospect.sourceType === "proof_candidate"
        ? 8
        : prospect.sourceType === "manual_submission"
          ? 6
          : 3;
  const stageScore =
    prospect.outreachStatus === "approved_to_send"
      ? 12
      : prospect.outreachStatus === "draft_ready"
        ? 9
        : prospect.outreachStatus === "held"
          ? 4
          : 0;
  const researchPenalty = prospect.contactReadiness === "needs_research" ? 12 : 0;

  return laneScore + roleScore + confidenceScore + warmthScore + sourceScore + stageScore - researchPenalty;
}

export function isBusinessProspectPromotionCandidate(prospect: BusinessProspect) {
  const lane = getBusinessProspectPromotionLane(prospect);
  return (
    isPartnerEligible(prospect)
    && lane !== "email_ready"
    && lane !== "anchor_support_only"
  );
}

export function buildBusinessProspectPromotionLaneCounts(prospects: BusinessProspect[]) {
  const counts = new Map<BusinessProspectPromotionLane, number>();

  for (const prospect of prospects) {
    const lane = getBusinessProspectPromotionLane(prospect);
    counts.set(lane, (counts.get(lane) || 0) + 1);
  }

  return [...counts.entries()].sort((left, right) => {
    const laneCompare = promotionLaneRank[right[0]] - promotionLaneRank[left[0]];
    if (laneCompare !== 0) {
      return laneCompare;
    }

    return left[0].localeCompare(right[0]);
  });
}
