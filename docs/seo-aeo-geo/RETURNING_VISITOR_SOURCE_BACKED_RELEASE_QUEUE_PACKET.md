# CityAtlas Returning-Visitor Source-Backed Release Queue Packet

## Status

Local-ready only. Nothing in this packet has been deployed, pushed, submitted for indexing, or verified on the hosted public domain in this batch.

Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live-release gate before any deploy approval.
Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` as the exact local execution runbook once a live release is approved.
This packet is intentionally fourth in sequence, behind `SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, `SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`, and `SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`.
Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` as the path-scoped file map for the returning-visitor queued release slice.
Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the copy-safe rule set for re-cutting the returning-visitor queue from live truth.

## What This Queue Covers

Release these two routes together only after the first-time visitor plus wellness queue, the out-of-town guest plus weekend-route queue, and the Sunday queue are resolved:

- `/vancouver/returning-visitor-starters`
- `/vancouver/guides/vancouver-local-discovery-for-returning-visitors`

Supporting local updates already included in this queue:

- the required returning-visitor route support inside shared files
- internal links from the homepage, city page, guide library, About page, and footer only where those returning-visitor links can be isolated cleanly
- returning-visitor routing support inside the shared starter-pack guide data, which should be treated as optional carryover rather than required queue scope
- honest local crawl/context updates in `sitemap.xml` and `llms.txt`
- the owner-readable local approval packet for the returning-visitor wedge

## Why This Wedge Goes Fourth

This is the next distinct source-backed wedge behind the first three hosted queues because it:

- answers one narrow Vancouver returning-visitor local-discovery question
- uses official public sources instead of scraped or review-inferred facts
- stays distinct from the first-time visitor, weekend-route, and Sunday wedges
- keeps visible claim boundaries and the public correction path at `/editorial-standards`

This fourth queue also keeps release order and machine truth clear:

- the first queue is still the highest-priority hosted step
- the second queue already packages the out-of-town guest plus weekend-route pair
- the Sunday wedge is already isolated as the third source-backed candidate
- the returning-visitor wedge is now documented as the next queue instead of floating as undocumented future work
- the Kitsilano scenic wedge is now isolated separately as the fifth source-backed candidate
- the starter-pack guide can remain a later routing release after the nine source-backed queues
- current local useful-piece count is determinable at `37` useful pieces
- current local package now includes `23` answer-first guides
- current local package now includes `14` source-backed wedge collections
- current local machine now includes `70` source-backed anchors
- current local machine now includes `14` mapped guide-to-collection links
- hosted public source-backed wedges still verified live: `3`

## Official Sources Used

Checked June 14, 2026.

1. Commercial Drive official site
2. Chinatown Storytelling Centre official site
3. Trout Lake Beach official City of Vancouver page
4. Museum of Anthropology at UBC visit page
5. Nitobe Memorial Garden official page

## Content Gate Decision

`Ship after separate live deploy approval`

Why the returning-visitor wedge passes the current local gate:

- the audience and query class are clear
- the opening is specific and route-led
- the page avoids fake hidden-gem or local-insider language
- official source, checked date, and correction path are visible
- the guide points to a useful next step instead of generic travel filler

## Claim Boundaries

- No universal "best second trip to Vancouver" claim
- No fake rankings, review scores, or insider authority
- No live operational guarantees, crowd guarantees, or pricing guarantees
- No broader city-completeness claim beyond this narrow returning-visitor starter layer

## Verified Locally

Route-specific batch checks were completed June 14, 2026. Current queue truth was refreshed June 15, 2026.

- `npm run typecheck` passed for the returning-visitor batch.
- `npm run build` passed for the returning-visitor batch, with only the existing non-blocking Vite large-chunk warning.
- `npm run readiness` passed for the returning-visitor batch and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/returning-visitor-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/vancouver-local-discovery-for-returning-visitors` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both returning-visitor routes.
- Local `llms.txt` describes the returning-visitor source-backed page and matching guide as local-ready while keeping the live-domain wording honest about only three hosted source-backed wedges.
- `npm run seo:proof` now passes for the current local content machine at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, `14` mapped guide-to-collection links, and zero failures.
- `npm run seo:structure:proof` now passes for the current shared route-structure layer across `33` key routes and includes the returning-visitor source-backed page plus matching guide in the checked route set.
- `npm run seo:docs:proof` now passes and keeps the returning-visitor queued release packet set aligned to the current local machine truth.
- `npm run seo:smoke:returning` now passes on the local preview base and verifies the two returning-visitor routes plus `/for-businesses/submit`, route-level title/robots/canonical/JSON-LD behavior, pairing fragments, `sitemap.xml`, and `llms.txt`.
- The same server-render proof confirmed the returning-visitor guide CTA path, starter-pack cross-link, all five official-source returning-visitor anchors, and the returning-visitor collection metadata path `/vancouver/returning-visitor-starters` plus title `Vancouver Returning-Visitor Starters With Official Source Notes | CityAtlas`.
- The in-app browser re-verified local `/vancouver/returning-visitor-starters` and `/vancouver/guides/vancouver-local-discovery-for-returning-visitors` on June 15, 2026 and confirmed route-specific title, description, robots, canonical, JSON-LD, correction-path links, and the returning-visitor page-to-guide / guide-to-page pairing on both routes.
- Local desktop screenshot proof showed the returning-visitor source-backed page rendering a clean hero, trust panel, source-backed cards, and correction-path actions.
- Repo truth confirms the returning-visitor guide maps to `vancouver_returning_visitor_starters` in `src/lib/sourceBackedCollections.ts`, `src/features/public/TrustPages.tsx` keeps the returning-visitor source-backed page CTA pointed at the matching guide, and `src/features/public/GuideDetailPage.tsx` contains the returning-visitor source-backed guide section.
- local route truth for these two returning-visitor routes is now refreshed against the active dev surface on `127.0.0.1:5178`.
- the local `/admin` and `/private-preview/date-night` routes still stay in founder-only mode on the preview base, so the hosted guard-notice assertions remain intentionally reserved for the real hosted-domain smoke pass.

