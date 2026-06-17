# Growth Experiments

CityAtlas is not traffic-ready for statistically rigorous A/B testing yet. The current system is **directional learning ready**: it can expose local variants, record local events, and help the owner compare message clarity before public analytics are approved.

## Active Local Variants

- `/?variant=control`
- `/?variant=founding-partner`
- `/?variant=weekend-atlas`

## Top Experiments

### 1. Founding Partner Positioning

- Hypothesis: Businesses will respond better to "founding partner" than generic "for businesses" language.
- Primary metric: business review request submissions.
- Guardrail: confusion about live payment availability.
- Current implementation: homepage variant plus package request flow.

### 2. Weekend Atlas Consumer Loop

- Hypothesis: Locals will be more likely to save and share if the product is framed around weekend planning.
- Primary metric: planner saves and mission saves.
- Guardrail: users misunderstanding demo data as real recommendations.
- Current implementation: planner route, mission cards, city mission route page, save-all actions, and save/share draft loop.

### 3. City Missions Retention Primitive

- Hypothesis: Users are more likely to return and refer when CityAtlas gives them a focused route instead of an open-ended directory.
- Primary metric: `city_mission_saved`, saved items per visitor, planner share draft staged.
- Guardrail: routes must not imply real recommendations until listings are sourced and approved.
- Current implementation: `/vancouver/missions`, homepage mission cards, planner mission progress, admin growth radar.

### 4. Pricing Anchor

- Hypothesis: A three-tier pricing page will make City Partner feel like the natural first paid package.
- Primary metric: package interest selection.
- Guardrail: lower trust if pricing appears live before Stripe approval.
- Current implementation: local revenue experiment records and payment-locked UI.

### 5. Founder CRM Candidate Quality

- Hypothesis: A ranked, source-backed candidate queue will create better manual outreach decisions than an unstructured prospect list.
- Primary metric: meaningful replies or private-demo requests from owner-reviewed candidates.
- Guardrail: candidates must not be treated as public listings, endorsements, or approved send recipients.
- Current implementation: admin Founder CRM panel, 10 Date Night candidates, fit scores, route angles, approval status, outreach status, contact confidence, and shadow send/no-send roles.

### 6. Private Preview Route Clarity

- Hypothesis: Showing a private Date Night route preview will create clearer prospect conversations than describing CityAtlas abstractly.
- Primary metric: private preview requests, positive demo replies, and fewer "what is this?" objections.
- Guardrail: preview must not imply a public listing, endorsement, partnership, traffic claim, or payment activation.
- Current implementation: `/private-preview/date-night`, noindex posture, review-only copy, and admin manual reply tracker.

### 7. AI Brain Run Cadence

- Hypothesis: Saving a local Brain Run before and after each proof sprint will make the owner choose better next actions with less manual status reconstruction.
- Primary metric: fewer unresolved gaps and higher average module progress after each proof loop.
- Guardrail: Brain Runs must remain local until analytics, CRM, and provider data policies are approved.
- Current implementation: admin AI Brain command engine, local QA checks, next-best-batch recommendation, and saved Brain Run history.

### 8. Shadow Outreach Ranking

- Hypothesis: A dry-run send/no-send ranking will help the owner choose better recipients before any live outreach.
- Primary metric: match between shadow-ranked candidates, owner-approved recipients, and later reply quality.
- Guardrail: ranking is not permission to send; exact recipient, contact path, channel, copy, and logging still need approval.
- Current implementation: admin shadow-mode decision log plus `docs/proof-sprints/DATE_NIGHT_SHADOW_OUTREACH_RANKING.md`.

### 9. Reply Learning Summary

- Hypothesis: Summarizing reply CSV outcomes will reveal package demand and objections before Stripe setup.
- Primary metric: 2 to 3 qualified package, pricing, or hosted-collaboration signals.
- Guardrail: summary is not permission to create Stripe objects, sync CRM data, or send follow-ups.
- Current implementation: `npm run replies:analyze` generates `docs/proof-sprints/DATE_NIGHT_REPLY_SUMMARY.md`.

## Measurement Plan

Track locally until analytics approval:

- `page_view`
- `experiment_exposed`
- `newsletter_lead_saved`
- `item_saved`
- `item_unsaved`
- `city_mission_saved`
- `planner_share_draft_prepared`
- `business_submission_saved`
- `proof_candidate_reviewed`
- `private_preview_requested`
- `manual_outreach_approved`
- `manual_outreach_reply_logged`
- `ai_brain_run_saved`
- `private_preview_viewed`
- `private_preview_requested`
- `shadow_outreach_reviewed`
- `reply_summary_generated`

Future analytics approval should add:

- anonymous visitor ID
- traffic source
- CTA click
- form start
- form completion
- package selected
- referral code copied/shared
- mission selected
- mission completion
- partner close outcome

## Success Threshold Before Stripe Test Mode

Do not create Stripe test-mode objects from UI polish alone. Require:

- 10 contact-reviewed business prospects
- a no-send shadow ranking with no blocked manual lookups
- exact sender/channel/copy approval before any outreach
- 2 to 3 qualified package, pricing, or hosted-collaboration demand signals
- approved draft price, terms, refund policy, and fulfillment promise

## Success Threshold Before Live Payments

Do not enable live payment acceptance until test-mode setup and manual proof are stronger. Require:

- at least 20 manually sourced business prospects across one or more proof loops
- 5 meaningful replies or conversations
- 2 to 3 yeses to a package or hosted collaboration
- approved price, terms, refund policy, and fulfillment promise
