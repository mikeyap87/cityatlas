import { seedData } from "../src/data/seed.ts";
import {
  getSourceBackedCollectionForGuide,
  getSourceBackedPlaces,
  sourceBackedCollectionMeta,
} from "../src/lib/sourceBackedCollections.ts";
import {
  buildGoogleMapsDirectionsUrl,
  buildSourceBackedRouteMapStops,
} from "../src/lib/routeMaps.ts";

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

for (const [collection, meta] of collectionEntries) {
  const places = getSourceBackedPlaces(seedData, collection);
  const stops = buildSourceBackedRouteMapStops(places, collection);
  const url = buildGoogleMapsDirectionsUrl(stops, {
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

  requirePass(places.length >= 2, `${guide.slug}: guide route has fewer than two stops`);
  inspectDirectionsUrl(url, places.length, guide.slug);
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
      mapsHost: "https://www.google.com/maps/dir/",
      defaultTravelMode: "walking",
    },
    null,
    2,
  ),
);
