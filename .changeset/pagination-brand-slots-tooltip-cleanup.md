---
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/tokens": patch
---

Pagination boxed re-skin → 토큰 슬롯 + Tooltip 캐포비 rich-compact 분기 제거

- **Pagination**: 캐포비 boxed 페이지네이션(테두리 박스·active 검정·boxed disabled)을 `[data-brand]` cascade → 브랜드 슬롯(`components.pagination`)으로 이전. base(다른 브랜드)는 테두리 없는 투명 버튼(fallback). 렌더 동일.
- **Tooltip**: 캐포비 리치-compact `[data-brand]` 분기 제거 — 긴 본문(3줄+)은 가이드상 Modal/Notice 로 분리하므로 툴팁 전용 compact 타이포/여백 분기 불필요. 배경(#333)은 기존 `--nds-tooltip-bg` 슬롯 그대로.
