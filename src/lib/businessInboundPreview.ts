import type {
  BusinessInboundMirrorEntry,
  BusinessProspect,
  BusinessReplyBridgeReplayRecord,
  BusinessReplyLog,
} from "../types";

const BUSINESS_OUTREACH_SCHEMAS = Object.freeze({
  inboundPacket: "uaibos.outreach.inbound.v1",
  protectedMirrorEntry: "uaibos.outreach.mirror.v1",
  replyBridgeEnvelope: "uaibos.outreach.reply-bridge.v1",
});

export type BusinessInboundSourceType =
  | "resend_event"
  | "resend_events"
  | "structured_rows"
  | "empty"
  | "invalid";

export type BusinessReplyImportInput = {
  rowNumber?: number;
  sourceType?: string;
  messageId?: string;
  threadId?: string;
  email: string;
  name: string;
  subject: string;
  replyText: string;
  receivedAt: string;
  mailbox?: string;
  labels?: string[];
};

export type BusinessReplyPreviewRow = {
  rowNumber: number;
  input: BusinessReplyImportInput;
  matchedProspect?: BusinessProspect;
  status: "Ready" | "Needs review" | "Blocked";
  reason: string;
  canIngest: boolean;
};

export type BusinessReplyPreview = {
  readiness: number;
  title: string;
  summary: string;
  automationGuardrail: string;
  rows: BusinessReplyPreviewRow[];
  metrics: {
    label: string;
    value: string;
    score: number;
    target: string;
  }[];
};

export type BusinessInboundPacket = {
  rowNumber: number;
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
};

export type BusinessInboundAdapterRow = {
  rowNumber: number;
  packet: BusinessInboundPacket;
  payloadStatus: "Valid" | "Needs identity" | "Invalid";
  protectedIngestionStatus: "Ready" | "Hold";
  replyQualificationStatus: "Ready" | "Hold";
  identityMissing: string[];
  nextSafeAction: string;
  matchedProspectId: string;
  matchedBusinessName: string;
  protectedReason: string;
  qualificationReason: string;
};

export type BusinessInboundAdapterPreview = {
  readiness: number;
  title: string;
  summary: string;
  automationGuardrail: string;
  sourceType: BusinessInboundSourceType;
  nextAction: string;
  samplePayload: string;
  metrics: {
    label: string;
    value: string;
    score: number;
    target: string;
  }[];
  rows: BusinessInboundAdapterRow[];
  replyPreview: BusinessReplyPreview;
  guidance: string[];
};

export type BusinessReplyBridgeStatus =
  | "Bridge ready"
  | "Replayed"
  | "Duplicate"
  | "Review needed"
  | "Blocked";

export type BusinessReplyBridgeRow = {
  entry: BusinessInboundMirrorEntry;
  status: BusinessReplyBridgeStatus;
  reason: string;
  nextSafeAction: string;
  canReplay: boolean;
  duplicate: boolean;
  matchedProspectId: string;
  matchedBusinessName: string;
  replayedAt?: string;
  replyPreviewRow?: BusinessReplyPreviewRow;
};

export type BusinessReplyBridgeReport = {
  readiness: number;
  title: string;
  summary: string;
  nextAction: string;
  automationGuardrail: string;
  metrics: {
    label: string;
    value: string;
    score: number;
    target: string;
  }[];
  rows: BusinessReplyBridgeRow[];
  replayPreview: BusinessReplyPreview;
  guidance: string[];
};

export type BusinessProtectedInboundMirrorReport = {
  readiness: number;
  title: string;
  summary: string;
  nextAction: string;
  automationGuardrail: string;
  metrics: {
    label: string;
    value: string;
    score: number;
    target: string;
  }[];
  entries: BusinessInboundMirrorEntry[];
  replyPreview: BusinessReplyPreview;
  guidance: string[];
};

export function sampleBusinessResendInboundPayload() {
  return JSON.stringify(
    {
      type: "email.received",
      data: {
        email_id: "resend_msg_cityatlas_001",
        from: "Alex Rivera <alex@samplepartner.example>",
        subject: "Re: CityAtlas Vancouver",
        text: "Thanks for the note. Can you send a little more detail first?",
        created_at: "2026-06-16T18:00:00Z",
        headers: {
          "Message-ID": "<resend_msg_cityatlas_001@resend.dev>",
          "In-Reply-To": "resend_thread_cityatlas_001",
        },
        mailbox: "INBOUND",
        tags: ["Vancouver", "Business"],
      },
    },
    null,
    2,
  );
}

