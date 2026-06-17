# Release Readiness Checklist

## Verified Locally Before Handoff

- TypeScript typecheck.
- Production build.
- Local homepage HTTP response.
- Desktop visual smoke test from prior local evidence; current screenshot rerun was blocked by the Codex escalated-Chrome usage limit.
- Mobile visual smoke test from prior local evidence; current screenshot rerun was blocked by the Codex escalated-Chrome usage limit.
- Business submission happy path.
- Admin launch console renders.
- Payment surfaces are request-only.
- City Missions route renders on desktop and mobile.
- Planner mission-progress surface renders on true 390px CSS viewport with no horizontal overflow.
- Admin proof sprint panel renders on desktop and mobile.
- Vancouver Date Night proof sprint assets are staged for owner review.
- Founder CRM candidate queue renders on desktop and mobile.
- Owner/admin route protection is explicitly gated before public deploy.
- Private Date Night preview route renders locally.
- Manual reply tracker stores local reply logs only.
- AI Brain command engine renders local module scoring, QA checks, next-best-batch recommendation, gap detection, and saved-run history.
- Draft terms and privacy routes render locally.
- Readiness report generates module percentages and live blockers.
- Hosting/DNS and Stripe activation packets are drafted.
- Vercel project `cityatlas` is linked and deployed.
- Public Vercel alias `https://cityatlas-one.vercel.app` serves the app.
- Protected preview URL returns `HTTP/2 401` without Vercel access.
- Hosted `/admin` and `/private-preview/date-night` render gated pages with hosted flags disabled.
- `city.univenturestudio.com` is live through Cloudflare DNS and a Vercel production alias.
- Custom-domain HTTPS returns `HTTP/2 200` for `/`, `/admin`, and `/private-preview/date-night`.
- Custom-domain browser rendering shows `/admin` and `/private-preview/date-night` as gated hosted routes.
- Post-send proof-sprint approval packet and reply-log template generate through `npm run proof:sprint`.
- Contact-path research and the Date Night revenue proof loop generate through `npm run proof:sprint`.
- Shadow outreach ranking generates through `npm run proof:sprint`.
- Reply outcome summary generates through `npm run replies:analyze`.
- CityAtlas logo, favicon, brand guide, and asset manifest exist.
- Lead-storage activation packet exists for future backend/provider approval.

## Manual Owner Review

- Brand name and domain direction.
- Partner package prices and labels.
- Copy tone for businesses.
- Whether Vancouver remains the first city.
- Legal/compliance posture for real listings and outreach.
- Which first vertical to pursue: restaurants/cafes, wellness, activities/events, or local services.
- Which first City Mission should become real after source-backed content approval.
- Whether Vancouver Date Night is approved as the first real-world proof sprint.
- Which real-business candidates, if any, can be shown in a private preview.
- Exact outreach copy, sender account, recipient list, and send count for any follow-up or second batch.
- Whether candidate source links and fit scores are acceptable for the first manual review batch.
- Whether the shadow ranking is acceptable, or whether the backup/no-send Flyover candidate should be replaced before the first manual batch.
- Whether `/admin` should be auth-gated, removed, or protected before any deploy that includes real candidate records.
- Whether `/private-preview/date-night` can be screen-shared, link-shared, or must stay local-only.
- Whether manual reply log fields are enough for the first 10 to 20 conversations.
- Whether the local reply-summary CSV flow is enough before adding CRM or AI-provider summaries.
- Whether saved AI Brain Runs should stay local-only or graduate to a protected backend table after launch.
- Whether `city.univenturestudio.com` can be publicly shared while robots remain noindex.
- Whether replies justify a second approved manual batch, held-row send, or follow-up.
- Whether Stripe test-mode products can be created from `stripe/products.review.json`.
- Whether 2 to 3 package-demand signals have been logged before Stripe test-mode setup.

## Embarrassment Risks To Avoid

- Accidentally publishing fictional businesses as real.
- Showing "pay now" before Stripe/terms approval.
- Claiming traffic, rankings, or bookings before proof exists.
- Sending outreach from a demo form.
- Importing third-party business data without source rights.
- Deploying with local demo labels removed too early.
- Turning share drafts into real invites before account, consent, unsubscribe, and abuse controls exist.
- Sending founder outreach or private previews before the recipient list and copy are approved.
- Treating the Date Night candidate queue as public listings instead of source-backed research candidates.
- Treating fit score as proof of quality instead of an internal prioritization hint.
- Deploying the unauthenticated owner console while it contains real candidate or private-preview records.
- Sharing the private preview route as if it were a public guide.
- Treating manual reply logs as consent, partnership, or approval.
- Treating AI Brain recommendations as permission to send, publish, charge, or sync externally.
- Treating the shadow ranking as approval to contact anyone.
- Enabling hosted admin/private-preview flags before a protected sharing plan exists.
- Creating Stripe products or prices in the real account before package promise and refund/cancellation policy are approved.

## Acceptance Criteria

CityAtlas can be considered pre-domain launch-package ready when:

- the public app is visually credible on desktop and mobile,
- the business package flow communicates value without taking payment,
- all real-world claims are gated or labeled,
- the owner can see what remains locked,
- the owner can see the next best batch and save local Brain Runs,
- draft terms/privacy and activation packets exist,
- the founder proof sprint has a source policy, review-only outreach, and sales packet,
- the Vercel alias and custom domain are smoke-tested,
- and future payment, indexing, data, and outreach cutovers can be done from documented gates.
