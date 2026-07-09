import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CityAtlasData,
  CityMission,
  MissionFeedbackType,
  MissionStepStatus,
  SavedItem,
  TravelMode,
} from "../../types";
import { siteConfig } from "../../config/site";
import { MissionExecutionPanel } from "../../components/MissionExecutionPanel";
import { AppLink } from "../../components/Link";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  LockIcon,
  MapIcon,
  ShareIcon,
  SparkIcon,
  StoreIcon,
} from "../../components/Icons";
import { EmptyState, SectionHeader, StatusPill } from "../../components/UI";
import {
  getMissionCompletedCount,
  getMissionEndTimeLabel,
  getMissionFeedbackLabel,
  getMissionPlanState,
  getMissionSchedule,
  getMissionSelectedStartTime,
  getMissionStepUiStatus,
  getRouteLearningSummary,
  getMissionSavedCount,
  getMissionSavedPercent,
  getMissionShareText,
  getTravelModeLabel,
  getMissionFitNote,
  resolveMissionStepTarget,
  resolveSavedItemTypeLabel,
} from "../../lib/missions";
import { simplifyGuideDisplayText, simplifyMissionDisplayText } from "../../lib/publicCopy";

interface PlannerPageProps {
  data: CityAtlasData;
  onToggleSave: (itemType: SavedItem["itemType"], itemId: string, label: string) => void;
  onClearSavedPlan: () => void;
  onMoveSavedItem: (savedItemId: string, direction: "up" | "down") => void;
  onSaveMission: (mission: CityMission) => void;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
  onSetMissionTravelMode: (mission: CityMission, travelMode: TravelMode) => void;
  onSetMissionStartTime: (mission: CityMission, selectedStartTime: string) => void;
  onSetMissionStepStatus: (
    mission: CityMission,
    stepIndex: number,
    status: MissionStepStatus,
  ) => void;
  onAddMissionFeedback: (mission: CityMission, feedbackType: MissionFeedbackType) => void;
  onResetMissionProgress: (mission: CityMission) => void;
}

function isSaved(savedItems: SavedItem[], itemType: SavedItem["itemType"], itemId: string) {
  return savedItems.some((item) => item.itemType === itemType && item.itemId === itemId);
}

type SavedPlanEntryTone = "green" | "amber" | "blue" | "ink" | "muted";

interface SavedPlanEntry {
  item: SavedItem;
  detail?: string;
  meta: string[];
  tone: SavedPlanEntryTone;
  typeLabel: string;
}

const savedPlanDateFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "numeric",
  month: "short",
});

function formatSavedPlanDate(value?: string) {
  if (!value) return undefined;
  const normalized = value.includes("T") ? value : `${value}T12:00:00`;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return value;
  return savedPlanDateFormatter.format(parsed);
}

