---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3555-703
---

## summary

폼 내 상호 배타적 옵션의 단일 선택 (권장 2~3개). 브랜드색 아웃라인의 개별 버튼을 gap 으로 나열 — FormField ContentSlot 에 교체. 선택 시 brand-subtle 배경 + brand 보더 + 굵은 텍스트.

## pitfalls

- Tab variant='segment' 와 혼동 — segment 는 연결된 회색 트랙(뷰/상태 전환), SelectionButtonGroup 은 폼 입력(개별 브랜드색 버튼). 폼 안 단일선택이면 이 컴포넌트.
- 옵션 4개 이상 — 가로 폭 부족. Select 또는 SelectionCard 사용.
- 라벨+설명+아이콘이 필요한 카드형 선택 — SelectionCard 가 적합.
- 선택색을 hex 로 박지 말 것 — selected 는 --semantic-bg-brand-subtle / --semantic-border-brand-default 캐스케이드로 5개 브랜드 자동 대응.
- **그룹 내 옵션은 등폭이 기본** — '전체'(좁음)/'특정 지역'(넓음)처럼 라벨 길이가 달라도 컴포넌트가 가장 넓은 옵션 기준으로 자동 균등하게 그린다(손으로 width 박지 말 것). 한 화면에서 같은 성격의 그룹은 너비를 통일. 컨테이너 100% 로 늘리려면 fullWidth/full-width.
- **'특정 X'(특정 지역/연령/카테고리) 선택 시 노출되는 '선택 결과'를 또 다른 SelectionButton·노란 outlined 칩으로 그리지 말 것** — 결과 컴포넌트는 따로다: ① 소수 고정 선택지(연령대 6~7개)는 **toggle Chip**(`<nds-chip selected>` — **선택표시 기본 = 브랜드 채움(solid fill)**. ✓ 체크/좌측 도트는 옵션: React `icon` prop, HTML 은 `<nds-chip selected><svg slot='icon'>…</svg>30대</nds-chip>`. 채움 대신 brand-subtle 등 부드러운 선택 톤을 원하면 hex 박지 말고 `--nds-chip-selected-background/text/border` override) 한 묶음, ② 동적 다중 선택(지역·카테고리처럼 picker 로 추가)은 **`SelectedItemsPanel` + `SelectedItemRow`**(회색 패널 안 추가 버튼 → 추가하면 SelectedItemRow 누적, 개별 제거 X). 특히 **선택한 항목을 노란 outlined 칩으로 인라인 나열 = 회귀(SelectionButton 과 시각적으로 동일해 혼동)** — get_guide({ topic:'component:SelectedItemsPanel' }) 의 SelectedItemRow 사용. 캐포비 타겟팅 폼 SSOT: Figma 3001:49174.

## examplesHtml.do

```html
<nds-selection-button-group value="always" options='[{"value":"always","label":"항상"},{"value":"time","label":"특정 시간만"},{"value":"weekday","label":"특정 요일/시간만"}]'></nds-selection-button-group>
<script>el.addEventListener("selection-button-change", e => setSchedule(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 뷰 전환에 SelectionButtonGroup — 폼 입력 컴포넌트라 위계가 어색. Tab variant=segment 사용 -->
<nds-selection-button-group options='[{"value":"list","label":"목록"},{"value":"grid","label":"그리드"}]'></nds-selection-button-group>
```
