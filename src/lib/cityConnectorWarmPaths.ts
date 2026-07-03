import type { BusinessProspect } from "../types";
import { roomsCityConnectorSeeds } from "../data/roomsCityConnectorSeeds.ts";
import { roomsVancouverNamedConnectorSeeds } from "../data/roomsVancouverNamedConnectorSeeds.ts";

export type ConnectorConfidence = "high" | "medium" | "low";

export type OrganizationConnectorSeed = {
  cityKey: string;
  cityName: string;
  connectorName: string;
  eventType: string;
  audience: string;
  whyItMatters: string;
  publicContactPath: string;
  confidence: ConnectorConfidence;
  sourceUrl: string;
  accessDate: string;
  notes: string;
};

export type NamedConnectorSeed = {
  cityKey: string;
  cityName: string;
  laneId: string;
  laneLabel: string;
  name: string;
  role: string;
  organization: string;
  whyItMatters: string;
  bestPublicContactPath: string;
  confidence: ConnectorConfidence;
  sourceUrl: string;
  accessDate: string;
  notes: string;
};

export type ConnectorWarmPathRow = {
  id: string;
  cityKey: string;
  cityName: string;
  routeType: "organization" | "named_person";
  targetName: string;
  secondaryLabel: string;
  organization: string;
  audience: string;
  laneId: string;
  laneLabel: string;
  confidence: ConnectorConfidence;
  publicContactPath: string;
  sourceUrl: string;
  accessDate: string;
  whyItMatters: string;
  notes: string;
};

export type ConnectorCityRollup = {
  cityKey: string;
  cityName: string;
  organizationConnectorCount: number;
  namedConnectorCount: number;
  namedLaneCount: number;
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  alignedProspectCount: number;
  alignedContactReadyCount: number;
  alignedEmailReadyCount: number;
  status: "named_ready" | "organization_ready" | "not_staged";
  nextAction: string;
};

function normalizeConfidence(value: string): ConnectorConfidence {
  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }
  return "low";
}

function getOrganizationConnectorSeeds(): OrganizationConnectorSeed[] {
  return roomsCityConnectorSeeds.map((seed) => ({
    ...seed,
    confidence: normalizeConfidence(seed.confidence),
  }));
}

function getNamedConnectorSeeds(): NamedConnectorSeed[] {
  return roomsVancouverNamedConnectorSeeds.map((seed) => ({
    ...seed,
    confidence: normalizeConfidence(seed.confidence),
  }));
}

function getConfidenceRank(confidence: ConnectorConfidence) {
  if (confidence === "high") return 3;
  if (confidence === "medium") return 2;
  return 1;
}

function compareRows(left: ConnectorWarmPathRow, right: ConnectorWarmPathRow) {
  return (
    getConfidenceRank(right.confidence) - getConfidenceRank(left.confidence)
    || left.targetName.localeCompare(right.targetName)
  );
}

function getOrganizationLaneId(seed: OrganizationConnectorSeed) {
  const value = `${seed.connectorName} ${seed.eventType} ${seed.audience}`.toLowerCase();
  if (/\b(founder|startup|investor|builder|tech)\b/.test(value)) {
    return "founder-ecosystem";
  }
  if (/\b(creative|design|culture|artist|creator)\b/.test(value)) {
    return "creative-culture";
  }
  if (/\b(members club|club|dinner|festival|forum|conference|events?)\b/.test(value)) {
    return "operator-network";
  }
  return "city-connector";
}

function getOrganizationLaneLabel(laneId: string) {
  switch (laneId) {
    case "founder-ecosystem":
      return "Founder / ecosystem connector";
    case "creative-culture":
      return "Creative / culture connector";
    case "operator-network":
      return "Operator / event connector";
    default:
      return "City connector";
  }
}

function getBusinessCoverageMap(businessProspects: BusinessProspect[]) {
  return businessProspects.reduce((map, prospect) => {
    const current = map.get(prospect.cityKey) || {
      alignedProspectCount: 0,
      alignedContactReadyCount: 0,
      alignedEmailReadyCount: 0,
    };

    current.alignedProspectCount += 1;
    if (prospect.contactReadiness === "contact_path_ready" || prospect.contactReadiness === "email_ready") {
      current.alignedContactReadyCount += 1;
    }
    if (prospect.contactReadiness === "email_ready") {
      current.alignedEmailReadyCount += 1;
    }

    map.set(prospect.cityKey, current);
    return map;
  }, new Map<string, { alignedProspectCount: number; alignedContactReadyCount: number; alignedEmailReadyCount: number }>());
}

