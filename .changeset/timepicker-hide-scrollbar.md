---
"@nudge-design/react": patch
"@nudge-design/styles": patch
---

TimePicker 시/분 선택 컬럼의 스크롤바 UI 제거. 스크롤 기능(`overflow-y: auto`)은 유지하되 스크롤바만 숨김(`scrollbar-width: none` + `-ms-overflow-style: none` + `::-webkit-scrollbar { display: none }`) — 좁은 시간 선택 패널의 시각 정돈.
