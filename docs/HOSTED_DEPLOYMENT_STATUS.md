# Hosted Deployment Status

Date: 2026-06-17

## Vercel

- Team: `michael-yaps-projects-92932836`
- Project: `cityatlas`
- Project ID: `prj_BWFVXVkasM6b3yybiuPHCJFk5fCV`
- Public production alias: `https://cityatlas-one.vercel.app`
- Custom Univenture alias: `https://city.univenturestudio.com`
- Latest production deployment: `dpl_EH4ZGfu6TxX1Erg6dARaNuBGJv7y`
- Latest production deployment URL: `https://cityatlas-rcpxa1sng-michael-yaps-projects-92932836.vercel.app`

## Protection State

- Vercel SSO protection is enabled for production deployment URLs and all previews.
- The public production alias and approved custom domain are intentionally public and now ship with crawlable `robots.txt` for public pages.
- Hosted `/admin` renders the protected operations-route notice because `VITE_CITYATLAS_ENABLE_HOSTED_ADMIN=false`.
- Hosted `/private-preview/date-night` renders the protected route notice because `VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW=false`.
- Hosted `/planner` and `/for-businesses/submit` stay noindex even though the public app is crawlable.
- Live payments, real provider imports, and automated outreach were deployed as disabled.

## Custom Domain

`city.univenturestudio.com` is now attached to the production deployment through Cloudflare DNS and a Vercel alias.

Cloudflare DNS:

```text
Type: A
Name: city.univenturestudio.com
Value: 76.76.21.21
Proxy: DNS-only
TTL: Auto / 1
Record ID: 8ff75b331e538b2f69ef1ee175a4a370
```

Vercel alias:

```text
Source: cityatlas-biybpmrnj-michael-yaps-projects-92932836.vercel.app
Alias: city.univenturestudio.com
Certificate: cert_u3pbkyalMfT35DtAZryQRPMe
```

The custom domain is resolving normally and serving the latest production deployment.

## Public Indexing Release

The approved public indexing release was completed on 2026-06-14. This batch deployed the crawlable robots posture, public-page indexing directives, stronger canonical fallback behavior, and the first answer-first guide cluster while keeping founder/admin routes protected.

## Neighborhood Ranking Batch

The next production batch on 2026-06-14 expanded the live guide library with neighborhood-intent and route-fit pages, updated the public AI context files, and removed noindex routes from the sitemap while keeping founder/admin routes protected.

## Source-Backed Authority Batch

The latest production batch on 2026-06-14 added the first narrow real-world authority wedge: a public source-backed Vancouver date-night starters page, a public editorial standards/corrections page, stronger internal trust linking, updated crawl files, and refreshed legal/trust copy while keeping broader real-business publication gated.

## Guide-Layer Replacement Follow-Through

The final production refinement on 2026-06-14 replaced the most misleading demo-only part of the public date-night guide flow by embedding source-backed Vancouver venue anchors directly into the guide page, removing the demo related-places dependency for that route, and fixing local browser storage merge behavior so current editorial content is not silently overwritten by stale older session data.

## Rainy-Day Authority Batch

The latest production batch on 2026-06-14 added the second narrow real-world authority wedge: a public source-backed Vancouver rainy-day starters page, an embedded rainy-day source-backed section inside the existing rainy-day guide, stronger internal trust links, refreshed crawl/context files, and updated owner-readable docs while keeping broader real-business publication gated.

## First-Evening Visitor Authority Batch

The next production batch on 2026-06-14 added the third narrow real-world authority wedge: a public source-backed Vancouver first-evening starters page, an embedded official-source starter section inside the existing first-evening visitor guide, stronger internal trust links, refreshed crawl/context files, and updated owner-readable docs while keeping broader real-business publication gated.

## 2026-06-15 Public Copy And Crawl Cleanup

The latest production follow-through on 2026-06-15 cleaned internal-sounding public copy across the visible public surface, kept protected routes noindex, preserved the live source-backed starter and guide clusters, refreshed `llms.txt`, and kept the sitemap focused on crawlable guide and starter surfaces instead of the de-emphasized event and offer routes.

## 2026-06-15 IndexNow Activation

The next production follow-through on 2026-06-15 added a root IndexNow ownership key file to the live domain, preserved the same public crawl posture, and submitted the current 46-URL public sitemap set to Bing's IndexNow endpoint so participating search engines could receive a direct freshness signal for the live CityAtlas surface.

## 2026-06-15 Google Search Console Activation

The earlier production follow-through on 2026-06-15 added a Google Search Console verification meta tag to the live homepage, but the later Univenture Studio account pass showed the `https://city.univenturestudio.com/` URL-prefix property still needed a clean re-verification flow inside the correct Google account.

## 2026-06-16 Public Copy Trust Cleanup

The next production follow-through on 2026-06-16 removed internal-style wording from the public homepage, city hub, missions, business, pricing, guide-library, trust, and crawl-context surfaces while keeping the same honest public boundaries about review-first business requests, sample-format pages, and protected noindex routes.

