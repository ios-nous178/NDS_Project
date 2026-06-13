# @nudge-design/html

Nudge Design System 의 **바닐라 웹컴포넌트**(`<nds-*>`) — 프레임워크 없는 DOM 엘리먼트. `@nudge-design/react` 의 미러로, **React 가 아닌 환경(순수 HTML 목업·이메일·타 프레임워크)** 에서 같은 DS 를 씁니다.

## 의존 / 소비

- 의존: `tokens` · `icons` · `styles` · `assets`
- `mockup-core` 가 의존(목업 빌드). 외부 목업 앱도 소비.

```html
<link rel="stylesheet" href="@nudge-design/styles/styles.css" />
<script type="module">import "@nudge-design/html/runtime";</script>

<nds-button variant="solid" size="md">시작하기</nds-button>
```

`import "@nudge-design/html/runtime"` 한 번이면 모든 `nds-*` 가 등록됩니다.

## react 미러 규칙

- react 가 Props **SSOT**, html 은 따라갑니다. set/enum drift 는 `pnpm lint:mirror-parity` 가 차단.
- `observedAttributes` 는 react Props 에서 생성된 `src/generated/component-attrs.*` 를 참조 → react 에 prop 추가 후 `pnpm fix`(또는 `generate:attrs`)로 재생성.
- `define()` 하는 컴포넌트는 `src/runtime.ts` 에도 import 해야 standalone 번들에 포함됩니다(`check-runtime-registry` 게이트).
- 입력(input) 컴포넌트는 **mount-once**(value 갱신 시 input 재생성 금지) — `check-input-tests` 게이트가 포커스 보존 테스트를 강제.

## 구조

```
src/components/nds-<c>.ts     ← 웹컴포넌트 (react 미러)
src/base/nds-element.ts       ← 공통 베이스 클래스
src/runtime.ts                ← 전체 등록 side-effect 엔트리
src/generated/                ← component-attrs (생성물)
test/                         ← 포커스 보존 등 계약 테스트
```

스타일은 `@nudge-design/styles`(react 와 공용). 자세한 구조: [ARCHITECTURE.md](../../ARCHITECTURE.md) "3면 미러".
