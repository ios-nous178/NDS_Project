---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://zpl.io/Dp775xl
references:
  - label: Trost 데스크톱 홈 SSOT — 웹 PC 홈 (Zeplin Dp775xl)
    image: references/trost-web-home.png
    caption: Trost 데스크톱 홈 풀 캡처. Rectangle 2613 = TrostEAPBanner / Path = TrostUtilityHeader 로고 / Rectangle 2522 = TrostSearchForm 입력 / 하단 탭 = TrostTabNavigation.
    brand: trost
---

## summary

Trost 데스크톱(≥1024) 웹 헤더. 3슬롯 컴파운드 — EAP 배너 (Rectangle 2613) + 유틸리티 헤더 (로고 Path / 검색 Rectangle 2522 / 로그인 / 앱 다운로드) + 탭 네비게이션. `TrostDesktopHeader` 의 alias — brand chrome 5개 슬롯 중 WebHeader 자리. **HTML 목업은 `<nds-brand-header brand='trost' surface='web'>` (brand wrapper — BrandHeader 가이드). base nds-header 손수 조립 금지.**

## pitfalls

- <1024 viewport 에서는 display:none. 모바일에는 `TrostAppBar variant='mobile'` 사용.
- 3슬롯 (banner / utility / tabs) 모두 ReactNode — 호스트 앱이 `TrostEAPBanner` / `TrostUtilityHeader` / `TrostTabNavigation` 을 직접 컴포지션. 단일 prop 으로 데이터 주입하는 형태 아님.
- 검색 placeholder 는 `TrostSearchForm` 기본값 '전문가, 상황, 증상 등을 검색해 보세요' — 원본 디자인(Zeplin Dp775xl) 정합. 다른 카피로 덮으려면 placeholder prop 명시.
- EAP 배너의 building/eap-logo/chevron 아이콘은 호스트 앱이 SVG src 를 주입 (DS 가 자산을 들고 있지 않음).

## recommended

- 기본: `<TrostWebHeader banner={<TrostEAPBanner eapLogoSrc={nudgeEapSymbolSrc} />} utility={<TrostUtilityHeader logoSrc={trostLogo} searchSlot={<TrostSearchForm onSearch={...} />} loginSlot={<TrostLoginSection ... />} appDownloadSlot={<TrostAppDownloadButton />} />} tabs={<TrostTabNavigation tabs={TROST_TABS} currentPath={pathname} />} />`
- EAP 배너 숨기기: `banner` prop 비워두면 됨.
- sticky 끄기: `<TrostWebHeader sticky={false} ... />` (기본 true).
- HTML 목업(vanilla): `<nds-brand-header brand='trost' surface='web' active-key='counsel'>` — base nds-header 슬롯 손수 조립 금지 (BrandHeader 가이드). 모바일은 surface='mobile'.
