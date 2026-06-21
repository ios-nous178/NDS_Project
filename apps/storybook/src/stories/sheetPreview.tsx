import React from "react";
import { colors } from "@nudge-design/tokens";

/**
 * 바텀시트 "본문 박스"를 그대로 재현한 갤러리 프리뷰 셸.
 *
 * Toast/Snackbar 처럼 화면 위에 뜨는 알림을 *실제 앱 맥락(바텀시트 본문)* 위에, 그 폭에
 * 맞춰 보여주기 위한 정적 컨테이너다. Toast viewport 는 position:fixed portal 이라 카드 안에
 * 직접 가둘 수 없어, BottomSheet 와 동일한 `nds-bottom-sheet__*` 클래스로 본문 박스를 만들고
 * 그 안/위에 알림을 얹는다. (스타일 SSOT = packages/styles/src/BottomSheet.ts)
 */
const skeletonBar = (width: string, height: number): React.CSSProperties => ({
  width,
  height,
  borderRadius: 6,
  background: colors.gray[100],
});

export function SheetPreview({
  title = "알림",
  width = 320,
  floating = false,
  showSkeleton = true,
  children,
}: {
  title?: string;
  width?: number;
  /** true 면 children 을 본문 박스 하단에 절대배치(=Toast 처럼 떠 있는 알림). */
  floating?: boolean;
  /** 본문 스켈레톤 표시 여부. children 이 곧 본문이면(=Snackbar) false. */
  showSkeleton?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        className="nds-bottom-sheet__content"
        style={{
          position: "relative",
          width,
          maxWidth: "100%",
          maxHeight: "none",
          // 갤러리 정적 프리뷰 — 슬라이드업 애니메이션 비활성.
          animation: "none",
          paddingBottom: floating ? 0 : 16,
        }}
      >
        <div className="nds-bottom-sheet__handle" />
        <div className="nds-bottom-sheet__header" data-has-title="true">
          <h3 className="nds-bottom-sheet__header-title">{title}</h3>
        </div>
        {showSkeleton && (
          <div
            className="nds-bottom-sheet__body"
            aria-hidden
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div style={skeletonBar("55%", 14)} />
            <div style={skeletonBar("100%", 44)} />
            <div style={skeletonBar("100%", 44)} />
          </div>
        )}

        {floating ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              padding: "0 16px 16px",
            }}
          >
            {children}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--semantic-gap-default)",
              padding: "0 16px",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
