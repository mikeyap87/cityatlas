import { slugify } from "./format.ts";
import type {
  BusinessProspect,
  CityAtlasData,
  CityRolloutTarget,
  ProofCandidate,
  SourceBackedPlaceReference,
} from "../types";
import { buildDefaultSeededBusinessProspects } from "./businessProspectSeeds.ts";
import { shouldTreatProspectAsPartnerAnchor } from "./businessProspectRole.ts";

const rolloutTargets: CityRolloutTarget[] = [
  {
    id: "rollout-vancouver",
    cityKey: "vancouver",
    cityName: "Vancouver",
    country: "Canada",
    phase: "proof_city",
    launchStatus: "active_proof",
    sharedPattern: "shared_with_roam_and_rooms",
    minimumPreparedBusinesses: 40,
    minimumPartnerCandidates: 18,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 14,
    wedge: "City intelligence plus route-led local discovery",
    rationale:
      "Vancouver is the only CityAtlas city with a live source-backed surface, a real guide cluster, and an existing founder proof queue.",
    neighborhoods: [
      "Gastown",
      "Mount Pleasant",
      "Kitsilano",
      "False Creek",
      "West Side",
      "UBC",
      "Downtown",
    ],
    unlockChecklist: [
      "Keep the public wedge answer-first and source-backed.",
      "Grow the internal queue beyond the first proof sprint.",
      "Increase contact-ready businesses before any new outreach approval.",
    ],
  },
  {
    id: "rollout-toronto",
    cityKey: "toronto",
    cityName: "Toronto",
    country: "Canada",
    phase: "next_wave",
    launchStatus: "build_queue",
    sharedPattern: "shared_with_roam_and_rooms",
    minimumPreparedBusinesses: 25,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "First-time visitor, weekend, and local-night routing",
    rationale:
      "Toronto is the cleanest second-city candidate shared across the existing Univenture city-rollout pattern.",
    neighborhoods: [
      "Downtown Core",
      "Queen West",
      "King West",
      "Yorkville",
      "The Annex",
      "Leslieville",
    ],
    unlockChecklist: [
      "Build one strong destination-choice wedge before broad city copy.",
      "Stage at least 10 contact-ready businesses locally.",
      "Keep the city queue no-send until source proof is stronger.",
    ],
  },
  {
    id: "rollout-calgary",
    cityKey: "calgary",
    cityName: "Calgary",
    country: "Canada",
    phase: "next_wave",
    launchStatus: "build_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Compact downtown, recovery, and hosted-visit routing",
    rationale:
      "Calgary is already part of the Roam launch-city ladder, so it fits the shared city-prep machine cleanly.",
    neighborhoods: ["Downtown", "Beltline", "Kensington", "Mission", "Bridgeland"],
    unlockChecklist: [
      "Prove one city wedge locally before any public release work.",
      "Keep the first queue compact and contact-path verified.",
    ],
  },
  {
    id: "rollout-montreal",
    cityKey: "montreal",
    cityName: "Montreal",
    country: "Canada",
    phase: "next_wave",
    launchStatus: "build_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Culture, host-friendly, and slower route discovery",
    rationale:
      "Montreal is already part of the Roam early-access rollout and gives CityAtlas a strong culture-first expansion candidate.",
    neighborhoods: ["Le Plateau", "Mile End", "Old Montreal", "Griffintown", "Verdun"],
    unlockChecklist: [
      "Prioritize source-backed anchors with clear correction paths.",
      "Do not widen into generic city guides before the first wedge is useful.",
    ],
  },
  {
    id: "rollout-ottawa",
    cityKey: "ottawa",
    cityName: "Ottawa",
    country: "Canada",
    phase: "next_wave",
    launchStatus: "build_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Executive, hotel, and low-friction host routing",
    rationale:
      "Ottawa matches the Roam city ladder and creates a practical capital-city proof template for CityAtlas.",
    neighborhoods: ["Centretown", "The Glebe", "Westboro", "ByWard Market", "Hintonburg"],
    unlockChecklist: [
      "Stage a compact city queue before writing city-wide discovery copy.",
      "Keep hotel and event claims review-first.",
    ],
  },
  {
    id: "rollout-seattle",
    cityKey: "seattle",
    cityName: "Seattle",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Neighborhood-first rainy-day, workday, and weekend routing",
    rationale:
      "Seattle sits inside the existing Roam research footprint and fits CityAtlas's weather-and-neighborhood route structure.",
    neighborhoods: ["Capitol Hill", "Ballard", "Queen Anne", "Belltown", "Fremont"],
    unlockChecklist: [
      "Build the business queue locally before publishing any city page.",
      "Keep the discovery lane source-backed and no-send.",
    ],
  },
  {
    id: "rollout-san-francisco",
    cityKey: "san-francisco",
    cityName: "San Francisco",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Compact high-density route planning for visitors and locals",
    rationale:
      "San Francisco is already part of the Roam city-prep machine and should reuse that rollout discipline for CityAtlas.",
    neighborhoods: ["SoMa", "Mission", "Pacific Heights", "Marina", "Nob Hill"],
    unlockChecklist: [
      "Start with one route wedge, not a broad city shell.",
      "Verify business-contact quality before any outreach packet exists.",
    ],
  },
  {
    id: "rollout-los-angeles",
    cityKey: "los-angeles",
    cityName: "Los Angeles",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam_and_rooms",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Neighborhood-led route choice instead of sprawling must-see lists",
    rationale:
      "Los Angeles is already named in both the Roam and Rooms expansion logic and fits a route-choice visibility system well.",
    neighborhoods: ["Santa Monica", "Venice", "West Hollywood", "Silver Lake", "Beverly Hills"],
    unlockChecklist: [
      "Lead with route choice and area fit.",
      "Avoid city-complete claims until the queue has real coverage.",
    ],
  },
  {
    id: "rollout-new-york",
    cityKey: "new-york",
    cityName: "New York",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam_and_rooms",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Area-start guidance for first-time, repeat, and hosted visits",
    rationale:
      "New York is part of the shared Roam + Rooms expansion pattern and deserves a reusable city-choice template before any public launch work.",
    neighborhoods: ["SoHo", "Chelsea", "Williamsburg", "Upper West Side", "Brooklyn Heights"],
    unlockChecklist: [
      "Do not publish a generic city shell.",
      "Prepare the internal queue and first query map first.",
    ],
  },
  {
    id: "rollout-miami",
    cityKey: "miami",
    cityName: "Miami",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam_and_rooms",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Hospitality, nightlife, and hosted-weekend route planning",
    rationale:
      "Miami appears inside the shared expansion pattern and is a natural city for route-led nightlife and hosted-visit discovery.",
    neighborhoods: ["Brickell", "Miami Beach", "Wynwood", "Design District", "Coconut Grove"],
    unlockChecklist: [
      "Stage a hospitality-safe queue locally first.",
      "Keep partnership and nightlife claims conservative.",
    ],
  },
  {
    id: "rollout-london",
    cityKey: "london",
    cityName: "London",
    country: "United Kingdom",
    phase: "later_global_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_rooms",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "District-choice and culture-heavy route discovery",
    rationale:
      "London is already a named Rooms expansion city and belongs in the later global CityAtlas lane once North American proof is stronger.",
    neighborhoods: ["Soho", "Shoreditch", "Notting Hill", "Marylebone", "Hackney"],
    unlockChecklist: [
      "Keep London in research mode until the North American rollout machine is repeatable.",
      "Focus on reusable route templates, not premature publishing.",
    ],
  },
  {
    id: "rollout-dubai",
    cityKey: "dubai",
    cityName: "Dubai",
    country: "United Arab Emirates",
    phase: "later_global_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_rooms",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Hospitality, premium routing, and short-visit planning",
    rationale:
      "Dubai is already part of the Rooms future-city map and should stay in later-wave research until the CityAtlas machine is more mature.",
    neighborhoods: ["Downtown Dubai", "DIFC", "Jumeirah", "Dubai Marina", "Alserkal"],
    unlockChecklist: [
      "Hold this city in research mode only.",
      "Do not widen beyond queue and template prep.",
    ],
  },
  {
    id: "rollout-tokyo",
    cityKey: "tokyo",
    cityName: "Tokyo",
    country: "Japan",
    phase: "later_global_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam_and_rooms",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "District-fit planning for first evenings, food routes, and repeat visits",
    rationale:
      "Tokyo appears in both the Roam and Rooms expansion patterns and is a strong long-term CityAtlas route-choice city.",
    neighborhoods: ["Shibuya", "Shinjuku", "Ginza", "Ebisu", "Meguro"],
    unlockChecklist: [
      "Keep it template-ready only for now.",
      "Do not create thin public city pages before the queue is real.",
    ],
  },
  {
    id: "rollout-lisbon",
    cityKey: "lisbon",
    cityName: "Lisbon",
    country: "Portugal",
    phase: "later_global_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Hospitality-first visitor routing and slower neighborhood discovery",
    rationale:
      "Lisbon is already part of the Roam planned-city ladder and fits the same hosted-visit and route-choice machine CityAtlas is building.",
    neighborhoods: ["Baixa", "Chiado", "Alfama", "Bairro Alto", "Principe Real"],
    unlockChecklist: [
      "Keep it in research mode until the North American machine is repeatable.",
      "Build a compact hospitality-safe queue before any public city shell exists.",
    ],
  },
  {
    id: "rollout-barcelona",
    cityKey: "barcelona",
    cityName: "Barcelona",
    country: "Spain",
    phase: "later_global_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "District-fit planning for travelers, evenings, and recovery days",
    rationale:
      "Barcelona already exists in the Roam rollout map and should share the same neighborhood-first template discipline rather than a generic city guide.",
    neighborhoods: ["Eixample", "Gracia", "El Born", "Barceloneta", "Poblenou"],
    unlockChecklist: [
      "Start with one district-choice wedge only.",
      "Keep the queue source-backed and no-send until contact quality is proven.",
    ],
  },
  {
    id: "rollout-mexico-city",
    cityKey: "mexico-city",
    cityName: "Mexico City",
    country: "Mexico",
    phase: "later_global_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Neighborhood-led route choice for premium local plans and hosted visits",
    rationale:
      "Mexico City is a Roam ladder city with dense neighborhood clusters that fit CityAtlas's route-led discovery model well.",
    neighborhoods: ["Roma Norte", "Condesa", "Polanco", "Juarez", "Coyoacan"],
    unlockChecklist: [
      "Do not widen into city-complete copy.",
      "Prove one neighborhood-intent wedge before any public release work.",
    ],
  },
  {
    id: "rollout-berlin",
    cityKey: "berlin",
    cityName: "Berlin",
    country: "Germany",
    phase: "later_global_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Culture-forward district routing and hosted-evening discovery",
    rationale:
      "Berlin is already in the Roam city ladder and gives CityAtlas a later-wave culture-and-hospitality test bed once the first machine is stronger.",
    neighborhoods: ["Mitte", "Prenzlauer Berg", "Kreuzberg", "Charlottenburg", "Neukolln"],
    unlockChecklist: [
      "Keep Berlin template-ready only for now.",
      "Build contact-path proof before any business-development packet exists.",
    ],
  },
  {
    id: "rollout-chicago",
    cityKey: "chicago",
    cityName: "Chicago",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Hotel, dinner, and executive-neighborhood routing",
    rationale:
      "Chicago is part of the Roam planned-city ladder and fits a practical North American expansion wave for CityAtlas once Vancouver proof is deeper.",
    neighborhoods: ["River North", "West Loop", "Gold Coast", "Lincoln Park", "Wicker Park"],
    unlockChecklist: [
      "Build the internal city queue first.",
      "Keep hospitality and event claims review-first until the first wedge is real.",
    ],
  },
  {
    id: "rollout-austin",
    cityKey: "austin",
    cityName: "Austin",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Event-friendly local routing and hosted-visit discovery",
    rationale:
      "Austin sits inside the Roam city map and can reuse the same neighborhood-plus-event-route template CityAtlas is building for Vancouver.",
    neighborhoods: ["Downtown", "South Congress", "East Austin", "Zilker", "Mueller"],
    unlockChecklist: [
      "Keep it queue-first and no-send.",
      "Lead with one useful route wedge, not a broad city shell.",
    ],
  },
  {
    id: "rollout-portland",
    cityKey: "portland",
    cityName: "Portland",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Rain-aware neighborhood planning and boutique local discovery",
    rationale:
      "Portland already exists inside the Roam planned-city ladder and matches CityAtlas's slower, neighborhood-first route style.",
    neighborhoods: ["Pearl District", "Nob Hill", "Hawthorne", "Division", "Alberta"],
    unlockChecklist: [
      "Keep the first queue compact and local-business safe.",
      "Do not publish city-wide guidance before the first wedge has source proof.",
    ],
  },
  {
    id: "rollout-denver",
    cityKey: "denver",
    cityName: "Denver",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Recovery, weekend, and active-lifestyle route planning",
    rationale:
      "Denver is already in the Roam city ladder and gives CityAtlas a strong recovery-and-weekend route candidate for a later North American wave.",
    neighborhoods: ["LoDo", "RiNo", "Cherry Creek", "Capitol Hill", "Highlands"],
    unlockChecklist: [
      "Keep it in local queue mode only.",
      "Prove one route family before any broader city copy exists.",
    ],
  },
  {
    id: "rollout-boston",
    cityKey: "boston",
    cityName: "Boston",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Compact district choice for hotel, university, and executive visits",
    rationale:
      "Boston is already present in the Roam planned-city ladder and fits CityAtlas's area-start guidance model for first-time and hosted visits.",
    neighborhoods: ["Back Bay", "Beacon Hill", "South End", "Seaport", "Cambridge"],
    unlockChecklist: [
      "Build the queue before the copy.",
      "Keep business-contact quality explicit and review-first.",
    ],
  },
  {
    id: "rollout-washington-dc",
    cityKey: "washington-dc",
    cityName: "Washington DC",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Executive, hospitality, and low-friction short-visit routing",
    rationale:
      "Washington DC is part of the Roam city ladder and gives CityAtlas a strong policy-and-hospitality city pattern once the current proof city is stronger.",
    neighborhoods: ["Georgetown", "Dupont Circle", "Navy Yard", "Capitol Hill", "Adams Morgan"],
    unlockChecklist: [
      "Do not publish a thin city page.",
      "Seed one compact hotel-and-hosted-visit queue first.",
    ],
  },
  {
    id: "rollout-san-diego",
    cityKey: "san-diego",
    cityName: "San Diego",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Coastal recovery, hosted-weekend, and slower route planning",
    rationale:
      "San Diego is already part of the Roam city ladder and fits a destination-choice version of the CityAtlas route machine well.",
    neighborhoods: ["Gaslamp", "La Jolla", "Mission Beach", "North Park", "Little Italy"],
    unlockChecklist: [
      "Keep this queue-first and no-send.",
      "Build one route wedge before any public city release is packaged.",
    ],
  },
  {
    id: "rollout-atlanta",
    cityKey: "atlanta",
    cityName: "Atlanta",
    country: "United States",
    phase: "expansion_wave",
    launchStatus: "research_queue",
    sharedPattern: "shared_with_roam",
    minimumPreparedBusinesses: 20,
    minimumPartnerCandidates: 10,
    minimumContactReadyBusinesses: 10,
    minimumSourceBackedCollections: 1,
    wedge: "Corporate, dinner, and hosted-event route planning",
    rationale:
      "Atlanta is already in the Roam planned-city map and gives CityAtlas another practical North American city for hospitality and hosted-visit routing later on.",
    neighborhoods: ["Midtown", "Buckhead", "Old Fourth Ward", "West Midtown", "Decatur"],
    unlockChecklist: [
      "Keep the queue local and review-first.",
      "Do not widen into generic city copy until the first wedge is useful.",
    ],
  },
];

