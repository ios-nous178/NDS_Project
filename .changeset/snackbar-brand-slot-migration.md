---
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/tokens": patch
---

Snackbar 브랜드 분기 → 토큰 슬롯 이전 (variant×brand 합성 패턴 시작)

캐포비 Snackbar 흰카드를 `[data-brand]` cascade 블록에서 브랜드 토큰 슬롯으로 이전. 렌더 결과는 동일(faithful refactor), 컴포넌트가 브랜드를 모르게 됨.

- 컴포넌트 root 가 3단 `var()` 체인으로 색을 합성: `--nds-snackbar-bg`(브랜드 서피스 override) > `--nds-snackbar-variant-bg`(variant) > 기본. variant 룰은 `background` 직접 박기 대신 `--nds-snackbar-variant-bg` 슬롯만 set.
- 캐포비 흰카드/그림자/큰 타이틀·아이콘/회색 닫기를 `cashwalk-biz.ts` `components.snackbar` 로 emit (`--nds-snackbar-bg/border/shadow/title-font-size/title-line-height/icon-size/close-color/close-opacity`). `[data-brand]` 블록 제거.
- variant 색 커스텀은 글로벌 `--semantic-bg-status-*` 그대로 — 브랜드가 status 색 바꾸면 전 컴포넌트 cascade.

(설계·원칙은 CLAUDE.md '색은 슬롯에 넣고 우선순위로 합성' 참조.)
