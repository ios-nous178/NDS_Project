# NudgeEAP Design System

NudgeEAP 서비스 전반에서 공통으로 사용할 디자인 토큰, React 컴포넌트, Tailwind preset, 아이콘, Storybook을 관리하는 모노레포입니다.

현재는 토큰, React 컴포넌트, 아이콘, Tailwind preset, Storybook, Docusaurus 문서, 테스트/CI까지 한 저장소에서 함께 운영하는 단계입니다.
아직 완전히 제품화된 배포 중심 디자인 시스템이라기보다, 실서비스 적용과 운영 체계를 함께 다듬고 있는 구축기 성격이 강합니다.

## 목표

- 서비스 간 UI 일관성 확보
- 반복되는 스타일과 컴포넌트 재사용
- 디자인-개발 간 공통 언어 정리
- Storybook 기반 QA 및 문서화
- 향후 npm 패키지 배포를 고려한 구조 정비

## 현재 구성

```text
NudgeEAPDesignSystem
├─ apps
│  ├─ docs
│  └─ storybook
├─ docs
│  ├─ AI_PROMPTS.md
│  ├─ DESIGN_SYSTEM_PLAN.md
│  └─ TOKENS.md
├─ packages
│  ├─ icons
│  ├─ react
│  ├─ tailwind-preset
│  └─ tokens
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

## Packages

### `@nudge-eap/tokens`

- 색상, 타이포그래피, spacing, radius, sizing 토큰을 제공합니다.
- TypeScript export와 CSS 변수 파일(`@nudge-eap/tokens/css`)을 함께 생성합니다.

### `@nudge-eap/react`

- 현재 구현된 컴포넌트:
  `Button`, `Badge`, `Input`, `Modal`, `Popup`, `SearchInput`, `Tabs`, `BottomSheet`, `Select`, `Checkbox`, `Toast`, `EmptyState`, `Card`, `Chip`, `FieldActionRow`
- 일부 컴포넌트는 Flat API와 Compound API를 함께 제공하며, 오버레이/입력/피드백 컴포넌트까지 포함합니다.
- `dist/styles.css` 산출물을 함께 생성해 소비 프로젝트에서 공통 스타일을 연결할 수 있습니다.

### `@nudge-eap/tailwind-preset`

- 토큰 값을 Tailwind theme으로 연결하기 위한 preset 패키지입니다.
- 색상, font, spacing, radius, height 등을 토큰 기반으로 확장합니다.

### `@nudge-eap/icons`

- Figma 디자인 기준 83종 아이콘을 React 컴포넌트로 제공합니다.
- `svg/` 디렉터리에 원본 SVG, `scripts/generate.js`로 React 컴포넌트를 자동 생성합니다.
- 모든 아이콘은 `currentColor` 기반이며, `size`와 `color` prop으로 제어할 수 있습니다.

### `@nudge-eap/storybook`

- 디자인 토큰과 컴포넌트를 시각적으로 검증하기 위한 Storybook 앱입니다.
- 구현된 주요 컴포넌트 전체와 토큰 reference 스토리가 포함되어 있습니다.
- `play` 함수 기반 interaction test, a11y 검사, Chromatic 시각 회귀 흐름을 함께 운영합니다.

### `@nudge-eap/docs`

- Docusaurus 기반 문서 사이트입니다.
- 레포의 `docs/` 디렉터리를 문서 소스로 사용합니다.
- 디자인 시스템 계획, 토큰, AI 워크플로우, 운영 가이드를 문서 사이트로 탐색할 수 있습니다.

## 문서

- [docs/DESIGN_SYSTEM_PLAN.md](./docs/DESIGN_SYSTEM_PLAN.md): 디자인 시스템 구축 방향과 아키텍처 계획
- [docs/TOKENS.md](./docs/TOKENS.md): Figma 기준 토큰 정의
- [docs/AI_PROMPTS.md](./docs/AI_PROMPTS.md): AI 활용용 프롬프트 모음
- [docs/FIGMA_TO_REACT_WORKFLOW.md](./docs/FIGMA_TO_REACT_WORKFLOW.md): Figma -> tokens -> spec -> React -> Storybook으로 이어지는 반자동화 워크플로우
- [docs/STYLING_STRUCTURE_GUIDE.md](./docs/STYLING_STRUCTURE_GUIDE.md): `기본 스타일 < 프로젝트 스타일 < 외부 커스텀` 우선순위를 기준으로 한 스타일 확장 구조 가이드
- [docs/MODAL_MIGRATION_NOTES.md](./docs/MODAL_MIGRATION_NOTES.md): 실제 Homepage/Webview 모달 파일 위치와 교체 검토 내용을 기록한 마이그레이션 메모
- [docs/AUTOMATION_WORKFLOW.md](./docs/AUTOMATION_WORKFLOW.md): 기존 코드 비교, 접근성 개선, 실서비스 예시 스토리, migration 문서화까지 포함한 반복 업무 워크플로우
- [docs/components/inventory.md](./docs/components/inventory.md): Figma, Storybook, Docs, 구현 상태를 하나로 연결한 컴포넌트 인벤토리

## 운영 핵심 원칙

디자인 시스템을 실무에서 안정적으로 운영하려면 아래 4가지를 함께 가져가는 것을 권장합니다.

1. `tokens` 를 Figma 값의 공식 번역 레이어로 둡니다.
2. 각 컴포넌트마다 `component spec` 과 `figma node id` 를 남깁니다.
3. Storybook을 단순 데모가 아니라 시각 계약서처럼 운영합니다.
4. PR 템플릿에 Figma 링크, token 변경 여부, Storybook 반영 여부를 필수 항목으로 둡니다.

이 4가지가 있어야 Figma와 코드가 사람 기억에 의존하지 않고, 작업 과정 안에서 계속 동기화될 수 있습니다.

## 시작하기

### 요구 사항

- Node.js 20.x
- pnpm 9.x

### 설치

```bash
pnpm install
```

### 개발용 명령어

```bash
# 전체 워크스페이스 dev
pnpm dev

