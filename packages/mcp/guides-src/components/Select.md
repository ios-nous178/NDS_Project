---
{}
---

## summary

드롭다운. options + value + onValueChange. 옵션이 많으면 `searchable`(검색형, Ant showSearch 모델)로 label 필터 — 단, 값은 항상 옵션 중에서만 선택된다(자유 입력 X).

## pitfalls

- **폭은 기본 전체너비(fullWidth/full-width=true)** — 폼/FormField 안에서 트리거가 100% 를 채운다(캐포비 어드민 폼 기본 규칙). 좁게 써야 하는 경우(어드민 검색 필터 등)에만 `full-width="false"`(React `fullWidth={false}`)를 명시. 드롭다운 메뉴 폭은 전체너비면 트리거 폭으로 고정, auto(좁은) 셀렉트는 가장 넓은 옵션까지 grow 후 캡(360px) — 캡/트리거폭에 닿으면 옵션 라벨이 줄바꿈 대신 말줄임. 메뉴를 트리거보다 임의로 넓게 만들지 말 것.
- 변경 핸들러는 **onValueChange** (onChange 아님). React 표준이 아닌 DS 컨벤션.
- **드롭다운 흉내 금지** — `<nds-button>` / raw `<button>` + ChevronRight/ChevronDown 아이콘 조합으로 드롭다운 모양만 따라 그리지 말 것. 키보드 탐색·focus trap·옵션 list a11y 가 전부 빠짐. 옵션이 1개라도 있으면 무조건 `<nds-select>` 또는 React `<Select>`. 'scope switcher / sort / filter' 같이 옵션이 동적이면 더더욱 raw button 금지.
- 옵션이 2-3 개의 토글성 선택지면 Tabs / Segment 도 고려 — Select 는 옵션 수가 많거나 라벨이 긴 경우.
- **Select(searchable) vs Autocomplete 구분** — 옵션 목록에서 *고르는* 검색은 `Select searchable`(값은 옵션으로 제약). 사용자가 *목록에 없는 값을 자유 입력*하거나 서버에서 비동기로 받은 제안을 보여주는 거면 Autocomplete. searchable 로 자유 입력을 흉내내지 말 것.
- `searchable` 검색 placeholder 는 `search-placeholder`(React `searchPlaceholder`), 결과 0건 문구는 `empty-message`(React `emptyMessage`).

## examplesHtml.do

```html
<nds-select value="kr" label="국가" placeholder="선택하세요">
  <nds-select-option value="kr">대한민국</nds-select-option>
  <nds-select-option value="jp" disabled>일본</nds-select-option>
</nds-select>
<script>sel.addEventListener("select-change", e => setCountry(e.detail.value));</script>
<!-- 옵션이 많으면 searchable(검색형, Ant showSearch 모델) — 값은 여전히 옵션 중에서만 선택 -->
<nds-select label="거주 지역" placeholder="선택" searchable search-placeholder="지역명으로 검색">
  <nds-select-option value="seoul">서울특별시</nds-select-option>
  <nds-select-option value="busan">부산광역시</nds-select-option>
</nds-select>
```

## examplesHtml.dont

```html
<!-- nds-select 안에 raw <option> -> 드롭다운이 렌더 안 됨 -->
<nds-select value="kr"><option value="kr">대한민국</option></nds-select>
<!-- 자유 입력(목록에 없는 값)이 필요한데 searchable 로 우회 — 그건 Autocomplete -->
<nds-select searchable>...직접 입력값 허용 의도...</nds-select>
```
