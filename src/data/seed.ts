import type { CityAtlasData } from "../types";

const now = "2026-06-13T12:00:00.000Z";

const demoAudit = {
  status: "published" as const,
  trustLevel: "fictional_seed" as const,
  sourceIds: ["src-demo"],
  aiAssisted: false,
  reviewRequired: true,
  createdAt: now,
  updatedAt: now,
  publishedAt: now,
};

const sourceBackedBusinessCheckedAt = "2026-06-19T16:00:00.000Z";

const sourceBackedBusinessAudit = (sourceIds: string[]) => ({
  status: "published" as const,
  trustLevel: "verified_by_admin" as const,
  sourceIds,
  aiAssisted: false,
  reviewRequired: false,
  createdAt: sourceBackedBusinessCheckedAt,
  updatedAt: sourceBackedBusinessCheckedAt,
  publishedAt: sourceBackedBusinessCheckedAt,
});

export const seedData: CityAtlasData = {
  sources: [
    {
      id: "src-demo",
      label: "Example listing details",
      type: "demo_seed",
      verified: false,
      notes:
        "Used to show the public listing layout only. Replace with supported, source-backed records before any real business page is treated as public fact.",
      updatedAt: now,
    },
    {
      id: "src-founder-review",
      label: "Business details queue",
      type: "founder_review",
      verified: true,
      notes:
        "Manual review is required before any real listing, offer, event, or outreach is published.",
      updatedAt: now,
    },
    {
      id: "src-biz-published-on-main",
      label: "Published on Main official website",
      type: "public_link",
      url: "https://publishedonmain.com/",
      verified: true,
      notes:
        "Official website, contact details, and venue imagery checked for the Vancouver source-backed business page.",
      updatedAt: sourceBackedBusinessCheckedAt,
    },
    {
      id: "src-biz-kissa-tanto",
      label: "Kissa Tanto official website",
      type: "public_link",
      url: "https://www.kissatanto.com/",
      verified: true,
      notes:
        "Official website, address block, reservation guidance, and venue imagery checked for the Vancouver source-backed business page.",
      updatedAt: sourceBackedBusinessCheckedAt,
    },
    {
      id: "src-biz-labattoir",
      label: "L'Abattoir official website",
      type: "public_link",
      url: "https://www.labattoir.ca/",
      verified: true,
      notes:
        "Official website, contact details, and venue imagery checked for the Vancouver source-backed business page.",
      updatedAt: sourceBackedBusinessCheckedAt,
    },
    {
      id: "src-biz-miku",
      label: "Miku Vancouver official website",
      type: "public_link",
      url: "https://mikurestaurant.com/contact/",
      verified: true,
      notes:
        "Official contact page, reservation guidance, and venue imagery checked for the Vancouver source-backed business page.",
      updatedAt: sourceBackedBusinessCheckedAt,
    },
    {
      id: "src-biz-botanist",
      label: "Botanist official website",
      type: "public_link",
      url: "https://www.botanistrestaurant.com/location/botanist/",
      verified: true,
      notes:
        "Official location page, contact details, and venue imagery checked for the Vancouver source-backed business page.",
      updatedAt: sourceBackedBusinessCheckedAt,
    },
  ],
  businesses: [
    {
      ...sourceBackedBusinessAudit(["src-biz-published-on-main", "src-founder-review"]),
      id: "biz-harbour-table",
      name: "Published on Main",
      slug: "published-on-main",
      category: "Restaurants",
      subcategories: ["Dinner", "Celebration", "Main Street"],
      neighborhood: "Main Street",
      city: "Vancouver",
      address: "3593 Main Street, Vancouver, BC V5V 3N4",
      phone: "(604) 423-4840",
      website: "https://publishedonmain.com/",
      instagram: "https://www.instagram.com/publishedonmain/",
      bookingUrl: "https://publishedonmain.com/events/",
      heroImage: "/assets/businesses/published-on-main-dining-room.png",
      gallery: [
        "/assets/businesses/published-on-main-dining-room.png",
      ],
      shortDescription:
        "A Main Street dinner anchor for celebration nights, group dinners, and compact two-stop plans.",
      fullDescription:
        "Published on Main works best when the plan needs one clear Main Street dinner anchor and the rest of the evening can stay compact. CityAtlas uses the official site here for the address, contact path, and group-booking context.",
      highlights: [
        "Main Street Vancouver address on the official site",
        "Public group-booking path for parties of 7 to 12 guests",
        "Good fit for compact Main Street evening plans",
      ],
      bestFor: ["Celebration dinners", "Main Street plans", "Compact two-stop nights"],
      featured: true,
      claimedStatus: "unclaimed",
      partnerFitScore: 96,
      visibilityScore: 88,
      pageReadiness: {
        profile: true,
        media: true,
        categories: true,
        description: true,
        offer: false,
      },
    },
    {
      ...sourceBackedBusinessAudit(["src-biz-kissa-tanto", "src-founder-review"]),
      id: "biz-rainline-coffee",
      name: "Kissa Tanto",
      slug: "kissa-tanto",
      category: "Restaurants",
      subcategories: ["Dinner", "Reservations", "Chinatown"],
      neighborhood: "Chinatown",
      city: "Vancouver",
      address: "263 East Pender Street, Vancouver, BC V6A 1T8",
      phone: "(778) 379-8078",
      website: "https://www.kissatanto.com/",
      instagram: "https://www.instagram.com/kissatanto/",
      bookingUrl: "https://www.kissatanto.com/",
      heroImage: "/assets/businesses/kissa-tanto-booth.webp",
      gallery: [
        "/assets/businesses/kissa-tanto-booth.webp",
      ],
      shortDescription:
        "A Chinatown dinner page for reservation-first nights, smaller groups, and more intimate plans.",
      fullDescription:
        "Kissa Tanto is useful when the plan wants a smaller-room Chinatown dinner anchor and a straightforward official reservation path. CityAtlas keeps the page focused on the official address, the contact route, and where this fits in a night out.",
      highlights: [
        "Official site confirms the East Pender Street address",
        "Reservations are handled through the official site and Tock",
        "Good fit for intimate Chinatown dinner plans",
      ],
      bestFor: ["Intimate dinners", "Chinatown routes", "Reservation-first plans"],
      featured: true,
      claimedStatus: "unclaimed",
      partnerFitScore: 94,
      visibilityScore: 86,
      pageReadiness: {
        profile: true,
        media: true,
        categories: true,
        description: true,
        offer: false,
      },
    },
    {
      ...sourceBackedBusinessAudit(["src-biz-labattoir", "src-founder-review"]),
      id: "biz-north-shore-recovery",
      name: "L'Abattoir",
      slug: "labattoir",
      category: "Restaurant and bar",
      subcategories: ["Gastown", "Dinner", "Drinks"],
      neighborhood: "Gastown",
      city: "Vancouver",
      address: "217 Carrall Street, Vancouver, BC V6B 2J2",
      phone: "604.568.1701",
      website: "https://www.labattoir.ca/",
      instagram: "https://www.instagram.com/labattoir_van/",
      bookingUrl: "https://www.labattoir.ca/private-dining",
      heroImage: "/assets/businesses/labattoir-dining-room.webp",
      gallery: [
        "/assets/businesses/labattoir-dining-room.webp",
      ],
      shortDescription:
        "A Gastown dinner-and-drinks page for nights that want one strong anchor without crossing the city twice.",
      fullDescription:
        "L'Abattoir works when the night needs a Gastown anchor that can support dinner-first plans or a more flexible dinner-and-drinks route. CityAtlas uses the official site here for the address, contact details, and private-dining context.",
      highlights: [
        "Gastown Vancouver address confirmed on the official site",
        "Public reservation and contact path on the official site",
        "Private-dining details available through the official page",
      ],
      bestFor: ["Gastown evenings", "Dinner and drinks", "Group-friendly planning"],
      featured: true,
      claimedStatus: "unclaimed",
      partnerFitScore: 92,
      visibilityScore: 84,
      pageReadiness: {
        profile: true,
        media: true,
        categories: true,
        description: true,
        offer: false,
      },
    },
    {
      ...sourceBackedBusinessAudit(["src-biz-miku", "src-founder-review"]),
      id: "biz-seaside-cycle",
      name: "Miku Vancouver",
      slug: "miku-vancouver",
      category: "Restaurants",
      subcategories: ["Waterfront", "Dinner", "Visitors"],
      neighborhood: "Waterfront",
      city: "Vancouver",
      address: "70-200 Granville Street, Granville Square, Vancouver, BC V6C 1S4",
      phone: "",
      website: "https://mikurestaurant.com/",
      instagram: "",
      bookingUrl: "https://mikurestaurant.com/contact/",
      heroImage: "/assets/businesses/miku-waterfront-dining-room.png",
      gallery: ["/assets/businesses/miku-waterfront-dining-room.png"],
      shortDescription:
        "A waterfront dinner page for visitor-friendly nights, celebration routes, and easy reservation-first plans.",
      fullDescription:
        "Miku Vancouver is a useful waterfront dinner anchor when the plan needs clear location details, an official reservation path, and a route that still feels easy for locals or first-time visitors.",
      highlights: [
        "Granville Square contact page with access guidance on the official site",
        "OpenTable reservation path listed on the official contact page",
        "Waterfront fit that works well for first-evening or celebration plans",
      ],
      bestFor: ["Waterfront evenings", "Reservation-first dinners", "Visitor-friendly plans"],
      featured: true,
      claimedStatus: "unclaimed",
      partnerFitScore: 90,
      visibilityScore: 82,
      pageReadiness: {
        profile: true,
        media: true,
        categories: true,
        description: true,
        offer: false,
      },
    },
    {
      ...sourceBackedBusinessAudit(["src-biz-botanist", "src-founder-review"]),
      id: "biz-botanist",
      name: "Botanist",
      slug: "botanist",
      category: "Restaurant and cocktail bar",
      subcategories: ["Dinner", "Cocktails", "Downtown"],
      neighborhood: "Canada Place",
      city: "Vancouver",
      address: "1038 Canada Place, Vancouver, BC V6C 0B9",
      phone: "604-695-5500",
      website: "https://www.botanistrestaurant.com/",
      instagram: "https://instagram.com/botanistdining/",
      bookingUrl: "https://www.botanistrestaurant.com/location/botanist/",
      heroImage: "/assets/businesses/botanist-dining-room.jpg",
      gallery: ["/assets/businesses/botanist-dining-room.jpg"],
      shortDescription:
        "A polished downtown dinner page for nights that want a refined room, simple reservations, and one clear next stop.",
      fullDescription:
        "Botanist is a good fit when the plan needs a polished Vancouver dinner or cocktail setting without a complicated route. CityAtlas uses the official location page here for the address, contact details, and public hours context.",
      highlights: [
        "Official location page with address, phone, and contact email",
        "Public hours listed on the official location page",
        "Good fit for polished dinner or cocktail-first plans",
      ],
      bestFor: ["Polished dinners", "Celebration routes", "Downtown plans"],
      featured: true,
      claimedStatus: "unclaimed",
      partnerFitScore: 91,
      visibilityScore: 83,
      pageReadiness: {
        profile: true,
        media: true,
        categories: true,
        description: true,
        offer: false,
      },
    },
  ],
  events: [
    {
      ...demoAudit,
      id: "event-market-night",
      title: "Mount Pleasant Night Market",
      slug: "mount-pleasant-night-market",
      category: "Markets",
      neighborhood: "Mount Pleasant",
      venue: "Fictional community lane",
      date: "2026-07-04",
      time: "6:30 PM",
      priceLabel: "Free admission",
      capacity: 160,
      image: "/assets/places-generated/granville-island-public-market-generated.jpg",
      description:
        "A neighborhood night market pick with local food, light wandering, and easy add-to-plan value.",
      safetyNotes:
        "Confirm vendor details and live event information with the host or official source before relying on this page.",
      rsvps: 47,
    },
    {
      ...demoAudit,
      id: "event-kits-flow",
      title: "Kits Beach Rope Flow Session",
      slug: "kits-beach-rope-flow-session",
      category: "Wellness",
      neighborhood: "Kitsilano",
      venue: "Kits Beach shoreline lawn",
      date: "2026-06-28",
      time: "9:00 AM",
      priceLabel: "By donation",
      capacity: 24,
      image: "/assets/places-generated/kitsilano-beach-generated.jpg",
      description:
        "A sunrise rope-flow session for beach movement, fresh air, and easy weekend energy.",
      safetyNotes:
        "Physical events need verified host, waiver, capacity, and safety review before public promotion.",
      rsvps: 14,
    },
  ],
  offers: [
    {
      ...demoAudit,
      id: "offer-dessert",
      previewBusinessId: "biz-harbour-table",
      title: "Sample late-night add-on",
      description:
        "A sample follow-through card showing how a dinner page could frame one simple after-dinner add-on once the timing and terms are confirmed.",
      redemptionInstructions:
        "Preview only. The exact add-on, timing, and redemption rules would be checked before anything goes public.",
      endDate: "2026-07-15",
      claimCount: 18,
      maxClaims: 80,
      featured: true,
    },
    {
      ...demoAudit,
      id: "offer-recovery",
      previewBusinessId: "biz-seaside-cycle",
      title: "Sample first-visit add-on",
      description:
        "A sample visitor-friendly add-on card showing how a waterfront page could frame one clear extra step once the details are confirmed.",
      redemptionInstructions:
        "Preview only. The exact timing, inclusion details, and redemption rules would be checked before anything goes public.",
      endDate: "2026-07-30",
      claimCount: 9,
      maxClaims: 40,
      featured: true,
    },
  ],
  guides: [
    {
      ...demoAudit,
      id: "guide-date-night",
      title: "How To Plan A Vancouver Date Night Without Crossing The City Twice",
      slug: "how-to-plan-a-vancouver-date-night-without-crossing-the-city-twice",
      queryClass: "how to plan a Vancouver date night",
      cluster: "Date night",
      category: "Date Night",
      neighborhood: "Vancouver",
      excerpt:
        "A route-first page for couples who want one good neighborhood, one strong dinner anchor, and one easy next stop.",
      body:
        "This page shows the kind of answer-first local guide CityAtlas should publish. It avoids fake superlatives and focuses on how to choose a route that feels easy to execute in real life.",
      summary:
        "A Vancouver date-night guide that helps people choose one neighborhood, one dinner anchor, and one simple follow-up instead of building a scattered plan.",
      audience:
        "Locals, couples, and visitors who want a confident evening plan without wasting time on cross-city logistics.",
      promise:
        "The strongest Vancouver date night is usually one compact route with a clear mood, a reliable dinner anchor, and an easy second stop nearby.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 8,
      lastReviewed: "June 14, 2026",
      bestFor: ["Couples", "Visitors", "Friday night planning"],
      heroQuestion: "What kind of Vancouver date night plan actually feels smooth?",
      intro:
        "Most date-night guides get bloated fast. The better move is to choose a neighborhood first, then match the rest of the night to the energy of that one area.",
      sections: [
        {
          heading: "Start with one neighborhood, not a giant city bucket list",
          answer:
            "Pick the part of Vancouver you want to be in before you choose the exact business.",
          bullets: [
            "Gastown works when you want dinner to feel like the centerpiece.",
            "Mount Pleasant works when you want something lower-pressure and more flexible.",
            "Kitsilano works when the weather is good and you want movement or scenery in the plan.",
          ],
        },
        {
          heading: "Choose one anchor stop that defines the mood",
          answer:
            "The highest-friction decision is the main stop, so choose that first and let the rest of the night stay lightweight.",
          bullets: [
            "A dinner anchor makes sense when the goal is focus and fewer decisions.",
            "A cafe or dessert anchor makes sense when you want a shorter or more casual plan.",
            "The second stop should be close enough to feel optional, not mandatory.",
          ],
        },
        {
          heading: "Leave space for one easy follow-up",
          answer:
            "A strong city plan feels generous when it ends with an easy next move, not another heavy reservation.",
          bullets: [
            "Use a dessert, coffee, or waterfront walk as the flexible finish.",
            "Keep transit and parking friction low by staying compact.",
            "If the weather turns, swap the walk for an indoor backup before you leave home.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the biggest mistake in Vancouver date-night planning?",
          answer:
            "Trying to do too much across too many neighborhoods. One tighter route usually feels better than three ambitious stops.",
        },
        {
          question: "Should a date-night guide list the best restaurant in the city?",
          answer:
            "Not without real sourcing. CityAtlas now pairs this route guide with a narrow official-source starter layer, but it still avoids pretending one universal winner fits every plan.",
        },
      ],
      resourceLinks: [
        {
          title: "Date-night starters",
          path: "/vancouver/date-night-starters",
          description:
            "Use this first when the plan needs real Vancouver anchors with official source notes and visible claim boundaries instead of route logic alone.",
        },
        {
          title: "Neighborhood chooser",
          path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
          description:
            "Open this when the first decision is still which part of Vancouver should carry the mood of the night.",
        },
        {
          title: "Low-pressure first-date guide",
          path: "/vancouver/guides/which-vancouver-neighborhood-fits-a-low-pressure-first-date",
          description:
            "Use this when the real problem is making the evening feel easier and more flexible, not just more impressive.",
        },
        {
          title: "Two-stop night guide",
          path: "/vancouver/guides/how-to-plan-a-two-stop-vancouver-night-without-transit-drag",
          description:
            "Open this when the next step is keeping one dinner-led anchor and one follow-up compact.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver anchors, while the broader listing system still needs reviewed businesses, current hours, and wider source-backed route notes.",
      proofSource: "Neighborhood route logic paired with official-source Vancouver date-night starter pages",
      gateDecision: "needs_real_sources",
      internalLinkTarget: "/vancouver/missions",
      ctaLabel: "Open the date-night mission",
      ctaPath: "/vancouver/missions",
      relatedBusinessIds: ["biz-harbour-table", "biz-rainline-coffee"],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-rainy-day",
      title: "Rainy Day Vancouver Plan: Coffee, Walk, And Reset",
      slug: "rainy-day-vancouver-plan-coffee-walk-and-reset",
      queryClass: "rainy day Vancouver plan",
      cluster: "Rainy day",
      category: "Rainy Day",
      neighborhood: "Vancouver",
      excerpt:
        "A rainy-day guide built around one warm indoor stop, one short movement break, and one low-effort reset.",
      body:
        "This is the kind of practical city guidance CityAtlas can own: not generic tourism copy, but clear route logic for real moods and real weather.",
      summary:
        "A simple rainy-day Vancouver plan built around warmth, low friction, and one good reason to leave the house.",
      audience:
        "Locals or visitors who want an easy plan when the weather is grey and decision fatigue is high.",
      promise:
        "The best rainy-day plan is not a packed itinerary. It is one warm anchor, one short reset, and one backup if the weather gets worse.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Rainy weekends", "Visitors", "Low-energy city plans"],
      heroQuestion: "What makes a rainy-day Vancouver plan actually worth doing?",
      intro:
        "On wet days, people do not need ten options. They need one route that feels warm, simple, and easy to commit to.",
      sections: [
        {
          heading: "Use coffee or brunch as the anchor",
          answer:
            "A warm indoor stop lowers planning resistance and gives the rest of the route a stable center.",
          bullets: [
            "Choose the anchor by neighborhood convenience first.",
            "Look for a stop that can hold both conversation time and a reset moment.",
            "Keep the first leg short enough that weather does not kill the plan before it starts.",
          ],
        },
        {
          heading: "Pair it with one short movement or browse window",
          answer:
            "A five-to-fifteen-minute second act keeps the plan from feeling static without turning it into a major outing.",
          bullets: [
            "Use a covered stroll, small retail lane, or waterfront check-in when conditions allow.",
            "If the rain intensifies, switch to a nearby indoor browse stop instead.",
            "The key is momentum, not distance.",
          ],
        },
        {
          heading: "Decide the stop-after only if the energy is still good",
          answer:
            "A third stop should be optional and earned by how the day feels, not forced in advance.",
          bullets: [
            "Dessert, tea, or a quiet lounge works better than another long transit jump.",
            "Keep backup choices inside the same neighborhood.",
            "A good rainy-day route should still feel complete if you stop after two moves.",
          ],
        },
      ],
      faqs: [
        {
          question: "What should a rainy-day city guide prioritize?",
          answer:
            "Low friction, comfort, and one easy fallback. People need confidence more than endless options on weather-dependent days.",
        },
        {
          question: "How should CityAtlas make rainy-day pages different from generic tourism posts?",
          answer:
            "By focusing on route logic, neighborhood fit, and a narrow official-source starter layer instead of generic attractions lists.",
        },
      ],
      resourceLinks: [
        {
          title: "Rainy-day starters",
          path: "/vancouver/rainy-day-starters",
          description:
            "Use this first when the plan needs real Vancouver grey-weather anchors with official source notes and visible claim boundaries.",
        },
        {
          title: "Low-friction route chooser",
          path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
          description:
            "Open this when the main question is which calmer CityAtlas page fits the current energy level, not just the weather.",
        },
        {
          title: "Wellness reset guide",
          path: "/vancouver/guides/vancouver-wellness-experiences-to-review",
          description:
            "Use this when the route should lean more toward decompression and believable reset pacing than coffee-and-browse logic.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Open this when you want the broader CityAtlas route map after deciding the plan should stay lower-friction.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver rainy-day anchors, while broader coffee, neighborhood-timing, and live operational details still need reviewed source notes.",
      proofSource: "Rainy-day route logic paired with official-source Vancouver rainy-day starter pages",
      gateDecision: "needs_real_sources",
      internalLinkTarget: "/planner",
      ctaLabel: "Build a planner route",
      ctaPath: "/planner",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-wellness",
      title: "Vancouver Wellness Reset: How To Build A Recovery Hour",
      slug: "vancouver-wellness-experiences-to-review",
      queryClass: "Vancouver wellness reset",
      cluster: "Wellness",
      category: "Wellness",
      neighborhood: "Vancouver",
      excerpt:
        "A wellness guide that helps people choose a calm, believable reset instead of chasing exaggerated recovery promises.",
      body:
        "This guide is designed to show how CityAtlas can publish wellness content without drifting into medical or exaggerated benefit claims.",
      summary:
        "A Vancouver wellness-reset guide that prioritizes pacing, fit, and realistic expectations over hype.",
      audience:
        "People planning a recovery hour, calm afternoon, or low-pressure wellness outing in Vancouver.",
      promise:
        "A good recovery plan should feel clear and calming before it feels impressive.",
      image: "/assets/wellness-session-room.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["Recovery days", "Calm afternoons", "Wellness-curious locals"],
      heroQuestion: "How should someone choose a Vancouver wellness reset without falling for hype?",
      intro:
        "Wellness content gets weak when it tries to promise transformation. Stronger guidance helps people decide what kind of reset they actually need first.",
      sections: [
        {
          heading: "Choose the kind of reset before the venue",
          answer:
            "People usually need either movement, hands-on recovery, or a slower calm-hour. That decision matters more than picking a brand name first.",
          bullets: [
            "Movement fits when energy is flat and the body needs circulation.",
            "Recovery services fit when soreness or tension is the real issue.",
            "A slower calm-hour fits when overstimulation is the bigger problem than fatigue.",
          ],
        },
        {
          heading: "Avoid making wellness feel like a performance project",
          answer:
            "The right plan should feel supportive and believable, not like a challenge to optimize every habit at once.",
          bullets: [
            "Keep the route short and the transition time low.",
            "Do not stack too many recovery steps into one outing.",
            "Use practical cues like neighborhood, budget, and session length to narrow choices.",
          ],
        },
        {
          heading: "Treat claims carefully and keep the guidance grounded",
          answer:
            "CityAtlas should explain category fit, prep expectations, and safety boundaries without implying treatment outcomes.",
          bullets: [
            "Use source-backed language for class times, amenities, and logistics.",
            "Avoid diagnostic or medical language in public guide copy.",
            "Add extra review to any health, body, or wellness guidance before launch.",
          ],
        },
      ],
      faqs: [
        {
          question: "What makes a wellness guide trustworthy?",
          answer:
            "Clear boundaries, realistic expectations, and practical planning help. It should not sound like treatment advice or inflated benefit marketing.",
        },
        {
          question: "How can CityAtlas make wellness pages useful without overclaiming?",
          answer:
            "Focus on fit, logistics, atmosphere, and route planning. Leave treatment claims out unless they are verified and appropriate.",
        },
      ],
      resourceLinks: [
        {
          title: "Wellness reset starters",
          path: "/vancouver/wellness-reset-starters",
          description:
            "Use this first when the plan needs real Vancouver reset anchors with official public-source notes and visible claim boundaries.",
        },
        {
          title: "Low-effort Sunday guide",
          path: "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
          description:
            "Open this when the route needs a calmer Sunday pacing model instead of a broader recovery-hour frame.",
        },
        {
          title: "Starter-pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Use this when the first problem is choosing the right CityAtlas page before the calmer route gets overbuilt.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Open this when you want the broader CityAtlas route map after deciding the plan should stay lower-friction.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver reset anchors, while broader treatment-style claims, exact service fit, and live operational details still need reviewed source notes.",
      proofSource:
        "Wellness route framing paired with official-source Vancouver wellness reset starter pages",
      gateDecision: "needs_real_sources",
      internalLinkTarget: "/vancouver/missions",
      ctaLabel: "Review wellness missions",
      ctaPath: "/vancouver/missions",
      relatedBusinessIds: [],
      relatedEventIds: ["event-kits-flow"],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-cafe",
      title: "How To Pick A Work-Friendly Vancouver Cafe",
      slug: "how-to-pick-a-work-friendly-vancouver-cafe",
      queryClass: "work-friendly cafe Vancouver",
      cluster: "Cafes",
      category: "Cafes",
      neighborhood: "Vancouver",
      excerpt:
        "A practical guide for choosing the right cafe for focus, conversation, or a quick planning session.",
      body:
        "CityAtlas can earn trust by helping people choose for the moment they are in, not by pretending every cafe is best for everything.",
      summary:
        "A work-friendly cafe guide that helps readers choose by energy, timebox, and neighborhood instead of generic best-of claims.",
      audience:
        "Remote workers, students, and locals looking for a short focused session in Vancouver.",
      promise:
        "The right work-friendly cafe depends on your timebox, noise tolerance, and whether you need deep focus or casual conversation.",
      image: "/assets/vancouver-rainline-cafe-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Laptop sessions", "Coffee dates", "Solo planning blocks"],
      heroQuestion: "What should you actually look for in a work-friendly Vancouver cafe?",
      intro:
        "People search for the best cafe, but what they really need is the right cafe for the kind of hour they are trying to have.",
      sections: [
        {
          heading: "Match the cafe to the kind of work block",
          answer:
            "A ninety-minute focus session and a casual catch-up need different environments.",
          bullets: [
            "Deep-focus sessions need fewer interruptions and predictable seating.",
            "Conversation sessions can tolerate more background energy.",
            "Quick reset stops should be judged by convenience and ease, not perfection.",
          ],
        },
        {
          heading: "Neighborhood convenience usually matters more than perfection",
          answer:
            "A good-enough place nearby often beats a supposedly perfect place that adds friction to the day.",
          bullets: [
            "Keep commute and parking pain low when the work block is short.",
            "Use nearby errands, meetings, or walking routes to narrow the choice.",
            "A work-friendly page should help readers decide fast, not browse forever.",
          ],
        },
        {
          heading: "Turn cafe guides into route decisions, not just lists",
          answer:
            "The strongest CityAtlas cafe pages should link into missions, neighborhoods, and next-step plans.",
          bullets: [
            "Pair cafes with a short walk, follow-up stop, or planner save action.",
            "Connect the page to nearby businesses only when the logic is clear.",
            "Use cafe pages to support both local discovery and business visibility paths.",
          ],
        },
      ],
      faqs: [
        {
          question: "Should CityAtlas publish a best cafes page right away?",
          answer:
            "Only after real sourcing is approved. Before that, it is safer and more useful to publish decision frameworks and route logic.",
        },
        {
          question: "What makes a cafe guide better for AI visibility?",
          answer:
            "Clear audience fit, question-style headings, and practical decision help make the page easier to summarize and recommend.",
        },
      ],
      resourceLinks: [
        {
          title: "Rainy-day guide",
          path: "/vancouver/guides/rainy-day-vancouver-plan-coffee-walk-and-reset",
          description:
            "Open this when the work block is really a grey-weather route decision and one warm anchor matters more than a cafe comparison frame.",
        },
        {
          title: "Mount Pleasant starter guide",
          path: "/vancouver/guides/mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
          description:
            "Use this when the stronger next move is choosing the neighborhood rhythm around a cafe session instead of judging cafes in the abstract.",
        },
        {
          title: "Low-friction route chooser",
          path: "/vancouver/guides/which-low-friction-vancouver-route-should-you-open-today",
          description:
            "Open this when the main question is which easy CityAtlas route fits the current energy and timebox best.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Use this when you want the broader CityAtlas route map after deciding the plan is more about pacing and fit than one exact cafe page.",
        },
      ],
      proofNote:
        "Publishable cafe recommendations need current source checks, neighborhood notes, and honest guidance about work-friendliness criteria.",
      proofSource: "Neighborhood and workflow criteria validated against reviewed business pages",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/vancouver",
      ctaLabel: "Explore Vancouver discovery",
      ctaPath: "/vancouver",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-visitor-loop",
      title: "Two-Hour Vancouver Visitor Loop For A First Evening",
      slug: "two-hour-vancouver-visitor-loop-for-a-first-evening",
      queryClass: "first evening in Vancouver what to do",
      cluster: "Visitors",
      category: "Visitors",
      neighborhood: "Vancouver",
      excerpt:
        "A compact guide for first-evening visitors who want one simple plan instead of a complicated itinerary.",
      body:
        "This page shows how CityAtlas can become useful for travel discovery by publishing short, believable loops that reduce planning friction.",
      summary:
        "A first-evening Vancouver loop guide for visitors who want one easy plan, not a full itinerary overhaul.",
      audience:
        "Visitors, weekend guests, and locals planning a light intro route for someone new to the city.",
      promise:
        "A first-evening plan should make someone feel oriented and relaxed, not overscheduled.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["First-night visitors", "Weekend trips", "Hosts planning for guests"],
      heroQuestion: "What is a good first-evening Vancouver plan when you do not want to overthink it?",
      intro:
        "First evenings are not for city mastery. They are for getting oriented, eating well, and ending the night wanting more.",
      sections: [
        {
          heading: "Keep the loop compact enough to feel welcoming",
          answer:
            "A first-evening route works best when it introduces the city without making someone navigate too much too fast.",
          bullets: [
            "Choose one neighborhood with clear character.",
            "Use an anchor stop that feels easy to find and easy to enjoy.",
            "Finish near transit, parking, or the hotel zone when possible.",
          ],
        },
        {
          heading: "Mix one view, one food moment, and one flexible close",
          answer:
            "That balance makes the evening memorable without becoming exhausting.",
          bullets: [
            "The view gives the route a sense of place.",
            "The food stop gives it emotional weight.",
            "The flexible close lets the night end naturally instead of feeling forced.",
          ],
        },
        {
          heading: "Write for confidence, not city overload",
          answer:
            "Visitor content should help someone say yes to one plan quickly.",
          bullets: [
            "Explain why the loop works in plain language.",
            "Keep the route logic obvious and the transitions short.",
            "Use internal links to deeper neighborhood or category pages for people who want more.",
          ],
        },
      ],
      faqs: [
        {
          question: "What should a first-evening city guide avoid?",
          answer:
            "Too many stops, too much transit, and too many claims about must-see attractions. The goal is comfort and confidence.",
        },
        {
          question: "Why is a short visitor loop useful for CityAtlas?",
          answer:
            "Because it turns broad travel intent into a specific plan that can connect to source-backed anchors, missions, and saved itineraries.",
        },
      ],
      resourceLinks: [
        {
          title: "First-evening starters",
          path: "/vancouver/first-evening-starters",
          description:
            "Use this first when the plan needs one real Vancouver first-evening anchor with official source notes and visible claim boundaries.",
        },
        {
          title: "First-time visitor guide",
          path: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
          description:
            "Open this when the bigger question is where a first Vancouver visit should begin, not just how night one should feel.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Use this when you already know the situation and want the fastest route into the strongest CityAtlas cluster.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver visitor anchors, while broader neighborhood timing, exact dining fit, and wider business coverage still need reviewed source notes.",
      proofSource:
        "Visitor route logic paired with official-source Vancouver first-evening starter pages",
      gateDecision: "needs_real_sources",
      internalLinkTarget: "/planner",
      ctaLabel: "Save a city plan",
      ctaPath: "/planner",
      relatedBusinessIds: ["biz-harbour-table", "biz-seaside-cycle"],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-first-time-visitor-start",
      title: "Where Should A First-Time Vancouver Visitor Start? A Simple Area Guide",
      slug: "where-should-a-first-time-vancouver-visitor-start",
      queryClass: "where should a first time visitor start in Vancouver",
      cluster: "Visitors",
      category: "Destination Choice",
      neighborhood: "Gastown, Granville Island, Stanley Park, Queen Elizabeth Park, Downtown",
      excerpt:
        "A destination-choice guide for first-time Vancouver visitors who want one good starting area instead of an overbuilt first day.",
      body:
        "This page is designed to answer a common travel-discovery problem early: not what every visitor must do, but where someone should start so the rest of the city becomes easier to navigate.",
      summary:
        "A Vancouver destination-choice guide that helps first-time visitors choose the right starting area based on mood, time, and how much structure they want.",
      audience:
        "First-time Vancouver visitors, weekend guests, and locals hosting someone new to the city.",
      promise:
        "The best first Vancouver start is the one that matches the kind of arrival someone wants, not the loudest generic must-see list.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["First-time visitors", "Hosts planning for guests", "Short city intros"],
      heroQuestion: "Where should a first-time Vancouver visitor actually start?",
      intro:
        "Most first-time visitor guides collapse because they try to cover the whole city at once. A better start is choosing one part of Vancouver that matches the kind of introduction someone wants.",
      sections: [
        {
          heading: "Choose Gastown when atmosphere and historic-core energy should do most of the work",
          answer:
            "Gastown is useful when a first-time visitor wants an old-core feel, a short walk from major transit or cruise-arrival infrastructure, and a night that can move naturally into dinner or a drink.",
          bullets: [
            "Use it when the city should feel textured and atmospheric immediately.",
            "It is a stronger fit for visitors who want a tighter historic-core experience than for people chasing quiet scenery.",
            "Keep the route compact so the neighborhood itself carries the mood.",
          ],
        },
        {
          heading: "Choose Granville Island when food variety and low-pressure browsing matter most",
          answer:
            "Granville Island works well when the first visit should feel easy, snackable, and flexible instead of reservation-heavy or transit-heavy.",
          bullets: [
            "Use it when the visitor wants choices without needing a rigid plan.",
            "It is a good fit for earlier arrivals, mixed tastes, and casual conversation time.",
            "Let the market and surrounding area do most of the pacing instead of stacking many stops.",
          ],
        },
        {
          heading: "Choose Stanley Park when scenery and breathing room matter more than indoor density",
          answer:
            "Stanley Park is strongest when the first Vancouver impression should be visual, outdoor, and calm instead of packed with decisions.",
          bullets: [
            "Use it when weather and daylight can carry part of the experience.",
            "It works best when the route needs one strong view and one easy follow-up instead of many destinations.",
            "If energy is low, keep the plan to one walk-led anchor and one nearby close.",
          ],
        },
        {
          heading: "Choose Queen Elizabeth Park or the downtown cultural core when you want either views or a central indoor anchor",
          answer:
            "Queen Elizabeth Park suits visitors who want a calmer scenic reset, while the downtown cultural core works better when weather, timing, or hotel location makes a central indoor start easier.",
          bullets: [
            "Use Queen Elizabeth Park when the first impression should feel spacious and elevated.",
            "Use the downtown cultural core when an indoor museum or gallery anchor makes the arrival easier.",
            "Both starts are better when the route stays simple instead of trying to combine too many far-apart neighborhoods.",
          ],
        },
      ],
      faqs: [
        {
          question: "Should a first-time Vancouver guide claim one universal best area?",
          answer:
            "No. A stronger guide explains which starting area fits which kind of arrival instead of pretending every visitor wants the same first impression.",
        },
        {
          question: "What should a first-time visitor start page avoid?",
          answer:
            "Generic must-see lists, fake insider certainty, and scattered cross-city itineraries. The goal is fast confidence, not information overload.",
        },
      ],
      resourceLinks: [
        {
          title: "First-time visitor starters",
          path: "/vancouver/first-time-visitor-starters",
          description:
            "Use this first when the plan needs real Vancouver starting areas with official public-source notes and visible claim boundaries.",
        },
        {
          title: "Returning-visitor guide",
          path: "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
          description:
            "Open this next when the first trip is already covered and the city plan should feel more local on a second look.",
        },
        {
          title: "Starter-pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Use this when the first question is still which CityAtlas page belongs to the moment at all.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Open this when you want the broader CityAtlas route map after choosing the first-visit cluster.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver starting areas, while broader itinerary, dining, and live operational details still need reviewed source notes.",
      proofSource:
        "Destination-choice logic paired with official-source Vancouver first-time visitor starter pages",
      gateDecision: "needs_real_sources",
      sourceBackedCollection: "vancouver_first_time_visitor_starters",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Browse more Vancouver guides",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-first-time-toronto-start",
      title: "Where Should A First-Time Toronto Visitor Start? A Simple Area Guide",
      slug: "where-should-a-first-time-toronto-visitor-start",
      citySlug: "toronto",
      cityName: "Toronto",
      regionName: "Ontario",
      queryClass: "where should a first time visitor start in Toronto",
      cluster: "Visitors",
      category: "Destination Choice",
      neighborhood: "Distillery District, St. Lawrence Market, Harbourfront, ROM, AGO",
      excerpt:
        "A destination-choice guide for first-time Toronto visitors who want one good starting area instead of an overbuilt first day.",
      body:
        "This page is designed to answer a common travel-discovery problem early: not what every visitor must do, but where someone should start so the rest of Toronto becomes easier to navigate.",
      summary:
        "A Toronto destination-choice guide that helps first-time visitors choose the right starting area based on mood, time, and how much structure they want.",
      audience:
        "First-time Toronto visitors, weekend guests, and locals hosting someone new to the city.",
      promise:
        "The best first Toronto start is the one that matches the kind of arrival someone wants, not the loudest generic must-see list.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 16, 2026",
      bestFor: ["First-time visitors", "Hosts planning for guests", "Short city intros"],
      heroQuestion: "Where should a first-time Toronto visitor actually start?",
      intro:
        "Most first-time visitor guides collapse because they try to cover the whole city at once. A better start is choosing one part of Toronto that matches the kind of introduction someone wants.",
      sections: [
        {
          heading: "Choose the Distillery District when atmosphere and walkable dinner spillover should do most of the work",
          answer:
            "The Distillery District is useful when a first-time visitor wants historic-lane atmosphere, a strong dining-and-art mix, and one compact area that already feels like a plan.",
          bullets: [
            "Use it when the city should feel textured and memorable immediately.",
            "It is a stronger fit for visitors who want one contained historic-core pocket than for people chasing a broad museum day.",
            "Keep the route compact so the district itself carries the mood.",
          ],
        },
        {
          heading: "Choose St. Lawrence Market when food variety and lower-pressure browsing matter most",
          answer:
            "St. Lawrence Market works well when the first visit should feel easy, snackable, and flexible instead of reservation-heavy or packed with transit.",
          bullets: [
            "Use it when the visitor wants choices without needing a rigid schedule.",
            "It is a good fit for earlier arrivals, mixed tastes, and shorter introductions to the city.",
            "Let the market and nearby blocks do most of the pacing instead of stacking many stops.",
          ],
        },
        {
          heading: "Choose Harbourfront when the first impression should feel open, waterfront, and event-friendly",
          answer:
            "Harbourfront is strongest when a first visit wants room to walk, one cultural anchor, and a route that can stay lighter than a downtown checklist.",
          bullets: [
            "Use it when weather and daylight can carry part of the experience.",
            "It works well when the plan wants a public-programming or waterfront-campus feel without committing to a long itinerary.",
            "Keep the route to one anchor and one easy follow-up so the lakeside setting can do more of the work.",
          ],
        },
        {
          heading: "Choose ROM or AGO when the easiest start is one central indoor culture anchor",
          answer:
            "ROM suits a bigger all-in museum start, while AGO is a cleaner art-first downtown anchor when the route needs one indoor stop before dinner or a shorter walk.",
          bullets: [
            "Use ROM when a major museum visit should carry most of the day.",
            "Use AGO when the route should stay central and art-first without sprawling.",
            "Both starts are better when the day stays simple instead of trying to combine too many far-apart districts.",
          ],
        },
      ],
      faqs: [
        {
          question: "Should a first-time Toronto guide claim one universal best area?",
          answer:
            "No. A stronger guide explains which starting area fits which kind of arrival instead of pretending every visitor wants the same first impression.",
        },
        {
          question: "What should a first-time visitor start page avoid?",
          answer:
            "Generic must-see lists, fake insider certainty, and scattered cross-city itineraries. The goal is fast confidence, not information overload.",
        },
      ],
      resourceLinks: [
        {
          title: "Toronto first-time visitor starters",
          path: "/toronto/first-time-visitor-starters",
          description:
            "Use this first when the plan needs real Toronto starting areas with official public-source notes and visible claim boundaries.",
        },
        {
          title: "Toronto weekend starters",
          path: "/toronto/weekend-route-starters",
          description:
            "Open this next when the first-arrival question is settled and the real problem becomes how to keep a Toronto weekend compact.",
        },
        {
          title: "Toronto weekend guide",
          path: "/toronto/guides/how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
          description:
            "Use this when the route needs one Toronto weekend anchor instead of a broad cross-city checklist.",
        },
        {
          title: "Toronto guide hub",
          path: "/toronto/guides",
          description:
            "Open this when the strongest next move is staying inside the smaller Toronto guide set instead of jumping back to the broader Vancouver guide library.",
        },
        {
          title: "Vancouver guide library",
          path: "/vancouver/guides",
          description:
            "Use this when you want the broader Vancouver route library and a deeper set of neighborhood, weekend, and visitor guides.",
        },
        {
          title: "Editorial standards",
          path: "/editorial-standards",
          description:
            "Review the public source rules and correction path when named real-world anchors matter more than broad route logic.",
        },
      ],
      proofNote:
        "This guide points to a narrow official-source starter layer for real Toronto starting areas, while broader itinerary, dining, and live operational details still need reviewed source notes.",
      proofSource:
        "Destination-choice logic paired with official-source Toronto first-time visitor starter pages",
      gateDecision: "needs_real_sources",
      sourceBackedCollection: "toronto_first_time_visitor_starters",
      internalLinkTarget: "/toronto/guides",
      ctaLabel: "Open the Toronto guide hub",
      ctaPath: "/toronto/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-toronto-weekend-route-ideas",
      title: "How To Build A Toronto Weekend Route Without Crossing The City All Day",
      slug: "how-to-build-a-toronto-weekend-route-without-crossing-the-city-all-day",
      citySlug: "toronto",
      cityName: "Toronto",
      regionName: "Ontario",
      queryClass: "Toronto weekend route ideas",
      cluster: "Weekend",
      category: "Weekend Planning",
      neighborhood:
        "STACKT market, Toronto Music Garden, The Bentway, Evergreen Brick Works, Toronto Botanical Garden",
      excerpt:
        "A route-first guide for choosing one Toronto weekend anchor before the day gets scattered across too many neighborhoods.",
      body:
        "This page is built for the common Toronto weekend-planning problem: not what the whole city offers, but how to choose one strong start so the rest of the day stays easy.",
      summary:
        "A Toronto weekend planning guide that helps someone choose the right route anchor based on pace, setting, and how much movement the day should actually hold.",
      audience:
        "Weekend visitors, locals planning one easy city day, and hosts trying to make a Toronto weekend feel memorable without turning it into a marathon.",
      promise:
        "The easiest Toronto weekend route usually starts with one strong anchor and one nearby follow-up, not a cross-city checklist.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 16, 2026",
      bestFor: ["Weekend visitors", "Locals planning one easy day", "Hosted city weekends"],
      heroQuestion:
        "What is the easiest way to build a Toronto weekend route without crossing the city all day?",
      intro:
        "Toronto weekends get messy when someone starts by trying to fit in too much of the city. A better plan is choosing the kind of weekend you want first, then letting one anchor carry most of the day.",
      sections: [
        {
          heading: "Choose the kind of Toronto weekend first, then choose the place",
          answer:
            "A weekend route works better when the first decision is what pace or setting the day should have, not which five places look most impressive on a map.",
          bullets: [
            "Pick a market or flexible event start when the group wants browsing, easy food choices, and lower commitment.",
            "Pick a waterfront, garden, or ravine start when walking and breathing room should do more of the work.",
            "Let one area carry the weekend instead of forcing a multi-neighborhood checklist.",
          ],
        },
        {
          heading: "Use STACKT or The Bentway when the day wants city energy without a giant downtown itinerary",
          answer:
            "These starts work best when the weekend should feel urban, flexible, and easy to keep compact without turning into a full museum-and-reservation circuit.",
          bullets: [
            "STACKT is stronger when rotating storefronts, casual food, and event energy should carry the day.",
            "The Bentway works when the route wants one distinctive public-space walk, design detail, and an easy under-Gardiner loop.",
            "Both starts work better when the follow-up stays nearby instead of pulling the plan across the whole city.",
          ],
        },
        {
          heading: "Use Toronto Music Garden when the weekend should stay lighter and more walk-led",
          answer:
            "Toronto Music Garden is a cleaner weekend start when the day wants waterfront air, one calmer arts-adjacent anchor, and less density than a busier downtown route.",
          bullets: [
            "Use it when the weekend should feel open-air and easier to pace.",
            "It is a stronger fit for a shorter walk-and-pause plan than for a packed attraction day.",
            "Keep the second move nearby so the waterfront setting can do more of the work.",
          ],
        },
        {
          heading: "Use Evergreen Brick Works or Toronto Botanical Garden when the weekend should feel greener and slower",
          answer:
            "These starts work best when the route should feel calmer, more spacious, and less downtown-heavy than a market or waterfront plan.",
          bullets: [
            "Evergreen Brick Works is useful when the day wants market energy, public programming, and a greener city backdrop.",
            "Toronto Botanical Garden is stronger when the route should feel quieter, garden-led, and easier to keep low-pressure.",
            "Both are better weekend anchors when the rest of the day stays small instead of dragging the plan back into a broader city circuit.",
          ],
        },
      ],
      faqs: [
        {
          question: "Should a Toronto weekend guide claim one universal best route?",
          answer:
            "No. A stronger weekend guide explains which kind of anchor fits which kind of day instead of pretending the same route works for every local, host, or visitor.",
        },
        {
          question: "How many areas should a compact Toronto weekend route usually combine?",
          answer:
            "Usually one strong anchor plus one nearby follow-up is enough. The goal is an easier day, not a bigger checklist.",
        },
      ],
      resourceLinks: [
        {
          title: "Toronto weekend-route starters",
          path: "/toronto/weekend-route-starters",
          description:
            "Use this first when the plan needs real Toronto weekend anchors with official source notes and visible claim boundaries.",
        },
        {
          title: "Toronto first-time visitor guide",
          path: "/toronto/guides/where-should-a-first-time-toronto-visitor-start",
          description:
            "Open this when the weekend question is still really about choosing the best first Toronto impression.",
        },
        {
          title: "Toronto guide hub",
          path: "/toronto/guides",
          description:
            "Use this when the strongest next move is staying inside the smaller Toronto guide set instead of jumping back to the broader Vancouver library.",
        },
        {
          title: "Editorial standards",
          path: "/editorial-standards",
          description:
            "Review the public source rules and correction path when named real-world anchors matter more than broad route logic.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Toronto weekend anchors, while broader dining, nightlife, and live operational details still need reviewed source notes.",
      proofSource:
        "Weekend route logic paired with official-source Toronto weekend starter pages",
      gateDecision: "needs_real_sources",
      sourceBackedCollection: "toronto_weekend_route_starters",
      internalLinkTarget: "/toronto/guides",
      ctaLabel: "Open Toronto weekend starters",
      ctaPath: "/toronto/weekend-route-starters",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-returning-visitor-local-discovery",
      title: "Vancouver Local Discovery For Returning Visitors: Where To Go Next",
      slug: "vancouver-local-discovery-for-returning-visitors",
      queryClass: "Vancouver local discovery for returning visitors",
      cluster: "Visitors",
      category: "Returning Visitor",
      neighborhood: "Commercial Drive, Chinatown, Trout Lake, UBC",
      excerpt:
        "A repeat-visit guide for people who want one more local-feeling Vancouver plan instead of replaying the obvious first-trip route.",
      body:
        "This page is designed to answer a different travel-discovery question: not where a first-time visitor should start, but where someone should go next after they already know the downtown basics.",
      summary:
        "A Vancouver returning-visitor guide that helps someone choose a second-look local-discovery anchor based on mood, pace, and how far from the first-trip path they want to go.",
      audience:
        "Returning Vancouver visitors, locals planning for repeat guests, and weekend travelers who want a second-look city plan.",
      promise:
        "A strong repeat visit should feel more local and more intentional, not like a forced hidden-gem scavenger hunt.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["Returning visitors", "Repeat Vancouver trips", "Locals hosting repeat guests"],
      heroQuestion:
        "Where should a returning Vancouver visitor go next if they do not want to repeat the same first-trip route?",
      intro:
        "Returning visitors usually do not need another generic must-see list. They need one cleaner second-look anchor that makes Vancouver feel different from the first pass through the city.",
      sections: [
        {
          heading: "Choose the kind of second-look visit before you choose the exact stop",
          answer:
            "A better returning-visitor plan starts by deciding whether the next Vancouver impression should feel more neighborhood-led, more cultural, calmer, or more park-centered.",
          bullets: [
            "Pick a street-led neighborhood when browsing, food choices, and city texture matter most.",
            "Pick a culture or museum anchor when the repeat visit should add more context than scenery.",
            "Pick a park or garden anchor when the goal is breathing room instead of another downtown circuit.",
          ],
        },
        {
          heading: "Use Commercial Drive or the Chinatown Storytelling Centre when city texture should do more of the work",
          answer:
            "These starts work best when a returning visitor wants Vancouver to feel more lived-in and community-shaped instead of repeating the same waterfront or old-core route.",
          bullets: [
            "Commercial Drive is stronger when the plan wants easy food, browsing, and neighborhood energy without overbuilding the day.",
            "The Chinatown Storytelling Centre is useful when the visit should add more historical and community context before a meal, walk, or second stop.",
            "Both are better fits when the route stays compact instead of bouncing back into the same first-trip checklist.",
          ],
        },
        {
          heading: "Use MOA or Nitobe when the repeat visit should feel more reflective than busy",
          answer:
            "The UBC side of the city works well when the next visit should add cultural depth, campus scale, or a calmer pace instead of another high-traffic downtown loop.",
          bullets: [
            "MOA is stronger when one museum anchor can carry most of the afternoon.",
            "Nitobe works better when the day wants one smaller, quieter cultural pause.",
            "Both are easier returning-visitor choices when the rest of the plan stays light.",
          ],
        },
        {
          heading: "Use Trout Lake when the city should feel local, slower, and less performative",
          answer:
            "A neighborhood park-and-lake route can be the stronger second-look move when the goal is not seeing more attractions, but getting a different rhythm out of Vancouver.",
          bullets: [
            "This is a better fit when the visit wants one simple outdoor anchor instead of a full itinerary.",
            "Keep the follow-up close and optional so the route still feels easy.",
            "Do not force a broader cross-city loop if the local park pause is already enough.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Returning-visitor starters",
          path: "/vancouver/returning-visitor-starters",
          description:
            "Use this first when the plan needs one real Vancouver repeat-visit anchor with official source notes and visible claim boundaries.",
        },
        {
          title: "First-time visitor starters",
          path: "/vancouver/first-time-visitor-starters",
          description:
            "Open this instead if the real question is still where a first-time Vancouver visit should begin.",
        },
        {
          title: "Weekend route starters",
          path: "/vancouver/weekend-route-starters",
          description:
            "Use this when the day needs a broader weekend shape instead of one second-look local-discovery anchor.",
        },
        {
          title: "Starter pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Open this when the first problem is choosing the right CityAtlas page before the repeat visit gets overbuilt.",
        },
      ],
      faqs: [
        {
          question: "Should a returning-visitor Vancouver guide pretend to surface secret spots?",
          answer:
            "No. A stronger page explains which kind of second-look anchor fits which kind of repeat visit instead of faking insider access or hidden-gem certainty.",
        },
        {
          question: "How is a returning-visitor page different from a weekend or first-time visitor guide?",
          answer:
            "It assumes someone already knows the basic Vancouver loop and needs a different city feeling, not another broad first-visit or all-day weekend checklist.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver returning-visitor anchors, while broader dining, neighborhood timing, and live operational details still need reviewed source notes.",
      proofSource:
        "Repeat-visit route logic paired with official-source Vancouver returning-visitor starter pages",
      gateDecision: "needs_real_sources",
      sourceBackedCollection: "vancouver_returning_visitor_starters",
      internalLinkTarget: "/vancouver/returning-visitor-starters",
      ctaLabel: "Open returning-visitor starters",
      ctaPath: "/vancouver/returning-visitor-starters",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-out-of-town-guest-host",
      title: "How To Host An Out-Of-Town Guest In Vancouver Without Overbuilding The Day",
      slug: "how-to-host-an-out-of-town-guest-in-vancouver",
      queryClass: "how to host an out of town guest in Vancouver",
      cluster: "Visitors",
      category: "Guest Hosting",
      neighborhood: "Downtown, Granville Island, Stanley Park, Queen Elizabeth Park",
      excerpt:
        "A host-first guide for choosing one easy Vancouver anchor when you want a guest to enjoy the city without turning the day into a marathon.",
      body:
        "This page is built for the host version of travel planning: not how to see everything, but how to choose one useful Vancouver start that makes a guest feel welcomed, oriented, and not overscheduled.",
      summary:
        "A Vancouver guest-hosting guide that helps someone choose one easy city anchor for an out-of-town guest based on energy, weather, and how much structure the day can handle.",
      audience:
        "Locals hosting friends or family, weekend hosts, and visitors who want a lower-pressure city introduction.",
      promise:
        "The best host plan is usually one good Vancouver anchor plus one easy follow-up, not an all-day attempt to prove how much you know the city.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["Out-of-town guests", "Weekend hosting", "Low-pressure city intros"],
      heroQuestion: "How should someone host an out-of-town guest in Vancouver without trying to show them the whole city at once?",
      intro:
        "Hosts often overbuild the day because they want a guest to see everything. A better Vancouver intro usually starts with one anchor that fits the guest's energy, the weather, and how much decision-making the day can handle.",
      sections: [
        {
          heading: "Choose the anchor for your guest, not for your personal bucket list",
          answer:
            "A host plan works best when the first stop matches what the guest can actually enjoy, not what feels most impressive on paper.",
          bullets: [
            "Pick a calmer start if the guest is arriving tired or overloaded.",
            "Use an indoor anchor if weather or timing will create too many moving parts.",
            "Choose one place that creates a sense of Vancouver fast instead of stacking many weaker stops.",
          ],
        },
        {
          heading: "Use one easy public anchor before you decide the rest of the day",
          answer:
            "A guest usually needs one clear introduction before the route branches into food, a walk, or a second stop.",
          bullets: [
            "Central indoor anchors lower the risk when weather or unfamiliarity adds friction.",
            "Scenic parks and garden starts work better when the day can breathe and walking feels welcome.",
            "Food-and-browse anchors are useful when tastes are mixed and the group needs easy choices.",
          ],
        },
        {
          heading: "Let the follow-up stay small enough that the guest still has energy later",
          answer:
            "The goal is to leave room for conversation, rest, and a second simple moment rather than draining the day too early.",
          bullets: [
            "One meal, one browse, or one short walk is often enough after the anchor.",
            "Avoid cross-city jumps unless the guest specifically wants a bigger itinerary.",
            "A shorter route usually leaves a better overall memory than an ambitious one.",
          ],
        },
      ],
      faqs: [
        {
          question: "Should a Vancouver host plan try to show the whole city in one day?",
          answer:
            "No. A stronger host plan gives a guest one confident introduction and leaves them wanting more instead of pushing them through too many disconnected stops.",
        },
        {
          question: "What makes a guest-hosting guide trustworthy?",
          answer:
            "It should explain route fit clearly, avoid fake must-do rankings, and point to official-source anchors when it names real places.",
        },
      ],
      resourceLinks: [
        {
          title: "Out-of-town guest starters",
          path: "/vancouver/out-of-town-guest-starters",
          description:
            "Use this first when the plan needs real Vancouver guest-hosting anchors with official source notes and visible claim boundaries.",
        },
        {
          title: "First-time visitor guide",
          path: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
          description:
            "Open this when the route is still more about where a new arrival should begin than how a host should carry the day.",
        },
        {
          title: "Weekend-route guide",
          path: "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
          description:
            "Use this when the plan should widen into one broader weekend shape instead of one host-led introduction.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Open this when you want the wider CityAtlas route map after deciding the plan is guest-led.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver guest-hosting anchors, while broader dining, transit, and live operational details still need reviewed source notes.",
      proofSource:
        "Guest-hosting route logic paired with official-source Vancouver out-of-town guest starter pages",
      gateDecision: "needs_real_sources",
      internalLinkTarget: "/vancouver/missions",
      ctaLabel: "Open city missions",
      ctaPath: "/vancouver/missions",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-weekend-route-ideas",
      title: "How To Build A Vancouver Weekend Route Without Crossing The City All Day",
      slug: "how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
      queryClass: "Vancouver weekend route ideas",
      cluster: "Weekend",
      category: "Weekend Planning",
      neighborhood:
        "Stanley Park, English Bay, Granville Island, VanDusen Botanical Garden, Queen Elizabeth Park",
      excerpt:
        "A route-first guide for choosing one Vancouver weekend anchor before the day gets scattered across too many neighborhoods.",
      body:
        "This page is built for the common weekend-planning problem: not what the whole city offers, but how to choose one strong Vancouver start so the rest of the day stays easy.",
      summary:
        "A Vancouver weekend planning guide that helps someone choose the right route anchor based on mood, weather, and how much movement the day should actually hold.",
      audience:
        "Weekend visitors, locals planning one easy city day, and hosts trying to make a weekend feel memorable without turning it into a marathon.",
      promise:
        "The easiest Vancouver weekend route usually starts with one strong anchor and one nearby follow-up, not a cross-city checklist.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["Weekend visitors", "Locals planning one easy day", "Returning guests"],
      heroQuestion:
        "What is the easiest way to build a Vancouver weekend route without crossing the city all day?",
      intro:
        "Weekend routes get messy when someone starts by trying to fit in too much Vancouver. A better plan is choosing the kind of weekend you want first, then letting one anchor carry most of the day.",
      sections: [
        {
          heading: "Choose the kind of weekend first, then choose the place",
          answer:
            "A weekend route works better when the first decision is what mood or pace the day should have, not which five places look most impressive on a map.",
          bullets: [
            "Pick a waterfront start if the day should feel spacious and walk-led.",
            "Pick a market or garden start if the group needs slower pacing and easier decisions.",
            "Let one area do most of the work instead of forcing a multi-neighborhood checklist.",
          ],
        },
        {
          heading: "Use Stanley Park or English Bay when water and walking should carry the day",
          answer:
            "These starts work best when the route should feel scenic, flexible, and easy to keep outdoors without locking into a rigid schedule.",
          bullets: [
            "Stanley Park is stronger when you want a bigger scenic anchor and more walking room.",
            "English Bay works when the route needs a downtown beach feel with a shorter water-and-city pause.",
            "Both starts work better when the follow-up stays close instead of jumping inland too early.",
          ],
        },
        {
          heading: "Use Granville Island when variety and casual browsing matter more than structure",
          answer:
            "Granville Island is a stronger weekend start when the group wants food choices, flexible timing, and easy browsing without a formal itinerary.",
          bullets: [
            "Use it when mixed tastes or different energy levels make one rigid plan risky.",
            "Let the market and surrounding area carry the pace instead of stacking many stops.",
            "This is a better fit for snack-and-walk weekends than for view-first scenic routes.",
          ],
        },
        {
          heading: "Use VanDusen or Queen Elizabeth Park when the weekend should feel calmer and more spacious",
          answer:
            "These starts work when the route should feel slower, greener, and less downtown-heavy than a waterfront or market plan.",
          bullets: [
            "VanDusen is useful when the day wants a garden walk, quiet pacing, and a more contained route shape.",
            "Queen Elizabeth Park is stronger when elevated views and one scenic impression should lead the plan.",
            "Both are easier weekend anchors when the second move stays small instead of pulling the route back across the city.",
          ],
        },
      ],
      faqs: [
        {
          question: "Should a Vancouver weekend guide claim one universal best route?",
          answer:
            "No. A stronger weekend guide explains which kind of anchor fits which kind of day instead of pretending the same route works for every local or visitor.",
        },
        {
          question: "How many areas should a compact Vancouver weekend route usually combine?",
          answer:
            "Usually one strong anchor plus one nearby follow-up is enough. The goal is an easier day, not a bigger checklist.",
        },
      ],
      resourceLinks: [
        {
          title: "Weekend-route starters",
          path: "/vancouver/weekend-route-starters",
          description:
            "Use this first when the plan needs real Vancouver weekend anchors with official source notes and visible claim boundaries.",
        },
        {
          title: "Low-effort Sunday guide",
          path: "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
          description:
            "Open this when the route should stay even gentler and more recovery-led than a broader weekend day.",
        },
        {
          title: "Returning-visitor guide",
          path: "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
          description:
            "Use this when the real question is a second-look city feeling rather than a full weekend shape.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Open this when you want the broader CityAtlas route map after deciding the weekend should stay compact.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver weekend anchors, while broader dining, event, and live operational details still need reviewed source notes.",
      proofSource:
        "Weekend route logic paired with official-source Vancouver weekend starter pages",
      gateDecision: "needs_real_sources",
      sourceBackedCollection: "vancouver_weekend_route_starters",
      internalLinkTarget: "/vancouver/missions",
      ctaLabel: "Open city missions",
      ctaPath: "/vancouver/missions",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-low-effort-vancouver-sunday-plan",
      title: "How To Build A Low-Effort Vancouver Sunday Plan Without Overfilling The Day",
      slug: "how-to-build-a-low-effort-vancouver-sunday-plan",
      queryClass: "low-effort Vancouver Sunday plan",
      cluster: "Weekend",
      category: "Sunday Planning",
      neighborhood: "Downtown, False Creek, Queen Elizabeth Park, Shaughnessy",
      excerpt:
        "A Sunday-first guide for choosing one gentle Vancouver anchor before the day turns into an overplanned weekend recovery project.",
      body:
        "This page is built for the Sunday version of city planning: not how to see more of Vancouver, but how to choose one low-effort start that still feels like you used the day well.",
      summary:
        "A Vancouver Sunday planning guide that helps someone choose one easy city anchor based on energy, weather, and how much movement the day can realistically hold.",
      audience:
        "Locals, weekend visitors, hosts, and returning Vancouver travelers who want one easy Sunday plan instead of a crowded all-day route.",
      promise:
        "The easiest Vancouver Sunday usually starts with one gentle anchor and one optional follow-up, not a cross-city checklist that eats the whole afternoon.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["Low-effort Sundays", "Recovery-day planning", "Visitors avoiding overfilled weekends"],
      heroQuestion:
        "What is the easiest way to build a low-effort Vancouver Sunday plan without overfilling the day?",
      intro:
        "Sunday plans usually get worse when they inherit Saturday ambition. A better Vancouver Sunday starts with the energy you actually have, then picks one anchor that can carry the day without forcing too many decisions.",
      sections: [
        {
          heading: "Choose the energy level first, then choose the neighborhood",
          answer:
            "A low-effort Sunday works better when the first decision is how much motion, noise, and commitment the day can handle, not which big-name stop sounds most impressive.",
          bullets: [
            "Pick an indoor anchor if the weather or energy level makes a longer walk feel costly.",
            "Pick a garden or park-led anchor if daylight, breathing room, and slower pacing matter more than staying central.",
            "Let one neighborhood or park area carry the plan instead of stitching together a cross-city checklist.",
          ],
        },
        {
          heading: "Use downtown culture anchors when Sunday needs structure without a long route",
          answer:
            "Downtown and near-downtown cultural starts work when the plan wants one clear stop, a simple transit connection, and a contained decision window.",
          bullets: [
            "Bill Reid Gallery works well when you want one compact cultural stop before an easy coffee, walk, or early dinner.",
            "The Central Library is useful when the plan needs indoor breathing room, flexible timing, and a downtown base that does not demand extra commitments.",
            "The Museum of Vancouver is a stronger Sunday fit when one False Creek-side museum anchor is enough and the rest of the day should stay small.",
          ],
        },
        {
          heading: "Use VanDusen or Bloedel when the Sunday should feel greener and slower",
          answer:
            "These starts work best when the day wants warm indoor nature or a longer outdoor walk instead of downtown pace and dense transitions.",
          bullets: [
            "Bloedel is useful when the weather is mixed and one contained indoor nature stop feels easier than a larger outdoor route.",
            "VanDusen is stronger when the day can hold a longer garden walk and a more nature-led pace.",
            "Both are better Sunday anchors when the follow-up stays small instead of pulling the route back across the city.",
          ],
        },
        {
          heading: "Let the second move stay optional",
          answer:
            "A low-effort Sunday gets stronger when the anchor is enough on its own and the next step is a bonus, not a required multi-stop route.",
          bullets: [
            "One nearby meal, tea, or short walk is usually enough after the anchor.",
            "Do not jump neighborhoods just to maximize the map if the goal is a calmer day.",
            "Save bigger all-day weekend route ambitions for a separate page and a different energy level.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Sunday starters",
          path: "/vancouver/sunday-starters",
          description:
            "Use this first when the plan needs one real Vancouver Sunday anchor with official source notes and visible claim boundaries.",
        },
        {
          title: "Weekend route starters",
          path: "/vancouver/weekend-route-starters",
          description:
            "Open this when the day can hold a broader weekend shape instead of one lower-effort Sunday anchor.",
        },
        {
          title: "Wellness reset starters",
          path: "/vancouver/wellness-reset-starters",
          description:
            "Use this if the real question is recovery-hour pacing, indoor calm, or a quieter reset rather than a general Sunday plan.",
        },
        {
          title: "Starter pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Open this when the first problem is choosing the right CityAtlas page before the Sunday gets overbuilt.",
        },
      ],
      faqs: [
        {
          question: "Should a low-effort Vancouver Sunday plan try to fit multiple neighborhoods?",
          answer:
            "Usually no. A better Sunday plan chooses one strong anchor and keeps any follow-up nearby, optional, and easy to skip if the energy drops.",
        },
        {
          question: "What makes a Sunday planning guide trustworthy?",
          answer:
            "It should explain how to choose one anchor clearly, avoid fake best-of language, and point to official-source starters when it names real Vancouver places.",
        },
      ],
      proofNote:
        "This guide now points to a narrow official-source starter layer for real Vancouver Sunday anchors, while broader dining, transit, and live operational details still need reviewed source notes.",
      proofSource:
        "Sunday planning logic paired with official-source Vancouver Sunday starter pages",
      gateDecision: "needs_real_sources",
      internalLinkTarget: "/vancouver/sunday-starters",
      ctaLabel: "Open Sunday starters",
      ctaPath: "/vancouver/sunday-starters",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-vancouver-itinerary-starter-pack",
      title: "Vancouver Itinerary Starter Pack: Which CityAtlas Page Should You Open First?",
      slug: "vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
      queryClass: "Vancouver itinerary starter pack",
      cluster: "Starter Pack",
      category: "Guide Roundup",
      neighborhood: "Vancouver-wide",
      excerpt:
        "A route-first starter guide that helps locals, visitors, and hosts open the right CityAtlas page before they overbuild the day.",
      body:
        "This page is built for the earlier decision most city guides skip: not which venue is best, but which planning page you should open first so the rest of Vancouver gets easier to navigate.",
      summary:
        "A Vancouver starter-pack guide that helps someone choose the right CityAtlas page first based on the kind of plan they actually need.",
      audience:
        "Locals, visitors, and hosts who know they want Vancouver guidance but do not want to waste time opening the wrong page first.",
      promise:
        "The fastest way to get a useful Vancouver plan is opening the right CityAtlas page for the moment, not reading the longest city list.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Overwhelmed planners", "Visitors choosing a start", "Hosts picking the right path"],
      heroQuestion:
        "Which CityAtlas page should someone open first when they need a Vancouver plan fast?",
      intro:
        "People lose time when they start with the wrong kind of page. A better Vancouver plan begins by choosing the right question first, then opening the CityAtlas route that already fits it.",
      sections: [
        {
          heading: "Start with a source-backed page when you need real public anchors right away",
          answer:
            "If the plan needs real places with official public sources and visible claim boundaries, the source-backed starter pages are the fastest trustworthy entry point.",
          bullets: [
            "Use them when you need a compact route shape plus real-world anchors, not a generic directory page.",
            "They are stronger than generic city roundups because each page keeps the source owner, checked date, and correction path visible.",
            "Pick the starter page that matches the moment: date night, rainy day, first evening, first-time visitor, returning visitor, guest hosting, weekend route, or wellness reset.",
          ],
        },
        {
          heading: "Use destination and neighborhood guides when choosing the area matters more than the exact stop",
          answer:
            "Some Vancouver plans break because the neighborhood decision happens too late. Use the destination-choice and neighborhood guides when the real question is where the plan should begin.",
          bullets: [
            "Open the first-time visitor or neighborhood chooser guides when one right area will simplify the whole day.",
            "Use these pages when the mood, pace, and route shape matter more than one named venue.",
            "This keeps the plan compact and reduces the temptation to bounce across the city.",
          ],
        },
        {
          heading: "Open missions when the idea is clear enough to save and reuse",
          answer:
            "Once the route shape feels right, City Missions are the better step because they turn the idea into a saveable path instead of one more article tab.",
          bullets: [
            "Use missions after the main anchor is chosen and the plan needs a simple sequence.",
            "This is the best move when the goal is to save, revisit, or share the route later.",
            "Do not start with missions if the category question is still unresolved.",
          ],
        },
        {
          heading: "Use the planner only after the route type is already decided",
          answer:
            "The planner works better as a storage and sequencing tool than as the first place someone tries to decide what kind of Vancouver day they want.",
          bullets: [
            "Use it after a guide, source-backed page, or mission has already shaped the route.",
            "This keeps the planner from becoming a pile of disconnected saved items.",
            "A clearer starter page usually makes the planner more useful later.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Date-night starters",
          path: "/vancouver/date-night-starters",
          description:
            "Use this first when the plan needs one compact Vancouver date-night anchor with official source notes.",
        },
        {
          title: "Rainy-day starters",
          path: "/vancouver/rainy-day-starters",
          description:
            "Open this when the weather is the problem and the route needs lower-friction indoor or grey-sky anchors.",
        },
        {
          title: "First-evening starters",
          path: "/vancouver/first-evening-starters",
          description:
            "Start here when a visitor needs one easy first Vancouver impression without a full-night itinerary.",
        },
        {
          title: "First-time visitor starters",
          path: "/vancouver/first-time-visitor-starters",
          description:
            "Use this when the real question is which part of Vancouver should shape the first visit.",
        },
        {
          title: "Returning-visitor starters",
          path: "/vancouver/returning-visitor-starters",
          description:
            "Use this when the first trip is already covered and the next question is what kind of second-look Vancouver anchor fits best.",
        },
        {
          title: "Out-of-town guest starters",
          path: "/vancouver/out-of-town-guest-starters",
          description:
            "Open this when you are hosting someone and need one good city introduction instead of an all-day marathon.",
        },
        {
          title: "Weekend route starters",
          path: "/vancouver/weekend-route-starters",
          description:
            "Use this first when the day needs one weekend shape and one anchor instead of a scattered checklist.",
        },
        {
          title: "Wellness reset starters",
          path: "/vancouver/wellness-reset-starters",
          description:
            "Start here when the plan needs a calmer Vancouver reset instead of a high-energy route.",
        },
        {
          title: "City missions",
          path: "/vancouver/missions",
          description:
            "Move here after the route type is clear and the next step is saving or reusing the plan.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Open this when the situation is clearer than the exact page choice and you want the wider CityAtlas route map.",
        },
      ],
      faqs: [
        {
          question: "Should someone start with the planner if they are not sure what kind of Vancouver day they want?",
          answer:
            "Usually no. A better start is the page that matches the planning question first, then the planner after the route shape is clearer.",
        },
        {
          question: "What makes a Vancouver starter-pack guide trustworthy?",
          answer:
            "It should route people to the right page honestly, avoid fake universal rankings, and make the source-backed pages easy to find when real anchors matter.",
        },
      ],
      proofNote:
        "This guide does not add new venue claims. It helps people choose the right existing CityAtlas page first, including the source-backed starter pages that already carry official-source notes and correction paths.",
      proofSource:
        "Route-logic architecture paired with the current live and local-ready CityAtlas guide and source-backed library",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Open the guide library",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-cityatlas-route-roundup",
      title: "CityAtlas Guide Roundup: Which Vancouver Route Should You Open By Situation?",
      slug: "cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
      queryClass: "CityAtlas guide roundup page for strongest routes",
      cluster: "Starter Pack",
      category: "Guide Roundup",
      neighborhood: "Vancouver-wide",
      excerpt:
        "A roundup guide that helps someone choose the strongest CityAtlas Vancouver route by situation instead of starting with a generic city list.",
      body:
        "This page exists to turn the growing CityAtlas guide library into a clearer route map. It helps someone open the strongest next guide when they already know the kind of Vancouver moment they need.",
      summary:
        "A Vancouver guide-roundup page that helps someone choose the strongest CityAtlas route by weather, visitor type, neighborhood fit, or pace.",
      audience:
        "Locals, visitors, hosts, and repeat users who want the shortest path to the right CityAtlas guide instead of opening the library cold.",
      promise:
        "The fastest way to get a useful Vancouver plan is opening the guide cluster that already matches the situation, not browsing every page one by one.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["Guide library visitors", "Repeat CityAtlas readers", "People choosing the next route fast"],
      heroQuestion:
        "Which CityAtlas Vancouver route should someone open first when they already know the situation they are solving?",
      intro:
        "A good city guide system should get easier to use as it grows. This roundup keeps the library legible by sorting the strongest CityAtlas routes by the real problem someone is trying to solve first.",
      sections: [
        {
          heading: "Open the source-backed starter pages when real-place trust matters first",
          answer:
            "If the plan needs real Vancouver anchors with official public sources, the source-backed pages are the strongest first click because they keep checked dates, claim boundaries, and correction paths visible.",
          bullets: [
            "Use date-night, rainy-day, first-evening, first-time-visitor, returning-visitor, guest-hosting, weekend-route, Sunday, or wellness-reset starters when named places matter now.",
            "These pages are stronger than generic roundups because they make source discipline visible instead of hiding it behind vague recommendation language.",
            "Open the matching answer-first guide next when the route shape needs more explanation than one starter page can hold.",
          ],
        },
        {
          heading: "Use visitor and host guides when the day depends on who the plan is for",
          answer:
            "Some CityAtlas routes are best sorted by visitor type, not by neighborhood or venue. These pages work best when the plan changes because the person using it changes.",
          bullets: [
            "Open the first-evening guide when a new arrival needs one easy Vancouver start instead of a full itinerary.",
            "Open the first-time visitor, returning-visitor, or out-of-town guest guides when the route should match the stage of familiarity with the city.",
            "Use the starter-pack guide when the first problem is still deciding which CityAtlas page is even the right kind of tool.",
          ],
        },
        {
          heading: "Use neighborhood-intent guides when place fit matters more than a named stop",
          answer:
            "Neighborhood guides are the better first move when the strongest decision is where the plan should live, not what one exact venue should anchor it.",
          bullets: [
            "Open the neighborhood chooser when the night depends on mood, pace, and how contained the route should feel.",
            "Use the Gastown, Mount Pleasant, first-date, and two-stop route pages when one part of Vancouver should carry the logic of the plan.",
            "These pages help CityAtlas explain city entity coverage without pretending it already operates a fully verified listing database.",
          ],
        },
        {
          heading: "Use weekend and reset guides when the route needs lower friction",
          answer:
            "Wellness, Sunday, and compact weekend guides are the best first click when the right answer is one calmer anchor and a simpler pacing model.",
          bullets: [
            "Open the wellness guide when the route should slow down and avoid inflated treatment language.",
            "Open the Sunday or weekend-route guides when the real question is how to keep the day compact instead of crossing the city all day.",
            "These pages make CityAtlas more useful for lower-energy and lower-friction planning moments that generic tourism pages usually flatten.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Starter-pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Use this when the first decision is which CityAtlas page belongs to the moment at all.",
        },
        {
          title: "Source-backed starters",
          path: "/vancouver/date-night-starters",
          description:
            "Open the real-place starter layer first when official public-source anchors matter right away.",
        },
        {
          title: "First-time visitor guide",
          path: "/vancouver/guides/where-should-a-first-time-vancouver-visitor-start",
          description:
            "Best when the route depends on where a first visit should begin, not on one exact named stop.",
        },
        {
          title: "Returning-visitor guide",
          path: "/vancouver/guides/vancouver-local-discovery-for-returning-visitors",
          description:
            "Use this when the first trip is already covered and the plan needs a more local-feeling second look.",
        },
        {
          title: "Weekend-route guide",
          path: "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
          description:
            "Open this when the route needs one weekend shape instead of a scattered checklist.",
        },
        {
          title: "Neighborhood chooser",
          path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
          description:
            "Use this when neighborhood fit matters more than a specific venue or activity.",
        },
        {
          title: "Guide library",
          path: "/vancouver/guides",
          description:
            "Browse the clustered library when you want to move across route types after choosing the strongest first guide.",
        },
      ],
      faqs: [
        {
          question: "Why does CityAtlas need a guide roundup if the guide library already exists?",
          answer:
            "Because a roundup answers the earlier question of which route cluster fits the situation first, while the library is better for browsing after that decision is clearer.",
        },
        {
          question: "What makes a guide-roundup page trustworthy?",
          answer:
            "It should route readers to the strongest existing pages honestly, avoid fake universal rankings, and make the source-backed real-place layer easy to find when named anchors matter.",
        },
      ],
      proofNote:
        "This roundup does not add new place claims. It strengthens the internal-link graph across the current CityAtlas route library and helps readers find the right existing guide or source-backed page faster.",
      proofSource:
        "Guide architecture paired with the current CityAtlas clustered guide and source-backed library",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Open the guide library",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-low-friction-route-chooser",
      title: "Which Low-Friction Vancouver Route Should You Open Today?",
      slug: "which-low-friction-vancouver-route-should-you-open-today",
      queryClass: "Which low-friction Vancouver route should you open today",
      cluster: "Starter Pack",
      category: "Route Chooser",
      neighborhood: "Vancouver-wide",
      excerpt:
        "A route-choice guide for deciding whether a rainy-day, wellness, Sunday, weekend, or first-evening Vancouver plan fits the day best.",
      body:
        "This page exists for a common CityAtlas problem: someone knows they want an easier Vancouver plan, but not which kind of easier plan they actually need. The goal is to help them open the right low-friction route first.",
      summary:
        "A Vancouver low-friction route chooser that helps someone decide between rainy-day, wellness, Sunday, weekend, and compact visitor-start pages based on energy, weather, and how much movement the day can hold.",
      audience:
        "Locals, visitors, and hosts who want one easy Vancouver route but need help choosing the right kind of low-friction plan first.",
      promise:
        "The easiest Vancouver route is the one that matches the day's energy and constraints, not the longest list of possible stops.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Low-energy planning", "Rainy days", "Calmer weekends", "Simple visitor starts"],
      heroQuestion:
        "Which CityAtlas Vancouver route should someone open first when the day needs to stay easy?",
      intro:
        "Low-friction planning works better when the first decision is what kind of ease the day needs. Some days need weather protection. Some need recovery pacing. Some need one easy visitor or weekend shape. Open the route that matches that constraint first.",
      sections: [
        {
          heading: "Open rainy-day or first-evening routes when external friction is the main problem",
          answer:
            "If weather, arrival timing, or decision fatigue is making the day feel harder, the best first move is the route that lowers that friction immediately.",
          bullets: [
            "Use the rainy-day guide when warmth, shelter, and one easy fallback matter most.",
            "Use the first-evening guide when a visitor needs one gentle city impression without a longer itinerary.",
            "These routes are stronger than a generic city browse because they solve the day's immediate resistance first.",
          ],
        },
        {
          heading: "Open wellness or Sunday routes when the day needs recovery more than novelty",
          answer:
            "Some easy Vancouver plans should slow the day down rather than try to make it feel full. Those are better fits for the wellness and Sunday guides.",
          bullets: [
            "Use the wellness guide when the route should feel restorative, quieter, or less performance-driven.",
            "Use the Sunday guide when the day still needs one anchor, but the pace should stay gentle and optional.",
            "Both are stronger than a broader weekend route when the real issue is energy, not lack of ideas.",
          ],
        },
        {
          heading: "Open the weekend route guide when the day can hold one stronger anchor",
          answer:
            "If the plan still wants one memorable Vancouver shape, but should avoid bouncing across the city, the weekend-route guide is the better first click.",
          bullets: [
            "Use it when the group has enough energy for one anchor plus one easy follow-up.",
            "It is stronger than a Sunday or wellness route when the goal is still a fuller city day, just not a scattered one.",
            "Keep the route compact instead of trying to add extra neighborhoods for its own sake.",
          ],
        },
        {
          heading: "Use the roundup or starter-pack pages when the low-friction question is still too broad",
          answer:
            "If none of the easier route types feels obviously right yet, CityAtlas should send the reader back to the broader routing layer instead of guessing.",
          bullets: [
            "Open the roundup when the situation is clear enough to choose by route family.",
            "Open the starter-pack guide when the first decision is still which CityAtlas tool should shape the plan at all.",
            "These pages prevent the easier-route library from turning into another flat list of tabs.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Rainy-day guide",
          path: "/vancouver/guides/rainy-day-vancouver-plan-coffee-walk-and-reset",
          description:
            "Open this when weather protection, warmth, and one easy fallback are the biggest needs.",
        },
        {
          title: "Wellness guide",
          path: "/vancouver/guides/vancouver-wellness-experiences-to-review",
          description:
            "Use this when the route should feel calmer, more restorative, or less performance-driven.",
        },
        {
          title: "Low-effort Sunday guide",
          path: "/vancouver/guides/how-to-build-a-low-effort-vancouver-sunday-plan",
          description:
            "Open this when the day still needs one anchor, but the pace should stay gentle and optional.",
        },
        {
          title: "Weekend-route guide",
          path: "/vancouver/guides/how-to-build-a-vancouver-weekend-route-without-crossing-the-city-all-day",
          description:
            "Use this when the day can still hold one stronger Vancouver anchor without becoming a cross-city checklist.",
        },
        {
          title: "First-evening guide",
          path: "/vancouver/guides/two-hour-vancouver-visitor-loop-for-a-first-evening",
          description:
            "Open this when a visitor needs one simple first-city impression instead of a broader itinerary.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Use this when the route family is clearer than the exact page choice and you want the wider CityAtlas route map.",
        },
        {
          title: "Starter-pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Open this when the first problem is still deciding which CityAtlas tool should shape the plan.",
        },
      ],
      faqs: [
        {
          question: "What makes a low-friction Vancouver route different from a generic city guide?",
          answer:
            "It starts with the real constraint first: weather, energy, recovery, arrival timing, or how much movement the day can actually hold. That keeps the plan useful instead of just broad.",
        },
        {
          question: "When should someone skip the low-friction route chooser?",
          answer:
            "Skip it when you already know the route type clearly. If you already know the day is a rainy-day plan, a weekend-route day, or a wellness reset, open that guide directly.",
        },
      ],
      proofNote:
        "This guide does not add new place claims. It helps readers choose the right existing lower-friction CityAtlas route first and connects directly into the current rainy-day, wellness, Sunday, weekend, visitor, and routing-library surfaces.",
      proofSource:
        "Route-logic architecture paired with the current CityAtlas low-friction guide and source-backed library",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Open the guide library",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-neighborhood-chooser",
      title: "How To Choose Between Gastown, Mount Pleasant, And Kitsilano For A Vancouver Evening",
      slug: "how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
      queryClass: "how to choose between Gastown Mount Pleasant and Kitsilano for a Vancouver evening",
      cluster: "Neighborhoods",
      category: "Neighborhood Chooser",
      neighborhood: "Gastown, Mount Pleasant, Kitsilano",
      excerpt:
        "A destination-first guide for deciding whether you want old-core dinner energy, flexible Main Street movement, or a scenic west-side plan.",
      body:
        "This page is built to answer a real city question early: which part of Vancouver fits the kind of night you actually want? The goal is to help someone choose the right starting point fast instead of guessing between neighborhoods.",
      summary:
        "A Vancouver neighborhood chooser that helps readers decide between Gastown, Mount Pleasant, and Kitsilano based on mood, weather, and how structured the plan should feel.",
      audience:
        "Locals, visitors, and couples who want one strong part of the city instead of a scattered all-city plan.",
      promise:
        "The easiest Vancouver evening usually starts with the right neighborhood choice, then lets the rest of the plan stay compact.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 7,
      lastReviewed: "June 14, 2026",
      bestFor: ["Date nights", "First evenings", "Visitors choosing one area"],
      heroQuestion: "Which Vancouver neighborhood should someone choose for one easy evening plan?",
      intro:
        "Most evening plans break because the neighborhood decision comes too late. Pick the part of the city first, then choose the exact stops inside that frame.",
      sections: [
        {
          heading: "Choose Gastown when dinner and atmosphere should carry the night",
          answer:
            "Gastown fits evenings that want a stronger sense of occasion, a tighter old-core feel, and a plan that works best when dinner is the anchor.",
          bullets: [
            "Use Gastown when the mood matters more than squeezing in many stops.",
            "Keep the route compact so the night feels walkable, not overbuilt.",
            "It works best when you want one decisive plan rather than a casual drift.",
          ],
        },
        {
          heading: "Choose Mount Pleasant when flexibility matters more than polish",
          answer:
            "Mount Pleasant fits lower-pressure evenings that can move between coffee, dinner, dessert, or a short walk without feeling overcommitted.",
          bullets: [
            "It is a strong pick for catch-ups, early-stage dates, or nights with uncertain energy.",
            "The neighborhood works well when you want options without major transit drag.",
            "Use it when conversation, casual pacing, and easy pivots matter more than ceremony.",
          ],
        },
        {
          heading: "Choose Kitsilano when scenery and breathing room matter most",
          answer:
            "Kitsilano fits plans that want a west-side feel, weather-sensitive movement, and a little more daylight or waterfront mood in the route.",
          bullets: [
            "It makes sense when the weather is good enough to support a walk or view moment.",
            "Use it when the evening should feel slower and more spacious.",
            "If weather turns or the energy drops, keep the route short and stay neighborhood-local.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Gastown evening guide",
          path: "/vancouver/guides/gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact",
          description:
            "Open this when dinner-led atmosphere and a tighter old-core plan should carry the night.",
        },
        {
          title: "Mount Pleasant starter guide",
          path: "/vancouver/guides/mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
          description:
            "Use this when flexibility, conversation, and easier pivots matter more than ceremony.",
        },
        {
          title: "Kitsilano starter guide",
          path: "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
          description:
            "Open this when scenery, breathing room, and a weather-friendly west-side route fit best.",
        },
        {
          title: "West-side daytime guide",
          path: "/vancouver/guides/where-should-you-start-a-west-side-vancouver-daytime-plan",
          description:
            "Use this when the west-side question is really about beaches, campus culture, or garden pacing before evening even begins.",
        },
        {
          title: "Low-pressure first-date guide",
          path: "/vancouver/guides/which-vancouver-neighborhood-fits-a-low-pressure-first-date",
          description:
            "Use this when neighborhood fit matters because the evening should stay easier and more recoverable.",
        },
        {
          title: "Two-stop night guide",
          path: "/vancouver/guides/how-to-plan-a-two-stop-vancouver-night-without-transit-drag",
          description:
            "Open this when the next problem is keeping dinner plus one follow-up compact after the neighborhood is chosen.",
        },
      ],
      faqs: [
        {
          question: "What is the biggest mistake when choosing a Vancouver neighborhood for the night?",
          answer:
            "Trying to optimize the whole city at once. One neighborhood with a clear mood is usually better than three ambitious cross-city stops.",
        },
        {
          question: "Should a neighborhood guide claim which area is best?",
          answer:
            "Only with strong proof and a narrow use case. CityAtlas should focus on fit, mood, and route logic instead of fake universal rankings.",
        },
      ],
      proofNote:
        "This page stays carefully sourced because it stays at the neighborhood-fit layer. Specific business, pricing, and availability claims still need separate source review.",
      proofSource: "Route logic paired with public neighborhood context",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Open the full guide library",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-low-pressure-first-date",
      title: "Which Vancouver Neighborhood Fits A Low-Pressure First Date?",
      slug: "which-vancouver-neighborhood-fits-a-low-pressure-first-date",
      queryClass: "best neighborhood for a low-pressure first date in Vancouver",
      cluster: "Neighborhoods",
      category: "First Date",
      neighborhood: "Mount Pleasant, Kitsilano, Gastown",
      excerpt:
        "A decision guide for people who want a first date that feels easy, conversational, and low-friction instead of overproduced.",
      body:
        "The strongest first-date page is not a ranking of venues. It is a guide to choosing the right pace, neighborhood energy, and backup path before anyone commits to details.",
      summary:
        "A Vancouver first-date guide that helps readers choose the right neighborhood for an easier, lower-pressure plan.",
      audience:
        "People planning a first or early-stage date who want less awkwardness, fewer logistics, and a cleaner route.",
      promise:
        "A low-pressure first date usually wins by keeping options open, transitions short, and the tone easy to recover if the energy changes.",
      image: "/assets/businesses/kissa-tanto-booth.webp",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["First dates", "Casual meetups", "Short evening plans"],
      heroQuestion: "What kind of Vancouver neighborhood makes a first date feel less forced?",
      intro:
        "People often search for the perfect venue when what they really need is the right setting. Neighborhood fit decides whether the night feels relaxed or overengineered.",
      sections: [
        {
          heading: "Mount Pleasant is the safest default when you want flexibility",
          answer:
            "Mount Pleasant is often the easiest first-date call because the night can stay coffee-simple or stretch into dinner without changing the whole plan.",
          bullets: [
            "Use it when you want less pressure and more natural pivots.",
            "It works for short dates, uncertain energy, and easier conversation starts.",
            "A flexible neighborhood is usually better than a high-stakes centerpiece.",
          ],
        },
        {
          heading: "Kitsilano works when the weather can carry part of the date",
          answer:
            "Kitsilano is strongest when a walk, a view, or a slower west-side feel helps the date breathe.",
          bullets: [
            "Choose it when the route benefits from outdoor breathing room.",
            "Keep the stop count low so the date feels open, not choreographed.",
            "If weather is unstable, have an indoor fallback in the same area.",
          ],
        },
        {
          heading: "Gastown is better when the plan should feel more intentional",
          answer:
            "Gastown can work for a first date, but it is usually best when both people want a stronger dinner-led atmosphere instead of a tentative drop-in plan.",
          bullets: [
            "Use it when the date is meant to feel more deliberate.",
            "Avoid overstacking the night with multiple reservations or long moves.",
            "The neighborhood should support the tone, not force it.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Mount Pleasant starter guide",
          path: "/vancouver/guides/mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
          description:
            "Open this when flexibility is the main goal and the date should stay easy to recover.",
        },
        {
          title: "Kitsilano starter guide",
          path: "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
          description:
            "Use this when weather, a walk, or a slower west-side tone should help the date breathe.",
        },
        {
          title: "Gastown evening guide",
          path: "/vancouver/guides/gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact",
          description:
            "Open this when the date should feel more intentional and dinner-led than casual.",
        },
        {
          title: "Neighborhood chooser",
          path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
          description:
            "Use this when the first decision is still which part of Vancouver fits the mood.",
        },
      ],
      faqs: [
        {
          question: "What makes a first-date neighborhood low pressure?",
          answer:
            "Easy arrival, flexible next steps, and enough nearby options that the night can adapt without becoming awkward.",
        },
        {
          question: "Should CityAtlas recommend one universal first-date spot?",
          answer:
            "No. A stronger guide explains which neighborhood fits which kind of date instead of pretending one place works for everyone.",
        },
      ],
      proofNote:
        "This guide is written at the route-logic level and avoids naming real businesses as universal winners. Specific listings still need source and claim review.",
      proofSource: "First-date route logic paired with neighborhood context",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/vancouver/missions",
      ctaLabel: "See city missions",
      ctaPath: "/vancouver/missions",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-two-stop-night",
      title: "How To Plan A Two-Stop Vancouver Night Without Transit Drag",
      slug: "how-to-plan-a-two-stop-vancouver-night-without-transit-drag",
      queryClass: "how to plan a two-stop Vancouver night without transit drag",
      cluster: "Neighborhoods",
      category: "Route Logic",
      neighborhood: "Vancouver",
      excerpt:
        "A route-planning guide for people who want dinner plus one second move without turning the evening into a cross-city project.",
      body:
        "This is the kind of city guidance CityAtlas should own: not endless lists, but sharper decision help that turns broad intent into one doable route.",
      summary:
        "A Vancouver route guide that helps readers keep a two-stop night compact, realistic, and easy to say yes to.",
      audience:
        "Locals and visitors who want two good moves in one night without long transitions or route fatigue.",
      promise:
        "A strong two-stop night works when both moves belong to the same neighborhood rhythm, not when the second stop is just a distant wish list add-on.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Dinner plus dessert", "Short evenings", "Transit-light plans"],
      heroQuestion: "How do you make a Vancouver night feel full without making it logistically heavy?",
      intro:
        "The cleanest night plans are usually two moves, not five. What matters is whether the second stop feels inevitable from the first one.",
      sections: [
        {
          heading: "Build the route around one neighborhood rhythm",
          answer:
            "Dinner-plus-dessert, cafe-plus-walk, or gallery-plus-drink works better when both stops fit the same area and energy.",
          bullets: [
            "Do not let novelty tempt the second stop into another part of the city.",
            "A short move keeps the night feeling confident and generous.",
            "The second stop should feel like the natural extension of the first, not a rescue mission.",
          ],
        },
        {
          heading: "Choose the first stop by commitment level",
          answer:
            "If the anchor is high commitment, the second stop should stay flexible. If the anchor is casual, the second move can carry more emotional weight.",
          bullets: [
            "A formal first stop needs an easy release valve after it.",
            "A casual first stop can lead into a stronger second act if energy is building.",
            "Match the route to how much decision fatigue you want to avoid.",
          ],
        },
        {
          heading: "Use neighborhood fit to cut transit drag before it starts",
          answer:
            "Neighborhood choice solves most transit problems earlier than venue choice does.",
          bullets: [
            "Gastown works best when the whole night can stay old-core and walk-led.",
            "Mount Pleasant works when you want flexible pivots and easier changes.",
            "Kitsilano works when good weather or a scenic close is part of the point.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Kitsilano scenic starters",
          path: "/vancouver/kitsilano-scenic-starters",
          description:
            "Open this when you want a narrower official-source west-side anchor layer before adding any broader route logic.",
        },
        {
          title: "Neighborhood chooser",
          path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
          description:
            "Open this when the first problem is deciding which part of Vancouver should hold both stops.",
        },
        {
          title: "Gastown evening guide",
          path: "/vancouver/guides/gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact",
          description:
            "Use this when the whole route should stay old-core and dinner-led.",
        },
        {
          title: "Mount Pleasant starter guide",
          path: "/vancouver/guides/mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
          description:
            "Open this when the second stop may need easier pivots and a more flexible rhythm.",
        },
        {
          title: "Kitsilano starter guide",
          path: "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
          description:
            "Use this when scenery or weather-friendly walking should carry the second half of the night.",
        },
      ],
      faqs: [
        {
          question: "How many stops should a useful Vancouver evening plan include?",
          answer:
            "Usually one anchor and one optional follow-up. More than that often raises friction faster than it raises enjoyment.",
        },
        {
          question: "What makes a two-stop route better for search and AI visibility?",
          answer:
            "It answers a specific planning problem directly, which makes the page easier to summarize and more useful than a generic things-to-do list.",
        },
      ],
      proofNote:
        "This page stays carefully sourced because it focuses on route structure and neighborhood fit instead of real-time business or transit claims.",
      proofSource: "Route logic paired with neighborhood planning heuristics",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/planner",
      ctaLabel: "Open the planner",
      ctaPath: "/planner",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-gastown-evening",
      title: "Gastown Evening Guide: When To Choose It And How To Keep The Plan Compact",
      slug: "gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact",
      queryClass: "Gastown Vancouver evening guide",
      cluster: "Neighborhoods",
      category: "Neighborhood Starter",
      neighborhood: "Gastown",
      excerpt:
        "A Gastown starter page for people who want old-core atmosphere, one strong anchor stop, and a night that feels compact instead of hectic.",
      body:
        "Gastown works best when CityAtlas treats it as a neighborhood with a clear kind of evening, not as a generic tourist catch-all.",
      summary:
        "A Gastown evening guide that explains when the neighborhood fits the plan and how to keep the route focused once you are there.",
      audience:
        "Locals, visitors, and couples deciding whether Gastown fits the tone of the night they want.",
      promise:
        "Gastown is strongest when the evening wants atmosphere, walkable continuity, and one confident main stop rather than endless branching options.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Dinner-first plans", "Intentional date nights", "Visitors who want atmosphere"],
      heroQuestion: "When is Gastown the right part of Vancouver for an evening plan?",
      intro:
        "Gastown has a strong identity. That is useful when you want the neighborhood itself to carry part of the mood, but it can be too heavy for nights that need total flexibility.",
      sections: [
        {
          heading: "Use Gastown when the neighborhood itself should feel like part of the event",
          answer:
            "Gastown works when atmosphere, heritage-core energy, and a stronger dinner-led plan are part of why the night feels worth doing.",
          bullets: [
            "It is a better fit for intentional plans than for indecisive wandering.",
            "Use it when the neighborhood should add weight to the evening.",
            "If the anchor stop slips, keep the backup inside the same compact area.",
          ],
        },
        {
          heading: "Keep the route short once you are there",
          answer:
            "Gastown is usually best when it stays one-neighborhood simple rather than trying to launch a bigger cross-city itinerary.",
          bullets: [
            "Choose one anchor and one lighter follow-up.",
            "Let walking, not distance, create the feeling of progression.",
            "The night should feel contained, not busy.",
          ],
        },
        {
          heading: "Do not force Gastown into every kind of plan",
          answer:
            "If the night needs easy pivots, lower stakes, or weather-proof casual energy, another neighborhood may fit better.",
          bullets: [
            "Mount Pleasant is often better for flexible first dates or looser evenings.",
            "Kitsilano may fit better when scenery or breathing room matters more.",
            "Neighborhood fit matters more than any one supposedly must-visit venue.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Neighborhood chooser",
          path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
          description:
            "Open this when the first question is still whether Gastown, Mount Pleasant, or Kitsilano fits the night.",
        },
        {
          title: "Mount Pleasant starter guide",
          path: "/vancouver/guides/mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
          description:
            "Use this when the plan needs more flexibility and less atmosphere weight.",
        },
        {
          title: "Kitsilano starter guide",
          path: "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
          description:
            "Open this when scenery and breathing room matter more than old-core intensity.",
        },
        {
          title: "Two-stop night guide",
          path: "/vancouver/guides/how-to-plan-a-two-stop-vancouver-night-without-transit-drag",
          description:
            "Use this when the next step is shaping one compact follow-up after the neighborhood is chosen.",
        },
      ],
      faqs: [
        {
          question: "What does Gastown do best in a CityAtlas-style guide?",
          answer:
            "It gives a plan clear mood and identity quickly, which makes it easier to build a compact dinner-first or atmosphere-first route.",
        },
        {
          question: "Should a Gastown guide rely on generic tourism hype?",
          answer:
            "No. CityAtlas should explain how the neighborhood fits a real evening plan instead of recycling generic attraction language.",
        },
      ],
      proofNote:
        "The carefully sourced version of this page stays at the neighborhood and route level. Specific businesses and live conditions still need separate review.",
      proofSource: "Public Gastown neighborhood context paired with evening route logic",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Browse more Vancouver guides",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-mount-pleasant-starter",
      title: "Mount Pleasant Local Discovery Starter Guide For Casual Vancouver Plans",
      slug: "mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
      queryClass: "Mount Pleasant Vancouver guide for casual evening plans",
      cluster: "Neighborhoods",
      category: "Neighborhood Starter",
      neighborhood: "Mount Pleasant",
      excerpt:
        "A Mount Pleasant starter guide for people who want a lower-pressure Vancouver plan with easier pivots and neighborhood-scale movement.",
      body:
        "Mount Pleasant gives CityAtlas a strong destination page because it supports casual plans, shorter transitions, and more flexible route logic than a formal centerpiece night.",
      summary:
        "A Mount Pleasant guide that explains when the neighborhood fits a casual Vancouver plan and how to keep the route useful without overplanning it.",
      audience:
        "Locals, couples, and visitors who want a less formal evening or planning block in Vancouver.",
      promise:
        "Mount Pleasant works best when the plan wants range, conversation, and easy pivots rather than one fixed high-stakes route.",
      image: "/assets/vancouver-rainline-cafe-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Casual dates", "Easy catch-ups", "Coffee-plus-dinner plans"],
      heroQuestion: "Why does Mount Pleasant work so often for casual Vancouver plans?",
      intro:
        "Some neighborhoods are best for big statements. Mount Pleasant is usually better when the plan needs to stay human-sized, flexible, and easy to recover if the energy changes.",
      sections: [
        {
          heading: "Use Mount Pleasant when the plan should stay flexible",
          answer:
            "Mount Pleasant works well when the night may start with coffee, shift into dinner, or stay short without feeling incomplete.",
          bullets: [
            "It is a good fit for plans with uncertain timing or uncertain energy.",
            "You can keep the route neighborhood-local without making it feel too small.",
            "That flexibility is often the real value, not the number of venue choices.",
          ],
        },
        {
          heading: "Let the neighborhood carry the pacing, not just the venue choice",
          answer:
            "Mount Pleasant is useful because it supports a conversational rhythm instead of forcing every plan into a formal arc.",
          bullets: [
            "Start with one simple anchor and decide the second move only if the energy is good.",
            "Keep the night recoverable if someone wants to stop after one move.",
            "A flexible neighborhood often beats a supposedly perfect destination that adds stress.",
          ],
        },
        {
          heading: "Use it as a practical default when you do not need spectacle",
          answer:
            "Mount Pleasant is often the right first recommendation when someone wants a solid plan without performance pressure.",
          bullets: [
            "It suits low-pressure first dates, casual working sessions, and relaxed local nights.",
            "The neighborhood helps CityAtlas answer fit questions better than generic best-of pages can.",
            "That makes it strong destination-intent content even before real listing publication is approved.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Neighborhood chooser",
          path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
          description:
            "Open this when the main question is still which part of Vancouver fits the night best.",
        },
        {
          title: "Gastown evening guide",
          path: "/vancouver/guides/gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact",
          description:
            "Use this when the plan needs more atmosphere and a stronger dinner-first arc.",
        },
        {
          title: "Kitsilano starter guide",
          path: "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
          description:
            "Open this when the night should feel slower, more scenic, or more weather-led than Mount Pleasant.",
        },
        {
          title: "Low-pressure first-date guide",
          path: "/vancouver/guides/which-vancouver-neighborhood-fits-a-low-pressure-first-date",
          description:
            "Use this when the real issue is keeping the plan flexible enough for an early-stage date.",
        },
      ],
      faqs: [
        {
          question: "What makes Mount Pleasant a strong CityAtlas neighborhood page?",
          answer:
            "It answers a real planning question: where should someone go when they want flexibility, range, and an easier neighborhood rhythm.",
        },
        {
          question: "Should this page recommend exact businesses yet?",
          answer:
            "Only after reviewed sourcing. The carefully sourced version should focus on route fit and neighborhood use cases first.",
        },
      ],
      proofNote:
        "This page is intentionally written at the neighborhood-fit level. Exact listings, hours, and commercial claims still require separate review.",
      proofSource: "Mount Pleasant route logic paired with public neighborhood context",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/planner",
      ctaLabel: "Save a planner route",
      ctaPath: "/planner",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-kitsilano-scenic-starter",
      title: "Kitsilano Scenic Route Starter Guide For Slower Vancouver Evenings",
      slug: "kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
      queryClass: "Kitsilano Vancouver scenic evening guide",
      cluster: "Neighborhoods",
      category: "Neighborhood Starter",
      neighborhood: "Kitsilano",
      excerpt:
        "A Kitsilano starter guide for people who want a slower Vancouver evening shaped by scenery, breathing room, and one contained west-side route.",
      body:
        "Kitsilano gives CityAtlas a missing destination page in the neighborhood trio because some Vancouver plans work best when the route feels open-air, weather-aware, and less compressed than an old-core dinner night.",
      summary:
        "A Kitsilano guide that explains when the neighborhood fits a slower scenic Vancouver plan and how to keep the route useful without drifting too wide.",
      audience:
        "Locals, couples, visitors, and hosts who want a west-side evening with more breathing room and less pressure.",
      promise:
        "Kitsilano works best when the route wants scenery, a little movement, and one neighborhood-sized plan instead of a packed city itinerary.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Scenic dates", "Weather-friendly evenings", "Slower visitor plans"],
      heroQuestion: "When is Kitsilano the right part of Vancouver for a slower evening plan?",
      intro:
        "Some Vancouver evenings improve when the route has more air in it. Kitsilano is useful when the plan wants a west-side tone, room to walk, and a neighborhood that helps the night feel calmer instead of tighter.",
      sections: [
        {
          heading: "Use Kitsilano when scenery should carry part of the plan",
          answer:
            "Kitsilano works when a view, a walk, or a little more daylight energy should help the route feel worth doing before any exact venue choice takes over.",
          bullets: [
            "It is a strong fit when the neighborhood itself should create breathing room.",
            "Use it when the evening should feel scenic without turning into a long multi-stop trek.",
            "A slower route often works better here than a stacked itinerary does.",
          ],
        },
        {
          heading: "Keep the route weather-aware and neighborhood-local",
          answer:
            "Kitsilano is strongest when the plan respects weather, energy, and how far the route should actually stretch.",
          bullets: [
            "Use it on evenings when walking or a view moment can realistically stay part of the route.",
            "If weather changes, keep the backup in the same area instead of sending the night across the city.",
            "The neighborhood should feel spacious, not spread out.",
          ],
        },
        {
          heading: "Choose Kitsilano over Gastown or Mount Pleasant for different reasons",
          answer:
            "Kitsilano is not the universal best neighborhood. It is the better fit when the plan wants west-side calm or scenery more than old-core atmosphere or flexible central pivots.",
          bullets: [
            "Gastown is stronger when dinner and atmosphere should carry the night.",
            "Mount Pleasant is stronger when flexibility and easier pivots matter most.",
            "Kitsilano is stronger when the plan wants slower rhythm, breathing room, or good-weather route logic.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Neighborhood chooser",
          path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
          description:
            "Open this when the first decision is still which part of Vancouver fits the mood best.",
        },
        {
          title: "Gastown evening guide",
          path: "/vancouver/guides/gastown-evening-guide-when-to-choose-it-and-how-to-keep-the-plan-compact",
          description:
            "Use this when the route should feel more atmosphere-led and dinner-first than scenic.",
        },
        {
          title: "Mount Pleasant starter guide",
          path: "/vancouver/guides/mount-pleasant-local-discovery-starter-guide-for-casual-vancouver-plans",
          description:
            "Open this when flexibility and easier pivots matter more than scenery or west-side tone.",
        },
        {
          title: "Low-pressure first-date guide",
          path: "/vancouver/guides/which-vancouver-neighborhood-fits-a-low-pressure-first-date",
          description:
            "Use this when the Kitsilano question is really about whether the date should feel easier and more open.",
        },
        {
          title: "Two-stop night guide",
          path: "/vancouver/guides/how-to-plan-a-two-stop-vancouver-night-without-transit-drag",
          description:
            "Open this when the next step is keeping one scenic anchor plus one follow-up compact.",
        },
        {
          title: "West-side daytime starters",
          path: "/vancouver/west-side-daytime-starters",
          description:
            "Open this when the better fit is a calmer west-side daytime route before the plan turns into evening logic.",
        },
      ],
      faqs: [
        {
          question: "What makes Kitsilano a strong CityAtlas destination page?",
          answer:
            "It answers a different planning question than Gastown or Mount Pleasant: when a Vancouver evening should feel scenic, slower, and more spacious.",
        },
        {
          question: "Should this page recommend exact businesses yet?",
          answer:
            "Only after reviewed sourcing. The carefully sourced version should stay focused on route fit, weather sensitivity, and neighborhood use cases first.",
        },
      ],
      proofNote:
        "This page is intentionally written at the neighborhood-fit level. Exact listings, hours, and commercial claims still require separate review.",
      proofSource: "Kitsilano route logic paired with public neighborhood context",
      gateDecision: "ready_for_review",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Browse more Vancouver guides",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-west-side-daytime-starter",
      title: "Where Should You Start A West-Side Vancouver Daytime Plan?",
      slug: "where-should-you-start-a-west-side-vancouver-daytime-plan",
      queryClass: "where should you start a west-side Vancouver daytime plan",
      cluster: "Neighborhoods",
      category: "Daytime Starter",
      neighborhood: "West Side, Point Grey, UBC",
      excerpt:
        "A destination-first guide for choosing a calmer west-side Vancouver daytime plan built around beaches, gardens, campus culture, and one contained route shape.",
      body:
        "CityAtlas already had slower evening guidance for Kitsilano, but daytime west-side planning is a different question. This page helps someone choose whether a beach, a garden, or a campus-and-culture anchor should shape the day before the route gets too broad.",
      summary:
        "A west-side Vancouver daytime guide that helps readers choose a beach, campus, or garden-led starting point without turning the plan into a full-city checklist.",
      audience:
        "Locals, visitors, returning visitors, and hosts who want one calmer west-side daytime route with clear pacing and fewer citywide pivots.",
      promise:
        "The strongest west-side daytime plan usually starts with one route shape, not five scattered good ideas.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Calmer daytime plans", "Good-weather west-side routes", "Campus and garden starts"],
      heroQuestion: "What kind of west-side Vancouver daytime start fits the day you actually want?",
      intro:
        "The west side can turn into a loose wish list fast. A better daytime plan starts by deciding whether the day wants open shoreline space, quieter beach pacing, or a more contained UBC-and-garden route.",
      sections: [
        {
          heading: "Start with Jericho or Locarno when open shoreline time is the point",
          answer:
            "These starts work best when the day wants fresh air, a beach-led route, and enough room to keep the pace light without forcing many stops.",
          bullets: [
            "Choose this shape when a walk, a view, or a quieter beach rhythm should carry the day.",
            "Keep the route compact instead of stacking beach time with distant city errands.",
            "If weather turns, use one west-side indoor anchor nearby instead of abandoning the whole area.",
          ],
        },
        {
          heading: "Start with MOA when the day wants one stronger campus-and-culture anchor",
          answer:
            "Museum of Anthropology is useful when the route should feel more contained, more weather-proof, and a little more intentional than a beach-first day.",
          bullets: [
            "Use it when the day benefits from one clear cultural anchor before anything else gets added.",
            "A campus route usually works better when you accept that UBC is the main zone, not one stop in a scattered itinerary.",
            "If energy is lower, one museum stop can be enough without forcing a second act.",
          ],
        },
        {
          heading: "Start with Nitobe or the Botanical Garden when the day should stay quieter",
          answer:
            "These starts fit days that want more reflection, slower pacing, and a garden-led route instead of a beach crowd or a bigger city loop.",
          bullets: [
            "Choose this when the real goal is calm and one contained daytime shape.",
            "Keep the route short enough that the garden experience can stay central instead of becoming a rushed add-on.",
            "This is especially useful when the day wants west-side atmosphere without nightlife pressure.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "West-side daytime starters",
          path: "/vancouver/west-side-daytime-starters",
          description:
            "Open this when you want the official-source west-side daytime anchor layer before adding any broader route logic.",
        },
        {
          title: "Kitsilano starter guide",
          path: "/vancouver/guides/kitsilano-scenic-route-starter-guide-for-slower-vancouver-evenings",
          description:
            "Use this when the route should stay west-side but the stronger fit is a slower evening instead of a daytime plan.",
        },
        {
          title: "Neighborhood chooser",
          path: "/vancouver/guides/how-to-choose-between-gastown-mount-pleasant-and-kitsilano-for-a-vancouver-evening",
          description:
            "Open this when the real question is still which part of Vancouver fits the broader plan best.",
        },
        {
          title: "Returning-visitor starters",
          path: "/vancouver/returning-visitor-starters",
          description:
            "Use this when the west-side daytime question is really about finding a second-look Vancouver route with a more local feel.",
        },
        {
          title: "Starter-pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Open this when the first problem is still choosing which CityAtlas page should shape the day.",
        },
      ],
      faqs: [
        {
          question: "What makes a west-side daytime guide different from a Kitsilano evening guide?",
          answer:
            "The daytime version solves a different planning problem: beach versus campus versus garden pacing, not how to shape a slower evening.",
        },
        {
          question: "Should this page claim the best west-side stop in Vancouver?",
          answer:
            "No. A stronger CityAtlas page explains which daytime shape fits which kind of day instead of pretending one anchor works for everyone.",
        },
      ],
      proofNote:
        "This guide is written at the destination-fit layer and pairs with a narrow official-source starter page. Exact operational details still need confirmation on the linked official sources.",
      proofSource:
        "West-side route logic paired with the official public source pack for the matching daytime starter layer",
      gateDecision: "ready_for_review",
      sourceBackedCollection: "vancouver_west_side_daytime_starters",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Browse more Vancouver guides",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-false-creek-culture-starter",
      title: "Where Should You Start A False Creek Vancouver Culture Afternoon?",
      slug: "where-should-you-start-a-false-creek-vancouver-culture-afternoon",
      queryClass: "where should you start a False Creek Vancouver culture afternoon",
      cluster: "Neighborhoods",
      category: "Culture Starter",
      neighborhood: "False Creek, Granville Island, Vanier Park",
      excerpt:
        "A destination-first guide for choosing a compact Vancouver culture afternoon built around Granville Island, Vanier Park museums, the Space Centre, and one shoreline follow-through.",
      body:
        "CityAtlas already had scenic Kitsilano and broader west-side daytime guidance, but a False Creek culture afternoon is a different planning question. This page helps someone choose whether the day wants a market-and-browse start, one stronger museum anchor, or a tighter Vanier Park culture shape before the route sprawls.",
      summary:
        "A False Creek Vancouver culture guide that helps readers choose a market, museum, science, or shoreline-led afternoon without turning the plan into a full-city checklist.",
      audience:
        "Locals, visitors, returning visitors, and hosts who want one contained Vancouver culture-afternoon route with clear pacing and fewer cross-city pivots.",
      promise:
        "The strongest False Creek culture afternoon usually starts with one compact area and one route shape, not a long list of disconnected stops.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 14, 2026",
      bestFor: ["Culture afternoons", "Contained daytime plans", "False Creek and Vanier Park routes"],
      heroQuestion: "What kind of False Creek culture afternoon fits the day you actually want?",
      intro:
        "False Creek culture planning gets messy when Granville Island, Vanier Park, and the shoreline all get stacked at once. A better afternoon starts by deciding whether the day wants market energy, one stronger museum or science anchor, or a slower waterfront follow-through.",
      sections: [
        {
          heading: "Start with Granville Island when the day wants food, browsing, and lighter structure",
          answer:
            "This route shape works best when the afternoon wants a little movement, easy food choices, and flexible browsing before any deeper culture decision gets added.",
          bullets: [
            "Choose this when mixed interests or lower commitment matter more than one fixed museum stop.",
            "Keep the route compact instead of turning Granville Island into one stop on a citywide checklist.",
            "If the day still wants one culture follow-through, add only one nearby Vanier Park anchor.",
          ],
        },
        {
          heading: "Start with MOV, the Maritime Museum, or the Space Centre when one anchor should carry the plan",
          answer:
            "Vanier Park works better when the day wants one stronger indoor culture or science stop before anything else gets layered in.",
          bullets: [
            "Use this shape when the route should feel more intentional and weather-proof than market-first browsing.",
            "Accept that a Vanier Park afternoon is often strongest when it stays in one zone instead of hopping back and forth across the creek.",
            "If energy is lower, one museum or science stop can be enough without forcing a second act.",
          ],
        },
        {
          heading: "Use Kits Beach as the calmer follow-through, not the main overbuild",
          answer:
            "Kits Beach can help the afternoon breathe after a market or museum anchor, but it works best as a simple waterfront continuation rather than a second full destination problem.",
          bullets: [
            "Choose this when the route wants one open-air finish after an indoor or market-led start.",
            "Keep the shoreline add-on short enough that the culture anchor still defines the afternoon.",
            "If the real goal is a scenic west-side route, the Kitsilano and west-side daytime pages are usually the better first stop.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "False Creek culture starters",
          path: "/vancouver/false-creek-culture-starters",
          description:
            "Open this when you want the official-source False Creek culture anchor layer before adding any broader route logic.",
        },
        {
          title: "Kitsilano scenic starters",
          path: "/vancouver/kitsilano-scenic-starters",
          description:
            "Use this when the route should stay west-side but the stronger fit is scenic pacing instead of a culture-afternoon shape.",
        },
        {
          title: "West-side daytime starters",
          path: "/vancouver/west-side-daytime-starters",
          description:
            "Open this when the real question is beach, garden, or UBC pacing instead of False Creek culture density.",
        },
        {
          title: "Guide roundup",
          path: "/vancouver/guides/cityatlas-guide-roundup-which-vancouver-route-should-you-open-by-situation",
          description:
            "Use this when the first problem is still choosing which CityAtlas route family matches the day.",
        },
        {
          title: "Starter-pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Open this when the first problem is choosing which CityAtlas page should shape the afternoon.",
        },
      ],
      faqs: [
        {
          question: "What makes a False Creek culture guide different from the Kitsilano or west-side daytime pages?",
          answer:
            "The culture version solves a different planning problem: how to keep one market-and-museum zone compact instead of choosing a scenic beach or broader west-side daytime shape.",
        },
        {
          question: "Should this page claim the best culture afternoon in Vancouver?",
          answer:
            "No. A stronger CityAtlas page explains which contained culture shape fits which kind of day instead of pretending one loop works for everyone.",
        },
      ],
      proofNote:
        "This guide is written at the destination-fit layer and pairs with a narrow official-source starter page. Exact operational details still need confirmation on the linked official sources.",
      proofSource:
        "False Creek route logic paired with the official public source pack for the matching culture starter layer",
      gateDecision: "ready_for_review",
      sourceBackedCollection: "vancouver_false_creek_culture_starters",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Browse more Vancouver guides",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-ubc-discovery-starter",
      title: "Where Should You Start A UBC-Adjacent Vancouver Discovery Day?",
      slug: "where-should-you-start-a-ubc-adjacent-vancouver-discovery-day",
      queryClass: "where should you start a UBC-adjacent Vancouver discovery day",
      cluster: "Neighborhoods",
      category: "Campus Starter",
      neighborhood: "UBC, Point Grey",
      excerpt:
        "A destination-first guide for choosing a compact UBC-adjacent Vancouver discovery day built around museums, gardens, and one canopy or campus follow-through.",
      body:
        "CityAtlas already had west-side daytime and False Creek culture guidance, but a UBC-adjacent discovery day is a different planning question. This page helps someone choose whether the day wants one stronger museum anchor, a calmer garden-led route, or one campus canopy follow-through before the west side turns into a scattered all-day plan.",
      summary:
        "A UBC-adjacent Vancouver discovery guide that helps readers choose a museum, garden, or canopy-led campus day without turning the route into a full-city checklist.",
      audience:
        "Locals, visitors, returning visitors, and hosts who want one contained west-side Vancouver discovery day with clear pacing and fewer cross-city pivots.",
      promise:
        "The strongest UBC-adjacent discovery day usually starts with one contained campus anchor and one route shape, not a long list of disconnected stops.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 15, 2026",
      bestFor: ["Campus-side discovery days", "Museum-or-garden choices", "Contained west-side plans"],
      heroQuestion: "What kind of UBC-adjacent Vancouver discovery day fits the day you actually want?",
      intro:
        "UBC-side planning gets messy when museums, gardens, and campus walks all get stacked at once. A better day starts by deciding whether the route wants one stronger museum anchor, a calmer garden-led plan, or one forest-canopy follow-through before the west side sprawls.",
      sections: [
        {
          heading: "Start with MOA or Beaty when one museum anchor should carry the day",
          answer:
            "This route shape works best when the day wants one stronger indoor anchor with enough content to hold attention before anything else gets layered in.",
          bullets: [
            "Choose MOA when the day wants world arts, culture, and one deeper indoor stop.",
            "Choose Beaty when the day wants natural-history energy and a more science-first campus feel.",
            "If energy is lower, one museum can be enough without forcing a second act.",
          ],
        },
        {
          heading: "Start with Nitobe or the Botanical Garden when the day should stay quieter",
          answer:
            "These starts fit days that want more reflection, slower pacing, and a garden-led route instead of a busier museum-and-campus hop.",
          bullets: [
            "Choose this when the real goal is calm and one contained west-side shape.",
            "Keep the route short enough that the garden experience can stay central instead of becoming a rushed add-on.",
            "This is especially useful when the day wants west-side atmosphere without nightlife pressure.",
          ],
        },
        {
          heading: "Use GreenHeart TreeWalk as the contained follow-through, not the overbuild",
          answer:
            "The canopy route can help the day feel memorable after a garden or museum start, but it works best as one campus-side follow-through instead of a second full destination problem.",
          bullets: [
            "Choose this when the day wants one forest-canopy experience after an earlier campus anchor.",
            "Keep the add-on short enough that the first stop still defines the route.",
            "If the real goal is a broader west-side daytime route, the west-side daytime page is usually the better first stop.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "UBC discovery starters",
          path: "/vancouver/ubc-discovery-starters",
          description:
            "Open this when you want the official-source UBC discovery anchor layer before adding any broader route logic.",
        },
        {
          title: "West-side daytime starters",
          path: "/vancouver/west-side-daytime-starters",
          description:
            "Use this when the real question is beach, campus, or garden pacing across the broader west side.",
        },
        {
          title: "False Creek culture starters",
          path: "/vancouver/false-creek-culture-starters",
          description:
            "Open this when the stronger fit is a market-and-museum False Creek zone instead of a campus-side day.",
        },
        {
          title: "Returning-visitor starters",
          path: "/vancouver/returning-visitor-starters",
          description:
            "Use this when the UBC question is really about finding a more local-feeling second-look Vancouver route.",
        },
        {
          title: "Starter-pack guide",
          path: "/vancouver/guides/vancouver-itinerary-starter-pack-which-cityatlas-page-should-you-open-first",
          description:
            "Open this when the first problem is still choosing which CityAtlas page should shape the day.",
        },
      ],
      faqs: [
        {
          question: "What makes a UBC discovery guide different from the west-side daytime page?",
          answer:
            "The UBC version solves a narrower planning problem: how to keep one museum, garden, or canopy-focused campus-side day contained instead of choosing between the broader west-side beach, garden, and culture shapes.",
        },
        {
          question: "Should this page claim the best UBC stop in Vancouver?",
          answer:
            "No. A stronger CityAtlas page explains which campus-side shape fits which kind of day instead of pretending one stop works for everyone.",
        },
      ],
      proofNote:
        "This guide is written at the destination-fit layer and pairs with a narrow official-source starter page. Exact operational details still need confirmation on the linked official sources.",
      proofSource:
        "UBC-side route logic paired with the official public source pack for the matching discovery starter layer",
      gateDecision: "ready_for_review",
      sourceBackedCollection: "vancouver_ubc_discovery_starters",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Browse more Vancouver guides",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
    {
      ...demoAudit,
      id: "guide-garden-day-starter",
      title: "Where Should You Start A Vancouver Garden And Conservatory Day?",
      slug: "where-should-you-start-a-vancouver-garden-and-conservatory-day",
      queryClass: "where should you start a Vancouver garden and conservatory day",
      cluster: "Neighborhoods",
      category: "Garden Starter",
      neighborhood: "Queen Elizabeth Park, Shaughnessy, UBC",
      excerpt:
        "A destination-first guide for choosing a Vancouver garden and conservatory day built around hilltop views, indoor tropical calm, or fuller botanical walking.",
      body:
        "CityAtlas already had wellness-reset, west-side daytime, and UBC discovery guidance, but a Vancouver garden and conservatory day is a different planning question. This page helps someone choose whether the day wants one hilltop park-and-view anchor, one contained indoor conservatory stop, or a longer botanical route that can hold more walking before the plan gets scattered.",
      summary:
        "A Vancouver garden-day guide that helps readers choose between Queen Elizabeth Park, Bloedel, VanDusen, Nitobe, and UBC Botanical Garden without turning the route into a vague nature list.",
      audience:
        "Locals, visitors, returning visitors, and hosts who want one greener Vancouver route with clearer pacing and fewer disconnected stops.",
      promise:
        "The strongest Vancouver garden day usually starts with one route shape: hilltop views, contained indoor calm, or one fuller botanical walk.",
      image: "/assets/vancouver-market-hero.jpg",
      readMinutes: 6,
      lastReviewed: "June 15, 2026",
      bestFor: ["Garden-led day plans", "Indoor-or-outdoor calmer routes", "Nature-first Vancouver choices"],
      heroQuestion: "What kind of Vancouver garden or conservatory day fits the energy and pace you actually want?",
      intro:
        "Garden days get overbuilt when hilltop parks, conservatories, and full botanical walks all get stacked into the same plan. A better day starts by deciding whether the route wants one elevated view anchor, one indoor tropical stop, or one fuller botanical walk before the city starts competing for attention.",
      sections: [
        {
          heading: "Start with Queen Elizabeth Park or Bloedel when the day should stay compact",
          answer:
            "This route shape works best when the plan wants one strong central anchor that can stay shorter, simpler, and easier to pair with one second act later if energy still exists.",
          bullets: [
            "Choose Queen Elizabeth Park when the route wants hilltop views, open-air walking, and one broad scenic impression.",
            "Choose Bloedel when the weather is mixed or the day wants one contained indoor nature stop instead of a bigger outdoor walk.",
            "Keep the route compact enough that the first anchor still defines the day.",
          ],
        },
        {
          heading: "Start with VanDusen when one longer botanical walk should carry the day",
          answer:
            "This is the stronger route shape when the plan wants a fuller garden anchor with more walking structure and less need to keep switching between neighborhoods.",
          bullets: [
            "Choose this when the real goal is a botanical garden day, not just a short scenic detour.",
            "Let the garden do most of the work instead of forcing extra city stops too early.",
            "This is a better fit than a hilltop park if the day wants one contained longer walk.",
          ],
        },
        {
          heading: "Use Nitobe or UBC Botanical Garden when the day should stay west-side and quieter",
          answer:
            "These starts fit days that want a calmer campus-side garden shape with more reflection and less central-city back-and-forth.",
          bullets: [
            "Choose Nitobe when the route wants a more contemplative garden experience and a shorter, quieter west-side anchor.",
            "Choose UBC Botanical Garden when the plan wants a broader living-collection walk and can hold more time on one campus-side route.",
            "If the real goal is a broader UBC discovery day with museums or canopy time, the UBC discovery page is usually the better first stop.",
          ],
        },
      ],
      resourceLinks: [
        {
          title: "Garden day starters",
          path: "/vancouver/garden-day-starters",
          description:
            "Open this when you want the official-source Vancouver garden and conservatory anchor layer before adding any broader route logic.",
        },
        {
          title: "Wellness reset starters",
          path: "/vancouver/wellness-reset-starters",
          description:
            "Use this when the real goal is a calmer reset route rather than a greener destination-choice day.",
        },
        {
          title: "West-side daytime starters",
          path: "/vancouver/west-side-daytime-starters",
          description:
            "Open this when the stronger fit is a broader beach, campus, or garden daytime route instead of a dedicated garden-day plan.",
        },
        {
          title: "UBC discovery starters",
          path: "/vancouver/ubc-discovery-starters",
          description:
            "Use this when the route should stay campus-side around museums, gardens, and one fuller west-side discovery day.",
        },
        {
          title: "Weekend route starters",
          path: "/vancouver/weekend-route-starters",
          description:
            "Open this when the first problem is shaping a fuller weekend plan instead of choosing one greener anchor type.",
        },
      ],
      faqs: [
        {
          question: "What makes a garden-day guide different from the wellness or UBC discovery pages?",
          answer:
            "The garden-day version solves a narrower planning problem: whether the day should begin with a park, conservatory, or botanical garden anchor rather than a broader calm-hour reset or campus discovery plan.",
        },
        {
          question: "Should this page claim the best garden day in Vancouver?",
          answer:
            "No. A stronger CityAtlas page explains which greener route shape fits which kind of day instead of pretending one botanical plan works for everyone.",
        },
      ],
      proofNote:
        "This guide is written at the destination-fit layer and pairs with a narrow official-source starter page. Exact operational details still need confirmation on the linked official sources.",
      proofSource:
        "Vancouver garden-day route logic paired with the official public source pack for the matching garden and conservatory starter layer",
      gateDecision: "ready_for_review",
      sourceBackedCollection: "vancouver_garden_day_starters",
      internalLinkTarget: "/vancouver/guides",
      ctaLabel: "Browse more Vancouver guides",
      ctaPath: "/vancouver/guides",
      relatedBusinessIds: [],
      relatedEventIds: [],
      sponsored: false,
    },
  ],
  sourceBackedPlaces: [
    {
      id: "source-place-kits-beach-scenic-start",
      slug: "kitsilano-beach-scenic-start",
      collection: "vancouver_kitsilano_scenic_starters",
      name: "Kitsilano Beach",
      category: "Beach",
      neighborhood: "Kitsilano",
      routeRole: "Seawall-and-view scenic starter",
      summary:
        "A strong west-side scenic starter when the plan needs shoreline walking, beach energy, and one open-air Vancouver anchor before adding a second stop.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Kits Beach's location, Seawall access, public amenities, and seasonal lifeguard framing without forcing generic sunset hype.",
      bestFor: ["Scenic starts", "Good-weather evenings", "Walk-led west-side routes"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/kitsilano-beach.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Kitsilano Beach is located on Cornwall Ave at the north end of Yew St.",
        "The official page says the Seawall runs alongside the beach and that Kitsilano Pool is at the west side.",
        "The official page lists public washrooms, tennis courts, basketball courts, a playground, and seasonal lifeguards among the features.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming weather, crowd levels, swimming conditions, or that every scenic Vancouver plan should start at Kits Beach.",
        "Lifeguard coverage, parking, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-kits-pool-scenic-start",
      slug: "kitsilano-pool-scenic-start",
      collection: "vancouver_kitsilano_scenic_starters",
      name: "Kitsilano Pool",
      category: "Outdoor pool",
      neighborhood: "Kitsilano",
      routeRole: "Saltwater shoreline activity starter",
      summary:
        "A useful west-side scenic starter when the route wants one contained shoreline activity anchor near the beach instead of a longer roaming plan.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a public source for Kits Pool's saltwater framing, beach-adjacent location, and current seasonal opening pattern without pretending every slower Vancouver plan should become a swim plan.",
      bestFor: ["Summer west-side plans", "Contained activity starts", "Beach-adjacent routes"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/kitsilano-pool.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Kitsilano Pool is Vancouver's only saltwater swimming pool.",
        "The official page says the outdoor summer pool is located near the beach, cafes, and neighbourhood of Kitsilano.",
        "The official page says Kitsilano Pool opens on June 17, 2026 and lists daily swim times on the current schedule.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming ticket availability, ideal swim conditions, or that a pool visit belongs in every scenic Kitsilano route.",
        "Opening dates, session times, and ticketing details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-granville-island-scenic-start",
      slug: "granville-island-scenic-start",
      collection: "vancouver_kitsilano_scenic_starters",
      name: "Granville Island Public Market",
      category: "Public market",
      neighborhood: "Granville Island",
      routeRole: "Browse-and-snack scenic starter",
      summary:
        "A strong nearby scenic starter when the route wants easy food choices, indoor browsing, and a water-adjacent follow-through without becoming a full-day itinerary.",
      whyItFits:
        "The official Granville Island site gives CityAtlas a direct public source for Public Market summer hours, visit-planning infrastructure, and CMHC stewardship without vague local-market superlatives.",
      bestFor: ["Food-led scenic starts", "Mixed-interest groups", "Weather-flex routes"],
      officialSourceLabel: "Official Granville Island site",
      officialSourceUrl: "https://granvilleisland.com/",
      sourceOwner: "Granville Island official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site lists Public Market summer hours from June 4 to September 7 as 9 AM to 6 PM Monday to Wednesday and 9 AM to 7 PM Thursday to Sunday.",
        "The official site includes Plan Your Visit links for transportation, directions and parking, accessibility, and Public Market exploration.",
        "The official site says Granville Island is managed by Canada Mortgage and Housing Corporation (CMHC).",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming vendor availability, crowd levels, or that Granville Island is the right west-side anchor for every pace or budget.",
        "Hours, vendors, and transportation details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-space-centre-scenic-start",
      slug: "space-centre-scenic-start",
      collection: "vancouver_kitsilano_scenic_starters",
      name: "H.R. MacMillan Space Centre",
      category: "Science centre",
      neighborhood: "Vanier Park",
      routeRole: "Vanier Park indoor science starter",
      summary:
        "A useful west-side scenic starter when the route needs one indoor Vanier Park anchor before a shoreline walk or slower evening close.",
      whyItFits:
        "The official Space Centre site gives CityAtlas a direct public source for the Vanier Park address, live planetarium and exhibit framing, and daytime-visit structure without fake family-attraction ranking language.",
      bestFor: ["Indoor scenic backups", "Vanier Park starts", "Weather-aware west-side plans"],
      officialSourceLabel: "Official Space Centre website",
      officialSourceUrl: "https://www.spacecentre.ca/",
      sourceOwner: "H.R. MacMillan Space Centre official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says visitors can step inside for live planetarium shows, hands-on exhibits, and cosmic experiences.",
        "The official site says daytime visits include a Planetarium Star Theatre show, a live science demo, and gallery access.",
        "The official site lists the address at Vanier Park, 1100 Chestnut Street, Vancouver, BC V6J 3J9.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current ticket availability, exact show fit, or that every slower Vancouver route should include a science-centre stop.",
        "Showtimes, observatory access, and admission details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-maritime-museum-scenic-start",
      slug: "maritime-museum-scenic-start",
      collection: "vancouver_kitsilano_scenic_starters",
      name: "Vancouver Maritime Museum",
      category: "Museum",
      neighborhood: "Vanier Park",
      routeRole: "Waterfront culture starter",
      summary:
        "A strong west-side scenic starter when the route wants one contained waterfront culture anchor near Vanier Park instead of a longer multi-neighbourhood loop.",
      whyItFits:
        "The official museum site gives CityAtlas a direct public source for the Vanier Park attractions pass context, current hours, and Ogden address without pretending it is the universal best museum stop for every visitor.",
      bestFor: ["Waterfront culture starts", "Weather-proof west-side plans", "Contained museum stops"],
      officialSourceLabel: "Official museum website",
      officialSourceUrl: "https://vanmaritime.com/",
      sourceOwner: "Vancouver Maritime Museum official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site includes a Vanier Park Attractions Pass under the visit section.",
        "The official site lists public hours as Monday to Sunday from 10:00 am to 5:00 pm, including statutory holidays except Christmas.",
        "The official site lists the museum address at 1905 Ogden Ave., Vancouver, BC V6J 1A3.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibit fit, ticket availability, or that every scenic west-side plan should become a museum route.",
        "Hours, exhibition details, and admission rules can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-jericho-beach-daytime-start",
      slug: "jericho-beach-daytime-start",
      collection: "vancouver_west_side_daytime_starters",
      name: "Jericho Beach",
      category: "Beach",
      neighborhood: "Jericho",
      routeRole: "Open-shoreline daytime starter",
      summary:
        "A strong west-side daytime starter when the plan wants one open-air shoreline anchor with room to walk before adding anything more structured.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Jericho Beach's location, beach-use split, public amenities, and seasonal lifeguard framing without forcing generic sunset or watersport hype.",
      bestFor: ["Shoreline daytime starts", "Airier west-side plans", "Walk-led routes"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/jericho-beach.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Jericho Beach is on the north side of Jericho Park at the west end of Point Grey Road between Wallace Street and Discovery Street.",
        "The official page says the east side of the beach caters to swimmers and the west side to sailboats and windsurfers.",
        "The official page lists public washrooms, picnic tables, pay parking, a swimming raft, and seasonal lifeguards among the features.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming weather, crowd levels, or that every west-side daytime plan should start at Jericho Beach.",
        "Lifeguard coverage, beach conditions, and on-site services can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-locarno-beach-daytime-start",
      slug: "locarno-beach-daytime-start",
      collection: "vancouver_west_side_daytime_starters",
      name: "Locarno Beach",
      category: "Beach",
      neighborhood: "Locarno",
      routeRole: "Quieter beach daytime starter",
      summary:
        "A useful west-side daytime starter when the route wants a quieter beach anchor with less noise and one contained shoreline stretch.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Locarno Beach's quiet-beach designation, location, and public features without pretending it is the universal best beach for every mood.",
      bestFor: ["Quieter daytime starts", "Beach-led recovery routes", "Simple shoreline plans"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/locarno-beach.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Locarno Beach is on Northwest Marine Drive between Discovery Street and Tolmie Street on the west side of Jericho Park.",
        "The official page says Locarno Beach is a designated quiet beach where amplified sound is not permitted.",
        "The official page lists public washrooms, picnic tables, free parking, a swimming raft, and seasonal lifeguards among the features.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming noise levels, ideal swimming conditions, or that Locarno is the right beach for every west-side daytime plan.",
        "Seasonal services, beach conditions, and parking availability can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-moa-daytime-start",
      slug: "museum-of-anthropology-daytime-start",
      collection: "vancouver_west_side_daytime_starters",
      name: "Museum of Anthropology at UBC",
      category: "Museum",
      neighborhood: "UBC",
      routeRole: "Campus-and-culture daytime starter",
      summary:
        "A strong west-side daytime starter when the plan wants one contained UBC culture anchor instead of a looser beach-first route.",
      whyItFits:
        "The official MOA visit page gives CityAtlas a direct public source for hours, evening extension timing, transit guidance, and the Northwest Marine Drive address without fake insider-museum ranking language.",
      bestFor: ["Weather-proof daytime starts", "Campus routes", "Culture-led west-side plans"],
      officialSourceLabel: "Official MOA visit page",
      officialSourceUrl: "https://moa.ubc.ca/visit/",
      sourceOwner: "Museum of Anthropology at UBC official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official visit page lists hours from 10 am to 5 pm Monday to Sunday, with Thursday open until 9 pm.",
        "The official visit page says Thursday evening after 5 pm is half-price.",
        "The official visit page lists the museum address at 6393 Northwest Marine Drive, Vancouver.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that every west-side daytime route should become a museum day.",
        "Hours, pricing, and exhibition details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-nitobe-daytime-start",
      slug: "nitobe-memorial-garden-daytime-start",
      collection: "vancouver_west_side_daytime_starters",
      name: "Nitobe Memorial Garden",
      category: "Garden",
      neighborhood: "UBC",
      routeRole: "Quiet reflection daytime starter",
      summary:
        "A useful west-side daytime starter when the route wants a quieter garden-led anchor with more reflection and less city noise.",
      whyItFits:
        "The official Nitobe page gives CityAtlas a direct public source for current seasonal hours, the extended Thursday window, and the garden's peace-and-contemplation framing without turning it into fake wellness authority.",
      bestFor: ["Quieter daytime plans", "Garden-led starts", "Reflective west-side routes"],
      officialSourceLabel: "Official Nitobe Memorial Garden page",
      officialSourceUrl: "https://botanicalgarden.ubc.ca/nitobe-memorial-garden/",
      sourceOwner: "UBC Botanical Garden official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Nitobe Memorial Garden is a place of peace, contemplation, and cultural connection.",
        "The official page lists hours from May 18 to September 7 as Monday to Sunday from 10:00 am to 4:30 pm, with Thursday extended to 8:00 pm.",
        "The official page says Nitobe Memorial Garden is a traditional Japanese stroll garden and tea house at the University of British Columbia.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming therapeutic outcomes, crowd levels, or that Nitobe is the right choice for every quieter daytime plan.",
        "Hours, ticketing, and event details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-ubc-botanical-daytime-start",
      slug: "ubc-botanical-garden-daytime-start",
      collection: "vancouver_west_side_daytime_starters",
      name: "UBC Botanical Garden",
      category: "Botanical garden",
      neighborhood: "UBC",
      routeRole: "Garden-and-canopy daytime starter",
      summary:
        "A strong west-side daytime starter when the route wants a fuller garden anchor with more walking structure than a single beach or museum stop.",
      whyItFits:
        "The official UBC Botanical Garden visit page gives CityAtlas a direct public source for current garden hours, ticketing access, and combined pricing context with Nitobe without pretending it is a universal daytime winner.",
      bestFor: ["Garden-led daytime routes", "Longer west-side walks", "Weather-friendly nature starts"],
      officialSourceLabel: "Official UBC Botanical Garden visit page",
      officialSourceUrl: "https://botanicalgarden.ubc.ca/visit/",
      sourceOwner: "UBC Botanical Garden official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official visit page says UBC Botanical Garden welcomes visitors Tuesday through Sunday and notes seasonal variations.",
        "The official page lists hours from May 18 to September 7 as Monday to Sunday from 10:00 am to 4:30 pm, with Thursday extended to 8:00 pm for the garden set shown in the visit planner.",
        "The official page lists combined admission pricing for UBC Botanical Garden and Nitobe Memorial Garden.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming ideal bloom timing, trail conditions, or that every west-side daytime plan should become a full garden route.",
        "Hours, access rules, and admission details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-granville-public-market-culture-start",
      slug: "granville-island-public-market-culture-start",
      collection: "vancouver_false_creek_culture_starters",
      name: "Granville Island Public Market",
      category: "Public market",
      neighborhood: "Granville Island",
      routeRole: "Browse-and-snack culture starter",
      summary:
        "A strong False Creek culture starter when the afternoon wants lighter structure, easy food choices, and a market-led beginning before the route narrows into one deeper culture stop.",
      whyItFits:
        "The official Granville Island site gives CityAtlas a direct public source for Public Market hours, holiday and January-maintenance notes, and visit-planning support without vague local-market superlatives.",
      bestFor: ["Market-led starts", "Mixed-interest groups", "Flexible culture afternoons"],
      officialSourceLabel: "Official Granville Island site",
      officialSourceUrl: "https://granvilleisland.com/public-market",
      sourceOwner: "Granville Island official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says the Public Market is an indoor market with food, produce stores, farmers stalls, and market artisans.",
        "The official site says the Public Market is open on statutory holidays except December 25, December 26, and January 1, and that it is closed on Mondays in January for annual maintenance.",
        "The official site lists summer hours from June 4 to September 7 as 9 AM to 6 PM Monday to Wednesday and 9 AM to 7 PM Thursday to Sunday.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming vendor availability, crowd levels, or that Granville Island is the right culture start for every Vancouver afternoon.",
        "Hours, vendors, and site access details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-mov-culture-start",
      slug: "museum-of-vancouver-culture-start",
      collection: "vancouver_false_creek_culture_starters",
      name: "Museum of Vancouver",
      category: "Museum",
      neighborhood: "Vanier Park",
      routeRole: "Civic-history culture starter",
      summary:
        "A useful False Creek culture starter when the route wants one stronger indoor anchor focused on Vancouver stories before anything else gets layered in.",
      whyItFits:
        "The official MOV site gives CityAtlas a direct public source for current weekly hours, the Chestnut Street address, and the museum's Vancouver-story framing without fake museum-ranking language.",
      bestFor: ["Indoor culture starts", "Vanier Park afternoons", "City-story routes"],
      officialSourceLabel: "Official museum website",
      officialSourceUrl: "https://museumofvancouver.ca/",
      sourceOwner: "Museum of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says the Museum of Vancouver connects Vancouverites to each other and connects the city to the world through stories, objects, and shared experiences.",
        "The official site lists the address at 1100 Chestnut Street, Vancouver, BC V6J 3J9.",
        "The official site lists hours as Monday to Wednesday 10am to 5pm, Thursday to Saturday 10am to 8pm, and Sunday 10am to 5pm.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that MOV is the right culture start for every Vancouver afternoon.",
        "Hours, exhibitions, and admissions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-maritime-culture-start",
      slug: "vancouver-maritime-museum-culture-start",
      collection: "vancouver_false_creek_culture_starters",
      name: "Vancouver Maritime Museum",
      category: "Museum",
      neighborhood: "Vanier Park",
      routeRole: "Waterfront-history culture starter",
      summary:
        "A strong False Creek culture starter when the route wants one contained waterfront museum anchor near Vanier Park instead of a broader multi-neighborhood plan.",
      whyItFits:
        "The official museum site gives CityAtlas a direct public source for current daily hours, the Ogden address, and the museum's maritime-history framing without pretending it is the universal best museum stop for every visitor.",
      bestFor: ["Waterfront culture starts", "Weather-proof afternoons", "Contained museum routes"],
      officialSourceLabel: "Official museum website",
      officialSourceUrl: "https://vanmaritime.com/",
      sourceOwner: "Vancouver Maritime Museum official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says the museum is about getting to know the history of the waters that surround Vancouver.",
        "The official site lists public hours as Monday to Sunday from 10:00 am to 5:00 pm, including statutory holidays excluding Christmas.",
        "The official site lists the address at 1905 Ogden Ave., Vancouver, BC V6J 1A3.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibit fit, ticket availability, or that every False Creek culture plan should include the Maritime Museum.",
        "Hours, admissions, and programming can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-space-centre-culture-start",
      slug: "space-centre-culture-start",
      collection: "vancouver_false_creek_culture_starters",
      name: "H.R. MacMillan Space Centre",
      category: "Science centre",
      neighborhood: "Vanier Park",
      routeRole: "Science-and-planetarium culture starter",
      summary:
        "A useful False Creek culture starter when the route wants one structured science or planetarium anchor before anything else gets added.",
      whyItFits:
        "The official Space Centre visit page gives CityAtlas a direct public source for current daytime-visit structure, the Vanier Park address, and access notes without fake family-attraction ranking language.",
      bestFor: ["Science-led afternoons", "Vanier Park starts", "Weather-aware culture routes"],
      officialSourceLabel: "Official Space Centre visit page",
      officialSourceUrl: "https://www.spacecentre.ca/plan-your-visit/",
      sourceOwner: "H.R. MacMillan Space Centre official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official visit page says the Space Centre is open 7 days a week from 10:00am to 3:00pm for daytime visits.",
        "The official visit page says daytime visits include a Planetarium Star Theatre show, a live science demo, and gallery access.",
        "The official visit page lists the address at Vanier Park, 1100 Chestnut Street, Vancouver, BC V6J 3J9.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current ticket availability, show fit, or that every culture afternoon should include a science-centre stop.",
        "Hours, showtimes, and admissions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-kits-beach-culture-follow-through",
      slug: "kitsilano-beach-culture-follow-through",
      collection: "vancouver_false_creek_culture_starters",
      name: "Kitsilano Beach",
      category: "Beach",
      neighborhood: "Kitsilano",
      routeRole: "Waterfront follow-through anchor",
      summary:
        "A helpful False Creek culture follow-through when the afternoon wants one simple shoreline continuation after a market or museum anchor instead of a second full destination problem.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Kits Beach's location, Seawall access, public amenities, and seasonal lifeguard framing without forcing vague scenic hype.",
      bestFor: ["Waterfront follow-through", "Open-air second acts", "Compact shoreline finishes"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/kitsilano-beach.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Kitsilano Beach is located on Cornwall Ave at the north end of Yew St.",
        "The official page says the Seawall runs alongside the beach and that Kitsilano Pool is at the west side.",
        "The official page lists public washrooms, a swimming raft, seasonal lifeguards, and pay parking among the features.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming weather, crowd levels, or that every False Creek culture route should continue all the way to Kits Beach.",
        "Beach conditions, lifeguard coverage, and on-site services can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-moa-ubc-discovery-start",
      slug: "museum-of-anthropology-ubc-discovery-start",
      collection: "vancouver_ubc_discovery_starters",
      name: "Museum of Anthropology at UBC",
      category: "Museum",
      neighborhood: "UBC",
      routeRole: "World-arts campus starter",
      summary:
        "A strong UBC discovery starter when the day wants one deeper indoor culture anchor that can carry most of the route on its own.",
      whyItFits:
        "The official MOA site gives CityAtlas a direct public source for current weekly hours, the NW Marine Drive address, and the museum's world-arts-and-culture framing without fake campus-superlative language.",
      bestFor: ["Indoor campus starts", "Culture-led west-side days", "One-anchor museum plans"],
      officialSourceLabel: "Official museum website",
      officialSourceUrl: "https://moa.ubc.ca/",
      sourceOwner: "Museum of Anthropology at UBC official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says MOA is a place of world arts and culture.",
        "The official site lists hours as 10 am to 5 pm Monday to Wednesday and Friday to Sunday, and 10 am to 9 pm on Thursday, with a note that it is closed Mondays from October 15 to May 15.",
        "The official site lists the address at 6393 NW Marine Drive, Vancouver, BC, Canada V6T 1Z2.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that MOA is the right start for every west-side discovery day.",
        "Hours, exhibitions, and admissions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-beaty-ubc-discovery-start",
      slug: "beaty-biodiversity-museum-ubc-discovery-start",
      collection: "vancouver_ubc_discovery_starters",
      name: "Beaty Biodiversity Museum",
      category: "Museum",
      neighborhood: "UBC",
      routeRole: "Natural-history campus starter",
      summary:
        "A useful UBC discovery starter when the day wants one science-first museum anchor with a clearer natural-history identity than a broader campus roam.",
      whyItFits:
        "The official Beaty site gives CityAtlas a direct public source for current museum hours, the Main Mall address, and the museum's visitor framing without pretending every campus day should revolve around biodiversity exhibits.",
      bestFor: ["Science-led starts", "Contained campus routes", "Weather-proof discovery days"],
      officialSourceLabel: "Official museum hours page",
      officialSourceUrl: "https://beatymuseum.ubc.ca/visit/about/hours/",
      sourceOwner: "Beaty Biodiversity Museum official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official hours page lists hours as Tuesday to Sunday from 10:00 am to 5:00 pm.",
        "The official page says Beaty Nocturnal runs every third Thursday of the month from 5:00 pm to 8:30 pm with admission by donation.",
        "The official page says that from May to August 2026 the museum is open all days of the week, including Mondays, from 10:00 am to 5:00 pm, and lists the address at 2212 Main Mall, Vancouver, BC, Canada, V6T 1Z4.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibit fit, event availability, or that Beaty is the right start for every UBC-side route.",
        "Hours, admissions, and programming can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-nitobe-ubc-discovery-start",
      slug: "nitobe-memorial-garden-ubc-discovery-start",
      collection: "vancouver_ubc_discovery_starters",
      name: "Nitobe Memorial Garden",
      category: "Garden",
      neighborhood: "UBC",
      routeRole: "Quiet garden campus starter",
      summary:
        "A strong UBC discovery starter when the day wants a quieter, more reflective west-side anchor instead of a busier museum or beach-led route.",
      whyItFits:
        "The official Nitobe page gives CityAtlas a direct public source for current hours and the garden's reflection-and-cultural-connection framing without turning one quiet garden into a universal west-side answer.",
      bestFor: ["Quiet campus starts", "Reflective garden routes", "Calmer west-side plans"],
      officialSourceLabel: "Official garden page",
      officialSourceUrl: "https://botanicalgarden.ubc.ca/nitobe-memorial-garden/",
      sourceOwner: "UBC Botanical Garden official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes Nitobe Memorial Garden as one of the most authentic Japanese gardens outside Japan and a place of peace, contemplation, and cultural connection.",
        "The official page lists hours from May 18 to September 7 as Monday to Sunday from 10:00am to 4:30pm, with Thursday extended to 8:00pm.",
        "The official page lists fall hours from September 8 to October 31 as Tuesday to Sunday from 10:00am to 4:30pm and notes a few special later openings or earlier closing dates.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming seasonal bloom fit, crowd levels, or that Nitobe is the right start for every UBC discovery day.",
        "Hours, access notes, and special closures can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-botanical-garden-ubc-discovery-start",
      slug: "ubc-botanical-garden-ubc-discovery-start",
      collection: "vancouver_ubc_discovery_starters",
      name: "UBC Botanical Garden",
      category: "Botanical garden",
      neighborhood: "UBC",
      routeRole: "Longer garden-and-collections starter",
      summary:
        "A useful UBC discovery starter when the day wants a fuller garden anchor with more walking structure than one museum stop or one short campus follow-through.",
      whyItFits:
        "The official UBC Botanical Garden site gives CityAtlas a direct public source for current garden hours, the living-collection framing, and visit planning without vague campus-day hype.",
      bestFor: ["Garden-led discovery days", "Longer west-side walks", "Nature-and-campus starts"],
      officialSourceLabel: "Official garden homepage",
      officialSourceUrl: "https://botanicalgarden.ubc.ca/",
      sourceOwner: "UBC Botanical Garden official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site describes UBC Botanical Garden as Canada's oldest university botanical garden and a living collection that celebrates plants, people, and biodiversity.",
        "The official site lists garden hours from May 18 to September 7 as Monday to Sunday from 10:00am to 4:30pm, with Thursday extended to 8:00pm.",
        "The official site says GreenHeart TreeWalk is open Tuesday to Sunday and on statutory holiday Mondays, with extended hours on Thursday.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming bloom timing, trail conditions, or that every UBC-side day should become a full garden route.",
        "Hours, attractions, and admissions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-greenheart-ubc-discovery-follow-through",
      slug: "greenheart-treewalk-ubc-discovery-follow-through",
      collection: "vancouver_ubc_discovery_starters",
      name: "GreenHeart TreeWalk",
      category: "Canopy walkway",
      neighborhood: "UBC Botanical Garden",
      routeRole: "Forest-canopy follow-through anchor",
      summary:
        "A helpful UBC discovery follow-through when the day wants one memorable forest-canopy continuation after a museum or garden anchor instead of a second full neighborhood problem.",
      whyItFits:
        "The official GreenHeart page gives CityAtlas a direct public source for current seasonal hours, the 310-metre canopy-walk framing, and time expectation without pretending every campus route needs a treetop add-on.",
      bestFor: ["Canopy follow-through", "Campus-side second acts", "Forest-led finishes"],
      officialSourceLabel: "Official GreenHeart TreeWalk page",
      officialSourceUrl: "https://botanicalgarden.ubc.ca/visit/greenheart-tree-walk/",
      sourceOwner: "UBC Botanical Garden official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page lists hours from May 18 to September 7 as Tuesday to Sunday from 10:00am to 4:30pm, with Thursday extended to 8:00pm.",
        "The official page says the walkway stretches 310 metres through the heart of UBC Botanical Garden and includes a 23-metre-high viewing platform.",
        "The official page recommends allowing one hour or more to complete the GreenHeart TreeWalk.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming ticket availability, wildlife sightings, or that every UBC discovery day should include the TreeWalk.",
        "Hours, entry rules, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-queen-elizabeth-garden-day-start",
      slug: "queen-elizabeth-park-garden-day-start",
      collection: "vancouver_garden_day_starters",
      name: "Queen Elizabeth Park",
      category: "Urban park",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Hilltop view-and-garden starter",
      summary:
        "A useful garden-day starter when the route wants one elevated scenic impression, open-air walking, and a central city anchor without forcing a longer botanical commitment.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Queen Elizabeth Park's hilltop views, garden framing, and downtown access without pretending every greener day should become a long botanical route.",
      bestFor: ["View-led garden days", "Shorter scenic starts", "Central city green anchors"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/queen-elizabeth-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Queen Elizabeth Park is Vancouver's horticultural jewel and a major draw for floral display enthusiasts and view-seekers.",
        "The official page says the park is 125 metres above sea level at Vancouver's highest point.",
        "The official page says Queen Elizabeth Park is only 15 minutes by public transit or car from downtown.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed blooms, quiet conditions, or that every garden day should begin with a hilltop park.",
        "Access details, seasonal conditions, and on-site amenities can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-bloedel-garden-day-start",
      slug: "bloedel-conservatory-garden-day-start",
      collection: "vancouver_garden_day_starters",
      name: "Bloedel Conservatory",
      category: "Conservatory",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Contained indoor nature starter",
      summary:
        "A strong garden-day starter when the plan wants one warm indoor nature anchor, a shorter contained stop, and less pressure to build a full outdoor walking route.",
      whyItFits:
        "The official Bloedel page gives CityAtlas a direct public source for the conservatory's seasonal hours, indoor tropical environment, and accessibility notes without pretending every greener day should become a bigger park route.",
      bestFor: ["Indoor garden starts", "Mixed-weather plans", "Contained quieter stops"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/bloedel-conservatory.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page lists hours from May to September 7 as 10am to 7pm and says last entry is 15 minutes before closing.",
        "The official page says Bloedel Conservatory is a domed lush paradise in Queen Elizabeth Park with tropical birds, koi fish, and over 500 exotic plants.",
        "The official page says the main pathway inside the conservatory is fully accessible to wheelchairs, scooters, and walkers.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming sensory outcomes, ideal crowd levels, or that every garden day should begin indoors.",
        "Admission rules, event schedules, and on-site sensory conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vandusen-garden-day-start",
      slug: "vandusen-botanical-garden-garden-day-start",
      collection: "vancouver_garden_day_starters",
      name: "VanDusen Botanical Garden",
      category: "Botanical garden",
      neighborhood: "Shaughnessy",
      routeRole: "Longer botanical walk starter",
      summary:
        "A strong garden-day starter when the route wants one fuller botanical walk with enough scale to carry most of the day.",
      whyItFits:
        "The official VanDusen page gives CityAtlas a direct public source for the garden's size, current seasonal hours, cafe access, and path accessibility without pretending every greener day should become a must-see ranking page.",
      bestFor: ["Longer botanical walks", "Nature-first afternoons", "Garden-led route days"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/vandusen-botanical-garden.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page lists hours from June to September 7 as 9am to 7pm and says last entry is 30 minutes before closing.",
        "The official page describes VanDusen Botanical Garden as a 55-acre oasis in the heart of Vancouver with over 7,500 plant species and varieties from around the world.",
        "The official page says the Garden Cafe is open daily during Garden hours and that most paved garden paths are fully accessible.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed blooms, low crowds, or that every garden day should become the longest possible walk.",
        "Admission, path access, and seasonal conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-nitobe-garden-day-start",
      slug: "nitobe-memorial-garden-garden-day-start",
      collection: "vancouver_garden_day_starters",
      name: "Nitobe Memorial Garden",
      category: "Garden",
      neighborhood: "UBC",
      routeRole: "Quiet contemplative garden starter",
      summary:
        "A useful garden-day starter when the route wants a quieter, more reflective garden anchor instead of a bigger urban park or longer botanical circuit.",
      whyItFits:
        "The official Nitobe page gives CityAtlas a direct public source for the garden's current hours and peace-and-contemplation framing without pretending every quieter day should move to the west side.",
      bestFor: ["Reflective garden starts", "Quieter west-side plans", "Contained campus-side calm"],
      officialSourceLabel: "Official Nitobe Memorial Garden page",
      officialSourceUrl: "https://botanicalgarden.ubc.ca/nitobe-memorial-garden/",
      sourceOwner: "UBC Botanical Garden official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes Nitobe Memorial Garden as one of the most authentic Japanese gardens outside Japan and a place of peace, contemplation, and cultural connection.",
        "The official page lists hours from May 18 to September 7 as Monday to Sunday from 10:00am to 4:30pm, with Thursday extended to 8:00pm.",
        "The official page lists several 2026 dates with a later 11:00am opening and an earlier closing on Thursday, July 2, 2026.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming bloom timing, crowd levels, or that every garden day should make the west side the only answer.",
        "Hours, ticketing, and special closure details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-ubc-botanical-garden-garden-day-start",
      slug: "ubc-botanical-garden-garden-day-start",
      collection: "vancouver_garden_day_starters",
      name: "UBC Botanical Garden",
      category: "Botanical garden",
      neighborhood: "UBC",
      routeRole: "Living-collection garden starter",
      summary:
        "A strong garden-day starter when the route wants a fuller west-side botanical walk with more living-collection structure than one shorter garden stop.",
      whyItFits:
        "The official UBC Botanical Garden site gives CityAtlas a direct public source for current garden hours, living-collection framing, and the linked Nitobe schedule without turning one campus garden into a universal city winner.",
      bestFor: ["Campus-side garden days", "Longer west-side nature walks", "Living-collection starts"],
      officialSourceLabel: "Official garden homepage",
      officialSourceUrl: "https://botanicalgarden.ubc.ca/",
      sourceOwner: "UBC Botanical Garden official website",
      sourceCheckedAt: "2026-06-15",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site describes UBC Botanical Garden as Canada's oldest university botanical garden and a living collection that celebrates plants, people and biodiversity.",
        "The official site lists garden hours from May 18 to September 7 as Monday to Sunday from 10:00am to 4:30pm, with Thursday extended to 8:00pm.",
        "The official site lists Nitobe Memorial Garden hours for the same season and notes a few later openings and one earlier closing date in 2026.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming bloom timing, trail conditions, or that every garden day should become a full campus itinerary.",
        "Hours, admissions, and on-site access can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vpl-central-reset",
      slug: "vpl-central-library-reset-start",
      collection: "vancouver_wellness_reset_starters",
      name: "Vancouver Public Library Central Library",
      category: "Public library",
      neighborhood: "Downtown",
      routeRole: "Quiet indoor reset starter",
      summary:
        "A useful downtown reset anchor when the plan needs a low-pressure indoor pause with public work and reading features instead of a purchase-required cafe stop.",
      whyItFits:
        "The official Central Library page gives CityAtlas a public source for the library's central location, transit access, accessible tables, and public-use features without forcing fake cafe or productivity claims.",
      bestFor: ["Weather-proof resets", "Solo decompression", "Central city pauses"],
      officialSourceLabel: "Official branch page",
      officialSourceUrl: "https://www.vpl.ca/branches/central",
      sourceOwner: "Vancouver Public Library official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official branch page confirms the Central Library address at 350 West Georgia Street, Vancouver BC V6B 6B1.",
        "The official page says the branch is a 7 minute walk from City Centre Station and Stadium Stations.",
        "The official page lists mobility-device accessible tables, height adjustable tables, computers, phone charging stations, and Wi-Fi Access as library features.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming the Central Library is a cafe, that every visitor should work there, or that the space will always be silent or seat-rich.",
        "Hours, room availability, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-stanley-park-reset",
      slug: "stanley-park-wellness-reset-start",
      collection: "vancouver_wellness_reset_starters",
      name: "Stanley Park",
      category: "Urban park",
      neighborhood: "Stanley Park",
      routeRole: "Scenic decompression starter",
      summary:
        "A strong reset anchor when the plan needs an outdoor walk, waterfront breathing room, and a simpler pace instead of a dense stop-by-stop route.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Stanley Park's scenic trails, waterfront setting, and public hours without turning the page into generic wellness hype.",
      bestFor: ["Outdoor reset hours", "Walk-led decompression", "Good-weather calm plans"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/stanley-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes Stanley Park as Vancouver's first, largest, and most beloved urban park.",
        "The official page highlights scenic trails plus beaches and waterfront views along the Seawall.",
        "The official page says the park is open from 6am to 10pm unless otherwise posted.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming therapeutic outcomes, perfect conditions, or that every reset plan should begin with Stanley Park.",
        "Weather, crowd levels, and access conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-queen-elizabeth-reset",
      slug: "queen-elizabeth-park-wellness-reset-start",
      collection: "vancouver_wellness_reset_starters",
      name: "Queen Elizabeth Park",
      category: "Urban park",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Hilltop calm-view starter",
      summary:
        "A useful reset anchor when the plan needs one elevated city view, slower pacing, and room to walk without stacking too many stops.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a public source for Queen Elizabeth Park's hilltop views, downtown access, and broader garden setting without exaggerated claims about recovery.",
      bestFor: ["View-led resets", "Calmer afternoons", "Short scenic detours"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/queen-elizabeth-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Queen Elizabeth Park is Vancouver's horticultural jewel and a major draw for floral display enthusiasts and view-seekers.",
        "The official page says the park is 125 m above sea level at Vancouver's highest point.",
        "The official page says Queen Elizabeth Park is only 15 minutes by public transit or car from downtown.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed quiet, ideal weather, or that a hilltop park is the right reset for every person or every body.",
        "Transit timing, access details, and seasonal conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-bloedel-reset",
      slug: "bloedel-conservatory-wellness-reset-start",
      collection: "vancouver_wellness_reset_starters",
      name: "Bloedel Conservatory",
      category: "Conservatory",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Warm indoor sensory reset starter",
      summary:
        "A strong reset anchor when the plan needs a warm indoor environment, slower sensory pacing, and one contained stop instead of a bigger city route.",
      whyItFits:
        "The official Bloedel page gives CityAtlas a direct public source for the conservatory's indoor tropical environment, public hours, and accessibility support without implying treatment or outcome claims.",
      bestFor: ["Indoor reset hours", "Rainy-day calm plans", "Sensory-friendly pacing"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/bloedel-conservatory.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Bloedel Conservatory is a domed lush paradise in Queen Elizabeth Park with tropical birds, koi fish, and over 500 exotic plants in a temperature-controlled environment.",
        "The official page lists hours of 10am to 7pm from May to September 7, with last entry 15 minutes before closing.",
        "The official page says the main pathway inside the conservatory is fully accessible and that sensory support kits are available for neurodivergent patrons.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming sensory outcomes, mental-health treatment value, or that the conservatory is always the best fit for every reset plan.",
        "Admission rules, event schedules, and on-site sensory conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vandusen-reset",
      slug: "vandusen-botanical-garden-wellness-reset-start",
      collection: "vancouver_wellness_reset_starters",
      name: "VanDusen Botanical Garden",
      category: "Botanical garden",
      neighborhood: "Shaughnessy",
      routeRole: "Garden-walk reset starter",
      summary:
        "A strong reset anchor when the plan needs a longer garden walk, quieter pacing, and a more nature-led afternoon without pretending the route needs a wellness treatment frame.",
      whyItFits:
        "The official VanDusen page gives CityAtlas a public source for the garden's size, serene setting, daily cafe access, and accessibility notes without pushing generic self-care language.",
      bestFor: ["Garden-led resets", "Longer calm afternoons", "Nature-first pacing"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/vandusen-botanical-garden.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes VanDusen Botanical Garden as a 55-acre oasis in the heart of Vancouver with over 7,500 plant species and varieties from around the world.",
        "The official page says visitors can unwind in a serene setting and that the Garden Cafe is open daily during Garden hours.",
        "The official page lists summer hours of 9am to 7pm from June to September 7 and says most paved garden paths are fully accessible.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed quiet, low crowds, or that a botanical garden is the right reset for every budget or mobility need.",
        "Admission, seasonal conditions, and path access can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vancouver-art-gallery-downtown-start",
      slug: "vancouver-art-gallery-downtown-start",
      collection: "vancouver_first_time_visitor_starters",
      name: "Vancouver Art Gallery",
      category: "Art gallery",
      neighborhood: "Downtown",
      routeRole: "Downtown culture-first starter",
      summary:
        "A strong downtown starting area anchor when the first visit needs one central cultural stop before dinner, a short walk, or an easier hotel-friendly close.",
      whyItFits:
        "The official visit page gives CityAtlas a direct public source for the gallery's downtown location, current public hours, and first-Friday free-entry window without pretending every visitor should start with the same museum stop.",
      bestFor: ["Downtown hotel stays", "Culture-first arrivals", "Weather-proof starts"],
      officialSourceLabel: "Official visit page",
      officialSourceUrl: "https://www.vanartgallery.bc.ca/visit/",
      sourceOwner: "Vancouver Art Gallery official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official visit page confirms the Vancouver Art Gallery address at 750 Hornby Street, Vancouver, BC V6Z 2H7.",
        "The official visit page lists public hours of 10 AM to 5 PM Monday through Thursday, Saturday, and Sunday, with Friday open until 8 PM.",
        "The official visit page says the gallery is open seven days a week from May 19 to September 8, 2026.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that every first-time visitor should begin in the downtown cultural core.",
        "Hours, pricing, and special-program details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-gastown-start",
      slug: "gastown-first-time-visitor-start",
      collection: "vancouver_first_time_visitor_starters",
      name: "Gastown",
      category: "Historic neighborhood",
      neighborhood: "Gastown",
      routeRole: "Historic-core atmosphere starter",
      summary:
        "A useful first-visit starting area when the goal is to feel Vancouver's older downtown texture quickly and keep the route close to transit, dinner, and a short walk.",
      whyItFits:
        "The official Gastown BIA site gives CityAtlas a public source for the neighborhood's historic-core identity, creative mix, and Waterfront-adjacent access without forcing a fake universal ranking.",
      bestFor: ["Historic-core starts", "Cruise or Waterfront arrivals", "Atmosphere-first evenings"],
      officialSourceLabel: "Official neighborhood page",
      officialSourceUrl: "https://gastown.org/about-us/",
      sourceOwner: "Gastown Business Improvement Society official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official neighborhood page describes Gastown as a historical hub of creativity.",
        "The official page says visitors can explore retail shops, restaurants, coffee shops, and music venues in the area.",
        "The official page says Gastown is accessible via Waterfront Station and is a 5 minute walk from both the Cruise Ship Terminal and Vancouver Convention Centre.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming every first-time visitor should choose Gastown or that the neighborhood is always the easiest fit for every plan.",
        "Event programming, street conditions, and exact business mix can change and should be confirmed on official sources before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-granville-island-visitor-start",
      slug: "granville-island-public-market-visitor-start",
      collection: "vancouver_first_time_visitor_starters",
      name: "Granville Island Public Market",
      category: "Public market",
      neighborhood: "Granville Island",
      routeRole: "Food-and-browse starter",
      summary:
        "A strong first-visit starting area anchor when the plan wants easy food choices, indoor browsing, and a casual sense of place without needing a rigid itinerary.",
      whyItFits:
        "The official market page gives CityAtlas a direct public source for the indoor-market framing, holiday exceptions, and current summer hours, which fits a low-pressure first-time visitor start.",
      bestFor: ["Casual arrivals", "Food-first starts", "Mixed-interest groups"],
      officialSourceLabel: "Official Public Market page",
      officialSourceUrl: "https://granvilleisland.com/public-market",
      sourceOwner: "Granville Island official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes the Granville Island Public Market as an indoor market.",
        "The official page says the market is open on statutory holidays except December 25, December 26, and January 1.",
        "The official page lists summer hours of 9 AM to 6 PM Monday to Wednesday and 9 AM to 7 PM Thursday to Sunday from June 4 to September 7.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming crowd levels, vendor mix, or that Granville Island is the right first stop for every visitor.",
        "Vendor hours, seasonal activity, and transportation details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-stanley-park-visitor-start",
      slug: "stanley-park-visitor-start",
      collection: "vancouver_first_time_visitor_starters",
      name: "Stanley Park",
      category: "Urban park",
      neighborhood: "Stanley Park",
      routeRole: "Scenic walk-and-view starter",
      summary:
        "A strong first-visit starting area anchor when the goal is one iconic Vancouver outdoor impression, a simpler walking route, and less indoor decision fatigue.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a reliable public source for Stanley Park's downtown location, general opening hours, and seawall-led visitor framing.",
      bestFor: ["Scenic starts", "Good-weather arrivals", "Walk-led intros"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/stanley-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes Stanley Park as Vancouver's first, largest, and most beloved urban park.",
        "The official page says the park is open from 6 AM to 10 PM unless otherwise posted.",
        "The official page says Stanley Park is located in downtown Vancouver and provides a digital map to plan a visit or route.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming weather, crowd levels, or that every first-time visitor should begin with a long Stanley Park route.",
        "Access conditions, dining options, and park operations can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-queen-elizabeth-park-start",
      slug: "queen-elizabeth-park-visitor-start",
      collection: "vancouver_first_time_visitor_starters",
      name: "Queen Elizabeth Park",
      category: "Urban park",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Hilltop calm-view starter",
      summary:
        "A good first-visit starting area when the plan wants skyline views, a calmer pace, and one elevated Vancouver impression instead of a busy downtown first move.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for the park's height, downtown distance, and Bloedel connection, which makes it a safer route-choice reference than generic scenic hype.",
      bestFor: ["View-first arrivals", "Calmer intros", "Short scenic detours"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/queen-elizabeth-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Queen Elizabeth Park is Vancouver's horticultural jewel and a major draw for view-seekers.",
        "The official page says the park is 125 metres above sea level at Vancouver's highest point.",
        "The official page says Queen Elizabeth Park is only 15 minutes by public transit or car from downtown and is home to the Bloedel Conservatory.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming every first-time visitor should leave downtown for a hilltop start or that views will always be ideal.",
        "Transit timing, access details, and seasonal conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-distillery-start",
      slug: "distillery-district-first-time-visitor-start",
      collection: "toronto_first_time_visitor_starters",
      name: "Distillery District",
      category: "Historic district",
      neighborhood: "Distillery District",
      routeRole: "Historic-core atmosphere starter",
      summary:
        "A strong first-visit starting area when the plan wants walkable brick-lane atmosphere, dining spillover, and one compact part of Toronto that already feels like a route.",
      whyItFits:
        "The official district site gives CityAtlas a public source for all-year access, the shopping-and-dining mix, and the art-and-culture framing without pretending every first-time visitor should follow one identical historic-core plan.",
      bestFor: ["Atmosphere-first arrivals", "Walkable evening spillover", "Historic-core starts"],
      officialSourceLabel: "Official district website",
      officialSourceUrl: "https://www.thedistillerydistrict.com/",
      sourceOwner: "Distillery District official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says the Distillery District is open 364 days a year.",
        "The official site says the district has more than 40 boutiques and one-of-a-kind shops.",
        "The official site says the district is home to theatres, galleries, and artists.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming every first-time Toronto visitor should begin in the Distillery District or that every visit should center on shopping and dining.",
        "Business mix, event programming, and exact venue availability can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-st-lawrence-start",
      slug: "st-lawrence-market-first-time-visitor-start",
      collection: "toronto_first_time_visitor_starters",
      name: "St. Lawrence Market",
      category: "Public market",
      neighborhood: "Old Town",
      routeRole: "Food-and-browse starter",
      summary:
        "A strong first-visit starting area anchor when the plan wants easy food choices, merchant variety, and a flexible Toronto start without a rigid museum-or-reservation schedule.",
      whyItFits:
        "The official market site gives CityAtlas a direct public source for current South Market hours, the Front Street address, and the merchant-led browsing frame, which suits a lower-pressure first-time arrival.",
      bestFor: ["Food-first starts", "Casual arrivals", "Mixed-interest groups"],
      officialSourceLabel: "Official market website",
      officialSourceUrl: "https://www.stlawrencemarket.com/",
      sourceOwner: "St. Lawrence Market official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says the South Market is open Tuesday to Friday from 9am to 7pm, Saturday from 7am to 5pm, Sunday from 10am to 5pm, and Monday is closed.",
        "The official site lists the address at 92-95 Front St East, Toronto, Ontario, M5E 1C3.",
        "The official site says visitors can get to know merchants and farmers who are happy to recommend something new.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming crowd levels, exact vendor mix, or that St. Lawrence Market is the right first stop for every Toronto visitor.",
        "Merchant availability, event activity, and nearby route conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-harbourfront-start",
      slug: "harbourfront-centre-first-time-visitor-start",
      collection: "toronto_first_time_visitor_starters",
      name: "Harbourfront Centre",
      category: "Waterfront arts campus",
      neighborhood: "Waterfront",
      routeRole: "Waterfront culture starter",
      summary:
        "A useful first-visit starting area when the plan wants a waterfront walk, one cultural anchor, and a route that can stay lighter than a full downtown checklist.",
      whyItFits:
        "The official Harbourfront site gives CityAtlas a public source for the waterfront-campus identity, current address, and arts-and-recreation framing without forcing a fake universal Toronto itinerary.",
      bestFor: ["Waterfront starts", "Open-air arrivals", "Culture-and-walk plans"],
      officialSourceLabel: "Official Harbourfront Centre site",
      officialSourceUrl: "https://harbourfrontcentre.com/",
      sourceOwner: "Harbourfront Centre official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says Harbourfront Centre is Toronto's waterfront community campus for arts, culture, learning and recreation.",
        "The official site lists the address at 235 Queens Quay West, Toronto ON M5J 2G8.",
        "The official site says free art exhibitions are on view and highlights music, festivals, and waterfront programming.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming that every first-time Toronto visitor should start on the waterfront or that current programming will match every arrival window.",
        "Exhibition schedules, event timing, and site access can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-rom-start",
      slug: "royal-ontario-museum-first-time-visitor-start",
      collection: "toronto_first_time_visitor_starters",
      name: "Royal Ontario Museum",
      category: "Museum",
      neighborhood: "Bloor-St. George",
      routeRole: "Large indoor culture starter",
      summary:
        "A strong first-visit starting area anchor when the day needs one major indoor museum stop that can carry most of the plan without extra city-hopping.",
      whyItFits:
        "The official museum site gives CityAtlas a direct public source for current hours, the Queen's Park address, and the free third-Tuesday-night program without turning ROM into a universal first-stop claim.",
      bestFor: ["Indoor starts", "Major museum days", "Weather-proof visitor plans"],
      officialSourceLabel: "Official museum website",
      officialSourceUrl: "https://www.rom.on.ca/",
      sourceOwner: "Royal Ontario Museum official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site lists the museum address at 100 Queen's Park, Toronto, ON M5S 2C6.",
        "The official site shows the museum open on June 16 from 10:00 to 20:30 and on June 17 to June 21 from 10:00 to 17:30.",
        "The official site lists a Third Tuesday Nights Free program.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that every first-time Toronto visitor should build the day around ROM.",
        "Hours, special programming, and admission details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-ago-start",
      slug: "art-gallery-of-ontario-first-time-visitor-start",
      collection: "toronto_first_time_visitor_starters",
      name: "Art Gallery of Ontario",
      category: "Art gallery",
      neighborhood: "Downtown West",
      routeRole: "Downtown art-first starter",
      summary:
        "A strong downtown starting area anchor when the first visit needs one central art stop before dinner, a short walk, or an easier hotel-friendly close.",
      whyItFits:
        "The official location, hours, and admission page gives CityAtlas a direct public source for the gallery address, current public hours, and first-Wednesday free-entry window without pretending every Toronto visitor should start with the same museum.",
      bestFor: ["Art-first arrivals", "Downtown hotel stays", "Weather-proof starts"],
      officialSourceLabel: "Official location, hours, and admission page",
      officialSourceUrl: "https://ago.ca/visit/location-hours-admission",
      sourceOwner: "Art Gallery of Ontario official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page lists the gallery address at 317 Dundas Street West, Toronto, Ontario, M5T 1G4.",
        "The official page lists hours of 10:30 AM to 5:00 PM Tuesday and Thursday, 10:30 AM to 9:00 PM Wednesday and Friday, and 10:30 AM to 5:30 PM Saturday and Sunday.",
        "The official page says admission is free on the first Wednesday night of each month between 6pm and 9pm.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that every first-time Toronto visitor should begin with an art-first downtown plan.",
        "Hours, admission offers, and gallery programming can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-stackt-weekend-start",
      slug: "stackt-market-weekend-route-start",
      collection: "toronto_weekend_route_starters",
      name: "STACKT market",
      category: "Market and event space",
      neighborhood: "Bathurst and Front",
      routeRole: "Downtown west browse-and-event starter",
      summary:
        "A useful weekend start when the day wants rotating storefronts, casual food-and-browse energy, and a downtown west base that can stay compact.",
      whyItFits:
        "The official STACKT site gives CityAtlas a public source for the Toronto flagship address, rotating storefront model, and current Tuesday-to-Sunday market hours, which makes it a safer flex-weekend anchor than vague trend-district language.",
      bestFor: ["Casual weekend browsing", "Downtown west starts", "Mixed-interest groups"],
      officialSourceLabel: "Official STACKT site",
      officialSourceUrl: "https://stacktmarket.com/",
      sourceOwner: "STACKT official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site identifies STACKT market as the Toronto flagship at 28 Bathurst Street, Toronto, Ontario M5V 0C6.",
        "The official site says visitors can explore 25+ rotating storefronts within the marketplace.",
        "The official site says the rotating marketplace is open Tuesday to Sunday from 12 PM to 8 PM.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming event lineups, vendor mix, or that every Toronto weekend should start with a market-and-retail route.",
        "Hours, vendor roster, and event programming can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-music-garden-weekend-start",
      slug: "toronto-music-garden-weekend-route-start",
      collection: "toronto_weekend_route_starters",
      name: "Toronto Music Garden",
      category: "Waterfront garden",
      neighborhood: "Harbourfront",
      routeRole: "Waterfront walk-and-concert starter",
      summary:
        "A good weekend start when the day wants a quieter waterfront walk, a garden-led pause, and one arts-adjacent anchor without forcing a bigger downtown checklist.",
      whyItFits:
        "The official Harbourfront venue page gives CityAtlas a public source for the garden location, outdoor and wheelchair-accessible setting, and the current summer music-program window, which supports a lighter weekend route without fake city authority.",
      bestFor: ["Waterfront walks", "Outdoor weekends", "Arts-adjacent starts"],
      officialSourceLabel: "Official Harbourfront Centre venue page",
      officialSourceUrl: "https://harbourfrontcentre.com/venue/toronto-music-garden/",
      sourceOwner: "Harbourfront Centre official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official venue page lists Toronto Music Garden as wheelchair accessible and outdoors.",
        "The official venue page places Toronto Music Garden between Lower Spadina and Dan Leckie Way.",
        "The official venue page lists Summer Music in the Garden from June 21 through August 27.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming concert schedules, crowd levels, or that every Toronto waterfront weekend should begin with the same garden stop.",
        "Programming, access details, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-bentway-weekend-start",
      slug: "bentway-staging-grounds-weekend-route-start",
      collection: "toronto_weekend_route_starters",
      name: "Bentway Staging Grounds",
      category: "Public art and ecology space",
      neighborhood: "Fort York / CityPlace",
      routeRole: "Urban-design and walk-route starter",
      summary:
        "A useful weekend start when the day wants one distinctive public-space walk, experimental gardens, and an easy under-Gardiner route instead of a scattered downtown plan.",
      whyItFits:
        "The official Bentway site gives CityAtlas a public source for the Staging Grounds location, 24-hour visibility, and urban-ecology framing, which makes it a clearer design-and-walk anchor than generic hidden-Toronto copy.",
      bestFor: ["Urban design fans", "Short walking loops", "CityPlace weekends"],
      officialSourceLabel: "Official The Bentway site",
      officialSourceUrl: "https://thebentway.ca/",
      sourceOwner: "The Bentway official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says The Bentway is a growing public space anchored under Toronto's Gardiner Expressway.",
        "The official visit section says Bentway Staging Grounds is viewable 24 hours a day at Dan Leckie Way under the Gardiner.",
        "The official site describes Staging Grounds as a living laboratory for urban ecology with experimental gardens that use rainwater run-off from the highway above.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming every Toronto weekend should center on infrastructure art or that every installation will remain unchanged.",
        "Installations, route access, and event details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-evergreen-weekend-start",
      slug: "evergreen-brick-works-weekend-route-start",
      collection: "toronto_weekend_route_starters",
      name: "Evergreen Brick Works",
      category: "Ravine market and community site",
      neighborhood: "Don Valley",
      routeRole: "Ravine-and-market weekend starter",
      summary:
        "A strong weekend start when the day should feel greener, more spacious, and partly market-led without locking into a downtown-only route.",
      whyItFits:
        "The official Evergreen visit pages give CityAtlas a direct public source for current daily hours, the Bayview address, and the Saturday Farmers Market, which makes Brick Works a safer weekend anchor than vague nature-meets-city language.",
      bestFor: ["Nature-plus-market weekends", "Greener half-days", "Families or mixed-age groups"],
      officialSourceLabel: "Official Evergreen plan-your-visit page",
      officialSourceUrl: "https://www.evergreen.ca/evergreen-brick-works/visitor-info/plan-your-visit/",
      sourceOwner: "Evergreen official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page lists Evergreen Brick Works at 550 Bayview Ave., Toronto, ON, M4W3X8.",
        "The official page lists Evergreen Brick Works hours as 9am to 5pm Monday through Sunday, closed December 25th, 26th, and January 1st.",
        "The official page highlights the Saturday Farmers Market and notes the site includes markets, nature, and public programming.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming market vendor lists, shuttle timing, or that every Toronto weekend group should choose a ravine route.",
        "Hours, market lineups, shuttle details, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-toronto-botanical-garden-weekend-start",
      slug: "toronto-botanical-garden-weekend-route-start",
      collection: "toronto_weekend_route_starters",
      name: "Toronto Botanical Garden",
      category: "Botanical garden",
      neighborhood: "Leslie and Lawrence / Edwards Gardens",
      routeRole: "Quieter garden weekend starter",
      summary:
        "A strong weekend start when the plan wants one quieter garden anchor, free outdoor access, and a greener pace instead of a bigger downtown circuit.",
      whyItFits:
        "The official garden pages give CityAtlas a public source for current visitor hours, dawn-to-dusk garden access, and the garden's public-free outdoor framing, which makes it a cleaner calmer-weekend anchor than generic peaceful-Toronto language.",
      bestFor: ["Garden weekends", "Quieter pacing", "Low-noise starts"],
      officialSourceLabel: "Official Toronto Botanical Garden site",
      officialSourceUrl: "https://torontobotanicalgarden.ca/plan-your-visit/what-to-know-before-you-go/",
      sourceOwner: "Toronto Botanical Garden official website",
      sourceCheckedAt: "2026-06-16",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says the outdoor garden is open from dawn until dusk and is free to enjoy.",
        "The official page lists the Visitor Centre as open daily from 9 a.m. to 4:30 p.m.",
        "The official page says the gardens, Edwards Gardens, and the Don Valley Ravine remain open every day from dawn until dusk.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming bloom conditions, guaranteed quiet, or that every Toronto weekend should become a longer garden day.",
        "Seasonal conditions, path closures, and visitor-centre operations can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-granville-island-guest-start",
      slug: "granville-island-public-market-guest-start",
      collection: "vancouver_out_of_town_guest_starters",
      name: "Granville Island Public Market",
      category: "Public market",
      neighborhood: "Granville Island",
      routeRole: "Food-and-browse guest starter",
      summary:
        "A strong host anchor when the guest needs easy food choices, indoor browsing, and a flexible Vancouver introduction that does not depend on one rigid reservation.",
      whyItFits:
        "The official market page gives CityAtlas a direct public source for the indoor-market framing, holiday rules, and current summer hours, which makes it a stronger host-plan anchor than generic travel roundup language.",
      bestFor: ["Mixed-interest groups", "Casual hosting", "Low-pressure midday starts"],
      officialSourceLabel: "Official Public Market page",
      officialSourceUrl: "https://granvilleisland.com/public-market",
      sourceOwner: "Granville Island official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes the Granville Island Public Market as an indoor market with food, produce stores, farmers stalls, and Market Artisans.",
        "The official page says the market is open on statutory holidays except December 25, December 26, and January 1, and closed Mondays in January only for annual maintenance.",
        "The official page lists summer hours from June 4 to September 7 as 9 AM to 6 PM Monday to Wednesday and 9 AM to 7 PM Thursday to Sunday.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming crowd levels, vendor availability, or that Granville Island is the right host plan for every guest or every budget.",
        "Vendor hours, seasonal programming, and transportation details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vancouver-art-gallery-guest-start",
      slug: "vancouver-art-gallery-guest-start",
      collection: "vancouver_out_of_town_guest_starters",
      name: "Vancouver Art Gallery",
      category: "Art gallery",
      neighborhood: "Downtown",
      routeRole: "Central indoor culture starter",
      summary:
        "A useful host anchor when the guest needs a central indoor plan with clear hours, a straightforward meeting point, and an easy transition into the rest of downtown.",
      whyItFits:
        "The official visit page gives CityAtlas a direct public source for the gallery's downtown address, current public hours, and summer daily opening pattern without pretending every guest wants the same museum stop.",
      bestFor: ["Downtown hotel guests", "Weather-proof hosting", "Culture-first starts"],
      officialSourceLabel: "Official visit page",
      officialSourceUrl: "https://www.vanartgallery.bc.ca/visit/",
      sourceOwner: "Vancouver Art Gallery official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official visit page confirms the Vancouver Art Gallery address at 750 Hornby Street, Vancouver, BC V6Z 2H7.",
        "The official visit page lists public hours of 10 AM to 5 PM Monday through Thursday, Saturday, and Sunday, with Friday open until 8 PM.",
        "The official visit page says the gallery is open seven days a week from May 19 to September 8, 2026.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that every out-of-town guest should start with the Vancouver Art Gallery.",
        "Hours, pricing, accessibility details, and special programs can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-stanley-park-guest-start",
      slug: "stanley-park-guest-start",
      collection: "vancouver_out_of_town_guest_starters",
      name: "Stanley Park",
      category: "Urban park",
      neighborhood: "Stanley Park",
      routeRole: "Big-scenery guest starter",
      summary:
        "A strong host anchor when the guest needs one easy Vancouver impression built around scenery, walking room, and less indoor decision fatigue.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a reliable public source for Stanley Park's scenic trails, waterfront views, downtown location, and general public hours.",
      bestFor: ["Scenic intros", "Good-weather hosting", "Walk-led guest plans"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/stanley-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes Stanley Park as Vancouver's first, largest, and most beloved urban park.",
        "The official page highlights scenic trails plus beaches and waterfront views along the Seawall.",
        "The official page says the park is open from 6am to 10pm unless otherwise posted and is located in downtown Vancouver.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed good weather, low crowds, or that every out-of-town guest should begin with Stanley Park.",
        "Access conditions, dining options, and park operations can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-queen-elizabeth-park-guest-start",
      slug: "queen-elizabeth-park-guest-start",
      collection: "vancouver_out_of_town_guest_starters",
      name: "Queen Elizabeth Park",
      category: "Urban park",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "High-view calm starter",
      summary:
        "A good host anchor when the guest needs one elevated Vancouver view, a calmer pace, and a simpler scenic plan than a dense downtown route.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Queen Elizabeth Park's height, downtown access, and broader park features without forcing a fake scenic ranking.",
      bestFor: ["View-first hosting", "Calmer guest plans", "Short scenic detours"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/queen-elizabeth-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Queen Elizabeth Park is Vancouver's horticultural jewel and a major draw for floral display enthusiasts and view-seekers.",
        "The official page says the park is 125 metres above sea level at Vancouver's highest point.",
        "The official page says Queen Elizabeth Park is only 15 minutes by public transit or car from downtown.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed views, perfect weather, or that every out-of-town guest should leave downtown for a hilltop start.",
        "Transit timing, access details, and seasonal conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-bloedel-guest-start",
      slug: "bloedel-conservatory-guest-start",
      collection: "vancouver_out_of_town_guest_starters",
      name: "Bloedel Conservatory",
      category: "Conservatory",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Warm indoor nature starter",
      summary:
        "A strong host anchor when the guest needs one memorable indoor stop with a contained pace instead of a longer multi-stop city route.",
      whyItFits:
        "The official Bloedel page gives CityAtlas a direct public source for the conservatory's tropical environment, summer hours, accessibility support, and near-downtown access without overclaiming what every guest will enjoy.",
      bestFor: ["Rainy hosting days", "Indoor nature lovers", "Contained guest plans"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/bloedel-conservatory.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Bloedel Conservatory is a domed lush paradise in Queen Elizabeth Park with tropical birds, koi fish, and over 500 exotic plants in a temperature-controlled environment.",
        "The official page lists hours of 10am to 7pm from May to September 7, with last entry 15 minutes before closing.",
        "The official page says the main pathway inside the conservatory is fully accessible and that Bloedel is only 15 minutes from downtown by public transit.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming every guest will enjoy an indoor conservatory stop or that Bloedel is always the easiest fit for every group.",
        "Admission rules, event schedules, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-stanley-park-weekend-start",
      slug: "stanley-park-weekend-route-start",
      collection: "vancouver_weekend_route_starters",
      name: "Stanley Park",
      category: "Urban park",
      neighborhood: "Stanley Park",
      routeRole: "Waterfront scenery starter",
      summary:
        "A strong weekend start when the plan needs one big Vancouver view, walking room, and an easy waterfront close instead of a cross-city itinerary.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a reliable public source for Stanley Park's scenic trails, waterfront views, downtown location, and public hours, which makes it a safer weekend anchor than generic must-do language.",
      bestFor: ["Good-weather weekends", "Walk-led starts", "Returning visitors"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/stanley-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes Stanley Park as Vancouver's first, largest, and most beloved urban park.",
        "The official page highlights scenic trails plus beaches and waterfront views along the Seawall.",
        "The official page says the park is open from 6am to 10pm unless otherwise posted and is located in downtown Vancouver.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed good weather, low crowds, or that every Vancouver weekend should begin with Stanley Park.",
        "Access conditions, dining options, and park operations can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-granville-island-weekend-start",
      slug: "granville-island-public-market-weekend-start",
      collection: "vancouver_weekend_route_starters",
      name: "Granville Island Public Market",
      category: "Public market",
      neighborhood: "Granville Island",
      routeRole: "Food-and-browse flex starter",
      summary:
        "A useful weekend start when the day needs easy food choices, flexible timing, and casual browsing instead of a rigid venue sequence.",
      whyItFits:
        "The official market page gives CityAtlas a direct public source for the indoor-market framing, holiday rules, and current summer hours, which makes it a stronger weekend anchor than generic roundup language.",
      bestFor: ["Mixed-interest groups", "Casual half-days", "Food-first weekends"],
      officialSourceLabel: "Official Public Market page",
      officialSourceUrl: "https://granvilleisland.com/public-market",
      sourceOwner: "Granville Island official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes the Granville Island Public Market as an indoor market with food, produce stores and farmers stalls, plus Market Artisans.",
        "The official page says the market is open on statutory holidays except December 25, December 26, and January 1, and closed Mondays in January only for annual maintenance.",
        "The official page lists summer hours from June 4 to September 7 as 9 AM to 6 PM Monday to Wednesday and 9 AM to 7 PM Thursday to Sunday.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming crowd levels, vendor availability, or that Granville Island is the right weekend plan for every budget or group.",
        "Vendor hours, seasonal programming, and transportation details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-english-bay-weekend-start",
      slug: "english-bay-beach-weekend-route-start",
      collection: "vancouver_weekend_route_starters",
      name: "English Bay Beach",
      category: "Beach",
      neighborhood: "West End",
      routeRole: "Downtown beach-and-seawall starter",
      summary:
        "A useful weekend start when the plan needs open water, easy walking, and a downtown beach pause without committing to a longer cross-city route.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for English Bay Beach's downtown location, Seawall connection, and core amenities, which makes it a cleaner waterfront reference than generic skyline hype.",
      bestFor: ["Downtown weekends", "Short waterfront loops", "Easy walking starts"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/english-bay-beach.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says English Bay Beach, also called First Beach, is located along Beach Avenue between Gilford Street and Bidwell Street.",
        "The official page says it is the most populated beach area in Vancouver's downtown area.",
        "The official page says the Stanley Park Seawall runs along the east side of the beach and lists amenities including public washrooms and a Mobi-Mat accessible beach pathway.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming swimming conditions, perfect weather, or that every Vancouver weekend route should center on a downtown beach stop.",
        "Seasonal services, access conditions, and beach rules can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vandusen-weekend-start",
      slug: "vandusen-botanical-garden-weekend-route-start",
      collection: "vancouver_weekend_route_starters",
      name: "VanDusen Botanical Garden",
      category: "Botanical garden",
      neighborhood: "Shaughnessy",
      routeRole: "Garden-walk weekend starter",
      summary:
        "A strong weekend start when the day should feel calmer, greener, and more contained than a busy downtown or waterfront route.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for VanDusen's scale, current seasonal hours, and accessibility support, which makes it a safer garden-led weekend anchor than vague scenic language.",
      bestFor: ["Garden walks", "Calmer weekends", "Lower-noise starts"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/vandusen-botanical-garden.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes VanDusen Botanical Garden as a 55-acre oasis in Vancouver with over 7,500 plant species and varieties from around the world.",
        "The official page lists hours from June to September 7 as 9am to 7pm, with last entry 30 minutes before closing.",
        "The official page says most paved garden paths are fully accessible and notes the garden location at 5251 Oak Street.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming bloom conditions, perfect quiet, or that every weekend group should choose a garden route over a waterfront or market plan.",
        "Admission rules, event schedules, and seasonal garden conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-queen-elizabeth-park-weekend-start",
      slug: "queen-elizabeth-park-weekend-route-start",
      collection: "vancouver_weekend_route_starters",
      name: "Queen Elizabeth Park",
      category: "Urban park",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "High-view weekend starter",
      summary:
        "A good weekend start when the plan wants one elevated Vancouver view, a calmer pace, and a scenic anchor that does not depend on a dense downtown route.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for the park's height, downtown access, and view-led positioning without forcing a fake scenic ranking.",
      bestFor: ["View-first weekends", "Calmer scenic starts", "Short scenic detours"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/queen-elizabeth-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Queen Elizabeth Park is Vancouver's horticultural jewel and a major draw for floral display enthusiasts and view-seekers.",
        "The official page says the park is 125 metres above sea level at Vancouver's highest point.",
        "The official page says Queen Elizabeth Park is only 15 minutes by public transit or car from downtown.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed views, perfect weather, or that every weekend route should leave downtown for a hilltop start.",
        "Transit timing, access details, and seasonal conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-bill-reid-sunday-start",
      slug: "bill-reid-gallery-sunday-start",
      collection: "vancouver_sunday_starters",
      name: "Bill Reid Gallery",
      category: "Gallery",
      neighborhood: "Downtown",
      routeRole: "Compact downtown culture starter",
      summary:
        "A good low-effort Sunday starter when the plan wants one contained downtown culture stop before an easy coffee, walk, or early dinner.",
      whyItFits:
        "The official hours and admissions page gives CityAtlas a direct public source for the gallery's downtown location, daily summer hours, and access-day note without pretending every Sunday plan should begin with the same museum visit.",
      bestFor: ["Downtown Sundays", "Short culture stops", "Low-decision afternoons"],
      officialSourceLabel: "Official hours and admissions page",
      officialSourceUrl: "https://www.billreidgallery.ca/pages/hours-admissions",
      sourceOwner: "Bill Reid Gallery official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page lists the Bill Reid Gallery address at 639 Hornby Street, Vancouver, BC.",
        "The official page says summer hours from May through October are daily from 10 am to 5 pm.",
        "The official page says Community Access Day runs on the first Friday of every month from 2 pm to 5 pm with free entry.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibit fit, ticket availability, or that every low-effort Sunday should begin with a gallery visit.",
        "Hours, admission rules, and program details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-museum-of-vancouver-sunday-start",
      slug: "museum-of-vancouver-sunday-start",
      collection: "vancouver_sunday_starters",
      name: "Museum of Vancouver",
      category: "Museum",
      neighborhood: "False Creek",
      routeRole: "False Creek culture starter",
      summary:
        "A good low-effort Sunday starter when the plan wants one museum anchor near the water without committing to a longer cross-city route.",
      whyItFits:
        "The official museum site gives CityAtlas a public source for the location, visible Sunday hours, and the museum's city-story framing, which supports a slower culture-led Sunday.",
      bestFor: ["Sunday museum stops", "False Creek starts", "Weather-proof afternoons"],
      officialSourceLabel: "Official museum page",
      officialSourceUrl: "https://museumofvancouver.ca/",
      sourceOwner: "Museum of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site lists the Museum of Vancouver address at 1100 Chestnut Street, Vancouver, BC.",
        "The official site shows Sunday public hours of 10 AM to 5 PM.",
        "The official site describes the museum with the line 'Vancouver's Story Begins Here.'",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibit fit, ticket availability, or that every Sunday plan should become a museum day.",
        "Hours, admission rules, and exhibition details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vpl-central-sunday-start",
      slug: "vancouver-public-library-central-sunday-start",
      collection: "vancouver_sunday_starters",
      name: "Vancouver Public Library Central Library",
      category: "Library",
      neighborhood: "Downtown",
      routeRole: "Quiet downtown reset starter",
      summary:
        "A useful low-effort Sunday starter when the plan needs an easy indoor anchor, flexible timing, and a downtown location that does not require a full itinerary.",
      whyItFits:
        "The official branch page gives CityAtlas a public source for the Central Library's downtown location and transit access without pretending a public library solves every Sunday plan.",
      bestFor: ["Quiet Sundays", "Transit-friendly starts", "Low-cost indoor plans"],
      officialSourceLabel: "Official branch page",
      officialSourceUrl: "https://www.vpl.ca/branches/central",
      sourceOwner: "Vancouver Public Library official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official branch page confirms the Central Library address at 350 West Georgia Street, Vancouver BC V6B 6B1.",
        "The official page says Library Square occupies a full city block in downtown Vancouver.",
        "The official page says the branch is a 7 minute walk from both City Centre and Stadium stations.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed silence, seat availability, or that every Sunday plan should become an indoor reading session.",
        "Hours, room availability, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vandusen-sunday-start",
      slug: "vandusen-botanical-garden-sunday-start",
      collection: "vancouver_sunday_starters",
      name: "VanDusen Botanical Garden",
      category: "Botanical garden",
      neighborhood: "Shaughnessy",
      routeRole: "Garden-walk Sunday starter",
      summary:
        "A strong low-effort Sunday starter when the day wants a longer garden walk, greener pacing, and one contained nature-led route.",
      whyItFits:
        "The official City page gives CityAtlas a public source for VanDusen's daily hours, scale, and Oak Street location, which makes it a safer garden-led Sunday anchor than vague peaceful-Vancouver language.",
      bestFor: ["Garden Sundays", "Greener pacing", "Longer quiet walks"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/vandusen-botanical-garden.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes VanDusen Botanical Garden as a 55-acre garden.",
        "The official page lists hours from June to September 7 as 9am to 7pm.",
        "The official page says the garden is located at 5251 Oak Street and is open daily.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming bloom conditions, guaranteed quiet, or that every Sunday plan should choose a garden over a downtown stop.",
        "Admission rules, seasonal conditions, and path access can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-bloedel-sunday-start",
      slug: "bloedel-conservatory-sunday-start",
      collection: "vancouver_sunday_starters",
      name: "Bloedel Conservatory",
      category: "Conservatory",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Warm indoor nature Sunday starter",
      summary:
        "A strong low-effort Sunday starter when the plan needs one contained indoor nature stop with slower pacing and less weather risk.",
      whyItFits:
        "The official Bloedel page gives CityAtlas a direct public source for the conservatory's seasonal hours, hilltop location, and tropical environment without pretending every Sunday plan should become a longer park route.",
      bestFor: ["Indoor Sundays", "Weather-proof calm plans", "Contained nature stops"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/bloedel-conservatory.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page lists Bloedel Conservatory hours from May to September 7 as 10am to 7pm.",
        "The official page says Bloedel Conservatory is located in Queen Elizabeth Park at Vancouver's highest point.",
        "The official page describes a temperature-controlled environment with tropical birds, koi fish, and over 500 exotic plants.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming sensory outcomes, perfect weather backup, or that every Sunday plan should include an indoor conservatory stop.",
        "Admission rules, event schedules, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-commercial-drive-returning-start",
      slug: "commercial-drive-returning-visitor-start",
      collection: "vancouver_returning_visitor_starters",
      name: "Commercial Drive",
      category: "Neighborhood district",
      neighborhood: "Commercial Drive",
      routeRole: "East-side local discovery starter",
      summary:
        "A useful returning-visitor start when the plan wants neighborhood texture, easier browsing, and a less obvious Vancouver feel than a first-trip downtown loop.",
      whyItFits:
        "The official Commercial Drive site gives CityAtlas a direct public source for the district's food, shop, service, Little Italy, and events framing, which makes it a cleaner repeat-visit neighborhood anchor than generic local-favorite hype.",
      bestFor: ["Repeat Vancouver trips", "East-side browsing", "Street-level food-and-shop plans"],
      officialSourceLabel: "Official Commercial Drive site",
      officialSourceUrl: "https://thedrive.ca/",
      sourceOwner: "Commercial Drive Business Society official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site groups Commercial Drive browsing into Eat'n Drink, Shops, Services, Little Italy, and Events.",
        "The official site footer identifies the district site with the Commercial Drive Business Society.",
        "The official contact page includes a BIA catchment-area reference for the Commercial Drive district.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming every returning visitor should choose Commercial Drive or that the area works the same way for every pace, budget, or time of day.",
        "Store hours, event timing, and neighborhood conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-chinatown-storytelling-centre-returning-start",
      slug: "chinatown-storytelling-centre-returning-visitor-start",
      collection: "vancouver_returning_visitor_starters",
      name: "Chinatown Storytelling Centre",
      category: "Cultural centre",
      neighborhood: "Chinatown",
      routeRole: "City-history and community-context starter",
      summary:
        "A strong returning-visitor start when the plan should add more local history and community context before a meal, walk, or second stop.",
      whyItFits:
        "The official site gives CityAtlas a direct public source for the centre's Chinatown community-story mission, daily hours, and address, which makes it a cleaner repeat-visit culture anchor than vague hidden-history copy.",
      bestFor: ["Repeat visits", "Culture-led afternoons", "Chinatown context"],
      officialSourceLabel: "Official centre website",
      officialSourceUrl: "https://www.chinatownstorytellingcentre.org/",
      sourceOwner: "Chinatown Storytelling Centre official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official site says the centre documents and shares Chinese Canadian community stories through Vancouver's Chinatown.",
        "The official site lists the address at 168 East Pender Street, Vancouver, BC.",
        "The official site says it is open daily from 10am to 5pm.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket demand, or that every returning visitor should begin with a museum-style stop.",
        "Hours, exhibition details, and on-site programming can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-trout-lake-returning-start",
      slug: "trout-lake-beach-returning-visitor-start",
      collection: "vancouver_returning_visitor_starters",
      name: "Trout Lake Beach",
      category: "Park and beach",
      neighborhood: "John Hendry Park",
      routeRole: "Neighborhood-reset returning-visitor starter",
      summary:
        "A useful returning-visitor start when the day should feel local, slower, and less performative than another major-attraction circuit.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Trout Lake Beach's freshwater setting, John Hendry Park location, and basic amenities, which supports a lower-pressure neighborhood route.",
      bestFor: ["Repeat local-feeling visits", "Simple outdoor resets", "East-side park plans"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/trout-lake-beach.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Trout Lake Beach is a fresh water beach at the south end of Trout Lake in John Hendry Park at Victoria Dr and East 19th Ave.",
        "The official page lists public washrooms and a picnic area among the beach amenities.",
        "The official page says barbecues are permitted and notes a dog off-leash area.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming ideal swimming conditions, guaranteed calm, or that every repeat Vancouver visit should center on a neighborhood park stop.",
        "Seasonal services, water conditions, and park rules can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-moa-returning-start",
      slug: "museum-of-anthropology-returning-visitor-start",
      collection: "vancouver_returning_visitor_starters",
      name: "Museum of Anthropology at UBC",
      category: "Museum",
      neighborhood: "UBC",
      routeRole: "Campus culture returning-visitor starter",
      summary:
        "A strong returning-visitor start when one museum anchor can carry the afternoon better than another broad downtown checklist.",
      whyItFits:
        "The official MOA visit page gives CityAtlas a direct public source for current hours, location, and visit planning details, which makes it a safer second-look culture anchor than generic must-see language.",
      bestFor: ["Repeat culture visits", "Campus half-days", "Museum-led afternoons"],
      officialSourceLabel: "Official MOA visit page",
      officialSourceUrl: "https://moa.ubc.ca/visit/",
      sourceOwner: "Museum of Anthropology at UBC official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official visit page lists MOA hours from Tuesday to Wednesday and Friday to Sunday as 10 am to 5 pm, with Thursday open from 10 am to 9 pm.",
        "The official page says tickets are available at the door.",
        "The official page lists the museum at 6393 NW Marine Drive, Vancouver.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket demand, or that every returning visitor should leave downtown for a UBC museum stop.",
        "Hours, admission details, and exhibition programming can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-nitobe-returning-start",
      slug: "nitobe-memorial-garden-returning-visitor-start",
      collection: "vancouver_returning_visitor_starters",
      name: "Nitobe Memorial Garden",
      category: "Garden",
      neighborhood: "UBC",
      routeRole: "Calmer campus-culture starter",
      summary:
        "A useful returning-visitor start when the plan wants one quieter cultural pause with slower pacing instead of another higher-traffic city loop.",
      whyItFits:
        "The official Nitobe page gives CityAtlas a direct public source for the garden's cultural framing and seasonal hours, which supports a calmer second-look Vancouver route without fake insider authority.",
      bestFor: ["Quieter repeat visits", "Calmer campus stops", "Garden-led pauses"],
      officialSourceLabel: "Official garden page",
      officialSourceUrl: "https://botanicalgarden.ubc.ca/nitobe-memorial-garden/",
      sourceOwner: "UBC Botanical Garden official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes Nitobe Memorial Garden as one of the most authentic Japanese gardens outside of Japan.",
        "The official page says the garden honours Dr. Inazo Nitobe and represents friendship between Japan and Canada.",
        "The official page lists hours from May 18 to September 7 as daily 10:00am to 4:30pm, with Thursdays until 8:00pm.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming guaranteed quiet, ideal seasonal conditions, or that every repeat Vancouver visit should include a garden stop.",
        "Hours, seasonal access, and on-site conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-published-on-main",
      slug: "published-on-main",
      collection: "vancouver_date_night_starters",
      name: "Published on Main",
      category: "Restaurant",
      neighborhood: "Main Street",
      routeRole: "Premium dinner anchor",
      summary:
        "A strong starting point when the plan needs one reliable dinner anchor on Main Street and the rest of the evening can stay compact.",
      whyItFits:
        "Its official group-booking page gives CityAtlas a concrete public source for the Main Street location and a celebratory dinner use case without forcing a generic 'best of Vancouver' claim.",
      bestFor: ["Celebration dinners", "Main Street plans", "Compact two-stop nights"],
      officialSourceLabel: "Official group bookings page",
      officialSourceUrl: "https://publishedonmain.com/events/",
      sourceOwner: "Published on Main official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official source confirms a Main Street Vancouver address.",
        "The official group-booking page confirms a public inquiry path for group bookings.",
        "The official page describes group dining for parties of 7 to 12 guests.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current table availability, menu fit, or that this is the single best Vancouver date-night choice for every couple.",
        "Awards, rankings, and other reputation language should be confirmed from the official source directly instead of assumed from this summary.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-kissa-tanto",
      slug: "kissa-tanto",
      collection: "vancouver_date_night_starters",
      name: "Kissa Tanto",
      category: "Restaurant",
      neighborhood: "Chinatown",
      routeRole: "Intimate dinner anchor",
      summary:
        "A useful Chinatown starting point when the goal is a smaller, more intimate reservation-based dinner plan.",
      whyItFits:
        "The official site makes the neighborhood, reservation flow, and small-room format clear, which matches CityAtlas's low-pressure route-planning style.",
      bestFor: ["Intimate dinners", "Chinatown routes", "Reservation-first plans"],
      officialSourceLabel: "Official website",
      officialSourceUrl: "https://www.kissatanto.com/",
      sourceOwner: "Kissa Tanto official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official source describes Kissa Tanto as being in Chinatown.",
        "The official source confirms the East Pender Street Vancouver address.",
        "The official source confirms reservations are handled through Tock and describes a small-party dining format.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current seat availability, exact wait times, or that every date-night plan should start here.",
        "Hours and menu details can change and should be reconfirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-labattoir",
      slug: "labattoir",
      collection: "vancouver_date_night_starters",
      name: "L'Abattoir",
      category: "Restaurant and bar",
      neighborhood: "Gastown",
      routeRole: "Gastown dinner or bar anchor",
      summary:
        "A good fit when the night calls for a Gastown anchor that can work for dinner-first plans or a more flexible dinner-and-drinks route.",
      whyItFits:
        "Its official contact and private-dining pages give CityAtlas a source-backed Gastown anchor without relying on scraped descriptions or generic nightlife copy.",
      bestFor: ["Gastown evenings", "Dinner and drinks", "Group-friendly planning"],
      officialSourceLabel: "Official private dining page",
      officialSourceUrl: "https://www.labattoir.ca/private-dining",
      sourceOwner: "L'Abattoir official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "Official pages confirm a Gastown Vancouver address on Carrall Street.",
        "The official site confirms reservations are available and points larger groups toward direct contact or the event inquiry form.",
        "The official private-dining page publishes seated and standing capacities for the private dining room and half-room option.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming nightly availability, exact dining style fit for every couple, or that a public route should mirror private-dining capacity.",
        "Private-event details can change and should be checked on the official source before treating them as current.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-botanist",
      slug: "botanist",
      collection: "vancouver_date_night_starters",
      name: "Botanist",
      category: "Restaurant and cocktail bar",
      neighborhood: "Vancouver",
      routeRole: "Refined dinner or cocktail route",
      summary:
        "Useful when the plan wants a polished Vancouver dinner or cocktail setting instead of a longer cross-city itinerary.",
      whyItFits:
        "The official private-dining page provides a stable public source for space types and capacities, which makes this a safer real-world reference than an unsourced 'top date night' claim.",
      bestFor: ["Polished dinners", "Celebration routes", "Small-group planning"],
      officialSourceLabel: "Official private dining page",
      officialSourceUrl: "https://www.botanistrestaurant.com/private-dining/",
      sourceOwner: "Botanist official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official source confirms a Vancouver private-dining surface with a dedicated enquiry path.",
        "The official page publishes private-space capacities of 14, 16, and 20 guests.",
        "The official page describes separate private settings including the Private Dining Room, The Garden, and the TASCHEN Library.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current menu availability, standard reservation inventory, or that every date or group should choose this over other Vancouver options.",
        "Private-event details should be confirmed on the official source before treating them as current planning facts.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-miku",
      slug: "miku-waterfront",
      collection: "vancouver_date_night_starters",
      name: "Miku Vancouver",
      category: "Restaurant",
      neighborhood: "Waterfront",
      routeRole: "Waterfront dinner anchor",
      summary:
        "A helpful starting point when the plan wants a waterfront dinner anchor with a clear official reservation path and minimal route confusion.",
      whyItFits:
        "The official contact page gives CityAtlas a clean source for the Granville Square location and reservation flow, which supports a straightforward waterfront route.",
      bestFor: ["Waterfront evenings", "Reservation-first dinners", "Visitor-friendly plans"],
      officialSourceLabel: "Official contact page",
      officialSourceUrl: "https://mikurestaurant.com/contact/",
      sourceOwner: "Miku Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official contact page confirms the Granville Square address on Granville Street.",
        "The official source confirms reservations are handled through OpenTable.",
        "The official source provides a direct public inquiry email for questions.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current table availability, exact wait times, or that this is the right waterfront choice for every visitor or local.",
        "Hours and reservation timing guidance can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vancouver-art-gallery-first-evening",
      slug: "vancouver-art-gallery-first-evening",
      collection: "vancouver_first_evening_starters",
      name: "Vancouver Art Gallery",
      category: "Art gallery",
      neighborhood: "Downtown",
      routeRole: "Downtown culture anchor",
      summary:
        "A strong first-evening starting point when the plan needs one central cultural anchor before dinner, a short walk, or an easy downtown close.",
      whyItFits:
        "The official visit page gives CityAtlas a direct source for the downtown location, current hours, and first-Friday free-entry window without forcing a fake 'must-see Vancouver' claim.",
      bestFor: ["Downtown starts", "Culture-first evenings", "Visitors staying central"],
      officialSourceLabel: "Official visit page",
      officialSourceUrl: "https://www.vanartgallery.bc.ca/visit/",
      sourceOwner: "Vancouver Art Gallery official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official visit page confirms the address at 750 Hornby Street, Vancouver, BC V6Z 2H7.",
        "The official visit page lists current hours of 10 AM to 5 PM Monday through Thursday, Saturday, and Sunday, with Friday open until 8 PM.",
        "The official visit page says the gallery is open seven days a week from May 19 to September 8, 2026.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that every first-evening visitor should start here.",
        "Hours, pricing, and special-program details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-granville-island-first-evening",
      slug: "granville-island-public-market-first-evening",
      collection: "vancouver_first_evening_starters",
      name: "Granville Island Public Market",
      category: "Public market",
      neighborhood: "Granville Island",
      routeRole: "Food-and-browse starter",
      summary:
        "A useful first-evening anchor when the plan wants easy food options, indoor browsing, and a recognizable Vancouver setting without locking into a formal itinerary.",
      whyItFits:
        "The official market page gives CityAtlas a direct public source for the indoor-market framing, summer hours, and planning cues that help a visitor choose a low-pressure first stop.",
      bestFor: ["Casual arrivals", "Food-first starts", "Visitors who want variety"],
      officialSourceLabel: "Official Public Market page",
      officialSourceUrl: "https://granvilleisland.com/public-market",
      sourceOwner: "Granville Island official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes the Granville Island Public Market as an indoor market.",
        "The official page lists summer hours of 9 AM to 6 PM Monday to Wednesday and 9 AM to 7 PM Thursday to Sunday from June 4 to September 7.",
        "The official page says the market is open on statutory holidays except December 25, December 26, and January 1.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming crowd levels, vendor mix, or that this is the right first-evening stop for every traveler or local host.",
        "Individual vendor hours, seasonal activity, and transit fit can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-stanley-park",
      slug: "stanley-park-first-evening",
      collection: "vancouver_first_evening_starters",
      name: "Stanley Park",
      category: "Urban park",
      neighborhood: "Stanley Park",
      routeRole: "Waterfront walk and view anchor",
      summary:
        "A strong first-evening anchor when the plan needs one easy waterfront walk, a big sense of place, and a finish that does not require many decisions.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct public source for Stanley Park's hours, downtown location, and waterfront/seawall character without pretending it fits every visitor the same way.",
      bestFor: ["Waterfront intros", "Jet-lag-friendly walks", "Scenic first nights"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/stanley-park.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page describes Stanley Park as Vancouver's first, largest, and most beloved urban park.",
        "The official page says the park has scenic trails plus beaches and waterfront views along the Seawall.",
        "The official page says the park is open from 6 AM to 10 PM unless otherwise posted.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming weather conditions, crowd levels, or that every first-evening plan should include a full Stanley Park loop.",
        "Specific trail, beach, and dining conditions can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-dr-sun-yat-sen-garden",
      slug: "dr-sun-yat-sen-chinese-garden",
      collection: "vancouver_first_evening_starters",
      name: "Dr. Sun Yat-Sen Classical Chinese Garden",
      category: "Classical garden",
      neighborhood: "Chinatown",
      routeRole: "Chinatown culture starter",
      summary:
        "A good first-evening starting point when the plan wants Chinatown character, a calmer cultural stop, and an easy transition into dinner or a short walk.",
      whyItFits:
        "The official City of Vancouver page makes the Chinatown location, free adjacent park, and visitor-information handoff clear, which is safer than making vague neighborhood-history claims.",
      bestFor: ["Chinatown starts", "Culture-first routes", "Calmer first nights"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl:
        "https://vancouver.ca/parks-recreation-culture/dr-sun-yat-sen-chinese-garden.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says the garden and adjacent park are right in the heart of Vancouver's Chinatown.",
        "The official page says entry is free to Sun Yat-Sen Park, while the Dr. Sun Yat-Sen Classical Chinese Garden requires admission.",
        "The official page lists the address at 578 Carrall Street, Vancouver, BC V6B 5K2.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current admission pricing, event programming, or that every visitor should choose Chinatown for a first evening.",
        "Hours, access rules, and current exhibits or programming should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-bloedel-first-evening",
      slug: "bloedel-conservatory-first-evening",
      collection: "vancouver_first_evening_starters",
      name: "Bloedel Conservatory",
      category: "Conservatory",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Hilltop calm-view reset",
      summary:
        "A useful first-evening option when the plan wants a quieter reset, indoor greenery, and one scenic Vancouver anchor before calling the night simple.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a direct source for the Queen Elizabeth Park setting, summer hours, and quick transit framing, making it a safer visitor reference than a generic listicle.",
      bestFor: ["Calmer arrivals", "Nature-first intros", "Short scenic detours"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/bloedel-conservatory.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official page says Bloedel Conservatory is located in Queen Elizabeth Park atop Vancouver's highest point.",
        "The official page lists hours of 10 AM to 7 PM from May to September 7, with last entry 15 minutes before closing.",
        "The official page says Bloedel Conservatory is only 15 minutes from Downtown by public transit.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current ticket availability, exact evening views, or that every visitor should leave downtown for a first-evening plan.",
        "Hours, transit fit, and seasonal programming can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-granville-public-market",
      slug: "granville-island-public-market",
      collection: "vancouver_rainy_day_starters",
      name: "Granville Island Public Market",
      category: "Public market",
      neighborhood: "Granville Island",
      routeRole: "Indoor browse and coffee anchor",
      summary:
        "A useful rainy-day starting point when the plan needs a warm indoor browse window with easy coffee options and enough variety to keep the outing flexible.",
      whyItFits:
        "The official Granville Island page gives CityAtlas a clean public source for indoor-market framing, holiday exceptions, and summer hours without forcing a generic 'top rainy-day attraction' claim.",
      bestFor: ["Grey-weather browsing", "Visitor resets", "Low-pressure half days"],
      officialSourceLabel: "Official Public Market page",
      officialSourceUrl: "https://granvilleisland.com/public-market",
      sourceOwner: "Granville Island official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official source describes the Public Market as an indoor market.",
        "The official page says the market is open on statutory holidays except December 25, December 26, and January 1.",
        "The official page lists summer hours of 9 AM to 6 PM Monday to Wednesday and 9 AM to 7 PM Thursday to Sunday from June 4 to September 7.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming crowd levels, product availability, or that this is the right rainy-day stop for every local or visitor.",
        "Vendor mix, coffee options, and seasonal hours can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vancouver-art-gallery-rainy-day",
      slug: "vancouver-art-gallery",
      collection: "vancouver_rainy_day_starters",
      name: "Vancouver Art Gallery",
      category: "Art gallery",
      neighborhood: "Downtown",
      routeRole: "Indoor cultural anchor",
      summary:
        "A good downtown rainy-day anchor when the plan needs one indoor cultural stop that can carry most of the outing without extra transit friction.",
      whyItFits:
        "The official visit page gives CityAtlas a direct public source for location and daily hours, which is safer than relying on third-party listicles for a weather-day recommendation.",
      bestFor: ["Downtown rainy days", "Visitors", "One-stop cultural plans"],
      officialSourceLabel: "Official visit page",
      officialSourceUrl: "https://www.vanartgallery.bc.ca/visit/",
      sourceOwner: "Vancouver Art Gallery official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official visit page confirms the gallery address at 750 Hornby Street, Vancouver, BC V6Z 2H7.",
        "The official visit page lists gallery hours of 10 AM to 5 PM Monday through Thursday, Saturday, and Sunday, with Friday open until 8 PM.",
        "The official visit page says the gallery is open seven days a week from May 19 to September 8, 2026.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibition fit, ticket availability, or that this is the single best rainy-day stop for every traveler or local.",
        "Exhibitions, admission offers, and hours can change and should be checked on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-bloedel-conservatory",
      slug: "bloedel-conservatory",
      collection: "vancouver_rainy_day_starters",
      name: "Bloedel Conservatory",
      category: "Conservatory",
      neighborhood: "Queen Elizabeth Park",
      routeRole: "Warm indoor reset",
      summary:
        "A strong rainy-day anchor when the plan needs a warm plant-filled reset instead of another cafe or shopping stop.",
      whyItFits:
        "The official City of Vancouver page gives CityAtlas a reliable public source for the indoor climate, Queen Elizabeth Park location, and seasonal hours, which makes this a safer rainy-day reference.",
      bestFor: ["Calm resets", "Grey-weather mood lift", "Queen Elizabeth Park plans"],
      officialSourceLabel: "Official City of Vancouver page",
      officialSourceUrl: "https://vancouver.ca/parks-recreation-culture/bloedel-conservatory.aspx",
      sourceOwner: "City of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official source says Bloedel Conservatory is located in Queen Elizabeth Park atop Vancouver's highest point.",
        "The official page describes a temperature-controlled environment with tropical birds, koi fish, and more than 500 exotic plants.",
        "The official page lists hours of 10 AM to 7 PM from May to September 7, with last entry 15 minutes before closing.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming exact current bird, exhibit, or event conditions beyond the official page summary.",
        "Hours, ticketing, and access details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-museum-of-vancouver",
      slug: "museum-of-vancouver",
      collection: "vancouver_rainy_day_starters",
      name: "Museum of Vancouver",
      category: "Museum",
      neighborhood: "Vanier Park",
      routeRole: "City-history indoor anchor",
      summary:
        "A useful rainy-day choice when the plan wants one indoor city-history stop with a clear schedule and a calmer pace than a multi-stop itinerary.",
      whyItFits:
        "The official Museum of Vancouver hours page gives CityAtlas a stable public source for location, weekly schedule, and low-sensory Sunday details without overstating the experience.",
      bestFor: ["City-history afternoons", "Low-sensory planning", "Vanier Park visits"],
      officialSourceLabel: "Official hours and admission page",
      officialSourceUrl: "https://museumofvancouver.ca/museum-hours-and-admission",
      sourceOwner: "Museum of Vancouver official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official hours page confirms the museum address at 1100 Chestnut Street, Vancouver, BC V6J 3J9.",
        "The official page lists hours of 10 AM to 5 PM Monday to Wednesday and Sunday, and 10 AM to 8 PM Thursday to Saturday.",
        "The official page says Low Sensory Sundays happen on the last Sunday of each month.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming current exhibit fit, ticket availability, or that this is the right rainy-day stop for every visitor or family.",
        "Programs, pricing, and low-sensory details can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
    {
      id: "source-place-vpl-central-library",
      slug: "vancouver-public-library-central",
      collection: "vancouver_rainy_day_starters",
      name: "Vancouver Public Library Central Library",
      category: "Public library",
      neighborhood: "Downtown",
      routeRole: "Quiet indoor reset or reading break",
      summary:
        "A strong low-cost downtown rainy-day fallback when the plan needs a calm indoor stop, reading break, or short work-and-reset window.",
      whyItFits:
        "The official branch page gives CityAtlas a public source for the downtown location, transit access, and indoor features that support a quieter rainy-day route.",
      bestFor: ["Quiet resets", "Downtown fallback plans", "Short work blocks"],
      officialSourceLabel: "Official Central Library branch page",
      officialSourceUrl: "https://www.vpl.ca/branches/central",
      sourceOwner: "Vancouver Public Library official website",
      sourceCheckedAt: "2026-06-14",
      reviewStatus: "official_source_checked",
      verifiedFacts: [
        "The official branch page says the Central Library is located in Library Square and occupies a full city block bounded by Homer, Hamilton, Robson, and Georgia Streets.",
        "The official page confirms the address at 350 West Georgia Street, Vancouver BC V6B 6B1.",
        "The official page lists public features including Wi-Fi access, the Pat Graham Reading Room, and the Central Library Inspiration Lab.",
      ],
      claimBoundaries: [
        "CityAtlas is not claiming seat availability, noise level, or that this is the right rainy-day choice for every visitor, student, or remote worker.",
        "Facility access details, available spaces, and branch operations can change and should be confirmed on the official source before relying on them.",
      ],
      correctionPath: "/editorial-standards",
      featured: true,
    },
  ],
  cityRolloutTargets: [],
  cityMissions: [
    {
      ...demoAudit,
      id: "mission-date-night",
      title: "Two-Hour Date Night Loop",
      slug: "two-hour-date-night-loop",
      theme: "Date night",
      audience: "Couples and visitors who want one compact evening with a real second stop",
      timeBox: "2.5 hours",
      startWindow: "Best after 6:00 PM",
      startOptions: ["6:00 PM", "6:30 PM", "7:00 PM"],
      defaultTravelMode: "walk",
      hook: "A lower-pressure Granville Island evening that starts with snacks and browsing before one real dinner anchor and a shorter waterfront finish.",
      routeSummary:
        "Open the date-night guide before leaving, start at Granville Island Public Market for snacks and browsing, then keep one dinner anchor and one shorter waterfront finish close behind it.",
      steps: [
        {
          label: "Read the date-night guide",
          itemType: "guide",
          itemId: "guide-date-night",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Sets the context and gives the route a reason to exist.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Head to Granville Island Market",
          itemType: "source_backed_place",
          itemId: "source-place-granville-island-first-evening",
          time: "70 min",
          neighborhood: "Granville Island",
          note: "Head to the covered market by the water. Snacks first, then browse.",
          durationMinutes: 70,
          bestAt: "Best from late afternoon into early evening",
        },
        {
          label: "Keep Miku Vancouver as dinner",
          itemType: "business",
          itemId: "biz-seaside-cycle",
          time: "85 min",
          neighborhood: "Waterfront",
          note: "Use one dinner anchor after the market so the plan still feels easy instead of scattered.",
          durationMinutes: 85,
          bestAt: "Best for an early dinner or sunset reservation",
          travelMinutesByMode: {
            walk: 28,
            transit: 18,
            drive: 12,
            bike: 16,
          },
        },
        {
          label: "Finish with an English Bay wind-down",
          itemType: "source_backed_place",
          itemId: "source-place-english-bay-weekend-start",
          time: "35 min",
          neighborhood: "English Bay",
          note: "End with one simple waterfront walk if the night still wants a lighter close.",
          durationMinutes: 35,
          bestAt: "Best when the weather still makes a short walk feel easy",
          travelMinutesByMode: {
            walk: 24,
            transit: 18,
            drive: 11,
            bike: 16,
          },
        },
      ],
      idealFor: [
        "Date nights that start lighter",
        "Visitor evenings that stay easy",
        "Granville Island to waterfront plans",
      ],
      reward: "Create a shareable date-night plan that starts easy before it asks for dinner.",
      sharePrompt:
        "I found a CityAtlas date-night route that starts at Granville Island and stays compact after that. Want it?",
      sponsorAngle:
        "Great fit for restaurants, market-adjacent partners, waterfront stops, and creator-hosted date-night campaigns.",
      featured: true,
    },
    {
      ...demoAudit,
      id: "mission-rainy-day-reset",
      title: "Rainy-Day Reset",
      slug: "rainy-day-reset",
      theme: "Rainy day",
      audience: "Locals or visitors who want a believable indoor plan without decision fatigue",
      timeBox: "2 hours",
      startWindow: "Best from late morning through early evening",
      startOptions: ["11:00 AM", "1:00 PM", "3:30 PM"],
      defaultTravelMode: "walk",
      hook: "A downtown rainy-day plan with one calm indoor reset and one cultural stop close enough to feel easy.",
      routeSummary:
        "Open the rainy-day guide before leaving, use the Central Library for a quiet reset, then keep the Vancouver Art Gallery as the fuller indoor anchor.",
      steps: [
        {
          label: "Open the rainy-day guide",
          itemType: "guide",
          itemId: "guide-rainy-day",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Starts with the lower-friction route logic first.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Reset at the Central Library",
          itemType: "source_backed_place",
          itemId: "source-place-vpl-central-library",
          time: "45 min",
          neighborhood: "Downtown",
          note: "Use this as the lower-cost breathing-room stop before deciding whether the day wants more.",
          durationMinutes: 45,
          bestAt: "Best in the late morning or mid-afternoon",
        },
        {
          label: "Keep the Vancouver Art Gallery as the anchor",
          itemType: "source_backed_place",
          itemId: "source-place-vancouver-art-gallery-rainy-day",
          time: "75 min",
          neighborhood: "Downtown",
          note: "Let one indoor cultural stop carry the rest of the outing instead of rebuilding the route from scratch.",
          durationMinutes: 75,
          bestAt: "Best after the reset window",
          travelMinutesByMode: {
            walk: 12,
            transit: 8,
            drive: 6,
            bike: 7,
          },
        },
      ],
      idealFor: [
        "Grey-weather downtown days",
        "Low-energy visitors",
        "One-neighborhood indoor plans",
      ],
      reward: "Keep a believable rainy-day fallback you can reuse without starting over.",
      sharePrompt:
        "I saved a CityAtlas rainy-day Vancouver route with a quiet reset and one indoor cultural stop for later.",
      sponsorAngle:
        "Good for downtown indoor partners, cultural venues, and calmer weather-day campaigns once wider coverage is ready.",
      featured: true,
    },
    {
      ...demoAudit,
      id: "mission-weekend-waterfront",
      title: "Weekend Waterfront Loop",
      slug: "weekend-waterfront-loop",
      theme: "Outdoors",
      audience: "Visitors, hosts, and locals planning a social weekend route",
      timeBox: "3 hours",
      startWindow: "Best from late morning into an early dinner",
      startOptions: ["11:30 AM", "1:00 PM", "4:30 PM"],
      defaultTravelMode: "transit",
      hook: "A weekend route that starts with browsing and finishes with one reservation-friendly waterfront anchor.",
      routeSummary:
        "Use the first-evening guide for orientation, browse Granville Island Public Market, then finish at Miku for the clean waterfront close.",
      steps: [
        {
          label: "Open the first-evening guide",
          itemType: "guide",
          itemId: "guide-visitor-loop",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the rest of the route stays compact instead of sprawling.",
          durationMinutes: 5,
          bestAt: "Open before heading out",
        },
        {
          label: "Browse Granville Island Public Market",
          itemType: "source_backed_place",
          itemId: "source-place-granville-island-first-evening",
          time: "70 min",
          neighborhood: "Granville Island",
          note: "Let the market be the easy browse-and-snack start before the route commits to dinner.",
          durationMinutes: 70,
          bestAt: "Best from late morning through mid-afternoon",
        },
        {
          label: "Finish at Miku Vancouver",
          itemType: "business",
          itemId: "biz-seaside-cycle",
          time: "90 min",
          neighborhood: "Waterfront",
          note: "Close with one waterfront dinner anchor instead of adding another neighborhood decision.",
          durationMinutes: 90,
          bestAt: "Best for an early dinner or sunset reservation",
          travelMinutesByMode: {
            walk: 28,
            transit: 18,
            drive: 12,
            bike: 16,
          },
        },
      ],
      idealFor: [
        "Weekend guests",
        "Waterfront food-first plans",
        "Hosts who want an easy close",
      ],
      reward: "Generate a waterfront plan that feels shareable before it feels overbuilt.",
      sharePrompt:
        "I saved a CityAtlas weekend waterfront route with Granville Island and Miku. Want in?",
      sponsorAngle:
        "Strong fit for waterfront restaurants, market-adjacent partners, visitor packages, and host-friendly local campaigns.",
      featured: true,
    },
    {
      ...demoAudit,
      id: "mission-wellness-reset-hour",
      title: "Wellness Reset Hour",
      slug: "wellness-reset-hour",
      theme: "Wellness",
      audience: "Locals, visitors, and workers who want one calmer Vancouver reset without stretching the day",
      timeBox: "2 hours",
      startWindow: "Best from late morning through early evening",
      startOptions: ["11:00 AM", "1:00 PM", "4:00 PM"],
      defaultTravelMode: "walk",
      hook: "A quieter Queen Elizabeth Park reset that starts with the guide and keeps the next step close.",
      routeSummary:
        "Open the wellness guide first, use Queen Elizabeth Park for the outdoor reset, then keep Bloedel Conservatory as the contained follow-up when you still want one more gentle stop.",
      steps: [
        {
          label: "Open the wellness reset guide",
          itemType: "guide",
          itemId: "guide-wellness",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the reset stays believable instead of turning into a long wandering day.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Reset at Queen Elizabeth Park",
          itemType: "source_backed_place",
          itemId: "source-place-queen-elizabeth-reset",
          time: "45 min",
          neighborhood: "Queen Elizabeth Park",
          note: "Let one slower outdoor anchor do most of the work before deciding whether you still want a second stop.",
          durationMinutes: 45,
          bestAt: "Best in daylight or a quieter afternoon",
        },
        {
          label: "Keep Bloedel Conservatory as the gentle follow-up",
          itemType: "source_backed_place",
          itemId: "source-place-bloedel-reset",
          time: "45 min",
          neighborhood: "Queen Elizabeth Park",
          note: "Stay close and contained instead of rebuilding the route in another part of the city.",
          durationMinutes: 45,
          bestAt: "Best right after the park reset",
          travelMinutesByMode: {
            walk: 12,
            transit: 8,
            drive: 6,
            bike: 5,
          },
        },
      ],
      idealFor: [
        "Calmer recovery windows",
        "Shorter wellness outings",
        "Locals who want one gentler reset",
      ],
      reward: "Keep one believable reset route you can reuse when the day needs to stay softer.",
      sharePrompt:
        "I saved a CityAtlas wellness reset route that stays gentle and close together. Want me to send it?",
      sponsorAngle:
        "Useful for wellness partners, tea, lighter food, recovery services, and calmer routine-building sponsorships later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-hosting-guests-loop",
      title: "Hosting Guests Loop",
      slug: "hosting-guests-loop",
      theme: "Hosting",
      audience: "Hosts who want one easy Vancouver plan for a friend or family member",
      timeBox: "2.5 hours",
      startWindow: "Best from late morning through early evening",
      startOptions: ["11:30 AM", "1:30 PM", "4:00 PM"],
      defaultTravelMode: "transit",
      hook: "A low-pressure guest route with one public anchor and one flexible second stop.",
      routeSummary:
        "Open the out-of-town guest guide first, start at Granville Island, then keep the Vancouver Art Gallery as the easy second anchor if the day still wants more structure.",
      steps: [
        {
          label: "Open the guest-hosting guide",
          itemType: "guide",
          itemId: "guide-out-of-town-guest-host",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the day fits the guest's energy before you commit to the route.",
          durationMinutes: 5,
          bestAt: "Open before heading out",
        },
        {
          label: "Start at Granville Island",
          itemType: "source_backed_place",
          itemId: "source-place-granville-island-guest-start",
          time: "70 min",
          neighborhood: "Granville Island",
          note: "Let the market and public-space energy create the first Vancouver feeling without overloading the guest.",
          durationMinutes: 70,
          bestAt: "Best from late morning through mid-afternoon",
        },
        {
          label: "Keep the Vancouver Art Gallery as the second anchor",
          itemType: "source_backed_place",
          itemId: "source-place-vancouver-art-gallery-guest-start",
          time: "60 min",
          neighborhood: "Downtown",
          note: "Use one downtown cultural stop when the guest still wants a clearer follow-up, not another long city jump.",
          durationMinutes: 60,
          bestAt: "Best when the group still has energy for one more stop",
          travelMinutesByMode: {
            walk: 28,
            transit: 18,
            drive: 12,
            bike: 16,
          },
        },
      ],
      idealFor: [
        "Out-of-town guests",
        "Weekend hosts",
        "Low-pressure city intros",
      ],
      reward: "Keep one guest-friendly route that feels generous without turning into an all-day marathon.",
      sharePrompt:
        "I saved a CityAtlas guest-hosting route with Granville Island and one downtown follow-up. Want to use it this weekend?",
      sponsorAngle:
        "Good fit for guest-friendly dining, attractions, transport, and simple host-ready partner placements later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-kitsilano-scenic-loop",
      title: "Kitsilano Scenic Loop",
      slug: "kitsilano-scenic-loop",
      theme: "Scenic",
      audience: "Locals, visitors, and hosts who want one lighter west-side route",
      timeBox: "2.25 hours",
      startWindow: "Best from late morning through sunset",
      startOptions: ["11:00 AM", "2:00 PM", "5:00 PM"],
      defaultTravelMode: "bike",
      hook: "A west-side scenic route that stays near the water instead of crossing the city.",
      routeSummary:
        "Open the Kitsilano guide first, start at Kits Beach, then keep the Maritime Museum as the calmer second stop before the route asks for anything bigger.",
      steps: [
        {
          label: "Open the Kitsilano scenic guide",
          itemType: "guide",
          itemId: "guide-kitsilano-scenic-starter",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the plan stays about one west-side feeling, not a bigger city checklist.",
          durationMinutes: 5,
          bestAt: "Open before heading west",
        },
        {
          label: "Start at Kits Beach",
          itemType: "source_backed_place",
          itemId: "source-place-kits-beach-scenic-start",
          time: "60 min",
          neighborhood: "Kitsilano",
          note: "Let the waterfront and daylight do most of the work before you add anything else.",
          durationMinutes: 60,
          bestAt: "Best in daylight or close to golden hour",
        },
        {
          label: "Keep the Maritime Museum as the second stop",
          itemType: "source_backed_place",
          itemId: "source-place-maritime-museum-scenic-start",
          time: "55 min",
          neighborhood: "Kitsilano",
          note: "Use one nearby follow-up so the route still feels scenic and low-friction instead of sprawling.",
          durationMinutes: 55,
          bestAt: "Best once the beach loop already feels complete",
          travelMinutesByMode: {
            walk: 18,
            transit: 9,
            drive: 7,
            bike: 6,
          },
        },
      ],
      idealFor: [
        "West-side scenic starts",
        "Hosts who want a lighter route",
        "Good-weather Vancouver plans",
      ],
      reward: "Keep one scenic west-side route that stays easy to repeat and easy to share.",
      sharePrompt:
        "I saved a CityAtlas Kitsilano route with one scenic start and one calmer second stop. Want the link?",
      sponsorAngle:
        "Strong fit for waterfront partners, daytime food, local activities, and neighborhood sponsorships later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-low-effort-sunday",
      title: "Low-Effort Sunday Plan",
      slug: "low-effort-sunday-plan",
      theme: "Sunday",
      audience: "Locals or weekend visitors who want one gentler downtown plan",
      timeBox: "2 hours",
      startWindow: "Best from late morning through mid-afternoon",
      startOptions: ["10:30 AM", "12:30 PM", "2:30 PM"],
      defaultTravelMode: "walk",
      hook: "A low-effort Sunday route that stays central and leaves room to stop early.",
      routeSummary:
        "Open the Sunday guide first, use the Central Library as the easy first anchor, then keep the Bill Reid Gallery as the smaller cultural follow-up if the day still has energy.",
      steps: [
        {
          label: "Open the Sunday planning guide",
          itemType: "guide",
          itemId: "guide-low-effort-vancouver-sunday-plan",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the day matches your actual energy instead of inheriting Saturday ambition.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Start at the Central Library",
          itemType: "source_backed_place",
          itemId: "source-place-vpl-central-sunday-start",
          time: "45 min",
          neighborhood: "Downtown",
          note: "Let one easy downtown anchor set the pace before you add more structure to the day.",
          durationMinutes: 45,
          bestAt: "Best when Sunday needs a simpler start",
        },
        {
          label: "Keep the Bill Reid Gallery as the follow-up",
          itemType: "source_backed_place",
          itemId: "source-place-bill-reid-sunday-start",
          time: "60 min",
          neighborhood: "Downtown",
          note: "Use one smaller cultural stop if the day still wants more, then let the route end cleanly.",
          durationMinutes: 60,
          bestAt: "Best when the first stop still leaves room for one more calm move",
          travelMinutesByMode: {
            walk: 11,
            transit: 7,
            drive: 5,
            bike: 6,
          },
        },
      ],
      idealFor: [
        "Recovery-day planning",
        "Low-effort Sundays",
        "Visitors who do not want a crowded plan",
      ],
      reward: "Keep one gentler Sunday route you can reuse when the day should stay easy.",
      sharePrompt:
        "I saved a CityAtlas Sunday route that keeps things easy and central. Want me to send it over?",
      sponsorAngle:
        "Good fit for calmer weekend partners, coffee, culture, and Sunday-first neighborhood campaigns later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-focus-block-flex",
      title: "Focus Block Flex Route",
      slug: "focus-block-flex-route",
      theme: "Focus block",
      audience:
        "Remote workers, students, and locals who want one believable work session with a lighter coffee-adjacent follow-up",
      timeBox: "2.25 hours",
      startWindow: "Best from late morning through mid-afternoon",
      startOptions: ["10:30 AM", "12:00 PM", "2:30 PM"],
      defaultTravelMode: "transit",
      hook: "A shorter city work block that starts with public focus space and ends with one easier change of scene.",
      routeSummary:
        "Open the work-friendly cafe guide first, use the Central Library for the focused block, then shift to Granville Island Public Market for a lighter coffee-and-browse follow-up once the work is done.",
      steps: [
        {
          label: "Open the work-friendly cafe guide",
          itemType: "guide",
          itemId: "guide-cafe",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the session matches your energy and timebox before you leave.",
          durationMinutes: 5,
          bestAt: "Open before you head out",
        },
        {
          label: "Start with a focus block at the Central Library",
          itemType: "source_backed_place",
          itemId: "source-place-vpl-central-library",
          time: "60 min",
          neighborhood: "Downtown",
          note: "Let one public work-friendly stop carry the focus session before you decide whether the day wants a second move.",
          durationMinutes: 60,
          bestAt: "Best when you want a lower-pressure first hour",
        },
        {
          label: "Shift to Granville Island Public Market for the lighter follow-up",
          itemType: "source_backed_place",
          itemId: "source-place-granville-public-market",
          time: "55 min",
          neighborhood: "Granville Island",
          note: "Use one coffee-and-browse follow-up when the session needs a change of scene instead of another long work block.",
          durationMinutes: 55,
          bestAt: "Best once the focused part of the session already feels complete",
          travelMinutesByMode: {
            walk: 34,
            transit: 19,
            drive: 11,
            bike: 16,
          },
        },
      ],
      idealFor: [
        "Laptop-friendly planning blocks",
        "Grey-weather focus sessions",
        "One work block plus one easier reset",
      ],
      reward: "Keep one believable focus-and-reset route you can reuse without reopening every guide.",
      sharePrompt:
        "I saved a CityAtlas focus-block route with a work-friendly first stop and an easier follow-up. Want the link?",
      sponsorAngle:
        "Useful later for cafes, coworking, quieter indoor partners, and weekday planning campaigns once broader sourcing is ready.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-low-pressure-first-date-loop",
      title: "Low-Pressure First-Date Loop",
      slug: "low-pressure-first-date-loop",
      theme: "First date",
      audience: "People who want one easier Vancouver first-date route with low stakes and short transitions",
      timeBox: "2.25 hours",
      startWindow: "Best from late afternoon through sunset",
      startOptions: ["4:30 PM", "5:30 PM", "6:30 PM"],
      defaultTravelMode: "walk",
      hook: "A lower-pressure Kitsilano route with breathing room first and one lighter follow-through nearby.",
      routeSummary:
        "Open the first-date guide first, start at Kitsilano Beach for an easier first move, then keep the Vancouver Maritime Museum as the calmer second stop if the date still wants one more step.",
      steps: [
        {
          label: "Open the first-date guide",
          itemType: "guide",
          itemId: "guide-low-pressure-first-date",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the route stays about easier pacing and fewer forced decisions.",
          durationMinutes: 5,
          bestAt: "Open before you head out",
        },
        {
          label: "Start at Kitsilano Beach",
          itemType: "source_backed_place",
          itemId: "source-place-kits-beach-scenic-start",
          time: "55 min",
          neighborhood: "Kitsilano",
          note: "Let one open-air first stop carry the early conversation instead of forcing a high-stakes anchor too soon.",
          durationMinutes: 55,
          bestAt: "Best when daylight or an early-evening walk can keep the tone easy",
        },
        {
          label: "Keep the Maritime Museum as the follow-through",
          itemType: "source_backed_place",
          itemId: "source-place-maritime-museum-scenic-start",
          time: "50 min",
          neighborhood: "Vanier Park",
          note: "Use one nearby second stop if the date still wants more shape without turning the night into a longer city jump.",
          durationMinutes: 50,
          bestAt: "Best once the beach start already feels comfortable",
          travelMinutesByMode: {
            walk: 18,
            transit: 9,
            drive: 7,
            bike: 6,
          },
        },
      ],
      idealFor: [
        "Lower-pressure first dates",
        "Scenic starts without too much structure",
        "Shorter west-side evening plans",
      ],
      reward: "Keep one first-date route that feels easy to suggest and easy to adjust.",
      sharePrompt:
        "I saved a CityAtlas first-date route that stays easy and west-side. Want the map?",
      sponsorAngle:
        "Useful for west-side dining, low-pressure activity, and early-date partner angles later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-two-stop-night-loop",
      title: "Two-Stop Night Loop",
      slug: "two-stop-night-loop",
      theme: "Compact night",
      audience: "Locals and visitors who want one dinner-led Vancouver night with a real second stop nearby",
      timeBox: "2.5 hours",
      startWindow: "Best after 6:00 PM",
      startOptions: ["6:00 PM", "6:30 PM", "7:00 PM"],
      defaultTravelMode: "walk",
      hook: "A compact Chinatown-to-Gastown night when one dinner anchor and one lighter follow-through are enough.",
      routeSummary:
        "Open the two-stop night guide first, settle into Kissa Tanto for dinner, then keep L'Abattoir as the nearby second stop instead of jumping to another neighborhood.",
      steps: [
        {
          label: "Open the two-stop night guide",
          itemType: "guide",
          itemId: "guide-two-stop-night",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the night stays about one compact route instead of a bigger wish list.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Start with dinner at Kissa Tanto",
          itemType: "business",
          itemId: "biz-rainline-coffee",
          time: "85 min",
          neighborhood: "Chinatown",
          note: "Let one stronger first stop carry the commitment so the second move can stay lighter.",
          durationMinutes: 85,
          bestAt: "Best when the night wants a clear dinner-led anchor",
        },
        {
          label: "Keep L'Abattoir as the second stop",
          itemType: "business",
          itemId: "biz-north-shore-recovery",
          time: "45 min",
          neighborhood: "Gastown",
          note: "Use one nearby follow-through that feels natural from dinner instead of rebuilding the route somewhere else.",
          durationMinutes: 45,
          bestAt: "Best after the main anchor already feels complete",
          travelMinutesByMode: {
            walk: 14,
            transit: 10,
            drive: 8,
            bike: 7,
          },
        },
      ],
      idealFor: [
        "Dinner plus one more move",
        "Transit-light evenings",
        "Compact visitor-friendly nights",
      ],
      reward: "Keep one two-stop night that feels full without becoming a logistics project.",
      sharePrompt:
        "I saved a CityAtlas two-stop night route that stays compact. Want the link?",
      sponsorAngle:
        "Strong fit for dinner anchors, dessert, cocktails, and short-format evening campaigns later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-gastown-evening-loop",
      title: "Gastown Evening Loop",
      slug: "gastown-evening-loop",
      theme: "Gastown",
      audience: "Locals, visitors, and couples who want one old-core evening with a contained second move",
      timeBox: "2.25 hours",
      startWindow: "Best after 6:00 PM",
      startOptions: ["6:00 PM", "6:30 PM", "7:30 PM"],
      defaultTravelMode: "walk",
      hook: "A Gastown-first evening that keeps the neighborhood energy doing the work instead of stretching the route across the city.",
      routeSummary:
        "Open the Gastown guide first, let Gastown set the mood, then keep L'Abattoir as the stronger anchor once the neighborhood already feels right.",
      steps: [
        {
          label: "Open the Gastown evening guide",
          itemType: "guide",
          itemId: "guide-gastown-evening",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the night stays about atmosphere, pacing, and one contained area.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Start in Gastown",
          itemType: "source_backed_place",
          itemId: "source-place-gastown-start",
          time: "40 min",
          neighborhood: "Gastown",
          note: "Let the neighborhood itself establish the mood before you commit to the heavier stop.",
          durationMinutes: 40,
          bestAt: "Best when the route wants old-core energy before dinner or drinks",
        },
        {
          label: "Keep L'Abattoir as the anchor stop",
          itemType: "business",
          itemId: "biz-north-shore-recovery",
          time: "75 min",
          neighborhood: "Gastown",
          note: "Use one stronger anchor inside the same area so the evening still feels compact and intentional.",
          durationMinutes: 75,
          bestAt: "Best once the neighborhood already feels like the right choice",
          travelMinutesByMode: {
            walk: 8,
            transit: 5,
            drive: 4,
            bike: 4,
          },
        },
      ],
      idealFor: [
        "Old-core evenings",
        "Dinner-first plans with atmosphere",
        "Contained Gastown nights",
      ],
      reward: "Keep one Gastown route that feels specific enough to reuse without becoming too rigid.",
      sharePrompt:
        "I saved a CityAtlas Gastown evening route that stays compact. Want the map?",
      sponsorAngle:
        "Good fit for Gastown dining, drinks, and atmosphere-led partner angles later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-mount-pleasant-flex-loop",
      title: "Mount Pleasant Flex Loop",
      slug: "mount-pleasant-flex-loop",
      theme: "Mount Pleasant",
      audience:
        "Locals, couples, and visitors who want one flexible Vancouver route with a calmer start and a Main Street anchor",
      timeBox: "2.5 hours",
      startWindow: "Best from late afternoon through dinner",
      startOptions: ["4:00 PM", "5:00 PM", "6:00 PM"],
      guideIds: ["guide-neighborhood-chooser", "guide-mount-pleasant-starter"],
      defaultTravelMode: "transit",
      hook: "A lower-pressure Queen Elizabeth to Main Street route when the night should stay adaptable instead of overly produced.",
      routeSummary:
        "Open the Mount Pleasant guide first, start at Queen Elizabeth Park for one calmer scenic reset, then keep Published on Main as the Main Street anchor if the evening still wants dinner.",
      steps: [
        {
          label: "Open the Mount Pleasant starter guide",
          itemType: "guide",
          itemId: "guide-mount-pleasant-starter",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the route stays about flexibility and easier pivots instead of a high-stakes centerpiece night.",
          durationMinutes: 5,
          bestAt: "Open before heading out",
        },
        {
          label: "Start at Queen Elizabeth Park",
          itemType: "source_backed_place",
          itemId: "source-place-queen-elizabeth-park-start",
          time: "50 min",
          neighborhood: "Queen Elizabeth Park",
          note: "Let one calmer scenic start set the tone before deciding whether the evening still wants dinner.",
          durationMinutes: 50,
          bestAt: "Best while there is still daylight",
        },
        {
          label: "Keep Published on Main as the Main Street anchor",
          itemType: "source_backed_place",
          itemId: "source-place-published-on-main",
          time: "85 min",
          neighborhood: "Main Street",
          note: "Use one stronger Main Street anchor only if the night still wants structure after the easier first stop.",
          durationMinutes: 85,
          bestAt: "Best once the route already feels worth continuing",
          travelMinutesByMode: {
            walk: 34,
            transit: 16,
            drive: 9,
            bike: 12,
          },
        },
      ],
      idealFor: [
        "Flexible evening plans",
        "Main Street dinner as an optional second move",
        "Lower-pressure Vancouver routes",
      ],
      reward: "Keep one Vancouver route that stays adaptable without collapsing into indecision.",
      sharePrompt:
        "I saved a CityAtlas Mount Pleasant-style route with a calmer start and one Main Street anchor. Want the map?",
      sponsorAngle:
        "Useful for Main Street dining, lighter scenic starts, and lower-pressure date or hosting angles later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-toronto-first-arrival-loop",
      title: "Toronto First Arrival Loop",
      slug: "toronto-first-arrival-loop",
      citySlug: "toronto",
      cityName: "Toronto",
      regionName: "Ontario",
      theme: "First visit",
      audience:
        "First-time Toronto visitors and hosts who want one easy arrival route instead of trying to solve the whole city at once",
      timeBox: "2.5 hours",
      startWindow: "Best from late morning through early evening",
      startOptions: ["11:00 AM", "1:00 PM", "4:00 PM"],
      defaultTravelMode: "walk",
      hook: "A compact Old Town-to-Distillery route that gives a first-time visitor one easy start and one atmospheric follow-up.",
      routeSummary:
        "Open the first-time Toronto guide first, use St. Lawrence Market as the easy food-and-browse start, then walk into the Distillery District when the first arrival still wants one more atmospheric second stop.",
      steps: [
        {
          label: "Open the first-time Toronto guide",
          itemType: "guide",
          itemId: "guide-first-time-toronto-start",
          time: "5 min",
          neighborhood: "Toronto",
          note: "Use the guide first so the arrival matches mood and energy before you commit to one route.",
          durationMinutes: 5,
          bestAt: "Open before leaving home or the hotel",
        },
        {
          label: "Start at St. Lawrence Market",
          itemType: "source_backed_place",
          itemId: "source-place-toronto-st-lawrence-start",
          time: "65 min",
          neighborhood: "Old Town",
          note: "Let one flexible food-and-browse stop create the first easy Toronto feeling without overbuilding the day.",
          durationMinutes: 65,
          bestAt: "Best for late morning, lunch, or an early afternoon start",
        },
        {
          label: "Keep the Distillery District as the atmospheric follow-up",
          itemType: "source_backed_place",
          itemId: "source-place-toronto-distillery-start",
          time: "75 min",
          neighborhood: "Distillery District",
          note: "Use one more contained historic-core follow-up when the arrival still wants a stronger sense of place.",
          durationMinutes: 75,
          bestAt: "Best once the first stop already feels settled",
          travelMinutesByMode: {
            walk: 18,
            transit: 12,
            drive: 8,
            bike: 9,
          },
        },
      ],
      idealFor: [
        "First arrivals that stay compact",
        "Hosts planning one easy city intro",
        "Food-and-atmosphere starts",
      ],
      reward: "Keep one first-visit Toronto route that feels generous without becoming a city-spanning checklist.",
      sharePrompt:
        "I saved a CityAtlas first-arrival Toronto route that stays compact and easy. Want the map?",
      sponsorAngle:
        "Good later for hotel, dining, transport, and first-visit partner angles once Toronto coverage grows.",
      featured: true,
    },
    {
      ...demoAudit,
      id: "mission-toronto-weekend-waterfront-loop",
      title: "Toronto Weekend Waterfront Loop",
      slug: "toronto-weekend-waterfront-loop",
      citySlug: "toronto",
      cityName: "Toronto",
      regionName: "Ontario",
      theme: "Weekend",
      audience:
        "Weekend visitors, locals, and hosts who want one compact Toronto route with browse energy first and a lighter waterfront finish",
      timeBox: "3 hours",
      startWindow: "Best from late morning through sunset",
      startOptions: ["11:30 AM", "2:00 PM", "5:00 PM"],
      defaultTravelMode: "walk",
      hook: "A downtown-west weekend route that starts with casual browse energy and stays close to the waterfront.",
      routeSummary:
        "Open the Toronto weekend guide first, start at STACKT market, walk through Toronto Music Garden, then keep Bentway Staging Grounds as the distinctive final stop if the day still wants one more move.",
      steps: [
        {
          label: "Open the Toronto weekend guide",
          itemType: "guide",
          itemId: "guide-toronto-weekend-route-ideas",
          time: "5 min",
          neighborhood: "Toronto",
          note: "Use the guide first so the weekend matches pace and setting before you lock the route in.",
          durationMinutes: 5,
          bestAt: "Open before heading out",
        },
        {
          label: "Start at STACKT market",
          itemType: "source_backed_place",
          itemId: "source-place-toronto-stackt-weekend-start",
          time: "70 min",
          neighborhood: "Bathurst and Front",
          note: "Let one browse-and-snack anchor handle the early part of the weekend without forcing a bigger cross-city plan.",
          durationMinutes: 70,
          bestAt: "Best when the group wants casual browsing first",
        },
        {
          label: "Walk through Toronto Music Garden",
          itemType: "source_backed_place",
          itemId: "source-place-toronto-music-garden-weekend-start",
          time: "45 min",
          neighborhood: "Harbourfront",
          note: "Use one calmer waterfront stop when the route wants breathing room after the market energy.",
          durationMinutes: 45,
          bestAt: "Best once the first stop already feels complete",
          travelMinutesByMode: {
            walk: 16,
            transit: 10,
            drive: 8,
            bike: 8,
          },
        },
        {
          label: "Keep Bentway Staging Grounds as the final move",
          itemType: "source_backed_place",
          itemId: "source-place-toronto-bentway-weekend-start",
          time: "35 min",
          neighborhood: "Fort York / CityPlace",
          note: "Use one distinctive under-Gardiner walk stop if the day still wants a final design-forward move nearby.",
          durationMinutes: 35,
          bestAt: "Best when the group still wants one more short stop before wrapping",
          travelMinutesByMode: {
            walk: 12,
            transit: 8,
            drive: 6,
            bike: 6,
          },
        },
      ],
      idealFor: [
        "Compact Toronto weekends",
        "Browse-first groups",
        "Waterfront-adjacent city days",
      ],
      reward: "Keep one Toronto weekend route that feels full without dragging everyone across the city.",
      sharePrompt:
        "I saved a CityAtlas Toronto weekend route that stays compact and waterfront-adjacent. Want the map?",
      sponsorAngle:
        "Good later for weekend dining, market, hotel, and waterfront partner angles once Toronto coverage expands.",
      featured: true,
    },
    {
      ...demoAudit,
      id: "mission-first-time-vancouver-intro",
      title: "First-Time Vancouver Intro Loop",
      slug: "first-time-vancouver-intro-loop",
      theme: "Visitor intro",
      audience: "First-time visitors and hosts who want one central Vancouver start without overbuilding day one",
      timeBox: "2.5 hours",
      startWindow: "Best from late morning through early evening",
      startOptions: ["11:00 AM", "1:00 PM", "4:00 PM"],
      defaultTravelMode: "walk",
      hook: "A simple downtown-to-Gastown intro when the first visit needs one cultural anchor and one atmospheric follow-through.",
      routeSummary:
        "Open the first-time visitor guide first, use the Vancouver Art Gallery as the central indoor anchor, then walk into Gastown for the historic-core follow-through.",
      steps: [
        {
          label: "Open the first-time visitor guide",
          itemType: "guide",
          itemId: "guide-first-time-visitor-start",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the route stays clear about why this central start fits a first visit.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Start at the Vancouver Art Gallery",
          itemType: "source_backed_place",
          itemId: "source-place-vancouver-art-gallery-downtown-start",
          time: "60 min",
          neighborhood: "Downtown",
          note: "Let one central culture stop carry the first decision before the plan turns into a bigger city checklist.",
          durationMinutes: 60,
          bestAt: "Best when the arrival wants one downtown indoor anchor",
        },
        {
          label: "Walk into Gastown for the second stop",
          itemType: "source_backed_place",
          itemId: "source-place-gastown-start",
          time: "60 min",
          neighborhood: "Gastown",
          note: "Use one shorter historic-core follow-through instead of adding a third neighborhood too early.",
          durationMinutes: 60,
          bestAt: "Best once the first anchor already feels complete",
          travelMinutesByMode: {
            walk: 18,
            transit: 11,
            drive: 7,
            bike: 9,
          },
        },
      ],
      idealFor: [
        "First Vancouver arrivals",
        "Hosts planning a simpler first impression",
        "Culture-first downtown starts",
      ],
      reward: "Keep one map-ready first-visit loop that feels welcoming without trying to cover the whole city.",
      sharePrompt:
        "I saved a CityAtlas first-time Vancouver route that starts downtown and stays easy to follow. Want the link?",
      sponsorAngle:
        "Useful for visitor-friendly culture, dining, and host-ready partner angles once wider source-backed coverage is live.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-returning-visitor-local-loop",
      title: "Returning Visitor Local Loop",
      slug: "returning-visitor-local-loop",
      theme: "Second look",
      audience: "Returning visitors and repeat hosts who want Vancouver to feel more local than the first-trip loop",
      timeBox: "2.5 hours",
      startWindow: "Best from late morning through early evening",
      startOptions: ["11:30 AM", "1:30 PM", "4:30 PM"],
      defaultTravelMode: "transit",
      hook: "An east-side repeat-visit route with one neighborhood anchor and one slower park follow-through.",
      routeSummary:
        "Open the returning-visitor guide first, start on Commercial Drive, then let Trout Lake carry the quieter second half of the route.",
      steps: [
        {
          label: "Open the returning-visitor guide",
          itemType: "guide",
          itemId: "guide-returning-visitor-local-discovery",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the route stays about a second-look Vancouver feeling, not another tourist checklist.",
          durationMinutes: 5,
          bestAt: "Open before heading out",
        },
        {
          label: "Start on Commercial Drive",
          itemType: "source_backed_place",
          itemId: "source-place-commercial-drive-returning-start",
          time: "70 min",
          neighborhood: "Commercial Drive",
          note: "Let one street-led neighborhood anchor do most of the work before deciding whether the route still wants more movement.",
          durationMinutes: 70,
          bestAt: "Best when browsing, food choices, and local texture matter most",
        },
        {
          label: "Keep Trout Lake as the slower follow-through",
          itemType: "source_backed_place",
          itemId: "source-place-trout-lake-returning-start",
          time: "55 min",
          neighborhood: "John Hendry Park",
          note: "Use one quieter east-side reset instead of pulling the route back into a busier cross-city finish.",
          durationMinutes: 55,
          bestAt: "Best when the day still wants one calmer second stop",
          travelMinutesByMode: {
            walk: 26,
            transit: 14,
            drive: 8,
            bike: 10,
          },
        },
      ],
      idealFor: [
        "Repeat Vancouver weekends",
        "Locals hosting repeat guests",
        "Neighborhood-led second looks",
      ],
      reward: "Keep one repeat-visit route that feels more local without turning into a forced hidden-gem hunt.",
      sharePrompt:
        "I saved a CityAtlas returning-visitor route that feels more local than the first-trip loop. Want to try it?",
      sponsorAngle:
        "Strong fit for east-side food, culture, neighborhood service, and host-friendly local campaigns later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-weekend-park-and-bay-loop",
      title: "Park And Bay Weekend Loop",
      slug: "park-and-bay-weekend-loop",
      theme: "Weekend",
      audience: "Weekend visitors, locals, and hosts who want one scenic Vancouver route that stays compact",
      timeBox: "2.75 hours",
      startWindow: "Best from late morning through sunset",
      startOptions: ["10:30 AM", "1:00 PM", "5:00 PM"],
      defaultTravelMode: "walk",
      hook: "A waterfront weekend route with one big park anchor and one easier beach follow-through.",
      routeSummary:
        "Open the weekend-route guide first, let Stanley Park carry the big scenic start, then keep English Bay as the shorter downtown beach finish.",
      steps: [
        {
          label: "Open the weekend-route guide",
          itemType: "guide",
          itemId: "guide-weekend-route-ideas",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the weekend still feels intentional instead of inheriting too many possible starts.",
          durationMinutes: 5,
          bestAt: "Open before heading out",
        },
        {
          label: "Start at Stanley Park",
          itemType: "source_backed_place",
          itemId: "source-place-stanley-park-weekend-start",
          time: "80 min",
          neighborhood: "Stanley Park",
          note: "Let one bigger scenic anchor do most of the work before adding a second stop.",
          durationMinutes: 80,
          bestAt: "Best in daylight or before sunset",
        },
        {
          label: "Keep English Bay as the follow-through",
          itemType: "source_backed_place",
          itemId: "source-place-english-bay-weekend-start",
          time: "55 min",
          neighborhood: "West End",
          note: "Use one nearby waterfront follow-through instead of rebuilding the route around another distant weekend idea.",
          durationMinutes: 55,
          bestAt: "Best once the park loop already feels complete",
          travelMinutesByMode: {
            walk: 22,
            transit: 13,
            drive: 7,
            bike: 9,
          },
        },
      ],
      idealFor: [
        "Good-weather weekends",
        "Visitor hosting without too many stops",
        "Scenic city days",
      ],
      reward: "Keep one weekend route that feels beautiful and easy instead of sprawling across the city.",
      sharePrompt:
        "I saved a CityAtlas weekend route with Stanley Park and English Bay. Want the map?",
      sponsorAngle:
        "Good fit for waterfront dining, guest-friendly activities, and scenic weekend campaigns later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-west-side-daytime-loop",
      title: "West Side Daytime Loop",
      slug: "west-side-daytime-loop",
      theme: "Daytime",
      audience: "Locals, visitors, and hosts who want one calmer west-side daytime route without citywide pivots",
      timeBox: "2.25 hours",
      startWindow: "Best from late morning through golden hour",
      startOptions: ["10:30 AM", "1:00 PM", "4:30 PM"],
      defaultTravelMode: "walk",
      hook: "A beach-led west-side route that stays compact instead of splitting the day between too many anchor types.",
      routeSummary:
        "Open the west-side daytime guide first, start at Jericho Beach, then let Locarno Beach carry the quieter follow-through.",
      steps: [
        {
          label: "Open the west-side daytime guide",
          itemType: "guide",
          itemId: "guide-west-side-daytime-starter",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the west side stays one contained daytime shape instead of turning into a loose wish list.",
          durationMinutes: 5,
          bestAt: "Open before heading west",
        },
        {
          label: "Start at Jericho Beach",
          itemType: "source_backed_place",
          itemId: "source-place-jericho-beach-daytime-start",
          time: "65 min",
          neighborhood: "Jericho",
          note: "Let one open shoreline anchor do most of the work before you add another stop.",
          durationMinutes: 65,
          bestAt: "Best when the day wants room, light, and an easier pace",
        },
        {
          label: "Keep Locarno Beach as the quieter follow-through",
          itemType: "source_backed_place",
          itemId: "source-place-locarno-beach-daytime-start",
          time: "50 min",
          neighborhood: "Locarno",
          note: "Stay close enough that the route still feels west-side and low-friction instead of scattering inland.",
          durationMinutes: 50,
          bestAt: "Best once the shoreline start already feels complete",
          travelMinutesByMode: {
            walk: 14,
            transit: 8,
            drive: 5,
            bike: 4,
          },
        },
      ],
      idealFor: [
        "Good-weather west-side starts",
        "Lower-pressure daytime plans",
        "Beach-led city days",
      ],
      reward: "Keep one west-side daytime route that is easy to repeat and easy to hand to a guest.",
      sharePrompt:
        "I saved a CityAtlas west-side daytime route that stays simple and scenic. Want it?",
      sponsorAngle:
        "Useful for west-side daytime food, rentals, activity, and neighborhood partner ideas later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-false-creek-culture-loop",
      title: "False Creek Culture Loop",
      slug: "false-creek-culture-loop",
      theme: "Culture",
      audience: "Locals, visitors, and hosts who want one contained Vancouver culture afternoon with a real follow-through",
      timeBox: "3 hours",
      startWindow: "Best from late morning through late afternoon",
      startOptions: ["11:00 AM", "1:00 PM", "3:30 PM"],
      defaultTravelMode: "walk",
      hook: "A market-to-museum culture route that stays in one zone before easing into the shoreline.",
      routeSummary:
        "Open the False Creek culture guide first, start at Granville Island Public Market, keep the Museum of Vancouver as the anchor, then finish with a shorter Kits Beach follow-through.",
      steps: [
        {
          label: "Open the False Creek culture guide",
          itemType: "guide",
          itemId: "guide-false-creek-culture-starter",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the afternoon stays one compact zone instead of hopping between too many culture options.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Start at Granville Island Public Market",
          itemType: "source_backed_place",
          itemId: "source-place-granville-public-market-culture-start",
          time: "65 min",
          neighborhood: "Granville Island",
          note: "Let food, browsing, and lower-pressure movement open the route before you commit to a museum stop.",
          durationMinutes: 65,
          bestAt: "Best from late morning through early afternoon",
        },
        {
          label: "Keep the Museum of Vancouver as the main anchor",
          itemType: "source_backed_place",
          itemId: "source-place-mov-culture-start",
          time: "70 min",
          neighborhood: "Vanier Park",
          note: "Use one stronger indoor anchor so the route feels intentional instead of stacking every museum in the area.",
          durationMinutes: 70,
          bestAt: "Best once the market browse already feels complete",
          travelMinutesByMode: {
            walk: 22,
            transit: 14,
            drive: 9,
            bike: 11,
          },
        },
        {
          label: "Finish with a Kits Beach follow-through",
          itemType: "source_backed_place",
          itemId: "source-place-kits-beach-culture-follow-through",
          time: "35 min",
          neighborhood: "Kitsilano",
          note: "Use one simple shoreline finish instead of turning the afternoon into a second big destination problem.",
          durationMinutes: 35,
          bestAt: "Best when the route still wants one open-air close",
          travelMinutesByMode: {
            walk: 12,
            transit: 7,
            drive: 4,
            bike: 4,
          },
        },
      ],
      idealFor: [
        "Contained culture afternoons",
        "Granville Island and Vanier Park days",
        "Visitor hosting without citywide overbuild",
      ],
      reward: "Keep one culture-afternoon route that feels full without becoming a marathon.",
      sharePrompt:
        "I saved a CityAtlas False Creek culture route with Granville Island, MOV, and a beach finish. Want it?",
      sponsorAngle:
        "Strong fit for museums, public attractions, nearby food, and culture-led local campaigns later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-ubc-discovery-loop",
      title: "UBC Discovery Loop",
      slug: "ubc-discovery-loop",
      theme: "Discovery",
      audience: "Locals, visitors, and hosts who want one contained campus-side Vancouver day with a map-ready follow-through",
      timeBox: "3 hours",
      startWindow: "Best from late morning through early evening",
      startOptions: ["10:30 AM", "1:00 PM", "3:30 PM"],
      defaultTravelMode: "walk",
      hook: "A campus-side discovery route with one museum anchor, one garden pause, and one canopy finish.",
      routeSummary:
        "Open the UBC discovery guide first, let MOA carry the main anchor, then keep Nitobe and GreenHeart TreeWalk as the calmer follow-through inside one campus-side route.",
      steps: [
        {
          label: "Open the UBC discovery guide",
          itemType: "guide",
          itemId: "guide-ubc-discovery-starter",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the day stays one campus-side discovery route instead of a broader west-side checklist.",
          durationMinutes: 5,
          bestAt: "Open before heading to UBC",
        },
        {
          label: "Start at the Museum of Anthropology",
          itemType: "source_backed_place",
          itemId: "source-place-moa-ubc-discovery-start",
          time: "80 min",
          neighborhood: "UBC",
          note: "Let one stronger museum anchor do most of the work before you decide if the day still wants more movement.",
          durationMinutes: 80,
          bestAt: "Best when the route wants one clear culture-first anchor",
        },
        {
          label: "Keep Nitobe as the quieter second stop",
          itemType: "source_backed_place",
          itemId: "source-place-nitobe-ubc-discovery-start",
          time: "40 min",
          neighborhood: "UBC",
          note: "Use one calmer garden pause so the route changes pace without leaving the campus-side zone.",
          durationMinutes: 40,
          bestAt: "Best once the museum anchor already feels complete",
          travelMinutesByMode: {
            walk: 12,
            transit: 8,
            drive: 5,
            bike: 6,
          },
        },
        {
          label: "Finish with the GreenHeart TreeWalk follow-through",
          itemType: "source_backed_place",
          itemId: "source-place-greenheart-ubc-discovery-follow-through",
          time: "35 min",
          neighborhood: "UBC",
          note: "Use one canopy finish when the day still wants one memorable outdoor follow-through without leaving the campus route.",
          durationMinutes: 35,
          bestAt: "Best when the route still has energy for one final stop",
          travelMinutesByMode: {
            walk: 15,
            transit: 9,
            drive: 6,
            bike: 7,
          },
        },
      ],
      idealFor: [
        "Campus-side discovery days",
        "Museum-and-garden combinations",
        "Visitors who want one contained west-side plan",
      ],
      reward: "Keep one UBC-side route that feels complete without turning into a scattered all-day build.",
      sharePrompt:
        "I saved a CityAtlas UBC discovery route with MOA, Nitobe, and a canopy finish. Want the map?",
      sponsorAngle:
        "Useful for campus-adjacent culture, food, transport, and visitor-hosting campaigns later.",
      featured: false,
    },
    {
      ...demoAudit,
      id: "mission-garden-day-loop",
      title: "Garden Day Loop",
      slug: "garden-day-loop",
      theme: "Garden day",
      audience: "Locals, visitors, and hosts who want one greener Vancouver route with a compact second stop",
      timeBox: "2.25 hours",
      startWindow: "Best from late morning through early evening",
      startOptions: ["10:30 AM", "1:00 PM", "4:00 PM"],
      defaultTravelMode: "walk",
      hook: "A hilltop garden route that stays compact with one scenic anchor and one indoor follow-through.",
      routeSummary:
        "Open the garden-day guide first, use Queen Elizabeth Park for the bigger scenic start, then keep Bloedel Conservatory as the contained second stop.",
      steps: [
        {
          label: "Open the garden-day guide",
          itemType: "guide",
          itemId: "guide-garden-day-starter",
          time: "5 min",
          neighborhood: "Vancouver",
          note: "Use the guide first so the day stays one greener route shape instead of turning into a vague nature list.",
          durationMinutes: 5,
          bestAt: "Open before leaving home",
        },
        {
          label: "Start at Queen Elizabeth Park",
          itemType: "source_backed_place",
          itemId: "source-place-queen-elizabeth-garden-day-start",
          time: "60 min",
          neighborhood: "Queen Elizabeth Park",
          note: "Let one hilltop park anchor carry the first impression before you add another stop.",
          durationMinutes: 60,
          bestAt: "Best when the route wants open-air views first",
        },
        {
          label: "Keep Bloedel Conservatory as the follow-through",
          itemType: "source_backed_place",
          itemId: "source-place-bloedel-garden-day-start",
          time: "45 min",
          neighborhood: "Queen Elizabeth Park",
          note: "Stay close and contained so the route still feels like one coherent garden day.",
          durationMinutes: 45,
          bestAt: "Best when the day still wants one indoor or weather-proof second stop",
          travelMinutesByMode: {
            walk: 12,
            transit: 8,
            drive: 5,
            bike: 5,
          },
        },
      ],
      idealFor: [
        "Garden-led day plans",
        "Calmer scenic routes",
        "Indoor-outdoor nature combinations",
      ],
      reward: "Keep one greener Vancouver route that is easy to use when the day wants calm and clarity.",
      sharePrompt:
        "I saved a CityAtlas garden-day route with Queen Elizabeth Park and Bloedel. Want it?",
      sponsorAngle:
        "Good fit for garden-adjacent dining, calm-day activities, and nature-first campaigns later.",
      featured: false,
    },
  ],
  packages: [
    {
      id: "community",
      name: "Community Listing",
      priceLabel: "$0 CAD / month",
      paymentState: "disabled_until_launch_approval",
      description:
        "A simple starting point for businesses that want a CityAtlas page or review request on file.",
      bestFor: "Businesses that want to be considered for future coverage or keep a request ready before paid help.",
      highlighted: false,
      features: [
        "Basic business request",
        "Initial fit check",
        "Source and trust notes",
        "No billing until checkout opens",
      ],
    },
    {
      id: "city_partner",
      name: "City Partner",
      priceLabel: "$49 CAD / month on launch",
      paymentState: "disabled_until_launch_approval",
      description:
        "A fuller local-visibility package with a stronger page, guide consideration, and one offer, service angle, or event slot.",
      bestFor:
        "Restaurants, cafes, wellness businesses, repair shops, cleaners, mobile services, and experience operators.",
      highlighted: true,
      features: [
        "Enhanced business page",
        "Guide placement check",
        "Offer or event slot",
        "Monthly visibility snapshot",
      ],
    },
    {
      id: "signature_partner",
      name: "Signature Partner",
      priceLabel: "$149 CAD / month on launch",
      paymentState: "disabled_until_launch_approval",
      description:
        "A higher-touch local package for deeper page work, sponsored ideas, service positioning, and campaign planning.",
      bestFor: "Businesses ready for a hands-on content, offer, and local growth push.",
      highlighted: false,
      features: [
        "Premium feature page",
        "Creative visit planning",
        "Sponsored guide proposal",
        "Visibility report",
      ],
    },
  ],
  launchGates: [
    {
      id: "gate-domain",
      title: "Approved public domain and indexing",
      status: "approved",
      risk: "business",
      ownerDecision:
        "Use the approved Univenture domain for public crawlable release while keeping any future standalone-domain purchase as a separate business decision.",
      notes:
        "CityAtlas is publicly crawlable on city.univenturestudio.com and the public Vercel alias. A future standalone domain or brand-lock decision remains separate.",
    },
    {
      id: "gate-payments",
      title: "Live Stripe/payment acceptance",
      status: "locked",
      risk: "payment",
      ownerDecision:
        "Approve payment processor, prices, refund policy, and customer terms.",
      notes:
        "Pricing UI is request-only. No checkout or live payment link is active.",
    },
    {
      id: "gate-real-data",
      title: "Real business data import",
      status: "locked",
      risk: "data",
      ownerDecision:
        "Approve source list, data rights, verification policy, and removal path.",
      notes:
        "Current app ships fictional seed records and source labels only.",
    },
    {
      id: "gate-outreach",
      title: "Outbound business outreach",
      status: "locked",
      risk: "customer",
      ownerDecision:
        "Approve message, channel, compliance posture, and sending cadence.",
      notes:
        "The package can collect local drafts/submissions but sends nothing.",
    },
    {
      id: "gate-admin-protection",
      title: "Owner/admin route protection",
      status: "approved",
      risk: "data",
      ownerDecision:
        "Keep hosted admin and private-preview flags off by default and only widen access with a separate protected-sharing approval.",
      notes:
        "Hosted builds keep /admin and /private-preview/date-night gated while localhost remains available for founder work.",
    },
    {
      id: "gate-provider",
      title: "Google Places or paid provider use",
      status: "locked",
      risk: "provider",
      ownerDecision:
        "Approve provider, budget cap, API terms, and attribution rules.",
      notes:
        "Provider import flags are false and no provider SDK is installed.",
    },
  ],
  submissions: [],
  newsletterLeads: [],
  savedItems: [],
  missionPlans: [],
  growthEvents: [],
  revenueExperiments: [
    {
      id: "rev-city-partner",
      name: "City Partner founding package",
      hypothesis:
        "A clear $49/month planned founding package will produce more qualified review requests than a generic contact-us CTA.",
      control: "Generic business review CTA with no package framing.",
      variant: "$49/month planned City Partner package with feature page, guide review, offer module, and visibility snapshot.",
      primaryMetric: "Qualified business review requests",
      guardrailMetric: "Confusion about live payment availability",
      status: "running_local",
      ownerApprovalRequired: true,
    },
    {
      id: "rev-signature-partner",
      name: "Signature Partner premium anchor",
      hypothesis:
        "A $149/month planned premium anchor will make the $49 City Partner package feel safer while identifying high-intent businesses.",
      control: "Single package or undifferentiated partner request.",
      variant: "Three-tier packaging with Signature Partner as premium anchor and City Partner highlighted.",
      primaryMetric: "Package-interest selection on business submission",
      guardrailMetric: "Low trust from pricing shown before proof",
      status: "draft",
      ownerApprovalRequired: true,
    },
    {
      id: "rev-date-night-demand-loop",
      name: "Date Night first revenue proof",
      hypothesis:
        "If 2 to 3 contact-reviewed Date Night prospects ask for pricing, partnership details, or a next-step demo, Stripe test-mode setup becomes justified.",
      control: "Payment-disabled package page and no customer-facing outreach.",
      variant:
        "Owner-approved manual first-touch to 10 contact-reviewed Date Night prospects with reply logging and package-demand scoring.",
      primaryMetric: "Qualified package or private-preview demand signals",
      guardrailMetric: "No confusion that payment, public listings, or automated outreach are active",
      status: "ready_for_review",
      ownerApprovalRequired: true,
    },
  ],
  growthPlays: [
    {
      id: "growth-city-missions",
      title: "City Missions as the repeat habit",
      sourcePattern:
        "Tripsy/KAYAK-style planning plus Partiful-style share intent and curated city-guide hubs.",
      whyItMatters:
        "A mission gives locals a reason to save multiple items, return later, and invite someone else instead of bouncing after one listing.",
      implementation:
        "Implemented locally as mission cards, route timelines, save-all actions, planner progress, and share prompts.",
      metric: "Mission saves, saved items per visitor, planner share attempts",
      status: "implemented_local",
      ownerGate: "Accounts, real sharing, and referral attribution require privacy/auth approval.",
    },
    {
      id: "growth-business-proof",
      title: "Business proof from consumer demand",
      sourcePattern:
        "Yelp-style trust signals and Google Business Profile-style completeness loops translated into founder partner review.",
      whyItMatters:
        "Businesses need proof that CityAtlas creates local intent before they pay for a package.",
      implementation:
        "Local admin radar ties saves, submissions, mission demand, and package-interest experiments together.",
      metric: "Qualified review requests and partner package interest",
      status: "implemented_local",
      ownerGate: "No claims, outreach, or invoices until real data and payment gates are approved.",
    },
    {
      id: "growth-ai-visibility",
      title: "AEO/GEO answer-first content layer",
      sourcePattern:
        "Editorial city guides and structured business pages made easier for people, crawlers, and AI agents to understand.",
      whyItMatters:
        "CityAtlas can become a category answer for specific local questions, not a generic directory.",
      implementation:
        "Route metadata, JSON-LD, llms.txt, sitemap, answer-first docs, and conservative noindex defaults are in place.",
      metric: "Future indexed pages, brand/entity accuracy, qualified search and AI referrals",
      status: "ready_for_review",
      ownerGate: "Public indexing and domain canonicalization require launch approval.",
    },
  ],
  proofSprints: [
    {
      id: "proof-date-night-vancouver",
      name: "Date Night Founder Proof Sprint",
      wedge: "Vancouver date-night restaurants, dessert stops, bars, and light cultural experiences",
      status: "research_packet_ready",
      thesis:
        "Date night is the first CityAtlas wedge because it is naturally shareable, visually strong, repeatable, and easy for local businesses to understand as a route-placement offer.",
      targetBuyer:
        "Owner-operated restaurants, cocktail bars, dessert shops, cultural venues, and experience operators that benefit from planned outings instead of one-off directory traffic.",
      firstMission: "Two-Hour Date Night Loop",
      safeAssets: [
        "Source-backed candidate queue",
        "Founder partner sales packet",
        "Review-only outreach drafts",
        "Private demo route brief",
        "Generated 10-prospect proof packet",
      ],
      approvalRequired: [
        "Publishing real business pages",
        "Sending outbound messages",
        "Claiming traffic, ranking, or popularity",
        "Accepting payment or deposits",
      ],
      primaryMetric:
        "Meaningful replies, private demo requests, or warm-intro opportunities from 10 to 20 owner-reviewed prospects.",
      nextAction:
        "Monitor the first six owner-approved manual emails, log replies in /admin, and keep unresolved contact-path rows held until manually confirmed.",
    },
  ],
  proofCandidates: [
    {
      id: "candidate-published-on-main",
      proofSprintId: "proof-date-night-vancouver",
      name: "Published on Main",
      segment: "Restaurant",
      roleInMission: "Premium anchor dinner",
      sourceUrl: "https://publishedonmain.com/",
      sourceStatus: "official_source_saved",
      fitScore: 96,
      routeAngle: "Main Street tasting route",
      outreachStatus: "sent_manual",
      approvalStatus: "owner_approved_manual_outreach",
      contactPathType: "direct_email",
      contactPath: "bookings@publishedyvr.com for group bookings; info@publishedyvr.com for general inquiries",
      contactSourceUrl: "https://publishedonmain.com/events/",
      contactConfidence: "high",
      contactResearchNote:
        "Official group bookings page lists bookings@publishedyvr.com; contact page lists info@publishedyvr.com.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Do not mention awards, rankings, menu details, or image usage until manually verified and approved.",
      nextStep: "Sent manually by email; monitor for reply and log outcome in /admin.",
    },
    {
      id: "candidate-kissa-tanto",
      proofSprintId: "proof-date-night-vancouver",
      name: "Kissa Tanto",
      segment: "Restaurant",
      roleInMission: "Intimate dinner anchor",
      sourceUrl: "https://www.kissatanto.com/",
      sourceStatus: "official_source_saved",
      fitScore: 94,
      routeAngle: "Chinatown intimate dinner route",
      outreachStatus: "sent_manual",
      approvalStatus: "owner_approved_manual_outreach",
      contactPathType: "direct_email",
      contactPath: "hello@kissatanto.com",
      contactSourceUrl: "https://www.kissatanto.com/",
      contactConfidence: "high",
      contactResearchNote:
        "Official site lists hello@kissatanto.com and Tock for reservations.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Confirm current hours, reservation path, and any accolade language before a private preview leaves local mode.",
      nextStep: "Sent manually by email; monitor for reply and log outcome in /admin.",
    },
    {
      id: "candidate-labattoir",
      proofSprintId: "proof-date-night-vancouver",
      name: "L'Abattoir",
      segment: "Restaurant and bar",
      roleInMission: "Gastown dinner or bar anchor",
      sourceUrl: "https://www.labattoir.ca/",
      sourceStatus: "official_source_saved",
      fitScore: 92,
      routeAngle: "Gastown candlelit route",
      outreachStatus: "sent_manual",
      approvalStatus: "owner_approved_manual_outreach",
      contactPathType: "private_events_form",
      contactPath: "Official private dining event request form; fallback info@labattoir.ca",
      contactSourceUrl: "https://www.labattoir.ca/private-dining",
      contactConfidence: "high",
      contactResearchNote:
        "Official private dining page points to an event request form and footer lists info@labattoir.ca.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Use only neutral route fit language until business details, media rights, and source wording are approved.",
      nextStep: "Sent manually by email; monitor for reply and log outcome in /admin.",
    },
    {
      id: "candidate-botanist",
      proofSprintId: "proof-date-night-vancouver",
      name: "Botanist",
      segment: "Restaurant and cocktail bar",
      roleInMission: "Dinner plus cocktail route",
      sourceUrl: "https://www.botanistrestaurant.com/",
      sourceStatus: "official_source_saved",
      fitScore: 91,
      routeAngle: "Dinner and cocktail route",
      outreachStatus: "sent_manual",
      approvalStatus: "owner_approved_manual_outreach",
      contactPathType: "private_events_form",
      contactPath:
        "Official private dining enquire form; fallback info@botanistrestaurant.com",
      contactSourceUrl: "https://www.botanistrestaurant.com/private-dining/",
      contactConfidence: "high",
      contactResearchNote:
        "Official private dining page has Enquire links; contact page lists info@botanistrestaurant.com.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Avoid copying brand language and confirm current menus, bar details, and private dining claims.",
      nextStep: "Sent manually by email; monitor for reply and log outcome in /admin.",
    },
    {
      id: "candidate-miku",
      proofSprintId: "proof-date-night-vancouver",
      name: "Miku Waterfront",
      segment: "Restaurant",
      roleInMission: "Waterfront dinner anchor",
      sourceUrl: "https://mikurestaurant.com/",
      sourceStatus: "official_source_saved",
      fitScore: 90,
      routeAngle: "Waterfront celebration route",
      outreachStatus: "sent_manual",
      approvalStatus: "owner_approved_manual_outreach",
      contactPathType: "direct_email",
      contactPath: "info@mikurestaurant.com",
      contactSourceUrl: "https://mikurestaurant.com/contact/",
      contactConfidence: "high",
      contactResearchNote:
        "Official contact page lists info@mikurestaurant.com for inquiries and OpenTable for larger reservations.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Confirm official booking policy, current location details, and permitted use of any waterfront imagery.",
      nextStep: "Sent manually by email; monitor for reply and log outcome in /admin.",
    },
    {
      id: "candidate-thierry",
      proofSprintId: "proof-date-night-vancouver",
      name: "Thierry Chocolates",
      segment: "Dessert and cafe",
      roleInMission: "Dessert or late cafe closer",
      sourceUrl: "https://thierrychocolates.com/",
      sourceStatus: "official_source_saved",
      fitScore: 87,
      routeAngle: "Dessert closer route",
      outreachStatus: "draft_ready",
      approvalStatus: "review_only",
      contactPathType: "protected_email_link",
      contactPath:
        "Official site footer has a protected email link and location phone numbers; manually confirm before any send.",
      contactSourceUrl: "https://thierrychocolates.com/",
      contactConfidence: "medium",
      contactResearchNote:
        "Official site exposes a contact email link in protected form and lists location phone numbers.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Confirm the specific location, hours, product availability, and whether the route references one location or the brand generally.",
      nextStep: "Use as a route closer, not a stand-alone first pitch.",
    },
    {
      id: "candidate-keefer-bar",
      proofSprintId: "proof-date-night-vancouver",
      name: "The Keefer Bar",
      segment: "Cocktail bar",
      roleInMission: "Cocktail closer",
      sourceUrl: "https://thekeeferbar.com/",
      sourceStatus: "official_source_saved",
      fitScore: 86,
      routeAngle: "Cocktail closer route",
      outreachStatus: "draft_ready",
      approvalStatus: "review_only",
      contactPathType: "protected_email_link",
      contactPath:
        "Official contact page has a protected email link and phone number; manually confirm before any send.",
      contactSourceUrl: "https://thekeeferbar.com/contact/",
      contactConfidence: "medium",
      contactResearchNote:
        "Official contact page lists address, protected email link, and phone.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Alcohol-related copy needs responsible wording, age restrictions, and no implied endorsement before approval.",
      nextStep: "Pair with a Chinatown or Gastown dinner anchor.",
    },
    {
      id: "candidate-granville-island-market",
      proofSprintId: "proof-date-night-vancouver",
      name: "Granville Island Public Market",
      segment: "Market and experience",
      roleInMission: "Daytime-to-evening activity bridge",
      sourceUrl: "https://granvilleisland.com/public-market",
      sourceStatus: "official_source_saved",
      fitScore: 82,
      routeAngle: "Low-pressure market date route",
      outreachStatus: "draft_ready",
      approvalStatus: "review_only",
      contactPathType: "contact_page",
      contactPath:
        "Official Granville Island contact page and admin/event-booking paths; manually choose public-market or event route before any send.",
      contactSourceUrl: "https://granvilleisland.com/contact",
      contactConfidence: "medium",
      contactResearchNote:
        "Official page lists contact details and points event bookings/leasing to the Granville Island admin site.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Confirm hours close to publish date and avoid implying individual vendor participation.",
      nextStep: "Use as visitor-friendly route content, not first paid partner target.",
    },
    {
      id: "candidate-vancouver-art-gallery",
      proofSprintId: "proof-date-night-vancouver",
      name: "Vancouver Art Gallery",
      segment: "Culture",
      roleInMission: "Cultural starter or rainy-day date",
      sourceUrl: "https://www.vanartgallery.bc.ca/",
      sourceStatus: "official_source_saved",
      fitScore: 80,
      routeAngle: "Culture-first date route",
      outreachStatus: "sent_manual",
      approvalStatus: "owner_approved_manual_outreach",
      contactPathType: "direct_email",
      contactPath:
        "marketing@vanartgallery.bc.ca for marketing route fit; learn@vanartgallery.bc.ca for group bookings",
      contactSourceUrl: "https://www.vanartgallery.bc.ca/contact-us/",
      contactConfidence: "high",
      contactResearchNote:
        "Official contact page lists department emails including marketing and group bookings.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Current exhibitions, ticketing, and hours must be checked close to any private or public preview.",
      nextStep: "Sent manually by email; monitor for reply and log outcome in /admin.",
    },
    {
      id: "candidate-flyover-vancouver",
      proofSprintId: "proof-date-night-vancouver",
      name: "Flyover Vancouver",
      segment: "Attraction",
      roleInMission: "Visitor-friendly experience add-on",
      sourceUrl: "https://www.experienceflyover.com/vancouver/",
      sourceStatus: "official_source_saved",
      fitScore: 78,
      routeAngle: "Visitor wow-date route",
      outreachStatus: "draft_ready",
      approvalStatus: "review_only",
      contactPathType: "contact_page",
      contactPath:
        "Official contact page and structured data list info@experienceflyover.com and +1-866-498-2023; manually confirm the best partnership or group contact before any send.",
      contactSourceUrl: "https://www.experienceflyover.com/vancouver/contact-us/",
      contactConfidence: "medium",
      contactResearchNote:
        "Official contact page metadata describes a contact form, and official structured data lists a customer-service email and phone. Treat as general contact until a partnership-specific path is confirmed.",
      lastContactResearchAt: "2026-06-14",
      riskNotes:
        "Confirm show schedule, pricing, accessibility, and availability before any route claim.",
      nextStep: "Use as a visitor route variant after restaurant anchor review.",
    },
  ],
  businessProspects: [],
  manualReplyLogs: [],
  businessInboundMirror: [],
  businessReplyBridgeReplays: [],
  businessReplyLogs: [],
  brainRuns: [],
  auditLogs: [
    {
      id: "audit-seed-loaded",
      action: "seed_loaded",
      entityType: "launch_package",
      entityId: "cityatlas-vancouver",
      summary:
        "Loaded a mixed Vancouver seed graph: source-backed public business pages with real venue imagery are live locally, while wider offers, events, and many route layers still use preview or gated data.",
      createdAt: now,
    },
  ],
};
