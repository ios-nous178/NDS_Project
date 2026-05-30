# Nudge Design System

EAP 멘탈케어 플랫폼 디자인 시스템 모노레포. 5개 브랜드: **Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile**.

## DS 사용 규칙 SSOT

외부 프로젝트(npm 으로 DS 를 소비하는 쪽)에서 적용되는 작업 규칙은 모두 **MCP 가 SSOT** 입니다.
이 모노레포의 CLAUDE.md 에는 DS 사용 규칙을 중복 작성하지 않습니다. 규칙을 바꾸려면 아래 파일을 수정하세요.

- `packages/mcp/src/server.ts` — `getClaudeMdTemplate` (외부 프로젝트가 받는 CLAUDE.md 본문)
- `packages/mcp/src/guides.ts` — 컴포넌트 / 패턴 / 원칙 / 어드민 가이드 본문

작업 중 규칙을 직접 확인해야 하면 MCP 도구 호출:

- `get_guide({ topic: 'principles' })` / `get_guide({ topic: 'dos-donts' })` — 브랜드 톤, 시멘틱, 금지 패턴
- `get_guide({ topic: 'component:<Name>' })` — props 함정 포함 (Chip.label, Select.onValueChange, Tabs.onTabChange 등)
- `get_guide({ topic: 'pattern:<name>' })` — cta-group / icon-color / notice / dropdown / dense-list
- `get_guide({ topic: 'admin-cms' })` — CMS / 어드민 화면 규칙
- `find_component` / `find_icon` / `find_token` — 추측 없이 조회 (인자 없으면 전체, `{ query }` fuzzy, `{ name }` 정확 매치)

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
| `pnpm build --filter @nudge-design/tokens`                   | 토큰만 빌드        |
| `npx tsc --noEmit --project apps/storybook/tsconfig.json` | 타입 체크          |

## 주요 디렉토리

```
packages/react/src/     ← DS 컴포넌트 (.tsx) — Props 는 여기서 확인
packages/tokens/src/    ← 디자인 토큰
packages/mcp/src/       ← MCP 서버 (외부 프로젝트가 받는 가이드 SSOT)
  server.ts             ← getClaudeMdTemplate (get_setup({ step: 'claude-md' }) 본문)
  guides.ts             ← 컴포넌트 / 패턴 / 원칙 / 어드민 가이드
apps/storybook/         ← 스토리북 (DS 컴포넌트 데모용)
DESIGN.md               ← 디자인 토큰 YAML 정의
```

## DS 자체에 기여하기

변경이 **외부 프로젝트까지 전파되려면** MCP 가이드와 MCPB 릴리즈까지 같이 손대야 합니다.
자주 누락되는 항목은 ★.

### 신규 컴포넌트 추가

| 단계                          | 위치 / 명령                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| 구현                          | `packages/react/src/{Component}.tsx`                                                        |
| Export                        | `packages/react/src/index.ts`                                                               |
| Storybook 스토리              | `apps/storybook/src/stories/{Component}.stories.tsx`                                        |
| ★ 카탈로그                    | `apps/storybook/src/stories/AllComponents.stories.tsx` — import + 엔트리 추가               |
| ★ MCP 가이드 (외부 전파 핵심) | `packages/mcp/src/guides.ts` 의 `COMPONENT_GUIDES` — props 함정 · 매트릭스 · `figmaNodeUrl` |
| (선택) 컴포넌트 로컬 가이드   | `packages/react/src/{Component}.guide.ts` (`Badge.guide.ts` / `Chip.guide.ts` 패턴 참고)    |
| 타입체크                      | `npx tsc --noEmit --project apps/storybook/tsconfig.json`                                   |

### 신규 / 수정 토큰

