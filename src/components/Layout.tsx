import type { ReactNode } from "react";
import { siteConfig } from "../config/site";
import { AppLink } from "./Link";
import { CityAtlasMarkIcon, SearchIcon } from "./Icons";

const footerGroups = [
  {
    title: "Start here",
    links: [
      { to: "/vancouver/guides", label: "Guide library" },
      {
        to: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
        label: "Where to start guide",
      },
      { to: "/vancouver", label: "Vancouver discovery" },
      { to: "/vancouver/missions", label: "Saved plans" },
      { to: "/planner", label: "Planner" },
    ],
  },
  {
    title: "Vancouver",
    links: [
      { to: "/vancouver/date-night-starters", label: "Date night" },
      { to: "/vancouver/rainy-day-starters", label: "Rainy day" },
      { to: "/vancouver/first-evening-starters", label: "First evening" },
      { to: "/vancouver/first-time-visitor-starters", label: "First visit" },
      { to: "/vancouver/returning-visitor-starters", label: "Returning visit" },
      { to: "/vancouver/out-of-town-guest-starters", label: "Hosting guests" },
      { to: "/vancouver/weekend-route-starters", label: "Weekend route" },
      { to: "/vancouver/sunday-starters", label: "Sunday plan" },
      { to: "/vancouver/wellness-reset-starters", label: "Wellness reset" },
    ],
  },
  {
    title: "More cities",
    links: [
      { to: "/toronto/guides", label: "Toronto guides" },
      { to: "/toronto/first-time-visitor-starters", label: "Toronto first visit" },
      { to: "/toronto/weekend-route-starters", label: "Toronto weekend" },
    ],
  },
  {
    title: "Business and trust",
    links: [
      { to: "/about", label: "About CityAtlas" },
      { to: "/for-businesses/submit", label: "Submit a business" },
      { to: "/for-businesses/pricing", label: "Business packages" },
      { to: "/editorial-standards", label: "Editorial standards" },
      { to: "/terms", label: "Terms" },
      { to: "/privacy", label: "Privacy" },
    ],
  },
] as const;

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
            Start here
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
        <div className="footer-brand">
          <strong>{siteConfig.name}</strong>
          <p>
            Vancouver plans, neighborhood guides, and local picks that help you decide what to do
            next faster.
          </p>
        </div>
        <div className="footer-groups">
          {footerGroups.map((group) => (
            <div className="footer-group" key={group.title}>
              <strong>{group.title}</strong>
              <div className="footer-links">
                {group.links.map((link) => (
                  <AppLink key={link.to} to={link.to}>
                    {link.label}
                  </AppLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
