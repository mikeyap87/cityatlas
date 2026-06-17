# CityAtlas Returning-Visitor Source-Backed Release Go/No-Go Checklist

## Purpose

Use this as the exact go/no-go handoff before any live action for the fourth queued source-backed release.

This checklist does not replace `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`. It turns that packet into an approval-ready live-release gate.

Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` for the exact execution order once approval exists and a real release lane is cut.
Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_SLICE_HANDOFF.md` for the exact path-scoped file map that belongs in the returning-visitor queued release slice.
Use `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for the copy-safe rules that keep mixed shared files from widening the release.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Fallback public alias: `https://cityatlas-one.vercel.app`
- Release slice: the CityAtlas path under the shared workspace repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`

## Intended Change

Promote the fourth queued local-ready source-backed release to the live public domain:

- `/vancouver/returning-visitor-starters`
- `/vancouver/guides/vancouver-local-discovery-for-returning-visitors`

Along with its already-built supporting surfaces:

- the required route-specific support in shared files, using the transplant checklist rather than broad whole-file copy-over
- internal links from the homepage, city page, guide library, About page, and footer only where the returning-visitor links can be isolated cleanly
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

Treat the intended live payload as the narrow returning-visitor slice only:

- returning-visitor source-backed page
- matching returning-visitor guide
- the required internal-link, `sitemap.xml`, and `llms.txt` updates that support those two routes

Do not widen the payload to include:

- first-time visitor or wellness release work
- out-of-town guest or weekend-route release work
- Sunday release work
- starter-pack guide release work
- protected-route behavior changes
- live billing, provider, outreach, auth, admin, or private-preview changes

## Current Local Proof Already In Hand

Cross-reference:

- `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/RETURNING_VISITOR_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md`
- `docs/QA_EVIDENCE.md`

What is already proven locally:

- returning-visitor batch passed `npm run typecheck`
- returning-visitor batch passed `npm run build`
- returning-visitor batch passed `npm run readiness`
- returning-visitor page and guide both returned local `HTTP/1.1 200 OK`
- local `sitemap.xml` and `llms.txt` include the queued routes honestly
- local server-render proof showed the guide CTA path, guide resource links, five official-source anchors, and the returning-visitor collection metadata path/title mapping
- current local browser-head proof now covers the two returning-visitor routes and confirms route-specific title, description, robots, canonical, JSON-LD, correction-path links, and the page-to-guide / guide-to-page pairing on both routes
- local desktop screenshot proof showed the source-backed page hero, trust panel, visible source-backed cards, and correction-path actions
- local narrow-screen proof already survived the post-fix 390px pass for the returning-visitor page
- `npm run seo:proof` passes for the current content machine with zero failures
- `npm run seo:structure:proof` passes for the current shared route-structure layer across `33` key routes with zero failures
- `npm run seo:docs:proof` passes for the approval-doc layer with zero failures
- `npm run seo:smoke:returning` passes on the local preview base and verifies the two returning-visitor routes plus `/for-businesses/submit`, route-level title/robots/canonical/JSON-LD behavior, pairing fragments, `sitemap.xml`, and `llms.txt`
- current local ranking surface remains determinable at `37` useful pieces: `23` guides plus `14` source-backed wedge collections
- current local machine truth also includes `70` source-backed anchors and `14` mapped guide-to-collection links
- repo truth confirms the returning-visitor guide maps to `vancouver_returning_visitor_starters`
- repo truth also confirms `src/features/public/TrustPages.tsx` keeps the returning-visitor source-backed page CTA pointed at the matching guide and `src/features/public/GuideDetailPage.tsx` contains the returning-visitor source-backed guide section
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md` records the current queue order, proof state, and still-unverified hosted gaps in one owner-readable handoff
- the two queued routes have now been refreshed against the active local dev surface on `127.0.0.1:5178`

Local metadata caveat:

- the recorded returning-visitor metadata proof is local-only, including direct browser-head proof on the two returning-visitor routes
- the recorded canonical and JSON-LD proof reflects the configured local base URL behavior at `http://127.0.0.1:5178/`
- the local preview smoke rehearsal intentionally leaves hosted `/admin` and `/private-preview/date-night` guard-notice assertions for the real hosted-domain smoke run
- hosted canonical, title, description, and JSON-LD behavior still requires post-deploy smoke on `city.univenturestudio.com`

## Still Unverified Right Now

- hosted rendering of the two returning-visitor routes on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-to-collection link pairing between the returning-visitor page and matching guide after release
- hosted title, description, canonical, and JSON-LD behavior for these two routes after release
- post-release crawl behavior
- indexing movement
- ranking movement

## Go Conditions

This release is `GO` only if every item below is true at action time:

1. The owner approves the exact release scope in plain English.
2. A fresh release lane is cut from the current live truth rather than shipping directly from a mixed workspace branch.
3. The intended payload stays limited to the returning-visitor slice.
4. The release lane follows `docs/seo-aeo-geo/RETURNING_VISITOR_SOURCE_BACKED_RELEASE_TRANSPLANT_CHECKLIST.md` for every shared file and defers mixed link-only surfaces if they would also ship later wedges.
5. The exact release lane passes local proof again:
   - `npm run typecheck`
   - `npm run build`
   - `npm run readiness`
   - `npm run seo:proof:stack`
   - `npm run seo:proof`
   - `npm run seo:structure:proof`
   - `npm run seo:docs:proof`
   - `npm run seo:smoke:returning`
   - local route `200` checks for both queued routes
   - local browser visual sanity on the changed routes, including the returning-visitor guide section, page-to-guide / guide-to-page pairing, and preserved narrow-screen readability
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
- the exact returning-visitor release lane does not receive fresh local browser-head proof before release
- hosted metadata/canonical proof for the changed routes is skipped after release

## Exact Live Actions After Approval

Only after approval:

1. cut or prepare a fresh release lane from current live truth
2. re-run the local proof on that exact release lane
3. deploy only the intended returning-visitor payload
4. run hosted smoke immediately on the changed routes and guards
5. stop and roll back if hosted smoke fails

## Hosted Smoke Checklist

Run in this order after the live release:

1. run `npm run seo:smoke:returning -- --base-url=https://city.univenturestudio.com`
2. render the returning-visitor source-backed page and guide in a browser and confirm:
   - source cards
   - correction links
   - the returning-visitor guide section
   - matching guide-to-collection links
3. confirm hosted `/admin` and `/private-preview/date-night` still behave as protected routes and `/for-businesses/submit` still stays noindex if anything looks off in the automated smoke output

## Rollback

If hosted smoke fails, roll back to deployment `dpl_8t2Z6dZoRNDL8e8fGw4WDwrk6op3` or the last known good equivalent and keep the returning-visitor queue local-only until the issue is fixed.

Do not widen the rollback into DNS, billing, provider, or protected-route changes unless a separate incident requires that.

## Exact Approval Sentence

`Approve one CityAtlas production release that promotes the local-ready returning-visitor source-backed page and matching guide to city.univenturestudio.com, followed by hosted smoke on the two routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
