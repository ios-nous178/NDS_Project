/**
 * 구조화(stream-json) transport 의 정규화 채팅 메시지 + claude NDJSON 파서.
 *
 * 이 파일은 electron / node-pty 등 런타임 의존이 **없는 순수 모듈**이다 — 그래야
 * `node --test src/main/chat-types.test.ts` 로 electron 없이 단위 테스트할 수 있다.
 *
 * 라이브(stream-runner 가 emit) 와 과거 재생(<id>.jsonl) 이 **같은 렌더러**를 쓰도록,
 * claude `--output-format stream-json` 의 NDJSON 라인을 아래 `ChatMessage` union 으로
 * 정규화해 저장/전송한다. (raw NDJSON 이 아니라 정규화 형태로 영구저장 → 재생이 trivial.)
 */

/**
 * DesignSpec 트리 미리보기(카드 렌더용 — geometry 없는 의도 트리).
 *
 * MCP DesignSpecNode(design-spec.ts)의 per-node props/tokens/rationale 와 top-level
 * specVersion 은 **의도적으로 생략**한다(승인 카드 밀도 유지). 토큰/컴포넌트 적용 현황은
 * 집계값 componentsUsed/tokensUsed(MCP 가 채움, DesignSpecCardMessage)로 카드에 노출되므로
 * per-node 까지 펼치지 않아도 커버리지는 보인다. 더 풍부한 리뷰가 필요하면 여기에 tokens/
 * rationale 를 추가하고 SpecTree 렌더러(StructuredChatView)에서 펼친다.
 */
export interface DesignSpecNodePreview {
  component?: string;
  role?: string;
  children?: DesignSpecNodePreview[];
}
export interface DesignSpecPreview {
  screen?: { brand?: string; surface?: string; intent?: string; name?: string };
  tree?: DesignSpecNodePreview[];
  decisions?: string[];
}
export interface DesignSpecViolationLite {
  rule: string;
  severity: "error" | "warn" | "info";
  path: string;
  message: string;
}
/**
 * save_design_spec(MCP) 호출 결과를 카드로 보여주는 정규화 메시지(stream 전용).
 * 코드 작성 전 soft 승인 게이트의 렌더 단위 — 라이브는 [승인]/[수정] 버튼, 재생은 read-only.
 */
export interface DesignSpecCardMessage {
  kind: "design-spec";
  toolUseId: string;
  ok: boolean;
  brand: string | null;
  spec: DesignSpecPreview;
  violations: DesignSpecViolationLite[];
  summary: { error: number; warn: number; info: number };
  componentsUsed: string[];
  tokensUsed: string[];
  path: string | null;
}

/** UI/저장 SSOT. 라이브·재생 공통 렌더 단위. */
export type ChatMessage = (
  | { kind: "user"; text: string }
  | { kind: "assistant-text"; text: string }
  | { kind: "tool-use"; id: string; tool: string; summary: string }
  | { kind: "tool-result"; id: string; ok: boolean; summary: string }
  | {
      kind: "result";
      ok: boolean;
      durationMs?: number;
      usage?: { input?: number; output?: number };
      costUsd?: number;
    }
  | { kind: "error"; text: string }
  // 하네스가 끼워넣는 시스템 안내(자동 자기교정 진행/소진 등). 에이전트 발화 아님.
  | { kind: "notice"; text: string; tone?: "info" | "warn" }
  | DesignSpecCardMessage
  | DesignScoreMessage
) & {
  /**
   * 단조 증가 시퀀스 — stream emit 시점에 세션당 0,1,2…로 부여(.jsonl 저장 + agent:message
   * 둘 다에 실림). 라이브 attach 가 과거(.jsonl)를 깐 뒤 라이브를 이을 때, 경계의 한 메시지가
   * 양쪽에 잡혀도 같은 seq 로 중복 제거한다. 옛 라인/pty 경로는 undefined.
   */
  seq?: number;
};

