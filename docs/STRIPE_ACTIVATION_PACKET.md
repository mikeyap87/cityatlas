# Stripe Activation Packet

Date: 2026-06-14

## Current State

Stripe is not active in CityAtlas. The app has package framing, but no Stripe SDK, checkout route, payment link, subscription creation, invoice creation, or webhook handling.

## Recommended Stripe Model

Use Stripe Billing with Checkout Sessions for subscriptions.

Why:

- CityAtlas is a recurring local-business visibility product.
- Stripe Billing handles renewals, retries, dunning, and subscription state.
- Checkout avoids building custom card handling.
- Customer Portal can later manage upgrades, cancellations, and payment methods.

Accepted planner guide: `iguide_61UrTo5VgsUwF5Cth41I27jKwwm3H`

Chosen path:

- Web subscription product.
- Fixed monthly prices, not usage-based or seat-based.
- Stripe-hosted Checkout for first paid activation.
- Stripe-hosted Customer Portal later for self-service changes.
- Stripe automatic payment recovery defaults.
- No live checkout links, invoices, subscriptions, or payment acceptance in this batch.

## Draft Product Catalog

Use `stripe/products.review.json` as the local review manifest. Do not create these in Stripe until approved.

| Product | Price | Billing | Purpose |
| --- | ---: | --- | --- |
| CityAtlas Community Listing | $0 | Free/manual | Basic review queue and source metadata |
| CityAtlas City Partner | $49/month | Monthly subscription | First paid package to validate |
| CityAtlas Signature Partner | $149/month | Monthly subscription | Premium anchor package |

## Required Before Creating Stripe Objects

1. Owner approves package names and prices.
2. Owner approves fulfillment promise.
3. Owner approves refund/cancellation policy.
4. Owner approves support process and response SLA.
5. Owner approves whether Stripe objects are test-mode first or live-mode.
6. Terms/privacy are reviewed.
7. First proof sprint has at least 2 to 3 meaningful package yeses or strong hosted-collaboration intent.
8. `npm run replies:analyze` has produced 2 to 3 qualified package-demand or hosted-collaboration signals.
9. `docs/revenue/DATE_NIGHT_REVENUE_PROOF_LOOP.md` is updated with the logged demand signal and confidence level.

## Recommended First Activation

Start with test-mode Stripe objects only:

- Product: `CityAtlas City Partner`
- Price: `$49/month`
- Checkout mode: subscription
- Payment collection: test mode
- Fulfillment: manual founder review and monthly visibility snapshot

Only after test-mode proof should live-mode payment links or Checkout be enabled.

## Approval Needed

This affects money/account state. It may create billing objects, checkout links, or subscription surfaces in Stripe. The rollback is to archive/deactivate test objects or disable payment links before sharing.

Approval sentence:

`Approved: create CityAtlas Stripe test-mode products and prices from stripe/products.review.json only; do not enable live payment acceptance or publish checkout links yet.`
