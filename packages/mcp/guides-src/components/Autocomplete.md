---
{}
---

## summary

입력 + 드롭다운 추천(자유 입력 허용). SearchInput(자유 검색)과 Select(고정 목록)의 중간. 키보드 ↓↑/Enter/Esc 내장. ⚠️ 목록에서 *고르기만* 하면(자유 입력 불필요) `Select searchable` 이 맞다 — Autocomplete 는 값이 옵션에 없어도 되는 경우.

## pitfalls

- **Select searchable 과 구분** — 옵션 중 하나를 *선택*하는 검색이면 `Select searchable`(값이 옵션으로 제약). Autocomplete 는 자유 입력 + 비동기 제안용.
- options는 외부에서 필터링해 전달 — 컴포넌트가 자동 필터링하지 않음 (서버 검색을 위한 의도적 설계).
- onSelect 후 onValueChange(label)이 자동 호출됨. value를 다시 set하지 말 것 (이중 호출).
- minQueryLength=0으로 두면 빈 입력에서도 드롭다운이 열림. 추천 노출이 의도가 아니면 1+ 권장.
- options 수가 매우 많으면(50+) 가상 스크롤 별도 필요. 컴포넌트는 max-height 280px + scroll만 제공.

## recommended

- 약 검색: useMemo로 클라이언트 필터, description에 성분/용량
- 센터 검색: minQueryLength=2, 비동기 fetch + loading=isFetching
- 키워드 자동완성: highlight=true (기본), 결과 없을 때 emptyMessage 커스텀

## examplesHtml.do

```html
<nds-autocomplete placeholder="회사 검색"
  options='[{"value":"1","label":"카카오"},{"value":"2","label":"네이버"}]'
  min-query-length="1" highlight></nds-autocomplete>
<script>el.addEventListener("autocomplete-select", e => pick(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- options 를 단일 따옴표 없이 JSON.stringify 결과 그대로 — 따옴표 escape 가 깨짐 -->
<nds-autocomplete options="[{value:'1',label:'A'}]"></nds-autocomplete>
```
