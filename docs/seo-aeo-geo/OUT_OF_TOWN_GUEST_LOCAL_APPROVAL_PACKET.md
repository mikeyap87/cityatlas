# Out-Of-Town Guest Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/out-of-town-guest-starters`
- `/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver`
- Internal links from the homepage, city page, guide library, About page, and footer
- Local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Page Exists

CityAtlas already had date-night, rainy-day, first-evening, first-time-visitor, and wellness-reset source-backed wedges. The next safest content-machine step was a host-intent page for people trying to show someone one good part of Vancouver without turning the day into an exhausting city marathon.

This batch stays narrow on purpose:

- it answers one hosting question
- it uses official public sources
- it avoids fake "must do Vancouver" authority
- it keeps the correction path visible at `/editorial-standards`

## Official Sources Used

Checked June 14, 2026.

1. Vancouver Art Gallery visit page
2. Granville Island Public Market official page
3. Stanley Park official City of Vancouver page
4. Queen Elizabeth Park official City of Vancouver page
5. Bloedel Conservatory official City of Vancouver page

## Claim Boundaries

- This page does not claim universal "must see" status.
- This page does not publish fake guest-hosting rankings or insider authority.
- This page does not claim live pricing, availability, or operational guarantees.
- This page only uses real-place facts where an official public source supported the narrow host-plan framing.

## Content-Machine Count

- Batch-local count when this wedge was first packaged: 16
  - 11 answer-first guides
  - 5 source-backed wedges in the local package
- Local count after this batch: 18
  - 12 answer-first guides
  - 6 source-backed wedges in the local package
- Current machine truth on June 15, 2026: 37
  - 23 guides
  - 14 source-backed wedges in the local package
  - 70 source-backed anchors
  - 14 mapped guide-to-collection links

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run readiness`
- local preview route checks for the new source-backed page and new guide
- local verification that `sitemap.xml` and `llms.txt` expose the new route and describe its release state honestly
- local browser proof that the new page and matching guide show the expected route content, page-to-guide / guide-to-page pairing, and route-specific metadata behavior

## Local Verification Completed

Completed June 14, 2026.

- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run readiness` passed and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/out-of-town-guest-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both new routes.
- Local `llms.txt` describes the new source-backed page and matching guide as local-ready while keeping the live-domain description honest about only three hosted source-backed pages.
- Headless Chrome rendered the new source-backed page and showed the source-backed hero, five official-source cards, correction-path links, and checked-date framing.
- Headless Chrome rendered the matching guide and showed the embedded guest-hosting source-backed section, updated proof note, correction link, and rail link to `/vancouver/out-of-town-guest-starters`.
- The in-app browser re-verified the source-backed page and matching guide and confirmed route-specific title, description, robots, canonical, JSON-LD, visible correction-path links, and the page-to-guide / guide-to-page pairing on both routes against the configured local base URL `http://127.0.0.1:5178/`.
- Narrow-screen review of the new page exposed shared header clipping, so the shared mobile header layout was repaired and the follow-up 390px screenshot showed a clean, readable nav state on mobile.
- `npx tsx --eval` verified the local ranking surface at `18` useful pieces: `12` guides plus `6` source-backed wedge collections.
- Current machine truth has since advanced to `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links, while this out-of-town guest wedge remains part of the second hosted queue in `SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md` and `SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`.
- No deploy, hosted smoke, or production mutation was performed in this batch.

## Metadata And Canonical Caveat

- The recorded metadata proof for this batch is local-only.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted title, canonical, and JSON-LD behavior still need real smoke proof on `city.univenturestudio.com` after release.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted guide-to-collection link pairing between the source-backed page and matching guide after release
- Hosted canonical and JSON-LD behavior on `city.univenturestudio.com`
- Search-engine crawl behavior after release
- Any indexing or ranking movement

## Approval Boundary

This batch is not part of the current first-time visitor plus wellness release queue. If local proof stays clean, it should follow the separate later release approval described in `SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md` and `SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` after the queued first-time visitor and wellness deploy decision is resolved.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
