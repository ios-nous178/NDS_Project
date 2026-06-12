---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/?node-id=380-1739
---

## summary

캐시워크 포 비즈니스 (Cashwalk for Business) 웹 헤더. PC(로고+GNB+우측 액션) / Mobile(로고+햄버거) variant. 캐시워크 포 비즈니스는 *웹 전용* 이라 AppBar 가 없음 — chrome 슬롯 5개 중 WebHeader/WebFooter 만 제공. **HTML 목업은 `<nds-brand-header brand='cashwalk-biz' surface='web'>` (brand wrapper — BrandHeader 가이드). base nds-header 손수 조립 금지.**

## pitfalls

- 캐시워크 포 비즈니스 화면에는 base `<Header>` 가 아니라 `<CashwalkBizWebHeader>` 사용.
- 캐시워크 포 비즈니스 시그니처 (Yellow/200 + Neutral/900) 는 토큰 cascade 가 자동 적용 — 인라인 background 로 덮어쓰지 말 것.
- 캐시워크 포 비즈니스는 *AppBar / BottomNav 컴포넌트 없음* (앱 없으니 필요 없음). 모바일 헤더도 CashwalkBizWebHeader variant='mobile', 모바일 푸터는 CashwalkBizFooter layout='mobile'.

## recommended

- Desktop: `<CashwalkBizWebHeader variant='desktop' logo={{...}} menuItems={...} activeKey='home' actions={[{ key:'login', label:'로그인', href:'#' }]} />`
- Mobile: `<CashwalkBizWebHeader variant='mobile' logo={{...}} onMobileMenu={() => openDrawer()} />`
- HTML 목업(vanilla): `<nds-brand-header brand='cashwalk-biz' surface='web' active-key='ad'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 모바일은 반응형 web (별도 AppBar 없음).
