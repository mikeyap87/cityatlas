import type { Business, CityMission, EventItem, Guide, Offer, SavedItem } from "../types";
import { getGuidePath } from "../lib/cityPaths";
import { formatDate } from "../lib/format";
import {
  simplifyGuideCategoryLabel,
  simplifyGuideDisplayText,
  simplifyMissionDisplayText,
} from "../lib/publicCopy";
import { getBusinessVisual, getEventVisual, getGuideVisual } from "../lib/visuals";
import { ArrowRightIcon, CalendarIcon, MapIcon, ShieldIcon, SparkIcon, StoreIcon } from "./Icons";
import { AppLink } from "./Link";
import { StatusPill } from "./UI";

function getCitySlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function isExampleBusiness(business: Business) {
  return business.trustLevel === "fictional_seed";
}

function getBusinessStatusLabel(business: Business) {
  if (typeof business.openNow === "boolean") {
    return business.openNow ? "Open now" : "Closed now";
  }

  return "Check official hours";
}

export function BusinessCard({ business }: { business: Business }) {
  const exampleOnly = isExampleBusiness(business);
  const pageLabel = exampleOnly ? "Sample page" : "Source-backed page";
  const toplineDetail = business.priceTier ?? (exampleOnly ? "Preview only" : "Official source checked");

  return (
    <article className="content-card business-card">
      <div className="business-card-media">
        <img
          src={getBusinessVisual(business)}
          alt={`${business.name} venue photo`}
          decoding="async"
          loading="lazy"
        />
        <div className="business-card-media-copy">
          <span>{business.neighborhood}</span>
          <strong>{business.bestFor[0] ?? business.category}</strong>
        </div>
      </div>
      <div className="card-body">
        <div className="card-topline">
          <StatusPill tone={exampleOnly ? "blue" : "green"}>{pageLabel}</StatusPill>
          <span>{toplineDetail}</span>
        </div>
        <h3>{business.name}</h3>
        <p>{business.shortDescription}</p>
        <div className="card-meta">
          {business.bestFor.slice(0, 2).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="business-card-footer">
          <span>{business.category}</span>
          <span>{getBusinessStatusLabel(business)}</span>
        </div>
        <AppLink className="card-link" to={`/${getCitySlug(business.city)}/businesses/${business.slug}`}>
          Open page <ArrowRightIcon />
        </AppLink>
      </div>
    </article>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="content-card compact-card">
      <img src={getEventVisual(event)} alt={`${event.title} scene`} decoding="async" loading="lazy" />
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
          <span>{event.capacity} spots</span>
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
        <StatusPill tone="amber">Offer preview</StatusPill>
        <h3>{offer.title}</h3>
        <p>{offer.description}</p>
        <div className="card-meta">
          <span>{business?.name ?? "Business to confirm"}</span>
          <span>Ends {formatDate(offer.endDate)}</span>
        </div>
        <small>{offer.redemptionInstructions}</small>
      </div>
    </article>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  const guideTitle = simplifyGuideDisplayText(guide.title);
  const guideExcerpt = simplifyGuideDisplayText(guide.excerpt);

  return (
    <article className="content-card guide-card">
      <img src={getGuideVisual(guide)} alt={`${guideTitle} scene`} decoding="async" loading="lazy" />
      <div className="card-body">
        <div className="card-icon-line">
          <MapIcon />
          <span>{guide.readMinutes} min read</span>
        </div>
        <h3>{guideTitle}</h3>
        <p>{guideExcerpt}</p>
        <div className="card-meta">
          <span>{simplifyGuideCategoryLabel(guide.category)}</span>
          <span>{guide.neighborhood}</span>
          {guide.sponsored ? <span>Partner feature</span> : null}
        </div>
        <AppLink className="card-link" to={getGuidePath(guide)}>
          Read guide <ArrowRightIcon />
        </AppLink>
      </div>
    </article>
  );
}

export function GuideCompactCard({
  guide,
  variant = "default",
}: {
  guide: Guide;
  variant?: "default" | "tight";
}) {
  const guideTitle = simplifyGuideDisplayText(guide.title);
  const guideExcerpt = simplifyGuideDisplayText(guide.excerpt);

  return (
    <article className={`compact-guide-card${variant === "tight" ? " tight" : ""}`}>
      <img src={getGuideVisual(guide)} alt={`${guideTitle} scene`} decoding="async" loading="lazy" />
      <div className="compact-guide-card-body">
        <div className="card-icon-line">
          <MapIcon />
          <span>{guide.readMinutes} min read</span>
        </div>
        <strong>{guideTitle}</strong>
        <p>{guideExcerpt}</p>
        <div className="card-meta compact-guide-meta">
          <span>{simplifyGuideCategoryLabel(guide.category)}</span>
          <span>{guide.neighborhood}</span>
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
      <h3>{simplifyMissionDisplayText(mission.title)}</h3>
      <p>{simplifyMissionDisplayText(mission.hook)}</p>
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
            <span>{simplifyMissionDisplayText(step.label)}</span>
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
      <div className="card-topline">
        <strong>How CityAtlas checks a page</strong>
        <StatusPill tone="blue">Clear labels</StatusPill>
      </div>
      <p>
        CityAtlas labels guides, local places, and business requests so you can tell what links to
        official sources, what is saved locally, and what still needs more checking.
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
