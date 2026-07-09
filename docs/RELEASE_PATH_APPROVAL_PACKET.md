# CityAtlas Release Path Approval Packet

Date: 2026-07-07

## Release Target

CityAtlas business-growth funnel on:

- `https://city.univenturestudio.com/for-businesses/pricing`
- `https://city.univenturestudio.com/for-businesses/partner-preview`
- `https://city.univenturestudio.com/for-businesses/book-call`
- `https://city.univenturestudio.com/for-businesses/submit`

Supporting truth that should stay aligned with that funnel:

- the generated business reply proof snapshot
- the generated outreach queue status and approved `100/day` cap
- the local paid-traffic readiness artifact
- the hosted business-funnel smoke report

## Intended Change

Ship the locally verified proof-first business funnel so the live business pages match the current CityAtlas rule:

- start with a free reviewed request first
- show real reply proof instead of future-tense claims
- keep the first reply, short call, and hosted ask cautious
- keep paid packages optional until the fit is clear

This release should also preserve the approved outreach capacity truth:

- `70/day` reviewed restaurant rows
- `30/day` reviewed service-business rows
- `100/day` combined maximum

## Current Verified Truth

### Local Product Proof

- `npm run build` passed on 2026-07-07 and refreshed the current `dist` output.
- `npm run qa:smoke:local` passed on 2026-07-07 after the fresh build.
- Local smoke currently passes:
  - `24` desktop product checks
  - `19` mobile product checks
  - pricing, partner preview, fit call, and business request all rendered successfully on desktop and mobile
- The fit-call page now uses the same `Current reply proof` wording as the stronger business pages, and that wording is covered by local smoke.

### Local Business-Growth Proof

- `npm run growth:verify` passed on 2026-07-07.
- That verifier now confirms:
  - the generated outreach queue status still reports the approved `70 + 30 = 100/day` cap
  - the maintained reply-proof source doc still matches the generated app snapshot and JSON artifact
  - the paid-traffic readiness artifact still includes hosted business-funnel truth
  - all four business routes are still covered by the hosted business-funnel verifier
- Current `growth:verify` business-growth highlights:
  - `sendLimits.restaurant = 70`
  - `sendLimits.service = 30`
  - `sendLimits.total = 100`
  - `businessReplyRail.liveRepliesSent = 3`

### Local Readiness Truth

- `npm run readiness` passed on 2026-07-07.
- Current readiness summary:
  - average readiness: `92%`
  - business outreach machine: `94%`
  - revenue system: `91%`
- The readiness report now explicitly says the next best batch is a clean release lane for the locally verified business proof funnel.

### Hosted Truth

- `npm run qa:business:hosted` reran on 2026-07-07 and still failed honestly with the live site.
- Current hosted business-funnel gaps remain:
  - pricing still lacks the current reply-proof section and proof examples
  - partner preview is still on the older pre-proof framing
  - fit call still lacks the newer reply-proof section and package helper layer
  - business request still lacks the newer question/proof-disclosure flow
- The hosted report still shows `14` failures, which keeps the local-versus-live gap explicit.

### Paid-Traffic Gate Truth

- The current strict paid-traffic artifact still says paid traffic is **not** ready.
- The active blockers are:
  - hosted business funnel is still behind local
  - hosted ad-landing proof still needs the approved deploy and rerun

## Release Safety Truth

Current branch state from the release-safety check:

