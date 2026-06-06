---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

Toast ↔ Snackbar 의미 재정리 — "인터랙션 있는 알림은 자동으로 사라지면 안 된다"를 기준으로 역할을 갈랐다.

- **Toast = 인터랙션 없는 일시 메시지** 전용으로 축소. 자동으로 사라지므로 `action`(되돌리기/다시시도)·닫기 버튼·캐포비 흰 카드 chrome 을 제거했다. **`ToastData.action` 제거(breaking)** — `toast(msg, { action })` 를 쓰던 곳은 Snackbar 로 옮겨야 한다. 남은 책임: message + variant(default/success/error/warning/info) + 자동닫힘 + multi-stack.
- **Snackbar = 액션/닫기가 있는 카드형 알림**으로 확장. 인라인(`<Snackbar>`, 부모가 표시 통제)에 더해 **`Snackbar.Provider` + `useSnackbar()`** 인프라를 신설 — 포지셔닝(top/bottom/top-right) · 자동닫힘 · 단일 교체(maxCount=1) · 스택을 DS 가 관리한다. HTML 미러로 **`<nds-snackbar-host>`** 매니저 신설(+ 누락돼 있던 `<nds-snackbar>` export 복구).
- **캐포비 admin 흰 카드 알림(구 Toast) → Snackbar 로 이관.** Default/Success/Error/Warning/Info 5개 state 의 흰 카드 외형(흰 배경 + 그림자 + radius 8) · status 칩 아이콘(24) · 닫기 X · 우측 상단 고정 · 단일 교체를 `data-brand="cashwalk-biz"` cascade + `brand="cashwalk-biz"`(칩 아이콘 렌더)로 Snackbar 가 직접 렌더한다(이전엔 호스트 커스텀 렌더 필요). variant 색은 인라인 style 대신 CSS(`data-variant`)로 옮겨 브랜드 카드 cascade 가 배경을 덮을 수 있게 했다.

MCP 가이드(`COMPONENT_GUIDES.Toast`/`Snackbar`) 의미·캐포비 brand spec(matrixOverrides) 을 Snackbar 로 이관, Storybook 스토리(Snackbar 에 Provider·캐포비·인터랙션 테스트 추가 / Toast 에서 action·캐포비 스토리 제거) · AllComponents 설명 · componentInventory 동기화.
