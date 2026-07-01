import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(root, "public");
const docsDir = join(root, "docs");

const businessPhotoSources = [
  {
    label: "Published on Main",
    assetPath: "public/assets/businesses/published-on-main-dining-room.png",
    sourcePageUrl: "https://publishedonmain.com/",
  },
  {
    label: "Kissa Tanto",
    assetPath: "public/assets/businesses/kissa-tanto-booth.webp",
    sourcePageUrl: "https://www.kissatanto.com/",
  },
  {
    label: "L'Abattoir",
    assetPath: "public/assets/businesses/labattoir-dining-room.webp",
    sourcePageUrl: "https://www.labattoir.ca/",
  },
  {
    label: "Miku Vancouver",
    assetPath: "public/assets/businesses/miku-waterfront-dining-room.png",
    sourcePageUrl: "https://mikurestaurant.com/contact/",
  },
  {
    label: "Botanist",
    assetPath: "public/assets/businesses/botanist-dining-room.jpg",
    sourcePageUrl: "https://www.botanistrestaurant.com/location/botanist/",
  },
];

const placePhotoSources = [
  {
    label: "Kitsilano Beach",
    assetPath: "public/assets/places/kitsilano-beach-official.jpg",
    sourcePageUrl: "https://vancouver.ca/parks-recreation-culture/kitsilano-beach.aspx",
    imageUrl: "https://vancouver.ca/images/cov/feature/kitsilano-beach-2008.JPG",
    notes: "Official Vancouver parks page image.",
  },
  {
    label: "Kitsilano Pool",
    assetPath: "public/assets/places/kitsilano-pool-official.jpg",
    sourcePageUrl: "https://vancouver.ca/parks-recreation-culture/kitsilano-pool.aspx",
    imageUrl: "https://vancouver.ca/images/cov/feature/Pools-Kitsilano-Pool_rdax_150x83s.JPG",
    notes: "Official Vancouver parks image surfaced from the Kitsilano beach and pool coverage.",
  },
  {
    label: "Granville Island Public Market",
    assetPath: "public/assets/places/granville-island-public-market-official.jpg",
    sourcePageUrl: "https://granvilleisland.com/",
    imageUrl: "https://granvilleisland.com/wp-content/uploads/2025/09/Flavours-of-Hope-Pop-up-Cafe-Sept-2025-002.jpg",
    notes: "Official Granville Island homepage image used as the clearest public market-adjacent photo surfaced on the official domain.",
  },
  {
    label: "Jericho Beach",
    assetPath: "public/assets/places/jericho-beach-official.jpg",
    sourcePageUrl: "https://vancouver.ca/parks-recreation-culture/jericho-beach.aspx",
    imageUrl: "https://vancouver.ca/images/cov/feature/jericho-beach-2.JPG",
    notes: "Official Vancouver parks page image.",
  },
  {
    label: "Locarno Beach",
    assetPath: "public/assets/places/locarno-beach-official.jpg",
    sourcePageUrl: "https://vancouver.ca/parks-recreation-culture/locarno-beach.aspx",
    imageUrl: "https://vancouver.ca/images/cov/feature/locarno-beach.JPG",
    notes: "Official Vancouver parks page image.",
  },
  {
    label: "Beaty Biodiversity Museum",
    assetPath: "public/assets/places/beaty-biodiversity-museum-official.jpg",
    sourcePageUrl: "https://beatymuseum.ubc.ca/",
    imageUrl: "https://beatymuseum.ubc.ca/files/2020/08/a_7865a-scaled.jpg",
    notes: "Official Beaty Museum site image.",
  },
  {
    label: "Queen Elizabeth Park",
    assetPath: "public/assets/places/queen-elizabeth-park-official.jpg",
    sourcePageUrl: "https://vancouver.ca/parks-recreation-culture/queen-elizabeth-park.aspx",
    imageUrl: "https://vancouver.ca/images/cov/feature/queen-elizabeth-park-garden-landing.jpg",
    notes: "Official Vancouver parks page image.",
  },
  {
    label: "Vancouver Public Library Central Library",
    assetPath: "public/assets/places/vancouver-public-library-central-official.webp",
    sourcePageUrl: "https://www.vpl.ca/branches/central",
    imageUrl: "https://www.vpl.ca/sites/default/files/styles/landscape_lg/public/branch-CEN.webp?itok=cDQJyNAH",
    notes: "Official Vancouver Public Library branch image.",
  },
  {
    label: "Stanley Park",
    assetPath: "public/assets/places/stanley-park-official.jpg",
    sourcePageUrl: "https://vancouver.ca/parks-recreation-culture/stanley-park.aspx",
    imageUrl: "https://vancouver.ca/images/cov/feature/stanley-park-trails-landing.jpg",
    notes: "Official Vancouver parks page image.",
  },
  {
    label: "Gastown",
    assetPath: "public/assets/places/gastown-official.webp",
    sourcePageUrl: "https://gastown.org/about-us/",
    imageUrl: "https://gastown.org/wp-content/uploads/abbott-st-gastown.webp",
    notes: "Official Gastown district image.",
  },
  {
    label: "Distillery District",
    assetPath: "public/assets/places/distillery-district-official.jpg",
    sourcePageUrl: "https://www.thedistillerydistrict.com/",
    imageUrl: "https://www.thedistillerydistrict.com/wp-content/uploads/2018/09/shopping-main-image.jpg",
    notes: "Official Distillery District image.",
  },
  {
    label: "St. Lawrence Market",
    assetPath: "public/assets/places/st-lawrence-market-official.jpg",
    sourcePageUrl: "https://www.stlawrencemarket.com/",
    imageUrl: "https://www.stlawrencemarket.com/images/front_img/header-bg1.jpg",
    notes: "Official St. Lawrence Market homepage image.",
  },
  {
    label: "Harbourfront Centre",
    assetPath: "public/assets/places/harbourfront-centre-official.jpg",
    sourcePageUrl: "https://harbourfrontcentre.com/",
    imageUrl: "https://harbourfrontcentre.com/wp-content/uploads/2026/04/Canada-House-600x400.jpg",
    notes: "Official Harbourfront Centre homepage image used for the first-time visitor waterfront anchor.",
  },
  {
    label: "Royal Ontario Museum",
    assetPath: "public/assets/places/royal-ontario-museum-official.webp",
    sourcePageUrl: "https://www.rom.on.ca/",
    imageUrl: "https://www.rom.on.ca/sites/default/files/styles/navigation_teaser_portrait_lg_2x_568_x_708/public/2025-11/ROMFinals-41-1.webp?h=8a453eba&itok=woq02f0V",
    notes: "Official ROM site image.",
  },
  {
    label: "Art Gallery of Ontario",
    assetPath: "public/assets/places/art-gallery-of-ontario-official.jpg",
    sourcePageUrl: "https://ago.ca/visit/location-hours-admission",
    imageUrl: "https://ago.ca/sites/default/files/styles/hero_thin_wide/public/2019-05/May_2019_0320-web.jpg?h=d626b0f8&itok=NVKpheb_",
    notes: "Official AGO location page hero image.",
  },
  {
    label: "STACKT market",
    assetPath: "public/assets/places/stackt-market-official.jpg",
    sourcePageUrl: "https://stacktmarket.com/",
    imageUrl: "https://stacktmarket.com/app/uploads/2024/08/stackt-toronto-360x225.jpg",
    notes: "Official STACKT market image.",
  },
  {
    label: "Toronto Music Garden",
    assetPath: "public/assets/places/toronto-music-garden-official.jpg",
    sourcePageUrl: "https://www.toronto.ca/explore-enjoy/parks-recreation/places-spaces/parks-and-recreation-facilities/location/?id=1707",
    imageUrl: "https://www.toronto.ca/ext/pfr/img/1707/46686-parkland-toronto-music-garden.jpg",
    notes: "Official City of Toronto facility image.",
  },
  {
    label: "Bentway Staging Grounds",
    assetPath: "public/assets/places/bentway-staging-grounds-official.jpg",
    sourcePageUrl: "https://thebentway.ca/",
    imageUrl: "https://thebentway.ca/wp-content/uploads/2023/03/bentway-home-1.jpg",
    notes: "Official Bentway homepage image.",
  },
  {
    label: "Evergreen Brick Works",
    assetPath: "public/assets/places/evergreen-brick-works-official.jpg",
    sourcePageUrl: "https://www.evergreen.ca/evergreen-brick-works/visitor-info/plan-your-visit/",
    imageUrl: "https://www.evergreen.ca/wp-content/uploads/2023/11/EvergreenBrickWorks_OutdoorMarket.jpg",
    notes: "Official Evergreen Brick Works image.",
  },
  {
    label: "Toronto Botanical Garden",
    assetPath: "public/assets/places/toronto-botanical-garden-official.jpg",
    sourcePageUrl: "https://torontobotanicalgarden.ca/plan-your-visit/what-to-know-before-you-go/",
    imageUrl: "https://torontobotanicalgarden.ca/wp-content/uploads/2023/05/f2169026147e22c8e8081e2f608d5a9c.jpg",
    notes: "Official Toronto Botanical Garden image.",
  },
  {
    label: "English Bay Beach",
    assetPath: "public/assets/places/english-bay-beach-official.png",
    sourcePageUrl: "https://vancouver.ca/parks-recreation-culture/english-bay-beach.aspx",
    imageUrl: "https://vancouver.ca/images/cov/feature/english-bay-overview-landing.png",
    notes: "Official Vancouver parks page image.",
  },
  {
    label: "Bill Reid Gallery",
    assetPath: "public/assets/places/bill-reid-gallery-official.jpg",
    sourcePageUrl: "https://www.billreidgallery.ca/pages/hours-admissions",
    imageUrl: "https://www.billreidgallery.ca/cdn/shop/files/NIPD_2023.jpg?v=1685816255",
    notes: "Official Bill Reid Gallery image.",
  },
  {
    label: "Commercial Drive",
    assetPath: "public/assets/places/commercial-drive-official.png",
    sourcePageUrl: "https://thedrive.ca/",
    imageUrl: "https://thedrive.ca/wp-content/uploads/2026/06/EAT-ON-THE-DRIVE-700x700.png",
    notes: "Official district homepage image card.",
  },
  {
    label: "Trout Lake Beach",
    assetPath: "public/assets/places/trout-lake-beach-official.jpg",
    sourcePageUrl: "https://vancouver.ca/parks-recreation-culture/trout-lake-beach.aspx",
    imageUrl: "https://vancouver.ca/images/cov/feature/trout-lake-beach.JPG",
    notes: "Official Vancouver parks page image.",
  },
];

