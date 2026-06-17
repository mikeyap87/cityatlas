import type { CityAtlasData, CityMission, SavedItem } from "../../types";
import { MissionCard } from "../../components/Cards";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";

interface MissionsPageProps {
  data: CityAtlasData;
  onSaveMission: (mission: CityMission) => void;
}

function stepIsSaved(step: CityMission["steps"][number], savedItems: SavedItem[]) {
  return savedItems.some((item) => item.itemType === step.itemType && item.itemId === step.itemId);
}

function progressForMission(mission: CityMission, savedItems: SavedItem[]) {
  if (mission.steps.length === 0) return 0;
  const saved = mission.steps.filter((step) => stepIsSaved(step, savedItems)).length;
  return Math.round((saved / mission.steps.length) * 100);
}

function MissionRoute({
  mission,
  savedItems,
  onSaveMission,
}: {
  mission: CityMission;
  savedItems: SavedItem[];
  onSaveMission: (mission: CityMission) => void;
}) {
  const progress = progressForMission(mission, savedItems);

  return (
    <article className="mission-route" id={`mission-${mission.id}`}>
      <div className="mission-route-header">
        <div>
          <p className="section-label">{mission.theme}</p>
          <h2>{mission.title}</h2>
          <p>{mission.routeSummary}</p>
        </div>
        <div className="mission-route-score">
          <strong>{progress}%</strong>
          <small>saved</small>
        </div>
      </div>

      <ol className="route-timeline">
        {mission.steps.map((step, index) => (
          <li className={stepIsSaved(step, savedItems) ? "saved" : ""} key={`${mission.id}-${step.itemId}-${index}`}>
            <span>{index + 1}</span>
            <div>
              <strong>{step.label}</strong>
              <small>{step.time} - {step.neighborhood}</small>
              <p>{step.note}</p>
            </div>
            <StatusPill tone={stepIsSaved(step, savedItems) ? "green" : "muted"}>
              {stepIsSaved(step, savedItems) ? "saved" : step.itemType}
            </StatusPill>
          </li>
        ))}
      </ol>

      <div className="mission-reward">
        <SparkIcon />
        <div>
          <strong>{mission.reward}</strong>
          <p>{mission.sharePrompt}</p>
          <small>{mission.sponsorAngle}</small>
        </div>
      </div>

      <div className="hero-actions">
        <button className="button primary" type="button" onClick={() => onSaveMission(mission)}>
          Save full mission
        </button>
        <AppLink className="button secondary" to="/planner">
          Open planner <ArrowRightIcon />
        </AppLink>
      </div>
    </article>
  );
}

export function MissionsPage({ data, onSaveMission }: MissionsPageProps) {
  return (
    <>
      <section className="city-hero mission-hero">
        <div>
          <p className="section-label">Saved plans</p>
          <h1>Save a Vancouver route you can reuse</h1>
          <p>
            Use saved plans when the question is already clear and the next step is saving,
            sharing, or tightening one route instead of reopening the whole city.
          </p>
          <div className="hero-actions">
            <AppLink
              className="button primary"
              to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
            >
              Choose a route first <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/planner">
              Open planner
            </AppLink>
          </div>
        </div>
        <div className="public-intro-card">
          <MapIcon />
          <h2>What you can do here</h2>
          <ul className="public-note-list">
            <li><CheckIcon /> Keep one compact plan instead of reopening five different pages.</li>
            <li><CheckIcon /> Turn a guide or starter page into something easier to share later.</li>
            <li><CheckIcon /> See how CityAtlas routes can become repeatable local plans.</li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Best first move"
          title="Choose a route first, then save the plan"
          copy="Saved plans work best after the pace, visitor situation, or route shape is already clearer. These pages help someone choose the right CityAtlas path first."
          action={<StatusPill tone="blue">Choose your route first</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink
            className="query-card query-card-link"
            to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
          >
            <strong>Where to start guide</strong>
            <p>Open this when the first problem is still which CityAtlas page should shape the day at all.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
          >
            <strong>Browse by situation</strong>
            <p>Use this when weather, visitor type, or neighborhood fit should decide the mission shape first.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today"
          >
            <strong>Easy plan chooser</strong>
            <p>Choose this when the mission needs to stay easier, calmer, or more compact before anything gets saved.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/planner">
            <strong>Planner</strong>
            <p>Move here when the route is already clear and the next step is saving or rearranging the plan.</p>
          </AppLink>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Saved plan library"
          title="Three reusable Vancouver routes"
          copy="These routes show how CityAtlas turns guides and starting-point pages into saved Vancouver plans while broader city coverage keeps growing carefully."
          action={<StatusPill tone="amber">Current route set</StatusPill>}
        />
        <div className="card-grid three">
          {data.cityMissions.map((mission) => (
            <MissionCard
              mission={mission}
              savedItems={data.savedItems}
              onSaveMission={onSaveMission}
              key={mission.id}
            />
          ))}
        </div>
      </section>

      <section className="mission-routes section-block">
        <SectionHeader
          title="How a route helps"
          copy="Each saved plan shows what a local user would do and where a business could fit naturally later."
        />
        <div className="mission-route-grid">
          {data.cityMissions.map((mission) => (
            <MissionRoute
              mission={mission}
              savedItems={data.savedItems}
              onSaveMission={onSaveMission}
              key={mission.id}
            />
          ))}
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel conversion-panel">
          <h2>Who should use saved plans first?</h2>
          <ul className="conversion-list">
            <li><CheckIcon /> Locals who want one reusable Vancouver route instead of reopening every guide.</li>
            <li><CheckIcon /> Visitors or hosts who already know the route type and need a cleaner saved plan.</li>
            <li><CheckIcon /> Businesses evaluating whether CityAtlas can create a future sponsor-friendly city loop.</li>
          </ul>
        </div>
        <div className="source-panel conversion-panel">
          <h2>What saved plans are not</h2>
          <ul className="conversion-list">
            <li><ShieldIcon /> Not a claim that every place, offer, or event shown here is already part of a verified public directory.</li>
            <li><ShieldIcon /> Not a promise that one route fits every mood, budget, or weather shift.</li>
            <li><ShieldIcon /> Not a replacement for the editorial standards, starting-point pages, or answer-first guide layer.</li>
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <ShieldIcon />
        <div>
          <h2>A route layer first, broader listings later</h2>
          <p>
            Saved plans show how CityAtlas can turn planning into reusable itineraries. As verified
            business coverage expands, routes can become more specific.
          </p>
        </div>
        <AppLink className="button primary" to="/for-businesses/pricing">
          Partner packages <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
