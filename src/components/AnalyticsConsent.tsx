import { useEffect, useState } from "react";
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
  const suppressBannerRoute = path.startsWith("/for-businesses/submit");
  const isPrimaryIntentRoute = path.startsWith("/planner");
  const [promptArmed, setPromptArmed] = useState(() => !isPrimaryIntentRoute);
  const shouldShow =
    !isProtectedRoute &&
    !suppressBannerRoute &&
    readiness.hasExternalDestination &&
    consent === "pending";
  const isVisible = shouldShow && promptArmed;

  useEffect(() => {
    setPromptArmed(!isPrimaryIntentRoute);
  }, [isPrimaryIntentRoute, path]);

  useEffect(() => {
    if (!shouldShow || !isPrimaryIntentRoute || promptArmed) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPromptArmed(true);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isPrimaryIntentRoute, promptArmed, shouldShow]);

  useEffect(() => {
    document.body.classList.toggle("analytics-consent-visible", isVisible);
    return () => {
      document.body.classList.remove("analytics-consent-visible");
    };
  }, [isVisible]);

  function chooseConsent(next: "granted" | "denied") {
    setAnalyticsConsentState(next, {
      includePageView: next === "granted",
      path,
    });
    setConsent(next);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className={`analytics-consent-banner${isPrimaryIntentRoute ? " analytics-consent-banner-compact" : ""}`}
      aria-label="Analytics choice"
    >
      <div className="analytics-consent-copy">
        <span className="analytics-consent-icon" aria-hidden="true">
          <ShieldIcon />
        </span>
        <div>
          <strong>Analytics is optional</strong>
          <p>
            {isPrimaryIntentRoute
              ? "Allow simple visit and business-request measurement on this device."
              : "Allow simple visit measurement on this device."}
          </p>
          <div className="analytics-consent-meta">
            <span>Not needed to use CityAtlas.</span>
            <AppLink className="analytics-consent-privacy-link" to="/privacy">
              Privacy
            </AppLink>
          </div>
        </div>
      </div>
      <div className="analytics-consent-actions">
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

type InlineAnalyticsConsentRowProps = {
  path: string;
};

export function InlineAnalyticsConsentRow({ path }: InlineAnalyticsConsentRowProps) {
  const readiness = getAnalyticsReadiness();
  const [consent, setConsent] = useState(() => getAnalyticsConsentState());
  const isEnabled = consent === "granted";

  function toggleConsent() {
    const next = isEnabled ? "denied" : "granted";
    setAnalyticsConsentState(next, {
      includePageView: next === "granted",
      path,
    });
    setConsent(next);
  }

  if (!readiness.hasExternalDestination) {
    return null;
  }

  return (
    <div className="inline-analytics-consent" aria-label="Optional analytics choice">
      <div className="inline-analytics-consent-copy">
        <span className="inline-analytics-consent-icon" aria-hidden="true">
          <ShieldIcon />
        </span>
        <div>
          <strong>Share anonymous usage stats <span>Optional</span></strong>
          <p>
            {isEnabled
              ? "Analytics is on for this device so CityAtlas can measure visits and the request flow."
              : "Off by default. Turn this on only if you want CityAtlas to measure visits and the request flow on this device."}
          </p>
          <div className="inline-analytics-consent-meta">
            <span>Not needed to use CityAtlas. Change this on this device any time.</span>
            <AppLink className="inline-analytics-consent-link" to="/privacy">
              Privacy
            </AppLink>
          </div>
        </div>
      </div>
      <button
        aria-checked={isEnabled}
        className={`inline-analytics-consent-toggle${isEnabled ? " is-enabled" : ""}`}
        onClick={toggleConsent}
        role="switch"
        type="button"
      >
        <span className="inline-analytics-consent-track" aria-hidden="true">
          <span className="inline-analytics-consent-thumb" />
        </span>
        <span className="inline-analytics-consent-status">{isEnabled ? "On" : "Off"}</span>
      </button>
    </div>
  );
}
