# Date Night Live Send Blocker

Generated: 2026-06-14

Status: `superseded_by_approved_connected_gmail_send`

## Current Resolution

This blocker was valid when the approved sender was `michael@univenturestudio.com` but the connected Gmail profile was `michael.yap.87@gmail.com`.

The owner later approved sending from the connected Gmail account. The first six direct-email messages were then sent manually from `michael.yap.87@gmail.com`.

Current send truth lives in:

- `docs/proof-sprints/DATE_NIGHT_LIVE_SEND_LEDGER.md`
- `output/proof-sprints/date-night-live-send-ledger.json`

## Classification

`Messaging`

This action would send real outreach to real businesses. It can affect CityAtlas and Univenture Studio's reputation, create consent/compliance obligations, and start customer-facing conversations. It is not safe to execute from inferred details.

## Approved Boundary Received

Owner approved a manual send for the CityAtlas Date Night proof sprint to owner-reviewed primary and confirm-first recipients using the exact approved sender/channel and first-touch copy.

Owner also explicitly did not approve:

- automated sending
- Stripe or payment acceptance
- provider imports
- public claims
- public indexing

## Stop Condition

At the time this blocker was created, no messages were sent because the current send-window artifacts did not name an exact sender account and channel.

The current packet says:

- sender account and channel must be chosen before outreach
- final contact path must be verified for each recipient before outreach
- confirm-first rows require manual confirmation before any send

## Exact Gaps Before Sending

1. Exact sender/channel

   The repo does not currently name the sender account, sender identity, reply-to, or channel to use for the batch.

2. Exact contact path choices

   Several rows still contain multiple or unresolved contact paths:

   - Published on Main: choose `bookings@publishedyvr.com` or `info@publishedyvr.com`
   - L'Abattoir: choose the official private-dining form or fallback `info@labattoir.ca`
   - Botanist: choose the official private-dining form or fallback `info@botanistrestaurant.com`
   - Vancouver Art Gallery: choose `marketing@vanartgallery.bc.ca` or `learn@vanartgallery.bc.ca`
   - Thierry Chocolates: protected email/contact path still requires manual confirmation
   - The Keefer Bar: protected email/contact path still requires manual confirmation
   - Granville Island Public Market: public-market vs event/admin route still requires manual choice

3. Placeholder handling

   The approved first-touch copy still contains placeholders:

   - `{first_name}`
   - `{business_name}`
   - `{route_angle}`

   The batch needs an approved rule for placeholder substitution before real messages are sent.

## Safest Executable Approval Shape

Use this only if the owner wants to proceed with a direct-email first batch and leave form/protected-contact rows out until confirmed:

`Approved: send the CityAtlas Date Night proof sprint manually from [exact sender account/name] via Gmail email only to [exact recipient emails]. Use the approved first-touch copy, replace {first_name} with "there", replace {business_name} and {route_angle} from the send-window table, log every outcome in /admin, and do not send to unresolved forms/protected/contact-page rows yet. No automated sending, Stripe, provider imports, public claims, or public indexing are approved.`

## Candidate Direct-Email First Batch

These are the lowest-risk direct-email rows after exact sender/channel is named:

| Business | Candidate contact | Note |
| --- | --- | --- |
| Published on Main | `bookings@publishedyvr.com` or `info@publishedyvr.com` | Owner must choose one. |
| Kissa Tanto | `hello@kissatanto.com` | Direct email listed in the packet. |
| L'Abattoir | `info@labattoir.ca` | Fallback email; official form is the primary contact path. |
| Botanist | `info@botanistrestaurant.com` | Fallback email; official form is the primary contact path. |
| Miku Waterfront | `info@mikurestaurant.com` | Direct email listed in the packet. |
| Vancouver Art Gallery | `marketing@vanartgallery.bc.ca` or `learn@vanartgallery.bc.ca` | Owner must choose route fit. |

## Held Rows

These should remain unsent until exact contact paths are confirmed:

| Business | Reason |
| --- | --- |
| Thierry Chocolates | Protected email/contact path requires manual confirmation. |
| The Keefer Bar | Protected email/contact path requires manual confirmation. |
| Granville Island Public Market | General contact path requires a public-market vs event/admin route decision. |

## Verification

- Checked the current send-window approval packet.
- Checked the current shadow ranking.
- Searched the repo for any separate approved sender/channel record.
- Confirmed the repo still gates outreach on exact sender, channel, contact path, copy, and logging approval.
- No Gmail send or draft action was performed.

## Gmail Profile Check

After the owner named `michael@univenturestudio.com` as the sender and approved the recommended safe batch, the connected Gmail profile was checked before sending.

- Approved sender: `michael@univenturestudio.com`
- Connected Gmail profile: `michael.yap.87@gmail.com`
- Result: blocked before send until the owner approved the connected Gmail account

No messages were sent at this blocker step because the Gmail connector would send from the authenticated Gmail account and does not expose a separate sender/from field. This was later resolved by explicit owner approval to send from `michael.yap.87@gmail.com`.
