# Technical Risk Register

## Current Risk Level

Safe for local/private preview. Not ready for ungated public launch with real businesses or payments.

## Highest Risks

### Fictional Data Leakage

Risk: demo businesses, offers, event RSVPs, and ratings could be mistaken for real.

Mitigation now: visible demo/source language, noindex robots posture, review gates.

Next fix: require source records before any LocalBusiness/Event/Offer schema or public page publication.

### Payment Prematurity

Risk: pricing appears before refund terms, legal terms, fulfillment promise, or Stripe test proof.

Mitigation now: no Stripe dependency, payment-locked UI, launch gates.

Next fix: add terms/refund docs and test-mode payment proof before live Stripe.

### Outreach Compliance

Risk: automated commercial messages can create legal/reputation risk.

Mitigation now: no sending code, local drafts only.

Next fix: approved outreach copy, consent/opt-out policy, manual send pilot.

### Analytics Blindness

Risk: growth decisions could be made from local demos instead of real behavior.

Mitigation now: local event scaffold only.

Next fix: privacy-approved analytics with event taxonomy and dashboard.

### Premature Sharing

Risk: mission share drafts could become real invites before account identity, consent, moderation, and unsubscribe controls exist.

Mitigation now: share drafts only stage locally and record `planner_share_draft_prepared`; no clipboard, email, SMS, or social send is executed.

Next fix: add account-backed sharing with privacy policy, consent language, abuse controls, and attribution rules.

### SPA SEO Limits

Risk: static SPA routes need deploy configuration and metadata validation.

Mitigation now: Vercel rewrite config, route-aware metadata, crawl assets.

Next fix: consider prerender/static generation if SEO becomes core.

## What Is Solid

- strict TypeScript build
- no known dependency vulnerabilities
- local-only storage for sensitive prelaunch actions
- live-risk gate docs
- no payment/outreach/provider SDKs installed
- mission sharing remains local-only
- structured app/component layout
