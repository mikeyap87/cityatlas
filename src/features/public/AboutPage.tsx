import { AppLink } from "../../components/Link";
import { ArrowRightIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { siteConfig } from "../../config/site";
import { HeroMediaCard, SectionHeader } from "../../components/UI";

const aboutAudienceGroups = [
  "Locals deciding what to do tonight",
  "Couples planning a date night",
  "Visitors planning a first evening",
  "Returning visitors who want a second-look plan",
  "Hosts planning for out-of-town guests",
  "People planning one easy Vancouver weekend plan",
  "People planning one low-effort Vancouver Sunday",
  "People looking for a rainy-day or wellness reset",
  "Neighborhood businesses improving local visibility",
  "Service businesses improving local visibility",
] as const;

export function AboutPage() {
  return (
    <>
      <section className="city-hero city-hero-about">
        <div className="city-hero-copy">
          <p className="section-label">About CityAtlas</p>
          <h1>CityAtlas helps people choose the right Vancouver start</h1>
          <p>
            CityAtlas helps locals and visitors choose the right guide, saved plan, or local place
            first. It also helps Vancouver businesses and service operators show up more clearly in
            local discovery.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/guides">
              Read Vancouver guides <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/pricing">
              For businesses
            </AppLink>
          </div>
        </div>
        <div className="starter-hero-side about-hero-side">
          <HeroMediaCard
            image={siteConfig.media.about}
            alt="Illustrated market scene inspired by Granville Island Public Market in Vancouver"
            eyebrow="How CityAtlas helps"
            title="One clear starting point beats a long city list"
            copy="Choose the right part of Vancouver first, then open the guide, plan, or local place that actually fits."
          />
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel">
          <SectionHeader
            label="How CityAtlas helps"
            title="Choose the right first step, then open the next real stop"
            copy="CityAtlas works best when each page answers one planning job clearly and does not force you through a giant city directory first."
          />
          <ul className="plain-list compact">
            <li>One question per guide keeps the planning path easy to follow.</li>
            <li>Saved plans help when you want to keep a route, not just read about it.</li>
            <li>Open a local place when the next move is a real stop, not more browsing.</li>
            <li>Vancouver is the deepest city today, and Toronto shows the same structure can travel well.</li>
            <li>The business side can also start with local services that need clearer city-facing positioning.</li>
          </ul>
        </div>
        <div className="source-panel about-quick-links-panel">
          <MapIcon />
          <h2>Best first paths</h2>
          <p>
            CityAtlas is built around strong first pages, neighborhood choice, and visible source
            links, not a giant list of places.
          </p>
          <div className="guide-query-grid about-quick-links">
            <AppLink className="query-card query-card-link" to="/vancouver/guides">
              <strong>Vancouver guides</strong>
              <p>Start with clear Vancouver guides.</p>
            </AppLink>
            <AppLink className="query-card query-card-link" to="/vancouver/date-night-starters">
              <strong>Local places</strong>
              <p>Open local places when the next step is a real stop.</p>
            </AppLink>
            <AppLink className="query-card query-card-link" to="/for-businesses/pricing">
              <strong>For businesses</strong>
              <p>See packages and the business request path.</p>
            </AppLink>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel">
          <SectionHeader
            label="Best for"
            title="People who want one good Vancouver answer first"
            copy="The strongest pages answer one planning question clearly, then connect into the next useful guide, saved plan, or local place."
          />
          <div className="tag-cloud">
            {aboutAudienceGroups.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="source-panel">
          <SectionHeader
            label="What CityAtlas avoids"
            title="Not a generic city directory"
            copy="CityAtlas should not read like a faceless travel listicle, a generic authority site, or a pile of unsupported 'best of' claims."
          />
          <ul className="plain-list compact">
            <li>No unsupported rankings or inflated 'top' language without clear official support.</li>
            <li>No public claims about real businesses unless official details and correction paths are clear.</li>
            <li>No city pages that try to cover everyone without a concrete use case.</li>
          </ul>
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel">
          <SparkIcon />
          <h2>How CityAtlas works</h2>
          <ul className="plain-list compact">
            <li>Guides help people solve one specific Vancouver planning question.</li>
            <li>Saved plans turn those ideas into reusable local plans.</li>
            <li>Local places stay clear about what they checked and where the source lives.</li>
            <li>Businesses and service operators can request a page or package through a simpler review flow.</li>
          </ul>
        </div>
        <div className="source-panel">
          <ShieldIcon />
          <h2>Trust model</h2>
          <p>
            CityAtlas keeps local places with official links, planning guides, example business listings,
            and business-submitted updates clearly labeled. That makes it easier to tell what is
            confirmed now and what still needs more checking.
          </p>
          <div className="guide-query-grid about-trust-grid">
            <AppLink className="query-card query-card-link" to="/vancouver/date-night-starters">
              <strong>Date night and rainy day</strong>
              <p>Start with local places when you want a cleaner evening plan or a simple weather backup.</p>
            </AppLink>
            <AppLink className="query-card query-card-link" to="/vancouver/first-time-visitor-starters">
              <strong>Visitors and hosts</strong>
              <p>Use the first-visit and guest pages when you need a strong introduction to Vancouver.</p>
            </AppLink>
            <AppLink className="query-card query-card-link" to="/vancouver/weekend-route-starters">
              <strong>Weekend and reset</strong>
              <p>Open the weekend, Sunday, or wellness pages when the real job is keeping the day easy.</p>
            </AppLink>
            <AppLink className="query-card query-card-link" to="/editorial-standards">
              <strong>Trust and corrections</strong>
              <p>Review the source rules or report an issue when something looks wrong or outdated.</p>
            </AppLink>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Best next step</h2>
          <p>
            Start with Vancouver guides if you want the clearest picture of the planning
            questions CityAtlas answers best today. Toronto already shows how the same shape can
            expand into the next city.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/guides">
          Open Vancouver guides <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
