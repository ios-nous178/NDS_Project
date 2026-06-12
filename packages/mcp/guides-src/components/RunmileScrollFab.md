---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://www.figma.com/design/udH9ME1HnHk4kbxR17Neig/?node-id=520-3221
---

## summary

**미구현 — Figma SSOT 등록만.** Runmile 스크롤 탑/바텀 FAB. state=top|bottom × device=pc|mo 4가지 (pc 60×60, mo 52×52). 구현은 별도 PR.

## pitfalls

- 현재 React/HTML 컴포넌트 없음. top FAB 와 bottom FAB 가 하나의 컴포넌트인지 (direction prop) 둘로 분리인지 (RunmileScrollTopFab / RunmileScrollBottomFab) 는 구현 시 결정.
- pc/mo 사이즈 차이는 컨테이너 폭으로 분기하기보다 device prop 으로 명시 추천 — Figma variant 와 1:1.
