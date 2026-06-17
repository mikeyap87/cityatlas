import type { BusinessProspect } from "../types";
import { buildBusinessProofCandidate } from "./businessOutreachPrep.ts";
import { isPartnerEligibleProspect } from "./cityGrowth.ts";
import { slugify } from "./format.ts";

export type BusinessSupervisedOutreachMode = "blocked" | "dry_run" | "live";

export interface BusinessSupervisedOutreachSetup {
  provider: "Resend";
  mode: BusinessSupervisedOutreachMode;
  enabled: boolean;
  canRunDryRun: boolean;
  statusLabel: string;
  detail: string;
}

export interface BusinessSupervisedPacket {
  ready: boolean;
  recipient: string;
  subject: string;
  textBody: string;
  mode: BusinessSupervisedOutreachMode;
  missing: string[];
  summary: string;
  safetyChecks: string[];
  idempotencyKey: string;
}

export interface BusinessSupervisedExecutionMetric {
  label: string;
  value: string;
  score: number;
  target: string;
}

export interface BusinessSupervisedExecutionQueueRow {
  prospectId: string;
  businessName: string;
  stage: string;
  sourceLane: string;
  contactRoute: string;
  packet: BusinessSupervisedPacket;
  status: string;
  allowlisted: boolean;
  hasDryRun: boolean;
  liveReviewReady: boolean;
  liveReviewStatus: string;
  blockedReason: string;
  nextAction: string;
  canAllowlist: boolean;
  canMarkDryRun: boolean;
  canStageLiveReview: boolean;
  score: number;
}

export interface BusinessSupervisedExecutionLaneReport {
  readiness: number;
  title: string;
  summary: string;
  nextAction: string;
  guardrail: string;
  metrics: BusinessSupervisedExecutionMetric[];
  queue: BusinessSupervisedExecutionQueueRow[];
  caps: {
    allowlisted: number;
    allowlistCap: number;
    dryRunsPrepared: number;
    dryRunCapPerDay: number;
    liveReviewsReady: number;
    liveReviewCapPerDay: number;
  };
}

export const businessSupervisedExecutionPolicy = {
  allowlistCap: 5,
  liveReviewCapPerDay: 1,
  dryRunCapPerDay: 3,
} as const;

export function getBusinessSupervisedOutreachSetup(): BusinessSupervisedOutreachSetup {
  return {
    provider: "Resend",
    mode: "blocked",
    enabled: false,
    canRunDryRun: false,
    statusLabel: "Scaffolded locally",
    detail:
      "CityAtlas can stage packet truth, allowlist review, and local dry-run review notes, but no protected provider send lane is active here.",
  };
}

export function buildBusinessSupervisedPacket(
  prospect: BusinessProspect,
  setup = getBusinessSupervisedOutreachSetup(),
): BusinessSupervisedPacket {
  const candidate = buildBusinessProofCandidate(prospect);
  const recipient = prospect.email.trim().toLowerCase();
  const missing: string[] = [];

  if (!isPartnerEligibleProspect(prospect)) {
    missing.push("This row is still anchor support only, not a business-send candidate.");
  }
  if (!recipient) {
    missing.push("A direct public email is still missing.");
  } else if (!isValidBusinessEmail(recipient)) {
    missing.push("The direct email still needs format re-verification.");
  }
  if (candidate.stage !== "Rehearsal ready") {
    missing.push(candidate.missing[0] || "This row is still review-first, not rehearsal-ready.");
  }
  if (!prospect.sourceProof.trim()) {
    missing.push("Source proof is still missing.");
  }
  if (prospect.approvalStatus === "blocked") {
    missing.push("This row is blocked from supervised execution.");
  }
  if (prospect.outreachStatus === "do_not_contact") {
    missing.push("This row is marked do not contact.");
  }
  if (prospect.outreachStatus === "sent_manual" || prospect.outreachStatus === "replied") {
    missing.push("This row is already in the manual/reply history and should not be re-staged here.");
  }

  return {
    ready: missing.length === 0,
    recipient,
    subject: candidate.draft.subject,
    textBody: candidate.draft.body,
    mode: setup.mode,
    missing,
    summary:
      missing.length === 0
        ? "This row is ready for allowlist review and a local dry-run packet."
        : `Still blocked: ${missing[0]}`,
    safetyChecks: [
      "This lane is local-only and non-sending.",
      "Owner approval is still required before any real send is considered.",
      "No Gmail, Resend, CRM, webhook, or contact form is activated here.",
      "Keep the first live review to one exact business at a time.",
    ],
    idempotencyKey: `cityatlas-${prospect.id}-${slugify(candidate.draft.subject)}`.slice(0, 120),
  };
}

