import { useEffect, useMemo, useState } from "react";
import type { CityAtlasData, CityMission, NewsletterLead } from "../../types";
import { siteConfig } from "../../config/site";
import {
  getActiveVariant,
  getNextBestAction,
  variantCopy,
} from "../../lib/experiments";
import { getGuidePath } from "../../lib/cityPaths";
import { buildPublicBusinessCoverageSnapshot } from "../../lib/publicBusinessCoverage";
import { AppLink } from "../../components/Link";
import {
  ArrowRightIcon,
  SearchIcon,
  ShieldIcon,
  SparkIcon,
} from "../../components/Icons";
import {
  BusinessCard,
  EventCard,
  GuideCard,
  MissionCard,
  OfferCard,
  TrustCard,
} from "../../components/Cards";
import {
  MetricCard,
  SafeModeNotice,
  SectionHeader,
  StatusPill,
} from "../../components/UI";
import { getSourceBackedPlaces } from "../../lib/sourceBackedCollections";
import { navigate } from "../../app/router";
import { VancouverBusinessCoverageSection } from "./VancouverBusinessCoverageSection";

interface HomePageProps {
  data: CityAtlasData;
  onNewsletter: (email: string, interest: NewsletterLead["interest"]) => NewsletterLead;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
  onSaveMission: (mission: CityMission) => void;
}

type HomeSearchKind = "guide" | "business" | "event" | "offer";

interface HomeSearchResult {
  id: string;
  kind: HomeSearchKind;
  label: string;
  detail: string;
  path: string;
  haystack: string;
}

const heroMapStops = [
  {
    id: "gastown",
    label: "Gastown",
    caption: "Old-core dinner and evening plans",
    path: "/vancouver/guides/gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact",
  },
  {
    id: "kits",
    label: "Kitsilano",
    caption: "Beach, flow, and slower west-side plans",
    path: "/vancouver/kitsilano-scenic-starters",
  },
  {
    id: "mount-pleasant",
    label: "Mount Pleasant",
    caption: "Coffee, flexible nights, and local wandering",
    path: "/vancouver/guides/mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
  },
  {
    id: "false-creek",
    label: "False Creek",
    caption: "Museums, culture, and shoreline routes",
    path: "/vancouver/false-creek-culture-starters",
  },
  {
    id: "ubc",
    label: "UBC and Point Grey",
    caption: "Gardens, campus stops, and scenic daytime picks",
    path: "/vancouver/ubc-discovery-starters",
  },
] as const;

const heroSearchSuggestions = [
  { label: "Rainy day", value: "rainy day" },
  { label: "Kits Beach", value: "kits beach" },
  { label: "First evening", value: "first evening" },
  { label: "Coffee", value: "coffee" },
  { label: "Weekend route", value: "weekend route" },
] as const;

const homeResultKindLabels: Record<HomeSearchKind, string> = {
  guide: "Guide",
  business: "Place",
  event: "Event",
  offer: "Offer",
};

const trustedStartingPointLinks = [
  { path: "/vancouver/date-night-starters", label: "Date night" },
  { path: "/vancouver/rainy-day-starters", label: "Rainy day" },
  { path: "/vancouver/first-evening-starters", label: "First evening" },
  { path: "/vancouver/first-time-visitor-starters", label: "First visit" },
  { path: "/vancouver/garden-day-starters", label: "Garden day" },
  { path: "/vancouver/kitsilano-scenic-starters", label: "Kitsilano" },
  { path: "/vancouver/west-side-daytime-starters", label: "West-side day" },
  { path: "/vancouver/false-creek-culture-starters", label: "False Creek" },
  { path: "/vancouver/ubc-discovery-starters", label: "UBC day" },
  { path: "/vancouver/returning-visitor-starters", label: "Returning visit" },
  { path: "/vancouver/out-of-town-guest-starters", label: "Hosting guests" },
  { path: "/vancouver/weekend-route-starters", label: "Weekend route" },
  { path: "/vancouver/sunday-starters", label: "Sunday plan" },
  { path: "/vancouver/wellness-reset-starters", label: "Wellness reset" },
] as const;

const homePlanningLanes = [
  {
    title: "Date night",
    description: "Choose a smoother neighborhood or route before the night turns into too many tabs.",
  },
  {
    title: "Rainy day",
    description: "Open calmer indoor ideas fast when the weather changes the plan.",
  },
  {
    title: "First visit",
    description: "Start with the part of Vancouver that gives the right first impression.",
  },
  {
    title: "Weekend route",
    description: "Keep the day compact instead of bouncing across the city for one plan.",
  },
  {
    title: "Work-friendly cafes",
    description: "Find a better coffee-and-laptop fit without guessing from generic list posts.",
  },
  {
    title: "Wellness reset",
    description: "Choose a lower-friction recovery or slower-day plan without the hype layer.",
  },
] as const;

