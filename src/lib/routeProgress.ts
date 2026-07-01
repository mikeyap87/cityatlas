import type { RouteMapStop } from "./routeMaps";

const STORAGE_KEY = "cityatlas.route.progress.v1";
const STORAGE_SCHEMA_VERSION = 1;

export const routeSkipReasons = [
  { id: "too_far", label: "Too far" },
  { id: "closed", label: "Closed" },
  { id: "not_the_vibe", label: "Not the vibe" },
  { id: "too_expensive", label: "Too expensive" },
  { id: "already_been", label: "Already been" },
] as const;

export type RouteSkipReason = (typeof routeSkipReasons)[number]["id"];
export type RouteStopStatus = "visited" | "skipped";

export interface RouteStopProgress {
  label?: string;
  reason?: RouteSkipReason;
  status?: RouteStopStatus;
  updatedAt?: string;
}

export interface RouteProgress {
  routeKey: string;
  saved: boolean;
  stops: Record<string, RouteStopProgress>;
  updatedAt: string;
}

interface RouteProgressStore {
  routes: Record<string, RouteProgress>;
  schemaVersion: number;
}

function getStorage() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readStore(): RouteProgressStore {
  const storage = getStorage();
  if (!storage) {
    return { routes: {}, schemaVersion: STORAGE_SCHEMA_VERSION };
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { routes: {}, schemaVersion: STORAGE_SCHEMA_VERSION };
    }

    const parsed = JSON.parse(raw) as Partial<RouteProgressStore>;
    return {
      routes: parsed.routes ?? {},
      schemaVersion: STORAGE_SCHEMA_VERSION,
    };
  } catch {
    return { routes: {}, schemaVersion: STORAGE_SCHEMA_VERSION };
  }
}

function writeStore(store: RouteProgressStore) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Keep the route UI usable when local storage is unavailable.
  }
}

function cleanPart(value?: string) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function slugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function buildRouteStopKey(stop: RouteMapStop, index: number) {
  const seed = cleanPart(stop.query) || cleanPart(stop.label) || `stop-${index + 1}`;
  return `${index + 1}-${slugPart(seed) || `stop-${index + 1}`}`;
}

export function buildRouteProgressKey({
  campaign,
  id,
  stops,
  title,
}: {
  campaign?: string;
  id?: string;
  stops: RouteMapStop[];
  title: string;
}) {
  const stopSeed = stops
    .map((stop) => cleanPart(stop.query) || cleanPart(stop.label))
    .filter(Boolean)
    .join("|");
  const seed = [id, campaign, title, stopSeed].map(cleanPart).filter(Boolean).join("|");

  return `route:${slugPart(seed) || "cityatlas-route"}`;
}

export function createEmptyRouteProgress(routeKey: string): RouteProgress {
  return {
    routeKey,
    saved: false,
    stops: {},
    updatedAt: new Date(0).toISOString(),
  };
}

export function loadRouteProgress(routeKey: string): RouteProgress {
  const stored = readStore().routes[routeKey];
  return stored
    ? {
        routeKey,
        saved: Boolean(stored.saved),
        stops: stored.stops ?? {},
        updatedAt: stored.updatedAt ?? new Date(0).toISOString(),
      }
    : createEmptyRouteProgress(routeKey);
}

export function persistRouteProgress(progress: RouteProgress) {
  const store = readStore();
  const nextProgress: RouteProgress = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };

  store.routes[progress.routeKey] = nextProgress;
  writeStore(store);

  return nextProgress;
}
