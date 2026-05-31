import { c } from "../ui/theme.js";

export type Viewport = "web" | "app";

/** 앱(모바일) 뷰포트 프레임 폭. iPhone 14-ish. */
const APP_WIDTH = 390;
/** 웹 뷰포트의 고정 논리 폭 — DS 데스크톱 캔버스(=mockup-screen[data-device=web], 헤더 max-width 1440)와 일치.
 *  미리보기 패널 폭과 무관하게 항상 이 폭으로 렌더해 ① 목업끼리 폭이 일정하고
 *  ② 확대/축소가 "화면(논리 폭)은 고정 + 시각 배율만 변경"으로 동작한다. */
const WEB_WIDTH = 1440;
/** 앱 폰 프레임 논리 높이(iPhone 14-ish). */
const APP_HEIGHT = 844;

/**
 * 목업 미리보기. 웹 = 고정 논리 폭(1440)의 데스크톱 캔버스, 앱 = 모바일 폰 프레임(390×844).
 * iframe 의 논리 크기는 항상 고정하고 zoom 은 transform: scale 로 시각 배율만 바꾼다
 * (패널을 줄여도 목업 폭은 그대로 — 줄어드는 건 배율뿐). 넘치면 컨테이너가 스크롤한다.
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
        {/* 사이징 박스: 실제 차지 폭 = WEB_WIDTH*zoom. margin auto 로 패널보다 작으면 가운데,
            크면 가로 스크롤. 안쪽 iframe 은 논리 폭 WEB_WIDTH 고정 + scale(zoom)(origin 0 0). */}
        <div style={{ width: WEB_WIDTH * zoom, height: "100%", margin: "0 auto" }}>
          <div
            style={{
              width: WEB_WIDTH,
              height: `${100 / zoom}%`,
              transform: `scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {frame}
          </div>
        </div>
      </div>
    );
  }

  // 앱: 가운데 정렬된 폰 프레임(390×844 논리 고정 + scale(zoom)).
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
      {/* 사이징 박스 = 폰 프레임의 시각 크기(논리 크기 × zoom) — flex 가운데 정렬이 이 박스를 잡는다. */}
      <div style={{ width: APP_WIDTH * zoom, height: APP_HEIGHT * zoom, flexShrink: 0 }}>
        <div
          style={{
            width: APP_WIDTH,
            height: APP_HEIGHT,
            boxSizing: "border-box",
            borderRadius: 24,
            border: `8px solid #000`,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {frame}
        </div>
      </div>
    </div>
  );
}
