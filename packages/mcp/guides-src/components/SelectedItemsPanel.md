---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3828-1577
sizeMatrix:
  panel: padding inset-modal · border border.normal · radius xl(16) · bg surface.subtle
  title: headline4 18/26 Bold · text.strong
  count: headline4 18/26 Bold · text.brand (강조 개수)
  actionPrimary: fill.neutral bg · text.inverse · radius md(8) · body3 Bold · + 아이콘 16
  actionGhost: transparent + border.strong · text.subtle · radius md(8) · refresh 아이콘 16
  body: flex column · gap 8 · overflow-y auto (max-height = --nds-selected-items-panel-body-max-height)
  selectedItemRow: "padding 8/12/8/16 · radius lg(12) · bg surface.section · label body1 · 삭제 X 20px. **캐포비(cashwalk-biz)**: bg gray/200(#eee) · radius 10 · 삭제 = 원형 serchdelete 아이콘 (Figma 3001:18463, data-brand cascade 자동)."
usagePolicy:
  useFor:
    - 캐시워크 포 비즈니스 admin 의 다중 선택 결과 패널 (선택한 항목/지역/카테고리/멤버 N개)
    - 선택 picker 와 짝을 이루는 '현재 선택' 요약 + 개별 제거
  doNotUseFor:
    - 단일 선택 — Select/Dropdown
    - 일반 정보 카드 — Card
    - 체크박스 목록 자체 — Checkbox 그룹
  limits:
    headerActions: 선택 해제(기본) + 추가 선택(옵션). 피커 모달 안 = 선택 해제만(HTML hide-add / React onAdd 미전달). 추가 선택 시각 = secondary Button + plus 아이콘.
    body: INSTANCE_SWAP 슬롯 (SelectedItemRow / 폼 / 테이블)
---

## summary

선택 항목 슬롯 패널 — 헤더(타이틀 + 강조 개수 + 선택 해제 + 옵션 추가 선택), 본문은 SelectedItemRow 리스트·폼·테이블 등으로 swap 하는 INSTANCE_SWAP 슬롯. 캐포비 admin 의 다중 선택 결과 패널. **피커 모달 안에서는 '선택 해제'만 노출(추가 선택 X)**. SelectedItemRow(라벨 + 삭제 X) 동봉, RegionRow 는 하위호환 alias.

## pitfalls

