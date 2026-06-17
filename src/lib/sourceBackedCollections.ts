import { siteConfig } from "../config/site.ts";
import type { CityAtlasData, Guide, SourceBackedPlaceReference } from "../types";

export type SourceBackedCollectionId = SourceBackedPlaceReference["collection"];

export interface SourceBackedCollectionMeta {
  path: string;
  shortLabel: string;
  breadcrumbName: string;
  pageTitle: string;
  pageDescription: string;
  itemListName: string;
  itemListDescription: string;
  cityName?: string;
  regionName?: string;
  guideHubPath?: string;
  guideHubLabel?: string;
}

export const sourceBackedCollectionMeta: Record<
  SourceBackedCollectionId,
  SourceBackedCollectionMeta
> = {
  vancouver_date_night_starters: {
    path: "/vancouver/date-night-starters",
    shortLabel: "Date-night starters",
    breadcrumbName: "Vancouver Date Night Starters",
    pageTitle: "Vancouver Date Night Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver date-night starting points with official source notes, claim boundaries, and a public correction path.",
    itemListName: "Vancouver date night starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver date-night anchors with visible claim boundaries and correction path.",
  },
  vancouver_rainy_day_starters: {
    path: "/vancouver/rainy-day-starters",
    shortLabel: "Rainy-day starters",
    breadcrumbName: "Vancouver Rainy Day Starters",
    pageTitle: "Vancouver Rainy Day Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver rainy-day starting points with official source notes, indoor-friendly route roles, and a public correction path.",
    itemListName: "Vancouver rainy-day starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver rainy-day anchors with visible claim boundaries and correction path.",
  },
  vancouver_first_evening_starters: {
    path: "/vancouver/first-evening-starters",
    shortLabel: "First-evening starters",
    breadcrumbName: "Vancouver First-Evening Starters",
    pageTitle: "Vancouver First-Evening Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver first-evening starting points with official source notes, visitor-friendly route roles, and a public correction path.",
    itemListName: "Vancouver first-evening starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver first-evening anchors with visible claim boundaries and correction path.",
  },
  vancouver_first_time_visitor_starters: {
    path: "/vancouver/first-time-visitor-starters",
    shortLabel: "First-time visitor starters",
    breadcrumbName: "Vancouver First-Time Visitor Starters",
    pageTitle: "Vancouver First-Time Visitor Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver first-time visitor starting areas with official source notes, route-fit guidance, and a public correction path.",
    itemListName: "Vancouver first-time visitor starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver first-time visitor starting areas with visible claim boundaries and correction path.",
  },
  toronto_first_time_visitor_starters: {
    path: "/toronto/first-time-visitor-starters",
    shortLabel: "Toronto first-time visitor starters",
    breadcrumbName: "Toronto First-Time Visitor Starters",
    pageTitle: "Toronto First-Time Visitor Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Toronto first-time visitor starting areas with official source notes, route-fit guidance, and a public correction path.",
    itemListName: "Toronto first-time visitor starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Toronto first-time visitor starting areas with visible claim boundaries and correction path.",
    cityName: "Toronto",
    regionName: "Ontario",
    guideHubPath: "/toronto/guides",
    guideHubLabel: "Toronto Guides",
  },
  toronto_weekend_route_starters: {
    path: "/toronto/weekend-route-starters",
    shortLabel: "Toronto weekend route starters",
    breadcrumbName: "Toronto Weekend Route Starters",
    pageTitle: "Toronto Weekend Route Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Toronto weekend route starters with official source notes, route-fit guidance, and a public correction path.",
    itemListName: "Toronto weekend route starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Toronto weekend route anchors with visible claim boundaries and correction path.",
    cityName: "Toronto",
    regionName: "Ontario",
    guideHubPath: "/toronto/guides",
    guideHubLabel: "Toronto Guides",
  },
  vancouver_garden_day_starters: {
    path: "/vancouver/garden-day-starters",
    shortLabel: "Garden day starters",
    breadcrumbName: "Vancouver Garden Day Starters",
    pageTitle: "Vancouver Garden Day Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver garden and conservatory starters with official source notes, route-fit guidance, and a public correction path.",
    itemListName: "Vancouver garden day starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver garden and conservatory anchors with visible claim boundaries and correction path.",
  },
  vancouver_kitsilano_scenic_starters: {
    path: "/vancouver/kitsilano-scenic-starters",
    shortLabel: "Kitsilano scenic starters",
    breadcrumbName: "Vancouver Kitsilano Scenic Starters",
    pageTitle: "Vancouver Kitsilano Scenic Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver west-side scenic starters with official source notes, slower-route guidance, and a public correction path.",
    itemListName: "Vancouver Kitsilano scenic starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver west-side scenic anchors with visible claim boundaries and correction path.",
  },
  vancouver_west_side_daytime_starters: {
    path: "/vancouver/west-side-daytime-starters",
    shortLabel: "West-side daytime starters",
    breadcrumbName: "Vancouver West-Side Daytime Starters",
    pageTitle: "Vancouver West-Side Daytime Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver west-side daytime starters with official source notes, destination-fit guidance, and a public correction path.",
    itemListName: "Vancouver west-side daytime starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver west-side daytime anchors with visible claim boundaries and correction path.",
  },
  vancouver_false_creek_culture_starters: {
    path: "/vancouver/false-creek-culture-starters",
    shortLabel: "False Creek culture starters",
    breadcrumbName: "Vancouver False Creek Culture Starters",
    pageTitle: "Vancouver False Creek Culture Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver False Creek culture starters with official source notes, compact-route guidance, and a public correction path.",
    itemListName: "Vancouver False Creek culture starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver False Creek culture anchors with visible claim boundaries and correction path.",
  },
  vancouver_ubc_discovery_starters: {
    path: "/vancouver/ubc-discovery-starters",
    shortLabel: "UBC discovery starters",
    breadcrumbName: "Vancouver UBC Discovery Starters",
    pageTitle: "Vancouver UBC Discovery Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver UBC discovery starters with official source notes, campus-fit guidance, and a public correction path.",
    itemListName: "Vancouver UBC discovery starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver UBC discovery anchors with visible claim boundaries and correction path.",
  },
  vancouver_returning_visitor_starters: {
    path: "/vancouver/returning-visitor-starters",
    shortLabel: "Returning-visitor starters",
    breadcrumbName: "Vancouver Returning-Visitor Starters",
    pageTitle: "Vancouver Returning-Visitor Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver returning-visitor starting points with official source notes, local-discovery guidance, and a public correction path.",
    itemListName: "Vancouver returning-visitor starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver returning-visitor anchors with visible claim boundaries and correction path.",
  },
  vancouver_out_of_town_guest_starters: {
    path: "/vancouver/out-of-town-guest-starters",
    shortLabel: "Out-of-town guest starters",
    breadcrumbName: "Vancouver Out-Of-Town Guest Starters",
    pageTitle: "Vancouver Out-Of-Town Guest Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver guest-hosting starting points with official source notes, low-friction route guidance, and a public correction path.",
    itemListName: "Vancouver out-of-town guest starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver guest-hosting anchors with visible claim boundaries and correction path.",
  },
  vancouver_weekend_route_starters: {
    path: "/vancouver/weekend-route-starters",
    shortLabel: "Weekend route starters",
    breadcrumbName: "Vancouver Weekend Route Starters",
    pageTitle: "Vancouver Weekend Route Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver weekend route starters with official source notes, route-fit guidance, and a public correction path.",
    itemListName: "Vancouver weekend route starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver weekend route anchors with visible claim boundaries and correction path.",
  },
  vancouver_sunday_starters: {
    path: "/vancouver/sunday-starters",
    shortLabel: "Sunday starters",
    breadcrumbName: "Vancouver Sunday Starters",
    pageTitle: "Vancouver Sunday Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver Sunday starting points with official source notes, low-effort route-fit guidance, and a public correction path.",
    itemListName: "Vancouver Sunday starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver Sunday anchors with visible claim boundaries and correction path.",
  },
  vancouver_wellness_reset_starters: {
    path: "/vancouver/wellness-reset-starters",
    shortLabel: "Wellness reset starters",
    breadcrumbName: "Vancouver Wellness Reset Starters",
    pageTitle: "Vancouver Wellness Reset Starters With Official Source Notes | CityAtlas",
    pageDescription:
      "Five Vancouver wellness reset starting points with official source notes, low-pressure route-fit guidance, and a public correction path.",
    itemListName: "Vancouver wellness reset starters with official source notes",
    itemListDescription:
      "A narrow CityAtlas list of source-backed Vancouver wellness reset anchors with visible claim boundaries and correction path.",
  },
};

