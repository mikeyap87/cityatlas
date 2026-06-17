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
          <p className="section-label">Next city</p>
          <h1>{cityName} starter pages and guides</h1>
          <p>
            {`CityAtlas starts smaller here. Use these pages when you want one clear ${cityName} starting area, official links, and a simple way to report outdated information instead of a generic listicle.`}
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to={`/${citySlug}/guides`}>
              Open {cityName} guides
            </AppLink>
            <AppLink className="button secondary" to="/vancouver/guides">
              Open Vancouver guides
            </AppLink>
          </div>
        </div>
        <div className="public-intro-card">
          <div className="public-intro-card-header">
            <div>
              <strong>Start with the clearest page</strong>
              <p>{`${cityName} stays intentionally small for now, so each page should answer one route question well.`}</p>
            </div>
            <StatusPill tone="blue">Starter library</StatusPill>
          </div>
          <div className="public-intro-card-grid">
            {collections.map(({ id, meta, itemCount }) => (
              <AppLink className="public-intro-link" key={id} to={meta.path}>
                <strong>{meta.shortLabel}</strong>
                <span>{itemCount} real places with official links.</span>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="guide-query-grid">
          {collections.map(({ id, meta, itemCount }) => (
            <AppLink className="query-card query-card-link" key={id} to={meta.path}>
              <strong>{meta.shortLabel}</strong>
              <p>{meta.pageDescription}</p>
              <small>{itemCount} real places with official links</small>
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
          label="Answer-first guides"
          title={`${cityName} route guidance that stays narrow and usable`}
          copy={`These pages focus on destination choice and route fit first so the ${cityName} library can stay useful without pretending CityAtlas already covers the whole city.`}
        />
        <div className="card-grid two">
          {guides.map((guide) => (
            <GuideCard guide={guide} key={guide.id} />
          ))}
        </div>
      </section>

      <section className="cta-band">
        <StatusPill tone="green">Official-source expansion</StatusPill>
        <div>
          <h2>Need the deeper Vancouver guide library too?</h2>
          <p>
            CityAtlas still has its deepest public route library in Vancouver. Use the Toronto guide for direct first-visit and compact-weekend questions, then open Vancouver when you need broader neighborhood and weekend coverage.
          </p>
        </div>
        <AppLink className="button primary" to="/vancouver/guides">
          Open Vancouver guides <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
