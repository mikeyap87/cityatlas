import { AppLink } from "./Link";
import { ArrowRightIcon, MapIcon } from "./Icons";
import type { GoogleMapsTravelMode, RouteMapStop } from "../lib/routeMaps";
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  hasRouteMapStops,
} from "../lib/routeMaps";

interface RouteMapPanelProps {
  title: string;
  copy: string;
  stops: RouteMapStop[];
  travelMode?: GoogleMapsTravelMode;
  campaign?: string;
  compact?: boolean;
  id?: string;
}

interface RouteMapOption {
  label: string;
  description: string;
  routePath: string;
  stops: RouteMapStop[];
  campaign: string;
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

export function RouteMapPanel({
  title,
  copy,
  stops,
  travelMode = "walking",
  campaign = "route_map",
  compact = false,
  id,
}: RouteMapPanelProps) {
  if (!hasRouteMapStops(stops)) {
    return null;
  }

  const mapsUrl = buildGoogleMapsDirectionsUrl(stops, {
    travelMode,
    utmCampaign: campaign,
  });
  const embedUrl = buildGoogleMapsEmbedUrl(
    stops,
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY,
    { travelMode, utmCampaign: campaign },
  );

  if (!mapsUrl) {
    return null;
  }

  const visibleStops = stops.slice(0, 6);

  return (
    <section className={`route-map-panel${compact ? " route-map-panel-compact" : ""}`} id={id}>
      <div className="route-map-copy">
        <span className="route-map-kicker">
          <MapIcon /> {travelModeLabel[travelMode]}
        </span>
        <h2>{title}</h2>
        <p>{copy}</p>
        <a className="button primary route-map-action" href={mapsUrl} rel="noreferrer" target="_blank">
          Open in Google Maps <ArrowRightIcon />
        </a>
      </div>

      <div className="route-map-preview">
        {embedUrl ? (
          <iframe
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={embedUrl}
            title={`${title} map`}
          />
        ) : (
          <div className="route-map-static" aria-label="Suggested stop order">
            <ol className="route-map-stop-list">
              {visibleStops.map((stop, index) => (
                <li key={`${stop.label}-${index}`}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{stop.label}</strong>
                    {stop.detail ? <small>{stop.detail}</small> : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        <p className="route-map-note">
          Google Maps may adjust the path. Check hours, bookings, weather, and access before you go.
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
            </div>
            <div className="route-map-option-actions">
              <a href={option.mapsUrl ?? "#"} rel="noreferrer" target="_blank">
                Open in Google Maps <ArrowRightIcon />
              </a>
              <AppLink to={option.routePath}>Read route</AppLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
