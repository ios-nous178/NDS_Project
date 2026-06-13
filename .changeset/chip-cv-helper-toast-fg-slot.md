---
"@nudge-design/react": patch
"@nudge-design/html": patch
---

Chip 색 맵 cv.* 통일 + Toast fg 슬롯 대칭

- **Chip.tsx**: `FILL/OUTLINED/GHOST_COLORS` 맵이 raw `var(--semantic-*)` 문자열 + `#ffffff` fallback 을 쓰던 것을 `cv.*` 헬퍼로 통일(Button.tsx styleMap 과 동일 규약 — 타입 세이프·오타 방지). 값은 전부 동일(각 `cv.*` 가 같은 `--semantic-*` 로 해석). `FILL.brand.text` 는 대비 안전을 위해 `cv.button.textDefault` 유지(캐포비 노랑 fill 위 흰 글자 회귀 방지). status fill/border 일부는 전용 토큰 부재로 bg/text 토큰 사용 — 사유 인라인 주석으로 박제.
- **Toast**: `--nds-toast-fg` 슬롯 신설(텍스트색 하드코딩 → 슬롯). `--nds-toast-bg` 와 대칭 + Snackbar(`--nds-snackbar-fg`) 패리티. 브랜드가 밝은 toast 배경을 줄 때 글자색도 override 가능.
