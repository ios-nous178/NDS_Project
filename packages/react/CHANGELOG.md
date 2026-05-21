# @nudge-eap/react

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
