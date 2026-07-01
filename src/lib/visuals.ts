import { resolvePublicAssetPath } from "../config/site.ts";
import type { Business, EventItem, Guide, SourceBackedPlaceReference } from "../types";

const visualLibrary = {
  evening: resolvePublicAssetPath("/assets/places-generated/granville-island-public-market-generated.jpg"),
  rainy: resolvePublicAssetPath("/assets/places-generated/vancouver-public-library-central-generated.jpg"),
  coffee: resolvePublicAssetPath("/assets/places-generated/commercial-drive-generated.jpg"),
  kits: resolvePublicAssetPath("/assets/places-generated/kitsilano-beach-generated.jpg"),
  wellness: resolvePublicAssetPath("/assets/places-generated/queen-elizabeth-park-generated.jpg"),
  garden: resolvePublicAssetPath("/assets/places-generated/vandusen-botanical-garden-generated.jpg"),
  culture: resolvePublicAssetPath("/assets/places-generated/vancouver-art-gallery-generated.jpg"),
  waterfront: resolvePublicAssetPath("/assets/places-generated/english-bay-beach-generated.jpg"),
} as const;

const venueVisualLibrary = {
  publishedOnMain: resolvePublicAssetPath("/assets/businesses/published-on-main-dining-room.png"),
  kissaTanto: resolvePublicAssetPath("/assets/businesses/kissa-tanto-booth.webp"),
  labattoir: resolvePublicAssetPath("/assets/businesses/labattoir-dining-room.webp"),
  botanist: resolvePublicAssetPath("/assets/businesses/botanist-dining-room.jpg"),
  miku: resolvePublicAssetPath("/assets/businesses/miku-waterfront-dining-room.png"),
} as const;

const routeVisualLibrary = {
  dateNight: resolvePublicAssetPath("/assets/routes-generated/vancouver-date-night-route-hero-v2.jpg"),
} as const;

const placeVisualLibrary = {
  artGalleryOfOntario: resolvePublicAssetPath("/assets/places-generated/art-gallery-of-ontario-generated.jpg"),
  beatyBiodiversityMuseum: resolvePublicAssetPath("/assets/places-generated/beaty-biodiversity-museum-generated.jpg"),
  bentwayStagingGrounds: resolvePublicAssetPath("/assets/places-generated/bentway-staging-grounds-generated.jpg"),
  billReidGallery: resolvePublicAssetPath("/assets/places-generated/bill-reid-gallery-generated.jpg"),
  bloedelConservatory: resolvePublicAssetPath("/assets/places-generated/bloedel-conservatory-generated.jpg"),
  chinatownStorytellingCentre: resolvePublicAssetPath("/assets/places-generated/chinatown-storytelling-centre-generated.jpg"),
  commercialDrive: resolvePublicAssetPath("/assets/places-generated/commercial-drive-generated.jpg"),
  distilleryDistrict: resolvePublicAssetPath("/assets/places-generated/distillery-district-generated.jpg"),
  drSunYatSenChineseGarden: resolvePublicAssetPath("/assets/places-generated/dr-sun-yat-sen-classical-chinese-garden-generated.jpg"),
  englishBayBeach: resolvePublicAssetPath("/assets/places-generated/english-bay-beach-generated.jpg"),
  evergreenBrickWorks: resolvePublicAssetPath("/assets/places-generated/evergreen-brick-works-generated.jpg"),
  gastown: resolvePublicAssetPath("/assets/places-generated/gastown-generated.jpg"),
  granvilleIslandPublicMarket: resolvePublicAssetPath("/assets/places-generated/granville-island-public-market-generated.jpg"),
  greenheartTreewalk: resolvePublicAssetPath("/assets/places-generated/greenheart-treewalk-generated.jpg"),
  harbourfrontCentre: resolvePublicAssetPath("/assets/places-generated/harbourfront-centre-generated.jpg"),
  moa: resolvePublicAssetPath("/assets/places-generated/museum-of-anthropology-generated.jpg"),
  museumOfVancouver: resolvePublicAssetPath("/assets/places-generated/museum-of-vancouver-generated.jpg"),
  nitobe: resolvePublicAssetPath("/assets/places-generated/nitobe-memorial-garden-generated.jpg"),
  jerichoBeach: resolvePublicAssetPath("/assets/places-generated/jericho-beach-generated.jpg"),
  kitsilanoBeach: resolvePublicAssetPath("/assets/places-generated/kitsilano-beach-generated.jpg"),
  kitsilanoPool: resolvePublicAssetPath("/assets/places-generated/kitsilano-pool-generated.jpg"),
  locarnoBeach: resolvePublicAssetPath("/assets/places-generated/locarno-beach-generated.jpg"),
  queenElizabethPark: resolvePublicAssetPath("/assets/places-generated/queen-elizabeth-park-generated.jpg"),
  royalOntarioMuseum: resolvePublicAssetPath("/assets/places-generated/royal-ontario-museum-generated.jpg"),
  spaceCentre: resolvePublicAssetPath("/assets/places-generated/hr-macmillan-space-centre-generated.jpg"),
  stacktMarket: resolvePublicAssetPath("/assets/places-generated/stackt-market-generated.jpg"),
  stanleyPark: resolvePublicAssetPath("/assets/places-generated/stanley-park-generated.jpg"),
  stLawrenceMarket: resolvePublicAssetPath("/assets/places-generated/st-lawrence-market-generated.jpg"),
  torontoBotanicalGarden: resolvePublicAssetPath("/assets/places-generated/toronto-botanical-garden-generated.jpg"),
  torontoMusicGarden: resolvePublicAssetPath("/assets/places-generated/toronto-music-garden-generated.jpg"),
  troutLakeBeach: resolvePublicAssetPath("/assets/places-generated/trout-lake-beach-generated.jpg"),
  ubcBotanicalGarden: resolvePublicAssetPath("/assets/places-generated/ubc-botanical-garden-generated.jpg"),
  vancouverPublicLibraryCentral: resolvePublicAssetPath("/assets/places-generated/vancouver-public-library-central-generated.jpg"),
  vancouverArtGallery: resolvePublicAssetPath("/assets/places-generated/vancouver-art-gallery-generated.jpg"),
  vancouverMaritimeMuseum: resolvePublicAssetPath("/assets/places-generated/vancouver-maritime-museum-generated.jpg"),
  vandusenBotanicalGarden: resolvePublicAssetPath("/assets/places-generated/vandusen-botanical-garden-generated.jpg"),
} as const;

