import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadPlaywright } from "./browser-proof-support.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/qa");
const reportPath = join(outputDir, "hosted-payment-handoff.json");
const screenshotPath = join(outputDir, "hosted-payment-handoff.png");
const baseUrl = process.env.CITYATLAS_LIVE_BASE_URL || "https://city.univenturestudio.com";
const expectedCityPartnerLink =
  process.env.CITYATLAS_EXPECTED_CITY_PARTNER_PAYMENT_LINK ||
  "https://buy.stripe.com/28EaEXazm3Vc9J27KJcAo01";
const expectedSignaturePartnerLink =
  process.env.CITYATLAS_EXPECTED_SIGNATURE_PARTNER_PAYMENT_LINK ||
  "https://buy.stripe.com/dRmfZhfTG0J01cw4yxcAo00";

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function pageTextIncludes(pageText, pattern) {
  return pattern.test(pageText);
}

function findCta(ctas, patterns) {
  return ctas.find((cta) => patterns.some((pattern) => pattern.test(cta.text)));
}

function noteFailure(failures, message) {
  failures.push(message);
}

async function main() {
  const { chromium } = loadPlaywright();
  const failures = [];
  let browser;

  mkdirSync(outputDir, { recursive: true });

  try {
    browser = await chromium.launch({
      headless: true,
      channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || undefined,
    });

    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
      colorScheme: "light",
    });

    await page.goto(`${baseUrl}/for-businesses/pricing`, { waitUntil: "networkidle" });
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const ctas = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a"))
        .map((link) => ({
          text: (link.textContent || "").replace(/\s+/g, " ").trim(),
          href: link.href,
        }))
        .filter((row) => row.text.length > 0),
    );

    const pageText = normalizeText(await page.locator("body").innerText());
    const cityPartnerCheckout = ctas.find((cta) => cta.text === "Start City Partner checkout");
    const signaturePartnerCheckout = ctas.find((cta) => cta.text === "Start Signature checkout");
    const cityPartnerReview = findCta(ctas, [
      /^Request City Partner review$/i,
      /^Start City Partner request$/i,
      /^Start with City Partner$/i,
    ]);
    const signaturePartnerReview = findCta(ctas, [
      /^Request Signature review$/i,
      /^Start Signature request$/i,
      /^Start with Signature$/i,
    ]);
    const generalBusinessRequest = findCta(ctas, [
      /^Start a business request$/i,
      /^Start business request$/i,
      /^Start free review$/i,
      /^Request free review$/i,
      /^Start the free review$/i,
    ]);

    if (!cityPartnerCheckout) {
      noteFailure(failures, "Hosted pricing page does not show `Start City Partner checkout`.");
    } else if (cityPartnerCheckout.href !== expectedCityPartnerLink) {
      noteFailure(
        failures,
        `Hosted City Partner checkout href does not match the expected live Stripe link. Found ${cityPartnerCheckout.href}.`,
      );
    }

    if (!signaturePartnerCheckout) {
      noteFailure(failures, "Hosted pricing page does not show `Start Signature checkout`.");
    } else if (signaturePartnerCheckout.href !== expectedSignaturePartnerLink) {
      noteFailure(
        failures,
        `Hosted Signature checkout href does not match the expected live Stripe link. Found ${signaturePartnerCheckout.href}.`,
      );
    }

    const reviewBeforePayment = pageTextIncludes(
      pageText,
      /Review before payment|What the free review gives you/i,
    );
    const startRequestBeforePayment = pageTextIncludes(
      pageText,
      /Start the request before you decide on payment|Start with the request|Start with one note/i,
    );
    const requestFirst = pageTextIncludes(
      pageText,
      /Request first|request-first|No payment is required to start|Contact us first|Start with a free reviewed request/i,
    );
    const noInstantPublication = pageTextIncludes(
      pageText,
      /Paid checkout does not turn on instant publication|No public profile until facts are checked|Paid is optional/i,
    );
    const replyProofSurfaceVisible = pageTextIncludes(
      pageText,
      /Current reply proof|The same free-review-first path is already being used in real conversations|Current business reply handling/i,
    );
    const requestPathVisible = Boolean(cityPartnerReview || signaturePartnerReview || generalBusinessRequest);
    const reviewBoundaryCopyVisible = Boolean(
      reviewBeforePayment || startRequestBeforePayment || requestFirst || noInstantPublication,
    );

    if (!requestPathVisible) {
      noteFailure(failures, "Hosted pricing page does not show a request-first review path beside checkout.");
    }

    if (!reviewBoundaryCopyVisible) {
      noteFailure(failures, "Hosted pricing page does not explain the request-first or review-before-publication boundary.");
    }

    if (!replyProofSurfaceVisible) {
      noteFailure(
        failures,
        "Hosted pricing page does not show the newer business reply proof surface yet.",
      );
    }

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      expected: {
        cityPartnerLink: expectedCityPartnerLink,
        signaturePartnerLink: expectedSignaturePartnerLink,
      },
      hostedCheckoutVisible: Boolean(cityPartnerCheckout && signaturePartnerCheckout),
      reviewOnlySignals: {
        reviewBeforePayment,
        startRequestBeforePayment,
        requestFirst,
        noInstantPublication,
        requestPathVisible,
        reviewBoundaryCopyVisible,
        replyProofSurfaceVisible,
        cityPartnerReviewVisible: Boolean(cityPartnerReview),
        signaturePartnerReviewVisible: Boolean(signaturePartnerReview),
        generalBusinessRequestVisible: Boolean(generalBusinessRequest),
      },
      observed: {
        cityPartnerCheckout: cityPartnerCheckout || null,
        signaturePartnerCheckout: signaturePartnerCheckout || null,
        cityPartnerReview: cityPartnerReview || null,
        signaturePartnerReview: signaturePartnerReview || null,
        generalBusinessRequest: generalBusinessRequest || null,
        ctas,
      },
      failures,
      proof: {
        screenshot: "output/qa/hosted-payment-handoff.png",
      },
    };

    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));

    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      expected: {
        cityPartnerLink: expectedCityPartnerLink,
        signaturePartnerLink: expectedSignaturePartnerLink,
      },
      hostedCheckoutVisible: false,
      failures: [error instanceof Error ? error.message : String(error)],
      proof: {
        screenshot: "output/qa/hosted-payment-handoff.png",
      },
    };

    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

await main();
