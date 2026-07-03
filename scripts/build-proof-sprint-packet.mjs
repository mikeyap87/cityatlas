import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const candidates = [
  {
    id: "candidate-published-on-main",
    name: "Published on Main",
    segment: "Restaurant",
    roleInMission: "Premium anchor dinner",
    sourceUrl: "https://publishedonmain.com/",
    contactPathType: "direct_email",
    contactPath: "bookings@publishedyvr.com for group bookings; info@publishedyvr.com for general inquiries",
    contactSourceUrl: "https://publishedonmain.com/events/",
    contactConfidence: "high",
    contactResearchNote:
      "Official group bookings page lists bookings@publishedyvr.com; contact page lists info@publishedyvr.com.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 96,
    routeAngle: "Main Street tasting route",
    riskNotes:
      "Do not mention awards, rankings, menu details, or image usage until manually verified and approved.",
  },
  {
    id: "candidate-kissa-tanto",
    name: "Kissa Tanto",
    segment: "Restaurant",
    roleInMission: "Intimate dinner anchor",
    sourceUrl: "https://www.kissatanto.com/",
    contactPathType: "direct_email",
    contactPath: "hello@kissatanto.com",
    contactSourceUrl: "https://www.kissatanto.com/",
    contactConfidence: "high",
    contactResearchNote:
      "Official site lists hello@kissatanto.com and Tock for reservations.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 94,
    routeAngle: "Chinatown intimate dinner route",
    riskNotes:
      "Confirm current hours, reservation path, and any accolade language before a private preview leaves local mode.",
  },
  {
    id: "candidate-labattoir",
    name: "L'Abattoir",
    segment: "Restaurant and bar",
    roleInMission: "Gastown dinner or bar anchor",
    sourceUrl: "https://www.labattoir.ca/",
    contactPathType: "private_events_form",
    contactPath: "Official private dining event request form; fallback info@labattoir.ca",
    contactSourceUrl: "https://www.labattoir.ca/private-dining",
    contactConfidence: "high",
    contactResearchNote:
      "Official private dining page points to an event request form and footer lists info@labattoir.ca.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 92,
    routeAngle: "Gastown candlelit route",
    riskNotes:
      "Use only neutral route fit language until business details, media rights, and source wording are approved.",
  },
  {
    id: "candidate-botanist",
    name: "Botanist",
    segment: "Restaurant and cocktail bar",
    roleInMission: "Dinner plus cocktail route",
    sourceUrl: "https://www.botanistrestaurant.com/",
    contactPathType: "private_events_form",
    contactPath:
      "Official private dining enquire form; fallback info@botanistrestaurant.com",
    contactSourceUrl: "https://www.botanistrestaurant.com/private-dining/",
    contactConfidence: "high",
    contactResearchNote:
      "Official private dining page has Enquire links; contact page lists info@botanistrestaurant.com.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 91,
    routeAngle: "Dinner and cocktail route",
    riskNotes:
      "Avoid copying brand language and confirm current menus, bar details, and private dining claims.",
  },
  {
    id: "candidate-miku",
    name: "Miku Waterfront",
    segment: "Restaurant",
    roleInMission: "Waterfront dinner anchor",
    sourceUrl: "https://mikurestaurant.com/",
    contactPathType: "direct_email",
    contactPath: "info@mikurestaurant.com",
    contactSourceUrl: "https://mikurestaurant.com/contact/",
    contactConfidence: "high",
    contactResearchNote:
      "Official contact page lists info@mikurestaurant.com for inquiries and OpenTable for larger reservations.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 90,
    routeAngle: "Waterfront celebration route",
    riskNotes:
      "Confirm official booking policy, current location details, and permitted use of any waterfront imagery.",
  },
  {
    id: "candidate-thierry",
    name: "Thierry Chocolates",
    segment: "Dessert and cafe",
    roleInMission: "Dessert or late cafe closer",
    sourceUrl: "https://thierrychocolates.com/",
    contactPathType: "protected_email_link",
    contactPath:
      "Official site footer has a protected email link and location phone numbers; manually confirm before any send.",
    contactSourceUrl: "https://thierrychocolates.com/",
    contactConfidence: "medium",
    contactResearchNote:
      "Official site exposes a contact email link in protected form and lists location phone numbers.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 87,
    routeAngle: "Dessert closer route",
    riskNotes:
      "Confirm the specific location, hours, product availability, and whether the route references one location or the brand generally.",
  },
  {
    id: "candidate-keefer-bar",
    name: "The Keefer Bar",
    segment: "Cocktail bar",
    roleInMission: "Cocktail closer",
    sourceUrl: "https://thekeeferbar.com/",
    contactPathType: "protected_email_link",
    contactPath:
      "Official contact page has a protected email link and phone number; manually confirm before any send.",
    contactSourceUrl: "https://thekeeferbar.com/contact/",
    contactConfidence: "medium",
    contactResearchNote:
      "Official contact page lists address, protected email link, and phone.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 86,
    routeAngle: "Cocktail closer route",
    riskNotes:
      "Alcohol-related copy needs responsible wording, age restrictions, and no implied endorsement before approval.",
  },
  {
    id: "candidate-granville-island-market",
    name: "Granville Island Public Market",
    segment: "Market and experience",
    roleInMission: "Daytime-to-evening activity bridge",
    sourceUrl: "https://granvilleisland.com/public-market",
    contactPathType: "contact_page",
    contactPath:
      "Official Granville Island contact page and admin/event-booking paths; manually choose public-market or event route before any send.",
    contactSourceUrl: "https://granvilleisland.com/contact",
    contactConfidence: "medium",
    contactResearchNote:
      "Official page lists contact details and points event bookings/leasing to the Granville Island admin site.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 82,
    routeAngle: "Low-pressure market date route",
    riskNotes:
      "Confirm hours close to publish date and avoid implying individual vendor participation.",
  },
  {
    id: "candidate-vancouver-art-gallery",
    name: "Vancouver Art Gallery",
    segment: "Culture",
    roleInMission: "Cultural starter or rainy-day date",
    sourceUrl: "https://www.vanartgallery.bc.ca/",
    contactPathType: "direct_email",
    contactPath:
      "marketing@vanartgallery.bc.ca for marketing route fit; learn@vanartgallery.bc.ca for group bookings",
    contactSourceUrl: "https://www.vanartgallery.bc.ca/contact-us/",
    contactConfidence: "high",
    contactResearchNote:
      "Official contact page lists department emails including marketing and group bookings.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 80,
    routeAngle: "Culture-first date route",
    riskNotes:
      "Current exhibitions, ticketing, and hours must be checked close to any private or public preview.",
  },
  {
    id: "candidate-flyover-vancouver",
    name: "Flyover Vancouver",
    segment: "Attraction",
    roleInMission: "Visitor-friendly experience add-on",
    sourceUrl: "https://www.experienceflyover.com/vancouver/",
    contactPathType: "contact_page",
    contactPath:
      "Official contact page and structured data list info@experienceflyover.com and +1-866-498-2023; manually confirm the best partnership or group contact before any send.",
    contactSourceUrl: "https://www.experienceflyover.com/vancouver/contact-us/",
    contactConfidence: "medium",
    contactResearchNote:
      "Official contact page metadata describes a contact form, and official structured data lists a customer-service email and phone. Treat as general contact until a partnership-specific path is confirmed.",
    lastContactResearchAt: "2026-06-14",
    fitScore: 78,
    routeAngle: "Visitor wow-date route",
    riskNotes:
      "Confirm show schedule, pricing, accessibility, and availability before any route claim.",
  },
];

