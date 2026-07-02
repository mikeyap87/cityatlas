# CityAtlas Paid Traffic Readiness

Generated: 2026-07-01

Status: `request_first_paid_traffic_hosted_route_cro_ready_checkout_not_fully_verified`

## Revenue Story

- Traffic source: business-side paid traffic for Vancouver operators.
- Landing promise: make a Vancouver business easier to find through one clearer page, guide fit, or offer.
- First useful moment: the business submits one clear request with package interest and a contact path.
- Primary ask: start a business request.
- Revenue event: qualified request that can be reviewed and converted manually, even though the paid partner plans now also have a live hosted-checkout handoff for clear package choices.

## Current Verdict

CityAtlas is now honest for a small request-first paid-traffic test into reviewed business requests.

As of July 1, 2026, the local production build, local desktop/mobile smoke pass, local route-map verifier, rendered route-map verifier, rendered public-copy verifier, local paid-traffic verifier, hosted payment-handoff verifier, hosted route-map verifier, hosted analytics instrumentation verifier, and live in-app Browser route check are green. The local request path now also adds campaign/referral context to the copied or email-ready business request, and the verifier proved the copied request includes the paid-test UTM context.

The latest CRO route batch is live and makes CityAtlas more useful for visitors before a paid test: direct route pages show plan-length controls, travel-mode controls, Google Maps handoff, embedded Google route preview when the Maps key is present, visible stop order, mini itinerary timing, no-login route save/checkoff/skip controls, skip reasons, alternate-stop links, shareable route links with a manual copy fallback, route-specific business review CTA, suggested route window, typical stop duration, best mode, and selected-route count. Route chooser pages show multiple mapped route options with stop counts and timing metadata, and guide quick-answer cards now include route-map jump links so mobile users can reach the map path without hunting. Hosted route-map proof passed after the production deploy.

The live domain was also re-checked directly for hosted payment handoff. The hosted pricing page still shows the live City Partner and Signature Partner Stripe checkout links beside the City Partner, Signature, and general request-first paths.

The latest hosted analytics proof is narrower: the live site shows the consent banner before opt-in, loads the GA script only after consent, uses measurement ID `G-43N3DKZYRL`, and records the business-funnel events in CityAtlas browser-side proof state. This latest headless run did not observe a direct Google Analytics `/g/collect` request, so provider-side GA/Ads receipt remains unverified before scaling spend.

What is still not fully verified is direct self-serve charging. The live Stripe-hosted checkout links are visible and open, but one real successful City Partner checkout is still missing, so it is not yet honest to call CityAtlas fully charge-ready for public self-serve billing.

## Launch Packet Boundary

Keep these as three separate decisions:

- Tiny paid-traffic test: allowed only as a small request-first test into reviewed business requests. Judge it on qualified request quality, campaign attribution, and whether the owner can follow up manually.
- CRO attribution and route-map hardening: deployed from the current clean CRO release lane and hosted-smoked on the approved domain. The proof covers direct route pages, route chooser pages, desktop, and mobile, including suggested route windows, per-stop duration guidance, no-login route progress controls, plan-length controls, travel-mode controls, mini itineraries, shareable route links, manual copy fallback, alternate-stop links, route-specific business review CTA, and embedded Google iframe presence.
- Google Maps embedded previews: live and hosted-smoked on the approved domain. The normal `Open route in Google Maps` links still require no Google API key; the optional on-page iframe previews use the production `VITE_GOOGLE_MAPS_EMBED_API_KEY` env var. The key restriction status remains account-side proof; do not scale spend around embedded map claims unless the key is confirmed restricted to Maps Embed API and exact CityAtlas referrers.
- Real City Partner checkout proof: a separate live-money proof. It should not be treated as done just because the pricing page shows Stripe links or because the checkout page opens.

Do not combine those decisions in one claim. CityAtlas can be ready for a tiny request-first paid-traffic packet while still needing provider-side GA/Ads receipt before scaling and a separate real checkout proof before self-serve charging claims.

