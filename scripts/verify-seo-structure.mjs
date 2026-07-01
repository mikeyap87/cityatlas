import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { seedData } from "../src/data/seed.ts";
import {
  buildJsonLd,
  featuredCityHubPaths,
  featuredGuideHubSlugs,
  getRobotsDirectives,
  getRouteMeta,
  resolveBaseUrl,
} from "../src/lib/seo.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const baseUrl = resolveBaseUrl().replace(/\/$/, "");

const guideChecks = [
  {
    path: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
    label: "First-time visitor guide",
  },
  {
    path: "/vancouver/guides/vancouver-wellness-experiences-to-review",
    label: "Wellness guide",
  },
  {
    path: "/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver",
    label: "Out-of-town guest guide",
  },
  {
    path: "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
    label: "Weekend-route guide",
  },
  {
    path: "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
    label: "Sunday guide",
  },
  {
    path: "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
    label: "Returning-visitor guide",
  },
  {
    path: "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
    label: "Kitsilano scenic guide",
  },
  {
    path: "/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan",
    label: "West-side daytime guide",
  },
  {
    path: "/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon",
    label: "False Creek culture guide",
  },
  {
    path: "/vancouver/guides/where-should-you-start-a-ubc-adjacent-vancouver-discovery-day",
    label: "UBC discovery guide",
  },
  {
    path: "/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day",
    label: "Garden-day guide",
  },
  {
    path: "/toronto/guides/where-should-a-first-time-toronto-visitor-start",
    label: "Toronto first-time visitor guide",
  },
  {
    path: "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
    label: "Toronto weekend-route guide",
  },
].map((route) => ({
  ...route,
  requiredTypes: ["BreadcrumbList", "BlogPosting", "FAQPage"],
  expectedRobots: "index",
  minFaqQuestions: 2,
}));

const sourceBackedChecks = [
  {
    path: "/vancouver/first-time-visitor-starters",
    label: "First-time visitor source-backed page",
  },
  {
    path: "/vancouver/wellness-reset-starters",
    label: "Wellness source-backed page",
  },
  {
    path: "/vancouver/out-of-town-guest-starters",
    label: "Out-of-town guest source-backed page",
  },
  {
    path: "/vancouver/weekend-route-starters",
    label: "Weekend-route source-backed page",
  },
  {
    path: "/vancouver/sunday-starters",
    label: "Sunday source-backed page",
  },
  {
    path: "/vancouver/returning-visitor-starters",
    label: "Returning-visitor source-backed page",
  },
  {
    path: "/vancouver/kitsilano-scenic-starters",
    label: "Kitsilano scenic source-backed page",
  },
  {
    path: "/vancouver/west-side-daytime-starters",
    label: "West-side daytime source-backed page",
  },
  {
    path: "/vancouver/false-creek-culture-starters",
    label: "False Creek culture source-backed page",
  },
  {
    path: "/vancouver/ubc-discovery-starters",
    label: "UBC discovery source-backed page",
  },
  {
    path: "/vancouver/garden-day-starters",
    label: "Garden-day source-backed page",
  },
  {
    path: "/toronto/first-time-visitor-starters",
    label: "Toronto first-time visitor source-backed page",
  },
  {
    path: "/toronto/weekend-route-starters",
    label: "Toronto weekend-route source-backed page",
  },
].map((route) => ({
  ...route,
  requiredTypes: ["BreadcrumbList", "CollectionPage", "ItemList"],
  expectedRobots: "index",
  expectedItemCount: 5,
}));

const routingGuideChecks = [
  {
    path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
    label: "Starter-pack routing guide",
  },
  {
    path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
    label: "Low-friction routing guide",
  },
  {
    path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
    label: "Guide-roundup routing guide",
  },
].map((route) => ({
  ...route,
  requiredTypes: ["BreadcrumbList", "BlogPosting", "FAQPage"],
  expectedRobots: "index",
  minFaqQuestions: 2,
}));

const checks = [
  {
    path: "/",
    requiredTypes: ["Organization", "WebSite"],
    expectedRobots: "index",
  },
  {
    path: "/vancouver",
    requiredTypes: ["BreadcrumbList", "CollectionPage", "ItemList"],
    expectedRobots: "index",
  },
  {
    path: "/vancouver/guides",
    requiredTypes: ["BreadcrumbList", "CollectionPage", "ItemList"],
    expectedRobots: "index",
  },
  {
    path: "/toronto/guides",
    label: "Toronto guide hub",
    requiredTypes: ["BreadcrumbList", "CollectionPage", "ItemList"],
    expectedRobots: "index",
  },
  {
    path: "/vancouver/missions",
    label: "Missions hub",
    requiredTypes: ["BreadcrumbList", "CollectionPage", "ItemList"],
    expectedRobots: "index",
    expectedItemCount: seedData.cityMissions.length,
    expectedItemListId: "#list",
    expectedItemCountLabel: "missions",
  },
  {
    path: "/for-businesses/pricing",
    label: "Business pricing page",
    requiredTypes: ["BreadcrumbList", "CollectionPage", "ItemList", "FAQPage"],
    expectedRobots: "index",
    expectedItemCount: seedData.packages.length,
    expectedItemListId: "#packages",
    expectedItemCountLabel: "packages",
    minFaqQuestions: 3,
  },
  {
    path: "/for-businesses/partner-preview",
    label: "Business partner preview",
    requiredTypes: [],
    expectedRobots: "index",
  },
  ...guideChecks,
  ...sourceBackedChecks,
  ...routingGuideChecks,
  {
    path: "/admin",
    requiredTypes: [],
    expectedRobots: "noindex",
  },
  {
    path: "/private-preview/date-night",
    requiredTypes: [],
    expectedRobots: "noindex",
  },
  {
    path: "/for-businesses/submit",
    requiredTypes: [],
    expectedRobots: "noindex",
  },
  {
    path: "/for-businesses/book-call",
    requiredTypes: [],
    expectedRobots: "noindex",
  },
];

