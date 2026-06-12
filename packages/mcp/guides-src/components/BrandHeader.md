---
usagePolicy:
  useFor:
    - 사용자 앱 (Trost/Geniet/NudgeEAP/CashwalkBiz/Runmile) PC GNB
    - 사용자 앱 모바일 compact 헤더 (surface='mobile')
    - webview 페이지 뒤로가기/타이틀 헤더 (surface='webview')
  doNotUseFor:
    - 어드민/CMS — antd Layout.Sider 사용 (단, 캐포비(cashwalk-biz) 어드민은 예외로 DS Sidebar — get_guide({ topic:'component:Sidebar' }))
    - 단일 시연용 임시 화면이라 브랜드 정체성이 무의미한 경우
  emphasisRule: 헤더/푸터를 손수 조립한 흔적이 발견되면 즉시 BrandHeader/BrandFooter 한 줄로 교체. 메뉴 라벨이나 로고를 페이지마다 적는 건 SSOT 위반.
validPropValues:
  trost:
    activeKey:
      - home
      - counsel
      - test
      - care
      - center
  geniet:
    activeKey:
      - home
      - community
      - deal
      - review
  nudge-eap:
    activeKey:
      - counsel
      - test
      - therapy
      - letter
      - news
      - my
  cashwalk-biz:
    activeKey:
      - channel
      - ad
      - case
      - notice
      - guide
assetManifest:
  trost:
    - trost-logo.svg
  geniet:
    - geniet-logo-pc.webp
    - geniet-logo-footer.webp
  nudge-eap:
    - nudge-eap-logo.png
    - nudge-eap-logo-footer.png
  cashwalk-biz:
    - brand/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg
---

## summary

**브랜드 GNB 헤더 — 손수 조립하지 말고 무조건 이걸 먼저 쓸 것.** `<nds-brand-header brand='trost|geniet|nudge-eap|cashwalk-biz|runmile' surface='web|mobile|webview' active-key='...'>` 한 줄로 로고/메뉴/auth 버튼/검색바가 브랜드별 BRAND_DATA 에서 자동 렌더. nds-header + nds-header-logo + nds-header-menu + nds-header-menu-item × N + nds-header-actions + nds-header-auth-button 직접 조립 = 안티패턴.

## pitfalls

- **손수 조립 금지** — nds-header / nds-header-logo / nds-header-menu / nds-header-menu-item / nds-header-actions / nds-header-auth-button 를 직접 박지 말 것. 메뉴 라벨/href/순서를 손으로 적으면 브랜드 일관성이 깨지고 다음 브랜드 화면에서 또 적게 됨. BrandHeader 한 줄이 BRAND_DATA 에서 전부 자동.
- **로고는 base64 내장 — 자산 파일·호스팅 불필요.** 5개 브랜드 로고가 BRAND_DATA 에 data URI 로 박혀 있어 `asset-base-url` 없이도 어디서든 안 깨지고 렌더된다 (단일 HTML 목업 그대로 OK). `asset-base-url` 은 **자체 로고로 바꿀 때만** 쓰는 선택적 override — `public/assets/brand/{brand}/logos/` 폴더를 만들 의무는 없다.
- **surface 별 출력 다름** — `web` (PC GNB · 로고+메뉴+auth), `mobile` (compact 헤더 · 로고+auth), `webview` (뒤로가기 + 타이틀만). 모바일 화면이면 surface='mobile' 명시.
- active-key 는 BRAND_DATA[brand].webMenu 의 key 와 매칭. 잘못 적으면 활성 메뉴 표시가 안 됨. 각 브랜드 key 목록은 nds-brand-chrome.ts BRAND_DATA 또는 아래 recommended 참고.

## recommended

- Trost: `<nds-brand-header brand='trost' surface='web' active-key='counsel' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: home / counsel / test / care / center
- Geniet: `<nds-brand-header brand='geniet' surface='web' active-key='deal' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: home / community / deal / review
- NudgeEAP: `<nds-brand-header brand='nudge-eap' surface='web' active-key='counsel' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: counsel / test / therapy / letter / news / my
- CashwalkBiz: `<nds-brand-header brand='cashwalk-biz' surface='web' active-key='ad' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: channel / ad / case / notice / guide
- Runmile: `<nds-brand-header brand='runmile' surface='web' active-key='race' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: race / community · web 헤더 = 좌측 워드마크+nav · 중앙 coral 검색바 · 우측 채팅/로그인 액션 자동. mobile=52h 중앙 워드마크 bar.
- 자체 로고로 교체할 때만: `asset-base-url='/assets'` + 해당 파일 배치 (override 전용 · 기본 목업엔 불필요).
- Aliases (선택): `<nds-trost-header>`, `<nds-geniet-header>`, `<nds-nudge-eap-header>`, `<nds-cashwalk-biz-header>`, `<nds-runmile-header>` — brand attribute 안 써도 동일 동작.

## examplesHtml.do

```html
<nds-brand-header brand="geniet" surface="web" active-key="deal"></nds-brand-header>
```

## examplesHtml.dont

```html
<!-- 손수 조립 안티패턴 — 메뉴 라벨/href 를 인라인으로 적으면 브랜드 데이터와 분리되어 다음 화면에서 또 적게 됨 -->
<nds-header variant="web" position="static" max-width="1200">
  <nds-header-logo href="/"><img src="..." /></nds-header-logo>
  <nds-header-menu>
    <nds-header-menu-item href="/community">커뮤니티</nds-header-menu-item>
    <nds-header-menu-item href="/cashdeal" active>헬시딜</nds-header-menu-item>
  </nds-header-menu>
</nds-header>
```