const whyCityAtlasFeelsEasier = [
  "It starts with the real decision: where to begin, not which place looks loudest.",
  "Search, route chips, and area links all lead into the same guide library.",
  "Official-link pages stay separate from broader guide pages so trust is easier to read.",
  "Saved plans turn a good city idea into something you can come back to later.",
] as const;

export function HomePage({ data, onNewsletter, onTrack, onSaveMission }: HomePageProps) {
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [heroQuery, setHeroQuery] = useState("");
  const activeVariant = getActiveVariant();
  const copy = variantCopy[activeVariant];
  const nextBestAction = getNextBestAction(data);
  const featuredBusinesses = data.businesses.filter((business) => business.featured).slice(0, 3);
  const featuredMissions = data.cityMissions.filter((mission) => mission.featured);
  const cityGuides = data.guides.filter(
    (guide) => (guide.citySlug ?? siteConfig.citySlug) === siteConfig.citySlug,
  );
  const neighborhoodGuides = cityGuides.filter((guide) => guide.cluster === "Neighborhoods");
  const neighborhoodStarterGuides = neighborhoodGuides.filter(
    (guide) => guide.category === "Neighborhood Starter",
  );
  const featuredDateNightSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_date_night_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredRainyDaySourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_rainy_day_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredFirstEveningSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_first_evening_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredFirstTimeVisitorSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_first_time_visitor_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredGardenDaySourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_garden_day_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredKitsilanoScenicSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_kitsilano_scenic_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredWestSideDaytimeSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_west_side_daytime_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredFalseCreekCultureSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_false_creek_culture_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredUbcDiscoverySourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_ubc_discovery_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredReturningVisitorSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_returning_visitor_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredOutOfTownGuestSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_out_of_town_guest_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredWeekendRouteSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_weekend_route_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredSundaySourceBackedPlaces = getSourceBackedPlaces(data, "vancouver_sunday_starters")
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredWellnessResetSourceBackedPlaces = getSourceBackedPlaces(
    data,
    "vancouver_wellness_reset_starters",
  )
    .filter((reference) => reference.featured)
    .slice(0, 4);
  const featuredSourceBackedCollections = [
    featuredDateNightSourceBackedPlaces,
    featuredRainyDaySourceBackedPlaces,
    featuredFirstEveningSourceBackedPlaces,
    featuredFirstTimeVisitorSourceBackedPlaces,
    featuredGardenDaySourceBackedPlaces,
    featuredKitsilanoScenicSourceBackedPlaces,
    featuredWestSideDaytimeSourceBackedPlaces,
    featuredFalseCreekCultureSourceBackedPlaces,
    featuredUbcDiscoverySourceBackedPlaces,
    featuredReturningVisitorSourceBackedPlaces,
    featuredOutOfTownGuestSourceBackedPlaces,
    featuredWeekendRouteSourceBackedPlaces,
    featuredSundaySourceBackedPlaces,
    featuredWellnessResetSourceBackedPlaces,
  ];
  const featuredSourceBackedPlaces = featuredSourceBackedCollections.flat();
  const featuredSourceBackedNames = Array.from(
    new Set(featuredSourceBackedPlaces.map((reference) => reference.name)),
  ).slice(0, 12);
  const sourceBackedWedgeCount = featuredSourceBackedCollections.filter(
    (collection) => collection.length > 0,
  ).length;
  const businessCoverage = buildPublicBusinessCoverageSnapshot(data);
  const homeSearchResults = useMemo(() => {
    const guideResults: HomeSearchResult[] = cityGuides.map((guide) => ({
      id: `guide-${guide.id}`,
      kind: "guide",
      label: guide.title,
      detail: guide.summary,
      path: getGuidePath(guide),
      haystack: [guide.title, guide.summary, guide.queryClass, guide.category, guide.neighborhood]
        .join(" ")
        .toLowerCase(),
    }));
    const businessResults: HomeSearchResult[] = data.businesses.map((business) => ({
      id: `business-${business.id}`,
      kind: "business",
      label: business.name,
      detail: `${business.category} in ${business.neighborhood}`,
      path: `/${siteConfig.citySlug}/businesses/${business.slug}`,
      haystack: [
        business.name,
        business.category,
        business.neighborhood,
        business.shortDescription,
      ]
        .join(" ")
        .toLowerCase(),
    }));
    const eventResults: HomeSearchResult[] = data.events.map((event) => ({
      id: `event-${event.id}`,
      kind: "event",
      label: event.title,
      detail: `${event.neighborhood} event`,
      path: `/${siteConfig.citySlug}/events`,
      haystack: [event.title, event.category, event.neighborhood, event.description]
        .join(" ")
        .toLowerCase(),
    }));
    const offerResults: HomeSearchResult[] = data.offers.map((offer) => {
      const business = data.businesses.find((item) => item.id === offer.businessId);
      return {
        id: `offer-${offer.id}`,
        kind: "offer" as const,
        label: offer.title,
        detail: business ? `${business.name} offer` : "Local offer",
        path: `/${siteConfig.citySlug}/offers`,
        haystack: [offer.title, offer.description, business?.name ?? ""].join(" ").toLowerCase(),
      };
    });

    return [...guideResults, ...businessResults, ...eventResults, ...offerResults];
  }, [cityGuides, data.businesses, data.events, data.offers]);
  const filteredHomeResults = useMemo(() => {
    const query = heroQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }

    const queryTerms = query.split(/\s+/).filter(Boolean);
    return homeSearchResults
      .map((result) => {
        const haystack = result.haystack;
        const exactMatch = haystack.includes(query) ? 5 : 0;
        const termScore = queryTerms.reduce(
          (score, term) => score + (haystack.includes(term) ? 1 : 0),
          0,
        );

        return {
          ...result,
          score: exactMatch + termScore,
        };
      })
      .filter((result) => result.score > 0)
      .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
      .slice(0, 3);
  }, [heroQuery, homeSearchResults]);

  useEffect(() => {
    onTrack("experiment_exposed", { experiment: "homepage_positioning", variant: activeVariant });
  }, [activeVariant, onTrack]);

  return (
    <>
      <section className="hero-grid">
        <div className="hero-media">
          <img src={siteConfig.media.hero} alt="Vancouver evening market scene" />
          <div className="hero-copy">
            <p className="hero-kicker">Vancouver city guide</p>
            <h1>{copy.heroTitle}</h1>
            <p>{copy.heroCopy}</p>
            <div className="hero-actions">
              <AppLink
                className="button primary"
                to={activeVariant === "weekend-atlas" ? "/planner" : "/vancouver"}
              >
                {copy.primaryCta}
                <ArrowRightIcon />
              </AppLink>
              <AppLink className="button secondary" to="/for-businesses/pricing">
                For businesses
              </AppLink>
            </div>
            <div className="hero-quick-picks" aria-label="Popular planning shortcuts">
              <AppLink className="hero-quick-pick" to="/vancouver/rainy-day-starters">
                Rainy day plan
              </AppLink>
              <AppLink className="hero-quick-pick" to="/vancouver/first-time-visitor-starters">
                First visit
              </AppLink>
              <AppLink className="hero-quick-pick" to="/vancouver/kitsilano-scenic-starters">
                Kitsilano
              </AppLink>
            </div>
          </div>
        </div>

        <div className="hero-side-column">
          <div className="hero-map-panel">
            <div className="map-toolbar">
              <strong>Choose a Vancouver area</strong>
              <StatusPill tone="blue">Clickable</StatusPill>
            </div>
            <p className="hero-panel-copy">
              Click a neighborhood lane and CityAtlas will open the guide or starting page that fits.
            </p>
            <div className="atlas-map" aria-label="Clickable Vancouver route map">
              <svg className="atlas-map-art" viewBox="0 0 520 320" aria-hidden="true">
                <defs>
                  <linearGradient id="atlas-water" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#f4fbff" />
                    <stop offset="100%" stopColor="#d9eef8" />
                  </linearGradient>
                  <linearGradient id="atlas-land" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#fbfdff" />
                    <stop offset="100%" stopColor="#eef5ef" />
                  </linearGradient>
                </defs>
                <rect width="520" height="320" rx="24" fill="url(#atlas-water)" />
                <path
                  className="atlas-map-land"
                  d="M44 64C84 44 136 44 172 66C208 88 250 112 292 108C333 104 370 72 416 71C448 70 478 87 500 113V320H30V106C32 92 35 76 44 64Z"
                  fill="url(#atlas-land)"
                />
                <path
                  className="atlas-map-waterway"
                  d="M0 116C76 103 138 111 203 145C258 173 309 180 375 166C426 154 468 127 520 118"
                />
                <path
                  className="atlas-map-waterway"
                  d="M108 236C153 219 207 219 258 231C321 246 379 247 452 227"
                />
                <path
                  className="atlas-map-route"
                  d="M92 94C146 109 183 137 223 174C255 203 292 212 342 201C385 191 427 163 455 128"
                />
                <path
                  className="atlas-map-route alt"
                  d="M116 244C181 221 231 215 285 225C330 233 370 226 429 190"
                />
                <text className="atlas-map-label" x="64" y="86">
                  Burrard Inlet
                </text>
                <text className="atlas-map-label" x="320" y="256">
                  False Creek
                </text>
                <text className="atlas-map-label atlas-map-label-land" x="370" y="78">
                  West Side
                </text>
              </svg>
              {heroMapStops.map((stop) => (
                <AppLink className={`map-stop map-stop-${stop.id}`} key={stop.id} to={stop.path}>
                  <span className="map-stop-dot" />
                  <strong>{stop.label}</strong>
                  <small>{stop.caption}</small>
                </AppLink>
              ))}
            </div>
            <div className="hero-map-list">
              {heroMapStops.map((stop) => (
                <AppLink className="hero-map-link" key={stop.id} to={stop.path}>
                  <strong>{stop.label}</strong>
                  <span>{stop.caption}</span>
                </AppLink>
              ))}
            </div>
            <div className="hero-search-stack">
              <div className="hero-search-intro">
                <strong>Search by mood, place, or occasion</strong>
                <StatusPill tone="green">Live search</StatusPill>
              </div>
              <p className="hero-search-copy">Type one need and open the closest match.</p>
              <form
                className="hero-search-form"
                onSubmit={(event) => {
                  event.preventDefault();

                  const firstResult = filteredHomeResults[0];
                  if (firstResult) {
                    navigate(firstResult.path);
                    return;
                  }

                  navigate(heroQuery.trim() ? `/${siteConfig.citySlug}/guides` : `/${siteConfig.citySlug}`);
                }}
              >
                <SearchIcon />
                <input
                  aria-label="Search CityAtlas"
                  onChange={(event) => setHeroQuery(event.target.value)}
                  placeholder="Try rainy day, Kits Beach, coffee, or first evening"
                  type="search"
                  value={heroQuery}
                />
                <button className="button primary hero-search-submit" type="submit">
                  Open match
                </button>
              </form>
              {filteredHomeResults.length > 0 ? (
                <div className="hero-search-results">
                  {filteredHomeResults.map((result) => (
                    <AppLink className="hero-search-result" key={result.id} to={result.path}>
                      <strong>{result.label}</strong>
                      <span>{`${homeResultKindLabels[result.kind]} | ${result.detail}`}</span>
                    </AppLink>
                  ))}
                </div>
              ) : (
                <div className="hero-search-empty">
                  <p>Popular starting points</p>
                  <div className="hero-search-suggestions">
                    {heroSearchSuggestions.map((suggestion) => (
                      <button
                        className="hero-search-suggestion"
                        key={suggestion.value}
                        onClick={() => setHeroQuery(suggestion.value)}
                        type="button"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="hero-business-strip partner-panel">
        <div>
          <p className="section-label">For businesses</p>
          <h2>{copy.partnerHeadline}</h2>
          <p>{copy.partnerCopy}</p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/for-businesses/submit">
              Request review
              <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/pricing">
              See packages
            </AppLink>
          </div>
        </div>
        <div>
          <SafeModeNotice />
          <div className="mini-pricing-row">
            {data.packages.map((plan) => (
              <article className={plan.highlighted ? "mini-plan highlighted" : "mini-plan"} key={plan.id}>
                <strong>{plan.name}</strong>
                <span>{plan.priceLabel}</span>
                <small>Request review first</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="metrics-strip">
        <MetricCard label="Guide pages" value={`${cityGuides.length}`} detail="Planning guides already live" />
        <MetricCard label="Official source pages" value={`${sourceBackedWedgeCount}`} detail="Starting-point pages with real source links" />
        <MetricCard label="Businesses tracked" value={`${businessCoverage.totalBusinesses}`} detail="Vancouver businesses already mapped" />
        <MetricCard label="Saved plans" value={`${data.cityMissions.length}`} detail="Route ideas you can keep and reuse" />
      </section>

      <section className="section-block">
        <SectionHeader
          label="Next city preview"
          title="Toronto now has a narrow first-visit preview inside CityAtlas"
          copy="The Toronto preview stays intentionally small: one guide hub, two official source pages, and two simple guides for a first visit or one compact weekend."
          action={<StatusPill tone="blue">Toronto preview</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink className="query-card query-card-link" to="/toronto/guides">
            <strong>Toronto guide hub</strong>
            <p>Open the Toronto preview when the real question is where a first-time visitor should begin or how to keep a weekend compact, not how to cover the whole city.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/first-time-visitor-starters">
            <strong>Toronto first-visit starting points</strong>
            <p>Use the official source page for Distillery, St. Lawrence, Harbourfront, AGO, and ROM when the first decision is where to begin.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/toronto/guides/where-should-a-first-time-toronto-visitor-start"
          >
            <strong>Toronto destination guide</strong>
            <p>Read the answer-first Toronto guide when the goal is choosing the right first impression instead of building a giant itinerary.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/weekend-route-starters">
            <strong>Toronto weekend starting points</strong>
            <p>Use the official source page for STACKT, Toronto Music Garden, The Bentway, Evergreen Brick Works, and Toronto Botanical Garden when you want one cleaner weekend shape.</p>
          </AppLink>
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel">
          <SectionHeader
            label="What is CityAtlas?"
            title="A Vancouver-first guide for making the next city choice easier"
            copy="CityAtlas is built for the moment when you know the kind of day you want, but not the best place or route to start with."
          />
          <div className="home-explainer-grid">
            {homePlanningLanes.map((lane) => (
              <article className="home-explainer-card" key={lane.title}>
                <strong>{lane.title}</strong>
                <p>{lane.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="source-panel">
          <SectionHeader
            label="Why it feels easier"
            title="Built to help you choose, not scroll forever"
            copy="The strongest CityAtlas pages narrow the first decision quickly, then move you into the right guide, route, or saved plan."
          />
          <ul className="home-why-list">
            {whyCityAtlasFeelsEasier.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <AppLink className="button secondary" to="/about">
              About CityAtlas
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
            >
              Where to start
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/guides">
              Guide library
            </AppLink>
          </div>
        </div>
      </section>

      <section className="adaptive-band">
        <SparkIcon />
        <div>
          <strong>Next best action: {nextBestAction.label}</strong>
          <p>{nextBestAction.copy}</p>
        </div>
        <AppLink className="button secondary" to={nextBestAction.path}>
          Continue <ArrowRightIcon />
        </AppLink>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Popular planning questions"
          title="Popular Vancouver planning questions"
          copy="These are the city questions CityAtlas is built to answer first."
        />
        <div className="guide-query-grid">
          {cityGuides.slice(0, 8).map((guide) => (
            <AppLink className="query-card query-card-link" to={`/vancouver/guides/${guide.slug}`} key={guide.id}>
              <strong>{guide.queryClass}</strong>
              <p>{guide.summary}</p>
            </AppLink>
          ))}
        </div>
      </section>

      {neighborhoodGuides.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Choose a neighborhood first"
            title="Start with the part of Vancouver that fits the plan"
            copy="These pages help readers choose the right neighborhood before they overthink the exact stops. CityAtlas now has starting-point guides for Gastown, Mount Pleasant, and Kitsilano."
          />
          <div className="guide-query-grid">
            {(neighborhoodStarterGuides.length > 0 ? neighborhoodStarterGuides : neighborhoodGuides)
              .slice(0, 3)
              .map((guide) => (
              <AppLink className="query-card query-card-link" to={`/vancouver/guides/${guide.slug}`} key={guide.id}>
                <strong>{guide.title}</strong>
                <p>{guide.excerpt}</p>
              </AppLink>
            ))}
          </div>
        </section>
      ) : null}

      {featuredDateNightSourceBackedPlaces.length > 0 ||
      featuredRainyDaySourceBackedPlaces.length > 0 ||
      featuredFirstEveningSourceBackedPlaces.length > 0 ||
      featuredFirstTimeVisitorSourceBackedPlaces.length > 0 ||
      featuredGardenDaySourceBackedPlaces.length > 0 ||
      featuredKitsilanoScenicSourceBackedPlaces.length > 0 ||
      featuredWestSideDaytimeSourceBackedPlaces.length > 0 ||
      featuredFalseCreekCultureSourceBackedPlaces.length > 0 ||
      featuredUbcDiscoverySourceBackedPlaces.length > 0 ||
      featuredReturningVisitorSourceBackedPlaces.length > 0 ||
      featuredOutOfTownGuestSourceBackedPlaces.length > 0 ||
      featuredWeekendRouteSourceBackedPlaces.length > 0 ||
      featuredSundaySourceBackedPlaces.length > 0 ||
      featuredWellnessResetSourceBackedPlaces.length > 0 ? (
        <section className="split-section">
          <div className="source-panel">
            <SectionHeader
              label="Official sources now"
              title="Real Vancouver places with official source links"
              copy="CityAtlas now has fourteen focused pages that name real Vancouver anchors, link straight to official sources, and stay clear about what each page covers."
              action={<StatusPill tone="green">{sourceBackedWedgeCount} checked city topics</StatusPill>}
            />
            <div className="tag-cloud">
              {featuredSourceBackedNames.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
          <div className="source-panel">
            <SectionHeader
              label="Trust layer"
              title="Useful enough to share, clear enough to trust"
              copy="CityAtlas starts smaller, links to official sources where needed, and keeps corrections easy."
            />
            <div className="hero-actions">
              {trustedStartingPointLinks.map((link, index) => (
                <AppLink
                  className={index === 0 ? "button primary" : "button secondary"}
                  key={link.path}
                  to={link.path}
                >
                  {link.label}
                  {index === 0 ? <ArrowRightIcon /> : null}
                </AppLink>
              ))}
              <AppLink className="button secondary" to="/editorial-standards">
                See editorial standards
              </AppLink>
            </div>
          </div>
        </section>
      ) : null}

      <VancouverBusinessCoverageSection data={data} variant="home" />

      <section className="section-block">
        <SectionHeader
          label="Business pages"
          title="See how a reviewed business page can look"
          copy="These cards show how a CityAtlas business page can look once the facts, media, and participation details are confirmed."
          action={<AppLink className="text-link" to="/vancouver">View all discovery <ArrowRightIcon /></AppLink>}
        />
        <div className="card-grid three">
          {featuredBusinesses.map((business) => (
            <BusinessCard business={business} key={business.id} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Saved plans"
          title="Routes built for repeat visits and easy sharing"
          copy="Make a plan, save it, share it, and turn a good city idea into something easy to reuse."
          action={<AppLink className="text-link" to="/vancouver/missions">View saved plans <ArrowRightIcon /></AppLink>}
        />
        <div className="card-grid two">
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
            label="Events and offers"
            title="Event pages and local offers"
            copy="CityAtlas can support events, offers, and partner moments without pretending every listing is already live."
          />
          <div className="stacked-list">
            {data.events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            label="Partner offers"
            title="How a partner offer can appear"
            copy="These cards show how a partner offer can appear once the business confirms the details."
          />
          <div className="stacked-list">
            {data.offers.map((offer) => (
              <OfferCard
                offer={offer}
                business={data.businesses.find((business) => business.id === offer.businessId)}
                key={offer.id}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Guides"
          title="Guides for neighborhoods, occasions, and city decisions"
          copy="Guides turn broad city questions into something useful and easy to act on."
          action={<AppLink className="text-link" to="/vancouver/guides">Read guides <ArrowRightIcon /></AppLink>}
        />
        <div className="card-grid two">
          {cityGuides.map((guide) => (
            <GuideCard guide={guide} key={guide.id} />
          ))}
        </div>
      </section>

      <section className="trust-section">
        <TrustCard />
        <article className="trust-card">
          <ShieldIcon />
          <strong>Public claims stay conservative</strong>
          <p>
            CityAtlas avoids traffic, ranking, booking, and offer claims unless the support is
            clear and the page can explain them honestly.
          </p>
        </article>
        <form
          className="newsletter-card"
          onSubmit={(event) => {
            event.preventDefault();
            if (!email.trim()) return;
            const lead = onNewsletter(email, "local_discovery");
            setReferralCode(lead.referralCode);
            setEmail("");
          }}
        >
          <strong>Get CityAtlas updates</strong>
          <p>
            Save your email in this browser and keep the referral code handy for future invites.
          </p>
          <div className="inline-form">
            <input
              aria-label="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              required
            />
            <button className="button primary" type="submit">
              Save
            </button>
          </div>
          {referralCode ? (
            <div className="referral-box">
              <strong>Your saved referral code</strong>
              <code>{referralCode}</code>
              <p>Keep this code handy for future invite and sharing features.</p>
            </div>
          ) : null}
        </form>
      </section>
    </>
  );
}