export function buildBusinessReplyInboxImportPreview(
  inputs: BusinessReplyImportInput[],
  prospects: BusinessProspect[],
): BusinessReplyPreview {
  if (inputs.length === 0) {
    return {
      readiness: 0,
      title: "Business reply rehearsal is waiting for inbound rows",
      summary:
        "Paste a Resend inbound payload or structured rows so CityAtlas can rehearse business-reply matching locally.",
      automationGuardrail:
        "This stays local and approval-safe. It does not read a live inbox, send replies, or change any provider account.",
      rows: [],
      metrics: [
        {
          label: "Ready to ingest",
          value: "0/0",
          score: 0,
          target: "Paste reply rows first.",
        },
      ],
    };
  }

  const rows = inputs.map((input, index) => buildBusinessReplyPreviewRow(input.rowNumber || index + 1, input, prospects));
  const ready = rows.filter((row) => row.status === "Ready").length;
  const review = rows.filter((row) => row.status === "Needs review").length;
  const blocked = rows.filter((row) => row.status === "Blocked").length;
  const exactEmailMatches = rows.filter(
    (row) =>
      row.matchedProspect && normalize(row.input.email) === normalize(row.matchedProspect.email),
  ).length;

  const metrics = [
    {
      label: "Ready to ingest",
      value: `${ready}/${Math.max(1, rows.length)}`,
      score: percent(ready, Math.max(1, rows.length)),
      target: "Most reply rows should match a business prospect cleanly before replay.",
    },
    {
      label: "Exact email matches",
      value: `${exactEmailMatches}/${Math.max(1, rows.length)}`,
      score: percent(exactEmailMatches, Math.max(1, rows.length)),
      target: "Email matching is the safest path before anything touches durable business memory.",
    },
    {
      label: "Rows needing review",
      value: `${review}`,
      score: rows.length === 0 ? 0 : Math.max(0, 100 - review * 24),
      target: "Ambiguous rows should stay review-first instead of mutating the wrong business.",
    },
    {
      label: "Blocked rows",
      value: `${blocked}`,
      score: blocked === 0 ? 100 : Math.max(0, 100 - blocked * 35),
      target: "Bad payloads should stay blocked instead of pretending they are usable.",
    },
  ];

  return {
    readiness: Math.round(metrics.reduce((sum, item) => sum + item.score, 0) / metrics.length),
    title:
      ready > 0
        ? "Business reply rehearsal can feed CityAtlas safely"
        : "Business reply rehearsal still needs cleaner matching",
    summary:
      ready > 0
        ? "CityAtlas can match reply rows to real business prospects locally, keep the packet private, and prepare durable memory without opening a live inbox lane."
        : "The preview is useful, but the rows still need cleaner email or identity matching before CityAtlas should trust them.",
    automationGuardrail:
      "This is local reply rehearsal only. It does not connect a live inbox, register a webhook, send follow-ups, or change any provider account.",
    rows,
    metrics,
  };
}

export function buildBusinessInboundAdapterPreview(
  rawText: string,
  prospects: BusinessProspect[],
): BusinessInboundAdapterPreview {
  const parsed = parseBusinessInboundPayload(rawText);
  const replyPreview = buildBusinessReplyInboxImportPreview(
    parsed.inputs.map((packet) => toReplyImportInput(packet)),
    prospects,
  );
  const rows = parsed.inputs.map((packet, index) =>
    buildBusinessInboundAdapterRow(packet, replyPreview.rows[index], parsed.sourceType),
  );
  const validRows = rows.filter((row) => row.payloadStatus === "Valid").length;
  const protectedReady = rows.filter((row) => row.protectedIngestionStatus === "Ready").length;
  const qualificationReady = rows.filter(
    (row) => row.replyQualificationStatus === "Ready",
  ).length;
  const missingIdentityCount = rows.reduce(
    (sum, row) => sum + row.identityMissing.length,
    0,
  );

  const metrics = [
    {
      label: "Payload shape",
      value: parsed.sourceType.replace(/_/g, " "),
      score:
        parsed.sourceType === "resend_event" || parsed.sourceType === "resend_events"
          ? 100
          : parsed.sourceType === "empty"
            ? 0
            : 28,
      target: "The preview lane should recognize a real Resend inbound payload before anything else happens.",
    },
    {
      label: "Valid rows",
      value: `${validRows}/${Math.max(1, rows.length)}`,
      score: percent(validRows, Math.max(1, rows.length)),
      target: "Normalized business reply rows should retain sender, message, and timing identity.",
    },
    {
      label: "Protected mirror readiness",
      value: `${protectedReady}/${Math.max(1, rows.length)}`,
      score: percent(protectedReady, Math.max(1, rows.length)),
      target: "Most rows should be safe enough to store in local protected inbound memory.",
    },
    {
      label: "Reply bridge readiness",
      value: `${qualificationReady}/${Math.max(1, rows.length)}`,
      score: percent(qualificationReady, Math.max(1, rows.length)),
      target: "A clean payload should already be understandable by the local reply bridge.",
    },
    {
      label: "Identity gaps",
      value: `${missingIdentityCount} missing field${missingIdentityCount === 1 ? "" : "s"}`,
      score: rows.length === 0 ? 0 : Math.max(0, 100 - missingIdentityCount * 18),
      target: "The packet should preserve sender, message, and timing identity before CityAtlas stores it durably.",
    },
  ];

  const readiness =
    rows.length === 0 ? 0 : Math.round(metrics.reduce((sum, item) => sum + item.score, 0) / metrics.length);

  return {
    readiness,
    title:
      rows.length === 0
        ? "Resend-first business inbound adapter is waiting for a payload"
        : protectedReady > 0
          ? "Resend-first business inbound adapter can feed CityAtlas safely"
          : "Resend-first business inbound adapter still needs cleaner identity",
    summary:
      rows.length === 0
        ? "Paste a Resend email.received-style payload here so CityAtlas can preview the business reply rail locally."
        : protectedReady > 0
          ? "CityAtlas can normalize this payload, match it to business prospects, and keep it inside preview-only durable memory before any live connector exists."
          : "CityAtlas parsed the payload, but it still needs cleaner sender, message, or match identity before the local machine should trust it.",
    automationGuardrail:
      "This lane is preview-only, local-only, and approval-gated. It does not register a webhook, read a live inbox, send replies, or change any provider account.",
    sourceType: parsed.sourceType,
    nextAction:
      rows.length === 0
        ? "Load a payload first, then review the packet match and mirror readiness."
        : qualificationReady > 0
          ? "Keep the packet in preview, mirror it locally, then let the reply bridge read from durable packet memory."
          : rows[0]?.nextSafeAction || "Preserve sender and message identity first.",
    samplePayload: sampleBusinessResendInboundPayload(),
    metrics,
    rows,
    replyPreview,
    guidance: [
      "Resend is the machine rail for future business-reply ingestion.",
      "Gmail stays fallback and manual escalation only, not the main operating system.",
      "The safe progression is: protected mirror first, reply bridge second, local outcome memory third, supervised execution later only if separately approved.",
    ],
  };
}

