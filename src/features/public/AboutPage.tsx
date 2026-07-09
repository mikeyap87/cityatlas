import { AppLink } from "../../components/Link";
import {
  ArrowRightIcon,
  CheckIcon,
  ShieldIcon,
  SparkIcon,
  StoreIcon,
} from "../../components/Icons";

const aboutBeliefs = [
  "A city should feel like an invitation, not homework.",
  "One calm first move beats a giant list of choices.",
  "A useful plan should be easy enough to follow while holding a coffee, an umbrella, or a kid's hand.",
  "Local businesses deserve to be understood by the kind of day they make better.",
] as const;

const aboutHowItWorks = [
  "Pick the kind of day you want.",
  "Open one ready-made route or guide.",
  "Use the map when you are ready to leave.",
  "Save the plan if it is worth repeating.",
] as const;

const aboutVisionNotes = [
  {
    title: "For people",
    copy: "CityAtlas should help someone leave the house with less overthinking and more confidence.",
  },
  {
    title: "For visitors",
    copy: "A first city day should feel held together, not like a pile of random recommendations.",
  },
  {
    title: "For businesses",
    copy: "A good local place should be matched to the right moment, not buried in another directory.",
  },
  {
    title: "For cities",
    copy: "The bigger hope is more real life: more walks, more meals, more visits, more memories.",
  },
] as const;

export function AboutPage() {
  return (
    <>
      <section className="about-letter-hero page-top">
        <div className="about-letter-hero-copy">
          <p className="section-label">About CityAtlas</p>
          <h1>Cities should feel easier to love.</h1>
          <p>
            CityAtlas exists for the moment when you want a good day out, but the internet gives
            you too many choices and not enough relief.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/guides">
              Start with Vancouver <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/planner">
              Open the planner
            </AppLink>
          </div>
        </div>
        <aside className="about-letter-postcard" aria-label="CityAtlas promise">
          <p>Founder's note</p>
          <strong>Less planning anxiety. More city life.</strong>
          <span>
            Built first in Vancouver for real people, real routes, and local places that make a
            day feel memorable.
          </span>
        </aside>
      </section>

      <section className="about-letter-layout">
        <article className="about-letter-paper">
          <div className="about-letter-meta">
            <span>Vancouver</span>
            <span>2026</span>
          </div>
          <p className="about-letter-salutation">Dear city wanderer,</p>
          <div className="about-letter-body">
            <p>
              CityAtlas began with a small frustration that kept showing up in ordinary life:
              planning a simple city day had become strangely heavy.
            </p>
            <p>
              We have more reviews, maps, lists, videos, and rankings than any person could ever
              need. And yet a lot of people still end up asking the same anxious question:
              where should we actually go first?
            </p>
            <p>
              That question matters more than it looks. A first stop can decide whether a date
              feels easy, whether visiting parents feel cared for, whether a rainy Saturday turns
              into a memory instead of another day at home.
            </p>
            <p>
              CityAtlas is built around a simple belief: the city is not a spreadsheet. It is a
              relationship. You should be able to find your way into it with a little confidence,
              not a hundred open tabs.
            </p>
            <blockquote>
              The goal is not more scrolling. The goal is helping someone leave the house.
            </blockquote>
            <p>
              That is why CityAtlas starts with the kind of day, not a giant search box. Date night.
              First visit. Rainy day. A calm weekend route. A plan for guests. A good city guide
              should understand the feeling before it names the place.
            </p>
            <p>
              This is also why local businesses matter so much here. A restaurant, cafe, shop,
              garden, market, studio, or service is not just a listing. It can be the anchor that
              makes a day feel possible.
            </p>
            <p>
              CityAtlas is still early. Some pages are deeper than others. Some routes are still
              being checked, improved, and made more useful. We would rather be honest about that
              than pretend the whole city is solved.
            </p>
            <p>
              But the vision is clear: one calm starting point, one believable route, one map handoff
              when you need it, and a city that feels a little easier to step into.
            </p>
          </div>
          <div className="about-letter-signoff">
            <span>With care,</span>
            <strong>The CityAtlas founder</strong>
          </div>
        </article>

        <aside className="about-letter-side-notes">
          <article>
            <SparkIcon />
            <strong>Why it exists</strong>
            <p>To make good city days feel easier to begin.</p>
          </article>
          <article>
            <ShieldIcon />
            <strong>How it earns trust</strong>
            <p>By staying clear about what is checked, local, saved, and still growing.</p>
          </article>
          <article>
            <StoreIcon />
            <strong>Why businesses belong</strong>
            <p>Because local places are often the reason a route becomes worth remembering.</p>
          </article>
        </aside>
      </section>

      <section className="split-section about-letter-support-grid">
        <article className="source-panel about-letter-note-card">
          <SparkIcon />
          <h2>What CityAtlas believes</h2>
          <ul className="plain-list compact">
            {aboutBeliefs.map((item) => (
              <li key={item}>
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="source-panel about-letter-note-card">
          <ShieldIcon />
          <h2>How to use it today</h2>
          <ul className="plain-list compact">
            {aboutHowItWorks.map((item) => (
              <li key={item}>
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="about-letter-vision-grid" aria-label="CityAtlas vision">
        {aboutVisionNotes.map((note) => (
          <article className="about-letter-vision-card" key={note.title}>
            <strong>{note.title}</strong>
            <p>{note.copy}</p>
          </article>
        ))}
      </section>

      <section className="cta-band">
        <StoreIcon />
        <div>
          <h2>Start with one easy city day</h2>
          <p>
            Open a guide if you are choosing the kind of day. Open the planner if you already want
            a full route and map handoff.
          </p>
        </div>
        <div className="hero-actions">
          <AppLink className="button primary" to="/vancouver/guides">
            Open guides <ArrowRightIcon />
          </AppLink>
          <AppLink className="button secondary" to="/for-businesses/submit">
            Contact us about a business
          </AppLink>
        </div>
      </section>
    </>
  );
}
