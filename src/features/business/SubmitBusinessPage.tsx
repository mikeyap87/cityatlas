import { useEffect, useRef, useState } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
  siteConfig,
} from "../../config/site";
import type { BusinessSubmission, CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, ClockIcon, ShieldIcon, SparkIcon, StoreIcon } from "../../components/Icons";
import { EmptyState, HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import { getTrafficContext, type AnalyticsDetail } from "../../lib/analytics";

interface SubmitBusinessPageProps {
  data: CityAtlasData;
  onSubmitBusiness: (input: {
    businessName: string;
    category: string;
    neighborhood: string;
    contactName: string;
    email: string;
    website: string;
    message: string;
    packageInterest?: PackageId;
  }) => BusinessSubmission;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
}

const packageIds: PackageId[] = ["community", "city_partner", "signature_partner"];

const requestChecklist = [
  "Your business name, category, and neighborhood.",
  "A website, Instagram, or other public contact path if you have one.",
  "The one thing you want CityAtlas to improve first.",
];

const requestNextSteps = [
  "A plain-English read on the page, guide, offer, or service angle that matters first.",
  "The clearest next step: a reply, short call, hosted visit, or package.",
  "No payment is needed to start, and a saved copy can stay on this device.",
];

const requestPromptOptions = [
  {
    label: "Clearer page",
    prompt:
      "We need a clearer page that explains who we are, who we are for, and why someone should choose us.",
  },
  {
    label: "Guide fit",
    prompt:
      "We want help figuring out which CityAtlas route or guide we fit best and why it would matter to the right local reader.",
  },
  {
    label: "Simple offer",
    prompt:
      "We need one clear offer or angle that people can understand quickly without extra explanation.",
  },
  {
    label: "Neighborhood visibility",
    prompt:
      "We want stronger visibility for our neighborhood and the kinds of people already looking nearby.",
  },
  {
    label: "Service positioning",
    prompt:
      "We need to explain our service more clearly so the right local customer understands the value fast.",
  },
];

type SubmitMode = "email" | "draft";
type CopyStatus = "idle" | "copied" | "failed";

type BusinessRequestEmailInput = {
  businessName: string;
  category: string;
  neighborhood: string;
  contactName: string;
  email: string;
  website: string;
  message: string;
  packageInterest?: PackageId;
  trafficContext?: AnalyticsDetail;
};

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

function buildTrafficContextEmailLines(trafficContext?: AnalyticsDetail) {
  if (!trafficContext) return [];

  const contextFields: Array<[keyof AnalyticsDetail & string, string]> = [
    ["utm_source", "UTM source"],
    ["utm_medium", "UTM medium"],
    ["utm_campaign", "UTM campaign"],
    ["utm_content", "UTM content"],
    ["utm_term", "UTM term"],
    ["firstLandingPath", "First landing path"],
    ["latestLandingPath", "Latest landing path"],
    ["referrer", "Referrer"],
  ];
  const contextLines = contextFields
    .map(([key, label]) => {
      const value = trafficContext[key];
      return value === undefined || value === "" ? null : `${label}: ${String(value)}`;
    })
    .filter((line): line is string => Boolean(line));

  if (contextLines.length === 0) return [];

  return [
    "",
    "Campaign / referral context:",
    ...contextLines,
  ];
}

function buildBusinessRequestEmailParts(input: BusinessRequestEmailInput) {
  const subject = `CityAtlas business request: ${input.businessName}`;
  const lines = [
    `Business name: ${input.businessName}`,
    input.category ? `Category: ${input.category}` : null,
    `Neighborhood: ${input.neighborhood}`,
    input.contactName ? `Contact name: ${input.contactName}` : null,
    `Email: ${input.email}`,
    input.website ? `Website or Instagram: ${input.website}` : null,
    input.packageInterest ? `Package interest: ${input.packageInterest}` : null,
    "",
    "What we want help with:",
    input.message,
    ...buildTrafficContextEmailLines(input.trafficContext),
  ].filter(Boolean);

  return {
    subject,
    body: lines.join("\n"),
  };
}

function buildBusinessRequestEmailDraft(input: {
  businessName: string;
  category: string;
  neighborhood: string;
  contactName: string;
  email: string;
  website: string;
  message: string;
  packageInterest?: PackageId;
  trafficContext?: AnalyticsDetail;
}) {
  const { subject, body } = buildBusinessRequestEmailParts(input);

  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body,
  )}`;
}

function buildBusinessRequestCopyText(input: {
  businessName: string;
  category: string;
  neighborhood: string;
  contactName: string;
  email: string;
  website: string;
  message: string;
  packageInterest?: PackageId;
  trafficContext?: AnalyticsDetail;
}) {
  const { subject, body } = buildBusinessRequestEmailParts(input);
  return `To: ${siteConfig.contactEmail}\nSubject: ${subject}\n\n${body}`;
}

export function SubmitBusinessPage({ data, onSubmitBusiness, onTrack }: SubmitBusinessPageProps) {
  const params = new URLSearchParams(window.location.search);
  const requestedPackage = params.get("package") as PackageId | null;
  const hasPackageQuery = Boolean(requestedPackage);
  const initialPackage = packageIds.includes(requestedPackage as PackageId)
    ? (requestedPackage as PackageId)
    : "city_partner";
  const [form, setForm] = useState({
    businessName: "",
    category: "",
    neighborhood: "",
    contactName: "",
    email: "",
    website: "",
    message: "",
    packageInterest: initialPackage,
  });
  const [saved, setSaved] = useState<BusinessSubmission | null>(null);
  const [lastSubmitMode, setLastSubmitMode] = useState<SubmitMode | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const hasTrackedView = useRef(false);
  const selectedPackage = data.packages.find((plan) => plan.id === form.packageInterest);
  const selectedPackageHasCheckout = hasPartnerPackageCheckout(form.packageInterest);
  const recentSubmissions = [saved, ...data.submissions]
    .filter((item): item is BusinessSubmission => Boolean(item))
    .reduce<BusinessSubmission[]>((list, item) => {
      if (list.some((existing) => existing.id === item.id)) {
        return list;
      }
      list.push(item);
      return list;
    }, [])
    .slice(0, 5);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    onTrack("business_request_form_viewed", {
      packageInterest: initialPackage,
      hasPackageQuery,
      selectedPackageHasCheckout: hasPartnerPackageCheckout(initialPackage),
    });
  }, [hasPackageQuery, initialPackage, onTrack]);

  function resetForm() {
    setForm({
      businessName: "",
      category: "",
      neighborhood: "",
      contactName: "",
      email: "",
      website: "",
      message: "",
      packageInterest: initialPackage,
    });
  }

  function updateFormField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setCopyStatus("idle");
  }

  function applyMessagePrompt(prompt: string) {
    setForm((current) => {
      const trimmedMessage = current.message.trim();
      const nextMessage = trimmedMessage
        ? current.message.includes(prompt)
          ? current.message
          : `${current.message.trim()}\n\n${prompt}`
        : prompt;

      return {
        ...current,
        message: nextMessage,
      };
    });
    setCopyStatus("idle");
    onTrack("business_request_prompt_selected", {
      packageInterest: form.packageInterest,
      promptLength: prompt.length,
    });
  }

  async function copyRequestDetails() {
    const nextForm = { ...form, trafficContext: getTrafficContext() };
    const copyText = buildBusinessRequestCopyText(nextForm);

    try {
      if (window.navigator.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(copyText);
      } else if (!fallbackCopyText(copyText)) {
        throw new Error("Copy fallback failed");
      }
      setCopyStatus("copied");
      onTrack("business_request_copy_prepared", {
        packageInterest: nextForm.packageInterest,
        categoryProvided: Boolean(nextForm.category.trim()),
        websiteProvided: Boolean(nextForm.website.trim()),
        messageLength: nextForm.message.trim().length,
      });
    } catch {
      try {
        if (!fallbackCopyText(copyText)) {
          throw new Error("Fallback copy failed");
        }
        setCopyStatus("copied");
        onTrack("business_request_copy_prepared", {
          packageInterest: nextForm.packageInterest,
          categoryProvided: Boolean(nextForm.category.trim()),
          websiteProvided: Boolean(nextForm.website.trim()),
          messageLength: nextForm.message.trim().length,
          fallbackUsed: true,
        });
      } catch {
        setCopyStatus("failed");
        onTrack("business_request_copy_failed", {
          packageInterest: nextForm.packageInterest,
        });
      }
    }
  }

  function saveRequest(mode: SubmitMode) {
    const nextForm = { ...form };
    const requestEmailDraft = { ...nextForm, trafficContext: getTrafficContext() };
    const submission = onSubmitBusiness(nextForm);
    onTrack(
      mode === "email" ? "business_request_email_draft_opened" : "business_request_saved_for_later",
      {
        packageInterest: nextForm.packageInterest,
        categoryProvided: Boolean(nextForm.category.trim()),
        websiteProvided: Boolean(nextForm.website.trim()),
        messageLength: nextForm.message.trim().length,
      },
    );
    setSaved(submission);
    setLastSubmitMode(mode);
    resetForm();

    if (mode === "email") {
      window.location.href = buildBusinessRequestEmailDraft(requestEmailDraft);
    }
  }

  return (
    <>
      <section className="form-hero form-hero-compact">
        <div>
          <p className="section-label">For businesses</p>
          <h1>Tell CityAtlas what should improve first</h1>
          <p>
            Share the basics and the one result you want first. CityAtlas turns it into a simple
            request by email, or you can take the shorter call path if talking it through is
            easier.
          </p>
          <div className="hero-actions">
            <a
              className="button primary"
              href="#business-request-form"
              onClick={() => onTrack("business_request_jump_to_form_clicked")}
            >
              Start the request below
              <ArrowRightIcon />
            </a>
            <AppLink className="button secondary" to="/for-businesses/book-call">
              Book a short call
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/pricing">
              Compare packages
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>Email-ready request</span>
            <span>No payment to start</span>
            <span>Restaurants + service businesses</span>
            <span>Guide, offer, or service help</span>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Most requests only need one neighborhood, one contact path, and one clear goal.</strong>
            <p>
              That is usually enough for CityAtlas to point you toward the next useful page, guide,
              offer, short call, or package without overcomplicating the first step.
            </p>
          </article>
        </div>
        <div className="pricing-hero-side">
          <HeroMediaCard
            image={siteConfig.media.business}
            alt="Illustrated market scene inspired by Granville Island Public Market in Vancouver"
            eyebrow="Start simple"
            title="Lead with one clear neighborhood need"
            copy="One neighborhood, one business need, and one contact path are enough for CityAtlas to point the request in the right direction."
          />
        </div>
      </section>

      <section className="section-block">
        <div className="card-grid three">
          <article className="source-panel business-hero-note-card">
            <strong>What to share</strong>
            <ul className="plain-list compact pricing-step-list">
              {requestChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe">
            <strong>What you usually get back first</strong>
            <p>
              A first reply should point to the strongest page, guide, offer, or neighborhood angle
              and say whether the next move is a reply, short call, hosted visit, or package.
            </p>
          </article>
          <article className="source-panel business-hero-note-card">
            <div className="card-topline">
              <strong>What happens after you send</strong>
              <StatusPill tone="amber">No payment to start</StatusPill>
            </div>
            <p>
              The main button opens your email app with the request filled in. A saved copy stays
              on this device if you want to come back later, and CityAtlas can still point you to a
              short call or package later if that becomes the cleanest move.
            </p>
          </article>
        </div>
      </section>

      <section className="form-layout">
        <form
          id="business-request-form"
          className="submission-form"
          onSubmit={(event) => {
            event.preventDefault();
            saveRequest("email");
          }}
        >
          <SectionHeader
            title="Tell CityAtlas what needs to improve"
            copy="A clear request makes the next recommendation faster and more useful."
            action={<StatusPill tone="amber">Email-ready</StatusPill>}
          />

          {lastSubmitMode ? (
            <article className="source-panel form-feedback-card business-hero-note-card business-hero-note-card-safe">
              <strong>
                {lastSubmitMode === "email"
                  ? "Your request is ready to send."
                  : "Your request is saved on this device."}
              </strong>
              <p>
                {lastSubmitMode === "email"
                  ? `We also saved a copy here. If your email app did not open, you can still copy the request and send it to ${siteConfig.contactEmail}.`
                  : "You can come back on this device later, or use the email button whenever you are ready."}
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
              Category
              <input
                value={form.category}
                onChange={(event) => updateFormField("category", event.target.value)}
                placeholder="Restaurant, repair shop, cleaner, wellness..."
              />
            </label>
            <label>
              Neighborhood
              <input
                value={form.neighborhood}
                onChange={(event) => updateFormField("neighborhood", event.target.value)}
                required
              />
            </label>
            <label>
              Website or Instagram
              <input
                value={form.website}
                onChange={(event) => updateFormField("website", event.target.value)}
                placeholder="https://yourbusiness.com or https://instagram.com/..."
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
                value={form.email}
                onChange={(event) => updateFormField("email", event.target.value)}
                type="email"
                required
              />
            </label>
          </div>

          <label>
            Package interest
            <select
              value={form.packageInterest}
              onChange={(event) => {
                const packageInterest = event.target.value as PackageId;
                updateFormField("packageInterest", packageInterest);
                onTrack("business_request_package_changed", { packageInterest });
              }}
            >
              {data.packages.map((plan) => (
                <option value={plan.id} key={plan.id}>
                  {plan.name} - {plan.priceLabel}
                </option>
              ))}
            </select>
          </label>

          <div className="request-prompt-panel">
            <span className="request-prompt-label">
              <SparkIcon />
              Need a starting point? Tap the closest one.
            </span>
            <div className="request-prompt-grid">
              {requestPromptOptions.map((option) => (
                <button
                  aria-pressed={form.message.includes(option.prompt)}
                  className="request-prompt-chip"
                  key={option.label}
                  onClick={() => applyMessagePrompt(option.prompt)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <label>
            What you want help with
            <textarea
              value={form.message}
              onChange={(event) => updateFormField("message", event.target.value)}
              rows={5}
              placeholder="Example: We want a stronger Kitsilano page, better placement in date-night or visitor guides, and one clear offer worth showing."
              required
            />
          </label>
          <p className="submission-action-note submission-action-note-tight">
            Keep this short if you want. One clear business problem is enough to start.
          </p>

          <div className="submission-action-row">
            <button className="button primary" type="submit">
              Email this request
              <ArrowRightIcon />
            </button>
            <button
              className="button secondary"
              onClick={(event) => {
                if (!event.currentTarget.form?.reportValidity()) {
                  return;
                }
                saveRequest("draft");
              }}
              type="button"
            >
              Save for later
            </button>
          </div>
          <div className="submission-helper-row">
            <button
              className="button tiny"
              onClick={(event) => {
                if (!event.currentTarget.form?.reportValidity()) {
                  return;
                }
                void copyRequestDetails();
              }}
              type="button"
            >
              Copy request
            </button>
            <span className="submission-helper-feedback">
              {copyStatus === "copied"
                ? "Copied. Paste it into an email to city@univenturestudio.com if you need to."
                : copyStatus === "failed"
                  ? "Copy did not work here. You can still email city@univenturestudio.com directly."
                  : "If your email app does not open, copy the request and send it yourself."}
            </span>
          </div>
          <p className="submission-action-note">
            The main button opens your email app with the request filled in. Saving keeps a copy on
            this device. No payment is required to start.
          </p>
          {selectedPackageHasCheckout ? (
            <div className="source-panel business-hero-note-card business-hero-note-card-safe">
              <strong>Already know the package you want?</strong>
              <p>
                {selectedPackage?.name} can open in checkout now. Use this request if you want
                CityAtlas to review the fit, the deliverable, or the next step first.
              </p>
              <a
                className="button secondary"
                href={getPartnerPackageCheckoutUrl(form.packageInterest)}
                onClick={() =>
                  onTrack("business_package_checkout_clicked", {
                    location: "submit_form_helper",
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
            <ShieldIcon />
            <span className="query-card-kicker">What happens next</span>
            <strong>CityAtlas should point you to the clearest next step</strong>
            <ul className="conversion-list business-guidance-list">
              {requestNextSteps.map((step) => (
                <li key={step}>
                  <CheckIcon />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </article>
          <div className="source-panel">
            <ClockIcon />
            <h2>Keep the first request simple</h2>
            <p>
              If writing the full story feels heavy, send the basics and one clear problem. CityAtlas
              can ask the next useful question after that.
            </p>
          </div>
          <div className="source-panel">
            <StoreIcon />
            <h2>Saved drafts on this device</h2>
            {recentSubmissions.length === 0 ? (
              <EmptyState title="No drafts yet" copy="Save a draft here if you want to come back before sending the email." />
            ) : (
              <div className="submission-list">
                {recentSubmissions.map((item) =>
                  item ? (
                    <div className="submission-row" key={item.id}>
                      <strong>{item.businessName}</strong>
                      <small>{item.category} - {item.neighborhood}</small>
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </div>
          <div className="source-panel">
            <strong>Prefer talking it through first?</strong>
            <p>
              Use the short-call page when the business wants a faster human recommendation before
              writing a longer request.
            </p>
            <AppLink className="text-link" to="/for-businesses/book-call">
              Book a short call <ArrowRightIcon />
            </AppLink>
          </div>
          {selectedPackageHasCheckout ? (
            <div className="source-panel">
              <strong>Ready to pay for this package?</strong>
              <p>
                If the scope is already clear, you can skip the request and go straight to checkout
                for {selectedPackage?.name}.
              </p>
              <a
                className="text-link"
                href={getPartnerPackageCheckoutUrl(form.packageInterest)}
                onClick={() =>
                  onTrack("business_package_checkout_clicked", {
                    location: "submit_sidebar",
                    packageId: form.packageInterest,
                  })}
                rel="noreferrer"
                target="_blank"
              >
                {getPartnerPackageCheckoutLabel(form.packageInterest)} <ArrowRightIcon />
              </a>
            </div>
          ) : null}
          <div className="source-panel">
            <strong>Need the package details first?</strong>
            <p>
              Compare the package options, or open How features work if you want the simple version
              before you send anything.
            </p>
            <AppLink className="text-link" to="/for-businesses/pricing">
              See package options <ArrowRightIcon />
            </AppLink>
            <AppLink className="text-link" to="/for-businesses/partner-preview">
              How features work <ArrowRightIcon />
            </AppLink>
          </div>
        </aside>
      </section>
    </>
  );
}
