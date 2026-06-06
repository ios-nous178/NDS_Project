import { useEffect, useMemo, useState } from "react";
import type { SessionDashboardResult } from "../../../preload/index.js";
import { btnReset, c, mono, ghostBtn, SECTION_HEADER_H } from "../ui/theme.js";

function fmtBytes(bytes?: number): string {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function scoreColor(n: number): string {
  return n >= 80 ? c.green : n >= 60 ? c.yellow : c.red;
}

function verdictColor(v?: "pass" | "warn" | "fail"): string {
  if (v === "pass") return c.green;
  if (v === "warn") return c.yellow;
  if (v === "fail") return c.red;
  return c.textMuted;
}

function Chip({
  label,
  color = c.textMuted,
}: {
  label: string;
  color?: string;
}): React.JSX.Element {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        borderRadius: 999,
        border: `1px solid ${color}`,
        color,
        fontSize: 10.5,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SessionScoreCard({
  score,
}: {
  score: NonNullable<SessionDashboardResult["sessions"][number]["scores"]>[number];
}): React.JSX.Element {
  const llmText = score.llmOverall != null ? `LLM ${score.llmOverall}` : "LLM -";
  const codeText = score.codeOverall != null ? `코드 ${score.codeOverall}` : "코드 -";
  return (
    <div
      style={{
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: 10,
        background: c.bgElevated,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: c.text }}>📊 품질 점수</span>
        <Chip
          label={`${score.verdictLabel ?? score.verdict ?? "n/a"}${score.overall != null ? ` ${score.overall}` : ""}`}
          color={verdictColor(score.verdict)}
        />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: scoreColor(score.codeOverall ?? 0) }}>
          {codeText}
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: scoreColor(score.llmOverall ?? 0) }}>
          {llmText}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {score.codeDimensions &&
          Object.entries(score.codeDimensions).map(([name, value]) => (
            <Chip key={name} label={`${name} ${value}`} color={scoreColor(value)} />
          ))}
        {score.llmScores &&
          Object.entries(score.llmScores).map(([name, value]) => (
            <Chip key={name} label={`${name} ${value}`} color={scoreColor(value)} />
          ))}
      </div>
      {score.notes && (
        <div style={{ color: c.textMuted, fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
          {score.notes}
        </div>
      )}
    </div>
  );
}

