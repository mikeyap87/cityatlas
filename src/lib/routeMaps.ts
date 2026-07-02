import type { Business, SourceBackedPlaceReference } from "../types";
import {
  getSourceBackedCollectionCityName,
  getSourceBackedCollectionRegionName,
  type SourceBackedCollectionId,
} from "./sourceBackedCollections.ts";

export type GoogleMapsTravelMode = "driving" | "walking" | "bicycling" | "transit";

export interface RouteMapStop {
  label: string;
  query: string;
  detail?: string;
}

export interface RoutePlanningEstimate {
  totalWindow: string;
  stopWindow: string;
  bestMode: string;
  pace: string;
  modeNote: string;
}

export interface RouteMapBuildOptions {
  travelMode?: GoogleMapsTravelMode;
  utmCampaign?: string;
}

export interface RouteStopMapBuildOptions {
  utmCampaign?: string;
}

const routePlanningEstimates: Partial<Record<SourceBackedCollectionId, RoutePlanningEstimate>> = {
  toronto_first_time_visitor_starters: {
    bestMode: "Walk + transit",
    modeNote: "Use transit between wider downtown jumps, then walk the tighter stops.",
    pace: "Classic first-visit sampler",
    stopWindow: "30-75 min per stop",
    totalWindow: "3-5 hr",
  },
  toronto_weekend_route_starters: {
    bestMode: "Transit + walk",
    modeNote: "Start with transit for the longer jump, then keep the last stretch walkable.",
    pace: "Half-day weekend route",
    stopWindow: "35-75 min per stop",
    totalWindow: "4-6 hr",
  },
  vancouver_date_night_starters: {
    bestMode: "Walk + short rides",
    modeNote: "Pick one dinner anchor and one nearby add-on; use the full map to compare areas.",
    pace: "Best as a two-stop night",
    stopWindow: "45-90 min per stop",
    totalWindow: "2.5-4 hr",
  },
  vancouver_false_creek_culture_starters: {
    bestMode: "Walk + ferry/transit",
    modeNote: "False Creek works best when you keep the water crossing intentional.",
    pace: "Culture-forward half day",
    stopWindow: "35-75 min per stop",
    totalWindow: "3-5 hr",
  },
  vancouver_first_evening_starters: {
    bestMode: "Walk + transit",
    modeNote: "Keep the first evening compact and switch modes only when it saves real time.",
    pace: "Easy first evening",
    stopWindow: "25-60 min per stop",
    totalWindow: "2-3.5 hr",
  },
  vancouver_first_time_visitor_starters: {
    bestMode: "Walk + transit",
    modeNote: "Use transit for the wider city jump, then slow down around the destination area.",
    pace: "Classic first-visit sampler",
    stopWindow: "30-75 min per stop",
    totalWindow: "3-5 hr",
  },
  vancouver_garden_day_starters: {
    bestMode: "Transit + walk",
    modeNote: "Garden days benefit from one early anchor and a quieter second stop.",
    pace: "Slow half-day route",
    stopWindow: "45-90 min per stop",
    totalWindow: "3-5 hr",
  },
  vancouver_kitsilano_scenic_starters: {
    bestMode: "Walk + bike",
    modeNote: "The route is strongest when you leave space for views, coffee, and weather.",
    pace: "Scenic west-side loop",
    stopWindow: "20-60 min per stop",
    totalWindow: "2-3.5 hr",
  },
  vancouver_out_of_town_guest_starters: {
    bestMode: "Transit + walk",
    modeNote: "Choose fewer stops when hosting; guests usually value clarity over range.",
    pace: "Guest-friendly half day",
    stopWindow: "35-75 min per stop",
    totalWindow: "3-5 hr",
  },
  vancouver_rainy_day_starters: {
    bestMode: "Transit + short walks",
    modeNote: "Keep outdoor gaps short and confirm indoor hours before you leave.",
    pace: "Weather-safe reset",
    stopWindow: "35-70 min per stop",
    totalWindow: "2.5-4 hr",
  },
  vancouver_returning_visitor_starters: {
    bestMode: "Walk + transit",
    modeNote: "Use the map to avoid repeating the same downtown loop.",
    pace: "Second-look discovery",
    stopWindow: "30-70 min per stop",
    totalWindow: "2.5-4 hr",
  },
  vancouver_sunday_starters: {
    bestMode: "Walk + transit",
    modeNote: "Leave extra buffer on Sundays because hours and brunch queues can shift the plan.",
    pace: "Low-effort Sunday",
    stopWindow: "30-70 min per stop",
    totalWindow: "2.5-4 hr",
  },
  vancouver_ubc_discovery_starters: {
    bestMode: "Transit + walk",
    modeNote: "Treat UBC as a destination zone; the transit leg matters more than the local walking.",
    pace: "Campus-side discovery",
    stopWindow: "35-90 min per stop",
    totalWindow: "3.5-5.5 hr",
  },
  vancouver_weekend_route_starters: {
    bestMode: "Transit + walk",
    modeNote: "Use the route as a half-day shape, then cut one stop if the city feels busy.",
    pace: "Half-day weekend route",
    stopWindow: "35-75 min per stop",
    totalWindow: "4-6 hr",
  },
  vancouver_wellness_reset_starters: {
    bestMode: "Walk + short rides",
    modeNote: "Keep the route gentle; this is a reset plan, not a checklist.",
    pace: "Low-pressure reset",
    stopWindow: "30-75 min per stop",
    totalWindow: "2-3.5 hr",
  },
  vancouver_west_side_daytime_starters: {
    bestMode: "Walk + bike",
    modeNote: "West-side daytime routes work best when you avoid backtracking across the city.",
    pace: "Daytime neighborhood route",
    stopWindow: "30-75 min per stop",
    totalWindow: "3-4.5 hr",
  },
};

