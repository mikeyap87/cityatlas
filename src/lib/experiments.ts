import type { CityAtlasData } from "../types";

export type GrowthVariant = "control" | "founding-partner" | "weekend-atlas";

export interface VariantCopy {
  variant: GrowthVariant;
  heroTitle: string;
  heroCopy: string;
  primaryCta: string;
  partnerHeadline: string;
  partnerCopy: string;
}

export const variantCopy: Record<GrowthVariant, VariantCopy> = {
  control: {
    variant: "control",
    heroTitle: "Find the right part of Vancouver first",
    heroCopy: "Search by neighborhood, weather, or trip type and open one useful page fast.",
    primaryCta: "Explore Vancouver",
    partnerHeadline: "Help your business show up more clearly",
    partnerCopy:
      "Start with one clear business need, then CityAtlas can shape the next page, guide fit, or offer from there.",
  },
  "founding-partner": {
    variant: "founding-partner",
    heroTitle: "Get found when Vancouver people are choosing where to go",
    heroCopy:
      "CityAtlas helps the right business show up when people are choosing an area, a guide, or a city plan.",
    primaryCta: "See business packages",
    partnerHeadline: "Build a stronger CityAtlas presence",
    partnerCopy:
      "Start with one clear business need, then CityAtlas can review page quality, guide placement, and offer shape.",
  },
  "weekend-atlas": {
    variant: "weekend-atlas",
    heroTitle: "Plan a better Vancouver weekend",
    heroCopy: "Open one guide, save it, and keep the weekend compact.",
    primaryCta: "Build a weekend plan",
    partnerHeadline: "Reach locals while they are planning the weekend",
    partnerCopy:
      "Businesses can start with one clear request for guide placement, events, offers, or a clearer local story.",
  },
};

export function getActiveVariant(): GrowthVariant {
  if (typeof window === "undefined") return "control";
  const value = new URLSearchParams(window.location.search).get("variant");
  if (value === "founding-partner" || value === "weekend-atlas") return value;
  return "control";
}

export function getVisitorIntent(data: CityAtlasData) {
  if (data.growthEvents.some((event) => event.name === "business_submission_saved")) {
    return "business_high_intent";
  }
  if (data.savedItems.length >= 2) return "local_planner";
  if (data.newsletterLeads.length > 0) return "returning_lead";
  if (data.growthEvents.some((event) => event.name.includes("pricing"))) return "business_researcher";
  return "new_visitor";
}

export function getNextBestAction(data: CityAtlasData) {
  const intent = getVisitorIntent(data);
  if (intent === "business_high_intent") {
    return {
      label: "Finish your business request",
      path: "/for-businesses/submit",
      copy: "You already started a request. The next step is saving the business details clearly.",
      primaryLabel: "Finish request",
      secondaryLabel: "See packages",
      secondaryPath: "/for-businesses/pricing",
    };
  }
  if (intent === "local_planner") {
    return {
      label: "Open your saved plan",
      path: "/planner",
      copy: "You have saved enough items to turn them into a local itinerary.",
      primaryLabel: "Open planner",
      secondaryLabel: "Browse guides",
      secondaryPath: "/vancouver/guides",
    };
  }
  if (intent === "returning_lead") {
    return {
      label: "Pick your first guide",
      path: "/vancouver/guides",
      copy: "You already saved your place here. Next, open the guide or local place that fits today.",
      primaryLabel: "Open Vancouver guides",
      secondaryLabel: "See local places",
      secondaryPath: "/vancouver/date-night-starters",
    };
  }
  return {
    label: "Pick your first Vancouver guide",
    path: "/vancouver/guides",
    copy: "Start with one strong guide or local place instead of scanning the whole city first.",
    primaryLabel: "Open Vancouver guides",
    secondaryLabel: "See local places",
    secondaryPath: "/vancouver/date-night-starters",
  };
}
