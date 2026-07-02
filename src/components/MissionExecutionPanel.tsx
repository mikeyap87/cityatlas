import { useMemo, useState } from "react";
import type {
  CityAtlasData,
  CityMission,
  MissionFeedbackType,
  MissionStepStatus,
  TravelMode,
} from "../types";
import {
  formatMinutes,
  getMissionFeedbackLabel,
  getMissionLatestFeedback,
  getMissionCompletedCount,
  getMissionDirectionsUrl,
  getMissionDonePercent,
  getMissionEmbedUrl,
  getMissionMappableStops,
  getMissionPendingCount,
  getMissionPlanState,
  getMissionSavedCount,
  getMissionSavedPercent,
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
import {
  BikeIcon,
  CarIcon,
  CheckIcon,
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
  onSetMissionStepStatus,
  onAddMissionFeedback,
  onResetMissionProgress,
  variant = "default",
}: MissionExecutionPanelProps) {
  const [shareFeedback, setShareFeedback] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");
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
  const savedCount = getMissionSavedCount(mission, data.savedItems);
  const savedPercent = getMissionSavedPercent(mission, data.savedItems);
  const doneCount = getMissionCompletedCount(mission, plan);
  const donePercent = getMissionDonePercent(mission, plan);
  const visitedCount = getMissionVisitedCount(mission, plan);
  const pendingCount = getMissionPendingCount(mission, plan);
  const latestFeedback = useMemo(
    () => getMissionLatestFeedback(data, mission.id),
    [data, mission.id],
  );

  async function handleCopyShare() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareFeedback("Route text copied.");
      } else {
        setShareFeedback("Route text is ready below.");
      }
      onTrack("mission_share_copied", {
        missionId: mission.id,
        travelMode: plan.travelMode,
      });
    } catch {
      setShareFeedback("Route text is ready below.");
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
      setShareFeedback("Share canceled. Route text is still ready below.");
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
      <div className="mission-utility-row">
        <div className="mission-utility-pill">
          <ClockIcon />
          <div>
            <strong>{formatMinutes(getMissionTotalMinutes(mission, plan.travelMode))}</strong>
            <span>Total route time</span>
          </div>
        </div>
        <div className="mission-utility-pill">
          <SparkIcon />
          <div>
            <strong>{mission.startWindow}</strong>
            <span>Best start</span>
          </div>
        </div>
        <div className="mission-utility-pill">
          <CheckIcon />
          <div>
            <strong>{visitedCount}/{mission.steps.length} visited</strong>
            <span>{pendingCount} still open</span>
          </div>
        </div>
        <div className="mission-utility-pill">
          <MapIcon />
          <div>
            <strong>{savedPercent}% saved</strong>
            <span>{donePercent}% completed or skipped</span>
          </div>
        </div>
      </div>

      <div className="mission-travel-mode-row">
        <div>
          <p className="section-label">Travel mode</p>
          <strong>{getTravelModeLabel(plan.travelMode)} pace</strong>
          <p>{getMissionTravelSummary(mission, plan.travelMode)}.</p>
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

      <div className="mission-map-layout">
        <div className="mission-map-surface">
          {embedUrl ? (
            <iframe
              className="mission-map-frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={embedUrl}
              title={`${mission.title} Google Maps route`}
            />
          ) : (
            <div className="mission-map-fallback">
              <div className="mission-map-fallback-header">
                <MapIcon />
                <div>
                  <strong>
                    {mappableStops.length >= 2
                      ? "Route preview opens in Google Maps"
                      : "Open the anchor stop in Google Maps"}
                  </strong>
                  <p>
                    {mappableStops.length >= 2
                      ? "Open the full route in Google Maps when you are ready to head out."
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
            </div>
          )}

          <div className="mission-map-actions">
            <button className="button primary" type="button" onClick={() => onSaveMission(mission)}>
              Save full plan
            </button>
            {directionsUrl ? (
              <a className="button secondary" href={directionsUrl} rel="noreferrer" target="_blank">
                Open in Google Maps <ExternalLinkIcon />
              </a>
            ) : null}
            <button className="button secondary" type="button" onClick={handleCopyShare}>
              Copy route text <CopyIcon />
            </button>
            <button className="button secondary" type="button" onClick={handleNativeShare}>
              Share route <ShareIcon />
            </button>
            <button className="button tertiary route-reset-button" type="button" onClick={() => onResetMissionProgress(mission)}>
              Reset progress <RefreshIcon />
            </button>
          </div>
          {shareFeedback ? <small className="local-success">{shareFeedback}</small> : null}
        </div>

        <div className="mission-route-brief">
          <div className="mission-route-brief-copy">
            <p className="section-label">Why this route works</p>
            <h3>{mission.routeSummary}</h3>
            <p>
              {savedCount > 0
                ? `${savedCount} stop${savedCount === 1 ? "" : "s"} are already saved on this device.`
                : "Save the full plan once the route feels right, then work it step by step."}
            </p>
          </div>
          <div className="mission-chip-cloud">
            {mission.idealFor.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="mission-brief-metrics">
            <StatusPill tone="blue">{savedPercent}% saved</StatusPill>
            <StatusPill tone="green">{visitedCount} visited</StatusPill>
            <StatusPill tone="amber">{doneCount - visitedCount} skipped</StatusPill>
          </div>
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
          <pre className="route-share-preview">{shareText}</pre>
        </div>
      </div>

      <ol className="route-timeline route-timeline-detailed">
        {mission.steps.map((step, index) => {
          const target = resolveMissionStepTarget(data, step);
          const status = getMissionStepUiStatus(mission, plan, index, data.savedItems);
          const mapsUrl = buildStepMapsUrl(target.mapQuery);
          const travelLabel = getMissionStepTravelLabel(step, plan.travelMode);
          return (
            <li
              className={`route-step-${status}`}
              key={`${mission.id}-${step.itemType}-${step.itemId}-${index}`}
            >
              <span>{index + 1}</span>
              <div>
                <div className="route-step-heading">
                  <strong>{target.label}</strong>
                  <StatusPill tone={getStatusTone(status)}>{getStatusLabel(status)}</StatusPill>
                </div>
                <div className="route-step-meta">
                  <small>{step.time} in {target.neighborhood}</small>
                  {step.bestAt ? <small>{step.bestAt}</small> : null}
                  {travelLabel ? <small>{travelLabel}</small> : null}
                </div>
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
                    onClick={() => onSetMissionStepStatus(mission, index, "visited")}
                  >
                    <CheckIcon />
                    <span>Visited</span>
                  </button>
                  <button
                    className={status === "skipped" ? "route-status-chip active muted" : "route-status-chip"}
                    type="button"
                    onClick={() => onSetMissionStepStatus(mission, index, "skipped")}
                  >
                    <span>Skip</span>
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
