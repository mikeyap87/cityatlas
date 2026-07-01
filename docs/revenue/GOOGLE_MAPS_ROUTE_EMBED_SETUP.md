# CityAtlas Google Maps Route Embed Setup

Generated: 2026-07-01

## Current Truth

CityAtlas route pages already have working Google Maps directions handoff links. Those links use Google Maps URLs with origin, destination, waypoints, and travel mode, and they do not need a Google API key.

Optional embedded on-page Google route previews are code-ready but not live. The app only renders the Google iframe when `VITE_GOOGLE_MAPS_EMBED_API_KEY` is present. Without that key, the public route panel intentionally falls back to the visible stop-order list, route window, typical stop duration, best mode, and Google Maps open-link.

## Current Blocker

Chrome was opened to Google Cloud with `univenturestudio@gmail.com`. Google account 2-step verification is complete, and a clean Google Cloud `CityAtlas` project now exists at project id `cityatlas-501120`.

The remaining blocker is Google's card/free-trial verification step. The Maps Embed API enable flow redirected to "Verify your card to get started." No terms were accepted, no card or billing details were entered, and no Maps Embed API key was created, copied, installed, or deployed.

Do not claim embedded on-page Google maps are live until this is resolved and hosted proof passes.

## Exact Setup Checklist

1. Use the clean Google Cloud `CityAtlas` project at project id `cityatlas-501120`.
2. Complete Google's card/free-trial verification only after owner approval.
3. Enable Maps Embed API only.
4. Create a browser-visible API key.
5. Add website application restrictions for:
   - `https://city.univenturestudio.com/*`
   - approved Vercel preview domains used during release proof
   - local referrers only if needed for local iframe proof
6. Add API restrictions so the key can call Maps Embed API only.
7. Add the key as `VITE_GOOGLE_MAPS_EMBED_API_KEY` in the target environment.
8. Rebuild and run:

```bash
npm run qa:route-maps
npm run qa:route-maps:rendered:compact
```

9. After an explicitly approved production deploy, run:

```bash
npm run qa:route-maps:hosted:compact
```

10. Confirm a hosted route page renders an iframe marked `data-route-map-embed="google"`.

## Readiness Rule

This setup is not required for the tiny request-first paid-traffic test because the Google Maps open-links already work and are locally proven. It is required before using marketing language such as embedded map, on-page Google route preview, or live Google map route on CityAtlas pages.
