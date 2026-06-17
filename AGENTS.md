# CityAtlas Agent Instructions

CityAtlas is a Univenture Studio project for local discovery and local-business growth. The durable project folder is `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`.

Keep this lane separate from other Univenture apps unless the owner explicitly asks for integration.

## Working Style

- Prefer small reversible changes with clear business impact.
- Keep live-risk actions gated: Vercel deploys, Cloudflare DNS, Stripe/payment acceptance, real provider imports, public publishing, automated outreach, legal/trademark steps, and real customer data.
- Do not add dependencies casually.
- Search existing files before adding duplicate helpers, data models, styles, or docs.
- Keep public claims conservative and source-backed.
- Follow `docs/brand/BRAND_GUIDE.md` for brand/visual work. Use `CityAtlasMarkIcon`, `public/brand/cityatlas-mark.svg`, and `public/favicon.svg` for identity instead of generic map icons.
- Treat the first six Date Night emails as already sent manually and logged. Held rows, follow-ups, additional sends, automated outreach, and public claims remain gated.

## Project Shape

- App source lives in `src/`.
- Public media and design references live in `public/`.
- Operator docs live in `docs/`.
- Brand assets live in `public/brand/`; brand rules live in `docs/brand/`.
- Supabase planning lives in `supabase/schema.sql`.
- Local URL is `http://127.0.0.1:5178/`.
- Current hosted domain is `city.univenturestudio.com`; public routes are crawlable while hosted admin/private-preview flags stay disabled.

## QA Expectation

Run these before handoff when relevant:

```bash
npm run typecheck
npm run build
npm run readiness
```

For UI changes, run the local app and check desktop and mobile rendering. Do not call the package launch-ready if the first viewport is blank, clipped, overflowing, or if primary forms/buttons are inert.

## Live-Risk Rule

Do not execute these without explicit owner approval:

- buy or configure a domain
- deploy publicly
- enable Stripe or any payment acceptance
- import real business/provider data
- send outreach, email, DMs, or notifications
- publish real business pages, offers, events, or guides
- add secrets to code

When approval is needed, ask with the exact action and risk boundary.
