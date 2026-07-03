# CityAtlas Release Path Status

Date: 2026-06-17

## Release Target

CityAtlas Vancouver public batch on:

- `https://city.univenturestudio.com`
- fallback alias `https://cityatlas-one.vercel.app`

## Current Status

The release-path blocker is repaired, but `origin/main` is no longer the exact live deploy twin.

CityAtlas now has:

- a standalone local git repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- a dedicated GitHub repo at `https://github.com/mikeyap87/cityatlas`
- a pushed shared baseline on `origin/main`
- a pushed tracked release lane on `origin/codex/vancouver-release-lane`
- a live production deploy on the approved public domain

The old missing-remote and missing-base problem is gone. The currently live production build came from `origin/codex/vancouver-release-lane` commit `36cda30`, while `origin/main` is still behind that release lane until a later merge.

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
- `origin/main` now exists as a shared baseline, but it is `4` commits behind the current live release lane.
- `origin/codex/vancouver-release-lane` exists, tracks the working release branch, and matches the current live production deploy commit `36cda30`.
- `node /Users/michaelyap/Documents/Codex/Workspace/univenture/scripts/release-safety-check.mjs --repo /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas --base origin/main --allow src,docs,public,scripts --strict` now returns `blocked_unexpected_release_scope` because `README.md` is outside the approved release surface.

Verified release-safety result now:

- repo resolves correctly to `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- branch is `codex/vancouver-release-lane`
- base is `origin/main`
- status is now `blocked_unexpected_release_scope`

Plain-English meaning:

There is no missing-repo or missing-remote blocker left. The next release-safety stop is now a narrower payload-scope issue: `main` is behind the live release lane, and `README.md` still sits outside the approved release surface for a strict `origin/main` release check.

## What Remains

- The next strict `origin/main` release check still needs either a merge from the live release lane or a cleaner release payload that excludes `README.md`.
- Toronto now has hosted smoke proof on the approved domain, but route-level Search Console indexing proof is still missing.
- Vancouver can still get stronger ranking depth from more source-backed destination/entity pages and broader honest business coverage.

## Safest Next Move

Use this repaired GitHub-backed path for the next real release slice:

1. Build the next approved CityAtlas batch on `codex/vancouver-release-lane`.
2. Rerun local proof on the exact branch.
3. Either merge the live release lane into `main` or keep `README.md` out of the strict release payload before using `origin/main` as the safety base.
4. Rerun release-safety against `origin/main`.
5. Deploy only when the branch contains a real reviewed diff.
