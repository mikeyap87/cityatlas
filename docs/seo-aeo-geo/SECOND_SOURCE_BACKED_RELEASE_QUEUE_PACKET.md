# CityAtlas Second Source-Backed Release Queue Packet

## Status

Local-ready only. Nothing in this packet has been deployed, pushed, submitted for indexing, or verified on the hosted public domain in this batch.

Use `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live-release gate before any deploy approval.
Use `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` as the exact local execution runbook once a live release is approved.
This packet is intentionally second in sequence, behind `SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`.
Use `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` as the path-scoped file map for the second queued release slice.
Use `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the copy-safe rule set for re-cutting the second queue from live truth.

## What This Queue Covers

Release these four routes together only after the first-time visitor plus wellness queue is resolved:

- `/vancouver/out-of-town-guest-starters`
- `/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver`
- `/vancouver/weekend-route-starters`
- `/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day`

Supporting local updates already included in this queue:

- the required out-of-town guest and weekend-route route support inside shared files
- internal links from the homepage, city page, guide library, About page, and footer only where those second-queue links can be isolated without also shipping the later starter-pack release work
- honest local crawl/context updates in `sitemap.xml` and `llms.txt`
- owner-readable local approval packets for each wedge

## Why These Two Wedges Go Second

These are the strongest already-built follow-through wedges behind the first-time visitor plus wellness queue because they both:

- answer one narrow Vancouver planning question
- use official public sources instead of review-inferred or scraped facts
- keep visible claim boundaries and the public correction path at `/editorial-standards`
- extend city/entity clarity without pretending CityAtlas is already a complete verified Vancouver directory

This second queue also keeps release order and machine truth clear:

- the first queue is still the higher-priority hosted step
- these two wedges are already locally packaged and should not drift into "someday" status
- the starter-pack guide can follow later as a content-routing release after the higher-priority source-backed queues, now isolated in `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_QUEUE_PACKET.md`
- the Sunday wedge is now isolated too, but it is not part of this second hosted slice and should stay path-isolated in `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- current local useful-piece count is determinable at `37` useful pieces
- current local package now includes `23` answer-first guides
- current local package now includes `14` source-backed wedge collections
- current local machine now includes `70` source-backed anchors
- current local machine now includes `14` mapped guide-to-collection links
- hosted public source-backed wedges still verified live: `3`

## Official Sources Used

Checked June 14, 2026.

### Out-Of-Town Guest

1. Vancouver Art Gallery visit page
2. Granville Island Public Market official page
3. Stanley Park official City of Vancouver page
4. Queen Elizabeth Park official City of Vancouver page
5. Bloedel Conservatory official City of Vancouver page

### Weekend Route

1. Stanley Park official City of Vancouver page
2. Granville Island Public Market official page
3. English Bay Beach official City of Vancouver page
4. VanDusen Botanical Garden official City of Vancouver page
5. Queen Elizabeth Park official City of Vancouver page

## Content Gate Decision

`Ship after separate live deploy approval`

Why both wedges pass the current local gate:

- the audience and query class are clear
- the openings are specific and route-led
- the pages avoid fake "best of" language
- official source, checked date, and correction path are visible
- the guides point to a useful next step instead of generic travel filler

## Claim Boundaries

- No universal "must see" claims
- No fake rankings, review scores, or insider authority
- No live operational guarantees, crowd guarantees, or pricing guarantees
- No broader city-completeness claim beyond these narrow starter layers

## Verified Locally

Route-specific batch checks were completed June 14, 2026. Current queue truth was refreshed June 15, 2026.

- `npm run typecheck` passed for the out-of-town guest batch.
- `npm run build` passed for the out-of-town guest batch.
- `npm run readiness` passed for the out-of-town guest batch and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/out-of-town-guest-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver` returned `HTTP/1.1 200 OK`.
- Local browser verification showed the out-of-town guest page rendering five official-source cards, checked-date framing, correction-path links, and the matching guide section plus the page-to-guide CTA.
- The in-app browser re-verified the out-of-town guest source-backed page and matching guide and confirmed route-specific title, description, robots, canonical, JSON-LD, visible correction-path links, and the page-to-guide / guide-to-page pairing on both routes.
- Narrow-screen review caught shared mobile header clipping on the out-of-town guest page, and the follow-up 390px review confirmed the shared header fix produced a clean readable nav state.
- `npm run typecheck` passed for the weekend-route batch.
- `npm run build` passed for the weekend-route batch.
- `npm run readiness` passed for the weekend-route batch and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/weekend-route-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day` returned `HTTP/1.1 200 OK`.
- Local browser verification showed the weekend-route page rendering five official-source cards, checked-date framing, correction-path links, and the matching guide section plus the page-to-guide CTA.
- The in-app browser re-verified the weekend-route source-backed page and matching guide and confirmed route-specific title, description, robots, canonical, JSON-LD, visible correction-path links, and the page-to-guide / guide-to-page pairing on both routes.
- `npm run seo:proof` now passes for the current local content machine at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, `14` mapped guide-to-collection links, and zero failures.
- all `23` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` now passes for the current local structure layer across `33` key routes, including `/vancouver`, `/vancouver/guides`, `/vancouver/missions`, `/for-businesses/pricing`, every currently queued source-backed guide/page pair, the starter-pack, low-friction, and guide-roundup routing guides, and the protected noindex routes.
- the current structure proof also verifies the exact featured `featured-surfaces` ItemList on `/vancouver` and the exact featured `featured-guides` ItemList on `/vancouver/guides`.
- `npm run seo:docs:proof` now passes and keeps the second queued release packet set aligned to the current local machine truth.
- `npm run seo:smoke:second` now passes on the local preview base and verifies the four second-queue routes plus `/for-businesses/submit`, route-level title/robots/canonical/JSON-LD behavior, pairing fragments, `sitemap.xml`, and `llms.txt`.
- Local `sitemap.xml` includes all four routes in this second queue.
- Local `llms.txt` describes both source-backed wedges and both matching guides as local-ready while keeping the live-domain wording honest about only three hosted source-backed wedges.
- Repo truth confirms the out-of-town guest guide maps to `vancouver_out_of_town_guest_starters` and the weekend-route guide maps to `vancouver_weekend_route_starters` in `src/lib/sourceBackedCollections.ts`, while `src/features/public/TrustPages.tsx` keeps each source-backed page pointed at its matching guide.
- local route truth for these four second-queue routes is now refreshed against the active dev surface on `127.0.0.1:5178`.
- the local `/admin` and `/private-preview/date-night` routes still stay in founder-only mode on the preview base, so the hosted guard-notice assertions remain intentionally reserved for the real hosted-domain smoke pass.

