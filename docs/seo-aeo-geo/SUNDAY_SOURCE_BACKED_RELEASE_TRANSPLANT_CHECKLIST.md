# CityAtlas Sunday Source-Backed Release Transplant Checklist

## Purpose

Use this when the Sunday queued source-backed release is being re-cut from live truth after the earlier source-backed queues are already resolved.

This file translates the current mixed local files into copy-safe rules so the Sunday release lane does not accidentally pull in the earlier queue payloads or the later starter-pack routing work.

## Hard Scope

Only these two routes belong to the Sunday queued release:

- `/vancouver/sunday-starters`
- `/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan`

## Required Route And Crawl Slice

Treat these as required Sunday-queue files, but copy only the Sunday portions that belong to the two routes above:

- `src/data/seed.ts`
  - keep the Sunday guide content
  - keep the `vancouver_sunday_starters` source-backed entries
  - keep the Sunday resource-link paths
  - do not bring over unrelated source-backed guide or wedge content as part of this Sunday release

- `src/lib/sourceBackedCollections.ts`
  - keep the Sunday collection metadata
  - keep the guide-to-collection mapping needed for Sunday
  - exclude unrelated collection additions unless they are already present on the live base and unchanged

- `src/features/public/TrustPages.tsx`
  - keep the Sunday config block and Sunday page export
  - exclude unrelated source-backed config blocks and page exports from this release slice

- `src/features/public/GuideDetailPage.tsx`
  - keep the Sunday source-backed section copy
  - exclude unrelated guide-source-backed section additions unless they are already present on the live base and unchanged

- `src/app/CityAtlasApp.tsx`
  - keep the route branch for `/vancouver/sunday-starters`
  - exclude unrelated source-backed route branches from this Sunday release slice

- `public/sitemap.xml`
  - add only the two Sunday URLs
  - do not add unrelated queued URLs in the same release

- `public/llms.txt`
  - add only the Sunday route wording that matches what is actually live after release
  - keep the hosted-state wording honest about which source-backed wedges are really public

## Mixed Shared Link Surfaces

These files currently bundle the Sunday queue together with earlier wedges and the later starter-pack routing work:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/AboutPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/components/Layout.tsx`

Safe rule:

- cherry-pick only the Sunday link additions if they can be isolated cleanly on the release lane
- if isolating them would also ship starter-pack or unrelated wedge links, defer these link-only surfaces instead of widening the release

Why deferral is acceptable:

- the two Sunday queue routes are still reachable through direct URLs, guide links, the route pages themselves, `sitemap.xml`, and `llms.txt`
- link-only surface deferral is safer than quietly publishing unrelated queued work at the same time

## Shared Infrastructure Rule

Treat these as shared dependencies, not Sunday-queue content by default:

- `src/lib/seo.ts`
- `src/components/Seo.tsx`
- `src/config/site.ts`

Only move them if the live base genuinely needs a Sunday-route metadata or proof-support fix that is already locally proven. Do not widen the release with unrelated SEO infrastructure changes.

## Proof Rule Before Any Live Action

Before any live release:

- re-run local proof on the exact re-cut release lane
- run `npm run seo:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:structure:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:docs:proof` on that exact re-cut release lane and keep it green
- confirm the two Sunday queue routes still return `200`
- confirm the two Sunday queue routes still show the expected visible correction path, Sunday guide-to-collection pairing, local browser-head proof, and local render proof
- confirm hosted `sitemap.xml`, hosted `llms.txt`, hosted canonical, and hosted JSON-LD still remain unverified until the real post-deploy smoke pass happens

## Short Version

- required route and crawl slice: keep Sunday only
- mixed shared link surfaces: cherry-pick surgically or defer
- do not broad-copy shared files just because the local branch already contains earlier queues or the later starter-pack routing release

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
