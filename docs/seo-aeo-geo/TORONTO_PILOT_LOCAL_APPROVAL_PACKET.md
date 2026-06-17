# Toronto Pilot Local Approval Packet

## Status

Local-ready only. Not deployed, not submitted for indexing in this batch, and not yet verified on the hosted public domain.

## What This Batch Adds

- `/toronto/guides`
- `/toronto/first-time-visitor-starters`
- `/toronto/guides/where-should-a-first-time-toronto-visitor-start`
- `/toronto/weekend-route-starters`
- `/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`
- Internal links from the homepage, guide-library, secondary-city surface, About page, and footer
- Local crawl/context updates in `sitemap.xml` and `llms.txt`

## Why This Cluster Exists

CityAtlas is already beyond the original Vancouver-only starter surface locally, but the first non-Vancouver release still needs to stay narrow and source-backed.

This Toronto cluster stays narrow on purpose:

- it answers two connected Toronto questions instead of trying to fake a complete city shell
- it keeps the first-time visitor problem separate from the weekend-route problem
- it uses official public sources instead of rankings, scraped lists, or generic must-see copy
- it keeps the correction path visible at `/editorial-standards`

## Official Sources Used

Checked June 16, 2026.

### Toronto first-time visitor starters

1. Distillery District official site
2. St. Lawrence Market official site
3. Harbourfront Centre official site
4. Royal Ontario Museum official site
5. Art Gallery of Ontario official site

### Toronto weekend-route starters

1. STACKT market official site
2. Toronto Music Garden official venue page
3. The Bentway official site
4. Evergreen Brick Works official site
5. Toronto Botanical Garden official site

## Claim Boundaries

- This cluster does not claim one universal best Toronto starting area or one universal best Toronto weekend route.
- This cluster does not publish review scores, rankings, or unsupported neighborhood authority.
- This cluster does not claim live pricing, live event schedules, crowd guarantees, or city completeness.
- This cluster only uses real-place facts where an official public source supports the narrow starter-page framing.

## Current Local Machine Truth

- `41` useful pieces
- `25` answer-first guides
- `16` source-backed wedge collections
- `80` source-backed place anchors
- `16` mapped guide-to-collection links
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page

## Toronto Rollout Truth

- Toronto status: `Prepared`
- Toronto progress: `100%`
- Toronto queue: `26` unique prospects
- Toronto partner-eligible rows: `22`
- Toronto anchor-only rows: `4`
- Toronto contact-ready rows: `16`
- Toronto email-ready rows: `16`
- Toronto source-backed collections: `2`
- Toronto answer-first guides: `2`
- Toronto next action: keep the city queue review-first, widen partner candidates carefully, and only add new anchors when they strengthen public city guidance

## Local Release Criteria For This Batch

- `npm run typecheck`
- `npm run build`
- `npm run growth:verify`
- `npm run seo:proof:stack`
- `npm run seo:structure:proof`
- `npm run seo:copy:proof`
- `npm run seo:copy:rendered:proof`
- `npm run qa:smoke:local`
- local verification that `sitemap.xml` and `llms.txt` expose all five Toronto routes
- local browser proof that the Toronto guide hub, both starter pages, and both matching guides render the expected route content and route-specific metadata behavior

## Local Verification Completed

Completed June 16, 2026 on current repo truth.

- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run growth:verify` passed and keeps Toronto at `26` unique prospects, `22` partner-eligible rows, `16` contact-ready rows, `16` email-ready rows, `2` source-backed collections, and `2` answer-first guides.
- `npm run seo:proof:stack` passed and kept the aggregate local stack green at `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, `16` mapped guide-to-collection links, and `38` checked routes.
- `npm run seo:structure:proof` passed and explicitly covers `/toronto/guides`, `/toronto/first-time-visitor-starters`, `/toronto/guides/where-should-a-first-time-toronto-visitor-start`, `/toronto/weekend-route-starters`, and `/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`.
- `npm run seo:copy:proof` passed with zero public-copy findings, so the checked public surface still does not leak blocked internal/operator language.
- `npm run seo:copy:rendered:proof` passed with zero rendered public-copy findings across the crawlable local routes, so the current rendered public surface also stays free of blocked internal/operator language.
- `npm run qa:smoke:local` passed with the Toronto checks included:
  - desktop Toronto pilot navigation
  - desktop Toronto weekend navigation
  - mobile Toronto pilot render
  - mobile Toronto weekend render
- Local `sitemap.xml` includes all five Toronto routes.
- Local `llms.txt` includes the Toronto guide hub, first-time visitor starter page, first-time visitor guide, weekend-route starter page, and weekend-route guide.

## Hosted Blocker Already Verified

The current hosted blocker is not hypothetical.

- `npm run seo:smoke:toronto -- --base-url https://city.univenturestudio.com` failed on June 16, 2026.
- The hosted `/toronto/*` routes currently return the Vancouver homepage shell instead of the Toronto surfaces.
- Hosted `sitemap.xml` does not yet include the Toronto routes.
- Hosted `llms.txt` does not yet include the Toronto routes.
- The current hosted artifact is `output/seo/hosted-smoke-toronto-pilot.json`.

## Metadata And Canonical Caveat

- The recorded metadata proof for this cluster is local-only.
- It reflects the configured local base URL behavior for the current local surface.
- Hosted title, canonical, and JSON-LD behavior for the Toronto routes still need real smoke proof on `city.univenturestudio.com` after release.

## Still Unverified

- Hosted rendering on `city.univenturestudio.com`
- Hosted `sitemap.xml` and `llms.txt` after release
- Hosted guide-hub to starter-page and guide-to-page pairing after release
- Hosted canonical and JSON-LD behavior on `city.univenturestudio.com`
- Search-engine crawl behavior after release
- Search Console indexing movement after release
- Ranking movement

## Approval Boundary

If local proof stays clean, the next live action is the separate Toronto hosted-release approval described in `TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md` and `TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md`.

That approval should cover deploy scope, rollback target, and hosted post-release smoke for the five Toronto routes plus the live crawl files.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
