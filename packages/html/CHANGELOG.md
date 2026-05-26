# @nudge-eap/html

## 0.2.0

### Minor Changes

- 0.2.0 — DS 0.2.0 과 동기화 (캐포비 브랜드 합류 + 신규 컴포넌트 5종 + 브랜드 헤더/푸터 통합)

## 0.1.11

### Patch Changes

- 721b500: `<nds-date-picker>` (그리고 내부적으로 이 컴포넌트를 쓰는 `<nds-date-range-picker>`) 의 캘린더 트리거 아이콘을 `[data-brand]` cascade 로 brand 별 swap. React 의 `useBrand()` 분기와 1:1 정합.
  - `nds-date-picker.ts`: trigger icon wrapper 의 inline SVG 빌더 제거 — 빈 span 만 두고 CSS 가 그림.
  - `styles/DatePicker.ts`: `.nds-date-picker__icon:empty` 에 mask-image 기본 캘린더 SVG, `[data-brand="cashpobi"]` cascade 에 Cashpobi 캘린더 SVG 를 inline data URL 로 입힘.
  - React 어댑터의 `.nds-date-picker__icon` 은 자식 `<svg>` 가 있어 `:empty` 매칭에서 제외 — 영향 없음.

- Updated dependencies [721b500]
- Updated dependencies
  - @nudge-eap/styles@0.1.11
  - @nudge-eap/tokens@0.2.0
  - @nudge-eap/icons@0.2.0
