# Competitor Pattern Briefs

These are pattern translations, not copied designs or proprietary workflows.

## 1. Google Business Profile Completeness Loop

Pattern: businesses understand what is missing from their profile and what improves visibility.

CityAtlas version:

- page readiness checklist
- media/category/description/offer completeness
- source status
- owner next action

Implemented now:

- business page readiness
- admin content inventory

Next:

- business owner portal with missing-field tasks

## 2. Yelp Claim And Owner Response Flow

Pattern: business owners need a reason to claim and manage their page.

CityAtlas version:

- claim/update request
- founder review
- visibility snapshot
- partner package recommendation

Implemented now:

- submit business flow
- local review queue

Next:

- claim-token flow after auth/backend approval

## 3. Eventbrite Event Promotion Layer

Pattern: event operators need publishable event pages, RSVPs, and promotion packages.

CityAtlas version:

- event modules
- safety/capacity notes
- neighborhood/event guide placement
- future promoter package

Implemented now:

- event cards and review-gated event data

Next:

- event submission form and calendar feed after source policy approval

## 4. The Infatuation / Time Out Editorial Utility

Pattern: people trust curated guides that answer specific local questions.

CityAtlas version:

- answer-first guides
- "best for" tags
- neighborhood/category pages
- source notes and partner disclosures

Implemented now:

- guides and best-for metadata

Next:

- verified editorial templates and first-hand visit notes

## 5. Mapstr / Foursquare Save Loop

Pattern: users return when saved places become useful lists and plans.

CityAtlas version:

- planner route
- saved local picks
- share draft
- future account collections

Implemented now:

- local saved items and planner

Next:

- account-backed collections after privacy/auth approval

## 6. Tripsy / KAYAK Itinerary Object

Pattern: planning tools are stronger when details become one organized trip object instead of scattered cards.

CityAtlas version:

- City Missions as short local routes
- save-all route action
- planner progress
- share draft

Implemented now:

- `/vancouver/missions`
- planner mission-step progress
- local `city_mission_saved` and `planner_share_draft_prepared` events

Next:

- account-backed mission history after auth/privacy approval

Source notes:

- Lazyweb Tripsy planner result, accessed June 14, 2026.
- Tripsy public homepage, https://tripsy.app/, accessed June 14, 2026.

## 7. Michelin-Style City Guide Depth

Pattern: strong city guides combine editorial framing, searchable utility, topical sections, and FAQs.

CityAtlas version:

- mission pages as answer-first route pages
- category/neighborhood guide structure
- future public FAQs and source-backed visit notes

Implemented now:

- route-level mission proof
- guide cards linked into missions
- AEO/GEO metadata and JSON-LD support

Next:

- verified editorial templates, first-hand notes, and public FAQs after source policy approval

Source notes:

- Lazyweb Michelin city guide result, accessed June 14, 2026.
- Michelin New York City guide, https://guide.michelin.com/us/en/travel-guide/new-york-city, accessed June 14, 2026.

## 8. Partiful-Style Social Intent

Pattern: discovery spreads faster when the next action is inviting someone into a plan.

CityAtlas version:

- mission share prompt
- local share-draft staging
- future invite/referral flow

Implemented now:

- mission `sharePrompt`
- planner `Stage share draft` action that records locally and sends nothing

Next:

- consented sharing and referral attribution after account/privacy approval

Source notes:

- Lazyweb Partiful Discover result, accessed June 14, 2026.
- Partiful Discover, https://partiful.com/discover, accessed June 14, 2026.
