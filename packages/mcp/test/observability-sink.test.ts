import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { BuildSinglefileHtmlResult } from "@nudge-design/mockup-core/tools/build-html";
import { recordBuildObservability, recordObservability } from "../src/tools/observability-sink";

// 유일 sink = Supabase Edge Function `ingest`. 한 번의 POST 로 `{kind:"observability",
// records:[{path, body}]}` 봉투를 보낸다(supabase/README.md). 이 스위트가 지키는 계약:
//  - 원문 게이트("원문은 머신 밖으로 안 나간다"): loopback ingest(로컬 supabase)면 기본 ON,
//    원격(배포 supabase)이면 기본 OFF + ARTIFACTS=1 & ARTIFACTS_REMOTE=1 이라야 본문 송신.
//  - 수집 실패(POST throw)가 툴 호출을 깨뜨리지 않는다 — endpoint 별 ok:false 로 돌려준다.
//  - recordObservability 디스패처는 툴 이름으로 라우팅(미지원 툴/이상 result → null).

const ENV_KEYS = [
  "NUDGE_MOCKUP_API_LOG",
  "NUDGE_OBSERVABILITY_LOG",
  "NUDGE_CONTEXT_COLLECTION",
  "NUDGE_TELEMETRY_URL",
  "NUDGE_TELEMETRY_TOKEN",
  "NUDGE_OBSERVABILITY_ARTIFACTS",
  "NUDGE_OBSERVABILITY_ARTIFACTS_REMOTE",
  "NUDGE_MOCKUP_SESSION_ID",
  "NUDGE_AGENT_SESSION_ID",
  "NUDGE_SESSION_ID",
] as const;

const saved: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) saved[k] = process.env[k];

type Row = Record<string, unknown>;
type Envelope = { kind?: string; records?: { path: string; body: unknown }[] };
let posts: { url: string; body: unknown; headers: Record<string, string> }[] = [];
let tmpDir: string;

function fakeFetch(fail = false) {
  return vi.fn(async (url: string, init: { body: string; headers?: Record<string, string> }) => {
    const body: unknown = JSON.parse(init.body);
    posts.push({ url, body, headers: init.headers ?? {} });
    if (fail) throw new Error("boom");
    return { ok: true, status: 200, text: async () => "" } as unknown as Response;
  });
}

function buildResult() {
  const outputPath = path.join(tmpDir, "out", "mockup.html");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, "<html><body>hi</body></html>");
  fs.writeFileSync(path.join(tmpDir, "prd.md"), "# 기획\n비밀 내부 식별자 ABC123");
  return {
    ok: true,
    intent: "react",
    outputPath,
    sizeBytes: 30,
    sizeKb: 1,
    elapsedSec: 0.1,
    validation: { ok: true, violations: [] },
  } as unknown as BuildSinglefileHtmlResult;
}

/** 단일 ingest 봉투의 records — sink 가 한 번의 POST 로 묶어 보낸다. */
function records(): { path: string; body: unknown }[] {
  return (posts[0]?.body as Envelope | undefined)?.records ?? [];
}

function artifactsRows(): Row[] {
  return (records().find((r) => r.path === "/artifacts/import")?.body as Row[] | undefined) ?? [];
}

function recordBody(pathname: string): Row | undefined {
  return records().find((r) => r.path === pathname)?.body as Row | undefined;
}

beforeEach(() => {
  posts = [];
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "obs-sink-"));
  for (const k of ENV_KEYS) delete process.env[k];
  // 로컬 Supabase(loopback) ingest 를 가정 — 원문 게이트 기본 ON 경로를 검증 대상으로 고정.
  process.env.NUDGE_TELEMETRY_URL = "http://127.0.0.1:9999/ingest";
});

