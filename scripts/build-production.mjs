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

function collectOutputs(result) {
  const buildResults = Array.isArray(result) ? result : [result];
  return buildResults.flatMap((entry) => entry.output ?? []);
}

function writeOutputFile(fileName, contents) {
  const targetPath = join(outDir, fileName);
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, contents);
}

function copyDirectoryContents(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryContents(sourcePath, targetPath);
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

const outputSummary = outputs.map((output) => ({
  fileName: output.fileName,
  type: output.type,
}));

console.log("CityAtlas production build");
console.log(JSON.stringify({ outDir, outputCount: outputs.length, outputs: outputSummary }, null, 2));