const outreachStatusRank: Record<BusinessProspect["outreachStatus"], number> = {
  not_started: 0,
  draft_ready: 1,
  held: 2,
  approved_to_send: 3,
  sent_manual: 4,
  replied: 5,
  do_not_contact: 6,
};

const approvalStatusRank: Record<BusinessProspect["approvalStatus"], number> = {
  review_only: 0,
  ready_for_owner_review: 1,
  owner_approved: 2,
  blocked: 3,
};

const contactReadinessRank: Record<BusinessProspect["contactReadiness"], number> = {
  needs_research: 0,
  contact_path_ready: 1,
  email_ready: 2,
};

const confidenceRank: Record<BusinessProspect["contactConfidence"], number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const relationshipWarmthRank: Record<BusinessProspect["relationshipWarmth"], number> = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

const sourceTypeRank: Record<BusinessProspect["sourceType"], number> = {
  source_backed_place: 0,
  proof_candidate: 1,
  manual_submission: 2,
  manual_import: 3,
};

export interface CityBusinessRollup {
  cityKey: string;
  cityName: string;
  phase: CityRolloutTarget["phase"];
  status: "Prepared" | "Building" | "Queued";
  progress: number;
  totalProspects: number;
  partnerCandidateCount: number;
  anchorOnlyCount: number;
  contactReadyCount: number;
  emailReadyCount: number;
  sourceBackedCount: number;
  proofQueueCount: number;
  sourceBackedCollections: number;
  guideCount: number;
  nextAction: string;
}

