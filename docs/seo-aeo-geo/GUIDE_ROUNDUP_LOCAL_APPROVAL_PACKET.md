# Guide Roundup Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation`
- A new answer-first routing page for choosing the strongest CityAtlas Vancouver route by situation
- Local crawl/context updates in `sitemap.xml` and `llms.txt`
- Additional internal links into the current guide, source-backed, and neighborhood-intent library

## Why This Page Exists

CityAtlas already had enough route types that the question "which page should I open now?" had become a real planning problem. The roundup guide fixes that by sorting the strongest current CityAtlas routes by situation instead of forcing readers to browse the full library cold.

This batch stays narrow on purpose:

- it answers one routing question
- it does not add new venue claims
- it routes into already-built CityAtlas guide surfaces
- it keeps the trust boundary on the existing source-backed pages instead of widening unsupported facts

## Claim Boundaries

- This page does not add new venue rankings, reviews, or operational claims.
- This page does not pretend every Vancouver planning situation needs the same CityAtlas route.
- This page only routes readers into existing visitor, neighborhood, weekend, and source-backed guide surfaces.
- Any real-world venue facts still live on the linked source-backed pages, not on this guide.

## Content-Machine Count

- Prior determinable useful-piece count: 25
  - 16 answer-first guides
  - 9 source-backed wedges in the local package
- Local count after this batch: 26
  - 17 answer-first guides
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
- `npm run seo:proof` passed with `26` useful pieces, `17` guides, `9` source-backed wedge collections, `45` source-backed anchors, `9` mapped guide-to-collection links, and zero failures.
- `curl -I http://127.0.0.1:5178/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes the new guide route.
- Local `llms.txt` describes the new guide as local-ready and keeps the live-domain source-backed wording honest.
- Shared guide-detail rendering is already the current metadata surface for CityAtlas guide pages, so this route uses the same title, description, canonical, and JSON-LD pathway as the other proven guide pages.
- Current machine truth has since advanced to `37` useful pieces, `23` guides, `14` source-backed wedge collections, and `70` source-backed anchors, while this guide-roundup page remains part of the latest later routing-only release step.

## Metadata And Canonical Caveat

- Fresh browser or headless-DOM proof for this specific guide's route-level title, description, canonical, and JSON-LD was not rerun in this continuation.
- Route availability, crawl-file inclusion, and overall content-machine counts were re-verified.
- Hosted metadata and canonical behavior remain unverified until a future release and hosted smoke pass.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted metadata and canonical behavior on `city.univenturestudio.com`
- Search-engine crawl behavior after release
- Any indexing or ranking movement

## Approval Boundary

This guide is local-ready but should not cut ahead of the queued source-backed release decisions. It is a later routing-only release candidate and becomes more useful as more of the source-backed and answer-first library is already public.

If it becomes a future live candidate after the higher-priority source-backed queues, package it as a separate routing release rather than folding it into an unrelated source-backed deploy.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
