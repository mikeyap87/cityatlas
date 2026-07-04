import { useEffect, useRef, useState } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
  siteConfig,
} from "../../config/site";
import type { BusinessSubmission, CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { InlineAnalyticsConsentRow } from "../../components/AnalyticsConsent";
import { ArrowRightIcon, CheckIcon, ClockIcon, ShieldIcon, SparkIcon, StoreIcon } from "../../components/Icons";
import { EmptyState, HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";
import { getTrafficContext, type AnalyticsDetail } from "../../lib/analytics";

interface SubmitBusinessPageProps {
  data: CityAtlasData;
  path: string;
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

const requestWizardSteps = [
  {
    id: "basics",
    navLabel: "Basics",
    title: "Start with the three facts CityAtlas needs first",
    copy: "Business name, neighborhood, and reply email are enough to begin.",
    status: "3 short steps",
  },
  {
    id: "goal",
    navLabel: "Problem",
    title: "What should improve first?",
    copy: "One short business problem is enough for CityAtlas to point to the next useful move.",
    status: "Main request",
  },
  {
    id: "finish",
    navLabel: "Finish",
    title: "Add anything else that helps, then send it",
    copy: "Optional details can make the first reply faster, but the request already works without them.",
    status: "Ready to send",
  },
] as const;

type SubmitMode = "email" | "draft";
type CopyStatus = "idle" | "copied" | "failed";
type PackageSelection = PackageId | "";

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

export function SubmitBusinessPage({ data, path, onSubmitBusiness, onTrack }: SubmitBusinessPageProps) {
  const params = new URLSearchParams(window.location.search);
  const requestedPackage = params.get("package") as PackageId | null;
  const hasPackageQuery = Boolean(requestedPackage);
  const initialPackage: PackageSelection = packageIds.includes(requestedPackage as PackageId)
    ? (requestedPackage as PackageId)
    : "";
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
  const [activeStep, setActiveStep] = useState(0);
  const hasTrackedView = useRef(false);
  const businessNameInputRef = useRef<HTMLInputElement | null>(null);
  const neighborhoodInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const selectedPackage = form.packageInterest
    ? data.packages.find((plan) => plan.id === form.packageInterest)
    : undefined;
  const selectedPackageHasCheckout = form.packageInterest
    ? hasPartnerPackageCheckout(form.packageInterest)
    : false;
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
  const activeWizardStep = requestWizardSteps[activeStep];
  const isFinalStep = activeStep === requestWizardSteps.length - 1;
  const canAdvanceFromBasics = Boolean(
    form.businessName.trim()
      && form.neighborhood.trim()
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
  );
  const canAdvanceFromGoal = Boolean(form.message.trim());
  const canSubmitRequest = canAdvanceFromBasics && canAdvanceFromGoal;

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    onTrack("business_request_form_viewed", {
      packageInterest: initialPackage || "none",
      hasPackageQuery,
      selectedPackageHasCheckout: initialPackage ? hasPartnerPackageCheckout(initialPackage) : false,
    });
  }, [hasPackageQuery, initialPackage, onTrack]);

  useEffect(() => {
    onTrack("business_request_step_viewed", {
      step: activeStep + 1,
      stepKey: activeWizardStep.id,
      packageInterest: form.packageInterest || "none",
    });
  }, [activeStep, activeWizardStep.id, form.packageInterest, onTrack]);

  useEffect(() => {
    const focusTarget =
      activeStep === 0
        ? businessNameInputRef.current
        : activeStep === 1
          ? messageInputRef.current
          : null;

    if (!focusTarget) return;

    focusTarget.focus();
  }, [activeStep]);

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
    setActiveStep(0);
    setCopyStatus("idle");
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
    const nextForm = {
      ...form,
      packageInterest: form.packageInterest || undefined,
      trafficContext: getTrafficContext(),
    };
    const copyText = buildBusinessRequestCopyText(nextForm);

    try {
      if (window.navigator.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(copyText);
      } else if (!fallbackCopyText(copyText)) {
        throw new Error("Copy fallback failed");
      }
      setCopyStatus("copied");
      onTrack("business_request_copy_prepared", {
        packageInterest: nextForm.packageInterest || "none",
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
          packageInterest: nextForm.packageInterest || "none",
          categoryProvided: Boolean(nextForm.category.trim()),
          websiteProvided: Boolean(nextForm.website.trim()),
          messageLength: nextForm.message.trim().length,
          fallbackUsed: true,
        });
      } catch {
        setCopyStatus("failed");
        onTrack("business_request_copy_failed", {
          packageInterest: nextForm.packageInterest || "none",
        });
      }
    }
  }

  function validateCurrentStep() {
    if (activeStep === 0) {
      return [
        businessNameInputRef.current?.reportValidity() ?? false,
        neighborhoodInputRef.current?.reportValidity() ?? false,
        emailInputRef.current?.reportValidity() ?? false,
      ].every(Boolean);
    }

    if (activeStep === 1) {
      return messageInputRef.current?.reportValidity() ?? false;
    }

    return canSubmitRequest;
  }

  function advanceWizard() {
    if (!validateCurrentStep()) {
      onTrack("business_request_step_blocked", {
        step: activeStep + 1,
        stepKey: activeWizardStep.id,
      });
      return;
    }

    const nextStep = Math.min(activeStep + 1, requestWizardSteps.length - 1);
    if (nextStep === activeStep) return;

    onTrack("business_request_step_advanced", {
      fromStep: activeStep + 1,
      toStep: nextStep + 1,
      stepKey: requestWizardSteps[nextStep].id,
    });
    setActiveStep(nextStep);
  }

  function returnToPreviousStep() {
    const nextStep = Math.max(activeStep - 1, 0);
    if (nextStep === activeStep) return;

    onTrack("business_request_step_returned", {
      fromStep: activeStep + 1,
      toStep: nextStep + 1,
      stepKey: requestWizardSteps[nextStep].id,
    });
    setActiveStep(nextStep);
  }

  function saveRequest(mode: SubmitMode) {
    if (!canSubmitRequest) {
      return;
    }

    const nextForm = { ...form };
    const requestEmailDraft = {
      ...nextForm,
      packageInterest: nextForm.packageInterest || undefined,
      trafficContext: getTrafficContext(),
    };
    const submission = onSubmitBusiness({
      ...nextForm,
      packageInterest: nextForm.packageInterest || undefined,
    });
    onTrack(
      mode === "email" ? "business_request_email_draft_opened" : "business_request_saved_for_later",
      {
        packageInterest: nextForm.packageInterest || "none",
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
          </div>
          <div className="pricing-hero-subactions">
            <AppLink className="text-link" to="/for-businesses/pricing">
              Compare packages <ArrowRightIcon />
            </AppLink>
          </div>
          <div className="business-request-trust-line">
            <ShieldIcon />
            <span>No payment to start. Restaurants and service businesses can begin with one short request.</span>
          </div>
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

      <section className="form-layout">
        <form
          id="business-request-form"
          className="submission-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!isFinalStep) {
              advanceWizard();
              return;
            }
            saveRequest("email");
          }}
        >
          <div className="submission-wizard">
            <div className="submission-wizard-progress">
              <div className="submission-step-count">
                <div>
                  <p className="section-label">Step {activeStep + 1} of {requestWizardSteps.length}</p>
                  <strong>{activeWizardStep.status}</strong>
                </div>
                <StatusPill tone="amber">{activeWizardStep.status}</StatusPill>
              </div>
              <ol className="submission-step-dots" aria-label="Business request progress">
                {requestWizardSteps.map((step, index) => {
                  const tone =
                    index === activeStep ? "active" : index < activeStep ? "complete" : "upcoming";
                  return (
                    <li className={`submission-step-dot ${tone}`} key={step.id}>
                      <span className="submission-step-dot-index">{index + 1}</span>
                      <span className="submission-step-dot-label">{step.navLabel}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <SectionHeader
              title={activeWizardStep.title}
              copy={activeWizardStep.copy}
              action={<StatusPill tone="amber">Step {activeStep + 1}</StatusPill>}
            />
          </div>

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

          {activeStep === 0 ? (
            <>
              <div className="form-grid submission-step-grid-basics">
                <label>
                  Business name
                  <input
                    ref={businessNameInputRef}
                    value={form.businessName}
                    onChange={(event) => updateFormField("businessName", event.target.value)}
                    required
                  />
                </label>
                <label>
                  Neighborhood
                  <input
                    ref={neighborhoodInputRef}
                    value={form.neighborhood}
                    onChange={(event) => updateFormField("neighborhood", event.target.value)}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    ref={emailInputRef}
                    value={form.email}
                    onChange={(event) => updateFormField("email", event.target.value)}
                    type="email"
                    required
                  />
                </label>
              </div>
              <p className="submission-action-note submission-action-note-tight">
                These are the only required details before CityAtlas can reply.
              </p>
              <InlineAnalyticsConsentRow path={path} />
              <div className="submission-step-actions">
                <button className="button primary" onClick={advanceWizard} type="button">
                  Continue
                  <ArrowRightIcon />
                </button>
              </div>
            </>
          ) : null}

          {activeStep === 1 ? (
            <>
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
                  ref={messageInputRef}
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
              <div className="submission-step-actions">
                <button className="button secondary" onClick={returnToPreviousStep} type="button">
                  Back
                </button>
                <button className="button primary" onClick={advanceWizard} type="button">
                  Continue
                  <ArrowRightIcon />
                </button>
              </div>
            </>
          ) : null}

          {activeStep === 2 ? (
            <>
              <article className="source-panel submission-review-card">
                <div className="card-topline">
                  <strong>Ready to send</strong>
                  <StatusPill tone="green">Required parts done</StatusPill>
                </div>
                <div className="submission-review-grid">
                  <div className="submission-review-item">
                    <span>Business</span>
                    <strong>{form.businessName}</strong>
                  </div>
                  <div className="submission-review-item">
                    <span>Neighborhood</span>
                    <strong>{form.neighborhood}</strong>
                  </div>
                  <div className="submission-review-item">
                    <span>Reply email</span>
                    <strong>{form.email}</strong>
                  </div>
                </div>
                <div className="submission-review-message">
                  <span>Main request</span>
                  <p>{form.message}</p>
                </div>
              </article>

              <details className="disclosure-card submission-optional-group" open={hasPackageQuery}>
                <summary className="disclosure-summary">
                  <div>
                    <p className="section-label">Optional details</p>
                    <strong>Add more context if it helps</strong>
                  </div>
                  <span className="disclosure-tag">Optional</span>
                </summary>
                <div className="disclosure-body">
                  <div className="form-grid">
                    <label>
                      Category
                      <input
                        value={form.category}
                        onChange={(event) => updateFormField("category", event.target.value)}
                        placeholder="Restaurant, repair shop, cleaner, wellness..."
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
                      Package direction
                      <select
                        value={form.packageInterest}
                        onChange={(event) => {
                          const packageInterest = event.target.value as PackageSelection;
                          updateFormField("packageInterest", packageInterest);
                          onTrack("business_request_package_changed", {
                            packageInterest: packageInterest || "none",
                          });
                        }}
                      >
                        <option value="">Not sure yet</option>
                        {data.packages.map((plan) => (
                          <option value={plan.id} key={plan.id}>
                            {plan.name} - {plan.priceLabel}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="submission-action-note">
                    Add these only when they help CityAtlas understand the request faster. The first
                    step still works without them.
                  </p>
                  {hasPackageQuery && selectedPackage ? (
                    <p className="submission-action-note">
                      You arrived here with {selectedPackage.name} preselected, so CityAtlas can still
                      review that package fit while keeping the request-first path open.
                    </p>
                  ) : null}
                </div>
              </details>

              <div className="submission-step-actions">
                <button className="button secondary" onClick={returnToPreviousStep} type="button">
                  Back
                </button>
                <div className="submission-action-row">
                  <button className="button primary" type="submit">
                    Email this request
                    <ArrowRightIcon />
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => saveRequest("draft")}
                    type="button"
                  >
                    Save for later
                  </button>
                </div>
              </div>
              <div className="submission-helper-row">
                <button
                  className="button tiny"
                  onClick={() => {
                    if (!canSubmitRequest) {
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
              {hasPackageQuery && selectedPackage && selectedPackageHasCheckout ? (
                <div className="source-panel business-hero-note-card business-hero-note-card-safe">
                  <strong>Already know the package you want?</strong>
                  <p>
                    {selectedPackage.name} can open in checkout now. Use this request if you want
                    CityAtlas to review the fit, the deliverable, or the next step first.
                  </p>
                  <a
                    className="button secondary"
                    href={getPartnerPackageCheckoutUrl(selectedPackage.id)}
                    onClick={() =>
                      onTrack("business_package_checkout_clicked", {
                        location: "submit_form_helper",
                        packageId: selectedPackage.id,
                      })}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {getPartnerPackageCheckoutLabel(selectedPackage.id)}
                  </a>
                </div>
              ) : null}
            </>
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
                      <small>{[item.category, item.neighborhood].filter(Boolean).join(" • ") || "Draft saved locally"}</small>
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </div>
          <details className="disclosure-card" open={hasPackageQuery}>
            <summary className="disclosure-summary">
              <div>
                <p className="section-label">Other ways to start</p>
                <strong>Open the path that feels easier</strong>
              </div>
              <span className="disclosure-tag">Options</span>
            </summary>
            <div className="disclosure-body disclosure-link-stack">
              <AppLink className="text-link" to="/for-businesses/book-call">
                Book a short call <ArrowRightIcon />
              </AppLink>
              <AppLink className="text-link" to="/for-businesses/pricing">
                See package options <ArrowRightIcon />
              </AppLink>
              <AppLink className="text-link" to="/for-businesses/partner-preview">
                How features work <ArrowRightIcon />
              </AppLink>
              {hasPackageQuery && selectedPackageHasCheckout && form.packageInterest ? (
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
              ) : null}
            </div>
          </details>
        </aside>
      </section>

      <section className="section-block">
        <article className="source-panel request-brief-card">
          <div className="card-topline">
            <strong>Helpful if you want more context</strong>
            <StatusPill tone="amber">Still optional</StatusPill>
          </div>
          <div className="request-brief-grid">
            <article className="request-brief-block">
              <h2>What to include</h2>
              <ul className="request-brief-list">
                {requestChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="request-brief-block">
              <h2>What you should get back</h2>
              <p>
                A first reply should point to the clearest page, guide, offer, short call, hosted
                visit, or package for this request.
              </p>
            </article>
            <article className="request-brief-block">
              <h2>When to keep it short</h2>
              <p>
                If the full story feels heavy, send the basics and one clear problem. CityAtlas can
                ask the next useful question after that.
              </p>
            </article>
          </div>
        </article>
      </section>
    </>
  );
}
