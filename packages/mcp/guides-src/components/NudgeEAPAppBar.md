---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://www.figma.com/design/mvecozaRQoGRePffskRgmh/?node-id=39-5751
---

## summary

NudgeEAP 상단 헤더. 1단 (logo + GNB + AuthMenu), 80px h / 1200 max-width. desktop / mobile / webview variant.

## pitfalls

- Geniet/Trost 와 달리 NudgeEAP 는 1단 헤더 — 검색바/카테고리/TrendingKeywords 없음.
- AuthMenu separator='none' 패턴.
- Figma SSOT: PC 웹 헤더 39:5751 / 앱 헤더 20:3235 (NudgeEAP Dev). 로고 가이드 698:87 (NudgeEAP Library).

## recommended

- Desktop: `<NudgeEAPAppBar variant='desktop' logo={...} gnbItems={...} activeKey='home' authItems={[{ key:'login', label:'로그인' }]} />`
- Mobile: `<NudgeEAPAppBar variant='mobile' logo={...} authItems={...} />`
- Webview: `<NudgeEAPAppBar variant='webview' webviewTitle='심리검사 결과' onBack={...} />`
- HTML 목업(vanilla): `<nds-brand-header brand='nudge-eap' surface='mobile' active-key='counsel'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 웹뷰는 surface='webview'.
