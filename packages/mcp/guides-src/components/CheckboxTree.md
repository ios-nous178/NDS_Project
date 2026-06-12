---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-50785
---

## summary

검색은 기본 활성화지만 옵션인 전체선택 + 계층(시/도 ▸ 시/군/구) 체크박스 트리. 부모는 하위 leaf 선택 비율에 따라 checked / indeterminate / unchecked 를 **자동** 표시하고, 부모 클릭은 하위 leaf 전체를 on/off. value 는 **선택된 leaf 값**만 담는다(부모는 파생). 캐포비 지역 선택 모달 좌측(3001:50785).

## pitfalls

- **평면(계층 없음) 다중선택이면 MultiSelect**, 즉시 반영 단일선택이면 Select — CheckboxTree 는 부모/자식 트리 전용.
- value 에 부모 값을 넣지 말 것 — 선택은 leaf 값만. 부모 checked/indeterminate 는 자식 비율로 컴포넌트가 계산한다.
- '선택한 항목' 요약 패널은 CheckboxTree 안에 없음 — `SelectedItemsPanel` + `SelectedItemRow` 로 오른쪽에 따로 조립(시/도 전체 선택이면 시/도명만, 일부면 '시/도 > 시/군구'). component:SelectedItemsPanel. RegionRow 는 하위호환 alias.
- 검색은 기본 노출이지만 필요 없으면 `searchable={false}` 로 숨길 수 있다. 검색이 켜져 있으면 매치된 노드의 부모를 자동 펼침 — 펼침 상태를 직접 강제하지 말 것.
- 빈 결과는 자동 빈 상태('검색 결과가 없습니다.').
- 전체선택은 **현재 검색 필터된** leaf 기준으로 토글된다(전체 목록 아님). MultiSelect 와 동일 규칙.
- 들여쓰기는 `--nds-checkbox-tree-indent`(기본 32px) × depth 자동 — 행마다 padding 을 손대지 말 것. 스크롤 높이는 `--nds-checkbox-tree-max-height`.

## examplesHtml.do

```html
<nds-checkbox-tree search-placeholder="소재명으로 검색하기" value='["gangneung"]' default-expanded='["gangwon"]'
  nodes='[{"value":"gangwon","label":"강원도특별자치도","children":[{"value":"gangneung","label":"강릉시"},{"value":"donghae","label":"동해시"}]}]'></nds-checkbox-tree>
<script>el.addEventListener("nds-checkbox-tree-change", e => setRegions(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 계층 없는 평면 다중선택을 CheckboxTree 로 — MultiSelect 가 맞음 -->
<nds-checkbox-tree nodes='[{"value":"a","label":"옵션 A"},{"value":"b","label":"옵션 B"}]'></nds-checkbox-tree>
<!-- value 에 부모 값 주입 — leaf 만 담아야 함 -->
<nds-checkbox-tree value='["gangwon"]'></nds-checkbox-tree>
```
