# NudgeEAP Design System

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

## 목업 작성

### 디자인시스템 분기 (중요)

목업 종류에 따라 사용하는 디자인시스템이 다릅니다. 작업 시작 전에 어느 쪽인지 먼저 확인하세요.

| 목업 종류            | 디자인시스템       | 출처                                                                  |
| -------------------- | ------------------ | --------------------------------------------------------------------- |
| 사용자 앱 / Trost 앱 | `@nudge-eap/react` | 자체 DS — `nudge-eap-ds` MCP로 조회                                   |
| CMS / 어드민         | `antd`             | npm 패키지 (apps/storybook에 설치됨), MCP 없음 — 학습된 지식으로 사용 |

- 사용자가 "어드민", "CMS", "운영툴", "백오피스" 등을 언급하면 CMS 규칙을 따르세요.
- 그 외(앱, 사용자 화면, Trost, Geniet, NudgeEAP)는 사용자 앱 규칙을 따르세요.
- **사용자 앱 작업 시**: `mcp__nudge-eap-ds__*` 도구를 적극 활용하세요 (`get_design_principles`, `get_component_guide`, `search_component`, `find_icon`, `lookup_token`, `validate_mockup` 등).
- **CMS 작업 시**: `import { Button, Form, Table, ... } from "antd"` 형태로 직접 import. 별도 MCP 없이 작성 → 모르는 props는 추측하지 말고 [https://ant.design/components/overview](https://ant.design/components/overview) 문서를 확인하세요.
- 두 디자인시스템을 한 화면에서 섞어 쓰지 마세요. 화면 종류에 맞는 한 쪽만 사용합니다.

### 사용자가 "OO 페이지 목업 만들어줘"라고 하면

1. **어떤 종류의 목업인지 확인** (사용자 앱 vs CMS)
2. 스토리북이 실행 중인지 확인 (아니면 먼저 실행)
3. 종류에 맞는 규칙에 따라 목업 생성
4. `npx tsc --noEmit --project apps/storybook/tsconfig.json` 으로 타입 체크
5. 사용자에게 스토리북에서 확인하라고 안내

### 사용자/Trost 앱 목업 - 필수 규칙

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

### CMS/어드민 목업 - 필수 규칙

CMS/어드민 화면을 만들 때는 NudgeEAP 디자인시스템 대신 **Ant Design(antd)** 을 기준 UI 라이브러리로 사용합니다.

#### 1. 기술 스택

- React + TypeScript 기준으로 작성
- antd 컴포넌트를 **우선** 사용 (직접 만들지 않음)
- 다음 컴포넌트는 **절대 직접 구현 금지**, 무조건 antd 사용:
  `Button`, `Form`, `Input`, `Select`, `DatePicker`, `Table`, `Modal`, `Drawer`, `Tabs`, `Tag`, `Space`, `Card`, `Pagination`

#### 2. 스타일 원칙

- **AntD 기본 스타일 유지**. 색·타이포·컴포넌트 외형은 건드리지 않음
- 레이아웃 여백과 정보 구조만 조정 (`Space`, `Row/Col`, `gap` 등)
- CSS는 최소화. 인라인 스타일이나 styled-components 남발 금지
- NudgeEAP 토큰(`@nudge-eap/tokens`) 사용하지 말 것 — antd 기본값에 맡김

#### 3. 레이아웃 톤

- 운영툴 화면답게 **조밀하고 스캔하기 쉬운** 레이아웃
- 마케팅 페이지처럼 큰 히어로, 장식 카드, 과한 비주얼 사용 금지
- 한 화면에 정보 밀도를 높이고, 액션은 우측 상단/하단 고정 영역에 배치
- 모바일 반응형 신경 쓰지 않아도 됨 (데스크톱 기준)

#### 4. 추측 금지

- antd MCP는 사용하지 않습니다. 컴포넌트 props가 헷갈리면 추측하지 말고 [공식 문서](https://ant.design/components/overview) 또는 `node_modules/antd/lib/{component}/index.d.ts` 타입 정의를 직접 확인
- antd v5 기준으로 작성 (`pnpm --filter storybook list antd`로 버전 확인 가능)

#### 5. Self-Check

CMS 목업 생성 후 반드시 확인:

- [ ] antd에서 import 했는가 (직접 구현하지 않았는가)
- [ ] NudgeEAP DS 컴포넌트를 섞어 쓰지 않았는가
- [ ] CSS/스타일을 최소화했는가 (antd 기본값 유지)
- [ ] 마케팅 톤이 아닌 운영툴 톤인가 (조밀, 정보 위주)
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