1. `packages/tokens/src/{colors|spacing|typography|elevation|motion|...}.ts` 수정
2. 시멘틱은 두 갈래만 사용 — Figma 정합 토큰은 `--semantic-*` (색: bg/text/icon/fill/border/button*/input + 여백: gap/gap-title/inset 모두 SSOT 1:1 미러), DS 자체 컴포넌트 슬롯은 `--nds-*` (`--nds-sidebar-*`, `--nds-chip-*`, `--nds-{brand}-*` 등). raw hex 신규 추가 금지. 옛 prefix(`--eap-*`, `--color-semantic-*`)는 폐기. `--gap-*` / `--inset-*` 는 `--semantic-gap-*` / `--semantic-inset-*` 의 deprecated alias — 새 코드는 `--semantic-` prefix 사용.
3. 토큰 정의 의도는 `DESIGN.md` YAML 에도 동기화
4. `pnpm build --filter @nudge-design/tokens` (의존 패키지가 import 하므로 필수)

### 가이드 · 패턴 · 원칙만 추가

- 본문: `packages/mcp/src/guides.ts` 의 `COMPONENT_GUIDES` / `PATTERN_GUIDES` / `DESIGN_PRINCIPLES`
- 컴포넌트 가이드에는 가능하면 `figmaNodeUrl` 까지 — `list_figma_sync_status` 로 sync 누락 점검

### ★ 외부 전파 (MCPB 릴리즈)

DS 패키지는 **Changesets** 로 버저닝합니다. 자동화는 `release-mcpb.yml` 이 처리하지만, 변경 기록은 사람이 남겨야 합니다.

```bash
# 1. DS 소스 수정 후 변경 기록 (대화형)
pnpm changeset
#    어떤 패키지가 영향받는지, major/minor/patch, 한 줄 요약 입력
#    → .changeset/{auto-name}.md 생성

# 2. 누적 changeset 일괄 반영
pnpm version-packages
#    → @nudge-design/{react,tokens,icons,tailwind-preset} 의 package.json version bump
#    → CHANGELOG.md 갱신
#    → 후속 스크립트가 자동 실행:
#       · sync-mcpb-version.mjs  : 루트 package.json + packages/mcp/manifest.json 을 최대 DS 버전으로 sync
#       · sync-version-docs.mjs  : docs 버전 표 동기화

# 3. Slack 알림용 비개발자 톤 변경사항 작성  ★ 릴리즈에 항상 포함
#    → .release-notes/pending.md 에 디자이너/PM/QA 가 읽기 좋은 bullet 로 저장
#    → CI 가 이 파일을 발견하면 Slack "이번 업데이트에서 달라진 점" 섹션에 그대로 사용
#    → 파일이 없으면 git log fallback (= 개발자용 raw — 비개발자가 못 읽음)
#    → CI 는 이 파일을 절대 수정하지 않음 (우리가 commit 한 내용 그대로 슬랙으로 나감)
#
#    [Claude CLI 로 릴리즈할 때] (기본 케이스)
#    Claude 가 직접 git log 보고 .release-notes/pending.md 를 비개발자 톤으로 작성한다.
#    pnpm release-notes 스크립트는 굳이 안 돌려도 됨 — Claude 가 곧 모델이라 직접 작성이 더 빠르고 컨텍스트도 풍부.
#    "릴리즈 하자" / "버전 올리자" 같은 요청을 받으면 step 1~2 직후, push 전에 자동으로 이 파일을 만들어
#    같은 commit 에 포함시켜야 한다. (사람이 한 번 읽고 OK 하면 그대로 push)
#
#    [사람이 로컬에서 직접 할 때]
#    pnpm release-notes               # haiku-4-5 가 초안 작성 (ANTHROPIC_API_KEY 필요)
#    pnpm release-notes:dry           # 파일 안 쓰고 결과만 미리 보기
#    또는 .release-notes/pending.md 를 손으로 직접 작성해도 동일하게 동작.

# 4. 변경 커밋 + main push → release-mcpb.yml 가 빌드/태그/슬랙 알림까지 자동
#    GitHub Release body 는 손대지 않음 (개발자용 raw 커밋 로그는 그대로 — 디버깅용)
```

#### 슬랙 공유용 톤 가이드 (`.release-notes/pending.md`)

읽는 사람이 **디자이너 / PM / 기획자 / QA** 라는 전제. 패키지명 · prop 명 · 타입명 · 리팩토링 단어("SSOT 단일화", "리팩터") 같은 코드 용어를 그대로 옮기면 못 읽음 — 효과 / 구조 / 경험으로 번역해서 옮기세요.

**1. 항목 종결은 명사형**

