# CityAtlas Starter-Pack Routing Release Queue Packet

## Status

Local-ready only. Nothing in this packet has been deployed, pushed, submitted for indexing, or verified on the hosted public domain in this batch.

This packet is intentionally later in sequence, behind the nine source-backed release queues.

Use `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live-release gate before any deploy approval.
Use `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_OPERATOR_PACKET.md` as the exact local operator runbook once approval and a real live-base checkout exist.
Use `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_SLICE_HANDOFF.md` as the path-scoped file map for the starter-pack release slice.
Use `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` as the copy-safe rule set for re-cutting this routing release from live truth.

## What This Queue Covers

Release this route only after the nine source-backed queues are already resolved:

- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`

Supporting local updates already included in this queue:

- the required starter-pack guide record and direct-path rendering support
- internal links from the homepage, city page, About page, guide library, footer, and the guide itself into the strongest current CityAtlas wedges
- honest local crawl/context updates in `sitemap.xml` and `llms.txt`
- the local approval packet for the guide

## Why This Guide Goes Later

This is a routing release, not a new source-backed wedge.

It belongs after the higher-priority source-backed promotions because it works best once more of the source-backed library is already public:

- it answers one real routing question
- it does not add new venue claims
- it helps readers and crawlers choose the right CityAtlas page first
- it becomes more useful as more of the official-source wedge library is live

## Content Gate Decision

`Ship after separate live deploy approval`

Why this guide passes the current local gate:

- the audience and routing question are clear
- the opening is specific and route-led
- the page does not add fake rankings, reviews, or venue authority
- it points to existing source-backed pages when real anchors matter
- the correction path and trust model stay easy to find

## Claim Boundaries

- No new venue rankings, reviews, or operational claims
- No claim that every Vancouver user needs the same CityAtlas path
- No new real-world facts beyond the already-linked source-backed pages
- No claim that the starter-pack guide should go live ahead of the higher-priority source-backed queues

## Verified Locally

Completed June 14, 2026.

- `npm run typecheck` passed for the starter-pack guide batch.
- `npm run build` passed for the starter-pack guide batch.
- `npm run readiness` passed for the starter-pack guide batch and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes the starter-pack guide route.
- Local `llms.txt` describes the starter-pack guide as local-ready and keeps the live-domain source-backed wording honest.
- `npm run seo:structure:proof` now passes for the current shared route-structure layer and includes the starter-pack guide in the checked route set.
- The in-app browser rendered the guide and showed the guide hero, direct-path section, query-class framing, FAQ block, related guides, and the expected internal links into the current source-backed wedges.
- The same local browser pass confirmed route-specific title, description, robots, breadcrumb/article JSON-LD, and canonical behavior against the configured local base URL `http://127.0.0.1:5178/`.
- A 390px browser pass kept the direct-path section present with no horizontal overflow.
- Current machine truth has since advanced to `37` useful pieces, `23` answer-first guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links while this guide remains intentionally queued later than the source-backed release ladder.

## Metadata And Canonical Caveat

- The starter-pack packet has recorded local browser proof for route-specific title, description, robots, canonical, and breadcrumb/article JSON-LD.
- That local canonical/JSON-LD proof reflects the configured local base URL behavior in `src/components/Seo.tsx` and `src/config/site.ts`, which falls back to `http://127.0.0.1:5178/` during local runtime unless `VITE_CITYATLAS_PUBLIC_BASE_URL` is set.
- Hosted canonical and JSON-LD behavior on `city.univenturestudio.com` is still unverified for this routing release.

## Still Unverified

- hosted rendering on `city.univenturestudio.com`
- hosted `sitemap.xml` and `llms.txt` after release
- hosted canonical and JSON-LD behavior on the live domain
- post-release crawl behavior
- indexing movement
- ranking movement

## Hosted Smoke Plan After Approval

If a live deploy is approved after the nine source-backed queues are resolved, verify in this order:

1. `curl -I` the starter-pack guide route and confirm `200`
2. check hosted `sitemap.xml` for the guide route
3. check hosted `llms.txt` for honest route/state wording
4. render the guide in a browser and confirm the direct-path section, internal links, and hosted route metadata behavior
5. confirm `/admin` and `/private-preview/date-night` still behave as protected hosted routes

## Rollback Boundary

If the deploy is approved but any hosted smoke fails, roll back to the last known good production build and keep the guide local-only until the issue is fixed. Do not widen protected routes, real-data claims, or provider access as part of this release.

## Exact Approval Sentence

If this becomes the next live action after the nine source-backed queues, use:

`Approve one CityAtlas production release that promotes the local-ready starter-pack routing guide to city.univenturestudio.com, followed by hosted smoke on the route, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
