---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

NumericSpinner 신규 — `−` / 값 / `+` 정수 증감 입력

- `−`/값/`+` 으로 작은 정수(수량·회차·세트 수·인원)를 키보드 없이 조정. 가운데 값은 직접 입력·위/아래 화살표 키도 지원하고, `min`/`max` 도달 시 해당 버튼이 자동 비활성화된다.
- Props: `value` / `onValueChange` / `min` / `max` / `step`(기본 1) / `disabled` / `size`(medium·small). html 미러는 `<nds-numeric-spinner>` + `numeric-spinner-change` 이벤트.
- 혼동 주의: `Stepper`(단계 진행 표시기)·`AmountInput`(금액·천단위 콤마)와 역할이 다르다. 큰 수/금액은 AmountInput 을 쓴다.
- 색·치수는 전부 입력 계열 시멘틱 토큰 참조(raw hex 없음), 브랜드 override 슬롯 `--nds-numeric-spinner-*` 제공.
