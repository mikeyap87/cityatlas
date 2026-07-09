# Greater Vancouver Official Source Status

Updated: 2026-06-24

This is the current official-source truth for the next Greater Vancouver expansion pass. It separates real municipal inventory readiness from portal-only discovery and unresolved source gaps.

## Current truth

- Municipalities already wired locally or inventory-ready right now: Vancouver, Burnaby, Surrey, Coquitlam, Langley (Township)
- Municipalities with a real official dataset but still blocked on fetch behavior: Richmond
- Municipalities with only portal proof so far: None
- Municipalities still missing a clean official entry point: None

## Municipality status

| Municipality | Status | Official source | Live inventory count | Honest read | Blocker |
| --- | --- | --- | --- | --- | --- |
| Vancouver | Already wired | [Business licences](https://opendata.vancouver.ca/explore/dataset/business-licences/) | 3009 current-year food rows plus 2673 current-year service rows | Current official Vancouver inventory is already live locally through the dedicated food and service builders. | None |
| Burnaby | Inventory ready | [Business Licences](https://gis.burnaby.ca/arcgis/rest/services/OpenData/OpenData1/MapServer/17) | 17089 live rows confirmed on 2026-06-24 | Official Burnaby layer metadata, live count, grouped status query, and sample-row pulls all responded cleanly from the current lane. | None |
| Surrey | Inventory ready | [Surrey Business Directory](https://services5.arcgis.com/YRpe0VKTJytZSSIB/arcgis/rest/services/Business%20Licenses/FeatureServer/0) | 26565 live rows confirmed on 2026-06-24 | Official Surrey layer, sample rows, and live count all responded cleanly from the current lane. | None |
| Coquitlam | Inventory ready | [Coquitlam Business Licences](https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/arcgis/rest/services/Business_Licenses/FeatureServer/0) | 5888 live rows confirmed on 2026-06-24 | Official Coquitlam layer metadata, field surface, and live count all responded cleanly from the current lane. | None |
| Richmond | Dataset verified, fetch still blocked | [Richmond Business Directory web map](https://corportal1.richmond.ca/portal/home/item.html?id=65cb888b3d9d495eb42613fa03c6613c) | Not verified | The official Richmond portal exposes public business-directory web maps that reference a live business layer with business-name, address, phone, and email fields. | Direct layer metadata and query calls to the underlying Richmond business service returned Token Required on 2026-06-24, and no public mirror service was confirmed from the current lane. |
| Langley (Township) | Inventory ready | [Business Licenses](https://services5.arcgis.com/frpHL0Fv8koQRVWY/arcgis/rest/services/Business_Licenses/FeatureServer/0) | 8730 live rows confirmed on 2026-06-24 | Official Township of Langley layer, sample rows, and live count all responded cleanly from the current lane. | None |

## Honest read

- Burnaby, Surrey, Coquitlam, and Township of Langley are now real official-source expansion lanes, not just donor spillover or note-based guesses.
- Richmond still has official dataset proof now, but it still needs a repeatable public fetch path before it is honest to call it inventory-ready.
- Richmond is no longer a missing-portal problem. The current blocker is token-gated layer access behind otherwise public city web maps and no confirmed public mirror service.

## Next move

1. Keep using the official inventory builder for Burnaby, Surrey, Coquitlam, and Township of Langley so those rows stay available as a real local research asset.
2. Resolve Richmond fetch behavior so it can join the same builder instead of living as metadata-only proof.
3. Keep the verified metro inventory live inside the local operator database one municipality slice at a time while official-site research narrows the outreach-worthy subset.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 25, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `39` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
