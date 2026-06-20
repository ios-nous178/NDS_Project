---
{}
---

## summary

타이포 primitive. `variant`(타입 스케일 size+line-height)·`tone`(시맨틱 색)·`weight` 를 토큰에서만 받아 임의의 텍스트에 거는 얇은 컴포넌트 — DS 의 공용 타이포 SSOT(`.nds-text-*` 클래스)를 소비한다. Heading 의 body 짝: "제목+설명 묶음"은 Heading, "한 덩이의 텍스트(본문·라벨·메타·캡션)"는 Text. `expandable` 로 길면 '더보기/접기' 토글(구 ExpandableText 흡수). (figmaNodeUrl: TODO — 타이포 스케일 노드 게시 후 연결.)

## pitfalls

- **제목 + 설명 묶음에는 Text 를 두 번 쌓지 말 것** → Heading(level 로 폰트+gap 자동). Text 는 단일 텍스트 런 전용.
- **variant 는 size+line-height 만** 결정한다 — 헤딩 스케일(`headline*`)을 줘도 자동 bold/색이 되지 않는다. 굵기는 `weight`, 색은 `tone` 으로 따로 준다.
- **색은 `tone` 으로만** — raw hex/인라인 색 금지. 프로젝트별 색 차이는 컴포넌트가 모르고 `--semantic-text-*`(tone) 토큰이 흘려보낸다.
- `maxLines` 는 **CSS line-clamp(측정 없음)** — 정적으로 N줄에서 잘림. 펼침/접힘 토글이 필요하면 `expandable`.
- `expandable` 본문에 **폰트 사이즈를 섞으면** line-height 측정 정확도가 떨어진다 — 단일 톤 텍스트에만. (html `<nds-text expandable>` 는 expandable 여부가 mount 시 1회 확정 — 런타임 토글 비대상.)
- 짧은 텍스트에 `expandable` 을 줘도 토글은 자동으로 숨겨진다 — 한두 줄짜리엔 굳이 쓰지 않는다.
- `as` 는 시맨틱 태그 — 문단이면 `as="p"`, 인라인 강조면 `as="strong"`. 기본 `span`.

## recommended

- 본문: `<Text variant="body1" tone="normal" as="p">…</Text>` (또는 body2)
- 메타/날짜/조회수: `<Text variant="caption1" tone="subtle">2026.06.14 · 조회 1,204</Text>`
- 라벨/배지 텍스트: `<Text variant="caption1" weight="medium">필수</Text>`
- 상태 메시지: `<Text variant="body3" tone="statusError">입력을 확인해 주세요</Text>`
- 카드 설명 미리보기: `<Text variant="body3" expandable maxLines={3}>긴 설명…</Text>`
- 약관 미리보기: `<Text expandable maxLines={2} hideCollapse expandLabel="이용약관 전문 보기">…</Text>`

## accessibility

- 문단 텍스트는 `as="p"` 로 시맨틱을 맞춘다(스크린리더 흐름·문서 아웃라인).
- `expandable` 토글 버튼은 `aria-expanded` 가 자동 반영된다 — 별도 처리 불필요.
- 본문 색은 tone 토큰이 대비를 보장 — `disabled`/`muted` 를 본문 가독 텍스트에 쓰지 말 것.

## examples.do

```tsx
<Text variant="body1" tone="normal" as="p">오늘 하루도 수고했어요.</Text>
<Text variant="caption1" tone="subtle">2026.06.14 · 조회 1,204</Text>
<Text variant="body3" expandable maxLines={3}>긴 설명 텍스트…</Text>
```

## examples.dont

```tsx
{/* 제목+설명을 Text 두 개로 — Heading 을 써야 level↔gap 이 자동 */}
<Text variant="headline4" weight="bold">바로 상담하기</Text>
<Text variant="caption1" tone="subtle">급한 문제는 5분 내 바로 상담</Text>

{/* raw 색 하드코딩 — tone 토큰을 쓸 것 */}
<Text style={{ color: "#1A1A1A" }}>본문</Text>
```

## examplesHtml.do

```html
<nds-text variant="body1" tone="normal">오늘 하루도 수고했어요.</nds-text>
<nds-text variant="caption1" tone="subtle">2026.06.14 · 조회 1,204</nds-text>
<nds-text expandable max-lines="3">긴 설명 텍스트…</nds-text>
```

## examplesHtml.dont

```html
<!-- 한 줄짜리 짧은 텍스트에 expandable — 더보기 버튼이 더 큼 -->
<nds-text expandable max-lines="3">간단한 안내</nds-text>
```
