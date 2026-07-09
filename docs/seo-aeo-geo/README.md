# CityAtlas SEO / AEO / GEO System

CityAtlas should be understood as a Vancouver-first city intelligence and travel discovery system, not just a generic local directory.

## Current Classification

`Good Surface`

The repo already has:

- a public discovery surface
- Vancouver entity pages
- missions and planner loops
- business pages
- `robots.txt`, `sitemap.xml`, and `llms.txt`
- an existing AEO/GEO plan

What recent content-machine batches fixed:

- real guide-detail destinations
- a stronger article cluster plan
- a reusable query map
- a local hook and release gate for new editorial drafts
- a reusable source-backed wedge template for the next real-place batch

## One-Sentence Entity Summary

CityAtlas is a Vancouver-first city intelligence and local discovery platform for locals, visitors, and neighborhood businesses who need clearer city plans, destination pages, and trust-first local guidance.

## What AI And Search Systems Can Likely Understand Today

- CityAtlas is about Vancouver discovery.
- It has discovery pages, missions, guides, and business packages.
- It is still mostly in draft / prelaunch mode with fictional seed data.
- It now has three live public source-backed wedges for Vancouver date-night starters, rainy-day starters, and first-evening starters plus a public standards/correction page.
- The local package also has additional source-backed wedges for first-time visitor starting areas, Kitsilano scenic west-side anchors, west-side daytime beach-and-campus anchors, False Creek culture-afternoon anchors, UBC discovery-day anchors, Vancouver garden-and-conservatory day anchors, returning-visitor local discovery, out-of-town guest hosting, weekend route planning, low-effort Sunday planning, and wellness reset anchors, all pending release approval.
- The local package also now has a starter-pack guide that helps readers and crawlers choose the right CityAtlas page first, with a later routing-release packet behind the nine source-backed queues.
- The local package now has a determinable `39` useful-piece ranking surface: `24` answer-first guides plus `15` source-backed wedge collections.
- The neighborhood destination cluster now includes dedicated starter pages for Gastown, Mount Pleasant, and Kitsilano instead of stopping at the chooser layer only.
- The release ladder is now explicit instead of implied: nine queued source-backed hosted packets, then three later routing-only packets.

## Biggest Visibility Blockers

1. The live public domain still has only three source-backed wedges even though eleven more are now local-ready, and the full nine-queue hosted ladder now has a queue packet, exact live gate, and exact execution runbook for every queued wedge pair: first queue, second queue, Sunday, returning-visitor, Kitsilano scenic, west-side daytime, False Creek culture, UBC discovery, and garden day.
2. The later routing guides are useful and already proven locally, but they should stay behind the nine source-backed queues, so the starter-pack, low-friction, and guide-roundup releases now each have their own routing queue packet, exact live gate, slice handoff, transplant rules, and exact execution runbook.
3. The work-friendly cafe cluster is still guide-logic-heavy because official-source support for laptop and work-mode claims is thin.
4. The local package now sits beyond the original 10 to 20 useful-piece target, but the hosted public domain still trails it because the newest source-backed wedges are not released yet.
5. Because the product is still mostly demo-first, every new real-world page must stay narrow, source-linked, and correction-ready instead of widening into a fake directory.

## Current Priority Clusters

1. Vancouver date night planning
2. Rainy-day Vancouver plans
3. Vancouver weekend route ideas
4. Vancouver wellness / recovery routes
5. First-evening visitor loops
6. First-time visitor starting areas
7. Returning-visitor local discovery
8. Out-of-town guest hosting
9. Low-effort Sunday planning
10. Kitsilano scenic west-side starters
11. West-side daytime route starters
12. False Creek culture starters
13. UBC discovery starters
14. Garden and conservatory day starters
15. Work-friendly cafe decision help, still intentionally deferred

## Reusable Machine Docs

