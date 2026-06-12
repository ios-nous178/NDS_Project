---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://www.figma.com/design/mvecozaRQoGRePffskRgmh/?node-id=20-13799
---

## summary

NudgeEAP 통합 푸터. surface='web' (Figma 20:13799) 은 약관+앱다운로드+ISO+DAIN+powered by 풍부 슬롯의 PC 푸터, surface='app' (default) 은 회사 정보 표준 푸터.

## pitfalls

- Figma SSOT: web 푸터 20:13799 / app 푸터 (Footer.Info 표준).
- 탭바는 별도 컴포넌트 NudgeEAPBottomNav.
- web surface 의 appDownloads / iso / dain / poweredBy 슬롯은 NudgeEAP 전용 — base Footer.Web compound 에는 없는 슬롯 (브랜드별 풍부 슬롯은 wrapper 내부에만).
- Trost 처럼 다크 푸터 아님 — light + neutral 토큰.

## recommended

- Web (PC): `<NudgeEAPFooter surface='web' links={...} company={{ address, bizNumber, phone, fax, email, copyright }} appDownloads={...} iso={{ imgSrc, captionLines }} dain={{ logoSrc, label }} poweredBy='powered by Cashwalk' maxWidth={1200} />`
- App (surface 생략 가능): `<NudgeEAPFooter links={...} company={{ name:'(주)다인', address, bizNumber, copyright }} logo={{ src, width, height }} />`
- HTML 목업(vanilla): `<nds-brand-footer brand='nudge-eap' surface='app'>` (PC 풍부 푸터는 surface='web') — Footer 손수 조립 금지 (BrandFooter 가이드).