## Metadata And Canonical Caveat

- The out-of-town guest and weekend-route packets now both have recorded local browser proof for route-specific title, description, robots, canonical, and JSON-LD.
- The shared CityAtlas route layer now also has a passing reusable structure-proof command that verifies hub breadcrumbs, exact featured city-hub and guide-hub ItemList paths, CollectionPage coverage, source-backed ItemList coverage, and FAQ schema on representative key routes before any release packet is treated as current.
- That local canonical/JSON-LD proof reflects the configured local base URL behavior in `src/lib/seo.ts`, `src/components/Seo.tsx`, and `src/config/site.ts`, which falls back to `http://127.0.0.1:5178/` during local runtime unless `VITE_CITYATLAS_PUBLIC_BASE_URL` is set.
- Hosted canonical and JSON-LD behavior on `city.univenturestudio.com` is still unverified for this second queue.

## Still Unverified

- hosted rendering on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-to-collection link pairings across the four routes after release
- hosted canonical and JSON-LD behavior on the live domain
- post-release crawl behavior
- indexing movement
- ranking movement

## Hosted Smoke Plan After Approval

If a live deploy is approved after the first queue is resolved, verify in this order:

1. run `npm run seo:smoke:second -- --base-url=https://city.univenturestudio.com`
2. review the automated smoke output and confirm hosted `sitemap.xml`, hosted `llms.txt`, route-level metadata behavior, and the protected-route expectations all passed
3. render the two source-backed pages and two guides in a browser and confirm source cards, correction links, guide rail sections, and matching guide-to-collection links
4. confirm `/admin` and `/private-preview/date-night` still behave as protected hosted routes and `/for-businesses/submit` still stays noindex if anything looks off in the automated smoke output

## Rollback Boundary

If the deploy is approved but any hosted smoke fails, roll back to the last known good production build and keep these two wedges local-only until the issue is fixed. Do not widen protected routes, real-data claims, or provider access as part of this release.

## Exact Approval Sentence

If this becomes the next live action after the first queue, use:

`Approve one CityAtlas production release that promotes the local-ready out-of-town guest and weekend-route source-backed pages plus their guide updates to city.univenturestudio.com, followed by hosted smoke on the four routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
