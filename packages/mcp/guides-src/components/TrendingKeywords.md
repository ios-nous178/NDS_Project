---
{}
---

## summary

급상승 검색어 / 핫 키워드 표시. 마케팅/검색 화면에서 사용. 정량 데이터 기반인지 확인 후 사용.

## pitfalls

- 큐레이션된 키워드를 'TRENDING' 으로 노출 — 사용자가 알고리즘 결과로 오해.
- 키워드 10개 초과 — 시각 노이즈. top 5 권장.
- 공감/안전 도메인(자해/우울)에선 사용 금지 — 검색어 자체가 트리거가 될 수 있음.

## examplesHtml.do

```html
<nds-trending-keywords
  items='[{"rank":1,"trend":"up","keyword":"불면증"},{"rank":2,"trend":"new","keyword":"번아웃"}]'
  header-title="인기 검색어" timestamp="오늘 09:00 기준"></nds-trending-keywords>
<script>el.addEventListener("nds-trending-keyword-click", e => search(e.detail.keyword));</script>
```

## examplesHtml.dont

```html
<!-- 자해 / 위기 도메인에서 사용 — 검색어 자체가 트리거 가능 -->
<nds-trending-keywords items='[{"rank":1,"keyword":"자해"}]'></nds-trending-keywords>
```
