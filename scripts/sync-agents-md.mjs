#!/usr/bin/env node
/**
 * sync-agents-md.mjs — CLAUDE.md(SSOT) → AGENTS.md 생성/검증
 *
 * AGENTS.md(Codex 등 타 에이전트용 작업 규칙)는 수기로 유지되는 동안 CLAUDE.md 와
 * 계속 갈라졌다(6일 stale + 잘못된 일괄치환 흔적). 같은 레포 지식이 두 곳에서 갈리면
 * 어느 쪽도 못 믿게 되므로, **CLAUDE.md 를 SSOT 로 두고 AGENTS.md 를 생성**한다.
 *
 * 변환 규칙 (명시 목록만 — 무분별 치환 금지):
 *   1. H1 바로 아래에 "생성됨" 안내 블록쿼트 주입 (sync-skills.mjs 와 동일 패턴)
 *   2. Codex 전용 추가 내용이 필요하면 기존 AGENTS.md 의
 *      <!-- codex:begin --> ... <!-- codex:end --> 블록을 파일 끝에 보존한다.
 *      (그 밖의 손수정은 재생성 시 사라진다 — CLAUDE.md 를 고칠 것)
 *
 * Usage:
 *   node scripts/sync-agents-md.mjs           # write — AGENTS.md 재생성
 *   node scripts/sync-agents-md.mjs --check   # CI lint: 생성 결과와 디스크가 다르면 exit 1
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CLAUDE_MD = join(ROOT, "CLAUDE.md");
const AGENTS_MD = join(ROOT, "AGENTS.md");

const HEADER =
  "> **생성된 파일.** SSOT 는 루트 `CLAUDE.md` — 이 파일을 직접 고치지 말고 CLAUDE.md 수정 후 " +
  "`pnpm sync:agents-md`. Codex 전용 추가 내용은 `<!-- codex:begin -->` ~ `<!-- codex:end -->` " +
  "블록 안에만 쓰면 재생성 시 보존된다. `pnpm lint` 의 sync-agents-md --check 가 drift 를 차단한다.";

/** H1 바로 아래에 헤더 블록쿼트 주입 — H1 과 본문 사이 기존 공백/블록쿼트를 치환(idempotent). */
function injectHeader(body) {
  const lines = body.split("\n");
  const h1 = lines.findIndex((l) => /^#\s/.test(l));
  if (h1 === -1) return `${HEADER}\n\n${body}`;
  let next = h1 + 1;
  while (next < lines.length && (lines[next].trim() === "" || lines[next].startsWith(">"))) {
    next += 1;
  }
  return [...lines.slice(0, h1 + 1), "", HEADER, "", ...lines.slice(next)].join("\n");
}

/** 기존 AGENTS.md 의 codex 전용 보존 블록 추출 (없으면 빈 배열).
 *  마커는 줄 전체일 때만 인정 — 헤더 블록쿼트 안의 마커 *언급*이 매칭되지 않게 한다. */
function extractCodexBlocks(existing) {
  const blocks = [];
  const re = /^<!-- codex:begin -->$[\s\S]*?^<!-- codex:end -->$/gm;
  for (const m of existing.matchAll(re)) blocks.push(m[0]);
  return blocks;
}

function generate() {
  const source = readFileSync(CLAUDE_MD, "utf-8");
  const existing = existsSync(AGENTS_MD) ? readFileSync(AGENTS_MD, "utf-8") : "";
  let out = injectHeader(source);
  const codexBlocks = extractCodexBlocks(existing);
  if (codexBlocks.length > 0) {
    out = `${out.replace(/\n+$/, "")}\n\n${codexBlocks.join("\n\n")}\n`;
  }
  if (!out.endsWith("\n")) out += "\n";
  return out;
}

const isCheck = process.argv.includes("--check");
const expected = generate();
const actual = existsSync(AGENTS_MD) ? readFileSync(AGENTS_MD, "utf-8") : "";

if (isCheck) {
  if (actual !== expected) {
    console.error(
      "[sync-agents-md] ✗ AGENTS.md 가 CLAUDE.md(SSOT) 와 어긋났습니다. " +
        "`pnpm sync:agents-md` 로 재생성 후 같이 커밋하세요.",
    );
    process.exit(1);
  }
  console.log("[sync-agents-md] ✓ AGENTS.md 가 CLAUDE.md 와 동기화돼 있습니다.");
} else {
  if (actual === expected) {
    console.log("[sync-agents-md] AGENTS.md 변경 없음.");
  } else {
    writeFileSync(AGENTS_MD, expected, "utf-8");
    console.log("[sync-agents-md] AGENTS.md 재생성 완료 (SSOT: CLAUDE.md).");
  }
}
