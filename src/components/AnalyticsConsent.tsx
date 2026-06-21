import { useState } from "react";
import { getAnalyticsConsentState, getAnalyticsReadiness, setAnalyticsConsentState } from "../lib/analytics";
import { CheckIcon, ShieldIcon } from "./Icons";
import { AppLink } from "./Link";

type AnalyticsConsentBannerProps = {
  path: string;
};

export function AnalyticsConsentBanner({ path }: AnalyticsConsentBannerProps) {
  const readiness = getAnalyticsReadiness();
  const [consent, setConsent] = useState(() => getAnalyticsConsentState());
  const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/private-preview");

  if (isProtectedRoute || !readiness.hasExternalDestination || consent !== "pending") {
    return null;
  }

  function chooseConsent(next: "granted" | "denied") {
    setAnalyticsConsentState(next, {
      includePageView: next === "granted",
      path,
    });
    setConsent(next);
  }

  return (
    <aside className="analytics-consent-banner" aria-label="Analytics choice">
      <div className="analytics-consent-copy">
        <span className="analytics-consent-icon" aria-hidden="true">
          <ShieldIcon />
        </span>
        <div>
          <strong>Help CityAtlas measure which paths actually work</strong>
          <p>
            Allow simple visit and business-request analytics on this device. This helps measure which
            guides and business pages earn real interest.
          </p>
        </div>
      </div>
      <div className="analytics-consent-actions">
        <AppLink className="button secondary" to="/privacy">
          Privacy
        </AppLink>
        <button className="button secondary" type="button" onClick={() => chooseConsent("denied")}>
          Keep private
        </button>
        <button className="button primary" type="button" onClick={() => chooseConsent("granted")}>
          <CheckIcon />
          Allow analytics
        </button>
      </div>
    </aside>
  );
}
