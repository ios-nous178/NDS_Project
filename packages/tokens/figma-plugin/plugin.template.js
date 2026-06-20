/**
 * 생성물 — 편집 금지. 원본 = figma-plugin/plugin.template.js + dist/next/figma-variables.json,
 * 빌드 = `node scripts/build-figma-plugin.cjs` (→ figma-plugin/code.js).
 *
 * Nudge Tokens → Figma 플러그인 (코드 SSOT → Figma 변수 + 바인딩된 비주얼 가이드).
 *   1) Primitive/Core + Primitive/{Brand} 컬렉션 + Semantic(brand=mode) 컬렉션을 생성/업서트.
 *      semantic 값은 primitive 변수로 VARIABLE_ALIAS, confirmCta self-ref 는 semantic alias.
 *   2) "🎨 Token Guide" 페이지: Primitive=램프별 그룹, Semantic=카테고리 카드×브랜드 열 표.
 *      스와치 fill 을 변수에 **바인딩** → 값 바뀌면 자동 갱신. 이름기준 업서트(재실행 안전).
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
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const INK = { r: 0.08, g: 0.08, b: 0.1 };
  const SUB = { r: 0.42, g: 0.43, b: 0.47 };
  const LINE = { r: 0.9, g: 0.9, b: 0.93 };
  const CARD = { r: 0.98, g: 0.98, b: 0.99 };
  const WHITE = { r: 1, g: 1, b: 1 };

  const auto = (name, dir, gap, opts) => {
    opts = opts || {};
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = dir;
    f.itemSpacing = gap;
    f.primaryAxisSizingMode = opts.primary || "AUTO";
    f.counterAxisSizingMode = opts.counter || "AUTO";
    if (opts.align) f.counterAxisAlignItems = opts.align;
    if (opts.padV != null) f.paddingTop = f.paddingBottom = opts.padV;
    if (opts.padH != null) f.paddingLeft = f.paddingRight = opts.padH;
    if (opts.pad != null)
      f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = opts.pad;
    f.fills = opts.fill ? [{ type: "SOLID", color: opts.fill }] : [];
    if (opts.radius) f.cornerRadius = opts.radius;
    if (opts.stroke) {
      f.strokes = [{ type: "SOLID", color: opts.stroke }];
      f.strokeWeight = 1;
    }
    return f;
  };
  const txt = (s, size, weight, color, w, align) => {
    const t = figma.createText();
    t.fontName = { family: "Inter", style: weight || "Regular" };
    t.characters = String(s);
    t.fontSize = size;
    t.fills = [{ type: "SOLID", color: color || INK }];
    if (w != null) {
      t.textAutoResize = "HEIGHT";
      t.resize(w, t.height);
      if (align) t.textAlignHorizontal = align;
    }
    return t;
  };
  const spacer = (w, h) => {
    const f = figma.createFrame();
    f.name = "·";
    f.resize(w, h);
    f.fills = [];
    return f;
  };
  const swatch = (variable, w, h) => {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.cornerRadius = 8;
    let paint = { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } };
    try {
      paint = figma.variables.setBoundVariableForPaint(paint, "color", variable);
    } catch (e) {} // eslint-disable-line no-empty
    r.fills = [paint];
    r.strokes = [{ type: "SOLID", color: LINE }];
    r.strokeWeight = 1;
    return r;
  };
  const pretty = (s) => s.replace(/-/g, " ").replace(/(^|\s)\w/g, (m) => m.toUpperCase());

  // 재실행 안전 — 기존 가이드 페이지가 있으면 비우고 재사용(중복 생성 방지).
  const PAGE_NAME = "🎨 Token Guide";
  let page = figma.root.children.find((p) => p.name === PAGE_NAME);
  if (page) {
    await page.loadAsync();
    for (const child of [...page.children]) child.remove();
  } else {
    page = figma.createPage();
    page.name = PAGE_NAME;
  }

  const root = auto("Nudge Design Tokens", "VERTICAL", 56, { pad: 72, fill: WHITE });

  const head = auto("header", "VERTICAL", 6);
  head.appendChild(txt("Nudge Design Tokens", 36, "Bold", INK));
  head.appendChild(
    txt(
      "Primitive · Semantic (brand = mode) — 코드 SSOT 에서 자동 생성, 스와치는 변수 바인딩",
      14,
      "Regular",
      SUB,
    ),
  );
  root.appendChild(head);

  // ── Primitives — 램프별 그룹 ──
  const primSection = auto("Primitives", "VERTICAL", 24);
  primSection.appendChild(txt("Primitives", 26, "Bold", INK));
  for (const key of primKeys) {
    const card = auto(collTitle(key), "VERTICAL", 20, {
      pad: 28,
      fill: CARD,
      radius: 16,
      stroke: LINE,
    });
    card.appendChild(txt(collTitle(key).replace("Primitive/", ""), 16, "Medium", SUB));
    const fams = {};
    for (const name of Object.keys(TOKENS.primitives[key])) {
      const i = name.indexOf("/");
      const fam = i < 0 ? name : name.slice(0, i);
      const stop = i < 0 ? "" : name.slice(i + 1);
      (fams[fam] = fams[fam] || []).push({ name, stop });
    }
    for (const fam of Object.keys(fams)) {
      const row = auto(fam, "HORIZONTAL", 16, { align: "CENTER" });
      row.appendChild(txt(fam, 12, "Medium", INK, 92, "RIGHT"));
      const chips = auto("chips", "HORIZONTAL", 8);
      for (const s of fams[fam]) {
        const chip = auto(s.name, "VERTICAL", 6, { align: "CENTER" });
        chip.appendChild(swatch(primVars[key][s.name], 64, 48));
        chip.appendChild(txt(s.stop, 10, "Medium", SUB));
        chips.appendChild(chip);
      }
      row.appendChild(chips);
      card.appendChild(row);
    }
    primSection.appendChild(card);
  }
  root.appendChild(primSection);

  // ── Semantic — 카테고리 카드 × 브랜드 열 ──
  const COLW = 108;
  const NAMEW = 260;
  const ROWH = 40;
  const semSection = auto("Semantic", "VERTICAL", 20);
  semSection.appendChild(txt("Semantic", 26, "Bold", INK));
  semSection.appendChild(
    txt("열 = 브랜드 모드 · 같은 role 이 프로젝트별로 어떻게 풀리는지 비교", 13, "Regular", SUB),
  );

  const headRow = auto("modes", "HORIZONTAL", 8, { align: "CENTER" });
  headRow.appendChild(spacer(NAMEW, 1));
  for (const b of BRANDS) headRow.appendChild(txt(b, 12, "Bold", INK, COLW, "CENTER"));
  semSection.appendChild(headRow);

  const cats = {};
  for (const name of Object.keys(TOKENS.semantic.variables)) {
    const cat = name.split("/")[0];
    (cats[cat] = cats[cat] || []).push(name);
  }
  for (const cat of Object.keys(cats)) {
    const card = auto(cat, "VERTICAL", 12, {
      padV: 18,
      padH: 22,
      fill: CARD,
      radius: 14,
      stroke: LINE,
    });
    card.appendChild(txt(pretty(cat), 14, "Bold", INK));
    for (const name of cats[cat]) {
      const role = name.split("/").slice(1).join(" / ") || "(base)";
      const row = auto(name, "HORIZONTAL", 8, { align: "CENTER" });
      row.appendChild(txt(role, 12, "Regular", INK, NAMEW));
      for (const b of BRANDS) {
        const cell = figma.createFrame();
        cell.name = b;
        cell.resize(COLW, ROWH);
        cell.fills = [];
        cell.clipsContent = false;
        try {
          cell.setExplicitVariableModeForCollection(semColl, modeIds[b]);
        } catch (e) {} // eslint-disable-line no-empty
        cell.appendChild(swatch(semVars[name], COLW, ROWH));
        row.appendChild(cell);
      }
      card.appendChild(row);
    }
    semSection.appendChild(card);
  }
  root.appendChild(semSection);

  page.appendChild(root);
  await figma.setCurrentPageAsync(page);
}

main()
  .then(() => figma.closePlugin("✓ 변수 + Token Guide 생성 완료"))
  .catch((e) => figma.closePlugin("✗ 오류: " + (e && e.message ? e.message : e)));
