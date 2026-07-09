import { useMemo, useState } from "react";
import type { CityAtlasData, CityMission, Guide } from "../../types";
import { siteConfig } from "../../config/site";
import { AppLink } from "../../components/Link";
import { BusinessCard, EventCard, GuideCard, MissionCard, OfferCard } from "../../components/Cards";
import { ArrowRightIcon, SearchIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { getOfferDisplayBusiness } from "../../lib/offers";
import { simplifyBusinessDisplayText } from "../../lib/publicCopy";
import { getSourceBackedPlaces } from "../../lib/sourceBackedCollections";
import { VancouverBusinessCoverageSection } from "./VancouverBusinessCoverageSection";

interface CityPageProps {
  data: CityAtlasData;
  onSaveMission: (mission: CityMission) => void;
}

interface CityPickerResult {
  id: string;
  title: string;
  detail: string;
  path: string;
  image: string;
  imageAlt: string;
  ctaLabel?: string;
}

interface CityPickerChoice {
  id: string;
  label: string;
  kicker: string;
  primaryPath: string;
  mockupCardImage?: string;
  cards: CityPickerResult[];
}

const cityPickerChoices: CityPickerChoice[] = [
  {
    id: "first-visit",
    label: "First visit",
    kicker: "Best first impression",
    primaryPath: "/vancouver/first-time-visitor-starters",
    mockupCardImage: siteConfig.media.doorFirstVisit,
    cards: [
      {
        id: "first-visit-starters",
        title: "First-visit starters",
        detail: "Open the strongest first-impression Vancouver starts before narrowing further.",
        path: "/vancouver/first-time-visitor-starters",
        image: siteConfig.media.city,
        imageAlt: "Vancouver shoreline scene for first-visit starters",
      },
      {
        id: "first-visit-guide",
        title: "First-visit guide",
        detail: "Use this when the real question is where a first-time visitor should begin.",
        path: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
        image: siteConfig.media.guides,
        imageAlt: "Downtown Vancouver scene for the first-visit guide",
      },
      {
        id: "first-visit-starter-pack",
        title: "Start-here guide",
        detail: "Best when you want CityAtlas to route the whole day into the right page first.",
        path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
        image: siteConfig.media.weekend,
        imageAlt: "Vancouver start-here planning scene",
      },
    ],
  },
  {
    id: "date-night",
    label: "Date night",
    kicker: "Tonight and low guesswork",
    primaryPath: "/vancouver/date-night-starters",
    mockupCardImage: siteConfig.media.doorDateNight,
    cards: [
      {
        id: "date-night-starters",
        title: "Date-night starters",
        detail: "Open real Vancouver evening starts with official-source notes first.",
        path: "/vancouver/date-night-starters",
        image: siteConfig.media.hero,
        imageAlt: "Vancouver evening market scene for date-night starters",
      },
      {
        id: "date-night-guide",
        title: "Compact evening guide",
        detail: "Pick one neighborhood, one dinner anchor, and one easy second stop.",
        path: "/vancouver/guides/how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice",
        image: siteConfig.media.guides,
        imageAlt: "Gastown evening scene for the compact evening guide",
      },
      {
        id: "date-night-neighborhoods",
        title: "Neighborhood chooser",
        detail: "Use this when the first question is still Gastown, Mount Pleasant, or Kitsilano.",
        path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
        image: siteConfig.media.waterfront,
        imageAlt: "Waterfront scene for the Vancouver neighborhood chooser",
      },
    ],
  },
  {
    id: "rainy-day",
    label: "Rainy day",
    kicker: "Indoor-first options",
    primaryPath: "/vancouver/rainy-day-starters",
    mockupCardImage: siteConfig.media.doorRainyDay,
    cards: [
      {
        id: "rainy-day-starters",
        title: "Rainy-day starters",
        detail: "Start with the strongest indoor-first Vancouver anchors and backups.",
        path: "/vancouver/rainy-day-starters",
        image: siteConfig.media.guides,
        imageAlt: "Gastown rainy-day scene for Vancouver indoor-first starters",
      },
      {
        id: "rainy-day-guide",
        title: "Rainy-day guide",
        detail: "Build one warm anchor, one short reset, and one believable fallback.",
        path: "/vancouver/guides/rainy-day-vancouver-plan-coffee-walk-and-reset",
        image: siteConfig.media.city,
        imageAlt: "Waterfront city scene for the Vancouver rainy-day guide",
      },
      {
        id: "rainy-day-low-friction",
        title: "Low-friction chooser",
        detail: "Use this when the day needs the easiest page, not the fullest plan.",
        path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
        image: siteConfig.media.lowEffort,
        imageAlt: "Calmer Vancouver shoreline scene for the low-friction chooser",
      },
    ],
  },
  {
    id: "weekend-plan",
    label: "Weekend plan",
    kicker: "Compact and easy",
    primaryPath: "/vancouver/weekend-route-starters",
    mockupCardImage: siteConfig.media.doorWeekendPlan,
    cards: [
      {
        id: "weekend-plan-starters",
        title: "Weekend starters",
        detail: "Start with the strongest compact route before comparing individual stops.",
        path: "/vancouver/weekend-route-starters",
        image: siteConfig.media.weekend,
        imageAlt: "Vancouver weekend route scene for weekend starters",
      },
      {
        id: "weekend-plan-guide",
        title: "Starter guide",
        detail: "Use this when the day still needs a cleaner route into the right first page.",
        path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
        image: siteConfig.media.city,
        imageAlt: "Vancouver planning scene for the starter guide",
      },
      {
        id: "weekend-plan-roundup",
        title: "Guide roundup",
        detail: "Open the roundup when the best route still depends on the exact situation.",
        path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
        image: siteConfig.media.guides,
        imageAlt: "Route planning scene for the CityAtlas guide roundup",
      },
    ],
  },
  {
    id: "hosting-guests",
    label: "Hosting guests",
    kicker: "Crowd-pleasing start",
    primaryPath: "/vancouver/out-of-town-guest-starters",
    mockupCardImage: siteConfig.media.doorHostingGuests,
    cards: [
      {
        id: "hosting-guests-starters",
        title: "Hosting-guests starters",
        detail: "Open crowd-pleasing Vancouver starts that work for more than one person.",
        path: "/vancouver/out-of-town-guest-starters",
        image: siteConfig.media.hostingGuests,
        imageAlt: "Vancouver harbour scene for hosting guests starters",
      },
      {
        id: "hosting-guests-guide",
        title: "Host guide",
        detail: "Use this when the goal is one easy Vancouver win for visiting friends or family.",
        path: "/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver",
        image: siteConfig.media.city,
        imageAlt: "Waterfront scene for the Vancouver host guide",
      },
      {
        id: "hosting-guests-roundup",
        title: "Guide roundup",
        detail: "Open this when the guest plan still needs the cleanest route by situation.",
        path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
        image: siteConfig.media.weekend,
        imageAlt: "Route planning scene for the CityAtlas guide roundup",
      },
    ],
  },
];

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
  const neighborhoodGuideCount =
    (neighborhoodStarterGuides.length > 0 ? neighborhoodStarterGuides : neighborhoodGuides).slice(
      0,
      4,
    ).length;
  const placePageIndexLinks = [
    {
      path: "/vancouver/date-night-starters",
      label: "Date night",
      detail: "Real evening spots with official site links.",
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
      path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
      label: "Low-effort day",
      detail: "Use the easier-day chooser when energy and friction matter most.",
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
        simplifyBusinessDisplayText(business.shortDescription),
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
      <section className="city-hero city-hero-doors">
        <div className="city-hero-copy city-hero-copy-wide city-hero-copy-doors">
          <p className="section-label">{siteConfig.city}</p>
          <h1>What kind of day is it?</h1>
          <p>
            Tap one. We&apos;ll open the right Vancouver page.
          </p>
        </div>
        <div className="city-door-grid" role="list" aria-label="Choose the kind of Vancouver day">
          {cityPickerChoices.map((choice) => {
            const leadCard = choice.cards[0] ?? choice.cards[choice.cards.length - 1];
            return (
              <AppLink
                aria-label={`Open the ${choice.label.toLowerCase()} Vancouver page`}
                className="city-door-card"
                key={choice.id}
                to={choice.primaryPath}
              >
                <div className="city-door-card-media">
                  <img
                    alt={leadCard?.imageAlt ?? `${choice.label} Vancouver starter`}
                    decoding="async"
                    loading="lazy"
                    src={choice.mockupCardImage ?? leadCard?.image ?? siteConfig.media.city}
                  />
                </div>
                <div className="city-door-card-copy">
                  <strong>{choice.label}</strong>
                  <small>
                    <ArrowRightIcon />
                  </small>
                </div>
              </AppLink>
            );
          })}
        </div>
      </section>

      <section className="split-section city-search-split-section">
        <div className="source-panel city-search-support-panel">
          <SectionHeader
            label="Already know the place?"
            title="Search the business pages directly"
            copy="Use search when you already know the kind of place you want. If you do not, the giant doors above are the easier place to begin."
            action={<StatusPill tone="green">{businesses.length} matches below</StatusPill>}
          />
          <div className="city-search-panel city-search-panel-surface">
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
          <p className="city-search-note city-search-note-surface">
            This filters the business page list below without taking you away from the city page.
          </p>
        </div>
        <div className="source-panel city-search-support-panel">
          <SectionHeader
            label="Need broader help?"
            title="Open one guide only when the day still feels unclear"
            copy="These are the two best backup doors after the big first choice."
          />
          <div className="city-search-secondary">
            <div className="city-search-secondary-links">
              <AppLink
                className="city-search-secondary-link"
                to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
              >
                <strong>Open the start-here guide</strong>
                <span>Use one guide when the day still needs the cleanest first page.</span>
              </AppLink>
              <AppLink className="city-search-secondary-link" to="/vancouver/guides">
                <strong>See all Vancouver guides</strong>
                <span>Browse the full guide shelf only after the day is narrower.</span>
              </AppLink>
            </div>
          </div>
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
              <GuideCard data={data} guide={guide} key={guide.id} />
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
              explain what kind of day each place fits, and make it easy to report a mistake when
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
            <div className="place-page-support-links">
              <AppLink
                className="button primary"
                to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
              >
                Browse by situation
              </AppLink>
              <AppLink className="text-link" to="/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today">
                Easier-day guide <ArrowRightIcon />
              </AppLink>
              <AppLink className="text-link" to="/editorial-standards">
                How corrections work <ArrowRightIcon />
              </AppLink>
            </div>
          </div>
        </section>
      ) : null}

      <VancouverBusinessCoverageSection variant="city" />

      <section className="section-block">
        <SectionHeader
          title="Vancouver business pages with official links"
          copy={`${businesses.length} Vancouver business pages now use real venue names, actual venue photos, and the official path to re-check details before you visit.`}
          action={<StatusPill tone="green">Official link pages</StatusPill>}
        />
        {businesses.length > 0 ? (
          <div className="card-grid three">
            {businesses.map((business) => (
              <BusinessCard business={business} key={business.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>No business page matches this search yet</strong>
            <p>Try a broader word, or switch the category back to All for a wider list below.</p>
          </div>
        )}
      </section>

      <section className="section-block">
        <SectionHeader
          title="Ready-made routes worth trying"
          copy="Short route ideas help CityAtlas move from browsing into one clear next step."
          action={<AppLink className="text-link" to="/vancouver/missions">View ready-made routes <ArrowRightIcon /></AppLink>}
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
            <GuideCard data={data} guide={guide} key={guide.id} />
          ))}
        </div>
      </section>
    </>
  );
}
