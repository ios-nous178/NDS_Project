---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

Input 비밀번호 표시/숨김 토글 내장 (auth/로그인 화면용).

- `type="password"` 면 우측에 눈 아이콘 토글이 **자동** 노출 — 클릭 시 평문↔비밀 전환. 아이콘은 DS `eye`/`eye-off` 와 동일 path, `currentColor`(muted→hover strong) cascade.
- `passwordToggle={false}` (HTML `password-toggle="false"`) 로 끌 수 있음. password 가 아닌 type 은 무시.
- 접근성: 토글 버튼에 `aria-pressed` + "비밀번호 표시/숨기기" `aria-label`, `mousedown` preventDefault 로 입력 포커스 유지.
- react `Input`(+ `InputPasswordToggle` compound) / html `<nds-input type="password">` 미러, `@nudge-design/styles` `.nds-input__password-toggle` 블록 추가.
- 이전엔 suffix 슬롯에 eye 버튼 + type 상태를 매번 손조립해야 했음 → 내장으로 대체.
