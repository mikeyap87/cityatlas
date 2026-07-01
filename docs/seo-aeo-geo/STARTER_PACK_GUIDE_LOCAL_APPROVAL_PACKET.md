# Starter Pack Guide Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`
- A reusable direct-path section inside guide detail pages for future internal-link hubs
- Internal links from the homepage, city page, About page, guide library, footer, and the guide itself into the strongest current CityAtlas wedges
- Local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Page Exists

CityAtlas now has enough live and local-ready Vancouver pages that "which page should I open first?" has become its own real planning problem. The starter-pack guide fixes that by routing people and crawlers into the right existing CityAtlas page fast instead of forcing them to guess between guides, source-backed starters, missions, and the planner.

This batch stays narrow on purpose:

- it answers one routing question
- it does not add new venue claims
- it points to existing source-backed pages when real anchors matter
- it keeps the correction path and trust model easy to find

## Claim Boundaries

- This page does not add new venue rankings, reviews, or operational claims.
- This page does not pretend every Vancouver user needs the same CityAtlas path.
- This page only routes readers toward existing guides, source-backed pages, missions, and the planner based on intent.
- Any real-world venue facts still live on the linked source-backed pages, not on this guide.

## Content-Machine Count

- Prior determinable useful-piece count: 20
  - 13 answer-first guides
  - 7 source-backed wedges in the local package
- Local count after this batch: 21
  - 14 answer-first guides
  - 7 source-backed wedges in the local package

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run readiness`
- local preview route check for the new guide
- local verification that `sitemap.xml` and `llms.txt` expose the new guide honestly
- local browser proof that the guide shows the direct-path section, route-specific metadata, and the expected internal links

## Local Verification Completed

Completed June 14, 2026.

- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run readiness` passed and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes the new guide.
- Local `llms.txt` describes the new guide as local-ready and keeps the live-domain source-backed wording honest.
- The in-app browser rendered the new guide and showed the guide hero, direct-path section, query-class framing, FAQ block, related guides, and the expected internal links into the current source-backed wedges.
- The same local browser pass confirmed route-specific title, description, robots, breadcrumb/article JSON-LD, and canonical behavior against the configured local base URL `http://127.0.0.1:5178/`.
- A 390px browser pass kept the direct-path section present with no horizontal overflow.
- `npx tsx --eval` verified the local ranking surface at `21` useful pieces: `14` guides plus `7` source-backed wedge collections.
- Current machine truth has since advanced to `37` useful pieces, `23` guides, `14` source-backed wedge collections, and `70` source-backed anchors, while this starter-pack guide remains part of the later routing-only release ladder behind the nine source-backed queues.
- No deploy, hosted smoke, or production mutation was performed in this batch.

## Metadata And Canonical Caveat

- The recorded metadata proof for this batch is local-only.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted title, canonical, and JSON-LD behavior still need real smoke proof on `city.univenturestudio.com` after release.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted title, canonical, and JSON-LD behavior after release
- Search-engine crawl behavior after release
- Any indexing or ranking movement

## Approval Boundary

This guide is local-ready but should not cut ahead of the queued first-time visitor plus wellness release or the later out-of-town guest and weekend-route release decisions. It is a later content-only release candidate that improves routing into the existing library once the higher-priority source-backed promotions are resolved.

If it becomes the next local packaging step after those queues, use:

- `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_SLICE_HANDOFF.md`
- `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md`

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
