import { useEffect, useState } from "react";
import type { CityAtlasData, CityMission, NewsletterLead } from "../../types";
import { siteConfig } from "../../config/site";
import {
  getActiveVariant,
  getNextBestAction,
  variantCopy,
} from "../../lib/experiments";
import { buildPublicBusinessCoverageSnapshot } from "../../lib/publicBusinessCoverage";
import { AppLink } from "../../components/Link";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapIcon,
  SearchIcon,
  ShieldIcon,
  SparkIcon,
  StoreIcon,
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
import { VancouverBusinessCoverageSection } from "./VancouverBusinessCoverageSection";

interface HomePageProps {
  data: CityAtlasData;
  onNewsletter: (email: string, interest: NewsletterLead["interest"]) => NewsletterLead;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
  onSaveMission: (mission: CityMission) => void;
}

export function HomePage({ data, onNewsletter, onTrack, onSaveMission }: HomePageProps) {
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
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
  const sourceBackedWedgeCount = featuredSourceBackedCollections.filter(
    (collection) => collection.length > 0,
  ).length;
  const businessCoverage = buildPublicBusinessCoverageSnapshot(data);

  useEffect(() => {
    onTrack("experiment_exposed", { experiment: "homepage_positioning", variant: activeVariant });
  }, [activeVariant, onTrack]);

  return (
    <>
      <section className="hero-grid">
        <div className="hero-media">
          <img src={siteConfig.media.hero} alt="" />
          <div className="hero-copy">
            <h1>{copy.heroTitle}</h1>
            <p>
              {copy.heroCopy}
            </p>
            <div className="hero-actions">
              <AppLink className="button primary" to={activeVariant === "weekend-atlas" ? "/planner" : "/vancouver"}>
                {copy.primaryCta}
                <ArrowRightIcon />
              </AppLink>
              <AppLink className="button secondary" to="/for-businesses/pricing">
                For businesses
              </AppLink>
            </div>
          </div>
        </div>

        <div className="hero-map-panel">
          <div className="map-toolbar">
            <strong>Vancouver city map</strong>
            <StatusPill tone="blue">City view</StatusPill>
          </div>
          <div className="atlas-map" aria-label="Stylized Vancouver coverage map">
            <span className="pin pin-a">12</span>
            <span className="pin pin-b">8</span>
            <span className="pin pin-c">4</span>
            <span className="pin pin-d">9</span>
            <span className="pin pin-e">6</span>
          </div>
          <div className="hero-search-row">
            <SearchIcon />
            <span>Search places, events, offers, guides...</span>
          </div>
          <div className="hero-tabs" aria-label="Discovery categories">
            <span><StoreIcon /> Places</span>
            <span><CalendarIcon /> Events</span>
            <span><SparkIcon /> Offers</span>
            <span><MapIcon /> Guides</span>
          </div>
        </div>

        <aside className="partner-panel">
          <p className="section-label">For businesses</p>
          <h2>{copy.partnerHeadline}</h2>
          <p>
            {copy.partnerCopy}
          </p>
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
        </aside>
      </section>

      <section className="metrics-strip">
        <MetricCard label="Guide pages" value={`${cityGuides.length}`} detail="Answer-first Vancouver planning pages" />
        <MetricCard label="Source-backed clusters" value={`${sourceBackedWedgeCount}`} detail="Official-source planning groups" />
        <MetricCard label="Businesses tracked" value={`${businessCoverage.totalBusinesses}`} detail="Vancouver businesses already mapped into the coverage base" />
        <MetricCard label="City missions" value={`${data.cityMissions.length}`} detail="Saveable route loops" />
      </section>

      <section className="section-block">
        <SectionHeader
          label="Next city preview"
          title="Toronto now has a narrow first-visit preview inside CityAtlas"
          copy="The second city stays intentionally small for now: one Toronto guide hub, two official-source starter pages, and two answer-first guides for people who need a cleaner first visit or one compact weekend shape."
          action={<StatusPill tone="blue">Toronto preview</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink className="query-card query-card-link" to="/toronto/guides">
            <strong>Toronto guide hub</strong>
            <p>Open the Toronto preview when the real question is where a first-time visitor should begin or how to keep a weekend compact, not how to cover the whole city.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/first-time-visitor-starters">
            <strong>Toronto first-time visitor starters</strong>
            <p>Use the official-source starter page for Distillery, St. Lawrence, Harbourfront, AGO, and ROM starting-area fit.</p>
          </AppLink>
          <AppLink
            className="query-card query-card-link"
            to="/toronto/guides/where-should-a-first-time-toronto-visitor-start"
          >
            <strong>Toronto destination guide</strong>
            <p>Read the answer-first Toronto guide when the goal is choosing the right first impression instead of building a giant itinerary.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/toronto/weekend-route-starters">
            <strong>Toronto weekend route starters</strong>
            <p>Use the official-source starter page for STACKT, Toronto Music Garden, The Bentway, Evergreen Brick Works, and Toronto Botanical Garden route fit.</p>
          </AppLink>
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel">
          <SectionHeader
            label="What is CityAtlas?"
            title="A Vancouver-first city guide, route planner, and local discovery layer"
            copy="CityAtlas is designed to answer real city-planning questions quickly, then turn those answers into routes, saved plans, and better local business discovery."
          />
          <div className="tag-cloud">
            <span>Date night planning</span>
            <span>Rainy-day Vancouver ideas</span>
            <span>Weekend route ideas</span>
            <span>Low-friction route chooser</span>
            <span>Wellness reset routes</span>
            <span>Work-friendly cafe decisions</span>
            <span>First-evening visitor plans</span>
            <span>First-time visitor starting areas</span>
            <span>Returning-visitor local discovery</span>
          </div>
        </div>
        <div className="source-panel">
          <SectionHeader
            label="Why it is different"
            title="Built around route logic, not endless city tabs"
            copy="The strongest CityAtlas page is not a giant list. It is one clear answer, one neighborhood logic, and one next action that helps someone actually decide what to do."
          />
          <div className="hero-actions">
            <AppLink className="button secondary" to="/about">
              About CityAtlas
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
            >
              Starter pack
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
            >
              Guide roundup
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today"
            >
              Low-friction guide
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
            copy="These destination-intent pages help readers choose the right neighborhood before they overthink the exact stops. CityAtlas now has starter pages for Gastown, Mount Pleasant, and Kitsilano."
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
              label="Source-backed now"
              title="Official-source Vancouver starter pages for date nights, visitors, weekends, wellness, and neighborhood choices"
              copy="CityAtlas now has fourteen narrow source-backed pages that name real route anchors, link directly to official sources, and keep claim boundaries visible."
              action={<StatusPill tone="green">{sourceBackedWedgeCount} source-backed clusters</StatusPill>}
            />
            <div className="tag-cloud">
              {featuredSourceBackedPlaces.map((reference) => (
                <span key={reference.id}>{reference.name}</span>
              ))}
            </div>
          </div>
          <div className="source-panel">
            <SectionHeader
              label="Trust layer"
              title="Useful enough to cite, honest enough to trust"
              copy="CityAtlas starts with smaller coverage, direct official sources, visible correction paths, and route pages that do not overclaim."
            />
            <div className="hero-actions">
              <AppLink className="button primary" to="/vancouver/date-night-starters">
                Date-night starters <ArrowRightIcon />
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
          label="Business page examples"
          title="Preview how fuller reviewed business pages can look"
          copy="These example cards show the business-page format CityAtlas can grow into after review. The stronger live ranking surface still starts with routes, guides, and source-backed planning pages."
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
          label="City missions"
          title="Saveable routes built for repeat visits and sharing"
          copy="Make a plan, save it, share it, and turn a good city idea into something easy to reuse."
          action={<AppLink className="text-link" to="/vancouver/missions">View missions <ArrowRightIcon /></AppLink>}
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
            title="Flexible modules for local campaigns"
            copy="CityAtlas can support events, perks, guide placement, and future sponsor campaigns without overclaiming what is active today."
          />
          <div className="stacked-list">
            {data.events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            label="Partner examples"
            title="How partner perks can appear"
            copy="These example cards show how partner perks can appear once the business confirms the details, timing, and redemption rules."
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
          title="Editorial packaging for neighborhoods, categories, and city-planning decisions"
          copy="Guides turn broad city intent into something useful and easy to act on."
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
            CityAtlas avoids traffic, booking, ranking, review, and offer claims unless the source
            support is clear and the page scope can support them honestly.
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
            CityAtlas is opening updates in stages. Save your email in this browser and keep the
            referral code handy for future invites.
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
