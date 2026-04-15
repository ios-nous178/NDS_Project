# Component, Unit, Snapshot Test Strategy

> NudgeEAP Design System의 테스트를 컴포넌트 테스트, 단위 테스트, 스냅샷 테스트로 나누어 운영하기 위한 집중 계획입니다.

---

## 1. 테스트를 나누는 기준

### 컴포넌트 테스트

React 컴포넌트를 실제 사용자 관점으로 렌더링하고, 접근 가능한 DOM과 이벤트 결과를 검증한다.

| 기준             | 내용                                                                        |
| ---------------- | --------------------------------------------------------------------------- |
| 도구             | Vitest, React Testing Library, user-event, jest-dom                         |
| 위치             | `packages/react/test/component/*.test.tsx`                                  |
| 검증 대상        | props 조합, 상태 변화, 이벤트, controlled/uncontrolled, ARIA, focus, portal |
| 검증하지 않을 것 | 픽셀 단위 스타일, Storybook 전체 시각 회귀, Figma와의 정확한 시각 차이      |

컴포넌트 테스트는 이 프로젝트에서 가장 중요한 기본 안전망이다. `Button`을 클릭했을 때 콜백이 호출되는지, `Modal`이 ESC로 닫히는지, `Input`의 label과 input이 연결되는지 같은 사용자의 행동 결과를 검증한다.

### 단위 테스트

렌더링 없이 작은 함수, 상태 계산, 매핑 규칙을 검증한다.

| 기준             | 내용                                                                       |
| ---------------- | -------------------------------------------------------------------------- |
| 도구             | Vitest                                                                     |
| 위치             | `packages/react/test/unit/*.test.ts`                                       |
| 검증 대상        | className 조합, variant 매핑, size config, reducer, formatting/helper 함수 |
| 검증하지 않을 것 | React 렌더링 결과, 브라우저 이벤트, CSS 실제 적용                          |

현재 컴포넌트 내부 로직이 대부분 파일 안에 닫혀 있다면 단위 테스트를 억지로 늘리지 않는다. 대신 `Select`, `Toast`, `Tabs`처럼 상태 계산이 복잡해지거나 helper가 분리되는 순간 단위 테스트를 붙인다.

### 스냅샷 테스트

시각적 출력이 의도치 않게 바뀌었는지 비교한다.

| 기준             | 내용                                                    |
| ---------------- | ------------------------------------------------------- |
| 권장 도구        | Chromatic, Storybook                                    |
| 위치             | `apps/storybook/src/stories/*.stories.tsx`              |
| 검증 대상        | variant, size, state별 외형 변화, 토큰 변경의 시각 영향 |
| 검증하지 않을 것 | 비즈니스 로직, 세부 DOM 구조, 콜백 호출 여부            |

여기서 말하는 스냅샷 테스트의 기본값은 Vitest DOM snapshot이 아니라 Chromatic 기반 visual snapshot이다. DOM snapshot은 작은 구조 계약을 확인할 때만 제한적으로 사용한다. 예를 들어 `data-slot` 구조가 문서화된 compound component에서 root/title/action 슬롯 존재 여부를 잠깐 고정하는 정도가 적당하다.

---

## 2. QA에서 확인할 것과 구조 단계에서 확인할 것을 나누기

디자인 시스템 QA에서 자주 생기는 오해는 "스토리와 시각 회귀를 잘 보면 구조 품질까지 보장된다"는 기대다. 실제로는 그렇지 않다. Storybook과 Chromatic은 사용자에게 보이는 결과와 상호작용 회귀를 확인하는 데 매우 강하지만, 플랫폼 중립성이나 React 의존도 같은 구조 문제를 대신 검증해주지는 않는다.

### QA 단계에서 확인 가능한 것

- Flat API와 Compound API가 같은 시각 결과와 상태 전환을 내는지
- variant별 외형 회귀가 없는지
- active tab 전환, panel 표시/숨김, 긴 라벨과 overflow, 좁은 폭 레이아웃이 안정적인지
- WebView 마이그레이션 시나리오가 기존 화면 흐름과 비슷하게 동작하는지
- 키보드 Enter/Space, focus 진입, 기본적인 ARIA 노출이 깨지지 않는지

### QA만으로는 충분하지 않은 것

