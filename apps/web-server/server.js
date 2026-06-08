const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const express = require("express");

const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST;
const dataDir = process.env.NUDGE_DASHBOARD_DB_DIR || path.join(__dirname, "data");
const jsonLimit = process.env.NUDGE_DASHBOARD_JSON_LIMIT || "2mb";

const publicDir = path.join(__dirname, "public");
const dsStandaloneDir = path.resolve(__dirname, "../../packages/html/dist/standalone");
const staticOptions = {
  index: "index.html",
  extensions: ["html"],
  maxAge: "1h",
};

app.use(express.json({ limit: jsonLimit }));

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

const collections = {
  sessions: "sessions.jsonl",
  messages: "messages.jsonl",
  reviews: "reviews.jsonl",
  usage: "usage.jsonl",
  events: "events.jsonl",
  quality: "quality.jsonl",
  runs: "mockup-runs.jsonl",
  violations: "violations.jsonl",
  artifacts: "artifacts.jsonl",
};

function ensureDataDir() {
  fs.mkdirSync(dataDir, { recursive: true });
}

function collectionPath(name) {
  return path.join(dataDir, collections[name]);
}

function stableId(prefix, seed) {
  const body =
    typeof seed === "string" ? seed : JSON.stringify(seed ?? `${Date.now()}-${Math.random()}`);
  return `${prefix}_${crypto.createHash("sha256").update(body).digest("hex").slice(0, 16)}`;
}

function appendJsonl(name, row) {
  ensureDataDir();
  const stamped = {
    ...row,
    receivedAt: row.receivedAt || new Date().toISOString(),
  };
  fs.appendFileSync(collectionPath(name), `${JSON.stringify(stamped)}\n`, "utf8");
  return stamped;
}

function readJsonl(name) {
  const file = collectionPath(name);
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function latestBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const id = row[key];
    if (!id) continue;
    map.set(id, { ...(map.get(id) || {}), ...row });
  }
  return [...map.values()];
}

function avg(nums) {
  const values = nums.filter((n) => typeof n === "number" && Number.isFinite(n));
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, n) => sum + n, 0) / values.length);
}

