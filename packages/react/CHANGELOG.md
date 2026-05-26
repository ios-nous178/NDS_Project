# @nudge-eap/react

## 0.2.0

### Minor Changes

- 0.2.0 — 캐포비 브랜드 합류 + 신규 컴포넌트 5종 + 브랜드 헤더/푸터 한 줄 호출 + MCP 가드레일 강화

### Breaking Changes (treated as minor under 0.x)

- 5968807: base 푸터 단일화 — `AppFooter` 와 brand `{Brand}AppFooter` / `{Brand}WebFooter` named export 제거, 단일 `<Footer>` + `<{Brand}Footer>` 로 통합.

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

- 5968807: base 헤더 단일화 — `AppBar` 와 `WebHeader` named export 제거, 단일 `<Header>` 로 통합.

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

### Minor Changes

- ea692d7: 브랜드 chrome (헤더/푸터/바텀네비/웹헤더/웹푸터) 을 named export 로 승격.

  신규 export:
  - Geniet: GenietAppBar / GenietAppFooter / GenietBottomNav
  - Trost: TrostAppBar / TrostAppFooter / TrostBottomNav / TrostWebFooter
  - NudgeEAP: NudgeEAPAppBar / NudgeEAPAppFooter / NudgeEAPBottomNav / NudgeEAPWebHeader / NudgeEAPWebFooter
  - Cashpobi (웹 전용): CashpobiWebHeader / CashpobiWebFooter

  외부 프로젝트는 각 브랜드의 화면에서 단일 컴포넌트 호출 (`<GenietAppBar variant="desktop" ... />`) 만으로 표준 chrome 을 부를 수 있다 — 카테고리 박스, 검색·알림 아이콘, 다크 푸터, 5탭/3탭 BottomNav 같은 구조는 DS 가 책임지고, 콘텐츠 (메뉴 항목·로고·회사정보) 만 props 로 주입.

  MCP 가이드 (`COMPONENT_GUIDES`) 에 12개 brand chrome 항목 추가 — base AppBar 대신 brand 별 화면에서는 이쪽을 사용하도록 안내. 캐포비는 _웹 전용_ 이라 AppBar/BottomNav 없음 명시.

  스토리북 카탈로그 (`Components/AppBar` / `Components/AppFooter` / `Components/WebHeader` / `Components/WebFooter`) 에 브랜드 변형이 형제로 줄지어 보이도록 title 통합 — 더 이상 `Brands/Geniet/AppBar` 식 brand 폴더로 분리되지 않음.

- 2fd35b4: `GenietAppBar` — Figma 77:2 (Geniet_TopHeader_Guide) 개편판 반영.

  **Desktop (1920 × 172)**: 단일 MainBar+NavBar 구조에서 _Search Header(54h) + Menu Header(58h)_ 2단으로 재정렬.
  - Search Header: logo(165×54) + search frame(pill 500 + 인기검색어 NEW chip, gap 24) + login*area(쿠폰상점·마이페이지·로그인 \_header action button* — icon 28 + Pretendard 11px label, 52×46 vertical).
  - Menu Header: 음식 카테고리(160×58) + GNB(_홈/커뮤니티/헬시딜/음식 리뷰/기록_, Pretendard Bold 17, gap 20) + 우측 CTA pill(_캐시리뷰_ outline · _친구초대 이벤트_ tinted).

  **Mobile (360 × 102)**: 단일 row + 검색·알림 액션 구조에서 _Row1(50h) + Row2(52h)_ 2단으로 변경.
  - Row1: logo(97×32 mint) + outlined point chip(gpoint icon + amount) + user icon.
  - Row2: hamburger 24 + search input(292×38, radius 8, gray fill).

  **Props 변경**:
  - 신규: `actionButtons: GenietAppBarAction[]` (login_area), `ctaButtons: GenietAppBarCta[]` (Menu Header 우측), `pointChip: GenietAppBarPointChip` (mobile Row1), `showUserIcon` / `onUserClick` / `onMobileMenuClick` / `mobileSearchPlaceholder` / `pcTopPadding` / `pcGap` / `pcSearchHeight` / `pcMenuHeight` / `searchWidth`.
  - 제거: `authItems` (`actionButtons` 로 대체), `mobileActions` (mobile 구조가 고정), `mainBarPaddingY` / `navHeight`.

  **MCP 가이드** (`COMPONENT_GUIDES.GenietAppBar`) 갱신 — 새 figmaNodeUrl(77:2), 새 props snippet, pitfall 7개.

  **브랜드 fixture** (`apps/storybook/src/brand-fixtures.ts` geniet 블록) 갱신 — GNB items / auth items / searchBar 카피 / mobileHeight 102 / logo mobile height 32 등 새 spec 반영.

