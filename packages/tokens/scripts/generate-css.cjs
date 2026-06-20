/**
 * Generates CSS custom properties from compiled token JS files.
 * Run after tsc: node scripts/generate-css.cjs
 *
 * Outputs:
 *   dist/tokens.css   — NudgeEAP 기본 토큰
 *   dist/trost.css    — Trost 프로젝트 오버라이드 토큰
 *   dist/geniet.css   — Geniet 프로젝트 오버라이드 토큰
 *   dist/cashwalk-biz.css — CashwalkBiz 프로젝트 오버라이드 토큰
 */
const fs = require("fs");
const path = require("path");

const { colors } = require("../dist/colors");
const { isRef } = require("../dist/ref.js");
const { nudgeEapSemantic } = require("../dist/projects/nudge-eap.semantic.js");

/**
 * reference-carrying 토큰(`ref("color.{family}.{stop}")`) 해석용 레지스트리.
 * family = **emit 되는 var family** = 브랜드 theme.palette 의 key(`mint`, import 명 `genietMint` 아님).
 * 뒤 인자가 앞을 덮는다(브랜드 팔레트가 base 동명 family 를 override — geniet `blue` 등).
 */
function buildColorRegistry(...palettes) {
  const reg = {};
  for (const palette of palettes) {
    for (const [family, scale] of Object.entries(palette)) {
      if (!scale || typeof scale !== "object") continue;
      for (const [stop, val] of Object.entries(scale)) {
        if (typeof val === "string") reg[`color.${family}.${stop}`] = val;
      }
    }
  }
  return reg;
}
/** 기존 CSS 는 값-동결 위해 ref 를 emit 시점에 hex 로 푼다(브랜드는 자기 팔레트로 해석). */
function makeResolveRef(registry) {
  return (r) => {
    const v = registry[r.$ref];
    if (v == null) throw new Error(`unknown color ref: ${r.$ref}`);
    return v;
  };
}
const resolveBaseRef = makeResolveRef(buildColorRegistry(colors));
const {
  spacing,
  gap,
  gapTitle,
  inset,
  radius,
  shape,
  borderWidth,
  stroke,
  sizing,
  grid,
} = require("../dist/spacing");
const { fontFamily, fontWeight, typeScale } = require("../dist/typography");
const { shadow, zIndex } = require("../dist/elevation");

// ─── Helper ─────────────────────────────────────────────

/** atomic palette → `--color-{group}-{stop}` */
function flattenPaletteVars(obj, prefix, lines) {
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "string") {
      lines.push(`  --color-${varName}: ${value};`);
    } else if (typeof value === "object" && value !== null) {
      flattenPaletteVars(value, varName, lines);
    }
  }
}

/**
 * role-based 트리(`nudgeEapSemantic` / `trostSemantic` 등) → `--semantic-{group}-{role}-{variant}`
 * (camelCase → kebab-case). `resolve` = ref → hex 해석기(base 는 base 팔레트, 브랜드는 base+자기팔레트).
 */
function flattenRoleSemanticVars(obj, prefix, lines, resolve) {
  for (const [key, value] of Object.entries(obj)) {
    const part = camelToKebab(key);
    const varName = prefix ? `${prefix}-${part}` : part;
    if (isRef(value)) {
      lines.push(`  --semantic-${varName}: ${resolve(value)};`);
    } else if (typeof value === "string") {
      lines.push(`  --semantic-${varName}: ${value};`);
    } else if (typeof value === "object" && value !== null) {
      flattenRoleSemanticVars(value, varName, lines, resolve);
    }
  }
}

function flattenSizing(obj, prefix, lines) {
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "number") {
      lines.push(`  --size-${varName}: ${value}px;`);
    } else {
      flattenSizing(value, varName, lines);
    }
  }
}

