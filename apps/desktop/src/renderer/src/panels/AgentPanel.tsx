import { useCallback, useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { AgentType, ChatMessage, Transport } from "../../../preload/index.js";
import { StructuredChatView } from "./StructuredChatView.js";
import { c, mono, dangerGhostBtn, SECTION_HEADER_H } from "../ui/theme.js";

/**
 * 인앱 에이전트 터미널 (Phase 5 · 다크 Phase 6).
 *
 * 사용자 머신에 설치된 claude/codex CLI 를 PTY 로 구동해 xterm.js 터미널에 그대로 띄운다.
 * 라이선스/로그인은 설치본 그대로 — API 키 불필요. 진짜 TUI(권한 프롬프트 등) 동작.
 * 세션 시작/종료를 App 에 알려 채팅기록 리스트가 동기화된다.
 *
 * 세션 시작 진입점은 좌측 채팅기록 헤더의 "+ 새 채팅" 으로 일원화됐다(에이전트도 거기서
 * 고른다). 이 패널 헤더는 라이브 상태 표시 + 전송방식(canary) 토글 + 중지만 담당한다.
 */
const AGENT_LABEL: Record<AgentType, string> = { claude: "Claude", codex: "Codex" };

/** 채팅기록 헤더의 "+ 새 채팅" 이 보내는 시작 요청. seq 가 바뀔 때마다 1회 시작. */
export interface NewChatRequest {
  seq: number;
  agentType: AgentType;
  transport: Transport;
  /** 새 채팅이 작업할 폴더(PTY cwd). 없으면 현재 프로젝트 루트에서 시작. */
  cwd?: string;
}

type Status = "idle" | "running" | "exited" | "error";

export function AgentPanel({
  projectPath,
  mockupFile,
  active = true,
  attachSessionId,
  newChatReq,
  onLiveChange,
  onHistoryChange,
}: {
  projectPath: string | null;
  mockupFile: string | null;
  /** 패널이 화면에 보이는지(기록 보기 오버레이로 가려지면 false). 가려졌다 돌아올 때 포커스 복구용. */
  active?: boolean;
  /** main 이 이미 시작한 세션(인테이크 등)에 터미널을 attach. 값이 바뀌면 그 세션을 띄운다. */
  attachSessionId?: string | null;
  /** "+ 새 채팅" 요청. seq 가 바뀌면 지정 에이전트로 새 bare 세션을 시작한다. */
  newChatReq?: NewChatRequest | null;
  /** 라이브 세션 id 변경(시작 시 id, 종료 시 null). */
  onLiveChange?: (sessionId: string | null) => void;
  /** 채팅기록 리스트 새로고침 트리거. */
  onHistoryChange?: () => void;
}): React.JSX.Element {
  const [agentType, setAgentType] = useState<AgentType>("claude");
  // 전송 방식. pty(기본) = xterm raw TUI / stream-json(canary) = 구조화 카드 채팅(claude 전용).
  const [transport, setTransport] = useState<Transport>("pty");
  // 구조화 모드 라이브 메시지 누적(pty 모드에선 미사용).
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
    // 구조화(stream-json) 세션의 정규화 메시지 — 라이브 누적(같은 세션만).
    const offMessage = window.harness.onAgentMessage((e) => {
      if (e.sessionId === sessionRef.current) setMessages((prev) => [...prev, e.message]);
    });
    const offExit = window.harness.onAgentExit((e) => {
      if (e.sessionId !== sessionRef.current) return;
      setStatus(e.exitCode === 0 ? "exited" : "error");
      // pty 모드만 터미널에 종료 줄을 적는다(구조화 모드는 result 푸터가 대신함).
      termRef.current?.writeln(`\r\n\x1b[90m[세션 종료 · code ${e.exitCode}]\x1b[0m`);
      sessionRef.current = null;
      liveCb.current?.(null);
      histCb.current?.();
    });
    return () => {
      offData();
      offMessage();
      offExit();
    };
  }, []);

  // 기록 보기(display:none)로 가려졌다 다시 보일 때 xterm 이 포커스를 잃어 입력이 안 먹는다.
  // ⚠️ display:block 직후 한 프레임만으론 컨테이너 레이아웃이 확정 안 돼 fit/focus 가 새는 경우가 있다.
  //    두 번 연속 rAF 로 레이아웃이 자리잡은 뒤 리핏 + 재포커스하고, xterm 의 입력 textarea 를
  //    직접 focus 해 키 입력 경로를 확실히 되살린다.
  useEffect(() => {
    if (!active) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
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
        term.textarea?.focus();
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
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

  const start = useCallback(
    async (agentTypeOverride?: AgentType, transportOverride?: Transport, cwdOverride?: string) => {
      // 작업 폴더 — "+ 새 채팅"에서 고른 폴더가 있으면 그것, 없으면 현재 프로젝트 루트.
      const workdir = cwdOverride ?? projectPath;
      if (!workdir) return;
      setError("");

      // 에이전트·전송방식은 "+ 새 채팅" 메뉴에서 고른 값이 넘어온다(없으면 현재 state).
      const at = agentTypeOverride ?? agentType;
      if (at !== agentType) setAgentType(at);
      // 구조화(stream-json)는 claude 전용 — codex 면 기본(pty)으로 강제.
      const tp: Transport = at !== "claude" ? "pty" : (transportOverride ?? transport);
      if (tp !== transport) setTransport(tp);

      // 이전 라이브 세션이 남아있으면 새 세션으로 덮어쓰기 전에 먼저 중지.
      // 안 그러면 main 의 running Map 에서 도달 불가능한 orphan 프로세스로 떠돈다.
      if (sessionRef.current) {
        void window.harness.stopAgent(sessionRef.current);
        sessionRef.current = null;
        liveCb.current?.(null);
      }

      const isStream = tp === "stream-json";
      let term: Terminal | null = null;
      if (isStream) {
        setMessages([]); // 구조화 모드: 카드 채팅 초기화(xterm 미사용).
      } else {
        if (!containerRef.current) return;
        term = makeTerminal();
        if (!term) return;
      }

      const id = crypto.randomUUID();
      sessionRef.current = id;

      const res = await window.harness.startAgent({
        sessionId: id,
        agentType: at,
        transport: tp,
        projectPath: workdir,
        cwdOverride: workdir,
        // 폴더를 새로 고른 채팅은 특정 목업에 매이지 않는다(빈 채팅).
        mockupFile: cwdOverride ? undefined : (mockupFile ?? undefined),
        ...(term ? { cols: term.cols, rows: term.rows } : {}),
      });
      if (!res.ok) {
        sessionRef.current = null;
        setStatus("error");
        setError(res.error ?? "시작 실패");
        term?.writeln(`\x1b[31m${res.error ?? "시작 실패"}\x1b[0m`);
        histCb.current?.();
        return;
      }
      setStatus("running");
      liveCb.current?.(id);
      histCb.current?.();
      term?.focus();
    },
    [projectPath, agentType, transport, mockupFile, makeTerminal],
  );

  // 구조화 모드 입력창 → 다음 유저 턴 전송(메시지 echo 는 main 이 agent:message 로 돌려줌).
  const sendTurn = useCallback((text: string) => {
    if (sessionRef.current) void window.harness.sendAgentTurn(sessionRef.current, text);
  }, []);

  // main 이 이미 시작한 세션(인테이크)에 터미널을 붙인다. startAgent 는 호출하지 않는다.
  // 초기 출력 유실 방지: 라이브 구독을 켜기(sessionRef 세팅) 전에 지금까지의 트랜스크립트를
  // 1회 replay 한다. (read 와 세팅 사이의 짧은 창은 갓 시작한 세션에선 무시 가능 — plan 참조.)
  const attach = useCallback(
    async (id: string) => {
      if (!projectPath) return;
      setError("");
      // 인테이크 세션은 pty(raw TUI) — canary 토글 상태였다면 기본으로 되돌려 xterm
      // 컨테이너가 렌더되게 하고, DOM 에 올라올 한 프레임을 기다린 뒤 터미널을 만든다.
      setTransport("pty");
      if (!containerRef.current) {
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
      }
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

  // "+ 새 채팅"(채팅기록 헤더) — 요청 seq 가 바뀌면 지정 에이전트로 새 bare 세션을 시작.
  // start() 가 이전 라이브 세션을 먼저 정리하므로 안전. start 의 identity 변화(mockupFile 등)
  // 로 재실행되지 않게 ref 로 최신 start 를 읽고 seq 만 추적한다.
  const startRef = useRef(start);
  startRef.current = start;
  const prevSeq = useRef(newChatReq?.seq ?? 0);
  useEffect(() => {
    const seq = newChatReq?.seq ?? 0;
    if (newChatReq && seq !== prevSeq.current) {
      prevSeq.current = seq;
      void startRef.current(newChatReq.agentType, newChatReq.transport, newChatReq.cwd);
    }
  }, [newChatReq]);

  const stop = useCallback(() => {
    if (sessionRef.current) void window.harness.stopAgent(sessionRef.current);
  }, []);

  const running = status === "running";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* 2번 섹션 헤더는 보여줄 게 있을 때만(라이브 상태 / 에러) 렌더한다. 시작 UI 는 좌측
          "+ 새 채팅" 으로 일원화돼 idle 상태엔 헤더가 비므로, 빈 바를 아예 그리지 않는다. */}
      {(running || error) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: SECTION_HEADER_H,
            boxSizing: "border-box",
            flexShrink: 0,
            padding: "0 12px",
            borderBottom: `1px solid ${c.border}`,
            fontSize: 13,
          }}
        >
          {running && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                lineHeight: 1,
              }}
            >
              <span style={{ color: c.green, fontSize: 9, lineHeight: 1 }}>●</span>
              <strong style={{ color: c.text, fontWeight: 600, lineHeight: 1 }}>
                {AGENT_LABEL[agentType]}
              </strong>
              <span style={{ color: c.textFaint, fontSize: 11, lineHeight: 1 }}>실행 중</span>
              {transport === "stream-json" && (
                <span
                  title="구조화(canary) 세션 — claude stream-json"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    color: c.textMuted,
                    border: `1px solid ${c.textMuted}`,
                    borderRadius: 4,
                    padding: "0 4px",
                    lineHeight: "14px",
                  }}
                >
                  CANARY
                </span>
              )}
            </span>
          )}
          {running && (
            <button onClick={stop} style={{ ...dangerGhostBtn, marginLeft: "auto" }}>
              중지
            </button>
          )}
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
      )}
      {transport === "stream-json" ? (
        <div style={{ flex: 1, minHeight: 0 }}>
          <StructuredChatView messages={messages} onSend={sendTurn} disabled={!running} />
        </div>
      ) : (
        <div
          ref={containerRef}
          onMouseDown={() => termRef.current?.focus()}
          style={{ flex: 1, minHeight: 0, background: "#1e1e1e", padding: 4 }}
        />
      )}
    </div>
  );
}