const rankedProspects = [...candidates].sort((a, b) => b.fitScore - a.fitScore);
const sentManualIds = new Set([
  "candidate-published-on-main",
  "candidate-kissa-tanto",
  "candidate-labattoir",
  "candidate-botanist",
  "candidate-miku",
  "candidate-vancouver-art-gallery",
]);
const sentManualCount = rankedProspects.filter((candidate) =>
  sentManualIds.has(candidate.id),
).length;
const primarySalesTargets = rankedProspects.filter((candidate) => candidate.fitScore >= 86);
const contentDepthTargets = rankedProspects.filter((candidate) => candidate.fitScore < 86);
const contactReadyTargets = rankedProspects.filter(
  (candidate) => candidate.contactConfidence !== "low",
);
const highConfidenceContactTargets = rankedProspects.filter(
  (candidate) => candidate.contactConfidence === "high",
);

function confidenceWeight(confidence) {
  if (confidence === "high") return 18;
  if (confidence === "medium") return 10;
  return 0;
}

function segmentWeight(segment) {
  if (/restaurant/i.test(segment)) return 6;
  if (/dessert|cafe/i.test(segment)) return 4;
  if (/cocktail|bar/i.test(segment)) return 3;
  if (/culture|gallery/i.test(segment)) return 2;
  if (/market/i.test(segment)) return 1;
  return 0;
}

