# Greater Vancouver Expansion Status

Updated: 2026-06-24

This is the current local truth for the Vancouver-first business machine. A row counts as Greater Vancouver when it is tied to a non-Vancouver municipality or clearly serves more than Vancouver.

## Current truth

- Restaurant review rows in the Vancouver lane: 2663
- Restaurant owner-review-ready rows: 887
- Restaurant rows currently tagged as Greater Vancouver: 6
- Service review rows in the Vancouver lane: 136
- Service owner-review-ready rows: 53
- Service rows currently tagged as Greater Vancouver: 6
- Explicit municipalities with at least one queued row: Burnaby, North Vancouver, Richmond, Vancouver, West Vancouver
- Mention-only municipalities found in service-area or proof notes: Coquitlam, Langley, New Westminster, Surrey
- Municipalities with no current queue coverage yet: Port Coquitlam, Port Moody, Delta, Maple Ridge, Pitt Meadows, White Rock

## Municipality coverage

| Municipality | Restaurant rows | Restaurant owner review | Restaurant sent | Service rows | Service owner review | Service sent | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vancouver | 2659 | 886 | 100 | 132 | 51 | 19 | Active queue |
| Burnaby | 2 | 1 | 0 | 1 | 0 | 0 | Active queue |
| Richmond | 2 | 0 | 0 | 0 | 0 | 0 | Active queue |
| Surrey | 0 | 0 | 0 | 0 | 0 | 0 | Mention only |
| New Westminster | 0 | 0 | 0 | 0 | 0 | 0 | Mention only |
| North Vancouver | 0 | 0 | 0 | 2 | 2 | 0 | Active queue |
| West Vancouver | 0 | 0 | 0 | 1 | 0 | 1 | Active queue |
| Coquitlam | 0 | 0 | 0 | 0 | 0 | 0 | Mention only |
| Port Coquitlam | 0 | 0 | 0 | 0 | 0 | 0 | Not in queue yet |
| Port Moody | 0 | 0 | 0 | 0 | 0 | 0 | Not in queue yet |
| Delta | 0 | 0 | 0 | 0 | 0 | 0 | Not in queue yet |
| Maple Ridge | 0 | 0 | 0 | 0 | 0 | 0 | Not in queue yet |
| Pitt Meadows | 0 | 0 | 0 | 0 | 0 | 0 | Not in queue yet |
| White Rock | 0 | 0 | 0 | 0 | 0 | 0 | Not in queue yet |
| Langley | 0 | 0 | 0 | 0 | 0 | 0 | Mention only |

## Honest read

- The machine is now metro-aware locally. Off-Vancouver rows no longer get flattened back into plain Vancouver by default.
- Actual off-Vancouver coverage is still thin. Burnaby, Richmond, North Vancouver, and West Vancouver have some real rows in the queue today, but Surrey, Coquitlam, Langley, and most of the rest are not yet backed by explicit reviewed queue rows.
- Some service businesses do mention a wider Lower Mainland service area in their public copy. That is useful context, but it is not the same thing as having a real municipality-by-municipality inventory.

## Next move

1. Keep the current Vancouver-first queue and outreach lane intact.
2. Add dedicated source pulls for the next municipalities instead of relying on accidental spillover.
3. Start with Burnaby, Richmond, Surrey, Coquitlam, and Langley because they matter most for real metro coverage and owner leverage.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
