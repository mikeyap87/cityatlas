import { useEffect, useMemo, useState } from "react";
import type {
  CityAtlasData,
  CityMission,
  CityMissionStep,
  MissionFeedbackType,
  MissionStepStatus,
  TravelMode,
} from "../types";
import {
  formatMissionClockLabel,
  formatMinutes,
  getMissionFeedbackLabel,
  getMissionCityName,
  getMissionLatestFeedback,
  getMissionDirectionsUrl,
  getMissionEmbedUrl,
  getMissionMappableStops,
  getMissionPlanState,
  getMissionSavedCount,
  getMissionSchedule,
  getMissionSelectedStartTime,
  getMissionShareText,
  getMissionStepTravelLabel,
  getMissionStepUiStatus,
  getMissionTravelSummary,
  getTravelModeLabel,
  resolveMissionStepTarget,
  travelModes,
} from "../lib/missions";
import { getGuidePath } from "../lib/cityPaths";
import { simplifyMissionDisplayText } from "../lib/publicCopy";
import {
  BikeIcon,
  CalendarIcon,
  CarIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CopyIcon,
  ExternalLinkIcon,
  MapIcon,
  RefreshIcon,
  ShareIcon,
  SparkIcon,
  TransitIcon,
  WalkIcon,
} from "./Icons";
import { AppLink } from "./Link";
import { StatusPill } from "./UI";

interface MissionExecutionPanelProps {
  data: CityAtlasData;
  mission: CityMission;
  onSaveMission: (mission: CityMission) => void;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
  onSetMissionTravelMode: (mission: CityMission, travelMode: TravelMode) => void;
  onSetMissionStartTime: (mission: CityMission, selectedStartTime: string) => void;
  onSetMissionStepStatus: (
    mission: CityMission,
    stepIndex: number,
    status: MissionStepStatus,
  ) => void;
  onAddMissionFeedback: (mission: CityMission, feedbackType: MissionFeedbackType) => void;
  onResetMissionProgress: (mission: CityMission) => void;
  variant?: "default" | "planner";
}

function TravelModeIcon({ mode }: { mode: TravelMode }) {
  if (mode === "walk") return <WalkIcon />;
  if (mode === "transit") return <TransitIcon />;
  if (mode === "drive") return <CarIcon />;
  return <BikeIcon />;
}

function getStatusTone(status: ReturnType<typeof getMissionStepUiStatus>) {
  if (status === "visited") return "green" as const;
  if (status === "skipped") return "amber" as const;
  if (status === "saved") return "blue" as const;
  return "muted" as const;
}

function getStatusLabel(status: ReturnType<typeof getMissionStepUiStatus>) {
  if (status === "visited") return "visited";
  if (status === "skipped") return "skipped";
  if (status === "saved") return "saved";
  return "next up";
}

function buildStepMapsUrl(mapQuery?: string) {
  if (!mapQuery) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}

function buildRouteHeadline(stopLabels: string[]) {
  if (stopLabels.length === 0) return "Keep only the stops you would repeat.";
  if (stopLabels.length === 1) return `Start at ${stopLabels[0]}.`;
  if (stopLabels.length === 2) return `Start at ${stopLabels[0]}, then ${stopLabels[1]}.`;
  return `Start at ${stopLabels[0]}, then ${stopLabels.slice(1, -1).join(", ")}, and finish at ${stopLabels.at(-1)}.`;
}

function getStepTravelFact(step: CityMissionStep, travelMode: TravelMode) {
  const minutes = step.travelMinutesByMode?.[travelMode];
  if (!minutes) return getTravelModeLabel(travelMode);
  return `${minutes} min by ${getTravelModeLabel(travelMode).toLowerCase()}`;
}

function getStepVisual(data: CityAtlasData, step?: CityMissionStep) {
  if (!step) return undefined;

  if (step.itemType === "business") {
    const business = data.businesses.find((item) => item.id === step.itemId);
    if (!business?.heroImage) return undefined;
    return {
      src: business.heroImage,
      alt: business.name,
    };
  }

  if (step.itemType === "event") {
    const event = data.events.find((item) => item.id === step.itemId);
    if (!event?.image) return undefined;
    return {
      src: event.image,
      alt: event.title,
    };
  }

  if (step.itemType === "guide") {
    const guide = data.guides.find((item) => item.id === step.itemId);
    if (!guide?.image) return undefined;
    return {
      src: guide.image,
      alt: guide.title,
    };
  }

  return undefined;
}

function simplifyNextStepNote(value: string) {
  return simplifyMissionDisplayText(value).replace(/\bmain main stop\b/gi, "main stop");
}

