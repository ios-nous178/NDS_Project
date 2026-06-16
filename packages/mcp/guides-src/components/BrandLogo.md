---
{}
---

## summary

브랜드 대표 로고(trost/geniet/nudge-eap/cashwalk-biz/runmile)를 컴포넌트로 박는다. base64 data URI 가 내장돼 단일 HTML/오프라인에서도 안 깨진다. `<nds-sidebar brand>` / `<nds-brand-header brand>` 가 주입하는 것과 동일한 로고 SSOT(brand-logo-defaults). brand chrome(헤더/사이드바)이 없는 화면 — 캐포비 어드민 온보딩 카드, **백오피스/CMS 사이드바·헤더, 어드민 셸의 로고 슬롯** 등 — 에서 로고를 넣는 표준 진입점. 5개 브랜드 전부 동일하게 동작(캐포비 전용 아님).

## pitfalls

- 35KB base64 data URI 를 logo-src/img 로 손수 붙이지 말 것 — brand 만 주면 자동 주입. 거대 블롭 추출·재인코딩이 한글 모지바케+로고 유실 회귀의 직접 원인.
- raw <img>/<svg> 로 로고를 직접 조립하지 말 것 — BrandLogo 로 박아야 5개 브랜드 일관 + SSOT 유지.
- **백오피스/CMS 사이드바 로고를 텍스트 placeholder·색박스로 두거나 빌드 산출물에서 로고 base64 를 추출해 박지 말 것** — 5개 브랜드 로고가 에셋 패키지에 data URI 로 모두 내장돼 있다. 사이드바는 `<nds-sidebar brand="…">` 가 로고를 자동 주입, chrome 밖이면 `<nds-brand-logo brand="…">`. 자산 목록은 `get_brand({ brand, assetKind: 'logos' })`. (validator `admin-sidebar-logo-not-component` 가 이 우회를 잡는다.)
- **"antd 등 비-DS 화면이라 패키지를 못 가져온다"는 오해** — React/호스팅 앱은 `import { getBrandLogo } from '@nudge-design/assets'` 로 dataUri 를 받거나 `<BrandLogo brand="…" />` 를 그대로 쓴다. 로고 자체는 import 한 줄이면 끝 — 빌드 결과물에서 base64 를 떼어다 붙이는 우회는 불필요하다.
- height 만 주면 폭은 비율 유지(auto). width 를 강제하면 찌그러질 수 있다.
- 헤더/푸터/사이드바 안에서는 BrandLogo 를 또 박지 말 것 — 그 컴포넌트들은 brand 속성으로 로고를 이미 자동 주입한다. BrandLogo 는 chrome 이 없는 화면용.

## recommended

- 백오피스/CMS·어드민 셸 사이드바 로고: <nds-sidebar brand='geniet'> 만 두면 로고 자동 주입 — 사이드바 밖 단독 로고면 <nds-brand-logo brand='geniet'> (pattern:admin-shell)
- 캐포비 어드민 온보딩 카드 상단: <nds-brand-logo brand='cashwalk-biz' height='40'> (pattern:cashwalk-biz-page-onboarding)
- React/antd 등 호스팅 앱: import { getBrandLogo } from '@nudge-design/assets' 또는 <BrandLogo brand='…' />
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
<!-- CMS/백오피스 사이드바 로고를 텍스트·색박스 placeholder 로 — 에셋 패키지에 실 로고 있음 -->
<div class="cms-sidebar-logo">geniet</div>
```
