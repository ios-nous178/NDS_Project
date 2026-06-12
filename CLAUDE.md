# Nudge Design System

EAP 멘탈케어 플랫폼 디자인 시스템 모노레포. 5개 브랜드: **Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile**.

## DS 사용 규칙 SSOT

외부 프로젝트(npm 으로 DS 를 소비하는 쪽)에서 적용되는 작업 규칙은 모두 **MCP 가 SSOT** 입니다.
이 모노레포의 CLAUDE.md 에는 DS 사용 규칙을 중복 작성하지 않습니다. 규칙을 바꾸려면 아래 파일을 수정하세요.

- `packages/mcp/src/tools/guides.ts` — `getClaudeMdTemplate` (외부 프로젝트가 받는 CLAUDE.md 본문)
- `packages/mcp/guides-src/{components,patterns}/<Name>.md` — **컴포넌트/패턴 가이드 본문 SSOT** (가이드 하나=파일 하나, frontmatter=구조 필드 / 본문=prose·코드 섹션). 수정 후 `pnpm --filter @nudge-design/mcp build:guides` 로 `src/guides.generated.ts` 재생성해 같이 커밋 (`pnpm lint` 의 check-ssot 가 stale 차단)
- `packages/mcp/src/guides.ts` — 원칙 / 어드민 / UX라이팅 / 아이콘 메타 본문 (`DESIGN_PRINCIPLES` / `ADMIN_CMS_GUIDE` 등) + 가이드 re-export

작업 중 규칙을 직접 확인해야 하면 MCP 도구 호출:

- `get_guide({ topic: 'principles' })` / `get_guide({ topic: 'dos-donts' })` — 브랜드 톤, 시멘틱, 금지 패턴
- `get_guide({ topic: 'component:<Name>' })` — props 함정 포함 (Chip.label, Select.onValueChange, Tabs.onTabChange 등)
- `get_guide({ topic: 'pattern:<name>' })` — cta-group / icon-color / notice / dropdown / dense-list
- `get_guide({ topic: 'admin-cms' })` — CMS / 어드민 화면 규칙
- `find_component` / `find_icon` / `find_token` — 추측 없이 조회 (인자 없으면 전체, `{ query }` fuzzy, `{ name }` 정확 매치)

## 스킬 (이 레포 전용 워크플로우)

반복 작업은 슬래시 스킬로 굳혀 뒀습니다. 해당 상황이면 먼저 스킬을 부르세요. (전체 절차/게이트는 각 `SKILL.md` 에)

- `/ds-component <figma>` — Figma 컴포넌트 **생성/업데이트** (react+styles+html 3면 미러 + 스토리·AllComponents·MCP 가이드·검증·스토리북)
- `/ds-fix <붙여넣은 피드백>` — 목업 피드백 → **DS 자율 수정 루프** (컴포넌트/토큰/패턴/검증룰 트리아지·라우팅. 컴포넌트는 /ds-component 재사용)
- `/ds-audit [Component|all]` — **DS 정합성·완전성 감사** (3면 미러 drift · 외부전파 누락 · 토큰 위반 · figma sync · 브랜드 커버리지)
- `/ds-release` — **MCPB 릴리즈** (changeset → version → 비개발자 톤 release notes → push)
- `/prd-extract <figma|png>` — 기획서 → 상세 PRD 마크다운

스킬은 두 트리에 산다 — `.claude/skills/`(SSOT) + `.agents/skills/`(Codex 생성본). 공유 스킬(ds-component·ds-audit·ds-release) **본문은 `.claude/skills/` 만 고치고 `pnpm sync:skills`** 로 Codex 쪽 재생성(`.agents` 직접 수정 금지). `pnpm lint` 의 `sync-skills.mjs --check` 가 drift 차단. 레지스트리는 `scripts/sync-skills.mjs` 상단.

## 환경 세팅

```bash
node -v                                 # 24.x 필요
pnpm -v || npm install -g pnpm@9
pnpm install
pnpm build --filter @nudge-design/tokens   # 컴포넌트가 의존
pnpm --filter storybook dev             # 스토리북 → http://localhost:6006
```

Windows: PowerShell 권장. `pnpm` 설치 시 실행 정책 문제가 나면
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## 주요 커맨드

| 명령                                                      | 설명               |
| --------------------------------------------------------- | ------------------ |
| `pnpm --filter storybook dev`                             | 스토리북 개발 서버 |
| `pnpm build`                                              | 전체 빌드          |
| `pnpm build --filter @nudge-design/tokens`                | 토큰만 빌드        |
| `npx tsc --noEmit --project apps/storybook/tsconfig.json` | 타입 체크          |

## 주요 디렉토리

```
packages/react/src/     ← DS 컴포넌트 (.tsx) — Props 는 여기서 확인
packages/styles/src/    ← 컴포넌트 CSS (토큰 참조, react/html 공용)
packages/html/src/      ← 바닐라 웹컴포넌트 (nds-*) — react 미러
packages/tokens/src/    ← 디자인 토큰
packages/mcp/src/       ← MCP 서버 (외부 프로젝트가 받는 가이드 SSOT)
  server.ts             ← MCP 서버 엔트리 (툴 등록 / find_token / suggest_replacement 등)
  tools/guides.ts       ← getClaudeMdTemplate (get_setup({ step: 'claude-md' }) 본문) + get_guide
  guides-src/           ← 컴포넌트/패턴 가이드 본문 SSOT (.md — build:guides 가 guides.generated.ts 생성)
  guides.ts             ← 원칙 / 어드민 / UX라이팅 가이드 본문 + 가이드 re-export
apps/storybook/         ← 스토리북 (DS 컴포넌트 데모용)
DESIGN.md               ← 디자인 토큰 YAML 정의
```

