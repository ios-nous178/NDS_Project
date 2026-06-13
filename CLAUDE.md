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

루트 `AGENTS.md` 도 같은 원리의 생성물 — **이 CLAUDE.md 가 SSOT**, 수정 후 `pnpm sync:agents-md` 로 재생성(AGENTS.md 직접 수정 금지, Codex 전용 내용은 `<!-- codex:begin/end -->` 블록만 보존). `pnpm lint` 가 drift 차단.

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

| 명령                                                      | 설명                                                                                         |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm --filter storybook dev`                             | 스토리북 개발 서버                                                                           |
| `pnpm build`                                              | 전체 빌드                                                                                    |
| `pnpm build --filter @nudge-design/tokens`                | 토큰만 빌드                                                                                  |
| `npx tsc --noEmit --project apps/storybook/tsconfig.json` | 타입 체크                                                                                    |
| `pnpm fix`                                                | **커밋 전 필수** — 모든 파생 생성물을 올바른 빌드 순서로 일괄 재생성 (CI 게이트와 동일 기준) |

## 커밋 전 게이트 (CI 안 터지게)

CI 실패의 최다 원인은 **생성물 커밋 누락** — 16개 `--check` 게이트는 검증만 하고 재생성은 안 해준다.

1. **커밋 전 `pnpm fix`** — 생성물(guides.generated.ts·catalog.json·metadata/\*·tokens src 등) 일괄 재생성. 출력된 "재생성된 파일" 목록을 변경분과 **같이 커밋**한다.
2. pre-commit(husky)과 Claude Code hook 이 `scripts/precommit-gate.mjs`(staged 기반 무빌드 선별 게이트, ~1초)를 자동 실행해 drift 를 차단한다. 비상시 `git commit --no-verify`.
3. 게이트 정의는 `scripts/gates.mjs` 가 SSOT — check-ssot(CI)·fix-all(`pnpm fix`)·precommit-gate 가 공유. 게이트 추가/변경은 거기 한 곳만.
4. DS 패키지 소스를 고치면 `pnpm changeset`, 의존성을 바꾸면 `pnpm-lock.yaml` 도 같이 — gate 가 경고로 알려준다.

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

배포 패키지(tokens/icons/assets/react/html/tailwind-preset)는 **Node-로더블 ESM**(`type: module` + tsc NodeNext) — 소스의 상대 임포트는 `.js` 확장자 필수(`from "./Button.js"`, tsc 가 누락 시 에러). icons 의 src barrel 은 `scripts/generate.cjs` 가 생성하므로 specifier 규칙 변경 시 생성기도 같이 수정.

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

### 브랜드 차이는 토큰으로만 — 컴포넌트에 브랜드 분기 금지 (★)

컴포넌트 스타일은 **브랜드를 모른다**. 색·배경·보더·radius 의 브랜드별 차이는 컴포넌트가 참조하는 토큰 하나(`cv.*` 또는 `--nds-*` 슬롯)를 **브랜드 토큰 파일(`packages/tokens/src/brands/<brand>.ts`)이 값만 덮어서** 컴포넌트로 흘려보낸다. 컴포넌트 `*.ts` 스타일/색 맵에 다음을 박지 않는다:

- ❌ `[data-brand="..."]` 셀렉터로 색·배경·보더를 갈아끼우는 오버라이드 블록 (예: 현재 Snackbar/Modal/Popup/Tooltip 등의 cashwalk-biz 카드 블록 — 마이그레이션 대상). → 해당 슬롯(`--nds-snackbar-*` 등)을 만들고 브랜드 파일에서 값만 override.
- ❌ `cv.*` 헬퍼를 우회한 raw `var(--semantic-*)` 문자열·하드코딩 hex·타 컴포넌트 토큰 차용. → 자기 컴포넌트 토큰을 `cv.*` 로 참조 (`Button.tsx` styleMap·`Chip.tsx` 색 맵이 모범).

이유: 브랜드 분기가 컴포넌트에 흩어지면 (1) 신규 브랜드 추가 시 전 컴포넌트를 뒤져야 하고 (2) `pnpm lint:brand-completeness` 게이트가 못 잡으며 (3) 한 컴포넌트가 토큰 SSOT 를 우회해 drift 가 샌다.

예외 — 토큰으로 표현 불가한 **구조적** 차이(요소 추가/숨김 등)에 한해 `[data-brand]` 허용. 단 그 안에서도 색·간격·radius 는 반드시 토큰. 기존 위반 인벤토리는 작업 메모리 `token-drift.md` 참고.

#### 색은 슬롯에 넣고 우선순위로 합성 — variant × brand (★ 마이그레이션 패턴)

**원칙: 컴포넌트 CSS 는 색을 "직접" 박지 않는다.** 항상 `--nds-*` 슬롯에 넣고, `var()` 폴백 체인으로 **brand > variant > 기본** 우선순위를 합성한다 — 그래야 컴포넌트가 브랜드·variant 어느 쪽도 모른 채 한 자리에서 합성된다. (`background: var(--semantic-bg-status-info)` 처럼 variant 룰이 색을 직접 박는 옛 패턴은 브랜드가 그 위를 `[data-brand]` cascade 로만 덮을 수 있어 컴포넌트에 브랜드 분기가 새는 원인.)

패턴 (예: Snackbar 배경):

```css
/* 컴포넌트 root — ① 브랜드 override > ② variant > ③ 기본 */
background: var(--nds-snackbar-bg, var(--nds-snackbar-variant-bg, /* ③ */ ${cv.surface.section}));
/* variant 룰은 background 를 직접 안 박고 ② 슬롯만 set, 값은 글로벌 시멘틱 참조 */
:where(.nds-snackbar[data-variant="info"]) { --nds-snackbar-variant-bg: var(--semantic-bg-status-info); }
```

- **① `--nds-{c}-{prop}`** — 브랜드 서피스 override. 브랜드 파일 `components.{c}.{prop}` 가 emit. variant 를 통째로 덮음(예: 캐포비 Snackbar "variant 무시 흰카드"). 평소엔 unset → ②로 폴백.
- **② `--nds-{c}-variant-{prop}`** — variant 룰이 set. 값은 ③ 글로벌 시멘틱을 참조.
- **③ 글로벌 시멘틱 `--semantic-*-status-*`** — variant 색의 **브랜드 커스텀 지점**. 브랜드 `semantic.ts` 에서 `--semantic-bg-status-info` 등을 덮으면 그 색을 쓰는 **모든** 컴포넌트(Snackbar·Banner·NoticeAlert…)가 따라간다.

작동 원리: 룰이 전부 `:where()`(특정성 0)라 옛날엔 `[data-brand]` 블록을 **source-order 뒤**에 둬서 variant 를 덮었다. 이를 **`var()` 우선순위 + custom property 상속**으로 대체 — ①(`--nds-snackbar-bg`)이 `[data-brand]`/`:root` 조상에 정의되면 상속돼 var 체인 최우선으로 이기므로, variant 룰의 특정성과 무관하게 브랜드가 이긴다.

**확장(YAGNI)** — "브랜드 X 가 *이 컴포넌트의* info 만 글로벌과 다르게"(예: Banner info ≠ Snackbar info)는 ③(글로벌)으론 안 된다. 그땐 ②를 `var(--nds-snackbar-info-bg, var(--semantic-bg-status-info))` 로 **한 겹 끼우면** 컴포넌트-per-variant 슬롯이 생긴다. **단 실제 요구가 생기기 전엔 만들지 않는다** — 4 variant × N prop × M 컴포넌트로 슬롯 폭발 금지. 캐포비는 ①만 필요하므로 지금은 ①+②③ 만 구현.

**여전히 예외** — "요소 추가/숨김"(예: Input 캐포비 에러 아이콘 `::before` 의 content+mask)은 색·값이 아니라 마크업 차이라 토큰화 불가 → `[data-brand]` 구조적 예외 유지(위 참조).

### 가이드 · 패턴 · 원칙만 추가

- 컴포넌트/패턴 본문: `packages/mcp/guides-src/{components,patterns}/<Name>.md` (+ `pnpm --filter @nudge-design/mcp build:guides`) · 원칙: `guides.ts` 의 `DESIGN_PRINCIPLES`
- 컴포넌트 가이드에는 가능하면 `figmaNodeUrl` 까지 — `list_figma_sync_status` 로 sync 누락 점검

### 외부 전파 (MCPB 릴리즈) → `/ds-release`

릴리즈 전체 절차(changeset → `pnpm version-packages` → 비개발자 톤 `.release-notes/pending.md` → push)와 슬랙 공유용 톤 가이드는 **`/ds-release` 스킬**에 있습니다. 스캔용 핵심만:

- **버전 SSOT** = DS 4개 패키지(`@nudge-design/{react,tokens,icons,tailwind-preset}`)의 `package.json`. 루트 `package.json`·`packages/mcp/manifest.json` 은 미러 — `sync-mcpb-version.mjs` 가 sync(CI `pnpm lint` 가 drift 차단).
- 워크플로우 트리거 경로: `packages/{mcp,tokens,react}/src/**`, `packages/icons/svg/**`, `packages/mcp/manifest.json`. **`manifest.json` version 이 기존 tag 와 같으면 release skip** → version bump 자동 동기화가 핵심.
- 가이드/원칙만 바꿔도 외부 전파 필요하면 `pnpm changeset` 으로 영향 패키지 골라 patch bump.
- `@nudge-design/mcp`(내부)는 의도적으로 분리 — 함께 bump 하려면 changeset 에 명시.
