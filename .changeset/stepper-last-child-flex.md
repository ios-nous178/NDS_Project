---
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

Stepper — 마지막 step 균등 간격 수정

마지막 step 의 `flex: 0 0 auto` 규칙을 제거해 모든 step 이 동일 폭(`flex: 1 1 0`)을 유지하도록 정정. connector 의 `calc(50% ± 18px)` 기하가 "모든 칸 동일 폭"을 전제하는데, 마지막 칸만 좁히면 마지막 원이 앞 원에 붙고 직전 connector 가 마지막 원을 지나쳐 overshoot 되던 회귀를 해소.
