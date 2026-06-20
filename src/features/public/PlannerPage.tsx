import { useMemo, useState } from "react";
import type { CityAtlasData, CityMission, SavedItem } from "../../types";
import { siteConfig } from "../../config/site";
import { MissionCard } from "../../components/Cards";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CalendarIcon, CheckIcon, MapIcon, SparkIcon, StoreIcon } from "../../components/Icons";
import { EmptyState, HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import { simplifyGuideDisplayText, simplifyMissionDisplayText } from "../../lib/publicCopy";

interface PlannerPageProps {
  data: CityAtlasData;
  onToggleSave: (itemType: SavedItem["itemType"], itemId: string, label: string) => void;
  onSaveMission: (mission: CityMission) => void;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
}

function isSaved(savedItems: SavedItem[], itemType: SavedItem["itemType"], itemId: string) {
  return savedItems.some((item) => item.itemType === itemType && item.itemId === itemId);
}

function missionProgress(mission: CityMission, savedItems: SavedItem[]) {
  if (mission.steps.length === 0) return 0;
  const saved = mission.steps.filter((step) =>
    savedItems.some((item) => item.itemType === step.itemType && item.itemId === step.itemId),
  ).length;
  return Math.round((saved / mission.steps.length) * 100);
}

export function PlannerPage({ data, onToggleSave, onSaveMission, onTrack }: PlannerPageProps) {
  const [shareState, setShareState] = useState("");
  const cityGuides = data.guides.filter(
    (guide) => (guide.citySlug ?? siteConfig.citySlug) === siteConfig.citySlug,
  );
  const plannerGuideCandidates = cityGuides.slice(0, 4);
  const plannerBusinessCandidates = data.businesses.filter((business) => business.featured).slice(0, 4);
  const plannerEventCandidates = data.events.slice(0, 3);
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

  const itineraryText = [
    ...savedBusinesses.map((business) => `Visit ${business?.name} in ${business?.neighborhood}`),
    ...savedEvents.map((event) => `Check ${event?.title} on ${event?.date}`),
    ...savedGuides.map((guide) => `Read ${guide ? simplifyGuideDisplayText(guide.title) : ""}`),
    ...savedOffers.map((offer) => `Save ${offer?.title}`),
  ].join(" -> ");
  const missionScores = useMemo(
    () =>
      data.cityMissions.map((mission) => ({
        mission,
        progress: missionProgress(mission, data.savedItems),
      })),
    [data.cityMissions, data.savedItems],
  );
  const bestMission = [...missionScores].sort((a, b) => b.progress - a.progress)[0]?.mission;
  const completedSteps = missionScores.reduce(
    (total, item) => total + Math.round((item.progress / 100) * item.mission.steps.length),
    0,
  );
  const totalSteps = data.cityMissions.reduce((total, mission) => total + mission.steps.length, 0);

  function stageShareDraft() {
    onTrack("planner_share_draft_prepared", {
      savedItems: data.savedItems.length,
      completedSteps,
    });
    setShareState("Share draft prepared here. Copy it into your message app when you are ready.");
  }

  return (
    <>
      <section className="city-hero">
        <div>
          <p className="section-label">Planner</p>
          <h1>Save a Vancouver plan</h1>
          <p>
            Save places, events, and guides into one simple Vancouver plan. For now, it stays in
            this device and can be shared manually when you are ready.
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
            <strong>Start with a short list, not a giant plan.</strong>
            <p>
              Save a few strong places, events, or guides first. Then tighten that short list into
              one plan you can keep and share manually.
            </p>
          </article>
        </div>
        <div className="starter-hero-side">
          <HeroMediaCard
            image={siteConfig.media.waterfront}
            alt="Kitsilano Beach shoreline in Vancouver"
            eyebrow="Planner"
            title="Save the short list that actually fits the day"
            copy="Keep the best place, event, and guide together in one simple Vancouver plan before you decide whether to share it."
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
            <li><CheckIcon /> Save a few places, events, or guides.</li>
            <li><CheckIcon /> Turn that short list into one clean plan.</li>
            <li><CheckIcon /> Prepare share text when the plan feels right.</li>
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
          <span>Mission steps</span>
        </article>
        <article>
          <strong>{bestMission ? simplifyMissionDisplayText(bestMission.title) : "Start a plan"}</strong>
          <span>Best active mission</span>
        </article>
      </section>

      <section className="split-section">
        <div>
          <SectionHeader
            title="Your saved plan"
            copy="Use this as a simple working list you can keep, reorder, and revisit later."
            action={<StatusPill tone="blue">{data.savedItems.length} saved</StatusPill>}
          />
          {data.savedItems.length === 0 ? (
            <EmptyState
              title="No saved items yet"
              copy="Save a few places, events, or guides from the discovery pool below."
            />
          ) : (
            <div className="saved-list">
              {data.savedItems.map((item) => (
                <div className="saved-row" key={item.id}>
                  <MapIcon />
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.itemType}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <SectionHeader
            title="Share draft"
            copy="Prepare a message-ready plan summary here before you send it anywhere else."
          />
          <div className="share-draft">
            <p>
              {itineraryText ||
                "Save two or three strong picks first, then CityAtlas turns them into one simple share-ready Vancouver plan."}
            </p>
            <div className="share-actions">
              <button className="button primary" type="button" onClick={stageShareDraft}>
                Prepare share text
              </button>
              <AppLink className="button secondary" to="/vancouver/guides">
                Browse guides <ArrowRightIcon />
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
          copy="The fastest path is saving a complete plan, not one isolated stop."
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

      <section className="section-block">
        <SectionHeader
          label="Save candidates"
          title="Build the plan one short list at a time"
          copy="Pick one place, one event, and one guide first. Then add more only if the plan still needs it."
        />
        <div className="planner-pool-groups">
          <article className="source-panel planner-pool-group">
            <div className="planner-pool-group-header">
              <div>
                <p className="section-label">Places</p>
                <h2>Start with one place</h2>
              </div>
              <StatusPill tone="blue">{plannerBusinessCandidates.length} picks</StatusPill>
            </div>
            <p>Choose one place that feels like the anchor before you add anything else.</p>
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
