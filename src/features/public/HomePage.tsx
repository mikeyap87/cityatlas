import { useEffect, useMemo, useState } from "react";
import type { CityAtlasData, CityMission, NewsletterLead } from "../../types";
import { resolvePublicAssetPath, siteConfig } from "../../config/site";
import {
  getActiveVariant,
  getNextBestAction,
  variantCopy,
} from "../../lib/experiments";
import { getGuidePath } from "../../lib/cityPaths";
import { getOfferDisplayBusiness } from "../../lib/offers";
import { AppLink } from "../../components/Link";
import {
  ArrowRightIcon,
  SearchIcon,
  ShieldIcon,
  SparkIcon,
} from "../../components/Icons";
import {
  GuideCard,
  GuideCompactCard,
  MissionCard,
  TrustCard,
} from "../../components/Cards";
import {
  SectionHeader,
  StatusPill,
} from "../../components/UI";
import { getSourceBackedPlaces } from "../../lib/sourceBackedCollections";
import { navigate } from "../../app/router";
import { simplifyGuideDisplayText } from "../../lib/publicCopy";

interface HomePageProps {
  data: CityAtlasData;
  onNewsletter: (email: string, interest: NewsletterLead["interest"]) => NewsletterLead;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
  onSaveMission: (mission: CityMission) => void;
}

type HomeSearchKind = "shortcut" | "guide" | "business" | "event" | "offer";
type HeroPreviewId =
  | "date-night"
  | "gastown"
  | "kits"
  | "mount-pleasant"
  | "false-creek"
  | "ubc"
  | "rainy-day"
  | "weekend-plan";

interface HomeSearchResult {
  id: string;
  kind: HomeSearchKind;
  label: string;
  detail: string;
  path: string;
  haystack: string;
}

interface HeroPreview {
  id: HeroPreviewId;
  label: string;
  caption: string;
  detail: string;
  path: string;
  image: string;
  alt: string;
  queryTerms: string[];
  mapClassName?: string;
  suggestionLabel?: string;
  searchValue?: string;
}

