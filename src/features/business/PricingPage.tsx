import type { CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, ShieldIcon } from "../../components/Icons";
import { SafeModeNotice, SectionHeader, StatusPill } from "../../components/UI";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
} from "../../config/site";

interface PricingPageProps {
  data: CityAtlasData;
}

function getPaymentStateLabel(packageId: PackageId, paymentState: string) {
  if (hasPartnerPackageCheckout(packageId)) {
    return "Stripe-hosted checkout available";
  }

  if (paymentState === "disabled_until_launch_approval") {
    return "Checkout opens after review";
  }
  return "Review request first";
}

export function PricingPage({ data }: PricingPageProps) {
  const hasAnyCheckout = data.packages.some((plan) => hasPartnerPackageCheckout(plan.id));

  return (
    <>
      <section className="pricing-hero">
        <div>
          <p className="section-label">For businesses</p>
          <h1>Choose the CityAtlas package that fits your Vancouver visibility problem</h1>
          <p>
            Use this page when a Vancouver business wants clearer guide placement, source-backed
            city visibility, mission sponsorship angles, or a cleaner local growth story.
            CityAtlas starts with a review step, then opens billing only after fit, scope, and
            terms are clear.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/for-businesses/submit">
              Request review
              <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/editorial-standards">
              Review standards
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/partner-preview">
              Partner preview
            </AppLink>
          </div>
        </div>
        <SafeModeNotice />
      </section>

      <section className="section-block">
        <SectionHeader
          title={hasAnyCheckout ? "Choose the right review path before checkout" : "See the package structure before checkout opens"}
          copy={
            hasAnyCheckout
              ? "These packages stay review-first. Stripe-hosted checkout can open for paid packages, but payment does not promise publication, placement, traffic, or automatic approval."
              : "These packages show the service structure. Checkout, payment links, and subscriptions open only after review, scope confirmation, and clear terms."
          }
          action={<StatusPill tone={hasAnyCheckout ? "green" : "amber"}>{hasAnyCheckout ? "Checkout link live" : "Review first"}</StatusPill>}
        />
        <div className="pricing-grid">
          {data.packages.map((plan) => {
            const checkoutUrl = getPartnerPackageCheckoutUrl(plan.id);
            const checkoutEnabled = hasPartnerPackageCheckout(plan.id) && checkoutUrl;

            return (
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
                  {checkoutEnabled ? <CheckIcon /> : <LockIcon />}
                  <span>{getPaymentStateLabel(plan.id, plan.paymentState)}</span>
                </div>
                {checkoutEnabled ? (
                  <>
                    <a className="button primary wide" href={checkoutUrl}>
                      {getPartnerPackageCheckoutLabel(plan.id)}
                      <ArrowRightIcon />
                    </a>
                    <AppLink className="button secondary wide" to={`/for-businesses/submit?package=${plan.id}`}>
                      Send details first
                    </AppLink>
                  </>
                ) : (
                  <AppLink className="button secondary wide" to={`/for-businesses/submit?package=${plan.id}`}>
                    Request review
                  </AppLink>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Best first ask"
          title="Choose the right visibility request before you ask for a package"
          copy="CityAtlas is strongest when a business names the real local-visibility problem first: guide placement, route sponsorship, trust review, or a stronger business profile."
          action={<StatusPill tone="blue">Trust-first business routing</StatusPill>}
        />
        <div className="guide-query-grid">
          <AppLink className="query-card query-card-link" to="/vancouver/guides">
            <strong>Need guide placement and neighborhood fit?</strong>
            <p>Open the guide library when the real problem is showing up in the right Vancouver route or destination cluster.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/vancouver/missions">
            <strong>Need a sponsor-ready route or shareable city plan?</strong>
            <p>Use missions when the business needs a sponsor-ready route, creator visit shape, or a shareable city plan.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/editorial-standards">
            <strong>Need the trust rules first?</strong>
            <p>Review this before asking for live publication, because CityAtlas keeps source, claim, and correction boundaries visible.</p>
          </AppLink>
          <AppLink className="query-card query-card-link" to="/for-businesses/submit">
            <strong>Ready for review?</strong>
            <p>Go straight to review request when the business already knows it wants a CityAtlas page, package, or clearer local growth plan.</p>
          </AppLink>
        </div>
      </section>

      <section className="split-section">
        <div className="source-panel conversion-panel">
          <h2>What a CityAtlas partner gets in the first 7 days</h2>
          <ul className="conversion-list">
            <li><CheckIcon /> Premium page outline with source and review status.</li>
            <li><CheckIcon /> Category or neighborhood guide placement review.</li>
            <li><CheckIcon /> Offer or event module prepared for confirmation.</li>
            <li><CheckIcon /> AI visibility snapshot for the business.</li>
            <li><CheckIcon /> Creator visit brief when the business is a strong fit.</li>
          </ul>
        </div>
        <div className="source-panel conversion-panel">
          <h2>Objections we handle before billing</h2>
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
              It means clearer guide placement, better route fit, source-backed starter context,
              mission sponsorship angles, and stronger city-facing presentation. It does not mean
              traffic guarantees, fake rankings, or automatic publication.
            </p>
          </article>
          <article className="source-panel conversion-panel">
            <h2>What does CityAtlas need from a partner first?</h2>
            <p>
              The first yes is not payment. If the preview is a fit, CityAtlas asks for a
              complimentary hosted meal, service, visit, or offering for Michael and one guest so
              the feature can be accurate.
            </p>
          </article>
        </div>
      </section>

      <section className="cta-band">
        <ShieldIcon />
        <div>
          <h2>Best first monetization path</h2>
          <p>
            Use this page for early partner conversations first. When checkout is available, keep
            the payment decision tied to fit, scope, and a clear business request.
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
            Requests stay private to this form and can be reviewed for fit, facts, and next
            steps before anything is published.
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
