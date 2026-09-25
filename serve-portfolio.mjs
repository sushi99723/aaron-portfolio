import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "dist");
const port = 5173;
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", `http://${request.headers.host}`).pathname);
  const relative = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "").replace(/^[/\\]+/, "");
  let file = join(root, relative || "index.html");
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, "index.html");
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Content-Type", types[extname(file).toLowerCase()] ?? "application/octet-stream");
  createReadStream(file).on("error", () => {
    response.statusCode = 500;
    response.end("Local portfolio server error");
  }).pipe(response);
}).listen(port, "127.0.0.1");
