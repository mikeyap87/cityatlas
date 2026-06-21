type AnalyticsDetail = Record<string, string | number | boolean>;
type AnalyticsConsentState = "pending" | "granted" | "denied";

const TRAFFIC_CONTEXT_STORAGE_KEY = "cityatlas.traffic.context.v1";
const ANALYTICS_DEBUG_STORAGE_KEY = "cityatlas.analytics.debug.v1";
const ANALYTICS_CONSENT_STORAGE_KEY = "cityatlas.analytics.consent.v1";
const ANALYTICS_SCRIPT_ID = "cityatlas-ga4-script";

const campaignParamNames = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

const runtimeEnv = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ??
  {}) as Record<string, string | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __cityatlasAnalyticsState?: {
      appliedConsent: AnalyticsConsentState;
      configuredMeasurementId: string;
      defaultConsentSet: boolean;
      scriptInjected: boolean;
    };
  }
}

function cleanValue(value: string | null) {
  return value?.trim() || "";
}

function readStoredTrafficContext(): AnalyticsDetail {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(TRAFFIC_CONTEXT_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as AnalyticsDetail;
  } catch {
    return {};
  }
}

function writeStoredTrafficContext(context: AnalyticsDetail) {
  if (typeof window === "undefined" || Object.keys(context).length === 0) return;

  window.localStorage.setItem(TRAFFIC_CONTEXT_STORAGE_KEY, JSON.stringify(context));
}

function getMeasurementId() {
  return runtimeEnv.VITE_GA_MEASUREMENT_ID || runtimeEnv.VITE_ANALYTICS_ID || "";
}

function readStoredConsentState(): AnalyticsConsentState {
  if (typeof window === "undefined") return "pending";

  const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : "pending";
}

function writeStoredConsentState(value: AnalyticsConsentState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
}

export function captureTrafficContext(path = typeof window !== "undefined" ? window.location.pathname : "") {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const storedContext = readStoredTrafficContext();
  const campaignContext = campaignParamNames.reduce<AnalyticsDetail>((context, paramName) => {
    const value = cleanValue(params.get(paramName));
    if (value) {
      context[paramName] = value;
    }
    return context;
  }, {});

  if (Object.keys(campaignContext).length === 0) {
    return storedContext;
  }

  const nextContext: AnalyticsDetail = {
    ...storedContext,
    ...campaignContext,
    firstLandingPath: String(storedContext.firstLandingPath || path || "/"),
    latestLandingPath: `${path || "/"}${window.location.search}`,
    referrer: cleanValue(document.referrer) || String(storedContext.referrer || "direct"),
  };
  writeStoredTrafficContext(nextContext);
  return nextContext;
}

export function getTrafficContext() {
  return captureTrafficContext();
}

function getAnalyticsProvider() {
  const explicitProvider = runtimeEnv.VITE_CITYATLAS_ANALYTICS_PROVIDER;
  if (explicitProvider) return explicitProvider;
  if (runtimeEnv.VITE_GA_MEASUREMENT_ID || runtimeEnv.VITE_ANALYTICS_ID) return "ga4";
  return "local_only";
}

export function getAnalyticsReadiness() {
  const provider = getAnalyticsProvider();
  const hasMeasurementId = Boolean(getMeasurementId());
  const hasExternalDestination = provider !== "local_only" && hasMeasurementId;

  return {
    provider,
    hasExternalDestination,
    measurementIdConfigured: hasMeasurementId,
  };
}

function getConsentUpdatePayload(consent: Exclude<AnalyticsConsentState, "pending">) {
  if (consent === "granted") {
    return {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    };
  }

  return {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
}

export function ensureAnalyticsSetup(options: { allowScriptInjection?: boolean } = {}) {
  if (typeof window === "undefined") return false;

  const readiness = getAnalyticsReadiness();
  const measurementId = getMeasurementId();
  if (!readiness.hasExternalDestination || !measurementId) {
    return false;
  }

  const analyticsState = window.__cityatlasAnalyticsState ?? {
    appliedConsent: "pending" as AnalyticsConsentState,
    configuredMeasurementId: "",
    defaultConsentSet: false,
    scriptInjected: false,
  };

  const allowScriptInjection = options.allowScriptInjection ?? true;
  if (!analyticsState.scriptInjected && !allowScriptInjection) {
    window.__cityatlasAnalyticsState = analyticsState;
    return false;
  }

  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }

  if (!analyticsState.defaultConsentSet) {
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
    analyticsState.defaultConsentSet = true;
  }

  if (analyticsState.configuredMeasurementId !== measurementId) {
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false,
      anonymize_ip: true,
    });
    analyticsState.configuredMeasurementId = measurementId;
  }

  if (!analyticsState.scriptInjected) {
    let script = document.getElementById(ANALYTICS_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = ANALYTICS_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }
    analyticsState.scriptInjected = true;
  }

  window.__cityatlasAnalyticsState = analyticsState;
  return true;
}

function syncAnalyticsConsentMode(consent: AnalyticsConsentState) {
  if (typeof window === "undefined" || consent === "pending") return;

  const allowScriptInjection =
    consent === "granted" || Boolean(window.__cityatlasAnalyticsState?.scriptInjected);
  if (!ensureAnalyticsSetup({ allowScriptInjection }) || typeof window.gtag !== "function") return;

  const analyticsState = window.__cityatlasAnalyticsState;
  if (analyticsState?.appliedConsent === consent) return;

  window.gtag("consent", "update", getConsentUpdatePayload(consent));
  if (analyticsState) {
    analyticsState.appliedConsent = consent;
    window.__cityatlasAnalyticsState = analyticsState;
  }
}

export function getAnalyticsConsentState() {
  return readStoredConsentState();
}

export function setAnalyticsConsentState(
  consent: Exclude<AnalyticsConsentState, "pending">,
  options: { path?: string; includePageView?: boolean } = {},
) {
  writeStoredConsentState(consent);
  syncAnalyticsConsentMode(consent);

  if (
    consent === "granted" &&
    options.includePageView &&
    options.path &&
    typeof window !== "undefined" &&
    typeof window.gtag === "function"
  ) {
    window.gtag("event", "page_view", {
      page_path: options.path,
      ...getTrafficContext(),
    });
  }
}

function writeDebugEvent(event: { name: string; path: string; detail: AnalyticsDetail }) {
  if (typeof window === "undefined") return;

  try {
    const stored = window.localStorage.getItem(ANALYTICS_DEBUG_STORAGE_KEY);
    const events = stored ? (JSON.parse(stored) as unknown[]) : [];
    window.localStorage.setItem(
      ANALYTICS_DEBUG_STORAGE_KEY,
      JSON.stringify([{ ...event, createdAt: new Date().toISOString() }, ...events].slice(0, 100)),
    );
  } catch {
    // Debug analytics should never break the public path.
  }
}

export function trackProductEvent(name: string, path: string, detail: AnalyticsDetail = {}) {
  const readiness = getAnalyticsReadiness();
  const event = {
    name,
    path,
    detail: {
      ...getTrafficContext(),
      ...detail,
    },
  };

  writeDebugEvent(event);

  if (typeof window === "undefined" || !readiness.hasExternalDestination) {
    return;
  }

  const consent = readStoredConsentState();
  if (consent !== "granted") {
    syncAnalyticsConsentMode(consent);
    return;
  }

  ensureAnalyticsSetup({ allowScriptInjection: true });
  syncAnalyticsConsentMode(consent);

  if (typeof window.gtag === "function") {
    window.gtag("event", name, {
      page_path: path,
      ...event.detail,
    });
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: name,
    page_path: path,
    ...event.detail,
  });
}
