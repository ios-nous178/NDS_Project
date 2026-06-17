---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4118-1186
---

## summary

리스트가 한 화면을 넘을 때 페이지 단위로 끊어 보기. 무한 스크롤이 적절한 경우(피드/리뷰) 에는 사용 안 함.

## pitfalls

- 전체 페이지 수 5 이하 / 항목 30 이하면 Pagination 자체가 과한 UI — 한 페이지로 노출.
- show-arrows 와 siblings 를 둘 다 끄면 현재 페이지 ±1 만 보여 탐색이 끊김.
- PaginationChange 이벤트 처리 없이 page attribute 만 바꿔도 데이터 fetch 가 안 일어남 — 이벤트 핸들러에서 fetch 호출.
- 캐포비(data-brand="cashwalk-biz")에서는 각 페이지/화살표가 개별 보더 박스(radius 4, 34h) + 활성 페이지가 검정 채움으로 자동 렌더된다(cascade). markup/attribute 는 base 와 동일 — 박스 모양을 흉내내려 직접 div/border 를 짜지 말 것.
- 런마일(data-brand="runmile")에서는 페이지 칩이 **24×24·radius 6**, **active = gray800(#4E5968) 채움 + 흰 텍스트 bold**(brand 주황 아님), **inactive = gray800 텍스트(medium 500)**, 이전/다음 **화살표 20×20 gray600(#8B95A1)** 으로 자동 렌더된다(cascade). PC 10페이지 / Mobile 5페이지 노출(넘으면 `siblings` 로 압축). markup/attribute 는 base 와 동일 — 직접 박스를 짜지 말 것. (Figma 런마일 PaginationGuide 5055:29)
- 총 데이터 0건이면 Pagination 자체를 숨길 것(렌더하지 않음). 총 1페이지면 PageItem 1개 + Prev/Next disabled.
- Prev/Next 가 끝(1페이지·마지막페이지)에 도달하면 활성으로 두지 말고 disabled — 캐포비는 흐림이 아니라 옅은 회색 박스로 표시된다.
- **URL 쿼리 파라미터로 상태 관리 (새로고침·공유 시 보존)** (Figma PaginationGuide 4118-1186): 페이지 번호와 노출 개수는 URL 쿼리로 관리한다. 페이지 번호 클릭 → `?page=N`, Prev/Next → `?page=N±1`, PageSizeSelect 변경 → `?size=N&page=1`(노출 개수 변경 시 **반드시 page=1 로 리셋** — 현재 페이지 유지하면 범위를 벗어난 빈 페이지로 갈 수 있음). 모든 트리거는 데이터 재조회를 동반.
- **총 페이지 8개+ 면 생략(…) 압축 표시 검토** — `siblings` 로 현재 페이지 주변만 펼치고 양 끝/말줄임으로 압축.
- **배치**: 리스트 페이지 **우하단 고정**, 좌측 페이지 클러스터 + 우측 PageSizeSelect 를 같은 가로 줄(FilterBar 와 동일 정렬)로 둔다. 리스트 페이지마다 다른 Pagination 디자인을 쓰지 말 것(전 페이지 통일).
- **노출 개수 조절은 PageSizeSelect(Dropdown) 로 통일** — Toggle/Radio 등 다른 컴포넌트로 행 수를 바꾸지 말 것. 현재 페이지 active 시각 표시(검정 채움)를 빠뜨리지 말 것.

## examplesHtml.do

```html
<nds-pagination page="1" total-pages="10" siblings="2" show-arrows></nds-pagination>
<script>el.addEventListener("pagination-change", e => loadPage(e.detail.page));</script>
<!-- 한 페이지 행 수 선택은 component:PageSizeSelect — 보통 표 하단 우측 -->
<!-- 캐포비 박스형은 <html data-brand="cashwalk-biz"> 만 박혀 있으면 자동 적용 -->
```

## examplesHtml.dont

```html
<!-- siblings 0 + arrows 없음 — 옆 페이지가 보이지 않음 -->
<nds-pagination page="1" total-pages="10" siblings="0"></nds-pagination>
```
