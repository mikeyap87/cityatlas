export type AnalyticsConsentState = "pending" | "granted" | "denied";
export type AnalyticsDetail = Record<string, string | number | boolean>;

export interface TrackProductEventOptions {
  deliverOnNextPage?: boolean;
}

interface AnalyticsReadiness {
  provider: "" | "ga4" | "meta" | "ga4+meta";
  hasExternalDestination: boolean;
  measurementIdConfigured: boolean;
  metaPixelConfigured: boolean;
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

interface QueuedMetaEvent {
  mode: "track" | "trackCustom";
  name: string;
  payload: Record<string, string | number | boolean>;
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
    __cityatlasMetaQueue__?: QueuedMetaEvent[];
    __cityatlasMetaReadyListenerInstalled__?: boolean;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    google_tag_manager?: Record<string, unknown>;
  }
}

const runtimeEnv = ((import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env ?? {}) as Record<string, string | undefined>;

const DEFAULT_GA_MEASUREMENT_ID = "G-43N3DKZYRL";
const DEFAULT_META_PIXEL_ID = "1511001586900874";
const ANALYTICS_SCRIPT_ID = "cityatlas-ga4-script";
const META_PIXEL_SCRIPT_ID = "cityatlas-meta-pixel-loader";
const META_PIXEL_CONFIG_ID = "cityatlas-meta-pixel-config";
const META_READY_EVENT = "cityatlas:meta-ready";
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

function getMetaPixelId() {
  const configuredPixelId =
    runtimeEnv.VITE_CITYATLAS_META_PIXEL_ID?.trim() || runtimeEnv.VITE_META_PIXEL_ID?.trim();

  if (configuredPixelId) {
    return configuredPixelId;
  }

  if (canUseDom()) {
    const localHosts = new Set(["127.0.0.1", "::1", "localhost"]);
    if (localHosts.has(window.location.hostname)) {
      return "";
    }
  }

  return DEFAULT_META_PIXEL_ID;
}

function getProvider() {
  const gaConfigured = Boolean(getMeasurementId());
  const metaConfigured = Boolean(getMetaPixelId());

  if (gaConfigured && metaConfigured) {
    return "ga4+meta";
  }

  if (gaConfigured) {
    return "ga4";
  }

  if (metaConfigured) {
    return "meta";
  }

  return "";
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
  const measurementIdConfigured = Boolean(getMeasurementId());
  const metaPixelConfigured = Boolean(getMetaPixelId());
  const provider = getProvider();

  return {
    provider,
    hasExternalDestination: Boolean(provider),
    measurementIdConfigured,
    metaPixelConfigured,
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

function injectMetaPixelScript() {
  if (!canUseDom()) return false;

  const metaPixelId = getMetaPixelId();
  if (!metaPixelId) return false;

  let loader = document.getElementById(META_PIXEL_SCRIPT_ID) as HTMLScriptElement | null;
  if (!loader) {
    loader = document.createElement("script");
    loader.id = META_PIXEL_SCRIPT_ID;
    loader.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    `;
    document.head.appendChild(loader);
  }

  let config = document.getElementById(META_PIXEL_CONFIG_ID) as HTMLScriptElement | null;
  if (!config) {
    config = document.createElement("script");
    config.id = META_PIXEL_CONFIG_ID;
    config.textContent = `
      fbq('init', '${metaPixelId}');
      window.dispatchEvent(new Event('${META_READY_EVENT}'));
    `;
    document.head.appendChild(config);
  }

  return true;
}

function readTrafficContextState() {
  return readJson<TrafficContextState>(TRAFFIC_CONTEXT_STORAGE_KEY);
}

function writeTrafficContextState(state: TrafficContextState) {
  writeJson(TRAFFIC_CONTEXT_STORAGE_KEY, state);
}

function sanitizeMetaPayload(detail: AnalyticsDetail = {}) {
  const payload: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(detail)) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        payload[key] = trimmed;
      }
      continue;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      payload[key] = value;
      continue;
    }

    if (typeof value === "boolean") {
      payload[key] = value;
    }
  }

  return payload;
}

function flushQueuedMetaEvents() {
  if (!canUseDom() || typeof window.fbq !== "function") {
    return;
  }

  const queued = window.__cityatlasMetaQueue__ || [];
  window.__cityatlasMetaQueue__ = [];

  for (const entry of queued) {
    window.fbq(entry.mode, entry.name, entry.payload);
  }
}

function ensureMetaReadyListener() {
  if (!canUseDom() || window.__cityatlasMetaReadyListenerInstalled__) {
    return;
  }

  window.addEventListener(META_READY_EVENT, flushQueuedMetaEvents);
  window.__cityatlasMetaReadyListenerInstalled__ = true;
}

function emitMetaEvent(
  name: string,
  payload: Record<string, string | number | boolean>,
  mode: "track" | "trackCustom" = "trackCustom",
) {
  if (!canUseDom() || !getMetaPixelId()) {
    return;
  }

  if (typeof window.fbq !== "function") {
    window.__cityatlasMetaQueue__ = window.__cityatlasMetaQueue__ || [];
    window.__cityatlasMetaQueue__?.push({ mode, name, payload });
    ensureMetaReadyListener();
    return;
  }

  window.fbq(mode, name, payload);
}

function getStandardMetaEvent(name: string) {
  switch (name) {
    case "page_view":
      return "PageView";
    case "newsletter_lead_saved":
    case "business_submission_saved":
    case "business_request_saved_for_later":
      return "Lead";
    case "business_package_cta_clicked":
    case "business_package_checkout_clicked":
      return "InitiateCheckout";
    default:
      return null;
  }
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

  const measurementId = getMeasurementId();
  const metaPixelId = getMetaPixelId();
  const hasGaDestination = Boolean(measurementId);
  const hasMetaDestination = Boolean(metaPixelId);

  const state = readRuntimeState();
  let injected = false;
  let metaInjected = false;

  if (hasGaDestination) {
    ensureDataLayer();
    injected = injectAnalyticsScript();
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
  }

  if (hasMetaDestination) {
    metaInjected = injectMetaPixelScript();
  }

  writeRuntimeState({
    appliedConsent: "granted",
    configuredMeasurementId: measurementId,
    defaultConsentSet: state.defaultConsentSet || hasGaDestination,
    scriptInjected: injected || metaInjected,
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

  if (canUseDom() && getAnalyticsReadiness().hasExternalDestination) {
    if (getMeasurementId()) {
      ensureDataLayer();
      pushAnalyticsTuple("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
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
  if (getMeasurementId()) {
    pushAnalyticsTuple("event", name, {
      page_path: path,
      anonymize_ip: true,
      ...detail,
    });
  }

  if (getMetaPixelId()) {
    const metaPayload = sanitizeMetaPayload({
      page_path: path,
      ...(canUseDom()
        ? {
            page_location: window.location.href,
            page_title: document.title,
          }
        : {}),
      ...detail,
    });

    if (name !== "page_view") {
      emitMetaEvent(name, metaPayload, "trackCustom");
    }

    const standardMetaEvent = getStandardMetaEvent(name);
    if (standardMetaEvent) {
      emitMetaEvent(standardMetaEvent, metaPayload, "track");
    }
  }
}

restoreAnalyticsFromStoredConsent();
