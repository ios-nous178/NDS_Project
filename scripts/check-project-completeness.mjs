#!/usr/bin/env node
/**
 * 하드 게이트 — 프로젝트 시멘틱 완전성 검사.
 *
 * base(cashwalkSemantic)의 leaf 토큰은 각 프로젝트 시멘틱(*.semantic.ts)에
 * **명시적으로** 정의돼 있거나, scripts/project-completeness-baseline.json 에
 * 사유와 함께 waiver 로 등재돼야 한다. 등재 없는 누락 = silent base-fallback
 * (프로젝트 화면에 base 파랑이 새는 "캐포비 노랑 모달" 클래스 버그의 구조적 원인)
 * 이므로 빌드를 막는다.
 *
 * + 프로젝트 theme.components 가 emit 하는 `--nds-{component}-{prop}` 슬롯이
 *   실제 소비처(packages/{styles,react,html,mockup-core}/src 의 `--nds-…` 참조)에
 *   존재하는지 검사한다 — 슬롯명 오타는 var(--nds-…, fallback) 문법이 조용히
 *   숨겨버리므로 여기서만 잡힌다.
 *
 * 실행: node scripts/check-project-completeness.mjs   (pnpm lint 의 check-ssot 체인에 포함)
 * 사전조건: pnpm build --filter @nudge-design/tokens (dist 를 읽는다)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distProjects = path.join(root, "packages/tokens/dist/projects");
const baselinePath = path.join(root, "scripts/project-completeness-baseline.json");

if (!fs.existsSync(path.join(distProjects, "cashwalk.semantic.js"))) {
  console.error(
    "[check-project-completeness] ✗ packages/tokens/dist 가 없습니다. " +
      "'pnpm build --filter @nudge-design/tokens' 후 다시 실행하세요.",
  );
  process.exit(1);
}

// base = cashwalk(소비자앱). 프로젝트가 cover 해야 할 leaf 기준 집합.
// NudgeEAP 는 옛 base 였지만 이제 일반 프로젝트 델타 → PROJECTS 에 포함해 함께 검사.
const { cashwalkSemantic } = require(path.join(distProjects, "cashwalk.semantic.js"));
const PROJECTS = [
  {
    slug: "nudge-eap",
    semantic: require(path.join(distProjects, "nudge-eap.semantic.js")).nudgeEapSemantic,
  },
  { slug: "trost", semantic: require(path.join(distProjects, "trost.semantic.js")).trostSemantic },
  {
    slug: "geniet",
    semantic: require(path.join(distProjects, "geniet.semantic.js")).genietSemantic,
  },
  {
    slug: "cashwalk-biz",
    semantic: require(path.join(distProjects, "cashwalk-biz.semantic.js")).cashwalkBizSemantic,
  },
  {
    slug: "runmile",
    semantic: require(path.join(distProjects, "runmile.semantic.js")).runmileSemantic,
  },
];
const THEMES = [
  { slug: "nudge-eap", theme: require(path.join(distProjects, "nudge-eap.js")).nudgeEapTheme },
  { slug: "trost", theme: require(path.join(distProjects, "trost.js")).trostTheme },
  { slug: "geniet", theme: require(path.join(distProjects, "geniet.js")).genietTheme },
  {
    slug: "cashwalk-biz",
    theme: require(path.join(distProjects, "cashwalk-biz.js")).cashwalkBizTheme,
  },
  { slug: "runmile", theme: require(path.join(distProjects, "runmile.js")).runmileTheme },
];

/* ── 1) base leaf → 프로젝트 명시 여부 ───────────────────────────────── */

