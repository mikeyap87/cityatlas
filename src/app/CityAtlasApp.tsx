import { useEffect, useMemo } from "react";
import { AppLink } from "../components/Link";
import { PublicLayout } from "../components/Layout";
import { SeoManager } from "../components/Seo";
import { LockIcon, ShieldIcon } from "../components/Icons";
import { AdminConsole } from "../features/admin/AdminConsole";
import { AdminConsole as AdminConsoleDisabled } from "../features/admin/AdminConsoleDisabled";
import { BookCallPage } from "../features/business/BookCallPage";
import { PartnerPreviewPage } from "../features/business/PartnerPreviewPage";
import { PricingPage } from "../features/business/PricingPage";
import { SubmitBusinessPage } from "../features/business/SubmitBusinessPage";
import { PrivacyPage, TermsPage } from "../features/legal/LegalPages";
import { DateNightPreviewPage } from "../features/private/DateNightPreviewPage";
import { DateNightPreviewPage as DateNightPreviewDisabled } from "../features/private/DateNightPreviewDisabled";
import { AboutPage } from "../features/public/AboutPage";
import { BusinessPage } from "../features/public/BusinessPage";
import { CityPage } from "../features/public/CityPage";
import { EventsPage, GuidesPage, OffersPage } from "../features/public/CollectionPages";
import { GuideDetailPage } from "../features/public/GuideDetailPage";
import { HomePage } from "../features/public/HomePage";
import { MissionsPage } from "../features/public/MissionsPage";
import { PlannerPage } from "../features/public/PlannerPage";
import { SecondaryCityGuidesPage } from "../features/public/SecondaryCityGuidesPage";
import {
  DateNightStartersPage,
  EditorialStandardsPage,
  FalseCreekCultureStartersPage,
  FirstEveningStartersPage,
  FirstTimeVisitorStartersPage,
  GardenDayStartersPage,
  KitsilanoScenicStartersPage,
  OutOfTownGuestStartersPage,
  RainyDayStartersPage,
  ReturningVisitorStartersPage,
  SourceBackedCollectionPage,
  SundayStartersPage,
  UbcDiscoveryStartersPage,
  WeekendRouteStartersPage,
  WellnessResetStartersPage,
  WestSideDaytimeStartersPage,
} from "../features/public/TrustPages";
import { parseGuideHubPath, parseGuidePath } from "../lib/cityPaths";
import { consumePendingNavigationEvent } from "../lib/analytics";
import {
  buildFlags,
  canRenderAdminExperience,
  canRenderPrivatePreviewExperience,
  siteConfig,
} from "../config/site";
import { getMissionCitySlug } from "../lib/missions";
import { getSourceBackedCollectionForPath } from "../lib/sourceBackedCollections";
import { usePathname } from "./router";
import { useCityAtlasStore } from "./useCityAtlasStore";
const ActiveAdminConsole = buildFlags.hostedAdminArtifacts ? AdminConsole : AdminConsoleDisabled;
const ActiveDateNightPreviewPage = buildFlags.hostedPrivatePreviewArtifacts
  ? DateNightPreviewPage
  : DateNightPreviewDisabled;

function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="section-label">Route not found</p>
      <h1>CityAtlas does not have that page yet.</h1>
      <p>
        Try one of the Vancouver guides, neighborhood starting pages, business pages, or saved plans
        instead.
      </p>
      <div className="hero-actions">
        <AppLink className="button primary" to="/vancouver/guides">
          Open Vancouver guides
        </AppLink>
        <AppLink className="button secondary" to="/">
          Back to homepage
        </AppLink>
      </div>
      <div className="guide-query-grid">
        <AppLink className="query-card query-card-link" to="/vancouver">
          <strong>Start with Vancouver</strong>
          <p>Use the city page when you know the kind of day you want, but not the exact place yet.</p>
        </AppLink>
        <AppLink className="query-card query-card-link" to="/vancouver/missions">
          <strong>Saved plans</strong>
          <p>Open reusable Vancouver plans when the next step is saving or reusing a plan instead of browsing.</p>
        </AppLink>
        <AppLink className="query-card query-card-link" to="/for-businesses/pricing">
          <strong>For businesses</strong>
          <p>Open the business path when the real goal is a clearer page, offer, or guide fit.</p>
        </AppLink>
      </div>
    </section>
  );
}

function RouteLoading() {
  return (
    <section className="route-loading">
      <div className="route-loading-card">
        <p className="section-label">Opening page</p>
        <strong>Loading CityAtlas</strong>
        <p>Pulling the next page into place.</p>
      </div>
    </section>
  );
}

