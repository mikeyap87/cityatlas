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
- test mode proof
- live mode cutover

This package intentionally contains no Stripe SDK, checkout route, payment link execution, invoice creation, or subscription creation.

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
