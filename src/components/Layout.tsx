import type { ReactNode } from "react";
import { siteConfig } from "../config/site";
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
            Best places
          </AppLink>
          <AppLink to="/vancouver/missions" className={navClass(path, "/vancouver/missions")}>
            Saved plans
          </AppLink>
          <AppLink to="/planner" className={navClass(path, "/planner")}>
            Planner
          </AppLink>
          <AppLink to="/for-businesses/pricing" className={navClass(path, "/for-businesses")}>
            For businesses
          </AppLink>
        </nav>

        <div className="header-actions">
          <AppLink className="header-search" aria-label="Search Vancouver plans" to="/vancouver">
            <SearchIcon />
            <span>Search Vancouver plans</span>
          </AppLink>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div>
          <strong>{siteConfig.name}</strong>
          <p>
            Vancouver plans, neighborhood guides, and local picks that help you decide what to do
            next faster.
          </p>
        </div>
        <div className="footer-links">
          <AppLink to="/about">About CityAtlas</AppLink>
          <AppLink to="/vancouver/guides">Guide library</AppLink>
          <AppLink to="/toronto/guides">Toronto preview</AppLink>
          <AppLink to="/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first">
            Where to start guide
          </AppLink>
          <AppLink to="/vancouver/date-night-starters">Date night</AppLink>
          <AppLink to="/vancouver/rainy-day-starters">Rainy day</AppLink>
          <AppLink to="/vancouver/first-evening-starters">First evening</AppLink>
          <AppLink to="/vancouver/first-time-visitor-starters">
            First visit
          </AppLink>
          <AppLink to="/vancouver/returning-visitor-starters">
            Returning visit
          </AppLink>
          <AppLink to="/vancouver/out-of-town-guest-starters">
            Hosting guests
          </AppLink>
          <AppLink to="/vancouver/weekend-route-starters">Weekend route</AppLink>
          <AppLink to="/vancouver/sunday-starters">Sunday plan</AppLink>
          <AppLink to="/vancouver/wellness-reset-starters">Wellness reset</AppLink>
          <AppLink to="/toronto/first-time-visitor-starters">Toronto first visit</AppLink>
          <AppLink to="/toronto/weekend-route-starters">Toronto weekend</AppLink>
          <AppLink to="/vancouver">Vancouver discovery</AppLink>
          <AppLink to="/for-businesses/submit">Submit a business</AppLink>
          <AppLink to="/for-businesses/pricing">Business packages</AppLink>
          <AppLink to="/vancouver/missions">Saved plans</AppLink>
          <AppLink to="/planner">Planner</AppLink>
          <AppLink to="/editorial-standards">Editorial standards</AppLink>
          <AppLink to="/terms">Terms</AppLink>
          <AppLink to="/privacy">Privacy</AppLink>
        </div>
      </footer>
    </div>
  );
}
