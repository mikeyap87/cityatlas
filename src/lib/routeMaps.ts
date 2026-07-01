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

export interface RouteMapBuildOptions {
  travelMode?: GoogleMapsTravelMode;
  utmCampaign?: string;
}

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