/** D3 품질 스코어 카드 — D1 코드 점수 + D2 LLM 점수. clean 빌드 후 1회 자동 채점해 보여준다. */
export interface DesignScoreMessage {
  kind: "design-score";
  /** D1 결정적 코드 점수(차원별 0~100 + overall). 없으면 null. */
  codeScores: CodeScores | null;
  /** D2 독립 LLM 채점 결과(ux/interaction/flow/form). */
  llm: {
    ok: boolean;
    overall?: number;
    scores?: Record<string, number>;
    notes?: string;
    error?: string;
  };
}

/**
 * NDJSON 라인 버퍼. stdout 청크는 라인 경계와 안 맞으므로(한 청크에 여러 줄 / 줄 중간이
 * 잘려 옴) remainder 를 보존하며 **완성된 줄**만 잘라낸다. JSON 파싱 실패 줄은 건너뛴다.
 */
export class NdjsonBuffer {
  private buf = "";

  /** 청크를 흡수하고, 이번에 완성된 줄들의 파싱 결과(JSON 객체)를 순서대로 반환. */
  push(chunk: string): unknown[] {
    this.buf += chunk;
    const out: unknown[] = [];
    let nl: number;
    while ((nl = this.buf.indexOf("\n")) !== -1) {
      const line = this.buf.slice(0, nl).trim();
      this.buf = this.buf.slice(nl + 1);
      if (!line) continue;
      try {
        out.push(JSON.parse(line));
      } catch {
        /* 미완/깨진 줄 — 무시 */
      }
    }
    return out;
  }

  /** 스트림 종료 시 남은 한 줄(개행 없이 끝난 마지막 줄)을 파싱해 반환. */
  flush(): unknown[] {
    const line = this.buf.trim();
    this.buf = "";
    if (!line) return [];
    try {
      return [JSON.parse(line)];
    } catch {
      return [];
    }
  }
}

const basename = (p: string): string => {
  const s = p.replace(/[\\/]+$/, "");
  const i = Math.max(s.lastIndexOf("/"), s.lastIndexOf("\\"));
  return i === -1 ? s : s.slice(i + 1);
};

const clip = (s: string, max = 120): string => (s.length > max ? s.slice(0, max - 1) + "…" : s);

/** mcp__server__tool → tool (사람이 읽는 짧은 이름). */
function shortToolName(name: string): string {
  if (name.startsWith("mcp__")) {
    const parts = name.split("__");
    return parts[parts.length - 1] || name;
  }
  return name;
}

/** tool_use 칩에 보일 한 줄 요약(핵심 인자만). 아이콘은 렌더러가 tool 이름으로 고른다. */
function summarizeToolInput(name: string, input: unknown): string {
  const o = (input ?? {}) as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v : "");
  switch (name) {
    case "Read":
    case "Write":
    case "Edit":
    case "MultiEdit":
    case "NotebookEdit":
      return basename(str(o.file_path ?? o.notebook_path));
    case "Bash":
      return clip(str(o.command));
    case "Glob":
      return clip(str(o.pattern));
    case "Grep":
      return clip(str(o.pattern) + (o.path ? ` in ${basename(str(o.path))}` : ""));
    default: {
      // mcp / 기타: 대표 인자 추정 → 없으면 compact JSON.
      const cand = str(o.query) || str(o.name) || str(o.topic) || str(o.filePath);
      if (cand) return clip(cand);
      try {
        const j = JSON.stringify(o);
        return j === "{}" ? "" : clip(j);
      } catch {
        return "";
      }
    }
  }
}

