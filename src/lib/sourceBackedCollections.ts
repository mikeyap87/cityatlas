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

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (match) => match.toUpperCase());
}

function buildCollectionMeta(input: {
  path: string;
  shortLabel: string;
  pageDescription: string;
  itemListDescription: string;
  cityName?: string;
  regionName?: string;
  guideHubPath?: string;
  guideHubLabel?: string;
}): SourceBackedCollectionMeta {
  const cityName = input.cityName ?? siteConfig.city;
  const label = input.shortLabel.replace(/-/g, " ");

  return {
    path: input.path,
    shortLabel: input.shortLabel,
    breadcrumbName: `${cityName} ${toTitleCase(label)}`,
    pageTitle: `${cityName} ${toTitleCase(label)} With Official Site Links | CityAtlas`,
    pageDescription: input.pageDescription,
    itemListName: `${cityName} ${label} with official site links`,
    itemListDescription: input.itemListDescription,
    cityName: input.cityName,
    regionName: input.regionName,
    guideHubPath: input.guideHubPath,
    guideHubLabel: input.guideHubLabel,
  };
}

export const sourceBackedCollectionMeta: Record<
  SourceBackedCollectionId,
  SourceBackedCollectionMeta
> = {
  vancouver_date_night_starters: buildCollectionMeta({
    path: "/vancouver/date-night-starters",
    shortLabel: "Date night starting points",
    pageDescription:
      "Five real Vancouver date-night starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver date-night places with official site links and simple planning notes.",
  }),
  vancouver_rainy_day_starters: buildCollectionMeta({
    path: "/vancouver/rainy-day-starters",
    shortLabel: "Rainy day starting points",
    pageDescription:
      "Five real Vancouver rainy-day starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver rainy-day places with official site links and simple planning notes.",
  }),
  vancouver_first_evening_starters: buildCollectionMeta({
    path: "/vancouver/first-evening-starters",
    shortLabel: "First evening starting points",
    pageDescription:
      "Five real Vancouver first-evening starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver first-evening places with official site links and simple planning notes.",
  }),
  vancouver_first_time_visitor_starters: buildCollectionMeta({
    path: "/vancouver/first-time-visitor-starters",
    shortLabel: "First-time visitor starting points",
    pageDescription:
      "Five real Vancouver first-time visitor starting areas with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver first-visit areas with official site links and simple planning notes.",
  }),
  toronto_first_time_visitor_starters: buildCollectionMeta({
    path: "/toronto/first-time-visitor-starters",
    shortLabel: "First-time visitor starting points",
    pageDescription:
      "Five real Toronto first-time visitor starting areas with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Toronto first-visit areas with official site links and simple planning notes.",
    cityName: "Toronto",
    regionName: "Ontario",
    guideHubPath: "/toronto/guides",
    guideHubLabel: "Toronto Guides",
  }),
  toronto_weekend_route_starters: buildCollectionMeta({
    path: "/toronto/weekend-route-starters",
    shortLabel: "Weekend starting points",
    pageDescription:
      "Five real Toronto weekend starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Toronto weekend places with official site links and simple planning notes.",
    cityName: "Toronto",
    regionName: "Ontario",
    guideHubPath: "/toronto/guides",
    guideHubLabel: "Toronto Guides",
  }),
  vancouver_garden_day_starters: buildCollectionMeta({
    path: "/vancouver/garden-day-starters",
    shortLabel: "Garden day starting points",
    pageDescription:
      "Five real Vancouver garden-day starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver garden and conservatory places with official site links and simple planning notes.",
  }),
  vancouver_kitsilano_scenic_starters: buildCollectionMeta({
    path: "/vancouver/kitsilano-scenic-starters",
    shortLabel: "Kitsilano scenic starting points",
    pageDescription:
      "Five real Vancouver west-side scenic starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver west-side scenic places with official site links and simple planning notes.",
  }),
  vancouver_west_side_daytime_starters: buildCollectionMeta({
    path: "/vancouver/west-side-daytime-starters",
    shortLabel: "West-side daytime starting points",
    pageDescription:
      "Five real Vancouver west-side daytime starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver west-side daytime places with official site links and simple planning notes.",
  }),
  vancouver_false_creek_culture_starters: buildCollectionMeta({
    path: "/vancouver/false-creek-culture-starters",
    shortLabel: "False Creek culture starting points",
    pageDescription:
      "Five real Vancouver False Creek culture starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver False Creek culture places with official site links and simple planning notes.",
  }),
  vancouver_ubc_discovery_starters: buildCollectionMeta({
    path: "/vancouver/ubc-discovery-starters",
    shortLabel: "UBC discovery starting points",
    pageDescription:
      "Five real Vancouver UBC discovery starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver UBC-side places with official site links and simple planning notes.",
  }),
  vancouver_returning_visitor_starters: buildCollectionMeta({
    path: "/vancouver/returning-visitor-starters",
    shortLabel: "Returning-visitor starting points",
    pageDescription:
      "Five real Vancouver returning-visitor starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver second-look places with official site links and simple planning notes.",
  }),
  vancouver_out_of_town_guest_starters: buildCollectionMeta({
    path: "/vancouver/out-of-town-guest-starters",
    shortLabel: "Out-of-town guest starting points",
    pageDescription:
      "Five real Vancouver guest-hosting starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver guest-friendly places with official site links and simple planning notes.",
  }),
  vancouver_weekend_route_starters: buildCollectionMeta({
    path: "/vancouver/weekend-route-starters",
    shortLabel: "Weekend route starting points",
    pageDescription:
      "Five real Vancouver weekend-route starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver weekend places with official site links and simple planning notes.",
  }),
  vancouver_sunday_starters: buildCollectionMeta({
    path: "/vancouver/sunday-starters",
    shortLabel: "Sunday starting points",
    pageDescription:
      "Five real Vancouver Sunday starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver Sunday places with official site links and simple planning notes.",
  }),
  vancouver_wellness_reset_starters: buildCollectionMeta({
    path: "/vancouver/wellness-reset-starters",
    shortLabel: "Wellness reset starting points",
    pageDescription:
      "Five real Vancouver wellness-reset starting points with official site links, simple planning notes, and a public way to report a mistake.",
    itemListDescription:
      "A short CityAtlas list of real Vancouver reset places with official site links and simple planning notes.",
  }),
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