afterEach(() => {
  vi.unstubAllGlobals();
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("artifact 원문 게이트", () => {
  it("loopback ingest 는 기본 ON — 원문을 포함하고 메타(hash/bytes)도 붙는다", async () => {
    vi.stubGlobal("fetch", fakeFetch());
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    const prd = artifactsRows().find((r) => r.kind === "initial-prd");
    expect(prd?.content).toContain("ABC123");
    expect(prd?.contentOmitted).toBe(false);
    expect(typeof prd?.contentHash).toBe("string");
    expect(prd?.byteLength).toBeGreaterThan(0);
  });

  it("loopback 이어도 ARTIFACTS=0 이면 원문을 빼고 메타만 보낸다", async () => {
    process.env.NUDGE_OBSERVABILITY_ARTIFACTS = "0";
    vi.stubGlobal("fetch", fakeFetch());
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    const rows = artifactsRows();
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.content).toBeUndefined();
      expect(row.contentOmitted).toBe(true);
      expect(typeof row.contentHash).toBe("string");
      expect(row.byteLength).toBeGreaterThan(0);
    }
    expect(JSON.stringify(rows)).not.toContain("ABC123");
  });

  it("원격 ingest 는 기본 OFF, ARTIFACTS=1 이어도 본문을 빼고 ARTIFACTS_REMOTE=1 이라야 보낸다", async () => {
    process.env.NUDGE_TELEMETRY_URL = "http://10.0.0.5:9999/ingest";
    vi.stubGlobal("fetch", fakeFetch());
    // env 없음 → 원격 기본 OFF
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(artifactsRows().every((r) => r.content === undefined)).toBe(true);

    // ARTIFACTS=1 만으론 부족
    posts = [];
    process.env.NUDGE_OBSERVABILITY_ARTIFACTS = "1";
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(artifactsRows().every((r) => r.content === undefined)).toBe(true);

    posts = [];
    process.env.NUDGE_OBSERVABILITY_ARTIFACTS_REMOTE = "1";
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(artifactsRows().some((r) => typeof r.content === "string")).toBe(true);
  });
});

describe("ingest 봉투 + 내성", () => {
  it("모든 레코드를 한 번의 POST 로 묶어 ingest 봉투(kind:observability)로 보낸다", async () => {
    vi.stubGlobal("fetch", fakeFetch());
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(posts).toHaveLength(1);
    expect(posts[0].url).toBe("http://127.0.0.1:9999/ingest");
    expect((posts[0].body as Envelope).kind).toBe("observability");
    expect(records().some((r) => r.path === "/mockup-runs/import")).toBe(true);
  });

  it("POST 가 throw 해도 던지지 않고 endpoint 별 ok:false 결과를 돌려준다", async () => {
    vi.stubGlobal("fetch", fakeFetch(true));
    const results = await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(results.length).toBeGreaterThan(1);
    expect(results.every((r) => !r.ok)).toBe(true);
  });

  it("NUDGE_TELEMETRY_TOKEN 설정 시 Authorization 헤더(anon key)가 붙는다", async () => {
    process.env.NUDGE_TELEMETRY_TOKEN = "s3cret";
    vi.stubGlobal("fetch", fakeFetch());
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(posts.every((p) => p.headers.Authorization === "Bearer s3cret")).toBe(true);
  });
});

describe("세션 연결", () => {
  it("세션 env가 없으면 workspace 기반 synthetic 세션을 만들고 모든 row에 붙인다", async () => {
    vi.stubGlobal("fetch", fakeFetch());
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });

    const session = recordBody("/sessions/import");
    expect(session?.clientId).toMatch(/^mcp_[a-f0-9]+$/);
    expect(session?.metadata).toMatchObject({
      mockupFile: "out/mockup.html",
      source: "mcp-observability",
    });

    const sessionId = session?.clientId;
    expect(recordBody("/mockup-runs/import")?.sessionId).toBe(sessionId);
    expect(recordBody("/events/import")?.sessionId).toBe(sessionId);
    expect(artifactsRows().every((r) => r.sessionId === sessionId)).toBe(true);
  });

  it("NUDGE_MOCKUP_SESSION_ID가 있으면 그 세션으로 묶는다", async () => {
    process.env.NUDGE_MOCKUP_SESSION_ID = "claude-desktop-session-1";
    vi.stubGlobal("fetch", fakeFetch());
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });

    expect(recordBody("/sessions/import")?.clientId).toBe("claude-desktop-session-1");
    expect(recordBody("/mockup-runs/import")?.sessionId).toBe("claude-desktop-session-1");
  });
});

describe("recordObservability 디스패처", () => {
  it("build 이름이면 적재한다", async () => {
    vi.stubGlobal("fetch", fakeFetch());
    const out = await recordObservability({
      name: "build_singlefile_html",
      args: { cwd: tmpDir },
      result: buildResult(),
    });
    expect(out && out.length).toBeGreaterThan(0);
    expect(records().some((r) => r.path === "/mockup-runs/import")).toBe(true);
  });

  it("미지원 툴이면 null(무동작)", async () => {
    vi.stubGlobal("fetch", fakeFetch());
    const out = await recordObservability({ name: "get_brand", args: {}, result: { ok: true } });
    expect(out).toBeNull();
    expect(posts).toHaveLength(0);
  });

  it("score_mockup_quality 의 ok:false 에러 결과는 적재하지 않는다", async () => {
    vi.stubGlobal("fetch", fakeFetch());
    const out = await recordObservability({
      name: "score_mockup_quality",
      args: { cwd: tmpDir },
      result: { ok: false, error: "filePath 읽기 실패" },
    });
    expect(out).toBeNull();
    expect(posts).toHaveLength(0);
  });
});