/** tool_result 의 content(string | block[]) 를 사람이 읽는 한 줄로. */
function summarizeToolResult(content: unknown): string {
  if (typeof content === "string") return clip(content.replace(/\s+/g, " ").trim());
  if (Array.isArray(content)) {
    const text = content
      .map((b) =>
        b && typeof b === "object" && "text" in b ? String((b as { text: unknown }).text) : "",
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    return clip(text);
  }
  return "";
}

interface RawAssistant {
  type: "assistant";
  message?: { content?: unknown[] };
}
interface RawUser {
  type: "user";
  message?: { content?: unknown[] };
}
interface RawResult {
  type: "result";
  is_error?: boolean;
  duration_ms?: number;
  total_cost_usd?: number;
  usage?: { input_tokens?: number; output_tokens?: number };
}

/**
 * claude NDJSON 라인 1개 → 0개 이상의 `ChatMessage`.
 *  - system(hook_ / init 등) · rate_limit_event 등 노이즈 → [] (무시)
 *  - assistant.content[] → text / tool_use 블록별로 분해
 *  - user.content[] → tool_result 블록
 *  - result → 토큰/시간/비용 푸터
 * 알 수 없는 형태는 조용히 [] (UI 를 깨지 않음).
 */
export function mapClaudeEvent(evt: unknown): ChatMessage[] {
  if (!evt || typeof evt !== "object") return [];
  const e = evt as { type?: string };
  switch (e.type) {
    case "assistant": {
      const content = (e as RawAssistant).message?.content;
      if (!Array.isArray(content)) return [];
      const out: ChatMessage[] = [];
      for (const block of content) {
        if (!block || typeof block !== "object") continue;
        const b = block as Record<string, unknown>;
        if (b.type === "text" && typeof b.text === "string" && b.text.trim()) {
          out.push({ kind: "assistant-text", text: b.text });
        } else if (b.type === "tool_use" && typeof b.name === "string") {
          out.push({
            kind: "tool-use",
            id: typeof b.id === "string" ? b.id : "",
            tool: shortToolName(b.name),
            summary: summarizeToolInput(b.name, b.input),
          });
        }
      }
      return out;
    }
    case "user": {
      const content = (e as RawUser).message?.content;
      if (!Array.isArray(content)) return [];
      const out: ChatMessage[] = [];
      for (const block of content) {
        if (!block || typeof block !== "object") continue;
        const b = block as Record<string, unknown>;
        if (b.type === "tool_result") {
          out.push({
            kind: "tool-result",
            id: typeof b.tool_use_id === "string" ? b.tool_use_id : "",
            ok: b.is_error !== true,
            summary: summarizeToolResult(b.content),
          });
        }
      }
      return out;
    }
    case "result": {
      const r = e as RawResult;
      return [
        {
          kind: "result",
          ok: r.is_error !== true,
          durationMs: typeof r.duration_ms === "number" ? r.duration_ms : undefined,
          costUsd: typeof r.total_cost_usd === "number" ? r.total_cost_usd : undefined,
          usage: r.usage
            ? { input: r.usage.input_tokens, output: r.usage.output_tokens }
            : undefined,
        },
      ];
    }
    default:
      return [];
  }
}

/** tool_result content(string | block[]) 의 **전체** 텍스트(요약 X) — JSON 파싱용. */
function fullToolResultText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((b) =>
        b && typeof b === "object" && "text" in b ? String((b as { text: unknown }).text) : "",
      )
      .join("");
  }
  return "";
}

/** save_design_spec input.spec(객체 또는 JSON 문자열) → 카드용 미리보기 트리. */
function normalizeSpecInput(raw: unknown): DesignSpecPreview {
  let v = raw;
  if (typeof v === "string") {
    try {
      v = JSON.parse(v);
    } catch {
      return {};
    }
  }
  if (!v || typeof v !== "object") return {};
  return v as DesignSpecPreview;
}

function asViolations(raw: unknown): DesignSpecViolationLite[] {
  if (!Array.isArray(raw)) return [];
  const out: DesignSpecViolationLite[] = [];
  for (const v of raw) {
    if (!v || typeof v !== "object") continue;
    const o = v as Record<string, unknown>;
    const sev =
      o.severity === "error" || o.severity === "warn" || o.severity === "info"
        ? o.severity
        : "info";
    out.push({
      rule: String(o.rule ?? ""),
      severity: sev,
      path: String(o.path ?? ""),
      message: String(o.message ?? ""),
    });
  }
  return out;
}

function asStringArray(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
}

