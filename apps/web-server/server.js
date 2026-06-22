const path = require("node:path");
const fs = require("node:fs");
const express = require("express");

// 정적 파일 서버 전용 — Storybook + Docs(+ DS standalone 에셋)를 AWS Elastic Beanstalk 에서 서빙한다.
// 텔레메트리 수집/대시보드 표시는 Supabase 로 이관(supabase/README.md) — 여기서는 더 이상 다루지 않는다.
const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST;

const publicDir = path.join(__dirname, "public");
const dsStandaloneDir = path.resolve(__dirname, "../../packages/html/dist/standalone");
const staticOptions = {
  index: "index.html",
  extensions: ["html"],
  maxAge: "1h",
};

// ─────────────────────────────────────────────────────────────────────────
// DS 요청 폼 (/ds-request) — Slack 워크플로우 링크버튼 → 이 페이지 → Make 웹훅.
//   · GET  /ds-request          폼 HTML (채널/스레드/요청자는 URL 쿼리로 prefill)
//   · POST /ds-request/submit   받은 평평한 JSON 을 Make 웹훅으로 forward
//     (MAKE_WEBHOOK_URL 은 EB 환경변수에만 둠 → 클라이언트에 노출 안 됨)
// 필드·옵션·키 이름은 ds-request-bot 의 모달/페이로드와 1:1 미러.
// ─────────────────────────────────────────────────────────────────────────
const DS_REQUEST_OPTIONS = {
  type: ["컴포넌트", "토큰", "아이콘", "일러스트레이션", "버그", "기타"],
  project: ["Trost", "Runmile", "Geniet", "CashwalkBiz", "공통", "없음", "NudgeEAP"],
  priority: ["긴급", "높음", "보통", "낮음"],
};

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