const genericGuidePhotos = new Set([
  "/assets/vancouver-market-hero.jpg",
  "/assets/vancouver-market-hero.png",
  "/assets/vancouver-rainy-market-hero.jpg",
  "/assets/vancouver-rainline-cafe-hero.jpg",
  "/assets/kits-rope-flow-reference.png",
  "/assets/wellness-session-room.jpg",
  "/assets/vancouver-waterfront-park-hero.jpg",
  "/assets/vancouver-waterfront-park-hero.png",
  "/assets/vancouver-seawall-hero.jpg",
  "/assets/vancouver-seawall-hero.png",
  "/assets/vancouver-waterfront-skyline.jpg",
  "/assets/vancouver-waterfront-skyline.png",
]);
const placeholderSceneAssets = new Set([
  "/assets/scene-evening-waterfront.svg",
  "/assets/scene-rainy-cafe.svg",
  "/assets/scene-kits-beach-flow.svg",
  "/assets/scene-wellness-studio.svg",
  "/assets/scene-garden-campus.svg",
  "/assets/scene-culture-harbour.svg",
]);

const sourceBackedCollectionVisuals: Record<SourceBackedPlaceReference["collection"], string> = {
  vancouver_date_night_starters: routeVisualLibrary.dateNight,
  vancouver_rainy_day_starters: placeVisualLibrary.vancouverArtGallery,
  vancouver_first_evening_starters: placeVisualLibrary.stanleyPark,
  vancouver_first_time_visitor_starters: placeVisualLibrary.gastown,
  toronto_first_time_visitor_starters: placeVisualLibrary.distilleryDistrict,
  toronto_weekend_route_starters: placeVisualLibrary.torontoMusicGarden,
  vancouver_garden_day_starters: placeVisualLibrary.queenElizabethPark,
  vancouver_kitsilano_scenic_starters: placeVisualLibrary.kitsilanoBeach,
  vancouver_west_side_daytime_starters: placeVisualLibrary.jerichoBeach,
  vancouver_false_creek_culture_starters: placeVisualLibrary.vancouverMaritimeMuseum,
  vancouver_ubc_discovery_starters: placeVisualLibrary.beatyBiodiversityMuseum,
  vancouver_returning_visitor_starters: placeVisualLibrary.commercialDrive,
  vancouver_out_of_town_guest_starters: placeVisualLibrary.stanleyPark,
  vancouver_weekend_route_starters: placeVisualLibrary.englishBayBeach,
  vancouver_sunday_starters: placeVisualLibrary.billReidGallery,
  vancouver_wellness_reset_starters: placeVisualLibrary.queenElizabethPark,
};