## Metadata And Canonical Caveat

- The returning-visitor queue now has local browser-head proof for rendered title, description, robots, canonical, and JSON-LD behavior on both routes in the active dev surface.
- That proof still reflects the configured local base URL behavior in `src/lib/seo.ts`, `src/components/Seo.tsx`, and `src/config/site.ts`, which falls back to `http://127.0.0.1:5178/` during local runtime unless `VITE_CITYATLAS_PUBLIC_BASE_URL` is set.
- the local preview smoke rehearsal intentionally leaves hosted `/admin` and `/private-preview/date-night` guard-notice assertions for the real hosted-domain smoke run
- hosted canonical, title, description, and JSON-LD behavior on `city.univenturestudio.com` remain unverified for this queue.

## Mobile Visual Caveat

- A narrow mobile screenshot pass initially showed lower-page section-header crowding and wider overflow on the returning-visitor source-backed page.
- Follow-up fixes landed in `src/styles/components.css`, `src/styles/responsive.css`, and the returning-visitor section title copy in `src/features/public/TrustPages.tsx`.
- A final 390px headless Chrome screenshot pass on June 14, 2026 showed a clean readable mobile state for the returning-visitor page, so this queue no longer carries an unresolved local narrow-screen proof gap.

## Still Unverified

- hosted rendering on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-to-collection link pairing between the returning-visitor page and matching guide after release
- hosted canonical, title, description, and JSON-LD behavior on the live domain
- post-release crawl behavior
- indexing movement
- ranking movement

## Hosted Smoke Plan After Approval

If a live deploy is approved after the first three queues are resolved and before the fifth Kitsilano queue, verify in this order:

1. run `npm run seo:smoke:returning -- --base-url=https://city.univenturestudio.com`
2. review the automated smoke output and confirm hosted `sitemap.xml`, hosted `llms.txt`, route-level metadata behavior, and the protected-route expectations all passed
3. render the returning-visitor source-backed page and guide in a browser on desktop and narrow mobile, then confirm source cards, correction links, the guide returning-visitor section, and the returning-visitor page-to-guide / guide-to-page pairing
4. confirm `/admin` and `/private-preview/date-night` still behave as protected hosted routes and `/for-businesses/submit` still stays noindex if anything looks off in the automated smoke output

## Rollback Boundary

If the deploy is approved but any hosted smoke fails, roll back to the last known good production build and keep the returning-visitor wedge local-only until the issue is fixed. Do not widen protected routes, real-data claims, or provider access as part of this release.

## Exact Approval Sentence

If this becomes the next live action after the first three queues and before the fifth Kitsilano queue, use:

`Approve one CityAtlas production release that promotes the local-ready returning-visitor source-backed page and matching guide to city.univenturestudio.com, followed by hosted smoke on the two routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
