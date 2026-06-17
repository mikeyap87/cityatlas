# CityAtlas Release Path Status

Date: 2026-06-17

## Release Target

CityAtlas Vancouver public batch on:

- `https://city.univenturestudio.com`
- fallback alias `https://cityatlas-one.vercel.app`

## Current Status

The release-path blocker is repaired.

CityAtlas now has:

- a standalone local git repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- a dedicated GitHub repo at `https://github.com/mikeyap87/cityatlas`
- a pushed shared baseline on `origin/main`
- a pushed tracked release lane on `origin/codex/vancouver-release-lane`
- a live production deploy on the approved public domain

The current release branch and `origin/main` now point at the same validated Vancouver baseline, so the old missing-remote and missing-base problem is gone.

## Verified

### Hosted Truth

- `https://city.univenturestudio.com/` returns `HTTP/2 200`.
- `https://cityatlas-one.vercel.app/` returns `HTTP/2 200`.
- Hosted `robots.txt` is public and still blocks `/admin`, `/private-preview/`, and `/for-businesses/submit`.
- Hosted `sitemap.xml` is live and contains the current Vancouver crawlable guide and starter library.
- Production deploy `dpl_EH4ZGfu6TxX1Erg6dARaNuBGJv7y` is live on the public aliases.
- Hosted smoke passed on 2026-06-17 for the first source-backed packet, the second source-backed packet, and the starter-pack routing packet on `https://city.univenturestudio.com`.

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
- `output/qa/local-product-smoke.json` passed on `2026-06-17T06:44:08.430Z`.
- Local smoke passed desktop and mobile checks across homepage, Vancouver starter navigation, Toronto pilot routes, planner, business submit, admin, and private preview.
- `npm run growth:verify` passed on 2026-06-17 with Vancouver at `143` total prospects, `124` partner candidates, `93` contact-ready rows, and `66` email-ready rows.
- `npm run build` passed on 2026-06-17 before deploy.

### Repo And Safety Truth

- `git remote -v` now returns `origin https://github.com/mikeyap87/cityatlas.git`.
- `origin/main` now exists and matches the currently deployed Vancouver baseline.
- `origin/codex/vancouver-release-lane` now exists and tracks the working release branch.
- `node /Users/michaelyap/Documents/Codex/Workspace/univenture/scripts/release-safety-check.mjs --repo /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas --base origin/main --allow src,docs,public,scripts --strict` no longer fails on missing remote/base state.

Verified release-safety result now:

- repo resolves correctly to `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- branch is `codex/vancouver-release-lane`
- base is `origin/main`
- status is now `blocked_empty_release_payload`

Plain-English meaning:

There is no release-mechanics blocker left. The checker now stops only because the current branch and `main` are identical, so there is no new payload to release yet.

## What Remains

- The next real product/content batch still needs to be committed on top of this clean base.
- Toronto hosted proof is still missing on the approved domain.
- Vancouver can still get stronger ranking depth from more source-backed destination/entity pages and broader honest business coverage.

## Safest Next Move

Use this repaired GitHub-backed path for the next real release slice:

1. Build the next approved CityAtlas batch on `codex/vancouver-release-lane`.
2. Rerun local proof on the exact branch.
3. Rerun release-safety against `origin/main`.
4. Deploy only when the branch contains a real reviewed diff.
