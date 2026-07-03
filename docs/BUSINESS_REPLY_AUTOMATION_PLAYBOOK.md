# CityAtlas Business Reply Automation Playbook

Status: `live_gmail_reply_assist_bounded`

This playbook defines the safe live-reply lane for CityAtlas restaurant and service-business outreach.

It is intentionally narrower than a full sales automation. The goal is to keep moving warm conversations forward without pretending checkout, public listing, or guaranteed partnership approval already exist.

## Current product truth

- Public pricing page exists.
- Public partner-preview page is live and hosted-smoke verified at `https://city.univenturestudio.com/for-businesses/partner-preview`.
- Business request flow exists.
- Live Stripe-hosted checkout handoff exists for the paid `City Partner` and `Signature Partner` packages when the package choice is already clear.
- No custom in-app checkout, invoice flow, subscription management, or guaranteed public listing is active.
- No public business listing should be promised before review.
- Hosted private-preview links should stay off unless separately approved.
- The partner-preview URL may be included in outgoing restaurant/service outreach and interested-reply follow-ups.

## What the automation may do

- Send first-touch outreach from the approved daily manifests.
- Hold rows for review, even if previously staged, when the final packet sees an obvious business-name/contact-domain mismatch.
- Watch the connected Gmail inbox for inbound replies to CityAtlas outreach.
- Watch the connected Gmail inbox for delivery-status noise tied to CityAtlas outreach.
- Read the exact incoming thread before any reply.
- Send one bounded reply only when the message clearly fits an approved case below.
- Label and archive delivery-failure or delivery-delay noise after it is clearly identified as CityAtlas outreach fallout.
- Send an owner summary email after each run.

## Reply status ladder

- `interested_needs_preview`: business asked for details, preview, audience, cost, or where they fit.
- `hosted_offer_requested`: CityAtlas has asked for a complimentary meal, service, visit, walkthrough, or offering for Michael and one guest.
- `hosted_offer_agreed`: business agreed to host the experience; owner scheduling is next.
- `free_listing_or_review`: business wants to be considered but has not offered a hosted experience yet.
- `paid_package_signal`: business asked about pricing, packages, paid placement, or sponsorship.
- `not_now_closed`: business declined or said it does not fit current priorities.
- `hold_autoresponder`: automated reply only; no human response yet.
- `hold_ambiguous`: signature-only or unclear response; needs owner review before any reply.

## Approved auto-reply cases

### 1. Positive preview request

If the business clearly says yes, asks for a preview, or asks for a little more detail:

- Reply in-thread.
- Give a short 3-bullet preview:
  - the CityAtlas angle that seems to fit
  - the neighborhood, route, or guide context that fits best
  - the clearest visit, booking, or planning angle
- State that nothing public or paid is active yet.
- If the fit seems strong, ask whether they would be open to a complimentary hosted meal, service, visit, walkthrough, or offering for Michael and one guest so the feature can be built from a real experience.
- Include the public partner-preview URL when it helps clarify that the first step is free review, not payment: `https://city.univenturestudio.com/for-businesses/partner-preview`.
- Keep the first ask category-specific so it sounds concrete, not like a hidden invoice.

### 2. Pricing or package question

If the business asks about pricing, packages, or how this works commercially:

- Reply in-thread.
- Say the free starting point is still a reviewed request or preview conversation.
- Say that Stripe-hosted checkout now exists for the paid partner packages when the package choice is already clear.
- Say that a payment does not guarantee public listing, traffic, rankings, or instant publication.
- Say that if the preview is aligned, the normal first ask is a complimentary hosted meal, service, visit, walkthrough, or offering for Michael and one guest.
- If useful, point them to the public pricing page for package framing and the current hosted-checkout path.

## Category-specific first asks

Use these only after the business has shown interest or asked for details. The goal is clarity: the free first step is a reviewed preview plus one complimentary hosted experience if the fit is real.