- repo: `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- branch: `codex/vancouver-release-lane`
- head: `d819ce34c066`
- safety base checked: `origin/codex/vancouver-release-lane`
- local tracking state: behind `1`, ahead `2`
- release-safety status: `blocked_dirty_worktree`

What that means:

- the current branch is **not** safe to deploy from directly
- the working tree still has `29` mixed local changes
- the broader committed diff is much wider than this business-funnel release should be

Additional refresh note:

- a fresh `git fetch origin` was attempted on 2026-07-07
- one sandboxed attempt failed on DNS resolution
- one elevated retry failed with `fetch-pack: invalid index-pack output`
- treat the current local tracking refs as the best available branch-base truth until Git transport is repaired

## Exact Payload To Move Into A Clean Release Lane

The next clean release lane should transplant only the business-growth slice below unless a file proves unnecessary:

- `src/features/business/PricingPage.tsx`
- `src/features/business/PartnerPreviewPage.tsx`
- `src/features/business/BookCallPage.tsx`
- `src/features/business/SubmitBusinessPage.tsx`
- `src/components/BusinessReplyProof.tsx`
- `src/data/businessReplyStatus.ts`
- `scripts/build-cityatlas-business-reply-status.mjs`
- `scripts/lib/cityatlas-business-reply-status.mjs`
- `scripts/lib/cityatlas-daily-send-limits.mjs`
- `scripts/build-cityatlas-outreach-queue-status.mjs`
- `scripts/build-vancouver-restaurant-daily-send-window.mjs`
- `scripts/build-vancouver-service-daily-send-window.mjs`
- `scripts/verify-hosted-business-funnel.mjs`
- `scripts/verify-local-product-smoke.mjs`
- `scripts/verify-paid-traffic-readiness.mjs`
- `scripts/verify-growth-machine.mjs`
- `scripts/verify-hosted-payment-handoff.mjs`
- `scripts/readiness-report.mjs`
- `package.json`
- `README.md`
- `docs/PROJECT.md`
- `docs/READINESS_PROGRESS.md`

Only include `src/lib/businessOutreachPrep.ts`, `src/styles/components.css`, and `src/styles/responsive.css` if the release lane proves they are required by the current business pages or proof surfaces.

## Keep Out Of This Release Unless Separately Re-Approved

Do **not** silently widen this release with:

- homepage, city-hub, planner, guide-detail, or other public-route work outside the four business pages
- unrelated public assets, favicon, sitemap, or crawl-file changes
- broader Greater Vancouver inventory, shortlist, donor-seed, or operator-database changes
- unrelated admin, legal, analytics, or content-machine work that is not required by the business-funnel payload

## Rollback Snapshot

Current documented rollback base from local project docs:

- live production branch family: `origin/codex/vancouver-release-lane`
- documented live production commit: `36cda30`
- documented live production deployment family: the currently public `cityatlas` production aliases

Before any real deploy approval, refresh the hosted deployment status doc with the exact current live deployment identifier so rollback does not depend on stale June status text.

## Post-Deploy Smoke

Immediately after an approved deploy, rerun:

1. `npm run qa:business:hosted`
2. `npm run qa:payments:hosted`
3. `npm run qa:paid-traffic:strict`

The hosted business-funnel smoke must prove:

- pricing shows `Current reply proof`, live reply metrics, and at least `2` proof examples
- partner preview shows the current heading, reply proof, live reply metrics, and at least `2` proof cards
- fit call shows `Current reply proof`, live reply metrics, the package selector, and no preselected package
- business request shows the question-progress label, the first-reply explanation, and the proof-disclosure entry point

## Current Blockers

- current branch is mixed and blocked by release safety
- current tracked release branch is behind its remote by `1` commit
- hosted business funnel is still older than local
- current hosted deployment status doc is stale for a new production action
- Git transport needs repair before branch freshness can be revalidated cleanly against GitHub

## Safest Next Move

1. Repair Git fetch truth for the CityAtlas repo or otherwise confirm the latest live release base.
2. Cut a fresh clean release lane from that base.
3. Transplant only the business-funnel payload listed above.
4. Run `npm run build`, `npm run qa:smoke:local`, `npm run growth:verify`, `npm run readiness`, and `npm run qa:paid-traffic:strict` on that exact release lane.
5. Refresh the rollback snapshot and hosted deployment status doc.
6. Stop for explicit deploy approval before any push or production deploy.

## Approval Needed

Approve a fresh clean CityAtlas release lane that ships only the business-funnel payload above, then reruns hosted smoke on pricing, partner preview, fit call, and business request before any broader CityAtlas changes or paid-traffic decisions.
