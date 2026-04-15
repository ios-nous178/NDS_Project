# Design System Plan

이 문서는 NudgeEAP 디자인 시스템의 초기 기획 방향을 정리한 문서입니다.  
다만 실제 구현을 진행하면서 바뀐 판단과 우선순위는 현재 기준으로 업데이트합니다.

---

# 1. 현재 상황

현재 프로젝트는 다음과 같은 환경을 가지고 있습니다.

### 소비 프로젝트

| 프로젝트 | 프레임워크 | 라우터 | 스타일 시스템 | 상태 관리 |
| --- | --- | --- | --- | --- |
| NudgeEAPHomePage | Next.js 14 | App Router | Tailwind CSS | Zustand + React Query |
| NudgeEAPWebView | Next.js 14 | Pages Router | styled-components | Zustand + React Query |

공통 사항

- React 기반 UI
- TypeScript
- WebView 환경 존재
- SEO 중요
- SSR 중요

프로젝트 특성

- HomePage와 WebView가 서로 다른 스타일 시스템을 사용함
- 공통 UI 패턴은 많지만 구현 방식은 분산되어 있음
- 디자인시스템은 개발자뿐 아니라 디자이너/기획자도 참고 가능한 구조가 필요함

### 디자인 시스템 현재 상태

초기 기획 당시에는 아래 항목이 목표였습니다.

- 디자인 시스템 구축
- npm 패키지 배포 가능 구조 확보
- AI 활용 자동화
- Storybook + Docs 구축

현재까지 작업하며 보인 방향

- 모노레포 구조를 유지하는 쪽이 현재 요구에는 잘 맞아 보임
- Storybook + Docs + 메타데이터 자동화 조합이 협업에 도움이 되는 편으로 보임
- 컴포넌트는 “도메인 UI”보다 “재사용 가능한 패턴”부터 올리는 접근이 현재까지는 더 안정적으로 보임

---

# 2. 목표

디자인 시스템 구축 목표

1. UI 일관성 확보
2. 컴포넌트 재사용성 확보
3. 디자인-개발-기획 공통 언어 구축
4. AI 기반 자동화 도입
5. Figma, Storybook, Docs, 코드가 연결된 문서 체계 구축
6. 기획자와 디자이너도 AI를 활용해 디자인시스템을 더 쉽게 탐색하고 정리할 수 있는 환경 마련

---

# 3. 설계 원칙

디자인 시스템은 다음 원칙을 따릅니다.

### Tokens First

모든 스타일은 Design Tokens 기반으로 관리합니다.

예

- color
- spacing
- radius
- typography
- sizing

현재 기준으로 보강한 원칙

- raw value보다 토큰 우선
- 컴포넌트 스타일은 CSS 변수로 노출
- Storybook 예시도 가능하면 토큰 기반으로 유지

---

### Framework Agnostic

디자인 시스템은 특정 프레임워크에 종속되지 않습니다.

지원 목표

- React
- Next.js App Router
- Next.js Pages Router
- Astro
- 장기적으로 React Native 등 네이티브 환경까지 확장 가능

현재 구현 기준으로 잡은 범위

- 우선 지원 범위는 React 18 이상
- 현실적인 호환 목표는 React 18 ~ 19
- Astro와 Native는 당장 구현 범위라기보다 장기 지원 목표로 유지
- React 17 이하 호환은 현재 우선순위에서 제외

---

### Style Adapter

스타일 시스템이 달라도 동일 컴포넌트를 사용할 수 있도록 합니다.

지원

- Tailwind
- styled-components
- CSS variables

현재까지의 관찰

- CSS variables + data-slot + slotProps 조합이 현재로서는 가장 현실적인 공통 확장 방식에 가까워 보임
- 별도 styled 전용 컴포넌트를 두기보다, 공용 React 컴포넌트를 확장 가능하게 두는 편이 현재 구조에는 더 잘 맞아 보임

---

### Recipe Over Domain

모든 반복 UI를 곧바로 디자인시스템 컴포넌트로 만들지는 않습니다.

