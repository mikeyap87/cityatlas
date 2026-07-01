# CityAtlas Google Maps Route Embed Setup

Generated: 2026-07-01

## Current Truth

CityAtlas route pages already have working Google Maps directions handoff links. Those links use Google Maps URLs with origin, destination, waypoints, and travel mode, and they do not need a Google API key.

Optional embedded on-page Google route previews are now locally proven in this release lane. The app renders the Google iframe when `VITE_GOOGLE_MAPS_EMBED_API_KEY` is present, while still keeping the visible stop-order checklist, route window, typical stop duration, best mode, and Google Maps open-link on the page.

As of July 1, 2026, the owner completed Google setup and provided a browser Maps key outside committed source. The key is installed only in ignored local `.env.local` for this release-lane proof. It is not committed and is not installed in Vercel production by this batch.

Local rendered proof passed with Google iframe presence required:

```bash
CITYATLAS_EXPECT_ROUTE_MAP_EMBED=1 npm run qa:route-maps:rendered:compact
```

That proof checked 41 route surfaces across desktop and mobile, including 35 direct route pages and 6 route-chooser pages, with zero failures.

## Remaining Live Blocker

Do not claim embedded on-page Google maps are live on `city.univenturestudio.com` until the key is added to the approved hosted environment, the release is deployed with explicit approval, and hosted route-map proof passes.

Because the key was pasted through chat during setup, treat it as exposed unless it is already tightly restricted. Before any production deployment, confirm the key is restricted to Maps Embed API only and exact allowed website referrers, or rotate it and install the rotated restricted key.

## Exact Setup Checklist

1. Use the clean Google Cloud `CityAtlas` project at project id `cityatlas-501120`.
2. Enable Maps Embed API only.
3. Create or rotate a browser-visible API key.
4. Add website application restrictions for:
   - `https://city.univenturestudio.com/*`
   - approved Vercel preview domains used during release proof
   - local referrers only if needed for local iframe proof
5. Add API restrictions so the key can call Maps Embed API only.
6. Add the key as `VITE_GOOGLE_MAPS_EMBED_API_KEY` in the target environment.
7. Rebuild and run:

```bash
npm run qa:route-maps
npm run qa:route-maps:rendered:compact
CITYATLAS_EXPECT_ROUTE_MAP_EMBED=1 npm run qa:route-maps:rendered:compact
```

8. After an explicitly approved production deploy, run:

```bash
npm run qa:route-maps:hosted:compact
```

9. Confirm a hosted route page renders an iframe marked `data-route-map-embed="google"`.

## Readiness Rule

This setup is not required for the tiny request-first paid-traffic test because the Google Maps open-links already work and are locally proven. The embedded map is locally proven but not hosted-proven. It is required before using marketing language such as embedded map, on-page Google route preview, or live Google map route on CityAtlas pages.