- 0.2.0 — 캐포비 브랜드 합류 + 신규 컴포넌트 5종 + 브랜드 헤더/푸터 한 줄 호출 + MCP 가드레일 강화

### Patch Changes

- Updated dependencies [721b500]
- Updated dependencies
  - @nudge-eap/styles@0.1.11
  - @nudge-eap/tokens@0.2.0
  - @nudge-eap/icons@0.2.0

## 0.1.10

### Patch Changes

- `@nudge-eap/icons` 에 Mockup\* 아이콘 1786종 fallback 추가.

  목업 단계에서 DS 표준 아이콘셋에 없는 시각을 임시로 채울 때 쓰는 fallback. iconsax bold 스타일을 24×24 / currentColor 로 정제. 정식 인하우스 아이콘이 들어오기 전까지의 placeholder 용도이며, `MockupBold*Icon` prefix 로 import — prefix 가 명시적이라 production 시안과 임시 시안을 한눈에 구분.

- MCP 목업 워크플로우 가드 강화 (외부 전파).
  - `build_singlefile_html` pre-flight audit 신설 — raw .html / :root 토큰 인라인 재정의 / DS 컴포넌트 시각 흉내 / .tsx 0개 같은 우회 패턴이 발견되면 빌드 거부.
  - 시각 레퍼런스(`references.md` 또는 `.references/`) 미수집 시 빌드 차단 — CLAUDE.md MUST 섹션 Rule 1 로 박혀 모델이 첫 응답에서 사용자에게 자동 질문.
  - `validate_mockup` 무한 루프 가드 — 같은 위반 3회 연속이면 멈추고 사용자에게 보고.

  외부 프로젝트는 MCP 업데이트 후 `get_setup({ step: 'claude-md', overwrite: true })` 로 새 가드가 박힌 CLAUDE.md 를 다시 받으면 됩니다.

- 60af459: MCP 도구 21 → 15 개로 통합 (외부 전파).
  - `find_component` ← list_components + get_component + search_component
  - `find_icon` ← list_icons + find_icon
  - `find_token` ← list_tokens + lookup_token
  - `get_brand` ← list_brands + get_brand_info
  - `dev_server` ← start_dev_server + stop_dev_server (`action: 'start' | 'stop'`)

  옛 도구 이름은 즉시 제거 — 호출 시 `Unknown tool` 에러. 외부 프로젝트는 MCP 업데이트 후 CLAUDE.md 를 `get_setup({ step: 'claude-md', overwrite: true })` 로 갱신하면 새 이름이 박힌 가이드를 받습니다.

- Updated dependencies
- Updated dependencies
- Updated dependencies [60af459]
  - @nudge-eap/icons@0.1.10
  - @nudge-eap/tokens@0.1.10

## 0.1.9

### Patch Changes

- Card / List 컴포넌트 Figma 마스터 (Card 888-23 · 171-9363, List 933-80) 사양 동기화.

  **Card**
  - 신규 슬롯: Avatar(40 circle) · Chips(BadgeGroup) · Divider(토글) · Cta(액션 영역) · FooterText. Flat API + Compound 둘 다.
  - 레이아웃: 균등 padding(--inset-card 16) + gap(12) 의 수직 스택. 이전 header/body/footer 중첩 padding 폐기.
  - 타이포: Title body1 → headline5(18/26 bold), Description → body3, Metadata/FooterText → caption1.
  - 본문 갭: Title↔Description 4px, Description↔Metadata 8px. Footer divider padding-top 12 → 16(--inset-card).
  - Thumbnail 기본 height 160px (aspectRatio 지정 시 비율 모드). Corner radius md → lg(12).
  - 백워드 호환: subtitle/meta/footer/footerNoBorder 유지.

  **List**
  - Title typo: body3/medium → body1/bold + textRole.strong.
  - Description: caption1 → body3.
  - Metadata prop 신설 (caption2 muted).
  - Description↔Metadata gap 2px.

  MCP 가이드 (Card / List) + Card.figmaNodeUrl + Storybook WithMetadata 스토리 갱신.

- Updated dependencies [0718ff5]
- Updated dependencies [7528bb7]
- Updated dependencies [368b9ba]
- Updated dependencies [8a22a9e]
  - @nudge-eap/icons@0.1.9
  - @nudge-eap/tokens@0.1.9

## 0.1.8