# Docusaurus docs 실행
pnpm docs:dev

# Storybook 실행
pnpm storybook

# 전체 패키지 build
pnpm build

# 전체 테스트 실행
pnpm test

# Docusaurus docs 빌드
pnpm docs:build

# Chromatic 실행
pnpm --filter @nudge-eap/storybook chromatic --project-token=<YOUR_PROJECT_TOKEN>

# 전체 워크스페이스 lint
pnpm lint

# 전체 워크스페이스 typecheck
pnpm typecheck
```

Storybook은 기본적으로 `http://localhost:6006` 에서 실행됩니다.
Docs는 기본적으로 `http://localhost:3001` 에서 실행됩니다.

주의:

- `pnpm docs` 는 pnpm 내장 명령으로 해석되어 npm 패키지 문서 페이지를 열 수 있습니다.
- 문서 사이트 실행은 `pnpm docs:dev` 를 사용합니다.

Storybook QA 참고:

- `@storybook/addon-a11y`, `@storybook/addon-interactions`, `@chromatic-com/storybook` 이 설정되어 있습니다.
- `play` 함수 기반 상호작용 테스트는 Storybook Interactions 패널에서 확인할 수 있습니다.
- `@storybook/test-runner` + `axe-playwright` 기반 접근성 검사가 CI에서 실행됩니다.
- Chromatic 시각 회귀 테스트를 사용하려면 먼저 Chromatic 프로젝트를 이 레포의 Storybook과 연결해야 합니다.
- 로컬 실행 또는 GitHub Actions CI에서 Chromatic을 사용하려면 `CHROMATIC_PROJECT_TOKEN` 이 필요합니다.
- CI는 [`.github/workflows/chromatic.yml`](./.github/workflows/chromatic.yml) 에서 `secrets.CHROMATIC_PROJECT_TOKEN` 을 읽도록 구성되어 있습니다.
- 루트 CI는 lint, typecheck, test, build, docs build, Storybook build, Storybook test, Figma link check를 수행합니다.
- Chromatic은 토큰이 없으면 skip 되므로, 실제 팀 운영에서는 required check 정책을 함께 정하는 것이 좋습니다.
- 스토리 이름은 `State/...`, `Recipe/...`, `Interaction/...`, `QA/...`, `Reference/...` prefix를 기준으로 맞춥니다. `Playground`는 예외로 루트 데모 이름을 그대로 유지합니다.

