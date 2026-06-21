import type { CityAtlasData, CityMission, SavedItem } from "../../types";
import { MissionCard } from "../../components/Cards";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { siteConfig } from "../../config/site";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import { simplifyMissionDisplayText } from "../../lib/publicCopy";

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
          <h2>{simplifyMissionDisplayText(mission.title)}</h2>
          <p>{simplifyMissionDisplayText(mission.routeSummary)}</p>
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
              <strong>{simplifyMissionDisplayText(step.label)}</strong>
              <small>{step.time} - {step.neighborhood}</small>
              <p>{simplifyMissionDisplayText(step.note)}</p>
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
          <strong>{simplifyMissionDisplayText(mission.reward)}</strong>
          <p>{simplifyMissionDisplayText(mission.sharePrompt)}</p>
          <small>{simplifyMissionDisplayText(mission.sponsorAngle)}</small>
        </div>
      </div>

      <div className="hero-actions">
        <button className="button primary" type="button" onClick={() => onSaveMission(mission)}>
          Save full plan
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
          <h1>Save a Vancouver plan you can reuse</h1>
          <p>
            Use saved plans when the question is already clear and the next step is saving,
            sharing, or tightening one plan instead of reopening the whole city.
          </p>
          <div className="hero-actions">
            <AppLink
              className="button primary"
              to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
            >
              Start with a guide <ArrowRightIcon />
            </AppLink>
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
            image={siteConfig.media.city}
            alt="Illustrated shoreline scene inspired by English Bay Beach in Vancouver"
            eyebrow="Saved plans"
            title="Keep the plan that already works instead of starting from zero again"
            copy="Saved plans help you reuse a good Vancouver shape, tighten it, and come back to it without reopening the whole city."
            className="hero-media-compact"
          />
        </div>
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
          title="Three reusable Vancouver plans"
          copy="These plans show how CityAtlas turns guides and local places into saved Vancouver plans."
          action={<StatusPill tone="amber">Saved plans today</StatusPill>}
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
          title="How a saved plan helps"
          copy="Each saved plan shows what a local user would do and where a business could show up naturally later."
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
          <h2>Guides first, broader coverage later</h2>
          <p>
            Saved plans show how CityAtlas can turn planning into reusable itineraries. As verified
            business coverage expands, those plans can become more specific.
          </p>
        </div>
        <AppLink className="button primary" to="/for-businesses/pricing">
          Partner packages <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
