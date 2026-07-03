# Date Night Reply Response Kit

Status: `local_response_kit_no_send`

This kit prepares manual responses for the first CityAtlas Date Night proof sprint. It does not approve any follow-up, public preview link, Stripe/payment action, provider import, or public business claim.

## Current Send State

- Six owner-approved direct emails were sent manually from the connected Gmail account.
- Held rows remain held.
- The next useful action is to log every reply, bounce, wrong-contact redirect, concern, package question, and private-preview request in `/admin`.

## Response Rules

- Reply manually only after reviewing the exact incoming message.
- Do not send a hosted private-preview link unless protected sharing is separately approved.
- Prefer local screen-share or a short text explanation until hosted preview access is enabled.
- Do not ask for payment in this proof sprint.
- Pause immediately if a recipient raises a privacy, consent, source, brand-use, or removal concern.

## Templates

### Positive Preview Request

Subject: Re: CityAtlas date-night route preview

Hi there,

Thanks for taking a look. The safest next step is a quick screen-share of the Date Night route concept so you can see the placement idea without anything being public or indexed.

The goal is to learn whether this kind of route placement would be useful enough for your team to review further. No payment link or public listing is active.

Best,
Michael

### Wrong Contact

Subject: Re: CityAtlas date-night route preview

Hi there,

Thanks for pointing me in the right direction. I will update the contact record and pause this thread unless you think there is a better person to review the route concept.

Best,
Michael

### Pricing Or Package Question

Subject: Re: CityAtlas date-night route preview

Hi there,

Good question. We are not taking payment from this proof sprint yet. I am first validating whether the route-placement concept is useful, clear, and worth reviewing.

If there is enough interest, the next step would be a founding partner package with clear terms before anything is enabled.

Best,
Michael

### Not Now

Subject: Re: CityAtlas date-night route preview

Hi there,

Totally understood. I will mark this as not-now and avoid follow-up unless there is a clearer future reason to reconnect.

Best,
Michael

### Concern, Source Issue, Or Removal Request

Subject: Re: CityAtlas date-night route preview

Hi there,

Thanks for flagging that. I will pause this immediately and treat it as a review issue before any further outreach, preview sharing, or public use.

Best,
Michael

### Bounce Or Delivery Failure

Action only:

- Log sentiment as `bounce` in `/admin`.
- Mark the candidate for contact-path repair.
- Do not try another address or form without a new explicit owner-approved second batch.

## Logging Standard

Every outcome should include:

- candidate
- channel
- sentiment
- exact outcome summary
- whether they requested a preview
- whether pricing/package language appeared
- next step

