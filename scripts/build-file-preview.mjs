import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, "dist");
const indexPath = join(distDir, "index.html");
const previewPath = join(distDir, "file-preview.html");

const indexHtml = readFileSync(indexPath, "utf8");
const previewHtml = indexHtml
  .replace(/href="\/favicon\.svg"/g, 'href="./favicon.svg"')
  .replace(/src="\/assets\//g, 'src="./assets/')
  .replace(/href="\/assets\//g, 'href="./assets/');

mkdirSync(distDir, { recursive: true });
writeFileSync(previewPath, previewHtml);

console.log(`CityAtlas file preview ready at ${previewPath}`);
