import { useEffect } from "react";
import { siteConfig } from "../../config/site";
import type { CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, ShieldIcon } from "../../components/Icons";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";

interface PricingPageProps {
  data: CityAtlasData;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
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

function getPackageDecisionTitle(packageId: PackageId) {
  if (packageId === "community") {
    return "Get reviewed and on file first";
  }
  if (packageId === "city_partner") {
    return "Get a stronger page and guide fit";
  }
  return "Get hands-on visibility support";
}

function getPackageDecisionCopy(packageId: PackageId) {
  if (packageId === "community") {
    return "Best when you want CityAtlas to review the business, keep the request ready, and decide later if paid help is worth it.";
  }
  if (packageId === "city_partner") {
    return "Best when you already know the business should show up more clearly and you want the strongest first paid package.";
  }
  return "Best when the business already needs deeper page work, offer shaping, and a more involved local growth push.";
}

function getPackageBestFit(planName: string, packageId: PackageId) {
  if (packageId === "city_partner") {
    return "Restaurants, cafes, wellness businesses, repair shops, cleaners, mobile services, and experience operators that need a stronger first paid push.";
  }
  if (packageId === "signature_partner") {
    return "Businesses ready for a hands-on page, offer, and local growth package after the first review is clear.";
  }
  if (packageId === "community") {
    return "Businesses that want a request on file before choosing paid help.";
  }
  return planName;
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
    title: "Do I pay before CityAtlas reviews the fit?",
    copy:
      "CityAtlas starts with a business request, checks whether a page, guide, or offer is the right first move, and only opens payment when the scope is clear.",
  },
  {
    title: "Which businesses should start here?",
    copy:
      "Start here when the business wants clearer neighborhood visibility, better guide placement, stronger service positioning, a simpler offer, or a cleaner city-facing story.",
  },
  {
    title: "What does CityAtlas mean by local visibility?",
    copy:
      "It means clearer guide placement, better neighborhood choice, stronger city-facing presentation, and a simpler way for people to find the right business at the right moment.",
  },
];

const pricingUpgradeChecks = [
  "Community Listing keeps the first step light and reviewed.",
  "City Partner adds the strongest first paid page-and-guide layer.",
  "Signature Partner adds more hands-on planning and reporting.",
];

const pricingFitTags = [
  "Restaurants",
  "Cafes",
  "Wellness",
  "Repair",
  "Cleaning",
  "Mobile services",
  "Classes",
  "Experiences",
];

