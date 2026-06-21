# CityAtlas Paid Traffic Readiness

Generated: 2026-06-20

Status: `local_funnel_ready_measurement_blocked`

## Revenue Story

- Traffic source: business-side paid traffic for Vancouver operators.
- Landing promise: make a Vancouver business easier to find through one clearer page, guide fit, or offer.
- First useful moment: the business submits one clear request with package interest and a contact path.
- Primary ask: start a business request.
- Revenue event: qualified request that can be reviewed before payment opens.

## Current Verdict

CityAtlas is stronger locally, but it should not buy paid traffic yet.

The business funnel can be proven locally from campaign arrival to package interest to saved request. The remaining blocker is measurement and hosted parity: paid traffic needs real analytics, hosted conversion-event proof, and a simple review loop for judging lead quality.

## What Is Ready Locally

- The business pricing page explains that checkout is not open yet and that the first conversion is a reviewed request.
- The package cards route into the business request form with package interest preserved.
- The request form creates a local business submission and can open an email draft.
- Campaign context is captured from UTM parameters and attached to local growth events.
- Business-funnel CTAs now emit local events for pricing views, package clicks, form views, saved requests, and email-draft intent.
- `npm run qa:paid-traffic` runs a browser proof for the paid-traffic business path and writes `output/qa/paid-traffic-readiness.json`.

## Paid-Traffic Blockers

- No external analytics destination is configured yet.
- Hosted conversion-event proof has not been rerun after this local batch.
- No paid-ad landing path has been verified on the production domain in this lane.
- Stripe/payment acceptance remains intentionally disabled until package demand is proven and separately approved.

## Minimum Before Buying Traffic

1. Configure a real analytics destination with approved environment variables.
2. Deploy only after release safety approval.
3. Run hosted smoke for the business landing page, pricing page, and request form.
4. Confirm analytics records these events:
   - `page_view` with campaign context
   - `business_funnel_cta_clicked`
   - `business_pricing_viewed`
   - `business_package_cta_clicked`
   - `business_request_form_viewed`
   - `business_submission_saved` or `business_request_email_draft_opened`
5. Review the first paid clicks against qualified-request rate, not raw traffic or button clicks.

## Proof Command

```bash
npm run qa:paid-traffic
```

Use strict mode only when the site is expected to be fully paid-traffic ready:

```bash
npm run qa:paid-traffic:strict
```

Strict mode should fail until analytics and hosted proof are real.

## Next Best Move

Prepare a release packet for the image layer plus business-funnel instrumentation, then approve a hosted smoke lane before any paid traffic spend.
