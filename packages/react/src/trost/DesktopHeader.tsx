import React from "react";

export interface TrostDesktopHeaderProps {
  /** EAP 배너 슬롯 (TrostEAPBanner) — 숨기려면 비워둘 것 */
  banner?: React.ReactNode;
  /** 상단 유틸리티 영역 (로고/검색/로그인/다운로드) */
  utility: React.ReactNode;
  /** 탭 네비게이션 */
  tabs: React.ReactNode;
  /** sticky 비활성화 시 false — default true */
  sticky?: boolean;
  className?: string;
}

const STYLE = `
  .nds-trost-desktop-header {
    background: #fff;
    font-family: inherit;
    display: none;
  }
  @media (min-width: 1024px) {
    .nds-trost-desktop-header { display: block; }
    .nds-trost-desktop-header--sticky {
      position: sticky;
      top: 0;
      z-index: 50;
    }
  }
`;

/**
 * Trost 데스크탑 헤더 (sticky).
 *
 * 3영역 합성:
 *   1) EAP 배너 (optional)
 *   2) 유틸리티 헤더 (로고 + 검색 + 로그인 + 앱 다운로드)
 *   3) 탭 네비게이션 (+ 우측 인기 검색어 슬롯)
 *
 * 서비스 로직(로그인 상태, API)은 호스트 앱이 주입.
 */
export function TrostDesktopHeader({
  banner,
  utility,
  tabs,
  sticky = true,
  className,
}: TrostDesktopHeaderProps) {
  return (
    <>
      <style>{STYLE}</style>
      <header
        className={[
          "nds-trost-desktop-header",
          sticky && "nds-trost-desktop-header--sticky",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {banner}
        {utility}
        {tabs}
      </header>
    </>
  );
}
