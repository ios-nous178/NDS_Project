---
sidebar_position: 1
title: 디자인 원칙
---

# 디자인 원칙

NudgeEAP Design System(NDS)의 핵심 설계 원칙입니다.

---

## 1. 토큰이 진실의 원천이다

모든 시각적 속성(색상, 타이포, 간격)은 디자인 토큰에서 시작합니다.

- Figma의 디자인 값 → `@nudge-eap/tokens`에 정의
- 컴포넌트는 토큰만 참조
- 토큰이 변경되면 모든 컴포넌트에 일괄 반영

```
Figma → tokens → components → project
```

하드코딩된 `#2B96ED` 대신 `colors.blue[500]` 또는 `colors.semantic.primary.main`을 사용합니다.

---

## 2. Flat + Compound 하이브리드 API

모든 컴포넌트는 **두 가지 인터페이스**를 제공합니다.

### Flat API — 빠르게

대부분의 사용 사례를 props 하나로 해결합니다.

```tsx
<Modal open={open} onClose={close} title="알림" onConfirm={handle}>
  내용
</Modal>
```

### Compound API — 자유롭게

레이아웃이나 스타일을 세밀하게 제어해야 할 때 사용합니다.

```tsx
<Modal.Root open={open} onClose={close}>
  <Modal.Overlay />
  <Modal.Content>
    <Modal.Header title="알림" />
    <Modal.Body>내용</Modal.Body>
    <Modal.Footer onConfirm={handle} />
  </Modal.Content>
</Modal.Root>
```

내부적으로는 같은 primitive를 공유합니다. Flat API는 Compound API의 조합으로 구현됩니다.

---

## 3. 스타일 확장 3단계

프로젝트마다 다른 디자인 요구사항에 대응할 수 있는 3단계 확장 체계입니다.

```
기본 디자인 시스템 < 프로젝트 스타일 < 인스턴스 커스텀
```

### 1단계: CSS 변수 오버라이드

전역 또는 특정 스코프에서 CSS 변수를 변경합니다.

```css
:root {
  --nds-button-radius: 12px;
}
```

### 2단계: className 전달

컴포넌트의 루트나 슬롯에 클래스를 추가합니다.

```tsx
<Button className="my-project-button">확인</Button>
```

### 3단계: slotProps

내부 슬롯 요소에 직접 props를 전달합니다.

```tsx
<Input
  slotProps={{
    wrapper: { style: { borderColor: 'red' } },
    field: { className: 'text-lg' },
  }}
/>
```

---

## 4. 접근성 내장

접근성은 선택이 아닌 기본입니다.

- Modal/Popup: 포커스 트랩, ESC 닫기, ARIA 속성 자동 연결
- Input: label↔input 연결, 에러 상태 표현
- Button: `type="button"` 기본값, disabled 처리
- 모든 오버레이: body 스크롤 잠금, 포커스 복원

개발자가 별도로 신경 쓰지 않아도 기본적인 접근성이 보장됩니다.

---

## 5. 프레임워크 비의존

NDS 컴포넌트는 특정 스타일링 프레임워크에 의존하지 않습니다.

- CSS-in-JS 없이 동작 (CSS 변수 + 인라인 스타일)
- Tailwind, styled-components, CSS Modules 어디서든 확장 가능
- `data-slot` 속성으로 외부에서 타겟팅 가능
- `nds-*` 클래스 네임스페이스로 충돌 방지

```tsx
// Tailwind 프로젝트
<Button className="shadow-lg hover:shadow-xl">확인</Button>

// styled-components 프로젝트
const StyledButton = styled(Button)`
  [data-slot="label"] { letter-spacing: 0.05em; }
`;
```

---

## 6. Figma-Code 동기화

디자인과 코드 사이의 간극을 최소화합니다.

| 단계 | 설명 |
|---|---|
| Figma 디자인 | 디자이너가 피그마에서 설계 |
| → 토큰 추출 | 실측값을 tokens 패키지에 반영 |
| → 스펙 작성 | 컴포넌트 스펙 + Figma Node ID 기록 |
| → 구현 | React 컴포넌트 개발 |
| → Storybook | 시각적 QA |
| → 문서화 | Docusaurus에 사용법 기록 |

각 단계에서 사람의 승인(human approval)을 거쳐 품질을 보장합니다.
