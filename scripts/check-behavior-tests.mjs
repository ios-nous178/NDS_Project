#!/usr/bin/env node
/**
 * 상호작용 위젯 동작(behavior) 테스트 게이트.
 *
 * 배경: 23개 게이트는 전부 "A↔B drift(서로 베꼈나)" 만 본다. mirror-parity 는 react↔html
 * set/enum 만 보고, 양쪽 미러가 둘 다 틀려도 통과한다. 즉 "그게 올바로 동작하나" 는
 * 무방비 — react 컴포넌트 ~105개 중 상호작용 복잡 위젯(드롭다운·리스트박스·다이얼로그·
 * 슬라이더·캐러셀 등)이 회귀 가드 0 인 채로 방치됐다. 이 게이트는 그 위젯들에 실제
 * 사용자 동작 테스트(키보드/클릭/포커스/aria)를 강제한다.
 *
 * 왜 휴리스틱이 아니라 큐레이션인가:
 *   check-input-tests 의 "input 표면" 은 `<input>` 생성 여부로 기계적으로 판정되지만,
 *   "복잡 상호작용 위젯" 은 판단(키보드 내비·포커스 관리·상태기계 유무)이라 regex 가
 *   양쪽으로 틀린다 — 네이티브 range 인 Slider·role="tooltip" 인 Tooltip 은 못 잡고
 *   (false negative), 장식용 aria 를 단 presentational 은 잘못 잡는다(false positive).
 *   그래서 위젯 목록은 아래 INTERACTIVE_WIDGETS 가 SSOT(판단), 휴리스틱은 "등록 안 된
 *   신규 상호작용 컴포넌트" 를 경고로만 알려주는 보조 안전망으로 쓴다.
 *
 * 판정:
 *   대상   = INTERACTIVE_WIDGETS (아래 큐레이션 목록). 각 항목의 src 파일이 실존해야 한다
 *            (rename/제거 시 게이트가 큰 소리로 실패해 목록 갱신을 강제).
 *   커버됨 = packages/react/test/component/{Name}.test.tsx 가 있고 user-event 또는
 *            fireEvent 를 참조(렌더 스모크가 아닌 실제 동작 테스트).
 *
 * baseline(scripts/behavior-test-baseline.json) = 게이트 도입(2026-06) 시점의 기존
 *   미커버분. 사유와 함께 등재된 항목만 통과시키고 신규 미커버는 차단한다(ratchet).
 *   테스트를 붙였으면 baseline 에서 항목을 지운다 — 점진 소각.
 *
 * 사용: node scripts/check-behavior-tests.mjs   (pnpm lint 의 check-ssot 체인에 포함)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "packages/react/src");
const TEST_DIR = path.join(ROOT, "packages/react/test/component");
const BASELINE_FILE = path.join(ROOT, "scripts/behavior-test-baseline.json");

/**
 * 동작 테스트가 필수인 상호작용 위젯 (판단 기반 SSOT).
 * 편입 기준: 키보드 내비게이션 · 포커스 관리/트랩 · listbox/menu/dialog/slider 역할 ·
 * 비동기/큐 상태기계 중 하나 이상을 가진 복잡 위젯. 단순 폼 컨트롤(Checkbox/Input/Toggle)이나
 * presentational(Badge/Card/Text)은 제외 — 여기서 강제하는 건 "복잡 동작" 회귀 가드다.
 */
const INTERACTIVE_WIDGETS = [
  "Accordion",
  "Autocomplete",
  "BottomSheet",
  "Calendar",
  "Carousel",
  "CheckboxGroup",
  "CheckboxTree",
  "ConfirmTooltip",
  "DataTable",
  "DatePicker",
  "DateRangePicker",
  "Drawer",
  "DropdownMenu",
  "Modal",
  "MultiSelect",
  "Pagination",
  "PhoneInput",
  "Popup",
  "SearchInput",
  "Select",
  "Slider",
  "Snackbar",
  "Tab",
  "TagInput",
  "TimePicker",
  "Toast",
  "Tooltip",
];

/** 실제 동작을 검증하는 테스트의 표지 — user-event 또는 fireEvent 참조. */
const BEHAVIOR_RE = /user-event|userEvent|fireEvent/;

/**
 * 신규 상호작용 컴포넌트 탐지용 휴리스틱(보조 경고). **강신호만** 본다 —
 * 명백한 위젯 role(listbox/menu/menuitem/option/dialog/slider) 또는 aria-haspopup.
 * bare onKeyDown(클릭 가능 카드의 Enter/Space)·bare aria-expanded(disclosure)·
 * role="tablist"(클릭 구동 탭바)는 너무 흔해 오탐이라 제외 — "복잡 위젯" 만 추려야
 * 경고가 묻히지 않는다.
 */
const INTERACTION_SIGNAL_RE = /role="(listbox|menu|menuitem|option|dialog|slider)"|aria-haspopup/;

