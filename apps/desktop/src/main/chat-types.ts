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

/** UI/저장 SSOT. 라이브·재생 공통 렌더 단위. */
export type ChatMessage =
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
  | { kind: "error"; text: string };

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

/** 유저 턴 1건을 claude `--input-format stream-json` 이 받는 JSON 라인으로 직렬화. */
export function encodeUserTurn(text: string): string {
  return (
    JSON.stringify({
      type: "user",
      message: { role: "user", content: [{ type: "text", text }] },
    }) + "\n"
  );
}
