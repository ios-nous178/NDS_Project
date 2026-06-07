#!/usr/bin/env node
/**
 * sync-skills.mjs — Claude 스킬(SSOT) → Codex 스킬 미러 생성/검증
 *
 * 같은 워크플로우 스킬을 두 에이전트가 쓴다. 본문(레포 지식: 표면 맵·게이트·함정)이
 * 두 곳에서 갈리면 drift 나므로, **.claude/skills 를 SSOT 로 두고 .agents/skills(Codex)
 * 를 생성**한다. Codex 쪽은 본문 그대로 미러하고, 두 가지만 자동 주입한다.
 *
 *   1. H1 바로 아래 Codex 헤더 블록쿼트(생성됨 표시 + 호출법)
 *   2. frontmatter description 의 "/<name> ..." 트리거 옆에 "$<name> ..." 동치 추가
 *
 * 스킬은 세 부류 — 이 스크립트는 SHARED 만 생성한다(단일홈은 건드리지 않음).
 *
 *   SHARED       : .claude → .agents 로 생성 (drift 위험은 여기뿐)
 *   CODEX_ONLY   : .agents 에서 손으로 관리 (.claude 소스 없음)
 *   CLAUDE_ONLY  : .claude 전용, Codex 로 미러 안 함
 *
 * Usage:
 *   node scripts/sync-skills.mjs           # write (default) — .agents/skills 재생성
 *   node scripts/sync-skills.mjs --check   # CI lint: 생성 결과와 디스크가 다르면 exit 1
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CLAUDE_DIR = join(ROOT, ".claude", "skills");
const CODEX_DIR = join(ROOT, ".agents", "skills");

/** SSOT(.claude) → 생성 대상(.agents). header 는 H1 아래 주입할 Codex 블록쿼트. */
const SHARED = {
  "ds-component": {
    header:
      "> **Codex skill (생성됨).** SSOT 는 `.claude/skills/ds-component/SKILL.md` — 이 파일을 직접 고치지 말고 SSOT 수정 후 `pnpm sync:skills`. " +
      "명시 호출 `/skills` → `ds-component` 또는 `$ds-component <figma-url>`. Figma MCP + Nudge DS MCP 가 붙어 있어야 한다.",
  },
  "ds-audit": {
    header:
      "> **Codex skill (생성됨).** SSOT 는 `.claude/skills/ds-audit/SKILL.md` — 직접 수정 금지, SSOT 수정 후 `pnpm sync:skills`. " +
      "명시 호출 `/skills` → `ds-audit` 또는 `$ds-audit [Component|all]`. 기본 읽기 전용(임의 수정/커밋 금지).",
  },
  "ds-release": {
    header:
      "> **Codex skill (생성됨).** SSOT 는 `.claude/skills/ds-release/SKILL.md` — 직접 수정 금지, SSOT 수정 후 `pnpm sync:skills`. " +
      "명시 호출 `/skills` → `ds-release` 또는 `$ds-release`. main push 는 사용자 확인 후에만.",
  },
  "ds-fix": {
    header:
      "> **Codex skill (생성됨).** SSOT 는 `.claude/skills/ds-fix/SKILL.md` — 직접 수정 금지, SSOT 수정 후 `pnpm sync:skills`. " +
      "명시 호출 `/skills` → `ds-fix` 또는 `$ds-fix <피드백 텍스트>`. 컴포넌트 수정은 ds-component 플로우 재사용.",
  },
  "prd-extract": {
    header:
      "> **Codex skill (생성됨).** SSOT 는 `.claude/skills/prd-extract/SKILL.md` — 직접 수정 금지, SSOT 수정 후 `pnpm sync:skills`. " +
      "명시 호출 `/skills` → `prd-extract` 또는 `$prd-extract <figma|png>`. Figma MCP 또는 Export된 PNG 입력.",
  },
};