export function listOrganizationConnectorRows(cityKey?: string) {
  const rows = getOrganizationConnectorSeeds()
    .filter((seed) => !cityKey || seed.cityKey === cityKey)
    .map<ConnectorWarmPathRow>((seed) => {
      const laneId = getOrganizationLaneId(seed);
      return {
        id: `connector-org-${seed.cityKey}-${seed.connectorName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        cityKey: seed.cityKey,
        cityName: seed.cityName,
        routeType: "organization",
        targetName: seed.connectorName,
        secondaryLabel: seed.eventType,
        organization: seed.connectorName,
        audience: seed.audience,
        laneId,
        laneLabel: getOrganizationLaneLabel(laneId),
        confidence: seed.confidence,
        publicContactPath: seed.publicContactPath,
        sourceUrl: seed.sourceUrl,
        accessDate: seed.accessDate,
        whyItMatters: seed.whyItMatters,
        notes: seed.notes,
      };
    })
    .sort(compareRows);

  return rows;
}

export function listNamedConnectorRows(cityKey?: string) {
  const rows = getNamedConnectorSeeds()
    .filter((seed) => !cityKey || seed.cityKey === cityKey)
    .map<ConnectorWarmPathRow>((seed) => ({
      id: `connector-person-${seed.cityKey}-${seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      cityKey: seed.cityKey,
      cityName: seed.cityName,
      routeType: "named_person",
      targetName: seed.name,
      secondaryLabel: seed.role,
      organization: seed.organization,
      audience: seed.laneLabel,
      laneId: seed.laneId,
      laneLabel: seed.laneLabel,
      confidence: seed.confidence,
      publicContactPath: seed.bestPublicContactPath,
      sourceUrl: seed.sourceUrl,
      accessDate: seed.accessDate,
      whyItMatters: seed.whyItMatters,
      notes: seed.notes,
    }))
    .sort((left, right) => {
      const laneOrder = ["founder-anchor", "creative-taste", "venue-operator-bridge"];
      return (
        laneOrder.indexOf(left.laneId) - laneOrder.indexOf(right.laneId)
        || compareRows(left, right)
      );
    });

  return rows;
}

export function listConnectorWarmPathRows(cityKey?: string) {
  return [
    ...listNamedConnectorRows(cityKey),
    ...listOrganizationConnectorRows(cityKey),
  ].sort((left, right) => {
    if (left.routeType !== right.routeType) {
      return left.routeType === "named_person" ? -1 : 1;
    }
    return compareRows(left, right);
  });
}

export function buildConnectorCityRollups(
  businessProspects: BusinessProspect[] = [],
): ConnectorCityRollup[] {
  const coverageByCity = getBusinessCoverageMap(businessProspects);
  const connectorRows = listOrganizationConnectorRows();
  const namedRows = listNamedConnectorRows();
  const cityMap = new Map<string, ConnectorCityRollup>();

  for (const row of connectorRows) {
    const existing = cityMap.get(row.cityKey) || {
      cityKey: row.cityKey,
      cityName: row.cityName,
      organizationConnectorCount: 0,
      namedConnectorCount: 0,
      namedLaneCount: 0,
      highConfidenceCount: 0,
      mediumConfidenceCount: 0,
      alignedProspectCount: coverageByCity.get(row.cityKey)?.alignedProspectCount ?? 0,
      alignedContactReadyCount: coverageByCity.get(row.cityKey)?.alignedContactReadyCount ?? 0,
      alignedEmailReadyCount: coverageByCity.get(row.cityKey)?.alignedEmailReadyCount ?? 0,
      status: "organization_ready" as const,
      nextAction: "",
    };

    existing.organizationConnectorCount += 1;
    if (row.confidence === "high") existing.highConfidenceCount += 1;
    if (row.confidence === "medium") existing.mediumConfidenceCount += 1;
    cityMap.set(row.cityKey, existing);
  }

  for (const row of namedRows) {
    const existing = cityMap.get(row.cityKey) || {
      cityKey: row.cityKey,
      cityName: row.cityName,
      organizationConnectorCount: 0,
      namedConnectorCount: 0,
      namedLaneCount: 0,
      highConfidenceCount: 0,
      mediumConfidenceCount: 0,
      alignedProspectCount: coverageByCity.get(row.cityKey)?.alignedProspectCount ?? 0,
      alignedContactReadyCount: coverageByCity.get(row.cityKey)?.alignedContactReadyCount ?? 0,
      alignedEmailReadyCount: coverageByCity.get(row.cityKey)?.alignedEmailReadyCount ?? 0,
      status: "named_ready" as const,
      nextAction: "",
    };

    existing.namedConnectorCount += 1;
    existing.namedLaneCount = new Set(
      listNamedConnectorRows(row.cityKey).map((item) => item.laneId),
    ).size;
    if (row.confidence === "high") existing.highConfidenceCount += 1;
    if (row.confidence === "medium") existing.mediumConfidenceCount += 1;
    cityMap.set(row.cityKey, existing);
  }

  return [...cityMap.values()]
    .map((rollup) => {
      const status: ConnectorCityRollup["status"] =
        rollup.namedConnectorCount > 0
          ? "named_ready"
          : rollup.organizationConnectorCount > 0
            ? "organization_ready"
            : "not_staged";

      let nextAction =
        "No connector stack is staged for this city yet.";
      if (status === "named_ready") {
        nextAction =
          "Use the named warm-path rows first and keep organization-level pages as backup research until a later approval step exists.";
      } else if (status === "organization_ready") {
        nextAction =
          "Use the organization-level connector stack to stage warm-path review and named-person follow-up packets before any outreach decision exists.";
      }

      return {
        ...rollup,
        status,
        nextAction,
      };
    })
    .sort(
      (left, right) =>
        right.alignedEmailReadyCount - left.alignedEmailReadyCount
        || right.namedConnectorCount - left.namedConnectorCount
        || right.organizationConnectorCount - left.organizationConnectorCount
        || left.cityName.localeCompare(right.cityName),
    );
}

export function buildNamedConnectorLaneSummaries(cityKey = "vancouver") {
  const namedRows = listNamedConnectorRows(cityKey);
  const byLane = new Map<string, { laneLabel: string; count: number; names: string[] }>();

  for (const row of namedRows) {
    const current = byLane.get(row.laneId) || {
      laneLabel: row.laneLabel,
      count: 0,
      names: [],
    };
    current.count += 1;
    current.names.push(row.targetName);
    byLane.set(row.laneId, current);
  }

  return [...byLane.entries()].map(([laneId, value]) => ({
    laneId,
    laneLabel: value.laneLabel,
    count: value.count,
    names: value.names,
  }));
}
