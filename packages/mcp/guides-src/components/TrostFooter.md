---
_htmlStatus: no-html-equivalent
---

## summary

Trost 통합 푸터. surface='web' 은 데스크톱(≥1024) dark PC 푸터, surface='app' (default) 은 dark 앱 푸터. 기존 variant='desktop'|'mobile' 은 layout 으로 이름 변경 (surface axis 와 분리).

## pitfalls

- Trost 화면이면 base `<Footer>` 가 아니라 `<TrostFooter>` 사용.
- 기존 Trost App 푸터의 `variant` prop → TrostFooter 에서는 `layout` 으로 rename. surface axis (`'web'|'app'`) 와 명확히 분리.
- surface='web' 은 <1024 viewport 에서 display:none. 모바일에는 surface='app' + layout='mobile' 사용.
- 다크 배경(#333 / #464646) 은 DS 가 자동 적용 — 인라인 background 로 덮어쓰지 말 것.
- appStoreLinks / snsLinks (app surface) 는 기본값 (Trost humart CDN) 이 들어있어서 안 넘겨도 됨. 커스텀이 필요할 때만 override.

## recommended

- Web (PC): `<TrostFooter surface='web' />` — 기본값 다 갖춤. 커스텀 약관: `<TrostFooter surface='web' termsHref='...' locationTermsHref='...' />`
- App desktop: `<TrostFooter surface='app' layout='desktop' links={...} company={...} extra='긴급 위기상담 ...' logo={...} />`
- App mobile: `<TrostFooter surface='app' layout='mobile' links={...} company={...} />`
- HTML 목업(vanilla): `<nds-brand-footer brand='trost' surface='app'>` (PC 다크 푸터는 surface='web') — Footer 손수 조립 금지 (BrandFooter 가이드).