/** Codex 단일홈(손 관리) / Claude 단일홈(미러 안 함) — 침묵 누락 방지용 명시 목록. */
const CODEX_ONLY = ["ds-consumer-setup", "ds-quality-review"];
const CLAUDE_ONLY = [];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** "/<name> ..." 트리거 옆에 "$<name> ..." 동치를 추가(이미 있으면 그대로). */
function injectDollarTrigger(frontmatter, name) {
  if (frontmatter.includes(`"$${name}`)) return frontmatter;
  const re = new RegExp(`"/${esc(name)}([^"]*)"`);
  return frontmatter.replace(re, (m, args) => `"/${name}${args}", "$${name}${args}"`);
}

/**
 * H1 바로 아래에 Codex 헤더를 주입한다. H1 과 본문 첫 줄 사이의 공백·기존
 * 블록쿼트(재생성 시 중복 방지)를 통째로 `"" / header / ""` 로 치환 → 항상
 * `H1 / 공백 / header / 공백 / 본문` 형태(idempotent).
 */
function injectHeader(body, header) {
  const lines = body.split("\n");
  const h1 = lines.findIndex((l) => /^#\s/.test(l));
  if (h1 === -1) throw new Error("H1(`# ...`) 제목을 찾지 못함");

  let b = h1 + 1;
  while (b < lines.length && lines[b].trim() === "") b++; // 선행 공백
  while (b < lines.length && lines[b].startsWith(">")) b++; // 기존 블록쿼트
  while (b < lines.length && lines[b].trim() === "") b++; // 블록쿼트 뒤 공백

  lines.splice(h1 + 1, b - (h1 + 1), "", header, "");
  return lines.join("\n");
}

/** Claude SKILL.md 원문 → Codex SKILL.md 원문. */
function transform(src, name, header) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${name}: frontmatter 파싱 실패`);
  const frontmatter = injectDollarTrigger(m[1], name);
  const body = injectHeader(m[2], header);
  return `---\n${frontmatter}\n---\n${body}`;
}

function read(p) {
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

const check = process.argv.includes("--check");
let drift = 0;
const written = [];

for (const [name, cfg] of Object.entries(SHARED)) {
  const srcPath = join(CLAUDE_DIR, name, "SKILL.md");
  const src = read(srcPath);
  if (src == null) {
    console.error(`✗ SSOT 없음: ${srcPath}`);
    drift++;
    continue;
  }
  const expected = transform(src, name, cfg.header);
  const outPath = join(CODEX_DIR, name, "SKILL.md");
  const actual = read(outPath);

  if (check) {
    if (actual !== expected) {
      console.error(`✗ drift: .agents/skills/${name}/SKILL.md — \`pnpm sync:skills\` 필요`);
      drift++;
    }
  } else if (actual !== expected) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, expected, "utf-8");
    written.push(name);
  }
}

// 단일홈 스킬 존재 확인(침묵 누락 방지 — 사라졌으면 알린다).
for (const name of CODEX_ONLY) {
  if (!existsSync(join(CODEX_DIR, name, "SKILL.md")))
    console.warn(`! Codex 전용 스킬 누락: .agents/skills/${name}/SKILL.md`);
}
for (const name of CLAUDE_ONLY) {
  if (!existsSync(join(CLAUDE_DIR, name, "SKILL.md")))
    console.warn(`! Claude 전용 스킬 누락: .claude/skills/${name}/SKILL.md`);
}

// .agents 에 SHARED/CODEX_ONLY 어디에도 없는 미등록 스킬이 있으면 경고(레지스트리 갱신 유도).
const known = new Set([...Object.keys(SHARED), ...CODEX_ONLY]);
if (existsSync(CODEX_DIR)) {
  for (const d of readdirSync(CODEX_DIR, { withFileTypes: true })) {
    if (d.isDirectory() && !known.has(d.name))
      console.warn(`! 레지스트리 미등록 Codex 스킬: ${d.name} (SHARED/CODEX_ONLY 에 추가하세요)`);
  }
}

if (check) {
  if (drift) {
    console.error(`\n✗ 스킬 미러 ${drift}건 drift — \`pnpm sync:skills\` 로 재생성하세요.`);
    process.exit(1);
  }
  console.log("✓ 스킬 미러 동기화됨 (.claude → .agents)");
} else {
  console.log(
    written.length
      ? `✓ Codex 스킬 ${written.length}건 재생성: ${written.join(", ")}`
      : "✓ Codex 스킬 이미 최신 (변경 없음)",
  );
}
