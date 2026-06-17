import type { Business, CityAtlasData } from "../../types";
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

export function BusinessPage({ business, data }: BusinessPageProps) {
  if (!business) {
    return (
      <section className="not-found">
        <h1>Business not found</h1>
        <p>This page does not have a matching listing.</p>
        <AppLink className="button primary" to="/vancouver">Back to Vancouver</AppLink>
      </section>
    );
  }

  const offers = data.offers.filter((offer) => offer.businessId === business.id);
  const checklist = getReadinessChecklist(business);

  return (
    <>
      <section className="business-detail-hero">
        <img src={getBusinessVisual(business)} alt={`Photo or scene for ${business.name}`} />
        <div className="business-detail-panel">
          <div className="card-topline">
            <StatusPill tone="blue">Example business page</StatusPill>
            <StatusPill tone="amber">Checked before publishing</StatusPill>
          </div>
          <h1>{business.name}</h1>
          <p>{business.fullDescription}</p>
          <div className="business-meta-grid">
            <span>{business.category}</span>
            <span>{business.neighborhood}</span>
            <span>{business.priceTier}</span>
            <span>{business.openNow ? "Open now" : "Closed now"}</span>
          </div>
          <div className="hero-actions">
            <a className="button primary" href={business.website} target="_blank" rel="noreferrer">
              Visit website
            </a>
            <AppLink className="button secondary" to="/for-businesses/submit">
              Start business request
            </AppLink>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div>
          <SectionHeader
            label="How this page works"
            title="What a CityAtlas business page can include"
            copy="This example shows the shape of a CityAtlas business page while facts, photos, and participation details are still being checked."
          />
          <ul className="checklist-grid">
            {checklist.map((item) => (
              <ChecklistItem complete={item.complete} label={item.label} key={item.label} />
            ))}
          </ul>
        </div>
        <div className="source-panel">
          <ShieldIcon />
          <h2>What gets checked first</h2>
          <p>
            CityAtlas checks hours, prices, availability, and contact details against the
            official site before treating a page like a live business listing.
          </p>
          <div className="source-rows">
            {business.sourceIds.map((sourceId) => {
              const source = data.sources.find((item) => item.id === sourceId);
              return source ? (
                <div className="source-row" key={source.id}>
                  <strong>{source.label}</strong>
                  <span>{source.verified ? "Verified" : "Unverified"}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </section>

      <section className="split-section">
        <div>
          <SectionHeader title="Best for" copy="Editorial and partner positioning that can later inform guide placement." />
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
            title="Offers"
            copy="Offers can appear here once the business confirms the details, timing, and redemption rules."
          />
          <div className="stacked-list">
            {offers.length > 0 ? (
              offers.map((offer) => <OfferCard offer={offer} business={business} key={offer.id} />)
            ) : (
              <div className="empty-state">
                <strong>No offer attached yet</strong>
                <p>This page can still be considered for feature or guide placement.</p>
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
            Share details, then CityAtlas can check source support, page fit, and feature
            possibilities before anything is published.
          </p>
        </div>
        <AppLink className="button primary" to="/for-businesses/submit">
          Start business request <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