export interface CityRolloutThresholdGap {
  key:
    | "unique_prospects"
    | "partner_eligible"
    | "contact_ready"
    | "source_backed_collections";
  label: string;
  current: number;
  required: number;
  remaining: number;
}

export interface CityRolloutInsight {
  rollup: CityBusinessRollup;
  target?: CityRolloutTarget;
  missingThresholds: CityRolloutThresholdGap[];
}

export type BusinessProspectRole =
  | "anchor_only"
  | "partner_candidate"
  | "partner_and_anchor";

export interface BusinessProspectImportInput {
  businessName: string;
  email: string;
  contactName: string;
  cityName: string;
  municipality?: string;
  marketScope?: BusinessProspect["marketScope"];
  neighborhood: string;
  category: string;
  segment: string;
  sourceLabel: string;
  sourceUrl: string;
  website: string;
  contactPath: string;
  notes: string;
  relationshipWarmth: BusinessProspect["relationshipWarmth"];
}

export interface BusinessProspectImportRow {
  rowNumber: number;
  raw: string[];
  input: BusinessProspectImportInput;
  prospect: BusinessProspect;
  warnings: string[];
  errors: string[];
  duplicateOf?: BusinessProspect;
  importable: boolean;
}

export interface BusinessProspectImportPreview {
  rows: BusinessProspectImportRow[];
  importableRows: BusinessProspectImportRow[];
  duplicateCount: number;
  warningCount: number;
  errorCount: number;
  batchId: string;
  summary: string;
}

