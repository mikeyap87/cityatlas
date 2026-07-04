import type { Business, CityAtlasData, CityMission, EventItem, Guide, Offer, SavedItem } from "../types";
import { getGuidePath } from "../lib/cityPaths";
import { formatDate } from "../lib/format";
import {
  getMissionAnchorPath,
  getMissionFitLabel,
  getMissionFitNote,
  getMissionFitTone,
  getMissionForGuide,
  getMissionHubPath,
  getTravelModeLabel,
  isGuideRouteChooser,
  type MissionBehaviorInsight,
} from "../lib/missions";
import { getSourceBackedCollectionForGuide, sourceBackedCollectionMeta } from "../lib/sourceBackedCollections";
import {
  simplifyBusinessDisplayText,
  simplifyGuideCategoryLabel,
  simplifyGuideDisplayText,
  simplifyMissionDisplayText,
  simplifyPublicSurfaceText,
} from "../lib/publicCopy";
import { isOfferBusinessPreviewContext } from "../lib/offers";
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

export interface GuideSurfaceState {
  linkedMission?: CityMission;
  linkedMissionPath: null | string;
  routeChooser: boolean;
  routePreviewTags: string[];
  secondaryAction: null | {
    label: string;
    path: string;
  };
  stateLabel: string;
  stateTone: "blue" | "green" | "muted";
}

export function getGuideSurfaceState(guide: Guide, data?: CityAtlasData): GuideSurfaceState {
  const linkedMission = data ? getMissionForGuide(data, guide) : undefined;
  const routeChooser = isGuideRouteChooser(guide);
  const linkedMissionPath = linkedMission
    ? getMissionAnchorPath(linkedMission, guide.citySlug ?? "vancouver")
    : null;
  const sourceBackedCollection = getSourceBackedCollectionForGuide(guide);
  const sourceBackedMeta = sourceBackedCollection
    ? sourceBackedCollectionMeta[sourceBackedCollection]
    : null;
  const routePreviewTags = linkedMission
    ? [
        linkedMission.timeBox,
        `${linkedMission.steps.length} stop${linkedMission.steps.length === 1 ? "" : "s"}`,
        `${getTravelModeLabel(linkedMission.defaultTravelMode)} pace`,
      ]
    : [];
  const stateLabel = linkedMission
    ? routeChooser
      ? "Example route map"
      : "Route map ready"
    : sourceBackedMeta
      ? "Guide + local places"
      : routeChooser
        ? "Chooser guide"
        : "Editorial guide";
  const stateTone = linkedMission ? "blue" : sourceBackedMeta ? "green" : "muted";
  const secondaryAction = linkedMissionPath
    ? {
        label: routeChooser ? "Open example route map" : "Open route map",
        path: linkedMissionPath,
      }
    : sourceBackedMeta
      ? {
          label: "See local places",
          path: sourceBackedMeta.path,
        }
      : null;

  return {
    linkedMission,
    linkedMissionPath,
    routeChooser,
    routePreviewTags,
    secondaryAction,
    stateLabel,
    stateTone,
  };
}

export function BusinessCard({ business }: { business: Business }) {
  const exampleOnly = isExampleBusiness(business);
  const pageLabel = exampleOnly ? "Sample page" : "Official link page";
  const toplineDetail = business.priceTier ?? (exampleOnly ? "Example details" : "Checked against official site");

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
        <p>{simplifyBusinessDisplayText(business.shortDescription)}</p>
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
      <img
        src={getEventVisual(event)}
        alt={`Supporting image for ${event.title}`}
        decoding="async"
        loading="lazy"
      />
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
  const previewContext = isOfferBusinessPreviewContext(offer, business);
  const mediaTitle = business?.name ?? "CityAtlas offer example";
  const mediaDetail = business
    ? previewContext
      ? "Shown on a sample page"
      : "Details still being confirmed"
    : "Example only";

  return (
    <article className="content-card offer-card">
      <div className="business-card-media offer-card-media">
        <img
          src={business ? getBusinessVisual(business) : "/assets/places-generated/granville-island-public-market-generated.jpg"}
          alt={business ? `${business.name} venue photo` : "Illustrated Vancouver offer example scene"}
          decoding="async"
          loading="lazy"
        />
        <div className="business-card-media-copy offer-card-media-copy">
          <span>{business?.neighborhood ?? "Vancouver"}</span>
          <strong>{mediaTitle}</strong>
          <p>{mediaDetail}</p>
        </div>
      </div>
      <div className="offer-card-inner">
        <div className="card-topline">
          <StatusPill tone="amber">Offer example</StatusPill>
          <span>{previewContext ? "Example only" : "Terms still need review"}</span>
        </div>
        <h3>{offer.title}</h3>
        <p>{simplifyPublicSurfaceText(offer.description)}</p>
        <div className="card-meta">
          <span>{business ? (previewContext ? `${business.name} sample` : business.name) : "Business to confirm"}</span>
          <span>Ends {formatDate(offer.endDate)}</span>
          <span>Illustrative cap {offer.maxClaims}</span>
        </div>
        <small>{simplifyPublicSurfaceText(offer.redemptionInstructions)}</small>
      </div>
    </article>
  );
}

