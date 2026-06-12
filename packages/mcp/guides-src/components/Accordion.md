---
{}
---

## summary

수직 펼침/접힘 그룹. FAQ, 약관, 다단 설정처럼 정보 밀도가 높지만 한 번에 다 보여줄 필요 없는 곳에 사용.

## pitfalls

- type='single' 인데 value 를 배열로 넘기지 말 것. 단일 모드는 string, multiple 모드만 배열.
- trigger 안에 nds-button / a / 클릭 가능한 자식 element 를 또 두면 nested interactive — 키보드/포커스 동작이 깨짐. trigger 자체가 button 임.
- Accordion 안에 form / 입력 폼을 깊게 두지 말 것. 접힘 상태에서 validation 실패가 보이지 않아 사용자가 혼란.

## examplesHtml.do

```html
<nds-accordion type="single" value="terms">
  <nds-accordion-item value="terms">
    <nds-accordion-trigger>이용약관</nds-accordion-trigger>
    <nds-accordion-content>본문…</nds-accordion-content>
  </nds-accordion-item>
  <nds-accordion-item value="privacy">
    <nds-accordion-trigger>개인정보 처리방침</nds-accordion-trigger>
    <nds-accordion-content>본문…</nds-accordion-content>
  </nds-accordion-item>
</nds-accordion>
<script>el.addEventListener("accordion-change", e => console.log(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- accordion-trigger 안에 또 다른 클릭 가능한 element — nested interactive -->
<nds-accordion-item value="x">
  <nds-accordion-trigger><nds-button>열기</nds-button></nds-accordion-trigger>
  <nds-accordion-content>본문</nds-accordion-content>
</nds-accordion-item>
```
