---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/mcp": patch
---

ConsentChecklist `전체 동의` 부분선택 indeterminate — CheckboxTree 전체선택과 동일 패턴으로 통일.

- 일부 항목만 체크되면 `전체 동의` 박스가 옐로우 **마이너스(indeterminate)** 로 표시되고,
  클릭하면 전체 체크로 전이된다(기존엔 부분선택이 그냥 빈 체크로 보였음). native
  `input.indeterminate` + `aria-checked="mixed"` 동기화. react/styles(`nds-consent`)/html 3면 미러.
- "전체선택 체크박스가 자식 선택 비율로 checked/indeterminate/unchecked 파생 + 클릭 시
  자식 전체 토글" 패턴을 CheckboxTree 와 ConsentChecklist 가 공유하게 정렬.
- 개별 항목 박스는 그대로(checked/unchecked). MCP ConsentChecklist 가이드에 indeterminate
  명시 + 계층 선택은 CheckboxTree 로 안내. Storybook 부분선택 데모 + interaction test 추가.

지표 마크업 물리적 1벌 추출(Checkbox/CheckboxTree/ConsentChecklist/MultiSelect 4중복)과
MultiSelect 전용 스토리는 후속 작업.
