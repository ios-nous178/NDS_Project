#!/usr/bin/env node
/**
 * 하드 게이트 — 아이콘 SVG 파일명 명명 규칙 검사.
 *
 * 파일명(`packages/icons/svg/{mono,multicolor}/<name>.svg`)이 곧 export 이름이라
 * (`generate.cjs` 가 kebab → PascalCase + Icon), 명명 드리프트는 외부 API 드리프트다.
 * 규칙 SSOT 본문은 packages/icons/README.md "명명 규칙" 섹션.
 *
 * 기계적으로 검출 가능한 규칙만 강제한다(셰브론/화살표·방향 같은 시각 속성은 불가):
 *   (A) 형식      — kebab-case 소문자 (영문/숫자/하이픈)
 *   (B) 철자      — segment 단위 denylist (alram→alarm, img→image …)
 *   (C) 채움 접미사 — 프로젝트 아이콘은 `-fill`/`-filled` 금지(= `-solid`)
 *   (D) circle 어순 — 프로젝트 아이콘 `circle-<noun>`(circle-first) 금지(= `<noun>-circle`)
 *
 * (C)(D) 는 프로젝트 prefix 아이콘에만 적용(컨벤션 범위). generic 아이콘(star-filled 등)은
 * 비대상. 의도된 예외는 scripts/icon-naming-baseline.json waivers 에 사유와 함께 등재.
 *
 * baseline 없음/비어있음이 정상 — 위반은 대부분 실제 드리프트다.
 * 실행: node scripts/check-icon-naming.mjs   (pnpm lint 에 포함)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svgRoot = path.join(root, "packages/icons/svg");
const categories = ["mono", "multicolor"];

const PROJECTS = ["cashwalk-biz", "cashwalk", "nudge-eap", "geniet", "trost", "runmile"];
// segment 단위(하이픈으로 분리된 토막) 철자 denylist → 권장어
const DENY_SEGMENTS = { alram: "alarm", img: "image" };

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/* waiver baseline (선택) — { waivers: [{ name, reason }] } */
let waived = new Set();
const baselinePath = path.join(root, "scripts/icon-naming-baseline.json");
if (fs.existsSync(baselinePath)) {
  try {
    const b = JSON.parse(fs.readFileSync(baselinePath, "utf-8"));
    for (const w of b.waivers ?? []) if (w?.name) waived.add(w.name);
  } catch (e) {
    console.error(`[check-icon-naming] baseline 파싱 실패: ${e.message}`);
    process.exit(1);
  }
}

const projectOf = (name) =>
  PROJECTS.find((b) => name === b || name.startsWith(b + "-")) ?? null;

const violations = [];
for (const cat of categories) {
  const dir = path.join(svgRoot, cat);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith(".svg")) continue;
    const name = f.slice(0, -4);
    if (waived.has(name)) continue;
    const add = (rule, msg) => violations.push({ cat, name, rule, msg });

    // (A) 형식
    if (!KEBAB.test(name)) {
      add("format", "kebab-case(소문자·영문/숫자/하이픈)만 허용");
      continue; // 형식 깨지면 나머지 룰 의미 없음
    }

    const segs = name.split("-");
    // (B) 철자 denylist
    for (const seg of segs) {
      if (DENY_SEGMENTS[seg]) {
        add("spelling", `'${seg}' → '${DENY_SEGMENTS[seg]}' 로 교정`);
      }
    }

    const project = projectOf(name);
    if (!project) continue; // (C)(D) 는 프로젝트 아이콘 한정

    // (C) 채움 접미사
    if (name.endsWith("-fill") || name.endsWith("-filled")) {
      add("fill-suffix", "프로젝트 아이콘 채움 변형은 `-solid` 로 통일(`-fill`/`-filled` 금지)");
    }
    // (D) circle 어순 (circle 뒤에 segment 가 더 있으면 circle-first)
    const rest = name.slice(project.length + 1); // 프로젝트 prefix 제거
    if (/^circle-.+/.test(rest)) {
      const parts = rest.split("-"); // ["circle", noun, ...modifiers]
      const reordered = [...parts.slice(1, 2), "circle", ...parts.slice(2)].join("-");
      add("circle-order", `\`${project}-${reordered}\` 로 (명사-circle 어순)`);
    }
  }
}

if (violations.length === 0) {
  console.log("[check-icon-naming] ✓ 아이콘 파일명 명명 규칙 통과 (kebab·철자·-solid·*-circle).");
  process.exit(0);
}

const ruleLabel = {
  format: "형식",
  spelling: "철자",
  "fill-suffix": "채움 접미사",
  "circle-order": "circle 어순",
};
console.error(`[check-icon-naming] ✗ 명명 규칙 위반 ${violations.length}건:`);
for (const v of violations) {
  console.error(`  [${ruleLabel[v.rule]}] ${v.cat}/${v.name}.svg — ${v.msg}`);
}
console.error(
  "\n  rename 은 외부 export 가 바뀌는 breaking 변경 — svg 파일 rename + 소비처(guides.ts 등)\n" +
    "  동기화 + changeset(minor) + `pnpm fix`. 규칙은 packages/icons/README.md '명명 규칙' 참조.\n" +
    "  의도된 예외는 scripts/icon-naming-baseline.json 의 waivers 에 사유와 함께 등재.",
);
process.exit(1);
