# Styling Structure Guide

이 문서는 NudgeEAP 디자인시스템 컴포넌트의 스타일 확장 구조를 어떤 원칙으로 가져갈지 정리한 가이드입니다.

목표는 단순히 "예쁘게 보이는 컴포넌트"를 만드는 것이 아니라, 아래 세 레이어가 충돌 없이 함께 동작하는 구조를 만드는 것입니다.

1. 기본 스타일
2. 특정 프로젝트 스타일
3. 최종 사용처의 커스텀 스타일

실무에서 원하는 우선순위는 보통 아래와 같습니다.

```text
기본 스타일 < 프로젝트 스타일 < 외부 커스텀 props/style
```

이 구조를 가져가야 Storybook, 디자인시스템 패키지, 실제 서비스 프로젝트가 서로 다른 책임을 가지면서도 안정적으로 같이 운영될 수 있습니다.

## 왜 필요한가

서비스 프로젝트에서는 같은 컴포넌트라도 아래처럼 요구가 달라집니다.

- 기본 디자인시스템 모양은 유지하고 싶다
- 특정 프로젝트에서는 radius, spacing, footer layout만 조금 다르게 쓰고 싶다
- 어떤 화면에서는 한 번 더 세밀하게 덮어쓰고 싶다

이 요구를 수용하지 못하면 결국:

- 디자인시스템 컴포넌트를 못 쓰고
- 프로젝트마다 다시 구현하고
- Storybook은 데모 전용으로 남고
- 실제 서비스 UI와 디자인시스템이 점점 멀어집니다

따라서 컴포넌트는 처음부터 "스타일 확장 가능한 표면"을 제공해야 합니다.

## 핵심 원칙

### 1. 기본 스타일은 클래스와 CSS 변수로 둡니다

기본 스타일을 전부 inline style로 넣으면 프로젝트 레벨 CSS가 덮어쓰기 어렵습니다.

권장 방식:

- 기본 구조는 안정적인 class 이름 제공
- 주요 값은 CSS 변수로 노출
- 필요할 때만 props로 변수를 덮어쓰기

예시:

- `nds-modal__content`
- `nds-button`
- `nds-badge`
- `--nds-modal-radius`
- `--nds-button-height`
- `--nds-badge-background`

### 2. 루트와 슬롯에 모두 진입점을 둡니다

프로젝트에서는 루트만 바꾸는 경우도 있고, 특정 슬롯만 바꾸는 경우도 많습니다.

그래서 컴포넌트는:

- 루트 `className`
- 슬롯별 `className`
- 슬롯별 `style`
- 슬롯별 `slotProps`
- `data-slot`

을 함께 제공하는 것이 좋습니다.

### 3. `style`은 최종 override 용도로 둡니다

`style`은 우선순위가 가장 높기 때문에, 토큰 기반 기본 구조를 완전히 깨뜨릴 수도 있습니다.

그래서 운영 원칙은 다음처럼 가져가는 것이 좋습니다.

- 기본 조정: `variant`, `size`, `color`
- 프로젝트 단위 확장: `className`, `slotProps.className`
- 마지막 예외 처리: `style`, `slotProps.style`

즉, `style`은 "항상 기본 수단"이 아니라 "최종 수단"에 가깝게 봅니다.

## 권장 우선순위

컴포넌트에서 실제로 스타일이 적용되는 우선순위는 아래처럼 가져갑니다.

### 1. 기본 스타일

디자인시스템이 제공하는 기본 class, modifier, CSS variable fallback

예:

- `.nds-modal__content`
- `.nds-button`
- `.nds-badge`

### 2. 프로젝트 스타일

특정 앱이나 프로젝트 wrapper에서 주입하는 className 기반 스타일

예:

- `styled(Modal)`
- `contentClassName="project-modal-content"`
- `bodyClassName="project-modal-body"`

### 3. 외부 커스텀 스타일

실제 사용처에서 마지막으로 넘기는 props 기반 스타일

예:

- `style`
- `contentStyle`
- `slotProps.content.style`

## 권장 API 구조

### 공통

가능하면 아래 요소를 공통으로 제공합니다.

