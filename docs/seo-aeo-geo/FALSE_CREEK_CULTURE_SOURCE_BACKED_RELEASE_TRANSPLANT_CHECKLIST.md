# False Creek Culture Source-Backed Release Transplant Checklist

## Purpose

Use this when the False Creek culture queued source-backed release is being re-cut from live truth after the earlier six source-backed queues are already resolved.

This file keeps the release copy-safe and prevents accidental pull-in of unrelated queue or routing work.

## Keep

- the `vancouver_false_creek_culture_starters` collection id and metadata
- the `/vancouver/false-creek-culture-starters` route
- the matching guide route
- the five False Creek culture source-backed anchors only
- the specific internal links that expose this wedge on shared public surfaces
- the matching `sitemap.xml` and `llms.txt` entries

## Exclude

- unrelated earlier source-backed queue payloads
- later starter-pack, low-friction, or guide-roundup routing payloads
- any hosted-proof claim not actually re-verified during the release
- any new real-business, rating, review, or pricing claim

## Re-Prove Before Release

- `npm run typecheck`
- `npm run build`
- `npm run seo:proof`
- `npm run seo:structure:proof`
- `npm run seo:docs:proof`
- route reachability for both False Creek culture routes
- local browser-head proof on both False Creek culture routes
- visible correction-path links plus page-to-guide / guide-to-page pairing on both routes
- current hosted smoke after deploy approval

## Hosted Truth Boundary

Do not carry local canonical, metadata, or crawl assumptions forward as if they were hosted proof.

Hosted metadata, `sitemap.xml`, `llms.txt`, and protected-route behavior still need a real smoke pass on `city.univenturestudio.com`.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
