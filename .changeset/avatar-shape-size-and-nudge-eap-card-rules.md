---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/styles": minor
"@nudge-design/mcp": patch
---

Avatar Shape 3종 + 가이드 사이즈 정합 · 넛지EAP Card 규칙 패턴

**Avatar (Figma 1337:8 정합)** — `shape` prop 신규(circle 기본 · rounded · square, 사이즈별 rounded radius 4/6/8/10/12) + 사이즈 스케일을 가이드 5종(24/32/48/64/96)에 맞춤. 키 API 는 유지(xs/sm/md/lg/xl)하되 픽셀값을 가이드에 정합 — **md 40→48 · lg 48→64 · xl 64→96 으로 변경**(xs 24·sm 32 동일). 이미지 부재 fallback 은 이니셜 **1자 Bold**(기존 2자→1자). AvatarGroup 도 동일 스케일·shape 전파(px/font 는 `avatarSizeConfig` 에서 파생해 중복 하드코딩 제거). 프로덕션 DS 컴포넌트는 Avatar 를 슬롯(ReactNode)으로 받으므로 사이즈 변경의 직접 영향 없음 — 앱에서 `size="md/lg/xl"` 를 픽셀 의도로 쓰던 곳은 새 스케일 확인 필요.

**Card (Figma 713:2 — 넛지EAP CardRulesGuide)** — `pattern:nudge-eap-card` 신규: 넛지EAP 서비스 카드는 ① 내부 CTA 허용(4종: Full-width 48 / Compact 40 / Icon+Text 44 / Ghost), ② shadow 금지·border-only, ③ radius 12 고정. 기존 `component:Card` 가이드의 "[Figma 권위 룰]"(CTA 금지·Elevation 0/1)은 Geniet 도메인 기준임을 명시하는 브랜드 분기 캐비엇 추가(컴포넌트는 Card.Cta/Footer 슬롯으로 양쪽 모두 지원 — 차이는 사용 규칙).
