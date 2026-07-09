import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "../output/growth/cityatlas-reply-followup-kit");
const DEFAULT_JSON_PATH = path.join(OUTPUT_DIR, "cityatlas-reply-followup-kit.json");
const DEFAULT_MD_PATH = path.join(OUTPUT_DIR, "cityatlas-reply-followup-kit.md");

const templates = [
  {
    key: "restaurant",
    label: "Restaurants",
    useWhen: "They ask for details, a preview, or whether there is a cost.",
    hostedAsk: "a complimentary hosted tasting, meal, or visit for Michael and one guest",
    reply: [
      "Thanks for the reply. The first step is free review, not a paid package.",
      "",
      "The preview I would send over is simple:",
      "- the CityAtlas angle that seems to fit you",
      "- the route, neighborhood, or guide context where you could belong",
      "- the visit or planning angle that would be most useful for readers",
      "",
      "Nothing public or paid would be active from that alone. If the preview feels aligned, the normal next ask would be a complimentary hosted tasting, meal, or visit for Michael and one guest so the feature can be built from a real experience.",
      "",
      "Worth sending the short preview?",
    ],
  },
  {
    key: "cafe_bakery",
    label: "Cafes and bakeries",
    useWhen: "They are a cafe, coffee shop, bakery, brunch place, or daytime stop.",
    hostedAsk: "a complimentary hosted coffee, pastry, brunch, or daytime visit for Michael and one guest",
    reply: [
      "Thanks for the reply. The first step is free review, not a paid placement.",
      "",
      "The preview would show:",
      "- the CityAtlas angle that fits your spot",
      "- the neighborhood or low-friction route where you could make sense",
      "- the clearest coffee, pastry, brunch, or daytime-stop angle for readers",
      "",
      "Nothing public or paid would go live from that alone. If the preview feels useful, the normal next ask would be a complimentary hosted coffee, pastry, brunch, or daytime visit for Michael and one guest so the feature can be accurate.",
      "",
      "Should I send over the short preview?",
    ],
  },
  {
    key: "wellness",
    label: "Wellness, spa, fitness, and recovery",
    useWhen: "They are a spa, massage, fitness, wellness, recovery, clinic, or reset-style service.",
    hostedAsk: "a complimentary treatment, class, recovery session, or wellness experience for Michael and one guest",
    reply: [
      "Thanks for getting back to me. The first step is a free fit review, not a paid package.",
      "",
      "The preview would cover:",
      "- the wellness or recovery angle that seems strongest",
      "- the route, neighborhood, or guide where you could fit",
      "- the clearest service or booking angle readers would understand quickly",
      "",
      "Nothing public or paid would be active from the preview alone. If it feels aligned, the normal next ask would be a complimentary treatment, class, recovery session, or wellness experience for Michael and one guest so CityAtlas can describe it accurately.",
      "",
      "Worth sending the preview?",
    ],
  },
  {
    key: "auto_repair_detailing",
    label: "Auto repair, detailing, and mobile services",
    useWhen: "They are a repair shop, mechanic, detailing service, tire shop, or mobile service.",
    hostedAsk:
      "a complimentary diagnostic, inspection, detail sample, or small service for Michael, with one guest included when the service naturally supports two people",
    reply: [
      "Thanks for the reply. The first step is a free review, not a paid ad.",
      "",
      "The preview would show:",
      "- the practical CityAtlas angle that seems to fit your service",
      "- the route, neighborhood, or local-errand context where it could belong",
      "- the clearest service-use case a reader would understand",
      "",
      "Nothing public or paid would be active from that preview alone. If it feels aligned, the normal next ask would be a complimentary diagnostic, inspection, detail sample, or small service for Michael, with one guest included when the service naturally supports two people.",
      "",
      "Should I send the short preview?",
    ],
  },
  {
    key: "cleaning_home",
    label: "Cleaning and home services",
    useWhen: "They are a cleaner, home-service provider, janitorial team, or property support business.",
    hostedAsk: "a complimentary walkthrough, sample clean, or service credit that lets Michael understand the service quality firsthand",
    reply: [
      "Thanks for getting back to me. The first step is free review, not a paid package.",
      "",
      "The preview would cover:",
      "- the CityAtlas angle that seems strongest",
      "- the neighborhood, route, or local-life context where the service could fit",
      "- the clearest homeowner, renter, or hosting-use case for readers",
      "",
      "Nothing public or paid would be active from the preview alone. If it feels aligned, the normal next ask would be a complimentary walkthrough, sample clean, or service credit so Michael can understand the quality firsthand.",
      "",
      "Worth sending over the preview?",
    ],
  },
  {
    key: "hotel_venue_event",
    label: "Hotels, venues, events, and culture",
    useWhen: "They are a hotel, venue, event space, cultural spot, gallery, museum, or guest-service business.",
    hostedAsk: "a complimentary property or site walkthrough, hosted visit, or sample experience for Michael and one guest",
    reply: [
      "Thanks for the reply. The first step is a free fit review, not a paid placement.",
      "",
      "The preview would show:",
      "- the guest, event, culture, or hosted-visit angle that seems strongest",
      "- the route, neighborhood, or guide where you could fit",
      "- the clearest visit, booking, or planning angle for readers",
      "",
      "Nothing public or paid would be active from the preview alone. If it feels aligned, the normal next ask would be a complimentary property or site walkthrough, hosted visit, or sample experience for Michael and one guest so the feature can be specific and accurate.",
      "",
      "Should I send over the short preview?",
    ],
  },
];

function buildMarkdown() {
  const lines = [
    "# CityAtlas Reply Follow-up Kit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Use these for interested business replies only. Do not send to declines, autoresponders, signature-only replies, or unclear messages.",
    "",
    "Boundary: the first step is free review plus a possible complimentary hosted experience. Do not promise a public listing, ranking, traffic, or payment acceptance.",
  ];

  for (const template of templates) {
    lines.push(
      "",
      `## ${template.label}`,
      "",
      `Use when: ${template.useWhen}`,
      "",
      `Hosted ask: ${template.hostedAsk}`,
      "",
      "Suggested reply:",
      "",
      "```text",
      template.reply.join("\n"),
      "```",
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    partnerPreviewUrl: "https://city.univenturestudio.com/for-businesses/partner-preview",
    safetyBoundary:
      "Use only for interested replies. Do not promise public listings, rankings, traffic, instant publication, or payment acceptance.",
    templates,
  };

  await Promise.all([
    fs.writeFile(DEFAULT_JSON_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8"),
    fs.writeFile(DEFAULT_MD_PATH, buildMarkdown(), "utf8"),
  ]);

  console.log(JSON.stringify({ outputJson: DEFAULT_JSON_PATH, outputMarkdown: DEFAULT_MD_PATH }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
