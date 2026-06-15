import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { BuildSinglefileHtmlResult } from "@nudge-design/mockup-core/tools/build-html";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core/tools/html-validator";
import type { ReportHtmlMockupUsageResult } from "@nudge-design/mockup-core/tools/html-analyzer";
import type { LlmScoreResult } from "@nudge-design/mockup-core/tools/quality-score-core";
import { getClientIdentity } from "./client-identity.js";
// 기본 sink = Supabase ingest (URL/토큰은 mockup-core ingest 설정 SSOT 와 공유).
import { ingestUrl, ingestHeaders, postJsonToWebhook } from "@nudge-design/mockup-core";

type JsonObject = Record<string, unknown>;

interface SinkEndpoint {
  path: string;
  body: unknown;
}

interface SinkPostResult {
  target: string;
  path: string;
  ok: boolean;
  status?: number;
  error?: string;
}

interface RecordBase {
  cwd?: string;
  tool: string;
  dsVersion?: string | null;
}

interface RecordBuildArgs extends RecordBase {
  result: BuildSinglefileHtmlResult;
}

interface RecordValidationArgs extends RecordBase {
  source?: string;
  filePath?: string;
  result: ValidateHtmlMockupResult & {
    report?: ReportHtmlMockupUsageResult;
    stats?: unknown;
  };
}

interface RecordQualityArgs extends RecordBase {
  filePath?: string;
  brand?: string;
  surface?: string;
  codeScores: { overall: number; dimensions?: Record<string, number> } | null;
  llm: LlmScoreResult;
  verdict?: string;
  verdictLabel?: string;
  overall?: number | null;
}

const POST_TIMEOUT_MS = 1500;

function isFlagOff(value: string | undefined): boolean {
  return ["0", "false", "off", "no"].includes((value ?? "").toLowerCase());
}

function isEnabled(): boolean {
  const flag = process.env.NUDGE_MOCKUP_API_LOG ?? process.env.NUDGE_OBSERVABILITY_LOG;
  return !isFlagOff(flag ?? "1");
}

function isLoopback(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "127.0.0.1" || host === "localhost" || host === "::1" || host === "[::1]";
  } catch {
    return false;
  }
}

/**
 * PRD/HTML **원문(raw content)** 전송 게이트. 정책은 "원문은 머신 밖으로 안 나간다":
 *   - loopback(127.0.0.1/localhost) sink → **기본 ON**. 로컬 Supabase(`supabase start`)
 *     ingest 가 같은 머신에 있으므로 env 없이 바로 원문이 보인다. ARTIFACTS=0 으로 끌 수 있다.
 *   - 원격(non-loopback) sink → **기본 OFF**. 명시 opt-in(ARTIFACTS=1) + ARTIFACTS_REMOTE=1
 *     둘 다 켜야만 본문이 나간다. 안 켜면 메타데이터(kind/source/hash/bytes)만 송신.
 */
function artifactsContentEnabled(base: string): boolean {
  const flag = process.env.NUDGE_OBSERVABILITY_ARTIFACTS;
  if (isFlagOff(flag)) return false; // 명시 OFF 면 어디든 끈다
  if (isLoopback(base)) return true; // 같은 머신이면 기본 ON
  // 원격 타깃: 명시 opt-in + ARTIFACTS_REMOTE 둘 다 켜야 본문 송신.
  if (flag === undefined) return false;
  return !isFlagOff(process.env.NUDGE_OBSERVABILITY_ARTIFACTS_REMOTE ?? "0");
}

function now(): string {
  return new Date().toISOString();
}

function currentSessionId(): string | null {
  return (
    process.env.NUDGE_MOCKUP_SESSION_ID ??
    process.env.NUDGE_AGENT_SESSION_ID ??
    process.env.NUDGE_SESSION_ID ??
    null
  );
}

function syntheticSessionId(cwd: string | undefined, mockupFile: string | null): string {
  const workspace = cwd ? path.resolve(cwd) : "unknown-workspace";
  const seed = `${workspace}:${mockupFile || "unknown-mockup"}`;
  return `mcp_${hash(seed, 20)}`;
}

function resolveSessionId(cwd: string | undefined, mockupFile: string | null): string {
  return currentSessionId() ?? syntheticSessionId(cwd, mockupFile);
}

