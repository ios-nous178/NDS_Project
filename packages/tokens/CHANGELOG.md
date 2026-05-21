# @nudge-eap/tokens

## 0.1.10

### Patch Changes

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

## 0.1.9

### Patch Changes

- 368b9ba: Trost `buttonText.brand` 잔여 노랑(#E6D200) → orange(#FF9D00) 정정.

  이전 patch 에서 `text.brand` / `icon.brand` 를 orange 로 정정했는데 `buttonText.brand` 만 빠져 있었다. 같은 brand-as-text 시멘틱이므로 일관성 맞춤.

- 8a22a9e: Trost 시멘틱 토큰을 TrostAstroHomepage 실측에 맞춰 정정.

  ### `--semantic-bg-page-default`: `#F2F2F2` → `#FFFFFF`

  페이지 본문 bg 는 모든 트로스트 컴포넌트(UtilityHeader / TabNavigation / DesktopFooter 본문 / CategoryListItem 등)에서 흰색. `#F2F2F2` 는 section divider 색으로 이미 `border.subtle.default` 에 매핑돼 있어 page-bg 와는 의미가 다름.

  ### `--semantic-bg-overlay`: `rgba(0,0,0,0.7)` → `rgba(0,0,0,0.6)`

  Bible 카드 등 트로스트 코드의 overlay 가 모두 `bg-black/60` (= 0.6). NudgeEAP base 의 0.4 보다 진하되 0.7 까지는 아니라는 실측 값.

  ### `--semantic-text-brand-default` / `-strong` / `--semantic-icon-brand-default`: 노랑(`#E6D200`) → orange(`#FF9D00`)

  트로스트의 "활성 / 선택 / 자사 강조" 텍스트는 실측 11회 모두 `#ff9d00` (활성 카테고리 / 인용 멘션 prefix / 댓글 멘션 / 활성 sub-tab / EAP 다운로드 툴팁의 "트로스트" 강조 등). 노란색 brand 컬러는 면적이 큰 button bg / banner bg 용이고 텍스트로는 가독성 때문에 거의 사용되지 않음 — brand-as-text / brand-as-icon 시멘틱은 orange 가 실제 의도에 부합.

  ### `elevation.shadow["1"]` opacity: `0.10` → `0.12`

  트로스트 코드 실측 1위 floating-card 패턴 `shadow-[0_2px_16px_0_rgba(0,0,0,0.12)]` (Music player / 카드 hover / floating bottom sheet 등) 와 일치하도록 정정. shadow."2"/."3" 은 그대로(다른 elevation level).

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

## 0.1.7

### Patch Changes

- DS 0.1.7 — 토큰/컴포넌트 정합 + MCP 가이드 보강 + 릴리즈 안전망
  - tokens: elevation 토큰을 Figma 556:2 정합으로 재정의 (shadow["0"]~shadow["3"] + elevationLevel.\* alias), radius policy export 정리, sync-tokens 의 중첩 sizing 객체 지원.
  - react: Card variant="elevated" 제거 (Figma 권위 룰 — shadow 금지). Button/IconButton/WebHeader 가 시멘틱 토큰 우선 룩업으로 변경.
  - mcp: invalid-prop-value 검출 + CLAUDE.md 검증 루프에 tsc 단계 추가, Card/List 가이드를 Figma 권위 룰 기준 재작성, lookup 시 시멘틱 토큰 우선, child process npm path 보정.
  - 릴리즈 인프라: sync-mcpb-version.mjs 가 루트 package.json 도 함께 sync, pack-local-packages.mjs 는 force-sync 대신 root ↔ DS 일치 assert 로 전환 (조용한 다운그레이드 차단).

## 0.1.6

### Patch Changes

- `manifest.json` 버전을 max-DS 동기화 룰에 맞춰 끌어올리기 위한 DS 패키지 patch bump.
  (MCP 도구 통합 / 이모지 금지 / Inspector 자동 마운트는 `@nudge-eap/mcp` 0.1.6 에 들어가 있어, mcpb 릴리즈 워크플로우가 트리거되려면 DS 패키지 버전도 함께 진행해야 함.)

## 0.1.5

### Patch Changes

- MCP 도구 통합 및 이모지 금지 규칙 강화.
  - 13개 도구 → 2개로 통합: `get_guide({ topic })`, `get_setup({ step })` (구버전 이름 호출 시 친절한 deprecation 안내).
  - `get_setup({ step: "inspector" })` 추가 — 외부 프로젝트 `src/main.tsx`를 idempotent 하게 패치해 DsInspector dev-only 마운트.
  - `validate_mockup` 응답에 `workspaceNotice` 필드 추가 — Inspector 미셋업 시 한 줄 안내 (violationCount 미반영).
  - 이모지/텍스트 기호 절대 금지: MCP 응답 문자열에서 이모지 전부 제거(ASCII 마커로 교체), validator 룰 `emoji-banned` / `text-symbol-banned` 신설로 자동 검출.

## 0.1.5

### Patch Changes

- 브랜드 라인업 정리(Moneple → Geniet) + MCP 서버 리팩터(tools/ 분리, usage-tracker 레이어 분할, setup 클러스터 분리, pre-push smoke 자동화). DS 공개 API 변화 없음 — patch.
