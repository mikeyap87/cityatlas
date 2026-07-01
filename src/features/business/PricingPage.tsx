import { useEffect } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
  siteConfig,
} from "../../config/site";
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

  function trackCheckoutClick(location: string, packageId: PackageId) {
    onTrack("business_package_checkout_clicked", {
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
            Tell CityAtlas what needs help first, get a fit review, and only pay for the level of
            help that actually moves the business forward.
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
            <span>Review before payment</span>
            <span>Restaurants + service businesses</span>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Most businesses should start with City Partner or lighter.</strong>
            <p>
              Community Listing is the review-only option. City Partner is the strongest first paid
              fit for most businesses. Signature Partner is for the cases where the bigger lift is
              already obvious before payment opens.
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
          label="Choose once"
          title="Choose your starting level in one pass"
          copy="All three options start with the same request. The difference is how much help CityAtlas adds after the review."
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
              <ul className="conversion-list pricing-choice-feature-list">
                {plan.features.slice(0, 3).map((feature) => (
                  <li key={`${plan.id}-${feature}`}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="pricing-choice-note">
                <strong>Best when:</strong> {getPackageBestFit(plan.name, plan.id)}
              </p>
              <div className="pricing-choice-actions">
                <AppLink
                  className={plan.highlighted ? "button primary wide" : "button secondary wide"}
                  onClick={() => trackRequestClick("pricing_choice_card", plan.id)}
                  to={`/for-businesses/submit?package=${plan.id}`}
                >
                  {getPackageCtaLabel(plan.id)}
                </AppLink>
                {hasPartnerPackageCheckout(plan.id) ? (
                  <a
                    className="button secondary wide"
                    href={getPartnerPackageCheckoutUrl(plan.id)}
                    onClick={() => trackCheckoutClick("pricing_choice_card", plan.id)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {getPartnerPackageCheckoutLabel(plan.id)}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Still deciding"
          title="Still unsure? Start the request and let CityAtlas point you to the smaller package first"
          copy="If two packages both seem plausible, start the request. CityAtlas should only point you higher when the lighter option clearly will not do the job."
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
          <h2>Start the request before you decide on payment</h2>
          <p>
            CityAtlas reviews the fit first, then points you to the smallest useful package.
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