Use `docs/revenue/ROUTE_VALUE_ROADMAP.md` for the route utility, accounts, reviews, business insight, and adaptive AI sequence. The short version is: no-login route utility first, route alternatives next, accounts later, adaptive replacement only after enough aggregate signal and owner review.

## What Is Ready

- The business pricing page keeps the reviewed-request path clear and also exposes the live Stripe-hosted checkout handoff for City Partner and Signature Partner when the package choice is already clear.
- The package cards route into the business request form with package interest preserved.
- The request form creates a local business submission, can open an email draft, and now offers a copy fallback if `mailto:` does not open cleanly.
- Campaign context is captured from UTM parameters and attached to local growth events.
- Business-funnel CTAs now emit local events for pricing views, package clicks, form views, saved requests, and email-draft intent.
- A fresh local smoke pass on 2026-07-01 passed desktop and mobile homepage, city, guides, business detail, planner, pricing, partner-preview, and business-request flows.
- A fresh local route-map proof on 2026-07-01 passed `16` starter collections, `19` direct route guides, `6` route chooser guides, and `23` chooser option maps.
- A fresh rendered route-map proof on 2026-07-01 passed `41` route surfaces across `82` desktop/mobile checks with zero failures, including route save, visited, skipped, skip-reason controls, alternate-stop links, planner controls, mini itinerary, route-specific business CTA, and Google iframe presence when `CITYATLAS_EXPECT_ROUTE_MAP_EMBED=1` is set.
- A fresh in-app Browser pass on 2026-07-01 confirmed Date Night and Rainy Day route pages on desktop and mobile with plan length, transit mode, embedded map handoff, Google Maps handoff, saved progress, skip reason, alternate-stop links, shareable route-link fallback, route-specific business review CTA, no console errors, no framework overlay, and no horizontal overflow.
- The optional Maps Embed API URL builder is locally verified with a fake key for URL shape, directions mode, origin, destination, waypoints, and mode, and the real local ignored env key has passed rendered iframe-presence proof.
- A fresh rendered public-copy proof on 2026-07-01 passed `52` public routes with zero internal-copy findings.
- A fresh local paid-traffic proof on 2026-07-01 passed the request-first funnel through `business_request_saved_for_later` with `measurementReady: true`, `localBusinessFunnelPassed: true`, and `copiedRequestHasCampaignContext: true`.
- A fresh hosted analytics proof on 2026-07-01 confirmed consent-gated GA script loading, measurement ID `G-43N3DKZYRL`, and hosted browser-side business-funnel event state. Direct GA collect-network proof was not observed in that run.
- A fresh hosted route-map proof on 2026-07-01 passed `41` route surfaces across `82` desktop/mobile checks on `https://city.univenturestudio.com` with `CITYATLAS_EXPECT_ROUTE_MAP_EMBED=1` and zero failures.
- A fresh live in-app Browser pass on 2026-07-01 confirmed the live Date Night mobile route page has plan length, transit mode, embedded Google map iframe, Google Maps transit handoff, manual route-link fallback, route-specific business CTA, no console warnings/errors, and no horizontal overflow.
- The hosted pricing page still shows the live City Partner and Signature Partner Stripe handoff links beside the request-first review path.
- The live pricing page rendered successfully on `city.univenturestudio.com` during the July 1 hosted payment-handoff pass, with request-first review paths still visible beside checkout.
- `npm run qa:paid-traffic` runs a browser proof for the paid-traffic business path and writes `output/qa/paid-traffic-readiness.json`.

## Remaining Caution

