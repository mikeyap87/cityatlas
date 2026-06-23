import { AppLink } from "../../components/Link";
import { MetricCard, SectionHeader, StatusPill } from "../../components/UI";
import { vancouverPublicBusinessCoverageSnapshot } from "../../data/publicBusinessCoverageSnapshot";

interface VancouverBusinessCoverageSectionProps {
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

function simplifyCoverageCopy(value: string) {
  return value
    .replace(/\bThis lane\b/gi, "This page")
    .replace(/\bthis lane\b/gi, "this page")
    .replace(/\bChoose this lane\b/gi, "Choose this page")
    .replace(/\bUse this lane\b/gi, "Use this page")
    .replace(/\bOpen this route\b/gi, "Open this page")
    .replace(/\bthe right CityAtlas route\b/gi, "the right CityAtlas guide")
    .replace(/\bCityAtlas route\b/gi, "CityAtlas guide")
    .replace(/slower-route/gi, "slower-day")
    .replace(/group-route/gi, "group-plan")
    .replace(/culture route/gi, "culture plan")
    .replace(/reset route/gi, "calmer reset")
    .replace(/lower-friction/gi, "easier")
    .replace(/\bUse This page\b/g, "Use this page")
    .replace(/\bChoose This page\b/g, "Choose this page")
    .replace(/\blane\b/gi, "page")
    .replace(/route to open first/gi, "guide to open first")
    .replace(/route pages/gi, "guide pages");
}

export function VancouverBusinessCoverageSection({
  variant = "home",
}: VancouverBusinessCoverageSectionProps) {
  const snapshot = vancouverPublicBusinessCoverageSnapshot;
  const isHome = variant === "home";
  const visibleLanes = isHome ? snapshot.lanes : snapshot.lanes.slice(0, 4);

  return (
    <section className="section-block">
      <SectionHeader
        label="Vancouver business coverage"
        title={
          isHome
            ? "CityAtlas already covers more of Vancouver than the first guides show"
            : "The public guides are only one part of Vancouver coverage"
        }
        copy={
          isHome
            ? `CityAtlas already tracks ${snapshot.totalBusinesses} Vancouver businesses across hospitality, culture, guest stays, events, wellness, and broader neighborhood business coverage. The public site starts with guides, but the wider local coverage is already there underneath.`
            : `CityAtlas already tracks ${snapshot.totalBusinesses} Vancouver businesses behind the public guides and local places. The public site still leads with the best page to open first, while the wider place and business coverage helps keep that advice grounded.`
        }
        action={<StatusPill tone="green">{snapshot.totalBusinesses} businesses already in the map</StatusPill>}
      />

      <div className="metrics-strip">
        <MetricCard
          label="Real places named"
          value={`${snapshot.sourceBackedAnchors}`}
          detail="Real Vancouver places already named on live local place lists"
        />
        <MetricCard
          label="Local place lists"
          value={`${snapshot.sourceBackedCollections}`}
          detail="Live local place lists already supporting discovery"
        />
        <MetricCard
          label="Vancouver guides"
          value={`${snapshot.guideCount}`}
          detail="Clear Vancouver guides already live"
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
            title="Start with the right guide, then the right place"
            copy="The first public job is still helping someone choose the right guide. The broader place and business map makes those pages feel more grounded while fuller local pages keep rolling out."
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
            label="Best starting pages"
            title="Open the page that matches the moment first"
            copy="Use the live guide pages below when the real decision is where to start in Vancouver, not which single place should carry the whole day."
          />
          <div className="tag-cloud">
            {snapshot.topNeighborhoods.length > 0 ? (
              snapshot.topNeighborhoods.map((neighborhood) => (
                <span key={neighborhood.label}>
                  {neighborhood.label} ({neighborhood.count})
                </span>
              ))
            ) : (
              <span>Coverage is still strongest when you start with a guide, not one venue.</span>
            )}
          </div>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/guides">
              Open Vancouver guides
            </AppLink>
            <AppLink
              className="button secondary"
              to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
            >
              Read the start-here guide
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/submit">
              Start a business request
            </AppLink>
          </div>
        </div>
      </div>

      <div className="guide-query-grid">
        {visibleLanes.map((lane) => (
          <AppLink className="query-card query-card-link" to={lane.path} key={lane.id}>
            <span className="query-card-kicker">{lane.count} businesses already mapped here</span>
            <strong>{lane.title}</strong>
            <p>{simplifyCoverageCopy(lane.description)}</p>
            <p>
              Mostly {formatTagList(lane.topCategories, "local places across Vancouver")}
              {lane.topNeighborhoods.length > 0
                ? `. Areas include ${formatTagList(lane.topNeighborhoods, "multiple Vancouver areas")}.`
                : "."}
            </p>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
