#!/usr/bin/env node
/**
 * Phase 2 stateful fixture — input / tabs / modal / select 시각 + 이벤트 확인.
 *
 *   node test-fixture/build-stateful-fixture.mjs
 * 출력: test-fixture/nds-stateful.dist.html (self-contained)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

const tokensCss = fs.readFileSync(path.join(root, "packages/tokens/dist/tokens.css"), "utf-8");
const stylesCss = fs.readFileSync(path.join(root, "packages/styles/dist/styles.css"), "utf-8");

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

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Phase 2 stateful 시각 + 이벤트 확인</title>
  <style>${tokensCss}\n${stylesCss}</style>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif;
      padding: 32px; max-width: 1000px; margin: 0 auto; background: #fafafa; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    h2 { font-size: 14px; color: #666; margin: 36px 0 10px; }
    .lead { color: #666; font-size: 13px; line-height: 1.5; margin: 0 0 16px; }
    .row { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 12px; }
    .col { display: flex; flex-direction: column; gap: 16px; min-width: 280px; }
    .section { border: 1px dashed #d0d0d0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: white; }
    .section h2 { margin-top: 0; }
    .ev-log { font-family: monospace; font-size: 12px; color: #888; margin: 4px 0 0; min-height: 16px; padding: 6px; background: #f5f5f5; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Phase 2 stateful — input / tabs / modal / select</h1>
  <p class="lead">
    각 컴포넌트의 attribute, 이벤트, 키보드 동작을 함께 확인하세요. 우측 하단마다 이벤트 로그가 실시간 갱신됩니다.
  </p>

  <div class="section">
    <h2>nds-input</h2>
    <div class="row">
      <div class="col">
        <nds-input label="이름" placeholder="홍길동" helper-text="공백 없이"></nds-input>
        <nds-input label="이메일" type="email" placeholder="you@example.com" clearable default-value="hi@nudge.io"></nds-input>
        <nds-input label="비밀번호" type="password" error helper-text="8자 이상이어야 합니다"></nds-input>
        <nds-input label="disabled" placeholder="off" disabled value="off"></nds-input>
        <nds-input label="full-width" full-width placeholder="부모 너비 채움"></nds-input>
      </div>
      <div class="col">
        <p class="ev-log" id="input-log">이벤트 로그 — input/change 모두 표시</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>nds-tabs (line variant + 키보드: ←/→/Home/End)</h2>
    <nds-tabs id="tt" active-key="home" variant="line" size="mobile" tone="neutral" style="display:block">
      <nds-tabs-list>
        <nds-tabs-trigger key="home">홈</nds-tabs-trigger>
        <nds-tabs-trigger key="profile">프로필</nds-tabs-trigger>
        <nds-tabs-trigger key="settings" disabled>설정 (비활성)</nds-tabs-trigger>
        <nds-tabs-trigger key="notifications">알림</nds-tabs-trigger>
      </nds-tabs-list>
      <nds-tabs-panel key="home"><div style="padding:12px 0">🏠 홈 내용</div></nds-tabs-panel>
      <nds-tabs-panel key="profile"><div style="padding:12px 0">👤 프로필 내용</div></nds-tabs-panel>
      <nds-tabs-panel key="settings"><div style="padding:12px 0">⚙️ 설정 내용</div></nds-tabs-panel>
      <nds-tabs-panel key="notifications"><div style="padding:12px 0">🔔 알림 내용</div></nds-tabs-panel>
    </nds-tabs>
    <p class="ev-log" id="tabs-log">tabs-change 이벤트 로그</p>
  </div>

  <div class="section">
    <h2>nds-modal (열기/닫기/ESC/✕)</h2>
    <div class="row">
      <nds-button id="open-modal">모달 열기</nds-button>
      <nds-button id="open-modal-closable" variant="outlined">closable 모달 열기</nds-button>
    </div>
    <nds-modal id="m1" title="알림" max-width="332">
      <p>모달 안의 본문입니다. ESC 또는 overlay 클릭으로 닫을 수 있어요.</p>
      <div style="margin-top:16px; display:flex; gap:8px; justify-content:flex-end">
        <nds-button id="m1-close" variant="outlined">닫기</nds-button>
        <nds-button id="m1-confirm">확인</nds-button>
      </div>
    </nds-modal>
    <nds-modal id="m2" title="closable" closable max-width="380">
      <p>이 모달은 우상단 ✕ 버튼이 있습니다.</p>
    </nds-modal>
    <p class="ev-log" id="modal-log">modal-close 이벤트 로그</p>
  </div>

  <div class="section">
    <h2>nds-select (클릭 / ↓↑ / Enter / ESC / Esc / 외부클릭)</h2>
    <div class="row">
      <div class="col">
        <nds-select id="sel" placeholder="국가를 선택하세요" label="국가" helper-text="필수 항목">
          <nds-select-option value="kr">대한민국</nds-select-option>
          <nds-select-option value="jp">일본</nds-select-option>
          <nds-select-option value="us">미국</nds-select-option>
          <nds-select-option value="cn" disabled>중국 (비활성)</nds-select-option>
          <nds-select-option value="gb">영국</nds-select-option>
        </nds-select>
        <nds-select label="기본값 jp" value="jp">
          <nds-select-option value="kr">대한민국</nds-select-option>
          <nds-select-option value="jp">일본</nds-select-option>
        </nds-select>
      </div>
      <div class="col">
        <p class="ev-log" id="select-log">select-change 이벤트 로그</p>
      </div>
    </div>
  </div>

  <script>${bundledJs}</script>
  <script>
    const ts = () => new Date().toLocaleTimeString();
    const inputLog = document.getElementById("input-log");
    document.querySelectorAll("nds-input").forEach((el, i) => {
      el.addEventListener("input", (e) => inputLog.textContent = "input["+i+"]: " + e.target.querySelector("input").value + " @ " + ts());
      el.addEventListener("change", (e) => inputLog.textContent = "change["+i+"]: " + e.target.querySelector("input").value + " @ " + ts());
    });

    const tabsLog = document.getElementById("tabs-log");
    document.getElementById("tt").addEventListener("tabs-change", (e) => {
      tabsLog.textContent = "tabs-change → activeKey=" + e.detail.activeKey + " @ " + ts();
    });

    const modalLog = document.getElementById("modal-log");
    const m1 = document.getElementById("m1");
    const m2 = document.getElementById("m2");
    document.getElementById("open-modal").addEventListener("click", () => m1.open());
    document.getElementById("open-modal-closable").addEventListener("click", () => m2.open());
    document.getElementById("m1-close").addEventListener("click", () => m1.close());
    document.getElementById("m1-confirm").addEventListener("click", () => { modalLog.textContent = "확인 @ " + ts(); m1.close(); });
    m1.addEventListener("modal-close", () => modalLog.textContent = "m1 modal-close @ " + ts());
    m2.addEventListener("modal-close", () => modalLog.textContent = "m2 modal-close @ " + ts());

    const selectLog = document.getElementById("select-log");
    document.getElementById("sel").addEventListener("select-change", (e) => {
      selectLog.textContent = "select-change → " + e.detail.value + " @ " + ts();
    });
  </script>
</body>
</html>
`;

const outPath = path.join(__dirname, "nds-stateful.dist.html");
fs.writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
