/**
 * 생성물 — 편집 금지. 원본 = figma-plugin/plugin.template.js + dist/next/figma-variables.json,
 * 빌드 = `node scripts/build-figma-plugin.cjs` (→ figma-plugin/code.js).
 *
 * Nudge Tokens → Figma 플러그인 (코드 SSOT → Figma 변수 + 바인딩된 비주얼 가이드).
 *   1) Primitive/Core + Primitive/{Brand} 컬렉션 + Semantic(brand=mode) 컬렉션을 생성/업서트.
 *      semantic 값은 primitive 변수로 VARIABLE_ALIAS, confirmCta self-ref 는 semantic alias.
 *   2) "🎨 Token Guide" 페이지에 스와치를 그리되 fill 을 변수에 **바인딩** → 값 바뀌면 자동 갱신.
 * 이름기준 업서트(재실행 안전). 토큰/네트워크 불필요(현 파일에 직접 실행).
 */
const TOKENS = __TOKENS_JSON__;

function toRGBA(str) {
  const s = String(str).trim();
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
  throw new Error("색 파싱 불가: " + str);
}

const BRANDS = TOKENS.semantic.modes; // ["nudge-eap", ...]
const collKeyForMode = (m) => (m === "nudge-eap" ? "core" : m);
const collTitle = (key) =>
  "Primitive/" +
  (key === "core" ? "Core" : key.replace(/(^|-)(\w)/g, (_, _d, c) => c.toUpperCase()));

