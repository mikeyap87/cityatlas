import { seedData } from "../src/data/seed.ts";
import {
  getSourceBackedCollectionForGuide,
  getSourceBackedCollectionForPath,
  getSourceBackedPlaces,
  sourceBackedCollectionMeta,
} from "../src/lib/sourceBackedCollections.ts";
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  buildSourceBackedRouteMapStops,
  getRoutePlanningEstimate,
  getRouteStopCountLabel,
} from "../src/lib/routeMaps.ts";
import {
  buildRouteProgressKey,
  buildRouteStopKey,
  routeSkipReasons,
} from "../src/lib/routeProgress.ts";

const failures = [];
const collectionEntries = Object.entries(sourceBackedCollectionMeta);

function requirePass(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function inspectDirectionsUrl(url, expectedStopCount, label) {
  requirePass(url, `${label}: missing Google Maps directions URL`);

  if (!url) {
    return;
  }

  const parsed = new URL(url);
  const waypointCount = parsed.searchParams.get("waypoints")
    ? parsed.searchParams.get("waypoints").split("|").length
    : 0;

  requirePass(parsed.origin === "https://www.google.com", `${label}: wrong Google host`);
  requirePass(parsed.pathname === "/maps/dir/", `${label}: wrong Google Maps path`);
  requirePass(parsed.searchParams.get("api") === "1", `${label}: missing api=1`);
  requirePass(parsed.searchParams.get("travelmode") === "walking", `${label}: wrong travel mode`);
  requirePass(Boolean(parsed.searchParams.get("origin")), `${label}: missing origin`);
  requirePass(Boolean(parsed.searchParams.get("destination")), `${label}: missing destination`);
  requirePass(
    waypointCount === Math.max(0, expectedStopCount - 2),
    `${label}: expected ${Math.max(0, expectedStopCount - 2)} waypoints, found ${waypointCount}`,
  );
}

function inspectEmbedUrl(url, expectedStopCount, label) {
  requirePass(url, `${label}: missing Google Maps embed URL`);

  if (!url) {
    return;
  }

  const parsed = new URL(url);
  const waypointCount = parsed.searchParams.get("waypoints")
    ? parsed.searchParams.get("waypoints").split("|").length
    : 0;

  requirePass(parsed.origin === "https://www.google.com", `${label}: wrong embed host`);
  requirePass(parsed.pathname === "/maps/embed/v1/directions", `${label}: wrong embed path`);
  requirePass(parsed.searchParams.get("key") === "test-embed-key", `${label}: wrong embed key`);
  requirePass(parsed.searchParams.get("mode") === "walking", `${label}: wrong embed mode`);
  requirePass(Boolean(parsed.searchParams.get("origin")), `${label}: missing embed origin`);
  requirePass(Boolean(parsed.searchParams.get("destination")), `${label}: missing embed destination`);
  requirePass(
    waypointCount === Math.max(0, expectedStopCount - 2),
    `${label}: expected ${Math.max(0, expectedStopCount - 2)} embed waypoints, found ${waypointCount}`,
  );
}

function inspectPlanning(collection, stops, label) {
  const planning = getRoutePlanningEstimate(collection, stops);
  const stopCountLabel = getRouteStopCountLabel(stops);

  requirePass(Boolean(planning.totalWindow), `${label}: missing planning total window`);
  requirePass(Boolean(planning.stopWindow), `${label}: missing planning stop window`);
  requirePass(Boolean(planning.bestMode), `${label}: missing planning best mode`);
  requirePass(Boolean(planning.modeNote), `${label}: missing planning mode note`);
  requirePass(/stop/.test(stopCountLabel), `${label}: missing stop-count label`);
}

function inspectProgressKeys(stops, label, campaign) {
  const routeKey = buildRouteProgressKey({
    campaign,
    id: label,
    stops,
    title: label,
  });
  const stopKeys = stops.map((stop, index) => buildRouteStopKey(stop, index));

  requirePass(routeKey.startsWith("route:"), `${label}: route progress key should be namespaced`);
  requirePass(
    stopKeys.length === new Set(stopKeys).size,
    `${label}: route stop progress keys should be unique`,
  );
  requirePass(routeSkipReasons.length >= 5, `${label}: route skip reasons should cover common cases`);
}

function getCollectionForPath(path) {
  const directCollection = getSourceBackedCollectionForPath(path);

  if (directCollection) {
    return directCollection;
  }

  const matchingGuide = seedData.guides.find((guide) => {
    const guidePath = `/${guide.citySlug ?? "vancouver"}/guides/${guide.slug}`;
    return guidePath === path;
  });

  return matchingGuide ? getSourceBackedCollectionForGuide(matchingGuide) : null;
}

function getRouteMapOptionsForGuide(guide) {
  const seenCollections = new Set();

  return (guide.resourceLinks ?? [])
    .map((link) => {
      const collection = getCollectionForPath(link.path);

      if (!collection || seenCollections.has(collection)) {
        return null;
      }

      seenCollections.add(collection);

      return {
        collection,
        label: link.title,
        path: link.path,
      };
    })
    .filter(Boolean);
}

for (const [collection, meta] of collectionEntries) {
  const places = getSourceBackedPlaces(seedData, collection);
  const stops = buildSourceBackedRouteMapStops(places, collection);
  const url = buildGoogleMapsDirectionsUrl(stops, {
    travelMode: "walking",
    utmCampaign: `${collection}_starter_route`,
  });
  const embedUrl = buildGoogleMapsEmbedUrl(stops, "test-embed-key", {
    travelMode: "walking",
    utmCampaign: `${collection}_starter_route`,
  });

  requirePass(places.length >= 2, `${meta.path}: needs at least two places for a route`);
  requirePass(stops.length === places.length, `${meta.path}: stop count drifted`);
  requirePass(
    stops.every((stop) => stop.query.includes(meta.cityName ?? "Vancouver")),
    `${meta.path}: each stop query should include the city`,
  );
  inspectDirectionsUrl(url, places.length, meta.path);
  inspectEmbedUrl(embedUrl, places.length, meta.path);
  inspectPlanning(collection, stops, meta.path);
  inspectProgressKeys(stops, meta.path, `${collection}_starter_route`);
}

const routeGuides = seedData.guides
  .map((guide) => ({
    guide,
    collection: getSourceBackedCollectionForGuide(guide),
  }))
  .filter((entry) => entry.collection);

for (const { guide, collection } of routeGuides) {
  const places = getSourceBackedPlaces(seedData, collection);
  const stops = buildSourceBackedRouteMapStops(places, collection);
  const url = buildGoogleMapsDirectionsUrl(stops, {
    travelMode: "walking",
    utmCampaign: `guide_${guide.slug}_route`,
  });
  const embedUrl = buildGoogleMapsEmbedUrl(stops, "test-embed-key", {
    travelMode: "walking",
    utmCampaign: `guide_${guide.slug}_route`,
  });

  requirePass(places.length >= 2, `${guide.slug}: guide route has fewer than two stops`);
  inspectDirectionsUrl(url, places.length, guide.slug);
  inspectEmbedUrl(embedUrl, places.length, guide.slug);
  inspectPlanning(collection, stops, guide.slug);
  inspectProgressKeys(stops, guide.slug, `guide_${guide.slug}_route`);
}

const routeChooserGuides = seedData.guides
  .filter((guide) => !getSourceBackedCollectionForGuide(guide))
  .map((guide) => ({
    guide,
    options: getRouteMapOptionsForGuide(guide),
  }))
  .filter((entry) => entry.options.length > 0);

for (const { guide, options } of routeChooserGuides) {
  for (const option of options) {
    const places = getSourceBackedPlaces(seedData, option.collection);
    const stops = buildSourceBackedRouteMapStops(places, option.collection);
    const url = buildGoogleMapsDirectionsUrl(stops, {
      travelMode: "walking",
      utmCampaign: `guide_${guide.slug}_${option.collection}_option`,
    });
    const embedUrl = buildGoogleMapsEmbedUrl(stops, "test-embed-key", {
      travelMode: "walking",
      utmCampaign: `guide_${guide.slug}_${option.collection}_option`,
    });

    requirePass(
      places.length >= 2,
      `${guide.slug} -> ${option.label}: chooser route has fewer than two stops`,
    );
    inspectDirectionsUrl(url, places.length, `${guide.slug} -> ${option.label}`);
    inspectEmbedUrl(embedUrl, places.length, `${guide.slug} -> ${option.label}`);
    inspectPlanning(option.collection, stops, `${guide.slug} -> ${option.label}`);
    inspectProgressKeys(
      stops,
      `${guide.slug} -> ${option.label}`,
      `guide_${guide.slug}_${option.collection}_option`,
    );
  }
}

if (failures.length > 0) {
  console.error("Route map link verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      sourceBackedCollections: collectionEntries.length,
      routeGuides: routeGuides.length,
      routeChooserGuides: routeChooserGuides.length,
      routeChooserOptions: routeChooserGuides.reduce(
        (total, entry) => total + entry.options.length,
        0,
      ),
      mapsHost: "https://www.google.com/maps/dir/",
      embedHost: "https://www.google.com/maps/embed/v1/directions",
      defaultTravelMode: "walking",
      routeProgressStorage: "cityatlas.route.progress.v1",
      routeSkipReasons: routeSkipReasons.length,
    },
    null,
    2,
  ),
);