export function compactBusinessProtectedInboundMirrorEntries(
  entries: BusinessInboundMirrorEntry[],
  limit = 120,
) {
  const deduped = new Map<string, BusinessInboundMirrorEntry>();
  entries
    .slice()
    .sort(
      (left, right) =>
        new Date(right.mirroredAt).getTime() - new Date(left.mirroredAt).getTime(),
    )
    .forEach((entry) => {
      if (!deduped.has(entry.fingerprint)) {
        deduped.set(entry.fingerprint, entry);
      }
    });

  return Array.from(deduped.values()).slice(0, limit);
}

export function buildBusinessProtectedInboundMirrorEntries(
  rows: BusinessInboundAdapterRow[],
  existingEntries: BusinessInboundMirrorEntry[] = [],
  mirroredAt = new Date().toISOString(),
) {
  const existingByFingerprint = new Map(
    existingEntries.map((entry) => [entry.fingerprint, entry]),
  );

  return compactBusinessProtectedInboundMirrorEntries(
    rows.map((row) => {
      const fingerprint = fingerprintBusinessInboundPacket(row.packet);
      const existing = existingByFingerprint.get(fingerprint);

      return {
        id: existing?.id || createMirrorId(fingerprint, row.rowNumber),
        schemaVersion: BUSINESS_OUTREACH_SCHEMAS.protectedMirrorEntry,
        fingerprint,
        sourceRail: "Resend" as const,
        sourceType: row.packet.sourceType,
        messageId: row.packet.messageId,
        threadId: row.packet.threadId,
        email: row.packet.email,
        name: row.packet.name,
        subject: row.packet.subject,
        replyText: row.packet.replyText,
        receivedAt: row.packet.receivedAt,
        mailbox: row.packet.mailbox,
        labels: row.packet.labels,
        payloadStatus: row.payloadStatus,
        protectedIngestionStatus: row.protectedIngestionStatus,
        replyQualificationStatus: row.replyQualificationStatus,
        identityMissing: [...row.identityMissing],
        matchedProspectId: row.matchedProspectId || undefined,
        matchedBusinessName: row.matchedBusinessName || undefined,
        nextSafeAction: row.nextSafeAction,
        protectedReason: row.protectedReason,
        qualificationReason: row.qualificationReason,
        mirroredAt: existing?.mirroredAt || mirroredAt,
      };
    }),
  );
}