const importHeaders = [
  "businessName",
  "email",
  "contactName",
  "cityName",
  "neighborhood",
  "category",
  "segment",
  "sourceLabel",
  "sourceUrl",
  "website",
  "contactPath",
  "notes",
  "relationshipWarmth",
];

export const businessProspectImportHeaders = [...importHeaders];

export function buildDefaultCityRolloutTargets() {
  return rolloutTargets.map((target) => ({
    ...target,
    neighborhoods: [...target.neighborhoods],
    unlockChecklist: [...target.unlockChecklist],
  }));
}

export function buildDefaultBusinessProspects(
  data: Pick<CityAtlasData, "sourceBackedPlaces" | "proofCandidates">,
) {
  const sourceBackedProspects = data.sourceBackedPlaces.map(mapSourceBackedPlaceToProspect);
  const proofQueueProspects = data.proofCandidates.map(mapProofCandidateToProspect);
  const donorProspects = buildDefaultSeededBusinessProspects();
  return mergeBusinessProspects(sourceBackedProspects, [...proofQueueProspects, ...donorProspects]);
}

export function mergeBusinessProspects(base: BusinessProspect[], incoming: BusinessProspect[]) {
  const merged: BusinessProspect[] = [];

  for (const next of [...base, ...incoming]) {
    const candidate = cloneProspect(next);
    const matchIndex = merged.findIndex((current) => prospectsMatch(current, candidate));
    if (matchIndex === -1) {
      merged.push(candidate);
      continue;
    }
    merged[matchIndex] = mergeProspect(merged[matchIndex], candidate);
  }

  return merged.sort((left, right) => {
    const cityCompare = left.cityName.localeCompare(right.cityName);
    if (cityCompare !== 0) return cityCompare;
    const readinessCompare =
      contactReadinessRank[right.contactReadiness] - contactReadinessRank[left.contactReadiness];
    if (readinessCompare !== 0) return readinessCompare;
    const confidenceCompare =
      confidenceRank[right.contactConfidence] - confidenceRank[left.contactConfidence];
    if (confidenceCompare !== 0) return confidenceCompare;
    return left.businessName.localeCompare(right.businessName);
  });
}

