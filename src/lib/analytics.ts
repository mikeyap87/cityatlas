export type AnalyticsConsentState = "pending" | "granted" | "denied";
export type AnalyticsDetail = Record<string, string | number | boolean>;

export interface TrackProductEventOptions {
  deliverOnNextPage?: boolean;
}

interface AnalyticsReadiness {
  provider: "ga4";
  hasExternalDestination: boolean;
  measurementIdConfigured: boolean;
}

interface AnalyticsState {
  appliedConsent: AnalyticsConsentState;
  configuredMeasurementId: string;
  defaultConsentSet: boolean;
  scriptInjected: boolean;
}

interface PendingNavigationAnalyticsEvent {
  name: string;
  detail: AnalyticsDetail;
}

interface TrafficContextState extends AnalyticsDetail {
  firstLandingPath: string;
  latestLandingPath: string;
  referrer: string;
}

declare global {
  interface Window {
    __cityatlasAnalyticsReadiness?: AnalyticsReadiness;
    __cityatlasAnalyticsState?: AnalyticsState;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    google_tag_manager?: Record<string, unknown>;
  }
}

const runtimeEnv = ((import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env ?? {}) as Record<string, string | undefined>;

const DEFAULT_GA_MEASUREMENT_ID = "G-43N3DKZYRL";
const ANALYTICS_SCRIPT_ID = "cityatlas-ga4-script";
const ANALYTICS_CONSENT_STORAGE_KEY = "cityatlas.analytics.consent.v1";
const ANALYTICS_DEBUG_STORAGE_KEY = "cityatlas.analytics.debug.v1";
const TRAFFIC_CONTEXT_STORAGE_KEY = "cityatlas.traffic.context.v1";
const PENDING_NAVIGATION_ANALYTICS_STORAGE_KEY = "cityatlas.analytics.pending-navigation.v1";

function canUseDom() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getMeasurementId() {
  return (
    runtimeEnv.VITE_GA_MEASUREMENT_ID?.trim() ||
    runtimeEnv.VITE_ANALYTICS_ID?.trim() ||
    DEFAULT_GA_MEASUREMENT_ID
  );
}

function getProvider() {
  const configuredProvider = runtimeEnv.VITE_CITYATLAS_ANALYTICS_PROVIDER?.trim();
  if (configuredProvider) {
    return configuredProvider;
  }

  return getMeasurementId() ? "ga4" : "";
}

function getStorage() {
  if (!canUseDom()) return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJson<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore local storage write failures so analytics never blocks the UI.
  }
}

function removeStorageItem(key: string) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage remove failures.
  }
}

function buildAnalyticsReadiness(): AnalyticsReadiness {
  return {
    provider: "ga4",
    hasExternalDestination: getProvider() === "ga4" && Boolean(getMeasurementId()),
    measurementIdConfigured: Boolean(getMeasurementId()),
  };
}

function setRuntimeReadiness(readiness: AnalyticsReadiness) {
  if (canUseDom()) {
    window.__cityatlasAnalyticsReadiness = readiness;
  }
  return readiness;
}

function readRuntimeState(): AnalyticsState {
  const current = canUseDom() ? window.__cityatlasAnalyticsState : undefined;
  return (
    current ?? {
      appliedConsent: getAnalyticsConsentState(),
      configuredMeasurementId: getMeasurementId(),
      defaultConsentSet: false,
      scriptInjected: false,
    }
  );
}

function writeRuntimeState(next: Partial<AnalyticsState>) {
  if (!canUseDom()) return;

  window.__cityatlasAnalyticsState = {
    ...readRuntimeState(),
    ...next,
  };
}

function ensureDataLayer() {
  if (!canUseDom()) return;

  window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(Array.from(args));
    };
  }
}

function pushAnalyticsTuple(...args: unknown[]) {
  if (!canUseDom()) return;
  ensureDataLayer();
  window.gtag?.(...args);
}

