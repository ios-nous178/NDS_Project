---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/?node-id=380-2208
---

## summary

캐시워크 포 비즈니스 통합 푸터. 캐시워크 포 비즈니스는 웹 전용이라 surface='web' (default) 만 지원. layout='desktop'|'mobile' 으로 반응형 분기. light 톤 + Neutral 텍스트.

## pitfalls

- Trost 처럼 다크 푸터로 바꾸지 말 것 — 캐시워크 포 비즈니스 가이드는 light + neutral 텍스트.
- surface prop 은 'web' 만 — 타입 단에서 다른 값 차단 (캐시워크 포 비즈니스는 app 푸터 없음).
- 기존 CashwalkBizWebFooter 의 variant prop 이 CashwalkBizFooter 에서는 layout 으로 rename.

## recommended

- Desktop: `<CashwalkBizFooter layout='desktop' links={...} company={{ name:'캐시워크 주식회사', address:..., bizNumber:..., copyright:... }} maxWidth={1600} />`
- Mobile: `<CashwalkBizFooter layout='mobile' links={...} company={...} />`
- HTML 목업(vanilla): `<nds-brand-footer brand='cashwalk-biz' surface='web'>` — Footer 손수 조립 금지 (BrandFooter 가이드).