export function buildCityBusinessRollups(
  data: Pick<CityAtlasData, "businessProspects" | "cityRolloutTargets" | "guides">,
) {
  return data.cityRolloutTargets.map((target) => {
    const cityProspects = data.businessProspects.filter((prospect) => prospect.cityKey === target.cityKey);
    const partnerCandidateCount = cityProspects.filter(isPartnerEligibleProspect).length;
    const anchorOnlyCount = cityProspects.filter(
      (prospect) => classifyBusinessProspectRole(prospect) === "anchor_only",
    ).length;
    const contactReadyCount = cityProspects.filter(
      (prospect) => prospect.contactReadiness !== "needs_research",
    ).length;
    const emailReadyCount = cityProspects.filter(
      (prospect) => prospect.contactReadiness === "email_ready",
    ).length;
    const sourceBackedCount = cityProspects.filter(
      (prospect) => prospect.sourceType === "source_backed_place",
    ).length;
    const proofQueueCount = cityProspects.filter(
      (prospect) => prospect.sourceType === "proof_candidate",
    ).length;
    const sourceBackedCollections = new Set(
      cityProspects.flatMap((prospect) =>
        prospect.collectionIds.length
          ? prospect.collectionIds
          : prospect.sourceCollection
            ? [prospect.sourceCollection]
            : [],
      ),
    ).size;
    const guideCount = data.guides.filter(
      (guide) => (guide.citySlug ?? "vancouver") === target.cityKey,
    ).length;

    const prospectProgress = percent(cityProspects.length, target.minimumPreparedBusinesses);
    const partnerProgress = percent(partnerCandidateCount, target.minimumPartnerCandidates);
    const contactProgress = percent(contactReadyCount, target.minimumContactReadyBusinesses);
    const collectionProgress = percent(
      sourceBackedCollections,
      target.minimumSourceBackedCollections,
    );
    const progress = Math.round(
      (prospectProgress + partnerProgress + contactProgress + collectionProgress) / 4,
    );

    const status =
      cityProspects.length >= target.minimumPreparedBusinesses &&
      partnerCandidateCount >= target.minimumPartnerCandidates &&
      contactReadyCount >= target.minimumContactReadyBusinesses &&
      sourceBackedCollections >= target.minimumSourceBackedCollections
        ? "Prepared"
        : cityProspects.length > 0 || sourceBackedCollections > 0
          ? "Building"
          : "Queued";

    return {
      cityKey: target.cityKey,
      cityName: target.cityName,
      phase: target.phase,
      status,
      progress,
      totalProspects: cityProspects.length,
      partnerCandidateCount,
      anchorOnlyCount,
      contactReadyCount,
      emailReadyCount,
      sourceBackedCount,
      proofQueueCount,
      sourceBackedCollections,
      guideCount,
      nextAction:
        status === "Prepared"
          ? "Keep the city queue review-first, widen partner candidates carefully, and only add new anchors when they strengthen public city guidance."
          : status === "Building"
            ? `Keep building toward ${target.minimumPreparedBusinesses} unique prospects, ${target.minimumPartnerCandidates} partner-eligible rows, and ${target.minimumContactReadyBusinesses} contact-ready rows.`
            : "Seed the first city queue locally before writing or releasing public city pages.",
    } satisfies CityBusinessRollup;
  });
}

export function buildCityRolloutInsights(
  cityRollups: CityBusinessRollup[],
  cityRolloutTargets: CityRolloutTarget[],
) {
  const targetByCityKey = new Map(cityRolloutTargets.map((target) => [target.cityKey, target]));

  return cityRollups.map((rollup) => {
    const target = targetByCityKey.get(rollup.cityKey);
    const missingThresholds = target
      ? [
          {
            key: "unique_prospects" as const,
            label: "unique prospects",
            current: rollup.totalProspects,
            required: target.minimumPreparedBusinesses,
            remaining: Math.max(0, target.minimumPreparedBusinesses - rollup.totalProspects),
          },
          {
            key: "partner_eligible" as const,
            label: "partner-eligible rows",
            current: rollup.partnerCandidateCount,
            required: target.minimumPartnerCandidates,
            remaining: Math.max(0, target.minimumPartnerCandidates - rollup.partnerCandidateCount),
          },
          {
            key: "contact_ready" as const,
            label: "contact-ready rows",
            current: rollup.contactReadyCount,
            required: target.minimumContactReadyBusinesses,
            remaining: Math.max(0, target.minimumContactReadyBusinesses - rollup.contactReadyCount),
          },
          {
            key: "source_backed_collections" as const,
            label: "source-backed collection starter",
            current: rollup.sourceBackedCollections,
            required: target.minimumSourceBackedCollections,
            remaining: Math.max(0, target.minimumSourceBackedCollections - rollup.sourceBackedCollections),
          },
        ].filter((gap) => gap.remaining > 0)
      : [];

    return {
      rollup,
      target,
      missingThresholds,
    } satisfies CityRolloutInsight;
  });
}

export function rankFollowOnCityInsights(
  insights: CityRolloutInsight[],
  proofCityKey = "vancouver",
) {
  return insights
    .filter((insight) => insight.rollup.cityKey !== proofCityKey && insight.rollup.totalProspects > 0)
    .sort((left, right) => {
      if (right.rollup.progress !== left.rollup.progress) {
        return right.rollup.progress - left.rollup.progress;
      }
      if (right.rollup.contactReadyCount !== left.rollup.contactReadyCount) {
        return right.rollup.contactReadyCount - left.rollup.contactReadyCount;
      }
      return right.rollup.totalProspects - left.rollup.totalProspects;
    });
}

export function listUnseededCityInsights(insights: CityRolloutInsight[]) {
  return insights
    .filter((insight) => insight.rollup.totalProspects === 0)
    .sort((left, right) => left.rollup.cityName.localeCompare(right.rollup.cityName));
}

export function classifyBusinessProspectRole(
  prospect: BusinessProspect,
): BusinessProspectRole {
  if (prospect.sourceType !== "source_backed_place") {
    return "partner_candidate";
  }

  if (shouldTreatProspectAsPartnerAnchor(prospect)) {
    return "partner_and_anchor";
  }

  return "anchor_only";
}

export function isPartnerEligibleProspect(prospect: BusinessProspect) {
  return classifyBusinessProspectRole(prospect) !== "anchor_only";
}

export function countPartnerEligibleProspects(prospects: BusinessProspect[]) {
  return prospects.filter(isPartnerEligibleProspect).length;
}

