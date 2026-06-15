---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

지니어트 Toggle·Tab·Pagination·Control 컴포넌트 정합 — Figma Library 가이드

브랜드 토큰 슬롯으로만 반영(컴포넌트 브랜드 분기 없음, 타 브랜드는 기존값 유지).

- **Toggle/Control (171:9904)**: 토글 트랙 40×24 → **51×31**, 썸 27·여백 2·이동 20. checkcircle/radio **24×24** (off=gray, on=brand mint). Radio 에 `--nds-radio-size` 슬롯 신설(기본 20px).
- **Tab (3132:94585)**: Chip 스타일 active = **흑백 #111**(`--nds-tab-chip-selected-bg` → bg-inverse). Underline 은 tone=color 로 mint(시멘틱 자동).
- **Pagination (3216:1930)**: active 페이지 = **흑백 #111** + radius 4 + cell 28, 화살표 아이콘 **24×24 gray/600**. Pagination 에 `--nds-pagination-arrow-size/-color` 슬롯 신설(기본 16px·subtle).
