import React from "react";

/**
 * 데스크톱 헤더 미리보기 프레임.
 *
 * 데스크톱 웹 헤더는 1200~1440px 기준으로 설계돼서, 좁은 스토리북 캔버스/문서(개요)
 * 영역에 그대로 넣으면 GNB·검색바가 줄바꿈되며 레이아웃이 깨진다.
 * 그래서 의도된 데스크톱 너비로 먼저 렌더한 뒤 `zoom` 으로 화면에만 축소해 보여준다.
 * (zoom 은 레이아웃을 실제로 리플로우하므로 transform:scale 과 달리 빈 여백이 안 생긴다.)
 *
 * 데스크톱 variant 스토리에서만 사용한다 — 모바일/웹뷰 헤더는 감싸지 않는다.
 */
export function DesktopPreview({
  children,
  width = 1440,
  zoom = 0.62,
}: {
  children: React.ReactNode;
  /** 헤더를 렌더할 데스크톱 기준 너비 (이 너비에서 레이아웃이 깨지지 않음) */
  width?: number;
  /** 화면 표시 배율 (0~1) */
  zoom?: number;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ width, zoom } as React.CSSProperties}>{children}</div>
    </div>
  );
}