function readBaseline() {
  if (!fs.existsSync(BASELINE_FILE)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(BASELINE_FILE, "utf8"));
    if (!Array.isArray(parsed)) throw new Error("baseline 은 배열이어야 함");
    return parsed;
  } catch (err) {
    console.error(`✗ ${path.relative(ROOT, BASELINE_FILE)} 파싱 실패: ${err.message}`);
    process.exit(1);
  }
}

function hasSrc(name) {
  return fs.existsSync(path.join(SRC_DIR, `${name}.tsx`));
}

function isCovered(name) {
  const testFile = path.join(TEST_DIR, `${name}.test.tsx`);
  if (!fs.existsSync(testFile)) return false;
  return BEHAVIOR_RE.test(fs.readFileSync(testFile, "utf8"));
}

const baseline = readBaseline();
const baselineNames = new Set(baseline.map((b) => b.component));

// ── 1. 목록 무결성: 큐레이션 항목의 src 가 실존하나 (rename/제거 drift 차단) ──
const missingSrc = INTERACTIVE_WIDGETS.filter((name) => !hasSrc(name));

// ── 2. baseline 무결성: 사유 누락 / 큐레이션에 없는 유령 항목 ──
const baselineNoReason = baseline.filter((b) => !b.component || !b.reason);
const baselineGhost = baseline.filter((b) => !INTERACTIVE_WIDGETS.includes(b.component));

// ── 3. 커버리지 판정 ──
const covered = INTERACTIVE_WIDGETS.filter((name) => hasSrc(name) && isCovered(name));
const uncovered = INTERACTIVE_WIDGETS.filter((name) => hasSrc(name) && !isCovered(name));
const newUncovered = uncovered.filter((name) => !baselineNames.has(name));
const baselineResolved = [...baselineNames].filter(
  (name) => INTERACTIVE_WIDGETS.includes(name) && !uncovered.includes(name),
);

// ── 4. 보조 휴리스틱: 등록 안 된 신규 상호작용 컴포넌트 경고 ──
const registered = new Set(INTERACTIVE_WIDGETS);
const heuristicCandidates = fs
  .readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx") && !f.endsWith(".stories.tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .filter((name) => !registered.has(name))
  .filter((name) =>
    INTERACTION_SIGNAL_RE.test(fs.readFileSync(path.join(SRC_DIR, `${name}.tsx`), "utf8")),
  );

console.log(
  `[check-behavior-tests] 상호작용 위젯 ${INTERACTIVE_WIDGETS.length} 종 · 동작 테스트 커버 ${covered.length} · baseline 잔존 ${uncovered.length - newUncovered.length} · 신규 미커버 ${newUncovered.length}`,
);

let failed = false;

if (missingSrc.length > 0) {
  failed = true;
  console.error(
    `\n✗ INTERACTIVE_WIDGETS 에 있으나 src 가 없는 항목 ${missingSrc.length} 건 — rename/제거됐다면 scripts/check-behavior-tests.mjs 목록을 갱신하세요:`,
  );
  for (const name of missingSrc)
    console.error(`    - ${name} (packages/react/src/${name}.tsx 없음)`);
}

if (baselineNoReason.length > 0) {
  failed = true;
  console.error(`\n✗ behavior-test-baseline.json 에 component/reason 누락 항목:`);
  for (const b of baselineNoReason) console.error(`    - ${JSON.stringify(b)}`);
}

if (baselineGhost.length > 0) {
  console.log(`\n⚠ baseline 에 있지만 INTERACTIVE_WIDGETS 에 없는 유령 항목 — 목록에서 지우세요:`);
  for (const b of baselineGhost) console.log(`    - ${b.component}`);
}

if (baselineResolved.length > 0) {
  console.log(`\n✓ baseline 에 있지만 이미 커버된 항목 — baseline 에서 지우세요:`);
  for (const name of baselineResolved) console.log(`    - ${name}`);
}

if (heuristicCandidates.length > 0) {
  console.log(
    `\n⚠ 상호작용 신호가 강한데 게이트에 등록 안 된 컴포넌트 ${heuristicCandidates.length} 건 — 복잡 위젯이면 INTERACTIVE_WIDGETS 에 추가하세요(경고만):`,
  );
  for (const name of heuristicCandidates) console.log(`    - ${name}`);
}

if (newUncovered.length > 0) {
  failed = true;
  console.error(
    `\n✗ 동작 테스트 없는 신규 상호작용 위젯 ${newUncovered.length} 건 — ` +
      "packages/react/test/component/{Name}.test.tsx 에 user-event 로 키보드/클릭/포커스/aria 동작을 검증하거나, " +
      "정당한 사유면 scripts/behavior-test-baseline.json 에 등재하세요:",
  );
  for (const name of newUncovered) {
    console.error(`    - ${name} → packages/react/test/component/${name}.test.tsx`);
  }
}

if (failed) process.exit(1);

console.log("✓ 상호작용 위젯 동작 테스트 누락 없음(baseline 등재분 제외).");
process.exit(0);
