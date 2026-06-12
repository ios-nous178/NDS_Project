#!/usr/bin/env node
/**
 * MCP 컴포넌트 가이드의 figmaNodeUrl 게이트.
 *
 * DS 편입 기준 2번("Figma 가이드 노드 존재")이 가이드 frontmatter 의 figmaNodeUrl 로
 * 추적되는데, 게이트가 없어 누락이 91/144 까지 누적됐다(2026-06-12 실측).
 *
 *   - 기존 누락분은 scripts/guide-figma-baseline.json waiver — **경고만** (차단 아님)
 *   - baseline 밖 신규 가이드의 figmaNodeUrl 누락은 **exit 1** (신규 누락 차단)
 *   - baseline 항목이 해소되면(URL 추가됨) 경고로 알려줌 — 그때 baseline 에서 제거
 *
 * Usage: node scripts/check-guide-figma-links.mjs [--update-baseline]
 *   --update-baseline  현재 누락분 전체를 baseline 으로 재박제 (초기 도입/일괄 정리용)
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GUIDES_DIR = path.join(ROOT, "packages", "mcp", "guides-src", "components");
const BASELINE_PATH = path.join(__dirname, "guide-figma-baseline.json");

function hasFigmaNodeUrl(source) {
  const fm = source.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return false;
  return /^figmaNodeUrl:\s*\S+/m.test(fm[1]);
}

const guides = readdirSync(GUIDES_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ name: f.replace(/\.md$/, ""), file: f }));

const missing = guides.filter(
  (g) => !hasFigmaNodeUrl(readFileSync(path.join(GUIDES_DIR, g.file), "utf8")),
);

if (process.argv.includes("--update-baseline")) {
  const baseline = {
    $comment:
      "check-guide-figma-links.mjs waiver — 게이트 도입(2026-06-12) 이전부터 figmaNodeUrl 이 없던 가이드. " +
      "Figma 가이드 노드를 확보해 frontmatter 에 figmaNodeUrl 을 추가하면 게이트가 '해소됨' 경고를 주니 그때 항목을 지울 것. " +
      "신규 가이드는 여기 추가하지 말고 figmaNodeUrl 을 채우는 게 기본 (DS 편입 기준 2번).",
    missing: missing.map((g) => g.name).sort(),
  };
  writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
  console.log(`[check-guide-figma-links] baseline 재박제: ${missing.length}건`);
  process.exit(0);
}

let baseline = new Set();
try {
  baseline = new Set(JSON.parse(readFileSync(BASELINE_PATH, "utf8")).missing);
} catch {
  /* baseline 없으면 전부 신규 취급 */
}

const isCI = process.env.CI === "true";
const newMissing = missing.filter((g) => !baseline.has(g.name));
const waivedMissing = missing.filter((g) => baseline.has(g.name));
const resolved = [...baseline].filter((name) => !missing.some((g) => g.name === name));

for (const name of resolved) {
  console.warn(
    `[check-guide-figma-links] ⚠ baseline 의 ${name} 은 figmaNodeUrl 이 채워짐 — guide-figma-baseline.json 에서 제거하세요.`,
  );
}

if (waivedMissing.length > 0) {
  console.warn(
    `[check-guide-figma-links] ⚠ figmaNodeUrl 누락 ${waivedMissing.length}건 (baseline waiver — 차단 안 함). ` +
      `목록: scripts/guide-figma-baseline.json`,
  );
  if (isCI) {
    console.log(
      `::warning title=guide figmaNodeUrl missing::${waivedMissing.length} component guides lack figmaNodeUrl (baselined). ` +
        `See scripts/guide-figma-baseline.json`,
    );
  }
}

if (newMissing.length > 0) {
  console.error("[check-guide-figma-links] ✗ 신규 가이드의 figmaNodeUrl 누락:");
  for (const g of newMissing) {
    console.error(`- packages/mcp/guides-src/components/${g.file}`);
  }
  console.error(
    "\nfrontmatter 에 figmaNodeUrl 을 추가하세요 (DS 편입 기준 2번 — 디자인 근거 없는 컴포넌트는 받지 않는다). " +
      "정말 예외라면 scripts/guide-figma-baseline.json 에 사유 검토 후 추가.",
  );
  process.exit(1);
}

console.log(
  `[check-guide-figma-links] ✓ 가이드 ${guides.length}건 — figmaNodeUrl 보유 ${guides.length - missing.length}건, waiver ${waivedMissing.length}건, 신규 누락 0.`,
);
