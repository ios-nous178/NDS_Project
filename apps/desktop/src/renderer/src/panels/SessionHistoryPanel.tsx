import { useEffect, useState } from "react";
import type { ChatSession } from "../../../preload/index.js";
import { c, mono } from "../ui/theme.js";

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
}): React.JSX.Element {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  // 인라인 제목 편집 — 더블클릭으로 진입. 편집 중인 세션 id + 드래프트 텍스트.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const handleDelete = async (s: ChatSession): Promise<void> => {
    if (!projectPath) return;
    if (
      !window.confirm(
        `이 채팅 세션을 삭제할까요?\n${sessionTitle(s)}\n\n트랜스크립트도 함께 삭제됩니다.`,
      )
    ) {
      return;
    }
    const res = await window.harness.deleteSession(projectPath, s.sessionId);
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
    if (!projectPath) return;
    const next = draft.trim();
    // 빈 값 → 기본 제목(screenName/파일명)으로 복귀. 변화 없으면 IPC 생략.
    if (next === sessionTitle(s)) return;
    const res = await window.harness.renameSession(projectPath, s.sessionId, next);
    if (res.ok) {
      setSessions((prev) =>
        prev.map((x) =>
          x.sessionId === s.sessionId ? { ...x, customTitle: next || undefined } : x,
        ),
      );
    }
  };

  useEffect(() => {
    if (!projectPath) {
      setSessions([]);
      return;
    }
    let alive = true;
    void window.harness.listSessions(projectPath).then((list) => {
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
          padding: "11px 14px",
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
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {!projectPath && (
          <div style={{ color: c.textFaint, fontSize: 12, padding: 10 }}>프로젝트를 여세요.</div>
        )}
        {projectPath && sessions.length === 0 && (
          <div style={{ color: c.textFaint, fontSize: 12, padding: 10 }}>아직 세션이 없습니다.</div>
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
                  padding: "8px 28px 8px 10px",
                  borderLeft: `2px solid ${isSelected ? c.accent : "transparent"}`,
                  borderRadius: 8,
                  background: isSelected ? c.accentBg : c.bgElevated,
                  color: c.text,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
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
                        if (e.key === "Enter") void commitEdit(s);
                        else if (e.key === "Escape") setEditingId(null);
                      }}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        boxSizing: "border-box",
                        padding: "1px 5px",
                        border: `1px solid ${c.accent}`,
                        borderRadius: 4,
                        background: c.bg,
                        color: c.text,
                        fontSize: 12.5,
                        fontWeight: 600,
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
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sessionTitle(s)}
                    </span>
                  )}
                  {isLive && (
                    <span style={{ color: c.green, fontSize: 10, flexShrink: 0 }}>LIVE</span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: c.textMuted,
                    fontFamily: mono,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: 3,
                  }}
                >
                  {s.mockupFile ?? "project"}
                </div>
                <div style={{ fontSize: 10.5, color: c.textFaint, marginTop: 2 }}>
                  {fmtTime(s.createdAt)} · {statusKo(s.status)}
                </div>
              </div>
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
                    e.currentTarget.style.background = c.red;
                    e.currentTarget.style.color = "#fff";
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

/** 에이전트 종류 표시 — 텍스트 대신 색 배지(Claude=클레이 / Codex=그린). */
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
        fontSize: isClaude ? 13 : 8.5,
        fontWeight: 700,
        lineHeight: 1,
        fontFamily: mono,
        background: isClaude ? "#d97757" : "#10a37f",
        color: "#fff",
      }}
    >
      {isClaude ? "✳" : ">_"}
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
