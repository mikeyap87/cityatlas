# CityAtlas Search Submission Next Action Packet

Date: 2026-06-16

## What Is Already Done

- `https://city.univenturestudio.com` is live and crawlable.
- `robots.txt` allows the public guide and discovery surface while blocking `/admin`, `/private-preview/`, and `/for-businesses/submit`.
- `sitemap.xml` is live on the approved public domain.
- `llms.txt` is live on the approved public domain.
- The root IndexNow key file is live at:

```text
https://city.univenturestudio.com/dfbba41189418b47c2cfad7c3ade83be.txt
```

- The 46-URL live Vancouver-first CityAtlas set was submitted to Bing's IndexNow endpoint and accepted for validation on 2026-06-15.
- The live homepage now serves the Google Search Console verification tag token `TEr2JxYQ9LFLZNP3roSRO-8DV5Kf7Q4eo5Yv9Tyq9fI`.
- Google Search Console verified the `https://city.univenturestudio.com/` URL-prefix property on 2026-06-15 inside the `Univenture Studio (univenturestudio@gmail.com)` Google account using the homepage HTML tag method.
- Google Search Console accepted `Request indexing` for these confirmed live priority URLs during the re-verification pass:

```text
https://city.univenturestudio.com/vancouver/guides/vancouver-wellness-experiences-to-review
https://city.univenturestudio.com/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver
```

## What Is Still Blocked

The Google property-access blocker is cleared for the currently verified account.

The remaining uncertainty is no longer submission access. It is Google-side processing time:

- the Search Console overview currently shows `Processing data, please check again in a day or so` for Performance and Indexing
- the submitted sitemap and requested URLs still need normal Google recrawl and processing time
- the current hosted domain still exposes the Vancouver-first live crawl set only, while the local repo now stages a 51-route sitemap that includes the Toronto preview cluster
- the hosted Toronto routes are still blocked by the current live fallback to the Vancouver shell, so another Google request pass before a Toronto release would be lower value than fixing the live Toronto payload first

## Account Boundary

Future CityAtlas Google work should keep using the open Chrome profile that already exposes the verified CityAtlas Search Console property.

## Google Submission Result

Submitted sitemap:

```text
https://city.univenturestudio.com/sitemap.xml
```

Historical verified Search Console sitemap state:

```text
/sitemap.xml -> Success
Discovered pages -> 46
Discovered videos -> 0
```

Current live read-only truth on June 16, 2026:

```text
Search Console overview -> Processing data, please check again in a day or so
Live hosted robots.txt -> Public crawl allowed, protected routes blocked
Live hosted sitemap.xml -> Vancouver-first set only, Toronto routes still missing
Live hosted llms.txt -> Vancouver-first set only, Toronto routes still missing
Local repo sitemap.xml -> 51 routes, including the Toronto preview cluster
```

## Highest-Value Next Google Requests

If a follow-through Google pass is worth doing later, the next safest sequence is:

1. release the Toronto guide hub plus the two Toronto starter-guide pairs on the approved domain
2. wait for the Search Console property to move past the current processing state
3. then inspect the now-live Toronto routes rather than burning more requests on already-live Vancouver pages

If a manual URL-inspection pass is worth doing after Toronto goes live, the highest-value first candidates are:

1. `https://city.univenturestudio.com/toronto/guides`
2. `https://city.univenturestudio.com/toronto/first-time-visitor-starters`
3. `https://city.univenturestudio.com/toronto/guides/where-should-a-first-time-toronto-visitor-start`
4. `https://city.univenturestudio.com/toronto/weekend-route-starters`
5. `https://city.univenturestudio.com/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day`

## Bing Follow-Through

If Bing Webmaster access is available later, use it to:

1. verify the property
2. confirm sitemap processing
3. review IndexNow Insights for accepted and indexed URLs

## Owner Need

No owner action is required for crawl submission right now.

The strongest next owner-level live step is no longer another Google click. It is approving the Toronto hosted-release packet so the second-city cluster can actually become crawlable on the approved domain before the next Search Console review.

<!-- CURRENT_SHARED_MACHINE_TRUTH:START -->
## Current Shared Machine Truth

- Synced June 16, 2026 from current repo truth.
- Current local machine truth: `41` useful pieces, `25` guides, `16` source-backed wedge collections, `80` source-backed anchors, and `16` mapped guide-to-collection links.
- all `25` current guides now have at least one direct-path internal link into another CityAtlas page.
- `npm run seo:structure:proof` currently passes across `38` key routes.
<!-- CURRENT_SHARED_MACHINE_TRUTH:END -->
