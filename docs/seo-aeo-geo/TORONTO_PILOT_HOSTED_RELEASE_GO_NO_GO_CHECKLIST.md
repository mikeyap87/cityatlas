# CityAtlas Toronto Pilot Hosted Release Go/No-Go Checklist

## Purpose

Use this as the exact go/no-go handoff before any live action for the first non-Vancouver CityAtlas release.

This checklist does not replace `TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md`. It turns that packet into an approval-ready live-release gate.

Use `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_OPERATOR_PACKET.md` for the exact execution order once approval exists and a real release lane is cut.

## Release Target

- Product surface: CityAtlas public discovery surface
- Intended live domain: `https://city.univenturestudio.com`
- Release slice: the CityAtlas path under the shared workspace repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- Profile-specific hosted smoke command: `npm run seo:smoke:toronto -- --base-url=https://city.univenturestudio.com`

## Intended Change

Promote the first non-Vancouver local-ready source-backed release to the live public domain:

- `/toronto/guides`
- `/toronto/first-time-visitor-starters`
- `/toronto/guides/where-should-a-first-time-toronto-visitor-start`
- `/toronto/weekend-route-starters`
- `/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`

Along with their already-built supporting surfaces:

- the required shared-file route support
- the matching internal-link updates
- the matching `sitemap.xml` entries
- the matching `llms.txt` entries

## Current Live Base Truth

- The approved public domain is already live and crawlable for the Vancouver-first library.
- The current hosted Toronto routes are not live yet; they still resolve to the Vancouver homepage shell.
- The current hosted blocker is already recorded in `output/seo/hosted-smoke-toronto-pilot.json` and summarized in `docs/HOSTED_DEPLOYMENT_STATUS.md`.
- The current workspace is not itself a guaranteed safe live-release lane.

Meaning:

- the Toronto content cluster is locally ready
- the current workspace should not be treated as an automatically safe release lane
- before any live deploy, the Toronto slice should be re-cut from current live truth and reproven on that exact release lane

## Included Payload

Treat the intended live payload as the narrow Toronto slice only:

- Toronto guide hub
- Toronto first-time visitor source-backed page
- matching Toronto first-time visitor guide
- Toronto weekend-route source-backed page
- matching Toronto weekend-route guide
- the required internal-link, `sitemap.xml`, and `llms.txt` updates that support those five routes

Do not widen the payload to include:

- unrelated Vancouver queue work
- new city shells beyond Toronto
- protected-route behavior changes
- billing, provider-import, outreach, auth, admin, or private-preview changes

## Current Local Proof Already In Hand

Cross-reference:

- `docs/seo-aeo-geo/TORONTO_PILOT_LOCAL_APPROVAL_PACKET.md`
- `docs/seo-aeo-geo/TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md`
- `docs/seo-aeo-geo/LOCAL_QUEUE_AND_PROOF_STATUS.md`

What is already proven locally:

- `npm run typecheck` passed
- `npm run build` passed
- `npm run growth:verify` passed and shows Toronto at `26` unique prospects, `22` partner-eligible rows, `16` contact-ready rows, `16` email-ready rows, `2` source-backed collections, and `2` answer-first guides
- `npm run seo:proof:stack` passed
- `npm run seo:structure:proof` passed and includes all five Toronto routes
- `npm run seo:copy:proof` passed with zero public-copy findings
- `npm run seo:copy:rendered:proof` passed with zero rendered public-copy findings across the current crawlable local routes
- `npm run qa:smoke:local` passed and covers the Toronto pilot and Toronto weekend flows on desktop and mobile
- local `sitemap.xml` and local `llms.txt` include the Toronto routes
- current local route truth confirms the Toronto guide hub plus both starter/guide pairs render as intended

Local metadata caveat:

- the recorded canonical and JSON-LD proof reflects local behavior only
- hosted canonical and JSON-LD behavior still require post-deploy smoke on `city.univenturestudio.com`

## Still Unverified Right Now

- hosted rendering of the five Toronto routes on `city.univenturestudio.com`
- hosted `sitemap.xml` after release
- hosted `llms.txt` after release
- hosted guide-hub and route pairings after release
- hosted canonical and JSON-LD behavior after release
- Search Console indexing movement after release
- ranking movement

## Go Conditions

This release is `GO` only if every item below is true at action time:

1. The owner approves the exact Toronto release scope in plain English.
2. A fresh release lane is cut from current live truth rather than shipping directly from a mixed workspace branch.
3. The intended payload stays limited to the Toronto guide hub plus the two Toronto starter-guide pairs.
4. The exact release lane passes local proof again:
   - `npm run typecheck`
   - `npm run build`
   - `npm run growth:verify`
   - `npm run seo:proof:stack`
   - `npm run seo:structure:proof`
   - `npm run seo:copy:proof`
   - `npm run seo:copy:rendered:proof`
   - `npm run qa:smoke:local`
5. The rollback snapshot is preserved from the currently live Vancouver-first production state before deploy.
6. Post-deploy smoke is ready and limited to the changed Toronto routes plus protected-route guards.

## No-Go Conditions

This release is `NO-GO` if any item below is true:

- the live action would ship from the current mixed workspace branch without re-cutting the release slice
- unrelated CityAtlas work is bundled into the same deploy
- the Toronto routes are not added to the hosted crawl files as part of the same approved slice
- protected routes, billing flags, provider flags, or outreach behavior widen as part of the release
- the rollback snapshot is missing
- hosted smoke is undefined
- hosted metadata and canonical proof for the changed routes is skipped after release

## Exact Live Actions After Approval

Only after approval:

1. cut or prepare a fresh release lane from current live truth
2. re-run the local proof on that exact release lane
3. deploy only the intended Toronto payload
4. run hosted Toronto smoke immediately on the changed routes and guards
5. stop and roll back if hosted smoke fails

## Hosted Smoke Checklist

Run in this order after the live release:

1. run `npm run seo:smoke:toronto -- --base-url=https://city.univenturestudio.com`
2. render `/toronto/guides`, both Toronto starter pages, and both Toronto guides in a browser and confirm:
   - Toronto titles render instead of the Vancouver shell
   - source cards and correction links are visible
   - guide-hub and page-to-guide / guide-to-page pairings are intact
3. confirm hosted `/admin` and `/private-preview/date-night` still behave as protected routes and `/for-businesses/submit` still stays noindex if anything looks off in the automated smoke output

## Rollback

If hosted Toronto smoke fails, roll back to the last known good Vancouver-first production state and keep the Toronto cluster local-only until the issue is fixed.

Do not widen the rollback into DNS, billing, provider, or protected-route changes unless a separate incident requires that.

## Exact Approval Sentence

`Approve one CityAtlas production release that promotes the Toronto guide hub, first-time visitor starter page and guide, and weekend-route starter page and guide to city.univenturestudio.com, followed by hosted smoke on the five Toronto routes, sitemap.xml, llms.txt, hosted metadata behavior, and protected-route guards.`

A simple `yes` is enough only if it clearly refers to that exact deploy-and-smoke scope.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
