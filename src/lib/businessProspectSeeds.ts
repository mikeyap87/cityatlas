import type { BusinessProspect } from "../types";
import { roamCitySourcingSeeds } from "../data/roamCitySourcingSeeds.ts";
import { roamPublicBusinessWaveSeeds } from "../data/roamPublicBusinessWaveSeeds.ts";
import { greaterVancouverReviewBusinessSeeds } from "../data/greaterVancouverReviewBusinessSeeds.ts";
import { roomsMultiCityBusinessSeeds } from "../data/roomsMultiCityBusinessSeeds.ts";
import { roomsVancouverBusinessSeeds } from "../data/roomsVancouverBusinessSeeds.ts";
import { roomsVancouverReviewBusinessSeeds } from "../data/roomsVancouverReviewBusinessSeeds.ts";
import { vancouverRestaurantReviewBusinessSeeds } from "../data/vancouverRestaurantReviewBusinessSeeds.ts";
import { vancouverServiceReviewBusinessSeeds } from "../data/vancouverServiceReviewBusinessSeeds.ts";
import { slugify } from "./format.ts";

const seededAt = "2026-06-16T12:00:00.000Z";
const roamDonorBatchId = "roam-official-vancouver-donor-2026-06-16";
const roamPublicBusinessWaveBatchId = "roam-public-business-wave-donor-2026-06-16";
const roamCitySourcingBatchId = "roam-city-sourcing-donor-2026-06-16";
const roomsDonorBatchId = "rooms-vancouver-host-space-donor-2026-06-16";
const roomsReviewDonorBatchId = "rooms-vancouver-host-space-review-donor-2026-06-16";
const roomsMultiCityBatchId = "rooms-multi-city-host-space-donor-2026-06-16";
const vancouverRestaurantReviewBatchId = "vancouver-restaurant-review-donor-2026-06-22";
const vancouverServiceReviewBatchId = "cityatlas-vancouver-service-owner-review-donor-2026-06-22";
const greaterVancouverReviewBatchId = "cityatlas-greater-vancouver-review-donor-2026-06-25";

type SeedInput = {
  cityKey?: string;
  cityName?: string;
  municipality?: string;
  marketScope?: BusinessProspect["marketScope"];
  businessName: string;
  neighborhood: string;
  category: string;
  segment: string;
  sourceUrl: string;
  website: string;
  email?: string;
  contactPath?: string;
  contactPathType?: BusinessProspect["contactPathType"];
  contactReadiness?: BusinessProspect["contactReadiness"];
  contactName?: string;
  sourceProof: string;
  notes: string;
  contactConfidence?: BusinessProspect["contactConfidence"];
  donorSourceLabel?: string;
  donorBatchId?: string;
  donorPrefix?: string;
  outreachStatus?: BusinessProspect["outreachStatus"];
  approvalStatus?: BusinessProspect["approvalStatus"];
  relationshipWarmth?: BusinessProspect["relationshipWarmth"];
  lastUpdatedAt?: string;
};

