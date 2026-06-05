#!/usr/bin/env node
/**
 * react ↔ html 3면 미러 parity 게이트.
 *
 * SSOT = packages/mcp/catalog.json (emit-manifest 가 빌드된 dist 에서 생성).
 * 컴포넌트마다 react props 와 html attribute 표현을 set-diff 해서, 한쪽에만 있는
 * variant/size/색/attr 같은 미러 drift 를 찾아낸다. AI 가 컴포넌트를 생성·수정할 때
 * react 만 고치고 html 을 빠뜨리는(또는 그 반대) 회귀가 최대 사각지대라 이 게이트로 막는다.
 *
 * "치수(dimension)" 는 일부러 대상이 아님 — styles 패키지가 react/html 공용 CSS 라
 * 둘의 치수 drift 는 구조적으로 불가능하다. 실제 치수 리스크는 styles↔Figma 이고
 * 그건 별개 게이트(figma sync / /ds-audit)가 본다.
 *
 * 비교 항목 3가지:
 *   1. 컴포넌트 set parity — react 만 있고 html 미러(nds-*)가 없거나 그 반대.
 *   2. enum 값 parity     — react prop allowedValues ↔ html enum attr(variant/size/color/…) 값 set-diff.
 *   3. attr 이름 parity   — react prop 이름(camel→kebab, 슬롯/이벤트 prop 제외) ↔ html observedAttributes.
 *
 * baseline (scripts/mirror-parity-baseline.json) 에 현재 알려진/허용된 divergence 를
 * 스냅샷해 두고, baseline 에 없는 "신규 drift" 만 위반으로 본다. normalization 특성상
 * 초기 노이즈가 있으므로 baseline 으로 현 상태를 흡수한 뒤 신규만 차단하는 구조다.
 *
 * 사용:
 *   node scripts/check-mirror-parity.mjs            # --check (CI 기본): 신규 drift 있으면 exit 1
 *   node scripts/check-mirror-parity.mjs --warn-only # 출력만, 항상 exit 0 (로컬/소프트런칭)
 *   node scripts/check-mirror-parity.mjs --update     # baseline 을 현 상태로 재생성
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "packages/mcp/catalog.json");
const BASELINE_PATH = path.join(ROOT, "scripts/mirror-parity-baseline.json");

const args = new Set(process.argv.slice(2));
const MODE = args.has("--update") ? "update" : args.has("--warn-only") ? "warn-only" : "check";

// React 전용 prop — html custom element 의 attribute 로 대응되지 않는다(슬롯/이벤트/렌더).
// 이름 set parity 비교에서 제외. (이벤트 핸들러 on* / 함수 타입은 별도 휴리스틱으로도 거른다.)
const REACT_ONLY_PROPS = new Set([
  "children",
  "classname",
  "class",
  "style",
  "ref",
  "key",
  "id",
  "aschild",
  "css",
  "sx",
  "as",
  "slot",
  "defaultvalue",
]);

// html 내부 인프라 attr — react prop 으로 대응될 필요 없음(base 클래스가 주입).
const HTML_INTERNAL_ATTRS = new Set(["base-id", "base-class", "id"]);

// 권고(advisory) 종류 — 항상 리포트하되 게이트를 차단하진 않는다.
// prop-name 은 react(node/controlled) ↔ html(attribute/string) 패러다임 차이로
// 구조적 noise 가 크다(label/title 을 node 슬롯 vs 문자열 attr 로 노출 등).
// 반면 enum-value / 컴포넌트 set 은 신호가 깨끗해 blocking 으로 둔다.
const ADVISORY_KINDS = new Set(["prop-name"]);

// react prop 이름 → html attribute 이름 정규화 (camelCase → kebab-case, 소문자).
function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

// 이 react prop 이 html attribute 후보인가? (슬롯/이벤트/함수/노드/스타일-bag 제외)
function isAttrCandidate(prop) {
  const lower = prop.name.toLowerCase();
  if (REACT_ONLY_PROPS.has(lower)) return false;
  if (/^on[A-Z]/.test(prop.name)) return false; // onClick, onValueChange … → 이벤트
  if (/(ClassName|Props|Style)$/.test(prop.name)) return false; // labelClassName, slotProps … → react 전용
  const type = prop.type ?? "";
  if (type.includes("=>")) return false; // 함수형 prop → 이벤트/렌더
  if (/ReactNode|ReactElement|JSX\.Element/.test(type)) return false; // 슬롯/콘텐츠
  return true;
}

function hasReactSide(c) {
  return typeof c.dtsRelPath === "string" && c.dtsRelPath.startsWith("packages/react/dist");
}
function hasHtmlSide(c) {
  return typeof c.htmlTag === "string" && c.htmlTag.length > 0;
}

// drift 한 건의 안정적 key — baseline 매칭용. `component::kind::detail`.
function driftKey(d) {
  return `${d.component}::${d.kind}::${d.detail}`;
}

function computeDrift(catalog) {
  const drift = [];
  for (const c of catalog.components) {
    const react = hasReactSide(c);
    const html = hasHtmlSide(c);

    // 1) 컴포넌트 set parity
    if (react && !html) {
      drift.push({
        component: c.name,
        kind: "react-only",
        detail: "react 컴포넌트에 html 미러(nds-*)가 없음",
      });
      continue; // html 이 없으면 attr/enum 비교 불가
    }
    if (html && !react) {
      drift.push({
        component: c.name,
        kind: "html-only",
        detail: `html 전용(${c.htmlTag}) — react 미러가 없음`,
      });
      continue;
    }
    if (!react || !html) continue;

    // 2) enum 값 parity (variant/size/color/tone/orientation)
    const htmlAttrs = c.htmlAttrs ?? {};
    const propByName = new Map((c.props ?? []).map((p) => [p.name.toLowerCase(), p]));
    for (const [attrName, htmlValues] of Object.entries(htmlAttrs)) {
      const prop = propByName.get(attrName.toLowerCase());
      if (!prop || !Array.isArray(prop.allowedValues)) continue;
      const reactSet = new Set(prop.allowedValues);
      const htmlSet = new Set(htmlValues);
      const reactOnly = [...reactSet].filter((v) => !htmlSet.has(v));
      const htmlOnly = [...htmlSet].filter((v) => !reactSet.has(v));
      for (const v of reactOnly) {
        drift.push({
          component: c.name,
          kind: "enum-value",
          detail: `${attrName}="${v}" 는 react 에만 있음 (html nds-* 에 없음)`,
        });
      }
      for (const v of htmlOnly) {
        drift.push({
          component: c.name,
          kind: "enum-value",
          detail: `${attrName}="${v}" 는 html 에만 있음 (react prop 에 없음)`,
        });
      }
    }

    // 3) attr 이름 set parity
    if (Array.isArray(c.htmlObservedAttrs)) {
      const htmlAttrSet = new Set(c.htmlObservedAttrs);
      const reactAttrNames = new Set(
        (c.props ?? []).filter(isAttrCandidate).map((p) => toKebab(p.name)),
      );
      for (const name of reactAttrNames) {
        if (!htmlAttrSet.has(name)) {
          drift.push({
            component: c.name,
            kind: "prop-name",
            detail: `react prop → "${name}" 가 html observedAttributes 에 없음`,
          });
        }
      }
      for (const attr of htmlAttrSet) {
        if (HTML_INTERNAL_ATTRS.has(attr)) continue;
        if (!reactAttrNames.has(attr)) {
          drift.push({
            component: c.name,
            kind: "prop-name",
            detail: `html attr "${attr}" 에 대응하는 react prop 이 없음`,
          });
        }
      }
    }
  }
  drift.sort((a, b) => driftKey(a).localeCompare(driftKey(b)));
  return drift;
}

function readBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  } catch {
    return null;
  }
}

function writeBaseline(drift) {
  const payload = {
    note:
      "react↔html 미러 parity 의 알려진/허용된 divergence 스냅샷. " +
      "신규 drift 만 게이트가 차단한다. 항목을 해소했으면 `pnpm lint:mirror-parity:update` 로 갱신.",
    keys: drift.map(driftKey),
  };
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function groupByKind(items) {
  const byKind = new Map();
  for (const d of items) {
    if (!byKind.has(d.kind)) byKind.set(d.kind, []);
    byKind.get(d.kind).push(d);
  }
  return byKind;
}

function printDrift(title, items) {
  console.log(`\n${title} (${items.length})`);
  const byKind = groupByKind(items);
  for (const [kind, list] of byKind) {
    console.log(`  [${kind}]`);
    for (const d of list) {
      console.log(`    · ${d.component}: ${d.detail}`);
    }
  }
}

// ── main ──────────────────────────────────────────────────────────────────────
if (!fs.existsSync(CATALOG_PATH)) {
  console.error(
    "[check-mirror-parity] packages/mcp/catalog.json 이 없습니다. " +
      "먼저 DS 빌드 후 `pnpm --filter @nudge-design/mcp build:manifest` 를 실행하세요.",
  );
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const drift = computeDrift(catalog);

if (MODE === "update") {
  writeBaseline(drift);
  console.log(
    `[check-mirror-parity] baseline 갱신: ${drift.length} 건 → ${path.relative(ROOT, BASELINE_PATH)}`,
  );
  process.exit(0);
}

const baseline = readBaseline();
if (!baseline) {
  console.error(
    "[check-mirror-parity] baseline 이 없습니다. `node scripts/check-mirror-parity.mjs --update` 로 생성하세요.",
  );
  process.exit(1);
}

const baselineKeys = new Set(baseline.keys ?? []);
const currentKeys = new Set(drift.map(driftKey));

const newDrift = drift.filter((d) => !baselineKeys.has(driftKey(d)));
const resolvedKeys = [...baselineKeys].filter((k) => !currentKeys.has(k));

const newBlocking = newDrift.filter((d) => !ADVISORY_KINDS.has(d.kind));
const newAdvisory = newDrift.filter((d) => ADVISORY_KINDS.has(d.kind));

console.log(
  `[check-mirror-parity] 전체 drift ${drift.length} 건 (baseline ${baselineKeys.size} 건 허용).`,
);

if (resolvedKeys.length > 0) {
  console.log(
    `\n✓ 해소된 baseline 항목 ${resolvedKeys.length} 건 — \`pnpm lint:mirror-parity:update\` 로 baseline 을 줄이세요:`,
  );
  for (const k of resolvedKeys) console.log(`    - ${k}`);
}

if (newAdvisory.length > 0) {
  printDrift("△ 신규 prop-name divergence (권고 — 게이트 차단 안 함)", newAdvisory);
}

if (newBlocking.length === 0) {
  console.log("\n✓ baseline 대비 신규 차단성 미러 drift 없음.");
  process.exit(0);
}

printDrift("✗ 신규 미러 drift (baseline 에 없음 · 차단)", newBlocking);
console.log(
  "\n수정: react/styles/html 3면을 맞추세요(보통 /ds-component 재실행). " +
    "의도된 divergence 면 `pnpm lint:mirror-parity:update` 로 baseline 에 추가하세요.",
);

if (MODE === "warn-only") {
  console.log("\n(warn-only 모드 — exit 0)");
  process.exit(0);
}
process.exit(1);
