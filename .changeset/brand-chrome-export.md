---
"@nudge-eap/react": minor
"@nudge-eap/mcp": minor
---

브랜드 chrome (헤더/푸터/바텀네비/웹헤더/웹푸터) 을 named export 로 승격.

신규 export:

- Geniet: GenietAppBar / GenietAppFooter / GenietBottomNav
- Trost: TrostAppBar / TrostAppFooter / TrostBottomNav / TrostWebFooter
- NudgeEAP: NudgeEAPAppBar / NudgeEAPAppFooter / NudgeEAPBottomNav / NudgeEAPWebHeader / NudgeEAPWebFooter
- Cashpobi (웹 전용): CashpobiWebHeader / CashpobiWebFooter

외부 프로젝트는 각 브랜드의 화면에서 단일 컴포넌트 호출 (`<GenietAppBar variant="desktop" ... />`) 만으로 표준 chrome 을 부를 수 있다 — 카테고리 박스, 검색·알림 아이콘, 다크 푸터, 5탭/3탭 BottomNav 같은 구조는 DS 가 책임지고, 콘텐츠 (메뉴 항목·로고·회사정보) 만 props 로 주입.

MCP 가이드 (`COMPONENT_GUIDES`) 에 12개 brand chrome 항목 추가 — base AppBar 대신 brand 별 화면에서는 이쪽을 사용하도록 안내. 캐포비는 _웹 전용_ 이라 AppBar/BottomNav 없음 명시.

스토리북 카탈로그 (`Components/AppBar` / `Components/AppFooter` / `Components/WebHeader` / `Components/WebFooter`) 에 브랜드 변형이 형제로 줄지어 보이도록 title 통합 — 더 이상 `Brands/Geniet/AppBar` 식 brand 폴더로 분리되지 않음.
