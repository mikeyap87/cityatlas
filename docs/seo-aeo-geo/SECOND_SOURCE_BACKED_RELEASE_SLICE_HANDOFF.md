# CityAtlas Second Source-Backed Release Slice Handoff

## Purpose

Use this packet when the second source-backed release is being re-cut from live truth after the first queue is already live.

This file answers a narrower question than the second queue packet:

`Which CityAtlas files and surfaces belong to the second queued release slice, and which nearby work should stay out?`

Use `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live gate for this slice before any deploy approval.
Use `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe transplant rules when this slice is re-cut from live truth.

## Release Slice

Primary public routes in scope:

- `/vancouver/out-of-town-guest-starters`
- `/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver`
- `/vancouver/weekend-route-starters`
- `/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day`

Supporting release intent:

- the queue should remain limited to those four routes plus their already-built internal-link and crawl-surface support
- this is still a path-scoped release slice inside `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Source-Of-Truth File Map

### Required Route And Crawl Sources

- `src/data/seed.ts`
  - contains the out-of-town guest guide slug
  - contains the weekend-route guide slug
  - contains internal resource-link paths for the out-of-town guest and weekend-route starter pages
  - this is a shared editorial data file, so use the transplant checklist to keep only the out-of-town guest and weekend-route records in the second release slice

- `src/lib/sourceBackedCollections.ts`
  - contains the out-of-town guest source-backed route path
  - contains the weekend-route source-backed route path
  - maps the out-of-town guest guide to `vancouver_out_of_town_guest_starters`
  - maps the weekend-route guide to `vancouver_weekend_route_starters`
  - contains shared route-collection logic for the public source-backed pages, so later local-ready additions should not be copied over automatically

- `src/features/public/TrustPages.tsx`
  - contains the out-of-town guest source-backed page copy and page export
  - contains the weekend-route source-backed page copy and page export
  - keeps each source-backed page CTA pointed at its matching guide
  - should stay limited to those portions when the second release lane is cut

- `src/app/CityAtlasApp.tsx`
  - contains route handling for `/vancouver/out-of-town-guest-starters`
  - contains route handling for `/vancouver/weekend-route-starters`
  - should stay limited to those portions when the second release lane is cut

- `public/sitemap.xml`
  - should include the two second-queue source-backed pages
  - should include the two second-queue guide routes
  - should not add the starter-pack guide as part of the second release

- `public/llms.txt`
  - should list the out-of-town guest and weekend-route source-backed pages as local-ready-to-live
  - should list the matching out-of-town guest and weekend-route guides
  - should keep the hosted-state wording honest about which wedges are actually public after release
  - should not promote the starter-pack guide to live in the same release

### Mixed Shared Link Surfaces

- `src/features/public/HomePage.tsx`
  - currently bundles out-of-town guest and weekend-route links together with first-time visitor, wellness, and later route-group links
  - do not transplant the whole button block into the second release lane

- `src/features/public/CityPage.tsx`
  - currently bundles out-of-town guest and weekend-route links together with first-time visitor, wellness, and standards links
  - do not transplant the whole button block into the second release lane

- `src/features/public/CollectionPages.tsx`
  - currently bundles out-of-town guest and weekend-route links together with first-time visitor, wellness, starter-pack, and standards links
  - do not transplant the whole button block into the second release lane

- `src/features/public/AboutPage.tsx`
  - currently mixes out-of-town guest and weekend-route links into a broader trust-model block
  - treat link-only carryover here as optional and surgical, not automatic

- `src/components/Layout.tsx`
  - footer navigation currently bundles out-of-town guest and weekend-route links together with first-time visitor, wellness, and starter-pack links
  - do not transplant the whole footer block into the second release lane

### Shared Metadata Infrastructure

- `src/lib/seo.ts`
  - shared route metadata, breadcrumb, CollectionPage, ItemList, and FAQ JSON-LD behavior for the queue routes
  - default release rule: do not pull unrelated route-layer changes unless they are required for the second-queue slice

- `src/components/Seo.tsx`
  - shared tag-upsert layer for route metadata, canonical, robots, and JSON-LD behavior
  - current local proof confirms the second queue routes use this correctly against the configured local base URL
  - default release rule: do not pull unrelated SEO infrastructure changes unless they are required for the second-queue slice

- `src/config/site.ts`
  - shared local/public base URL behavior that affects local canonical proof
  - default release rule: treat this as a shared dependency, not queue-specific content work

## Approval And Proof Docs In Scope

- `docs/seo-aeo-geo/OUT_OF_TOWN_GUEST_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/WEEKEND_ROUTE_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `docs/QA_EVIDENCE.md`

These docs belong to the approval and proof layer for the second queue. They are safe to include in a docs/proof handoff, but they are not the user-facing public payload themselves.

## Default Exclusions

Keep these out of the second queued release unless a later explicit approval changes scope:

- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`
- work-friendly cafe wedge follow-through
- protected-route changes for `/admin`, `/private-preview/*`, `/planner`, or `/for-businesses/submit`
- billing, provider-import, outreach, or auth behavior changes

## Safe Transplant Rule

The current local branch mixes the second queue with later starter-pack work across both route files and link-only surfaces.

Because of that, the future release lane should follow this order:

- keep the required out-of-town guest and weekend-route route/crawl slice
- cherry-pick the mixed shared link surfaces only if the exact second-queue links can be isolated cleanly
- defer link-only shared surfaces rather than widening the release
- verify the exact route outputs after transplant
- avoid broad copy-over of unrelated local-ready wedge changes from the same shared files

Use `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the exact rule set.

## Local Proof Already Backing This Slice

Current local proof already recorded in repo docs includes:

- local `HTTP/1.1 200 OK` for all four second-queue routes
- route-level browser proof for source cards, correction links, guide rail sections, query-fit content, and the page-to-guide / guide-to-page pairings
- route-level browser proof for title, description, robots, canonical, and JSON-LD on all four routes
- honest `sitemap.xml` and `llms.txt` entries for the queued routes
- repo truth mapping the out-of-town guest guide to `vancouver_out_of_town_guest_starters` and the weekend-route guide to `vancouver_weekend_route_starters`
- current machine truth at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links
- all `23` current guides now have at least one direct-path internal link into another CityAtlas page
- a passing `npm run seo:structure:proof` result covering the shared route-structure layer across `33` key routes, including the exact featured city-hub and guide-hub ItemList paths plus the shared missions-hub and pricing-page schema layer
- a passing `npm run seo:docs:proof` result keeping the current queue packet set aligned to the current local machine truth

## Local Metadata Caveat

- The recorded canonical and JSON-LD proof for this slice is local-only.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted canonical and JSON-LD behavior still must be proven after release on `city.univenturestudio.com`.

## Best Use

Use this file together with:

- `docs/seo-aeo-geo/SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`

Short version:

- the queue packet says what should release later
- the go/no-go checklist says what must still be true before live action
- this handoff says which CityAtlas files and surfaces belong to that release slice
- the transplant checklist keeps the second release from drifting into starter-pack or other later local work

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
