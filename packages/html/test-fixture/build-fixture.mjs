#!/usr/bin/env node
/**
 * Self-contained fixture 빌더.
 *
 * @nudge-eap/tokens 의 tokens.css 와 @nudge-eap/styles 의 styles.css 를
 * fixture HTML 안에 <style> 로 인라인해서, 어느 디렉터리에서 정적 서버를
 * 돌리든 (또는 file:// 로 열어도) 토큰/스타일이 항상 로드되게 만든다.
 *
 *   node test-fixture/build-fixture.mjs
 *
 * 출력: test-fixture/nds-button.dist.html
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

const tokensCss = fs.readFileSync(path.join(root, "packages/tokens/dist/tokens.css"), "utf-8");
const stylesCss = fs.readFileSync(path.join(root, "packages/styles/dist/styles.css"), "utf-8");
// runtime.js 가 base/nds-element.js, components/nds-button.styles.js,
// components/nds-button.js 를 import 한다. tsc 결과는 native ESM 이라
// 그대로 import 못 박힘 (확장자 없는 @nudge-eap/tokens import 가 들어가서).
// → fixture 에서는 importmap + 빌드된 모듈 그대로 사용하지 않고,
//   필요한 컴포넌트 정의를 직접 인라인한다. 그게 가장 확실.

// 실제로는 빌드된 nds-button.js 가 @nudge-eap/tokens 를 import 하므로
// browser 단독으로는 못 돈다. 그래서 bundling 한 단일 IIFE 가 필요.
// 가장 가벼운 길: esbuild 한 번 호출.

import { build } from "esbuild";

const result = await build({
  entryPoints: [path.join(__dirname, "../dist/runtime.js")],
  bundle: true,
  format: "iife",
  write: false,
  platform: "browser",
  target: "es2020",
  resolveExtensions: [".js"],
  // @nudge-eap/tokens 는 monorepo workspace 라 node_modules 에 symlink 로 있음.
  // esbuild 가 그걸 따라가 dist/index.js → dist/colors.js 등 확장자 없는 import 도
  // 해결한다 (esbuild 는 .js 확장자 자동 부여 옵션이 있음).
  loader: { ".js": "js" },
});

const bundledJs = result.outputFiles[0].text;

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>nds-button visual parity check</title>
  <style>${tokensCss}\n${stylesCss}</style>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif;
      padding: 32px;
      max-width: 900px;
      margin: 0 auto;
      background: #fafafa;
    }
    h1 { font-size: 20px; margin: 0 0 24px; }
    h2 { font-size: 14px; color: #666; margin: 32px 0 12px; }
    .row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-bottom: 12px; }
    .compare {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      border: 1px dashed #d0d0d0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      background: white;
    }
    .compare > div { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
    .compare-header {
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .pairing { display: flex; align-items: center; gap: 12px; }
  </style>
</head>
<body>
  <h1>nds-button vs React Button — 시각 동등성 검증</h1>
  <p style="color:#666; font-size:13px; line-height:1.5;">
    왼쪽은 손으로 작성한 <code>&lt;button class="nds-button"&gt;</code> (React Button 이 만들어내는 DOM 과 동일),
    오른쪽은 새 <code>&lt;nds-button&gt;</code> Web Component. 두 열이 픽셀 단위로 동일해야 한다.
  </p>

  <h2>primary × solid × size matrix</h2>
  <div class="compare">
    <div>
      <div class="compare-header">React DS (수기 HTML)</div>
      <button class="nds-button" data-slot="root" data-variant="solid" data-size="xl" data-color="primary"
        style="--nds-button-height:52px;--nds-button-padding-x:16px;--nds-button-gap:8px;--nds-button-font-size:16px;--nds-button-line-height:24px;--nds-button-icon-size:20px;--nds-button-font-weight:700;--nds-button-width:auto;--nds-button-background:var(--semantic-bg-brand-default);--nds-button-text-color:var(--semantic-text-inverse-default);--nds-button-border-color:var(--semantic-border-brand-default);">
        <span class="nds-button__label" data-slot="label">예약하기 (xl)</span>
      </button>
      <button class="nds-button" data-slot="root" data-variant="solid" data-size="lg" data-color="primary"
        style="--nds-button-height:48px;--nds-button-padding-x:16px;--nds-button-gap:8px;--nds-button-font-size:16px;--nds-button-line-height:24px;--nds-button-icon-size:20px;--nds-button-font-weight:700;--nds-button-width:auto;--nds-button-background:var(--semantic-bg-brand-default);--nds-button-text-color:var(--semantic-text-inverse-default);--nds-button-border-color:var(--semantic-border-brand-default);">
        <span class="nds-button__label" data-slot="label">예약하기 (lg)</span>
      </button>
      <button class="nds-button" data-slot="root" data-variant="solid" data-size="md" data-color="primary"
        style="--nds-button-height:44px;--nds-button-padding-x:24px;--nds-button-gap:8px;--nds-button-font-size:15px;--nds-button-line-height:22px;--nds-button-icon-size:20px;--nds-button-font-weight:700;--nds-button-width:auto;--nds-button-background:var(--semantic-bg-brand-default);--nds-button-text-color:var(--semantic-text-inverse-default);--nds-button-border-color:var(--semantic-border-brand-default);">
        <span class="nds-button__label" data-slot="label">예약하기 (md)</span>
      </button>
      <button class="nds-button" data-slot="root" data-variant="solid" data-size="sm" data-color="primary"
        style="--nds-button-height:42px;--nds-button-padding-x:16px;--nds-button-gap:8px;--nds-button-font-size:14px;--nds-button-line-height:20px;--nds-button-icon-size:20px;--nds-button-font-weight:700;--nds-button-width:auto;--nds-button-background:var(--semantic-bg-brand-default);--nds-button-text-color:var(--semantic-text-inverse-default);--nds-button-border-color:var(--semantic-border-brand-default);">
        <span class="nds-button__label" data-slot="label">예약하기 (sm)</span>
      </button>
    </div>
    <div>
      <div class="compare-header">&lt;nds-button&gt; Web Component</div>
      <nds-button color="primary" variant="solid" size="xl">예약하기 (xl)</nds-button>
      <nds-button color="primary" variant="solid" size="lg">예약하기 (lg)</nds-button>
      <nds-button color="primary" variant="solid" size="md">예약하기 (md)</nds-button>
      <nds-button color="primary" variant="solid" size="sm">예약하기 (sm)</nds-button>
    </div>
  </div>

  <h2>variant × color matrix (size: lg)</h2>
  <div class="compare">
    <div>
      <div class="compare-header">React DS (수기 HTML — 4종)</div>
      <div class="row">
        <button class="nds-button" data-slot="root" data-variant="solid" data-size="lg" data-color="primary"
          style="--nds-button-height:48px;--nds-button-padding-x:16px;--nds-button-gap:8px;--nds-button-font-size:16px;--nds-button-line-height:24px;--nds-button-font-weight:700;--nds-button-background:var(--semantic-bg-brand-default);--nds-button-text-color:var(--semantic-text-inverse-default);--nds-button-border-color:var(--semantic-border-brand-default);">
          <span class="nds-button__label">primary/solid</span>
        </button>
        <button class="nds-button" data-slot="root" data-variant="outlined" data-size="lg" data-color="primary"
          style="--nds-button-height:48px;--nds-button-padding-x:16px;--nds-button-gap:8px;--nds-button-font-size:16px;--nds-button-line-height:24px;--nds-button-font-weight:700;--nds-button-background:var(--semantic-bg-surface-default);--nds-button-text-color:var(--semantic-text-brand-default);--nds-button-border-color:var(--semantic-border-brand-default);">
          <span class="nds-button__label">primary/outlined</span>
        </button>
      </div>
      <div class="row">
        <button class="nds-button" data-slot="root" data-variant="soft" data-size="lg" data-color="primary"
          style="--nds-button-height:48px;--nds-button-padding-x:16px;--nds-button-gap:8px;--nds-button-font-size:16px;--nds-button-line-height:24px;--nds-button-font-weight:700;--nds-button-background:var(--semantic-bg-brand-subtle);--nds-button-text-color:var(--semantic-text-brand-default);--nds-button-border-color:var(--semantic-bg-brand-subtle);">
          <span class="nds-button__label">primary/soft</span>
        </button>
        <button class="nds-button" data-slot="root" data-variant="outlined-sub" data-size="lg" data-color="primary"
          style="--nds-button-height:48px;--nds-button-padding-x:16px;--nds-button-gap:8px;--nds-button-font-size:16px;--nds-button-line-height:24px;--nds-button-font-weight:500;--nds-button-background:var(--semantic-bg-surface-default);--nds-button-text-color:var(--semantic-text-normal-default);--nds-button-border-color:var(--semantic-border-normal-default);">
          <span class="nds-button__label">primary/outlined-sub</span>
        </button>
      </div>
    </div>
    <div>
      <div class="compare-header">&lt;nds-button&gt; (같은 4종)</div>
      <div class="row">
        <nds-button color="primary" variant="solid" size="lg">primary/solid</nds-button>
        <nds-button color="primary" variant="outlined" size="lg">primary/outlined</nds-button>
      </div>
      <div class="row">
        <nds-button color="primary" variant="soft" size="lg">primary/soft</nds-button>
        <nds-button color="primary" variant="outlined-sub" size="lg">primary/outlined-sub</nds-button>
      </div>
    </div>
  </div>

  <h2>states (disabled / full-width / type)</h2>
  <div class="row">
    <nds-button color="primary" size="lg">enabled</nds-button>
    <nds-button color="primary" size="lg" disabled>disabled</nds-button>
    <nds-button color="secondary" size="lg" variant="outlined">secondary outlined</nds-button>
    <nds-button color="assistive" size="lg" variant="soft">assistive soft</nds-button>
  </div>
  <div class="row" style="margin-top: 12px;">
    <nds-button color="primary" size="lg" full-width>full-width 버튼 (부모 너비 채움)</nds-button>
  </div>

  <h2>dynamic attribute reaction</h2>
  <p style="font-size:13px; color:#666;">
    버튼 클릭 시 attribute 가 바뀌면서 즉시 다시 그려진다. (DevTools 에서 attribute 직접 편집해도 동일)
  </p>
  <div class="row">
    <nds-button id="dyn" color="primary" variant="solid" size="lg">눌러서 다음 variant</nds-button>
  </div>

  <script>${bundledJs}</script>
  <script>
    const variants = ["solid", "outlined", "soft", "outlined-sub"];
    const colors = ["primary", "secondary", "assistive"];
    let vi = 0, ci = 0;
    const el = document.getElementById("dyn");
    el.addEventListener("click", () => {
      vi = (vi + 1) % variants.length;
      if (vi === 0) ci = (ci + 1) % colors.length;
      el.setAttribute("variant", variants[vi]);
      el.setAttribute("color", colors[ci]);
      el.firstElementChild.querySelector(".nds-button__label").textContent =
        \`\${colors[ci]} / \${variants[vi]}\`;
    });
  </script>
</body>
</html>
`;

const outPath = path.join(__dirname, "nds-button.dist.html");
fs.writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
