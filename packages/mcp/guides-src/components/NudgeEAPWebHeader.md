---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://www.figma.com/design/mvecozaRQoGRePffskRgmh/?node-id=39-5751
---

## summary

NudgeEAP 웹 헤더 (PC) — base Header (variant="web") wrapper. 로고 200×60 (Symbol + KO+EN horizontal) + GNB 6탭 (상담하기/심리검사/심리치료/주간레터/소식/마이페이지) + 우측 앱다운로드 + 로그인/로그아웃. **HTML 목업은 `<nds-brand-header brand='nudge-eap' surface='web'>` (brand wrapper — BrandHeader 가이드). base nds-header 손수 조립 금지.**

## pitfalls

- NudgeEAPAppBar 와 분리 — AppBar 는 앱(모바일/웹뷰) 전용 (Figma 20:3235), WebHeader 는 데스크톱 (39:5751).
- 로고는 Figma 698:87 (NudgeEAP Library) 의 *Symbol + KO+EN horizontal* (대표 로고) 사용 — 124×28 원본 PNG, 헤더에서 height auto 로 200×60 영역에 배치.
- base `<Header variant="web">` 대신 NudgeEAP 화면에서는 이 컴포넌트를 사용해야 fixture/스토리/Figma 가 일치.

## recommended

- `<NudgeEAPWebHeader logo={{ src, alt:'NudgeEAP', href:'/' }} menuItems={GNB} activeKey={current} showAppDownload appDownloadHref='/download' authState={isLoggedIn ? 'logout' : 'login'} authHref='/auth' />`
- HTML 목업(vanilla): `<nds-brand-header brand='nudge-eap' surface='web' active-key='counsel'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 모바일/웹뷰는 surface='mobile'|'webview'.
