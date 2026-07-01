# Vancouver Business Machine Packet

Updated: July 1, 2026

## Current Local Truth

Local proof from `npm run growth:verify` now shows:

- `2124` unique Vancouver prospect rows
- `2105` partner-eligible rows
- `19` anchor-only rows
- `2077` contact-ready rows
- `898` email-ready rows
- `14` source-backed collection lanes still covered
- `23` useful Vancouver guides in the current library
- `2260` total staged business prospects across the shared CityAtlas machine
- all `25` rollout cities now have at least one local no-send business queue
- `2` cities currently meet the local prepared threshold: Vancouver and Toronto

This packet is generated from current repo truth by `npm run growth:packets` so the Vancouver business machine no longer drifts behind the live local counts.

## What Counts As A Prospect Now

CityAtlas keeps three different kinds of Vancouver coverage visible:

1. `anchor_only`
   Source-backed city anchors that strengthen answer-first guidance but are not yet good outreach targets.

2. `partner_and_anchor`
   Places that help public city guidance and could also matter for a future partnership or visibility conversation.

3. `partner_candidate`
   Outreach-relevant rows from founder proof work, donor research, or later approved imports.

The admin console shows partner-eligible versus anchor-only counts so the business machine does not pretend every guide anchor is already a real business-development lead.

The admin console also keeps three guarded prep lanes:

- exact 3 to 5 target proof-batch selection with owner-inbox rehearsal rules
- local-only supervised execution staging with a tiny allowlist, dry-run review checkpoints, and one explicit live-review slot
- preview-only business reply rehearsal with protected local mirror entries and replay safety

## Seed Sources In The Machine

The current Vancouver queue is built from seven local layers:

- Source-backed CityAtlas anchors: `20` rows
- Founder proof-sprint rows already staged inside CityAtlas: `5` rows
- Roam Relaxation donor seed layer imported from official-site partner research: `10` rows
- Roam public-business-wave donor layer imported from saved Roam provider-discovery fixtures: `5` rows
- Synced Rooms Vancouver email-ready donor layer: `35` rows
- Wider synced Rooms Vancouver review donor layer: `40` rows
- Roam city-sourcing donor layer recovered from multiple qualifying preview artifacts: `5` rows

The wider Rooms Vancouver review donor layer adds:

- `15` review-first contact-path-ready Vancouver rows
- `22` research-only Vancouver rows
- Browserbase/manual-browser-only notes without turning contact-form rows into send-ready rows

The current Vancouver source lanes are:

- Vancouver restaurant review donor (contact-path review): `1157` Vancouver rows
- Vancouver restaurant review donor (email candidate): `821` Vancouver rows
- Rooms host-space review donor (official public source): `31` Vancouver rows
- Rooms host-space donor (official public source): `27` Vancouver rows
- Official City of Vancouver page: `11` Vancouver rows
- Roam partner research donor (official site): `10` Vancouver rows
- Official service review path: `9` Vancouver rows
- Rooms host-space review donor (official site plus secondary public listing): `9` Vancouver rows
- Official service review email: `8` Vancouver rows
- Rooms host-space donor (official site plus secondary public listing): `8` Vancouver rows
- Founder proof sprint queue: `5` Vancouver rows
- Roam public business wave donor (official public contact): `5` Vancouver rows
- Roam city-sourcing donor (public phone path): `3` Vancouver rows
- Rooms Browserbase review donor (official public source): `2` Vancouver rows
- Rooms contact-form review donor (official public source): `2` Vancouver rows
- Official Central Library branch page: `1` Vancouver rows
- Official centre website: `1` Vancouver rows
- Official Commercial Drive site: `1` Vancouver rows
- Official contact page: `1` Vancouver rows
- Official GreenHeart TreeWalk page: `1` Vancouver rows
- Official hours and admission page: `1` Vancouver rows
- Official hours and admissions page: `1` Vancouver rows
- Official MOA visit page: `1` Vancouver rows
- Official museum hours page: `1` Vancouver rows
- Official museum website: `1` Vancouver rows
- Official neighborhood page: `1` Vancouver rows
- Official Nitobe Memorial Garden page: `1` Vancouver rows
- Official Space Centre visit page: `1` Vancouver rows
- Official UBC Botanical Garden visit page: `1` Vancouver rows
- Roam city-sourcing donor (public business contact): `1` Vancouver rows
- Roam city-sourcing donor (public business page): `1` Vancouver rows

