import { useState } from "react";
import type { CityAtlasData } from "../../types";
import { AppLink } from "../../components/Link";
import { EventCard, GuideCard, GuideCompactCard, OfferCard } from "../../components/Cards";
import { ArrowRightIcon } from "../../components/Icons";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";
import { getGuidePath } from "../../lib/cityPaths";
import { getOfferDisplayBusiness } from "../../lib/offers";
import { simplifyGuideCategoryLabel, simplifyGuideDisplayText } from "../../lib/publicCopy";
import { getSourceBackedPlaces } from "../../lib/sourceBackedCollections";
import { getBusinessVisual, getEventVisual } from "../../lib/visuals";

export function EventsPage({ data }: { data: CityAtlasData }) {
  const featuredEvent = data.events[0];

  return (
    <>
      <section className="city-hero page-top">
        <div className="city-hero-copy">
          <p className="section-label">Events</p>
          <h1>Vancouver event ideas that can shape the day</h1>
          <p>
            Open these when a market, class, or one-time event helps decide the day. Confirm the
            final timing, location, and booking details with the host before you rely on them.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/guides">
              Open Vancouver guides
            </AppLink>
            <AppLink className="button secondary" to="/vancouver">
              Back to Vancouver
            </AppLink>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Use event pages when one live stop can help decide the day faster.</strong>
            <p>
              Start here when timing matters, then confirm the final schedule and booking details
              with the host before you rely on the plan.
            </p>
          </article>
        </div>
        <div className="starter-hero-side">
          <HeroMediaCard
            image={featuredEvent ? getEventVisual(featuredEvent) : siteConfig.media.hero}
            alt={
              featuredEvent
                ? `Supporting place photo for ${featuredEvent.title}`
                : "Granville Island Public Market in Vancouver"
            }
            eyebrow={featuredEvent ? featuredEvent.neighborhood : "Event ideas"}
            title={featuredEvent?.title ?? "Vancouver event ideas"}
            copy={
              featuredEvent?.description ??
              "Use these when a live event helps shape the day more than a generic list of places."
            }
            className="hero-media-compact"
          />
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel starter-hero-note">
          <strong>How to use this page</strong>
          <ul className="plain-list compact">
            <li>Use this page when a live event matters more than a static place list.</li>
            <li>Check the final schedule, ticketing, and location with the host.</li>
            <li>Open a guide first when the bigger question is still where to start.</li>
          </ul>
          <StatusPill tone="amber">{data.events.length} event ideas</StatusPill>
        </div>
        <div className="source-panel conversion-panel">
          <h2>Best next move if the day is still wide open</h2>
          <p>
            Open a guide first when the real job is still choosing the neighborhood, pace, or
            weather shape before the event itself matters.
          </p>
          <AppLink className="button secondary" to="/vancouver/guides">
            Open Vancouver guides <ArrowRightIcon />
          </AppLink>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Events"
          title="Event cards built for fast scanning"
          copy="These cards stay short on purpose so the event can help shape the day without taking over the whole planning flow."
          action={<StatusPill tone="amber">Check details first</StatusPill>}
        />
        <div className="card-grid two">
          {data.events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      </section>
    </>
  );
}

export function OffersPage({ data }: { data: CityAtlasData }) {
  const featuredOffer = data.offers[0];
  const featuredOfferBusiness = featuredOffer
    ? getOfferDisplayBusiness(featuredOffer, data.businesses)
    : undefined;

  return (
    <>
      <section className="city-hero page-top">
        <div className="city-hero-copy">
          <p className="section-label">Offers</p>
          <h1>Vancouver offers worth checking before a detour</h1>
          <p>
            Open these when a clear local offer could change the plan. The value only works when
            the timing, terms, and redemption details are easy to understand first.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/for-businesses/submit">
              Start business request
            </AppLink>
            <AppLink className="button secondary" to="/vancouver">
              Back to Vancouver
            </AppLink>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Use offer pages when one clear local deal can change where someone goes.</strong>
            <p>
              CityAtlas only wants offers that are easy to understand fast, with timing and
              redemption details clear before the detour happens.
            </p>
          </article>
        </div>
        <div className="starter-hero-side">
          <HeroMediaCard
            image={
              featuredOfferBusiness ? getBusinessVisual(featuredOfferBusiness) : siteConfig.media.waterfront
            }
            alt={
              featuredOfferBusiness
                ? `${featuredOfferBusiness.name} venue photo`
                : "Kitsilano Beach shoreline in Vancouver"
            }
            eyebrow={featuredOfferBusiness?.name ?? "Local offer"}
            title={featuredOffer?.title ?? "Vancouver local offers"}
            copy={
              featuredOffer?.description ??
              "Use these when a clear local offer can help choose where to go next."
            }
            className="hero-media-compact"
          />
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel starter-hero-note">
          <strong>How to use this page</strong>
          <ul className="plain-list compact">
            <li>Use this page when the offer itself could change where someone goes.</li>
            <li>Check dates, limits, and redemption rules before treating an offer as current.</li>
            <li>Use the business request form when a business wants a page or offer like this.</li>
          </ul>
          <StatusPill tone="amber">{data.offers.length} sample offers</StatusPill>
        </div>
        <div className="source-panel conversion-panel">
          <h2>Best next move for businesses</h2>
          <p>
            Open the business request when the business needs a clearer page, better offer
            framing, or guide placement before anything goes public.
          </p>
          <AppLink className="button secondary" to="/for-businesses/submit">
            Start business request <ArrowRightIcon />
          </AppLink>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Offers"
          title="Offers that stay clear before someone makes the detour"
          copy="These sample offers show the level of clarity CityAtlas wants before an offer becomes part of the public experience."
          action={<StatusPill tone="amber">Check terms first</StatusPill>}
        />
        <div className="card-grid two">
          {data.offers.map((offer) => (
            <OfferCard
              offer={offer}
              business={getOfferDisplayBusiness(offer, data.businesses)}
              key={offer.id}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export function GuidesPage({ data }: { data: CityAtlasData }) {
  const cityGuides = data.guides.filter(
    (guide) => (guide.citySlug ?? siteConfig.citySlug) === siteConfig.citySlug,
  );
  const starterPackGuide = cityGuides.find(
    (guide) => guide.slug === "vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
  );
  const routeRoundupGuide = cityGuides.find(
    (guide) => guide.slug === "cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
  );
  const dateAndWeatherGuides = cityGuides.filter(
    (guide) =>
      guide.cluster === "Date night" ||
      guide.cluster === "Rainy day" ||
      guide.cluster === "Cafes",
  );
  const visitorGuides = cityGuides.filter(
    (guide) => guide.cluster === "Visitors" || guide.cluster === "Starter Pack",
  );
  const weekendAndResetGuides = cityGuides.filter(
    (guide) => guide.cluster === "Weekend" || guide.cluster === "Wellness",
  );
  const neighborhoodGuides = cityGuides.filter((guide) => guide.cluster === "Neighborhoods");
  const neighborhoodStarterGuides = neighborhoodGuides.filter(
    (guide) => guide.category === "Neighborhood Starter",
  );
  const neighborhoodGuideCollection =
    neighborhoodStarterGuides.length > 0
      ? [
          ...neighborhoodStarterGuides,
          ...neighborhoodGuides.filter((guide) => guide.category !== "Neighborhood Starter"),
        ]
      : neighborhoodGuides;
  const sourceBackedDateNightStarters = getSourceBackedPlaces(data, "vancouver_date_night_starters");
  const sourceBackedRainyDayStarters = getSourceBackedPlaces(data, "vancouver_rainy_day_starters");
  const sourceBackedFirstEveningStarters = getSourceBackedPlaces(
    data,
    "vancouver_first_evening_starters",
  );
  const sourceBackedFirstTimeVisitorStarters = getSourceBackedPlaces(
    data,
    "vancouver_first_time_visitor_starters",
  );
  const sourceBackedGardenDayStarters = getSourceBackedPlaces(
    data,
    "vancouver_garden_day_starters",
  );
  const sourceBackedKitsilanoScenicStarters = getSourceBackedPlaces(
    data,
    "vancouver_kitsilano_scenic_starters",
  );
  const sourceBackedWestSideDaytimeStarters = getSourceBackedPlaces(
    data,
    "vancouver_west_side_daytime_starters",
  );
  const sourceBackedFalseCreekCultureStarters = getSourceBackedPlaces(
    data,
    "vancouver_false_creek_culture_starters",
  );
  const sourceBackedUbcDiscoveryStarters = getSourceBackedPlaces(
    data,
    "vancouver_ubc_discovery_starters",
  );
  const sourceBackedReturningVisitorStarters = getSourceBackedPlaces(
    data,
    "vancouver_returning_visitor_starters",
  );
  const sourceBackedOutOfTownGuestStarters = getSourceBackedPlaces(
    data,
    "vancouver_out_of_town_guest_starters",
  );
  const sourceBackedWeekendRouteStarters = getSourceBackedPlaces(
    data,
    "vancouver_weekend_route_starters",
  );
  const sourceBackedSundayStarters = getSourceBackedPlaces(data, "vancouver_sunday_starters");
  const sourceBackedWellnessResetStarters = getSourceBackedPlaces(
    data,
    "vancouver_wellness_reset_starters",
  );
  const officialLinkPageCount = [
    sourceBackedDateNightStarters,
    sourceBackedRainyDayStarters,
    sourceBackedFirstEveningStarters,
    sourceBackedFirstTimeVisitorStarters,
    sourceBackedGardenDayStarters,
    sourceBackedKitsilanoScenicStarters,
    sourceBackedWestSideDaytimeStarters,
    sourceBackedFalseCreekCultureStarters,
    sourceBackedUbcDiscoveryStarters,
    sourceBackedReturningVisitorStarters,
    sourceBackedOutOfTownGuestStarters,
    sourceBackedWeekendRouteStarters,
    sourceBackedSundayStarters,
    sourceBackedWellnessResetStarters,
  ].filter((collection) => collection.length > 0).length;
  const officialLinkPageLabel = `${officialLinkPageCount} place pages with official links`;
  const guideRouterCards = [
    {
      title: "Need real Vancouver places, not just advice?",
      copy:
        "Open a local place first when you want named restaurants, parks, or venues with official links.",
      primaryLabel: "Local places",
      primaryPath: "/vancouver/date-night-starters",
      secondaryLabel: "Browse all guides",
      secondaryPath:
        "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
      meta: "Best when you already want real places",
    },
    {
      title: "Planning for a visitor or guest?",
      copy:
        "Use these guides when the best answer depends on whether it is a first trip, a return trip, or a day with visiting friends or family.",
      primaryLabel: "Visitor guides",
      primaryPath: "#visitor-guide-cluster",
      secondaryLabel: "First-visit pages",
      secondaryPath: "/vancouver/first-time-visitor-starters",
      meta: "First trip, return trip, or hosting",
    },
    {
      title: "Trying to keep the day calm and compact?",
      copy:
        "Start here when energy, pace, and weather matter more than fitting in everything.",
      primaryLabel: "Weekend guides",
      primaryPath: "#weekend-guide-cluster",
      secondaryLabel: "Weekend starting points",
      secondaryPath: "/vancouver/weekend-route-starters",
      meta: "Weekend, Sunday, and wellness",
    },
    {
      title: "Need to choose the neighborhood first?",
      copy:
        "Use these pages when the biggest decision is Gastown, Kitsilano, Mount Pleasant, or another part of the city.",
      primaryLabel: "Neighborhood guides",
      primaryPath: "#neighborhood-guide-cluster",
      secondaryLabel: "Neighborhood chooser",
      secondaryPath:
        "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
      meta: "Best when the area matters first",
    },
  ];
  const placePageQuickLinks = trustedPlacePageLinks(starterPackGuide, routeRoundupGuide);
  const guideIndexGroups = buildGuideIndexGroups(cityGuides, [
    {
      title: "Date, rainy day, and easy starts",
      summary: "Open this when mood, weather, or a first easy decision matters most.",
      guides: dateAndWeatherGuides,
    },
    {
      title: "Visitors and hosts",
      summary: "Best for first visits, repeat visits, and days with guests.",
      guides: visitorGuides,
    },
    {
      title: "Weekend and wellness",
      summary: "Use this when calmer pace, recovery, or an easier plan matters.",
      guides: weekendAndResetGuides,
    },
    {
      title: "Neighborhood choices",
      summary: "Start here when the biggest decision is which part of Vancouver fits first.",
      guides: neighborhoodGuideCollection,
    },
  ]);
  const [expandedGuideGroups, setExpandedGuideGroups] = useState<string[]>(() =>
    guideIndexGroups.length > 0 ? [guideIndexGroups[0].title] : [],
  );

  function toggleGuideGroup(title: string) {
    setExpandedGuideGroups((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  function renderGuideCluster(
    label: string,
    title: string,
    copy: string,
    guides: typeof cityGuides,
    id: string,
    columns: "two" | "three" = "two",
  ) {
    if (guides.length === 0) return null;

    const [featuredGuide, ...supportingGuides] = guides;
    const visibleSupportingGuides = supportingGuides.slice(0, columns === "three" ? 2 : 1);
    const hiddenGuideCount = supportingGuides.length - visibleSupportingGuides.length;

    return (
      <section className="section-block" id={id}>
        <SectionHeader
          label={label}
          title={title}
          copy={copy}
          action={<StatusPill tone="green">{guides.length} guides</StatusPill>}
        />
        {supportingGuides.length > 0 ? (
          <div className={`guide-cluster-layout ${columns}`}>
            <GuideCard guide={featuredGuide} key={featuredGuide.id} />
            <div className="guide-cluster-stack">
              {visibleSupportingGuides.map((guide) => (
                <GuideCompactCard guide={guide} key={guide.id} variant="tight" />
              ))}
              {hiddenGuideCount > 0 ? (
                <a className="guide-more-card" href="#guide-library-index">
                  <strong>See {hiddenGuideCount} more guides in the full list</strong>
                  <span>Use the full guide list below when you already know the question and just need the fastest page.</span>
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="card-grid two">
            <GuideCard guide={featuredGuide} key={featuredGuide.id} />
          </div>
        )}
      </section>
    );
  }

  return (
    <>
      <section className="city-hero guide-library-hero page-top">
        <div className="city-hero-copy guide-library-hero-copy">
          <p className="section-label">Guides</p>
          <h1>Vancouver guides for easier local plans</h1>
          <p>Start with the question, then open the guide or local place that already fits the day.</p>
          <div className="hero-actions">
            {starterPackGuide ? (
              <AppLink
                className="button primary"
                to={`/vancouver/guides/${starterPackGuide.slug}`}
              >
                Where do I start?
              </AppLink>
            ) : null}
            <AppLink className="button secondary" to="/vancouver/date-night-starters">
              Local Vancouver places
            </AppLink>
          </div>
        </div>
        <div className="starter-hero-side guide-library-side-stack">
          <HeroMediaCard
            image={siteConfig.media.waterfront}
            alt="Kitsilano Beach shoreline in Vancouver"
            eyebrow="Guide library"
            title="Choose the kind of day first"
            copy="Pick the visitor type, neighborhood, weather, or pace first. Then open the page that already fits."
            className="hero-media-compact"
          />
          <article className="source-panel guide-library-side-card">
            <div className="guide-library-side-pills">
              <StatusPill tone="blue">{cityGuides.length} Vancouver guides</StatusPill>
              <StatusPill tone="green">{officialLinkPageLabel}</StatusPill>
            </div>
            <strong>Choose the fastest opening move</strong>
            <p>
              Jump straight into visitors, weekend plans, neighborhood choice, or saved plans
              instead of scanning the whole city first.
            </p>
            <div className="city-search-secondary">
              <p className="city-search-secondary-label">Jump to</p>
              <div className="city-search-secondary-links">
                <a className="city-search-secondary-link" href="#visitor-guide-cluster">
                  Visitors and hosts
                </a>
                <a className="city-search-secondary-link" href="#weekend-guide-cluster">
                  Weekend and reset
                </a>
                <a className="city-search-secondary-link" href="#neighborhood-guide-cluster">
                  Neighborhood choice
                </a>
                <AppLink className="city-search-secondary-link" to="/vancouver/missions">
                  Saved plans
                </AppLink>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="split-section guide-library-intro-row">
        <article className="source-panel guide-library-intro-card">
          <strong>4 clear starting lanes</strong>
          <p>Visitors and hosts, weekend and reset, neighborhood choice, or real local places.</p>
        </article>
        <article className="source-panel guide-library-intro-card guide-library-intro-card-safe">
          <strong>{cityGuides.length} Vancouver guides that help people choose faster</strong>
          <p>
            Use a guide when the first decision is still pace, visitor type, weather, or
            neighborhood. Open a place page when the next move is already a real stop.
          </p>
        </article>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Start here"
          title="Pick the kind of day you are planning"
          copy="Open the strongest next page for the situation instead of browsing the whole city at once."
          action={<StatusPill tone="blue">4 starting points</StatusPill>}
        />
        <div className="guide-router-grid">
          {guideRouterCards.map((card) => {
            const secondaryIsAnchor = card.secondaryPath.startsWith("#");
            const primaryIsAnchor = card.primaryPath.startsWith("#");

            return (
              <article className="query-card" key={card.title}>
                <span className="query-card-kicker">{card.meta}</span>
                <strong>{card.title}</strong>
                <p>{card.copy}</p>
                <div className="query-card-actions">
                  {primaryIsAnchor ? (
                    <a className="button secondary" href={card.primaryPath}>
                      {card.primaryLabel}
                    </a>
                  ) : (
                    <AppLink className="button secondary" to={card.primaryPath}>
                      {card.primaryLabel}
                    </AppLink>
                  )}
                  {secondaryIsAnchor ? (
                    <a className="button secondary" href={card.secondaryPath}>
                      {card.secondaryLabel}
                    </a>
                  ) : (
                    <AppLink className="button secondary" to={card.secondaryPath}>
                      {card.secondaryLabel}
                    </AppLink>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {renderGuideCluster(
        "Date, weather, and easy plans",
        "Guides for compact city moments",
        "Open these when the plan starts with date night, rain, or a first evening in Vancouver.",
        dateAndWeatherGuides,
        "route-weather-guide-cluster",
      )}

      {renderGuideCluster(
        "Visitor and host guides",
        "Guides for first arrivals, repeat visits, and guest plans",
        "Use these for first visits, return trips, or days with guests without defaulting to generic tourism copy.",
        visitorGuides,
        "visitor-guide-cluster",
      )}

      {renderGuideCluster(
        "Weekend and reset guides",
        "Guides for calmer weekend shapes and recovery-led plans",
        "Use these when pace, energy, or recovery matters more than fitting in everything.",
        weekendAndResetGuides,
        "weekend-guide-cluster",
      )}

      {renderGuideCluster(
        "Destination starting points",
        "Neighborhood pages for clearer Vancouver choices",
        "Start here when the main decision is which part of Vancouver fits best before anyone falls into venue-by-venue browsing.",
        neighborhoodGuideCollection,
        "neighborhood-guide-cluster",
        "three",
      )}

      {sourceBackedDateNightStarters.length > 0 ||
      sourceBackedRainyDayStarters.length > 0 ||
      sourceBackedFirstEveningStarters.length > 0 ||
      sourceBackedFirstTimeVisitorStarters.length > 0 ||
      sourceBackedGardenDayStarters.length > 0 ||
      sourceBackedKitsilanoScenicStarters.length > 0 ||
      sourceBackedWestSideDaytimeStarters.length > 0 ||
      sourceBackedFalseCreekCultureStarters.length > 0 ||
      sourceBackedUbcDiscoveryStarters.length > 0 ||
      sourceBackedReturningVisitorStarters.length > 0 ||
      sourceBackedOutOfTownGuestStarters.length > 0 ||
      sourceBackedWeekendRouteStarters.length > 0 ||
      sourceBackedSundayStarters.length > 0 ||
      sourceBackedWellnessResetStarters.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Local places"
            title="Need real Vancouver places?"
            copy="Open these when the next step is a restaurant, park, cafe, or venue, not more planning copy."
            action={<StatusPill tone="green">{officialLinkPageLabel}</StatusPill>}
          />
          <div className="source-panel place-page-callout">
            <p>
              These pages keep the planning useful when you need a real stop with official links and
              a clear correction path.
            </p>
            <div className="tag-cloud place-page-tag-cloud">
              {placePageQuickLinks.map((link) => (
                <AppLink
                  className={link.primary ? "button primary" : "button secondary"}
                  key={link.path}
                  to={link.path}
                >
                  {link.label}
                  {link.primary ? <ArrowRightIcon /> : null}
                </AppLink>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-block" id="guide-library-index">
        <SectionHeader
          label="Full list"
          title="Browse all Vancouver guides by type"
          copy="Use this when you already know the shape of the day and just need the right page. Open only the section that matches the question."
        />
        <div className="guide-index-groups">
          {guideIndexGroups.map((group) => {
            const expanded = expandedGuideGroups.includes(group.title);

            return (
              <article className="guide-index-group" key={group.title}>
                <button
                  aria-expanded={expanded}
                  className="guide-index-group-heading"
                  onClick={() => toggleGuideGroup(group.title)}
                  type="button"
                >
                  <div className="guide-index-group-heading-copy">
                    <strong>{group.title}</strong>
                    <span className="guide-index-group-summary">{group.summary}</span>
                  </div>
                  <div className="guide-index-group-heading-meta">
                    <span>{group.links.length} guides</span>
                    <span className="guide-index-group-toggle">{expanded ? "Hide" : "Open"}</span>
                  </div>
                </button>
                {expanded ? (
                  <div className="guide-index-link-list">
                    {group.links.map((guide) => (
                      <AppLink className="guide-index-text-link" key={guide.id} to={guide.path}>
                        <strong>{guide.title}</strong>
                        <span>{guide.detail}</span>
                      </AppLink>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Other city"
          title="Toronto is starting smaller on purpose"
          copy="Use Toronto when the strongest next move is one first-visit or compact weekend question, not the full Vancouver guide set."
          action={<StatusPill tone="blue">Toronto guides</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink className="query-card query-card-link" to="/toronto/guides">
            <strong>Toronto guides</strong>
            <p>Start with Toronto guides when the plan needs one cleaner first-visit or weekend decision instead of a generic city roundup.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/first-time-visitor-starters">
            <strong>Toronto starting points</strong>
            <p>Open the Toronto starting page for a narrower first-visit layer with official links and an easy correction path.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/toronto/guides/where-should-a-first-time-toronto-visitor-start"
          >
            <strong>Toronto destination guide</strong>
            <p>Read the Toronto destination guide when the key decision is Distillery, St. Lawrence, Harbourfront, AGO, or ROM first.</p>
          </AppLink>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Turn a good guide into a saved plan</h2>
          <p>
            A good page should help someone save a plan, choose a neighborhood, or open
            the next useful page instead of ending as a dead article.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/missions">
          Open saved plans <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}

function trustedPlacePageLinks(
  starterPackGuide: CityAtlasData["guides"][number] | undefined,
  routeRoundupGuide: CityAtlasData["guides"][number] | undefined,
) {
  return [
    { path: "/vancouver/date-night-starters", label: "Date night", primary: true },
    { path: "/vancouver/rainy-day-starters", label: "Rainy day" },
    { path: "/vancouver/first-evening-starters", label: "First evening" },
    { path: "/vancouver/first-time-visitor-starters", label: "First visit" },
    { path: "/vancouver/kitsilano-scenic-starters", label: "Kitsilano" },
    { path: "/vancouver/weekend-route-starters", label: "Weekend plan" },
    { path: "/vancouver/wellness-reset-starters", label: "Wellness reset" },
    ...(starterPackGuide
      ? [{ path: `/vancouver/guides/${starterPackGuide.slug}`, label: "Where to start" }]
      : []),
    ...(routeRoundupGuide
      ? [{ path: `/vancouver/guides/${routeRoundupGuide.slug}`, label: "Browse by situation" }]
      : []),
    { path: "/editorial-standards", label: "Editorial standards" },
  ];
}

function buildGuideIndexGroups(
  allGuides: CityAtlasData["guides"],
  groups: Array<{ title: string; summary: string; guides: CityAtlasData["guides"] }>,
) {
  const seenGuideIds = new Set<string>();
  const groupedLinks = groups
    .map((group) => {
      const uniqueGuides = group.guides.filter((guide) => {
        if (seenGuideIds.has(guide.id)) return false;
        seenGuideIds.add(guide.id);
        return true;
      });

      return {
        title: group.title,
        summary: group.summary,
        links: uniqueGuides.map((guide) => ({
          id: guide.id,
          title: simplifyGuideDisplayText(guide.title),
          detail: `${simplifyGuideCategoryLabel(guide.category)} - ${guide.neighborhood}`,
          path: getGuidePath(guide),
        })),
      };
    })
    .filter((group) => group.links.length > 0);

  const uncategorizedGuides = allGuides
    .filter((guide) => !seenGuideIds.has(guide.id))
    .map((guide) => ({
      id: guide.id,
      title: simplifyGuideDisplayText(guide.title),
      detail: `${simplifyGuideCategoryLabel(guide.category)} - ${guide.neighborhood}`,
      path: getGuidePath(guide),
    }));

  if (uncategorizedGuides.length > 0) {
    groupedLinks.push({
      title: "Other Vancouver guides",
      summary: "Extra pages that do not fit the main clusters above.",
      links: uncategorizedGuides,
    });
  }

  return groupedLinks;
}
