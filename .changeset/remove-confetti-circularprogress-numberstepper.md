---
"@nudge-design/react": patch
"@nudge-design/html": patch
---

Confetti · CircularProgress · NumberStepper 컴포넌트 제거

세 컴포넌트를 DS 에서 완전히 제거했습니다(react + html 미러 + 스타일 + 스토리 + MCP 가이드 + 인벤토리). Figma 디자인 근거(가이드 노드)가 없고 앱/목업에서 실제 사용처가 없어 카탈로그를 슬림하게 유지하기 위해 정리했습니다.

- 제거된 export: `Confetti` / `CircularProgress` / `NumberStepper` (및 `NdsConfetti` / `NdsCircularProgress` / `NdsNumberStepper`, 타입 `NumberStepperSize`). 제거 전 외부 사용처는 없었습니다.
- 대체: 수량 +/- 입력은 `AmountInput`, 가로 진행도는 `ProgressBar`, 단계 분류 점수는 `ScoreGauge` 를 사용하세요. (Confetti 의 직접 대체는 없습니다.)
