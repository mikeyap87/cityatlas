# False Creek Culture Source-Backed Release Slice Handoff

## Purpose

This handoff isolates the seventh hosted source-backed release slice for the False Creek culture wedge.

Use it to keep the release narrow and prevent earlier wedges or later routing pages from drifting into the same deploy by accident.

Use `docs/seo-aeo-geo/FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live gate for this slice before any deploy approval.

## Routes In Scope

- `/vancouver/false-creek-culture-starters`
- `/vancouver/guides/where-should-you-start-a-false-creek-vancouver-culture-afternoon`

## Local Proof Already Recorded

- `npm run typecheck` passed
- `npm run build` passed
- `npm run seo:proof` now passes at the current local ranking surface of `37` useful pieces: `23` guides plus `14` source-backed wedge collections
- current machine truth also includes `70` source-backed anchors and `14` mapped guide-to-collection links
- `npm run seo:structure:proof` now passes and includes the False Creek culture source-backed page plus matching guide in the checked route set
- `npm run seo:docs:proof` now passes and keeps the queued release packet set aligned to current truth
- `npm run readiness` passed after the new wedge
- both routes returned `HTTP/1.1 200 OK` on `127.0.0.1:5178`
- local browser-head proof now covers the two False Creek culture routes and confirms title, description, robots, canonical, JSON-LD, correction-path links, and the page-to-guide / guide-to-page pairing

## Files Intended To Move With This Slice

- `src/types.ts`
- `src/lib/sourceBackedCollections.ts`
- `src/lib/seo.ts`
- `src/components/Seo.tsx`
- `src/config/site.ts`
- `src/data/seed.ts`
- `src/app/CityAtlasApp.tsx`
- `src/features/public/TrustPages.tsx`
- `src/features/public/GuideDetailPage.tsx`
- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `public/sitemap.xml`
- `public/llms.txt`

## Shared-Surface Caveat

The homepage, Vancouver city page, guide library, crawl files, and shared source-backed helpers are mixed surfaces.

If this queue is re-cut from live truth later, keep only the parts required for:

- the new collection id and metadata
- the new guide and five new source-backed anchors
- the two new routes
- the specific new internal links and trust-surface buttons for this wedge

Do not pull unrelated queue work just because those files are shared.

## Hosted Proof Still Missing

- hosted route rendering on `city.univenturestudio.com`
- hosted `sitemap.xml` and `llms.txt`
- hosted guide-to-collection link pairing
- hosted title, description, robots, canonical, and JSON-LD behavior
- crawl or indexing proof

## Approval Boundary

This file is release truth only.

It does not authorize deploys, pushes, hosted writes, or indexing submissions without explicit owner approval.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
