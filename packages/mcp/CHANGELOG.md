# @nudge-eap/mcp

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
