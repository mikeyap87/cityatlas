import type { Business, CityAtlasData, EventItem, Guide } from "../../types";
import { AppLink } from "../../components/Link";
import { BusinessCard, EventCard, GuideCard } from "../../components/Cards";
import { ArrowRightIcon, MapIcon, ShieldIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import {
  getGuideHeroVisual,
  getSourceBackedPlaceVisual,
  hasSpecificSourceBackedPlaceVisual,
} from "../../lib/visuals";
import { simplifyGuideCategoryLabel, simplifyGuideDisplayText } from "../../lib/publicCopy";
import {
  getGuideHubPath,
  getGuidePath,
} from "../../lib/cityPaths";
import {
  getSourceBackedCollectionForGuide,
  getSourceBackedPlaces,
  sourceBackedCollectionMeta,
} from "../../lib/sourceBackedCollections";

interface GuideDetailPageProps {
  guide?: Guide;
  data: CityAtlasData;
  guideHubPath?: string;
}

const guideGateMeta = {
  draft_only: {
    label: "City guide",
    tone: "ink",
    trustCopy:
      "Use this page to choose the right area or plan shape first. Check exact hours, prices, and availability on the official or business page.",
  },
  needs_real_sources: {
    label: "Good starting point",
    tone: "amber",
    trustCopy:
      "This guide helps with the first decision. Use official or business pages for exact live details before you rely on them.",
  },
  ready_for_review: {
    label: "Checked guide",
    tone: "blue",
    trustCopy:
      "This guide stays useful by focusing on the planning decision first. Exact listings and live details still need direct confirmation.",
  },
} as const;

function simplifyReferenceText(value: string) {
  return value
    .replace(
      /The official ([^.]+?) gives CityAtlas a (?:direct )?public source for /gi,
      "The official $1 confirms ",
    )
    .replace(/ without pretending [^.]+?\./gi, ".")
    .replace(/ without pretending [^.]+?,$/gi, "")
    .replace(/ without pretending [^.]+$/gi, "")
    .replace(/official-source/gi, "official")
    .replace(/route role/gi, "why it fits")
    .replace(/\broute fit\b/gi, "best match")
    .replace(/\bplan fit\b/gi, "best match")
    .replace(/  +/g, " ")
    .trim();
}

function GuideSourceBackedReferenceCard({
  reference,
  variant = "full",
}: {
  reference: ReturnType<typeof getSourceBackedPlaces>[number];
  variant?: "full" | "compact";
}) {
  const referenceFacts = reference.verifiedFacts.slice(0, 2);
  const referenceTags = [
    reference.neighborhood,
    simplifyGuideDisplayText(reference.routeRole),
    ...reference.bestFor.slice(0, 1).map((item) => simplifyGuideDisplayText(item)),
  ];
  const hasSpecificVisual = hasSpecificSourceBackedPlaceVisual(reference);

  if (variant === "compact") {
    return (
      <article className="source-panel source-reference-card source-reference-card-compact">
        <div className={`source-reference-media${hasSpecificVisual ? "" : " source-reference-media-fallback"}`}>
          {hasSpecificVisual ? (
            <img src={getSourceBackedPlaceVisual(reference)} alt={`${reference.name} place photo`} loading="lazy" />
          ) : (
            <div className="source-reference-media-fallback-note" aria-hidden="true">
              <span><ShieldIcon /> Official site linked</span>
              <span><MapIcon /> Photo not added yet</span>
            </div>
          )}
          <div className="source-reference-media-copy">
            <span>{reference.neighborhood}</span>
            <strong>{reference.name}</strong>
            <p>{simplifyGuideDisplayText(reference.routeRole)}</p>
          </div>
        </div>
        <div className="source-reference-body">
          <div className="source-reference-header">
            <p className="section-label">{reference.category}</p>
            <StatusPill tone="green">Official link</StatusPill>
          </div>
          <p>{simplifyReferenceText(reference.summary)}</p>
          <div className="tag-cloud source-reference-tags">
            {referenceTags.slice(0, 2).map((item) => (
              <span key={`${reference.id}-${item}`}>{item}</span>
            ))}
          </div>
          {referenceFacts[0] ? (
            <p className="source-reference-why">
              <strong>Good to know:</strong> {referenceFacts[0]}
            </p>
          ) : null}
          <div className="source-reference-actions">
            <a
              className="button primary"
              href={reference.officialSourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              Official site
            </a>
            <AppLink className="text-link" to={reference.correctionPath}>
              Report issue <ArrowRightIcon />
            </AppLink>
          </div>
          <small className="source-reference-meta">
            Checked {reference.sourceCheckedAt} on {reference.sourceOwner}.
          </small>
        </div>
      </article>
    );
  }

  return (
    <article className="source-panel source-reference-card">
      <div className={`source-reference-media${hasSpecificVisual ? "" : " source-reference-media-fallback"}`}>
        {hasSpecificVisual ? (
          <img src={getSourceBackedPlaceVisual(reference)} alt={`${reference.name} place photo`} loading="lazy" />
        ) : (
          <div className="source-reference-media-fallback-note" aria-hidden="true">
            <span><ShieldIcon /> Official site linked</span>
            <span><MapIcon /> Photo not added yet</span>
          </div>
        )}
        <div className="source-reference-media-copy">
          <span>{reference.neighborhood}</span>
          <strong>{reference.name}</strong>
          <p>{simplifyGuideDisplayText(reference.routeRole)}</p>
        </div>
      </div>
      <div className="source-reference-body">
        <div className="source-reference-header">
          <p className="section-label">{reference.category}</p>
          <StatusPill tone="green">Official site linked</StatusPill>
        </div>
        <p>{simplifyReferenceText(reference.summary)}</p>
        <div className="tag-cloud source-reference-tags">
          {referenceTags.map((item) => (
            <span key={`${reference.id}-${item}`}>{item}</span>
          ))}
        </div>
        <p className="source-reference-why">
          <strong>Best when:</strong> {simplifyReferenceText(reference.whyItFits)}
        </p>
        <div className="source-reference-facts">
          {referenceFacts.map((fact) => (
            <span key={`${reference.id}-${fact}`}>{fact}</span>
          ))}
        </div>
        <div className="source-reference-actions">
          <a
            className="button primary"
            href={reference.officialSourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Official site
          </a>
          <AppLink className="text-link" to={reference.correctionPath}>
            Report issue <ArrowRightIcon />
          </AppLink>
        </div>
        <small className="source-reference-meta">
          Checked {reference.sourceCheckedAt} on {reference.sourceOwner}.
        </small>
      </div>
    </article>
  );
}

export function GuideDetailPage({ guide, data, guideHubPath }: GuideDetailPageProps) {
  if (!guide) {
    return (
      <section className="not-found">
        <h1>Guide not found</h1>
        <p>This guide does not have a matching page yet.</p>
        <div className="hero-actions">
          <AppLink className="button primary" to={guideHubPath ?? "/vancouver/guides"}>
            Back to guides
          </AppLink>
          <AppLink className="button secondary" to="/vancouver">
            Start with Vancouver
          </AppLink>
        </div>
      </section>
    );
  }

  const relatedBusinesses = guide.relatedBusinessIds
    .map((businessId) => data.businesses.find((business) => business.id === businessId))
    .filter((business): business is Business => Boolean(business));
  const relatedEvents = guide.relatedEventIds
    .map((eventId) => data.events.find((event) => event.id === eventId))
    .filter((event): event is EventItem => Boolean(event));
  const relatedGuides = data.guides
    .filter((candidate) => candidate.id !== guide.id)
    .filter(
      (candidate) =>
        (candidate.citySlug ?? "vancouver") === (guide.citySlug ?? "vancouver"),
    )
    .filter((candidate) =>
      candidate.cluster === guide.cluster ||
      candidate.category === guide.category ||
      candidate.neighborhood === guide.neighborhood ||
      candidate.internalLinkTarget === guide.internalLinkTarget,
    )
    .slice(0, 2);
  const sourceBackedCollection = getSourceBackedCollectionForGuide(guide);
  const sourceBackedGuidePlaces = sourceBackedCollection
    ? getSourceBackedPlaces(data, sourceBackedCollection).slice(0, 2)
    : [];
  const sourceBackedGuideMeta = sourceBackedCollection
    ? sourceBackedCollectionMeta[sourceBackedCollection]
    : null;
  const gateMeta = guideGateMeta[guide.gateDecision];
  const resolvedGuideHubPath = getGuideHubPath(guide);
  const guideVisual = getGuideHeroVisual(guide);
  const guideCityName = guide.cityName ?? "Vancouver";
  const guideTitle = simplifyGuideDisplayText(guide.title);
  const guideSummary = simplifyGuideDisplayText(guide.summary);
  const guideHeroQuestion = simplifyGuideDisplayText(guide.heroQuestion);
  const guidePromise = simplifyGuideDisplayText(guide.promise);
  const guideExcerpt = simplifyGuideDisplayText(guide.excerpt);
  const guideQueryClass = simplifyGuideDisplayText(guide.queryClass);
  const guideAudience = simplifyGuideDisplayText(guide.audience);
  const guideIntro = simplifyGuideDisplayText(guide.intro);
  const guideBody = simplifyGuideDisplayText(guide.body);
  const simplifiedSections = guide.sections.map((section) => ({
    ...section,
    heading: simplifyGuideDisplayText(section.heading),
    answer: simplifyGuideDisplayText(section.answer),
    bullets: section.bullets.map((bullet) => simplifyGuideDisplayText(bullet)),
  }));
  const simplifiedResourceLinks = (guide.resourceLinks ?? []).map((link) => ({
    ...link,
    title: simplifyGuideDisplayText(link.title),
    description: simplifyGuideDisplayText(link.description),
  }));
  const simplifiedFaqs = guide.faqs.map((faq) => ({
    ...faq,
    question: simplifyGuideDisplayText(faq.question),
    answer: simplifyGuideDisplayText(faq.answer),
  }));
  const guidePrimaryAction = sourceBackedGuideMeta
    ? {
        label: "Open official places",
        path: sourceBackedGuideMeta.path,
      }
    : {
        label: guide.ctaLabel,
        path: guide.ctaPath,
      };

  return (
    <>
      <section className="guide-hero guide-answer-first">
        <div className="guide-hero-copy">
          <p className="section-label">{simplifyGuideCategoryLabel(guide.category)}</p>
          <h1>{guideTitle}</h1>
          <p className="guide-summary">{guideSummary}</p>
          <div className="guide-meta-row">
            <StatusPill tone="blue">{guide.readMinutes} min read</StatusPill>
            <StatusPill tone={gateMeta.tone}>{gateMeta.label}</StatusPill>
            <span>Updated {guide.lastReviewed}</span>
          </div>
          <div className="guide-answer-card guide-answer-card-primary">
            <span className="query-card-kicker">Quick answer</span>
            <strong>{guideHeroQuestion}</strong>
            <p>{guidePromise}</p>
            <div className="guide-answer-actions">
              <AppLink className="button primary" to={guidePrimaryAction.path}>
                {guidePrimaryAction.label} <ArrowRightIcon />
              </AppLink>
              <AppLink className="text-link" to={resolvedGuideHubPath}>
                All guides <ArrowRightIcon />
              </AppLink>
            </div>
          </div>
        </div>

        <div className="guide-hero-side">
          <div className="guide-hero-media">
            <img
              src={guideVisual}
              alt={`${guideTitle} scene`}
              decoding="async"
              fetchPriority="high"
              loading="eager"
            />
            <div className="guide-hero-media-copy">
              <span>{guideCityName}</span>
              <strong>{guide.neighborhood}</strong>
              <p>{guideExcerpt}</p>
            </div>
          </div>

          <aside className="guide-sidebar-card">
            <div className="guide-sidebar-section">
              <span className="query-card-kicker">Best for</span>
              <div className="tag-cloud">
                {guide.bestFor.map((item) => (
                  <span key={item}>{simplifyGuideDisplayText(item)}</span>
                ))}
              </div>
            </div>
            <div className="guide-sidebar-mini-grid">
              <div className="guide-sidebar-mini-card">
                <span className="query-card-kicker">This page answers</span>
                <p>{guideQueryClass}</p>
              </div>
              <div className="guide-sidebar-mini-card">
                <span className="query-card-kicker">Who it helps most</span>
                <p>{guideAudience}</p>
              </div>
            </div>
            <div className="guide-sidebar-footer">
              <strong>Need the broader plan next?</strong>
              <AppLink className="text-link" to={guide.ctaPath}>
                {simplifyGuideDisplayText(guide.ctaLabel)} <ArrowRightIcon />
              </AppLink>
            </div>
          </aside>
        </div>
      </section>

      <section className="guide-layout">
        <article className="guide-article">
          <div className="guide-intro">
            <p>{guideIntro}</p>
            <p>{guideBody}</p>
          </div>

          {simplifiedSections.map((section, index) => (
            <details className="guide-section guide-section-toggle" key={section.heading} open={index === 0}>
              <summary className="guide-section-summary">
                <div className="guide-section-summary-copy">
                  <span className="query-card-kicker">Step {index + 1}</span>
                  <h2>{section.heading}</h2>
                  <p className="guide-section-answer">{section.answer}</p>
                </div>
                <span className="guide-section-toggle-chip" aria-hidden="true">
                  {index === 0 ? "Open" : "More"}
                </span>
              </summary>
              <div className="guide-section-body">
                <ul className="plain-list guide-bullet-list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </details>
          ))}

          {simplifiedResourceLinks.length ? (
            <section className="guide-section">
              <SectionHeader
                label="Related pages"
                title="Open the next helpful page"
                copy="Use these related links when the real question is not what Vancouver offers, but which guide or place matches the moment you are trying to plan."
              />
              <div className="guide-query-grid">
                {simplifiedResourceLinks.map((link) => (
                  <AppLink className="query-card query-card-link guide-routing-card" key={link.path} to={link.path}>
                    <strong>{link.title}</strong>
                    <p>{link.description}</p>
                    <span className="query-card-hint">Open page</span>
                  </AppLink>
                ))}
              </div>
            </section>
          ) : null}

          {sourceBackedGuidePlaces.length > 0 && sourceBackedGuideMeta ? (
            <section className="guide-section">
              <SectionHeader
                label="Local places"
                title="Local places to open next"
                copy="Open the matching local place when you want named places with official site links and a clear way to report a mistake."
              />
              <div className="card-grid two">
                {sourceBackedGuidePlaces.map((reference) => (
                  <GuideSourceBackedReferenceCard key={reference.id} reference={reference} variant="compact" />
                ))}
              </div>
            </section>
          ) : null}

          <section className="guide-section">
            <SectionHeader
              label="FAQ"
              title="Questions this guide answers clearly"
              copy="These answers focus on the planning decision first. Use official or business pages for live details."
            />
            <div className="faq-stack">
              {simplifiedFaqs.map((faq) => (
                <details className="faq-card faq-toggle" key={faq.question}>
                  <summary className="faq-summary">
                    <h3>{faq.question}</h3>
                    <span className="guide-section-toggle-chip" aria-hidden="true">
                      Open
                    </span>
                  </summary>
                  <p className="faq-answer">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <aside className="guide-rail">
          <article className="rail-card">
            <div className="rail-card-heading">
              <ShieldIcon />
              <strong>Use this for the first decision</strong>
            </div>
            <p>
              {gateMeta.trustCopy} This page is strongest when the real job is choosing the right
              area, guide, or next page with less guesswork.
            </p>
          </article>
          <article className="rail-card">
            <div className="rail-card-heading">
              <MapIcon />
              <strong>Open next</strong>
            </div>
            <div className="rail-links">
              <AppLink to={resolvedGuideHubPath}>All guides</AppLink>
              <AppLink to="/vancouver/missions">Saved plans</AppLink>
              <AppLink to="/planner">Planner</AppLink>
              <AppLink to="/for-businesses/pricing">For businesses</AppLink>
              {sourceBackedGuideMeta ? (
                <AppLink to={sourceBackedGuideMeta.path}>
                  {sourceBackedGuideMeta.shortLabel}
                </AppLink>
              ) : null}
              <AppLink to="/editorial-standards">Editorial standards</AppLink>
            </div>
          </article>
        </aside>
      </section>

      {relatedBusinesses.length > 0 && !sourceBackedGuideMeta ? (
        <section className="section-block">
          <SectionHeader
            label="Related places"
            title="Places to look at next"
            copy="These links take you from planning guidance into the broader CityAtlas place library."
          />
          <div className="card-grid two">
            {relatedBusinesses.map((business) => (
              <BusinessCard business={business} key={business.id} />
            ))}
          </div>
        </section>
      ) : null}

      {relatedGuides.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Related guides"
            title="Keep the planning path moving"
            copy="These links help readers move from one planning question into the next useful page."
          />
          <div className="guide-query-grid">
            {relatedGuides.map((relatedGuide) => (
              <AppLink
                className="query-card query-card-link guide-routing-card"
                key={relatedGuide.id}
                to={getGuidePath(relatedGuide)}
              >
                <span className="query-card-kicker">
                  {simplifyGuideCategoryLabel(relatedGuide.category)}
                </span>
                <strong>{simplifyGuideDisplayText(relatedGuide.title)}</strong>
                <p>{simplifyGuideDisplayText(relatedGuide.excerpt)}</p>
                <span className="query-card-hint">Read guide</span>
              </AppLink>
            ))}
          </div>
        </section>
      ) : null}

      {relatedEvents.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Related events"
            title="Event pages related to this guide"
            copy="Confirm live event details with the host or official source before relying on them."
          />
          <div className="card-grid two">
            {relatedEvents.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