## 2026-06-17 Standalone-Repo Direct Deploy

The next production follow-through on 2026-06-17 deployed the current Vancouver business-coverage and public-copy batch directly from the newly isolated standalone CityAtlas repo after the local branch passed build, growth verification, smoke, and SEO proof. This release kept the same public crawl posture while preserving protected `/admin` and `/private-preview/date-night` routes behind hosted guard screens.

## 2026-06-15 Search Console Reverification

The next live follow-through on 2026-06-15 updated the homepage Google verification token, deployed production build `dpl_2qdDJJDwypndVaW6W7rY4CxvoE87`, verified the `https://city.univenturestudio.com/` URL-prefix property in Search Console under the `Univenture Studio (univenturestudio@gmail.com)` Google account, confirmed the already-submitted sitemap state, and added two high-value guide URLs to Google's priority crawl queue.

## Verified

- Production deploy `dpl_EH4ZGfu6TxX1Erg6dARaNuBGJv7y` completed successfully and now serves the public aliases.
- `curl -I https://city.univenturestudio.com/` returned `HTTP/2 200` after the 2026-06-17 deploy with `last-modified: Wed, 17 Jun 2026 06:46:43 GMT`.
- `npm run seo:smoke:first -- --base-url https://city.univenturestudio.com` passed on 2026-06-17 after the standalone-repo direct deploy and re-verified the hosted first-time-visitor and wellness routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:second -- --base-url https://city.univenturestudio.com` passed on 2026-06-17 after the standalone-repo direct deploy and re-verified the hosted out-of-town guest and weekend-route routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:starterpack -- --base-url https://city.univenturestudio.com` passed on 2026-06-17 after the standalone-repo direct deploy and re-verified the hosted Vancouver starter-pack routing guide, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- Production deploy `dpl_8SsQGqiWzpmJ613znBraq1AXEsxB` completed successfully and now serves the public aliases.
- `npm run seo:smoke:first -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 after the public-copy cleanup deploy and re-verified the hosted first-time-visitor and wellness routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:second -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 after the public-copy cleanup deploy and re-verified the hosted out-of-town guest and weekend-route routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:sunday -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and re-verified the hosted Sunday routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:returning -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and re-verified the hosted returning-visitor routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:kitsilano -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and re-verified the hosted Kitsilano scenic routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:westside -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and re-verified the hosted west-side daytime routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:falsecreek -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and re-verified the hosted False Creek culture routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:ubc -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and re-verified the hosted UBC discovery routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:garden -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and re-verified the hosted garden-day routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:starterpack -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and verified the hosted Vancouver starter-pack routing guide, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:roundup -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and verified the hosted Vancouver guide-roundup routing page, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:lowfriction -- --base-url https://city.univenturestudio.com` passed on 2026-06-16 and verified the hosted Vancouver low-friction routing guide, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- The approved domain now has browser-render hosted smoke proof for all nine Vancouver source-backed wedge pairs plus the three Vancouver routing guides: starter-pack, guide-roundup, and low-friction.
- Production deploy `dpl_2qdDJJDwypndVaW6W7rY4CxvoE87` completed successfully and now serves the public aliases.
- Production deploy `dpl_C8AHpNr9FQtmouwSPt146vFbTQqV` completed successfully and now serves the public aliases.
- The live homepage now returns the `google-site-verification` meta tag with token `TEr2JxYQ9LFLZNP3roSRO-8DV5Kf7Q4eo5Yv9Tyq9fI`.
- Google Search Console verified the `https://city.univenturestudio.com/` property on 2026-06-15 using the homepage HTML tag method in the `Univenture Studio (univenturestudio@gmail.com)` account.
- Google Search Console accepted `https://city.univenturestudio.com/sitemap.xml`, then updated the submitted-sitemaps table to `Success` with `46` discovered pages and `0` discovered videos.
- Google Search Console URL Inspection showed `https://city.univenturestudio.com/vancouver/guides/vancouver-wellness-experiences-to-review` and `https://city.univenturestudio.com/vancouver/guides/how-to-host-an-out-of-town-guest-in-vancouver` as `Discovered - currently not indexed`, then accepted `Request indexing` for both URLs and added them to Google's priority crawl queue.
- Production deploy `dpl_C9pg5MdqK6sFDSrFef8J4JoQd1vp` completed successfully and now serves the public aliases.
- `curl -sS https://city.univenturestudio.com/dfbba41189418b47c2cfad7c3ade83be.txt` returned the matching live IndexNow key.
- `npm run seo:indexnow:submit -- --base-url https://city.univenturestudio.com` returned `202 Accepted` from `https://www.bing.com/indexnow` for the 46-URL live submission batch.
- `npm run seo:smoke:first -- --base-url https://city.univenturestudio.com` passed again after the IndexNow-key deploy and re-verified the hosted first-time-visitor and wellness routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- Production deploy `dpl_6gg6tiDe9ZJHafwDw5pzGcEnZ4YP` completed successfully and now serves the public aliases.
- `npm run seo:smoke:first -- --base-url https://city.univenturestudio.com` passed on 2026-06-15 and verified the hosted first-time-visitor and wellness routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `npm run seo:smoke:second -- --base-url https://city.univenturestudio.com` passed on 2026-06-15 and verified the hosted out-of-town guest and weekend-route routes, protected noindex routes, `sitemap.xml`, and `llms.txt`.
- `curl -sS https://city.univenturestudio.com/llms.txt` now describes current public terms/privacy and uses example-surface wording instead of the older preview phrasing.
- `curl -sS https://city.univenturestudio.com/sitemap.xml` includes the expanded starter and guide library while continuing to omit `/vancouver/events` and `/vancouver/offers`.

