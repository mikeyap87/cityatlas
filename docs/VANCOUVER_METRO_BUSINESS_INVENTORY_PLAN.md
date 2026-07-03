# Vancouver / Metro Business Inventory Plan

Last updated: 2026-06-24

## Goal

Build an internal CityAtlas research sheet for Vancouver and Greater Vancouver businesses that can later feed cleaner outreach-ready queues.

This is an internal sourcing and enrichment lane, not a public business-directory publish lane.

## Current execution status

Completed locally on 2026-06-21:

- first Vancouver master food-business inventory generated
- output CSV: `output/growth/vancouver-current-year-food-inventory.csv`
- output summary: `output/growth/vancouver-current-year-food-inventory-summary.json`
- current row count: `3009`
- first 100-row restaurant contact-research batch exported
- research batch CSV: `output/growth/vancouver-restaurant-contact-research-batch-001.csv`
- research batch summary: `output/growth/vancouver-restaurant-contact-research-batch-001-summary.json`
- first 100-row Outscraper enrichment pass completed against that restaurant batch
- enriched CSV: `output/growth/vancouver-restaurant-contact-research-batch-001-enriched.csv`
- enriched summary: `output/growth/vancouver-restaurant-contact-research-batch-001-enriched-summary.json`
- review CSV: `output/growth/vancouver-restaurant-contact-research-batch-001-review.csv`
- review summary: `output/growth/vancouver-restaurant-contact-research-batch-001-review-summary.json`
- reviewed-restaurant seed sync completed
- generated seed file: `src/data/vancouverRestaurantReviewBusinessSeeds.ts`
- owner-review shortlist doc: `docs/seo-aeo-geo/VANCOUVER_RESTAURANT_OWNER_REVIEW_SHORTLIST.md`
- owner-review shortlist CSV: `output/growth/vancouver-restaurant-owner-review-shortlist.csv`
- first live enrichment results:
  - selected rows: `100`
  - place matches: `100`
  - websites found: `90`
  - emails found by provider: `69`
  - business-domain-style email candidates needing manual review: `31`
  - contact-path-only rows: `59`
  - still blocked for manual research: `10`
  - promoted into owner-review-ready email lane: `24`
  - estimated reviewed-row queue impact after duplicate collapse: `76`

Completed locally on 2026-06-24:

- the Vancouver-first queue is now metro-aware locally instead of flattening every reviewed row back into plain Vancouver
- generated restaurant and service review seed files now preserve `municipality` and `marketScope`
- the owner-review shortlist exports now include a municipality column
- a current metro status report now exists:
  - doc: `docs/seo-aeo-geo/GREATER_VANCOUVER_EXPANSION_STATUS.md`
  - summary json: `output/growth/greater-vancouver-market-summary.json`
- a new official-source truth report now exists for the next metro municipalities:
  - doc: `docs/seo-aeo-geo/GREATER_VANCOUVER_OFFICIAL_SOURCE_STATUS.md`
  - summary json: `output/growth/greater-vancouver-official-source-status.json`
- a verified official metro inventory now exists for the municipalities that passed the live fetch test:
  - csv: `output/growth/greater-vancouver-official-business-inventory.csv`
  - summary json: `output/growth/greater-vancouver-official-business-inventory-summary.json`
  - current record count: `58272`
    - Burnaby: `17089`
    - Surrey: `26565`
    - Coquitlam: `5888`
    - Township of Langley: `8730`
- the operator database now loads that verified metro inventory one municipality at a time inside `/admin`:
  - current verified municipality slices: `Burnaby`, `Surrey`, `Coquitlam`, `Township of Langley`
  - current honest blocker beyond those slices: a public Richmond fetch path
- a local partner-fit reduction layer now exists for the verified official metro inventory:
  - doc: `docs/seo-aeo-geo/GREATER_VANCOUVER_PARTNER_FIT_STATUS.md`
  - summary json: `output/growth/greater-vancouver-official-partner-fit-summary.json`
  - full scored csv: `output/growth/greater-vancouver-official-partner-fit.csv`
  - priority shortlist csv: `output/growth/greater-vancouver-official-partner-fit-priority.csv`
  - current partner-fit counts:
    - priority: `13910`
    - review-first: `41235`
    - holdout: `3127`
- a first official-metro priority research batch now exists for the verified partner-fit rows:
  - csv: `output/growth/greater-vancouver-official-priority-research-batch-001.csv`
  - summary json: `output/growth/greater-vancouver-official-priority-research-batch-001-summary.json`
  - current selected batch size: `100`
  - municipality split in that first batch:
    - Surrey: `25`
    - Burnaby: `25`
    - Township of Langley: `25`
    - Coquitlam: `25`
