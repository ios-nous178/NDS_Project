#!/usr/bin/env node
/**
 * 하드 게이트 — 브랜드 시멘틱 완전성 검사.
 *
 * base(nudgeEapSemantic)의 leaf 토큰은 각 브랜드 시멘틱(*.semantic.ts)에
 * **명시적으로** 정의돼 있거나, scripts/brand-completeness-baseline.json 에
 * 사유와 함께 waiver 로 등재돼야 한다. 등재 없는 누락 = silent base-fallback
 * (브랜드 화면에 base 파랑이 새는 "캐포비 노랑 모달" 클래스 버그의 구조적 원인)
 * 이므로 빌드를 막는다.
 *
 * + 브랜드 theme.components 가 emit 하는 `--nds-{component}-{prop}` 슬롯이
 *   실제 소비처(packages/{styles,react,html,mockup-core}/src 의 `--nds-…` 참조)에
 *   존재하는지 검사한다 — 슬롯명 오타는 var(--nds-…, fallback) 문법이 조용히
 *   숨겨버리므로 여기서만 잡힌다.
 *
 * 실행: node scripts/check-brand-completeness.mjs   (pnpm lint 의 check-ssot 체인에 포함)
 * 사전조건: pnpm build --filter @nudge-design/tokens (dist 를 읽는다)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distBrands = path.join(root, "packages/tokens/dist/brands");
const baselinePath = path.join(root, "scripts/brand-completeness-baseline.json");

if (!fs.existsSync(path.join(distBrands, "nudge-eap.semantic.js"))) {
  console.error(
    "[check-brand-completeness] ✗ packages/tokens/dist 가 없습니다. " +
      "'pnpm build --filter @nudge-design/tokens' 후 다시 실행하세요.",
  );
  process.exit(1);
}

const { nudgeEapSemantic } = require(path.join(distBrands, "nudge-eap.semantic.js"));
const BRANDS = [
  { slug: "trost", semantic: require(path.join(distBrands, "trost.semantic.js")).trostSemantic },
  { slug: "geniet", semantic: require(path.join(distBrands, "geniet.semantic.js")).genietSemantic },
  {
    slug: "cashwalk-biz",
    semantic: require(path.join(distBrands, "cashwalk-biz.semantic.js")).cashwalkBizSemantic,
  },
  {
    slug: "runmile",
    semantic: require(path.join(distBrands, "runmile.semantic.js")).runmileSemantic,
  },
];
const THEMES = [
  { slug: "nudge-eap", theme: require(path.join(distBrands, "nudge-eap.js")).nudgeEapTheme },
  { slug: "trost", theme: require(path.join(distBrands, "trost.js")).trostTheme },
  { slug: "geniet", theme: require(path.join(distBrands, "geniet.js")).genietTheme },
  {
    slug: "cashwalk-biz",
    theme: require(path.join(distBrands, "cashwalk-biz.js")).cashwalkBizTheme,
  },
  { slug: "runmile", theme: require(path.join(distBrands, "runmile.js")).runmileTheme },
];

/* ── 1) base leaf → 브랜드 명시 여부 ───────────────────────────────── */

function flattenLeaves(obj, prefix = "", into = new Map()) {
  for (const [key, value] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") flattenLeaves(value, p, into);
    else into.set(p, value);
  }
  return into;
}

const baseLeaves = flattenLeaves(nudgeEapSemantic);

/** waiver baseline — { brand, key, reason } 목록 */
const baseline = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, "utf-8"))
  : { entries: [] };
const waivers = new Map(baseline.entries.map((e) => [`${e.brand}::${e.key}`, e]));

const missing = []; // waiver 없는 누락 → 차단
const usedWaivers = new Set();

for (const { slug, semantic } of BRANDS) {
  const brandLeaves = flattenLeaves(semantic);
  for (const key of baseLeaves.keys()) {
    if (brandLeaves.has(key)) continue;
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

const emittedSlots = new Map(); // varName → 선언 브랜드들
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
const NDS_VAR_RE = /--nds-[a-z0-9][a-z0-9-]*/g;
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
      }
    }
  }
}

const orphanSlots = [...emittedSlots.entries()].filter(([varName]) => !consumed.has(varName));

/* ── 리포트 ───────────────────────────────────────────────────────── */

let failed = false;

if (missing.length) {
  failed = true;
  console.error(
    `[check-brand-completeness] ✗ base 시멘틱 leaf ${baseLeaves.size}개 중 브랜드 미정의 ${missing.length}건 (waiver 없음):`,
  );
  for (const k of missing.sort()) console.error(`    - ${k}`);
  console.error(
    "  → 브랜드 *.semantic.ts 에 명시하거나, 의도된 base-fallback 이면\n" +
      "    scripts/brand-completeness-baseline.json 에 { brand, key, reason } 으로 등재하세요.",
  );
}

if (orphanSlots.length) {
  failed = true;
  console.error(
    `[check-brand-completeness] ✗ 소비처 없는 --nds-* 슬롯 ${orphanSlots.length}건 (슬롯명 오타 의심):`,
  );
  for (const [varName, slugs] of orphanSlots)
    console.error(`    - ${varName} (선언: ${slugs.join(", ")})`);
  console.error(
    "  → styles/react/html 어디서도 var(" +
      "--nds-…) 로 읽지 않습니다. 브랜드 theme components 슬롯명을 확인하세요.",
  );
}

if (staleWaivers.length) {
  console.log(
    `[check-brand-completeness] ⚠ stale waiver ${staleWaivers.length}건 — 이미 명시됐으니 baseline 에서 지우세요:`,
  );
  for (const k of staleWaivers.sort()) console.log(`    - ${k}`);
}

if (!failed) {
  console.log(
    `[check-brand-completeness] ✓ base leaf ${baseLeaves.size}개 × ${BRANDS.length}브랜드 — ` +
      `명시 or waiver ${usedWaivers.size}건, 누락 0. --nds-* 슬롯 ${emittedSlots.size}개 모두 소비처 확인.`,
  );
}
process.exit(failed ? 1 : 0);
