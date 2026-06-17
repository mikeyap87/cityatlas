import type { CityAtlasData, Guide } from "../types";
import { siteConfig } from "../config/site.ts";
import {
  getGuideCityName,
  getGuideHubPath,
  getGuidePath,
  getGuideRegionName,
  parseGuideHubPath,
  parseGuidePath,
} from "./cityPaths.ts";
import {
  getSourceBackedCollectionCityName,
  getSourceBackedCollectionForPath,
  getSourceBackedCollectionGuideHubLabel,
  getSourceBackedCollectionGuideHubPath,
  getSourceBackedCollectionRegionName,
  getSourceBackedPlaces,
  sourceBackedCollectionMeta,
} from "./sourceBackedCollections.ts";

export interface RouteMeta {
  title: string;
  description: string;
  type: "website" | "article";
}

export interface RouteMetaOptions {
  adminVisible?: boolean;
  privatePreviewVisible?: boolean;
}

export function resolveBaseUrl(options?: {
  publicBaseUrl?: string;
  runtimeOrigin?: string;
  hostname?: string;
}) {
  if (options?.publicBaseUrl) {
    return options.publicBaseUrl;
  }
  if (options?.runtimeOrigin && options.hostname && !["localhost", "127.0.0.1", "::1"].includes(options.hostname)) {
    return options.runtimeOrigin;
  }
  return siteConfig.localUrl;
}

export function getRobotsDirectives(path: string) {
  if (
    path === "/admin" ||
    path.startsWith("/private-preview") ||
    path === "/planner" ||
    path === "/for-businesses/submit" ||
    path === "/vancouver/events" ||
    path === "/vancouver/offers" ||
    path.startsWith("/vancouver/businesses/")
  ) {
    return "noindex,nofollow";
  }
  return "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
}

export function findGuideForPath(path: string, data: CityAtlasData) {
  const parsed = parseGuidePath(path);
  if (!parsed) return undefined;
  return data.guides.find(
    (guide) =>
      guide.slug === parsed.slug &&
      (guide.citySlug ?? siteConfig.citySlug) === parsed.citySlug,
  );
}

function getGuideHubMeta(path: string, data: CityAtlasData) {
  const parsed = parseGuideHubPath(path);
  if (!parsed || parsed.citySlug === siteConfig.citySlug) {
    return null;
  }

  const cityGuides = data.guides.filter(
    (guide) => (guide.citySlug ?? siteConfig.citySlug) === parsed.citySlug,
  );
  if (cityGuides.length === 0) {
    return null;
  }

  const cityName = cityGuides[0]?.cityName ?? parsed.citySlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    citySlug: parsed.citySlug,
    cityName,
    guides: cityGuides,
  };
}

