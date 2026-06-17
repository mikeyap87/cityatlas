import { AppLink } from "../../components/Link";
import { ArrowRightIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";

export function AboutPage() {
  return (
    <>
      <section className="city-hero">
        <div>
          <p className="section-label">About CityAtlas</p>
          <h1>CityAtlas is a Vancouver-first city guide and local discovery system</h1>
          <p>
            CityAtlas helps locals and visitors figure out what to do next with answer-first
            guides, saveable routes, and trust-first business pages. It also helps neighborhood
            businesses understand how they can show up more clearly in local discovery.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/guides">
              Read Vancouver guides <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/toronto/guides">
              Toronto preview
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/missions">
              See city missions
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/first-time-visitor-starters">
              Visitor starters
            </AppLink>
          </div>
        </div>
        <div className="source-panel">
          <MapIcon />
          <h2>What makes it different</h2>
          <p>
            CityAtlas is built around route logic, neighborhood fit, and trust labels, not just a
            giant list of places. The goal is to make city planning easier to act on, easier to
            share, and easier to understand.
          </p>
          <StatusPill tone="blue">Vancouver first</StatusPill>
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel">
          <SectionHeader
            label="Who it is for"
            title="Best for people who want a confident plan fast"
            copy="The strongest CityAtlas pages should answer a specific city-planning question, then connect into a route, a saved plan, or a business discovery path."
          />
          <div className="tag-cloud">
            <span>Locals deciding what to do tonight</span>
            <span>Couples planning a date night</span>
            <span>Visitors planning a first evening</span>
            <span>Returning visitors who want a second-look route</span>
            <span>Hosts planning for out-of-town guests</span>
            <span>People planning one easy Vancouver weekend route</span>
            <span>People planning one low-effort Vancouver Sunday</span>
            <span>People looking for a rainy-day or wellness reset</span>
            <span>Neighborhood businesses improving local visibility</span>
          </div>
        </div>
        <div className="source-panel">
          <SectionHeader
            label="What it is not"
            title="Not a generic city directory"
            copy="CityAtlas should not read like a faceless travel listicle, a fake authority site, or a pile of unsupported 'best of' claims."
          />
          <ul className="plain-list compact">
            <li>No fake rankings or inflated 'top' language without clear source support.</li>
            <li>No public claims about real businesses unless source support and correction paths are clear.</li>
            <li>No city pages that try to cover everyone without a concrete use case.</li>
          </ul>
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel">
          <SparkIcon />
          <h2>How CityAtlas works</h2>
          <ul className="plain-list compact">
            <li>Answer-first guides help people solve one specific Vancouver planning question.</li>
            <li>City missions turn those ideas into saveable local routes.</li>
            <li>Business pages show how a place can be presented once facts are supported.</li>
            <li>Business review pages create the first monetization path after trust is earned.</li>
          </ul>
        </div>
        <div className="source-panel">
          <ShieldIcon />
          <h2>Trust model</h2>
          <p>
            CityAtlas separates source-backed public pages, planning guides, early business pages,
            and business-submitted updates. That keeps the site useful without pretending every
            local page is already part of a live verified city database.
          </p>
          <div className="hero-actions">
            <AppLink className="button secondary" to="/vancouver/date-night-starters">
              Date-night starters
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/rainy-day-starters">
              Rainy-day starters
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/wellness-reset-starters">
              Wellness reset starters
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/first-evening-starters">
              First-evening starters
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/first-time-visitor-starters">
              First-time visitor starters
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
            <AppLink className="button secondary" to="/toronto/first-time-visitor-starters">
              Toronto visitor starters
            </AppLink>
            <AppLink className="button secondary" to="/toronto/weekend-route-starters">
              Toronto weekend starters
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
            >
              Starter pack guide
            </AppLink>
            <AppLink className="button secondary" to="/editorial-standards">
              Correction path
            </AppLink>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Best next step</h2>
          <p>
            Start with the Vancouver guide library if you want the clearest picture of the planning
            questions CityAtlas answers best today.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/guides">
          Open guide library <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