- a first local-only Greater Vancouver review seed lane now exists even without the provider enrichment pass finishing:
  - seed file: `src/data/greaterVancouverReviewBusinessSeeds.ts`
  - summary json: `output/growth/greater-vancouver-review-seed-summary.json`
  - shortlist doc: `docs/seo-aeo-geo/GREATER_VANCOUVER_OWNER_REVIEW_SHORTLIST.md`
  - current staged counts from the raw official fallback path:
    - total staged seed rows: `75`
    - owner-review-ready direct-email rows: `18`
    - review-first rows with only a weaker public route: `57`
  - current represented municipalities in that staged lane:
    - `Coquitlam`
    - `Surrey`
    - `Township of Langley`
- the first metro Outscraper enrichment attempt did not complete cleanly in this lane:
  - no metro enriched csv was promoted as source of truth
  - no checkpoint artifact was kept as proof of a successful provider pass
  - current honest fallback mode is still the raw official municipal proof already on disk
- current honest metro snapshot:
  - explicit queued municipalities: `Vancouver`, `Burnaby`, `Richmond`, `North Vancouver`, `West Vancouver`
  - mention-only municipalities in current donor notes: `Surrey`, `New Westminster`, `Coquitlam`, `Langley`
- official-source expansion truth after the 2026-06-24 municipal discovery pass:
  - `Burnaby` is inventory-ready from an official live business-licence layer
  - `Surrey` is inventory-ready from an official live municipal business-directory layer
  - `Township of Langley` is inventory-ready from an official live business-licence layer
  - `Coquitlam` is inventory-ready from an official live business-licence layer
  - `Richmond` has a verified official business-directory layer behind public city web maps, but the underlying REST layer still asks for a token from this lane and no public mirror service was confirmed

Not done yet:

- dedicated municipality sourcing beyond the still-thin off-Vancouver queue
- public-fetch path for Richmond
- official-site or provider-backed enrichment for the priority and review-first metro rows
- a clean successful metro provider pass that adds verified websites and better contact paths beyond the raw official fallback lane
- manual official-site recheck of the `24` owner-review-ready restaurant rows before any outreach-ready claim is made
- manual official-path recheck of the `59` contact-path review rows before any wider restaurant queue claim is made

## What is already verified

Live source checks completed on 2026-06-21:

- City of Vancouver official Business Licences API is reachable:
  - https://opendata.vancouver.ca/explore/dataset/business-licences/
- Current-year active Vancouver food-business volume is already well above the first target:
  - `Restaurant` + `Limited Service Food Establishment`
  - `status=Issued`
  - `folderyear=26`
  - combined current-year records: `3009`
    - `Restaurant`: `1677`
    - `Limited Service Food Establishment`: `1332`
- Top Vancouver local areas for that current-year food-business set:
  - Downtown: `823`
  - West End: `297`
  - Kitsilano: `245`
  - Fairview: `202`
  - Mount Pleasant: `202`
- Free region-level geographic anchor is available through OpenStreetMap:
  - `Metro Vancouver Regional District`
  - https://www.openstreetmap.org/
- Free region-wide downloadable OSM extracts are available through Geofabrik:
  - https://download.geofabrik.de/north-america/canada/british-columbia.html

## Recommended source stack

### Phase 1: Vancouver proper, official first

Primary source:

- City of Vancouver Business Licences API

Use this first for:

- business name
- trade name
- city
- local area
- address
- postal code
- coordinates
- business type
- business subtype
- status
- licence year

Recommended first filter:

- `status=Issued`
- `folderyear=26`
- `businesstype in ("Restaurant","Limited Service Food Establishment")`

### Phase 2: Official website enrichment

Only after the official licence pull:

- business website
- menu URL
- category wording the business uses for itself
- cuisine
- public contact path
- whether the business looks outreach-relevant for CityAtlas

Use official sites as the source of truth for these fields whenever available.

Important API boundary:

- Google Places can help with official website and phone discovery.
- Google Places does not expose business email addresses directly.
- Public emails should still be copied from the business's own official site or official contact page before any row is treated as email-ready.

Current local tooling for this phase:

- Build the first 100-row research input: `npm run growth:restaurant:research-batch`
- Run the paid enrichment pass after local env setup: `npm run growth:restaurant:outscraper-enrich`
- Turn the current enriched review into decision-specific owner files without another provider call: `npm run growth:restaurant:review-exports`
- Sync the reviewed restaurant rows into the default no-send CityAtlas seed layer and regenerate the owner shortlist: `npm run growth:restaurant:sync-seeds`
- Required local-only keys:
  - `OUTSCRAPER_API_KEY`
  - `CITYATLAS_ALLOW_OUTSCRAPER_ENRICHMENT=1`
