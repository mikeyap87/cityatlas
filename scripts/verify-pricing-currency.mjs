import { readFileSync } from "node:fs";

const checks = [];
const failures = [];

function read(path) {
  return readFileSync(path, "utf8");
}

function assert(condition, message) {
  checks.push(message);
  if (!condition) {
    failures.push(message);
  }
}

const stripeManifest = JSON.parse(read("stripe/products.review.json"));
const seedSource = read("src/data/seed.ts");
const docs = [
  "docs/STRIPE_ACTIVATION_PACKET.md",
  "docs/COMMERCIALIZATION.md",
  "docs/FOUNDER_PARTNER_SALES_PACKET.md",
  "docs/PROJECT.md",
].map((path) => ({ path, source: read(path) }));

assert(stripeManifest.currency === "cad", "Stripe review manifest uses CAD for Vancouver/GVA.");
assert(
  /Vancouver and Greater Vancouver packages use CAD/.test(stripeManifest.pricingPolicy || ""),
  "Stripe review manifest documents CAD for Vancouver/GVA and USD for future US cities.",
);

const cityPartner = stripeManifest.products.find((product) => product.lookupKey === "cityatlas_city_partner_monthly");
const signaturePartner = stripeManifest.products.find(
  (product) => product.lookupKey === "cityatlas_signature_partner_monthly",
);

assert(cityPartner?.amount === 4900, "City Partner amount is 4900 minor units.");
assert(signaturePartner?.amount === 14900, "Signature Partner amount is 14900 minor units.");
assert(cityPartner?.testModePriceId === "price_1TmJ7MI27jKwwm3HgYWjUQTt", "City Partner CAD test price is recorded.");
assert(
  signaturePartner?.testModePriceId === "price_1TmJ7VI27jKwwm3H9xOxfhIe",
  "Signature Partner CAD test price is recorded.",
);

assert(seedSource.includes("$0 CAD / month"), "Community Listing public label includes CAD.");
assert(seedSource.includes("$49 CAD / month on launch"), "City Partner public label includes CAD.");
assert(seedSource.includes("$149 CAD / month on launch"), "Signature Partner public label includes CAD.");

const disallowedPatterns = [
  /\$49\/month planned/,
  /\$149\/month planned/,
  /\$49 \/ month planned/,
  /\$149 \/ month planned/,
  /"currency":\s*"usd"/,
];

for (const { path, source } of docs) {
  assert(/CAD/.test(source), `${path} mentions CAD package pricing.`);
  assert(/USD/.test(source), `${path} mentions the future US-city USD rule or USD price history.`);
  for (const pattern of disallowedPatterns) {
    assert(!pattern.test(source), `${path} has no stale unqualified ${pattern} copy.`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  passed: failures.length === 0,
  checks,
  failures,
};

console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  process.exit(1);
}