function tally(rows, getter, limit = 8) {
  const counts = new Map();
  for (const row of rows) {
    const value = getter(row);
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function rowTime(row) {
  return (
    Date.parse(
      row.timestamp || row.loggedAt || row.createdAt || row.updatedAt || row.receivedAt || "",
    ) || 0
  );
}

function sortRecent(rows) {
  return [...rows].sort((a, b) => rowTime(b) - rowTime(a));
}

function rowSessionId(row) {
  return (
    row.sessionId ||
    row.clientSessionId ||
    row.metadata?.sessionId ||
    row.payload?.sessionId ||
    row.context?.sessionId ||
    null
  );
}

function rowMockupFile(row) {
  if (!row) return null;
  return (
    row.mockupFile || row.mockupName || row.metadata?.mockupFile || row.payload?.mockupFile || null
  );
}

function rowClient(row) {
  return row && row.client && typeof row.client === "object" ? row.client : null;
}

function rowStatus(row) {
  if (!row) return null;
  if (row.status) return row.status;
  if (row.type === "error_occurred" || row.eventType === "error_occurred") return "failed";
  if (row.verdict === "fail") return "failed";
  if (row.type || row.eventType || row.runId || row.mockupFile) return "completed";
  return null;
}

// 세션을 대표하는 클라이언트(agent/surface)를 고른다 — runs/quality/events 순으로 최신부터
// 훑어 agent 또는 surface 가 채워진 첫 레코드의 client 를 쓴다(레코드는 sortRecent 정렬).
function pickClient(...rowLists) {
  for (const list of rowLists) {
    for (const row of list || []) {
      const client = rowClient(row);
      if (client && (client.agent || client.surface)) return client;
    }
  }
  return null;
}

function sessionMockupKeys(session) {
  if (!session) return new Set();
  return new Set(
    [
      session.mockupFile,
      session.mockupName,
      session.title,
      session.metadata?.mockupFile,
      session.metadata?.mockupName,
      session.metadata?.screen,
    ].filter(Boolean),
  );
}

function matchesSession(row, session, runIds = new Set()) {
  const sessionId = session.clientId;
  if (!sessionId) return false;
  if (rowSessionId(row) === sessionId) return true;
  if (row.runId && runIds.has(row.runId)) return true;
  const mockupFile = rowMockupFile(row);
  return Boolean(mockupFile && sessionMockupKeys(session).has(mockupFile));
}

function sessionTitle(session) {
  return (
    session.title ||
    session.metadata?.screen ||
    session.metadata?.mockupName ||
    session.metadata?.mockupFile ||
    session.clientId ||
    "Untitled session"
  );
}

function buildSyntheticSessions(rows) {
  const existingIds = new Set(rows.sessions.map((row) => row.clientId).filter(Boolean));
  const existingMockups = new Set(rows.sessions.flatMap((row) => [...sessionMockupKeys(row)]));
  const grouped = new Map();
  const sourceRows = [
    ...rows.runs,
    ...rows.quality,
    ...rows.usage,
    ...rows.events,
    ...rows.reviews,
    ...rows.violations,
    ...rows.artifacts,
  ];

  for (const row of sourceRows) {
    const explicitSessionId = rowSessionId(row);
    const mockupFile = rowMockupFile(row);
    if (explicitSessionId && existingIds.has(explicitSessionId)) continue;
    if (!explicitSessionId && mockupFile && existingMockups.has(mockupFile)) continue;
    const clientId =
      explicitSessionId || (mockupFile ? stableId("mockup-session", mockupFile) : null);
    if (!clientId || existingIds.has(clientId)) continue;
    const prev = grouped.get(clientId);
    const client = rowClient(row) || rowClient(prev) || null;
    const timestamp = row.timestamp || row.loggedAt || row.createdAt || row.receivedAt || null;
    grouped.set(clientId, {
      ...(prev || {}),
      clientId,
      userId: row.userId || prev?.userId || null,
      tool: client?.agent || row.tool || row.agentType || prev?.tool || "unknown",
      title: mockupFile || row.mockupName || prev?.title || clientId,
      status: rowStatus(row) || prev?.status || "completed",
      metadata: {
        ...(prev?.metadata || {}),
        mockupFile: mockupFile || prev?.metadata?.mockupFile || null,
        mockupName: row.mockupName || prev?.metadata?.mockupName || null,
        client: client || prev?.metadata?.client || null,
        synthetic: true,
      },
      receivedAt: timestamp || prev?.receivedAt || new Date().toISOString(),
    });
  }
  return [...grouped.values()];
}

function loadDashboardRows() {
  const rows = {
    sessions: latestBy(readJsonl("sessions"), "clientId"),
    messages: readJsonl("messages"),
    reviews: readJsonl("reviews"),
    usage: readJsonl("usage"),
    events: readJsonl("events"),
    quality: readJsonl("quality"),
    runs: readJsonl("runs"),
    violations: readJsonl("violations"),
    artifacts: readJsonl("artifacts"),
  };
  rows.sessions = latestBy([...rows.sessions, ...buildSyntheticSessions(rows)], "clientId");
  return rows;
}

function buildSessionDetail(sessionId) {
  const rows = loadDashboardRows();
  const session = rows.sessions.find((row) => row.clientId === sessionId);
  if (!session) return null;

  const messages = sortRecent(rows.messages.filter((row) => row.sessionId === sessionId)).reverse();
  const runs = sortRecent(rows.runs.filter((row) => matchesSession(row, session)));
  const runIds = new Set(runs.map((row) => row.runId).filter(Boolean));
  const usage = sortRecent(rows.usage.filter((row) => matchesSession(row, session, runIds)));
  const quality = sortRecent(rows.quality.filter((row) => matchesSession(row, session, runIds)));
  for (const row of quality) {
    if (row.runId) runIds.add(row.runId);
  }
  const events = sortRecent(rows.events.filter((row) => matchesSession(row, session, runIds)));
  const reviews = sortRecent(rows.reviews.filter((row) => matchesSession(row, session, runIds)));
  const violations = sortRecent(
    rows.violations.filter((row) => matchesSession(row, session, runIds)),
  );
  const artifacts = sortRecent(
    rows.artifacts.filter((row) => matchesSession(row, session, runIds)),
  );
  const latestUsage = usage[0];
  const latestQuality = quality[0];
  const client = pickClient(runs, quality, events);

  return {
    session,
    summary: {
      title: sessionTitle(session),
      status: session.status || "unknown",
      tool: session.tool || session.agentType || "unknown",
      agent: client?.agent || null,
      surface: client?.surface || null,
      clientName: client?.clientName || null,
      clientVersion: client?.clientVersion || null,
      messages: messages.length,
      runs: runs.length,
      usage: usage.length,
      quality: quality.length,
      events: events.length,
      reviews: reviews.length,
      violations: violations.length,
      artifacts: artifacts.length,
      avgAdoptionRatio: avg(usage.map((row) => row.meta?.adoptionRatio ?? row.adoptionRatio)),
      avgQualityScore: avg(
        quality.map((row) => row.overall ?? row.codeScores?.overall ?? row.codeOverall),
      ),
      latestMockup: rowMockupFile(latestUsage) || rowMockupFile(runs[0]) || null,
      latestVerdict: latestQuality?.verdict || null,
    },
    messages,
    runs,
    usage,
    quality,
    events,
    reviews,
    violations,
    artifacts,
  };
}

function buildSessionSummaries() {
  return sortRecent(loadDashboardRows().sessions).map((session) => {
    const detail = buildSessionDetail(session.clientId);
    return {
      clientId: session.clientId,
      title: sessionTitle(session),
      status: session.status || "unknown",
      tool: session.tool || session.agentType || "unknown",
      receivedAt: session.receivedAt,
      summary: detail?.summary || {},
    };
  });
}

function dashboardData() {
  const { sessions, messages, reviews, usage, events, quality, runs, violations, artifacts } =
    loadDashboardRows();
  const latestUsageByMockup = latestBy(
    usage.map((row) => ({
      ...row,
      mockupKey: row.mockupFile || row.mockupName || row.usageId || row.clientId,
    })),
    "mockupKey",
  );
  const latestQualityByRun = latestBy(
    quality.map((row) => ({
      ...row,
      qualityKey: row.runId || row.mockupFile || row.clientId,
    })),
    "qualityKey",
  );
  const usageRatios = latestUsageByMockup.map(
    (row) => row.meta?.adoptionRatio ?? row.adoptionRatio,
  );
  const qualityScores = latestQualityByRun.map(
    (row) => row.overall ?? row.codeScores?.overall ?? row.codeOverall,
  );
  const violationRows = events.filter((row) => row.type === "validation_completed");

  return {
    generatedAt: new Date().toISOString(),
    dataDir,
    totals: {
      sessions: sessions.length,
      messages: messages.length,
      reviews: reviews.length,
      usage: usage.length,
      events: events.length,
      quality: quality.length,
      runs: runs.length,
      violations: violations.length,
      artifacts: artifacts.length,
      mockups: latestUsageByMockup.length,
    },
    health: {
      avgAdoptionRatio: avg(usageRatios),
      avgQualityScore: avg(qualityScores),
      completedSessions: sessions.filter((s) => s.status === "completed").length,
      failedSessions: sessions.filter((s) => s.status === "failed").length,
      exports: events.filter((e) => e.type === "export_completed").length,
      validations: violationRows.length,
      blockingViolations: violations.filter((row) => row.severity === "error").length,
    },
    breakdowns: {
      brands: tally(latestUsageByMockup, (row) => row.brand || "unknown"),
      dsVersions: tally(
        latestUsageByMockup,
        (row) => row.dsVersions?.primary || row.dsVersion || "unknown",
      ),
      sessionStatus: tally(sessions, (row) => row.status || "unknown"),
      tools: tally(sessions, (row) => row.tool || row.agentType || "unknown"),
      reviewKinds: tally(reviews, (row) => row.category || row.kind || "unknown"),
      eventTypes: tally(events, (row) => row.type || "unknown"),
      // 어떤 에이전트(codex/claude)·표면(code/cli/chat)이 호출했나 — client 가 붙은
      // 모든 레코드(runs/quality/events)를 합쳐 집계.
      agents: tally([...runs, ...quality, ...events], (row) => rowClient(row)?.agent || null),
      surfaces: tally([...runs, ...quality, ...events], (row) => rowClient(row)?.surface || null),
    },
    recent: {
      sessions: sessions.slice(-12).reverse(),
      usage: usage.slice(-12).reverse(),
      reviews: reviews.slice(-12).reverse(),
      quality: quality.slice(-12).reverse(),
      events: events.slice(-12).reverse(),
      runs: runs.slice(-12).reverse(),
      violations: violations.slice(-12).reverse(),
      artifacts: artifacts.slice(-12).reverse(),
    },
  };
}

app.post("/sessions/import", (req, res) => {
  const body = req.body || {};
  const clientId = body.clientId || stableId("session", body);
  const session = appendJsonl("sessions", {
    clientId,
    userId: body.userId || null,
    tool: body.tool || body.agentType || "unknown",
    title: body.title || null,
    status: body.status || "unknown",
    mockupFile: body.mockupFile || body.metadata?.mockupFile || null,
    mockupName: body.mockupName || body.metadata?.mockupName || null,
    client: body.client || body.metadata?.client || null,
    metadata: body.metadata || {},
  });
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const storedMessages = messages.map((message, index) =>
    appendJsonl("messages", {
      ...message,
      clientId: message.clientId || `${clientId}#${index}`,
      sessionId: clientId,
      userId: body.userId || null,
    }),
  );
  res.json({ ok: true, session, messages: storedMessages.length });
});

app.post("/reviews", (req, res) => {
  const body = req.body || {};
  const clientId = body.clientId || stableId("review", body);
  const review = appendJsonl("reviews", {
    clientId,
    sessionId: body.sessionId || body.metadata?.sessionId || null,
    userId: body.userId || null,
    category: body.category || body.kind || "feedback",
    content: body.content || body.comment || "",
    mockupFile: body.mockupFile || body.metadata?.mockupFile || null,
    screen: body.screen || body.metadata?.screen || null,
    metadata: body.metadata || {},
  });
  res.json({ ok: true, review });
});

app.post("/usage/import", (req, res) => {
  const body = req.body || {};
  const rows = Array.isArray(body) ? body : [body];
  const stored = rows.map((row) =>
    appendJsonl("usage", {
      ...row,
      clientId: row.clientId || row.usageId || stableId("usage", row),
    }),
  );
  res.json({ ok: true, count: stored.length });
});

app.post("/events/import", (req, res) => {
  const body = req.body || {};
  const rows = Array.isArray(body) ? body : [body];
  const stored = rows.map((row) =>
    appendJsonl("events", {
      ...row,
      clientId: row.clientId || row.eventId || stableId("event", row),
    }),
  );
  res.json({ ok: true, count: stored.length });
});

app.post("/quality/import", (req, res) => {
  const body = req.body || {};
  const rows = Array.isArray(body) ? body : [body];
  const stored = rows.map((row) =>
    appendJsonl("quality", {
      ...row,
      clientId: row.clientId || row.runId || stableId("quality", row),
    }),
  );
  res.json({ ok: true, count: stored.length });
});

app.post("/mockup-runs/import", (req, res) => {
  const body = req.body || {};
  const rows = Array.isArray(body) ? body : [body];
  const stored = rows.map((row) =>
    appendJsonl("runs", {
      ...row,
      clientId: row.clientId || row.runId || stableId("run", row),
    }),
  );
  res.json({ ok: true, count: stored.length });
});

app.post("/violations/import", (req, res) => {
  const body = req.body || {};
  const rows = Array.isArray(body) ? body : [body];
  const stored = rows.map((row) =>
    appendJsonl("violations", {
      ...row,
      clientId: row.clientId || stableId("violation", row),
    }),
  );
  res.json({ ok: true, count: stored.length });
});

app.post("/artifacts/import", (req, res) => {
  const body = req.body || {};
  const rows = Array.isArray(body) ? body : [body];
  const stored = rows.map((row) =>
    appendJsonl("artifacts", {
      ...row,
      clientId: row.clientId || row.artifactId || stableId("artifact", row),
    }),
  );
  res.json({ ok: true, count: stored.length });
});

app.get("/api/analytics/summary", (_req, res) => {
  res.json(dashboardData());
});

app.get("/api/sessions", (_req, res) => {
  res.json({ rows: buildSessionSummaries() });
});

app.get("/api/sessions/:sessionId", (req, res) => {
  const detail = buildSessionDetail(req.params.sessionId);
  if (!detail) return res.status(404).json({ error: "Unknown session" });
  res.json(detail);
});

app.get("/api/:collection", (req, res) => {
  const name = req.params.collection;
  if (!collections[name]) return res.status(404).json({ error: "Unknown collection" });
  res.json({ rows: readJsonl(name) });
});

app.get("/dashboard", (_req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(dashboardHtml());
});

app.get("/admin", (_req, res) => res.redirect(302, "/dashboard"));

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

function dashboardHtml() {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nudge DS 로그 대시보드</title>
    <link rel="stylesheet" href="/nds/tokens.css" />
    <link rel="stylesheet" href="/nds/styles.css" />
    <script src="/nds/nudge-ds.runtime.js" defer></script>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f7f9;
        --surface: #ffffff;
        --surface-soft: #f0f3f6;
        --text: #20242a;
        --muted: #667085;
        --line: #d9dee7;
        --brand: #1677ff;
        --green: #15803d;
        --yellow: #b7791f;
        --red: #c2410c;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      header {
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 28px;
        background: var(--surface);
        border-bottom: 1px solid var(--line);
        position: sticky;
        top: 0;
        z-index: 2;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 760;
        font-size: 18px;
      }
      .brand img { width: 28px; height: 28px; }
      .header-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--muted);
        font-size: 13px;
      }
      main {
        max-width: 1440px;
        margin: 0 auto;
        padding: 24px 28px 40px;
      }
      .grid {
        display: grid;
        gap: 16px;
      }
      .kpis {
        grid-template-columns: repeat(6, minmax(0, 1fr));
      }
      .two {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        margin-top: 16px;
      }
      .three {
        grid-template-columns: 1.15fr 1fr 1fr;
        margin-top: 16px;
      }
      nds-card {
        display: block;
        width: 100%;
        min-width: 0;
      }
      /* nds-card 내부 래퍼까지 셀 폭을 그대로 물려받게 — 안 그러면 카드가 콘텐츠 폭으로만
         줄어 grid 셀이 애매하게 비어 보인다. */
      nds-card::part(card),
      nds-card > * {
        width: 100%;
        box-sizing: border-box;
      }
      .panel {
        padding: 16px;
        width: 100%;
        min-width: 0;
      }
      .kpi .label {
        color: var(--muted);
        font-size: 12px;
        font-weight: 680;
      }
      .kpi .value {
        margin-top: 8px;
        font-size: 28px;
        line-height: 34px;
        font-weight: 800;
      }
      .kpi .sub {
        margin-top: 6px;
        color: var(--muted);
        font-size: 12px;
      }
      h2 {
        margin: 0 0 12px;
        font-size: 15px;
        line-height: 22px;
      }
      .bars {
        display: grid;
        gap: 10px;
      }
      .bar-row {
        display: grid;
        grid-template-columns: minmax(84px, 140px) 1fr 36px;
        align-items: center;
        gap: 10px;
        font-size: 13px;
      }
      .bar-label {
        color: var(--muted);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .bar-track {
        height: 8px;
        background: var(--surface-soft);
        border-radius: 999px;
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        min-width: 3px;
        background: var(--brand);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      .table-scroll {
        width: 100%;
        overflow-x: auto;
      }
      .data-table {
        table-layout: fixed;
      }
      th, td {
        text-align: left;
        padding: 10px 8px;
        border-bottom: 1px solid var(--line);
        vertical-align: top;
        min-width: 0;
      }
      th {
        color: var(--muted);
        font-size: 12px;
        font-weight: 760;
      }
      td {
        color: var(--text);
      }
      .data-table th,
      .data-table td {
        overflow: hidden;
        overflow-wrap: anywhere;
        word-break: keep-all;
      }
      .col-main { width: auto; }
      .col-badge { width: 86px; }
      .col-agent { width: 148px; }
      .col-score { width: 56px; text-align: right; }
      .col-percent { width: 58px; text-align: right; }
      .col-version { width: 72px; text-align: right; }
      .col-verdict { width: 76px; }
      .col-screen { width: 132px; }
      .col-badge,
      .col-score,
      .col-percent,
      .col-version,
      .col-verdict {
        white-space: nowrap;
      }
      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
      }
      .path-cell,
      .text-cell {
        display: -webkit-box;
        max-width: 100%;
        overflow: hidden;
        -webkit-box-orient: vertical;
      }
      .path-cell {
        -webkit-line-clamp: 2;
        word-break: break-all;
      }
      .text-cell {
        -webkit-line-clamp: 2;
        line-height: 18px;
      }
      .pass { color: var(--green); }
      .warn { color: var(--yellow); }
      .fail { color: var(--red); }
      .empty {
        color: var(--muted);
        background: var(--surface-soft);
        border-radius: 6px;
        padding: 18px;
        font-size: 13px;
      }
      .session-toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }
      .session-search {
        flex: 1;
        height: 34px;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 0 12px;
        font-size: 13px;
        background: var(--surface);
        color: var(--text);
        outline: none;
      }
      .session-search:focus {
        border-color: var(--brand);
      }
      .session-count {
        color: var(--muted);
        font-size: 12px;
        white-space: nowrap;
      }
      .session-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 460px;
        overflow: auto;
        margin: -2px;
        padding: 2px;
      }
      .session-row {
        display: grid;
        grid-template-columns: 8px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 9px 11px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--surface);
        cursor: pointer;
        font: inherit;
        color: inherit;
        text-align: left;
      }
      .session-row:hover {
        border-color: var(--brand);
      }
      .session-row.is-selected {
        border-color: var(--brand);
        background: #eef4ff;
        box-shadow: inset 0 0 0 1px var(--brand);
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--line);
      }
      .status-dot.completed { background: var(--green); }
      .status-dot.failed { background: var(--red); }
      .status-dot.active { background: var(--brand); }
      .status-dot.interrupted { background: var(--yellow); }
      .session-main { min-width: 0; }
      .session-title {
        font-weight: 680;
        font-size: 13px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .session-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 3px;
        color: var(--muted);
        font-size: 11px;
      }
      .session-meta .dot-sep { opacity: 0.5; }
      .session-aside {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 3px;
        white-space: nowrap;
      }
      .session-score {
        font-weight: 800;
        font-size: 13px;
      }
      .session-time {
        color: var(--muted);
        font-size: 11px;
      }
      .chip {
        display: inline-block;
        font-size: 11px;
        line-height: 16px;
        padding: 0 7px;
        border-radius: 999px;
        background: var(--surface-soft);
        color: var(--muted);
        white-space: nowrap;
      }
      .chip.agent { background: #eef4ff; color: #1d4ed8; }
      .chip.surface { background: #ecfdf3; color: #15803d; }
      .session-empty {
        color: var(--muted);
        background: var(--surface-soft);
        border-radius: 6px;
        padding: 18px;
        font-size: 13px;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 14px;
      }
      .detail-metric {
        background: var(--surface-soft);
        border-radius: 6px;
        padding: 10px;
      }
      .detail-metric strong {
        display: block;
        margin-top: 4px;
        font-size: 18px;
      }
      .detail-block {
        margin-top: 14px;
      }
      .detail-block h3 {
        margin: 0 0 8px;
        color: var(--muted);
        font-size: 12px;
        line-height: 18px;
      }
      .message-list {
        display: grid;
        gap: 8px;
      }
      .message-row {
        border: 1px solid var(--line);
        border-radius: 6px;
        padding: 10px;
        background: var(--surface);
      }
      .message-role {
        color: var(--muted);
        font-size: 12px;
        font-weight: 760;
        margin-bottom: 4px;
      }
      .message-content {
        font-size: 13px;
        line-height: 19px;
        max-height: 96px;
        overflow: auto;
        white-space: pre-wrap;
      }
      @media (max-width: 1100px) {
        .kpis { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .two, .three { grid-template-columns: 1fr; }
      }
      @media (max-width: 720px) {
        header { padding: 0 16px; }
        main { padding: 16px; }
        .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .header-meta span { display: none; }
        .detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
    </style>
  </head>
  <body data-brand="nudge-eap">
    <header>
      <div class="brand"><img src="/logo.svg" alt="" /> Nudge DS 로그 대시보드</div>
      <div class="header-meta">
        <span id="updated">불러오는 중</span>
        <nds-button id="seedBtn" size="sm" color="neutral" variant="outlined">샘플 적재</nds-button>
        <nds-button id="refreshBtn" size="sm" color="primary" variant="solid">새로고침</nds-button>
      </div>
    </header>
    <main>
      <section class="grid kpis" id="kpis"></section>
      <section class="grid two">
        <nds-card variant="outlined"><div class="panel">
          <h2>DS 채택 현황</h2>
          <div class="bars" id="brandBars"></div>
        </div></nds-card>
        <nds-card variant="outlined"><div class="panel">
          <h2>작업 이벤트</h2>
          <div class="bars" id="eventBars"></div>
        </div></nds-card>
      </section>
      <section class="grid two">
        <nds-card variant="outlined"><div class="panel">
          <h2>에이전트별 호출</h2>
          <div class="bars" id="agentBars"></div>
        </div></nds-card>
        <nds-card variant="outlined"><div class="panel">
          <h2>실행 표면별 호출</h2>
          <div class="bars" id="surfaceBars"></div>
        </div></nds-card>
      </section>
      <section class="grid two">
        <nds-card variant="outlined"><div class="panel">
          <h2>세션 목록</h2>
          <div class="session-toolbar">
            <input id="sessionSearch" class="session-search" type="search" placeholder="제목 · 에이전트 · 상태 검색" autocomplete="off" />
            <span class="session-count" id="sessionCount"></span>
          </div>
          <div class="session-list" id="sessionList"></div>
        </div></nds-card>
        <nds-card variant="outlined"><div class="panel">
          <h2>세션 상세</h2>
          <div id="sessionDetail"></div>
        </div></nds-card>
      </section>
      <section class="grid three">
        <nds-card variant="outlined"><div class="panel">
          <h2>최근 사용량</h2>
          <div id="usageTable"></div>
        </div></nds-card>
        <nds-card variant="outlined"><div class="panel">
          <h2>품질 점수</h2>
          <div id="qualityTable"></div>
        </div></nds-card>
        <nds-card variant="outlined"><div class="panel">
          <h2>피드백</h2>
          <div id="reviewTable"></div>
        </div></nds-card>
      </section>
    </main>
    <script>
      const fmt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "short", timeStyle: "short" });
      const num = (v, suffix = "") => v == null ? "-" : String(v) + suffix;
      const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
      const labelMap = {
        completed: "완료",
        failed: "실패",
        interrupted: "중단",
        active: "진행 중",
        pass: "통과",
        warn: "주의",
        fail: "미달",
        "revision-request": "수정 요청",
        feedback: "기타 피드백",
        export_completed: "내보내기 완료",
        validation_completed: "검증 완료",
        project_opened: "프로젝트 열림",
        intake_created: "인테이크 생성",
        feedback_submitted: "피드백 제출",
        agent_started: "에이전트 시작",
        agent_response_completed: "에이전트 완료",
        agent_failed: "에이전트 실패",
        error_occurred: "오류 발생",
        claude: "Claude",
        codex: "Codex",
        cursor: "Cursor",
        windsurf: "Windsurf",
        code: "코드(IDE)",
        cli: "CLI",
        chat: "챗",
        desktop: "데스크톱",
        ide: "IDE",
        unknown: "알 수 없음"
      };
      const ko = (v) => labelMap[v] || v || "알 수 없음";
      const verdictColor = (v) => v === "pass" ? "success" : v === "warn" ? "caution" : v === "fail" ? "error" : "neutral";
      let currentSessionId = null;

      async function fetchSummary() {
        const res = await fetch("/api/analytics/summary");
        if (!res.ok) throw new Error("summary failed");
        return res.json();
      }

      async function fetchSessions() {
        const res = await fetch("/api/sessions");
        if (!res.ok) throw new Error("sessions failed");
        return res.json();
      }

      async function fetchSessionDetail(sessionId) {
        const res = await fetch("/api/sessions/" + encodeURIComponent(sessionId));
        if (!res.ok) throw new Error("session detail failed");
        return res.json();
      }

      function kpi(label, value, sub, tone) {
        return '<nds-card variant="outlined"><div class="panel kpi"><div class="label">' + esc(label) + '</div><div class="value ' + (tone || "") + '">' + esc(value) + '</div><div class="sub">' + esc(sub || "") + '</div></div></nds-card>';
      }

      function renderBars(id, rows) {
        const el = document.getElementById(id);
        if (!rows || rows.length === 0) {
          el.innerHTML = '<div class="empty">아직 데이터가 없습니다.</div>';
          return;
        }
        const max = Math.max(...rows.map((r) => r.count), 1);
        el.innerHTML = rows.map((r) => {
          const width = Math.max(4, Math.round((r.count / max) * 100));
          return '<div class="bar-row"><div class="bar-label" title="' + esc(r.label) + '">' + esc(r.label) + '</div><div class="bar-track"><div class="bar-fill" style="width:' + width + '%"></div></div><strong>' + esc(r.count) + '</strong></div>';
        }).join("");
      }

      function table(id, columns, rows, options = {}) {
        const el = document.getElementById(id);
        if (!rows || rows.length === 0) {
          el.innerHTML = '<div class="empty">아직 데이터가 없습니다.</div>';
          return;
        }
        const tableClass = options.className ? ' ' + options.className : "";
        el.innerHTML = '<div class="table-scroll"><table class="data-table' + esc(tableClass) + '"><thead><tr>' +
          columns.map((c) => '<th class="' + esc(c.className || "") + '">' + esc(c.label) + '</th>').join("") +
          '</tr></thead><tbody>' +
          rows.map((row) => '<tr>' + columns.map((c) => '<td class="' + esc(c.className || "") + '">' + c.render(row) + '</td>').join("") + '</tr>').join("") +
          '</tbody></table></div>';
      }

      function inlineTable(columns, rows, limit = 6) {
        if (!rows || rows.length === 0) return '<div class="empty">연결된 로그가 없습니다.</div>';
        const visible = rows.slice(0, limit);
        return '<table><thead><tr>' + columns.map((c) => '<th>' + esc(c.label) + '</th>').join("") + '</tr></thead><tbody>' +
          visible.map((row) => '<tr>' + columns.map((c) => '<td>' + c.render(row) + '</td>').join("") + '</tr>').join("") +
          '</tbody></table>';
      }

      let allSessions = [];

      function sessionHaystack(row) {
        const s = row.summary || {};
        return [row.title, row.status, ko(row.status), row.tool, s.agent, s.surface, s.clientName]
          .filter(Boolean).join(" ").toLowerCase();
      }

      function renderSessionRow(row) {
        const selected = row.clientId === currentSessionId;
        const s = row.summary || {};
        const score = s.avgQualityScore;
        const scoreTone = score == null ? "" : score >= 80 ? "pass" : score >= 60 ? "warn" : "fail";
        const meta = ['<span>' + esc(ko(row.status)) + '</span>'];
        if (s.agent && s.agent !== "unknown") meta.push('<span class="chip agent">' + esc(ko(s.agent)) + '</span>');
        if (s.surface && s.surface !== "unknown") meta.push('<span class="chip surface">' + esc(ko(s.surface)) + '</span>');
        meta.push('<span class="dot-sep">·</span><span>' + (s.messages || 0) + '개 메시지</span>');
        meta.push('<span class="dot-sep">·</span><span>' + (s.runs || 0) + '개 실행</span>');
        const time = row.receivedAt ? fmt.format(new Date(row.receivedAt)) : "";
        return '<button type="button" class="session-row' + (selected ? " is-selected" : "") + '" data-session-id="' + esc(row.clientId) + '">' +
          '<span class="status-dot ' + esc(row.status || "unknown") + '"></span>' +
          '<span class="session-main"><span class="session-title">' + esc(row.title) + '</span>' +
            '<span class="session-meta">' + meta.join("") + '</span></span>' +
          '<span class="session-aside">' +
            (score == null ? "" : '<span class="session-score ' + scoreTone + '">' + esc(score) + '</span>') +
            (time ? '<span class="session-time">' + esc(time) + '</span>' : "") +
          '</span>' +
        '</button>';
      }

      function applySessionFilter() {
        const el = document.getElementById("sessionList");
        const countEl = document.getElementById("sessionCount");
        if (!allSessions.length) {
          el.innerHTML = '<div class="session-empty">아직 세션 로그가 없습니다.</div>';
          document.getElementById("sessionDetail").innerHTML = '<div class="empty">세션이 쌓이면 상세 흐름을 볼 수 있습니다.</div>';
          countEl.textContent = "";
          currentSessionId = null;
          return;
        }
        if (!currentSessionId || !allSessions.some((row) => row.clientId === currentSessionId)) {
          currentSessionId = allSessions[0].clientId;
        }
        const q = (document.getElementById("sessionSearch").value || "").trim().toLowerCase();
        const filtered = q ? allSessions.filter((row) => sessionHaystack(row).includes(q)) : allSessions;
        countEl.textContent = q ? filtered.length + " / " + allSessions.length : allSessions.length + "개";
        el.innerHTML = filtered.length
          ? filtered.map(renderSessionRow).join("")
          : '<div class="session-empty">검색 결과가 없습니다.</div>';
      }

      function renderSessionList(rows) {
        allSessions = rows || [];
        applySessionFilter();
      }

      function renderSessionDetail(detail) {
        const el = document.getElementById("sessionDetail");
        if (!detail) {
          el.innerHTML = '<div class="empty">왼쪽에서 세션을 선택하세요.</div>';
          return;
        }
        const s = detail.summary || {};
        el.innerHTML =
          '<div class="detail-grid">' +
            '<div class="detail-metric"><span>메시지</span><strong>' + esc(s.messages || 0) + '</strong></div>' +
            '<div class="detail-metric"><span>실행</span><strong>' + esc(s.runs || 0) + '</strong></div>' +
            '<div class="detail-metric"><span>DS 채택률</span><strong>' + esc(num(s.avgAdoptionRatio, "%")) + '</strong></div>' +
            '<div class="detail-metric"><span>품질</span><strong>' + esc(num(s.avgQualityScore)) + '</strong></div>' +
          '</div>' +
          '<div><nds-badge variant="ghost" color="brand" size="sm">' + esc(s.tool || "unknown") + '</nds-badge> ' +
          (s.agent && s.agent !== "unknown" ? '<span class="chip agent">' + esc(ko(s.agent)) + '</span> ' : '') +
          (s.surface && s.surface !== "unknown" ? '<span class="chip surface">' + esc(ko(s.surface)) + '</span> ' : '') +
          '<nds-badge variant="ghost" color="' + verdictColor(s.latestVerdict) + '" size="sm">' + esc(ko(s.latestVerdict || s.status)) + '</nds-badge></div>' +
          '<div class="detail-block"><h3>최근 메시지</h3>' + renderMessages(detail.messages) + '</div>' +
          '<div class="detail-block"><h3>실행/품질</h3>' + inlineTable([
            { label: "종류", render: (r) => esc(ko(r.eventType || r.type || "quality")) },
            { label: "대상", render: (r) => '<span class="mono">' + esc(r.mockupFile || r.runId || r.clientId) + '</span>' },
            { label: "상태", render: (r) => esc(ko(r.status || r.verdict || "")) }
          ], [...(detail.runs || []), ...(detail.quality || [])]) + '</div>' +
          '<div class="detail-block"><h3>위반/산출물</h3>' + inlineTable([
            { label: "종류", render: (r) => esc(r.rule || r.kind || r.type || "artifact") },
            { label: "대상", render: (r) => '<span class="mono">' + esc(r.mockupFile || r.source || r.runId || r.clientId) + '</span>' },
            { label: "상태", render: (r) => esc(ko(r.severity || r.kind || "")) }
          ], [...(detail.violations || []), ...(detail.artifacts || [])]) + '</div>' +
          '<div class="detail-block"><h3>이벤트/피드백</h3>' + inlineTable([
            { label: "종류", render: (r) => '<nds-badge variant="ghost" color="neutral" size="sm">' + esc(ko(r.type || r.category || r.kind || "feedback")) + '</nds-badge>' },
            { label: "내용", render: (r) => esc(r.content || r.comment || r.payload?.error || r.mockupFile || "") },
            { label: "시각", render: (r) => esc(r.timestamp || r.receivedAt || "") }
          ], [...(detail.events || []), ...(detail.reviews || [])]) + '</div>';
      }

      function renderMessages(rows) {
        if (!rows || rows.length === 0) return '<div class="empty">저장된 메시지가 없습니다.</div>';
        return '<div class="message-list">' + rows.slice(-4).map((row) =>
          '<div class="message-row"><div class="message-role">' + esc(row.role || row.type || "message") + '</div><div class="message-content">' + esc(row.content || row.text || row.message || "") + '</div></div>'
        ).join("") + '</div>';
      }

      async function selectSession(sessionId) {
        currentSessionId = sessionId;
        const sessions = await fetchSessions();
        renderSessionList(sessions.rows);
        renderSessionDetail(await fetchSessionDetail(sessionId));
      }

      async function seed() {
        const now = new Date().toISOString();
        await fetch("/sessions/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: "sample-session",
            userId: "local",
            tool: "claude",
            title: "Sample DS mockup",
            status: "completed",
            metadata: { mockupFile: "sample/dist/index.html" },
            messages: [{ role: "user", content: "NDS 써서 화면 만들어줘", metadata: { kind: "user" } }]
          })
        });
        await fetch("/usage/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usageId: "sample-usage-" + Date.now(),
            loggedAt: now,
            sessionId: "sample-session",
            mockupFile: "sample/dist/index.html",
            mockupName: "Sample dashboard",
            brand: "cashwalk-biz",
            dsVersions: { primary: "0.0.1", packages: {}, source: "mcp-bundle" },
            ds: [{ component: "Button", count: 4 }, { component: "DataTable", count: 1 }],
            meta: { totalDs: 12, totalCustomNative: 2, totalAdminCms: 0, totalExternal: 0, dsRatio: 86, adoptionRatio: 86, overallRatio: 80, avoidableMiss: 2, forcedCustom: 1 }
          })
        });
        await fetch("/quality/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            runId: "sample-run",
            sessionId: "sample-session",
            mockupFile: "sample/dist/index.html",
            overall: 84,
            verdict: "pass",
            codeScores: { overall: 82, color: 90, typography: 78, spacing: 84, layout: 80, component: 88, icon: 72 },
            llm: { overall: 86 },
            client: { agent: "claude", surface: "code", clientName: "claude-code", clientVersion: "1.0.0", transport: "stdio", agentSource: "clientInfo", surfaceSource: "clientInfo" }
          })
        });
        await fetch("/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: "sample-review-" + Date.now(),
            sessionId: "sample-session",
            userId: "local",
            category: "revision-request",
            content: "필터 영역 밀도를 조금 더 조밀하게",
            metadata: { screen: "Sample dashboard", dsVersion: "0.0.1" }
          })
        });
        await fetch("/events/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            { eventId: "sample-event-export-" + Date.now(), sessionId: "sample-session", type: "export_completed", timestamp: now, client: { agent: "claude", surface: "code" }, payload: { ok: true } },
            { eventId: "sample-event-validation-" + Date.now(), sessionId: "sample-session", type: "validation_completed", timestamp: now, client: { agent: "claude", surface: "code" }, payload: { ok: true, violationCount: 0 } }
          ])
        });
        render();
      }

      async function render() {
        const [data, sessions] = await Promise.all([fetchSummary(), fetchSessions()]);
        document.getElementById("updated").textContent = "갱신 " + fmt.format(new Date(data.generatedAt));
        document.getElementById("kpis").innerHTML = [
          kpi("목업", num(data.totals.mockups), "최신 사용량 스냅샷"),
          kpi("DS 채택률", num(data.health.avgAdoptionRatio, "%"), "평균 채택률", data.health.avgAdoptionRatio >= 80 ? "pass" : data.health.avgAdoptionRatio >= 60 ? "warn" : "fail"),
          kpi("품질 점수", num(data.health.avgQualityScore), "평균 품질 점수", data.health.avgQualityScore >= 80 ? "pass" : data.health.avgQualityScore >= 60 ? "warn" : "fail"),
          kpi("내보내기", num(data.health.exports), "완료된 내보내기 이벤트"),
          kpi("세션", num(data.totals.sessions), data.health.completedSessions + "건 완료"),
          kpi("피드백", num(data.totals.reviews), "리뷰 및 수정 요청")
        ].join("");
        renderBars("brandBars", data.breakdowns.brands.map((r) => ({ ...r, label: ko(r.label) })));
        renderBars("eventBars", data.breakdowns.eventTypes.map((r) => ({ ...r, label: ko(r.label) })));
        renderBars("agentBars", (data.breakdowns.agents || []).map((r) => ({ ...r, label: ko(r.label) })));
        renderBars("surfaceBars", (data.breakdowns.surfaces || []).map((r) => ({ ...r, label: ko(r.label) })));
        renderSessionList(sessions.rows);
        if (currentSessionId) {
          try {
            renderSessionDetail(await fetchSessionDetail(currentSessionId));
          } catch {
            renderSessionDetail(null);
          }
        }
        table("usageTable", [
          { label: "목업", className: "col-main", render: (r) => {
            const value = r.mockupFile || r.mockupName || r.clientId;
            return '<span class="mono path-cell" title="' + esc(value) + '">' + esc(value) + '</span>';
          } },
          { label: "브랜드", className: "col-badge", render: (r) => '<nds-badge variant="ghost" color="brand" size="sm">' + esc(r.brand || "?") + '</nds-badge>' },
          { label: "DS", className: "col-percent", render: (r) => esc((r.meta?.adoptionRatio ?? r.adoptionRatio ?? "-") + "%") },
          { label: "버전", className: "col-version", render: (r) => esc(r.dsVersions?.primary || r.dsVersion || "알 수 없음") }
        ], data.recent.usage);
        table("qualityTable", [
          { label: "실행", className: "col-main", render: (r) => {
            const value = r.mockupFile || r.runId || r.clientId;
            return '<span class="mono path-cell" title="' + esc(value) + '">' + esc(value) + '</span>';
          } },
          { label: "에이전트", className: "col-agent", render: (r) => {
            const c = r.client || {};
            if (!c.agent || c.agent === "unknown") return '<span class="chip">-</span>';
            const surface = c.surface && c.surface !== "unknown" ? ' / ' + ko(c.surface) : "";
            return '<span class="chip agent">' + esc(ko(c.agent) + surface) + '</span>';
          } },
          { label: "점수", className: "col-score", render: (r) => esc(r.overall ?? r.codeScores?.overall ?? r.codeOverall ?? "-") },
          { label: "판정", className: "col-verdict", render: (r) => '<nds-badge variant="ghost" color="' + verdictColor(r.verdict) + '" size="sm">' + esc(ko(r.verdict)) + '</nds-badge>' }
        ], data.recent.quality);
        table("reviewTable", [
          { label: "종류", className: "col-badge", render: (r) => '<nds-badge variant="ghost" color="neutral" size="sm">' + esc(ko(r.category || r.kind || "feedback")) + '</nds-badge>' },
          { label: "내용", className: "col-main", render: (r) => {
            const value = r.content || r.comment || "";
            return '<span class="text-cell" title="' + esc(value) + '">' + esc(value) + '</span>';
          } },
          { label: "화면", className: "col-screen", render: (r) => {
            const value = r.metadata?.screen || r.screen || "";
            return '<span class="text-cell" title="' + esc(value) + '">' + esc(value) + '</span>';
          } }
        ], data.recent.reviews);
      }

      document.getElementById("refreshBtn").addEventListener("click", render);
      document.getElementById("seedBtn").addEventListener("click", seed);
      document.getElementById("sessionSearch").addEventListener("input", applySessionFilter);
      document.getElementById("sessionList").addEventListener("click", (event) => {
        const target = event.target.closest("[data-session-id]");
        if (target) selectSession(target.getAttribute("data-session-id"));
      });
      render().catch((err) => {
        document.querySelector("main").innerHTML = '<nds-card variant="outlined"><div class="panel fail">대시보드를 불러오지 못했습니다: ' + esc(err.message) + '</div></nds-card>';
      });
    </script>
  </body>
</html>`;
}

app.listen(port, host, () => {
  console.log(`[web-server] listening on ${host ? `${host}:` : ""}${port}`);
});