export function getRouteMeta(
  path: string,
  data: CityAtlasData,
  options: RouteMetaOptions = {},
): RouteMeta {
  const guide = findGuideForPath(path, data);
  const sourceBackedCollection = getSourceBackedCollectionForPath(path);
  const guideHubMeta = getGuideHubMeta(path, data);
  if (guide) {
    return {
      title: `${guide.title} | CityAtlas`,
      description: guide.summary,
      type: "article",
    };
  }
  if (path === "/for-businesses/pricing") {
    return {
      title: "Vancouver Business Visibility Packages | CityAtlas",
      description:
        "CityAtlas packages for Vancouver businesses that want guide placement, mission sponsorship angles, and trust-first local visibility. Billing opens after review and scope confirmation.",
      type: "website",
    };
  }
  if (path === "/about") {
    return {
      title: "About CityAtlas | Vancouver Local Discovery",
      description:
        "Learn what CityAtlas is: a Vancouver-first city guide, route planner, and trust-first local discovery system for locals, visitors, and neighborhood businesses.",
      type: "website",
    };
  }
  if (path === "/editorial-standards") {
    return {
      title: "Editorial Standards And Corrections | CityAtlas",
      description:
        "How CityAtlas checks official sources, limits public claims, and handles correction or removal requests for source-backed Vancouver pages.",
      type: "website",
    };
  }
  if (path === "/for-businesses/submit") {
    return {
      title: "Submit A Business For Review | CityAtlas",
      description:
        "Submit a Vancouver business for review. Requests from this form are stored on the current device only.",
      type: "website",
    };
  }
  if (path === "/admin") {
    if (options.adminVisible) {
      return {
        title: "CityAtlas Launch Readiness | Local Admin",
        description:
          "Local-only CityAtlas owner console for launch gates, review-queue checks, founder pipeline review, and proof-sprint tracking.",
        type: "website",
      };
    }
    return {
      title: "CityAtlas Protected Operations Route",
      description:
        "Protected CityAtlas operations route for private review data and workflow checks.",
      type: "website",
    };
  }
  if (path === "/terms") {
    return {
      title: "Terms | CityAtlas",
      description:
        "Current CityAtlas terms for the public site, business review requests, and future service packages.",
      type: "website",
    };
  }
  if (path === "/privacy") {
    return {
      title: "Privacy | CityAtlas",
      description:
        "CityAtlas privacy and data posture for the public site, future integrations, business data, analytics, and payment readiness.",
      type: "website",
    };
  }
  if (path === "/private-preview/date-night") {
    if (options.privatePreviewVisible) {
      return {
        title: "Vancouver Date Night Route Preview | CityAtlas",
        description:
          "Local-only CityAtlas private preview for the Vancouver Date Night founder review route and proof-sprint conversation flow.",
        type: "website",
      };
    }
    return {
      title: "Protected Date Night Route | CityAtlas",
      description:
        "Protected Vancouver date-night route for private CityAtlas review.",
      type: "website",
    };
  }
  if (path === "/planner") {
    return {
      title: "CityAtlas Planner",
      description:
        "Save places, events, and guides into a Vancouver itinerary stored on the current device.",
      type: "website",
    };
  }
  if (path === "/vancouver/missions") {
    return {
      title: "Vancouver City Missions And Route Planner | CityAtlas",
      description:
        "Saveable Vancouver mission routes that turn CityAtlas guides, source-backed starters, and planner actions into reusable city plans.",
      type: "website",
    };
  }
  if (sourceBackedCollection) {
    const meta = sourceBackedCollectionMeta[sourceBackedCollection];
    return {
      title: meta.pageTitle,
      description: meta.pageDescription,
      type: "website",
    };
  }
  if (path === "/vancouver/guides") {
    return {
      title: "Vancouver Guides | CityAtlas",
      description:
        "Answer-first Vancouver guides and neighborhood starter pages for date nights, rainy-day plans, weekend routes, wellness resets, visitor choices, garden days, guest-hosting plans, and destination discovery.",
      type: "website",
    };
  }
  if (guideHubMeta) {
    return {
      title: `${guideHubMeta.cityName} Guides | CityAtlas`,
      description:
        `Answer-first ${guideHubMeta.cityName} starter guides and official-source route pages for visitors who need one clear place to begin instead of a generic city roundup.`,
      type: "website",
    };
  }
  if (path === "/vancouver/events") {
    return {
      title: "Vancouver Events | CityAtlas",
      description:
        "Vancouver event page formats inside CityAtlas with clear host and source checks.",
      type: "website",
    };
  }
  if (path === "/vancouver/offers") {
    return {
      title: "Vancouver Offers | CityAtlas",
      description:
        "Vancouver partner perk formats inside CityAtlas with clear redemption boundaries.",
      type: "website",
    };
  }
  if (path === "/vancouver") {
    return {
      title: "Explore Vancouver | CityAtlas",
      description:
        "Browse Vancouver through answer-first guides, neighborhood starters, source-backed route layers, missions, and trust-first local planning surfaces.",
      type: "website",
    };
  }
  return {
    title: "CityAtlas | Vancouver Guides, Routes, And Local Discovery",
    description:
      "CityAtlas is a Vancouver-first guide, route planner, and local discovery platform with answer-first city pages, neighborhood guides, and business visibility paths.",
    type: "website",
  };
}