function camelToKebab(s) {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * typeScale 키(camelCase + 숫자)를 Figma 가이드의 kebab 형태로 변환.
 *   body1 → body-1 / display3 → display-3 / headline1 → headline-1 / label → label
 */
function typeScaleKeyToFigma(s) {
  return s.replace(/([a-z])(\d)/g, "$1-$2");
}

/**
 * fontFamily 키를 Figma 가이드 이름으로 매핑.
 *   web → default (Figma --font-family-default 와 정합)
 *   system → system
 */
function fontFamilyKeyToFigma(key) {
  if (key === "web") return "default";
  return key;
}

// ─── NudgeEAP tokens.css ────────────────────────────────

const { nudgeEapTheme } = require("../dist/projects/nudge-eap");

function generateBaseTokens() {
  const lines = [":root {"];

  // Atomic palette → `--color-{group}-{stop}`
  flattenPaletteVars(colors, "", lines);

  // Semantic — 1:1 Figma SemanticColorGuide (171:6675) mirror.
  // BG / Text / Button{BG,Text,Border} / Input / Icon / Border / Fill +
  // DS extension (bg-disabled). emit: `--semantic-{group}-{role}-{variant}` (kebab).
  lines.push("");
  lines.push("  /* ── Semantic (role-based, Figma SemanticColorGuide 171:6675) ── */");
  flattenRoleSemanticVars(nudgeEapSemantic, "", lines, resolveBaseRef);

  // Spacing — Primitive Scale (Figma · SpacingGuide, 4pt grid)
  lines.push("");
  lines.push("  /* ── Spacing (Primitive, Figma · SpacingGuide) ── */");
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --spacing-${key}: ${value}px;`);
  }

  // Gap — Semantic (Figma · SpacingGuide / Gap). emit: --semantic-gap-{key}
  // (옛 deprecated alias --gap-{key} 는 P3 에서 제거 — 소비처 0. 신규 코드는 --semantic-gap-*)
  lines.push("");
  lines.push("  /* ── Semantic / Gap (Figma · SpacingGuide / Gap) ── */");
  for (const [key, value] of Object.entries(gap)) {
    lines.push(`  --semantic-gap-${key}: ${value}px;`);
  }

  // Gap/Title — 헤딩 ↔ 서브타이틀 간격 (Figma TitleGapGuide 859:5614).
  // emit: --semantic-gap-title-{key}. (옛 deprecated alias --gap-title-{key} 는 P3 에서 제거 — 소비처 0)
  lines.push("");
  lines.push("  /* ── Semantic / Gap-Title (Figma · TitleGapGuide 859:5614) ── */");
  for (const [key, value] of Object.entries(gapTitle)) {
    lines.push(`  --semantic-gap-title-${key}: ${value}px;`);
  }

  // Inset — Semantic (Figma · SpacingGuide / Inset). 컨테이너 내부 여백.
  // emit: --semantic-inset-{key}. (옛 deprecated alias --inset-{key} 는 P3 에서 제거 — 소비처 0)
  lines.push("");
  lines.push("  /* ── Semantic / Inset (Figma · SpacingGuide / Inset) ── */");
  for (const [key, value] of Object.entries(inset)) {
    lines.push(`  --semantic-inset-${key}: ${value}px;`);
  }

  // Grid — 거터·마진 (Figma · SpacingGuide / Grid)
  lines.push("");
  lines.push("  /* ── Grid (Figma · SpacingGuide / Grid) ── */");
  lines.push(`  --grid-gutter-mobile: ${grid.mobile.gutter}px;`);
  lines.push(`  --grid-gutter-pc: ${grid.desktop.gutter}px;`);
  lines.push(`  --grid-margin-mobile: ${grid.mobile.margin}px;`);
  lines.push(`  --grid-margin-pc: ${grid.desktop.margin}px;`);
  lines.push(`  --grid-margin-pc-min: ${grid.desktop.minMargin}px;`);
  lines.push(`  --grid-content-mobile: ${grid.mobile.contentWidth}px;`);
  lines.push(`  --grid-content-pc: ${grid.desktop.contentWidth}px;`);

  // Radius — Policy scale
  lines.push("");
  lines.push("  /* ── Radius (Policy Scale) ── */");
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --radius-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
  }

  // Shape — Semantic policy alias
  lines.push("");
  lines.push("  /* ── Shape (Semantic Policy Alias) ── */");
  for (const [key, value] of Object.entries(shape)) {
    lines.push(`  --shape-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
  }

  // Border Width — Primitive (Figma · BorderGuide)
  lines.push("");
  lines.push("  /* ── Border Width (Primitive, Figma · BorderGuide) ── */");
  for (const [key, value] of Object.entries(borderWidth)) {
    lines.push(`  --border-${key}: ${value}px;`);
  }

  // Stroke — Semantic (Figma · BorderGuide / Semantic)
  lines.push("");
  lines.push("  /* ── Stroke (Semantic, Figma · BorderGuide / Semantic) ── */");
  for (const [key, value] of Object.entries(stroke)) {
    lines.push(`  --stroke-${key}: ${value}px;`);
  }

  // Sizing
  lines.push("");
  flattenSizing(sizing, "", lines);

  // Font Family — Figma 가이드 명명(--font-family-default / -system)에 맞춤
  lines.push("");
  for (const [key, value] of Object.entries(fontFamily)) {
    lines.push(`  --font-family-${fontFamilyKeyToFigma(key)}: ${value};`);
  }
  // `--font-web` — 프로젝트 셸 컴포넌트(runmile AppBar/Footer/WebHeader 등)가 읽는 alias.
  // var() 참조라 프로젝트 css 가 --font-family-default 를 override 하면 함께 따라온다.
  lines.push("  --font-web: var(--font-family-default);");

  // Font Weight
  lines.push("");
  for (const [key, value] of Object.entries(fontWeight)) {
    lines.push(`  --font-weight-${key}: ${value};`);
  }

  // Type Scale — Figma 가이드 변수명(--font-size-body-1 / --line-height-body-1)에 정합.
  // fontWeight 는 스케일에 묶지 않고(스케일당 default 없음), --font-weight-* 토큰을
  // 사용처에서 직접 조합한다.
  //
  // size+lineHeight 묶음 토큰 `--font-{scale}`(= `{size}px/{lineHeight}px`)도 함께 emit.
  // `font` shorthand 한 칸에 size/line-height 를 넣고 weight·family 는 분리 토큰으로
  // 조합하는 용도 — `font: var(--font-weight-medium) var(--font-body-2) var(--font-family-default)`.
  lines.push("");
  for (const [key, value] of Object.entries(typeScale)) {
    const figmaKey = typeScaleKeyToFigma(key);
    lines.push(`  --font-size-${figmaKey}: ${value.fontSize}px;`);
    lines.push(`  --line-height-${figmaKey}: ${value.lineHeight}px;`);
    lines.push(`  --font-${figmaKey}: ${value.fontSize}px/${value.lineHeight}px;`);
  }

  // Input Typography 표준 (Figma 4247:1964) — 입력 패밀리(Label·Input Value·Placeholder·
  // Helper·Error) 타이포를 프로젝트 무관하게 통일하는 시멘틱 토큰.
  //   · size+lineHeight 는 한 토큰(`--semantic-input-typography-{role}` = `{size}px/{lh}px`)으로 묶고,
  //   · weight 는 분리 토큰(`--semantic-input-typography-{role}-weight` → --font-weight-*)으로 적용한다.
  //   · placeholder=value(타이포 동일, 색만 muted) / error=helper(타이포 동일, 색만 status-error)
  //     라 타이포 역할은 label·value·helper 3종만 둔다.
  //   · 값은 base typeScale 에서 파생하되 **literal** 로 박아 프로젝트 typeScale override 의 영향을
  //     받지 않는다(= 프로젝트 무관 보장). 프로젝트 css 는 이 토큰을 재-emit 하지 않는다.
  const INPUT_TYPOGRAPHY = {
    label: { scale: typeScale.caption1, weight: "medium" }, // 13/18 · Medium
    value: { scale: typeScale.body2, weight: "regular" }, // 15/22 · Regular (placeholder 동일)
    helper: { scale: typeScale.caption1, weight: "regular" }, // 13/18 · Regular (error 동일)
  };
  lines.push("");
  lines.push("  /* ── Semantic / Input Typography (Figma 4247:1964 · 프로젝트 무관) ── */");
  for (const [role, { scale, weight }] of Object.entries(INPUT_TYPOGRAPHY)) {
    lines.push(`  --semantic-input-typography-${role}: ${scale.fontSize}px/${scale.lineHeight}px;`);
    lines.push(`  --semantic-input-typography-${role}-weight: var(--font-weight-${weight});`);
  }

  // Shadow — Figma · ElevationGuide(556:2). E0 ~ E3 → --shadow-0 ~ --shadow-3
  lines.push("");
  lines.push("  /* ── Shadow (Figma · ElevationGuide 556:2) ── */");
  for (const [key, value] of Object.entries(shadow)) {
    lines.push(`  --shadow-${key}: ${value};`);
  }

  // Z-Index
  lines.push("");
  lines.push("  /* ── Z-Index ── */");
  for (const [key, value] of Object.entries(zIndex)) {
    lines.push(`  --z-${key}: ${value};`);
  }

  // Component slots — `--nds-{component}-{prop}` (프로젝트 emission 과 동일 규칙).
  // base 가 :root 로 기본값을 깔아야 컴포넌트 요소-레벨 정의(프로젝트 override 마스킹) 없이
  // var(--nds-…, fallback) cascade 가 성립한다 (chart/rating 등).
  if (nudgeEapTheme.components) {
    const componentBlocks = [];
    for (const [component, props] of Object.entries(nudgeEapTheme.components)) {
      if (!props) continue;
      for (const [prop, value] of Object.entries(props)) {
        let cssValue;
        if (typeof value === "number") cssValue = `${value}px`;
        else if (typeof value === "string") cssValue = value;
        else continue;
        componentBlocks.push(`  --nds-${component}-${camelToKebab(prop)}: ${cssValue};`);
      }
    }
    if (componentBlocks.length > 0) {
      lines.push("");
      lines.push("  /* ── Components (base defaults) ── */");
      lines.push(...componentBlocks);
    }
  }

  lines.push("}");
  return lines.join("\n") + "\n";
}

