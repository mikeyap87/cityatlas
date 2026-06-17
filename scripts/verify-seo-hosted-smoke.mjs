import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { siteConfig } from "../src/config/site.ts";
import { seedData } from "../src/data/seed.ts";
import { buildJsonLd, getRouteMeta, getRobotsDirectives } from "../src/lib/seo.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/seo");
const publicDir = join(root, "public");
const require = createRequire(import.meta.url);
const failures = [];
const warnings = [];

const smokeProfiles = {
  "first-source-backed": {
    artifactName: "hosted-smoke-first-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/first-time-visitor-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
        ],
      },
      {
        path: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/first-time-visitor-starters",
        ],
      },
      {
        path: "/vancouver/wellness-reset-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/vancouver-wellness-experiences-to-review",
        ],
      },
      {
        path: "/vancouver/guides/vancouver-wellness-experiences-to-review",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/wellness-reset-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/first-time-visitor-starters",
      "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
      "/vancouver/wellness-reset-starters",
      "/vancouver/guides/vancouver-wellness-experiences-to-review",
    ],
    llmsPaths: [
      "/vancouver/first-time-visitor-starters",
      "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
      "/vancouver/wellness-reset-starters",
      "/vancouver/guides/vancouver-wellness-experiences-to-review",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "second-source-backed": {
    artifactName: "hosted-smoke-second-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/out-of-town-guest-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver",
        ],
      },
      {
        path: "/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/out-of-town-guest-starters",
        ],
      },
      {
        path: "/vancouver/weekend-route-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
        ],
      },
      {
        path: "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/weekend-route-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/out-of-town-guest-starters",
      "/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver",
      "/vancouver/weekend-route-starters",
      "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
    ],
    llmsPaths: [
      "/vancouver/out-of-town-guest-starters",
      "/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver",
      "/vancouver/weekend-route-starters",
      "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "sunday-source-backed": {
    artifactName: "hosted-smoke-sunday-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/sunday-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
        ],
      },
      {
        path: "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/sunday-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/sunday-starters",
      "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
    ],
    llmsPaths: [
      "/vancouver/sunday-starters",
      "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "returning-visitor-source-backed": {
    artifactName: "hosted-smoke-returning-visitor-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/returning-visitor-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
        ],
      },
      {
        path: "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/returning-visitor-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/returning-visitor-starters",
      "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
    ],
    llmsPaths: [
      "/vancouver/returning-visitor-starters",
      "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "kitsilano-scenic-source-backed": {
    artifactName: "hosted-smoke-kitsilano-scenic-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/kitsilano-scenic-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
        ],
      },
      {
        path: "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/kitsilano-scenic-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/kitsilano-scenic-starters",
      "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
    ],
    llmsPaths: [
      "/vancouver/kitsilano-scenic-starters",
      "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "west-side-daytime-source-backed": {
    artifactName: "hosted-smoke-west-side-daytime-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/west-side-daytime-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan",
        ],
      },
      {
        path: "/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/west-side-daytime-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/west-side-daytime-starters",
      "/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan",
    ],
    llmsPaths: [
      "/vancouver/west-side-daytime-starters",
      "/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "false-creek-culture-source-backed": {
    artifactName: "hosted-smoke-false-creek-culture-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/false-creek-culture-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon",
        ],
      },
      {
        path: "/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/false-creek-culture-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/false-creek-culture-starters",
      "/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon",
    ],
    llmsPaths: [
      "/vancouver/false-creek-culture-starters",
      "/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "ubc-discovery-source-backed": {
    artifactName: "hosted-smoke-ubc-discovery-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/ubc-discovery-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/where-should-you-start-a-ubc-adjacent-vancouver-discovery-day",
        ],
      },
      {
        path: "/vancouver/guides/where-should-you-start-a-ubc-adjacent-vancouver-discovery-day",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/ubc-discovery-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/ubc-discovery-starters",
      "/vancouver/guides/where-should-you-start-a-ubc-adjacent-vancouver-discovery-day",
    ],
    llmsPaths: [
      "/vancouver/ubc-discovery-starters",
      "/vancouver/guides/where-should-you-start-a-ubc-adjacent-vancouver-discovery-day",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "garden-day-source-backed": {
    artifactName: "hosted-smoke-garden-day-source-backed.json",
    publicRoutes: [
      {
        path: "/vancouver/garden-day-starters",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day",
        ],
      },
      {
        path: "/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day",
        requiredFragments: [
          "/editorial-standards",
          "/vancouver/garden-day-starters",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/garden-day-starters",
      "/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day",
    ],
    llmsPaths: [
      "/vancouver/garden-day-starters",
      "/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "starter-pack-routing": {
    artifactName: "hosted-smoke-starter-pack-routing.json",
    publicRoutes: [
      {
        path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
        requiredFragments: [
          "/vancouver/date-night-starters",
          "/vancouver/first-time-visitor-starters",
          "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          "/vancouver/missions",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
    ],
    llmsPaths: [
      "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "guide-roundup-routing": {
    artifactName: "hosted-smoke-guide-roundup-routing.json",
    publicRoutes: [
      {
        path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
        requiredFragments: [
          "/vancouver/date-night-starters",
          "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
    ],
    llmsPaths: [
      "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "low-friction-routing": {
    artifactName: "hosted-smoke-low-friction-routing.json",
    publicRoutes: [
      {
        path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
        requiredFragments: [
          "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
          "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
        ],
      },
    ],
    sitemapPaths: [
      "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
    ],
    llmsPaths: [
      "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
  "toronto-pilot": {
    artifactName: "hosted-smoke-toronto-pilot.json",
    publicRoutes: [
      {
        path: "/toronto/guides",
        requiredFragments: [
          "/toronto/first-time-visitor-starters",
          "/toronto/weekend-route-starters",
          "/editorial-standards",
          "/vancouver/guides",
        ],
      },
      {
        path: "/toronto/first-time-visitor-starters",
        requiredFragments: [
          "/editorial-standards",
          "/toronto/guides",
          "/toronto/guides/where-should-a-first-time-toronto-visitor-start",
        ],
      },
      {
        path: "/toronto/guides/where-should-a-first-time-toronto-visitor-start",
        requiredFragments: [
          "/editorial-standards",
          "/toronto/first-time-visitor-starters",
          "/toronto/weekend-route-starters",
          "/toronto/guides",
        ],
      },
      {
        path: "/toronto/weekend-route-starters",
        requiredFragments: [
          "/editorial-standards",
          "/toronto/guides",
          "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
        ],
      },
      {
        path: "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
        requiredFragments: [
          "/editorial-standards",
          "/toronto/weekend-route-starters",
          "/toronto/guides",
        ],
      },
    ],
    sitemapPaths: [
      "/toronto/guides",
      "/toronto/first-time-visitor-starters",
      "/toronto/guides/where-should-a-first-time-toronto-visitor-start",
      "/toronto/weekend-route-starters",
      "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
    ],
    llmsPaths: [
      "/toronto/guides",
      "/toronto/first-time-visitor-starters",
      "/toronto/guides/where-should-a-first-time-toronto-visitor-start",
      "/toronto/weekend-route-starters",
      "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
    ],
    noindexRoutes: [
      {
        path: "/for-businesses/submit",
      },
    ],
    hostedGuardRoutes: [
      {
        path: "/admin",
        requiredGuardFragment: "It includes private business submissions, review notes, and operations data, so the public site keeps it turned off.",
      },
      {
        path: "/private-preview/date-night",
        requiredGuardFragment: "It includes private planning material and stays off the public site unless a separate protected-sharing setup is enabled.",
      },
    ],
  },
};

function check(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function warn(message) {
  warnings.push(message);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith("--")) continue;
    const key = part.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function routeUrl(baseUrl, path) {
  return path === "/" ? `${baseUrl}/` : `${baseUrl}${path}`;
}

function expectedTopLevelJsonLdTypes(path, baseUrl, metaOptions) {
  const jsonLd = buildJsonLd(path, seedData, baseUrl, metaOptions);
  const graph = Array.isArray(jsonLd["@graph"]) ? jsonLd["@graph"] : [];
  return [...new Set(
    graph
      .map((node) => node["@type"])
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === "string"),
  )];
}

function collectNodeTypesFromGraph(graph) {
  return [...new Set(
    graph
      .map((node) => node?.type)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === "string"),
  )];
}

function getPlaywrightSearchPaths() {
  const envPaths = [
    process.env.CITYATLAS_PLAYWRIGHT_NODE_MODULES,
    ...(process.env.NODE_PATH ? process.env.NODE_PATH.split(":") : []),
    join(homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
  ].filter(Boolean);

  return [...new Set(envPaths)];
}

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    for (const searchPath of getPlaywrightSearchPaths()) {
      try {
        const resolved = require.resolve("playwright", { paths: [searchPath] });
        return require(resolved);
      } catch {
        continue;
      }
    }
  }

  throw new Error(
    "Playwright is not available. Set CITYATLAS_PLAYWRIGHT_NODE_MODULES or NODE_PATH to a node_modules directory that contains the playwright package.",
  );
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow" });
  return {
    url,
    finalUrl: response.url,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    text: await response.text(),
  };
}

async function inspectRenderedRoute(page, url) {
  const response = await page.goto(url, { waitUntil: "networkidle" });
  return page.evaluate((routeResponseStatus) => {
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null;
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;
    const html = document.documentElement.outerHTML;
    const bodyText = document.body?.innerText ?? "";
    const jsonLdScripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    )
      .map((element) => element.textContent?.trim())
      .filter(Boolean);
    const graph = [];

    for (const raw of jsonLdScripts) {
      try {
        const parsed = JSON.parse(raw);
        const nodes = Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
        for (const node of nodes) {
          graph.push({
            type: node?.["@type"] ?? null,
          });
        }
      } catch {
        graph.push({
          type: "__invalid_json_ld__",
        });
      }
    }

    return {
      status: routeResponseStatus ?? null,
      title: document.title,
      robots,
      canonical,
      html,
      bodyText,
      graph,
    };
  }, response?.status() ?? null);
}

async function runRouteCheck(
  page,
  { path, requiredFragments = [], requiredGuardFragment = null, isGuarded = false },
  baseUrl,
  isLocalBase,
) {
  const url = routeUrl(baseUrl, path);
  const rendered = await inspectRenderedRoute(page, url);
  const metaOptions = {
    adminVisible: isLocalBase && path === "/admin",
    privatePreviewVisible: isLocalBase && path === "/private-preview/date-night",
  };
  const expectedMeta = getRouteMeta(path, seedData, metaOptions);
  const expectedRobots = getRobotsDirectives(path);
  const expectedCanonical = routeUrl(baseUrl, path);
  const expectedTypes = isGuarded ? [] : expectedTopLevelJsonLdTypes(path, baseUrl, metaOptions);
  const jsonLdTypes = isGuarded ? [] : collectNodeTypesFromGraph(rendered.graph);
  const skippedChecks = [];

  check(rendered.status === 200, `${path} should return 200 on ${baseUrl} but returned ${rendered.status}.`);
  check(
    rendered.title === expectedMeta.title,
    `${path} title mismatch on ${baseUrl}. Expected "${expectedMeta.title}" but got "${rendered.title ?? "missing"}".`,
  );
  check(
    typeof rendered.robots === "string" && rendered.robots.includes(expectedRobots),
    `${path} robots mismatch on ${baseUrl}. Expected to include "${expectedRobots}" but got "${rendered.robots ?? "missing"}".`,
  );
  check(
    rendered.canonical === expectedCanonical,
    `${path} canonical mismatch on ${baseUrl}. Expected "${expectedCanonical}" but got "${rendered.canonical ?? "missing"}".`,
  );

  if (!isGuarded) {
    check(
      !rendered.graph.some((node) => node.type === "__invalid_json_ld__"),
      `${path} contains invalid JSON-LD on ${baseUrl}.`,
    );
    for (const type of expectedTypes) {
      check(
        jsonLdTypes.includes(type),
        `${path} is missing JSON-LD type ${type} on ${baseUrl}.`,
      );
    }
  }

  for (const fragment of requiredFragments) {
    check(
      rendered.html.includes(fragment),
      `${path} is missing required fragment ${fragment} on ${baseUrl}.`,
    );
  }

  if (requiredGuardFragment) {
    if (isLocalBase) {
      skippedChecks.push("guard-fragment-on-local-preview");
    } else {
      check(
        rendered.bodyText.includes(requiredGuardFragment),
        `${path} is missing the hosted guard notice on ${baseUrl}.`,
      );
    }
  }

  return {
    path,
    checkMode: "browser-render",
    url,
    status: rendered.status,
    title: rendered.title,
    robots: rendered.robots,
    canonical: rendered.canonical,
    expectedTypes,
    jsonLdTypes,
    skippedChecks,
  };
}

async function runRouteModelCheck(
  { path, requiredFragments = [], requiredGuardFragment = null, isGuarded = false },
  baseUrl,
  isLocalBase,
) {
  const url = routeUrl(baseUrl, path);
  const response = isLocalBase ? null : await fetchText(url);
  const metaOptions = {
    adminVisible: isLocalBase && path === "/admin",
    privatePreviewVisible: isLocalBase && path === "/private-preview/date-night",
  };
  const expectedMeta = getRouteMeta(path, seedData, metaOptions);
  const expectedRobots = getRobotsDirectives(path);
  const expectedCanonical = routeUrl(baseUrl, path);
  const expectedTypes = isGuarded ? [] : expectedTopLevelJsonLdTypes(path, baseUrl, metaOptions);

  if (response) {
    check(response.status === 200, `${path} should return 200 on ${baseUrl} but returned ${response.status}.`);
  }

  const skippedChecks = [
    "rendered-title",
    "rendered-robots",
    "rendered-canonical",
    "rendered-jsonld",
    "rendered-fragments",
  ];

  if (!response) {
    skippedChecks.unshift("route-http-status");
  }

  if (requiredGuardFragment) {
    skippedChecks.push("hosted-guard-fragment");
  }
  if (requiredFragments.length > 0) {
    skippedChecks.push("page-to-guide-fragments");
  }

  return {
    path,
    checkMode: "route-model-only",
    url,
    finalUrl: response?.finalUrl ?? null,
    status: response?.status ?? null,
    expectedTitle: expectedMeta.title,
    expectedRobots,
    expectedCanonical,
    expectedTypes,
    skippedChecks,
  };
}

function loadLocalPublicAsset(path) {
  const assetPath = join(publicDir, path.replace(/^\//, ""));
  check(existsSync(assetPath), `${path} is missing from local public assets.`);
  return {
    path,
    status: existsSync(assetPath) ? 200 : null,
    text: existsSync(assetPath) ? readFileSync(assetPath, "utf8") : "",
  };
}

function finish(report, artifactName = "hosted-smoke-report.json") {
  const output = {
    generatedAt: new Date().toISOString(),
    passed: failures.length === 0,
    failures,
    warnings,
    ...report,
  };

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, artifactName), `${JSON.stringify(output, null, 2)}\n`);

  console.log("CityAtlas SEO hosted smoke");
  console.log(JSON.stringify(output, null, 2));

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const profileId = typeof args.profile === "string" ? args.profile : "first-source-backed";
  const profile = smokeProfiles[profileId];
  check(Boolean(profile), `Unknown smoke profile "${profileId}".`);
  if (!profile) {
    finish({
      profile: profileId,
      baseUrl: null,
      routeReports: [],
      sitemapReport: null,
      llmsReport: null,
    });
    return;
  }

  const baseUrl = normalizeBaseUrl(
    typeof args["base-url"] === "string" ? args["base-url"] : siteConfig.localUrl,
  );
  const hostname = new URL(`${baseUrl}/`).hostname;
  const isLocalBase = ["localhost", "127.0.0.1", "::1"].includes(hostname);
  let checkMode = args["route-model-only"] ? "route-model-only" : "browser-render";
  let browserLaunchError = null;
  let browser = null;
  let page = null;

  if (checkMode === "browser-render") {
    try {
      const { chromium } = loadPlaywright();
      browser = await chromium.launch({
        headless: true,
        channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || "chrome",
      });
      page = await browser.newPage();
    } catch (error) {
      browserLaunchError = error instanceof Error ? error.message : String(error);
      checkMode = "route-model-only";
      warn(
        `Browser-render smoke fell back to route-model-only proof because the browser could not launch: ${browserLaunchError}`,
      );
    }
  }

  try {
    const routeReports = [];

    for (const route of profile.publicRoutes) {
      routeReports.push(
        page
          ? await runRouteCheck(page, route, baseUrl, isLocalBase)
          : await runRouteModelCheck(route, baseUrl, isLocalBase),
      );
    }

    for (const route of profile.noindexRoutes) {
      routeReports.push(
        page
          ? await runRouteCheck(page, route, baseUrl, isLocalBase)
          : await runRouteModelCheck(route, baseUrl, isLocalBase),
      );
    }

    for (const route of profile.hostedGuardRoutes) {
      routeReports.push(
        page
          ? await runRouteCheck(page, { ...route, isGuarded: true }, baseUrl, isLocalBase)
          : await runRouteModelCheck({ ...route, isGuarded: true }, baseUrl, isLocalBase),
      );
    }

    const sitemapResponse =
      checkMode === "route-model-only" && isLocalBase
        ? loadLocalPublicAsset("/sitemap.xml")
        : await fetchText(routeUrl(baseUrl, "/sitemap.xml"));
    check(sitemapResponse.status === 200, `sitemap.xml should return 200 on ${baseUrl} but returned ${sitemapResponse.status}.`);
    for (const path of profile.sitemapPaths) {
      check(
        sitemapResponse.text.includes(path),
        `sitemap.xml is missing ${path} on ${baseUrl}.`,
      );
    }

    const llmsResponse =
      checkMode === "route-model-only" && isLocalBase
        ? loadLocalPublicAsset("/llms.txt")
        : await fetchText(routeUrl(baseUrl, "/llms.txt"));
    check(llmsResponse.status === 200, `llms.txt should return 200 on ${baseUrl} but returned ${llmsResponse.status}.`);
    for (const path of profile.llmsPaths) {
      check(
        llmsResponse.text.includes(path),
        `llms.txt is missing ${path} on ${baseUrl}.`,
      );
    }

    finish({
      profile: profileId,
      baseUrl,
      routeReports,
      sitemapReport: {
        path: "/sitemap.xml",
        status: sitemapResponse.status,
        checkedPaths: profile.sitemapPaths,
      },
      llmsReport: {
        path: "/llms.txt",
        status: llmsResponse.status,
        checkedPaths: profile.llmsPaths,
      },
      baseMode: isLocalBase ? "local-preview" : "hosted-domain",
      checkMode,
      browserLaunchError,
    }, profile.artifactName);
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

await main();
