import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  GREATER_VANCOUVER_SOURCE_RUN_DATE,
  greaterVancouverOfficialSources,
} from "./lib/greater-vancouver-official-sources.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_JSON_PATH = path.resolve(
  __dirname,
  "../output/growth/greater-vancouver-official-source-status.json",
);
const OUTPUT_DOC_PATH = path.resolve(
  __dirname,
  "../docs/seo-aeo-geo/GREATER_VANCOUVER_OFFICIAL_SOURCE_STATUS.md",
);

function buildStatusCounts() {
  const counts = {};
  for (const source of greaterVancouverOfficialSources) {
    counts[source.statusLabel] = (counts[source.statusLabel] ?? 0) + 1;
  }
  return counts;
}

function buildMarkdown(summary) {
  const lines = [
    "# Greater Vancouver Official Source Status",
    "",
    `Updated: ${GREATER_VANCOUVER_SOURCE_RUN_DATE}`,
    "",
    "This is the current official-source truth for the next Greater Vancouver expansion pass. It separates real municipal inventory readiness from portal-only discovery and unresolved source gaps.",
    "",
    "## Current truth",
    "",
    `- Municipalities already wired locally or inventory-ready right now: ${summary.readyLabels.join(", ")}`,
    `- Municipalities with a real official dataset but still blocked on fetch behavior: ${summary.fetchBlockedLabels.length ? summary.fetchBlockedLabels.join(", ") : "None"}`,
    `- Municipalities with only portal proof so far: ${summary.portalOnlyLabels.length ? summary.portalOnlyLabels.join(", ") : "None"}`,
    `- Municipalities still missing a clean official entry point: ${summary.unresolvedLabels.length ? summary.unresolvedLabels.join(", ") : "None"}`,
    "",
    "## Municipality status",
    "",
    "| Municipality | Status | Official source | Live inventory count | Honest read | Blocker |",
    "| --- | --- | --- | --- | --- | --- |",
    ...summary.sources.map((source) => {
      const sourceLabel = source.datasetUrl
        ? `[${source.datasetTitle || "official dataset"}](${source.datasetUrl})`
        : source.officialPortalUrl
          ? `[official portal](${source.officialPortalUrl})`
          : "Unresolved";
      const countLabel = source.verifiedRecordCountLabel || "Not verified";
      return `| ${source.ownerLabel} | ${source.statusLabel} | ${sourceLabel} | ${countLabel} | ${source.proofSummary} | ${source.blocker || "None"} |`;
    }),
    "",
    "## Honest read",
    "",
    "- Burnaby, Surrey, Coquitlam, and Township of Langley are now real official-source expansion lanes, not just donor spillover or note-based guesses.",
    "- Richmond still has official dataset proof now, but it still needs a repeatable public fetch path before it is honest to call it inventory-ready.",
    "- Richmond is no longer a missing-portal problem. The current blocker is token-gated layer access behind otherwise public city web maps and no confirmed public mirror service.",
    "",
    "## Next move",
    "",
    "1. Keep using the official inventory builder for Burnaby, Surrey, Coquitlam, and Township of Langley so those rows stay available as a real local research asset.",
    "2. Resolve Richmond fetch behavior so it can join the same builder instead of living as metadata-only proof.",
    "3. Keep the verified metro inventory live inside the local operator database one municipality slice at a time while official-site research narrows the outreach-worthy subset.",
    "",
  ];

  return lines.join("\n");
}

async function main() {
  const sources = greaterVancouverOfficialSources;
  const summary = {
    ok: true,
    generatedAt: new Date().toISOString(),
    statusCounts: buildStatusCounts(),
    readyLabels: sources
      .filter((source) => source.status === "inventory_already_wired" || source.status === "inventory_ready")
      .map((source) => source.ownerLabel),
    fetchBlockedLabels: sources
      .filter((source) => source.status === "dataset_verified_fetch_blocked")
      .map((source) => source.ownerLabel),
    portalOnlyLabels: sources
      .filter((source) => source.status === "portal_verified_dataset_not_found")
      .map((source) => source.ownerLabel),
    unresolvedLabels: sources
      .filter((source) => source.status === "source_entry_unresolved")
      .map((source) => source.ownerLabel),
    sources,
    outputFiles: {
      summary: OUTPUT_JSON_PATH,
      doc: OUTPUT_DOC_PATH,
    },
  };

  await Promise.all([
    fs.writeFile(OUTPUT_JSON_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
    fs.writeFile(OUTPUT_DOC_PATH, `${buildMarkdown(summary)}\n`, "utf8"),
  ]);

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
