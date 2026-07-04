import type { CityAtlasData } from "../../types";
import { GuideCard } from "../../components/Cards";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
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
      <section className="city-hero city-hero-secondary">
        <div>
          <p className="section-label">Starting points</p>
          <h1>{cityName} starting pages and guides</h1>
          <p>
            {`Use these pages when you want one clear ${cityName} starting area, official links, and a simple way to report outdated information.`}
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to={`/${citySlug}/guides`}>
              Open {cityName} guides
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/guides">
              Open Vancouver guides
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud secondary-city-hero-tags">
            <span>{collections.length} first pages</span>
            <span>{guides.length} focused guides</span>
            <span>Report outdated info</span>
          </div>
        </div>
        <div className="starter-hero-side">
          <div className="public-intro-card secondary-city-summary-card">
            <div className="public-intro-card-header">
              <div>
                <strong>Start with the clearest page</strong>
                <p>{`${cityName} starts with a smaller set of pages so each one can answer one planning question well.`}</p>
              </div>
              <StatusPill tone="blue">Starter set</StatusPill>
            </div>
            <ul className="public-note-list">
              <li><MapIcon /> Open one starting page first instead of scanning a broader city list.</li>
              <li><ShieldIcon /> Every page keeps official links and a visible way to report a mistake.</li>
              <li><SparkIcon /> The smaller city library stays narrow on purpose until coverage is stronger.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Open first"
          title={`${cityName} pages to open first`}
          copy={`Each page starts with one use case, a small set of official links, and a simple correction path so the ${cityName} library stays easy to trust.`}
        />
        <div className="guide-query-grid">
          {collections.map(({ id, meta, itemCount }) => (
            <AppLink className="query-card query-card-link" key={id} to={meta.path}>
              <strong>{meta.shortLabel}</strong>
              <p>{meta.pageDescription}</p>
              <small>{itemCount} places with official links</small>
            </AppLink>
          ))}
          <AppLink className="query-card query-card-link" to="/editorial-standards">
            <strong>Editorial standards</strong>
            <p>Review the source rules, correction process, and claim limits before using a smaller CityAtlas city page as planning input.</p>
          </AppLink>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Focused guides"
          title={`${cityName} guides that stay focused and useful`}
          copy={`These pages focus on where to start and what kind of day fits first, so the ${cityName} library stays useful while broader city coverage is still growing.`}
        />
        <div className="card-grid two">
          {guides.map((guide) => (
            <GuideCard data={data} guide={guide} key={guide.id} />
          ))}
        </div>
      </section>

      <section className="cta-band">
        <StatusPill tone="green">Official links included</StatusPill>
        <div>
          <h2>Need deeper Vancouver coverage too?</h2>
          <p>
            CityAtlas still has its deepest public guide set in Vancouver. Use the Toronto pages for first-visit and compact-weekend questions, then open Vancouver when you need broader neighborhood and weekend coverage.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/guides">
          Open Vancouver guides <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
