#!/usr/bin/env node
/**
 * react ↔ html 색 토큰(styles 우회 색맵) parity 게이트.
 *
 * 배경: styles/src/<C>.ts 가 react/html 공용 CSS SSOT 지만, 일부 컴포넌트(Button·Badge·
 * Chip·FAB·Header·ValidationChip 등)는 variant→색 맵을 react .tsx 와 html nds-*.ts(또는
 * 동반 nds-*.styles.ts) 양쪽 JS 에 **손으로 복제**해 styles 를 우회한다. 기존 미러 게이트
 * (check-mirror-parity)는 prop/attr/enum/slot **집합**만 비교하고 색 값은 안 봐서, 두 면의
 * 색 토큰이 어긋나도 못 잡는다(실제로 Button 의 outlined-neutral/solid 색이 브랜드별로
 * react↔html 다르게 렌더되는 드리프트가 있었다).
 *
 * 이 게이트는 컴포넌트 쌍마다 react/html 소스에서 **시멘틱 색 토큰 집합**을 추출(cv.* 는
 * --semantic-* 로 해석)해 set-diff 한다. 한쪽에만 있는 색 토큰 = 드리프트.
 *   - 멀티셋(횟수)이 아니라 SET(존재)으로 비교 — 같은 토큰을 몇 번 쓰는지는 noise.
 *   - 양쪽 다 색 토큰 ≥ THRESHOLD 인 쌍만 검사(= 색맵을 든 컴포넌트. incidental 사용 제외).
 *   - baseline(style-token-parity-baseline.json)에 흡수된 divergence 는 통과, 신규만 차단.
 *
 * cv 해석은 packages/tokens/src/cssVar.ts **소스**를 파싱(빌드 불필요 → buildFree).
 *
 * 사용:
 *   node scripts/check-style-token-parity.mjs           # --check (CI 기본): 신규 drift 면 exit 1
 *   node scripts/check-style-token-parity.mjs --update   # baseline merge 갱신(기존 reason 보존)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REACT_DIR = path.join(ROOT, "packages/react/src");
const HTML_DIR = path.join(ROOT, "packages/html/src/components");
const CSSVAR_SRC = path.join(ROOT, "packages/tokens/src/cssVar.ts");
const BASELINE_PATH = path.join(ROOT, "scripts/style-token-parity-baseline.json");

const MODE = process.argv.includes("--update") ? "update" : "check";
// 양쪽 다 이 개수 이상의 색 토큰을 가진 쌍만 "색맵 보유"로 보고 검사한다.
const THRESHOLD = 3;
// 색 역할 prefix (gap/inset 같은 spacing 토큰은 제외 — 색 드리프트만 본다).
const COLOR_PREFIX = "(?:bg|text|icon|fill|border|button|confirm-cta|input)";
const RAW_RE = new RegExp(`--(semantic-${COLOR_PREFIX}-[a-z0-9-]+)`, "g");
const CV_RE = /\bcv\.(\w+)\.(\w+)/g;

/** cssVar.ts 소스를 파싱해 cv[group][key] = "semantic-…" 맵을 만든다(빌드 불필요). */
function parseCvMap(src) {
  const map = {};
  let group = null;
  for (const line of src.split("\n")) {
    const g = line.match(/^\s{2}(\w+):\s*\{/);
    if (g) {
      group = g[1];
      map[group] = {};
      continue;
    }
    if (line.match(/^\s{2}\},?\s*$/)) group = null;
    if (!group) continue;
    const kv = line.match(/^\s{4}(\w+):\s*v\("(--semantic-[a-z0-9-]+)"\)/);
    if (kv) map[group][kv[1]] = kv[2].slice(2); // strip leading "--"
  }
  return map;
}

function extractColorTokens(src, cvMap) {
  const set = new Set();
  let m;
  RAW_RE.lastIndex = 0;
  while ((m = RAW_RE.exec(src))) set.add(m[1]);
  CV_RE.lastIndex = 0;
  while ((m = CV_RE.exec(src))) {
    const tok = cvMap[m[1]]?.[m[2]];
    if (tok && new RegExp(`^semantic-${COLOR_PREFIX}-`).test(tok)) set.add(tok);
  }
  return set;
}

