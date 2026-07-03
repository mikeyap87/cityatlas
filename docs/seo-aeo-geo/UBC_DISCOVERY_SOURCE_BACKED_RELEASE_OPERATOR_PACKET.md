# CityAtlas UBC Discovery Source-Backed Release Operator Packet

## Purpose

Use this as the exact local operator runbook when the owner approves the UBC discovery hosted source-backed CityAtlas release after the first seven hosted queues are already resolved and before the garden-day queue.

This packet does not replace:

- `UBC_DISCOVERY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `UBC_DISCOVERY_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `UBC_DISCOVERY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md`
- `UBC_DISCOVERY_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md`

It translates those docs into one execution order for the live step.

## Status

Local operator-ready only. No deploy, push, hosted smoke, or production mutation was performed while preparing this packet.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Fallback public alias: `https://cityatlas-one.vercel.app`
- Release scope: eighth hosted source-backed queue only

## Intended Change

Promote these two routes together after the first seven queues are live:

- `/vancouver/ubc-discovery-starters`
- `/vancouver/guides/where-should-you-start-a-ubc-adjacent-vancouver-discovery-day`

Along with only the supporting route, crawl, and internal-link updates required for those two routes.

## Current Local Truth Already In Hand

- `npm run seo:proof` passes at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links.
- `npm run seo:structure:proof` passes across `28` key routes, including every currently queued source-backed guide/page pair and the protected noindex routes.
- `npm run seo:docs:proof` passes across `55` packet/doc files.
- Local browser-head proof confirms title, description, robots, canonical, JSON-LD, correction-path links, and the page-to-guide / guide-to-page pairing on both UBC discovery routes.
- Local route checks for the UBC discovery page and UBC discovery guide both return `HTTP/1.1 200 OK` on `http://127.0.0.1:5178`.

## Current Release-Safety Reality From This Workspace

Verified June 15, 2026:

- `git -C /Users/michaelyap/Documents/Codex/Workspace status --short --branch` reports `## No commits yet on codex/guided-onboarding` plus a broadly dirty untracked workspace.
- `git -C /Users/michaelyap/Documents/Codex/Workspace remote -v` returned no configured remotes.
- `node /Users/michaelyap/Documents/Codex/Workspace/univenture/scripts/release-safety-check.mjs --repo /Users/michaelyap/Documents/Codex/Workspace --base origin/main --allow univenture/cityatlas --json` returned `blocked_missing_base_ref`.

Meaning:

- this current workspace copy is not itself a safe release lane
- the UBC discovery hosted queue is approval-ready in docs and local proof only
- the live action still requires a real git checkout or branch that contains the actual CityAtlas live base after the first seven hosted queues

## Exact Release Lane Build Order

1. Refresh the live base after the first seven queues are already live.
   - Identify the real live branch, ref, or commit that matches the public CityAtlas surface after the False Creek culture queue.
   - Do not ship from the current mixed workspace branch.
2. Cut a fresh release lane from that live base.
   - Name it specifically for the UBC discovery queue.
   - Keep the lane limited to the UBC discovery slice.
3. Re-cut only the intended payload.
   - Use `UBC_DISCOVERY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` for the file map.
   - Use `UBC_DISCOVERY_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for shared-file rules.
   - Defer mixed link-only surfaces if isolating them would also ship later queued wedges or the later routing releases.
4. Run the release-safety guard on the exact release lane.
5. Re-run local proof on that exact release lane.
6. Capture the rollback snapshot before deploy.
7. Deploy only after owner approval.
8. Run hosted smoke immediately and roll back if smoke fails.

## Release-Safety Command

Use this on the real release lane after the live base exists locally:

```bash
node /Users/michaelyap/Documents/Codex/Workspace/univenture/scripts/release-safety-check.mjs \
  --repo /Users/michaelyap/Documents/Codex/Workspace \
  --base <live-base-ref-after-false-creek-culture-queue> \
  --allow univenture/cityatlas/src,univenture/cityatlas/public \
  --strict
```

Why this allow list is narrow:

- the live payload should be product and crawl surfaces only
- docs and proof artifacts should not be required for the deploy itself
- if docs need a separate repo sync, treat that as a separate docs lane instead of widening the product release lane

Current known blocker:

- from this workspace state, the same check is blocked until a real `<live-base-ref-after-false-creek-culture-queue>` exists locally and the release work is moved into a clean branch with actual commit history

## Exact Payload Surfaces

Required route and crawl surfaces:

- `src/types.ts`
- `src/data/seed.ts`
- `src/lib/sourceBackedCollections.ts`
- `src/features/public/TrustPages.tsx`
- `src/features/public/GuideDetailPage.tsx`
- `src/app/CityAtlasApp.tsx`
- `public/sitemap.xml`
- `public/llms.txt`

Shared metadata dependencies only if needed by the exact release lane:

- `src/lib/seo.ts`
- `src/components/Seo.tsx`
- `src/config/site.ts`

Mixed shared link surfaces only if isolated cleanly:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/CollectionPages.tsx`

## Exact Local Proof Sequence On The Release Lane

Run in this order on the exact branch that will ship:

```bash
npm run typecheck
npm run build
npm run readiness
npm run seo:proof
npm run seo:structure:proof
npm run seo:docs:proof
```

Then verify local route `200` checks:

```bash
curl -I http://127.0.0.1:5178/vancouver/ubc-discovery-starters
curl -I http://127.0.0.1:5178/vancouver/guides/where-should-you-start-a-ubc-adjacent-vancouver-discovery-day
```

Then verify local browser-head behavior on the same two routes:

- source cards render
- correction links are visible
- the UBC discovery guide section renders
- page-to-guide / guide-to-page pairings remain intact
- route-specific title, description, robots, canonical, and JSON-LD still match expectations

## Rollback Snapshot To Preserve Before Deploy

Keep all of these in the approval log before release:

- hosted deployment on record before this queue: `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3`
- public alias on record: `https://cityatlas-one.vercel.app`
- approved domain on record: `https://city.univenturestudio.com`
- exact live git base used for the release lane once it is identified
- exact deployed state that already includes the first seven hosted queues

## Hosted Smoke Sequence After Deploy

Run immediately after the live release:

1. `curl -I` the two UBC discovery routes and confirm `200`.
2. Check hosted `sitemap.xml` for the UBC discovery source-backed page and guide.
3. Check hosted `llms.txt` for honest route/state wording.
4. Render the UBC discovery source-backed page and guide in a browser and confirm:
   - source cards
   - correction links
   - the UBC discovery guide section
   - matching guide-to-collection links
   - hosted title, description, robots, canonical, and JSON-LD behavior
5. Confirm hosted `/admin`, `/private-preview/date-night`, and `/for-businesses/submit` still keep the expected protected behavior.

## Still Unverified Before The Live Step

- the real live git base after the False Creek culture queue is not available in this workspace checkout
- the release-safety guard cannot yet pass from this workspace state
- hosted rendering after release
- hosted `sitemap.xml` and `llms.txt` after release
- hosted guide-to-collection pairings after release
- hosted canonical, title, description, and JSON-LD behavior after release
- crawl behavior
- indexing movement
- ranking movement

## Approval Needed

`Approve one CityAtlas production release that promotes the local-ready UBC discovery source-backed page and matching guide to city.univenturestudio.com, followed by hosted smoke on the two routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
