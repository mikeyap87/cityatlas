# Greater Vancouver Partner-Fit Status

Updated: 2026-06-24

This is the current local reduction layer for the verified Greater Vancouver official inventory. It separates likely first-pass partner targets from rows that should stay review-first or holdout.

## Current truth

- Total verified official metro rows now in the local builder: 58272
- Priority rows for first-pass partner review: 13910
- Review-first rows that may still be useful but need more judgment: 41235
- Holdout rows kept out of bulk staging by default: 3127
- Municipalities currently included: Burnaby, Surrey, Coquitlam, Township of Langley

## Municipality split

| Municipality | Priority | Review-first | Holdout |
| --- | --- | --- | --- |
| Coquitlam | 115 | 5710 | 63 |
| Surrey | 7221 | 18928 | 416 |
| Township of Langley | 2042 | 6624 | 64 |
| Burnaby | 4532 | 9973 | 2584 |

## Top priority business types

1. HEALTH SERVICES - THERAPIST (REG'D) (994)
2. Restaurant - No Alcohol (741)
3. Janitorial Service (630)
4. Esthetician (535)
5. Massage Therapy (RMT) (527)
6. RETAIL TRADER - GENERAL 1 - 10 PERSONS (520)
7. Retail Merchant - 0 to 2 Employees (504)
8. wellness (426)
9. home-services (417)
10. Hair Salon/Barber (408)
11. PERSONAL SERVICE ESTABLISHMENT (390)
12. Automotive Repair Service (369)

## Honest read

- This layer does not claim these rows are outreach-ready. It only makes the official inventory more usable by surfacing cleaner first-pass targets before obvious low-fit noise.
- Holdout rows still exist in the full inventory, but they stay out of bulk staging by default so rentals, adult services, banks, and similar low-fit classes do not dominate the queue.
- Richmond is still excluded from this reduction layer because it remains fetch-blocked from the current lane.

## Output files

- Full scored CSV: `output/growth/greater-vancouver-official-partner-fit.csv`
- Priority shortlist CSV: `output/growth/greater-vancouver-official-partner-fit-priority.csv`
- Summary JSON: `output/growth/greater-vancouver-official-partner-fit-summary.json`

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