function contactPenalty(candidate) {
  let penalty = 0;
  if (candidate.contactConfidence === "low") penalty += 18;
  if (candidate.contactPathType === "protected_email_link") penalty += 4;
  if (candidate.contactPathType === "contact_page") penalty += 5;
  if (candidate.contactPathType === "needs_manual_lookup") penalty += 12;
  return penalty;
}

function shadowRole(candidate, shadowScore) {
  if (candidate.contactConfidence === "low") return "blocked_manual_lookup";
  if (shadowScore >= 88 && candidate.contactConfidence === "high") {
    return "primary_manual_send";
  }
  if (shadowScore >= 65) return "manual_confirm_then_send";
  return "backup_no_send";
}

const shadowDecisions = rankedProspects
  .map((candidate) => {
    const shadowScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          candidate.fitScore * 0.72 +
            confidenceWeight(candidate.contactConfidence) +
            segmentWeight(candidate.segment) -
            contactPenalty(candidate),
        ),
      ),
    );
    const role = shadowRole(candidate, shadowScore);
    const reasonParts = [
      `${candidate.fitScore} fit`,
      `${candidate.contactConfidence} contact confidence`,
      candidate.routeAngle,
    ];
    if (candidate.contactPathType === "contact_page") {
      reasonParts.push("general contact path needs a final human check");
    }
    if (candidate.contactPathType === "protected_email_link") {
      reasonParts.push("protected email link needs manual confirmation");
    }
    return {
      candidateId: candidate.id,
      name: candidate.name,
      segment: candidate.segment,
      routeAngle: candidate.routeAngle,
      fitScore: candidate.fitScore,
      contactConfidence: candidate.contactConfidence,
      contactPathType: candidate.contactPathType,
      contactPath: candidate.contactPath,
      sourceUrl: candidate.sourceUrl,
      shadowScore,
      role,
      reason: reasonParts.join("; "),
      gate:
        sentManualIds.has(candidate.id)
          ? "Already sent manually; wait for a reply, bounce, or owner-approved follow-up decision."
          : role === "blocked_manual_lookup"
          ? "Do not send until the exact official contact path is verified."
          : "Owner must approve exact recipient, channel, copy, and logging workflow before any send.",
    };
  })
  .sort((a, b) => b.shadowScore - a.shadowScore || b.fitScore - a.fitScore);

const shadowOutreachRanking = {
  generatedAt: new Date().toISOString(),
  status: sentManualCount > 0 ? "post_send_monitoring_shadow_mode" : "shadow_mode_no_send",
  product: "CityAtlas",
  owner: "Univenture Studio",
  proofSprint: "Vancouver Date Night",
  summary: {
    prospects: shadowDecisions.length,
    primaryManualSend: shadowDecisions.filter(
      (decision) => decision.role === "primary_manual_send",
    ).length,
    manualConfirmThenSend: shadowDecisions.filter(
      (decision) => decision.role === "manual_confirm_then_send",
    ).length,
    backupNoSend: shadowDecisions.filter((decision) => decision.role === "backup_no_send")
      .length,
    blockedManualLookup: shadowDecisions.filter(
      (decision) => decision.role === "blocked_manual_lookup",
    ).length,
  },
  scoringModel:
    "Fit score weighted by route fit, official contact confidence, segment fit, and contact-path risk. This is a review aid only.",
  decisions: shadowDecisions,
  recommendedOwnerAction:
    sentManualCount > 0
      ? "Monitor the first manual batch, log every outcome, and use this ranking only for held rows or a future separately approved follow-up decision."
      : "Approve a manual-only first batch from the primary and confirm-first rows after exact contact, sender, channel, copy, and reply logging are approved. No automated sending is approved by this ranking.",
};

