# CityAtlas Second Source-Backed Release Transplant Checklist

## Purpose

Use this when the second queued source-backed release is being re-cut from live truth after the first queue is already resolved.

This file translates the current mixed local files into copy-safe rules so the second release lane does not accidentally pull in the later starter-pack routing work or unrelated shared-surface changes.

## Hard Scope

Only these four routes belong to the second queued release:

- `/vancouver/out-of-town-guest-starters`
- `/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver`
- `/vancouver/weekend-route-starters`
- `/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day`

## Required Route And Crawl Slice

Treat these as required second-queue files, but copy only the out-of-town guest and weekend-route portions that belong to the four routes above:

- `src/data/seed.ts`
  - keep the out-of-town guest guide content
  - keep the weekend-route guide content
  - keep the `vancouver_out_of_town_guest_starters` source-backed entries
  - keep the `vancouver_weekend_route_starters` source-backed entries
  - do not bring over the starter-pack guide content as part of this second release

- `src/lib/sourceBackedCollections.ts`
  - keep the out-of-town guest collection metadata
  - keep the weekend-route collection metadata
  - keep the guide-to-collection mapping needed for out-of-town guest and weekend route
  - do not widen the second release by copying unrelated local-only collection additions

- `src/features/public/TrustPages.tsx`
  - keep the out-of-town guest config block and page export
  - keep the weekend-route config block and page export
  - do not widen the second release with unrelated trust-page changes unless they are already part of the hosted base

- `src/app/CityAtlasApp.tsx`
  - keep the route branch for `/vancouver/out-of-town-guest-starters`
  - keep the route branch for `/vancouver/weekend-route-starters`
  - do not widen the second release with unrelated source-backed route branches

- `public/sitemap.xml`
  - add only the four second-queue URLs
  - do not add the starter-pack guide in the same release

- `public/llms.txt`
  - add only the out-of-town guest and weekend-route wording that matches what is actually live after release
  - keep the hosted-state wording honest about which source-backed wedges and guides are really public
  - do not move the starter-pack guide from local-ready to live wording in the same release

## Mixed Shared Link Surfaces

These files currently bundle the second queue together with starter-pack or other broader route links:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/AboutPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/components/Layout.tsx`

Safe rule:

- cherry-pick only the out-of-town guest and weekend-route link additions if they can be isolated cleanly on the release lane
- if isolating them would also ship the starter-pack guide or unrelated link groups, defer these link-only surfaces instead of widening the release

Why deferral is acceptable:

- the four second-queue routes are still reachable through direct URLs, guide links, the route pages themselves, `sitemap.xml`, and `llms.txt`
- link-only surface deferral is safer than quietly publishing the later starter-pack release at the same time

## Shared Infrastructure Rule

Treat these as shared dependencies, not second-queue content by default:

- `src/lib/seo.ts`
- `src/components/Seo.tsx`
- `src/config/site.ts`

Only move them if the live base genuinely needs a route-metadata fix that is already locally proven. Do not widen the release with unrelated SEO infrastructure changes.

## Proof Rule Before Any Live Action

Before any live release:

- re-run local proof on the exact re-cut release lane
- run `npm run seo:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:structure:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:docs:proof` on that exact re-cut release lane and keep it green
- confirm the four second-queue routes still return `200`
- confirm the four second-queue routes still show the expected visible correction path, guide-to-collection pairings, and local metadata behavior
- confirm hosted `sitemap.xml`, hosted `llms.txt`, hosted canonical, and hosted JSON-LD still remain unverified until the real post-deploy smoke pass happens

## Short Version

- required route and crawl slice: keep out-of-town guest plus weekend route only
- mixed shared link surfaces: cherry-pick surgically or defer
- do not broad-copy shared files just because the local branch already contains the later starter-pack release work

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
