#!/usr/bin/env node
/**
 * component-attrs 코드젠 — react Props 에서 html observedAttributes/enum 을 기계 파생.
 *
 * 입력:  packages/mcp/catalog.json (react dist 에서 추출된 props/allowedValues — SSOT)
 * 출력:  packages/html/src/generated/component-attrs.ts   (nds-* 컴포넌트가 import)
 *        packages/html/src/generated/component-attrs.json (emit-manifest 가 observedAttrs 역참조)
 *
 * 파생 규칙은 scripts/check-mirror-parity.mjs 의 isAttrCandidate/toKebab 와 동일 —
 * 마이그레이션된 컴포넌트는 react prop 추가/삭제가 자동으로 attr 에 반영되므로
 * attr-set drift 가 **구조적으로** 불가능해진다. html 전용 attr(disabled/value 등)은
 * 각 컴포넌트의 return 배열에 인라인 문자열로 남긴다.
 *
 * 실행: pnpm --filter @nudge-design/html generate:attrs
 * 게이트: --check (check-ssot 체인 — catalog 변경 후 재생성 누락 차단)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const catalogPath = path.join(repoRoot, "packages/mcp/catalog.json");
const outTsPath = path.join(repoRoot, "packages/html/src/generated/component-attrs.ts");
const outJsonPath = path.join(repoRoot, "packages/html/src/generated/component-attrs.json");

const CHECK = process.argv.includes("--check");

if (!fs.existsSync(catalogPath)) {
  console.error("[generate-component-attrs] ✗ packages/mcp/catalog.json 이 없습니다 — pnpm build 후 실행");
  process.exit(1);
}
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));

/* ── check-mirror-parity.mjs 와 동일한 파생 규칙 ── */
const REACT_ONLY_PROPS = new Set([
  "children", "classname", "class", "style", "ref", "key", "id",
  "aschild", "css", "sx", "as", "slot", "defaultvalue",
]);
function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
function isAttrCandidate(prop) {
  const lower = prop.name.toLowerCase();
  if (REACT_ONLY_PROPS.has(lower)) return false;
  if (/^on[A-Z]/.test(prop.name)) return false;
  if (/(ClassName|Props|Style)$/.test(prop.name)) return false;
  const type = prop.type ?? "";
  if (type.includes("=>")) return false;
  if (/ReactNode|ReactElement|JSX\.Element/.test(type)) return false;
  return true;
}

/* ── 파생 ── */
const entries = {};
for (const comp of catalog.components) {
  if (!comp.htmlTag) continue;
  if (!(comp.dtsRelPath ?? "").startsWith("packages/react/dist")) continue; // react 페어만
  const candidates = (comp.props ?? []).filter(isAttrCandidate);
  if (candidates.length === 0) continue;
  const observedAttributes = [...new Set(candidates.map((p) => toKebab(p.name)))].sort();
  const enums = {};
  for (const p of candidates) {
    if (Array.isArray(p.allowedValues) && p.allowedValues.length > 0) {
      enums[toKebab(p.name)] = p.allowedValues;
    }
  }
  entries[comp.htmlTag] = { observedAttributes, enums };
}

const sortedTags = Object.keys(entries).sort();
const json = {};
for (const tag of sortedTags) json[tag] = entries[tag];

const HEADER =
  "// AUTO-GENERATED — packages/html/scripts/generate-component-attrs.mjs 가 catalog.json 에서 생성.\n" +
  "// 직접 수정 금지. 재생성: pnpm --filter @nudge-design/html generate:attrs\n" +
  "// react Props 파생 attr/enum SSOT — html 전용 attr 은 각 컴포넌트 return 배열에 인라인.\n";

const tsBody =
  HEADER +
  "\nexport const COMPONENT_ATTRS = " +
  JSON.stringify(json, null, 2) +
  " as const;\n" +
  "\nexport type GeneratedComponentTag = keyof typeof COMPONENT_ATTRS;\n";

const jsonBody = JSON.stringify(json, null, 2) + "\n";

if (CHECK) {
  const curTs = fs.existsSync(outTsPath) ? fs.readFileSync(outTsPath, "utf-8") : "";
  const curJson = fs.existsSync(outJsonPath) ? fs.readFileSync(outJsonPath, "utf-8") : "";
  if (curTs !== tsBody || curJson !== jsonBody) {
    console.error(
      "[generate-component-attrs] ✗ stale — react props 가 바뀌었는데 component-attrs 미재생성.\n" +
        "  → pnpm --filter @nudge-design/html generate:attrs 후 함께 커밋하세요.",
    );
    process.exit(1);
  }
  console.log(`[generate-component-attrs] ✓ up to date (${sortedTags.length} components)`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(outTsPath), { recursive: true });
fs.writeFileSync(outTsPath, tsBody);
fs.writeFileSync(outJsonPath, jsonBody);
console.log(`[generate-component-attrs] ✓ ${sortedTags.length} components → src/generated/component-attrs.{ts,json}`);
