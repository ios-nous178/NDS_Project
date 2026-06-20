/**
 * P4 코드→Figma — dist/next/figma-variables.json 을 Figma REST Variables API payload 로 변환.
 *
 *   primitives.{core,trost,geniet,cashwalk-biz,runmile}  → 컬렉션 "Primitive/Core" + "Primitive/{Brand}"
 *                                                          (변수 이름 brand-free: "coolGray/50" 등)
 *   semantic (113 vars × 5 modes)                         → 컬렉션 "Semantic" (mode = brand)
 *       ref → VARIABLE_ALIAS (대상 컬렉션 = 멤버십으로 해석: 브랜드 mode 면 그 브랜드 Primitive,
 *             없으면 Core), 리터럴 hex/rgba → COLOR 값, var(--semantic-…) → 같은 Semantic 내 alias.
 *
 * 기본 = dry-run: REST payload(CREATE) 를 dist/next/figma-variables.rest.json 에 쓰고 요약 출력.
 * live = `--apply` + 환경변수 FIGMA_TOKEN(variables:write, Enterprise) + FIGMA_FILE_KEY.
 *        POST https://api.figma.com/v1/files/{key}/variables
 *
 * ⚠ 현재는 CREATE-fresh(새 컬렉션 생성). 손작업 컬렉션으로의 이름기준 멱등 upsert(GET→diff→UPDATE)
 *   는 후속 — 단 코드 팔레트 이름(coolGray/blue/mint…)과 손작업 컬렉션 이름(lemon/azure… 리네임안)
 *   이 갈리므로 "이름 정렬" 결정이 선행되어야 함(메모리 target-token-spec §11 / figma-color-guide).
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "dist", "next", "figma-variables.json");
const OUT = path.join(__dirname, "..", "dist", "next", "figma-variables.rest.json");
const fig = JSON.parse(fs.readFileSync(SRC, "utf8"));

// ─── color 파싱 (Figma 는 r/g/b/a 0..1) ─────────────────
function toFigmaColor(str) {
  const s = str.trim();
  let m = s.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (m) {
    const h = m[1];
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: m[2] ? parseInt(m[2], 16) / 255 : 1,
    };
  }
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(",").map((x) => parseFloat(x.trim()));
    return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a: p[3] == null ? 1 : p[3] };
  }
  throw new Error(`색 파싱 불가: ${str}`);
}

// ─── 컬렉션 / mode tempId ───────────────────────────────
const BRANDS = fig.semantic.modes; // ["nudge-eap","trost","geniet","cashwalk-biz","runmile"]
const primCollKey = (mode) => (mode === "nudge-eap" ? "core" : mode); // figma-variables.primitives key
const collId = (key) => `tmpColl/primitive/${key}`;
const SEM_COLL = "tmpColl/semantic";
const primModeId = (key) => `tmpMode/primitive/${key}`;
const semModeId = (mode) => `tmpMode/semantic/${mode}`;
const primVarId = (key, name) => `tmpVar/primitive/${key}/${name}`;
const semVarId = (name) => `tmpVar/semantic/${name}`;

const titleCase = (s) =>
  s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

const variableCollections = [];
const variableModes = [];
const variables = [];
const variableModeValues = [];

// Primitive 컬렉션들 — 각 단일 mode "Value"
for (const key of ["core", ...BRANDS.filter((b) => b !== "nudge-eap").map(primCollKey)]) {
  variableCollections.push({
    action: "CREATE",
    id: collId(key),
    name: `Primitive/${key === "core" ? "Core" : titleCase(key)}`,
    initialModeId: primModeId(key),
  });
  variableModes.push({
    action: "UPDATE", // initial mode 이름 변경
    id: primModeId(key),
    variableCollectionId: collId(key),
    name: "Value",
  });
  for (const [name, hex] of Object.entries(fig.primitives[key])) {
    variables.push({
      action: "CREATE",
      id: primVarId(key, name),
      name,
      variableCollectionId: collId(key),
      resolvedType: "COLOR",
    });
    variableModeValues.push({
      variableId: primVarId(key, name),
      modeId: primModeId(key),
      value: toFigmaColor(hex),
    });
  }
}

// Semantic 컬렉션 — mode = brand (첫 mode=initial, 나머지 CREATE)
variableCollections.push({
  action: "CREATE",
  id: SEM_COLL,
  name: "Semantic",
  initialModeId: semModeId(BRANDS[0]),
});
variableModes.push({
  action: "UPDATE",
  id: semModeId(BRANDS[0]),
  variableCollectionId: SEM_COLL,
  name: BRANDS[0],
});
for (const mode of BRANDS.slice(1)) {
  variableModes.push({
    action: "CREATE",
    id: semModeId(mode),
    variableCollectionId: SEM_COLL,
    name: mode,
  });
}

// css var(--semantic-…) → figma semantic 변수 이름 역매핑 (self-ref 해석용)
const cssVarToSemName = {};
for (const name of Object.keys(fig.semantic.variables)) {
  cssVarToSemName[`--semantic-${name.replace(/\//g, "-")}`] = name;
}
// alias "family/stop" 가 어느 primitive 컬렉션에 있나 (브랜드 우선, 없으면 core)
function resolveAliasCollKey(aliasName, mode) {
  const brandKey = primCollKey(mode);
  if (mode !== "nudge-eap" && fig.primitives[brandKey] && aliasName in fig.primitives[brandKey])
    return brandKey;
  if (aliasName in fig.primitives.core) return "core";
  return null;
}

const warnings = [];
for (const [name, def] of Object.entries(fig.semantic.variables)) {
  variables.push({
    action: "CREATE",
    id: semVarId(name),
    name,
    variableCollectionId: SEM_COLL,
    resolvedType: "COLOR",
  });
  for (const [mode, mv] of Object.entries(def.valuesByMode)) {
    let value;
    if (mv.alias) {
      const ck = resolveAliasCollKey(mv.alias, mode);
      if (!ck) {
        warnings.push(`alias 미해결: ${name}[${mode}] → ${mv.alias}`);
        continue;
      }
      value = { type: "VARIABLE_ALIAS", id: primVarId(ck, mv.alias) };
    } else {
      const lit = mv.value;
      const semRef = lit.match(/^var\((--semantic-[a-z0-9-]+)\)$/i);
      if (semRef) {
        const target = cssVarToSemName[semRef[1]];
        if (!target) {
          warnings.push(`semantic self-ref 미해결: ${name}[${mode}] → ${lit}`);
          continue;
        }
        value = { type: "VARIABLE_ALIAS", id: semVarId(target) };
      } else {
        value = toFigmaColor(lit); // hex / rgba 리터럴
      }
    }
    variableModeValues.push({ variableId: semVarId(name), modeId: semModeId(mode), value });
  }
}

const payload = { variableCollections, variableModes, variables, variableModeValues };

// ─── 출력 ───────────────────────────────────────────────
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");
console.log("─ Figma Variables REST payload (CREATE) ─");
console.log(
  `  컬렉션: ${variableCollections.length}  (${variableCollections.map((c) => c.name).join(", ")})`,
);
console.log(
  `  modes: ${variableModes.length}  변수: ${variables.length}  modeValues: ${variableModeValues.length}`,
);
console.log(`  → ${OUT}`);
if (warnings.length) {
  console.log(`\n⚠ 미해결 ${warnings.length}건:`);
  warnings.slice(0, 20).forEach((w) => console.log(`  ${w}`));
}

if (process.argv.includes("--apply")) {
  const token = process.env.FIGMA_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  if (!token || !fileKey) {
    console.error("\n✗ --apply 에는 FIGMA_TOKEN, FIGMA_FILE_KEY 환경변수가 필요합니다.");
    process.exit(1);
  }
  fetch(`https://api.figma.com/v1/files/${fileKey}/variables`, {
    method: "POST",
    headers: { "X-Figma-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (r) => {
      const body = await r.text();
      console.log(`\nPOST → ${r.status}`);
      console.log(body.slice(0, 2000));
      if (!r.ok) process.exit(1);
    })
    .catch((e) => {
      console.error("✗ 요청 실패:", e.message);
      process.exit(1);
    });
} else {
  console.log(
    "\n(dry-run — 실제 업로드는 `node scripts/figma-variables-upload.cjs --apply` + FIGMA_TOKEN/FIGMA_FILE_KEY)",
  );
}