우선순위

- 공통 상태와 구조가 안정된 UI 패턴
- 접근성과 스타일 규칙을 함께 관리해야 하는 UI
- Storybook과 Figma로 설명 가능한 UI

보류 대상

- 도메인 데이터 의존성이 높은 카드
- 화면 맥락에 강하게 묶인 조합 컴포넌트

예

- `Verification Row`는 우선 recipe 문서화
- `Counselor Card`는 카드 프리미티브 + 도메인 조합으로 분리 검토

---

# 4. 컴포넌트 API 전략: Hybrid (Flat + Compound)

Nudge Design System은 “어떤 패턴이 옳은가”가 아니라, “언제 어떤 선택이 적절한가”에 집중합니다.

- 단순하고 자주 쓰는 케이스 → Flat API
- 복잡하고 변형이 잦은 케이스 → Compound API

둘 중 하나가 아니라 둘을 함께 제공하는 하이브리드 전략을 택합니다.

---

### 사용 예시

```tsx
<Input label="이메일" placeholder="example@email.com" />

<Input.Root error>
  <Input.Label>이메일</Input.Label>
  <Input.Wrapper>
    <Input.Field placeholder="example@email.com" />
    <Input.ClearButton onClick={handleClear} />
  </Input.Wrapper>
  <Input.Helper error>올바른 형식이 아닙니다</Input.Helper>
</Input.Root>
```

---

### 내부 구현 방향

외부에 제공되는 API는 여러 형태일 수 있지만, 내부 구현은 가능한 한 하나의 primitive 레이어를 재사용하는 방향을 유지합니다.

Flat API는 Compound를 미리 조립한 케이스로 보고 관리합니다.

현재까지의 판단

- 이 전략은 `Input`, `Modal`, `Popup`처럼 상태와 slot이 중요한 컴포넌트에서 특히 잘 맞는 편으로 보임
- Storybook에서도 Flat/Compound를 함께 보여주는 구성이 학습 부담을 줄이는 데 도움이 되는 편으로 보임

---

### 선택 가이드

| 기준 | Flat API | Compound API |
| --- | --- | --- |
| 커스텀 필요 | 없음 | 있음 |
| 사용 빈도 | 높음 | 중간 |
| 학습 비용 | 낮음 | 중간 |
| 유연성 | 제한적 | 높음 |
| 적합한 예 | Button, Badge, 기본 Input | 검색형 Input, Modal 내부 구조, 액션 결합 패턴 |

---

# 5. 모노레포 구조

추천 구조

```text
design-system
├─ packages
│  ├─ tokens
│  ├─ icons
│  ├─ react
│  ├─ tailwind-preset
│  └─ ...
├─ apps
│  ├─ storybook
│  └─ docs
├─ metadata
├─ scripts
└─ docs
```

기획 업데이트 메모

- 초기안의 `core`, `styled-theme`는 필수 선행 패키지로 두지 않음
- 현재는 `tokens`, `icons`, `react`, `tailwind-preset` 중심 구성이 더 현실적임
- 메타데이터와 문서 자동화를 위해 `metadata`, `scripts`의 중요도가 커짐

---

# 6. Packages 설명

`tokens`

- 디자인 토큰 관리
- CSS 변수 및 토큰 산출물 생성

`icons`

- SVG 원본 관리 및 React 아이콘 컴포넌트 자동 생성
- 컴포넌트 패키지와 릴리스 주기 분리

`react`

- React 컴포넌트 구현
- Flat API와 Compound API 제공

`tailwind-preset`

- Tailwind 환경에서 토큰과 규칙을 쉽게 사용하기 위한 preset

초기 기획에서 보정된 부분

- `styled-theme`는 별도 패키지보다 확장 가이드와 CSS variable 전략으로 먼저 운영
- `core`는 별도 배포 패키지보다 내부 구현 레이어 개념으로 유지

---

# 7. Tooling

디자인 시스템 도구

Design

- Figma

Component

- React
- Storybook

Documentation

- Docusaurus

Automation

