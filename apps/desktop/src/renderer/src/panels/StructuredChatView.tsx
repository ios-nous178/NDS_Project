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

type DesignSpecMsg = Extract<ChatMessage, { kind: "design-spec" }>;
type SpecNode = NonNullable<DesignSpecMsg["spec"]["tree"]>[number];
type DesignScoreMsg = Extract<ChatMessage, { kind: "design-score" }>;

const SCORE_FIX_PREFIX =
  "🤖 LLM 품질 평가 피드백을 반영해서 고쳐줘 (새 컴포넌트 추가 말고 지적된 점만 개선 후 validate/build): ";
/** 점수 → 색 (≥80 green · ≥60 yellow · 그 외 red). */
const scoreColor = (n: number): string => (n >= 80 ? c.green : n >= 60 ? c.yellow : c.red);

const APPROVE_TURN =
  "✅ 이 DesignSpec 을 승인합니다. 이 스펙 그대로 컴포넌트 가이드(target:'html') 확인 → index.html 작성 → validate_html_mockup(위반 0) → build_singlefile_html 까지 진행해줘.";
const REJECT_PREFIX =
  "✋ 이 방향 말고 아래 피드백을 반영해서 save_design_spec 으로 스펙을 다시 만들어줘 (아직 코드는 쓰지 말 것):\n";

