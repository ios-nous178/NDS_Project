---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/tokens": minor
"@nudge-design/mcp": patch
---

캐포비 admin Input/Form 카탈로그 보강 — Figma 캐포비 Library InputGuide(3080:741) 정합.

신규:

- **FormSection** (`nds-form-section`) — 제목(Headline3 24 Bold) + 보더 카드(radius 16 cascade · border #EEE · 좌우 padding 24)로 여러 `FormField` 를 묶는 폼 그룹 컨테이너. 세로 리듬은 자식 `FormField density="admin"`(py-24) 이 만든다. react + styles + html 3면 미러. (Figma FormSection 3466:17405)
- **SelectionButton** (`nds-selection-button`) — 단일 선택 버튼 standalone export. 그룹과 동일한 `nds-selection-button-group__item` 비주얼 공유(브랜드색 아웃라인 + selected 채움). `SelectionButtonGroup` 도 내부적으로 이 컴포넌트를 재사용하도록 정리. (Figma SelectionButton 3549:703)
- **Field Width 스케일** — `sizing.fieldWidth` 토큰(xs 120 / sm 200 / md 304 / lg 400 / xl 488) 신설 + `fieldWidth` prop 을 `Input`·`Select` 에 추가(React `fieldWidth="md"` / HTML `field-width="md"`, full=100%). 인라인 width 대신 6단계 스케일로 통일. (Figma Field Width 3897:1578)

문서:

- MCP `cashwalk-biz-input` 가이드에 FormSection 컴포넌트·실제 `fieldWidth` prop·SelectionButton 단독·ActionChip 아이콘(slot/icon) 반영. figmaNodeUrl 을 InputGuide 루트(3080-741)로 갱신.
- Storybook `FormSection` 스토리 + AllComponents 카탈로그(FormSection · SelectionButton · 아이콘 동반 ActionChip) 엔트리 추가.

ActionChip 은 이미 `icon` prop(React)·`slot="icon"`(HTML)을 지원 — 예시/가이드에서 아이콘 사용을 명시적으로 노출. 더해서 14px 박스에서 얇은 스트로크 아이콘(InfoIcon 등)이 연하게 보이던 문제를 고침: `__icon` 색을 `iconRole.normal`(#666) → `iconRole.strong`(#333)으로, 슬롯 SVG 가 박스를 꽉 채우도록 `__icon > svg { width/height:100% }` 추가(HTML `slot="icon"` 로 넣은 find_icon SVG 도 안정 렌더).
