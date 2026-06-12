---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-30014
---

## summary

캐포비 어드민 통계/집계 리포트 표 — 회색 헤더 + 가는 그리드 + 병합셀(rowspan/colspan) + 합계행(굵게). 2단 **그룹 슈퍼헤더**(예: "남성"이 10대~60대 하위열을 colspan 으로 묶음)와 **가로 스크롤 + 좌측열 고정** 지원. native <table class="nds-stats-table"> 구조형 컴포넌트. 동적 정렬·모바일 카드뷰는 DataTable 사용. Figma 퀴즈 통계(3001:47404)·인구통계별 리포트(3001:30014).

## pitfalls

- **병합셀은 native rowspan/colspan** — 합계행(`총합`)은 라벨이 앞 2열을 `colspan="2"` 로 병합, 그룹행(`알 수 없음`/`NN대`)은 첫 열을 `rowspan="2"` 로 병합(남/여 2행). DataTable 의 columns/data 로는 표현 불가.
- **그룹 슈퍼헤더(2단 헤더)** — `<thead>` 에 2개의 `<tr>`: 첫 행은 `<th rowspan="2">날짜</th><th colspan="6" data-align="center">남성</th><th colspan="6" data-align="center">여성</th>`, 둘째 행은 하위열(10대~60대) 나열. 슈퍼헤더는 `data-align="center"`.
- **합계/요약 행 = `<tr class="is-summary">`** (또는 `data-summary`). 전체 셀 Bold + 강조색이 자동 적용 — 인라인 font-weight 금지.
- **열이 많아 가로로 넘치면** 표를 `<div class="nds-stats-table__scroll">` 로 감싼다(레이아웃 안 깨지고 표만 스크롤). React 는 `<StatsTable scroll>`.
- **좌측 라벨 열 고정** — `nds-stats-table--sticky-first` 클래스(React `stickyFirst`)로 첫 열을 스크롤 중 freeze. `scroll` 과 함께 사용.
- 셀 정렬은 `data-align="right"|"center"`. 기본 좌측(Figma 정합). 숫자는 자동 tabular-nums.
- 헤더/그리드 색은 토큰 자동(헤더 bg=surface.page, 보더=border subtle). raw hex 금지.
- 표는 plot/범례처럼 카드 외부 컨테이너(흰 라운드 박스 + 타이틀) 안에 배치 — nds-stats-table 은 표만 그림.
- **열 헤더 설명 툴팁(ⓘ)** — CTR/CPC/CPM 처럼 헤더에 설명이 필요하면 `<th>` 안에 component:Tooltip(nds-tooltip) 을 합성(`<th>CTR <nds-tooltip text="클릭률">ⓘ</nds-tooltip></th>`).
- 페이지가 나뉘는 긴 표는 표 아래에 component:Pagination(nds-pagination) + 행수 선택 component:PageSizeSelect 을 둘 것.

## recommended

- 집계/합계가 있는 리포트 표(통계 화면) = nds-stats-table + <tr class="is-summary">
- 와이드 인구통계 리포트(슈퍼헤더 + 가로 스크롤) = <div class="nds-stats-table__scroll"><table class="nds-stats-table nds-stats-table--sticky-first">
- 정렬·필터·페이지 인터랙션이 필요한 데이터 그리드 = DataTable
- React: <StatsTable scroll stickyFirst><thead/>…<tr className="is-summary"><td colSpan={2}>총합</td>…</StatsTable>

## examplesHtml.do

```html
<!-- 통계/집계 리포트 표 — 병합셀(rowspan/colspan) + 합계행. native table 에 class -->
<table class="nds-stats-table">
  <thead>
    <tr><th>연령</th><th>성별</th><th>당첨자 수</th><th>지급된 캐시</th></tr>
  </thead>
  <tbody>
    <tr class="is-summary"><td colspan="2">총합</td><td>999,999</td><td>999,999</td></tr>
    <tr><td rowspan="2">알 수 없음</td><td>남성</td><td>99</td><td>999</td></tr>
    <tr><td>여성</td><td>99</td><td>999</td></tr>
    <tr class="is-summary"><td colspan="2">알 수 없음 총합</td><td>999</td><td>99,999</td></tr>
  </tbody>
</table>
<!-- 표 아래 페이지네이션은 component:Pagination (nds-pagination) -->
```

## examplesHtml.dont

```html
<!-- 합계행/병합셀 리포트 표를 nds-data-table(columns/data API)로 억지로 만들지 말 것 — rowspan·합계행 표현 불가 -->
<nds-data-table columns='...' data='...'></nds-data-table>
<!-- 합계행을 굵게 하려고 인라인 style 로 font-weight 박지 말 것. <tr class="is-summary"> 사용 -->
<tr style="font-weight:bold"><td>총합</td>...</tr>
```