async function downloadAsset({ assetPath, imageUrl, label }) {
  const absolutePath = join(root, assetPath);
  await mkdir(dirname(absolutePath), { recursive: true });
  const response = await fetch(imageUrl, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; CityAtlasAssetSync/1.0)",
      accept: "image/*,*/*;q=0.8",
      referer: imageUrl,
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`${label} download failed with ${response.status} ${response.statusText}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(absolutePath, bytes);
}

async function writeSourceDoc() {
  const lines = [
    "# Public Image Sources",
    "",
    "This file records the public image sources currently used for CityAtlas business and place visuals.",
    "",
    "## Existing Public Business Photos",
    "",
    "| Label | Asset path | Source page |",
    "| --- | --- | --- |",
    ...businessPhotoSources.map(
      (entry) => `| ${entry.label} | \`${entry.assetPath}\` | ${entry.sourcePageUrl} |`,
    ),
    "",
    "## Official Place Photos Tracked For CityAtlas",
    "",
    "| Label | Asset path | Source page | Image file | Notes |",
    "| --- | --- | --- | --- | --- |",
    ...placePhotoSources.map(
      (entry) =>
        `| ${entry.label} | \`${entry.assetPath}\` | ${entry.sourcePageUrl} | ${entry.imageUrl} | ${entry.notes} |`,
    ),
    "",
    "## Current Source Mix",
    "",
    "- Business photos under `public/assets/businesses/` are public-source venue images already saved in the repo.",
    "- Place photos under `public/assets/places/` are pulled from official city, venue, or district pages listed above.",
    "- Most place photos can be downloaded directly by script. City of Vancouver and Vancouver Public Library files that returned direct-fetch `403` were instead captured from those same official public pages through the in-app browser asset bundle and then saved locally.",
    "- Shared public hero and fallback surfaces now reuse official place photos already listed above, including Granville Island Public Market, English Bay Beach, Kitsilano Beach, Queen Elizabeth Park, Commercial Drive, Vancouver Public Library Central Library, and Vancouver Art Gallery.",
    "- Older generic scene files can still remain in `public/assets/`, but they are no longer the preferred imagery layer for the main public CityAtlas surfaces covered by this source record.",
    "",
  ];

  await writeFile(join(docsDir, "PUBLIC_IMAGE_SOURCES.md"), `${lines.join("\n")}\n`);
}

async function main() {
  const failures = [];

  for (const entry of placePhotoSources) {
    try {
      await downloadAsset(entry);
      console.log(`synced ${entry.assetPath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ label: entry.label, assetPath: entry.assetPath, imageUrl: entry.imageUrl, message });
      console.warn(`skipped ${entry.assetPath}: ${message}`);
    }
  }

  await writeSourceDoc();
  console.log(`wrote ${join(docsDir, "PUBLIC_IMAGE_SOURCES.md")}`);

  if (failures.length > 0) {
    console.log(JSON.stringify({ failures }, null, 2));
    process.exitCode = 1;
  }
}

await main();