const packet = {
  generatedAt: new Date().toISOString(),
  status: sentManualCount > 0 ? "sent_manual_first_batch" : "review_only_no_send",
  product: "CityAtlas",
  owner: "Univenture Studio",
  proofSprint: "Vancouver Date Night",
  targetMetric:
    "Meaningful replies, private demo requests, or warm-intro opportunities from 10 owner-reviewed prospects.",
  noSendFlags: {
    automatedSending: false,
    emailProviderConnected: false,
    crmSyncConnected: false,
    approvedForSend: false,
    paymentAskIncluded: false,
    manualSendsLogged: sentManualCount,
  },
  approvalRequired: [
    "Approve exact recipient list.",
    "Approve exact sender account and channel.",
    "Approve final first-touch copy.",
    "Approve private-preview link or screen-share mode.",
    "Approve reply logging workflow.",
  ],
  rankedProspects,
  primarySalesTargets: primarySalesTargets.map((candidate) => candidate.id),
  contentDepthTargets: contentDepthTargets.map((candidate) => candidate.id),
  contactReadiness: {
    researched: rankedProspects.length,
    contactReady: contactReadyTargets.length,
    highConfidence: highConfidenceContactTargets.length,
    lowConfidence: rankedProspects.length - contactReadyTargets.length,
  },
  recommendedManualSequence: [
    "Verify each official source URL and contact path.",
    "Remove any prospect where the correct business contact is unclear.",
    "Use the first-touch template only after owner copy approval.",
    "Send manually to no more than 10 approved recipients.",
    "Log every reply, no-reply, referral, objection, and private-preview request in /admin.",
    "Run a Brain summary after 10 outcomes or 5 meaningful replies.",
  ],
  firstTouchTemplate: {
    subject: "Private CityAtlas date-night preview for {business_name}",
    body:
      "Hi {first_name}, I am building CityAtlas under Univenture Studio as a Vancouver-first guide for saveable local routes. {business_name} looked like a possible fit for a {route_angle}. Nothing is public, paid, or automated yet. Would you be open to seeing a short private preview before we decide whether this becomes a real partner package?",
  },
};

const sendWindow = {
  generatedAt: packet.generatedAt,
  status: sentManualCount > 0 ? "sent_manual_first_batch" : "approval_required_no_send",
  publicReviewUrl: "https://city.univenturestudio.com/",
  privatePreviewMode:
    "Use localhost screen-share or a separately protected preview only. Do not send the hosted private-preview route while hosted private-preview access is disabled.",
  batchSize: rankedProspects.length,
  senderDecision:
    sentManualCount > 0
      ? "First direct-email batch was sent manually from michael.yap.87@gmail.com after owner approval."
      : "Owner must choose exact sender account and channel before any outreach.",
  contactDecision:
    sentManualCount > 0
      ? "Only owner-approved direct-email rows were sent. Form, protected-email, contact-page, and backup rows remain held."
      : "Owner must verify the correct contact path for each recipient before any outreach.",
  approvalSentence:
    sentManualCount > 0
      ? "No additional approval is implied. New follow-ups, held rows, public preview links, payments, provider imports, or public claims require a new exact approval."
      : "Approved: manually send the CityAtlas Date Night proof sprint to the 10 listed recipients using the exact first-touch copy below, from the approved sender/channel, and log every outcome in /admin. No automated sending, payments, provider imports, or public claims are approved.",
  firstTouchTemplate: packet.firstTouchTemplate,
  recipients: rankedProspects.map((candidate, index) => ({
    shadowRank:
      shadowDecisions.findIndex((decision) => decision.candidateId === candidate.id) + 1,
    shadowScore:
      shadowDecisions.find((decision) => decision.candidateId === candidate.id)?.shadowScore ?? 0,
    shadowRole:
      shadowDecisions.find((decision) => decision.candidateId === candidate.id)?.role ??
      "backup_no_send",
    rank: index + 1,
    candidateId: candidate.id,
    name: candidate.name,
    segment: candidate.segment,
    routeAngle: candidate.routeAngle,
    sourceUrl: candidate.sourceUrl,
    contactPath: candidate.contactPath,
    contactPathType: candidate.contactPathType,
    contactSourceUrl: candidate.contactSourceUrl,
    contactConfidence: candidate.contactConfidence,
    contactResearchNote: candidate.contactResearchNote,
    approvalStatus: sentManualIds.has(candidate.id)
      ? "owner_approved_manual_outreach"
      : "pending_owner_review",
    sendStatus: sentManualIds.has(candidate.id) ? "sent_manual" : "not_sent",
    requiredBeforeSend: sentManualIds.has(candidate.id)
      ? ["Wait for a reply, bounce, wrong-contact redirect, or concern before any follow-up."]
      : [
          "Verify current official source.",
          "Verify the correct contact path.",
          "Remove any unsupported claim from the first-touch note.",
          "Confirm the sender/channel is approved.",
        ],
  })),
  sendRules: [
    "Send manually only after owner approval.",
    "Send to no more than 10 recipients in this first batch.",
    "Do not mention payment, guaranteed traffic, rankings, awards, or unverified business facts.",
    "Do not attach scraped images or copied business copy.",
    "Stop the batch if any recipient raises a consent, privacy, or brand-use concern.",
  ],
  replyLearningLoop: {
    trigger:
      "After 10 outcomes, 5 meaningful replies, or one serious concern, pause sending and update the Brain.",
    fieldsToLog: [
      "candidate",
      "channel",
      "sent_at",
      "reply_at",
      "sentiment",
      "bounce",
      "objection",
      "private_preview_requested",
      "pricing_interest",
      "next_action",
      "notes",
    ],
    brainQuestions: [
      "Which segment responded best?",
      "Which route angle created the clearest curiosity?",
      "Which objection appeared more than once?",
      "Did anyone ask about price, traffic, audience, or setup time?",
      "Should the next wedge stay Date Night or split into another vertical?",
    ],
  },
};

