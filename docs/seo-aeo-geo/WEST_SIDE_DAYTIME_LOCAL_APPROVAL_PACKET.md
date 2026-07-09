# West-Side Daytime Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/west-side-daytime-starters`
- `/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan`
- internal links from the homepage, city page, guide library, and neighborhood-routing surfaces
- local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Page Exists

CityAtlas already had a Kitsilano evening starter layer, but daytime west-side planning is a different question. This batch gives CityAtlas a destination-first answer for people deciding between beach, campus, and garden pacing before the day turns into a scattered citywide plan.

This batch stays narrow on purpose:

- it answers one west-side daytime route question
- it uses official public sources
- it supports the neighborhood and destination-intent cluster without inflating CityAtlas into a fake verified directory
- it keeps the correction path visible at `/editorial-standards`

## Official Sources Used

Checked June 14, 2026.

1. Jericho Beach official City of Vancouver page
2. Locarno Beach official City of Vancouver page
3. Museum of Anthropology at UBC visit page
4. Nitobe Memorial Garden official page
5. UBC Botanical Garden visit page

## Claim Boundaries

- This page does not claim a universal best west-side daytime route.
- This page does not publish fake rankings, reviews, or insider certainty.
- This page does not claim live pricing, availability, or operational guarantees.
- This page only uses real-place facts where an official public source supported the narrow daytime-starter framing.

## Content-Machine Count

- Prior determinable useful-piece count: 29
  - 19 answer-first guides
  - 10 source-backed wedges in the local package
- Local count after this batch: 31
  - 20 answer-first guides
  - 11 source-backed wedges in the local package

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run seo:proof`
- `npm run readiness`
- local preview route checks for the new source-backed page and matching guide
- local verification that `sitemap.xml` and `llms.txt` expose the new routes and describe release state honestly
- local verification that the homepage, city page, and guide-library trust surfaces can reach the new wedge

## Local Verification Completed

Completed June 14, 2026.

- `npm run typecheck` passed.
- `npm run build` passed, with only the existing non-blocking Vite large-chunk warning.
- `npm run seo:proof` passed and confirmed `31` useful pieces, `20` guides, `11` source-backed wedge collections, `55` source-backed anchors, `11` mapped guide-to-collection links, and zero failures.
- `curl -I http://127.0.0.1:5178/vancouver/west-side-daytime-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both west-side daytime routes.
- Local `llms.txt` describes the west-side daytime source-backed page and matching guide as local-ready while keeping the live-domain description honest about only three hosted source-backed wedges.
- The in-app browser re-verified local `/vancouver/west-side-daytime-starters` and `/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan` on June 15, 2026 and confirmed route-specific title, description, robots, canonical, JSON-LD, correction-path links, and the page-to-guide / guide-to-page pairing on both routes.
- The homepage, Vancouver city page, and guide library now surface the new west-side daytime route as part of the trust-first source-backed layer.
- Current machine truth has since advanced to `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links, while this west-side daytime wedge remains part of the sixth hosted queue.

## Metadata And Canonical Caveat

- The recorded route proof for this batch is local-only, including direct browser-head proof on the two west-side daytime routes.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/` through `src/lib/seo.ts`, `src/components/Seo.tsx`, and `src/config/site.ts`.
- Hosted title, canonical, and JSON-LD behavior still need real smoke proof on `city.univenturestudio.com` after release.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted canonical and JSON-LD behavior on `city.univenturestudio.com`
- Search-engine crawl behavior after release
- Any indexing or ranking movement

## Approval Boundary

This batch is not part of the current first, second, third, fourth, or fifth hosted source-backed queues.

This should remain a separate sixth source-backed release candidate rather than widening the earlier queues. Use `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`, `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md`, and `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` to keep that release path-scoped and separate from the later routing releases.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
