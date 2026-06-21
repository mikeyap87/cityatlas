type AnalyticsDetail = Record<string, string | number | boolean>;

const TRAFFIC_CONTEXT_STORAGE_KEY = "cityatlas.traffic.context.v1";
const ANALYTICS_DEBUG_STORAGE_KEY = "cityatlas.analytics.debug.v1";

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
  const hasMeasurementId = Boolean(runtimeEnv.VITE_GA_MEASUREMENT_ID || runtimeEnv.VITE_ANALYTICS_ID);
  const hasExternalDestination = provider !== "local_only" && hasMeasurementId;

  return {
    provider,
    hasExternalDestination,
    measurementIdConfigured: hasMeasurementId,
  };
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

  const maybeWindow = window as Window & {
    dataLayer?: unknown[];
    gtag?: (command: "event", eventName: string, eventParams?: AnalyticsDetail) => void;
  };

  if (typeof maybeWindow.gtag === "function") {
    maybeWindow.gtag("event", name, {
      page_path: path,
      ...event.detail,
    });
    return;
  }

  maybeWindow.dataLayer = maybeWindow.dataLayer ?? [];
  maybeWindow.dataLayer.push({
    event: name,
    page_path: path,
    ...event.detail,
  });
}