export function buildBusinessProtectedInboundMirrorReport({
  entries,
  prospects,
  replayHistory,
}: {
  entries: BusinessInboundMirrorEntry[];
  prospects: BusinessProspect[];
  replayHistory: BusinessReplyBridgeReplayRecord[];
}): BusinessProtectedInboundMirrorReport {
  const sortedEntries = compactBusinessProtectedInboundMirrorEntries(entries);
  const replyPreview = buildBusinessReplyInboxImportPreview(
    sortedEntries.map((entry, index) => toReplyImportInputFromMirror(entry, index)),
    prospects,
  );
  const readyForProtectedMirror = sortedEntries.filter(
    (entry) => entry.protectedIngestionStatus === "Ready",
  ).length;
  const readyForBridge = sortedEntries.filter(
    (entry) => entry.replyQualificationStatus === "Ready",
  ).length;
  const linkedProspectCount = sortedEntries.filter((entry) => entry.matchedProspectId).length;
  const replayedCount = replayHistory.filter((record) =>
    sortedEntries.some((entry) => entry.fingerprint === record.fingerprint),
  ).length;

  const metrics = [
    {
      label: "Mirrored packets",
      value: `${sortedEntries.length}`,
      score: percent(Math.min(sortedEntries.length, 4), 4),
      target: "The machine rail should build durable packet memory instead of forcing manual re-paste every time.",
    },
    {
      label: "Protected mirror readiness",
      value: `${readyForProtectedMirror}/${Math.max(1, sortedEntries.length)}`,
      score: percent(readyForProtectedMirror, Math.max(1, sortedEntries.length)),
      target: "Most mirrored packets should preserve enough identity to be trusted as protected inbound memory.",
    },
    {
      label: "Business-linked packets",
      value: `${linkedProspectCount}/${Math.max(1, sortedEntries.length)}`,
      score: percent(linkedProspectCount, Math.max(1, sortedEntries.length)),
      target: "The durable mirror should know which business row the packet belongs to before automation depends on it.",
    },
    {
      label: "Reply bridge readiness",
      value: `${readyForBridge}/${Math.max(1, sortedEntries.length)}`,
      score: percent(readyForBridge, Math.max(1, sortedEntries.length)),
      target: "Mirrored packets should already be useful to the reply bridge before any live inbox connector exists.",
    },
    {
      label: "Replayed packets",
      value: `${replayedCount}`,
      score: sortedEntries.length === 0 ? 0 : percent(replayedCount, Math.max(1, sortedEntries.length)),
      target: "Replay history should stay explicit so the same packet is not consumed twice by accident.",
    },
  ];

  return {
    readiness:
      sortedEntries.length === 0 ? 0 : Math.round(metrics.reduce((sum, item) => sum + item.score, 0) / metrics.length),
    title:
      sortedEntries.length === 0
        ? "Protected inbound mirror is waiting for the first business packet"
        : readyForBridge > 0
          ? "Protected inbound mirror can already feed CityAtlas safely"
          : "Protected inbound mirror still needs cleaner packet identity",
    summary:
      sortedEntries.length === 0
        ? "Mirror a normalized business packet first so CityAtlas can keep durable local reply memory before any live inbox lane exists."
        : readyForBridge > 0
          ? "CityAtlas now has durable local packet memory for business replies. The reply bridge can reason from mirrored packets instead of a one-off raw payload preview."
          : "CityAtlas mirrored the packet locally, but it still needs cleaner identity or prospect matching before the reply bridge should trust it.",
    nextAction:
      sortedEntries.length === 0
        ? "Mirror at least one normalized business packet in preview."
        : readyForBridge > 0
          ? "Keep this mirror private, confirm the business match, then replay only the packet rows that are genuinely ready."
          : sortedEntries[0]?.nextSafeAction || "Preserve cleaner sender identity before trusting this mirror lane.",
    automationGuardrail:
      "This mirror lane is local-only and non-sending. It stores preview packet memory but does not contact, reply to, or sync anyone from this state.",
    metrics,
    entries: sortedEntries,
    replyPreview,
    guidance: [
      "Protected mirror first: store the packet durably before letting any automation depend on it.",
      "Reply bridge second: the local reply machine should read mirrored packet memory, not raw provider payloads.",
      "Live inbox connectors, follow-ups, and real sending stay separate and approval-gated.",
    ],
  };
}

