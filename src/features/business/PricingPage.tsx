import { useEffect } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
} from "../../config/site";
import { BusinessReplyProofPanel } from "../../components/BusinessReplyProof";
import type { CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, MapIcon, StoreIcon } from "../../components/Icons";
import { SectionHeader } from "../../components/UI";
import { getGuidePath } from "../../lib/cityPaths";
import { getBusinessVisual, getGuideVisual } from "../../lib/visuals";

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

const pricingBoundaryFreeSteps = [
  "You tell us what needs help",
  "We read it personally",
  "You get a short fit note",
];

const pricingReviewOutcomeCards = [
  {
    title: "Contact us first",
    copy: "The first reply stays plain English and points to the most useful next move.",
  },
  {
    title: "Paid is optional",
    copy: "City Partner or Signature only matter after the fit note makes the next step clear.",
  },
];

function getBusinessPath(cityName: string, slug: string) {
  const citySlug = cityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `/${citySlug || "vancouver"}/businesses/${slug}`;
}

export function PricingPage({ data, onTrack }: PricingPageProps) {
  const hasPaidCheckout = data.packages.some((plan) => hasPartnerPackageCheckout(plan.id));
  const proofBusiness = data.businesses.find((business) => business.slug === "published-on-main")
    ?? data.businesses.find((business) => business.featured)
    ?? data.businesses[0]
    ?? null;
  const proofGuide = data.guides.find(
    (guide) => guide.slug === "how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice",
  ) ?? data.guides[0] ?? null;
  const proofBusinessPath = proofBusiness
    ? getBusinessPath(proofBusiness.city, proofBusiness.slug)
    : "/vancouver/businesses/published-on-main";
  const proofGuidePath = proofGuide
    ? getGuidePath(proofGuide)
    : "/vancouver/guides/how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice";
  const proofBusinessTags = proofBusiness?.bestFor.slice(0, 3) ?? ["Celebration dinners", "Main Street plans"];
  const proofGuideTags = proofGuide
    ? [
        proofGuide.cluster || proofGuide.category,
        "One-neighborhood route",
        "Simple next stop",
      ].filter(Boolean)
    : ["Date night", "One-neighborhood route", "Simple next stop"];

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
      <section className="pricing-hero pricing-hero-compact pricing-hero-boundary">
        <div className="pricing-boundary-top pricing-boundary-top-show-output">
          <div className="pricing-hero-panel-copy pricing-boundary-copy pricing-boundary-copy-show-output">
            <p className="section-label">For businesses</p>
            <h1>
              Get found by Vancouver locals
              <span>(the clear, honest way)</span>
            </h1>
            <p>
              Start with a free reviewed request. We&apos;ll reply with a fit note and the
              best next step.
            </p>
            <div className="hero-actions">
              <AppLink
                className="button primary"
                onClick={() => trackRequestClick("hero")}
                to="/for-businesses/submit"
              >
                Request free review
                <ArrowRightIcon />
              </AppLink>
            </div>
          </div>
          <article className="source-panel pricing-output-card" aria-label="Current CityAtlas proof examples">
            <span className="pricing-output-badge">Current proof</span>
            <h2>See the real CityAtlas output first</h2>

            <div className="pricing-output-step">
              <span className="pricing-output-step-number">1</span>
              <div className="pricing-output-step-body">
                <strong>Live business page</strong>
                <AppLink className="pricing-output-preview-card pricing-output-preview-card-link" to={proofBusinessPath}>
                  <div className="pricing-output-preview-top">
                    <img
                      alt={`${proofBusiness?.name ?? "CityAtlas"} business page example`}
                      decoding="async"
                      loading="lazy"
                      src={proofBusiness ? getBusinessVisual(proofBusiness) : "/assets/businesses/published-on-main-dining-room.png"}
                    />
                    <div className="pricing-output-preview-copy">
                      <strong>{proofBusiness?.name ?? "Published on Main"}</strong>
                      <p>
                        <span>{proofBusiness?.neighborhood ?? "Main Street"}</span>
                        <span>{proofBusiness?.city ?? "Vancouver"}</span>
                      </p>
                      <div className="pricing-output-pill-row">
                        {proofBusinessTags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pricing-output-meta-row">
                    <div className="pricing-output-meta">
                      <StoreIcon />
                      <span>Current live CityAtlas business example</span>
                    </div>
                    <ArrowRightIcon />
                  </div>
                  <div className="pricing-output-tag-label">What a reader gets</div>
                  <p className="pricing-output-proof-copy">
                    {proofBusiness?.shortDescription
                      ?? "A clear business page that shows who the place is for, why it fits, and how to contact it."}
                  </p>
                </AppLink>
              </div>
            </div>

            <div className="pricing-output-step">
              <span className="pricing-output-step-number">2</span>
              <div className="pricing-output-step-body">
                <strong>Live guide placement</strong>
                <AppLink
                  className="pricing-output-preview-card pricing-output-preview-card-guide pricing-output-preview-card-link"
                  to={proofGuidePath}
                >
                  <div className="pricing-output-preview-top pricing-output-preview-top-guide">
                    <img
                      alt={`${proofGuide?.title ?? "CityAtlas"} guide example`}
                      decoding="async"
                      loading="lazy"
                      src={proofGuide ? getGuideVisual(proofGuide) : "/assets/businesses/labattoir-dining-room.webp"}
                    />
                    <div className="pricing-output-preview-copy">
                      <strong>{proofGuide?.title ?? "How To Plan A Vancouver Date Night Without Crossing The City Twice"}</strong>
                      <p>{proofGuide?.summary ?? "A route-first guide that helps the reader choose one neighborhood and one easy next stop."}</p>
                      <div className="pricing-output-tag-row">
                        {proofGuideTags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <ArrowRightIcon />
                  </div>
                  <div className="pricing-output-meta-row">
                    <div className="pricing-output-meta">
                      <MapIcon />
                      <span>Current live CityAtlas guide example</span>
                    </div>
                    <ArrowRightIcon />
                  </div>
                </AppLink>
              </div>
            </div>

            <p className="pricing-output-note">
              These are current CityAtlas examples. A future feature still depends on fit, review,
              and facts being confirmed first.
            </p>
          </article>
        </div>
        <article className="source-panel pricing-boundary-panel pricing-boundary-panel-single">
          <strong className="pricing-boundary-title">Money starts later</strong>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-path-card pricing-path-card-free pricing-path-card-boundary pricing-path-card-boundary-single">
            <strong>$0 - Today</strong>
            <ul className="plain-list compact pricing-path-list pricing-path-list-checks">
              {pricingBoundaryFreeSteps.map((step) => (
                <li key={step}>
                  <CheckIcon />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <div className="hero-actions">
              <AppLink
                className="button primary"
                onClick={() => trackRequestClick("free_panel")}
                to="/for-businesses/submit"
              >
                Start the free review
              </AppLink>
            </div>
          </article>
        </article>
      </section>

      <section className="section-block">
        <SectionHeader
          label="What the free review gives you"
          title="Start with one note, then let CityAtlas point to the smallest useful next move"
          copy="Most businesses should stop here first. Open the other paths only when a call, package comparison, or checkout is already clearly needed."
        />
        <div className="pricing-hero-support-grid pricing-hero-support-grid-tight">
          {pricingReviewOutcomeCards.map((card) => (
            <article className="pricing-hero-support-link" key={card.title}>
              <strong>{card.title}</strong>
              <span>{card.copy}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Current reply proof"
          title="The same free-review-first path is already being used in real conversations"
          copy="This is not just a mock future funnel. CityAtlas is already reading real replies, answering when intent is clear, and keeping the first step cautious."
        />
        <BusinessReplyProofPanel
          badgeLabel="Reply proof"
          badgeTone="blue"
          intro="Real local businesses have already replied, and CityAtlas is using the same fit-note-first boundary you see on this page."
          title="Current business reply handling"
          variant="compact"
        />
      </section>

      <section className="section-block">
        <details className="pricing-package-divider-group" id="pricing-paid-options">
          <summary className="pricing-package-divider-summary">
            <span>Optional: packages (only after the fit note)</span>
          </summary>
          <div className="pricing-package-divider-body">
            <p className="pricing-package-divider-copy">
              Open this only if you already know you need to compare every starting level at once.
            </p>
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
          </div>
        </details>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Other paths"
          title="Use these only when the free review is not the right fit"
          copy="These are backup paths for people who already know they want a short call or a plain-English explanation first."
        />
        <div className="pricing-hero-support-grid pricing-hero-support-grid-tight">
          <AppLink className="pricing-hero-support-link" to="/for-businesses/book-call">
            <strong>Prefer a call</strong>
            <span>Use this when talking it through feels easier than filling the request.</span>
          </AppLink>
          <AppLink className="pricing-hero-support-link" to="/for-businesses/partner-preview">
            <strong>How it works</strong>
            <span>Read the request, feature, and pricing path in plain English.</span>
          </AppLink>
        </div>
      </section>
    </>
  );
}
