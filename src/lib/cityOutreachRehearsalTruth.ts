import type { BusinessProspect } from "../types";
import { buildBusinessProofCandidate } from "./businessOutreachPrep.ts";
import { roomsCityOutreachWindowSeeds } from "../data/roomsCityOutreachWindowSeeds.ts";
import { roomsVancouverOutreachOutcomeSeeds } from "../data/roomsVancouverOutreachOutcomeSeeds.ts";

export type CityOutreachWindowSeed = {
  cityKey: string;
  cityName: string;
  businessName: string;
  email: string;
  subject: string;
  officialUrl: string;
  sourceUrl: string;
  sourceType: string;
  sendStatus: string;
  approvalStatus: string;
  suppressionStatus: string;
  guardrails: string;
  browserbaseReviewPath: string;
};

export type CityOutreachOutcomeSeed = {
  cityKey: string;
  cityName: string;
  businessName: string;
  email: string;
  subject: string;
  sentAt: string;
  deliveryStatus: string;
  replyStatus: string;
  outcomeStatus: string;
  suppressionStatus: string;
  ownerNextAction: string;
};

export type CityOutreachWindowRow = CityOutreachWindowSeed & {
  matchedProspectId: string;
  matched: boolean;
  matchedContactReadiness: string;
  matchedBatchStage: string;
  matchedSourceLane: string;
};

export type CityOutreachOutcomeRow = CityOutreachOutcomeSeed & {
  matchedProspectId: string;
  matched: boolean;
};

export type CityOutreachRehearsalRollup = {
  cityKey: string;
  cityName: string;
  windowRowCount: number;
  matchedProspectCount: number;
  unmatchedWindowCount: number;
  matchedEmailReadyCount: number;
  matchedRehearsalReadyCount: number;
  outcomeLedgerCount: number;
  bouncedCount: number;
  suppressedCount: number;
  nextAction: string;
};

function normalizeText(value: string) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildProspectLookup(prospects: BusinessProspect[]) {
  const map = new Map<string, BusinessProspect>();

  for (const prospect of prospects) {
    const nameKey = normalizeText(prospect.businessName);
    const emailKey = prospect.email.trim().toLowerCase();
    if (nameKey) {
      map.set(`${prospect.cityKey}::name::${nameKey}`, prospect);
    }
    if (emailKey) {
      map.set(`${prospect.cityKey}::email::${emailKey}`, prospect);
    }
  }

  return map;
}

function getMatchedProspect(
  lookup: Map<string, BusinessProspect>,
  cityKey: string,
  businessName: string,
  email: string,
) {
  const emailKey = email.trim().toLowerCase();
  if (emailKey) {
    const byEmail = lookup.get(`${cityKey}::email::${emailKey}`);
    if (byEmail) return byEmail;
  }

  const nameKey = normalizeText(businessName);
  return nameKey ? lookup.get(`${cityKey}::name::${nameKey}`) : undefined;
}

export function listOutreachWindowRows(
  cityKey?: string,
  prospects: BusinessProspect[] = [],
): CityOutreachWindowRow[] {
  const lookup = buildProspectLookup(prospects);

  return roomsCityOutreachWindowSeeds
    .filter((seed) => !cityKey || seed.cityKey === cityKey)
    .map((seed) => {
      const matchedProspect = getMatchedProspect(
        lookup,
        seed.cityKey,
        seed.businessName,
        seed.email,
      );
      const matchedCandidate = matchedProspect
        ? buildBusinessProofCandidate(matchedProspect)
        : null;

      return {
        ...seed,
        matchedProspectId: matchedProspect?.id || "",
        matched: Boolean(matchedProspect),
        matchedContactReadiness: matchedProspect?.contactReadiness || "",
        matchedBatchStage: matchedCandidate?.stage || "",
        matchedSourceLane: matchedCandidate?.sourceLane || "",
      };
    })
    .sort((left, right) => {
      if (left.cityName !== right.cityName) return left.cityName.localeCompare(right.cityName);
      if (Number(right.matched) !== Number(left.matched)) return Number(right.matched) - Number(left.matched);
      return left.businessName.localeCompare(right.businessName);
    });
}

export function listOutreachOutcomeRows(
  cityKey?: string,
  prospects: BusinessProspect[] = [],
): CityOutreachOutcomeRow[] {
  const lookup = buildProspectLookup(prospects);

  return roomsVancouverOutreachOutcomeSeeds
    .filter((seed) => !cityKey || seed.cityKey === cityKey)
    .map((seed) => {
      const matchedProspect = getMatchedProspect(
        lookup,
        seed.cityKey,
        seed.businessName,
        seed.email,
      );

      return {
        ...seed,
        matchedProspectId: matchedProspect?.id || "",
        matched: Boolean(matchedProspect),
      };
    })
    .sort((left, right) => left.businessName.localeCompare(right.businessName));
}

export function buildCityOutreachRehearsalRollups(
  prospects: BusinessProspect[] = [],
): CityOutreachRehearsalRollup[] {
  const windowRows = listOutreachWindowRows(undefined, prospects);
  const outcomeRows = listOutreachOutcomeRows(undefined, prospects);
  const cityKeys = new Set([
    ...windowRows.map((row) => row.cityKey),
    ...outcomeRows.map((row) => row.cityKey),
  ]);

  return [...cityKeys]
    .map((cityKey) => {
      const cityWindowRows = windowRows.filter((row) => row.cityKey === cityKey);
      const cityOutcomeRows = outcomeRows.filter((row) => row.cityKey === cityKey);
      const matchedProspectCount = cityWindowRows.filter((row) => row.matched).length;
      const unmatchedWindowCount = cityWindowRows.length - matchedProspectCount;
      const matchedEmailReadyCount = cityWindowRows.filter(
        (row) => row.matchedContactReadiness === "email_ready",
      ).length;
      const matchedRehearsalReadyCount = cityWindowRows.filter(
        (row) => row.matchedBatchStage === "Rehearsal ready",
      ).length;
      const bouncedCount = cityOutcomeRows.filter(
        (row) => row.deliveryStatus === "bounced",
      ).length;
      const suppressedCount = cityOutcomeRows.filter(
        (row) => row.suppressionStatus === "suppress_exact_address",
      ).length;

      let nextAction =
        "Use the imported rehearsal rows as a quality overlay only; they do not unlock sending.";
      if (cityKey === "vancouver") {
        nextAction =
          "Use the full Vancouver rehearsal overlay to keep exact-recipient review, bounce suppression, and tiny-batch discipline visible inside CityAtlas.";
      } else if (unmatchedWindowCount > 0) {
        nextAction =
          "Review unmatched rehearsal rows before widening this city queue; CityAtlas should not inherit rows that do not cleanly fit the current city boundary.";
      }

      return {
        cityKey,
        cityName: cityWindowRows[0]?.cityName || cityOutcomeRows[0]?.cityName || cityKey,
        windowRowCount: cityWindowRows.length,
        matchedProspectCount,
        unmatchedWindowCount,
        matchedEmailReadyCount,
        matchedRehearsalReadyCount,
        outcomeLedgerCount: cityOutcomeRows.length,
        bouncedCount,
        suppressedCount,
        nextAction,
      };
    })
    .sort((left, right) => left.cityName.localeCompare(right.cityName));
}
