# CityAtlas Toronto Pilot Hosted Release Operator Packet

## Purpose

Use this as the exact local operator runbook when the owner approves the first non-Vancouver CityAtlas release.

This packet does not replace:

- `TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md`
- `TORONTO_PILOT_HOSTED_RELEASE_SLICE_HANDOFF.md`
- `TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md`
- `TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `TORONTO_PILOT_LOCAL_APPROVAL_PACKET.md`

It translates those docs into one execution order for the live step.

## Status

Local operator-ready only. No deploy, push, hosted smoke, or production mutation was performed while preparing this packet.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Release scope: first non-Vancouver Toronto pilot cluster only

## Intended Change

Promote these five Toronto routes together:

- `/toronto/guides`
- `/toronto/first-time-visitor-starters`
- `/toronto/guides/where-should-a-first-time-toronto-visitor-start`
- `/toronto/weekend-route-starters`
- `/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`

Along with only the supporting route, crawl, and internal-link updates required for those five routes.

## Current Local Truth Already In Hand

- `npm run typecheck` passes.
- `npm run build` passes.
- `npm run growth:verify` passes and Toronto is already `Prepared` at `26` unique prospects, `22` partner-eligible rows, `16` contact-ready rows, `16` email-ready rows, `2` source-backed collections, and `2` answer-first guides.
- `npm run seo:proof:stack` passes at `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `38` checked routes.
- `npm run seo:structure:proof` passes across the current key route set, including the Toronto guide hub plus both Toronto starter-guide pairs.
- `npm run seo:copy:proof` passes with zero public-copy findings.
- `npm run seo:copy:rendered:proof` passes with zero rendered public-copy findings across the current crawlable local routes.
- `npm run qa:smoke:local` passes and explicitly covers the Toronto pilot and Toronto weekend flows on desktop and mobile.
- Local `sitemap.xml` and `llms.txt` already include all five Toronto routes.

## Current Hosted Blocker In Hand

Verified by `output/seo/hosted-smoke-toronto-pilot.json` on June 16, 2026:

- hosted `/toronto/*` routes still render the Vancouver homepage shell
- hosted Toronto JSON-LD expectations fail because the Toronto surfaces are not yet live
- hosted `sitemap.xml` is still missing the Toronto routes
- hosted `llms.txt` is still missing the Toronto routes

Meaning:

- the Toronto packet is approval-ready in local proof only
- the live step still requires a fresh release lane and hosted smoke

## Exact Payload Surfaces

Required route and crawl sources:

- `src/data/seed.ts`
- `src/types.ts`
- `src/lib/sourceBackedCollections.ts`
- `src/features/public/GuideDetailPage.tsx`
- `src/features/public/TrustPages.tsx`
- `src/features/public/HomePage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/features/public/SecondaryCityGuidesPage.tsx`
- `src/features/public/AboutPage.tsx`
- `src/components/Layout.tsx`
- `public/sitemap.xml`
- `public/llms.txt`

Shared metadata dependencies only if needed by the exact release lane:

- `src/lib/seo.ts`
- `src/components/Seo.tsx`
- `src/config/site.ts`

## Exact Local Proof Sequence On The Release Lane

Run in this order on the exact branch that will ship:

```bash
npm run typecheck
npm run build
npm run growth:verify
npm run seo:proof:stack
npm run seo:structure:proof
npm run seo:copy:proof
npm run seo:copy:rendered:proof
npm run qa:smoke:local
```

Then keep one lightweight direct local check for the five Toronto routes:

```bash
curl -I http://127.0.0.1:5178/toronto/guides
curl -I http://127.0.0.1:5178/toronto/first-time-visitor-starters
curl -I http://127.0.0.1:5178/toronto/guides/where-should-a-first-time-toronto-visitor-start
curl -I http://127.0.0.1:5178/toronto/weekend-route-starters
curl -I http://127.0.0.1:5178/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day
```

## Rollback Snapshot To Preserve Before Deploy

Keep all of these in the approval log before release:

- the exact current live deployment serving `https://city.univenturestudio.com`
- the current live crawlable Vancouver-first state before Toronto is added
- the hosted smoke artifact showing the current Toronto failure mode:
  - `output/seo/hosted-smoke-toronto-pilot.json`

## Hosted Smoke Sequence After Deploy

Run immediately after the live release:

1. Run `npm run seo:smoke:toronto -- --base-url=https://city.univenturestudio.com`.
2. Review the automated smoke output and confirm hosted `sitemap.xml`, hosted `llms.txt`, route-level metadata behavior, and protected-route expectations all passed.
3. Render the Toronto guide hub, both Toronto starter pages, and both Toronto guides in a browser and confirm:
   - Toronto titles render instead of the Vancouver shell
   - source cards
   - correction links
   - guide-hub links and matching page-to-guide / guide-to-page pairings
4. Confirm hosted `/admin`, `/private-preview/date-night`, and `/for-businesses/submit` still keep the expected protected behavior if anything looks off in the automated smoke output.

## Still Unverified Before The Live Step

- hosted rendering after release
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-hub and route pairings after release
- hosted canonical and JSON-LD behavior after release
- crawl behavior
- Search Console indexing movement
- ranking movement

## Approval Needed

`Approve one CityAtlas production release that promotes the Toronto guide hub, first-time visitor starter page and guide, and weekend-route starter page and guide to city.univenturestudio.com, followed by hosted smoke on the five Toronto routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
