# CityAtlas Returning-Visitor Source-Backed Release Transplant Checklist

## Purpose

Use this when the returning-visitor queued source-backed release is being re-cut from live truth after the earlier source-backed queues are already resolved.

This file translates the current mixed local files into copy-safe rules so the returning-visitor release lane does not accidentally pull in earlier queue payloads or the later starter-pack routing work.

## Hard Scope

Only these two routes belong to the returning-visitor queued release:

- `/vancouver/returning-visitor-starters`
- `/vancouver/guides/vancouver-local-discovery-for-returning-visitors`

## Required Route And Crawl Slice

Treat these as required returning-visitor-queue files, but copy only the portions that belong to the two routes above:

- `src/data/seed.ts`
  - keep the returning-visitor guide content
  - keep the `vancouver_returning_visitor_starters` source-backed entries
  - keep the returning-visitor guide resource-link paths
  - do not automatically bring the starter-pack guide resource-link addition if it would widen the release to a later routing slice
  - do not bring over unrelated source-backed guide or wedge content as part of this returning-visitor release

- `src/lib/sourceBackedCollections.ts`
  - keep the returning-visitor collection metadata
  - keep the guide-to-collection mapping needed for the returning-visitor guide
  - exclude unrelated collection additions unless they are already present on the live base and unchanged

- `src/features/public/TrustPages.tsx`
  - keep the returning-visitor config block and returning-visitor page export
  - exclude unrelated source-backed config blocks and page exports from this release slice

- `src/features/public/GuideDetailPage.tsx`
  - keep the returning-visitor source-backed section copy
  - exclude unrelated guide-source-backed section additions unless they are already present on the live base and unchanged

- `src/app/CityAtlasApp.tsx`
  - keep the route branch for `/vancouver/returning-visitor-starters`
  - exclude unrelated source-backed route branches from this returning-visitor release slice

- `public/sitemap.xml`
  - add only the two returning-visitor URLs
  - do not add unrelated queued URLs in the same release

- `public/llms.txt`
  - add only the returning-visitor route wording that matches what is actually live after release
  - keep the hosted-state wording honest about which source-backed wedges are really public

## Mixed Shared Link Surfaces

These files currently bundle the returning-visitor queue together with earlier wedges and the later starter-pack routing work:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/AboutPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/components/Layout.tsx`

Safe rule:

- cherry-pick only the returning-visitor link additions if they can be isolated cleanly on the release lane
- if isolating them would also ship starter-pack or unrelated wedge links, defer these link-only surfaces instead of widening the release

Why deferral is acceptable:

- the two returning-visitor queue routes are still reachable through direct URLs, guide links, the route pages themselves, `sitemap.xml`, and `llms.txt`
- link-only surface deferral is safer than quietly publishing unrelated queued work at the same time

## Shared Infrastructure Rule

Treat these as shared dependencies, not returning-visitor-queue content by default:

- `src/lib/seo.ts`
- `src/components/Seo.tsx`
- `src/config/site.ts`
- `src/styles/responsive.css`

Only move them if the live base genuinely needs a returning-visitor route metadata or narrow-screen fix that is already locally proven. Do not widen the release with unrelated SEO or responsive infrastructure changes.

## Proof Rule Before Any Live Action

Before any live release:

- re-run local proof on the exact re-cut release lane
- run `npm run seo:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:structure:proof` on that exact re-cut release lane and keep it green
- run `npm run seo:docs:proof` on that exact re-cut release lane and keep it green
- confirm the two returning-visitor queue routes still return `200`
- confirm the two returning-visitor queue routes still show the expected visible correction path, returning-visitor page-to-guide / guide-to-page pairing, local browser-head proof, and guide source-backed section
- preserve the current returning-visitor narrow-screen proof result while re-cutting the release slice so the local mobile state does not regress
- confirm hosted `sitemap.xml`, hosted `llms.txt`, hosted canonical, and hosted JSON-LD still remain unverified until the real post-deploy smoke pass happens

## Short Version

- required route and crawl slice: keep returning-visitor only
- mixed shared link surfaces: cherry-pick surgically or defer
- starter-pack guide carryover: optional, not required
- do not broad-copy shared files just because the local branch already contains earlier queues or the later starter-pack routing release

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
