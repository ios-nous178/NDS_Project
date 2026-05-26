# @nudge-eap/mcp

## 0.2.0

### Minor Changes

- 0.2.0 — DS 0.2.0 과 동기화 (visual-reference 게이트 강화, 카탈로그/가이드 일괄 갱신)

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

### Patch Changes

- Updated dependencies [ea692d7]
- Updated dependencies [5968807]
- Updated dependencies [2fd35b4]
- Updated dependencies [5968807]
- Updated dependencies
  - @nudge-eap/react@1.0.0
  - @nudge-eap/tokens@0.2.0
  - @nudge-eap/icons@0.2.0

## 0.1.10

### Patch Changes

- Updated dependencies
- Updated dependencies
- Updated dependencies [60af459]
  - @nudge-eap/icons@0.1.10
  - @nudge-eap/react@0.1.10
  - @nudge-eap/tokens@0.1.10

## 0.1.9

### Patch Changes

- 0718ff5: Geniet 브랜드 전용 아이콘 27종을 `@nudge-eap/icons` 에 편입.

  ### 1차: GenietHomePage 운영 SVG 정제 (19개)
  - `GenietHomePage` 레포 `public/images` 의 SVG 36개 중 UI 아이콘 19개만 DS 표준(viewBox 24×24, currentColor) 으로 정제해서 svg/ 에 `geniet-*.svg` prefix 로 추가. 일러스트·배너 7개와 mood 캐릭터 10개(condition+emoji)는 별도 패키지 후보로 분리.
  - 컴포넌트: GenietAlarmIcon, GenietArrowBack/Down/Up/Right/RightStepperIcon, GenietMenuIcon, GenietMypageIcon, GenietCopyIcon, GenietLoginIcon, GenietLogoutIcon, GenietRecordOn/OffIcon (pair), GenietPlayIcon, GenietCheckcircleIcon, GenietConfettiIcon, GenietCouponIcon, GenietCashreviewIcon, GenietGpointIcon.
  - 변환 일회성 헬퍼: `packages/icons/scripts/import-geniet.mjs` — 원본 viewBox(16/18/20/24/28/54/64) 를 24 컨테이너로 transform-scale 한 뒤 fill/stroke hex 를 currentColor 로 일괄 치환. 마스크 안 흰색(`#fff`, `#FEFEFE`) 과 `none`·`url(...)` 참조는 보존.

  ### 2차: Figma 지니어트-Dev bottom nav + header 추출 (8개 추가)
  - Figma 파일 `wDL8a2RbsglC8KjNufn3ks` 의 노드 207:3204 (bottomnavi platform=app(geniet)) 와 207:2483 (header/PC) 에서 누락된 아이콘 추출.
  - 컴포넌트: GenietHomeOnIcon, GenietWriteOffIcon, GenietBenefitOn/OffIcon (pair), GenietReviewOn/OffIcon (pair), GenietCommunityIcon, GenietSearchIcon.
  - 변환 헬퍼: `packages/icons/scripts/import-figma-geniet.mjs` — Figma 식 `fill="var(--fill-0, #111111)"` 패턴까지 currentColor 로 치환. preserveAspectRatio·width="100%"·style 같은 Figma 전용 속성 strip.

  ### 공통
  - `packages/mcp/src/guides.ts` 의 `ICON_METADATA` 에 27개 카테고리·페어 메타 추가. brand-geniet 별도 카테고리는 만들지 않고 의미 기반 카테고리(navigation/action/media/state-reaction/location/eap-service) 재사용 — 브랜드 분리는 prefix 가 담당.
  - `apps/storybook/src/stories/Icons.stories.tsx` 의 카탈로그 description 에 prefix 검색 안내 한 줄 추가. 카탈로그 자체는 `Object.entries(Icons)` 자동 인덱싱이라 신규 27개가 자동 노출.
  - 신규 `Brands/Geniet/Icons` 스토리(`Icons.Geniet.stories.tsx`) — Geniet prefix 아이콘만 필터한 카탈로그. 전체 / Brand 색(mint) / Size 20 / 다크 배경 4 variant.
  - `Brands/Geniet/AppFooter` 와 `Brands/Geniet/AppBar` 스토리를 Figma 정합으로 업데이트: 5탭(홈/기록/혜택/리뷰/커뮤니티) bottomnavi + PC 헤더의 "음식 카테고리" 메뉴 박스(GenietMenuIcon).

  ### 브랜드 아이콘 사용 정책 (MCP 가이드 신설)
  - `DESIGN_PRINCIPLES.dos/donts` 와 `ICON_METADATA` 상단 주석에 정책 본문 추가 — 브랜드 모드 작업 시 brand prefix 아이콘 우선, 공통 컴포넌트 구현에는 brand 분기 박지 말고 사용처에서 명시적 icon prop 으로.
  - `get_brand_info(slug)` 응답에 `brandIcons` 자동 필터링 필드 + `iconPolicy` 안내 문구 추가.
  - 외부 프로젝트가 받는 CLAUDE.md template 의 "디자인 룰" 섹션에도 동일 정책 한 줄.

- Updated dependencies
- Updated dependencies [0718ff5]
- Updated dependencies [7528bb7]
- Updated dependencies [368b9ba]
- Updated dependencies [8a22a9e]
  - @nudge-eap/react@0.1.9
  - @nudge-eap/icons@0.1.9
  - @nudge-eap/tokens@0.1.9

## 0.1.8

### Patch Changes

- Updated dependencies
  - @nudge-eap/react@0.1.8
  - @nudge-eap/tokens@0.1.8
  - @nudge-eap/icons@0.1.8