function simplifySavedPlanDetail(value?: string, maxLength = 120) {
  if (!value) return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return undefined;
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength - 3).trim()}...`
    : normalized;
}

function compactStrings(values: Array<string | undefined>) {
  return values.filter((value): value is string => Boolean(value));
}

function getPlannerHeroStopLabel(rawLabel?: string, fallbackLabel?: string) {
  const normalized = simplifyMissionDisplayText(rawLabel ?? "").trim();
  if (!normalized) return fallbackLabel;

  return normalized
    .replace(/^(head to|start at|browse|finish with|finish at|keep)\s+/i, "")
    .replace(/\s+as dinner$/i, "")
    .trim();
}

function getSavedPlanEntry(data: CityAtlasData, item: SavedItem): SavedPlanEntry {
  if (item.itemType === "business") {
    const business = data.businesses.find((candidate) => candidate.id === item.itemId);
    return {
      item,
      detail: simplifySavedPlanDetail(business?.shortDescription ?? business?.bestFor[0]),
      meta: compactStrings([business?.category, business?.neighborhood]),
      tone: "green",
      typeLabel: "Place",
    };
  }

  if (item.itemType === "event") {
    const event = data.events.find((candidate) => candidate.id === item.itemId);
    return {
      item,
      detail: simplifySavedPlanDetail(event?.venue ? `${event.venue}${event.priceLabel ? ` • ${event.priceLabel}` : ""}` : event?.description),
      meta: compactStrings([formatSavedPlanDate(event?.date), event?.time, event?.neighborhood]),
      tone: "amber",
      typeLabel: "Event",
    };
  }

  if (item.itemType === "guide") {
    const guide = data.guides.find((candidate) => candidate.id === item.itemId);
    return {
      item,
      detail: simplifySavedPlanDetail(guide?.promise ?? guide?.summary ?? guide?.excerpt),
      meta: compactStrings([
        guide?.readMinutes ? `${guide.readMinutes} min read` : undefined,
        guide?.category,
        guide?.neighborhood,
      ]),
      tone: "blue",
      typeLabel: "Guide",
    };
  }

  if (item.itemType === "offer") {
    const offer = data.offers.find((candidate) => candidate.id === item.itemId);
    const relatedBusiness = offer?.businessId
      ? data.businesses.find((candidate) => candidate.id === offer.businessId)
      : undefined;
    return {
      item,
      detail: simplifySavedPlanDetail(offer?.description),
      meta: compactStrings([
        relatedBusiness?.name,
        offer?.endDate ? `Ends ${formatSavedPlanDate(offer.endDate)}` : undefined,
      ]),
      tone: "ink",
      typeLabel: "Offer",
    };
  }

  const place = data.sourceBackedPlaces.find((candidate) => candidate.id === item.itemId);
  return {
    item,
    detail: simplifySavedPlanDetail(
      simplifyMissionDisplayText(place?.routeRole ?? place?.summary ?? place?.whyItFits ?? ""),
    ),
    meta: compactStrings([place?.category, place?.neighborhood]),
    tone: "muted",
    typeLabel: "Trusted stop",
  };
}

function renderSavedPlanIcon(itemType: SavedItem["itemType"]) {
  if (itemType === "business" || itemType === "offer") return <StoreIcon />;
  if (itemType === "event") return <CalendarIcon />;
  if (itemType === "guide") return <SparkIcon />;
  return <MapIcon />;
}

export function PlannerPage({
  data,
  onToggleSave,
  onClearSavedPlan,
  onMoveSavedItem,
  onSaveMission,
  onTrack,
  onSetMissionTravelMode,
  onSetMissionStartTime,
  onSetMissionStepStatus,
  onAddMissionFeedback,
  onResetMissionProgress,
}: PlannerPageProps) {
  const [shareState, setShareState] = useState("");
  const [clearSavedPlanArmed, setClearSavedPlanArmed] = useState(false);
  const [savedPlanClearMessage, setSavedPlanClearMessage] = useState("");
  const [selectedMissionId, setSelectedMissionId] = useState("");
  const [readyMadePlansOpen, setReadyMadePlansOpen] = useState(false);
  const activeRouteRef = useRef<HTMLElement | null>(null);
  const readyMadePlansRef = useRef<HTMLElement | null>(null);
  const cityGuides = data.guides.filter(
    (guide) => (guide.citySlug ?? siteConfig.citySlug) === siteConfig.citySlug,
  );
  const plannerGuideCandidates = cityGuides.slice(0, 4);
  const plannerBusinessCandidates = data.businesses.filter((business) => business.featured).slice(0, 4);
  const plannerEventCandidates = data.events.slice(0, 3);
  const plannerSourceBackedCandidates = data.sourceBackedPlaces.filter((place) => place.featured).slice(0, 6);

  const savedBusinesses = data.savedItems
    .filter((item) => item.itemType === "business")
    .map((item) => data.businesses.find((business) => business.id === item.itemId))
    .filter(Boolean);
  const savedEvents = data.savedItems
    .filter((item) => item.itemType === "event")
    .map((item) => data.events.find((event) => event.id === item.itemId))
    .filter(Boolean);
  const savedGuides = data.savedItems
    .filter((item) => item.itemType === "guide")
    .map((item) => data.guides.find((guide) => guide.id === item.itemId))
    .filter(Boolean);
  const savedOffers = data.savedItems
    .filter((item) => item.itemType === "offer")
    .map((item) => data.offers.find((offer) => offer.id === item.itemId))
    .filter(Boolean);
  const savedSourceBackedPlaces = data.savedItems
    .filter((item) => item.itemType === "source_backed_place")
    .map((item) => data.sourceBackedPlaces.find((place) => place.id === item.itemId))
    .filter(Boolean);

  const itineraryText = [
    ...savedBusinesses.map((business) => `Visit ${business?.name} in ${business?.neighborhood}`),
    ...savedEvents.map((event) => `Check ${event?.title} on ${event?.date}`),
    ...savedGuides.map((guide) => `Read ${guide ? simplifyGuideDisplayText(guide.title) : ""}`),
    ...savedOffers.map((offer) => `Save ${offer?.title}`),
    ...savedSourceBackedPlaces.map((place) => `Keep ${place?.name} in ${place?.neighborhood}`),
  ].join(" -> ");

  const missionScores = useMemo(
    () =>
      data.cityMissions.map((mission) => ({
        mission,
        progress: getMissionSavedPercent(mission, data.savedItems),
      })),
    [data.cityMissions, data.savedItems],
  );

  const routeLearning = useMemo(() => getRouteLearningSummary(data), [data]);
  const fallbackMission = [...missionScores].sort((a, b) => b.progress - a.progress)[0]?.mission;
  const selectedMission = selectedMissionId
    ? data.cityMissions.find((mission) => mission.id === selectedMissionId)
    : undefined;
  const activeMission = selectedMission ?? routeLearning.recommendedMission ?? fallbackMission;
  const plannerMissionCandidates = useMemo(() => {
    const ordered = [
      activeMission,
      ...data.cityMissions.filter((mission) => mission.featured && mission.id !== activeMission?.id),
      ...data.cityMissions.filter((mission) => !mission.featured && mission.id !== activeMission?.id),
    ].filter(Boolean) as CityMission[];

    const seen = new Set<string>();
    return ordered.filter((mission) => {
      if (seen.has(mission.id)) return false;
      seen.add(mission.id);
      return true;
    }).slice(0, 4);
  }, [activeMission, data.cityMissions]);
  const activeMissionPlan = activeMission ? getMissionPlanState(data, activeMission) : undefined;
  const activeMissionInsight = activeMission ? routeLearning.insightsById[activeMission.id] : undefined;
  const activeMissionShareText = activeMission && activeMissionPlan
    ? getMissionShareText(data, activeMission, activeMissionPlan)
    : "";
  const activeMissionStartTime = activeMission && activeMissionPlan
    ? getMissionSelectedStartTime(activeMission, activeMissionPlan)
    : undefined;
  const activeMissionEndTime = activeMission && activeMissionPlan
    ? getMissionEndTimeLabel(activeMission, activeMissionPlan)
    : undefined;
  const activeMissionRouteStepIndices = useMemo(
    () =>
      activeMission
        ? activeMission.steps.reduce<number[]>((indices, step, index) => {
            if (step.itemType !== "guide") indices.push(index);
            return indices;
          }, [])
        : [],
    [activeMission],
  );
  const activeMissionSchedule = useMemo(
    () => (activeMission && activeMissionPlan ? getMissionSchedule(activeMission, activeMissionPlan) : []),
    [activeMission, activeMissionPlan],
  );
  const activeMissionNextStepIndex = useMemo(() => {
    if (!activeMission || !activeMissionPlan) return -1;
    return activeMissionRouteStepIndices.find((stepIndex) => {
      const status = getMissionStepUiStatus(activeMission, activeMissionPlan, stepIndex, data.savedItems);
      return status !== "visited" && status !== "skipped";
    }) ?? -1;
  }, [activeMission, activeMissionPlan, activeMissionRouteStepIndices, data.savedItems]);
  const activeMissionNextStepTarget = useMemo(() => {
    if (!activeMission || activeMissionNextStepIndex < 0) return undefined;
    return resolveMissionStepTarget(
      data,
      activeMission.steps[activeMissionNextStepIndex],
      activeMission,
    );
  }, [activeMission, activeMissionNextStepIndex, data]);
  const activeMissionNextStepSchedule = useMemo(
    () => activeMissionSchedule.find((entry) => entry.stepIndex === activeMissionNextStepIndex),
    [activeMissionNextStepIndex, activeMissionSchedule],
  );
  const activeMissionPendingStops = useMemo(() => {
    if (!activeMission || !activeMissionPlan) return 0;
    return activeMissionRouteStepIndices.filter((stepIndex) => {
      const status = getMissionStepUiStatus(activeMission, activeMissionPlan, stepIndex, data.savedItems);
      return status !== "visited" && status !== "skipped";
    }).length;
  }, [activeMission, activeMissionPlan, activeMissionRouteStepIndices, data.savedItems]);
  const activeMissionCurrentStopNumber = useMemo(() => {
    if (activeMissionNextStepIndex < 0) return 0;
    return activeMissionRouteStepIndices.indexOf(activeMissionNextStepIndex) + 1;
  }, [activeMissionNextStepIndex, activeMissionRouteStepIndices]);
  const activeMissionNextStep = useMemo(
    () => (
      activeMission && activeMissionNextStepIndex >= 0
        ? activeMission.steps[activeMissionNextStepIndex]
        : undefined
    ),
    [activeMission, activeMissionNextStepIndex],
  );
  const activeMissionNextStepCopy = useMemo(() => {
    if (!activeMissionNextStep?.note) return undefined;
    return simplifyMissionDisplayText(activeMissionNextStep.note);
  }, [activeMissionNextStep]);
  const activeMissionHeroStopLabel = useMemo(
    () => getPlannerHeroStopLabel(activeMissionNextStep?.label, activeMissionNextStepTarget?.label),
    [activeMissionNextStep?.label, activeMissionNextStepTarget?.label],
  );
  const completedSteps = data.cityMissions.reduce(
    (total, mission) => total + getMissionCompletedCount(mission, getMissionPlanState(data, mission)),
    0,
  );
  const totalSteps = data.cityMissions.reduce((total, mission) => total + mission.steps.length, 0);
  const feedbackTotals = useMemo(() => routeLearning.insights.reduce(
    (totals, insight) => ({
      wouldDoAgain: totals.wouldDoAgain + insight.wouldDoAgainCount,
      tooLong: totals.tooLong + insight.tooLongCount,
      wrongPace: totals.wrongPace + insight.wrongPaceCount,
      shareReady: totals.shareReady + insight.shareReadyCount,
    }),
    {
      wouldDoAgain: 0,
      tooLong: 0,
      wrongPace: 0,
      shareReady: 0,
    },
  ), [routeLearning.insights]);
  const plannerProfileTitle = !routeLearning.hasSignals
    ? "New on this device"
    : feedbackTotals.tooLong + feedbackTotals.wrongPace > feedbackTotals.wouldDoAgain + feedbackTotals.shareReady
      ? "Leaning shorter and easier"
      : routeLearning.preferredTravelMode
        ? `${getTravelModeLabel(routeLearning.preferredTravelMode)}-first planner`
        : "Getting easier to repeat";
  const plannerProfileNote = !routeLearning.hasSignals
    ? "Save one full plan or mark a few real stops first and CityAtlas will start shaping the next suggestion around your pace."
    : feedbackTotals.tooLong > 0
      ? "You have already taught CityAtlas to prefer a shorter plan before adding more stops."
      : feedbackTotals.wrongPace > 0
        ? "You have started steering CityAtlas toward a better travel pace instead of a generic plan."
        : feedbackTotals.shareReady > 0
          ? "You already have at least one plan that feels stable enough to share again."
          : "Your saved list, visited stops, and travel-mode choices are now shaping what CityAtlas recommends first.";
  const accountStatusNote = routeLearning.hasSignals
    ? "Your plan memory, pace, progress, and feedback are live on this device now. Accounts and cross-device sync are still not live yet."
    : "This planner is ready to learn locally first. Accounts and cross-device sync are still not live yet.";
  const plannerHeroSteps = [
    {
      label: "1",
      title: "Start with one guide",
      copy: "Pick one believable plan first instead of opening everything at once.",
    },
    {
      label: "2",
      title: "Save only a short list",
      copy: "Keep the stops you would really use and ignore the rest for now.",
    },
    {
      label: "3",
      title: "Let the planner learn",
      copy: "The planner gets clearer after you use one real plan on this device.",
    },
  ];
  const stagedShareText =
    activeMissionShareText
    || itineraryText
    || "Save two or three strong picks first, then CityAtlas turns them into one easy-to-send Vancouver plan.";
  const sharePreviewExcerpt = stagedShareText.length > 190
    ? `${stagedShareText.slice(0, 187).trim()}...`
    : stagedShareText;
  const savedPlanEntries = useMemo(
    () => data.savedItems.map((item) => getSavedPlanEntry(data, item)),
    [data],
  );
  const savedRouteEntries = useMemo(
    () =>
      data.missionPlans
        .map((plan) => {
          const mission = data.cityMissions.find((candidate) => candidate.id === plan.missionId);
          if (!mission) return undefined;
          return {
            plan,
            mission,
            completedCount: getMissionCompletedCount(mission, plan),
            savedCount: getMissionSavedCount(mission, data.savedItems),
            savedPercent: getMissionSavedPercent(mission, data.savedItems),
            startTime: getMissionSelectedStartTime(mission, plan),
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
        .sort((left, right) => Date.parse(right.plan.updatedAt || "") - Date.parse(left.plan.updatedAt || "")),
    [data.cityMissions, data.missionPlans, data.savedItems],
  );
  const shareSummaryItems = [
    {
      label: "Saved",
      value: `${data.savedItems.length} ${data.savedItems.length === 1 ? "stop" : "stops"}`,
    },
    {
      label: "Pace",
      value: activeMissionPlan
        ? getTravelModeLabel(activeMissionPlan.travelMode)
        : routeLearning.preferredTravelMode
          ? getTravelModeLabel(routeLearning.preferredTravelMode)
          : "Flexible",
    },
    {
      label: "Length",
      value: activeMission?.timeBox ?? "Build as you go",
    },
    {
      label: "Start",
      value: activeMissionStartTime ?? "Choose a time",
    },
  ];
  const hasSavedItems = data.savedItems.length > 0;
  const hasSavedRoutes = savedRouteEntries.length > 0;
  const hasSavedPlanState = data.savedItems.length > 0 || data.missionPlans.length > 0;
  const clearSavedPlanLabel = hasSavedItems ? "Clear saved list" : "Clear planner";

  useEffect(() => {
    if (!hasSavedPlanState) {
      setClearSavedPlanArmed(false);
      return;
    }

    setSavedPlanClearMessage("");
  }, [hasSavedPlanState, data.savedItems.length]);

  useEffect(() => {
    if (!selectedMissionId) return;
    if (data.cityMissions.some((mission) => mission.id === selectedMissionId)) return;
    setSelectedMissionId("");
  }, [data.cityMissions, selectedMissionId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const routeId = new URLSearchParams(window.location.search).get("route");
    if (!routeId) return;
    if (!data.cityMissions.some((mission) => mission.id === routeId)) return;
    setSelectedMissionId(routeId);
  }, [data.cityMissions]);

  function scrollToSection(section: HTMLElement | null) {
    window.requestAnimationFrame(() => {
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleOpenMissionPlan(missionId: string, source: "saved_route" | "ready_made") {
    setSelectedMissionId(missionId);
    setShareState("");
    setSavedPlanClearMessage("");
    onTrack("planner_map_route_opened", {
      missionId,
      source,
    });
    window.history.replaceState(
      null,
      "",
      `/planner?route=${encodeURIComponent(missionId)}#planner-active-route`,
    );
    scrollToSection(activeRouteRef.current);
  }

  function handleOpenReadyMadePlans() {
    setReadyMadePlansOpen(true);
    onTrack("planner_ready_made_section_opened", {
      savedItems: data.savedItems.length,
      savedRoutes: savedRouteEntries.length,
    });
    window.history.replaceState(null, "", "#planner-explore-more");
    scrollToSection(readyMadePlansRef.current);
  }

  async function stageShareDraft(mode: "copy" | "share" = "copy") {
    setClearSavedPlanArmed(false);
    onTrack(mode === "share" ? "planner_share_native_requested" : "planner_share_draft_prepared", {
      savedItems: data.savedItems.length,
      completedSteps,
    });

    if (mode === "share" && navigator.share) {
      try {
        await navigator.share({
          title: activeMission ? simplifyMissionDisplayText(activeMission.title) : "CityAtlas plan",
          text: stagedShareText,
        });
        setShareState("Plan shared.");
        return;
      } catch {
        setShareState("Share canceled. Your plan summary is still ready below.");
        return;
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(stagedShareText);
        setShareState("Plan summary copied. Paste it into your message app when you are ready.");
        return;
      }
    } catch {
      // Fall through to the visible preview.
    }

    setShareState("Plan summary is ready below. Copy it into your message app when you are ready.");
  }

  function handleClearSavedPlan() {
    onClearSavedPlan();
    setClearSavedPlanArmed(false);
    setSavedPlanClearMessage("Saved list cleared on this device.");
    setShareState("");
  }

  return (
    <>
      {!activeMission ? (
        <section className="city-hero planner-hero">
          <div className="planner-hero-copy">
            <p className="section-label">Planner</p>
            <h1>Build a simple Vancouver plan you can keep</h1>
            <p>
              Save places, events, and guides into one simple Vancouver plan. Pick one believable
              route, keep the working list short, and use the map only when you are ready to leave.
            </p>
            <div className="hero-actions">
              <AppLink
                className="button primary"
                to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
              >
                Start with a guide
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/missions">
                Browse ready-made routes
              </AppLink>
            </div>
            <p className="planner-hero-note">
              This planner remembers progress on this device now. Accounts and cross-device sync are still not live yet.
            </p>
          </div>
          <article className="source-panel planner-hero-desk-card">
            <>
              <p className="section-label">Start here</p>
              <strong>Start with one guide, then save only the stops you would actually keep.</strong>
              <p>
                CityAtlas gets clearer once you keep the working list short and follow one real plan.
              </p>
              <div className="planner-hero-step-list" aria-label="How to start using the planner">
                {plannerHeroSteps.map((step) => (
                  <article className="planner-hero-step" key={step.label}>
                    <span>{step.label}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <small>{step.copy}</small>
                    </div>
                  </article>
                ))}
              </div>
            </>
          </article>
        </section>
      ) : null}

      {activeMission ? (
        <section className="planner-full-bleed-route-section" id="planner-active-route" ref={activeRouteRef}>
          <MissionExecutionPanel
            data={data}
            mission={activeMission}
            onSaveMission={onSaveMission}
            onTrack={onTrack}
            onSetMissionTravelMode={onSetMissionTravelMode}
            onSetMissionStartTime={onSetMissionStartTime}
            onSetMissionStepStatus={onSetMissionStepStatus}
            onAddMissionFeedback={onAddMissionFeedback}
            onResetMissionProgress={onResetMissionProgress}
            variant="planner"
          />
        </section>
      ) : null}

      <section className="section-block" id="planner-saved-plan">
        <div className="planner-lower-stack">
          {hasSavedItems ? (
            <details className="planner-detail-group planner-share-group">
              <summary className="planner-detail-summary">
                <div>
                  <p className="section-label">Optional</p>
                  <strong>Ready to send this plan?</strong>
                </div>
                <span className="planner-detail-toggle" aria-hidden="true">Optional</span>
              </summary>
              <div className="planner-detail-body">
                <p className="planner-detail-copy">
                  Open this only when the list already feels right and you are ready to send it.
                </p>
                <div className="share-draft">
                  <div className="share-draft-summary" aria-label="Plan summary">
                    {shareSummaryItems.map((item) => (
                      <div className="share-draft-stat" key={item.label}>
                        <small>{item.label}</small>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="share-recipient-preview">
                    <p className="section-label">What they'll see</p>
                    <p className="share-draft-preview share-draft-preview-bubble">{sharePreviewExcerpt}</p>
                  </div>
                  <div className="share-actions">
                    <button className="button primary" type="button" onClick={() => void stageShareDraft()}>
                      Copy plan summary
                    </button>
                    <button className="button secondary" type="button" onClick={() => void stageShareDraft("share")}>
                      Share plan <ShareIcon />
                    </button>
                  </div>
                  <details className="share-preview-disclosure">
                    <summary className="mission-inline-summary">
                      <div>
                        <p className="section-label">Full plan message</p>
                        <strong>Review the exact share text</strong>
                      </div>
                      <span className="mission-inline-summary-tag">Preview</span>
                    </summary>
                    <pre className="route-share-preview route-share-preview-compact">{stagedShareText}</pre>
                  </details>
                </div>
                {shareState ? <small className="local-success">{shareState}</small> : null}
              </div>
            </details>
          ) : null}
          <div className="planner-primary-card">
            <SectionHeader
              title="Your saved plans"
              copy="Full routes show first. Open one to see the map again. Saved stops stay underneath as a smaller working list."
              action={(
                <div className="planner-saved-plan-actions">
                  <StatusPill tone="blue">
                    {savedRouteEntries.length} {savedRouteEntries.length === 1 ? "route" : "routes"}
                  </StatusPill>
                  <StatusPill tone="muted">
                    {data.savedItems.length} {data.savedItems.length === 1 ? "stop" : "stops"}
                  </StatusPill>
                  {hasSavedPlanState ? (
                    clearSavedPlanArmed ? (
                      <div className="planner-saved-plan-clear-actions">
                        <button className="button tiny" type="button" onClick={handleClearSavedPlan}>
                          Confirm clear
                        </button>
                        <button
                          className="button tertiary planner-saved-plan-cancel"
                          type="button"
                          onClick={() => setClearSavedPlanArmed(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="button tiny planner-saved-plan-clear-trigger"
                        type="button"
                        onClick={() => setClearSavedPlanArmed(true)}
                      >
                        {clearSavedPlanLabel}
                      </button>
                    )
                  ) : null}
                </div>
              )}
            />
            {savedPlanClearMessage ? <p className="saved-list-note saved-list-feedback">{savedPlanClearMessage}</p> : null}
            {!hasSavedItems && !hasSavedRoutes ? (
              <div className="planner-empty-state-card">
                <EmptyState
                  title="No saved plans yet"
                  copy="Keep a full route if you want the map plan ready later, or save one strong stop if you are still deciding."
                />
                <div className="planner-empty-actions">
                  <a className="button primary" href="#planner-save-candidates">
                    Pick the first stop
                  </a>
                  <button className="button secondary" type="button" onClick={handleOpenReadyMadePlans}>
                    Choose a ready-made plan
                  </button>
                </div>
              </div>
            ) : null}

            {hasSavedRoutes ? (
              <div className="planner-saved-route-list">
                <p className="saved-list-note">
                  These are the full route plans saved or started on this device. Open one to see
                  the Google map plan again.
                </p>
                <div className="planner-saved-route-grid">
                  {savedRouteEntries.map((entry) => (
                    <article
                      className={`planner-saved-route-card${activeMission?.id === entry.mission.id ? " is-active" : ""}`}
                      key={entry.mission.id}
                    >
                      <div>
                        <p className="section-label">Saved route</p>
                        <h3>{simplifyMissionDisplayText(entry.mission.title)}</h3>
                        <p>{simplifyMissionDisplayText(entry.mission.hook)}</p>
                      </div>
                      <div className="planner-saved-route-meta">
                        <span>{entry.mission.timeBox}</span>
                        <span>{entry.startTime ?? entry.mission.startWindow}</span>
                        <span>{getTravelModeLabel(entry.plan.travelMode)}</span>
                        <span>
                          {entry.completedCount}/{entry.mission.steps.length} done
                        </span>
                      </div>
                      <div className="planner-saved-route-progress" aria-label={`${entry.savedPercent}% of stops saved`}>
                        <span style={{ width: `${entry.savedPercent}%` }} />
                      </div>
                      <div className="planner-saved-route-actions">
                        <button
                          className="button primary"
                          type="button"
                          onClick={() => handleOpenMissionPlan(entry.mission.id, "saved_route")}
                        >
                          {activeMission?.id === entry.mission.id ? "Showing on map" : "Open map plan"}
                        </button>
                        <small>
                          {entry.savedCount} {entry.savedCount === 1 ? "stop" : "stops"} saved
                          {entry.plan.updatedAt ? ` • updated ${formatSavedPlanDate(entry.plan.updatedAt)}` : ""}
                        </small>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {hasSavedItems ? (
              <div className="saved-list">
                <div className="planner-saved-subhead">
                  <strong>Saved stops</strong>
                  <small>Use these as notes or reorder them before sharing a quick summary.</small>
                </div>
                <p className="saved-list-note">
                  Use the arrows to put the plan in the right order before you copy the summary.
                </p>
                {savedPlanEntries.map((entry, index) => (
                  <div className="saved-row" key={entry.item.id}>
                    <div className="saved-row-leading">
                      <span className="saved-row-order">{index + 1}</span>
                      <span className={`saved-row-type saved-row-type-${entry.tone}`}>{entry.typeLabel}</span>
                      <span className="saved-row-glyph" aria-hidden="true">{renderSavedPlanIcon(entry.item.itemType)}</span>
                    </div>
                    <div className="saved-row-copy">
                      <div className="saved-row-heading">
                        <strong>{entry.item.label}</strong>
                        <small>{resolveSavedItemTypeLabel(entry.item.itemType)}</small>
                      </div>
                      {entry.meta.length > 0 ? (
                        <div className="saved-row-meta">
                          {entry.meta.map((metaItem) => (
                            <span key={`${entry.item.id}-${metaItem}`}>{metaItem}</span>
                          ))}
                        </div>
                      ) : null}
                      {entry.detail ? <p className="saved-row-detail">{entry.detail}</p> : null}
                    </div>
                    <div className="saved-row-actions">
                      <button
                        className="saved-row-icon-button"
                        type="button"
                        onClick={() => onMoveSavedItem(entry.item.id, "up")}
                        aria-label={`Move ${entry.item.label} up`}
                        disabled={index === 0}
                      >
                        <ChevronUpIcon />
                      </button>
                      <button
                        className="saved-row-icon-button"
                        type="button"
                        onClick={() => onMoveSavedItem(entry.item.id, "down")}
                        aria-label={`Move ${entry.item.label} down`}
                        disabled={index === data.savedItems.length - 1}
                      >
                        <ChevronDownIcon />
                      </button>
                      <button
                        className="saved-row-remove-button"
                        type="button"
                        onClick={() => onToggleSave(entry.item.itemType, entry.item.itemId, entry.item.label)}
                      >
                        <CloseIcon />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-block" id="planner-save-candidates">
        <details className="planner-detail-group" open={!hasSavedItems}>
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">Optional</p>
              <strong>Need one more stop?</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <p className="planner-detail-copy">
              Pick one trusted stop, one place, one event, or one guide. Keep the plan short enough that you would really use it.
            </p>
            <div className="planner-pool-groups">
              <article className="source-panel planner-pool-group">
                <div className="planner-pool-group-header">
                  <div>
                    <p className="section-label">Trusted places</p>
                    <h2>Add one trusted stop</h2>
                  </div>
                  <StatusPill tone="blue">{plannerSourceBackedCandidates.length} picks</StatusPill>
                </div>
                <p>Use one trusted stop when the plan should feel easier to trust before you share it.</p>
                <div className="planner-pool">
                  {plannerSourceBackedCandidates.map((place) => (
                    <button
                      className={isSaved(data.savedItems, "source_backed_place", place.id) ? "planner-chip saved" : "planner-chip"}
                      type="button"
                      onClick={() => onToggleSave("source_backed_place", place.id, place.name)}
                      key={place.id}
                    >
                      <MapIcon />
                      <span>{place.name}</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="source-panel planner-pool-group">
                <div className="planner-pool-group-header">
                  <div>
                    <p className="section-label">Places</p>
                    <h2>Start with one place</h2>
                  </div>
                  <StatusPill tone="blue">{plannerBusinessCandidates.length} picks</StatusPill>
                </div>
                <p>Choose one place that feels like the main stop before you add anything else.</p>
                <div className="planner-pool">
                  {plannerBusinessCandidates.map((business) => (
                    <button
                      className={isSaved(data.savedItems, "business", business.id) ? "planner-chip saved" : "planner-chip"}
                      type="button"
                      onClick={() => onToggleSave("business", business.id, business.name)}
                      key={business.id}
                    >
                      <StoreIcon />
                      <span>{business.name}</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="source-panel planner-pool-group">
                <div className="planner-pool-group-header">
                  <div>
                    <p className="section-label">Events</p>
                    <h2>Add one timed stop</h2>
                  </div>
                  <StatusPill tone="blue">{plannerEventCandidates.length} picks</StatusPill>
                </div>
                <p>Use one event when the plan needs a clear moment, not a packed schedule.</p>
                <div className="planner-pool">
                  {plannerEventCandidates.map((event) => (
                    <button
                      className={isSaved(data.savedItems, "event", event.id) ? "planner-chip saved" : "planner-chip"}
                      type="button"
                      onClick={() => onToggleSave("event", event.id, event.title)}
                      key={event.id}
                    >
                      <CalendarIcon />
                      <span>{event.title}</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="source-panel planner-pool-group">
                <div className="planner-pool-group-header">
                  <div>
                    <p className="section-label">Guides</p>
                    <h2>Use one guide for shape</h2>
                  </div>
                  <StatusPill tone="blue">{plannerGuideCandidates.length} picks</StatusPill>
                </div>
                <p>Open one guide when the plan still needs neighborhood logic, pacing, or a better next move.</p>
                <div className="planner-pool">
                  {plannerGuideCandidates.map((guide) => (
                    <button
                      className={isSaved(data.savedItems, "guide", guide.id) ? "planner-chip saved" : "planner-chip"}
                      type="button"
                      onClick={() => onToggleSave("guide", guide.id, simplifyGuideDisplayText(guide.title))}
                      key={guide.id}
                    >
                      <MapIcon />
                      <span>{simplifyGuideDisplayText(guide.title)}</span>
                    </button>
                  ))}
                </div>
              </article>
            </div>
            <div className="hero-actions planner-detail-actions">
              <AppLink className="button secondary" to="/vancouver/guides">
                Open all Vancouver guides
              </AppLink>
            </div>
          </div>
        </details>
      </section>

      <section className="section-block">
        <details className="planner-detail-group">
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">Optional</p>
              <strong>See what CityAtlas has learned on this device</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <div className="split-section planner-profile-section planner-profile-section-tight">
              <article className="source-panel planner-profile-card">
                <div className="public-intro-title">
                  <SparkIcon />
                  <h2>Personalized plan profile</h2>
                </div>
                <strong>{plannerProfileTitle}</strong>
                <p>{plannerProfileNote}</p>
                <div className="planner-profile-meta">
                  <StatusPill tone={routeLearning.preferredTravelMode ? "green" : "muted"}>
                    {routeLearning.preferredTravelMode
                      ? `${getTravelModeLabel(routeLearning.preferredTravelMode)} pace`
                      : "Still learning"}
                  </StatusPill>
                  {activeMissionInsight?.lastFeedback ? (
                    <StatusPill tone="blue">{getMissionFeedbackLabel(activeMissionInsight.lastFeedback)}</StatusPill>
                  ) : null}
                </div>
              </article>
              <article className="source-panel planner-profile-card planner-profile-card-muted">
                <div className="public-intro-title">
                  <LockIcon />
                  <h2>Accounts and sync</h2>
                </div>
                <strong>Local personalization is live now</strong>
                <p>{accountStatusNote}</p>
                <small>That keeps this honest while the product learns from real plan use first.</small>
              </article>
            </div>
            <div className="route-learning-grid">
              <article className="source-panel route-learning-card">
                <p className="section-label">Best fit now</p>
                <h3>
                  {activeMission ? simplifyMissionDisplayText(activeMission.title) : "Still learning"}
                </h3>
                <p>
                  {activeMission && activeMissionInsight
                    ? getMissionFitNote(activeMission, activeMissionInsight)
                    : "Save one full plan or mark a few real stops before CityAtlas starts steering the next suggestion."}
                </p>
              </article>
              <article className="source-panel route-learning-card">
                <p className="section-label">Preferred pace</p>
                <h3>
                  {routeLearning.preferredTravelMode
                    ? `${getTravelModeLabel(routeLearning.preferredTravelMode)} pace`
                    : "Still learning"}
                </h3>
                <p>
                  {routeLearning.preferredTravelMode
                    ? "This is the travel mode you keep returning to most often on this device."
                    : "Switch travel mode once or twice and CityAtlas will remember which pace feels easiest to keep."}
                </p>
              </article>
              <article className="source-panel route-learning-card">
                <p className="section-label">What to tighten</p>
                <h3>
                  {routeLearning.cautionMission
                    ? simplifyMissionDisplayText(routeLearning.cautionMission.title)
                    : "Keep it simple"}
                </h3>
                <p>
                  {routeLearning.cautionMission && routeLearning.cautionInsight
                    ? routeLearning.recoveryMission
                      ? `You have skipped more than you finished here lately. Try ${simplifyMissionDisplayText(routeLearning.recoveryMission.title)} when you want a cleaner next run.`
                      : "You have skipped more than you finished here lately, so shorten the plan before adding more stops."
                    : "The best next move is still one believable full plan, not a bigger saved list."}
                </p>
              </article>
            </div>
          </div>
        </details>
      </section>

      <section className="section-block" id="planner-explore-more" ref={readyMadePlansRef}>
        <details
          className="planner-detail-group"
          open={readyMadePlansOpen}
          onToggle={(event) => setReadyMadePlansOpen(event.currentTarget.open)}
        >
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">Optional</p>
              <strong>Choose another ready-made plan</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <p className="planner-detail-copy">
              Use this when you want CityAtlas to start with a full route instead of building from one saved stop.
            </p>
            <div className="planner-ready-route-grid">
              {plannerMissionCandidates.map((mission) => {
                const progress = getMissionSavedPercent(mission, data.savedItems);
                const insight = routeLearning.insightsById[mission.id];
                return (
                  <article
                    className={`planner-ready-route-card${activeMission?.id === mission.id ? " is-active" : ""}`}
                    key={mission.id}
                  >
                    <div className="mission-card-top">
                      <StatusPill tone={mission.featured ? "blue" : "muted"}>{mission.theme}</StatusPill>
                      <span>{mission.timeBox}</span>
                    </div>
                    <h3>{simplifyMissionDisplayText(mission.title)}</h3>
                    <p>{simplifyMissionDisplayText(mission.hook)}</p>
                    <div className="mission-progress">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <div className="mission-meta">
                      <small>{progress}% saved</small>
                      <small>{mission.steps.length} steps</small>
                    </div>
                    {insight?.hasSignals ? (
                      <small className="planner-ready-route-fit">
                        CityAtlas has local signals for this route.
                      </small>
                    ) : null}
                    <ol className="mission-step-preview">
                      {mission.steps.slice(0, 4).map((step, index) => (
                        <li key={`${mission.id}-ready-${step.itemType}-${step.itemId}-${index}`}>
                          <SparkIcon />
                          <span>{simplifyMissionDisplayText(step.label)}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="planner-ready-route-actions">
                      <button
                        className="button primary"
                        type="button"
                        onClick={() => handleOpenMissionPlan(mission.id, "ready_made")}
                      >
                        {activeMission?.id === mission.id ? "Showing on map" : "Open map plan"}
                      </button>
                      <button className="button secondary" type="button" onClick={() => onSaveMission(mission)}>
                        Keep this plan
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="hero-actions planner-detail-actions">
              <AppLink className="button secondary" to="/vancouver/missions">
                See all {data.cityMissions.length} ready-made plans
              </AppLink>
            </div>
          </div>
        </details>
      </section>
    </>
  );
}
