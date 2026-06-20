/**
 * P2 신규 파이프 (비파괴) — reference-carrying 토큰을 alias 그래프 보존하며 emit.
 * 기존 generate-css.cjs(값-동결 hex)는 그대로 두고, dist/next/ 에 나란히 출력한다.
 *
 *   dist/next/tokens.css        — semantic 이 `var(--color-…)` 로 primitive 를 *가리킴*
 *   dist/next/tokens.dtcg.json  — DTCG: semantic 이 `{color.…}` alias 참조
 *
 * 현재 범위 = base(nudge-eap) semantic + color primitive. 브랜드/컴포넌트/figma-variables 는 후속.
 * 값 동치 검증은 scripts/check-value-freeze.cjs.
 */
const fs = require("fs");
const path = require("path");

const { colors } = require("../dist/colors");
const { isRef } = require("../dist/ref.js");
const { nudgeEapSemantic } = require("../dist/projects/nudge-eap.semantic.js");

function camelToKebab(s) {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
/** ref("color.coolGray.50") → "var(--color-coolGray-50)" (flattenPaletteVars 명명과 정합) */
function refToCssVar(r) {
  const [, family, stop] = r.$ref.split(".");
  return `var(--color-${family}-${stop})`;
}
/** ref("color.coolGray.50") → "{color.coolGray.50}" (DTCG alias 표기) */
function refToDtcg(r) {
  return `{${r.$ref}}`;
}

// ─── CSS (dist/next/tokens.css) ─────────────────────────
const cssLines = [":root {", "  /* ── Color primitives (atomic) ── */"];
for (const [family, scale] of Object.entries(colors)) {
  for (const [stop, value] of Object.entries(scale)) {
    cssLines.push(`  --color-${family}-${stop}: ${value};`);
  }
}
cssLines.push("");
cssLines.push("  /* ── Semantic (alias → primitive via var()) ── */");
function walkCss(obj, prefix) {
  for (const [key, value] of Object.entries(obj)) {
    const part = camelToKebab(key);
    const name = prefix ? `${prefix}-${part}` : part;
    if (isRef(value)) {
      cssLines.push(`  --semantic-${name}: ${refToCssVar(value)};`);
    } else if (typeof value === "string") {
      cssLines.push(`  --semantic-${name}: ${value};`); // 리터럴 hex/rgba/var(--semantic-…)
    } else if (value && typeof value === "object") {
      walkCss(value, name);
    }
  }
}
walkCss(nudgeEapSemantic, "");
cssLines.push("}");

// ─── DTCG (dist/next/tokens.dtcg.json) ──────────────────
const dtcg = { color: {}, semantic: {} };
for (const [family, scale] of Object.entries(colors)) {
  dtcg.color[family] = {};
  for (const [stop, value] of Object.entries(scale)) {
    dtcg.color[family][stop] = { $value: value, $type: "color" };
  }
}
function walkDtcg(obj, node) {
  for (const [key, value] of Object.entries(obj)) {
    if (isRef(value)) {
      node[key] = { $value: refToDtcg(value), $type: "color" };
    } else if (typeof value === "string") {
      node[key] = { $value: value, $type: "color" };
    } else if (value && typeof value === "object") {
      node[key] = {};
      walkDtcg(value, node[key]);
    }
  }
}
walkDtcg(nudgeEapSemantic, dtcg.semantic);

// ─── Write ──────────────────────────────────────────────
const nextDir = path.join(__dirname, "..", "dist", "next");
fs.mkdirSync(nextDir, { recursive: true });
fs.writeFileSync(path.join(nextDir, "tokens.css"), cssLines.join("\n") + "\n");
fs.writeFileSync(path.join(nextDir, "tokens.dtcg.json"), JSON.stringify(dtcg, null, 2) + "\n");
console.log(`Generated ${path.join(nextDir, "tokens.css")}`);
console.log(`Generated ${path.join(nextDir, "tokens.dtcg.json")}`);