function buildGuideJsonLd(baseUrl: string, guide: Guide) {
  const cityName = getGuideCityName(guide);
  const regionName = getGuideRegionName(guide);
  const guidePath = getGuidePath(guide);
  return {
    "@type": "BlogPosting",
    "@id": `${baseUrl}${guidePath}#article`,
    headline: guide.title,
    description: guide.summary,
    image: `${baseUrl}${guide.image}`,
    dateModified: guide.updatedAt,
    datePublished: guide.publishedAt ?? guide.createdAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    about: [
      {
        "@type": "Place",
        name: `${cityName}, ${regionName}`,
      },
      {
        "@type": "Thing",
        name: guide.category,
      },
    ],
    articleSection: guide.category,
    mainEntityOfPage: `${baseUrl}${guidePath}`,
  };
}

function buildGuideFaqJsonLd(baseUrl: string, guide: Guide) {
  const guidePath = getGuidePath(guide);
  return {
    "@type": "FAQPage",
    "@id": `${baseUrl}${guidePath}#faq`,
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export const featuredCityHubPaths = [
  "/vancouver/guides",
  "/vancouver/missions",
  "/vancouver/date-night-starters",
  "/vancouver/rainy-day-starters",
  "/vancouver/first-evening-starters",
  "/vancouver/first-time-visitor-starters",
  "/vancouver/returning-visitor-starters",
  "/vancouver/out-of-town-guest-starters",
  "/vancouver/weekend-route-starters",
  "/vancouver/sunday-starters",
  "/vancouver/wellness-reset-starters",
  "/vancouver/kitsilano-scenic-starters",
  "/vancouver/west-side-daytime-starters",
  "/vancouver/false-creek-culture-starters",
  "/vancouver/ubc-discovery-starters",
  "/vancouver/garden-day-starters",
  "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
  "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
  "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
] as const;

function buildCityHubItems(baseUrl: string, data: CityAtlasData) {
  return featuredCityHubPaths.map((path, index) => {
    const meta = getRouteMeta(path, data);
    return {
      "@type": "ListItem",
      position: index + 1,
      name: meta.title.replace(" | CityAtlas", ""),
      url: `${baseUrl}${path}`,
      description: meta.description,
    };
  });
}

export const featuredGuideHubSlugs = [
  "vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
  "cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
  "which-low-friction-vancouver-route-should-you-open-today",
  "where-should-a-first-time-vancouver-visitor-start",
  "vancouver-local-discovery-for-returning-visitors",
  "how-to-host-an-out-of-town-guest-in-vancouver",
  "how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
  "how-to-build-a-low-effort-vancouver-sunday-plan",
  "vancouver-wellness-experiences-to-review",
  "how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
  "kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
  "where-should-you-start-a-west-side-vancouver-daytime-plan",
  "where-should-you-start-a-false-creek-vancouver-culture-afternoon",
  "where-should-you-start-a-ubc-adjacent-vancouver-discovery-day",
  "where-should-you-start-a-vancouver-garden-and-conservatory-day",
] as const;

function buildGuideHubItems(baseUrl: string, data: CityAtlasData) {
  return featuredGuideHubSlugs
    .map((slug) => data.guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is Guide => Boolean(guide))
    .map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: `${baseUrl}${getGuidePath(guide)}`,
      description: guide.summary,
    }));
}

function buildCitySpecificGuideHubItems(baseUrl: string, guides: Guide[]) {
  return guides.map((guide, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: guide.title,
    url: `${baseUrl}${getGuidePath(guide)}`,
    description: guide.summary,
  }));
}

function buildMissionItems(baseUrl: string, data: CityAtlasData) {
  return data.cityMissions.map((mission, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: mission.title,
    url: `${baseUrl}/vancouver/missions#mission-${mission.id}`,
    description: mission.routeSummary,
  }));
}

const pricingFaqEntries = [
  {
    question: "What happens before a business is ever charged?",
    answer:
      "CityAtlas starts with a review request and opens billing only after terms, refund policy, and clear business demand are in place.",
  },
  {
    question: "When should a business request review now?",
    answer:
      "A business should request review when it already knows it needs better guide placement, neighborhood visibility, offer packaging, or a clearer city-facing story and wants a careful review-first first step.",
  },
  {
    question: "What does CityAtlas mean by local visibility?",
    answer:
      "CityAtlas means clearer guide placement, stronger route fit, source-backed starter context, mission sponsorship angles, and better city-facing presentation, not traffic guarantees or automatic publication.",
  },
];

