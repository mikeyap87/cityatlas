import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const scripts = [
  "sync-rooms-vancouver-business-seeds.mjs",
  "sync-rooms-vancouver-review-business-seeds.mjs",
  "sync-rooms-multi-city-business-seeds.mjs",
  "sync-rooms-connector-seeds.mjs",
  "sync-rooms-outreach-rehearsal-seeds.mjs",
  "sync-roam-public-business-wave-seeds.mjs",
  "sync-roam-city-sourcing-seeds.mjs",
];

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(root, "scripts", scriptName)], {
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

for (const scriptName of scripts) {
  await runScript(scriptName);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      scripts,
    },
    null,
    2,
  ),
);
