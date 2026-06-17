import type { Business, CityMission, EventItem, Guide, Offer, SavedItem } from "../types";
import { getGuidePath } from "../lib/cityPaths";
import { formatDate } from "../lib/format";
import { getBusinessVisual, getEventVisual, getGuideVisual } from "../lib/visuals";
import { ArrowRightIcon, CalendarIcon, MapIcon, ShieldIcon, SparkIcon, StoreIcon } from "./Icons";
import { AppLink } from "./Link";
import { StatusPill } from "./UI";

function getCitySlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function BusinessCard({ business }: { business: Business }) {
  return (
    <article className="content-card business-card">
      <img
        src={getBusinessVisual(business)}
        alt={`${business.name} preview artwork`}
        loading="lazy"
      />
      <div className="card-body">
        <div className="card-topline">
          <StatusPill tone="blue">Sample business page</StatusPill>
          <span>{business.priceTier}</span>
        </div>
        <h3>{business.name}</h3>
        <p>{business.shortDescription}</p>
        <div className="card-meta">
          <span>{business.category}</span>
          <span>{business.neighborhood}</span>
          <span>{business.openNow ? "Open now" : "Closed now"}</span>
        </div>
        <AppLink className="card-link" to={`/${getCitySlug(business.city)}/businesses/${business.slug}`}>
          View page
        </AppLink>
      </div>
    </article>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="content-card compact-card">
      <img src={getEventVisual(event)} alt={`${event.title} preview artwork`} loading="lazy" />
      <div className="card-body">
        <div className="card-icon-line">
          <CalendarIcon />
          <span>{formatDate(event.date)} at {event.time}</span>
        </div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="card-meta">
          <span>{event.neighborhood}</span>
          <span>{event.priceLabel}</span>
          <span>{event.capacity} capacity</span>
        </div>
      </div>
    </article>
  );
}

export function OfferCard({
  offer,
  business,
}: {
  offer: Offer;
  business?: Business;
}) {
  return (
    <article className="content-card offer-card">
      <div className="offer-card-inner">
        <StatusPill tone="amber">Sample offer</StatusPill>
        <h3>{offer.title}</h3>
        <p>{offer.description}</p>
        <div className="card-meta">
          <span>{business?.name ?? "Partner pending"}</span>
          <span>Ends {formatDate(offer.endDate)}</span>
        </div>
        <small>{offer.redemptionInstructions}</small>
      </div>
    </article>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="content-card guide-card">
      <img src={getGuideVisual(guide)} alt={`${guide.title} preview artwork`} loading="lazy" />
      <div className="card-body">
        <div className="card-icon-line">
          <MapIcon />
          <span>{guide.readMinutes} min read</span>
        </div>
        <h3>{guide.title}</h3>
        <p>{guide.excerpt}</p>
        <div className="card-meta">
          <span>{guide.category}</span>
          <span>{guide.neighborhood}</span>
          <span>{guide.sponsored ? "Sponsored" : "Editorial"}</span>
        </div>
        <AppLink className="card-link" to={getGuidePath(guide)}>
          Read guide
        </AppLink>
      </div>
    </article>
  );
}

function getMissionProgress(mission: CityMission, savedItems: SavedItem[]) {
  if (mission.steps.length === 0) return 0;
  const savedCount = mission.steps.filter((step) =>
    savedItems.some((item) => item.itemType === step.itemType && item.itemId === step.itemId),
  ).length;
  return Math.round((savedCount / mission.steps.length) * 100);
}

export function MissionCard({
  mission,
  savedItems,
  onSaveMission,
}: {
  mission: CityMission;
  savedItems: SavedItem[];
  onSaveMission?: (mission: CityMission) => void;
}) {
  const progress = getMissionProgress(mission, savedItems);

  return (
    <article className="content-card mission-card">
      <div className="mission-card-top">
        <StatusPill tone={mission.featured ? "blue" : "muted"}>{mission.theme}</StatusPill>
        <span>{mission.timeBox}</span>
      </div>
      <h3>{mission.title}</h3>
      <p>{mission.hook}</p>
      <div className="mission-progress">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="mission-meta">
        <small>{progress}% saved</small>
        <small>{mission.steps.length} steps</small>
      </div>
      <ol className="mission-step-preview">
        {mission.steps.map((step, index) => (
          <li key={`${mission.id}-${step.itemType}-${step.itemId}-${index}`}>
            <SparkIcon />
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
      <div className="mission-actions">
        {onSaveMission ? (
          <button className="button primary" type="button" onClick={() => onSaveMission(mission)}>
            Save plan
          </button>
        ) : null}
        <AppLink className="text-link" to="/vancouver/missions">
          View saved plans <ArrowRightIcon />
        </AppLink>
      </div>
    </article>
  );
}

export function TrustCard() {
  return (
    <article className="trust-card">
      <ShieldIcon />
      <strong>Clear public publishing rules</strong>
      <p>
        CityAtlas keeps official source pages, guide pages, and business requests clearly
        separated so readers can tell what is confirmed now and what still needs review.
      </p>
    </article>
  );
}

export function BusinessMiniRow({ business }: { business: Business }) {
  return (
    <div className="mini-row">
      <StoreIcon />
      <div>
        <strong>{business.name}</strong>
        <small>{business.category} - {business.neighborhood}</small>
      </div>
      <span>{business.partnerFitScore}</span>
    </div>
  );
}
