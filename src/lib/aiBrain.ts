import type { CityAtlasData } from "../types";

export interface BrainModuleProgress {
  id: string;
  name: string;
  progress: number;
  done: string[];
  remains: string[];
  nextStep: string;
}

export interface BrainRecommendation {
  id: string;
  priority: "now" | "next" | "later";
  title: string;
  why: string;
  action: string;
  gate: string;
}

export interface BrainQualityCheck {
  id: string;
  label: string;
  status: "pass" | "review" | "blocked";
  detail: string;
}

export interface CityAtlasBrain {
  stage: string;
  summary: string;
  moduleProgress: BrainModuleProgress[];
  recommendations: BrainRecommendation[];
  qualityChecks: BrainQualityCheck[];
  gaps: string[];
  averageProgress: number;
  nextBestBatch: string;
}

export interface ShadowOutreachDecision {
  candidateId: string;
  name: string;
  segment: string;
  fitScore: number;
  shadowScore: number;
  outreachStatus:
    | "not_started"
    | "draft_ready"
    | "approved_to_send"
    | "sent_manual"
    | "replied"
    | "not_fit";
  role:
    | "primary_manual_send"
    | "manual_confirm_then_send"
    | "backup_no_send"
    | "blocked_manual_lookup";
  reason: string;
  gate: string;
}

export interface ShadowOutreachPlan {
  currentStage: "shadow_mode_no_send" | "post_send_monitoring";
  recommendedBatchSize: number;
  primaryCount: number;
  manualConfirmCount: number;
  backupCount: number;
  blockedCount: number;
  sentManualCount: number;
  sendReadyCount: number;
  decisions: ShadowOutreachDecision[];
  nextAction: string;
}

export interface ReplyLearningSummary {
  totalLogs: number;
  meaningfulReplies: number;
  positiveReplies: number;
  packageDemandSignals: number;
  privatePreviewSignals: number;
  wrongContacts: number;
  bounces: number;
  concerns: number;
  nextAction: string;
}

const packageDemandPattern = /price|pricing|package|partner|cost|paid|subscription|membership/i;
const privatePreviewPattern = /preview|demo|screen.?share|walkthrough|show me|see it/i;

function percent(complete: number, total: number) {
  if (total === 0) return 0;
  return Math.round((complete / total) * 100);
}

function confidenceWeight(confidence: "high" | "medium" | "low") {
  if (confidence === "high") return 18;
  if (confidence === "medium") return 10;
  return 0;
}

function segmentWeight(segment: string) {
  if (/restaurant/i.test(segment)) return 6;
  if (/dessert|cafe/i.test(segment)) return 4;
  if (/cocktail|bar/i.test(segment)) return 3;
  if (/culture|gallery/i.test(segment)) return 2;
  if (/market/i.test(segment)) return 1;
  return 0;
}

function contactPenalty(contactPathType: string, contactConfidence: "high" | "medium" | "low") {
  let penalty = 0;
  if (contactConfidence === "low") penalty += 18;
  if (contactPathType === "protected_email_link") penalty += 4;
  if (contactPathType === "contact_page") penalty += 5;
  if (contactPathType === "needs_manual_lookup") penalty += 12;
  return penalty;
}

function getRole(decision: { shadowScore: number; contactConfidence: "high" | "medium" | "low" }) {
  if (decision.contactConfidence === "low") return "blocked_manual_lookup" as const;
  if (decision.shadowScore >= 88 && decision.contactConfidence === "high") {
    return "primary_manual_send" as const;
  }
  if (decision.shadowScore >= 65) return "manual_confirm_then_send" as const;
  return "backup_no_send" as const;
}

