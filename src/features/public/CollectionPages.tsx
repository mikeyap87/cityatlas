import type { CityAtlasData } from "../../types";
import { AppLink } from "../../components/Link";
import { EventCard, GuideCard, OfferCard } from "../../components/Cards";
import { ArrowRightIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";
import { getSourceBackedPlaces } from "../../lib/sourceBackedCollections";

export function EventsPage({ data }: { data: CityAtlasData }) {
  return (
    <section className="section-block page-top">
      <SectionHeader
        label="Events"
        title="Vancouver event examples"
        copy="These examples show how CityAtlas can present local events once timing, venue details, and public source links are confirmed."
        action={<StatusPill tone="amber">Event examples</StatusPill>}
      />
      <div className="card-grid two">
        {data.events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </section>
  );
}

export function OffersPage({ data }: { data: CityAtlasData }) {
  return (
    <section className="section-block page-top">
      <SectionHeader
        label="Offers"
        title="Vancouver offer examples"
        copy="These examples show how CityAtlas can package local offers once the business confirms the details and redemption rules."
        action={<StatusPill tone="amber">Offer examples</StatusPill>}
      />
      <div className="card-grid two">
        {data.offers.map((offer) => (
          <OfferCard
            offer={offer}
            business={data.businesses.find((business) => business.id === offer.businessId)}
            key={offer.id}
          />
        ))}
      </div>
    </section>
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
  const guideRouterCards = [
    {
      title: "Need real places with official public sources?",
      copy:
        "Open the official source page first when named Vancouver places matter more than broad route logic.",
      primaryLabel: "Official source pages",
      primaryPath: "/vancouver/date-night-starters",
      secondaryLabel: "Browse by situation",
      secondaryPath:
        "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
      meta: "Best for trust-first real-place routing",
    },
    {
      title: "Need the right page for a visitor or guest?",
      copy:
        "Use the visitor-intent cluster when the strongest answer changes with who the city plan is for.",
      primaryLabel: "Visitor and host guides",
      primaryPath: "#visitor-guide-cluster",
      secondaryLabel: "First-time visitor starting points",
      secondaryPath: "/vancouver/first-time-visitor-starters",
      meta: "First evening, first trip, repeat trip, or hosting",
    },
    {
      title: "Need one calmer weekend or reset route?",
      copy:
        "Open the easier weekend group when the real problem is energy, pace, and keeping the day compact.",
      primaryLabel: "Weekend and reset guides",
      primaryPath: "#weekend-guide-cluster",
      secondaryLabel: "Weekend route starting points",
      secondaryPath: "/vancouver/weekend-route-starters",
      meta: "Weekend, Sunday, and wellness-first planning",
    },
    {
      title: "Need to choose the part of Vancouver first?",
      copy:
        "Use neighborhood and destination-choice pages when place fit matters more than one exact stop.",
      primaryLabel: "Neighborhood guides",
      primaryPath: "#neighborhood-guide-cluster",
      secondaryLabel: "Neighborhood chooser",
      secondaryPath:
        "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
      meta: "Destination intent before venue-by-venue browsing",
    },
  ];

  return (
    <>
      <section className="city-hero guide-library-hero page-top">
        <div>
          <p className="section-label">Guides</p>
          <h1>Vancouver guides for real plans, neighborhood choice, and easier starts</h1>
          <p>
            Start with the question you need answered, then open the guide or page with official
            links that already fits the day.
          </p>
          <div className="hero-actions">
            {starterPackGuide ? (
              <AppLink
                className="button primary"
                to={`/vancouver/guides/${starterPackGuide.slug}`}
              >
                Where should I start?
              </AppLink>
            ) : null}
            <AppLink className="button secondary" to="/vancouver/date-night-starters">
              Pages with official links
            </AppLink>
          </div>
        </div>
        <div className="public-intro-card">
          <div className="public-intro-card-header">
            <div>
              <strong>Open the right guide group first</strong>
              <p>These are the fastest entry points when you want a plan, not a long city list.</p>
            </div>
            <StatusPill tone="blue">{officialLinkPageCount} live official-link pages</StatusPill>
          </div>
          <div className="public-intro-card-grid">
            <a className="public-intro-link" href="#visitor-guide-cluster">
              <strong>Visitors and hosts</strong>
              <span>{visitorGuides.length} guides for first visits, return trips, and guest plans.</span>
            </a>
            <a className="public-intro-link" href="#weekend-guide-cluster">
              <strong>Weekend and reset</strong>
              <span>{weekendAndResetGuides.length} guides for calmer weekends, Sundays, and wellness days.</span>
            </a>
            <a className="public-intro-link" href="#neighborhood-guide-cluster">
              <strong>Neighborhood choice</strong>
              <span>{neighborhoodGuides.length} pages for picking the right part of Vancouver first.</span>
            </a>
            <AppLink className="public-intro-link" to="/vancouver/missions">
              <strong>Saved plans</strong>
              <span>Turn a good guide into a route you can keep, reuse, and share more easily.</span>
            </AppLink>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="guide-query-grid">
          <article className="query-card">
            <strong>Date night</strong>
            <p>Confident plans that stay local, efficient, and easy to share.</p>
          </article>
          <article className="query-card">
            <strong>Rainy day Vancouver</strong>
            <p>Indoor-friendly routes with clear neighborhood logic and low friction.</p>
          </article>
          <article className="query-card">
            <strong>Wellness reset</strong>
            <p>Recovery, movement, and calm-hour planning without inflated claims.</p>
          </article>
          <article className="query-card">
            <strong>Neighborhood chooser</strong>
            <p>Help people pick the right part of Vancouver before they overbuild the night.</p>
          </article>
          <article className="query-card">
            <strong>First evening in Vancouver</strong>
            <p>Compact visitor loops that orient a new arrival without turning night one into a marathon.</p>
          </article>
          <article className="query-card">
            <strong>Where should a first-time visitor start?</strong>
            <p>Destination-choice guidance that helps a new arrival choose the right part of Vancouver first.</p>
          </article>
          <article className="query-card">
            <strong>Returning Vancouver visitor ideas</strong>
            <p>Local-discovery guidance for people who want a second-look city plan instead of repeating the obvious first trip.</p>
          </article>
          <article className="query-card">
            <strong>Hosting out-of-town guests</strong>
            <p>Low-pressure city introductions that help a host pick one easy Vancouver anchor instead of an all-day marathon.</p>
          </article>
          <article className="query-card">
            <strong>Where to start</strong>
            <p>Use this when the first problem is choosing the right CityAtlas page before the day gets overbuilt.</p>
          </article>
          <article className="query-card">
            <strong>Weekend route ideas</strong>
            <p>One-anchor weekend planning that keeps the day compact instead of bouncing across the city.</p>
          </article>
          <article className="query-card">
            <strong>Low-effort Vancouver Sunday plan</strong>
            <p>Help someone choose one gentle Sunday anchor instead of overfilling the day with a cross-city weekend checklist.</p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Situation router"
          title="Choose the strongest next CityAtlas page by planning moment"
          copy="This turns the guide library into a clearer route map for real readers: start with the situation, then open the guide or official source layer that already fits it."
          action={<StatusPill tone="blue">Decision-first route links</StatusPill>}
        />
        <div className="guide-query-grid">
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

      <section className="section-block">
        <SectionHeader
          label="Next city"
          title="Toronto is the first smaller CityAtlas guide set"
          copy="Use Toronto when the strongest next move is one first-visit starting-area question or one compact weekend-route question, not the full Vancouver guide library."
          action={<StatusPill tone="blue">Toronto guide hub</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink className="query-card query-card-link" to="/toronto/guides">
            <strong>Toronto guide hub</strong>
            <p>Start with the Toronto guide hub when the plan needs one cleaner first-visit or weekend-route decision instead of a generic city roundup.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/first-time-visitor-starters">
            <strong>Toronto starting points</strong>
            <p>Open the official source Toronto page for a narrower first-visit layer with visible claim limits and correction paths.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/toronto/guides/where-should-a-first-time-toronto-visitor-start"
          >
            <strong>Toronto destination guide</strong>
            <p>Read the Toronto destination guide when the key decision is Distillery, St. Lawrence, Harbourfront, AGO, or ROM first.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/weekend-route-starters">
            <strong>Toronto weekend starting points</strong>
            <p>Open the official source Toronto weekend page when the key decision is one flexible weekend anchor instead of a scattered cross-city plan.</p>
          </AppLink>
        </div>
      </section>

      {dateAndWeatherGuides.length > 0 ? (
        <section className="section-block" id="route-weather-guide-cluster">
          <SectionHeader
            label="Route and weather cluster"
            title="Guides for compact city moments"
            copy="These pages answer the highest-frequency route questions first: date night, rainy days, first evening, and work-mode tradeoffs."
            action={<StatusPill tone="green">{dateAndWeatherGuides.length} guides</StatusPill>}
          />
          <div className="card-grid two">
            {dateAndWeatherGuides.map((guide) => (
              <GuideCard guide={guide} key={guide.id} />
            ))}
          </div>
        </section>
      ) : null}

      {visitorGuides.length > 0 ? (
        <section className="section-block" id="visitor-guide-cluster">
          <SectionHeader
            label="Visitor and host cluster"
            title="Guides for first arrivals, repeat visits, and guest plans"
            copy="This cluster makes CityAtlas easier to classify for visitor-intent and host-intent questions without collapsing everything into generic tourism copy."
            action={<StatusPill tone="green">{visitorGuides.length} guides</StatusPill>}
          />
          <div className="card-grid two">
            {visitorGuides.map((guide) => (
              <GuideCard guide={guide} key={guide.id} />
            ))}
          </div>
        </section>
      ) : null}

      {weekendAndResetGuides.length > 0 ? (
        <section className="section-block" id="weekend-guide-cluster">
          <SectionHeader
            label="Weekend and reset cluster"
            title="Guides for calmer weekend shapes and recovery-led plans"
            copy="These pages keep Sunday, wellness, and one-anchor weekend planning together so the library feels easier to browse and easier to trust."
            action={<StatusPill tone="green">{weekendAndResetGuides.length} guides</StatusPill>}
          />
          <div className="card-grid two">
            {weekendAndResetGuides.map((guide) => (
              <GuideCard guide={guide} key={guide.id} />
            ))}
          </div>
        </section>
      ) : null}

      {neighborhoodGuides.length > 0 ? (
        <section className="section-block" id="neighborhood-guide-cluster">
          <SectionHeader
            label="Destination starting points"
            title="Neighborhood-intent pages for clearer Vancouver choices"
            copy="These guides answer which part of Vancouver fits the plan before the reader gets dragged into venue-by-venue browsing, now with dedicated starting-point pages for Gastown, Mount Pleasant, and Kitsilano."
            action={<StatusPill tone="green">{neighborhoodGuides.length} guides</StatusPill>}
          />
          <div className="card-grid three">
            {(neighborhoodStarterGuides.length > 0
              ? [...neighborhoodStarterGuides, ...neighborhoodGuides.filter((guide) => guide.category !== "Neighborhood Starter")]
              : neighborhoodGuides
            ).map((guide) => (
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
              label="Official source pages"
              title="Need pages that name real Vancouver places more carefully?"
              copy="CityAtlas now has narrow Vancouver date-night, rainy-day, Sunday, weekend-route, wellness-reset, guest-hosting, first-evening, first-time-visitor, returning-visitor, Kitsilano-scenic, False Creek culture, and UBC discovery pages built from official public sources, clear claim limits, and a public correction path."
            />
          </div>
          <div className="source-panel">
            <p>
              This lets the guide system stay useful without pretending every real venue page is
              already fully verified. Use it as the bridge between route logic and careful real-world coverage.
            </p>
            <div className="hero-actions">
              <AppLink className="button primary" to="/vancouver/date-night-starters">
                Open official source pages <ArrowRightIcon />
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/rainy-day-starters">
                Rainy day
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/first-evening-starters">
                First evening
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/first-time-visitor-starters">
                First visit
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/garden-day-starters">
                Garden day
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/kitsilano-scenic-starters">
                Kitsilano
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/west-side-daytime-starters">
                West-side day
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/false-creek-culture-starters">
                False Creek
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/ubc-discovery-starters">
                UBC day
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/returning-visitor-starters">
                Returning visit
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/out-of-town-guest-starters">
                Hosting guests
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/weekend-route-starters">
                Weekend route
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/sunday-starters">
                Sunday plan
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/wellness-reset-starters">
                Wellness reset
              </AppLink>
              <AppLink
                className="button secondary"
                to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
              >
                Where to start guide
              </AppLink>
              {routeRoundupGuide ? (
                <AppLink
                  className="button secondary"
                  to={`/vancouver/guides/${routeRoundupGuide.slug}`}
                >
                  Browse by situation
                </AppLink>
              ) : null}
              <AppLink className="button secondary" to="/editorial-standards">
                Editorial standards
              </AppLink>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <SectionHeader
          label="All guides"
          title="Answer-first Vancouver guide library"
          copy="CityAtlas should win with useful route logic, neighborhood fit, and planning help, not generic listicles."
        />
        <div className="card-grid two">
          {cityGuides.map((guide) => (
            <GuideCard guide={guide} key={guide.id} />
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Turn guide traffic into saved plans and stronger local discovery</h2>
          <p>
            Every guide should point readers toward a route, a planner action, a neighborhood
            decision, or a business request path instead of ending as a dead article.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/missions">
          Open saved plans <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
