# AI Brain Command Engine

## Purpose

The CityAtlas AI Brain is the owner-facing command layer for deciding what to do next. In this package it is rules-based and local-only. It does not call an AI provider, send outreach, publish pages, import data, or accept payments.

## What It Reads

- Launch gates
- Public content inventory
- City Missions
- Revenue experiments
- Founder proof sprint records
- Proof candidate queue
- Proof candidate contact-path confidence
- Shadow-mode outreach ranking
- Manual reply logs
- Local reply-summary output
- Local growth events
- Local business submissions

## What It Produces

- Module progress percentages
- Next-best-batch recommendation
- Priority action recommendations
- QA checks for payment safety, source coverage, contact readiness, admin protection, package demand, and sales-learning signal
- Dry-run send/no-send roles for proof sprint candidates
- Gap detection
- Saved local Brain Run history

## Current Automation Level

Stage: assisted automation.

The engine can summarize state, detect gaps, shadow-rank proof sprint candidates, and recommend the next safest batch. It cannot execute live work. The first live-risk step remains owner-approved manual outreach or protected preview sharing.

## Saved Brain Runs

The admin console includes a `Save run` action. This stores a local `BrainRun` record in browser storage and creates local audit/growth events. It is useful for tracking whether the project is improving over time without connecting a CRM, analytics provider, or AI API.

Saved run fields:

- stage
- summary
- top recommendation
- top gate
- open gap count
- average module progress
- created timestamp

## QA Checks

The current checks are intentionally blunt:

- Payment safety: passes only while the payment gate is locked.
- Candidate source coverage: passes when the first proof queue has enough sourced candidates.
- Contact-path readiness: reviews official-source contact confidence before any send.
- Shadow outreach ranking: passes only when there are enough send-ready candidates and no blocked manual lookups.
- Admin/private preview protection: passes while hosted owner routes stay gated.
- Sales learning signal: blocked until replies are logged from owner-approved conversations.
- Package demand signal: blocked until reply logs include pricing, package, or partnership demand.

## Graduation Path

1. Keep using the rules-based local Brain while outreach is unproven.
2. Use the generated shadow outreach ranking to compare the Brain's dry-run choices against the owner's approved recipient list.
3. After the first 10 to 20 manual conversations, run the local reply analyzer and add objection clustering plus package-demand summaries.
4. Add provider-backed AI summaries only after API-key, privacy, spend, and data-retention approval.
5. Add CRM sync only after account, consent, unsubscribe, and rollback policy are approved.

## Next Best Batch

Review the shadow ranking, approve exact recipients/channel/copy only when ready, manually run the first proof sprint, log replies, run `npm run replies:analyze`, then let the Brain summarize objections and package demand before Stripe setup.