export function buildBusinessReplyBridgeReport({
  mirroredEntries,
  replayHistory,
  prospects,
}: {
  mirroredEntries: BusinessInboundMirrorEntry[];
  replayHistory: BusinessReplyBridgeReplayRecord[];
  prospects: BusinessProspect[];
}): BusinessReplyBridgeReport {
  const entries = compactBusinessProtectedInboundMirrorEntries(mirroredEntries);
  const replayedByFingerprint = new Map(
    replayHistory.map((record) => [record.fingerprint, record]),
  );
  const fingerprintCounts = new Map<string, number>();
  entries.forEach((entry) =>
    fingerprintCounts.set(entry.fingerprint, (fingerprintCounts.get(entry.fingerprint) || 0) + 1),
  );
  const replyPreview = buildBusinessReplyInboxImportPreview(
    entries.map((entry, index) => toReplyImportInputFromMirror(entry, index)),
    prospects,
  );

  const rows = entries.map((entry, index) => {
    const previewRow = replyPreview.rows[index];
    const replayRecord = replayedByFingerprint.get(entry.fingerprint);
    const duplicateWithinMirror = (fingerprintCounts.get(entry.fingerprint) || 0) > 1;

    let status: BusinessReplyBridgeStatus;
    let reason: string;
    let nextSafeAction: string;

    if (replayRecord) {
      status = "Replayed";
      reason = "This mirrored packet was already replayed into local business reply memory.";
      nextSafeAction = "Review the saved business reply memory instead of replaying this packet again.";
    } else if (duplicateWithinMirror) {
      status = "Duplicate";
      reason = "This packet fingerprint appears more than once in mirrored memory.";
      nextSafeAction = "Review the duplicate source before replaying anything.";
    } else if (entry.protectedIngestionStatus !== "Ready" || entry.payloadStatus === "Invalid") {
      status = "Blocked";
      reason = entry.protectedReason;
      nextSafeAction = entry.nextSafeAction;
    } else if (!previewRow) {
      status = "Blocked";
      reason = "The bridge could not create a preview row for this packet.";
      nextSafeAction = "Preserve the required packet fields before replay.";
    } else if (previewRow.status === "Ready") {
      status = "Bridge ready";
      reason = "The mirrored packet is durable, business-linked, and clean enough to replay into local business reply memory.";
      nextSafeAction = "Replay this packet locally, then review the inferred sentiment and next step.";
    } else if (previewRow.status === "Needs review") {
      status = "Review needed";
      reason = previewRow.reason;
      nextSafeAction = "Resolve the business match or sender identity before replaying this packet.";
    } else {
      status = "Blocked";
      reason = previewRow.reason;
      nextSafeAction = "Fix the blocked reply requirement before replaying this packet.";
    }

    return {
      entry,
      status,
      reason,
      nextSafeAction,
      canReplay: status === "Bridge ready" && Boolean(previewRow?.canIngest),
      duplicate: status === "Duplicate",
      matchedProspectId: previewRow?.matchedProspect?.id || entry.matchedProspectId || "",
      matchedBusinessName:
        previewRow?.matchedProspect?.businessName || entry.matchedBusinessName || "",
      replayedAt: replayRecord?.replayedAt,
      replyPreviewRow: previewRow,
    } satisfies BusinessReplyBridgeRow;
  });

  const bridgeReadyCount = rows.filter((row) => row.canReplay).length;
  const replayedCount = rows.filter((row) => row.status === "Replayed").length;
  const reviewCount = rows.filter((row) => row.status === "Review needed").length;
  const blockedCount = rows.filter((row) => row.status === "Blocked").length;
  const duplicateCount = rows.filter((row) => row.status === "Duplicate").length;

  const metrics = [
    {
      label: "Bridge-ready packets",
      value: `${bridgeReadyCount}/${Math.max(1, rows.length)}`,
      score: percent(bridgeReadyCount, Math.max(1, rows.length)),
      target: "Only business-linked, non-duplicate packets should be replayable.",
    },
    {
      label: "Replayed packets",
      value: `${replayedCount}`,
      score: rows.length === 0 ? 0 : percent(replayedCount, Math.max(1, rows.length)),
      target: "Replay history should stay explicit so CityAtlas does not re-process the same packet silently.",
    },
    {
      label: "Review debt",
      value: `${reviewCount} review / ${blockedCount} blocked / ${duplicateCount} duplicate`,
      score:
        rows.length === 0
          ? 0
          : Math.max(0, 100 - reviewCount * 18 - blockedCount * 22 - duplicateCount * 16),
      target: "Ambiguous packets should stay review-first before anything becomes more automatic.",
    },
    {
      label: "Reply-preview readiness",
      value: `${replyPreview.readiness}%`,
      score: replyPreview.readiness,
      target: "The downstream business reply lane should already understand mirrored packets before live inbox work exists.",
    },
  ];

  return {
    readiness:
      rows.length === 0 ? 0 : Math.round(metrics.reduce((sum, item) => sum + item.score, 0) / metrics.length),
    title:
      rows.length === 0
        ? "Shared business reply bridge is waiting for mirrored packets"
        : bridgeReadyCount > 0
          ? "Shared business reply bridge can replay packets safely"
          : "Shared business reply bridge still needs cleaner packet identity",
    summary:
      rows.length === 0
        ? "Mirror a business packet first so the reply bridge has durable memory to read from."
        : bridgeReadyCount > 0
          ? "CityAtlas can now replay eligible mirrored packets into local business reply memory without touching a live inbox or send rail."
          : "CityAtlas sees the mirrored packet, but it still needs cleaner identity or business matching before replay should happen.",
    nextAction:
      rows.length === 0
        ? "Mirror at least one business packet first."
        : bridgeReadyCount > 0
          ? "Replay only the bridge-ready packets, then review the inferred reply memory locally."
          : rows[0]?.nextSafeAction || "Fix the blocked packet identity before replaying anything.",
    automationGuardrail:
      "This bridge stays local-only and approval-gated. It replays mirrored packet memory into CityAtlas reply memory only, not a live inbox, CRM, or follow-up engine.",
    metrics,
    rows,
    replayPreview: replyPreview,
    guidance: [
      "Keep the bridge local-only until live sending and live reply handling are separately approved.",
      "Use replay to build durable business reply memory, not to trigger follow-ups automatically.",
      "Treat Gmail as fallback and manual escalation only even if future machine rails use Resend.",
    ],
  };
}

