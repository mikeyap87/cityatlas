# World-Class Growth Playbook

## Current Verdict

CityAtlas should grow around repeatable city routes, not a flat directory. The product now has the first version of that loop: City Missions create a plan, the planner saves it, the share draft creates social intent, and the admin growth radar turns consumer behavior into business proof.

## Pattern Sources

- Tripsy and KAYAK-style itinerary management: organize scattered details into a single plan.
- Michelin-style city guides: use editorial depth, topical sections, utility, and FAQs.
- Partiful/Fever-style discovery: make local plans feel social and invite-worthy.
- Yelp/Google Business Profile-style trust loops: show businesses what is missing and why it matters.
- Notion-style collections: make saved sets reusable, portable, and personally meaningful.

## What We Implemented Locally

- `/vancouver/missions` route.
- Three fictional launch-safe missions.
- Mission cards on homepage and Vancouver discovery.
- Save-full-mission action.
- Planner mission progress.
- Local share-draft staging.
- `city_mission_saved` and `planner_share_draft_prepared` event tracking.
- Admin growth radar explaining the product pattern, metric, status, and live gate.
- Lazyweb report with current-state screenshots and reference captures.
- Founder proof sprint panel in the admin console.

## First Wedge

Run the first real-world proof sprint around Vancouver Date Night.

Reason:

- Strong consumer sharing behavior.
- Obvious route format: dinner, dessert, cocktail, culture, or experience.
- High-quality local businesses can understand the offer quickly.
- Missions make the value concrete: CityAtlas sells placement inside a plan, not a generic listing.

Supporting assets:

- `docs/PROOF_SPRINT_DATE_NIGHT.md`
- `docs/FOUNDER_PARTNER_SALES_PACKET.md`
- `docs/OUTREACH_DRAFTS_REVIEW_ONLY.md`
- `docs/REAL_WORLD_SOURCE_POLICY.md`

## What To Build Next

1. **Mission claim pages**
   - Public landing pages for each real mission.
   - Needs verified content and claim-safe source policy; public indexing is already live on approved pages.

2. **Account-backed collections**
   - Users save missions across sessions and devices.
   - Needs auth, privacy policy, account deletion, and data export decisions.

3. **Referral and invite tracking**
   - Mission links with attribution.
   - Needs anti-abuse, consent, unsubscribe rules, and analytics approval.

4. **Business demand snapshots**
   - Show a partner how many saves, mission adds, and requests their category produced.
   - Needs real analytics and claim-safe reporting language.

5. **Creator route kits**
   - Package a mission into creator visit notes, shot list, sponsor angle, and guide placement.
   - Needs creator terms and business consent.

## Do Not Do Yet

- Do not send real invites.
- Do not claim real mission popularity.
- Do not publish fictional businesses as real.
- Do not turn on payment acceptance.
- Do not use provider data without source, terms, and attribution approval.