const contactResearch = {
  generatedAt: packet.generatedAt,
  status: "read_only_research_no_send",
  researchedFromOfficialSources: true,
  sourcePolicy:
    "Use official business pages, contact pages, private-event pages, or official venue pages only. Do not scrape personal staff accounts or infer contacts from third-party directories.",
  summary: packet.contactReadiness,
  candidates: rankedProspects.map((candidate, index) => ({
    rank: index + 1,
    candidateId: candidate.id,
    name: candidate.name,
    fitScore: candidate.fitScore,
    contactPathType: candidate.contactPathType,
    contactPath: candidate.contactPath,
    contactSourceUrl: candidate.contactSourceUrl,
    contactConfidence: candidate.contactConfidence,
    contactResearchNote: candidate.contactResearchNote,
    lastContactResearchAt: candidate.lastContactResearchAt,
    recommendedAction:
      candidate.contactConfidence === "high"
        ? "Eligible for owner review in the first send window."
        : candidate.contactConfidence === "medium"
          ? "Keep in the packet, but manually confirm the exact contact before sending."
          : "Do not send until the exact contact path is manually verified.",
  })),
};

const revenueProofLoop = {
  generatedAt: packet.generatedAt,
  status: "measurement_ready_no_payment",
  experimentName: "Date Night first revenue proof loop",
  businessQuestion:
    "Will Vancouver date-night prospects show enough interest in a private CityAtlas preview and founding partner package to justify Stripe test-mode setup?",
  currentStage: sentManualCount > 0 ? "Post-send monitoring" : "Assisted automation",
  nextStage:
    "Reply and bounce learning before any follow-up, Stripe setup, or second manual batch.",
  control:
    "No customer-facing outreach; public package page only shows payment-disabled founding partner packages.",
  variant:
    sentManualCount > 0
      ? "Six owner-approved manual first-touch emails are sent; reply, bounce, and package-demand outcomes determine the next decision."
      : "Owner-approved manual first-touch to 10 contact-reviewed Date Night prospects, followed by reply logging and package-demand scoring.",
  audience:
    "Owner-reviewed restaurants, bars, dessert, culture, and experience operators in the Vancouver Date Night wedge.",
  primaryMetric:
    "2 to 3 qualified package or private-preview demand signals from 10 manually contacted prospects.",
  guardrailMetrics: [
    "No recipient confusion that payment or public listing is active.",
    "No brand-use, data-use, consent, or image-rights concern.",
    "No unsupported traffic, ranking, award, booking, or popularity claim.",
    "No automated sending, CRM sync, provider import, or Stripe action.",
  ],
  minimumEvidenceThreshold:
    "10 outcomes, 5 meaningful replies, or one serious risk concern, whichever happens first.",
  stopRule:
    "Pause immediately on any consent/privacy/brand-use concern, or after 10 outcomes without meaningful interest.",
  winnerRule:
    "Proceed to Stripe test-mode product setup only after 2 to 3 prospects ask for pricing, partnership details, hosted collaboration, or a next-step demo.",
  confidence: "No signal",
  ownerApprovalNeeded:
    sentManualCount > 0
      ? "New explicit approval before any follow-up, held-row send, Stripe action, provider import, or public claim."
      : "Exact recipients, exact contact paths, sender/channel, first-touch copy, and reply logging workflow before any customer message.",
  rollbackPath:
    "Do not send further messages; keep Stripe disabled; mark any problematic candidate blocked; update source policy and copy.",
  aiBrainLearningFields: [
    "segment",
    "route_angle",
    "contact_confidence",
    "channel",
    "sentiment",
    "objection",
    "private_preview_requested",
    "package_or_pricing_signal",
    "next_action",
  ],
};

