# @nudge-design/styles

Nudge Design System 의 **프레임워크 무관 CSS 번들**. `@nudge-design/react` 와 `@nudge-design/html` 이 **같은 스타일시트를 공유**합니다 — 그래서 react/html 두 미러의 치수가 구조적으로 어긋날 수 없습니다.

## 의존 / 소비

- 의존: `tokens`
- `react`·`html` 이 의존. 외부 앱은 보통 react/html 을 통해 간접 소비:

```ts
import "@nudge-design/react/styles.css";   // react 경유
// 또는
import "@nudge-design/styles/styles.css";  // 직접
```

## 어떻게 동작하나

```
src/<Component>.ts            ← export const xxxStyles = `... ${cv.*} ...`
scripts/extract-styles.mjs    ← src/*.ts 의 모든 xxxStyles 리터럴을 추출·병합
dist/styles.css               ← 생성물 (번들된 단일 CSS)
```

- 각 컴포넌트 스타일은 `<Component>.ts` 에 `xxxStyles` 템플릿 리터럴로 작성하고, 추출기가 토큰 값을 평가해 `dist/styles.css` 로 병합합니다.
- 새 컴포넌트 스타일 파일을 만들면 **자동으로 번들**됩니다(별도 index 등록 불필요).
- 색은 `cv.*`(토큰) 로만 — raw hex 금지. 프로젝트 차이는 `tokens/src/projects/*` 가 토큰 값으로 흘려보냄(`[data-project]` 색 분기 지양).

## 빌드

```bash
pnpm build --filter @nudge-design/styles   # tokens 빌드 후
```

`styles` 는 react/html 의 SSOT 스타일이므로 여기만 고치면 두 미러에 동시 반영됩니다. 구조: [ARCHITECTURE.md](../../ARCHITECTURE.md).
