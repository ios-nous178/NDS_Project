---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=859-5614
---

## summary

헤딩 + 보조 설명(description) 표준 블록. level (h1~h5) 만 결정하면 헤딩 폰트와 Gap/Title 토큰이 자동 적용 — Figma TitleGapGuide 859:5614 (6 페이지 58건 실측) 기반. description 을 생략하면 순수 헤딩으로 동작한다.

## pitfalls

- 헤딩 + 설명 묶음에는 직접 <h{n}> + <p> + margin-top 으로 짜지 말 것. level↔gap 미스매치(h4 에 12px gap 등) 가 생기는 가장 흔한 안티패턴.
- h4/h5 가 '★ 가장 자주' — 카드 헤딩(h4 · gap 6) / 서브 헤딩(h5 · gap 8). h1~h3 은 페이지 단위 hero / 큰 섹션 / 페이지 헤더.
- description 폰트도 level 에 묶여 자동 결정: h1~h3 = Body3(14px), h4~h5 = Caption1(13px). 다른 사이즈가 필요하면 Heading 을 쓰지 말고 raw 헤딩으로.
- 위계가 같은 자리에서는 같은 level 유지. h4 카드 헤딩들 사이에 h2 가 끼면 시각적 위계 망가짐.
- Card 안에 Heading 을 중첩해서 쓰는 패턴이 정상. 페이지 제목은 단일 컴포넌트가 아니라 `pattern:page-header`(Heading `level="h2" as="h1"` + Breadcrumb + actions 조합)로 조립한다.
- `as` 는 비주얼은 level 그대로 두고 DOM 헤딩 태그만 바꿀 때만. 예: 페이지 랜드마크가 h1 이어야 하는데 폰트는 h2 스케일 → level='h2' as='h1'. 평소엔 쓰지 말 것 — level 과 태그가 어긋나면 접근성 위계가 흐트러진다.

## recommended

- 카드 헤딩 (★ 가장 자주): <Heading level='h4' title='바로 상담하기' description='급한 문제는 5분 내 바로 상담' />
- 서브 헤딩 (★ 가장 자주): <Heading level='h5' title='오늘의 루틴' description='...' />
- Hero 영역: <Heading level='h1' title='마음까지 건강한 업무환경' description='...' />
- 단독 헤딩: description 생략 — 헤딩 + Gap 만 토큰화하고 싶을 때.

## examplesHtml.do

```html
<nds-heading level="h2" title="이번 주 미션" description="작은 변화부터 시작해요"></nds-heading>
```

## examplesHtml.dont

```html
<!-- level 누락 -> 기본값이 적용돼 페이지 위계가 무너짐 -->
<nds-heading title="…"></nds-heading>
```
