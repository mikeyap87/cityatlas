import { useMemo, useState } from "react";
import type {
  BrainRun,
  BusinessInboundMirrorEntry,
  BusinessProspect,
  BusinessReplyLog,
  CityAtlasData,
  ManualReplyLog,
} from "../../types";
import {
  getCoverageScore,
  getGateLabel,
  getLaunchReadiness,
  getPartnerPipelineValue,
  getPrimaryPartnerCandidates,
} from "../../lib/scoring";
import { getCityAtlasBrain, getShadowOutreachPlan } from "../../lib/aiBrain";
import {
  buildBusinessOwnerInboxBrief,
  buildBusinessProofBatchBrief,
} from "../../lib/businessOutreachPrep";
import {
  buildBusinessSupervisedExecutionLaneReport,
  getBusinessSupervisedOutreachSetup,
} from "../../lib/businessSupervisedExecution";
import {
  buildBusinessProspectPromotionLaneCounts,
  getBusinessProspectNextStep,
  getBusinessProspectPromotionLabel,
  getBusinessProspectPromotionLane,
  getBusinessProspectPromotionScore,
  isBusinessProspectPromotionCandidate,
} from "../../lib/businessProspectOps";
import {
  buildBusinessInboundAdapterPreview,
  buildBusinessProtectedInboundMirrorEntries,
  buildBusinessProtectedInboundMirrorReport,
  buildBusinessReplyBridgeReport,
  sampleBusinessResendInboundPayload,
} from "../../lib/businessInboundPreview";
import {
  buildCityRolloutInsights,
  buildCityBusinessRollups,
  classifyBusinessProspectRole,
  createImportedBusinessProspects,
  listUnseededCityInsights,
  parseBusinessProspectImport,
  rankFollowOnCityInsights,
} from "../../lib/cityGrowth";
import {
  buildConnectorCityRollups,
  buildNamedConnectorLaneSummaries,
  listConnectorWarmPathRows,
  listNamedConnectorRows,
  listOrganizationConnectorRows,
} from "../../lib/cityConnectorWarmPaths";
import { formatPercent } from "../../lib/format";
import { siteConfig } from "../../config/site";
import { BusinessMiniRow } from "../../components/Cards";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, LockIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import {
  EmptyState,
  MetricCard,
  ProgressBar,
  SafeModeNotice,
  SectionHeader,
  StatusPill,
} from "../../components/UI";

interface AdminConsoleProps {
  data: CityAtlasData;
  onImportBusinessProspects: (
    prospects: BusinessProspect[],
    sourceLabel?: string,
  ) => number | Promise<number>;
  onSetBusinessProspectSupervisedAllowlist: (prospectId: string, allowlisted: boolean) => void;
  onMarkBusinessProspectSupervisedDryRunPrepared: (prospectId: string) => void;
  onStageBusinessProspectSupervisedLiveReview: (prospectId: string) => void;
  onSaveBusinessInboundMirror: (
    entries: BusinessInboundMirrorEntry[],
  ) => number | Promise<number>;
  onReplayBusinessReplyBridgeEntry: (
    entryId: string,
  ) => BusinessReplyLog | undefined | Promise<BusinessReplyLog | undefined>;
  onLogManualReply: (input: {
    candidateId: string;
    channel: ManualReplyLog["channel"];
    sentiment: ManualReplyLog["sentiment"];
    messageVersion: string;
    summary: string;
    nextStep: string;
  }) => ManualReplyLog | undefined | Promise<ManualReplyLog | undefined>;
  onSaveBrainRun: (input: {
    stage: string;
    summary: string;
    topRecommendation: string;
    topGate: string;
    openGaps: number;
    averageProgress: number;
  }) => BrainRun | Promise<BrainRun>;
  onMarkGateReady: (gateId: string) => void;
  onResetDemo: () => void | Promise<void>;
}

function getProspectPriority(prospect: BusinessProspect) {
  const role =
    classifyBusinessProspectRole(prospect) === "partner_candidate"
      ? 14
      : classifyBusinessProspectRole(prospect) === "partner_and_anchor"
        ? 9
        : 0;
  const readiness =
    prospect.contactReadiness === "email_ready"
      ? 30
      : prospect.contactReadiness === "contact_path_ready"
        ? 18
        : 6;
  const confidence =
    prospect.contactConfidence === "high"
      ? 12
      : prospect.contactConfidence === "medium"
        ? 7
        : 2;
  const source =
    prospect.sourceType === "manual_import"
      ? 9
      : prospect.sourceType === "proof_candidate"
        ? 7
      : prospect.sourceType === "manual_submission"
          ? 5
          : 3;
  return role + readiness + confidence + source;
}

function getProspectTone(prospect: BusinessProspect) {
  if (prospect.contactReadiness === "email_ready") return "green" as const;
  if (prospect.contactReadiness === "contact_path_ready") return "blue" as const;
  return "amber" as const;
}

function getBusinessBatchCandidateTone(stage: string) {
  if (stage === "Rehearsal ready") return "green" as const;
  if (stage === "Review first") return "blue" as const;
  return "amber" as const;
}

function getBusinessInboundTone(status: "Valid" | "Needs identity" | "Invalid") {
  if (status === "Valid") return "green" as const;
  if (status === "Needs identity") return "blue" as const;
  return "amber" as const;
}

function getBusinessBridgeTone(status: string) {
  if (status === "Bridge ready" || status === "Replayed") return "green" as const;
  if (status === "Review needed" || status === "Duplicate") return "blue" as const;
  return "amber" as const;
}

function getBusinessSupervisedTone(status: string) {
  if (status === "Ready for approval" || status === "Stage live review") return "green" as const;
  if (status === "Dry run next" || status === "Allowlist next") return "blue" as const;
  return "amber" as const;
}

function getConnectorStatusTone(status: "named_ready" | "organization_ready" | "not_staged") {
  if (status === "named_ready") return "green" as const;
  if (status === "organization_ready") return "blue" as const;
  return "amber" as const;
}

function getConnectorRouteTone(routeType: "organization" | "named_person") {
  return routeType === "named_person" ? ("green" as const) : ("blue" as const);
}

type BusinessQueueFocus =
  | "all"
  | "promotion_candidates"
  | "email_ready"
  | "contact_path_ready"
  | "needs_research";

function formatPhrase(value: string) {
  return value.replaceAll("_", " ");
}

function isExternalHref(value: string) {
  return /^https?:\/\//.test(value) || value.startsWith("mailto:") || value.startsWith("tel:");
}

function getQueueFocusLabel(focus: BusinessQueueFocus) {
  switch (focus) {
    case "promotion_candidates":
      return "Promotion candidates";
    case "email_ready":
      return "Email-ready";
    case "contact_path_ready":
      return "Contact-path review";
    case "needs_research":
      return "Needs research";
    default:
      return "All rows";
  }
}

function getReviewFirstContactPathCount(rollup: { contactReadyCount: number; emailReadyCount: number }) {
  return Math.max(0, rollup.contactReadyCount - rollup.emailReadyCount);
}