export function buildJsonLd(
  path: string,
  data: CityAtlasData,
  baseUrlInput?: string,
  metaOptions?: RouteMetaOptions,
) {
  const baseUrl = (baseUrlInput ?? resolveBaseUrl()).replace(/\/$/, "");
  const meta = getRouteMeta(path, data, metaOptions);
  const guide = findGuideForPath(path, data);
  const sourceBackedCollection = getSourceBackedCollectionForPath(path);
  const sourceBackedPlaces = sourceBackedCollection
    ? getSourceBackedPlaces(data, sourceBackedCollection)
    : [];
  const guideHubMeta = getGuideHubMeta(path, data);
  const vancouverGuideCount = data.guides.filter(
    (entry) => (entry.citySlug ?? siteConfig.citySlug) === siteConfig.citySlug,
  ).length;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: siteConfig.name,
      url: baseUrl,
      slogan: siteConfig.tagline,
      description:
        "A Vancouver-first guide, route planner, and local discovery platform with public route logic and careful source-backed expansion.",
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: siteConfig.name,
      description: meta.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/vancouver?query={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      "@id": `${baseUrl}/vancouver#planning-library`,
      name: "CityAtlas Vancouver planning library",
      description:
        "Guide, route, and discovery pages that help readers plan Vancouver more clearly.",
      numberOfItems: vancouverGuideCount + data.cityMissions.length,
    },
    {
      "@type": "ItemList",
      "@id": `${baseUrl}/vancouver/missions#city-missions`,
      name: "CityAtlas Vancouver city missions",
      description:
        "Saveable route loops that turn CityAtlas guides and starter pages into reusable Vancouver plans.",
      numberOfItems: data.cityMissions.length,
    },
  ];

  if (path === "/vancouver") {
    const cityHubItems = buildCityHubItems(baseUrl, data);
    graph.push(
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/vancouver#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CityAtlas",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Explore Vancouver",
            item: `${baseUrl}/vancouver`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/vancouver#collection-page`,
        url: `${baseUrl}/vancouver`,
        name: "Explore Vancouver | CityAtlas",
        description: meta.description,
        about: {
          "@type": "Place",
          name: `${siteConfig.city}, British Columbia`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/vancouver#featured-surfaces`,
        name: "Featured CityAtlas Vancouver planning surfaces",
        description:
          "The strongest public CityAtlas planning surfaces for Vancouver route, visitor, weather, and source-backed discovery intent.",
        numberOfItems: cityHubItems.length,
        itemListElement: cityHubItems,
      },
    );
  }

  if (path === "/vancouver/guides") {
    const guideHubItems = buildGuideHubItems(baseUrl, data);
    graph.push(
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/vancouver/guides#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CityAtlas",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Explore Vancouver",
            item: `${baseUrl}/vancouver`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Vancouver Guides",
            item: `${baseUrl}/vancouver/guides`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/vancouver/guides#collection-page`,
        url: `${baseUrl}/vancouver/guides`,
        name: "Vancouver Guides | CityAtlas",
        description: meta.description,
        about: {
          "@type": "Place",
          name: `${siteConfig.city}, British Columbia`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/vancouver/guides#featured-guides`,
        name: "Featured Vancouver guide clusters and answer-first routes",
        description:
          "The strongest answer-first CityAtlas guide routes for visitor choice, weekend planning, neighborhood discovery, and source-backed handoff.",
        numberOfItems: guideHubItems.length,
        itemListElement: guideHubItems,
      },
    );
  }

  if (guideHubMeta) {
    const guideHubItems = buildCitySpecificGuideHubItems(baseUrl, guideHubMeta.guides);
    graph.push(
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${path}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CityAtlas",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `${guideHubMeta.cityName} Guides`,
            item: `${baseUrl}${path}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}${path}#collection-page`,
        url: `${baseUrl}${path}`,
        name: `${guideHubMeta.cityName} Guides`,
        description: meta.description,
        about: {
          "@type": "Place",
          name: guideHubMeta.cityName,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}${path}#list`,
        name: `${guideHubMeta.cityName} guide pilot`,
        description:
          `The current CityAtlas ${guideHubMeta.cityName} pilot guide set for first-visit routing and official-source starter handoff.`,
        numberOfItems: guideHubItems.length,
        itemListElement: guideHubItems,
      },
    );
  }

  if (path === "/vancouver/missions") {
    const missionItems = buildMissionItems(baseUrl, data);
    graph.push(
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/vancouver/missions#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CityAtlas",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Explore Vancouver",
            item: `${baseUrl}/vancouver`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Vancouver City Missions",
            item: `${baseUrl}/vancouver/missions`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/vancouver/missions#collection-page`,
        url: `${baseUrl}/vancouver/missions`,
        name: "Vancouver City Missions And Route Planner",
        description: meta.description,
        about: {
          "@type": "Place",
          name: `${siteConfig.city}, British Columbia`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/vancouver/missions#list`,
        name: "CityAtlas Vancouver city missions",
        description:
          "Saveable Vancouver route plans that turn guide logic, starter pages, and planner actions into reusable CityAtlas missions.",
        numberOfItems: missionItems.length,
        itemListElement: missionItems,
      },
    );
  }

  if (path === "/for-businesses/pricing") {
    graph.push(
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/for-businesses/pricing#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CityAtlas",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Vancouver Business Visibility Packages",
            item: `${baseUrl}/for-businesses/pricing`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/for-businesses/pricing#collection-page`,
        url: `${baseUrl}/for-businesses/pricing`,
        name: "Vancouver Business Visibility Packages",
        description: meta.description,
        about: {
          "@type": "Thing",
          name: "Vancouver local business visibility",
        },
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/for-businesses/pricing#packages`,
        name: "CityAtlas partner package options",
        description:
          "CityAtlas package options for Vancouver businesses that want guide placement, mission sponsorship angles, and trust-first city visibility.",
        numberOfItems: data.packages.length,
        itemListElement: data.packages.map((plan, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: plan.name,
          url: `${baseUrl}/for-businesses/pricing#package-${plan.id}`,
          description: `${plan.description} Best first fit: ${plan.bestFor}.`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/for-businesses/pricing#faq`,
        mainEntity: pricingFaqEntries.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.answer,
          },
        })),
      },
    );
  }

  if (guide) {
    const guidePath = getGuidePath(guide);
    const guideHubPath = getGuideHubPath(guide);
    const cityName = getGuideCityName(guide);
    graph.push(
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${guidePath}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CityAtlas",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `${cityName} Guides`,
            item: `${baseUrl}${guideHubPath}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: `${baseUrl}${guidePath}`,
          },
        ],
      },
      buildGuideJsonLd(baseUrl, guide),
      buildGuideFaqJsonLd(baseUrl, guide),
    );
  }

  if (sourceBackedCollection && sourceBackedPlaces.length > 0) {
    const collectionMeta = sourceBackedCollectionMeta[sourceBackedCollection];
    const cityName = getSourceBackedCollectionCityName(sourceBackedCollection);
    const regionName = getSourceBackedCollectionRegionName(sourceBackedCollection);
    const guideHubPath = getSourceBackedCollectionGuideHubPath(sourceBackedCollection);
    const guideHubLabel = getSourceBackedCollectionGuideHubLabel(sourceBackedCollection);
    graph.push(
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${collectionMeta.path}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CityAtlas",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: guideHubLabel,
            item: `${baseUrl}${guideHubPath}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: collectionMeta.breadcrumbName,
            item: `${baseUrl}${collectionMeta.path}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}${collectionMeta.path}#collection-page`,
        url: `${baseUrl}${collectionMeta.path}`,
        name: collectionMeta.pageTitle.replace(" | CityAtlas", ""),
        description: collectionMeta.pageDescription,
        about: {
          "@type": "Place",
          name: `${cityName}, ${regionName}`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}${collectionMeta.path}#list`,
        name: collectionMeta.itemListName,
        description: collectionMeta.itemListDescription,
        numberOfItems: sourceBackedPlaces.length,
        itemListElement: sourceBackedPlaces.map((reference, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: reference.name,
          url: reference.officialSourceUrl,
        })),
      },
    );
  }

  if (path === "/editorial-standards") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/editorial-standards#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "CityAtlas",
          item: `${baseUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Editorial Standards",
          item: `${baseUrl}/editorial-standards`,
        },
      ],
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
