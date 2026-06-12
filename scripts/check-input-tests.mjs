#!/usr/bin/env node
/**
 * 입력 컴포넌트 포커스-보존 테스트 게이트.
 *
 * 배경: nds-* 의 update() 가 input 을 재생성하면 키 입력마다 포커스/커서가 유실된다 —
 * AddressPicker("한 글자마다 끊김") · DatePicker 에서 반복된 회귀 클래스. mirror-parity
 * 린트는 set/enum 만 보고 이 "동작" drift 는 못 보므로, 입력 표면을 가진 컴포넌트는
 * 포커스 보존 테스트(packages/html/test/helpers/focus-preservation.ts)를 강제한다.
 *
 * 판정:
 *   입력 표면 = 소스에 input/textarea 생성 또는 nds-search-input 합성이 있는 nds-*.
 *   커버됨   = 같은 이름의 test 파일이 있고 activeElement 또는 focus-preservation 참조.
 *
 * ALLOWLIST = 게이트 도입(2026-06) 시점의 기존 미커버분 — 신규 추가만 차단한다.
 * 테스트를 붙였으면 목록에서 지우고, 새 입력 컴포넌트는 목록에 넣지 말고 테스트를 쓰세요.
 *
 * 사용: node scripts/check-input-tests.mjs   (pnpm lint 의 check-ssot 체인에 포함)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const COMPONENTS_DIR = path.join(ROOT, "packages/html/src/components");
const TEST_DIR = path.join(ROOT, "packages/html/test");

// 게이트 도입 시점(2026-06) 미커버 잔존분 — 전량 해소 완료(2026-06). 비워진 상태 유지.
const ALLOWLIST = new Set([]);

const INPUT_SURFACE_RE =
  /createElement\(\s*["'`](input|textarea|nds-search-input)["'`]|<(input|textarea|nds-search-input)[\s>/]/;

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function isCovered(name) {
  const testFile = path.join(TEST_DIR, `${name}.test.ts`);
  if (!fs.existsSync(testFile)) return false;
  const source = fs.readFileSync(testFile, "utf8");
  return /activeElement|focus-preservation/.test(source);
}

const inputComponents = fs
  .readdirSync(COMPONENTS_DIR)
  .filter((f) => f.startsWith("nds-") && f.endsWith(".ts"))
  .map((f) => f.replace(/\.ts$/, ""))
  .filter((name) =>
    INPUT_SURFACE_RE.test(
      stripComments(fs.readFileSync(path.join(COMPONENTS_DIR, `${name}.ts`), "utf8")),
    ),
  );

const uncovered = inputComponents.filter((name) => !isCovered(name));
const newUncovered = uncovered.filter((name) => !ALLOWLIST.has(name));
const allowlistResolved = [...ALLOWLIST].filter((name) => !uncovered.includes(name));

console.log(
  `[check-input-tests] 입력 표면 컴포넌트 ${inputComponents.length} 건 · 포커스 테스트 커버 ${inputComponents.length - uncovered.length} 건 · allowlist 잔존 ${uncovered.length - newUncovered.length} 건`,
);

if (allowlistResolved.length > 0) {
  console.log(`\n✓ allowlist 에 있지만 이미 커버(또는 입력 표면 제거)된 항목 — 목록에서 지우세요:`);
  for (const name of allowlistResolved) console.log(`    - ${name}`);
}

if (newUncovered.length === 0) {
  console.log("✓ 신규 입력 컴포넌트의 포커스 보존 테스트 누락 없음.");
  process.exit(0);
}

console.error(
  `\n✗ 포커스 보존 테스트 없는 신규 입력 컴포넌트 ${newUncovered.length} 건 — ` +
    "packages/html/test/helpers/focus-preservation.ts 헬퍼로 양면(타이핑/외부 attr 갱신)을 잠그세요:",
);
for (const name of newUncovered) {
  console.error(`    - ${name} → packages/html/test/${name}.test.ts`);
}
process.exit(1);
