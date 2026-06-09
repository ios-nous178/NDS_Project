---
"@nudge-design/styles": patch
"@nudge-design/react": patch
---

Modal: 닫기(X) 버튼을 타이틀 유무와 무관하게 항상 우측 정렬

타이틀이 없는 모달에서 헤더 스페이서가 함께 렌더되지 않아, `justify-content: space-between` 의 단독 자식이 된 닫기 버튼이 좌측으로 떨어지던 회귀를 고친다. 닫기 버튼에 `margin-left: auto` 를 주어 타이틀이 있을 땐 no-op(타이틀 flex:1 이 공간을 차지), 없을 땐 우측으로 밀어낸다. react/html 공용 CSS 라 양쪽에 동시 반영. 타이틀 없는 closable 스토리(CashwalkBiz ⑤)로 고정.
