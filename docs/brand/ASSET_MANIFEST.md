# CityAtlas Asset Manifest

## Brand Assets

| Asset | Path | Purpose | Source Of Truth |
| --- | --- | --- | --- |
| Primary mark | `public/brand/cityatlas-mark.svg` | Brand mark for docs, decks, avatars, and generated derivatives. | Yes |
| Logo lockup | `public/brand/cityatlas-lockup.svg` | Mark plus wordmark for packets, decks, and handoff docs. | Derived from primary mark |
| Favicon | `public/favicon.svg` | Browser tab and small app identity. | Derived from primary mark |
| React icon | `src/components/Icons.tsx` -> `CityAtlasMarkIcon` | App header and UI usage. | Mirrors primary mark |

## Usage Notes

- Keep the header wordmark as live text for accessibility and responsiveness.
- Generate PNG or platform-specific app icons from `public/brand/cityatlas-mark.svg` only after the final domain/app-channel decision.
- Keep favicon updates in `index.html`.
- Do not mix older generic `MapIcon` branding into the header.

## Next Brand Assets To Create

- 1200x630 social preview image for public sharing.
- Simple founder-packet cover page.
- Square profile/avatar export if social channels are opened.
- Partner-packet PDF header once real outreach follow-up is approved.
