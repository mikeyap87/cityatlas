import { useEffect, useRef, useState } from "react";
import {
  getPartnerPackageCheckoutLabel,
  getPartnerPackageCheckoutUrl,
  hasPartnerPackageCheckout,
  siteConfig,
} from "../../config/site";
import type { BusinessSubmission, CityAtlasData, PackageId } from "../../types";
import { BusinessReplyProofPanel } from "../../components/BusinessReplyProof";
import { AppLink } from "../../components/Link";
import { InlineAnalyticsConsentRow } from "../../components/AnalyticsConsent";
import { ArrowRightIcon, CheckIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { StatusPill } from "../../components/UI";
import { getTrafficContext, type AnalyticsDetail } from "../../lib/analytics";
import { getGuidePath } from "../../lib/cityPaths";
import { getBusinessVisual, getGuideVisual } from "../../lib/visuals";

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

const requestReplyPreviewBullets = [
  "Best fit first: the page, guide, offer, or service angle CityAtlas thinks matters most.",
  "Still to confirm: any facts, photos, hosted visit, or offer details that should be checked before anything public goes live.",
  "Next move: a plain-English reply, short call, hosted visit, or package only if that is already clearly the right step.",
];

const requestBasicsPrompts = [
  {
    key: "businessName",
    label: "Business name",
    placeholder: "Example: Smoke Test Bistro",
    prompt: "What's your business called?",
    type: "text",
    helper: "Start with the name locals already know.",
  },
  {
    key: "neighborhood",
    label: "Neighborhood",
    placeholder: "Example: Gastown",
    prompt: "Which neighborhood should CityAtlas anchor first?",
    type: "text",
    helper: "A neighborhood is enough. A full street address can wait.",
  },
  {
    key: "email",
    label: "Reply email",
    placeholder: "name@business.com",
    prompt: "What email should CityAtlas reply to?",
    type: "email",
    helper: "Use the inbox that should get the first plain-English answer.",
  },
] as const;

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

const requestWizardHeadings = [
  {
    stepLabel: "Step 1 of 3",
    title: "3 quick details",
    copy: "Business name, neighborhood, and reply email are enough to begin.",
  },
  {
    stepLabel: "Step 2 of 3",
    title: "One clear problem",
    copy: "Keep this short. One clear business problem is enough to start.",
  },
  {
    stepLabel: "Step 3 of 3",
    title: "Ready to send",
    copy: "Check the request, then email it or save it for later.",
  },
] as const;

type SubmitMode = "email" | "draft";
type CopyStatus = "idle" | "copied" | "failed";
type PackageSelection = PackageId | "";
type RequestBasicsPrompt = (typeof requestBasicsPrompts)[number];

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

function getBusinessPath(cityName: string, slug: string) {
  const citySlug = cityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `/${citySlug || "vancouver"}/businesses/${slug}`;
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
  const [basicsFieldIndex, setBasicsFieldIndex] = useState(0);
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
  const activeWizardHeading = requestWizardHeadings[activeStep];
  const isFinalStep = activeStep === requestWizardSteps.length - 1;
  const currentBasicsPrompt = requestBasicsPrompts[basicsFieldIndex] as RequestBasicsPrompt;
  const completedBasicsPrompts = requestBasicsPrompts.slice(0, basicsFieldIndex);
  const isLastBasicsField = basicsFieldIndex === requestBasicsPrompts.length - 1;
  const proofBusiness = data.businesses.find((business) => business.slug === "published-on-main")
    ?? data.businesses.find((business) => business.featured)
    ?? data.businesses[0]
    ?? null;
  const proofGuide = data.guides.find(
    (guide) => guide.slug === "how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice",
  ) ?? data.guides[0] ?? null;
  const proofBusinessPath = proofBusiness
    ? getBusinessPath(proofBusiness.city, proofBusiness.slug)
    : "/vancouver/businesses/published-on-main";
  const proofGuidePath = proofGuide
    ? getGuidePath(proofGuide)
    : "/vancouver/guides/how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice";
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
        ? basicsFieldIndex === 0
          ? businessNameInputRef.current
          : basicsFieldIndex === 1
            ? neighborhoodInputRef.current
            : emailInputRef.current
        : activeStep === 1
          ? messageInputRef.current
          : null;

    if (!focusTarget) return;

    focusTarget.focus();
  }, [activeStep, basicsFieldIndex]);

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
    setBasicsFieldIndex(0);
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
      return (
        (basicsFieldIndex === 0
          ? businessNameInputRef.current?.reportValidity()
          : basicsFieldIndex === 1
            ? neighborhoodInputRef.current?.reportValidity()
            : emailInputRef.current?.reportValidity()) ?? false
      );
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

    if (activeStep === 0 && !isLastBasicsField) {
      const nextBasicsFieldIndex = basicsFieldIndex + 1;
      onTrack("business_request_basics_advanced", {
        fromField: currentBasicsPrompt.key,
        toField: requestBasicsPrompts[nextBasicsFieldIndex].key,
        question: nextBasicsFieldIndex + 1,
      });
      setBasicsFieldIndex(nextBasicsFieldIndex);
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
    if (activeStep === 0 && basicsFieldIndex > 0) {
      const previousBasicsFieldIndex = basicsFieldIndex - 1;
      onTrack("business_request_basics_returned", {
        fromField: currentBasicsPrompt.key,
        toField: requestBasicsPrompts[previousBasicsFieldIndex].key,
        question: previousBasicsFieldIndex + 1,
      });
      setBasicsFieldIndex(previousBasicsFieldIndex);
      return;
    }

    const nextStep = Math.max(activeStep - 1, 0);
    if (nextStep === activeStep) return;

    onTrack("business_request_step_returned", {
      fromStep: activeStep + 1,
      toStep: nextStep + 1,
      stepKey: requestWizardSteps[nextStep].id,
    });
    if (nextStep === 0) {
      setBasicsFieldIndex(requestBasicsPrompts.length - 1);
    }
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
      <section className="form-hero form-hero-compact business-request-hero">
        <div className="business-request-hero-copy">
          <p className="section-label">For businesses</p>
          <h1>Start a simple business request</h1>
          <p>
            Three short details are enough to begin. CityAtlas can reply by email, or you can take
            the shorter call path if talking it through is easier.
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
          <div className="business-request-trust-line">
            <ShieldIcon />
            <span>Free review first. No payment is needed to start.</span>
          </div>
        </div>
      </section>

      <section className="form-layout form-layout-compact">
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
          {lastSubmitMode ? (
            <article className="source-panel form-feedback-card business-request-confirmation-card">
              <div className="card-topline">
                <strong>We got your request on this device.</strong>
                <StatusPill tone="green">Reviewing next</StatusPill>
              </div>
              <p>
                {lastSubmitMode === "email"
                  ? `CityAtlas also opened your email draft. If your email app did not open, you can still use the status page below or send the request to ${siteConfig.contactEmail} yourself.`
                  : "CityAtlas saved the request on this device. You can reopen it here, email it later, or use the short call path instead."}
              </p>
              <div className="business-request-confirmation-actions">
                <AppLink className="button primary" to={saved ? `/for-businesses/status?submission=${saved.id}` : "/for-businesses/status"}>
                  Open request status
                  <ArrowRightIcon />
                </AppLink>
                <AppLink className="button secondary" to="/for-businesses/book-call">
                  Book a short call
                </AppLink>
              </div>
              <p className="submission-action-note submission-action-note-tight">
                Automatic status emails are not live yet. This keeps the request visible on this
                device so the next step stays clear.
              </p>
            </article>
          ) : null}

          <div className={`submission-step-shell ${activeStep === 0 ? "submission-step-shell-centered" : ""}`}>
            {activeStep === 0 ? (
              <>
                <div className="submission-start-grid">
                  <div className="submission-start-main">
                    <div className="submission-center-card">
                      <div className="submission-card-heading">
                        <p className="section-label">{activeWizardHeading.stepLabel}</p>
                        <div className="submission-question-progress">
                          <span className="submission-question-progress-label">
                            Question {basicsFieldIndex + 1} of {requestBasicsPrompts.length}
                          </span>
                          <div className="submission-question-dots" aria-hidden="true">
                            {requestBasicsPrompts.map((prompt, index) => (
                              <span
                                className={[
                                  "submission-question-dot",
                                  index < basicsFieldIndex
                                    ? "is-complete"
                                    : index === basicsFieldIndex
                                      ? "is-current"
                                      : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                                key={prompt.key}
                              />
                            ))}
                          </div>
                        </div>
                        <h2>{currentBasicsPrompt.prompt}</h2>
                        <p>{currentBasicsPrompt.helper}</p>
                      </div>
                      <label className="submission-single-question-field">
                        {currentBasicsPrompt.label}
                        <input
                          ref={
                            currentBasicsPrompt.key === "businessName"
                              ? businessNameInputRef
                              : currentBasicsPrompt.key === "neighborhood"
                                ? neighborhoodInputRef
                                : emailInputRef
                          }
                          value={form[currentBasicsPrompt.key]}
                          onChange={(event) =>
                            updateFormField(currentBasicsPrompt.key, event.target.value)
                          }
                          placeholder={currentBasicsPrompt.placeholder}
                          type={currentBasicsPrompt.type}
                          required
                        />
                      </label>
                      {completedBasicsPrompts.length > 0 ? (
                        <div className="submission-basics-recap">
                          <span className="submission-basics-recap-label">Saved so far</span>
                          <div className="submission-basics-recap-grid">
                            {completedBasicsPrompts.map((prompt) => (
                              <div className="submission-basics-recap-item" key={prompt.key}>
                                <span>{prompt.label}</span>
                                <strong>{form[prompt.key]}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <div className="submission-step-actions">
                        {basicsFieldIndex > 0 ? (
                          <button className="button secondary" onClick={returnToPreviousStep} type="button">
                            Back
                          </button>
                        ) : (
                          <span className="submission-step-actions-spacer" aria-hidden="true" />
                        )}
                        <button className="button primary" onClick={advanceWizard} type="button">
                          {isLastBasicsField ? "Next" : "Next question"}
                          <ArrowRightIcon />
                        </button>
                      </div>
                    </div>

                    <details className="disclosure-card submission-support-disclosure submission-support-disclosure-compact">
                      <summary className="disclosure-summary">
                        <div>
                          <p className="section-label">Optional</p>
                          <strong>What happens next</strong>
                        </div>
                        <span className="disclosure-tag">Open</span>
                      </summary>
                      <div className="disclosure-body submission-support-body">
                        <div className="request-brief-grid">
                          <article className="request-brief-block">
                            <h2>What you should get back</h2>
                            <ul className="conversion-list submission-proof-list">
                              {requestNextSteps.map((step) => (
                                <li key={step}>
                                  <CheckIcon />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </article>
                          <article className="request-brief-block">
                            <h2>Anonymous usage stats</h2>
                            <InlineAnalyticsConsentRow path={path} />
                          </article>
                        </div>
                      </div>
                    </details>

                    <details className="disclosure-card submission-support-disclosure submission-support-disclosure-compact submission-optional-group">
                      <summary className="disclosure-summary">
                        <div>
                          <p className="section-label">Still optional</p>
                          <strong>Need more context or another start path?</strong>
                        </div>
                        <span className="disclosure-tag">Optional</span>
                      </summary>
                      <div className="disclosure-body submission-copy-body">
                        <div className="submission-support-links">
                          <AppLink className="text-link" to="/for-businesses/status">
                            Request status <ArrowRightIcon />
                          </AppLink>
                          <AppLink className="text-link" to="/for-businesses/book-call">
                            Book a short call <ArrowRightIcon />
                          </AppLink>
                          <AppLink className="text-link" to="/for-businesses/pricing">
                            See package options <ArrowRightIcon />
                          </AppLink>
                          <AppLink className="text-link" to="/for-businesses/partner-preview">
                            How features work <ArrowRightIcon />
                          </AppLink>
                          {selectedPackage && selectedPackageHasCheckout ? (
                            <a
                              className="text-link"
                              href={getPartnerPackageCheckoutUrl(selectedPackage.id)}
                              onClick={() =>
                                onTrack("business_package_checkout_clicked", {
                                  location: "submit_form_helper",
                                  packageId: selectedPackage.id,
                                })}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {getPartnerPackageCheckoutLabel(selectedPackage.id)} <ArrowRightIcon />
                            </a>
                          ) : null}
                        </div>
                        <div className="request-brief-grid">
                          <article className="request-brief-block">
                            <h2>What to include</h2>
                            <ul className="conversion-list submission-proof-list">
                              {requestChecklist.map((item) => (
                                <li key={item}>
                                  <CheckIcon />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </article>
                        </div>
                        {recentSubmissions.length > 0 ? (
                          <div className="request-brief-grid">
                            <article className="request-brief-block">
                              <h2>Saved drafts on this device</h2>
                              <div className="saved-item-list">
                                {recentSubmissions.map((submission) => (
                                  <article className="saved-row" key={submission.id}>
                                    <strong>{submission.businessName}</strong>
                                    <span>{submission.category || "Business request"}</span>
                                    <small>{submission.neighborhood}</small>
                                  </article>
                                ))}
                              </div>
                            </article>
                          </div>
                        ) : null}
                      </div>
                    </details>
                  </div>

                  <div className="submission-proof-stack">
                    <article className="source-panel submission-proof-card">
                      <div className="card-topline">
                        <strong>What the first reply can look like</strong>
                        <StatusPill tone="green">Plain English</StatusPill>
                      </div>
                      <p className="submission-proof-copy">
                        CityAtlas starts with a short fit note, not a bill and not a guarantee.
                      </p>
                      <ul className="conversion-list submission-proof-list">
                        {requestReplyPreviewBullets.map((item) => (
                          <li key={item}>
                            <CheckIcon />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="submission-action-note submission-action-note-tight">
                        No payment is needed to start, and CityAtlas can still say the fit is weak.
                      </p>
                    </article>

                    <details className="disclosure-card submission-proof-disclosure">
                      <summary className="disclosure-summary">
                        <div>
                          <p className="section-label">Optional proof</p>
                          <strong>See live examples and current reply proof</strong>
                        </div>
                        <span className="disclosure-tag">Open</span>
                      </summary>
                      <div className="disclosure-body submission-proof-disclosure-body">
                        <p className="submission-proof-disclosure-copy">
                          Open this only if you want proof before you send anything. The request
                          still works without reading more first.
                        </p>
                        <div className="submission-proof-link-grid">
                          {proofBusiness ? (
                            <AppLink
                              className="submission-proof-link-card"
                              onClick={() =>
                                onTrack("business_request_proof_link_clicked", {
                                  kind: "business_page",
                                })}
                              to={proofBusinessPath}
                            >
                              <img
                                alt={`${proofBusiness.name} CityAtlas business page example`}
                                decoding="async"
                                loading="lazy"
                                src={getBusinessVisual(proofBusiness)}
                              />
                              <div className="submission-proof-link-copy">
                                <span className="query-card-kicker">Live business page</span>
                                <strong>{proofBusiness.name}</strong>
                                <p>{proofBusiness.shortDescription}</p>
                                <span className="submission-proof-link-row">
                                  Open example <ArrowRightIcon />
                                </span>
                              </div>
                            </AppLink>
                          ) : null}

                          {proofGuide ? (
                            <AppLink
                              className="submission-proof-link-card"
                              onClick={() =>
                                onTrack("business_request_proof_link_clicked", {
                                  kind: "guide_page",
                                })}
                              to={proofGuidePath}
                            >
                              <img
                                alt={`${proofGuide.title} CityAtlas guide example`}
                                decoding="async"
                                loading="lazy"
                                src={getGuideVisual(proofGuide)}
                              />
                              <div className="submission-proof-link-copy">
                                <span className="query-card-kicker">Live guide placement</span>
                                <strong>{proofGuide.title}</strong>
                                <p>{proofGuide.summary}</p>
                                <span className="submission-proof-link-row">
                                  Open example <ArrowRightIcon />
                                </span>
                              </div>
                            </AppLink>
                          ) : null}
                        </div>

                        <BusinessReplyProofPanel
                          badgeLabel="Reply proof"
                          badgeTone="blue"
                          className="submission-proof-card"
                          intro="The same request-first path on this page is already being used to review real replies and keep the next step simple."
                          title="Current reply handling"
                          variant="compact"
                        />
                      </div>
                    </details>
                  </div>
                </div>
              </>
            ) : null}

            {activeStep === 1 ? (
              <>
                <div className="submission-center-card submission-center-card-wide">
                  <div className="submission-card-heading submission-card-heading-left">
                    <p className="section-label">{activeWizardHeading.stepLabel}</p>
                    <h2>{activeWizardHeading.title}</h2>
                    <p>{activeWizardHeading.copy}</p>
                  </div>
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
                  <div className="submission-step-actions">
                    <button className="button secondary" onClick={returnToPreviousStep} type="button">
                      Back
                    </button>
                    <button className="button primary" onClick={advanceWizard} type="button">
                      Next
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {activeStep === 2 ? (
              <>
                <div className="submission-center-card submission-center-card-wide">
                  <div className="submission-card-heading submission-card-heading-left">
                    <p className="section-label">{activeWizardHeading.stepLabel}</p>
                    <h2>{activeWizardHeading.title}</h2>
                    <p>{activeWizardHeading.copy}</p>
                  </div>

                  <div className="submission-review-card">
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
                  </div>

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
                        Add these only when they help CityAtlas understand the request faster. The
                        first step still works without them.
                      </p>
                      {hasPackageQuery && selectedPackage ? (
                        <p className="submission-action-note">
                          You arrived here with {selectedPackage.name} preselected, so CityAtlas can
                          still review that package fit while keeping the request-first path open.
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

                  <details className="disclosure-card submission-support-disclosure">
                    <summary className="disclosure-summary">
                      <div>
                        <p className="section-label">Backup option</p>
                        <strong>If your email app does not open</strong>
                      </div>
                      <span className="disclosure-tag">Copy</span>
                    </summary>
                    <div className="disclosure-body submission-copy-body">
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
                              : "Copy the request and send it yourself if the email app does not open."}
                        </span>
                      </div>
                      <p className="submission-action-note">
                        The main button opens your email app with the request filled in. Saving keeps a
                        copy on this device. No payment is required to start.
                      </p>
                    </div>
                  </details>
                </div>
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
          </div>

        </form>
      </section>
    </>
  );
}
