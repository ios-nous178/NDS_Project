---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/%F0%9F%93%9A-%EB%84%9B%EC%A7%80EAP---Library?node-id=1728-36
sizeMatrix:
  type=line: 하단 1px Border/Subtle 만 (배경·라운드 없음) — FAQ·약관·정책 연속 리스트
  type=card: 배경(BG/Surface) + 1px Border/Subtle + Radius/12 — 심리검사 카드·상품 리스트
  title: Body1(16) Bold · Text/Strong (Figma MO; PC 는 Headline5(18) — device prop 도입 시)
  chevron: 우측 정렬 · Collapsed=down / Expanded=up (icon-eap-chevron 동형)
  content: Body3 본문 · 펼침 상태에서만 노출
---

## summary

수직 펼침/접힘 그룹. FAQ·약관·정책·다단 설정처럼 정보 밀도가 높지만 한 번에 다 보여줄 필요 없는 "목록+상세" 패턴에 사용. 시각 타입 `type`(line=구분선 / card=배경+라운드) × 펼침 모드 `expandMode`(single/multiple) 두 축으로 조립한다. 제목은 Bold·Text/Strong, chevron 으로 상태 표현(Collapsed=↓ / Expanded=↑).

## pitfalls

- **⚠ BREAKING(2026-06) — `type` 의미가 바뀌었다.** 기존 `type="single|multiple"`(펼침 모드)는 **`expandMode`** 로 이름이 바뀌었고, `type` 은 이제 **시각 타입 `line|card`** 이다. 외부 코드가 `<Accordion type="single">` 처럼 쓰고 있으면 `expandMode="single"` 로 고쳐야 한다(html `<nds-accordion expand-mode="single">`).
- **type 선택 — line vs card.** 연속 텍스트 리스트(FAQ·약관·정책·설정 메뉴)는 `type="line"`(구분선만). 시각 분리가 필요한 항목(심리검사 카드·상품)은 `type="card"`(배경+라운드+보더). **한 화면에서 line 과 card 를 섞지 말 것** — 시각 일관성 저해.
- **expandMode 기본은 `single`** (한 번에 하나). FAQ 처럼 여러 답을 동시에 펼쳐 비교해야 하면 `expandMode="multiple"`. `single` 모드에 `value`/`defaultValue` 를 배열로 넘기지 말 것(단일=string, multiple=배열).
- **chevron 외 다른 화살표(arrow/caret) 쓰지 말 것.** 상태는 chevron 방향(Collapsed=↓ / Expanded=↑)으로만 표현. 첫 진입은 모두 Collapsed 가 기본(FAQ 1번째만 Expanded 패턴은 가능).
- **헤더 전체가 클릭 영역.** chevron 아이콘만 클릭되게 막지 말 것 — trigger(헤더) 전체가 button 이다.
- trigger 안에 nds-button / a / 클릭 가능한 자식을 또 두면 nested interactive — 키보드/포커스가 깨진다. trigger 자체가 button.
- Accordion 안에 입력 폼을 깊게 두지 말 것 — 접힘 상태에서 validation 실패가 안 보여 혼란.
- 모든 항목을 펼친 채 기본 노출하지 말 것(아코디언의 목적 상실).

## examplesHtml.do

```html
<!-- FAQ — line 타입 · 여러 개 동시 펼침 -->
<nds-accordion type="line" expand-mode="multiple" value="q1">
  <nds-accordion-item value="q1">
    <nds-accordion-trigger>배송은 얼마나 걸리나요?</nds-accordion-trigger>
    <nds-accordion-content>영업일 기준 2~3일 소요됩니다.</nds-accordion-content>
  </nds-accordion-item>
  <nds-accordion-item value="q2">
    <nds-accordion-trigger>교환·환불이 가능한가요?</nds-accordion-trigger>
    <nds-accordion-content>수령 후 7일 이내 가능합니다.</nds-accordion-content>
  </nds-accordion-item>
</nds-accordion>

<!-- 약관 — card 타입 · 한 번에 하나 -->
<nds-accordion type="card" expand-mode="single" value="terms">
  <nds-accordion-item value="terms">
    <nds-accordion-trigger>이용약관</nds-accordion-trigger>
    <nds-accordion-content>본문…</nds-accordion-content>
  </nds-accordion-item>
</nds-accordion>
<script>el.addEventListener("accordion-change", e => console.log(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- ① 옛 API — type 으로 펼침 모드 지정 (이제 expand-mode) -->
<nds-accordion type="single">…</nds-accordion>

<!-- ② 한 화면에 line + card 혼용 -->
<nds-accordion type="line">…</nds-accordion>
<nds-accordion type="card">…</nds-accordion>

<!-- ③ trigger 안에 또 다른 클릭 가능한 element — nested interactive -->
<nds-accordion-item value="x">
  <nds-accordion-trigger><nds-button>열기</nds-button></nds-accordion-trigger>
  <nds-accordion-content>본문</nds-accordion-content>
</nds-accordion-item>
```
