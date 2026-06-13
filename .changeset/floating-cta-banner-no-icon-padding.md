---
"@nudge-design/react": patch
"@nudge-design/styles": patch
"@nudge-design/html": patch
---

FloatingCtaBanner — 아이콘 없을 때 좌우 패딩 보정

leadingIcon 이 없는 배너에서 좌측 패딩이 아이콘 기준(작은 값)으로 남아 텍스트가 pill 모서리에 붙던 문제를 고쳤습니다. 루트에 `data-has-icon` 을 부여하고, 아이콘이 없으면 좌우 패딩을 대칭으로 넓힙니다(PC 28 / Mobile 20). 아이콘이 있는 배너의 패딩은 그대로입니다. react·html 미러 동일 적용.