function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function computeDrift(cvMap) {
  const drift = [];
  for (const file of fs.readdirSync(REACT_DIR).filter((f) => f.endsWith(".tsx"))) {
    const name = file.replace(/\.tsx$/, "");
    const tag = `nds-${toKebab(name)}`;
    const htmlMain = path.join(HTML_DIR, `${tag}.ts`);
    if (!fs.existsSync(htmlMain)) continue; // react 단면 — 미러 parity 게이트가 따로 본다
    const reactSet = extractColorTokens(fs.readFileSync(path.join(REACT_DIR, file), "utf8"), cvMap);
    let htmlSrc = fs.readFileSync(htmlMain, "utf8");
    const companion = path.join(HTML_DIR, `${tag}.styles.ts`);
    if (fs.existsSync(companion)) htmlSrc += `\n${fs.readFileSync(companion, "utf8")}`;
    const htmlSet = extractColorTokens(htmlSrc, cvMap);
    if (reactSet.size < THRESHOLD || htmlSet.size < THRESHOLD) continue;
    for (const t of reactSet) if (!htmlSet.has(t)) drift.push({ component: name, token: t, side: "react-only" });
    for (const t of htmlSet) if (!reactSet.has(t)) drift.push({ component: name, token: t, side: "html-only" });
  }
  drift.sort((a, b) => driftKey(a).localeCompare(driftKey(b)));
  return drift;
}

function driftKey(d) {
  return `${d.component}::${d.token}::${d.side}`;
}

function readBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return { entries: [] };
  try {
    const raw = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
    return { ...raw, entries: Array.isArray(raw.entries) ? raw.entries : [] };
  } catch {
    return { entries: [] };
  }
}

function writeBaseline(drift, prevEntries) {
  const prevByKey = new Map(prevEntries.map((e) => [e.key, e]));
  const month = new Date().toISOString().slice(0, 7);
  let added = 0;
  const entries = drift.map((d) => {
    const key = driftKey(d);
    const prev = prevByKey.get(key);
    if (prev) return prev;
    added += 1;
    return { key, reason: "TODO", since: month };
  });
  const payload = {
    note:
      "react↔html 색 토큰(styles 우회 색맵) parity 의 알려진/허용된 divergence 스냅샷. " +
      "신규 drift 만 차단. reason 필수 — \"TODO\" 는 차단(사유 강제). " +
      "근본 해소는 색맵을 공유 styles/[data-variant] 로 이전하는 것. " +
      "갱신: node scripts/check-style-token-parity.mjs --update (merge — 기존 reason 보존).",
    entries,
  };
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return { total: entries.length, added };
}

// ── main ───────────────────────────────────────────────────────────────────
const cvMap = parseCvMap(fs.readFileSync(CSSVAR_SRC, "utf8"));
const drift = computeDrift(cvMap);

if (MODE === "update") {
  const prev = readBaseline();
  const stat = writeBaseline(drift, prev.entries);
  console.log(
    `[check-style-token-parity] baseline 갱신: 총 ${stat.total} 건 (신규 +${stat.added}) → ${path.relative(ROOT, BASELINE_PATH)}`,
  );
  if (stat.added > 0) {
    console.log(`  ⚠ 신규 ${stat.added} 건은 reason:"TODO" — 사유를 채워야 check 가 통과합니다.`);
  }
  process.exit(0);
}

const baseline = readBaseline();
const baselineByKey = new Map(baseline.entries.map((e) => [e.key, e]));
const newDrift = drift.filter((d) => !baselineByKey.has(driftKey(d)));
const todoEntries = baseline.entries.filter(
  (e) => typeof e.reason !== "string" || e.reason.trim() === "" || e.reason.trim() === "TODO",
);

console.log(
  `[check-style-token-parity] 색맵 보유 쌍 검사 — 전체 색토큰 drift ${drift.length} 건 (baseline ${baseline.entries.length} 허용).`,
);

if (todoEntries.length > 0) {
  console.error(
    `\n✗ baseline 에 reason 미작성(TODO) ${todoEntries.length} 건 — 의도면 사유를, 드리프트면 색맵을 맞추고 update 하세요:`,
  );
  for (const e of todoEntries) console.error(`    - ${e.key}`);
  process.exit(1);
}

if (newDrift.length === 0) {
  console.log("✓ baseline 대비 신규 색 토큰 drift 없음.");
  process.exit(0);
}

console.error(`\n✗ 신규 react↔html 색 토큰 drift ${newDrift.length} 건 (baseline 에 없음 · 차단):`);
for (const d of newDrift) {
  console.error(`    · ${d.component}: ${d.token} (${d.side})`);
}
console.error(
  "\n수정: 양쪽 색맵을 같은 시멘틱 토큰으로 맞추세요(react .tsx ↔ html nds-*.ts[/.styles.ts]). " +
    "근본 해소는 색맵을 공유 styles/[data-variant] 로 이전. " +
    "의도된 divergence 면 `node scripts/check-style-token-parity.mjs --update` 후 baseline 에 사유를 기입하세요.",
);
process.exit(1);
