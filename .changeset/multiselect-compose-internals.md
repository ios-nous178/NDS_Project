---
"@nudge-design/react": patch
"@nudge-design/styles": patch
"@nudge-design/html": patch
---

MultiSelect 내부를 DS 컴포넌트 조합으로 리팩터 (raw 재구현 제거).

- 검색 = `SearchInput`(`nds-search-input`), 전체선택/옵션 = `Checkbox`(`nds-checkbox`, 전체선택은 indeterminate), 푸터 = `Button`(`nds-button`, 취소 outlined / 적용 secondary solid).
- 이전엔 체크박스·검색·버튼을 MultiSelect 안에서 raw 로 다시 그려서 드리프트 발생 — 예: MultiSelect 체크박스는 18px/radius4 하드코딩이라 캐포비 Checkbox(15px/radius2)와 같은 화면에서 달라 보였음. 이제 Checkbox/Input/Button 의 토큰·brand cascade·a11y 를 그대로 물려받아 자동 일관.
- 전체선택이 부분 선택 상태에서 indeterminate 로 표시되는 UX 개선.
- Public props/이벤트 변화 없음(`options`/`value`/`onValueChange` 등 동일). 내부 DOM·클래스만 변경 — `nds-multi-select__option-check`/`__option-label`/`__footer-button` 클래스 제거.
