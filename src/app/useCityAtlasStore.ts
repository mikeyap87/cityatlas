import { useEffect, useMemo, useState } from "react";
import type {
  BusinessInboundMirrorEntry,
  BusinessProspect,
  BusinessReplyLog,
  BusinessSubmission,
  CityMission,
  CityAtlasData,
  ManualReplyLog,
  NewsletterLead,
  PackageId,
  SavedItem,
} from "../types";
import { buildFlags, canRenderAdminExperience } from "../config/site";
import {
  audit,
  createBrainRun,
  createBusinessProspectAuditSummary,
  createBusinessReplyBridgeReplayRecord,
  createBusinessReplyLog,
  createEmptyCityAtlasData,
  createBusinessSubmission,
  createGrowthEvent,
  createManualReplyLog,
  createNewsletterLead,
  createSavedItem,
  loadCityAtlasData,
  loadCityAtlasGrowthData,
  resetCityAtlasData,
  saveCityAtlasData,
} from "../lib/storage";
import { getTrafficContext, trackProductEvent } from "../lib/analytics";

let cityGrowthModulePromise: Promise<typeof import("../lib/cityGrowth")> | null = null;
let businessInboundPreviewModulePromise: Promise<typeof import("../lib/businessInboundPreview")> | null =
  null;

const loadCityGrowthModule: () => Promise<typeof import("../lib/cityGrowth")> =
  buildFlags.hostedAdminArtifacts
    ? () => {
        cityGrowthModulePromise ??= import("../lib/cityGrowth");
        return cityGrowthModulePromise;
      }
    : async () => {
        throw new Error("Protected CityAtlas admin artifacts are disabled in this build.");
      };

const loadBusinessInboundPreviewModule: () => Promise<typeof import("../lib/businessInboundPreview")> =
  buildFlags.hostedAdminArtifacts
    ? () => {
        businessInboundPreviewModulePromise ??= import("../lib/businessInboundPreview");
        return businessInboundPreviewModulePromise;
      }
    : async () => {
        throw new Error("Protected CityAtlas admin artifacts are disabled in this build.");
      };

function shouldLoadGrowthData(pathname: string) {
  return pathname === "/admin" && buildFlags.hostedAdminArtifacts && canRenderAdminExperience();
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
      trackEvent(name: string, detail: Record<string, string | number | boolean> = {}) {
        const path = window.location.pathname;
        const enrichedDetail = {
          ...getTrafficContext(),
          ...detail,
        };
        trackProductEvent(name, path, enrichedDetail);
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
        const { mergeBusinessProspects } = await loadCityGrowthModule();
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
          const candidate = current.proofCandidates.find(
            (item) => item.id === input.candidateId,
          );
          const log = createManualReplyLog({
            ...input,
            candidateName: candidate?.name ?? "Unknown candidate",
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
        const { compactBusinessProtectedInboundMirrorEntries } =
          await loadBusinessInboundPreviewModule();
        let savedCount = 0;
        setData((current) => {
          const existingFingerprints = new Set(
            current.businessInboundMirror.map((entry) => entry.fingerprint),
          );
          savedCount = entries.filter(
            (entry) => !existingFingerprints.has(entry.fingerprint),
          ).length;
          const merged = compactBusinessProtectedInboundMirrorEntries([
            ...entries,
            ...current.businessInboundMirror,
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
        const {
          buildBusinessReplyBridgeReplayDraft,
          buildBusinessReplyLogDraftFromMirrorEntry,
          inferBusinessProspectOutreachStatus,
        } = await loadBusinessInboundPreviewModule();
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
