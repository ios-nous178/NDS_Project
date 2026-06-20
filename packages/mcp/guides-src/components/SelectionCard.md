---
{}
---

## summary

카드형 단일/다중 선택지 (RadioCard/CheckboxCard 통합). compound — Group + Item. title/description 외에 **리치 중첩 콘텐츠**(Chip 행·bullet 리스트)를 React `children` / HTML `slot="content"` 로 카드 본문에 넣을 수 있음(캐포비 캠페인 목표 카드).

## pitfalls

- **카드형 단일선택을 손수 만들지 말 것** — `nds-selection-card`(mode='single')는 좌측 라디오 인디케이터(미선택=회색 링 / 선택=프로젝트 채움 도트)를 **내장**한다(showIndicator 기본 true). 커스텀 `<div>` 카드 + 수동 라디오 동그라미 div 로 재발명하면 도트가 빠지거나 토큰·포커스·a11y(role=radiogroup)가 어긋난다(회귀: 캐포비 '소진 방식/목표/유형' 카드에서 라디오 UI 누락 — '기준이 뭐냐'). 소진방식·목표·유형 등 설명 있는 카드형 단일선택은 전부 nds-selection-card 로.
- 라벨만 있는 단순 선택은 Radio/Checkbox를 쓸 것 — SelectionCard는 카드 단위(타이틀+설명+아이콘) 전제.
- mode='single'에서는 value/onValueChange, mode='multiple'에서는 values/onValuesChange. 헷갈리지 말 것.
- **카드 안에 Chip 행·bullet 같은 부가 내용**은 React `children`(Item 자식) / HTML `<div slot="content">` 로 — description 에 줄바꿈으로 욱여넣지 말 것.
- 옵션이 5개 이상이면서 라벨이 짧다면 Chip 토글 그룹이 더 컴팩트.
- horizontal 레이아웃은 옵션 3개 이하일 때만. 그 이상은 wrap돼서 어색해짐.

## recommended

- 상담 방식 선택: <SelectionCard.Group mode='single'> <Item value='chat' title='채팅' description='...' />
- 관심사 다중: mode='multiple', 카드마다 description으로 의미 보강
- 플랜 선택: icon prop으로 좌측 일러스트, title/description으로 가격/혜택

## interactivePattern

Group의 onValueChange/onValuesChange로만 상태 관리. Item에 onClick 부착 금지(라벨이 input을 토글).

## examplesHtml.do

```html
<nds-selection-card mode="single" value="chat">
  <nds-selection-card-item value="chat" item-title="채팅 상담" description="텍스트로 편하게"></nds-selection-card-item>
  <nds-selection-card-item value="video" item-title="영상 상담" description="얼굴 보며 깊이 있게"></nds-selection-card-item>
</nds-selection-card>
<!-- 리치 카드: title/description 아래에 Chip 행·bullet 리스트를 slot="content" 로 -->
<nds-selection-card mode="single" value="project">
  <nds-selection-card-item value="project" item-title="프로젝트 노출 확대" description="최대한 많은 사용자에게 도달">
    <div slot="content">
      <div>사용 가능 광고 유형: <nds-chip>프리미엄형</nds-chip> <nds-chip>디스플레이형</nds-chip></div>
      <ul><li>신규 프로젝트를 알리고 싶을 때</li></ul>
    </div>
  </nds-selection-card-item>
</nds-selection-card>
<script>el.addEventListener("nds-selection-change", e => setMode(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- mode='multiple' 인데 value 속성 사용 — values (배열) 사용 -->
<nds-selection-card mode="multiple" value="chat">…</nds-selection-card>
```