새 스토리 추가 체크리스트:

1. 기본 조합은 `State/...`로 추가합니다.
2. 실제 사용 흐름이나 조합 예시는 `Recipe/...`로 추가합니다.
3. `play` 함수가 있으면 `Interaction/...`로 이름을 맞춥니다.
4. 비교·검토용 스토리는 `QA/...`, 토큰 보드형 스토리는 `Reference/...`를 사용합니다.
5. 상태가 필요한 스토리는 `render` 안에서 직접 Hook을 쓰지 말고 별도 React 컴포넌트로 분리합니다.
6. 접근성 위반은 CI에서 실패 처리되므로, 새 스토리는 Storybook canvas와 Interactions 패널에서 한 번 확인합니다.

## Figma 연결 메타데이터 운영

기획자, 디자이너, 개발자가 같은 기준으로 컴포넌트를 찾을 수 있도록 `metadata/componentInventory.json`을 Source of Truth로 사용합니다.

이 파일에는 아래 정보를 기록합니다.

- 컴포넌트 이름
- Storybook title
- Docs 경로
- Figma 링크
- Figma node id
- 구현 상태
- 사용 범위 / 메모

예시:

```json
{
  "name": "Input",
  "storybookTitle": "Components/Input",
  "docsPath": "/docs/components/input",
  "figmaUrl": "https://www.figma.com/design/FILE_KEY/Design-System?node-id=430-4212",
  "figmaNodeId": "430:4212",
  "status": "implemented"
}
```

### 어떻게 반영되는가

이 메타데이터는 아래 3곳에 함께 반영됩니다.

1. Storybook Docs의 컴포넌트 설명 영역
2. Docusaurus의 [컴포넌트 인벤토리](./docs/components/inventory.md)
3. 로컬 운영 문서와 구현 상태 점검 흐름

### 수정 순서

1. `metadata/componentInventory.json` 수정
2. `pnpm generate:component-inventory` 실행
3. Storybook 또는 docs에서 반영 결과 확인

`build`, `dev`, `docs:build`, `storybook`, `lint` 실행 전에는 인벤토리 문서가 자동 생성됩니다.

### 누가 무엇을 넣는가

- 디자이너: `figmaUrl`, `figmaNodeId`
- 개발자: `storybookTitle`, `docsPath`, `status`
- 기획자/디자이너/개발자 공통: `usageSummary`, `notes`

## 패키지별 명령어

```bash
# tokens 빌드
pnpm --filter @nudge-eap/tokens build

# react 패키지 빌드
pnpm --filter @nudge-eap/react build

# tailwind preset 빌드
pnpm --filter @nudge-eap/tailwind-preset build

# icons 생성 및 빌드
pnpm --filter @nudge-eap/icons build

# storybook 앱 실행
pnpm --filter @nudge-eap/storybook dev

# 컴포넌트 인벤토리 문서 재생성
pnpm generate:component-inventory
```

## Icons Package

`packages/icons` 는 Figma 디자인 기준 **83종** 아이콘을 React 컴포넌트로 제공하는 패키지입니다.

### 사용법

```tsx
import { SearchIcon, ChevronRightIcon, PlayIcon } from "@nudge-eap/icons";

// 기본 사용
<SearchIcon />

// size, color 제어
<ChevronRightIcon size={16} color="#2B96ED" />

// ref 전달, SVG props 확장
<PlayIcon size={32} className="my-icon" aria-hidden="true" />
```

### 아이콘 목록 (83종)

