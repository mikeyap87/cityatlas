# CityAtlas Paid Traffic Readiness

Generated: 2026-07-04

Status: `request_first_paid_traffic_locally_ready_hosted_checkout_verified_checkout_not_fully_verified`

## Revenue Story

- Traffic source: business-side paid traffic for Vancouver operators.
- Landing promise: make a Vancouver business easier to find through one clearer page, guide fit, or offer.
- First useful moment: the business submits one clear request with package interest and a contact path.
- Primary ask: start a business request.
- Revenue event: qualified request that can be reviewed and converted manually, even though the paid partner plans now also have a live hosted-checkout handoff for clear package choices.

## Current Verdict

CityAtlas is now honest for a small request-first paid-traffic test into reviewed business requests.

As of July 1, 2026, the local production build, local desktop/mobile smoke pass, and local paid-traffic verifier are green. The local request path now also adds campaign/referral context to the copied or email-ready business request, and the verifier proved the copied request includes the paid-test UTM context.

That same local July 1 CRO pass also improved the public business funnel itself: the pricing page now explains the first deliverable more clearly, the partner-preview page now explains what the first response should include, and the business-request form now gives guided starting prompts instead of leaving the operator with a blank box. Those funnel changes were re-checked locally in desktop and mobile browser review.

The live domain was also re-checked directly for hosted payment handoff. The hosted pricing page still shows the live City Partner and Signature Partner Stripe checkout links beside the City Partner, Signature, and general request-first paths.

The latest hosted analytics proof is narrower: the live site shows the consent banner before opt-in, loads the GA script only after consent, uses measurement ID `G-43N3DKZYRL`, and records the business-funnel events in CityAtlas browser-side proof state. This latest headless run did not observe a direct Google Analytics `/g/collect` request, so provider-side GA/Ads receipt remains unverified before scaling spend.

As of July 4, 2026, the local Vancouver route-hub guides were also simplified into recommendation-first chooser surfaces for mobile and desktop. The low-friction chooser, itinerary starter pack, and guide-roundup pages now open with a clearer first decision, one stronger selected next click, and a simpler path back to the full guide library. That UX batch was re-checked in the in-app browser on mobile, passed a fresh full local smoke run, passed source and rendered public-copy safety proof, and the local paid-traffic verifier still passed the request-first business funnel against the current multi-step request form.

What is still not fully verified is direct self-serve charging. The live Stripe-hosted checkout links are visible and open, but one real successful City Partner checkout is still missing, so it is not yet honest to call CityAtlas fully charge-ready for public self-serve billing.

## Launch Packet Boundary

Keep these as three separate decisions:

- Tiny paid-traffic test: allowed only as a small request-first test into reviewed business requests. Judge it on qualified request quality, campaign attribution, and whether the owner can follow up manually.
- Local CRO attribution hardening: prepared and locally proven, but not deployed from this lane. It should go through a fresh clean release lane before the live site depends on it.
- Real City Partner checkout proof: a separate live-money proof. It should not be treated as done just because the pricing page shows Stripe links or because the checkout page opens.

Do not combine those decisions in one claim. CityAtlas can be locally ready for a request-first paid-traffic packet while still needing an approved release for the latest attribution hardening and a separate real checkout proof before self-serve charging claims.

## What Is Ready

- The business pricing page keeps the reviewed-request path clear and also exposes the live Stripe-hosted checkout handoff for City Partner and Signature Partner when the package choice is already clear.
- The package cards route into the business request form with package interest preserved.
- The request form creates a local business submission, can open an email draft, and now offers a copy fallback if `mailto:` does not open cleanly.
- Campaign context is captured from UTM parameters and attached to local growth events.
- Business-funnel CTAs now emit local events for pricing views, package clicks, form views, saved requests, and email-draft intent.
- A fresh local smoke pass on 2026-07-01 passed desktop and mobile homepage, city, guides, business detail, planner, pricing, partner-preview, and business-request flows.
- A fresh local browser pass on 2026-07-01 confirmed the planner and saved-plan route layer on desktop and mobile now gives route timing, travel-mode switching, Google Maps handoff links, share text, reorderable saved-plan rows, explicit route feedback, and visited/skipped progress states. Inline Maps embeds remain optional and are not yet proven in the current runtime.
- A fresh local paid-traffic proof on 2026-07-01 passed the request-first funnel through `business_request_saved_for_later` with `measurementReady: true`, `localBusinessFunnelPassed: true`, and `copiedRequestHasCampaignContext: true`.
- A fresh local CRO pass on 2026-07-01 also re-checked pricing, partner-preview, and submit behavior in desktop/mobile browser review after the first-deliverable and guided-request improvements.
- A fresh hosted analytics proof on 2026-07-01 confirmed consent-gated GA script loading, measurement ID `G-43N3DKZYRL`, and hosted browser-side business-funnel event state. Direct GA collect-network proof was not observed in that run.
- The hosted pricing page still shows the live City Partner and Signature Partner Stripe handoff links beside the request-first review path.
- The live pricing page rendered successfully on `city.univenturestudio.com` during the July 1 hosted payment-handoff pass, with request-first review paths still visible beside checkout.
- `npm run qa:paid-traffic` runs a browser proof for the paid-traffic business path and writes `output/qa/paid-traffic-readiness.json`.

