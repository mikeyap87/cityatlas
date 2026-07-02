import { useEffect, useRef, useState } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
  siteConfig,
} from "../../config/site";
import type { CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, SparkIcon } from "../../components/Icons";
import { HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";

interface BookCallPageProps {
  data: CityAtlasData;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
}

type CallMode = "email" | "copy";
type CopyStatus = "idle" | "copied" | "failed";

const packageIds: PackageId[] = ["community", "city_partner", "signature_partner"];

const callSteps = [
  "Tell CityAtlas the business type, area, and what needs help first.",
  "Share 2 or 3 time windows that work for a short call.",
  "CityAtlas replies personally and the written-request path stays open.",
];

const callOutcomeList = [
  "The clearest first page, guide, or offer angle.",
  "Whether an in-person visit or service makes sense next.",
  "Whether the right next step is a request, a paid package, or a feature plan.",
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
  packageInterest: PackageId;
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
    `Package interest: ${input.packageInterest}`,
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

export function BookCallPage({ data, onTrack }: BookCallPageProps) {
  const params = new URLSearchParams(window.location.search);
  const requestedPackage = params.get("package") as PackageId | null;
  const initialPackage = packageIds.includes(requestedPackage as PackageId)
    ? (requestedPackage as PackageId)
    : "city_partner";
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
  const selectedPackageHasCheckout = hasPartnerPackageCheckout(form.packageInterest);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    onTrack("business_fit_call_page_viewed", {
      packageInterest: initialPackage,
      selectedPackageHasCheckout: hasPartnerPackageCheckout(initialPackage),
    });
  }, [initialPackage, onTrack]);

  function updateFormField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setCopyStatus("idle");
  }

  async function copyCallDetails() {
    const copyText = buildCopyText(form);

    try {
      if (window.navigator.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(copyText);
      } else if (!fallbackCopyText(copyText)) {
        throw new Error("Copy fallback failed");
      }
      setCopyStatus("copied");
      setLastAction("copy");
      onTrack("business_fit_call_copy_prepared", {
        packageInterest: form.packageInterest,
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
          packageInterest: form.packageInterest,
          goalLength: form.goal.trim().length,
          fallbackUsed: true,
        });
      } catch {
        setCopyStatus("failed");
        onTrack("business_fit_call_copy_failed", {
          packageInterest: form.packageInterest,
        });
      }
    }
  }

  function openEmailDraft() {
    setLastAction("email");
    onTrack("business_fit_call_email_draft_opened", {
      packageInterest: form.packageInterest,
      goalLength: form.goal.trim().length,
      callPreference: form.callPreference,
    });
    window.location.href = buildCallDraft(form);
  }

  return (
    <>
      <section className="form-hero form-hero-compact">
        <div>
          <p className="section-label">Book a short call</p>
          <h1>Book a 10-minute CityAtlas call</h1>
          <p>
            Use this when talking it through is faster than writing a longer request. The call is
            simply a faster way to make the next step clearer before anything is bought or
            published.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#business-fit-call-form">
              Share your time windows
              <ArrowRightIcon />
            </a>
            <AppLink className="button secondary" to="/for-businesses/submit">
              Start with a written request
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/pricing">
              Compare packages
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>10-minute short call</span>
            <span>Personal follow-up from CityAtlas</span>
            <span>Request path still open</span>
            <span>Restaurants + services</span>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Simple promise</strong>
            <p>
              CityAtlas uses this short call to point you to the clearest next step, not to push a
              bigger package before the fit is obvious.
            </p>
          </article>
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
            <strong>What to expect</strong>
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
            Businesses that know they want a clearer page, better guide placement, a stronger local
            offer, or a quicker read on whether an in-person visit or service makes sense next.
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
            title="Share the business and 2 or 3 call windows"
            copy="This opens your email app with the details filled in so CityAtlas can follow up personally and confirm a time."
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
                  ? `If your email app did not open, you can still copy the request and send it directly to ${siteConfig.contactEmail}.`
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
            Package interest
            <select
              value={form.packageInterest}
              onChange={(event) =>
                updateFormField("packageInterest", event.target.value as PackageId)}
            >
              {data.packages.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.priceLabel}
                </option>
              ))}
            </select>
          </label>

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
            What you want help with first
            <textarea
              value={form.goal}
              onChange={(event) => updateFormField("goal", event.target.value)}
              rows={5}
              placeholder="Example: We want to understand whether we fit better in a first-visit guide, a guest-hosting route, or a City Partner package."
              required
            />
          </label>

          <div className="submission-action-row">
            <button className="button primary" type="submit">
              Email call request
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
              Copy short-call request
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
            <div className="source-panel business-hero-note-card business-hero-note-card-safe">
              <strong>Already sure about the paid path?</strong>
              <p>
                {selectedPackage?.name} can also open in checkout now. Book the short call only if
                you want CityAtlas to help decide the scope first.
              </p>
              <a
                className="button secondary"
                href={getPartnerPackageCheckoutUrl(form.packageInterest)}
                onClick={() =>
                  onTrack("business_package_checkout_clicked", {
                    location: "book_call_helper",
                    packageId: form.packageInterest,
                  })}
                rel="noreferrer"
                target="_blank"
              >
                {getPartnerPackageCheckoutLabel(form.packageInterest)}
              </a>
            </div>
          ) : null}
        </form>

        <aside className="review-sidebar">
          <article className="business-guidance-card business-guidance-card-sidebar">
            <LockIcon />
            <span className="query-card-kicker">What the call should answer</span>
            <strong>Use the short call to make the next step obvious</strong>
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
            <h2>What to expect</h2>
            <p>
              The call itself does not put anything live or paid in motion. It is only there to
              help CityAtlas point you toward the clearest first move.
            </p>
          </div>
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