- 동작 표현: `통합 / 단일화 / 표준화 / 강화 / 정리 / 합류 / 도입 / 전환 / 추가 / 개선` 우선. `~했다` 같은 서술형 금지.

**2. 2단 구조 — 항목(1줄) → 하위 bullet(효과 / 세부)**

- 1단: 무엇이 바뀌었는가 (사용자 관점).
- 2단: 왜 좋아졌는가 / 어떤 게 가능해졌는가. 숫자 ("5종 동시 추가"), Before→After 화살표 ("AppBar/WebHeader/AppFooter/WebFooter → `<Header>` / `<Footer>`") 적극 사용.

**3. 큰 릴리즈는 3단 섹션 — `배경` / `주요 변경사항` / `기대효과`**

- minor 이상 (0.x.0) 또는 신규 브랜드 / 신규 컴포넌트 다수가 들어가면 적용.
- patch 한두 건이면 단순 bullet 리스트로 충분.

**4. 번역 예시 (개발자 톤 → 공유용 톤)**

| Before (커밋 / 코드 톤)                                                           | After (공유용 톤)                                                                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `InputGroup 추가, FormField density="admin" 기반 compact admin form 구조 지원`   | **어드민 폼 구조 표준화**<br>· 라벨 / description / 다중 입력 정렬 방식 개선<br>· admin UI 일관성 강화              |
| `AppBar / WebHeader / AppFooter / WebFooter 컴포넌트 unify`                       | **브랜드 헤더 / 푸터 단일화**<br>· `<Header>` / `<Footer>` 하나로 통합<br>· 브랜드 로고 6종 DS 내장 — 호스트 자산 불필요 |
| `feat(mcp): visual reference gate + 5 retro bypass patterns`                     | **MCP 가드레일 강화**<br>· 시각 레퍼런스 확인 단계 추가<br>· 반복 우회 / 재작업 패턴 대응 강화                       |
| `refactor(coverage): brand × component coverage SSOT 단일화`                     | **브랜드별 컴포넌트 커버리지 단일 출처화**<br>· 어떤 브랜드가 어떤 컴포넌트를 지원하는지 한눈에 확인 가능            |

**5. 워크플로우**

- 릴리즈 commit 만들 때 — 위 `step 1~2` 직후, push 전에 Claude 가 `git log` 보고 `.release-notes/pending.md` 작성 → 사람이 한 번 읽고 OK 하면 같은 commit 에 포함.
- 길이: 한 릴리즈당 5~8 항목 권장. 10 넘으면 묶거나 빼세요.

DS 4개 패키지(@nudge-design/{react,tokens,icons,tailwind-preset}) 의 package.json version 이 SSOT 이고, 루트 `package.json` 과 `packages/mcp/manifest.json` 은 둘 다 그 미러입니다. `sync-mcpb-version.mjs` 한 번 실행으로 둘 다 최대 DS 버전으로 끌어올립니다. 루트 미러는 `pack-local-packages.mjs` 가 tarball 파일명에 박는 값이라 자동 sync 가 빠지면 `pack` 이 의도치 않은 다운그레이드를 만들 위험이 있으므로 빠뜨리지 마세요.

워크플로우 트리거 경로: `packages/mcp/src/**`, `packages/tokens/src/**`, `packages/react/src/**`, `packages/icons/svg/**`, `packages/mcp/manifest.json`. 그러나 **`manifest.json` version 이 기존 tag 와 같으면 release skip** 이므로 step 2 의 자동 동기화가 핵심.

CI 의 `pnpm lint` 가 `sync-mcpb-version --check` 로 루트/manifest 양쪽 drift 를 막아 줍니다 — 손으로 어긋나게 만들면 빨갛게 뜸. `pack-local-packages.mjs` 도 실행 시 root ↔ DS 4개 일치를 assert 하므로 stale 루트로 다운그레이드되는 사고는 더 이상 발생하지 않습니다.

- 가이드/원칙만 추가했어도 외부 전파 필요하면 `pnpm changeset` 으로 영향받는 패키지 골라 patch bump.
- `@nudge-design/mcp` (내부) 는 의도적으로 분리. 함께 bump 하려면 changeset 에 명시.
