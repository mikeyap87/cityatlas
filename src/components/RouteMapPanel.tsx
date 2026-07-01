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
    <section className={`route-map-panel${compact ? " route-map-panel-compact" : ""}`}>
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
