# CityAtlas Returning-Visitor Source-Backed Release Operator Packet

## Purpose

Use this as the exact local operator runbook when the owner approves the returning-visitor hosted source-backed CityAtlas release after the first three hosted queues are already resolved and before the later Kitsilano queue.

This packet does not replace:

- `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md`
- `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md`

It translates those docs into one execution order for the live step.

## Status

Local operator-ready only. No deploy, push, hosted smoke, or production mutation was performed while preparing this packet.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Fallback public alias: `https://cityatlas-one.vercel.app`
- Release scope: fourth hosted source-backed queue only

## Intended Change

Promote these two routes together after the first three queues are live:

- `/vancouver/returning-visitor-starters`
- `/vancouver/guides/vancouver-local-discovery-for-returning-visitors`

Along with only the supporting route, crawl, and internal-link updates required for those two routes.

## Current Local Truth Already In Hand

- `npm run seo:proof` passes at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links.
- `npm run seo:structure:proof` passes across `33` key routes, including every currently queued source-backed guide/page pair, the starter-pack, low-friction, and guide-roundup routing guides, `/vancouver/missions`, `/for-businesses/pricing`, the protected noindex routes, and the exact featured city-hub plus guide-hub ItemList paths.
- `npm run seo:docs:proof` passes with zero approval-doc truth failures.
- `npm run seo:smoke:returning` passes on the local preview base and verifies the two returning-visitor routes plus `/for-businesses/submit`, route-level title/robots/canonical/JSON-LD behavior, pairing fragments, `sitemap.xml`, and `llms.txt`.
- Local browser-head proof confirms title, description, robots, canonical, JSON-LD, correction-path links, and the page-to-guide / guide-to-page pairing on both returning-visitor routes.
- Local route checks for the returning-visitor page and returning-visitor guide both return `HTTP/1.1 200 OK` on `http://127.0.0.1:5178`.
- Local `/admin` and `/private-preview/date-night` still stay in founder-only mode on the preview base, so the hosted guard-notice assertions remain intentionally reserved for the real hosted-domain smoke pass.

## Current Release-Safety Reality From This Workspace

Verified June 15, 2026:

- `git -C /Users/michaelyap/Documents/Codex/Workspace status --short --branch` reports `## No commits yet on codex/guided-onboarding` plus a broadly dirty untracked workspace.
- `git -C /Users/michaelyap/Documents/Codex/Workspace remote -v` returned no configured remotes.
- `node /Users/michaelyap/Documents/Codex/Workspace/univenture/scripts/release-safety-check.mjs --repo /Users/michaelyap/Documents/Codex/Workspace --base origin/main --allow univenture/cityatlas --json` returned `blocked_missing_base_ref`.

Meaning:

- this current workspace copy is not itself a safe release lane
- the returning-visitor hosted queue is approval-ready in docs and local proof only
- the live action still requires a real git checkout or branch that contains the actual CityAtlas live base after the first three hosted queues

## Exact Release Lane Build Order

1. Refresh the live base after the first three queues are already live.
   - Identify the real live branch, ref, or commit that matches the public CityAtlas surface after the Sunday queue.
   - Do not ship from the current mixed workspace branch.
2. Cut a fresh release lane from that live base.
   - Name it specifically for the returning-visitor queue.
   - Keep the lane limited to the returning-visitor slice.
3. Re-cut only the intended payload.
   - Use `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` for the file map.
   - Use `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for shared-file rules.
   - Defer mixed link-only surfaces if isolating them would also ship later queued wedges or the starter-pack routing release.
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
  --base <live-base-ref-after-sunday-queue> \
  --allow univenture/cityatlas/src,univenture/cityatlas/public \
  --strict
```

Why this allow list is narrow:

- the live payload should be product and crawl surfaces only
- docs and proof artifacts should not be required for the deploy itself
- if docs need a separate repo sync, treat that as a separate docs lane instead of widening the product release lane

Current known blocker:

- from this workspace state, the same check is blocked until a real `<live-base-ref-after-sunday-queue>` exists locally and the release work is moved into a clean branch with actual commit history

## Exact Payload Surfaces

Required route and crawl surfaces:

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
- `src/styles/responsive.css`

Mixed shared link surfaces only if isolated cleanly:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/features/public/AboutPage.tsx`
- `src/components/Layout.tsx`

## Exact Local Proof Sequence On The Release Lane

Run in this order on the exact branch that will ship:

```bash
npm run typecheck
npm run build
npm run readiness
npm run seo:proof:stack
npm run seo:proof
npm run seo:structure:proof
npm run seo:docs:proof
npm run seo:smoke:returning
```

Then keep one lightweight direct local reachability check for the two queue routes:

```bash
curl -I http://127.0.0.1:5178/vancouver/returning-visitor-starters
curl -I http://127.0.0.1:5178/vancouver/guides/vancouver-local-discovery-for-returning-visitors
```

The smoke command is the preferred local browser-head check because it renders the DOM and verifies:

- the returning-visitor page / guide pairing fragments on both routes
- route-specific title, description, robots, canonical, and JSON-LD behavior
- local `sitemap.xml` coverage for the returning-visitor queue
- local `llms.txt` coverage for the returning-visitor queue
- `/for-businesses/submit` staying noindex

Manual browser review is still useful for visual sanity on the same two routes:

- source cards render
- correction links are visible
- the returning-visitor guide section renders
- page-to-guide / guide-to-page pairings remain intact
- the local narrow-screen state still stays readable after the release slice is re-cut

## Rollback Snapshot To Preserve Before Deploy

Keep all of these in the approval log before release:

- hosted deployment on record before this queue: `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3`
- public alias on record: `https://cityatlas-one.vercel.app`
- approved domain on record: `https://city.univenturestudio.com`
- exact live git base used for the release lane once it is identified
- exact deployed state that already includes the first three hosted queues

## Hosted Smoke Sequence After Deploy

Run immediately after the live release:

1. Run `npm run seo:smoke:returning -- --base-url=https://city.univenturestudio.com`.
2. Review the automated smoke output and confirm hosted `sitemap.xml`, hosted `llms.txt`, route-level metadata behavior, and the protected-route expectations all passed.
3. Render the returning-visitor source-backed page and guide in a browser and confirm:
   - source cards
   - correction links
   - the returning-visitor guide section
   - matching guide-to-collection links
4. Confirm hosted `/admin`, `/private-preview/date-night`, and `/for-businesses/submit` still keep the expected protected behavior if anything looks off in the automated smoke output.

## Still Unverified Before The Live Step

- the real live git base after the Sunday queue is not available in this workspace checkout
- the release-safety guard cannot yet pass from this workspace state
- hosted rendering after release
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-to-collection pairings after release
- hosted canonical, title, description, and JSON-LD behavior after release
- crawl behavior
- indexing movement
- ranking movement

## Approval Needed

`Approve one CityAtlas production release that promotes the local-ready returning-visitor source-backed page and matching guide to city.univenturestudio.com, followed by hosted smoke on the two routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
