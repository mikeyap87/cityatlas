# Lead Storage Activation Packet

Status: `local_plan_no_provider_write`

CityAtlas currently stores business submissions, newsletter leads, saved items, proof-sprint reply logs, and Brain Runs in local browser storage. That is useful for demos, but not enough for a real operating business.

## What Works Now

- Business review requests can be captured locally.
- Newsletter and intent events can be captured locally.
- Founder CRM replies can be logged locally.
- Readiness and reply-summary artifacts can be regenerated locally.
- No live provider receives customer, prospect, or payment data.

## Why This Matters

To become operational, CityAtlas needs durable lead storage, owner review, export, and eventually automation. The highest-value backend is not a big account system yet; it is a trusted owner database for incoming leads, proof-sprint outcomes, and follow-up decisions.

## Recommended First Backend

Use Supabase after explicit approval.

Initial tables:

- `business_submissions`
- `newsletter_leads`
- `saved_items`
- `growth_events`
- `proof_candidates`
- `manual_reply_logs`
- `brain_runs`
- `audit_logs`

Existing draft: `supabase/schema.sql`

## Required Controls

- Admin-only read access.
- No public write endpoint without spam protection.
- Export path for CSV review.
- Correction/removal workflow.
- Audit log for manual changes.
- Environment variables stored outside code.
- Hosted admin/private preview remain disabled until protected access is approved.

## Activation Steps

1. Approve Supabase project/account and whether this should live under Univenture shared infrastructure.
2. Approve the schema and row-level security policy.
3. Add environment variables to Vercel and local `.env.local`.
4. Create a read/write API layer for submissions and reply logs.
5. Keep payment and outreach separate from lead storage.
6. Run local and hosted smoke tests with fake records only.
7. Turn on production lead capture only after privacy copy and removal workflow are reviewed.

## Still Blocked

- Provider write approval.
- Production environment variables.
- Hosted admin authentication.
- Privacy-policy update for durable storage.
- Spam/abuse controls.
- Real customer data retention decision.

