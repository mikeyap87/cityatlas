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
            ? "The public guide layer already sits on top of a wider Vancouver business map"
            : "Vancouver business coverage is already wider than the current public business pages"
        }
        copy={
          isHome
            ? `CityAtlas now tracks ${snapshot.totalBusinesses} Vancouver businesses across hospitality, culture, guest-hosting, event, wellness, and neighborhood-discovery lanes. Public publishing stays route-first, but the business base behind it is already much wider than the current listing surface.`
            : `CityAtlas now tracks ${snapshot.totalBusinesses} Vancouver businesses behind the live route library. The public experience still leads with answer-first guides and source-backed starters, but the business coverage underneath is already broad enough to support a fuller Vancouver launch story.`
        }
        action={<StatusPill tone="green">{snapshot.totalBusinesses} businesses tracked</StatusPill>}
      />

      <div className="metrics-strip">
        <MetricCard
          label="Official-source anchors"
          value={`${snapshot.sourceBackedAnchors}`}
          detail="Real Vancouver anchors already named on public starter pages"
        />
        <MetricCard
          label="Live route clusters"
          value={`${snapshot.sourceBackedCollections}`}
          detail="Source-backed starter groups already supporting public discovery"
        />
        <MetricCard
          label="Guide pages"
          value={`${snapshot.guideCount}`}
          detail="Answer-first Vancouver guides already live in the library"
        />
        <MetricCard
          label="Categories covered"
          value={`${snapshot.categoryCount}`}
          detail="Business categories already mapped into the Vancouver coverage base"
        />
      </div>

      <div className="split-section">
        <div className="source-panel">
          <SectionHeader
            label="What this means"
            title="Guide-first now, fuller business publishing after review"
            copy="The strongest public CityAtlas pages are still the route and guide pages. This coverage layer makes those pages feel more grounded without pretending every business already has a verified public profile."
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
            title="Open the route that matches the situation first"
            copy="Use the live route pages below when the real decision is where to start in Vancouver, not which single venue should carry the whole plan."
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
              Request a business review
            </AppLink>
          </div>
        </div>
      </div>

      <div className="guide-query-grid">
        {snapshot.lanes.map((lane) => (
          <AppLink className="query-card query-card-link" to={lane.path} key={lane.id}>
            <span className="query-card-kicker">{lane.count} businesses tracked</span>
            <strong>{lane.title}</strong>
            <p>{lane.description}</p>
            <p>
              Strongest current mix: {formatTagList(lane.topCategories, "Route-led Vancouver planning")}
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
