import { useEffect, useMemo } from "react";
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
import { AdminConsole } from "../features/admin/AdminConsole";
import { PartnerPreviewPage } from "../features/business/PartnerPreviewPage";
import { PricingPage } from "../features/business/PricingPage";
import { SubmitBusinessPage } from "../features/business/SubmitBusinessPage";
import { PrivacyPage, TermsPage } from "../features/legal/LegalPages";
import { DateNightPreviewPage } from "../features/private/DateNightPreviewPage";
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
  SundayStartersPage,
  UbcDiscoveryStartersPage,
  WeekendRouteStartersPage,
  WestSideDaytimeStartersPage,
  WellnessResetStartersPage,
  SourceBackedCollectionPage,
} from "../features/public/TrustPages";
import { getSourceBackedCollectionForPath } from "../lib/sourceBackedCollections";
import { usePathname } from "./router";
import { useCityAtlasStore } from "./useCityAtlasStore";

function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="section-label">Route not found</p>
      <h1>CityAtlas does not have that page yet.</h1>
      <p>
        Try one of the Vancouver guides, neighborhood starters, business pages, or saved routes
        instead.
      </p>
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
        <li><LockIcon /> Public CityAtlas pages focus on guides, neighborhoods, and routes.</li>
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
  const { data, actions } = useCityAtlasStore();
  const collectionRoute = getSourceBackedCollectionForPath(path);
  const guidePath = parseGuidePath(path);
  const guideHubPath = parseGuideHubPath(path);

  useEffect(() => {
    actions.trackEvent("page_view", { path });
  }, [actions, path]);

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
      return <PricingPage data={data} />;
    }
    if (path === "/for-businesses/partner-preview") {
      return <PartnerPreviewPage data={data} onTrack={actions.trackEvent} />;
    }
    if (path === "/for-businesses/submit") {
      return <SubmitBusinessPage data={data} onSubmitBusiness={actions.addBusinessSubmission} />;
    }
    if (path === "/private-preview/date-night") {
      if (!canShowHostedPrivatePreview()) {
        return (
          <ProtectedRouteNotice
            label="Protected route"
            title="This route is only available inside a protected sharing flow."
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
            label="Protected operations route"
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

  return (
    <PublicLayout path={path}>
      <SeoManager path={path} data={data} />
      {route}
    </PublicLayout>
  );
}
