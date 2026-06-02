import { useEffect, useRef, useState } from "react";
import type { AgentType, ChatSession, Transport } from "../../../preload/index.js";
import { btnReset, c, mono, SECTION_HEADER_H } from "../ui/theme.js";

/** 헤더 우측 "+ 새 채팅 ▾" — 은은한 보더 칩(다른 pill 톤과 통일). */
const newChatBtn: React.CSSProperties = {
  ...btnReset,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 9px",
  borderRadius: 999,
  border: `1px solid ${c.border}`,
  background: "transparent",
  color: c.text,
  cursor: "pointer",
  fontSize: 11.5,
  fontWeight: 600,
  whiteSpace: "nowrap",
};

/** 드롭다운 패널 — 버튼 우측 아래로 펼쳐지는 다크 메뉴. */
const menuStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  zIndex: 30,
  minWidth: 184,
  padding: 4,
  borderRadius: 8,
  border: `1px solid ${c.border}`,
  background: c.bgElevated,
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
};

const menuLabel: React.CSSProperties = {
  padding: "5px 8px 3px",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 0.3,
  color: c.textFaint,
  textTransform: "uppercase",
};

const menuItem: React.CSSProperties = {
  ...btnReset,
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  boxSizing: "border-box",
  padding: "7px 8px",
  borderRadius: 6,
  border: "none",
  background: "transparent",
  color: c.text,
  cursor: "pointer",
  fontSize: 12.5,
  fontWeight: 500,
  textAlign: "left",
};

const menuDivider: React.CSSProperties = {
  height: 1,
  margin: "4px 6px",
  background: c.border,
};

/**
 * 카나리아 아이콘 — 레퍼런스 이미지를 potrace 로 벡터 트레이싱. 눈은 path hole, currentColor.
 * A/B 테스트용: CANARY_VARIANT 한 줄만 'A'(통통 병아리) / 'B'(든 날개 비둘기) 로 바꾸면 앱 전체 전환.
 */
function CanaryBirdA({ size = 11 }: { size?: number }): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 73.078415 68.724102"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g
        transform="translate(-13.921585,83.084572) scale(0.100000,-0.100000)"
        fill="currentColor"
        stroke="none"
      >
        {" "}
        <path d="M530 819 c-37 -15 -88 -68 -99 -103 -5 -17 -12 -64 -16 -104 -15 -174 -77 -241 -222 -242 -68 -1 -68 -1 -20 -44 57 -51 135 -92 207 -107 36 -8 50 -15 46 -24 -7 -20 62 -45 91 -32 16 7 36 5 75 -8 52 -17 52 -17 75 12 23 28 23 28 2 46 -12 9 -27 17 -35 17 -21 0 -18 6 32 55 58 59 100 149 116 249 11 74 14 80 50 103 21 14 38 28 38 30 0 2 -19 12 -42 23 -25 11 -53 34 -68 57 -48 71 -151 103 -230 72z m164 -125 c20 -19 20 -38 2 -54 -23 -19 -61 -8 -64 18 -7 44 32 67 62 36z" />{" "}
      </g>
    </svg>
  );
}

function CanaryBirdB({ size = 11 }: { size?: number }): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 82.682476 83.485674"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g
        transform="translate(-12.950433,92.000000) scale(0.100000,-0.100000)"
        fill="currentColor"
        stroke="none"
      >
        {" "}
        <path d="M182 907 c-71 -85 -70 -307 2 -366 9 -8 26 -36 38 -64 14 -31 35 -60 60 -77 38 -28 38 -28 -13 -60 -105 -68 -129 -144 -64 -205 80 -76 242 -63 304 24 12 16 21 33 21 39 0 5 21 15 46 21 117 30 191 126 209 275 4 31 11 56 15 56 4 0 23 11 43 24 20 14 52 28 72 32 45 8 52 20 27 47 -11 12 -26 43 -32 69 -18 69 -56 101 -127 106 -74 5 -113 -20 -160 -100 -32 -54 -36 -58 -71 -58 -67 0 -139 45 -244 151 -53 55 -101 99 -106 99 -5 0 -14 -6 -20 -13z" />{" "}
        <path d="M433 898 c-11 -13 -26 -34 -33 -46 -10 -21 -9 -27 11 -48 13 -14 47 -36 77 -51 55 -27 55 -27 73 -4 26 32 24 42 -12 77 -17 16 -39 44 -51 62 -23 38 -37 40 -65 10z" />{" "}
      </g>
    </svg>
  );
}

