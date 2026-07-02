# CityAtlas Release Path Status

Date: 2026-07-02

## Release Target

CityAtlas Vancouver public batch on:

- `https://city.univenturestudio.com`
- fallback alias `https://cityatlas-one.vercel.app`

## Current Status

The original missing-remote blocker is repaired, but the old `codex/vancouver-release-lane` notes in this packet are now historical only.

CityAtlas now has:

- a standalone local git repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- a dedicated GitHub repo at `https://github.com/mikeyap87/cityatlas`
- a pushed shared baseline on `origin/main`
- a current verified live production base on `origin/codex/cityatlas-cro-release-20260701` at commit `17bb9bd`
- a fresh clean child release lane used for the newest local route-memory plus attribution proof
- a live production deploy on the approved public domain

The old missing-remote and missing-base problem is gone. The current safe next release path is to branch from `origin/codex/cityatlas-cro-release-20260701`, prove the intended batch there, then deploy only after approval.

## Verified

### Hosted Truth

- `https://city.univenturestudio.com/` returns `HTTP/2 200`.
- `https://cityatlas-one.vercel.app/` returns `HTTP/2 200`.
- Hosted `robots.txt` is public and still blocks `/admin`, `/private-preview/`, and `/for-businesses/submit`.
- Hosted `sitemap.xml` is live and contains the current Vancouver crawlable guide and starter library.
- Production deploy `dpl_FjB8fUnP5ZhzueTvLfN2XWQ5sKRd` is live on the public aliases.
- Hosted smoke passed on 2026-06-17 for the first source-backed packet, the second source-backed packet, and the starter-pack routing packet on `https://city.univenturestudio.com`.
- A live headless-browser homepage check on 2026-06-17 confirmed the clickable Kitsilano map stop and the homepage search opening `/vancouver/guides/two-hour-vancouver-visitor-loop-for-a-first-evening`.

### Local Proof For The Current Baseline

- `output/seo/local-proof-stack.json` passed on `2026-06-17T06:44:13.189Z`.
- Current local proof summary:
  - useful pieces: `41`
  - guides: `25`
  - source-backed collections: `16`
  - source-backed places: `80`
  - checked routes: `38`
  - checked rendered routes: `51`
  - readiness average: `90`
- `output/qa/local-product-smoke.json` passed again on `2026-06-17T18:56:25.079Z`.
- Local smoke passed desktop and mobile checks across homepage, Vancouver starter navigation, Toronto pilot routes, planner, business submit, admin, and private preview.
- `npm run growth:verify` passed on 2026-06-17 with Vancouver at `143` total prospects, `124` partner candidates, `93` contact-ready rows, and `66` email-ready rows.
- `npm run build` passed on 2026-06-17 before deploy.
- `npm run seo:copy:proof` passed on 2026-06-17 before deploy.
- `npm run seo:copy:rendered:proof` passed on 2026-06-17 across `51` rendered routes before deploy.

### Repo And Safety Truth

- `git remote -v` now returns `origin https://github.com/mikeyap87/cityatlas.git`.
- `origin/main` still exists as a shared baseline, but it is not the current production twin.
- `origin/codex/cityatlas-cro-release-20260701` is the current verified live production base at commit `17bb9bd`.
- `node /Users/michaelyap/Documents/Codex/Workspace/univenture/scripts/release-safety-check.mjs --repo /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas --base origin/main --allow src,docs,public,scripts --strict` now returns `blocked_unexpected_release_scope` because `README.md` is outside the approved release surface.

Verified release-safety result now:

- repo resolves correctly to `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- branch is `codex/vancouver-release-lane`
- base is `origin/main`
- status is now `blocked_unexpected_release_scope`

Plain-English meaning:

There is no missing-repo or missing-remote blocker left. The next release-safety stop is now simpler: use the current live production base, keep the release payload clean, and do not treat the older damaged working copy or the older `codex/vancouver-release-lane` history as the active deploy lane.

## What Remains

- The next strict `origin/main` release check still needs either a merge from the live release lane or a cleaner release payload that excludes `README.md`.
- Toronto now has hosted smoke proof on the approved domain, but route-level Search Console indexing proof is still missing.
- Vancouver can still get stronger ranking depth from more source-backed destination/entity pages and broader honest business coverage.

## Safest Next Move

Use this repaired GitHub-backed path for the next real release slice:

1. Start from `origin/codex/cityatlas-cro-release-20260701`, then create a fresh clean child release lane for the exact approved batch.
2. Rerun local proof on the exact branch.
3. Keep the payload narrow and honest; do not let old damaged-worktree noise or unrelated files become part of the release claim.
4. Rerun release-safety against the exact live-base branch and intended payload.
5. Deploy only when the branch contains a real reviewed diff.
