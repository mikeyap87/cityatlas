# CityAtlas First Source-Backed Release Transplant Checklist

## Purpose

Use this when the first queued source-backed release is being re-cut from live truth.

This file translates the current mixed local files into copy-safe rules so the first release lane does not accidentally pull in the later out-of-town guest, weekend-route, or starter-pack work.

## Hard Scope

Only these four routes belong to the first queued release:

- `/vancouver/first-time-visitor-starters`
- `/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`
- `/vancouver/wellness-reset-starters`
- `/vancouver/guides/vancouver-wellness-experiences-to-review`

## Required Route And Crawl Slice

Treat these as required first-queue files, but copy only the first-time visitor and wellness portions that belong to the four routes above:

- `src/data/seed.ts`
  - keep the first-time visitor guide content
  - keep the wellness guide content
  - keep the `vancouver_first_time_visitor_starters` source-backed entries
  - keep the `vancouver_wellness_reset_starters` source-backed entries
  - do not bring over the `vancouver_out_of_town_guest_starters` or `vancouver_weekend_route_starters` entries as part of this first release

- `src/lib/sourceBackedCollections.ts`
  - keep the first-time visitor collection metadata
  - keep the wellness collection metadata
  - keep the guide-to-collection mapping needed for first-time visitor and wellness
  - exclude out-of-town guest and weekend-route additions unless they are already present on the live base and unchanged

- `src/features/public/TrustPages.tsx`
  - keep the first-time visitor config block and page export
  - keep the wellness config block and page export
  - exclude the out-of-town guest and weekend-route config blocks and page exports from this release slice

- `src/app/CityAtlasApp.tsx`
  - keep the route branch for `/vancouver/first-time-visitor-starters`
  - keep the route branch for `/vancouver/wellness-reset-starters`
  - exclude the out-of-town guest and weekend-route route branches from this first release slice

- `public/sitemap.xml`
  - add only the four first-queue URLs
  - do not add later queued URLs in the same release

- `public/llms.txt`
  - add only the first-time visitor and wellness route wording that matches what is actually live after release
  - keep the hosted-state wording honest about which source-backed wedges are really public

## Mixed Shared Link Surfaces

These files currently bundle first-queue links together with later wedges:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/AboutPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/components/Layout.tsx`

Safe rule:

- cherry-pick only the first-time visitor and wellness link additions if they can be isolated cleanly on the release lane
- if isolating them would also ship out-of-town guest, weekend-route, or starter-pack links, defer these link-only surfaces instead of widening the release

Why deferral is acceptable:

- the four first-queue routes are still reachable through direct URLs, guide links, the route pages themselves, `sitemap.xml`, and `llms.txt`
- link-only surface deferral is safer than accidentally publishing the next queue early

## Shared Infrastructure Rule

Treat these as shared dependencies, not first-queue content by default:

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
- confirm the four first-queue routes still return `200`
- confirm the four first-queue routes still show the expected visible correction path, guide-to-collection pairings, and local metadata behavior
- confirm hosted `sitemap.xml`, hosted `llms.txt`, hosted canonical, and hosted JSON-LD still remain unverified until the real post-deploy smoke pass happens

## Short Version

- required route and crawl slice: keep first-time visitor plus wellness only
- mixed shared link surfaces: cherry-pick surgically or defer
- do not broad-copy shared files just because the local branch already contains later wedges

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
