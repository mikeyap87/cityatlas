# CityAtlas Returning-Visitor Source-Backed Release Slice Handoff

## Purpose

Use this packet when the returning-visitor source-backed release is being re-cut from live truth after the first, second, and Sunday queued source-backed releases are already resolved and before the later Kitsilano scenic queue is considered.

This file answers a narrower question than the returning-visitor queue packet:

`Which CityAtlas files and surfaces belong to the returning-visitor queued release slice, and which nearby work should stay out?`

Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live gate for this slice before any deploy approval.
Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe transplant rules when this slice is re-cut from live truth.

## Release Slice

Primary public routes in scope:

- `/vancouver/returning-visitor-starters`
- `/vancouver/guides/vancouver-local-discovery-for-returning-visitors`

Supporting release intent:

- the queue should remain limited to those two routes plus their already-built internal-link and crawl-surface support
- this is still a path-scoped release slice inside `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Source-Of-Truth File Map

### Required Route And Crawl Sources

- `src/data/seed.ts`
  - contains the returning-visitor guide slug
  - contains the guide resource-link paths
  - contains the `vancouver_returning_visitor_starters` source-backed entries
  - contains a shared starter-pack guide resource-link addition that points at the returning-visitor route, which should be treated as optional carryover rather than required queue scope
  - this is a shared editorial data file, so use the transplant checklist to keep only the returning-visitor guide and returning-visitor source-backed records in the returning-visitor release slice

- `src/lib/sourceBackedCollections.ts`
  - contains the returning-visitor source-backed route path
  - contains the returning-visitor collection metadata
  - maps the returning-visitor guide to `vancouver_returning_visitor_starters`
  - contains shared route-collection logic for all public source-backed pages, so earlier and later wedge additions should not be copied over automatically

- `src/features/public/TrustPages.tsx`
  - contains the returning-visitor source-backed page copy and page export
  - keeps the returning-visitor source-backed page CTA pointed at the matching guide
  - should stay limited to the returning-visitor config block and returning-visitor page export when the release lane is cut

- `src/features/public/GuideDetailPage.tsx`
  - contains the returning-visitor source-backed section copy and rail-link support for the matching guide
  - should stay limited to the returning-visitor section addition when the release lane is cut

- `src/app/CityAtlasApp.tsx`
  - contains route handling for `/vancouver/returning-visitor-starters`
  - should stay limited to that returning-visitor route branch when the release lane is cut

- `public/sitemap.xml`
  - should include the returning-visitor source-backed page
  - should include the returning-visitor guide route
  - should not widen to later routing releases in the same slice

- `public/llms.txt`
  - should list the returning-visitor source-backed page as local-ready-to-live
  - should list the matching returning-visitor guide
  - should keep the hosted-state wording honest about which wedges are actually public after release

### Mixed Shared Link Surfaces

- `src/features/public/HomePage.tsx`
  - currently bundles the returning-visitor link together with earlier source-backed wedges and the later starter-pack link
  - do not transplant the whole button block into the returning-visitor release lane

- `src/features/public/CityPage.tsx`
  - currently bundles the returning-visitor link together with earlier source-backed wedges and the starter-pack link
  - do not transplant the whole button block into the returning-visitor release lane

- `src/features/public/CollectionPages.tsx`
  - currently bundles the returning-visitor link together with broader route-group links and the later starter-pack release work
  - do not transplant the whole button block into the returning-visitor release lane

- `src/features/public/AboutPage.tsx`
  - currently mixes the returning-visitor link into a broader trust-model block
  - treat link-only carryover here as optional and surgical, not automatic

- `src/components/Layout.tsx`
  - footer navigation currently bundles the returning-visitor link together with earlier source-backed wedges and the starter-pack guide
  - do not transplant the whole footer block into the returning-visitor release lane

### Shared Metadata Infrastructure

- `src/lib/seo.ts`
  - shared route metadata, breadcrumb, CollectionPage, ItemList, and FAQ JSON-LD behavior for the returning-visitor queue routes
  - default release rule: do not pull unrelated route-layer changes unless they are required for the returning-visitor slice

- `src/components/Seo.tsx`
  - shared tag-upsert layer for route metadata, canonical, robots, and JSON-LD behavior
  - current local proof confirms rendered title, description, robots, canonical, JSON-LD, and visible content on the active dev surface, but hosted route metadata still needs post-deploy smoke
  - default release rule: do not pull unrelated SEO infrastructure changes unless they are required for the returning-visitor slice

- `src/config/site.ts`
  - shared local/public base URL behavior that affects local proof
  - treat it as shared infrastructure rather than returning-visitor-specific content work

- `src/styles/responsive.css`
  - contains the narrow-screen section-header follow-up fix that should be kept only if the live base still needs it for the returning-visitor route
  - this is shared responsive infrastructure, so avoid broad copy-over if the same fix is already present on the live base

## Approval And Proof Docs In Scope

- `docs/seo-aeo-geo/RETURNING_VISITOR_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `docs/QA_EVIDENCE.md`

These docs belong to the approval and proof layer for the returning-visitor queue. They are safe to include in a docs/proof handoff, but they are not the user-facing public payload themselves.

## Default Exclusions

Keep these out of the returning-visitor queued release unless a later explicit approval changes scope:

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
- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`
- work-friendly cafe wedge follow-through
- protected-route changes for `/admin`, `/private-preview/*`, `/planner`, or `/for-businesses/submit`
- billing, provider-import, outreach, or auth behavior changes

## Safe Transplant Rule

The current local branch mixes the returning-visitor queue with earlier wedges and the later starter-pack routing work across both route files and link-only surfaces.

Because of that, the future release lane should follow this order:

- keep the required returning-visitor route/crawl slice
- cherry-pick the mixed shared link surfaces only if the exact returning-visitor links can be isolated cleanly
- treat the starter-pack guide resource-link carryover as optional, not required
- defer link-only shared surfaces rather than widening the release
- verify the exact route outputs after transplant
- avoid broad copy-over of unrelated local-ready wedge changes from the same shared files

Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` as the exact rule set.

## Local Proof Already Backing This Slice

Current local proof already recorded in repo docs includes:

- local `HTTP/1.1 200 OK` for both returning-visitor queue routes
- server-render proof for the guide CTA path, guide resource links, five anchor names, and collection metadata path/title mapping
- honest `sitemap.xml` and `llms.txt` entries for the queued routes
- local browser-head proof for rendered title, description, robots, canonical, JSON-LD, correction-path links, and the returning-visitor page-to-guide / guide-to-page pairing on both routes
- local desktop screenshot proof for the source-backed page
- repo truth mapping the returning-visitor guide to `vancouver_returning_visitor_starters` and keeping the returning-visitor source-backed page CTA pointed at the matching guide
- current machine truth at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links
- a passing `npm run seo:structure:proof` result covering the shared route-structure layer across `33` key routes
- a passing `npm run seo:docs:proof` result keeping the current queue packet set aligned to the current local machine truth

## Local Mobile Caveat

- Final local mobile proof now includes a post-fix 390px screenshot pass on the returning-visitor page.
- The release lane should preserve that narrow-screen readability while re-cutting the path-scoped release slice.

## Best Use

Use this file together with:

- `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`

Short version:

- the queue packet says what should release later
- the go/no-go checklist says what must still be true before live action
- this handoff says which CityAtlas files and surfaces belong to that release slice
- the transplant checklist keeps the returning-visitor release from drifting into earlier queues or the later starter-pack routing release

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
