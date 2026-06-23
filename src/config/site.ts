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
    hero: resolvePublicAssetPath("/assets/places-generated/granville-island-public-market-hero-generated.jpg"),
    about: resolvePublicAssetPath("/assets/places-generated/granville-island-public-market-hero-generated.jpg"),
    business: resolvePublicAssetPath("/assets/places-generated/granville-island-public-market-generated.jpg"),
    city: resolvePublicAssetPath("/assets/places-generated/english-bay-beach-generated.jpg"),
    guides: resolvePublicAssetPath("/assets/places-generated/gastown-generated.jpg"),
    missions: resolvePublicAssetPath("/assets/places-generated/stanley-park-generated.jpg"),
    planner: resolvePublicAssetPath("/assets/places-generated/commercial-drive-generated.jpg"),
    waterfront: resolvePublicAssetPath("/assets/places-generated/kitsilano-beach-generated.jpg"),
    wellness: resolvePublicAssetPath("/assets/places-generated/queen-elizabeth-park-generated.jpg"),
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

const runtimeEnv = ((import.meta as ImportMeta & {
  env?: { DEV?: boolean } & Record<string, string | undefined>;
}).env ?? {}) as { DEV?: boolean } & Record<string, string | undefined>;
const isDevBuild = runtimeEnv.DEV === true;

export const envFlags = {
  livePayments: runtimeEnv.VITE_CITYATLAS_ENABLE_LIVE_PAYMENTS === "true",
  realProviderImports: runtimeEnv.VITE_CITYATLAS_ENABLE_REAL_PROVIDER_IMPORTS === "true",
  automatedOutreach: runtimeEnv.VITE_CITYATLAS_ENABLE_AUTOMATED_OUTREACH === "true",
  hostedAdmin: runtimeEnv.VITE_CITYATLAS_ENABLE_HOSTED_ADMIN === "true",
  hostedPrivatePreview: runtimeEnv.VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW === "true",
};

export const buildFlags = {
  hostedAdminArtifacts: isDevBuild || envFlags.hostedAdmin,
  hostedPrivatePreviewArtifacts: isDevBuild || envFlags.hostedPrivatePreview,
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

export function canRenderAdminExperience() {
  return buildFlags.hostedAdminArtifacts && (isDevBuild ? isLocalPreviewRuntime() : envFlags.hostedAdmin);
}

export function canRenderPrivatePreviewExperience() {
  return buildFlags.hostedPrivatePreviewArtifacts
    && (isDevBuild ? isLocalPreviewRuntime() : envFlags.hostedPrivatePreview);
}
