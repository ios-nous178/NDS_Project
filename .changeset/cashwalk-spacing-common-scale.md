---
"@nudge-design/tokens": minor
---

스페이싱을 캐시워크 SpacingGuide 공통 스케일로 통일 — 프로젝트별 오버라이드 제거

캐시워크 SpacingGuide(Figma 361:1328)를 모든 프로젝트의 **공통 스페이싱 스케일**로 정본화했습니다.

- **정본 Primitive 스케일** = `2·4·8·10·12·16·20·24·32·40` (10단계). 그 외 값(`0·6·14·18·28·30·36·48·80`)은 **deprecated** 표시 — 기존 소비처 유지를 위해 토큰은 남기되 신규 사용은 금지하고 점진적으로 정본 값으로 마이그레이션합니다(현재 사용처는 그대로 동작, 깨짐 없음).
- **프로젝트별 gap/inset 오버라이드 제거** — geniet·trost 가 갖고 있던 `gap.default 8`·`inset.chip 6` 과 미사용 신규 토큰(section/button)을 제거해 공통 캐시워크 값(`gap.default 10`·`inset.chip 8`)으로 통일했습니다. cashwalk-biz 도 중복·미사용 inset 오버라이드를 제거했습니다. → **geniet·trost 의 기본 간격이 소폭(+2px) 조정**됩니다.
- **예외(유지)**: cashwalk-biz `gapTitle`(헤딩 간격)은 caPOBi 의 큰 타입스케일과 결합돼 있어 그대로 두었고, grid margin·layout(admin 너비 등)은 구조적 레이아웃이라 스페이싱 공통화 대상이 아닙니다.
