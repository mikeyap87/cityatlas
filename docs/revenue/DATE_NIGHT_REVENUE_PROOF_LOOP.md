# Date Night Revenue Proof Loop

Generated: 2026-06-14T07:10:06.612Z

Status: `measurement_ready_no_payment`

## Business Question

Will Vancouver date-night prospects show enough interest in a private CityAtlas preview and founding partner package to justify Stripe test-mode setup?

## Current Autonomy Stage

- Current: Post-send monitoring
- Next: Reply and bounce learning before any follow-up, Stripe setup, or second manual batch.

## Experiment Plan

- Control: No customer-facing outreach; public package page only shows payment-disabled founding partner packages.
- Variant: Six owner-approved manual first-touch emails are sent; reply, bounce, and package-demand outcomes determine the next decision.
- Audience: Owner-reviewed restaurants, bars, dessert, culture, and experience operators in the Vancouver Date Night wedge.
- Primary metric: 2 to 3 qualified package or private-preview demand signals from 10 manually contacted prospects.
- Minimum evidence threshold: 10 outcomes, 5 meaningful replies, or one serious risk concern, whichever happens first.
- Stop rule: Pause immediately on any consent/privacy/brand-use concern, or after 10 outcomes without meaningful interest.
- Winner rule: Proceed to Stripe test-mode product setup only after 2 to 3 prospects ask for pricing, partnership details, hosted collaboration, or a next-step demo.
- Confidence: No signal

## Guardrails

- No recipient confusion that payment or public listing is active.
- No brand-use, data-use, consent, or image-rights concern.
- No unsupported traffic, ranking, award, booking, or popularity claim.
- No automated sending, CRM sync, provider import, or Stripe action.

## AI Brain Learning Fields

- segment
- route_angle
- contact_confidence
- channel
- sentiment
- objection
- private_preview_requested
- package_or_pricing_signal
- next_action

## Approval Needed Before Live Action

New explicit approval before any follow-up, held-row send, Stripe action, provider import, or public claim.

## Rollback

Do not send further messages; keep Stripe disabled; mark any problematic candidate blocked; update source policy and copy.

## Next Step

Monitor the first manual batch, log every reply or bounce, then run `npm run replies:analyze`. Stripe stays disabled until the winner rule is met and a separate Stripe approval is given.
