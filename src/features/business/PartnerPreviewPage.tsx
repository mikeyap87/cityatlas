import { useEffect } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
  siteConfig,
} from "../../config/site";
import type { CityAtlasData } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, MapIcon, ShieldIcon, SparkIcon, StoreIcon } from "../../components/Icons";
import { SectionHeader } from "../../components/UI";

interface PartnerPreviewPageProps {
  data: CityAtlasData;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
}

const previewSteps = [
  {
    title: "CityAtlas reviews the fit",
    copy:
      "We look at the business, category, city, contact path, and route angle before anything public or paid is promised.",
  },
  {
    title: "You see the angle first",
    copy:
      "The first useful reply is a short preview: where you could fit, why it matters, and what would need confirming.",
  },
  {
    title: "You host the real experience",
    copy:
      "If the preview feels worth pursuing, the normal first ask is a complimentary meal, service, visit, or offering for Michael and one guest.",
  },
  {
    title: "Then we decide the next step",
    copy:
      "A free review may be enough. A paid package can come later, but checkout is not active and no business is pressured to buy.",
  },
];

const exampleFeatureBlocks = [
  {
    label: "Where you fit",
    title: "Neighborhood and route context",
    copy:
      "Example: a dinner anchor could fit a date-night route, a family cafe could fit a low-friction weekend route, and a cleaner or repair shop could fit a trusted local service guide.",
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

const partnerFaqs = [
  {
    title: "Is this a paid ad?",
    copy:
      "Not for the first review. The first step is a fit conversation. Paid packages can exist later, but CityAtlas is not asking you to buy anything before the fit is clear.",
  },
  {
    title: "Do you need something complimentary?",
    copy:
      "Only if you want to move ahead after the preview. The normal first partnership ask is a hosted meal, service, walkthrough, or offering for Michael and one guest so the feature can be built from real experience.",
  },
  {
    title: "Are other businesses being reviewed too?",
    copy:
      "Yes. CityAtlas reviews small batches by city, category, and route fit. That gives the page real context without promising every business will be featured.",
  },
  {
    title: "Which areas count?",
    copy:
      "CityAtlas starts with Vancouver and is expanding through Greater Vancouver, including places like Burnaby, Coquitlam, Surrey, Langley, and nearby municipalities as the local queue is verified.",
  },
];

function getCityPartnerLabel(data: CityAtlasData) {
  const cityPartner = data.packages.find((plan) => plan.id === "city_partner");
  return cityPartner ? `${cityPartner.name} later: ${cityPartner.priceLabel}` : "Paid packages later";
}

export function PartnerPreviewPage({ data, onTrack }: PartnerPreviewPageProps) {
  const cityPartnerCheckoutUrl = getPartnerPackageCheckoutUrl("city_partner");
  const canStartCityPartnerCheckout = hasPartnerPackageCheckout("city_partner") && cityPartnerCheckoutUrl;

  useEffect(() => {
    onTrack("business_partner_preview_viewed", {
      packageCount: data.packages.length,
      businessCount: data.businesses.length,
    });
  }, [data.businesses.length, data.packages.length, onTrack]);

  return (
    <>
      <section className="pricing-hero pricing-hero-compact partner-preview-hero">
        <div>
          <p className="section-label">Partner preview</p>
          <h1>What CityAtlas needs from a local partner</h1>
          <p>
            The first yes is not a payment. It is a simple fit review, then a complimentary hosted
            meal, service, visit, or offering if the preview feels useful enough to build from.
          </p>
          <div className="hero-actions">
            <AppLink
              className="button primary"
              onClick={() => onTrack("business_partner_preview_cta_clicked", { location: "hero_request" })}
              to="/for-businesses/submit"
            >
              Start free review
              <ArrowRightIcon />
            </AppLink>
            <AppLink
              className="button secondary"
              onClick={() => onTrack("business_partner_preview_cta_clicked", { location: "hero_pricing" })}
              to="/for-businesses/pricing"
            >
              Compare packages
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>No fee to be reviewed</span>
            <span>Hosted experience if aligned</span>
            <span>Restaurants + services</span>
            <span>Greater Vancouver ready</span>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Plain-English ask</strong>
            <p>
              If CityAtlas looks like a fit, host Michael and one guest for the real meal, service,
              visit, walkthrough, or offering so the future feature has accurate firsthand detail.
            </p>
          </article>
        </div>
        <aside className="source-panel partner-preview-side-card">
          <img src={siteConfig.media.hero} alt="Illustrated Vancouver market and local business scene" />
          <span className="query-card-kicker">Preview first</span>
          <h2>A feature should feel specific</h2>
          <p>
            CityAtlas works best when a business is matched to the right route, reader moment, and
            local decision before any paid package conversation.
          </p>
        </aside>
      </section>

      <section className="section-block">
        <SectionHeader
          label="How it works"
          title="The clean first partnership path"
          copy="This is the version a restaurant, cafe, cleaner, repair shop, wellness studio, or local service business should understand quickly."
        />
        <div className="card-grid four partner-step-grid">
          {previewSteps.map((step, index) => (
            <article className="source-panel partner-step-card" key={step.title}>
              <span>{index + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section partner-preview-example-section">
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
      </section>

      <section className="section-block">
        <SectionHeader
          label="What stays honest"
          title="No pressure, no traffic promises, no fake approval"
          copy="The page can sell the opportunity without pretending CityAtlas has already delivered results for a partner."
        />
        <div className="card-grid three">
          <article className="source-panel conversion-panel">
            <ShieldIcon />
            <h2>Free review first</h2>
            <p>
              A business can be reviewed without paying. The first decision is whether there is a
              useful route, guide, offer, or local-service angle.
            </p>
          </article>
          <article className="source-panel conversion-panel">
            <StoreIcon />
            <h2>Complimentary hosted experience</h2>
            <p>
              If both sides want to move forward, the clean next step is a hosted meal, service,
              walkthrough, or offering for Michael and one guest.
            </p>
          </article>
          <article className="source-panel conversion-panel">
            <LockIcon />
            <h2>{getCityPartnerLabel(data)}</h2>
            {canStartCityPartnerCheckout ? (
              <>
                <p>
                  Paid packages remain optional. Stripe-hosted checkout is available for businesses
                  that already understand the request-first scope and do not need traffic or
                  publication guarantees.
                </p>
                <a className="text-link" href={cityPartnerCheckoutUrl}>
                  {getPartnerPackageCheckoutLabel("city_partner")} <ArrowRightIcon />
                </a>
              </>
            ) : (
              <p>
                Paid packages remain optional later. Checkout is not live, and payment should only
                open after scope, terms, and fit are clear.
              </p>
            )}
          </article>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Questions"
          title="What businesses usually need clarified"
          copy="These answers prevent the first email from sounding like a surprise invoice or vague marketing pitch."
        />
        <div className="card-grid two">
          {partnerFaqs.map((faq) => (
            <article className="source-panel conversion-panel" key={faq.title}>
              <h2>{faq.title}</h2>
              <p>{faq.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band partner-preview-cta-band">
        <MapIcon />
        <div>
          <h2>Start with the free review, then decide if hosting us makes sense</h2>
          <p>
            CityAtlas can review the business, suggest the clearest angle, and keep the next ask
            simple before any paid package conversation.
          </p>
        </div>
        <AppLink
          className="button primary"
          onClick={() => onTrack("business_partner_preview_cta_clicked", { location: "bottom_request" })}
          to="/for-businesses/submit"
        >
          Start free review <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
