# CityAtlas False Creek Culture Source-Backed Release Queue Packet

## Status

Local-ready only. Nothing in this packet has been deployed, pushed, submitted for indexing, or verified on the hosted public domain in this batch.

Use `docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live-release gate before any deploy approval.
Use `docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` as the exact local operator runbook once approval and a real live-base checkout exist.
This packet is intentionally seventh in sequence, behind `SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, and `WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`.
Use `docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` as the path-scoped file map for the False Creek culture queued release slice.
Use `docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the copy-safe rule set for re-cutting the False Creek culture queue from live truth.

## What This Queue Covers

Release these two routes together only after the first six hosted source-backed queues are resolved:

- `/vancouver/false-creek-culture-starters`
- `/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon`

Supporting local updates already included in this queue:

- the required False Creek culture route support inside shared files
- internal links from the homepage, city page, guide library, and other crawlable public surfaces only where those culture links can be isolated cleanly
- honest local crawl/context updates in `sitemap.xml` and `llms.txt`
- the owner-readable local approval packet for the False Creek culture wedge

## Why This Wedge Goes Seventh

This is the next clean source-backed wedge after the first six hosted queues because it:

- answers one narrow False Creek culture-afternoon question
- uses official public sources instead of scraped or review-inferred facts
- strengthens the destination-choice and neighborhood cluster instead of widening CityAtlas into a generic travel list
- keeps visible claim boundaries and the public correction path at `/editorial-standards`

This seventh queue also keeps release order and machine truth clear:

- the first queue is still the highest-priority hosted step
- the second queue already packages the out-of-town guest plus weekend-route pair
- the Sunday, returning-visitor, Kitsilano scenic, and west-side daytime wedges are already isolated as the third through sixth source-backed candidates
- the False Creek culture wedge is now documented as the seventh source-backed queue instead of floating as undocumented future work
- the UBC discovery wedge is now isolated separately as the eighth source-backed candidate
- the starter-pack guide can remain a later routing release after the nine source-backed queues
- current local useful-piece count is determinable at `37` useful pieces
- current local package now includes `23` answer-first guides
- current local package now includes `14` source-backed wedge collections
- current local machine now includes `70` source-backed anchors
- current local machine now includes `14` mapped guide-to-collection links
- hosted public source-backed wedges still verified live: `3`

## Official Sources Used

Checked June 14, 2026.

1. Granville Island Public Market official page
2. Museum of Vancouver official site
3. Vancouver Maritime Museum official site
4. H.R. MacMillan Space Centre official visit page
5. Kitsilano Beach official City of Vancouver page

## Content Gate Decision

`Ship after separate live deploy approval`

Why the False Creek culture wedge passes the current local gate:

- the audience and query class are clear
- the opening is specific and route-led
- the page avoids fake best-of or insider language
- official source, checked date, and correction path are visible
- the guide points to a useful next step instead of generic city-culture filler

## Claim Boundaries

- No universal best False Creek culture route claim
- No fake rankings, review scores, or insider authority
- No live operational guarantees, crowd guarantees, or pricing guarantees
- No broader city-completeness claim beyond this narrow culture starter layer

## Verified Locally

Route-specific batch checks were completed June 15, 2026. Current queue truth was refreshed June 15, 2026.

- `npm run typecheck` passed for the False Creek culture batch.
- `npm run build` passed for the False Creek culture batch, with only the existing non-blocking Vite large-chunk warning.
- `npm run readiness` passed for the False Creek culture batch and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/false-creek-culture-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both False Creek culture routes.
- Local `llms.txt` describes the False Creek culture source-backed page and matching guide as local-ready while keeping the live-domain wording honest about only three hosted source-backed wedges.
- `npm run seo:proof` now passes for the current local content machine at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, `14` mapped guide-to-collection links, and zero failures.
- `npm run seo:structure:proof` now passes for the current shared route-structure layer and includes the False Creek culture source-backed page plus matching guide in the checked route set.
- `npm run seo:docs:proof` now passes and keeps the False Creek culture queued release packet set aligned to the current local machine truth.
- The in-app browser re-verified local `/vancouver/false-creek-culture-starters` and `/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon` on June 15, 2026 and confirmed route-specific title, description, robots, canonical, JSON-LD, correction-path links, and the False Creek culture page-to-guide / guide-to-page pairing on both routes.
- Repo truth confirms the False Creek culture guide maps to `vancouver_false_creek_culture_starters` in `src/lib/sourceBackedCollections.ts`, `src/features/public/TrustPages.tsx` keeps the False Creek culture source-backed page CTA pointed at the matching guide, and `src/features/public/GuideDetailPage.tsx` contains the False Creek culture source-backed guide section.
- local route truth for these two False Creek culture routes is now refreshed against the active dev surface on `127.0.0.1:5178`.

## Metadata And Canonical Caveat

- The False Creek culture queue now has local browser-head proof for rendered title, description, robots, canonical, and JSON-LD behavior on both routes in the active dev surface.
- That proof still reflects the configured local base URL behavior in `src/lib/seo.ts`, `src/components/Seo.tsx`, and `src/config/site.ts`, which falls back to `http://127.0.0.1:5178/` during local runtime unless `VITE_CITYATLAS_PUBLIC_BASE_URL` is set.
- Hosted canonical, title, description, and JSON-LD behavior on `city.univenturestudio.com` remain unverified for this queue.

## Still Unverified

- hosted rendering on `city.univenturestudio.com`
- hosted `sitemap.xml` and `llms.txt` after release
- hosted guide-to-collection link pairing between the False Creek culture page and matching guide after release
- hosted title, description, canonical, and JSON-LD behavior on the live domain
- post-release crawl behavior
- indexing movement
- ranking movement

## Hosted Smoke Plan After Approval

If a live deploy is approved after the first six queues are resolved and before the eighth UBC discovery queue, verify in this order:

1. `curl -I` the two False Creek culture routes and confirm `200`
2. check hosted `sitemap.xml` for both False Creek culture URLs
3. check hosted `llms.txt` for honest route/state wording
4. render the False Creek culture source-backed page and guide in a browser on desktop and confirm source cards, correction links, the False Creek culture guide section, the False Creek culture page-to-guide / guide-to-page pairing, and hosted route metadata behavior
5. confirm `/admin` and `/private-preview/date-night` still behave as protected hosted routes and `/for-businesses/submit` still stays noindex

## Rollback Boundary

If the deploy is approved but any hosted smoke fails, roll back to the last known good production build and keep the False Creek culture wedge local-only until the issue is fixed. Do not widen protected routes, real-data claims, or provider access as part of this release.

## Exact Approval Sentence

If this becomes the next live action after the first six queues and before the eighth UBC discovery queue, use:

`Approve one CityAtlas production release that promotes the local-ready False Creek culture source-backed page and matching guide to city.univenturestudio.com, followed by hosted smoke on the two routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
