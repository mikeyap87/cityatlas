import { useEffect, useMemo, useState } from "react";
import type {
  BusinessInboundMirrorEntry,
  BusinessProspect,
  BusinessReplyLog,
  BusinessSubmission,
  CityMission,
  CityAtlasData,
  ManualReplyLog,
  MissionFeedbackType,
  MissionStepStatus,
  NewsletterLead,
  PackageId,
  SavedItem,
  TravelMode,
} from "../types";
import { canRenderAdminExperience } from "../config/site";
import {
  audit,
  createBrainRun,
  createBusinessProspectAuditSummary,
  createBusinessReplyBridgeReplayRecord,
  createBusinessReplyLog,
  createEmptyCityAtlasData,
  createBusinessSubmission,
  createGrowthEvent,
  createMissionPlan,
  createManualReplyLog,
  createNewsletterLead,
  createSavedItem,
  loadCityAtlasData,
  loadCityAtlasGrowthData,
  resetCityAtlasData,
  saveCityAtlasData,
} from "../lib/storage";
import { getTrafficContext, trackProductEvent, type TrackProductEventOptions } from "../lib/analytics";

function shouldLoadGrowthData(pathname: string) {
  return pathname === "/admin" && canRenderAdminExperience();
}

function mergeBusinessProspects(
  existing: BusinessProspect[],
  incoming: BusinessProspect[],
) {
  const byId = new Map(existing.map((prospect) => [prospect.id, prospect]));

  for (const prospect of incoming) {
    const current = byId.get(prospect.id);
    if (!current) {
      byId.set(prospect.id, prospect);
      continue;
    }

    const currentUpdatedAt = Date.parse(current.lastUpdatedAt || "");
    const incomingUpdatedAt = Date.parse(prospect.lastUpdatedAt || "");
    byId.set(
      prospect.id,
      Number.isFinite(incomingUpdatedAt) && incomingUpdatedAt >= currentUpdatedAt
        ? { ...current, ...prospect }
        : current,
    );
  }

  return Array.from(byId.values()).sort((left, right) => {
    const leftUpdatedAt = Date.parse(left.lastUpdatedAt || "");
    const rightUpdatedAt = Date.parse(right.lastUpdatedAt || "");
    return rightUpdatedAt - leftUpdatedAt || left.businessName.localeCompare(right.businessName);
  });
}

function mergeInboundMirrorEntries(
  existing: BusinessInboundMirrorEntry[],
  incoming: BusinessInboundMirrorEntry[],
) {
  const byFingerprint = new Map<string, BusinessInboundMirrorEntry>();

  for (const entry of [...incoming, ...existing]) {
    if (!byFingerprint.has(entry.fingerprint)) {
      byFingerprint.set(entry.fingerprint, entry);
    }
  }

  return Array.from(byFingerprint.values()).sort((left, right) => {
    return Date.parse(right.receivedAt || "") - Date.parse(left.receivedAt || "");
  });
}

function inferBusinessProspectOutreachStatus(sentiment: BusinessReplyLog["sentiment"]) {
  switch (sentiment) {
    case "bounce":
    case "wrong_contact":
      return "held" as const;
    case "no_interest":
      return "do_not_contact" as const;
    default:
      return "replied" as const;
  }
}

function buildBusinessReplyLogDraftFromMirrorEntry(entry: BusinessInboundMirrorEntry) {
  if (!entry.matchedProspectId) {
    return undefined;
  }

  const lowerReply = entry.replyText.toLowerCase();
  const sentiment: BusinessReplyLog["sentiment"] =
    /bounce|undeliverable|delivery[ -]?status/i.test(lowerReply)
      ? "bounce"
      : /wrong contact|not the right person/i.test(lowerReply)
        ? "wrong_contact"
        : /not interested|no thanks|pass/i.test(lowerReply)
          ? "no_interest"
          : /later|not now|circle back/i.test(lowerReply)
            ? "not_now"
            : /price|pricing|rate|cost|package/i.test(lowerReply)
              ? "positive_info"
              : /yes|interested|sounds good|let's/i.test(lowerReply)
                ? "positive_interest"
                : "neutral";

  return {
    prospectId: entry.matchedProspectId,
    businessName: entry.matchedBusinessName || entry.name || entry.email,
    channel: "email" as const,
    sentiment,
    messageVersion: "mirror-replay-local",
    summary: entry.replyText.slice(0, 280) || "Local reply replay.",
    replyText: entry.replyText,
    nextStep: sentiment === "positive_interest" ? "Review and follow up manually." : "Review manually.",
    source: "resend_preview_bridge" as const,
    sourceRail: "Resend" as const,
    sourceType: entry.sourceType,
    messageId: entry.messageId,
    threadId: entry.threadId,
    receivedAt: entry.receivedAt,
  };
}

