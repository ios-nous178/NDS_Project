---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

`CheckboxGroup` 범용화 — "전체선택 + 체크 리스트"를 한 컴포넌트로 (ConsentChecklist 흡수, antd Checkbox.Group 대응).

- **데이터 모드(`items`)** 추가 — `value`/`onValueChange` 로 선택 관리 + `selectAll`(자식 선택 비율로 checked/indeterminate/unchecked **자동 파생**) + `badge`([필수]/[선택]/NEW 도메인 중립 슬롯)·`detail`(약관 전문 등 펼침) + `expandable`. 각 행은 `Checkbox` 를 재사용(지표 단일 소스).
- **레이아웃 모드(`children`)** 기존 동작 그대로 — 직접 조립한 `<Checkbox>` 들을 vertical/horizontal + gap 배치. **하위호환**(기존 사용 안 깨짐).
- **HTML 미러 `nds-checkbox-group` 신설** — 데이터/레이아웃 모드 + `nds-checkbox-group-change` 이벤트. (이전엔 React 전용·레이아웃 전용이라 HTML 목업에서 못 썼음 → 이제 로직이 양쪽 코드에.)
- React 구현은 `Checkbox.tsx` 에서 `CheckboxGroup.tsx` 로 분리.

약관 동의·다중 필터·설정 묶음을 이 한 컴포넌트로 조립한다(동의 화면 법적 규칙은 `pattern:consent`). 계층(시/도▸시군구)은 `CheckboxTree`, 닫힌 드롭다운+적용 필터는 `MultiSelect`. MCP `COMPONENT_GUIDES.CheckboxGroup` 추가 + `pattern:consent` 가 이 컴포넌트를 가리키게 갱신. Storybook 스토리(레이아웃/데이터/전체선택/동의/interaction) · AllComponents · componentInventory 추가.

후속: ConsentChecklist 컴포넌트 실제 삭제는 composite-trim 릴리즈에 합류(이 컴포넌트로 대체됨).