/** save_design_spec 결과 텍스트(JSON) + 저장돼 있던 spec → design-spec 카드 메시지. 실패 시 null. */
function buildDesignSpecMessage(
  toolUseId: string,
  spec: DesignSpecPreview,
  resultText: string,
): DesignSpecCardMessage | null {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(resultText) as Record<string, unknown>;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const summary = (parsed.summary ?? {}) as Record<string, unknown>;
  const num = (v: unknown): number => (typeof v === "number" ? v : 0);
  return {
    kind: "design-spec",
    toolUseId,
    ok: parsed.ok === true,
    brand: typeof parsed.brand === "string" ? parsed.brand : null,
    spec,
    violations: asViolations(parsed.violations),
    summary: { error: num(summary.error), warn: num(summary.warn), info: num(summary.info) },
    componentsUsed: asStringArray(parsed.componentsUsed),
    tokensUsed: asStringArray(parsed.tokensUsed),
    path: typeof parsed.path === "string" ? parsed.path : null,
  };
}

/**
 * 스트림에서 save_design_spec 의 tool_use(인자=spec) ↔ tool_result(검증 결과) 를 id 로
 * 상관시켜 design-spec 카드 메시지를 만든다(코드前 soft 승인 게이트의 렌더 단위).
 *
 * mapClaudeEvent 는 stateless 라 두 이벤트(assistant→user)를 묶을 수 없어 별도 stateful 트래커.
 * 세션 1개당 인스턴스 1개. startStreamAgent 의 drain 에서 매 raw 이벤트를 observe 한다.
 */
export class DesignSpecTracker {
  private specById = new Map<string, DesignSpecPreview>();

  observe(evt: unknown): ChatMessage[] {
    if (!evt || typeof evt !== "object") return [];
    const e = evt as { type?: string };
    if (e.type === "assistant") {
      const content = (e as RawAssistant).message?.content;
      if (!Array.isArray(content)) return [];
      for (const block of content) {
        if (!block || typeof block !== "object") continue;
        const b = block as Record<string, unknown>;
        if (
          b.type === "tool_use" &&
          typeof b.name === "string" &&
          shortToolName(b.name) === "save_design_spec" &&
          typeof b.id === "string"
        ) {
          const input = (b.input ?? {}) as Record<string, unknown>;
          this.specById.set(b.id, normalizeSpecInput(input.spec));
        }
      }
      return [];
    }
    if (e.type === "user") {
      const content = (e as RawUser).message?.content;
      if (!Array.isArray(content)) return [];
      const out: ChatMessage[] = [];
      for (const block of content) {
        if (!block || typeof block !== "object") continue;
        const b = block as Record<string, unknown>;
        if (
          b.type === "tool_result" &&
          typeof b.tool_use_id === "string" &&
          this.specById.has(b.tool_use_id)
        ) {
          const spec = this.specById.get(b.tool_use_id) ?? {};
          this.specById.delete(b.tool_use_id);
          const msg = buildDesignSpecMessage(b.tool_use_id, spec, fullToolResultText(b.content));
          if (msg) out.push(msg);
        }
      }
      return out;
    }
    return [];
  }
}

/** 한 턴의 검증 결과 요약(자동 자기교정 판단용). */
export interface CodeScores {
  overall: number;
  dimensions: Record<string, number>;
}

export interface ValidationOutcome {
  hasErrors: boolean;
  errorCount: number;
  /** error severity 룰만 (rule + 발생 수). 교정 프롬프트에 나열. */
  errorRules: { rule: string; count: number }[];
  /** D1 코드 품질 점수(차원별 0~100 + overall) — validate/build 결과의 scores 블록. */
  codeScores?: CodeScores;
  /** build_singlefile_html 산출물 경로 — clean 빌드 후 LLM 채점(D3) 대상. */
  buildOutputPath?: string;
}

