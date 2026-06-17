import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const replyCsvPath =
  process.env.CITYATLAS_REPLY_LOG_CSV ||
  "output/proof-sprints/date-night-reply-log-template.csv";
const packetPath = "output/proof-sprints/date-night-vancouver-10-prospect-packet.json";

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function readCsvRows(path) {
  const absolute = join(root, path);
  if (!existsSync(absolute)) return [];
  const rows = parseCsv(readFileSync(absolute, "utf8"));
  const [headers, ...records] = rows;
  if (!headers) return [];
  return records
    .map((record) =>
      Object.fromEntries(
        headers.map((header, index) => [header.trim(), (record[index] ?? "").trim()]),
      ),
    )
    .filter((record) => Object.values(record).some(Boolean));
}

function readCandidateMap() {
  const absolute = join(root, packetPath);
  if (!existsSync(absolute)) return new Map();
  const packet = JSON.parse(readFileSync(absolute, "utf8"));
  return new Map(
    (packet.rankedProspects ?? []).map((candidate) => [
      candidate.id,
      {
        name: candidate.name,
        segment: candidate.segment,
        routeAngle: candidate.routeAngle,
        fitScore: candidate.fitScore,
        contactConfidence: candidate.contactConfidence,
      },
    ]),
  );
}

function yes(value) {
  return /^(1|true|yes|y|requested|interested)$/i.test(String(value ?? "").trim());
}