function injectAnalyticsScript() {
  if (!canUseDom()) return false;

  const measurementId = getMeasurementId();
  if (!measurementId) return false;

  let script = document.getElementById(ANALYTICS_SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = ANALYTICS_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  return true;
}

function readTrafficContextState() {
  return readJson<TrafficContextState>(TRAFFIC_CONTEXT_STORAGE_KEY);
}

function writeTrafficContextState(state: TrafficContextState) {
  writeJson(TRAFFIC_CONTEXT_STORAGE_KEY, state);
}

function getCurrentTrafficContext(): TrafficContextState {
  const existing = readTrafficContextState();
  if (!canUseDom()) {
    return (
      existing ?? {
        firstLandingPath: "/",
        latestLandingPath: "/",
        referrer: "direct",
      }
    );
  }

  const url = new URL(window.location.href);
  const next: TrafficContextState = {
    ...(existing ?? {
      firstLandingPath: url.pathname,
      latestLandingPath: url.pathname,
      referrer: document.referrer ? new URL(document.referrer, url.origin).pathname : "direct",
    }),
    latestLandingPath: `${url.pathname}${url.search}`,
  };

  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
  for (const key of utmKeys) {
    const value = url.searchParams.get(key);
    if (value) {
      next[key] = value;
    }
  }

  if (!next.firstLandingPath) {
    next.firstLandingPath = url.pathname;
  }

  if (!next.referrer) {
    next.referrer = document.referrer ? new URL(document.referrer, url.origin).pathname : "direct";
  }

  writeTrafficContextState(next);
  return next;
}

function appendDebugEvent(name: string, detail: AnalyticsDetail) {
  const entries = readJson<Array<{ name: string; detail: AnalyticsDetail; createdAt: string }>>(
    ANALYTICS_DEBUG_STORAGE_KEY,
  ) ?? [];

  entries.unshift({
    name,
    detail,
    createdAt: new Date().toISOString(),
  });
  writeJson(ANALYTICS_DEBUG_STORAGE_KEY, entries.slice(0, 40));
}

function writePendingNavigationEvent(event: PendingNavigationAnalyticsEvent) {
  writeJson(PENDING_NAVIGATION_ANALYTICS_STORAGE_KEY, event);
}

export function consumePendingNavigationEvent() {
  const event = readJson<PendingNavigationAnalyticsEvent>(PENDING_NAVIGATION_ANALYTICS_STORAGE_KEY);
  if (!event) return null;
  removeStorageItem(PENDING_NAVIGATION_ANALYTICS_STORAGE_KEY);
  return event;
}

function configureGrantedConsent(path?: string, includePageView = false) {
  if (!canUseDom()) return;

  const readiness = getAnalyticsReadiness();
  if (!readiness.hasExternalDestination) {
    writeRuntimeState({
      appliedConsent: "granted",
      configuredMeasurementId: getMeasurementId(),
    });
    return;
  }

  ensureDataLayer();
  const injected = injectAnalyticsScript();
  const measurementId = getMeasurementId();

  const state = readRuntimeState();
  if (!state.defaultConsentSet) {
    pushAnalyticsTuple("js", new Date());
    pushAnalyticsTuple("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
    });
  }

  pushAnalyticsTuple("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
  });
  pushAnalyticsTuple("config", measurementId, {
    anonymize_ip: true,
  });

  writeRuntimeState({
    appliedConsent: "granted",
    configuredMeasurementId: measurementId,
    defaultConsentSet: true,
    scriptInjected: injected,
  });

  if (includePageView) {
    const nextPath = path || (canUseDom() ? window.location.pathname : "/");
    trackProductEvent("page_view", nextPath, getTrafficContext());
  }
}

function restoreAnalyticsFromStoredConsent() {
  const consent = getAnalyticsConsentState();
  setRuntimeReadiness(buildAnalyticsReadiness());
  writeRuntimeState({
    appliedConsent: consent,
    configuredMeasurementId: getMeasurementId(),
  });

  if (consent === "granted") {
    configureGrantedConsent(canUseDom() ? window.location.pathname : "/", false);
  }
}

export function getAnalyticsReadiness() {
  return setRuntimeReadiness(buildAnalyticsReadiness());
}

export function getAnalyticsConsentState(): AnalyticsConsentState {
  const storage = getStorage();
  if (!storage) return "pending";
  const value = storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  if (value === "granted" || value === "denied") {
    return value;
  }
  return "pending";
}

export function setAnalyticsConsentState(
  next: Exclude<AnalyticsConsentState, "pending">,
  options: { includePageView?: boolean; path?: string } = {},
) {
  const storage = getStorage();
  storage?.setItem(ANALYTICS_CONSENT_STORAGE_KEY, next);

  if (next === "granted") {
    configureGrantedConsent(options.path, options.includePageView ?? false);
    return;
  }

  writeRuntimeState({
    appliedConsent: "denied",
  });
}

export function getTrafficContext(): AnalyticsDetail {
  return getCurrentTrafficContext();
}

export function trackProductEvent(
  name: string,
  path: string,
  detail: AnalyticsDetail = {},
  options: TrackProductEventOptions = {},
) {
  appendDebugEvent(name, detail);

  if (options.deliverOnNextPage) {
    writePendingNavigationEvent({ name, detail });
    return;
  }

  if (getAnalyticsConsentState() !== "granted") {
    return;
  }

  const readiness = getAnalyticsReadiness();
  if (!readiness.hasExternalDestination) {
    return;
  }

  configureGrantedConsent(path, false);
  pushAnalyticsTuple("event", name, {
    page_path: path,
    anonymize_ip: true,
    ...detail,
  });
}

restoreAnalyticsFromStoredConsent();