export function SessionDashboardPanel({
  projectPath,
  refreshKey,
  focusSessionId,
}: {
  projectPath: string | null;
  refreshKey: number;
  focusSessionId?: string | null;
}): React.JSX.Element {
  const [dashboard, setDashboard] = useState<SessionDashboardResult | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileText, setFileText] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);

  useEffect(() => {
    if (!projectPath) {
      setDashboard(null);
      return;
    }
    let alive = true;
    void window.harness.getSessionDashboard(projectPath).then((res) => {
      if (!alive) return;
      setDashboard(res);
      const fallback = focusSessionId ?? res.sessions[0]?.session.sessionId ?? null;
      setSelectedSessionId((current) => current ?? fallback);
    });
    return () => {
      alive = false;
    };
  }, [projectPath, refreshKey]);

  useEffect(() => {
    if (!focusSessionId) return;
    setSelectedSessionId(focusSessionId);
  }, [focusSessionId]);

  const selected = useMemo(
    () => dashboard?.sessions.find((item) => item.session.sessionId === selectedSessionId) ?? null,
    [dashboard, selectedSessionId],
  );

  useEffect(() => {
    if (!dashboard) return;
    if (selectedSessionId && dashboard.sessions.some((item) => item.session.sessionId === selectedSessionId)) {
      return;
    }
    const fallback = focusSessionId ?? dashboard.sessions[0]?.session.sessionId ?? null;
    setSelectedSessionId(fallback);
  }, [dashboard, focusSessionId, selectedSessionId]);

  useEffect(() => {
    if (!selected) {
      setFilePath(null);
      setFileText("");
      return;
    }
    const preferred = selected.files.find((f) => f.exists && f.path)?.path ?? null;
    setFilePath(preferred);
  }, [selected]);

  useEffect(() => {
    if (!filePath) {
      setFileText("");
      return;
    }
    let alive = true;
    setLoadingFile(true);
    void window.harness.readMockup(filePath).then((res) => {
      if (!alive) return;
      setFileText(res.source);
      setLoadingFile(false);
    });
    return () => {
      alive = false;
    };
  }, [filePath]);

  if (!projectPath)
    return (
      <div style={{ padding: 16, color: c.textFaint, fontSize: 13 }}>
        프로젝트를 열면 세션 대시보드가 표시됩니다.
      </div>
    );

  if (!dashboard)
    return (
      <div style={{ padding: 16, color: c.textFaint, fontSize: 13 }}>
        세션 대시보드 로딩 중…
      </div>
    );

  return (
    <div style={{ height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: SECTION_HEADER_H,
          boxSizing: "border-box",
          padding: "0 14px",
          borderBottom: `1px solid ${c.borderSubtle}`,
          background: c.bgPanel,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: c.text, fontSize: 13, fontWeight: 700 }}>세션 대시보드</span>
          <Chip label={`세션 ${dashboard.summary.sessionCount}`} />
          <Chip label={`파일 ${dashboard.summary.fileCount}`} />
          <Chip label={`피드백 ${dashboard.summary.feedbackCount}`} />
          <Chip label={`점수 ${dashboard.summary.scoreCount}`} />
        </div>
        <div style={{ color: c.textFaint, fontSize: 11.5, fontFamily: mono }}>
          {dashboard.projectPath}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "300px 1fr" }}>
        <div
          style={{
            minHeight: 0,
            overflow: "auto",
            borderRight: `1px solid ${c.border}`,
            background: c.bgPanel,
          }}
        >
          {dashboard.sessions.map((item) => {
            const s = item.session;
            const active = s.sessionId === selectedSessionId;
            const title = s.customTitle ?? s.screenName ?? s.title;
            return (
              <button
                key={s.sessionId}
                onClick={() => setSelectedSessionId(s.sessionId)}
                style={{
                  ...btnReset,
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  borderBottom: `1px solid ${c.borderSubtle}`,
                  background: active ? c.bg : "transparent",
                  color: c.text,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, flex: 1, minWidth: 0 }}>
                    {title}
                  </span>
                  <Chip label={s.agentType} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <Chip label={s.status} color={s.status === "failed" ? c.red : s.status === "interrupted" ? c.yellow : c.green} />
                  {s.brand && <Chip label={s.brand} />}
                  {s.surface && <Chip label={s.surface} />}
                  {s.intent && <Chip label={s.intent} />}
                  <Chip label={`파일 ${item.files.filter((f) => f.exists).length}`} />
                  <Chip label={`피드백 ${item.feedback.length}`} />
                  <Chip label={`점수 ${item.scores.length}`} />
                </div>
                <div style={{ color: c.textFaint, fontSize: 11.5, lineHeight: 1.45 }}>
                  {s.mockupFile ?? "mockup 없음"}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ minHeight: 0, overflow: "auto", padding: 16, background: c.bg }}>
          {!selected ? (
            <div style={{ color: c.textFaint, fontSize: 13 }}>세션을 선택하세요.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <section
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: 10,
                  padding: 14,
                  background: c.bgElevated,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: c.text }}>
                    {selected.session.customTitle ?? selected.session.screenName ?? selected.session.title}
                  </div>
                  <Chip label={selected.session.sessionId} />
                  <Chip label={selected.session.agentType} />
                  <Chip label={selected.session.transport ?? "pty"} />
                  <Chip label={selected.session.status} color={selected.session.status === "failed" ? c.red : selected.session.status === "interrupted" ? c.yellow : c.green} />
                  {selected.session.brand && <Chip label={`brand ${selected.session.brand}`} />}
                  {selected.session.surface && <Chip label={`surface ${selected.session.surface}`} />}
                  {selected.session.intent && <Chip label={`intent ${selected.session.intent}`} />}
                </div>
                <div style={{ marginTop: 10, display: "grid", gap: 8, color: c.textMuted, fontSize: 12.5 }}>
                  <div>brand: <span style={{ fontFamily: mono, color: c.text }}>{selected.session.brand ?? "-"}</span></div>
                  <div>surface: <span style={{ fontFamily: mono, color: c.text }}>{selected.session.surface ?? "-"}</span></div>
                  <div>intent: <span style={{ fontFamily: mono, color: c.text }}>{selected.session.intent ?? "-"}</span></div>
                  <div>cwd: <span style={{ fontFamily: mono, color: c.text }}>{selected.session.cwd ?? "-"}</span></div>
                  <div>mockup: <span style={{ fontFamily: mono, color: c.text }}>{selected.session.mockupFile ?? "-"}</span></div>
                  <div>native store: <span style={{ fontFamily: mono, color: c.text }}>{selected.session.agentSessionFile ?? "-"}</span></div>
                </div>
              </section>

              <section
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: 10,
                  padding: 14,
                  background: c.bgElevated,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 10 }}>
                  파일
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {selected.files.map((file) => (
                    <button
                      key={`${file.kind}:${file.path ?? file.label}`}
                      onClick={() => file.path && file.exists && setFilePath(file.path)}
                      disabled={!file.exists || !file.path}
                      style={{
                        ...ghostBtn,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        opacity: file.exists && file.path ? 1 : 0.45,
                        cursor: file.exists && file.path ? "pointer" : "not-allowed",
                      }}
                    >
                      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.label}
                      </span>
                      <span style={{ fontFamily: mono, fontSize: 11, color: c.textFaint }}>
                        {file.exists ? `${fmtBytes(file.sizeBytes)}` : "missing"}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: 10,
                  padding: 14,
                  background: c.bgElevated,
                  minHeight: 320,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>파일 미리보기</div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: c.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {filePath ?? "-"}
                  </div>
                </div>
                <pre
                  style={{
                    margin: 0,
                    minHeight: 0,
                    flex: 1,
                    overflow: "auto",
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${c.borderSubtle}`,
                    background: c.bg,
                    color: c.text,
                    fontSize: 11.5,
                    lineHeight: 1.55,
                    fontFamily: mono,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {loadingFile ? "불러오는 중…" : fileText || "(선택된 파일이 없습니다.)"}
                </pre>
              </section>

              <section
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: 10,
                  padding: 14,
                  background: c.bgElevated,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 10 }}>
                  피드백
                </div>
                {selected.feedback.length === 0 ? (
                  <div style={{ color: c.textFaint, fontSize: 12.5 }}>연결된 피드백이 없습니다.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selected.feedback.map((entry) => (
                      <div
                        key={entry.feedbackId}
                        style={{
                          border: `1px solid ${c.borderSubtle}`,
                          borderRadius: 8,
                          padding: 10,
                          background: c.bg,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                          <Chip label={entry.kind} />
                          <span style={{ color: c.textMuted, fontSize: 11.5 }}>{entry.timestamp}</span>
                          <span style={{ color: c.textMuted, fontSize: 11.5, fontFamily: mono }}>{entry.reviewer ?? "unknown"}</span>
                        </div>
                        <div style={{ color: c.text, fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                          {entry.comment}
                        </div>
                        <div style={{ color: c.textFaint, fontSize: 11, fontFamily: mono }}>
                          {entry.mockupFile}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: 10,
                  padding: 14,
                  background: c.bgElevated,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 10 }}>
                  점수
                </div>
                {selected.scores.length === 0 ? (
                  <div style={{ color: c.textFaint, fontSize: 12.5 }}>점수 스냅샷이 없습니다.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {selected.scores.map((score, index) => (
                      <SessionScoreCard key={`${score.seq ?? index}`} score={score} />
                    ))}
                  </div>
                )}
              </section>

              <section
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: 10,
                  padding: 14,
                  background: c.bgElevated,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 10 }}>
                  최근 이벤트
                </div>
                {selected.events.length === 0 ? (
                  <div style={{ color: c.textFaint, fontSize: 12.5 }}>이벤트가 없습니다.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selected.events.slice(-8).map((event) => (
                      <div
                        key={event.eventId}
                        style={{
                          border: `1px solid ${c.borderSubtle}`,
                          borderRadius: 8,
                          padding: 10,
                          background: c.bg,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                          <Chip label={event.type} />
                          <span style={{ color: c.textMuted, fontSize: 11.5 }}>{event.timestamp}</span>
                        </div>
                        {event.mockupFile && (
                          <div style={{ color: c.textFaint, fontSize: 11.5, fontFamily: mono }}>
                            {event.mockupFile}
                          </div>
                        )}
                        {event.payload && (
                          <div style={{ color: c.textMuted, fontSize: 11.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                            {JSON.stringify(event.payload)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
