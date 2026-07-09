import { useEffect, useMemo, useState } from "react";
import { navigate } from "../../app/router";
import { siteConfig } from "../../config/site";
import type { CityAtlasData } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, SearchIcon, SparkIcon, StoreIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { getGuidePath } from "../../lib/cityPaths";
import { simplifyBusinessDisplayText, simplifyGuideDisplayText } from "../../lib/publicCopy";
import { VancouverBusinessCoverageSection } from "./VancouverBusinessCoverageSection";

interface HomePageProps {
  data: CityAtlasData;
  onNewsletter: (
    email: string,
    interest: "local_discovery" | "business_updates" | "creator_updates",
  ) => unknown;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
  onSaveMission: (mission: CityAtlasData["cityMissions"][number]) => void;
}

interface HomeRouteCard {
  id: string;
  label: string;
  kicker: string;
  title: string;
  detail: string;
  summary: string;
  path: string;
  image: string;
  imageAlt: string;
}

interface SearchItem {
  id: string;
  title: string;
  meta: string;
  description: string;
  to: string;
  keywords: string;
}

interface HomePickerResult {
  id: string;
  title: string;
  detail: string;
  path: string;
  image: string;
  imageAlt: string;
  ctaLabel?: string;
}

const homeRouteCards: HomeRouteCard[] = [
  {
    id: "date-night",
    label: "Date night",
    kicker: "Tonight and low guesswork",
    title: "Date night without bouncing between ten tabs",
    detail: "Open the strongest evening spots first, then narrow the exact stop.",
    summary:
      "Best when the plan is happening soon and you want a real Vancouver start instead of generic dinner ideas.",
    path: "/vancouver/date-night-starters",
    image: siteConfig.media.hero,
    imageAlt: "Illustrated Vancouver evening market scene",
  },
  {
    id: "first-visit",
    label: "First visit",
    kicker: "Best first impression",
    title: "First visit without wasting the first half-day",
    detail: "Choose the cleanest first impression before you build the rest of the day.",
    summary:
      "Best when someone is new to Vancouver and the first stop needs to feel obviously right.",
    path: "/vancouver/first-time-visitor-starters",
    image: siteConfig.media.city,
    imageAlt: "Illustrated Vancouver shoreline scene",
  },
  {
    id: "rainy-day",
    label: "Rainy day",
    kicker: "Indoor-first options",
    title: "Rainy day plans that still feel like Vancouver",
    detail: "Use indoor-friendly starters when the weather changes the whole shape of the day.",
    summary:
      "Best when the real constraint is weather and you need a calmer indoor-friendly starting point.",
    path: "/vancouver/rainy-day-starters",
    image: siteConfig.media.guides,
    imageAlt: "Illustrated Gastown scene for a rainy-day plan",
  },
  {
    id: "weekend-plan",
    label: "Weekend plan",
    kicker: "Compact and easy",
    title: "Weekend plans that do not waste energy crossing the city",
    detail: "Start with a compact page before comparing individual stops.",
    summary:
      "Best when you want one easy Saturday or Sunday direction instead of building the whole day from scratch.",
    path: "/vancouver/weekend-route-starters",
    image: siteConfig.media.weekend,
    imageAlt: "Illustrated Vancouver seawall scene for a weekend plan",
  },
  {
    id: "hosting-guests",
    label: "Hosting guests",
    kicker: "Crowd-pleasing start",
    title: "Hosting guests without overthinking the plan",
    detail: "Open the strongest first page for visiting friends or family.",
    summary:
      "Best when the plan needs to work for more than one person and you want an easy Vancouver win first.",
    path: "/vancouver/out-of-town-guest-starters",
    image: siteConfig.media.hostingGuests,
    imageAlt: "Illustrated Vancouver harbour scene for hosting out-of-town guests",
  },
  {
    id: "kitsilano-day",
    label: "Kitsilano day",
    kicker: "Scenic and slower",
    title: "Kitsilano when the right answer is just a slower west-side day",
    detail: "Use this when waterfront pace matters more than packing in stops.",
    summary:
      "Best when the day should feel scenic, slower, and easy to sustain without too much logistics.",
    path: "/vancouver/kitsilano-scenic-starters",
    image: siteConfig.media.waterfront,
    imageAlt: "Illustrated Kitsilano beach scene",
  },
  {
    id: "low-effort",
    label: "Low-effort day",
    kicker: "Energy-saving guide",
    title: "Low-effort day when the main goal is keeping things easy",
    detail: "Open the easier-day guide when the day needs less friction, less travel, and fewer decisions.",
    summary:
      "Best when energy is limited and you want CityAtlas to point you toward the easiest page first.",
    path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
    image: siteConfig.media.lowEffort,
    imageAlt: "Illustrated Vancouver beach path for a lower-effort day",
  },
  {
    id: "wellness-reset",
    label: "Wellness reset",
    kicker: "Calmer recovery mode",
    title: "Wellness reset when the day needs recovery more than novelty",
    detail: "Use a calmer plan when energy, pace, and fewer decisions matter most.",
    summary:
      "Best when someone wants a lower-key Vancouver plan built around reset, recovery, or lighter movement.",
    path: "/vancouver/wellness-reset-starters",
    image: siteConfig.media.wellnessReset,
    imageAlt: "Illustrated Vancouver garden scene for a wellness reset",
  },
];

