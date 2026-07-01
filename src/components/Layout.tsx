import type { ReactNode } from "react";
import { siteConfig } from "../config/site";
import { AnalyticsConsentBanner } from "./AnalyticsConsent";
import { AppLink } from "./Link";
import { CityAtlasMarkIcon, SearchIcon } from "./Icons";

interface LayoutProps {
  children: ReactNode;
  path: string;
}

function navClass(path: string, target: string) {
  return path === target || (target !== "/" && path.startsWith(target))
    ? "nav-link active"
    : "nav-link";
}

export function PublicLayout({ children, path }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <AppLink to="/" className="brand-mark" aria-label="CityAtlas home">
          <span className="brand-symbol cityatlas-symbol">
            <CityAtlasMarkIcon />
          </span>
          <span>
            <strong>{siteConfig.name}</strong>
            <small>{siteConfig.tagline}</small>
          </span>
        </AppLink>

        <nav className="site-nav" aria-label="Primary">
          <AppLink to="/vancouver" className={navClass(path, "/vancouver")}>
            Explore
          </AppLink>
          <AppLink to="/about" className={navClass(path, "/about")}>
            About
          </AppLink>
          <AppLink to="/vancouver/guides" className={navClass(path, "/vancouver/guides")}>
            Guides
          </AppLink>
          <AppLink
            to="/vancouver/date-night-starters"
            className={navClass(path, "/vancouver/date-night-starters")}
          >
            Starters
          </AppLink>
          <AppLink to="/vancouver/missions" className={navClass(path, "/vancouver/missions")}>
            Missions
          </AppLink>
          <AppLink to="/planner" className={navClass(path, "/planner")}>
            Planner
          </AppLink>
          <AppLink to="/for-businesses/pricing" className={navClass(path, "/for-businesses")}>
            For businesses
          </AppLink>
        </nav>

        <div className="header-actions">
          <div className="header-search" aria-label="Search">
            <SearchIcon />
            <span>Search Vancouver plans</span>
          </div>
        </div>
      </header>

      <main>{children}</main>
      <AnalyticsConsentBanner path={path} />

      <footer className="site-footer">
        <div>
          <strong>{siteConfig.name}</strong>
          <p>
            Vancouver-first guides, route starters, and local discovery pages built around clearer
            planning help, official public sources where needed, and visible correction paths.
          </p>
        </div>
        <div className="footer-links">
          <AppLink to="/about">About CityAtlas</AppLink>
          <AppLink to="/vancouver/guides">Guide library</AppLink>
          <AppLink to="/toronto/guides">Toronto preview</AppLink>
          <AppLink to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first">
            Starter pack guide
          </AppLink>
          <AppLink to="/vancouver/date-night-starters">Date night starters</AppLink>
          <AppLink to="/vancouver/rainy-day-starters">Rainy-day starters</AppLink>
          <AppLink to="/vancouver/first-evening-starters">First-evening starters</AppLink>
          <AppLink to="/vancouver/first-time-visitor-starters">
            First-time visitor starters
          </AppLink>
          <AppLink to="/vancouver/returning-visitor-starters">
            Returning-visitor starters
          </AppLink>
          <AppLink to="/vancouver/out-of-town-guest-starters">
            Out-of-town guest starters
          </AppLink>
          <AppLink to="/vancouver/weekend-route-starters">Weekend route starters</AppLink>
          <AppLink to="/vancouver/sunday-starters">Sunday starters</AppLink>
          <AppLink to="/vancouver/wellness-reset-starters">Wellness reset starters</AppLink>
          <AppLink to="/toronto/first-time-visitor-starters">Toronto visitor starters</AppLink>
          <AppLink to="/toronto/weekend-route-starters">Toronto weekend starters</AppLink>
          <AppLink to="/vancouver">Vancouver discovery</AppLink>
          <AppLink to="/for-businesses/submit">Submit a business</AppLink>
          <AppLink to="/for-businesses/pricing">Partner packages</AppLink>
          <AppLink to="/for-businesses/partner-preview">Partner preview</AppLink>
          <AppLink to="/vancouver/missions">City missions</AppLink>
          <AppLink to="/planner">Planner</AppLink>
          <AppLink to="/editorial-standards">Editorial standards</AppLink>
          <AppLink to="/terms">Terms</AppLink>
          <AppLink to="/privacy">Privacy</AppLink>
        </div>
      </footer>
    </div>
  );
}
