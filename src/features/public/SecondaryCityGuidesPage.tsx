import type { CityAtlasData } from "../../types";
import { GuideCard } from "../../components/Cards";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { getGuideCitySlug } from "../../lib/cityPaths";
import {
  getSourceBackedCollectionGuideHubPath,
  getSourceBackedPlaces,
  sourceBackedCollectionMeta,
  type SourceBackedCollectionId,
} from "../../lib/sourceBackedCollections";

interface SecondaryCityGuidesPageProps {
  citySlug: string;
  data: CityAtlasData;
}

function formatCityName(citySlug: string) {
  return citySlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SecondaryCityGuidesPage({
  citySlug,
  data,
}: SecondaryCityGuidesPageProps) {
  const guides = data.guides.filter((guide) => getGuideCitySlug(guide) === citySlug);
  const cityName = guides[0]?.cityName ?? formatCityName(citySlug);
  const collections = (Object.keys(sourceBackedCollectionMeta) as SourceBackedCollectionId[])
    .filter((collectionId) => getSourceBackedCollectionGuideHubPath(collectionId) === `/${citySlug}/guides`)
    .filter((collectionId) => getSourceBackedPlaces(data, collectionId).length > 0)
    .map((collectionId) => ({
      id: collectionId,
      meta: sourceBackedCollectionMeta[collectionId],
      itemCount: getSourceBackedPlaces(data, collectionId).length,
    }));

  return (
    <>
      <section className="city-hero">
        <div>
          <p className="section-label">City preview</p>
          <h1>{cityName} starter guides and source-backed route pages</h1>
          <p>
            {`This CityAtlas city preview stays narrow by design. Use these pages when you want one clear ${cityName} starting area, official-source anchor coverage, and a correction path instead of a generic listicle.`}
          </p>
        </div>
        <div className="source-panel">
          <StatusPill tone="blue">Narrow city preview</StatusPill>
          <p>
            {`${cityName} is the first reusable non-Vancouver CityAtlas preview. The public surface stays intentionally small until the city has stronger route depth and more official-source support.`}
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="guide-query-grid">
          {collections.map(({ id, meta, itemCount }) => (
            <AppLink className="query-card query-card-link" key={id} to={meta.path}>
              <strong>{meta.shortLabel}</strong>
              <p>{meta.pageDescription}</p>
              <small>{itemCount} official-source anchors</small>
            </AppLink>
          ))}
          <AppLink className="query-card query-card-link" to="/editorial-standards">
            <strong>Editorial standards</strong>
            <p>Review the public source rules, correction path, and claim boundaries before using a narrower CityAtlas city preview page as planning input.</p>
          </AppLink>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Answer-first guides"
          title={`${cityName} route guidance that stays narrow and usable`}
          copy={`These pages focus on destination choice and route fit first so the ${cityName} preview can stay useful without pretending CityAtlas already has full city authority.`}
        />
        <div className="card-grid two">
          {guides.map((guide) => (
            <GuideCard guide={guide} key={guide.id} />
          ))}
        </div>
      </section>

      <section className="cta-band">
        <StatusPill tone="green">Source-backed expansion</StatusPill>
        <div>
          <h2>Need the deeper Vancouver guide library too?</h2>
          <p>
            CityAtlas still has its deepest public route library in Vancouver. Use the Toronto preview for direct first-visit and compact-weekend route questions, then open the Vancouver guides when you need broader neighborhood and weekend coverage.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/guides">
          Open Vancouver guides <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
