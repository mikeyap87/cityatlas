import { useEffect } from "react";
import type { CityAtlasData, ProofCandidate } from "../../types";
import { AppLink } from "../../components/Link";
import { ArrowRightIcon, LockIcon, MapIcon, ShieldIcon, SparkIcon } from "../../components/Icons";
import { SectionHeader, StatusPill } from "../../components/UI";

interface DateNightPreviewPageProps {
  data: CityAtlasData;
  onTrack: (name: string, detail?: Record<string, string | number | boolean>) => void;
}

function CandidatePreviewCard({ candidate }: { candidate: ProofCandidate }) {
  return (
    <article className="preview-candidate-card">
      <div className="preview-candidate-score">
        <strong>{candidate.fitScore}</strong>
        <span>fit</span>
      </div>
      <div>
        <div className="preview-card-heading">
          <div>
            <strong>{candidate.name}</strong>
            <small>{candidate.roleInMission}</small>
          </div>
          <StatusPill tone="amber">{candidate.approvalStatus.replaceAll("_", " ")}</StatusPill>
        </div>
        <p>{candidate.routeAngle}</p>
        <small>{candidate.riskNotes}</small>
      </div>
    </article>
  );
}

export function DateNightPreviewPage({ data, onTrack }: DateNightPreviewPageProps) {
  const sprint = data.proofSprints.find((item) => item.id === "proof-date-night-vancouver");
  const candidates = data.proofCandidates
    .filter((candidate) => candidate.proofSprintId === "proof-date-night-vancouver")
    .slice()
    .sort((a, b) => b.fitScore - a.fitScore);
  const routeAnchors = candidates.slice(0, 5);

  useEffect(() => {
    onTrack("private_preview_viewed", {
      sprint: "date-night-vancouver",
      candidateCount: candidates.length,
    });
  }, [candidates.length, onTrack]);

  return (
    <>
      <section className="private-preview-hero">
        <div>
          <p className="section-label">Private preview draft</p>
          <h1>Vancouver Date Night route preview</h1>
          <p>
            A controlled founder-review route concept for showing how CityAtlas can turn local
            discovery into a saveable plan. This is not a public guide, endorsement, listing,
            partnership, or paid placement.
          </p>
          <div className="hero-actions">
            <AppLink className="button primary" to="/vancouver/missions">
              View mission model <ArrowRightIcon />
            </AppLink>
            <AppLink className="button secondary" to="/for-businesses/pricing">
              Review packages
            </AppLink>
          </div>
        </div>
        <aside className="preview-safety-panel">
          <LockIcon />
          <h2>Review-only surface</h2>
          <ul className="plain-list compact">
            <li>No public indexing.</li>
            <li>No business is listed or partnered.</li>
            <li>No outreach, payment, or booking action happens here.</li>
            <li>Real preview links require owner approval and route protection.</li>
          </ul>
        </aside>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Proof sprint"
          title={sprint?.name ?? "Date Night Founder Proof Sprint"}
          copy={sprint?.thesis}
          action={<StatusPill tone="amber">Private draft</StatusPill>}
        />
        <div className="preview-route-grid">
          <article className="preview-route-card feature">
            <SparkIcon />
            <h2>What the prospect sees</h2>
            <p>
              CityAtlas packages a night out into a plan: dinner anchor, optional cultural stop,
              dessert or cocktail closer, and a shareable invite prompt.
            </p>
          </article>
          <article className="preview-route-card">
            <MapIcon />
            <h2>What the business buys later</h2>
            <p>
              Placement inside a useful route, source-reviewed profile context, offer or experience
              concept, and founder-partner reporting after proof exists.
            </p>
          </article>
          <article className="preview-route-card">
            <ShieldIcon />
            <h2>What stays gated</h2>
            <p>
              Public pages, real claims, automated outreach, live payments, analytics, and admin CRM
              exposure remain blocked until explicit owner approval.
            </p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Candidate anchors"
          title="Route examples for screen-share review"
          copy="These names come from the owner CRM queue. They are source-backed review candidates only."
        />
        <div className="preview-candidate-list">
          {routeAnchors.map((candidate) => (
            <CandidatePreviewCard candidate={candidate} key={candidate.id} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          label="Demo script"
          title="Use this flow in a private conversation"
          copy="The preview is designed to validate interest before publishing, billing, or sending at scale."
        />
        <ol className="preview-script-list">
          <li>
            <span>1</span>
            <div>
              <strong>Show the route idea</strong>
              <p>Explain that CityAtlas turns local places into saveable plans, not another flat directory.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Show the candidate queue</strong>
              <p>Clarify that candidates are review-only and real pages need source approval.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Ask for usefulness</strong>
              <p>Ask whether this kind of route placement would be useful enough to review further.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="cta-band">
        <ShieldIcon />
        <div>
          <h2>Private preview is ready locally</h2>
          <p>
            The next live-risk decision is whether to protect or remove owner/admin routes before
            any hosted preview, then approve exact recipients and copy.
          </p>
        </div>
        <AppLink className="button primary" to="/for-businesses/submit">
          Test request flow <ArrowRightIcon />
        </AppLink>
      </section>
    </>
  );
}
