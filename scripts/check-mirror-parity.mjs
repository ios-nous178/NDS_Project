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
 * 비교 항목 4가지:
 *   1. 컴포넌트 set parity — react 만 있고 html 미러(nds-*)가 없거나 그 반대.
 *   2. enum 값 parity     — react prop allowedValues ↔ html enum attr(variant/size/color/…) 값 set-diff.
 *   3. attr 이름 parity   — react prop 이름(camel→kebab, 슬롯/이벤트 prop 제외) ↔ html observedAttributes.
 *   4. slot parity        — react ReactNode 슬롯 prop ↔ html light-DOM slot="..." 구현 set-diff.
 *
 * baseline (scripts/mirror-parity-baseline.json) 에 현재 알려진/허용된 divergence 를
 * 스냅샷해 두고, baseline 에 없는 "신규 drift" 만 위반으로 본다. normalization 특성상
 * 초기 노이즈가 있으므로 baseline 으로 현 상태를 흡수한 뒤 신규만 차단하는 구조다.
 *
 * baseline 엔트리는 { key, reason, since } — reason 으로 "의도된 divergence" 와
 * "그냥 누락" 을 분리한다:
 *   - reason: "TODO"            → --update 가 신규 drift 에 자동으로 박는 placeholder.
 *                                  check 모드가 차단하므로 사람이 사유를 써야 게이트가 열린다.
 *   - reason: "TRIAGE-PENDING …" → 일괄 흡수분 중 의도/누락 미분류 — 통과시키되 매번 카운트 노출.
 *   - 그 외 자유 서술           → 의도된 divergence 의 사유 박제.
 *
 * 사용:
 *   node scripts/check-mirror-parity.mjs            # --check (CI 기본): 신규 drift 있으면 exit 1
 *   node scripts/check-mirror-parity.mjs --warn-only # 출력만, 항상 exit 0 (로컬/소프트런칭)
 *   node scripts/check-mirror-parity.mjs --update     # baseline merge 갱신 (기존 reason 보존,
 *                                                     #  해소분 제거, 신규는 reason:"TODO" 로 추가)
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "packages/mcp/catalog.json");
const BASELINE_PATH = path.join(ROOT, "scripts/mirror-parity-baseline.json");
const REACT_SRC_DIR = path.join(ROOT, "packages/react/src");
const HTML_COMPONENTS_DIR = path.join(ROOT, "packages/html/src/components");

const args = new Set(process.argv.slice(2));
const MODE = args.has("--update") ? "update" : args.has("--warn-only") ? "warn-only" : "check";
// catalog.json 은 react=dist / html=src 를 섞어 읽는 생성물이라, 컴포넌트를 새로 추가하고
// `build:manifest` 를 안 돌리면 stale 해져 "react/html 한쪽만 있음" 오탐을 낸다(과거 회귀).
// 기본적으로 검사 직전에 dist 에서 catalog 를 재생성해 stale 자체를 차단한다.
// (CI 처럼 빌드 직후 emit 이 끝난 경우엔 `--no-regen` 으로 생략 가능.)
const SKIP_REGEN = args.has("--no-regen");

/**
 * 검사 직전 catalog 를 빌드된 dist 에서 재생성한다(react dist .d.ts + html src 를 읽음).
 * generatedAt 타임스탬프만 바뀌는 churn 을 막기 위해 기존 값을 보존한다(check-mcp-catalog 와 동일 패턴).
 * 빌드가 안 돼 있거나(react dist 없음) emit 실패 시엔 던지지 않고 경고만 — 기존 catalog 로 폴백한다.
 */
function regenerateCatalog() {
  const prevAt =
    fs.existsSync(CATALOG_PATH) &&
    (() => {
      try {
        return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")).generatedAt;
      } catch {
        return undefined;
      }
    })();
  try {
    execFileSync("pnpm", ["--filter", "@nudge-design/mcp", "build:manifest"], {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "inherit"],
    });
  } catch {
    console.warn(
      "[check-mirror-parity] catalog 재생성 실패 — 기존 catalog.json 으로 진행합니다. " +
        "DS 패키지를 빌드(`pnpm build`)한 뒤 다시 실행하면 정확합니다.",
    );
    return;
  }
  // 타임스탬프만 다른 무의미한 변경은 되돌려 워킹트리 noise 를 막는다.
  if (prevAt && fs.existsSync(CATALOG_PATH)) {
    try {
      const next = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
      next.generatedAt = prevAt;
      fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    } catch {
      /* noop — 재생성 자체는 성공했으니 그대로 둔다 */
    }
  }
}