export function getReplyLearningSummary(data: CityAtlasData): ReplyLearningSummary {
  const sentManualCount = data.proofCandidates.filter(
    (candidate) => candidate.outreachStatus === "sent_manual",
  ).length;
  const meaningfulReplies = data.manualReplyLogs.filter((log) =>
    ["positive_demo", "positive_info", "neutral"].includes(log.sentiment),
  ).length;
  const positiveReplies = data.manualReplyLogs.filter((log) =>
    ["positive_demo", "positive_info"].includes(log.sentiment),
  ).length;
  const packageDemandSignals = data.manualReplyLogs.filter((log) =>
    packageDemandPattern.test(`${log.summary} ${log.nextStep}`),
  ).length;
  const privatePreviewSignals = data.manualReplyLogs.filter((log) =>
    privatePreviewPattern.test(`${log.summary} ${log.nextStep}`),
  ).length;
  const wrongContacts = data.manualReplyLogs.filter(
    (log) => log.sentiment === "wrong_contact",
  ).length;
  const bounces = data.manualReplyLogs.filter((log) => log.sentiment === "bounce").length;
  const concerns = data.manualReplyLogs.filter((log) => log.sentiment === "concern").length;

  let nextAction =
    sentManualCount > 0
      ? `First ${sentManualCount} manual email(s) are out; monitor replies, bounces, wrong-contact redirects, and concerns before any follow-up.`
      : "No reply outcomes logged yet; keep the proof loop in no-send planning mode.";
  if (concerns > 0) {
    nextAction = "Pause outreach and review the concern before any further send.";
  } else if (bounces > 0 || wrongContacts > 0) {
    nextAction = "Repair bounced or wrong-contact rows before considering any second batch.";
  } else if (packageDemandSignals >= 2) {
    nextAction = "Prepare a Stripe test-mode approval packet, but do not create account objects yet.";
  } else if (meaningfulReplies >= 5 || privatePreviewSignals >= 3) {
    nextAction = "Run an owner-approved follow-up pass and tighten the founding partner offer.";
  } else if (data.manualReplyLogs.length > 0) {
    nextAction = "Keep logging outcomes until there are 10 outcomes or 5 meaningful replies.";
  }

  return {
    totalLogs: data.manualReplyLogs.length,
    meaningfulReplies,
    positiveReplies,
    packageDemandSignals,
    privatePreviewSignals,
    wrongContacts,
    bounces,
    concerns,
    nextAction,
  };
}

export function getShadowOutreachPlan(data: CityAtlasData): ShadowOutreachPlan {
  const sentManualCount = data.proofCandidates.filter(
    (candidate) => candidate.outreachStatus === "sent_manual",
  ).length;
  const decisions = data.proofCandidates
    .map((candidate) => {
      const shadowScore = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            candidate.fitScore * 0.72 +
              confidenceWeight(candidate.contactConfidence) +
              segmentWeight(candidate.segment) -
              contactPenalty(candidate.contactPathType, candidate.contactConfidence),
          ),
        ),
      );
      const role = getRole({
        shadowScore,
        contactConfidence: candidate.contactConfidence,
      });
      const reasonParts = [
        `${candidate.fitScore} fit`,
        `${candidate.contactConfidence} contact confidence`,
        candidate.routeAngle,
      ];
      if (candidate.contactPathType === "contact_page") {
        reasonParts.push("general contact path needs a final human check");
      }
      if (candidate.contactPathType === "protected_email_link") {
        reasonParts.push("protected email link needs manual confirmation");
      }
      return {
        candidateId: candidate.id,
        name: candidate.name,
        segment: candidate.segment,
        fitScore: candidate.fitScore,
        shadowScore,
        outreachStatus: candidate.outreachStatus,
        role,
        reason: reasonParts.join("; "),
        gate:
          candidate.outreachStatus === "sent_manual"
            ? "Already sent manually; wait for a reply, bounce, or owner-approved follow-up decision."
            : role === "blocked_manual_lookup"
            ? "Do not send until the exact official contact path is verified."
            : "Owner must approve exact recipient, channel, copy, and logging workflow before any send.",
      };
    })
    .sort((a, b) => b.shadowScore - a.shadowScore || b.fitScore - a.fitScore);

  const primaryCount = decisions.filter((decision) => decision.role === "primary_manual_send").length;
  const manualConfirmCount = decisions.filter(
    (decision) => decision.role === "manual_confirm_then_send",
  ).length;
  const backupCount = decisions.filter((decision) => decision.role === "backup_no_send").length;
  const blockedCount = decisions.filter(
    (decision) => decision.role === "blocked_manual_lookup",
  ).length;
  const sendReadyCount = primaryCount + manualConfirmCount;

  return {
    currentStage: sentManualCount > 0 ? "post_send_monitoring" : "shadow_mode_no_send",
    recommendedBatchSize: Math.min(10, sendReadyCount),
    primaryCount,
    manualConfirmCount,
    backupCount,
    blockedCount,
    sentManualCount,
    sendReadyCount,
    decisions,
    nextAction:
      sentManualCount > 0
        ? "First manual batch is already sent. Use this ranking only for held rows, reply triage, and future owner-approved follow-up decisions."
        : blockedCount > 0
        ? "Remove or verify blocked contacts before approving a manual proof sprint."
        : "Use the shadow ranking as the owner-review order; no send is approved by the ranking itself.",
  };
}

