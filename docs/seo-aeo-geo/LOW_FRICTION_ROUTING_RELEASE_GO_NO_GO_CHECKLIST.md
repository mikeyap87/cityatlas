# CityAtlas Low-Friction Routing Release Go/No-Go Checklist

## Purpose

Use this as the exact go/no-go handoff before any live action for the later low-friction routing release.

This checklist does not replace `LOW_FRICTION_ROUTING_RELEASE_QUEUE_PACKET.md` or `LOW_FRICTION_ROUTING_RELEASE_OPERATOR_PACKET.md`. It turns that packet into an approval-ready live-release gate while the operator packet stays the exact execution runbook.

Use `docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_SLICE_HANDOFF.md` for the exact path-scoped file map that belongs in the low-friction routing release slice.
Use `docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe rules that keep mixed shared files from widening the release.
Use `docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_OPERATOR_PACKET.md` as the exact local operator runbook once approval and a real live-base checkout exist.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Fallback public alias: `https://cityatlas-one.vercel.app`
- Release slice: the CityAtlas path under the shared workspace repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Intended Change

Promote the later low-friction routing release to the live public domain:

- `/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today`

Along with its already-built supporting surfaces:

- the required route-specific support in shared files, using the transplant checklist rather than broad whole-file copy-over
- internal links only where those low-friction links can be isolated cleanly
- the matching `sitemap.xml` entry
- the matching `llms.txt` local-ready wording

## Current Live Base Truth

- Latest hosted production deployment recorded in repo docs: `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3`
- Current live aliases recorded in repo docs:
  - `https://cityatlas-one.vercel.app`
  - `https://city.univenturestudio.com`
- Current workspace branch: `codex/guided-onboarding`
- Current git root for this work: `/Users/michaelyap/Documents/Codex/Workspace`
- Current repo truth wrinkle: `cityatlas` is not a standalone git repo, and no remote is configured on the current workspace repo from this environment

Meaning:

- the routing queue is locally ready
- the current workspace working tree should not be treated as an automatically safe live-release lane
- before any live deploy, the release slice should be re-cut from current live truth and reproven on that exact release lane

## Included Payload

Treat the intended live payload as the narrow low-friction routing slice only:

- the low-friction guide route
- the required internal-link, `sitemap.xml`, and `llms.txt` updates that support that route

Do not widen the payload to include:

- any of the nine source-backed release queues
- the starter-pack or guide-roundup routing releases
- protected-route behavior changes
- live billing, provider, outreach, auth, admin, or private-preview changes

## Current Local Proof Already In Hand

Cross-reference:

- `docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/LOW_FRICTION_ROUTE_CHOOSER_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md`
- `docs/QA_EVIDENCE.md`

What is already proven locally:

- low-friction batch passed `npm run typecheck`
- low-friction batch passed `npm run build`
- low-friction batch passed `npm run readiness`
- low-friction guide returned local `HTTP/1.1 200 OK`
- local `sitemap.xml` and `llms.txt` include the queued route honestly
- current local DOM proof covers the direct-path section, FAQ block, related guides, and expected internal links
- `npm run seo:proof` passes for the current content machine with zero failures
- `npm run seo:structure:proof` passes for the current shared route-structure layer with zero failures and includes the low-friction routing guide in the checked route set
- `npm run seo:docs:proof` passes for the approval-doc layer with zero failures
- current local ranking surface remains determinable at `37` useful pieces: `23` guides plus `14` source-backed wedge collections
- current local machine truth also includes `70` source-backed anchors and `14` mapped guide-to-collection links
- the route remains intentionally queued behind the nine hosted source-backed releases and the starter-pack routing release

Local metadata caveat:

- the recorded metadata proof is local-only
- it reflects the configured local base URL behavior at `http://127.0.0.1:5178/`
- hosted title, description, canonical, and JSON-LD behavior still requires post-deploy smoke on `city.univenturestudio.com`

## Still Unverified Right Now

- hosted rendering of the low-friction guide on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted title, description, canonical, and JSON-LD behavior after release
- post-release crawl behavior
- indexing movement
- ranking movement

## Go Conditions

This release is `GO` only if every item below is true at action time:

1. The owner approves the exact release scope in plain English.
2. A fresh release lane is cut from the current live truth rather than shipping directly from a mixed workspace branch.
3. The intended payload stays limited to the low-friction routing slice.
4. The release lane follows `docs/seo-aeo-geo/LOW_FRICTION_ROUTING_RELEASE_TRANSPLANT_CHECKLIST.md` for every shared file and defers mixed link-only surfaces if they would also ship unrelated later work.
5. The exact release lane passes local proof again:
   - `npm run typecheck`
   - `npm run build`
   - `npm run readiness`
   - `npm run seo:proof`
   - `npm run seo:structure:proof`
   - `npm run seo:docs:proof`
   - local route `200` check for the guide
   - local route proof on the changed guide, including routing sections plus title, description, robots, and local canonical/JSON-LD expectations
6. The rollback snapshot is preserved:
   - deployment `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3`
   - public alias `https://cityatlas-one.vercel.app`
   - approved domain `https://city.univenturestudio.com`
7. Post-deploy smoke is ready and limited to the changed public route plus protected-route guards.

## No-Go Conditions

This release is `NO-GO` if any item below is true:

- the live action would ship from the current mixed workspace branch without re-cutting the release slice
- unrelated CityAtlas work is bundled into the same deploy
- protected routes, billing flags, provider flags, or outreach behavior widen as part of the release
- the rollback snapshot is missing
- hosted smoke is undefined
- the exact low-friction release lane does not receive fresh local route proof before release
- hosted metadata/canonical proof for the changed route is skipped after release

## Exact Live Actions After Approval

Only after approval:

1. cut or prepare a fresh release lane from current live truth
2. re-run the local proof on that exact release lane
3. deploy only the intended low-friction routing payload
4. run hosted smoke immediately on the changed route and guards
5. stop and roll back if hosted smoke fails

## Hosted Smoke Checklist

Run in this order after the live release:

1. `curl -I` this route and confirm `200`
   - `/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today`
2. check hosted `sitemap.xml` for the guide route
3. check hosted `llms.txt` for honest route/state wording
4. render the guide in a browser and confirm:
   - the routing sections
   - expected internal links
   - hosted title, description, robots, canonical, and JSON-LD behavior
5. confirm hosted `/admin` and `/private-preview/date-night` still behave as protected routes and `/for-businesses/submit` still stays noindex

## Rollback

If hosted smoke fails, roll back to deployment `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3` or the last known good equivalent and keep the low-friction route local-only until the issue is fixed.

Do not widen the rollback into DNS, billing, provider, or protected-route changes unless a separate incident requires that.

## Exact Approval Sentence

`Approve one CityAtlas production release that promotes the local-ready low-friction routing guide to city.univenturestudio.com, followed by hosted smoke on the route, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
