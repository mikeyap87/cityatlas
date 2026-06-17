import { siteConfig } from "../config/site.ts";
import type { Guide } from "../types";

const defaultRegionName = "British Columbia";

export function getGuideCitySlug(guide: Guide) {
  return guide.citySlug ?? siteConfig.citySlug;
}

export function getGuideCityName(guide: Guide) {
  return guide.cityName ?? siteConfig.city;
}

export function getGuideRegionName(guide: Guide) {
  return guide.regionName ?? defaultRegionName;
}

export function getGuideHubPathForCity(citySlug: string) {
  return `/${citySlug}/guides`;
}

export function getGuideHubPath(guide: Guide) {
  return getGuideHubPathForCity(getGuideCitySlug(guide));
}

export function getGuidePath(guide: Guide) {
  return `${getGuideHubPath(guide)}/${guide.slug}`;
}

export function parseGuidePath(path: string) {
  const match = path.match(/^\/([^/]+)\/guides\/([^/]+)$/);
  if (!match) {
    return null;
  }

  return {
    citySlug: match[1],
    slug: match[2],
  };
}

export function parseGuideHubPath(path: string) {
  const match = path.match(/^\/([^/]+)\/guides$/);
  if (!match) {
    return null;
  }

  return {
    citySlug: match[1],
  };
}