function sessionTitle(cwd: string | undefined, mockupFile: string | null): string {
  if (mockupFile) return mockupFile;
  if (cwd) return path.basename(path.resolve(cwd)) || cwd;
  return "MCP mockup session";
}

/**
 * "어떤 에이전트(codex/claude)가 어떤 표면(code/cli/chat)에서 호출했나"를 run/event 레코드에
 * 붙인다. client-identity 가 SSOT(자동 clientInfo + 명시 env override). best-effort 라 throw X.
 */
function clientContext(): JsonObject {
  try {
    const c = getClientIdentity();
    return {
      agent: c.agent,
      surface: c.surface,
      clientName: c.clientName,
      clientVersion: c.clientVersion,
      installMode: c.installMode,
      transport: c.transport,
      mcpVersion: c.mcpVersion,
      agentSource: c.agentSource,
      surfaceSource: c.surfaceSource,
    };
  } catch {
    return {};
  }
}

function hash(input: unknown, len = 16): string {
  const text = typeof input === "string" ? input : JSON.stringify(input);
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, len);
}

function rel(cwd: string | undefined, filePath: string | undefined): string | null {
  if (!filePath) return null;
  if (!cwd) return filePath;
  const r = path.relative(cwd, filePath);
  return r.startsWith("..") ? filePath : r.split(path.sep).join("/");
}

