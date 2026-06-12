---
{}
---

## summary

정렬·클릭·빈 상태·로딩·모바일 카드 변환에 더해 getSubRows(React)/sub-rows-key(HTML)로 펼침·접힘(트리) 자식 행까지 갖춘 표. 사용자 앱(약 복용 이력 등)과 운영툴·리포트 양쪽에 사용.

## pitfalls

- CMS/어드민은 antd Table을 우선 — DataTable은 사용자 앱(특히 모바일 cards 모드)에서 강점.
- columns[].key는 데이터 객체의 실제 key 또는 임의 식별자. render가 있으면 key 자체는 매핑 안 해도 됨.
- 정렬은 controlled — sortKey/sortDirection/onSort 셋을 부모에서 관리. 컴포넌트가 자체 정렬하지 않음.
- responsive="cards"는 max-width 640px에서만 카드로 전환. cardLabel/hideOnCard로 카드 모드 표시 조절.
- rowKey는 함수 — index 사용은 reorder 시 버그. 가능하면 row.id 같은 안정적 키.
- 펼침(getSubRows/sub-rows-key) 사용 시 rowKey/row-key 는 반드시 행 고유값(자식 포함 유일) — index 기반이면 접었다 펼 때 키가 흔들려 펼침 상태가 깨짐.
- 합계/병합셀(rowspan) 리포트 표는 여전히 nds-stats-table(`<tr class="is-summary">`). DataTable 펼침은 트리(자식 행)용 — 표 하단 합계행 렌더는 StatsTable 담당이며 둘을 조합한다.
- 정렬 = **헤더·셀 모두 중앙이 기본이자 표준**(캐포비 리스트 SSOT 3613-365). 엑셀처럼 컬럼마다 좌/우 정렬을 섞지 말 것 — 그냥 중앙으로 둔다. (펼침 토글 컬럼만 토글+들여쓰기 때문에 자동 좌측.) 셀 패딩은 **16px 고정(상하좌우)**이고 행 높이는 내용에 따라 가변 — 이미지/썸네일 등 큰 셀은 컬럼에 `media`(React)/`media:true`(HTML JSON) 로 12px. 조밀한 표는 size='sm'. 펼침 표는 컬럼 width 를 지정하면 table-layout:fixed 로 정렬이 안정적.

## recommended

- 사용자 앱 약 복용 이력: responsive="cards" + size="sm"
- 리스트가 길면 외부에 Pagination 컴포넌트와 조합
- 펼침 리포트(캐포비 날짜별/광고별 — 날짜 행 펼치면 캠페인·광고 자식 행): getSubRows(React) / sub-rows-key(HTML) + (옵션) defaultExpandedKeys·expandedKeys. expanderColumnKey/expander-column 로 토글 컬럼 지정(기본 첫 컬럼).

## interactivePattern

행 클릭으로 상세 진입. 정렬 가능 컬럼은 sortable: true 명시 + 외부에서 정렬 처리.

## examplesHtml.do

```html
<nds-data-table
  columns='[{"key":"name","title":"이름","sortable":true},{"key":"age","title":"나이"}]'
  data='[{"name":"홍길동","age":30}]'
  size="md" responsive="cards" row-clickable></nds-data-table>
<script>
el.addEventListener("nds-data-table-sort", e => sort(e.detail));
el.addEventListener("nds-data-table-row-click", e => openRow(e.detail.row));
</script>

<!-- 펼침(트리): sub-rows-key 로 자식 배열 필드 지정 -->
<nds-data-table row-key="id" sub-rows-key="subRows"
  columns='[{"key":"date","title":"날짜"},{"key":"spend","title":"소진액","align":"right"}]'
  data='[{"id":"d1","date":"2025-08-28","spend":"11,111","subRows":[{"id":"d1a","date":"2025-08-28","spend":"6,000"}]}]'></nds-data-table>
```

## examplesHtml.dont

```html
<!-- 어드민/CMS 페이지에 DataTable 사용 — 어드민은 antd Table -->
<nds-data-table columns='...'></nds-data-table>
```
