import { useEffect, useMemo, useState } from "react";
import { navigate } from "../../app/router";
import { siteConfig } from "../../config/site";
import type { CityAtlasData } from "../../types";
import { GuideCard } from "../../components/Cards";
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
    imageAlt: "Illustrated Gastown scene for a rainy-day route",
  },
  {
    id: "weekend-plan",
    label: "Weekend plan",
    kicker: "Compact and easy",
    title: "Weekend routes that do not waste energy crossing the city",
    detail: "Start with a compact plan shape before comparing individual stops.",
    summary:
      "Best when you want one easy Saturday or Sunday direction instead of building a route from scratch.",
    path: "/vancouver/weekend-route-starters",
    image: siteConfig.media.weekend,
    imageAlt: "Illustrated Vancouver seawall route for a weekend plan",
  },
  {
    id: "hosting-guests",
    label: "Hosting guests",
    kicker: "Crowd-pleasing start",
    title: "Hosting guests without overthinking the route",
    detail: "Open the strongest first page for visiting friends or family.",
    summary:
      "Best when the plan needs to work for more than one person and you want an easy Vancouver win first.",
    path: "/vancouver/out-of-town-guest-starters",
    image: siteConfig.media.hostingGuests,
    imageAlt: "Illustrated Vancouver harbour route for hosting out-of-town guests",
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
    kicker: "Energy-saving route",
    title: "Low-effort day when the main goal is keeping things easy",
    detail: "Open the route chooser when the day needs less friction, less travel, and fewer decisions.",
    summary:
      "Best when energy is limited and you want CityAtlas to point you toward the easiest route first.",
    path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
    image: siteConfig.media.lowEffort,
    imageAlt: "Illustrated Vancouver beach path for a lower-effort day",
  },
  {
    id: "wellness-reset",
    label: "Wellness reset",
    kicker: "Calmer recovery mode",
    title: "Wellness reset when the day needs recovery more than novelty",
    detail: "Use a calmer route when energy, pace, and fewer decisions matter most.",
    summary:
      "Best when someone wants a lower-key Vancouver plan built around reset, recovery, or lighter movement.",
    path: "/vancouver/wellness-reset-starters",
    image: siteConfig.media.wellnessReset,
    imageAlt: "Illustrated Vancouver garden route for a wellness reset",
  },
];

function getCitySlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function HomePage({ data, onNewsletter: _onNewsletter, onTrack, onSaveMission: _onSaveMission }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [activeRouteId, setActiveRouteId] = useState(homeRouteCards[0].id);
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
  const featuredGuideSlugs = [
    "vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
    "cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
    "which-low-friction-vancouver-route-should-you-open-today",
    "where-should-a-first-time-vancouver-visitor-start",
  ];
  const featuredGuides = [
    ...featuredGuideSlugs
      .map((slug) => cityGuides.find((guide) => guide.slug === slug))
      .filter((guide): guide is (typeof cityGuides)[number] => Boolean(guide)),
    ...cityGuides.filter((guide) => !featuredGuideSlugs.includes(guide.slug)),
  ].slice(0, 4);
  const starterGuidePath =
    "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first";
  const roundupGuidePath =
    "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation";
  const activeRoute = homeRouteCards.find((route) => route.id === activeRouteId) ?? homeRouteCards[0];
  const heroQuickStarts = homeRouteCards.slice(0, 4);
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
    navigate(searchResults[0]?.to ?? activeRoute.path);
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
      activeRouteId,
    });

    const input = document.getElementById(searchInputId);
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <>
      <section className="hero-grid page-top">
        <div className="home-mobile-hero-intro">
          <p className="hero-kicker">Start with the kind of day</p>
          <h1>Know the kind of Vancouver day you want? Open the right route first.</h1>
          <p>
            Skip the tab pile. Start with date night, first visit, rainy day, guests, weekend
            plan, or a lower-effort Vancouver route and let the next page do the narrowing.
          </p>
            <div className="hero-actions">
              <AppLink
                className="button primary"
                onClick={() => handleRouteClick(activeRoute, "hero_mobile_intro_primary")}
                to={activeRoute.path}
              >
                Open {activeRoute.label}
                <ArrowRightIcon />
              </AppLink>
              <AppLink className="button secondary" to={roundupGuidePath}>
                Let CityAtlas choose
              </AppLink>
            </div>
          </div>
        <article className="hero-media">
          <img
            src={activeRoute.image}
            alt={activeRoute.imageAlt}
            decoding="async"
            fetchPriority="high"
            loading="eager"
          />
          <div className="hero-copy home-hero-copy">
            <p className="hero-kicker">Start with the kind of day</p>
            <h1>Know the kind of Vancouver day you want? Open the right route first.</h1>
            <p>
              Skip the tab pile. Start with date night, first visit, rainy day, guests, weekend
              plan, or a lower-effort Vancouver route and let the next page do the narrowing.
            </p>
            <div className="hero-actions">
              <AppLink
                className="button primary"
                onClick={() => handleRouteClick(activeRoute, "hero_primary")}
                to={activeRoute.path}
              >
                Open {activeRoute.label}
                <ArrowRightIcon />
              </AppLink>
              <AppLink
                className="button secondary"
                onClick={() =>
                  onTrack("home_roundup_clicked", {
                    location: "hero_secondary",
                  })
                }
                to={roundupGuidePath}
              >
                Let CityAtlas choose
              </AppLink>
            </div>
            <div className="home-hero-lane-group">
              <p className="home-hero-lane-label">Fastest starts</p>
              <div className="home-hero-lane-row">
                {heroQuickStarts.map((route) => (
                  <AppLink
                    className="home-hero-lane-pill"
                    key={route.id}
                    onClick={() => handleRouteClick(route, "hero_lane_pill")}
                    onFocus={() => setActiveRouteId(route.id)}
                    onMouseEnter={() => setActiveRouteId(route.id)}
                    to={route.path}
                  >
                    <strong>{route.label}</strong>
                    <span>{route.kicker}</span>
                  </AppLink>
                ))}
              </div>
            </div>
          </div>
          <div className="hero-mobile-image-caption">
            <span className="hero-route-preview-kicker">{activeRoute.kicker}</span>
            <strong>{activeRoute.label}</strong>
            <p>{activeRoute.detail}</p>
          </div>
        </article>

        <div className="hero-side-column">
          <aside className="hero-utility-panel">
            <div className="hero-utility-head">
              <div>
                <strong>Choose how to start</strong>
                <p className="hero-panel-copy">
                  Open a route when the day still needs shape. Search when you already know the
                  place. Use the roundup when you want CityAtlas to pick the fastest next page.
                </p>
              </div>
              <StatusPill tone="blue">Vancouver first</StatusPill>
            </div>

            <div className="home-start-mode-grid">
              <AppLink
                className="home-start-mode-card active"
                onClick={() => handleRouteClick(activeRoute, "hero_start_mode_route")}
                to={activeRoute.path}
              >
                <span className="home-start-mode-kicker">Start with a route</span>
                <strong>Open {activeRoute.label}</strong>
                <p>{activeRoute.kicker}. Best when the day still needs shape.</p>
              </AppLink>
              <button
                className="home-start-mode-card"
                onClick={() => handleSearchFocus("hero_start_mode_search")}
                type="button"
              >
                <span className="home-start-mode-kicker">Search a place</span>
                <strong>Search by stop or neighborhood</strong>
                <p>Use this when you already know the area, venue, park, or keyword.</p>
              </button>
              <AppLink
                className="home-start-mode-card"
                onClick={() =>
                  onTrack("home_roundup_clicked", {
                    location: "hero_start_mode_roundup",
                  })
                }
                to={roundupGuidePath}
              >
                <span className="home-start-mode-kicker">Let CityAtlas choose</span>
                <strong>Open the guide roundup</strong>
                <p>Use the fastest “what should I open?” page when you want one clear next click.</p>
              </AppLink>
            </div>

            <div className="hero-search-panel">
              <div className="home-direct-search-block">
                <strong>Already know the place or keyword?</strong>
                <p>Search direct when the route is clear and the next step is one real stop.</p>
              </div>
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
                  placeholder="Search date night, Kitsilano, cafe, wellness..."
                  value={query}
                />
                <button className="button tiny hero-search-submit" type="submit">
                  Go
                </button>
              </form>

              {query.trim() ? (
                searchResults.length > 0 ? (
                  <div className="hero-search-results">
                    {searchResults.map((item) => (
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
                      Try a neighborhood, category, or use case like rainy day, weekend, dinner,
                      guests, or wellness.
                    </p>
                  </div>
                )
              ) : (
                <>
                  <div className="hero-search-empty-active hero-search-preview">
                    <strong>Current quick start: {activeRoute.label}</strong>
                    <p>{activeRoute.detail}</p>
                  </div>
                  <div className="hero-search-suggestions">
                    {heroQuickStarts.map((route) => (
                      <AppLink
                        className={
                          route.id === activeRoute.id
                            ? "hero-search-suggestion active"
                            : "hero-search-suggestion"
                        }
                        key={`suggestion-${route.id}`}
                        onClick={() => handleRouteClick(route, "hero_search_suggestion")}
                        onFocus={() => setActiveRouteId(route.id)}
                        onMouseEnter={() => setActiveRouteId(route.id)}
                        to={route.path}
                      >
                        {route.label}
                      </AppLink>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="hero-proof-strip">
              <div className="hero-proof-chip">
                <strong>{vancouverSourceBackedPageCount} start-here pages</strong>
                <span>Real Vancouver starting points you can open now</span>
              </div>
              <div className="hero-proof-chip">
                <strong>{vancouverSourceBackedPlaceCount} named places</strong>
                <span>Vancouver spots already featured across guides</span>
              </div>
            </div>

            <div className="hero-active-route-row hero-active-route-row-primary">
              <div className="hero-active-route-copy">
                <span className="hero-route-preview-kicker">{activeRoute.kicker}</span>
                <strong>{activeRoute.title}</strong>
                <p className="hero-active-route-summary">{activeRoute.summary}</p>
              </div>
              <AppLink
                className="button secondary"
                onClick={() => handleRouteClick(activeRoute, "hero_active_route")}
                to={activeRoute.path}
              >
                Open route
              </AppLink>
            </div>
            <div className="home-panel-link-row">
              <AppLink className="text-link" to="/vancouver/guides">
                Open all guides <ArrowRightIcon />
              </AppLink>
              <AppLink className="text-link" to="/for-businesses/submit">
                Business request <ArrowRightIcon />
              </AppLink>
              <a className="text-link" href={`mailto:${siteConfig.contactEmail}`}>
                Email CityAtlas <ArrowRightIcon />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="home-next-step-band">
        <SparkIcon />
        <div className="home-next-step-band-copy">
          <span className="query-card-kicker">Start here</span>
          <strong>Want the fastest answer? Open the guide roundup first.</strong>
          <p>
            It routes people into first visit, rainy day, date night, guests, weekend, and lower-effort
            Vancouver starts without making them scan the whole library first.
          </p>
        </div>
        <div className="hero-actions">
          <AppLink className="button primary" to={roundupGuidePath}>
            Open guide roundup
          </AppLink>
          <AppLink className="button secondary" to={starterGuidePath}>
            Open the start-here guide
          </AppLink>
        </div>
      </section>

      <section className="section-block home-intro-section">
        <SectionHeader
          label="Open these first"
          title="Start with one route, then narrow the exact stop"
          copy="These are the clearest first clicks when you know the kind of day, but not the final venue yet."
          action={<StatusPill tone="green">{homeRouteCards.length} route picks</StatusPill>}
        />
        <div className="featured-route-grid">
          {homeRouteCards.map((route) => (
            <AppLink
              className="query-card query-card-link featured-route-card"
              key={`featured-${route.id}`}
              onClick={() => handleRouteClick(route, "featured_route_grid")}
              onFocus={() => setActiveRouteId(route.id)}
              onMouseEnter={() => setActiveRouteId(route.id)}
              to={route.path}
            >
              <div className="featured-route-card-media">
                <img alt={route.imageAlt} decoding="async" loading="eager" src={route.image} />
              </div>
              <span className="query-card-kicker">{route.kicker}</span>
              <strong>{route.title}</strong>
              <p>{route.summary}</p>
              <span className="query-card-hint">Open route</span>
            </AppLink>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="How to start"
          title="Choose the starting point that matches how fixed the plan already is"
          copy="CityAtlas works best when it narrows the day before it asks you to compare every possible stop."
        />
        <div className="home-explainer-grid">
          <article className="home-explainer-card">
            <span className="home-explainer-kicker">Start with intent</span>
            <strong>Use a route first when you know the kind of day, but not the exact stop.</strong>
            <p>
              This is the fastest way to avoid opening the wrong part of the city or the wrong kind
              of plan too early.
            </p>
          </article>
          <article className="home-explainer-card">
            <span className="home-explainer-kicker">Search direct</span>
            <strong>Search only when you already know the neighborhood, venue, or keyword.</strong>
            <p>
              Use direct search when the route is already obvious and the next click should land on
              one real place or one city page.
            </p>
          </article>
          <article className="home-explainer-card">
            <span className="home-explainer-kicker">Use a guide</span>
            <strong>Open a guide when you want context before choosing the exact place.</strong>
            <p>
              Guides help when you want neighborhood feel, route logic, and a better sense of the
              day before comparing specific stops.
            </p>
          </article>
        </div>
      </section>

      {featuredGuides.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Need more context?"
            title="These are the best next pages when a route still needs a fuller read"
            copy="Open these when the situation is clear enough to want a guide, but not narrow enough for one exact place yet."
            action={
              <AppLink className="text-link" to="/vancouver/guides">
                Open all guides <ArrowRightIcon />
              </AppLink>
            }
          />
          <div className="card-grid two">
            {featuredGuides.map((guide) => (
              <GuideCard guide={guide} key={guide.id} />
            ))}
          </div>
        </section>
      ) : null}

      <VancouverBusinessCoverageSection variant="home" />

      <section className="cta-band">
        <StoreIcon />
        <div>
          <h2>Run a Vancouver restaurant or local service?</h2>
          <p>
            Start with a business request when you want CityAtlas to look at the page, route, or
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
