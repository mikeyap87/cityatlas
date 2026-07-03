# Hosting And DNS Approval Packet

Date: 2026-06-14

## Recommendation

Use `city.univenturestudio.com` as the first hosted surface, not a purchased standalone domain yet.

Why:

- It keeps CityAtlas inside Univenture while the name remains provisional.
- It avoids buying a domain before name/trademark comfort.
- It gives businesses a credible parent-company signal.
- It can later redirect to a standalone domain if CityAtlas earns traction.

## Target

- Vercel project name: `cityatlas`
- Vercel project ID: `prj_BWFVXVkasM6b3yybiuPHCJFk5fCV`
- Current public Vercel alias: `https://cityatlas-one.vercel.app`
- Custom Univenture domain: `https://city.univenturestudio.com`
- Owner-facing local folder: `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`
- Current local port: `5178`

## Required For Safe Hosted Release

1. Keep `VITE_CITYATLAS_ENABLE_HOSTED_ADMIN=false` unless admin access is protected outside the static app.
2. Keep `VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW=false` unless the deployment is protected and the sharing list is approved.
3. Keep robots public only for approved pages; keep `/admin`, `/private-preview/*`, and `/for-businesses/submit` blocked from crawl.
4. Keep payment flags false.
5. Keep real provider import and outreach flags false.
6. Keep demo/source-warning copy visible.
7. Confirm no secrets are committed.

## Proposed Vercel Environment

Preview and production should both start with:

```env
VITE_CITYATLAS_ENABLE_LIVE_PAYMENTS=false
VITE_CITYATLAS_ENABLE_REAL_PROVIDER_IMPORTS=false
VITE_CITYATLAS_ENABLE_AUTOMATED_OUTREACH=false
VITE_CITYATLAS_ENABLE_HOSTED_ADMIN=false
VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW=false
VITE_CITYATLAS_PUBLIC_BASE_URL=https://city.univenturestudio.com
```

Do not add Stripe, Supabase, analytics, AI, email, or CRM secrets until their own approval packets are complete.

The app now also blocks `/admin` and `/private-preview/date-night` on non-localhost runtimes unless the two hosted-route flags above are explicitly enabled.

## Cloudflare DNS Status

Vercel domain setup and Cloudflare DNS are complete for the Univenture subdomain.

- Record type: A
- Name: `city.univenturestudio.com`
- Target: `76.76.21.21`
- Proxy mode: DNS-only
- TTL: automatic / `1`
- Cloudflare DNS record ID: `8ff75b331e538b2f69ef1ee175a4a370`
- Vercel source deployment: `cityatlas-biybpmrnj-michael-yaps-projects-92932836.vercel.app`
- Vercel certificate: `cert_u3pbkyalMfT35DtAZryQRPMe`

Do not widen crawl beyond approved public pages or enable hosted admin/private-preview flags as a follow-up DNS change.

## Rollback

- Remove the `city.univenturestudio.com` alias from Vercel.
- Remove or disable the Cloudflare `city` A record.
- Keep the local project unchanged.

## Post-Deploy Smoke

Checked:

- `/`
- `/for-businesses/pricing`
- `/terms`
- `/privacy`
- `/private-preview/date-night`
- `/admin` protection behavior
- `robots.txt`
- no payment checkout appears

## Current State

The DNS/alias cutover has been performed, and public indexing on `city.univenturestudio.com` was approved and released on 2026-06-14. Further approval is still required before hosted admin/private-preview exposure, Stripe setup, provider imports, scaled customer outreach, or real-business publication.