const heroPreviewLookup: Record<HeroPreviewId, HeroPreview> = {
  "date-night": {
    id: "date-night",
    label: "Date night",
    caption: "Dinner and one easy second stop",
    detail: "Best when the plan should feel intentional, compact, and ready to share.",
    path: "/vancouver/date-night-starters",
    image: resolvePublicAssetPath("/assets/routes-generated/vancouver-date-night-route-hero-v2.jpg"),
    alt: "Illustrated Vancouver evening street scene for a compact date-night route",
    queryTerms: ["date night", "date", "dinner", "evening", "romantic", "first date"],
    suggestionLabel: "Date night",
    searchValue: "date night",
  },
  gastown: {
    id: "gastown",
    label: "Gastown",
    caption: "Old-core evening",
    detail: "Best for dinner, a walk, and a compact first evening without crossing the city.",
    path: "/vancouver/guides/gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact",
    image: resolvePublicAssetPath("/assets/places-generated/gastown-generated.jpg"),
    alt: "Illustrated evening street scene inspired by Gastown in Vancouver",
    queryTerms: ["gastown", "old core evening", "historic core", "dinner walk"],
    mapClassName: "map-stop-gastown",
    suggestionLabel: "Gastown",
    searchValue: "gastown",
  },
  kits: {
    id: "kits",
    label: "Kitsilano",
    caption: "Beach and seawall",
    detail: "Best for shoreline time, easy movement, and a lighter west-side pace.",
    path: "/vancouver/kitsilano-scenic-starters",
    image: resolvePublicAssetPath("/assets/places-generated/kitsilano-beach-generated.jpg"),
    alt: "Illustrated shoreline scene inspired by Kitsilano Beach in Vancouver",
    queryTerms: ["kits", "kits beach", "kitsilano", "beach", "seawall"],
    mapClassName: "map-stop-kits",
    suggestionLabel: "Kits Beach",
    searchValue: "kits beach",
  },
  "mount-pleasant": {
    id: "mount-pleasant",
    label: "Mount Pleasant",
    caption: "Coffee and casual plans",
    detail: "Useful for cafes, casual meals, and a short neighborhood wander.",
    path: "/vancouver/guides/mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
    image: resolvePublicAssetPath("/assets/vancouver-rainline-cafe-hero.jpg"),
    alt: "Illustrated cafe scene for casual Vancouver neighborhood plans",
    queryTerms: ["mount pleasant", "coffee", "casual plan", "casual meals"],
    mapClassName: "map-stop-mount-pleasant",
  },
  "false-creek": {
    id: "false-creek",
    label: "False Creek",
    caption: "Culture afternoon",
    detail: "A better fit for museums, harbour walks, and a compact daytime plan.",
    path: "/vancouver/false-creek-culture-starters",
    image: resolvePublicAssetPath("/assets/places-generated/museum-of-vancouver-generated.jpg"),
    alt: "Illustrated museum-and-waterfront scene inspired by False Creek in Vancouver",
    queryTerms: ["false creek", "culture afternoon", "museum", "harbour walk"],
    mapClassName: "map-stop-false-creek",
  },
  ubc: {
    id: "ubc",
    label: "UBC + Point Grey",
    caption: "Garden and campus day",
    detail: "Open this for campus stops, gardens, and a quieter scenic reset.",
    path: "/vancouver/ubc-discovery-starters",
    image: resolvePublicAssetPath("/assets/places-generated/ubc-botanical-garden-generated.jpg"),
    alt: "Illustrated garden scene inspired by UBC Botanical Garden in Vancouver",
    queryTerms: ["ubc", "point grey", "campus day", "garden day"],
    mapClassName: "map-stop-ubc",
  },
  "rainy-day": {
    id: "rainy-day",
    label: "Rainy day",
    caption: "Indoor fallback",
    detail: "Best when the weather turns and you want one clear indoor Vancouver start fast.",
    path: "/vancouver/rainy-day-starters",
    image: resolvePublicAssetPath("/assets/vancouver-rainy-market-hero.jpg"),
    alt: "Illustrated rainy-day Vancouver market scene",
    queryTerms: ["rainy day", "rain", "indoor plan", "indoor Vancouver"],
    suggestionLabel: "Rainy day",
    searchValue: "rainy day",
  },
  "weekend-plan": {
    id: "weekend-plan",
    label: "Weekend plan",
    caption: "Compact day plan",
    detail: "Best when you want one Vancouver day that stays compact instead of crossing the city all day.",
    path: "/vancouver/weekend-route-starters",
    image: resolvePublicAssetPath("/assets/vancouver-waterfront-park-hero.jpg"),
    alt: "Illustrated Vancouver waterfront scene for a compact weekend plan",
    queryTerms: ["weekend", "weekend plan", "weekend route", "one city day"],
    suggestionLabel: "Weekend plan",
    searchValue: "weekend plan",
  },
};

const heroMapStopIds = [
  "gastown",
  "kits",
  "mount-pleasant",
  "false-creek",
  "ubc",
] as const;

const heroMapStops = heroMapStopIds.map((id) => heroPreviewLookup[id]);

const heroSearchSuggestionIds = ["date-night", "rainy-day", "gastown", "kits", "weekend-plan"] as const;

const heroSearchSuggestions = heroSearchSuggestionIds.map((id) => {
  const preview = heroPreviewLookup[id];

  return {
    label: preview.suggestionLabel ?? preview.label,
    value: preview.searchValue ?? preview.label.toLowerCase(),
    path: preview.path,
    previewId: preview.id,
  };
});

const heroSearchShortcutIds = [
  "date-night",
  "rainy-day",
  "weekend-plan",
  "gastown",
  "kits",
  "mount-pleasant",
  "false-creek",
  "ubc",
] as const;

const heroSearchShortcuts = heroSearchShortcutIds.map((id) => {
  const preview = heroPreviewLookup[id];

  return {
    id: `shortcut-${preview.id}`,
    label: preview.suggestionLabel ?? preview.label,
    detail: preview.caption,
    path: preview.path,
    matches: preview.queryTerms,
  };
});

const homeResultKindLabels: Record<HomeSearchKind, string> = {
  shortcut: "Quick start",
  guide: "Guide",
  business: "Place",
  event: "Event",
  offer: "Offer",
};