## Promotion Lanes Closest To Rehearsal

- `1207` non-email partner rows already have a visible public route or a clear next manual step.

- Protected-email review: `2` Vancouver rows
- Private-form review: `49` Vancouver rows
- Phone/text review: `3` Vancouver rows
- Official-path review: `1093` Vancouver rows
- Manual lookup: `60` Vancouver rows

This keeps the next cleanup wave honest: CityAtlas can prioritize the rows closest to owner review instead of pretending every contact-path row is equally ready.

All donor rows remain local-only and labeled for re-verification before any outreach or public claim.

## Shared Univenture Rollout Pattern

The active CityAtlas city-target map currently covers `25` city targets, and all `25` seeded cities already have at least one local queue row. Vancouver stays the proof city while the same queue-first pattern is prepared for the rest of the ladder.

Current strongest follow-on city queues:

- Toronto: `26` unique, `16` contact-ready, `16` email-ready
- New York: `15` unique, `15` contact-ready, `14` email-ready
- Miami: `14` unique, `14` contact-ready, `11` email-ready
- Los Angeles: `13` unique, `13` contact-ready, `10` email-ready
- Dubai: `7` unique, `7` contact-ready, `6` email-ready
- London: `6` unique, `6` contact-ready, `6` email-ready

The rule stays the same for every city: build the internal queue first, keep it no-send, prove one useful city wedge, then package public release work behind a separate approval step.

## Discovery And Outreach Prep

CityAtlas is prepared for the same discovery and outreach discipline used elsewhere in Univenture:

- EXA stays discovery-only, not a send rail.
- Official/public business contact paths stay preferred over guessed personal emails.
- CityAtlas now also carries the Rooms rehearsal overlay: `15` Vancouver supervised-send-window rows matched to the current queue plus `15` borrowed outcome-ledger rows for bounce and suppression truth.
- The first real CityAtlas outreach batch should follow the Rooms pattern: a tiny exact-recipient manual proof batch, not volume.
- Owner-inbox rehearsal should happen before any real send so sender identity, subject line, and reply routing are checked safely.
- The supervised execution lane is now staged locally, but it remains non-sending and approval-gated.
- Gmail stays fallback and manual escalation only, not the main machine rail.
- The reply-memory path is Resend-first in structure but still preview-only locally.
- No automatic scraping run, provider send, live inbox webhook, CRM sync, or outreach send is active in CityAtlas right now.

Recommended future env prep only:

```bash
EXA_API_KEY=
CITYATLAS_OUTREACH_MAILING_ADDRESS=
```

Those values do not unlock sending by themselves.

## Safe Next Move

The next strongest local batch is:

1. Keep using the generated business machine packet and the deduped admin rollup as truth instead of older queue counts.
2. Use the new Vancouver and follow-on promotion-candidate exports to clean the exact rows closest to rehearsal before any later live outreach decision exists.
3. Keep Toronto, Los Angeles, New York, and Miami as the highest-leverage next-city queues while Vancouver keeps widening the proof-city business density.
4. Rehearse the preview-only reply rail locally so inbound packet matching, protected mirror truth, and replay safety are proven before any live inbox connector is even considered.
5. Keep the first CityAtlas-specific proof batch inside the Rooms-style tiny-batch and owner-inbox-rehearsal rules before any live outreach approval is considered.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->

