---
{}
---

## summary

가로 필터 칩 그룹. 다중/단일 선택, 카운트, 자동 초기화. Tabs(라우팅)와 분리 — FilterBar는 list 필터.

## pitfalls

- single은 라디오와 다름 — 같은 칩 다시 누르면 해제됨.
- 옵션 8개 이상이면 가로 스크롤. 데스크톱은 Tabs/Drawer 필터 검토.
- Tabs는 페이지/뷰 전환, FilterBar는 같은 리스트 안의 필터.

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
