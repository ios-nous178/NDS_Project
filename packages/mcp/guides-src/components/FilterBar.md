---
references:
  - label: Tab vs Filter — 역할·배치·결정 트리 (DesignGuide)
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3544-206
    caption: FilterBar = 현재 view 안에서 조건 좁히기(다중 누적·쿼리 파라미터). Tab(view 전환)과 역할 구분. 배치 순서·결정 트리, 캐포비 admin 풀 스펙은 pattern:cashwalk-biz-tab.
    brand: cashwalk-biz
---

## summary

가로 필터 칩 그룹. 다중/단일 선택, 카운트, 자동 초기화. **FilterBar = 현재 view 안에서 데이터를 점진적으로 좁히기(날짜·키워드·상태 등 다중 조건 누적 · 쿼리 파라미터로 URL 유지)** — view 자체를 전환하는 **Tab** 과 역할이 다르다(상호 배타적 큰 분류는 Tab). 배치: 페이지 타이틀 → Tab → FilterBar → 데이터.

## pitfalls

- single은 라디오와 다름 — 같은 칩 다시 누르면 해제됨.
- 옵션 8개 이상이면 가로 스크롤. 데스크톱은 Tabs/Drawer 필터 검토.
- Tabs는 페이지/뷰 전환, FilterBar는 같은 리스트 안의 필터.
- **상호 배타적 큰 분류(진행중/종료 같은 view 전환)를 FilterBar 로 만들지 말 것 — Tab 사용.** 반대로 날짜 범위·키워드 같은 조건 좁히기를 Tab 으로 만들지 말 것 — FilterBar 사용. (결정 트리: view 바뀌면 Tab / 조건 누적이면 Filter / 2–7개 단일 선택이면 Radio·SelectionButtonGroup.)
- **배치**: 페이지 타이틀 → Tab → FilterBar → 데이터 영역. Filter 는 쿼리 파라미터로 누적돼 URL 공유 시에도 유지된다.
- **FilterBar 에 Primary CTA 외 다른 액션 버튼을 여러 개 두지 말 것 — CTA 는 1개만.** 필터 항목이 12개+ 면 별도 `[필터 더보기]` 모달로.
- 캐포비 admin 풀 스펙(Tab Underline/Box·치수·색)은 `pattern:cashwalk-biz-tab`. Figma DesignGuide/Tab 3544-206.

## recommended

- 콘텐츠 리스트: 다중 선택 + count
- 상담사 분야: single

## examplesHtml.do

```html
<nds-filter-bar
  options='[{"key":"new","label":"신규","count":5},{"key":"hot","label":"인기","count":12}]'
  value='["new"]' show-reset></nds-filter-bar>
<script>el.addEventListener("nds-filter-change", e => apply(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- options.key 누락 — change event 의 value 가 의미 없는 string -->
<nds-filter-bar options='[{"label":"신규"}]'></nds-filter-bar>
```