- 컴포넌트가 특정 렌더러나 DOM 측정에 과도하게 묶여 있는지
- 상태 계약이 플랫폼 중립적으로 분리되어 있는지
- 나중에 React Native나 다른 렌더러로 옮길 때 재사용 가능한 구조인지
- 웹 전용 기능이 선택적 레이어인지, 핵심 계약에 섞여 있는지

즉 QA는 "겉으로 드러나는 사용 계약"을 강하게 확인하고, 구조 검토는 "이 계약을 어떤 의존성 위에 올려놨는지"를 확인한다. 둘은 대체 관계가 아니라 서로 보완 관계다.

---

## 2. 추천 테스트 피라미드

```text
빠르고 자주 실행

Unit tests
  - helper, reducer, 매핑 함수
  - 실패 원인이 가장 명확함

Component tests
  - 사용자 행동과 접근성 계약
  - PR 기본 체크로 운영

Visual snapshot tests
  - Chromatic에서 Storybook story 비교
  - 사람이 변경 의도를 승인

느리지만 시각 품질에 강함
```

권장 비중은 컴포넌트 테스트를 가장 크게 둔다.

| 테스트 종류     | 권장 비중 | 이유                                                     |
| --------------- | --------: | -------------------------------------------------------- |
| 컴포넌트 테스트 |       60% | 디자인 시스템 컴포넌트의 실제 사용 계약을 가장 잘 검증함 |
| 단위 테스트     |       20% | 복잡한 상태 계산과 매핑 로직을 빠르게 고립 검증함        |
| 스냅샷 테스트   |       20% | 토큰, 스타일, 레이아웃 변화를 리뷰 가능한 형태로 잡음    |

---

## 3. 파일 구조

```text
packages/react/
├── src/
│   ├── Button.tsx
│   ├── Input.tsx
│   └── ...
└── test/
    ├── setup.ts
    ├── component/
    │   ├── Button.test.tsx
    │   ├── Badge.test.tsx
    │   ├── Input.test.tsx
    │   ├── Modal.test.tsx
    │   ├── Popup.test.tsx
    │   ├── SearchInput.test.tsx
    │   ├── Tabs.test.tsx
    │   ├── BottomSheet.test.tsx
    │   ├── Checkbox.test.tsx
    │   ├── Select.test.tsx
    │   ├── Toast.test.tsx
    │   └── EmptyState.test.tsx
    └── unit/
        ├── tabs-state.test.ts
        ├── select-position.test.ts
        └── toast-queue.test.ts

apps/storybook/src/stories/
├── Button.stories.tsx
├── Input.stories.tsx
└── ...
```

`unit/` 아래 파일은 실제로 분리된 helper가 생겼을 때만 만든다. helper를 테스트하려고 컴포넌트 구조를 과하게 쪼개지는 않는다.

---

## 4. 컴포넌트별 우선순위

### P0 — 기본 사용 계약

| 컴포넌트 | 컴포넌트 테스트                                              | 단위 테스트                           | 스냅샷 테스트                      |
| -------- | ------------------------------------------------------------ | ------------------------------------- | ---------------------------------- |
| Button   | variant, size, disabled, fullWidth, icon slot, ref           | 없음                                  | variant/size/color matrix          |
| Badge    | variant, size, label 렌더링                                  | variant-class 매핑이 분리될 때만      | variant/size matrix                |
| Input    | label 연결, error/helper, clearable, controlled/uncontrolled | input id/helper id 매핑이 분리될 때만 | default/error/disabled/with button |
| Modal    | open/close, ESC, overlay click, focus trap, body scroll lock | focus 대상 계산이 분리될 때만         | default/confirm/custom content     |
| Popup    | confirm/cancel 콜백, alertdialog role, ESC, focus            | 버튼 배열 생성이 분리될 때만          | alert/confirm/destructive          |

### P1 — 상호작용 복잡도 높은 컴포넌트

| 컴포넌트    | 컴포넌트 테스트                                                   | 단위 테스트                                     | 스냅샷 테스트                      |
| ----------- | ----------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------- |
| SearchInput | clear button, Enter 검색, controlled/uncontrolled, disabled       | 없음                                            | outlined/filled, with value, error |
| Tabs        | value 전환, disabled tab, keyboard navigation, indicator          | tab index/value 계산                            | line/pill/square states            |
| BottomSheet | open/close, ESC, focus trap, body scroll lock, portal             | close transition 상태가 분리될 때만             | default/with actions/long content  |
| Select      | open/close, option 선택, disabled option, outside click, keyboard | selected label, option filtering, position 계산 | default/open/error/disabled        |

