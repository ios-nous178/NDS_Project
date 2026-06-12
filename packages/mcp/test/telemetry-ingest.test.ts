import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ingestUrl, ingestToken, ingestHeaders } from "@nudge-design/mockup-core";
import type { BuildSinglefileHtmlResult } from "@nudge-design/mockup-core/tools/build-html";
import { sendTelemetryEvents } from "../src/tools/telemetry-egress";
import { recordBuildObservability } from "../src/tools/observability-sink";

// Supabase ingest 전환 회귀 가드:
//  - URL/토큰은 env(NUDGE_TELEMETRY_URL/TOKEN) 우선 — 미설정 + 배포 상수 미채움이면 전송 생략.
//  - NUDGE_CONTEXT_COLLECTION=0 마스터 킬 스위치는 ingestUrl() 레벨에서 모든 표면에 적용.
//  - Tier 2 봉투({session, events})는 Bearer 헤더와 함께 ingest URL 로 POST 된다.
//  - ★ 원문 게이트는 "실효 sink URL" 로 판정 — 원격 ingest 가 기본 sink 일 때 artifacts
//    원문(content)이 절대 실리지 않아야 한다(메타데이터만 정책). 대시보드 URL(loopback
//    기본값)로 판정하던 회귀가 원문 유출 버그였다.

const ENV_KEYS = [
  "NUDGE_TELEMETRY_URL",
  "NUDGE_TELEMETRY_TOKEN",
  "NUDGE_CONTEXT_COLLECTION",
  "NUDGE_OBSERVABILITY_DASHBOARD",
  "NUDGE_OBSERVABILITY_ARTIFACTS",
  "NUDGE_OBSERVABILITY_ARTIFACTS_REMOTE",
  "NUDGE_MOCKUP_API_URL",
] as const;
const saved: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) saved[k] = process.env[k];

let posts: { url: string; body: Record<string, unknown>; headers: Record<string, string> }[] = [];
let tmpDir: string;

function stubFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: { body: string; headers?: Record<string, string> }) => {
      posts.push({ url, body: JSON.parse(init.body), headers: init.headers ?? {} });
      return { ok: true, status: 200, text: async () => "" } as unknown as Response;
    }),
  );
}

beforeEach(() => {
  posts = [];
  for (const k of ENV_KEYS) delete process.env[k];
  stubFetch();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "telemetry-ingest-"));
});

afterEach(() => {
  vi.unstubAllGlobals();
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("ingest config (mockup-core SSOT)", () => {
  it("env 가 배포 상수보다 우선한다", () => {
    process.env.NUDGE_TELEMETRY_URL = "https://x.supabase.co/functions/v1/ingest";
    process.env.NUDGE_TELEMETRY_TOKEN = "anon-123";
    expect(ingestUrl()).toBe("https://x.supabase.co/functions/v1/ingest");
    expect(ingestToken()).toBe("anon-123");
    expect(ingestHeaders().Authorization).toBe("Bearer anon-123");
  });

  it("킬 스위치(NUDGE_CONTEXT_COLLECTION=0)면 URL 이 설정돼 있어도 null", () => {
    process.env.NUDGE_TELEMETRY_URL = "https://x.supabase.co/functions/v1/ingest";
    process.env.NUDGE_CONTEXT_COLLECTION = "0";
    expect(ingestUrl()).toBeNull();
  });
});

describe("Tier 2 telemetry → ingest", () => {
  it("ingest URL 로 {session, events} 봉투를 Bearer 헤더와 함께 POST 한다", async () => {
    process.env.NUDGE_TELEMETRY_URL = "https://x.supabase.co/functions/v1/ingest";
    process.env.NUDGE_TELEMETRY_TOKEN = "anon-123";
    sendTelemetryEvents([{ kind: "guide-demand", topic: "component:Button", resolved: true }]);
    await vi.waitFor(() => expect(posts.length).toBe(1));
    expect(posts[0].url).toBe("https://x.supabase.co/functions/v1/ingest");
    expect(posts[0].headers.Authorization).toBe("Bearer anon-123");
    expect(posts[0].body.session).toMatchObject({ id: expect.any(String) });
    expect(posts[0].body.events).toEqual([
      { kind: "guide-demand", topic: "component:Button", resolved: true },
    ]);
  });

  it("엔드포인트 미설정(env 없음 + 배포 상수 미채움)이면 전송을 생략한다", async () => {
    sendTelemetryEvents([{ kind: "guide-demand", topic: "component:Button", resolved: true }]);
    await new Promise((r) => setTimeout(r, 20));
    expect(posts.length).toBe(0);
  });

  it("킬 스위치가 켜져 있으면 전송하지 않는다", async () => {
    process.env.NUDGE_TELEMETRY_URL = "https://x.supabase.co/functions/v1/ingest";
    process.env.NUDGE_CONTEXT_COLLECTION = "0";
    sendTelemetryEvents([{ kind: "guide-demand", topic: "component:Button", resolved: true }]);
    await new Promise((r) => setTimeout(r, 20));
    expect(posts.length).toBe(0);
  });
});

describe("Tier 3 observability → ingest (원문 게이트는 실효 sink URL 기준)", () => {
  function buildResult(): BuildSinglefileHtmlResult {
    const outputPath = path.join(tmpDir, "out", "mockup.html");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, "<html><body>raw-mockup-source</body></html>");
    fs.writeFileSync(path.join(tmpDir, "prd.md"), "# 기획\n사내 비밀 PRD 본문");
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

  it("원격 ingest 가 기본 sink 일 때 artifacts 는 메타데이터만 — 원문(content) 미포함", async () => {
    process.env.NUDGE_TELEMETRY_URL = "https://x.supabase.co/functions/v1/ingest";
    const results = await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(results.length).toBeGreaterThan(0);
    expect(posts.length).toBe(1); // 봉투 1건으로 합쳐 전송
    const envelope = posts[0].body as {
      kind: string;
      records: { path: string; body: unknown }[];
    };
    expect(envelope.kind).toBe("observability");
    const artifacts = envelope.records.find((r) => r.path === "/artifacts/import");
    expect(artifacts).toBeDefined();
    for (const row of artifacts!.body as Record<string, unknown>[]) {
      expect(row.contentOmitted).toBe(true);
      expect(row.content).toBeUndefined();
      expect(row.contentHash).toEqual(expect.any(String)); // 메타는 유지
    }
    const flat = JSON.stringify(envelope);
    expect(flat).not.toContain("사내 비밀 PRD 본문");
    expect(flat).not.toContain("raw-mockup-source");
  });

  it("ingest 미설정이면 observability 전송도 생략한다", async () => {
    const results = await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(results).toEqual([]);
    expect(posts.length).toBe(0);
  });
});