## DS 자체에 기여하기

변경이 **외부 프로젝트까지 전파되려면** MCP 가이드와 MCPB 릴리즈까지 같이 손대야 합니다.
대부분 위 **스킬**(`/ds-component`·`/ds-fix`·`/ds-release`)이 이 절차를 끝까지 끌고 갑니다 — 아래는 손으로 할 때의 표면 quick-ref. 자주 누락되는 항목은 ★.

### DS 편입 기준 (admission)

컴포넌트 1개 = 미러 3면 + 스토리 + 카탈로그 + MCP 가이드 + parity + 테스트 비용. 편입 전 체크:

1. **2+ 브랜드에서 사용** 또는 브랜드 전용이어야 하는 명시적 사유 (예: 캐포비 어드민 패턴)
2. **Figma 가이드 노드 존재** (`figmaNodeUrl`) — 디자인 근거 없는 컴포넌트는 받지 않는다
3. **앱 비즈니스 로직 없음** — 데이터 fetch/도메인 규칙이 들어가면 앱 컴포넌트
4. **react + html 미러 동시 제공이 기본** — 단면 제공은 `mirror-parity-baseline.json` 에 사유 박제 필수 (예: Asset=react 유틸, BrandChrome=html 목업 셸)

### 신규 컴포넌트 추가 (전체 자동화는 `/ds-component`)

| 단계                          | 위치 / 명령                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 구현 (react)                  | `packages/react/src/{Component}.tsx`                                                                                                 |
| 스타일                        | `packages/styles/src/{Component}.ts`                                                                                                 |
| HTML 웹컴포넌트               | `packages/html/src/components/nds-{component}.ts` (+ `index.ts`, observedAttributes)                                                 |
| Export                        | `packages/react/src/index.ts` · `packages/html/src/index.ts`                                                                         |
| Storybook 스토리              | `apps/storybook/src/stories/{Component}.stories.tsx`                                                                                 |
| ★ 카탈로그                    | `apps/storybook/src/stories/AllComponents.stories.tsx` — import + 엔트리 추가                                                        |
| ★ MCP 가이드 (외부 전파 핵심) | `packages/mcp/guides-src/components/{Name}.md` — props 함정 · 매트릭스 · `figmaNodeUrl` (+ `build:guides` 재생성)                    |
| 타입체크                      | `npx tsc --noEmit --project apps/storybook/tsconfig.json`                                                                            |
| ★ 미러 parity                 | `pnpm lint:mirror-parity` — react↔html set/enum drift 게이트. 의도된 divergence 면 `pnpm lint:mirror-parity:update` 로 baseline 갱신 |

### 신규 / 수정 토큰

1. `packages/tokens/src/{colors|spacing|typography|elevation|motion|...}.ts` 수정
2. 시멘틱은 두 갈래만 사용 — Figma 정합 토큰은 `--semantic-*` (색: bg/text/icon/fill/border/button*/input + 여백: gap/gap-title/inset 모두 SSOT 1:1 미러), DS 자체 컴포넌트 슬롯은 `--nds-*` (`--nds-sidebar-_`, `--nds-chip-_`, `--nds-{brand}-_` 등). raw hex 신규 추가 금지. 옛 prefix(`--eap-_`, `--color-semantic-_`)는 폐기. `--gap-_`/`--inset-_`는`--semantic-gap-_`/`--semantic-inset-\*`의 deprecated alias — 새 코드는`--semantic-` prefix 사용.
3. 토큰 정의 의도는 `DESIGN.md` YAML 에도 동기화
4. `pnpm build --filter @nudge-design/tokens` (의존 패키지가 import 하므로 필수)
5. ★ `pnpm lint:brand-completeness` — base 시멘틱 leaf 는 4개 브랜드에 **명시 정의 or waiver**(`scripts/brand-completeness-baseline.json`, 사유 필수) 둘 중 하나여야 한다. silent base-fallback(브랜드 화면에 base 파랑이 새는 버그 클래스) 차단 게이트. `--nds-*` 슬롯명 오타(소비처 없는 슬롯)도 함께 검출.

### 가이드 · 패턴 · 원칙만 추가

- 컴포넌트/패턴 본문: `packages/mcp/guides-src/{components,patterns}/<Name>.md` (+ `pnpm --filter @nudge-design/mcp build:guides`) · 원칙: `guides.ts` 의 `DESIGN_PRINCIPLES`
- 컴포넌트 가이드에는 가능하면 `figmaNodeUrl` 까지 — `list_figma_sync_status` 로 sync 누락 점검

### 외부 전파 (MCPB 릴리즈) → `/ds-release`

릴리즈 전체 절차(changeset → `pnpm version-packages` → 비개발자 톤 `.release-notes/pending.md` → push)와 슬랙 공유용 톤 가이드는 **`/ds-release` 스킬**에 있습니다. 스캔용 핵심만:

- **버전 SSOT** = DS 4개 패키지(`@nudge-design/{react,tokens,icons,tailwind-preset}`)의 `package.json`. 루트 `package.json`·`packages/mcp/manifest.json` 은 미러 — `sync-mcpb-version.mjs` 가 sync(CI `pnpm lint` 가 drift 차단).
- 워크플로우 트리거 경로: `packages/{mcp,tokens,react}/src/**`, `packages/icons/svg/**`, `packages/mcp/manifest.json`. **`manifest.json` version 이 기존 tag 와 같으면 release skip** → version bump 자동 동기화가 핵심.
- 가이드/원칙만 바꿔도 외부 전파 필요하면 `pnpm changeset` 으로 영향 패키지 골라 patch bump.
- `@nudge-design/mcp`(내부)는 의도적으로 분리 — 함께 bump 하려면 changeset 에 명시.
