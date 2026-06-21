/**
 * 생성물 — 편집 금지. 원본 = figma-plugin/plugin.template.js + dist/next/figma-variables.json,
 * 빌드 = `node scripts/build-figma-plugin.cjs` (→ figma-plugin/code.js).
 *
 * Nudge Tokens → Figma 플러그인 (코드 SSOT → Figma 변수 + Text Style + 바인딩된 비주얼 가이드).
 *   변수: Primitive/{Brand}(COLOR, nudge-eap 포함) · Semantic(COLOR, brand=mode) · Dimension(FLOAT, brand=mode).
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
const collKeyForMode = (m) => m;
const collTitle = (key) =>
  "Primitive/" + key.replace(/(^|-)(\w)/g, (_, _d, c) => c.toUpperCase());
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
    const hex = (
      collKeyHasAlias(mode, mv.alias) ? TOKENS.primitives[mode] : TOKENS.primitives["nudge-eap"]
    )[mv.alias];
    return hex ? { hex, ref: mv.alias } : null; // 슬래시 형 통일 (Figma 변수명 = "family/stop")
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
  const primKeys = BRANDS.map(collKeyForMode); // nudge-eap 포함 — 각 브랜드가 자기 Primitive 컬렉션
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
    if (collKeyHasAlias(mode, alias)) return primVars[mode][alias];
    return (primVars["nudge-eap"] && primVars["nudge-eap"][alias]) || null;
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
  // FLOAT 변수 scope — 해당 Figma 속성 picker 에만 떠서 바인딩이 깔끔하게 동작.
  const dimScope = (name) => {
    const c = name.split("/")[0];
    if (c === "font-size") return ["FONT_SIZE"];
    if (c === "line-height") return ["LINE_HEIGHT"];
    if (c === "letter-spacing") return ["LETTER_SPACING"];
    if (c === "radius" || c === "shape") return ["CORNER_RADIUS"];
    if (c === "border-width" || c === "stroke") return ["STROKE_FLOAT"];
    if (c === "gap" || c === "gap-title") return ["GAP"];
    if (c === "inset" || c === "spacing") return ["GAP", "WIDTH_HEIGHT"];
    if (c === "size" || c === "grid") return ["WIDTH_HEIGHT", "GAP"];
    return ["ALL_SCOPES"];
  };
  const dimVars = {};
  for (const [name, def] of Object.entries(TOKENS.dimensions.variables)) {
    const v = ensureVar(name, dimColl, "FLOAT");
    for (const [mode, mv] of Object.entries(def.valuesByMode))
      v.setValueForMode(dModeIds[mode], mv.value);
    try {
      v.scopes = dimScope(name);
    } catch (e) {} // eslint-disable-line no-empty
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

  // Effect Style (Elevation — box-shadow → DropShadow). 변수 타입에 그림자가 없어 Effect Style 로.
  //   효과엔 brand=mode 가 안 되므로 브랜드별 "Elevation/{브랜드}/E{n}" 스타일 생성.
  //   none/빈 값·base 와 동일한 레벨(브랜드 미override)은 스킵 → base 스타일만 둠.
  const parseShadows = (str) => {
    if (!str || str === "none") return [];
    return str
      .split(/,(?![^(]*\))/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((p) => {
        const cm = p.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]+)/);
        const col = cm ? cm[1] : "rgba(0,0,0,0.12)";
        const nums = ((cm ? p.replace(cm[1], "") : p).match(/-?\d*\.?\d+/g) || []).map(Number);
        const c = toRGBA(col);
        return {
          type: "DROP_SHADOW",
          color: { r: c.r, g: c.g, b: c.b, a: c.a },
          offset: { x: nums[0] || 0, y: nums[1] || 0 },
          radius: nums[2] || 0,
          spread: nums[3] || 0,
          visible: true,
          blendMode: "NORMAL",
        };
      });
  };
  const ELEV = TOKENS.elevation || { modes: [], variables: {} };
  const elevLevels = Object.keys(ELEV.variables);
  const elevVal = (lvl, mode) => ((ELEV.variables[lvl].valuesByMode[mode] || {}).value) || "";
  const existingEffectStyles = await figma.getLocalEffectStylesAsync();
  const ensureEffect = (name) => {
    let s = existingEffectStyles.find((x) => x.name === name);
    if (!s) {
      s = figma.createEffectStyle();
      s.name = name;
    }
    return s;
  };
  for (const mode of ELEV.modes) {
    for (const lvl of elevLevels) {
      const val = elevVal(lvl, mode);
      const eff = parseShadows(val);
      if (!eff.length) continue;
      if (mode !== "nudge-eap" && val === elevVal(lvl, "nudge-eap")) continue; // base 와 동일 → 스킵
      ensureEffect("Elevation/" + brandLabel(mode) + "/E" + lvl).effects = eff;
    }
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
      row.appendChild(txt(name, 11, "Regular", INK, NAMEW)); // 슬래시 형(= Figma 변수명) 통일
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

  // 공용 dimension 표(Semantic 표와 100% 동일 스타일) + 옵션 시각 바.
  const dgroups = {};
  for (const name of Object.keys(TOKENS.dimensions.variables))
    (dgroups[name.split("/")[0]] = dgroups[name.split("/")[0]] || []).push(name);
  const spacer1 = (h) => {
    const f = figma.createFrame();
    f.resize(1, h);
    f.fills = [];
    return f;
  };
  function dimTable(parent, cats, withBar) {
    const head = auto("colhead", "HORIZONTAL", 0, {
      align: "CENTER",
      fill: BAR,
      radius: 6,
      padV: 9,
      padH: 14,
    });
    head.appendChild(txt("Token", 11, "Bold", INK, NAMEW - 14));
    for (const b of BRANDS) head.appendChild(txt(brandLabel(b), 11, "Bold", INK, COLW, "LEFT"));
    parent.appendChild(head);
    for (const g of cats) {
      if (!dgroups[g]) continue;
      const group = auto(g, "VERTICAL", 0);
      group.appendChild(spacer1(18));
      accentTitle(group, catName(g), `${dgroups[g].length} tokens`);
      group.appendChild(spacer1(6));
      for (const name of dgroups[g]) {
        const vbm = TOKENS.dimensions.variables[name].valuesByMode;
        const baseV = (vbm["nudge-eap"] || {}).value;
        const row = auto(name, "HORIZONTAL", 0, { align: "CENTER", padV: 7 });
        row.appendChild(txt(name, 11, "Regular", INK, NAMEW));
        for (const b of BRANDS) {
          const cell = auto(b, "HORIZONTAL", 7, {
            align: "CENTER",
            primary: "FIXED",
            counter: "FIXED",
          });
          cell.resize(COLW, 26);
          const v = (vbm[b] || {}).value;
          if (v == null) cell.appendChild(txt("—", 10, "Regular", LINE));
          else {
            const d = baseV != null && v !== baseV;
            cell.appendChild(txt(String(v), 12, d ? "Bold" : "Regular", d ? ACCENT : INK));
          }
          row.appendChild(cell);
        }
        // 시각 예시 (base 값) — radius/shape = 둥근 사각, border-width/stroke = 테두리 박스,
        // 나머지(spacing/gap/inset/size) = 길이 바. (넛지EAP Library 171:7455 스타일)
        if (withBar && typeof baseV === "number" && baseV >= 0) {
          const cat = name.split("/")[0];
          if (cat === "radius" || cat === "shape") {
            const sq = figma.createRectangle();
            sq.resize(44, 44);
            sq.fills = [{ type: "SOLID", color: WHITE }];
            sq.strokes = [{ type: "SOLID", color: { r: 0.7, g: 0.72, b: 0.78 } }];
            sq.strokeWeight = 1.5;
            sq.cornerRadius = Math.min(baseV, 22); // 22=44/2 → full 은 완전 둥근 변
            row.appendChild(sq);
          } else if (cat === "border-width" || cat === "stroke") {
            const sq = figma.createRectangle();
            sq.resize(44, 44);
            sq.fills = [{ type: "SOLID", color: WHITE }];
            sq.cornerRadius = 6;
            if (baseV > 0) {
              sq.strokes = [{ type: "SOLID", color: INK }];
              sq.strokeWeight = Math.min(baseV, 8);
            }
            row.appendChild(sq);
          } else {
            const bar = figma.createRectangle();
            bar.resize(Math.max(2, Math.min(baseV, 280)), 14);
            bar.cornerRadius = 2;
            bar.fills = [{ type: "SOLID", color: ACCENT }];
            row.appendChild(bar);
          }
        }
        group.appendChild(row);
      }
      parent.appendChild(group);
    }
  }

  // ── 페이지 2: Dimension (지오메트리) ──
  const TYPO_CATS = ["font-size", "line-height", "letter-spacing"];
  const GEO_CATS = Object.keys(dgroups).filter((g) => !TYPO_CATS.includes(g));
  const dimPage = await getPage("🎨 Token Guide — Dimension");
  const dimRoot = auto("Dimension", "VERTICAL", 28, { pad: 56, fill: WHITE });
  const dh = auto("hd", "VERTICAL", 4);
  dh.appendChild(rect(40, 4, ACCENT));
  dh.appendChild(txt("Dimension", 28, "Bold", INK));
  dh.appendChild(
    txt(
      "FLOAT 변수(spacing·gap·inset·radius·stroke·size) — auto-layout gap/padding·corner·stroke 에 바인딩. brand=mode.",
      12,
      "Regular",
      SUB,
    ),
  );
  dimRoot.appendChild(dh);
  dimTable(dimRoot, GEO_CATS, true);
  dimPage.appendChild(dimRoot);

  // ── 페이지 3: Typography ──
  const typoPage = await getPage("🎨 Token Guide — Typography");
  const typoRoot = auto("Typography", "VERTICAL", 28, { pad: 56, fill: WHITE });
  const th = auto("hd", "VERTICAL", 4);
  th.appendChild(rect(40, 4, ACCENT));
  th.appendChild(txt("Typography", 28, "Bold", INK));
  th.appendChild(
    txt(
      "Text Style(typeScale) — fontSize/lineHeight/letterSpacing 를 FLOAT 변수에 바인딩(brand=mode). 샘플은 바인딩된 변수값으로 렌더.",
      12,
      "Regular",
      SUB,
    ),
  );
  typoRoot.appendChild(th);

  // Text Style 샘플 — 모드별 렌더. 각 브랜드의 Dimension 모드를 샘플 프레임에 명시 적용해
  // (setExplicitVariableModeForCollection) 바인딩된 fontSize/lineHeight 가 그 브랜드 값으로
  // 풀리게 한다 → 타이포가 브랜드별로 갈리면 자동으로 크기 차이가 보인다(현재 전 브랜드 동일).
  const tsSec = auto("Text Styles", "VERTICAL", 0);
  accentTitle(tsSec, "Text Styles", `${createdStyles.length} · 변수 바인딩 · 모드별 샘플`);
  tsSec.appendChild(spacer1(8));
  for (const cs of createdStyles) {
    const block = auto(cs.kk, "VERTICAL", 6, { padV: 8 });
    // 헤더 — 스타일명 + base(nudge-eap) 기준 크기
    const hdr = auto("h", "HORIZONTAL", 12, { align: "CENTER" });
    hdr.appendChild(txt(cs.nm, 12, "Bold", INK, 150));
    const fsd = TOKENS.dimensions.variables["font-size/" + cs.kk];
    const lhd = TOKENS.dimensions.variables["line-height/" + cs.kk];
    const fsv = fsd ? (fsd.valuesByMode["nudge-eap"] || {}).value : null;
    const lhv = lhd ? (lhd.valuesByMode["nudge-eap"] || {}).value : null;
    hdr.appendChild(
      txt(`${fsv == null ? "—" : fsv}/${lhv == null ? "—" : lhv}`, 10, "Regular", FAINT, 70),
    );
    block.appendChild(hdr);
    // 모드별 샘플 — 브랜드마다 그 모드의 바인딩 값으로 렌더(짧은 글리프로 폭 절약).
    const samples = auto("samples", "HORIZONTAL", 20, { align: "MIN" });
    for (const b of BRANDS) {
      const col = auto(b, "VERTICAL", 3, { align: "MIN" });
      col.appendChild(txt(brandLabel(b), 9, "Regular", FAINT));
      const sf = figma.createFrame();
      sf.name = b;
      sf.layoutMode = "HORIZONTAL";
      sf.primaryAxisSizingMode = "AUTO";
      sf.counterAxisSizingMode = "AUTO";
      sf.fills = [];
      sf.clipsContent = false;
      try {
        sf.setExplicitVariableModeForCollection(dimColl, dModeIds[b]);
      } catch (e) {} // eslint-disable-line no-empty
      const sample = txt("Aa 가", 16, "Regular", INK);
      try {
        await sample.setTextStyleIdAsync(cs.st.id);
      } catch (e) {} // eslint-disable-line no-empty
      sf.appendChild(sample);
      col.appendChild(sf);
      samples.appendChild(col);
    }
    block.appendChild(samples);
    tsSec.appendChild(block);
  }
  typoRoot.appendChild(tsSec);
  typoRoot.appendChild(spacer1(20));
  dimTable(typoRoot, TYPO_CATS, false); // font-size/line-height/letter-spacing 변수 표
  typoPage.appendChild(typoRoot);

  // ── 페이지 4: Elevation ──
  const elevPage = await getPage("🎨 Token Guide — Elevation");
  const elevRoot = auto("Elevation", "VERTICAL", 28, { pad: 56, fill: WHITE });
  const eh = auto("hd", "VERTICAL", 4);
  eh.appendChild(rect(40, 4, ACCENT));
  eh.appendChild(txt("Elevation", 28, "Bold", INK));
  eh.appendChild(
    txt(
      "그림자 단계 — box-shadow → Effect Style(Elevation/{브랜드}/E{n}). 열 = 브랜드 모드 · 카드에 실제 그림자 적용.",
      12,
      "Regular",
      SUB,
    ),
  );
  elevRoot.appendChild(eh);
  const ehead = auto("colhead", "HORIZONTAL", 0, {
    align: "CENTER",
    fill: BAR,
    radius: 6,
    padV: 9,
    padH: 14,
  });
  ehead.appendChild(txt("Level", 11, "Bold", INK, NAMEW - 14));
  for (const b of BRANDS) ehead.appendChild(txt(brandLabel(b), 11, "Bold", INK, COLW, "LEFT"));
  elevRoot.appendChild(ehead);
  for (const lvl of elevLevels) {
    const row = auto("E" + lvl, "HORIZONTAL", 0, { align: "CENTER", padV: 12 });
    row.appendChild(txt("Elevation/" + lvl, 12, "Bold", INK, NAMEW));
    for (const b of BRANDS) {
      const cellWrap = auto(b, "VERTICAL", 5, {
        align: "MIN",
        primary: "FIXED",
        counter: "FIXED",
      });
      cellWrap.resize(COLW, 64);
      const val = elevVal(lvl, b);
      const eff = parseShadows(val);
      const card = figma.createRectangle();
      card.resize(72, 36);
      card.cornerRadius = 8;
      card.fills = [{ type: "SOLID", color: WHITE }];
      card.strokes = [{ type: "SOLID", color: LINE }];
      card.strokeWeight = 1;
      if (eff.length) card.effects = eff;
      cellWrap.appendChild(card);
      let label = "—";
      if (eff.length) {
        const e0 = eff[0];
        label =
          `y${e0.offset.y}·b${e0.radius}·${Math.round(e0.color.a * 100)}%` +
          (eff.length > 1 ? " +" : "");
      }
      cellWrap.appendChild(txt(label, 8, "Regular", FAINT, COLW));
      row.appendChild(cellWrap);
    }
    elevRoot.appendChild(row);
  }
  elevPage.appendChild(elevRoot);

  await figma.setCurrentPageAsync(colorPage);
}

main()
  .then(() =>
    figma.closePlugin(
      "✓ 변수 + Text/Effect Style + 가이드 4페이지(Color·Dimension·Typography·Elevation) 완료",
    ),
  )
  .catch((e) => figma.closePlugin("✗ 오류: " + (e && e.message ? e.message : e)));
