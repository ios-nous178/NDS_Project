---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

`sizing.input.field` 44 → 48 정렬.

기존 `field`(44)는 실사용처·Figma 근거 없는 고아 값이었고, `button.field`(48)와 이름은 같은데 높이가 달라 폼에서 버튼↔인풋이 4px 어긋나는 함정이었음. 이제 `field` = 폼 행 표준 높이(48)로 Button/Input 일관. (`input.field` 는 `default`(48)와 height 동일, labelGap 8 vs 12 만 차이. `input.compact`(40)·`fieldWidth` 는 유지.)
