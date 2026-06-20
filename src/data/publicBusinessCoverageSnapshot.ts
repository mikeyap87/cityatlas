import type { PublicBusinessCoverageSnapshot } from "../lib/publicBusinessCoverage";

export const vancouverPublicBusinessCoverageSnapshot: PublicBusinessCoverageSnapshot = {
  totalBusinesses: 143,
  sourceBackedAnchors: 25,
  sourceBackedCollections: 14,
  guideCount: 23,
  categoryCount: 8,
  topCategories: [
    { label: "Restaurant / bar", count: 26 },
    { label: "Cultural space", count: 19 },
    { label: "Event venue", count: 17 },
    { label: "Hotel", count: 13 },
    { label: "Wellness", count: 11 },
    { label: "Local business", count: 8 },
  ],
  topNeighborhoods: [
    { label: "Vancouver", count: 9 },
    { label: "Downtown", count: 5 },
    { label: "UBC", count: 4 },
    { label: "Vanier Park", count: 3 },
    { label: "Chinatown", count: 2 },
    { label: "Kitsilano", count: 2 },
  ],
  lanes: [
    {
      id: "event-group",
      title: "Event, gathering, and group-plan coverage",
      description:
        "This page is strongest when the goal is a compact group plan, a hosted weekend shape, or one clear plan that avoids crossing the city all day.",
      path: "/vancouver/weekend-route-starters",
      count: 32,
      topCategories: [
        { label: "Event venue", count: 17 },
        { label: "Events", count: 5 },
        { label: "Studio", count: 5 },
      ],
      topNeighborhoods: [{ label: "Vancouver", count: 4 }],
    },
    {
      id: "hospitality",
      title: "Hospitality, dinners, and local-night coverage",
      description:
        "Start here when the real question is which Vancouver mood or area fits dinner, drinks, or a lower-pressure night out.",
      path: "/vancouver/date-night-starters",
      count: 32,
      topCategories: [
        { label: "Restaurant / bar", count: 26 },
        { label: "Cocktail closer", count: 1 },
        { label: "Hotel or club space", count: 1 },
      ],
      topNeighborhoods: [{ label: "Waterfront", count: 1 }],
    },
    {
      id: "local-discovery",
      title: "Flexible local discovery, cafes, and neighborhood staples",
      description:
        "Choose this page when the answer is still broad and the best next move is matching a person to the right CityAtlas guide before naming one exact stop.",
      path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
      count: 29,
      topCategories: [
        { label: "Local business", count: 8 },
        { label: "Beach", count: 4 },
        { label: "Botanical garden", count: 2 },
      ],
      topNeighborhoods: [
        { label: "Kitsilano", count: 2 },
        { label: "Queen Elizabeth Park", count: 2 },
        { label: "UBC", count: 2 },
      ],
    },
    {
      id: "culture",
      title: "Culture, galleries, and slower-day coverage",
      description:
        "Use this page when the better decision is choosing a compact culture plan, not forcing a fake one-size-fits-all itinerary.",
      path: "/vancouver/false-creek-culture-starters",
      count: 26,
      topCategories: [
        { label: "Cultural space", count: 19 },
        { label: "Museum", count: 4 },
        { label: "Cultural centre", count: 1 },
      ],
      topNeighborhoods: [
        { label: "UBC", count: 2 },
        { label: "Vanier Park", count: 2 },
        { label: "Chinatown", count: 1 },
      ],
    },
    {
      id: "guest-hosting",
      title: "Hotels, visitor support, and guest-hosting coverage",
      description:
        "Open this page when the plan depends on where guests are staying, how far they want to move, and how easy the handoff needs to feel.",
      path: "/vancouver/out-of-town-guest-starters",
      count: 13,
      topCategories: [{ label: "Hotel", count: 13 }],
      topNeighborhoods: [{ label: "Downtown", count: 3 }, { label: "Coal Harbour", count: 1 }],
    },
    {
      id: "wellness",
      title: "Wellness, reset, and slower-day coverage",
      description:
        "Use this page when the plan needs easier wellness anchors, calmer pacing, or a calmer reset instead of a packed schedule.",
      path: "/vancouver/wellness-reset-starters",
      count: 11,
      topCategories: [{ label: "Wellness", count: 11 }],
      topNeighborhoods: [{ label: "Vancouver", count: 5 }],
    },
  ],
};