- **선택한 항목/지역/카테고리/멤버 등 '동적 다중 선택 결과'를 Chip/ActionChip 으로 인라인 나열 금지** — 노란 outlined 칩은 SelectionButton 과 시각적으로 같아 혼동되고, '추가 선택/선택 해제'·개수 강조·개별 제거 affordance 가 빠진다. 회색 `SelectedItemsPanel`(surface.subtle 패널) + `SelectedItemRow`(라벨 + 삭제 X) 로 그릴 것. 지역 picker 는 한 예시일 뿐이며, 그 경우에도 row 컴포넌트는 동일하다.
- 개수를 타이틀 문자열에 직접 넣지 말 것 — `count` prop/속성이 text.brand 색으로 강조 렌더. 타이틀은 명사만.
- 헤더 액션은 **선택 해제(onClear)** 가 기본이고 **추가 선택(onAdd)은 옵션** — 임의의 버튼을 헤더에 더 끼워넣지 말 것. **★ 피커 모달 우측 패널에서는 '추가 선택' 노출 금지 → 선택 해제만.** React 는 `onAdd` 미전달 시 자동 숨김이지만, **HTML 웹컴포넌트(`nds-selected-items-panel`)는 추가/해제 둘 다 기본 렌더라 모달에서는 `hide-add` 속성을 반드시 줘야 한다**(안 주면 모달 안에 '추가 선택'이 떠서 회귀). '추가 선택'은 모달 밖에서만 쓰며, 시각 스펙은 **secondary Button + plus(+) 아이콘**.
- **캐포비 admin 타겟팅에서 추가 경로(add 어포던스)는 하나만** — 패널 밖 별도 추가 버튼 + 패널 안 '추가 선택' 을 둘 다 두지 말 것(중복 UI, 회귀). 추가는 패널 onAdd(=모달 열기) 한 곳으로 통일하고, 그 클릭이 **2단 모달**(좌: 검색+체크박스 트리, 우: SelectedItemsPanel `hide-add` + 선택 해제, 풋터: full-width '적용')을 띄운다 — 모달이 안 뜨고 페이지에 인라인으로 또 그리면 안 된다. 캐포비 admin validator 에서만 `selected-item-add-affordance-duplicated` 로 막는다(다른 브랜드/표면 전역 룰 아님).
- **같은 항목을 패널에 중복 추가 금지** — 추가 시 이미 있으면 무시(유니크). 같은 항목이 두 줄 = 회귀(검증룰 selected-item-row-duplicated).
- 본문 항목 삭제는 SelectedItemRow 의 onRemove(또는 nds-selected-item-remove / nds-region-remove 이벤트)로 — 패널이 항목 상태를 들고 있지 않음(controlled). 호스트가 리스트를 갱신.
- 본문이 길어지면 화면을 덮지 않도록 `--nds-selected-items-panel-body-max-height` 로 스크롤 제한.
- SelectedItemRow 는 패널 전용 행 — 일반 리스트/태그 자리에는 ListItem/Chip 사용. **패널 밖 sibling 으로 SelectedItemRow 를 두지 말 것** — 추가분을 패널 다음에 append 하면 패널 body 의 flex gap(8)을 못 타서 행끼리 간격 없이 붙고 회색 패널 밖에 렌더된다(검증룰 selected-item-row-outside-panel).
- **(HTML) 항목 갱신 시 `panel.innerHTML = ''` 로 통째로 비우지 말 것** — 헤더(타이틀/개수/추가·해제 액션)는 컴포넌트가 mount 시 생성하는 chrome 이라 innerHTML 을 비우면 헤더까지 사라지고 자동 복구되지 않음(connectedCallback 재실행 안 함). 갱신은 ① body 의 `nds-selected-item-row` 자식만 교체(추가·제거)하거나 ② `<nds-selected-items-panel>` 엘리먼트 자체를 새로 만들어 통째 교체. 개수는 `count` 속성으로만 갱신.
- **(HTML) 이벤트(nds-selected-items-add/clear, nds-selected-item-remove, nds-region-remove)는 재렌더로 사라지지 않게 host(또는 상위 컨테이너)에 위임** — 행을 매번 새로 그리면 행에 직접 단 리스너는 유실됨. 부모에서 한 번만 바인딩하고 `e.target`/`closest('nds-selected-item-row, nds-region-row')` 로 분기.

## recommended

- 피커 모달 우측 패널(추가 선택 없음): <SelectedItemsPanel title="선택한 항목" count={items.length} onClear={clearAll}>{items.map(i => <SelectedItemRow key={i.id} onRemove={() => remove(i.id)}>{i.label}</SelectedItemRow>)}</SelectedItemsPanel> · HTML 은 <nds-selected-items-panel hide-add …>.
- 모달 밖 페이지/타겟팅 폼(추가 선택 있음): onAdd 추가 — <SelectedItemsPanel title="선택한 항목" count={items.length} onAdd={openPicker} onClear={clearAll}>…</SelectedItemsPanel>. onAdd 가 렌더하는 추가 버튼 = secondary + plus(+) 아이콘.
- 본문 swap: SelectedItemRow 리스트 대신 폼/데이터테이블을 children 으로 그대로 넣어도 됨.
- 액션 숨김: showActions={false} (읽기 전용 요약 패널).

## accessibility

- SelectedItemRow 삭제 버튼: `aria-label`(기본 '삭제') 자동 부착 — removeLabel 로 항목명 포함 권장.
- 헤더 액션은 native button — Tab/Enter/Space 자동.
- count 는 시각 강조용 — 스크린리더가 타이틀+개수를 순서대로 읽도록 같은 그룹에 배치.

## examplesHtml.do

```html
<nds-selected-items-panel panel-title="선택한 항목" count="2">
  <nds-selected-item-row>카테고리 &gt; 멤버 A</nds-selected-item-row>
  <nds-selected-item-row>카테고리 &gt; 멤버 B</nds-selected-item-row>
</nds-selected-items-panel>
<script>
  el.addEventListener("nds-selected-items-add", openPicker);
  el.addEventListener("nds-selected-items-clear", clearAll);
  el.addEventListener("nds-selected-item-remove", e => e.target.remove());
  el.addEventListener("nds-region-remove", e => e.target.remove());
</script>
```

## examplesHtml.dont

```html
<!-- count 를 직접 헤더 텍스트에 박지 말 것 — count 속성이 브랜드색 강조를 담당 -->
<nds-selected-items-panel panel-title="선택한 항목 2개"></nds-selected-items-panel>
```
