import type {
  CityAtlasData,
  Guide,
  InternalResourceLink,
  SourceBackedPlaceReference,
} from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";
import { getGuideCityName, getGuidePath } from "../../lib/cityPaths";
import {
  getSourceBackedCollectionForGuide,
  getSourceBackedCollectionGuideHubLabel,
  getSourceBackedCollectionGuideHubPath,
  getSourceBackedPlaces,
  type SourceBackedCollectionId,
  sourceBackedCollectionMeta,
} from "../../lib/sourceBackedCollections";

function SourceBackedReferenceCard({
  reference,
}: {
  reference: SourceBackedPlaceReference;
}) {
  return (
    <article className="source-panel">
      <p className="section-label">{reference.category}</p>
      <div className="hero-actions">
        <h2>{reference.name}</h2>
        <StatusPill tone="green">Official source checked</StatusPill>
      </div>
      <p>{reference.summary}</p>
      <div className="tag-cloud">
        <span>{reference.neighborhood}</span>
        <span>{reference.routeRole}</span>
        {reference.bestFor.map((item) => (
          <span key={`${reference.id}-${item}`}>{item}</span>
        ))}
      </div>
      <p>
        <strong>Why it fits:</strong> {reference.whyItFits}
      </p>
      <ul className="plain-list compact">
        {reference.verifiedFacts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      <div className="hero-actions">
        <a
          className="button secondary"
          href={reference.officialSourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open official source
        </a>
        <AppLink className="button secondary" to={reference.correctionPath}>
          Correction path
        </AppLink>
      </div>
      <small>
        Source owner: {reference.sourceOwner}. Checked {reference.sourceCheckedAt}.
      </small>
      <ul className="plain-list compact">
        {reference.claimBoundaries.map((boundary) => (
          <li key={boundary}>{boundary}</li>
        ))}
      </ul>
    </article>
  );
}

function getMatchingGuideForCollection(
  data: CityAtlasData,
  collection: SourceBackedCollectionId,
): Guide | null {
  return (
    data.guides.find((guide) => getSourceBackedCollectionForGuide(guide) === collection) ?? null
  );
}

function getCollectionNextLinks(
  guide: Guide | null,
  collectionPath: string,
  collection: SourceBackedCollectionId,
): InternalResourceLink[] {
  if (!guide) {
    return [];
  }

  const cityName = getGuideCityName(guide);
  const guideHubPath = getSourceBackedCollectionGuideHubPath(collection);
  const nextLinks: InternalResourceLink[] = [
    {
      title: guide.title,
      path: getGuidePath(guide),
      description:
        "Open the matching answer-first guide when these official-source anchors need a clearer CityAtlas route shape instead of a short real-place list alone.",
    },
  ];
  const seenPaths = new Set(nextLinks.map((link) => link.path));

  for (const link of guide.resourceLinks ?? []) {
    if (link.path === collectionPath || seenPaths.has(link.path)) {
      continue;
    }

    nextLinks.push(link);
    seenPaths.add(link.path);

    if (nextLinks.length >= 4) {
      break;
    }
  }

  if (!seenPaths.has(guideHubPath) && nextLinks.length < 4) {
    nextLinks.push({
      title: getSourceBackedCollectionGuideHubLabel(collection),
      path: guideHubPath,
      description:
        `Use the broader ${cityName} guide hub when the strongest next move is comparing CityAtlas route clusters instead of staying inside one starter page.`,
    });
  }

  return nextLinks;
}

const sourceBackedPageContent: Record<
  SourceBackedCollectionId,
  {
    heroLabel: string;
    heroTitle: string;
    heroCopy: string;
    primaryCtaPath: string;
    primaryCtaLabel: string;
    helpBullets: string[];
    sectionTitle: string;
    sectionCopy: string;
    whyTitle: string;
    whyCopy: string;
    nextTitle: string;
    nextCopy: string;
  }
> = {
  vancouver_date_night_starters: {
    heroLabel: "Source-backed date night coverage",
    heroTitle: "Vancouver date night starters with official source notes",
    heroCopy:
      "Start here if you want CityAtlas to name a few real Vancouver anchors without pretending it already runs a fully verified venue database. Every entry below links to an official public source, explains why it can fit a date-night route, and keeps the claim limits visible.",
    primaryCtaPath: "/vancouver/guides/how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice",
    primaryCtaLabel: "Read the route guide",
    helpBullets: [
      "These are official-source starting points, not universal winners.",
      "CityAtlas is packaging route fit, not promising rankings or endorsements.",
      "Hours, inventory, booking details, and menus can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced anchors CityAtlas can stand behind today",
    sectionCopy:
      "This coverage is intentionally tight. It gives readers a useful real-world layer now, while broader real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "Readers do not need CityAtlas to pretend it already owns all of Vancouver. They need a smaller set of pages that are easy to summarize, obviously useful, and backed by visible source discipline.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful cluster at a time: more date-night route coverage, then adjacent visitor or rainy-day pages, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  vancouver_rainy_day_starters: {
    heroLabel: "Source-backed rainy-day coverage",
    heroTitle: "Vancouver rainy-day starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver rainy-day anchors without pretending CityAtlas already runs a complete verified city database. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath: "/vancouver/guides/rainy-day-vancouver-plan-coffee-walk-and-reset",
    primaryCtaLabel: "Read the rainy-day guide",
    helpBullets: [
      "These are official-source indoor or low-weather-friction starting points, not universal rainy-day winners.",
      "CityAtlas is packaging route fit, not claiming every stop is right for every mood, budget, or weather shift.",
      "Hours, ticketing, access rules, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced anchors CityAtlas can stand behind on grey-weather days",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible real-world rainy-day layer now, while broader business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful rainy-day page does not need fake 'best of Vancouver' language. It needs a few low-friction anchors, clear route logic, and visible source discipline that makes the page easier to trust and summarize.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful cluster at a time: more rainy-day route coverage, then first-evening visitor loops and neighborhood depth, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  vancouver_first_evening_starters: {
    heroLabel: "Source-backed visitor coverage",
    heroTitle: "Vancouver first-evening starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver first-evening anchors without pretending CityAtlas already runs a full verified travel guide. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath: "/vancouver/guides/two-hour-vancouver-visitor-loop-for-a-first-evening",
    primaryCtaLabel: "Read the visitor loop guide",
    helpBullets: [
      "These are official-source first-evening starting points, not universal must-see rankings.",
      "CityAtlas is packaging route fit, not claiming every new visitor should follow one identical Vancouver plan.",
      "Hours, admission rules, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced anchors CityAtlas can stand behind for a first Vancouver evening",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible visitor-intent layer now, while broader real-business and itinerary publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A first-evening page does not need fake 'best things to do in Vancouver' language. It needs a few visitor-friendly anchors, clear route logic, and visible source discipline that make the page easier to trust and summarize.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful cluster at a time: more visitor-arrival and destination-choice coverage, then deeper neighborhood pages, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  vancouver_first_time_visitor_starters: {
    heroLabel: "Source-backed destination-choice coverage",
    heroTitle: "Vancouver first-time visitor starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver starting areas without pretending CityAtlas already runs a fully verified travel authority site. Every entry below links to an official public source, explains what kind of first visit it fits, and keeps the claim limits visible.",
    primaryCtaPath: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
    primaryCtaLabel: "Read the destination guide",
    helpBullets: [
      "These are official-source starting areas, not universal 'best of Vancouver' winners.",
      "CityAtlas is packaging fit and route logic, not claiming every visitor should start in the same place.",
      "Hours, access rules, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced starting areas CityAtlas can stand behind for a first Vancouver visit",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible destination-choice layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful first-time visitor page does not need fake 'must see Vancouver' authority. It needs a few clear starting-area choices, visible source discipline, and route logic that helps someone choose fast.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful visitor cluster at a time: arrival corridors, returning-visitor choices, and neighborhood depth, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  toronto_first_time_visitor_starters: {
    heroLabel: "Source-backed Toronto destination-choice coverage",
    heroTitle: "Toronto first-time visitor starters with official source notes",
    heroCopy:
      "Start here if you want a few real Toronto starting areas without pretending CityAtlas already runs a fully verified travel authority site. Every entry below links to an official public source, explains what kind of first visit it fits, and keeps the claim limits visible.",
    primaryCtaPath: "/toronto/guides/where-should-a-first-time-toronto-visitor-start",
    primaryCtaLabel: "Read the Toronto destination guide",
    helpBullets: [
      "These are official-source starting areas, not universal 'best of Toronto' winners.",
      "CityAtlas is packaging fit and route logic, not claiming every visitor should start in the same part of the city.",
      "Hours, access rules, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced starting areas CityAtlas can stand behind for a first Toronto visit",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible Toronto destination-choice layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful first-time Toronto page does not need fake 'must see Toronto' authority. It needs a few clear starting-area choices, visible source discipline, and route logic that helps someone choose fast.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful Toronto visitor cluster at a time: weekend choices, hosted-visit guidance, and downtown-versus-waterfront follow-through, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  toronto_weekend_route_starters: {
    heroLabel: "Source-backed Toronto weekend coverage",
    heroTitle: "Toronto weekend route starters with official source notes",
    heroCopy:
      "Start here if you want a few real Toronto weekend anchors without pretending CityAtlas already runs a fully verified city-weekend authority. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath:
      "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
    primaryCtaLabel: "Read the Toronto weekend guide",
    helpBullets: [
      "These are official-source weekend starting points, not universal 'best weekend in Toronto' winners.",
      "CityAtlas is packaging route fit and pacing, not claiming every Toronto weekend should follow one identical shape.",
      "Hours, access rules, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced Toronto weekend anchors CityAtlas can stand behind today",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible Toronto weekend-planning layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful Toronto weekend page does not need fake 'best things to do this weekend' authority. It needs a few believable anchors, visible source discipline, and route logic that helps someone choose one weekend shape quickly.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful Toronto weekend cluster at a time: hosted-visit guidance, local-night follow-through, and more neighborhood depth, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  vancouver_garden_day_starters: {
    heroLabel: "Source-backed garden-day coverage",
    heroTitle: "Vancouver garden day starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver garden and conservatory anchors without pretending CityAtlas already runs a fully verified nature-and-lifestyle authority. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath:
      "/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day",
    primaryCtaLabel: "Read the garden-day guide",
    helpBullets: [
      "These are official-source garden and conservatory starting points, not universal best-of Vancouver winners.",
      "CityAtlas is packaging route fit and pacing, not claiming every calmer day should become a long botanical marathon.",
      "Hours, admission rules, and path-access details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced garden and conservatory anchors CityAtlas can stand behind today",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible greener-day planning layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful garden-day page does not need fake local-naturalist language. It needs a few believable anchors, visible source discipline, and route logic that helps someone choose one greener Vancouver shape quickly.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful garden-and-calm cluster at a time: neighborhood follow-through, weather-aware indoor-versus-outdoor handoffs, and later campus-side nature variants only where strong official-source support exists.",
  },
  vancouver_kitsilano_scenic_starters: {
    heroLabel: "Source-backed west-side scenic coverage",
    heroTitle: "Vancouver Kitsilano scenic starters with official source notes",
    heroCopy:
      "Start here if you want a few real west-side Vancouver anchors without pretending CityAtlas already runs a fully verified lifestyle guide. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath:
      "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
    primaryCtaLabel: "Read the Kitsilano guide",
    helpBullets: [
      "These are official-source scenic starting points, not universal west-side winners.",
      "CityAtlas is packaging route fit and pacing, not claiming every slower Vancouver day should look the same.",
      "Hours, admission rules, access conditions, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced west-side anchors CityAtlas can stand behind for a slower Vancouver plan",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible Kitsilano-and-Vanier-facing scenic layer now, while broader real-business and lifestyle publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful scenic page does not need vague 'best Vancouver views' language. It needs a few believable west-side anchors, visible source discipline, and route logic that helps someone choose a slower plan quickly.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful neighborhood-depth cluster at a time: more weather-aware west-side routes, compact shoreline follow-through, and later daytime variations only where stronger official-source support exists.",
  },
  vancouver_west_side_daytime_starters: {
    heroLabel: "Source-backed west-side daytime coverage",
    heroTitle: "Vancouver west-side daytime starters with official source notes",
    heroCopy:
      "Start here if you want a few real west-side Vancouver daytime anchors without pretending CityAtlas already runs a fully verified local-lifestyle guide. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath:
      "/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan",
    primaryCtaLabel: "Read the daytime guide",
    helpBullets: [
      "These are official-source west-side daytime starting points, not universal best-of Vancouver winners.",
      "CityAtlas is packaging destination fit and pacing, not claiming every west-side day should follow one identical route.",
      "Hours, access rules, admission details, and weather conditions can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced west-side daytime anchors CityAtlas can stand behind today",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible west-side daytime layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful west-side daytime page does not need vague local-insider language. It needs a few believable anchors, visible source discipline, and route logic that helps someone choose one daytime shape quickly.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful west-side cluster at a time: weather-led daytime follow-through, UBC-adjacent local discovery, and quieter beach-route choices only where strong official-source support exists.",
  },
  vancouver_false_creek_culture_starters: {
    heroLabel: "Source-backed False Creek culture coverage",
    heroTitle: "Vancouver False Creek culture starters with official source notes",
    heroCopy:
      "Start here if you want a few real False Creek and Vanier-facing Vancouver anchors without pretending CityAtlas already runs a fully verified city-culture guide. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath:
      "/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon",
    primaryCtaLabel: "Read the culture guide",
    helpBullets: [
      "These are official-source False Creek culture starting points, not universal best-of Vancouver winners.",
      "CityAtlas is packaging route fit and pacing, not claiming every culture afternoon should follow one identical loop.",
      "Hours, admission rules, and access details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced False Creek culture anchors CityAtlas can stand behind today",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible culture-afternoon layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful culture-afternoon page does not need fake local-expert language. It needs a few believable anchors, visible source discipline, and compact-route logic that helps someone choose one contained area quickly.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful False Creek and city-culture cluster at a time: weather-aware daytime follow-through, downtown handoff pages, and additional museum-adjacent route choices only where strong official-source support exists.",
  },
  vancouver_ubc_discovery_starters: {
    heroLabel: "Source-backed UBC discovery coverage",
    heroTitle: "Vancouver UBC discovery starters with official source notes",
    heroCopy:
      "Start here if you want a few real UBC-adjacent Vancouver anchors without pretending CityAtlas already runs a fully verified campus or travel authority. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath:
      "/vancouver/guides/where-should-you-start-a-ubc-adjacent-vancouver-discovery-day",
    primaryCtaLabel: "Read the UBC discovery guide",
    helpBullets: [
      "These are official-source UBC discovery starting points, not universal best-of Vancouver winners.",
      "CityAtlas is packaging campus fit and pacing, not claiming every west-side day should become a museum-and-garden marathon.",
      "Hours, admission rules, and access details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced UBC discovery anchors CityAtlas can stand behind today",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible UBC-adjacent discovery layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful UBC discovery page does not need fake campus-insider language. It needs a few believable museums, gardens, and canopy anchors, visible source discipline, and route logic that helps someone choose one contained area quickly.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful campus-side cluster at a time: Pacific Spirit follow-through, weather-aware west-side handoffs, and quieter half-day work-session routes only where strong official-source support exists.",
  },
  vancouver_returning_visitor_starters: {
    heroLabel: "Source-backed repeat-visit coverage",
    heroTitle: "Vancouver returning-visitor starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver second-look anchors without pretending CityAtlas already runs a fully verified insider city guide. Every entry below links to an official public source, explains what kind of repeat visit it fits, and keeps the claim limits visible.",
    primaryCtaPath: "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
    primaryCtaLabel: "Read the returning-visitor guide",
    helpBullets: [
      "These are official-source repeat-visit starting points, not universal hidden-gem rankings.",
      "CityAtlas is packaging local-discovery fit, not claiming every returning visitor should avoid downtown or follow one identical route.",
      "Hours, access rules, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced repeat-visit anchors",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible repeat-visit layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful returning-visitor page does not need fake insider authority or secret-spot hype. It needs a few clear second-look anchors, visible source discipline, and route logic that helps someone choose a different side of Vancouver fast.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful repeat-visit cluster at a time: neighborhood-depth follow-through, calmer campus half-days, and later work-session help only where stronger official-source support exists.",
  },
  vancouver_out_of_town_guest_starters: {
    heroLabel: "Source-backed guest-hosting coverage",
    heroTitle: "Vancouver out-of-town guest starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver anchors for hosting someone new to the city without pretending CityAtlas already runs a fully verified travel concierge. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath: "/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver",
    primaryCtaLabel: "Read the host guide",
    helpBullets: [
      "These are official-source guest-hosting starting points, not universal must-do winners.",
      "CityAtlas is packaging route fit and hosting ease, not claiming every visitor or every host needs the same Vancouver plan.",
      "Hours, admission rules, and access details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced anchors CityAtlas can stand behind when you are hosting someone in Vancouver",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible guest-hosting layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful host-plan page does not need a fake exhaustive itinerary. It needs a few easy anchors, visible source discipline, and route logic that helps someone choose one strong Vancouver introduction quickly.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful hosting cluster at a time: rainy backup plans for guests, returning-visitor choices, and neighborhood depth, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  vancouver_weekend_route_starters: {
    heroLabel: "Source-backed weekend-route coverage",
    heroTitle: "Vancouver weekend route starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver weekend anchors without pretending CityAtlas already runs a fully verified travel authority. Every entry below links to an official public source, explains what kind of weekend route it fits, and keeps the claim limits visible.",
    primaryCtaPath:
      "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
    primaryCtaLabel: "Read the weekend guide",
    helpBullets: [
      "These are official-source weekend-route starting points, not universal 'best weekend in Vancouver' winners.",
      "CityAtlas is packaging fit and pacing, not claiming every local or visitor should follow the same weekend plan.",
      "Hours, access rules, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced anchors CityAtlas can stand behind for one Vancouver weekend route",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible weekend-planning layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful weekend page does not need a giant things-to-do list. It needs a few route-fit anchors, visible source discipline, and a cleaner way to help someone choose the kind of weekend they actually want.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful weekend cluster at a time: low-effort Sunday plans, returning-visitor routes, and later neighborhood depth, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  vancouver_sunday_starters: {
    heroLabel: "Source-backed Sunday coverage",
    heroTitle: "Vancouver Sunday starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver Sunday anchors without pretending CityAtlas already runs a fully verified travel authority. Every entry below links to an official public source, explains what kind of low-effort Sunday it fits, and keeps the claim limits visible.",
    primaryCtaPath: "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
    primaryCtaLabel: "Read the Sunday guide",
    helpBullets: [
      "These are official-source Sunday starting points, not universal 'best Sunday in Vancouver' winners.",
      "CityAtlas is packaging fit and pacing, not claiming every Sunday should follow the same plan.",
      "Hours, access rules, and seasonal details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced anchors CityAtlas can stand behind for a low-effort Vancouver Sunday",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible Sunday-planning layer now, while broader itinerary and real-business publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful Sunday page does not need a giant weekend roundup. It needs a few lower-friction anchors, visible source discipline, and route logic that helps someone choose an easier Vancouver day quickly.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful Sunday-adjacent cluster at a time: returning-visitor route help, neighborhood-specific Sunday choices, and later indoor fallback coverage, using the same source-owner, source-date, and correction rules before anything broader is published.",
  },
  vancouver_wellness_reset_starters: {
    heroLabel: "Source-backed wellness coverage",
    heroTitle: "Vancouver wellness reset starters with official source notes",
    heroCopy:
      "Start here if you want a few real Vancouver reset anchors without pretending CityAtlas already runs a verified wellness authority site. Every entry below links to an official public source, explains the route role, and keeps the claim limits visible.",
    primaryCtaPath: "/vancouver/guides/vancouver-wellness-experiences-to-review",
    primaryCtaLabel: "Read the wellness guide",
    helpBullets: [
      "These are official-source reset anchors, not universal wellness winners or treatment claims.",
      "CityAtlas is packaging route fit and pacing, not claiming medical outcomes or that one reset plan works for everyone.",
      "Hours, admission rules, access conditions, and sensory details can change, so confirm them on the official source.",
      "Every source-backed entry routes to a public correction or removal path.",
    ],
    sectionTitle: "Five carefully sourced anchors CityAtlas can stand behind for a Vancouver reset hour",
    sectionCopy:
      "This coverage is intentionally narrow. It gives readers a credible calm-hour layer now, while broader real-business and treatment-style publication is still being expanded carefully.",
    whyTitle: "Why this page stays useful and trustworthy",
    whyCopy:
      "A useful wellness page does not need inflated body-benefit promises or fake insider authority. It needs a few believable reset anchors, visible source discipline, and route logic that helps someone choose a calmer next move.",
    nextTitle: "What comes next if this works",
    nextCopy:
      "Expand only one careful reset cluster at a time: neighborhood-specific calm routes, weather-proof decompression plans, and later work-session help once stronger official-source support exists.",
  },
};

export function SourceBackedCollectionPage({
  data,
  collection,
}: {
  data: CityAtlasData;
  collection: SourceBackedCollectionId;
}) {
  const starters = getSourceBackedPlaces(data, collection);
  const content = sourceBackedPageContent[collection];
  const matchingGuide = getMatchingGuideForCollection(data, collection);
  const nextLinks = getCollectionNextLinks(
    matchingGuide,
    sourceBackedCollectionMeta[collection].path,
    collection,
  );

  return (
    <>
      <section className="city-hero">
        <div>
          <p className="section-label">{content.heroLabel}</p>
          <h1>{content.heroTitle}</h1>
          <p>{content.heroCopy}</p>
          <div className="hero-actions">
            <AppLink className="button primary" to={content.primaryCtaPath}>
              {content.primaryCtaLabel} <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/editorial-standards">
              Editorial standards
            </AppLink>
          </div>
        </div>
        <div className="source-panel">
          <ShieldIcon />
          <h2>How to read this page</h2>
          <ul className="plain-list compact">
            {content.helpBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <StatusPill tone="blue">{starters.length} source-backed real-world entries</StatusPill>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Official-source starters"
          title={content.sectionTitle}
          copy={content.sectionCopy}
        />
        <div className="card-grid two">
          {starters.map((reference) => (
            <SourceBackedReferenceCard key={reference.id} reference={reference} />
          ))}
        </div>
      </section>

      {nextLinks.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Next CityAtlas paths"
            title="Move from official-source anchors into the right route page"
            copy="These route links keep the source-backed layer connected to the broader CityAtlas guide library so readers can move from named places into route logic instead of hitting a dead end."
          />
          <div className="guide-query-grid">
            {nextLinks.map((link) => (
              <AppLink className="query-card query-card-link" key={link.path} to={link.path}>
                <strong>{link.title}</strong>
                <p>{link.description}</p>
              </AppLink>
            ))}
          </div>
        </section>
      ) : null}

      <section className="split-section">
        <div className="source-panel">
          <MapIcon />
          <h2>{content.whyTitle}</h2>
          <p>{content.whyCopy}</p>
        </div>
        <div className="source-panel">
          <SparkIcon />
          <h2>Best next move</h2>
          <p>
            Start with this page when named places need official-source context, then open the
            matching guide or guide library when you need more route logic than one starter page
            can provide.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <ShieldIcon />
        <div>
          <h2>Need a correction, claim update, or removal review?</h2>
          <p>
            Use the CityAtlas editorial standards page for correction, removal, outdated-info, and
            claim-this-page requests.
          </p>
        </div>
        <AppLink className="button primary" to="/editorial-standards">
          Open standards <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}

export function DateNightStartersPage({ data }: { data: CityAtlasData }) {
  return <SourceBackedCollectionPage data={data} collection="vancouver_date_night_starters" />;
}

export function RainyDayStartersPage({ data }: { data: CityAtlasData }) {
  return <SourceBackedCollectionPage data={data} collection="vancouver_rainy_day_starters" />;
}

export function FirstEveningStartersPage({ data }: { data: CityAtlasData }) {
  return <SourceBackedCollectionPage data={data} collection="vancouver_first_evening_starters" />;
}

export function FirstTimeVisitorStartersPage({ data }: { data: CityAtlasData }) {
  return (
    <SourceBackedCollectionPage data={data} collection="vancouver_first_time_visitor_starters" />
  );
}

export function GardenDayStartersPage({ data }: { data: CityAtlasData }) {
  return <SourceBackedCollectionPage data={data} collection="vancouver_garden_day_starters" />;
}

export function KitsilanoScenicStartersPage({ data }: { data: CityAtlasData }) {
  return (
    <SourceBackedCollectionPage data={data} collection="vancouver_kitsilano_scenic_starters" />
  );
}

export function WestSideDaytimeStartersPage({ data }: { data: CityAtlasData }) {
  return (
    <SourceBackedCollectionPage data={data} collection="vancouver_west_side_daytime_starters" />
  );
}

export function FalseCreekCultureStartersPage({ data }: { data: CityAtlasData }) {
  return (
    <SourceBackedCollectionPage data={data} collection="vancouver_false_creek_culture_starters" />
  );
}

export function UbcDiscoveryStartersPage({ data }: { data: CityAtlasData }) {
  return <SourceBackedCollectionPage data={data} collection="vancouver_ubc_discovery_starters" />;
}

export function ReturningVisitorStartersPage({ data }: { data: CityAtlasData }) {
  return (
    <SourceBackedCollectionPage data={data} collection="vancouver_returning_visitor_starters" />
  );
}

export function OutOfTownGuestStartersPage({ data }: { data: CityAtlasData }) {
  return (
    <SourceBackedCollectionPage data={data} collection="vancouver_out_of_town_guest_starters" />
  );
}

export function WeekendRouteStartersPage({ data }: { data: CityAtlasData }) {
  return <SourceBackedCollectionPage data={data} collection="vancouver_weekend_route_starters" />;
}

export function SundayStartersPage({ data }: { data: CityAtlasData }) {
  return <SourceBackedCollectionPage data={data} collection="vancouver_sunday_starters" />;
}

export function WellnessResetStartersPage({ data }: { data: CityAtlasData }) {
  return <SourceBackedCollectionPage data={data} collection="vancouver_wellness_reset_starters" />;
}

export function EditorialStandardsPage() {
  return (
    <section className="section-block page-top legal-page">
      <SectionHeader
        label="Editorial standards"
        title="How CityAtlas handles sources, claims, corrections, and removals"
        copy="This page explains how public CityAtlas pages are reviewed before they name real businesses, events, or route anchors. It also provides the public correction and removal path for source-backed pages."
        action={<StatusPill tone="blue">Public trust page</StatusPill>}
      />

      <div className="legal-grid">
        <article className="source-panel">
          <ShieldIcon />
          <h2>What can be public now</h2>
          <p>
            CityAtlas can publish answer-first route logic, neighborhood guidance, and narrow
            source-backed pages that link directly to official public sources and keep claim limits
            visible.
          </p>
        </article>

        <article className="source-panel">
          <MapIcon />
          <h2>What CityAtlas will not publish</h2>
          <p>
            Fake ratings, scraped images, unsupported "best of" claims, live availability claims,
            private contact data, and broad real-business listings do not belong on the public
            site.
          </p>
        </article>

        <article className="source-panel">
          <h2>Source hierarchy</h2>
          <p>
            CityAtlas prefers direct business confirmation first, then official business or venue
            pages, then official booking or event pages, and only uses editorial context as support
            rather than as the sole source for operational facts.
          </p>
        </article>

        <article className="source-panel">
          <h2>Claim limits</h2>
          <p>
            Public CityAtlas pages should stay neutral about quality, rankings, popularity, safety,
            pricing, or availability unless those details are clearly supported by an approved
            source and still fit the page's visible scope.
          </p>
        </article>

        <article className="source-panel">
          <h2>Correction and removal requests</h2>
          <p>
            To claim a page, request a correction, request removal, or report outdated information,
            email{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> with the
            page URL, the issue, and the best official source or official contact path for review.
          </p>
        </article>

        <article className="source-panel">
          <h2>Suggested subject lines</h2>
          <ul className="plain-list compact">
            <li>Claim this CityAtlas page</li>
            <li>CityAtlas correction request</li>
            <li>CityAtlas removal request</li>
            <li>CityAtlas outdated info report</li>
          </ul>
        </article>
      </div>

      <div className="cta-band">
        <ShieldIcon />
        <div>
          <h2>Need the broader policy context?</h2>
          <p>
            Review the current terms and privacy pages for the public discovery surface, the
            current data posture, and future provider boundaries.
          </p>
        </div>
        <div className="hero-actions">
          <AppLink className="button secondary" to="/terms">
            Terms
          </AppLink>
          <AppLink className="button primary" to="/privacy">
            Privacy
          </AppLink>
        </div>
      </div>
    </section>
  );
}
