#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FILES_DIR = path.join(ROOT, "dist", "files");
const OUT = path.join(ROOT, "dist", "manifest.json");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

const MIME_BY_EXT = {
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs, base));
    else if (entry.isFile()) out.push(path.relative(base, abs).split(path.sep).join("/"));
  }
  return out.sort();
}

function sha256(abs) {
  return crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex");
}

function classify(relPath) {
  const parts = relPath.split("/");
  if (parts[0] === "shared") {
    return { scope: "shared", category: parts[1] ?? "unknown" };
  }
  if (parts[0] === "brand") {
    return {
      scope: "brand",
      brand: parts[1],
      category: parts[2] ?? "unknown",
      group: parts[3],
    };
  }
  return { scope: "unknown", category: parts[0] ?? "unknown" };
}

if (!fs.existsSync(FILES_DIR)) {
  throw new Error(`dist/files not found. Run package build first: ${FILES_DIR}`);
}

const files = walk(FILES_DIR).map((relPath) => {
  const abs = path.join(FILES_DIR, relPath);
  const stat = fs.statSync(abs);
  return {
    path: relPath,
    mimeType: MIME_BY_EXT[path.extname(relPath).toLowerCase()] ?? "application/octet-stream",
    size: stat.size,
    sha256: sha256(abs),
    ...classify(relPath),
  };
});

const manifest = {
  schemaVersion: 1,
  package: pkg.name,
  version: pkg.version,
  basePath: "files",
  generatedAt: new Date().toISOString(),
  fileCount: files.length,
  files,
};

fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`✓ asset manifest: ${path.relative(process.cwd(), OUT)} (${files.length} files)`);
