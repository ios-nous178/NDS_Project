const path = require("node:path");
const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

const publicDir = path.join(__dirname, "public");
const staticOptions = {
  index: "index.html",
  extensions: ["html"],
  maxAge: "1h",
};

app.get("/health", (_req, res) => res.status(200).send("ok"));

const faviconSvg = `<?xml version="1.0" encoding="utf-8" ?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="40 30 940 940"><path fill="currentColor" d="M404.652 131.199C405.185 131.192 405.718 131.185 406.252 131.177C422.705 131.169 438.435 137.939 449.741 149.893C469.149 170.318 468.935 190.059 468.951 215.939C469.007 228.604 468.862 241.27 468.517 253.931C475.129 248.14 484.508 238.369 490.95 232.018L537.294 186.166C552.7 171.058 562.822 157.341 585.852 154.432C602.998 152.267 619.662 155.95 633.458 166.516C647.027 176.875 655.893 192.226 658.086 209.155C660.561 229.561 654.748 247.89 639.88 262.41C623.436 278.47 607.117 295.053 590.782 311.222L526.481 375.217C519.918 381.858 513.293 388.436 506.607 394.951C501.313 400.051 493.824 406.609 489.426 412.417C508.801 416.083 530.073 419.195 549.731 422.616L641.777 439.017L684.518 446.54C694.099 448.206 702.506 448.847 711.845 451.981C723.512 456.022 734.125 462.625 742.904 471.307C767.531 495.988 766.603 518.979 766.664 550.921L766.591 603.437L766.663 774.632C766.669 800.084 762.165 819.618 743.377 838.314C716.703 864.858 687.691 861.021 653.75 860.926L483.177 860.891L440.513 860.916C429.349 860.922 417.708 861.511 406.791 859.4C370.862 852.452 344.807 822.648 344.751 785.691C344.735 774.831 344.621 763.646 344.416 752.79C343.287 751.733 342.167 750.666 341.057 749.59C325.01 734.031 308.64 716.919 292.82 700.989L212.86 621.114L170.911 579.219C165.04 573.354 151.593 561.072 147.552 554.596C131.093 528.213 135.528 490.766 157.594 468.637C169.421 456.767 185.495 450.104 202.251 450.127C216.627 450.173 231.942 455.634 241.98 466.002C245.708 469.852 249.47 473.681 253.271 477.458L287.69 512.342C305.303 530.354 324.069 548.166 341.883 566.146C342.948 543.205 342.318 517.617 342.556 494.451L343.378 275.069L343.598 219.392C343.623 211.636 343.739 203.892 343.816 196.143C344.16 161.456 369.738 133.81 404.652 131.199Z"/><path fill="currentColor" d="M792.086 152.946C845.037 148.097 891.835 187.232 896.432 240.206C901.03 293.179 861.674 339.791 808.679 344.138C756.038 348.455 709.805 309.419 705.238 256.799C700.672 204.179 739.488 157.762 792.086 152.946Z"/></svg>`;
app.get("/favicon.svg", (_req, res) => {
  res.set("Content-Type", "image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(faviconSvg);
});
app.get("/favicon.ico", (_req, res) => res.redirect(301, "/favicon.svg"));

app.use("/storybook", express.static(path.join(publicDir, "storybook"), staticOptions));
app.use("/docs", express.static(path.join(publicDir, "docs"), staticOptions));

app.get("/", (_req, res) => {
  res.send(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>넛지 디자인시스템</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
    <link
      rel="preload"
      as="style"
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
    />
    <style>
      /* Pretendard load 동안 swap CLS 방지 — local 폴백을 Pretendard 메트릭에 맞춰 정렬 */
      @font-face {
        font-family: "PretendardFallback";
        src: local("Apple SD Gothic Neo"), local("Malgun Gothic"), local("Segoe UI"),
          local("Helvetica Neue");
        size-adjust: 100%;
        ascent-override: 92%;
        descent-override: 23%;
        line-gap-override: 0%;
      }
      * { box-sizing: border-box; }
      html {
        /* 콘텐츠 높이 변화로 인한 수평 wobble 방지 */
        overflow-y: scroll;
      }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Pretendard Variable", Pretendard, PretendardFallback,
          -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #ffffff;
        color: #0f172a;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-font-smoothing: antialiased;
      }
      .wrap { text-align: center; padding: 48px 32px; width: 100%; max-width: 560px; }
      .eyebrow {
        display: inline-block;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: #64748b;
        text-transform: uppercase;
        margin-bottom: 16px;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 36px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #0f172a;
      }
      p.lead {
        margin: 0 0 36px;
        font-size: 16px;
        line-height: 1.6;
        color: #475569;
      }
      .links { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
      .btn {
        display: inline-flex;
        align-items: center;
        padding: 12px 22px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        text-decoration: none;
        transition: background 0.15s ease, border-color 0.15s ease;
      }
      .btn.primary {
        background: #0f172a;
        color: #ffffff;
      }
      .btn.primary:hover { background: #1e293b; }
      .btn.secondary {
        background: #ffffff;
        color: #0f172a;
        border: 1px solid #e2e8f0;
      }
      .btn.secondary:hover { border-color: #cbd5e1; background: #f8fafc; }

      .shortcuts {
        margin-top: 48px;
        padding-top: 28px;
        border-top: 1px solid #e2e8f0;
      }
      .shortcuts-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        color: #94a3b8;
        text-transform: uppercase;
        margin-bottom: 14px;
      }
      .shortcuts-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .shortcut {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        text-decoration: none;
        color: #0f172a;
        background: #ffffff;
        transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
      }
      .shortcut:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }
      .shortcut-text { text-align: left; }
      .shortcut-title { display: block; font-size: 14px; font-weight: 600; color: #0f172a; }
      .shortcut-sub { display: block; font-size: 12px; color: #64748b; margin-top: 2px; }
      .shortcut-arrow { color: #94a3b8; font-size: 16px; line-height: 1; }
      .shortcut:hover .shortcut-arrow { color: #0f172a; }

      .resources {
        margin-top: 24px;
      }
      .resources-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        color: #94a3b8;
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      .resource {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        text-decoration: none;
        color: #0f172a;
        background: #ffffff;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .resource:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }
      .resource-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #f1f5f9;
        color: #475569;
        flex-shrink: 0;
      }
      .resource-text { flex: 1; text-align: left; min-width: 0; }
      .resource-title { display: block; font-size: 14px; font-weight: 600; color: #0f172a; }
      .resource-sub { display: block; font-size: 12px; color: #64748b; margin-top: 2px; }
      .resource-arrow { color: #94a3b8; font-size: 15px; line-height: 1; }
      .resource:hover .resource-arrow { color: #0f172a; }

      @media (max-width: 480px) {
        .shortcuts-grid { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <span class="eyebrow">Design System</span>
      <h1>넛지 디자인시스템</h1>
      <p class="lead">토큰, 컴포넌트, 문서를 한곳에서 관리합니다.</p>
      <div class="links">
        <a class="btn primary" href="/docs/" target="_blank" rel="noopener noreferrer">Docs</a>
        <a class="btn secondary" href="/storybook/" target="_blank" rel="noopener noreferrer">Storybook</a>
      </div>

      <section class="shortcuts">
        <div class="shortcuts-label">바로 가기</div>
        <div class="shortcuts-grid">
          <a class="shortcut" href="/storybook/?path=/story/foundations-all-components--catalog-all" target="_blank" rel="noopener noreferrer">
            <span class="shortcut-text">
              <span class="shortcut-title">전체 컴포넌트</span>
              <span class="shortcut-sub">Foundations · All Components</span>
            </span>
            <span class="shortcut-arrow" aria-hidden="true">→</span>
          </a>
          <a class="shortcut" href="/storybook/?path=/story/foundations-icons--all" target="_blank" rel="noopener noreferrer">
            <span class="shortcut-text">
              <span class="shortcut-title">아이콘</span>
              <span class="shortcut-sub">Foundations · Icons</span>
            </span>
            <span class="shortcut-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section class="resources">
        <div class="resources-label">설치 / 업데이트</div>
        <a class="resource" href="https://www.notion.so/cashwalkteam/35ea054b7d82807bb097c6c9d6b3d272" target="_blank" rel="noopener noreferrer">
          <span class="resource-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 5.5L11 4v8H3V5.5zM12 3.8L21 2.5V12h-9V3.8zM3 13h8v8L3 19.5V13zm9 0h9v9.5L12 21v-8z" fill="currentColor"/>
            </svg>
          </span>
          <span class="resource-text">
            <span class="resource-title">디자인시스템 설치 / 업데이트 가이드</span>
            <span class="resource-sub">Notion · 비개발자용 셋업 문서</span>
          </span>
          <span class="resource-arrow" aria-hidden="true">↗</span>
        </a>
      </section>

      <section class="resources">
        <div class="resources-label">목업 작성 가이드</div>
        <a class="resource" href="http://nudge-eap-design-system.eba-afhh232q.ap-northeast-2.elasticbeanstalk.com/docs/NUDGE_EAP_DS_MCP_USAGE" target="_blank" rel="noopener noreferrer">
          <span class="resource-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="M14 2v6h6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="resource-text">
            <span class="resource-title">디자인시스템 MCP 활용 가이드</span>
            <span class="resource-sub">Docs · 목업 작성 규칙 및 MCP 사용법</span>
          </span>
          <span class="resource-arrow" aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  </body>
</html>`);
});

app.use((_req, res) => res.status(404).send("Not Found"));

app.listen(port, () => {
  console.log(`[web-server] listening on ${port}`);
});
