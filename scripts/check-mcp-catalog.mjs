#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const catalogPath = path.join(ROOT, "packages/mcp/catalog.json");

const previousCatalog = readHeadCatalog() ?? readWorkingTreeCatalog();

execFileSync("pnpm", ["--filter", "@nudge-eap/mcp", "build:manifest"], {
  cwd: ROOT,
  stdio: "inherit",
});

if (previousCatalog?.generatedAt && fs.existsSync(catalogPath)) {
  const nextCatalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  nextCatalog.generatedAt = previousCatalog.generatedAt;
  fs.writeFileSync(catalogPath, `${JSON.stringify(nextCatalog, null, 2)}\n`, "utf8");
}

try {
  execFileSync(
    "git",
    ["diff", "--exit-code", "packages/mcp/catalog.json", "packages/mcp/manifest.json"],
    {
      cwd: ROOT,
      stdio: "inherit",
    },
  );
} catch {
  console.error(
    "\n[check-mcp-catalog] packages/mcp/catalog.json is stale. " +
      "Run `pnpm --filter @nudge-eap/mcp build:manifest` after building DS packages and commit the result.",
  );
  process.exit(1);
}

function readHeadCatalog() {
  try {
    return JSON.parse(
      execFileSync("git", ["show", "HEAD:packages/mcp/catalog.json"], {
        cwd: ROOT,
        encoding: "utf8",
      }),
    );
  } catch {
    return null;
  }
}

function readWorkingTreeCatalog() {
  return fs.existsSync(catalogPath) ? JSON.parse(fs.readFileSync(catalogPath, "utf8")) : null;
}
