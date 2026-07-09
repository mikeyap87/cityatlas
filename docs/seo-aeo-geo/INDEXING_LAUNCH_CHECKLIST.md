# CityAtlas Indexing Launch Checklist

Public indexing was approved and released on 2026-06-14. Keep this file as the record of what had to be true and what is now live.

## What Must Be True First

1. The owner approves public indexing.
2. The strongest draft guide is upgraded from demo structure to real source-backed content.
3. Real business/source policy is approved.
4. Legal/privacy/terms posture is acceptable for public crawlable release.
5. The hosted surface is reviewed on the final intended domain.

## Local-Only Proof To Complete Before Live Flip

- Homepage clearly answers what CityAtlas is.
- `/about` clearly explains category, audience, trust model, and use cases.
- Guide cluster pages exist for the first ranking wedge.
- Internal links connect homepage, guides, missions, planner, and business pages.
- `sitemap.xml` includes intended public pages.
- `llms.txt` reflects the public entity accurately.
- No private, admin, or founder-only routes are publicly exposed.

## Exact Live Actions Completed

- flipped `robots.txt` from blocked to the approved public posture
- deployed the approved build to production
- confirmed canonical base behavior on the intended live domain
- left sitemap submission as an optional next step after release

## Exact Owner Approval Received

"Approve the CityAtlas public indexing release: deploy the current approved build, switch robots from blocked to public, and make the approved domain crawlable for search."

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
