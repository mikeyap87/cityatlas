import { useEffect, useMemo, useState } from "react";
import { AppLink } from "./Link";
import { ArrowRightIcon, CalendarIcon, CheckIcon, CloseIcon, MapIcon, StoreIcon } from "./Icons";
import type { GoogleMapsTravelMode, RouteMapStop } from "../lib/routeMaps";
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsPlaceUrl,
  getRoutePlanningEstimate,
  getRouteStopCountLabel,
  hasRouteMapStops,
} from "../lib/routeMaps";
import type { RouteProgress, RouteSkipReason, RouteStopStatus } from "../lib/routeProgress";
import {
  buildRouteProgressKey,
  buildRouteStopKey,
  loadRouteProgress,
  persistRouteProgress,
  routeSkipReasons,
} from "../lib/routeProgress";
import type { SourceBackedCollectionId } from "../lib/sourceBackedCollections";

interface RouteMapPanelProps {
  title: string;
  copy: string;
  stops: RouteMapStop[];
  travelMode?: GoogleMapsTravelMode;
  campaign?: string;
  compact?: boolean;
  id?: string;
  collection?: SourceBackedCollectionId | null;
}

interface RouteMapOption {
  label: string;
  description: string;
  routePath: string;
  stops: RouteMapStop[];
  campaign: string;
  collection?: SourceBackedCollectionId | null;
}

interface RouteMapOptionsPanelProps {
  title: string;
  copy: string;
  options: RouteMapOption[];
  travelMode?: GoogleMapsTravelMode;
  id?: string;
}

const travelModeLabel: Record<GoogleMapsTravelMode, string> = {
  bicycling: "Bike route",
  driving: "Drive route",
  transit: "Transit route",
  walking: "Walkable route",
};

const routePlanOptions = [
  {
    description: "A tighter plan for one or two strong choices.",
    id: "quick",
    intervalMinutes: 40,
    label: "2 hours",
    maxStops: 3,
    summary: "Short plan",
  },
  {
    description: "The best default when the day can hold a few stops.",
    id: "half_day",
    intervalMinutes: 55,
    label: "Half day",
    maxStops: 4,
    summary: "Balanced route",
  },
  {
    description: "Fewer decisions, wider buffers, and less rushing.",
    id: "easy",
    intervalMinutes: 70,
    label: "Easy pace",
    maxStops: 3,
    summary: "Low-pressure route",
  },
] as const;

type RoutePlanId = (typeof routePlanOptions)[number]["id"];
type ShareState = "idle" | "copied" | "manual";

const travelModeOptions: Array<{ id: GoogleMapsTravelMode; label: string }> = [
  { id: "walking", label: "Walk" },
  { id: "transit", label: "Transit" },
  { id: "driving", label: "Drive" },
  { id: "bicycling", label: "Bike" },
];

function isRoutePlanId(value: string | null): value is RoutePlanId {
  return routePlanOptions.some((option) => option.id === value);
}

function isTravelMode(value: string | null): value is GoogleMapsTravelMode {
  return value === "walking" || value === "transit" || value === "driving" || value === "bicycling";
}

function getInitialRoutePlanId() {
  if (typeof window === "undefined") {
    return "half_day";
  }

  const param = new URLSearchParams(window.location.search).get("routePlan");
  return isRoutePlanId(param) ? param : "half_day";
}

function getInitialTravelMode(fallback: GoogleMapsTravelMode) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const param = new URLSearchParams(window.location.search).get("routeMode");
  return isTravelMode(param) ? param : fallback;
}

function formatItineraryOffset(index: number, intervalMinutes: number) {
  if (index === 0) {
    return "Start";
  }

  const minutes = index * intervalMinutes;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `+${minutes} min`;
  }

  return remainingMinutes > 0 ? `+${hours} hr ${remainingMinutes} min` : `+${hours} hr`;
}

function buildRouteShareUrl({
  anchorId,
  planId,
  travelMode,
}: {
  anchorId?: string;
  planId: RoutePlanId;
  travelMode: GoogleMapsTravelMode;
}) {
  if (typeof window === "undefined") {
    return "";
  }

  const url = new URL(window.location.href);
  url.searchParams.set("routePlan", planId);
  url.searchParams.set("routeMode", travelMode);
  url.hash = anchorId ?? "route-map";
  return url.toString();
}

async function copyTextToClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.left = "-9999px";
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

interface RouteStopTrackerProps {
  mapStopCampaign: string;
  onSetReason: (stopKey: string, reason: RouteSkipReason) => void;
  onSetStatus: (stopKey: string, status: RouteStopStatus) => void;
  planningStopWindow: string;
  progress: RouteProgress;
  stops: RouteMapStop[];
}

