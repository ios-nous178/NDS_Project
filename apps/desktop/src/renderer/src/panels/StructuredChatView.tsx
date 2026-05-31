import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../../../preload/index.js";
import { btnReset, c, font, mono, primaryBtn, primaryBtnDisabled } from "../ui/theme.js";

/**
 * 구조화(stream-json · canary) 세션의 카드형 채팅 렌더러.
 *
 * PTY xterm 과 달리 claude 의 구조적 이벤트(text · tool_use · tool_result · result)를
 * 사람이 읽기 좋은 카드/칩으로 보여준다. 라이브(AgentPanel) 와 과거 재생(App)이 같은
 * `ChatMessage[]` 를 같은 렌더러로 그린다 — 라이브는 입력창 노출, 재생은 read-only.
 */

function toolIcon(tool: string): string {
  switch (tool) {
    case "Read":
      return "📄";
    case "Write":
    case "Edit":
    case "MultiEdit":
    case "NotebookEdit":
      return "✏️";
    case "Bash":
      return "💻";
    case "Glob":
    case "Grep":
      return "🔍";
    case "TodoWrite":
      return "✅";
    case "WebFetch":
    case "WebSearch":
      return "🌐";
    case "Task":
      return "🤖";
    default:
      return "🔧"; // mcp(find_component / validate_html_mockup …) 포함
  }
}

const fmtTokens = (n?: number): string =>
  n == null ? "" : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

function resultFooter(m: Extract<ChatMessage, { kind: "result" }>): string {
  const parts: string[] = [m.ok ? "완료" : "실패"];
  if (m.usage && (m.usage.input != null || m.usage.output != null)) {
    parts.push(`${fmtTokens(m.usage.input)}→${fmtTokens(m.usage.output)} tok`);
  }
  if (m.durationMs != null) parts.push(`${(m.durationMs / 1000).toFixed(1)}s`);
  if (m.costUsd != null) parts.push(`$${m.costUsd.toFixed(m.costUsd < 0.01 ? 4 : 2)}`);
  return parts.join(" · ");
}

function MessageRow({ m }: { m: ChatMessage }): React.JSX.Element | null {
  switch (m.kind) {
    case "user":
      return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              maxWidth: "85%",
              background: c.accentBg,
              border: `1px solid ${c.accent}`,
              color: c.text,
              borderRadius: 10,
              padding: "7px 11px",
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {m.text}
          </div>
        </div>
      );
    case "assistant-text":
      return (
        <div
          style={{
            color: c.text,
            fontSize: 13,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {m.text}
        </div>
      );
    case "tool-use":
      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            alignSelf: "flex-start",
            background: c.bgElevated,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 12,
            maxWidth: "100%",
          }}
        >
          <span aria-hidden>{toolIcon(m.tool)}</span>
          <span style={{ color: c.text, fontFamily: mono, fontWeight: 600 }}>{m.tool}</span>
          {m.summary && (
            <span
              style={{
                color: c.textMuted,
                fontFamily: mono,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {m.summary}
            </span>
          )}
        </div>
      );
    case "tool-result":
      return (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            paddingLeft: 12,
            fontSize: 11.5,
            color: c.textMuted,
            fontFamily: mono,
          }}
        >
          <span style={{ color: m.ok ? c.green : c.red }}>{m.ok ? "↳" : "✕"}</span>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {m.summary || (m.ok ? "(완료)" : "(오류)")}
          </span>
        </div>
      );
    case "result":
      return (
        <div
          style={{
            borderTop: `1px solid ${c.borderSubtle}`,
            margin: "4px 0",
            paddingTop: 8,
            textAlign: "center",
            fontSize: 11,
            color: c.textFaint,
            fontFamily: mono,
          }}
        >
          {resultFooter(m)}
        </div>
      );
    case "error":
      return (
        <div
          style={{
            background: "rgba(244,135,113,0.12)",
            border: `1px solid ${c.red}`,
            borderRadius: 8,
            padding: "7px 11px",
            fontSize: 12,
            color: c.red,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: mono,
          }}
        >
          {m.text}
        </div>
      );
    default:
      return null;
  }
}

