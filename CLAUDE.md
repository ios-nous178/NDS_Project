# NudgeEAP Design System (모노레포 작업용)

## 이 문서의 범위

이 CLAUDE.md 는 **DS 모노레포 안에서 storybook 목업/DS 코드 작업할 때**만 적용됩니다.
외부 프로젝트(DS 를 npm으로 소비하는 쪽)의 작업 규칙은 모두
`mcp__nudge-eap-ds__create_claude_md` 가 깔아주는 CLAUDE.md 가 SSOT 입니다.
DS 사용 규칙(컴포넌트 props 함정, CTA UX, Self-Check, 검증 루프, antd 분기 등)을
여기에 중복 작성하지 않습니다. 변경이 필요하면 `packages/mcp/src/server.ts`의
`getClaudeMdTemplate` 과 `packages/mcp/src/guides.ts` 를 수정하세요.

작업 중 DS 규칙을 확인해야 하면 MCP 도구를 직접 호출:

- `get_design_principles` / `get_dos_and_donts` — 브랜드 톤, 시멘틱, 금지 패턴
- `get_component_guide(name)` — props 함정 포함 (Chip.label, Select.onValueChange, Tabs.onTabChange 등)
- `get_pattern_guide(name)` — cta-group / icon-color / notice / dropdown / dense-list
- `search_component` / `find_icon` / `lookup_token` — 추측 없이 조회
- `get_admin_cms_guide` — CMS/어드민 화면일 때

## 프로젝트 개요

EAP 멘탈케어 플랫폼 디자인 시스템 모노레포.
3개 브랜드: **트로스트**(Trost), **지니어트**(Geniet), **NudgeEAP**

## 환경 세팅

사용자가 "환경 세팅해줘", "스토리북 실행해줘" 등을 요청하면 아래 순서로 실행하세요.
**사용자가 개발자가 아닐 수 있습니다. 에러가 나면 직접 해결하세요.**

```bash
# 1. node 확인 (22.x 필요)
node -v
# 없으면: 사용자에게 SETUP.md 1단계 안내

# 2. pnpm 확인/설치
pnpm -v || npm install -g pnpm@9

# 3. 의존성 설치
pnpm install

# 4. 토큰 빌드 (컴포넌트가 의존)
pnpm build --filter @nudge-eap/tokens

# 5. 스토리북 실행
pnpm --filter storybook dev
```

**Windows 주의사항:**

- PowerShell에서 실행 (cmd도 가능하나 PowerShell 권장)
- `pnpm` 설치 시 PowerShell 실행 정책 문제가 나면: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
- 포트 충돌 시 자동으로 다른 포트 할당됨

스토리북이 실행되면 사용자에게 URL을 안내하세요:

> 브라우저에서 http://localhost:6006 을 열어주세요. (포트가 다를 수 있어요)

## 모노레포 전용: storybook 목업 작성

DS 사용 규칙·CTA UX·검증 루프·Self-Check 본문은 MCP 가이드를 따릅니다 (위 "문서의 범위" 참조).
여기서는 **모노레포 안에서만 의미 있는 추가 규약**만 정의합니다.

### 사용자 앱 목업 — MockupLayout 헬퍼 필수

외부 프로젝트와 달리 storybook 워크스페이스에는 헤더/푸터/StickyBar/Accordion 을 제공하는
공용 헬퍼가 있습니다. 직접 구현하지 말고 이걸 import하세요.

```tsx
import { MockupLayout, useIsMobile, Accordion } from "./mockup-layout";

<MockupLayout brand="trost" activeGnbKey="medicine" disclaimer="면책 고지" stickyBottom={<Button>CTA</Button>}>
  {페이지 내용}
</MockupLayout>;
```

- 헤더/푸터/StickyBar 를 직접 구현 금지
- brand: `"trost" | "geniet" | "nudge-eap"`
- 헬퍼 파일: `apps/storybook/src/stories/mockup-layout.tsx`
- 모바일 분기: `useIsMobile()` (테이블→카드, 필터→가로스크롤, CTA→세로배치)

### 파일 구조 (사용자 앱)

```
apps/storybook/src/stories/
  {Brand}{Page}Mockup.tsx           ← 목업
  {brand}-{page}-mock-data.ts       ← 데이터
  {Brand}{Page}Mockup.stories.tsx   ← 스토리 (Default + Mobile 둘 다)
```

### CMS/어드민 목업

화면 종류가 어드민/CMS/운영툴/백오피스 이면 antd v5 (apps/storybook 에 설치됨)를 사용합니다.
구체 규칙은 `get_admin_cms_guide` 호출로 받으세요 — antd props 가 헷갈리면 추측 금지,
[공식 문서](https://ant.design/components/overview) 또는 `node_modules/antd/lib/{component}/index.d.ts`
타입을 확인합니다.

### 작업 흐름

1. 사용자 앱 vs CMS 어느 쪽인지 확인
2. 스토리북이 실행 중인지 확인 (아니면 먼저 실행)
3. 사용자 앱이면 `get_design_principles` 부터 호출, CMS 면 `get_admin_cms_guide`
4. 목업 생성 — 사용자 앱은 `MockupLayout` 필수, 스토리에 Default + Mobile 둘 다
5. `npx tsc --noEmit --project apps/storybook/tsconfig.json` 타입체크
6. `validate_mockup` → 위반이 있으면 `suggest_replacement` 로 수정 후 재검증
7. `report_mockup_usage({ filePath: 'apps/storybook/src/stories/{Brand}{Page}Mockup.tsx' })` 호출
   (CMS 면 `context: "admin-cms"`)
8. 사용자에게 스토리북에서 확인하라고 안내

### 하네스 파이프라인 (상세)

`harness/` 디렉토리의 프롬프트 참조

## 주요 커맨드

| 명령                                                      | 설명               |
| --------------------------------------------------------- | ------------------ |
| `pnpm --filter storybook dev`                             | 스토리북 개발 서버 |
| `pnpm build`                                              | 전체 빌드          |
| `pnpm build --filter @nudge-eap/tokens`                   | 토큰만 빌드        |
| `npx tsc --noEmit --project apps/storybook/tsconfig.json` | 타입 체크          |

## 주요 디렉토리

```
packages/react/src/     ← DS 컴포넌트 (.tsx) — Props는 여기서 확인
packages/tokens/src/    ← 디자인 토큰
packages/mcp/src/       ← MCP 서버 (외부 프로젝트가 받는 가이드 SSOT)
  server.ts             ← getClaudeMdTemplate (create_claude_md 본문)
  guides.ts             ← 컴포넌트/패턴/원칙/어드민 가이드
apps/storybook/         ← 스토리북
  src/stories/          ← 스토리 + 목업 파일 + mockup-layout.tsx
  src/brand-fixtures.ts ← 브랜드별 헤더/푸터 데이터
harness/                ← 하네스 파이프라인 프롬프트
DESIGN.md               ← 디자인 토큰 YAML 정의
SETUP.md                ← 비개발자용 최초 세팅 가이드
```
