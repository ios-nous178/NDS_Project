---
{}
---

## summary

검색어 입력 + debounce + clear. dropdown suggestion 이 필요하면 nds-autocomplete 사용.

## pitfalls

- debounce 0 으로 매 keystroke 마다 fetch — 백엔드 부하 / UI flicker. 200-400ms 권장.
- min-query-length 미설정 — 1글자 입력에 즉시 fetch 가 일어남.
- 검색 결과 dropdown 이 필요한데 nds-input + 자체 panel 로 흉내 — nds-autocomplete 로 일원화.

## examplesHtml.do

```html
<nds-search-input placeholder="검색어 입력" label="상담사 찾기" debounce="300" min-query-length="2" clearable></nds-search-input>
<script>el.addEventListener("search-input", e => fetch(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- debounce 없음 + min-query-length 없음 — 매 keystroke fetch -->
<nds-search-input placeholder="검색"></nds-search-input>
```
