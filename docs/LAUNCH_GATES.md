# CityAtlas Launch Gates

This package is safe to run locally before domain purchase. The following actions remain gated.

## Domain Purchase

Approval required:

- exact domain
- registrar/account
- legal/trademark comfort level
- DNS destination
- rollback or transfer plan

## Live Deployment

Approval required:

- hosting project/account
- public URL
- environment variables
- demo/real-data mode
- analytics posture
- rollback command or previous deployment target

## Stripe Or Payment Acceptance

Approval required:

- packages and prices
- refund policy
- terms/customer agreement
- Stripe account
- Payment Link changes
- real checkout proof
- refund/cancellation action
- customer portal, webhook, invoice, or subscription automation

CityAtlas now has guarded Stripe-hosted Payment Links for the City Partner and Signature Partner packages. It still contains no Stripe SDK, custom Checkout Session API route, invoice creation, webhook handling, customer portal, or subscription lifecycle automation. One real successful City Partner checkout is still required before calling the product fully charge-ready.

## Paid Ad Spend

Approval required:

- platform and account
- budget cap
- campaign objective
- target audience
- landing URL and UTM structure
- stop rule
- daily owner review window

The app is ready for a tiny request-first paid-traffic test, but Codex must not start ad spend.

## Real Business Data

Approval required:

- data source
- data rights
- source attribution
- removal/correction process
- verification level
- public claim policy

## Outreach

Approval required:

- message copy
- channel
- recipient list
- compliance posture
- send cadence
- opt-out handling

No automated sending is included.

## Owner/Admin Route Protection

Approval required:

- whether `/admin` is accessible on any deployed preview
- auth or password-protection approach
- who can view founder CRM candidate records
- whether real candidate names can appear in deployed admin data
- rollback path if a private preview is shared too broadly

The local owner console can show real candidate research. A public deployed admin route cannot expose founder CRM records without protection.

## Private Real-Business Preview

Approval required:

- candidate list
- source links
- private demo destination
- exact real-business claims shown
- correction/removal language
- whether the demo can be sent by link or only screen-shared

Real business names gathered for proof sprints stay in docs until this gate is approved.

## Paid Provider Imports

Approval required:

- provider
- account/API key
- budget cap
- scopes
- terms and attribution rules
- rate-limit handling

No provider SDK is installed in this package.
