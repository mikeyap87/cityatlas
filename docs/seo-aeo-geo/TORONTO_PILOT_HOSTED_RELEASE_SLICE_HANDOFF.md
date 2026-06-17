# CityAtlas Toronto Pilot Hosted Release Slice Handoff

## Purpose

Use this packet when the first non-Vancouver CityAtlas release is being re-cut from the current live truth.

This file answers a narrower question than the Toronto queue packet:

`Which CityAtlas files and surfaces belong to the Toronto hosted release slice, and which nearby work should stay out?`

Use `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live gate before any deploy approval.
Use `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe rules that keep mixed shared files from widening the Toronto release.

## Release Slice

Primary public routes in scope:

- `/toronto/guides`
- `/toronto/first-time-visitor-starters`
- `/toronto/guides/where-should-a-first-time-toronto-visitor-start`
- `/toronto/weekend-route-starters`
- `/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`

Supporting release intent:

- the queue should remain limited to those five Toronto routes plus the exact shared-file support needed for them
- this is still a path-scoped release slice inside `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Source-Of-Truth File Map

### Required Route And Crawl Sources

- `src/data/seed.ts`
  - contains the Toronto first-time visitor guide slug and resource links
  - contains the Toronto weekend-route guide slug and resource links
  - contains the Toronto source-backed place entries for both starter pages
  - this is a shared editorial data file, so keep only the Toronto first-time visitor and weekend-route portions when the release lane is re-cut

- `src/types.ts`
  - contains the Toronto source-backed collection keys
  - keep only the Toronto collection-type support that is required for the release slice

- `src/lib/sourceBackedCollections.ts`
  - contains the Toronto collection metadata and route paths
  - maps the Toronto guides to `toronto_first_time_visitor_starters` and `toronto_weekend_route_starters`
  - contains shared collection logic, so later additions from other cities should not be copied over automatically

- `src/features/public/GuideDetailPage.tsx`
  - contains the Toronto guide summary config and page-specific companion routing
  - should stay limited to the Toronto first-time visitor and Toronto weekend-route portions when the release lane is cut

- `src/features/public/TrustPages.tsx`
  - contains the Toronto source-backed page copy and page exports
  - keeps each Toronto starter page CTA pointed at its matching guide
  - should stay limited to those Toronto portions when the release lane is cut

- `src/features/public/SecondaryCityGuidesPage.tsx`
  - renders the secondary-city guide hub used by `/toronto/guides`
  - should stay in scope because the Toronto hub is part of the release payload

- `src/app/CityAtlasApp.tsx`
  - contains the guide-hub route handling and the route branches that make the Toronto starter pages reachable
  - should stay limited to the route support required for the five Toronto paths

- `public/sitemap.xml`
  - should include the five Toronto URLs
  - should not widen the release by adding unrelated city routes in the same slice

- `public/llms.txt`
  - should list the Toronto guide hub and the two Toronto starter-guide pairs
  - should keep the hosted-state wording honest about Toronto being live only after the approved release

### Mixed Shared Link Surfaces

- `src/features/public/HomePage.tsx`
  - currently bundles Toronto links into a broader city-discovery query section
  - do not broad-copy the whole section if a narrower Toronto release lane is being re-cut

- `src/features/public/CollectionPages.tsx`
  - currently bundles Toronto links into the guide-library and collection-hub surfaces alongside Vancouver links
  - do not broad-copy the whole block if it would also ship unrelated local-only work

- `src/features/public/AboutPage.tsx`
  - currently mixes Toronto links into the trust-model and what-is-live explainer surfaces
  - treat link-only carryover here as optional and surgical, not automatic

- `src/components/Layout.tsx`
  - footer navigation currently includes Toronto preview links next to Vancouver links
  - do not broad-copy the footer block if the release lane can isolate Toronto links more safely

## Shared Metadata Infrastructure

- `src/lib/seo.ts`
  - shared route metadata, breadcrumb, CollectionPage, ItemList, BlogPosting, and FAQ JSON-LD behavior for the Toronto routes
  - default release rule: do not pull unrelated route-layer metadata changes unless they are required for the Toronto slice

- `src/components/Seo.tsx`
  - shared tag-upsert layer for route metadata, canonical, robots, and JSON-LD behavior
  - current local proof confirms the Toronto routes use this correctly against the configured local base URL
  - default release rule: do not widen the Toronto release with unrelated SEO infrastructure changes

- `src/config/site.ts`
  - shared local/public base URL behavior that affects local canonical proof
  - default release rule: treat this as a shared dependency, not Toronto-only content work

## Approval And Proof Docs In Scope

- `docs/seo-aeo-geo/TORONTO_PILOT_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_OPERATOR_PACKET.md`
- `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md`

These docs belong to the approval and proof layer for the Toronto hosted release. They are safe to include in a docs/proof handoff, but they are not the user-facing public payload themselves.

## Default Exclusions

Keep these out of the Toronto hosted release unless a later explicit approval changes scope:

- unrelated Vancouver queue or routing work
- additional follow-on city pages beyond the five Toronto routes above
- protected-route behavior changes for `/admin`, `/private-preview/*`, `/planner`, or `/for-businesses/submit`
- billing, provider-import, outreach, auth, or admin changes

## Safe Transplant Rule

The current local branch mixes Toronto path support with broader shared-link surfaces and the larger donor-fed rollout machine.

Because of that, the future release lane should follow this order:

- keep the required Toronto route and crawl slice
- cherry-pick mixed shared link surfaces only if the exact Toronto links can be isolated cleanly
- defer link-only shared surfaces rather than widening the release
- verify the exact Toronto route outputs after transplant
- avoid broad copy-over of unrelated city-rollout or outreach-support changes from the same shared files

Use `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md` as the exact rule set.

## Local Proof Already Backing This Slice

Current local proof already recorded in repo docs includes:

- local `HTTP/1.1 200 OK` truth for all five Toronto routes
- route-level browser proof for source cards, correction links, guide-hub links, and page-to-guide / guide-to-page pairings
- route-level browser proof for title, description, robots, canonical, and JSON-LD on all five Toronto routes
- a passing `npm run seo:copy:proof` result for the checked public source files
- a passing `npm run seo:copy:rendered:proof` result for the current crawlable public routes
- honest local `sitemap.xml` and local `llms.txt` entries for all five Toronto routes
- current machine truth at `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page
- a passing `npm run seo:structure:proof` result across `38` key routes, including the Toronto guide hub plus the Toronto first-time visitor and weekend-route path set
- a passing `npm run seo:docs:proof` result keeping the current packet set aligned to the current local machine truth

## Local Metadata Caveat

- The recorded canonical and JSON-LD proof for this slice is local-only.
- It reflects the configured local base URL behavior at `http://127.0.0.1:5178/`.
- Hosted canonical and JSON-LD behavior still must be proven after release on `city.univenturestudio.com`.

## Best Use

Use this file together with:

- `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md`

Short version:

- the queue packet says what should release later
- the go/no-go checklist says what must still be true before live action
- this handoff says which CityAtlas files and surfaces belong to that Toronto release slice
- the transplant checklist keeps the Toronto release from drifting into unrelated shared-city or growth-machine work

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
