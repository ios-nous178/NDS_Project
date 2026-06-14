#!/usr/bin/env node
/**
 * TDS coverage 포인터 무결성 게이트.
 *
 * metadata/tdsComponents.json 은 "브랜드 4개가 결국 갖춰야 할 목표 컴포넌트" 인벤토리이고,
 * 각 항목의 `nds` 는 그 목표를 커버하는 실제 DS 컴포넌트 이름이다. 이 파일은 **손으로 관리**되며
 * 컴포넌트 리네임/제거가 일어나도 자동으로 따라오지 않는다(자동 파생되는 건 coverage-manifest.json
 * = 코드 존재 여부뿐). 그래서 리네임이 한 번 일어나면 `nds` 가 죽은 이름을 가리켜도 아무도 못 잡고,
 * Brand × Component Coverage 보드는 멀쩡히 존재하는 컴포넌트를 "missing(빨강)" 으로 거짓 표시한다.
 *
 * 이 게이트는 그 drift 를 차단한다: 비어있지 않은 모든 `nds` 가 실제 react/html/brandChrome export
 * 로 resolve 되는지 검사. 단 하나라도 어디에도 없으면(= 보드 전 셀이 missing) 실패시킨다.
 *
 *   - 해소: 미구현 목표는 `"nds": ""` (빈 문자열 = 매핑 안 됨, 보드에 '갭'으로 표시) 으로 두고,
 *           구현된 목표는 정확한 컴포넌트 이름을 적는다. 리네임 시 여기 `nds` 도 같이 고친다.
 *   - 단면(react-only/html-only, 예: Asset·DSHighlight)은 한쪽에라도 존재하면 통과 — 보드가
 *     그 단면을 올바르게 표시하므로 drift 가 아니다.
 *
 * 판정 로직(brandChrome 특례 포함)은 coverage-logic.mjs 를 그대로 재사용해 보드와 일치시킨다.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildManifest } from "./coverage-manifest.mjs";
import { BRANDS } from "./coverage-logic.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TDS_PATH = path.join(ROOT, "metadata", "tdsComponents.json");

const manifest = await buildManifest();
const tds = JSON.parse(readFileSync(TDS_PATH, "utf8"));

const chromeNames = new Set();
for (const b of BRANDS) for (const n of manifest.brandChrome[b] ?? []) chromeNames.add(n);

/** 보드의 reactStatus/htmlStatus 와 동일한 "어딘가에 코드가 존재하는가" 판정. */
function resolves(c) {
  const nds = c.nds;
  // brandChrome 목표는 packages/react/src/{brand}/{nds}.tsx 존재로 판정.
  const reactCovered = c.brandChrome ? chromeNames.has(nds) : manifest.reactExports.has(nds);
  const htmlCovered = manifest.htmlExports.has(nds);
  return reactCovered || htmlCovered;
}

const dead = [];
for (const c of tds.components) {
  if (!c.nds) continue; // 빈 nds = 의도된 미매핑(갭) — 검사 대상 아님
  if (!resolves(c)) dead.push(c);
}

if (dead.length > 0) {
  console.error(
    `[check-tds-coverage-pointers] metadata/tdsComponents.json 의 nds 포인터 ${dead.length}개가 죽었습니다 ` +
      `(react/html/brandChrome 어디에도 없음 → 커버리지 보드가 거짓 missing 표시):`,
  );
  for (const c of dead) {
    console.error(`  ✗ ${c.tds} → nds:"${c.nds}"${c.brandChrome ? " (brandChrome)" : ""}`);
  }
  console.error(
    "\n  고치는 법: 리네임이면 `nds` 를 현재 export 이름으로 수정, " +
      '미구현 목표면 `"nds": ""` 로 비워 갭으로 표시하세요.',
  );
  process.exit(1);
}

console.log(
  `[check-tds-coverage-pointers] ok — ${tds.components.filter((c) => c.nds).length}개 매핑 nds 포인터 전부 resolve`,
);