export function inferBusinessReplySentiment(
  text: string,
): BusinessReplyLog["sentiment"] {
  const normalized = normalize(text);

  if (/mail delivery|undeliverable|delivery has failed|mailbox unavailable/.test(normalized)) {
    return "bounce";
  }
  if (/wrong person|wrong contact|not the right person|not the right contact/.test(normalized)) {
    return "wrong_contact";
  }
  if (/unsubscribe|remove me|privacy|spam|complaint/.test(normalized)) {
    return "concern";
  }
  if (/not interested|no thanks|no thank you|pass on this/.test(normalized)) {
    return "no_interest";
  }
  if (/next month|later|tight this week|not right now|circle back/.test(normalized)) {
    return "not_now";
  }
  if (/interested|sounds good|would love|keen|let'?s talk|send details/.test(normalized)) {
    return "positive_interest";
  }
  if (/tell me more|more detail|more info|curious/.test(normalized)) {
    return "positive_info";
  }
  return "neutral";
}

export function inferBusinessProspectOutreachStatus(
  sentiment: BusinessReplyLog["sentiment"],
): BusinessProspect["outreachStatus"] {
  if (sentiment === "no_interest" || sentiment === "concern") {
    return "do_not_contact";
  }
  if (sentiment === "bounce" || sentiment === "wrong_contact") {
    return "held";
  }
  return "replied";
}

export function buildBusinessReplyLogDraftFromMirrorEntry(
  entry: BusinessInboundMirrorEntry,
): Omit<BusinessReplyLog, "id" | "createdAt"> | null {
  if (!entry.matchedProspectId || !entry.matchedBusinessName) {
    return null;
  }

  const sentiment = inferBusinessReplySentiment(
    `${entry.subject}\n${entry.replyText}`.trim(),
  );

  return {
    prospectId: entry.matchedProspectId,
    businessName: entry.matchedBusinessName,
    channel: "email",
    sentiment,
    messageVersion: "resend-inbound-preview-v1",
    summary: summarizeReplyText(entry.replyText),
    replyText: cleanText(entry.replyText, 4000),
    nextStep: entry.nextSafeAction,
    source: "resend_preview_bridge",
    sourceRail: "Resend",
    sourceType: entry.sourceType,
    messageId: entry.messageId,
    threadId: entry.threadId,
    receivedAt: entry.receivedAt,
  };
}

export function buildBusinessReplyBridgeReplayDraft(
  entry: BusinessInboundMirrorEntry,
): Omit<BusinessReplyBridgeReplayRecord, "id"> {
  return {
    schemaVersion: BUSINESS_OUTREACH_SCHEMAS.replyBridgeEnvelope,
    fingerprint: entry.fingerprint,
    sourceRail: "Resend",
    sourceType: entry.sourceType,
    messageId: entry.messageId,
    threadId: entry.threadId,
    prospectId: entry.matchedProspectId,
    businessName: entry.matchedBusinessName,
    status: "Replayed",
    detail: `Replayed ${entry.matchedBusinessName || entry.email || "a business reply"} into local CityAtlas business reply memory from the protected mirror lane.`,
    replayedAt: new Date().toISOString(),
  };
}

function buildBusinessReplyPreviewRow(
  rowNumber: number,
  input: BusinessReplyImportInput,
  prospects: BusinessProspect[],
): BusinessReplyPreviewRow {
  if (!input.replyText.trim()) {
    return {
      rowNumber,
      input,
      status: "Blocked",
      reason: "Reply text is missing.",
      canIngest: false,
    };
  }

  const exactEmailMatch = input.email.trim()
    ? prospects.find((prospect) => normalize(prospect.email) === normalize(input.email))
    : undefined;
  const exactContactNameMatch = input.name.trim()
    ? prospects.find(
        (prospect) =>
          prospect.contactName &&
          normalize(prospect.contactName) === normalize(input.name),
      )
    : undefined;
  const exactBusinessNameMatch = input.name.trim()
    ? prospects.find(
        (prospect) => normalize(prospect.businessName) === normalize(input.name),
      )
    : undefined;
  const matchedProspect =
    exactEmailMatch || exactContactNameMatch || exactBusinessNameMatch;

  if (!matchedProspect) {
    return {
      rowNumber,
      input,
      status: "Needs review",
      reason: "No clean business-prospect match yet. Use the exact contact email or the stored public contact name first.",
      canIngest: false,
    };
  }

  const conflictingMatchIds = new Set(
    [exactEmailMatch, exactContactNameMatch, exactBusinessNameMatch]
      .filter(Boolean)
      .map((prospect) => prospect!.id),
  );
  if (conflictingMatchIds.size > 1) {
    return {
      rowNumber,
      input,
      matchedProspect,
      status: "Needs review",
      reason: "Email and identity fields point to different business rows. Fix the row before replaying it.",
      canIngest: false,
    };
  }

  return {
    rowNumber,
    input,
    matchedProspect,
    status: "Ready",
    reason:
      matchedProspect.outreachStatus === "do_not_contact"
        ? "Matched a protected business row. Replay is still useful for memory, but any follow-up stays blocked."
        : exactEmailMatch
          ? "Matched by exact business email."
          : exactContactNameMatch
            ? "Matched by exact public contact name."
            : "Matched by exact business name.",
    canIngest: true,
  };
}

