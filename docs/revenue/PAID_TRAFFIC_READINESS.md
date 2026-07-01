# CityAtlas Paid Traffic Readiness

Date: 2026-07-01

## Plain-English Verdict

CityAtlas is ready for a tiny request-first paid-traffic test into reviewed business requests.

It is not yet fully charge-ready or fully self-serve verified because one real successful City Partner checkout has not been completed and reviewed.

## Verified

- Production domain: `https://city.univenturestudio.com`
- Current production deployment: `dpl_Ac5mv3D731WmWuQzqMas9Z6wqMU8`
- Corrected deployment URL: `https://cityatlas-qi49qife6-michael-yaps-projects-92932836.vercel.app`
- Vercel aliases include `https://city.univenturestudio.com`.
- The live homepage serves the final July 1 asset build.
- Hosted browser proof passed for `/for-businesses/pricing`, `/for-businesses/partner-preview`, and `/for-businesses/submit`.
- Pricing shows the reviewed package surface and the visible honesty boundary that payment does not promise publication, placement, traffic, or automatic approval.
- City Partner checkout link is visible on production and points to `https://buy.stripe.com/28EaEXazm3Vc9J27KJcAo01`.
- Signature Partner checkout link is visible on production and points to `https://buy.stripe.com/dRmfZhfTG0J01cw4yxcAo00`.
- Both Stripe-hosted links returned `HTTP/2 200` in a read-only header check.
- GA4 is configured for production and only loads after visitor consent.
- Before analytics consent, the GA script is not injected.
- After analytics consent, the GA script is injected and the runtime state reports consent as granted.
- Local proof passed: `npm run build`, `npm run qa:smoke:local`, and `npm run seo:structure:proof`.

## Not Verified Yet

- No real successful City Partner checkout has been completed in this lane.
- No Stripe dashboard receipt, customer record, successful payment record, or customer email receipt has been reviewed after a real checkout.
- No refund, cancellation, dunning, customer portal, webhook, or subscription lifecycle behavior has been proven.
- No ad spend has been started.
- No ad-platform conversion pixel, audience, campaign, or billing setup has been changed by Codex.
- No automated outreach, provider import, CRM sync, or public real-business publication has been activated.

## Tiny Request-First Paid Test Checklist

Use this only for a very small paid test. The campaign should ask businesses to request review first, not imply guaranteed publication or placement.

1. Use one ad angle only: local Vancouver visibility, reviewed manually.
2. Send traffic to `https://city.univenturestudio.com/for-businesses/pricing`.
3. Add UTMs to every ad URL:
   - `utm_source`
   - `utm_medium`
   - `utm_campaign`
   - `utm_content`
4. Keep the budget deliberately tiny until a request or checkout signal exists.
5. Do not claim guaranteed listing, guaranteed traffic, guaranteed approval, or automated publication.
6. Watch for:
   - pricing-page visits
   - analytics-consent rate
   - business-request submissions
   - checkout clicks
   - Stripe successful payment proof
7. Stop or revise if traffic clicks but no one reaches the business-request or checkout step after the first small batch.

## Real City Partner Checkout Proof Checklist

This is separate from paid traffic. It proves the money path, not the ad path.

1. Owner opens the live pricing page.
2. Owner clicks `Start City Partner checkout`.
3. Owner completes one real City Partner checkout.
4. Owner confirms Stripe shows:
   - successful payment
   - correct package
   - correct amount
   - customer email
   - receipt path
5. Owner confirms the post-payment customer expectation is acceptable.
6. Record the proof result before calling CityAtlas fully charge-ready.

## Stop Boundaries

Codex must stop before:

- starting live ad spend
- changing Stripe account objects
- completing a real checkout
- refunding or canceling a payment
- sending real outreach or follow-ups
- importing provider data
- publishing real-business claims beyond the reviewed public copy
