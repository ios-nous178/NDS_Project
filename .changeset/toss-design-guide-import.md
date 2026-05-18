---
"@nudge-eap/mcp": patch
---

Toss 앱인토스 디자인 가이드와의 차이를 메우는 가이드 본문 보강. 외부 프로젝트가 MCP 로 받는 가이드 SSOT 변경.

- 신규 토픽 `get_guide({ topic: "ux-writing" })` — 해요체 / 능동형 / 긍정형 / 캐주얼 경어 / 명사+명사 풀어쓰기 5원칙 + 마이크로카피 룰 ("닫기 vs 취소", CTA 라벨, 에러 메시지, empty state) + EAP 멘탈케어 도메인 라이팅 룰 (위기·자해·진단 표현, 평가 어휘 회피, 사용자 동의 기반 표현, 익명성 안내, 검사 결과 라벨).
- 신규 패턴 `get_guide({ topic: "pattern:dark-patterns" })` — 진입 직후 시트 자동 노출 / 뒤로가기 인터럽트 / 거절 불가 CTA / 플로우 중간 전면 광고 / CTA 라벨 모호성. DESIGN_PRINCIPLES.bannedPatterns 에도 5개 키워드 추가 (`entry-bottomsheet`, `back-press-interrupt`, `no-decline-cta`, `mid-flow-interstitial`, `ambiguous-cta-label`).
- 기존 `pattern:cta-group` 본문에 라벨 명료성 룰 추가 — "버튼 라벨만 보고 다음 행동을 예측할 수 있어야 함", 다이얼로그 보조 버튼 라벨은 "닫기" (취소 금지), 거절 가능 옵션 최소 1개. metrics 에 `dialogLeftButtonLabel`, `minDeclineOptionsPerDialog` 추가.
- 외부 프로젝트가 받는 CLAUDE.md 본문 (사용자 앱 분기) 에 ux-writing / dark-patterns 호출 안내 한 줄 추가.
- 부수: `scripts/generate-component-inventory.mjs` 가 `docs/components/inventory.md` 를 `figmaSynced` 기준 2 섹션(정합 완료 / 미정합) 으로 분리 출력.