const trustedStartingPointLinks = [
  {
    path: "/vancouver/date-night-starters",
    label: "Date night",
    detail: "Dinner-first evening anchors with official links.",
  },
  {
    path: "/vancouver/rainy-day-starters",
    label: "Rainy day",
    detail: "Indoor-friendly starts for weather shifts.",
  },
  {
    path: "/vancouver/first-evening-starters",
    label: "First evening",
    detail: "Short first-night starts for visitors or guests.",
  },
  {
    path: "/vancouver/first-time-visitor-starters",
    label: "First visit",
    detail: "Choose the right first impression before building the day.",
  },
  {
    path: "/vancouver/garden-day-starters",
    label: "Garden day",
    detail: "Garden and conservatory starts for a slower day.",
  },
  {
    path: "/vancouver/kitsilano-scenic-starters",
    label: "Kitsilano",
    detail: "Waterfront and west-side starts for a slower pace.",
  },
  {
    path: "/vancouver/west-side-daytime-starters",
    label: "West-side day",
    detail: "Beach, campus, and quieter daytime starts.",
  },
  {
    path: "/vancouver/false-creek-culture-starters",
    label: "False Creek",
    detail: "Culture and waterfront starts for compact afternoons.",
  },
  {
    path: "/vancouver/ubc-discovery-starters",
    label: "UBC day",
    detail: "Campus, museum, and garden starts near Point Grey.",
  },
  {
    path: "/vancouver/returning-visitor-starters",
    label: "Returning visit",
    detail: "Second-look starts when the obvious first visit is done.",
  },
  {
    path: "/vancouver/out-of-town-guest-starters",
    label: "Hosting guests",
    detail: "Crowd-pleasing starts for friends or family in town.",
  },
  {
    path: "/vancouver/weekend-route-starters",
    label: "Weekend plan",
    detail: "Compact weekend starts without crossing the city all day.",
  },
  {
    path: "/vancouver/sunday-starters",
    label: "Sunday plan",
    detail: "Low-effort Sunday anchors with calmer pacing.",
  },
  {
    path: "/vancouver/wellness-reset-starters",
    label: "Wellness reset",
    detail: "Recovery-minded starts for calmer Vancouver days.",
  },
] as const;

const homePlanningLanes = [
  {
    title: "Date night",
    description: "Open one compact evening plan with real local starting points.",
    path: "/vancouver/date-night-starters",
    hint: "Plan the night",
  },
  {
    title: "First visit",
    description: "Choose the right part of Vancouver before a first trip gets overbuilt.",
    path: "/vancouver/first-time-visitor-starters",
    hint: "Plan the start",
  },
  {
    title: "Rainy day",
    description: "Move fast into a good indoor plan when the weather turns.",
    path: "/vancouver/rainy-day-starters",
    hint: "See indoor routes",
  },
  {
    title: "Weekend plan",
    description: "Keep one city day compact instead of crossing Vancouver for too many stops.",
    path: "/vancouver/weekend-route-starters",
    hint: "Keep it compact",
  },
] as const;