function flattenLeaves(obj, prefix = "", into = new Map()) {
  for (const [key, value] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${key}` : key;
    // ref("color.x.y") 는 `{ $ref }` 객체 — leaf 로 취급(재귀 금지). 같은 논리 토큰을
    // base 가 ref() 로, 프로젝트가 `var(--semantic-…)` 문자열로 정의해도 키가 동일하게
    // (`group.role.variant`) 잡혀 표현 차이로 인한 false-positive 누락을 막는다.
    if (value !== null && typeof value === "object" && !("$ref" in value))
      flattenLeaves(value, p, into);
    else into.set(p, value);
  }
  return into;
}

const baseLeaves = flattenLeaves(cashwalkSemantic);

/** waiver baseline — { project, key, reason } 목록 */
const baseline = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, "utf-8"))
  : { entries: [] };
const waivers = new Map(baseline.entries.map((e) => [`${e.project}::${e.key}`, e]));

const missing = []; // waiver 없는 누락 → 차단
const usedWaivers = new Set();

for (const { slug, semantic } of PROJECTS) {
  const projectLeaves = flattenLeaves(semantic);
  for (const key of baseLeaves.keys()) {
    if (projectLeaves.has(key)) continue;
    const wKey = `${slug}::${key}`;
    if (waivers.has(wKey)) {
      usedWaivers.add(wKey);
      continue;
    }
    missing.push(wKey);
  }
}

/* stale waiver — 이제 명시됐는데 baseline 에 남아 있는 항목 (정리 안내, 차단 안 함) */
const staleWaivers = [...waivers.keys()].filter((k) => !usedWaivers.has(k));

/* ── 2) theme.components 의 --nds-* 슬롯이 소비처에 존재하는지 ────────── */

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

const emittedSlots = new Map(); // varName → 선언 프로젝트들
for (const { slug, theme } of THEMES) {
  const components = theme?.components;
  if (!components) continue;
  for (const [component, props] of Object.entries(components)) {
    if (!props) continue;
    for (const prop of Object.keys(props)) {
      const varName = `--nds-${component}-${camelToKebab(prop)}`;
      if (!emittedSlots.has(varName)) emittedSlots.set(varName, []);
      emittedSlots.get(varName).push(slug);
    }
  }
}

/** 소스에서 소비되는 --nds-* 변수명 수집 */
const CONSUMER_DIRS = [
  "packages/styles/src",
  "packages/react/src",
  "packages/html/src",
  "packages/mockup-core/src",
];
const consumed = new Set();
const dynamicPrefixes = new Set(); // `--nds-chart-${i+1}` 류 — 템플릿 조립 변수명의 prefix
const NDS_VAR_RE = /--nds-[a-z0-9][a-z0-9-]*/g;
const NDS_DYNAMIC_RE = /--nds-[a-z0-9][a-z0-9-]*-(?=\$\{)/g;
for (const dir of CONSUMER_DIRS) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  const stack = [abs];
  while (stack.length) {
    const cur = stack.pop();
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const p = path.join(cur, entry.name);
      if (entry.isDirectory()) stack.push(p);
      else if (/\.(ts|tsx|css)$/.test(entry.name)) {
        const src = fs.readFileSync(p, "utf-8");
        for (const m of src.matchAll(NDS_VAR_RE)) consumed.add(m[0]);
        for (const m of src.matchAll(NDS_DYNAMIC_RE)) dynamicPrefixes.add(m[0]);
      }
    }
  }
}

const orphanSlots = [...emittedSlots.entries()].filter(
  ([varName]) =>
    !consumed.has(varName) && ![...dynamicPrefixes].some((pre) => varName.startsWith(pre)),
);

/* ── 리포트 ───────────────────────────────────────────────────────── */

let failed = false;

if (missing.length) {
  failed = true;
  console.error(
    `[check-project-completeness] ✗ base 시멘틱 leaf ${baseLeaves.size}개 중 프로젝트 미정의 ${missing.length}건 (waiver 없음):`,
  );
  for (const k of missing.sort()) console.error(`    - ${k}`);
  console.error(
    "  → 프로젝트 *.semantic.ts 에 명시하거나, 의도된 base-fallback 이면\n" +
      "    scripts/project-completeness-baseline.json 에 { project, key, reason } 으로 등재하세요.",
  );
}

if (orphanSlots.length) {
  failed = true;
  console.error(
    `[check-project-completeness] ✗ 소비처 없는 --nds-* 슬롯 ${orphanSlots.length}건 (슬롯명 오타 의심):`,
  );
  for (const [varName, slugs] of orphanSlots)
    console.error(`    - ${varName} (선언: ${slugs.join(", ")})`);
  console.error(
    "  → styles/react/html 어디서도 var(" +
      "--nds-…) 로 읽지 않습니다. 프로젝트 theme components 슬롯명을 확인하세요.",
  );
}

if (staleWaivers.length) {
  console.log(
    `[check-project-completeness] ⚠ stale waiver ${staleWaivers.length}건 — 이미 명시됐으니 baseline 에서 지우세요:`,
  );
  for (const k of staleWaivers.sort()) console.log(`    - ${k}`);
}

if (!failed) {
  console.log(
    `[check-project-completeness] ✓ base leaf ${baseLeaves.size}개 × ${PROJECTS.length}프로젝트 — ` +
      `명시 or waiver ${usedWaivers.size}건, 누락 0. --nds-* 슬롯 ${emittedSlots.size}개 모두 소비처 확인.`,
  );
}
process.exit(failed ? 1 : 0);