## Remaining Caution

- Qualified-request quality is still unproven with real business traffic.
- The latest campaign-context improvement is proven locally but not deployed from this lane.
- In this managed continuation lane, a new rerun of `npm run qa:paid-traffic` could not be completed because the verifier's preview port could not bind inside the constrained shell. Treat the current proof for this CRO pass as local build plus browser proof, not a brand-new verifier artifact.
- The latest hosted analytics proof did not observe direct Google Analytics collect requests, so provider-side conversion receipt remains unverified before scaling spend.
- Direct self-serve revenue is still unproven because the checkout handoff is now live, but a real successful City Partner checkout has not been proven yet.
- The Stripe-hosted checkout pages open, but no no-charge provider-side success proof exists for the final payment-confirmation state.
- The local repo still contains old backup folders and build-output clutter that should be cleaned in a separate repo-health pass, even though the current local build and smoke commands are working again.
- In this continuation lane, `git status` could not produce a clean worktree read because the local Git object database reports a missing tree object. Use a repaired clone or fresh release lane before any deploy, push, or release-branch cleanliness claim.

## Minimum Before Launching A Tiny Paid Test

1. Keep the first paid test small and judge it on qualified-request quality, not raw click volume.
2. Use the request-first offer, not a fake instant-purchase promise.
3. Keep the live landing focused on reviewed business requests first, with checkout as a secondary path only when package fit is already clear.
4. Prefer deploying the local campaign-context hardening through a fresh clean release lane before spend starts.
5. Rerun hosted pricing/payment proof and hosted analytics proof after any approved release.
6. Treat missing provider-side GA/Ads receipt as a reason not to scale until account-side receipt is confirmed.

## Minimum Before Self-Serve Charging Claims

1. Prove one real live City Partner checkout.
2. Confirm Stripe created the live customer and subscription against the expected City Partner price.
3. Confirm the buyer follow-up path is clear.
4. Only then call the hosted City Partner handoff charge-ready.

## Tiny Request-First Paid Test Checklist

This is the smallest honest paid-traffic launch packet:

1. Use the request-first business offer, not a self-serve checkout promise.
2. Send traffic to the live business path on `city.univenturestudio.com`.
3. Confirm the landing route, pricing route, partner-preview route, and business-request form still render before spend starts.
4. Confirm consent-based GA4 setup is active and the request-first path records `page_view`, `business_pricing_viewed`, `business_package_cta_clicked`, `business_request_form_viewed`, `business_submission_saved`, and `business_request_saved_for_later` in CityAtlas proof state.
5. Confirm provider-side GA/Ads receipt before scaling beyond the tiny test.
6. Keep the first budget deliberately small.
7. Review every submitted business request manually before any public listing, paid package recommendation, or follow-up.
8. Stop the test if requests are low-fit, attribution is missing, or the owner cannot review/respond manually.

## Real City Partner Checkout Proof Checklist

This is separate from the paid-traffic test:

1. Start from a live CityAtlas paid surface that opens the hosted City Partner checkout link.
2. Confirm Stripe shows `CityAtlas City Partner` at `$49.00 CAD / month`.
3. Complete one real live checkout only after owner approval for the live payment.
4. Confirm Stripe created the live customer and live subscription against `price_1TmLDBI27jKwwm3H1gUFgwU6`.
5. Confirm the manual follow-up path is clear for the buyer.
6. Only then describe the hosted City Partner handoff as charge-ready. Do not imply custom billing, automatic fulfillment, portal access, or instant publication.

## Proof Command

```bash
npm run qa:paid-traffic
```

If a managed shell blocks the verifier from starting its own preview server, use the exact direct proof lane below after `npm run preview` is already serving `http://127.0.0.1:4178/`:

```bash
CITYATLAS_PAID_TRAFFIC_PORT=4178 CITYATLAS_PAID_TRAFFIC_USE_EXISTING_SERVER=1 npm run qa:paid-traffic
```

Use strict mode only when the site is expected to be fully paid-traffic ready:

```bash
npm run qa:paid-traffic:strict
```

Strict mode should fail while hosted proof, provider-side analytics receipt, or other live-spend gates are blocked.

## Next Best Move

Use a fresh clean release lane to carry the local campaign-context hardening through an approved deploy, rerun hosted proof, then start only a tiny request-first paid test. Keep the real City Partner checkout proof as a separate live-money approval step.
