#!/usr/bin/env node
/**
 * fix-all.mjs — `pnpm fix`. 생성물 재생성 일괄 오케스트레이터.
 *
 * CI 가 터지는 최다 원인은 "생성물 커밋 누락" — 16개 --check 게이트는 검증만 하고
 * 재생성은 안 해준다. 이 스크립트는 모든 게이트의 쓰기 모드를 **올바른 빌드 순서로**
 * 실행해서, 커밋 전에 한 방으로 워킹트리를 CI 가 기대하는 상태로 만든다.
 *
 *   1. 쓰기 모드가 있는 무빌드 게이트 중 빌드 입력이 되는 것 (tokens-sync, build-guides)
 *   2. turbo build — tokens→…→mcp 토폴로지 순서로 전 패키지 빌드
 *      (mcp 빌드가 catalog.json/manifest 재생성 → mcp-catalog 게이트의 fix)
 *   3. 나머지 쓰기 모드 게이트 (dist 를 읽는 generate-* 포함)
 *   4. 쓰기 모드가 없는 순수 검증 게이트 → 실패하면 "사람이 고칠 것" 목록으로 요약
 *   5. git status 로 새로 더러워진 생성물 목록 출력 → 같이 커밋하라고 안내
 *
 * 게이트 정의는 scripts/gates.mjs (check-ssot / precommit-gate 와 공유).
 *
 * Usage: pnpm fix
 */
import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GATES } from "./gates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const run = (label, [command, ...args]) => {
  console.log(`\n[fix] ${label}`);
  execFileSync(command, args, { cwd: ROOT, stdio: "inherit" });
};

const gate = (id) => GATES.find((g) => g.id === id);

// ── 1. 빌드 입력이 되는 소스 생성물 먼저 ────────────────────────────────────
// tokens-sync: DESIGN.md → tokens/src (tokens 빌드의 입력)
{
  const g = gate("tokens-sync");
  run(g.label, g.fix);
}

// ── 2. DS 패키지 체인 빌드 (turbo 가 의존 순서 보장, storybook/docs 앱 제외) ──
run("turbo build (DS 패키지 체인, 의존 순서)", [
  "pnpm",
  "turbo",
  "build",
  "--filter=@nudge-design/mcp...",
  "--filter=@nudge-design/html...",
  "--output-logs=errors-only",
]);

// ── 2.5 catalog.json generatedAt churn 정리 ────────────────────────────────
// mcp 빌드는 catalog.json 의 generatedAt 을 항상 새로 찍는다. 내용이 HEAD 와 동일하면
// 타임스탬프만의 diff 는 노이즈 — check-mcp-catalog 와 같은 규칙으로 HEAD 값을 복원한다.
{
  const catalogPath = path.join(ROOT, "packages/mcp/catalog.json");
  try {
    const head = JSON.parse(
      execSync("git show HEAD:packages/mcp/catalog.json", { cwd: ROOT, encoding: "utf8" }),
    );
    const next = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
    const { generatedAt: headTs, ...headRest } = head;
    const { generatedAt: _nextTs, ...nextRest } = next;
    if (JSON.stringify(headRest) === JSON.stringify(nextRest) && headTs) {
      execSync("git checkout -- packages/mcp/catalog.json", { cwd: ROOT });
      console.log("\n[fix] catalog.json 내용 동일 — generatedAt 타임스탬프 churn 복원");
    }
  } catch {
    // HEAD 에 catalog 가 없거나 파싱 실패 — 새로 생성된 그대로 둔다
  }
}

// ── 3. 나머지 쓰기 모드 게이트 ─────────────────────────────────────────────
// build-guides(guides.generated.ts)와 mcp-catalog(catalog.json/manifest)의 fix 는
// 2단계 mcp 빌드(build:guides → build:manifest → tsc)에 포함되므로 건너뜀.
const FIXED_EARLIER = new Set(["tokens-sync", "build-guides", "mcp-catalog"]);
for (const g of GATES) {
  if (!g.fix || FIXED_EARLIER.has(g.id)) continue;
  run(g.label, g.fix);
}

// ── 4. 쓰기 모드 없는 순수 검증 게이트 — 실패를 모아서 요약 ─────────────────
const manualFixes = [];
for (const g of GATES) {
  if (g.fix) continue;
  console.log(`\n[fix] verify: ${g.label}`);
  try {
    execFileSync(g.check[0], g.check.slice(1), { cwd: ROOT, stdio: "inherit" });
  } catch {
    manualFixes.push(g);
  }
}

// ── 5. 더러워진 생성물 안내 ────────────────────────────────────────────────
const dirty = execSync("git status --porcelain", { cwd: ROOT, encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

console.log("\n──────────────────────────────────────────────");
if (dirty.length > 0) {
  console.log("[fix] 재생성된 파일 — 변경분과 같이 커밋하세요:");
  for (const line of dirty) console.log(`  ${line}`);
} else {
  console.log("[fix] 재생성으로 달라진 파일 없음 (워킹트리 클린).");
}

if (manualFixes.length > 0) {
  console.error("\n[fix] 자동 수정이 불가능한 게이트 — 사람이 고쳐야 합니다:");
  for (const g of manualFixes) {
    console.error(`  ✗ ${g.label}`);
    if (g.fixHint) console.error(`    → ${g.fixHint}`);
  }
  process.exit(1);
}

console.log("\n[fix] 완료. 커밋 후 CI 게이트(pnpm lint)와 동일 기준을 통과합니다.");