- `curl -I https://cityatlas-one.vercel.app/` returned `HTTP/2 200`.
- `curl -sS https://cityatlas-one.vercel.app/robots.txt` returned `Allow: /`, `Disallow: /admin`, `Disallow: /private-preview/`, and `Disallow: /for-businesses/submit`.
- `curl -I https://city.univenturestudio.com/` returned `HTTP/2 200`.
- `curl -I https://city.univenturestudio.com/vancouver/guides/how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice?fresh=2` returned `HTTP/2 200`.
- `curl -I https://city.univenturestudio.com/vancouver/date-night-starters` returned `HTTP/2 200`.
- `curl -I https://city.univenturestudio.com/vancouver/rainy-day-starters` returned `HTTP/2 200`.
- `curl -I https://city.univenturestudio.com/vancouver/first-evening-starters` returned `HTTP/2 200`.
- `curl -I https://city.univenturestudio.com/vancouver/guides/rainy-day-vancouver-plan-coffee-walk-and-reset` returned `HTTP/2 200`.
- `curl -I https://city.univenturestudio.com/vancouver/guides/two-hour-vancouver-visitor-loop-for-a-first-evening` returned `HTTP/2 200`.
- `curl -I https://city.univenturestudio.com/editorial-standards` returned `HTTP/2 200`.
- `curl -sS https://city.univenturestudio.com/robots.txt` returned `Allow: /`, `Disallow: /admin`, `Disallow: /private-preview/`, and `Disallow: /for-businesses/submit`.
- `curl -sS https://city.univenturestudio.com/llms.txt` now returns all three source-backed pages plus the standards/correction path.
- `curl -sS https://city.univenturestudio.com/sitemap.xml` now includes `/vancouver/first-evening-starters`.
- In-app browser rendered `https://city.univenturestudio.com/` with title `CityAtlas | Vancouver Guides, Routes, And Local Discovery`.
- Safari Computer Use rendered `https://city.univenturestudio.com/vancouver/guides/how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice?fresh=2` and showed the source-backed starter section directly inside the guide plus the updated proof note.
- Safari Computer Use rendered `https://city.univenturestudio.com/vancouver/date-night-starters` with the source-backed hero, official-source cards, and correction-path links.
- Headless Chrome rendered `https://city.univenturestudio.com/vancouver/rainy-day-starters` and showed the rainy-day source-backed hero, five official-source cards, and correction-path links.
- Headless Chrome rendered `https://city.univenturestudio.com/vancouver/guides/rainy-day-vancouver-plan-coffee-walk-and-reset` locally before deploy and showed the embedded rainy-day source-backed section plus the updated proof note and rail link.
- In-app browser rendered `https://city.univenturestudio.com/vancouver/first-evening-starters` and showed the first-evening source-backed hero, official-source cards, and correction-path links.
- In-app browser rendered `https://city.univenturestudio.com/vancouver/guides/two-hour-vancouver-visitor-loop-for-a-first-evening` and showed the embedded first-evening source-backed section, updated proof note, and first-evening rail link.
- In-app browser rendered `https://city.univenturestudio.com/admin` and showed `Launch console is protected before hosted sharing.`
- Headless Chrome rendered `https://city.univenturestudio.com/admin` and showed `Launch console is protected before hosted sharing.` plus `Live payments, imports, outreach, and public claims remain disabled.`

## Still Missing On The Approved Domain

- `npm run seo:smoke:toronto -- --base-url https://city.univenturestudio.com` failed on 2026-06-16.
- Hosted `/toronto/guides`, `/toronto/first-time-visitor-starters`, `/toronto/weekend-route-starters`, `/toronto/guides/where-should-a-first-time-toronto-visitor-start`, and `/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day` currently return the Vancouver homepage shell instead of the Toronto pilot surface.
- Hosted `sitemap.xml` and hosted `llms.txt` do not yet include the Toronto pilot routes.
- Toronto remains local-only proof for now, not approved hosted proof.

## Rollback

- Redeploy the previous blocked-robots build or restore the blocked robots posture in source and redeploy production.
- Keep hosted admin/private-preview flags false.
- Remove the Vercel alias or Cloudflare DNS record only if the whole public domain must be taken offline.
