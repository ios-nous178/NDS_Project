import { c } from "../ui/theme.js";

export type Viewport = "web" | "app";

/** 앱(모바일) 뷰포트 프레임 폭. iPhone 14-ish. */
const APP_WIDTH = 390;

/**
 * 목업 미리보기. 웹 = 전체폭, 앱 = 가운데 정렬된 모바일 폰 프레임(반응형 확인용).
 * iframe 자체는 동일 산출물을 가리키고 컨테이너 폭만 바꾼다.
 */
export function PreviewPanel({
  relPath,
  bust,
  viewport,
  live = false,
  zoom = 1,
}: {
  relPath: string | null;
  bust: number;
  viewport: Viewport;
  /** 터미널에서 목업 생성 중이면 true — 빈 상태 안내 문구 변경 + "생성 중" 배지 표시. */
  live?: boolean;
  /** 미리보기 확대/축소 배율(1 = 100%). iframe 의 논리 폭은 유지하고 시각적으로만 스케일. */
  zoom?: number;
}): React.JSX.Element {
  if (!relPath)
    return (
      <div
        style={{
          color: c.textMuted,
          fontSize: 13,
          padding: 24,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        {live
          ? "목업 생성 중 — 결과물이 만들어지면 실시간으로 표시됩니다."
          : "목업을 선택하면 미리보기가 표시됩니다."}
      </div>
    );

  const liveBadge = live ? (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        color: "#fff",
        background: "rgba(22,163,74,0.92)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        pointerEvents: "none",
      }}
    >
      <style>{"@keyframes ndsLivePulse{0%,100%{opacity:1}50%{opacity:0.25}}"}</style>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#fff",
          animation: "ndsLivePulse 1.2s ease-in-out infinite",
        }}
      />
      생성 중
    </div>
  ) : null;

  const src = window.harness.previewUrl(relPath, bust);
  const frame = (
    <iframe
      // src(쿼리 캐시버스터)가 바뀌면 자동 리로드. 저장 시 bust 증가로 갱신.
      src={src}
      title="mockup preview"
      sandbox="allow-scripts"
      style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
    />
  );

  if (viewport === "web") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "#fff",
          overflow: "auto",
        }}
      >
        {liveBadge}
        {/* iframe 논리 폭은 컨테이너 폭(100%)을 유지(반응형 불변) — 시각적으로만 scale. */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {frame}
        </div>
      </div>
    );
  }

  // 앱: 가운데 정렬된 폰 프레임.
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: c.bg,
        padding: 16,
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      {liveBadge}
      <div
        style={{
          width: APP_WIDTH,
          maxWidth: "100%",
          height: "100%",
          maxHeight: 844,
          borderRadius: 24,
          border: `8px solid #000`,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          flexShrink: 0,
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {frame}
      </div>
    </div>
  );
}
