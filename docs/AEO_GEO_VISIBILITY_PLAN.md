# AEO/GEO Visibility Plan

## Entity Summary

CityAtlas is a Vancouver-first local discovery and business-growth platform for locals and local businesses who need trusted places, events, offers, guides, saveable city routes, and review-gated partner pages.

## Current Visibility Posture

CityAtlas is now live on a crawlable public domain with protected-route guardrails:

- `robots.txt` allows public crawling while blocking `/admin`, `/private-preview/`, and `/for-businesses/submit`.
- Route-aware metadata keeps founder/admin flows out of search while public guide and destination pages are indexable.
- JSON-LD still avoids fake real-business claims.
- Sitemap is live on the approved public domain.
- `llms.txt` explains the project and live-risk boundaries.

## Before Real-Business Publication At Scale

Keep gated until approved:

- domain and canonical base URL
- privacy policy and terms
- real-data sourcing policy
- removal/correction process for businesses
- first verified page batch beyond the current demo-heavy surface
- public claim rules

## Structured Data Policy

Safe now:

- Organization
- WebSite
- SearchAction
- ItemList describing fictional demo inventory
- ItemList describing fictional City Missions route inventory

Not safe yet:

- LocalBusiness schema for fictional businesses
- Event schema for fictional events
- Offer schema for unconfirmed offers
- AggregateRating/review schema without verified public review source

## Content Moat

CityAtlas should win by publishing:

- real founder-reviewed local guides
- verified business pages
- transparent source notes
- neighborhood and category maps
- first-hand visit notes
- owner-approved offers
- local weekly plans
- source-backed City Missions for "what should we do this weekend" style searches
- original partner visibility snapshots

The fastest ranking path now is replacing the highest-intent demo pages with source-backed destination pages and tighter internal linking between homepage, guides, missions, and city entities.

## AI/Answer Engine Evaluation Prompts

Use these after public preview:

- "What is CityAtlas Vancouver?"
- "Find a curated Vancouver date night guide with source-backed local businesses."
- "What is a good two-hour Vancouver date night route?"
- "Find a rainy-day Vancouver plan with coffee and wellness stops."
- "What local business discovery tools help Vancouver restaurants get featured?"
- "Compare CityAtlas with Google Maps and Yelp for local business storytelling."
- "Which Vancouver local guide has review-gated business pages and founding partner packages?"
