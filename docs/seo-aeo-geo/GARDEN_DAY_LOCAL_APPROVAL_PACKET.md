# Garden Day Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/garden-day-starters`
- `/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day`
- internal links from the homepage, city page, guide library, and routing surfaces
- local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Page Exists

CityAtlas already had west-side daytime and UBC discovery guidance, but a Vancouver garden-and-conservatory day is a different planning question. This batch gives CityAtlas a destination-first answer for people deciding between a compact Queen Elizabeth Park and Bloedel day, a deeper VanDusen walk, or a quieter UBC and Nitobe follow-through without turning the route into a generic park list.

This batch stays narrow on purpose:

- it answers one garden-and-conservatory planning question
- it uses official public sources
- it strengthens the destination-choice and calm-route cluster without inflating CityAtlas into a fake verified directory
- it keeps the correction path visible at `/editorial-standards`

## Official Sources Used

Checked June 15, 2026.

1. Queen Elizabeth Park official page
2. Bloedel Conservatory official page
3. VanDusen Botanical Garden official page
4. Nitobe Memorial Garden official page
5. UBC Botanical Garden official page

## Claim Boundaries

- This page does not claim a universal best Vancouver garden day.
- This page does not publish fake rankings, reviews, or insider certainty.
- This page does not claim live pricing, availability, or operational guarantees.
- This page only uses real-place facts where an official public source supported the narrow garden-day framing.

## Content-Machine Count

- Prior determinable useful-piece count: 35
  - 22 answer-first guides
  - 13 source-backed wedges in the local package
- Local count after this batch: 37
  - 23 answer-first guides
  - 14 source-backed wedges in the local package

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run seo:proof`
- `npm run readiness`
- local preview route checks for the new source-backed page and matching guide
- local verification that `sitemap.xml` and `llms.txt` expose the new routes and describe release state honestly
- local verification that the homepage, city page, and guide-library trust surfaces can reach the new wedge

## Local Verification Completed

Completed June 15, 2026.

- `npm run typecheck` passed.
- `npm run build` passed, with only the existing non-blocking Vite large-chunk warning.
- `npm run seo:proof` passed and confirmed `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, `14` mapped guide-to-collection links, and zero failures.
- `npm run readiness` passed and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/garden-day-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both garden-day routes.
- Local `llms.txt` describes the garden-day source-backed page and matching guide as local-ready while keeping the live-domain description honest about only three hosted source-backed wedges.
- The in-app browser re-verified local `/vancouver/garden-day-starters` and `/vancouver/guides/where-should-you-start-a-vancouver-garden-and-conservatory-day` on June 15, 2026 and confirmed route-specific title, description, robots, canonical, JSON-LD, correction-path links, and the page-to-guide / guide-to-page pairing on both routes.
- The homepage, Vancouver city page, and guide library now surface the new garden-day route as part of the trust-first source-backed layer.
- Current machine truth is now `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links, with this garden-day wedge isolated as the ninth hosted queue candidate.

## Metadata And Canonical Caveat

- The recorded route proof for this batch is local-only, including direct browser-head proof on the two garden-day routes.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/` through `src/lib/seo.ts`, `src/components/Seo.tsx`, and `src/config/site.ts`.
- Hosted title, canonical, and JSON-LD behavior still need real smoke proof on `city.univenturestudio.com` after release.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted canonical and JSON-LD behavior on `city.univenturestudio.com`
- Search-engine crawl behavior after release
- Any indexing or ranking movement

## Approval Boundary

This batch is not part of the current first through eighth hosted source-backed queues.

This should remain a separate ninth source-backed release candidate rather than widening the earlier queues. Use `docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`, `docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md`, and `docs/seo-aeo-geo/GARDEN_DAY_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` to keep that release path-scoped and separate from the later routing releases.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
