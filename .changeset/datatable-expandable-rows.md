---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

`DataTable` 펼침/접힘(트리) 자식 행 지원 추가 — 캐포비 날짜별/광고별 리포트처럼 상위 행을 펼쳐 하위(캠페인·광고) 행을 보는 표를 columns/data API 그대로 그릴 수 있다 (TanStack 식 `getSubRows` 방식).

- `@nudge-design/react` — `getSubRows(row)` 로 자식 행 추출 시 [+]/[−] 토글 + depth 들여쓰기 자동. `expandedKeys`/`onExpandedChange`(controlled) · `defaultExpandedKeys`(uncontrolled) · `expanderColumnKey`(토글 컬럼, 기본 첫 컬럼). scroll·cards 모드 모두 지원.
- `@nudge-design/html` — `<nds-data-table sub-rows-key="subRows" expander-column="date">` 속성으로 동일 동작. 펼침 상태는 인스턴스 내부 유지.
- `@nudge-design/styles` — `nds-data-table__expander`/`__expand-cell`/`__expander-spacer` + depth 별 자식 행 배경.
- ⚠️ 펼침 사용 시 `rowKey`/`row-key` 는 인덱스가 아닌 행 고유값(자식 포함 유일)이어야 함.
- 표 하단 합계행이 같이 필요하면 `nds-stats-table`(`<tr class="is-summary">`)과 조합. MCP `COMPONENT_GUIDES.DataTable` + `cashwalk-biz-page-list` 패턴 갱신, Storybook 펼침 스토리 추가.
- 펼침 토글/하위 행 마커는 캐포비 Figma 아이콘 그대로 — 부모 `[+]`/`[−]`(04ic/open·close), 자식 `↳` 분기 화살표. 색은 currentColor 토큰 cascade.
- 기본 정렬을 **중앙**(헤더·셀 동일)으로, 셀 패딩을 **16px 고정(상하좌우)**으로 조정 — 행 높이는 내용에 따라 가변. 이미지/썸네일 등 큰 셀은 컬럼 `media` 플래그로 12px. 조밀한 표는 size='sm', 펼침 토글 컬럼은 좌측 고정.
- 펼침 표는 `table-layout:fixed`(data-expandable)로 컬럼 너비를 헤더 기준 고정 — 행 펼침 시 헤더 정렬이 흔들리지 않음. expander 토글↔콘텐츠 gap 확대.
