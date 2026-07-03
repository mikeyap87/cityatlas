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
import { ArrowRightIcon, CheckIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { siteConfig } from "../../config/site";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import {
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

  return (
    <article className="mission-route" id={`mission-${mission.id}`}>
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
          <small>{savedCount} saved</small>
        </div>
      </div>
      <div className="mission-route-meter">
        <div className="mission-route-meter-bar">
          <span style={{ width: `${savedPercent}%` }} />
        </div>
        <small>{savedPercent}% of the route is already saved on this device.</small>
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
          <strong>{simplifyMissionDisplayText(mission.reward)}</strong>
          <p>{simplifyMissionDisplayText(mission.sharePrompt)}</p>
          <small>{simplifyMissionDisplayText(mission.sponsorAngle)}</small>
        </div>
      </div>
    </article>
  );
}

export function MissionsPage({
  data,
  onSaveMission,
  onTrack,
  onSetMissionTravelMode,
  onSetMissionStartTime,
  onSetMissionStepStatus,
  onAddMissionFeedback,
  onResetMissionProgress,
}: MissionsPageProps) {
  const routeLearning = getRouteLearningSummary(data);
  const featuredMission = routeLearning.recommendedMission ?? data.cityMissions[0];
  const featuredMissionInsight = featuredMission ? routeLearning.insightsById[featuredMission.id] : undefined;
  const featuredMissionPlan = featuredMission ? getMissionPlanState(data, featuredMission) : undefined;
  const featuredMissionSavedPercent = featuredMission
    ? getMissionSavedPercent(featuredMission, data.savedItems)
    : 0;
  const featuredMissionDonePercent = featuredMission && featuredMissionPlan
    ? getMissionDonePercent(featuredMission, featuredMissionPlan)
    : 0;

  return (
    <>
      <section className="city-hero mission-hero">
        <div>
          <p className="section-label">Saved plans</p>
          <h1>Save the Vancouver plan that already works</h1>
          <p>
            Use saved plans once the kind of day is already clear and the next step is keeping,
            sharing, or tightening one route instead of reopening the whole city.
          </p>
          <div className="hero-actions">
            {featuredMission ? (
              <a className="button primary" href={`#mission-${featuredMission.id}`}>
                Open best-fit route
              </a>
            ) : null}
            <AppLink className="button secondary" to="/planner">
              Open planner
            </AppLink>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Saved plans work best after one guide or place already fits.</strong>
            <p>
              Start with the clearest route, then save it so you can reuse it, tighten it, and
              share it later without reopening the whole city.
            </p>
          </article>
        </div>
        <div className="starter-hero-side">
          <HeroMediaCard
            image={siteConfig.media.missions}
            alt="Illustrated park scene inspired by Stanley Park in Vancouver"
            eyebrow="Saved plans"
            title="Keep one Vancouver route worth coming back to"
            copy="Saved plans help you keep a good route, tighten it later, and share it without reopening every page."
            className="hero-media-compact"
          />
        </div>
      </section>

      <section className="split-section planner-profile-section">
        <article className="source-panel conversion-panel">
          <h2>Best route right now</h2>
          {featuredMission ? (
            <>
              <div className="hero-active-route-row">
                <div className="hero-active-route-copy">
                  <span className="hero-route-preview-kicker">
                    {featuredMissionInsight ? getMissionFitLabel(featuredMissionInsight) : "Start here"}
                  </span>
                  <strong>{simplifyMissionDisplayText(featuredMission.title)}</strong>
                  <p>
                    {featuredMissionInsight
                      ? getMissionFitNote(featuredMission, featuredMissionInsight)
                      : "Open the route first, then tighten it before you save more stops around it."}
                  </p>
                  <p className="hero-active-route-summary">
                    {featuredMission.timeBox} with {featuredMission.steps.length} stops
                  </p>
                </div>
                <a className="button secondary" href={`#mission-${featuredMission.id}`}>
                  Open route
                </a>
              </div>
              <div className="planner-profile-meta">
                <StatusPill tone="blue">{featuredMissionSavedPercent}% saved</StatusPill>
                <StatusPill tone="green">{featuredMissionDonePercent}% marked</StatusPill>
                {featuredMissionInsight ? (
                  <StatusPill tone={getMissionFitTone(featuredMissionInsight)}>
                    {getMissionFitLabel(featuredMissionInsight)}
                  </StatusPill>
                ) : null}
              </div>
            </>
          ) : (
            <p>Open the planner first, then saved plans will surface the clearest route here.</p>
          )}
        </article>
        <article className="source-panel conversion-panel">
          <h2>Still need a clearer starting point?</h2>
          <p>
            Open a guide first when the real question is still weather, visitor type, or what
            kind of Vancouver plan should shape the day at all.
          </p>
          <AppLink
            className="button secondary"
            to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
          >
            Start with a guide <ArrowRightIcon />
          </AppLink>
        </article>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Best first move"
          title="Choose a guide first, then save the plan"
          copy="Saved plans work best after the pace, visitor situation, or plan shape is already clearer. These pages help someone choose the right guide or place first."
          action={<StatusPill tone="blue">Choose your guide first</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink
            className="query-card query-card-link"
            to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
          >
            <strong>Where to start guide</strong>
            <p>Open this when the first problem is still which guide should shape the day at all.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
          >
            <strong>Browse by situation</strong>
            <p>Use this when weather, visitor type, or neighborhood choice should decide the plan first.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today"
          >
            <strong>Easy plan chooser</strong>
            <p>Choose this when the day needs to stay easier, calmer, or more compact before anything gets saved.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/planner">
            <strong>Planner</strong>
            <p>Move here when the plan is already clear and the next step is saving or rearranging it.</p>
          </AppLink>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Saved plan library"
          title={`${data.cityMissions.length} reusable Vancouver plans`}
          copy="These plans show how CityAtlas turns guides and local places into saved Vancouver plans."
          action={<StatusPill tone="amber">Saved plans today</StatusPill>}
        />
        <div className="card-grid three">
          {data.cityMissions.map((mission) => (
            <MissionCard
              mission={mission}
              savedItems={data.savedItems}
              onSaveMission={onSaveMission}
              insight={routeLearning.insightsById[mission.id]}
              actionHref={`#mission-${mission.id}`}
              actionLabel="Open route"
              actionMode="anchor"
              key={mission.id}
            />
          ))}
        </div>
      </section>

      <section className="mission-routes section-block">
        <SectionHeader
          title="How a saved plan helps"
          copy="Each saved plan shows what a local user would do and where a business could show up naturally later."
        />
        <div className="mission-route-grid">
          {data.cityMissions.map((mission) => (
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
              key={mission.id}
            />
          ))}
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel conversion-panel">
          <h2>Who should use saved plans first?</h2>
          <ul className="conversion-list">
            <li><CheckIcon /> Locals who want one reusable Vancouver plan instead of reopening every guide.</li>
            <li><CheckIcon /> Visitors or hosts who already know the kind of plan they want and need a cleaner saved version.</li>
            <li><CheckIcon /> Businesses evaluating whether CityAtlas can create a future sponsor-friendly city plan.</li>
          </ul>
        </div>
        <div className="source-panel conversion-panel">
          <h2>What saved plans are not</h2>
          <ul className="conversion-list">
            <li><ShieldIcon /> Not a claim that every place, offer, or event shown here is already part of a verified public directory.</li>
            <li><ShieldIcon /> Not a promise that one plan fits every mood, budget, or weather shift.</li>
            <li><ShieldIcon /> Not a replacement for the editorial standards, starting pages, or Vancouver guides.</li>
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <ShieldIcon />
        <div>
          <h2>For businesses, clearer routes can become clearer pages later</h2>
          <p>
            Saved plans show the kind of route people actually want. Business packages are for
            businesses that want clearer pages, offers, or guide placement as coverage grows.
          </p>
        </div>
        <AppLink className="button primary" to="/for-businesses/pricing">
          See business packages <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