export function getSourceBackedCollectionForPath(path: string): SourceBackedCollectionId | null {
  const match = Object.entries(sourceBackedCollectionMeta).find(([, meta]) => meta.path === path);
  return (match?.[0] as SourceBackedCollectionId | undefined) ?? null;
}

export function getSourceBackedPlaces(
  data: CityAtlasData,
  collection: SourceBackedCollectionId,
) {
  return data.sourceBackedPlaces.filter((reference) => reference.collection === collection);
}

export function getSourceBackedCollectionGuideHubPath(collection: SourceBackedCollectionId) {
  return sourceBackedCollectionMeta[collection].guideHubPath ?? `/${siteConfig.citySlug}/guides`;
}

export function getSourceBackedCollectionGuideHubLabel(collection: SourceBackedCollectionId) {
  return sourceBackedCollectionMeta[collection].guideHubLabel ?? `${siteConfig.city} Guides`;
}

export function getSourceBackedCollectionCityName(collection: SourceBackedCollectionId) {
  return sourceBackedCollectionMeta[collection].cityName ?? siteConfig.city;
}

export function getSourceBackedCollectionRegionName(collection: SourceBackedCollectionId) {
  return sourceBackedCollectionMeta[collection].regionName ?? "British Columbia";
}

export function getSourceBackedCollectionForGuide(guide: Guide): SourceBackedCollectionId | null {
  if (guide.sourceBackedCollection) {
    return guide.sourceBackedCollection;
  }

  const haystack = [
    guide.id,
    guide.title,
    guide.slug,
    guide.queryClass,
    guide.cluster,
    guide.category,
  ]
    .join(" ")
    .toLowerCase();

  if (haystack.includes("date night")) {
    return "vancouver_date_night_starters";
  }

  if (haystack.includes("first time visitor")) {
    return guide.citySlug === "toronto"
      ? "toronto_first_time_visitor_starters"
      : "vancouver_first_time_visitor_starters";
  }

  if (
    haystack.includes("garden and conservatory") ||
    haystack.includes("garden day") ||
    (haystack.includes("garden") && haystack.includes("conservatory"))
  ) {
    return "vancouver_garden_day_starters";
  }

  if (haystack.includes("kitsilano scenic")) {
    return "vancouver_kitsilano_scenic_starters";
  }

  if (
    haystack.includes("west side daytime") ||
    haystack.includes("west-side daytime") ||
    (haystack.includes("west-side") && haystack.includes("daytime"))
  ) {
    return "vancouver_west_side_daytime_starters";
  }

  if (
    haystack.includes("false creek culture") ||
    (haystack.includes("false creek") && haystack.includes("culture"))
  ) {
    return "vancouver_false_creek_culture_starters";
  }

  if (haystack.includes("ubc discovery") || (haystack.includes("ubc") && haystack.includes("discovery"))) {
    return "vancouver_ubc_discovery_starters";
  }

  if (haystack.includes("returning visitor")) {
    return "vancouver_returning_visitor_starters";
  }

  if (haystack.includes("out of town guest")) {
    return "vancouver_out_of_town_guest_starters";
  }

  if (haystack.includes("weekend route")) {
    return guide.citySlug === "toronto"
      ? "toronto_weekend_route_starters"
      : "vancouver_weekend_route_starters";
  }

  if (haystack.includes("sunday")) {
    return "vancouver_sunday_starters";
  }

  if (haystack.includes("first evening")) {
    return "vancouver_first_evening_starters";
  }

  if (haystack.includes("wellness")) {
    return "vancouver_wellness_reset_starters";
  }

  if (haystack.includes("rainy")) {
    return "vancouver_rainy_day_starters";
  }

  return null;
}
