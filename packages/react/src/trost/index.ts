/**
 * Trost-branded 서비스 위젯 모음 (chrome 아님).
 *
 * 브랜드 chrome(헤더/푸터/바텀네비/데스크톱헤더/유틸리티/탭내비)은 공개 react 패키지에서
 * 제거됐다(브랜드 분기 금지). 화면 chrome 은 목업 전용 `nds-brand-chrome`
 * (`<nds-brand-header brand="trost">` 등)으로 만든다. 여기 남는 것은 chrome 이 아닌
 * 트로스트 서비스 위젯(EAP 배너·검색폼·로그인·앱다운로드)뿐.
 *
 * **4pt 그리드 예외**: 이 디렉토리의 padding/margin (8/11/13/18/20/50 px 등)
 * 은 Trost 웹사이트의 실측 디자인 스펙(colors_and_type.css)을 1:1 으로 옮긴
 * 값이라 NudgeEAP 표준 4pt 그리드를 따르지 않는다. **의도된 브랜드 정합
 * 예외**이므로 이 디렉토리 안 px 값은 "임의 px" 안티패턴으로 간주하지
 * 마세요. NudgeEAP 표준 컴포넌트 (`packages/react/src/*.tsx`) 에서는 4pt
 * 그리드 + semantic spacing 토큰 사용이 원칙.
 */

export * from "./types.js";
export * from "./EAPBanner.js";
export * from "./SearchForm.js";
export * from "./LoginSection.js";
export * from "./AppDownloadButton.js";
