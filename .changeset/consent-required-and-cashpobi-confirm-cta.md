---
"@nudge-design/tokens": patch
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

약관동의 [필수] 자동 강조 · 캐포비 모달/팝업 검정 CTA 회귀(노랑) 정착 · 온보딩 풀폭 CTA 게이트

세 가지 반복 피드백을 DS 근본에서 닫는다.

- **약관동의 [필수] 강조 누락(반복)** — CheckboxGroup 이 `badge` 에 "필수" 가 들어있으면 `required` 를 따로 안 붙여도 자동으로 빨강+bold 강조하도록 했다(react/html 미러). 그동안 `required` opt-in 을 매번 누락해 회색으로 나오던 footgun 제거. 끄려면 `required={false}` 명시.

- **캐포비 모달/팝업 버튼이 노랑(반복)** — 모달/팝업 confirm 버튼 색을 `[data-brand="cashwalk-biz"]` CSS 캐스케이드 대신 신규 `--semantic-confirm-cta-*` 토큰으로 흐르게 바꿨다. 기존 캐스케이드는 `data-brand` 속성을 쓰지 않는 standalone 목업(브랜드 `:root` 교체식)에서 안 걸려 base 의 brand 노랑이 새던 회귀의 원인이었다. 토큰은 목업·Storybook 양쪽에 적용되고, base 는 각 브랜드 brand 색을 참조하므로 캐포비만 검정(#111)으로 override 된다(타 브랜드 무영향).

- **온보딩 단일 CTA 가 좁게(반복)** — 온보딩 주 CTA(Primary solid)에 full-width 가 없으면 `validate_html_mockup` 이 `onboarding-cta-not-fullwidth` error 로 막는다. 작성자가 모달 단일버튼(우측 hug)과 혼동하던 회귀 차단. 가이드(pattern:cashwalk-biz-page-onboarding)도 명시 강화.
