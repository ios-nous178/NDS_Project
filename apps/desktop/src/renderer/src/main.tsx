import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { ErrorBoundary, BootError } from "./ui/ErrorBoundary.js";
import "./global.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

// preload 미주입(window.harness 부재) 가드(#7) — App 이 window.harness.* 를 무가드로 읽어
// 즉시 throw 하기 전에, 다크 빈 창 대신 원인을 보여준다. 그 외 모든 렌더 throw 는
// ErrorBoundary(#6)가 잡아 복구 UI 로 떨어뜨린다.
if (!(window as unknown as { harness?: unknown }).harness) {
  createRoot(root).render(
    <BootError message="preload 스크립트가 로드되지 않았습니다(window.harness 없음). 앱을 재시작하거나 재설치해 주세요." />,
  );
} else {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
