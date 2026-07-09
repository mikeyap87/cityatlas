import { useEffect, useRef, useState } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
  siteConfig,
} from "../../config/site";
import type { CityAtlasData, PackageId } from "../../types";
import { BusinessReplyProofPanel } from "../../components/BusinessReplyProof";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, SparkIcon } from "../../components/Icons";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";

interface BookCallPageProps {
  data: CityAtlasData;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
}

type CallMode = "email" | "copy";
type CopyStatus = "idle" | "copied" | "failed";
type PackageSelection = PackageId | "";

const packageIds: PackageId[] = ["community", "city_partner", "signature_partner"];

const callSteps = [
  "Tell CityAtlas what the business is and what help you want first.",
  "Share 2 or 3 time windows that work for you.",
  "CityAtlas replies by email and the written path still stays open.",
];

const callOutcomeList = [
  "The clearest first page, guide, or offer angle.",
  "Whether an in-person visit or service makes sense next.",
  "Whether the next move should stay free, become a visit, or wait for a paid package later.",
];

function fallbackCopyText(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}

function buildCallEmailParts(input: {
  businessName: string;
  cityArea: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  packageInterest?: PackageId;
  callPreference: "phone" | "google_meet";
  firstWindow: string;
  secondWindow: string;
  thirdWindow: string;
  goal: string;
}) {
  const subject = `CityAtlas short call request: ${input.businessName}`;
  const lines = [
    `Business name: ${input.businessName}`,
    input.businessType ? `Business type: ${input.businessType}` : null,
    input.cityArea ? `City / neighborhood: ${input.cityArea}` : null,
    input.contactName ? `Contact name: ${input.contactName}` : null,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    input.packageInterest ? `Package interest: ${input.packageInterest}` : null,
    `Call preference: ${input.callPreference === "google_meet" ? "Google Meet" : "Phone"}`,
    "",
    "Good time windows:",
    input.firstWindow ? `1. ${input.firstWindow}` : null,
    input.secondWindow ? `2. ${input.secondWindow}` : null,
    input.thirdWindow ? `3. ${input.thirdWindow}` : null,
    "",
    "What we want help with first:",
    input.goal,
  ].filter(Boolean);

  return {
    subject,
    body: lines.join("\n"),
  };
}