export function MissionExecutionPanel({
  data,
  mission,
  onSaveMission,
  onTrack,
  onSetMissionTravelMode,
  onSetMissionStartTime,
  onSetMissionStepStatus,
  onAddMissionFeedback,
  onResetMissionProgress,
  variant = "default",
}: MissionExecutionPanelProps) {
  const [shareFeedback, setShareFeedback] = useState("");
  const [saveFeedback, setSaveFeedback] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [embedFailed, setEmbedFailed] = useState(false);
  const [showInlineMap, setShowInlineMap] = useState(variant === "planner");
  const [expandedStepIndices, setExpandedStepIndices] = useState<number[]>([]);
  const plan = getMissionPlanState(data, mission);
  const mappableStops = useMemo(() => getMissionMappableStops(data, mission), [data, mission]);
  const directionsUrl = useMemo(
    () => getMissionDirectionsUrl(data, mission, plan.travelMode),
    [data, mission, plan.travelMode],
  );
  const embedUrl = useMemo(
    () => getMissionEmbedUrl(data, mission, plan.travelMode),
    [data, mission, plan.travelMode],
  );
  const shareText = useMemo(
    () => getMissionShareText(data, mission, plan),
    [data, mission, plan],
  );
  const scheduleEntries = useMemo(
    () => getMissionSchedule(mission, plan),
    [mission, plan],
  );
  const savedCount = getMissionSavedCount(mission, data.savedItems);
  const selectedStartTime = getMissionSelectedStartTime(mission, plan);
  const routeMapId = `${mission.id}-route-map`;
  const routeTimelineId = `${mission.id}-route-timeline`;
  const routeActionsId = `${mission.id}-route-actions`;
  const startOptions = mission.startOptions ?? [];
  const canPreviewInlineMap = Boolean(embedUrl && !embedFailed);
  const showMapFrame = Boolean(canPreviewInlineMap && showInlineMap);
  const latestFeedback = useMemo(
    () => getMissionLatestFeedback(data, mission.id),
    [data, mission.id],
  );
  const stepStatuses = useMemo(
    () => mission.steps.map((_, index) => getMissionStepUiStatus(mission, plan, index, data.savedItems)),
    [data.savedItems, mission, plan],
  );
  const supportGuideStep = useMemo(() => {
    for (let index = 0; index < mission.steps.length; index += 1) {
      const step = mission.steps[index];
      if (step.itemType !== "guide") continue;
      return {
        step,
        stepIndex: index,
        guide: data.guides.find((item) => item.id === step.itemId),
      };
    }
    return undefined;
  }, [data.guides, mission.steps]);
  const routeStepIndices = useMemo(
    () =>
      mission.steps.reduce<number[]>((indices, step, index) => {
        if (step.itemType !== "guide") indices.push(index);
        return indices;
      }, []),
    [mission.steps],
  );
  const routeStepNumberByIndex = useMemo(
    () => new Map(routeStepIndices.map((stepIndex, displayIndex) => [stepIndex, displayIndex + 1])),
    [routeStepIndices],
  );
  const routeScheduleEntries = useMemo(() => {
    const selectedStartMinutes = scheduleEntries[0]?.startMinutes;
    if (selectedStartMinutes === undefined) return [];

    let currentStart = selectedStartMinutes;
    return routeStepIndices.map((stepIndex, routeIndex) => {
      const step = mission.steps[stepIndex];
      if (routeIndex > 0) {
        currentStart += step.travelMinutesByMode?.[plan.travelMode] ?? 0;
      }

      const startMinutes = currentStart;
      const endMinutes = startMinutes + step.durationMinutes;
      currentStart = endMinutes;

      const startLabel = formatMissionClockLabel(startMinutes) ?? "";
      const endLabel = formatMissionClockLabel(endMinutes) ?? "";

      return {
        stepIndex,
        startMinutes,
        endMinutes,
        startLabel,
        endLabel,
        rangeLabel: `${startLabel}-${endLabel}`,
      };
    });
  }, [mission.steps, plan.travelMode, routeStepIndices, scheduleEntries]);
  const routeScheduleByIndex = useMemo(
    () => Object.fromEntries(routeScheduleEntries.map((entry) => [entry.stepIndex, entry])),
    [routeScheduleEntries],
  );
  const routeTotalMinutes = useMemo(
    () =>
      routeStepIndices.reduce((total, stepIndex, routeIndex) => {
        const step = mission.steps[stepIndex];
        return total + step.durationMinutes + (routeIndex > 0 ? step.travelMinutesByMode?.[plan.travelMode] ?? 0 : 0);
      }, 0),
    [mission.steps, plan.travelMode, routeStepIndices],
  );
  const routeEndTime = routeScheduleEntries.at(-1)?.endLabel;
  const nextStepIndex =
    routeStepIndices.find((stepIndex) => {
      const status = stepStatuses[stepIndex];
      return status !== "visited" && status !== "skipped";
    }) ?? -1;
  const orderedStepIndices = useMemo(() => {
    const nextVisibleIndex = routeStepIndices.findIndex((stepIndex) => stepIndex === nextStepIndex);
    if (nextVisibleIndex <= 0) return routeStepIndices;
    return [...routeStepIndices.slice(nextVisibleIndex), ...routeStepIndices.slice(0, nextVisibleIndex)];
  }, [routeStepIndices, nextStepIndex]);
  const routePendingCount = routeStepIndices.filter((stepIndex) => {
    const status = stepStatuses[stepIndex];
    return status !== "visited" && status !== "skipped";
  }).length;
  const nextStep = nextStepIndex >= 0 ? mission.steps[nextStepIndex] : undefined;
  const nextStepTarget = nextStep ? resolveMissionStepTarget(data, nextStep, mission) : undefined;
  const nextStepVisual = useMemo(() => getStepVisual(data, nextStep), [data, nextStep]);
  const nextStepNumber = nextStepIndex >= 0 ? routeStepNumberByIndex.get(nextStepIndex) ?? 1 : routeStepIndices.length;
  const nextStepMapsUrl = nextStepTarget ? buildStepMapsUrl(nextStepTarget.mapQuery) : undefined;
  const nextStepTravelFact = nextStep ? getStepTravelFact(nextStep, plan.travelMode) : undefined;
  const nextStepSchedule = nextStepIndex >= 0
    ? routeScheduleByIndex[nextStepIndex] as { rangeLabel?: string; startLabel?: string } | undefined
    : undefined;
  const routeStopsLeftAfterNext = nextStepIndex >= 0 ? Math.max(routePendingCount - 1, 0) : 0;
  const routeHeadline = useMemo(
    () =>
      buildRouteHeadline(
        routeStepIndices.map((stepIndex) => resolveMissionStepTarget(data, mission.steps[stepIndex], mission).label),
      ),
    [data, mission, routeStepIndices],
  );
  const supportGuidePath = supportGuideStep?.guide ? getGuidePath(supportGuideStep.guide) : undefined;
  const laterMapStops = useMemo(() => {
    const laterStepIndices = nextStepIndex >= 0 ? orderedStepIndices.slice(1) : orderedStepIndices;

    return laterStepIndices.reduce<Array<{
      label: string;
      neighborhood: string;
      scheduleLabel: string;
      stepNumber: number;
    }>>((items, stepIndex) => {
      const stop = mappableStops.find((entry) => entry.stepIndex === stepIndex);
      if (!stop) return items;

      const schedule = routeScheduleByIndex[stepIndex] as
        | { startLabel?: string; rangeLabel?: string }
        | undefined;

      items.push({
        label: stop.label,
        neighborhood: stop.step.neighborhood,
        scheduleLabel: schedule?.startLabel ?? schedule?.rangeLabel ?? "Plan stop",
        stepNumber: routeStepNumberByIndex.get(stepIndex) ?? stepIndex + 1,
      });
      return items;
    }, []);
  }, [mappableStops, nextStepIndex, orderedStepIndices, routeScheduleByIndex, routeStepNumberByIndex]);
  const nextStepSummary = nextStepTarget
    ? [nextStepSchedule?.rangeLabel, `in ${nextStepTarget.neighborhood}`].filter(Boolean).join(" • ")
    : routeEndTime
      ? `Finish around ${routeEndTime} if you keep this pace.`
      : "Keep only the stops that still feel worth repeating.";
  const routeDisclosureTitle = variant === "planner"
    ? nextStep
      ? "See the rest of the day"
      : "See the full day again"
    : nextStep
      ? "See the rest of the route"
      : "See the full route again";
  const routeDisclosureNote = nextStep
    ? "Keep this closed until you want the map, later stops, or sharing tools."
    : "Open this only if you want the map, timing, or sharing tools again.";

  useEffect(() => {
    setEmbedFailed(false);
    setShowInlineMap(variant === "planner" && Boolean(embedUrl));
  }, [embedUrl, variant]);

  useEffect(() => {
    setExpandedStepIndices(nextStepIndex >= 0 ? [nextStepIndex] : []);
    setSaveFeedback("");
  }, [mission.id, nextStepIndex]);

  function handleStepDisclosureToggle(stepIndex: number, open: boolean) {
    setExpandedStepIndices(open ? [stepIndex] : []);
  }

  function handleStepStatusChange(stepIndex: number, status: MissionStepStatus) {
    onSetMissionStepStatus(mission, stepIndex, status);
    setExpandedStepIndices((current) => current.filter((value) => value !== stepIndex));
  }

  function handleResetProgress() {
    setExpandedStepIndices([]);
    onResetMissionProgress(mission);
  }

  function handleSaveMission() {
    onSaveMission(mission);
    setSaveFeedback("Saved. Open it again in Planner whenever you need the map.");
  }

  async function handleCopyShare() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareFeedback("Plan summary copied.");
      } else {
        setShareFeedback("Plan summary is ready below.");
      }
      onTrack("mission_share_copied", {
        missionId: mission.id,
        travelMode: plan.travelMode,
      });
    } catch {
      setShareFeedback("Plan summary is ready below.");
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) {
      await handleCopyShare();
      return;
    }

    try {
      await navigator.share({
        title: mission.title,
        text: shareText,
        url: directionsUrl,
      });
      setShareFeedback("Plan shared.");
      onTrack("mission_shared", {
        missionId: mission.id,
        travelMode: plan.travelMode,
      });
    } catch {
      setShareFeedback("Share canceled. Your plan summary is still ready below.");
    }
  }

  function handleFeedback(feedbackType: MissionFeedbackType) {
    onAddMissionFeedback(mission, feedbackType);
    setFeedbackNote(`${getMissionFeedbackLabel(feedbackType)} saved on this device.`);
    onTrack("mission_feedback_selected", {
      missionId: mission.id,
      feedbackType,
    });
  }

  if (variant === "planner") {
    return (
      <div className="mission-execution-panel planner mission-full-bleed-panel">
        <div className="mission-full-bleed-shell">
          <aside className="mission-plan-rail" aria-label={`${mission.title} plan controls`}>
            <div className="mission-plan-rail-header">
              <p className="section-label">Planner</p>
              <h1>{simplifyMissionDisplayText(mission.title)}</h1>
              <p>{routeHeadline}</p>
            </div>

            <div className="mission-plan-rail-facts" aria-label={`${mission.title} route facts`}>
              <article>
                <small>Start</small>
                <strong>{selectedStartTime ?? mission.startWindow}</strong>
              </article>
              <article>
                <small>Time</small>
                <strong>{formatMinutes(routeTotalMinutes)}</strong>
              </article>
              <article>
                <small>Pace</small>
                <strong>{getTravelModeLabel(plan.travelMode)}</strong>
              </article>
            </div>

            <div className="mission-plan-rail-section">
              <div className="mission-plan-rail-section-header">
                <p className="section-label">Step 1</p>
                <strong>Pick a start time</strong>
              </div>
              {startOptions.length > 0 ? (
                <div className="mission-start-time-options mission-plan-rail-chips" role="list" aria-label={`${mission.title} start time options`}>
                  {startOptions.map((option) => (
                    <button
                      className={selectedStartTime === option ? "route-status-chip active" : "route-status-chip"}
                      type="button"
                      onClick={() => onSetMissionStartTime(mission, option)}
                      key={option}
                    >
                      <CalendarIcon />
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mission-plan-rail-copy">{mission.startWindow}</p>
              )}
            </div>

            <div className="mission-plan-rail-section">
              <div className="mission-plan-rail-section-header">
                <p className="section-label">Step 2</p>
                <strong>Choose how you are moving</strong>
              </div>
              <div className="travel-mode-segment mission-plan-rail-mode-tabs" role="tablist" aria-label={`${mission.title} travel mode`}>
                {travelModes.map((mode) => (
                  <button
                    className={plan.travelMode === mode ? "travel-mode-chip active" : "travel-mode-chip"}
                    type="button"
                    onClick={() => onSetMissionTravelMode(mission, mode)}
                    key={mode}
                  >
                    <TravelModeIcon mode={mode} />
                    <span>{getTravelModeLabel(mode)}</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          <section className="mission-full-bleed-map-panel" id={routeMapId} aria-label={`${mission.title} route map`}>
            <div className="mission-full-bleed-map-sticky">
              <div className="mission-full-bleed-map-toolbar">
                <div>
                  <p className="section-label">Route map</p>
                  <strong>See the whole route</strong>
                  <small>Choose time, check the route, then keep it.</small>
                </div>
                {directionsUrl ? (
                  <a className="button secondary" href={directionsUrl} rel="noreferrer" target="_blank">
                    Open in Google Maps <ExternalLinkIcon />
                  </a>
                ) : null}
              </div>

              <div className="mission-full-bleed-map-surface">
                {showMapFrame ? (
                  <iframe
                    className="mission-map-frame mission-full-bleed-map-frame"
                    loading="lazy"
                    onError={() => setEmbedFailed(true)}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={embedUrl}
                    title={`${mission.title} Google Maps plan`}
                  />
                ) : (
                  <div className="mission-map-fallback mission-full-bleed-map-fallback">
                    <div className="mission-map-fallback-header">
                      <MapIcon />
                      <div>
                        <p className="section-label">Map</p>
                        <strong>{embedFailed ? "Map preview is unavailable right now" : "Map preview is not showing here yet"}</strong>
                        <p>
                          Use the Google Maps button for the route. The plan rail still gives you the stops in order.
                        </p>
                      </div>
                    </div>
                    {directionsUrl ? (
                      <a className="button primary" href={directionsUrl} rel="noreferrer" target="_blank">
                        Open the route in Google Maps <ExternalLinkIcon />
                      </a>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="mission-plan-rail mission-plan-rail-lower" aria-label={`${mission.title} stop list and save controls`}>
            <div className="mission-plan-rail-section mission-plan-rail-route-section">
              <div className="mission-plan-rail-section-header">
                <p className="section-label">Step 3</p>
                <strong>Follow the stops</strong>
                <small>
                  {nextStepTarget
                    ? `Go to ${nextStepTarget.label} next.`
                    : routeEndTime
                      ? `Plan complete around ${routeEndTime}.`
                      : "Mark stops as you go."}
                </small>
              </div>

              <ol className="mission-plan-rail-timeline" id={routeTimelineId}>
                {orderedStepIndices.map((stepIndex, orderedIndex) => {
                  const step = mission.steps[stepIndex];
                  const target = resolveMissionStepTarget(data, step, mission);
                  const status = getMissionStepUiStatus(mission, plan, stepIndex, data.savedItems);
                  const mapsUrl = buildStepMapsUrl(target.mapQuery);
                  const schedule = routeScheduleByIndex[stepIndex] as { rangeLabel?: string; startLabel?: string } | undefined;
                  const stepNumber = routeStepNumberByIndex.get(stepIndex) ?? stepIndex + 1;
                  const isCurrentStep = nextStepIndex === stepIndex && status !== "visited" && status !== "skipped";

                  return (
                    <li
                      className={`mission-plan-rail-stop route-step-${status}${isCurrentStep ? " is-current" : ""}`}
                      key={`${mission.id}-rail-${step.itemType}-${step.itemId}-${stepIndex}`}
                    >
                      <span className="mission-plan-rail-stop-number">{stepNumber}</span>
                      <div className="mission-plan-rail-stop-copy">
                        <div className="mission-plan-rail-stop-heading">
                          <strong>{target.label}</strong>
                          {isCurrentStep ? (
                            <span className="route-step-next-badge">Next</span>
                          ) : orderedIndex === 0 && nextStepIndex < 0 ? (
                            <StatusPill tone="blue">Done</StatusPill>
                          ) : (
                            <StatusPill tone={getStatusTone(status)}>{getStatusLabel(status)}</StatusPill>
                          )}
                        </div>
                        <small>
                          {[schedule?.rangeLabel ?? schedule?.startLabel, target.neighborhood]
                            .filter(Boolean)
                            .join(" • ")}
                        </small>
                        {isCurrentStep ? (
                          <div className="mission-plan-rail-stop-actions">
                            {mapsUrl ? (
                              <a className="route-action-chip" href={mapsUrl} rel="noreferrer" target="_blank">
                                <MapIcon />
                                <span>Maps</span>
                              </a>
                            ) : null}
                            <button
                              className="route-status-chip active"
                              type="button"
                              onClick={() => handleStepStatusChange(stepIndex, "visited")}
                            >
                              <CheckIcon />
                              <span>Done</span>
                            </button>
                            <button
                              className="route-status-chip"
                              type="button"
                              onClick={() => handleStepStatusChange(stepIndex, "skipped")}
                            >
                              <span>Skip</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mission-plan-rail-section mission-plan-rail-keep-section" id={routeActionsId}>
              <div className="mission-plan-rail-section-header">
                <p className="section-label">Keep it</p>
                <strong>Save or share the plan</strong>
              </div>
              <div className="mission-plan-rail-actions">
                <button className="button primary" type="button" onClick={handleSaveMission}>
                  Keep this plan
                </button>
                <button className="button secondary" type="button" onClick={handleNativeShare}>
                  Share <ShareIcon />
                </button>
                <button className="button tertiary route-reset-button" type="button" onClick={handleResetProgress}>
                  Start over <RefreshIcon />
                </button>
              </div>
              {shareFeedback ? <small className="local-success">{shareFeedback}</small> : null}
              {saveFeedback ? <small className="local-success">{saveFeedback}</small> : null}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="mission-execution-panel">
      <div className="mission-planner-shell">
        <div className="mission-planner-primary">
          <div className="mission-next-stop-focus">
            <article className="mission-next-stop-card">
              {nextStepVisual ? (
                <div className="mission-next-stop-visual">
                  <img
                    alt={nextStepVisual.alt}
                    decoding="async"
                    loading="lazy"
                    src={nextStepVisual.src}
                  />
                </div>
              ) : null}
              <div className="mission-next-stop-card-top">
                <div>
                  <p className="section-label">Next stop</p>
                  <h3>{nextStep ? simplifyMissionDisplayText(nextStep.label) : "Plan complete"}</h3>
                  <p>
                    {nextStep
                      ? simplifyNextStepNote(nextStep.note)
                      : "You have already marked every stop. Keep the version of this plan you would actually repeat or share again."}
                  </p>
                </div>
                <StatusPill tone={nextStep ? "green" : "blue"}>
                  {nextStep ? `${nextStepNumber} of ${routeStepIndices.length}` : "Complete"}
                </StatusPill>
              </div>

              <div className="mission-next-stop-actions">
                {nextStepMapsUrl ? (
                  <a className="button primary" href={nextStepMapsUrl} rel="noreferrer" target="_blank">
                    Open next stop in Maps <MapIcon />
                  </a>
                ) : directionsUrl ? (
                  <a className="button primary" href={directionsUrl} rel="noreferrer" target="_blank">
                    Open the whole plan in Maps <ExternalLinkIcon />
                  </a>
                ) : null}
              </div>

              <div className="mission-next-stop-fact-strip" aria-label={`${mission.title} next stop facts`}>
                <span>{nextStepSchedule?.startLabel ?? nextStepSchedule?.rangeLabel ?? selectedStartTime ?? mission.startWindow}</span>
                <span>{nextStepTarget?.neighborhood ?? `${getMissionCityName(mission)} plan`}</span>
                <span>{nextStepTravelFact ?? getMissionTravelSummary(mission, plan.travelMode)}</span>
              </div>

              <div className="mission-next-stop-secondary-actions">
                {nextStep ? (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => handleStepStatusChange(nextStepIndex, "visited")}
                  >
                    Mark done <CheckIcon />
                  </button>
                ) : null}
                {nextStep ? (
                  <button
                    className="button tertiary"
                    type="button"
                    onClick={() => handleStepStatusChange(nextStepIndex, "skipped")}
                  >
                    Skip this stop
                  </button>
                ) : null}
              </div>

              <p className="mission-next-stop-support-note">
                {nextStep
                  ? routeStopsLeftAfterNext > 0
                    ? `${routeStopsLeftAfterNext} more stop${routeStopsLeftAfterNext === 1 ? " comes" : "s come"} after this.`
                    : "This is the last stop in the plan."
                  : "You already worked through every real stop in the route."}
              </p>
            </article>
          </div>

          <details className="disclosure-card mission-adjustment-card">
            <summary className="disclosure-summary">
              <div>
                <p className="section-label">Plan details</p>
                <strong>See the whole route and timing</strong>
              </div>
              <span className="disclosure-tag">Optional</span>
            </summary>
            <div className="disclosure-body">
              <div className="mission-route-overview-card">
                <div className="mission-route-overview-copy">
                  <p className="section-label">Whole plan</p>
                  <h3>{routeHeadline}</h3>
                  <p>
                    {selectedStartTime && routeEndTime
                      ? `Start around ${selectedStartTime} and finish around ${routeEndTime} if you keep the same pace.`
                      : savedCount > 0
                        ? `${savedCount} stop${savedCount === 1 ? "" : "s"} from this route are already saved on this device.`
                        : "Choose the easiest pace first, then keep only the stops that still feel worth repeating."}
                  </p>
                </div>

                <div className="mission-route-overview-facts" aria-label={`${mission.title} plan facts`}>
                  <div className="mission-route-overview-fact">
                    <ClockIcon />
                    <div>
                      <strong>{formatMinutes(routeTotalMinutes)}</strong>
                      <span>Total plan time</span>
                    </div>
                  </div>
                  <div className="mission-route-overview-fact">
                    <CalendarIcon />
                    <div>
                      <strong>{selectedStartTime ?? mission.startWindow}</strong>
                      <span>{selectedStartTime ? "Suggested start" : "Start window"}</span>
                    </div>
                  </div>
                  <div className="mission-route-overview-fact">
                    <SparkIcon />
                    <div>
                      <strong>{routeEndTime ?? nextStepSummary}</strong>
                      <span>{routeEndTime ? "Finish around" : "Plan pacing"}</span>
                    </div>
                  </div>
                </div>

                <div className="mission-route-overview-inline">
                  <div className="mission-chip-cloud">
                    {mission.idealFor.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <p className="mission-route-overview-note">
                    {supportGuidePath ? (
                      <>
                        Want the background first?{" "}
                        <AppLink className="mission-inline-link" to={supportGuidePath}>
                          Read the route guide
                        </AppLink>{" "}
                        before you head out.
                      </>
                    ) : routePendingCount > 0
                      ? `${routePendingCount} stop${routePendingCount === 1 ? "" : "s"} are still open. Open the next one only when you are ready.`
                      : "You have already worked through every stop in this plan."}
                  </p>
                </div>
              </div>

              <div className="mission-travel-mode-row">
                <div>
                  <p className="section-label">Pace</p>
                  <strong>{getTravelModeLabel(plan.travelMode)} pace</strong>
                  <p>{getMissionTravelSummary(mission, plan.travelMode)}. Change the pace and CityAtlas updates the plan timing.</p>
                </div>
                <div className="travel-mode-segment" role="tablist" aria-label={`${mission.title} travel mode`}>
                  {travelModes.map((mode) => (
                    <button
                      className={plan.travelMode === mode ? "travel-mode-chip active" : "travel-mode-chip"}
                      type="button"
                      onClick={() => onSetMissionTravelMode(mission, mode)}
                      key={mode}
                    >
                      <TravelModeIcon mode={mode} />
                      <span>{getTravelModeLabel(mode)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {startOptions.length > 0 ? (
                <div className="mission-start-time-row">
                  <div>
                    <p className="section-label">Start time</p>
                    <strong>{selectedStartTime ?? mission.startWindow}</strong>
                    <p>Pick the start that feels easiest and the stop timing updates around it.</p>
                  </div>
                  <div className="mission-start-time-options" role="list" aria-label={`${mission.title} start time options`}>
                    {startOptions.map((option) => (
                      <button
                        className={selectedStartTime === option ? "route-status-chip active" : "route-status-chip"}
                        type="button"
                        onClick={() => onSetMissionStartTime(mission, option)}
                        key={option}
                      >
                        <CalendarIcon />
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </details>
        </div>
        <details className="disclosure-card mission-route-disclosure-shell">
          <summary className="disclosure-summary">
            <div>
              <p className="section-label">{nextStep ? "After this stop" : "Plan tools"}</p>
              <strong>{routeDisclosureTitle}</strong>
              <small className="mission-route-disclosure-note">{routeDisclosureNote}</small>
            </div>
            <span className="disclosure-tag">Optional</span>
          </summary>
          <div className="disclosure-body mission-route-disclosure-body">
            <div className="mission-route-disclosure-grid">
              <div className="mission-planner-map" id={routeMapId}>
                <div className="mission-map-surface">
                  {showMapFrame ? (
                    <>
                      <div className="mission-map-preview-toolbar">
                        <div>
                          <p className="section-label">Map preview</p>
                          <strong>Full route map</strong>
                          <small>The step list on this page should stay easier to follow than the map.</small>
                        </div>
                        <div className="mission-map-preview-actions">
                          {directionsUrl ? (
                            <a className="mission-map-link-button" href={directionsUrl} rel="noreferrer" target="_blank">
                              Open full map
                            </a>
                          ) : null}
                          <button className="mission-map-link-button" type="button" onClick={() => setShowInlineMap(false)}>
                            Hide preview
                          </button>
                        </div>
                      </div>
                      <iframe
                        className="mission-map-frame"
                        loading="lazy"
                        onError={() => setEmbedFailed(true)}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={embedUrl}
                        title={`${mission.title} Google Maps plan`}
                      />
                    </>
                  ) : (
                    <div className="mission-map-fallback">
                      <div className="mission-map-fallback-header">
                        <MapIcon />
                        <div>
                          <p className="section-label">Map</p>
                          <strong>{embedFailed ? "Map preview is unavailable right now" : "Map stays optional"}</strong>
                          <p>
                            {embedFailed
                              ? "The plan still works. Use the full map link below if you need it."
                              : laterMapStops.length > 0
                                ? laterMapStops.length === 1
                                  ? "1 more stop stays underneath after this one."
                                  : `${laterMapStops.length} more stops stay underneath after this one.`
                                : "Nothing else is still open after this stop."}
                          </p>
                        </div>
                      </div>
                      {laterMapStops.length > 0 ? (
                        <ol className="mission-map-stop-list">
                          {laterMapStops.map((stop) => (
                            <li key={`${mission.id}-later-${stop.stepNumber}`}>
                              <span>{stop.stepNumber}</span>
                              <div>
                                <strong>{stop.label}</strong>
                                <small>{stop.scheduleLabel} • {stop.neighborhood}</small>
                              </div>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="mission-map-empty-state">This stop can stay on its own. Open the map only if you want the full route picture.</p>
                      )}
                      <div className="mission-map-link-row">
                        {directionsUrl ? (
                          <a className="mission-map-link-button" href={directionsUrl} rel="noreferrer" target="_blank">
                            See the whole route on a map
                          </a>
                        ) : null}
                        {canPreviewInlineMap ? (
                          <button className="mission-map-link-button" type="button" onClick={() => setShowInlineMap(true)}>
                            Preview the map here
                          </button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mission-planner-timeline" id={routeTimelineId}>
                <div className="mission-planner-timeline-header">
                  <div>
                    <p className="section-label">Rest of the route</p>
                    <h3>Open the next stop only when you need it</h3>
                    <p>
                      {nextStepTarget
                        ? `Finish ${nextStepTarget.label} first, then come back for the rest.`
                        : "Work down the list, mark what you visited, and skip what did not fit."}
                    </p>
                  </div>
                </div>

                <ol className="route-timeline route-timeline-detailed route-timeline-rail route-timeline-deck">
                  {orderedStepIndices.map((stepIndex, orderedIndex) => {
                    const step = mission.steps[stepIndex];
                    const target = resolveMissionStepTarget(data, step, mission);
                    const status = getMissionStepUiStatus(mission, plan, stepIndex, data.savedItems);
                    const mapsUrl = buildStepMapsUrl(target.mapQuery);
                    const travelLabel = getMissionStepTravelLabel(step, plan.travelMode);
                    const schedule = routeScheduleByIndex[stepIndex] as { rangeLabel?: string } | undefined;
                    const isExpanded = expandedStepIndices.includes(stepIndex);
                    const isPeekCard = !isExpanded && orderedIndex > 0 && orderedIndex <= 2;
                    const isCompressedCard = !isExpanded && orderedIndex !== 0;
                    const showNextBadge = nextStepIndex === stepIndex && status !== "visited" && status !== "skipped";
                    const showStatusPill = !showNextBadge || status === "saved";
                    const stepNumber = routeStepNumberByIndex.get(stepIndex) ?? stepIndex + 1;
                    return (
                      <li
                        className={`route-step-${status}${nextStepIndex === stepIndex && status !== "visited" && status !== "skipped" ? " route-step-next" : ""}${isExpanded ? " route-step-expanded" : ""}${isPeekCard ? " route-step-peek" : ""}${isCompressedCard ? " route-step-compressed" : ""}`}
                        key={`${mission.id}-${step.itemType}-${step.itemId}-${stepIndex}`}
                        style={{ zIndex: mission.steps.length - orderedIndex }}
                      >
                        <span>{stepNumber}</span>
                        <details
                          className="route-step-detail"
                          open={isExpanded}
                          onToggle={(event) => handleStepDisclosureToggle(stepIndex, event.currentTarget.open)}
                        >
                          <summary className="route-step-summary">
                            <div className="route-step-summary-copy">
                              <div className="route-step-heading">
                                <strong>{target.label}</strong>
                                <div className="route-step-badges">
                                  {showNextBadge ? (
                                    <span className="route-step-next-badge">Next up</span>
                                  ) : null}
                                  {showStatusPill ? (
                                    <StatusPill tone={getStatusTone(status)}>{getStatusLabel(status)}</StatusPill>
                                  ) : null}
                                </div>
                              </div>
                              <div className="route-step-meta">
                                <small>{target.neighborhood}</small>
                                {schedule?.rangeLabel ? <small>{schedule.rangeLabel}</small> : null}
                                {travelLabel ? <small>{travelLabel}</small> : null}
                              </div>
                            </div>
                            <span className="route-step-disclosure-tag" aria-hidden="true">
                              {isExpanded ? "Hide" : "Open"} <ChevronDownIcon />
                            </span>
                          </summary>
                          <div className="route-step-body">
                            <p>{simplifyMissionDisplayText(step.note)}</p>
                            <div className="route-step-actions">
                              {mapsUrl ? (
                                <a className="route-action-chip" href={mapsUrl} rel="noreferrer" target="_blank">
                                  <MapIcon />
                                  <span>{step.openInMapsLabel ?? "Maps"}</span>
                                </a>
                              ) : null}
                              {target.secondaryLink ? (
                                <a className="route-action-chip" href={target.secondaryLink} rel="noreferrer" target="_blank">
                                  <ExternalLinkIcon />
                                  <span>Official site</span>
                                </a>
                              ) : null}
                              <button
                                className={status === "visited" ? "route-status-chip active" : "route-status-chip"}
                                type="button"
                                onClick={() => handleStepStatusChange(stepIndex, "visited")}
                              >
                                <CheckIcon />
                                <span>Done</span>
                              </button>
                              <button
                                className={status === "skipped" ? "route-status-chip active muted" : "route-status-chip"}
                                type="button"
                                onClick={() => handleStepStatusChange(stepIndex, "skipped")}
                              >
                                <span>Skip</span>
                              </button>
                            </div>
                          </div>
                        </details>
                      </li>
                    );
                  })}
                </ol>

                <details className="disclosure-card mission-optional-panel">
                  <summary className="disclosure-summary">
                    <div>
                      <p className="section-label">Optional tools</p>
                      <strong>Save, share, or restart</strong>
                    </div>
                    <span className="disclosure-tag">Optional</span>
                  </summary>
                  <div className="disclosure-body">
                    <div className="mission-rail-actions" id={routeActionsId}>
                      <button className="button primary" type="button" onClick={handleSaveMission}>
                        Keep this full plan
                      </button>
                      <button className="button secondary" type="button" onClick={handleCopyShare}>
                        Copy this plan <CopyIcon />
                      </button>
                      <button className="button secondary" type="button" onClick={handleNativeShare}>
                        Share this plan <ShareIcon />
                      </button>
                      <button className="button tertiary route-reset-button" type="button" onClick={handleResetProgress}>
                        Start over <RefreshIcon />
                      </button>
                    </div>
                    {shareFeedback ? <small className="local-success">{shareFeedback}</small> : null}
                    {saveFeedback ? <small className="local-success">{saveFeedback}</small> : null}
                    <div className="mission-share-preview-block">
                      <p className="section-label">Text version</p>
                      <pre className="route-share-preview route-share-preview-compact">{shareText}</pre>
                    </div>
                  </div>
                </details>

                <details className="disclosure-card mission-optional-panel">
                  <summary className="disclosure-summary">
                    <div>
                      <p className="section-label">Optional feedback</p>
                      <strong>How did this route feel?</strong>
                    </div>
                    <span className="disclosure-tag">Optional</span>
                  </summary>
                  <div className="disclosure-body">
                    <div className="mission-feedback-panel">
                      <p className="section-label">How did this plan feel?</p>
                      <div className="mission-feedback-actions">
                        {(["would_do_again", "too_long", "wrong_pace", "share_ready"] as MissionFeedbackType[]).map((feedbackType) => (
                          <button
                            className={
                              latestFeedback === feedbackType
                                ? feedbackType === "too_long" || feedbackType === "wrong_pace"
                                  ? "route-status-chip active muted"
                                  : "route-status-chip active"
                                : "route-status-chip"
                            }
                            type="button"
                            onClick={() => handleFeedback(feedbackType)}
                            key={feedbackType}
                          >
                            <span>{getMissionFeedbackLabel(feedbackType)}</span>
                          </button>
                        ))}
                      </div>
                      <small>
                        {feedbackNote
                          || "This stays on this device for now and helps shape the next recommendation."}
                      </small>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