function ProtectedRouteNotice({
  label,
  title,
  copy,
}: {
  label: string;
  title: string;
  copy: string;
}) {
  return (
    <section className="protected-route-notice">
      <div className="protected-route-icon">
        <ShieldIcon />
      </div>
      <p className="section-label">{label}</p>
      <h1>{title}</h1>
      <p>{copy}</p>
      <ul>
        <li><LockIcon /> Partner operations stay inside the protected CityAtlas workspace.</li>
        <li><LockIcon /> Packages, perks, and outreach open only after review.</li>
        <li><LockIcon /> Public CityAtlas pages focus on guides, neighborhoods, and clear local plans.</li>
      </ul>
      <div className="button-row">
        <AppLink className="button primary" to="/">
          Public site
        </AppLink>
        <AppLink className="button secondary" to="/terms">
          Review terms
        </AppLink>
      </div>
    </section>
  );
}

export function CityAtlasApp() {
  const path = usePathname();
  const { data, actions, hydrated, growthHydrated } = useCityAtlasStore(path);
  const collectionRoute = getSourceBackedCollectionForPath(path);
  const guidePath = parseGuidePath(path);
  const guideHubPath = parseGuideHubPath(path);
  const missionHubMatch = path.match(/^\/([^/]+)\/missions$/);
  const waitingForProtectedAdminData =
    path === "/admin" && buildFlags.hostedAdminArtifacts && !growthHydrated;

  useEffect(() => {
    if (!hydrated) return;
    actions.trackEvent("page_view", { path });
    const pendingNavigationEvent = consumePendingNavigationEvent();
    if (pendingNavigationEvent) {
      actions.trackEvent(pendingNavigationEvent.name, pendingNavigationEvent.detail);
    }
  }, [actions, hydrated, path]);

  const route = useMemo(() => {
    if (path === "/") {
      return (
        <HomePage
          data={data}
          onNewsletter={actions.addNewsletterLead}
          onTrack={actions.trackEvent}
          onSaveMission={actions.saveMission}
        />
      );
    }
    if (path === "/planner") {
      return (
        <PlannerPage
          data={data}
          onToggleSave={actions.toggleSave}
          onMoveSavedItem={actions.moveSavedItem}
          onSaveMission={actions.saveMission}
          onTrack={actions.trackEvent}
          onSetMissionTravelMode={actions.setMissionTravelMode}
          onSetMissionStartTime={actions.setMissionStartTime}
          onSetMissionStepStatus={actions.setMissionStepStatus}
          onAddMissionFeedback={actions.addMissionFeedback}
          onResetMissionProgress={actions.resetMissionProgress}
        />
      );
    }
    if (path === "/about") {
      return <AboutPage />;
    }
    if (path === `/${siteConfig.citySlug}`) {
      return <CityPage data={data} onSaveMission={actions.saveMission} />;
    }
    if (path === `/${siteConfig.citySlug}/events`) {
      return <EventsPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/offers`) {
      return <OffersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/guides`) {
      return <GuidesPage data={data} />;
    }
    if (guideHubPath && guideHubPath.citySlug !== siteConfig.citySlug) {
      const hasCityGuides = data.guides.some((guide) => guide.citySlug === guideHubPath.citySlug);
      if (hasCityGuides) {
        return <SecondaryCityGuidesPage citySlug={guideHubPath.citySlug} data={data} />;
      }
    }
    if (collectionRoute) {
      return <SourceBackedCollectionPage data={data} collection={collectionRoute} />;
    }
    if (path === `/${siteConfig.citySlug}/date-night-starters`) {
      return <DateNightStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/rainy-day-starters`) {
      return <RainyDayStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/first-evening-starters`) {
      return <FirstEveningStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/first-time-visitor-starters`) {
      return <FirstTimeVisitorStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/garden-day-starters`) {
      return <GardenDayStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/kitsilano-scenic-starters`) {
      return <KitsilanoScenicStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/west-side-daytime-starters`) {
      return <WestSideDaytimeStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/false-creek-culture-starters`) {
      return <FalseCreekCultureStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/ubc-discovery-starters`) {
      return <UbcDiscoveryStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/returning-visitor-starters`) {
      return <ReturningVisitorStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/out-of-town-guest-starters`) {
      return <OutOfTownGuestStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/weekend-route-starters`) {
      return <WeekendRouteStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/sunday-starters`) {
      return <SundayStartersPage data={data} />;
    }
    if (path === `/${siteConfig.citySlug}/wellness-reset-starters`) {
      return <WellnessResetStartersPage data={data} />;
    }
    if (guidePath) {
      return (
        <GuideDetailPage
          data={data}
          guide={data.guides.find(
            (guide) =>
              guide.slug === guidePath.slug &&
              (guide.citySlug ?? siteConfig.citySlug) === guidePath.citySlug,
          )}
          guideHubPath={`/${guidePath.citySlug}/guides`}
        />
      );
    }
    if (missionHubMatch) {
      const missionCitySlug = missionHubMatch[1];
      const hasCityMissions = data.cityMissions.some(
        (mission) => getMissionCitySlug(mission) === missionCitySlug,
      );
      if (!hasCityMissions) {
        return <NotFoundPage />;
      }
      return (
        <MissionsPage
          data={data}
          citySlug={missionCitySlug}
          onSaveMission={actions.saveMission}
          onTrack={actions.trackEvent}
          onSetMissionTravelMode={actions.setMissionTravelMode}
          onSetMissionStartTime={actions.setMissionStartTime}
          onSetMissionStepStatus={actions.setMissionStepStatus}
          onAddMissionFeedback={actions.addMissionFeedback}
          onResetMissionProgress={actions.resetMissionProgress}
        />
      );
    }
    if (path.startsWith(`/${siteConfig.citySlug}/businesses/`)) {
      const slug = path.split("/").pop();
      return (
        <BusinessPage
          data={data}
          business={data.businesses.find((business) => business.slug === slug)}
        />
      );
    }
    if (path === "/for-businesses/pricing") {
      return <PricingPage data={data} onTrack={actions.trackEvent} />;
    }
    if (path === "/for-businesses/book-call") {
      return <BookCallPage data={data} onTrack={actions.trackEvent} />;
    }
    if (path === "/for-businesses/partner-preview") {
      return <PartnerPreviewPage data={data} onTrack={actions.trackEvent} />;
    }
    if (path === "/for-businesses/submit") {
      return (
        <SubmitBusinessPage
          data={data}
          path={path}
          onSubmitBusiness={actions.addBusinessSubmission}
          onTrack={actions.trackEvent}
        />
      );
    }
    if (path === "/private-preview/date-night") {
      if (!canRenderPrivatePreviewExperience()) {
        return (
          <ProtectedRouteNotice
            label="Protected page"
            title="This page is only available inside a protected sharing flow."
            copy="It includes planning material that is shared selectively, so it stays outside the public CityAtlas experience."
          />
        );
      }
      return <ActiveDateNightPreviewPage data={data} onTrack={actions.trackEvent} />;
    }
    if (path === "/terms") {
      return <TermsPage />;
    }
    if (path === "/editorial-standards") {
      return <EditorialStandardsPage />;
    }
    if (path === "/privacy") {
      return <PrivacyPage />;
    }
    if (path === "/admin") {
      if (!canRenderAdminExperience()) {
        return (
          <ProtectedRouteNotice
            label="Protected operations page"
            title="This page is only available inside the protected CityAtlas workspace."
            copy="Business reviews, partner notes, and operations data are handled in a protected workspace, so this page stays outside the public experience."
          />
        );
      }
      return (
        <ActiveAdminConsole
          data={data}
          onImportBusinessProspects={actions.addBusinessProspects}
          onSetBusinessProspectSupervisedAllowlist={actions.setBusinessProspectSupervisedAllowlist}
          onMarkBusinessProspectSupervisedDryRunPrepared={
            actions.markBusinessProspectSupervisedDryRunPrepared
          }
          onStageBusinessProspectSupervisedLiveReview={
            actions.stageBusinessProspectSupervisedLiveReview
          }
          onSaveBusinessInboundMirror={actions.saveBusinessInboundMirror}
          onReplayBusinessReplyBridgeEntry={actions.replayBusinessReplyBridgeEntry}
          onLogManualReply={actions.addManualReplyLog}
          onSaveBrainRun={actions.saveBrainRun}
          onMarkGateReady={actions.markGateReady}
          onResetDemo={() => {
            actions.resetDemo();
          }}
        />
      );
    }
    return <NotFoundPage />;
  }, [actions, data, path]);

  if (!hydrated || waitingForProtectedAdminData) {
    return (
      <PublicLayout path={path}>
        <RouteLoading />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout path={path}>
      <SeoManager path={path} data={data} />
      {route}
    </PublicLayout>
  );
}
