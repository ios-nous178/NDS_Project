#!/usr/bin/env node
/**
 * 하드 게이트 — 인풋 placeholder/helper 색의 토큰 바인딩 검사.
 *
 * 모든 텍스트 인풋의 ::placeholder 색은 `cv.input.placeholder`(= --semantic-input-placeholder),
 * helper text(기본 상태) 색은 `cv.input.helpertextDefault`(= --semantic-input-helpertext-default)
 * 단일 토큰을 바라봐야 한다. 과거 여러 컴포넌트가 `cv.textRole.muted`/`cv.textRole.subtle`
 * 로 따로 박아 브랜드별로 색이 달라지는 드리프트가 있었다(Figma TextField 3447-467 정합 작업).
 * 이 스크립트가 그 회귀를 PR 단계에서 막는다.
 *
 * 실행: node scripts/check-input-token-binding.mjs   (pnpm lint 에 포함)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stylesDir = path.join(root, "packages/styles/src");

/* 선택 컨트롤(텍스트 인풋 아님) — helper 가 input.* 토큰을 안 써도 되는 예외. */
const HELPER_ALLOWLIST = new Set(["Checkbox.ts", "Radio.ts"]);

const PLACEHOLDER_OK = /cv\.input\.placeholder|--semantic-input-placeholder/;
const HELPER_OK = /cv\.input\.helpertext|--semantic-input-helpertext/;

const violations = [];

for (const file of fs.readdirSync(stylesDir).filter((f) => f.endsWith(".ts")).sort()) {
  const src = fs.readFileSync(path.join(stylesDir, file), "utf-8");

  // 1) ::placeholder 룰의 color → cv.input.placeholder 여야 함
  for (const m of src.matchAll(/::placeholder[^{}]*\{[^{}]*?color:\s*([^;]+);/g)) {
    if (!PLACEHOLDER_OK.test(m[1])) {
      violations.push(`${file}: ::placeholder color = "${m[1].trim()}" (→ cv.input.placeholder 사용)`);
    }
  }

  // 2) 기본 helper 룰의 color → cv.input.helpertext* 여야 함.
  //    selector 가 `...HELPER})` 로 끝나는 base 룰만(상태 룰 `HELPER}[data-error]` 은 제외).
  //    룰 본문의 `${...}` 템플릿 brace 때문에 정규식 brace 매칭은 깨진다 → line 기반 스캔.
  if (HELPER_ALLOWLIST.has(file)) continue;
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!/\$\{\w*HELPER\w*\}\)\s*\{/.test(lines[i])) continue; // base helper 룰 시작
    for (let j = i; j < lines.length; j++) {
      if (j > i && /^\s*\}\s*$/.test(lines[j])) break; // 룰 닫힘
      const c = lines[j].match(/color:\s*([^;]+);/);
      if (c) {
        if (!HELPER_OK.test(c[1])) {
          violations.push(`${file}: helper color = "${c[1].trim()}" (→ cv.input.helpertextDefault 사용)`);
        }
        break; // base 룰의 첫 color 만
      }
    }
  }
}

if (violations.length === 0) {
  console.log("[check-input-token-binding] ✓ 모든 인풋 placeholder/helper 가 cv.input.* 토큰을 바라봄.");
  process.exit(0);
}

console.error(
  "[check-input-token-binding] ✗ 인풋 색 토큰 드리프트:\n" +
    violations.map((v) => `  · ${v}`).join("\n") +
    "\n  → placeholder=cv.input.placeholder · helper=cv.input.helpertextDefault 로 통일하세요 " +
    "(브랜드별 값은 packages/tokens/src/brands/*.semantic.ts 의 input 슬롯이 SSOT).",
);
process.exit(1);
