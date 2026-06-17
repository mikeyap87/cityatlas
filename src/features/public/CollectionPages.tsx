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
        title="Vancouver event pages"
        copy="These example cards show how CityAtlas can present events more clearly. Confirm live details with hosts or official sources."
        action={<StatusPill tone="amber">Event example</StatusPill>}
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
        title="Vancouver offer pages"
        copy="These example cards show how CityAtlas can package partner perks once the business confirms the details and redemption rules."
        action={<StatusPill tone="amber">Perk example</StatusPill>}
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
  const guideRouterCards = [
    {
      title: "Need real places with official public sources?",
      copy:
        "Open the starter layer first when named Vancouver anchors matter more than broad route logic.",
      primaryLabel: "Source-backed starters",
      primaryPath: "/vancouver/date-night-starters",
      secondaryLabel: "Guide roundup",
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
      secondaryLabel: "First-time visitor starters",
      secondaryPath: "/vancouver/first-time-visitor-starters",
      meta: "First evening, first trip, repeat trip, or hosting",
    },
    {
      title: "Need one calmer weekend or reset route?",
      copy:
        "Open the lower-friction cluster when the real problem is energy, pace, and keeping the day compact.",
      primaryLabel: "Weekend and reset guides",
      primaryPath: "#weekend-guide-cluster",
      secondaryLabel: "Weekend route starters",
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
      <section className="section-block page-top">
        <SectionHeader
          label="Guides"
          title="Editorial guide system for city moments, neighborhood fit, and route intent"
          copy="These pages are designed to answer real Vancouver planning questions fast, then connect people into discovery pages, missions, and partner paths."
          action={<StatusPill tone="blue">Route logic first</StatusPill>}
        />
        <div className="split-section">
          <div className="source-panel">
            <SectionHeader
              label="Start here"
              title="Open the right guide cluster before the city gets overbuilt"
              copy="CityAtlas works best when someone starts with the right planning question first: weather, visitor type, neighborhood choice, weekend shape, or a source-backed real-place layer."
            />
            <div className="guide-query-grid">
              {starterPackGuide ? (
                <AppLink
                  className="query-card query-card-link"
                  to={`/vancouver/guides/${starterPackGuide.slug}`}
                >
                  <strong>Starter-pack guide</strong>
                  <p>Choose the right CityAtlas page first when the main problem is where to begin.</p>
                </AppLink>
              ) : null}
              <a className="query-card query-card-link" href="#visitor-guide-cluster">
                <strong>Visitors and hosts</strong>
                <p>Move into first-time, returning-visitor, first-evening, and guest-hosting routes.</p>
              </a>
              <a className="query-card query-card-link" href="#weekend-guide-cluster">
                <strong>Weekend and reset</strong>
                <p>Open the cluster for wellness, Sunday, and compact weekend-route planning.</p>
              </a>
              <a className="query-card query-card-link" href="#neighborhood-guide-cluster">
                <strong>Neighborhood choice</strong>
                <p>Use these pages when the first decision is which part of Vancouver fits the plan, then move into the Gastown, Mount Pleasant, and Kitsilano starter trio.</p>
              </a>
              <AppLink className="query-card query-card-link" to="/vancouver/date-night-starters">
                <strong>Source-backed starters</strong>
                <p>Jump straight to official-source route anchors when real-place clarity matters first.</p>
              </AppLink>
              <AppLink className="query-card query-card-link" to="/vancouver/garden-day-starters">
                <strong>Garden day starters</strong>
                <p>Use this when the route should choose between conservatory calm, hilltop gardens, and fuller botanical pacing before the day sprawls.</p>
              </AppLink>
              <AppLink className="query-card query-card-link" to="/vancouver/kitsilano-scenic-starters">
                <strong>Kitsilano scenic starters</strong>
                <p>Use this narrower west-side source-backed layer when the plan needs scenic anchors instead of a full-city route.</p>
              </AppLink>
              <AppLink className="query-card query-card-link" to="/vancouver/west-side-daytime-starters">
                <strong>West-side daytime starters</strong>
                <p>Use this when the route should start with beaches, gardens, or UBC culture before the day gets overbuilt.</p>
              </AppLink>
              <AppLink className="query-card query-card-link" to="/vancouver/false-creek-culture-starters">
                <strong>False Creek culture starters</strong>
                <p>Use this when the route should stay compact around markets, museums, Vanier Park, and one culture-afternoon shape.</p>
              </AppLink>
              <AppLink className="query-card query-card-link" to="/vancouver/ubc-discovery-starters">
                <strong>UBC discovery starters</strong>
                <p>Use this when the route should stay campus-side around museums, gardens, and one contained west-side discovery day.</p>
              </AppLink>
              <AppLink className="query-card query-card-link" to="/vancouver/missions">
                <strong>Saveable missions</strong>
                <p>Move here once the route type is clear and the next step is saving or reusing the plan.</p>
              </AppLink>
            </div>
          </div>
          <div className="source-panel">
            <SectionHeader
              label="Cluster health"
              title="The guide system now covers the strongest Vancouver planning moments"
              copy="These clusters give readers a clearer map of CityAtlas than one flat article library would."
            />
            <div className="guide-query-grid">
              <article className="query-card">
                <strong>{dateAndWeatherGuides.length} route-and-weather guides</strong>
                <p>Date night, rainy day, and work-mode planning sit together because they answer compact city-moment questions.</p>
              </article>
              <article className="query-card">
                <strong>{visitorGuides.length} visitor and host guides</strong>
                <p>Visitor-intent pages now connect first arrival, second-look plans, guest hosting, and the starter-pack path.</p>
              </article>
              <article className="query-card">
                <strong>{weekendAndResetGuides.length} weekend and reset guides</strong>
                <p>Weekend-route, Sunday, and wellness pages keep calmer, lower-friction route questions in one crawlable area.</p>
              </article>
              <article className="query-card">
                <strong>{neighborhoodGuides.length} neighborhood guides</strong>
                <p>These pages now include a full neighborhood starter trio plus chooser pages so CityAtlas can explain place fit before named-venue browsing.</p>
              </article>
            </div>
          </div>
        </div>
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
            <strong>Itinerary starter pack</strong>
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
          copy="This turns the guide library into a clearer route map for real readers: start with the situation, then open the guide or starter layer that already fits it."
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
          label="Other city preview"
          title="Toronto is the first narrower CityAtlas city preview"
          copy="Use the Toronto preview when the strongest next move is one first-visit starting-area question or one compact weekend-route question, not the full Vancouver route library."
          action={<StatusPill tone="blue">Second-city preview</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink className="query-card query-card-link" to="/toronto/guides">
            <strong>Toronto guide hub</strong>
            <p>Start with the Toronto guide hub when the plan needs one cleaner first-visit or weekend-route decision instead of a generic city roundup.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/first-time-visitor-starters">
            <strong>Toronto starter page</strong>
            <p>Open the official-source Toronto starter page for a narrower first-visit layer with visible claim limits and correction paths.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/toronto/guides/where-should-a-first-time-toronto-visitor-start"
          >
            <strong>Toronto destination guide</strong>
            <p>Read the Toronto destination guide when the key decision is Distillery, St. Lawrence, Harbourfront, AGO, or ROM first.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/weekend-route-starters">
            <strong>Toronto weekend starter page</strong>
            <p>Open the official-source Toronto weekend page when the key decision is one flexible weekend anchor instead of a scattered cross-city plan.</p>
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
            copy="These pages keep Sunday, wellness, and one-anchor weekend planning together so the route logic reads like a system instead of scattered articles."
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
            label="Destination starters"
            title="Neighborhood-intent pages for clearer Vancouver choices"
            copy="These guides answer which part of Vancouver fits the plan before the reader gets dragged into venue-by-venue browsing, now with dedicated starter pages for Gastown, Mount Pleasant, and Kitsilano."
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
              label="Source-backed now"
              title="Need pages that name real Vancouver places more carefully?"
              copy="CityAtlas now has narrow Vancouver date-night, rainy-day, Sunday, weekend-route, wellness-reset, guest-hosting, first-evening, first-time-visitor, returning-visitor, Kitsilano-scenic, False Creek culture, and UBC discovery pages built from official public sources, visible claim boundaries, and a public correction path."
            />
          </div>
          <div className="source-panel">
            <p>
              This lets the guide system stay useful without pretending every real venue page is
              already fully verified. Use it as the bridge between route logic and careful real-world coverage.
            </p>
            <div className="hero-actions">
              <AppLink className="button primary" to="/vancouver/date-night-starters">
                Open source-backed starters <ArrowRightIcon />
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/rainy-day-starters">
                Rainy-day starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/first-evening-starters">
                First-evening starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/first-time-visitor-starters">
                First-time visitor starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/garden-day-starters">
                Garden day starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/kitsilano-scenic-starters">
                Kitsilano scenic starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/west-side-daytime-starters">
                West-side daytime starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/false-creek-culture-starters">
                False Creek culture starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/ubc-discovery-starters">
                UBC discovery starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/returning-visitor-starters">
                Returning-visitor starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/out-of-town-guest-starters">
                Out-of-town guest starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/weekend-route-starters">
                Weekend route starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/sunday-starters">
                Sunday starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/wellness-reset-starters">
                Wellness reset starters
              </AppLink>
              <AppLink
                className="button secondary"
                to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
              >
                Starter pack guide
              </AppLink>
              {routeRoundupGuide ? (
                <AppLink
                  className="button secondary"
                  to={`/vancouver/guides/${routeRoundupGuide.slug}`}
                >
                  Guide roundup
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
            decision, or a business review path instead of ending as a dead article.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/missions">
          Open missions <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
