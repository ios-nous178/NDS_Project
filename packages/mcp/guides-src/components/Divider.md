---
{}
---

## summary

섹션 사이의 시각적 분리선. 카드 안 내부 분할에 남발하지 말고, 한 화면당 의미 있는 분리에만 사용.

## pitfalls

- **상하 간격은 `spacing` 속성으로 — 대칭이 자동.** `spacing="16"` 이면 divider 위·아래 margin 이 **동일**하게 잡힌다(`margin: spacing 0`). 간격을 형제의 한쪽 margin/gap 으로만 주면 divider 가 다음 항목에 붙어 **위/아래 비대칭**(예: 위 12·아래 0)으로 어색해진다 — 폼/스텝 리스트에서 자주 나오는 footgun.
- **flex-gap 컨테이너 + divider `spacing` 은 간격이 중복**된다. 둘 중 하나만: ① 컨테이너 `gap` 만 쓰고 divider 는 `spacing` 없이(자체 margin 0) 형제로, 또는 ② 컨테이너 gap 0 + divider `spacing` 으로 간격.
- 스텝/섹션 마크업 **안쪽에 divider 를 끼우지** 말고(라벨에 달라붙어 비대칭) 섹션 **사이 형제**로 둘 것.
- Divider 를 두꺼운 색상 line 으로 시각 위계 강조용으로 쓰지 말 것 — Heading + spacing 토큰이 우선.
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
<!-- ① list 항목 사이마다 divider 직접 — list variant 가 책임 -->
<nds-list-item>항목 1</nds-list-item>
<nds-divider></nds-divider>
<nds-list-item>항목 2</nds-list-item>

<!-- ② 스텝 안에 divider 를 끼워 다음 라벨에 달라붙음 → 위/아래 비대칭.
     spacing 없이 컨테이너 gap 만 있으면 위쪽만 간격이 생긴다.
     → divider 를 섹션 사이 형제로 옮기고 spacing 으로 대칭 확보 -->
<div style="display:flex; flex-direction:column; gap:12px">
  <div>1단계 본문<nds-divider></nds-divider></div>
  <label>2단계 라벨</label>
</div>
```
