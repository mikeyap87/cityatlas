# CityAtlas Vancouver Outreach Prep Packet

Updated: June 16, 2026

Generated from local repo truth by `npm run growth:packets`.

## Current Local Truth

- Vancouver queue: `143` unique rows
- Vancouver partner-eligible rows: `124`
- Vancouver contact-ready rows: `93`
- Vancouver email-ready rows: `66`
- Vancouver promotion-candidate rows: `58`
- Proof-batch selected count: `5`
- Rehearsal-ready candidates: `5`
- Distinct batch lanes in packet: `5`
- Distinct donor/source lanes in packet: `2`
- Owner inbox rehearsal: `Owner inbox rehearsal is ready`
- The Roam city-sourcing donor sync now merges every qualifying local preview artifact for a city and rejects obvious directory/search-result noise before CityAtlas stages those rows.
- The reusable Roam public-business-wave donor sync adds official-contact wellness/service businesses from saved public-business fixtures without widening CityAtlas into paid EXA or live scraping.
- The wider Rooms Vancouver review donor layer now adds contact-form-ready and research-only businesses without pretending they are all email-ready.

## Imported Rooms Rehearsal Overlay

- Vancouver supervised-send-window overlap: `15` Rooms rows and `15` clean current CityAtlas matches
- Vancouver borrowed outcome ledger: `15` rows, including `2` bounced outcomes and `2` exact-address suppression lessons
- Toronto supervised-send-window overlap: `12` current CityAtlas matches from `15` Rooms rehearsal rows
- Unmatched follow-on rehearsal rows stay outside CityAtlas queue truth until their city/entity fit is clean enough for the current rollout boundary.

## Vancouver Action-Lane Mix

- Email-ready: `66` Vancouver rows
- Protected-email review: `2` Vancouver rows
- Private-form review: `6` Vancouver rows
- Phone/text review: `3` Vancouver rows
- Official-path review: `22` Vancouver rows
- Manual lookup: `25` Vancouver rows
- Anchor support only: `19` Vancouver rows

## Strongest Vancouver Email-Ready Segments

- Restaurant / bar / Hospitality and hosted-visit partner: `12` email-ready rows
- Cultural space / Venue and cultural partner: `9` email-ready rows
- Event venue / Private-group and hosted-visit partner: `9` email-ready rows
- Local business / Vancouver business partner: `8` email-ready rows
- Hotel / Guest services and event-space partner: `5` email-ready rows
- Wellness / Mobile massage and recovery partner: `4` email-ready rows
- Events / Event planner partner: `3` email-ready rows
- Hotel / Guest services partner: `3` email-ready rows

## Current Tiny-Batch Candidates

### 1. Alliance Francaise Vancouver

- Stage: `Rehearsal ready`
- Batch lane: `Culture`
- Role: `Partner Candidate`
- Contact route: rentals@alliancefrancaise.ca
- Source lane: Rooms venue donor seed
- Why this is in the packet: Alliance Francaise Vancouver already behaves like a business-development target, not just a public city anchor.
- Missing before any real send: Reverify the imported contact path on the official source before any real send.

### 2. Arcana Spirit Lounge

- Stage: `Rehearsal ready`
- Batch lane: `Hospitality`
- Role: `Partner Candidate`
- Contact route: events@arcanabar.com
- Source lane: Rooms venue donor seed
- Why this is in the packet: Arcana Spirit Lounge already behaves like a business-development target, not just a public city anchor.
- Missing before any real send: Reverify the imported contact path on the official source before any real send.

### 3. Auberge Vancouver Hotel

- Stage: `Rehearsal ready`
- Batch lane: `Hotel Guest`
- Role: `Partner Candidate`
- Contact route: reservations@aubergevancouver.com
- Source lane: Roam donor business seed
- Why this is in the packet: Auberge Vancouver Hotel already behaves like a business-development target, not just a public city anchor.
- Missing before any real send: Reverify the imported contact path on the official source before any real send.

### 4. Heritage Hall Vancouver

