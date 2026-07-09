import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const scripts = [
  { name: "sync-rooms-vancouver-business-seeds.mjs", args: [] },
  { name: "sync-rooms-vancouver-review-business-seeds.mjs", args: [] },
  {
    name: "sync-vancouver-restaurant-review-business-seeds.mjs",
    args: [
      "--email-import-csv=output/growth/vancouver-restaurant-contact-research-batch-all-email-candidate-review-import.csv",
      "--contact-import-csv=output/growth/vancouver-restaurant-contact-research-batch-all-contact-path-review-import.csv",
      "--email-review-csv=output/growth/vancouver-restaurant-contact-research-batch-all-email-candidate-review.csv",
      "--contact-review-csv=output/growth/vancouver-restaurant-contact-research-batch-all-contact-path-review.csv",
    ],
  },
  { name: "sync-vancouver-service-review-business-seeds.mjs", args: [] },
  { name: "sync-rooms-multi-city-business-seeds.mjs", args: [] },
  { name: "sync-rooms-connector-seeds.mjs", args: [] },
  { name: "sync-rooms-outreach-rehearsal-seeds.mjs", args: [] },
  { name: "sync-roam-public-business-wave-seeds.mjs", args: [] },
  { name: "sync-roam-city-sourcing-seeds.mjs", args: [] },
];

function runScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(root, "scripts", scriptName), ...args], {
      cwd: root,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }
      reject(new Error(`${scriptName} exited with code ${code ?? "unknown"}`));
    });
  });
}

for (const script of scripts) {
  await runScript(script.name, script.args);
}

console.log(
  JSON.stringify(
      {
        ok: true,
        scripts: scripts.map((script) => script.name),
      },
    null,
    2,
  ),
);
