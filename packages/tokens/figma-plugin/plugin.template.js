/**
 * 생성물 — 편집 금지. 원본 = figma-plugin/plugin.template.js + dist/next/figma-variables.json,
 * 빌드 = `node scripts/build-figma-plugin.cjs` (→ figma-plugin/code.js).
 *
 * Nudge Tokens → Figma 플러그인 (코드 SSOT → Figma 변수 + 바인딩된 비주얼 가이드).
 *   1) Primitive/Core + Primitive/{Brand} 컬렉션 + Semantic(brand=mode) 컬렉션을 생성/업서트.
 *      semantic 값은 primitive 변수로 VARIABLE_ALIAS, confirmCta self-ref 는 semantic alias.
 *   2) "🎨 Token Guide" 페이지: 손작업 컬러가이드 포맷 미러 —
 *      Atomic = 패밀리 행(이름 + stop·hex 라벨 램프), Semantic = Token×브랜드 열 표(카테고리 그룹).
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

// css var(--semantic-…) ↔ figma 변수 이름
const cssToSem = {};
for (const n of Object.keys(TOKENS.semantic.variables))
  cssToSem["--semantic-" + n.replace(/\//g, "-")] = n;
const collKeyHasAlias = (key, alias) => TOKENS.primitives[key] && TOKENS.primitives[key][alias];
// semantic 토큰의 brand mode 별 해석 hex (alias→primitive, self-ref→재귀, 리터럴→그대로). 표시용.
function resolveHex(name, mode, seen) {
  seen = seen || {};
  if (seen[name + "|" + mode]) return null;
  seen[name + "|" + mode] = 1;
  const def = TOKENS.semantic.variables[name];
  if (!def) return null;
  const mv = def.valuesByMode[mode];
  if (!mv) return null;
  if (mv.alias) {
    const bk = collKeyForMode(mode);
    return (
      (mode !== "nudge-eap" && collKeyHasAlias(bk, mv.alias)
        ? TOKENS.primitives[bk]
        : TOKENS.primitives.core)[mv.alias] || null
    );
  }
  const v = mv.value;
  const ref = /^var\((--semantic-[a-z0-9-]+)\)$/.exec(v);
  if (ref) return cssToSem[ref[1]] ? resolveHex(cssToSem[ref[1]], mode, seen) : null;
  return v;
}

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
  const primVars = {};
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

  const resolvePrim = (alias, mode) => {
    const bk = collKeyForMode(mode);
    if (mode !== "nudge-eap" && collKeyHasAlias(bk, alias)) return primVars[bk][alias];
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

  // ── 비주얼 가이드 (손작업 컬러가이드 포맷 미러) ──────────
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const INK = { r: 0.1, g: 0.1, b: 0.12 };
  const SUB = { r: 0.45, g: 0.46, b: 0.5 };
  const FAINT = { r: 0.62, g: 0.63, b: 0.67 };
  const LINE = { r: 0.9, g: 0.9, b: 0.93 };
  const BAR = { r: 0.96, g: 0.965, b: 0.975 };
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
    t.lineHeight = { value: size * 1.35, unit: "PIXELS" };
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
    f.resize(w, Math.max(1, h || 1));
    f.fills = [];
    return f;
  };
  const swatch = (variable, w, h) => {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.cornerRadius = 4;
    let paint = { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.87 } };
    try {
      paint = figma.variables.setBoundVariableForPaint(paint, "color", variable);
    } catch (e) {} // eslint-disable-line no-empty
    r.fills = [paint];
    r.strokes = [{ type: "SOLID", color: LINE }];
    r.strokeWeight = 1;
    return r;
  };

  const PAGE_NAME = "🎨 Token Guide";
  let page = figma.root.children.find((p) => p.name === PAGE_NAME);
  if (page) {
    await page.loadAsync();
    for (const child of [...page.children]) child.remove();
  } else {
    page = figma.createPage();
    page.name = PAGE_NAME;
  }

  // ── Atomic 프레임 ──
  const SW = 70; // 스와치 폭
  const atomic = auto("Color — Atomic", "VERTICAL", 28, { pad: 56, fill: WHITE });
  const aHead = auto("h", "VERTICAL", 4);
  aHead.appendChild(txt("Color — Atomic", 28, "Bold", INK));
  aHead.appendChild(
    txt("Primitive 팔레트 — 코드 SSOT 자동 생성 · 스와치 = 변수 바인딩", 13, "Regular", SUB),
  );
  atomic.appendChild(aHead);

  const META = TOKENS.meta || {};
  for (const key of primKeys) {
    const collHead = auto("ch", "VERTICAL", 2);
    collHead.appendChild(txt(collTitle(key).replace("Primitive/", ""), 16, "Bold", INK));
    if (META.collections && META.collections[key])
      collHead.appendChild(txt(META.collections[key], 11, "Regular", SUB));
    atomic.appendChild(collHead);
    const fams = {};
    for (const name of Object.keys(TOKENS.primitives[key])) {
      const i = name.indexOf("/");
      const fam = i < 0 ? name : name.slice(0, i);
      const stop = i < 0 ? "" : name.slice(i + 1);
      (fams[fam] = fams[fam] || []).push({ name, stop, hex: TOKENS.primitives[key][name] });
    }
    for (const fam of Object.keys(fams)) {
      const row = auto(fam, "HORIZONTAL", 20, { align: "MIN" });
      const famLabel = auto("label", "VERTICAL", 2, { align: "MIN" });
      famLabel.appendChild(txt(fam, 13, "Bold", INK, 150));
      if (META.families && META.families[fam] && META.families[fam].desc)
        famLabel.appendChild(txt(META.families[fam].desc, 10, "Regular", SUB, 150));
      row.appendChild(famLabel);
      const ramp = auto("ramp", "HORIZONTAL", 6);
      for (const s of fams[fam]) {
        const cell = auto(s.name, "VERTICAL", 4, { align: "MIN" });
        cell.appendChild(txt(s.stop, 10, "Medium", SUB, SW));
        cell.appendChild(swatch(primVars[key][s.name], SW, 52));
        cell.appendChild(txt(String(s.hex).toUpperCase(), 8, "Regular", FAINT, SW));
        ramp.appendChild(cell);
      }
      row.appendChild(ramp);
      atomic.appendChild(row);
    }
  }
  page.appendChild(atomic);

  // ── Semantic 표 ──
  const NAMEW = 300;
  const COLW = 118;
  const semantic = auto("Color — Semantic", "VERTICAL", 0, { pad: 56, fill: WHITE });
  const sHead = auto("h", "VERTICAL", 4);
  sHead.appendChild(txt("Color — Semantic", 28, "Bold", INK));
  sHead.appendChild(
    txt(
      "열 = 브랜드 모드 · 같은 role 이 프로젝트별로 어떻게 풀리는지 (셀 = 변수 바인딩)",
      13,
      "Regular",
      SUB,
    ),
  );
  semantic.appendChild(sHead);
  semantic.appendChild(spacer(1, 20));

  // 헤더바
  const headBar = auto("Token", "HORIZONTAL", 0, {
    align: "CENTER",
    fill: BAR,
    radius: 8,
    padV: 12,
    padH: 16,
  });
  headBar.appendChild(txt("Token", 12, "Bold", INK, NAMEW));
  for (const b of BRANDS) headBar.appendChild(txt(b, 12, "Bold", INK, COLW, "CENTER"));
  semantic.appendChild(headBar);
  semantic.appendChild(spacer(1, 4));

  const cats = {};
  for (const name of Object.keys(TOKENS.semantic.variables)) {
    const cat = name.split("/")[0];
    (cats[cat] = cats[cat] || []).push(name);
  }
  const catName = (c) => c.replace(/-/g, " ").replace(/(^|\s)\w/g, (m) => m.toUpperCase());
  for (const cat of Object.keys(cats)) {
    const group = auto(cat, "VERTICAL", 0);
    group.appendChild(spacer(1, 16));
    const catHead = auto("ch", "VERTICAL", 1);
    catHead.appendChild(txt(`${catName(cat)}  ·  ${cats[cat].length} tokens`, 13, "Bold", INK));
    if (META.semanticCategories && META.semanticCategories[cat])
      catHead.appendChild(txt(META.semanticCategories[cat], 10, "Regular", SUB));
    group.appendChild(catHead);
    group.appendChild(spacer(1, 6));
    for (const name of cats[cat]) {
      const tokenName = "semantic-" + name.replace(/\//g, "-");
      const row = auto(name, "HORIZONTAL", 0, { align: "CENTER", padV: 7 });
      row.appendChild(txt(tokenName, 11, "Regular", INK, NAMEW));
      for (const b of BRANDS) {
        const cell = auto(b, "HORIZONTAL", 0, { primary: "FIXED", counter: "FIXED" });
        cell.resize(COLW, 34);
        cell.appendChild(
          (() => {
            const inner = auto("v", "VERTICAL", 2, { align: "MIN" });
            const hex = resolveHex(name, b);
            if (hex) {
              const cf = figma.createFrame(); // mode-override → 그 브랜드 색
              cf.name = b;
              cf.resize(28, 20);
              cf.fills = [];
              cf.clipsContent = false;
              try {
                cf.setExplicitVariableModeForCollection(semColl, modeIds[b]);
              } catch (e) {} // eslint-disable-line no-empty
              cf.appendChild(swatch(semVars[name], 28, 20));
              inner.appendChild(cf);
              inner.appendChild(txt(String(hex).toUpperCase(), 8, "Regular", FAINT));
            } else {
              inner.appendChild(txt("—", 10, "Regular", LINE));
            }
            return inner;
          })(),
        );
        row.appendChild(cell);
      }
      group.appendChild(row);
    }
    semantic.appendChild(group);
  }

  // Atomic 옆에 Semantic 배치
  semantic.x = atomic.x + atomic.width + 120;
  page.appendChild(semantic);

  await figma.setCurrentPageAsync(page);
}

main()
  .then(() => figma.closePlugin("✓ 변수 + Token Guide 생성 완료"))
  .catch((e) => figma.closePlugin("✗ 오류: " + (e && e.message ? e.message : e)));