- Current review rule after the first live pass:
  - treat the provider as a website/contact-path accelerator, not an outreach-ready source of truth
  - only the `email_candidate_review` rows belong in a manual owner-review lane
  - keep `contact_path_review` and `manual_research_needed` rows out of any send-ready list

Current local review exports from the first live pass:

- `output/growth/vancouver-restaurant-contact-research-batch-001-email-candidate-review.csv`
- `output/growth/vancouver-restaurant-contact-research-batch-001-contact-path-review.csv`
- `output/growth/vancouver-restaurant-contact-research-batch-001-manual-research-needed.csv`
- `output/growth/vancouver-restaurant-contact-research-batch-001-email-candidate-review-import.csv`
- `output/growth/vancouver-restaurant-contact-research-batch-001-contact-path-review-import.csv`
- `output/growth/vancouver-restaurant-contact-research-batch-001-review-exports-summary.json`
- `src/data/vancouverRestaurantReviewBusinessSeeds.ts`
- `output/growth/vancouver-restaurant-review-seed-summary.json`
- `output/growth/vancouver-restaurant-owner-review-shortlist.csv`
- `output/growth/vancouver-restaurant-owner-review-shortlist.json`
- `docs/seo-aeo-geo/VANCOUVER_RESTAURANT_OWNER_REVIEW_SHORTLIST.md`

### Phase 3: Greater Vancouver expansion

There is not yet one confirmed official single-source feed for every municipality in Greater Vancouver.

Best expansion path:

1. municipal open-data or business-licence sources where available
2. OSM region coverage for discovery and gap-fill
3. official business websites for final enrichment

Current local helper scripts for this phase:

- `npm run growth:metro:source-status`
- `npm run growth:metro:official-inventory`
- `npm run growth:metro:partner-fit`
- `npm run growth:metro:research-batch`
- `npm run growth:metro:outscraper-enrich`
- `npm run growth:metro:merge-batches`
- `npm run growth:metro:sync-seeds`

Important batch rule:

- once more than one Greater Vancouver provider batch exists, merge the batch files before syncing the review seed layer so batch 2 and later do not replace batch 1

Recommended municipality list:

- Vancouver
- Burnaby
- Richmond
- Surrey
- New Westminster
- North Vancouver City
- North Vancouver District
- West Vancouver
- Coquitlam
- Port Coquitlam
- Port Moody
- Delta
- Maple Ridge
- Pitt Meadows
- White Rock
- Langley City
- Township of Langley

### Phase 4: Outreach-ready reduction

Only a smaller subset should flow into email-ready sheets.

That later layer should require:

- official website found
- public contact path found
- category fit for CityAtlas
- obvious neighborhood or guide fit
- no sketchy directory-only sourcing

## What not to use as primary truth

Do not use these as the main source of record:

- scraped Google Maps exports
- Yelp-style directory snippets
- stale third-party listing sites
- unsourced AI summaries
- person-level private contact data

This matches `docs/REAL_WORLD_SOURCE_POLICY.md`.

## Spreadsheet shape

Use a master inventory sheet first, then map the strongest rows into the existing outreach CSV shapes in `output/growth/`.

Master inventory columns are defined in:

- `output/growth/vancouver-metro-business-inventory-template.csv`

## Best first scrape

Start here before widening:

1. Vancouver proper only
2. restaurants plus limited-service food establishments
3. current-year issued records only
4. official-source enrichment fields left blank until verified

That first pass should already give a large enough list to sort by:

- city
- neighborhood / local area
- address
- category
- restaurant vs limited-service

## Best next categories after restaurants

These are the strongest free-value categories to add after food:

1. beauty / wellness
2. auto repair / detailing / washing
3. fitness studios and instructors
4. home-cleaning or maintenance-style services
5. event venues and hospitality-adjacent operators

Current-year official Vancouver proof already shows meaningful volume in:

- `Beauty Services`: `1487`
- `Building Repair and Maintenance`: `580`
- `Vehicle Repair Detailing and Washing Services`: `360`
- `Sport and Fitness Instruction`: `246`

## Done definition for the first execution batch

- one master CSV created from the official Vancouver source
- rows sorted cleanly with city, local area, address, business type, and status
- duplicate review fields included
- website and cuisine left blank unless officially verified
- no public publishing
- no real outreach sends
