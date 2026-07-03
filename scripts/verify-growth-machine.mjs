import { seedData } from "../src/data/seed.ts";
import {
  buildCityBusinessRollups,
  buildDefaultBusinessProspects,
  buildDefaultCityRolloutTargets,
  createImportedBusinessProspects,
  parseBusinessProspectImport,
} from "../src/lib/cityGrowth.ts";
import {
  buildBusinessOwnerInboxBrief,
  buildBusinessProofBatchBrief,
} from "../src/lib/businessOutreachPrep.ts";
import {
  buildBusinessInboundAdapterPreview,
  buildBusinessProtectedInboundMirrorEntries,
  buildBusinessReplyBridgeReport,
} from "../src/lib/businessInboundPreview.ts";
import {
  buildBusinessSupervisedExecutionLaneReport,
  getBusinessSupervisedOutreachSetup,
} from "../src/lib/businessSupervisedExecution.ts";
import { buildConnectorCityRollups } from "../src/lib/cityConnectorWarmPaths.ts";
import { buildCityOutreachRehearsalRollups } from "../src/lib/cityOutreachRehearsalTruth.ts";

function check(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const cityRolloutTargets = buildDefaultCityRolloutTargets();
const businessProspects = buildDefaultBusinessProspects(seedData);
const cityRollups = buildCityBusinessRollups({
  businessProspects,
  cityRolloutTargets,
  guides: seedData.guides,
});
const connectorCityRollups = buildConnectorCityRollups(businessProspects);
const outreachRehearsalRollups = buildCityOutreachRehearsalRollups(businessProspects);
const businessBatch = buildBusinessProofBatchBrief(businessProspects, "vancouver");
const ownerInboxBrief = buildBusinessOwnerInboxBrief(businessBatch);

const vancouver = cityRollups.find((rollup) => rollup.cityKey === "vancouver");
const vancouverConnectorRollup = connectorCityRollups.find((rollup) => rollup.cityKey === "vancouver");
const vancouverOutreachRehearsalRollup = outreachRehearsalRollups.find(
  (rollup) => rollup.cityKey === "vancouver",
);
const seededCities = cityRollups.filter((rollup) => rollup.totalProspects > 0);
const toronto = cityRollups.find((rollup) => rollup.cityKey === "toronto");
const torontoConnectorRollup = connectorCityRollups.find((rollup) => rollup.cityKey === "toronto");
const torontoOutreachRehearsalRollup = outreachRehearsalRollups.find(
  (rollup) => rollup.cityKey === "toronto",
);
const losAngeles = cityRollups.find((rollup) => rollup.cityKey === "los-angeles");
const london = cityRollups.find((rollup) => rollup.cityKey === "london");
const blockedRoamSourceDomains = new Set([
  "discoverbarcelona.city",
  "getyourguide.com",
  "kijiji.ca",
  "salondiscover.com",
  "whereig.com",
]);
const allowedSecondaryListingLocalitiesByCity = {
  toronto: new Set(["toronto-on", "north-york-on"]),
  "los-angeles": new Set(["los-angeles-ca"]),
  miami: new Set(["miami-fl", "miami-beach-fl"]),
  "new-york": new Set(["new-york-ny", "brooklyn-ny", "staten-island-ny"]),
};
const freeEmailDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "icloud.com",
  "me.com",
  "outlook.com",
  "yahoo.com",
  "yahoo.ca",
  "yahoo.co.uk",
]);
const beautyNoisePattern =
  /\b(barber|beauty|brow(?:s)?|cuts?|hair|lashes?|makeup|nail|salon|shaves?|waxing)\b/i;
const strongWellnessCuePattern =
  /\b(bodywork|massage|recovery|salt cave|stretch|therap(?:y|eutic)|wellness)\b/i;
const wellnessCuePattern =
  /\b(bodywork|massage|recovery|salt cave|sauna|spa|stretch|therap(?:y|eutic)|wellness)\b/i;
