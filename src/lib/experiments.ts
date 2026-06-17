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
    heroTitle: "A Vancouver-first city guide for better local plans",
    heroCopy:
      "CityAtlas helps locals and visitors choose what to do next with answer-first guides, saveable routes, and trust-first local discovery.",
    primaryCta: "Explore the city",
    partnerHeadline: "Business visibility packages",
    partnerCopy:
      "Request review for guide placement, feature pages, offers, and local visibility snapshots. Billing opens after fit, scope, and terms are confirmed.",
  },
  "founding-partner": {
    variant: "founding-partner",
    heroTitle: "Help your business show up in better Vancouver discovery",
    heroCopy:
      "CityAtlas is building a curated Vancouver discovery layer around route logic, useful guides, and partner-ready local stories.",
    primaryCta: "See business packages",
    partnerHeadline: "Become a CityAtlas business partner",
    partnerCopy:
      "Get reviewed for a premium page, guide placement, offer module, and visibility snapshot before paid packages open.",
  },
  "weekend-atlas": {
    variant: "weekend-atlas",
    heroTitle: "Plan a better Vancouver weekend without tab overload",
    heroCopy:
      "Use saveable routes, practical guides, and one clear planner loop instead of bouncing across maps, blogs, and screenshots.",
    primaryCta: "Build an itinerary",
    partnerHeadline: "Reach locals planning where to go next",
    partnerCopy:
      "Businesses can request review for guide placement, event modules, offers, and creator-ready local stories.",
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
      copy: "You already started a business request. The next step is saving the details clearly, not outreach.",
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
    copy: "Start with places, events, offers, and guides before you save or share a plan.",
  };
}
