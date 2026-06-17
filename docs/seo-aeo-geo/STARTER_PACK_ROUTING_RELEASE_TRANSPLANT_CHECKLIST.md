# CityAtlas Starter-Pack Routing Release Transplant Checklist

## Purpose

Use this when the starter-pack routing release is being re-cut from live truth after the nine source-backed queues are already resolved.

This file translates the current mixed local files into copy-safe rules so the routing release lane does not accidentally pull in unrelated wedge work or broader shared-surface changes.

## Hard Scope

Only this route belongs to the starter-pack routing release:

- `/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first`

## Required Route And Crawl Slice

Treat these as required starter-pack files, but copy only the route-specific portions that belong to the guide above:

- `src/data/seed.ts`
  - keep the starter-pack guide content
  - keep the starter-pack FAQ content
  - keep the starter-pack `resourceLinks` list
  - do not widen the release with unrelated guide edits from the same shared seed file

- `src/features/public/GuideDetailPage.tsx`
  - keep the direct-path rendering support already proven locally
  - do not widen the release with unrelated guide-detail changes unless they are already part of the hosted base

- `src/styles/components.css`
  - keep only the starter-pack direct-path styling support that is required for `.guide-query-grid`

- `src/styles/responsive.css`
  - keep only the responsive starter-pack direct-path styling support already proven locally

- `public/sitemap.xml`
  - add only the starter-pack guide route
  - do not widen the release into other later guide routes

- `public/llms.txt`
  - add only the starter-pack guide wording that matches what is actually live after release
  - keep the hosted-state wording honest about which source-backed wedges and routing guides are really public

## Mixed Shared Link Surfaces

These files currently bundle the starter-pack guide together with broader wedge or standards links:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/AboutPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/components/Layout.tsx`

Safe rule:

- cherry-pick only the starter-pack link additions if they can be isolated cleanly on the release lane
- if isolating them would also ship unrelated link groups or later content changes, defer these link-only surfaces instead of widening the release

Why deferral is acceptable:

- the guide route is still reachable through its direct URL, guide-library access, existing route links, `sitemap.xml`, and `llms.txt`
- link-only surface deferral is safer than quietly publishing unrelated local-ready changes at the same time

## Shared Infrastructure Rule

Treat these as shared dependencies, not starter-pack content by default:

- `src/components/Seo.tsx`
- `src/config/site.ts`
- generic guide slug routing in `src/app/CityAtlasApp.tsx`

Only move them if the live base genuinely needs a guide-route or metadata fix that is already locally proven. Do not widen the release with unrelated routing or SEO infrastructure changes.

## Proof Rule Before Any Live Action

Before any live release:

- re-run local proof on the exact re-cut release lane
- confirm the starter-pack guide route still returns `200`
- confirm the starter-pack guide still shows the expected direct-path section and local metadata behavior
- confirm hosted `sitemap.xml`, hosted `llms.txt`, hosted canonical, and hosted JSON-LD still remain unverified until the real post-deploy smoke pass happens

## Short Version

- required route and crawl slice: keep the starter-pack guide only
- mixed shared link surfaces: cherry-pick surgically or defer
- do not broad-copy shared files just because the local branch already contains other local-ready wedges and guide work

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
