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

app.use("/storybook", express.static(path.join(publicDir, "storybook"), staticOptions));
app.use("/docs", express.static(path.join(publicDir, "docs"), staticOptions));

app.get("/", (_req, res) => {
  res.send(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>NudgeEAP Design System</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Pretendard, sans-serif;
        display: grid; place-items: center; min-height: 100vh; margin: 0;
        background: radial-gradient(circle at 20% 20%, #1a2238 0%, #0b0f17 60%);
        color: #e6edf3;
      }
      .wrap { text-align: center; padding: 24px; }
      h1 { margin: 0 0 8px; font-size: 32px; font-weight: 700; }
      p { margin: 0 0 32px; color: #9ba7b4; }
      .links { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
      a {
        display: inline-block; padding: 14px 26px; border-radius: 10px;
        background: #2563eb; color: white; text-decoration: none; font-weight: 600;
        transition: background 0.15s ease;
      }
      a:hover { background: #1d4ed8; }
      a.secondary { background: #334155; }
      a.secondary:hover { background: #475569; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <h1>NudgeEAP Design System</h1>
      <p>토큰, 컴포넌트, 문서를 한곳에서 관리합니다.</p>
      <div class="links">
        <a href="/docs/">Docs</a>
        <a href="/storybook/" class="secondary">Storybook</a>
      </div>
    </main>
  </body>
</html>`);
});

app.use((_req, res) => res.status(404).send("Not Found"));

app.listen(port, () => {
  console.log(`[web-server] listening on ${port}`);
});
