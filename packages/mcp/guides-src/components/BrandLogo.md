---
{}
---

## summary

브랜드 대표 로고(trost/geniet/nudge-eap/cashwalk-biz/runmile)를 컴포넌트로 박는다. base64 data URI 가 내장돼 단일 HTML/오프라인에서도 안 깨진다. `<nds-sidebar brand>` / `<nds-brand-header brand>` 가 주입하는 것과 동일한 로고 SSOT(brand-logo-defaults). brand chrome(헤더/사이드바)이 없는 화면 — 특히 캐포비 어드민 온보딩 카드 — 에서 로고를 넣는 표준 진입점.

## pitfalls

- 35KB base64 data URI 를 logo-src/img 로 손수 붙이지 말 것 — brand 만 주면 자동 주입. 거대 블롭 추출·재인코딩이 한글 모지바케+로고 유실 회귀의 직접 원인.
- raw <img>/<svg> 로 로고를 직접 조립하지 말 것 — BrandLogo 로 박아야 5개 브랜드 일관 + SSOT 유지.
- height 만 주면 폭은 비율 유지(auto). width 를 강제하면 찌그러질 수 있다.
- 헤더/푸터/사이드바 안에서는 BrandLogo 를 또 박지 말 것 — 그 컴포넌트들은 brand 속성으로 로고를 이미 자동 주입한다. BrandLogo 는 chrome 이 없는 화면용.

## recommended

- 캐포비 어드민 온보딩 카드 상단: <nds-brand-logo brand='cashwalk-biz' height='40'> (pattern:cashwalk-biz-page-onboarding)
- 로고 클릭 시 홈 이동: href 지정

## examplesHtml.do

```html
<nds-brand-logo brand="cashwalk-biz" height="40"></nds-brand-logo>
<!-- 링크: --><nds-brand-logo brand="nudge-eap" href="/"></nds-brand-logo>
```

## examplesHtml.dont

```html
<!-- 35KB base64 를 손으로 붙이거나 raw img/svg 로 로고 조립 — 모지바케·로고 유실 회귀 -->
<img src="data:image/svg+xml;base64,PHN2Zy…(35KB)…" />
```
