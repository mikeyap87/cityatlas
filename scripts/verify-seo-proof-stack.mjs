import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, "output/seo");

const steps = [
  {
    id: "contentProof",
    label: "CityAtlas SEO content-machine proof",
    command: [
      process.execPath,
      "--experimental-strip-types",
      "scripts/verify-seo-content-machine.mjs",
    ],
    artifactPath: "output/seo/local-content-machine-proof.json",
    isValidArtifact: (artifact) => artifact?.passed === true,
  },
  {
    id: "structureProof",
    label: "CityAtlas SEO structure proof",
    command: [
      process.execPath,
      "--experimental-strip-types",
      "scripts/verify-seo-structure.mjs",
    ],
    artifactPath: "output/seo/local-structure-proof.json",
    isValidArtifact: (artifact) =>
      artifact?.passed === true && Number(artifact?.checkedRouteCount ?? 0) > 0,
  },
  {
    id: "copyProof",
    label: "CityAtlas public-copy safety proof",
    command: [process.execPath, "scripts/verify-public-copy-safety.mjs"],
    artifactPath: "output/seo/public-copy-safety-proof.json",
    isValidArtifact: (artifact) =>
      artifact?.passed === true && Number(artifact?.checkedFileCount ?? 0) > 0,
  },
  {
    id: "renderedCopyProof",
    label: "CityAtlas rendered public-copy safety proof",
    command: [process.execPath, "scripts/verify-rendered-public-copy-safety.mjs"],
    artifactPath: "output/seo/rendered-public-copy-safety-proof.json",
    isValidArtifact: (artifact) =>
      artifact?.passed === true && Number(artifact?.checkedRouteCount ?? 0) > 0,
  },
  {
    id: "docProof",
    label: "CityAtlas SEO doc-proof",
    command: [
      process.execPath,
      "--experimental-strip-types",
      "scripts/verify-seo-docs.mjs",
    ],
    artifactPath: "output/seo/local-doc-proof.json",
    isValidArtifact: (artifact) =>
      artifact?.passed === true && Number(artifact?.checkedFiles ?? 0) > 0,
  },
  {
    id: "readiness",
    label: "CityAtlas readiness report",
    command: [process.execPath, "scripts/readiness-report.mjs"],
    artifactPath: "output/readiness/latest.json",
    isValidArtifact: (artifact) => Number.isFinite(Number(artifact?.average)),
  },
];

const failures = [];
const stepReports = [];
const artifactsByStep = {};

function readJsonIfPresent(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

for (const step of steps) {
  const result = spawnSync(step.command[0], step.command.slice(1), {
    cwd: root,
    encoding: "utf8",
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  const artifact = readJsonIfPresent(join(root, step.artifactPath));
  artifactsByStep[step.id] = artifact;

  const exitCode = typeof result.status === "number" ? result.status : 1;
  const artifactValid = step.isValidArtifact(artifact);
  const passed = exitCode === 0 && artifactValid;

  stepReports.push({
    id: step.id,
    label: step.label,
    command: step.command.join(" "),
    artifactPath: step.artifactPath,
    exitCode,
    passed,
    generatedAt: artifact?.generatedAt ?? null,
  });

  if (result.error) {
    failures.push(`${step.label} failed to start: ${result.error.message}`);
  }
  if (exitCode !== 0) {
    failures.push(`${step.label} exited with code ${exitCode}.`);
  }
  if (!artifactValid) {
    failures.push(`${step.label} did not produce a valid artifact at ${step.artifactPath}.`);
  }
}

const contentProof = artifactsByStep.contentProof;
const structureProof = artifactsByStep.structureProof;
const copyProof = artifactsByStep.copyProof;
const renderedCopyProof = artifactsByStep.renderedCopyProof;
const docProof = artifactsByStep.docProof;
const readiness = artifactsByStep.readiness;

const report = {
  generatedAt: new Date().toISOString(),
  passed: failures.length === 0,
  steps: stepReports,
  summary: {
    usefulPieceCount: contentProof?.usefulPieceCount ?? null,
    guideCount: contentProof?.guideCount ?? null,
    sourceBackedCollectionCount: contentProof?.sourceBackedCollectionCount ?? null,
    sourceBackedPlaceCount: contentProof?.sourceBackedPlaceCount ?? null,
    mappedGuideCollectionCount: contentProof?.mappedGuideCollectionCount ?? null,
    guideResourceLinkedCount: contentProof?.guideResourceLinkedCount ?? null,
    checkedRouteCount: structureProof?.checkedRouteCount ?? docProof?.checkedRouteCount ?? null,
    checkedCopyFiles: copyProof?.checkedFileCount ?? null,
    checkedRenderedRoutes: renderedCopyProof?.checkedRouteCount ?? null,
    checkedFiles: docProof?.checkedFiles ?? null,
    readinessAverage: readiness?.average ?? null,
  },
  failures,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "local-proof-stack.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log("CityAtlas SEO proof stack");
console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
