import { useCallback, useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { AgentType } from "../../../preload/index.js";

/**
 * 인앱 에이전트 터미널 (Phase 5).
 *
 * 사용자 머신에 설치된 claude(이어서 codex) CLI 를 PTY 로 구동해 xterm.js 터미널에 그대로
 * 띄운다. 라이선스/로그인은 설치본 그대로 — API 키 불필요. 진짜 TUI(권한 프롬프트 등) 동작.
 *
 * 패널은 항상 마운트되고 App 이 dock 높이만 토글한다 → 접었다 펴도 PTY 세션이 유지된다.
 */
const AGENTS: { type: AgentType; label: string; enabled: boolean }[] = [
  { type: "claude", label: "Claude Code", enabled: true },
  { type: "codex", label: "Codex", enabled: false }, // Phase 5b 에서 활성화
];

type Status = "idle" | "running" | "exited" | "error";

export function AgentPanel({
  projectPath,
  mockupFile,
}: {
  projectPath: string | null;
  /** 세션을 어떤 목업 맥락에서 시작했는지(이벤트/세션 메타에 기록). */
  mockupFile: string | null;
}): React.JSX.Element {
  const [agentType, setAgentType] = useState<AgentType>("claude");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sessionRef = useRef<string | null>(null);

  // PTY 출력/종료 구독 — ref 기반이라 한 번만 등록.
  useEffect(() => {
    const offData = window.harness.onAgentData((e) => {
      if (e.sessionId === sessionRef.current) termRef.current?.write(e.data);
    });
    const offExit = window.harness.onAgentExit((e) => {
      if (e.sessionId !== sessionRef.current) return;
      setStatus(e.exitCode === 0 ? "exited" : "error");
      termRef.current?.writeln(`\r\n\x1b[90m[세션 종료 · code ${e.exitCode}]\x1b[0m`);
      sessionRef.current = null;
    });
    return () => {
      offData();
      offExit();
    };
  }, []);

  // 컨테이너 리사이즈 → fit + PTY resize.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const fit = fitRef.current;
      const term = termRef.current;
      if (!fit || !term) return;
      try {
        fit.fit();
      } catch {
        /* 0-size 등 */
      }
      if (sessionRef.current && term.cols > 0) {
        void window.harness.resizeAgent(sessionRef.current, term.cols, term.rows);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 언마운트(=앱 종료) 시 터미널만 정리. PTY kill 은 main 의 will-quit 가 담당.
  useEffect(
    () => () => {
      termRef.current?.dispose();
    },
    [],
  );

  const start = useCallback(async () => {
    if (!projectPath || !containerRef.current) return;
    setError("");

    termRef.current?.dispose();
    const term = new Terminal({
      fontSize: 12,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      cursorBlink: true,
      theme: { background: "#1e1e1e" },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    try {
      fit.fit();
    } catch {
      /* ignore */
    }
    term.onData((data) => {
      if (sessionRef.current) void window.harness.sendAgentInput(sessionRef.current, data);
    });
    termRef.current = term;
    fitRef.current = fit;

    const id = crypto.randomUUID();
    sessionRef.current = id;

    const res = await window.harness.startAgent({
      sessionId: id,
      agentType,
      projectPath,
      mockupFile: mockupFile ?? undefined,
      cols: term.cols,
      rows: term.rows,
    });
    if (!res.ok) {
      sessionRef.current = null;
      setStatus("error");
      setError(res.error ?? "시작 실패");
      term.writeln(`\x1b[31m${res.error ?? "시작 실패"}\x1b[0m`);
      return;
    }
    setStatus("running");
    term.focus();
  }, [projectPath, agentType, mockupFile]);

  const stop = useCallback(() => {
    if (sessionRef.current) void window.harness.stopAgent(sessionRef.current);
  }, []);

  const running = status === "running";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderBottom: "1px solid #e4e7ec",
          fontSize: 13,
        }}
      >
        <span style={{ color: "#475467", fontWeight: 600 }}>AI 에이전트</span>
        <div style={{ display: "flex", gap: 4 }}>
          {AGENTS.map((a) => (
            <button
              key={a.type}
              disabled={!a.enabled || running}
              onClick={() => setAgentType(a.type)}
              title={a.enabled ? "" : "곧 지원 (Phase 5b)"}
              style={agentType === a.type && a.enabled ? chipOn : chipOff}
            >
              {a.label}
              {!a.enabled && " (곧)"}
            </button>
          ))}
        </div>
        {!running ? (
          <button onClick={start} disabled={!projectPath} style={primaryBtn}>
            세션 시작
          </button>
        ) : (
          <button onClick={stop} style={dangerBtn}>
            중지
          </button>
        )}
        <span style={{ color: statusColor(status), fontSize: 12 }}>{statusLabel(status)}</span>
        {error && (
          <span style={{ color: "#d92d20", fontSize: 12, marginLeft: "auto" }}>{error}</span>
        )}
        {!projectPath && (
          <span style={{ color: "#98a2b3", fontSize: 12, marginLeft: "auto" }}>
            프로젝트를 먼저 여세요.
          </span>
        )}
      </div>
      <div
        ref={containerRef}
        style={{ flex: 1, minHeight: 0, background: "#1e1e1e", padding: 4 }}
      />
    </div>
  );
}

function statusLabel(s: Status): string {
  return s === "running" ? "실행 중" : s === "exited" ? "종료됨" : s === "error" ? "오류" : "대기";
}
function statusColor(s: Status): string {
  return s === "running" ? "#067647" : s === "error" ? "#d92d20" : "#98a2b3";
}

const chipBase: React.CSSProperties = {
  padding: "3px 10px",
  borderRadius: 999,
  border: "1px solid #d0d5dd",
  cursor: "pointer",
  fontSize: 12,
};
const chipOff: React.CSSProperties = { ...chipBase, background: "#fff", color: "#475467" };
const chipOn: React.CSSProperties = {
  ...chipBase,
  background: "#175cd3",
  borderColor: "#175cd3",
  color: "#fff",
};
const primaryBtn: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 6,
  border: "none",
  background: "#175cd3",
  color: "#fff",
  cursor: "pointer",
  fontSize: 12,
};
const dangerBtn: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 6,
  border: "none",
  background: "#d92d20",
  color: "#fff",
  cursor: "pointer",
  fontSize: 12,
};