mkdirSync(join(root, "output/proof-sprints"), { recursive: true });
mkdirSync(join(root, "output/revenue"), { recursive: true });
mkdirSync(join(root, "docs/proof-sprints"), { recursive: true });
mkdirSync(join(root, "docs/revenue"), { recursive: true });

writeFileSync(
  join(root, "output/proof-sprints/date-night-vancouver-10-prospect-packet.json"),
  `${JSON.stringify(packet, null, 2)}\n`,
);

writeFileSync(
  join(root, "output/proof-sprints/date-night-send-window-review.json"),
  `${JSON.stringify(sendWindow, null, 2)}\n`,
);

writeFileSync(
  join(root, "output/proof-sprints/date-night-contact-paths.json"),
  `${JSON.stringify(contactResearch, null, 2)}\n`,
);

writeFileSync(
  join(root, "output/proof-sprints/date-night-shadow-outreach-ranking.json"),
  `${JSON.stringify(shadowOutreachRanking, null, 2)}\n`,
);

writeFileSync(
  join(root, "output/revenue/date-night-revenue-proof-loop.json"),
  `${JSON.stringify(revenueProofLoop, null, 2)}\n`,
);

writeFileSync(
  join(root, "output/proof-sprints/date-night-reply-log-template.csv"),
  "candidate_id,candidate_name,contact_confidence,channel,sent_at,reply_at,sentiment,objection,private_preview_requested,package_or_pricing_signal,next_action,notes\n",
);

const rows = rankedProspects
  .map(
    (candidate, index) =>
      `| ${index + 1} | ${candidate.name} | ${candidate.segment} | ${candidate.fitScore} | ${candidate.routeAngle} | ${candidate.sourceUrl} | ${candidate.riskNotes} |`,
  )
  .join("\n");

writeFileSync(
  join(root, "docs/proof-sprints/DATE_NIGHT_10_PROSPECT_PACKET.md"),
  `# Date Night 10-Prospect Proof Sprint Packet\n\nGenerated: ${packet.generatedAt}\n\nStatus: \`${packet.status}\`\n\n## Goal\n\n${packet.targetMetric}\n\n## No-Send Flags\n\n- Automated sending: \`${packet.noSendFlags.automatedSending}\`\n- Email provider connected: \`${packet.noSendFlags.emailProviderConnected}\`\n- CRM sync connected: \`${packet.noSendFlags.crmSyncConnected}\`\n- Approved for send: \`${packet.noSendFlags.approvedForSend}\`\n- Payment ask included: \`${packet.noSendFlags.paymentAskIncluded}\`\n\n## Approval Required\n\n${packet.approvalRequired.map((item) => `- ${item}`).join("\n")}\n\n## Ranked Prospects\n\n| Rank | Business | Segment | Fit | Route angle | Source | Review note |\n| ---: | --- | --- | ---: | --- | --- | --- |\n${rows}\n\n## Recommended Manual Sequence\n\n${packet.recommendedManualSequence.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n## First-Touch Template\n\nSubject: ${packet.firstTouchTemplate.subject}\n\n${packet.firstTouchTemplate.body}\n\n## Recommended Next Brain Action\n\nAfter the first manual batch, log replies in \`/admin\` and compare actual responses against fit score, segment, and route angle. The Brain should then identify which wedge produced the clearest demand signal before Stripe activation.\n`,
);