function formatCityName(cityKey: string) {
  return cityKey
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createSeedProspect(input: SeedInput): BusinessProspect {
  const cityKey = input.cityKey || "vancouver";
  const cityName = input.cityName || formatCityName(cityKey);
  const email = (input.email || "").toLowerCase();
  const contactPath =
    input.contactPath || (email ? `mailto:${email}` : input.website || input.sourceUrl || "");
  const contactPathType =
    input.contactPathType
    || (email ? "direct_email" : contactPath ? "contact_page" : "needs_manual_lookup");
  const contactReadiness =
    input.contactReadiness
    || (email ? "email_ready" : contactPath ? "contact_path_ready" : "needs_research");
  const municipality = input.municipality || cityName;

  return {
    id: `prospect-${input.donorPrefix || "cityatlas-donor"}-${slugify(input.businessName)}`,
    cityKey,
    cityName,
    municipality,
    marketScope:
      input.marketScope || (cityKey === "vancouver" && municipality !== "Vancouver" ? "metro_area" : "city_only"),
    businessName: input.businessName,
    slug: slugify(input.businessName),
    neighborhood: input.neighborhood,
    category: input.category,
    segment: input.segment,
    sourceType: "manual_import",
    sourceCollection: undefined,
    sourceLabel: input.donorSourceLabel || "CityAtlas donor research",
    sourceUrl: input.sourceUrl,
    website: input.website,
    contactName: input.contactName || "",
    email,
    contactPath,
    contactPathType,
    contactConfidence: input.contactConfidence || (email ? "high" : contactPath ? "medium" : "low"),
    contactReadiness,
    outreachStatus: input.outreachStatus || "not_started",
    approvalStatus: input.approvalStatus || "review_only",
    sourceProof: input.sourceProof,
    relationshipWarmth: input.relationshipWarmth || "unknown",
    notes: `${input.notes} Reverify the contact path before any outreach or public claim.`,
    collectionIds: [],
    importBatchId: input.donorBatchId,
    lastUpdatedAt: input.lastUpdatedAt || seededAt,
  };
}

function mapSeedArray(
  seeds: SeedInput[],
) {
  return seeds.map(createSeedProspect);
}

export function buildDefaultSeededBusinessProspects() {
  const roamDonorSeeds: SeedInput[] = [
    {
      businessName: "Wedgewood Hotel & Spa",
      neighborhood: "Downtown",
      category: "Hotel",
      segment: "Guest services partner",
      sourceUrl: "https://wedgewoodhotel.com/concierge-services/concierge/",
      website: "https://wedgewoodhotel.com/concierge-services/concierge/",
      email: "concierge@wedgewoodhotel.com",
      sourceProof:
        "Roam donor research from the official concierge page listing concierge@wedgewoodhotel.com and bespoke concierge services.",
      notes:
        "Luxury downtown hotel with a visible concierge route and strong fit for hosted-visit, guest-service, and premium Vancouver planning partnerships.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "L'Hermitage Vancouver",
      neighborhood: "Downtown",
      category: "Hotel",
      segment: "Guest services partner",
      sourceUrl: "https://www.lhermitagevancouver.com/about",
      website: "https://www.lhermitagevancouver.com/about",
      email: "guest.services@lhermitagevancouver.com",
      sourceProof:
        "Roam donor research from the official hotel about page listing guest.services@lhermitagevancouver.com.",
      notes:
        "Boutique downtown hotel with a visible guest-services contact and a strong fit for out-of-town guest and first-visit Vancouver routes.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "Fairmont Hotel Vancouver",
      neighborhood: "Downtown",
      category: "Hotel",
      segment: "Concierge partner",
      sourceUrl:
        "https://www.fairmont-hotel-vancouver.com/content/uploads/2025/05/Dining-Guide_HVC_.pdf",
      website: "https://www.fairmont-hotel-vancouver.com/",
      email: "hvc.concierge@fairmont.com",
      sourceProof:
        "Roam donor research from an official Fairmont Hotel Vancouver guest guide listing the concierge email and phone.",
      notes:
        "Iconic downtown hotel with a clear concierge path and high relevance for first-time visitor, hosted weekend, and premium route planning.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "Auberge Vancouver Hotel",
      neighborhood: "Coal Harbour",
      category: "Hotel",
      segment: "Guest services partner",
      sourceUrl: "https://aubergevancouver.com/contact/",
      website: "https://aubergevancouver.com/contact/",
      email: "reservations@aubergevancouver.com",
      sourceProof:
        "Roam donor research from the official contact page listing reservations@aubergevancouver.com.",
      notes:
        "Waterfront hotel with a visible inquiry route and solid fit for guest-hosting and city-intelligence partnership coverage.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "Preventacare",
      neighborhood: "Vancouver",
      category: "Wellness",
      segment: "Corporate wellness partner",
      sourceUrl: "https://www.preventacare.ca/contact",
      website: "https://www.preventacare.ca/contact",
      email: "penny@preventacare.ca",
      contactName: "Penny Stratas",
      sourceProof:
        "Roam donor research from the official contact page listing workplace wellness focus plus Penny Stratas.",
      notes:
        "Workplace wellness operator with a named public contact and strong relevance to wellness-reset and team-planning coverage.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "Crystal Events BC",
      neighborhood: "Vancouver",
      category: "Events",
      segment: "Event planner partner",
      sourceUrl: "https://crystalevents.ca/contact-us/",
      website: "https://crystalevents.ca/contact-us/",
      email: "info@crystalevents.ca",
      sourceProof:
        "Roam donor research from the official contact page listing public inquiry email and event services.",
      notes:
        "Vancouver event planner with visible corporate and private-event positioning that fits hosted-route and city partner coverage.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "Quintessential Events",
      neighborhood: "Vancouver",
      category: "Events",
      segment: "Event planner partner",
      sourceUrl: "https://quintessentialevents.com/contact/",
      website: "https://quintessentialevents.com/contact/",
      email: "rachel@quintessentialevents.com",
      contactName: "Rachel",
      sourceProof:
        "Roam donor research from the official contact page listing a Vancouver event-planning contact.",
      notes:
        "Corporate and social event planning team with a named public contact, useful for hosted-visit and private-group CityAtlas partnership prep.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "Rae Events",
      neighborhood: "North Vancouver",
      category: "Events",
      segment: "Event planner partner",
      sourceUrl: "https://www.raeevents.ca/",
      website: "https://www.raeevents.ca/",
      email: "info@raeevents.ca",
      sourceProof:
        "Roam donor research from the official site listing corporate events, team-building services, and a public email.",
      notes:
        "North Vancouver event-planning operator that broadens CityAtlas beyond downtown hospitality into team and celebration route partnerships.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "You Forever",
      neighborhood: "Vancouver",
      category: "Events",
      segment: "Celebration partner",
      sourceUrl: "https://youforever.ca/contact/",
      website: "https://youforever.ca/contact/",
      email: "info@youforever.ca",
      sourceProof:
        "Roam donor research from the official contact page listing a public inquiry email and phone.",
      notes:
        "Celebration and planning brand with a visible contact route, useful for romance, hosted-guest, and private-event CityAtlas coverage.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
    {
      businessName: "Event Power",
      neighborhood: "Vancouver",
      category: "Events",
      segment: "Event production partner",
      sourceUrl: "https://eventpower.ca/contact-us/",
      website: "https://eventpower.ca/contact-us/",
      email: "enquiries@eventpower.ca",
      sourceProof:
        "Roam donor research from the official contact page listing the public Vancouver inquiry email.",
      notes:
        "Event production contact that strengthens CityAtlas's business and hosted-experience coverage without relying on guessed outreach paths.",
      donorSourceLabel: "Roam partner research donor (official site)",
      donorBatchId: roamDonorBatchId,
      donorPrefix: "roam-donor",
    },
  ];

  const roomsDonorSeeds: SeedInput[] = roomsVancouverBusinessSeeds.map((seed) => ({
    cityKey: "vancouver",
    cityName: "Vancouver",
    businessName: seed.businessName,
    neighborhood: seed.neighborhood,
    category: seed.category,
    segment: seed.segment,
    sourceUrl: seed.sourceUrl,
    website: seed.website,
    email: seed.email,
    sourceProof: seed.sourceProof,
    notes: seed.notes,
    contactConfidence: seed.contactConfidence as BusinessProspect["contactConfidence"],
    donorSourceLabel: seed.donorSourceLabel,
    donorBatchId: roomsDonorBatchId,
    donorPrefix: "rooms-donor",
  }));

  const roomsReviewSeeds: SeedInput[] = roomsVancouverReviewBusinessSeeds.map((seed) => ({
    cityKey: "vancouver",
    cityName: "Vancouver",
    businessName: seed.businessName,
    neighborhood: seed.neighborhood,
    category: seed.category,
    segment: seed.segment,
    sourceUrl: seed.sourceUrl,
    website: seed.website,
    email: seed.email,
    contactPath: seed.contactPath,
    contactPathType: seed.contactPathType as BusinessProspect["contactPathType"],
    contactReadiness: seed.contactReadiness as BusinessProspect["contactReadiness"],
    sourceProof: seed.sourceProof,
    notes: seed.notes,
    contactConfidence: seed.contactConfidence as BusinessProspect["contactConfidence"],
    donorSourceLabel: seed.donorSourceLabel,
    donorBatchId: roomsReviewDonorBatchId,
    donorPrefix: "rooms-review-donor",
  }));

  const roomsMultiCitySeeds: SeedInput[] = roomsMultiCityBusinessSeeds.map((seed) => ({
    cityKey: seed.cityKey,
    cityName: seed.cityName,
    businessName: seed.businessName,
    neighborhood: seed.neighborhood,
    category: seed.category,
    segment: seed.segment,
    sourceUrl: seed.sourceUrl,
    website: seed.website,
    email: seed.email,
    contactPath: seed.contactPath,
    contactPathType: seed.contactPathType as BusinessProspect["contactPathType"],
    sourceProof: seed.sourceProof,
    notes: seed.notes,
    contactConfidence: seed.contactConfidence as BusinessProspect["contactConfidence"],
    donorSourceLabel: seed.donorSourceLabel,
    donorBatchId: roomsMultiCityBatchId,
    donorPrefix: "rooms-multi-city-donor",
  }));

  const roamPublicBusinessWaveDonorSeeds: SeedInput[] = roamPublicBusinessWaveSeeds.map((seed) => ({
    cityKey: seed.cityKey,
    cityName: seed.cityName,
    businessName: seed.businessName,
    neighborhood: seed.neighborhood,
    category: seed.category,
    segment: seed.segment,
    sourceUrl: seed.sourceUrl,
    website: seed.website,
    email: seed.email,
    contactPath: seed.contactPath,
    contactPathType: seed.contactPathType as BusinessProspect["contactPathType"],
    contactReadiness: seed.contactReadiness as BusinessProspect["contactReadiness"],
    sourceProof: seed.sourceProof,
    notes: seed.notes,
    contactConfidence: seed.contactConfidence as BusinessProspect["contactConfidence"],
    donorSourceLabel: seed.donorSourceLabel,
    donorBatchId: roamPublicBusinessWaveBatchId,
    donorPrefix: "roam-public-business-wave-donor",
  }));

  const roamCitySeeds: SeedInput[] = roamCitySourcingSeeds.map((seed) => ({
    cityKey: seed.cityKey,
    cityName: seed.cityName,
    businessName: seed.businessName,
    neighborhood: seed.neighborhood,
    category: seed.category,
    segment: seed.segment,
    sourceUrl: seed.sourceUrl,
    website: seed.website,
    email: seed.email,
    contactPath: seed.contactPath,
    contactPathType: seed.contactPathType as BusinessProspect["contactPathType"],
    sourceProof: seed.sourceProof,
    notes: seed.notes,
    contactConfidence: seed.contactConfidence as BusinessProspect["contactConfidence"],
    donorSourceLabel: seed.donorSourceLabel,
    donorBatchId: roamCitySourcingBatchId,
    donorPrefix: "roam-city-sourcing-donor",
  }));

  const vancouverRestaurantReviewSeeds: SeedInput[] = vancouverRestaurantReviewBusinessSeeds.map((seed) => ({
    cityKey: "vancouver",
    cityName: "Vancouver",
    municipality: seed.municipality,
    marketScope: seed.marketScope as BusinessProspect["marketScope"],
    businessName: seed.businessName,
    neighborhood: seed.neighborhood,
    category: seed.category,
    segment: seed.segment,
    sourceUrl: seed.sourceUrl,
    website: seed.website,
    email: seed.email,
    contactPath: seed.contactPath,
    contactPathType: seed.contactPathType as BusinessProspect["contactPathType"],
    contactReadiness: seed.contactReadiness as BusinessProspect["contactReadiness"],
    sourceProof: seed.sourceProof,
    notes: seed.notes,
    contactConfidence: seed.contactConfidence as BusinessProspect["contactConfidence"],
    donorSourceLabel: seed.donorSourceLabel,
    donorBatchId: vancouverRestaurantReviewBatchId,
    donorPrefix: "vancouver-restaurant-review-donor",
    approvalStatus: seed.approvalStatus as BusinessProspect["approvalStatus"],
    outreachStatus: seed.outreachStatus as BusinessProspect["outreachStatus"],
    relationshipWarmth: seed.relationshipWarmth as BusinessProspect["relationshipWarmth"],
    lastUpdatedAt: seed.lastUpdatedAt,
  }));

  const vancouverServiceReviewSeeds: SeedInput[] = vancouverServiceReviewBusinessSeeds.map((seed) => ({
    cityKey: "vancouver",
    cityName: "Vancouver",
    municipality: seed.municipality,
    marketScope: seed.marketScope as BusinessProspect["marketScope"],
    businessName: seed.businessName,
    neighborhood: seed.neighborhood,
    category: seed.category,
    segment: seed.segment,
    sourceUrl: seed.sourceUrl,
    website: seed.website,
    email: seed.email,
    contactPath: seed.contactPath,
    contactPathType: seed.contactPathType as BusinessProspect["contactPathType"],
    contactReadiness: seed.contactReadiness as BusinessProspect["contactReadiness"],
    sourceProof: seed.sourceProof,
    notes: seed.notes,
    contactConfidence: seed.contactConfidence as BusinessProspect["contactConfidence"],
    donorSourceLabel: seed.donorSourceLabel,
    donorBatchId: vancouverServiceReviewBatchId,
    donorPrefix: "vancouver-service-review-donor",
    approvalStatus: seed.approvalStatus as BusinessProspect["approvalStatus"],
    outreachStatus: seed.outreachStatus as BusinessProspect["outreachStatus"],
    relationshipWarmth: seed.relationshipWarmth as BusinessProspect["relationshipWarmth"],
    lastUpdatedAt: seed.lastUpdatedAt,
  }));

  const greaterVancouverReviewSeeds: SeedInput[] = greaterVancouverReviewBusinessSeeds.map((seed) => ({
    cityKey: "vancouver",
    cityName: "Vancouver",
    municipality: seed.municipality,
    marketScope: seed.marketScope as BusinessProspect["marketScope"],
    businessName: seed.businessName,
    neighborhood: seed.neighborhood,
    category: seed.category,
    segment: seed.segment,
    sourceUrl: seed.sourceUrl,
    website: seed.website,
    email: seed.email,
    contactPath: seed.contactPath,
    contactPathType: seed.contactPathType as BusinessProspect["contactPathType"],
    contactReadiness: seed.contactReadiness as BusinessProspect["contactReadiness"],
    sourceProof: seed.sourceProof,
    notes: seed.notes,
    contactConfidence: seed.contactConfidence as BusinessProspect["contactConfidence"],
    donorSourceLabel: seed.donorSourceLabel,
    donorBatchId: greaterVancouverReviewBatchId,
    donorPrefix: "greater-vancouver-review-donor",
    approvalStatus: seed.approvalStatus as BusinessProspect["approvalStatus"],
    outreachStatus: seed.outreachStatus as BusinessProspect["outreachStatus"],
    relationshipWarmth: seed.relationshipWarmth as BusinessProspect["relationshipWarmth"],
    lastUpdatedAt: seed.lastUpdatedAt,
  }));

  return [
    ...mapSeedArray(roamDonorSeeds),
    ...mapSeedArray(roomsDonorSeeds),
    ...mapSeedArray(roomsReviewSeeds),
    ...mapSeedArray(roomsMultiCitySeeds),
    ...mapSeedArray(roamPublicBusinessWaveDonorSeeds),
    ...mapSeedArray(roamCitySeeds),
    ...mapSeedArray(vancouverRestaurantReviewSeeds),
    ...mapSeedArray(vancouverServiceReviewSeeds),
    ...mapSeedArray(greaterVancouverReviewSeeds),
  ];
}
