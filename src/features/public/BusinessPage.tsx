import type { Business, CityAtlasData, SourceRecord } from "../../types";
import { simplifyBusinessDisplayText } from "../../lib/publicCopy";
import { getReadinessChecklist } from "../../lib/scoring";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, MapIcon, ShieldIcon, StoreIcon } from "../../components/Icons";
import { ChecklistItem, SectionHeader, StatusPill } from "../../components/UI";
import { OfferCard } from "../../components/Cards";
import { getBusinessVisual } from "../../lib/visuals";

interface BusinessPageProps {
  business?: Business;
  data: CityAtlasData;
}

function isExampleBusiness(business: Business) {
  return business.trustLevel === "fictional_seed";
}

function getBusinessExampleLabel(business: Business) {
  const text = [business.category, business.slug, ...business.subcategories, ...business.bestFor]
    .join(" ")
    .toLowerCase();

  if (text.includes("coffee") || text.includes("cafe")) return "Cafe";
  if (text.includes("restaurant") || text.includes("dinner")) return "Dinner spot";
  if (text.includes("wellness") || text.includes("recovery") || text.includes("spa")) return "Wellness spot";
  if (text.includes("repair") || text.includes("clean") || text.includes("detailing") || text.includes("auto")) {
    return "Service business";
  }
  if (text.includes("cycle") || text.includes("outdoor") || text.includes("beach")) return "Activity stop";
  return "Local business";
}

function getBusinessHeroTitle(business: Business) {
  const primaryMoment = business.bestFor[0];
  if (primaryMoment) {
    return `${primaryMoment} in ${business.neighborhood}`;
  }

  return `${business.category} in ${business.neighborhood}`;
}

function getSourceStatusLabel(source: SourceRecord) {
  if (source.type === "demo_seed") return "Example data";
  if (source.type === "public_link") return source.verified ? "Official source" : "Source link added";
  if (source.type === "business_submission") {
    return source.verified ? "Business confirmed" : "Business submitted";
  }
  if (source.type === "founder_review") return source.verified ? "Checked by CityAtlas" : "Needs checking";
  return source.verified ? "Checked" : "Needs checking";
}