export function AdminConsole({
  data,
  onImportBusinessProspects,
  onSetBusinessProspectSupervisedAllowlist,
  onMarkBusinessProspectSupervisedDryRunPrepared,
  onStageBusinessProspectSupervisedLiveReview,
  onSaveBusinessInboundMirror,
  onReplayBusinessReplyBridgeEntry,
  onLogManualReply,
  onSaveBrainRun,
  onMarkGateReady,
  onResetDemo,
}: AdminConsoleProps) {
  const supervisedOutreachSetup = useMemo(
    () => getBusinessSupervisedOutreachSetup(),
    [],
  );
  const launchReadiness = getLaunchReadiness(data);
  const coverage = getCoverageScore(data);
  const pipeline = getPartnerPipelineValue(data);
  const candidates = getPrimaryPartnerCandidates(data);
  const proofCandidates = data.proofCandidates
    .slice()
    .sort((a, b) => b.fitScore - a.fitScore);
  const proofDraftsReady = proofCandidates.filter(
    (candidate) => candidate.outreachStatus === "draft_ready",
  ).length;
  const sentManualCount = proofCandidates.filter(
    (candidate) => candidate.outreachStatus === "sent_manual",
  ).length;
  const heldForReviewCount = proofCandidates.length - sentManualCount;
  const proofApprovalLocked = proofCandidates.filter(
    (candidate) => candidate.approvalStatus === "review_only",
  ).length;
  const contactPathsReady = proofCandidates.filter(
    (candidate) => candidate.contactConfidence !== "low",
  ).length;
  const highConfidenceContacts = proofCandidates.filter(
    (candidate) => candidate.contactConfidence === "high",
  ).length;
  const meaningfulReplies = data.manualReplyLogs.filter((log) =>
    ["positive_demo", "positive_info", "neutral"].includes(log.sentiment),
  ).length;
  const packageDemandSignals = data.manualReplyLogs.filter((log) =>
    /price|pricing|package|partner|cost|paid|subscription/i.test(
      `${log.summary} ${log.nextStep}`,
    ),
  ).length;
  const cityRollups = useMemo(() => buildCityBusinessRollups(data), [data]);
  const cityRolloutInsights = useMemo(
    () => buildCityRolloutInsights(cityRollups, data.cityRolloutTargets),
    [cityRollups, data.cityRolloutTargets],
  );
  const followOnCityInsights = useMemo(
    () => rankFollowOnCityInsights(cityRolloutInsights).slice(0, 4),
    [cityRolloutInsights],
  );
  const unseededCityInsights = useMemo(
    () => listUnseededCityInsights(cityRolloutInsights),
    [cityRolloutInsights],
  );
  const preparedCities = cityRollups.filter((rollup) => rollup.status === "Prepared").length;
  const totalContactReadyProspects = cityRollups.reduce(
    (sum, rollup) => sum + rollup.contactReadyCount,
    0,
  );
  const totalPartnerEligibleProspects = cityRollups.reduce(
    (sum, rollup) => sum + rollup.partnerCandidateCount,
    0,
  );
  const totalAnchorOnlyProspects = cityRollups.reduce(
    (sum, rollup) => sum + rollup.anchorOnlyCount,
    0,
  );
  const brain = getCityAtlasBrain(data);
  const shadowPlan = getShadowOutreachPlan(data);
  const [selectedCityKey, setSelectedCityKey] = useState("vancouver");
  const [queueFocus, setQueueFocus] = useState<BusinessQueueFocus>("all");
  const [replyForm, setReplyForm] = useState({
    candidateId: proofCandidates[0]?.id ?? "",
    channel: "email" as ManualReplyLog["channel"],
    sentiment: "positive_demo" as ManualReplyLog["sentiment"],
    messageVersion: "email-v1-date-night-preview",
    summary: "",
    nextStep: "",
  });
  const [prospectImportText, setProspectImportText] = useState("");
  const [businessInboundText, setBusinessInboundText] = useState("");
  const selectedCityRollup =
    cityRollups.find((rollup) => rollup.cityKey === selectedCityKey) ?? cityRollups[0];
  const selectedCityAllProspects = useMemo(
    () =>
      data.businessProspects
        .filter((prospect) => prospect.cityKey === selectedCityKey)
        .slice()
        .sort(
          (left, right) =>
            getProspectPriority(right) - getProspectPriority(left)
            || left.businessName.localeCompare(right.businessName),
        ),
    [data.businessProspects, selectedCityKey],
  );
  const selectedCityPromotionCandidates = useMemo(
    () =>
      selectedCityAllProspects
        .filter((prospect) => isBusinessProspectPromotionCandidate(prospect))
        .slice()
        .sort(
          (left, right) =>
            getBusinessProspectPromotionScore(right) - getBusinessProspectPromotionScore(left)
            || getProspectPriority(right) - getProspectPriority(left)
            || left.businessName.localeCompare(right.businessName),
        ),
    [selectedCityAllProspects],
  );
  const selectedCityContactPathReadyCount = selectedCityAllProspects.filter(
    (prospect) => prospect.contactReadiness === "contact_path_ready",
  ).length;
  const selectedCityNeedsResearchCount = selectedCityAllProspects.filter(
    (prospect) => prospect.contactReadiness === "needs_research",
  ).length;
  const selectedCityReviewDonorCount = selectedCityAllProspects.filter((prospect) =>
    /review donor/i.test(prospect.sourceLabel),
  ).length;
  const selectedCitySourceLaneCount = new Set(
    selectedCityAllProspects.map((prospect) => prospect.sourceLabel),
  ).size;
  const selectedCityPromotionLaneCounts = useMemo(
    () => new Map(buildBusinessProspectPromotionLaneCounts(selectedCityAllProspects)),
    [selectedCityAllProspects],
  );
  const selectedCityPromotionCandidateCount = selectedCityPromotionCandidates.length;
  const selectedCityProtectedEmailCount =
    selectedCityPromotionLaneCounts.get("protected_email_review") ?? 0;
  const selectedCityPrivateFormCount =
    selectedCityPromotionLaneCounts.get("private_form_review") ?? 0;
  const selectedCityPhoneTextCount =
    selectedCityPromotionLaneCounts.get("phone_text_review") ?? 0;
  const selectedCityOfficialPathCount =
    selectedCityPromotionLaneCounts.get("official_path_review") ?? 0;
  const selectedCityManualLookupCount =
    selectedCityPromotionLaneCounts.get("manual_lookup") ?? 0;
  const cityProspects = useMemo(
    () => {
      if (queueFocus === "promotion_candidates") {
        return selectedCityPromotionCandidates;
      }

      return selectedCityAllProspects.filter((prospect) => {
        if (queueFocus === "all") return true;
        return prospect.contactReadiness === queueFocus;
      });
    },
    [queueFocus, selectedCityAllProspects, selectedCityPromotionCandidates],
  );
  const importPreview = useMemo(
    () => parseBusinessProspectImport(prospectImportText, data.businessProspects),
    [data.businessProspects, prospectImportText],
  );
  const businessBatch = useMemo(
    () => buildBusinessProofBatchBrief(data.businessProspects, selectedCityKey),
    [data.businessProspects, selectedCityKey],
  );
  const ownerInboxBrief = useMemo(
    () => buildBusinessOwnerInboxBrief(businessBatch),
    [businessBatch],
  );
  const businessInboundPreview = useMemo(
    () => buildBusinessInboundAdapterPreview(businessInboundText, data.businessProspects),
    [businessInboundText, data.businessProspects],
  );
  const businessMirrorReport = useMemo(
    () =>
      buildBusinessProtectedInboundMirrorReport({
        entries: data.businessInboundMirror,
        prospects: data.businessProspects,
        replayHistory: data.businessReplyBridgeReplays,
      }),
    [data.businessInboundMirror, data.businessProspects, data.businessReplyBridgeReplays],
  );
  const businessReplyBridgeReport = useMemo(
    () =>
      buildBusinessReplyBridgeReport({
        mirroredEntries: data.businessInboundMirror,
        replayHistory: data.businessReplyBridgeReplays,
        prospects: data.businessProspects,
      }),
    [data.businessInboundMirror, data.businessProspects, data.businessReplyBridgeReplays],
  );
  const businessSupervisedExecutionReport = useMemo(
    () =>
      buildBusinessSupervisedExecutionLaneReport({
        prospects: selectedCityAllProspects,
        setup: supervisedOutreachSetup,
      }),
    [selectedCityAllProspects, supervisedOutreachSetup],
  );
  const connectorCityRollups = useMemo(
    () => buildConnectorCityRollups(data.businessProspects),
    [data.businessProspects],
  );
  const selectedCityConnectorRollup =
    connectorCityRollups.find((rollup) => rollup.cityKey === selectedCityKey) ?? null;
  const selectedCityConnectorRows = useMemo(
    () => listConnectorWarmPathRows(selectedCityKey),
    [selectedCityKey],
  );
  const selectedCityNamedConnectorRows = useMemo(
    () => listNamedConnectorRows(selectedCityKey),
    [selectedCityKey],
  );
  const selectedCityOrganizationConnectorRows = useMemo(
    () => listOrganizationConnectorRows(selectedCityKey),
    [selectedCityKey],
  );
  const selectedCityNamedConnectorLanes = useMemo(
    () => buildNamedConnectorLaneSummaries(selectedCityKey),
    [selectedCityKey],
  );

  return (
    <>
      <section className="admin-hero">
        <div>
          <p className="section-label">Owner console</p>
          <h1>CityAtlas launch readiness</h1>
          <p>
            A local-only control surface for launch gates, founder pipeline review, and the first
            Date Night proof sprint now waiting on replies.
          </p>
        </div>
        <SafeModeNotice />
      </section>

      <section className="metrics-strip">
        <MetricCard label="Launch readiness" value={formatPercent(launchReadiness)} detail="Local package score" />
        <MetricCard label="Coverage score" value={formatPercent(coverage)} detail="Average demo content depth" />
        <MetricCard label="Partner pipeline" value={`$${pipeline}`} detail="Modeled monthly value" />
        <MetricCard label="Proof emails" value={`${sentManualCount}`} detail="Manual sends logged" />
      </section>

      <section className="admin-grid">
        <article className="admin-panel large">
          <div className="dashboard-card-header">
            <div>
              <p className="section-label">Gates</p>
              <h2>Live-risk actions remain locked</h2>
            </div>
            <span>{launchReadiness}%</span>
          </div>
          <ProgressBar value={launchReadiness} label="Launch readiness" />
          <div className="gate-list">
            {data.launchGates.map((gate) => (
              <div className="gate-row" key={gate.id}>
                <div>
                  <strong>{gate.title}</strong>
                  <p>{gate.notes}</p>
                  <small>{gate.ownerDecision}</small>
                </div>
                <div className="gate-actions">
                  <StatusPill tone={gate.status === "locked" ? "amber" : "blue"}>
                    {getGateLabel(gate)}
                  </StatusPill>
                  <button
                    className="button tiny"
                    type="button"
                    onClick={() => onMarkGateReady(gate.id)}
                    disabled={gate.status !== "locked"}
                  >
                    Mark ready
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <SectionHeader
            label="Content"
            title="Public surface inventory"
            copy="The public structure now has the first real ranking cluster, but every draft still needs proof and gate visibility."
          />
          <div className="inventory-grid">
            <span><strong>{data.businesses.length}</strong> Places</span>
            <span><strong>{data.events.length}</strong> Events</span>
            <span><strong>{data.offers.length}</strong> Offers</span>
            <span><strong>{data.guides.length}</strong> Guides</span>
          </div>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Editorial machine"
            title="Guide cluster readiness"
            copy="Every ranking page should show its query class, proof source, internal-link target, and current gate."
          />
          <div className="guide-machine-list">
            {data.guides.map((guide) => (
              <div className="guide-machine-row" key={guide.id}>
                <div>
                  <strong>{guide.title}</strong>
                  <small>{guide.queryClass} - {guide.cluster}</small>
                  <p>{guide.summary}</p>
                </div>
                <div className="guide-machine-meta">
                  <span>Proof: {guide.proofSource}</span>
                  <span>Link target: {guide.internalLinkTarget}</span>
                  <StatusPill tone={guide.gateDecision === "ready_for_review" ? "green" : "amber"}>
                    {guide.gateDecision.replaceAll("_", " ")}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <SectionHeader
            label="Partner pipeline"
            title="Best local candidates"
            copy="Review fit, source state, and first package angle before outreach."
          />
          <div className="candidate-list">
            {candidates.map((business) => (
              <BusinessMiniRow business={business} key={business.id} />
            ))}
          </div>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="City rollout"
            title="Vancouver-first expansion machine"
            copy="This is the shared Roam + Rooms city-launch pattern adapted for CityAtlas: build the internal queue first, keep it no-send, and only release a city after the first useful wedge exists."
          />
          <div className="proof-candidate-summary">
            <span>
              <strong>{data.cityRolloutTargets.length}</strong>
              Planned cities
            </span>
            <span>
              <strong>{preparedCities}</strong>
              Prepared now
            </span>
            <span>
              <strong>{data.businessProspects.length}</strong>
              Unique prospects
            </span>
            <span>
              <strong>{totalPartnerEligibleProspects}</strong>
              Partner-eligible
            </span>
            <span>
              <strong>{totalContactReadyProspects}</strong>
              Contact-ready
            </span>
            <span>
              <strong>{totalAnchorOnlyProspects}</strong>
              Anchor-only
            </span>
          </div>
          <div className="city-rollout-list">
            {cityRollups.map((rollup) => {
              const target = data.cityRolloutTargets.find(
                (item) => item.cityKey === rollup.cityKey,
              );
              return (
                <div className="city-rollout-row" key={rollup.cityKey}>
                  <div>
                    <div className="proof-candidate-heading">
                      <div>
                        <strong>{rollup.cityName}</strong>
                        <small>
                          {formatPhrase(target?.phase ?? rollup.phase)} - {target?.wedge}
                        </small>
                      </div>
                      <StatusPill
                        tone={
                          rollup.status === "Prepared"
                            ? "green"
                            : rollup.status === "Building"
                              ? "blue"
                              : "amber"
                        }
                      >
                        {rollup.status}
                      </StatusPill>
                    </div>
                    <p>{target?.rationale}</p>
                    <div className="city-rollout-metrics">
                      <span>
                        <strong>{rollup.totalProspects}</strong>
                        Unique prospects
                      </span>
                      <span>
                        <strong>{rollup.partnerCandidateCount}</strong>
                        Partner-eligible
                      </span>
                      <span>
                        <strong>{rollup.contactReadyCount}</strong>
                        Contact-ready
                      </span>
                      <span>
                        <strong>{rollup.guideCount}</strong>
                        Guides
                      </span>
                    </div>
                    <small>{rollup.nextAction}</small>
                  </div>
                  <div className="city-rollout-progress">
                    <strong>{rollup.progress}%</strong>
                    <small>{formatPhrase(target?.launchStatus ?? "research_queue")}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Next wave"
            title="Follow-on city order and discovery guardrails"
            copy="Use the current queue truth before choosing the first non-Vancouver city packet or any paid discovery step."
          />
          <div className="proof-candidate-summary">
            <span>
              <strong>{followOnCityInsights.length}</strong>
              Ranked next cities
            </span>
            <span>
              <strong>{unseededCityInsights.length}</strong>
              Unseeded cities
            </span>
            <span>
              <strong>{businessBatch.selectedCount}</strong>
              Vancouver batch size
            </span>
            <span>
              <strong>{businessBatch.rehearsalReadyCount}</strong>
              Rehearsal-ready
            </span>
            <span>
              <strong>{ownerInboxBrief.blockedBy.length === 0 ? "Ready" : "Blocked"}</strong>
              Owner inbox
            </span>
            <span>
              <strong>Local only</strong>
              Paid discovery
            </span>
          </div>
          <div className="city-rollout-list">
            {followOnCityInsights.map(({ rollup, target, missingThresholds }) => (
              <div className="city-rollout-row" key={`follow-on-${rollup.cityKey}`}>
                <div>
                  <div className="proof-candidate-heading">
                    <div>
                      <strong>{rollup.cityName}</strong>
                      <small>
                        {formatPhrase(target?.phase ?? rollup.phase)} - {target?.wedge}
                      </small>
                    </div>
                    <StatusPill tone={rollup.progress >= 65 ? "blue" : "amber"}>
                      {rollup.progress}% ready
                    </StatusPill>
                  </div>
                  <p>{target?.rationale}</p>
                  <div className="city-rollout-metrics">
                    <span>
                      <strong>{rollup.totalProspects}</strong>
                      Unique prospects
                    </span>
                    <span>
                      <strong>{rollup.contactReadyCount}</strong>
                      Contact-ready
                    </span>
                    <span>
                      <strong>{rollup.emailReadyCount}</strong>
                      Email-ready
                    </span>
                    <span>
                      <strong>{getReviewFirstContactPathCount(rollup)}</strong>
                      Review-first contact paths
                    </span>
                  </div>
                  <small>
                    Missing:{" "}
                    {missingThresholds.length > 0
                      ? missingThresholds.map((gap) => `${gap.remaining} ${gap.label}`).join("; ")
                      : "No threshold gap remains."}
                  </small>
                </div>
              </div>
            ))}
          </div>
          <div className="gate-list">
            <div className="gate-row">
              <div>
                <strong>EXA stays discovery-only</strong>
                <p>
                  Paid discovery can widen the local queue, but it does not unlock outreach,
                  partner claims, CRM sync, or public business publication.
                </p>
                <small>
                  Best first scopes remain one city, one lane, one capped batch, and one human
                  reviewer.
                </small>
              </div>
            </div>
            <div className="gate-row">
              <div>
                <strong>Official-source contact paths still win</strong>
                <p>
                  The import lane can preview EXA or manual rows, but every contact path still
                  needs re-verification on an official public source before any real send is ever
                  considered.
                </p>
                <small>
                  Current safest cities to widen next: Toronto, New York, Los Angeles, and Miami.
                </small>
              </div>
            </div>
            <div className="gate-row">
              <div>
                <strong>Unseeded cities stay template-only</strong>
                <p>
                  {unseededCityInsights.length > 0
                    ? unseededCityInsights.map((insight) => insight.rollup.cityName).join(", ")
                    : "Every current target city already has at least one local queue row."}
                </p>
                <small>
                  Keep these cities in query-map and wedge-template mode until the first local rows
                  exist.
                </small>
              </div>
            </div>
          </div>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Outreach prep"
            title="Tiny business proof batch"
            copy="This is the CityAtlas version of the safer Rooms launch pattern: pick an exact 3-5 business batch, generate draft angles locally, rehearse on the owner inbox first, and keep every real send blocked until a separate approval step exists."
          />
          <div className="proof-candidate-summary">
            <span>
              <strong>{businessBatch.selectedCount}</strong>
              Selected
            </span>
            <span>
              <strong>{businessBatch.rehearsalReadyCount}</strong>
              Rehearsal-ready
            </span>
            <span>
              <strong>{businessBatch.reviewFirstCount}</strong>
              Review-first
            </span>
            <span>
              <strong>{formatPercent(businessBatch.readiness)}</strong>
              Batch readiness
            </span>
          </div>
          <div className="gate-row">
            <div>
              <strong>{ownerInboxBrief.title}</strong>
              <p>{ownerInboxBrief.summary}</p>
              <small>{ownerInboxBrief.nextAction}</small>
            </div>
            <div className="gate-actions">
              <StatusPill tone={ownerInboxBrief.blockedBy.length === 0 ? "green" : "amber"}>
                {ownerInboxBrief.blockedBy.length === 0 ? "Rehearsal ready" : "Local only"}
              </StatusPill>
            </div>
          </div>
          <div className="proof-candidate-summary">
            <span>
              <strong>{ownerInboxBrief.candidateName}</strong>
              Rehearsal candidate
            </span>
            <span>
              <strong>{ownerInboxBrief.candidateStage}</strong>
              Candidate stage
            </span>
          </div>
          <div className="business-prospect-list compact">
            {businessBatch.candidates.map((candidate) => (
              <div className="business-prospect-row" key={candidate.prospectId}>
                <div>
                  <div className="proof-candidate-heading">
                    <div>
                      <strong>{candidate.businessName}</strong>
                      <small>
                        {candidate.category} - {candidate.segment}
                      </small>
                    </div>
                    <StatusPill tone={getBusinessBatchCandidateTone(candidate.stage)}>
                      {candidate.stage}
                    </StatusPill>
                  </div>
                  <div className="business-prospect-meta">
                    <span>
                      <strong>Source</strong>
                      {candidate.sourceLane}
                    </span>
                    <span>
                      <strong>Role</strong>
                      {formatPhrase(candidate.role)}
                    </span>
                    <span>
                      <strong>Contact</strong>
                      {candidate.contactRoute}
                    </span>
                  </div>
                  <p>{candidate.whyChosen}</p>
                  <small>Draft subject: {candidate.draft.subject}</small>
                  {candidate.missing.length > 0 ? (
                    <small>Needs prep: {candidate.missing.join(" ")}</small>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="gate-list">
            {businessBatch.guardrails.slice(0, 5).map((rule) => (
              <div className="gate-row" key={rule}>
                <div>
                  <strong>Guardrail</strong>
                  <p>{rule}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Business machine"
            title="No-send business prospect queue"
            copy="CityAtlas now stages source-backed Vancouver businesses and founder-proof candidates in one internal queue. This import lane is for previewing EXA or manual research rows before anything touches outreach."
          />
          <div className="prospect-toolbar">
            <label>
              Review city
              <select
                value={selectedCityKey}
                onChange={(event) => setSelectedCityKey(event.target.value)}
              >
                {data.cityRolloutTargets.map((target) => (
                  <option key={target.cityKey} value={target.cityKey}>
                    {target.cityName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Queue focus
              <select
                value={queueFocus}
                onChange={(event) => setQueueFocus(event.target.value as BusinessQueueFocus)}
              >
                <option value="all">All rows</option>
                <option value="promotion_candidates">Promotion candidates</option>
                <option value="email_ready">Email-ready</option>
                <option value="contact_path_ready">Contact-path review</option>
                <option value="needs_research">Needs research</option>
              </select>
            </label>
          </div>
          {selectedCityRollup ? (
            <div className="proof-candidate-summary">
              <span>
                <strong>{selectedCityRollup.totalProspects}</strong>
                Unique
              </span>
              <span>
                <strong>{selectedCityRollup.partnerCandidateCount}</strong>
                Partner-eligible
              </span>
              <span>
                <strong>{selectedCityRollup.anchorOnlyCount}</strong>
                Anchor-only
              </span>
              <span>
                <strong>{selectedCityRollup.contactReadyCount}</strong>
                Contact-ready
              </span>
              <span>
                <strong>{selectedCityRollup.emailReadyCount}</strong>
                Email-ready
              </span>
              <span>
                <strong>{selectedCityContactPathReadyCount}</strong>
                Contact-path review
              </span>
              <span>
                <strong>{selectedCityNeedsResearchCount}</strong>
                Needs research
              </span>
              <span>
                <strong>{selectedCityReviewDonorCount}</strong>
                Review-donor rows
              </span>
              <span>
                <strong>{selectedCitySourceLaneCount}</strong>
                Source lanes
              </span>
            </div>
          ) : null}
          {selectedCityRollup ? (
            <div className="proof-candidate-summary business-lane-summary">
              <span>
                <strong>{selectedCityPromotionCandidateCount}</strong>
                Promotion candidates
              </span>
              <span>
                <strong>{selectedCityProtectedEmailCount}</strong>
                Protected-email review
              </span>
              <span>
                <strong>{selectedCityPrivateFormCount}</strong>
                Private-form review
              </span>
              <span>
                <strong>{selectedCityPhoneTextCount}</strong>
                Phone/text review
              </span>
              <span>
                <strong>{selectedCityOfficialPathCount}</strong>
                Official-path review
              </span>
              <span>
                <strong>{selectedCityManualLookupCount}</strong>
                Manual lookup
              </span>
            </div>
          ) : null}
          {selectedCityRollup ? (
            <div className="gate-row">
              <div>
                <strong>
                  {selectedCityRollup.cityName} queue focus: {getQueueFocusLabel(queueFocus)}
                </strong>
                <p>
                  {queueFocus === "promotion_candidates"
                    ? "This view ranks the non-email partner rows closest to promotion, so the next manual cleanup step is obvious before any live outreach exists."
                    : queueFocus === "email_ready"
                    ? "This view is for the direct-email lane that can support owner-inbox rehearsal after public-source recheck."
                    : queueFocus === "contact_path_ready"
                      ? "This view isolates official-path and contact-form rows that still need manual browser review but can already strengthen business coverage."
                      : queueFocus === "needs_research"
                        ? "This view holds the research-only rows that need a better public contact path before they belong in any rehearsal packet."
                        : "This is the full selected-city queue, mixing anchors, donor rows, and proof candidates while keeping outreach blocked."}
                </p>
                <small>
                  Showing {cityProspects.length} of {selectedCityAllProspects.length} rows for{" "}
                  {selectedCityRollup.cityName}.
                </small>
              </div>
            </div>
          ) : null}
          <form
            className="reply-tracker-form"
            onSubmit={(event) => {
              event.preventDefault();
              void (async () => {
                const rows = createImportedBusinessProspects(importPreview.importableRows);
                const importedCount = await onImportBusinessProspects(
                  rows,
                  "manual_or_exa_preview",
                );
                if (importedCount > 0) {
                  setProspectImportText("");
                }
              })();
            }}
          >
            <label className="wide">
              EXA or manual research rows
              <textarea
                placeholder="businessName,email,contactName,cityName,neighborhood,category,segment,sourceLabel,sourceUrl,website,contactPath,notes,relationshipWarmth"
                value={prospectImportText}
                onChange={(event) => setProspectImportText(event.target.value)}
              />
            </label>
            <button
              className="button primary wide"
              type="submit"
              disabled={importPreview.importableRows.length === 0}
            >
              Add importable rows to local queue
            </button>
            <p className="form-note">
              Preview/import only. No scraping, messaging, CRM sync, or provider call happens in
              this lane.
            </p>
          </form>
          {prospectImportText.trim() ? (
            <div className="prospect-import-preview">
              <strong>{importPreview.summary}</strong>
              <div className="city-rollout-metrics">
                <span>
                  <strong>{importPreview.importableRows.length}</strong>
                  Importable
                </span>
                <span>
                  <strong>{importPreview.duplicateCount}</strong>
                  Duplicates
                </span>
                <span>
                  <strong>{importPreview.warningCount}</strong>
                  Warnings
                </span>
                <span>
                  <strong>{importPreview.errorCount}</strong>
                  Errors
                </span>
              </div>
              <div className="business-prospect-list compact">
                {importPreview.rows.slice(0, 4).map((row) => (
                  <div className="business-prospect-row" key={`${row.rowNumber}-${row.prospect.id}`}>
                    <div>
                      <div className="proof-candidate-heading">
                        <div>
                          <strong>{row.input.businessName || `Row ${row.rowNumber}`}</strong>
                          <small>{row.input.cityName || "City missing"} - {row.input.segment || "Segment missing"}</small>
                        </div>
                        <StatusPill tone={row.importable ? "green" : "amber"}>
                          {row.importable ? "importable" : "review first"}
                        </StatusPill>
                      </div>
                      <p>{row.input.notes || "No note provided yet."}</p>
                      {row.errors.length > 0 ? <small>Errors: {row.errors.join(" ")}</small> : null}
                      {row.warnings.length > 0 ? <small>Warnings: {row.warnings.join(" ")}</small> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {cityProspects.length > 0 ? (
            <div className="business-prospect-list">
              {cityProspects.slice(0, 12).map((prospect) => (
                <div className="business-prospect-row" key={prospect.id}>
                  <div>
                    <div className="proof-candidate-heading">
                      <div>
                        <strong>{prospect.businessName}</strong>
                        <small>
                          {prospect.category} - {prospect.segment}
                        </small>
                      </div>
                      <StatusPill tone={getProspectTone(prospect)}>
                        {formatPhrase(prospect.contactReadiness)}
                      </StatusPill>
                    </div>
                    <div className="business-prospect-meta">
                      <span>
                        <strong>Role</strong>
                        {formatPhrase(classifyBusinessProspectRole(prospect))}
                      </span>
                      <span>
                        <strong>Source lane</strong>
                        {prospect.sourceLabel}
                      </span>
                      <span>
                        <strong>Confidence</strong>
                        {formatPhrase(prospect.contactConfidence)}
                      </span>
                      <span>
                        <strong>Contact</strong>
                        {prospect.email || prospect.contactPathType}
                      </span>
                      <span>
                        <strong>Action lane</strong>
                        {getBusinessProspectPromotionLabel(getBusinessProspectPromotionLane(prospect))}
                      </span>
                      <span>
                        <strong>Promotion score</strong>
                        {getBusinessProspectPromotionScore(prospect)}
                      </span>
                    </div>
                    <p>{prospect.notes}</p>
                    <small className="business-prospect-note">
                      Next step: {getBusinessProspectNextStep(prospect)}
                    </small>
                    <div className="business-prospect-links">
                      {isExternalHref(prospect.sourceUrl) ? (
                        <a href={prospect.sourceUrl} target="_blank" rel="noreferrer">
                          Source
                        </a>
                      ) : null}
                      {isExternalHref(prospect.website) ? (
                        <a href={prospect.website} target="_blank" rel="noreferrer">
                          Website
                        </a>
                      ) : null}
                      {isExternalHref(prospect.contactPath) ? (
                        <a href={prospect.contactPath} target="_blank" rel="noreferrer">
                          Contact path
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No rows in this queue view yet"
              copy="Switch the queue focus or selected city to inspect a different part of the local business machine."
            />
          )}
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Connector warm paths"
            title={`${selectedCityRollup?.cityName ?? "Selected city"} relationship stack`}
            copy="This Rooms-derived layer keeps founder, culture, and operator warm paths separate from the raw business queue so CityAtlas can prepare relationship-led city rollout without sending anything."
          />
          <div className="proof-candidate-summary">
            <span>
              <strong>{selectedCityConnectorRollup?.organizationConnectorCount ?? 0}</strong>
              Org connectors
            </span>
            <span>
              <strong>{selectedCityConnectorRollup?.namedConnectorCount ?? 0}</strong>
              Named warm paths
            </span>
            <span>
              <strong>{selectedCityConnectorRollup?.highConfidenceCount ?? 0}</strong>
              High confidence
            </span>
            <span>
              <strong>{selectedCityConnectorRollup?.mediumConfidenceCount ?? 0}</strong>
              Medium confidence
            </span>
            <span>
              <strong>{selectedCityConnectorRollup?.alignedContactReadyCount ?? 0}</strong>
              Contact-ready queue
            </span>
            <span>
              <strong>{selectedCityConnectorRollup?.alignedEmailReadyCount ?? 0}</strong>
              Email-ready queue
            </span>
          </div>
          {selectedCityConnectorRollup ? (
            <div className="gate-row">
              <div>
                <strong>{selectedCityRollup?.cityName} connector status</strong>
                <p>{selectedCityConnectorRollup.nextAction}</p>
                <small>
                  {selectedCityRollup?.cityName} now has {selectedCityConnectorRows.length} staged
                  connector warm-path rows inside CityAtlas's local-only rollout machine.
                </small>
              </div>
              <div className="gate-actions">
                <StatusPill tone={getConnectorStatusTone(selectedCityConnectorRollup.status)}>
                  {formatPhrase(selectedCityConnectorRollup.status)}
                </StatusPill>
              </div>
            </div>
          ) : null}
          {selectedCityNamedConnectorLanes.length > 0 ? (
            <div className="city-rollout-metrics">
              {selectedCityNamedConnectorLanes.map((lane) => (
                <span key={lane.laneId}>
                  <strong>{lane.count}</strong>
                  {lane.laneLabel}
                </span>
              ))}
            </div>
          ) : null}
          {selectedCityNamedConnectorRows.length > 0 ? (
            <>
              <div className="gate-row">
                <div>
                  <strong>Named warm paths</strong>
                  <p>
                    These are the best person-level relationship routes already staged locally for{" "}
                    {selectedCityRollup?.cityName}.
                  </p>
                </div>
              </div>
              <div className="business-prospect-list compact">
                {selectedCityNamedConnectorRows.slice(0, 6).map((row) => (
                  <div className="business-prospect-row" key={row.id}>
                    <div>
                      <div className="proof-candidate-heading">
                        <div>
                          <strong>{row.targetName}</strong>
                          <small>
                            {row.secondaryLabel} - {row.organization}
                          </small>
                        </div>
                        <StatusPill tone={getConnectorRouteTone(row.routeType)}>
                          {row.confidence} confidence
                        </StatusPill>
                      </div>
                      <div className="business-prospect-meta">
                        <span>
                          <strong>Lane</strong>
                          {row.laneLabel}
                        </span>
                        <span>
                          <strong>Public path</strong>
                          <a href={row.publicContactPath} target="_blank" rel="noreferrer">
                            Review route
                          </a>
                        </span>
                      </div>
                      <p>{row.whyItMatters}</p>
                      <small className="business-prospect-note">{row.notes}</small>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {selectedCityOrganizationConnectorRows.length > 0 ? (
            <>
              <div className="gate-row">
                <div>
                  <strong>Organization-level connector stack</strong>
                  <p>
                    These are the safest public warm-path organizations already staged locally for{" "}
                    {selectedCityRollup?.cityName}.
                  </p>
                </div>
              </div>
              <div className="business-prospect-list compact">
                {selectedCityOrganizationConnectorRows.slice(0, 8).map((row) => (
                  <div className="business-prospect-row" key={row.id}>
                    <div>
                      <div className="proof-candidate-heading">
                        <div>
                          <strong>{row.targetName}</strong>
                          <small>
                            {row.secondaryLabel} - {row.audience}
                          </small>
                        </div>
                        <StatusPill tone={getConnectorRouteTone(row.routeType)}>
                          {row.confidence} confidence
                        </StatusPill>
                      </div>
                      <div className="business-prospect-meta">
                        <span>
                          <strong>Lane</strong>
                          {row.laneLabel}
                        </span>
                        <span>
                          <strong>Public path</strong>
                          <a href={row.publicContactPath} target="_blank" rel="noreferrer">
                            Review route
                          </a>
                        </span>
                      </div>
                      <p>{row.whyItMatters}</p>
                      <small className="business-prospect-note">{row.notes}</small>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {selectedCityConnectorRows.length === 0 ? (
            <EmptyState
              title="No connector stack staged for this city yet"
              copy="This city can still have business prospects without a warm-path layer. The next safe move is to stage organization connectors before any named-person packet is considered."
            />
          ) : null}
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Business reply rail"
            title="Preview-only inbound reply machine"
            copy="This is the safer CityAtlas version of the Rooms outreach-memory path: preview a Resend-style inbound payload, mirror it into protected local memory, then replay only clean packets into business reply memory. No live inbox, webhook, CRM, or follow-up is activated here."
          />
          <div className="proof-candidate-summary">
            <span>
              <strong>{businessInboundPreview.rows.length}</strong>
              Preview rows
            </span>
            <span>
              <strong>{businessMirrorReport.entries.length}</strong>
              Mirrored packets
            </span>
            <span>
              <strong>{businessReplyBridgeReport.rows.filter((row) => row.canReplay).length}</strong>
              Bridge-ready
            </span>
            <span>
              <strong>{data.businessReplyBridgeReplays.length}</strong>
              Replayed
            </span>
            <span>
              <strong>{data.businessReplyLogs.length}</strong>
              Business reply logs
            </span>
          </div>
          <form
            className="reply-tracker-form"
            onSubmit={(event) => {
              event.preventDefault();
              void (async () => {
                const entries = buildBusinessProtectedInboundMirrorEntries(
                  businessInboundPreview.rows,
                  data.businessInboundMirror,
                );
                const savedCount = await onSaveBusinessInboundMirror(entries);
                if (savedCount > 0) {
                  setBusinessInboundText("");
                }
              })();
            }}
          >
            <label className="wide">
              Resend inbound payload or structured JSON rows
              <textarea
                placeholder='{"type":"email.received","data":{"from":"name@example.com","subject":"Re: CityAtlas","text":"Reply text here"}}'
                value={businessInboundText}
                onChange={(event) => setBusinessInboundText(event.target.value)}
              />
            </label>
            <div className="button-row">
              <button
                className="button secondary"
                type="button"
                onClick={() => setBusinessInboundText(sampleBusinessResendInboundPayload())}
              >
                Load sample payload
              </button>
              <button
                className="button primary"
                type="submit"
                disabled={businessInboundPreview.rows.length === 0}
              >
                Mirror preview rows locally
              </button>
            </div>
            <p className="form-note">
              Preview-only rail. It stages future business replies in local memory without reading
              a live inbox or sending anything.
            </p>
          </form>
          {businessInboundText.trim() ? (
            <div className="prospect-import-preview">
              <strong>{businessInboundPreview.title}</strong>
              <p>{businessInboundPreview.summary}</p>
              <div className="city-rollout-metrics">
                {businessInboundPreview.metrics.map((metric) => (
                  <span key={metric.label}>
                    <strong>{metric.value}</strong>
                    {metric.label}
                  </span>
                ))}
              </div>
              <div className="business-prospect-list compact">
                {businessInboundPreview.rows.map((row) => (
                  <div className="business-prospect-row" key={`${row.packet.messageId}-${row.rowNumber}`}>
                    <div>
                      <div className="proof-candidate-heading">
                        <div>
                          <strong>{row.matchedBusinessName || row.packet.email || `Row ${row.rowNumber}`}</strong>
                          <small>{row.packet.subject || "No subject"} - {row.packet.email || "Email missing"}</small>
                        </div>
                        <StatusPill tone={getBusinessInboundTone(row.payloadStatus)}>
                          {row.payloadStatus}
                        </StatusPill>
                      </div>
                      <p>{row.qualificationReason}</p>
                      <small>{row.nextSafeAction}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="gate-list">
            <div className="gate-row">
              <div>
                <strong>{businessMirrorReport.title}</strong>
                <p>{businessMirrorReport.summary}</p>
                <small>{businessMirrorReport.nextAction}</small>
              </div>
            </div>
            <div className="gate-row">
              <div>
                <strong>{businessReplyBridgeReport.title}</strong>
                <p>{businessReplyBridgeReport.summary}</p>
                <small>{businessReplyBridgeReport.nextAction}</small>
              </div>
            </div>
          </div>
          <div className="business-prospect-list compact">
            {businessReplyBridgeReport.rows.slice(0, 6).map((row) => (
              <div className="business-prospect-row" key={row.entry.id}>
                <div>
                  <div className="proof-candidate-heading">
                    <div>
                      <strong>{row.matchedBusinessName || row.entry.email || "Unmatched packet"}</strong>
                      <small>{row.entry.subject || "No subject"} - {row.entry.receivedAt || "Time missing"}</small>
                    </div>
                    <StatusPill tone={getBusinessBridgeTone(row.status)}>
                      {row.status}
                    </StatusPill>
                  </div>
                  <p>{row.reason}</p>
                  <small>{row.nextSafeAction}</small>
                </div>
                {row.canReplay ? (
                  <button
                    className="button tiny"
                    type="button"
                    onClick={() => {
                      void onReplayBusinessReplyBridgeEntry(row.entry.id);
                    }}
                  >
                    Replay to local reply memory
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {data.businessReplyLogs.length === 0 ? (
            <EmptyState
              title="No business replies saved yet"
              copy="Mirror a clean packet, then replay only bridge-ready rows into local business reply memory."
            />
          ) : (
            <div className="reply-log-list">
              {data.businessReplyLogs.slice(0, 6).map((log) => (
                <div className="reply-log-row" key={log.id}>
                  <div>
                    <strong>{log.businessName}</strong>
                    <small>
                      {log.sourceRail} - {log.sentiment.replaceAll("_", " ")}
                    </small>
                  </div>
                  <p>{log.summary}</p>
                  <small>{log.nextStep}</small>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Supervised staging"
            title="Local-only supervised execution lane"
            copy="This is the missing middle layer between owner-inbox rehearsal and any future provider lane: keep a tiny allowlist, record dry-run review locally, and stage one explicit live-review packet without contacting anyone."
          />
          <div className="proof-candidate-summary">
            {businessSupervisedExecutionReport.metrics.map((metric) => (
              <span key={metric.label}>
                <strong>{metric.value}</strong>
                {metric.label}
              </span>
            ))}
          </div>
          <div className="gate-row">
            <div>
              <strong>{businessSupervisedExecutionReport.title}</strong>
              <p>{businessSupervisedExecutionReport.summary}</p>
              <small>{businessSupervisedExecutionReport.nextAction}</small>
            </div>
            <div className="gate-actions">
              <StatusPill tone={supervisedOutreachSetup.mode === "blocked" ? "amber" : "blue"}>
                {supervisedOutreachSetup.statusLabel}
              </StatusPill>
            </div>
          </div>
          <div className="gate-list">
            <div className="gate-row">
              <div>
                <strong>Guardrail</strong>
                <p>{businessSupervisedExecutionReport.guardrail}</p>
                <small>{supervisedOutreachSetup.detail}</small>
              </div>
            </div>
          </div>
          {businessSupervisedExecutionReport.queue.length === 0 ? (
            <EmptyState
              title="No direct-email supervised rows in this city yet"
              copy="Widen the selected-city email-ready queue first, then use this lane to keep the first supervised review packet tiny and explicit."
            />
          ) : (
            <div className="business-prospect-list compact">
              {businessSupervisedExecutionReport.queue.map((row) => (
                <div className="business-prospect-row" key={row.prospectId}>
                  <div>
                    <div className="proof-candidate-heading">
                      <div>
                        <strong>{row.businessName}</strong>
                        <small>
                          {row.sourceLane} - {row.contactRoute}
                        </small>
                      </div>
                      <StatusPill tone={getBusinessSupervisedTone(row.status)}>
                        {row.status}
                      </StatusPill>
                    </div>
                    <div className="business-prospect-meta">
                      <span>
                        <strong>Stage</strong>
                        {row.stage}
                      </span>
                      <span>
                        <strong>Allowlist</strong>
                        {row.allowlisted ? "Allowlisted" : "Not allowlisted"}
                      </span>
                      <span>
                        <strong>Dry run</strong>
                        {row.hasDryRun ? "Prepared" : "Not prepared"}
                      </span>
                      <span>
                        <strong>Live review</strong>
                        {row.liveReviewStatus}
                      </span>
                      <span>
                        <strong>Score</strong>
                        {row.score}
                      </span>
                    </div>
                    <p>{row.packet.summary}</p>
                    {row.blockedReason ? (
                      <small className="business-prospect-note">
                        Blocker: {row.blockedReason}
                      </small>
                    ) : null}
                    <small className="business-prospect-note">
                      Next step: {row.nextAction}
                    </small>
                  </div>
                  <div className="button-row">
                    <button
                      className="button tiny"
                      type="button"
                      onClick={() =>
                        onSetBusinessProspectSupervisedAllowlist(
                          row.prospectId,
                          !row.allowlisted,
                        )
                      }
                      disabled={!row.allowlisted && !row.canAllowlist}
                    >
                      {row.allowlisted ? "Remove allowlist" : "Allowlist locally"}
                    </button>
                    <button
                      className="button tiny"
                      type="button"
                      onClick={() => onMarkBusinessProspectSupervisedDryRunPrepared(row.prospectId)}
                      disabled={!row.canMarkDryRun}
                    >
                      Mark dry run reviewed
                    </button>
                    <button
                      className="button tiny"
                      type="button"
                      onClick={() => onStageBusinessProspectSupervisedLiveReview(row.prospectId)}
                      disabled={!row.canStageLiveReview}
                    >
                      Stage live review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-panel">
          <SectionHeader
            label="Requests"
            title="Business review queue"
            copy="Captured locally. No email, CRM, or payment provider is connected."
          />
          {data.submissions.length === 0 ? (
            <EmptyState title="No local requests yet" copy="Use the business submission flow to create one." />
          ) : (
            <div className="submission-list">
              {data.submissions.slice(0, 6).map((submission) => (
                <div className="submission-row" key={submission.id}>
                  <strong>{submission.businessName}</strong>
                  <small>{submission.category} - {submission.neighborhood}</small>
                  <span>{submission.packageInterest?.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-panel">
          <SectionHeader
            label="Growth loops"
            title="Behavior and referral signals"
            copy="Local-only event tracking for learning which paths create intent before analytics approval."
          />
          <div className="inventory-grid">
            <span><strong>{data.newsletterLeads.length}</strong> Leads</span>
            <span><strong>{data.savedItems.length}</strong> Saves</span>
            <span><strong>{data.growthEvents.length}</strong> Events</span>
            <span><strong>{data.submissions.length}</strong> Requests</span>
          </div>
        </article>

        <article className="admin-panel">
          <SectionHeader
            label="Growth radar"
            title="World-class patterns translated"
            copy="These are original CityAtlas plays based on product patterns, not copied designs or live-risk actions."
          />
          <div className="growth-play-list">
            {data.growthPlays.map((play) => (
              <div className="growth-play-row" key={play.id}>
                <div>
                  <strong>{play.title}</strong>
                  <small>{play.sourcePattern}</small>
                  <p>{play.whyItMatters}</p>
                </div>
                <StatusPill tone={play.status === "implemented_local" ? "blue" : "amber"}>
                  {play.status.replaceAll("_", " ")}
                </StatusPill>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Founder sprint"
            title="First wedge proof sprint"
            copy={`The first ${sentManualCount} direct emails are out. The useful work now is reply/bounce logging, not more sending.`}
          />
          <div className="proof-sprint-list">
            {data.proofSprints.map((sprint) => (
              <div className="proof-sprint-row" key={sprint.id}>
                <div className="proof-sprint-heading">
                  <div>
                    <strong>{sprint.name}</strong>
                    <small>{sprint.wedge}</small>
                  </div>
                  <StatusPill tone="amber">{sprint.status.replaceAll("_", " ")}</StatusPill>
                </div>
                <p>{sprint.thesis}</p>
                <div className="proof-sprint-meta">
                  <span>
                    <strong>Buyer</strong>
                    {sprint.targetBuyer}
                  </span>
                  <span>
                    <strong>Mission</strong>
                    {sprint.firstMission}
                  </span>
                  <span>
                    <strong>Metric</strong>
                    {sprint.primaryMetric}
                  </span>
                </div>
                <div className="proof-sprint-columns">
                  <div>
                    <h3>Safe local assets</h3>
                    <ul className="plain-list compact">
                      {sprint.safeAssets.map((asset) => (
                        <li key={asset}>{asset}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Approval required</h3>
                    <ul className="plain-list compact">
                      {sprint.approvalRequired.map((gate) => (
                        <li key={gate}>{gate}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="proof-sprint-next">
                  <strong>Next safe action</strong>
                  <span>{sprint.nextAction}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Founder CRM"
            title="Date-night candidate queue"
            copy="Source-backed prospects are ranked for manual review. Sent rows are outcome-tracking records; held rows still require explicit approval before contact."
          />
          <div className="proof-candidate-summary">
            <span>
              <strong>{proofCandidates.length}</strong>
              Candidates
            </span>
            <span>
              <strong>{proofDraftsReady}</strong>
              Drafts ready
            </span>
            <span>
              <strong>{sentManualCount}</strong>
              Sent
            </span>
            <span>
              <strong>{heldForReviewCount}</strong>
              Held
            </span>
            <span>
              <strong>{proofApprovalLocked}</strong>
              Approval locked
            </span>
            <span>
              <strong>{contactPathsReady}</strong>
              Contact paths
            </span>
            <span>
              <strong>{highConfidenceContacts}</strong>
              High confidence
            </span>
          </div>
          <div className="proof-candidate-list">
            {proofCandidates.map((candidate) => (
              <div className="proof-candidate-row" key={candidate.id}>
                <div className="proof-candidate-score">
                  <strong>{candidate.fitScore}</strong>
                  <span>fit</span>
                </div>
                <div className="proof-candidate-main">
                  <div className="proof-candidate-heading">
                    <div>
                      <strong>{candidate.name}</strong>
                      <small>
                        {candidate.segment} - {candidate.roleInMission}
                      </small>
                    </div>
                    <StatusPill tone={candidate.outreachStatus === "sent_manual" ? "green" : "amber"}>
                      {candidate.outreachStatus === "sent_manual"
                        ? "sent manually"
                        : candidate.approvalStatus.replaceAll("_", " ")}
                    </StatusPill>
                  </div>
                  <div className="proof-candidate-meta">
                    <span>
                      <strong>Angle</strong>
                      {candidate.routeAngle}
                    </span>
                    <span>
                      <strong>Outreach</strong>
                      {candidate.outreachStatus.replaceAll("_", " ")}
                    </span>
                    <span>
                      <strong>Source</strong>
                      <a href={candidate.sourceUrl} target="_blank" rel="noreferrer">
                        Official page
                      </a>
                    </span>
                    <span>
                      <strong>Contact</strong>
                      <a href={candidate.contactSourceUrl} target="_blank" rel="noreferrer">
                        {candidate.contactConfidence} confidence
                      </a>
                    </span>
                  </div>
                  <p>{candidate.contactPath}</p>
                  <p>{candidate.riskNotes}</p>
                  <small>{candidate.nextStep}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Post-send monitor"
            title="Held-row and reply decision log"
            copy="The Brain now uses this ranking for held contacts, reply triage, and future follow-up decisions. It still does not approve, send, sync, or import anything."
          />
          <div className="proof-candidate-summary">
            <span>
              <strong>{shadowPlan.sentManualCount}</strong>
              Sent
            </span>
            <span>
              <strong>{shadowPlan.recommendedBatchSize}</strong>
              Reviewable
            </span>
            <span>
              <strong>{shadowPlan.primaryCount}</strong>
              Primary
            </span>
            <span>
              <strong>{shadowPlan.manualConfirmCount}</strong>
              Confirm first
            </span>
            <span>
              <strong>{shadowPlan.backupCount}</strong>
              Backups
            </span>
            <span>
              <strong>{shadowPlan.blockedCount}</strong>
              Blocked
            </span>
          </div>
          <div className="shadow-plan-list">
            {shadowPlan.decisions.map((decision, index) => (
              <div className="shadow-plan-row" key={decision.candidateId}>
                <div className="proof-candidate-score">
                  <strong>{decision.shadowScore}</strong>
                  <span>shadow</span>
                </div>
                <div>
                  <div className="proof-candidate-heading">
                    <div>
                      <strong>
                        {index + 1}. {decision.name}
                      </strong>
                      <small>{decision.segment}</small>
                    </div>
                    <StatusPill
                      tone={
                        decision.outreachStatus === "sent_manual"
                          ? "green"
                          : decision.role === "primary_manual_send"
                            ? "green"
                            : "amber"
                      }
                    >
                      {decision.outreachStatus === "sent_manual"
                        ? "sent manually"
                        : decision.role.replaceAll("_", " ")}
                    </StatusPill>
                  </div>
                  <p>{decision.reason}</p>
                  <small>{decision.gate}</small>
                </div>
              </div>
            ))}
          </div>
          <p className="form-note">{shadowPlan.nextAction}</p>
        </article>

        <article className="admin-panel large">
          <SectionHeader
            label="Reply tracker"
            title="Manual outreach replies"
            copy="Log conversations after manual owner-approved outreach. This form does not send messages, sync a CRM, or contact a business."
          />
          <form
            className="reply-tracker-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!replyForm.candidateId || !replyForm.summary.trim()) return;
              void (async () => {
                await onLogManualReply({
                  ...replyForm,
                  summary: replyForm.summary.trim(),
                  nextStep: replyForm.nextStep.trim() || "Review next action manually.",
                });
                setReplyForm((current) => ({
                  ...current,
                  summary: "",
                  nextStep: "",
                }));
              })();
            }}
          >
            <label>
              Candidate
              <select
                value={replyForm.candidateId}
                onChange={(event) =>
                  setReplyForm((current) => ({ ...current, candidateId: event.target.value }))
                }
              >
                {proofCandidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Channel
              <select
                value={replyForm.channel}
                onChange={(event) =>
                  setReplyForm((current) => ({
                    ...current,
                    channel: event.target.value as ManualReplyLog["channel"],
                  }))
                }
              >
                <option value="instagram_dm">Instagram DM</option>
                <option value="email">Email</option>
                <option value="warm_intro">Warm intro</option>
                <option value="in_person">In person</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Sentiment
              <select
                value={replyForm.sentiment}
                onChange={(event) =>
                  setReplyForm((current) => ({
                    ...current,
                    sentiment: event.target.value as ManualReplyLog["sentiment"],
                  }))
                }
              >
                <option value="positive_demo">Positive demo</option>
                <option value="positive_info">Positive info</option>
                <option value="neutral">Neutral</option>
                <option value="wrong_contact">Wrong contact</option>
                <option value="bounce">Bounce</option>
                <option value="not_now">Not now</option>
                <option value="no_interest">No interest</option>
                <option value="concern">Concern</option>
              </select>
            </label>
            <label>
              Message version
              <input
                value={replyForm.messageVersion}
                onChange={(event) =>
                  setReplyForm((current) => ({ ...current, messageVersion: event.target.value }))
                }
              />
            </label>
            <label className="wide">
              Reply summary
              <textarea
                placeholder="Example: asked for private preview, redirected to events manager, or raised data-source concern."
                value={replyForm.summary}
                onChange={(event) =>
                  setReplyForm((current) => ({ ...current, summary: event.target.value }))
                }
              />
            </label>
            <label className="wide">
              Next step
              <input
                placeholder="Example: send owner-approved private preview link after approval."
                value={replyForm.nextStep}
                onChange={(event) =>
                  setReplyForm((current) => ({ ...current, nextStep: event.target.value }))
                }
              />
            </label>
            <button className="button primary wide" type="submit">
              Log manual reply
            </button>
            <p className="form-note">
              Local-only log. It records what happened elsewhere after approval; it does not send,
              publish, invoice, or sync provider data.
            </p>
          </form>
          {data.manualReplyLogs.length === 0 ? (
            <EmptyState
              title="No replies logged yet"
              copy={`The first ${sentManualCount} emails are out. Log every reply, bounce, wrong-contact redirect, concern, or package question here.`}
            />
          ) : (
            <div className="reply-log-list">
              {data.manualReplyLogs.slice(0, 6).map((log) => (
                <div className="reply-log-row" key={log.id}>
                  <div>
                    <strong>{log.candidateName}</strong>
                    <small>
                      {log.channel.replaceAll("_", " ")} - {log.sentiment.replaceAll("_", " ")}
                    </small>
                  </div>
                  <p>{log.summary}</p>
                  <small>{log.nextStep}</small>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-panel">
          <SectionHeader
            label="AI Brain"
            title="Local command engine"
            copy={brain.summary}
            action={
              <button
                className="button tiny"
                type="button"
                onClick={() => {
                  void onSaveBrainRun({
                    stage: brain.stage,
                    summary: brain.summary,
                    topRecommendation: brain.recommendations[0]?.title ?? "Review manually",
                    topGate: brain.recommendations[0]?.gate ?? "No gate",
                    openGaps: brain.gaps.length,
                    averageProgress: brain.averageProgress,
                  });
                }}
              >
                Save run
              </button>
            }
          />
          <div className="brain-stage-row">
            <SparkIcon />
            <span>
              {brain.stage} - {brain.averageProgress}% average module progress
            </span>
            <StatusPill tone="blue">Rules only</StatusPill>
          </div>
          <div className="brain-next-batch">
            <strong>Next best batch</strong>
            <p>{brain.nextBestBatch}</p>
          </div>
          <div className="brain-module-list">
            {brain.moduleProgress.map((module) => (
              <div className="brain-module-row" key={module.id}>
                <div>
                  <strong>{module.name}</strong>
                  <small>{module.nextStep}</small>
                </div>
                <span>{module.progress}%</span>
              </div>
            ))}
          </div>
          <div className="brain-check-list">
            {brain.qualityChecks.map((check) => (
              <div className={`brain-check-row ${check.status}`} key={check.id}>
                <strong>{check.label}</strong>
                <small>{check.detail}</small>
                <StatusPill tone={check.status === "pass" ? "green" : "amber"}>
                  {check.status}
                </StatusPill>
              </div>
            ))}
          </div>
          <div className="brain-recommendation-list">
            {brain.recommendations.slice(0, 3).map((recommendation) => (
              <div className="brain-recommendation-row" key={recommendation.id}>
                <div>
                  <strong>{recommendation.title}</strong>
                  <p>{recommendation.why}</p>
                  <small>{recommendation.action}</small>
                </div>
                <StatusPill tone={recommendation.priority === "now" ? "amber" : "blue"}>
                  {recommendation.priority}
                </StatusPill>
              </div>
            ))}
          </div>
          <div className="brain-gap-list">
            {brain.gaps.map((gap) => (
              <span key={gap}>{gap}</span>
            ))}
          </div>
          <div className="brain-run-list">
            <strong>Saved brain runs</strong>
            {data.brainRuns.length === 0 ? (
              <small>No local brain runs saved yet.</small>
            ) : (
              data.brainRuns.slice(0, 4).map((run) => (
                <div className="brain-run-row" key={run.id}>
                  <span>{run.averageProgress}%</span>
                  <small>
                    {run.topRecommendation} - {run.openGaps} open gap(s)
                  </small>
                </div>
              ))
            )}
          </div>
          <div className="brain-doc-links">
            <strong>Ranking and release docs</strong>
            <small>docs/seo-aeo-geo/SOURCE_BACKED_RELEASE_QUEUE_PACKET.md</small>
            <small>docs/seo-aeo-geo/ENTITY_AND_QUERY_MAP.md</small>
            <small>docs/seo-aeo-geo/EDITORIAL_BACKLOG.md</small>
            <small>docs/seo-aeo-geo/SOURCE_BACKED_WEDGE_TEMPLATE.md</small>
            <small>docs/hook-intelligence/README.md</small>
            <small>docs/hook-intelligence/HOOK_RUBRIC.md</small>
            <small>docs/content-quality-gate/README.md</small>
            <small>docs/content-quality-gate/RELEASE_CHECKLIST.md</small>
            <small>npm run seo:proof</small>
          </div>
        </article>

        <article className="admin-panel">
          <SectionHeader
            label="Revenue experiments"
            title="Offer tests to run before Stripe"
            copy="Every package test has a metric, guardrail, and owner approval gate."
          />
          <div className="proof-candidate-summary">
            <span>
              <strong>{contactPathsReady}</strong>
              Contact-ready
            </span>
            <span>
              <strong>{meaningfulReplies}</strong>
              Reply signals
            </span>
            <span>
              <strong>{packageDemandSignals}</strong>
              Package signals
            </span>
          </div>
          <div className="experiment-list">
            {data.revenueExperiments.map((experiment) => (
              <div className="experiment-row" key={experiment.id}>
                <strong>{experiment.name}</strong>
                <small>{experiment.hypothesis}</small>
                <div className="experiment-meta">
                  <StatusPill tone={experiment.status === "running_local" ? "blue" : "amber"}>
                    {experiment.status.replaceAll("_", " ")}
                  </StatusPill>
                  <span>{experiment.primaryMetric}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <SectionHeader
            label="Domain prep"
            title={siteConfig.targetDomain}
            copy="Domain purchase remains a business decision. This package is ready to preview before that step."
          />
          <ul className="plain-list">
            <li>Confirm preferred domain and legal risk.</li>
            <li>Approve Vercel project and environment flags.</li>
            <li>Approve data sourcing and publishing policy.</li>
            <li>Approve payment terms before Stripe activation.</li>
          </ul>
        </article>
      </section>

      <section className="admin-grid bottom">
        <article className="admin-panel">
          <ShieldIcon className="panel-icon" />
          <h2>Audit log</h2>
          <div className="audit-list">
            {data.auditLogs.slice(0, 8).map((log) => (
              <div className="audit-row" key={log.id}>
                <strong>{log.action.replaceAll("_", " ")}</strong>
                <small>{log.summary}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="admin-panel">
          <SparkIcon className="panel-icon" />
          <h2>Recent growth events</h2>
          <div className="audit-list">
            {data.growthEvents.slice(0, 8).map((event) => (
              <div className="audit-row" key={event.id}>
                <strong>{event.name.replaceAll("_", " ")}</strong>
                <small>{event.path} - {new Date(event.createdAt).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="admin-panel">
          <LockIcon className="panel-icon" />
          <h2>Local controls</h2>
          <p>
            Resetting clears localStorage demo submissions and gate-ready markers, then restores
            the original seed package.
          </p>
          <div className="hero-actions">
            <button
              className="button secondary"
              type="button"
              onClick={() => {
                void onResetDemo();
              }}
            >
              Reset local demo
            </button>
            <AppLink className="button secondary" to="/private-preview/date-night">
              Private preview <ArrowRightIcon />
            </AppLink>
            <AppLink className="button primary" to="/">
              Public preview <ArrowRightIcon />
            </AppLink>
          </div>
        </article>
      </section>
    </>
  );
}
