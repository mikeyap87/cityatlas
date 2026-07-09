# Low-Friction Route Chooser Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today`
- A new answer-first routing page for rainy-day, wellness, Sunday, weekend-route, and first-evening path selection
- Local crawl/context updates in `sitemap.xml` and `llms.txt`
- Additional internal links into the current lower-friction CityAtlas guide system

## Why This Page Exists

CityAtlas already had multiple lower-friction Vancouver routes, but not a page that helps someone decide which easy path fits the day first. This guide fixes that by routing people into the right easier-plan cluster instead of forcing them to guess between rainy-day, wellness, Sunday, weekend-route, first-evening, starter-pack, and roundup pages.

This batch stays narrow on purpose:

- it answers one routing question
- it does not add new venue claims
- it routes into already-built CityAtlas guide surfaces
- it keeps the trust boundary on the existing source-backed pages instead of widening unsupported facts

## Claim Boundaries

- This page does not add new venue rankings, reviews, or operational claims.
- This page does not pretend every easy Vancouver plan should use the same route family.
- This page only routes readers into existing rainy-day, wellness, Sunday, weekend-route, first-evening, starter-pack, and roundup pages.
- Any real-world venue facts still live on the linked source-backed pages, not on this guide.

## Content-Machine Count

- Prior determinable useful-piece count: 26
  - 17 answer-first guides
  - 9 source-backed wedges in the local package
- Local count after this batch: 27
  - 18 answer-first guides
  - 9 source-backed wedges in the local package

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run readiness`
- `npm run seo:proof`
- local preview route check for the new guide
- local verification that `sitemap.xml` and `llms.txt` expose the new guide honestly
- local browser or DOM proof that the guide shows the expected routing sections and route-specific metadata behavior

## Local Verification Completed

Completed June 14, 2026.

- `npm run typecheck` passed.
- `npm run build` passed, with only the existing non-blocking Vite large-chunk warning.
- `npm run readiness` passed and kept `CityAtlas readiness average: 90%`.
- `npm run seo:proof` now passes with `29` useful pieces, `19` guides, `10` source-backed wedge collections, `50` source-backed anchors, `10` mapped guide-to-collection links, and zero failures.
- `curl -I http://127.0.0.1:5178/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes the new guide route.
- Local `llms.txt` describes the new guide as local-ready and keeps the live-domain source-backed wording honest.
- Headless Chrome local DOM proof confirmed the rendered title, description, direct-path routing section, FAQ block, related guides, and internal links into the rainy-day, wellness, Sunday, weekend-route, first-evening, roundup, and starter-pack paths.
- Current machine truth has since advanced to `37` useful pieces, `23` guides, `14` source-backed wedge collections, and `70` source-backed anchors, with this guide sitting behind the full nine-queue source-backed ladder.

## Metadata And Canonical Caveat

- Fresh route availability and machine counts were re-verified in this continuation.
- The earlier local DOM proof covered title and description rendering for this guide, but hosted canonical and JSON-LD behavior are still unverified.
- Hosted metadata behavior should stay unclaimed until a future release and hosted smoke pass.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted metadata and canonical behavior on `city.univenturestudio.com`
- Search-engine crawl behavior after release
- Any indexing or ranking movement

## Approval Boundary

This guide is local-ready but should not cut ahead of the queued first, second, Sunday, or returning-visitor source-backed release decisions. It is a later routing-only release candidate, like the starter-pack guide, and is most useful after more of the source-backed library is already public.

If it becomes a future live candidate after the higher-priority source-backed queues, package it as a separate routing release rather than folding it into an unrelated source-backed deploy.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