function safeRead(filePath: string | undefined, maxBytes = 1_500_000): string | null {
  if (!filePath || !fs.existsSync(filePath)) return null;
  try {
    const stat = fs.statSync(filePath);
    if (stat.size > maxBytes) {
      const fd = fs.openSync(filePath, "r");
      const buf = Buffer.alloc(maxBytes);
      fs.readSync(fd, buf, 0, maxBytes, 0);
      fs.closeSync(fd);
      return `${buf.toString("utf8")}\n<!-- truncated: ${stat.size - maxBytes} bytes omitted -->`;
    }
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function readInitialPrd(cwd: string | undefined): { source: string; content: string } | null {
  if (!cwd) return null;
  for (const name of ["brief.md", "prd.md", "PRD.md", "requirements.md"]) {
    const file = path.join(cwd, name);
    const content = safeRead(file, 500_000);
    if (content) return { source: name, content };
  }
  return null;
}

function buildRunId(kind: string, cwd: string | undefined, filePath: string | null): string {
  return `run_${hash(`${kind}\n${cwd ?? ""}\n${filePath ?? ""}\n${now()}`, 20)}`;
}

/* ───────────── observability raw → Supabase ingest ─────────────
 * 유일 sink. raw 레코드(sessions/runs/events/violations/quality/artifacts)를
 * `{kind:"observability", records:[{path, body}]}` 봉투 그대로 Supabase Edge Function
 * `ingest` 로 보낸다 — 함수가 path 별로 obs_records 컬렉션에 분배한다(supabase/README.md).
 * (이전의 TEMP Google Sheets 경로와 로컬 web-server 대시보드 API 적재를 대체.)
 */
async function sendRawToIngest(endpoints: SinkEndpoint[]): Promise<SinkPostResult[]> {
  const url = ingestUrl();
  if (!url) return []; // 엔드포인트 미설정/킬 스위치 — 전송 생략
  const rawBody = JSON.stringify({
    kind: "observability",
    ts: now(),
    client: clientContext(),
    records: endpoints.map((e) => ({ path: e.path, body: e.body })),
  });
  try {
    // best-effort: 툴 응답 지연 방지를 위해 짧은 timeout + 1회 재시도만.
    const res = await postJsonToWebhook(rawBody, url, {
      retries: 1,
      timeoutMs: POST_TIMEOUT_MS,
      headers: ingestHeaders(),
    });
    return endpoints.map((e) => ({
      target: url,
      path: e.path,
      ok: res.ok,
      status: res.status,
    }));
  } catch (err) {
    return endpoints.map((e) => ({
      target: url,
      path: e.path,
      ok: false,
      error: (err as Error).message,
    }));
  }
}

/**
 * 실제 적재가 향하는 sink URL = Supabase ingest. artifacts 원문 게이트(loopback 판정)는
 * 반드시 이 URL 로 평가해야 한다 — 로컬 Supabase(`supabase start`) 면 loopback 으로 잡혀
 * 원문이 허용되고, 원격(배포 Supabase)이면 기본 OFF 가 적용된다.
 */
function effectiveSinkUrl(): string | null {
  return ingestUrl();
}

async function send(endpoints: SinkEndpoint[]): Promise<SinkPostResult[]> {
  if (!isEnabled() || endpoints.length === 0) return [];
  return sendRawToIngest(endpoints);
}

function usageEndpoint(
  report: ReportHtmlMockupUsageResult | undefined,
  sessionId: string,
  client: JsonObject,
  runId?: string,
): SinkEndpoint[] {
  if (!report?.usage) return [];
  return [{ path: "/usage/import", body: { ...report.usage, sessionId, runId, client } }];
}

function violationsEndpoint(args: {
  runId: string;
  sessionId: string | null;
  mockupFile: string | null;
  validation?: ValidateHtmlMockupResult;
}): SinkEndpoint[] {
  const violations = args.validation?.violations ?? [];
  if (violations.length === 0) return [];
  return [
    {
      path: "/violations/import",
      body: violations.map((v, index) => ({
        clientId: `${args.runId}#violation#${index}`,
        runId: args.runId,
        sessionId: args.sessionId,
        mockupFile: args.mockupFile,
        rule: v.rule,
        severity: v.severity,
        line: v.line,
        selector: v.selector,
        detail: v.detail,
        suggestion: v.suggestion,
      })),
    },
  ];
}

function sessionEndpoint(args: {
  sessionId: string;
  client: JsonObject;
  tool: string;
  cwd?: string;
  mockupFile: string | null;
  status?: string;
  dsVersion?: string | null;
}): SinkEndpoint {
  const agent =
    typeof args.client.agent === "string" && args.client.agent
      ? args.client.agent
      : args.tool.includes("claude")
        ? "claude"
        : args.tool.includes("codex")
          ? "codex"
          : "unknown";
  return {
    path: "/sessions/import",
    body: {
      clientId: args.sessionId,
      tool: agent,
      title: sessionTitle(args.cwd, args.mockupFile),
      status: args.status ?? "completed",
      metadata: {
        cwdHash: args.cwd ? hash(path.resolve(args.cwd), 16) : null,
        mockupFile: args.mockupFile,
        dsVersion: args.dsVersion,
        client: args.client,
        source: "mcp-observability",
      },
      messages: [],
    },
  };
}

function qualityEndpoint(args: {
  runId: string;
  sessionId: string | null;
  mockupFile: string | null;
  validation?: ValidateHtmlMockupResult;
  quality?: RecordQualityArgs;
}): SinkEndpoint[] {
  const scores = args.quality?.codeScores ?? args.validation?.scores ?? null;
  const dimensions = scores && "dimensions" in scores ? scores.dimensions : undefined;
  const overall = args.quality?.overall ?? args.quality?.llm.overall ?? scores?.overall ?? null;
  if (!scores && !args.quality?.llm) return [];
  return [
    {
      path: "/quality/import",
      body: {
        runId: args.runId,
        sessionId: args.sessionId,
        mockupFile: args.mockupFile,
        overall,
        verdict: args.quality?.verdict,
        verdictLabel: args.quality?.verdictLabel,
        codeScores: scores,
        codeOverall: scores?.overall,
        codeDimensions: dimensions,
        llm: args.quality?.llm,
        brand: args.quality?.brand,
        surface: args.quality?.surface,
      },
    },
  ];
}

function artifactRow(args: {
  runId: string;
  sessionId: string | null;
  kind: string;
  source: string | null;
  content: string;
  withContent: boolean;
}): JsonObject {
  // 본문은 opt-in 일 때만, 메타데이터(hash/bytes)는 항상 — dedup/신호는 유지하되 원문 유출은 차단.
  return {
    artifactId: `${args.runId}#${args.kind}`,
    runId: args.runId,
    sessionId: args.sessionId,
    kind: args.kind,
    source: args.source,
    contentHash: hash(args.content, 24),
    byteLength: Buffer.byteLength(args.content, "utf8"),
    contentOmitted: !args.withContent,
    ...(args.withContent ? { content: args.content } : {}),
  };
}

function artifactsEndpoint(args: {
  runId: string;
  sessionId: string | null;
  cwd?: string;
  outputPath?: string;
  includePrd: boolean;
  includeOutputHtml: boolean;
}): SinkEndpoint[] {
  const base = effectiveSinkUrl(); // 원문 게이트는 실제 적재 대상 URL 로 판정
  if (!base) return [];
  const withContent = artifactsContentEnabled(base);
  const rows: JsonObject[] = [];
  if (args.includePrd) {
    const prd = readInitialPrd(args.cwd);
    if (prd) {
      rows.push(
        artifactRow({
          runId: args.runId,
          sessionId: args.sessionId,
          kind: "initial-prd",
          source: prd.source,
          content: prd.content,
          withContent,
        }),
      );
    }
  }
  if (args.includeOutputHtml) {
    const html = safeRead(args.outputPath);
    if (html) {
      rows.push(
        artifactRow({
          runId: args.runId,
          sessionId: args.sessionId,
          kind: "first-output-html",
          source: rel(args.cwd, args.outputPath),
          content: html,
          withContent,
        }),
      );
    }
  }
  return rows.length > 0 ? [{ path: "/artifacts/import", body: rows }] : [];
}

export async function recordBuildObservability(args: RecordBuildArgs): Promise<SinkPostResult[]> {
  const outputRel = rel(args.cwd, args.result.outputPath);
  const runId = buildRunId("build", args.cwd, outputRel);
  const client = clientContext();
  const sessionId = resolveSessionId(args.cwd, outputRel);
  const validation = args.result.validation;
  const endpoints: SinkEndpoint[] = [
    sessionEndpoint({
      sessionId,
      client,
      tool: args.tool,
      cwd: args.cwd,
      mockupFile: outputRel,
      status: args.result.ok ? "completed" : "failed",
      dsVersion: args.dsVersion,
    }),
    {
      path: "/mockup-runs/import",
      body: {
        runId,
        sessionId,
        client,
        tool: args.tool,
        eventType: "build_singlefile_html",
        status: args.result.ok ? "completed" : "failed",
        cwdHash: args.cwd ? hash(path.resolve(args.cwd), 16) : null,
        mockupFile: outputRel,
        intent: args.result.intent,
        dsVersion: args.dsVersion,
        sizeBytes: args.result.sizeBytes,
        elapsedSec: args.result.elapsedSec,
        validationOk: validation?.ok,
        prdOk: args.result.prdValidation?.ok,
        error: args.result.error,
      },
    },
    {
      path: "/events/import",
      body: {
        eventId: `${runId}#build`,
        sessionId,
        client,
        type: args.result.ok ? "export_completed" : "error_occurred",
        mockupFile: outputRel,
        timestamp: now(),
        payload: {
          tool: args.tool,
          ok: args.result.ok,
          sizeKb: args.result.sizeKb,
          intent: args.result.intent,
          validationOk: validation?.ok,
          prdOk: args.result.prdValidation?.ok,
          error: args.result.error,
        },
      },
    },
    ...usageEndpoint(args.result.report, sessionId, client, runId),
    ...qualityEndpoint({ runId, sessionId, mockupFile: outputRel, validation }),
    ...violationsEndpoint({ runId, sessionId, mockupFile: outputRel, validation }),
    ...artifactsEndpoint({
      runId,
      sessionId,
      cwd: args.cwd,
      outputPath: args.result.outputPath,
      includePrd: true,
      includeOutputHtml: Boolean(args.result.outputPath),
    }),
  ];
  return send(endpoints);
}

export async function recordValidationObservability(
  args: RecordValidationArgs,
): Promise<SinkPostResult[]> {
  const mockupFile = rel(args.cwd, args.filePath);
  const runId = buildRunId("validate", args.cwd, mockupFile);
  const client = clientContext();
  const sessionId = resolveSessionId(args.cwd, mockupFile);
  const endpoints: SinkEndpoint[] = [
    sessionEndpoint({
      sessionId,
      client,
      tool: args.tool,
      cwd: args.cwd,
      mockupFile,
      status: args.result.ok ? "completed" : "failed",
      dsVersion: args.dsVersion,
    }),
    {
      path: "/mockup-runs/import",
      body: {
        runId,
        sessionId,
        client,
        tool: args.tool,
        eventType: "validate_html_mockup",
        status: args.result.ok ? "completed" : "failed",
        cwdHash: args.cwd ? hash(path.resolve(args.cwd), 16) : null,
        mockupFile,
        dsVersion: args.dsVersion,
        validationOk: args.result.ok,
      },
    },
    {
      path: "/events/import",
      body: {
        eventId: `${runId}#validation`,
        sessionId,
        client,
        type: "validation_completed",
        mockupFile,
        timestamp: now(),
        payload: {
          tool: args.tool,
          ok: args.result.ok,
          violationCount: args.result.violations.length,
          errorCount: args.result.severitySummary.error,
          warnCount: args.result.severitySummary.warn,
        },
      },
    },
    ...usageEndpoint(args.result.report, sessionId, client, runId),
    ...qualityEndpoint({ runId, sessionId, mockupFile, validation: args.result }),
    ...violationsEndpoint({ runId, sessionId, mockupFile, validation: args.result }),
  ];
  return send(endpoints);
}

interface RecordObservabilityArgs {
  name: string;
  args: JsonObject;
  result: unknown;
  dsVersion?: string | null;
}

/**
 * observability 적재 SSOT 디스패처 — 툴 이름으로 라우팅한다. server.ts 의 registerToolHandlers
 * ({ afterCall }) 단일 choke-point 에서 호출돼, 새 툴이 적재를 빠뜨리는 일관성 갭을 없앤다.
 * 핸들러가 부르던 record{Build,Validation,Quality} 를 result/args 에서 재구성한다.
 * 대상이 아닌 툴/비정상 result 면 null(=무동작).
 */
export async function recordObservability(
  ctx: RecordObservabilityArgs,
): Promise<SinkPostResult[] | null> {
  const { name, result } = ctx;
  if (!result || typeof result !== "object" || Array.isArray(result)) return null;
  const dsVersion = ctx.dsVersion ?? null;
  const a = ctx.args as {
    cwd?: string;
    source?: string;
    filePath?: string;
    brand?: string;
    surface?: string;
  };
  switch (name) {
    case "build_singlefile_html":
      return recordBuildObservability({
        tool: name,
        cwd: a.cwd,
        dsVersion,
        result: result as BuildSinglefileHtmlResult,
      });
    case "validate_html_mockup":
      return recordValidationObservability({
        tool: name,
        cwd: a.cwd,
        source: a.source,
        filePath: a.filePath,
        dsVersion,
        result: result as RecordValidationArgs["result"],
      });
    case "score_mockup_quality": {
      const r = result as {
        ok?: boolean;
        codeScores?: { overall: number; dimensions?: Record<string, number> } | null;
        llm?: LlmScoreResult;
        verdict?: string;
        verdictLabel?: string;
        overall?: number | null;
      };
      // 핸들러의 early-return 에러({ ok:false })는 llm 이 없으므로 적재 제외 — 원래 동작과 동일.
      if (r.ok === false || !r.llm) return null;
      return recordQualityObservability({
        tool: name,
        cwd: a.cwd,
        filePath: a.filePath,
        brand: a.brand,
        surface: a.surface,
        dsVersion,
        codeScores: r.codeScores ?? null,
        llm: r.llm,
        verdict: r.verdict,
        verdictLabel: r.verdictLabel,
        overall: r.overall ?? null,
      });
    }
    default:
      return null;
  }
}

export async function recordQualityObservability(
  args: RecordQualityArgs,
): Promise<SinkPostResult[]> {
  const mockupFile = rel(args.cwd, args.filePath);
  const runId = buildRunId("quality", args.cwd, mockupFile);
  const client = clientContext();
  const sessionId = resolveSessionId(args.cwd, mockupFile);
  return send([
    sessionEndpoint({
      sessionId,
      client,
      tool: args.tool,
      cwd: args.cwd,
      mockupFile,
      status: args.verdict === "fail" ? "failed" : "completed",
      dsVersion: args.dsVersion,
    }),
    {
      path: "/quality/import",
      body: {
        runId,
        sessionId,
        client,
        mockupFile,
        brand: args.brand,
        surface: args.surface,
        dsVersion: args.dsVersion,
        codeScores: args.codeScores,
        codeOverall: args.codeScores?.overall,
        codeDimensions: args.codeScores?.dimensions,
        llm: args.llm,
        verdict: args.verdict,
        verdictLabel: args.verdictLabel,
        overall: args.overall,
      },
    },
  ]);
}
