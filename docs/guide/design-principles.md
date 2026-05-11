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
    wrapper: { style: { borderColor: "red" } },
    field: { className: "text-lg" },
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
<Button className="shadow-lg hover:shadow-xl">확인</Button>;

// styled-components 프로젝트
const StyledButton = styled(Button)`
  [data-slot="label"] {
    letter-spacing: 0.05em;
  }
`;
```

---

## 6. Figma-Code 동기화

디자인과 코드 사이의 간극을 최소화합니다.

| 단계         | 설명                               |
| ------------ | ---------------------------------- |
| Figma 디자인 | 디자이너가 피그마에서 설계         |
| → 토큰 추출  | 실측값을 tokens 패키지에 반영      |
| → 스펙 작성  | 컴포넌트 스펙 + Figma Node ID 기록 |
| → 구현       | React 컴포넌트 개발                |
| → Storybook  | 시각적 QA                          |
| → 문서화     | Docusaurus에 사용법 기록           |

각 단계에서 사람의 승인(human approval)을 거쳐 품질을 보장합니다.

---

## 7. 강조는 예산처럼 사용한다

목업이나 새 화면을 만들 때 모든 새 영역을 강조하면 사용자가 무엇을 먼저 해야 하는지 알기 어렵습니다. 강조 장치는 화면의 우선순위를 드러내기 위한 제한된 자원으로 봅니다.

### CTA 위계

- primary solid 버튼은 한 화면의 대표 액션 1개에만 사용합니다.
- 우측 화살표 아이콘은 대표 전진 CTA 1개에만 사용합니다.
- 반복 카드/리스트의 "자세히 보기" CTA에는 화살표를 반복하지 않습니다.
- 동일 위계 CTA가 여러 개라면 아이콘보다 variant와 배치로 구분합니다.

### Chip / Badge

- Chip과 Badge는 상태, 분류, 짧은 속성 표시용입니다.
- 일반 안내문 강조, 섹션 제목 장식, 모든 카드에 반복되는 라벨에는 사용하지 않습니다.
- Chip 라벨은 8자 안팎을 권장합니다.

### 안내문 / 콜아웃

- 안내문은 기본적으로 neutral surface와 본문 텍스트로 처리합니다.
- 색 배경, 아이콘, Chip/Badge, 굵은 제목은 한 영역에서 1~2개만 조합합니다.
- 그라데이션은 사용하지 않습니다.

### 아이콘 컬러

- 아이콘 컴포넌트는 기본적으로 `currentColor`를 상속합니다.
- 단독 아이콘은 부모 color가 명시되지 않으면 본문색/검정으로 보여 주변 UI와 어긋날 수 있습니다.
- 안내/상태/빈 상태/카드 장식처럼 단독 배치한 아이콘은 `color` prop 또는 부모 `style.color`에 토큰 컬러를 명시합니다.
- Button, IconButton, Chip 등 DS 컴포넌트 슬롯 안의 아이콘은 컴포넌트가 정한 텍스트 컬러를 상속하게 둡니다.

### 정보 밀도

- 옵션 15개 초과 드롭다운은 검색 가능한 UI를 검토합니다.
- 옵션 50개 초과는 서버 검색 또는 가상화를 검토합니다.
- 정보가 많은 카드/리스트는 상태, 날짜, 금액, 진행률, CTA 위치를 고정해 스캔 경로를 만듭니다.
