import { useEffect, useState } from "react";
import type { ChatSession } from "../../../preload/index.js";
import { c, mono } from "../ui/theme.js";

/**
 * 채팅기록 — 과거 에이전트 세션 리스트(.ds-chat-sessions.jsonl). 클릭하면 부모가
 * 그 세션의 raw 트랜스크립트를 read-only 로 보여준다(라이브 아님).
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

  const handleDelete = async (s: ChatSession): Promise<void> => {
    if (!projectPath) return;
    if (
      !window.confirm(`이 채팅 세션을 삭제할까요?\n${s.title}\n\n트랜스크립트도 함께 삭제됩니다.`)
    ) {
      return;
    }
    const res = await window.harness.deleteSession(projectPath, s.sessionId);
    if (res.ok) {
      setSessions((prev) => prev.filter((x) => x.sessionId !== s.sessionId));
      onDeleted(s.sessionId);
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
          return (
            <div
              key={s.sessionId}
              onMouseEnter={() => setHovered(s.sessionId)}
              onMouseLeave={() => setHovered((h) => (h === s.sessionId ? null : h))}
              style={{ position: "relative", marginBottom: 3 }}
            >
              <button
                onClick={() => onSelect(s)}
                title={s.title}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 28px 8px 10px",
                  border: "none",
                  borderLeft: `2px solid ${isSelected ? c.accent : "transparent"}`,
                  borderRadius: 8,
                  background: isSelected ? c.accentBg : c.bgElevated,
                  color: c.text,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
                  <span style={{ color: dotColor(isLive, s.status) }}>●</span>
                  <span style={{ fontWeight: 600 }}>{agentLabel(s.agentType)}</span>
                  {isLive && <span style={{ color: c.green, fontSize: 10 }}>LIVE</span>}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: c.textMuted,
                    fontFamily: mono,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: 2,
                  }}
                >
                  {s.mockupFile ?? "project"}
                </div>
                <div style={{ fontSize: 10.5, color: c.textFaint, marginTop: 2 }}>
                  {fmtTime(s.createdAt)} · {statusKo(s.status)}
                </div>
              </button>
              {/* 라이브 세션은 삭제 불가(먼저 중지) — hover 시에만 노출. */}
              {!isLive && hovered === s.sessionId && (
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

function agentLabel(t: ChatSession["agentType"]): string {
  return t === "claude" ? "Claude" : "Codex";
}
function statusKo(s: ChatSession["status"]): string {
  return s === "active" ? "진행중" : s === "completed" ? "완료" : "실패";
}
function dotColor(isLive: boolean, status: ChatSession["status"]): string {
  if (isLive) return c.green;
  if (status === "failed") return c.red;
  return c.textFaint;
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
