# CityAtlas West-Side Daytime Source-Backed Release Transplant Checklist

## Purpose

Use this when the west-side daytime queued source-backed release is being re-cut from live truth after the earlier five source-backed queues are already resolved.

This file translates the current mixed local files into copy-safe rules so the west-side daytime release lane does not accidentally pull in earlier queue payloads or the later routing work.

## Hard Scope

Only these two routes belong to the west-side daytime queued release:

- `/vancouver/west-side-daytime-starters`
- `/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan`

## Required Route And Crawl Slice

Treat these as required west-side daytime queue files, but copy only the portions that belong to the two routes above:

- `src/data/seed.ts`
  - keep the west-side daytime source-backed entries
  - keep the west-side daytime guide resource-link path
  - keep the matching west-side daytime guide content
  - do not bring over unrelated neighborhood or source-backed content as part of this release

- `src/lib/sourceBackedCollections.ts`
  - keep the west-side daytime collection metadata
  - keep the guide-to-collection mapping needed for the west-side daytime guide
  - exclude unrelated collection additions unless they are already present on the live base and unchanged

- `src/features/public/TrustPages.tsx`
  - keep the west-side daytime config block and page export
  - exclude unrelated source-backed config blocks and page exports from this release slice

- `src/features/public/GuideDetailPage.tsx`
  - keep the west-side daytime source-backed section copy
  - exclude unrelated guide-source-backed section additions unless they are already present on the live base and unchanged

- `src/app/CityAtlasApp.tsx`
  - keep the route branch for `/vancouver/west-side-daytime-starters`
  - exclude unrelated source-backed route branches from this release slice

- `public/sitemap.xml`
  - add only the two west-side daytime URLs
  - do not add unrelated queued URLs in the same release

- `public/llms.txt`
  - add only the west-side daytime route wording that matches what is actually live after release
  - keep the hosted-state wording honest about which source-backed wedges are really public

## Mixed Shared Link Surfaces

These files currently bundle the west-side daytime queue together with earlier wedges and later routing work:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/features/public/AboutPage.tsx`
- `src/components/Layout.tsx`

Safe rule:

- cherry-pick only the west-side daytime link additions if they can be isolated cleanly on the release lane
- if isolating them would also ship unrelated wedge links or later routing work, defer these link-only surfaces instead of widening the release

Why deferral is acceptable:

- the two west-side daytime queue routes are still reachable through direct URLs, guide links, the route pages themselves, `sitemap.xml`, and `llms.txt`
- link-only surface deferral is safer than quietly publishing unrelated queued work at the same time

## Shared Infrastructure Rule

Treat these as shared dependencies, not west-side daytime queue content by default:

- `src/components/Seo.tsx`
- `src/lib/seo.ts`
- `src/config/site.ts`

Only move them if the live base genuinely needs a west-side daytime route metadata fix that is already locally proven. Do not widen the release with unrelated SEO or infrastructure changes.

## Proof Rule Before Any Live Action

Before any live release:

- re-run local proof on the exact re-cut release lane
- run `npm run seo:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:structure:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:docs:proof` on that exact re-cut release lane and keep it green
- confirm the two west-side daytime queue routes still return `200`
- confirm the two west-side daytime queue routes still show the expected visible correction path, west-side daytime page-to-guide / guide-to-page pairing, local browser-head proof, and guide source-backed section
- confirm hosted `sitemap.xml`, hosted `llms.txt`, hosted canonical, and hosted JSON-LD still remain unverified until the real post-deploy smoke pass happens

## Short Version

- required route and crawl slice: keep west-side daytime only
- mixed shared link surfaces: cherry-pick surgically or defer
- do not broad-copy shared files just because the local branch already contains earlier queues or later routing releases

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
