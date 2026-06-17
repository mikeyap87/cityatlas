# CityAtlas Second Source-Backed Release Operator Packet

## Purpose

Use this as the exact local operator runbook when the owner approves the second hosted source-backed CityAtlas release after the first queue is already resolved.

This packet does not replace:

- `SECOND_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `SECOND_SOURCE_BACKED_RELEASE_GO_NO_GO_CHECKLIST.md`
- `SECOND_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md`
- `SECOND_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md`

It translates those docs into one execution order for the live step.

## Status

Local operator-ready only. No deploy, push, hosted smoke, or production mutation was performed while preparing this packet.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Fallback public alias: `https://cityatlas-one.vercel.app`
- Release scope: second hosted source-backed queue only

## Intended Change

Promote these four routes together after the first queue is live:

- `/vancouver/out-of-town-guest-starters`
- `/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver`
- `/vancouver/weekend-route-starters`
- `/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day`

Along with only the supporting route, crawl, and internal-link updates required for those four routes.

## Current Local Truth Already In Hand

- `npm run seo:proof` passes at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links.
- all `23` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` passes across `33` key routes, including every currently queued source-backed guide/page pair, the starter-pack, low-friction, and guide-roundup routing guides, `/vancouver/missions`, `/for-businesses/pricing`, the protected noindex routes, and the exact featured city-hub plus guide-hub ItemList paths.
- `npm run seo:docs:proof` passes with zero approval-doc truth failures.
- `npm run seo:smoke:second` passes on the local preview base and verifies the four second-queue routes plus `/for-businesses/submit`, route-level title/robots/canonical/JSON-LD behavior, pairing fragments, `sitemap.xml`, and `llms.txt`.
- Local browser-head proof confirms title, description, robots, canonical, JSON-LD, correction-path links, and the page-to-guide / guide-to-page pairing on all four second-queue routes.
- Local route checks for the out-of-town guest page, out-of-town guest guide, weekend-route page, and weekend-route guide all return `HTTP/1.1 200 OK` on `http://127.0.0.1:5178`.
- Local `/admin` and `/private-preview/date-night` still stay in founder-only mode on the preview base, so the hosted guard-notice assertions remain intentionally reserved for the real hosted-domain smoke pass.

## Current Release-Safety Reality From This Workspace

Verified June 15, 2026:

- `git -C /Users/michaelyap/Documents/Codex/Workspace status --short --branch` reports `## No commits yet on codex/guided-onboarding` plus a broadly dirty untracked workspace.
- `git -C /Users/michaelyap/Documents/Codex/Workspace remote -v` returned no configured remotes.
- `node /Users/michaelyap/Documents/Codex/Workspace/univenture/scripts/release-safety-check.mjs --repo /Users/michaelyap/Documents/Codex/Workspace --base origin/main --allow univenture/cityatlas --json` returned `blocked_missing_base_ref`.

Meaning:

- this current workspace copy is not itself a safe release lane
- the second hosted queue is approval-ready in docs and local proof only
- the live action still requires a real git checkout or branch that contains the actual CityAtlas live base

## Exact Release Lane Build Order

1. Refresh the live base after the first queue is already live.
   - Identify the real live branch, ref, or commit that matches the public CityAtlas surface after the first hosted queue.
   - Do not ship from the current mixed workspace branch.
2. Cut a fresh release lane from that live base.
   - Name it specifically for the second queue.
   - Keep the lane limited to the out-of-town guest plus weekend-route slice.
3. Re-cut only the intended payload.
   - Use `SECOND_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` for the file map.
   - Use `SECOND_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for shared-file rules.
   - Defer mixed link-only surfaces if isolating them would also ship later queued wedges.
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
  --base <live-base-ref-after-first-queue> \
  --allow univenture/cityatlas/src,univenture/cityatlas/public \
  --strict
```

Why this allow list is narrow:

- the live payload should be product and crawl surfaces only
- docs and proof artifacts should not be required for the deploy itself
- if docs need a separate repo sync, treat that as a separate docs lane instead of widening the product release lane

Current known blocker:

- from this workspace state, the same check is blocked until a real `<live-base-ref-after-first-queue>` exists locally and the release work is moved into a clean branch with actual commit history

## Exact Payload Surfaces

Required route and crawl surfaces:

- `src/data/seed.ts`
- `src/lib/sourceBackedCollections.ts`
- `src/features/public/TrustPages.tsx`
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
npm run seo:smoke:second
```

Then keep one lightweight direct local reachability check for the four queue routes:

```bash
curl -I http://127.0.0.1:5178/vancouver/out-of-town-guest-starters
curl -I http://127.0.0.1:5178/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver
curl -I http://127.0.0.1:5178/vancouver/weekend-route-starters
curl -I http://127.0.0.1:5178/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day
```

The smoke command is the preferred local browser-head check because it renders the DOM and verifies:

- source-backed page / guide pair fragments on all four second-queue routes
- route-specific title, description, robots, canonical, and JSON-LD behavior
- local `sitemap.xml` coverage for the second queue
- local `llms.txt` coverage for the second queue
- `/for-businesses/submit` staying noindex

Manual browser review is still useful for visual sanity on the same four routes:

- source cards render
- correction links are visible
- guide rail sections render
- page-to-guide / guide-to-page pairings remain intact

## Rollback Snapshot To Preserve Before Deploy

Keep all of these in the approval log before release:

- hosted deployment on record before this queue: `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3`
- public alias on record: `https://cityatlas-one.vercel.app`
- approved domain on record: `https://city.univenturestudio.com`
- exact live git base used for the release lane once it is identified
- exact deployed state that already includes the first hosted queue

## Hosted Smoke Sequence After Deploy

Run immediately after the live release:

1. Run `npm run seo:smoke:second -- --base-url=https://city.univenturestudio.com`.
2. Review the automated smoke output and confirm hosted `sitemap.xml`, hosted `llms.txt`, route-level metadata behavior, and the protected-route expectations all passed.
3. Render the two source-backed pages and two guides in a browser and confirm:
   - source cards
   - correction links
   - guide rail sections
   - matching guide-to-collection links
4. Confirm hosted `/admin`, `/private-preview/date-night`, and `/for-businesses/submit` still keep the expected protected behavior if anything looks off in the automated smoke output.

## Still Unverified Before The Live Step

- the real live git base after the first queue is not available in this workspace checkout
- the release-safety guard cannot yet pass from this workspace state
- hosted rendering after release
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-to-collection pairings after release
- hosted canonical and JSON-LD behavior after release
- crawl behavior
- indexing movement
- ranking movement

## Approval Needed

`Approve one CityAtlas production release that promotes the local-ready out-of-town guest and weekend-route source-backed pages plus their guide updates to city.univenturestudio.com, followed by hosted smoke on the four routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
