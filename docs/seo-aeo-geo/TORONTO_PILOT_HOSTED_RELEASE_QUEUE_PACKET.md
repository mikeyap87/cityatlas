# CityAtlas Toronto Pilot Hosted Release Queue Packet

## Status

Local-ready only. Nothing in this packet has been deployed, pushed, submitted for indexing in this batch, or verified on the hosted public domain as a Toronto release.

Use `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md` as the exact live-release gate before any deploy approval.
Use `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_OPERATOR_PACKET.md` as the exact local execution runbook once a live release is approved.
Use `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_SLICE_HANDOFF.md` for the exact Toronto file map and `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe re-cut rules.

## What This Queue Covers

Release these five routes together only after owner approval for the first non-Vancouver public city release:

- `/toronto/guides`
- `/toronto/first-time-visitor-starters`
- `/toronto/guides/where-should-a-first-time-toronto-visitor-start`
- `/toronto/weekend-route-starters`
- `/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`

Supporting local updates already included in this queue:

- the required Toronto route support inside shared files
- internal links from the homepage, guide-library, secondary-city surface, About page, and footer
- honest local crawl/context updates in `sitemap.xml` and `llms.txt`
- owner-readable local approval proof for the Toronto cluster

## Why This Cluster Goes Next

Toronto is the strongest next city because it is the only follow-on city that already clears the local prepared threshold while also having a real source-backed guide cluster instead of just business rows.

This queue is the cleanest next live-ranking move because it:

- answers two high-intent Toronto questions without faking city completeness
- strengthens second-city entity clarity instead of adding more thin Vancouver volume
- already has the guide-hub plus two starter-guide pairs wired into internal links and crawl files locally
- uses official public sources with visible correction paths

Current local Toronto truth:

- `26` unique prospects
- `22` partner-eligible rows
- `16` contact-ready rows
- `16` email-ready rows
- `2` source-backed wedge collections
- `2` answer-first guides

## Official Sources Used

Checked June 16, 2026.

### First-time visitor starter sources

1. Distillery District official site
2. St. Lawrence Market official site
3. Harbourfront Centre official site
4. Royal Ontario Museum official site
5. Art Gallery of Ontario official site

### Weekend-route starter sources

1. STACKT market official site
2. Toronto Music Garden official venue page
3. The Bentway official site
4. Evergreen Brick Works official site
5. Toronto Botanical Garden official site

## Content Gate Decision

`Ship after separate live deploy approval`

Why this Toronto queue passes the local gate:

- the audience and query class are clear
- the openings stay answer-first and route-led
- the starter pages avoid fake best-of language
- official source, checked date, and correction path are visible
- the guide hub, first-time visitor guide, and weekend guide all point to useful next steps instead of generic travel filler

## Verified Locally

- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run growth:verify` passed and keeps Toronto at `26` unique prospects, `22` partner-eligible rows, `16` contact-ready rows, `16` email-ready rows, `2` source-backed collections, and `2` answer-first guides.
- `npm run seo:proof:stack` passed for the current local machine at `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, `16` mapped guide-to-collection links, and `38` checked routes.
- `npm run seo:structure:proof` passes across the current route structure and explicitly includes the Toronto guide hub, both Toronto starter pages, and both Toronto guides.
- `npm run seo:copy:proof` passed with zero public-copy findings.
- `npm run seo:copy:rendered:proof` passed with zero rendered public-copy findings across the current crawlable local routes.
- `npm run qa:smoke:local` passed and rendered the Toronto pilot and weekend flows on both desktop and mobile.
- Local `sitemap.xml` includes all five Toronto routes.
- Local `llms.txt` includes all five Toronto routes.

## Exact Hosted Blocker Already In Hand

The current live issue is already defined by read-only hosted smoke, not by guesswork.

From `output/seo/hosted-smoke-toronto-pilot.json` on June 16, 2026:

- hosted `/toronto/guides` returned the Vancouver homepage title instead of `Toronto Guides | CityAtlas`
- hosted `/toronto/first-time-visitor-starters` returned the Vancouver homepage title instead of the Toronto starter title
- hosted `/toronto/guides/where-should-a-first-time-toronto-visitor-start` returned the Vancouver homepage title instead of the Toronto guide title
- hosted `BreadcrumbList`, `CollectionPage`, `BlogPosting`, and `FAQPage` JSON-LD expectations were missing on the Toronto routes because the live Toronto pages were not actually there
- hosted `sitemap.xml` was missing the Toronto routes
- hosted `llms.txt` was missing the Toronto routes

Short version:

- the live domain still falls back to the Vancouver shell for `/toronto/*`
- the live crawl files do not yet expose the Toronto cluster

## Still Unverified

- hosted rendering of the five Toronto routes on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-hub, starter-page, and guide pairings after release
- hosted canonical and JSON-LD behavior after release
- post-release crawl behavior
- indexing movement
- ranking movement

## Hosted Smoke Plan After Approval

If a live deploy is approved, verify in this order:

1. run `npm run seo:smoke:toronto -- --base-url=https://city.univenturestudio.com`
2. review the automated smoke output and confirm hosted `sitemap.xml`, hosted `llms.txt`, route-level metadata behavior, and protected-route expectations all passed
3. render the Toronto guide hub, both Toronto starter pages, and both Toronto guides in a browser and confirm:
   - the Toronto titles render instead of the Vancouver shell
   - source cards and correction links are visible
   - guide-hub and page-to-guide / guide-to-page pairings are intact
4. confirm `/admin` and `/private-preview/date-night` still behave as protected hosted routes and `/for-businesses/submit` still stays noindex if anything looks off in the automated smoke output

## Rollback Boundary

If the deploy is approved but Toronto hosted smoke fails, roll back to the last known good production build and keep the Toronto cluster local-only until the issue is fixed.

Do not widen the rollback into DNS, billing, provider, or outreach changes as part of this release.

## Exact Approval Sentence

`Approve one CityAtlas production release that promotes the Toronto guide hub, first-time visitor starter page and guide, and weekend-route starter page and guide to city.univenturestudio.com, followed by hosted smoke on the five Toronto routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
