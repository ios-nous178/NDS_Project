---
name: ds-component
description: >-
  Figma 디자인 가이드(URL/노드)를 받아 Nudge DS 컴포넌트를 생성 또는 업데이트한다. react 패키지 + styles
  패키지 + html 웹컴포넌트 + Storybook(스토리·AllComponents 카탈로그) + MCP 가이드 + 데스크탑 카탈로그 +
  검증/테스트까지 한 번에 미러로 손보고, 마지막에 Storybook 을 띄워 시각 확인을 받는다. 트리거: "이 Figma
  컴포넌트 만들어줘/업데이트해줘", "<figma.com/...> DS 에 반영", "디자인가이드 주면 컴포넌트 생성/수정",
  "/ds-component <figma-url>". 단순 목업 작성이나 토큰만 추가는 이 스킬이 아니다.
---

# ds-component — Figma → Nudge DS 컴포넌트 (생성/업데이트)

Figma 디자인 가이드를 받아 DS 컴포넌트를 **모든 표면에 미러로** 반영하고, **Storybook 을 띄워 시각 확인**까지 가는 플로우. 이 레포에서 컴포넌트 한 개를 손보면 빠뜨리기 쉬운 단계(외부 전파·토큰 정합·3면 미러)를 게이트로 강제한다.

## 카디널 룰 (먼저 읽기 — 이걸 어기면 회귀)

1. **Storybook = 시각 정답(SSOT).** 스토리북이 보여주는 모습에 컴포넌트를 맞춘다. 반대로 스토리를 컴포넌트에 맞추지 않는다.
2. **토큰-퍼스트, raw hex/px 금지.** 색은 semantic 토큰(`cv.*` / `--semantic-*`), 크기는 `sizing.*`/`spacing.*`/`radius.*`. **Figma hex 가 어떤 토큰에도 안 맞으면 새 값을 지어내지 말고 멈춰서 사용자/디자이너에게 flag.** (예: 토글 `#60be34`, 보더 `#111` — 토큰 부재 시 보고)
3. **브랜드는 cascade 로.** 컴포넌트는 hex 를 박지 않는다. 브랜드 분기(예: 캐포비 admin input 40px/radius4, 캐포비 시그니처 검정 버튼)는 `data-brand` cascade + `--nds-*` 슬롯/시멘틱 토큰으로. Figma 노드의 브랜드/페이지로 어느 브랜드인지 먼저 파악.
4. **3면 미러 lockstep.** `react .tsx` ↔ `styles .ts` ↔ `html nds-*.ts` 는 같은 클래스명·`data-slot`·동작·치수를 공유한다. 하나만 고치고 끝내지 않는다.
5. **외부 전파는 1급 단계** (가장 자주 누락). Storybook 스토리 + **AllComponents 카탈로그** + **MCP 가이드(guides.ts)** + **changeset**. 빠지면 외부 프로젝트에 전파 안 됨.

## 표면 맵 (어디를 건드리나)

| 표면               | 경로                                                                                    | 비고                                                                         |
| ------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| React 구현         | `packages/react/src/{Component}.tsx`                                                    | Props 는 여기가 정의처                                                       |
| React export       | `packages/react/src/index.ts`                                                           | `export * from "./{Component}"`                                              |
| 스타일(CSS)        | `packages/styles/src/{Component}.ts`                                                    | 토큰 참조 CSS. `--nds-*` 슬롯 + `:where()`                                   |
| HTML 웹컴포넌트    | `packages/html/src/components/nds-{component}.ts`                                       | `observedAttributes`, `data-slot` 미러, 런타임 등록                          |
| HTML export        | `packages/html/src/index.ts`                                                            | `export { Nds{Component} }`                                                  |
| Storybook 스토리   | `apps/storybook/src/stories/{Component}.stories.tsx`                                    | interaction test 포함 권장                                                   |
| ★ 카탈로그         | `apps/storybook/src/stories/AllComponents.stories.tsx`                                  | import + 엔트리 (자주 누락)                                                  |
| ★ MCP 가이드       | `packages/mcp/src/guides.ts` `COMPONENT_GUIDES`                                         | summary·pitfalls·examplesHtml(do/dont)·`figmaNodeUrl`·sizeMatrix·stateMatrix |
| 토큰(신규 필요 시) | `packages/tokens/src/**` + `DESIGN.md`                                                  | 새 시멘틱 토큰은 base + 브랜드. `pnpm build --filter @nudge-design/tokens`   |
| 데스크탑 검증      | `apps/desktop/src/main/catalog.ts` / `packages/mockup-core/src/tools/catalog-config.ts` | 새 `nds-*` 태그/attr 이면 검증 컨텍스트에 들어가는지 확인                    |
| 테스트             | `packages/react/test/**`, `packages/html/test/**`                                       | 동작/DOM parity                                                              |
| changeset          | `.changeset/{name}.md`                                                                  | react/styles/html (minor 또는 patch) + mcp patch                             |

