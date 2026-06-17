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
    heroTitle: "Plan a better Vancouver day without opening 12 tabs",
    heroCopy:
      "Search by mood, neighborhood, weather, or visitor type. CityAtlas helps you find the best page to start with, then turn it into a simple plan.",
    primaryCta: "Start exploring",
    partnerHeadline: "Help your business show up in the right Vancouver moments",
    partnerCopy:
      "Request a review if you want guide placement, a stronger page, or a cleaner city-facing story. Billing stays off until the fit is clear.",
  },
  "founding-partner": {
    variant: "founding-partner",
    heroTitle: "Help your business show up when Vancouver people are deciding where to go",
    heroCopy:
      "CityAtlas brings together useful guides, neighborhood picks, and city pages so the right businesses are easier to discover at the right moment.",
    primaryCta: "See business packages",
    partnerHeadline: "Get reviewed for a stronger CityAtlas presence",
    partnerCopy:
      "Start with a review for page quality, guide placement, and offer fit before paid packages open.",
  },
  "weekend-atlas": {
    variant: "weekend-atlas",
    heroTitle: "Plan a better Vancouver weekend without tab overload",
    heroCopy:
      "Use route ideas, practical guides, and one clear planner loop instead of bouncing between maps, blogs, and screenshots.",
    primaryCta: "Build an itinerary",
    partnerHeadline: "Reach locals while they are planning the weekend",
    partnerCopy:
      "Businesses can request review for guide placement, events, offers, and a cleaner local story.",
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
      label: "Finish your business review request",
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
