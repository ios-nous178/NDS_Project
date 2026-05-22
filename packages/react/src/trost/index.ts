/**
 * Trost-branded 컴포넌트 모음.
 *
 * **4pt 그리드 예외**: 이 디렉토리의 padding/margin (8/11/13/18/20/50 px 등)
 * 은 Trost 웹사이트의 실측 디자인 스펙(colors_and_type.css)을 1:1 으로 옮긴
 * 값이라 NudgeEAP 표준 4pt 그리드를 따르지 않는다. **의도된 브랜드 정합
 * 예외**이므로 이 디렉토리 안 px 값은 "임의 px" 안티패턴으로 간주하지
 * 마세요. NudgeEAP 표준 컴포넌트 (`packages/react/src/*.tsx`) 에서는 4pt
 * 그리드 + semantic spacing 토큰 사용이 원칙.
 */

export * from "./types";
export * from "./EAPBanner";
export * from "./SearchForm";
export * from "./LoginSection";
export * from "./AppDownloadButton";
export * from "./UtilityHeader";
export * from "./TabNavigation";
export * from "./DesktopHeader";

/* ─── Brand chrome (header / footer / bottom-nav) ─── */
export * from "./AppBar";
export * from "./Footer";
export * from "./BottomNav";

/**
 * WebHeader alias — Trost 데스크톱 헤더.
 * TrostDesktopHeader 구현 재노출 — EAPBanner / UtilityHeader / TabNavigation 3슬롯 컴파운드.
 * Zeplin zpl.io/Dp775xl 정합 (Rectangle 2613 = EAPBanner / Path = Logo / Rectangle 2522 = Search).
 */
export { TrostDesktopHeader as TrostWebHeader } from "./DesktopHeader";
export type { TrostDesktopHeaderProps as TrostWebHeaderProps } from "./DesktopHeader";
