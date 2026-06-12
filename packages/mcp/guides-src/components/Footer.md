---
{}
---

## summary

페이지 최하단 사이트맵 / 약관 / 운영주체 정보. 모바일/웹 모두 컴포지션 자식(nds-footer-tab-bar / nds-footer-company-info / nds-footer-web) 으로 구성.

## pitfalls

- raw <footer> + 인라인 스타일로 시각만 흉내 — 브랜드별 콘텐츠 구조가 통일되지 않음.
- Footer 안에 마케팅 CTA 큰 카드를 박지 말 것 — Footer 는 정보/법적 영역.
- 사용자 앱과 어드민에서 같은 Footer 컴포넌트 사용 금지 — 어드민은 antd + 자체 Copyright 카피.

## examplesHtml.do

```html
<nds-footer-info active-tab="home">
  <nds-footer-tab-bar>
    <nds-footer-tab-item key="home" label="홈" href="/"></nds-footer-tab-item>
    <nds-footer-tab-item key="journal" label="일기" href="/journal"></nds-footer-tab-item>
  </nds-footer-tab-bar>
  <nds-footer-company-info>(주)넛지이에이피 · 사업자 …</nds-footer-company-info>
</nds-footer-info>
```

## examplesHtml.dont

```html
<!-- raw <footer> 로 모양만 흉내 — 브랜드 사양에서 벗어남 -->
<footer style="background:#f5f5f5;padding:24px"><p>회사정보</p></footer>
```