const genericMarketplaceNamePattern = /^(about|contact|home|services?)$/i;
const ambiguousMarketplaceNamePattern = /\b(dream|elements?|family|studio)\b/i;
const comparisonListiclePattern =
  /\b(best|compare|comparison|guide|review|reviews|top)\b|口コミ|ランキング|比較|おすすめ/i;
const vancouverRoamCitySourcingProspects = businessProspects.filter(
  (prospect) =>
    prospect.cityKey === "vancouver" &&
    /Roam city-sourcing donor/i.test(prospect.sourceLabel),
);
const vancouverRoamPublicBusinessWaveProspects = businessProspects.filter(
  (prospect) =>
    prospect.cityKey === "vancouver" &&
    /Roam public business wave donor/i.test(prospect.sourceLabel),
);
const vancouverRoomsReviewProspects = businessProspects.filter(
  (prospect) =>
    prospect.cityKey === "vancouver" &&
    /Rooms host-space review donor/i.test(prospect.sourceLabel),
);
const vancouverRoomsReviewContactReadyProspects = vancouverRoomsReviewProspects.filter(
  (prospect) => prospect.contactReadiness === "contact_path_ready",
);
const vancouverRoomsReviewResearchProspects = vancouverRoomsReviewProspects.filter(
  (prospect) => prospect.contactReadiness === "needs_research",
);
const vancouverBrowserbaseReviewProspects = businessProspects.filter(
  (prospect) =>
    prospect.cityKey === "vancouver" &&
    /Rooms Browserbase review donor/i.test(prospect.sourceLabel),
);
const vancouverContactReviewProspects = businessProspects.filter(
  (prospect) =>
    prospect.cityKey === "vancouver" &&
    /Rooms contact-form review donor/i.test(prospect.sourceLabel),
);
const vancouverSupplementalEmailReadyProspects = [
  ...vancouverRoomsReviewProspects,
  ...vancouverBrowserbaseReviewProspects,
].filter((prospect) => prospect.contactReadiness === "email_ready");
const suspiciousRoamCitySourcingProspects = businessProspects.filter((prospect) => {
  if (!/Roam city-sourcing donor/i.test(prospect.sourceLabel)) {
    return false;
  }

  const sourceDomain = getSourceDomain(prospect.sourceUrl || prospect.website);
  const businessName = normalizeText(prospect.businessName);
  return (
    blockedRoamSourceDomains.has(sourceDomain) ||
    /where is |not acceptable|getyourguide| located in |\[[^\]]+|^\d{3}\s+(bad gateway|error|not found|service unavailable)$/i.test(businessName) ||
    /&(#x?[0-9a-f]+|[a-z]+);/i.test(prospect.businessName) ||
    comparisonListiclePattern.test(businessName) ||
    (beautyNoisePattern.test(businessName) && !strongWellnessCuePattern.test(businessName)) ||
    (sourceDomain === "fresha.com" && isSuspiciousMarketplaceWellnessTitle(businessName))
  );
});
const offCityRoomsMultiCityProspects = businessProspects.filter((prospect) => {
  if (!/Rooms multi-city donor/i.test(prospect.sourceLabel)) {
    return false;
  }

  const secondaryListingMatch = prospect.notes.match(/https:\/\/www\.eventective\.com\/([^/\s)]+)/i);
  if (!secondaryListingMatch) {
    return false;
  }

  const listingLocality = normalizeText(secondaryListingMatch[1]).toLowerCase();
  const allowedLocalities = allowedSecondaryListingLocalitiesByCity[prospect.cityKey];

  return Boolean(
    allowedLocalities &&
    /^[a-z-]+$/.test(listingLocality) &&
    !allowedLocalities.has(listingLocality),
  );
});
const suspiciousRoomsMultiCityEmailProspects = businessProspects.filter((prospect) => {
  if (!/Rooms multi-city donor/i.test(prospect.sourceLabel)) {
    return false;
  }

  const email = normalizeText(prospect.email).toLowerCase();
  if (!email || !email.includes("@")) {
    return false;
  }

  const emailDomain = email.split("@")[1] || "";
  if (freeEmailDomains.has(emailDomain)) {
    return false;
  }

  const officialRegistrableDomain = getRegistrableDomain(prospect.sourceUrl || prospect.website);
  const emailRegistrableDomain = getRegistrableDomain(emailDomain);

  return Boolean(
    officialRegistrableDomain &&
    emailRegistrableDomain &&
    officialRegistrableDomain !== emailRegistrableDomain,
  );
});
const resendPreviewPayload = JSON.stringify(
  {
    type: "email.received",
    data: {
      email_id: "cityatlas_business_reply_001",
      from: "Wedgewood Hotel Concierge <concierge@wedgewoodhotel.com>",
      subject: "Re: CityAtlas Vancouver",
      text: "Thanks for reaching out. Please send a little more detail about the route and timing.",
      created_at: "2026-06-16T18:00:00Z",
      headers: {
        "Message-ID": "<cityatlas_business_reply_001@resend.dev>",
        "In-Reply-To": "cityatlas_business_thread_001",
      },
      mailbox: "INBOUND",
      tags: ["Vancouver", "Hotel"],
    },
  },
  null,
  2,
);
const businessInboundPreview = buildBusinessInboundAdapterPreview(
  resendPreviewPayload,
  businessProspects,
);
const businessMirrorEntries = buildBusinessProtectedInboundMirrorEntries(
  businessInboundPreview.rows,
);
const businessReplyBridgeReport = buildBusinessReplyBridgeReport({
  mirroredEntries: businessMirrorEntries,
  replayHistory: [],
  prospects: businessProspects,
});
const businessSupervisedExecutionReport = buildBusinessSupervisedExecutionLaneReport({
  prospects: businessProspects.filter((prospect) => prospect.cityKey === "vancouver"),
  setup: getBusinessSupervisedOutreachSetup(),
});