function RouteStopTracker({
  mapStopCampaign,
  onSetReason,
  onSetStatus,
  planningStopWindow,
  progress,
  stops,
}: RouteStopTrackerProps) {
  return (
    <ol className="route-map-stop-list route-map-stop-tracker">
      {stops.map((stop, index) => {
        const stopKey = buildRouteStopKey(stop, index);
        const stopState = progress.stops[stopKey];
        const status = stopState?.status;
        const alternateStops = stops
          .filter((candidate, candidateIndex) => {
            if (candidateIndex === index) return false;
            const candidateKey = buildRouteStopKey(candidate, candidateIndex);
            return progress.stops[candidateKey]?.status !== "skipped";
          })
          .slice(0, 3);

        return (
          <li className={status ? `is-${status}` : ""} key={stopKey}>
            <span>{index + 1}</span>
            <div className="route-map-stop-body">
              <div className="route-map-stop-heading">
                <strong>{stop.label}</strong>
                <small>
                  {stop.detail ? `${stop.detail} · ` : ""}{planningStopWindow}
                </small>
              </div>
              <div className="route-map-stop-actions" aria-label={`${stop.label} route progress`}>
                <button
                  aria-pressed={status === "visited"}
                  className={`route-map-stop-action${status === "visited" ? " active" : ""}`}
                  onClick={() => onSetStatus(stopKey, "visited")}
                  type="button"
                >
                  <CheckIcon /> Visited
                </button>
                <button
                  aria-pressed={status === "skipped"}
                  className={`route-map-stop-action${status === "skipped" ? " active" : ""}`}
                  onClick={() => onSetStatus(stopKey, "skipped")}
                  type="button"
                >
                  <CloseIcon /> Skip
                </button>
              </div>
              {status === "skipped" ? (
                <div className="route-map-skip-reasons" aria-label={`Reason for skipping ${stop.label}`}>
                  {routeSkipReasons.map((reason) => (
                    <button
                      aria-pressed={stopState?.reason === reason.id}
                      className={stopState?.reason === reason.id ? "active" : ""}
                      key={reason.id}
                      onClick={() => onSetReason(stopKey, reason.id)}
                      type="button"
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {status === "skipped" && alternateStops.length > 0 ? (
                <div className="route-map-alternates" aria-label={`Alternatives for ${stop.label}`}>
                  <span>Try instead</span>
                  <div>
                    {alternateStops.map((alternate) => {
                      const alternateUrl = buildGoogleMapsPlaceUrl(alternate, {
                        utmCampaign: `${mapStopCampaign}_alternate_stop`,
                      });

                      return alternateUrl ? (
                        <a href={alternateUrl} key={alternate.query} rel="noreferrer" target="_blank">
                          {alternate.label}
                        </a>
                      ) : null;
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function RouteMapPanel({
  title,
  copy,
  stops,
  travelMode = "walking",
  campaign = "route_map",
  compact = false,
  id,
  collection,
}: RouteMapPanelProps) {
  const planning = getRoutePlanningEstimate(collection, stops);
  const visibleStops = stops.slice(0, 6);
  const routeKey = useMemo(
    () => buildRouteProgressKey({ campaign, id, stops, title }),
    [campaign, id, stops, title],
  );
  const [progress, setProgress] = useState(() => loadRouteProgress(routeKey));
  const [selectedPlanId, setSelectedPlanId] = useState<RoutePlanId>(() => getInitialRoutePlanId());
  const [selectedTravelMode, setSelectedTravelMode] = useState<GoogleMapsTravelMode>(
    () => getInitialTravelMode(travelMode),
  );
  const [shareState, setShareState] = useState<ShareState>("idle");
  const [manualShareUrl, setManualShareUrl] = useState("");

  useEffect(() => {
    setProgress(loadRouteProgress(routeKey));
  }, [routeKey]);

  useEffect(() => {
    setSelectedTravelMode((currentMode) => currentMode || travelMode);
  }, [travelMode]);

  useEffect(() => {
    if (shareState === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => setShareState("idle"), 2_800);
    return () => window.clearTimeout(timeout);
  }, [shareState]);

  if (!hasRouteMapStops(stops)) {
    return null;
  }

  const selectedPlan =
    routePlanOptions.find((option) => option.id === selectedPlanId) ?? routePlanOptions[1];
  const plannedStops = visibleStops.slice(0, Math.min(selectedPlan.maxStops, visibleStops.length));
  const visibleStopKeys = visibleStops.map((stop, index) => buildRouteStopKey(stop, index));
  const plannedStopsForMaps = plannedStops.filter((stop, index) => {
    const stopKey = buildRouteStopKey(stop, index);
    return progress.stops[stopKey]?.status !== "skipped";
  });
  const routeStopsForMaps = plannedStopsForMaps.length >= 2 ? plannedStopsForMaps : plannedStops;
  const mapsUrl = buildGoogleMapsDirectionsUrl(routeStopsForMaps, {
    travelMode: selectedTravelMode,
    utmCampaign: campaign,
  });
  const embedUrl = buildGoogleMapsEmbedUrl(
    routeStopsForMaps,
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY,
    { travelMode: selectedTravelMode, utmCampaign: campaign },
  );
  const stopCountLabel = getRouteStopCountLabel(routeStopsForMaps);
  const markedStopCount = visibleStopKeys.filter((stopKey) => progress.stops[stopKey]?.status).length;
  const skippedStopCount = visibleStopKeys.filter(
    (stopKey) => progress.stops[stopKey]?.status === "skipped",
  ).length;
  const progressLabel = `${markedStopCount} of ${visibleStops.length} stops marked`;
  const skippedStopsAreExcluded = skippedStopCount > 0 && plannedStopsForMaps.length >= 2;
  const routeShareLabel =
    shareState === "copied"
      ? "Route link copied"
      : shareState === "manual"
        ? "Copy manually"
        : "Copy route link";

  function updateProgress(updater: (current: RouteProgress) => RouteProgress) {
    setProgress((current) => {
      const base = current.routeKey === routeKey ? current : loadRouteProgress(routeKey);
      return persistRouteProgress(updater(base));
    });
  }

  function toggleSaved() {
    updateProgress((current) => ({
      ...current,
      saved: !current.saved,
    }));
  }

  function setStopStatus(stopKey: string, status: RouteStopStatus) {
    updateProgress((current) => {
      const currentStop = current.stops[stopKey];

      if (currentStop?.status === status) {
        const { [stopKey]: _removed, ...remainingStops } = current.stops;
        return {
          ...current,
          stops: remainingStops,
        };
      }

      return {
        ...current,
        stops: {
          ...current.stops,
          [stopKey]: {
            ...currentStop,
            reason: status === "visited" ? undefined : currentStop?.reason,
            status,
          },
        },
      };
    });
  }

  function setSkipReason(stopKey: string, reason: RouteSkipReason) {
    updateProgress((current) => ({
      ...current,
      stops: {
        ...current.stops,
        [stopKey]: {
          ...current.stops[stopKey],
          reason,
          status: "skipped",
        },
      },
    }));
  }

  async function copyShareLink() {
    const shareUrl = buildRouteShareUrl({
      anchorId: id,
      planId: selectedPlanId,
      travelMode: selectedTravelMode,
    });

    if (!shareUrl) {
      setManualShareUrl("");
      setShareState("manual");
      return;
    }

    try {
      const copied = await copyTextToClipboard(shareUrl);
      setManualShareUrl(copied ? "" : shareUrl);
      setShareState(copied ? "copied" : "manual");
    } catch {
      setManualShareUrl(shareUrl);
      setShareState("manual");
    }
  }

  if (!mapsUrl) {
    return null;
  }

  return (
    <section className={`route-map-panel${compact ? " route-map-panel-compact" : ""}`} id={id}>
      <div className="route-map-copy">
        <span className="route-map-kicker">
          <MapIcon /> {travelModeLabel[selectedTravelMode]}
        </span>
        <h2>{title}</h2>
        <p>{copy}</p>
        <div className="route-map-planner-controls" data-testid="route-planner-controls">
          <div>
            <span>Plan length</span>
            <div className="route-map-segmented-control" aria-label="Choose route plan length">
              {routePlanOptions.map((option) => (
                <button
                  aria-pressed={selectedPlanId === option.id}
                  className={selectedPlanId === option.id ? "active" : ""}
                  key={option.id}
                  onClick={() => setSelectedPlanId(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span>Travel mode</span>
            <div className="route-map-segmented-control" aria-label="Choose travel mode">
              {travelModeOptions.map((option) => (
                <button
                  aria-pressed={selectedTravelMode === option.id}
                  className={selectedTravelMode === option.id ? "active" : ""}
                  key={option.id}
                  onClick={() => setSelectedTravelMode(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="route-map-glance" aria-label="Route planning details">
          <div>
            <span>Plan window</span>
            <strong>{planning.totalWindow}</strong>
          </div>
          <div>
            <span>Typical stop</span>
            <strong>{planning.stopWindow}</strong>
          </div>
          <div>
            <span>Best mode</span>
            <strong>{planning.bestMode}</strong>
          </div>
          <div>
            <span>Selected route</span>
            <strong>{stopCountLabel}</strong>
          </div>
        </div>
        <div className="route-map-mini-itinerary" data-testid="route-mini-itinerary">
          <div className="route-map-mini-itinerary-heading">
            <CalendarIcon />
            <div>
              <span>Mini itinerary</span>
              <strong>{selectedPlan.summary}</strong>
            </div>
          </div>
          <ol>
            {routeStopsForMaps.map((stop, index) => (
              <li key={`${stop.query}-${index}`}>
                <span>{formatItineraryOffset(index, selectedPlan.intervalMinutes)}</span>
                <strong>{stop.label}</strong>
                <small>{index === 0 ? selectedPlan.description : planning.stopWindow}</small>
              </li>
            ))}
          </ol>
        </div>
        <div className="route-map-primary-actions">
          <a className="button primary route-map-action" href={mapsUrl} rel="noreferrer" target="_blank">
            Open route in Google Maps <ArrowRightIcon />
          </a>
          <button className="button secondary route-map-share-action" onClick={copyShareLink} type="button">
            <CheckIcon /> {routeShareLabel}
          </button>
        </div>
        {shareState === "manual" && manualShareUrl ? (
          <label className="route-map-share-fallback">
            <span>Route link</span>
            <input readOnly value={manualShareUrl} onFocus={(event) => event.currentTarget.select()} />
          </label>
        ) : null}
        <p className="route-map-mode-note">
          {skippedStopsAreExcluded
            ? "Your Google Maps link now skips the stops you marked as skipped."
            : planning.modeNote}
        </p>
        <div className="route-map-progress-row" aria-label="Saved route progress">
          <div>
            <span>Progress</span>
            <strong>{progressLabel}</strong>
            {skippedStopCount > 0 ? <small>{skippedStopCount} skipped</small> : null}
          </div>
          <button
            aria-pressed={progress.saved}
            className={`route-map-save-action${progress.saved ? " active" : ""}`}
            onClick={toggleSaved}
            type="button"
          >
            <CheckIcon /> {progress.saved ? "Saved" : "Save route"}
          </button>
        </div>
        <div className="route-map-business-cta" data-testid="route-business-cta">
          <StoreIcon />
          <div>
            <strong>Want your business reviewed for this route?</strong>
            <p>Request a fit review for this route. CityAtlas reviews placement before anything goes public.</p>
            <AppLink to={`/for-businesses/submit?route=${encodeURIComponent(title)}`}>
              Request route review <ArrowRightIcon />
            </AppLink>
          </div>
        </div>
      </div>

      <div className="route-map-preview">
        {embedUrl ? (
          <iframe
            allowFullScreen
            data-route-map-embed="google"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={embedUrl}
            title={`${title} map`}
          />
        ) : (
          <div className="route-map-static" aria-label="Suggested stop order and progress">
            <RouteStopTracker
              mapStopCampaign={campaign}
              onSetReason={setSkipReason}
              onSetStatus={setStopStatus}
              planningStopWindow={planning.stopWindow}
              progress={progress}
              stops={visibleStops}
            />
          </div>
        )}
        {embedUrl ? (
          <div className="route-map-stop-sheet" aria-label="Suggested stop order and progress">
            <RouteStopTracker
              mapStopCampaign={campaign}
              onSetReason={setSkipReason}
              onSetStatus={setStopStatus}
              planningStopWindow={planning.stopWindow}
              progress={progress}
              stops={visibleStops}
            />
          </div>
        ) : null}
        <p className="route-map-note">
          {planning.pace}. Google Maps may adjust the path. Check hours, bookings, weather, and access before you go.
        </p>
      </div>
    </section>
  );
}

export function RouteMapOptionsPanel({
  title,
  copy,
  options,
  travelMode = "walking",
  id,
}: RouteMapOptionsPanelProps) {
  const visibleOptions = options
    .map((option) => ({
      ...option,
      planning: getRoutePlanningEstimate(option.collection, option.stops),
      stopCountLabel: getRouteStopCountLabel(option.stops),
      mapsUrl: buildGoogleMapsDirectionsUrl(option.stops, {
        travelMode,
        utmCampaign: option.campaign,
      }),
    }))
    .filter((option) => option.mapsUrl)
    .slice(0, 6);

  if (visibleOptions.length === 0) {
    return null;
  }

  return (
    <section className="route-map-options-panel" id={id}>
      <div className="route-map-options-heading">
        <span className="route-map-kicker">
          <MapIcon /> Mapped route options
        </span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>

      <div className="route-map-option-grid">
        {visibleOptions.map((option) => (
          <article className="route-map-option-card" key={option.routePath}>
            <div>
              <strong>{option.label}</strong>
              <p>{option.description}</p>
              <div className="route-map-option-meta" aria-label={`${option.label} planning details`}>
                <span>{option.stopCountLabel}</span>
                <span>{option.planning.totalWindow}</span>
                <span>{option.planning.bestMode}</span>
              </div>
            </div>
            <div className="route-map-option-actions">
              <a href={option.mapsUrl ?? "#"} rel="noreferrer" target="_blank">
                Open route in Google Maps <ArrowRightIcon />
              </a>
              <AppLink to={option.routePath}>Read route</AppLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
