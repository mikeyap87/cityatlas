# CityAtlas Stripe Activation Packet

Date: 2026-06-25
Re-anchored: 2026-07-01

This packet is intentionally narrow. It now preserves the exact live Stripe payment-link truth, the env values that must stay wired, the first real checkout proof still required, and what remains out of scope.

## 1) The Two Exact Live Stripe Payment Links That Must Exist

No third paid link is needed in this batch. `Community Listing` stays free and review-first.

- `CityAtlas City Partner`
  - Stripe account: `acct_1TWOnaI27jKwwm3H`
  - live product: `prod_UlpKqAPmxKrw1A`
  - live recurring price: `price_1TmLDBI27jKwwm3H1gUFgwU6`
  - expected offer shown to the buyer: `$49.00 CAD / month`
  - live payment link: `https://buy.stripe.com/28EaEXazm3Vc9J27KJcAo01`

- `CityAtlas Signature Partner`
  - Stripe account: `acct_1TWOnaI27jKwwm3H`
  - live product: `prod_UlsHzdgsuSlgll`
  - live recurring price: `price_1TmLHII27jKwwm3HVtE0CtqB`
  - expected offer shown to the buyer: `$149.00 CAD / month`
  - live payment link: `https://buy.stripe.com/dRmfZhfTG0J01cw4yxcAo00`

Local public-checkout verification from this lane confirmed the first link renders `CityAtlas City Partner` and the second renders `CityAtlas Signature Partner`. In a US-locale browser, Stripe currently shows a localized USD amount first with a visible CAD toggle, but the links map to the correct CityAtlas packages above.

## 2) Historical Dashboard Steps Used To Create Them

1. Sign in to the live Univenture Stripe dashboard for account `acct_1TWOnaI27jKwwm3H`.
2. Stay in live mode, not test mode.
3. Open `https://dashboard.stripe.com/acct_1TWOnaI27jKwwm3H/payment-links`.
4. Click `Create payment link`.
5. In `Find or add a product...`, choose the existing product `CityAtlas City Partner`.
6. From its existing price choices, select `$49.00 CAD / month` for live price `price_1TmLDBI27jKwwm3H1gUFgwU6`.
7. Do not create a new product. Do not choose a USD price. Do not use any test-mode object.
8. Click `Create link`.
9. Copy the resulting live `buy.stripe.com/...` URL and save it as the `City Partner` payment link.
10. Repeat steps 4 through 9 for `CityAtlas Signature Partner`, selecting `$149.00 CAD / month` for live price `price_1TmLHII27jKwwm3HVtE0CtqB`.

If an extension popup or extra Chrome UI is sitting on the Stripe page, dismiss that first, then continue the same steps above.

## 3) The Exact Three Local Env Values To Wire Afterward

```bash
VITE_CITYATLAS_ENABLE_LIVE_PAYMENTS=true
VITE_STRIPE_CITY_PARTNER_PAYMENT_LINK=https://buy.stripe.com/28EaEXazm3Vc9J27KJcAo01
VITE_STRIPE_SIGNATURE_PARTNER_PAYMENT_LINK=https://buy.stripe.com/dRmfZhfTG0J01cw4yxcAo00
```

With those three values wired, the local proof command should pass:

```bash
npm run qa:payments:handoff
```

The hosted proof command should also pass once the live site is actually serving the Stripe checkout CTAs:

```bash
npm run qa:payments:hosted
```

Hosted proof from this lane passes. The 2026-07-01 proof shows the public pricing page serving `Start City Partner checkout` and `Start Signature checkout` on `https://city.univenturestudio.com/for-businesses/pricing`, while still keeping City Partner, Signature, and general request-first paths visible beside checkout.

## 4) The One First Checkout Proof Still Required

This proof is not the same thing as a tiny request-first paid-traffic test. It is a live payment proof and needs explicit owner approval before the checkout is completed.

Complete one real live `CityAtlas City Partner` checkout after the three env values above are wired.

The minimum honest proof is:

1. Start from a CityAtlas paid surface that opens the live Stripe-hosted checkout handoff.
2. Confirm Stripe shows the correct live `CityAtlas City Partner` offer at `$49.00 CAD / month`.
3. Complete the checkout successfully in live mode.
4. Confirm Stripe created the live customer and live subscription against price `price_1TmLDBI27jKwwm3H1gUFgwU6`.

Only after that first proof should CityAtlas be treated as honestly charge-ready for the paid handoff.

## 5) What Remains Out Of Scope

- any custom in-app checkout backend
- Stripe webhooks
- invoice automation
- Stripe customer portal work
- automated fulfillment or onboarding after payment
- broader public claims of mature self-serve billing beyond the first live proof
- future US-city pricing or currency rollout work
- any deploy, push, provider write, or public claim from this local-only lane
