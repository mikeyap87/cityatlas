import { seedData } from "../src/data/seed.ts";
import {
  getMissionDirectionsUrl,
  getMissionPlanState,
  getTravelModeLabel,
} from "../src/lib/missions.ts";

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
  const mission = data.cityMissions.find((item) => item.id === "mission-date-night");
  if (!mission) {
    throw new Error("mission-date-night is missing from seed data.");
  }

  const plan = getMissionPlanState(data, mission);
  const directionsUrl = getMissionDirectionsUrl(data, mission, plan.travelMode);
  const lines = [
    `${mission.title} saved plan via CityAtlas`,
    "",
    "Stops:",
    ...savedItems.map((item, index) => `${index + 1}. ${item.label}`),
    "",
    `Pace: ${getTravelModeLabel(plan.travelMode)}`,
  ];

  if (directionsUrl) {
    lines.push(`Open route in Google Maps: ${directionsUrl}`);
  }

  lines.push("", mission.sharePrompt);
  return lines.join("\n");
}

function main() {
  const data = JSON.parse(JSON.stringify(seedData));
  const mission = data.cityMissions.find((item) => item.id === "mission-date-night");
  if (!mission) {
    throw new Error("mission-date-night is missing from seed data.");
  }
  const savedItems = simulateMissionSave(data, "mission-date-night");
  const itineraryText = buildPlannerShareText(data, savedItems);

  const duplicateBusinessEntries = savedItems.filter(
    (item, index, list) =>
      item.itemType === "business" &&
      list.findIndex(
        (candidate) =>
          candidate.itemType === item.itemType && candidate.itemId === item.itemId,
      ) !== index,
  );

  const report = {
    missionId: "mission-date-night",
    savedItems: savedItems.map((item) => ({
      itemType: item.itemType,
      itemId: item.itemId,
      label: item.label,
    })),
    itineraryText,
    duplicateBusinessEntryCount: duplicateBusinessEntries.length,
    passed:
      duplicateBusinessEntries.length === 0 &&
      itineraryText.includes(`${mission.title} saved plan via CityAtlas`) &&
      itineraryText.includes("1. Read the date-night guide") &&
      itineraryText.includes("2. Dinner at Kissa Tanto") &&
      itineraryText.includes("3. Second stop at L'Abattoir") &&
      itineraryText.includes("Pace: Walk") &&
      itineraryText.includes("Open route in Google Maps: https://www.google.com/maps/dir/?api=1") &&
      itineraryText.includes("Want to try it with me this week?"),
  };

  console.log("CityAtlas planner save-summary proof");
  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) {
    process.exitCode = 1;
  }
}

main();
