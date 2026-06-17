import { useMemo, useState } from "react";
import type { CityAtlasData, CityMission } from "../../types";
import { siteConfig } from "../../config/site";
import { AppLink } from "../../components/Link";
import { BusinessCard, EventCard, GuideCard, MissionCard, OfferCard } from "../../components/Cards";
import { SearchIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";
import { getSourceBackedPlaces } from "../../lib/sourceBackedCollections";
import { VancouverBusinessCoverageSection } from "./VancouverBusinessCoverageSection";

interface CityPageProps {
  data: CityAtlasData;
  onSaveMission: (mission: CityMission) => void;
}

export function CityPage({ data, onSaveMission }: CityPageProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(data.businesses.map((business) => business.category)))];
  const cityGuides = data.guides.filter(
    (guide) => (guide.citySlug ?? siteConfig.citySlug) === siteConfig.citySlug,
  );
  const neighborhoodGuides = cityGuides.filter((guide) => guide.cluster === "Neighborhoods");
  const neighborhoodStarterGuides = neighborhoodGuides.filter(
    (guide) => guide.category === "Neighborhood Starter",
  );
  const sourceBackedDateNightStarters = getSourceBackedPlaces(data, "vancouver_date_night_starters");
  const sourceBackedRainyDayStarters = getSourceBackedPlaces(data, "vancouver_rainy_day_starters");
  const sourceBackedFirstEveningStarters = getSourceBackedPlaces(
    data,
    "vancouver_first_evening_starters",
  );
  const sourceBackedFirstTimeVisitorStarters = getSourceBackedPlaces(
    data,
    "vancouver_first_time_visitor_starters",
  );
  const sourceBackedGardenDayStarters = getSourceBackedPlaces(
    data,
    "vancouver_garden_day_starters",
  );
  const sourceBackedKitsilanoScenicStarters = getSourceBackedPlaces(
    data,
    "vancouver_kitsilano_scenic_starters",
  );
  const sourceBackedWestSideDaytimeStarters = getSourceBackedPlaces(
    data,
    "vancouver_west_side_daytime_starters",
  );
  const sourceBackedFalseCreekCultureStarters = getSourceBackedPlaces(
    data,
    "vancouver_false_creek_culture_starters",
  );
  const sourceBackedUbcDiscoveryStarters = getSourceBackedPlaces(
    data,
    "vancouver_ubc_discovery_starters",
  );
  const sourceBackedReturningVisitorStarters = getSourceBackedPlaces(
    data,
    "vancouver_returning_visitor_starters",
  );
  const sourceBackedOutOfTownGuestStarters = getSourceBackedPlaces(
    data,
    "vancouver_out_of_town_guest_starters",
  );
  const sourceBackedWeekendRouteStarters = getSourceBackedPlaces(
    data,
    "vancouver_weekend_route_starters",
  );
  const sourceBackedSundayStarters = getSourceBackedPlaces(data, "vancouver_sunday_starters");
  const sourceBackedWellnessResetStarters = getSourceBackedPlaces(
    data,
    "vancouver_wellness_reset_starters",
  );

  const businesses = useMemo(() => {
    return data.businesses.filter((business) => {
      const haystack = [
        business.name,
        business.category,
        business.neighborhood,
        business.shortDescription,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesCategory = category === "All" || business.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, data.businesses, query]);

  return (
    <>
      <section className="city-hero">
        <div>
          <p className="section-label">{siteConfig.city}</p>
          <h1>Explore Vancouver with routes, guides, and local planning logic</h1>
          <p>
            Search places, events, offers, and guides. CityAtlas is designed to help people choose
            a better next move, not just browse a pile of city listings. Today the clearest public
            coverage lives in the source-backed guides and starter pages, while the wider Vancouver
            business map is being surfaced through route-first coverage.
          </p>
        </div>
        <div className="city-search-panel">
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cafes, wellness, date night..."
            aria-label="Search CityAtlas"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter category"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>

      {neighborhoodGuides.length > 0 ? (
        <section className="section-block">
          <SectionHeader
            label="Neighborhood starters"
            title="Choose the right area before you browse place pages"
            copy="CityAtlas is strongest when it helps someone choose the right part of Vancouver first, then decide what kind of route belongs there. The current starter trio covers Gastown, Mount Pleasant, and Kitsilano."
            action={<StatusPill tone="blue">Neighborhood guides</StatusPill>}
          />
          <div className="card-grid two">
            {(neighborhoodStarterGuides.length > 0 ? neighborhoodStarterGuides : neighborhoodGuides)
              .slice(0, 4)
              .map((guide) => (
              <GuideCard guide={guide} key={guide.id} />
            ))}
          </div>
        </section>
      ) : null}

      {sourceBackedDateNightStarters.length > 0 ||
      sourceBackedRainyDayStarters.length > 0 ||
      sourceBackedFirstEveningStarters.length > 0 ||
      sourceBackedFirstTimeVisitorStarters.length > 0 ||
      sourceBackedGardenDayStarters.length > 0 ||
      sourceBackedKitsilanoScenicStarters.length > 0 ||
      sourceBackedWestSideDaytimeStarters.length > 0 ||
      sourceBackedFalseCreekCultureStarters.length > 0 ||
      sourceBackedUbcDiscoveryStarters.length > 0 ||
      sourceBackedReturningVisitorStarters.length > 0 ||
      sourceBackedOutOfTownGuestStarters.length > 0 ||
      sourceBackedWeekendRouteStarters.length > 0 ||
      sourceBackedSundayStarters.length > 0 ||
      sourceBackedWellnessResetStarters.length > 0 ? (
        <section className="split-section">
          <div className="source-panel">
            <SectionHeader
              label="Official-source starters"
              title="Source-backed starters for real Vancouver anchors"
              copy="If you want CityAtlas pages that name real Vancouver anchors today, start with the official-source starter pages before fuller public business pages."
              action={
                <StatusPill tone="green">
                  {sourceBackedDateNightStarters.length +
                    sourceBackedRainyDayStarters.length +
                    sourceBackedFirstEveningStarters.length +
                    sourceBackedFirstTimeVisitorStarters.length +
                    sourceBackedGardenDayStarters.length +
                    sourceBackedKitsilanoScenicStarters.length +
                    sourceBackedWestSideDaytimeStarters.length +
                    sourceBackedFalseCreekCultureStarters.length +
                    sourceBackedUbcDiscoveryStarters.length +
                    sourceBackedReturningVisitorStarters.length +
                    sourceBackedOutOfTownGuestStarters.length +
                    sourceBackedWeekendRouteStarters.length +
                    sourceBackedSundayStarters.length +
                    sourceBackedWellnessResetStarters.length}{" "}
                  source-backed entries
                </StatusPill>
              }
            />
          </div>
          <div className="source-panel">
            <p>
              This public layer is intentionally narrow. It links straight to official venue
              sources, explains route fit, and points people toward the correction path instead of
              pretending the whole Vancouver directory is already verified.
            </p>
            <div className="hero-actions">
              <AppLink className="button primary" to="/vancouver/date-night-starters">
                Open date-night starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/rainy-day-starters">
                Open rainy-day starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/first-evening-starters">
                Open first-evening starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/first-time-visitor-starters">
                Open first-time visitor starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/garden-day-starters">
                Open garden day starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/kitsilano-scenic-starters">
                Open Kitsilano scenic starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/west-side-daytime-starters">
                Open west-side daytime starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/false-creek-culture-starters">
                Open False Creek culture starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/ubc-discovery-starters">
                Open UBC discovery starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/returning-visitor-starters">
                Open returning-visitor starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/out-of-town-guest-starters">
                Open out-of-town guest starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/weekend-route-starters">
                Open weekend route starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/sunday-starters">
                Open Sunday starters
              </AppLink>
              <AppLink className="button secondary" to="/vancouver/wellness-reset-starters">
                Open wellness reset starters
              </AppLink>
              <AppLink
                className="button secondary"
                to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first"
              >
                Open starter pack guide
              </AppLink>
              <AppLink
                className="button secondary"
                to="/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation"
              >
                Open guide roundup
              </AppLink>
              <AppLink
                className="button secondary"
                to="/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today"
              >
                Open low-friction guide
              </AppLink>
              <AppLink className="button secondary" to="/editorial-standards">
                Review standards
              </AppLink>
            </div>
          </div>
        </section>
      ) : null}

      <VancouverBusinessCoverageSection data={data} variant="city" />

      <section className="section-block">
        <SectionHeader
          title={`${businesses.length} current business page examples`}
          copy="These example cards show how fuller reviewed Vancouver business pages can look once facts, media, and participation details are stronger."
          action={<StatusPill tone="amber">Example pages</StatusPill>}
        />
        <div className="card-grid three">
          {businesses.map((business) => (
            <BusinessCard business={business} key={business.id} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          title="City missions"
          copy="Short saveable routes help CityAtlas move from browsing into a clearer next step."
          action={<StatusPill tone="blue">{data.cityMissions.length} routes</StatusPill>}
        />
        <div className="card-grid three">
          {data.cityMissions.map((mission) => (
            <MissionCard
              mission={mission}
              savedItems={data.savedItems}
              onSaveMission={onSaveMission}
              key={mission.id}
            />
          ))}
        </div>
      </section>

      <section className="split-section">
        <div>
          <SectionHeader title="Event examples" copy="These example cards show how CityAtlas can package event coverage. Confirm live details with hosts or official sources." />
          <div className="stacked-list">
            {data.events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            title="Perk examples"
            copy="These example cards show how CityAtlas can package partner perks once the business confirms the details and redemption rules."
          />
          <div className="stacked-list">
            {data.offers.map((offer) => (
              <OfferCard
                offer={offer}
                business={data.businesses.find((business) => business.id === offer.businessId)}
                key={offer.id}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="Guides" copy="Editorial pages connect city questions to neighborhood fit, route logic, and clearer next steps." />
        <div className="card-grid two">
          {cityGuides.map((guide) => (
            <GuideCard guide={guide} key={guide.id} />
          ))}
        </div>
      </section>
    </>
  );
}
