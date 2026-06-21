import { Suspense, lazy, useEffect, useMemo } from "react";
import type { ComponentType } from "react";
import { AppLink } from "../components/Link";
import { PublicLayout } from "../components/Layout";
import { SeoManager } from "../components/Seo";
import { LockIcon, ShieldIcon } from "../components/Icons";
import { parseGuideHubPath, parseGuidePath } from "../lib/cityPaths";
import {
  canShowHostedAdmin,
  canShowHostedPrivatePreview,
  siteConfig,
} from "../config/site";
import { getSourceBackedCollectionForPath } from "../lib/sourceBackedCollections";
import { usePathname } from "./router";
import { useCityAtlasStore } from "./useCityAtlasStore";

function lazyNamed<TModule extends Record<string, unknown>>(
  load: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  return lazy(async () => {
    const module = await load();
    return { default: module[exportName] as ComponentType<any> };
  });
}

const loadPricingPage = () => import("../features/business/PricingPage");
const loadSubmitBusinessPage = () => import("../features/business/SubmitBusinessPage");
const loadLegalPages = () => import("../features/legal/LegalPages");
const loadAboutPage = () => import("../features/public/AboutPage");
const loadBusinessPage = () => import("../features/public/BusinessPage");
const loadCityPage = () => import("../features/public/CityPage");
const loadCollectionPages = () => import("../features/public/CollectionPages");
const loadGuideDetailPage = () => import("../features/public/GuideDetailPage");
const loadHomePage = () => import("../features/public/HomePage");
const loadMissionsPage = () => import("../features/public/MissionsPage");
const loadPlannerPage = () => import("../features/public/PlannerPage");
const loadSecondaryCityGuidesPage = () => import("../features/public/SecondaryCityGuidesPage");
const loadTrustPages = () => import("../features/public/TrustPages");
const loadAdminConsole = () => import("../features/admin/AdminConsole");
const loadDateNightPreviewPage = () => import("../features/private/DateNightPreviewPage");

const PricingPage = lazyNamed(loadPricingPage, "PricingPage");
const SubmitBusinessPage = lazyNamed(loadSubmitBusinessPage, "SubmitBusinessPage");
const PrivacyPage = lazyNamed(loadLegalPages, "PrivacyPage");
const TermsPage = lazyNamed(loadLegalPages, "TermsPage");
const AboutPage = lazyNamed(loadAboutPage, "AboutPage");
const BusinessPage = lazyNamed(loadBusinessPage, "BusinessPage");
const CityPage = lazyNamed(loadCityPage, "CityPage");
const EventsPage = lazyNamed(loadCollectionPages, "EventsPage");
const GuidesPage = lazyNamed(loadCollectionPages, "GuidesPage");
const OffersPage = lazyNamed(loadCollectionPages, "OffersPage");
const GuideDetailPage = lazyNamed(loadGuideDetailPage, "GuideDetailPage");
const HomePage = lazyNamed(loadHomePage, "HomePage");
const MissionsPage = lazyNamed(loadMissionsPage, "MissionsPage");
const PlannerPage = lazyNamed(loadPlannerPage, "PlannerPage");
const SecondaryCityGuidesPage = lazyNamed(loadSecondaryCityGuidesPage, "SecondaryCityGuidesPage");
const DateNightStartersPage = lazyNamed(loadTrustPages, "DateNightStartersPage");
const EditorialStandardsPage = lazyNamed(loadTrustPages, "EditorialStandardsPage");
const FalseCreekCultureStartersPage = lazyNamed(loadTrustPages, "FalseCreekCultureStartersPage");
const FirstEveningStartersPage = lazyNamed(loadTrustPages, "FirstEveningStartersPage");
const FirstTimeVisitorStartersPage = lazyNamed(loadTrustPages, "FirstTimeVisitorStartersPage");
const GardenDayStartersPage = lazyNamed(loadTrustPages, "GardenDayStartersPage");
const KitsilanoScenicStartersPage = lazyNamed(loadTrustPages, "KitsilanoScenicStartersPage");
const OutOfTownGuestStartersPage = lazyNamed(loadTrustPages, "OutOfTownGuestStartersPage");
const RainyDayStartersPage = lazyNamed(loadTrustPages, "RainyDayStartersPage");
const ReturningVisitorStartersPage = lazyNamed(loadTrustPages, "ReturningVisitorStartersPage");
const SundayStartersPage = lazyNamed(loadTrustPages, "SundayStartersPage");
const UbcDiscoveryStartersPage = lazyNamed(loadTrustPages, "UbcDiscoveryStartersPage");
const WeekendRouteStartersPage = lazyNamed(loadTrustPages, "WeekendRouteStartersPage");
const WestSideDaytimeStartersPage = lazyNamed(loadTrustPages, "WestSideDaytimeStartersPage");
const WellnessResetStartersPage = lazyNamed(loadTrustPages, "WellnessResetStartersPage");
const SourceBackedCollectionPage = lazyNamed(loadTrustPages, "SourceBackedCollectionPage");
const AdminConsole = lazyNamed(loadAdminConsole, "AdminConsole");
const DateNightPreviewPage = lazyNamed(loadDateNightPreviewPage, "DateNightPreviewPage");

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
  const waitingForProtectedAdminData = path === "/admin" && !growthHydrated;

  useEffect(() => {
    if (!hydrated) return;
    actions.trackEvent("page_view", { path });
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
          onSaveMission={actions.saveMission}
          onTrack={actions.trackEvent}
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
    if (path === `/${siteConfig.citySlug}/missions`) {
      return <MissionsPage data={data} onSaveMission={actions.saveMission} />;
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
    if (path === "/for-businesses/submit") {
      return (
        <SubmitBusinessPage
          data={data}
          onSubmitBusiness={actions.addBusinessSubmission}
          onTrack={actions.trackEvent}
        />
      );
    }
    if (path === "/private-preview/date-night") {
      if (!canShowHostedPrivatePreview()) {
        return (
          <ProtectedRouteNotice
            label="Protected page"
            title="This page is only available inside a protected sharing flow."
            copy="It includes planning material that is shared selectively, so it stays outside the public CityAtlas experience."
          />
        );
      }
      return <DateNightPreviewPage data={data} onTrack={actions.trackEvent} />;
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
      if (!canShowHostedAdmin()) {
        return (
          <ProtectedRouteNotice
            label="Protected operations page"
            title="This page is only available inside the protected CityAtlas workspace."
            copy="Business reviews, partner notes, and operations data are handled in a protected workspace, so this page stays outside the public experience."
          />
        );
      }
      return (
        <AdminConsole
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
          onResetDemo={actions.resetDemo}
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
      <Suspense fallback={<RouteLoading />}>{route}</Suspense>
    </PublicLayout>
  );
}
