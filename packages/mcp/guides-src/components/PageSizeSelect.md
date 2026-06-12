---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-30014
---

## summary

리포트/리스트 표 하단 우측의 "한 페이지 행 수" 선택 드롭다운("100개씩 보기"). Pagination 과 짝(같은 가로 줄, 좌 Pagination / 우 PageSizeSelect). 내부적으로 Select(auto 폭) 재사용. HTML 은 nds-select 에 "N개씩 보기" 라벨 옵션으로 구성. **옵션은 10 / 30 / 50 / 100개씩 보기 4종 권장**(캐포비 admin 폭 152·높이 48 — Dropdown 기본 240 에서 너비만 축소). 값 변경 시 **page=1 로 리셋 + 데이터 재조회**. Figma PaginationGuide 4118-1186.

## pitfalls

- Pagination(페이지 이동)과 혼동하지 말 것 — PageSizeSelect 는 행 수만 바꾼다(둘은 보통 같은 줄 좌/우).
- 값 변경 시 1페이지로 리셋하지 않으면 현재 페이지가 범위를 벗어날 수 있음 — onValueChange 에서 page=1 처리.
- HTML 목업에서는 전용 태그가 없다 — nds-select 에 {30,50,100} 옵션 + label 'N개씩 보기' 로 만든다(React 만 <PageSizeSelect>).

## examplesHtml.do

```html
<!-- HTML: nds-select 로 구성 -->
<nds-select value="100" options='[{"value":"10","label":"10개씩 보기"},{"value":"30","label":"30개씩 보기"},{"value":"50","label":"50개씩 보기"},{"value":"100","label":"100개씩 보기"}]'></nds-select>
<!-- React -->
<!-- <PageSizeSelect value={pageSize} onValueChange={setPageSize} /> -->
```

## examplesHtml.dont

```html
<!-- 페이지 이동을 PageSizeSelect 로 흉내내지 말 것 — Pagination 사용 -->
```