async function main() {
  // ── 변수 ───────────────────────────────────────────────
  const existingColls = await figma.variables.getLocalVariableCollectionsAsync();
  const existingVars = await figma.variables.getLocalVariablesAsync();
  const ensureColl = (name) => {
    const found = existingColls.find((c) => c.name === name);
    return found || figma.variables.createVariableCollection(name);
  };
  const ensureVar = (name, coll) => {
    const found = existingVars.find((v) => v.name === name && v.variableCollectionId === coll.id);
    return found || figma.variables.createVariable(name, coll, "COLOR");
  };

  const primKeys = ["core", ...BRANDS.filter((b) => b !== "nudge-eap").map(collKeyForMode)];
  const primVars = {}; // key -> { varName -> Variable }
  for (const key of primKeys) {
    const coll = ensureColl(collTitle(key));
    coll.renameMode(coll.modes[0].modeId, "Value");
    const modeId = coll.modes[0].modeId;
    primVars[key] = {};
    for (const [name, hex] of Object.entries(TOKENS.primitives[key])) {
      const v = ensureVar(name, coll);
      v.setValueForMode(modeId, toRGBA(hex));
      primVars[key][name] = v;
    }
  }

  const semColl = ensureColl("Semantic");
  const modeIds = {};
  semColl.renameMode(semColl.modes[0].modeId, BRANDS[0]);
  modeIds[BRANDS[0]] = semColl.modes[0].modeId;
  for (const m of BRANDS.slice(1)) {
    const ex = semColl.modes.find((x) => x.name === m);
    modeIds[m] = ex ? ex.modeId : semColl.addMode(m);
  }
  const semVars = {};
  for (const name of Object.keys(TOKENS.semantic.variables))
    semVars[name] = ensureVar(name, semColl);

  const cssToSem = {};
  for (const n of Object.keys(TOKENS.semantic.variables))
    cssToSem["--semantic-" + n.replace(/\//g, "-")] = n;
  const resolvePrim = (alias, mode) => {
    const bk = collKeyForMode(mode);
    if (mode !== "nudge-eap" && primVars[bk] && primVars[bk][alias]) return primVars[bk][alias];
    return primVars.core[alias] || null;
  };
  for (const [name, def] of Object.entries(TOKENS.semantic.variables)) {
    const v = semVars[name];
    for (const [mode, mv] of Object.entries(def.valuesByMode)) {
      const mid = modeIds[mode];
      if (mv.alias) {
        const t = resolvePrim(mv.alias, mode);
        if (t) v.setValueForMode(mid, { type: "VARIABLE_ALIAS", id: t.id });
      } else {
        const ref = /^var\((--semantic-[a-z0-9-]+)\)$/.exec(mv.value);
        if (ref && semVars[cssToSem[ref[1]]])
          v.setValueForMode(mid, { type: "VARIABLE_ALIAS", id: semVars[cssToSem[ref[1]]].id });
        else if (!ref) v.setValueForMode(mid, toRGBA(mv.value));
      }
    }
  }

  // ── 비주얼 가이드 ──────────────────────────────────────
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  const page = figma.createPage();
  page.name = "🎨 Token Guide";

  const vstack = (name, gap, pad) => {
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = "VERTICAL";
    f.itemSpacing = gap;
    f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = pad || 0;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    f.fills = [];
    return f;
  };
  const label = (text, size, medium) => {
    const t = figma.createText();
    t.fontName = { family: "Inter", style: medium ? "Medium" : "Regular" };
    t.characters = text;
    t.fontSize = size;
    return t;
  };
  const boundSwatch = (variable, w, h) => {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.cornerRadius = 6;
    let paint = { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } };
    paint = figma.variables.setBoundVariableForPaint(paint, "color", variable);
    r.fills = [paint];
    r.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
    r.strokeWeight = 1;
    return r;
  };

  const root = vstack("Tokens", 48, 48);
  root.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

  // Primitive 섹션 — 컬렉션별 스와치 그리드
  for (const key of primKeys) {
    const section = vstack(collTitle(key), 16);
    section.appendChild(label(collTitle(key), 20, true));
    const grid = figma.createFrame();
    grid.name = "swatches";
    grid.layoutMode = "HORIZONTAL";
    grid.layoutWrap = "WRAP";
    grid.itemSpacing = 12;
    grid.counterAxisSpacing = 12;
    grid.primaryAxisSizingMode = "FIXED";
    grid.counterAxisSizingMode = "AUTO";
    grid.resize(1040, 100);
    grid.fills = [];
    for (const [name, hex] of Object.entries(TOKENS.primitives[key])) {
      const cell = vstack("c", 4);
      cell.appendChild(boundSwatch(primVars[key][name], 72, 56));
      cell.appendChild(label(name, 10, true));
      cell.appendChild(label(String(hex).toUpperCase(), 9));
      grid.appendChild(cell);
    }
    section.appendChild(grid);
    root.appendChild(section);
  }

  // Semantic 섹션 — role 마다 모드(브랜드)별 스와치 (mode-override 프레임에 바인딩)
  const sem = vstack("Semantic", 12);
  sem.appendChild(label("Semantic (brand = mode)", 20, true));
  const header = figma.createFrame();
  header.layoutMode = "HORIZONTAL";
  header.itemSpacing = 8;
  header.counterAxisSizingMode = "AUTO";
  header.primaryAxisSizingMode = "AUTO";
  header.fills = [];
  header.appendChild(
    (() => {
      const l = label("", 11);
      l.resize(220, 16);
      return l;
    })(),
  );
  for (const b of BRANDS) {
    const l = label(b, 11, true);
    l.resize(72, 16);
    header.appendChild(l);
  }
  sem.appendChild(header);
  for (const name of Object.keys(TOKENS.semantic.variables)) {
    const row = figma.createFrame();
    row.layoutMode = "HORIZONTAL";
    row.itemSpacing = 8;
    row.counterAxisAlignItems = "CENTER";
    row.counterAxisSizingMode = "AUTO";
    row.primaryAxisSizingMode = "AUTO";
    row.fills = [];
    const nameLabel = label(name, 11);
    nameLabel.resize(220, 16);
    row.appendChild(nameLabel);
    for (const b of BRANDS) {
      const cellFrame = figma.createFrame(); // mode-override 프레임 → 해당 브랜드 값 표시
      cellFrame.resize(72, 32);
      cellFrame.fills = [];
      cellFrame.clipsContent = false;
      cellFrame.setExplicitVariableModeForCollection(semColl, modeIds[b]);
      cellFrame.appendChild(boundSwatch(semVars[name], 72, 32));
      row.appendChild(cellFrame);
    }
    sem.appendChild(row);
  }
  root.appendChild(sem);

  page.appendChild(root);
  figma.currentPage = page;
}

main()
  .then(() => figma.closePlugin("✓ 변수 + Token Guide 생성 완료"))
  .catch((e) => figma.closePlugin("✗ 오류: " + (e && e.message ? e.message : e)));
