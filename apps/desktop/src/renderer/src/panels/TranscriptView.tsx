import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { c, mono } from "../ui/theme.js";

/**
 * 과거 세션의 raw pty 트랜스크립트를 read-only xterm 으로 표시(ANSI 보존).
 * 라이브 세션이 아니라 기록 보기 — 입력 불가.
 */
export function TranscriptView({
  projectPath,
  sessionId,
  label,
  cols,
  rows,
  onClose,
}: {
  projectPath: string;
  sessionId: string;
  label: string;
  /**
   * 녹화 시점의 PTY 폭/높이. raw TUI 트랜스크립트는 이 폭으로만 정확히 재생된다 —
   * 다른 폭으로 흘리면 커서 제어코드가 어긋나 전각(한글) 글자가 깨진다. 있으면 xterm 폭을
   * 이 값으로 **고정**(fit 안 함)하고, 없으면(옛 세션) 차선책으로 패널에 맞춘다.
   */
  cols?: number;
  rows?: number;
  onClose: () => void;
}): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // 녹화 폭이 둘 다 유효할 때만 고정 재생. 하나라도 없으면 옛 세션 → fit 폴백.
  const fixed = typeof cols === "number" && cols > 0 && typeof rows === "number" && rows > 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const term = new Terminal({
      fontSize: 12,
      fontFamily: mono,
      disableStdin: true,
      cursorBlink: false,
      theme: { background: "#1e1e1e" },
      ...(fixed ? { cols, rows } : {}),
    });
    // 녹화 폭이 있으면 fit 하지 않는다 — 폭을 그대로 고정해야 한글이 안 깨진다.
    // 패널이 더 좁으면 컨테이너가 가로 스크롤로 감싼다(overflow:auto). 옛 세션만 fit/관찰.
    let fit: FitAddon | null = null;
    if (!fixed) {
      fit = new FitAddon();
      term.loadAddon(fit);
    }
    term.open(el);
    if (fit) {
      try {
        fit.fit();
      } catch {
        /* ignore */
      }
    }
    let alive = true;
    void window.harness.readTranscript(projectPath, sessionId).then((res) => {
      if (!alive) return;
      term.write(res.text || "\x1b[90m(트랜스크립트 없음)\x1b[0m");
    });
    const ro = fit
      ? new ResizeObserver(() => {
          try {
            fit.fit();
          } catch {
            /* ignore */
          }
        })
      : null;
    ro?.observe(el);
    return () => {
      alive = false;
      ro?.disconnect();
      term.dispose();
    };
  }, [projectPath, sessionId, fixed, cols, rows]);

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
          title="끝난 세션의 기록입니다. 입력은 불가하며, 대화를 이어가려면 새 세션을 시작하세요."
        >
          읽기 전용 · 입력 불가
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
      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 0,
          background: "#1e1e1e",
          padding: 4,
          // 고정 폭 재생이 패널보다 넓으면 reflow(=깨짐) 대신 가로 스크롤로 감싼다.
          overflow: fixed ? "auto" : "hidden",
        }}
      />
    </div>
  );
}