## 플로우

### Phase 0 — 인테이크 & 생성/업데이트 판별

- Figma URL → `fileKey` + `nodeId` 추출. `get_screenshot` + `get_metadata` + `get_design_context` 로 구조/치수/색/상태/브랜드를 읽는다. (큰 화면이면 컴포넌트 인스턴스 노드만 design_context.)
- 컴포넌트 이름 확정. **존재 여부 확인**: `find_component({ name })`(MCP) + `ls packages/react/src | grep -i {name}`.
  - 없으면 → **신규 생성**(풀 표면).
  - 있으면 → **업데이트**(기존 구현 읽고 diff. 새 컴포넌트/새 토큰 슬롯을 함부로 만들지 말 것 — 기존 패턴 재사용).
- 브랜드 스코프 파악(base 공통 vs 특정 브랜드 분기).

### Phase 1 — 스펙 추출 (토큰-퍼스트)

- 모든 치수 → `sizing.*`/`spacing.*`/`radius.*` 토큰 버킷으로 라운드(가장 가까운 값). raw px 는 geometry(예: 특정 radius)만.
- 모든 색 → `find_token({ query })` 로 semantic 토큰 매칭. **매핑 실패 hex 는 flag**(지어내지 않음).
- 상태 매트릭스(default/hover/active/disabled/checked…), 사이즈 변형, 브랜드 분기, 인터랙션을 정리.
- 같은 역할 컴포넌트의 기존 토큰/패턴을 먼저 본다(`get_guide({ topic: 'component:<Near>' })`, `get_guide({ topic: 'principles' | 'dos-donts' })`).

### Phase 2 — 구현 (3면 미러)

- `react/src/{Component}.tsx` 작성/수정 + `index.ts` export.
- `styles/src/{Component}.ts` — 토큰 참조 CSS. `:where()` 로 0-specificity, `--nds-{component}-*` 슬롯으로 브랜드 override 여지.
- `html/src/components/nds-{component}.ts` — 같은 class/`data-slot`/치수. `observedAttributes`, 속성 forward, 런타임 등록. `index.ts` export.
- 세 면의 클래스명·slot·동작·치수가 동일한지 교차 확인.

### Phase 3 — 카탈로그 & 문서 (외부 전파)

- `stories/{Component}.stories.tsx` — 변형/상태 스토리 + 가능하면 interaction test(play).
- `AllComponents.stories.tsx` 에 import + 엔트리 추가. (★)
- `guides.ts` `COMPONENT_GUIDES.{Component}` — summary, pitfalls(props 함정·혼동 컴포넌트), examplesHtml(do/dont), `figmaNodeUrl`, sizeMatrix/stateMatrix. (★)

### Phase 4 — 데스크탑 & 검증 컨텍스트

- 새 `nds-*` 태그/attr enum 을 추가했으면 `catalog-config`(deriveHtmlValidationContext)·데스크탑 `catalog.ts` 가 잡는지 확인(둘이 같은 SSOT 헬퍼를 써야 함).

### Phase 5 — 검증 게이트 (전부 통과해야 진행)

