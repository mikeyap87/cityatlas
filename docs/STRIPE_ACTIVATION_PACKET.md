# Stripe Activation Packet

Date: 2026-07-01

## Current State

Stripe-hosted Payment Links are active in CityAtlas for the paid business packages. The app does not contain a Stripe SDK, custom checkout route, Checkout Session API call, subscription creation logic, invoice automation, webhook handling, or customer portal.

Verified live handoff:

- City Partner: `https://buy.stripe.com/28EaEXazm3Vc9J27KJcAo01`
- Signature Partner: `https://buy.stripe.com/dRmfZhfTG0J01cw4yxcAo00`

The checkout handoff is guarded by environment variables and visible only when live payments are explicitly enabled.

## Recommended Stripe Model

Use Stripe-hosted Payment Links for the first request-first paid-traffic test. Move to Stripe Billing with custom Checkout Sessions only after real checkout proof and fulfillment operations are clear.

Why:

- CityAtlas is a recurring local-business visibility product.
- Stripe Billing handles renewals, retries, dunning, and subscription state.
- Checkout avoids building custom card handling.
- Customer Portal can later manage upgrades, cancellations, and payment methods.

Accepted planner guide: `iguide_61UrTo5VgsUwF5Cth41I27jKwwm3H`

Chosen path:

- Web subscription product.
- Fixed monthly prices, not usage-based or seat-based.
- Stripe-hosted Payment Links for first paid activation.
- Stripe-hosted Customer Portal later for self-service changes if subscriptions need customer self-service.
- Stripe automatic payment recovery defaults.
- No custom in-app card handling, invoices, subscription-state syncing, or webhook automation in this batch.

## Draft Product Catalog

Use `stripe/products.review.json` as the local review manifest. Do not create, edit, or archive Stripe objects without a separate owner-approved Stripe account action.

| Product | Price | Billing | Purpose |
| --- | ---: | --- | --- |
| CityAtlas Community Listing | $0 | Free/manual | Basic review queue and source metadata |
| CityAtlas City Partner | $49/month | Monthly subscription | First paid package to validate |
| CityAtlas Signature Partner | $149/month | Monthly subscription | Premium anchor package |

## Required Before Calling This Fully Charge-Ready

1. Owner completes one real City Partner checkout from the live site.
2. Stripe dashboard shows the successful payment, customer, amount, and package.
3. The receipt/customer email path is reviewed.
4. The owner confirms refund/cancellation policy and support response expectations.
5. The fulfillment handoff is recorded: what happens after payment, who reviews the business, and what the customer is told.
6. Terms/privacy are reviewed for live payment acceptance.
7. The result is logged in `docs/revenue/PAID_TRAFFIC_READINESS.md` or a follow-on proof packet.

## Recommended First Activation

Start with the live Payment Links already configured, but keep the first campaign request-first and small:

- Product: `CityAtlas City Partner`
- Price: `$49/month`
- Checkout mode: Stripe-hosted Payment Link
- Payment collection: live, owner-controlled proof first
- Fulfillment: manual founder review and monthly visibility snapshot

Only after one successful real checkout should CityAtlas be called fully charge-ready or self-serve verified.

## Approval Needed

This affects money/account state. Changing prices, creating new links, editing Stripe products, refunding payments, or completing a payment as the agent remains approval-gated. The rollback is to disable the live-payment environment flag, remove the Payment Link environment variables, or archive/deactivate the Stripe links in Stripe.

Approval sentence:

`Approved: complete one owner-controlled CityAtlas City Partner checkout from the live site, record the Stripe proof, and do not start paid ad spend until the proof result is logged.`
