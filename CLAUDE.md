# NudgeEAP Design System

## 프로젝트 개요

EAP 멘탈케어 플랫폼 디자인 시스템 모노레포.
3개 브랜드: **트로스트**(Trost), **지니어트**(Geniet), **NudgeEAP**

## 환경 세팅

사용자가 "환경 세팅해줘", "스토리북 실행해줘" 등을 요청하면 아래 순서로 실행하세요.
**사용자가 개발자가 아닐 수 있습니다. 에러가 나면 직접 해결하세요.**

```bash
# 1. node 확인 (20.x 필요)
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

## 목업 작성

### 사용자가 "OO 페이지 목업 만들어줘"라고 하면

1. 스토리북이 실행 중인지 확인 (아니면 먼저 실행)
2. 아래 규칙에 따라 목업 생성
3. `npx tsc --noEmit --project apps/storybook/tsconfig.json` 으로 타입 체크
4. 사용자에게 스토리북에서 확인하라고 안내

### 필수 규칙

#### 1. MockupLayout 필수

```tsx
import { MockupLayout, useIsMobile, Accordion } from "./mockup-layout";

<MockupLayout brand="trost" activeGnbKey="medicine" disclaimer="면책 고지" stickyBottom={<Button>CTA</Button>}>
  {페이지 내용}
</MockupLayout>
```

- 헤더/푸터/StickyBar를 직접 구현 금지
- brand: "trost" | "geniet" | "nudge-eap"
- 레이아웃 헬퍼 파일: `apps/storybook/src/stories/mockup-layout.tsx`

**2. DS 컴포넌트 강제 사용**
아래 기능이 필요하면 반드시 `@nudge-eap/react`에서 import:

| 기능         | 컴포넌트    | 주의사항                                          |
| ------------ | ----------- | ------------------------------------------------- |
| 탭           | Tabs        | items: {key, title}[], activeKey, onTabChange     |
| 페이지네이션 | Pagination  | page, totalPages, onPageChange                    |
| 브레드크럼   | Breadcrumb  | items: {label, href?}[]                           |
| 프로그레스바 | ProgressBar | value, max                                        |
| 아바타       | Avatar      | name (이니셜 자동), size                          |
| 드롭다운     | Select      | options, value, **onValueChange** (onChange 아님) |
| 칩           | Chip        | **label** prop 필수 (children 아님)               |
| 카드         | Card        | Compound: Card.Header, Card.Body, Card.Footer     |
| 구분선       | Divider     |                                                   |
| 빈 상태      | EmptyState  |                                                   |

DS에 없는 것 (임시 구현 허용): Accordion(`mockup-layout`에 있음), StarRating, PillImage

**3. 반응형**
`useIsMobile()` 훅 사용. 모바일: 테이블→카드, 필터→가로스크롤, CTA→세로배치

#### 4. 파일 구조

```
apps/storybook/src/stories/
  {Brand}{Page}Mockup.tsx           ← 목업
  {brand}-{page}-mock-data.ts       ← 데이터
  {Brand}{Page}Mockup.stories.tsx   ← 스토리 (Default + Mobile)
```

**5. Self-Check**
생성 후 반드시 확인:

- [ ] MockupLayout 사용했는가
- [ ] DS 컴포넌트를 인라인으로 만들지 않았는가
- [ ] Chip은 label prop, Select는 onValueChange 사용했는가
- [ ] useIsMobile()로 모바일 분기했는가
- [ ] 스토리에 Default + Mobile 있는가
- [ ] tsc --noEmit 통과하는가

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
apps/storybook/         ← 스토리북
  src/stories/          ← 스토리 + 목업 파일
  src/brand-fixtures.ts ← 브랜드별 헤더/푸터 데이터
harness/                ← 하네스 파이프라인 프롬프트
DESIGN.md               ← 디자인 토큰 YAML 정의
SETUP.md                ← 비개발자용 최초 세팅 가이드
```