function countBy(rows, keyFn) {
  return rows.reduce((counts, row) => {
    const key = keyFn(row) || "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

const rows = readCsvRows(replyCsvPath);
const candidateMap = readCandidateMap();
const packagePattern = /price|pricing|package|partner|cost|paid|subscription|membership/i;
const previewPattern = /preview|demo|screen.?share|walkthrough|show me|see it/i;

const enrichedRows = rows.map((row) => {
  const candidate = candidateMap.get(row.candidate_id) ?? {};
  const text = `${row.objection ?? ""} ${row.next_action ?? ""} ${row.notes ?? ""}`;
  return {
    ...row,
    candidate_name: row.candidate_name || candidate.name || row.candidate_id || "Unknown",
    segment: candidate.segment || "unknown",
    route_angle: candidate.routeAngle || "",
    fit_score: candidate.fitScore ?? "",
    contact_confidence: row.contact_confidence || candidate.contactConfidence || "unknown",
    has_package_signal: yes(row.package_or_pricing_signal) || packagePattern.test(text),
    has_private_preview_signal: yes(row.private_preview_requested) || previewPattern.test(text),
  };
});

const repliedRows = enrichedRows.filter((row) => row.reply_at || row.sentiment);
const meaningfulRows = enrichedRows.filter((row) =>
  ["positive_demo", "positive_info", "neutral"].includes(row.sentiment),
);
const positiveRows = enrichedRows.filter((row) =>
  ["positive_demo", "positive_info"].includes(row.sentiment),
);
const concernRows = enrichedRows.filter((row) => row.sentiment === "concern");
const wrongContactRows = enrichedRows.filter((row) => row.sentiment === "wrong_contact");
const bounceRows = enrichedRows.filter((row) => row.sentiment === "bounce");
const packageSignalRows = enrichedRows.filter((row) => row.has_package_signal);
const privatePreviewRows = enrichedRows.filter((row) => row.has_private_preview_signal);
const sentRows = enrichedRows.filter((row) => row.sent_at || row.channel);
const noReplyRows = sentRows.filter((row) => !row.reply_at && !row.sentiment);

let nextAction = "No reply outcomes are logged yet. Keep outreach, Stripe, provider imports, and public claims gated.";
let confidence = "No signal";

if (concernRows.length > 0) {
  nextAction = "Pause the batch and review the concern before any further message.";
  confidence = "Risk signal";
} else if (bounceRows.length > 0 || wrongContactRows.length > 0) {
  nextAction = "Repair bounced or wrong-contact rows before considering any second batch.";
  confidence = "Contact-path repair needed";
} else if (packageSignalRows.length >= 3) {
  nextAction = "Prepare a Stripe test-mode product approval packet, but do not create Stripe objects yet.";
  confidence = "Qualified package demand";
} else if (meaningfulRows.length >= 5 || privatePreviewRows.length >= 3) {
  nextAction = "Run a supervised follow-up pass and sharpen the founding partner offer.";
  confidence = "Directional demand";
} else if (repliedRows.length > 0) {
  nextAction = "Keep logging outcomes until 10 outcomes, 5 meaningful replies, or one serious concern.";
  confidence = "Early signal";
}

const report = {
  generatedAt: new Date().toISOString(),
  status: "local_reply_summary_no_send",
  inputCsv: replyCsvPath,
  proofSprint: "Vancouver Date Night",
  confidence,
  summary: {
    rows: enrichedRows.length,
    sent: sentRows.length,
    replied: repliedRows.length,
    noReply: noReplyRows.length,
    meaningfulReplies: meaningfulRows.length,
    positiveReplies: positiveRows.length,
    privatePreviewSignals: privatePreviewRows.length,
    packageDemandSignals: packageSignalRows.length,
    wrongContacts: wrongContactRows.length,
    bounces: bounceRows.length,
    concerns: concernRows.length,
  },
  bySegment: countBy(enrichedRows, (row) => row.segment),
  byContactConfidence: countBy(enrichedRows, (row) => row.contact_confidence),
  packageSignalRows: packageSignalRows.map((row) => ({
    candidateId: row.candidate_id,
    candidateName: row.candidate_name,
    nextAction: row.next_action,
  })),
  concernRows: concernRows.map((row) => ({
    candidateId: row.candidate_id,
    candidateName: row.candidate_name,
    objection: row.objection,
    notes: row.notes,
  })),
  bounceRows: bounceRows.map((row) => ({
    candidateId: row.candidate_id,
    candidateName: row.candidate_name,
    nextAction: row.next_action,
    notes: row.notes,
  })),
  nextAction,
  approvalBoundaries: [
    "This summary does not approve more outreach.",
    "This summary does not create Stripe products, prices, checkout, invoices, or payment links.",
    "This summary does not import provider data or sync a CRM.",
    "This summary does not publish real business claims.",
  ],
};

mkdirSync(join(root, "output/proof-sprints"), { recursive: true });
mkdirSync(join(root, "docs/proof-sprints"), { recursive: true });

writeFileSync(
  join(root, "output/proof-sprints/date-night-reply-summary.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

writeFileSync(
  join(root, "docs/proof-sprints/DATE_NIGHT_REPLY_SUMMARY.md"),
  `# Date Night Reply Summary\n\nGenerated: ${report.generatedAt}\n\nStatus: \`${report.status}\`\n\nInput CSV: \`${report.inputCsv}\`\n\n## Summary\n\n- Rows analyzed: ${report.summary.rows}\n- Sent records: ${report.summary.sent}\n- Replies: ${report.summary.replied}\n- No replies: ${report.summary.noReply}\n- Meaningful replies: ${report.summary.meaningfulReplies}\n- Positive replies: ${report.summary.positiveReplies}\n- Private-preview signals: ${report.summary.privatePreviewSignals}\n- Package-demand signals: ${report.summary.packageDemandSignals}\n- Wrong contacts: ${report.summary.wrongContacts}\n- Bounces: ${report.summary.bounces}\n- Concerns: ${report.summary.concerns}\n- Confidence: ${report.confidence}\n\n## Next Action\n\n${report.nextAction}\n\n## Guardrails\n\n${report.approvalBoundaries.map((item) => `- ${item}`).join("\n")}\n\n## Notes\n\nThis is a local analysis artifact. It becomes useful after owner-approved manual outreach outcomes are entered into the CSV or the admin reply tracker.\n`,
);

console.log("Built Date Night reply summary:");
console.log("- docs/proof-sprints/DATE_NIGHT_REPLY_SUMMARY.md");
console.log("- output/proof-sprints/date-night-reply-summary.json");
