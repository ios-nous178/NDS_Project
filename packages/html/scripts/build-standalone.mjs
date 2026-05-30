#!/usr/bin/env node
/**
 * build-standalone.mjs — 무번들러 DS 단일 자산 생성기.
 *
 * `@nudge-design/html` 의 nds-* Web Component 는 bare import(@nudge-design/tokens 등)을
 * 쓰므로 browser 단독으론 못 돈다. 그 bare import 해석을 *소비자마다* 하지 않고
 * **DS 빌드 때 한 번** 해서 prebuilt 자산으로 떨군다:
 *
 *   dist/standalone/
 *     nudge-ds.runtime.js   ← runtime.js 를 esbuild IIFE 로 묶은 단일 파일(브랜드 무관)
 *     tokens.css            ← 공통(base) 토큰 — @nudge-design/tokens/css
 *     brand.<slug>.css      ← 브랜드 delta(:root override) — trost/geniet/...
 *     styles.css            ← nds-* 컴포넌트 스타일(351KB, dist/styles.css 미러)
 *     reset.css             ← minimal reset (vanilla HTML 워크플로우)
 *     manifest.json         ← 브랜드별 CSS 조합 SSOT + runtime 파일명
 *
 * mockup-core(build_singlefile_html html intent)가 이 디렉터리를 런타임에 fs-read 해서
 * 사용자 index.html 에 inline 한다 → 외부의존성 0 인 단일 HTML 산출.
 *
 * CSS 는 조각으로 둔다(per-brand 사전 concat 안 함) — base/styles 가 브랜드 수만큼
 * 중복되는 걸 피하고, 조합/순서는 inline 시 manifest 를 따라 mockup-core 가 한다.
 *
 *   node scripts/build-standalone.mjs
 *
 * 선행: tsc(dist/runtime.js) + copy-styles(dist/styles.css) + @nudge-design/tokens 빌드.
 * pnpm topo order 가 tokens 를 먼저 빌드하므로 `pnpm build --filter @nudge-design/html` 로 충분.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PKG = path.resolve(__dirname, "..");
const TOKENS_DIST = path.resolve(HTML_PKG, "../tokens/dist");
const RUNTIME_ENTRY = path.join(HTML_PKG, "dist/runtime.js");
const STYLES_CSS = path.join(HTML_PKG, "dist/styles.css");
const OUT = path.join(HTML_PKG, "dist/standalone");

/** base 토큰 CSS 만 쓰는 브랜드(별도 delta 없음). catalog 의 cssImport==="@nudge-design/tokens/css". */
const BASE_ONLY_BRAND = "nudge-eap";

/**
 * minimal reset — vanilla HTML 워크플로우. tokens.css 이후, styles.css 이전 cascade 전제.
 * (구 setup.ts HTML_MINIMAL_RESET_CSS 의 이관본 — 이제 모든 export 에 자동 포함된다.)
 */
const RESET_CSS = `/* nudge-ds minimal reset — vanilla HTML 워크플로우 */
*,
*::before,
*::after { box-sizing: border-box; }

:where(html, body) { margin: 0; padding: 0; }

:where(body) {
  font-family: var(--font-family-default);
  font-size: var(--font-size-body-2);
  line-height: var(--line-height-body-2);
  color: var(--semantic-text-default);
  background: var(--semantic-bg-white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

:where(h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd) { margin: 0; }
:where(a) { color: inherit; text-decoration: none; }
:where(img, svg, video, canvas, audio, iframe) { display: block; max-width: 100%; }
:where(ul, ol) { margin: 0; padding: 0; list-style: none; }
`;

function fail(msg) {
  console.error(`[build-standalone] ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(RUNTIME_ENTRY)) {
  fail(`${path.relative(HTML_PKG, RUNTIME_ENTRY)} 없음 — \`tsc\` 를 먼저 실행하세요.`);
}
if (!fs.existsSync(STYLES_CSS)) {
  fail(
    `${path.relative(HTML_PKG, STYLES_CSS)} 없음 — \`node scripts/copy-styles.mjs\` 를 먼저 실행하세요.`,
  );
}
const tokensBase = path.join(TOKENS_DIST, "tokens.css");
if (!fs.existsSync(tokensBase)) {
  fail(`${tokensBase} 없음 — \`pnpm build --filter @nudge-design/tokens\` 를 먼저 실행하세요.`);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 1) runtime.js → IIFE 단일 파일 (브랜드 무관). esbuild 가 workspace symlink 를 따라
//    @nudge-design/tokens·icons/vanilla 의 확장자 없는 import 까지 해석해 전부 인라인한다.
console.log("[build-standalone] esbuild → nudge-ds.runtime.js (IIFE)");
await build({
  entryPoints: [RUNTIME_ENTRY],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  resolveExtensions: [".js"],
  outfile: path.join(OUT, "nudge-ds.runtime.js"),
  logLevel: "warning",
});

// 2) CSS 조각 복사: 공통 토큰 + 컴포넌트 스타일 + reset.
fs.copyFileSync(tokensBase, path.join(OUT, "tokens.css"));
fs.copyFileSync(STYLES_CSS, path.join(OUT, "styles.css"));
fs.writeFileSync(path.join(OUT, "reset.css"), RESET_CSS, "utf-8");

// 3) 브랜드 delta CSS 복사(tokens.css 외 모든 *.css) + manifest 조립.
const brands = {
  [BASE_ONLY_BRAND]: ["tokens.css", "styles.css", "reset.css"],
};
for (const file of fs.readdirSync(TOKENS_DIST)) {
  if (!file.endsWith(".css") || file === "tokens.css") continue;
  const slug = file.slice(0, -".css".length);
  const dest = `brand.${slug}.css`;
  fs.copyFileSync(path.join(TOKENS_DIST, file), path.join(OUT, dest));
  brands[slug] = ["tokens.css", dest, "styles.css", "reset.css"];
}

const manifest = { runtime: "nudge-ds.runtime.js", baseOnlyBrand: BASE_ONLY_BRAND, brands };
fs.writeFileSync(
  path.join(OUT, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf-8",
);

const sizeKb = (p) => (fs.statSync(path.join(OUT, p)).size / 1024).toFixed(1);
console.log(
  `\n✓ dist/standalone/ 생성 — runtime ${sizeKb("nudge-ds.runtime.js")}KB · ` +
    `styles ${sizeKb("styles.css")}KB · 브랜드 ${Object.keys(brands).join(", ")}`,
);
