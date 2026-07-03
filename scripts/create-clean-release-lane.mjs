import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const workspaceRoot = dirname(root);
const releaseRoot = join(workspaceRoot, "_release-lanes");
const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const branchName = `codex/cityatlas-release-candidate-${timestamp.toLowerCase()}`;
const laneDir = join(releaseRoot, `cityatlas-release-candidate-${timestamp.toLowerCase()}`);

const topLevelIgnored = new Set([
  ".git",
  ".local-build",
  ".lazyweb",
  ".playwright-cli",
  ".DS_Store",
  "node_modules",
  "node_modules 2",
  "dist",
  "dist 2",
  "output",
  "test-results",
]);

function normalizePath(pathname) {
  return pathname.replaceAll("\\", "/");
}

function shouldIgnoreSegment(segment) {
  return (
    segment.startsWith("dist.__")
    || segment.startsWith("dist.broken-")
    || segment.startsWith("node_modules.broken-")
  );
}

function shouldIgnoreRelativePath(relativePath) {
  const normalized = normalizePath(relativePath);
  if (!normalized) {
    return false;
  }

  const segments = normalized.split("/");
  const basename = segments.at(-1) ?? normalized;
  const topLevel = segments[0];

  if (topLevelIgnored.has(topLevel)) {
    return true;
  }

  if (segments.some(shouldIgnoreSegment)) {
    return true;
  }

  if (normalized === ".env.local" || normalized === "tsconfig.tsbuildinfo") {
    return true;
  }

  if (/ 2\.(json|md|mjs|ts|tsx)$/.test(basename) || basename.endsWith(".bak")) {
    return true;
  }

  if (
    normalized === "package 2.json"
    || normalized === "public/operator/cityatlasOutreachQueueStatus.json"
    || normalized === "public/operator/cityatlasOutreachQueueStatus 2.json"
    || normalized === "public/operator/greaterVancouverOfficialBusinessInventory-burnaby.json"
    || normalized === "public/operator/greaterVancouverOfficialBusinessInventory-coquitlam.json"
    || normalized === "public/operator/greaterVancouverOfficialBusinessInventory-surrey.json"
    || normalized === "public/operator/greaterVancouverOfficialBusinessInventory-township-of-langley.json"
    || normalized === "public/operator/greaterVancouverOfficialBusinessInventorySummary.json"
  ) {
    return true;
  }

  return false;
}

function copyWorkingTree(sourceDir, targetDir, relativeDir = "") {
  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);
    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;

    if (shouldIgnoreRelativePath(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyWorkingTree(sourcePath, targetPath, relativePath);
      continue;
    }

    if (entry.isFile() || entry.isSymbolicLink()) {
      mkdirSync(dirname(targetPath), { recursive: true });
      copyFileSync(sourcePath, targetPath);
    }
  }
}

function tryExecFileSync(command, args, options = {}) {
  try {
    return execFileSync(command, args, options);
  } catch {
    return null;
  }
}

mkdirSync(releaseRoot, { recursive: true });

if (existsSync(laneDir)) {
  throw new Error(`Release lane already exists: ${laneDir}`);
}

let laneMode = "git-worktree";
let worktreeFailure = null;

try {
  execFileSync("git", ["-C", root, "worktree", "add", "-b", branchName, laneDir, "HEAD"], {
    stdio: "pipe",
  });
} catch (error) {
  laneMode = "snapshot-repo";
  worktreeFailure = error instanceof Error ? error.message : String(error);

  tryExecFileSync("git", ["-C", root, "worktree", "remove", "--force", laneDir], { stdio: "pipe" });
  tryExecFileSync("git", ["-C", root, "branch", "-D", branchName], { stdio: "pipe" });
  rmSync(laneDir, { recursive: true, force: true });

  mkdirSync(laneDir, { recursive: true });
  execFileSync("git", ["init", "-b", branchName], {
    cwd: laneDir,
    stdio: "pipe",
  });

  const remoteUrl = tryExecFileSync("git", ["-C", root, "remote", "get-url", "origin"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (typeof remoteUrl === "string" && remoteUrl.trim()) {
    tryExecFileSync("git", ["remote", "add", "origin", remoteUrl.trim()], {
      cwd: laneDir,
      stdio: "pipe",
    });
  }
}

try {
  copyWorkingTree(root, laneDir);
} catch (error) {
  if (laneMode === "git-worktree") {
    tryExecFileSync("git", ["-C", root, "worktree", "remove", "--force", laneDir], { stdio: "pipe" });
    tryExecFileSync("git", ["-C", root, "branch", "-D", branchName], { stdio: "pipe" });
  }
  rmSync(laneDir, { recursive: true, force: true });
  throw error;
}

const trackedStatus = execFileSync("git", ["-C", laneDir, "status", "--short", "--branch"], {
  encoding: "utf8",
}).trim();

const result = {
  status: "ok",
  root,
  laneDir: resolve(laneDir),
  branchName,
  laneMode,
  worktreeFailure,
  trackedStatus,
  next: [
    `cd ${resolve(laneDir)}`,
    "npm install",
    "npm run build",
    "npm run readiness",
    "git add -A && git commit -m \"Prepare clean CityAtlas release candidate\"",
  ],
};

console.log(JSON.stringify(result, null, 2));
