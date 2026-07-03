import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const passthroughArgs = [];
  for (const arg of argv) {
    passthroughArgs.push(arg);
  }
  return { passthroughArgs };
}

function runNodeScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: process.cwd(),
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${path.basename(scriptPath)} exited with code ${code ?? "unknown"}`));
    });
  });
}

async function main() {
  const { passthroughArgs } = parseArgs(process.argv.slice(2));
  await runNodeScript(path.resolve(__dirname, "./record-vancouver-service-daily-send-results.mjs"), passthroughArgs);
  await runNodeScript(path.resolve(__dirname, "./merge-vancouver-service-send-ledger.mjs"), []);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
