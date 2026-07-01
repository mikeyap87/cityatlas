export const blockedPhrases = [
  {
    phrase: "preview profile",
    reason: "Public business copy should not read like an internal preview state.",
  },
  {
    phrase: "preview offer",
    reason: "Public offer copy should not read like an internal preview state.",
  },
  {
    phrase: "illustrative page",
    reason: "Public page labels should be customer-facing, not operator shorthand.",
  },
  {
    phrase: "preview rsvps",
    reason: "Public event cards should not expose internal preview labels.",
  },
  {
    phrase: "preview claims",
    reason: "Public offer cards should not expose internal preview labels.",
  },
  {
    phrase: "proof sprint",
    reason: "Proof-sprint language belongs in protected operator surfaces, not public pages.",
  },
  {
    phrase: "owner inbox",
    reason: "Owner-inbox rehearsal language belongs in protected operator surfaces, not public pages.",
  },
  {
    phrase: "shadow outreach",
    reason: "Shadow outreach language belongs in protected operator surfaces, not public pages.",
  },
  {
    phrase: "manual outreach",
    reason: "Manual outreach language belongs in protected operator surfaces, not public pages.",
  },
  {
    phrase: "no-send",
    reason: "No-send operator language should not appear in public-facing copy.",
  },
  {
    phrase: "founder crm",
    reason: "Founder CRM language belongs in protected operator surfaces, not public pages.",
  },
  {
    phrase: "local-only control surface",
    reason: "Public pages should not describe themselves as internal control surfaces.",
  },
  {
    phrase: "proof surface",
    reason: "Public pages should describe reader value, not internal proof-state language.",
  },
  {
    phrase: "proof library",
    reason: "Public pages should describe the guide library directly, not internal proof-state language.",
  },
  {
    phrase: "proof system",
    reason: "Public pages should describe the reader experience directly, not internal proof-state language.",
  },
  {
    phrase: "internal-link system",
    reason: "Public pages should describe reader navigation directly, not internal architecture language.",
  },
  {
    phrase: "guide graph",
    reason: "Public pages should describe the guide library directly, not internal graph language.",
  },
  {
    phrase: "vancouver-first operationally",
    reason: "Public pages should not expose internal operating-language.",
  },
  {
    phrase: "city pilot",
    reason: "Public pages should use clearer preview language instead of internal pilot shorthand.",
  },
  {
    phrase: "pilot city surface",
    reason: "Public pages should use clearer preview language instead of internal surface shorthand.",
  },
  {
    phrase: "public-safe page",
    reason: "Public pages should describe source-backed trust clearly, not internal safety shorthand.",
  },
  {
    phrase: "public-safe",
    reason: "Public pages should describe source-backed trust clearly, not internal safety shorthand.",
  },
  {
    phrase: "public-safe real-world entries",
    reason: "Public pages should describe source-backed trust clearly, not internal safety shorthand.",
  },
  {
    phrase: "search and ai systems",
    reason: "Public pages should focus on reader value instead of internal discoverability language.",
  },
  {
    phrase: "should rank for first",
    reason: "Public pages should explain reader value, not internal ranking goals.",
  },
  {
    phrase: "ai and search systems",
    reason: "Public pages should focus on reader value instead of internal discoverability language.",
  },
];

export const renderedOnlyBlockedPhrases = [
  {
    phrase: "source-backed",
    reason: "Rendered public pages should use customer-facing planning language, not proof-lane language.",
  },
  {
    phrase: "official-source",
    reason: "Rendered public pages should use direct site links or place details, not proof-lane shorthand.",
  },
  {
    phrase: "official source notes",
    reason: "Rendered public pages should use direct site links or place details, not proof-lane shorthand.",
  },
  {
    phrase: "public-source",
    reason: "Rendered public pages should use direct site links or real places, not proof-lane shorthand.",
  },
  {
    phrase: "source notes",
    reason: "Rendered public pages should use direct site links or details to confirm, not proof-lane shorthand.",
  },
  {
    phrase: "without pretending",
    reason: "Rendered public pages should sound useful and confident, not like an internal audit note.",
  },
  {
    phrase: "claim limits",
    reason: "Rendered public pages should describe what customers can do next, not internal claim controls.",
  },
  {
    phrase: "source discipline",
    reason: "Rendered public pages should describe direct site links and updates, not internal source controls.",
  },
  {
    phrase: "source-owner",
    reason: "Rendered public pages should not expose source-tracking shorthand.",
  },
  {
    phrase: "source-date",
    reason: "Rendered public pages should not expose source-tracking shorthand.",
  },
];

export const publicSeedSections = new Set([
  "businesses",
  "events",
  "offers",
  "guides",
  "sourceBackedPlaces",
  "cityMissions",
  "packages",
]);

export const publicSeedBlockedRules = [
  {
    label: "founder-reviewed",
    pattern: /founder-reviewed/gi,
    reason: "Public website copy should describe route logic or source support, not internal founder-review language.",
  },
  {
    label: "founder partner",
    pattern: /founder partner/gi,
    reason: "Public website copy should not expose internal partner-queue language.",
  },
  {
    label: "founder review",
    pattern: /founder review/gi,
    reason: "Public website copy should not expose internal review-lane language.",
  },
  {
    label: "founder catch-up",
    pattern: /founder catch-ups?/gi,
    reason: "Public guide copy should describe the planning moment, not an internal founder persona.",
  },
  {
    label: "founder working",
    pattern: /founder working/gi,
    reason: "Public guide copy should describe the planning moment, not an internal founder persona.",
  },
  {
    label: "founders",
    pattern: /\bfounders\b/gi,
    reason: "Public audience copy should describe the reader need, not internal founder shorthand.",
  },
];