### P2 — 신규 또는 보조 컴포넌트

| 컴포넌트   | 컴포넌트 테스트                                              | 단위 테스트                        | 스냅샷 테스트                     |
| ---------- | ------------------------------------------------------------ | ---------------------------------- | --------------------------------- |
| Checkbox   | checked/unchecked, disabled, helper/error, group layout      | 없음                               | default/checked/error/group       |
| Radio      | 선택 변경, group value, disabled, helper/error               | group value 매핑이 분리될 때만     | default/selected/error/group      |
| Toast      | provider 렌더링, toast 추가/삭제, duration, maxCount, action | queue 제한, id 생성, duration 계산 | default/success/error/info        |
| EmptyState | icon/title/description/action, minHeight, slotProps          | 없음                               | no action/with action/custom icon |

`Checkbox.tsx` 안에 Radio 계열도 함께 정의되어 있으므로 테스트 파일은 `Checkbox.test.tsx`에 Checkbox와 Radio describe 블록을 함께 두는 편이 자연스럽다.

---

## 5. 테스트 이름 규칙

테스트 이름은 구현 세부사항보다 사용자 계약을 기준으로 쓴다.

```ts
describe("Button", () => {
  it("calls onClick when enabled", async () => {});
  it("does not call onClick when disabled", async () => {});
  it("forwards ref to the button element", () => {});
});
```

피해야 할 이름:

```ts
it("sets data-variant prop", () => {});
it("renders nds-button__root class", () => {});
```

예외적으로 `data-slot`이나 CSS class가 디자인 시스템의 공식 extension contract라면 테스트해도 된다. 다만 모든 className을 스냅샷처럼 고정하지는 않는다.

---

## 6. 스냅샷 운영 원칙

### DOM snapshot은 제한적으로 사용

아래처럼 큰 DOM 전체를 저장하는 테스트는 피한다.

```ts
expect(container).toMatchSnapshot();
```

이 방식은 변경 원인을 읽기 어렵고, 스타일 변경이나 wrapper 변경에도 테스트가 쉽게 깨진다.

대신 아래처럼 의미 있는 계약을 직접 검증한다.

```ts
expect(screen.getByRole("button", { name: "저장" })).toBeDisabled();
expect(screen.getByText("필수 항목입니다")).toBeVisible();
```

### Visual snapshot은 Storybook에서 관리

Chromatic이 비교할 story는 상태별로 명시한다.

```text
Button
- Default
- Variants
- Sizes
- WithIcons
- Disabled
- FullWidth
```

스토리 하나에 너무 많은 상태를 넣기보다, 리뷰하기 쉬운 단위로 나눈다. 단, 토큰 matrix처럼 전체 비교가 더 중요한 경우에는 `Variants` 같은 matrix story를 유지한다.

---

## 7. Tabs QA 체크리스트

`Tabs`는 시각 상태뿐 아니라 조합 방식과 접근성 계약도 중요하므로, 아래 항목을 Storybook과 컴포넌트 테스트로 나눠 확인한다.

### Storybook에서 바로 보여야 하는 체크포인트

- `line`, `pill`, `square` variant
- 스크롤 가능한 많은 탭
- Flat API와 Compound API parity
- 패널 없이 탭 리스트만 쓰는 경우
- 긴 라벨과 overflow
- WebView `SlideTab` 마이그레이션 예시
- 키보드 리뷰용 시나리오

### 컴포넌트 테스트로 잠가야 하는 체크포인트

- 클릭, Enter, Space로 activeKey가 바뀌는지
- active tab만 `tabIndex=0`인지
- `role="tablist"`, `role="tab"`, `role="tabpanel"`이 유지되는지
- 탭과 패널의 `aria-controls`, `aria-labelledby` 연결이 올바른지
- 화살표 키 이동 규칙이 의도대로 동작하는지
- Flat API와 Compound API가 같은 상태 계약을 따르는지

### 구조 검토에서 별도로 볼 항목

- indicator 위치 계산이 DOM 측정에 얼마나 강하게 묶여 있는지
- 핵심 상태 계약이 React 훅 바깥으로 분리 가능한지
- Flat API가 thin adapter이고 Compound API가 기준 계약인지
- 슬롯과 역할 설명이 CSS class보다 의미 단위로 문서화되어 있는지