- 4500ab0: 디자인 가이드와의 차이를 메우는 가이드 본문 보강. 외부 프로젝트가 MCP 로 받는 가이드 SSOT 변경.
  - 신규 토픽 `get_guide({ topic: "ux-writing" })` — 해요체 / 능동형 / 긍정형 / 캐주얼 경어 / 명사+명사 풀어쓰기 5원칙 + 마이크로카피 룰 ("닫기 vs 취소", CTA 라벨, 에러 메시지, empty state) + EAP 멘탈케어 도메인 라이팅 룰 (위기·자해·진단 표현, 평가 어휘 회피, 사용자 동의 기반 표현, 익명성 안내, 검사 결과 라벨).
  - 신규 패턴 `get_guide({ topic: "pattern:dark-patterns" })` — 진입 직후 시트 자동 노출 / 뒤로가기 인터럽트 / 거절 불가 CTA / 플로우 중간 전면 광고 / CTA 라벨 모호성. DESIGN_PRINCIPLES.bannedPatterns 에도 5개 키워드 추가 (`entry-bottomsheet`, `back-press-interrupt`, `no-decline-cta`, `mid-flow-interstitial`, `ambiguous-cta-label`).
  - 기존 `pattern:cta-group` 본문에 라벨 명료성 룰 추가 — "버튼 라벨만 보고 다음 행동을 예측할 수 있어야 함", 다이얼로그 보조 버튼 라벨은 "닫기" (취소 금지), 거절 가능 옵션 최소 1개. metrics 에 `dialogLeftButtonLabel`, `minDeclineOptionsPerDialog` 추가.
  - 외부 프로젝트가 받는 CLAUDE.md 본문 (사용자 앱 분기) 에 ux-writing / dark-patterns 호출 안내 한 줄 추가.
  - 부수: `scripts/generate-component-inventory.mjs` 가 `docs/components/inventory.md` 를 `figmaSynced` 기준 2 섹션(정합 완료 / 미정합) 으로 분리 출력.
  - **노션 "AI UI 생성 원칙" 정합**: Badge / Tabs / Modal 컴포넌트 가이드에 사용 시점 룰 명시.
    - 신규 `Badge` 가이드 — Fill Badge 카드당 1개 / Brand color 는 현재 선택·핵심 강조에만 / Tone-on-Tone 금지 (color × variant policy 정의).
    - `Tabs` 가이드 보강 — 동일 depth 콘텐츠 전환·category navigation·section switching 전용, CTA·필터·라우팅 대체용 금지. `variant='square'`(Segment) 는 PC CMS 전용, 모바일 일반 화면 금지.
    - `Modal` 가이드 보강 — 즉각적 판단/응답이 필요할 때만 사용, 단순 정보는 inline Notice / Banner. 핵심 action 1 + 보조 action 1 구조가 기본.
    - DESIGN_PRINCIPLES.dos/donts 에도 위 룰 글로벌 반영. `ComponentGuide.usagePolicy` 타입에 `colorPolicy / variantPolicy / emphasisRule` 옵셔널 필드 추가.

## 0.1.7

### Patch Changes

- DS 0.1.7 — 토큰/컴포넌트 정합 + MCP 가이드 보강 + 릴리즈 안전망
  - tokens: elevation 토큰을 Figma 556:2 정합으로 재정의 (shadow["0"]~shadow["3"] + elevationLevel.\* alias), radius policy export 정리, sync-tokens 의 중첩 sizing 객체 지원.
  - react: Card variant="elevated" 제거 (Figma 권위 룰 — shadow 금지). Button/IconButton/WebHeader 가 시멘틱 토큰 우선 룩업으로 변경.
  - mcp: invalid-prop-value 검출 + CLAUDE.md 검증 루프에 tsc 단계 추가, Card/List 가이드를 Figma 권위 룰 기준 재작성, lookup 시 시멘틱 토큰 우선, child process npm path 보정.
  - 릴리즈 인프라: sync-mcpb-version.mjs 가 루트 package.json 도 함께 sync, pack-local-packages.mjs 는 force-sync 대신 root ↔ DS 일치 assert 로 전환 (조용한 다운그레이드 차단).

- Updated dependencies
  - @nudge-eap/react@0.1.7
  - @nudge-eap/tokens@0.1.7
  - @nudge-eap/icons@0.1.7

## 0.1.6

### Patch Changes

- MCP 도구 통합 및 이모지 금지 규칙 강화.
  - 13개 도구 → 2개로 통합: `get_guide({ topic })`, `get_setup({ step })` (구버전 이름 호출 시 친절한 deprecation 안내).
  - `get_setup({ step: "inspector" })` 추가 — 외부 프로젝트 `src/main.tsx`를 idempotent 하게 패치해 DsInspector dev-only 마운트.
  - `validate_mockup` 응답에 `workspaceNotice` 필드 추가 — Inspector 미셋업 시 한 줄 안내 (violationCount 미반영).
  - 이모지/텍스트 기호 절대 금지: MCP 응답 문자열에서 이모지 전부 제거(ASCII 마커로 교체), validator 룰 `emoji-banned` / `text-symbol-banned` 신설로 자동 검출.

- Updated dependencies
  - @nudge-eap/tokens@0.1.6
  - @nudge-eap/react@0.1.6
  - @nudge-eap/icons@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies
  - @nudge-eap/tokens@0.1.5
  - @nudge-eap/react@0.1.5
  - @nudge-eap/icons@0.1.5