const guideVisualOverrides: Partial<Record<Guide["slug"], string>> = {
  "how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice": routeVisualLibrary.dateNight,
  "rainy-day-vancouver-plan-coffee-walk-and-reset": placeVisualLibrary.vancouverPublicLibraryCentral,
  "vancouver-wellness-experiences-to-review": placeVisualLibrary.queenElizabethPark,
  "how-to-pick-a-work-friendly-vancouver-cafe": visualLibrary.coffee,
  "two-hour-vancouver-visitor-loop-for-a-first-evening": venueVisualLibrary.miku,
  "where-should-a-first-time-vancouver-visitor-start": placeVisualLibrary.gastown,
  "where-should-a-first-time-toronto-visitor-start": placeVisualLibrary.distilleryDistrict,
  "vancouver-local-discovery-for-returning-visitors": placeVisualLibrary.vancouverArtGallery,
  "how-to-host-an-out-of-town-guest-in-vancouver": placeVisualLibrary.stanleyPark,
  "how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day": placeVisualLibrary.englishBayBeach,
  "how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day": placeVisualLibrary.torontoMusicGarden,
  "how-to-build-a-low-effort-vancouver-sunday-plan": placeVisualLibrary.chinatownStorytellingCentre,
  "vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first": placeVisualLibrary.granvilleIslandPublicMarket,
  "cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation": placeVisualLibrary.gastown,
  "which-low-friction-vancouver-route-should-you-open-today": placeVisualLibrary.vancouverPublicLibraryCentral,
  "how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening": placeVisualLibrary.gastown,
  "which-vancouver-neighborhood-fits-a-low-pressure-first-date": routeVisualLibrary.dateNight,
  "how-to-plan-a-two-stop-vancouver-night-without-transit-drag": routeVisualLibrary.dateNight,
  "gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact": placeVisualLibrary.gastown,
  "mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans": venueVisualLibrary.publishedOnMain,
  "kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings": placeVisualLibrary.kitsilanoBeach,
  "where-should-you-start-a-west-side-vancouver-daytime-plan": placeVisualLibrary.ubcBotanicalGarden,
  "where-should-you-start-a-false-creek-vancouver-culture-afternoon": placeVisualLibrary.vancouverMaritimeMuseum,
  "where-should-you-start-a-ubc-adjacent-vancouver-discovery-day": placeVisualLibrary.beatyBiodiversityMuseum,
  "where-should-you-start-a-vancouver-garden-and-conservatory-day": placeVisualLibrary.vandusenBotanicalGarden,
};

function normalize(parts: Array<string | undefined>) {
  return parts
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase();
}

function matchesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function findVisualByRules(
  text: string,
  rules: Array<{ terms: string[]; visual: (typeof visualLibrary)[keyof typeof visualLibrary] }>,
) {
  return rules.find((rule) => matchesAny(text, rule.terms))?.visual;
}

function isSceneAsset(path: string | undefined) {
  return Boolean(path) && !path?.includes("/visual_references/");
}

