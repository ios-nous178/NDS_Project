# NudgeEAP Design System

EAP 멘탈케어 플랫폼 디자인 시스템 모노레포. 3개 브랜드: **Trost / Geniet / NudgeEAP**.

## DS 사용 규칙 SSOT

외부 프로젝트(npm 으로 DS 를 소비하는 쪽)에서 적용되는 작업 규칙은 모두 **MCP 가 SSOT** 입니다.
이 모노레포의 CLAUDE.md 에는 DS 사용 규칙을 중복 작성하지 않습니다. 규칙을 바꾸려면 아래 파일을 수정하세요.

- `packages/mcp/src/server.ts` — `getClaudeMdTemplate` (외부 프로젝트가 받는 CLAUDE.md 본문)
- `packages/mcp/src/guides.ts` — 컴포넌트 / 패턴 / 원칙 / 어드민 가이드 본문

작업 중 규칙을 직접 확인해야 하면 MCP 도구 호출:

- `get_design_principles` / `get_dos_and_donts` — 브랜드 톤, 시멘틱, 금지 패턴
- `get_component_guide(name)` — props 함정 포함 (Chip.label, Select.onValueChange, Tabs.onTabChange 등)
- `get_pattern_guide(name)` — cta-group / icon-color / notice / dropdown / dense-list
- `get_admin_cms_guide` — CMS / 어드민 화면 규칙
- `search_component` / `find_icon` / `lookup_token` — 추측 없이 조회

## 환경 세팅

```bash
node -v                                 # 24.x 필요
pnpm -v || npm install -g pnpm@9
pnpm install
pnpm build --filter @nudge-eap/tokens   # 컴포넌트가 의존
pnpm --filter storybook dev             # 스토리북 → http://localhost:6006
```

Windows: PowerShell 권장. `pnpm` 설치 시 실행 정책 문제가 나면
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## 주요 커맨드

| 명령                                                      | 설명               |
| --------------------------------------------------------- | ------------------ |
| `pnpm --filter storybook dev`                             | 스토리북 개발 서버 |
| `pnpm build`                                              | 전체 빌드          |
| `pnpm build --filter @nudge-eap/tokens`                   | 토큰만 빌드        |
| `npx tsc --noEmit --project apps/storybook/tsconfig.json` | 타입 체크          |

## 주요 디렉토리

```
packages/react/src/     ← DS 컴포넌트 (.tsx) — Props 는 여기서 확인
packages/tokens/src/    ← 디자인 토큰
packages/mcp/src/       ← MCP 서버 (외부 프로젝트가 받는 가이드 SSOT)
  server.ts             ← getClaudeMdTemplate (create_claude_md 본문)
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
2. 시멘틱은 `--semantic-*` 네임스페이스로 — raw hex / `--eap-*` / `--color-semantic-*` 신규 추가 금지
3. 토큰 정의 의도는 `DESIGN.md` YAML 에도 동기화
4. `pnpm build --filter @nudge-eap/tokens` (의존 패키지가 import 하므로 필수)

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
#    → @nudge-eap/{react,tokens,icons,tailwind-preset} 의 package.json version bump
#    → CHANGELOG.md 갱신
#    → 후속 스크립트가 자동 실행:
#       · sync-mcpb-version.mjs  : 루트 package.json + packages/mcp/manifest.json 을 최대 DS 버전으로 sync
#       · sync-version-docs.mjs  : docs 버전 표 동기화

# 3. (권장) Slack 알림용 비개발자 톤 변경사항 미리 생성
pnpm release-notes
#    → 직전 tag~HEAD 커밋을 Claude(haiku-4-5) 가 디자이너/PM 톤으로 재작성
#    → .release-notes/pending.md 에 저장 (로컬 ANTHROPIC_API_KEY 필요)
#    → 결과를 직접 한 번 검토/수정 후 같이 commit
#    → CI 가 이 파일을 발견하면 Slack "이번 업데이트에서 달라진 점" 섹션에 그대로 사용
#    → 파일이 없으면 기존 git log fallback (개발자용)
#    · 미리보기만 보기: pnpm release-notes:dry
#    · GitHub Release body 는 손대지 않음 (개발자용 raw 커밋 로그는 그대로)

# 4. 변경 커밋 + main push → release-mcpb.yml 가 빌드/태그/슬랙 알림까지 자동
```

DS 4개 패키지(@nudge-eap/{react,tokens,icons,tailwind-preset}) 의 package.json version 이 SSOT 이고, 루트 `package.json` 과 `packages/mcp/manifest.json` 은 둘 다 그 미러입니다. `sync-mcpb-version.mjs` 한 번 실행으로 둘 다 최대 DS 버전으로 끌어올립니다. 루트 미러는 `pack-local-packages.mjs` 가 tarball 파일명에 박는 값이라 자동 sync 가 빠지면 `pack` 이 의도치 않은 다운그레이드를 만들 위험이 있으므로 빠뜨리지 마세요.

워크플로우 트리거 경로: `packages/mcp/src/**`, `packages/tokens/src/**`, `packages/react/src/**`, `packages/icons/svg/**`, `packages/mcp/manifest.json`. 그러나 **`manifest.json` version 이 기존 tag 와 같으면 release skip** 이므로 step 2 의 자동 동기화가 핵심.

CI 의 `pnpm lint` 가 `sync-mcpb-version --check` 로 루트/manifest 양쪽 drift 를 막아 줍니다 — 손으로 어긋나게 만들면 빨갛게 뜸. `pack-local-packages.mjs` 도 실행 시 root ↔ DS 4개 일치를 assert 하므로 stale 루트로 다운그레이드되는 사고는 더 이상 발생하지 않습니다.

- 가이드/원칙만 추가했어도 외부 전파 필요하면 `pnpm changeset` 으로 영향받는 패키지 골라 patch bump.
- `@nudge-eap/mcp` (내부) 는 의도적으로 분리. 함께 bump 하려면 changeset 에 명시.
