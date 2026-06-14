---
"@nudge-design/react": major
"@nudge-design/html": major
"@nudge-design/tokens": major
---

브랜드 전용 위젯·로고 정리 + 브랜드 띠 배너 일반화 (chrome 정리 후속)

**BREAKING — 공개 API 제거**

- `@nudge-design/react`: 트로스트 서비스 위젯 4종(`TrostEAPBanner`·`TrostSearchForm`·`TrostLoginSection`·`TrostAppDownloadButton`)과 브랜드 전용 `NudgeEAPLogo` 컴포넌트를 제거했습니다. 모두 목업 전용이라 공개 react 패키지에서 빠집니다.
- `@nudge-design/tokens`: 위 위젯에서만 쓰던 `trostEapBanner` 토큰을 제거했습니다.

**대체 / 이관**

- 트로스트 EAP 배너는 목업 셸 `nds-brand-chrome` 의 **브랜드 무관 `banner` 영역**으로 일반화됐습니다. 어느 브랜드든 `BRAND_DATA[brand].banner = { strong, text, ctaPrefix?, ctaAccent?, ctaSuffix?, href }` 만 주입하면 데스크탑 헤더 상단에 띠 배너가 렌더되고, 색은 `--nds-brand-banner-*` 슬롯으로 브랜드별 override 가능합니다(컴포넌트에 브랜드 분기 없음). (`@nudge-design/html`)
- `NudgeEAPLogo` 의 6변종(koen/ko/en/en-dark/symbol) + DAIN 마크는 `@nudge-design/assets` SSOT 로 이관됐습니다. 로고는 `BrandLogo` / 브랜드 데이터로 쓰세요.
