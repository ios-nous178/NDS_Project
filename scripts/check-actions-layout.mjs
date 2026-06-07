#!/usr/bin/env node
/**
 * 하드 게이트 — actionsLayout 브랜드 기본 SSOT 완전성 검사.
 *
 * 브랜드 기본 버튼 배치는 각 BrandTheme(packages/tokens/src/brands/*.ts)의
 * `actionsLayout` 필드가 SSOT 다 (v4.4 Harness 통합). 새 브랜드를 추가하고
 * `actionsLayout`("split"|"end")을 안 정하면 여기서 빌드를 막는다.
 * (actionsLayout.ts 의 BRAND_ACTIONS_LAYOUT 은 이 테마들에서 파생되는 조회 맵.)
 *
 * 실행: node scripts/check-actions-layout.mjs   (pnpm lint 에 포함)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brandsDir = path.join(root, "packages/tokens/src/brands");

const VALID = ["split", "end"];

/* 1) 브랜드 메인 파일(.ts) — index/types/semantic/palette 제외 */
const brandFiles = fs
  .readdirSync(brandsDir)
  .filter(
    (f) =>
      f.endsWith(".ts") &&
      !["index.ts", "types.ts"].includes(f) &&
      !f.includes(".semantic.") &&
      !f.includes(".palette."),
  )
  .sort();

/* 2) 각 테마 파일에서 actionsLayout 선언 + 값 검사 */
const missing = [];
const invalid = [];
for (const f of brandFiles) {
  const slug = f.replace(/\.ts$/, "");
  const src = fs.readFileSync(path.join(brandsDir, f), "utf-8");
  const m = src.match(/actionsLayout\s*:\s*["']([\w-]+)["']/);
  if (!m) {
    missing.push(slug);
  } else if (!VALID.includes(m[1])) {
    invalid.push(`${slug} (= "${m[1]}")`);
  }
}

if (missing.length === 0 && invalid.length === 0) {
  console.log(
    `[check-actions-layout] ✓ ${brandFiles.length}개 브랜드 모두 actionsLayout 선언됨 ` +
      `(${brandFiles.map((f) => f.replace(/\.ts$/, "")).join(", ")}).`,
  );
  process.exit(0);
}

if (missing.length) {
  console.error(
    `[check-actions-layout] ✗ actionsLayout 미선언 브랜드: ${missing.join(", ")}\n` +
      `  → 각 BrandTheme(packages/tokens/src/brands/<brand>.ts)에 actionsLayout("split"|"end")을 추가하세요.`,
  );
}
if (invalid.length) {
  console.error(
    `[check-actions-layout] ✗ actionsLayout 값이 ${VALID.map((v) => `"${v}"`).join("|")} 가 아님: ${invalid.join(", ")}`,
  );
}
process.exit(1);