const sendRows = sendWindow.recipients
  .map(
    (recipient) =>
      `| ${recipient.rank} | ${recipient.shadowRank} | ${recipient.name} | ${recipient.segment} | ${recipient.routeAngle} | ${recipient.sourceUrl} | ${recipient.contactConfidence} | ${recipient.shadowRole.replaceAll("_", " ")} | ${recipient.contactPath} | ${recipient.sendStatus} |`,
  )
  .join("\n");

const contactRows = contactResearch.candidates
  .map(
    (candidate) =>
      `| ${candidate.rank} | ${candidate.name} | ${candidate.fitScore} | ${candidate.contactConfidence} | ${candidate.contactPathType.replaceAll("_", " ")} | ${candidate.contactPath} | ${candidate.contactSourceUrl} | ${candidate.recommendedAction} |`,
  )
  .join("\n");

writeFileSync(
  join(root, "docs/proof-sprints/DATE_NIGHT_SEND_WINDOW_APPROVAL.md"),
  `# Date Night Send Window Approval\n\nGenerated: ${sendWindow.generatedAt}\n\nStatus: \`${sendWindow.status}\`\n\n## Launch-Safe Context\n\n- Public review URL: ${sendWindow.publicReviewUrl}\n- Private preview mode: ${sendWindow.privatePreviewMode}\n- Sender decision: ${sendWindow.senderDecision}\n- Contact decision: ${sendWindow.contactDecision}\n\n## Post-Send Boundary\n\nThis packet reflects the first manual proof sprint state. It does not approve follow-ups, held-row sends, public preview links, CRM sync, automated sequences, payment asks, provider imports, or public business claims.\n\n## Approval Sentence\n\n\`${sendWindow.approvalSentence}\`\n\n## Recipients To Review\n\n| Fit rank | Shadow rank | Business | Segment | Route angle | Source | Confidence | Shadow role | Contact path | Send status |\n| ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- |\n${sendRows}\n\n## First-Touch Copy For Record\n\nSubject: ${sendWindow.firstTouchTemplate.subject}\n\n${sendWindow.firstTouchTemplate.body}\n\n## Send Rules\n\n${sendWindow.sendRules.map((rule) => `- ${rule}`).join("\n")}\n\n## Reply Learning Loop\n\nTrigger: ${sendWindow.replyLearningLoop.trigger}\n\nFields to log:\n\n${sendWindow.replyLearningLoop.fieldsToLog.map((field) => `- ${field}`).join("\n")}\n\nBrain questions after the batch:\n\n${sendWindow.replyLearningLoop.brainQuestions.map((question) => `- ${question}`).join("\n")}\n\n## Files Generated\n\n- \`output/proof-sprints/date-night-send-window-review.json\`\n- \`output/proof-sprints/date-night-contact-paths.json\`\n- \`output/proof-sprints/date-night-shadow-outreach-ranking.json\`\n- \`output/proof-sprints/date-night-reply-log-template.csv\`\n`,
);

const shadowRows = shadowOutreachRanking.decisions
  .map(
    (decision, index) =>
      `| ${index + 1} | ${decision.name} | ${decision.shadowScore} | ${decision.role.replaceAll("_", " ")} | ${decision.contactConfidence} | ${decision.reason} | ${decision.gate} |`,
  )
  .join("\n");

writeFileSync(
  join(root, "docs/proof-sprints/DATE_NIGHT_SHADOW_OUTREACH_RANKING.md"),
  `# Date Night Shadow Outreach Ranking\n\nGenerated: ${shadowOutreachRanking.generatedAt}\n\nStatus: \`${shadowOutreachRanking.status}\`\n\n## What This Is\n\nThis is the Brain's dry-run send/no-send ordering for the Vancouver Date Night proof sprint. It is not a customer message, CRM import, email sequence, payment action, provider write, or outreach approval.\n\n## Summary\n\n- Prospects scored: ${shadowOutreachRanking.summary.prospects}\n- Primary manual-send candidates: ${shadowOutreachRanking.summary.primaryManualSend}\n- Confirm-first candidates: ${shadowOutreachRanking.summary.manualConfirmThenSend}\n- Backup/no-send candidates: ${shadowOutreachRanking.summary.backupNoSend}\n- Blocked manual lookups: ${shadowOutreachRanking.summary.blockedManualLookup}\n\n## Scoring Model\n\n${shadowOutreachRanking.scoringModel}\n\n## Shadow Ranking\n\n| Rank | Business | Shadow score | Role | Contact confidence | Reason | Gate |\n| ---: | --- | ---: | --- | --- | --- | --- |\n${shadowRows}\n\n## Recommended Owner Action\n\n${shadowOutreachRanking.recommendedOwnerAction}\n\n## Autonomy Boundary\n\nThe system may recommend a manual order. It must not send, follow up, sync, enrich, import, charge, publish, or expose a private preview without a separate exact approval.\n`,
);

