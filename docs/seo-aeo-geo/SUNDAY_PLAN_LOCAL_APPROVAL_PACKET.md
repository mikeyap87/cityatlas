# Sunday Plan Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/sunday-starters`
- `/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan`
- Internal links from the homepage, city page, guide library, About page, and footer
- Local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Page Exists

CityAtlas already had date-night, rainy-day, first-evening, first-time visitor, out-of-town guest, weekend-route, and wellness-reset source-backed wedges. The next safe content-machine step was a Sunday-intent page for people who want one easy Vancouver anchor without turning Sunday into a catch-up marathon.

This batch stays narrow on purpose:

- it answers one low-effort Sunday-planning question
- it uses official public sources
- it stays distinct from the broader weekend-route wedge
- it keeps the correction path visible at `/editorial-standards`

## Official Sources Used

Checked June 14, 2026.

1. Bill Reid Gallery hours and admissions page
2. Museum of Vancouver official site
3. Vancouver Public Library Central Library branch page
4. VanDusen Botanical Garden official City of Vancouver page
5. Bloedel Conservatory official City of Vancouver page

## Claim Boundaries

- This page does not claim one universal best Vancouver Sunday plan.
- This page does not publish fake rankings, reviews, or insider authority.
- This page does not claim live pricing, availability, or operational guarantees.
- This page only uses real-place facts where an official public source supported the narrow Sunday-planning framing.

## Content-Machine Count

- Prior determinable useful-piece count: 21
  - 14 answer-first guides
  - 7 source-backed wedges in the local package
- Local count after this batch: 23
  - 15 answer-first guides
  - 8 source-backed wedges in the local package

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run readiness`
- local preview route checks for the new source-backed page and new guide
- local verification that `sitemap.xml` and `llms.txt` expose the new route and describe its release state honestly
- stronger local proof that the route data, crawl files, and source-backed mapping are wired correctly

## Local Verification Completed

Completed June 14, 2026.

- `npm run typecheck` passed.
- `npm run build` passed, with only the existing non-blocking Vite large-chunk warning.
- `npm run readiness` passed and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/sunday-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both new Sunday routes.
- Local `llms.txt` describes the new source-backed page and matching guide as local-ready while keeping the live-domain description honest about only three hosted source-backed pages.
- `npx tsx --eval` verified the local ranking surface at `23` useful pieces: `15` guides plus `8` source-backed wedge collections.
- The same `npx tsx --eval` proof confirmed the Sunday guide exists, points its CTA to `/vancouver/sunday-starters`, maps five official-source Sunday places, and exposes the Sunday source-backed metadata path/title pair in `sourceBackedCollectionMeta`.
- `rg -n` verified Sunday link entry points on the homepage, `/vancouver`, the guide library, `/about`, the footer, plus the expected `sitemap.xml` and `llms.txt` entries.
- `npm run seo:proof` now passes for the current local content machine at `39` useful pieces, `24` guides, `15` source-backed wedge collections, `75` source-backed anchors, `15` mapped guide-to-collection links, and zero failures.
- `npm run seo:structure:proof` now passes for the current shared route-structure layer and includes the Sunday source-backed page plus matching guide in the checked route set.
- `npm run seo:docs:proof` now passes and keeps the Sunday queued release packet set aligned to the current local machine truth.
- `npm run seo:smoke:sunday` now passes on June 16, 2026 in `route-model-only` fallback mode and verifies the Sunday route model plus local `sitemap.xml` and `llms.txt`, while recording the current browser-launch failure as a warning in the smoke artifact.
- Historical browser-head proof from June 15, 2026 still exists for the Sunday page and matching guide, but it was not freshly re-run in a browser-capable environment during the June 16 refresh.
- Current machine truth has since advanced to `39` useful pieces, `24` guides, `15` source-backed wedge collections, `75` source-backed anchors, and `15` mapped guide-to-collection links, while this Sunday wedge remains part of the third hosted queue.
- No deploy, hosted smoke, or production mutation was performed in this batch.

## Local Render Caveat

- Preview route checks returned `200`, and the stronger local server-render proof now confirmed visible Sunday source cards, the correction-path link, the Sunday guide section, and the Sunday rail link.
- A fresh browser-rendered rerun for the Sunday source-backed page and matching guide still needs a browser-capable local environment; the current reusable smoke artifact is route-model-only.

## Metadata And Canonical Caveat

- The recorded metadata proof for this batch is local-only, and the fresh reusable smoke artifact is route-model-only because browser launch is failing in this environment.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted title, description, canonical, and JSON-LD behavior still need real smoke proof on `city.univenturestudio.com` after release.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted route metadata and canonical behavior after release
- Search-engine crawl behavior after release
- Any indexing or ranking movement

## Approval Boundary

This batch is not part of the current first-time visitor plus wellness release queue or the second out-of-town guest plus weekend-route release queue.

If local proof stays clean, this should remain a separate future source-backed release candidate rather than widening either existing queue. Use `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md`, and `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` to keep that Sunday release path-scoped and separate from the later starter-pack routing release.

The exact live gate now lives in `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