/** validate_html_mockup / build_singlefile_html tool_result(JSON) → ValidationOutcome. */
function parseValidationOutcome(resultText: string): ValidationOutcome | null {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(resultText) as Record<string, unknown>;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  // build_singlefile_html 은 검증을 .validation 아래에 중첩; validate_html_mockup 은 top-level.
  const v =
    parsed.validation && typeof parsed.validation === "object"
      ? (parsed.validation as Record<string, unknown>)
      : parsed;
  const ss = v.severitySummary as Record<string, unknown> | undefined;
  if (!ss || typeof ss !== "object") return null;
  const errorCount = typeof ss.error === "number" ? ss.error : 0;
  const hasErrors = ss.hasErrors === true || errorCount > 0;
  const byRule = Array.isArray(v.violationsByRule) ? v.violationsByRule : [];
  const errorRules = byRule
    .filter(
      (r): r is Record<string, unknown> =>
        !!r && typeof r === "object" && (r as Record<string, unknown>).severity === "error",
    )
    .map((r) => ({ rule: String(r.rule ?? ""), count: typeof r.count === "number" ? r.count : 1 }));
  // D1 코드 점수(validate/build 의 scores 블록) + 빌드 산출물 경로(outputPath 는 build 결과 top-level).
  const rawScores = v.scores as Record<string, unknown> | undefined;
  let codeScores: CodeScores | undefined;
  if (rawScores && typeof rawScores === "object" && typeof rawScores.overall === "number") {
    const dims = rawScores.dimensions;
    codeScores = {
      overall: rawScores.overall,
      dimensions: dims && typeof dims === "object" ? (dims as Record<string, number>) : {},
    };
  }
  const buildOutputPath = typeof parsed.outputPath === "string" ? parsed.outputPath : undefined;
  return { hasErrors, errorCount, errorRules, codeScores, buildOutputPath };
}

/**
 * 자동 자기교정용 트래커 — validate/build 의 tool_use↔tool_result 를 상관시켜 "이번 턴 마지막
 * 검증 결과"를 추적하고, result(턴 종료) 시 그 결과를 돌려준다(그리고 턴 상태 리셋).
 * 루프 컨트롤(횟수 cap·교정 턴 전송)은 agent-runner 가 담당 — 이 트래커는 순수 판단만.
 */
export class SelfCorrectionTracker {
  private toolById = new Map<string, string>(); // tool_use_id → short tool name (validate/build)
  private latest: ValidationOutcome | null = null;

  observe(evt: unknown): { turnEnded: true; validation: ValidationOutcome | null } | null {
    if (!evt || typeof evt !== "object") return null;
    const e = evt as { type?: string };
    if (e.type === "assistant") {
      const content = (e as RawAssistant).message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (!block || typeof block !== "object") continue;
          const b = block as Record<string, unknown>;
          if (b.type === "tool_use" && typeof b.id === "string" && typeof b.name === "string") {
            const short = shortToolName(b.name);
            if (short === "validate_html_mockup" || short === "build_singlefile_html") {
              this.toolById.set(b.id, short);
            }
          }
        }
      }
      return null;
    }
    if (e.type === "user") {
      const content = (e as RawUser).message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (!block || typeof block !== "object") continue;
          const b = block as Record<string, unknown>;
          if (
            b.type === "tool_result" &&
            typeof b.tool_use_id === "string" &&
            this.toolById.has(b.tool_use_id)
          ) {
            this.toolById.delete(b.tool_use_id);
            const outcome = parseValidationOutcome(fullToolResultText(b.content));
            if (outcome) this.latest = outcome; // 턴 내 마지막 검증이 곧 그 턴의 결론
          }
        }
      }
      return null;
    }
    if (e.type === "result") {
      const v = this.latest;
      this.latest = null;
      this.toolById.clear();
      return { turnEnded: true, validation: v };
    }
    return null;
  }
}

/** 유저 턴 1건을 claude `--input-format stream-json` 이 받는 JSON 라인으로 직렬화. */
export function encodeUserTurn(text: string): string {
  return (
    JSON.stringify({
      type: "user",
      message: { role: "user", content: [{ type: "text", text }] },
    }) + "\n"
  );
}
