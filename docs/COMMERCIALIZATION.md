# Commercialization Plan

## Best Launch Motion

Sell CityAtlas first as a founder-led local media and growth package, not as a passive directory.

The first monetizable wedge is Vancouver Date Night. It is the cleanest route-based proof sprint because the buyer value is easy to explain: get placed inside a plan people can save, share, and act on.

The broader Vancouver founding partner package should still expand into visually strong local businesses:

- restaurants and cafes
- wellness, spa, massage, recovery
- activities and local experiences
- event venues and operators

## Public Product Offer

CityAtlas helps a business get:

- a clean local feature page
- guide/category/neighborhood placement review
- an offer or event module
- an AI visibility snapshot
- a future creator visit brief
- founder-partner status during the Vancouver launch

## Pricing UI In The App

- Community Listing: `$0 CAD / month`
- City Partner: `$49 CAD / month planned`
- Signature Partner: `$149 CAD / month planned`

Vancouver and Greater Vancouver prices should be CAD. Future US-city prices should be USD with clean rounded price points, not direct exchange-rate conversions.

CityAtlas now supports a gated Stripe-hosted checkout handoff for the two paid plans when `VITE_CITYATLAS_ENABLE_LIVE_PAYMENTS=true` and the matching payment-link env vars are populated. That hosted wiring is now live on the public pricing page, but one real checkout proof is still required before calling self-serve charging fully verified.

## What To Validate Before Stripe

- Which segment replies first.
- Which official-source contact paths are easiest to verify.
- Whether businesses prefer hosted collaboration, one-time feature fee, or monthly package.
- Whether package prices should start lower, higher, or as founding-partner limited offers.
- What objections appear around audience size and proof.
- Whether the first sales motion should be email, Instagram DM, in-person, or warm intros.

## First 30-Day Revenue Test

1. Keep this package local or private-preview only.
2. Start with the Date Night candidate queue in `docs/PROOF_SPRINT_DATE_NIGHT.md`.
3. Review official contact paths in `docs/proof-sprints/DATE_NIGHT_CONTACT_PATHS_RESEARCH.md`.
4. Review the shadow send/no-send order in `docs/proof-sprints/DATE_NIGHT_SHADOW_OUTREACH_RANKING.md`.
5. Owner approves the exact first recipients, contact paths, sender/channel, and first-touch copy.
6. Manually contact only the approved recipients after message approval.
7. Log outcomes and run `npm run replies:analyze`.
8. Aim for 5 replies and 2 to 3 hosted collaboration or package-demand signals.
9. Convert one collaboration into a paid founding package only after terms, fulfillment promise, and payment approval.

## Founder Proof Sprint Assets

- `docs/PROOF_SPRINT_DATE_NIGHT.md`
- `docs/FOUNDER_CRM_OPERATING_SYSTEM.md`
- `docs/PRIVATE_PREVIEW_ROUTE_BRIEF_DATE_NIGHT.md`
- `docs/FOUNDER_PARTNER_SALES_PACKET.md`
- `docs/OUTREACH_DRAFTS_REVIEW_ONLY.md`
- `docs/REAL_WORLD_SOURCE_POLICY.md`
- `docs/proof-sprints/DATE_NIGHT_CONTACT_PATHS_RESEARCH.md`
- `docs/proof-sprints/DATE_NIGHT_SHADOW_OUTREACH_RANKING.md`
- `docs/proof-sprints/DATE_NIGHT_SEND_WINDOW_APPROVAL.md`
- `docs/proof-sprints/DATE_NIGHT_REPLY_SUMMARY.md`
- `docs/revenue/DATE_NIGHT_REVENUE_PROOF_LOOP.md`

## Cut From First Public Launch

- multi-city expansion
- custom in-app self-serve checkout
- automated cold outreach
- unreviewed Google Places imports
- public real-business pages without consent or source policy
- traffic or booking guarantees