function cleanQueryPart(value?: string) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function compactQuery(parts: Array<string | undefined>) {
  return parts.map(cleanQueryPart).filter(Boolean).join(", ");
}

function getUsableStops(stops: RouteMapStop[]) {
  return stops
    .map((stop) => ({
      ...stop,
      label: cleanQueryPart(stop.label),
      query: cleanQueryPart(stop.query),
      detail: cleanQueryPart(stop.detail),
    }))
    .filter((stop) => stop.label && stop.query);
}

export function buildGoogleMapsDirectionsUrl(
  stops: RouteMapStop[],
  options: RouteMapBuildOptions = {},
) {
  const usableStops = getUsableStops(stops);

  if (usableStops.length < 2) {
    return null;
  }

  const travelMode = options.travelMode ?? "walking";
  const origin = usableStops[0];
  const destination = usableStops[usableStops.length - 1];
  const waypoints = usableStops.slice(1, -1).slice(0, 20);
  const url = new URL("https://www.google.com/maps/dir/");

  url.searchParams.set("api", "1");
  url.searchParams.set("origin", origin.query);
  url.searchParams.set("destination", destination.query);
  url.searchParams.set("travelmode", travelMode);

  if (waypoints.length > 0) {
    url.searchParams.set("waypoints", waypoints.map((stop) => stop.query).join("|"));
  }

  url.searchParams.set("utm_source", "cityatlas");
  url.searchParams.set("utm_campaign", options.utmCampaign ?? "route_map");

  return url.toString();
}

export function buildGoogleMapsPlaceUrl(
  stop: RouteMapStop,
  options: RouteStopMapBuildOptions = {},
) {
  const query = cleanQueryPart(stop.query) || cleanQueryPart(stop.label);

  if (!query) {
    return null;
  }

  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", query);
  url.searchParams.set("utm_source", "cityatlas");
  url.searchParams.set("utm_campaign", options.utmCampaign ?? "route_stop");

  return url.toString();
}

export function buildGoogleMapsEmbedUrl(
  stops: RouteMapStop[],
  apiKey?: string,
  options: RouteMapBuildOptions = {},
) {
  const usableStops = getUsableStops(stops);
  const cleanApiKey = cleanQueryPart(apiKey);

  if (!cleanApiKey || usableStops.length < 2) {
    return null;
  }

  const travelMode = options.travelMode ?? "walking";
  const origin = usableStops[0];
  const destination = usableStops[usableStops.length - 1];
  const waypoints = usableStops.slice(1, -1).slice(0, 20);
  const url = new URL("https://www.google.com/maps/embed/v1/directions");

  url.searchParams.set("key", cleanApiKey);
  url.searchParams.set("origin", origin.query);
  url.searchParams.set("destination", destination.query);
  url.searchParams.set("mode", travelMode);

  if (waypoints.length > 0) {
    url.searchParams.set("waypoints", waypoints.map((stop) => stop.query).join("|"));
  }

  return url.toString();
}

export function getRoutePlanningEstimate(
  collection: SourceBackedCollectionId | null | undefined,
  stops: RouteMapStop[],
): RoutePlanningEstimate {
  if (collection && routePlanningEstimates[collection]) {
    return routePlanningEstimates[collection];
  }

  const stopCount = getUsableStops(stops).length;
  const likelyHours = stopCount >= 5 ? "3-5 hr" : stopCount >= 3 ? "2-4 hr" : "1-2 hr";

  return {
    bestMode: "Walk + transit",
    modeNote: "Use Google Maps for live travel time by mode before you leave.",
    pace: "Flexible route",
    stopWindow: "25-70 min per stop",
    totalWindow: likelyHours,
  };
}

export function getRouteStopCountLabel(stops: RouteMapStop[]) {
  const stopCount = getUsableStops(stops).length;
  return `${stopCount} ${stopCount === 1 ? "stop" : "stops"}`;
}

export function buildSourceBackedRouteMapStops(
  references: SourceBackedPlaceReference[],
  collection: SourceBackedCollectionId,
) {
  const cityName = getSourceBackedCollectionCityName(collection);
  const regionName = getSourceBackedCollectionRegionName(collection);

  return references.map((reference) => ({
    label: reference.name,
    detail: reference.neighborhood,
    query: compactQuery([reference.name, reference.neighborhood, cityName, regionName]),
  }));
}

export function buildBusinessRouteMapStops(businesses: Business[]) {
  return businesses.map((business) => ({
    label: business.name,
    detail: business.neighborhood,
    query: compactQuery([
      business.name,
      business.address,
      business.neighborhood,
      business.city,
    ]),
  }));
}

export function hasRouteMapStops(stops: RouteMapStop[]) {
  return getUsableStops(stops).length >= 2;
}
