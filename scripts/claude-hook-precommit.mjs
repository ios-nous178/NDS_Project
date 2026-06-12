#!/usr/bin/env node
/**
 * claude-hook-precommit.mjs — Claude Code PreToolUse(Bash) hook 래퍼.
 *
 * stdin 으로 들어오는 hook payload 에서 Bash 명령을 읽어, `git commit` 이면
 * precommit-gate 를 --worktree 모드로 선실행한다 (add 와 commit 이 한 명령에 묶여
 * 있어도 변경 파일을 잡도록). 게이트 실패 시 exit 2 → 커밋 차단 + stderr 가
 * Claude 에게 피드백돼 `pnpm fix` 루프로 유도된다.
 *
 * husky pre-commit 과 이중 방어 — husky 는 모든 커밋(사람 포함)을 커밋 시점에 막고,
 * 이 hook 은 Claude 의 커밋 시도를 한 단계 일찍 잡아 add→commit 재시도 낭비를 줄인다.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

let raw = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) raw += chunk;

let command = "";
try {
  command = JSON.parse(raw)?.tool_input?.command ?? "";
} catch {
  process.exit(0); // payload 파싱 실패 — 차단하지 않음
}

// `git commit` 호출만 대상 (커밋 메시지 본문 안의 우연한 매칭은 명령 선두/연결자 뒤로 한정)
if (!/(^|[;&|]\s*|&&\s*)git\s+(-[^\s]+\s+)*commit\b/.test(command)) process.exit(0);
if (command.includes("--no-verify")) process.exit(0); // 비상 탈출구 존중

const { status } = spawnSync("node", ["scripts/precommit-gate.mjs", "--worktree"], {
  cwd: ROOT,
  stdio: ["ignore", 2, 2], // 게이트 출력을 stderr 로 — exit 2 와 함께 Claude 에게 전달됨
});

process.exit(status === 0 ? 0 : 2);
