import { useMemo, useState } from "react";
import type { CityAtlasData, CityMission, Guide } from "../../types";
import { siteConfig } from "../../config/site";
import { AppLink } from "../../components/Link";
import { BusinessCard, EventCard, GuideCard, MissionCard, OfferCard } from "../../components/Cards";
import { ArrowRightIcon, SearchIcon } from "../../components/Icons";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import { getOfferDisplayBusiness } from "../../lib/offers";
import { getSourceBackedPlaces } from "../../lib/sourceBackedCollections";
import { VancouverBusinessCoverageSection } from "./VancouverBusinessCoverageSection";

interface CityPageProps {
  data: CityAtlasData;
  onSaveMission: (mission: CityMission) => void;
}

export function CityPage({ data, onSaveMission }: CityPageProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(data.businesses.map((business) => business.category)))];
  const cityGuides = data.guides.filter(
    (guide) => (guide.citySlug ?? siteConfig.citySlug) === siteConfig.citySlug,
  );
  const neighborhoodGuides = cityGuides.filter((guide) => guide.cluster === "Neighborhoods");
  const neighborhoodStarterGuides = neighborhoodGuides.filter(
    (guide) => guide.category === "Neighborhood Starter",
  );
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
  const sourceBackedPlaceCount =
    sourceBackedDateNightStarters.length +
    sourceBackedRainyDayStarters.length +
    sourceBackedFirstEveningStarters.length +
    sourceBackedFirstTimeVisitorStarters.length +
    sourceBackedGardenDayStarters.length +
    sourceBackedKitsilanoScenicStarters.length +
    sourceBackedWestSideDaytimeStarters.length +
    sourceBackedFalseCreekCultureStarters.length +
    sourceBackedUbcDiscoveryStarters.length +
    sourceBackedReturningVisitorStarters.length +
    sourceBackedOutOfTownGuestStarters.length +
    sourceBackedWeekendRouteStarters.length +
    sourceBackedSundayStarters.length +
    sourceBackedWellnessResetStarters.length;
  const cityHeroQuickStarts = [
    {
      label: "Date night",
      detail: "Dinner-first starts for a compact evening",
      to: "/vancouver/date-night-starters",
    },
    {
      label: "First visit",
      detail: "Downtown, scenic, or west-side first stop",
      to: "/vancouver/first-time-visitor-starters",
    },
    {
      label: "Weekend plan",
      detail: "One easy shape without crossing the city",
      to: "/vancouver/weekend-route-starters",
    },
    {
      label: "Rainy day",
      detail: "Indoor-friendly Vancouver starters",
      to: "/vancouver/rainy-day-starters",
    },
    {
      label: "Kitsilano",
      detail: "Slower waterfront and west-side flow",
      to: "/vancouver/kitsilano-scenic-starters",
    },
    {
      label: "Hosting guests",
      detail: "Easy crowd-pleasing path for visitors",
      to: "/vancouver/out-of-town-guest-starters",
    },
    {
      label: "Wellness reset",
      detail: "Lower-key recovery and reset plans",
      to: "/vancouver/wellness-reset-starters",
    },
  ];
  const neighborhoodGuideCount =
    (neighborhoodStarterGuides.length > 0 ? neighborhoodStarterGuides : neighborhoodGuides).slice(
      0,
      4,
    ).length;
  const cityHeroSignals = [
    {
      title: "Choose the area before the exact place",
      copy:
        "Use the guides to choose the right part of Vancouver first, then open a local place once the day narrows.",
      wide: true,
    },
    {
      title: `${sourceBackedPlaceCount} places with official links`,
      copy: "Real Vancouver places with official links and a public correction path.",
    },
    {
      title: neighborhoodGuideCount > 0 ? `${neighborhoodGuideCount} neighborhood guides` : "Neighborhood-first",
      copy:
        neighborhoodGuideCount > 0
          ? "Gastown, Mount Pleasant, Kitsilano, and similar pages help narrow the city faster."
          : "Choose the right part of Vancouver before comparing individual stops.",
    },
  ];
  const placePageIndexLinks = [
    {
      path: "/vancouver/date-night-starters",
      label: "Date night",
      detail: "Real evening anchors with official site links.",
    },
    {
      path: "/vancouver/rainy-day-starters",
      label: "Rainy day",
      detail: "Indoor-friendly Vancouver starts for weather shifts.",
    },
    {
      path: "/vancouver/first-evening-starters",
      label: "First evening",
      detail: "Short first-night options for visitors or guests.",
    },
    {
      path: "/vancouver/first-time-visitor-starters",
      label: "First visit",
      detail: "Choose the best first impression before building the day.",
    },
    {
      path: "/vancouver/kitsilano-scenic-starters",
      label: "Kitsilano",
      detail: "Waterfront and west-side starts for a slower pace.",
    },
    {
      path: "/vancouver/weekend-route-starters",
      label: "Weekend plan",
      detail: "Compact weekend starts without crossing the city all day.",
    },
    {
      path: "/vancouver/out-of-town-guest-starters",
      label: "Hosting guests",
      detail: "Easy crowd-pleasing starts for visiting friends or family.",
    },
    {
      path: "/vancouver/wellness-reset-starters",
      label: "Wellness reset",
      detail: "Recovery-minded starts for calmer Vancouver days.",
    },
    {
      path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
      label: "Starter guide",
      detail: "Open this when you still need help choosing the first page.",
    },
  ];
  const featuredPlacePageIndexLinks = placePageIndexLinks.slice(0, 6);
  const featuredGuideSlugs = [
    "where-should-a-first-time-vancouver-visitor-start",
    "mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
    "where-should-you-start-a-vancouver-garden-and-conservatory-day",
    "where-should-you-start-a-false-creek-vancouver-culture-afternoon",
  ];
  const featuredCityGuides = [
    ...featuredGuideSlugs
      .map((slug) => cityGuides.find((guide) => guide.slug === slug))
      .filter((guide): guide is Guide => Boolean(guide)),
    ...cityGuides.filter((guide) => !featuredGuideSlugs.includes(guide.slug)),
  ].slice(0, 4);
  const featuredEvents = data.events.slice(0, 2);
  const featuredOffers = data.offers.slice(0, 2);
  const featuredMissions = data.cityMissions.slice(0, 2);

  const businesses = useMemo(() => {
    return data.businesses.filter((business) => {
      const haystack = [
        business.name,
        business.category,
        business.neighborhood,
        business.shortDescription,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesCategory = category === "All" || business.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, data.businesses, query]);

  return (
    <>
      <section className="city-hero city-hero-explore">
        <div className="city-hero-copy">
          <p className="section-label">{siteConfig.city}</p>
          <h1>Find the right Vancouver start first</h1>
          <p>
            Start here when you know the kind of day you want, but not the exact place yet.
            CityAtlas helps you choose the right area, guide, or local place before the tab
            pile gets noisy.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/guides">
              Open Vancouver guides
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
            >
              Open the start-here guide
            </AppLink>
          </div>
          <div className="city-hero-support-grid">
            {cityHeroSignals.map((item) => (
              <article
                className={item.wide ? "city-hero-support-card wide" : "city-hero-support-card"}
                key={item.title}
              >
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="starter-hero-side city-hero-side">
          <HeroMediaCard
            image={siteConfig.media.city}
            alt="Illustrated shoreline scene inspired by English Bay Beach in Vancouver"
            eyebrow="Start with Vancouver"
            title="Choose the right part of the city before the options pile up"
            copy="Start with the area, weather, or visitor pace first. Then open the exact place once the day feels narrower."
            className="hero-media-compact"
          />
          <aside className="city-search-card">
            <div className="city-search-header">
              <div>
                <strong>Search places or jump straight into a strong starting page</strong>
                <p>Search the current place list, or open the page that already fits the day.</p>
              </div>
              <StatusPill tone="blue">{sourceBackedPlaceCount} places with official links</StatusPill>
            </div>
            <div className="city-search-panel">
              <SearchIcon />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search cafes, services, wellness, date night..."
                aria-label="Search CityAtlas"
              />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label="Filter category"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="city-search-secondary">
              <p className="city-search-secondary-label">Strong starting pages</p>
              <div className="city-search-secondary-links">
                {cityHeroQuickStarts.map((item) => (
                  <AppLink
                    className="city-search-secondary-link city-search-quick-link"
                    key={item.to}
                    to={item.to}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </AppLink>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {neighborhoodGuides.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Neighborhood starting points"
            title="Choose the right area before you browse places"
            copy="CityAtlas works best when it helps someone choose the right part of Vancouver first, then decide what kind of plan belongs there. The current trio covers Gastown, Mount Pleasant, and Kitsilano."
            action={<StatusPill tone="blue">Neighborhood guides</StatusPill>}
          />
          <div className="card-grid two">
            {(neighborhoodStarterGuides.length > 0 ? neighborhoodStarterGuides : neighborhoodGuides)
              .slice(0, 4)
              .map((guide) => (
              <GuideCard guide={guide} key={guide.id} />
            ))}
          </div>
        </section>
      ) : null}

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
        <section className="split-section">
          <div className="source-panel">
            <SectionHeader
              label="Local places ready now"
              title="Open the local places that are ready now"
              copy="Start with the strongest local places here, then open a guide only if the day still needs more."
              action={<StatusPill tone="green">{sourceBackedPlaceCount} places with official links</StatusPill>}
            />
          </div>
          <div className="source-panel">
            <p>
              These pages stay focused on purpose. They link straight to official venue sources,
              explain what kind of plan each place fits, and make it easy to report a mistake when
              needed.
            </p>
            <div className="guide-index-grid">
              {featuredPlacePageIndexLinks.map((item) => (
                <AppLink className="guide-index-card" key={item.path} to={item.path}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </AppLink>
              ))}
            </div>
            <div className="tag-cloud place-page-tag-cloud">
              <AppLink
                className="button primary"
                to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
              >
                Browse by situation
              </AppLink>
              <AppLink
                className="button secondary"
                to="/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today"
              >
                Easier-day guide
              </AppLink>
              <AppLink className="button secondary" to="/editorial-standards">
                Editorial standards
              </AppLink>
            </div>
          </div>
        </section>
      ) : null}

      <VancouverBusinessCoverageSection variant="city" />

      <section className="section-block">
        <SectionHeader
          title="Source-backed Vancouver business pages"
          copy={`${businesses.length} Vancouver business pages now use real venue names, actual venue photos, and the official path to re-check details before you visit.`}
          action={<StatusPill tone="green">Source-backed pages</StatusPill>}
        />
        <div className="card-grid three">
          {businesses.map((business) => (
            <BusinessCard business={business} key={business.id} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          title="Saved plans worth reopening"
          copy="Short saveable plans help CityAtlas move from browsing into a clearer next step."
          action={<AppLink className="text-link" to="/vancouver/missions">View all saved plans <ArrowRightIcon /></AppLink>}
        />
        <div className="card-grid three">
          {featuredMissions.map((mission) => (
            <MissionCard
              mission={mission}
              savedItems={data.savedItems}
              onSaveMission={onSaveMission}
              key={mission.id}
            />
          ))}
        </div>
      </section>

      <section className="split-section">
        <div>
          <SectionHeader
            title="Events"
            copy="These event cards stay easy to scan. Open the full events page when the day needs timing-based options."
            action={<AppLink className="text-link" to="/vancouver/events">See all events <ArrowRightIcon /></AppLink>}
          />
          <div className="stacked-list">
            {featuredEvents.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            title="Offer ideas"
            copy="These offer ideas show how a simple local offer can read once timing and redemption rules are clear."
            action={<AppLink className="text-link" to="/vancouver/offers">See all offers <ArrowRightIcon /></AppLink>}
          />
          <div className="stacked-list">
            {featuredOffers.map((offer) => (
              <OfferCard
                offer={offer}
                business={getOfferDisplayBusiness(offer, data.businesses)}
                key={offer.id}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          title="More Vancouver guides"
          copy="Guide pages connect city questions to neighborhood choice, planning context, and clearer next steps."
          action={<AppLink className="text-link" to="/vancouver/guides">Open all guides <ArrowRightIcon /></AppLink>}
        />
        <div className="card-grid two">
          {featuredCityGuides.map((guide) => (
            <GuideCard guide={guide} key={guide.id} />
          ))}
        </div>
      </section>
    </>
  );
}
