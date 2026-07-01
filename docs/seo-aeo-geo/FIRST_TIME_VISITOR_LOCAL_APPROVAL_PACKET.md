# First-Time Visitor Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/first-time-visitor-starters`
- `/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`
- Internal links from the homepage, city page, guide library, About page, and footer
- Local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Page Exists

CityAtlas already had date-night, rainy-day, and first-evening source-backed wedges. The next safe content-machine step was a destination-choice page for first-time Vancouver visitors who need to choose one strong starting area before building a full itinerary.

This batch stays narrow on purpose:

- it answers one question
- it uses official public sources
- it avoids rankings and fake "best" claims
- it keeps the correction path visible at `/editorial-standards`

## Official Sources Used

Checked June 14, 2026.

1. Vancouver Art Gallery visit page
2. Gastown official district site
3. Granville Island Public Market official page
4. Stanley Park official City of Vancouver page
5. Queen Elizabeth Park official City of Vancouver page

## Claim Boundaries

- This page does not claim universal "must see" status.
- This page does not publish review scores, rankings, or unsupported neighborhood advice.
- This page does not claim live pricing, operational guarantees, or broad city completeness.
- This page only uses real-business/location facts where an official public source supported the narrow starter-page framing.

## Content-Machine Count

- Batch-local count when this wedge was first packaged: 13
  - 10 answer-first guides
  - 3 live source-backed wedges
- Local count after this batch: 15
  - 11 answer-first guides
  - 4 source-backed wedges in the local package
- Current machine truth on June 15, 2026: 37
  - 23 guides
  - 14 source-backed wedges in the local package
  - 70 source-backed anchors
  - 14 mapped guide-to-collection links

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run readiness`
- local preview route checks for the new guide and new source-backed page
- local verification that `sitemap.xml` and `llms.txt` expose the new routes
- local browser proof that the new page and matching guide show the expected route content, page-to-guide / guide-to-page pairing, and route-specific metadata behavior

## Local Verification Completed

Completed June 14, 2026.

- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run readiness` passed and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/first-time-visitor-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/where-should-a-first-time-vancouver-visitor-start` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both new routes.
- Local `llms.txt` describes the new source-backed page and matching guide as local-ready, pending release approval.
- Browser verification showed the new source-backed page rendering five official-source cards, correction-path links, and checked-date framing.
- Browser verification showed the matching guide rendering the embedded first-time-visitor source-backed section, updated proof note, correction link, and rail link.
- The in-app browser re-verified the source-backed page and matching guide and confirmed route-specific title, description, robots, canonical, JSON-LD, visible correction-path links, and the page-to-guide / guide-to-page pairing on both routes against the configured local base URL `http://127.0.0.1:5178/`.
- Mobile viewport verification at 390px showed no horizontal overflow on the Vancouver city page or the new first-time-visitor starters page.
- Current machine truth has since advanced to `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links, while this first-time-visitor wedge remains part of the first hosted queue in `SOURCE_BACKED_RELEASE_QUEUE_PACKET.md` and `FIRST_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`.

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

If local proof stays clean, the next live action is the separate first hosted queue release approval described in `SOURCE_BACKED_RELEASE_QUEUE_PACKET.md` and `FIRST_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`. That approval should cover deploy scope, rollback target, and hosted post-release smoke.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
