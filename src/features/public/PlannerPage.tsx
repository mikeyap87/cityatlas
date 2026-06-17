import { useMemo, useState } from "react";
import type { CityAtlasData, CityMission, SavedItem } from "../../types";
import { siteConfig } from "../../config/site";
import { MissionCard } from "../../components/Cards";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CalendarIcon, CheckIcon, MapIcon, SparkIcon, StoreIcon } from "../../components/Icons";
import { EmptyState, SectionHeader, StatusPill } from "../../components/UI";

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

  const itineraryText = [
    ...savedBusinesses.map((business) => `Visit ${business?.name} in ${business?.neighborhood}`),
    ...savedEvents.map((event) => `Check ${event?.title} on ${event?.date}`),
    ...savedGuides.map((guide) => `Read ${guide?.title}`),
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
          <h1>Build a Vancouver itinerary</h1>
          <p>
            Save places, events, and guides into a simple Vancouver plan. For now, your saved plan
            stays in this browser while sharing tools roll out in stages.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/missions">
              Open saved plans
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
            >
              Pick a route first
            </AppLink>
          </div>
        </div>
        <div className="public-intro-card planner-hero-card">
          <SparkIcon />
          <h2>Use it in three quick steps</h2>
          <ul className="public-note-list">
            <li><CheckIcon /> Save a few places, events, or guides.</li>
            <li><CheckIcon /> Turn that short list into one route or saved plan.</li>
            <li><CheckIcon /> Prepare the share draft when the plan feels right.</li>
          </ul>
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
          <strong>{bestMission?.title ?? "Start a route"}</strong>
          <span>Best active mission</span>
        </article>
      </section>

      <section className="split-section">
        <div>
          <SectionHeader
            title="Your saved plan"
            copy="Use this as a simple working list for routes, collections, referrals, and future city plans."
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
            copy="Prepare a message-ready route summary here before you send it anywhere else."
          />
          <div className="share-draft">
            <p>
              {itineraryText ||
                "I found a Vancouver route on CityAtlas with places, events, and guides I want to revisit. Take a look when you plan your next city day."}
            </p>
            <div className="share-actions">
              <button className="button primary" type="button" onClick={stageShareDraft}>
                Prepare share text
              </button>
              <AppLink className="button secondary" to="/">
                Get updates <ArrowRightIcon />
              </AppLink>
            </div>
            {shareState ? <small className="local-success">{shareState}</small> : null}
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Recommended routes"
          title="Save a full mission"
          copy="The fastest path to activation is saving a complete route, not one isolated listing."
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
          title="Pick a few items"
          copy="This helps you shape a route without creating an account or syncing personal data."
        />
        <div className="planner-pool">
          {data.businesses.map((business) => (
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
          {data.events.map((event) => (
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
          {cityGuides.map((guide) => (
            <button
              className={isSaved(data.savedItems, "guide", guide.id) ? "planner-chip saved" : "planner-chip"}
              type="button"
              onClick={() => onToggleSave("guide", guide.id, guide.title)}
              key={guide.id}
            >
              <MapIcon />
              <span>{guide.title}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