export function parseBusinessProspectImport(
  text: string,
  existingProspects: BusinessProspect[],
) {
  const batchId = `cityatlas-import-${new Date().toISOString().slice(0, 10)}`;
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const contentLines = hasImportHeader(lines[0]) ? lines.slice(1) : lines;
  const seenProspects = [...existingProspects];
  const rows = contentLines.map((line, index) => {
    const row = buildImportRow(line, index + 1, seenProspects, batchId);
    if (row.importable) {
      seenProspects.push(row.prospect);
    }
    return row;
  });
  const importableRows = rows.filter((row) => row.importable);

  return {
    rows,
    importableRows,
    duplicateCount: rows.filter((row) => row.duplicateOf).length,
    warningCount: rows.reduce((sum, row) => sum + row.warnings.length, 0),
    errorCount: rows.reduce((sum, row) => sum + row.errors.length, 0),
    batchId,
    summary:
      rows.length === 0
        ? "Paste a small EXA or manual research batch here to preview it before anything enters the local queue."
        : `${importableRows.length}/${rows.length} rows are safe to add locally. No outreach is sent from this lane.`,
  } satisfies BusinessProspectImportPreview;
}

export function createImportedBusinessProspects(rows: BusinessProspectImportRow[]) {
  return createBusinessProspectsFromImportInputs(
    rows.filter((row) => row.importable).map((row) => row.input),
  );
}

export function createBusinessProspectsFromImportInputs(
  inputs: BusinessProspectImportInput[],
  importBatchId = `cityatlas-import-${Date.now()}`,
) {
  return inputs.map((input) => buildManualImportProspect(input, importBatchId));
}

function mapSourceBackedPlaceToProspect(place: SourceBackedPlaceReference): BusinessProspect {
  const cityKey = getCollectionCityKey(place.collection);
  const cityName = getCityName(cityKey);
  return {
    id: `prospect-${place.id}`,
    cityKey,
    cityName,
    businessName: place.name,
    slug: place.slug,
    neighborhood: place.neighborhood,
    category: place.category,
    segment: place.routeRole,
    sourceType: "source_backed_place",
    sourceCollection: place.collection,
    sourceLabel: place.officialSourceLabel,
    sourceUrl: place.officialSourceUrl,
    website: place.officialSourceUrl,
    contactName: "",
    email: "",
    contactPath: place.officialSourceUrl,
    contactPathType: "official_site",
    contactConfidence: "low",
    contactReadiness: "needs_research",
    outreachStatus: "not_started",
    approvalStatus: "review_only",
    sourceProof: `${place.officialSourceLabel} checked ${place.sourceCheckedAt}.`,
    relationshipWarmth: "unknown",
    notes: `${place.whyItFits} Correction path: ${place.correctionPath}`,
    collectionIds: [place.collection],
    lastUpdatedAt: place.sourceCheckedAt,
  };
}

function mapProofCandidateToProspect(candidate: ProofCandidate): BusinessProspect {
  const email = candidate.contactPathType === "direct_email" ? extractEmail(candidate.contactPath) : "";
  const contactPathType = normalizeContactPathType(candidate.contactPathType, candidate.contactPath);

  return {
    id: `prospect-${candidate.id}`,
    cityKey: "vancouver",
    cityName: "Vancouver",
    businessName: candidate.name,
    slug: slugify(candidate.name),
    neighborhood: "",
    category: candidate.roleInMission,
    segment: candidate.segment,
    sourceType: "proof_candidate",
    sourceCollection: undefined,
    sourceLabel: "Founder proof sprint queue",
    sourceUrl: candidate.sourceUrl,
    website: candidate.sourceUrl,
    contactName: "",
    email,
    contactPath: candidate.contactPath,
    contactPathType,
    contactConfidence: candidate.contactConfidence,
    contactReadiness: getContactReadiness(email, candidate.contactPath),
    outreachStatus: mapOutreachStatus(candidate.outreachStatus),
    approvalStatus: mapApprovalStatus(candidate.approvalStatus),
    sourceProof: candidate.contactResearchNote || candidate.riskNotes || candidate.routeAngle,
    relationshipWarmth: "unknown",
    notes: `${candidate.routeAngle}. ${candidate.nextStep}`,
    collectionIds: [],
    lastUpdatedAt: candidate.lastContactResearchAt,
  };
}

function buildImportRow(
  rawLine: string,
  rowNumber: number,
  existingProspects: BusinessProspect[],
  batchId: string,
): BusinessProspectImportRow {
  const raw = parseDelimitedLine(rawLine);
  const input: BusinessProspectImportInput = {
    businessName: raw[0]?.trim() || "",
    email: raw[1]?.trim().toLowerCase() || "",
    contactName: raw[2]?.trim() || "",
    cityName: raw[3]?.trim() || "Vancouver",
    neighborhood: raw[4]?.trim() || "",
    category: raw[5]?.trim() || "Local discovery",
    segment: raw[6]?.trim() || "Local business",
    sourceLabel: raw[7]?.trim() || "Manual research import",
    sourceUrl: raw[8]?.trim() || "",
    website: raw[9]?.trim() || raw[8]?.trim() || "",
    contactPath: raw[10]?.trim() || raw[8]?.trim() || "",
    notes: raw[11]?.trim() || "",
    relationshipWarmth: normalizeRelationshipWarmth(raw[12]?.trim()),
  };

  const prospect = buildManualImportProspect(input, batchId);
  const duplicateOf = existingProspects.find((existing) => prospectsMatch(existing, prospect));
  const errors = getImportErrors(input);
  const warnings = getImportWarnings(input, prospect, duplicateOf);

  return {
    rowNumber,
    raw,
    input,
    prospect,
    warnings,
    errors,
    duplicateOf,
    importable: errors.length === 0 && !duplicateOf,
  };
}