| 카테고리   | 아이콘                                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 방향       | `ChevronUp`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `ArrowBack`, `ArrowNext`                                                          |
| 네비게이션 | `Home`, `HomeActive`, `Challenge`, `ChallengeActive`, `Counsel`, `CounselActive`, `Mentalcare`, `MentalcareActive`, `Mypage`, `MypageActive` |
| 리액션     | `Push`, `PushActive`, `Favorite`, `FavoriteActive`, `Like`, `LikeActive`, `ThumbUp`                                                          |
| 미디어     | `Play`, `Pause`, `SkipBack`, `SkipForward`, `Repeat`, `Shuffle`, `SleepmodeOn`, `SleepmodeOff`, `Mymusic`, `Recent`                          |
| 액션       | `Search`, `Filter`, `Edit`, `Delete`, `Close`, `Plus`, `Minus`, `Refresh`, `Share`, `Download`, `Addlist`, `Drag`, `Inputdelete`             |
| 상태/정보  | `Eye`, `EyeOff`, `Star`, `Info`, `Siren`, `Report`, `Block`, `Comment`, `TestresultDanger`, `TestresultWarning`, `TestresultSafe`            |
| 소통       | `CounselingChat`, `CounselingVideo`, `Telephone`, `Link`                                                                                     |
| 장치/기능  | `Camera`, `Videocamera`, `Microphone`, `Monitor`, `Bluetooth`, `Hamburger`, `Setting`, `Calendar`, `Time`                                    |
| 장소/이동  | `Locate`, `Pin`, `Subway`, `Walk`, `Web`                                                                                                     |
| 기타       | `Point`, `Coupon`, `Test`, `Facility`, `Center`, `DecorationSticker`, `DecorationText`                                                       |

> 모든 컴포넌트명은 `{PascalCase}Icon` 형식입니다. (예: `SearchIcon`, `PlayIcon`)

### 아이콘 추가 방법

```bash
# 1. svg/ 폴더에 kebab-case 이름으로 SVG 추가
packages/icons/svg/new-icon.svg

# 2. React 컴포넌트 생성 + 타입 빌드
pnpm --filter @nudge-eap/icons build
```

### 네이밍 규칙

| 단계           | 형식                | 예시               |
| -------------- | ------------------- | ------------------ |
| Figma 레이어   | `Icon/chevron-left` | —                  |
| SVG 파일명     | `kebab-case.svg`    | `chevron-left.svg` |
| React 컴포넌트 | `PascalCaseIcon`    | `ChevronLeftIcon`  |

### Figma 원본

아이콘은 [넛지EAP Design Copy](https://www.figma.com/design/4Q1kbp7e38CH8DXQPiEi0D) 파일의 `icon` 섹션(node `508:6942`)에서 Figma MCP를 통해 SVG를 추출했습니다. 모든 SVG는 `viewBox="0 0 24 24"`, `currentColor` 기반으로 정규화되어 있습니다.

## 사용 예시

### React Button

```tsx
import { Button } from "@nudge-eap/react";

export function Example() {
  return (
    <Button variant="solid" size="lg" color="primary">
      확인
    </Button>
  );
}
```

### Icons

```tsx
import { SearchIcon, ChevronRightIcon } from "@nudge-eap/icons";

<SearchIcon />
<ChevronRightIcon size={16} color="gray" />
```

### Tokens

```tsx
import { semantic, spacing, typeScale } from "@nudge-eap/tokens";
```

```ts
import { nudgeEapPreset } from "@nudge-eap/tailwind-preset";

export default {
  presets: [nudgeEapPreset],
};
```

### CSS Variables

```tsx
import "@nudge-eap/tokens/css";
```

## 현재 상태 메모

- 이 레포는 "컴포넌트 몇 개만 있는 초기 스캐폴드" 단계는 이미 지났습니다.
- 토큰, React 컴포넌트 15종, 아이콘 83종, Tailwind preset, Storybook, Docusaurus docs, 메타데이터 인벤토리, CI, Vitest 기반 테스트가 함께 운영되고 있습니다.
- React 패키지는 현재 Vitest + Testing Library 기반 테스트와 coverage 산출이 동작합니다.
- 다만 아직 "완전히 닫힌 배포/운영형 디자인 시스템"이라고 보기는 어렵고, Figma 추적성, 릴리스 정책, 영향도 분석 같은 운영 성숙도는 계속 보강 중입니다.
