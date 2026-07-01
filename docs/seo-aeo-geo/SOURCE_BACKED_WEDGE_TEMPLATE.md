# CityAtlas Source-Backed Wedge Template

Use this template when adding the next real-place CityAtlas wedge.

The page should answer one Vancouver planning question with narrow official/current support. Do not widen into a fake directory, generic listicle, or unsupported ranking page.

## 1. Wedge Header

- Query class:
- Audience of one:
- City moment:
- Why this wedge matters:
- Why this should be source-backed instead of guide-only:
- Approved release scope:

## 2. Hook Bench

Write three hooks, then score them with `../hook-intelligence/HOOK_RUBRIC.md`.

1. Hook A:
2. Hook B:
3. Hook C:

- Winning hook:
- Hook score:
- Why it won:

## 3. Trust Boundary

- What this page will help with:
- What this page will not claim:
- Why the answer stays narrow:
- Correction path:

## 4. Official Source Pack

Minimum target: 4 to 6 official/current public sources.

For each named place:

1. Place name:
2. Official source URL:
3. Checked date:
4. Narrow fact(s) supported:
5. Claim(s) intentionally excluded:

## 5. Page Build

- Route path:
- Matching guide path:
- One-sentence summary:
- CTA label:
- CTA target:
- Internal links to add:
- Related wedges to distinguish from:

## 6. Metadata And Schema

- Title:
- Meta description:
- Canonical path:
- JSON-LD type expected:
- Visible correction path present:
- `sitemap.xml` entry required:
- `llms.txt` wording required:

## 7. Local Quality Gate

The page must pass all of these before it is called local-ready:

- one explicit query class
- answer-first opening
- passed hook score
- passed content gate
- no fake "best of" or insider language
- official public source links visible
- checked date visible
- correction path visible
- guide and wedge cross-links working

## 8. Local Proof

- `npm run typecheck`
- `npm run build`
- `npm run readiness`
- route returns `200` on preview
- local proof for title, description, canonical, and JSON-LD
- local proof for `sitemap.xml` and `llms.txt`
- honest note for anything still unverified

## 9. Release Packaging

When the page passes local proof, create or update:

- local approval packet
- release queue packet
- slice handoff
- transplant checklist

Keep hosted crawl/indexing claims out until a real deploy-and-smoke pass happens.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced July 1, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `40` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
