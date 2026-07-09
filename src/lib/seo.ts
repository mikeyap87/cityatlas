import { siteConfig } from "../config/site";
import type { CityAtlasData } from "../types";
import {
  getSourceBackedCollectionForPath,
  sourceBackedCollectionMeta,
} from "./sourceBackedCollections";
import { parseGuidePath } from "./cityPaths";

interface RouteMetaOptions {
  adminVisible?: boolean;
  privatePreviewVisible?: boolean;
}

interface BaseUrlInput {
  publicBaseUrl?: string;
  runtimeOrigin?: string;
  hostname?: string;
}

export function resolveBaseUrl(input: BaseUrlInput) {
  if (input.publicBaseUrl?.trim()) {
    return input.publicBaseUrl.trim();
  }

  if (input.runtimeOrigin?.trim()) {
    return input.runtimeOrigin.trim();
  }

  if (input.hostname && !["127.0.0.1", "localhost", "::1"].includes(input.hostname)) {
    return `https://${input.hostname}`;
  }

  return siteConfig.localUrl.replace(/\/$/, "");
}

export function getRobotsDirectives(path: string) {
  if (
    path.startsWith("/admin") ||
    path.startsWith("/private-preview") ||
    path === "/planner" ||
    path === "/for-businesses/submit"
  ) {
    return "noindex, nofollow";
  }

  return "index, follow";
}

export function getRouteMeta(
  path: string,
  data: CityAtlasData,
  options: RouteMetaOptions = {},
) {
  if (path === "/") {
    return {
      title: "CityAtlas | Find the right part of Vancouver first",
      description:
        "Open the right Vancouver guide first for date night, first visits, rainy days, weekend plans, and hosted guest plans.",
      imagePath: siteConfig.media.hero,
      type: "website" as const,
    };
  }

  if (path === "/for-businesses/pricing") {
    return {
      title: "CityAtlas business pricing | Vancouver partner packages",
      description:
        "Choose the right CityAtlas package, start a business request, or book a short call for a Vancouver business.",
      imagePath: siteConfig.media.business,
      type: "website" as const,
    };
  }

  if (path === "/for-businesses/book-call") {
    return {
      title: "Book a short CityAtlas call",
      description:
        "Request a short CityAtlas call and share the business context, preferred timing, and package interest in one clean handoff.",
      imagePath: siteConfig.media.business,
      type: "website" as const,
    };
  }

  if (path === "/for-businesses/partner-preview") {
    return {
      title: "How CityAtlas business features work",
      description:
        "See how CityAtlas business features start, when an in-person visit helps, and what the paid options look like.",
      imagePath: siteConfig.media.business,
      type: "website" as const,
    };
  }

  if (path === "/terms") {
    return {
      title: "CityAtlas terms",
      description:
        "Review the public CityAtlas terms, business-request boundaries, and limited paid checkout handoff truth.",
      type: "website" as const,
    };
  }

  if (path === "/privacy") {
    return {
      title: "CityAtlas privacy",
      description:
        "See what CityAtlas stores locally, what requires consent, and what outside tools are not active yet.",
      type: "website" as const,
    };
  }

  if (path === "/admin" && options.adminVisible) {
    return {
      title: "CityAtlas operator console",
      description:
        "Protected local owner console for queue cleanup, outreach rehearsal, and launch readiness notes.",
      type: "website" as const,
    };
  }

  if (path === "/private-preview/date-night" && options.privatePreviewVisible) {
    return {
      title: "CityAtlas private preview",
      description: "Protected CityAtlas founder preview page.",
      type: "website" as const,
    };
  }

  const collection = getSourceBackedCollectionForPath(path);
  if (collection) {
    const meta = sourceBackedCollectionMeta[collection];
    return {
      title: meta.pageTitle,
      description: meta.pageDescription,
      imagePath: siteConfig.media.guides,
      type: "website" as const,
    };
  }

  const guidePath = parseGuidePath(path);
  if (guidePath) {
    const guide = data.guides.find(
      (entry) => (entry.citySlug ?? siteConfig.citySlug) === guidePath.citySlug && entry.slug === guidePath.slug,
    );

    if (guide) {
      return {
        title: `${guide.title} | CityAtlas`,
        description: guide.summary,
        imagePath: guide.image || siteConfig.media.guides,
        type: "article" as const,
      };
    }
  }

  if (path === `/${siteConfig.citySlug}`) {
    return {
      title: `${siteConfig.city} | CityAtlas`,
      description:
        "Find the right Vancouver start first with route-first local guides, officially checked place lists, and compact planning help.",
      imagePath: siteConfig.media.city,
      type: "website" as const,
    };
  }

  return {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: "CityAtlas helps locals and visitors open the right city guide first.",
    imagePath: siteConfig.media.hero,
    type: "website" as const,
  };
}

export function buildJsonLd(
  path: string,
  data: CityAtlasData,
  baseUrl: string,
  options: RouteMetaOptions = {},
) {
  const meta = getRouteMeta(path, data, options);
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const url = `${normalizedBaseUrl}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": meta.type === "article" ? "Article" : "WebPage",
    name: meta.title,
    description: meta.description,
    url,
    ...(meta.type === "article"
      ? {
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
          },
        }
      : {
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: normalizedBaseUrl,
          },
        }),
  };
}
