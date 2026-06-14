---
"@nudge-design/html": patch
---

html Button·Snackbar 색 드리프트 수정 (react 미러 정합)

react↔html 색맵을 손으로 복제하다 두 면이 어긋나 있던 실버그 2건을 react(SSOT)에 재싱크:

- **Button**: html `nds-button.styles.ts` 의 styleMap 이 옛 generic 토큰에 머물러, react 가
  이전한 전용 `--semantic-button-*` 토큰과 달랐다. outlined-neutral 라벨색이 캐포비
  (#333→#111)·런마일(#333D4B→#4E5968)에서, primary solid 배경/hover·disabled 텍스트가
  react 와 다르게 렌더되던 것을 정합(Button API 변화 없음 — 색 토큰만 정정).
- **Snackbar**: html 이 variant 색을 브랜드-override 슬롯 ①(`--nds-snackbar-bg`)에 inline 으로
  써서, 캐포비 "흰 카드" 브랜드 override 를 html 에서만 덮어버리던 버그 수정. react 처럼
  `data-variant` 만 set 하고 색은 styles `[data-variant]` 가 합성하게 정리.
