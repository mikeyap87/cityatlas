import { useEffect } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
  siteConfig,
} from "../../config/site";
import type { CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, ClockIcon, LockIcon, ShieldIcon, SparkIcon, StoreIcon } from "../../components/Icons";
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
    return "Start Community request";
  }
  if (packageId === "city_partner") {
    return "Start City Partner request";
  }
  return "Start Signature request";
}

function getPackageDecisionTitle(packageId: PackageId) {
  if (packageId === "community") {
    return "Start with a simple business request";
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
    return "Restaurants, cafes, wellness businesses, repair shops, cleaners, mobile services, and experience businesses that need a stronger first paid push.";
  }
  if (packageId === "signature_partner") {
    return "Businesses ready for a hands-on page, offer, and local growth package after the first review is clear.";
  }
  if (packageId === "community") {
    return "Businesses that want a request on file before choosing paid help.";
  }
  return planName;
}

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

const pricingAfterCheckoutSteps = [
  {
    title: "Choose the package you already want",
    copy:
      "Use Stripe-hosted checkout only when City Partner or Signature Partner is already the clear fit for the business.",
  },
  {
    title: "CityAtlas follows up personally",
    copy:
      "After checkout, CityAtlas confirms the business facts, city fit, and the clearest first page, guide, or offer priority.",
  },
  {
    title: "Details are confirmed before anything goes live",
    copy:
      "A payment does not auto-publish a business page, route feature, or guide placement. CityAtlas still confirms the details before anything public changes.",
  },
  {
    title: "The first deliverable stays specific",
    copy:
      "The goal is the smallest useful next move for the business, not a vague promise of traffic, rankings, or automatic growth.",
  },
];

const pricingFirstReplyCards = [
  {
    icon: SparkIcon,
    title: "First reply",
    copy:
      "A plain-English read on the page, guide, offer, or neighborhood angle that would help the business most first.",
  },
  {
    icon: StoreIcon,
    title: "Package direction",
    copy:
      "A clear recommendation on whether Community, City Partner, or Signature is the smallest useful next step.",
  },
  {
    icon: ClockIcon,
    title: "Next move",
    copy:
      "The next step stays simple: a reply, a short call, a hosted visit, or optional checkout when the package is already obvious.",
  },
];

