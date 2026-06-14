---
"@nudge-design/styles": patch
"@nudge-design/mcp": patch
---

가로 스크롤 레일 유틸 `.nds-scroll-x` 신설 + 카드 장식 라인 금지 가이드

- **`.nds-scroll-x` 공용 유틸 클래스** (`@nudge-design/styles` → `styles.css`): `overflow-x:auto` + 스크롤바 숨김(`scrollbar-width`/`::-webkit-scrollbar`/`-ms-overflow-style`)을 한 벌로. 손으로 짠 카드 레일·칩 row·가로 탭에 클래스 하나만 걸면 가로 스크롤바가 숨겨진다. (FilterBar·ChatInput·Tabs·PopularPosts·TimePicker 가 각자 재구현하던 관용구의 SSOT — 기존 5곳은 의도된 구현이라 그대로 두고 신규 코드만 이 유틸을 쓴다.)
- **`pattern:scroll-rail` 가이드 신설**: 가로 스크롤 레일 레시피 — `.nds-scroll-x` + 호출부 `display:flex; gap` + 아이템 `flex-shrink:0`(찌그러짐 방지). `nds-card` 는 호스트가 `display:contents` 라 폭을 호스트가 아닌 카드 박스/래퍼에 줘야 함을 명시(`display:block !important` 핵 우회 금지).
- **카드 장식 라인/accent 바 금지** (Card 가이드 pitfall + `pattern:visual-antipatterns` 표면 그룹): 상단 컬러 라인·좌측 accent 보더·`::before` 컬러 바로 카드를 장식하지 않는다. 카드가 가질 수 있는 선은 outlined 중립 1px 보더와 옵션 footer/divider hairline 뿐 — 컬러 accent 선은 DS Card 에 없다.
