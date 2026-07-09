import { useEffect, type MouseEvent } from "react";
import { navigate } from "../../app/router";
import { hasPartnerPackageCheckout } from "../../config/site";
import type { CityAtlasData } from "../../types";
import { BusinessReplyProofPanel } from "../../components/BusinessReplyProof";
import { AppLink } from "../../components/Link";
import type { AnalyticsDetail, TrackProductEventOptions } from "../../lib/analytics";
import { ArrowRightIcon, CheckIcon, LockIcon, MapIcon, ShieldIcon, SparkIcon, StoreIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { getGuidePath } from "../../lib/cityPaths";
import { getBusinessVisual, getGuideVisual } from "../../lib/visuals";

interface PartnerPreviewPageProps {
  data: CityAtlasData;
  onTrack: (
    name: string,
    detail?: AnalyticsDetail,
    options?: TrackProductEventOptions,
  ) => void;
}

const previewSteps = [
  {
    title: "Send the request",
    copy:
      "CityAtlas checks the business, city, category, and contact path before promising anything public or paid.",
  },
  {
    title: "Get the fit note first",
    copy:
      "The first reply shows where the business could fit, why that fit matters, and what still needs proof.",
  },
  {
    title: "Decide the next step",
    copy:
      "If the fit looks real, you can stay on the free review path, host a visit or service, or open a package only when the paid fit is already obvious.",
  },
];

const partnerHeroChecklist = [
  "Start with a free reviewed request.",
  "Get a plain-English fit note back first.",
  "Host us or pay only if the fit feels real.",
];

const exampleFeatureBlocks = [
  {
    label: "Where you fit",
    title: "Neighborhood and route context",
    copy:
      "Example: a dinner spot could fit a date-night route, a family cafe could fit a low-friction weekend route, and a cleaner or repair shop could fit a trusted local service guide.",
  },
  {
    label: "What readers see",
    title: "One clear reason to choose you",
    copy:
      "CityAtlas turns the business into a useful decision point, not a generic directory listing with every detail competing for attention.",
  },
  {
    label: "What we verify",
    title: "Facts, service, and fit",
    copy:
      "We confirm the public basics, then use the hosted experience to make the feature feel specific, accurate, and useful.",
  },
];

const replyPreviewBullets = [
  "Best fit now: where the business belongs first, such as a dinner route, neighborhood guide, or trusted local-service page.",
  "Still to confirm: any facts, photos, offers, or hosted experience details that should be checked before anything public is treated as final.",
  "Next move: reply by email, book a short call, stay on the free review path, or open a package only if the paid fit is already obvious.",
];

const partnerFaqs = [
  {
    title: "Is this a paid ad?",
    copy:
      "Not for the first review. The first step is a fit conversation. A business can stay on the free review path, and when the package choice is already clear the paid partner plans can also open in Stripe-hosted checkout.",
  },
  {
    title: "Do you need something complimentary?",
    copy:
      "Only if you want to move ahead after the preview. The normal first partnership ask is a hosted meal, service, walkthrough, or offering so the feature can be built from real experience.",
  },
  {
    title: "Are other businesses being reviewed too?",
    copy:
      "Yes. CityAtlas looks at small batches by city, category, and best match. That gives the page real context without promising every business will be featured.",
  },
  {
    title: "Which areas count?",
    copy:
      "CityAtlas starts with Vancouver and is expanding through Greater Vancouver, including places like Burnaby, Coquitlam, Surrey, Langley, and nearby municipalities as the local queue is verified.",
  },
  {
    title: "Does paying make the feature live right away?",
    copy:
      "No. A paid checkout can secure a package, but CityAtlas still confirms facts, fit, and the first useful deliverable before anything public goes live.",
  },
];

function getCityPartnerLabel(data: CityAtlasData) {
  const cityPartner = data.packages.find((plan) => plan.id === "city_partner");
  return cityPartner ? `${cityPartner.name} later: ${cityPartner.priceLabel}` : "Paid packages later";
}

function getBusinessPath(cityName: string, slug: string) {
  const citySlug = cityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `/${citySlug || "vancouver"}/businesses/${slug}`;
}

export function PartnerPreviewPage({ data, onTrack }: PartnerPreviewPageProps) {
  const paidCheckoutEnabled = data.packages.some((plan) => hasPartnerPackageCheckout(plan.id));
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
  const buildTrackedNavigationHandler = (
    destination: string,
    location: "hero_request" | "hero_pricing" | "hero_call" | "bottom_request",
  ) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      onTrack("business_partner_preview_cta_clicked", { location });
      return;
    }

    event.preventDefault();
    onTrack(
      "business_partner_preview_cta_clicked",
      { location },
      { deliverOnNextPage: true },
    );
    navigate(destination);
  };

  useEffect(() => {
    onTrack("business_partner_preview_viewed", {
      packageCount: data.packages.length,
      businessCount: data.businesses.length,
      paidCheckoutEnabled,
    });
  }, [data.businesses.length, data.packages.length, onTrack, paidCheckoutEnabled]);

  return (
    <>
      <section className="partner-letter-hero">
        <article className="partner-letter-card">
          <p className="section-label">Partner preview</p>
          <div className="partner-letter-pill-row">
            <StatusPill tone="green">Free review first</StatusPill>
            <StatusPill tone="blue">Restaurants + services</StatusPill>
            <StatusPill tone="muted">Greater Vancouver ready</StatusPill>
          </div>
          <h1>See what CityAtlas can already build for a local business</h1>
          <div className="partner-letter-body">
            <p>
              Before you contact us, you can already see the format: a business page, a guide fit,
              and the kind of plain-English note CityAtlas sends back first.
            </p>
            <ul className="conversion-list partner-checklist">
              {partnerHeroChecklist.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="planner-detail-copy">
              Nothing public goes live automatically, and nothing paid has to happen first.
            </p>
          </div>
          <div className="partner-letter-signoff">
            <strong>Contact us</strong>
            <span>CityAtlas team</span>
          </div>
          <div className="hero-actions">
            <AppLink
              className="button primary"
              onClick={buildTrackedNavigationHandler("/for-businesses/submit", "hero_request")}
              to="/for-businesses/submit"
            >
              Start business request
              <ArrowRightIcon />
            </AppLink>
          </div>
          <div className="partner-letter-links">
            <AppLink
              className="text-link"
              onClick={buildTrackedNavigationHandler("/for-businesses/book-call", "hero_call")}
              to="/for-businesses/book-call"
            >
              Need a short fit call first? Book a fit call <ArrowRightIcon />
            </AppLink>
            <AppLink
              className="text-link"
              onClick={buildTrackedNavigationHandler("/for-businesses/pricing", "hero_pricing")}
              to="/for-businesses/pricing"
            >
              Need packages first? Compare packages <ArrowRightIcon />
            </AppLink>
          </div>
        </article>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Before / after"
          title="See the difference in one glance"
          copy="These examples show how CityAtlas turns a vague listing into a clearer page, guide fit, and first reply."
        />
        <div className="card-grid three partner-proof-grid">
          {proofBusiness ? (
            <AppLink className="source-panel partner-proof-card" to={proofBusinessPath}>
              <img
                alt={`${proofBusiness.name} example CityAtlas business page`}
                decoding="async"
                loading="lazy"
                src={getBusinessVisual(proofBusiness)}
              />
              <div className="partner-proof-card-copy">
                <span className="query-card-kicker">After: current business page</span>
                <h2>{proofBusiness.name}</h2>
                <p>
                  A source-backed business page that shows who the place is for, why it fits, and
                  the official contact path in one clear view.
                </p>
                <span className="partner-proof-link">
                  Open live example <ArrowRightIcon />
                </span>
              </div>
            </AppLink>
          ) : null}

          {proofGuide ? (
            <AppLink className="source-panel partner-proof-card" to={proofGuidePath}>
              <img
                alt={`${proofGuide.title} example CityAtlas guide`}
                decoding="async"
                loading="lazy"
                src={getGuideVisual(proofGuide)}
              />
              <div className="partner-proof-card-copy">
                <span className="query-card-kicker">After: current guide</span>
                <h2>{proofGuide.title}</h2>
                <p>
                  A guide that places real businesses inside a useful route or decision instead of
                  leaving them as generic listings.
                </p>
                <span className="partner-proof-link">
                  Open live example <ArrowRightIcon />
                </span>
              </div>
            </AppLink>
          ) : null}

          <article className="source-panel partner-proof-note-card">
            <span className="query-card-kicker">Before: vague listing • After: fit note</span>
            <h2>What changes after CityAtlas</h2>
            <p>
              The first reply should quickly show where the business fits, what still needs proof,
              and what the easiest next step is.
            </p>
            <ul className="conversion-list partner-checklist">
              {replyPreviewBullets.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <AppLink className="button secondary" to="/for-businesses/submit">
              Start with the free review
            </AppLink>
          </article>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="How it works"
          title="The first path should feel simple"
          copy="A restaurant or local service should be able to understand this without a sales call."
        />
        <div className="card-grid three partner-step-grid">
          {previewSteps.map((step, index) => (
            <article className="source-panel partner-step-card" key={step.title}>
              <span>{index + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Current reply proof"
          title="Real reply handling is already happening"
          copy="CityAtlas is already reviewing and answering real businesses on the same free-review-first boundary."
        />
        <BusinessReplyProofPanel
          intro="The first reply path is already being used with real local businesses. It stays human, cautious, and request-first."
          title="Real reply handling is already underway"
        />
      </section>

      <section className="section-block">
        <details className="planner-detail-group pricing-package-disclosure">
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">Optional</p>
              <strong>See an example feature layout</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <p className="planner-detail-copy">
              Open this only if you want to picture what a finished CityAtlas feature could look like after the request and review are done.
            </p>
            <div className="split-section partner-preview-example-section">
              <article className="business-guidance-card partner-preview-example-card">
                <SparkIcon />
                <span className="query-card-kicker">Example only</span>
                <strong>What a CityAtlas feature might become</strong>
                <p>
                  A finished feature could place a business inside a useful route or guide, explain the
                  best-fit moment, and show the one clear reason a reader should choose it. This example
                  is a format preview, not a claim that any named business is already approved.
                </p>
                <ul className="conversion-list business-guidance-list">
                  <li>
                    <CheckIcon />
                    <span>Best route or guide fit</span>
                  </li>
                  <li>
                    <CheckIcon />
                    <span>Specific visit, meal, service, or booking angle</span>
                  </li>
                  <li>
                    <CheckIcon />
                    <span>Facts checked before anything public is treated as final</span>
                  </li>
                </ul>
              </article>
              <div className="partner-feature-stack">
                {exampleFeatureBlocks.map((block) => (
                  <article className="source-panel conversion-panel partner-feature-block" key={block.title}>
                    <span className="query-card-kicker">{block.label}</span>
                    <h2>{block.title}</h2>
                    <p>{block.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </details>
      </section>

      <section className="section-block">
        <SectionHeader
          label="What stays honest"
          title="What CityAtlas will not promise"
          copy="The opportunity can be clear without pretending a business is already approved or guaranteed results."
        />
        <div className="card-grid three">
          <article className="source-panel conversion-panel">
            <ShieldIcon />
            <h2>Free review first</h2>
            <p>
              A business can start here without paying. The first decision is whether there is a
              useful route, guide, offer, or local-service angle.
            </p>
          </article>
          <article className="source-panel conversion-panel">
            <StoreIcon />
            <h2>Complimentary hosted experience</h2>
            <p>
              If both sides want to move forward, the clean next step is a hosted meal, service,
              walkthrough, or offering for the CityAtlas team.
            </p>
          </article>
          <article className="source-panel conversion-panel">
            <LockIcon />
            <h2>{getCityPartnerLabel(data)}</h2>
            <p>
              {paidCheckoutEnabled
                ? "Paid packages remain optional. The free review path still exists, and Stripe-hosted checkout should only be used when the package choice is already clear."
                : "Paid packages remain optional later. Checkout is not live, and payment should only open after scope, terms, and fit are clear."}
            </p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <details className="planner-detail-group pricing-package-disclosure">
          <summary className="planner-detail-summary">
            <div>
              <p className="section-label">Optional</p>
              <strong>See the common questions</strong>
            </div>
            <span className="planner-detail-toggle" aria-hidden="true">More</span>
          </summary>
          <div className="planner-detail-body">
            <p className="planner-detail-copy">
              Open this only if something still feels unclear after the request-first explanation above.
            </p>
            <div className="card-grid two">
              {partnerFaqs.map((faq) => (
                <article className="source-panel conversion-panel" key={faq.title}>
                  <h2>{faq.title}</h2>
                  <p>{faq.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </details>
      </section>

      <section className="cta-band partner-preview-cta-band">
        <MapIcon />
        <div>
          <h2>Start with the free request, get the fit note back, then decide what is worth doing next</h2>
          <p>
            CityAtlas can review the business, suggest the clearest angle, and keep the next step
            simple before any paid package conversation.
          </p>
        </div>
        <AppLink
          className="button primary"
          onClick={buildTrackedNavigationHandler("/for-businesses/submit", "bottom_request")}
          to="/for-businesses/submit"
        >
          Start business request <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