/** DesignSpec 트리(컴포넌트명 + 의도)를 들여쓰기로 재귀 렌더. geometry 는 없다(의도만). */
function SpecTree({
  nodes,
  depth = 0,
}: {
  nodes?: SpecNode[];
  depth?: number;
}): React.JSX.Element | null {
  if (!nodes || nodes.length === 0) return null;
  return (
    <>
      {nodes.map((n, i) => (
        <div key={i}>
          <div
            style={{
              fontSize: 12,
              fontFamily: mono,
              color: c.text,
              lineHeight: 1.7,
              paddingLeft: depth * 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {depth > 0 && <span style={{ color: c.textFaint }}>└ </span>}
            <span style={{ fontWeight: 600 }}>{n.component ?? "?"}</span>
            {n.role && <span style={{ color: c.textMuted }}> · {n.role}</span>}
          </div>
          <SpecTree nodes={n.children} depth={depth + 1} />
        </div>
      ))}
    </>
  );
}

/**
 * design-spec 카드 — 코드前 soft 승인 게이트의 렌더 단위.
 * 검증 통과/위반·의도 트리·결정·메타를 보여주고, 라이브·미승인(isPending)일 때만
 * [승인하고 빌드] / [수정 요청] 버튼을 띄운다. 버튼은 onAction(다음 유저 턴)으로 흐른다.
 */
function DesignSpecCard({
  m,
  isPending,
  onAction,
}: {
  m: DesignSpecMsg;
  isPending?: boolean;
  onAction?: (text: string) => void;
}): React.JSX.Element {
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const errors = m.violations.filter((v) => v.severity === "error");
  const warns = m.violations.filter((v) => v.severity === "warn");
  const screen = m.spec.screen ?? {};
  const base = m.path ? m.path.split(/[\\/]/).pop() : null;
  const sendReject = (): void => {
    onAction?.(REJECT_PREFIX + (note.trim() || "(구체적 피드백 없음 — 다른 구성으로 다시 제안)"));
    setNote("");
    setRejecting(false);
  };
  return (
    <div
      style={{
        alignSelf: "stretch",
        border: `1px solid ${m.ok ? c.accent : c.red}`,
        background: c.bgElevated,
        borderRadius: 10,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>📐 DesignSpec</span>
        {m.brand && (
          <span
            style={{
              fontSize: 10.5,
              color: c.textMuted,
              border: `1px solid ${c.border}`,
              borderRadius: 999,
              padding: "1px 7px",
            }}
          >
            {m.brand}
            {screen.surface ? ` · ${screen.surface}` : ""}
          </span>
        )}
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 700,
            color: m.ok ? c.green : c.red,
          }}
        >
          {m.ok ? "✓ 검증 통과" : `✕ error ${m.summary.error}`}
          {m.summary.warn > 0 ? ` · warn ${m.summary.warn}` : ""}
        </span>
      </div>

      {screen.intent && (
        <div style={{ fontSize: 12.5, color: c.text, lineHeight: 1.5 }}>{screen.intent}</div>
      )}

      {m.spec.tree && m.spec.tree.length > 0 && (
        <div
          style={{
            background: c.bg,
            border: `1px solid ${c.borderSubtle}`,
            borderRadius: 6,
            padding: "7px 9px",
            overflowX: "auto",
          }}
        >
          <SpecTree nodes={m.spec.tree} />
        </div>
      )}

      {m.spec.decisions && m.spec.decisions.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            fontSize: 11.5,
            color: c.textMuted,
            lineHeight: 1.6,
          }}
        >
          {m.spec.decisions.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}

      {(errors.length > 0 || warns.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {errors
            .concat(warns)
            .slice(0, 6)
            .map((v, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  fontFamily: mono,
                  color: v.severity === "error" ? c.red : c.yellow,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={`${v.path}: ${v.message}`}
              >
                {v.severity === "error" ? "✕" : "⚠"} {v.rule} · {v.message}
              </div>
            ))}
        </div>
      )}

      <div style={{ fontSize: 10.5, color: c.textFaint, fontFamily: mono }}>
        컴포넌트 {m.componentsUsed.length} · 토큰 {m.tokensUsed.length}
        {base ? ` · ${base}` : ""}
      </div>

      {isPending && onAction && (
        <div style={{ borderTop: `1px solid ${c.borderSubtle}`, paddingTop: 9 }}>
          {!rejecting ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => onAction(APPROVE_TURN)}
                disabled={!m.ok}
                style={!m.ok ? primaryBtnDisabled : primaryBtn}
                title={m.ok ? "이 스펙대로 빌드까지 진행" : "error 를 고친 새 스펙이 필요합니다"}
              >
                승인하고 빌드
              </button>
              <button
                onClick={() => setRejecting(true)}
                style={{
                  ...btnReset,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${c.border}`,
                  background: c.bg,
                  color: c.text,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                수정 요청
              </button>
              {!m.ok && (
                <span style={{ fontSize: 11, color: c.textFaint }}>
                  error 를 고친 새 스펙이 올 때까지 승인할 수 없어요.
                </span>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => {
                  // 한글(IME) 조합 중 Enter 는 글자 확정용 — isComposing 일 땐 전송하지 않는다(조각 전송 방지).
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    sendReject();
                  }
                }}
                placeholder="어떻게 바꿀지 알려주세요 (Enter 전송 · Shift+Enter 줄바꿈)"
                rows={2}
                autoFocus
                style={{
                  resize: "none",
                  boxSizing: "border-box",
                  padding: "7px 9px",
                  borderRadius: 6,
                  border: `1px solid ${c.border}`,
                  background: c.bg,
                  color: c.text,
                  fontSize: 12.5,
                  fontFamily: font,
                  lineHeight: 1.5,
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={sendReject} style={primaryBtn}>
                  다시 제안 요청
                </button>
                <button
                  onClick={() => {
                    setRejecting(false);
                    setNote("");
                  }}
                  style={{
                    ...btnReset,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${c.border}`,
                    background: c.bg,
                    color: c.textMuted,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** 점수 칩 한 줄(라벨 + 0~100, 색은 점수별). */
function ScoreChips({ entries }: { entries: [string, number][] }): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {entries.map(([label, n]) => (
        <span
          key={label}
          style={{
            fontSize: 10.5,
            fontFamily: mono,
            color: scoreColor(n),
            border: `1px solid ${c.border}`,
            borderRadius: 6,
            padding: "1px 6px",
            whiteSpace: "nowrap",
          }}
        >
          {label} {n}
        </span>
      ))}
    </div>
  );
}

/**
 * D3 품질 스코어 카드 — D1 코드 점수(결정적) + D2 LLM 점수(정성). clean 빌드 후 1회 자동 표시.
 * 점수 낮아도 자동 교정 안 함 — 라이브이고 LLM notes 가 있으면 '이 피드백으로 고치기' 버튼(수동 게이트).
 */
function DesignScoreCard({
  m,
  onAction,
}: {
  m: DesignScoreMsg;
  onAction?: (text: string) => void;
}): React.JSX.Element {
  const code = m.codeScores;
  const llm = m.llm;
  const llmEntries: [string, number][] = llm.scores
    ? (Object.entries(llm.scores) as [string, number][])
    : [];
  return (
    <div
      style={{
        alignSelf: "stretch",
        border: `1px solid ${c.border}`,
        background: c.bgElevated,
        borderRadius: 10,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 9,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>📊 품질 점수</span>
        {code && (
          <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(code.overall) }}>
            코드 {code.overall}
          </span>
        )}
        {llm.ok && llm.overall != null && (
          <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(llm.overall) }}>
            · LLM {llm.overall}
          </span>
        )}
      </div>

      {code && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 10.5, color: c.textFaint, fontFamily: mono }}>
            코드 (D1 · 결정적)
          </span>
          <ScoreChips entries={Object.entries(code.dimensions) as [string, number][]} />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 10.5, color: c.textFaint, fontFamily: mono }}>LLM 정성 (D2)</span>
        {llm.ok ? (
          <>
            <ScoreChips entries={llmEntries} />
            {llm.notes && (
              <div style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.5 }}>{llm.notes}</div>
            )}
          </>
        ) : (
          <div style={{ fontSize: 11.5, color: c.textFaint, fontFamily: mono }}>
            {llm.error ?? "LLM 채점 실패"}
          </div>
        )}
      </div>

      {onAction && llm.ok && llm.notes && (
        <div style={{ borderTop: `1px solid ${c.borderSubtle}`, paddingTop: 9 }}>
          <button
            onClick={() => onAction(SCORE_FIX_PREFIX + llm.notes)}
            style={{
              ...btnReset,
              padding: "6px 12px",
              borderRadius: 6,
              border: `1px solid ${c.border}`,
              background: c.bg,
              color: c.text,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            이 피드백으로 고치기
          </button>
        </div>
      )}
    </div>
  );
}