export function getGuideVisual(guide: Guide) {
  if (
    isSceneAsset(guide.image) &&
    !genericGuidePhotos.has(guide.image) &&
    !placeholderSceneAssets.has(guide.image)
  ) {
    return resolvePublicAssetPath(guide.image);
  }

  const explicitGuideVisual = guideVisualOverrides[guide.slug];
  if (explicitGuideVisual) {
    return explicitGuideVisual;
  }

  const text = normalize([guide.title, guide.category, guide.cluster, guide.neighborhood, guide.summary]);
  const explicitVisual = findVisualByRules(text, [
    {
      terms: ["date night", "gastown", "evening", "dinner", "dessert", "night market"],
      visual: visualLibrary.evening,
    },
    {
      terms: ["rainy", "weather backup"],
      visual: visualLibrary.rainy,
    },
    {
      terms: ["coffee", "cafe", "brunch"],
      visual: visualLibrary.coffee,
    },
    {
      terms: ["wellness", "recovery", "reset", "spa", "calm"],
      visual: visualLibrary.wellness,
    },
    {
      terms: ["ubc", "garden", "conservatory", "campus", "nitobe", "vandusen", "botanical"],
      visual: visualLibrary.garden,
    },
    {
      terms: ["science world", "space centre", "museum", "gallery", "false creek", "culture"],
      visual: visualLibrary.culture,
    },
    {
      terms: [
        "kits",
        "kitsilano",
        "beach",
        "pool",
        "shoreline",
        "seawall",
        "visitor",
        "hosting",
        "weekend",
        "waterfront",
        "scenic",
        "west-side",
        "west side",
        "sunday",
      ],
      visual: visualLibrary.waterfront,
    },
  ]);

  if (explicitVisual) {
    return explicitVisual;
  }

  if (matchesAny(text, ["rainy", "weather backup"])) {
    return visualLibrary.rainy;
  }

  if (matchesAny(text, ["coffee", "cafe", "brunch"])) {
    return visualLibrary.coffee;
  }

  if (matchesAny(text, ["wellness", "recovery", "reset", "spa"])) {
    return visualLibrary.wellness;
  }

  if (
    matchesAny(text, [
      "kits",
      "kitsilano",
      "beach",
      "pool",
      "shoreline",
      "seawall",
      "west-side",
      "west side",
      "weekend",
      "visitor",
      "waterfront",
      "scenic",
    ])
  ) {
    return visualLibrary.waterfront;
  }

  if (matchesAny(text, ["ubc", "garden", "conservatory", "campus", "nitobe", "vandusen", "botanical"])) {
    return visualLibrary.garden;
  }

  if (matchesAny(text, ["culture", "museum", "gallery", "returning", "false creek", "commercial drive", "chinatown"])) {
    return visualLibrary.culture;
  }

  return visualLibrary.evening;
}

export function getGuideHeroVisual(guide: Guide) {
  if (
    isSceneAsset(guide.image) &&
    !genericGuidePhotos.has(guide.image) &&
    !placeholderSceneAssets.has(guide.image)
  ) {
    return resolvePublicAssetPath(guide.image);
  }

  return getGuideVisual(guide);
}

export function getSourceBackedCollectionVisual(collection: SourceBackedPlaceReference["collection"]) {
  return sourceBackedCollectionVisuals[collection] ?? visualLibrary.evening;
}

function isSpecificSourceBackedPlaceVisualPath(path: string) {
  return (
    path.includes("/assets/businesses/") ||
    path.includes("/assets/places/") ||
    path.includes("/assets/places-generated/")
  );
}

const sourceBackedPlaceNameVisuals: Partial<Record<SourceBackedPlaceReference["name"], string>> = {
  "Art Gallery of Ontario": placeVisualLibrary.artGalleryOfOntario,
  "Beaty Biodiversity Museum": placeVisualLibrary.beatyBiodiversityMuseum,
  "Bentway Staging Grounds": placeVisualLibrary.bentwayStagingGrounds,
  "Bill Reid Gallery": placeVisualLibrary.billReidGallery,
  "Commercial Drive": placeVisualLibrary.commercialDrive,
  "Distillery District": placeVisualLibrary.distilleryDistrict,
  "English Bay Beach": placeVisualLibrary.englishBayBeach,
  "Evergreen Brick Works": placeVisualLibrary.evergreenBrickWorks,
  Gastown: placeVisualLibrary.gastown,
  "Granville Island Public Market": placeVisualLibrary.granvilleIslandPublicMarket,
  "Harbourfront Centre": placeVisualLibrary.harbourfrontCentre,
  "Jericho Beach": placeVisualLibrary.jerichoBeach,
  "Kitsilano Beach": placeVisualLibrary.kitsilanoBeach,
  "Kitsilano Pool": placeVisualLibrary.kitsilanoPool,
  "Locarno Beach": placeVisualLibrary.locarnoBeach,
  "Queen Elizabeth Park": placeVisualLibrary.queenElizabethPark,
  "Royal Ontario Museum": placeVisualLibrary.royalOntarioMuseum,
  "STACKT market": placeVisualLibrary.stacktMarket,
  "Stanley Park": placeVisualLibrary.stanleyPark,
  "St. Lawrence Market": placeVisualLibrary.stLawrenceMarket,
  "Toronto Botanical Garden": placeVisualLibrary.torontoBotanicalGarden,
  "Toronto Music Garden": placeVisualLibrary.torontoMusicGarden,
  "Trout Lake Beach": placeVisualLibrary.troutLakeBeach,
  "Vancouver Public Library Central Library": placeVisualLibrary.vancouverPublicLibraryCentral,
};

