---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4123-1406
---

## summary

검색 + 전체선택/해제 + 체크박스 리스트 + 취소/적용 푸터 + 빈 상태를 가진 다중 선택 필터 드롭다운(MultiSelectDropdown · 392px 패널). 일반 Select(단일·즉시 반영)와 달리 패널 안 초안을 편집하고 **적용** 시에만 반영. 리포트 상단 '광고 다중 선택' 등 필터. **옵션 8~30개 + 평면 구조**에 적합 — 30개+ 또는 계층 구조면 pattern:cashwalk-biz-selection-pattern 의 Modal Picker(CheckboxTree). 컴포넌트 SSOT Figma 4123-1406, 사용 맥락 캐포비 광고별 리포트 3001:28554.

## pitfalls

- **단일 선택이면 Select** — MultiSelect 는 적용 버튼이 있는 다중 필터 전용. 즉시 반영 단일 드롭다운에 쓰면 과함.
- 적용(apply) 전까지 onValueChange 가 발화하지 않음 — 취소/바깥클릭은 초안 폐기. value(적용값)와 패널 내 draft 를 혼동하지 말 것.
- 검색 결과 0건이면 자동으로 빈 상태('검색 결과가 없습니다.') 노출 — 직접 그리지 말 것.
- 전체선택/해제는 **현재 검색 필터된 항목** 기준으로 토글된다(전체 목록 아님).
- 여러 필터를 한 줄에 둘 때는 component:FilterBar(칩 토글)가 아니라 SearchInput/Select/DateRangePicker/MultiSelect 를 가로로 조합 — FilterBar 는 카테고리 칩 전용.
- **패널 내부 구조는 컴포넌트가 고정**(Figma 4123-1406): 상단 검색(테두리 인셋 TextInput) → 전체선택 행(배경 surface.subtle · 라벨 16/medium · 우측 'N개 선택') → 옵션 행(44h) → **우측 hug 푸터([취소] neutral outlined + [적용] neutral solid 검정)**. 푸터를 풀폭 split 으로 그리거나 적용 버튼을 secondary/노랑으로 바꾸지 말 것 — 캐포비 검정 CTA = neutral.

## examplesHtml.do

```html
<nds-multi-select placeholder="모든 광고" search-placeholder="광고명으로 검색" value='[]'
  options='[{"value":"a","label":"캠페인 A 타겟팅"},{"value":"b","label":"캠페인 B 리타겟"}]'></nds-multi-select>
<script>el.addEventListener("nds-multi-select-change", e => filterByAds(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 단일 선택에 MultiSelect — 적용 버튼이 불필요한 마찰. nds-select 사용 -->
<nds-multi-select options='[{"value":"asc","label":"오름차순"},{"value":"desc","label":"내림차순"}]'></nds-multi-select>
```
