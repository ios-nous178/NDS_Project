---
{}
---

## summary

페이지 상단 알림 띠. 그라데이션 배경 사용 금지.

## pitfalls

- Banner의 배경에 linear-gradient 사용하지 말 것. 단색 토큰만 (semantic-info-bg 등).

## examplesHtml.do

```html
<nds-banner variant="filled" banner-title="신규 기능 안내"
  description="이번 주부터 음성 기록을 지원해요"
  action-label="자세히" action-href="/news/voice" closable></nds-banner>
```

## examplesHtml.dont

```html
<!-- variant="image" 일 때 full-image-src 가 아니라 banner-src 로 잘못 명시 -->
<nds-banner variant="image" banner-src="/hero.jpg" banner-title="…"></nds-banner>
<!-- description 없이 closable 만 — 닫고 나면 의도가 사라짐 -->
<nds-banner closable></nds-banner>
```