function MessageRow({
  m,
  isPending,
  onAction,
}: {
  m: ChatMessage;
  isPending?: boolean;
  onAction?: (text: string) => void;
}): React.JSX.Element | null {
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
    case "notice":
      return (
        <div
          style={{
            alignSelf: "center",
            maxWidth: "92%",
            textAlign: "center",
            fontSize: 11.5,
            fontFamily: mono,
            lineHeight: 1.5,
            color: m.tone === "warn" ? c.yellow : c.textMuted,
            background: c.bgElevated,
            border: `1px solid ${m.tone === "warn" ? c.yellow : c.borderSubtle}`,
            borderRadius: 8,
            padding: "5px 11px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {m.text}
        </div>
      );
    case "design-spec":
      return <DesignSpecCard m={m} isPending={isPending} onAction={onAction} />;
    case "design-score":
      return <DesignScoreCard m={m} onAction={onAction} />;
    default:
      return null;
  }
}

/** 메시지 리스트(자동 스크롤). 라이브·재생 공통. */
function MessageList({
  messages,
  onAction,
  live,
}: {
  messages: ChatMessage[];
  /** 라이브일 때 design-spec 카드의 승인/수정 버튼이 보내는 다음 유저 턴. */
  onAction?: (text: string) => void;
  /** 라이브 세션(입력 가능)이면 마지막 미승인 design-spec 에 게이트 버튼을 띄운다. */
  live?: boolean;
}): React.JSX.Element {
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);
  // 게이트 버튼은 "마지막 design-spec 이고 그 뒤 유저 턴이 아직 없을 때"만(= 미승인).
  let lastSpecIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].kind === "design-spec") {
      lastSpecIdx = i;
      break;
    }
  }
  const userAfter =
    lastSpecIdx >= 0 && messages.slice(lastSpecIdx + 1).some((m) => m.kind === "user");
  const pendingIdx = live && lastSpecIdx >= 0 && !userAfter ? lastSpecIdx : -1;
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
        <MessageRow key={i} m={m} onAction={onAction} isPending={i === pendingIdx} />
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
      <MessageList messages={messages} onAction={onSend} live={!disabled} />
      <div style={{ borderTop: `1px solid ${c.border}`, padding: 10, display: "flex", gap: 8 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter 전송 / Shift+Enter 줄바꿈. 단 한글(IME) 조합 중 Enter 는 글자 확정용이므로
            // isComposing 일 땐 전송하지 않는다 — 안 막으면 조합 중 Enter 가 "하이" 같은 첫 조각만
            // 보내고 나머지가 잘린다(조합 확정 Enter 와 전송 Enter 가 분리되도록).
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
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
