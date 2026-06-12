#!/usr/bin/env node
/**
 * Self-contained brand-chrome fixture builder.
 *
 * 산출물: test-fixture/brand-chrome.dist.html
 *   - tokens.css / styles.css 를 <style> 로 인라인
 *   - dist/runtime.js 를 esbuild 로 IIFE bundle 해서 <script> 로 인라인
 *     (workspace import @nudge-design/tokens 등을 해소)
 *   - @nudge-design/assets (SSOT) 의 files taxonomy 를 test-fixture/_assets/ 로 복사
 *     (asset-base-url 을 /test-fixture/_assets 로 박아 self-contained)
 *
 * 사용:
 *   node test-fixture/build-brand-chrome-fixture.mjs
 *   python3 -m http.server 8181   # packages/html 에서
 *   open http://localhost:8181/test-fixture/brand-chrome.dist.html
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

/* ── 1. inline tokens + styles ──
 *   tokens.css 는 :root 에 NudgeEAP 디폴트를 박는다. 같은 페이지에 4 brand 가 같이
 *   있으므로 trost/geniet/cashwalk-biz.css 도 `:root` selector 를 그대로 두면 마지막 brand
 *   override 가 모든 frame 에 cascade. 이를 막기 위해 brand css 의 `:root` 를
 *   `[data-brand="X"]` 로 rewrap (brand-chrome 가 root element 에 data-brand 를 박음). */
const tokensCss = fs.readFileSync(path.join(root, "packages/tokens/dist/tokens.css"), "utf-8");
const stylesCss = fs.readFileSync(path.join(root, "packages/styles/dist/styles.css"), "utf-8");

function readBrandCss(brand) {
  const raw = fs.readFileSync(path.join(root, `packages/tokens/dist/${brand}.css`), "utf-8");
  /* :root { ... } → [data-brand="X"] { ... } — CSS custom property 는 inherit 되므로
   * brand-chrome root element 한 곳에 토큰을 박으면 자식 컴포넌트로 자동 cascade. */
  return raw.replace(/:root\b/g, `[data-brand="${brand}"]`);
}

const brandsCss = ["trost", "geniet", "cashwalk-biz"]
  .map((b) => `/* ── ${b} brand tokens (scoped) ── */\n${readBrandCss(b)}`)
  .join("\n\n");

/* ── 2. bundle runtime.js with esbuild (resolve workspace bare imports) ── */
const result = await build({
  entryPoints: [path.join(__dirname, "../dist/runtime.js")],
  bundle: true,
  format: "iife",
  write: false,
  platform: "browser",
  target: "es2020",
  resolveExtensions: [".js"],
  loader: { ".js": "js" },
});
const bundledJs = result.outputFiles[0].text;

/* ── 3. copy assets to be self-contained ── */
const assetsDir = path.join(__dirname, "_assets");
// SSOT: @nudge-design/assets — apps/storybook 도 src/files 를 staticDir 로 마운트.
const srcLogosDir = path.join(root, "packages/assets/src/files");
fs.rmSync(assetsDir, { recursive: true, force: true });
fs.mkdirSync(assetsDir, { recursive: true });
function copyRecursive(src, dst) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
copyRecursive(srcLogosDir, assetsDir);