export function buildBusinessSupervisedExecutionLaneReport({
  prospects,
  setup = getBusinessSupervisedOutreachSetup(),
}: {
  prospects: BusinessProspect[];
  setup?: BusinessSupervisedOutreachSetup;
}): BusinessSupervisedExecutionLaneReport {
  const allowlistedCount = prospects.filter(
    (prospect) => prospect.supervisedAllowlistStatus === "Allowlisted",
  ).length;
  const dryRunsPrepared = prospects.filter(
    (prospect) => prospect.supervisedSendStatus === "Dry run prepared",
  ).length;
  const liveReviewsReady = prospects.filter(
    (prospect) => prospect.supervisedLiveReviewStatus === "Ready for approval",
  ).length;

  const queue = prospects
    .filter((prospect) =>
      prospect.contactReadiness === "email_ready"
      || prospect.supervisedAllowlistStatus === "Allowlisted"
      || prospect.supervisedSendStatus === "Dry run prepared"
      || prospect.supervisedLiveReviewStatus === "Ready for approval",
    )
    .map((prospect) =>
      evaluateBusinessProspectForSupervisedLane(
        prospect,
        allowlistedCount,
        liveReviewsReady,
        setup,
      ),
    )
    .sort((left, right) =>
      Number(right.liveReviewReady) - Number(left.liveReviewReady)
      || Number(right.allowlisted) - Number(left.allowlisted)
      || Number(right.packet.ready) - Number(left.packet.ready)
      || right.score - left.score
      || left.businessName.localeCompare(right.businessName),
    );

  const metrics: BusinessSupervisedExecutionMetric[] = [
    {
      label: "Allowlist",
      value: `${allowlistedCount}/${businessSupervisedExecutionPolicy.allowlistCap}`,
      score: percent(allowlistedCount, businessSupervisedExecutionPolicy.allowlistCap),
      target: "Keep the supervised allowlist tiny and explicit.",
    },
    {
      label: "Dry runs staged",
      value: `${dryRunsPrepared}/${businessSupervisedExecutionPolicy.dryRunCapPerDay}`,
      score: percent(
        Math.min(dryRunsPrepared, businessSupervisedExecutionPolicy.dryRunCapPerDay),
        businessSupervisedExecutionPolicy.dryRunCapPerDay,
      ),
      target: "Only a few dry-run reviews should be staged before any live approval exists.",
    },
    {
      label: "Live review queue",
      value: `${liveReviewsReady}/${businessSupervisedExecutionPolicy.liveReviewCapPerDay}`,
      score: percent(
        Math.min(liveReviewsReady, businessSupervisedExecutionPolicy.liveReviewCapPerDay),
        businessSupervisedExecutionPolicy.liveReviewCapPerDay,
      ),
      target: "One exact live-review packet is enough at this stage.",
    },
    {
      label: "Packet-ready rows",
      value: `${queue.filter((row) => row.packet.ready).length}`,
      score: percent(queue.filter((row) => row.packet.ready).length, Math.max(queue.length, 1)),
      target: "Only rehearsal-ready direct-email rows should enter this lane.",
    },
  ];

  const readiness = Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length);
  const firstReady = queue.find((row) => row.liveReviewReady);
  const firstAllowlist = queue.find((row) => row.canAllowlist);
  const firstDryRun = queue.find((row) => row.canMarkDryRun);
  const firstBlocked = queue.find((row) => row.blockedReason);

  return {
    readiness,
    title:
      firstReady
        ? "Supervised execution packet is staged locally for later approval"
        : "Supervised execution lane still needs local staging before any live approval packet exists",
    summary:
      queue.length === 0
        ? "CityAtlas does not yet have any direct-email business rows in this city queue."
        : `${queue.length} direct-email row${queue.length === 1 ? "" : "s"} now sit inside the supervised lane view, but the provider rail remains blocked and local-only.`,
    nextAction:
      firstReady?.nextAction
      || firstDryRun?.nextAction
      || firstAllowlist?.nextAction
      || firstBlocked?.nextAction
      || "Widen the direct-email queue or improve rehearsal readiness before staging this lane.",
    guardrail:
      setup.mode === "live"
        ? "Even in live mode, this lane still needs explicit owner approval, a small allowlist, and a confirmation checkpoint before contacting anyone."
        : "This lane is still non-sending. It only stages packet truth, dry-run review notes, and live-review blockers locally.",
    metrics,
    queue: queue.slice(0, 8),
    caps: {
      allowlisted: allowlistedCount,
      allowlistCap: businessSupervisedExecutionPolicy.allowlistCap,
      dryRunsPrepared,
      dryRunCapPerDay: businessSupervisedExecutionPolicy.dryRunCapPerDay,
      liveReviewsReady,
      liveReviewCapPerDay: businessSupervisedExecutionPolicy.liveReviewCapPerDay,
    },
  };
}

