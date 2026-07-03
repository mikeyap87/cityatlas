import { useEffect, useMemo, useState } from "react";
import type {
  CityAtlasData,
  CityMission,
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
  getMissionCompletedCount,
  getMissionDirectionsUrl,
  getMissionEndTimeLabel,
  getMissionEmbedUrl,
  getMissionMappableStops,
  getMissionPendingCount,
  getMissionPlanState,
  getMissionSavedCount,
  getMissionSavedPercent,
  getMissionSchedule,
  getMissionSelectedStartTime,
  getMissionShareText,
  getMissionStepTravelLabel,
  getMissionStepUiStatus,
  getMissionTotalMinutes,
  getMissionTravelSummary,
  getMissionVisitedCount,
  getTravelModeLabel,
  resolveMissionStepTarget,
  travelModes,
} from "../lib/missions";
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
  const [feedbackNote, setFeedbackNote] = useState("");
  const [embedFailed, setEmbedFailed] = useState(false);
  const [showInlineMap, setShowInlineMap] = useState(false);
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
  const scheduleByIndex = useMemo(
    () => Object.fromEntries(scheduleEntries.map((entry) => [entry.stepIndex, entry])),
    [scheduleEntries],
  );
  const savedCount = getMissionSavedCount(mission, data.savedItems);
  const savedPercent = getMissionSavedPercent(mission, data.savedItems);
  const doneCount = getMissionCompletedCount(mission, plan);
  const visitedCount = getMissionVisitedCount(mission, plan);
  const pendingCount = getMissionPendingCount(mission, plan);
  const skippedCount = Math.max(doneCount - visitedCount, 0);
  const remainingCount = Math.max(mission.steps.length - doneCount, 0);
  const selectedStartTime = getMissionSelectedStartTime(mission, plan);
  const endTime = getMissionEndTimeLabel(mission, plan);
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
  const nextStepIndex = stepStatuses.findIndex((status) => status !== "visited" && status !== "skipped");
  const nextStep = nextStepIndex >= 0 ? mission.steps[nextStepIndex] : undefined;
  const nextStepTarget = nextStep ? resolveMissionStepTarget(data, nextStep, mission) : undefined;
  const nextStepMapsUrl = nextStepTarget ? buildStepMapsUrl(nextStepTarget.mapQuery) : undefined;
  const nextStepTravelLabel = nextStep ? getMissionStepTravelLabel(nextStep, plan.travelMode) : undefined;
  const nextStepSchedule = nextStepIndex >= 0
    ? scheduleByIndex[nextStepIndex] as { rangeLabel?: string } | undefined
    : undefined;
  const nextStepSummary = nextStepTarget
    ? [nextStepSchedule?.rangeLabel, `in ${nextStepTarget.neighborhood}`].filter(Boolean).join(" • ")
    : endTime
      ? `Finish around ${endTime} if you keep this pace.`
      : "Keep only the stops that still feel worth repeating.";
  const mapSummaryStops = mappableStops.slice(0, 3);
  const hiddenMapSummaryCount = Math.max(mappableStops.length - mapSummaryStops.length, 0);

  useEffect(() => {
    setEmbedFailed(false);
    setShowInlineMap(false);
  }, [embedUrl]);

  useEffect(() => {
    setExpandedStepIndices(nextStepIndex >= 0 ? [nextStepIndex] : []);
  }, [mission.id]);

  useEffect(() => {
    if (nextStepIndex < 0) return;
    setExpandedStepIndices((current) => (
      current.includes(nextStepIndex) ? current : [nextStepIndex, ...current]
    ));
  }, [nextStepIndex]);

  function handleStepDisclosureToggle(stepIndex: number, open: boolean) {
    setExpandedStepIndices((current) => (
      open
        ? current.includes(stepIndex)
          ? current
          : [...current, stepIndex]
        : current.filter((value) => value !== stepIndex)
    ));
  }

  function handleStepStatusChange(stepIndex: number, status: MissionStepStatus) {
    onSetMissionStepStatus(mission, stepIndex, status);
    setExpandedStepIndices((current) => current.filter((value) => value !== stepIndex));
  }

  function handleResetProgress() {
    setExpandedStepIndices([]);
    onResetMissionProgress(mission);
  }

  async function handleCopyShare() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareFeedback("Route summary copied.");
      } else {
        setShareFeedback("Route summary is ready below.");
      }
      onTrack("mission_share_copied", {
        missionId: mission.id,
        travelMode: plan.travelMode,
      });
    } catch {
      setShareFeedback("Route summary is ready below.");
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
      setShareFeedback("Route shared.");
      onTrack("mission_shared", {
        missionId: mission.id,
        travelMode: plan.travelMode,
      });
    } catch {
      setShareFeedback("Share canceled. Your route summary is still ready below.");
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

  return (
    <div className={`mission-execution-panel${variant === "planner" ? " planner" : ""}`}>
      <div className="mission-planner-shell">
        <div className="mission-planner-primary">
          <div className="mission-next-stop-focus">
            <article className="mission-next-stop-card">
              <div className="mission-next-stop-card-top">
                <div>
                  <p className="section-label">Next stop</p>
                  <h3>{nextStepTarget ? nextStepTarget.label : "Route complete"}</h3>
                  <p>
                    {nextStep
                      ? nextStep.note
                      : "You have already marked every stop. Keep the version of this route you would actually repeat or share again."}
                  </p>
                </div>
                <StatusPill tone={nextStep ? "green" : "blue"}>
                  {nextStep ? `${nextStepIndex + 1} of ${mission.steps.length}` : "Complete"}
                </StatusPill>
              </div>

              <div className="mission-next-stop-meta">
                <div className="mission-next-stop-meta-item">
                  <span>Timing</span>
                  <strong>{nextStepSchedule?.rangeLabel ?? endTime ?? "Set the pace"}</strong>
                  <small>{selectedStartTime ? `Starting around ${selectedStartTime}` : mission.startWindow}</small>
                </div>
                <div className="mission-next-stop-meta-item">
                  <span>Where</span>
                  <strong>{nextStepTarget?.neighborhood ?? `${getMissionCityName(mission)} route`}</strong>
                  <small>{nextStep ? `${remainingCount} stop${remainingCount === 1 ? "" : "s"} still open` : "All stops reviewed"}</small>
                </div>
                <div className="mission-next-stop-meta-item">
                  <span>Pace</span>
                  <strong>{getTravelModeLabel(plan.travelMode)}</strong>
                  <small>{nextStepTravelLabel ?? getMissionTravelSummary(mission, plan.travelMode)}</small>
                </div>
              </div>

              <div className="mission-next-stop-actions">
                {nextStepMapsUrl ? (
                  <a className="button primary" href={nextStepMapsUrl} rel="noreferrer" target="_blank">
                    Open next stop <MapIcon />
                  </a>
                ) : directionsUrl ? (
                  <a className="button primary" href={directionsUrl} rel="noreferrer" target="_blank">
                    Open route in Maps <ExternalLinkIcon />
                  </a>
                ) : null}
                {nextStep ? (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => handleStepStatusChange(nextStepIndex, "visited")}
                  >
                    Mark visited <CheckIcon />
                  </button>
                ) : null}
                {nextStep ? (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => handleStepStatusChange(nextStepIndex, "skipped")}
                  >
                    Skip this stop
                  </button>
                ) : null}
              </div>
            </article>

            <div className="mission-route-progress-strip">
              <div className="mission-route-progress-copy">
                <strong>
                  {nextStep
                    ? `Keep the whole route visible, but only solve one stop at a time.`
                    : "Every stop has been reviewed on this device."}
                </strong>
                <small>
                  {nextStep
                    ? `${visitedCount} visited, ${skippedCount} skipped, ${remainingCount} still open.`
                    : `${visitedCount} visited, ${skippedCount} skipped.`}
                </small>
              </div>
              <ol className="mission-route-progress-rail" aria-label={`${mission.title} route progress`}>
                {mission.steps.map((step, index) => {
                  const status = stepStatuses[index];
                  const progressLabel = nextStepIndex === index && status !== "visited" && status !== "skipped"
                    ? "Next up"
                    : getStatusLabel(status);
                  return (
                    <li
                      className={`mission-route-progress-stop progress-${status}${nextStepIndex === index && status !== "visited" && status !== "skipped" ? " is-next" : ""}`}
                      key={`${mission.id}-progress-${step.itemType}-${step.itemId}-${index}`}
                    >
                      <span>{index + 1}</span>
                      <div>
                        <strong>{simplifyMissionDisplayText(step.label)}</strong>
                        <small>{progressLabel}</small>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="mission-route-overview-card">
            <div className="mission-route-overview-copy">
              <p className="section-label">Whole route</p>
              <h3>{mission.routeSummary}</h3>
              <p>
                {selectedStartTime && endTime
                  ? `Start around ${selectedStartTime} and this route should wrap around ${endTime} if you keep the same pace.`
                  : savedCount > 0
                    ? `${savedCount} stop${savedCount === 1 ? "" : "s"} are already saved on this device.`
                    : "Choose the easiest pace, then keep only the stops that still feel worth repeating."}
              </p>
            </div>

            <div className="mission-route-overview-facts" aria-label={`${mission.title} route facts`}>
              <div className="mission-route-overview-fact">
                <ClockIcon />
                <div>
                  <strong>{formatMinutes(getMissionTotalMinutes(mission, plan.travelMode))}</strong>
                  <span>Total route time</span>
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
                  <strong>{endTime ?? nextStepSummary}</strong>
                  <span>{endTime ? "Finish around" : "Route pacing"}</span>
                </div>
              </div>
            </div>

            <div className="mission-route-overview-inline">
              <div className="mission-chip-cloud">
                {mission.idealFor.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="mission-brief-metrics">
                <StatusPill tone="blue">{savedPercent}% saved</StatusPill>
                <StatusPill tone="green">{visitedCount} visited</StatusPill>
                <StatusPill tone="amber">{skippedCount} skipped</StatusPill>
                <StatusPill tone="muted">{pendingCount} open</StatusPill>
              </div>
            </div>

            <div className="mission-planner-quick-actions" aria-label={`${mission.title} quick actions`}>
              {directionsUrl ? (
                <a
                  className="route-action-chip mission-planner-quick-action mission-planner-quick-action-primary"
                  href={directionsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MapIcon />
                  <span>Route map</span>
                </a>
              ) : (
                <a className="route-action-chip mission-planner-quick-action" href={`#${routeMapId}`}>
                  <MapIcon />
                  <span>Route map</span>
                </a>
              )}
              <a className="route-action-chip mission-planner-quick-action" href={`#${routeTimelineId}`}>
                <ClockIcon />
                <span>Timeline</span>
              </a>
              <a className="route-action-chip mission-planner-quick-action" href={`#${routeActionsId}`}>
                <ShareIcon />
                <span>Share route</span>
              </a>
            </div>
          </div>

          <div className="mission-travel-mode-row">
            <div>
              <p className="section-label">Travel mode</p>
              <strong>{getTravelModeLabel(plan.travelMode)} pace</strong>
              <p>{getMissionTravelSummary(mission, plan.travelMode)}. Change the pace and CityAtlas updates the route timing.</p>
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
                <p className="section-label">Suggested start</p>
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

        <div className="mission-planner-map" id={routeMapId}>
          <div className="mission-map-surface">
            {showMapFrame ? (
              <>
                <div className="mission-map-preview-toolbar">
                  <div>
                    <strong>Inline map preview</strong>
                    <small>Use this only when a quick on-page preview helps. Full Google Maps stays clearer for navigation.</small>
                  </div>
                  <button className="button secondary" type="button" onClick={() => setShowInlineMap(false)}>
                    Hide preview
                  </button>
                </div>
                <iframe
                  className="mission-map-frame"
                  loading="lazy"
                  onError={() => setEmbedFailed(true)}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={embedUrl}
                  title={`${mission.title} Google Maps route`}
                />
              </>
            ) : (
              <div className="mission-map-fallback">
                <div className="mission-map-fallback-header">
                  <MapIcon />
                  <div>
                    <strong>
                      {embedFailed
                        ? "Inline map preview is unavailable right now"
                        : mappableStops.length >= 2
                          ? "Open the route in Google Maps first"
                          : "Open the anchor stop in Google Maps"}
                    </strong>
                    <p>
                      {embedFailed
                        ? "The route still works. Use the full Google Maps handoff below, then keep the route timing and stop order here."
                        : mappableStops.length >= 2
                          ? "CityAtlas keeps the map preview optional so the route still feels clear even if the embed does not help."
                          : "Open this stop in Google Maps when you are ready to go."}
                    </p>
                  </div>
                </div>
                <ol className="mission-map-stop-list">
                  {mappableStops.map((stop) => (
                    <li key={`${mission.id}-${stop.stepIndex}`}>
                      <span>{stop.stepIndex + 1}</span>
                      <div>
                        <strong>{stop.label}</strong>
                        <small>{stop.step.neighborhood}</small>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mission-map-actions mission-map-actions-inline">
                  {directionsUrl ? (
                    <a className="button primary" href={directionsUrl} rel="noreferrer" target="_blank">
                      Open full route <ExternalLinkIcon />
                    </a>
                  ) : null}
                  {canPreviewInlineMap ? (
                    <button className="button secondary" type="button" onClick={() => setShowInlineMap(true)}>
                      Show inline map preview
                    </button>
                  ) : null}
                  {nextStepMapsUrl ? (
                    <a className="button secondary" href={nextStepMapsUrl} rel="noreferrer" target="_blank">
                      Next stop only <MapIcon />
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {mappableStops.length > 0 ? (
            <div className="mission-map-stop-summary">
              <div className="mission-map-stop-summary-header">
                <div>
                  <strong>Tonight's timing</strong>
                  <small>
                    {selectedStartTime && endTime
                      ? `${selectedStartTime} start, around ${endTime} finish`
                      : mission.startWindow}
                  </small>
                </div>
                {hiddenMapSummaryCount > 0 ? (
                  <span className="mission-map-stop-overflow">+{hiddenMapSummaryCount} more in timeline</span>
                ) : null}
              </div>
              <ol className="mission-map-stop-list-inline">
                {mapSummaryStops.map((stop) => {
                  const schedule = scheduleByIndex[stop.stepIndex] as
                    | { rangeLabel?: string; startMinutes?: number }
                    | undefined;
                  const scheduleLabel = schedule?.rangeLabel
                    ?? formatMissionClockLabel(schedule?.startMinutes)
                    ?? "Route stop";
                  return (
                    <li
                      className={nextStepIndex === stop.stepIndex ? "active" : undefined}
                      key={`${mission.id}-summary-${stop.stepIndex}`}
                    >
                      <strong>{stop.label}</strong>
                      <small>{scheduleLabel}</small>
                    </li>
                  );
                })}
              </ol>

              <div className="mission-map-actions">
                {directionsUrl ? (
                  <a className="button primary" href={directionsUrl} rel="noreferrer" target="_blank">
                    Open full route <ExternalLinkIcon />
                  </a>
                ) : null}
                {nextStepMapsUrl ? (
                  <a className="button secondary" href={nextStepMapsUrl} rel="noreferrer" target="_blank">
                    Next stop only <MapIcon />
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mission-planner-timeline" id={routeTimelineId}>
          <div className="mission-planner-timeline-header">
            <div>
              <p className="section-label">Stop timeline</p>
              <h3>Follow the route one stop at a time</h3>
              <p>
                {nextStepTarget
                  ? `Start with ${nextStepTarget.label}. The rest of the route stays below in order.`
                  : "Work down the list, mark what you visited, and skip what did not fit."}
              </p>
            </div>
          </div>

          <ol className="route-timeline route-timeline-detailed route-timeline-rail">
            {mission.steps.map((step, index) => {
              const target = resolveMissionStepTarget(data, step, mission);
              const status = getMissionStepUiStatus(mission, plan, index, data.savedItems);
              const mapsUrl = buildStepMapsUrl(target.mapQuery);
              const travelLabel = getMissionStepTravelLabel(step, plan.travelMode);
              const schedule = scheduleByIndex[index] as { rangeLabel?: string } | undefined;
              const isExpanded = expandedStepIndices.includes(index);
              return (
                <li
                  className={`route-step-${status}${nextStepIndex === index && status !== "visited" && status !== "skipped" ? " route-step-next" : ""}`}
                  key={`${mission.id}-${step.itemType}-${step.itemId}-${index}`}
                >
                  <span>{index + 1}</span>
                  <details
                    className="route-step-detail"
                    open={isExpanded}
                    onToggle={(event) => handleStepDisclosureToggle(index, event.currentTarget.open)}
                  >
                    <summary className="route-step-summary">
                      <div className="route-step-summary-copy">
                        <div className="route-step-heading">
                          <strong>{target.label}</strong>
                          <div className="route-step-badges">
                            {nextStepIndex === index && status !== "visited" && status !== "skipped" ? (
                              <span className="route-step-next-badge">Next up</span>
                            ) : null}
                            <StatusPill tone={getStatusTone(status)}>{getStatusLabel(status)}</StatusPill>
                          </div>
                        </div>
                        <div className="route-step-meta">
                          <small>{step.time} in {target.neighborhood}</small>
                          {schedule?.rangeLabel ? <small>{schedule.rangeLabel}</small> : null}
                          {step.bestAt ? <small>{step.bestAt}</small> : null}
                          {travelLabel ? <small>{travelLabel}</small> : null}
                        </div>
                      </div>
                      <span className="route-step-disclosure-tag" aria-hidden="true">
                        {isExpanded ? "Hide" : "Details"} <ChevronDownIcon />
                      </span>
                    </summary>
                    <div className="route-step-body">
                      <p>{step.note}</p>
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
                          onClick={() => handleStepStatusChange(index, "visited")}
                        >
                          <CheckIcon />
                          <span>Visited</span>
                        </button>
                        <button
                          className={status === "skipped" ? "route-status-chip active muted" : "route-status-chip"}
                          type="button"
                          onClick={() => handleStepStatusChange(index, "skipped")}
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

          <div className="mission-rail-actions" id={routeActionsId}>
            <button className="button primary" type="button" onClick={() => onSaveMission(mission)}>
              Save full plan
            </button>
            <button className="button secondary" type="button" onClick={handleCopyShare}>
              Copy route summary <CopyIcon />
            </button>
            <button className="button secondary" type="button" onClick={handleNativeShare}>
              Share route <ShareIcon />
            </button>
            <button className="button tertiary route-reset-button" type="button" onClick={handleResetProgress}>
              Reset progress <RefreshIcon />
            </button>
          </div>
          {shareFeedback ? <small className="local-success">{shareFeedback}</small> : null}

          <div className="mission-feedback-panel">
            <p className="section-label">Tighten the next version</p>
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
                || "These route signals stay on this device for now and shape the next recommendation."}
            </small>
          </div>

          <details className="mission-share-preview-panel">
            <summary className="mission-inline-summary">
              <div>
                <p className="section-label">Message preview</p>
                <strong>See the full share text</strong>
              </div>
              <span className="mission-inline-summary-tag">Preview</span>
            </summary>
            <pre className="route-share-preview">{shareText}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}
