import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "vite";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "dist");
const publicDir = join(root, "public");
const shouldCopyHostedAdminArtifacts = process.env.VITE_CITYATLAS_ENABLE_HOSTED_ADMIN === "true";
const shouldCopyHostedPrivatePreviewArtifacts =
  process.env.VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW === "true";

function collectOutputs(result) {
  const buildResults = Array.isArray(result) ? result : [result];
  return buildResults.flatMap((entry) => entry.output ?? []);
}

function writeOutputFile(fileName, contents) {
  const targetPath = join(outDir, fileName);
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, contents);
}

function shouldSkipPublicEntry(relativePath) {
  return !shouldCopyHostedAdminArtifacts
    && (relativePath === "operator" || relativePath.startsWith("operator/"));
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
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  if (existsSync(publicDir)) {
    copyDirectoryContents(publicDir, outDir);
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

const result = await build({
  root,
  build: {
    outDir,
    modulePreload: false,
    write: false,
  },
});

const outputs = collectOutputs(result);
writeBuildOutputs(outputs);

const outputSummary = outputs
  .filter((output) => !shouldSkipOutputFile(output.fileName))
  .map((output) => ({
  fileName: output.fileName,
  type: output.type,
  }));

console.log("CityAtlas production build");
console.log(
  JSON.stringify(
    {
      outDir,
      outputCount: outputs.length,
      hostedAdminArtifactsCopied: shouldCopyHostedAdminArtifacts,
      hostedPrivatePreviewArtifactsCopied: shouldCopyHostedPrivatePreviewArtifacts,
      outputs: outputSummary,
    },
    null,
    2,
  ),
);