function buildCallDraft(input: Parameters<typeof buildCallEmailParts>[0]) {
  const { subject, body } = buildCallEmailParts(input);
  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body,
  )}`;
}

function buildCopyText(input: Parameters<typeof buildCallEmailParts>[0]) {
  const { subject, body } = buildCallEmailParts(input);
  return `To: ${siteConfig.contactEmail}\nSubject: ${subject}\n\n${body}`;
}

function normalizeCallRequestInput(form: {
  businessName: string;
  cityArea: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  packageInterest: PackageSelection;
  callPreference: "phone" | "google_meet";
  firstWindow: string;
  secondWindow: string;
  thirdWindow: string;
  goal: string;
}) {
  return {
    ...form,
    packageInterest: form.packageInterest || undefined,
  };
}

export function BookCallPage({ data, onTrack }: BookCallPageProps) {
  const params = new URLSearchParams(window.location.search);
  const requestedPackage = params.get("package") as PackageId | null;
  const initialPackage: PackageSelection = packageIds.includes(requestedPackage as PackageId)
    ? (requestedPackage as PackageId)
    : "";
  const [form, setForm] = useState({
    businessName: "",
    cityArea: "",
    businessType: "",
    contactName: "",
    email: "",
    phone: "",
    packageInterest: initialPackage,
    callPreference: "phone" as "phone" | "google_meet",
    firstWindow: "",
    secondWindow: "",
    thirdWindow: "",
    goal: "",
  });
  const [lastAction, setLastAction] = useState<CallMode | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const hasTrackedView = useRef(false);
  const selectedPackage = data.packages.find((plan) => plan.id === form.packageInterest);
  const selectedPackageHasCheckout = form.packageInterest
    ? hasPartnerPackageCheckout(form.packageInterest)
    : false;

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    onTrack("business_fit_call_page_viewed", {
      packageInterest: initialPackage || "none",
      selectedPackageHasCheckout: initialPackage
        ? hasPartnerPackageCheckout(initialPackage)
        : false,
    });
  }, [initialPackage, onTrack]);

  function updateFormField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setCopyStatus("idle");
  }

  async function copyCallDetails() {
    const copyText = buildCopyText(normalizeCallRequestInput(form));

    try {
      if (window.navigator.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(copyText);
      } else if (!fallbackCopyText(copyText)) {
        throw new Error("Copy fallback failed");
      }
      setCopyStatus("copied");
      setLastAction("copy");
      onTrack("business_fit_call_copy_prepared", {
        packageInterest: form.packageInterest || "none",
        goalLength: form.goal.trim().length,
      });
    } catch {
      try {
        if (!fallbackCopyText(copyText)) {
          throw new Error("Fallback copy failed");
        }
        setCopyStatus("copied");
        setLastAction("copy");
        onTrack("business_fit_call_copy_prepared", {
          packageInterest: form.packageInterest || "none",
          goalLength: form.goal.trim().length,
          fallbackUsed: true,
        });
      } catch {
        setCopyStatus("failed");
        onTrack("business_fit_call_copy_failed", {
          packageInterest: form.packageInterest || "none",
        });
      }
    }
  }

  function openEmailDraft() {
    setLastAction("email");
    onTrack("business_fit_call_email_draft_opened", {
      packageInterest: form.packageInterest || "none",
      goalLength: form.goal.trim().length,
      callPreference: form.callPreference,
    });
    window.location.href = buildCallDraft(normalizeCallRequestInput(form));
  }

  return (
    <>
      <section className="form-hero form-hero-compact">
        <div>
          <p className="section-label">Book a short call</p>
          <h1>Book a short CityAtlas fit call</h1>
          <p>
            Use this when talking is easier than typing. The call is only there to make the next
            step clearer before anything is bought or published.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#business-fit-call-form">
              Share your time windows
              <ArrowRightIcon />
            </a>
          </div>
          <p className="business-hero-context">10-minute call · Personal reply · Written request still works</p>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Simple promise</strong>
            <p>
              CityAtlas uses this call to point you to the clearest next step, not to push a
              bigger package before the fit is obvious.
            </p>
          </article>
          <div className="pricing-hero-subactions">
            <AppLink className="text-link" to="/for-businesses/submit">
              Prefer writing? Start with a written request <ArrowRightIcon />
            </AppLink>
            <AppLink className="text-link" to="/for-businesses/pricing">
              Need package basics? Compare packages <ArrowRightIcon />
            </AppLink>
          </div>
        </div>
        <div className="pricing-hero-side">
          <HeroMediaCard
            image={siteConfig.media.business}
            alt="Illustrated Vancouver business and market scene"
            eyebrow="Talk it through"
            title="Use a quick call when the route needs a human read"
            copy="Best for businesses that already know they want help, but want CityAtlas to point them toward the cleanest first move."
          />
        </div>
      </section>

      <section className="split-section">
        <article className="source-panel conversion-panel pricing-intro-panel">
          <div className="card-topline">
            <strong>What you do</strong>
            <StatusPill tone="amber">Personal follow-up</StatusPill>
          </div>
          <ul className="plain-list compact pricing-step-list">
            {callSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>
        <article className="source-panel conversion-panel pricing-mini-card pricing-fit-panel">
          <strong>Good fit for</strong>
          <p>
            Businesses that want a faster read on the clearest page, guide fit, offer, or next
            visit step.
          </p>
          <div className="tag-cloud pricing-fit-tag-cloud">
            <span>Restaurants</span>
            <span>Cafes</span>
            <span>Wellness</span>
            <span>Repair</span>
            <span>Cleaning</span>
            <span>Mobile services</span>
          </div>
        </article>
      </section>

      <section className="form-layout">
        <form
          id="business-fit-call-form"
          className="submission-form"
          onSubmit={(event) => {
            event.preventDefault();
            openEmailDraft();
          }}
        >
          <SectionHeader
            title="Share the business and a few time windows"
            copy="This opens your email app with the details filled in so CityAtlas can reply personally and confirm a time."
            action={<StatusPill tone="amber">Email-ready</StatusPill>}
          />

          {lastAction ? (
            <article className="source-panel form-feedback-card business-hero-note-card business-hero-note-card-safe">
              <strong>
                {lastAction === "email"
                  ? "Your call request is ready to send."
                  : "Your call request was copied."}
              </strong>
              <p>
                {lastAction === "email"
                  ? `If your email app did not open, you can still copy the request and send it to ${siteConfig.contactEmail}.`
                  : `Paste the request into an email to ${siteConfig.contactEmail} if your email app does not open here.`}
              </p>
            </article>
          ) : null}

          <div className="form-grid">
            <label>
              Business name
              <input
                value={form.businessName}
                onChange={(event) => updateFormField("businessName", event.target.value)}
                required
              />
            </label>
            <label>
              City / neighborhood
              <input
                value={form.cityArea}
                onChange={(event) => updateFormField("cityArea", event.target.value)}
                placeholder="Vancouver, Burnaby, Kitsilano, Langley..."
                required
              />
            </label>
            <label>
              Business type
              <input
                value={form.businessType}
                onChange={(event) => updateFormField("businessType", event.target.value)}
                placeholder="Restaurant, cleaner, spa, repair shop..."
              />
            </label>
            <label>
              Contact name
              <input
                value={form.contactName}
                onChange={(event) => updateFormField("contactName", event.target.value)}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateFormField("email", event.target.value)}
                required
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(event) => updateFormField("phone", event.target.value)}
                placeholder="Optional if email is easier"
              />
            </label>
          </div>

          <label>
            Package, if you already know
            <select
              value={form.packageInterest}
              onChange={(event) =>
                updateFormField("packageInterest", event.target.value as PackageSelection)}
            >
              <option value="">No package yet - decide after the call</option>
              {data.packages.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.priceLabel}
                </option>
              ))}
            </select>
          </label>
          <p className="submission-action-note submission-action-note-tight">
            You can skip this. Use it only if one package already feels obvious.
          </p>

          <label>
            Call preference
            <select
              value={form.callPreference}
              onChange={(event) =>
                updateFormField("callPreference", event.target.value as "phone" | "google_meet")}
            >
              <option value="phone">Phone</option>
              <option value="google_meet">Google Meet</option>
            </select>
          </label>

          <div className="form-grid">
            <label>
              First good time window
              <input
                value={form.firstWindow}
                onChange={(event) => updateFormField("firstWindow", event.target.value)}
                placeholder="Example: Tuesday 2 to 4 PM PST"
                required
              />
            </label>
            <label>
              Second good time window
              <input
                value={form.secondWindow}
                onChange={(event) => updateFormField("secondWindow", event.target.value)}
                placeholder="Example: Wednesday 10 AM to noon PST"
              />
            </label>
            <label>
              Third good time window
              <input
                value={form.thirdWindow}
                onChange={(event) => updateFormField("thirdWindow", event.target.value)}
                placeholder="Optional backup"
              />
            </label>
          </div>

          <label>
            What help do you want first?
            <textarea
              value={form.goal}
              onChange={(event) => updateFormField("goal", event.target.value)}
              rows={5}
              placeholder="Example: We want to understand whether we fit better in a first-visit guide, a guest-hosting route, or a simple local feature."
              required
            />
          </label>

          <div className="submission-action-row">
            <button className="button primary" type="submit">
              Open email draft
              <ArrowRightIcon />
            </button>
            <button
              className="button secondary"
              onClick={(event) => {
                if (!event.currentTarget.form?.reportValidity()) {
                  return;
                }
                void copyCallDetails();
              }}
              type="button"
            >
              Copy email instead
            </button>
          </div>

          <p className="submission-action-note">
            This request goes out by email. CityAtlas replies personally to confirm the time and
            the clearest next step.
          </p>

          <div className="submission-helper-row">
            <span className="submission-helper-feedback">
              {copyStatus === "copied"
                ? "Copied. Paste it into an email to city@univenturestudio.com if needed."
                : copyStatus === "failed"
                  ? "Copy did not work here. You can still send the same details directly to city@univenturestudio.com."
                  : "If your email app does not open, copy the request and send it manually."}
            </span>
          </div>

          {selectedPackageHasCheckout ? (
            <details className="disclosure-card submission-support-disclosure submission-support-disclosure-compact">
              <summary className="disclosure-summary">
                <div>
                  <p className="section-label">Optional</p>
                  <strong>Already sure about the paid path?</strong>
                </div>
                <span className="disclosure-tag">Open</span>
              </summary>
              <div className="disclosure-body submission-support-body">
                <div className="request-brief-grid">
                  <article className="request-brief-block">
                    <h2>When this makes sense</h2>
                    <p>
                      {selectedPackage?.name} can also open in checkout now. Use that only when the
                      scope already feels clear and you do not need CityAtlas to help decide first.
                    </p>
                  </article>
                  <article className="request-brief-block">
                    <h2>Optional checkout</h2>
                    <a
                      className="button secondary"
                      href={getPartnerPackageCheckoutUrl(form.packageInterest as PackageId)}
                      onClick={() =>
                        onTrack("business_package_checkout_clicked", {
                          location: "book_call_helper",
                          packageId: form.packageInterest,
                        })}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {getPartnerPackageCheckoutLabel(form.packageInterest as PackageId)}
                    </a>
                  </article>
                </div>
              </div>
            </details>
          ) : null}
        </form>

        <aside className="review-sidebar">
          <article className="business-guidance-card business-guidance-card-sidebar">
            <LockIcon />
            <span className="query-card-kicker">What this call should answer</span>
            <strong>Use the call to make the next step obvious</strong>
            <ul className="conversion-list business-guidance-list">
              {callOutcomeList.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <div className="source-panel">
            <SparkIcon />
            <h2>The call stays low pressure</h2>
            <p>
              The call itself does not put anything live or paid in motion. It is only there to
              help CityAtlas point you toward the clearest first move.
            </p>
          </div>
          <BusinessReplyProofPanel
            badgeLabel="Reply proof"
            badgeTone="blue"
            intro="The same free-review-first boundary already applies when CityAtlas answers real businesses. The short call stays inside that same proof-first path and only helps confirm the clearest next step."
            title="Current reply proof"
            variant="compact"
          />
          <div className="source-panel">
            <strong>Prefer the written path?</strong>
            <p>
              Start with the full business request if you already know what you want help with and
              do not need a quick conversation first.
            </p>
            <AppLink className="text-link" to="/for-businesses/submit">
              Start written request <ArrowRightIcon />
            </AppLink>
          </div>
        </aside>
      </section>
    </>
  );
}