- `component inventory metadata`
  컴포넌트 이름, 상태, Storybook 경로, Docs 경로, Figma 링크 같은 정보를 한 곳에서 관리하는 메타데이터입니다.  
  디자이너, 기획자, 개발자가 같은 기준을 보도록 맞추는 역할을 합니다.
- `docs generation script`
  메타데이터를 기반으로 인벤토리 문서나 연결 문서를 자동 생성하는 스크립트입니다.  
  사람이 여러 문서를 따로 수정할 때 생기는 누락과 불일치를 줄이는 데 목적이 있습니다.
- `AI 보조 워크플로우`
  AI를 이용해 기존 코드 분석, 컴포넌트 후보 정리, Storybook 초안, 문서 초안을 빠르게 만드는 작업 흐름입니다.  
  최종 결정과 검증은 사람이 하되, 반복 분석과 초안 작성 비용을 줄이는 데 초점을 둡니다.

추가로 고려 중인 방향

- 기획자와 디자이너도 활용할 수 있는 AI 가이드 문서 확장
- Figma 메타데이터와 Storybook 연결 보조 자동화
- 화면 요구사항을 컴포넌트 체크리스트로 정리하는 초안 자동화
- 상태 매트릭스와 usage summary 초안 자동 생성

---

# 8. AI 활용 전략

AI 활용 영역

- 코드 분석
- 토큰 후보 생성
- 컴포넌트 초안 생성
- Storybook 초안 생성
- 문서 초안 생성
- UI QA 보조

AI는 보조 도구로 사용합니다.

구현하면서 추가된 원칙

- AI가 제안한 UI도 실서비스 코드 기준으로 검증
- 자동 생성보다 “분석 + 초안 + 검증” 흐름이 현실적
- typecheck, storybook build, docs build 같은 자동 검증 루프가 함께 있어야 함

---

# 9. MVP 컴포넌트

초기 구축 대상은 “화면을 가장 많이 지탱하는 공통 패턴” 위주로 잡습니다.

현재 기준 MVP 범위

- Button
- Badge
- Input
- Modal
- Popup

초기안에서 조정된 부분

- `Text`, `Card`를 최우선 MVP로 두기보다 실제 반복 사용이 더 명확한 컴포넌트를 먼저 구축
- 이후 `Search Input`, `Tabs`, `Bottom Sheet`, `Select`를 다음 후보로 검토

현재 진행 메모 (2026-04-15 기준)

- MVP 5종 (`Button`, `Badge`, `Input`, `Modal`, `Popup`) 모두 `packages/react`에 구현 완료

---

# 10. 다음 후보 컴포넌트

실제 HomePage / WebView 코드를 읽고 난 뒤의 우선순위는 아래와 같습니다.

### P0

- Search Input / Search Bar
- Tabs / Sliding Tabs
- Bottom Sheet

### P1

- Select / Filter Select
- Checkbox / Radio / Choice Controls
- Toast
- Empty State

### P2

- Filter Chip / Tag
- Counselor Card 프리미티브
- Verification Row recipe

이 후보들은 디자인시스템으로 관리할 가치가 큰 패턴이지만, 도메인 결합도와 반복 빈도를 함께 보고 승격 여부를 판단합니다.

현재 진행 메모 (2026-04-15 기준)

- P0 전부 구현: `SearchInput`, `Tabs`, `BottomSheet`
- P1 전부 구현: `Select`, `Checkbox`, `Toast`, `EmptyState`
- P2 일부 구현: `Chip`, `Card` 프리미티브, `FieldActionRow` (Verification Row recipe 대응)
- 초기안에 없던 추가 항목: `DSHighlight` (디버깅 도구)
- Counselor Card 등 도메인 카드 조합은 여전히 승격 보류

---

# 11. 구축 단계

1. 모노레포 구조 정리
2. design tokens 정의
3. icons 패키지 구축
4. storybook 구축
5. docs 구축
6. core components 구축
7. metadata 기반 문서 자동화
8. 실제 프로젝트 적용

구현하면서 바뀐 점