export function PricingPage({ data, onTrack }: PricingPageProps) {
  const hasPaidCheckout = data.packages.some((plan) => hasPartnerPackageCheckout(plan.id));
  const heroTagline = hasPaidCheckout ? "Request-first paid path" : "Request before payment";
  const pricingFirstSteps = hasPaidCheckout
    ? [
      "Share the one thing that needs help first: a page, guide fit, or offer.",
      "Book a short call if a quick conversation would help faster than a longer request.",
      "Start with a business request if you want CityAtlas to guide the next step.",
      "Use Stripe-hosted checkout only when the paid package is already clear.",
    ]
    : [
      "Share the one thing that needs help first: a page, guide fit, or offer.",
      "Book a short call if talking it through will get you to the right package faster.",
      "CityAtlas reviews the fit before any billing opens.",
      "Start with the smallest useful package, not the biggest one.",
    ];
  const pricingHonestyRules = hasPaidCheckout
    ? [
      "No traffic promises or ranking guarantees.",
      "Community Listing stays free.",
      "No public profile until facts are checked.",
      "No automated outreach until compliance is checked.",
    ]
    : [
      "No traffic promises or ranking guarantees.",
      "No instant checkout before the fit is clear.",
      "No public profile until facts are checked.",
      "No automated outreach until compliance is checked.",
    ];
  const pricingQuestions = hasPaidCheckout
    ? [
      {
        title: "Can I go straight to a paid package?",
        copy:
          "Yes, when City Partner or Signature Partner is already the clear fit. You can also start with a business request first if you want CityAtlas to recommend the level.",
      },
      {
        title: "What does CityAtlas need from a partner first?",
        copy:
          "CityAtlas starts by understanding the business, neighborhood, and goal. If an in-person feature would help, CityAtlas may ask to visit before the work is written.",
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
      {
        title: "What happens right after checkout?",
        copy:
          "CityAtlas follows up personally to confirm fit, facts, and the clearest first deliverable. Paying does not automatically publish a page or guarantee placement, traffic, or rankings.",
      },
    ]
  : [
      {
        title: "Do I pay before CityAtlas reviews the fit?",
        copy:
          "CityAtlas starts with a business request, checks whether a page, guide, or offer is the right first move, and only opens payment when the scope is clear.",
      },
      {
        title: "What does CityAtlas need from a partner first?",
        copy:
          "The first yes is usually not payment. If the preview is a fit, CityAtlas may ask for a complimentary meal, service, visit, or offering for Michael and one guest so the feature can be accurate.",
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

  useEffect(() => {
    onTrack("business_pricing_viewed", {
      packageCount: data.packages.length,
      highlightedPackage: data.packages.find((plan) => plan.highlighted)?.id ?? "none",
      hasPaidCheckout,
    });
  }, [data.packages, hasPaidCheckout, onTrack]);

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
            Tell CityAtlas what needs help first, get guidance when you need it, and only pay for
            the level of help that actually moves the business forward.
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
            <AppLink className="button secondary" to="/for-businesses/partner-preview">
              How features work
            </AppLink>
          </div>
          <div className="pricing-hero-subactions">
            <AppLink className="text-link" to="/for-businesses/book-call">
              Book a short call <ArrowRightIcon />
            </AppLink>
            {hasPartnerPackageCheckout("city_partner") ? (
              <a
                className="text-link"
                href={getPartnerPackageCheckoutUrl("city_partner")}
                onClick={() => trackCheckoutClick("hero_city_partner", "city_partner")}
                rel="noreferrer"
                target="_blank"
              >
                Already sure about City Partner? Open checkout <ArrowRightIcon />
              </a>
            ) : null}
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>Starts at $0 / month</span>
            <span>{heroTagline}</span>
            <span>10-minute short call available</span>
            <span>Restaurants + service businesses</span>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Most businesses should start with a request, then move into City Partner if the fit is clear.</strong>
            <p>
              Community Listing is the lightest option. City Partner is the strongest first paid
              fit for most businesses. Signature Partner is for cases where the bigger lift is
              already obvious. Checkout is available lower on the page when the package choice is
              already clear, but it does not turn on instant publication.
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
            <StatusPill tone="amber">{hasPaidCheckout ? "Review or checkout" : "Request first"}</StatusPill>
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
            home-service businesses, classes, and experience businesses that want clearer
            neighborhood visibility, stronger guide fit, or one offer people can understand fast.
          </p>
          <div className="tag-cloud pricing-fit-tag-cloud">
            {pricingFitTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className="pricing-fit-note">
            If the offer, facts, or neighborhood angle still need work, start with the request
            before paying.
          </p>
        </article>
      </section>

      <section className="section-block">
        <SectionHeader
          label="First deliverable"
          title="What a business should expect first"
          copy="The best pricing page lowers uncertainty fast. Before any deeper work, CityAtlas should make the first recommendation feel specific and easy to act on."
        />
        <div className="card-grid three pricing-first-reply-grid">
          {pricingFirstReplyCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="source-panel conversion-panel pricing-first-reply-card" key={card.title}>
                <Icon />
                <h2>{card.title}</h2>
                <p>{card.copy}</p>
              </article>
            );
          })}
        </div>
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
              {hasPartnerPackageCheckout(plan.id) ? (
                <div className="pricing-choice-actions">
                  <AppLink
                    className={plan.highlighted ? "button primary wide" : "button secondary wide"}
                    onClick={() => trackRequestClick("pricing_choice_card_review", plan.id)}
                    to={`/for-businesses/submit?package=${plan.id}`}
                  >
                    {getPackageCtaLabel(plan.id)}
                  </AppLink>
                  <a
                    className="text-link pricing-choice-checkout-link"
                    href={getPartnerPackageCheckoutUrl(plan.id)}
                    onClick={() => trackCheckoutClick("pricing_choice_card", plan.id)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {getPartnerPackageCheckoutLabel(plan.id)} <ArrowRightIcon />
                  </a>
                  <p className="pricing-choice-helper">
                    Use checkout only when the package is already clear and you do not need CityAtlas
                    to review the fit first.
                  </p>
                </div>
              ) : (
                <AppLink
                  className={plan.highlighted ? "button primary wide" : "button secondary wide"}
                  onClick={() => trackRequestClick("pricing_choice_card", plan.id)}
                  to={`/for-businesses/submit?package=${plan.id}`}
                >
                  {getPackageCtaLabel(plan.id)}
                </AppLink>
              )}
            </article>
          ))}
        </div>
      </section>

      {hasPaidCheckout ? (
        <section className="section-block">
          <SectionHeader
            label="After checkout"
            title="What the paid path actually does"
            copy="Checkout can secure the package, but CityAtlas still confirms the details before the work or feature goes live."
          />
          <div className="card-grid four partner-step-grid">
            {pricingAfterCheckoutSteps.map((step) => (
              <article className="source-panel conversion-panel partner-step-card" key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
          <article className="source-panel conversion-panel pricing-mini-card">
            <strong>Need clarity before paying?</strong>
            <p>
              Start with the business request, book a short call, or email{" "}
              <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> if timing,
              fit, or package scope is still unclear.
            </p>
            <AppLink className="text-link" to="/for-businesses/book-call">
              Book a short call <ArrowRightIcon />
            </AppLink>
          </article>
        </section>
      ) : null}

      <section className="section-block">
        <SectionHeader
          label="Still deciding"
          title="Still unsure? Start the request and let CityAtlas point you to the right package"
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
              <AppLink className="button secondary" to="/for-businesses/book-call">
                Book a short call
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
          copy="These answers should feel clear before a package starts or a public page goes live."
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
          <h2>{hasPaidCheckout ? "Start with the request or a short call, then use checkout only if the package is already obvious" : "Start the request or short call before you decide on payment"}</h2>
          <p>
            {hasPaidCheckout
              ? "CityAtlas still keeps the request path first, but the paid partner plans can hand off to Stripe when the package choice is already clear."
              : "CityAtlas reviews the fit first, and a quick call can help point you to the smallest useful package faster."}
          </p>
        </div>
        <div className="hero-actions">
          <AppLink
            className="button primary"
            onClick={() => trackRequestClick("bottom_cta")}
            to="/for-businesses/submit"
          >
            Start a business request <ArrowRightIcon />
          </AppLink>
          <AppLink className="button secondary" to="/for-businesses/book-call">
            Book a short call
          </AppLink>
        </div>
      </section>
    </>
  );
}
