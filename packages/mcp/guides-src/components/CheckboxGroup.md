---
{}
---

## summary

체크박스 묶음. 두 모드 — **items(데이터 모드)**: value/onValueChange 로 선택 관리 + `select-all`(자식 비율로 indeterminate 자동) + `badge`(필수/선택 등)·`detail`(펼침) 슬롯. **children(레이아웃 모드)**: 직접 조립한 nds-checkbox 들을 배치만. '전체선택 + 체크 리스트'(다중 필터·설정 묶음 등)의 단일 컴포넌트. antd Checkbox.Group 대응. **약관/개인정보 동의 화면은 전용 component:Agreement 사용** — CheckboxGroup 으로 조립하지 않는다.

## pitfalls

- items 모드 value 는 controlled — `nds-checkbox-group-change`(React onValueChange)로만 갱신. **전체선택은 자식 선택 비율로 자동 파생**(checked/indeterminate/unchecked) — 직접 손계산하지 말 것.
- 약관/개인정보 **동의 화면은 전용 component:Agreement 사용** — 필수/선택 badge·전체동의·detail 펼침·pre-tick 금지(개인정보보호법)·필수 미동의 가드를 컴포넌트가 보장한다. CheckboxGroup 으로 consent 를 조립하지 말 것(중복·가드 누락 위험).
- **계층(시/도 ▸ 시/군구) 선택은 CheckboxGroup 이 아니라 component:CheckboxTree** (부모 indeterminate 자동·접기/펼치기).
- 닫힌 드롭다운 + 검색 + 적용 버튼 형태의 필터는 component:MultiSelect — CheckboxGroup 은 항상 펼쳐진 인라인 리스트.
- `badge` 는 도메인 중립 슬롯([필수]/[선택]/NEW). **badge 텍스트에 "필수" 가 들어있으면 컴포넌트가 자동으로 강조(빨강+bold)** 한다 — `required` 를 따로 안 붙여도 [필수] 는 강조된다. 자동 강조를 끄려면 `required={false}`(React) / `"required":false`(items JSON) 를 명시. NEW 등 다른 강조색이 필요하면 호출부에서 직접.

## examplesHtml.do

```html
<nds-checkbox-group select-all select-all-label="전체 선택" value='[]'
  items='[{"value":"stress","label":"스트레스 관리"},{"value":"sleep","label":"수면"},{"value":"relation","label":"관계"}]'></nds-checkbox-group>
<script>el.addEventListener("nds-checkbox-group-change", e => setTopics(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 계층(시/도▸시군구)을 CheckboxGroup 으로 — CheckboxTree 가 맞음 -->
<nds-checkbox-group items='[{"value":"gangwon","label":"강원도"}]'></nds-checkbox-group>
<!-- 선택 항목 pre-tick (위법) — 초기 value 는 빈 배열 -->
<nds-checkbox-group select-all value='["marketing"]' items='[…]'></nds-checkbox-group>
```
