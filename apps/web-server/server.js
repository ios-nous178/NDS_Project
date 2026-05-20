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

const logoSvg = `<?xml version="1.0" encoding="utf-8" ?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="754" height="717" viewBox="0 0 754 717"><clipPath id="cl_3"><rect width="754" height="717"/></clipPath><g clip-path="url(#cl_3)"><path transform="translate(-147 0)" d="M655.747 118.708C660.818 117.954 679.625 118.316 685.11 118.543C685.272 124.633 684.908 132.099 684.905 138.451L684.674 205.57L684.744 246.255C684.774 250.939 685.297 263.822 684.596 267.675C684.196 267.624 683.795 267.575 683.394 267.531C648.994 263.712 605.781 273.498 576.138 291.051C564.031 298.221 552.709 307.552 541.71 316.292C577.596 315.825 613.624 316.75 649.526 316.393C661.292 316.276 673.327 316.241 685.087 316.537L684.898 403.67C684.919 425.031 685.431 448.281 684.946 469.499C670.351 470.076 651.928 469.571 637.108 469.567L542.477 469.479C541.82 428.264 542.828 386.769 542.435 345.532C542.346 336.106 542.894 326.13 541.921 316.796C507.64 347.185 485.979 389.308 481.206 434.87C479.168 452.528 479.946 472.794 479.941 490.884L479.875 581.372C479.844 586.875 480.646 616.797 478.749 619.884C475.221 620.496 468.845 620.242 464.986 620.253L440.634 620.321C407.441 620.404 372.627 619.71 339.612 620.471C339.406 610.614 339.824 598.991 339.819 588.884L339.841 506.694C339.885 482.287 339.015 448.042 340.904 424.346C346.897 352.457 375.929 284.422 423.683 230.353C465.443 182.392 526.56 143.367 588.46 127.979C610.958 122.386 632.738 120.27 655.747 118.708Z"/></g></svg>`;
app.get("/favicon.svg", (_req, res) => {
  res.set("Content-Type", "image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(logoSvg);
});
app.get("/favicon.ico", (_req, res) => res.redirect(301, "/favicon.svg"));
app.get("/logo.svg", (_req, res) => {
  res.set("Content-Type", "image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(logoSvg);
});

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
      .brand-logo {
        display: block;
        width: 42px;
        height: auto;
        margin: 0 auto 18px;
      }
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
      <img class="brand-logo" src="/logo.svg" alt="Nudge Design" width="42" height="40" />
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