writeFileSync(
  join(root, "docs/proof-sprints/DATE_NIGHT_CONTACT_PATHS_RESEARCH.md"),
  `# Date Night Contact Paths Research\n\nGenerated: ${contactResearch.generatedAt}\n\nStatus: \`${contactResearch.status}\`\n\n## Policy\n\n${contactResearch.sourcePolicy}\n\n## Summary\n\n- Prospects researched: ${contactResearch.summary.researched}\n- Contact-ready prospects: ${contactResearch.summary.contactReady}\n- High-confidence contacts: ${contactResearch.summary.highConfidence}\n- Low-confidence contacts: ${contactResearch.summary.lowConfidence}\n\n## Contact Paths\n\n| Rank | Business | Fit | Confidence | Type | Contact path | Source | Recommended action |\n| ---: | --- | ---: | --- | --- | --- | --- | --- |\n${contactRows}\n\n## Approval Boundary\n\nThis research does not approve outreach. Before sending, the owner must approve the exact recipient, exact contact path, sender account, channel, copy, and logging workflow.\n`,
);

writeFileSync(
  join(root, "docs/revenue/DATE_NIGHT_REVENUE_PROOF_LOOP.md"),
  `# Date Night Revenue Proof Loop\n\nGenerated: ${revenueProofLoop.generatedAt}\n\nStatus: \`${revenueProofLoop.status}\`\n\n## Business Question\n\n${revenueProofLoop.businessQuestion}\n\n## Current Autonomy Stage\n\n- Current: ${revenueProofLoop.currentStage}\n- Next: ${revenueProofLoop.nextStage}\n\n## Experiment Plan\n\n- Control: ${revenueProofLoop.control}\n- Variant: ${revenueProofLoop.variant}\n- Audience: ${revenueProofLoop.audience}\n- Primary metric: ${revenueProofLoop.primaryMetric}\n- Minimum evidence threshold: ${revenueProofLoop.minimumEvidenceThreshold}\n- Stop rule: ${revenueProofLoop.stopRule}\n- Winner rule: ${revenueProofLoop.winnerRule}\n- Confidence: ${revenueProofLoop.confidence}\n\n## Guardrails\n\n${revenueProofLoop.guardrailMetrics.map((metric) => `- ${metric}`).join("\n")}\n\n## AI Brain Learning Fields\n\n${revenueProofLoop.aiBrainLearningFields.map((field) => `- ${field}`).join("\n")}\n\n## Approval Needed Before Live Action\n\n${revenueProofLoop.ownerApprovalNeeded}\n\n## Rollback\n\n${revenueProofLoop.rollbackPath}\n\n## Next Step\n\nMonitor the first manual batch, log every reply or bounce, then run \`npm run replies:analyze\`. Stripe stays disabled until the winner rule is met and a separate Stripe approval is given.\n`,
);

console.log("Built proof sprint packet:");
console.log("- docs/proof-sprints/DATE_NIGHT_10_PROSPECT_PACKET.md");
console.log("- docs/proof-sprints/DATE_NIGHT_SEND_WINDOW_APPROVAL.md");
console.log("- docs/proof-sprints/DATE_NIGHT_CONTACT_PATHS_RESEARCH.md");
console.log("- docs/proof-sprints/DATE_NIGHT_SHADOW_OUTREACH_RANKING.md");
console.log("- docs/revenue/DATE_NIGHT_REVENUE_PROOF_LOOP.md");
console.log("- output/proof-sprints/date-night-vancouver-10-prospect-packet.json");
console.log("- output/proof-sprints/date-night-send-window-review.json");
console.log("- output/proof-sprints/date-night-contact-paths.json");
console.log("- output/proof-sprints/date-night-shadow-outreach-ranking.json");
console.log("- output/proof-sprints/date-night-reply-log-template.csv");
console.log("- output/revenue/date-night-revenue-proof-loop.json");
