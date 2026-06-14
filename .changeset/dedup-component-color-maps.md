---
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

색맵 중복 제거 — Badge·Chip·FAB·Header·ValidationChip 색을 styles CSS 로 단일화

variant/color/state 별 색을 react `.tsx` 와 html `nds-*.ts` 양쪽 JS 에 손으로 복제하던 5개
컴포넌트를, 색을 `styles/src/<C>.ts` 의 `[data-variant]`/`[data-color]`/`[data-state]` CSS
룰(`--nds-*-bg/fg/border` 슬롯) 한 곳으로 모았다. 이제 react/html 은 data-attribute 만 set
하고 색 토큰은 JS 에 두지 않는다(시각 출력 불변 — variant×color 토큰 1:1 보존 검증).

- **Badge·ValidationChip**: styles 파일 신설(이전엔 styles 파일 없이 양쪽 JS 인라인).
- **FAB·Header**: 기존 `--nds-*` 슬롯에 `[data-color]`/`[data-variant]` CSS 룰 추가.
- **Chip**: 색맵 제거 + react 의 `<style>` 자체 주입 제거 → 다른 컴포넌트처럼 번들
  `styles.css` 를 쓴다(중복 CSS 사본 제거). Chip 단독 사용 시 `styles.css` import 필요
  (전 컴포넌트 공통 요건과 동일).

react↔html 색 드리프트는 신설 게이트 `check-style-token-parity` 가 계속 감시한다.
