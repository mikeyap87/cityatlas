import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const distDir = join(root, "dist");
const port = Number(process.env.CITYATLAS_STATIC_PORT || "4278");
const host = process.env.CITYATLAS_STATIC_HOST || "127.0.0.1";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function resolveRequestedPath(urlPathname) {
  const requested = normalize(decodeURIComponent(urlPathname)).replace(/^(\.\.[/\\])+/, "");
  const candidate = join(distDir, requested);
  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }
  return join(distDir, "index.html");
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);
  const filePath = resolveRequestedPath(requestUrl.pathname);
  const extension = extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] ?? "application/octet-stream";

  response.setHeader("Content-Type", contentType);
  response.setHeader("Cache-Control", "no-cache");

  createReadStream(filePath)
    .on("error", () => {
      response.statusCode = 500;
      response.end("CityAtlas local dist server could not read the requested file.");
    })
    .pipe(response);
});

server.listen(port, host, () => {
  console.log(`CityAtlas dist server ready at http://${host}:${port}`);
});
