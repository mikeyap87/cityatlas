# Wellness Reset Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/wellness-reset-starters`
- upgraded `/vancouver/guides/vancouver-wellness-experiences-to-review`
- Internal links from the homepage, city page, guide library, About page, and footer
- Local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Page Exists

CityAtlas already had date-night, rainy-day, first-evening, and first-time-visitor source-backed wedges. The next safest content-machine step was a narrow wellness reset page built from civic and public-institution sources that can support calm-hour route logic without drifting into treatment claims.

This batch was chosen ahead of the work-friendly cafe wedge because official-source support for laptop, seating, noise, and work-mode claims is still too thin and inconsistent to publish as a trust-first real-world wedge.

## Official Sources Used

Checked June 14, 2026.

1. Vancouver Public Library Central Library branch page
2. Stanley Park official City of Vancouver page
3. Queen Elizabeth Park official City of Vancouver page
4. Bloedel Conservatory official City of Vancouver page
5. VanDusen Botanical Garden official City of Vancouver page

## Claim Boundaries

- This page does not claim medical, therapeutic, or treatment outcomes.
- This page does not publish fake "best wellness" rankings or unsupported benefit language.
- This page does not claim live operational guarantees, crowd conditions, or universal fit.
- This page only uses real-place facts where an official public source supported the narrow reset-page framing.

## Content-Machine Count

- Batch-local count when this wedge was first packaged: 15
  - 11 answer-first guides
  - 4 source-backed wedges in the local package
- Local count after this batch: 16
  - 11 answer-first guides
  - 5 source-backed wedges in the local package
- Current machine truth on June 15, 2026: 37
  - 23 guides
  - 14 source-backed wedges in the local package
  - 70 source-backed anchors
  - 14 mapped guide-to-collection links

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run readiness`
- local preview route checks for the new source-backed page and upgraded wellness guide
- local verification that `sitemap.xml` and `llms.txt` expose the new route and describe its release state honestly
- local browser proof that the new page and matching guide show the expected route content, page-to-guide / guide-to-page pairing, and route-specific metadata behavior

## Local Verification Completed

Completed June 14, 2026.

- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run readiness` passed and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/wellness-reset-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/vancouver-wellness-experiences-to-review` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes `/vancouver/wellness-reset-starters`.
- Local `llms.txt` describes the new source-backed page and upgraded wellness guide as local-ready while keeping the live-domain description honest about only three hosted source-backed pages.
- Browser verification showed the new source-backed page rendering five official-source cards, correction-path links, and checked-date framing.
- Browser verification showed the upgraded wellness guide rendering the embedded wellness source-backed section, updated proof note, correction link, and rail link.
- The in-app browser re-verified the source-backed page and upgraded wellness guide and confirmed route-specific title, description, robots, canonical, JSON-LD, visible correction-path links, and the page-to-guide / guide-to-page pairing on both routes against the configured local base URL `http://127.0.0.1:5178/`.
- Mobile viewport verification at 390px showed no horizontal overflow on the new wellness reset starters page.
- Current machine truth has since advanced to `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links, while this wellness wedge remains part of the first hosted queue in `SOURCE_BACKED_RELEASE_QUEUE_PACKET.md` and `FIRST_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`.

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

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
