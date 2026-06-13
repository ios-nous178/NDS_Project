---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

CountdownTimer 컴포넌트 제거 (강등) · PriceTag 간격 보정

- **CountdownTimer 제거 (BREAKING)** — 종료 시각 카운트다운은 DS 편입 기준(2+ 브랜드 사용 / Figma 가이드 노드)을 충족하지 못하고, 실사용은 인증 코드 입력 레시피 한 곳뿐이라 **앱이 합성하는 인라인 타이머 패턴**으로 강등했습니다. react `CountdownTimer`, html `nds-countdown-timer` 제거. 인증 폼에서 남은시간 표시가 필요하면 코드 입력 우측에 앱이 직접 인라인 요소(예: `<span>03:00</span>`, 브랜드색)를 겹쳐 배치하세요 — `get_guide({ topic: 'component:VerificationCodeInput' })` 의 레시피 참고.
- **PriceTag 간격 보정** — sm·lg 사이즈의 요소 간격이 좁아 보이던 문제를 보정(sm 4→6px, lg 10→12px, md는 유지). react·html 미러 동일 적용. 더불어 토큰값 gap 이 `var(--…)px` 로 깨져 lg 가 기본값으로 폴백되던 react 보간 버그를 함께 수정.
