import { useEffect } from "react";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";

interface BusinessSupportPageProps {
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
}

const partnerPreviewSteps = [
  "Start with one business need: a clearer page, guide fit, or offer.",
  "CityAtlas checks the facts and the fit before anything public changes.",
  "Payment is only useful once the scope is clear enough to choose a package.",
];

const partnerPreviewBoundaries = [
  "No instant public profile.",
  "No traffic, ranking, or placement guarantee.",
  "No automated outreach or follow-up from this page.",
  "No live payment is required to start the request.",
];

const callPrepItems = [
  "The business category and neighborhood.",
  "The one result you want first.",
  "A website, Instagram, or public contact path if one exists.",
];

export function PartnerPreviewPage({ onTrack }: BusinessSupportPageProps) {
  useEffect(() => {
    onTrack("business_partner_preview_viewed", {
      surface: "partner_preview",
    });
  }, [onTrack]);

  function trackCtaClick(location: string) {
    onTrack("business_partner_preview_cta_clicked", {
      location,
    });
  }

  return (
    <>
      <section className="pricing-hero pricing-hero-compact partner-preview-hero">
        <div>
          <p className="section-label">For businesses</p>
          <h1>How a CityAtlas business feature starts</h1>
          <p>
            CityAtlas works best when a business starts with one clear local visibility problem,
            then moves into the smallest useful next step after review.
          </p>
          <div className="hero-actions">
            <AppLink
              className="button primary"
              onClick={() => trackCtaClick("hero")}
              to="/for-businesses/submit"
            >
              Start business request
              <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/pricing">
              Compare packages
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>Request first</span>
            <span>Review before publication</span>
            <span>Checkout only when scope is clear</span>
          </div>
        </div>
        <div className="pricing-hero-side">
          <HeroMediaCard
            image={siteConfig.media.business}
            alt="Illustrated market scene inspired by Granville Island Public Market in Vancouver"
            eyebrow="Partner preview"
            title="One clear need before a bigger package"
            copy="The first useful move is naming what should improve before choosing whether a paid package is worth it."
          />
        </div>
      </section>

      <section className="section-block partner-preview-example-section">
        <SectionHeader
          label="Working model"
          title="What CityAtlas needs from a local partner"
          copy="A strong request lets CityAtlas choose the smallest practical move instead of pushing every business into the same package."
        />
        <div className="card-grid three">
          {partnerPreviewSteps.map((step, index) => (
            <article className="source-panel conversion-panel partner-preview-example-card" key={step}>
              <StatusPill tone={index === 0 ? "green" : "amber"}>Step {index + 1}</StatusPill>
              <strong>{step}</strong>
              <p>
                {index === 0
                  ? "The request keeps the first conversation focused."
                  : index === 1
                    ? "The review keeps public claims and business details honest."
                    : "The package choice should follow the scope, not lead it."}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section">
        <article className="source-panel conversion-panel pricing-mini-card pricing-mini-card-safe">
          <ShieldIcon />
          <strong>What this preview does not promise</strong>
          <ul className="conversion-list">
            {partnerPreviewBoundaries.map((boundary) => (
              <li key={boundary}>
                <LockIcon />
                <span>{boundary}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="source-panel conversion-panel pricing-mini-card">
          <SparkIcon />
          <strong>Best first use</strong>
          <p>
            Use this when the business wants a clearer page, better guide fit, simpler offer, or
            a cleaner local story, but the exact paid scope still needs review.
          </p>
          <AppLink
            className="text-link"
            onClick={() => trackCtaClick("best_first_use")}
            to="/for-businesses/submit"
          >
            Start business request <ArrowRightIcon />
          </AppLink>
        </article>
      </section>
    </>
  );
}

export function BookCallPage({ onTrack }: BusinessSupportPageProps) {
  useEffect(() => {
    onTrack("business_short_call_viewed", {
      surface: "book_call",
    });
  }, [onTrack]);

  return (
    <>
      <section className="pricing-hero pricing-hero-compact">
        <div>
          <p className="section-label">Short call</p>
          <h1>Request a short CityAtlas business call</h1>
          <p>
            If writing the full request feels too slow, send the basics first. CityAtlas can use
            that to decide whether a short call, a reply, or a package comparison is the right next
            step.
          </p>
          <div className="hero-actions">
            <AppLink
              className="button primary"
              onClick={() => onTrack("business_short_call_cta_clicked", { location: "hero" })}
              to="/for-businesses/submit"
            >
              Start the request
              <ArrowRightIcon />
            </AppLink>
            <a
              className="button secondary"
              href={`mailto:${siteConfig.contactEmail}?subject=CityAtlas%20short%20business%20call%20request`}
              onClick={() => onTrack("business_short_call_email_clicked", { location: "hero" })}
            >
              Email CityAtlas
            </a>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>No automatic booking</span>
            <span>No payment to ask</span>
            <span>Best after one clear goal</span>
          </div>
        </div>
        <div className="pricing-hero-side">
          <HeroMediaCard
            image={siteConfig.media.business}
            alt="Illustrated market scene inspired by Granville Island Public Market in Vancouver"
            eyebrow="Keep it simple"
            title="Bring one business need"
            copy="The call request works best when it starts from one business category, one neighborhood, and one goal."
          />
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Call prep"
          title="What to have ready before asking"
          copy="This is a lightweight request path, not a live scheduling system."
        />
        <div className="card-grid three">
          {callPrepItems.map((item) => (
            <article className="source-panel conversion-panel partner-preview-example-card" key={item}>
              <CheckIcon />
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
