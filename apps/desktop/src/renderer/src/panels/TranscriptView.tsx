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
  onClose,
}: {
  projectPath: string;
  sessionId: string;
  label: string;
  onClose: () => void;
}): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const term = new Terminal({
      fontSize: 12,
      fontFamily: mono,
      disableStdin: true,
      cursorBlink: false,
      theme: { background: "#1e1e1e" },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(el);
    try {
      fit.fit();
    } catch {
      /* ignore */
    }
    let alive = true;
    void window.harness.readTranscript(projectPath, sessionId).then((res) => {
      if (!alive) return;
      term.write(res.text || "\x1b[90m(트랜스크립트 없음)\x1b[0m");
    });
    const ro = new ResizeObserver(() => {
      try {
        fit.fit();
      } catch {
        /* ignore */
      }
    });
    ro.observe(el);
    return () => {
      alive = false;
      ro.disconnect();
      term.dispose();
    };
  }, [projectPath, sessionId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderBottom: `1px solid ${c.border}`,
          fontSize: 12.5,
          color: c.text,
        }}
      >
        <span style={{ color: c.yellow }}>기록 보기</span>
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
        style={{ flex: 1, minHeight: 0, background: "#1e1e1e", padding: 4 }}
      />
    </div>
  );
}
