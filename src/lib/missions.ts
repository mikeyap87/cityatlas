import type {
  CityAtlasData,
  CityMission,
  CityMissionStep,
  MissionFeedbackType,
  MissionPlanState,
  MissionStepStatus,
  SavedItem,
  TravelMode,
} from "../types";

const runtimeEnv = ((import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env ?? {}) as Record<string, string | undefined>;

const GOOGLE_MAPS_EMBED_API_KEY =
  runtimeEnv.VITE_CITYATLAS_GOOGLE_MAPS_EMBED_API_KEY?.trim()
  || runtimeEnv.VITE_CITYATLAS_GOOGLE_MAPS_API_KEY?.trim()
  || runtimeEnv.VITE_GOOGLE_MAPS_EMBED_API_KEY?.trim()
  || runtimeEnv.VITE_GOOGLE_MAPS_API_KEY?.trim()
  || "";

const GOOGLE_MAPS_MODES: Record<TravelMode, string> = {
  walk: "walking",
  transit: "transit",
  drive: "driving",
  bike: "bicycling",
};

const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  walk: "Walk",
  transit: "Transit",
  drive: "Drive",
  bike: "Bike",
};

const MISSION_FEEDBACK_LABELS: Record<MissionFeedbackType, string> = {
  would_do_again: "Would do again",
  too_long: "Too long",
  wrong_pace: "Wrong pace",
  share_ready: "Ready to share",
};

export const travelModes: TravelMode[] = ["walk", "transit", "drive", "bike"];

export type MissionStepUiStatus = MissionStepStatus | "saved";

export interface MissionBehaviorInsight {
  missionId: string;
  saveCount: number;
  visitedCount: number;
  skippedCount: number;
  resetCount: number;
  wouldDoAgainCount: number;
  tooLongCount: number;
  wrongPaceCount: number;
  shareReadyCount: number;
  currentSavedPercent: number;
  currentDonePercent: number;
  preferredTravelMode: TravelMode;
  lastTouchedAt?: string;
  lastFeedback?: MissionFeedbackType;
  routePreferenceScore: number;
  hasSignals: boolean;
}

export interface RouteLearningSummary {
  hasSignals: boolean;
  insights: MissionBehaviorInsight[];
  insightsById: Record<string, MissionBehaviorInsight>;
  preferredTravelMode?: TravelMode;
  recommendedMission?: CityMission;
  recommendedInsight?: MissionBehaviorInsight;
  cautionMission?: CityMission;
  cautionInsight?: MissionBehaviorInsight;
  recoveryMission?: CityMission;
}

