/**
 * 생성물 — 편집 금지. 원본 = figma-plugin/plugin.template.js + dist/next/figma-variables.json,
 * 빌드 = `node scripts/build-figma-plugin.cjs` (→ figma-plugin/code.js).
 *
 * Nudge Tokens → Figma 플러그인 (코드 SSOT → Figma 변수 + Text Style + 바인딩된 비주얼 가이드).
 *   변수: Primitive/Core+{Brand}(COLOR) · Semantic(COLOR, brand=mode) · Dimension(FLOAT, brand=mode).
 *   Text Style: typeScale 묶음(fontSize/lineHeight/letterSpacing 를 Dimension 변수에 바인딩).
 *   페이지: "🎨 Token Guide — Color"(Atomic+Semantic) · "🎨 Token Guide — Dimension & Type".
 *   손작업 컬러가이드(652/667) 스타일 정합. 이름기준 업서트(재실행 안전).
 */
const TOKENS = __TOKENS_JSON__;
const META = TOKENS.meta || {};

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

const BRANDS = TOKENS.semantic.modes;
const brandLabel = (m) => (META.brandLabels && META.brandLabels[m]) || m;
const collKeyForMode = (m) => (m === "nudge-eap" ? "core" : m);
const collTitle = (key) =>
  "Primitive/" +
  (key === "core" ? "Core" : key.replace(/(^|-)(\w)/g, (_, _d, c) => c.toUpperCase()));
const collKeyHasAlias = (key, alias) => TOKENS.primitives[key] && TOKENS.primitives[key][alias];

