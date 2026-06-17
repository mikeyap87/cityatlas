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
    heroTitle: "Find your Vancouver plan faster",
    heroCopy:
      "Choose a mood, neighborhood, or occasion, then open one good guide.",
    primaryCta: "Open Vancouver",
    partnerHeadline: "Help your business show up in the right Vancouver decisions",
    partnerCopy:
      "Start with a quick check if you want better guide placement, a stronger page, or a clearer local story. Checkout stays closed until the scope is clear.",
  },
  "founding-partner": {
    variant: "founding-partner",
    heroTitle: "Show up when Vancouver people are deciding where to go",
    heroCopy:
      "CityAtlas helps the right business show up when people are choosing a neighborhood, guide, or city plan.",
    primaryCta: "See business packages",
    partnerHeadline: "Build a stronger CityAtlas presence",
    partnerCopy:
      "Start with a quick check for page quality, guide placement, and offer fit before checkout opens.",
  },
  "weekend-atlas": {
    variant: "weekend-atlas",
    heroTitle: "Find a better Vancouver weekend plan faster",
    heroCopy:
      "Open one route, save it, and keep the weekend compact instead of juggling maps, blogs, and screenshots.",
    primaryCta: "Build an itinerary",
    partnerHeadline: "Reach locals while they are planning the weekend",
    partnerCopy:
      "Businesses can start a quick check for guide placement, events, offers, and a clearer local story.",
  },
};

export function getActiveVariant(): GrowthVariant {
  if (typeof window === "undefined") return "control";
  const value = new URLSearchParams(window.location.search).get("variant");
  if (value === "founding-partner" || value === "weekend-atlas") return value;
  return "control";
}

export function getVisitorIntent(data: CityAtlasData) {
  if (data.submissions.length > 0) return "business_high_intent";
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
    };
  }
  if (intent === "local_planner") {
    return {
      label: "Open your planner",
      path: "/planner",
      copy: "You have saved enough items to turn them into a local itinerary.",
    };
  }
  if (intent === "returning_lead") {
    return {
      label: "Reuse your saved plan",
      path: "/planner",
      copy: "Use your saved picks to shape an itinerary you can come back to later.",
    };
  }
  return {
    label: "Explore Vancouver",
    path: "/vancouver",
    copy: "Start with the city page, then narrow down to the guide or route that fits today.",
  };
}
