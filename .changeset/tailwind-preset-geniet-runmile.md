---
"@nudge-design/tailwind-preset": minor
---

geniet·runmile Tailwind preset 신설 — 5 브랜드 모두 preset 제공

`genietPreset`·`runmilePreset` 를 추가해 trost·cashwalk-biz 와 동일하게 브랜드 고유 토큰을
Tailwind theme 로 매핑한다:

- atomic palette alias — geniet: `mint`·`purple`·`geniet-neutral|gray|red|yellow|blue|green`,
  runmile: `orange`·`runmile-neutral|gray|red|blue`
- 전용 radius (geniet 곡률 `xl=18`·`2xl=23`, runmile Toss 스타일 `4/6/8/12/16/pill`),
  typography(typeScale), shadow

그동안 두 브랜드는 시멘틱 CSS var(`bg-brand` 등)만 공유돼 색은 렌더됐지만 brand atomic
alias·전용 radius 가 빠져 있었다. 시멘틱 클래스는 종전대로 각 브랜드 `.css` 가 같은 var 를
redefine 하므로 자동 반영된다. (참고: `tailwind-preset` 은 fixed 그룹이라 react·tokens·styles·
html 도 같은 버전으로 함께 올라간다.)
