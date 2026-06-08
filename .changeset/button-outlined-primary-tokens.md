---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

Button Outlined/Primary 보더·텍스트를 전용 button-outlined 토큰으로 배선 + 캐포비 색 교정 (Figma ButtonGuide 3098:1179/1190).

- **버그**: Button `primary.outlined` 가 `cv.borderRole.brand`/`cv.textRole.brand`(generic brand 역할)을 직참조해, 전용 `--semantic-button-border-outlined-*`/`-text-brand` 토큰을 무시하고 있었음. 그래서 캐포비 outline primary 가 brand 노랑(#FFD200 보더 / #FEAF01 텍스트)으로 잘못 렌더됐고, geniet 도 의도값(#00A8AC) 대신 brand(#48C2C5)로 렌더됨.
- **수정(배선)**: react Button + html nds-button 의 `primary.outlined` enabled/hover/disabled 를 `cv.button.bgOutlined(/Hover/Disabled)` · `cv.button.textBrand` · `cv.button.borderOutlined(/Hover/Disabled)` 로 전환. 두 면 미러 동일.
- **수정(캐포비 값)**: `buttonBorder.outlined.default`/`.hover` 와 `buttonText.brand` 를 `yellow → neutral[900] #111` 로 교정. Figma: Outlined/Primary = 흰 bg + **검정(#111) 보더·텍스트**, hover 는 보더/텍스트 #111 유지 + bg 만 `#FFFEF5` 틴트. (bg·disabled 보더(#E7E7E7)는 기존값이 이미 정확.)
- 결과: nudge/trost/runmile 무변화(전용 토큰이 이미 brand색), geniet 은 의도값 #00A8AC 로 교정, **캐포비 outline primary = 검정(#111)**.
- **추가 교정 — 캐포비 Solid/Neutral**: `buttonBg.secondary.default` `#000000 → neutral[900] #111` (Figma 3098:1095 = neutral/900, 순수 검정 아님). hover #333·disabled #DDD 은 기존값 일치.