function buildBusinessInboundAdapterRow(
  packet: BusinessInboundPacket,
  previewRow: BusinessReplyPreviewRow | undefined,
  sourceType: BusinessInboundSourceType,
): BusinessInboundAdapterRow {
  const identityMissing = collectMissingIdentity(packet, sourceType);
  const payloadValid = sourceType === "resend_event" || sourceType === "resend_events";
  const protectedReady = payloadValid && identityMissing.length === 0;
  const qualificationReady = protectedReady && Boolean(previewRow?.canIngest);

  return {
    rowNumber: packet.rowNumber,
    packet,
    payloadStatus: payloadValid ? (identityMissing.length === 0 ? "Valid" : "Needs identity") : "Invalid",
    protectedIngestionStatus: protectedReady ? "Ready" : "Hold",
    replyQualificationStatus: qualificationReady ? "Ready" : "Hold",
    identityMissing,
    nextSafeAction:
      qualificationReady
        ? "Keep this packet in preview, mirror it locally, then replay it into business reply memory only if the business match is correct."
        : !payloadValid
          ? "Use the Resend email.received payload shape first."
          : identityMissing.length > 0
            ? `Preserve ${identityMissing.join(", ")} before trusting this packet.`
            : previewRow?.reason || "Match this sender to a CityAtlas business row before replay.",
    matchedProspectId: previewRow?.matchedProspect?.id || "",
    matchedBusinessName: previewRow?.matchedProspect?.businessName || "",
    protectedReason:
      protectedReady
        ? "This payload preserves sender, message, reply text, and timing identity well enough for protected local mirror memory."
        : identityMissing.length > 0
          ? `Missing ${identityMissing.join(", ")}.`
          : "The payload still does not look like a trustworthy Resend inbound event.",
    qualificationReason:
      qualificationReady
        ? "The normalized row is already clean enough for CityAtlas business reply memory in preview mode."
        : previewRow?.reason || "CityAtlas still needs a cleaner business match before the reply bridge should trust this row.",
  };
}

function parseBusinessInboundPayload(rawText: string): {
  sourceType: BusinessInboundSourceType;
  inputs: BusinessInboundPacket[];
} {
  if (!rawText.trim()) {
    return { sourceType: "empty", inputs: [] };
  }

  try {
    const parsed = JSON.parse(rawText);
    if (Array.isArray(parsed)) {
      if (parsed.every(looksLikeResendEvent)) {
        return {
          sourceType: "resend_events",
          inputs: parsed.map((entry, index) => normalizeResendEvent(entry, index)),
        };
      }
      return {
        sourceType: "structured_rows",
        inputs: parsed.map((entry, index) => normalizeStructuredRow(entry, index)),
      };
    }

    if (isPlainObject(parsed) && Array.isArray(parsed.rows)) {
      const rows = parsed.rows as unknown[];
      if (rows.every(looksLikeResendEvent)) {
        return {
          sourceType: "resend_events",
          inputs: rows.map((entry, index) => normalizeResendEvent(entry, index)),
        };
      }
      return {
        sourceType: "structured_rows",
        inputs: rows.map((entry, index) => normalizeStructuredRow(entry, index)),
      };
    }

    if (looksLikeResendEvent(parsed)) {
      return {
        sourceType: "resend_event",
        inputs: [normalizeResendEvent(parsed, 0)],
      };
    }

    if (isPlainObject(parsed)) {
      return {
        sourceType: "structured_rows",
        inputs: [normalizeStructuredRow(parsed, 0)],
      };
    }
  } catch {
    return { sourceType: "invalid", inputs: [] };
  }

  return { sourceType: "invalid", inputs: [] };
}

function normalizeResendEvent(entry: unknown, index: number): BusinessInboundPacket {
  const event = isPlainObject(entry) ? entry : {};
  const data = isPlainObject(event.data) ? event.data : event;
  const headers = isPlainObject(data.headers) ? data.headers : {};
  const from = parseFromField(String(data.from || data.email || ""));

  return {
    rowNumber: index + 1,
    sourceType: "resend_inbound",
    messageId: cleanText(headers["Message-ID"] || data.email_id || data.id, 180),
    threadId: cleanText(
      headers["In-Reply-To"] || headers.References || data.thread_id || data.email_id || data.id,
      180,
    ),
    email: cleanText(from.email, 180),
    name: cleanText(from.name, 180),
    subject: cleanText(data.subject, 240),
    replyText: cleanText(data.text || data.reply_text || data.body || "", 4000),
    receivedAt: cleanText(data.created_at || data.received_at || "", 80),
    mailbox: cleanText(data.mailbox || "INBOUND", 120),
    labels: normalizeLabels(data.tags || data.labels || []),
  };
}

