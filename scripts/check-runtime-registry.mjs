#!/usr/bin/env node
/**
 * 하드 게이트 — html 웹컴포넌트 런타임 등록 완전성 검사.
 *
 * packages/html/src/runtime.ts 는 "import 만으로 모든 nds-* custom element 가
 * 등록되는" side-effect 엔트리이고, 단일파일 HTML 목업이 로드하는 standalone 번들
 * (dist/standalone/nudge-ds.runtime.js)이 바로 이 파일에서 빌드된다.
 *
 * 컴포넌트 파일(packages/html/src/components/nds-*.ts)이 모듈 톱레벨에서 define() 을
 * 호출해도, runtime.ts 에 import 가 없으면 그 define() 이 실행되지 않아 customElements
 * 에 미등록 → <nds-*> 가 높이 0 의 빈 박스로 렌더된다. (nds-stepper / nds-pagination
 * 회귀: 가이드·index 배럴엔 있는데 runtime.ts 에서 빠져 목업 폼 스텝퍼가 안 보였음.)
 *
 * 이 게이트는 define() 을 호출하는 컴포넌트 파일과 runtime.ts 의 import 목록이
 * 정확히 일치하는지 검사한다. baseline 없음 — 등록 상태엔 정답이 하나뿐이라
 * drift 는 언제나 실제 버그다.
 *
 * 실행: node scripts/check-runtime-registry.mjs   (pnpm lint 에 포함)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = path.join(root, "packages/html/src/components");
const runtimeFile = path.join(root, "packages/html/src/runtime.ts");

/* 1) define() 을 호출하는 컴포넌트 파일 집합 (nds-*.ts, .test/.styles 제외) */
const defined = new Set();
for (const f of fs.readdirSync(componentsDir).sort()) {
  if (!f.startsWith("nds-") || !f.endsWith(".ts")) continue;
  if (f.endsWith(".test.ts") || f.endsWith(".styles.ts")) continue;
  const src = fs.readFileSync(path.join(componentsDir, f), "utf-8");
  // 톱레벨 define(NdsX) / customElements.define(...) 모두 등록으로 간주
  if (/\bdefine\s*\(/.test(src)) {
    defined.add(f.replace(/\.ts$/, ""));
  }
}

/* 2) runtime.ts 가 import 하는 컴포넌트 집합 */
const imported = new Set();
const runtimeSrc = fs.readFileSync(runtimeFile, "utf-8");
for (const m of runtimeSrc.matchAll(/import\s+"\.\/components\/(nds-[a-z0-9-]+)\.js"/g)) {
  imported.add(m[1]);
}

/* 3) 양방향 drift */
const missing = [...defined].filter((t) => !imported.has(t)).sort(); // define 했는데 미import
const extra = [...imported].filter((t) => !defined.has(t)).sort(); // import 했는데 define 없음(stale)

if (missing.length === 0 && extra.length === 0) {
  console.log(
    `[check-runtime-registry] ✓ define() 하는 ${defined.size}개 컴포넌트 모두 runtime.ts 에 등록됨.`,
  );
  process.exit(0);
}

if (missing.length) {
  console.error(
    `[check-runtime-registry] ✗ define() 했지만 runtime.ts 에 import 안 된 컴포넌트 ` +
      `(런타임 미등록 → 빈 박스): ${missing.join(", ")}\n` +
      missing
        .map((t) => `  → packages/html/src/runtime.ts 에 import "./components/${t}.js"; 추가`)
        .join("\n"),
  );
}
if (extra.length) {
  console.error(
    `[check-runtime-registry] ✗ runtime.ts 가 import 하지만 define() 하는 소스가 없는 항목(stale): ` +
      `${extra.join(", ")}\n  → 해당 import 를 제거하거나 컴포넌트 파일을 확인하세요.`,
  );
}
process.exit(1);
