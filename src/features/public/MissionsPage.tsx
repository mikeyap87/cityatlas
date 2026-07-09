import { useEffect, useState } from "react";
import type {
  CityAtlasData,
  CityMission,
  MissionFeedbackType,
  MissionStepStatus,
  TravelMode,
} from "../../types";
import { MissionCard } from "../../components/Cards";
import { MissionExecutionPanel } from "../../components/MissionExecutionPanel";
import { AppLink } from "../../components/Link";
import { CheckIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { siteConfig } from "../../config/site";
import { StatusPill } from "../../components/UI";
import { getGuideCitySlug, getGuidePath } from "../../lib/cityPaths";
import {
  getMissionAnchorId,
  getMissionCityName,
  getMissionCitySlug,
  getMissionDonePercent,
  getMissionFitLabel,
  getMissionFitNote,
  getMissionFitTone,
  getMissionPlanState,
  getRouteLearningSummary,
  getMissionSavedCount,
  getMissionSavedPercent,
  type MissionBehaviorInsight,
} from "../../lib/missions";
import { simplifyMissionDisplayText } from "../../lib/publicCopy";

interface MissionsPageProps {
  data: CityAtlasData;
  citySlug?: string;
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

function formatCityName(citySlug: string) {
  return citySlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPlannerRoutePath(mission: CityMission) {
  return `/planner?route=${encodeURIComponent(mission.id)}#planner-active-route`;
}

function getMissionFromHash(cityMissions: CityMission[], hash: string) {
  const hashId = hash.replace(/^#/, "");
  if (!hashId) return undefined;

  return cityMissions.find((mission) => {
    const anchorId = getMissionAnchorId(mission);
    return hashId === anchorId || hashId === `${anchorId}-summary`;
  });
}

function MissionRoute({
  data,
  mission,
  onSaveMission,
  onTrack,
  onSetMissionTravelMode,
  onSetMissionStartTime,
  onSetMissionStepStatus,
  onAddMissionFeedback,
  onResetMissionProgress,
  insight,
}: {
  data: CityAtlasData;
  mission: CityMission;
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
  insight?: MissionBehaviorInsight;
}) {
  const plan = getMissionPlanState(data, mission);
  const savedCount = getMissionSavedCount(mission, data.savedItems);
  const savedPercent = getMissionSavedPercent(mission, data.savedItems);
  const donePercent = getMissionDonePercent(mission, plan);
  const missionAnchorId = getMissionAnchorId(mission);
  const routeStopCount = mission.steps.filter((step) => step.itemType !== "guide").length || mission.steps.length;

  return (
    <article className="mission-route" id={missionAnchorId}>
      <div className="mission-route-header">
        <div>
          <p className="section-label">{mission.theme}</p>
          <h2>{simplifyMissionDisplayText(mission.title)}</h2>
          <p>{simplifyMissionDisplayText(mission.routeSummary)}</p>
          {insight ? (
            <div className="mission-route-fit">
              <StatusPill tone={getMissionFitTone(insight)}>{getMissionFitLabel(insight)}</StatusPill>
              <small>{getMissionFitNote(mission, insight)}</small>
            </div>
          ) : null}
        </div>
        <div className="mission-route-score">
          <strong>{donePercent}%</strong>
          <small>{savedCount} saved here</small>
        </div>
      </div>
      <div className="mission-route-meter">
        <div className="mission-route-meter-bar">
          <span style={{ width: `${savedPercent}%` }} />
        </div>
        <small>
          {savedCount === 0
            ? "Nothing from this route is saved here yet."
            : savedCount >= routeStopCount
              ? `All ${routeStopCount} stops are already saved on this device.`
              : `${savedCount} of ${routeStopCount} stops are already saved on this device.`}
        </small>
      </div>

      <MissionExecutionPanel
        data={data}
        mission={mission}
        onSaveMission={onSaveMission}
        onTrack={onTrack}
        onSetMissionTravelMode={onSetMissionTravelMode}
        onSetMissionStartTime={onSetMissionStartTime}
        onSetMissionStepStatus={onSetMissionStepStatus}
        onAddMissionFeedback={onAddMissionFeedback}
        onResetMissionProgress={onResetMissionProgress}
      />

      <div className="mission-reward">
        <SparkIcon />
        <div>
          <p className="section-label">Why keep this route</p>
          <strong>{simplifyMissionDisplayText(mission.reward)}</strong>
          <p>{simplifyMissionDisplayText(mission.sharePrompt)}</p>
        </div>
      </div>
    </article>
  );
}

export function MissionsPage({
  data,
  citySlug,
  onSaveMission,
  onTrack,
  onSetMissionTravelMode,
  onSetMissionStartTime,
  onSetMissionStepStatus,
  onAddMissionFeedback,
  onResetMissionProgress,
}: MissionsPageProps) {
  const routeLearning = getRouteLearningSummary(data);
  const activeCitySlug = citySlug ?? siteConfig.citySlug;
  const [routeHash, setRouteHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash,
  );
  const [helpChoicesOpen, setHelpChoicesOpen] = useState(false);
  const cityMissions = data.cityMissions.filter(
    (mission) => getMissionCitySlug(mission) === activeCitySlug,
  );
  const cityName = cityMissions[0]?.cityName
    ?? data.guides.find((guide) => getGuideCitySlug(guide) === activeCitySlug)?.cityName
    ?? (activeCitySlug === siteConfig.citySlug ? siteConfig.city : formatCityName(activeCitySlug));
  const hashRequestedMission = getMissionFromHash(cityMissions, routeHash);
  const featuredMission = hashRequestedMission ?? (routeLearning.recommendedMission
    && getMissionCitySlug(routeLearning.recommendedMission) === activeCitySlug
    ? routeLearning.recommendedMission
    : cityMissions[0]);
  const featuredMissionInsight = featuredMission ? routeLearning.insightsById[featuredMission.id] : undefined;
  const featuredMissionPlan = featuredMission ? getMissionPlanState(data, featuredMission) : undefined;
  const featuredMissionSavedPercent = featuredMission
    ? getMissionSavedPercent(featuredMission, data.savedItems)
    : 0;
  const featuredMissionDonePercent = featuredMission && featuredMissionPlan
    ? getMissionDonePercent(featuredMission, featuredMissionPlan)
    : 0;
  const featuredMissionCityName = featuredMission ? getMissionCityName(featuredMission) : cityName;
  const featuredMissionTitle = featuredMission
    ? simplifyMissionDisplayText(featuredMission.title)
    : `${cityName} ready-made routes`;
  const featuredMissionSupportCopy = featuredMission
    ? (
      featuredMissionInsight
        ? getMissionFitNote(featuredMission, featuredMissionInsight)
        : "Open the ready-made route first, then save it in the Planner if it fits your day."
    )
    : `Open a ready-made ${cityName} route first, then save it in the Planner if it fits your day.`;
  const alternateMissions = cityMissions.filter((mission) => mission.id !== featuredMission?.id);
  const cityGuideCards = data.guides
    .filter((guide) => getGuideCitySlug(guide) === activeCitySlug)
    .slice(0, 3)
    .map((guide) => ({
      path: getGuidePath(guide),
      title: guide.title,
      description: guide.excerpt,
    }));
  const guideFirstCards = activeCitySlug === siteConfig.citySlug
    ? [
        {
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          title: "Where to start guide",
          description: "Open this when the first problem is still which guide should shape the day at all.",
        },
        {
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          title: "Browse by situation",
          description: "Use this when weather, visitor type, or neighborhood choice should decide the plan first.",
        },
        {
          path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
          title: "Easy plan chooser",
          description: "Choose this when the day needs to stay easier, calmer, or more compact before anything gets saved.",
        },
      ]
    : cityGuideCards;
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncOpenPanelsFromHash = () => {
      const nextHash = window.location.hash;
      setRouteHash(nextHash);
      setHelpChoicesOpen(nextHash === "#saved-plans-help-choices");
    };

    syncOpenPanelsFromHash();
    window.addEventListener("hashchange", syncOpenPanelsFromHash);
    return () => window.removeEventListener("hashchange", syncOpenPanelsFromHash);
  }, []);

  return (
    <>
      <section className="city-hero planner-hero planner-hero-single planner-hero-fridge">
        <article className="planner-fridge-note" id="best-fit-plan-details">
          <p className="planner-fridge-route">
            {featuredMission
              ? `${featuredMissionTitle} • ${featuredMission.timeBox} • ${featuredMission.steps.length} stops in ${featuredMissionCityName}`
              : `Ready-made routes for ${cityName}`}
          </p>
          <h1>{featuredMission ? "Pick this ready-made route first" : `Pick one ${cityName} route first`}</h1>
          <p className="planner-fridge-note-copy">{featuredMissionSupportCopy}</p>
          {featuredMission ? (
            <div className="planner-fridge-note-facts">
              <span>{featuredMissionSavedPercent}% already saved</span>
              <span>{featuredMissionDonePercent}% already done</span>
              {featuredMissionInsight ? (
                <span>{getMissionFitLabel(featuredMissionInsight)}</span>
              ) : (
                <span>{featuredMissionCityName}</span>
              )}
            </div>
          ) : null}
          <div className="hero-actions planner-fridge-actions">
            {featuredMission ? (
              <>
                <AppLink className="button primary" to={getPlannerRoutePath(featuredMission)}>
                  Open map in planner
                </AppLink>
                <a className="button secondary" href="#saved-plan-route">Preview route here</a>
              </>
            ) : (
              <AppLink className="button primary" to="/planner">
                Open planner
              </AppLink>
            )}
          </div>
        </article>
      </section>

      <section className="section-block" id="saved-plan-route">
        {featuredMission ? (
          <>
            <div className="planner-fridge-followup">
              <p className="section-label">Ready-made route</p>
              <strong>{featuredMissionTitle}</strong>
              <p>
                This page is the route library. Planner is where your saved plans live, so use the
                button above when you want the map and saved progress together.
              </p>
            </div>
            <MissionRoute
              data={data}
              mission={featuredMission}
              onSaveMission={onSaveMission}
              onTrack={onTrack}
              onSetMissionTravelMode={onSetMissionTravelMode}
              onSetMissionStartTime={onSetMissionStartTime}
              onSetMissionStepStatus={onSetMissionStepStatus}
              onAddMissionFeedback={onAddMissionFeedback}
              onResetMissionProgress={onResetMissionProgress}
              insight={routeLearning.insightsById[featuredMission.id]}
            />
          </>
        ) : (
          <article className="source-panel conversion-panel">
            <h2>Open one saved plan first</h2>
            <p>
              Open one ready-made route first, then save it in the Planner if it fits your day.
            </p>
            <AppLink className="button primary" to="/planner">
              Open planner
            </AppLink>
          </article>
        )}
      </section>

      <section className="section-block">
        <details
          className="planner-detail-group"
          id="saved-plans-help-choices"
          onToggle={(event) => setHelpChoicesOpen(event.currentTarget.open)}
          open={helpChoicesOpen}
        >
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">Optional</p>
              <strong>Need a different route or page?</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <p className="planner-detail-copy">
              Open this only if the ready-made route above is not the right next move.
            </p>
            <div className="guide-query-grid">
              {guideFirstCards.map((guideCard) => (
                <AppLink className="query-card query-card-link" key={guideCard.path} to={guideCard.path}>
                  <strong>{simplifyMissionDisplayText(guideCard.title)}</strong>
                  <p>{simplifyMissionDisplayText(guideCard.description)}</p>
                </AppLink>
              ))}
              <AppLink className="query-card query-card-link" to="/planner">
                <strong>Planner</strong>
                <p>Move here when the route is already clear and the next step is saving or rearranging it.</p>
              </AppLink>
            </div>
            {alternateMissions.length > 0 ? (
              <>
                <article className="source-panel conversion-panel">
                  <h2>Try a different ready-made route</h2>
                  <p>
                    Switch only when today needs a clearly different shape, neighborhood, or pace.
                  </p>
                </article>
                <div className="card-grid three">
                  {alternateMissions.map((mission) => (
                    <MissionCard
                      mission={mission}
                      savedItems={data.savedItems}
                      onSaveMission={onSaveMission}
                      insight={routeLearning.insightsById[mission.id]}
                      actionHref={`#${getMissionAnchorId(mission)}-summary`}
                      actionLabel="Open full plan"
                      actionMode="anchor"
                      key={mission.id}
                    />
                  ))}
                </div>
                <div className="mission-route-grid">
                  {alternateMissions.map((mission) => (
                    <details
                      className="guide-section guide-section-toggle mission-route-disclosure"
                      id={`${getMissionAnchorId(mission)}-summary`}
                      key={mission.id}
                    >
                      <summary className="guide-section-summary">
                        <div className="guide-section-summary-copy">
                          <span className="query-card-kicker">{mission.theme}</span>
                          <h2>{simplifyMissionDisplayText(mission.title)}</h2>
                          <p className="guide-section-answer">{simplifyMissionDisplayText(mission.routeSummary)}</p>
                        </div>
                        <span className="guide-section-toggle-chip" aria-hidden="true">
                          Open
                        </span>
                      </summary>
                      <div className="guide-section-body mission-route-disclosure-body">
                        <MissionRoute
                          data={data}
                          mission={mission}
                          onSaveMission={onSaveMission}
                          onTrack={onTrack}
                          onSetMissionTravelMode={onSetMissionTravelMode}
                          onSetMissionStartTime={onSetMissionStartTime}
                          onSetMissionStepStatus={onSetMissionStepStatus}
                          onAddMissionFeedback={onAddMissionFeedback}
                          onResetMissionProgress={onResetMissionProgress}
                          insight={routeLearning.insightsById[mission.id]}
                        />
                      </div>
                    </details>
                  ))}
                </div>
              </>
            ) : (
              <article className="source-panel conversion-panel">
                <h2>When this page helps</h2>
                <ul className="conversion-list">
                  <li><CheckIcon /> Start with one believable {cityName} route instead of reopening every guide.</li>
                  <li><CheckIcon /> Keep a host or visitor plan short enough to actually follow.</li>
                  <li><ShieldIcon /> Skip the route library when the real question is still what kind of day this should be.</li>
                </ul>
              </article>
            )}
          </div>
        </details>
      </section>
    </>
  );
}
