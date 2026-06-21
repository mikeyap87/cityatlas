import { useEffect, useState } from "react";
import { siteConfig } from "../../config/site";
import type { BusinessSubmission, CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, CheckIcon, LockIcon, StoreIcon } from "../../components/Icons";
import { EmptyState, HeroMediaCard, SectionHeader, StatusPill } from "../../components/UI";

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
  "CityAtlas gets the basics in one email-friendly format.",
  "The next recommendation stays focused: page, guide, offer, or package.",
  "A copy can stay saved in this browser if you want to come back later.",
];

type SubmitMode = "email" | "draft";

function buildBusinessRequestEmailDraft(input: {
  businessName: string;
  category: string;
  neighborhood: string;
  contactName: string;
  email: string;
  website: string;
  message: string;
  packageInterest?: PackageId;
}) {
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
  ].filter(Boolean);

  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}

export function SubmitBusinessPage({ data, onSubmitBusiness, onTrack }: SubmitBusinessPageProps) {
  const params = new URLSearchParams(window.location.search);
  const initialPackage = packageIds.includes(params.get("package") as PackageId)
    ? (params.get("package") as PackageId)
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
    onTrack("business_request_form_viewed", {
      packageInterest: initialPackage,
      hasPackageQuery: params.has("package"),
    });
  }, [initialPackage, onTrack]);

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

  function saveRequest(mode: SubmitMode) {
    const nextForm = { ...form };
    const submission = onSubmitBusiness(nextForm);
    onTrack(mode === "email" ? "business_request_email_draft_opened" : "business_request_saved_for_later", {
      packageInterest: nextForm.packageInterest,
      categoryProvided: Boolean(nextForm.category.trim()),
      websiteProvided: Boolean(nextForm.website.trim()),
      messageLength: nextForm.message.trim().length,
    });
    setSaved(submission);
    setLastSubmitMode(mode);
    resetForm();

    if (mode === "email") {
      window.location.href = buildBusinessRequestEmailDraft(nextForm);
    }
  }

  return (
    <>
      <section className="form-hero form-hero-compact">
        <div>
          <p className="section-label">For businesses</p>
          <h1>Tell CityAtlas what should improve first</h1>
          <p>
            Share the basics and the one result you want first. CityAtlas can open an email draft
            with the request and keep a saved copy here if you want to come back later.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/for-businesses/pricing">
              See packages
            </AppLink>
            <AppLink className="button secondary" to="/editorial-standards">
              See trust rules
            </AppLink>
          </div>
          <div className="tag-cloud pricing-tag-cloud">
            <span>Email draft opens</span>
            <span>Save a copy here</span>
            <span>Stronger page</span>
            <span>Guide or offer help</span>
          </div>
          <article className="source-panel business-hero-note-card business-hero-note-card-safe pricing-hero-summary-card">
            <strong>Most requests only need one neighborhood, one contact path, and one clear business goal.</strong>
            <p>
              That is usually enough for CityAtlas to point you toward the next useful page, guide,
              offer, or package without overcomplicating the first step.
            </p>
          </article>
        </div>
        <div className="pricing-hero-side">
          <HeroMediaCard
            image={siteConfig.media.city}
            alt="Illustrated shoreline scene inspired by English Bay Beach in Vancouver"
            eyebrow="Start simple"
            title="Lead with one real business need"
            copy="A clear neighborhood, business need, and contact path is enough for CityAtlas to point the request in the right direction."
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
            <strong>Why this request works</strong>
            <p>
              One clear neighborhood, category, and business need is usually enough for CityAtlas
              to point you to the right next step.
            </p>
          </article>
          <article className="source-panel business-hero-note-card">
            <div className="card-topline">
              <strong>Email draft + saved copy</strong>
              <StatusPill tone="amber">Simple first contact</StatusPill>
            </div>
            <p>
              The primary button opens an email draft to {siteConfig.contactEmail}. CityAtlas also
              keeps a copy in this browser so the request does not disappear if you want to refine
              it later.
            </p>
          </article>
        </div>
      </section>

      <section className="form-layout">
        <form
          className="submission-form"
          onSubmit={(event) => {
            event.preventDefault();
            saveRequest("email");
          }}
        >
          <SectionHeader
            title="Tell CityAtlas what needs to improve"
            copy="A clear request makes the next recommendation faster and more useful."
            action={<StatusPill tone="amber">Opens an email draft</StatusPill>}
          />

          {lastSubmitMode ? (
            <article className="source-panel form-feedback-card business-hero-note-card business-hero-note-card-safe">
              <strong>
                {lastSubmitMode === "email"
                  ? "Your email draft should be ready."
                  : "Your draft is saved in this browser."}
              </strong>
              <p>
                {lastSubmitMode === "email"
                  ? `Your request was also saved in this browser. If your email app did not open, you can save a draft here and email ${siteConfig.contactEmail} directly.`
                  : "You can keep refining this request here, or use the email-draft button when you are ready to send it."}
              </p>
            </article>
          ) : null}

          <div className="form-grid">
            <label>
              Business name
              <input
                value={form.businessName}
                onChange={(event) => setForm({ ...form, businessName: event.target.value })}
                required
              />
            </label>
            <label>
              Category
              <input
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                placeholder="Restaurant, cafe, wellness..."
              />
            </label>
            <label>
              Neighborhood
              <input
                value={form.neighborhood}
                onChange={(event) => setForm({ ...form, neighborhood: event.target.value })}
                required
              />
            </label>
            <label>
              Website or Instagram
              <input
                value={form.website}
                onChange={(event) => setForm({ ...form, website: event.target.value })}
                placeholder="https://yourbusiness.com or https://instagram.com/..."
              />
            </label>
            <label>
              Contact name
              <input
                value={form.contactName}
                onChange={(event) => setForm({ ...form, contactName: event.target.value })}
              />
            </label>
            <label>
              Email
              <input
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
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
                setForm({ ...form, packageInterest });
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

          <label>
            What you want help with
            <textarea
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              rows={5}
              placeholder="Example: We want a stronger Kitsilano page, better placement in date-night or visitor guides, and one clear offer worth showing."
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
                saveRequest("draft");
              }}
              type="button"
            >
              Save draft for later
            </button>
          </div>
          <p className="submission-action-note">
            The primary button opens an email draft to {siteConfig.contactEmail}. The secondary
            button keeps the request saved in this browser only.
          </p>
        </form>

        <aside className="review-sidebar">
          <article className="business-guidance-card business-guidance-card-sidebar">
            <LockIcon />
            <span className="query-card-kicker">What happens next</span>
            <strong>CityAtlas turns this into one clear next step</strong>
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
            <strong>Need the package details first?</strong>
            <p>Compare the three package paths if you want to understand the likely scope before you submit.</p>
            <AppLink className="text-link" to="/for-businesses/pricing">
              See package options <ArrowRightIcon />
            </AppLink>
          </div>
        </aside>
      </section>
    </>
  );
}