function normalizeStructuredRow(entry: unknown, index: number): BusinessInboundPacket {
  const row = isPlainObject(entry) ? entry : {};

  return {
    rowNumber: index + 1,
    sourceType: cleanText(row.source_type || row.sourceType || "structured_row", 80),
    messageId: cleanText(row.message_id || row.messageId || row.id, 180),
    threadId: cleanText(row.thread_id || row.threadId || row.conversation_id || "", 180),
    email: cleanText(row.email || row.from || "", 180),
    name: cleanText(row.name || row.sender || "", 180),
    subject: cleanText(row.subject || "", 240),
    replyText: cleanText(row.reply_text || row.replyText || row.text || row.body || "", 4000),
    receivedAt: cleanText(row.received_at || row.receivedAt || "", 80),
    mailbox: cleanText(row.mailbox || row.folder || "INBOUND", 120),
    labels: normalizeLabels(row.labels || row.tags || []),
  };
}

function looksLikeResendEvent(row: unknown) {
  if (!isPlainObject(row)) return false;
  if (row.type === "email.received" && isPlainObject(row.data)) return true;

  const data = isPlainObject(row.data) ? row.data : row;
  return Boolean(data.email_id || data.from || data.created_at);
}

function toReplyImportInput(packet: BusinessInboundPacket): BusinessReplyImportInput {
  return {
    rowNumber: packet.rowNumber,
    sourceType: packet.sourceType,
    messageId: packet.messageId,
    threadId: packet.threadId,
    email: packet.email,
    name: packet.name,
    subject: packet.subject,
    replyText: packet.replyText,
    receivedAt: packet.receivedAt,
    mailbox: packet.mailbox,
    labels: packet.labels,
  };
}

function toReplyImportInputFromMirror(
  entry: BusinessInboundMirrorEntry,
  index: number,
): BusinessReplyImportInput {
  return {
    rowNumber: index + 1,
    sourceType: `${entry.sourceType}:protected_mirror`,
    messageId: entry.messageId,
    threadId: entry.threadId,
    email: entry.email,
    name: entry.name,
    subject: entry.subject,
    replyText: entry.replyText,
    receivedAt: entry.receivedAt,
    mailbox: entry.mailbox,
    labels: entry.labels,
  };
}

function parseFromField(value: string) {
  const trimmed = String(value || "").trim();
  const match = trimmed.match(/^(.*?)<([^>]+)>$/);
  if (!match) {
    return {
      name: trimmed.includes("@") ? "" : trimmed,
      email: trimmed.includes("@") ? trimmed : "",
    };
  }

  return {
    name: cleanText(match[1], 180),
    email: cleanText(match[2], 180),
  };
}

function collectMissingIdentity(
  packet: BusinessInboundPacket,
  sourceType: BusinessInboundSourceType,
) {
  const missing: string[] = [];
  if (!(sourceType === "resend_event" || sourceType === "resend_events")) {
    missing.push("payload shape");
  }
  if (!packet.messageId.trim() && !packet.threadId.trim()) {
    missing.push("message identity");
  }
  if (!packet.email.trim()) {
    missing.push("sender email");
  }
  if (!packet.replyText.trim()) {
    missing.push("reply text");
  }
  if (!packet.receivedAt.trim()) {
    missing.push("received time");
  }
  return missing;
}

function fingerprintBusinessInboundPacket(packet: {
  messageId?: string;
  threadId?: string;
  email?: string;
  receivedAt?: string;
  subject?: string;
  replyText?: string;
}) {
  if (normalize(packet.messageId || "")) {
    return `message:${normalize(packet.messageId || "")}`;
  }

  return [
    normalize(packet.threadId || ""),
    normalize(packet.email || ""),
    normalize(packet.receivedAt || ""),
    normalize(packet.subject || ""),
    normalize(firstSentence(packet.replyText || "", 120)),
  ]
    .filter(Boolean)
    .join("|");
}

function createMirrorId(fingerprint: string, rowNumber: number) {
  return `mirror-${rowNumber}-${fingerprint || "unknown"}`;
}

function firstSentence(text: string, limit: number) {
  return cleanText(text, limit).split(/[.!?]/)[0] || "";
}

function summarizeReplyText(text: string) {
  const cleaned = cleanText(text, 240);
  if (!cleaned) return "No reply text captured yet.";
  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned;
}

function normalizeLabels(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((value) => cleanText(value, 80)).filter(Boolean);
  }

  return String(input || "")
    .split(/[|,]/g)
    .map((value) => cleanText(value, 80))
    .filter(Boolean);
}

function cleanText(input: unknown, maxLength: number) {
  return String(input || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalize(value: string) {
  return String(value || "").trim().toLowerCase();
}

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
