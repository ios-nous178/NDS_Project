import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * 렌더러 치명 화면 + 전역 ErrorBoundary.
 *
 * 다크 빈 창(#root 언마운트)으로 조용히 죽는 대신, 원인과 복구 버튼을 보여준다.
 * window.harness(preload) 에 의존하지 않는다 — 그게 실패한 경우(BootError)에도 떠야 하므로
 * 색/폰트를 리터럴로 박는다(theme.ts 도 import 하지 않음).
 */

const wrap: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: 32,
  background: "#1e1e1e",
  color: "#d4d4d4",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  textAlign: "center",
};

const btn: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: 13,
  borderRadius: 8,
  cursor: "pointer",
  border: "1px solid #3c3c3c",
  background: "#2d2d2d",
  color: "#d4d4d4",
};

/** 공통 치명 화면 — 제목 + (선택)상세 + 복구 액션. */
export function FatalScreen({
  title,
  detail,
  actions,
}: {
  title: string;
  detail?: string;
  actions?: ReactNode;
}): React.JSX.Element {
  return (
    <div style={wrap}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f0" }}>{title}</div>
      {detail && (
        <pre
          style={{
            maxWidth: 560,
            maxHeight: 220,
            overflow: "auto",
            margin: 0,
            fontSize: 11.5,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "#9a9a9a",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {detail}
        </pre>
      )}
      {actions && <div style={{ display: "flex", gap: 10, marginTop: 4 }}>{actions}</div>}
    </div>
  );
}

/** preload 미주입(window.harness 부재) 안내(#7). 재시작/재설치 유도. */
export function BootError({ message }: { message: string }): React.JSX.Element {
  return (
    <FatalScreen
      title="앱을 시작하지 못했어요"
      detail={message}
      actions={
        <button style={btn} onClick={() => location.reload()}>
          새로고침
        </button>
      }
    />
  );
}

interface State {
  error: Error | null;
}

/** 렌더 단계 예외를 잡아 다크 빈 창 대신 복구 UI 를 보여주는 전역 안전망(#6). */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // 콘솔로 남겨 main 의 console-message/진단 경로가 로그로 흘릴 수 있게 한다.
    console.error("[renderer] ErrorBoundary caught:", error, info.componentStack);
  }

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <FatalScreen
        title="화면을 그리는 중 문제가 생겼어요"
        detail={`${error.message}\n\n${(error.stack ?? "").split("\n").slice(1, 6).join("\n")}`}
        actions={
          <>
            <button style={btn} onClick={() => this.setState({ error: null })}>
              다시 시도
            </button>
            <button style={btn} onClick={() => location.reload()}>
              앱 새로고침
            </button>
          </>
        }
      />
    );
  }
}