- 타입체크(건드린 패키지별):
  - `npx tsc --noEmit --project packages/react/tsconfig.json`
  - `... packages/styles/tsconfig.json`, `... packages/html/tsconfig.json`, `... packages/mcp/tsconfig.json`
  - `npx tsc --noEmit --project apps/storybook/tsconfig.json`
  - (tsc 종료코드는 파이프 없이 직접 확인 — `grep` 종료코드와 혼동 주의)
- 테스트:
  - react/html: 해당 패키지에서 `npx vitest run`
  - mockup-core: `npx tsx --test packages/mockup-core/src/tools/<file>.test.ts` (또는 `npm test`)
- **입력 컴포넌트 포커스 보존 테스트(하드 게이트)** — 컴포넌트가 input/textarea 를 만들거나 `nds-search-input` 을 합성하면:
  - `packages/html/test/helpers/focus-preservation.ts` 헬퍼로 **양면 잠금** — ① 타이핑 중 input 노드/포커스/커서 보존 ② 외부 attribute 갱신 후 보존 (예시: `nds-search-input.test.ts` / `nds-multi-select.test.ts`).
  - html 구현은 mount-once 패턴 필수 — input 은 `_mount()` 에서 한 번만 만들고 `update()` 는 값/노출만 패치 (`replaceChildren` 으로 input 재생성 금지 — AddressPicker "한 글자마다 끊김" 회귀 클래스).
  - `pnpm lint:input-focus` 통과 확인 (`scripts/check-input-tests.mjs` — 신규 컴포넌트는 ALLOWLIST 에 넣지 말고 테스트를 쓴다).
- 토큰 빌드(토큰 손댔으면): `pnpm build --filter @nudge-design/tokens` → 의존 패키지 빌드.
- **정합 검증("스타일 다 맞아?")** — 빌드된 브랜드 CSS 실측값을 Figma 치수와 대조:
  - `packages/html/dist/standalone/brand.*.css` 에서 `--nds-*` / 토큰 resolved 값을 grep → Figma metadata(height/padding/radius/color)와 1:1 비교. 어긋나면 컴포넌트가 아니라 **토큰/브랜드 cascade** 를 의심.
- HTML 산출물 검증: 예시 마크업에 `validate_html_mockup` (위반 0).

### Phase 6 — changeset + Storybook 띄우기

- `pnpm changeset` (대화형) 또는 `.changeset/{kebab-name}.md` 직접 작성 — 영향 패키지/레벨/한 줄 요약. (NoticeAlert/Input/Toggle changeset 포맷 참고: react/styles/html minor, mcp patch.)
- **Storybook 실행**(백그라운드)로 마무리:
  - `pnpm --filter storybook dev` → http://localhost:6006
  - 해당 스토리 딥링크 안내: `http://localhost:6006/?path=/story/components-{component-kebab}--<story>`
- **여기서 멈춘다.** 검증 결과 요약 + 스토리북 URL 을 보고하고 **사람의 시각 확인/커밋을 기다린다. 자동 커밋하지 않는다.**

## 흔한 함정 (이 레포 실측 회고)

- 외부 산출물에도 적용돼야 하는데 데스크탑 전용으로만 짜서 누락 → 게이트(`stampBar` 등) 확인.
- 캐포비 input 은 admin density 40px/radius4 를 **전역 cascade** 로 강제 → 더 큰 auth 사이즈가 필요하면 토큰 충돌. Figma 와 안 맞으면 토큰 레벨 결정 필요.
- `:where()` 는 specificity 0 → override 규칙은 **순서상 뒤에** 둬야 이긴다.
- AllComponents 카탈로그/MCP 가이드/ changeset 누락이 "외부 전파 안 됨"의 3대 원인.
- 동시 세션 충돌: 작업 전 `git status` 로 대상 파일이 이미 dirty 하면(다른 세션) 손대지 말 것.

## 안 하는 것

- 자동 커밋/푸시(사용자가 리뷰 후 직접). 릴리즈(MCPB)는 별도 — 이 스킬은 changeset 까지만.
- 단순 목업 작성(→ 목업 스킬), 토큰만 추가(→ 토큰 절차).
