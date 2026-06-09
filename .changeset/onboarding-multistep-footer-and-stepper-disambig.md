---
"@nudge-design/mcp": patch
---

온보딩 멀티스텝 푸터(이전+제출) 지원 · 스텝퍼/수량스텝퍼 구분 또렷이

- **온보딩 멀티스텝 푸터** — 가입 심사처럼 [이전 단계]+[제출]이 있는 멀티스텝 온보딩은 버튼을 카드 안이 아니라 **카드 아래 분리된 캔버스 푸터**(좌 [이전 단계] outlined hug + 우 [제출] primary solid hug)에 둔다. `validate_html_mockup` 의 `onboarding-cta-not-fullwidth`(단일 액션 CTA full-width 강제) 룰이 이전버튼 존재를 감지해 멀티스텝 제출의 hug 를 **면제**하도록 고쳤다(직전 릴리즈의 오탐 회귀 해소). 이전버튼이 카드 안에 있으면 `onboarding-back-button-inside-card` warn. 온보딩 가이드에 단일 액션 vs 멀티스텝 두 레이아웃을 명시.

- **Stepper / NumberStepper 구분** — '지금 몇 단계인지 보여주는 진행 표시'는 `Stepper`(component:Stepper), '폼 안에서 숫자를 +/- 로 올리는 입력 칸'은 `NumberStepper`(component:NumberStepper). 이름이 비슷해 혼동되던 둘을 양쪽 가이드 summary 에 상호 결정 한 줄로 또렷이 했다.
