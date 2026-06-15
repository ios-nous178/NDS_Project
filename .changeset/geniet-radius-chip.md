---
"@nudge-design/tokens": patch
---

지니어트 래디우스·칩 갱신 — Figma Library Radius/Badge&Chip 가이드 정합

- **Radius (3134:2)**: Shape 시멘틱 스케일로 표준화 — 구 Geniet 고유 곡률(xs:4·sm:6·xl:18·2xl:23) → none:0·xs:2·sm:4·md:8·lg:12·xl:16·2xl:24·pill:9999. 컴포넌트 매핑도 가이드대로: Card 8→12(LG)·Modal 8→16(XL)·Bottom Sheet 18→16(XL).
- **Badge & Chip (3058:84)**: Chip Selected 색을 가이드대로 환원 — Mint/50 bg + Mint/600 text(옅은 필터 칩). 직전 컬러 작업에서 mint/600 solid+흰 텍스트로 과교정했던 것을 바로잡음. (Chip 은 이미 Pill, Badge 는 시멘틱 슬롯 구동이라 토큰 변경 불필요.)
- **Border (3135:2)**: 변경 없음 — width(0/1/2)·stroke(none/default/focus)는 base 와 동일, border 색은 컬러 단계에서 이미 반영됨.
