---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

OtpInput → **VerificationCodeInput** 개명 + 단일 코드 필드로 책임 정리.

- **개명(Breaking)**: `OtpInput` → `VerificationCodeInput`, 태그 `nds-otp-input` → `nds-verification-code-input`, 이벤트 `otp-change`/`otp-complete` → `code-change`/`code-complete`, 타입 `OtpInputProps` → `VerificationCodeInputProps`. "OTP"는 자리별 박스(= PinPad)를 연상시켜 단일 필드 컴포넌트엔 부적합 — "인증번호 입력 필드"임을 이름에 명시.
- **단일 코드 필드로 한정**: 웹용 단일 박스(자리별 세그먼트는 이미 제거됨)에 더해 **내장 카운트다운/재전송도 제거**. 이 컴포넌트는 코드 입력 필드만 책임진다. 타이머·재전송·확인 버튼이 함께 있는 인증 폼은 **FieldActionRow** 로 합성한다(타이머는 FieldActionRow 가 필드 안에 렌더, 버튼은 액션 슬롯) — OtpInput 타이머 ↔ FieldActionRow 타이머 중복 제거.
- **입력 토큰 정합**: resting border·placeholder 를 `cv.input.borderDefault`·`cv.input.placeholder` 로 통일(다른 input 계열과 동일 — 잠금으로 빠졌던 펜딩 해소).
- Storybook: 타이머/내장 카운트다운 레시피 → `Recipe/인증 폼 (FieldActionRow 합성)` 으로 대체. MCP `VerificationCodeInput` 가이드 + html 테스트 갱신.

마이그레이션: `<nds-otp-input>` → `<nds-verification-code-input>`, `import { OtpInput }` → `import { VerificationCodeInput }`, 이벤트 `otp-*` → `code-*`. 내장 타이머/재전송(`countdownSeconds`/`onResend`/`countdown-seconds`/`otp-resend`) 쓰던 곳은 `FieldActionRow` + `CountdownTimer` 합성으로 전환.
