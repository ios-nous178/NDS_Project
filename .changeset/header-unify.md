---
"@nudge-eap/react": major
"@nudge-eap/mcp": major
---

base 헤더 단일화 — `AppBar` 와 `WebHeader` named export 제거, 단일 `<Header>` 로 통합.

## Breaking changes

- `AppBar` / `WebHeader` named export 삭제. `<Header variant="compact|webview|transparent|web" />` 로 마이그레이션 필요.
  - `<AppBar variant="default">` → `<Header variant="compact">`
  - `<AppBar variant="webview">` → `<Header variant="webview">`
  - `<AppBar variant="transparent">` → `<Header variant="transparent">`
  - `<WebHeader>` → `<Header variant="web">`
  - `AppBar.GNB` → `Header.Menu`
  - 그 외 subcomponents (`AppBar.MainBar` / `NavBar` / `Logo` / `SearchBar` / `AuthMenu` / `BackButton` / `Divider`, `WebHeader.Logo` / `Menu` / `MenuItem` / `Actions` / `AppDownloadButton` / `AuthButton`) 는 모두 `Header.*` 로 1:1 rename.
- 옛 className prefix `nds-app-bar` / `nds-web-header` 제거 → 단일 `nds-header` 로 통일.
- 옛 CSS variable `--nds-app-bar-*` / `--nds-web-header-*` 제거 → `--nds-header-*` 단일. 외부에서 옛 변수로 override 하던 케이스는 새 이름으로 교체 필요.

## Non-breaking

- 브랜드 chrome (`TrostAppBar` / `GenietAppBar` / `NudgeEAPAppBar` / `NudgeEAPWebHeader` / `CashpobiWebHeader`) named export 와 props 는 그대로. 내부에서만 새 base Header 사용.
- 슬롯 통합 결정:
  - Logo / Menu — `WebHeader` 쪽 API 채택 (children 지원, items 배열 + children 양쪽 다 가능). `renderItem` 콜백은 `Header.Menu` 에 흡수.
  - Auth — `Header.AuthMenu` (배열형) + `Header.AuthButton` (단일형) 둘 다 공존.
- MCP 가이드: `Header` 키 신설, 옛 `WebHeader` / `AppBar` 키 제거.
