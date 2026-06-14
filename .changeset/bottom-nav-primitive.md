---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

BottomNav 추가 — 모바일 하단 탭 바 공식 primitive (브랜드 무관)

- **신규 `BottomNav`** — compound + 슬롯 API. `<BottomNav activeKey onChange>` 안에 `<BottomNav.Item itemKey label icon activeIcon href badge>`. 활성/비활성 아이콘 분리, 우상단 배지, 키보드/aria(role=tablist·aria-current) 지원.
- **브랜드를 모르는 컴포넌트** — 색·배경·보더·높이는 전부 `--nds-bottomnav-*` 슬롯으로 노출되고 브랜드 토큰이 값만 덮는다. 브랜드별 아이콘/라벨은 호출부가 주입한다. (브랜드별 `{Brand}BottomNav` 래퍼를 대체하는 공개 primitive — 래퍼 정리는 후속 chrome 통합에서.)
- **3면 미러** — react(`BottomNav`) ↔ styles(`.nds-bottom-nav`) ↔ html(`<nds-bottom-nav>` / `<nds-bottom-nav-item>`). html 은 slot=icon / slot=active-icon 으로 아이콘 주입, active-key 변경 시 자식 active 자동 좌표화.
- MCP 가이드 신설 + validator 가 새 태그(`nds-bottom-nav` / `nds-bottom-nav-item`)를 인식.
