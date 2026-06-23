# Changelog

## Unreleased

- Reframed `/admin` as an operator console with workspace tabs, a business-database-first default, top-level preview controls, and a collapsed import lane so the core business workflow is no longer buried in one long scroll.
- Added shorter operator subviews inside the admin business-database workspace so the main operator page can switch between database, queue-cleanup, and business-request views instead of rendering the whole operator stack in one long column.
- Expanded the `/admin` operator database so Vancouver now shows both the official food inventory and the reviewed service-business inventory, with a source filter that cleanly separates combined, service-only, and official-food-only rows.
- Added a focused local Playwright proof script at `scripts/verify-admin-service-inventory.mjs` plus fresh screenshot/report artifacts under `output/qa/admin-service-inventory/`.
- Swapped `npm run build` to a local Vite wrapper at `scripts/build-production.mjs` so CityAtlas can keep producing a real `dist/` even though the native Vite 8 app write path still stalls on the current asset tree.
- Ready for owner review before domain purchase.
- Remaining live-risk work is documented and gated.
- Added local growth, adaptive intelligence, AEO/GEO, and revenue experiment upgrades after initial launch package.
- Added City Missions, planner mission progress, local share staging, growth radar, and Lazyweb-backed design research.
- Added the Vancouver Date Night founder proof sprint, source policy, sales packet, and review-only outreach drafts.
- Added founder CRM candidate queue and private preview operating packet.
- Added private Date Night preview route and manual reply tracker.
- Added rules-based AI Brain command engine, QA checks, next-best-batch recommendation, and saved local Brain Runs.
- Moved CityAtlas into the Univenture workspace and added protected-preview, Stripe, and readiness packets.
- Added hosted route guards, Vercel project/deploy, live Univenture custom domain, Stripe planner decision, generated proof-sprint packet, and no-send proof-sprint approval handoff.
- Added paid-traffic readiness instrumentation for the business funnel, UTM-aware local event tracking, the paid-traffic readiness packet, and `npm run qa:paid-traffic`.

## 2026-06-14 - Shadow outreach and reply-learning pass

- Added Brain shadow-mode outreach ranking for Date Night prospects with primary, confirm-first, backup, and blocked roles.
- Added `docs/proof-sprints/DATE_NIGHT_SHADOW_OUTREACH_RANKING.md` and `output/proof-sprints/date-night-shadow-outreach-ranking.json`.
- Added `npm run replies:analyze` to summarize local Date Night reply CSV outcomes into guarded learning artifacts.
- Added `docs/proof-sprints/DATE_NIGHT_REPLY_SUMMARY.md` and `output/proof-sprints/date-night-reply-summary.json`.
- Upgraded the Flyover contact path from low-confidence unreadable page to medium-confidence general official contact based on official page metadata and structured data.
- Updated readiness average target from 82% to 85%.

## 2026-06-14 - First revenue proof loop pass

- Added official-source contact-path metadata to the Date Night proof candidates.
- Added contact confidence tags to the admin Founder CRM and revenue experiment panels.
- Added `docs/proof-sprints/DATE_NIGHT_CONTACT_PATHS_RESEARCH.md`.
- Added `docs/revenue/DATE_NIGHT_REVENUE_PROOF_LOOP.md`.
- Updated the AI Brain to check contact readiness and package-demand signals before Stripe.
- Updated readiness average from 79% to 82%.

## 2026-06-14 - Custom domain and proof-sprint handoff pass

- Created Cloudflare DNS record `city.univenturestudio.com -> 76.76.21.21` with DNS-only proxying.
- Attached `city.univenturestudio.com` to the CityAtlas production deployment in Vercel and issued HTTPS certificate `cert_u3pbkyalMfT35DtAZryQRPMe`.
- Verified custom-domain HTTPS, robots noindex posture, and hosted `/admin` plus `/private-preview/date-night` gate rendering.
- Added `docs/proof-sprints/DATE_NIGHT_SEND_WINDOW_APPROVAL.md` and generated JSON/CSV handoff files for the first no-send manual proof sprint.
- Updated readiness average from 75% to 79%.

## 2026-06-14 - Hosted Vercel and proof packet pass

