---
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/tokens": patch
---

FormSection·Toggle 브랜드 분기 → 토큰 슬롯 이전

- **FormSection**: 캐포비 카드 radius 16 을 `[data-brand]` 블록 → `components["form-section"].radius` 로 이전(`--nds-form-section-radius`, 컴포넌트는 이미 슬롯 소비 중).
- **Toggle**: 캐포비 admin ON 트랙 초록 + 초록 트랙 위 라벨 흰색을 `[data-brand]` 블록 → `components.toggle.trackActiveBg`/`labelActiveColor` 로 이전(`--nds-toggle-track-active-bg`/`--nds-toggle-label-active-color`). disabled 회색은 cascade 그대로 유지.

렌더 동일(faithful refactor). 컴포넌트에서 `[data-brand]` 색 분기 제거 — CLAUDE.md 슬롯 합성 패턴 적용.
