---
"@nudge-design/tokens": patch
---

런마일 컴포넌트 — Figma 런마일 Library 가이드 반영 (버튼·카드)

- **버튼** (ButtonGuide 5124:390): Solid/Neutral = 검정(#221E1F) + 흰 텍스트(기존 gray200 오매핑 수정), 5사이즈 높이(Mini40/S44/M48/L52/XL56). Secondary tone 없음 — 검정/회색 CTA 는 `color="neutral"`(solid=검정 / soft=회색). `color="secondary"` 사용 시 dev 경고 + validator `brand-denied-button-color`(brand-profiles 에 runmile cta 정책 선언).
- **카드** (CardGuide 5117:130): 이벤트 카드는 DS 프리미티브 조합(Card + Badge + Chip + heart)인 앱 레벨 패턴 — 가이드에 anatomy·사이즈·3 ComponentSet 문서화(새 variant 아님). shell radius 12 동일.
- 함께 묶인 런마일 컴포넌트 토큰 오버라이드: Tab(active 검정) · Pagination(24·radius6·화살표) · Snackbar(다크 토스트 슬롯).