function evaluateBusinessProspectForSupervisedLane(
  prospect: BusinessProspect,
  allowlistedCount: number,
  liveReviewsReady: number,
  setup: BusinessSupervisedOutreachSetup,
): BusinessSupervisedExecutionQueueRow {
  const candidate = buildBusinessProofCandidate(prospect);
  const packet = buildBusinessSupervisedPacket(prospect, setup);
  const allowlisted = prospect.supervisedAllowlistStatus === "Allowlisted";
  const hasDryRun = prospect.supervisedSendStatus === "Dry run prepared";
  const liveReviewStatus = prospect.supervisedLiveReviewStatus || "Not requested";
  const liveReviewReady = allowlisted && hasDryRun && liveReviewStatus === "Ready for approval";
  const canAllowlist =
    packet.ready &&
    !allowlisted &&
    allowlistedCount < businessSupervisedExecutionPolicy.allowlistCap;
  const canMarkDryRun = allowlisted && packet.ready && !hasDryRun;
  const canStageLiveReview =
    allowlisted &&
    hasDryRun &&
    packet.ready &&
    liveReviewStatus !== "Ready for approval" &&
    liveReviewsReady < businessSupervisedExecutionPolicy.liveReviewCapPerDay;

  let status = "Blocked";
  let blockedReason = packet.missing[0] || "";
  let nextAction = blockedReason || "Review this row locally.";

  if (liveReviewReady) {
    status = "Ready for approval";
    blockedReason = "";
    nextAction =
      setup.mode === "live"
        ? "This packet can move into a later explicit live approval step."
        : "Keep this packet local. The next live step still needs a separate provider approval.";
  } else if (canStageLiveReview) {
    status = "Stage live review";
    blockedReason = "";
    nextAction = "Stage one exact live-review packet locally. Do not send anything from CityAtlas.";
  } else if (canMarkDryRun) {
    status = "Dry run next";
    blockedReason = "";
    nextAction = "Record one local dry-run review after the owner-inbox rehearsal stays honest.";
  } else if (canAllowlist) {
    status = "Allowlist next";
    blockedReason = "";
    nextAction = "Add this row to the tiny supervised allowlist. Keep the cap small and explicit.";
  } else if (allowlisted && !hasDryRun) {
    status = "Dry run blocked";
    blockedReason = "Dry run review is still missing.";
    nextAction = "Record a local dry-run review before any live-review packet is staged.";
  } else if (allowlisted && hasDryRun && liveReviewStatus !== "Ready for approval") {
    status = "Live review blocked";
    blockedReason =
      liveReviewsReady >= businessSupervisedExecutionPolicy.liveReviewCapPerDay
        ? "The local live-review cap is already full."
        : "Live review has not been staged yet.";
    nextAction =
      liveReviewsReady >= businessSupervisedExecutionPolicy.liveReviewCapPerDay
        ? "Keep the next packet held until the current live-review slot is cleared."
        : "Stage a single local live-review packet and keep it no-send.";
  } else if (allowlistedCount >= businessSupervisedExecutionPolicy.allowlistCap && !allowlisted) {
    status = "Allowlist blocked";
    blockedReason = "The supervised allowlist cap is full.";
    nextAction = "Clear an older allowlisted row before adding another.";
  }

  return {
    prospectId: prospect.id,
    businessName: prospect.businessName,
    stage: candidate.stage,
    sourceLane: candidate.sourceLane,
    contactRoute: candidate.contactRoute,
    packet,
    status,
    allowlisted,
    hasDryRun,
    liveReviewReady,
    liveReviewStatus,
    blockedReason,
    nextAction,
    canAllowlist,
    canMarkDryRun,
    canStageLiveReview,
    score: candidate.score,
  };
}

function isValidBusinessEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}
