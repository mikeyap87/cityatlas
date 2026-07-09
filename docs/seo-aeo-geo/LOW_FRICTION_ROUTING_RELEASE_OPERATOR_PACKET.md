# CityAtlas Low-Friction Routing Release Operator Packet

## Purpose

Use this as the exact local operator runbook when the owner approves the low-friction routing CityAtlas release after the starter-pack routing release is already resolved.

This packet does not replace:

- `LOW_FRICTION_ROUTING_RELEASE_QUEUE_PACKET.md`
- `LOW_FRICTION_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md`
- `LOW_FRICTION_ROUTING_RELEASE_SLICE_HANDOFF.md`
- `LOW_FRICTION_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md`

It translates those docs into one execution order for the live step.

## Status

Local operator-ready only. No deploy, push, hosted smoke, or production mutation was performed while preparing this packet.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Fallback public alias: `https://cityatlas-one.vercel.app`
- Release scope: low-friction routing release only

## Intended Change

Promote this route after the nine hosted source-backed queues and the starter-pack routing release are live:

- `/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today`

Along with only the supporting route, crawl, and internal-link updates required for that guide.

## Current Local Truth Already In Hand

- `npm run seo:proof` passes at `37` useful pieces, `23` guides, `14` source-backed wedge collections, `70` source-backed anchors, and `14` mapped guide-to-collection links.
- `npm run seo:structure:proof` passes across `33` key routes, including every currently queued source-backed guide/page pair, the three later routing guides, `/vancouver/missions`, `/for-businesses/pricing`, and the protected noindex routes.
- `npm run seo:docs:proof` passes across `64` packet/doc files.
- Local route proof confirms the guide route returns `HTTP/1.1 200 OK` on `http://127.0.0.1:5178`.
- Local route proof confirms the direct-path section, FAQ block, related guides, and expected internal links on the local base URL.

## Current Release-Safety Reality From This Workspace

Verified June 15, 2026:

- `git -C /Users/michaelyap/Documents/Codex/Workspace status --short --branch` reports `## No commits yet on codex/guided-onboarding` plus a broadly dirty untracked workspace.
- `git -C /Users/michaelyap/Documents/Codex/Workspace remote -v` returned no configured remotes.
- `node /Users/michaelyap/Documents/Codex/Workspace/univenture/scripts/release-safety-check.mjs --repo /Users/michaelyap/Documents/Codex/Workspace --base origin/main --allow univenture/cityatlas --json` returned `blocked_missing_base_ref`.

Meaning:

- this current workspace copy is not itself a safe release lane
- the low-friction routing release is approval-ready in docs and local proof only
- the live action still requires a real git checkout or branch that contains the actual CityAtlas live base after the starter-pack routing release

## Exact Release Lane Build Order

1. Refresh the live base after the starter-pack routing release is already live.
2. Cut a fresh release lane from that live base.
3. Re-cut only the intended payload.
   - Use `LOW_FRICTION_ROUTING_RELEASE_SLICE_HANDOFF.md` for the file map.
   - Use `LOW_FRICTION_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` for shared-file rules.
   - Defer mixed link-only surfaces if isolating them would also ship unrelated later work.
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
  --base <live-base-ref-after-starter-pack-routing-release> \
  --allow univenture/cityatlas/src,univenture/cityatlas/public \
  --strict
```

Current known blocker:

- from this workspace state, the same check is blocked until a real `<live-base-ref-after-starter-pack-routing-release>` exists locally and the release work is moved into a clean branch with actual commit history

## Exact Payload Surfaces

Required route and crawl surfaces:

- `src/data/seed.ts`
- `src/features/public/GuideDetailPage.tsx`
- `public/sitemap.xml`
- `public/llms.txt`

Shared metadata dependencies only if needed by the exact release lane:

- `src/components/Seo.tsx`
- `src/config/site.ts`
- `src/app/CityAtlasApp.tsx`

Mixed shared link surfaces only if isolated cleanly:

- `src/features/public/HomePage.tsx`
- `src/features/public/CityPage.tsx`
- `src/features/public/AboutPage.tsx`
- `src/features/public/CollectionPages.tsx`
- `src/components/Layout.tsx`

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
curl -I http://127.0.0.1:5178/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today
```

Then verify local route behavior on the same guide:

- direct-path section renders
- FAQ block renders
- related guides and expected internal links remain intact
- route-specific title, description, robots, and local canonical/JSON-LD expectations still match

## Rollback Snapshot To Preserve Before Deploy

Keep all of these in the approval log before release:

- hosted deployment on record before this queue: `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3`
- public alias on record: `https://cityatlas-one.vercel.app`
- approved domain on record: `https://city.univenturestudio.com`
- exact live git base used for the release lane once it is identified
- exact deployed state that already includes the earlier source-backed queues plus the starter-pack routing release

## Hosted Smoke Sequence After Deploy

Run immediately after the live release:

1. `curl -I` the guide route and confirm `200`.
2. Check hosted `sitemap.xml` for the guide.
3. Check hosted `llms.txt` for honest route/state wording.
4. Render the guide in a browser and confirm:
   - routing sections
   - expected internal links
   - hosted title, description, robots, canonical, and JSON-LD behavior
5. Confirm hosted `/admin`, `/private-preview/date-night`, and `/for-businesses/submit` still keep the expected protected behavior.

## Still Unverified Before The Live Step

- the real live git base after the starter-pack routing release is not available in this workspace checkout
- the release-safety guard cannot yet pass from this workspace state
- hosted rendering after release
- hosted `sitemap.xml` and `llms.txt` after release
- hosted canonical and JSON-LD behavior after release
- crawl behavior
- indexing movement
- ranking movement

## Approval Needed

`Approve one CityAtlas production release that promotes the local-ready low-friction routing guide to city.univenturestudio.com, followed by hosted smoke on the route, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
