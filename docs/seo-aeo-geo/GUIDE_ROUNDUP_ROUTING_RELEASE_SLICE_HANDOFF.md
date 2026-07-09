# CityAtlas Guide-Roundup Routing Release Slice Handoff

## Purpose

Use this packet when the guide-roundup routing release is being re-cut from live truth after the nine source-backed queues and the earlier routing-only releases are already resolved.

This file answers a narrower question than the routing queue packet:

`Which CityAtlas files and surfaces belong to the guide-roundup routing release slice, and which nearby work should stay out?`

Use `docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe transplant rules when this slice is re-cut from live truth.

## Release Slice

Primary public route in scope:

- `/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation`

Supporting release intent:

- the queue should remain limited to that guide route plus its already-built internal-link and crawl-surface support
- this is still a path-scoped release slice inside `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Source-Of-Truth File Map

### Required Route And Crawl Sources

- `src/data/seed.ts`
  - contains the guide-roundup slug
  - contains the guide-roundup copy, FAQ content, and proof note
  - contains the `resourceLinks` list that powers the direct-path routing section
  - this is a shared editorial data file, so use the transplant checklist to keep only the guide-roundup record in this release slice

- `src/features/public/GuideDetailPage.tsx`
  - contains the reusable guide rendering for the direct-path section fed by `resourceLinks`
  - contains the generic guide route output that shows the guide-roundup page’s internal routing cards
  - should stay limited to the routing-support behavior already proven locally

- `src/styles/components.css`
  - contains shared styling for `.guide-query-grid`
  - should stay limited to the routing-support styles needed for the direct-path section

- `src/styles/responsive.css`
  - contains responsive handling for `.guide-query-grid`
  - should stay limited to the routing-support styles already proven locally

- `public/sitemap.xml`
  - should include the guide-roundup route
  - should not widen the release into other later guide routes

- `public/llms.txt`
  - should list the guide-roundup page as local-ready-to-live when appropriate
  - should keep the hosted-state wording honest about which source-backed wedges and routing guides are actually public after release

### Mixed Shared Link Surfaces

- `src/features/public/HomePage.tsx`
  - currently links the guide-roundup page inside a broader route-intent block
  - do not assume the whole block belongs to this release slice

- `src/features/public/CityPage.tsx`
  - currently links the guide-roundup page together with starter-pack, low-friction, and standards links
  - do not transplant the whole button block into the roundup release lane

- `src/features/public/AboutPage.tsx`
  - currently links broader guide-library surfaces
  - do not add this surface unless the exact roundup link can be isolated cleanly on the release lane

- `src/features/public/CollectionPages.tsx`
  - the guide library already exposes this route through shared guide rendering
  - do not broad-copy unrelated guide-library surfaces into this later routing release

- `src/components/Layout.tsx`
  - footer navigation does not need to widen as part of this release by default
  - do not transplant unrelated link groups just to expose the guide in one more place

### Shared Metadata Infrastructure

- `src/components/Seo.tsx`
  - shared route metadata, canonical, and JSON-LD behavior for the guide route
  - current local proof confirms the guide-roundup page uses this correctly against the configured local base URL
  - default release rule: do not pull unrelated SEO infrastructure changes unless they are required for this slice

- `src/config/site.ts`
  - shared local/public base URL behavior that affects local canonical proof
  - default release rule: treat this as a shared dependency, not route-specific content work

## Approval And Proof Docs In Scope

- `docs/seo-aeo-geo/GUIDE_ROUNDUP_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_QUEUE_PACKET.md`
- `docs/QA_EVIDENCE.md`

These docs belong to the approval and proof layer for the guide-roundup release. They are safe to include in a docs/proof handoff, but they are not the user-facing public payload themselves.

## Default Exclusions

Keep these out of the guide-roundup routing release unless a later explicit approval changes scope:

- the nine source-backed release queues
- the starter-pack routing release
- the low-friction routing release
- work-friendly cafe wedge follow-through
- protected-route changes for `/admin`, `/private-preview/*`, `/planner`, or `/for-businesses/submit`
- billing, provider-import, outreach, or auth behavior changes

## Safe Transplant Rule

The current local branch mixes the guide-roundup page with broader shared guide rendering and mixed link-only surfaces.

Because of that, the future release lane should follow this order:

- keep the required guide-roundup record and routing-support slice
- cherry-pick the mixed shared link surfaces only if the exact roundup links can be isolated cleanly
- defer link-only shared surfaces rather than widening the release
- verify the exact route output after transplant
- avoid broad copy-over of unrelated local-ready wedge or guide changes from the same shared files

Use `docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` as the exact rule set.

## Local Proof Already Backing This Slice

Current local proof already recorded in repo docs includes:

- local guide-roundup route coverage in `sitemap.xml` and `llms.txt`
- local `HTTP/1.1 200 OK` for the guide-roundup route on `127.0.0.1:5178`
- local-ready guide-roundup route through the shared guide rendering system
- `npm run seo:structure:proof` now includes the guide-roundup guide in the checked route set
- current machine truth at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links

## Local Metadata Caveat

- The recorded metadata and guide-output proof for this slice is local-only.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted canonical and JSON-LD behavior still must be proven after release on `city.univenturestudio.com`.

## Best Use

Use this file together with:

- `docs/seo-aeo-geo/GUIDE_ROUNDUP_ROUTING_RELEASE_QUEUE_PACKET.md`

Short version:

- the queue packet says what should release later
- this handoff says which CityAtlas files and surfaces belong to that release slice
- the transplant checklist keeps the routing release from drifting into unrelated wedge or guide work

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
