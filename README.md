# NudgeEAP Design System

트로스트 / 지니어트 / NudgeEAP의 디자인 토큰, React 컴포넌트, 아이콘, Storybook, 문서를 관리하는 모노레포입니다.

## 배포 사이트

| 경로                                                                                                      | 설명                                    |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [/](http://nudge-eap-design-system.eba-afhh232q.ap-northeast-2.elasticbeanstalk.com/)                     | 랜딩 페이지 (Docs / Storybook 바로가기) |
| [/docs/](http://nudge-eap-design-system.eba-afhh232q.ap-northeast-2.elasticbeanstalk.com/docs/)           | Docusaurus 문서 사이트                  |
| [/storybook/](http://nudge-eap-design-system.eba-afhh232q.ap-northeast-2.elasticbeanstalk.com/storybook/) | Storybook 컴포넌트                      |

## Packages

| 패키지                       | 설명                                                                     |
| ---------------------------- | ------------------------------------------------------------------------ |
| `@nudge-eap/tokens`          | 색상, 타이포그래피, spacing, radius 토큰. TS export + CSS 변수 파일 생성 |
| `@nudge-eap/react`           | React 컴포넌트 28종 (Button, Card, Modal, Tabs, Toast, Avatar 등)        |
| `@nudge-eap/icons`           | Figma 기준 85종 아이콘. `currentColor` 기반, `size`/`color` prop 지원    |
| `@nudge-eap/tailwind-preset` | 토큰 기반 Tailwind theme preset                                          |

## 프로젝트 구조

```text
NudgeEAPDesignSystem
├─ apps
│  ├─ docs              # Docusaurus 문서 사이트
│  ├─ storybook         # Storybook (컴포넌트 + 브랜드 목업)
│  └─ web-server        # 배포용 서버 (랜딩 + docs + storybook)
├─ packages
│  ├─ tokens            # 디자인 토큰
│  ├─ react             # React 컴포넌트
│  ├─ icons             # 아이콘
│  └─ tailwind-preset   # Tailwind preset
├─ brands               # 브랜드별 설정
├─ docs                 # 문서 소스 (Docusaurus)
├─ harness              # 하네스 파이프라인 프롬프트
├─ metadata             # Figma 연결 메타데이터
├─ mockups              # 목업 산출물
└─ scripts              # 유틸리티 스크립트
```

## 시작하기

```bash
# 요구 사항: Node.js 20.x, pnpm 9.x

pnpm install          # 의존성 설치
pnpm build            # 전체 빌드
pnpm storybook        # Storybook 실행 (localhost:6006)
pnpm docs:dev         # Docs 실행 (localhost:3001)
```

## 주요 명령어

```bash
pnpm build                          # 전체 빌드
pnpm dev                            # 전체 dev
pnpm lint                           # 전체 lint
pnpm typecheck                      # 전체 타입 체크
pnpm test                           # 전체 테스트
pnpm --filter @nudge-eap/tokens build   # 토큰만 빌드
pnpm --filter @nudge-eap/icons build    # 아이콘 생성 + 빌드
pnpm generate:component-inventory       # 컴포넌트 인벤토리 재생성
```

## 사용 예시

```tsx
// 컴포넌트
import { Button, Card, Tabs } from "@nudge-eap/react";

// 아이콘
import { SearchIcon, ChevronRightIcon } from "@nudge-eap/icons";

// 토큰
import { semantic, spacing, typeScale } from "@nudge-eap/tokens";
import "@nudge-eap/tokens/css"; // CSS 변수

// Tailwind preset
import { nudgeEapPreset } from "@nudge-eap/tailwind-preset";
```

## 멀티 브랜드

3개 브랜드를 CSS 변수 오버라이드로 지원합니다. Storybook 툴바에서 브랜드를 전환하면 동일 컴포넌트가 브랜드별 스타일로 렌더링됩니다.

- **NudgeEAP** (블루) — 기본 토큰, 기업 EAP 멘탈케어
- **Trost** (옐로우) — 심리 상담 플랫폼
- **Geniet** (틸) — 건강 관리 + 리워드 커머스

## Storybook 도구

Storybook 하단 패널에서 사용할 수 있는 도구:

- **토큰 에디터** — 브랜드별 CSS 변수를 실시간 편집
- **스펙 오버레이** — hover 시 요소의 크기, 폰트, 색상, 패딩 등 CSS 스펙 표시
- **CSS 편집기** — 요소 선택 후 스타일 직접 수정, undo/redo, 디자인 리포트 생성
- **HTML/PNG 내보내기** — 목업을 standalone HTML 또는 PNG 스크린샷으로 저장

## 문서

| 문서                                                            | 설명                               |
| --------------------------------------------------------------- | ---------------------------------- |
| [DESIGN_SYSTEM_PLAN.md](./docs/DESIGN_SYSTEM_PLAN.md)           | 디자인 시스템 구축 방향과 아키텍처 |
| [TOKENS.md](./docs/TOKENS.md)                                   | Figma 기준 토큰 정의               |
| [FIGMA_TO_REACT_WORKFLOW.md](./docs/FIGMA_TO_REACT_WORKFLOW.md) | Figma -> React 반자동화 워크플로우 |
| [STYLING_STRUCTURE_GUIDE.md](./docs/STYLING_STRUCTURE_GUIDE.md) | 스타일 확장 구조 가이드            |
| [components/inventory.md](./docs/components/inventory.md)       | 컴포넌트 인벤토리                  |

## CI

GitHub Actions로 lint, typecheck, test, build, Storybook build, 접근성 검사를 자동 실행합니다. Chromatic 시각 회귀 테스트는 `CHROMATIC_PROJECT_TOKEN` 설정 시 활성화됩니다.
