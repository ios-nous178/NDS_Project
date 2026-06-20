# @nudge-design/react

Nudge Design System 의 **React 컴포넌트** (~111종). 컴포넌트 **Props 의 SSOT** 이며, `styles`/`html` 미러가 이걸 따라갑니다.

## 의존 / 소비

- 의존: `tokens` · `icons` · `styles` · `assets`
- 외부 프로덕트 앱이 npm 으로 직접 소비하는 패키지

```tsx
import { Button, Card, Modal } from "@nudge-design/react";
import "@nudge-design/react/styles.css";   // 공용 CSS 번들

<Button variant="solid" size="md">시작하기</Button>
```

`exports`: `.`(컴포넌트) · `./inspector`(개발용 인스펙터) · `./styles.css`.

## 구조

```
src/<Component>.tsx          ← 구현 + Props (SSOT)
src/<Component>.guide.ts     ← (일부) props 가이드 메타
src/index.ts                 ← 공개 export 배럴
src/{geniet,trost,...}/      ← 프로젝트 chrome(header/footer/bottom-nav)
```

스타일은 이 패키지가 아니라 `@nudge-design/styles` 에 있습니다(react·html 공용). 색은 `cv.*` 헬퍼로 토큰을 참조하고 raw hex 를 박지 않습니다.

## 자주 하는 실수

- 새 컴포넌트를 만들고 **html 미러를 빠뜨림** → `pnpm lint:mirror-parity` 차단. → `/ds-component` 스킬을 쓰면 3면을 한 번에.
- `index.ts` export 누락 → catalog 는 dist 를 읽어 통과해도 **공개 API 에서 빠짐**(소비 불가).
- 상대 import 에 `.js` 확장자 누락 → ESM(NodeNext) 빌드 에러.

## 컴포넌트 추가

`/ds-component <figma>` 스킬이 react+styles+html+스토리+카탈로그+MCP 가이드+검증을 한 번에 처리합니다. 수동 절차는 [CONTRIBUTING.md](../../CONTRIBUTING.md) · 편입 기준은 [CLAUDE.md](../../CLAUDE.md).