- Added hosted runtime flags for admin and private-preview routes.
- Added protected hosted-route notice for `/admin` and `/private-preview/date-night`.
- Fixed Vercel SPA fallback routing and deployed CityAtlas to Vercel.
- Verified public alias `https://cityatlas-one.vercel.app` with hosted route guards and noindex robots.
- Added `city.univenturestudio.com` to Vercel for custom-domain setup.
- Added `npm run proof:sprint` to generate the Date Night 10-prospect proof packet.
- Accepted the Stripe Billing plus hosted Checkout integration plan without creating Stripe account objects.

## 2026-06-14 - Univenture launch lane pass

- Established CityAtlas as `/Users/michaelyap/Documents/Codex/Workspace/univenture/cityatlas`.
- Updated target hosted surface to `city.univenturestudio.com` while keeping deploy/DNS gated.
- Added draft `/terms` and `/privacy` pages.
- Added Goal Charter, Hosting/DNS Approval Packet, Stripe Activation Packet, preliminary name preflight, and Stripe review manifest.
- Added `npm run readiness` to generate module progress and live blockers.

## 2026-06-14 - AI Brain command engine pass

- Upgraded the admin AI Brain from placeholder to a local command engine.
- Added module progress scoring, average progress, next-best-batch recommendation, quality checks, and gap detection.
- Added `BrainRun` model with local saved-run history and audit/growth events.
- Added AI Brain command engine docs and Supabase draft table for future protected backend persistence.

## 2026-06-14 - Private preview and reply tracker pass

- Added `/private-preview/date-night` route for controlled Date Night proof sprint demos.
- Added `ManualReplyLog` model and admin reply tracker for manual outreach conversations.
- Added `manual_reply_logs` Supabase schema draft.
- Updated growth, automation, project, release, runbook, README, and private-preview docs.

## 2026-06-14 - Founder CRM pass

- Added `ProofCandidate` data model and seed candidate queue.
- Added admin Founder CRM panel with source links, fit scores, route angles, approval state, and outreach state.
- Added Founder CRM operating system and private Date Night preview route brief.
- Added Supabase draft table for proof sprint candidates.

## 2026-06-14 - Founder proof sprint pass

- Added `ProofSprint` data model and admin proof sprint panel.
- Selected Vancouver Date Night as the first source-backed founder proof sprint.
- Added source-backed candidate queue, founder partner sales packet, real-world source policy, and review-only outreach drafts.
- Updated commercialization, growth, launch gate, automation, README, and schema docs for the proof sprint workflow.

## 2026-06-14 - City Missions and world-class growth pass

- Added `CityMission` and `GrowthPlay` data models.
- Added `/vancouver/missions` route with mission cards, route timelines, save-all actions, sponsor angles, and local progress.
- Added mission cards to homepage and Vancouver discovery.
- Upgraded planner with mission-step progress, recommended routes, and local share-draft staging.
- Added owner growth radar to admin console.
- Added mission route SEO metadata, JSON-LD ItemList, sitemap entry, and llms.txt entry.
- Added Lazyweb design research report and local visual evidence under `.lazyweb/design-research/cityatlas-missions-2026-06-14/`.
- Tightened responsive mission-card layout and verified true 390px CSS viewport captures with no horizontal overflow.

## 2026-06-13 - Growth and visibility upgrade

- Added local event tracking, save/planner loop, referral codes, and adaptive next-best action.
- Added homepage growth variants via query params.
- Added revenue experiment records and admin growth intelligence panels.
- Added AEO/GEO assets: route metadata, JSON-LD, robots, sitemap, and llms.txt.
- Strengthened business package conversion copy with 7-day deliverables and objection handling.

## 2026-06-13 - Launch-ready pre-domain product package

- Created fresh React/Vite project structure.
- Built public CityAtlas discovery site for Vancouver.
- Added business pricing and submission flows with payment acceptance disabled.
- Added owner launch console with gates, audit log, partner candidates, local request queue, and AI Brain placeholders.
- Added generated design reference and launch-safe hero media.
- Added project docs, launch gates, QA checklist, and Supabase schema draft.