const homePickerChoiceIds = [
  "date-night",
  "rainy-day",
  "first-visit",
  "hosting-guests",
  "weekend-plan",
] as const;

type HomePickerChoiceId = (typeof homePickerChoiceIds)[number];

const homePickerChoices: Array<{
  id: HomePickerChoiceId;
  cards: HomePickerResult[];
}> = [
  {
    id: "date-night",
    cards: [
      {
        id: "date-night-starters",
        title: "Date night starters",
        detail: "Open real Vancouver dinner-first starts with official-source notes first.",
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
    id: "first-visit",
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
    id: "hosting-guests",
    cards: [
      {
        id: "hosting-guests-starters",
        title: "Hosting guests starters",
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
  {
    id: "weekend-plan",
    cards: [
      {
        id: "weekend-plan-starters",
        title: "Weekend route starters",
        detail: "Start with compact weekend shapes before you compare individual stops.",
        path: "/vancouver/weekend-route-starters",
        image: siteConfig.media.weekend,
        imageAlt: "Vancouver seawall scene for weekend route starters",
      },
      {
        id: "weekend-plan-guide",
        title: "Weekend route guide",
        detail: "Use this when the real goal is one easy weekend route without city-crossing drag.",
        path: "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
        image: siteConfig.media.waterfront,
        imageAlt: "Waterfront route scene for the weekend route guide",
      },
      {
        id: "weekend-plan-start-here",
        title: "Start-here guide",
        detail: "Open this when the weekend still needs the right CityAtlas page before anything else.",
        path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
        image: siteConfig.media.lowEffort,
        imageAlt: "Lower-friction Vancouver path for the start-here guide",
      },
    ],
  },
];

function getCitySlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function HomePage({ data, onNewsletter: _onNewsletter, onTrack, onSaveMission: _onSaveMission }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [activePickerId, setActivePickerId] = useState<HomePickerChoiceId>(homePickerChoiceIds[0]);
  const cityGuides = data.guides.filter(
    (guide) => (guide.citySlug ?? siteConfig.citySlug) === siteConfig.citySlug,
  );
  const vancouverSourceBackedPlaceCount = data.sourceBackedPlaces.filter((place) =>
    place.collection.startsWith("vancouver_"),
  ).length;
  const vancouverSourceBackedPageCount = new Set(
    data.sourceBackedPlaces
      .filter((place) => place.collection.startsWith("vancouver_"))
      .map((place) => place.collection),
  ).size;
  const starterGuidePath =
    "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first";
  const roundupGuidePath =
    "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation";
  const heroPickerRoutes = homePickerChoiceIds
    .map((id) => homeRouteCards.find((route) => route.id === id))
    .filter((route): route is HomeRouteCard => Boolean(route));
  const extraRouteCards = homeRouteCards.filter(
    (route) => !homePickerChoiceIds.includes(route.id as HomePickerChoiceId),
  );
  const activePickerRoute = heroPickerRoutes.find((route) => route.id === activePickerId) ?? heroPickerRoutes[0];
  const activePickerChoice =
    homePickerChoices.find((choice) => choice.id === activePickerId) ?? homePickerChoices[0];
  const searchInputId = "home-place-search-input";

  const searchableItems = useMemo<SearchItem[]>(() => {
    const routeItems = homeRouteCards.map((route) => ({
      id: `route-${route.id}`,
      title: route.label,
      meta: `Fast start`,
      description: route.detail,
      to: route.path,
      keywords: [route.label, route.title, route.detail, route.summary].join(" ").toLowerCase(),
    }));
    const guideItems = cityGuides.map((guide) => ({
      id: `guide-${guide.id}`,
      title: simplifyGuideDisplayText(guide.title),
      meta: `Guide | ${guide.neighborhood}`,
      description: simplifyGuideDisplayText(guide.excerpt),
      to: getGuidePath(guide),
      keywords: [
        guide.title,
        guide.excerpt,
        guide.cluster,
        guide.category,
        guide.neighborhood,
        guide.audience,
      ]
        .join(" ")
        .toLowerCase(),
    }));
    const businessItems = data.businesses.map((business) => ({
      id: `business-${business.id}`,
      title: business.name,
      meta: `${business.category} | ${business.neighborhood}`,
      description: simplifyBusinessDisplayText(business.shortDescription),
      to: `/${getCitySlug(business.city)}/businesses/${business.slug}`,
      keywords: [
        business.name,
        business.category,
        business.neighborhood,
        simplifyBusinessDisplayText(business.shortDescription),
        ...business.bestFor,
      ]
        .join(" ")
        .toLowerCase(),
    }));

    return [...routeItems, ...guideItems, ...businessItems];
  }, [cityGuides, data.businesses]);

  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    const terms = trimmed.split(/\s+/).filter(Boolean);

    return searchableItems
      .map((item) => {
        const title = item.title.toLowerCase();
        const meta = item.meta.toLowerCase();
        const matchesAllTerms = terms.every((term) => item.keywords.includes(term));
        const score =
          (title.startsWith(trimmed) ? 6 : 0) +
          (title.includes(trimmed) ? 4 : 0) +
          (meta.includes(trimmed) ? 2 : 0) +
          terms.reduce((count, term) => count + (item.keywords.includes(term) ? 1 : 0), 0);

        return { item, matchesAllTerms, score };
      })
      .filter((entry) => entry.matchesAllTerms)
      .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title))
      .slice(0, 5)
      .map((entry) => entry.item);
  }, [query, searchableItems]);

  useEffect(() => {
    onTrack("home_surface_viewed", {
      routeCount: homeRouteCards.length,
      guideCount: cityGuides.length,
      businessCount: data.businesses.length,
      sourceBackedPlaceCount: vancouverSourceBackedPlaceCount,
    });
  }, [cityGuides.length, data.businesses.length, onTrack, vancouverSourceBackedPlaceCount]);

  function handleSearchSubmit() {
    onTrack("home_search_submitted", {
      queryLength: query.trim().length,
      resultCount: searchResults.length,
    });
    navigate(searchResults[0]?.to ?? activePickerRoute.path);
  }

  function handleRouteClick(route: HomeRouteCard, location: string) {
    onTrack("home_featured_route_clicked", {
      routeId: route.id,
      location,
    });
  }

  function handleSearchFocus(location: string) {
    onTrack("home_search_focus_requested", {
      location,
      activePickerId,
    });

    const input = document.getElementById(searchInputId);
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handlePickerChoiceSelect(routeId: HomePickerChoiceId, location: string) {
    setActivePickerId(routeId);
    onTrack("home_two_step_picker_selected", {
      routeId,
      location,
    });
  }

  function handlePickerResultClick(result: HomePickerResult, location: string) {
    onTrack("home_two_step_result_clicked", {
      choiceId: activePickerId,
      resultId: result.id,
      location,
    });
  }

  function handleFeaturedRoutePreview(routeId: string) {
    if (homePickerChoiceIds.includes(routeId as HomePickerChoiceId)) {
      setActivePickerId(routeId as HomePickerChoiceId);
    }
  }

  return (
    <>
      <section className="hero-grid page-top">
        <div className="home-mobile-hero-intro">
          <p className="hero-kicker">Two-step picker</p>
          <h1>Pick the kind of Vancouver day first. Then open the best first page.</h1>
          <p>
            CityAtlas works fastest when you choose the kind of day before you compare exact
            places, neighborhoods, or stops.
          </p>
          <div className="hero-actions">
            <AppLink
              className="button primary"
              onClick={() => handleRouteClick(activePickerRoute, "hero_mobile_intro_primary")}
              to={activePickerRoute.path}
            >
              Open {activePickerRoute.label}
              <ArrowRightIcon />
            </AppLink>
            <button
              className="button secondary"
              onClick={() => handleSearchFocus("hero_mobile_intro_search")}
              type="button"
            >
              Search direct
            </button>
          </div>
        </div>
        <article className="hero-media">
          <img
            src={activePickerRoute.image}
            alt={activePickerRoute.imageAlt}
            decoding="async"
            fetchPriority="high"
            loading="eager"
          />
          <div className="hero-copy home-hero-copy">
            <p className="hero-kicker">Two-step picker</p>
            <h1>Pick the kind of Vancouver day first. Then open the best first page.</h1>
            <p>
              CityAtlas gets easier when the first click answers what kind of day this is before it
              asks you to compare exact places.
            </p>
            <div className="hero-actions">
              <AppLink
                className="button primary"
                onClick={() => handleRouteClick(activePickerRoute, "hero_primary")}
                to={activePickerRoute.path}
              >
                Open {activePickerRoute.label}
                <ArrowRightIcon />
              </AppLink>
              <button
                className="button secondary"
                onClick={() => handleSearchFocus("hero_secondary_search")}
                type="button"
              >
                Search direct
              </button>
            </div>
          </div>
          <div className="hero-mobile-image-caption">
            <span className="hero-route-preview-kicker">{activePickerRoute.kicker}</span>
            <strong>{activePickerRoute.label}</strong>
            <p>{activePickerRoute.detail}</p>
          </div>
        </article>

        <div className="hero-side-column">
          <aside className="hero-two-step-panel">
            <div className="hero-step-label">
              <span className="hero-step-index">1</span>
              <span>What fits the day?</span>
            </div>
            <div className="hero-picker-choice-list" role="list" aria-label="Choose the kind of day">
              {heroPickerRoutes.map((route) => (
                <button
                  aria-pressed={route.id === activePickerId}
                  className={
                    route.id === activePickerId
                      ? "hero-picker-choice active"
                      : "hero-picker-choice"
                  }
                  key={route.id}
                  onClick={() =>
                    handlePickerChoiceSelect(route.id as HomePickerChoiceId, "hero_two_step_picker")
                  }
                  type="button"
                >
                  <strong>{route.label}</strong>
                  <span>{route.kicker}</span>
                </button>
              ))}
            </div>

            <div className="hero-step-label hero-step-label-secondary">
              <span className="hero-step-index">2</span>
              <span>Open a good first page</span>
            </div>
            <div className="hero-picker-result-list">
              {activePickerChoice.cards.map((result) => (
                <AppLink
                  className="hero-picker-result-card"
                  key={result.id}
                  onClick={() => handlePickerResultClick(result, "hero_two_step_result")}
                  to={result.path}
                >
                  <img
                    alt={result.imageAlt}
                    decoding="async"
                    loading="lazy"
                    src={result.image}
                  />
                  <div className="hero-picker-result-copy">
                    <strong>{result.title}</strong>
                    <p>{result.detail}</p>
                  </div>
                  <span className="hero-picker-result-cta">{result.ctaLabel ?? "Open page"}</span>
                </AppLink>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="home-next-step-band">
        <SparkIcon />
        <div className="home-next-step-band-copy">
          <span className="query-card-kicker">Already know the place?</span>
          <strong>Search direct when you already know the place or neighborhood.</strong>
          <p>
            Type one keyword and go straight to the page you want.
          </p>
        </div>
        <div className="home-next-step-band-search">
          <form
            className="hero-search-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearchSubmit();
            }}
          >
            <SearchIcon />
            <input
              aria-label="Search CityAtlas"
              id={searchInputId}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Kitsilano, rainy day, cafe, date night..."
              value={query}
            />
            <button className="button tiny hero-search-submit" type="submit">
              Go
            </button>
          </form>

          {query.trim() ? (
            searchResults.length > 0 ? (
              <div className="hero-search-results">
                {searchResults.slice(0, 3).map((item) => (
                  <AppLink
                    className="hero-search-result"
                    key={item.id}
                    onClick={() =>
                      onTrack("home_search_result_clicked", {
                        resultId: item.id,
                        queryLength: query.trim().length,
                      })}
                    to={item.to}
                  >
                    <strong>{item.title}</strong>
                    <span>
                      {item.meta}. {item.description}
                    </span>
                  </AppLink>
                ))}
              </div>
            ) : (
              <div className="hero-search-empty-active">
                <strong>No direct match yet</strong>
                <p>
                  Try a neighborhood, category, or use case like weekend, guests, dinner, or
                  wellness.
                </p>
              </div>
            )
          ) : (
            <div className="home-next-step-links">
              <AppLink
                className="home-next-step-link"
                onClick={() =>
                  onTrack("home_roundup_clicked", {
                    location: "home_next_step_link_roundup",
                  })
                }
                to={roundupGuidePath}
              >
                Browse by situation
              </AppLink>
              <AppLink className="home-next-step-link" to={starterGuidePath}>
                Open the start-here guide
              </AppLink>
              <AppLink className="home-next-step-link" to="/vancouver/guides">
                Open all guides
              </AppLink>
            </div>
          )}
        </div>
      </section>

      <section className="section-block home-intro-section">
        <SectionHeader
          label="Need a different day?"
          title="Other easy starts"
          copy="Use one of these when the top picker is close, but not the best match."
          action={<StatusPill tone="green">{extraRouteCards.length} more options</StatusPill>}
        />
        <div className="featured-route-grid">
          {extraRouteCards.map((route) => (
            <AppLink
              className="query-card query-card-link featured-route-card"
              key={`featured-${route.id}`}
              onClick={() => handleRouteClick(route, "featured_route_grid")}
              onFocus={() => handleFeaturedRoutePreview(route.id)}
              onMouseEnter={() => handleFeaturedRoutePreview(route.id)}
              to={route.path}
            >
              <div className="featured-route-card-media">
                <img alt={route.imageAlt} decoding="async" loading="eager" src={route.image} />
              </div>
              <span className="query-card-kicker">{route.kicker}</span>
              <strong>{route.title}</strong>
              <p>{route.summary}</p>
              <span className="query-card-hint">Open page</span>
            </AppLink>
          ))}
        </div>
      </section>

      <VancouverBusinessCoverageSection variant="home" />

      <section className="cta-band">
        <StoreIcon />
        <div>
          <h2>Run a Vancouver restaurant or local service?</h2>
          <p>
            Start with a business request when you want CityAtlas to look at the page, plan, or
            offer first, or book a short call if you would rather talk it through.
          </p>
        </div>
        <div className="hero-actions">
          <AppLink className="button primary" to="/for-businesses/submit">
            Start business request <ArrowRightIcon />
          </AppLink>
          <AppLink className="button secondary" to="/for-businesses/book-call">
            Book a short call
          </AppLink>
        </div>
      </section>
    </>
  );
}