export function formatMinutes(totalMinutes: number) {
  if (totalMinutes <= 0) return "0 min";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

export function getTravelModeLabel(mode: TravelMode) {
  return TRAVEL_MODE_LABELS[mode];
}

export function hasGoogleMapsEmbedSupport() {
  return GOOGLE_MAPS_EMBED_API_KEY.length > 0;
}

export function getDefaultMissionPlan(mission: CityMission): MissionPlanState {
  return {
    missionId: mission.id,
    travelMode: mission.defaultTravelMode,
    steps: mission.steps.map((_, index) => ({
      stepIndex: index,
      status: "pending",
      updatedAt: "",
    })),
    startedAt: "",
    updatedAt: "",
  };
}

export function getMissionPlanState(data: CityAtlasData, mission: CityMission) {
  return data.missionPlans.find((plan) => plan.missionId === mission.id) ?? getDefaultMissionPlan(mission);
}

export function getMissionSavedCount(mission: CityMission, savedItems: SavedItem[]) {
  return mission.steps.filter((step) =>
    savedItems.some((item) => item.itemType === step.itemType && item.itemId === step.itemId),
  ).length;
}

export function getMissionCompletedCount(mission: CityMission, plan: MissionPlanState) {
  return mission.steps.filter((_, index) => {
    const stepState = plan.steps.find((step) => step.stepIndex === index);
    return stepState ? stepState.status !== "pending" : false;
  }).length;
}

export function getMissionVisitedCount(mission: CityMission, plan: MissionPlanState) {
  return mission.steps.filter((_, index) => {
    const stepState = plan.steps.find((step) => step.stepIndex === index);
    return stepState?.status === "visited";
  }).length;
}

export function getMissionPendingCount(mission: CityMission, plan: MissionPlanState) {
  return Math.max(mission.steps.length - getMissionCompletedCount(mission, plan), 0);
}

export function getMissionStepUiStatus(
  mission: CityMission,
  plan: MissionPlanState,
  stepIndex: number,
  savedItems: SavedItem[],
) {
  const stepState = plan.steps.find((step) => step.stepIndex === stepIndex);
  if (stepState && stepState.status !== "pending") return stepState.status;
  const step = mission.steps[stepIndex];
  const saved = savedItems.some(
    (item) => item.itemType === step.itemType && item.itemId === step.itemId,
  );
  return saved ? "saved" : "pending";
}

export function getMissionSavedPercent(mission: CityMission, savedItems: SavedItem[]) {
  if (mission.steps.length === 0) return 0;
  return Math.round((getMissionSavedCount(mission, savedItems) / mission.steps.length) * 100);
}

export function getMissionDonePercent(mission: CityMission, plan: MissionPlanState) {
  if (mission.steps.length === 0) return 0;
  return Math.round((getMissionCompletedCount(mission, plan) / mission.steps.length) * 100);
}

export function getMissionStopMinutes(mission: CityMission) {
  return mission.steps.reduce((total, step) => total + step.durationMinutes, 0);
}

export function getMissionTravelMinutes(mission: CityMission, travelMode: TravelMode) {
  return mission.steps.reduce(
    (total, step) => total + (step.travelMinutesByMode?.[travelMode] ?? 0),
    0,
  );
}

export function getMissionTotalMinutes(mission: CityMission, travelMode: TravelMode) {
  return getMissionStopMinutes(mission) + getMissionTravelMinutes(mission, travelMode);
}

export function getMissionTravelSummary(mission: CityMission, travelMode: TravelMode) {
  const totalTravelMinutes = getMissionTravelMinutes(mission, travelMode);
  if (totalTravelMinutes === 0) return "No travel timing needed";
  return `${formatMinutes(totalTravelMinutes)} of ${TRAVEL_MODE_LABELS[travelMode].toLowerCase()} travel`;
}

function isTravelMode(value: string | number | boolean | undefined): value is TravelMode {
  return value === "walk" || value === "transit" || value === "drive" || value === "bike";
}

function isMissionFeedbackType(
  value: string | number | boolean | undefined,
): value is MissionFeedbackType {
  return (
    value === "would_do_again"
    || value === "too_long"
    || value === "wrong_pace"
    || value === "share_ready"
  );
}

function pickDominantTravelMode(
  counts: Partial<Record<TravelMode, number>>,
  fallback: TravelMode,
) {
  let bestMode = fallback;
  let bestCount = counts[fallback] ?? 0;

  for (const mode of travelModes) {
    const nextCount = counts[mode] ?? 0;
    if (nextCount > bestCount) {
      bestMode = mode;
      bestCount = nextCount;
    }
  }

  return bestMode;
}

function resolveBusiness(data: CityAtlasData, id: string) {
  return data.businesses.find((business) => business.id === id);
}

function resolveEvent(data: CityAtlasData, id: string) {
  return data.events.find((event) => event.id === id);
}

function resolveGuide(data: CityAtlasData, id: string) {
  return data.guides.find((guide) => guide.id === id);
}

function resolveSourceBackedPlace(data: CityAtlasData, id: string) {
  return data.sourceBackedPlaces.find((place) => place.id === id);
}

export function resolveSavedItemTypeLabel(itemType: SavedItem["itemType"]) {
  if (itemType === "source_backed_place") return "source-backed place";
  return itemType;
}

export function resolveMissionStepTarget(
  data: CityAtlasData,
  step: CityMissionStep,
) {
  if (step.itemType === "business") {
    const business = resolveBusiness(data, step.itemId);
    return {
      label: business?.name ?? step.label,
      neighborhood: business?.neighborhood ?? step.neighborhood,
      mapQuery: step.mapQuery ?? business?.address,
      secondaryLink: business?.website,
    };
  }

  if (step.itemType === "event") {
    const event = resolveEvent(data, step.itemId);
    return {
      label: event?.title ?? step.label,
      neighborhood: event?.neighborhood ?? step.neighborhood,
      mapQuery:
        step.mapQuery
        ?? (event
          ? `${event.venue}, ${event.neighborhood}, Vancouver, BC`
          : undefined),
      secondaryLink: undefined,
    };
  }

  if (step.itemType === "source_backed_place") {
    const place = resolveSourceBackedPlace(data, step.itemId);
    const derivedMapQuery = place ? `${place.name}, Vancouver, BC` : undefined;
    return {
      label: place?.name ?? step.label,
      neighborhood: place?.neighborhood ?? step.neighborhood,
      mapQuery: step.mapQuery ?? derivedMapQuery,
      secondaryLink: place?.officialSourceUrl,
    };
  }

  if (step.itemType === "guide") {
    const guide = resolveGuide(data, step.itemId);
    return {
      label: guide?.title ?? step.label,
      neighborhood: guide?.neighborhood ?? step.neighborhood,
      mapQuery: step.mapQuery,
      secondaryLink: undefined,
    };
  }

  return {
    label: step.label,
    neighborhood: step.neighborhood,
    mapQuery: step.mapQuery,
    secondaryLink: undefined,
  };
}

export function getMissionMappableStops(data: CityAtlasData, mission: CityMission) {
  return mission.steps
    .map((step, index) => {
      const target = resolveMissionStepTarget(data, step);
      if (!target.mapQuery) return undefined;
      return {
        step,
        stepIndex: index,
        label: target.label,
        query: target.mapQuery,
      };
    })
    .filter(Boolean) as Array<{
      step: CityMissionStep;
      stepIndex: number;
      label: string;
      query: string;
    }>;
}

export function getMissionDirectionsUrl(
  data: CityAtlasData,
  mission: CityMission,
  travelMode: TravelMode,
) {
  const stops = getMissionMappableStops(data, mission);
  if (stops.length === 0) return undefined;

  if (stops.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0].query)}`;
  }

  const origin = encodeURIComponent(stops[0].query);
  const destination = encodeURIComponent(stops[stops.length - 1].query);
  const waypoints = stops
    .slice(1, -1)
    .map((stop) => encodeURIComponent(stop.query))
    .join("|");

  const parts = [
    "https://www.google.com/maps/dir/?api=1",
    `origin=${origin}`,
    `destination=${destination}`,
    `travelmode=${GOOGLE_MAPS_MODES[travelMode]}`,
  ];

  if (waypoints) {
    parts.push(`waypoints=${waypoints}`);
  }

  return parts.join("&");
}

export function getMissionEmbedUrl(
  data: CityAtlasData,
  mission: CityMission,
  travelMode: TravelMode,
) {
  const stops = getMissionMappableStops(data, mission);
  if (!GOOGLE_MAPS_EMBED_API_KEY || stops.length < 2) return undefined;

  const origin = encodeURIComponent(stops[0].query);
  const destination = encodeURIComponent(stops[stops.length - 1].query);
  const parts = [
    "https://www.google.com/maps/embed/v1/directions",
    `key=${encodeURIComponent(GOOGLE_MAPS_EMBED_API_KEY)}`,
    `origin=${origin}`,
    `destination=${destination}`,
    `mode=${GOOGLE_MAPS_MODES[travelMode]}`,
  ];

  const waypoints = stops
    .slice(1, -1)
    .map((stop) => encodeURIComponent(stop.query))
    .join("|");

  if (waypoints) {
    parts.push(`waypoints=${waypoints}`);
  }

  return `${parts[0]}?${parts.slice(1).join("&")}`;
}

export function getMissionStepTravelLabel(step: CityMissionStep, travelMode: TravelMode) {
  const minutes = step.travelMinutesByMode?.[travelMode];
  if (!minutes) return undefined;
  return `${minutes} min ${TRAVEL_MODE_LABELS[travelMode].toLowerCase()} from the previous stop`;
}

export function getMissionFeedbackLabel(feedback: MissionFeedbackType) {
  return MISSION_FEEDBACK_LABELS[feedback];
}

export function getMissionLatestFeedback(
  data: CityAtlasData,
  missionId: string,
): MissionFeedbackType | undefined {
  let latestFeedback: MissionFeedbackType | undefined;
  let latestAt = "";

  for (const event of data.growthEvents) {
    if (event.name !== "mission_feedback_recorded") continue;
    if (event.detail.missionId !== missionId) continue;
    if (!isMissionFeedbackType(event.detail.feedbackType)) continue;
    if (event.createdAt >= latestAt) {
      latestAt = event.createdAt;
      latestFeedback = event.detail.feedbackType;
    }
  }

  return latestFeedback;
}

export function getMissionShareText(
  data: CityAtlasData,
  mission: CityMission,
  plan: MissionPlanState,
) {
  const totalTime = formatMinutes(getMissionTotalMinutes(mission, plan.travelMode));
  const travelSummary = getMissionTravelSummary(mission, plan.travelMode);
  const directionsUrl = getMissionDirectionsUrl(data, mission, plan.travelMode);

  const lines = [
    `${mission.title} via CityAtlas`,
    `Best start: ${mission.startWindow}`,
    `Route length: ${totalTime} total with ${travelSummary}.`,
    "",
    "Stops:",
    ...mission.steps.map((step, index) => {
      const target = resolveMissionStepTarget(data, step);
      const status = getMissionStepUiStatus(mission, plan, index, data.savedItems);
      const parts = [
        `${index + 1}. ${target.label}`,
        `${formatMinutes(step.durationMinutes)}`,
      ];
      if (step.bestAt) parts.push(step.bestAt);
      if (status !== "pending") parts.push(status);
      return parts.join(" - ");
    }),
  ];

  if (directionsUrl) {
    lines.push("", `Open route in Google Maps: ${directionsUrl}`);
  }

  lines.push("", mission.sharePrompt);
  return lines.join("\n");
}

export function getMissionBehaviorInsights(data: CityAtlasData) {
  return data.cityMissions.map((mission) => {
    const plan = getMissionPlanState(data, mission);
    const modeCounts: Partial<Record<TravelMode, number>> = {
      [plan.travelMode]: 1,
    };
    let saveCount = 0;
    let visitedCount = 0;
    let skippedCount = 0;
    let resetCount = 0;
    let wouldDoAgainCount = 0;
    let tooLongCount = 0;
    let wrongPaceCount = 0;
    let shareReadyCount = 0;
    let lastTouchedAt = plan.updatedAt || plan.startedAt || "";
    let lastFeedback: MissionFeedbackType | undefined;
    let lastFeedbackAt = "";

    for (const event of data.growthEvents) {
      if (event.detail.missionId !== mission.id) continue;

      if (!lastTouchedAt || event.createdAt > lastTouchedAt) {
        lastTouchedAt = event.createdAt;
      }

      if (event.name === "city_mission_saved") {
        saveCount += 1;
      }

      if (event.name === "mission_step_visited") {
        visitedCount += 1;
      }

      if (event.name === "mission_step_skipped") {
        skippedCount += 1;
      }

      if (event.name === "mission_progress_reset") {
        resetCount += 1;
      }

      if (event.name === "mission_travel_mode_changed" && isTravelMode(event.detail.travelMode)) {
        modeCounts[event.detail.travelMode] = (modeCounts[event.detail.travelMode] ?? 0) + 1;
      }

      if (
        event.name === "mission_feedback_recorded"
        && isMissionFeedbackType(event.detail.feedbackType)
      ) {
        if (event.createdAt >= lastFeedbackAt) {
          lastFeedbackAt = event.createdAt;
          lastFeedback = event.detail.feedbackType;
        }

        if (event.detail.feedbackType === "would_do_again") {
          wouldDoAgainCount += 1;
        }
        if (event.detail.feedbackType === "too_long") {
          tooLongCount += 1;
        }
        if (event.detail.feedbackType === "wrong_pace") {
          wrongPaceCount += 1;
        }
        if (event.detail.feedbackType === "share_ready") {
          shareReadyCount += 1;
        }
      }
    }

    const currentSavedPercent = getMissionSavedPercent(mission, data.savedItems);
    const currentDonePercent = getMissionDonePercent(mission, plan);
    const preferredTravelMode = pickDominantTravelMode(modeCounts, plan.travelMode);
    const hasSignals =
      currentSavedPercent > 0
      || currentDonePercent > 0
      || saveCount > 0
      || visitedCount > 0
      || skippedCount > 0
      || resetCount > 0
      || wouldDoAgainCount > 0
      || tooLongCount > 0
      || wrongPaceCount > 0
      || shareReadyCount > 0;

    let routePreferenceScore =
      currentSavedPercent * 0.55
      + currentDonePercent * 0.75
      + saveCount * 12
      + visitedCount * 18
      + wouldDoAgainCount * 16
      + shareReadyCount * 14
      - skippedCount * 10
      - resetCount * 6
      - tooLongCount * 12
      - wrongPaceCount * 10;

    if (visitedCount > skippedCount) {
      routePreferenceScore += 8;
    }

    if (skippedCount > visitedCount && skippedCount > 0) {
      routePreferenceScore -= 10;
    }

    if (currentSavedPercent > 0 && currentDonePercent === 0) {
      routePreferenceScore += 4;
    }

    if (wouldDoAgainCount > 0 && tooLongCount === 0 && wrongPaceCount === 0) {
      routePreferenceScore += 6;
    }

    return {
      missionId: mission.id,
      saveCount,
      visitedCount,
      skippedCount,
      resetCount,
      wouldDoAgainCount,
      tooLongCount,
      wrongPaceCount,
      shareReadyCount,
      currentSavedPercent,
      currentDonePercent,
      preferredTravelMode,
      lastTouchedAt: lastTouchedAt || undefined,
      lastFeedback,
      routePreferenceScore: Math.round(routePreferenceScore),
      hasSignals,
    } satisfies MissionBehaviorInsight;
  });
}

export function getRouteLearningSummary(data: CityAtlasData): RouteLearningSummary {
  const insights = getMissionBehaviorInsights(data);
  const insightsById = Object.fromEntries(
    insights.map((insight) => [insight.missionId, insight]),
  ) as Record<string, MissionBehaviorInsight>;
  const signalInsights = insights.filter((insight) => insight.hasSignals);

  const preferredTravelModeCounts: Partial<Record<TravelMode, number>> = {};
  for (const insight of signalInsights) {
    preferredTravelModeCounts[insight.preferredTravelMode] =
      (preferredTravelModeCounts[insight.preferredTravelMode] ?? 0) + 1;
  }

  const fallbackMode = signalInsights[0]?.preferredTravelMode;
  const preferredTravelMode = fallbackMode
    ? pickDominantTravelMode(preferredTravelModeCounts, fallbackMode)
    : undefined;

  const rankedInsights = signalInsights
    .filter((insight) => insight.routePreferenceScore > 0)
    .sort((left, right) =>
      right.routePreferenceScore - left.routePreferenceScore
      || right.visitedCount - left.visitedCount
      || right.currentSavedPercent - left.currentSavedPercent,
    );

  const recommendedInsight = rankedInsights[0];
  const recommendedMission = recommendedInsight
    ? data.cityMissions.find((mission) => mission.id === recommendedInsight.missionId)
    : undefined;

  const cautionInsight = signalInsights
    .filter((insight) =>
      (insight.skippedCount > insight.visitedCount && insight.skippedCount > 0)
      || insight.tooLongCount > 0
      || insight.wrongPaceCount > 0,
    )
    .sort((left, right) =>
      (right.tooLongCount + right.wrongPaceCount + right.skippedCount)
      - (left.tooLongCount + left.wrongPaceCount + left.skippedCount)
      || (right.skippedCount - right.visitedCount) - (left.skippedCount - left.visitedCount)
    )[0];

  const cautionMission = cautionInsight
    ? data.cityMissions.find((mission) => mission.id === cautionInsight.missionId)
    : undefined;

  const recoveryMission = cautionMission
    ? data.cityMissions
      .filter((mission) => mission.id !== cautionMission.id)
      .sort((left, right) =>
        getMissionTotalMinutes(left, left.defaultTravelMode)
        - getMissionTotalMinutes(right, right.defaultTravelMode),
      )[0]
    : undefined;

  return {
    hasSignals: signalInsights.length > 0,
    insights,
    insightsById,
    preferredTravelMode,
    recommendedMission,
    recommendedInsight,
    cautionMission,
    cautionInsight,
    recoveryMission,
  };
}

export function getMissionFitLabel(insight?: MissionBehaviorInsight) {
  if (!insight || !insight.hasSignals) return "Fresh route";
  if (
    (insight.skippedCount > insight.visitedCount && insight.skippedCount > 0)
    || insight.tooLongCount > 0
    || insight.wrongPaceCount > 0
  ) {
    return "Needs tightening";
  }
  if (insight.wouldDoAgainCount > 0 || insight.shareReadyCount > 0) return "Would repeat";
  if (insight.visitedCount > 0 || insight.currentDonePercent >= 60) return "Working well";
  if (insight.currentSavedPercent >= 50 || insight.saveCount > 0) return "Ready to try";
  return "Fresh route";
}

export function getMissionFitTone(insight?: MissionBehaviorInsight) {
  const label = getMissionFitLabel(insight);
  if (label === "Would repeat") return "green" as const;
  if (label === "Working well") return "green" as const;
  if (label === "Needs tightening") return "amber" as const;
  if (label === "Ready to try") return "blue" as const;
  return "muted" as const;
}

export function getMissionFitNote(
  mission: CityMission,
  insight?: MissionBehaviorInsight,
) {
  if (!insight || !insight.hasSignals) {
    return "This route is still clean and ready for a first proper try.";
  }

  if (insight.tooLongCount > 0) {
    return `You flagged this route as too long ${insight.tooLongCount} time${insight.tooLongCount === 1 ? "" : "s"}, so shorten it before adding more stops.`;
  }

  if (insight.wrongPaceCount > 0) {
    return `You flagged the pace here ${insight.wrongPaceCount} time${insight.wrongPaceCount === 1 ? "" : "s"}, so switch travel mode before your next run.`;
  }

  if (insight.skippedCount > insight.visitedCount && insight.skippedCount > 0) {
    return `You have skipped ${insight.skippedCount} stop${insight.skippedCount === 1 ? "" : "s"} here, so keep this route shorter next time.`;
  }

  if (insight.wouldDoAgainCount > 0 || insight.shareReadyCount > 0) {
    return `You marked this route as worth repeating${insight.shareReadyCount > 0 ? " and ready to share" : ""}, so it is a strong default next pick.`;
  }

  if (insight.visitedCount > 0 || insight.currentDonePercent >= 60) {
    return `You have already kept ${insight.visitedCount || Math.round((mission.steps.length * insight.currentDonePercent) / 100)} stop${insight.visitedCount === 1 ? "" : "s"} moving here.`;
  }

  if (insight.currentSavedPercent >= 50 || insight.saveCount > 0) {
    return `${insight.currentSavedPercent}% of this route is already saved on this device.`;
  }

  return "This route is still clean and ready for a first proper try.";
}
