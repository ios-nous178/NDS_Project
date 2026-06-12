#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(DIST, "manifest.json");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const files = ["vanilla.js", "mono/vanilla.js", "multicolor/vanilla.js"];

for (const file of files) {
  const abs = path.join(DIST, file);
  if (!fs.existsSync(abs)) {
    throw new Error(`${file} not found. Run icon build first: ${abs}`);
  }
}

const manifest = {
  schemaVersion: 1,
  package: pkg.name,
  version: pkg.version,
  generatedAt: new Date().toISOString(),
  files: files.map((file) => {
    const body = fs.readFileSync(path.join(DIST, file));
    const text = body.toString("utf8");
    return {
      path: file,
      mimeType: "text/javascript",
      size: body.byteLength,
      sha256: crypto.createHash("sha256").update(body).digest("hex"),
      iconCount: (text.match(/^\s+[A-Za-z0-9]+Icon:\s*\{/gm) ?? []).length,
    };
  }),
};

fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`);
const total = manifest.files.find((file) => file.path === "vanilla.js")?.iconCount ?? 0;
console.log(`✓ icon manifest: ${path.relative(process.cwd(), OUT)} (${total} icons)`);
