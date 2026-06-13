---
"@nudge-design/react": patch
"@nudge-design/html": patch
---

접근성 보강 — clickable Card 키보드 지원 · BottomSheet 포커스 복원

- Card: `clickable` 카드가 키보드로 접근 가능해짐 (`role="button"` + `tabIndex=0` + Enter/Space 클릭). html 미러(nds-card)에는 이미 있던 동작을 react 가 따라잡음.
- BottomSheet: 닫힐 때 열기 전 포커스 위치(트리거 버튼 등)로 복원. Modal 과 동일한 패턴을 react·html 양쪽에 미러.
