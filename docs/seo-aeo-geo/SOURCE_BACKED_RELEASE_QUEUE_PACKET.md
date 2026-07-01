# CityAtlas Source-Backed Release Queue Packet

## Status

Local-ready only. Nothing in this packet has been deployed, pushed, submitted for indexing, or verified on the hosted public domain in this batch.

Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live-release gate before any deploy approval.
Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` as the exact local execution runbook once a live release is approved.
Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` as the path-scoped file map for the first queued release slice.
Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the copy-safe rule set for re-cutting the first queue from live truth.

## What This Queue Covers

Release these four routes together when a separate live deploy is approved:

- `/vancouver/first-time-visitor-starters`
- `/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`
- `/vancouver/wellness-reset-starters`
- `/vancouver/guides/vancouver-wellness-experiences-to-review`

Supporting local updates already included in this queue:

- the required first-time visitor and wellness route support inside shared files
- internal links from the homepage, city page, guide library, About page, and footer only where those first-queue links can be isolated without also shipping the later queued wedges
- honest local crawl/context updates in `sitemap.xml` and `llms.txt`
- owner-readable approval packets for each wedge

## Why These Two Wedges Go Next

These are the strongest local-ready follow-through pages after the first-evening release because they both:

- answer one clear Vancouver planning question
- use official public sources instead of scraped or review-inferred facts
- keep visible claim boundaries and a public correction path at `/editorial-standards`
- improve city/entity clarity without pretending CityAtlas is already a full verified directory

This queue also keeps the content machine honest:

- local useful-piece count is now determinable at `37`
- answer-first guides in the local package: `23`
- source-backed wedge collections in the local package: `14`
- source-backed anchors in the local package: `70`
- mapped guide-to-collection links in the local package: `14`
- hosted public source-backed wedges still verified live: `3`

The newer out-of-town guest, weekend-route, Sunday, returning-visitor, Kitsilano scenic, west-side daytime, False Creek culture, UBC discovery, and garden-day batches are local-ready too, but they are not part of this next release queue. They are isolated separately in their own queue packets so the later release steps stay explicit instead of drifting into vague future work. The later starter-pack routing release is also isolated separately in `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_QUEUE_PACKET.md`, but none of that later work is part of this first hosted slice.

The work-friendly cafe wedge stays deferred because official/current source support for laptop, seating, access, and work-mode claims is still too thin for a trust-first real-world wedge.

## Official Sources Used

Checked June 14, 2026.

### First-Time Visitor

1. Vancouver Art Gallery visit page
2. Gastown official district site
3. Granville Island Public Market official page
4. Stanley Park official City of Vancouver page
5. Queen Elizabeth Park official City of Vancouver page

### Wellness Reset

1. Vancouver Public Library Central Library branch page
2. Stanley Park official City of Vancouver page
3. Queen Elizabeth Park official City of Vancouver page
4. Bloedel Conservatory official City of Vancouver page
5. VanDusen Botanical Garden official City of Vancouver page

## Content Gate Decision

`Ship after separate live deploy approval`

Why both wedges pass the current local gate:

- the audience and query class are clear
- the openings are specific and route-led
- the pages avoid fake "best of" language
- official source, checked date, and correction path are visible
- the guides point to a useful next step instead of generic city fluff

## Claim Boundaries

- No universal "must see" claims
- No fake rankings, review scores, or insider authority
- No medical, therapeutic, or treatment claims
- No live operational guarantees, crowd guarantees, or pricing guarantees
- No broader city-completeness claim beyond these narrow starter layers

## Verified Locally

Completed June 14, 2026.

