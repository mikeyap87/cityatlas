import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const liveOutDir = join(root, "dist");
const localBuildDir = join(root, ".local-build");
const stageOutDir = join(localBuildDir, "dist.__staging");
const backupRootDir = join(localBuildDir, "dist-backups");
const publicDir = join(root, "public");
const shouldCopyHostedAdminArtifacts = process.env.VITE_CITYATLAS_ENABLE_HOSTED_ADMIN === "true";
const shouldCopyHostedPrivatePreviewArtifacts =
  process.env.VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW === "true";

function collectOutputs(result) {
  const buildResults = Array.isArray(result) ? result : [result];
  return buildResults.flatMap((entry) => entry.output ?? []);
}

function writeOutputFile(fileName, contents) {
  const targetPath = join(stageOutDir, fileName);
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, contents);
}

function shouldSkipPublicEntry(relativePath) {
  return (
    relativePath === "assets/places"
    || relativePath.startsWith("assets/places/")
    || (
    !shouldCopyHostedAdminArtifacts
    && (relativePath === "operator" || relativePath.startsWith("operator/"))
    )
  );
}

function shouldSkipOutputFile(fileName) {
  if (
    !shouldCopyHostedAdminArtifacts
    && (
      fileName.startsWith("assets/AdminConsole-")
      || fileName.startsWith("assets/cityGrowth-")
      || fileName.startsWith("assets/businessInboundPreview-")
    )
  ) {
    return true;
  }

  if (
    !shouldCopyHostedPrivatePreviewArtifacts
    && fileName.startsWith("assets/DateNightPreviewPage-")
  ) {
    return true;
  }

  return false;
}

function copyDirectoryContents(sourceDir, targetDir, relativeDir = "") {
  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);
    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;

    if (shouldSkipPublicEntry(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectoryContents(sourcePath, targetPath, relativePath);
      continue;
    }

    if (entry.isFile()) {
      mkdirSync(dirname(targetPath), { recursive: true });
      copyFileSync(sourcePath, targetPath);
    }
  }
}

function writeBuildOutputs(outputs) {
  rmSync(stageOutDir, { recursive: true, force: true });
  mkdirSync(stageOutDir, { recursive: true });

  if (existsSync(publicDir)) {
    copyDirectoryContents(publicDir, stageOutDir);
  }

  for (const output of outputs) {
    if (shouldSkipOutputFile(output.fileName)) {
      continue;
    }

    if (output.type === "chunk") {
      writeOutputFile(output.fileName, output.code);
      continue;
    }

    const source =
      typeof output.source === "string"
        ? output.source
        : Buffer.from(output.source);
    writeOutputFile(output.fileName, source);
  }
}

function finalizeBuildOutputs() {
  mkdirSync(backupRootDir, { recursive: true });
  const backupOutDir = join(backupRootDir, `dist-${Date.now()}`);

  if (existsSync(liveOutDir)) {
    renameSync(liveOutDir, backupOutDir);
  }

  renameSync(stageOutDir, liveOutDir);

  return backupOutDir;
}

function logBuildStage(stage, details = {}) {
  console.log(
    JSON.stringify(
      {
        stage,
        ...details,
      },
      null,
      2,
    ),
  );
}

logBuildStage("cityatlas-build:start", { root, liveOutDir, stageOutDir, backupRootDir });

const { build } = await import("vite");

logBuildStage("cityatlas-build:vite-imported");

const result = await build({
  root,
  build: {
    outDir: stageOutDir,
    cssMinify: false,
    modulePreload: false,
    write: false,
  },
});

logBuildStage("cityatlas-build:vite-complete");

const outputs = collectOutputs(result);
writeBuildOutputs(outputs);
const backupOutDir = finalizeBuildOutputs();

const outputSummary = outputs
  .filter((output) => !shouldSkipOutputFile(output.fileName))
  .map((output) => ({
    fileName: output.fileName,
    type: output.type,
  }));

logBuildStage("cityatlas-build:outputs-written", {
  outDir: liveOutDir,
  backupOutDir,
  outputCount: outputs.length,
  hostedAdminArtifactsCopied: shouldCopyHostedAdminArtifacts,
  hostedPrivatePreviewArtifactsCopied: shouldCopyHostedPrivatePreviewArtifacts,
  outputs: outputSummary,
});
