import type { Business, EventItem, Guide } from "../types";

const visualLibrary = {
  evening: "/assets/scene-evening-waterfront.svg",
  rainy: "/assets/scene-rainy-cafe.svg",
  kits: "/assets/scene-kits-beach-flow.svg",
  wellness: "/assets/scene-wellness-studio.svg",
  garden: "/assets/scene-garden-campus.svg",
  culture: "/assets/scene-culture-harbour.svg",
} as const;

function normalize(parts: Array<string | undefined>) {
  return parts
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase();
}

function matchesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function isSceneAsset(path: string | undefined) {
  return Boolean(path) && !path?.includes("/visual_references/");
}

export function getGuideVisual(guide: Guide) {
  const text = normalize([guide.title, guide.category, guide.cluster, guide.neighborhood, guide.summary]);

  if (matchesAny(text, ["rainy", "coffee", "cafe", "sunday"])) {
    return visualLibrary.rainy;
  }

  if (matchesAny(text, ["wellness", "recovery", "reset", "spa"])) {
    return visualLibrary.wellness;
  }

  if (matchesAny(text, ["kits", "kitsilano", "beach", "west-side", "west side", "weekend"])) {
    return visualLibrary.kits;
  }

  if (matchesAny(text, ["ubc", "garden", "conservatory", "campus", "nitobe", "vandusen", "botanical"])) {
    return visualLibrary.garden;
  }

  if (matchesAny(text, ["culture", "museum", "gallery", "returning", "false creek", "commercial drive", "chinatown"])) {
    return visualLibrary.culture;
  }

  return visualLibrary.evening;
}

export function getBusinessVisual(business: Business) {
  if (isSceneAsset(business.heroImage)) {
    return business.heroImage;
  }

  const text = normalize([
    business.name,
    business.category,
    business.neighborhood,
    business.shortDescription,
    business.fullDescription,
  ]);

  if (matchesAny(text, ["wellness", "recovery", "massage", "mobility", "studio"])) {
    return visualLibrary.wellness;
  }

  if (matchesAny(text, ["coffee", "cafe", "rainline", "work-friendly"])) {
    return visualLibrary.rainy;
  }

  if (matchesAny(text, ["kits", "cycle", "beach", "outdoors", "scenic"])) {
    return visualLibrary.kits;
  }

  if (matchesAny(text, ["museum", "gallery", "culture"])) {
    return visualLibrary.culture;
  }

  return visualLibrary.evening;
}

export function getEventVisual(event: EventItem) {
  if (isSceneAsset(event.image)) {
    return event.image;
  }

  const text = normalize([event.title, event.category, event.neighborhood, event.description]);

  if (matchesAny(text, ["rope", "flow", "kits", "beach", "wellness"])) {
    return visualLibrary.kits;
  }

  if (matchesAny(text, ["rain", "coffee"])) {
    return visualLibrary.rainy;
  }

  return visualLibrary.evening;
}