- `className`
- `style`
- `data-slot`

### 슬롯이 있는 컴포넌트

아래 구조를 우선 고려합니다.

- `overlayClassName`
- `contentClassName`
- `bodyClassName`
- `footerClassName`
- `slotProps`

예시:

```tsx
<Modal
  open={open}
  contentClassName="project-modal-content"
  bodyClassName="project-modal-body"
  slotProps={{
    content: {
      style: { ["--nds-modal-radius" as string]: "12px" },
    },
  }}
/>
```

### 단일 루트 컴포넌트

버튼, 뱃지처럼 단일 루트 기반 컴포넌트도 내부 label/icon 슬롯을 열어두면 프로젝트 확장성이 좋아집니다.

예시:

```tsx
<Button
  className="project-button"
  labelClassName="project-button__label"
  slotProps={{
    leftIcon: { className: "project-button__icon" },
  }}
/>
```

## 현재 적용 기준

이 구조는 현재 아래 컴포넌트에 반영되어 있습니다.

### Modal

- 루트/오버레이/컨텐츠/헤더/바디/푸터 슬롯 제공
- `className`, 슬롯별 className, `slotProps`, `data-slot` 제공
- flat API와 compound API 모두 확장 가능

### Button

- 루트/label/left-icon/right-icon 슬롯 제공
- 기본 스타일은 CSS 변수와 class 기반
- `leftIcon`, `rightIcon`, `labelClassName`, `slotProps` 지원

### Badge

- 루트/label 슬롯 제공
- variant/size 기반 기본 스타일 제공
- `labelClassName`, `slotProps`로 세부 확장 가능

## 스타일 확장 방식 추천

### 1. Tailwind 기반 프로젝트

Tailwind를 쓰는 프로젝트는 className 기반 진입점이 가장 편합니다.

예:

```tsx
<Modal contentClassName="rounded-xl max-w-[300px]" bodyClassName="px-4 pt-6 pb-5 text-left" />
```

### 2. styled-components 기반 프로젝트

styled-components를 쓰는 프로젝트는 안정적인 className과 `data-slot`이 중요합니다.

예:

```tsx
const StyledModal = styled(Modal)`
  [data-slot="content"] {
    min-width: 300px;
    border-radius: 12px;
  }

  [data-slot="body"] {
    padding: 24px 16px 20px;
    text-align: left;
  }
`;
```

### 3. 화면 단위 예외 케이스

정말 예외적인 레이아웃 수정은 props style로 처리합니다.

예:

```tsx
<Modal
  slotProps={{
    content: {
      style: { ["--nds-modal-radius" as string]: "16px" },
    },
  }}
/>
```

## 피해야 할 것

아래 패턴은 가급적 피합니다.

- 모든 스타일을 inline style로만 관리하는 구조
- 내부 DOM 구조를 외부가 추측해야 하는 구조
- className은 루트만 열고 내부 슬롯은 닫아두는 구조
- 프로젝트마다 별도 컴포넌트를 다시 만드는 방식

## 실무 권장 규칙

1. 기본 스타일은 class + CSS 변수로 둡니다.
2. 프로젝트 확장은 className 또는 `slotProps.className`으로 먼저 시도합니다.
3. 마지막 예외만 `style`로 처리합니다.
4. 슬롯 이름과 `data-slot`은 가능한 한 안정적으로 유지합니다.
5. Storybook에는 "기본", "slotProps", "className", "compound" 예제를 같이 둡니다.

## 결론

디자인시스템 컴포넌트는 단순히 "공통 스타일 묶음"이 아니라,
프로젝트와 화면이 안전하게 확장할 수 있는 기반이어야 합니다.

그래서 NudgeEAP 디자인시스템은 아래 원칙으로 스타일 구조를 가져갑니다.

```text
기본 스타일 < 프로젝트 스타일 < 외부 커스텀 props/style
```

이 원칙이 유지되어야:

- 디자인시스템이 실제 서비스에 들어갈 수 있고
- 프로젝트별 차이를 흡수할 수 있고
- 나중에 리팩터링이나 교체 작업도 훨씬 쉬워집니다
