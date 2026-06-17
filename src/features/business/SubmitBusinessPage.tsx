import { useState } from "react";
import type { BusinessSubmission, CityAtlasData, PackageId } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, LockIcon, StoreIcon } from "../../components/Icons";
import { EmptyState, SafeModeNotice, SectionHeader, StatusPill } from "../../components/UI";

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
}

const packageIds: PackageId[] = ["community", "city_partner", "signature_partner"];

export function SubmitBusinessPage({ data, onSubmitBusiness }: SubmitBusinessPageProps) {
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

  return (
    <>
      <section className="form-hero">
        <div>
          <p className="section-label">Business review</p>
          <h1>Start a CityAtlas business request</h1>
          <p>
            Early access note: this request is saved in this browser while CityAtlas finishes live
            business intake. Nothing is billed, published, or contacted from this form.
          </p>
        </div>
        <SafeModeNotice />
      </section>

      <section className="form-layout">
        <form
          className="submission-form"
          onSubmit={(event) => {
            event.preventDefault();
            const submission = onSubmitBusiness(form);
            setSaved(submission);
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
          }}
        >
          <SectionHeader
            title="Review request"
            copy="Add the details you want CityAtlas to review first."
            action={<StatusPill tone="amber">Review required</StatusPill>}
          />

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
                required
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
              Website
              <input
                value={form.website}
                onChange={(event) => setForm({ ...form, website: event.target.value })}
                placeholder="https://example.com"
              />
            </label>
            <label>
              Contact name
              <input
                value={form.contactName}
                onChange={(event) => setForm({ ...form, contactName: event.target.value })}
                required
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
              onChange={(event) =>
                setForm({ ...form, packageInterest: event.target.value as PackageId })
              }
            >
              {data.packages.map((plan) => (
                <option value={plan.id} key={plan.id}>
                  {plan.name} - {plan.priceLabel}
                </option>
              ))}
            </select>
          </label>

          <label>
            Notes for review
            <textarea
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              rows={5}
              placeholder="Tell us what should be reviewed, verified, or prepared."
            />
          </label>

          <button className="button primary" type="submit">
            Save review request
            <ArrowRightIcon />
          </button>
        </form>

        <aside className="review-sidebar">
          <div className="source-panel">
            <LockIcon />
            <h2>Handled carefully</h2>
            <p>
              Nothing goes live from this form. CityAtlas uses it to review fit, facts, and next
              steps before any profile, perk, or package is confirmed.
            </p>
          </div>
          <div className="source-panel">
            <StoreIcon />
            <h2>Recent requests</h2>
            {recentSubmissions.length === 0 ? (
              <EmptyState title="No requests yet" copy="Save the form to add your business request here." />
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
          <AppLink className="text-link" to="/for-businesses/pricing">
            Back to packages <ArrowRightIcon />
          </AppLink>
        </aside>
      </section>
    </>
  );
}
