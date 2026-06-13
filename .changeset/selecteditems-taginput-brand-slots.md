---
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/tokens": patch
---

SelectedItemsPanel·TagInput 브랜드 색/radius 분기 → 토큰 슬롯 이전

캐포비 admin 의 색·radius `[data-brand]` 분기를 브랜드 슬롯으로 이전(렌더 동일). 삭제 글리프(원형 serchdelete `::before`)는 *요소 교체=구조적*이라 `[data-brand]` 유지.

- **SelectedItemsPanel**: 행 gray fill + radius 10 → `components["selected-item-row"].bg/radius` (`--nds-selected-item-row-bg/radius`).
- **TagInput**: add 버튼 neutral 색(Secondary tone 부재) + stacked 태그 gray fill/radius → `components["tag-input"].addBg/addColor/stackedBg/stackedRadius`.
