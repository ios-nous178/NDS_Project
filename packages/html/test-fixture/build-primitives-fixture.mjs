#!/usr/bin/env node
/**
 * Phase 1 primitives 시각 동등성 fixture 빌더.
 *
 * 출력: test-fixture/nds-primitives.dist.html — self-contained (tokens + styles + bundled JS 인라인).
 * file:// 또는 어디서 서버 돌려도 동작.
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
  <title>Phase 1 primitives 시각 동등성 검증</title>
  <style>${tokensCss}\n${stylesCss}</style>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif;
      padding: 32px;
      max-width: 1000px;
      margin: 0 auto;
      background: #fafafa;
    }
    h1 { font-size: 22px; margin: 0 0 8px; }
    h2 { font-size: 14px; color: #666; margin: 36px 0 10px; }
    .lead { color: #666; font-size: 13px; line-height: 1.5; margin: 0 0 16px; }
    .row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }
    .compare {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      border: 1px dashed #d0d0d0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      background: white;
    }
    .compare > div { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
    .compare-header {
      font-size: 11px; color: #999; text-transform: uppercase;
      letter-spacing: 0.5px; margin-bottom: 4px;
    }
    .nds-card__title { font-size: 18px; font-weight: 700; margin: 0; }
    .nds-card__description { font-size: 14px; color: #666; margin: 4px 0 0; }
    .nds-list-item__leading { width: 24px; text-align: center; }
    .nds-list-item__body { flex: 1; }
    .nds-list-item__title { display: block; font-weight: 600; }
    .nds-list-item__description { display: block; color: #666; font-size: 13px; }
    .nds-list-item__trailing { color: #999; }
    .ev-log { font-family: monospace; font-size: 12px; color: #888; margin: 4px 0 0; min-height: 16px; }
  </style>
</head>
<body>
  <h1>Phase 1 primitives — 시각 동등성 검증</h1>
  <p class="lead">
    각 섹션 좌측은 손으로 쓴 React DS 마크업 (React Button이 만들어내는 DOM과 동일),
    우측은 새 <code>&lt;nds-*&gt;</code> Web Component. 좌우가 픽셀 단위로 동일해야 한다.
  </p>

  <h2>nds-icon-button (4 sizes)</h2>
  <div class="compare">
    <div>
      <div class="compare-header">React DS (수기)</div>
      <div class="row">
        <button class="nds-icon-button" data-slot="root" data-size="x-large" aria-label="close" style="--nds-icon-button-size:36px;--nds-icon-button-icon-size:28px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        <button class="nds-icon-button" data-slot="root" data-size="large" aria-label="close" style="--nds-icon-button-size:32px;--nds-icon-button-icon-size:24px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        <button class="nds-icon-button" data-slot="root" data-size="medium" aria-label="close" style="--nds-icon-button-size:28px;--nds-icon-button-icon-size:20px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        <button class="nds-icon-button" data-slot="root" data-size="small" aria-label="close" style="--nds-icon-button-size:24px;--nds-icon-button-icon-size:16px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
    </div>
    <div>
      <div class="compare-header">&lt;nds-icon-button&gt;</div>
      <div class="row">
        <nds-icon-button size="x-large" aria-label="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></nds-icon-button>
        <nds-icon-button size="large" aria-label="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></nds-icon-button>
        <nds-icon-button size="medium" aria-label="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></nds-icon-button>
        <nds-icon-button size="small" aria-label="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></nds-icon-button>
      </div>
    </div>
  </div>

  <h2>nds-badge — variant × color matrix</h2>
  <div class="compare">
    <div>
      <div class="compare-header">&lt;nds-badge variant="fill"&gt;</div>
      <div class="row">
        <nds-badge variant="fill" color="brand">brand</nds-badge>
        <nds-badge variant="fill" color="neutral">neutral</nds-badge>
        <nds-badge variant="fill" color="success">success</nds-badge>
        <nds-badge variant="fill" color="error">error</nds-badge>
        <nds-badge variant="fill" color="caution">caution</nds-badge>
        <nds-badge variant="fill" color="info">info</nds-badge>
      </div>
      <div class="compare-header">&lt;nds-badge variant="ghost"&gt;</div>
      <div class="row">
        <nds-badge variant="ghost" color="brand">brand</nds-badge>
        <nds-badge variant="ghost" color="neutral">neutral</nds-badge>
        <nds-badge variant="ghost" color="success">success</nds-badge>
        <nds-badge variant="ghost" color="error">error</nds-badge>
        <nds-badge variant="ghost" color="caution">caution</nds-badge>
        <nds-badge variant="ghost" color="info">info</nds-badge>
      </div>
      <div class="compare-header">&lt;nds-badge variant="line"&gt;</div>
      <div class="row">
        <nds-badge variant="line" color="brand">brand</nds-badge>
        <nds-badge variant="line" color="neutral">neutral</nds-badge>
        <nds-badge variant="line" color="success">success</nds-badge>
        <nds-badge variant="line" color="error">error</nds-badge>
        <nds-badge variant="line" color="caution">caution</nds-badge>
        <nds-badge variant="line" color="info">info</nds-badge>
      </div>
    </div>
    <div>
      <div class="compare-header">sizes (sm / md / lg)</div>
      <div class="row">
        <nds-badge size="sm" color="brand">sm</nds-badge>
        <nds-badge size="md" color="brand">md</nds-badge>
        <nds-badge size="lg" color="brand">lg</nds-badge>
      </div>
    </div>
  </div>

  <h2>nds-chip — variant + interactive + removable</h2>
  <div class="compare">
    <div>
      <div class="compare-header">정적 chip (variant × color)</div>
      <div class="row">
        <nds-chip variant="fill" color="brand">fill brand</nds-chip>
        <nds-chip variant="outlined" color="brand">outlined brand</nds-chip>
        <nds-chip variant="ghost" color="brand">ghost brand</nds-chip>
      </div>
      <div class="row">
        <nds-chip variant="fill" color="success">fill success</nds-chip>
        <nds-chip variant="fill" color="error">fill error</nds-chip>
        <nds-chip variant="fill" color="caution">fill caution</nds-chip>
        <nds-chip variant="fill" color="neutral">fill neutral</nds-chip>
      </div>
      <div class="row">
        <nds-chip size="sm">size sm</nds-chip>
        <nds-chip size="md">size md</nds-chip>
        <nds-chip disabled>disabled</nds-chip>
      </div>
    </div>
    <div>
      <div class="compare-header">interactive / removable (이벤트 확인)</div>
      <div class="row">
        <nds-chip id="ic1" interactive variant="outlined">클릭해보세요</nds-chip>
        <nds-chip id="ic2" interactive selected variant="outlined">selected</nds-chip>
        <nds-chip id="ic3" removable variant="ghost">X 누르기</nds-chip>
      </div>
      <p class="ev-log" id="chip-log">최근 이벤트 — 없음</p>
    </div>
  </div>

  <h2>nds-card — variant + clickable</h2>
  <div class="compare">
    <div>
      <div class="compare-header">outlined</div>
      <nds-card variant="outlined" style="width:280px">
        <p class="nds-card__title">상담 예약</p>
        <p class="nds-card__description">오늘 가능한 시간을 확인해보세요.</p>
      </nds-card>
    </div>
    <div>
      <div class="compare-header">flat + clickable</div>
      <nds-card id="cc" variant="flat" clickable style="width:280px">
        <p class="nds-card__title">눌러보세요</p>
        <p class="nds-card__description">클릭 이벤트가 디스패치됩니다.</p>
      </nds-card>
      <p class="ev-log" id="card-log">최근 이벤트 — 없음</p>
    </div>
  </div>

  <h2>nds-list / nds-list-item</h2>
  <div class="compare">
    <div>
      <div class="compare-header">plain</div>
      <nds-list variant="plain" style="width:320px">
        <nds-list-item><span class="nds-list-item__leading">📦</span><div class="nds-list-item__body"><span class="nds-list-item__title">주문 1</span><span class="nds-list-item__description">2026-05-25</span></div><span class="nds-list-item__trailing">3건</span></nds-list-item>
        <nds-list-item><span class="nds-list-item__leading">📦</span><div class="nds-list-item__body"><span class="nds-list-item__title">주문 2</span><span class="nds-list-item__description">2026-05-24</span></div><span class="nds-list-item__trailing">1건</span></nds-list-item>
      </nds-list>
    </div>
    <div>
      <div class="compare-header">card + interactive</div>
      <nds-list id="ls" variant="card" style="width:320px">
        <nds-list-item interactive><span class="nds-list-item__leading">👤</span><div class="nds-list-item__body"><span class="nds-list-item__title">계정 설정</span><span class="nds-list-item__description">프로필 / 비밀번호</span></div><span class="nds-list-item__trailing">›</span></nds-list-item>
        <nds-list-item interactive><span class="nds-list-item__leading">🔔</span><div class="nds-list-item__body"><span class="nds-list-item__title">알림 설정</span></div><span class="nds-list-item__trailing">›</span></nds-list-item>
        <nds-list-item interactive disabled><span class="nds-list-item__leading">🚫</span><div class="nds-list-item__body"><span class="nds-list-item__title">비활성</span></div><span class="nds-list-item__trailing">›</span></nds-list-item>
      </nds-list>
      <p class="ev-log" id="list-log">최근 이벤트 — 없음</p>
    </div>
  </div>

  <script>${bundledJs}</script>
  <script>
    const chipLog = document.getElementById("chip-log");
    document.getElementById("ic1").addEventListener("chip-click", () => chipLog.textContent = "이벤트: chip-click on ic1 @ " + new Date().toLocaleTimeString());
    document.getElementById("ic2").addEventListener("chip-click", () => chipLog.textContent = "이벤트: chip-click on ic2 @ " + new Date().toLocaleTimeString());
    document.getElementById("ic3").addEventListener("chip-remove", () => chipLog.textContent = "이벤트: chip-remove on ic3 @ " + new Date().toLocaleTimeString());

    const cardLog = document.getElementById("card-log");
    document.getElementById("cc").addEventListener("card-click", () => cardLog.textContent = "이벤트: card-click @ " + new Date().toLocaleTimeString());

    const listLog = document.getElementById("list-log");
    document.getElementById("ls").addEventListener("list-item-select", (e) => {
      const li = e.target.querySelector("li");
      listLog.textContent = "이벤트: list-item-select — " + (li?.querySelector(".nds-list-item__title")?.textContent ?? "?") + " @ " + new Date().toLocaleTimeString();
    });
  </script>
</body>
</html>
`;

const outPath = path.join(__dirname, "nds-primitives.dist.html");
fs.writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
