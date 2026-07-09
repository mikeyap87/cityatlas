# CityAtlas EXA Discovery Approval Packet

Updated: June 25, 2026

Generated from local repo truth by `npm run growth:packets`.

## Purpose

This packet exists to keep EXA in the right lane for CityAtlas.

EXA can help widen the local no-send queue, especially for Vancouver business density and the next city wave, but it is discovery-only. It is not a send rail, not a CRM unlock, and not proof that CityAtlas should publish or contact a business.

## Current Local Preconditions

- `npm run growth:verify` currently passes.
- `41` useful pieces
- `25` answer-first guides
- `16` source-backed wedge collections
- `80` source-backed place anchors
- `25` city targets remain in the reusable rollout map.
- `25` seeded cities already have local queue coverage.
- Vancouver currently has `3697` unique rows, `3650` contact-ready rows, and `1532` email-ready rows.
- Vancouver already has `2146` non-email promotion candidates to clean up before a paid discovery batch needs to widen the queue.
- The first CityAtlas business packet already has `5` selected targets and `5` rehearsal-ready candidates.
- The current packet spans `5` business lanes across `1` donor/source lanes.
- Owner inbox rehearsal remains `Owner inbox rehearsal is ready`.
- Free donor sync already merges every qualifying Roam preview artifact per city, absorbs saved Roam public-business-wave fixtures where they exist, keeps the reviewed Rooms Vancouver email-ready layer, and adds the wider Rooms Vancouver review queue without promoting manual-review rows to send-ready.

## Exact Import Shape CityAtlas Already Supports

```csv
businessName,email,contactName,cityName,neighborhood,category,segment,sourceLabel,sourceUrl,website,contactPath,notes,relationshipWarmth
```

The admin import lane already previews duplicates, warnings, and importable rows before anything enters the local queue.

## Recommended First EXA Scopes

### Vancouver density top-up

- Use EXA only to widen review-first Vancouver rows that strengthen the live route surface or the exact 3-5 business rehearsal packet.
- Favor official contact pages, guest-services pages, private-event pages, venue-rental pages, and visible business emails.
- Avoid generic listicle pulls, personal staff data, and third-party directory-only contacts.

Current rehearsal packet businesses:

- KUBE GALLERY: Art gallery / Art gallery (Rehearsal ready; Culture; CityAtlas donor business seed)
- #1 Sub Garden Ltd: restaurants / Commercial/Industrial (Rehearsal ready; Hospitality; CityAtlas donor business seed)
- ACCENT INNS-BURNABY: hotels / LAND (Rehearsal ready; Hotel Guest; CityAtlas donor business seed)
- Royals Event And Community Centre: Event venue / Commercial/Industrial (Rehearsal ready; Event Group; CityAtlas donor business seed)
- A & G VOWELL: Massage therapist / ALIAS (Rehearsal ready; Wellness; CityAtlas donor business seed)

### 1. Toronto

- Current status: `Prepared` at `100%` progress
- Current local queue: `26` unique, `16` contact-ready, `16` email-ready
- Why EXA would be useful here: First-time visitor, weekend, and local-night routing still needs a first source-backed collection starter and deeper public-contact density.
- Guardrail: keep the batch small, review-first, and local-only until CityAtlas proves the rows belong in the queue.

### 2. New York

- Current status: `Building` at `69%` progress
- Current local queue: `15` unique, `15` contact-ready, `14` email-ready
- Why EXA would be useful here: Area-start guidance for first-time, repeat, and hosted visits still needs a first source-backed collection starter and deeper public-contact density.
- Guardrail: keep the batch small, review-first, and local-only until CityAtlas proves the rows belong in the queue.

### 3. Miami

- Current status: `Building` at `68%` progress
- Current local queue: `14` unique, `14` contact-ready, `11` email-ready
- Why EXA would be useful here: Hospitality, nightlife, and hosted-weekend route planning still needs a first source-backed collection starter and deeper public-contact density.
- Guardrail: keep the batch small, review-first, and local-only until CityAtlas proves the rows belong in the queue.

### 4. Los Angeles

- Current status: `Building` at `66%` progress
- Current local queue: `13` unique, `13` contact-ready, `10` email-ready
- Why EXA would be useful here: Neighborhood-led route choice instead of sprawling must-see lists still needs a first source-backed collection starter and deeper public-contact density.
- Guardrail: keep the batch small, review-first, and local-only until CityAtlas proves the rows belong in the queue.

### 5. Dubai

- Current status: `Building` at `44%` progress
- Current local queue: `7` unique, `7` contact-ready, `6` email-ready
- Why EXA would be useful here: Hospitality, premium routing, and short-visit planning still needs a first source-backed collection starter and deeper public-contact density.
- Guardrail: keep the batch small, review-first, and local-only until CityAtlas proves the rows belong in the queue.

## Required Guardrails Before Any Paid Run

- One city at a time.
- One exact lane at a time, such as hospitality, cultural venues, wellness, or hosted-event routes.
- Keep the first paid run small enough for human review before import.
- Re-verify every imported contact path on an official public source before any real outreach is ever considered.
- Do not let EXA output create public partner claims, visible listings, or outreach-ready status automatically.
- Keep all results local until a human has reviewed the rows inside CityAtlas.

## What Approval Must Cover

- Exact city scope
- Exact lane or query family
- Exact spend cap
- Exact raw-row cap
- Exact reviewer
- Exact storage destination
- Exact rule for what gets rejected before import

## What EXA Still Does Not Unlock

- No outreach send
- No Gmail, Resend, CRM, or provider activation
- No public business publication
- No partner claim
- No bypass of owner inbox rehearsal
- No bypass of the real-world source policy

## Best Next Safe Move

1. Keep using donor-sync and manual import preview for free queue growth until the next city or Vancouver lane is exact enough to justify a paid run.
2. If a paid discovery step becomes worth it, approve one city, one lane, one capped batch, and one local reviewer first.
3. Treat the imported rows as research candidates only until CityAtlas re-verifies them on official sources and chooses a tiny next packet manually.

