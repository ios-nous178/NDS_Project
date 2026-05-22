---
"@nudge-eap/react": major
"@nudge-eap/mcp": major
---

base 푸터 단일화 — `AppFooter` 와 brand `{Brand}AppFooter` / `{Brand}WebFooter` named export 제거, 단일 `<Footer>` + `<{Brand}Footer>` 로 통합.

## Breaking changes

- `AppFooter` / `AppFooterInfo` / `AppFooterTabBar` / `AppFooterLinks` / `AppFooterCompanyInfo` / `AppFooterExtra` 및 그 props 타입 (`AppFooterVariant`, `AppFooter*Props`) 모두 삭제. `<Footer variant="info|tab-bar|web">` + 컴파운드 (`Footer.Info` / `Footer.TabBar` / `Footer.Web` / `Footer.Links` / `Footer.CompanyInfo` / `Footer.Extra`) 로 마이그레이션.
  - `<AppFooter.Info>` → `<Footer.Info>`
  - `<AppFooter.TabBar>` → `<Footer.TabBar>`
  - `<AppFooterTabBar>` (standalone) → `<FooterTabBar>` 또는 `<Footer.TabBar>`
- 브랜드 푸터 named export 삭제 — 단일 `{Brand}Footer` 로 통일:
  - `GenietAppFooter` → `<GenietFooter>` (surface='app' only)
  - `TrostAppFooter` / `TrostDesktopFooter` / `TrostWebFooter` → `<TrostFooter surface="web"|"app">`. 기존 `variant='desktop'|'mobile'` 은 `layout` 으로 rename.
  - `NudgeEAPAppFooter` / `NudgeEAPWebFooter` → `<NudgeEAPFooter surface="web"|"app">`
  - `CashpobiWebFooter` → `<CashpobiFooter>` (surface='web' only). 기존 `variant='desktop'|'mobile'` 은 `layout` 으로 rename.
- 옛 className prefix `nds-app-footer` 제거 → 단일 `nds-footer` 로 통일.
- 한쪽 surface 가 없는 브랜드 (Cashpobi=app 없음, Geniet=web 없음) 는 discriminated union 으로 타입 단에서 차단 — `<CashpobiFooter surface="app" />` / `<GenietFooter surface="web" />` 는 컴파일 에러.

## Non-breaking additions

- `Footer.Web` compound 신설 — `.Web` / `.Web.Row` / `.Web.Divider` / `.Web.Section`. `tone='light'|'dark'` 로 토큰 swap.
- 브랜드 wrapper (`{Brand}Footer`) 는 단일 진입점 — surface prop 으로 web/app 분기, 풍부 슬롯 (NudgeEAPFooter 의 `appDownloads`/`iso`/`dain`/`poweredBy`) 은 wrapper 내부에 유지.
- MCP 가이드: `Footer` 키 + 4개 `{Brand}Footer` 키 신설, 옛 `AppFooter` / `{Brand}AppFooter` / `{Brand}WebFooter` / `TrostWebFooter` / `CashpobiWebFooter` / `GenietAppFooter` / `NudgeEAPAppFooter` / `NudgeEAPWebFooter` / `TrostAppFooter` 키 제거.
- 스토리북 카탈로그: `Components/AppFooter` + `Components/WebFooter` → 단일 `Components/Footer` 통합.