export function getCityAtlasBrain(data: CityAtlasData): CityAtlasBrain {
  const lockedGates = data.launchGates.filter((gate) => gate.status === "locked").length;
  const proofCandidates = data.proofCandidates.length;
  const replyLogs = data.manualReplyLogs.length;
  const replySummary = getReplyLearningSummary(data);
  const shadowPlan = getShadowOutreachPlan(data);
  const sentManualCount = data.proofCandidates.filter(
    (candidate) => candidate.outreachStatus === "sent_manual",
  ).length;
  const contactPathsReady = data.proofCandidates.filter(
    (candidate) => candidate.contactConfidence !== "low",
  ).length;
  const highConfidenceContactPaths = data.proofCandidates.filter(
    (candidate) => candidate.contactConfidence === "high",
  ).length;
  const packageDemandSignals = replySummary.packageDemandSignals;
  const hasPrivatePreview = data.growthEvents.some(
    (event) => event.name === "private_preview_viewed",
  );
  const hasMissions = data.cityMissions.length >= 3;
  const hasProofSprint = data.proofSprints.length > 0;
  const hasRevenueExperiments = data.revenueExperiments.length > 0;
  const guideQueryCoverage = new Set(data.guides.map((guide) => guide.queryClass)).size;
  const guidesWithProofSources = data.guides.filter((guide) => guide.proofSource).length;
  const guidesReadyForReview = data.guides.filter(
    (guide) => guide.gateDecision === "ready_for_review",
  ).length;
  const guidesWithInternalLinks = data.guides.filter((guide) => guide.internalLinkTarget).length;
  const sourceBackedCollectionCount = new Set(
    data.sourceBackedPlaces.map((reference) => reference.collection),
  ).size;
  const sourceBackedCollectionPlaceCounts = Object.values(
    data.sourceBackedPlaces.reduce<Record<string, number>>((counts, reference) => {
      counts[reference.collection] = (counts[reference.collection] ?? 0) + 1;
      return counts;
    }, {}),
  );
  const sourceBackedCollectionsAreComplete =
    sourceBackedCollectionPlaceCounts.length === sourceBackedCollectionCount &&
    sourceBackedCollectionPlaceCounts.every((count) => count === 5);
  const usefulPieceCount = data.guides.length + sourceBackedCollectionCount;
  const hasFirstTimeVisitorReleaseQueue = data.sourceBackedPlaces.some(
    (reference) => reference.collection === "vancouver_first_time_visitor_starters",
  );
  const hasWellnessResetReleaseQueue = data.sourceBackedPlaces.some(
    (reference) => reference.collection === "vancouver_wellness_reset_starters",
  );
  const hasFirstSourceBackedReleaseQueue =
    hasFirstTimeVisitorReleaseQueue && hasWellnessResetReleaseQueue;
  const queuedSourceBackedReleaseCollections = [
    "vancouver_first_time_visitor_starters",
    "vancouver_wellness_reset_starters",
    "vancouver_out_of_town_guest_starters",
    "vancouver_weekend_route_starters",
    "vancouver_sunday_starters",
    "vancouver_returning_visitor_starters",
    "vancouver_kitsilano_scenic_starters",
    "vancouver_west_side_daytime_starters",
    "vancouver_false_creek_culture_starters",
    "vancouver_ubc_discovery_starters",
    "vancouver_garden_day_starters",
  ] as const;
  const queuedSourceBackedReleaseCount = queuedSourceBackedReleaseCollections.filter((collection) =>
    data.sourceBackedPlaces.some((reference) => reference.collection === collection),
  ).length;
  const hasExpandedReleaseLadder = queuedSourceBackedReleaseCount >= 11;

  const moduleProgress: BrainModuleProgress[] = [
    {
      id: "public-product",
      name: "Public product package",
      progress: percent(
        [
          data.businesses.length > 0,
          data.guides.length > 0,
          data.cityMissions.length > 0,
          data.packages.length > 0,
          data.launchGates.length > 0,
        ].filter(Boolean).length,
        5,
      ),
      done: [
        "Public discovery shell",
        "Business packages",
        "City Missions",
        "Launch gates",
      ],
      remains: [
        "Real source-approved inventory",
        "Public indexing decision",
        "Final brand/domain comfort",
      ],
      nextStep: "Use the live custom domain for crawlable route-logic pages while real inventory and business publication stay gated.",
    },
    {
      id: "ranking-engine",
      name: "Ranking engine",
      progress: percent(
        [
          data.guides.length >= 5,
          guideQueryCoverage >= 5,
          guidesWithProofSources === data.guides.length,
          guidesWithInternalLinks === data.guides.length,
          guidesReadyForReview >= 1,
          hasMissions,
        ].filter(Boolean).length,
        6,
      ),
      done: [
        "Guide detail pages",
        "High-intent Vancouver query cluster",
        "Guide CTA paths",
        "Internal-link targets",
        "Proof-source labels",
        `${sourceBackedCollectionCount} source-backed wedge collections`,
      ],
      remains: hasFirstSourceBackedReleaseQueue
        ? [
            "Release approval for the first-time visitor and wellness wedges",
            "Hosted smoke after the next source-backed deploy",
            "More source-backed destination pages",
          ]
        : [
            "Real source-backed publishable pages",
            "Hosted crawlable release",
            "More source-backed destination pages",
          ],
      nextStep: hasExpandedReleaseLadder
        ? "Use the queued nine-step source-backed release ladder in order, keep the later routing-only packets separate behind it, and only add another wedge if official sources make the answer materially better than a generic city guide."
        : hasFirstSourceBackedReleaseQueue
        ? "Use the combined source-backed release queue packet to move first-time visitor and wellness from local-ready to hosted-proof-ready, keep the second and Sunday queues isolated behind it, then only expand where official sources stay strong."
        : "Turn the strongest draft guide into the first real source-backed page, then ship the rest of the cluster behind the same gate.",
    },
    {
      id: "proof-sprint",
      name: "Date Night proof sprint",
      progress: percent(
        [
          hasProofSprint,
          proofCandidates >= 10,
          contactPathsReady >= 8,
          shadowPlan.sendReadyCount >= 9,
          sentManualCount >= 6,
          hasPrivatePreview,
          replyLogs > 0,
          data.launchGates.some((gate) => gate.id === "gate-admin-protection"),
        ].filter(Boolean).length,
        8,
      ),
      done: [
        "First wedge selected",
        "10 source-backed candidates",
        "Official contact-path research",
        "Shadow-mode outreach ranking",
        "Private preview route",
        sentManualCount > 0 ? `${sentManualCount} manual emails sent` : "Manual send ledger",
      ],
      remains: [
        "Reply and bounce monitoring",
        "Held contact-path confirmation",
        "Reply and objection evidence",
      ],
      nextStep: "Monitor the first manual batch, log every reply or bounce, and do not send follow-ups without a new approval.",
    },
    {
      id: "founder-crm",
      name: "Founder CRM",
      progress: percent(
        [
          proofCandidates >= 10,
          data.proofCandidates.every((candidate) => candidate.sourceUrl),
          contactPathsReady >= 8,
          shadowPlan.sendReadyCount >= 9,
          sentManualCount >= 6,
          replyLogs > 0,
          data.manualReplyLogs.some((log) => log.sentiment === "positive_demo"),
        ].filter(Boolean).length,
        7,
      ),
      done: [
        "Candidate queue",
        "Fit scoring",
        "Route angles",
        "Source links",
        "Contact-path confidence tags",
        "Shadow send/no-send roles",
        "First manual send statuses",
      ],
      remains: [
        "Real reply history",
        "Objection clustering",
        "Follow-up reminders",
      ],
      nextStep: "Classify replies, bounces, wrong-contact redirects, and concerns as they arrive.",
    },
    {
      id: "automation-brain",
      name: "Automation Brain",
      progress: percent(
        [
          data.growthEvents.length > 0,
          data.revenueExperiments.length > 0,
          data.proofCandidates.length > 0,
          contactPathsReady >= 8,
          shadowPlan.sendReadyCount >= 9,
          sentManualCount >= 6,
          data.manualReplyLogs.length > 0,
          lockedGates === 0,
        ].filter(Boolean).length,
        8,
      ),
      done: [
        "Local event log",
        "Revenue experiment records",
        "Rules-based module scoring",
        "Contact readiness and package-demand signal checks",
        "Shadow-mode outreach decisioning",
        "Post-send monitoring state",
      ],
      remains: [
        "Outcome-based recommendation tuning",
        "Reply summaries from real outcomes",
        "Follow-up recommendations after reply evidence",
        "Provider-backed AI summaries after approval",
      ],
      nextStep: "Use local reply logs as the first real learning signal before adding model calls.",
    },
    {
      id: "revenue",
      name: "Revenue system",
      progress: percent(
        [
          hasRevenueExperiments,
          data.packages.length >= 3,
          data.submissions.length > 0,
          replyLogs > 0,
          packageDemandSignals > 0,
          data.launchGates.find((gate) => gate.id === "gate-payments")?.status !== "locked",
        ].filter(Boolean).length,
        6,
      ),
      done: [
        "Package framing",
        "Pricing test records",
        "Payment-disabled business flow",
      ],
      remains: [
        "Real buyer conversations",
        "Package yes/no evidence",
        "Terms and Stripe approval",
      ],
      nextStep: "Do not enable payment until manual conversations show package demand.",
    },
  ];

  const averageProgress = Math.round(
    moduleProgress.reduce((total, module) => total + module.progress, 0) /
      moduleProgress.length,
  );

  const recommendations: BrainRecommendation[] = [
    ...(hasExpandedReleaseLadder
      ? [
          {
            id: "protect-release-ladder",
            priority: "now" as const,
            title: "Protect the nine-step source-backed release ladder",
            why: `CityAtlas now has ${usefulPieceCount} useful local pieces and ${queuedSourceBackedReleaseCount} queued source-backed collections that are already packaged into a release order.`,
            action:
              "Keep the first-time visitor and wellness packet first, preserve the guest, weekend, Sunday, returning, Kitsilano, west-side, False Creek, UBC discovery, and garden-day packets behind it, and avoid adding filler pages that muddy the release truth.",
            gate: "Separate live deploy approval plus hosted post-release smoke for each packet.",
          },
        ]
      : hasFirstSourceBackedReleaseQueue
      ? [
          {
            id: "queue-source-backed-release",
            priority: "now" as const,
            title: "Queue the next two source-backed wedges for release review",
            why: `CityAtlas now has ${usefulPieceCount} useful local pieces, and the first-time visitor plus wellness wedges are already locally proven under the trust-first source policy.`,
            action:
              "Use the combined release queue packet, then run hosted smoke on the four routes plus sitemap.xml and llms.txt only after explicit deploy approval.",
            gate: "Separate live deploy approval plus hosted post-release smoke.",
          },
        ]
      : []),
    {
      id: "domain-proof-complete",
      priority: "now",
      title: "Use the custom domain as the public crawlable surface",
      why: "Cloudflare DNS, Vercel aliasing, HTTPS, crawlable robots.txt, and hosted route gates have been verified for the Univenture subdomain.",
      action: "Keep strengthening public route-logic pages at city.univenturestudio.com while admin/private-preview access stays disabled on hosted builds.",
      gate: "Real-business publication remains gated.",
    },
    {
      id: "ship-ranking-cluster",
      priority: "now",
      title: "Finish the first rankable city cluster",
      why: `CityAtlas now has ${data.guides.length} answer-first guides, ${sourceBackedCollectionCount} source-backed wedge collections, and ${guideQueryCoverage} distinct query classes, which is enough to shape classification around city-planning intent instead of a generic directory.`,
      action:
        "After the queued release review, keep the second, Sunday, and returning-visitor source-backed queues isolated, then only expand with source-backed pages that official public sources can honestly support; keep the work-friendly cafe wedge deferred until stronger evidence exists.",
      gate: "Real-source publication approval for any new named-venue pages.",
    },
    {
      id: "run-ten-prospect-sprint",
      priority: "now",
      title: "Monitor the first manual proof batch",
      why: `The first ${sentManualCount || 6} direct-email proof-sprint messages are out; the missing signal is replies, bounces, wrong-contact redirects, or concerns.`,
      action: "Watch Gmail, log every outcome in the reply tracker, and pause before any follow-up or second batch.",
      gate: "Additional outreach and follow-ups require a new explicit approval.",
    },
    {
      id: "train-on-replies",
      priority: "next",
      title: "Turn replies into the first learning dataset",
      why: "Reply sentiment and objections are the highest-value data for positioning, pricing, and future automation.",
      action: "Use the reply tracker to classify each conversation and update the sales packet after 10 replies or no-replies.",
      gate: "No extra live gate; local logging only.",
    },
    {
      id: "package-demand-score",
      priority: "next",
      title: "Score package demand before Stripe setup",
      why: "Stripe should follow evidence that at least a few businesses understand and want the founding partner package.",
      action: "Track every pricing/package mention in reply logs, then create Stripe test-mode products only after 2 to 3 qualified package signals.",
      gate: "Stripe account write approval.",
    },
    {
      id: "shadow-mode-outreach",
      priority: "now",
      title: "Keep held rows in shadow mode",
      why: `The Brain still has ${shadowPlan.manualConfirmCount} confirm-first rows and ${shadowPlan.backupCount} backup row(s) that should not be contacted without cleaner paths.`,
      action: "Use the ranking to decide whether to confirm Thierry, Keefer, Granville Island, or replace them before any second batch.",
      gate: "No additional sending without approval.",
    },
  ];

  const gaps = [
    lockedGates > 0 ? `${lockedGates} live-risk gates remain locked.` : "",
    hasFirstSourceBackedReleaseQueue
      ? "First-time visitor and wellness wedges are locally proven but still need release approval and hosted smoke."
      : "",
    contactPathsReady < proofCandidates
      ? `${proofCandidates - contactPathsReady} prospects still need stronger contact-path verification.`
      : "",
    sentManualCount > 0 && replyLogs === 0
      ? `${sentManualCount} manual emails are sent, but no replies or bounces are logged yet.`
      : replyLogs === 0
      ? "No real replies logged yet, so sales learning is still unproven."
      : "",
    shadowPlan.sendReadyCount < 9
      ? `${9 - shadowPlan.sendReadyCount} more candidates need send-ready shadow approval.`
      : "",
    packageDemandSignals === 0
      ? "No package-demand language has been logged yet, so Stripe activation is still premature."
      : "",
    guideQueryCoverage < 5
      ? `${5 - guideQueryCoverage} more distinct guide query classes are needed for the first ranking cluster.`
      : "",
    guidesReadyForReview === 0
      ? "No guide is marked ready for review yet, so the ranking cluster is still draft-only."
      : "",
    data.submissions.length === 0 ? "No business review requests captured in this browser state." : "",
    !hasPrivatePreview ? "Private preview has not been viewed in this local browser state yet." : "",
  ].filter(Boolean);

  const qualityChecks: BrainQualityCheck[] = [
    {
      id: "contact-paths",
      label: "Contact-path readiness",
      status: highConfidenceContactPaths >= 6 && contactPathsReady >= 10 ? "pass" : "review",
      detail:
        "Official contact paths are researched and confidence-tagged before any owner-approved manual outreach.",
    },
    {
      id: "shadow-outreach",
      label: "Shadow outreach ranking",
      status: shadowPlan.sendReadyCount >= 9 && shadowPlan.blockedCount === 0 ? "pass" : "review",
      detail:
        sentManualCount > 0
          ? "The Brain keeps held rows and future follow-ups in shadow mode after the first owner-approved manual send."
          : "The Brain ranks manual send, confirm-first, backup, and blocked recipients without approving any outreach.",
    },
    {
      id: "payment-disabled",
      label: "Payment safety",
      status: data.launchGates.find((gate) => gate.id === "gate-payments")?.status === "locked"
        ? "pass"
        : "review",
      detail:
        "Stripe/payment acceptance stays disabled until pricing, terms, and owner approval are explicit.",
    },
    {
      id: "candidate-sources",
      label: "Candidate source coverage",
      status:
        proofCandidates >= 10 && data.proofCandidates.every((candidate) => candidate.sourceUrl)
          ? "pass"
          : "blocked",
      detail:
        "The first Date Night candidate queue has official source URLs saved for review.",
    },
    {
      id: "admin-protection",
      label: "Admin/private preview protection",
      status: "pass",
      detail:
        "Hosted custom-domain builds hide owner routes by default; admin and private preview remain off unless deliberately enabled.",
    },
    {
      id: "reply-learning",
      label: "Sales learning signal",
      status: replyLogs > 0 ? "review" : "blocked",
      detail: replySummary.nextAction,
    },
    {
      id: "guide-cluster",
      label: "Guide cluster coverage",
      status:
        data.guides.length >= 5 && guideQueryCoverage >= 5 && guidesWithInternalLinks === data.guides.length
          ? "pass"
          : "review",
      detail:
        "The first ranking cluster should cover distinct Vancouver intents with answer-first pages, explicit internal links, and clear CTA paths.",
    },
    {
      id: "seo-content-machine",
      label: "SEO content-machine integrity",
      status:
        usefulPieceCount >= 10 &&
          guidesWithProofSources === data.guides.length &&
          guidesWithInternalLinks === data.guides.length &&
          sourceBackedCollectionsAreComplete
          ? "pass"
          : "review",
      detail:
        "CityAtlas should keep the answer-first guide cluster, source-backed wedge sets, proof fields, and internal-link structure intact before any next release packet moves live.",
    },
    {
      id: "guide-proof-gates",
      label: "Guide proof and gate tracking",
      status:
        guidesWithProofSources === data.guides.length && guidesReadyForReview > 0
          ? "review"
          : "blocked",
      detail:
        "Each guide should show proof-source expectations and whether it is draft-only, needs real sources, or is public-safe route logic.",
    },
    {
      id: "package-demand",
      label: "Package demand signal",
      status: packageDemandSignals > 0 ? "review" : "blocked",
      detail:
        "Stripe setup should wait until reply logs show qualified package, pricing, or partnership demand.",
    },
  ];

  return {
    stage: sentManualCount > 0 ? "Post-send monitoring" : "Assisted automation",
    summary:
      sentManualCount > 0
        ? `CityAtlas now has a locally proven Vancouver ranking cluster with ${usefulPieceCount} useful pieces, complete five-anchor source-backed wedges across ${sourceBackedCollectionCount} collections, and has sent the first ${sentManualCount} owner-approved Date Night emails. The Brain should protect the queued source-backed release ladder while learning from replies, bounces, wrong-contact redirects, and concerns before any follow-up.`
        : `CityAtlas can now organize a proof sprint, run a ${usefulPieceCount}-piece local ranking cluster with complete five-anchor source-backed wedges across ${sourceBackedCollectionCount} collections, shadow-rank prospects, show a private preview, and log manual replies. It is not autonomous yet because no real reply outcomes or approved live actions exist.`,
    moduleProgress,
    recommendations,
    qualityChecks,
    gaps,
    averageProgress,
    nextBestBatch:
      sentManualCount > 0
        ? hasExpandedReleaseLadder
          ? "Keep the first-time visitor and wellness packet as the next live-ready step, preserve the guest, weekend, Sunday, returning, Kitsilano, west-side, False Creek, UBC discovery, and garden-day packets behind it, keep work-friendly cafe deferred until stronger official-source support exists, and log every reply or bounce before any second send batch."
          : hasFirstSourceBackedReleaseQueue
          ? "Finish the combined first-time visitor and wellness release queue, keep the second, Sunday, and returning-visitor source-backed queues isolated behind it, keep the work-friendly cafe wedge deferred until stronger official-source support exists, and log every reply or bounce before any second send batch."
          : "Monitor the first six manual emails, log each reply or bounce, keep strengthening the guide cluster, then decide whether to prepare a protected preview response or a second approved batch."
        : hasExpandedReleaseLadder
          ? "Keep the nine-step source-backed release ladder and the later routing-only packets clean, use the first-time visitor and wellness packet as the next live-ready step, and add another wedge only if it strengthens a distinct city-intent cluster more than another generic route explainer would."
        : hasFirstSourceBackedReleaseQueue
          ? "Package first-time visitor and wellness as the next source-backed release queue, keep the second, Sunday, and returning-visitor source-backed queues isolated behind it, then keep the work-friendly cafe wedge deferred until stronger official-source support exists."
          : "Use the shadow outreach ranking to approve a manual-only first-founder proof loop while strengthening the first guide cluster for indexing readiness.",
  };
}
