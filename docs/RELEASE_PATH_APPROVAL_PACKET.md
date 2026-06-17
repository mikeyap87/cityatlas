# CityAtlas Release Path Approval Packet

Date: 2026-06-16

## Release Target

CityAtlas Vancouver public batch on:

- `https://city.univenturestudio.com`
- fallback alias `https://cityatlas-one.vercel.app`

## Intended Change

Release the current locally proven Vancouver batch that sharpens public business-coverage truth, keeps internal-style copy off the crawlable surface, and preserves the answer-first guide and source-backed authority library.

This packet is about release mechanics only. It does not approve or perform a live action.

## Current Release Truth

- CityAtlas is locally linked to the live Vercel project `cityatlas` through `.vercel/project.json`.
- CityAtlas now has its own standalone local git repo at `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`.
- The current local release branch is `codex/vancouver-release-lane`.
- The approved public domain is already live and crawlable.
- The current local batch has fresh proof artifacts dated 2026-06-17.
- The currently served hosted shell responds with `HTTP/2 200` and `last-modified: Tue, 16 Jun 2026 06:28:51 GMT`, which means the live deployment is real but not proven to match the newest local batch.

## Exact Blocker

The Vancouver batch is not blocked by product readiness. It is now blocked by the remaining missing pieces of a clean push and deploy lane.

What is true right now:

- `univenture/cityatlas` now resolves to its own standalone git repo.
- The parent-workspace git collision is no longer the active blocker.
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
- Existing docs show CityAtlas already has a linked Vercel project, a public alias, and a public custom domain.

### Local Proof For The New Batch

- `output/seo/local-proof-stack.json` passed on `2026-06-17T05:13:16.963Z`.
- Current local proof summary:
  - useful pieces: `41`
  - guides: `25`
  - source-backed collections: `16`
  - source-backed places: `80`
  - checked routes: `38`
  - checked rendered routes: `51`
  - readiness average: `90`
- `output/qa/local-product-smoke.json` passed on `2026-06-17T05:11:20.350Z`.
- Local smoke passed desktop and mobile checks across homepage, Vancouver starter navigation, Toronto pilot routes, planner, business submit, admin, and private preview.

### Repo And Tooling Truth

- `git -C /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas rev-parse --show-toplevel` now resolves to `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`.
- `git -C /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas branch --show-current` now returns `codex/vancouver-release-lane`.
- `git -C /Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas remote -v` still returns no remote.
- The staged payload is now isolated to the CityAtlas project instead of the mixed parent workspace.
- The release-safety checker exists for Univenture, but the shared standard points to a broader workspace path than the actual checker location for this repo family. The checker itself is usable, but only after the repo/base problem is fixed.

## Not Verified

- The current local Vancouver batch is not verified live on the approved domain.
- There is no pushable remote branch for CityAtlas.
- There is no confirmed live base branch or commit for a safe release transplant.
- There is no rollback snapshot tied to a clean repo history for this new local batch.

## Smallest Viable Release-Path Options

### Option 1: Dedicated CityAtlas Repo First

Completed locally except for the remote and live-base step. CityAtlas now has its own standalone local git repo. The remaining move is to attach the intended GitHub remote, confirm the live base, rerun the release-safety check against that real base, then push and deploy from the dedicated repo.

Why this is best:

- cleanest audit trail
- narrowest payload
- easiest rollback and release proof
- least confusion between CityAtlas and the wider workspace

Cost:

- requires the owner to confirm the intended repo destination or remote

### Option 2: Standalone Local Repo Now, Remote Decision Next

This local repair step is now in progress and effectively completed for repo isolation. CityAtlas has its own local repo and branch. The remaining work is the first clean commit plus the remote decision.

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

Fastest while still responsible: finish the first clean local commit on the new repo, then immediately continue into Option 1 once the remote is confirmed.

Fastest live-only but weakest mechanically: Option 3.

## Owner Decision Required

Please choose the release source of truth for CityAtlas:

1. Approve creating or reconnecting a dedicated CityAtlas git repo and remote, then release from that repo.
2. Approve making CityAtlas a standalone local repo first while you confirm the remote destination.
3. Approve a one-off direct Vercel deploy from the linked folder even though it is not a clean commit, push, and deploy path.

## Recommended Approval Sentence

If you want the cleanest path:

`Approved: make CityAtlas its own real repo, connect the intended remote, build a clean release lane from that repo, rerun proof, and prepare the push/deploy packet.`

If you want the fastest acceptable setup step first:

`Approved: initialize CityAtlas as its own local repo now, make the first clean commit, and stop before any push or deploy until the remote is confirmed.`

If you want the fastest live path instead:

`Approved: use the existing linked Vercel project for a one-off direct deploy of the current CityAtlas batch, knowing this bypasses a clean repo-based release path.`
