import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPlaywrightSearchPaths() {
  const envPaths = [
    process.env.CITYATLAS_PLAYWRIGHT_NODE_MODULES,
    ...(process.env.NODE_PATH ? process.env.NODE_PATH.split(":") : []),
    join(homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
  ].filter(Boolean);

  return [...new Set(envPaths)];
}

export function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    for (const searchPath of getPlaywrightSearchPaths()) {
      try {
        const resolved = require.resolve("playwright", { paths: [searchPath] });
        return require(resolved);
      } catch {
        continue;
      }
    }
  }

  throw new Error(
    "Playwright is not available. Set CITYATLAS_PLAYWRIGHT_NODE_MODULES or NODE_PATH to a node_modules directory that contains the playwright package.",
  );
}

function probeServer(urlString) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const requestImpl = url.protocol === "https:" ? httpsRequest : httpRequest;
    const request = requestImpl(
      url,
      {
        method: "HEAD",
        timeout: 2_000,
      },
      (response) => {
        const { statusCode = 0 } = response;
        response.resume();
        if (statusCode < 500) {
          resolve();
          return;
        }
        reject(new Error(`Unexpected status ${statusCode}`));
      },
    );

    request.on("timeout", () => {
      request.destroy(new Error("Timed out"));
    });
    request.on("error", reject);
    request.end();
  });
}

export async function waitForServer(url, getServerLogs, timeoutMs = 30_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      await probeServer(url);
      return;
    } catch {
      // Keep polling until the timeout so preview has time to boot.
    }
    await wait(250);
  }

  const logs = getServerLogs();
  throw new Error(
    `Preview server did not become ready at ${url} within ${timeoutMs}ms.\nstdout:\n${logs.stdout}\nstderr:\n${logs.stderr}`,
  );
}

export function startVitePreviewServer({
  root,
  port,
  host = "127.0.0.1",
  distIndexPath = join(root, "dist/index.html"),
}) {
  const viteBin = join(root, "node_modules/vite/bin/vite.js");
  if (!existsSync(viteBin)) {
    throw new Error("Vite binary is missing. Install dependencies before running browser proof.");
  }
  if (!existsSync(distIndexPath)) {
    throw new Error("dist/index.html is missing. Run npm run build before browser proof.");
  }

  let stdout = "";
  let stderr = "";

  const child = spawn(
    process.execPath,
    [viteBin, "preview", "--host", host, "--port", String(port)],
    {
      cwd: root,
      env: {
        ...process.env,
        FORCE_COLOR: "0",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  return {
    child,
    getLogs() {
      return { stdout, stderr };
    },
  };
}
