import { AppLink } from "../../components/Link";
import { LockIcon, ShieldIcon } from "../../components/Icons";
import { StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";
import { getAnalyticsReadiness } from "../../lib/analytics";

export function TermsPage() {
  return (
    <section className="section-block page-top legal-page">
      <section className="city-hero legal-hero">
        <div>
          <p className="section-label">Terms</p>
          <h1>CityAtlas terms for the public site</h1>
          <p>
            These terms explain the public guide site, the business request form, and what is not
            live yet. CityAtlas does not take payments on this site today.
          </p>
          <div className="hero-actions">
            <AppLink className="button secondary" to="/editorial-standards">
              Editorial standards
            </AppLink>
            <AppLink className="button secondary" to="/privacy">
              Privacy
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>Public guides live</span>
            <span>Payments off</span>
            <span>Requests are review-first</span>
          </div>
        </div>
        <div className="public-intro-card legal-hero-card">
          <div className="public-intro-card-header">
            <div>
              <strong>Plain-English summary</strong>
              <p>The public guide site is live. Payment is not.</p>
            </div>
            <StatusPill tone="amber">Payments off</StatusPill>
          </div>
          <ul className="public-note-list">
            <li><ShieldIcon /> Public guides and starting pages are live.</li>
            <li><LockIcon /> Checkout, subscriptions, and invoices are not live.</li>
            <li><ShieldIcon /> A business request is not an approved listing.</li>
          </ul>
        </div>
      </section>

      <div className="legal-grid">
        <article className="source-panel">
          <ShieldIcon />
          <h2>What the public site includes today</h2>
          <p>
            CityAtlas is a Vancouver-first discovery product with public guides, carefully checked
            local places with official links, and business requests. Some marketplace-style pages are still examples
            and should not be treated as verified public listings.
          </p>
        </article>

        <article className="source-panel">
          <LockIcon />
          <h2>What is not live yet</h2>
          <p>
            Package prices shown in the app describe possible service tiers. CityAtlas does not
            currently accept payments, create subscriptions, issue invoices, or guarantee
            placement.
          </p>
        </article>

        <article className="source-panel">
          <h2>What a business request means</h2>
          <p>
            A business request is not an approved listing, partnership, endorsement, or contract.
            CityAtlas may review, verify, decline, or request more information before any business
            page, offer, or event is published.
          </p>
        </article>

        <article className="source-panel">
          <h2>How CityAtlas handles facts and claims</h2>
          <p>
            CityAtlas avoids public claims about real businesses until facts, media rights, source
            permissions, and removal paths are clear. Local places must link to official sources and
            report-an-issue paths. Ratings, reviews, popularity, traffic, booking, and revenue
            claims must be backed by evidence before public use.
          </p>
        </article>

        <article className="source-panel">
          <h2>What to verify yourself</h2>
          <p>
            CityAtlas is provided for public discovery as-is. It should not
            be relied on for legal, financial, safety, travel, accessibility, dietary, health, or
            availability decisions without direct verification from the relevant official business or
            venue source.
          </p>
        </article>

        <article className="source-panel">
          <h2>Need a correction or takedown?</h2>
          <p>
            For review, correction, takedown, privacy, or business-package questions, contact{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> or review{" "}
            <AppLink to="/editorial-standards">CityAtlas editorial standards</AppLink>.
          </p>
        </article>
      </div>

      <div className="cta-band">
        <ShieldIcon />
        <div>
          <h2>Before checkout opens</h2>
          <p>
            Finalize terms, refund policy, fulfillment scope, Stripe products, support process,
            and business data policy before enabling checkout.
          </p>
        </div>
        <AppLink className="button secondary" to="/privacy">
          Privacy
        </AppLink>
      </div>
    </section>
  );
}

export function PrivacyPage() {
  const analyticsReady = getAnalyticsReadiness().hasExternalDestination;

  return (
    <section className="section-block page-top legal-page">
      <section className="city-hero legal-hero">
        <div>
          <p className="section-label">Privacy</p>
          <h1>How CityAtlas handles data today</h1>
          <p>
            This page explains what the public site stores today and how analytics, business
            requests, and future provider tools are handled.
          </p>
          <div className="hero-actions">
            <AppLink className="button secondary" to="/editorial-standards">
              Editorial standards
            </AppLink>
            <AppLink className="button secondary" to="/terms">
              Terms
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>Saved on this device</span>
            <span>{analyticsReady ? "Analytics needs consent" : "No outside analytics yet"}</span>
            <span>Protected pages stay separate</span>
          </div>
        </div>
        <div className="public-intro-card legal-hero-card">
          <div className="public-intro-card-header">
            <div>
              <strong>Plain-English summary</strong>
              <p>
                {analyticsReady
                  ? "Saved plans stay on this device, and analytics only runs if a visitor allows it."
                  : "Saved plans stay on this device today, and no outside analytics provider is connected yet."}
              </p>
            </div>
            <StatusPill tone="blue">Public site</StatusPill>
          </div>
          <ul className="public-note-list">
            <li><ShieldIcon /> Saved plans and submissions stay on this device right now.</li>
            <li>
              <LockIcon />
              {analyticsReady
                ? "Analytics can run only after a visitor allows it on this device."
                : "No CRM, analytics, AI, email, or payment tools are connected."}
            </li>
            <li><ShieldIcon /> Admin and protected pages stay off the public site.</li>
          </ul>
        </div>
      </section>

      <div className="legal-grid">
        <article className="source-panel">
          <ShieldIcon />
          <h2>What stays on this device</h2>
          <p>
            Currently, submissions, saves, and planning activity are stored only on this device.
            They do not sync to a database, CRM, email provider, AI provider,
            or payment provider.
            {analyticsReady
              ? " If analytics is enabled, campaign and page events are measured only after visitor consent."
              : " They also do not sync to an analytics provider today."}
          </p>
        </article>

        <article className="source-panel">
          <h2>What may be added later</h2>
          <p>
            As CityAtlas expands, it may collect business contact details, package interest,
            visitor analytics, saved-plan activity, source records, support requests, billing
            status, and permissioned communication history.
          </p>
        </article>

        <article className="source-panel">
          <h2>What would need clear rules first</h2>
          <p>
            Any future database, hosting, analytics, AI, email, or payment
            integrations should have a clear purpose, retention policy, access plan, deletion path,
            and rollback behavior before they are connected.
          </p>
        </article>

        <article className="source-panel">
          <h2>Business facts and removal requests</h2>
          <p>
            Real business pages should include approved sources, visible source dates, and a
            correction/removal path. CityAtlas should not publish sensitive, misleading, outdated,
            or unverified business claims.
          </p>
        </article>

        <article className="source-panel">
          <h2>Why protected pages stay separate</h2>
          <p>
            Admin and protected pages are kept off the public site before any hosted version
            contains non-public business submissions or review notes.
          </p>
        </article>

        <article className="source-panel">
          <h2>Need privacy help?</h2>
          <p>
            For privacy, correction, or deletion questions, contact{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> or use{" "}
            <AppLink to="/editorial-standards">the public standards page</AppLink>.
          </p>
        </article>
      </div>

      <div className="cta-band">
        <LockIcon />
        <div>
          <h2>{analyticsReady ? "Analytics stays consent-based" : "Before outside tools connect"}</h2>
          <p>
            {analyticsReady
              ? "CityAtlas can measure visit and business-request events only after a visitor allows analytics. CRM, outreach, AI summaries, and payment tools still stay off."
              : "Analytics, CRM, outreach, AI summaries, and payment tools are not connected on the public site today."}
          </p>
        </div>
        <AppLink className="button secondary" to="/terms">
          Terms
        </AppLink>
      </div>
    </section>
  );
}
