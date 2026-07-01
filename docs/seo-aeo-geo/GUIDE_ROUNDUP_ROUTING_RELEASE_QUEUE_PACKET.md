# CityAtlas Guide-Roundup Routing Release Queue Packet

## Status

Local-ready only. Nothing in this packet has been deployed, pushed, submitted for indexing, or verified on the hosted public domain in this batch.

This packet is intentionally later in sequence, behind the nine source-backed release queues plus the earlier starter-pack and low-friction routing steps.

Use `docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live-release gate before any deploy approval.
Use `docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_OPERATOR_PACKET.md` as the exact local operator runbook once approval and a real live-base checkout exist.
Use `docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_SLICE_HANDOFF.md` as the path-scoped file map for the guide-roundup routing release slice.
Use `docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` as the copy-safe rule set for re-cutting this routing release from live truth.

## What This Queue Covers

Release this route only after the higher-priority source-backed queues and the earlier routing-only releases are already resolved:

- `/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation`

Supporting local updates already included in this queue:

- the required guide-roundup guide record
- its direct-path routing section and related shared guide rendering support
- honest local crawl/context updates in `sitemap.xml` and `llms.txt`
- the local approval packet for the guide

## Why This Guide Goes Later

This is a routing release, not a new source-backed wedge.

It belongs after the higher-priority source-backed promotions because it works best once more of the guide and source-backed library is already public:

- it answers one real routing question
- it does not add new venue claims
- it helps readers choose the strongest CityAtlas route family by situation
- it becomes more useful once the source-backed and earlier routing surfaces already exist on the live domain

## Content Gate Decision

`Ship after separate live deploy approval`

Why this guide passes the current local gate:

- the audience and routing question are clear
- the opening is specific and route-led
- the page does not add fake rankings, reviews, or venue authority
- it points to already-built route families instead of inventing new claims
- the trust boundary stays on the existing source-backed pages where real anchors matter

## Claim Boundaries

- No new venue rankings, reviews, or operational claims
- No claim that every Vancouver planning situation should use the same route family
- No new real-world facts beyond the already-linked source-backed pages
- No claim that the guide-roundup page should go live ahead of the higher-priority source-backed or earlier routing releases

## Verified Locally

Completed June 14, 2026.

- `npm run typecheck` passed for the guide-roundup batch.
- `npm run build` passed for the guide-roundup batch.
- `npm run readiness` passed for the guide-roundup batch and kept `CityAtlas readiness average: 90%`.
- `npm run seo:proof` first passed for the guide-roundup batch at `26` useful pieces, `17` answer-first guides, `9` source-backed wedge collections, `45` source-backed anchors, `9` mapped guide-to-collection links, and zero failures.
- `curl -I http://127.0.0.1:5178/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes the guide-roundup route.
- Local `llms.txt` describes the guide-roundup page as local-ready and keeps the live-domain source-backed wording honest.
- `npm run seo:structure:proof` now passes for the current shared route-structure layer and includes the guide-roundup guide in the checked route set.
- Current machine truth has since advanced to `37` useful pieces, `23` answer-first guides, `14` source-backed wedge collections, `70` source-backed anchors, `14` mapped guide-to-collection links, and zero failures.
- Current queue order still keeps this release behind the nine source-backed queues plus the earlier starter-pack and low-friction routing steps.

## Metadata And Canonical Caveat

- The guide-roundup packet has recorded local proof for route-specific title, description, and guide-detail output through the shared guide rendering system.
- Fresh route-level structure proof now covers this guide's title, description, robots, and breadcrumb/article FAQ JSON-LD generation, but direct browser-head canonical proof for this specific guide was not rerun in this continuation.
- That local proof still reflects the configured local base URL behavior in `src/components/Seo.tsx` and `src/config/site.ts`, which falls back to `http://127.0.0.1:5178/` during local runtime unless `VITE_CITYATLAS_PUBLIC_BASE_URL` is set.
- Hosted canonical and JSON-LD behavior on `city.univenturestudio.com` is still unverified for this routing release.

## Still Unverified

- hosted rendering on `city.univenturestudio.com`
- hosted `sitemap.xml` and `llms.txt` after release
- hosted canonical and JSON-LD behavior on the live domain
- post-release crawl behavior
- indexing movement
- ranking movement

## Hosted Smoke Plan After Approval

If a live deploy is approved after the earlier source-backed and routing queues are resolved, verify in this order:

1. `curl -I` the guide-roundup route and confirm `200`
2. check hosted `sitemap.xml` for the guide route
3. check hosted `llms.txt` for honest route/state wording
4. render the guide in a browser and confirm the routing sections, internal links, and hosted route metadata behavior
5. confirm `/admin` and `/private-preview/date-night` still behave as protected hosted routes

## Rollback Boundary

If the deploy is approved but any hosted smoke fails, roll back to the last known good production build and keep the guide local-only until the issue is fixed. Do not widen protected routes, real-data claims, or provider access as part of this release.

## Exact Approval Sentence

If this becomes the next live action after the earlier source-backed and routing queues, use:

`Approve one CityAtlas production release that promotes the local-ready guide-roundup routing page to city.univenturestudio.com, followed by hosted smoke on the route, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
