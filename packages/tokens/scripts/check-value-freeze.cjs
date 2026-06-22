/**
 * 값-동결 게이트 (P2) — 신규 파이프(dist/next)의 semantic alias 체인이 기존 hex(dist/*.css)와
 * **정확히 같은 색**으로 해석되는지 base + 4 브랜드 전부 검증한다. "구조만 재편, 값 동결"(결정②)
 * 위반(우발적 색 변경)을 차단.
 *
 * 방법: dist/next/{file}.css 의 각 `--semantic-*: var(--color-…)` 를 color primitive 로 풀어
 *       dist/{file}.css 의 동일 토큰 hex 와 대조. 브랜드는 base 팔레트 + 자기 팔레트로 해석.
 *       리터럴(hex/rgba/var(--semantic-…))은 문자열 동치.
 */
const fs = require("fs");
const path = require("path");
const { colors } = require("../dist/colors");
const { nudgeEapTheme } = require("../dist/projects/nudge-eap");
const { trostTheme } = require("../dist/projects/trost");
const { genietTheme } = require("../dist/projects/geniet");
const { cashwalkBizTheme } = require("../dist/projects/cashwalk-biz");
const { cashwalkTheme } = require("../dist/projects/cashwalk");
const { teamworkTheme } = require("../dist/projects/teamwork");
const { dongneSanchaekTheme } = require("../dist/projects/dongne-sanchaek");
const { runmileTheme } = require("../dist/projects/runmile");

const dist = path.join(__dirname, "..", "dist");

/** family=key 인 팔레트들을 합쳐 `--color-{family}-{stop}` → hex 맵 (뒤가 앞을 덮음). */
function colorVarMap(...palettes) {
  const map = {};
  for (const palette of palettes) {
    for (const [family, scale] of Object.entries(palette)) {
      if (!scale || typeof scale !== "object") continue;
      for (const [stop, val] of Object.entries(scale)) {
        if (typeof val === "string") map[`--color-${family}-${stop}`] = val.toLowerCase();
      }
    }
  }
  return map;
}
function parseSemantic(file) {
  const map = {};
  if (!fs.existsSync(file)) return map;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*(--semantic-[a-z0-9-]+):\s*(.+);\s*$/i);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
}

const TARGETS = [
  // base(tokens.css) = cashwalk 색 → base ref 는 cashwalk 팔레트로 해석.
  { file: "tokens", cvar: colorVarMap(colors, cashwalkTheme.palette) },
  // NudgeEAP 는 이제 델타 css(nudge-eap.css) — base 팔레트(colors)로 해석.
  { file: "nudge-eap", cvar: colorVarMap(colors, nudgeEapTheme.palette) },
  { file: "trost", cvar: colorVarMap(colors, trostTheme.palette) },
  { file: "geniet", cvar: colorVarMap(colors, genietTheme.palette) },
  { file: "cashwalk-biz", cvar: colorVarMap(colors, cashwalkBizTheme.palette) },
  // cashwalk == base(tokens.css) — 별도 cashwalk.css emit 안 함(타깃 제거).
  { file: "teamwork", cvar: colorVarMap(colors, teamworkTheme.palette) },
  { file: "dongne-sanchaek", cvar: colorVarMap(colors, dongneSanchaekTheme.palette) },
  { file: "runmile", cvar: colorVarMap(colors, runmileTheme.palette) },
];

let totalFail = 0;
let totalChecked = 0;
for (const { file, cvar } of TARGETS) {
  const oldMap = parseSemantic(path.join(dist, `${file}.css`));
  const newMap = parseSemantic(path.join(dist, "next", `${file}.css`));
  let fail = 0;
  let checked = 0;
  for (const [token, rawNew] of Object.entries(newMap)) {
    const oldVal = oldMap[token];
    if (oldVal == null) continue;
    checked++;
    let resolved = rawNew;
    const varMatch = rawNew.match(/^var\((--color-[a-z0-9-]+)\)$/i);
    if (varMatch) resolved = cvar[varMatch[1]] ?? `?UNRESOLVED(${varMatch[1]})`;
    if (resolved.toLowerCase() !== oldVal.toLowerCase()) {
      console.error(`  [${file}] DRIFT ${token}: base=${oldVal}  next=${rawNew} → ${resolved}`);
      fail++;
    }
  }
  console.log(`  ${file}: ${checked - fail}/${checked} ok`);
  totalFail += fail;
  totalChecked += checked;
}

if (totalFail > 0) {
  console.error(`\n✗ value-freeze FAILED — ${totalFail}/${totalChecked} semantic tokens drifted`);
  process.exit(1);
}
console.log(
  `\n✓ value-freeze OK — ${totalChecked} semantic tokens (전 브랜드) resolve to identical hex`,
);
