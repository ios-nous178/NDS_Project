import { useCallback, useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { AgentType } from "../../../preload/index.js";
import {
  c,
  mono,
  pillBtn,
  pillBtnActive,
  primaryBtn,
  primaryBtnDisabled,
  dangerBtn,
} from "../ui/theme.js";

/**
 * 인앱 에이전트 터미널 (Phase 5 · 다크 Phase 6).
 *
 * 사용자 머신에 설치된 claude/codex CLI 를 PTY 로 구동해 xterm.js 터미널에 그대로 띄운다.
 * 라이선스/로그인은 설치본 그대로 — API 키 불필요. 진짜 TUI(권한 프롬프트 등) 동작.
 * 세션 시작/종료를 App 에 알려 채팅기록 리스트가 동기화된다.
 */
const AGENTS: { type: AgentType; label: string; enabled: boolean }[] = [
  { type: "claude", label: "Claude", enabled: true },
  { type: "codex", label: "Codex", enabled: true },
];

type Status = "idle" | "running" | "exited" | "error";

export function AgentPanel({
  projectPath,
  mockupFile,
  active = true,
  attachSessionId,
  onLiveChange,
  onHistoryChange,
}: {
  projectPath: string | null;
  mockupFile: string | null;
  /** 패널이 화면에 보이는지(기록 보기 오버레이로 가려지면 false). 가려졌다 돌아올 때 포커스 복구용. */
  active?: boolean;
  /** main 이 이미 시작한 세션(인테이크 등)에 터미널을 attach. 값이 바뀌면 그 세션을 띄운다. */
  attachSessionId?: string | null;
  /** 라이브 세션 id 변경(시작 시 id, 종료 시 null). */
  onLiveChange?: (sessionId: string | null) => void;
  /** 채팅기록 리스트 새로고침 트리거. */
  onHistoryChange?: () => void;
}): React.JSX.Element {
  const [agentType, setAgentType] = useState<AgentType>("claude");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sessionRef = useRef<string | null>(null);
  const liveCb = useRef(onLiveChange);
  const histCb = useRef(onHistoryChange);
  liveCb.current = onLiveChange;
  histCb.current = onHistoryChange;

  useEffect(() => {
    const offData = window.harness.onAgentData((e) => {
      if (e.sessionId === sessionRef.current) termRef.current?.write(e.data);
    });
    const offExit = window.harness.onAgentExit((e) => {
      if (e.sessionId !== sessionRef.current) return;
      setStatus(e.exitCode === 0 ? "exited" : "error");
      termRef.current?.writeln(`\r\n\x1b[90m[세션 종료 · code ${e.exitCode}]\x1b[0m`);
      sessionRef.current = null;
      liveCb.current?.(null);
      histCb.current?.();
    });
    return () => {
      offData();
      offExit();
    };
  }, []);

  // 기록 보기(display:none)로 가려졌다 다시 보일 때 xterm 이 포커스를 잃어 입력이 안 먹는다.
  // ⚠️ display:block 직후 같은 틱엔 컨테이너가 아직 0-size 라 fit/focus 가 먹지 않는다.
  //    requestAnimationFrame 으로 레이아웃이 끝난 다음 프레임에 리핏 + 재포커스한다.
  useEffect(() => {
    if (!active) return;
    const raf = requestAnimationFrame(() => {
      const term = termRef.current;
      if (!term) return;
      try {
        fitRef.current?.fit();
      } catch {
        /* 0-size 등 */
      }
      if (sessionRef.current && term.cols > 0) {
        void window.harness.resizeAgent(sessionRef.current, term.cols, term.rows);
      }
      term.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [active]);

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

  useEffect(
    () => () => {
      termRef.current?.dispose();
    },
    [],
  );

  // 새 xterm 인스턴스 생성 + 입력 배선(start/attach 공용). 이전 터미널은 dispose.
  const makeTerminal = useCallback((): Terminal | null => {
    if (!containerRef.current) return null;
    termRef.current?.dispose();
    const term = new Terminal({
      fontSize: 12,
      fontFamily: mono,
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
    return term;
  }, []);

  const start = useCallback(async () => {
    if (!projectPath || !containerRef.current) return;
    setError("");

    // 이전 라이브 세션이 남아있으면 새 세션으로 덮어쓰기 전에 PTY 를 먼저 중지.
    // 안 그러면 main 의 running Map 에서 도달 불가능한 orphan PTY 로 떠돈다.
    if (sessionRef.current) {
      void window.harness.stopAgent(sessionRef.current);
      sessionRef.current = null;
      liveCb.current?.(null);
    }

    const term = makeTerminal();
    if (!term) return;

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
      histCb.current?.();
      return;
    }
    setStatus("running");
    liveCb.current?.(id);
    histCb.current?.();
    term.focus();
  }, [projectPath, agentType, mockupFile, makeTerminal]);

  // main 이 이미 시작한 세션(인테이크)에 터미널을 붙인다. startAgent 는 호출하지 않는다.
  // 초기 출력 유실 방지: 라이브 구독을 켜기(sessionRef 세팅) 전에 지금까지의 트랜스크립트를
  // 1회 replay 한다. (read 와 세팅 사이의 짧은 창은 갓 시작한 세션에선 무시 가능 — plan 참조.)
  const attach = useCallback(
    async (id: string) => {
      if (!projectPath) return;
      setError("");
      const term = makeTerminal();
      if (!term) return;
      try {
        const { text } = await window.harness.readTranscript(projectPath, id);
        if (text) term.write(text);
      } catch {
        /* 트랜스크립트 없음 — 라이브만 */
      }
      sessionRef.current = id;
      setStatus("running");
      liveCb.current?.(id);
      histCb.current?.();
      term.focus();
    },
    [projectPath, makeTerminal],
  );

  useEffect(() => {
    if (attachSessionId && attachSessionId !== sessionRef.current) {
      void attach(attachSessionId);
    }
  }, [attachSessionId, attach]);

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
          height: 40,
          boxSizing: "border-box",
          padding: "0 12px",
          borderBottom: `1px solid ${c.border}`,
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {AGENTS.map((a) => (
            <button
              key={a.type}
              disabled={!a.enabled || running}
              onClick={() => setAgentType(a.type)}
              style={agentType === a.type ? pillBtnActive : pillBtn}
            >
              {a.label}
            </button>
          ))}
        </div>
        {!running ? (
          <button
            onClick={start}
            disabled={!projectPath}
            style={projectPath ? primaryBtn : primaryBtnDisabled}
          >
            세션 시작
          </button>
        ) : (
          <button onClick={stop} style={dangerBtn}>
            중지
          </button>
        )}
        <span style={{ color: statusColor(status), fontSize: 12 }}>{statusLabel(status)}</span>
        {error && (
          <span
            style={{
              color: c.red,
              fontSize: 12,
              marginLeft: "auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {error}
          </span>
        )}
      </div>
      <div
        ref={containerRef}
        onMouseDown={() => termRef.current?.focus()}
        style={{ flex: 1, minHeight: 0, background: "#1e1e1e", padding: 4 }}
      />
    </div>
  );
}

function statusLabel(s: Status): string {
  return s === "running" ? "실행 중" : s === "exited" ? "종료됨" : s === "error" ? "오류" : "대기";
}
function statusColor(s: Status): string {
  return s === "running" ? c.green : s === "error" ? c.red : c.textMuted;
}