`Tabs`처럼 앞으로 크로스플랫폼 대응 가능성을 열어둘 컴포넌트는 시각 QA만 통과했다고 끝내지 않는다. Storybook은 parity와 회귀를 확인하는 장소로 쓰고, 구조 검토에서는 headless state와 renderer-specific layer를 분리할 수 있는지를 본다.

---

## 8. EmptyState QA 체크리스트

`EmptyState`는 구조가 단순해 보여도 Flat API와 Compound API의 텍스트 표현 방식이 달라질 수 있으므로, multiline description parity를 따로 확인하는 편이 좋다.

### EmptyState Storybook 체크포인트

- 기본 empty state
- 액션 버튼 포함 상태
- 최소 높이 변형
- Flat API와 Compound API parity
- multiline description review

### EmptyState 테스트 체크포인트

- `description` string의 줄바꿈이 Flat API에서 의도대로 렌더링되는지
- Compound API의 `Description` children이 줄바꿈 포함 텍스트를 정상 표시하는지
- title, description, action이 조건부로 올바르게 렌더링되는지
- `minHeight`와 `slotProps`가 root 및 각 슬롯에 반영되는지

### 이 케이스에서 QA가 잘 잡는 것

- Flat API와 Compound API의 문장 줄바꿈 결과가 시각적으로 다른지
- 스토리에서 `{"\n"}` 또는 `<br />`를 썼을 때 실제 렌더링 차이가 있는지

### 이 케이스에서 QA만으로 부족한 것

- 왜 줄바꿈이 다르게 보였는지의 원인 분석
- 그 차이가 컴포넌트 구현인지, 스토리 작성 방식인지 구분하는 일

이런 종류의 이슈는 parity story와 visual QA가 "차이"를 잘 잡고, 컴포넌트 테스트와 구현 리뷰가 "원인"을 분리하는 식으로 접근하는 게 가장 효율적이다.

---

## 9. CI 실행 전략

### PR마다 실행

```bash
pnpm test
pnpm --filter @nudge-eap/storybook test-storybook
```

PR 기본 체크는 빠르게 실패해야 하므로 컴포넌트 테스트와 a11y 테스트를 먼저 둔다.

### PR마다 리뷰

```bash
pnpm --filter @nudge-eap/storybook chromatic
```

Chromatic은 테스트 실패라기보다 시각 변경 승인 흐름에 가깝게 운영한다. 의도한 디자인 변경이면 approve하고, 의도하지 않은 변경이면 PR에서 수정한다.

### 로컬 개발 중

```bash
pnpm --filter @nudge-eap/react test:watch
```

컴포넌트를 손보는 동안에는 watch mode로 해당 컴포넌트 테스트만 빠르게 돌린다.

---

## 10. 도입 순서

1. Vitest 환경과 `test` script를 먼저 만든다.
2. P0 컴포넌트 테스트를 작성한다.
3. Storybook story가 부족한 컴포넌트에 snapshot용 story를 보강한다.
4. Chromatic을 required check로 올린다.
5. P1 컴포넌트 테스트를 추가한다.
6. 복잡한 로직이 분리되는 순간 unit test를 추가한다.
7. P2 컴포넌트까지 coverage를 확장한다.

핵심은 단위 테스트를 먼저 많이 만드는 것이 아니라, 컴포넌트의 사용자 계약을 먼저 잠그는 것이다. 디자인 시스템에서는 "렌더링된 컴포넌트가 어떻게 쓰이는가"가 가장 중요한 회귀 지점이다.

---

## 11. 완료 기준

| 단계     | 완료 조건                                                                        |
| -------- | -------------------------------------------------------------------------------- |
| P0       | Button, Badge, Input, Modal, Popup 컴포넌트 테스트 존재                          |
| P1       | SearchInput, Tabs, BottomSheet, Select 컴포넌트 테스트 존재                      |
| P2       | Checkbox/Radio, Toast, EmptyState 컴포넌트 테스트 존재                           |
| Snapshot | 모든 컴포넌트에 기본/상태/에러/disabled story 중 필요한 조합 존재                |
| CI       | `pnpm test`, Storybook a11y/test-runner, Chromatic(토큰 설정 시)이 PR에서 실행됨 |
