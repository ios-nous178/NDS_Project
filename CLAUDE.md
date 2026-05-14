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
