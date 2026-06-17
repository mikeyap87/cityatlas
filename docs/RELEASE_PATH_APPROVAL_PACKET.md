# CityAtlas Release Path Approval Packet

Date: 2026-06-16

## Release Target

CityAtlas Vancouver public batch on:

- `https://city.univenturestudio.com`
- fallback alias `https://cityatlas-one.vercel.app`

## Intended Change

Release the current locally proven Vancouver batch that sharpens public business-coverage truth, keeps internal-style copy off the crawlable surface, and preserves the answer-first guide and source-backed authority library.

This packet started as a release-mechanics-only approval packet. It now records the current release-path truth after the standalone-repo repair and the direct Vercel production deploy.

## Current Release Truth

- CityAtlas is locally linked to the live Vercel project `cityatlas` through `.vercel/project.json`.
- CityAtlas now has its own standalone local git repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`.
- The current local release branch is `codex/vancouver-release-lane`.
- The first clean standalone CityAtlas commit is `1cc4761`.
- The approved public domain is already live and crawlable.
- The current local batch has fresh proof artifacts dated 2026-06-17.
- The current production deployment is `dpl_EH4ZGfu6TxX1Erg6dARaNuBGJv7y` at `https://cityatlas-rcpxa1sng-michael-yaps-projects-92932836.vercel.app`.
- The approved custom domain now responds with `HTTP/2 200` and `last-modified: Wed, 17 Jun 2026 06:46:43 GMT`, which confirms the current batch is live for review.

## Exact Blocker

The Vancouver batch is no longer blocked from live review. It is now blocked only from a clean remote-backed push and deploy lane.

What is true right now:

- `univenture/cityatlas` now resolves to its own standalone git repo.
- The parent-workspace git collision is no longer the active blocker.
- The current Vancouver batch has already been deployed directly through the linked Vercel project.
- No remote is configured on the new CityAtlas repo yet.
- No live base branch or commit has been identified from the real release source of truth yet.
- The release-safety checker still cannot prove a normal branch-against-live release path until the remote and base are known.

Verified release-safety result:

- repo now resolves to `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- the release branch is now `codex/vancouver-release-lane`
- `origin/main` is still missing locally
- release status returned `blocked_missing_base_ref`

Plain-English meaning:

CityAtlas now has a real standalone local release lane, but it still does not have a trustworthy remote-backed push and deploy path for this batch.

## Verified

### Hosted Truth

- `https://city.univenturestudio.com/` returns `HTTP/2 200`.
- `https://cityatlas-one.vercel.app/` returns `HTTP/2 200`.
- Hosted `robots.txt` is public and still blocks `/admin`, `/private-preview/`, and `/for-businesses/submit`.
- Hosted `sitemap.xml` is live and contains the current Vancouver crawlable guide and starter library.
- Production deploy `dpl_EH4ZGfu6TxX1Erg6dARaNuBGJv7y` is live on the public aliases.
- Hosted smoke passed on 2026-06-17 for the first source-backed packet, the second source-backed packet, and the starter-pack routing packet on `https://city.univenturestudio.com`.
- Existing docs show CityAtlas already has a linked Vercel project, a public alias, and a public custom domain.

### Local Proof For The New Batch

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
- `npm run growth:verify` passed on 2026-06-17 with Vancouver still at `143` total prospects, `124` partner candidates, `93` contact-ready rows, and `66` email-ready rows.
- `npm run build` passed on 2026-06-17 before deploy.

### Repo And Tooling Truth

- `git -C /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas rev-parse --show-toplevel` now resolves to `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`.
- `git -C /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas branch --show-current` now returns `codex/vancouver-release-lane`.
- `git -C /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas log -1 --oneline` now returns the standalone root commit `1cc4761 Initialize standalone CityAtlas release lane`.
- `git -C /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas remote -v` still returns no remote.
- The committed payload is now isolated to the CityAtlas project instead of the mixed parent workspace.
- The release-safety checker exists for Univenture, but the shared standard points to a broader workspace path than the actual checker location for this repo family. The checker itself is usable, but only after the repo/base problem is fixed.

## Not Verified

- There is no pushable remote branch for CityAtlas.
- There is no confirmed live base branch or commit for a safe release transplant.
- There is no rollback snapshot tied to a clean repo history for this new local batch.

## Smallest Viable Release-Path Options

### Option 1: Dedicated CityAtlas Repo First

Completed locally except for the remote and live-base step. CityAtlas now has its own standalone local git repo, first clean commit, fresh local proof, and one live Vercel deploy. The remaining move is to attach the intended GitHub remote, confirm the live base, rerun the release-safety check against that real base, then move future releases onto the dedicated repo path.

Why this is best:

- cleanest audit trail
- narrowest payload
- easiest rollback and release proof
- least confusion between CityAtlas and the wider workspace

Cost:

- requires the owner to confirm the intended repo destination or remote

### Option 2: Standalone Local Repo Now, Remote Decision Next

This local repair step is complete. CityAtlas has its own local repo, branch, and first clean commit. The remaining work is the remote decision.

Why this helps:

- gets CityAtlas onto a real release lane quickly
- separates the app from the mixed parent workspace state

Cost:

- still does not create a push or deploy path until the remote is chosen

### Option 3: One-Off Direct Vercel Deploy From The Linked Folder

Use the existing `.vercel` link to deploy directly from the folder without solving the git release lane first.

Why this is fast:

- fastest path to making the newest local batch live

Why this is weaker:

- not a clean commit and push path
- weaker rollback clarity
- weaker proof that the exact local payload is what shipped

### Option 4: Release From The Parent Workspace Repo

Not recommended.

Why:

- no commits
- no remote
- unrelated mixed workspace scope
- release-safety proof already says this path is blocked

## Safest And Fastest Recommendation

Safest: Option 1.

Fastest while still responsible: keep the current live direct-deploy path available for review, then immediately continue into Option 1 once the remote is confirmed.

Fastest live-only but weakest mechanically: Option 3.

## Owner Decision Required

Please choose the release source of truth for CityAtlas:

1. Approve creating or reconnecting a dedicated CityAtlas GitHub remote, then moving future releases onto that repo-based path.
2. Approve keeping the current one-off direct Vercel deploy as the temporary live-review path while the remote is resolved.

## Recommended Approval Sentence

If you want the cleanest path:

`Approved: connect CityAtlas to its intended GitHub remote, rerun release-safety against the real base, and move future releases onto the clean repo-based path.`

If you want to keep today's live review path while that gets resolved:

`Approved: keep the current direct Vercel deploy as the temporary review path, and continue toward the clean GitHub remote path next.`
