import { businessReplyStatusSnapshot } from "../data/businessReplyStatus";
import { MetricCard, StatusPill } from "./UI";

interface BusinessReplyProofPanelProps {
  badgeLabel?: string;
  badgeTone?: "green" | "amber" | "blue" | "ink" | "muted";
  className?: string;
  intro?: string;
  title?: string;
  variant?: "compact" | "full";
}

export function BusinessReplyProofPanel({
  badgeLabel = "Real replies",
  badgeTone = "green",
  className,
  intro,
  title = "CityAtlas is already handling real business replies",
  variant = "full",
}: BusinessReplyProofPanelProps) {
  const panelClassName = [
    "source-panel",
    "business-reply-proof-panel",
    variant === "compact" ? "business-reply-proof-panel-compact" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={panelClassName}>
      <div className="card-topline">
        <strong>{title}</strong>
        <StatusPill tone={badgeTone}>{badgeLabel}</StatusPill>
      </div>

      <p className="business-reply-proof-copy">
        {intro ?? businessReplyStatusSnapshot.summary}
      </p>

      <div className="business-reply-proof-metrics">
        {businessReplyStatusSnapshot.metrics.map((metric) => (
          <MetricCard
            detail={metric.detail}
            key={metric.label}
            label={metric.label}
            value={String(metric.value)}
          />
        ))}
      </div>

      {variant === "full" ? (
        <div className="business-reply-proof-stack">
          <div className="business-proof-banner">
            <strong>Current next move</strong>
            <p>{businessReplyStatusSnapshot.nextStep}</p>
          </div>
          <div className="business-proof-banner">
            <strong>Current boundary</strong>
            <p>{businessReplyStatusSnapshot.boundary}</p>
          </div>
        </div>
      ) : (
        <div className="business-proof-banner">
          <strong>Current boundary</strong>
          <p>
            {businessReplyStatusSnapshot.nextStep} {businessReplyStatusSnapshot.boundary}
          </p>
        </div>
      )}

      <p className="business-reply-proof-footnote">
        Last recorded {businessReplyStatusSnapshot.lastUpdated} in the current CityAtlas
        business reply status doc.
      </p>
    </article>
  );
}