const failures = [];

function check(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const routeReports = checks.map((routeCheck) => {
  const metaOptions = {
    adminVisible: routeCheck.path === "/admin",
    privatePreviewVisible: routeCheck.path === "/private-preview/date-night",
  };
  const meta = getRouteMeta(routeCheck.path, seedData, metaOptions);
  const jsonLd = buildJsonLd(routeCheck.path, seedData, baseUrl, metaOptions);
  const graph = Array.isArray(jsonLd["@graph"]) ? jsonLd["@graph"] : [];
  const nodeTypes = graph
    .map((node) => node["@type"])
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value) => typeof value === "string");
  const robots = getRobotsDirectives(routeCheck.path);

  check(meta.title.trim().length > 0, `${routeCheck.path} is missing a title.`);
  check(meta.description.trim().length > 0, `${routeCheck.path} is missing a description.`);
  if (routeCheck.path !== "/") {
    check(
      meta.title !== "CityAtlas | Vancouver Guides, Routes, And Local Discovery",
      `${routeCheck.path} is still using the generic homepage title.`,
    );
  }
  check(
    robots.includes(routeCheck.expectedRobots),
    `${routeCheck.path} should include robots directive ${routeCheck.expectedRobots} but got ${robots}.`,
  );

  for (const requiredType of routeCheck.requiredTypes) {
    check(
      nodeTypes.includes(requiredType),
      `${routeCheck.path} is missing JSON-LD type ${requiredType}.`,
    );
  }

  if (routeCheck.path === "/vancouver") {
    const itemLists = graph.filter((node) => node["@type"] === "ItemList");
    const featuredHub = itemLists.find((node) => node["@id"] === `${baseUrl}/vancouver#featured-surfaces`);
    check(Boolean(featuredHub), "/vancouver is missing the featured-surfaces ItemList.");
    check(
      Number(featuredHub?.numberOfItems ?? 0) === featuredCityHubPaths.length,
      `/vancouver featured-surfaces ItemList should expose exactly ${featuredCityHubPaths.length} featured planning surfaces.`,
    );
    const featuredHubUrls = Array.isArray(featuredHub?.itemListElement)
      ? featuredHub.itemListElement.map((item) => item?.url).filter((value) => typeof value === "string")
      : [];
    for (const path of featuredCityHubPaths) {
      check(
        featuredHubUrls.includes(`${baseUrl}${path}`),
        `/vancouver featured-surfaces ItemList is missing ${path}.`,
      );
    }
  }

  if (routeCheck.path === "/vancouver/guides") {
    const itemLists = graph.filter((node) => node["@type"] === "ItemList");
    const featuredGuides = itemLists.find((node) => node["@id"] === `${baseUrl}/vancouver/guides#featured-guides`);
    check(Boolean(featuredGuides), "/vancouver/guides is missing the featured-guides ItemList.");
    check(
      Number(featuredGuides?.numberOfItems ?? 0) === featuredGuideHubSlugs.length,
      `/vancouver/guides featured-guides ItemList should expose exactly ${featuredGuideHubSlugs.length} featured answer-first guides.`,
    );
    const featuredGuideUrls = Array.isArray(featuredGuides?.itemListElement)
      ? featuredGuides.itemListElement.map((item) => item?.url).filter((value) => typeof value === "string")
      : [];
    for (const slug of featuredGuideHubSlugs) {
      check(
        featuredGuideUrls.includes(`${baseUrl}/vancouver/guides/${slug}`),
        `/vancouver/guides featured-guides ItemList is missing ${slug}.`,
      );
    }
  }

  if (routeCheck.minFaqQuestions) {
    const faqNode = graph.find((node) => node["@type"] === "FAQPage");
    check(
      Array.isArray(faqNode?.mainEntity) && faqNode.mainEntity.length >= routeCheck.minFaqQuestions,
      `${routeCheck.label} should expose visible FAQs through FAQPage JSON-LD.`,
    );
  }

  if (routeCheck.expectedItemCount) {
    const collectionPage = graph.find((node) => node["@type"] === "CollectionPage");
    const itemList = graph.find(
      (node) => node["@id"] === `${baseUrl}${routeCheck.path}${routeCheck.expectedItemListId ?? "#list"}`,
    );
    check(Boolean(collectionPage), `${routeCheck.label} should expose CollectionPage JSON-LD.`);
    check(
      Number(itemList?.numberOfItems ?? 0) === routeCheck.expectedItemCount,
      `${routeCheck.label} ItemList should expose exactly ${routeCheck.expectedItemCount} ${routeCheck.expectedItemCountLabel ?? "items"}.`,
    );
  }

  return {
    path: routeCheck.path,
    title: meta.title,
    robots,
    canonical: `${baseUrl}${routeCheck.path}`,
    nodeTypes,
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  checkedRouteCount: checks.length,
  routeReports,
  failures,
  passed: failures.length === 0,
};

mkdirSync(join(root, "output/seo"), { recursive: true });
writeFileSync(
  join(root, "output/seo/local-structure-proof.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log("CityAtlas SEO structure proof");
console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
