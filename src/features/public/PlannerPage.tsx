import { useMemo, useState } from "react";
import type {
  CityAtlasData,
  CityMission,
  MissionFeedbackType,
  MissionStepStatus,
  SavedItem,
  TravelMode,
} from "../../types";
import { siteConfig } from "../../config/site";
import { MissionCard } from "../../components/Cards";
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
  getMissionSelectedStartTime,
  getRouteLearningSummary,
  getMissionSavedPercent,
  getMissionShareText,
  getTravelModeLabel,
  getMissionFitNote,
  resolveSavedItemTypeLabel,
} from "../../lib/missions";
import { simplifyGuideDisplayText, simplifyMissionDisplayText } from "../../lib/publicCopy";

interface PlannerPageProps {
  data: CityAtlasData;
  onToggleSave: (itemType: SavedItem["itemType"], itemId: string, label: string) => void;
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
    detail: simplifySavedPlanDetail(place?.routeRole ?? place?.summary ?? place?.whyItFits),
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
  const activeMission = routeLearning.recommendedMission ?? fallbackMission;
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
    ? "Save one full route or mark a few real stops first and CityAtlas will start shaping the next suggestion around your pace."
    : feedbackTotals.tooLong > 0
      ? "You have already taught CityAtlas to prefer a shorter route before adding more stops."
      : feedbackTotals.wrongPace > 0
        ? "You have started steering CityAtlas toward a better travel pace instead of a generic route."
        : feedbackTotals.shareReady > 0
          ? "You already have at least one route that feels stable enough to share again."
          : "Your saved routes, visited stops, and travel-mode choices are now shaping what CityAtlas recommends first.";
  const accountStatusNote = routeLearning.hasSignals
    ? "Your route memory, pace, progress, and feedback are live on this device now. Accounts and cross-device sync are still not live yet."
    : "This planner is ready to learn locally first. Accounts and cross-device sync are still not live yet.";
  const plannerKpis = [
    {
      label: "Saved items",
      tone: "blue" as const,
      value: String(data.savedItems.length),
    },
    {
      label: "Steps marked",
      tone: "green" as const,
      value: `${completedSteps}/${totalSteps}`,
    },
    {
      label: "Best pace",
      tone: routeLearning.preferredTravelMode ? ("green" as const) : ("muted" as const),
      value: routeLearning.preferredTravelMode
        ? `${getTravelModeLabel(routeLearning.preferredTravelMode)} pace`
        : "Still learning",
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

  async function stageShareDraft(mode: "copy" | "share" = "copy") {
    onTrack(mode === "share" ? "planner_share_native_requested" : "planner_share_draft_prepared", {
      savedItems: data.savedItems.length,
      completedSteps,
    });

    if (mode === "share" && navigator.share) {
      try {
        await navigator.share({
          title: activeMission ? simplifyMissionDisplayText(activeMission.title) : "CityAtlas route",
          text: stagedShareText,
        });
        setShareState("Route shared.");
        return;
      } catch {
        setShareState("Share canceled. Your route summary is still ready below.");
        return;
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(stagedShareText);
        setShareState("Route summary copied. Paste it into your message app when you are ready.");
        return;
      }
    } catch {
      // Fall through to the visible preview.
    }

    setShareState("Route summary is ready below. Copy it into your message app when you are ready.");
  }

  return (
    <>
      <section className="city-hero planner-hero">
        <div className="planner-hero-copy">
          <p className="section-label">Planner</p>
          <h1>Build a simple Vancouver plan you can keep</h1>
          <p>
            Save places, events, and guides into one simple Vancouver plan. Start with one believable
            route, keep the working list short, and open Maps only when you are ready to leave.
          </p>
          <div className="hero-actions">
            {activeMission ? (
              <>
                <a className="button primary" href="#planner-active-route">
                  Continue active route
                </a>
                <AppLink
                  className="button secondary"
                  to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
                >
                  Start with a guide
                </AppLink>
              </>
            ) : (
              <>
                <AppLink
                  className="button primary"
                  to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
                >
                  Start with a guide
                </AppLink>
                <AppLink className="button secondary" to="/vancouver/missions">
                  See all routes
                </AppLink>
              </>
            )}
          </div>
          <p className="planner-hero-note">
            Local route memory is live on this device now. Accounts and cross-device sync are still not live yet.
          </p>
        </div>
        <article className="source-panel planner-hero-desk-card">
          {activeMission ? (
            <>
              <p className="section-label">Best route right now</p>
              <strong>{simplifyMissionDisplayText(activeMission.title)}</strong>
              <p>
                {activeMissionInsight
                  ? getMissionFitNote(activeMission, activeMissionInsight)
                  : "Start with one believable route first, then trim the saved list around that instead of collecting more random stops."}
              </p>
              <div className="planner-hero-desk-facts">
                <article>
                  <span>Route length</span>
                  <strong>{activeMission.timeBox}</strong>
                </article>
                <article>
                  <span>Finish</span>
                  <strong>{activeMissionEndTime ?? "Keep pace flexible"}</strong>
                </article>
                <article>
                  <span>Pace</span>
                  <strong>
                    {activeMissionPlan
                      ? getTravelModeLabel(activeMissionPlan.travelMode)
                      : routeLearning.preferredTravelMode
                        ? `${getTravelModeLabel(routeLearning.preferredTravelMode)} pace`
                        : "Still learning"}
                  </strong>
                </article>
              </div>
              <div className="planner-profile-meta">
                <StatusPill tone="blue">{getMissionSavedPercent(activeMission, data.savedItems)}% saved</StatusPill>
                <StatusPill tone={routeLearning.preferredTravelMode ? "green" : "muted"}>
                  {routeLearning.preferredTravelMode
                    ? `${getTravelModeLabel(routeLearning.preferredTravelMode)} pace`
                    : "Still learning"}
                </StatusPill>
                {activeMissionInsight?.lastFeedback ? (
                  <StatusPill tone="blue">{getMissionFeedbackLabel(activeMissionInsight.lastFeedback)}</StatusPill>
                ) : null}
              </div>
              <div className="planner-summary-kpis">
                {plannerKpis.map((item) => (
                  <article className="planner-summary-kpi" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="section-label">Route desk</p>
              <strong>Start with one guide, then save only the stops you would actually keep.</strong>
              <p>
                CityAtlas gets clearer once you save a short working list, choose a pace, and mark the
                stops you really used.
              </p>
            </>
          )}
        </article>
      </section>

      {activeMission ? (
        <section className="section-block" id="planner-active-route">
          <SectionHeader
            label="Active route"
            title={`Follow ${simplifyMissionDisplayText(activeMission.title)} one stop at a time`}
            copy="The next stop stays open first. The rest of the route stays visible underneath so you can keep the whole plan in view."
          />
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

      <section className="section-block">
        <details className="planner-detail-group">
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">Planner memory</p>
              <strong>CityAtlas is getting clearer about your pace</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <div className="split-section planner-profile-section planner-profile-section-tight">
              <article className="source-panel planner-profile-card">
                <div className="public-intro-title">
                  <SparkIcon />
                  <h2>Personalized route profile</h2>
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
                <small>That keeps this honest while the product learns from real route use first.</small>
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
                    : "Save one full route or mark a few real stops before CityAtlas starts steering the next suggestion."}
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
                      : "You have skipped more than you finished here lately, so shorten the route before adding more stops."
                    : "The best next move is still one believable full route, not a bigger saved list."}
                </p>
              </article>
            </div>
          </div>
        </details>
      </section>

      <section className="split-section" id="planner-saved-plan">
        <div>
          <SectionHeader
            title="Your saved plan"
            copy="Use this as the short working list you can keep, reorder, trim, and revisit later."
            action={<StatusPill tone="blue">{data.savedItems.length} saved</StatusPill>}
          />
          {data.savedItems.length === 0 ? (
            <EmptyState
              title="No saved items yet"
              copy="Save a few places, events, or guides from the discovery pool below."
            />
          ) : (
            <div className="saved-list">
              <p className="saved-list-note">
                Use the arrows to put the route in the right order before you copy the summary.
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
          )}
        </div>

        <div>
          <SectionHeader
            title="Share text"
            copy="Copy a message-ready route summary here, or share it straight from your phone."
          />
          <div className="share-draft">
            <div className="share-draft-summary" aria-label="Route summary">
              {shareSummaryItems.map((item) => (
                <div className="share-draft-stat" key={item.label}>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <p className="share-draft-lead">
              This is the short version you can text to someone else without rewriting it.
            </p>
            <p className="share-draft-preview">{sharePreviewExcerpt}</p>
            <div className="share-actions">
              <button className="button primary" type="button" onClick={() => void stageShareDraft()}>
                Copy route summary
              </button>
              <button className="button secondary" type="button" onClick={() => void stageShareDraft("share")}>
                Share route <ShareIcon />
              </button>
              <AppLink className="button secondary" to="/vancouver/guides">
                See all guides <ArrowRightIcon />
              </AppLink>
            </div>
            <details className="share-preview-disclosure">
              <summary className="mission-inline-summary">
                <div>
                  <p className="section-label">Full route message</p>
                  <strong>Review the exact share text</strong>
                </div>
                <span className="mission-inline-summary-tag">Preview</span>
              </summary>
              <pre className="route-share-preview route-share-preview-compact">{stagedShareText}</pre>
            </details>
            {shareState ? <small className="local-success">{shareState}</small> : null}
          </div>
        </div>
      </section>

      <section className="section-block" id="planner-explore-more">
        <details className="planner-detail-group">
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">More route options</p>
              <strong>Save another full plan</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <p className="planner-detail-copy">
              Start with one route that already fits, then tighten the saved list around that instead of collecting random stops.
            </p>
            <div className="card-grid three">
              {plannerMissionCandidates.map((mission) => (
                <MissionCard
                  mission={mission}
                  savedItems={data.savedItems}
                  onSaveMission={onSaveMission}
                  insight={routeLearning.insightsById[mission.id]}
                  key={mission.id}
                />
              ))}
            </div>
            <div className="hero-actions planner-detail-actions">
              <AppLink className="button secondary" to="/vancouver/missions">
                See all {data.cityMissions.length} routes
              </AppLink>
            </div>
          </div>
        </details>
      </section>

      <section className="section-block">
        <details className="planner-detail-group" open={data.savedItems.length === 0}>
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">Save candidates</p>
              <strong>Build the plan one short list at a time</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <p className="planner-detail-copy">
              Pick one trusted stop, one place, one event, and one guide first. Then add more only if the plan still needs it.
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
    </>
  );
}