- Stage: `Rehearsal ready`
- Batch lane: `Event Group`
- Role: `Partner Candidate`
- Contact route: heritage@heritagehallvancouver.ca
- Source lane: Rooms venue donor seed
- Why this is in the packet: Heritage Hall Vancouver already behaves like a business-development target, not just a public city anchor.
- Missing before any real send: Reverify the imported contact path on the official source before any real send.

### 5. d'Latibule Wellness

- Stage: `Rehearsal ready`
- Batch lane: `Wellness`
- Role: `Partner Candidate`
- Contact route: info@dlatibulewellness.ca
- Source lane: Roam donor business seed
- Why this is in the packet: d'Latibule Wellness already behaves like a business-development target, not just a public city anchor.
- Missing before any real send: Reverify the imported contact path on the official source before any real send.

## Local Exports Ready Now

- `output/growth/vancouver-email-ready-prospects.csv` contains the current local Vancouver direct-email queue with batch lane, source lane, stage, and score for review-only outreach prep.
- `output/growth/vancouver-promotion-candidates.csv` contains the current local Vancouver non-email partner rows ranked by the next manual step that could move them closer to rehearsal.
- `output/growth/vancouver-contact-path-review-prospects.csv` contains the current local Vancouver contact-form and official-path review queue with confidence, source route, and no-submit notes.
- `output/growth/vancouver-needs-research-prospects.csv` contains the current local Vancouver rows that still need better public contact research before any rehearsal.
- `output/growth/vancouver-rehearsal-window.csv` contains the borrowed Rooms Vancouver supervised-send-window overlay plus matched CityAtlas stage, source lane, and any borrowed outcome-lesson columns.
- `output/growth/follow-on-city-email-ready-prospects.csv` contains the current local non-Vancouver direct-email queue with the same provenance fields for reusable city rollout prep.
- `output/growth/follow-on-city-promotion-candidates.csv` contains the current local non-Vancouver promotion queue so the next city wave can clean near-ready rows before a bigger research step is proposed.
- `output/growth/follow-on-city-contact-path-review-prospects.csv` contains the current local non-Vancouver review-first contact-path queue for the next city wave.
- `output/growth/follow-on-city-rehearsal-window.csv` contains the borrowed follow-on-city supervised-send-window rows and shows which ones cleanly map into the current CityAtlas queue.
- `output/growth/city-outreach-rehearsal-truth.json` keeps the reusable city-by-city rehearsal overlay summary in one place.
- All ten exports stay local-only and do not unlock outreach by themselves.

## Follow-On City Email Density From The Shared Map

- Toronto: `16` email-ready rows
- New York: `14` email-ready rows
- Miami: `11` email-ready rows
- Los Angeles: `10` email-ready rows
- Dubai: `6` email-ready rows
- London: `6` email-ready rows
- Ottawa: `3` email-ready rows
- Portland: `3` email-ready rows

## Follow-On City Promotion Density From The Shared Map

- Toronto: `6` promotion-candidate rows
- Boston: `4` promotion-candidate rows
- Chicago: `4` promotion-candidate rows
- Los Angeles: `3` promotion-candidate rows
- Miami: `3` promotion-candidate rows
- Montreal: `3` promotion-candidate rows
- San Francisco: `3` promotion-candidate rows
- Washington DC: `3` promotion-candidate rows

## Reusable Outreach Sequence Borrowed From Rooms And Roam

1. Keep the queue local and no-send first.
2. Rehearse one exact message in the owner inbox before any outside send is considered.
3. Hold the first business packet to 3 to 5 exact recipients.
4. Log replies, bounces, wrong-contact redirects, and concerns before widening volume.
5. Treat provider setup, EXA, and any future automation as separate approval gates rather than hidden defaults.

## What Is Still Blocked

- No automated outreach is enabled in CityAtlas.
- No provider send lane, CRM sync, or reply ingestion is active from CityAtlas.
- No EXA-powered paid discovery run has been approved or executed.
- No exported row should be treated as a public partner claim or a send approval.

## Best Next Safe Move

1. Keep widening Vancouver email-ready density only where it strengthens the source-backed public city surface or the exact first manual packet.
2. Use the exported CSVs to clean owner-review scope before any later outreach activation work is even proposed.
3. Keep follow-on cities in queue-building mode until one non-Vancouver wedge earns a real source-backed collection starter.

