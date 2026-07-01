import { useEffect, useMemo, useState } from "react";
import { AppLink } from "./Link";
import { ArrowRightIcon, CheckIcon, CloseIcon, MapIcon } from "./Icons";
import type { GoogleMapsTravelMode, RouteMapStop } from "../lib/routeMaps";
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
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

interface RouteStopTrackerProps {
  onSetReason: (stopKey: string, reason: RouteSkipReason) => void;
  onSetStatus: (stopKey: string, status: RouteStopStatus) => void;
  planningStopWindow: string;
  progress: RouteProgress;
  stops: RouteMapStop[];
}

function RouteStopTracker({
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
  const mapsUrl = buildGoogleMapsDirectionsUrl(stops, {
    travelMode,
    utmCampaign: campaign,
  });
  const embedUrl = buildGoogleMapsEmbedUrl(
    stops,
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY,
    { travelMode, utmCampaign: campaign },
  );
  const visibleStops = stops.slice(0, 6);
  const stopCountLabel = getRouteStopCountLabel(stops);
  const routeKey = useMemo(
    () => buildRouteProgressKey({ campaign, id, stops, title }),
    [campaign, id, stops, title],
  );
  const [progress, setProgress] = useState(() => loadRouteProgress(routeKey));

  useEffect(() => {
    setProgress(loadRouteProgress(routeKey));
  }, [routeKey]);

  if (!hasRouteMapStops(stops) || !mapsUrl) {
    return null;
  }

  const visibleStopKeys = visibleStops.map((stop, index) => buildRouteStopKey(stop, index));
  const markedStopCount = visibleStopKeys.filter((stopKey) => progress.stops[stopKey]?.status).length;
  const skippedStopCount = visibleStopKeys.filter(
    (stopKey) => progress.stops[stopKey]?.status === "skipped",
  ).length;
  const progressLabel = `${markedStopCount} of ${visibleStops.length} stops marked`;

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

  return (
    <section className={`route-map-panel${compact ? " route-map-panel-compact" : ""}`} id={id}>
      <div className="route-map-copy">
        <span className="route-map-kicker">
          <MapIcon /> {travelModeLabel[travelMode]}
        </span>
        <h2>{title}</h2>
        <p>{copy}</p>
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
            <span>Route shape</span>
            <strong>{stopCountLabel}</strong>
          </div>
        </div>
        <a className="button primary route-map-action" href={mapsUrl} rel="noreferrer" target="_blank">
          Open route in Google Maps <ArrowRightIcon />
        </a>
        <p className="route-map-mode-note">{planning.modeNote}</p>
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
