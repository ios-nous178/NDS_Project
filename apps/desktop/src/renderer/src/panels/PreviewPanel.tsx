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
}: {
  relPath: string | null;
  bust: number;
  viewport: Viewport;
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
        }}
      >
        목업을 선택하면 미리보기가 표시됩니다.
      </div>
    );

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
    return <div style={{ width: "100%", height: "100%", background: "#fff" }}>{frame}</div>;
  }

  // 앱: 가운데 정렬된 폰 프레임.
  return (
    <div
      style={{
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
        }}
      >
        {frame}
      </div>
    </div>
  );
}
