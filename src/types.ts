export type TrustLevel =
  | "verified_by_admin"
  | "business_submitted"
  | "user_submitted"
  | "fictional_seed"
  | "ai_assisted"
  | "unverified_draft";

export type ContentStatus =
  | "draft"
  | "needs_review"
  | "approved"
  | "published";

export type LaunchGateStatus = "locked" | "ready_for_review" | "approved";

export type PackageId =
  | "community"
  | "city_partner"
  | "signature_partner";

export interface SourceRecord {
  id: string;
  label: string;
  type: "founder_review" | "business_submission" | "public_link" | "demo_seed";
  url?: string;
  verified: boolean;
  notes: string;
  updatedAt: string;
}

export interface AuditFields {
  status: ContentStatus;
  trustLevel: TrustLevel;
  sourceIds: string[];
  aiAssisted: boolean;
  reviewRequired: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Business extends AuditFields {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategories: string[];
  neighborhood: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  bookingUrl: string;
  heroImage: string;
  gallery: string[];
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  bestFor: string[];
  priceTier?: "$" | "$$" | "$$$" | "$$$$";
  rating?: number;
  reviewCount?: number;
  openNow?: boolean;
  hoursToday?: string;
  featured: boolean;
  claimedStatus: "unclaimed" | "claim_pending" | "claimed";
  partnerFitScore: number;
  visibilityScore: number;
  pageReadiness: {
    profile: boolean;
    media: boolean;
    categories: boolean;
    description: boolean;
    offer: boolean;
  };
}

export interface EventItem extends AuditFields {
  id: string;
  title: string;
  slug: string;
  category: string;
  neighborhood: string;
  venue: string;
  date: string;
  time: string;
  priceLabel: string;
  capacity: number;
  image: string;
  description: string;
  safetyNotes: string;
  rsvps: number;
}

export interface Offer extends AuditFields {
  id: string;
  businessId?: string;
  previewBusinessId?: string;
  title: string;
  description: string;
  redemptionInstructions: string;
  endDate: string;
  claimCount: number;
  maxClaims: number;
  featured: boolean;
}

export interface Guide extends AuditFields {
  id: string;
  title: string;
  slug: string;
  citySlug?: string;
  cityName?: string;
  regionName?: string;
  queryClass: string;
  cluster: string;
  category: string;
  neighborhood: string;
  excerpt: string;
  body: string;
  summary: string;
  audience: string;
  promise: string;
  image: string;
  readMinutes: number;
  lastReviewed: string;
  bestFor: string[];
  heroQuestion: string;
  intro: string;
  sections: {
    heading: string;
    answer: string;
    bullets: string[];
  }[];
  resourceLinks?: {
    title: string;
    path: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  proofNote: string;
  proofSource: string;
  gateDecision: "draft_only" | "needs_real_sources" | "ready_for_review";
  sourceBackedCollection?: SourceBackedPlaceReference["collection"];
  internalLinkTarget: string;
  ctaLabel: string;
  ctaPath: string;
  relatedBusinessIds: string[];
  relatedEventIds: string[];
  sponsored: boolean;
}

export interface InternalResourceLink {
  title: string;
  path: string;
  description: string;
}

export interface SourceBackedPlaceReference {
  id: string;
  slug: string;
  collection:
    | "vancouver_date_night_starters"
    | "vancouver_rainy_day_starters"
    | "vancouver_first_evening_starters"
    | "vancouver_first_time_visitor_starters"
    | "toronto_first_time_visitor_starters"
    | "toronto_weekend_route_starters"
    | "vancouver_garden_day_starters"
    | "vancouver_kitsilano_scenic_starters"
    | "vancouver_west_side_daytime_starters"
    | "vancouver_false_creek_culture_starters"
    | "vancouver_ubc_discovery_starters"
    | "vancouver_returning_visitor_starters"
    | "vancouver_out_of_town_guest_starters"
    | "vancouver_weekend_route_starters"
    | "vancouver_sunday_starters"
    | "vancouver_wellness_reset_starters";
  name: string;
  category: string;
  neighborhood: string;
  routeRole: string;
  summary: string;
  whyItFits: string;
  bestFor: string[];
  officialSourceLabel: string;
  officialSourceUrl: string;
  sourceOwner: string;
  sourceCheckedAt: string;
  reviewStatus: "official_source_checked";
  verifiedFacts: string[];
  claimBoundaries: string[];
  correctionPath: string;
  featured: boolean;
}

export interface CityMissionStep {
  label: string;
  itemType: SavedItem["itemType"];
  itemId: string;
  time: string;
  neighborhood: string;
  note: string;
}

export interface CityMission extends AuditFields {
  id: string;
  title: string;
  slug: string;
  theme: string;
  audience: string;
  timeBox: string;
  hook: string;
  routeSummary: string;
  steps: CityMissionStep[];
  reward: string;
  sharePrompt: string;
  sponsorAngle: string;
  featured: boolean;
}

export interface PartnerPackage {
  id: PackageId;
  name: string;
  priceLabel: string;
  paymentState: "disabled_until_launch_approval";
  description: string;
  features: string[];
  bestFor: string;
  highlighted: boolean;
}

export interface BusinessSubmission {
  id: string;
  businessName: string;
  category: string;
  neighborhood: string;
  contactName: string;
  email: string;
  website: string;
  message: string;
  packageInterest?: PackageId;
  status: "local_capture" | "review_queue";
  createdAt: string;
}

export interface NewsletterLead {
  id: string;
  email: string;
  interest: "local_discovery" | "business_updates" | "creator_updates";
  referralCode: string;
  createdAt: string;
}

export interface SavedItem {
  id: string;
  itemType: "business" | "event" | "guide" | "offer";
  itemId: string;
  label: string;
  createdAt: string;
}

export interface GrowthEvent {
  id: string;
  name: string;
  path: string;
  detail: Record<string, string | number | boolean>;
  createdAt: string;
}

export interface RevenueExperiment {
  id: string;
  name: string;
  hypothesis: string;
  control: string;
  variant: string;
  primaryMetric: string;
  guardrailMetric: string;
  status: "planned" | "draft" | "ready_for_review" | "running_local" | "paused";
  ownerApprovalRequired: boolean;
}

export interface GrowthPlay {
  id: string;
  title: string;
  sourcePattern: string;
  whyItMatters: string;
  implementation: string;
  metric: string;
  status: "implemented_local" | "ready_for_review" | "planned" | "blocked_by_live_gate";
  ownerGate: string;
}

export interface CityRolloutTarget {
  id: string;
  cityKey: string;
  cityName: string;
  country: string;
  phase: "proof_city" | "next_wave" | "expansion_wave" | "later_global_wave";
  launchStatus: "active_proof" | "build_queue" | "research_queue";
  sharedPattern: "shared_with_roam" | "shared_with_rooms" | "shared_with_roam_and_rooms";
  minimumPreparedBusinesses: number;
  minimumPartnerCandidates: number;
  minimumContactReadyBusinesses: number;
  minimumSourceBackedCollections: number;
  wedge: string;
  rationale: string;
  neighborhoods: string[];
  unlockChecklist: string[];
}

export interface BusinessProspect {
  id: string;
  cityKey: string;
  cityName: string;
  businessName: string;
  slug: string;
  neighborhood: string;
  category: string;
  segment: string;
  sourceType: "source_backed_place" | "proof_candidate" | "manual_import" | "manual_submission";
  sourceCollection?: SourceBackedPlaceReference["collection"];
  sourceLabel: string;
  sourceUrl: string;
  website: string;
  contactName: string;
  email: string;
  contactPath: string;
  contactPathType:
    | "direct_email"
    | "phone_or_text"
    | "contact_page"
    | "reservation_platform"
    | "private_events_form"
    | "protected_email_link"
    | "official_site"
    | "instagram_dm"
    | "warm_intro"
    | "needs_manual_lookup";
  contactConfidence: "high" | "medium" | "low";
  contactReadiness: "email_ready" | "contact_path_ready" | "needs_research";
  outreachStatus:
    | "not_started"
    | "draft_ready"
    | "held"
    | "approved_to_send"
    | "sent_manual"
    | "replied"
    | "do_not_contact";
  approvalStatus: "review_only" | "ready_for_owner_review" | "owner_approved" | "blocked";
  sourceProof: string;
  relationshipWarmth: "high" | "medium" | "low" | "unknown";
  notes: string;
  collectionIds: string[];
  supervisedSendStatus?:
    | "Not prepared"
    | "Packet prepared"
    | "Dry run prepared"
    | "Blocked"
    | "Error"
    | "Sent via provider"
    | "Delivered"
    | "Bounced"
    | "Complaint";
  supervisedSendMode?: "blocked" | "dry_run" | "live";
  supervisedSendNote?: string;
  supervisedSendPreparedAt?: string;
  supervisedSendRequestId?: string;
  supervisedSendProviderMessageId?: string;
  supervisedAllowlistStatus?: "Not allowlisted" | "Allowlisted" | "Removed";
  supervisedAllowlistedAt?: string;
  supervisedAllowlistNote?: string;
  supervisedLiveReviewStatus?: "Not requested" | "Ready for approval" | "Blocked by policy";
  supervisedLiveReviewRequestedAt?: string;
  importBatchId?: string;
  lastUpdatedAt: string;
}

export interface ProofCandidate {
  id: string;
  proofSprintId: string;
  name: string;
  segment: string;
  roleInMission: string;
  sourceUrl: string;
  sourceStatus: "official_source_saved" | "needs_secondary_source" | "business_confirmed";
  fitScore: number;
  routeAngle: string;
  outreachStatus:
    | "not_started"
    | "draft_ready"
    | "approved_to_send"
    | "sent_manual"
    | "replied"
    | "not_fit";
  approvalStatus:
    | "review_only"
    | "owner_approved_private_preview"
    | "owner_approved_manual_outreach"
    | "blocked";
  contactPathType:
    | "direct_email"
    | "contact_page"
    | "private_events_form"
    | "reservation_platform"
    | "protected_email_link"
    | "needs_manual_lookup";
  contactPath: string;
  contactSourceUrl: string;
  contactConfidence: "high" | "medium" | "low";
  contactResearchNote: string;
  lastContactResearchAt: string;
  riskNotes: string;
  nextStep: string;
}

export interface ManualReplyLog {
  id: string;
  candidateId: string;
  candidateName: string;
  channel: "instagram_dm" | "email" | "warm_intro" | "in_person" | "other";
  sentiment:
    | "positive_demo"
    | "positive_info"
    | "neutral"
    | "wrong_contact"
    | "bounce"
    | "not_now"
    | "no_interest"
    | "concern";
  messageVersion: string;
  summary: string;
  nextStep: string;
  createdAt: string;
}

export interface BusinessInboundMirrorEntry {
  id: string;
  schemaVersion: string;
  fingerprint: string;
  sourceRail: "Resend";
  sourceType: string;
  messageId: string;
  threadId: string;
  email: string;
  name: string;
  subject: string;
  replyText: string;
  receivedAt: string;
  mailbox: string;
  labels: string[];
  payloadStatus: "Valid" | "Needs identity" | "Invalid";
  protectedIngestionStatus: "Ready" | "Hold";
  replyQualificationStatus: "Ready" | "Hold";
  identityMissing: string[];
  matchedProspectId?: string;
  matchedBusinessName?: string;
  nextSafeAction: string;
  protectedReason: string;
  qualificationReason: string;
  mirroredAt: string;
}

export interface BusinessReplyBridgeReplayRecord {
  id: string;
  schemaVersion: string;
  fingerprint: string;
  sourceRail: "Resend";
  sourceType: string;
  messageId: string;
  threadId: string;
  prospectId?: string;
  businessName?: string;
  status: "Replayed";
  detail: string;
  replayedAt: string;
}

export interface BusinessReplyLog {
  id: string;
  prospectId: string;
  businessName: string;
  channel: "email" | "contact_form" | "phone_or_text" | "warm_intro" | "other";
  sentiment:
    | "positive_interest"
    | "positive_info"
    | "neutral"
    | "wrong_contact"
    | "bounce"
    | "not_now"
    | "no_interest"
    | "concern";
  messageVersion: string;
  summary: string;
  replyText: string;
  nextStep: string;
  source: "manual_entry" | "resend_preview_bridge";
  sourceRail: "Resend" | "Gmail" | "Manual";
  sourceType: string;
  messageId: string;
  threadId: string;
  receivedAt: string;
  createdAt: string;
}

export interface BrainRun {
  id: string;
  stage: string;
  summary: string;
  topRecommendation: string;
  topGate: string;
  openGaps: number;
  averageProgress: number;
  createdAt: string;
}

export interface ProofSprint {
  id: string;
  name: string;
  wedge: string;
  status:
    | "research_packet_ready"
    | "owner_review"
    | "ready_for_private_demo"
    | "blocked_by_live_gate";
  thesis: string;
  targetBuyer: string;
  firstMission: string;
  safeAssets: string[];
  approvalRequired: string[];
  primaryMetric: string;
  nextAction: string;
}

export interface LaunchGate {
  id: string;
  title: string;
  status: LaunchGateStatus;
  risk: "business" | "legal" | "provider" | "payment" | "customer" | "data";
  ownerDecision: string;
  notes: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  createdAt: string;
}

export interface CityAtlasData {
  sources: SourceRecord[];
  businesses: Business[];
  events: EventItem[];
  offers: Offer[];
  guides: Guide[];
  sourceBackedPlaces: SourceBackedPlaceReference[];
  cityRolloutTargets: CityRolloutTarget[];
  cityMissions: CityMission[];
  packages: PartnerPackage[];
  launchGates: LaunchGate[];
  submissions: BusinessSubmission[];
  newsletterLeads: NewsletterLead[];
  savedItems: SavedItem[];
  growthEvents: GrowthEvent[];
  revenueExperiments: RevenueExperiment[];
  growthPlays: GrowthPlay[];
  proofSprints: ProofSprint[];
  proofCandidates: ProofCandidate[];
  businessProspects: BusinessProspect[];
  manualReplyLogs: ManualReplyLog[];
  businessInboundMirror: BusinessInboundMirrorEntry[];
  businessReplyBridgeReplays: BusinessReplyBridgeReplayRecord[];
  businessReplyLogs: BusinessReplyLog[];
  brainRuns: BrainRun[];
  auditLogs: AuditLog[];
}