- Restaurants: ask for a complimentary hosted tasting, meal, or visit for Michael and one guest.
- Cafes and bakeries: ask for a complimentary hosted coffee, pastry, brunch, or daytime visit for Michael and one guest.
- Bars and night-out spots: ask for a complimentary hosted drinks-and-bites visit, tasting, or evening experience for Michael and one guest.
- Wellness, spa, fitness, and recovery: ask for a complimentary treatment, class, recovery session, or wellness experience for Michael and one guest.
- Auto repair, detailing, and mobile services: ask for a complimentary diagnostic, inspection, detail sample, or small service for Michael, with one guest included when the service naturally supports two people.
- Cleaning and home services: ask for a complimentary walkthrough, sample clean, or service credit that lets Michael understand the service quality firsthand.
- Hotels, venues, events, and culture: ask for a complimentary property/site walkthrough, hosted visit, or sample experience for Michael and one guest.

### 3. Wrong contact redirect

If the recipient says this should go to someone else:

- Reply in-thread.
- Thank them.
- Ask for the better contact only if they are comfortable sharing it.
- Otherwise pause cleanly.

### 4. Concern or stop request

If the business raises a concern, asks to stop, or wants removal:

- Reply once in-thread acknowledging the pause.
- Do not sell further.
- Do not follow up again unless the business restarts the conversation.

## Cases the automation must not auto-reply to

- Pure autoresponders
- Empty replies or signature-only replies
- Ambiguous replies where intent is unclear
- Complaints that need owner judgment beyond a simple acknowledgment
- Requests that need a live business decision on pricing, refund policy, guarantee, or contract terms
- Anything that would require a public preview link, live listing promise, or payment promise

## Delivery-status cleanup lane

Delivery-status messages are useful as repair signals, but they should not sit in the inbox.

When the automation sees a Gmail delivery-status message that clearly relates to CityAtlas outreach:

- Read it first.
- Treat both permanent failures and temporary delays as cleanup candidates.
- Apply a dedicated Gmail label such as `CityAtlas Delivery Issue`.
- Archive it so it leaves the inbox.
- Do not delete it unless the owner separately asks for destructive cleanup.
- Do not auto-reply.

For queue safety:

- Do not auto-mark the business as `do_not_contact`.
- Do not auto-rewrite the prospect row just because one email bounced or delayed.
- Treat the message as a repair clue only, because the business may still have a better contact path or alternate email.
- Exact-address re-send suppression should continue to come from the live send ledgers.
- If a hard failure clearly points to one current business row, include that business in the owner summary as held for review.

## Sales boundary

The automation may move a business toward:

- a preview conversation
- a reviewed request
- a hosted visit or service for Michael and one guest
- a later package conversation

The automation may not claim:

- that the business is already approved to be listed
- that traffic, bookings, or ranking are guaranteed
- that CityAtlas has a custom checkout, contract, refund, or subscription system beyond the current hosted handoff
- that paying guarantees instant public listing, instant delivery, or guaranteed partnership

## Tone rules

- Short
- Plain English
- Helpful
- No fake familiarity
- No pressure
- No invented results

## Owner summary expectation

Each run should summarize:

- sends attempted, sent, failed
- replies found
- replies auto-handled
- delivery-status emails cleaned
- businesses that replied
- businesses replied to
- businesses with clear hard-failure delivery issues
- businesses held for owner review
- remaining restaurant owner-review-ready count
- remaining service owner-review-ready count
- where the remaining queue is from, grouped by municipality or city area
- what kinds of businesses remain, grouped by restaurant or service type
- blocker if any
- next move

Use `npm run growth:outreach:queue-status` after rebuilding the restaurant and service send
packets when a fresh owner-friendly queue snapshot is needed. It writes:

- `output/growth/cityatlas-outreach-queue-status.json`
- `output/growth/cityatlas-outreach-queue-status.md`
- `public/operator/cityatlasOutreachQueueStatus.json` for the local operator console lane
