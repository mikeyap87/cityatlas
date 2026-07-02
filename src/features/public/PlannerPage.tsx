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
import { EmptyState, HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import {
  getMissionCompletedCount,
  getMissionFeedbackLabel,
  getMissionDirectionsUrl,
  getMissionPlanState,
  getRouteLearningSummary,
  getMissionSavedPercent,
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

export function PlannerPage({
  data,
  onToggleSave,
  onMoveSavedItem,
  onSaveMission,
  onTrack,
  onSetMissionTravelMode,
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
  const activeMissionPlan = activeMission ? getMissionPlanState(data, activeMission) : undefined;
  const activeMissionInsight = activeMission ? routeLearning.insightsById[activeMission.id] : undefined;
  const plannerShareText = useMemo(() => {
    if (data.savedItems.length === 0) {
      return "";
    }

    const lines = [
      activeMission ? `${simplifyMissionDisplayText(activeMission.title)} saved plan via CityAtlas` : "CityAtlas saved plan",
      "",
      "Stops:",
      ...data.savedItems.map((item, index) => `${index + 1}. ${item.label}`),
    ];

    if (activeMission && activeMissionPlan) {
      lines.push("", `Pace: ${getTravelModeLabel(activeMissionPlan.travelMode)}`);
      const directionsUrl = getMissionDirectionsUrl(data, activeMission, activeMissionPlan.travelMode);
      if (directionsUrl) {
        lines.push(`Open route in Google Maps: ${directionsUrl}`);
      }
      lines.push("", activeMission.sharePrompt);
    } else if (itineraryText) {
      lines.push("", itineraryText);
    }

    return lines.join("\n");
  }, [activeMission, activeMissionPlan, data, itineraryText]);
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

  async function stageShareDraft(mode: "copy" | "share" = "copy") {
    const nextText =
      plannerShareText
      || "Save two or three strong picks first, then CityAtlas turns them into one simple share-ready Vancouver plan.";

    onTrack(mode === "share" ? "planner_share_native_requested" : "planner_share_draft_prepared", {
      savedItems: data.savedItems.length,
      completedSteps,
    });

    if (mode === "share" && navigator.share) {
      try {
        await navigator.share({
          title: activeMission ? simplifyMissionDisplayText(activeMission.title) : "CityAtlas route",
          text: nextText,
        });
        setShareState("Route shared.");
        return;
      } catch {
        setShareState("Share canceled. Route text is still ready below.");
        return;
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(nextText);
        setShareState("Route text copied. Paste it into your message app when you are ready.");
        return;
      }
    } catch {
      // Fall through to the visible preview.
    }

    setShareState("Route text is ready below. Copy it into your message app when you are ready.");
  }

  return (
    <>
      <section className="city-hero">
        <div>
          <p className="section-label">Planner</p>
          <h1>Build a simple Vancouver plan you can keep</h1>
          <p>
            Save places, route anchors, and guides into one simple Vancouver plan. It stays on this
            device for now, can open the route in Maps, and can prep share text when you are ready.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/missions">
              Open saved plans
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
            >
              Start with a guide
            </AppLink>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Start with one believable route, not a giant list.</strong>
            <p>
              Save a few strong stops first. Then tighten that short list into one route you can
              actually use, track, and share.
            </p>
          </article>
        </div>
        <div className="starter-hero-side">
          <HeroMediaCard
            image={siteConfig.media.planner}
            alt="Illustrated neighborhood scene inspired by Commercial Drive in Vancouver"
            eyebrow="Planner"
            title="Keep the route that already fits together"
            copy="Save the best place, route anchor, and guide together in one simple Vancouver plan before you decide whether to share it."
            className="hero-media-compact"
          />
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel planner-hero-card">
          <div className="public-intro-title">
            <SparkIcon />
            <h2>Use it in three quick steps</h2>
          </div>
          <ul className="public-note-list">
            <li><CheckIcon /> Save a few strong stops, guides, or events.</li>
            <li><CheckIcon /> Pick the one route that already makes sense.</li>
            <li><CheckIcon /> Track it, open it in Maps, and share it when it feels right.</li>
          </ul>
        </div>
        <div className="source-panel conversion-panel">
          <h2>Best first move before you save anything</h2>
          <p>
            Open one guide first when the pace, weather, or neighborhood still needs to become
            clearer before the plan should be saved.
          </p>
          <AppLink
            className="button secondary"
            to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
          >
            Start with a guide <ArrowRightIcon />
          </AppLink>
        </div>
      </section>

      <section className="planner-stats">
        <article>
          <strong>{data.savedItems.length}</strong>
          <span>Saved items</span>
        </article>
        <article>
          <strong>{completedSteps}/{totalSteps}</strong>
          <span>Route steps marked</span>
        </article>
        <article>
          <strong>{activeMission ? simplifyMissionDisplayText(activeMission.title) : "Start a route"}</strong>
          <span>Best active route</span>
        </article>
      </section>

      <section className="split-section planner-profile-section">
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
      </section>

      <section className="section-block">
        <SectionHeader
          label="Route memory"
          title="CityAtlas is getting clearer about your pace"
          copy="These route signals stay on this device for now and help the next saved plan feel more realistic."
        />
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
                ? `This is the travel mode you keep returning to most often on this device.`
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
      </section>

      {activeMission ? (
        <section className="section-block">
          <SectionHeader
            label="Active route"
            title={`Keep ${simplifyMissionDisplayText(activeMission.title)} moving`}
            copy="Mark stops visited or skipped, switch travel pace, and open the route in Maps before you head out."
            action={<StatusPill tone="green">{getMissionSavedPercent(activeMission, data.savedItems)}% saved</StatusPill>}
          />
          <MissionExecutionPanel
            data={data}
            mission={activeMission}
            onSaveMission={onSaveMission}
            onTrack={onTrack}
            onSetMissionTravelMode={onSetMissionTravelMode}
            onSetMissionStepStatus={onSetMissionStepStatus}
            onAddMissionFeedback={onAddMissionFeedback}
            onResetMissionProgress={onResetMissionProgress}
            variant="planner"
          />
        </section>
      ) : null}

      <section className="split-section">
        <div>
          <SectionHeader
            title="Your saved plan"
            copy="Use this as the short working list you can keep, reorder, trim, and revisit later."
            action={<StatusPill tone="blue">{data.savedItems.length} saved</StatusPill>}
          />
          {data.savedItems.length === 0 ? (
            <EmptyState
              title="No saved items yet"
              copy="Save a few places, route anchors, events, or guides from the discovery pool below."
            />
          ) : (
            <div className="saved-list">
              <p className="saved-list-note">This order feeds the share draft below.</p>
              {data.savedItems.map((item, index) => (
                <div className="saved-row" key={item.id}>
                  <span className="saved-row-order">{index + 1}</span>
                  <MapIcon />
                  <div className="saved-row-copy">
                    <strong>{item.label}</strong>
                    <small>{resolveSavedItemTypeLabel(item.itemType)}</small>
                  </div>
                  <div className="saved-row-actions">
                    <button
                      className="saved-row-icon-button"
                      type="button"
                      onClick={() => onMoveSavedItem(item.id, "up")}
                      aria-label={`Move ${item.label} up`}
                      disabled={index === 0}
                    >
                      <ChevronUpIcon />
                    </button>
                    <button
                      className="saved-row-icon-button"
                      type="button"
                      onClick={() => onMoveSavedItem(item.id, "down")}
                      aria-label={`Move ${item.label} down`}
                      disabled={index === data.savedItems.length - 1}
                    >
                      <ChevronDownIcon />
                    </button>
                    <button
                      className="saved-row-remove-button"
                      type="button"
                      onClick={() => onToggleSave(item.itemType, item.itemId, item.label)}
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
            copy="Prepare a message-ready route summary here before you send it anywhere else."
          />
          <div className="share-draft">
            <p>
              {plannerShareText ||
                "Save two or three strong picks first, then CityAtlas turns them into one simple share-ready Vancouver plan."}
            </p>
            <div className="share-actions">
              <button className="button primary" type="button" onClick={() => void stageShareDraft()}>
                Copy share text
              </button>
              <button className="button secondary" type="button" onClick={() => void stageShareDraft("share")}>
                Share route <ShareIcon />
              </button>
              <AppLink className="button secondary" to="/vancouver/guides">
                See all guides <ArrowRightIcon />
              </AppLink>
            </div>
            {shareState ? <small className="local-success">{shareState}</small> : null}
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Recommended plans"
          title="Save a full plan"
          copy="The fastest path is saving a complete route, not one isolated stop."
        />
        <div className="card-grid three">
          {data.cityMissions.map((mission) => (
            <MissionCard
              mission={mission}
              savedItems={data.savedItems}
              onSaveMission={onSaveMission}
              insight={routeLearning.insightsById[mission.id]}
              key={mission.id}
            />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Save candidates"
          title="Build the plan one short list at a time"
          copy="Pick one route anchor, one place, one event, and one guide first. Then add more only if the plan still needs it."
        />
        <div className="planner-pool-groups">
          <article className="source-panel planner-pool-group">
            <div className="planner-pool-group-header">
              <div>
                <p className="section-label">Source-backed places</p>
                <h2>Add one real-world anchor</h2>
              </div>
              <StatusPill tone="blue">{plannerSourceBackedCandidates.length} picks</StatusPill>
            </div>
            <p>Use one official-source anchor when the route should feel easier to trust before it gets shared.</p>
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
        <div className="hero-actions">
          <AppLink className="button secondary" to="/vancouver/guides">
            Open all Vancouver guides
          </AppLink>
        </div>
      </section>
    </>
  );
}
