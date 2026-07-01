# CityAtlas Business Reply Automation Playbook

Date: 2026-07-01

## Current Automation Verdict

The CityAtlas business reply and outreach automation lane must remain safe, local-first, and no-send.

The app can rehearse inbound reply handling in `/admin`, mirror clean packets into protected local memory, and replay bridge-ready rows into local business reply memory. It must not connect a live inbox, send follow-ups, sync a CRM, import provider data, or publish real-business claims without separate owner approval.

## What Is Allowed

- Read current repo docs and generated packets.
- Rehearse reply parsing with local or pasted preview payloads.
- Update local proof docs after verified outcomes.
- Summarize what is verified, missing, blocked, and next.
- Keep the paid-traffic packet and readiness docs aligned with current production truth.
- Recommend exact owner next moves for manual review.

## What Is Not Allowed

- Sending outreach or follow-up emails.
- Creating or changing Resend, Gmail, CRM, Stripe, ad-platform, or provider account objects.
- Importing live provider data.
- Completing payments or refunds.
- Publishing real-business feature claims.
- Treating local reply rehearsal as a live inbox integration.

## Daily Automation Safe Run

1. Check whether there are new owner-provided replies, bounces, or checkout proof notes.
2. If no new evidence exists, leave a short no-op status.
3. If new evidence exists, update the appropriate local proof packet and readiness summary.
4. Keep proof tiers separate:
   - local proof
   - browser proof
   - hosted proof
   - Stripe/account proof
   - paid-spend proof
5. Stop before any send, provider write, payment action, or ad spend.

## Escalate To Owner Only When

- A real business reply needs a human response.
- A bounce or wrong-contact result changes the next safe outreach action.
- A real City Partner checkout proof is ready to review.
- Paid traffic is ready to start and needs budget/platform approval.
- Any provider account write, send, payment, refund, or public claim change is required.

## Current Revenue Boundary

CityAtlas is honest for a tiny request-first paid-traffic test into reviewed business requests. It is not fully charge-ready or fully self-serve verified until one real successful City Partner checkout is completed and reviewed by the owner.
