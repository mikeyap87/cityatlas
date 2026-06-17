import type { CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, ShieldIcon } from "../../components/Icons";
import { SafeModeNotice, SectionHeader, StatusPill } from "../../components/UI";

interface PricingPageProps {
  data: CityAtlasData;
}

function getPaymentStateLabel(paymentState: string) {
  if (paymentState === "disabled_until_launch_approval") {
    return "Checkout opens after review";
  }
  return "Review request first";
}

export function PricingPage({ data }: PricingPageProps) {
  return (
    <>
      <section className="pricing-hero">
        <div>
          <p className="section-label">For businesses</p>
          <h1>Choose the right CityAtlas package for your business</h1>
          <p>
            Start with a quick review. CityAtlas checks the fit first, then opens checkout only
            when the scope, terms, and next step are clear.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/for-businesses/submit">
              Request review
              <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/editorial-standards">
              Review standards
            </AppLink>
          </div>
        </div>
        <SafeModeNotice />
      </section>

      <section className="section-block">
        <SectionHeader
          label="How it works"
          title="Start with a simple review before any billing"
          copy="This keeps the first step simple and avoids selling the wrong package too early."
        />
        <div className="guide-query-grid">
          <article className="query-card">
            <span className="query-card-kicker">Step 1</span>
            <strong>Say what needs to improve</strong>
            <p>Share whether you need better guide placement, a stronger page, or clearer local visibility.</p>
          </article>
          <article className="query-card">
            <span className="query-card-kicker">Step 2</span>
            <strong>Get a fit and scope review</strong>
            <p>CityAtlas checks the facts, the page fit, and which package makes sense before anything goes live.</p>
          </article>
          <article className="query-card">
            <span className="query-card-kicker">Step 3</span>
            <strong>Open checkout only if the plan is clear</strong>
            <p>Checkout stays off until both sides are clear on the package, the terms, and what gets delivered first.</p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          title="See the package structure before checkout opens"
          copy="These packages show the shape of the offer. Checkout opens only after review, scope confirmation, and clear terms."
          action={<StatusPill tone="amber">Review first</StatusPill>}
        />
        <div className="pricing-grid">
          {data.packages.map((plan) => (
            <article
              className={plan.highlighted ? "pricing-card highlighted" : "pricing-card"}
              id={`package-${plan.id}`}
              key={plan.id}
            >
              {plan.highlighted ? <span className="plan-flag">Most useful first test</span> : null}
              <h2>{plan.name}</h2>
              <strong>{plan.priceLabel}</strong>
              <p>{plan.description}</p>
              <p><strong>Best first fit:</strong> {plan.bestFor}</p>
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
                <span>{getPaymentStateLabel(plan.paymentState)}</span>
              </div>
              <AppLink className="button secondary wide" to={`/for-businesses/submit?package=${plan.id}`}>
                Request review
              </AppLink>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Best first ask"
          title="Choose the right visibility request before you ask for a package"
          copy="CityAtlas works best when a business names the real problem first: guide placement, event or offer support, trust review, or a stronger page."
          action={<StatusPill tone="blue">Trust-first business routing</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink className="query-card query-card-link" to="/vancouver/guides">
            <strong>Need guide placement and neighborhood fit?</strong>
            <p>Open the guide library when the real problem is showing up in the right Vancouver route or neighborhood choice.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/vancouver/missions">
            <strong>Need a sponsor-ready route or shareable city plan?</strong>
            <p>Use saved plans when the business needs a shareable city plan or a route that could later support sponsorship.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/editorial-standards">
            <strong>Need the trust rules first?</strong>
            <p>Review this before asking for live publication, because CityAtlas keeps source, claim, and correction rules visible.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/for-businesses/submit">
            <strong>Ready for review?</strong>
            <p>Go straight to the review request when the business already knows it wants a CityAtlas page, package, or better local visibility.</p>
          </AppLink>
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel conversion-panel">
          <h2>What a CityAtlas partner gets in the first 7 days</h2>
          <ul className="conversion-list">
            <li><CheckIcon /> A clear page outline with review status.</li>
            <li><CheckIcon /> Guide and neighborhood placement review.</li>
            <li><CheckIcon /> Event or offer module prepared for confirmation.</li>
            <li><CheckIcon /> A visibility snapshot for the business.</li>
            <li><CheckIcon /> A short next-step plan if the fit is strong.</li>
          </ul>
        </div>
        <div className="source-panel conversion-panel">
          <h2>What stays off until approval</h2>
          <ul className="conversion-list">
            <li><LockIcon /> No traffic promises until analytics prove demand.</li>
            <li><LockIcon /> No live payment until terms and refund policy are approved.</li>
            <li><LockIcon /> No public profile until business facts are verified.</li>
            <li><LockIcon /> No automated outreach until compliance is reviewed.</li>
            <li><LockIcon /> No health, event, or offer claims without extra review.</li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Questions"
          title="What businesses usually need to know first"
          copy="These are the answers CityAtlas should be able to say clearly before checkout opens, a listing goes live, or a package promise is made."
        />
        <div className="card-grid three">
          <article className="source-panel conversion-panel">
            <h2>What happens before a business is ever charged?</h2>
            <p>
              CityAtlas starts with a local review request, verifies whether the business is a fit
              for guides or route surfaces, and waits to open checkout until terms, refund policy,
              and clear demand say the package is worth activating.
            </p>
          </article>
          <article className="source-panel conversion-panel">
            <h2>When should a business request review now?</h2>
            <p>
              Request review when the business already knows it needs better neighborhood visibility,
              guide placement, offer packaging, or a clearer city-facing story and is comfortable
              with a careful review-first step instead of instant self-serve billing.
            </p>
          </article>
          <article className="source-panel conversion-panel">
            <h2>What does CityAtlas mean by local visibility?</h2>
            <p>
              It means clearer guide placement, better route fit, stronger city-facing presentation,
              and a simpler way for people to find the right business at the right moment. It does
              not mean traffic guarantees, fake rankings, or automatic publication.
            </p>
          </article>
        </div>
      </section>

      <section className="cta-band">
        <ShieldIcon />
        <div>
          <h2>Best first monetization path</h2>
          <p>
            Use this page for early partner conversations first. Open checkout only after clear
            demand is proven.
          </p>
        </div>
        <AppLink className="button primary" to="/for-businesses/submit">
          Create review request <ArrowRightIcon />
        </AppLink>
      </section>

      <section className="split-section">
        <div className="source-panel">
          <ShieldIcon />
          <h2>What happens after request</h2>
          <p>
            Requests stay private to this form and can be reviewed for fit, facts, and next steps
            before anything is published.
          </p>
        </div>
        <div className="source-panel">
          <LockIcon />
          <h2>What is intentionally excluded</h2>
          <p>
            No checkout, no invoices, no automated email, no provider imports, and no public
            publication of real business claims before review.
          </p>
        </div>
      </section>
    </>
  );
}
