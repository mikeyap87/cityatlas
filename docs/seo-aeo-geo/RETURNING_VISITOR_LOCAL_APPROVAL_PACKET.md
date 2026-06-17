# Returning Visitor Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/vancouver/returning-visitor-starters`
- `/vancouver/guides/vancouver-local-discovery-for-returning-visitors`
- Internal links from the homepage, city page, guide library, About page, and footer
- Starter-pack guide routing support inside shared guide data
- Local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Page Exists

CityAtlas already had date-night, rainy-day, first-evening, first-time visitor, out-of-town guest, weekend-route, Sunday, and wellness-reset source-backed wedges. The next safe content-machine step was a returning-visitor page for people who already know the obvious first-trip Vancouver route and want a more local-feeling second look.

This batch stays narrow on purpose:

- it answers one returning-visitor local-discovery question
- it uses official public sources
- it stays distinct from the first-time visitor, weekend-route, and Sunday wedges
- it keeps the correction path visible at `/editorial-standards`

## Official Sources Used

Checked June 14, 2026.

1. Commercial Drive official site
2. Chinatown Storytelling Centre official site
3. Trout Lake Beach official City of Vancouver page
4. Museum of Anthropology at UBC visit page
5. Nitobe Memorial Garden official page

## Claim Boundaries

- This page does not claim universal hidden gems or insider authority.
- This page does not publish fake rankings, reviews, or local-favorite certainty.
- This page does not claim live pricing, availability, or operational guarantees.
- This page only uses real-place facts where an official public source supported the narrow returning-visitor framing.

## Content-Machine Count

- Prior determinable useful-piece count: 23
  - 15 answer-first guides
  - 8 source-backed wedges in the local package
- Local count after this batch: 25
  - 16 answer-first guides
  - 9 source-backed wedges in the local package

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run readiness`
- local preview route checks for the new source-backed page and new guide
- local verification that `sitemap.xml` and `llms.txt` expose the new routes and describe release state honestly
- stronger local proof that the route data, crawl files, metadata mapping, and rendered source-backed content are wired correctly

## Local Verification Completed

Completed June 14, 2026.

- `npm run typecheck` passed.
- `npm run build` passed, with only the existing non-blocking Vite large-chunk warning.
- `npm run readiness` passed and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/returning-visitor-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/vancouver-local-discovery-for-returning-visitors` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both new returning-visitor routes.
- Local `llms.txt` describes the new source-backed page and matching guide as local-ready while keeping the live-domain description honest about only three hosted source-backed pages.
- `npx tsx --eval` verified the local ranking surface at `26` useful pieces: `17` guides plus `9` source-backed wedge collections.
- The same `npx tsx --eval` proof confirmed the returning-visitor guide exists, points its CTA to `/vancouver/returning-visitor-starters`, links back into the first-time visitor, weekend-route, and starter-pack paths, maps five official-source returning-visitor places, and exposes the returning-visitor source-backed metadata path/title pair in `sourceBackedCollectionMeta`.
- The in-app browser re-verified local `/vancouver/returning-visitor-starters` and `/vancouver/guides/vancouver-local-discovery-for-returning-visitors` on June 15, 2026 and confirmed route-specific title, description, robots, canonical, JSON-LD, correction-path links, and the returning-visitor page-to-guide / guide-to-page pairing on both routes.
- Local desktop screenshot proof showed the returning-visitor source-backed page rendering a clean hero, trust panel, visible source-backed cards, and correction-path actions.
- `npm run seo:proof` now passes for the current local content machine at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, `14` mapped guide-to-collection links, and zero failures.
- `npm run seo:structure:proof` now passes for the current shared route-structure layer and includes the returning-visitor source-backed page plus matching guide in the checked route set.
- `npm run seo:docs:proof` now passes and keeps the returning-visitor queued release packet set aligned to the current local machine truth.
- Current machine truth has since advanced to `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links, while this returning-visitor wedge remains part of the fourth hosted queue.
- No deploy, hosted smoke, or production mutation was performed in this batch.

## Local Render Follow-Up

- A narrow mobile screenshot pass initially showed lower section-header crowding and wider overflow on the returning-visitor source-backed page.
- Follow-up fixes landed in `src/styles/components.css`, `src/styles/responsive.css`, and the returning-visitor section title copy in `src/features/public/TrustPages.tsx`.
- A final 390px headless Chrome screenshot pass on June 14, 2026 showed a clean readable mobile state for the returning-visitor hero, trust panel, section header, and source-backed card stack.

## Metadata And Canonical Caveat

- The recorded metadata proof for this batch is local-only, including direct browser-head proof on the two returning-visitor routes.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted title, description, canonical, and JSON-LD behavior still need real smoke proof on `city.univenturestudio.com` after release.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted route metadata and canonical behavior after release
- Search-engine crawl behavior after release
- Any indexing or ranking movement

## Approval Boundary

This batch is not part of the current first-time visitor plus wellness release queue, the second out-of-town guest plus weekend-route release queue, or the third Sunday release queue.

This should remain a separate future source-backed release candidate rather than widening the earlier queues. Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md`, and `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` to keep that returning-visitor release path-scoped and separate from the later starter-pack routing release.

The exact live gate now lives in `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