export function getSourceBackedPlaceVisual(reference: SourceBackedPlaceReference) {
  const mappedNameVisual = sourceBackedPlaceNameVisuals[reference.name];
  if (mappedNameVisual) {
    return mappedNameVisual;
  }

  const mappedVenueVisual = {
    "published-on-main": venueVisualLibrary.publishedOnMain,
    "kissa-tanto": venueVisualLibrary.kissaTanto,
    labattoir: venueVisualLibrary.labattoir,
    botanist: venueVisualLibrary.botanist,
    "miku-waterfront": venueVisualLibrary.miku,
  }[reference.slug];

  if (mappedVenueVisual) {
    return mappedVenueVisual;
  }

  if (reference.slug.startsWith("bloedel-conservatory")) {
    return placeVisualLibrary.bloedelConservatory;
  }

  if (reference.slug.startsWith("chinatown-storytelling-centre")) {
    return placeVisualLibrary.chinatownStorytellingCentre;
  }

  if (reference.slug.startsWith("dr-sun-yat-sen-chinese-garden")) {
    return placeVisualLibrary.drSunYatSenChineseGarden;
  }

  if (reference.slug.startsWith("museum-of-vancouver")) {
    return placeVisualLibrary.museumOfVancouver;
  }

  if (reference.slug.startsWith("vandusen-botanical-garden")) {
    return placeVisualLibrary.vandusenBotanicalGarden;
  }

  const mappedPlaceVisual = {
    "greenheart-treewalk-ubc-discovery-follow-through": placeVisualLibrary.greenheartTreewalk,
    "museum-of-anthropology-daytime-start": placeVisualLibrary.moa,
    "museum-of-anthropology-returning-visitor-start": placeVisualLibrary.moa,
    "museum-of-anthropology-ubc-discovery-start": placeVisualLibrary.moa,
    "nitobe-memorial-garden-daytime-start": placeVisualLibrary.nitobe,
    "nitobe-memorial-garden-garden-day-start": placeVisualLibrary.nitobe,
    "nitobe-memorial-garden-returning-visitor-start": placeVisualLibrary.nitobe,
    "nitobe-memorial-garden-ubc-discovery-start": placeVisualLibrary.nitobe,
    "space-centre-culture-start": placeVisualLibrary.spaceCentre,
    "space-centre-scenic-start": placeVisualLibrary.spaceCentre,
    "ubc-botanical-garden-daytime-start": placeVisualLibrary.ubcBotanicalGarden,
    "ubc-botanical-garden-garden-day-start": placeVisualLibrary.ubcBotanicalGarden,
    "ubc-botanical-garden-ubc-discovery-start": placeVisualLibrary.ubcBotanicalGarden,
    "vancouver-art-gallery": placeVisualLibrary.vancouverArtGallery,
    "vancouver-art-gallery-downtown-start": placeVisualLibrary.vancouverArtGallery,
    "vancouver-art-gallery-first-evening": placeVisualLibrary.vancouverArtGallery,
    "vancouver-art-gallery-guest-start": placeVisualLibrary.vancouverArtGallery,
    "vancouver-maritime-museum-culture-start": placeVisualLibrary.vancouverMaritimeMuseum,
    "maritime-museum-scenic-start": placeVisualLibrary.vancouverMaritimeMuseum,
  }[reference.slug];

  if (mappedPlaceVisual) {
    return mappedPlaceVisual;
  }

  const text = normalize([
    reference.name,
    reference.category,
    reference.neighborhood,
    reference.routeRole,
    reference.summary,
    reference.whyItFits,
  ]);
  const explicitVisual = findVisualByRules(text, [
    {
      terms: ["granville island public market", "public market", "market hall"],
      visual: visualLibrary.evening,
    },
    {
      terms: ["science world", "space centre", "planetarium", "vancouver maritime museum", "vanier park"],
      visual: visualLibrary.culture,
    },
    {
      terms: ["kitsilano beach", "kits beach", "english bay", "coal harbour", "canada place"],
      visual: visualLibrary.waterfront,
    },
    {
      terms: ["kitsilano pool", "spanish banks", "jericho", "shoreline", "seawall"],
      visual: visualLibrary.waterfront,
    },
    {
      terms: ["sunday", "harbour walk", "low-effort day"],
      visual: visualLibrary.culture,
    },
    {
      terms: ["museum of anthropology", "nitobe memorial garden", "ubc botanical garden", "vandusen"],
      visual: visualLibrary.garden,
    },
    {
      terms: ["wellness", "reset", "recovery", "sauna", "spa", "calm"],
      visual: visualLibrary.wellness,
    },
    {
      terms: ["rope flow", "movement session"],
      visual: visualLibrary.kits,
    },
    {
      terms: ["coffee", "cafe"],
      visual: visualLibrary.coffee,
    },
    {
      terms: ["rain", "weather backup"],
      visual: visualLibrary.rainy,
    },
  ]);

  if (explicitVisual) {
    return explicitVisual;
  }

  if (matchesAny(text, ["coffee", "cafe"])) {
    return visualLibrary.coffee;
  }

  if (matchesAny(text, ["rain", "indoor", "weather"])) {
    return visualLibrary.rainy;
  }

  if (
    matchesAny(text, [
      "kits",
      "beach",
      "pool",
      "shoreline",
      "waterfront",
      "maritime",
      "harbour",
      "seawall",
      "west-side",
      "west side",
    ])
  ) {
    return visualLibrary.waterfront;
  }

  if (matchesAny(text, ["garden", "ubc", "botanical", "conservatory", "campus", "nitobe"])) {
    return visualLibrary.garden;
  }

  if (matchesAny(text, ["wellness", "reset", "calm", "recovery"])) {
    return visualLibrary.wellness;
  }

  if (matchesAny(text, ["museum", "gallery", "science", "harbour", "market", "culture"])) {
    return visualLibrary.culture;
  }

  return getSourceBackedCollectionVisual(reference.collection);
}

