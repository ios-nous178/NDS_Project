#!/usr/bin/env node
/**
 * precommit-gate.mjs — staged 파일 기반 선별 게이트 (pre-commit / Claude Code hook 공용).
 *
 * `pnpm lint` 풀체인은 빌드 의존이라 pre-commit 에 못 넣는다. 대신 staged 경로에
 * 매칭되는 **무빌드 게이트만** 골라 실행한다 (목표 <15초). dist/catalog 를 읽는
 * 게이트(mcp-catalog, mirror-parity, project-completeness, component-guides, guide-docs)는
 * stale dist 오탐이 있어 여기서 빼고 — `pnpm fix` 와 CI 가 담당한다.
 *
 * 게이트 정의는 scripts/gates.mjs (check-ssot / fix-all 과 공유).
 * 실패하면 "pnpm fix 실행 후 재커밋" 으로 안내. 비상시 탈출구: git commit --no-verify.
 *
 * Usage:
 *   node scripts/precommit-gate.mjs            # staged 파일 기준 (pre-commit)
 *   node scripts/precommit-gate.mjs --worktree # staged+미staged+untracked (커밋 전 hook 용 —
 *                                              #  git add 와 commit 이 한 명령일 때 staged 가 비어 있음)
 *   node scripts/precommit-gate.mjs --all      # 전체 무빌드 게이트 실행
 */
import { execFileSync, execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { precommitGates, gatesForPaths } from "./gates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const runAll = process.argv.includes("--all");
const useWorktree = process.argv.includes("--worktree");

const git = (cmd) => execSync(cmd, { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);

const staged = useWorktree
  ? git("git status --porcelain").map((l) => l.slice(3).split(" -> ").pop())
  : git("git diff --cached --name-only");

if (!runAll && staged.length === 0) {
  console.log("[precommit] staged 파일 없음 — 게이트 생략.");
  process.exit(0);
}

const candidates = precommitGates();
const selected = runAll ? candidates : gatesForPaths(candidates, staged);

// ── 경고성 점검 (차단하지 않음) ─────────────────────────────────────────────
const warnings = [];

// DS 소스 변경인데 changeset 없음 → 릴리즈 파이프라인에서 누락됨
const dsSourceTouched = staged.some((p) =>
  [
    "packages/react/src/",
    "packages/html/src/",
    "packages/styles/src/",
    "packages/tokens/src/",
  ].some((prefix) => p.startsWith(prefix)),
);
if (dsSourceTouched && !staged.some((p) => p.startsWith(".changeset/"))) {
  warnings.push(
    "DS 패키지 소스가 변경됐는데 .changeset/ 이 staged 에 없습니다 — 외부 전파(MCPB 릴리즈)가 필요한 변경이면 `pnpm changeset` 을 잊지 마세요.",
  );
}

// package.json 의존성 변경인데 lockfile 미포함 → CI --frozen-lockfile 실패
const pkgJsonTouched = staged.some((p) => p.endsWith("package.json"));
if (pkgJsonTouched && !staged.includes("pnpm-lock.yaml")) {
  warnings.push(
    "package.json 이 변경됐는데 pnpm-lock.yaml 이 staged 에 없습니다 — 의존성을 추가/변경했다면 lockfile 도 같이 커밋해야 CI(--frozen-lockfile)가 통과합니다.",
  );
}

// ── 선별된 게이트 실행 ─────────────────────────────────────────────────────
const failed = [];
if (selected.length === 0) {
  console.log("[precommit] staged 경로에 매칭되는 게이트 없음.");
} else {
  const t0 = Date.now();
  for (const g of selected) {
    process.stdout.write(`[precommit] ${g.label} … `);
    try {
      execFileSync(g.check[0], g.check.slice(1), { cwd: ROOT, stdio: "pipe" });
      console.log("ok");
    } catch (err) {
      const out = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
      // dist 미빌드로 인한 모듈 로드 실패는 게이트 위반이 아니라 환경 문제 —
      // 차단하지 않고 경고로 강등 (CI 와 pnpm fix 가 빌드 후 검증한다).
      if (
        err.code === "ERR_MODULE_NOT_FOUND" ||
        /ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND/.test(out)
      ) {
        console.log("skip (dist 미빌드)");
        warnings.push(
          `${g.label}: 의존 dist 가 없어 검증 생략 — \`pnpm fix\` 가 빌드 후 검증합니다.`,
        );
        continue;
      }
      console.log("FAIL");
      if (out)
        console.error(
          out
            .split("\n")
            .map((l) => `    ${l}`)
            .join("\n"),
        );
      failed.push(g);
    }
  }
  console.log(`[precommit] ${selected.length}개 게이트, ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

for (const w of warnings) console.warn(`\n[precommit] ⚠ ${w}`);

if (failed.length > 0) {
  console.error("\n[precommit] 커밋 차단 — 실패한 게이트:");
  for (const g of failed) {
    console.error(`  ✗ ${g.label}`);
    if (!g.fix && g.fixHint) console.error(`    → ${g.fixHint}`);
  }
  console.error("\n  → `pnpm fix` 실행 후 재생성 파일을 staged 에 추가해 재커밋하세요.");
  console.error("  → (비상시: git commit --no-verify)");
  process.exit(1);
}
