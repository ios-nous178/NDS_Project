---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=859-5614
---

## summary

헤딩 + 서브타이틀 표준 블록. level (h1~h5) 만 결정하면 헤딩 폰트와 Gap/Title 토큰이 자동 적용 — Figma TitleGapGuide 859:5614 (6 페이지 58건 실측) 기반.

## pitfalls

- 헤딩 + 서브타이틀 묶음에는 직접 <h{n}> + <p> + margin-top 으로 짜지 말 것. level↔gap 미스매치(h4 에 12px gap 등) 가 생기는 가장 흔한 안티패턴.
- h4/h5 가 '★ 가장 자주' — 카드 헤딩(h4 · gap 6) / 서브 헤딩(h5 · gap 8). h1~h3 은 페이지 단위 hero / 큰 섹션 / 페이지 헤더.
- 서브타이틀 폰트도 level 에 묶여 자동 결정: h1~h3 = Body3(14px), h4~h5 = Caption1(13px). 다른 사이즈가 필요하면 TitleGroup 을 쓰지 말고 raw 헤딩으로.
- 위계가 같은 자리에서는 같은 level 유지. h4 카드 헤딩들 사이에 h2 가 끼면 시각적 위계 망가짐.
- Card / PageHeader 안에 TitleGroup 을 중첩해서 쓰는 패턴이 정상. 단, PageHeader 가 이미 title 슬롯을 가진 경우엔 PageHeader 의 title 을 우선 사용.

## recommended

- 카드 헤딩 (★ 가장 자주): <TitleGroup level='h4' title='바로 상담하기' subtitle='급한 문제는 5분 내 바로 상담' />
- 서브 헤딩 (★ 가장 자주): <TitleGroup level='h5' title='오늘의 루틴' subtitle='...' />
- Hero 영역: <TitleGroup level='h1' title='마음까지 건강한 업무환경' subtitle='...' />
- 단독 헤딩: subtitle 생략 — 헤딩 + Gap 만 토큰화하고 싶을 때.

## examplesHtml.do

```html
<nds-title-group level="h2" title="이번 주 미션" subtitle="작은 변화부터 시작해요"></nds-title-group>
```

## examplesHtml.dont

```html
<!-- level 누락 -> 기본값이 적용돼 페이지 위계가 무너짐 -->
<nds-title-group title="…"></nds-title-group>
```
