import { seedData } from "../src/data/seed.ts";
import { simplifyGuideDisplayText } from "../src/lib/publicCopy.ts";

function createSavedItem(itemType, itemId, label) {
  return {
    id: `save-proof-${itemType}-${itemId}`,
    itemType,
    itemId,
    label,
    createdAt: "2026-06-19T00:00:00.000Z",
  };
}

function simulateMissionSave(data, missionId) {
  const mission = data.cityMissions.find((item) => item.id === missionId);
  if (!mission) {
    throw new Error(`Mission not found: ${missionId}`);
  }

  const existingPairs = new Set(data.savedItems.map((item) => `${item.itemType}:${item.itemId}`));
  const additions = mission.steps.reduce((list, step) => {
    const pairKey = `${step.itemType}:${step.itemId}`;
    if (existingPairs.has(pairKey)) {
      return list;
    }
    existingPairs.add(pairKey);
    list.push(createSavedItem(step.itemType, step.itemId, step.label));
    return list;
  }, []);

  return [...additions, ...data.savedItems];
}

function buildPlannerShareText(data, savedItems) {
  const savedBusinesses = savedItems
    .filter((item) => item.itemType === "business")
    .map((item) => data.businesses.find((business) => business.id === item.itemId))
    .filter(Boolean);
  const savedEvents = savedItems
    .filter((item) => item.itemType === "event")
    .map((item) => data.events.find((event) => event.id === item.itemId))
    .filter(Boolean);
  const savedGuides = savedItems
    .filter((item) => item.itemType === "guide")
    .map((item) => data.guides.find((guide) => guide.id === item.itemId))
    .filter(Boolean);
  const savedOffers = savedItems
    .filter((item) => item.itemType === "offer")
    .map((item) => data.offers.find((offer) => offer.id === item.itemId))
    .filter(Boolean);

  return [
    ...savedBusinesses.map((business) => `Visit ${business.name} in ${business.neighborhood}`),
    ...savedEvents.map((event) => `Check ${event.title} on ${event.date}`),
    ...savedGuides.map((guide) => `Read ${simplifyGuideDisplayText(guide.title)}`),
    ...savedOffers.map((offer) => `Save ${offer.title}`),
  ].join(" -> ");
}

function buildExpectedMissionShareText(data, mission) {
  const missionBusinesses = mission.steps
    .filter((step) => step.itemType === "business")
    .map((step) => data.businesses.find((business) => business.id === step.itemId))
    .filter(Boolean);
  const missionEvents = mission.steps
    .filter((step) => step.itemType === "event")
    .map((step) => data.events.find((event) => event.id === step.itemId))
    .filter(Boolean);
  const missionGuides = mission.steps
    .filter((step) => step.itemType === "guide")
    .map((step) => data.guides.find((guide) => guide.id === step.itemId))
    .filter(Boolean);
  const missionOffers = mission.steps
    .filter((step) => step.itemType === "offer")
    .map((step) => data.offers.find((offer) => offer.id === step.itemId))
    .filter(Boolean);

  return [
    ...missionBusinesses.map((business) => `Visit ${business.name} in ${business.neighborhood}`),
    ...missionEvents.map((event) => `Check ${event.title} on ${event.date}`),
    ...missionGuides.map((guide) => `Read ${simplifyGuideDisplayText(guide.title)}`),
    ...missionOffers.map((offer) => `Save ${offer.title}`),
  ].join(" -> ");
}

function main() {
  const data = JSON.parse(JSON.stringify(seedData));
  const missionId = "mission-date-night";
  const mission = data.cityMissions.find((item) => item.id === missionId);
  if (!mission) {
    throw new Error(`Mission not found: ${missionId}`);
  }

  const savedItems = simulateMissionSave(data, missionId);
  const itineraryText = buildPlannerShareText(data, savedItems);
  const expectedItineraryText = buildExpectedMissionShareText(data, mission);

  const duplicateBusinessEntries = savedItems.filter(
    (item, index, list) =>
      item.itemType === "business" &&
      list.findIndex(
        (candidate) =>
          candidate.itemType === item.itemType && candidate.itemId === item.itemId,
      ) !== index,
  );

  const report = {
    missionId,
    savedItems: savedItems.map((item) => ({
      itemType: item.itemType,
      itemId: item.itemId,
      label: item.label,
    })),
    itineraryText,
    expectedItineraryText,
    duplicateBusinessEntryCount: duplicateBusinessEntries.length,
    passed:
      duplicateBusinessEntries.length === 0 &&
      itineraryText === expectedItineraryText,
  };

  console.log("CityAtlas planner save-summary proof");
  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) {
    process.exitCode = 1;
  }
}

main();
