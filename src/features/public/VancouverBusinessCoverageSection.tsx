import { AppLink } from "../../components/Link";
import { MetricCard, SectionHeader, StatusPill } from "../../components/UI";
import { buildPublicBusinessCoverageSnapshot } from "../../lib/publicBusinessCoverage";
import type { CityAtlasData } from "../../types";

interface VancouverBusinessCoverageSectionProps {
  data: CityAtlasData;
  variant?: "home" | "city";
}

function formatTagList(tags: { label: string }[], fallback: string) {
  if (tags.length === 0) {
    return fallback;
  }

  if (tags.length === 1) {
    return tags[0].label;
  }

  if (tags.length === 2) {
    return `${tags[0].label} and ${tags[1].label}`;
  }

  return `${tags[0].label}, ${tags[1].label}, and ${tags[2].label}`;
}

export function VancouverBusinessCoverageSection({
  data,
  variant = "home",
}: VancouverBusinessCoverageSectionProps) {
  const snapshot = buildPublicBusinessCoverageSnapshot(data);
  const isHome = variant === "home";

  return (
    <section className="section-block">
      <SectionHeader
        label="Vancouver business coverage"
        title={
          isHome
            ? "Vancouver coverage already reaches far beyond the first public pages"
            : "The live guides are only one layer of the current Vancouver coverage"
        }
        copy={
          isHome
            ? `CityAtlas already maps ${snapshot.totalBusinesses} Vancouver businesses across hospitality, culture, guest stays, events, wellness, and neighborhood planning. The public site still starts with guides, but the city layer underneath is already much broader.`
            : `CityAtlas already maps ${snapshot.totalBusinesses} Vancouver businesses behind the live guides and starting-point pages. The public site still leads with the best route to open first, while the wider city map keeps that advice more grounded.`
        }
        action={<StatusPill tone="green">{snapshot.totalBusinesses} businesses in the map</StatusPill>}
      />

      <div className="metrics-strip">
        <MetricCard
          label="Official source places"
          value={`${snapshot.sourceBackedAnchors}`}
          detail="Real Vancouver places already named on starting-point pages"
        />
        <MetricCard
          label="Starter groups"
          value={`${snapshot.sourceBackedCollections}`}
          detail="Official source groups already supporting discovery"
        />
        <MetricCard
          label="Guide pages"
          value={`${snapshot.guideCount}`}
          detail="Answer-first Vancouver guides already live in the library"
        />
        <MetricCard
          label="Categories covered"
          value={`${snapshot.categoryCount}`}
          detail="Business categories already mapped across Vancouver"
        />
      </div>

      <div className="split-section">
        <div className="source-panel">
          <SectionHeader
            label="What this means"
            title="Start with the right route, then the right place"
            copy="The first public job is still helping someone choose the right guide or route. Wider business coverage makes those pages feel more grounded without pretending every business already has a full public profile."
          />
          <div className="tag-cloud">
            {snapshot.topCategories.map((category) => (
              <span key={category.label}>
                {category.label} ({category.count})
              </span>
            ))}
          </div>
        </div>
        <div className="source-panel">
          <SectionHeader
            label="Best public next moves"
            title="Open the route that matches the moment first"
            copy="Use the live route pages below when the real decision is where to start in Vancouver, not which single venue should carry the whole day."
          />
          <div className="tag-cloud">
            {snapshot.topNeighborhoods.length > 0 ? (
              snapshot.topNeighborhoods.map((neighborhood) => (
                <span key={neighborhood.label}>
                  {neighborhood.label} ({neighborhood.count})
                </span>
              ))
            ) : (
              <span>Coverage is still strongest when you start with the route, not the venue.</span>
            )}
          </div>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/guides">
              Open guide library
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
            >
              Choose a route
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/submit">
              Start a business request
            </AppLink>
          </div>
        </div>
      </div>

      <div className="guide-query-grid">
        {snapshot.lanes.map((lane) => (
          <AppLink className="query-card query-card-link" to={lane.path} key={lane.id}>
            <span className="query-card-kicker">{lane.count} businesses in this lane</span>
            <strong>{lane.title}</strong>
            <p>{lane.description}</p>
            <p>
              Best-covered mix: {formatTagList(lane.topCategories, "Route-led Vancouver planning")}
              {lane.topNeighborhoods.length > 0
                ? `. Named areas include ${formatTagList(lane.topNeighborhoods, "multiple Vancouver areas")}.`
                : "."}
            </p>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
