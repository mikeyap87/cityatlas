import { AppLink } from "../../components/Link";
import { MetricCard, SectionHeader, StatusPill } from "../../components/UI";
import { vancouverPublicBusinessCoverageSnapshot } from "../../data/publicBusinessCoverageSnapshot";
import { simplifyPublicSurfaceText } from "../../lib/publicCopy";

type VancouverBusinessCoverageSectionProps = {
  variant: "home" | "city";
};

const variantCopy = {
  home: {
    label: "Vancouver now",
    title: "See what CityAtlas already covers well in Vancouver",
    copy:
      "Start with the parts of CityAtlas that already give the clearest Vancouver starting points, instead of opening a broad page and guessing where to click next.",
    actionTone: "green" as const,
    actionLabel: "What is covered",
  },
  city: {
    label: "Where to start",
    title: "Choose the strongest Vancouver lane before you browse everything",
    copy:
      "These are the parts of CityAtlas that already give the clearest Vancouver place picks and guide support right now.",
    actionTone: "blue" as const,
    actionLabel: "Best covered",
  },
};

export function VancouverBusinessCoverageSection({
  variant,
}: VancouverBusinessCoverageSectionProps) {
  const copy = variantCopy[variant];
  const snapshot = vancouverPublicBusinessCoverageSnapshot;

  return (
    <section className="section-block">
      <SectionHeader
        label={copy.label}
        title={copy.title}
        copy={copy.copy}
        action={<StatusPill tone={copy.actionTone}>{copy.actionLabel}</StatusPill>}
      />

      <div className="card-grid three">
        <MetricCard
          label="Tracked businesses"
          value={snapshot.totalBusinesses.toLocaleString()}
          detail="Vancouver businesses already included across these public pages."
        />
        <MetricCard
          label="Places with official links"
          value={snapshot.sourceBackedAnchors.toLocaleString()}
          detail="Places that already link out to an official site and fit one of the main guide paths."
        />
        <MetricCard
          label="Public guides"
          value={snapshot.guideCount.toLocaleString()}
          detail="Guides that already help someone choose the right kind of Vancouver plan."
        />
      </div>

      <div className="guide-index-grid">
        {snapshot.lanes.map((lane) => (
          <AppLink className="guide-index-card" key={lane.id} to={lane.path}>
            <strong>{lane.title}</strong>
            <span>{simplifyPublicSurfaceText(lane.description)}</span>
            <span>
              {lane.count} businesses across {lane.topCategories[0]?.label ?? "multiple categories"}
            </span>
          </AppLink>
        ))}
      </div>

      <div className="tag-cloud place-page-tag-cloud">
        {snapshot.topCategories.slice(0, 4).map((category) => (
          <span key={category.label}>
            {category.label} {category.count}
          </span>
        ))}
        {snapshot.topNeighborhoods.slice(0, 3).map((neighborhood) => (
          <span key={neighborhood.label}>
            {neighborhood.label} {neighborhood.count}
          </span>
        ))}
      </div>
    </section>
  );
}
