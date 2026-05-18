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
export * from "./DesktopFooter";