export function PricingPage({ data, onTrack }: PricingPageProps) {
  useEffect(() => {
    onTrack("business_pricing_viewed", {
      packageCount: data.packages.length,
      highlightedPackage: data.packages.find((plan) => plan.highlighted)?.id ?? "none",
    });
  }, [data.packages, onTrack]);

  function trackRequestClick(location: string, packageId: PackageId | "none" = "none") {
    onTrack("business_package_cta_clicked", {
      location,
      packageId,
    });
  }

  return (
    <>
      <section className="pricing-hero pricing-hero-compact">
        <div>
          <p className="section-label">For businesses</p>
          <h1>Choose the right first CityAtlas package for your Vancouver business</h1>
          <p>
            Start with one clear business need, get a fit review first, and choose the smallest
            useful package before any billing opens.
          </p>
          <div className="hero-actions">
            <AppLink
              className="button primary"
              onClick={() => trackRequestClick("hero")}
              to="/for-businesses/submit"
            >
              Start a business request
              <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/editorial-standards">
              See trust rules
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>Starts at $0 / month</span>
            <span>Review first</span>
            <span>Restaurants + service businesses</span>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Most businesses only need one clearer page, one better guide match, or one simpler offer first.</strong>
            <p>
              This page should help you choose the smallest useful package in under a minute. If it
              does not, start the request and CityAtlas can point you to the right level before
              payment opens.
            </p>
          </article>
        </div>
        <div className="pricing-hero-side">
          <HeroMediaCard
            image={siteConfig.media.business}
            alt="Illustrated market scene inspired by Granville Island Public Market in Vancouver"
            eyebrow="For local businesses"
            title="Start with one clear business need"
            copy="CityAtlas works best when a business starts with one useful page, one stronger guide fit, or one simple offer people can understand fast."
          />
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel conversion-panel pricing-intro-panel">
          <div className="card-topline">
            <strong>What happens first</strong>
            <StatusPill tone="amber">Request first</StatusPill>
          </div>
          <ul className="plain-list compact pricing-step-list">
            {pricingFirstSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
        <article className="source-panel conversion-panel pricing-mini-card pricing-fit-panel">
          <strong>Good fit for</strong>
          <p>
            Best for restaurants, cafes, wellness businesses, repair shops, cleaners, mobile or
            home-service operators, classes, and experience operators that want clearer
            neighborhood visibility, stronger guide fit, or one offer people can understand fast.
          </p>
          <div className="tag-cloud pricing-fit-tag-cloud">
            {pricingFitTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className="pricing-fit-note">
            If the offer, facts, or neighborhood angle still are not clear yet, the honest next
            move is to keep the request in review before billing opens.
          </p>
        </article>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Choose fast"
          title="Pick the level of help you actually need"
          copy="Use this if you want the quick answer before reading every package detail."
        />
        <div className="card-grid three pricing-choice-grid">
          {data.packages.map((plan) => (
            <article
              className={plan.highlighted ? "source-panel conversion-panel pricing-choice-card highlighted" : "source-panel conversion-panel pricing-choice-card"}
              key={`chooser-${plan.id}`}
            >
              <span className="query-card-kicker">{getPackageLead(plan.id)}</span>
              <h2>{getPackageDecisionTitle(plan.id)}</h2>
              <p>{getPackageDecisionCopy(plan.id)}</p>
              <div className="pricing-choice-meta">
                <strong>{plan.name}</strong>
                <span>{plan.priceLabel}</span>
              </div>
              <p className="pricing-choice-note">
                <strong>Best when:</strong> {getPackageBestFit(plan.name, plan.id)}
              </p>
              <AppLink
                className={plan.highlighted ? "button primary wide" : "button secondary wide"}
                onClick={() => trackRequestClick("pricing_choice_card", plan.id)}
                to={`/for-businesses/submit?package=${plan.id}`}
              >
                {getPackageCtaLabel(plan.id)}
              </AppLink>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block pricing-packages-section">
        <SectionHeader
          label="Packages"
          title="Compare the full package details"
          copy="Every package starts with the same request. What changes is how much page, guide, offer, and reporting help CityAtlas adds after the review."
          action={<StatusPill tone="blue">3 starting paths</StatusPill>}
        />
        <div className="source-panel conversion-panel pricing-readiness-panel">
          <div className="card-topline">
            <strong>What changes as the package gets deeper</strong>
            <StatusPill tone="green">Same request, more help</StatusPill>
          </div>
          <p>
            The first decision is not about checkout. It is about how much hands-on help the
            business needs once CityAtlas has reviewed the fit.
          </p>
          <ul className="conversion-list">
            {pricingUpgradeChecks.map((check) => (
              <li key={check}>
                <CheckIcon />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
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
              <p className="pricing-card-best-fit">
                <strong>Best when:</strong> {getPackageBestFit(plan.bestFor, plan.id)}
              </p>
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
              <AppLink
                className="button secondary wide"
                onClick={() => trackRequestClick("package_card", plan.id)}
                to={`/for-businesses/submit?package=${plan.id}`}
              >
                {getPackageCtaLabel(plan.id)}
              </AppLink>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Still deciding"
          title="Still unsure? Start the request and let CityAtlas point you to the right package"
          copy="Use the request form when you already know what needs help, or when you want CityAtlas to help choose the right first package before billing opens."
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
              <AppLink
                className="button primary"
                onClick={() => trackRequestClick("best_next_move")}
                to="/for-businesses/submit"
              >
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
        <AppLink
          className="button primary"
          onClick={() => trackRequestClick("bottom_cta")}
          to="/for-businesses/submit"
        >
          Start a business request <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
