import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { BuildSinglefileHtmlResult } from "@nudge-design/mockup-core/tools/build-html";
import { recordBuildObservability, recordObservability } from "../src/tools/observability-sink";

// 보안 게이트 회귀 가드:
//  - PRD/HTML 원문(content)은 NUDGE_OBSERVABILITY_ARTIFACTS opt-in 일 때만 전송, 메타(hash/bytes)는 항상.
//  - 원격(non-loopback) sink 는 ARTIFACTS_REMOTE 까지 켜야 본문이 나간다.
//  - send() 는 병렬(allSettled) — 한 엔드포인트가 죽어도 나머지 결과가 돌아온다.
//  - recordObservability 디스패처는 툴 이름으로 라우팅(미지원 툴/이상 result → null).

const ENV_KEYS = [
  "NUDGE_MOCKUP_API_LOG",
  "NUDGE_OBSERVABILITY_LOG",
  "NUDGE_MOCKUP_API_URL",
  "NUDGE_DASHBOARD_API_URL",
  "NUDGE_OBSERVABILITY_API_URL",
  "NUDGE_OBSERVABILITY_ARTIFACTS",
  "NUDGE_OBSERVABILITY_ARTIFACTS_REMOTE",
  "NUDGE_OBSERVABILITY_TOKEN",
] as const;

const saved: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) saved[k] = process.env[k];

type Row = Record<string, unknown>;
let posts: { url: string; body: unknown; headers: Record<string, string> }[] = [];
let tmpDir: string;

function fakeFetch(failPath?: string) {
  return vi.fn(async (url: string, init: { body: string; headers?: Record<string, string> }) => {
    const body: unknown = JSON.parse(init.body);
    posts.push({ url, body, headers: init.headers ?? {} });
    if (failPath && url.endsWith(failPath)) throw new Error("boom");
    return { ok: true, status: 200 } as Response;
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

function artifactsRows(): Row[] {
  const ep = posts.find((p) => p.url.endsWith("/artifacts/import"));
  return (ep?.body as Row[] | undefined) ?? [];
}

beforeEach(() => {
  posts = [];
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "obs-sink-"));
  for (const k of ENV_KEYS) delete process.env[k];
  process.env.NUDGE_MOCKUP_API_URL = "http://127.0.0.1:9999";
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
  it("기본은 원문을 빼고 메타데이터(hash/bytes/contentOmitted)만 보낸다", async () => {
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
    // 원문이 페이로드 어디에도 새지 않아야 한다.
    expect(JSON.stringify(rows)).not.toContain("ABC123");
  });

  it("ARTIFACTS=1 + loopback 이면 원문을 포함한다", async () => {
    process.env.NUDGE_OBSERVABILITY_ARTIFACTS = "1";
    vi.stubGlobal("fetch", fakeFetch());
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    const prd = artifactsRows().find((r) => r.kind === "initial-prd");
    expect(prd?.content).toContain("ABC123");
    expect(prd?.contentOmitted).toBe(false);
  });

  it("원격 sink 는 ARTIFACTS=1 이어도 본문을 빼고, ARTIFACTS_REMOTE=1 이라야 보낸다", async () => {
    process.env.NUDGE_MOCKUP_API_URL = "http://10.0.0.5:9999";
    process.env.NUDGE_OBSERVABILITY_ARTIFACTS = "1";
    vi.stubGlobal("fetch", fakeFetch());
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

describe("send 병렬/내성 + 인증", () => {
  it("한 엔드포인트가 throw 해도 나머지 결과를 돌려준다", async () => {
    vi.stubGlobal("fetch", fakeFetch("/events/import"));
    const results = await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(results.length).toBeGreaterThan(1);
    expect(results.some((r) => r.ok)).toBe(true);
    expect(results.some((r) => !r.ok && r.path === "/events/import")).toBe(true);
  });

  it("NUDGE_OBSERVABILITY_TOKEN 설정 시 Authorization 헤더가 붙는다", async () => {
    process.env.NUDGE_OBSERVABILITY_TOKEN = "s3cret";
    vi.stubGlobal("fetch", fakeFetch());
    await recordBuildObservability({
      tool: "build_singlefile_html",
      cwd: tmpDir,
      result: buildResult(),
    });
    expect(posts.every((p) => p.headers.Authorization === "Bearer s3cret")).toBe(true);
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
    expect(posts.some((p) => p.url.endsWith("/mockup-runs/import"))).toBe(true);
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
