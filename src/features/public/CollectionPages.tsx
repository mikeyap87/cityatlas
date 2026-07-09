import { useState } from "react";
import type { CityAtlasData } from "../../types";
import { AppLink } from "../../components/Link";
import {
  EventCard,
  getGuideSurfaceState,
  OfferCard,
} from "../../components/Cards";
import { ArrowRightIcon } from "../../components/Icons";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";
import { getGuidePath } from "../../lib/cityPaths";
import { getMissionAnchorPath } from "../../lib/missions";
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
            <AppLink className="button secondary" to="/vancouver/date-night-starters">
              Open local places
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
                ? `Supporting image for ${featuredEvent.title}`
                : "Illustrated market scene inspired by Granville Island Public Market in Vancouver"
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
            Open all guides <ArrowRightIcon />
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
            <AppLink className="button secondary" to="/vancouver/date-night-starters">
              Open local places
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
                : "Illustrated shoreline scene inspired by Kitsilano Beach in Vancouver"
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
  const placePageQuickLinks = trustedPlacePageLinks(starterPackGuide, routeRoundupGuide);
  const guideIndexGroups = buildGuideIndexGroups(data, cityGuides, [
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
  const heroFeaturedMission =
    data.cityMissions.find((mission) => mission.id === "mission-date-night") ?? data.cityMissions[0];
  const heroFeaturedRoutePath = heroFeaturedMission
    ? getMissionAnchorPath(heroFeaturedMission, siteConfig.citySlug)
    : "/vancouver/missions";
  const firstVisitorGuide =
    visitorGuides.find((guide) => guide.id !== starterPackGuide?.id) ?? visitorGuides[0];
  const firstWeekendGuide = weekendAndResetGuides[0];
  const firstNeighborhoodGuide = neighborhoodGuideCollection[0];
  const situationSupportLinks = [
    routeRoundupGuide
      ? { path: getGuidePath(routeRoundupGuide), label: "Browse by situation" }
      : null,
    firstVisitorGuide ? { path: getGuidePath(firstVisitorGuide), label: "First visit" } : null,
    firstWeekendGuide ? { path: getGuidePath(firstWeekendGuide), label: "Weekend plan" } : null,
  ].filter((link): link is { path: string; label: string } => link !== null);
  const neighborhoodSupportLinks = Array.from(
    new Map(
      neighborhoodGuideCollection.slice(0, 4).map((guide) => [
        guide.neighborhood,
        { path: getGuidePath(guide), label: guide.neighborhood },
      ]),
    ).values(),
  );
  const placeSupportLinks = placePageQuickLinks
    .filter((link) => link.label !== "Editorial standards")
    .slice(0, 6)
    .map((link) => ({ path: link.path, label: link.label }));
  const guideSelectorOptions = [
    {
      id: "start",
      label: "I want the easiest start",
      summary: "One page tells you the best first click.",
      meta: "Best first click",
      tone: "green" as const,
      status: "Start here",
      title: "Open one guide that tells you where to begin",
      copy: "Use this when you do not want to scan a long guide library first.",
      primaryLabel: "Open the start-here guide",
      primaryPath: starterPackGuide ? getGuidePath(starterPackGuide) : "/vancouver/date-night-starters",
      image: siteConfig.media.weekend,
      imageAlt: "Illustrated Vancouver planning scene for the CityAtlas start-here guide",
      supportLinks: situationSupportLinks.slice(0, 2),
    },
    {
      id: "day",
      label: "I know the kind of day",
      summary: "Rainy day, guest day, weekend, or similar.",
      meta: "By situation",
      tone: "blue" as const,
      status: "Guide picker",
      title: "Match the day before you match the place",
      copy:
        "Use this when you already know it is a visitor day, rainy day, weekend plan, or another clear situation.",
      primaryLabel: routeRoundupGuide ? "Browse by situation" : "Open guide choices",
      primaryPath: routeRoundupGuide
        ? getGuidePath(routeRoundupGuide)
        : "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
      image: siteConfig.media.guides,
      imageAlt: "Illustrated Gastown scene for a Vancouver guide situation picker",
      supportLinks: [
        dateAndWeatherGuides[0]
          ? { path: getGuidePath(dateAndWeatherGuides[0]), label: "Date or rainy day" }
          : null,
        firstVisitorGuide ? { path: getGuidePath(firstVisitorGuide), label: "Visitors and hosts" } : null,
        firstWeekendGuide ? { path: getGuidePath(firstWeekendGuide), label: "Weekend and reset" } : null,
      ].filter((link): link is { path: string; label: string } => link !== null),
    },
    {
      id: "plan",
      label: "I want a ready-made plan",
      summary: "The stop order is already handled.",
      meta: "Route ready",
      tone: "amber" as const,
      status: "One route ready",
      title: "Open a ready-made route instead of another long guide list",
      copy:
        "Use this when you want the stop order and timing handled for you instead of choosing between guide types first.",
      primaryLabel: "Open ready-made route",
      primaryPath: heroFeaturedRoutePath,
      image: siteConfig.media.guides,
      imageAlt: "Illustrated route-planning scene for a ready-made Vancouver plan",
      supportLinks: [{ path: "/vancouver/missions", label: "See all ready-made routes" }],
    },
    ...(officialLinkPageCount > 0
      ? [
          {
            id: "places",
            label: "I want real places",
            summary: "Named restaurants, parks, cafes, or venues.",
            meta: "Official-link place pages",
            tone: "green" as const,
            status: "Real places",
            title: "Skip the extra reading and open named Vancouver places",
            copy:
              "Use this when the next step is a restaurant, park, cafe, or venue, not more planning copy.",
            primaryLabel: "Open local places",
            primaryPath: "/vancouver/date-night-starters",
            image: siteConfig.media.city,
            imageAlt: "Illustrated Vancouver waterfront scene for real place pages",
            supportLinks: placeSupportLinks,
          },
        ]
      : []),
    ...(firstNeighborhoodGuide
      ? [
          {
            id: "neighborhood",
            label: "I want a neighborhood",
            summary: "Pick the part of town before the venue.",
            meta: "Part of town first",
            tone: "blue" as const,
            status: "Neighborhood guides",
            title: "Start with the part of Vancouver that fits best",
            copy:
              "Use this when the biggest question is Kitsilano, Gastown, Mount Pleasant, or another area first.",
            primaryLabel: "Open neighborhood guides",
            primaryPath: getGuidePath(firstNeighborhoodGuide),
            image: siteConfig.media.guides,
            imageAlt: "Illustrated Vancouver neighborhood scene for choosing the right area first",
            supportLinks: neighborhoodSupportLinks,
          },
        ]
      : []),
  ];
  const guideDoorOptions = [
    {
      id: "visiting",
      label: "I'm visiting Vancouver",
      path: firstVisitorGuide ? getGuidePath(firstVisitorGuide) : "/vancouver/first-time-visitor-starters",
      image: siteConfig.media.doorFirstVisit,
    },
    {
      id: "local-day",
      label: "I live here - plan my day",
      path: routeRoundupGuide
        ? getGuidePath(routeRoundupGuide)
        : "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
      image: siteConfig.media.doorWeekendPlan,
    },
    {
      id: "one-plan",
      label: "Just show me one good plan",
      path: heroFeaturedRoutePath,
      image: siteConfig.media.doorDateNight,
    },
  ] as const;
  function toggleGuideGroup(title: string) {
    setExpandedGuideGroups((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  return (
    <>
      <section className="guide-door-hero page-top" aria-labelledby="guide-door-title">
        <p className="section-label">Guides</p>
        <h1 id="guide-door-title">What do you need today?</h1>
        <div className="guide-door-grid" aria-label="Choose your Vancouver guide door">
          {guideDoorOptions.map((door) => (
            <AppLink className="guide-door-card" key={door.id} to={door.path}>
              <span className="guide-door-photo" aria-hidden="true">
                <img alt="" decoding="async" loading="lazy" src={door.image} />
              </span>
              <strong>{door.label}</strong>
              <span className="guide-door-go">Go</span>
            </AppLink>
          ))}
        </div>
        <div className="guide-door-underlink">
          <span>Prefer to browse everything?</span>
          <a href="#guide-library-index">Open the full guide list</a>
        </div>
        <div className="guide-door-more-ways" aria-label="More ways to start">
          {guideSelectorOptions.slice(0, 4).map((option) => (
            <AppLink key={option.id} to={option.primaryPath}>
              {option.label}
            </AppLink>
          ))}
        </div>
      </section>

      <section className="section-block" id="guide-library-index">
        <SectionHeader
          label="Optional"
          title="Need more than one choice?"
          copy="Open the full library only if you still want to browse everything or switch cities."
        />
        <div className="guide-library-disclosure-stack">
          <details className="disclosure-card guide-library-disclosure" open>
            <summary className="disclosure-summary">
              <div className="guide-library-disclosure-copy">
                <strong>Browse every Vancouver guide</strong>
                <p>Use the full library only when you already know the shape of the day.</p>
              </div>
              <span className="disclosure-tag">Optional</span>
            </summary>
            <div className="disclosure-body guide-library-disclosure-body">
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
              <AppLink className="text-link" to="/editorial-standards">
                See editorial standards <ArrowRightIcon />
              </AppLink>
            </div>
          </details>

          <article className="source-panel guide-library-alt-city-card">
            <div className="guide-library-side-pills">
              <StatusPill tone="blue">Toronto guides</StatusPill>
            </div>
            <strong>Need Toronto instead?</strong>
            <p>Toronto stays smaller on purpose for one first-visit or weekend decision at a time.</p>
            <div className="guide-selector-support-links">
              <AppLink className="city-search-secondary-link" to="/toronto/guides">
                Toronto guides
              </AppLink>
              <AppLink className="city-search-secondary-link" to="/toronto/first-time-visitor-starters">
                Toronto starting points
              </AppLink>
              <AppLink
                className="city-search-secondary-link"
                to="/toronto/guides/where-should-a-first-time-toronto-visitor-start"
              >
                Toronto destination guide
              </AppLink>
            </div>
          </article>
        </div>
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
  data: CityAtlasData,
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
          detail: formatGuideIndexDetail(data, guide),
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
      detail: formatGuideIndexDetail(data, guide),
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

function formatGuideIndexDetail(data: CityAtlasData, guide: CityAtlasData["guides"][number]) {
  const surfaceState = getGuideSurfaceState(guide, data);
  return `${surfaceState.stateLabel} - ${simplifyGuideCategoryLabel(guide.category)} - ${guide.neighborhood}`;
}
