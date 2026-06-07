import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST_DIR = join(ROOT, "apps", "storybook", "storybook-static");
const DEFAULT_PORT = Number.parseInt(process.env.STORYBOOK_PORT ?? "6006", 10);
const DEFAULT_HOST = process.env.STORYBOOK_HOST ?? "127.0.0.1";

if (!existsSync(DIST_DIR)) {
  console.error(
    `[serve-storybook-static] ${DIST_DIR} does not exist. Run "pnpm --filter @nudge-design/storybook build" first.`,
  );
  process.exit(1);
}

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function resolveAsset(requestPath) {
  const clean = normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
  const target = join(DIST_DIR, clean);
  if (existsSync(target) && statSync(target).isFile()) return target;
  if (existsSync(join(target, "index.html"))) return join(target, "index.html");
  return join(DIST_DIR, "index.html");
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? DEFAULT_HOST}`);
  const filePath = resolveAsset(url.pathname);
  const ext = extname(filePath).toLowerCase();
  const body = readFileSync(filePath);

  res.setHeader("Content-Type", MIME_TYPES[ext] ?? "application/octet-stream");
  res.end(body);
});

server.listen(DEFAULT_PORT, DEFAULT_HOST, () => {
  console.log(`[serve-storybook-static] http://${DEFAULT_HOST}:${DEFAULT_PORT} -> ${DIST_DIR}`);
});
