# CityAtlas Toronto Pilot Hosted Release Transplant Checklist

## Purpose

Use this when the Toronto hosted release is being re-cut from live truth after the Vancouver-first production surface is already live.

This file translates the current mixed local files into copy-safe rules so the Toronto release lane does not accidentally pull in unrelated growth-machine, donor-fed rollout, or shared-link work.

## Hard Scope

Only these five routes belong to the Toronto hosted release:

- `/toronto/guides`
- `/toronto/first-time-visitor-starters`
- `/toronto/guides/where-should-a-first-time-toronto-visitor-start`
- `/toronto/weekend-route-starters`
- `/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`

## Required Route And Crawl Slice

Treat these as required Toronto release files, but copy only the Toronto first-time visitor and Toronto weekend-route portions that belong to the five routes above:

- `src/data/seed.ts`
  - keep the Toronto first-time visitor guide content
  - keep the Toronto weekend-route guide content
  - keep the `toronto_first_time_visitor_starters` source-backed entries
  - keep the `toronto_weekend_route_starters` source-backed entries
  - do not widen the release with unrelated city content from the same data file

- `src/types.ts`
  - keep the Toronto collection-key support needed for the five Toronto routes
  - do not widen the release with unrelated type changes unless they are already required by the live base

- `src/lib/sourceBackedCollections.ts`
  - keep the Toronto collection metadata
  - keep the guide-to-collection mapping needed for the Toronto first-time visitor and weekend-route guide pair
  - do not widen the release by copying unrelated local-only collection additions

- `src/features/public/GuideDetailPage.tsx`
  - keep the Toronto guide config blocks
  - keep the Toronto guide-hub companion routing
  - do not widen the release with unrelated guide-detail changes

- `src/features/public/TrustPages.tsx`
  - keep the Toronto first-time visitor config block and page export
  - keep the Toronto weekend-route config block and page export
  - do not widen the release with unrelated source-backed page changes unless they already exist on the hosted base

- `src/features/public/SecondaryCityGuidesPage.tsx`
  - keep the shared secondary-city hub render support because `/toronto/guides` depends on it
  - do not widen the release with unrelated secondary-city presentation changes unless they are required by the Toronto hub itself

- `src/app/CityAtlasApp.tsx`
  - keep the guide-hub route handling and Toronto starter-route support
  - do not widen the release with unrelated source-backed or private-route branches

- `public/sitemap.xml`
  - add only the five Toronto URLs
  - do not widen the release by adding unrelated city routes in the same slice

- `public/llms.txt`
  - add only the Toronto guide hub and two Toronto starter-guide pairs
  - keep the hosted-state wording honest about Toronto being live only after release
  - do not promote unrelated city routes in the same slice

## Mixed Shared Link Surfaces

These files currently bundle Toronto links together with the broader Vancouver and multi-city discovery library:

- `src/features/public/HomePage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/features/public/AboutPage.tsx`
- `src/components/Layout.tsx`

Safe rule:

- cherry-pick only the Toronto link additions if they can be isolated cleanly on the release lane
- if isolating them would also ship unrelated shared-link work, defer those link-only surfaces instead of widening the Toronto release

Why deferral is acceptable:

- the five Toronto routes are still reachable through direct URLs, the guide hub, the starter-page and guide pairings, `sitemap.xml`, and `llms.txt`
- link-only surface deferral is safer than quietly publishing unrelated local-only work at the same time

## Shared Infrastructure Rule

Treat these as shared dependencies, not Toronto release content by default:

- `src/lib/seo.ts`
- `src/components/Seo.tsx`
- `src/config/site.ts`

Only move them if the live base genuinely needs a metadata fix that is already locally proven. Do not widen the release with unrelated SEO infrastructure changes.

## Proof Rule Before Any Live Action

Before any live release:

- re-run local proof on the exact re-cut release lane
- run `npm run seo:proof:stack` on that exact re-cut release lane and keep it green
- run `npm run seo:structure:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:copy:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:copy:rendered:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:docs:proof` on that exact re-cut release lane and keep it green
- confirm the five Toronto routes still return `200`
- confirm the five Toronto routes still show the expected visible correction path, guide-hub links, and starter-page to guide / guide to starter-page pairings
- confirm hosted `sitemap.xml`, hosted `llms.txt`, hosted canonical, and hosted JSON-LD still remain unverified until the real post-deploy smoke pass happens

## Short Version

- required route and crawl slice: keep the Toronto guide hub plus the two Toronto starter-guide pairs only
- mixed shared link surfaces: cherry-pick surgically or defer
- do not broad-copy shared files just because the current local branch already contains larger multi-city rollout work

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
