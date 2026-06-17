# CityAtlas First Source-Backed Release Go/No-Go Checklist

## Purpose

Use this as the exact go/no-go handoff before any live action for the first queued source-backed release.

This checklist does not replace `SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`. It turns that packet into an approval-ready live-release gate.

Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` for the exact execution order once approval exists and a real release lane is cut.
Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` for the exact path-scoped file map that belongs in the first queued release slice.
Use `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe rules that keep mixed shared files from widening the release.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Fallback public alias: `https://cityatlas-one.vercel.app`
- Release slice: the CityAtlas path under the shared workspace repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Intended Change

Promote the first queued local-ready source-backed release to the live public domain:

- `/vancouver/first-time-visitor-starters`
- `/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`
- `/vancouver/wellness-reset-starters`
- `/vancouver/guides/vancouver-wellness-experiences-to-review`

Along with their already-built supporting surfaces:

- the required route-specific support in shared files, using the transplant checklist rather than broad whole-file copy-over
- internal links from the homepage, city page, guide library, About page, and footer only where the first-queue links can be isolated cleanly
- the matching `sitemap.xml` entries
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

- the content queue is locally ready
- the current workspace working tree should not be treated as an automatically safe live-release lane
- before any live deploy, the release slice should be re-cut from current live truth and reproven on that exact release lane

## Included Payload

Treat the intended live payload as the narrow first-queue slice only:

- first-time visitor source-backed page
- matching first-time visitor guide
- wellness reset source-backed page
- matching wellness guide
- the required internal-link, `sitemap.xml`, and `llms.txt` updates that support those four routes

Do not widen the payload to include:

- out-of-town guest or weekend-route release work
- Sunday release work
- starter-pack guide release work
- work-friendly cafe expansion
- protected-route behavior changes
- live billing, provider, outreach, auth, admin, or private-preview changes

## Current Local Proof Already In Hand

Cross-reference:

- `docs/seo-aeo-geo/SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/FIRST_TIME_VISITOR_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/WELLNESS_RESET_LOCAL_APPROVAL_PACKET.md`
- `docs/QA_EVIDENCE.md`

What is already proven locally:

- first-time visitor batch passed `npm run typecheck`
- first-time visitor batch passed `npm run build`
- first-time visitor batch passed `npm run readiness`
- first-time visitor page and guide both returned local `HTTP/1.1 200 OK`
- wellness batch passed `npm run typecheck`
- wellness batch passed `npm run build`
- wellness batch passed `npm run readiness`
- wellness page and guide both returned local `HTTP/1.1 200 OK`
- browser proof showed the source-backed cards, correction links, checked-date framing, matching guide sections, and the page-to-guide / guide-to-page pairings
- local browser proof now also covers route-specific title, description, robots, canonical, JSON-LD, and visible page-to-guide / guide-to-page pairings on all four first-queue routes
- mobile proof at 390px showed no horizontal overflow on the first-time visitor and wellness routes
- local `sitemap.xml` and `llms.txt` include the queued routes honestly
- `npm run seo:proof` passes for the current content machine with zero failures
- `npm run seo:structure:proof` passes for the current route-structure layer with zero failures
- `npm run seo:docs:proof` passes for the approval-doc layer with zero failures
- current local ranking surface remains determinable at `37` useful pieces: `23` guides plus `14` source-backed wedge collections
- current local machine truth also includes `70` source-backed anchors and `14` mapped guide-to-collection links
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md` records the current queue order, proof state, and still-unverified hosted gaps in one owner-readable handoff
- the four queued routes have now been refreshed against the active local dev surface on `127.0.0.1:5178`

Local metadata caveat:

- the recorded canonical and JSON-LD proof reflects the configured local base URL behavior at `http://127.0.0.1:5178/`
- hosted canonical and JSON-LD behavior still requires post-deploy smoke on `city.univenturestudio.com`

## Still Unverified Right Now

- hosted rendering of the four first-queue routes on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-to-collection link pairings on the changed routes after release
- hosted canonical and JSON-LD behavior for these four routes after release
- post-release crawl behavior
- indexing movement
- ranking movement

## Go Conditions

This release is `GO` only if every item below is true at action time:

1. The owner approves the exact release scope in plain English.
2. A fresh release lane is cut from the current live truth rather than shipping directly from a mixed workspace branch.
3. The intended payload stays limited to the first-time visitor plus wellness slice.
4. The release lane follows `docs/seo-aeo-geo/FIRST_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for every shared file and defers mixed link-only surfaces if they would also ship later wedges.
5. The exact release lane passes local proof again:
   - `npm run typecheck`
   - `npm run build`
   - `npm run readiness`
   - `npm run seo:proof`
   - `npm run seo:structure:proof`
   - `npm run seo:docs:proof`
   - local route `200` checks for all four queued routes
   - local browser proof on the changed routes, including the page-to-guide / guide-to-page pairings
   - explicit local-base-url caveat preserved for canonical and JSON-LD proof until hosted smoke runs
6. The rollback snapshot is preserved:
   - deployment `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3`
   - public alias `https://cityatlas-one.vercel.app`
   - approved domain `https://city.univenturestudio.com`
7. Post-deploy smoke is ready and limited to the changed public routes plus protected-route guards.

## No-Go Conditions

This release is `NO-GO` if any item below is true:

- the live action would ship from the current mixed workspace branch without re-cutting the release slice
- unrelated CityAtlas work is bundled into the same deploy
- protected routes, billing flags, provider flags, or outreach behavior widen as part of the release
- the rollback snapshot is missing
- hosted smoke is undefined
- hosted metadata/canonical proof for the changed routes is skipped after release

## Exact Live Actions After Approval

Only after approval:

1. cut or prepare a fresh release lane from current live truth
2. re-run the local proof on that exact release lane
3. deploy only the intended first-queue payload
4. run hosted smoke immediately on the changed routes and guards
5. stop and roll back if hosted smoke fails

## Hosted Smoke Checklist

Run in this order after the live release:

1. `curl -I` these four routes and confirm `200`
   - `/vancouver/first-time-visitor-starters`
   - `/vancouver/guides/where-should-a-first-time-vancouver-visitor-start`
   - `/vancouver/wellness-reset-starters`
   - `/vancouver/guides/vancouver-wellness-experiences-to-review`
2. check hosted `sitemap.xml` for the two source-backed pages and two guides
3. check hosted `llms.txt` for honest route/state wording
4. render the two source-backed pages and two guides in a browser and confirm:
   - source cards
   - correction links
   - guide rail sections
   - matching guide-to-collection links
   - hosted title, description, robots, canonical, and JSON-LD behavior
5. confirm hosted `/admin` and `/private-preview/date-night` still behave as protected routes

## Rollback

If hosted smoke fails, roll back to deployment `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3` or the last known good equivalent and keep the first queue local-only until the issue is fixed.

Do not widen the rollback into DNS, billing, provider, or protected-route changes unless a separate incident requires that.

## Exact Approval Sentence

`Approve one CityAtlas production release that promotes the local-ready first-time visitor and wellness source-backed pages plus their guide updates to city.univenturestudio.com, followed by hosted smoke on the four routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
