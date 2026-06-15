---
"@nudge-design/mcp": patch
---

캐포비 본인인증 패턴 가이드 신설 + 품질점수 감점 근거 세분화

- **pattern:cashwalk-biz-verification 신설** — VerificationCodeInput 가이드가 참조하던 패턴이
  실제로 없어(404) AI 가 인증 폼을 즉흥 합성하던 공백을 채움. 정규 레시피 명문화: 코드 입력은
  `nds-verification-code-input`(일반 `nds-input` 금지), 전송/재전송은 full-width 검정 버튼 하나,
  남은시간 타이머는 앱 합성 인라인 요소, 확정은 하단 CTA(별도 "인증하기" 버튼 안 둠),
  에러는 비어있지 않은 message 의 `nds-notice-alert`, 성공 체크는 DS 아이콘(원·체크 같은 색의
  invisible hand-roll SVG 금지).
- **score_mockup_quality 감점 근거 세분화** — 차원별 감점 사유에 발생 횟수 + 줄 위치(line a, b…)를
  붙이고 잦은 사유부터 정렬. 점수만 보고 "어디를 왜 깎였나" 모르던 문제(특히 SPA 누적집계)를
  줄 위치로 짚어줌.