- `npm run typecheck` passed for the first-time visitor batch.
- `npm run build` passed for the first-time visitor batch.
- `npm run readiness` passed for the first-time visitor batch and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/first-time-visitor-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/where-should-a-first-time-vancouver-visitor-start` returned `HTTP/1.1 200 OK`.
- Local browser verification showed the first-time visitor page rendering five official-source cards, checked-date framing, correction-path links, and the matching guide section plus the page-to-guide CTA.
- The in-app browser re-verified the first-time visitor source-backed page and matching guide and confirmed route-specific title, description, robots, canonical, JSON-LD, visible correction-path links, and the page-to-guide / guide-to-page pairing on both routes.
- 390px browser verification showed no horizontal overflow on local `/vancouver` or `/vancouver/first-time-visitor-starters`.
- `npm run typecheck` passed for the wellness reset batch.
- `npm run build` passed for the wellness reset batch.
- `npm run readiness` passed for the wellness reset batch and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/wellness-reset-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/vancouver-wellness-experiences-to-review` returned `HTTP/1.1 200 OK`.
- Local browser verification showed the wellness page rendering five official-source cards, checked-date framing, correction-path links, and the upgraded guide section plus the page-to-guide CTA.
- The in-app browser re-verified the wellness source-backed page and upgraded guide and confirmed route-specific title, description, robots, canonical, JSON-LD, visible correction-path links, and the page-to-guide / guide-to-page pairing on both routes.
- 390px browser verification showed no horizontal overflow on local `/vancouver/wellness-reset-starters`.
- Local `sitemap.xml` includes both source-backed routes.
- Local `llms.txt` describes both wedges honestly as local-ready while keeping the live-domain description honest about only three hosted source-backed wedges.
- `npm run seo:proof` now passes for the current local content machine at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, `14` mapped guide-to-collection links, and zero failures.
- `npm run seo:structure:proof` now passes for the current local structure layer across `33` key routes, including `/vancouver`, `/vancouver/guides`, `/vancouver/missions`, `/for-businesses/pricing`, every currently queued source-backed guide/page pair, the later routing guides, and the protected noindex routes.
- `npm run seo:docs:proof` now passes and keeps the first queued release packet set aligned to the current local machine truth.
- `npm run seo:smoke:first` now passes on the local preview base and verifies the four first-queue routes, rendered title/robots/canonical/JSON-LD behavior, pairing fragments, `sitemap.xml`, `llms.txt`, and the noindex route surfaces. The hosted guard-route notices are intentionally skipped on localhost and remain a real-domain smoke requirement.
- local route truth for these four first-queue routes is now refreshed against the active dev surface on `127.0.0.1:5178`.
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md` now records the current queue order, local proof state, and still-unverified hosted gaps in one owner-readable handoff.

## Metadata And Canonical Caveat

- The first-time visitor and wellness packets now both have recorded local browser proof for route-specific title, description, robots, canonical, and JSON-LD.
- The shared CityAtlas route layer now also has a passing reusable structure-proof command that verifies hub breadcrumbs, CollectionPage coverage, source-backed ItemList coverage, and FAQ schema on representative key routes before any release packet is treated as current.
- That local canonical/JSON-LD proof reflects the configured local base URL behavior in `src/lib/seo.ts`, `src/components/Seo.tsx`, and `src/config/site.ts`, which falls back to `http://127.0.0.1:5178/` during local runtime unless `VITE_CITYATLAS_PUBLIC_BASE_URL` is set.
- Hosted canonical and JSON-LD behavior on `city.univenturestudio.com` is still unverified for this first queue.

## Still Unverified

- hosted rendering on `city.univenturestudio.com`
- hosted `sitemap.xml` and `llms.txt` after release
- hosted guide-to-collection link pairings across the four first-queue routes after release
- hosted canonical and JSON-LD behavior on the live domain
- post-release crawl behavior
- indexing movement
- ranking movement

## Hosted Smoke Plan After Approval

If a live deploy is approved, verify in this order:

1. run `npm run seo:smoke:first -- --base-url=https://city.univenturestudio.com`
2. render the two source-backed pages and two guides in a browser and confirm source cards, correction links, guide rail sections, matching guide-to-collection links, and visible route-logic behavior
3. confirm `/admin` and `/private-preview/date-night` still behave as protected hosted routes and `/for-businesses/submit` still stays noindex

## Rollback Boundary

If the deploy is approved but any hosted smoke fails, roll back to the last known good production build and keep the two wedges local-only until the issue is fixed. Do not widen protected routes, real-data claims, or provider access as part of this release.

## Exact Approval Sentence

If this becomes the next live action, use:

`Approve one CityAtlas production release that promotes the local-ready first-time visitor and wellness source-backed pages plus their guide updates to city.univenturestudio.com, followed by hosted smoke on the four routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