const CANARY_VARIANT: "A" | "B" = "B";

function CanaryBird(props: { size?: number }): React.JSX.Element {
  return CANARY_VARIANT === "A" ? <CanaryBirdA {...props} /> : <CanaryBirdB {...props} />;
}

/**
 * 채팅기록 — 과거 에이전트 세션 리스트(.ds-chat-sessions.jsonl). 클릭하면 부모가
 * 그 세션의 raw 트랜스크립트를 read-only 로 보여주고(라이브 아님), 연관 목업이 있으면
 * 우측 미리보기로 띄운다. 제목은 더블클릭으로 인라인 편집(customTitle).
 */
export function SessionHistoryPanel({
  projectPath,
  refreshKey,
  liveSessionId,
  selectedSessionId,
  onSelect,
  onDeleted,
  onResume,
  onNewChat,
  onNewMockup,
}: {
  projectPath: string | null;
  /** 값이 바뀌면 리스트 재조회(세션 시작/종료 시). */
  refreshKey: number;
  /** 현재 실행 중 세션(강조용). */
  liveSessionId: string | null;
  /** 현재 트랜스크립트를 보고 있는 세션. */
  selectedSessionId: string | null;
  onSelect: (session: ChatSession) => void;
  /** 세션 삭제 완료 — 부모가 보기 상태 정리/리스트 갱신. */
  onDeleted: (sessionId: string) => void;
  /** "이어가기" — CLI 네이티브 resume 으로 끝난 세션을 다시 라이브로(부모가 spawn+attach). */
  onResume: (session: ChatSession) => void;
  /** "빠른 채팅" — 고른 에이전트·전송방식으로 빈 세션을 바로 시작(인테이크 없이). */
  onNewChat: (req: { agentType: AgentType; transport: Transport }) => void;
  /** "목업 제작…" — 기획서/레퍼런스 인테이크 모달을 연다. */
  onNewMockup: () => void;
}): React.JSX.Element {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  // 인라인 제목 편집 — 더블클릭으로 진입. 편집 중인 세션 id + 드래프트 텍스트.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  // "+ 새 채팅 ▾" 드롭다운 열림 상태 + 바깥 클릭 닫기용 ref.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleDelete = async (s: ChatSession): Promise<void> => {
    if (
      !window.confirm(
        `이 채팅 세션을 삭제할까요?\n${sessionTitle(s)}\n\n트랜스크립트도 함께 삭제됩니다.`,
      )
    ) {
      return;
    }
    // 채팅기록은 전역 저장 — projectPath 는 무시되지만 IPC 시그니처 호환 위해 넘긴다.
    const res = await window.harness.deleteSession(projectPath ?? "", s.sessionId);
    if (res.ok) {
      setSessions((prev) => prev.filter((x) => x.sessionId !== s.sessionId));
      onDeleted(s.sessionId);
    }
  };

  const startEdit = (s: ChatSession): void => {
    setEditingId(s.sessionId);
    setDraft(sessionTitle(s));
  };

  const commitEdit = async (s: ChatSession): Promise<void> => {
    setEditingId(null);
    const next = draft.trim();
    // 빈 값 → 기본 제목(screenName/파일명)으로 복귀. 변화 없으면 IPC 생략.
    if (next === sessionTitle(s)) return;
    const res = await window.harness.renameSession(projectPath ?? "", s.sessionId, next);
    if (res.ok) {
      setSessions((prev) =>
        prev.map((x) =>
          x.sessionId === s.sessionId ? { ...x, customTitle: next || undefined } : x,
        ),
      );
    }
  };

  useEffect(() => {
    // 채팅기록은 전역 저장 — 프로젝트를 안 열어도 항상 로드한다(projectPath 무관).
    let alive = true;
    void window.harness.listSessions(projectPath ?? "").then((list) => {
      if (alive) setSessions(list);
    });
    return () => {
      alive = false;
    };
  }, [projectPath, refreshKey]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: SECTION_HEADER_H,
          boxSizing: "border-box",
          flexShrink: 0,
          padding: "0 14px",
          color: c.text,
          borderBottom: `1px solid ${c.borderSubtle}`,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600 }}>채팅기록</span>
        {sessions.length > 0 && (
          <span
            style={{
              fontSize: 11,
              color: c.textMuted,
              background: c.bgElevated,
              borderRadius: 999,
              padding: "1px 7px",
            }}
          >
            {sessions.length}
          </span>
        )}
        <div style={{ position: "relative", marginLeft: "auto" }} ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            title={
              liveSessionId
                ? "새 대화를 시작하면 실행 중인 세션은 중지됩니다 (기록은 보존)"
                : "새 대화 시작 (폴더를 골라 시작)"
            }
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            style={{
              ...newChatBtn,
              marginLeft: 0,
              // ⚠️ border 는 shorthand 전체로 지정. borderColor longhand 로 덮으면 메뉴를
              //    닫을 때(active→inactive) React 가 longhand 만 제거해 border-color 가
              //    검정으로 깨진다(theme.ts pillBtnActive 주석의 그 함정).
              ...(menuOpen ? { border: `1px solid ${c.accent}`, color: c.accent } : null),
            }}
          >
            <span style={{ fontSize: 13, lineHeight: 1 }}>+</span> 새 채팅
            <span style={{ fontSize: 9, opacity: 0.8 }}>▾</span>
          </button>
          {menuOpen && (
            <div role="menu" style={menuStyle}>
              <div style={menuLabel}>빠른 채팅</div>
              {/* 클릭 한 번에 바로 시작. claude 는 구조화(stream-json) 기본 — 카드형 + DB 기록.
                  codex 는 stream-json 미지원이라 pty. (raw 터미널 claude 는 아래 별도 버튼) */}
              {(["claude", "codex"] as AgentType[]).map((t) => (
                <button
                  key={t}
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onNewChat({ agentType: t, transport: t === "claude" ? "stream-json" : "pty" });
                  }}
                  style={menuItem}
                  onMouseEnter={(e) => (e.currentTarget.style.background = c.bgHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <AgentIcon type={t} />
                  {t === "claude" ? "Claude 로 시작" : "Codex 로 시작"}
                </button>
              ))}
              {/* raw 터미널 탈출구 — claude 를 옛 방식(pty TUI)으로. 구조화가 기본이 됐으므로
                  raw 화면이 필요할 때만 사용. (구조화 메시지가 없어 DB 에는 메타데이터만 기록) */}
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onNewChat({ agentType: "claude", transport: "pty" });
                }}
                title="Claude 를 raw 터미널(pty TUI)로 시작 — 구조화 카드 대신 옛 터미널 화면"
                style={{ ...menuItem, fontSize: 11.5, color: c.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.bgHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span
                  style={{
                    width: 13,
                    display: "inline-flex",
                    justifyContent: "center",
                    color: c.text,
                  }}
                >
                  <AgentIcon type="claude" />
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  Claude · 터미널
                  <span style={{ fontSize: 10, color: c.textMuted }}>(raw)</span>
                </span>
              </button>
              <div style={menuDivider} />
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onNewMockup();
                }}
                style={menuItem}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.bgHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 12, width: 13, textAlign: "center" }}>＋</span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                  목업 제작…
                  <span style={{ fontSize: 10, color: c.textFaint }}>기획서·레퍼런스 기반</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {sessions.length === 0 && (
          <div style={{ color: c.textFaint, fontSize: 12, padding: 10, lineHeight: 1.6 }}>
            아직 세션이 없습니다.
            <br />
            <span style={{ color: c.textMuted }}>+ 새 채팅</span> 으로 폴더를 골라 시작하세요.
          </div>
        )}
        {sessions.map((s) => {
          const isSelected = s.sessionId === selectedSessionId;
          const isLive = s.sessionId === liveSessionId;
          const isEditing = s.sessionId === editingId;
          return (
            <div
              key={s.sessionId}
              onMouseEnter={() => setHovered(s.sessionId)}
              onMouseLeave={() => setHovered((h) => (h === s.sessionId ? null : h))}
              style={{ position: "relative", marginBottom: 3 }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!isEditing) onSelect(s);
                }}
                onKeyDown={(e) => {
                  if (!isEditing && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelect(s);
                  }
                }}
                title={sessionTitle(s)}
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  textAlign: "left",
                  padding: "8px 28px 8px 12px",
                  // 선택 강조는 배경(accentBg)만으로 — 왼쪽 노란 라인 제거.
                  borderRadius: 8,
                  background: isSelected ? c.accentBg : c.bgElevated,
                  color: c.text,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {/* 타이틀 행 — 보기/편집 전환 시 높이가 안 바뀌도록 minHeight 고정 + 수직중앙. */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 0,
                    minHeight: 18,
                  }}
                >
                  <AgentIcon type={s.agentType} />
                  {isEditing ? (
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.currentTarget.select()}
                      onBlur={() => void commitEdit(s)}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        // 한글(IME) 조합 중 Enter 는 글자 확정 — isComposing 일 땐 커밋하지 않는다(이름 잘림 방지).
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) void commitEdit(s);
                        else if (e.key === "Escape") setEditingId(null);
                      }}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        boxSizing: "border-box",
                        // 높이 18 = lineHeight 16 + 상하패딩 1px*2.
                        // 보더를 아예 제거해 배경에 녹아들게 한다.
                        height: 18,
                        padding: "1px 5px",
                        border: "none",
                        borderRadius: 4,
                        background: c.bg,
                        color: c.text,
                        fontSize: 12.5,
                        fontWeight: 600,
                        lineHeight: "16px",
                        fontFamily: "inherit",
                        outline: "none",
                      }}
                    />
                  ) : (
                    <span
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        startEdit(s);
                      }}
                      title="더블클릭하여 제목 수정"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 12.5,
                        fontWeight: 600,
                        lineHeight: "16px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sessionTitle(s)}
                    </span>
                  )}
                  {/* canary 는 카드 우측 하단 absolute 로만 노출(아래). LIVE 는 편집 중엔 숨겨
                      입력창과 겹치지 않게 한다. 배지 톤(보더+패딩)으로 다른 표식과 통일. */}
                  {isLive && !isEditing && (
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: 0.3,
                        color: c.green,
                        border: `1px solid ${c.green}`,
                        borderRadius: 4,
                        padding: "0 4px",
                        lineHeight: "14px",
                        // 라이브 카드엔 삭제 버튼이 안 뜨므로(중지 먼저), 우측 예약폭(28px)으로
                        // 배지를 더 밀어 카드 오른쪽 끝에 가깝게 정렬한다.
                        marginRight: -18,
                      }}
                    >
                      LIVE
                    </span>
                  )}
                </div>
                <div
                  title={s.cwd ?? s.mockupFile ?? "project"}
                  style={{
                    fontSize: 11,
                    color: c.textMuted,
                    fontFamily: mono,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: 3,
                    direction: "rtl",
                    textAlign: "left",
                  }}
                >
                  {/* 작업 폴더/목업 경로 — 길면 앞부분을 …로 잘라 끝(폴더명)이 보이게(rtl). */}
                  {s.mockupFile ?? s.cwd ?? "project"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 10.5,
                    color: c.textFaint,
                    marginTop: 2,
                  }}
                >
                  <span>
                    {fmtTime(s.createdAt)} · {statusKo(s.status)}
                  </span>
                  {/* 이어가기 — CLI 네이티브 대화가 남아있는(resumable) 끝난 세션만. 라이브/편집 중엔 숨김. */}
                  {s.resumable && !isLive && !isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResume(s);
                      }}
                      title="이 세션을 이어서 진행합니다 (대화 컨텍스트 복원)"
                      style={{
                        ...btnReset,
                        padding: "1px 7px",
                        borderRadius: 999,
                        border: `1px solid ${c.border}`,
                        background: "transparent",
                        color: c.textMuted,
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 600,
                        lineHeight: "15px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = c.accent;
                        e.currentTarget.style.color = c.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = c.border;
                        e.currentTarget.style.color = c.textMuted;
                      }}
                    >
                      ↩ 이어가기
                    </button>
                  )}
                </div>
              </div>
              {/* 구조화(canary) 표식 — 카드 우측 하단에 아이콘만 고정. LIVE(타이틀 행)·삭제
                  버튼(우측 상단)과 자리가 겹치지 않는다. 편집 중엔 숨긴다. */}
              {s.transport === "stream-json" && !isEditing && (
                <span
                  title="구조화(canary) 세션 — claude stream-json"
                  style={{
                    position: "absolute",
                    bottom: 7,
                    right: 9,
                    display: "inline-flex",
                    color: c.textMuted,
                    pointerEvents: "none",
                  }}
                >
                  <CanaryBird size={11} />
                </span>
              )}
              {/* 라이브 세션은 삭제 불가(먼저 중지) — hover 시에만 노출. 편집 중엔 숨김. */}
              {!isLive && !isEditing && hovered === s.sessionId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDelete(s);
                  }}
                  title="세션 삭제"
                  aria-label="세션 삭제"
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 18,
                    height: 18,
                    lineHeight: "16px",
                    textAlign: "center",
                    padding: 0,
                    border: "none",
                    borderRadius: 5,
                    background: "transparent",
                    color: c.textFaint,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.bgHover;
                    e.currentTarget.style.color = c.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = c.textFaint;
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** OpenAI 로고마크(Codex 배지용). currentColor 라 배지 글자색(흰색)을 따라간다. */
function OpenAiMark(): React.JSX.Element {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.309 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

/** Claude 선버스트 마크 — 방사형 레이로 그린다. currentColor 라 배지 글자색(흰색)을 따라간다. */
function ClaudeMark(): React.JSX.Element {
  const cx = 12;
  const cy = 12;
  const r0 = 2.6;
  const r1 = 9.8;
  const rays = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
      {rays.map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={cx + r0 * Math.cos(a)}
            y1={cy + r0 * Math.sin(a)}
            x2={cx + r1 * Math.cos(a)}
            y2={cy + r1 * Math.sin(a)}
            stroke="currentColor"
            strokeWidth={2.3}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/** 에이전트 종류 표시 — 색 배지(Claude=클레이 버스트 / Codex=그린 OpenAI 마크). */
function AgentIcon({ type }: { type: ChatSession["agentType"] }): React.JSX.Element {
  const isClaude = type === "claude";
  return (
    <span
      title={isClaude ? "Claude Code" : "Codex"}
      style={{
        flexShrink: 0,
        width: 13,
        height: 13,
        borderRadius: 3,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        fontFamily: mono,
        background: isClaude ? "#d97757" : "#10a37f",
        color: "#fff",
      }}
    >
      {isClaude ? <ClaudeMark /> : <OpenAiMark />}
    </span>
  );
}

/**
 * 채팅기록 리스트에 보일 제목.
 * customTitle(사용자 편집) → screenName(인테이크) → 목업 파일명 순으로 폴백.
 */
export function sessionTitle(s: ChatSession): string {
  const custom = s.customTitle?.trim();
  if (custom) return custom;
  const screen = s.screenName?.trim();
  if (screen) return screen;
  return deriveMockupName(s.mockupFile);
}

/** "brand-foo/index.html" → "brand-foo", "a/b/page.html" → "page". index 류는 부모 폴더가 의미. */
function deriveMockupName(mockupFile?: string): string {
  if (!mockupFile) return "새 세션";
  const parts = mockupFile.split("/").filter(Boolean);
  const file = parts[parts.length - 1] ?? mockupFile;
  if (/^index\.html?$/i.test(file) && parts.length >= 2) return parts[parts.length - 2];
  return file.replace(/\.html?$/i, "");
}

function statusKo(s: ChatSession["status"]): string {
  switch (s) {
    case "active":
      return "진행중";
    case "completed":
      return "완료";
    case "interrupted":
      return "중단됨";
    default:
      return "실패";
  }
}
function fmtTime(iso: string): string {
  try {
    const d = new Date(iso);
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(
      d.getHours(),
    ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}
