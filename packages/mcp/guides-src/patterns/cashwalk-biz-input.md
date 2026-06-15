---
metrics:
  components: TextInput · TextField · Dropdown · DateInput · Textarea · Checkbox · SelectionButton · SelectionButtonGroup · ImageUpload · ActionChip · SelectedItemsPanel · FormSection
  defaultStates: default / typing / error / disabled / complete
  focusBorder: "#111111 (Neutral/900, 검정)"
  fieldWidth: "6단계 — xs 120 / sm 200 / md 304(default) / lg 400 / xl 488 / full 100%. DS: `sizing.fieldWidth` 토큰 + `fieldWidth` prop(Input·Select) / `field-width` 속성(nds-input·nds-select). 폼 일반=md, 모달 메인=lg, Textarea=full."
  relatedPatterns: cashwalk-biz-button, dropdown, cashwalk-biz-form-layout
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3080-741
---

## summary

캐시워크 포 비즈니스 admin 의 Input/Form 컴포넌트 카탈로그. 11 컴포넌트 · 5 상태 (Default/Typing/Error/Disabled/Complete).

## rules

- TextInput (5 states · DS `Input`), TextField (Label+Input+Helper · DS `FormField`, 5 states), Dropdown (Default/Hover/Active/Error/Disabled + Expanded 메뉴 · DS `Select`), DateInput (5 states · DS `DatePicker`), Textarea (5 states), Checkbox (4 variants), SelectionButton(단독 · DS `SelectionButton`)/SelectionButtonGroup (선택 버튼 · FormField 교체), ImageUpload (Empty/Uploaded/Error), ActionChip (helper 옆 보조 액션), SelectedItemsPanel (선택 항목 슬롯 패널 + SelectedItemRow), FormSection (제목 + 보더 카드로 FormField 묶음 · DS `FormSection`).
- **FormSection** = 제목(Headline3 24 Bold) + 보더 카드(radius 16 cascade · border #EEE · 좌우 padding 24)로 여러 `FormField` 를 묶는 폼 그룹. 마크업: `<nds-form-section title="기본 정보"><nds-form-field density="admin" label-position="left">…</nds-form-field></nds-form-section>`. 세로 리듬은 자식 `FormField density="admin"`(py-24) 이 만든다 — FormSection 에 따로 py 주지 말 것. radius·색은 `data-brand="cashwalk-biz"` cascade.
- Input/Border/Focus 는 ★ Neutral/900 (#111111) 검정 — 다른 브랜드(brand 색 focus) 와 달리 캐시워크 포 비즈니스 admin 은 검정 outline.
- Input/BG/Disabled = Neutral/50 (#FAFAFA), Input/Border/Default = Neutral/200 (#EEEEEE).
- 입력 타이포는 **Input Typography 표준(Figma 4247:1964 · 브랜드 무관)** — 라벨 13/18 Medium · 값/placeholder 15/22 Regular · 헬퍼/에러 13/18 Regular. 옛 캐포비 전용 "표준/좁은공간(14·15)" 분기는 폐지하고 `--semantic-input-typography-*` 토큰으로 통일(캐포비도 동일 값). DateInput(DatePicker·DateRangePicker)·TimePicker 트리거는 value 토큰으로 통일. Dropdown(Select) 트리거·옵션은 옛 캐포비 dense 14/20 → 15/22 (브랜드 폰트 override 제거, base body2 cascade). 모두 브랜드 무관 15/22.
- Dropdown 선택(Selected) 항목은 ★ 회색 배경(Section #F5F5F5) + Strong 텍스트 + Medium 500 + 우측 체크 — 다른 브랜드의 brand-tint 선택과 다름. 메뉴 항목 radius 6 / inset 패딩.
- Checkbox 의 'on-green' SVG 가 별도 — success 표시(이미 처리 완료) 의미. 일반 checked 와 구분.
- ImageUpload 는 캐시워크 포 비즈니스 admin 표준 — Empty/Uploaded/Error 3 상태. user-app 의 ImageUpload 와 별도 컴포넌트로 취급.
- Input focus 는 brand 색(노랑) 이 아니라 검정 outline. 가이드 명시.
- ActionChip 은 TextField 의 helper text 영역 옆에 배치 — 별도 row 가 아니라 inline. radius 6 / bg #ECECEC. **아이콘+라벨**(예시 이미지/수정/다운로드): React `icon` prop / HTML `slot="icon"` 으로 14px 아이콘을 라벨 앞에 — 아이콘 없이 라벨만 두지 말 것(Figma 3종 모두 아이콘 동반).
- SelectedItemsPanel 헤더 = 선택 해제(기본) + 추가 선택(옵션 onAdd) — **피커 모달 안에서는 추가 선택 빼고 선택 해제만**(HTML `hide-add` / React onAdd 미전달). 추가 선택은 모달 밖에서만, secondary Button + plus 아이콘. count 는 text.brand 강조. 본문은 SelectedItemRow 리스트 등으로 swap.
- **Field Width — 입력 필드 가로 너비 6단계 스케일** (TextInput·Dropdown·DateInput·Selection 등 모든 입력 공통, 컨테이너 안에서는 **항상 px 고정값**): XSmall **120px**(field-width-xs · 코드·짧은 ID·숫자, 예 사업자번호 토큰) · Small **200px**(field-width-sm · 단일 키워드 검색·Filter Dropdown·페이지네이션 옆 셀렉트) · **Medium 304px(field-width-md, default — 폼 내부 일반 입력 이메일·이름·계정명, 가장 흔함)** · Large **400px**(field-width-lg · 모달 내부 메인 입력·단독 검색바) · XLarge **488px**(field-width-xl · 와이드 페이지 필터·상세 폼 강조) · Full **100%**(field-width-full · Textarea·반응형 폼). 같은 행에 여러 input 이면 같은 사이즈로 통일. 관측 정규화: Dropdown 105/164/222 → Small(200)·Medium(304), 모달 명/번호 input ~396 → Large(400), '100개씩 보기' 152 → Small(200). **DS 구현**: `sizing.fieldWidth` 토큰(SSOT) + `fieldWidth` prop — React `<Input fieldWidth="md">` / `<Select fieldWidth="sm">`, HTML `<nds-input field-width="md">` / `<nds-select field-width="sm">` (xs|sm|md|lg|xl|full). 인라인 width 박지 말고 이 prop 을 쓸 것. Figma InputGuide Field Width(3897-1578).

## avoid

- Input focus 를 노란색으로 바꾸지 말 것 — 가이드 위반.
- ImageUpload Error 상태에서 박스 자체를 빨갛게 칠하지 말 것 — border + helper text 로만 표현.
- 입력 필드 너비를 미지정(%/auto/fit-content/hug)으로 두거나 임의값(281·317·396 등)으로 — **Field Width 6단계(120/200/304/400/488/100%) 중 px 고정**으로. (반응형 컨테이너의 Full 100% 만 예외.) XSmall 120 미만·내용물에 맞춘 hug(placeholder 가림) 금지.
