# CityAtlas Kitsilano Scenic Source-Backed Release Transplant Checklist

## Purpose

Use this when the Kitsilano scenic queued source-backed release is being re-cut from live truth after the earlier four source-backed queues are already resolved.

This file translates the current mixed local files into copy-safe rules so the Kitsilano scenic release lane does not accidentally pull in earlier queue payloads or the later routing work.

## Hard Scope

Only these two routes belong to the Kitsilano scenic queued release:

- `/vancouver/kitsilano-scenic-starters`
- `/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings`

## Required Route And Crawl Slice

Treat these as required Kitsilano scenic queue files, but copy only the portions that belong to the two routes above:

- `src/data/seed.ts`
  - keep the Kitsilano scenic source-backed entries
  - keep the Kitsilano scenic guide resource-link path
  - keep the existing Kitsilano neighborhood guide content only where it is required for the matching guide route
  - do not bring over unrelated neighborhood or source-backed content as part of this release

- `src/lib/sourceBackedCollections.ts`
  - keep the Kitsilano scenic collection metadata
  - keep the guide-to-collection mapping needed for the Kitsilano guide
  - exclude unrelated collection additions unless they are already present on the live base and unchanged

- `src/features/public/TrustPages.tsx`
  - keep the Kitsilano scenic config block and page export
  - exclude unrelated source-backed config blocks and page exports from this release slice

- `src/features/public/GuideDetailPage.tsx`
  - keep the Kitsilano scenic source-backed section copy
  - exclude unrelated guide-source-backed section additions unless they are already present on the live base and unchanged

- `src/app/CityAtlasApp.tsx`
  - keep the route branch for `/vancouver/kitsilano-scenic-starters`
  - exclude unrelated source-backed route branches from this release slice

- `public/sitemap.xml`
  - add only the two Kitsilano scenic URLs
  - do not add unrelated queued URLs in the same release

- `public/llms.txt`
  - add only the Kitsilano scenic route wording that matches what is actually live after release
  - keep the hosted-state wording honest about which source-backed wedges are really public

## Mixed Shared Link Surfaces

These files currently bundle the Kitsilano scenic queue together with earlier wedges and later routing work:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/features/public/AboutPage.tsx`
- `src/components/Layout.tsx`

Safe rule:

- cherry-pick only the Kitsilano scenic link additions if they can be isolated cleanly on the release lane
- if isolating them would also ship unrelated wedge links or later routing work, defer these link-only surfaces instead of widening the release

Why deferral is acceptable:

- the two Kitsilano scenic queue routes are still reachable through direct URLs, guide links, the route pages themselves, `sitemap.xml`, and `llms.txt`
- link-only surface deferral is safer than quietly publishing unrelated queued work at the same time

## Shared Infrastructure Rule

Treat these as shared dependencies, not Kitsilano scenic queue content by default:

- `src/components/Seo.tsx`
- `src/lib/seo.ts`
- `src/config/site.ts`

Only move them if the live base genuinely needs a Kitsilano scenic route metadata fix that is already locally proven. Do not widen the release with unrelated SEO or infrastructure changes.

## Proof Rule Before Any Live Action

Before any live release:

- re-run local proof on the exact re-cut release lane
- run `npm run seo:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:structure:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:docs:proof` on that exact re-cut release lane and keep it green
- confirm the two Kitsilano scenic queue routes still return `200`
- confirm the two Kitsilano scenic queue routes still show the expected visible correction path, Kitsilano scenic page-to-guide / guide-to-page pairing, local browser-head proof, and guide source-backed section
- confirm hosted `sitemap.xml`, hosted `llms.txt`, hosted canonical, and hosted JSON-LD still remain unverified until the real post-deploy smoke pass happens

## Short Version

- required route and crawl slice: keep Kitsilano scenic only
- mixed shared link surfaces: cherry-pick surgically or defer
- do not broad-copy shared files just because the local branch already contains earlier queues or later routing releases

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