export function HomePage({ data, onNewsletter: _onNewsletter, onTrack, onSaveMission }: HomePageProps) {
  const [heroQuery, setHeroQuery] = useState("");
  const [activeHeroPreviewId, setActiveHeroPreviewId] = useState<HeroPreviewId>(heroMapStops[0].id);
  const activeVariant = getActiveVariant();
  const copy = variantCopy[activeVariant];
  const nextBestAction = getNextBestAction(data);
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
  ).slice(0, 8);
  const sourceBackedWedgeCount = featuredSourceBackedCollections.filter(
    (collection) => collection.length > 0,
  ).length;
  const localPlacePageLabel = `${sourceBackedWedgeCount} place pages`;
  const activeHeroPreview = heroPreviewLookup[activeHeroPreviewId] ?? heroMapStops[0];
  const heroSignals = [
    {
      tone: "blue" as const,
      label: "Start with a neighborhood",
    },
    {
      tone: "green" as const,
      label: "Or search by need",
    },
  ];
  const homeSearchResults = useMemo(() => {
    const shortcutResults: HomeSearchResult[] = heroSearchShortcuts.map((shortcut) => ({
      id: shortcut.id,
      kind: "shortcut",
      label: shortcut.label,
      detail: shortcut.detail,
      path: shortcut.path,
      haystack: shortcut.matches.join(" ").toLowerCase(),
    }));
    const guideResults: HomeSearchResult[] = cityGuides.map((guide) => {
      const guideTitle = simplifyGuideDisplayText(guide.title);
      const guideSummary = simplifyGuideDisplayText(guide.summary);
      const guideQuery = simplifyGuideDisplayText(guide.queryClass);

      return {
        id: `guide-${guide.id}`,
        kind: "guide",
        label: guideTitle,
        detail: guideSummary,
        path: getGuidePath(guide),
        haystack: [guideTitle, guideSummary, guideQuery, guide.category, guide.neighborhood]
          .join(" ")
          .toLowerCase(),
      };
    });
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
      const business = getOfferDisplayBusiness(offer, data.businesses);
      return {
        id: `offer-${offer.id}`,
        kind: "offer" as const,
        label: offer.title,
        detail: business ? `${business.name} offer preview` : "Local offer preview",
        path: `/${siteConfig.citySlug}/offers`,
        haystack: [offer.title, offer.description, business?.name ?? ""].join(" ").toLowerCase(),
      };
    });

    return [...shortcutResults, ...guideResults, ...businessResults, ...eventResults, ...offerResults];
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
        const kindBonus =
          result.kind === "shortcut"
            ? 6
            : result.kind === "guide"
              ? 4
              : result.kind === "business"
                ? 2
                : result.kind === "event"
                  ? 1
                  : 0;

        return {
          ...result,
          matchScore: exactMatch + termScore,
          score: exactMatch + termScore + kindBonus,
        };
      })
      .filter((result) => result.matchScore > 0)
      .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
      .slice(0, 3);
  }, [heroQuery, homeSearchResults]);
  const hasHeroQuery = heroQuery.trim().length > 0;
  const heroSearchHasMatches = filteredHomeResults.length > 0;
  const preferredHomepageGuides = [
    "where-should-a-first-time-vancouver-visitor-start",
    "how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
    "rainy-day-vancouver-plan-coffee-walk-and-reset",
  ]
    .map((slug) => cityGuides.find((guide) => guide.slug === slug))
    .filter((guide): guide is (typeof cityGuides)[number] => Boolean(guide));
  const fallbackHomepageGuides = cityGuides.filter(
    (guide) => !preferredHomepageGuides.some((preferredGuide) => preferredGuide.id === guide.id),
  );
  const homepageGuideHighlights = [...preferredHomepageGuides, ...fallbackHomepageGuides].slice(0, 3);
  const [featuredHomepageGuide, ...supportingHomepageGuides] = homepageGuideHighlights;
  const trustHighlightLinks = trustedStartingPointLinks.slice(0, 4);
  const nextStepLabel =
    nextBestAction.label === "Pick your first Vancouver guide"
      ? "Start with Vancouver guides"
      : nextBestAction.label;
  const nextStepCopy =
    nextBestAction.label === "Pick your first Vancouver guide"
      ? "That is the fastest way to compare rainy-day, visitor, weekend, and neighborhood guides without scanning the whole city first."
      : nextBestAction.copy;

  useEffect(() => {
    onTrack("experiment_exposed", { experiment: "homepage_positioning", variant: activeVariant });
  }, [activeVariant, onTrack]);

  return (
    <>
      <section className="hero-grid">
        <div className="hero-media">
          <img
            src={activeHeroPreview.image}
            alt={activeHeroPreview.alt}
            decoding="async"
            fetchPriority="high"
            loading="eager"
          />
          <div className="hero-copy">
            <p className="hero-kicker">Vancouver guide</p>
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
              <AppLink
                className="button secondary"
                onClick={() => onTrack("business_funnel_cta_clicked", { location: "home_hero" })}
                to="/for-businesses/pricing"
              >
                For Vancouver businesses
              </AppLink>
            </div>
            <div className="home-hero-lane-group">
              <p className="home-hero-lane-label">Useful ways to start</p>
              <div className="home-hero-lane-row">
                {homePlanningLanes.map((lane) => (
                  <AppLink className="home-hero-lane-pill" key={lane.title} to={lane.path}>
                    <strong>{lane.title}</strong>
                    <span>{lane.description}</span>
                  </AppLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-side-column">
          <div className="hero-utility-panel">
            <div className="hero-utility-head">
              <div>
                <strong>Tap an area or search by what kind of day you want</strong>
                <p className="hero-panel-copy">
                  Use the area picker or search to open one useful Vancouver page fast.
                </p>
              </div>
            </div>
            <div className="hero-signal-row">
              {heroSignals.map((signal) => (
                <StatusPill key={signal.label} tone={signal.tone}>
                  {signal.label}
                </StatusPill>
              ))}
            </div>
            <div className="atlas-map" aria-label="Clickable Vancouver area picker">
              <svg
                aria-hidden="true"
                className="atlas-map-art"
                preserveAspectRatio="none"
                viewBox="0 0 1000 340"
              >
                <path
                  className="atlas-map-land"
                  d="M0 26C92 34 162 84 226 92C312 103 350 52 431 56C520 60 567 126 645 132C754 140 844 86 1000 98V0H0Z"
                  fill="rgba(255,255,255,0.62)"
                />
                <path
                  className="atlas-map-land"
                  d="M0 248C115 221 176 159 260 160C352 162 401 226 491 236C607 249 703 182 784 178C861 174 916 202 1000 224V340H0Z"
                  fill="rgba(255,255,255,0.7)"
                />
                <path className="atlas-map-waterway" d="M44 170C180 130 275 132 392 165C500 196 625 206 774 183C868 169 933 150 980 135" />
                <path className="atlas-map-route" d="M120 104C212 122 313 150 404 191C492 229 612 243 747 227" />
                <path className="atlas-map-route alt" d="M182 246C283 219 390 203 511 213C616 221 699 204 847 164" />
                <text className="atlas-map-label atlas-map-label-land" x="128" y="86">
                  Downtown
                </text>
                <text className="atlas-map-label" x="515" y="156">
                  False Creek
                </text>
                <text className="atlas-map-label atlas-map-label-land" x="728" y="270">
                  West side
                </text>
              </svg>
              {heroMapStops.map((stop) => {
                const mapStopClassName =
                  stop.id === "mount-pleasant"
                    ? "map-stop-mount-pleasant"
                    : stop.id === "false-creek"
                      ? "map-stop-false-creek"
                      : stop.id === "kits"
                        ? "map-stop-kits"
                        : stop.id === "ubc"
                          ? "map-stop-ubc"
                          : "map-stop-gastown";

                return (
                  <AppLink
                    aria-label={`Open ${stop.label}`}
                    className={`map-stop ${mapStopClassName}${stop.id === activeHeroPreview.id ? " active" : ""}`}
                    key={stop.id}
                    onFocus={() => setActiveHeroPreviewId(stop.id)}
                    onMouseEnter={() => setActiveHeroPreviewId(stop.id)}
                    to={stop.path}
                  >
                    <span className="map-stop-dot" aria-hidden="true" />
                    <strong>{stop.label}</strong>
                  </AppLink>
                );
              })}
            </div>
            <div className="hero-search-panel">
              <p className="hero-search-copy">
                Try rainy day, first visit, Kits Beach, or weekend plan.
              </p>
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
                  placeholder="Search rainy day, Gastown, or weekend plan"
                  type="search"
                  value={heroQuery}
                />
                <button className="button primary hero-search-submit" type="submit">
                  Go
                </button>
              </form>
              {heroSearchHasMatches ? (
                <div className="hero-search-results">
                  {filteredHomeResults.map((result) => (
                    <AppLink className="hero-search-result" key={result.id} to={result.path}>
                      <strong>{result.label}</strong>
                      <span>{`${homeResultKindLabels[result.kind]}: ${result.detail}`}</span>
                    </AppLink>
                  ))}
                </div>
              ) : hasHeroQuery ? (
                <div className="hero-search-empty hero-search-empty-active">
                  <strong>No exact page yet</strong>
                  <p>Open Vancouver guides or browse the main Vancouver page.</p>
                  <div className="hero-search-suggestions">
                    <AppLink className="hero-search-suggestion" to="/vancouver/guides">
                      Open guides
                    </AppLink>
                    <AppLink className="hero-search-suggestion" to="/vancouver">
                      Browse Vancouver
                    </AppLink>
                  </div>
                </div>
              ) : (
                <div className="hero-search-empty">
                  <p>Popular starts</p>
                  <div className="hero-search-suggestions">
                    {heroSearchSuggestions.map((suggestion) => (
                      <AppLink
                        className={`hero-search-suggestion${suggestion.previewId === activeHeroPreview.id ? " active" : ""}`}
                        key={suggestion.value}
                        onFocus={() => setActiveHeroPreviewId(suggestion.previewId)}
                        onMouseEnter={() => setActiveHeroPreviewId(suggestion.previewId)}
                        to={suggestion.path}
                      >
                        {suggestion.label}
                      </AppLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="hero-active-route-row">
              <div className="hero-active-route-copy">
                <p className="hero-route-preview-kicker">Previewed start</p>
                <strong>{activeHeroPreview.label}</strong>
                <p>{activeHeroPreview.caption}</p>
                <p className="hero-active-route-summary">{activeHeroPreview.detail}</p>
              </div>
              <AppLink className="button secondary" to={activeHeroPreview.path}>
                Open page
              </AppLink>
            </div>
          </div>
        </div>
      </section>

      <section className="home-next-step-band">
        <SparkIcon />
        <div className="home-next-step-band-copy">
          <span className="query-card-kicker">Need one clear start?</span>
          <strong>{nextStepLabel}</strong>
          <p>{nextStepCopy}</p>
        </div>
        <div className="hero-actions">
          <AppLink className="button primary" to={nextBestAction.path}>
            {nextBestAction.primaryLabel} <ArrowRightIcon />
          </AppLink>
          <AppLink className="button secondary" to={nextBestAction.secondaryPath}>
            {nextBestAction.secondaryLabel}
          </AppLink>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Browse by situation"
          title={`${sourceBackedWedgeCount} source-backed Vancouver starts are ready now`}
          copy="Open the page that matches the kind of day first. Each start keeps the claims narrow, uses official source links, and stays easy to correct."
          action={<StatusPill tone="green">{localPlacePageLabel}</StatusPill>}
        />
        <div className="guide-index-grid route-moment-grid">
          {trustedStartingPointLinks.map((link) => (
            <AppLink className="guide-index-card route-moment-card" key={link.path} to={link.path}>
              <strong>{link.label}</strong>
              <span>{link.detail}</span>
            </AppLink>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Start with one useful guide"
          title="Strong Vancouver guides to open first"
          copy="Start with the guide that fits the day, then go deeper only if you still need more."
          action={<AppLink className="text-link" to="/vancouver/guides">Open all guides <ArrowRightIcon /></AppLink>}
        />
        {featuredHomepageGuide ? (
          <div className="guide-cluster-layout home-guide-layout">
            <GuideCard guide={featuredHomepageGuide} key={featuredHomepageGuide.id} />
            <div className="guide-cluster-stack">
              {supportingHomepageGuides.map((guide) => (
                <GuideCompactCard guide={guide} key={guide.id} variant="tight" />
              ))}
              <AppLink className="guide-more-card" to="/vancouver/guides">
                <strong>See all Vancouver guides</strong>
                <span>Open the full list when you already know the question and just need the right page fast.</span>
              </AppLink>
            </div>
          </div>
        ) : null}
      </section>

      {neighborhoodGuides.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Choose a neighborhood first"
            title="Choose the neighborhood before the exact stop"
            copy="These pages help people pick the right part of Vancouver before they overthink the exact stop list."
          />
          <div className="guide-query-grid">
            {(neighborhoodStarterGuides.length > 0 ? neighborhoodStarterGuides : neighborhoodGuides)
              .slice(0, 3)
              .map((guide) => (
              <AppLink className="query-card query-card-link" to={`/vancouver/guides/${guide.slug}`} key={guide.id}>
                <strong>{simplifyGuideDisplayText(guide.title)}</strong>
                <p>{simplifyGuideDisplayText(guide.excerpt)}</p>
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
              label="Local places"
              title="Real Vancouver places with official links"
              copy="When CityAtlas names a specific place, it links to the official site and stays clear about what it confirmed."
              action={<StatusPill tone="green">{localPlacePageLabel}</StatusPill>}
            />
            <div className="tag-cloud">
              {featuredSourceBackedNames.slice(0, 6).map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
          <div className="source-panel">
            <SectionHeader
              label="Open local places"
              title="Start with a few strong local places first"
              copy="Open a strong local place here, then go deeper only if the day still needs more."
            />
            <div className="hero-actions">
              {trustHighlightLinks.map((link, index) => (
                <AppLink
                  className={index === 0 ? "button primary" : "button secondary"}
                  key={link.path}
                  to={link.path}
                >
                  {link.label}
                  {index === 0 ? <ArrowRightIcon /> : null}
                </AppLink>
              ))}
              <AppLink className="button secondary" to="/vancouver/guides">
                Browse all place pages
              </AppLink>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <SectionHeader
          label="Saved plans"
          title="Saved plans built for repeat visits and easy sharing"
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
            label="Next city"
            title="Toronto now has a smaller starter set"
            copy="Use Toronto when the real question is where a first-time visitor should begin or how to keep a weekend compact. Vancouver still has the broader guide set."
          />
          <div className="guide-query-grid">
            <AppLink className="query-card query-card-link" to="/toronto/guides">
              <strong>Toronto guides</strong>
              <p>Start with Toronto when the goal is one clear first-visit or weekend decision.</p>
            </AppLink>
            <AppLink className="query-card query-card-link" to="/toronto/first-time-visitor-starters">
              <strong>Toronto first-visit starting points</strong>
              <p>Open the Toronto starting page when the first job is choosing where to begin.</p>
            </AppLink>
          </div>
        </div>
        <div>
          <SectionHeader
            label="For Vancouver businesses"
            title="Want your business to show up more clearly?"
            copy={copy.partnerCopy}
            action={<StatusPill tone="green">Request review first</StatusPill>}
          />
          <div className="source-panel">
            <p>
              Start with one clear business need. CityAtlas can turn that into the smallest useful
              next step, whether that is a stronger page, better guide fit, or a simple offer.
            </p>
            <div className="hero-actions">
              <AppLink
                className="button primary"
                onClick={() => onTrack("business_funnel_cta_clicked", { location: "home_business_panel" })}
                to="/for-businesses/submit"
              >
                Start business request
                <ArrowRightIcon />
              </AppLink>
              <AppLink
                className="button secondary"
                onClick={() => onTrack("business_funnel_cta_clicked", { location: "home_business_panel_packages" })}
                to="/for-businesses/pricing"
              >
                See packages
              </AppLink>
            </div>
            <div className="mini-pricing-row">
              {data.packages.map((plan) => (
                <article className={plan.highlighted ? "mini-plan highlighted" : "mini-plan"} key={plan.id}>
                  <strong>{plan.name}</strong>
                  <span>{plan.priceLabel}</span>
                  <small>Starts with a request</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <TrustCard />
        <article className="trust-card trust-card-rules">
          <ShieldIcon />
          <div className="card-topline">
            <strong>What CityAtlas will not pretend</strong>
            <StatusPill tone="green">Trust first</StatusPill>
          </div>
          <p>
            The site is built to stay useful without pretending it already knows more than it does.
          </p>
          <ul className="plain-list compact trust-rule-list">
            <li>No traffic, ranking, or booking claims without proof.</li>
            <li>No public business profile until facts are checked.</li>
            <li>No offer or event claims unless the page can support them clearly.</li>
          </ul>
        </article>
        <article className="newsletter-card newsletter-card-wide">
          <div className="card-topline">
            <strong>Need updates, a new city, or a business review?</strong>
            <StatusPill tone="blue">Direct contact</StatusPill>
          </div>
          <p>
            CityAtlas keeps the first contact path simple on purpose. Open a business request or
            email the team directly when you want help, updates, or a city request.
          </p>
          <div className="tag-cloud contact-tag-row">
            <span>Business reviews</span>
            <span>Future city launches</span>
            <span>Direct email path</span>
          </div>
          <div className="hero-actions contact-card-actions">
            <AppLink
              className="button primary"
              onClick={() => onTrack("business_funnel_cta_clicked", { location: "home_contact_card" })}
              to="/for-businesses/submit"
            >
              Start business request
            </AppLink>
            <a
              className="button secondary"
              href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("CityAtlas question")}`}
            >
              Email CityAtlas
            </a>
          </div>
          <p className="contact-card-note">Direct email goes to {siteConfig.contactEmail}.</p>
        </article>
      </section>
    </>
  );
}
