---
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/styles": patch
"@nudge-design/mcp": patch
---

캐포비 본인인증(휴대폰/이메일 → 인증번호) 플로우 구현 지원 — FieldActionRow action 옵션화 · CountdownTimer tone="brand"

캐포비 비밀번호 찾기 등 본인인증 화면(연락처 입력 → 별도 full-width 검정 [재전송] → 코드 입력 + 인라인 타이머 → 하단 [다음])을 DS 컴포넌트로 그대로 구현할 수 있게 두 군데 갭을 메웠다.

- **FieldActionRow `action` 옵션화** — 이제 action 을 생략하면 "코드 입력 + 우측 타이머만"(인라인 버튼 없는 줄)을 렌더한다. 인증번호 전송/재전송이 별도 full-width 버튼이고 코드 입력엔 타이머만 두는 캐포비 레이아웃을 직접 만들 수 있다. (react/html 미러)
- **CountdownTimer `tone="brand"`** — 진행 중 타이머를 브랜드 액센트색으로(캐포비 = 오렌지 #FD9B02, `text.brand` 토큰). 인증 코드 입력의 오렌지 타이머를 정확히 재현한다. urgent(≤10초) 빨강은 tone 과 무관하게 우선. (react/html/styles 미러)
- **가이드** — 온보딩 패턴에 "03c 본인 인증 Section" 추가, VerificationCodeInput 가이드에 캐포비 본인인증 레시피(별도 재전송 + 타이머만 코드 입력) 추가, FieldActionRow·CountdownTimer 가이드에 신규 옵션 반영.