// 대소문자 구분 파일 존재 — macOS 의 case-insensitive FS 에서 DSHighlight↔DsHighlight 같은
// casing 분기가 false 매칭되는 걸 막는다(readdir 로 정확한 파일명 비교).
function fileExistsExact(dir, fileName) {
  try {
    return fs.readdirSync(dir).includes(fileName);
  } catch {
    return false;
  }
}

/** react 쪽 소스가 실제로 존재하나? (catalog 가 html-only 라고 했는데 react src 가 있으면 = stale/미빌드) */
function reactSourceExists(name) {
  return (
    fileExistsExact(REACT_SRC_DIR, `${name}.tsx`) || fileExistsExact(REACT_SRC_DIR, `${name}.ts`)
  );
}

/** html 쪽 소스가 실제로 존재하나? (catalog 가 react-only 라고 했는데 nds-* 소스가 있으면 = stale) */
function htmlSourceExists(htmlTag) {
  if (typeof htmlTag === "string" && htmlTag) {
    return fileExistsExact(HTML_COMPONENTS_DIR, `${htmlTag}.ts`);
  }
  return false;
}

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

// ReactNode 중 "텍스트 콘텐츠"가 아니라 HTML light-DOM slot 미러가 자연스러운 prop 이름만 1차 게이트.
// title/label/description/children 같은 본문성 prop 은 html attr/children 으로 표현하는 경우가 많아 제외한다.
const SLOT_PROP_EXACT = new Set([
  "action",
  "actions",
  "activeIcon",
  "avatar",
  "bottom",
  "breadcrumb",
  "endIcon",
  "extra",
  "footer",
  "header",
  "icon",
  "leading",
  "leadingIcon",
  "leftIcon",
  "leftSlot",
  "logo",
  "media",
  "metadata",
  "more",
  "prefix",
  "rightIcon",
  "rightSlot",
  "separator",
  "startIcon",
  "suffix",
  "thumbnail",
  "trailing",
  "trailingIcon",
]);
const SLOT_PROP_SUFFIX_RE =
  /(Action|Actions|Avatar|Badge|Bottom|Breadcrumb|Footer|Header|Icon|Logo|Media|Meta|Prefix|Suffix|Slot|Thumbnail|Trailing)$/;

// 권고(advisory) 종류 — 항상 리포트하되 게이트를 차단하진 않는다. 현재는 비어 있다(전 종류 차단).
// 과거엔 prop-name 을 무조건 advisory(비차단)로 뒀는데, 그러면 "react 에 prop 추가하고 html 미러를
// 빠뜨려도 CI green" 인 사각이 생기고 그 안에 BottomSheet mask/close-on-esc 같은 진짜 기능 갭이
// 은폐됐다. prop-name 도 차단으로 돌리되, react(node/controlled)↔html(attribute/string) 패러다임
// noise 는 baseline 흡수 + reason 으로 다룬다(신규 prop-name drift 도 baseline 에 사유를 박아야 통과).
const ADVISORY_KINDS = new Set();

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

