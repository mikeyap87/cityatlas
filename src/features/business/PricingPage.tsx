import { siteConfig } from "../../config/site";
import type { CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, ShieldIcon } from "../../components/Icons";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";

interface PricingPageProps {
  data: CityAtlasData;
}

function getPackageLead(packageId: PackageId) {
  if (packageId === "community") {
    return "Lightest start";
  }
  if (packageId === "city_partner") {
    return "Best starting point";
  }
  return "Hands-on support";
}

function getPackageCtaLabel(packageId: PackageId) {
  if (packageId === "community") {
    return "Start with Community Listing";
  }
  if (packageId === "city_partner") {
    return "Start with City Partner";
  }
  return "Start with Signature Partner";
}

const pricingFirstSteps = [
  "Share the one thing that needs help first: a page, guide fit, or offer.",
  "CityAtlas reviews the fit before any billing opens.",
  "Start with the smallest useful package, not the biggest one.",
];

const pricingHonestyRules = [
  "No traffic promises or ranking guarantees.",
  "No instant checkout before the fit is reviewed.",
  "No public profile until facts are checked.",
  "No automated outreach until compliance is checked.",
];

const pricingQuestions = [
  {
    title: "What happens before payment opens?",
    copy:
      "CityAtlas starts with a business request, checks whether a page, guide, or offer is the right first move, and only opens payment when the scope is clear.",
  },
  {
    title: "When should a business start a request?",
    copy:
      "Start a request when the business wants clearer neighborhood visibility, better guide placement, offer packaging, or a stronger city-facing story.",
  },
  {
    title: "What does CityAtlas mean by local visibility?",
    copy:
      "It means clearer guide placement, better neighborhood choice, stronger city-facing presentation, and a simpler way for people to find the right business at the right moment.",
  },
];

export function PricingPage({ data }: PricingPageProps) {
  return (
    <>
      <section className="pricing-hero pricing-hero-compact">
        <div>
          <p className="section-label">For businesses</p>
          <h1>Simple ways to get your Vancouver business featured more clearly</h1>
          <p>
            Start with one clear business need. CityAtlas points you to the smallest useful next
            step before any billing opens.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/for-businesses/submit">
              Start a business request
              <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/editorial-standards">
              See trust rules
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>Tell us the need</span>
            <span>Review first</span>
            <span>Pay only if the fit is clear</span>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Most businesses only need one clearer page, one better guide match, or one simple offer first.</strong>
            <p>
              The first job is clarity, not buying the biggest package.
            </p>
          </article>
        </div>
        <div className="pricing-hero-side">
          <HeroMediaCard
            image={siteConfig.media.hero}
            alt="Vancouver public market and skyline at dusk"
            eyebrow="For local businesses"
            title="Start with the smallest useful local visibility move"
            copy="CityAtlas works best when a business starts with one useful page, one stronger guide fit, or one simple offer people can understand fast."
          />
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel conversion-panel pricing-intro-panel">
          <div className="card-topline">
            <strong>How it works</strong>
            <StatusPill tone="amber">Request first</StatusPill>
          </div>
          <ul className="plain-list compact pricing-step-list">
            {pricingFirstSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
        <article className="source-panel conversion-panel pricing-mini-card">
          <strong>Best fit</strong>
          <p>
            Best for restaurants, cafes, wellness businesses, classes, and experience operators
            that want clearer neighborhood visibility, stronger guide fit, or one offer people can
            understand fast.
          </p>
        </article>
      </section>

      <section className="section-block pricing-packages-section">
        <SectionHeader
          label="Packages"
          title="Choose the help that fits now"
          copy="All three paths start with the same request. The difference is how much hands-on page, guide, and offer help CityAtlas adds after the review."
          action={<StatusPill tone="blue">3 starting paths</StatusPill>}
        />
        <div className="pricing-grid">
          {data.packages.map((plan) => (
            <article
              className={plan.highlighted ? "pricing-card highlighted" : "pricing-card"}
              id={`package-${plan.id}`}
              key={plan.id}
            >
              <div className="pricing-card-header">
                <span className="query-card-kicker">{getPackageLead(plan.id)}</span>
                {plan.highlighted ? <span className="plan-flag">Most useful starting point</span> : null}
              </div>
              <h2>{plan.name}</h2>
              <strong>{plan.priceLabel}</strong>
              <small className="pricing-card-note">Starts with a business request and quick review.</small>
              <p>{plan.description}</p>
              <p className="pricing-card-best-fit"><strong>Best when:</strong> {plan.bestFor}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="payment-locked">
                <LockIcon />
                <span>Review first</span>
              </div>
              <AppLink className="button secondary wide" to={`/for-businesses/submit?package=${plan.id}`}>
                {getPackageCtaLabel(plan.id)}
              </AppLink>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Start here"
          title="Start with the need, not the biggest package"
          copy="Use the request form when you already know what needs help. Review the trust rules first if you want to see the public standards before sending anything."
        />
        <div className="split-section business-next-step-row">
          <article className="business-guidance-card">
            <ShieldIcon />
            <span className="query-card-kicker">Best next move</span>
            <strong>Share the real problem, then let CityAtlas point you to the smallest useful next step</strong>
            <p>
              That is the fastest path when the business wants a clearer page, better guide
              placement, or one simple offer worth shaping.
            </p>
            <div className="hero-actions">
              <AppLink className="button primary" to="/for-businesses/submit">
                Start the request <ArrowRightIcon />
              </AppLink>
              <AppLink className="button secondary" to="/editorial-standards">
                Review trust rules
              </AppLink>
            </div>
          </article>
          <article className="source-panel conversion-panel pricing-mini-card">
            <strong>What stays honest</strong>
            <ul className="conversion-list">
              {pricingHonestyRules.map((rule) => (
                <li key={rule}>
                  <LockIcon />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Questions"
          title="What businesses usually ask before anything goes live"
          copy="These answers should feel clear before billing opens or a public page goes live."
        />
        <div className="card-grid three">
          {pricingQuestions.map((question) => (
            <article className="source-panel conversion-panel" key={question.title}>
              <h2>{question.title}</h2>
              <p>{question.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <ShieldIcon />
        <div>
          <h2>Tell CityAtlas what needs help before you worry about checkout</h2>
          <p>
            The first step should stay small and honest. A paid path only opens after the fit is
            clear.
          </p>
        </div>
        <AppLink className="button primary" to="/for-businesses/submit">
          Start a business request <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