const cssToSem = {};
for (const n of Object.keys(TOKENS.semantic.variables))
  cssToSem["--semantic-" + n.replace(/\//g, "-")] = n;

// semantic 토큰의 brand mode 해석 → { hex, ref }(primitive 참조 "family.stop"). 표시용.
function resolveCell(name, mode, seen) {
  seen = seen || {};
  if (seen[name + "|" + mode]) return null;
  seen[name + "|" + mode] = 1;
  const def = TOKENS.semantic.variables[name];
  if (!def) return null;
  const mv = def.valuesByMode[mode];
  if (!mv) return null;
  if (mv.alias) {
    const bk = collKeyForMode(mode);
    const hex = (
      mode !== "nudge-eap" && collKeyHasAlias(bk, mv.alias)
        ? TOKENS.primitives[bk]
        : TOKENS.primitives.core
    )[mv.alias];
    return hex ? { hex, ref: mv.alias.replace(/\//g, ".") } : null;
  }
  const v = mv.value;
  const r = /^var\((--semantic-[a-z0-9-]+)\)$/.exec(v);
  if (r) return cssToSem[r[1]] ? resolveCell(cssToSem[r[1]], mode, seen) : null;
  return { hex: v, ref: "" };
}

async function main() {
  // ════ 변수 ════
  const existingColls = await figma.variables.getLocalVariableCollectionsAsync();
  const existingVars = await figma.variables.getLocalVariablesAsync();
  const ensureColl = (name) =>
    existingColls.find((c) => c.name === name) || figma.variables.createVariableCollection(name);
  const ensureVar = (name, coll, type) =>
    existingVars.find((v) => v.name === name && v.variableCollectionId === coll.id) ||
    figma.variables.createVariable(name, coll, type);

  // Primitive 컬렉션 (COLOR)
  const primKeys = ["core", ...BRANDS.filter((b) => b !== "nudge-eap").map(collKeyForMode)];
  const primVars = {};
  for (const key of primKeys) {
    const coll = ensureColl(collTitle(key));
    coll.renameMode(coll.modes[0].modeId, "Value");
    primVars[key] = {};
    for (const [name, hex] of Object.entries(TOKENS.primitives[key])) {
      const v = ensureVar(name, coll, "COLOR");
      v.setValueForMode(coll.modes[0].modeId, toRGBA(hex));
      primVars[key][name] = v;
    }
  }

  // Semantic 컬렉션 (COLOR, brand=mode)
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
    semVars[name] = ensureVar(name, semColl, "COLOR");
  const resolvePrim = (alias, mode) => {
    const bk = collKeyForMode(mode);
    if (mode !== "nudge-eap" && collKeyHasAlias(bk, alias)) return primVars[bk][alias];
    return primVars.core[alias] || null;
  };
  for (const [name, def] of Object.entries(TOKENS.semantic.variables)) {
    for (const [mode, mv] of Object.entries(def.valuesByMode)) {
      const mid = modeIds[mode];
      if (mv.alias) {
        const t = resolvePrim(mv.alias, mode);
        if (t) semVars[name].setValueForMode(mid, { type: "VARIABLE_ALIAS", id: t.id });
      } else {
        const r = /^var\((--semantic-[a-z0-9-]+)\)$/.exec(mv.value);
        if (r && semVars[cssToSem[r[1]]])
          semVars[name].setValueForMode(mid, {
            type: "VARIABLE_ALIAS",
            id: semVars[cssToSem[r[1]]].id,
          });
        else if (!r) semVars[name].setValueForMode(mid, toRGBA(mv.value));
      }
    }
  }

  // Dimension 컬렉션 (FLOAT, brand=mode)
  const dimColl = ensureColl("Dimension");
  const dModeIds = {};
  dimColl.renameMode(dimColl.modes[0].modeId, BRANDS[0]);
  dModeIds[BRANDS[0]] = dimColl.modes[0].modeId;
  for (const m of BRANDS.slice(1)) {
    const ex = dimColl.modes.find((x) => x.name === m);
    dModeIds[m] = ex ? ex.modeId : dimColl.addMode(m);
  }
  const dimVars = {};
  for (const [name, def] of Object.entries(TOKENS.dimensions.variables)) {
    const v = ensureVar(name, dimColl, "FLOAT");
    for (const [mode, mv] of Object.entries(def.valuesByMode))
      v.setValueForMode(dModeIds[mode], mv.value);
    dimVars[name] = v;
  }

  // Text Style (typeScale 묶음 → size/lh/ls 를 Dimension 변수에 바인딩)
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  const styleName = (kk) =>
    kk
      .split("-")
      .map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
      .join("/");
  const existingStyles = await figma.getLocalTextStylesAsync();
  const createdStyles = [];
  for (const kk of TOKENS.dimensions.textStyleKeys) {
    const nm = styleName(kk);
    let st = existingStyles.find((s) => s.name === nm);
    if (!st) {
      st = figma.createTextStyle();
      st.name = nm;
    }
    st.fontName = { family: "Inter", style: "Regular" };
    const fs = dimVars["font-size/" + kk],
      lh = dimVars["line-height/" + kk],
      ls = dimVars["letter-spacing/" + kk];
    const base = (n) =>
      (
        (TOKENS.dimensions.variables[n] &&
          TOKENS.dimensions.variables[n].valuesByMode["nudge-eap"]) ||
        {}
      ).value;
    if (base("font-size/" + kk)) st.fontSize = base("font-size/" + kk);
    if (base("line-height/" + kk))
      st.lineHeight = { value: base("line-height/" + kk), unit: "PIXELS" };
    st.letterSpacing = { value: base("letter-spacing/" + kk) || 0, unit: "PIXELS" };
    try {
      if (fs) st.setBoundVariable("fontSize", fs);
      if (lh) st.setBoundVariable("lineHeight", lh);
      if (ls) st.setBoundVariable("letterSpacing", ls);
    } catch (e) {} // eslint-disable-line no-empty
    createdStyles.push({ kk, nm, st });
  }

  // ════ 비주얼 ════
  const INK = { r: 0.1, g: 0.1, b: 0.12 },
    SUB = { r: 0.45, g: 0.46, b: 0.5 },
    FAINT = { r: 0.62, g: 0.63, b: 0.67 };
  const LINE = { r: 0.9, g: 0.9, b: 0.93 },
    BAR = { r: 0.96, g: 0.965, b: 0.975 },
    WHITE = { r: 1, g: 1, b: 1 };
  const ACCENT = { r: 0.17, g: 0.59, b: 0.93 };

  const auto = (name, dir, gap, o) => {
    o = o || {};
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = dir;
    f.itemSpacing = gap;
    f.primaryAxisSizingMode = o.primary || "AUTO";
    f.counterAxisSizingMode = o.counter || "AUTO";
    if (o.align) f.counterAxisAlignItems = o.align;
    if (o.padV != null) f.paddingTop = f.paddingBottom = o.padV;
    if (o.padH != null) f.paddingLeft = f.paddingRight = o.padH;
    if (o.pad != null) f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = o.pad;
    f.fills = o.fill ? [{ type: "SOLID", color: o.fill }] : [];
    if (o.radius) f.cornerRadius = o.radius;
    if (o.stroke) {
      f.strokes = [{ type: "SOLID", color: o.stroke }];
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
  const rect = (w, h, color) => {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.cornerRadius = 2;
    r.fills = [{ type: "SOLID", color }];
    return r;
  };
  const sw = (variable, w, h) => {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.cornerRadius = 4;
    let p = { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.87 } };
    try {
      p = figma.variables.setBoundVariableForPaint(p, "color", variable);
    } catch (e) {} // eslint-disable-line no-empty
    r.fills = [p];
    r.strokes = [{ type: "SOLID", color: LINE }];
    r.strokeWeight = 1;
    return r;
  };
  const accentTitle = (parent, title, sub) => {
    const row = auto("h", "HORIZONTAL", 10, { align: "CENTER" });
    row.appendChild(rect(4, 16, ACCENT));
    row.appendChild(txt(title, 14, "Bold", INK));
    if (sub) row.appendChild(txt(sub, 10, "Regular", SUB));
    parent.appendChild(row);
  };
  const getPage = (name) => {
    let p = figma.root.children.find((x) => x.name === name);
    if (p) {
      return p.loadAsync().then(() => {
        for (const c of [...p.children]) c.remove();
        return p;
      });
    }
    p = figma.createPage();
    p.name = name;
    return Promise.resolve(p);
  };

  // ── 페이지 1: Color ──
  const colorPage = await getPage("🎨 Token Guide — Color");

  const atomic = auto("Color — Atomic", "VERTICAL", 22, { pad: 56, fill: WHITE });
  const ah = auto("hd", "VERTICAL", 4);
  ah.appendChild(rect(40, 4, ACCENT));
  ah.appendChild(txt("Color — Atomic", 28, "Bold", INK));
  ah.appendChild(
    txt(
      "Primitive 팔레트 (컬렉션별) — 코드 SSOT 자동 생성 · 스와치 = 변수 바인딩",
      12,
      "Regular",
      SUB,
    ),
  );
  atomic.appendChild(ah);
  for (const key of primKeys) {
    accentTitle(
      atomic,
      collTitle(key).replace("Primitive/", ""),
      (META.collections && META.collections[key]) || "",
    );
    const fams = {};
    for (const name of Object.keys(TOKENS.primitives[key])) {
      const i = name.indexOf("/");
      const fam = i < 0 ? name : name.slice(0, i);
      (fams[fam] = fams[fam] || []).push({
        name,
        stop: i < 0 ? "" : name.slice(i + 1),
        hex: TOKENS.primitives[key][name],
      });
    }
    for (const fam of Object.keys(fams)) {
      const row = auto(fam, "HORIZONTAL", 16, { align: "MIN" });
      const lab = auto("l", "VERTICAL", 2, { align: "MIN" });
      lab.appendChild(txt(fam, 13, "Bold", INK, 120));
      if (META.families && META.families[fam] && META.families[fam].desc)
        lab.appendChild(txt(META.families[fam].desc, 10, "Regular", SUB, 120));
      row.appendChild(lab);
      const ramp = auto("r", "HORIZONTAL", 8);
      for (const s of fams[fam]) {
        const cell = auto(s.name, "VERTICAL", 4, { align: "MIN" });
        cell.appendChild(sw(primVars[key][s.name], 76, 52));
        cell.appendChild(txt(s.stop, 10, "Medium", SUB, 76));
        cell.appendChild(txt(String(s.hex).toUpperCase(), 9, "Regular", FAINT, 76));
        ramp.appendChild(cell);
      }
      row.appendChild(ramp);
      atomic.appendChild(row);
    }
  }
  colorPage.appendChild(atomic);

  // Semantic 표
  const NAMEW = 410,
    COLW = 158;
  const semantic = auto("Color — Semantic", "VERTICAL", 0, { pad: 56, fill: WHITE });
  const sh = auto("hd", "VERTICAL", 4);
  sh.appendChild(rect(40, 4, ACCENT));
  sh.appendChild(txt("Color — Semantic", 28, "Bold", INK));
  sh.appendChild(
    txt(
      "열 = 브랜드 모드 · --semantic-{role} · 셀 = Semantic 변수(모드 바인딩) + primitive 참조",
      12,
      "Regular",
      SUB,
    ),
  );
  semantic.appendChild(sh);
  semantic.appendChild(
    (() => {
      const s = figma.createFrame();
      s.resize(1, 20);
      s.fills = [];
      return s;
    })(),
  );
  const headBar = auto("colhead", "HORIZONTAL", 0, {
    align: "CENTER",
    fill: BAR,
    radius: 6,
    padV: 9,
    padH: 14,
  });
  headBar.appendChild(txt("Token", 11, "Bold", INK, NAMEW - 14));
  for (const b of BRANDS) headBar.appendChild(txt(brandLabel(b), 11, "Bold", INK, COLW, "LEFT"));
  semantic.appendChild(headBar);

  const cats = {};
  for (const name of Object.keys(TOKENS.semantic.variables))
    (cats[name.split("/")[0]] = cats[name.split("/")[0]] || []).push(name);
  const catName = (c) => c.replace(/-/g, " ").replace(/(^|\s)\w/g, (m) => m.toUpperCase());
  for (const cat of Object.keys(cats)) {
    const group = auto(cat, "VERTICAL", 0);
    const gpad = figma.createFrame();
    gpad.resize(1, 18);
    gpad.fills = [];
    group.appendChild(gpad);
    accentTitle(group, catName(cat), `${cats[cat].length} tokens`);
    const gpad2 = figma.createFrame();
    gpad2.resize(1, 6);
    gpad2.fills = [];
    group.appendChild(gpad2);
    for (const name of cats[cat]) {
      const row = auto(name, "HORIZONTAL", 0, { align: "CENTER", padV: 7 });
      row.appendChild(txt("--semantic-" + name.replace(/\//g, "-"), 11, "Regular", INK, NAMEW));
      for (const b of BRANDS) {
        const cellWrap = auto(b, "HORIZONTAL", 7, {
          align: "CENTER",
          primary: "FIXED",
          counter: "FIXED",
        });
        cellWrap.resize(COLW, 26);
        const cell = resolveCell(name, b);
        if (cell) {
          const cf = figma.createFrame();
          cf.name = b;
          cf.resize(20, 20);
          cf.fills = [];
          cf.clipsContent = false;
          try {
            cf.setExplicitVariableModeForCollection(semColl, modeIds[b]);
          } catch (e) {} // eslint-disable-line no-empty
          cf.appendChild(sw(semVars[name], 20, 20));
          cellWrap.appendChild(cf);
          const tw = auto("t", "VERTICAL", 1, { align: "MIN" });
          tw.appendChild(txt(String(cell.hex).toUpperCase(), 9, "Regular", INK));
          if (cell.ref) tw.appendChild(txt(cell.ref, 8, "Regular", FAINT));
          cellWrap.appendChild(tw);
        } else {
          cellWrap.appendChild(txt("—", 10, "Regular", LINE));
        }
        row.appendChild(cellWrap);
      }
      group.appendChild(row);
    }
    semantic.appendChild(group);
  }
  semantic.x = atomic.x + atomic.width + 120;
  colorPage.appendChild(semantic);

  // ── 페이지 2: Dimension & Type ──
  const dimPage = await getPage("🎨 Token Guide — Dimension & Type");
  const dimRoot = auto("Dimension & Type", "VERTICAL", 28, { pad: 56, fill: WHITE });
  const dh = auto("hd", "VERTICAL", 4);
  dh.appendChild(rect(40, 4, ACCENT));
  dh.appendChild(txt("Dimension & Type", 28, "Bold", INK));
  dh.appendChild(
    txt(
      "FLOAT 변수(spacing·radius·stroke·typeScale 분해) + Text Style(변수 바인딩) — 코드 SSOT 자동",
      12,
      "Regular",
      SUB,
    ),
  );
  dimRoot.appendChild(dh);

  // dimension 그룹별 목록 (이름 + base 값)
  const dgroups = {};
  for (const name of Object.keys(TOKENS.dimensions.variables))
    (dgroups[name.split("/")[0]] = dgroups[name.split("/")[0]] || []).push(name);
  for (const g of Object.keys(dgroups)) {
    const sec = auto(g, "VERTICAL", 8);
    accentTitle(sec, catName(g), `${dgroups[g].length}`);
    const grid = auto("rows", "VERTICAL", 4);
    for (const name of dgroups[g]) {
      const base = (TOKENS.dimensions.variables[name].valuesByMode["nudge-eap"] || {}).value;
      const row = auto(name, "HORIZONTAL", 12, { align: "CENTER" });
      row.appendChild(txt(name, 11, "Regular", INK, 240));
      row.appendChild(txt(base == null ? "—" : String(base), 11, "Medium", SUB, 60));
      // spacing/radius 류는 시각 바 표시
      if (
        /^(spacing|gap|inset|radius|shape|border-width|stroke)\b/.test(name) &&
        typeof base === "number" &&
        base <= 200
      ) {
        const bar = rect(Math.max(1, base), 12, ACCENT);
        row.appendChild(bar);
      }
      grid.appendChild(row);
    }
    sec.appendChild(grid);
    dimRoot.appendChild(sec);
  }

  // Text Style 샘플
  const tsSec = auto("Text Styles", "VERTICAL", 12);
  accentTitle(tsSec, "Text Styles", `${createdStyles.length} · typeScale → 변수 바인딩`);
  for (const cs of createdStyles) {
    const row = auto(cs.kk, "HORIZONTAL", 16, { align: "CENTER" });
    row.appendChild(txt(cs.nm, 11, "Regular", SUB, 140));
    const sample = txt("다람쥐 Aa 0123", 16, "Regular", INK);
    try {
      sample.textStyleId = cs.st.id;
    } catch (e) {} // eslint-disable-line no-empty
    row.appendChild(sample);
    tsSec.appendChild(row);
  }
  dimRoot.appendChild(tsSec);
  dimPage.appendChild(dimRoot);

  await figma.setCurrentPageAsync(colorPage);
}

main()
  .then(() => figma.closePlugin("✓ 변수 + Text Style + 가이드 2페이지 생성 완료"))
  .catch((e) => figma.closePlugin("✗ 오류: " + (e && e.message ? e.message : e)));