function isSlotPropCandidate(prop) {
  const type = prop.type ?? "";
  if (!/ReactNode|ReactElement|JSX\.Element/.test(type)) return false;
  if (prop.name === "children") return false;
  if (SLOT_PROP_EXACT.has(prop.name)) return true;
  return SLOT_PROP_SUFFIX_RE.test(prop.name);
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

function htmlSourcePath(htmlTag) {
  if (typeof htmlTag !== "string" || !htmlTag) return null;
  const file = path.join(HTML_COMPONENTS_DIR, `${htmlTag}.ts`);
  return fs.existsSync(file) ? file : null;
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function collectHtmlSlots(htmlTag) {
  const file = htmlSourcePath(htmlTag);
  if (!file) return new Set();
  const source = stripComments(fs.readFileSync(file, "utf8"));
  const slots = new Set();
  const patterns = [
    /<[^>]*\sslot\s*=\s*["'`]([a-zA-Z0-9_-]+)["'`]/g,
    /\[\s*slot\s*=\s*["'`]([a-zA-Z0-9_-]+)["'`]\s*\]/g,
    // 코드 레벨 light-DOM slot 소비 — `getAttribute("slot") === "x"` 직접 비교 또는
    // `const slot = …; if (slot === "x")` 변수 비교 (nds-bottom-sheet/nds-comment-item 패턴).
    /(?:getAttribute\(\s*["'`]slot["'`]\s*\)|\bslot)\s*===?\s*["'`]([a-zA-Z0-9_-]+)["'`]/g,
  ];
  for (const re of patterns) {
    let match;
    while ((match = re.exec(source))) slots.add(match[1].replace(/_/g, "-").toLowerCase());
  }
  return slots;
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
      // 정방향(react→html): attr 후보(슬롯/이벤트/노드 prop 제외)만 html attr 을 요구한다.
      const reactAttrNames = new Set(
        (c.props ?? []).filter(isAttrCandidate).map((p) => toKebab(p.name)),
      );
      // 역방향(html→react): 이름만 본다. html 의 string attr 은 react 에선 ReactNode(예: emptyMessage)
      // 로 받는 게 정상적인 paradigm 차이이므로, isAttrCandidate 로 거른 후보가 아니라 "이름이 같은
      // react prop 이 있는가"로 매칭한다. (안 그러면 ReactNode prop 이 있는데도 오탐이 난다.)
      const reactAllPropNames = new Set((c.props ?? []).map((p) => toKebab(p.name)));
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
        if (!reactAllPropNames.has(attr)) {
          drift.push({
            component: c.name,
            kind: "prop-name",
            detail: `html attr "${attr}" 에 대응하는 react prop 이 없음`,
          });
        }
      }
    }

    // 4) slot parity (ReactNode prop ↔ html light-DOM slot)
    const reactSlots = new Set(
      (c.props ?? []).filter(isSlotPropCandidate).map((p) => toKebab(p.name)),
    );
    if (reactSlots.size > 0) {
      const htmlSlots = collectHtmlSlots(c.htmlTag);
      for (const slot of reactSlots) {
        if (!htmlSlots.has(slot)) {
          drift.push({
            component: c.name,
            kind: "slot",
            detail: `react ReactNode prop "${slot}" 에 대응하는 html slot="${slot}" 구현이 없음`,
          });
        }
      }
      for (const slot of htmlSlots) {
        if (!reactSlots.has(slot)) {
          drift.push({
            component: c.name,
            kind: "slot",
            detail: `html slot="${slot}" 에 대응하는 react ReactNode prop 이 없음`,
          });
        }
      }
    }
  }
  drift.sort((a, b) => driftKey(a).localeCompare(driftKey(b)));
  return drift;
}

/** baseline 정규화 — 신 포맷(entries)과 구 포맷(keys 평탄 배열) 모두 entries 로 읽는다. */
function readBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
    if (Array.isArray(raw.entries)) return { ...raw, entries: raw.entries };
    if (Array.isArray(raw.keys)) {
      // 구 포맷 폴백 — reason 없이 흡수돼 있던 항목들.
      return { ...raw, entries: raw.keys.map((key) => ({ key, reason: "legacy(미기재)" })) };
    }
    return { ...raw, entries: [] };
  } catch {
    return null;
  }
}

/**
 * baseline 갱신은 전체 덮어쓰기가 아니라 merge —
 *   현재도 drift 인 기존 엔트리: reason/since 보존
 *   해소된 엔트리: 제거
 *   신규 drift: reason "TODO" 로 추가 → check 모드가 차단하므로 사유를 써야 게이트가 열린다.
 */
function writeBaseline(drift, prevEntries = []) {
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
      "react↔html 미러 parity 의 알려진/허용된 divergence 스냅샷. " +
      "신규 drift 만 게이트가 차단한다. 엔트리마다 reason 필수 — " +
      '"TODO" 는 check 가 차단, "TRIAGE-PENDING…" 은 통과하되 카운트 노출. ' +
      "항목을 해소했으면 `pnpm lint:mirror-parity:update` 로 갱신(merge — 기존 reason 보존).",
    entries,
  };
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return { total: entries.length, added, removed: prevEntries.length - (entries.length - added) };
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
// 검사 직전 catalog 를 dist 에서 재생성 → stale catalog 로 인한 오탐(react/html 한쪽만 있음) 차단.
if (!SKIP_REGEN) regenerateCatalog();

if (!fs.existsSync(CATALOG_PATH)) {
  console.error(
    "[check-mirror-parity] packages/mcp/catalog.json 이 없습니다. " +
      "먼저 DS 빌드 후 `pnpm --filter @nudge-design/mcp build:manifest` 를 실행하세요.",
  );
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const drift = computeDrift(catalog);
const componentByName = new Map((catalog.components ?? []).map((c) => [c.name, c]));

if (MODE === "update") {
  const prev = readBaseline();
  const stat = writeBaseline(drift, prev?.entries ?? []);
  console.log(
    `[check-mirror-parity] baseline merge 갱신: 총 ${stat.total} 건 (신규 +${stat.added} · 해소 -${stat.removed}) → ${path.relative(ROOT, BASELINE_PATH)}`,
  );
  if (stat.added > 0) {
    console.log(
      `  ⚠ 신규 ${stat.added} 건은 reason: "TODO" 로 추가됨 — 사유를 채워야 check 게이트가 통과합니다.`,
    );
  }
  process.exit(0);
}

const baseline = readBaseline();
if (!baseline) {
  console.error(
    "[check-mirror-parity] baseline 이 없습니다. `node scripts/check-mirror-parity.mjs --update` 로 생성하세요.",
  );
  process.exit(1);
}

const baselineEntries = baseline.entries ?? [];
const baselineKeys = new Set(baselineEntries.map((e) => e.key));
const currentKeys = new Set(drift.map(driftKey));

const newDrift = drift.filter((d) => !baselineKeys.has(driftKey(d)));
const resolvedKeys = [...baselineKeys].filter((k) => !currentKeys.has(k));

// stale/미빌드 가드 — 신규 "한쪽만 있음" drift 중 빠진 쪽 소스가 실제로 디스크에 있으면
// 진짜 미러 누락이 아니라 catalog 가 어긋난(보통 react dist 미빌드) 것이다. baseline 에 이미
// 흡수된 casing 분기(DsHighlight 등)는 제외되므로 신규 drift 에만 적용한다.
const staleSignals = newDrift.filter((d) => {
  if (d.kind === "html-only") return reactSourceExists(d.component);
  if (d.kind === "react-only") return htmlSourceExists(componentByName.get(d.component)?.htmlTag);
  return false;
});
if (staleSignals.length > 0) {
  console.error(
    "\n[check-mirror-parity] catalog.json 이 빌드된 dist 와 어긋났습니다(stale). " +
      "아래 컴포넌트는 react/html 양쪽 소스가 다 있는데 catalog 엔 한쪽만 잡혀 있습니다 — " +
      "보통 react dist 가 안 빌드돼 emit 이 react 쪽을 못 본 경우입니다:",
  );
  for (const d of staleSignals) console.error(`    · ${d.component} (${d.kind})`);
  console.error(
    "\n수정: `pnpm build` 로 DS 패키지(특히 @nudge-design/react)를 빌드한 뒤 다시 실행하세요. " +
      "(catalog 자동 재생성은 react dist 의 .d.ts 가 있어야 react 쪽을 인식합니다.)",
  );
  process.exit(1);
}

const newBlocking = newDrift.filter((d) => !ADVISORY_KINDS.has(d.kind));
const newAdvisory = newDrift.filter((d) => ADVISORY_KINDS.has(d.kind));

// reason 게이트 — "TODO" placeholder 가 남아 있으면 차단(사유 강제),
// "TRIAGE-PENDING" 은 통과시키되 분류 부채로 매번 노출한다.
const todoEntries = baselineEntries.filter(
  (e) => typeof e.reason !== "string" || e.reason.trim() === "" || e.reason.trim() === "TODO",
);
const triagePending = baselineEntries.filter((e) =>
  String(e.reason ?? "").startsWith("TRIAGE-PENDING"),
);

console.log(
  `[check-mirror-parity] 전체 drift ${drift.length} 건 (baseline ${baselineKeys.size} 건 허용).`,
);
if (triagePending.length > 0) {
  console.log(
    `  △ TRIAGE-PENDING ${triagePending.length} 건 — 의도/누락 미분류 분 (/ds-audit 로 분류해 reason 을 채우세요).`,
  );
}

if (todoEntries.length > 0 && MODE !== "warn-only") {
  console.error(
    `\n✗ baseline 에 reason 미작성(TODO) 엔트리 ${todoEntries.length} 건 — 의도된 divergence 면 사유를, 누락이면 미러를 고치고 update 하세요:`,
  );
  for (const e of todoEntries) console.error(`    - ${e.key}`);
  process.exit(1);
}

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
