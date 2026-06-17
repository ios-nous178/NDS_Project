---
"@nudge-design/tokens": patch
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

런마일 브랜드 — Figma 런마일 Library 가이드 반영 (토큰 + 컴포넌트)

**토큰**

- 팔레트 확장: blue·red 풀스케일 + green·yellow 패밀리 신규, orange 50/200 톤 추가, gray600 #919CAA→#8B95A1
- 시멘틱 갱신: status bg/text/icon 을 green·yellow 실색으로(구 base 임시값 대체), info bg=blue, surface-subtle=gray100, bg-disabled=gray200, border default/subtle/strong 재정렬, placeholder=gray600, helper success=green
- 엘리베이션: E1~E3 drop shadow 를 가이드 실측값으로 교체
- 보더&레디우스: radius XL 16→15 + 2XL(20)·3XL(24) 추가, border-width icon(1.5)·strong(2) 추가
- 타이포는 기존 가이드와 일치(변경 없음)

**컴포넌트 (Section/Container · Tab · Pagination · Text Input)**

- **Text Input** — 공유 `variant="box" | "line"` 신설. `line` = 하단 1px 라인(언더라인) · radius 0 · 좌우 패딩 0 · 높이 40 · 라벨/헬퍼 간격 6. **런마일은 미지정 시 line 으로 cascade**(`[data-brand="runmile"]`), `variant="box"` 로 opt-out. typing(포커스) 하단 라인 = 검정(input.borderFocus, 일반 Border/Focus 파랑과 분리). 색은 전부 토큰.
- **Tab** — 런마일 chip active = 검정(#221E1F) 정합(`--nds-tab-chip-selected-bg`=text/strong). underline active 는 이미 검정. 포인트색(주황) 아님.
- **Pagination** — 런마일 element 24×24 · radius 6 · 칩 간격 8 · inactive weight medium · 화살표 20×20 gray600. active=gray800 채움은 기존 유지. 아이템 정사각용 `--nds-pagination-item-min-width` 슬롯 신설.
- **Section/Container** — `.nds-container--runmile`(max 1280 / 좌우 80) 모디파이어 + 패턴 가이드(2열 888+332·gap60, 카드갭 24/16, 섹션갭 20/12, divider 8, 액센트 바) 보강. (컴포넌트 아님 — 패턴)
- MCP 가이드(Tab/Pagination/Input/container-section)에 런마일 노드·규칙 반영
