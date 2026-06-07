---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/mcp": patch
---

계층 체크박스 트리 `CheckboxTree` 신설 + `Checkbox` 부분선택(indeterminate) 확장 — Figma 캐포비 Library 지역 선택 모달(3001:50785) 정합.

신규 컴포넌트:

- **CheckboxTree** (`nds-checkbox-tree`) — 검색 + 전체선택 + 계층(시/도 ▸ 시/군/구) 체크박스 트리. 부모는 하위 leaf 선택 비율에 따라 checked / indeterminate / unchecked 를 **자동** 표시하고, 부모 클릭은 하위 leaf 전체를 on/off. `value` 는 선택된 **leaf 값**만 담는다(부모는 파생). 검색 시 매치 부모 자동 펼침, 빈 결과 자동 빈 상태. 들여쓰기 `--nds-checkbox-tree-indent`(32px) × depth, 스크롤 높이 `--nds-checkbox-tree-max-height`.

기존 컴포넌트 보강:

- **Checkbox** — `indeterminate` prop 추가(HTML `indeterminate` attr). '일부 자식만 선택됨'(부모/전체선택 행)을 옐로우 마이너스로 표시. 네이티브 `input.indeterminate` 동기화 + `aria-checked="mixed"`. 클릭 시 네이티브와 동일하게 `checked=true` 로 전이.

조립 메모:

- "선택한 지역" 요약(오른쪽 패널)은 기존 **SelectedItemsPanel** + **RegionRow** 재사용 — CheckboxTree 는 좌측 트리(선택 상태)만 책임. 둘을 합치면 캐포비 지역 선택 모달 전체가 됨(별도 RegionPicker 컴포넌트 미신설).
- 평면 다중선택은 MultiSelect, 즉시 단일선택은 Select — 역할 분리 유지.
- MultiSelect 통합(공통 검색/전체선택 코어 추출)은 후속 작업으로 보류.

MCP 가이드(get_guide)에 `COMPONENT_GUIDES.CheckboxTree` 추가 + `Checkbox` 가이드 indeterminate 갱신. Storybook 스토리(지역 선택 모달 데모 + interaction test) · AllComponents 카탈로그 · componentInventory 엔트리 추가.