export function GuideCard({
  guide,
  data,
}: {
  guide: Guide;
  data?: CityAtlasData;
}) {
  const guideTitle = simplifyGuideDisplayText(guide.title);
  const guideExcerpt = simplifyGuideDisplayText(guide.excerpt);
  const { routeChooser, routePreviewTags, secondaryAction, stateLabel, stateTone } =
    getGuideSurfaceState(guide, data);

  return (
    <article className="content-card guide-card">
      <img
        src={getGuideVisual(guide)}
        alt={`Supporting guide image for ${guideTitle}`}
        decoding="async"
        loading="lazy"
      />
      <div className="card-body">
        <div className="card-topline guide-card-topline">
          <StatusPill tone={stateTone}>{stateLabel}</StatusPill>
          <div className="card-icon-line">
            <MapIcon />
            <span>{guide.readMinutes} min read</span>
          </div>
        </div>
        <h3>{guideTitle}</h3>
        <p>{guideExcerpt}</p>
        {routePreviewTags.length > 0 ? (
          <div className="guide-card-route-preview">
            <small>{routeChooser ? "Example route map" : "Route map ready"}</small>
            <div className="guide-card-route-preview-tags">
              {routePreviewTags.map((tag) => (
                <span key={`${guide.id}-${tag}`}>{tag}</span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="card-meta">
          <span>{simplifyGuideCategoryLabel(guide.category)}</span>
          <span>{guide.neighborhood}</span>
          {guide.sponsored ? <span>Partner feature</span> : null}
        </div>
        <div className="guide-card-actions">
          <AppLink className="card-link" to={getGuidePath(guide)}>
            Read guide <ArrowRightIcon />
          </AppLink>
          {secondaryAction ? (
            <AppLink className="text-link guide-card-sub-link" to={secondaryAction.path}>
              {secondaryAction.label} <ArrowRightIcon />
            </AppLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function GuideCompactCard({
  guide,
  data,
  variant = "default",
}: {
  guide: Guide;
  data?: CityAtlasData;
  variant?: "default" | "tight";
}) {
  const guideTitle = simplifyGuideDisplayText(guide.title);
  const guideExcerpt = simplifyGuideDisplayText(guide.excerpt);
  const { routePreviewTags, secondaryAction, stateLabel, stateTone } = getGuideSurfaceState(
    guide,
    data,
  );
  const compactRouteTags = routePreviewTags.slice(0, 2);

  return (
    <article className={`compact-guide-card${variant === "tight" ? " tight" : ""}`}>
      <img
        src={getGuideVisual(guide)}
        alt={`Supporting guide image for ${guideTitle}`}
        decoding="async"
        loading="lazy"
      />
      <div className="compact-guide-card-body">
        <div className="compact-guide-card-topline">
          <StatusPill tone={stateTone}>{stateLabel}</StatusPill>
          <div className="card-icon-line">
            <MapIcon />
            <span>{guide.readMinutes} min read</span>
          </div>
        </div>
        {compactRouteTags.length > 0 ? (
          <div className="compact-guide-route-tags">
            {compactRouteTags.map((tag) => (
              <span key={`${guide.id}-${tag}`}>{tag}</span>
            ))}
          </div>
        ) : null}
        <strong>{guideTitle}</strong>
        <p>{guideExcerpt}</p>
        <div className="card-meta compact-guide-meta">
          <span>{simplifyGuideCategoryLabel(guide.category)}</span>
          <span>{guide.neighborhood}</span>
        </div>
        <div className="compact-guide-card-actions">
          <AppLink className="card-link" to={getGuidePath(guide)}>
            Read guide
          </AppLink>
          {secondaryAction ? (
            <AppLink className="text-link compact-guide-sub-link" to={secondaryAction.path}>
              {secondaryAction.label}
            </AppLink>
          ) : null}
        </div>
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
  insight,
  actionHref,
  actionLabel = "View saved plans",
  actionMode = "app",
}: {
  mission: CityMission;
  savedItems: SavedItem[];
  onSaveMission?: (mission: CityMission) => void;
  insight?: MissionBehaviorInsight;
  actionHref?: string;
  actionLabel?: string;
  actionMode?: "app" | "anchor";
}) {
  const progress = getMissionProgress(mission, savedItems);
  const resolvedActionHref = actionHref ?? getMissionHubPath(mission);

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
      <div className="mission-card-route-note">
        <small>{mission.startWindow}</small>
        <small>{getTravelModeLabel(mission.defaultTravelMode)} friendly</small>
      </div>
      {insight ? (
        <div className="mission-card-fit-note">
          <StatusPill tone={getMissionFitTone(insight)}>{getMissionFitLabel(insight)}</StatusPill>
          <small>{getMissionFitNote(mission, insight)}</small>
        </div>
      ) : null}
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
        {actionMode === "anchor" ? (
          <a className="text-link" href={resolvedActionHref}>
            {actionLabel} <ArrowRightIcon />
          </a>
        ) : (
          <AppLink className="text-link" to={resolvedActionHref}>
            {actionLabel} <ArrowRightIcon />
          </AppLink>
        )}
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