/** 메시지 리스트(자동 스크롤). 라이브·재생 공통. */
function MessageList({ messages }: { messages: ChatMessage[] }): React.JSX.Element {
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 9,
      }}
    >
      {messages.length === 0 && (
        <div style={{ color: c.textFaint, fontSize: 12.5, margin: "auto", textAlign: "center" }}>
          아직 메시지가 없습니다.
        </div>
      )}
      {messages.map((m, i) => (
        <MessageRow key={i} m={m} />
      ))}
      <div ref={endRef} />
    </div>
  );
}

/**
 * 라이브 구조화 채팅 — 메시지 리스트 + 하단 입력창. AgentPanel 이 messages(라이브 누적)와
 * onSend 를 내려준다. `disabled` 면 입력 비활성(세션 미실행).
 */
export function StructuredChatView({
  messages,
  onSend,
  disabled,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  disabled: boolean;
}): React.JSX.Element {
  const [draft, setDraft] = useState("");
  const send = (): void => {
    const text = draft.trim();
    if (!text || disabled) return;
    onSend(text);
    setDraft("");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <MessageList messages={messages} />
      <div style={{ borderTop: `1px solid ${c.border}`, padding: 10, display: "flex", gap: 8 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter 전송 / Shift+Enter 줄바꿈.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={
            disabled
              ? "세션을 시작하면 입력할 수 있습니다"
              : "메시지 입력 (Enter 전송 · Shift+Enter 줄바꿈)"
          }
          rows={2}
          disabled={disabled}
          style={{
            flex: 1,
            resize: "none",
            boxSizing: "border-box",
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${c.border}`,
            background: c.bg,
            color: c.text,
            fontSize: 13,
            fontFamily: font,
            lineHeight: 1.5,
            outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={disabled || !draft.trim()}
          style={{
            ...(disabled || !draft.trim() ? primaryBtnDisabled : primaryBtn),
            alignSelf: "stretch",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}

/**
 * 과거 구조화 세션의 read-only 재생(App 의 기록 보기). TranscriptView(xterm raw)의
 * 구조화 버전 — 같은 헤더 톤 + 같은 MessageList 렌더러, 입력창 없음.
 */
export function StructuredTranscriptView({
  projectPath,
  sessionId,
  label,
  onClose,
}: {
  projectPath: string;
  sessionId: string;
  label: string;
  onClose: () => void;
}): React.JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  useEffect(() => {
    let alive = true;
    void window.harness.readStructuredTranscript(projectPath, sessionId).then((res) => {
      if (alive) setMessages(res.messages);
    });
    return () => {
      alive = false;
    };
  }, [projectPath, sessionId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 40,
          boxSizing: "border-box",
          padding: "0 12px",
          borderBottom: `1px solid ${c.border}`,
          fontSize: 12.5,
          color: c.text,
        }}
      >
        <span style={{ color: c.yellow }}>기록 보기</span>
        <span
          style={{
            fontSize: 10.5,
            color: c.textMuted,
            background: c.bgElevated,
            border: `1px solid ${c.border}`,
            borderRadius: 999,
            padding: "1px 7px",
            whiteSpace: "nowrap",
          }}
          title="끝난 구조화(canary) 세션의 기록입니다. 대화를 이어가려면 새 세션을 시작하세요."
        >
          구조화 · 읽기 전용
        </span>
        <span
          style={{
            color: c.textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <button
          onClick={onClose}
          style={{
            ...btnReset,
            marginLeft: "auto",
            padding: "4px 12px",
            borderRadius: 6,
            border: `1px solid ${c.border}`,
            background: c.bgElevated,
            color: c.text,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ← 새 세션
        </button>
      </div>
      <MessageList messages={messages} />
    </div>
  );
}
