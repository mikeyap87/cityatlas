# CityAtlas Kitsilano Scenic Source-Backed Release Slice Handoff

## Purpose

Use this packet when the Kitsilano scenic source-backed release is being re-cut from live truth after the first four queued source-backed releases are already resolved.

This file answers a narrower question than the Kitsilano scenic queue packet:

`Which CityAtlas files and surfaces belong to the Kitsilano scenic queued release slice, and which nearby work should stay out?`

Use `docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live gate for this slice before any deploy approval.
Use `docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe transplant rules when this slice is re-cut from live truth.

## Release Slice

Primary public routes in scope:

- `/vancouver/kitsilano-scenic-starters`
- `/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings`

Supporting release intent:

- the queue should remain limited to those two routes plus their already-built internal-link and crawl-surface support
- this is still a path-scoped release slice inside `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Source-Of-Truth File Map

### Required Route And Crawl Sources

- `src/data/seed.ts`
  - contains the Kitsilano neighborhood guide slug
  - contains the guide resource-link path for `/vancouver/kitsilano-scenic-starters`
  - contains the `vancouver_kitsilano_scenic_starters` source-backed entries
  - this is a shared editorial data file, so use the transplant checklist to keep only the Kitsilano scenic guide support and Kitsilano scenic source-backed records in the release slice

- `src/lib/sourceBackedCollections.ts`
  - contains the Kitsilano scenic source-backed route path
  - contains the Kitsilano scenic collection metadata
  - contains shared route-collection logic for all public source-backed pages, so earlier and later wedge additions should not be copied over automatically

- `src/features/public/TrustPages.tsx`
  - contains the Kitsilano scenic source-backed page copy and page export
  - should stay limited to the Kitsilano scenic config block and page export when the release lane is cut

- `src/features/public/GuideDetailPage.tsx`
  - contains the Kitsilano scenic source-backed section copy for the matching guide
  - should stay limited to the Kitsilano scenic section addition when the release lane is cut

- `src/app/CityAtlasApp.tsx`
  - contains route handling for `/vancouver/kitsilano-scenic-starters`
  - should stay limited to that Kitsilano scenic route branch when the release lane is cut

- `public/sitemap.xml`
  - should include the Kitsilano scenic source-backed page
  - should include the Kitsilano scenic guide route
  - should not widen to later routing releases in the same slice

- `public/llms.txt`
  - should list the Kitsilano scenic source-backed page as local-ready-to-live
  - should list the matching Kitsilano scenic guide
  - should keep the hosted-state wording honest about which wedges are actually public after release

### Mixed Shared Link Surfaces

- `src/features/public/HomePage.tsx`
  - currently bundles the Kitsilano scenic link together with earlier source-backed wedges
  - do not transplant the whole button block into the Kitsilano scenic release lane

- `src/features/public/CityPage.tsx`
  - currently bundles the Kitsilano scenic link together with earlier source-backed wedges and later routing links
  - do not transplant the whole button block into the Kitsilano scenic release lane

- `src/features/public/CollectionPages.tsx`
  - currently bundles the Kitsilano scenic link together with broader route-group links and later routing work
  - do not transplant the whole button block into the Kitsilano scenic release lane

- `src/features/public/AboutPage.tsx`
  - the broader trust block may already mention neighborhood/source-backed intent
  - treat link-only carryover here as optional and surgical, not automatic

- `src/components/Layout.tsx`
  - footer navigation may bundle scenic and other wedge links together
  - do not transplant the whole footer block into the Kitsilano scenic release lane

### Shared Metadata Infrastructure

- `src/components/Seo.tsx`
  - shared route metadata, canonical, and JSON-LD behavior for the Kitsilano scenic queue routes
  - current local proof confirms route reachability, but hosted route metadata still needs post-deploy smoke
  - default release rule: do not pull unrelated SEO infrastructure changes unless they are required for the Kitsilano scenic slice

- `src/lib/seo.ts`
  - shared route-meta and JSON-LD assembly for the Kitsilano scenic queue routes
  - treat it as shared infrastructure rather than route content

- `src/config/site.ts`
  - shared local/public base URL behavior that affects local proof
  - treat it as shared infrastructure rather than Kitsilano scenic content work

## Approval And Proof Docs In Scope

- `docs/seo-aeo-geo/KITSILANO_SCENIC_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `docs/QA_EVIDENCE.md`

These docs belong to the approval and proof layer for the Kitsilano scenic queue. They are safe to include in a docs/proof handoff, but they are not the user-facing public payload themselves.

## Default Exclusions

Keep these out of the Kitsilano scenic queued release unless a later explicit approval changes scope:

- `/vancouver/first-time-visitor-starters`
- `/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`
- `/vancouver/wellness-reset-starters`
- `/vancouver/guides/vancouver-wellness-experiences-to-review`
- `/vancouver/out-of-town-guest-starters`
- `/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver`
- `/vancouver/weekend-route-starters`
- `/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day`
- `/vancouver/sunday-starters`
- `/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan`
- `/vancouver/returning-visitor-starters`
- `/vancouver/guides/vancouver-local-discovery-for-returning-visitors`
- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`
- `/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today`
- protected-route changes for `/admin`, `/private-preview/*`, `/planner`, or `/for-businesses/submit`
- billing, provider-import, outreach, or auth behavior changes

## Safe Transplant Rule

The current local branch mixes the Kitsilano scenic queue with earlier wedges and later routing work across both route files and link-only surfaces.

Because of that, the future release lane should follow this order:

- keep the required Kitsilano scenic route and crawl slice
- cherry-pick the mixed shared link surfaces only if the exact Kitsilano scenic links can be isolated cleanly
- defer link-only shared surfaces rather than widening the release
- verify the exact route outputs after transplant
- avoid broad copy-over of unrelated local-ready wedge changes from the same shared files

Use `docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the exact rule set.

## Local Proof Already Backing This Slice

Current local proof already recorded in repo docs includes:

- local `HTTP/1.1 200 OK` for both Kitsilano scenic queue routes
- honest `sitemap.xml` and `llms.txt` entries for the queued routes
- homepage, city page, and guide-library source-backed link exposure for the new route
- `npm run seo:smoke:kitsilano` passing on the local preview base for the two Kitsilano scenic routes, pairing fragments, `sitemap.xml`, `llms.txt`, and the noindex surface
- local browser-head proof for rendered title, description, robots, canonical, JSON-LD, correction-path links, and the Kitsilano scenic page-to-guide / guide-to-page pairing on both routes
- current machine truth at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links
- current shared route-structure truth across `33` key routes

## Best Use

Use this file together with:

- `docs/seo-aeo-geo/KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`

Short version:

- the queue packet says what should release later
- this handoff says which CityAtlas files and surfaces belong to that release slice
- the transplant checklist keeps the Kitsilano scenic release from drifting into earlier queues or the later routing releases

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
