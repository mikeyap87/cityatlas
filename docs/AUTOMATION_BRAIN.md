# Automation Brain

## Automation North Star

CityAtlas should eventually discover local opportunities, draft source-backed pages, score partner fit, propose outreach, prepare content, measure outcomes, and recommend the next best revenue action with the owner approving only high-risk moves.

## Current Stage

Stage 1 to 2: manual intake plus assisted automation.

Current safe automation:

- local page readiness scoring
- local growth event capture
- local City Mission saves and planner share-draft capture
- local revenue experiment records
- local proof sprint records
- local founder CRM candidate ranking
- local contact-path confidence scoring
- local shadow-mode outreach ranking
- local manual reply logging
- local reply-summary generation
- local next-best-action recommendations
- local module-progress scoring
- local QA checks
- local Brain Run snapshots
- review-gated package and submission flow

## AI Brain Loop

Input:

- business submissions
- local saves
- City Mission progress
- newsletter leads
- growth events
- content inventory
- launch gates
- future verified source records

Understanding:

- classify visitor intent
- identify mission/category intent
- score content coverage
- rank partner candidates
- rank proof sprint candidates
- score contact-path readiness
- score dry-run send/no-send roles
- identify missing proof
- classify package interest
- detect package-demand language in replies

Decision:

- recommend next best action
- choose outreach priority
- choose package test
- choose content gap
- recommend the next mission to verify, publish, or sponsor
- recommend the next proof sprint candidate batch
- recommend which candidate needs source review, preview approval, or manual follow-up
- recommend which candidate needs contact-path confirmation before outreach
- summarize manual reply CSVs into objections, package demand, concerns, and next actions
- mark live-risk gates ready for review
- save local Brain Runs so progress can be compared over time

Action:

- local-only draft, queue, or recommendation
- local-only Brain Run save
- no public send, payment, provider import, or publish without approval

Outcome:

- review request
- reply
- hosted collaboration
- paid partner
- save/share
- city mission save or share-draft intent
- newsletter lead

Learning:

- update experiments
- update partner scoring
- update objection handling
- update project docs and future playbooks

## Graduation Ladder

1. Manual intake: current forms and seed review.
2. Assisted automation: local scoring, drafts, and next-best actions.
3. Shadow mode: system proposes outreach and pages from verified data but sends/publishes nothing. The Date Night proof sprint now has this for candidate ordering.
4. Supervised execution: owner approves limited sends and verified page publishing.
5. Constrained autopilot: capped, allowlisted partner follow-ups and content refreshes.

## Current Command Engine

The admin console now runs a rules-based command engine. It reads the local CityAtlas data graph, then produces:

- module progress percentages
- next-best-batch recommendation
- priority action recommendations
- payment/source/contact/protection/reply-learning/package-demand QA checks
- shadow-mode outreach roles
- open gap list
- saved local Brain Run history

This is not an AI-provider integration yet. The next useful intelligence upgrade is outcome comparison: compare the Brain's shadow ranking against owner choices and real reply quality after the first manual proof loop produces outcomes.

## Guardrails

- approval for domain, deploy, payments, provider imports, public publishing, and outreach
- audit log for every automation
- dry-run first for external actions
- source records required for real claims
- account/privacy approval required before real mission sharing or referral attribution
- budget caps for paid providers
- rollback path for live pages
