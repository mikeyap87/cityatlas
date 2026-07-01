# CityAtlas Image Generation

## Current mode

- Tool: built-in `image_gen`
- Scope: place visuals plus route-level mood visuals when a route needs a broader planning image instead of a single venue/place asset
- Destination: `public/assets/places-generated/`
  - Route-level visuals: `public/assets/routes-generated/`
- Export sizes:
  - Standard place cards and guide visuals: `1500x1000`
  - Homepage hero: `1800x770`

## Current guidance

- Generate realistic editorial-style city scenes inspired by the named place.
- Keep the place recognizable through architecture, landscape, or neighborhood cues.
- Avoid readable signs, fake logos, and obvious text artifacts.
- Avoid dominant foreground people unless the image specifically needs human scale.
- Keep the final app copy honest by describing these as illustrated scenes or illustrated place views.
- Route-level visuals should represent the situation or planning mood, not imply that a specific business, exact street, or literal itinerary has been verified from the image itself.

## Current generated place library

- Vancouver: Granville Island Public Market, English Bay Beach, Kitsilano Beach, Queen Elizabeth Park, Commercial Drive, Vancouver Public Library Central Library, VanDusen Botanical Garden, Vancouver Art Gallery, Stanley Park, Gastown, Vancouver Maritime Museum, Beaty Biodiversity Museum, Bill Reid Gallery, Bloedel Conservatory, Chinatown Storytelling Centre, Dr. Sun Yat-Sen Classical Chinese Garden, Museum of Anthropology, Museum of Vancouver, Nitobe Memorial Garden, Jericho Beach, Kitsilano Pool, Locarno Beach, H.R. MacMillan Space Centre, Trout Lake Beach, UBC Botanical Garden
- Toronto: Art Gallery of Ontario, Bentway Staging Grounds, Distillery District, Evergreen Brick Works, Greenheart Treewalk, Harbourfront Centre, Royal Ontario Museum, STACKT market, St. Lawrence Market, Toronto Botanical Garden, Toronto Music Garden

## Current generated route library

- Vancouver Date Night: `public/assets/routes-generated/vancouver-date-night-route-hero-v2.jpg`

## Notes

- The raw generated files remain in the Codex generated-images folder and are not the project source of truth.
- The project-owned deliverables are the normalized JPEGs inside `public/assets/places-generated/`.
- Official-source place images remain in `public/assets/places/` as factual reference material, not the active display layer.