- Qualified-request quality is still unproven with real business traffic.
- The latest campaign-context and route-map CRO improvements are deployed and hosted-smoked, but real paid-click behavior is still unproven.
- On-page embedded Google map previews are live and hosted-smoked. Because the Maps key was pasted through chat during setup, treat account-side key restriction as unverified unless Google Cloud confirms it is restricted to Maps Embed API only and exact allowed CityAtlas referrers.
- Accounts, cross-device saved routes, public reviews, and adaptive route replacement are not live. The honest sequence is no-login route utility first, then optional sign-in after privacy, data-retention, moderation, and support boundaries are approved.
- The latest hosted analytics proof did not observe direct Google Analytics collect requests, so provider-side conversion receipt remains unverified before scaling spend.
- Direct self-serve revenue is still unproven because the checkout handoff is now live, but a real successful City Partner checkout has not been proven yet.
- The Stripe-hosted checkout pages open, but no no-charge provider-side success proof exists for the final payment-confirmation state.
- The local repo still contains old backup folders and build-output clutter that should be cleaned in a separate repo-health pass, even though the current local build and smoke commands are working again.
- Future production deploys, live spend, and real payment proof remain approval-gated.

## Minimum Before Launching A Tiny Paid Test

1. Keep the first paid test small and judge it on qualified-request quality, not raw click volume.
2. Use the request-first offer, not a fake instant-purchase promise.
3. Keep the live landing focused on reviewed business requests first, with checkout as a secondary path only when package fit is already clear.
4. The campaign-context and route-map hardening are deployed and hosted-smoked; rerun hosted proof after any future release.
5. Keep hosted pricing/payment proof and hosted analytics proof green after any future release.
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
4. Confirm the live route pages still show Google Maps handoffs, embedded route previews, suggested route windows, typical stop durations, plan-length and travel-mode controls, mini itineraries, shareable route links, route save/checkoff/skip controls, alternate-stop links, route-specific business review CTAs, and chooser-page mapped options.
5. Confirm consent-based GA4 setup is active and the request-first path records `page_view`, `business_pricing_viewed`, `business_package_cta_clicked`, `business_request_form_viewed`, `business_submission_saved`, and `business_request_saved_for_later` in CityAtlas proof state.
6. Confirm provider-side GA/Ads receipt before scaling beyond the tiny test.
7. Keep the first budget deliberately small.
8. Review every submitted business request manually before any public listing, paid package recommendation, or follow-up.
9. Treat route-save/checkoff/skip behavior as product-value support for the traffic story, not as proof that accounts, AI personalization, or business insight reporting are live.
10. Stop the test if requests are low-fit, attribution is missing, or the owner cannot review/respond manually.

## Google Maps Embed API Checklist

The embedded route previews are live and hosted-smoked. Use this checklist for future Maps-key changes or account-side restriction proof. The normal `Open route in Google Maps` links still work without an API key.

1. Start from the clean Google Cloud `CityAtlas` project at project id `cityatlas-501120`.
2. Enable Maps Embed API only for this use case.
3. Create or rotate a browser-visible API key and restrict it to the exact CityAtlas web referrers, including `https://city.univenturestudio.com/*` and the approved Vercel preview domains used for release proof.
4. Restrict the same key to Maps Embed API only.
5. Add the key as `VITE_GOOGLE_MAPS_EMBED_API_KEY` in the intended local or Vercel environment.
6. Rerun `npm run qa:route-maps`, `npm run qa:route-maps:rendered:compact`, `CITYATLAS_EXPECT_ROUTE_MAP_EMBED=1 npm run qa:route-maps:rendered:compact`, and, after an approved deploy, `npm run qa:route-maps:hosted:compact`.
7. Verify a live route page renders an iframe with `data-route-map-embed="google"` before saying embedded route maps are live.

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

Use these route-map proof commands before and after any deploy carrying the route UX:

```bash
npm run qa:route-maps
npm run qa:route-maps:rendered:compact
npm run qa:route-maps:hosted:compact
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

Start only a tiny request-first paid test into reviewed business requests, with manual review of every lead and no self-serve charging claim. Keep the real City Partner checkout proof as a separate live-money approval step.