// ─── Project override CSS ────────────────────────────────

function generateProjectTokens({ theme, title, cssImport }) {
  const pascalTitle = title.charAt(0).toUpperCase() + title.slice(1);

  const lines = [
    "/**",
    ` * ${pascalTitle} Project Tokens`,
    " * NudgeEAP tokens.css 이후에 import하면 프로젝트 토큰이 오버라이드됩니다.",
    " *",
    " * Usage:",
    " *   @import '@nudge-design/tokens/css';",
    ` *   @import '@nudge-design/tokens/css/${cssImport}';`,
    " */",
    ":root {",
  ];

  const { palette, semantic, typography, spacing: spacingOverrides, elevation, components } = theme;

  // 브랜드 ref 해석기 — 자기 팔레트(theme.palette, family=key)가 base 동명 family 를 덮는다.
  const resolveProjectRef = makeResolveRef(buildColorRegistry(colors, palette));

  // Palette colors
  lines.push("  /* ── Palette ── */");
  for (const [family, scale] of Object.entries(palette)) {
    for (const [stop, value] of Object.entries(scale)) {
      lines.push(`  --color-${family}-${stop}: ${value};`);
    }
  }

  // Semantic colors — Figma role-based 트리 Partial 만 override
  lines.push("");
  lines.push("  /* ── Semantic (Figma role-based) ── */");
  flattenRoleSemanticVars(semantic, "", lines, resolveProjectRef);

  // Typography
  if (typography) {
    lines.push("");
    lines.push("  /* ── Typography ── */");
    if (typography.fontFamily) {
      for (const [key, value] of Object.entries(typography.fontFamily)) {
        lines.push(`  --font-family-${fontFamilyKeyToFigma(key)}: ${value};`);
      }
    }
    if (typography.typeScale) {
      lines.push("");
      for (const [key, value] of Object.entries(typography.typeScale)) {
        const figmaKey = typeScaleKeyToFigma(key);
        lines.push(`  --font-size-${figmaKey}: ${value.fontSize}px;`);
        lines.push(`  --line-height-${figmaKey}: ${value.lineHeight}px;`);
        // size+lineHeight 묶음 토큰도 함께 override (프로젝트가 typeScale 을 덮으면 같이 따라감).
        lines.push(`  --font-${figmaKey}: ${value.fontSize}px/${value.lineHeight}px;`);
      }
    }
  }

  // Atomic spacing scale — `--spacing-{key}`
  if (spacingOverrides && spacingOverrides.spacing) {
    lines.push("");
    lines.push("  /* ── Spacing ── */");
    for (const [key, value] of Object.entries(spacingOverrides.spacing)) {
      lines.push(`  --spacing-${key}: ${value}px;`);
    }
  }

  // Gap — `--semantic-gap-{key}` (옛 --gap-{key} 는 base alias 가 그대로 cascade)
  if (spacingOverrides && spacingOverrides.gap) {
    lines.push("");
    lines.push("  /* ── Semantic / Gap ── */");
    for (const [key, value] of Object.entries(spacingOverrides.gap)) {
      lines.push(`  --semantic-gap-${key}: ${value}px;`);
    }
  }

  // Gap/Title — `--semantic-gap-title-{key}`
  if (spacingOverrides && spacingOverrides.gapTitle) {
    lines.push("");
    lines.push("  /* ── Semantic / Gap-Title ── */");
    for (const [key, value] of Object.entries(spacingOverrides.gapTitle)) {
      lines.push(`  --semantic-gap-title-${key}: ${value}px;`);
    }
  }

  // Inset — `--semantic-inset-{key}`
  if (spacingOverrides && spacingOverrides.inset) {
    lines.push("");
    lines.push("  /* ── Semantic / Inset ── */");
    for (const [key, value] of Object.entries(spacingOverrides.inset)) {
      lines.push(`  --semantic-inset-${key}: ${value}px;`);
    }
  }

  // Radius
  if (spacingOverrides && spacingOverrides.radius) {
    lines.push("");
    lines.push("  /* ── Radius ── */");
    for (const [key, value] of Object.entries(spacingOverrides.radius)) {
      lines.push(`  --radius-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
    }
  }

  // Shape — `--shape-{key}`
  if (spacingOverrides && spacingOverrides.shape) {
    lines.push("");
    lines.push("  /* ── Shape ── */");
    for (const [key, value] of Object.entries(spacingOverrides.shape)) {
      lines.push(`  --shape-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
    }
  }

  // Border Width — `--border-{key}`
  if (spacingOverrides && spacingOverrides.borderWidth) {
    lines.push("");
    lines.push("  /* ── Border Width ── */");
    for (const [key, value] of Object.entries(spacingOverrides.borderWidth)) {
      lines.push(`  --border-${key}: ${value}px;`);
    }
  }

  // Stroke — `--stroke-{key}`
  if (spacingOverrides && spacingOverrides.stroke) {
    lines.push("");
    lines.push("  /* ── Stroke ── */");
    for (const [key, value] of Object.entries(spacingOverrides.stroke)) {
      lines.push(`  --stroke-${key}: ${value}px;`);
    }
  }

  // Grid — `--grid-{gutter|margin}-{mobile|pc}` / content width
  if (spacingOverrides && spacingOverrides.grid) {
    lines.push("");
    lines.push("  /* ── Grid ── */");
    const g = spacingOverrides.grid;
    if (g.mobile) {
      if (g.mobile.gutter != null) lines.push(`  --grid-gutter-mobile: ${g.mobile.gutter}px;`);
      if (g.mobile.margin != null) lines.push(`  --grid-margin-mobile: ${g.mobile.margin}px;`);
      if (g.mobile.contentWidth != null)
        lines.push(`  --grid-content-mobile: ${g.mobile.contentWidth}px;`);
    }
    if (g.desktop) {
      if (g.desktop.gutter != null) lines.push(`  --grid-gutter-pc: ${g.desktop.gutter}px;`);
      if (g.desktop.margin != null) lines.push(`  --grid-margin-pc: ${g.desktop.margin}px;`);
      if (g.desktop.minMargin != null)
        lines.push(`  --grid-margin-pc-min: ${g.desktop.minMargin}px;`);
      if (g.desktop.contentWidth != null)
        lines.push(`  --grid-content-pc: ${g.desktop.contentWidth}px;`);
    }
  }

  // Layout (캐포비 전용 admin 너비 토큰) — `--layout-{key}`
  if (spacingOverrides && spacingOverrides.layout) {
    lines.push("");
    lines.push("  /* ── Layout (admin) ── */");
    for (const [key, value] of Object.entries(spacingOverrides.layout)) {
      const kebab = camelToKebab(key);
      lines.push(`  --layout-${kebab}: ${value}px;`);
    }
  }

  // Component overrides — `--nds-{component}-{prop}`
  //   number → `${n}px`, string → 그대로 (`var(--inset-input)` 같은 CSS var 참조 허용).
  //   컴포넌트가 fallback 패턴(`var(--nds-input-padding-x, var(--inset-card))`)으로 읽어 cascade.
  if (components) {
    const componentBlocks = [];
    for (const [component, props] of Object.entries(components)) {
      if (!props) continue;
      for (const [prop, value] of Object.entries(props)) {
        let cssValue;
        if (typeof value === "number") cssValue = `${value}px`;
        else if (typeof value === "string") cssValue = value;
        else continue;
        componentBlocks.push(`  --nds-${component}-${camelToKebab(prop)}: ${cssValue};`);
      }
    }
    if (componentBlocks.length > 0) {
      lines.push("");
      lines.push("  /* ── Components (component-level overrides) ── */");
      lines.push(...componentBlocks);
    }
  }

  // Elevation
  if (elevation) {
    if (elevation.shadow) {
      lines.push("");
      lines.push("  /* ── Shadow ── */");
      for (const [key, value] of Object.entries(elevation.shadow)) {
        lines.push(`  --shadow-${key}: ${value};`);
      }
    }
    if (elevation.zIndex) {
      lines.push("");
      lines.push("  /* ── Z-Index ── */");
      for (const [key, value] of Object.entries(elevation.zIndex)) {
        lines.push(`  --z-${key}: ${value};`);
      }
    }
  }

  lines.push("}");
  return lines.join("\n") + "\n";
}

// ─── Write files ────────────────────────────────────────

const distDir = path.join(__dirname, "..", "dist");

const tokensPath = path.join(distDir, "tokens.css");
fs.writeFileSync(tokensPath, generateBaseTokens());
console.log(`Generated ${tokensPath}`);

const trostPath = path.join(distDir, "trost.css");
const { trostTheme } = require("../dist/projects/trost");
fs.writeFileSync(
  trostPath,
  generateProjectTokens({ theme: trostTheme, title: "trost", cssImport: "trost" }),
);
console.log(`Generated ${trostPath}`);

const genietPath = path.join(distDir, "geniet.css");
const { genietTheme } = require("../dist/projects/geniet");
fs.writeFileSync(
  genietPath,
  generateProjectTokens({ theme: genietTheme, title: "geniet", cssImport: "geniet" }),
);
console.log(`Generated ${genietPath}`);

const cashwalkBizPath = path.join(distDir, "cashwalk-biz.css");
const { cashwalkBizTheme } = require("../dist/projects/cashwalk-biz");
fs.writeFileSync(
  cashwalkBizPath,
  generateProjectTokens({
    theme: cashwalkBizTheme,
    title: "cashwalk-biz",
    cssImport: "cashwalk-biz",
  }),
);
console.log(`Generated ${cashwalkBizPath}`);

const runmilePath = path.join(distDir, "runmile.css");
const { runmileTheme } = require("../dist/projects/runmile");
fs.writeFileSync(
  runmilePath,
  generateProjectTokens({ theme: runmileTheme, title: "runmile", cssImport: "runmile" }),
);
console.log(`Generated ${runmilePath}`);

// 확장자 없는 "./css*" 서브패스의 types 조건이 가리키는 스텁.
// 없으면 TS 6(새 Vite 템플릿 기본)에서 `import "@nudge-design/tokens/css"` 가
// TS2882(side-effect import 타입 미발견)로 깨진다.
const cssStubPath = path.join(distDir, "css-stub.d.ts");
fs.writeFileSync(cssStubPath, "export {};\n");
console.log(`Generated ${cssStubPath}`);
