#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const catalogPath = path.join(ROOT, "packages/mcp/catalog.json");
const manifestPath = path.join(ROOT, "packages/mcp/manifest.json");
const skipBuild = process.argv.includes("--no-build");

const previousCatalog = readWorkingTreeCatalog();
const previousManifestText = fs.existsSync(manifestPath)
  ? fs.readFileSync(manifestPath, "utf8")
  : "";

if (!skipBuild) {
  execFileSync("pnpm", ["--filter", "@nudge-design/mcp", "build:manifest"], {
    cwd: ROOT,
    stdio: "inherit",
  });
}

// generatedAt 복원 write 는 빌드를 실제로 돌렸을 때만(=catalog 가 새로 생성됐을 때만) 한다.
// --no-build(검증 모드)에서는 catalog 를 재생성하지 않으므로 이 write 가 working tree 를 헛되이
// 더럽혔다(회귀: `pnpm lint`/검증이 catalog.json 을 리포맷해 dirty 로 만듦). check 는 non-mutating 이어야 함.
if (!skipBuild && previousCatalog?.generatedAt && fs.existsSync(catalogPath)) {
  const nextCatalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  nextCatalog.generatedAt = previousCatalog.generatedAt;
  fs.writeFileSync(catalogPath, `${JSON.stringify(nextCatalog, null, 2)}\n`, "utf8");
}

const nextCatalog = readWorkingTreeCatalog();
const nextManifestText = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : "";

const previousCatalogText = previousCatalog ? `${JSON.stringify(previousCatalog, null, 2)}\n` : "";
const nextCatalogText = nextCatalog ? `${JSON.stringify(nextCatalog, null, 2)}\n` : "";

if (previousCatalogText !== nextCatalogText || previousManifestText !== nextManifestText) {
  console.error(
    "\n[check-mcp-catalog] packages/mcp/catalog.json is stale. " +
      "Run `pnpm --filter @nudge-design/mcp build:manifest` after building DS packages.",
  );
  process.exit(1);
}

function readWorkingTreeCatalog() {
  return fs.existsSync(catalogPath) ? JSON.parse(fs.readFileSync(catalogPath, "utf8")) : null;
}