function optionsHtml(values) {
  return [
    '<option value="">선택</option>',
    ...values.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`),
  ].join("");
}

function dsRequestFormHtml() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>디자인시스템 문의·요청</title>
<style>
  :root { --bg:#F5F5F5; --card:#FFFFFF; --text:#111; --muted:#777; --border:#D8D8D8; --focus:#017EE4; --btn:#111111; --btn-press:#000000; --error:#E33800; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif; line-height:1.5; }
  .wrap { max-width:560px; margin:0 auto; padding:32px 20px 64px; }
  h1 { font-size:22px; margin:0 0 4px; }
  .sub { color:var(--muted); font-size:14px; margin:0 0 24px; }
  .card { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:24px; }
  label { display:block; font-size:14px; font-weight:600; margin:18px 0 6px; }
  label:first-child { margin-top:0; }
  .req { color:var(--error); margin-left:2px; }
  .hint { font-weight:400; color:var(--muted); font-size:12px; margin:4px 0 0; }
  input[type=text], select, textarea { width:100%; padding:11px 12px; border:1px solid var(--border); border-radius:8px; font-size:15px; font-family:inherit; background:#fff; }
  input:focus, select:focus, textarea:focus { outline:none; border-color:var(--focus); box-shadow:0 0 0 3px rgba(1,126,228,.15); }
  textarea { min-height:80px; resize:vertical; }
  button { margin-top:28px; width:100%; padding:13px; border:0; border-radius:8px; background:var(--btn); color:#fff; font-size:16px; font-weight:600; cursor:pointer; }
  button:hover { background:var(--btn-press); }
  button:disabled { opacity:.5; cursor:default; }
  .msg { margin-top:16px; padding:12px 14px; border-radius:8px; font-size:14px; display:none; }
  .msg.ok { display:block; background:#E3F2FC; color:#0F52A0; }
  .msg.err { display:block; background:#FEE9E6; color:#A01C00; }
  .done .card { display:none; }
</style>
</head>
<body>
<div class="wrap" id="wrap">
  <h1>디자인시스템 문의·요청</h1>
  <p class="sub">디자인시스템 관련 문의·수정·업무요청을 남겨주세요.<br />요청 내용을 파악할 수 있을 정도로만 간단히 작성하면 됩니다 🙂</p>
  <div class="card">
    <form id="form">
      <label>제목<span class="req">*</span></label>
      <input type="text" name="title" required placeholder="요청 제목" />

      <label>타입<span class="req">*</span></label>
      <select name="type" required>${optionsHtml(DS_REQUEST_OPTIONS.type)}</select>

      <label>프로젝트<span class="req">*</span></label>
      <select name="project" required>${optionsHtml(DS_REQUEST_OPTIONS.project)}</select>

      <label>우선순위<span class="req">*</span></label>
      <select name="priority" required>${optionsHtml(DS_REQUEST_OPTIONS.priority)}</select>

      <label>설명</label>
      <textarea name="description" placeholder="요청 상세 내용"></textarea>

      <label>Figma URL</label>
      <textarea name="figmaUrl" placeholder="https://figma.com/..."></textarea>
      <p class="hint">여러 개면 줄바꿈으로 한 줄에 하나씩 작성해주세요.</p>

      <label>GitHub PR</label>
      <textarea name="githubPr" placeholder="https://github.com/..."></textarea>
      <p class="hint">여러 개면 줄바꿈으로 한 줄에 하나씩 작성해주세요.</p>

      <button type="submit" id="submit">요청 보내기</button>
    </form>
    <div class="msg" id="err"></div>
  </div>
  <div class="msg" id="ok">✅ 디자인시스템 요청이 접수되었습니다. 확인 후 처리할게요! 이 창은 닫으셔도 됩니다.</div>
</div>
<script>
  var params = new URLSearchParams(location.search);
  var ctx = {
    requester: params.get("user") || "",
    slackChannelId: params.get("channel") || "",
    slackThreadUrl: params.get("thread") || "",
  };
  var form = document.getElementById("form");
  var btn = document.getElementById("submit");
  var err = document.getElementById("err");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.classList.remove("err");
    btn.disabled = true; btn.textContent = "보내는 중…";
    var data = Object.fromEntries(new FormData(form).entries());
    Object.assign(data, ctx);
    fetch("/ds-request/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(function (r) {
      if (!r.ok) throw new Error("서버 응답 " + r.status);
      document.getElementById("wrap").classList.add("done");
      document.getElementById("ok").classList.add("ok");
    }).catch(function (ex) {
      btn.disabled = false; btn.textContent = "요청 보내기";
      err.textContent = "전송 실패: " + ex.message + " — 잠시 후 다시 시도해주세요.";
      err.classList.add("err");
    });
  });
</script>
</body>
</html>`;
}

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.get("/ds-request", (_req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.set("Cache-Control", "no-store");
  res.send(dsRequestFormHtml());
});

app.post("/ds-request/submit", express.json(), async (req, res) => {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[ds-request] MAKE_WEBHOOK_URL not set");
    return res.status(500).json({ error: "webhook not configured" });
  }
  const b = req.body || {};
  if (!b.title) return res.status(400).json({ error: "title required" });

  const payload = {
    title: b.title,
    type: b.type || "",
    project: b.project || "",
    priority: b.priority || "",
    status: "접수",
    description: b.description || "",
    requester: b.requester || "",
    figmaUrl: b.figmaUrl || "",
    githubPr: b.githubPr || "",
    slackChannelId: b.slackChannelId || "",
    slackThreadUrl: b.slackThreadUrl || "",
    createdAt: new Date().toISOString(),
  };

  try {
    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      throw new Error(`Make responded ${r.status}: ${text}`);
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("[ds-request] forward to Make failed:", error.message);
    res.status(502).json({ error: "forward failed" });
  }
});

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

if (fs.existsSync(dsStandaloneDir)) {
  app.use(
    "/nds",
    express.static(dsStandaloneDir, {
      maxAge: "1h",
      extensions: ["css", "js", "json"],
    }),
  );
}

// /docs 경로로 들어오는 요청은 새 루트로 영구 리다이렉트 (기존 북마크/링크 호환).
app.use((req, res, next) => {
  if (req.path === "/docs" || req.path.startsWith("/docs/")) {
    const target = req.originalUrl.replace(/^\/docs(\/|$)/, "/");
    return res.redirect(301, target);
  }
  next();
});

app.use("/storybook", express.static(path.join(publicDir, "storybook"), staticOptions));
app.use("/", express.static(path.join(publicDir, "docs"), staticOptions));

app.use((_req, res) => res.status(404).send("Not Found"));

app.listen(port, host, () => {
  console.log(`[web-server] listening on ${host ? `${host}:` : ""}${port}`);
});
