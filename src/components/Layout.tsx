import { useEffect, useState, type ReactNode } from "react";
import { siteConfig } from "../config/site";
import { AnalyticsConsentBanner } from "./AnalyticsConsent";
import { AppLink } from "./Link";
import { CityAtlasMarkIcon, CloseIcon, MenuIcon, SearchIcon } from "./Icons";

const footerGroups = [
  {
    title: "Start with Vancouver",
    note: "Best first pages, saved plans, and the planner.",
    links: [
      { to: "/vancouver/guides", label: "Vancouver guides" },
      {
        to: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
        label: "Start with Vancouver",
      },
      { to: "/vancouver", label: "Explore Vancouver" },
      { to: "/vancouver/missions", label: "Saved plans" },
      { to: "/planner", label: "Planner" },
    ],
  },
  {
    title: "Plan types",
    note: "Choose the shape of the day before you choose a place.",
    links: [
      { to: "/vancouver/date-night-starters", label: "Date night" },
      { to: "/vancouver/rainy-day-starters", label: "Rainy day" },
      { to: "/vancouver/first-time-visitor-starters", label: "First visit" },
      { to: "/vancouver/out-of-town-guest-starters", label: "Hosting guests" },
      { to: "/vancouver/weekend-route-starters", label: "Weekend plan" },
      { to: "/vancouver/wellness-reset-starters", label: "Wellness reset" },
    ],
  },
  {
    title: "Next city preview",
    note: "The first repeatable pack beyond Vancouver.",
    links: [
      { to: "/toronto/guides", label: "Toronto guides" },
      { to: "/toronto/first-time-visitor-starters", label: "Toronto first visit" },
      { to: "/toronto/weekend-route-starters", label: "Toronto weekend" },
    ],
  },
  {
    title: "Trust and business",
    note: "How CityAtlas labels pages and how businesses apply.",
    links: [
      { to: "/about", label: "About CityAtlas" },
      { to: "/for-businesses/submit", label: "Submit a business" },
      { to: "/for-businesses/pricing", label: "Business packages" },
      { to: "/editorial-standards", label: "Editorial standards" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [path]);

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

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

        <nav
          className={mobileNavOpen ? "site-nav open" : "site-nav"}
          id="primary-nav"
          aria-label="Primary"
        >
          <AppLink to="/vancouver" className={navClass(path, "/vancouver")} onClick={closeMobileNav}>
            Explore
          </AppLink>
          <AppLink to="/about" className={navClass(path, "/about")} onClick={closeMobileNav}>
            About
          </AppLink>
          <AppLink
            to="/vancouver/guides"
            className={navClass(path, "/vancouver/guides")}
            onClick={closeMobileNav}
          >
            Guides
          </AppLink>
          <AppLink
            to="/vancouver/date-night-starters"
            className={navClass(path, "/vancouver/date-night-starters")}
            onClick={closeMobileNav}
          >
            Start here
          </AppLink>
          <AppLink
            to="/vancouver/missions"
            className={navClass(path, "/vancouver/missions")}
            onClick={closeMobileNav}
          >
            Saved plans
          </AppLink>
          <AppLink to="/planner" className={navClass(path, "/planner")} onClick={closeMobileNav}>
            Planner
          </AppLink>
          <AppLink
            to="/for-businesses/pricing"
            className={navClass(path, "/for-businesses")}
            onClick={closeMobileNav}
          >
            For businesses
          </AppLink>
        </nav>

        <div className="header-actions">
          <AppLink className="header-search" aria-label="Search Vancouver plans" to="/vancouver">
            <SearchIcon />
            <span>Search Vancouver</span>
          </AppLink>
          <button
            aria-controls="primary-nav"
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            className="icon-button mobile-nav-toggle"
            onClick={() => setMobileNavOpen((current) => !current)}
            type="button"
          >
            {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      <main>{children}</main>
      <AnalyticsConsentBanner path={path} />

      <footer className="site-footer">
        <div className="footer-intro">
          <div className="footer-brand-lockup">
            <span className="footer-brand-symbol cityatlas-symbol" aria-hidden="true">
              <CityAtlasMarkIcon />
            </span>
            <div className="footer-brand-copy">
              <small>Clear city guidance</small>
              <strong>{siteConfig.name}</strong>
            </div>
          </div>
          <p>
            Use CityAtlas when you know the kind of day you want, but not the best first page yet.
          </p>
          <div className="footer-action-row">
            <AppLink className="button primary" to="/vancouver/guides">
              Open Vancouver guides
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/submit">
              Start business request
            </AppLink>
          </div>
          <div className="footer-feature-grid">
            <AppLink className="footer-feature-card" to="/vancouver/guides">
              <small>Need a first answer?</small>
              <strong>Start with one guide</strong>
              <span>Open the clearest first page for the day, then go deeper only when it helps.</span>
            </AppLink>
            <AppLink
              className="footer-feature-card footer-feature-card-accent"
              to="/vancouver/date-night-starters"
            >
              <small>Need real places?</small>
              <strong>Open local places</strong>
              <span>Use local places when the next step is a real stop, not more planning copy.</span>
            </AppLink>
          </div>
        </div>
        <div className="footer-groups">
          {footerGroups.map((group) => (
            <div className="footer-group" key={group.title}>
              <strong>{group.title}</strong>
              <span className="footer-group-note">{group.note}</span>
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
