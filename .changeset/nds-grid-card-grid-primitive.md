---
"@nudge-design/styles": minor
"@nudge-design/mcp": minor
---

카드 그리드 레이아웃 프리미티브 `.nds-grid` 추가

홈·마이페이지·갤러리처럼 카드를 다열로 배치하는 화면을 매번 raw `display:grid` 로 손코딩하던 문제를 흡수. `<div class="nds-grid" data-cols="2|3|4|auto">` 안에 카드 셀을 넣으면 토큰 간격·반응형(태블릿 3·4열→2, 모바일→1열) fallback·min-width:0 깨짐방지가 한 번에 적용된다. 기존 레이아웃 프리미티브(`.nds-shell`·`.nds-container`·`.nds-section`)와 같은 클래스-only 컨벤션.

- `@nudge-design/styles`: `.nds-grid` 클래스 (data-cols / data-gap / `--nds-grid-*` override).
- MCP: `pattern:card-grid` 가이드 신설, claude-md 원칙 다이제스트에 그리드 안내 추가, 목업 validator 의 `card-everything` 규칙이 `.nds-grid` 안의 카드 셀은 제외(의도된 단일 그리드 패턴), `nds-grid` 클래스 allowlist 등록.