export function BusinessPage({ business, data }: BusinessPageProps) {
  if (!business) {
    return (
      <section className="not-found">
        <h1>Business not found</h1>
        <p>This page does not have a matching listing.</p>
        <div className="hero-actions">
          <AppLink className="button primary" to="/vancouver">
            Open Vancouver
          </AppLink>
          <AppLink className="button secondary" to="/for-businesses/submit">
            Start business request
          </AppLink>
        </div>
      </section>
    );
  }

  const offers = data.offers.filter((offer) => offer.businessId === business.id);
  const checklist = getReadinessChecklist(business);
  const hasLiveWebsite = !/example\.(com|invalid)$/i.test(new URL(business.website).hostname);
  const businessVisual = getBusinessVisual(business);
  const sources = business.sourceIds
    .map((sourceId) => data.sources.find((item) => item.id === sourceId))
    .filter((source): source is SourceRecord => Boolean(source));
  const exampleOnly = isExampleBusiness(business);
  const businessPageLabel = getBusinessExampleLabel(business);
  const heroStatusLabel = exampleOnly ? "Sample page" : "Official link page";
  const proofBannerTitle = exampleOnly ? "What is live on this page" : "What CityAtlas checked";
  const proofBannerCopy = exampleOnly
    ? "The page shape is live now. Official hours, booking details, and offer terms are added only after a real business check."
    : "CityAtlas checked the official source, contact path, and venue details first. Confirm live hours, menus, prices, and reservation availability on the official site before you go.";
  const heroContext = [
    business.category,
    business.neighborhood,
    typeof business.openNow === "boolean" ? (business.openNow ? "Open now" : "Closed now") : null,
  ]
    .filter((item): item is string => Boolean(item))
    .join(" · ");

  return (
    <>
      <section className="business-detail-hero">
        <div className="business-media-panel">
          <div className="business-media-frame">
            <img
              src={businessVisual}
              alt={`Photo or scene for ${business.name}`}
              decoding="async"
              fetchPriority="high"
              loading="eager"
            />
            <div className="business-media-copy">
              <span>{businessPageLabel}</span>
              <strong>{getBusinessHeroTitle(business)}</strong>
              <p>{simplifyBusinessDisplayText(business.shortDescription)}</p>
            </div>
          </div>
        </div>
        <div className="business-detail-panel">
          <div className="card-topline">
            <StatusPill tone="blue">{heroStatusLabel}</StatusPill>
          </div>
          <h1>{business.name}</h1>
          <p>{simplifyBusinessDisplayText(business.fullDescription)}</p>
          <p className="business-hero-context">{heroContext}</p>
          <div className="hero-actions">
            {hasLiveWebsite ? (
              <a className="button primary" href={business.website} target="_blank" rel="noreferrer">
                Visit website
              </a>
            ) : (
              <AppLink className="button primary" to="/for-businesses/submit">
                Start business request
              </AppLink>
            )}
          </div>
          <details className="disclosure-card business-detail-disclosure">
            <summary className="disclosure-summary">
              <div className="business-detail-disclosure-copy">
                <strong>{hasLiveWebsite ? "Need a different next step?" : "Need the trust note first?"}</strong>
                <p>
                  {hasLiveWebsite
                    ? "Open this for the CityAtlas check note, the hours reminder, and the business-owner request path."
                    : "Open this for the CityAtlas check note and a guide-first backup path."}
                </p>
              </div>
              <span className="disclosure-tag">Optional</span>
            </summary>
            <div className="disclosure-body">
              <div className="business-proof-banner">
                <strong>{proofBannerTitle}</strong>
                <p>{proofBannerCopy}</p>
              </div>
              <div className="hero-actions">
                {hasLiveWebsite ? (
                  <AppLink className="button secondary" to="/for-businesses/submit">
                    Start business request
                  </AppLink>
                ) : (
                  <AppLink className="button secondary" to="/vancouver/guides">
                    Open Vancouver guides
                  </AppLink>
                )}
              </div>
            </div>
          </details>
        </div>
      </section>

      <section className="split-section">
        <div>
          <SectionHeader
            label={exampleOnly ? "What a finished page includes" : "What this page includes"}
            title={
              exampleOnly
                ? "The basics, photos, and guide context in one place"
                : "The basics, photos, and official source path in one place"
            }
            copy={
              exampleOnly
                ? "Use this sample to see how one CityAtlas page can bring the basics, photos, and nearby guide context together after review."
                : "CityAtlas keeps these pages tight on purpose: the useful basics, a clear fit note, and the official path to re-check details before you go."
            }
          />
          <ul className="checklist-grid">
            {checklist.map((item) => (
              <ChecklistItem complete={item.complete} label={item.label} key={item.label} />
            ))}
          </ul>
        </div>
        <div className="source-panel">
          <ShieldIcon />
          <h2>{exampleOnly ? "How to read this sample page" : "What CityAtlas checks before a page is listed"}</h2>
          <p>
            {exampleOnly
              ? "This page shape is public now, but the official hours, pricing, and booking details only go live after a real business review."
              : "Before a real page goes public, CityAtlas checks the official site, basic contact details, and the clearest fit note without turning the page into hype."}
          </p>
          {exampleOnly ? (
            <ul className="public-note-list business-proof-list">
              <li>
                <ShieldIcon />
                <div>
                  <strong>Page shape first</strong>
                  <span>This sample shows where details, photos, and guide context can sit on a finished page.</span>
                </div>
              </li>
              <li>
                <MapIcon />
                <div>
                  <strong>Official details added after review</strong>
                  <span>Website links, live hours, and booking details appear here after a real business check.</span>
                </div>
              </li>
              <li>
                <StoreIcon />
                <div>
                  <strong>Offers appear only when clear</strong>
                  <span>Offer timing and redemption rules stay off the page until they are confirmed.</span>
                </div>
              </li>
            </ul>
          ) : (
            <div className="source-rows">
              {sources.map((source) => (
                <div className="source-row" key={source.id}>
                  <strong>{source.label}</strong>
                  <span>{getSourceStatusLabel(source)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="split-section">
        <div>
          <SectionHeader
            title="Best for"
            copy="These tags show the kinds of guides and moments this business could work well in."
          />
          <div className="tag-cloud">
            {business.bestFor.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="feature-list">
            {business.highlights.map((item) => (
              <div className="feature-row" key={item}>
                <StoreIcon />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            title={exampleOnly ? "Offers on a finished page" : "Offer status"}
            copy={
              exampleOnly
                ? "A finished business page can also show one simple offer once the timing, details, and redemption rules are confirmed."
                : "CityAtlas only adds a business-specific offer after the timing, terms, and redemption details are clear."
            }
          />
          <div className="stacked-list">
            {offers.length > 0 ? (
              offers.map((offer) => <OfferCard offer={offer} business={business} key={offer.id} />)
            ) : (
              <div className="empty-state">
                <strong>{exampleOnly ? "No sample offer attached yet" : "No live offer is attached right now"}</strong>
                <p>
                  {exampleOnly
                    ? "This page can still be considered for a feature, guide mention, or later offer."
                    : "This page can still help with planning, an official source check, or a future guide mention."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <MapIcon />
        <div>
          <h2>Start a business request</h2>
          <p>
            Share the details and CityAtlas can check the match, official details, and page options before
            anything goes live.
          </p>
        </div>
        <AppLink className="button primary" to="/for-businesses/submit">
          Start business request <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
