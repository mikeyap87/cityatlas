import type { CityAtlasData } from "../types";
import type { BusinessBatchLane } from "./businessOutreachPrep";
import { getBusinessBatchLane } from "./businessOutreachPrep";

interface CoverageTag {
  label: string;
  count: number;
}

export interface PublicBusinessCoverageLane {
  id: string;
  title: string;
  description: string;
  path: string;
  count: number;
  topCategories: CoverageTag[];
  topNeighborhoods: CoverageTag[];
}

export interface PublicBusinessCoverageSnapshot {
  totalBusinesses: number;
  sourceBackedAnchors: number;
  sourceBackedCollections: number;
  guideCount: number;
  categoryCount: number;
  topCategories: CoverageTag[];
  topNeighborhoods: CoverageTag[];
  lanes: PublicBusinessCoverageLane[];
}

interface PublicLaneDefinition {
  id: string;
  title: string;
  path: string;
  description: string;
  batchLanes: BusinessBatchLane[];
}

const publicLaneDefinitions: PublicLaneDefinition[] = [
  {
    id: "hospitality",
    title: "Hospitality, dinners, and local-night coverage",
    path: "/vancouver/date-night-starters",
    description:
      "Start here when the real question is which Vancouver mood or area fits dinner, drinks, or a lower-pressure night out.",
    batchLanes: ["hospitality"],
  },
  {
    id: "culture",
    title: "Culture, galleries, and slower-day coverage",
    path: "/vancouver/false-creek-culture-starters",
    description:
      "Use this page when the better decision is choosing a compact culture plan, not forcing a fake one-size-fits-all itinerary.",
    batchLanes: ["culture"],
  },
  {
    id: "guest-hosting",
    title: "Hotels, visitor support, and guest-hosting coverage",
    path: "/vancouver/out-of-town-guest-starters",
    description:
      "Open this page when the plan depends on where guests are staying, how far they want to move, and how easy the handoff needs to feel.",
    batchLanes: ["hotel_guest"],
  },
  {
    id: "event-group",
    title: "Event, gathering, and group-plan coverage",
    path: "/vancouver/weekend-route-starters",
    description:
      "This page is strongest when the goal is a compact group plan, a hosted weekend shape, or one clear plan that avoids crossing the city all day.",
    batchLanes: ["event_group"],
  },
  {
    id: "wellness",
    title: "Wellness, reset, and slower-day coverage",
    path: "/vancouver/wellness-reset-starters",
    description:
      "Use this page when the plan needs easier wellness anchors, calmer pacing, or a calmer reset instead of a packed schedule.",
    batchLanes: ["wellness"],
  },
  {
    id: "local-discovery",
    title: "Flexible local discovery, cafes, and neighborhood staples",
    path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
    description:
      "Choose this lane when the answer is still broad and the best next move is matching a person to the right CityAtlas route before naming one exact stop.",
    batchLanes: ["local_business", "other"],
  },
];

function countValues(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    counts.set(trimmed, (counts.get(trimmed) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

export function buildPublicBusinessCoverageSnapshot(
  data: Pick<CityAtlasData, "businessProspects" | "guides">,
  cityKey = "vancouver",
): PublicBusinessCoverageSnapshot {
  const cityProspects = data.businessProspects.filter((prospect) => prospect.cityKey === cityKey);
  const sourceBackedCollections = new Set(
    cityProspects.flatMap((prospect) =>
      prospect.collectionIds.length
        ? prospect.collectionIds
        : prospect.sourceCollection
          ? [prospect.sourceCollection]
          : [],
    ),
  ).size;
  const topCategories = countValues(cityProspects.map((prospect) => prospect.category));
  const topNeighborhoods = countValues(cityProspects.map((prospect) => prospect.neighborhood));
  const guideCount = data.guides.filter((guide) => (guide.citySlug ?? "vancouver") === cityKey).length;

  const lanes = publicLaneDefinitions
    .map((definition) => {
      const laneProspects = cityProspects.filter((prospect) =>
        definition.batchLanes.includes(getBusinessBatchLane(prospect)),
      );

      if (laneProspects.length === 0) {
        return null;
      }

      return {
        id: definition.id,
        title: definition.title,
        description: definition.description,
        path: definition.path,
        count: laneProspects.length,
        topCategories: countValues(laneProspects.map((prospect) => prospect.category)).slice(0, 3),
        topNeighborhoods: countValues(laneProspects.map((prospect) => prospect.neighborhood)).slice(0, 3),
      } satisfies PublicBusinessCoverageLane;
    })
    .filter((lane): lane is PublicBusinessCoverageLane => Boolean(lane));

  return {
    totalBusinesses: cityProspects.length,
    sourceBackedAnchors: cityProspects.filter((prospect) => prospect.sourceType === "source_backed_place").length,
    sourceBackedCollections,
    guideCount,
    categoryCount: topCategories.length,
    topCategories: topCategories.slice(0, 6),
    topNeighborhoods: topNeighborhoods.slice(0, 6),
    lanes,
  };
}
