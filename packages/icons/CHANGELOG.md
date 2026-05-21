# @nudge-eap/icons

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

- 7528bb7: Trost 브랜드 전용 아이콘 17종을 `@nudge-eap/icons` 에 편입.

  ### TrostAstroHomepage 운영 SVG 정제
  - `TrostAstroHomepage` 레포 `public/images` 하위 SVG 중 UI 의미가 명확한 17개만 DS 표준(viewBox 24×24, currentColor) 으로 정제해서 svg/ 에 `trost-*.svg` prefix 로 추가. 일러스트(`img-test-*`, `img-banner-*`) 와 비정사각형 rank 4종(26×18) 은 비율 왜곡 우려로 제외.
  - 컴포넌트: TrostMentalDepression/Emotion/Event/Mbti/Medicine/Routine/Selfesteem/Sound/LocationHospitalIcon (9 — 멘탈 카테고리), TrostTestresultSafe/Warning/DangerIcon (3 — 검사 결과 상태), TrostLinkCircleIcon · TrostPlusCircleIcon (2 — SNS 공유/추가), TrostEnergyCoinIcon (1 — Trost 화폐), TrostPsychTestIcon (1 — 심리검사 카테고리), TrostMindkeySymbolIcon (1 — 마인드키 심볼).
  - 변환 일회성 헬퍼: `packages/icons/scripts/import-trost.mjs` — 원본 viewBox(18/20/24/28/32/60) 를 24 컨테이너로 transform-scale 한 뒤 fill/stroke hex 를 currentColor 로 일괄 치환. 마스크 안 흰색(`#fff`, `#FEFEFE`) 과 `none`·`url(...)` 참조는 보존. `<path d="M0 0hNvNH0z"/>` 류 placeholder bbox 는 제거.

  ### 카탈로그
  - 신규 `Brands/Trost/Icons` 스토리(`Icons.Trost.stories.tsx`) — Trost prefix 아이콘만 필터한 카탈로그. 전체 / Brand 색(cobalt) / Size 32(mental 칩) / Size 20 / 다크 배경 5 variant. Geniet 카탈로그와 동일 패턴.
  - 기존 공용 카탈로그(`Icons.stories.tsx`) 는 `Object.entries(Icons)` 자동 인덱싱이라 신규 17개가 자동 노출.

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