### Patch Changes

- DS 0.1.8 — MCP 가이드 SSOT 갱신에 따른 외부 전파.

  이번 릴리즈는 코드 변경이 아닌 MCP 가이드 본문 보강이 핵심이며, 외부 프로젝트가 MCPB 로 받을 수 있도록 DS 4개 패키지를 함께 patch bump 합니다. 비개발자용 변경 사항은 `.release-notes/pending.md` 참조 (Slack 알림에 그대로 노출).

  주요 변경 (자세한 내용은 `@nudge-eap/mcp` CHANGELOG):
  - 노션 "AI UI 생성 원칙" 정합 — Badge / Tabs / Segment / Modal 사용 시점 룰 신규 명시. Tone-on-Tone 금지·Brand Background 제한 글로벌 dos/donts 보강.
  - UX 라이팅 가이드 신규 (`get_guide({ topic: "ux-writing" })`).
  - 다크패턴 5종 차단 (`get_guide({ topic: "pattern:dark-patterns" })`) + DESIGN_PRINCIPLES.bannedPatterns.
  - CTA 그룹 라벨 명료성 룰 강화.
  - 컴포넌트 인벤토리 문서가 Figma 정합 여부로 2 섹션 분리.

- Updated dependencies
  - @nudge-eap/tokens@0.1.8
  - @nudge-eap/icons@0.1.8

## 0.1.7

### Patch Changes

- DS 0.1.7 — 토큰/컴포넌트 정합 + MCP 가이드 보강 + 릴리즈 안전망
  - tokens: elevation 토큰을 Figma 556:2 정합으로 재정의 (shadow["0"]~shadow["3"] + elevationLevel.\* alias), radius policy export 정리, sync-tokens 의 중첩 sizing 객체 지원.
  - react: Card variant="elevated" 제거 (Figma 권위 룰 — shadow 금지). Button/IconButton/WebHeader 가 시멘틱 토큰 우선 룩업으로 변경.
  - mcp: invalid-prop-value 검출 + CLAUDE.md 검증 루프에 tsc 단계 추가, Card/List 가이드를 Figma 권위 룰 기준 재작성, lookup 시 시멘틱 토큰 우선, child process npm path 보정.
  - 릴리즈 인프라: sync-mcpb-version.mjs 가 루트 package.json 도 함께 sync, pack-local-packages.mjs 는 force-sync 대신 root ↔ DS 일치 assert 로 전환 (조용한 다운그레이드 차단).

- Updated dependencies
  - @nudge-eap/tokens@0.1.7
  - @nudge-eap/icons@0.1.7

## 0.1.6

### Patch Changes

- `manifest.json` 버전을 max-DS 동기화 룰에 맞춰 끌어올리기 위한 DS 패키지 patch bump.
  (MCP 도구 통합 / 이모지 금지 / Inspector 자동 마운트는 `@nudge-eap/mcp` 0.1.6 에 들어가 있어, mcpb 릴리즈 워크플로우가 트리거되려면 DS 패키지 버전도 함께 진행해야 함.)
- Updated dependencies
  - @nudge-eap/tokens@0.1.6
  - @nudge-eap/icons@0.1.6

## 0.1.5

### Patch Changes

- MCP 도구 통합 및 이모지 금지 규칙 강화.
  - 13개 도구 → 2개로 통합: `get_guide({ topic })`, `get_setup({ step })` (구버전 이름 호출 시 친절한 deprecation 안내).
  - `get_setup({ step: "inspector" })` 추가 — 외부 프로젝트 `src/main.tsx`를 idempotent 하게 패치해 DsInspector dev-only 마운트.
  - `validate_mockup` 응답에 `workspaceNotice` 필드 추가 — Inspector 미셋업 시 한 줄 안내 (violationCount 미반영).
  - 이모지/텍스트 기호 절대 금지: MCP 응답 문자열에서 이모지 전부 제거(ASCII 마커로 교체), validator 룰 `emoji-banned` / `text-symbol-banned` 신설로 자동 검출.

- Updated dependencies
  - @nudge-eap/tokens@0.1.5
  - @nudge-eap/icons@0.1.5

## 0.1.5

### Patch Changes

- 브랜드 라인업 정리(Moneple → Geniet) + MCP 서버 리팩터(tools/ 분리, usage-tracker 레이어 분할, setup 클러스터 분리, pre-push smoke 자동화). DS 공개 API 변화 없음 — patch.
- Updated dependencies
  - @nudge-eap/tokens@0.1.5
  - @nudge-eap/icons@0.1.5
