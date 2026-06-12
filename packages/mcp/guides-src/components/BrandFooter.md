---
forcedProps:
  footerTone:
    trost: dark
    "*": light
assetManifest:
  trost: []
  geniet:
    - geniet-logo-footer.webp
  nudge-eap:
    - nudge-eap-logo-footer.png
  cashwalk-biz: []
---

## summary

**브랜드 글로벌 푸터 — 손수 조립하지 말 것.** `<nds-brand-footer brand='...' surface='web|app'>` 한 줄로 이용약관/개인정보처리방침/사업자정보/copyright/푸터 로고가 BRAND_DATA 에서 자동 렌더. nds-footer + nds-footer-links + nds-footer-company 직접 조립 = 안티패턴.

## pitfalls

- **손수 조립 금지** — 이용약관/개인정보 링크, 사업자번호, CEO 이름 등을 매번 입력하지 말 것. 한 번 잘못 적으면 법적 표기 누락 위험.
- **푸터 로고도 base64 내장 — 파일·호스팅 불필요.** 푸터 로고가 따로 있는 브랜드(nudge-eap/geniet/runmile)도 data URI 로 박혀 있어 `asset-base-url` 없이 그대로 렌더된다. `asset-base-url` 은 자체 로고로 바꿀 때만 쓰는 선택적 override.
- **surface 차이** — `web` (PC 전용 wide 푸터 · 로고+링크+회사정보), `app` (모바일 앱 footer · 압축형). 사용자 앱 모바일 화면이면 surface='app'.
- footerTone 은 브랜드별 고정 (trost=dark / 나머지=light) — 임의 override 시도 시 디자인 인텐트 어긋남.

## recommended

- Trost (dark): `<nds-brand-footer brand='trost' surface='app' />` · 로고 base64 내장 (파일 불필요)
- Geniet (light): `<nds-brand-footer brand='geniet' surface='web' />` · 로고 base64 내장 (파일 불필요)
- NudgeEAP (light): `<nds-brand-footer brand='nudge-eap' surface='web' />` · 로고 base64 내장 (파일 불필요)
- CashwalkBiz (light): `<nds-brand-footer brand='cashwalk-biz' surface='web' />` · 로고 base64 내장 (파일 불필요)
- Runmile (light): `<nds-brand-footer brand='runmile' surface='app' />` · 로고 base64 내장 (gray700 워드마크) · footerTone=light (forcedProps '*' default)
- 자체 로고로 교체할 때만: `asset-base-url='/brand-logos'` (override 전용 · 기본 목업엔 불필요).
- Aliases: `<nds-trost-footer>`, `<nds-geniet-footer>`, `<nds-nudge-eap-footer>`, `<nds-cashwalk-biz-footer>`, `<nds-runmile-footer>`

## examplesHtml.do

```html
<nds-brand-footer brand="geniet" surface="web"></nds-brand-footer>
```

## examplesHtml.dont

```html
<!-- 손수 조립 안티패턴 — 사업자 정보/copyright/링크를 인라인으로 적으면 법적 표기 누락/잘못된 정보가 SSOT 깨고 페이지 간 불일치 -->
<footer class="my-footer">
  <a href="/terms">이용약관</a> | <a href="/privacy"><b>개인정보처리방침</b></a>
  <p>넛지모바일 주식회사 · 사업자번호 ...</p>
</footer>
```
