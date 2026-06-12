---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

Badge `shape` prop 추가 (default | pill) — 캐포비 admin Badge 가이드 동기화 (Figma 3782-20558)

- `shape="default"`(라운드 사각)=동적 상태값(충전·사용·적립·만료·취소), `shape="pill"`(완전 둥근)=정적 식별 태그(일반 계정·프리미엄·신규). 기본값 default 로 기존 동작 유지.
- React `Badge`/HTML `<nds-badge shape>` 미러. 톤은 기존 ghost 변형으로 매핑(신규 토큰 없음).
- MCP 가이드에 shape 정책·캐포비 ChipGuide 레퍼런스·동적/정적 혼용 금지 pitfall 추가.
