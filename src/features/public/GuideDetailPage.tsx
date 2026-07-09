import { Fragment, useEffect, useState, type ReactNode } from "react";

import type { Business, CityAtlasData, EventItem, Guide } from "../../types";
import { AppLink } from "../../components/Link";
import { BusinessCard, EventCard } from "../../components/Cards";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  MapIcon,
  ShieldIcon,
  SparkIcon,
  StoreIcon,
  UsersIcon,
  WalkIcon,
} from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import {
  getGuideHeroVisual,
  getSourceBackedPlaceVisual,
  hasSpecificSourceBackedPlaceVisual,
} from "../../lib/visuals";
import {
  simplifyGuideCategoryLabel,
  simplifyGuideDisplayText,
  simplifyMissionDisplayText,
  simplifyPublicSurfaceText,
} from "../../lib/publicCopy";
import {
  formatMinutes,
  getMissionAnchorPath,
  getMissionForGuide,
  getMissionHubPathForCity,
  getMissionTotalMinutes,
  getMissionTravelSummary,
  isGuideRouteChooser,
} from "../../lib/missions";
import {
  getGuideCitySlug,
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

interface GuideRoutingChoice {
  actionLabel: string;
  copy: string;
  kicker: string;
  label: string;
  path: string;
  title: string;
}

interface GuideStarterPackPhotoChoice {
  actionLabel: string;
  copy: string;
  imagePath: string;
  kicker: string;
  path: string;
  title: string;
}

interface GuideStarterPackSupportLink {
  copy: string;
  label: string;
  path: string;
}

const guideGateMeta = {
  draft_only: {
    label: "City guide",
    tone: "ink",
    trustCopy:
      "Use this page to choose the right area or plan shape first. Check exact hours, prices, and availability on the official or business page.",
  },
  needs_real_sources: {
    label: "Helpful guide",
    tone: "amber",
    trustCopy:
      "This guide helps with the first decision. Use official or business pages for exact live details before you rely on them.",
  },
  ready_for_review: {
    label: "Planning guide",
    tone: "blue",
    trustCopy:
      "This guide stays useful by focusing on the planning decision first. Exact listings and live details still need direct confirmation.",
  },
} as const;

function simplifyReferenceText(value: string) {
  return simplifyPublicSurfaceText(
    value
      .replace(
        /The official ([^.]+?) gives CityAtlas a (?:direct )?public source for /gi,
        "The official $1 confirms ",
      )
      .replace(/ without pretending [^.]+?\./gi, ".")
      .replace(/ without pretending [^.]+?,$/gi, "")
      .replace(/ without pretending [^.]+$/gi, "")
      .replace(/  +/g, " ")
      .trim(),
  );
}

function buildGuideActionLabel(title: string) {
  const normalized = title.trim();
  if (!normalized) return "Open page";
  const simplified = simplifyGuideDisplayText(normalized);
  const label = simplified ? `${simplified[0].toUpperCase()}${simplified.slice(1)}` : simplified;
  if (/^(open|see|browse)\b/i.test(normalized)) return label;
  return `Open ${label}`;
}

function buildGuideRoutingChoiceAction(title: string) {
  return buildGuideActionLabel(title);
}

function GuideSourceBackedReferenceCard({
  reference,
  variant = "full",
}: {
  reference: ReturnType<typeof getSourceBackedPlaces>[number];
  variant?: "full" | "compact";
}) {
  const referenceFacts = reference.verifiedFacts.slice(0, 2).map((fact) => simplifyPublicSurfaceText(fact));
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
            <img
              src={getSourceBackedPlaceVisual(reference)}
              alt={`Illustrated view inspired by ${reference.name}`}
              loading="lazy"
            />
          ) : (
          <div className="source-reference-media-fallback-note" aria-hidden="true">
              <span><ShieldIcon /> Official site</span>
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
          <img
            src={getSourceBackedPlaceVisual(reference)}
            alt={`Illustrated view inspired by ${reference.name}`}
            loading="lazy"
          />
        ) : (
          <div className="source-reference-media-fallback-note" aria-hidden="true">
            <span><ShieldIcon /> Official site</span>
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
          <StatusPill tone="green">Official site</StatusPill>
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

function GuideOptionalSection({
  label,
  title,
  summary,
  children,
}: {
  label: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className="guide-section guide-section-toggle guide-support-toggle">
      <summary className="guide-section-summary">
        <div className="guide-section-summary-copy">
          <span className="query-card-kicker">{label}</span>
          <h2>{title}</h2>
          <p className="guide-section-answer">{summary}</p>
        </div>
        <span className="guide-section-toggle-chip" aria-hidden="true">
          More
        </span>
      </summary>
      <div className="guide-section-body">{children}</div>
    </details>
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
  const linkedMission = getMissionForGuide(data, guide);
  const routeChooser = isGuideRouteChooser(guide);
  const guideCitySlug = getGuideCitySlug(guide);
  const linkedMissionPath = linkedMission
    ? getMissionAnchorPath(linkedMission, guideCitySlug)
    : null;
  const guideMissionHubPath = getMissionHubPathForCity(guideCitySlug);
  const gateMeta = guideGateMeta[guide.gateDecision];
  const resolvedGuideHubPath = getGuideHubPath(guide);
  const guideVisual = getGuideHeroVisual(guide);
  const guideCityName = guide.cityName ?? "Vancouver";
  const normalizedGuideCategory = guide.category.trim().toLowerCase();
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
    title: buildGuideActionLabel(link.title).replace(/^Open\s+/i, ""),
    description: simplifyGuideDisplayText(link.description),
  }));
  const simplifiedFaqs = guide.faqs.map((faq) => ({
    ...faq,
    question: simplifyGuideDisplayText(faq.question),
    answer: simplifyGuideDisplayText(faq.answer),
  }));
  const guideMissionPreview = linkedMission
    ? {
        stopLabel: `${linkedMission.steps.length} ${linkedMission.steps.length === 1 ? "stop" : "stops"}`,
        totalMinutesLabel: formatMinutes(
          getMissionTotalMinutes(linkedMission, linkedMission.defaultTravelMode),
        ),
        travelSummary: getMissionTravelSummary(linkedMission, linkedMission.defaultTravelMode),
        startLabel: linkedMission.startOptions?.[0]
          ? `Suggested start ${linkedMission.startOptions[0]}`
          : null,
      }
    : null;
  const guideRouterMode = !linkedMission
    && !sourceBackedGuideMeta
    && simplifiedResourceLinks.length > 0
    && ["guide roundup", "route chooser"].includes(normalizedGuideCategory);
  const guideRouterCandidates = guideRouterMode
    ? simplifiedResourceLinks.filter(
        (link) => !/(starter-pack guide|guide roundup|guide library)/i.test(link.title),
      )
    : [];
  const guideRouterResources = guideRouterMode
    ? (guideRouterCandidates.length ? guideRouterCandidates : simplifiedResourceLinks)
    : [];
  const guideSuggestedResource = guideRouterResources[0] ?? null;
  const guideSecondaryResource = guideRouterResources[1] ?? null;
  const guideTertiaryResource = guideRouterResources[2] ?? null;
  const guideRouterPreview = guideRouterMode
    ? {
        title: guideSuggestedResource?.title ?? "Focused next options",
        copy: normalizedGuideCategory === "route chooser"
          ? "This page works best when it quickly narrows you into the kind of guide that fits today instead of sending you into a broad list first."
          : "This page works best when it points you to one focused page first, then leaves the wider guide set available underneath.",
        tags: [
          `${guideRouterResources.length} focused options`,
          ...guideRouterResources.slice(0, 3).map((link) => link.title),
        ],
      }
    : null;
  const guideMissionAction = linkedMission && linkedMissionPath
    ? {
        kicker: routeChooser ? "Example route with map" : "Ready-made route with map",
        title: simplifyMissionDisplayText(linkedMission.title),
        copy: routeChooser
          ? `Open one workable version of this guide with ${guideMissionPreview?.stopLabel ?? "a clear stop order"}, ${guideMissionPreview?.totalMinutesLabel ?? "timing"}, and Google Maps handoff.`
          : `Open the ready-made route with ${guideMissionPreview?.stopLabel ?? "a clear stop order"}, ${guideMissionPreview?.totalMinutesLabel ?? "timing"}, and Google Maps handoff for this guide.`,
        label: routeChooser ? "Open example route" : "Open route map",
        path: linkedMissionPath,
      }
    : null;
  const routeHeroFacts = guideMissionPreview
    ? [
        {
          label: "Stops",
          value: guideMissionPreview.stopLabel,
        },
        {
          label: "Timing",
          value: guideMissionPreview.totalMinutesLabel,
        },
      ].concat(
        guideMissionPreview.startLabel
          ? [
              {
                label: "Start",
                value: guideMissionPreview.startLabel.replace(/^Suggested start\s+/i, ""),
              },
            ]
          : [
              {
                label: "Pace",
                value: guideMissionPreview.travelSummary,
              },
            ],
      )
    : [];
  const routeHeroTimelineStops = linkedMission
    ? linkedMission.steps.slice(0, 3).map((step, index) => ({
        index: index + 1,
        label: simplifyMissionDisplayText(step.label),
        durationLabel: `${step.durationMinutes} min stop`,
      }))
    : [];
  const guideSavedPlansAction = linkedMissionPath
    ? {
        label: routeChooser ? "Open example route" : "Open route map",
        path: linkedMissionPath,
      }
    : {
        label: "Ready-made routes",
        path: guideMissionHubPath,
      };
  const guideRouterAction = guideSuggestedResource
    ? {
        kicker: "Best first click",
        title: guideSuggestedResource.title,
        copy: guideSuggestedResource.description,
        label: buildGuideActionLabel(guideSuggestedResource.title),
        path: guideSuggestedResource.path,
      }
    : null;
  const guidePlaceAction = sourceBackedGuideMeta
    ? {
        kicker: "Need named places now?",
        title: sourceBackedGuideMeta.shortLabel,
        copy: sourceBackedGuideMeta.pageDescription,
        label: "See local places",
        path: sourceBackedGuideMeta.path,
      }
    : null;
  const guideFallbackAction = {
    label: guide.ctaLabel,
    path: guide.ctaPath,
  };
  const guidePrimaryAction = guideMissionAction ?? guidePlaceAction ?? guideRouterAction ?? guideFallbackAction;
  const guideSecondaryAction = guideMissionAction
    ? (guidePlaceAction && guidePlaceAction.path !== guidePrimaryAction.path ? guidePlaceAction : null)
    : guidePlaceAction
      ? (guidePlaceAction.path !== guidePrimaryAction.path ? guidePlaceAction : null)
      : guideRouterAction
        ? (guideFallbackAction.path !== guidePrimaryAction.path
          ? {
              label: guide.ctaLabel,
              path: guide.ctaPath,
            }
          : null)
        : guideFallbackAction.path !== guidePrimaryAction.path
          ? {
              label: guide.ctaLabel,
              path: guide.ctaPath,
            }
          : null;
  const guideNextSurfaceAction = guideRouterMode && guideSecondaryResource
    ? {
        kicker: "Try a different starting page",
        title: guideSecondaryResource.title,
        copy: guideSecondaryResource.description,
        label: buildGuideActionLabel(guideSecondaryResource.title),
        path: guideSecondaryResource.path,
      }
    : !guideMissionAction && !guidePlaceAction
    ? {
        kicker: "Need the next working page?",
        title: simplifyGuideDisplayText(guide.ctaLabel),
        copy:
          "Use the next CityAtlas page when the page question is already clear and you want to save, compare, or move the plan forward.",
        label: simplifyGuideDisplayText(guide.ctaLabel),
        path: guide.ctaPath,
      }
    : null;
  const nextResourceLink = simplifiedResourceLinks.find(
    (link) =>
      link.path !== guidePrimaryAction.path &&
      link.path !== guideSecondaryAction?.path &&
      link.path !== guideMissionAction?.path &&
      link.path !== guideNextSurfaceAction?.path,
  );
  const guideAlternateAction = guideRouterMode && guideTertiaryResource
    ? {
        kicker: "Still not the right fit?",
        title: guideTertiaryResource.title,
        copy: guideTertiaryResource.description,
        label: buildGuideActionLabel(guideTertiaryResource.title),
        path: guideTertiaryResource.path,
      }
    : nextResourceLink
    ? {
        kicker: "Need a different planning question?",
        title: nextResourceLink.title,
        copy: nextResourceLink.description,
        label: "Open related page",
        path: nextResourceLink.path,
      }
    : relatedGuides[0]
      ? {
          kicker: "Need a different planning question?",
          title: simplifyGuideDisplayText(relatedGuides[0].title),
          copy: simplifyGuideDisplayText(relatedGuides[0].excerpt),
          label: "Open related guide",
          path: getGuidePath(relatedGuides[0]),
        }
      : {
          kicker: "Still not the right page?",
          title: `${guideCityName} guide hub`,
          copy: `Go back to the ${guideCityName} guide hub when you still need to choose the right kind of page before committing to this one.`,
          label: "See all guides",
          path: resolvedGuideHubPath,
        };
  const showRouteHeroCard = Boolean(guideMissionAction && guideMissionPreview);
  const guideTwoChoiceQuestion = "What do you want to do first?";
  const guideTwoChoiceSummary = guidePlaceAction
    ? `Open the ready plan when you want the stop order and timing handled. Browse local places when you want named Vancouver spots first.`
    : "Open the ready plan when you want the stop order and timing handled. Keep reading only when you want the guide explanation first.";
  const guidePinnedRoutePrimaryLabel = routeChooser ? "Open example route" : "Open route map";
  const guidePinnedRoutePrimaryPath = guideMissionAction?.path ?? guideSavedPlansAction.path;
  const guidePinnedRouteChecks = showRouteHeroCard
    ? [
        {
          copy: guidePromise,
          icon: SparkIcon,
          title: "Why this route works",
        },
        {
          copy: guideAudience,
          icon: UsersIcon,
          title: "Who this helps most",
        },
        guideMissionPreview
          ? {
              copy: `${guideMissionPreview.stopLabel} and about ${guideMissionPreview.totalMinutesLabel.toLowerCase()}.`,
              icon: ClockIcon,
              title: "How long it takes",
            }
          : null,
        {
          copy: guideMissionPreview?.travelSummary ?? "The stop order is already decided for you.",
          icon: WalkIcon,
          title: "How the route feels",
        },
        guidePlaceAction
          ? {
              copy: "Use local places first if you want checked Vancouver spots before the full route.",
              icon: StoreIcon,
              path: guidePlaceAction.path,
              title: "Want named places instead?",
            }
          : {
              copy: routeChooser
                ? "The green button opens the exact example plan on the right."
                : "The green button opens the saved plan on the right.",
              icon: CheckIcon,
              title: "Already ready to move?",
            },
      ].filter((item): item is {
        copy: string;
        icon: typeof SparkIcon;
        path?: string;
        title: string;
      } => Boolean(item))
    : [];
  const guideDecisionMeta = showRouteHeroCard
    ? {
        label: "Next move",
        title: "Choose the right next click before you read the whole guide",
        copy:
          "Open the saved plan when the stop order already fits. Otherwise switch to the better page before you carry extra reading weight.",
      }
    : {
        label: "Start faster",
        title: "Know whether this is the right page before you read the whole guide",
        copy:
          "These cards are here so readers can stay on the right surface instead of reading a long guide that solves the wrong planning problem.",
      };
  const guideChooserMode = Boolean(
    guideRouterMode
      && normalizedGuideCategory === "route chooser"
      && guideRouterAction
      && !showRouteHeroCard,
  );
  const guideStarterPackMode = Boolean(
    guideRouterMode
      && /starter-pack/i.test(guide.slug)
      && guideRouterAction
      && !showRouteHeroCard,
  );
  const guideRoundupMode = Boolean(
    guideRouterMode
      && normalizedGuideCategory === "guide roundup"
      && !guideStarterPackMode
      && guideRouterAction
      && !showRouteHeroCard,
  );
  const guideRoutingHubMode = guideChooserMode || guideStarterPackMode || guideRoundupMode;
  const findGuideRouterResource = (pattern: RegExp) =>
    guideRouterResources.find((link) => pattern.test(link.title));
  const findGuideRouterResourceByPath = (pattern: RegExp) =>
    guideRouterResources.find((link) => pattern.test(link.path));
  const buildGuideStarterPackSupportLink = (
    pattern: RegExp,
    label: string,
    copy: string,
  ): GuideStarterPackSupportLink | null => {
    const link = findGuideRouterResourceByPath(pattern);
    return link ? { copy, label, path: link.path } : null;
  };
  const guideChooserQuickLinks = guideChooserMode
    ? [
        (() => {
          const link = findGuideRouterResourceByPath(/rainy-day/i);
          return link
            ? {
                actionLabel: buildGuideRoutingChoiceAction(link.title),
                copy: link.description,
                kicker: "Best when weather and momentum both need help",
                label: "Rainy day",
                path: link.path,
                title: link.title,
              }
            : null;
        })(),
        (() => {
          const link = findGuideRouterResourceByPath(/wellness/i);
          return link
            ? {
                actionLabel: buildGuideRoutingChoiceAction(link.title),
                copy: link.description,
                kicker: "Best when the day should feel calmer",
                label: "Wellness",
                path: link.path,
                title: link.title,
              }
            : null;
        })(),
        (() => {
          const link = findGuideRouterResourceByPath(/sunday/i);
          return link
            ? {
                actionLabel: buildGuideRoutingChoiceAction(link.title),
                copy: link.description,
                kicker: "Best when one gentle main stop is enough",
                label: "Slow Sunday",
                path: link.path,
                title: link.title,
              }
            : null;
        })(),
        (() => {
          const link = findGuideRouterResourceByPath(/weekend-route/i);
          return link
            ? {
                actionLabel: buildGuideRoutingChoiceAction(link.title),
                copy: link.description,
                kicker: "Best when the day can still hold one stronger anchor",
                label: "Weekend",
                path: link.path,
                title: link.title,
              }
            : null;
        })(),
        (() => {
          const link = findGuideRouterResourceByPath(/first-evening|first-time-visitor/i);
          return link
            ? {
                actionLabel: buildGuideRoutingChoiceAction(link.title),
                copy: link.description,
                kicker: "Best when a new arrival needs an easy start",
                label: "Visitor start",
                path: link.path,
                title: link.title,
              }
            : null;
        })(),
      ].filter((link): link is GuideRoutingChoice => Boolean(link))
    : [];
  const guideStarterPackPhotoChoices = guideStarterPackMode
    ? [
        (() => {
          const link = findGuideRouterResourceByPath(/wellness-reset/i);
          return link
            ? {
                actionLabel: "Open calm start",
                copy:
                  "Open the gentler page when one peaceful Vancouver anchor is enough and you want fewer decisions right now.",
                imagePath: "/assets/places-generated/vancouver-wellness-reset-generated.png",
                kicker: "Need the softest landing?",
                path: link.path,
                title: "Calm reset day",
              }
            : null;
        })(),
        (() => {
          const link = findGuideRouterResourceByPath(/weekend-route/i);
          return link
            ? {
                actionLabel: "Open adventure start",
                copy:
                  "Open the bigger-route page when the day can hold one memorable shape and a little more Vancouver momentum.",
                imagePath: "/assets/places-generated/vancouver-weekend-route-generated.png",
                kicker: "Need more energy?",
                path: link.path,
                title: "Big adventure day",
              }
            : null;
        })(),
      ].filter((link): link is GuideStarterPackPhotoChoice => Boolean(link))
    : [];
  const guideStarterPackSupportLinks = guideStarterPackMode
    ? [
        buildGuideStarterPackSupportLink(
          /first-time-visitor/i,
          "I'm visiting",
          "Pick the part of Vancouver that should shape a first trip.",
        ),
        buildGuideStarterPackSupportLink(
          /out-of-town-guest/i,
          "I'm hosting someone",
          "Start with one easy city-introduction route for a guest.",
        ),
        buildGuideStarterPackSupportLink(
          /\/missions$/i,
          "I want a saved plan",
          "Open missions when the route mostly feels decided already.",
        ),
        {
          copy: "Browse the wider CityAtlas guide library instead.",
          label: "Show me everything",
          path: resolvedGuideHubPath,
        },
      ].filter((link): link is GuideStarterPackSupportLink => Boolean(link))
    : [];
  const guideRoundupQuickLinks = guideRoundupMode
    ? [
        guideRouterAction
          ? {
              actionLabel: buildGuideRoutingChoiceAction(guideRouterAction.title),
              kicker: "Need named places now?",
              copy:
                "Start with the checked-place layer when official links and correction paths matter before anything else.",
              label: "Named places",
              path: guideRouterAction.path,
              title: guideRouterAction.title,
            }
          : null,
        (() => {
          const link = findGuideRouterResourceByPath(/first-time-visitor|returning-visitor/i);
          return link
            ? {
                actionLabel: buildGuideRoutingChoiceAction(link.title),
                kicker: "Planning for visitors?",
                copy: link.description,
                label: "Visitors",
                path: link.path,
                title: link.title,
              }
            : null;
        })(),
        (() => {
          const link = findGuideRouterResourceByPath(/choose-between|gastown|mount-pleasant|kitsilano/i);
          return link
            ? {
                actionLabel: buildGuideRoutingChoiceAction(link.title),
                kicker: "Choosing an area?",
                copy: link.description,
                label: "Area",
                path: link.path,
                title: link.title,
              }
            : null;
        })(),
        (() => {
          const link = findGuideRouterResourceByPath(/weekend-route|wellness-reset|sunday/i);
          return link
            ? {
                actionLabel: buildGuideRoutingChoiceAction(link.title),
                kicker: "Keeping it easier?",
                copy: link.description,
                label: "Easy pace",
                path: link.path,
                title: link.title,
              }
            : null;
        })(),
      ].filter((link): link is GuideRoutingChoice => Boolean(link))
    : [];
  const guideRoutingChoices = guideChooserMode
    ? guideChooserQuickLinks
    : guideRoundupMode
        ? guideRoundupQuickLinks
        : [];
  const defaultGuideRoutingChoicePath = guideRoutingChoices[0]?.path ?? guidePrimaryAction.path;
  const [selectedGuideRoutingChoicePath, setSelectedGuideRoutingChoicePath] = useState(defaultGuideRoutingChoicePath);
  useEffect(() => {
    setSelectedGuideRoutingChoicePath(defaultGuideRoutingChoicePath);
  }, [defaultGuideRoutingChoicePath, guide.id]);
  const selectedGuideRoutingChoice = guideRoutingChoices.find(
    (choice) => choice.path === selectedGuideRoutingChoicePath,
  ) ?? guideRoutingChoices[0] ?? null;
  const guideHeroTitle = guideStarterPackMode
    ? `What kind of ${guideCityName} day is this?`
    : guideRoundupMode
      ? `Which ${guideCityName} guide should you open first?`
      : guideTitle;
  const guideHeroSummary = guideStarterPackMode
    ? `Pick the picture that feels closer. CityAtlas will open the right first page before the plan gets confusing.`
    : guideRoundupMode
      ? `Choose the right ${guideCityName} guide family first so you open one useful page instead of browsing the whole library cold.`
      : guideChooserMode
        ? `Pick the day type first so one ${guideCityName} plan feels obvious before you read the whole breakdown.`
    : guideSummary;
  const guideAnswerKicker = guideRoutingHubMode ? "Start here" : "Quick answer";
  const guideAnswerTitle = guideStarterPackMode
    ? "Choose the day shape first"
    : guideRoundupMode
      ? "Pick the kind of question first"
    : guideChooserMode
      ? "Pick the day type first"
      : guideHeroQuestion;
  const guideAnswerCopy = guideStarterPackMode
    ? "Start with the calmer path when the day should feel easy. Start with the bigger path when the day needs more energy. Visitor, host, and ready-made route options stay right below."
    : guideRoundupMode
      ? `Choose named places, visitor context, neighborhood choice, or an easier pace first so the next guide feels obvious instead of equally possible.`
      : guideChooserMode
      ? `Choose the easiest match for today's weather, energy, or pace. You can still compare the other page types without losing your place.`
      : guidePromise;
  const showGuideAnswerCard = !showRouteHeroCard;
  const showGuideDecisionStrip = false;
  const showGuideMetaRow = !guideRoutingHubMode;
  const showGuideHeroSide = !guideStarterPackMode && !showRouteHeroCard;
  const showGuideSidebarMiniGrid = !showRouteHeroCard && !guideRoutingHubMode;
  const showGuideRelatedPages = simplifiedResourceLinks.length > 0 && !guideRoutingHubMode && !showRouteHeroCard;
  const showGuideLongExplanation = Boolean(guideBody && guideBody !== guideIntro);
  const showPinnedRouteRail = showRouteHeroCard && Boolean(guideMissionAction);
  const guideFastSkipNote = showRouteHeroCard
    ? "Already ready to move? Use the pinned plan card and skip the rest of this page."
    : guidePlaceAction
      ? "Already ready for named places? Use the local-places link above and skip the rest of this page."
      : "Already know the next page you want? Use the main button above and skip the rest of this page.";
  const guideHeroSideFooterAction = guideMissionAction
    ? {
        title: `Plan ready now${guideMissionPreview ? `: ${guideMissionPreview.stopLabel}` : ""}`,
        label: guideMissionAction.label,
        path: guideMissionAction.path,
      }
    : guideRouterAction
      ? {
          title: "Need a focused page next?",
          label: guideRouterAction.label,
          path: guideRouterAction.path,
        }
      : guideSecondaryAction
        ? {
            title: "Need a different next move?",
            label: guideSecondaryAction.label,
            path: guideSecondaryAction.path,
          }
        : {
            title: "Need a different guide?",
            label: "See all guides",
            path: resolvedGuideHubPath,
          };
  const showGuideExtraHelp = Boolean(
    sourceBackedGuidePlaces.length > 0 ||
    showGuideRelatedPages ||
    relatedBusinesses.length > 0 ||
    relatedGuides.length > 0 ||
    relatedEvents.length > 0,
  );
  const renderGuideRouteSnapshot = ({ rail = false }: { rail?: boolean } = {}) => {
    if (!showRouteHeroCard || !guideMissionAction) {
      return null;
    }

    return (
      <div
        className={`guide-route-hero-card guide-route-hero-card-compact guide-route-hero-card-preview${rail ? " guide-route-rail-card" : ""}`}
      >
        <div className="guide-route-hero-topline">
          <span className="query-card-kicker">{rail ? "Pinned route" : "Plan preview"}</span>
          <StatusPill tone="blue">{rail ? "Keep this open" : "Map handoff ready"}</StatusPill>
        </div>
        <div className={`guide-route-hero-map${rail ? " guide-route-hero-map-rail" : ""}`} aria-hidden="true">
          <img
            alt=""
            decoding="async"
            loading="lazy"
            src={guideVisual}
          />
          <div className="guide-route-hero-photo-copy">
            <span>{routeChooser ? "Example plan" : "Saved plan"}</span>
            <strong>Open the plan for the real Google Maps route.</strong>
          </div>
        </div>
        <div className="guide-route-hero-header">
          <div>
            <strong>{guideMissionAction.title}</strong>
            <p>
              {rail
                ? "Keep this route card nearby while you decide whether to open the plan or finish the steps below."
                : routeChooser
                  ? "This is the exact example plan the green button opens."
                  : "This is the exact saved plan the green button opens."}
            </p>
          </div>
        </div>
        <div className="guide-route-hero-note">
          {routeChooser
            ? "The route already has the stop order, timing, and a Maps handoff filled in for you."
            : "The saved plan already has the stop order, timing, and a Maps handoff filled in for you."}
        </div>
        <div className="guide-route-hero-facts">
          {routeHeroFacts.map((fact) => (
            <div className="guide-route-hero-fact" key={`${guide.id}-${rail ? "rail" : "hero"}-${fact.label}`}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
        {routeHeroTimelineStops.length > 0 ? (
          <div className="guide-route-hero-timeline">
            <span className="query-card-kicker">First 3 stops</span>
            <div className="guide-route-hero-timeline-list">
              {routeHeroTimelineStops.map((stop) => (
                <div className="guide-route-hero-stop" key={`${guide.id}-${rail ? "rail" : "hero"}-${stop.index}-${stop.label}`}>
                  <span>{stop.index}</span>
                  <div>
                    <strong>{stop.label}</strong>
                    <small>{stop.durationLabel}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="guide-route-hero-actions">
          <AppLink className="button primary" to={guidePinnedRoutePrimaryPath}>
            {guidePinnedRoutePrimaryLabel} <ArrowRightIcon />
          </AppLink>
          {guidePlaceAction ? (
            <AppLink className="text-link" to={guidePlaceAction.path}>
              {guidePlaceAction.label} <ArrowRightIcon />
            </AppLink>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      <section
        className={`guide-hero guide-answer-first${guideStarterPackMode || showRouteHeroCard ? " guide-hero-single-focus" : ""}${showRouteHeroCard ? " guide-two-choice-hero" : ""}`}
      >
        <div className="guide-hero-copy">
          {showRouteHeroCard && guideMissionAction ? (
            <div className="guide-two-choice-shell">
              <div className="guide-two-choice-main">
                <p className="section-label">{simplifyGuideCategoryLabel(guide.category)}</p>
                <h1>{guideTwoChoiceQuestion}</h1>
                <p className="guide-summary">{guideTwoChoiceSummary}</p>
                {showGuideMetaRow ? (
                  <div className="guide-meta-row">
                    <StatusPill tone="blue">{guide.readMinutes} min read</StatusPill>
                    <StatusPill tone={gateMeta.tone}>{gateMeta.label}</StatusPill>
                    <span>Updated {guide.lastReviewed}</span>
                  </div>
                ) : null}
                <div className="guide-pinned-route-list" aria-label="Why this route is the best first click">
                  {guidePinnedRouteChecks.map(({ copy, icon: Icon, path, title }) => (
                    <article className="guide-pinned-route-row" key={`${guide.id}-${title}`}>
                      <span className="guide-pinned-route-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <div className="guide-pinned-route-copy">
                        <strong>{title}</strong>
                        <p>{copy}</p>
                        {path ? (
                          <AppLink className="text-link" to={path}>
                            See local places <ArrowRightIcon />
                          </AppLink>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
                <div className="guide-pinned-route-links">
                  <a className="text-link" href="#guide-article">
                    Use guide for the first decision <ArrowRightIcon />
                  </a>
                  <AppLink className="text-link" to={resolvedGuideHubPath}>
                    See all guides <ArrowRightIcon />
                  </AppLink>
                </div>
              </div>
              <aside aria-label="Plan preview">{renderGuideRouteSnapshot()}</aside>
            </div>
          ) : (
            <>
              <p className="section-label">{simplifyGuideCategoryLabel(guide.category)}</p>
              <h1>{guideHeroTitle}</h1>
              <p className="guide-summary">{guideHeroSummary}</p>
              {showGuideMetaRow ? (
                <div className="guide-meta-row">
                  <StatusPill tone="blue">{guide.readMinutes} min read</StatusPill>
                  <StatusPill tone={gateMeta.tone}>{gateMeta.label}</StatusPill>
                  {guideMissionAction ? (
                  <StatusPill tone="green">
                      {routeChooser ? "Example route" : "Route ready"}
                    </StatusPill>
                  ) : null}
                  <span>Updated {guide.lastReviewed}</span>
                </div>
              ) : null}
            </>
          )}
          {showGuideAnswerCard ? (
            <div
              className={`guide-answer-card guide-answer-card-primary${guideStarterPackMode ? " guide-answer-card-starter" : ""}`}
            >
              <span className="query-card-kicker">{guideAnswerKicker}</span>
              <strong>{guideAnswerTitle}</strong>
              <p>{guideAnswerCopy}</p>
              {guideMissionPreview && guideMissionAction ? (
                <div className="guide-route-preview">
                  <span className="query-card-kicker">
                    {routeChooser ? "Example plan preview" : "Plan preview"}
                  </span>
                  <strong>{guideMissionAction.title}</strong>
                  <p>
                    {routeChooser
                      ? "This gives you one concrete version of the guide when you want the stop order and timing decided for you."
                      : "This guide already has a linked saved plan, so you can open the stop order, timing, and Google Maps handoff right away."}
                  </p>
                  <div className="tag-cloud guide-route-preview-tags">
                    <span>{guideMissionPreview.stopLabel}</span>
                    <span>{guideMissionPreview.totalMinutesLabel}</span>
                    <span>{guideMissionPreview.travelSummary}</span>
                    {guideMissionPreview.startLabel ? <span>{guideMissionPreview.startLabel}</span> : null}
                  </div>
                </div>
              ) : null}
              {guideRoutingHubMode && selectedGuideRoutingChoice ? (
                <div className="guide-route-preview">
                  <div className="guide-routing-segmented" role="tablist" aria-label="Choose the best first page">
                    {guideRoutingChoices.map((choice) => {
                      const active = choice.path === selectedGuideRoutingChoice.path;
                      return (
                        <button
                          aria-pressed={active}
                          className={`guide-routing-segment${active ? " is-active" : ""}`}
                          key={choice.path}
                          onClick={() => setSelectedGuideRoutingChoicePath(choice.path)}
                          type="button"
                        >
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="guide-routing-focus-card">
                    <span className="query-card-kicker">{selectedGuideRoutingChoice.kicker}</span>
                    <strong>{selectedGuideRoutingChoice.title}</strong>
                    <p>{selectedGuideRoutingChoice.copy}</p>
                    <div className="guide-routing-focus-actions">
                      <AppLink className="button primary" to={selectedGuideRoutingChoice.path}>
                        {selectedGuideRoutingChoice.actionLabel} <ArrowRightIcon />
                      </AppLink>
                      <AppLink className="button secondary" to={resolvedGuideHubPath}>
                        See full guide library
                      </AppLink>
                    </div>
                  </div>
                </div>
              ) : guideStarterPackMode && guideStarterPackPhotoChoices.length > 0 ? (
                <div className="guide-route-preview guide-route-preview-starter">
                  <div className="guide-starter-photo-choice-stack" aria-label="Choose the kind of day first">
                    {guideStarterPackPhotoChoices.map((choice, index) => (
                      <Fragment key={choice.path}>
                        {index > 0 ? (
                          <div className="guide-starter-or-divider" aria-hidden="true">
                            <span>Or</span>
                          </div>
                        ) : null}
                        <AppLink className="guide-starter-photo-choice" to={choice.path}>
                          <img
                            alt={choice.title}
                            decoding="async"
                            loading="lazy"
                            src={choice.imagePath}
                          />
                          <div className="guide-starter-photo-choice-copy">
                            <span className="query-card-kicker">{choice.kicker}</span>
                            <strong>{choice.title}</strong>
                            <p>{choice.copy}</p>
                            <span className="guide-starter-photo-choice-hint">
                              {choice.actionLabel} <ArrowRightIcon />
                            </span>
                          </div>
                        </AppLink>
                      </Fragment>
                    ))}
                  </div>
                  {guideStarterPackSupportLinks.length > 0 ? (
                    <div className="guide-starter-support-grid">
                      {guideStarterPackSupportLinks.map((link) => (
                        <AppLink className="guide-starter-support-link" key={link.path} to={link.path}>
                          <strong>{link.label}</strong>
                          <span>{link.copy}</span>
                        </AppLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : guideRouterPreview ? (
                <div className="guide-route-preview">
                  <strong>{guideRouterPreview.title}</strong>
                  <p>{guideRouterPreview.copy}</p>
                  <div className="tag-cloud guide-route-preview-tags">
                    {guideRouterPreview.tags.map((tag) => (
                      <span key={`${guide.id}-${tag}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="guide-answer-actions">
                {guideStarterPackMode ? (
                  <a className="text-link" href="#guide-article">
                    Why these two choices? <ArrowRightIcon />
                  </a>
                ) : guideRoutingHubMode ? (
                  <a className="text-link" href="#guide-article">
                    See the full breakdown <ArrowRightIcon />
                  </a>
                ) : guideRoundupMode ? (
                  <>
                    <AppLink className="button secondary" to={resolvedGuideHubPath}>
                      See full guide library
                    </AppLink>
                    <a className="text-link" href="#guide-article">
                      See the full breakdown <ArrowRightIcon />
                    </a>
                  </>
                ) : (
                  <>
                    <AppLink className="button primary" to={guidePrimaryAction.path}>
                      {guidePrimaryAction.label} <ArrowRightIcon />
                    </AppLink>
                    {guideSecondaryAction ? (
                      <AppLink className="button secondary" to={guideSecondaryAction.path}>
                        {guideSecondaryAction.label}
                      </AppLink>
                    ) : null}
                  </>
                )}
                {guideChooserMode ? (
                  <a className="text-link" href="#guide-article">
                    Why this pick? <ArrowRightIcon />
                  </a>
                ) : guideRoundupMode || guideStarterPackMode ? (
                  null
                ) : (
                  <AppLink className="text-link" to={resolvedGuideHubPath}>
                    See all guides <ArrowRightIcon />
                  </AppLink>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {showGuideHeroSide ? (
          <div className="guide-hero-side">
          <div className="guide-hero-media">
            <img
              src={guideVisual}
              alt={`Illustrated guide scene for ${guideTitle}`}
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
            {showGuideSidebarMiniGrid ? (
              <div className="guide-sidebar-mini-grid">
                {guideMissionPreview && guideMissionAction ? (
                  <div className="guide-sidebar-mini-card">
                    <span className="query-card-kicker">
                      {routeChooser ? "Example route" : "Route ready"}
                    </span>
                    <p>
                      {guideMissionPreview.stopLabel} • {guideMissionPreview.totalMinutesLabel}
                    </p>
                  </div>
                ) : null}
                {guideRouterPreview && !guideRoutingHubMode ? (
                  <div className="guide-sidebar-mini-card">
                    <span className="query-card-kicker">Fastest first click</span>
                    <p>{guideRouterPreview.title}</p>
                  </div>
                ) : null}
                <div className="guide-sidebar-mini-card">
                  <span className="query-card-kicker">This page answers</span>
                  <p>{guideQueryClass}</p>
                </div>
                <div className="guide-sidebar-mini-card">
                  <span className="query-card-kicker">Who it helps most</span>
                  <p>{guideAudience}</p>
                </div>
              </div>
            ) : null}
            <div className="guide-sidebar-footer">
              <strong>{guideHeroSideFooterAction.title}</strong>
              <AppLink className="text-link" to={guideHeroSideFooterAction.path}>
                {guideHeroSideFooterAction.label} <ArrowRightIcon />
              </AppLink>
            </div>
          </aside>
          </div>
        ) : null}
      </section>

      {showGuideDecisionStrip ? (
        <section className="section-block guide-decision-strip">
          <SectionHeader
            label={guideDecisionMeta.label}
            title={guideDecisionMeta.title}
            copy={guideDecisionMeta.copy}
          />
          <div className="guide-query-grid guide-decision-grid">
            <article className="query-card guide-fit-card">
              <span className="query-card-kicker">Open this page when</span>
              <strong>{guideHeroQuestion}</strong>
              <p>{guidePromise}</p>
              <div className="tag-cloud">
                {guide.bestFor.slice(0, 3).map((item) => (
                  <span key={`${guide.id}-${item}`}>{simplifyGuideDisplayText(item)}</span>
                ))}
              </div>
            </article>
            {guideMissionAction ? (
              <AppLink className="query-card query-card-link" to={guideMissionAction.path}>
                <span className="query-card-kicker">{guideMissionAction.kicker}</span>
                <strong>{guideMissionAction.title}</strong>
                <p>{guideMissionAction.copy}</p>
                <span className="query-card-hint">
                  {guideMissionAction.label} <ArrowRightIcon />
                </span>
              </AppLink>
            ) : null}
            {guidePlaceAction ? (
              <AppLink className="query-card query-card-link" to={guidePlaceAction.path}>
                <span className="query-card-kicker">{guidePlaceAction.kicker}</span>
                <strong>{guidePlaceAction.title}</strong>
                <p>{guidePlaceAction.copy}</p>
                <span className="query-card-hint">
                  {guidePlaceAction.label} <ArrowRightIcon />
                </span>
              </AppLink>
            ) : guideNextSurfaceAction ? (
              <AppLink className="query-card query-card-link" to={guideNextSurfaceAction.path}>
                <span className="query-card-kicker">{guideNextSurfaceAction.kicker}</span>
                <strong>{guideNextSurfaceAction.title}</strong>
                <p>{guideNextSurfaceAction.copy}</p>
                <span className="query-card-hint">
                  {guideNextSurfaceAction.label} <ArrowRightIcon />
                </span>
              </AppLink>
            ) : null}
            <AppLink className="query-card query-card-link" to={guideAlternateAction.path}>
              <span className="query-card-kicker">{guideAlternateAction.kicker}</span>
              <strong>{guideAlternateAction.title}</strong>
              <p>{guideAlternateAction.copy}</p>
              <span className="query-card-hint">
                {guideAlternateAction.label} <ArrowRightIcon />
              </span>
            </AppLink>
          </div>
        </section>
      ) : null}

      <section className={`guide-layout${showPinnedRouteRail ? "" : " guide-layout-single"}`}>
        <article className="guide-article" id="guide-article">
          <div className="guide-intro">
            <p>{guideIntro}</p>
            <p className="guide-intro-note">{guideFastSkipNote}</p>
          </div>

          {showGuideLongExplanation ? (
            <GuideOptionalSection
              label="Optional"
              title="Want the longer explanation?"
              summary="Open this only if you want the full reasoning before you choose the next page or route."
            >
              <p>{guideBody}</p>
            </GuideOptionalSection>
          ) : null}

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

          <GuideOptionalSection
            label="Optional"
            title="Still have one question?"
            summary="Open this only if the main steps still leave one specific question unanswered."
          >
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
          </GuideOptionalSection>

          {showGuideExtraHelp ? (
            <GuideOptionalSection
              label="Optional"
              title="Need a different page?"
              summary="Open this only if your question changed and you need exact place pages, nearby options, or another planning page."
            >
              <div className="guide-extra-stack">
                {sourceBackedGuidePlaces.length > 0 && sourceBackedGuideMeta ? (
                  <div className="guide-extra-group">
                    <h3>Exact place pages</h3>
                    <p className="guide-extra-group-copy">
                      Use these when you want exact place pages with official links and a correction path.
                    </p>
                    <div className="card-grid two">
                      {sourceBackedGuidePlaces.map((reference) => (
                        <GuideSourceBackedReferenceCard key={reference.id} reference={reference} variant="compact" />
                      ))}
                    </div>
                  </div>
                ) : null}

                {showGuideRelatedPages ? (
                  <div className="guide-extra-group">
                    <h3>Switch to a different page</h3>
                    <p className="guide-extra-group-copy">
                      Open these only if the real question changed and this page is no longer the right fit.
                    </p>
                    <div className="guide-query-grid">
                      {simplifiedResourceLinks.map((link) => (
                        <AppLink className="query-card query-card-link guide-routing-card" key={link.path} to={link.path}>
                          <strong>{link.title}</strong>
                          <p>{link.description}</p>
                          <span className="query-card-hint">Open page</span>
                        </AppLink>
                      ))}
                    </div>
                  </div>
                ) : null}

                {relatedBusinesses.length > 0 && !sourceBackedGuideMeta ? (
                  <div className="guide-extra-group">
                    <h3>Nearby places</h3>
                    <p className="guide-extra-group-copy">
                      Use these only after the planning question is settled and you want place pages next.
                    </p>
                    <div className="card-grid two">
                      {relatedBusinesses.map((business) => (
                        <BusinessCard business={business} key={business.id} />
                      ))}
                    </div>
                  </div>
                ) : null}

                {relatedGuides.length > 0 ? (
                  <div className="guide-extra-group">
                    <h3>More guides</h3>
                    <p className="guide-extra-group-copy">
                      Open these only when you want to switch questions, not because this page still feels unclear.
                    </p>
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
                  </div>
                ) : null}

                {relatedEvents.length > 0 ? (
                  <div className="guide-extra-group">
                    <h3>Related events</h3>
                    <p className="guide-extra-group-copy">
                      Open these only when you want live event pages after the main planning question is settled.
                    </p>
                    <div className="card-grid two">
                      {relatedEvents.map((event) => (
                        <EventCard event={event} key={event.id} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </GuideOptionalSection>
          ) : null}
        </article>
        {showPinnedRouteRail ? (
          <aside className="guide-rail guide-route-rail" aria-label="Pinned route snapshot">
            {renderGuideRouteSnapshot({ rail: true })}
          </aside>
        ) : null}
      </section>
    </>
  );
}
