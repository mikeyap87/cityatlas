# CityAtlas First Source-Backed Release Slice Handoff

## Purpose

Use this packet when the first source-backed release is being re-cut from live truth.

This file answers a narrower question than the go/no-go checklist:

`Which CityAtlas files and surfaces belong to the first queued release slice, and which nearby work should stay out?`

Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe transplant rules when this slice is re-cut from live truth.

## Release Slice

Primary public routes in scope:

- `/vancouver/first-time-visitor-starters`
- `/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`
- `/vancouver/wellness-reset-starters`
- `/vancouver/guides/vancouver-wellness-experiences-to-review`

Supporting release intent:

- the queue should remain limited to those four routes plus their already-built internal-link and crawl-surface support
- this is still a path-scoped release slice inside `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Source-Of-Truth File Map

### Required Route And Crawl Sources

- `src/data/seed.ts`
  - contains the first-time visitor guide slug
  - contains the wellness guide slug
  - contains internal resource-link paths for the first-time visitor and wellness starter pages
  - this is a shared editorial data file, so use the transplant checklist to keep only the first-time visitor and wellness records in the first release slice

- `src/lib/sourceBackedCollections.ts`
  - contains the first-time visitor source-backed route path
  - contains the wellness source-backed route path
  - contains shared route-collection logic for the public source-backed pages, so later local-ready route additions should not be copied over automatically

- `src/features/public/TrustPages.tsx`
  - contains the first-time visitor source-backed page copy and page export
  - contains the wellness source-backed page copy and page export
  - also contains later local-ready wedge blocks, so the first release lane should keep only the first-time visitor and wellness portions

- `src/app/CityAtlasApp.tsx`
  - contains route handling for `/vancouver/first-time-visitor-starters`
  - contains route handling for `/vancouver/wellness-reset-starters`
  - also contains later local-ready source-backed route branches that should stay out of the first release slice

- `public/sitemap.xml`
  - should include the two first-queue source-backed pages
  - should include the two first-queue guide routes
  - should not add the later queued routes as part of the first release

- `public/llms.txt`
  - should list the first-time visitor and wellness source-backed pages as local-ready-to-live
  - should list the matching first-time visitor and wellness guides
  - should keep the hosted-state wording honest about which source-backed wedges are actually public after release

### Mixed Shared Link Surfaces

- `src/features/public/HomePage.tsx`
  - currently bundles first-time visitor and wellness links together with first-evening, out-of-town guest, weekend-route, and standards links
  - do not transplant the whole button block into the first release lane

- `src/features/public/CityPage.tsx`
  - currently bundles first-time visitor and wellness links together with first-evening, out-of-town guest, weekend-route, and standards links
  - do not transplant the whole button block into the first release lane

- `src/features/public/CollectionPages.tsx`
  - currently bundles first-time visitor and wellness links together with rainy-day, first-evening, out-of-town guest, weekend-route, starter-pack, and standards links
  - do not transplant the whole button block into the first release lane

- `src/features/public/AboutPage.tsx`
  - currently mixes visitor-start and broader route-discovery surfaces, including later wedges in the trust model area
  - treat link-only carryover here as optional and surgical, not automatic

- `src/components/Layout.tsx`
  - footer navigation currently bundles first-time visitor and wellness links together with out-of-town guest and weekend-route links
  - do not transplant the whole footer block into the first release lane

### Shared Metadata Infrastructure

- `src/lib/seo.ts`
  - shared route metadata, breadcrumb, CollectionPage, ItemList, and FAQ JSON-LD behavior for the queue routes
  - default release rule: do not pull unrelated route-layer changes unless they are required for the first-queue slice

- `src/components/Seo.tsx`
  - shared tag-upsert layer for route metadata, canonical, robots, and JSON-LD behavior for the queue routes
  - current local proof confirms the first queue routes use this correctly against the configured local base URL
  - default release rule: do not pull unrelated SEO infrastructure changes unless they are required for the first-queue slice

- `src/config/site.ts`
  - shared local/public base URL behavior that affects local canonical proof
  - default release rule: treat this as a shared dependency, not queue-specific content work

## Approval And Proof Docs In Scope

- `docs/seo-aeo-geo/FIRST_TIME_VISITOR_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/WELLNESS_RESET_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md`
- `docs/QA_EVIDENCE.md`

These docs belong to the approval and proof layer for the first queue. They are safe to include in a docs/proof handoff, but they are not the user-facing public payload themselves.

## Default Exclusions

Keep these out of the first queued release unless a later explicit approval changes scope:

- `/vancouver/out-of-town-guest-starters`
- `/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver`
- `/vancouver/weekend-route-starters`
- `/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day`
- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`
- work-friendly cafe wedge follow-through
- protected-route changes for `/admin`, `/private-preview/*`, `/planner`, or `/for-businesses/submit`
- billing, provider-import, outreach, or auth behavior changes

## Safe Transplant Rule

The current local branch mixes the first queue with later local-ready wedges across both route files and link-only surfaces.

Because of that, the future release lane should follow this order:

- keep the required first-time visitor and wellness route/crawl slice
- cherry-pick the mixed shared link surfaces only if the exact first-queue links can be isolated cleanly
- defer link-only shared surfaces rather than widening the release
- verify the exact route outputs after transplant
- avoid broad copy-over of unrelated local-ready wedge changes from the same shared files

Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the exact rule set.

## Local Proof Already Backing This Slice

Current local proof already recorded in repo docs includes:

- local `HTTP/1.1 200 OK` for all four first-queue routes
- route-level browser proof for source cards, correction links, guide rail sections, query-fit content, and the page-to-guide / guide-to-page pairings
- route-level browser proof for title, description, robots, canonical, and JSON-LD on all four routes
- honest `sitemap.xml` and `llms.txt` entries for the queued routes
- a passing `npm run seo:proof` result for the current local content machine
- a passing `npm run seo:structure:proof` result for the current local route-structure layer across `28` key routes
- a passing `npm run seo:docs:proof` result keeping the first queued packet set aligned to the current local machine truth
- current machine truth at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links

## Local Metadata Caveat

- The recorded canonical and JSON-LD proof for this slice is local-only.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted canonical and JSON-LD behavior still must be proven after release on `city.univenturestudio.com`.

## Best Use

Use this file together with:

- `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `docs/seo-aeo-geo/SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`

Short version:

- the queue packet says what should release
- the go/no-go checklist says what must be true before release
- this handoff says which CityAtlas files and surfaces belong to the release slice

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
