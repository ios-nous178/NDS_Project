---
"@nudge-design/styles": minor
"@nudge-design/mcp": patch
---

Container/Section 레이아웃 가이드(Figma 1385:13) 반영

페이지 구성 두 레이아웃 단위를 DS 에 반영했다. Layout primitive 컨벤션(web component 없이 클래스만)을 따른다.

- **Container** — `nds-container` 클래스 신설(`packages/styles/src/Layout.ts`). 컨텐츠 가로 폭을 viewport 안에 가두는 반응형 래퍼: **PC(≥1024) max 1200·좌우 40 / Tablet(768~1023) max 768·좌우 24 / Mobile(<768) 100%·좌우 16**, `margin-inline:auto` 가운데 정렬. 기존 `grid.desktop.contentWidth`(1200)·spacing 토큰 사용, 신규 토큰 없음.
- **Section** — 컴포넌트화하지 않고 **룰만**(Figma 지정: frame 으로 직접 그림). 상하 padding Large 120/Medium 80/Small 40, 인접 Section BG 교차(White ↔ Gray 50), Section 1개당 Container 1개, Section Title 32 Bold + 하단 16·헤딩↔본문 24, Section 간 margin 금지(padding 분리). MCP 패턴 가이드 `pattern:container-section` 로 문서화(figmaNodeUrl 포함).

어드민 카드 `nds-section`(흰 카드)과는 다른 페이지-레벨 개념 — 이름 충돌 없음(Section 은 클래스 미생성).
