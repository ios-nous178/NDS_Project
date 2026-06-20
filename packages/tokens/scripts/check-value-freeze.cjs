/**
 * 값-동결 게이트 (P2) — 신규 파이프(dist/next)의 semantic alias 체인이 기존 hex(dist/tokens.css)와
 * **정확히 같은 색**으로 해석되는지 검증한다. "구조만 재편, 값 동결"(결정②) 위반(우발적 색 변경)을 차단.
 *
 * 방법: dist/next/tokens.css 의 각 `--semantic-*: var(--color-…)` 를 color primitive 로 풀어
 *       dist/tokens.css 의 동일 토큰 hex 와 대조. 리터럴(hex/rgba/var(--semantic-…))은 문자열 동치.
 */
const fs = require("fs");
const path = require("path");
const { colors } = require("../dist/colors");

const colorVar = {};
for (const [family, scale] of Object.entries(colors)) {
  for (const [stop, value] of Object.entries(scale)) {
    colorVar[`--color-${family}-${stop}`] = String(value).toLowerCase();
  }
}

function parseSemantic(file) {
  const map = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*(--semantic-[a-z0-9-]+):\s*(.+);\s*$/i);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
}

const oldMap = parseSemantic(path.join(__dirname, "..", "dist", "tokens.css"));
const newMap = parseSemantic(path.join(__dirname, "..", "dist", "next", "tokens.css"));

let fail = 0;
let checked = 0;
for (const [token, rawNew] of Object.entries(newMap)) {
  const oldVal = oldMap[token];
  if (oldVal == null) continue; // dist/next 가 base 전용이라 gap/inset 등 spacing 계열은 old 에만 — skip
  checked++;
  let resolved = rawNew;
  const varMatch = rawNew.match(/^var\((--color-[a-z0-9-]+)\)$/i);
  if (varMatch) resolved = colorVar[varMatch[1]] ?? `?UNRESOLVED(${varMatch[1]})`;
  if (resolved.toLowerCase() !== oldVal.toLowerCase()) {
    console.error(`  DRIFT ${token}: base=${oldVal}  next=${rawNew} → ${resolved}`);
    fail++;
  }
}

if (fail > 0) {
  console.error(`\n✗ value-freeze FAILED — ${fail}/${checked} semantic tokens drifted`);
  process.exit(1);
}
console.log(`✓ value-freeze OK — ${checked} semantic tokens resolve to identical base hex`);