function buildBusinessReplyBridgeReplayDraft(entry: BusinessInboundMirrorEntry) {
  return {
    schemaVersion: entry.schemaVersion,
    fingerprint: entry.fingerprint,
    sourceRail: entry.sourceRail,
    sourceType: entry.sourceType,
    messageId: entry.messageId,
    threadId: entry.threadId,
    prospectId: entry.matchedProspectId,
    businessName: entry.matchedBusinessName || entry.name || entry.email,
    status: "Replayed" as const,
    detail: "Replayed into local CityAtlas reply memory.",
    replayedAt: new Date().toISOString(),
  };
}

export function useCityAtlasStore(pathname: string) {
  const [data, setData] = useState<CityAtlasData>(() => createEmptyCityAtlasData());
  const [hydrated, setHydrated] = useState(false);
  const [growthHydrated, setGrowthHydrated] = useState(() => !shouldLoadGrowthData(pathname));

  useEffect(() => {
    let cancelled = false;
    const includeGrowthData = shouldLoadGrowthData(pathname);

    void loadCityAtlasData({ includeGrowthData })
      .then((nextData) => {
        if (cancelled) return;
        setData(nextData);
        setHydrated(true);
        setGrowthHydrated(includeGrowthData);
      })
      .catch(() => {
        if (cancelled) return;
        setHydrated(true);
        setGrowthHydrated(includeGrowthData);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || growthHydrated || !shouldLoadGrowthData(pathname)) return;
    let cancelled = false;

    void loadCityAtlasGrowthData({
      businessProspects: data.businessProspects,
      businessInboundMirror: data.businessInboundMirror,
    })
      .then((growthData) => {
        if (cancelled) return;
        setData((current) => ({ ...current, ...growthData }));
        setGrowthHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;
        setGrowthHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [data.businessInboundMirror, data.businessProspects, growthHydrated, hydrated, pathname]);

  useEffect(() => {
    if (!hydrated) return;
    saveCityAtlasData(data);
  }, [data, hydrated]);

  const actions = useMemo(
    () => ({
      addNewsletterLead(email: string, interest: NewsletterLead["interest"]) {
        const lead = createNewsletterLead(email, interest);
        setData((current) => ({
          ...current,
          newsletterLeads: [lead, ...current.newsletterLeads],
          growthEvents: [
            createGrowthEvent("newsletter_lead_saved", window.location.pathname, {
              interest,
            }),
            ...current.growthEvents,
          ],
          auditLogs: [
            audit(
              "newsletter_lead_captured",
              "newsletter_lead",
              lead.id,
              `Captured ${interest.replace("_", " ")} lead locally. No email was sent.`,
            ),
            ...current.auditLogs,
          ],
        }));
        return lead;
      },
      trackEvent(
        name: string,
        detail: Record<string, string | number | boolean> = {},
        options: TrackProductEventOptions = {},
      ) {
        const path = window.location.pathname;
        const enrichedDetail = {
          ...getTrafficContext(),
          ...detail,
        };
        trackProductEvent(name, path, enrichedDetail, options);
        setData((current) => ({
          ...current,
          growthEvents: [
            createGrowthEvent(name, path, enrichedDetail),
            ...current.growthEvents,
          ].slice(0, 200),
        }));
      },
      toggleSave(itemType: SavedItem["itemType"], itemId: string, label: string) {
        setData((current) => {
          const existing = current.savedItems.find(
            (item) => item.itemType === itemType && item.itemId === itemId,
          );
          if (existing) {
            return {
              ...current,
              savedItems: current.savedItems.filter((item) => item.id !== existing.id),
              growthEvents: [
                createGrowthEvent("item_unsaved", window.location.pathname, {
                  itemType,
                  itemId,
                }),
                ...current.growthEvents,
              ].slice(0, 200),
            };
          }
          const saved = createSavedItem(itemType, itemId, label);
          return {
            ...current,
            savedItems: [saved, ...current.savedItems],
            growthEvents: [
              createGrowthEvent("item_saved", window.location.pathname, {
                itemType,
                itemId,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "item_saved",
                itemType,
                itemId,
                `Saved ${label} locally for itinerary and referral-loop testing.`,
              ),
              ...current.auditLogs,
            ],
          };
        });
      },
      moveSavedItem(savedItemId: string, direction: "up" | "down") {
        setData((current) => {
          const currentIndex = current.savedItems.findIndex((item) => item.id === savedItemId);
          if (currentIndex === -1) return current;

          const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
          if (nextIndex < 0 || nextIndex >= current.savedItems.length) {
            return current;
          }

          const nextSavedItems = [...current.savedItems];
          const [movedItem] = nextSavedItems.splice(currentIndex, 1);
          nextSavedItems.splice(nextIndex, 0, movedItem);

          return {
            ...current,
            savedItems: nextSavedItems,
            growthEvents: [
              createGrowthEvent("saved_item_reordered", window.location.pathname, {
                savedItemId,
                direction,
                fromIndex: currentIndex + 1,
                toIndex: nextIndex + 1,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
          };
        });
      },
      clearSavedPlan() {
        setData((current) => {
          if (current.savedItems.length === 0 && current.missionPlans.length === 0) {
            return current;
          }

          return {
            ...current,
            savedItems: [],
            missionPlans: [],
            growthEvents: [
              createGrowthEvent("saved_plan_cleared", window.location.pathname, {
                savedItemCount: current.savedItems.length,
                missionPlanCount: current.missionPlans.length,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "saved_plan_cleared",
                "planner",
                "saved-plan",
                `Cleared ${current.savedItems.length} saved item(s) and ${current.missionPlans.length} local route plan(s).`,
              ),
              ...current.auditLogs,
            ],
          };
        });
      },
      saveMission(mission: CityMission) {
        setData((current) => {
          const existingPairs = new Set(
            current.savedItems.map((item) => `${item.itemType}:${item.itemId}`),
          );
          const additions = mission.steps.reduce<SavedItem[]>((list, step) => {
            const pairKey = `${step.itemType}:${step.itemId}`;
            if (existingPairs.has(pairKey)) {
              return list;
            }
            existingPairs.add(pairKey);
            list.push(createSavedItem(step.itemType, step.itemId, step.label));
            return list;
          }, []);

          return {
            ...current,
            savedItems: [...additions, ...current.savedItems],
            missionPlans: current.missionPlans.some((plan) => plan.missionId === mission.id)
              ? current.missionPlans
              : [createMissionPlan(mission), ...current.missionPlans],
            growthEvents: [
              createGrowthEvent("city_mission_saved", window.location.pathname, {
                missionId: mission.id,
                additions: additions.length,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "city_mission_saved",
                "city_mission",
                mission.id,
                `Saved ${mission.title} locally with ${additions.length} new itinerary item(s).`,
              ),
              ...current.auditLogs,
            ],
          };
        });
      },
      setMissionTravelMode(mission: CityMission, travelMode: TravelMode) {
        setData((current) => {
          const existing = current.missionPlans.find((plan) => plan.missionId === mission.id);
          const timestamp = new Date().toISOString();
          const nextPlan = existing
            ? {
                ...existing,
                travelMode,
                updatedAt: timestamp,
              }
            : createMissionPlan(mission, travelMode);

          return {
            ...current,
            missionPlans: [
              nextPlan,
              ...current.missionPlans.filter((plan) => plan.missionId !== mission.id),
            ],
            growthEvents: [
              createGrowthEvent("mission_travel_mode_changed", window.location.pathname, {
                missionId: mission.id,
                travelMode,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
          };
        });
      },
      setMissionStartTime(mission: CityMission, selectedStartTime: string) {
        setData((current) => {
          const existing = current.missionPlans.find((plan) => plan.missionId === mission.id);
          const timestamp = new Date().toISOString();
          const nextPlan = existing
            ? {
                ...existing,
                selectedStartTime,
                updatedAt: timestamp,
              }
            : {
                ...createMissionPlan(mission),
                selectedStartTime,
                updatedAt: timestamp,
              };

          return {
            ...current,
            missionPlans: [
              nextPlan,
              ...current.missionPlans.filter((plan) => plan.missionId !== mission.id),
            ],
            growthEvents: [
              createGrowthEvent("mission_start_time_selected", window.location.pathname, {
                missionId: mission.id,
                selectedStartTime,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
          };
        });
      },
      setMissionStepStatus(
        mission: CityMission,
        stepIndex: number,
        status: MissionStepStatus,
      ) {
        setData((current) => {
          const timestamp = new Date().toISOString();
          const existing = current.missionPlans.find((plan) => plan.missionId === mission.id);
          const basePlan = existing ?? createMissionPlan(mission);
          const nextPlan = {
            ...basePlan,
            updatedAt: timestamp,
            steps: mission.steps.map((_, index) => {
              const existingStep = basePlan.steps.find((step) => step.stepIndex === index);
              if (index !== stepIndex) {
                return existingStep ?? {
                  stepIndex: index,
                  status: "pending" as const,
                  updatedAt: timestamp,
                };
              }

              return {
                stepIndex,
                status,
                updatedAt: timestamp,
              };
            }),
          };

          return {
            ...current,
            missionPlans: [
              nextPlan,
              ...current.missionPlans.filter((plan) => plan.missionId !== mission.id),
            ],
            growthEvents: [
              createGrowthEvent(
                status === "visited" ? "mission_step_visited" : "mission_step_skipped",
                window.location.pathname,
                {
                  missionId: mission.id,
                  stepIndex: stepIndex + 1,
                },
              ),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                status === "visited" ? "mission_step_visited" : "mission_step_skipped",
                "city_mission",
                mission.id,
                `${mission.title}: marked step ${stepIndex + 1} as ${status}.`,
              ),
              ...current.auditLogs,
            ],
          };
        });
      },
      addMissionFeedback(
        mission: CityMission,
        feedbackType: MissionFeedbackType,
      ) {
        setData((current) => ({
          ...current,
          growthEvents: [
            createGrowthEvent("mission_feedback_recorded", window.location.pathname, {
              missionId: mission.id,
              feedbackType,
            }),
            ...current.growthEvents,
          ].slice(0, 200),
          auditLogs: [
            audit(
              "mission_feedback_recorded",
              "city_mission",
              mission.id,
              `${mission.title}: recorded ${feedbackType.replaceAll("_", " ")} feedback locally.`,
            ),
            ...current.auditLogs,
          ],
        }));
      },
      resetMissionProgress(mission: CityMission) {
        setData((current) => ({
          ...current,
          missionPlans: [
            createMissionPlan(mission),
            ...current.missionPlans.filter((plan) => plan.missionId !== mission.id),
          ],
          growthEvents: [
            createGrowthEvent("mission_progress_reset", window.location.pathname, {
              missionId: mission.id,
            }),
            ...current.growthEvents,
          ].slice(0, 200),
        }));
      },
      addBusinessSubmission(input: {
        businessName: string;
        category: string;
        neighborhood: string;
        contactName: string;
        email: string;
        website: string;
        message: string;
        packageInterest?: PackageId;
      }) {
        const submission: BusinessSubmission = createBusinessSubmission(input);
        setData((current) => ({
          ...current,
          submissions: [submission, ...current.submissions],
          growthEvents: [
            createGrowthEvent("business_submission_saved", window.location.pathname, {
              packageInterest: submission.packageInterest ?? "none",
            }),
            ...current.growthEvents,
          ],
          auditLogs: [
            audit(
              "business_submission_captured",
              "business_submission",
              submission.id,
              `Captured ${submission.businessName} in local review queue. No outreach or payment occurred.`,
            ),
            ...current.auditLogs,
          ],
        }));
        return submission;
      },
      async addBusinessProspects(
        prospects: BusinessProspect[],
        sourceLabel = "manual research import",
      ) {
        if (prospects.length === 0) return 0;
        let importedCount = 0;
        setData((current) => {
          const merged = mergeBusinessProspects(current.businessProspects, prospects);
          importedCount = Math.max(0, merged.length - current.businessProspects.length);
          return {
            ...current,
            businessProspects: merged,
            growthEvents: [
              createGrowthEvent("business_prospects_imported", window.location.pathname, {
                importedCount,
                sourceLabel,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "business_prospects_imported",
                "business_prospect",
                sourceLabel,
                createBusinessProspectAuditSummary(merged, importedCount),
              ),
              ...current.auditLogs,
            ],
          };
        });
        return importedCount;
      },
      addManualReplyLog(input: {
        candidateId: string;
        channel: ManualReplyLog["channel"];
        sentiment: ManualReplyLog["sentiment"];
        messageVersion: string;
        summary: string;
        nextStep: string;
      }) {
        let created: ManualReplyLog | undefined;
        setData((current) => {
          const candidate = current.proofCandidates.find((item) => item.id === input.candidateId);
          const prospect = current.businessProspects.find((item) => item.id === input.candidateId);
          const log = createManualReplyLog({
            ...input,
            candidateName: candidate?.name ?? prospect?.businessName ?? "Unknown candidate",
          });
          created = log;
          return {
            ...current,
            manualReplyLogs: [log, ...current.manualReplyLogs].slice(0, 50),
            growthEvents: [
              createGrowthEvent("manual_outreach_reply_logged", window.location.pathname, {
                candidateId: input.candidateId,
                sentiment: input.sentiment,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "manual_reply_logged",
                "proof_candidate",
                input.candidateId,
                `Logged ${input.sentiment.replace("_", " ")} reply for ${log.candidateName}. No message was sent by CityAtlas.`,
              ),
              ...current.auditLogs,
            ],
          };
        });
        return created;
      },
      async saveBusinessInboundMirror(entries: BusinessInboundMirrorEntry[]) {
        if (entries.length === 0) return 0;
        let savedCount = 0;
        setData((current) => {
          const existingFingerprints = new Set(
            current.businessInboundMirror.map((entry) => entry.fingerprint),
          );
          savedCount = entries.filter(
            (entry) => !existingFingerprints.has(entry.fingerprint),
          ).length;
          const merged = mergeInboundMirrorEntries(current.businessInboundMirror, [
            ...entries,
          ]);

          return {
            ...current,
            businessInboundMirror: merged,
            growthEvents: [
              createGrowthEvent("business_inbound_mirror_saved", window.location.pathname, {
                savedCount,
                totalMirrored: merged.length,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "business_inbound_mirror_saved",
                "business_reply_rail",
                "protected_inbound_mirror",
                `Saved ${savedCount} business reply packet(s) into local protected mirror memory. No live inbox, webhook, or follow-up was activated.`,
              ),
              ...current.auditLogs,
            ],
          };
        });
        return savedCount;
      },
      async replayBusinessReplyBridgeEntry(entryId: string) {
        let created: BusinessReplyLog | undefined;
        setData((current) => {
          const entry = current.businessInboundMirror.find((item) => item.id === entryId);
          if (!entry?.matchedProspectId) {
            return current;
          }
          if (
            current.businessReplyBridgeReplays.some(
              (replay) => replay.fingerprint === entry.fingerprint,
            )
          ) {
            return current;
          }

          const logDraft = buildBusinessReplyLogDraftFromMirrorEntry(entry);
          if (!logDraft) {
            return current;
          }

          const log = createBusinessReplyLog(logDraft);
          const replay = createBusinessReplyBridgeReplayRecord(
            buildBusinessReplyBridgeReplayDraft(entry),
          );
          created = log;

          return {
            ...current,
            businessProspects: current.businessProspects.map((prospect) =>
              prospect.id === entry.matchedProspectId
                ? {
                    ...prospect,
                    outreachStatus: inferBusinessProspectOutreachStatus(log.sentiment),
                    lastUpdatedAt: log.createdAt,
                  }
                : prospect,
            ),
            businessReplyBridgeReplays: [
              replay,
              ...current.businessReplyBridgeReplays,
            ].slice(0, 120),
            businessReplyLogs: [log, ...current.businessReplyLogs].slice(0, 120),
            growthEvents: [
              createGrowthEvent("business_reply_bridge_replayed", window.location.pathname, {
                prospectId: log.prospectId,
                sourceRail: log.sourceRail,
                sentiment: log.sentiment,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "business_reply_bridge_replayed",
                "business_prospect",
                log.prospectId,
                `Replayed a protected business reply packet into local CityAtlas memory for ${log.businessName}. No live inbox connector or follow-up was activated.`,
              ),
              ...current.auditLogs,
            ],
          };
        });
        return created;
      },
      setBusinessProspectSupervisedAllowlist(prospectId: string, allowlisted: boolean) {
        setData((current) => {
          const prospect = current.businessProspects.find((item) => item.id === prospectId);
          if (!prospect) {
            return current;
          }

          const now = new Date().toISOString();
          return {
            ...current,
            businessProspects: current.businessProspects.map((item) =>
              item.id === prospectId
                ? {
                    ...item,
                    supervisedAllowlistStatus: allowlisted ? "Allowlisted" : "Removed",
                    supervisedAllowlistedAt: now,
                    supervisedAllowlistNote: allowlisted
                      ? "Added to the tiny local supervised allowlist. No provider send was enabled."
                      : "Removed from the tiny local supervised allowlist.",
                    lastUpdatedAt: now,
                  }
                : item,
            ),
            growthEvents: [
              createGrowthEvent("business_supervised_allowlist_updated", window.location.pathname, {
                prospectId,
                allowlisted,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "business_supervised_allowlist_updated",
                "business_prospect",
                prospectId,
                `${prospect.businessName} was ${allowlisted ? "added to" : "removed from"} the local supervised allowlist. No provider send, webhook, or CRM sync was activated.`,
              ),
              ...current.auditLogs,
            ],
          };
        });
      },
      markBusinessProspectSupervisedDryRunPrepared(prospectId: string) {
        setData((current) => {
          const prospect = current.businessProspects.find((item) => item.id === prospectId);
          if (!prospect) {
            return current;
          }

          const now = new Date().toISOString();
          return {
            ...current,
            businessProspects: current.businessProspects.map((item) =>
              item.id === prospectId
                ? {
                    ...item,
                    supervisedSendStatus: "Dry run prepared",
                    supervisedSendMode: "dry_run",
                    supervisedSendPreparedAt: now,
                    supervisedSendNote:
                      "Recorded as a local-only dry-run review packet after owner-inbox rehearsal. No provider call happened.",
                    lastUpdatedAt: now,
                  }
                : item,
            ),
            growthEvents: [
              createGrowthEvent("business_supervised_dry_run_prepared", window.location.pathname, {
                prospectId,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "business_supervised_dry_run_prepared",
                "business_prospect",
                prospectId,
                `Prepared a local-only supervised dry-run packet for ${prospect.businessName}. No provider send was attempted.`,
              ),
              ...current.auditLogs,
            ],
          };
        });
      },
      stageBusinessProspectSupervisedLiveReview(prospectId: string) {
        setData((current) => {
          const prospect = current.businessProspects.find((item) => item.id === prospectId);
          if (!prospect) {
            return current;
          }

          const now = new Date().toISOString();
          return {
            ...current,
            businessProspects: current.businessProspects.map((item) =>
              item.id === prospectId
                ? {
                    ...item,
                    supervisedLiveReviewStatus: "Ready for approval",
                    supervisedLiveReviewRequestedAt: now,
                    lastUpdatedAt: now,
                  }
                : item,
            ),
            growthEvents: [
              createGrowthEvent("business_supervised_live_review_staged", window.location.pathname, {
                prospectId,
              }),
              ...current.growthEvents,
            ].slice(0, 200),
            auditLogs: [
              audit(
                "business_supervised_live_review_staged",
                "business_prospect",
                prospectId,
                `Staged ${prospect.businessName} for a later explicit live-review packet. The provider lane remains blocked and no business was contacted.`,
              ),
              ...current.auditLogs,
            ],
          };
        });
      },
      saveBrainRun(input: {
        stage: string;
        summary: string;
        topRecommendation: string;
        topGate: string;
        openGaps: number;
        averageProgress: number;
      }) {
        const run = createBrainRun(input);
        setData((current) => ({
          ...current,
          brainRuns: [run, ...current.brainRuns].slice(0, 20),
          growthEvents: [
            createGrowthEvent("ai_brain_run_saved", window.location.pathname, {
              stage: input.stage,
              averageProgress: input.averageProgress,
              openGaps: input.openGaps,
            }),
            ...current.growthEvents,
          ].slice(0, 200),
          auditLogs: [
            audit(
              "ai_brain_run_saved",
              "brain_run",
              run.id,
              `Saved local AI Brain run at ${input.averageProgress}% average progress. No provider call or external sync occurred.`,
            ),
            ...current.auditLogs,
          ],
        }));
        return run;
      },
      markGateReady(gateId: string) {
        setData((current) => ({
          ...current,
          launchGates: current.launchGates.map((gate) =>
            gate.id === gateId ? { ...gate, status: "ready_for_review" } : gate,
          ),
          auditLogs: [
            audit(
              "launch_gate_marked_ready",
              "launch_gate",
              gateId,
              "Gate marked ready for owner review. This does not approve or execute the live-risk action.",
            ),
            ...current.auditLogs,
          ],
        }));
      },
      resetDemo() {
        const fresh = resetCityAtlasData();
        setData(fresh);
        return fresh;
      },
    }),
    [],
  );

  return { data, actions, hydrated, growthHydrated };
}
