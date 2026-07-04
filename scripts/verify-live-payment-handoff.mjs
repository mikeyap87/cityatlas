import { existsSync, readFileSync } from "node:fs";

const ENV_PATH = ".env.local";

const report = {
  generatedAt: new Date().toISOString(),
  passed: false,
  checks: [],
  failures: [],
  env: {},
};

function assert(condition, message) {
  report.checks.push(message);
  if (!condition) {
    report.failures.push(message);
  }
}

function parseEnvFile(path) {
  if (!existsSync(path)) {
    return {};
  }

  const env = {};
  const source = readFileSync(path, "utf8");
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    env[key] = value;
  }

  return env;
}

function summarizeValue(value) {
  return value ? "set" : "missing";
}

function looksLikeStripePaymentLink(value) {
  return /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9/_-]+$/.test(value);
}

const env = parseEnvFile(ENV_PATH);
const livePaymentsFlag = env.VITE_CITYATLAS_ENABLE_LIVE_PAYMENTS;
const cityPartnerLink = env.VITE_STRIPE_CITY_PARTNER_PAYMENT_LINK;
const signaturePartnerLink = env.VITE_STRIPE_SIGNATURE_PARTNER_PAYMENT_LINK;

report.env = {
  envFilePresent: existsSync(ENV_PATH),
  livePaymentsFlag: livePaymentsFlag || "missing",
  cityPartnerPaymentLink: summarizeValue(cityPartnerLink),
  signaturePartnerPaymentLink: summarizeValue(signaturePartnerLink),
};

assert(existsSync(ENV_PATH), ".env.local exists for local payment-handoff verification.");
assert(livePaymentsFlag === "true", "VITE_CITYATLAS_ENABLE_LIVE_PAYMENTS is set to true.");
assert(Boolean(cityPartnerLink), "VITE_STRIPE_CITY_PARTNER_PAYMENT_LINK is populated.");
assert(Boolean(signaturePartnerLink), "VITE_STRIPE_SIGNATURE_PARTNER_PAYMENT_LINK is populated.");

if (cityPartnerLink) {
  assert(
    looksLikeStripePaymentLink(cityPartnerLink),
    "City Partner payment link looks like a Stripe-hosted buy.stripe.com URL.",
  );
}

if (signaturePartnerLink) {
  assert(
    looksLikeStripePaymentLink(signaturePartnerLink),
    "Signature Partner payment link looks like a Stripe-hosted buy.stripe.com URL.",
  );
}

report.passed = report.failures.length === 0;

console.log(JSON.stringify(report, null, 2));

if (!report.passed) {
  process.exit(1);
}