function getSourceDomain(url) {
  try {
    return new URL(String(url)).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function getRegistrableDomain(domainOrUrl) {
  const hostname = String(domainOrUrl || "").includes("://")
    ? getSourceDomain(domainOrUrl)
    : String(domainOrUrl || "").replace(/^www\./, "").toLowerCase();
  const parts = hostname.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return hostname;
  }

  const last = parts.at(-1) || "";
  const secondLast = parts.at(-2) || "";
  if (last.length === 2 && secondLast.length <= 3 && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  return parts.slice(-2).join(".");
}

function normalizeText(value) {
  return String(value || "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isSuspiciousMarketplaceWellnessTitle(businessName) {
  const normalized = normalizeText(businessName);
  const words = normalized
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return true;
  if (wellnessCuePattern.test(normalized)) return false;
  if (beautyNoisePattern.test(normalized)) return true;
  if (genericMarketplaceNamePattern.test(normalized)) return true;
  if (words.length === 1) return true;
  if (words.length <= 2 && ambiguousMarketplaceNamePattern.test(normalized)) return true;
  return false;
}

check(cityRolloutTargets.length >= 20, "City rollout target map is too small.");
check(
  cityRolloutTargets.some((target) => target.cityKey === "toronto"),
  "Toronto is missing from the reusable rollout map.",
);
check(
  cityRolloutTargets.some((target) => target.cityKey === "tokyo"),
  "Tokyo is missing from the later-wave rollout map.",
);
check(
  cityRolloutTargets.some((target) => target.cityKey === "lisbon"),
  "Lisbon is missing from the extended Roam-aligned rollout map.",
);
check(
  cityRolloutTargets.some((target) => target.cityKey === "atlanta"),
  "Atlanta is missing from the extended Roam-aligned rollout map.",
);
check(
  seededCities.length >= 25,
  "The shared-city donor machine no longer seeds every current rollout city locally.",
);
check(
  businessProspects.length >= 240,
  "The shared CityAtlas business machine regressed below the expected local prospect floor.",
);
check(
  connectorCityRollups.filter((rollup) => rollup.organizationConnectorCount > 0).length >= 8,
  "The connector warm-path machine no longer covers the expected first connector cities.",
);
check(
  connectorCityRollups.reduce((sum, rollup) => sum + rollup.organizationConnectorCount, 0) >= 80,
  "The shared connector warm-path machine regressed below the expected organization-level connector floor.",
);
check(
  connectorCityRollups.reduce((sum, rollup) => sum + rollup.namedConnectorCount, 0) >= 9,
  "The named connector warm-path layer regressed below the expected floor.",
);

check(vancouver, "Vancouver rollout metrics are missing.");
check(vancouverConnectorRollup, "Vancouver connector warm-path metrics are missing.");
check(vancouverOutreachRehearsalRollup, "Vancouver rehearsal-overlay metrics are missing.");
check(vancouver.totalProspects >= 90, "Vancouver unique prospect coverage is below the expected local floor.");
check(
  vancouver.partnerCandidateCount >= 70,
  "Vancouver partner-eligible coverage is below the expected local floor.",
);
check(
  vancouver.contactReadyCount >= 60,
  "Vancouver contact-ready queue is below the expected proof threshold.",
);
check(
  vancouver.emailReadyCount >= 55,
  "Vancouver email-ready queue is below the expected local proof threshold.",
);
check(
  vancouver.sourceBackedCollections >= 14,
  "Vancouver source-backed collection coverage regressed.",
);
check(
  vancouverRoamCitySourcingProspects.length >= 5,
  "The Vancouver Roam city-sourcing donor layer is too thin after sync.",
);
check(
  vancouverRoamPublicBusinessWaveProspects.length >= 5,
  "The Vancouver Roam public-business-wave donor layer is missing from the CityAtlas business machine.",
);
check(
  vancouverRoamCitySourcingProspects.length + vancouverRoamPublicBusinessWaveProspects.length >= 10,
  "The combined Vancouver Roam donor coverage regressed below the current honest density floor.",
);
check(
  vancouverConnectorRollup && vancouverConnectorRollup.organizationConnectorCount >= 10,
  "The Vancouver connector warm-path layer is below the expected organization-level connector floor.",
);
check(
  vancouverConnectorRollup && vancouverConnectorRollup.namedConnectorCount >= 9,
  "The Vancouver named connector warm-path layer is below the expected floor.",
);
check(
  vancouverRoomsReviewProspects.length >= 20,
  "The wider Rooms Vancouver review donor layer is too thin after sync.",
);
check(
  vancouverRoomsReviewContactReadyProspects.length >= 10,
  "The wider Rooms Vancouver review donor layer lost too many contact-path-ready rows.",
);
check(
  vancouverSupplementalEmailReadyProspects.length >= 2,
  "The Vancouver review uplift no longer carries any browser-reviewed email promotions.",
);
check(
  vancouverRoomsReviewResearchProspects.length >= 10,
  "The wider Rooms Vancouver review donor layer lost too much research-only depth.",
);
check(
  vancouverOutreachRehearsalRollup && vancouverOutreachRehearsalRollup.windowRowCount >= 15,
  "The Vancouver rehearsal overlay lost the expected Rooms supervised-send-window coverage.",
);
check(
  vancouverOutreachRehearsalRollup && vancouverOutreachRehearsalRollup.matchedProspectCount >= 15,
  "The Vancouver rehearsal overlay no longer maps cleanly onto the current CityAtlas queue.",
);
check(
  vancouverOutreachRehearsalRollup && vancouverOutreachRehearsalRollup.outcomeLedgerCount >= 15,
  "The Vancouver rehearsal overlay lost the borrowed post-send outcome ledger truth.",
);
check(
  vancouverOutreachRehearsalRollup && vancouverOutreachRehearsalRollup.suppressedCount >= 2,
  "The Vancouver rehearsal overlay no longer carries the expected exact-address suppression lessons.",
);
check(
  vancouverBrowserbaseReviewProspects.length >= 2,
  "The Browserbase-reviewed Vancouver donor uplift is missing from the CityAtlas business machine.",
);
check(
  vancouverContactReviewProspects.length >= 2,
  "The Vancouver contact-form review donor uplift is missing from the CityAtlas business machine.",
);
check(
  suspiciousRoamCitySourcingProspects.length === 0,
  "The Roam city-sourcing donor layer still contains obvious non-business or directory noise.",
);
check(
  offCityRoomsMultiCityProspects.length === 0,
  "The Rooms multi-city donor layer still contains off-city secondary-listing rows that weaken city/entity clarity.",
);
check(
  suspiciousRoomsMultiCityEmailProspects.length === 0,
  "The Rooms multi-city donor layer still contains custom-domain emails that do not match the official site entity.",
);
check(
  businessBatch.selectedCount >= 3,
  "Vancouver business proof batch is too small.",
);
check(
  businessBatch.rehearsalReadyCount >= 1,
  "Vancouver business proof batch lost its first rehearsal-ready candidate.",
);
check(
  businessBatch.distinctBatchLaneCount >= 4,
  "Vancouver business proof batch is no longer diversified across enough business lanes.",
);
check(
  businessBatch.distinctSourceLaneCount >= 2,
  "Vancouver business proof batch is too concentrated in one donor/source lane.",
);
check(
  ownerInboxBrief.blockedBy.length === 0,
  "Owner inbox rehearsal is no longer ready for the Vancouver business batch.",
);
check(toronto && toronto.totalProspects >= 10, "Toronto donor queue is too thin for the shared-city machine.");
check(
  torontoConnectorRollup && torontoConnectorRollup.organizationConnectorCount >= 10,
  "Toronto connector warm-path coverage is too thin for next-city rollout prep.",
);
check(
  torontoOutreachRehearsalRollup && torontoOutreachRehearsalRollup.windowRowCount >= 15,
  "Toronto lost the borrowed Rooms supervised-send-window coverage.",
);
check(
  torontoOutreachRehearsalRollup && torontoOutreachRehearsalRollup.matchedProspectCount >= 12,
  "Toronto no longer maps enough borrowed Rooms rehearsal rows into the current CityAtlas queue.",
);
check(
  losAngeles && losAngeles.contactReadyCount >= 10,
  "Los Angeles donor queue is too thin for multi-city contact-prep staging.",
);
check(
  london && london.emailReadyCount >= 5,
  "London donor queue lost its reviewed email-ready base.",
);
check(
  businessInboundPreview.rows.length === 1,
  "Business inbound preview did not normalize the sample Resend payload.",
);
check(
  businessInboundPreview.rows[0]?.payloadStatus === "Valid",
  "Business inbound preview payload is not valid enough for protected mirror rehearsal.",
);
check(
  businessInboundPreview.rows[0]?.matchedBusinessName === "Wedgewood Hotel & Spa",
  "Business inbound preview no longer matches the expected Vancouver donor business.",
);
check(
  businessMirrorEntries.length === 1
    && businessMirrorEntries[0]?.protectedIngestionStatus === "Ready",
  "Protected inbound mirror did not stay ready for the sample business packet.",
);
check(
  businessReplyBridgeReport.rows[0]?.canReplay,
  "Shared business reply bridge did not stay replay-ready for the sample business packet.",
);
check(
  businessSupervisedExecutionReport.queue.length >= 5,
  "The Vancouver supervised execution lane is too thin to stage a later approval packet honestly.",
);
check(
  businessSupervisedExecutionReport.queue.some((row) => row.canAllowlist),
  "The Vancouver supervised execution lane no longer has any allowlist-ready packet candidate.",
);
check(
  businessSupervisedExecutionReport.caps.allowlistCap === 5,
  "The Vancouver supervised execution lane lost its tiny allowlist guardrail.",
);

const preview = parseBusinessProspectImport(
  [
    "businessName,email,contactName,cityName,neighborhood,category,segment,sourceLabel,sourceUrl,website,contactPath,notes,relationshipWarmth",
    "Granville Gallery,hello@granvillegallery.example,Jamie,Vancouver,South Granville,Gallery,Arts venue,Manual source,https://granvillegallery.example,https://granvillegallery.example,https://granvillegallery.example/contact,Source-backed candidate for a culture route,medium",
    "Granville Gallery,hello@granvillegallery.example,Jamie,Vancouver,South Granville,Gallery,Arts venue,Manual source,https://granvillegallery.example,https://granvillegallery.example,https://granvillegallery.example/contact,Duplicate row,medium",
  ].join("\n"),
  businessProspects,
);

check(preview.importableRows.length === 1, "Import preview should leave exactly one importable row.");
check(preview.duplicateCount === 1, "Import preview should flag the duplicate row.");

const imported = createImportedBusinessProspects(preview.importableRows);
check(imported.length === 1, "Imported prospect creation did not preserve the preview row.");
check(imported[0].contactReadiness === "email_ready", "Imported prospect should be email-ready.");

console.log(
  JSON.stringify(
    {
      ok: true,
      cityTargets: cityRolloutTargets.length,
      totalProspects: businessProspects.length,
      seededCities: seededCities.length,
      vancouver,
      vancouverRoomsReviewLayer: {
        roamPublicBusinessWave: vancouverRoamPublicBusinessWaveProspects.length,
        total: vancouverRoomsReviewProspects.length,
        contactPathReady: vancouverRoomsReviewContactReadyProspects.length,
        needsResearch: vancouverRoomsReviewResearchProspects.length,
        supplementalEmailReady: vancouverSupplementalEmailReadyProspects.length,
        browserbasePromoted: vancouverBrowserbaseReviewProspects.length,
        contactReviewPromoted: vancouverContactReviewProspects.length,
      },
      businessBatch: {
        selectedCount: businessBatch.selectedCount,
        rehearsalReadyCount: businessBatch.rehearsalReadyCount,
        distinctBatchLaneCount: businessBatch.distinctBatchLaneCount,
        distinctSourceLaneCount: businessBatch.distinctSourceLaneCount,
        status: businessBatch.status,
        ownerInboxTitle: ownerInboxBrief.title,
        candidateName: ownerInboxBrief.candidateName,
      },
      businessReplyRail: {
        previewRows: businessInboundPreview.rows.length,
        matchedBusinessName: businessInboundPreview.rows[0]?.matchedBusinessName,
        mirroredEntries: businessMirrorEntries.length,
        bridgeReady: businessReplyBridgeReport.rows[0]?.canReplay ?? false,
      },
      businessSupervisedExecution: {
        queueRows: businessSupervisedExecutionReport.queue.length,
        allowlisted: businessSupervisedExecutionReport.caps.allowlisted,
        canAllowlistCount: businessSupervisedExecutionReport.queue.filter((row) => row.canAllowlist).length,
        title: businessSupervisedExecutionReport.title,
      },
      outreachRehearsal: {
        vancouver: vancouverOutreachRehearsalRollup,
        toronto: torontoOutreachRehearsalRollup,
      },
      connectorWarmPaths: {
        coveredCities: connectorCityRollups.filter((rollup) => rollup.organizationConnectorCount > 0).length,
        organizationConnectorCount: connectorCityRollups.reduce(
          (sum, rollup) => sum + rollup.organizationConnectorCount,
          0,
        ),
        namedConnectorCount: connectorCityRollups.reduce(
          (sum, rollup) => sum + rollup.namedConnectorCount,
          0,
        ),
        vancouver: vancouverConnectorRollup,
        toronto: torontoConnectorRollup,
      },
      importPreview: {
        importableRows: preview.importableRows.length,
        duplicateCount: preview.duplicateCount,
      },
    },
    null,
    2,
  ),
);
