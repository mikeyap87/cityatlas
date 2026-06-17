import type { Business, CityAtlasData, LaunchGate } from "../types";
import { clampScore } from "./format";

export function getCoverageScore(data: CityAtlasData) {
  if (data.businesses.length === 0) return 0;
  const total = data.businesses.reduce(
    (sum, business) => sum + business.visibilityScore,
    0,
  );
  return clampScore(total / data.businesses.length);
}

export function getLaunchReadiness(data: CityAtlasData) {
  const contentSignals = [
    data.businesses.length >= 4,
    data.events.length >= 2,
    data.offers.length >= 2,
    data.guides.length >= 2,
    data.packages.length >= 3,
  ];
  const gateSignals = data.launchGates.map((gate) => gate.status !== "locked");
  const complete = [...contentSignals, ...gateSignals].filter(Boolean).length;
  return clampScore((complete / (contentSignals.length + gateSignals.length)) * 100);
}

export function getPartnerPipelineValue(data: CityAtlasData) {
  return data.businesses.reduce((sum, business) => {
    if (business.partnerFitScore >= 90) return sum + 650;
    if (business.partnerFitScore >= 80) return sum + 350;
    if (business.partnerFitScore >= 70) return sum + 150;
    return sum;
  }, 0);
}

export function getReadinessChecklist(business: Business) {
  return [
    { label: "Profile", complete: business.pageReadiness.profile },
    { label: "Media", complete: business.pageReadiness.media },
    { label: "Categories", complete: business.pageReadiness.categories },
    { label: "Description", complete: business.pageReadiness.description },
    { label: "Offer", complete: business.pageReadiness.offer },
  ];
}

export function getGateLabel(gate: LaunchGate) {
  if (gate.status === "approved") return "Approved";
  if (gate.status === "ready_for_review") return "Ready for review";
  return "Locked";
}

export function getPrimaryPartnerCandidates(data: CityAtlasData) {
  return [...data.businesses]
    .sort((a, b) => b.partnerFitScore - a.partnerFitScore)
    .slice(0, 3);
}
