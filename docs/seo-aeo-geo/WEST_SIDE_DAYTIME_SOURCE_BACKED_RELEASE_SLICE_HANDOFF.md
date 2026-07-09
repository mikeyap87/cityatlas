# CityAtlas West-Side Daytime Source-Backed Release Slice Handoff

## Purpose

Use this packet when the west-side daytime source-backed release is being re-cut from live truth after the first five queued source-backed releases are already resolved.

This file answers a narrower question than the west-side daytime queue packet:

`Which CityAtlas files and surfaces belong to the west-side daytime queued release slice, and which nearby work should stay out?`

Use `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live gate for this slice before any deploy approval.
Use `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe transplant rules when this slice is re-cut from live truth.

## Release Slice

Primary public routes in scope:

- `/vancouver/west-side-daytime-starters`
- `/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan`

Supporting release intent:

- the queue should remain limited to those two routes plus their already-built internal-link and crawl-surface support
- this is still a path-scoped release slice inside `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Source-Of-Truth File Map

### Required Route And Crawl Sources

- `src/data/seed.ts`
  - contains the west-side daytime guide slug
  - contains the guide resource-link path for `/vancouver/west-side-daytime-starters`
  - contains the `vancouver_west_side_daytime_starters` source-backed entries
  - this is a shared editorial data file, so use the transplant checklist to keep only the west-side daytime guide support and west-side daytime source-backed records in the release slice

- `src/lib/sourceBackedCollections.ts`
  - contains the west-side daytime source-backed route path
  - contains the west-side daytime collection metadata
  - contains shared route-collection logic for all public source-backed pages, so earlier and later wedge additions should not be copied over automatically

- `src/features/public/TrustPages.tsx`
  - contains the west-side daytime source-backed page copy and page export
  - should stay limited to the west-side daytime config block and page export when the release lane is cut

- `src/features/public/GuideDetailPage.tsx`
  - contains the west-side daytime source-backed section copy for the matching guide
  - should stay limited to the west-side daytime section addition when the release lane is cut

- `src/app/CityAtlasApp.tsx`
  - contains route handling for `/vancouver/west-side-daytime-starters`
  - should stay limited to that west-side daytime route branch when the release lane is cut

- `public/sitemap.xml`
  - should include the west-side daytime source-backed page
  - should include the west-side daytime guide route
  - should not widen to later routing releases in the same slice

- `public/llms.txt`
  - should list the west-side daytime source-backed page as local-ready-to-live
  - should list the matching west-side daytime guide
  - should keep the hosted-state wording honest about which wedges are actually public after release

### Mixed Shared Link Surfaces

- `src/features/public/HomePage.tsx`
  - currently bundles the west-side daytime link together with earlier source-backed wedges
  - do not transplant the whole button block into the west-side daytime release lane

- `src/features/public/CityPage.tsx`
  - currently bundles the west-side daytime link together with earlier source-backed wedges and later routing links
  - do not transplant the whole button block into the west-side daytime release lane

- `src/features/public/CollectionPages.tsx`
  - currently bundles the west-side daytime link together with broader route-group links and later routing work
  - do not transplant the whole button block into the west-side daytime release lane

- `src/features/public/AboutPage.tsx`
  - the broader trust block may already mention neighborhood or source-backed intent
  - treat link-only carryover here as optional and surgical, not automatic

- `src/components/Layout.tsx`
  - footer navigation may bundle daytime and other wedge links together
  - do not transplant the whole footer block into the west-side daytime release lane

### Shared Metadata Infrastructure

- `src/components/Seo.tsx`
  - shared route metadata, canonical, and JSON-LD behavior for the west-side daytime queue routes
  - current local proof confirms route reachability, but hosted route metadata still needs post-deploy smoke
  - default release rule: do not pull unrelated SEO infrastructure changes unless they are required for the west-side daytime slice

- `src/lib/seo.ts`
  - shared route-meta and JSON-LD assembly for the west-side daytime queue routes
  - treat it as shared infrastructure rather than route content

- `src/config/site.ts`
  - shared local/public base URL behavior that affects local proof
  - treat it as shared infrastructure rather than west-side daytime content work

## Approval And Proof Docs In Scope

- `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `docs/QA_EVIDENCE.md`

These docs belong to the approval and proof layer for the west-side daytime queue. They are safe to include in a docs/proof handoff, but they are not the user-facing public payload themselves.

## Default Exclusions

Keep these out of the west-side daytime queued release unless a later explicit approval changes scope:

- `/vancouver/first-time-visitor-starters`
- `/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`
- `/vancouver/kitsilano-scenic-starters`
- `/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings`
- `/vancouver/returning-visitor-starters`
- `/vancouver/guides/vancouver-local-discovery-for-returning-visitors`
- `/vancouver/out-of-town-guest-starters`
- `/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver`
- `/vancouver/weekend-route-starters`
- `/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day`
- `/vancouver/sunday-starters`
- `/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan`
- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`
- `/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today`
- protected-route changes for `/admin`, `/private-preview/*`, `/planner`, or `/for-businesses/submit`
- billing, provider-import, outreach, or auth behavior changes

## Safe Transplant Rule

The current local branch mixes the west-side daytime queue with earlier wedges and later routing work across both route files and link-only surfaces.

Because of that, the future release lane should follow this order:

- keep the required west-side daytime route and crawl slice
- cherry-pick the mixed shared link surfaces only if the exact west-side daytime links can be isolated cleanly
- defer link-only shared surfaces rather than widening the release
- verify the exact route outputs after transplant
- avoid broad copy-over of unrelated local-ready wedge changes from the same shared files

Use `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the exact rule set.

## Local Proof Already Backing This Slice

Current local proof already recorded in repo docs includes:

- local `HTTP/1.1 200 OK` for both west-side daytime queue routes
- honest `sitemap.xml` and `llms.txt` entries for the queued routes
- homepage, city page, and guide-library source-backed link exposure for the new route
- `npm run seo:smoke:westside` passing on the local preview base for the two west-side daytime routes, pairing fragments, `sitemap.xml`, `llms.txt`, and the noindex surface
- local browser-head proof for rendered title, description, robots, canonical, JSON-LD, correction-path links, and the west-side daytime page-to-guide / guide-to-page pairing on both routes
- current machine truth at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links
- current shared route-structure truth across `33` key routes

## Best Use

Use this file together with:

- `docs/seo-aeo-geo/WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`

Short version:

- the queue packet says what should release later
- this handoff says which CityAtlas files and surfaces belong to that release slice
- the transplant checklist keeps the west-side daytime release from drifting into earlier queues or the later routing releases

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
