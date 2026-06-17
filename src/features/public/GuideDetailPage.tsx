import type { Business, CityAtlasData, EventItem, Guide } from "../../types";
import { AppLink } from "../../components/Link";
import { BusinessCard, EventCard, GuideCard } from "../../components/Cards";
import { ArrowRightIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import {
  getGuideCityName,
  getGuideHubPath,
} from "../../lib/cityPaths";
import {
  getSourceBackedCollectionForGuide,
  getSourceBackedPlaces,
  sourceBackedCollectionMeta,
} from "../../lib/sourceBackedCollections";

interface GuideDetailPageProps {
  guide?: Guide;
  data: CityAtlasData;
  guideHubPath?: string;
}

const guideGateMeta = {
  draft_only: {
    label: "Planning guide",
    tone: "ink",
    trustCopy:
      "This page is meant to help at the route-planning level. Specific business, pricing, availability, or safety details should be confirmed directly before you rely on them.",
  },
  needs_real_sources: {
    label: "Route guidance",
    tone: "amber",
    trustCopy:
      "This guide is useful for planning structure, while specific business, pricing, availability, or safety details still need clearer public source support.",
  },
  ready_for_review: {
    label: "Public planning page",
    tone: "blue",
    trustCopy:
      "This guide is written to stay useful at the route-planning level without overstating specific business details. Exact listings and live operational details still need direct confirmation.",
  },
} as const;

const guideSourceBackedSectionCopy = {
  vancouver_date_night_starters: {
    title: "Real Vancouver anchors this guide can now point to",
    copy:
      "This is the first narrow official-source layer for the broader guide library: a few official-source venue anchors with visible claim boundaries and a public correction path.",
    railTitle: "Official-source date-night layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_rainy_day_starters: {
    title: "Real Vancouver rainy-day anchors this guide can now point to",
    copy:
      "This is the next narrow official-source layer for the broader guide library: a few official-source indoor or low-weather-friction anchors with visible claim boundaries and a public correction path.",
    railTitle: "Official-source rainy-day layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver rainy-day anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_first_evening_starters: {
    title: "Real Vancouver first-evening anchors this guide can now point to",
    copy:
      "This is the first visitor-intent official-source layer for the broader guide library: a few official-source anchors that help a new arrival choose one easy first-evening plan without drifting into fake travel authority.",
    railTitle: "Official-source first-evening layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver first-evening anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_first_time_visitor_starters: {
    title: "Real Vancouver starting areas this guide can now point to",
    copy:
      "This is the next visitor-intent official-source layer for the broader guide library: a few official-source starting areas that help a first-time visitor choose the right part of Vancouver before the night gets overbuilt.",
    railTitle: "Official-source first-time visitor layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver starting areas for a first visit, use the source-backed starter page and its correction path.",
  },
  toronto_first_time_visitor_starters: {
    title: "Real Toronto starting areas this guide can now point to",
    copy:
      "This is the next visitor-intent official-source layer for the broader guide library: a few official-source starting areas that help a first-time Toronto visitor choose the right part of the city before the day gets overbuilt.",
    railTitle: "Official-source Toronto first-time visitor layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Toronto starting areas for a first visit, use the source-backed starter page and its correction path.",
  },
  toronto_weekend_route_starters: {
    title: "Real Toronto weekend anchors this guide can now point to",
    copy:
      "This is the next weekend-intent official-source layer for the broader guide library: a few official-source Toronto anchors that help someone choose one weekend shape before the day gets scattered across the city.",
    railTitle: "Official-source Toronto weekend layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Toronto weekend-route anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_garden_day_starters: {
    title: "Real Vancouver garden and conservatory anchors this guide can now point to",
    copy:
      "This is the next garden-day official-source layer for the broader guide library: a few official-source park, conservatory, and botanical anchors that help someone choose one greener Vancouver route shape without drifting into fake local authority.",
    railTitle: "Official-source garden-day layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver garden and conservatory anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_kitsilano_scenic_starters: {
    title: "Real Vancouver west-side scenic anchors this guide can now point to",
    copy:
      "This is the next neighborhood-depth official-source layer for the broader guide library: a few official-source west-side anchors that help someone choose a slower Kitsilano or Vanier-facing route without drifting into fake local authority.",
    railTitle: "Official-source Kitsilano scenic layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver west-side scenic anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_west_side_daytime_starters: {
    title: "Real Vancouver west-side daytime anchors this guide can now point to",
    copy:
      "This is the next west-side daytime official-source layer for the broader guide library: a few official-source beach, campus, and garden anchors that help someone choose a calmer daytime Vancouver route without drifting into fake local authority.",
    railTitle: "Official-source west-side daytime layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver west-side daytime anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_false_creek_culture_starters: {
    title: "Real Vancouver False Creek culture anchors this guide can now point to",
    copy:
      "This is the next False Creek culture official-source layer for the broader guide library: a few official-source market, museum, science, and shoreline anchors that help someone choose a contained Vancouver culture afternoon without drifting into fake local authority.",
    railTitle: "Official-source False Creek culture layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver False Creek culture anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_ubc_discovery_starters: {
    title: "Real Vancouver UBC discovery anchors this guide can now point to",
    copy:
      "This is the next UBC discovery official-source layer for the broader guide library: a few official-source museums, gardens, and canopy anchors that help someone choose one contained campus-side Vancouver day without drifting into fake local authority.",
    railTitle: "Official-source UBC discovery layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver UBC discovery anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_returning_visitor_starters: {
    title: "Real Vancouver second-look anchors this guide can now point to",
    copy:
      "This is the next repeat-visit official-source layer for the broader guide library: a few official-source anchors that help someone who already did the obvious first trip choose a more local-feeling Vancouver plan.",
    railTitle: "Official-source returning-visitor layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver anchors for a second-look visit, use the source-backed starter page and its correction path.",
  },
  vancouver_out_of_town_guest_starters: {
    title: "Real Vancouver host-friendly anchors this guide can now point to",
    copy:
      "This is the next host-intent official-source layer for the broader guide library: a few official-source anchors that help someone host an out-of-town guest with one easy Vancouver plan instead of an overbuilt city marathon.",
    railTitle: "Official-source guest-hosting layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver anchors for hosting someone new to the city, use the source-backed starter page and its correction path.",
  },
  vancouver_weekend_route_starters: {
    title: "Real Vancouver weekend anchors this guide can now point to",
    copy:
      "This is the next weekend-intent official-source layer for the broader guide library: a few official-source anchors that help someone choose one Vancouver weekend shape before the day gets scattered across the city.",
    railTitle: "Official-source weekend layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver weekend-route anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_sunday_starters: {
    title: "Real Vancouver Sunday anchors this guide can now point to",
    copy:
      "This is the next low-effort weekend official-source layer for the broader guide library: a few official-source anchors that help someone choose one easier Vancouver Sunday without overfilling the day.",
    railTitle: "Official-source Sunday layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver Sunday anchors, use the source-backed starter page and its correction path.",
  },
  vancouver_wellness_reset_starters: {
    title: "Real Vancouver reset anchors this guide can now point to",
    copy:
      "This is the next trust-first official-source layer for the broader guide library: a few official-source calm, garden, park, and indoor reset anchors that help someone build a believable Vancouver recovery hour without exaggerated wellness claims.",
    railTitle: "Official-source wellness reset layer",
    railCopy:
      "If you want a source-backed page that actually names a few real Vancouver reset anchors, use the source-backed starter page and its correction path.",
  },
} as const;

function simplifyGuideSupportCopy(value: string) {
  return value
    .replace(/source-backed starter page/gi, "page with official links")
    .replace(/source-backed page/gi, "page with official links")
    .replace(/official-source/gi, "official")
    .replace(/correction path/gi, "report-an-issue path")
    .replace(/broader guide library/gi, "broader guide collection")
    .replace(/guide cluster/gi, "guide set")
    .replace(/visible claim boundaries/gi, "clear claim limits")
    .replace(/route shape/gi, "plan shape");
}

export function GuideDetailPage({ guide, data, guideHubPath }: GuideDetailPageProps) {
  if (!guide) {
    return (
      <section className="not-found">
        <h1>Guide not found</h1>
        <p>This guide route does not have a matching page yet.</p>
        <AppLink className="button primary" to={guideHubPath ?? "/vancouver/guides"}>
          Back to guides
        </AppLink>
      </section>
    );
  }

  const relatedBusinesses = guide.relatedBusinessIds
    .map((businessId) => data.businesses.find((business) => business.id === businessId))
    .filter((business): business is Business => Boolean(business));
  const relatedEvents = guide.relatedEventIds
    .map((eventId) => data.events.find((event) => event.id === eventId))
    .filter((event): event is EventItem => Boolean(event));
  const relatedGuides = data.guides
    .filter((candidate) => candidate.id !== guide.id)
    .filter(
      (candidate) =>
        (candidate.citySlug ?? "vancouver") === (guide.citySlug ?? "vancouver"),
    )
    .filter((candidate) =>
      candidate.cluster === guide.cluster ||
      candidate.category === guide.category ||
      candidate.neighborhood === guide.neighborhood ||
      candidate.internalLinkTarget === guide.internalLinkTarget,
    )
    .slice(0, 3);
  const sourceBackedCollection = getSourceBackedCollectionForGuide(guide);
  const sourceBackedGuidePlaces = sourceBackedCollection
    ? getSourceBackedPlaces(data, sourceBackedCollection).slice(0, 4)
    : [];
  const sourceBackedGuideSection = sourceBackedCollection
    ? guideSourceBackedSectionCopy[sourceBackedCollection]
    : null;
  const sourceBackedGuideMeta = sourceBackedCollection
    ? sourceBackedCollectionMeta[sourceBackedCollection]
    : null;
  const gateMeta = guideGateMeta[guide.gateDecision];
  const cityName = getGuideCityName(guide);
  const resolvedGuideHubPath = getGuideHubPath(guide);

  return (
    <>
      <section className="guide-hero">
        <div className="guide-hero-copy">
          <p className="section-label">{guide.category}</p>
          <h1>{guide.title}</h1>
          <p className="guide-summary">{guide.summary}</p>
          <div className="guide-meta-row">
            <StatusPill tone="blue">{guide.readMinutes} min read</StatusPill>
            <StatusPill tone={gateMeta.tone}>{gateMeta.label}</StatusPill>
            <span>Reviewed {guide.lastReviewed}</span>
          </div>
          <div className="guide-answer-card">
            <strong>{guide.heroQuestion}</strong>
            <p>{guide.promise}</p>
          </div>
        </div>
        <aside className="guide-sidebar-card">
          <div className="guide-sidebar-section">
            <strong>Best for</strong>
            <div className="tag-cloud">
              {guide.bestFor.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="guide-sidebar-section">
            <strong>Best use case</strong>
            <p>{guide.queryClass}</p>
          </div>
          <div className="guide-sidebar-section">
            <strong>Who this guide is for</strong>
            <p>{guide.audience}</p>
          </div>
          <AppLink className="button primary wide" to={guide.ctaPath}>
            {guide.ctaLabel} <ArrowRightIcon />
          </AppLink>
        </aside>
      </section>

      <section className="guide-layout">
        <article className="guide-article">
          <div className="guide-intro">
            <p>{guide.intro}</p>
            <p>{guide.body}</p>
          </div>

          {guide.sections.map((section) => (
            <section className="guide-section" key={section.heading}>
              <h2>{section.heading}</h2>
              <p className="guide-section-answer">{section.answer}</p>
              <ul className="plain-list guide-bullet-list">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          ))}

          {guide.resourceLinks?.length ? (
            <section className="guide-section">
              <SectionHeader
                label="Direct paths"
                title="Open the right CityAtlas page first"
                copy="Use these related route links when the real question is not what Vancouver offers, but which CityAtlas page matches the moment you are trying to plan."
              />
              <div className="guide-query-grid">
                {guide.resourceLinks.map((link) => (
                  <AppLink className="query-card query-card-link" key={link.path} to={link.path}>
                    <strong>{link.title}</strong>
                    <p>{link.description}</p>
                  </AppLink>
                ))}
              </div>
            </section>
          ) : null}

          {sourceBackedGuidePlaces.length > 0 && sourceBackedGuideSection ? (
            <section className="guide-section">
              <SectionHeader
                label="Official-source starting points"
                title={simplifyGuideSupportCopy(sourceBackedGuideSection.title)}
                copy={simplifyGuideSupportCopy(sourceBackedGuideSection.copy)}
              />
              <div className="card-grid two">
                {sourceBackedGuidePlaces.map((reference) => (
                  <article className="source-panel" key={reference.id}>
                    <p className="section-label">{reference.category}</p>
                    <h3>{reference.name}</h3>
                    <p>{reference.summary}</p>
                    <div className="tag-cloud">
                      <span>{reference.neighborhood}</span>
                      <span>{reference.routeRole}</span>
                    </div>
                    <p>
                      <strong>Why it fits:</strong> {reference.whyItFits}
                    </p>
                    <ul className="plain-list compact">
                      {reference.verifiedFacts.map((fact) => (
                        <li key={`${reference.id}-${fact}`}>{fact}</li>
                      ))}
                    </ul>
                    <div className="hero-actions">
                      <a
                        className="button secondary"
                        href={reference.officialSourceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Official site
                      </a>
                      <AppLink className="button secondary" to={reference.correctionPath}>
                        Report an issue
                      </AppLink>
                    </div>
                    <small>
                      Checked {reference.sourceCheckedAt} from {reference.sourceOwner}.
                    </small>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="guide-section">
            <SectionHeader
              label="FAQ"
              title="Questions this guide answers clearly"
              copy="These answers stay useful at the route-planning level and avoid overstating live business details."
            />
            <div className="faq-stack">
              {guide.faqs.map((faq) => (
                <article className="faq-card" key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </article>

        <aside className="guide-rail">
          <article className="rail-card">
            <ShieldIcon />
            <strong>Before you rely on this page</strong>
            <p>{gateMeta.trustCopy}</p>
          </article>
          <article className="rail-card">
            <MapIcon />
            <strong>Why this guide fits</strong>
            <p>
              This page is part of the CityAtlas {cityName}-intent guide set built to make
              neighborhood fit, route shape, and next-step planning easier to follow.
            </p>
          </article>
          <article className="rail-card">
            <SparkIcon />
            <strong>Next pages to open</strong>
            <div className="rail-links">
              <AppLink to={resolvedGuideHubPath}>All guides</AppLink>
              <AppLink to="/vancouver/missions">Saved plans</AppLink>
              <AppLink to="/planner">Planner</AppLink>
              <AppLink to="/for-businesses/pricing">For businesses</AppLink>
            </div>
          </article>
          {sourceBackedGuideMeta && sourceBackedGuideSection ? (
            <article className="rail-card">
              <ShieldIcon />
              <strong>{simplifyGuideSupportCopy(sourceBackedGuideSection.railTitle)}</strong>
              <p>{simplifyGuideSupportCopy(sourceBackedGuideSection.railCopy)}</p>
              <div className="rail-links">
                <AppLink to={sourceBackedGuideMeta.path}>
                  {sourceBackedGuideMeta.shortLabel}
                </AppLink>
                <AppLink to="/editorial-standards">Editorial standards</AppLink>
              </div>
            </article>
          ) : null}
        </aside>
      </section>

      {relatedBusinesses.length > 0 && !sourceBackedGuideMeta ? (
        <section className="section-block">
          <SectionHeader
            label="Related places"
            title="Places this guide can connect to"
            copy="These links help readers move from planning guidance into the broader CityAtlas discovery surface."
          />
          <div className="card-grid two">
            {relatedBusinesses.map((business) => (
              <BusinessCard business={business} key={business.id} />
            ))}
          </div>
        </section>
      ) : null}

      {relatedGuides.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Related guides"
            title="Keep the planning path moving"
            copy="These guide-to-guide links strengthen the city-intent guide set and help readers move from one planning question into the next useful page."
          />
          <div className="card-grid three">
            {relatedGuides.map((relatedGuide) => (
              <GuideCard guide={relatedGuide} key={relatedGuide.id} />
            ))}
          </div>
        </section>
      ) : null}

      {relatedEvents.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Related events"
            title="Event pages related to this guide"
            copy="Confirm live event details with the host or official source before relying on them."
          />
          <div className="card-grid two">
            {relatedEvents.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
