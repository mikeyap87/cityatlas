# CityAtlas Sunday Source-Backed Release Go/No-Go Checklist

## Purpose

Use this as the exact go/no-go handoff before any live action for the third queued source-backed release.

This checklist does not replace `SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`. It turns that packet into an approval-ready live-release gate.

Use `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` for the exact execution order once approval exists and a real release lane is cut.
Use `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` for the exact path-scoped file map that belongs in the Sunday queued release slice.
Use `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe rules that keep mixed shared files from widening the release.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Fallback public alias: `https://cityatlas-one.vercel.app`
- Release slice: the CityAtlas path under the shared workspace repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Intended Change

Promote the third queued local-ready source-backed release to the live public domain:

- `/vancouver/sunday-starters`
- `/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan`

Along with its already-built supporting surfaces:

- the required route-specific support in shared files, using the transplant checklist rather than broad whole-file copy-over
- internal links from the homepage, city page, guide library, About page, and footer only where the Sunday links can be isolated cleanly
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

Treat the intended live payload as the narrow Sunday slice only:

- Sunday source-backed page
- matching Sunday guide
- the required internal-link, `sitemap.xml`, and `llms.txt` updates that support those two routes

Do not widen the payload to include:

- first-time visitor or wellness release work
- out-of-town guest or weekend-route release work
- returning-visitor release work
- starter-pack guide release work
- protected-route behavior changes
- live billing, provider, outreach, auth, admin, or private-preview changes

## Current Local Proof Already In Hand

Cross-reference:

- `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/SUNDAY_PLAN_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md`
- `docs/QA_EVIDENCE.md`

What is already proven locally:

- Sunday batch passed `npm run typecheck`
- Sunday batch passed `npm run build`
- Sunday batch passed `npm run readiness`
- Sunday page and guide both returned local `HTTP/1.1 200 OK`
- local `sitemap.xml` and `llms.txt` include the queued routes honestly
- local server-render proof showed visible Sunday source cards, the correction-path link, the Sunday guide section, and the Sunday rail link
- local collection metadata proof confirmed the Sunday route path and title mapping
- `npm run seo:proof` passes for the current content machine with zero failures
- `npm run seo:structure:proof` passes for the current shared route-structure layer across `35` key routes with zero failures
- `npm run seo:docs:proof` passes for the approval-doc layer with zero failures
- `npm run seo:smoke:sunday` passes on the local preview base in `route-model-only` fallback mode and verifies the Sunday route model, local `sitemap.xml`, and local `llms.txt` while recording the current headless-browser launch failure as a warning
- current local ranking surface remains determinable at `39` useful pieces: `24` guides plus `15` source-backed wedge collections
- current local machine truth also includes `75` source-backed anchors and `15` mapped guide-to-collection links
- repo truth confirms the Sunday guide maps to `vancouver_sunday_starters`
- repo truth also confirms `src/features/public/TrustPages.tsx` keeps the Sunday source-backed page CTA pointed at the matching guide and `src/features/public/GuideDetailPage.tsx` contains the Sunday source-backed guide section
- historical local browser-head proof exists for the two Sunday routes, but it has not been re-run in a browser-capable environment during the June 16 refresh
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md` records the current queue order, proof state, and still-unverified hosted gaps in one owner-readable handoff
- the two queued routes have now been refreshed against the active local dev surface on `127.0.0.1:5178`

Local metadata caveat:

- the recorded Sunday metadata proof is local-only, and the current reusable smoke artifact is route-model-only because browser launch is failing in this environment
- a fresh browser-rendered rerun should still happen on the exact release lane before any live action
- the local preview smoke rehearsal intentionally leaves hosted `/admin` and `/private-preview/date-night` guard-notice assertions for the real hosted-domain smoke run
- hosted canonical, title, description, and JSON-LD behavior still requires post-deploy smoke on `city.univenturestudio.com`

## Still Unverified Right Now

- hosted rendering of the two Sunday routes on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-to-collection link pairing between the Sunday page and matching guide after release
- hosted canonical, title, description, and JSON-LD behavior for these two routes after release
- post-release crawl behavior
- indexing movement
- ranking movement

## Go Conditions

This release is `GO` only if every item below is true at action time:

1. The owner approves the exact release scope in plain English.
2. A fresh release lane is cut from the current live truth rather than shipping directly from a mixed workspace branch.
3. The intended payload stays limited to the Sunday slice.
4. The release lane follows `docs/seo-aeo-geo/SUNDAY_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for every shared file and defers mixed link-only surfaces if they would also ship later wedges.
5. The exact release lane passes local proof again:
   - `npm run typecheck`
   - `npm run build`
   - `npm run readiness`
   - `npm run seo:proof:stack`
   - `npm run seo:proof`
   - `npm run seo:structure:proof`
   - `npm run seo:docs:proof`
   - `npm run seo:smoke:sunday`
   - local route `200` checks for both queued routes
   - local browser visual sanity on the changed routes, including the Sunday guide section and Sunday page-to-guide / guide-to-page pairing
   - if the smoke command falls back to route-model-only proof again, capture that warning and re-run the Sunday routes in a browser-capable environment before release
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
- the exact Sunday release lane does not receive either fresh local browser-rendered proof or an explicit route-model-fallback note plus a separate browser-capable rerun before release
- hosted metadata/canonical proof for the changed routes is skipped after release

## Exact Live Actions After Approval

Only after approval:

1. cut or prepare a fresh release lane from current live truth
2. re-run the local proof on that exact release lane
3. deploy only the intended Sunday payload
4. run hosted smoke immediately on the changed routes and guards
5. stop and roll back if hosted smoke fails

## Hosted Smoke Checklist

Run in this order after the live release:

1. run `npm run seo:smoke:sunday -- --base-url=https://city.univenturestudio.com`
2. render the Sunday source-backed page and guide in a browser and confirm:
   - source cards
   - correction links
   - the Sunday guide section
   - matching guide-to-collection links
3. confirm hosted `/admin` and `/private-preview/date-night` still behave as protected routes and `/for-businesses/submit` still stays noindex if anything looks off in the automated smoke output

## Rollback

If hosted smoke fails, roll back to deployment `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3` or the last known good equivalent and keep the Sunday queue local-only until the issue is fixed.

Do not widen the rollback into DNS, billing, provider, or protected-route changes unless a separate incident requires that.

## Exact Approval Sentence

`Approve one CityAtlas production release that promotes the local-ready Sunday source-backed page and matching guide to city.univenturestudio.com, followed by hosted smoke on the two routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
