import { AppLink } from "../../components/Link";
import { LockIcon, ShieldIcon } from "../../components/Icons";
import { StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";

export function TermsPage() {
  return (
    <section className="section-block page-top legal-page">
      <section className="city-hero legal-hero">
        <div>
          <p className="section-label">Current terms</p>
          <h1>CityAtlas terms for the public site today</h1>
          <p>
            These terms describe the public discovery site, the review-request flow, and what is
            still not live yet. Checkout is still off.
          </p>
        </div>
        <div className="public-intro-card legal-hero-card">
          <div className="public-intro-card-header">
            <div>
              <strong>Plain-English summary</strong>
              <p>The public site is live, but payment and publication still stay review-first.</p>
            </div>
            <StatusPill tone="amber">Payments off</StatusPill>
          </div>
          <ul className="public-note-list">
            <li><ShieldIcon /> Public guides and route pages are live.</li>
            <li><LockIcon /> Checkout, subscriptions, and invoices are not live.</li>
            <li><ShieldIcon /> A business request is a review request, not an approved listing.</li>
          </ul>
        </div>
      </section>

      <div className="legal-grid">
        <article className="source-panel">
          <ShieldIcon />
          <h2>What the public site is today</h2>
          <p>
            CityAtlas is a Vancouver-first discovery product with public guides, source-backed
            pages, and business review requests. Some marketplace-style pages are still illustrative
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
          <h2>What a review request means</h2>
          <p>
            A review request is not an approved listing, partnership, endorsement, or contract.
            CityAtlas may review, verify, decline, or request more information before any business
            page, offer, or event is published.
          </p>
        </article>

        <article className="source-panel">
          <h2>How CityAtlas handles facts and claims</h2>
          <p>
            CityAtlas avoids public claims about real businesses until facts, media rights, source
            permissions, and removal paths are clear. Source-backed pages must link to official
            sources and correction paths. Ratings, reviews, popularity, traffic, booking, and
            revenue claims must be backed by evidence before public use.
          </p>
        </article>

        <article className="source-panel">
          <h2>What to double-check yourself</h2>
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
            Finalize terms, refund policy, fulfillment scope, Stripe products, support process, and
            business data policy before enabling checkout.
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
  return (
    <section className="section-block page-top legal-page">
      <section className="city-hero legal-hero">
        <div>
          <p className="section-label">Current privacy</p>
          <h1>How CityAtlas handles data today</h1>
          <p>
            This page explains how the public site currently handles data and what has to change
            before analytics, CRM, email, AI tools, or payments are connected.
          </p>
        </div>
        <div className="public-intro-card legal-hero-card">
          <div className="public-intro-card-header">
            <div>
              <strong>Plain-English summary</strong>
              <p>Saved plans stay in this browser today, and no outside providers are connected yet.</p>
            </div>
            <StatusPill tone="blue">Public site</StatusPill>
          </div>
          <ul className="public-note-list">
            <li><ShieldIcon /> Saved plans and submissions stay in browser storage right now.</li>
            <li><LockIcon /> No CRM, analytics, AI, email, or payment tools are connected.</li>
            <li><ShieldIcon /> Admin and protected routes stay off the public site.</li>
          </ul>
        </div>
      </section>

      <div className="legal-grid">
        <article className="source-panel">
          <ShieldIcon />
          <h2>What stays in this browser</h2>
          <p>
            Currently, submissions, saves, and planning activity are stored in browser
            localStorage. They do not sync to a database, CRM, email provider, analytics provider,
            AI provider, or payment provider.
          </p>
        </article>

        <article className="source-panel">
          <h2>What may be added later</h2>
          <p>
            As CityAtlas expands, it may collect business contact details, package interest,
            visitor analytics, saved-route activity, source records, support requests, billing
            status, and permissioned communication history.
          </p>
        </article>

        <article className="source-panel">
          <h2>What has to be decided first</h2>
          <p>
            Any future Supabase, Vercel, Cloudflare, Stripe, analytics, AI, email, or CRM
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
          <h2>Why admin stays protected</h2>
          <p>
            Admin and protected routes are kept off the public site before any hosted version
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
          <h2>Before outside tools connect</h2>
          <p>
            Analytics, CRM, outreach, provider imports, AI summaries, and Stripe are not connected
            on the public site today.
          </p>
        </div>
        <AppLink className="button secondary" to="/terms">
          Terms
        </AppLink>
      </div>
    </section>
  );
}
