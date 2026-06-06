import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { BuildSinglefileHtmlResult } from "@nudge-design/mockup-core/tools/build-html";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core/tools/html-validator";
import type { ReportHtmlMockupUsageResult } from "@nudge-design/mockup-core/tools/html-analyzer";
import type { LlmScoreResult } from "@nudge-design/mockup-core/tools/quality-score-core";
import { getClientIdentity } from "./client-identity.js";

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

const DEFAULT_MOCKUP_API_URL = "http://127.0.0.1:8090";
const POST_TIMEOUT_MS = 1500;

function isEnabled(): boolean {
  const flag = process.env.NUDGE_MOCKUP_API_LOG ?? process.env.NUDGE_OBSERVABILITY_LOG;
  return !["0", "false", "off", "no"].includes((flag ?? "1").toLowerCase());
}

function baseUrl(): string | null {
  if (!isEnabled()) return null;
  const raw =
    process.env.NUDGE_MOCKUP_API_URL ??
    process.env.NUDGE_DASHBOARD_API_URL ??
    process.env.NUDGE_OBSERVABILITY_API_URL ??
    DEFAULT_MOCKUP_API_URL;
  return raw.replace(/\/+$/, "");
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

async function postEndpoint(base: string, endpoint: SinkEndpoint): Promise<SinkPostResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), POST_TIMEOUT_MS);
  try {
    const res = await fetch(`${base}${endpoint.path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(endpoint.body),
      signal: controller.signal,
    });
    return { target: base, path: endpoint.path, ok: res.ok, status: res.status };
  } catch (err) {
    return { target: base, path: endpoint.path, ok: false, error: (err as Error).message };
  } finally {
    clearTimeout(timer);
  }
}

async function send(endpoints: SinkEndpoint[]): Promise<SinkPostResult[]> {
  const base = baseUrl();
  if (!base || endpoints.length === 0) return [];
  const results: SinkPostResult[] = [];
  for (const endpoint of endpoints) {
    results.push(await postEndpoint(base, endpoint));
  }
  return results;
}

function usageEndpoint(
  report: ReportHtmlMockupUsageResult | undefined,
  sessionId: string | null,
): SinkEndpoint[] {
  if (!report?.usage) return [];
  return [{ path: "/usage/import", body: { ...report.usage, sessionId } }];
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

function artifactsEndpoint(args: {
  runId: string;
  sessionId: string | null;
  cwd?: string;
  outputPath?: string;
  includePrd: boolean;
  includeOutputHtml: boolean;
}): SinkEndpoint[] {
  const rows: JsonObject[] = [];
  if (args.includePrd) {
    const prd = readInitialPrd(args.cwd);
    if (prd) {
      rows.push({
        artifactId: `${args.runId}#initial-prd`,
        runId: args.runId,
        sessionId: args.sessionId,
        kind: "initial-prd",
        source: prd.source,
        content: prd.content,
        contentHash: hash(prd.content, 24),
      });
    }
  }
  if (args.includeOutputHtml) {
    const html = safeRead(args.outputPath);
    if (html) {
      rows.push({
        artifactId: `${args.runId}#first-output-html`,
        runId: args.runId,
        sessionId: args.sessionId,
        kind: "first-output-html",
        source: rel(args.cwd, args.outputPath),
        content: html,
        contentHash: hash(html, 24),
      });
    }
  }
  return rows.length > 0 ? [{ path: "/artifacts/import", body: rows }] : [];
}

export async function recordBuildObservability(args: RecordBuildArgs): Promise<SinkPostResult[]> {
  const outputRel = rel(args.cwd, args.result.outputPath);
  const runId = buildRunId("build", args.cwd, outputRel);
  const sessionId = currentSessionId();
  const client = clientContext();
  const validation = args.result.validation;
  const endpoints: SinkEndpoint[] = [
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
    ...usageEndpoint(args.result.report, sessionId),
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
  const sessionId = currentSessionId();
  const client = clientContext();
  const endpoints: SinkEndpoint[] = [
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
    ...usageEndpoint(args.result.report, sessionId),
    ...qualityEndpoint({ runId, sessionId, mockupFile, validation: args.result }),
    ...violationsEndpoint({ runId, sessionId, mockupFile, validation: args.result }),
  ];
  return send(endpoints);
}

export async function recordQualityObservability(
  args: RecordQualityArgs,
): Promise<SinkPostResult[]> {
  const mockupFile = rel(args.cwd, args.filePath);
  const runId = buildRunId("quality", args.cwd, mockupFile);
  const sessionId = currentSessionId();
  const client = clientContext();
  return send([
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
