# @nudge-eap/icons

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
