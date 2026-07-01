import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function has(path) {
  return existsSync(join(root, path));
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function readJson(path) {
  return JSON.parse(read(path));
}

const src = {
  packageJson: read("package.json"),
  siteConfig: read("src/config/site.ts"),
  seed: read("src/data/seed.ts"),
  app: read("src/app/CityAtlasApp.tsx"),
};

const seoProof = has("output/seo/local-content-machine-proof.json")
  ? readJson("output/seo/local-content-machine-proof.json")
  : null;

const modules = [
  {
    name: "SEO content machine",
    progress: seoProof?.passed ? 96 : 82,
    done: seoProof?.passed
      ? `Local proof confirms ${seoProof.usefulPieceCount} useful pieces, ${seoProof.guideCount} guides, ${seoProof.sourceBackedCollectionCount} source-backed collections, crawl-file coverage, guide proof fields, and five-anchor integrity across every source-backed wedge.`
      : "Query map, guide cluster, source-backed wedges, crawl files, and local proof command are in place.",
    remains: seoProof?.passed
      ? "Hosted metadata proof and hosted crawl verification for queued routes."
      : "A passing local content-machine proof artifact plus hosted verification for queued routes.",
    next: seoProof?.passed
      ? "Keep npm run seo:proof green, then use the first source-backed release packet when the next live approval window opens."
      : "Run npm run seo:proof and fix any local content-machine integrity failures before widening the queue.",
  },
  {
    name: "Public product",
    progress: 98,
    done: "Public app, City Missions, business flow, draft terms/privacy, crawl assets, live crawlable Univenture subdomain, HTTPS, robots.txt, route-level noindex guards, hosted owner-route guard, CityAtlas logo, favicon, and brand guide.",
    remains: "Real source-approved inventory, stronger social preview image, and more source-backed destination pages.",
    next: "Expand source-backed guides and destination pages now that the approved domain is crawlable.",
  },
  {
    name: "Date Night proof sprint",
    progress: 96,
    done: "Wedge, candidate queue, private preview, proof docs, generated 10-prospect packet, contact-path research, shadow outreach ranking, first six owner-approved manual direct-email sends, live-send ledger, and reply response kit.",
    remains: "Reply evidence, bounce/wrong-contact review, held contact-path confirmation, and any separately approved follow-up batch.",
    next: "Monitor Gmail for replies and bounces, log outcomes in /admin, then run npm run replies:analyze before approving any follow-up or second batch.",
  },
  {
    name: "Founder CRM",
    progress: 93,
    done: "Candidate scoring, source links, route angles, contact-path confidence tags, shadow send/no-send roles, reply tracker with bounce logging, sent-ledger artifact, first manual send statuses in the admin seed state, and response templates.",
    remains: "Real reply history, objection clustering, bounce handling, follow-up reminders, and held contact confirmation.",
    next: "Use the admin reply tracker or CSV template as replies arrive, then run npm run replies:analyze.",
  },
  {
    name: "AI Brain",
    progress: 92,
    done: "Local command engine, QA checks, saved Brain Runs, readiness report, hosted-domain proof awareness, contact-readiness checks, package-demand signal checks, shadow-mode outreach decisioning, post-send monitoring state, and bounce/wrong-contact repair recommendations.",
    remains: "Real reply-based learning, outcome comparison against owner picks, provider-backed summaries after approval.",
    next: "Compare the generated shadow ranking against logged reply outcomes after the first manual batch.",
  },
  {
    name: "Revenue system",
    progress: 92,
    done: "Package framing, draft terms/privacy, Stripe product manifest, accepted Stripe Billing/Checkout plan, live CAD pricing, confirmed live CityAtlas product and recurring price IDs, live Stripe-hosted payment links for both paid packages, local live-payment env wiring, env-gated payment-link handoff support on the public business funnel, local payment-handoff verification, hosted payment-handoff verification, public pricing-page checkout CTA cutover on the approved domain, local request-copy campaign-attribution proof, Date Night revenue proof loop, and reply-summary command.",
    remains: "Final refund policy, one real checkout proof, clean hosted proof after the latest local attribution hardening is released, and first real paid-click quality review.",
    next: "Keep the tiny paid test request-first, prove one real City Partner checkout separately before self-serve charging claims, and rerun hosted proof after any approved release.",
  },
  {
    name: "Launch infrastructure",
    progress: 96,
    done: "Univenture folder, Vercel project, public alias, protected preview, hosted route flags, Cloudflare DNS, Vercel alias, HTTPS certificate, custom-domain smoke, public crawlable robots release, and consent-gated hosted GA script/instrumentation proof.",
    remains: "Provider-side GA/Ads conversion receipt before scaling spend, clean release-lane proof before deploy, and ongoing crawl/index monitoring.",
    next: "Keep admin/private-preview protected, rerun hosted analytics/payment proof after approved releases, and publish stronger source-backed pages.",
  },
  {
    name: "Data/source policy",
    progress: 76,
    done: "Source policy, schema draft, privacy posture, fictional-data labels, source-backed proof packet, contact verification rules, official contact-path research, shadow-ranking guardrails, and lead-storage activation packet.",
    remains: "Approved provider, budget, import rights, correction/removal workflow, protected backend, hosted admin authentication.",
    next: "Use the backend activation packet before approving Supabase/provider writes or durable lead storage.",
  },
];

const average = Math.round(
  modules.reduce((total, module) => total + module.progress, 0) / modules.length,
);

const report = {
  generatedAt: new Date().toISOString(),
  average,
  modules,
  evidenceChecks: {
    publicPages: has("src/features/public/HomePage.tsx") && has("src/features/legal/LegalPages.tsx"),
    privatePreview: has("src/features/private/DateNightPreviewPage.tsx"),
    aiBrain: has("src/lib/aiBrain.ts") && src.app.includes("onSaveBrainRun"),
    stripeManifest: has("stripe/products.review.json"),
    paymentHandoffVerification: has("scripts/verify-live-payment-handoff.mjs"),
    hostedPaymentHandoffVerification: has("scripts/verify-hosted-payment-handoff.mjs") &&
      has("output/qa/hosted-payment-handoff.json"),
    proofSprintPacket: has("docs/proof-sprints/DATE_NIGHT_10_PROSPECT_PACKET.md") &&
      has("output/proof-sprints/date-night-vancouver-10-prospect-packet.json"),
    proofSprintContactResearch: has("docs/proof-sprints/DATE_NIGHT_CONTACT_PATHS_RESEARCH.md") &&
      has("output/proof-sprints/date-night-contact-paths.json"),
    proofSprintShadowRanking: has("docs/proof-sprints/DATE_NIGHT_SHADOW_OUTREACH_RANKING.md") &&
      has("output/proof-sprints/date-night-shadow-outreach-ranking.json"),
    proofSprintReplySummary: has("docs/proof-sprints/DATE_NIGHT_REPLY_SUMMARY.md") &&
      has("output/proof-sprints/date-night-reply-summary.json"),
    proofSprintLiveSendLedger: has("docs/proof-sprints/DATE_NIGHT_LIVE_SEND_LEDGER.md") &&
      has("output/proof-sprints/date-night-live-send-ledger.json"),
    proofSprintReplyResponseKit: has("docs/proof-sprints/DATE_NIGHT_REPLY_RESPONSE_KIT.md") &&
      has("output/proof-sprints/date-night-reply-response-kit.json"),
    revenueProofLoop: has("docs/revenue/DATE_NIGHT_REVENUE_PROOF_LOOP.md") &&
      has("output/revenue/date-night-revenue-proof-loop.json"),
    seoContentMachineProof: seoProof?.passed === true,
    brandGuide: has("docs/brand/BRAND_GUIDE.md") &&
      has("docs/brand/ASSET_MANIFEST.md") &&
      has("public/brand/cityatlas-mark.svg") &&
      has("public/brand/cityatlas-lockup.svg") &&
      has("public/favicon.svg"),
    leadStorageActivationPacket: has("docs/backend/LEAD_STORAGE_ACTIVATION_PACKET.md"),
    hostedRouteGuard: src.siteConfig.includes("VITE_CITYATLAS_ENABLE_HOSTED_ADMIN") &&
      src.app.includes("canShowHostedAdmin"),
    hostedDeploymentStatus: has("docs/HOSTED_DEPLOYMENT_STATUS.md") &&
      has(".vercel/project.json"),
    hostingPacket: src.siteConfig.includes("city.univenturestudio.com") &&
      has("docs/HOSTING_DNS_APPROVAL_PACKET.md"),
    sourcePolicy: has("docs/REAL_WORLD_SOURCE_POLICY.md") && has("supabase/schema.sql"),
  },
  liveBlocked: [
    "first real live City Partner checkout proof",
    "provider-side GA/Ads conversion receipt before scaling paid traffic",
    "fresh clean release lane before any deploy or push",
    "real provider import",
    "additional customer outreach or follow-ups",
    "public real-business publication",
  ],
  nextBestBatch:
    seoProof?.passed === true
      ? "Use a fresh release lane to carry the local attribution hardening through approved deploy proof, keep the first paid test tiny and request-first, and prove one real City Partner checkout separately before self-serve charging claims."
      : "Fix the local SEO content-machine proof first, then keep expanding only with source-backed destination pages that official public sources can honestly support.",
};

mkdirSync(join(root, "output/readiness"), { recursive: true });
writeFileSync(join(root, "output/readiness/latest.json"), `${JSON.stringify(report, null, 2)}\n`);

const rows = modules
  .map(
    (module) =>
      `| ${module.name} | ${module.progress}% | ${module.done} | ${module.remains} | ${module.next} |`,
  )
  .join("\n");

writeFileSync(
  join(root, "docs/READINESS_PROGRESS.md"),
  `# CityAtlas Readiness Progress\n\nGenerated: ${report.generatedAt}\n\nAverage module progress: ${average}%\n\n## SEO Content Machine Proof\n\n- Proof artifact: ${seoProof ? "`output/seo/local-content-machine-proof.json`" : "not generated yet"}\n- Status: ${seoProof?.passed ? "pass" : "not yet proven"}\n${seoProof ? `- Useful pieces: ${seoProof.usefulPieceCount}\n- Guides: ${seoProof.guideCount}\n- Source-backed collections: ${seoProof.sourceBackedCollectionCount}\n- Source-backed places: ${seoProof.sourceBackedPlaceCount}\n- Failures: ${seoProof.failures.length}\n` : ""}\n| Module | Progress | Done | Remains | Next |\n| --- | ---: | --- | --- | --- |\n${rows}\n\n## Still Live-Blocked\n\n${report.liveBlocked.map((item) => `- ${item}`).join("\n")}\n\n## Next Best Batch\n\n${report.nextBestBatch}\n`,
);

console.log(`CityAtlas readiness average: ${average}%`);
for (const module of modules) {
  console.log(`- ${module.name}: ${module.progress}%`);
}
