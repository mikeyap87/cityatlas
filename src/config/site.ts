export function resolvePublicAssetPath(path: string) {
  if (typeof window !== "undefined" && window.location.protocol === "file:" && path.startsWith("/")) {
    return `.${path}`;
  }

  return path;
}

export const siteConfig = {
  name: "CityAtlas",
  tagline: "Find the right part of Vancouver first",
  city: "Vancouver",
  citySlug: "vancouver",
  localUrl: "http://127.0.0.1:5178/",
  targetDomain: "city.univenturestudio.com",
  launchModeLabel: "Univenture private-launch package",
  contactEmail: "city@univenturestudio.com",
  media: {
    hero: resolvePublicAssetPath("/assets/vancouver-market-hero.jpg"),
    city: resolvePublicAssetPath("/assets/vancouver-waterfront-park-hero.jpg"),
    waterfront: resolvePublicAssetPath("/assets/vancouver-waterfront-skyline.jpg"),
    wellness: resolvePublicAssetPath("/assets/wellness-session-room.jpg"),
  },
  gatedActions: [
    "Domain purchase",
    "Trademark/legal clearance",
    "Live deployment",
    "Live Stripe or payment acceptance",
    "Real provider imports",
    "Automated outreach",
    "Public claims about real businesses",
  ],
};

const runtimeEnv = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ??
  {}) as Record<string, string | undefined>;

export const envFlags = {
  livePayments: runtimeEnv.VITE_CITYATLAS_ENABLE_LIVE_PAYMENTS === "true",
  realProviderImports: runtimeEnv.VITE_CITYATLAS_ENABLE_REAL_PROVIDER_IMPORTS === "true",
  automatedOutreach: runtimeEnv.VITE_CITYATLAS_ENABLE_AUTOMATED_OUTREACH === "true",
  hostedAdmin: runtimeEnv.VITE_CITYATLAS_ENABLE_HOSTED_ADMIN === "true",
  hostedPrivatePreview: runtimeEnv.VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW === "true",
};

export function isLocalPreviewRuntime() {
  if (typeof window === "undefined") return true;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

export function canShowHostedAdmin() {
  return isLocalPreviewRuntime() || envFlags.hostedAdmin;
}

export function canShowHostedPrivatePreview() {
  return isLocalPreviewRuntime() || envFlags.hostedPrivatePreview;
}
