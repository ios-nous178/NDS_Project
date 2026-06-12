---
_htmlStatus: no-html-equivalent
---

## summary

Geniet 통합 푸터. Geniet 은 앱 환경 전용이라 surface='app' (default) 만 지원 — web 푸터 없음. Footer.Info 베이스 위 wrapper — links / company / extra(통신판매중개자 안내) / logo 슬롯.

## pitfalls

- 탭바는 별도 컴포넌트 GenietBottomNav. Footer 이름이지만 하단 탭바 아님.
- extra 슬롯은 통신판매중개자 안내 같은 부가 고지 전용 — 일반 콘텐츠 넣지 말 것.
- surface prop 은 'app' 만 — 타입 단에서 다른 값 차단 (Geniet 은 web 푸터 없음).

## recommended

- `<GenietFooter links={...} company={{ name, ceo, address, bizNumber, email, copyright }} extra='지니어트는 통신판매중개자이며...' logo={{ src, width, height }} />`
- HTML 목업(vanilla): `<nds-brand-footer brand='geniet' surface='app'>` — Footer.Info 손수 조립 금지 (BrandFooter 가이드).