export function hasSpecificSourceBackedPlaceVisual(reference: SourceBackedPlaceReference) {
  return isSpecificSourceBackedPlaceVisualPath(getSourceBackedPlaceVisual(reference));
}

export function getBusinessVisual(business: Business) {
  if (
    isSceneAsset(business.heroImage) &&
    !genericGuidePhotos.has(business.heroImage) &&
    !placeholderSceneAssets.has(business.heroImage)
  ) {
    return resolvePublicAssetPath(business.heroImage);
  }

  const text = normalize([
    business.name,
    business.category,
    business.neighborhood,
    business.shortDescription,
    business.fullDescription,
  ]);
  const explicitVisual = findVisualByRules(text, [
    { terms: ["published on main"], visual: venueVisualLibrary.publishedOnMain },
    { terms: ["kissa tanto"], visual: venueVisualLibrary.kissaTanto },
    { terms: ["l'abattoir", "labattoir"], visual: venueVisualLibrary.labattoir },
    { terms: ["botanist"], visual: venueVisualLibrary.botanist },
    { terms: ["miku"], visual: venueVisualLibrary.miku },
  ]);

  if (explicitVisual) {
    return explicitVisual;
  }

  if (matchesAny(text, ["wellness", "recovery", "massage", "mobility", "studio"])) {
    return visualLibrary.wellness;
  }

  if (matchesAny(text, ["coffee", "cafe", "rainline", "work-friendly"])) {
    return visualLibrary.coffee;
  }

  if (matchesAny(text, ["kits", "cycle", "beach", "outdoors", "scenic", "waterfront"])) {
    return visualLibrary.waterfront;
  }

  if (matchesAny(text, ["museum", "gallery", "culture"])) {
    return visualLibrary.culture;
  }

  return visualLibrary.evening;
}

export function getEventVisual(event: EventItem) {
  if (
    isSceneAsset(event.image) &&
    !genericGuidePhotos.has(event.image) &&
    !placeholderSceneAssets.has(event.image)
  ) {
    return resolvePublicAssetPath(event.image);
  }

  const text = normalize([event.title, event.category, event.neighborhood, event.description]);

  if (matchesAny(text, ["rope", "flow", "kits", "beach", "wellness"])) {
    return visualLibrary.kits;
  }

  if (matchesAny(text, ["coffee", "cafe"])) {
    return visualLibrary.coffee;
  }

  if (matchesAny(text, ["rain", "weather"])) {
    return visualLibrary.rainy;
  }

  if (matchesAny(text, ["market", "night"])) {
    return visualLibrary.evening;
  }

  return visualLibrary.evening;
}
