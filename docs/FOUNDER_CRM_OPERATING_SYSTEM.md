# Founder CRM Operating System

## Purpose

The founder CRM turns CityAtlas from a polished demo into a disciplined revenue process.

It is not a mass outreach tool. It is a review-gated local pipeline for choosing the right first prospects, preparing private previews, learning from replies, and deciding when the business is ready for real payment acceptance.

## Current Scope

- First wedge: Vancouver Date Night.
- First candidate set: 10 source-backed review candidates.
- Current status: first manual send complete; local reply monitoring.
- Public listing status: none.
- Outreach status: six owner-approved manual direct emails sent and logged; held rows, follow-ups, and any second batch remain gated.
- Contact status: official-source contact paths researched; 10 contact-ready paths, with medium-confidence rows requiring final manual confirmation.
- Shadow status: 5 primary manual-send candidates, 4 confirm-first candidates, 1 backup/no-send candidate, 0 blocked manual lookups.
- Payment status: disabled.

## Pipeline Stages

1. `research_candidate`
   - Candidate has an official or public source URL.
   - Candidate is not public in CityAtlas.
   - No outreach has happened for that candidate.

2. `owner_review`
   - Owner checks fit, brand risk, source quality, contact-path confidence, and personal confidence.
   - Candidate can be removed, delayed, or promoted to private-preview approval.

3. `owner_approved_private_preview`
   - Candidate can appear in a private screen-share or controlled preview.
   - Preview must include source caveats and correction/removal language.
   - Preview cannot imply endorsement or partnership.

4. `owner_approved_manual_outreach`
   - Owner approves exact recipient list, sender account, message, send count, and reply log.
   - Owner confirms exact contact path for each recipient.
   - Owner compares their chosen list against the shadow ranking.
   - Sends are manual only.

5. `sent_manual`
   - Message has been sent manually.
   - Log channel, date, recipient, message version, and next follow-up date.

6. `replied`
   - Log reply sentiment, objections, requested next step, and whether a private demo is wanted.

7. `collaboration_ready`
   - Business wants a feature, route, or hosted collaboration.
   - Still no payment until terms, fulfillment promise, and Stripe/live payment approval are complete.

## Candidate Review Rubric

Score each candidate from 1 to 5:

- Route fit: does this business make a coherent date-night plan better?
- Visual/social fit: would people want to share or save this route?
- Buyer clarity: is there an obvious partnership, marketing, or owner contact?
- Source quality: does the official source clearly support the basic facts?
- Contact confidence: is the contact path official, current, and appropriate for this pitch?
- Risk level: are claims, alcohol, pricing, events, accessibility, or image rights sensitive?

Prioritize candidates with high route fit, low claim risk, and high contact confidence. A famous business with fragile claim language or a weak contact path is worse for sprint one than a slightly less famous business with clear source data and easy buyer access.

## Manual Tracking Fields

Track these before any send:

- candidate name
- source URL
- route angle
- owner approval status
- outreach status
- contact path
- contact confidence
- contact source URL
- shadow role
- shadow score
- message version
- send date
- reply date
- reply sentiment
- objection
- next action
- payment readiness

## Message Versioning

Use simple message versions:

- `dm-v1-founder-preview`
- `email-v1-founder-preview`
- `email-v1-date-night-preview`
- `followup-v1-useful-observation`
- `closeout-v1-no-pressure`

Do not run multiple versions at once in the first 10 sends. The first sprint is for learning message-market fit, not statistical testing.

## Reply Classification

- `positive_demo`: asks to see preview or book time.
- `positive_info`: asks for more detail.
- `neutral`: acknowledges but no clear interest.
- `wrong_contact`: redirects to another person.
- `bounce`: delivery failure or unreachable address.
- `not_now`: timing objection.
- `no_interest`: clear decline.
- `concern`: asks about data use, permission, claims, or payment.

## Learning Loop

After every 10 reviewed prospects:

1. Count replies.
2. Count private-demo requests.
3. List objections verbatim in local notes.
4. Decide whether the wedge still feels promising.
5. Improve the preview, source policy, or message.
6. Do not widen to automation until the manual message works.

## Automation Graduation

Do not automate prospecting yet.

Allowed next automations after manual proof:

- local scoring suggestions
- draft generation from approved variables
- reply classification
- follow-up reminders
- owner briefing summaries
- local manual reply tracker summaries

Still gated:

- sending
- importing contacts
- publishing real pages
- syncing to CRM
- live payments
- provider data pulls

## First Sprint Goal

The first sprint is successful if 10 to 20 reviewed prospects produce:

- 5 meaningful replies or conversations
- 2 to 3 private-demo or collaboration opportunities
- 2 to 3 qualified package, pricing, or partnership demand signals
- clear objections that improve the offer

It is not successful just because the app looks good.

## Local Product Surfaces

- Founder CRM: `/admin`
- Private Date Night preview: `/private-preview/date-night`
- Business package request flow: `/for-businesses/pricing`
- Review request form: `/for-businesses/submit`

The private preview route is for screen-share and local review until owner/admin route protection and preview sharing rules are approved.