/* ── 4. build HTML ── */
const ASSET_BASE = "_assets";
const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>nds-brand-header / footer — React parity visual check</title>
<style>${tokensCss}\n${brandsCss}\n${stylesCss}</style>
<style>
  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    padding: 24px;
    background: #f4f5f7;
    color: #111;
  }
  h1 { font-size: 22px; margin: 0 0 8px; }
  h2 { font-size: 16px; margin: 36px 0 10px; color: #111; }
  .lede { color: #555; font-size: 13px; margin: 0 0 24px; line-height: 1.55; }
  .lede code { background: #fff; padding: 1px 6px; border-radius: 4px; border: 1px solid #ececec; font-size: 12px; }
  .frame {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .frame__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 14px;
    background: #fafafa;
    border-bottom: 1px solid #ececec;
    font-size: 12px;
    color: #666;
  }
  .frame__head code { color: #2563eb; font-weight: 600; }
  .frame__head a { color: #2563eb; text-decoration: none; }
  .frame__head a:hover { text-decoration: underline; }
  .frame--mobile { max-width: 360px; }
  .row { display: grid; gap: 14px; grid-template-columns: 1fr; }
  .row--mobile {
    grid-template-columns: repeat(3, minmax(320px, 360px));
    align-items: start;
  }
  .badge {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 999px;
    background: #eef2ff;
    color: #3730a3;
    font-size: 11px;
    font-weight: 600;
    margin-right: 6px;
    vertical-align: middle;
  }
  .footer-block {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    margin-bottom: 16px;
    overflow: hidden;
  }
</style>
</head>
<body>

<h1>nds-brand-header / brand-footer — 시각 정합 (React Storybook 1:1)</h1>
<p class="lede">
  <code>@nudge-design/html</code> 의 <code>&lt;nds-brand-header&gt;</code> 출력 (self-contained).
  각 프레임 우측의 "→ React storybook" 링크가 같은 디자인의 React 스토리.
  Storybook 이 <a href="http://localhost:6006" target="_blank">http://localhost:6006</a> 에 떠 있으면 한 화면에서 비교 가능.
</p>

<!-- Geniet -->
<h2><span class="badge">2단</span>Geniet · Desktop (Figma 77:2 — Search 54h + Menu 58h)</h2>
<div class="frame">
  <div class="frame__head">
    <code>&lt;nds-brand-header brand="geniet"&gt;</code>
    <a href="http://localhost:6006/?path=/story/components-header--geniet-desktop" target="_blank">→ React storybook</a>
  </div>
  <nds-brand-header brand="geniet" active-key="home" asset-base-url="${ASSET_BASE}"></nds-brand-header>
</div>

<h2><span class="badge">2단</span>Geniet · Mobile / Webview</h2>
<div class="row row--mobile">
  <div class="frame frame--mobile">
    <div class="frame__head"><code>brand="geniet" surface="mobile"</code><a href="http://localhost:6006/?path=/story/components-header--geniet-mobile" target="_blank">→ React</a></div>
    <nds-brand-header brand="geniet" surface="mobile" asset-base-url="${ASSET_BASE}"></nds-brand-header>
  </div>
  <div class="frame frame--mobile">
    <div class="frame__head"><code>surface="webview"</code><span>—</span></div>
    <nds-brand-header brand="geniet" surface="webview"></nds-brand-header>
  </div>
</div>

<!-- Trost -->
<h2><span class="badge">3슬롯 compound</span>Trost · Desktop (EAP Banner + Utility + Tab Navigation)</h2>
<div class="frame">
  <div class="frame__head">
    <code>&lt;nds-brand-header brand="trost"&gt;</code>
    <a href="http://localhost:6006/?path=/story/components-header--trost-web-header-desktop" target="_blank">→ React storybook</a>
  </div>
  <nds-brand-header brand="trost" asset-base-url="${ASSET_BASE}"></nds-brand-header>
</div>

<h2>Trost · Mobile / Webview</h2>
<div class="row row--mobile">
  <div class="frame frame--mobile">
    <div class="frame__head"><code>surface="mobile"</code><span>—</span></div>
    <nds-brand-header brand="trost" surface="mobile" asset-base-url="${ASSET_BASE}"></nds-brand-header>
  </div>
  <div class="frame frame--mobile">
    <div class="frame__head"><code>surface="webview"</code><span>—</span></div>
    <nds-brand-header brand="trost" surface="webview"></nds-brand-header>
  </div>
</div>

<!-- NudgeEAP -->
<h2>NudgeEAP · Desktop (메뉴 absolute 중앙 + 앱다운로드 + 로그인)</h2>
<div class="frame">
  <div class="frame__head">
    <code>&lt;nds-brand-header brand="nudge-eap"&gt;</code>
    <a href="http://localhost:6006/?path=/story/components-web-header--nudge-eap-web-header-desktop" target="_blank">→ React storybook</a>
  </div>
  <nds-brand-header brand="nudge-eap" active-key="counsel" asset-base-url="${ASSET_BASE}"></nds-brand-header>
</div>

<h2>NudgeEAP · Mobile / Webview</h2>
<div class="row row--mobile">
  <div class="frame frame--mobile">
    <div class="frame__head"><code>surface="mobile"</code><span>—</span></div>
    <nds-brand-header brand="nudge-eap" surface="mobile" asset-base-url="${ASSET_BASE}"></nds-brand-header>
  </div>
  <div class="frame frame--mobile">
    <div class="frame__head"><code>surface="webview"</code><span>—</span></div>
    <nds-brand-header brand="nudge-eap" surface="webview"></nds-brand-header>
  </div>
</div>

<!-- CashwalkBiz -->
<h2><span class="badge">yellow CTA</span>CashwalkBiz · Desktop (5탭 + 광고시작하기 #FFD200 pill)</h2>
<div class="frame">
  <div class="frame__head">
    <code>&lt;nds-brand-header brand="cashwalk-biz"&gt;</code>
    <a href="http://localhost:6006/?path=/story/components-header--cashwalk-biz-web-header-desktop-pc" target="_blank">→ React storybook</a>
  </div>
  <nds-brand-header brand="cashwalk-biz" active-key="campaign" asset-base-url="${ASSET_BASE}"></nds-brand-header>
</div>

<h2>CashwalkBiz · Mobile</h2>
<div class="row row--mobile">
  <div class="frame frame--mobile">
    <div class="frame__head"><code>surface="mobile"</code><span>—</span></div>
    <nds-brand-header brand="cashwalk-biz" surface="mobile" asset-base-url="${ASSET_BASE}"></nds-brand-header>
  </div>
</div>

<!-- Footers -->
<h2>참고 · brand-footer (기존 동작 그대로)</h2>
<div class="row" style="grid-template-columns: repeat(2, 1fr);">
  <div class="footer-block">
    <div class="frame__head"><code>brand="geniet" surface="app"</code><span>—</span></div>
    <nds-brand-footer brand="geniet" surface="app" asset-base-url="${ASSET_BASE}"></nds-brand-footer>
  </div>
  <div class="footer-block">
    <div class="frame__head"><code>brand="nudge-eap" surface="web"</code><span>—</span></div>
    <nds-brand-footer brand="nudge-eap" surface="web" asset-base-url="${ASSET_BASE}"></nds-brand-footer>
  </div>
</div>

<script>${bundledJs}</script>
</body>
</html>
`;

const outPath = path.join(__dirname, "brand-chrome.dist.html");
fs.writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
console.log(`Logos copied to ${assetsDir}`);