- `CURRENT_LOCAL_PROOF_SNAPSHOT.md` is the preferred current-state local proof citation for machine counts, readiness, queue order, and current local route reachability.
- `npm run seo:proof:stack` is the preferred one-command local proof refresh for the current content, structure, source-copy, rendered-copy, docs, and readiness stack.
- `npm run seo:docs:sync` refreshes the shared current-truth block across the SEO packet library from repo truth before `npm run seo:docs:proof`.
- `output/seo/local-proof-stack.json` is the preferred machine-readable aggregate proof artifact when one file should summarize the current local stack.
- `ENTITY_AND_QUERY_MAP.md` picks the query class, audience, and wedge order.
- `EDITORIAL_BACKLOG.md` records what is built, what is deferred, and what should happen next.
- `SOURCE_BACKED_WEDGE_TEMPLATE.md` is the working template for the next source-backed route plus guide pair.
- `../hook-intelligence/README.md` and `../hook-intelligence/HOOK_RUBRIC.md` set the opening-angle bar.
- `../content-quality-gate/README.md` and `../content-quality-gate/RELEASE_CHECKLIST.md` set the trust gate before anything is treated as ready.
- `npm run seo:proof` verifies local guide counts, source-backed collection coverage, and `sitemap.xml` plus `llms.txt` route coverage.
- `npm run seo:structure:proof` verifies route metadata, robots directives, canonical expectations, breadcrumbs, guide FAQ schema, source-backed collection structure, and hub JSON-LD coverage on the key CityAtlas routes.
- `npm run seo:docs:proof` verifies that the approval packets, current-state docs, and release-ladder summaries still match the live local machine truth and writes `output/seo/local-doc-proof.json`.
- `FIRST_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md`, `SECOND_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md`, `SUNDAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md`, `RETURNING_VISITOR_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md`, `KITSILANO_SCENIC_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md`, `WEST_SIDE_DAYTIME_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md`, `FALSE_CREEK_CULTURE_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md`, `UBC_DISCOVERY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md`, and `GARDEN_DAY_SOURCE_BACKED_RELEASE_OPERATOR_PACKET.md` turn all nine hosted source-backed queues into exact execution runbooks tied to the release-safety standard and the current local blockers.
- `TORONTO_PILOT_LOCAL_APPROVAL_PACKET.md`, `TORONTO_PILOT_HOSTED_RELEASE_QUEUE_PACKET.md`, `TORONTO_PILOT_HOSTED_RELEASE_SLICE_HANDOFF.md`, `TORONTO_PILOT_HOSTED_RELEASE_TRANSPLANT_CHECKLIST.md`, `TORONTO_PILOT_HOSTED_RELEASE_GO_NO_GO_CHECKLIST.md`, and `TORONTO_PILOT_HOSTED_RELEASE_OPERATOR_PACKET.md` package the first non-Vancouver hosted release step around the Toronto guide hub plus the first-time visitor and weekend starter-guide pairs.
- `STARTER_PACK_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md`, `STARTER_PACK_ROUTING_RELEASE_OPERATOR_PACKET.md`, `LOW_FRICTION_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md`, `LOW_FRICTION_ROUTING_RELEASE_OPERATOR_PACKET.md`, `GUIDE_ROUNDUP_ROUTING_RELEASE_GO_NO_GO_CHECKLIST.md`, and `GUIDE_ROUNDUP_ROUTING_RELEASE_OPERATOR_PACKET.md` do the same for the later routing-only release ladder.
- `LOCAL_QUEUE_AND_PROOF_STATUS.md` is the owner-readable local truth for queue order, current proof, and still-unverified items.

## Local Rules

- Keep answer-first openings.
- Prefer route logic over generic listicles.
- Use one city question per page.
- Connect every guide to a mission, planner action, or business intent path.
- Do not publish fake "best of" claims, fake reviews, fake rankings, or unsupported neighborhood advice.
- Prefer current proof snapshots and exact queue packets over older batch notes when making release or growth claims.
- Treat current guide drafts as local/article-structure proof until real sourcing is approved.
- If a page names a real venue, link to the official source, show the checked date, keep claim boundaries visible, and route corrections through `/editorial-standards`.
- Prefer the next source-backed batch only where official pages make the answer materially better than a generic travel list. Work-friendly cafe decision help stays deferred until stronger official-source support appears.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