function buildManualImportProspect(
  input: BusinessProspectImportInput,
  importBatchId = `cityatlas-import-${Date.now()}`,
): BusinessProspect {
  const cityKey = slugify(input.cityName) || "vancouver";
  const email = input.email.trim().toLowerCase();
  const sourceUrl = input.sourceUrl.trim();
  const contactPath = input.contactPath.trim() || sourceUrl || input.website.trim();
  const municipality = input.municipality?.trim() || input.cityName.trim() || getCityName(cityKey);
  const marketScope = input.marketScope
    || (
      cityKey === "vancouver" && municipality && municipality !== "Vancouver"
        ? "metro_area"
        : "city_only"
    );

  return {
    id: `prospect-import-${slugify(input.businessName || "business")}-${slugify(input.cityName || "city")}`,
    cityKey,
    cityName: input.cityName.trim() || getCityName(cityKey),
    municipality,
    marketScope,
    businessName: input.businessName.trim(),
    slug: slugify(input.businessName),
    neighborhood: input.neighborhood.trim(),
    category: input.category.trim() || "Local discovery",
    segment: input.segment.trim() || "Local business",
    sourceType: "manual_import",
    sourceCollection: undefined,
    sourceLabel: input.sourceLabel.trim() || "Manual research import",
    sourceUrl,
    website: input.website.trim() || sourceUrl,
    contactName: input.contactName.trim(),
    email,
    contactPath,
    contactPathType: normalizeContactPathType(
      email ? "direct_email" : "contact_page",
      contactPath,
    ),
    contactConfidence: email ? "high" : contactPath ? "medium" : "low",
    contactReadiness: getContactReadiness(email, contactPath),
    outreachStatus: "not_started",
    approvalStatus: "review_only",
    sourceProof: [input.sourceLabel.trim(), sourceUrl].filter(Boolean).join(" - "),
    relationshipWarmth: input.relationshipWarmth,
    notes: input.notes.trim() || "Imported for local review only. No outreach sent.",
    collectionIds: [],
    importBatchId,
    lastUpdatedAt: new Date().toISOString(),
  };
}

function prospectsMatch(left: BusinessProspect, right: BusinessProspect) {
  const leftUrl = normalizeMatchValue(left.sourceUrl || left.website);
  const rightUrl = normalizeMatchValue(right.sourceUrl || right.website);
  if (leftUrl && rightUrl && leftUrl === rightUrl) return true;

  const leftEmail = normalizeMatchValue(left.email);
  const rightEmail = normalizeMatchValue(right.email);
  if (leftEmail && rightEmail && leftEmail === rightEmail) return true;

  const leftNameCity = normalizeMatchValue(`${left.businessName}-${left.cityKey}`);
  const rightNameCity = normalizeMatchValue(`${right.businessName}-${right.cityKey}`);
  return Boolean(leftNameCity && rightNameCity && leftNameCity === rightNameCity);
}

function mergeProspect(current: BusinessProspect, next: BusinessProspect): BusinessProspect {
  const collectionIds = [...new Set([...current.collectionIds, ...next.collectionIds])];
  const bothSourceBacked =
    current.sourceType === "source_backed_place" &&
    next.sourceType === "source_backed_place";

  return {
    ...current,
    ...next,
    id: current.id,
    municipality: next.municipality || current.municipality,
    marketScope:
      next.marketScope === "metro_area" || current.marketScope === "metro_area"
        ? "metro_area"
        : next.marketScope || current.marketScope,
    sourceType:
      sourceTypeRank[next.sourceType] > sourceTypeRank[current.sourceType]
        ? next.sourceType
        : current.sourceType,
    sourceCollection: current.sourceCollection ?? next.sourceCollection,
    sourceLabel: chooseLonger(current.sourceLabel, next.sourceLabel),
    sourceUrl: chooseLonger(current.sourceUrl, next.sourceUrl),
    website: chooseLonger(current.website, next.website),
    contactName: chooseLonger(current.contactName, next.contactName),
    email: chooseLonger(current.email, next.email),
    contactPath: chooseLonger(current.contactPath, next.contactPath),
    contactPathType:
      contactReadinessRank[next.contactReadiness] >=
      contactReadinessRank[current.contactReadiness]
        ? next.contactPathType
        : current.contactPathType,
    contactConfidence:
      confidenceRank[next.contactConfidence] > confidenceRank[current.contactConfidence]
        ? next.contactConfidence
        : current.contactConfidence,
    contactReadiness:
      contactReadinessRank[next.contactReadiness] > contactReadinessRank[current.contactReadiness]
        ? next.contactReadiness
        : current.contactReadiness,
    outreachStatus:
      outreachStatusRank[next.outreachStatus] > outreachStatusRank[current.outreachStatus]
        ? next.outreachStatus
        : current.outreachStatus,
    approvalStatus:
      approvalStatusRank[next.approvalStatus] > approvalStatusRank[current.approvalStatus]
        ? next.approvalStatus
        : current.approvalStatus,
    sourceProof: bothSourceBacked
      ? chooseLonger(current.sourceProof, next.sourceProof)
      : joinUnique(current.sourceProof, next.sourceProof),
    relationshipWarmth:
      relationshipWarmthRank[next.relationshipWarmth] >
      relationshipWarmthRank[current.relationshipWarmth]
        ? next.relationshipWarmth
        : current.relationshipWarmth,
    notes: bothSourceBacked
      ? buildSourceBackedCoverageNote(
          chooseLonger(stripSourceBackedCoverageNote(current.notes), stripSourceBackedCoverageNote(next.notes)),
          collectionIds.length,
        )
      : joinUnique(current.notes, next.notes),
    collectionIds,
    importBatchId: chooseLonger(current.importBatchId || "", next.importBatchId || "") || undefined,
    lastUpdatedAt: newerDate(current.lastUpdatedAt, next.lastUpdatedAt),
  };
}

