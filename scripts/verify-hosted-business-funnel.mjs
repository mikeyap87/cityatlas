import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadPlaywright } from "./browser-proof-support.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/qa");
const reportPath = join(outputDir, "hosted-business-funnel.json");
const screenshotDir = join(outputDir, "hosted-business-funnel");
const baseUrl = process.env.CITYATLAS_LIVE_BASE_URL || "https://city.univenturestudio.com";
const navigationWaitUntil = process.env.CITYATLAS_HOSTED_QA_WAIT_UNTIL || "domcontentloaded";
const screenshotWarnings = [];

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function noteFailure(failures, message) {
  failures.push(message);
}

async function saveScreenshot(page, fileName) {
  mkdirSync(screenshotDir, { recursive: true });
  const path = join(screenshotDir, fileName);
  try {
    await page.screenshot({ path, fullPage: true, timeout: 30_000 });
  } catch (error) {
    screenshotWarnings.push(
      `Could not capture ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return `output/qa/hosted-business-funnel/${fileName}`;
}

async function main() {
  const { chromium } = loadPlaywright();
  const failures = [];
  const routeReports = [];
  let browser;

  mkdirSync(outputDir, { recursive: true });

  try {
    browser = await chromium.launch({
      headless: true,
      channel: process.env.CITYATLAS_PLAYWRIGHT_CHANNEL || undefined,
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
      colorScheme: "light",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20_000);
    page.setDefaultNavigationTimeout(35_000);

    await page.goto(`${baseUrl}/for-businesses/pricing`, { waitUntil: navigationWaitUntil });
    const pricingText = normalizeText(await page.locator("body").innerText());
    const pricingCtas = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a"))
        .map((link) => ({
          text: (link.textContent || "").replace(/\s+/g, " ").trim(),
          href: link.href,
        }))
        .filter((row) => row.text.length > 0),
    );
    const pricingGeneralRequest = pricingCtas.find((cta) => /^Request free review$/i.test(cta.text));
    const pricingProofExamples = await page.locator(".pricing-output-preview-card-link").count();
    const pricingReplyProofVisible =
      /Current reply proof|The same free-review-first path is already being used in real conversations/i.test(
        pricingText,
      );
    const pricingLiveRepliesVisible = /Live replies sent/i.test(pricingText);
    const pricingReviewBoundaryVisible =
      /Start with one note|Contact us first|Paid is optional|Start with a free reviewed request/i.test(
        pricingText,
      );

    if (!pricingGeneralRequest?.href?.includes("/for-businesses/submit")) {
      noteFailure(
        failures,
        "Hosted pricing page does not keep the primary request-first CTA pointed at the business request form.",
      );
    }
    if (!pricingReviewBoundaryVisible) {
      noteFailure(
        failures,
        "Hosted pricing page does not clearly show the request-first review boundary.",
      );
    }
    if (!pricingReplyProofVisible) {
      noteFailure(
        failures,
        "Hosted pricing page does not show the current reply-proof section yet.",
      );
    }
    if (!pricingLiveRepliesVisible) {
      noteFailure(
        failures,
        "Hosted pricing page does not show the live reply metrics inside the proof surface.",
      );
    }
    if (pricingProofExamples < 2) {
      noteFailure(
        failures,
        `Hosted pricing page should show at least 2 proof examples, found ${pricingProofExamples}.`,
      );
    }

    routeReports.push({
      route: "/for-businesses/pricing",
      headingVisible: /Get found by Vancouver locals/i.test(pricingText),
      pricingGeneralRequest,
      pricingProofExamples,
      pricingReplyProofVisible,
      pricingLiveRepliesVisible,
      pricingReviewBoundaryVisible,
      screenshot: await saveScreenshot(page, "pricing.png"),
    });

    await page.goto(`${baseUrl}/for-businesses/partner-preview`, { waitUntil: navigationWaitUntil });
    const partnerPreviewText = normalizeText(await page.locator("body").innerText());
    const partnerPreviewProofCards = await page.locator(".partner-proof-card").count();
    const partnerPreviewHeadingVisible =
      /See what CityAtlas can already build for a local business/i.test(partnerPreviewText);
    const partnerPreviewReplyProofVisible = /Current reply proof/i.test(partnerPreviewText);
    const partnerPreviewLiveRepliesVisible = /Live replies sent/i.test(partnerPreviewText);
    const partnerPreviewHostedAskVisible =
      /host(ed)? (meal|visit|experience)|host a visit or service|hosted meal, service, walkthrough, or offering/i.test(
        partnerPreviewText,
      );
    const partnerPreviewBoundaryVisible =
      /first reply is a fit note|Paid packages stay optional|free reviewed request/i.test(
        partnerPreviewText,
      );

    if (!partnerPreviewHeadingVisible) {
      noteFailure(
        failures,
        "Hosted partner preview does not show the current owner-approved hero/heading yet.",
      );
    }
    if (!partnerPreviewReplyProofVisible) {
      noteFailure(failures, "Hosted partner preview does not show the current reply-proof section.");
    }
    if (!partnerPreviewLiveRepliesVisible) {
      noteFailure(failures, "Hosted partner preview does not show the live reply metrics.");
    }
    if (!partnerPreviewHostedAskVisible) {
      noteFailure(
        failures,
        "Hosted partner preview does not explain the hosted meal/service/offering ask.",
      );
    }
    if (!partnerPreviewBoundaryVisible) {
      noteFailure(
        failures,
        "Hosted partner preview does not keep the fit-note-first or paid-optional framing visible.",
      );
    }
    if (partnerPreviewProofCards < 2) {
      noteFailure(
        failures,
        `Hosted partner preview should show at least 2 proof cards, found ${partnerPreviewProofCards}.`,
      );
    }

    routeReports.push({
      route: "/for-businesses/partner-preview",
      partnerPreviewHeadingVisible,
      partnerPreviewProofCards,
      partnerPreviewReplyProofVisible,
      partnerPreviewLiveRepliesVisible,
      partnerPreviewHostedAskVisible,
      partnerPreviewBoundaryVisible,
      screenshot: await saveScreenshot(page, "partner-preview.png"),
    });

    await page.goto(`${baseUrl}/for-businesses/book-call`, { waitUntil: navigationWaitUntil });
    const bookCallText = normalizeText(await page.locator("body").innerText());
    const bookCallHeadingVisible = /Book a short CityAtlas fit call/i.test(bookCallText);
    const bookCallReplyProofVisible = /Current reply proof/i.test(bookCallText);
    const packageSelect = page.getByLabel("Package, if you already know");
    const packageSelectCount = await packageSelect.count();
    const bookCallPackageValue = packageSelectCount > 0
      ? await packageSelect.inputValue()
      : "";
    const checkoutDisclosureBefore = await page
      .locator(".submission-support-disclosure")
      .filter({ hasText: /Already sure about the paid path/i })
      .count();

    if (!bookCallHeadingVisible) {
      noteFailure(failures, "Hosted fit-call page does not show the current heading yet.");
    }
    if (!bookCallReplyProofVisible) {
      noteFailure(failures, "Hosted fit-call page does not show the current reply-proof section.");
    }
    if (!/Live replies sent/i.test(bookCallText)) {
      noteFailure(failures, "Hosted fit-call page does not show the live reply metrics.");
    }
    if (packageSelectCount === 0) {
      noteFailure(failures, "Hosted fit-call page does not show the package selector.");
    } else if (bookCallPackageValue !== "") {
      noteFailure(
        failures,
        `Hosted fit-call page should not preselect a package. Found "${bookCallPackageValue}".`,
      );
    }
    if (checkoutDisclosureBefore !== 0) {
      noteFailure(
        failures,
        `Hosted fit-call page should not show checkout disclosure before choosing a package. Found ${checkoutDisclosureBefore}.`,
      );
    }

    let checkoutDisclosureAfter = checkoutDisclosureBefore;
    if (packageSelectCount > 0) {
      await packageSelect.selectOption("city_partner");
      checkoutDisclosureAfter = await page
        .locator(".submission-support-disclosure")
        .filter({ hasText: /Already sure about the paid path/i })
        .count();

      if (checkoutDisclosureAfter === 0) {
        noteFailure(
          failures,
          "Hosted fit-call page does not reveal the checkout disclosure after choosing a package.",
        );
      }
    }

    routeReports.push({
      route: "/for-businesses/book-call",
      bookCallHeadingVisible,
      bookCallReplyProofVisible,
      packageSelectCount,
      bookCallPackageValue,
      checkoutDisclosureBefore,
      checkoutDisclosureAfter,
      screenshot: await saveScreenshot(page, "book-call.png"),
    });

    await page.goto(`${baseUrl}/for-businesses/submit`, { waitUntil: navigationWaitUntil });
    const submitInitialText = normalizeText(await page.locator("body").innerText());
    const submitHeadingVisible = /Start a simple business request/i.test(submitInitialText);
    const submitStepVisible = /Step 1 of 3/i.test(submitInitialText);
    const submitQuestionVisible = /Question 1 of 3/i.test(submitInitialText);
    const submitReplyExampleVisible = /What the first reply can look like/i.test(submitInitialText);
    const submitProofDisclosure = page.locator(".submission-proof-disclosure");
    const submitProofDisclosureCount = await submitProofDisclosure.count();
    let submitProofLinks = 0;
    let submitReplyHandlingVisible = false;
    let submitLiveRepliesVisible = false;

    if (!submitHeadingVisible) {
      noteFailure(failures, "Hosted business request page does not show the current heading.");
    }
    if (!submitStepVisible) {
      noteFailure(failures, "Hosted business request page does not show the step progress label.");
    }
    if (!submitQuestionVisible) {
      noteFailure(failures, "Hosted business request page does not show the question progress label.");
    }
    if (!submitReplyExampleVisible) {
      noteFailure(failures, "Hosted business request page does not show the first-reply explanation.");
    }
    if (submitProofDisclosureCount === 0) {
      noteFailure(
        failures,
        "Hosted business request page does not show the proof disclosure entry point.",
      );
    } else {
      await submitProofDisclosure.locator("summary").click();
      const submitText = normalizeText(await page.locator("body").innerText());
      submitProofLinks = await page.locator(".submission-proof-link-card").count();
      submitReplyHandlingVisible = /Current reply handling/i.test(submitText);
      submitLiveRepliesVisible = /Live replies sent/i.test(submitText);

      if (!submitReplyHandlingVisible) {
        noteFailure(
          failures,
          "Hosted business request page does not show current reply handling after opening proof.",
        );
      }
      if (!submitLiveRepliesVisible) {
        noteFailure(
          failures,
          "Hosted business request page does not show the live reply metrics after opening proof.",
        );
      }
      if (submitProofLinks < 2) {
        noteFailure(
          failures,
          `Hosted business request page should show at least 2 proof links after opening proof. Found ${submitProofLinks}.`,
        );
      }
    }

    routeReports.push({
      route: "/for-businesses/submit",
      submitHeadingVisible,
      submitStepVisible,
      submitQuestionVisible,
      submitReplyExampleVisible,
      submitProofDisclosureCount,
      submitReplyHandlingVisible,
      submitLiveRepliesVisible,
      submitProofLinks,
      screenshot: await saveScreenshot(page, "submit.png"),
    });

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      passed: failures.length === 0,
      routeReports,
      failures,
      warnings: screenshotWarnings,
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
      passed: false,
      failures: [error instanceof Error ? error.message : String(error)],
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