- 문서 자동화는 후순위가 아니라 초기 기반에 가까움
- Figma ↔ Storybook ↔ Docs ↔ Code 연결 구조를 초반부터 잡는 편이 협업 효율이 높음

---

# 12. 파일럿 적용

다음 프로젝트에 파일럿 적용

- WebView 프로젝트
- Homepage 프로젝트

적용 전략

- 전면 교체보다 반복 패턴이 많은 UI부터 점진 적용
- 검색창, 모달, 입력 필드, 배지처럼 비교적 안전한 컴포넌트부터 이전
- 마이그레이션 과정은 notes 문서로 누적 관리

---

# 13. 문서 로드맵

| 문서 | 목적 | 상태 |
| --- | --- | --- |
| `DESIGN_SYSTEM_PLAN.md` | 초기 전략과 변경된 기획 판단 정리 | 운영 중 |
| `TOKENS.md` | 디자인 토큰 정의서 | 운영 중 |
| `AI_PROMPTS.md` | AI 자동화 프롬프트 템플릿 | 운영 중 |
| `PLANNER_DESIGNER_AI_GUIDE.md` | 기획자/디자이너용 AI 활용 가이드 | 운영 중 |
| `FIGMA_TO_REACT_WORKFLOW.md` | Figma에서 코드/문서로 이어지는 흐름 | 운영 중 |
| `AUTOMATION_WORKFLOW.md` | 자동화 워크플로우 | 운영 중 |
| `STYLING_STRUCTURE_GUIDE.md` | 스타일 구조 가이드 | 운영 중 |
| `MODAL_MIGRATION_NOTES.md` | 실서비스 비교 및 마이그레이션 기록 | 운영 중 |
| `docs/components/inventory.md` | 메타데이터 기반 컴포넌트 인벤토리 | 자동 생성 |
| `docs/components/candidates.mdx` | 추출 후보와 우선순위 | 운영 중 |
| `CONTRIBUTING.md` | 컴포넌트 추가 절차와 규칙 | 미작성 |
| `RELEASE_STRATEGY.md` | 버전 관리와 배포 전략 | 미작성 |

우선순위

- 기획 문서 유지
- 컴포넌트 문서 확장
- 호환성/릴리스 문서 보강

현재 진행 메모 (2026-04-15 기준)

- 추가된 QA/테스트 문서: `QA_AUTOMATION_PLAN_V1.md`, `COMPONENT_TEST_COVERAGE_ASSESSMENT_2026-04-12.md`, `COMPONENT_UNIT_SNAPSHOT_TEST_STRATEGY.md`
- `docs/guide/` 하위 가이드 추가: `design-principles`, `design-token-principles`, `migration-debug-tools`, `page-migration-priority`, `styling`, `token-review-checklist`
- `docs/components/` 하위에 컴포넌트별 MDX 문서 확장 (Button, Modal, Input, Popup, SearchInput, Tabs, BottomSheet, Select, Checkbox/Radio, Toast, EmptyState, Card, Chip, Badge, FieldActionRow 등)
- 여전히 미작성: `CONTRIBUTING.md`, `RELEASE_STRATEGY.md`

---

# 14. 아직 확인이 필요한 사항

1. Figma 파일과 실제 컴포넌트 naming 규칙 정리
2. npm 배포 전략과 scope 확정 여부
3. React 18~19 테스트 매트릭스 운영 방식
4. Astro / Native 대응 시 패키지 분리 전략
5. 어떤 UI를 recipe로 두고, 어떤 UI를 정식 컴포넌트로 승격할지 기준 명문화

---

# 15. 장기 목표

장기적으로 다음 목표를 가집니다.

- HomePage와 WebView 프로젝트에서 공통 컴포넌트 사용
- Figma, Storybook, Docs, 코드가 같은 기준으로 연결
- React 18~19 범위에서 안정적으로 소비 가능
- Astro와 Native 확장 가능성을 고려한 구조 유지
- AI 기반 문서화와 QA 보조 체계 강화
- 필요 시 외부 배포 가능한 패키지 구조 확보
