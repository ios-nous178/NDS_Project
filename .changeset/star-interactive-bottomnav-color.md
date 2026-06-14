---
"@nudge-design/html": minor
"@nudge-design/styles": patch
---

별점 입력 모드 발견성 개선 + 바텀네비 아이콘 색 누수 수정 (지니어트 목업 피드백)

- **`nds-star-rating` 에 `interactive` 불리언 속성 추가** — 클릭 입력 모드를 켜는 명확한 토글. 기존엔 `on-change`(값 없는 플래그 속성)로만 켜져 "별점이 동작 안 함" 오해를 유발했음(레거시 `on-change` 도 계속 동작). `<nds-star-rating interactive>` → 클릭 시 골드 채움 + `star-rating-change` 이벤트. React 는 기존대로 `onValueChange`.
- **바텀네비(tab-bar) 아이콘 색 누수 수정** — `.nds-footer[data-variant="tab-bar"]` 가 자기 `color` 를 안 박아 외부 페이지 `body{color}`(예: #333)가 `currentColor` SVG 아이콘으로 새어 비활성 아이콘이 검게 나오던 버그. chrome 자체 색 기준(inactive 토큰)을 박아 격리 — 모든 브랜드 바텀네비에 적용.
- StarRating 가이드: 입력 모드(`interactive`/`onValueChange`) do/dont 명확화 — 별을 nds-icon-button 으로 직접 만들지 말 것.

검증: html 별점 interactive 테스트 추가(표시전용/입력 동작), mirror-parity baseline 에 `interactive` html-전용 속성 사유 기록.
