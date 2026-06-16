---
"@nudge-design/icons": patch
---

지니어트 아이콘 전수 갱신/추가 — Figma 지니어트 Library export

다색 변형(arrow·calendar·bottomnavi on/off·G배지)은 **블랙/대표 1종만** `currentColor` mono 로, 그라디언트·컬러 일러스트는 색 보존 multicolor 로 임포트.

- **mono(currentColor)**: `geniet-chevron-left/up/down`·`geniet-arrow-right-line`·`geniet-calendar`·`geniet-coupon`·`geniet-star`·`geniet-heart-solid`·`geniet-shoe-solid`·`geniet-basket`·`geniet-eye-off`·`geniet-gpoint-badge`·`geniet-nav-home/write/review/community/shopping` (흰색 디테일 보존)
- **multicolor**: `geniet-gpoint`(mint→currentColor)·`geniet-clover`·`geniet-lottomachine`·`geniet-moneypouch`·`geniet-shoe`·`geniet-quiz`·`geniet-invite`·`geniet-ticket`·`geniet-scale`
- **생성기 수정**: `svgToComponent` 가 소스 viewBox 보존(기존 24×24 하드코딩) — 비-24 아이콘(체중계·쿠폰·바텀네비·invite 등) 잘림 해결. 그라디언트 `stop-color`→`stopColor` 등 React 속성 변환 추가.
