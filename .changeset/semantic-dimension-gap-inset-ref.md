---
"@nudge-design/tokens": minor
---

Semantic Dimension — gap/inset/gap-title 를 spacing primitive 의 ref alias 로 승격 + Figma 레이어 분리

여백 토큰(gap·inset·gap-title)을 색 시멘틱과 동일한 3-tier 모델로 끌어올렸습니다.

- **ref-carrying 승격**: `gap`·`inset`·`gapTitle` leaf 가 spacing primitive 를 가리키는 ref 가 됩니다 (`gap.default → spacing.10`). 색 시멘틱이 `ref("color.…")` 로 primitive 를 가리키던 것과 동일. `ref` 경로에 `spacing.*` 추가.
- **CSS 값 동결**: `--semantic-gap-*` / `--semantic-inset-*` / `--semantic-gap-title-*` 출력 px 는 그대로(generate-css 가 ref → 해석된 px). 기존 CSS 소비처는 무영향.
- **Figma 레이어 분리**: 새 **"Semantic Dimension"** 변수 컬렉션 신설 — gap/inset/gap-title 이 primitive **Dimension**(spacing·radius·stroke 램프)을 alias 로 가리킵니다. 더 이상 한 컬렉션에 뒤섞이지 않습니다. 플러그인 시각 가이드도 "Semantic Dimension" 섹션 분리.
- **색 외 토큰도 Figma 로**: figma-variables.json 에 `semanticDimensions` 컬렉션 추가(brand=mode, 프로젝트 override 도 alias).

> 주의: `gap`·`inset`·`gapTitle` JS export 는 이제 emitter-전용 ref 객체입니다(색 시멘틱 트리와 동일 모델). 여백 값은 항상 `var(--semantic-gap-*)` 등 CSS 변수로 참조하세요 — JS 에서 숫자로 직접 읽지 마세요.
