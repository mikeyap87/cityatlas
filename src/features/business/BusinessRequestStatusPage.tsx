import { useEffect, useMemo } from "react";
import { ArrowRightIcon, CheckIcon, ClockIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { AppLink } from "../../components/Link";
import { StatusPill } from "../../components/UI";
import { siteConfig } from "../../config/site";
import type { CityAtlasData } from "../../types";

interface BusinessRequestStatusPageProps {
  data: CityAtlasData;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
}

const statusDateFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeStyle: "short",
});

const requestStatusSteps = [
  {
    id: "received",
    title: "Received",
    detail: "Saved on this device and ready for CityAtlas to read.",
  },
  {
    id: "reviewing",
    title: "Reviewing",
    detail: "CityAtlas is sorting the clearest first reply and the simplest next move.",
  },
  {
    id: "need_detail",
    title: "Need one more detail",
    detail: "If anything important is missing, this is the only extra question before the next step.",
  },
  {
    id: "preview_ready",
    title: "Preview ready",
    detail: "If the fit is real, the next step becomes a plain-English preview, short call, or package path.",
  },
] as const;

function formatSubmissionTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return statusDateFormatter.format(parsed);
}

export function BusinessRequestStatusPage({
  data,
  onTrack,
}: BusinessRequestStatusPageProps) {
  const requestedSubmissionId = new URLSearchParams(window.location.search).get("submission");
  const submission = useMemo(() => {
    if (requestedSubmissionId) {
      const matched = data.submissions.find((entry) => entry.id === requestedSubmissionId);
      if (matched) return matched;
    }
    return data.submissions[0] ?? null;
  }, [data.submissions, requestedSubmissionId]);

  const selectedPackage = submission?.packageInterest
    ? data.packages.find((plan) => plan.id === submission.packageInterest)
    : undefined;

  useEffect(() => {
    onTrack("business_request_status_viewed", {
      hasSubmission: Boolean(submission),
      submissionId: submission?.id ?? "none",
    });
  }, [onTrack, submission]);

  if (!submission) {
    return (
      <section className="section-block business-status-empty">
        <p className="section-label">Request status</p>
        <h1>No business request is saved on this device yet.</h1>
        <p>
          Start with the short request first. CityAtlas only needs three quick details to open the
          review path.
        </p>
        <div className="hero-actions business-request-confirmation-actions">
          <AppLink className="button primary" to="/for-businesses/submit">
            Start a business request
            <ArrowRightIcon />
          </AppLink>
          <AppLink className="button secondary" to="/for-businesses/book-call">
            Book a short call
          </AppLink>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="form-hero form-hero-compact business-request-hero business-status-hero">
        <div className="business-request-hero-copy business-status-hero-copy">
          <p className="section-label">Request status</p>
          <div className="business-status-pill-row">
            <StatusPill tone="green">Received</StatusPill>
            <StatusPill tone="blue">Reviewing now</StatusPill>
            <StatusPill tone="ink">This device</StatusPill>
          </div>
          <h1>We got your request.</h1>
          <p>
            CityAtlas saved <strong>{submission.businessName}</strong> on this device and is now
            in the plain-English review stage.
          </p>
          <div className="business-request-trust-line">
            <ShieldIcon />
            <span>
              Automatic status emails are not live yet. This page is the honest local status view for
              now.
            </span>
          </div>
        </div>
      </section>

      <section className="form-layout form-layout-compact">
        <div className="business-status-shell">
          <div className="business-status-grid">
            <article className="source-panel business-status-card">
              <div className="card-topline">
                <strong>What happens next</strong>
                <StatusPill tone="green">Simple path</StatusPill>
              </div>
              <div className="business-status-step-list" aria-label="Business request steps">
                {requestStatusSteps.map((step, index) => {
                  const state = index === 0 ? "complete" : index === 1 ? "current" : "upcoming";
                  return (
                    <article
                      className={`business-status-step is-${state}`}
                      key={step.id}
                    >
                      <span className="business-status-step-index" aria-hidden="true">
                        {state === "complete" ? <CheckIcon /> : index + 1}
                      </span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.detail}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <p className="business-status-note">
                The goal is still the same: one clear reply, one believable next move, and no surprise
                payment step at the start.
              </p>
            </article>

            <article className="source-panel business-status-card business-status-card-muted">
              <div className="card-topline">
                <strong>Saved request</strong>
                <StatusPill tone="blue">{formatSubmissionTime(submission.createdAt)}</StatusPill>
              </div>
              <div className="business-status-summary-grid">
                <div className="business-status-summary-item">
                  <span>Business</span>
                  <strong>{submission.businessName}</strong>
                </div>
                <div className="business-status-summary-item">
                  <span>Neighborhood</span>
                  <strong>{submission.neighborhood}</strong>
                </div>
                <div className="business-status-summary-item">
                  <span>Reply email</span>
                  <strong>{submission.email}</strong>
                </div>
                <div className="business-status-summary-item">
                  <span>Package direction</span>
                  <strong>{selectedPackage?.name ?? "Not chosen yet"}</strong>
                </div>
              </div>
              <div className="business-status-message">
                <span>Main request</span>
                <p>{submission.message}</p>
              </div>
            </article>
          </div>

          <article className="source-panel business-status-card business-status-card-wide">
            <div className="card-topline">
              <strong>Best next move</strong>
              <StatusPill tone="amber">Optional</StatusPill>
            </div>
            <div className="business-status-next-grid">
              <div className="business-status-next-copy">
                <p>
                  Reopen the request only if you want to send a cleaner version. Otherwise, the best
                  next move is to wait for the review, or use the short call path if talking it through
                  is easier.
                </p>
                <ul className="conversion-list submission-proof-list">
                  <li>
                    <ClockIcon />
                    <span>Review comes before any payment ask.</span>
                  </li>
                  <li>
                    <SparkIcon />
                    <span>The first reply should point to one clear page, guide, offer, or service angle.</span>
                  </li>
                  <li>
                    <ShieldIcon />
                    <span>CityAtlas can still say the fit is weak if the request is not ready yet.</span>
                  </li>
                </ul>
              </div>
              <div className="business-status-next-actions">
                <AppLink
                  className="button primary"
                  to="/for-businesses/submit"
                  onClick={() => onTrack("business_request_status_cta_clicked", { action: "update_request" })}
                >
                  Update the request
                  <ArrowRightIcon />
                </AppLink>
                <AppLink
                  className="button secondary"
                  to="/for-businesses/book-call"
                  onClick={() => onTrack("business_request_status_cta_clicked", { action: "book_call" })}
                >
                  Book a short call
                </AppLink>
                <AppLink
                  className="button secondary"
                  to="/for-businesses/partner-preview"
                  onClick={() => onTrack("business_request_status_cta_clicked", { action: "open_preview" })}
                >
                  See how the preview works
                </AppLink>
                <a
                  className="text-link"
                  href={`mailto:${siteConfig.contactEmail}`}
                  onClick={() => onTrack("business_request_status_cta_clicked", { action: "email_us" })}
                >
                  Contact us directly <ArrowRightIcon />
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
