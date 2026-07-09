# CityAtlas Design System

## Approved Direction

CityAtlas should feel like a calm city guide that makes the first choice obvious. The current approved simplification direction is Lazyweb exact-match, not loose inspiration:

- Mobile navigation follows the selected City Compass Menu pattern: one Menu control, a dark map-texture panel, a circular compass with four quick directions, one center Search action, and secondary links in a clean panel below.
- The homepage starts with the selected One-Question Flow: one short question, two large visual choices, an OR divider, and a small skip link for people who do not want to decide.
- The Vancouver guide hub starts with the selected Three Giant Doors pattern: one question, three illustrated doors, one small browse-everything link, and all deeper guide browsing below the first choice.

## Visual Rules

- Keep first screens quiet, white, and spacious unless the selected pattern needs a dark map panel.
- Use the CityAtlas mark for brand identity. Do not replace it with a generic compass, globe, map, or pin.
- Use deep navy text, CityAtlas green CTAs, soft off-white surfaces, light blue-green borders, and gentle shadows.
- Use large plain-English headlines with short labels. If a child or older nontechnical adult cannot tell what to tap next, simplify again.
- Use illustration-style route/door artwork for choice cards when the job is routing. Use real-looking place imagery when the job is choosing a mood or place.

## Responsive Rules

- Mobile gets the strictest simplification. Show one primary decision first.
- Mobile menus must be scrollable and must not overlap, clip, or hide bottom links.
- Desktop may show more width and polish, but it should not reintroduce competing first decisions.

## Map Truth

- Do not label a drawn route sketch as Google Maps.
- Guide detail route cards may say `Route sketch + timing`.
- Only claim or show a real Google map when the page is rendering a real Maps embed or a Maps handoff.

## Future Codex Rules

- When the owner chooses a Lazyweb hypothesis, match the chosen frame's composition, hierarchy, spacing, CTA placement, and responsive behavior as closely as the codebase allows.
- Do not merge multiple hypotheses after a choice has been made.
- If exact match would require a provider, real map, generated asset, or unavailable data, state the gap plainly and implement only the honest local portion.
