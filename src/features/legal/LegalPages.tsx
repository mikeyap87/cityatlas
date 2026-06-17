import { AppLink } from "../../components/Link";
import { LockIcon, ShieldIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";

export function TermsPage() {
  return (
    <section className="section-block page-top legal-page">
      <SectionHeader
        label="Current terms"
        title="CityAtlas terms for the current public site"
        copy="These terms describe the current public discovery surface, source-backed editorial pages, and business review requests. Payments are not active."
        action={<StatusPill tone="amber">Payments not active</StatusPill>}
      />

      <div className="legal-grid">
        <article className="source-panel">
          <ShieldIcon />
          <h2>Current service state</h2>
          <p>
            CityAtlas is a Vancouver-first discovery product with public guides, source-backed
            pages, and business review requests. Some marketplace-style pages are still illustrative
            and should not be treated as verified public listings.
          </p>
        </article>

        <article className="source-panel">
          <LockIcon />
          <h2>Payments and packages</h2>
          <p>
            Package prices shown in the app describe possible service tiers. CityAtlas does not
            currently accept payments, create subscriptions, issue invoices, or guarantee
            placement.
          </p>
        </article>

        <article className="source-panel">
          <h2>Business submissions</h2>
          <p>
            A review request is not an approved listing, partnership, endorsement, or contract.
            CityAtlas may review, verify, decline, or request more information before any business
            page, offer, or event is published.
          </p>
        </article>

        <article className="source-panel">
          <h2>Content and claims</h2>
          <p>
            CityAtlas avoids public claims about real businesses until facts, media rights, source
            permissions, and removal paths are clear. Source-backed pages must link to official
            sources and correction paths. Ratings, reviews, popularity, traffic, booking, and
            revenue claims must be backed by evidence before public use.
          </p>
        </article>

        <article className="source-panel">
          <h2>Current limits</h2>
          <p>
            CityAtlas is provided for public discovery as-is. It should not
            be relied on for legal, financial, safety, travel, accessibility, dietary, health, or
            availability decisions without direct verification from the relevant official business or
            venue source.
          </p>
        </article>

        <article className="source-panel">
          <h2>Contact</h2>
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
          <h2>Before live payments</h2>
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
      <SectionHeader
        label="Current privacy"
        title="CityAtlas privacy and data posture"
        copy="This page explains how the public site currently handles data and what changes before analytics, CRM, email, AI providers, or payments are connected."
        action={<StatusPill tone="blue">Public site</StatusPill>}
      />

      <div className="legal-grid">
        <article className="source-panel">
          <ShieldIcon />
          <h2>Current data handling</h2>
          <p>
            Currently, submissions, saves, and planning activity are stored in browser
            localStorage. They do not sync to a database, CRM, email provider, analytics provider,
            AI provider, or payment provider.
          </p>
        </article>

        <article className="source-panel">
          <h2>Future data categories</h2>
          <p>
            As CityAtlas expands, it may collect business contact details, package interest,
            visitor analytics, saved-route activity, source records, support requests, billing
            status, and permissioned communication history.
          </p>
        </article>

        <article className="source-panel">
          <h2>Provider gates</h2>
          <p>
            Any future Supabase, Vercel, Cloudflare, Stripe, analytics, AI, email, or CRM
            integrations should have a clear purpose, retention policy, access plan, deletion path,
            and rollback behavior before they are connected.
          </p>
        </article>

        <article className="source-panel">
          <h2>Business data and removal</h2>
          <p>
            Real business pages should include approved sources, visible source dates, and a
            correction/removal path. CityAtlas should not publish sensitive, misleading, outdated,
            or unverified business claims.
          </p>
        </article>

        <article className="source-panel">
          <h2>Security posture</h2>
          <p>
            Admin and protected routes are kept off the public site before any hosted version
            contains non-public business submissions or review notes.
          </p>
        </article>

        <article className="source-panel">
          <h2>Contact</h2>
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
          <h2>Before external sync</h2>
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
