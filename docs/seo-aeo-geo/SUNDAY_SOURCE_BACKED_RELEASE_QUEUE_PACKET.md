# CityAtlas Sunday Source-Backed Release Queue Packet

## Status

Local-ready only. Nothing in this packet has been deployed, pushed, submitted for indexing, or verified on the hosted public domain in this batch.

Use `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live-release gate before any deploy approval.
Use `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` as the exact local execution runbook once a live release is approved.
This packet is intentionally third in sequence, behind `SOURCE_BACKED_RELEASE_QUEUE_PACKET.md` and `SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`.
Use `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` as the path-scoped file map for the Sunday queued release slice.
Use `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the copy-safe rule set for re-cutting the Sunday queue from live truth.

## What This Queue Covers

Release these two routes together only after the first-time visitor plus wellness queue and the out-of-town guest plus weekend-route queue are resolved:

- `/vancouver/sunday-starters`
- `/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan`

Supporting local updates already included in this queue:

- the required Sunday route support inside shared files
- internal links from the homepage, city page, guide library, About page, and footer only where those Sunday links can be isolated without also shipping later routing work
- honest local crawl/context updates in `sitemap.xml` and `llms.txt`
- the owner-readable local approval packet for the Sunday wedge

## Why This Wedge Goes Third

This is the next distinct source-backed wedge behind the first two hosted queues because it:

- answers one narrow Vancouver Sunday-planning question
- uses official public sources instead of scraped or review-inferred facts
- stays distinct from the broader weekend-route wedge
- keeps visible claim boundaries and the public correction path at `/editorial-standards`

This third queue also keeps release order and machine truth clear:

- the first queue is still the highest-priority hosted step
- the second queue already packages the out-of-town guest plus weekend-route pair
- the Sunday wedge is now isolated as the next source-backed candidate instead of floating as undocumented future work
- the starter-pack guide can remain a later routing release after the higher-priority source-backed queues
- current local useful-piece count is determinable at `37` useful pieces
- current local package now includes `23` answer-first guides
- current local package now includes `14` source-backed wedge collections
- current local machine now includes `70` source-backed anchors
- current local machine now includes `14` mapped guide-to-collection links
- hosted public source-backed wedges still verified live: `3`

## Official Sources Used

Checked June 14, 2026.

1. Bill Reid Gallery hours and admissions page
2. Museum of Vancouver official site
3. Vancouver Public Library Central Library branch page
4. VanDusen Botanical Garden official City of Vancouver page
5. Bloedel Conservatory official City of Vancouver page

## Content Gate Decision

`Ship after separate live deploy approval`

Why the Sunday wedge passes the current local gate:

- the audience and query class are clear
- the opening is specific and route-led
- the page avoids fake "best of" language
- official source, checked date, and correction path are visible
- the guide points to a useful next step instead of generic travel filler

## Claim Boundaries

- No universal "best Vancouver Sunday" claim
- No fake rankings, review scores, or insider authority
- No live operational guarantees, crowd guarantees, or pricing guarantees
- No broader city-completeness claim beyond this narrow Sunday starter layer

## Verified Locally

Route-specific batch checks were completed June 14, 2026. Current queue truth and the reusable Sunday smoke artifact were refreshed June 16, 2026.

