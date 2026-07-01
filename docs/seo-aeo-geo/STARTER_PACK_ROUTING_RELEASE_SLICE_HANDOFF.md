# CityAtlas Starter-Pack Routing Release Slice Handoff

## Purpose

Use this packet when the starter-pack routing release is being re-cut from live truth after the nine higher-priority source-backed queues are already resolved.

This file answers a narrower question than the routing queue packet:

`Which CityAtlas files and surfaces belong to the starter-pack routing release slice, and which nearby work should stay out?`

Use `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe transplant rules when this slice is re-cut from live truth.

## Release Slice

Primary public route in scope:

- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`

Supporting release intent:

- the queue should remain limited to that guide route plus its already-built internal-link and crawl-surface support
- this is still a path-scoped release slice inside `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Source-Of-Truth File Map

### Required Route And Crawl Sources

- `src/data/seed.ts`
  - contains the starter-pack guide slug
  - contains the starter-pack guide copy, FAQ content, and proof note
  - contains the `resourceLinks` list that powers the direct-path routing section
  - this is a shared editorial data file, so use the transplant checklist to keep only the starter-pack guide record in this release slice

- `src/features/public/GuideDetailPage.tsx`
  - contains the reusable guide rendering for the direct-path section fed by `resourceLinks`
  - contains the generic guide route output that shows the starter-pack guide’s internal routing cards
  - should stay limited to the routing-support behavior already proven locally

- `src/styles/components.css`
  - contains shared styling for `.guide-query-grid`
  - should stay limited to the routing-support styles needed for the direct-path section

- `src/styles/responsive.css`
  - contains responsive handling for `.guide-query-grid`
  - should stay limited to the routing-support styles already proven at 390px

- `public/sitemap.xml`
  - should include the starter-pack guide route
  - should not widen the release into other later guide routes

- `public/llms.txt`
  - should list the starter-pack guide as local-ready-to-live when appropriate
  - should keep the hosted-state wording honest about which source-backed wedges and routing guides are actually public after release

### Mixed Shared Link Surfaces

- `src/features/public/HomePage.tsx`
  - currently links the starter-pack guide inside a broader route-intent block
  - do not assume the whole block belongs to this release slice

- `src/features/public/CityPage.tsx`
  - currently links the starter-pack guide together with multiple source-backed wedge links and standards links
  - do not transplant the whole button block into the starter-pack release lane

- `src/features/public/AboutPage.tsx`
  - currently links the starter-pack guide together with multiple source-backed wedge links and the correction path
  - do not transplant the whole button block into the starter-pack release lane

- `src/features/public/CollectionPages.tsx`
  - currently links the starter-pack guide together with multiple source-backed wedge links and standards links
  - do not transplant the whole button block into the starter-pack release lane

- `src/components/Layout.tsx`
  - footer navigation currently links the starter-pack guide together with several source-backed wedge links
  - do not transplant the whole footer block into the starter-pack release lane

### Shared Metadata Infrastructure

- `src/components/Seo.tsx`
  - shared route metadata, canonical, and JSON-LD behavior for the guide route
  - current local proof confirms the starter-pack guide uses this correctly against the configured local base URL
  - default release rule: do not pull unrelated SEO infrastructure changes unless they are required for this slice

- `src/config/site.ts`
  - shared local/public base URL behavior that affects local canonical proof
  - default release rule: treat this as a shared dependency, not route-specific content work

## Approval And Proof Docs In Scope

- `docs/seo-aeo-geo/STARTER_PACK_GUIDE_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_QUEUE_PACKET.md`
- `docs/QA_EVIDENCE.md`

These docs belong to the approval and proof layer for the starter-pack release. They are safe to include in a docs/proof handoff, but they are not the user-facing public payload themselves.

## Default Exclusions

Keep these out of the starter-pack routing release unless a later explicit approval changes scope:

- the nine source-backed release queues
- the low-friction and guide-roundup routing releases
- work-friendly cafe wedge follow-through
- protected-route changes for `/admin`, `/private-preview/*`, `/planner`, or `/for-businesses/submit`
- billing, provider-import, outreach, or auth behavior changes

## Safe Transplant Rule

The current local branch mixes the starter-pack guide with broader shared guide rendering, shared styles, and mixed link-only surfaces.

Because of that, the future release lane should follow this order:

- keep the required starter-pack guide record and routing-support slice
- cherry-pick the mixed shared link surfaces only if the exact starter-pack links can be isolated cleanly
- defer link-only shared surfaces rather than widening the release
- verify the exact route output after transplant
- avoid broad copy-over of unrelated local-ready wedge or guide changes from the same shared files

Use `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` as the exact rule set.

## Local Proof Already Backing This Slice

Current local proof already recorded in repo docs includes:

- local `HTTP/1.1 200 OK` for the starter-pack guide route on `127.0.0.1:5178`
- route-level browser proof for the direct-path section, related guides, and query-fit content
- route-level browser proof for title, description, robots, canonical, and breadcrumb/article JSON-LD
- honest `sitemap.xml` and `llms.txt` entries for the guide route
- current machine-level proof at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links

## Local Metadata Caveat

- The recorded canonical and JSON-LD proof for this slice is local-only.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted canonical and JSON-LD behavior still must be proven after release on `city.univenturestudio.com`.

## Best Use

Use this file together with:

- `docs/seo-aeo-geo/STARTER_PACK_ROUTING_RELEASE_QUEUE_PACKET.md`

Short version:

- the queue packet says what should release later
- this handoff says which CityAtlas files and surfaces belong to that release slice
- the transplant checklist keeps the routing release from drifting into unrelated wedge or guide work

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