function mapOutreachStatus(status: ProofCandidate["outreachStatus"]): BusinessProspect["outreachStatus"] {
  switch (status) {
    case "draft_ready":
      return "draft_ready";
    case "approved_to_send":
      return "approved_to_send";
    case "sent_manual":
      return "sent_manual";
    case "replied":
      return "replied";
    case "not_fit":
      return "do_not_contact";
    default:
      return "not_started";
  }
}

function mapApprovalStatus(status: ProofCandidate["approvalStatus"]): BusinessProspect["approvalStatus"] {
  switch (status) {
    case "owner_approved_private_preview":
    case "owner_approved_manual_outreach":
      return "owner_approved";
    case "blocked":
      return "blocked";
    default:
      return "ready_for_owner_review";
  }
}

function normalizeContactPathType(
  type: string,
  contactPath: string,
): BusinessProspect["contactPathType"] {
  if (type === "direct_email") return "direct_email";
  if (type === "phone_or_text") return "phone_or_text";
  if (type === "reservation_platform") return "reservation_platform";
  if (type === "protected_email_link") return "protected_email_link";
  if (type === "private_events_form") return "private_events_form";
  if (type === "needs_manual_lookup") return "needs_manual_lookup";
  if (type === "warm_intro") return "warm_intro";
  if (/instagram/i.test(contactPath)) return "instagram_dm";
  if (/mailto:/i.test(contactPath)) return "direct_email";
  if (/^tel:/i.test(contactPath)) return "phone_or_text";
  if (contactPath) return "contact_page";
  return "needs_manual_lookup";
}

function getContactReadiness(email: string, contactPath: string): BusinessProspect["contactReadiness"] {
  if (email) return "email_ready";
  if (contactPath) return "contact_path_ready";
  return "needs_research";
}

function getImportErrors(input: BusinessProspectImportInput) {
  const errors: string[] = [];
  if (!input.businessName.trim()) errors.push("Business name is required.");
  if (!input.cityName.trim()) errors.push("City name is required.");
  if (!input.sourceLabel.trim()) errors.push("Source label is required.");
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.push("Email must be valid when provided.");
  }
  if (!input.sourceUrl.trim() && !input.contactPath.trim()) {
    errors.push("Add a source URL or a contact path.");
  }
  return errors;
}

function getImportWarnings(
  input: BusinessProspectImportInput,
  prospect: BusinessProspect,
  duplicateOf?: BusinessProspect,
) {
  const warnings: string[] = [];
  if (duplicateOf) warnings.push(`Duplicate of ${duplicateOf.businessName}.`);
  if (!input.email.trim()) warnings.push("No direct email yet; keep this row in contact-path review.");
  if (!input.contactName.trim()) warnings.push("Add a contact name later if one becomes clear.");
  if (prospect.contactReadiness === "needs_research") warnings.push("Needs stronger contact research.");
  if (prospect.relationshipWarmth === "unknown") warnings.push("Relationship warmth is unknown.");
  return warnings;
}

function parseDelimitedLine(line: string) {
  const delimiter = line.includes("\t") ? "\t" : ",";
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];
    if (character === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }
    if (character === '"') {
      quoted = !quoted;
      continue;
    }
    if (character === delimiter && !quoted) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }

  cells.push(current.trim());
  return cells;
}

function hasImportHeader(line = "") {
  const normalized = line.toLowerCase();
  return importHeaders.slice(0, 5).every((header) => normalized.includes(header.toLowerCase()));
}

function normalizeRelationshipWarmth(value: string): BusinessProspect["relationshipWarmth"] {
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "high" ||
    normalized === "hot" ||
    normalized === "very warm" ||
    normalized === "very_warm"
  ) {
    return "high";
  }
  if (
    normalized === "medium" ||
    normalized === "warm" ||
    normalized === "warm intro" ||
    normalized === "warm_intro"
  ) {
    return "medium";
  }
  if (normalized === "low" || normalized === "cold") {
    return "low";
  }
  return "unknown";
}

function extractEmail(value: string) {
  const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0].toLowerCase() : "";
}

function getCollectionCityKey(collection: SourceBackedPlaceReference["collection"]) {
  return slugify(collection.split("_")[0] || "vancouver");
}

function getCityName(cityKey: string) {
  return buildDefaultCityRolloutTargets().find((target) => target.cityKey === cityKey)?.cityName
    || cityKey
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
}

function cloneProspect(prospect: BusinessProspect): BusinessProspect {
  return {
    ...prospect,
    collectionIds: [...prospect.collectionIds],
  };
}

function chooseLonger(left: string, right: string) {
  return right.length > left.length ? right : left;
}

function joinUnique(left: string, right: string) {
  const items = [left, right].map((value) => value.trim()).filter(Boolean);
  return [...new Set(items)].join(" | ");
}

function newerDate(left: string, right: string) {
  const leftTime = Date.parse(left);
  const rightTime = Date.parse(right);
  if (Number.isNaN(leftTime)) return right;
  if (Number.isNaN(rightTime)) return left;
  return rightTime > leftTime ? right : left;
}

function normalizeMatchValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function stripSourceBackedCoverageNote(value: string) {
  return value.replace(/\s*Included across \d+ source-backed collections\.\s*$/i, "").trim();
}

function buildSourceBackedCoverageNote(note: string, collectionCount: number) {
  const compact = note.trim();
  if (!compact) {
    return collectionCount > 1
      ? `Included across ${collectionCount} source-backed collections.`
      : "";
  }
  if (collectionCount <= 1) return compact;
  return `${compact} Included across ${collectionCount} source-backed collections.`;
}

function percent(value: number, target: number) {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((value / target) * 100));
}
