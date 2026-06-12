---
{}
---

## summary

섹션 사이의 시각적 분리선. 카드 안 내부 분할에 남발하지 말고, 한 화면당 의미 있는 분리에만 사용.

## pitfalls

- Divider 를 두꺼운 색상 line 으로 시각 위계 강조용으로 쓰지 말 것 — TitleGroup + spacing 토큰이 우선.
- List 의 항목 사이에 Divider 를 직접 박지 말 것. nds-list variant='divided' 가 책임짐.
- orientation='vertical' 은 부모가 flex 컨테이너이고 명시적 높이가 있어야 보임.

## examplesHtml.do

```html
<section>섹션 A</section>
<nds-divider orientation="horizontal" spacing="24"></nds-divider>
<section>섹션 B</section>
```

## examplesHtml.dont

```html
<!-- list 항목 사이마다 divider 직접 — list variant 가 책임 -->
<nds-list-item>항목 1</nds-list-item>
<nds-divider></nds-divider>
<nds-list-item>항목 2</nds-list-item>
```