- `npm run typecheck` passed for the Sunday batch.
- `npm run build` passed for the Sunday batch, with only the existing non-blocking Vite large-chunk warning.
- `npm run readiness` passed for the Sunday batch and kept `CityAtlas readiness average: 90%`.
- `curl -I http://127.0.0.1:5178/vancouver/sunday-starters` returned `HTTP/1.1 200 OK`.
- `curl -I http://127.0.0.1:5178/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan` returned `HTTP/1.1 200 OK`.
- Local `sitemap.xml` includes both Sunday routes.
- Local `llms.txt` describes the Sunday source-backed page and matching guide as local-ready while keeping the live-domain wording honest about only three hosted source-backed wedges.
- `npm run seo:proof` now passes for the current local content machine at `39` useful pieces, `24` guides, `15` source-backed wedge collections, `75` source-backed anchors, `15` mapped guide-to-collection links, and zero failures.
- `npm run seo:structure:proof` now passes for the current shared route-structure layer across `35` key routes and includes the Sunday source-backed page plus matching guide in the checked route set.
- `npm run seo:docs:proof` now passes and keeps the Sunday queued release packet set aligned to the current local machine truth.
- `npm run seo:smoke:sunday` now passes on the local preview base in `route-model-only` fallback mode and verifies the Sunday route model, local `sitemap.xml`, and local `llms.txt` while recording the current headless-browser launch failure as a warning in `output/seo/hosted-smoke-sunday-source-backed.json`.
- The same server-side render proof confirmed the Sunday source-backed page contains Bill Reid Gallery, Museum of Vancouver, and a visible correction-path link, while the matching guide renders the Sunday source-backed section and Sunday rail link.
- The same local proof also confirmed the Sunday collection metadata path `/vancouver/sunday-starters` and title `Vancouver Sunday Starters With Official Source Notes | CityAtlas`.
- Repo truth confirms the Sunday guide maps to `vancouver_sunday_starters` in `src/lib/sourceBackedCollections.ts`, `src/features/public/TrustPages.tsx` keeps the Sunday source-backed page CTA pointed at the matching guide, and `src/features/public/GuideDetailPage.tsx` contains the Sunday source-backed guide section.
- Historical browser-head proof from June 15, 2026 still exists for local `/vancouver/sunday-starters` and `/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan`, but it has not been re-run in a browser-capable environment during the June 16 refresh.
- `rg -n '/vancouver/sunday-starters|how-to-build-a-low-effort-vancouver-sunday-plan'` confirmed Sunday entry points in `HomePage.tsx`, `CityPage.tsx`, `CollectionPages.tsx`, `AboutPage.tsx`, `Layout.tsx`, `sitemap.xml`, and `llms.txt`.
- local route truth for these two Sunday routes is now refreshed against the active dev surface on `127.0.0.1:5178`.
- the local `/admin` and `/private-preview/date-night` routes still stay in founder-only mode on the preview base, so the hosted guard-notice assertions remain intentionally reserved for the real hosted-domain smoke pass.

## Metadata And Canonical Caveat

- The Sunday queue now has fresh local route-model smoke proof for expected title, robots, canonical, JSON-LD type generation, and crawl-file coverage, plus local metadata mapping through `sourceBackedCollectionMeta`.
- The shared CityAtlas route layer now also has a passing reusable structure-proof command that verifies hub breadcrumbs, CollectionPage coverage, source-backed ItemList coverage, and FAQ schema on representative key routes before any release packet is treated as current.
- That proof is stronger than route-exists-only checks, but it is still not the same as a fresh browser-rendered proof of visible route content, title, description, canonical, or JSON-LD on either the local preview or `city.univenturestudio.com`.
- The current local truth for this queue is still anchored to the active dev surface on `127.0.0.1:5178`, not hosted behavior.
- the local preview smoke rehearsal intentionally leaves hosted `/admin` and `/private-preview/date-night` guard-notice assertions for the real hosted-domain smoke run
- the current local smoke artifact also records the browser-launch failure explicitly, so browser-rendered Sunday proof should be treated as historical rather than freshly revalidated in this pass
- hosted canonical, title, description, and JSON-LD behavior for the Sunday queue remain unverified until a real deploy-and-smoke pass happens.

## Still Unverified

- fresh browser-rendered Sunday route proof in a browser-capable local environment
- hosted rendering on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-to-collection link pairing between the Sunday page and matching guide after release
- hosted canonical, title, description, and JSON-LD behavior on the live domain
- post-release crawl behavior
- indexing movement
- ranking movement

## Hosted Smoke Plan After Approval

If a live deploy is approved after the first and second queues are resolved, verify in this order:

1. run `npm run seo:smoke:sunday -- --base-url=https://city.univenturestudio.com`
2. review the automated smoke output and confirm hosted `sitemap.xml`, hosted `llms.txt`, route-level metadata behavior, and the protected-route expectations all passed
3. render the Sunday source-backed page and guide in a browser and confirm source cards, correction links, the guide Sunday section, and the Sunday guide-to-collection pairing
4. confirm `/admin` and `/private-preview/date-night` still behave as protected hosted routes and `/for-businesses/submit` still stays noindex if anything looks off in the automated smoke output

## Rollback Boundary

If the deploy is approved but any hosted smoke fails, roll back to the last known good production build and keep the Sunday wedge local-only until the issue is fixed. Do not widen protected routes, real-data claims, or provider access as part of this release.

## Exact Approval Sentence

If this becomes the next live action after the first two queues, use:

`Approve one CityAtlas production release that promotes the local-ready Sunday source-backed page and matching guide to city.univenturestudio.com, followed by hosted smoke on the two routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
