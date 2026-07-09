import { useState } from "react";
import type { CityAtlasData } from "../../types";
import { GuideCard } from "../../components/Cards";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { getGuideCitySlug, getGuidePath } from "../../lib/cityPaths";
import {
  getSourceBackedCollectionGuideHubPath,
  getSourceBackedPlaces,
  sourceBackedCollectionMeta,
  type SourceBackedCollectionId,
} from "../../lib/sourceBackedCollections";

type TorontoStartChoice = "first-time" | "been-before";
type TorontoDayChoice = "after-work" | "full-day" | "weekend";

interface SecondaryCityGuidesPageProps {
  citySlug: string;
  data: CityAtlasData;
}

function formatCityName(citySlug: string) {
  return citySlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SecondaryCityGuidesPage({
  citySlug,
  data,
}: SecondaryCityGuidesPageProps) {
  const [torontoStartChoice, setTorontoStartChoice] = useState<TorontoStartChoice>("first-time");
  const [torontoDayChoice, setTorontoDayChoice] = useState<TorontoDayChoice>("after-work");
  const guides = data.guides.filter((guide) => getGuideCitySlug(guide) === citySlug);
  const cityName = guides[0]?.cityName ?? formatCityName(citySlug);
  const collections = (Object.keys(sourceBackedCollectionMeta) as SourceBackedCollectionId[])
    .filter((collectionId) => getSourceBackedCollectionGuideHubPath(collectionId) === `/${citySlug}/guides`)
    .filter((collectionId) => getSourceBackedPlaces(data, collectionId).length > 0)
    .map((collectionId) => ({
      id: collectionId,
      meta: sourceBackedCollectionMeta[collectionId],
      itemCount: getSourceBackedPlaces(data, collectionId).length,
    }));
  const isTorontoChoiceHub = citySlug === "toronto";
  const torontoFirstTimeCollection = collections.find(
    ({ id }) => id === "toronto_first_time_visitor_starters",
  ) ?? collections[0] ?? null;
  const torontoWeekendCollection = collections.find(
    ({ id }) => id === "toronto_weekend_route_starters",
  ) ?? collections[0] ?? null;
  const torontoFirstTimeGuide = guides.find((guide) => guide.id === "guide-first-time-toronto-start")
    ?? guides[0]
    ?? null;
  const torontoWeekendGuide = guides.find((guide) => guide.id === "guide-toronto-weekend-route-ideas")
    ?? guides[0]
    ?? null;
  const torontoPrimaryCollection = torontoStartChoice === "first-time"
    ? torontoFirstTimeCollection
    : torontoWeekendCollection;
  const torontoPrimaryGuide = torontoStartChoice === "first-time"
    ? torontoFirstTimeGuide
    : torontoWeekendGuide;
  const torontoRecommendation = isTorontoChoiceHub
    ? (() => {
        const visitLabel = torontoStartChoice === "first-time" ? "First visit" : "Repeat visit";
        const dayLabel = torontoDayChoice === "after-work"
          ? "After work"
          : torontoDayChoice === "full-day"
            ? "Full day"
            : "Weekend";
        const title = torontoStartChoice === "first-time"
          ? torontoDayChoice === "after-work"
            ? "Start with one easy first-visit area"
            : torontoDayChoice === "full-day"
              ? "Start with one strong first-visit anchor"
              : "Start with the first-visit page, then keep the weekend compact"
          : torontoDayChoice === "after-work"
            ? "Start with one lighter Toronto anchor"
            : torontoDayChoice === "full-day"
              ? "Start with one clear Toronto day anchor"
              : "Start with the Toronto weekend page";
        const copy = torontoStartChoice === "first-time"
          ? torontoDayChoice === "after-work"
            ? "Use the first-time page when the goal is one easy Toronto start instead of a whole-city checklist."
            : torontoDayChoice === "full-day"
              ? "Use the first-time page when one bigger Toronto anchor should carry the day without extra guesswork."
              : "Use the first-time page first, then borrow the weekend guide only if the visit still needs a second move."
          : torontoDayChoice === "after-work"
            ? "Use the weekend page when the day should stay lighter, more local, and easier to finish without drag."
            : torontoDayChoice === "full-day"
              ? "Use the weekend page when one compact Toronto anchor should do most of the work instead of stacking stops."
              : "Use the weekend page when the real question is how to keep Toronto fun without crossing the city all day.";
        const supportTitle = torontoDayChoice === "after-work"
          ? "Keep the day short"
          : torontoDayChoice === "full-day"
            ? "Let one anchor carry the day"
            : "Keep the weekend compact";
        const supportCopy = torontoDayChoice === "after-work"
          ? "Pick one area and stop there. A shorter Toronto plan is usually easier to enjoy and easier to trust."
          : torontoDayChoice === "full-day"
            ? "One clear anchor beats trying to combine several far-apart neighborhoods."
            : "Use one strong start and one nearby follow-up instead of turning Toronto into a marathon.";

        return {
          label: `${visitLabel} · ${dayLabel}`,
          title,
          copy,
          primaryPath: torontoPrimaryCollection?.meta.path ?? `/${citySlug}/guides`,
          primaryLabel: torontoStartChoice === "first-time" ? "Open first-time page" : "Open weekend page",
          secondaryPath: torontoPrimaryGuide ? getGuidePath(torontoPrimaryGuide) : `/${citySlug}/guides`,
          secondaryLabel: torontoStartChoice === "first-time" ? "Read the first-visit guide" : "Read the weekend guide",
          supportCards: [
            {
              title: "First page",
              copy: torontoPrimaryCollection?.meta.shortLabel ?? `${cityName} first page`,
              note: torontoPrimaryCollection ? `${torontoPrimaryCollection.itemCount} places with official links` : "Official links included",
            },
            {
              title: "Matching guide",
              copy: torontoPrimaryGuide?.title ?? `${cityName} guide`,
              note: torontoPrimaryGuide ? `${torontoPrimaryGuide.readMinutes} min read` : "Guide ready",
            },
            {
              title: supportTitle,
              copy: supportCopy,
              note: "Simple next move",
            },
          ],
        };
      })()
    : null;
  const openFirstCopy = isTorontoChoiceHub
    ? "Open the first page that matches the visit. Every page keeps official links and a simple correction path."
    : `Each page starts with one use case, a small set of official links, and a simple correction path so the ${cityName} library stays easy to trust.`;
  const focusedGuidesCopy = isTorontoChoiceHub
    ? "Use one guide only after the first page feels right. That keeps Toronto helpful instead of turning into a reading pile."
    : `These pages focus on where to start and what kind of day fits first, so the ${cityName} library stays useful while broader city coverage is still growing.`;

  return (
    <>
      {isTorontoChoiceHub ? (
        <section className="city-hero city-hero-secondary secondary-city-choice-hero">
          <div className="secondary-city-choice-shell">
            <div className="secondary-city-choice-main">
              <p className="section-label">Starting points</p>
              <h1>Let&apos;s pick your Toronto start</h1>
              <p>
                Answer two easy questions. CityAtlas will point you to one Toronto page first so the city does not feel heavy.
              </p>
            </div>
            <div className="secondary-city-choice-panel">
              <div className="secondary-city-choice-row">
                <span className="query-card-kicker">Question 1</span>
                <strong>Who is this for?</strong>
                <div className="secondary-city-choice-buttons secondary-city-choice-buttons-two">
                  <button
                    type="button"
                    className={`secondary-city-choice-button${torontoStartChoice === "first-time" ? " is-active" : ""}`}
                    aria-pressed={torontoStartChoice === "first-time"}
                    onClick={() => setTorontoStartChoice("first-time")}
                  >
                    <strong>First time here</strong>
                    <span>New visitor or host</span>
                  </button>
                  <button
                    type="button"
                    className={`secondary-city-choice-button${torontoStartChoice === "been-before" ? " is-active" : ""}`}
                    aria-pressed={torontoStartChoice === "been-before"}
                    onClick={() => setTorontoStartChoice("been-before")}
                  >
                    <strong>I&apos;ve been before</strong>
                    <span>Local or repeat visit</span>
                  </button>
                </div>
              </div>

              <div className="secondary-city-choice-row">
                <span className="query-card-kicker">Question 2</span>
                <strong>What kind of day?</strong>
                <div className="secondary-city-choice-buttons secondary-city-choice-buttons-three">
                  <button
                    type="button"
                    className={`secondary-city-choice-button${torontoDayChoice === "after-work" ? " is-active" : ""}`}
                    aria-pressed={torontoDayChoice === "after-work"}
                    onClick={() => setTorontoDayChoice("after-work")}
                  >
                    <strong>After work</strong>
                    <span>Short and easy</span>
                  </button>
                  <button
                    type="button"
                    className={`secondary-city-choice-button${torontoDayChoice === "full-day" ? " is-active" : ""}`}
                    aria-pressed={torontoDayChoice === "full-day"}
                    onClick={() => setTorontoDayChoice("full-day")}
                  >
                    <strong>Full day</strong>
                    <span>One bigger anchor</span>
                  </button>
                  <button
                    type="button"
                    className={`secondary-city-choice-button${torontoDayChoice === "weekend" ? " is-active" : ""}`}
                    aria-pressed={torontoDayChoice === "weekend"}
                    onClick={() => setTorontoDayChoice("weekend")}
                  >
                    <strong>Weekend</strong>
                    <span>Compact and fun</span>
                  </button>
                </div>
              </div>

              {torontoRecommendation ? (
                <div className="secondary-city-choice-answer" aria-live="polite">
                  <div className="secondary-city-choice-answer-topline">
                    <StatusPill tone="green">Best first page</StatusPill>
                    <span>{torontoRecommendation.label}</span>
                  </div>
                  <strong>{torontoRecommendation.title}</strong>
                  <p>{torontoRecommendation.copy}</p>
                  <div className="secondary-city-choice-answer-actions">
                    <AppLink className="button primary" to={torontoRecommendation.primaryPath}>
                      {torontoRecommendation.primaryLabel} <ArrowRightIcon />
                    </AppLink>
                    <AppLink className="text-link" to={torontoRecommendation.secondaryPath}>
                      {torontoRecommendation.secondaryLabel} <ArrowRightIcon />
                    </AppLink>
                  </div>
                  <div className="secondary-city-choice-answer-grid">
                    {torontoRecommendation.supportCards.map((card) => (
                      <div className="secondary-city-choice-answer-card" key={`${card.title}-${card.note}`}>
                        <small>{card.title}</small>
                        <strong>{card.copy}</strong>
                        <p>{card.note}</p>
                      </div>
                    ))}
                  </div>
                  <p className="secondary-city-choice-notice">
                    Every Toronto page keeps official links and a visible way to report a mistake.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <section className="city-hero city-hero-secondary">
          <div>
            <p className="section-label">Starting points</p>
            <h1>{cityName} starting pages and guides</h1>
            <p>
              {`Use these pages when you want one clear ${cityName} starting area, official links, and a simple way to report outdated information.`}
            </p>
            <div className="hero-actions">
              <AppLink className="button primary" to={`/${citySlug}/guides`}>
                Open {cityName} guides
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/guides">
                Open Vancouver guides
              </AppLink>
            </div>
            <div className="tag-cloud pricing-tag-cloud secondary-city-hero-tags">
              <span>{collections.length} first pages</span>
              <span>{guides.length} focused guides</span>
              <span>Report outdated info</span>
            </div>
          </div>
          <div className="starter-hero-side">
            <div className="public-intro-card secondary-city-summary-card">
              <div className="public-intro-card-header">
                <div>
                  <strong>Start with the clearest page</strong>
                  <p>{`${cityName} starts with a smaller set of pages so each one can answer one planning question well.`}</p>
                </div>
                <StatusPill tone="blue">Starter set</StatusPill>
              </div>
              <ul className="public-note-list">
                <li><MapIcon /> Open one starting page first instead of scanning a broader city list.</li>
                <li><ShieldIcon /> Every page keeps official links and a visible way to report a mistake.</li>
                <li><SparkIcon /> The smaller city library stays narrow on purpose until coverage is stronger.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="section-block">
        <SectionHeader
          label="Open first"
          title={`${cityName} pages to open first`}
          copy={openFirstCopy}
        />
        <div className="guide-query-grid">
          {collections.map(({ id, meta, itemCount }) => (
            <AppLink className="query-card query-card-link" key={id} to={meta.path}>
              <strong>{meta.shortLabel}</strong>
              <p>{meta.pageDescription}</p>
              <small>{itemCount} places with official links</small>
            </AppLink>
          ))}
          <AppLink className="query-card query-card-link" to="/editorial-standards">
            <strong>Editorial standards</strong>
            <p>Review the source rules, correction process, and claim limits before using a smaller CityAtlas city page as planning input.</p>
          </AppLink>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Focused guides"
          title={`${cityName} guides that stay focused and useful`}
          copy={focusedGuidesCopy}
        />
        <div className="card-grid two">
          {guides.map((guide) => (
            <GuideCard data={data} guide={guide} key={guide.id} />
          ))}
        </div>
      </section>

      <section className="cta-band">
        <StatusPill tone="green">Official links included</StatusPill>
        <div>
          <h2>Need deeper Vancouver coverage too?</h2>
          <p>
            CityAtlas still has its deepest public guide set in Vancouver. Use the Toronto pages for first-visit and compact-weekend questions, then open Vancouver when you need broader neighborhood and weekend coverage.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/guides">
          Open Vancouver guides <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
