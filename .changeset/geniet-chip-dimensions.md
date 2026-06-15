---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

지니어트 Chip 치수 정합 — Badge&Chip 가이드(3058:84)

Chip 치수를 `--nds-chip-*` 슬롯으로 토큰화(react·html 미러). 미설정 브랜드는 기존 size(sm/md) 토큰값 fallback 유지 — 타 브랜드 영향 없음.

- 지니어트: 높이 **32px 고정**("다른 크기는 padding 조절"), padding **6/14**, **Medium(500) 13px** (구 Bold 14/h28). pill·선택색은 직전 커밋에서 반영 완료.
- 신설 슬롯: `--nds-chip-height` / `-padding-x` / `-padding-y` / `-font-size` / `-line-height` / `-font-weight`.
