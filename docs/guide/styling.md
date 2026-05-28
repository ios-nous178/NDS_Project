---
sidebar_position: 2
title: 스타일링 가이드
---

# 스타일링 가이드

NDS 컴포넌트를 프로젝트에 맞게 커스터마이징하는 방법입니다.

---

## 스타일 우선순위

```
NDS 기본 스타일 < CSS 변수 오버라이드 < className < slotProps < inline style
```

뒤에 있을수록 우선순위가 높습니다.

---

## 1. CSS 변수 오버라이드

모든 NDS 컴포넌트의 시각적 속성은 CSS 변수로 노출됩니다. 네이밍 규칙은 `--nds-{component}-{property}`입니다.

### 전역 오버라이드

프로젝트 전체에서 NDS 컴포넌트의 기본 스타일을 변경합니다.

```css
:root {
  --nds-button-radius: 12px;
  --nds-input-radius: 12px;
  --nds-modal-radius: 16px;
}
```

### 스코프 오버라이드

특정 영역에서만 스타일을 변경합니다.

```css
.card-actions {
  --nds-button-radius: 24px;
  --nds-button-font-weight: 500;
}
```

### 인라인 오버라이드

개별 인스턴스에서 변경합니다.

```tsx
<Button
  style={
    {
      "--nds-button-radius": "24px",
      "--nds-button-gap": "12px",
    } as React.CSSProperties
  }
>
  Pill 버튼
</Button>
```

---

## 2. className

루트 요소에 클래스를 추가합니다. Tailwind CSS, CSS Modules 등 어떤 방식이든 사용 가능합니다.

```tsx
// Tailwind
<Button className="shadow-lg hover:shadow-xl transition-shadow">그림자 버튼</Button>;

// CSS Modules
import styles from "./MyPage.module.css";
<Badge className={styles.customBadge}>태그</Badge>;
```

---

## 3. slotProps

내부 슬롯 요소에 직접 props를 전달합니다. 각 슬롯은 `className`, `style` 등 HTML 속성을 받습니다.

```tsx
<Button
  slotProps={{
    label: {
      className: "tracking-widest uppercase",
      style: { fontFamily: "monospace" },
    },
    leftIcon: {
      className: "text-yellow-500",
    },
  }}
  leftIcon={<StarIcon />}
>
  PREMIUM
</Button>
```

### 컴포넌트별 슬롯

| 컴포넌트 | 사용 가능한 슬롯                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| Button   | `label`, `leftIcon`, `rightIcon`                                                                             |
| Badge    | `label`                                                                                                      |
| Input    | `root`, `wrapper`, `label`, `field`, `clearButton`, `helper`                                                 |
| Modal    | `root`, `overlay`, `content`, `header`, `body`, `footer`                                                     |
| Popup    | `root`, `overlay`, `content`, `textInfo`, `title`, `description`, `actions`, `cancelButton`, `confirmButton` |

---

## 4. data-slot 타겟팅

모든 내부 요소는 `data-slot` 속성을 가집니다. styled-components나 CSS에서 이를 활용할 수 있습니다.

### CSS에서 사용

```css
/* 모든 NDS 버튼의 라벨에 letter-spacing 추가 */
.nds-button [data-slot="label"] {
  letter-spacing: 0.02em;
}

/* 에러 상태의 Input wrapper */
[data-slot="wrapper"][data-error="true"] {
  box-shadow: 0 0 0 2px rgba(241, 63, 0, 0.2);
}
```

### styled-components에서 사용

```tsx
import styled from "styled-components";
import { Button } from "@nudge-design/react";

const GlowButton = styled(Button)`
  box-shadow: 0 0 20px rgba(43, 150, 237, 0.3);

  [data-slot="label"] {
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  [data-slot="left-icon"] {
    animation: pulse 2s infinite;
  }
`;
```

---

## 5. data 속성으로 조건부 스타일링

컴포넌트의 상태는 `data-*` 속성으로 노출됩니다.

```css
/* variant별 스타일 */
.nds-button[data-variant="solid"] {
  /* ... */
}
.nds-button[data-variant="outlined"] {
  /* ... */
}

/* size별 스타일 */
.nds-button[data-size="xl"] {
  /* ... */
}

/* 상태별 스타일 */
[data-slot="wrapper"][data-focused="true"] {
  /* ... */
}
[data-slot="wrapper"][data-disabled="true"] {
  /* ... */
}
[data-slot="header"][data-has-title="true"] {
  /* ... */
}
[data-slot="footer"][data-has-both-actions="true"] {
  /* ... */
}
```

---

## Tailwind 프로젝트 설정

### 프리셋 설치

```bash
pnpm add @nudge-design/tailwind-preset
```

### 설정

```ts
// tailwind.config.ts
import { nudgeEapPreset } from "@nudge-design/tailwind-preset";

export default {
  presets: [nudgeEapPreset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

프리셋이 제공하는 Tailwind 유틸리티:

```html
<!-- 색상 -->
<div class="text-primary bg-blue-100 border-neutral-300">
  <!-- 타이포 -->
  <h1 class="text-headline3 font-bold">
    <p class="text-body1 font-medium">
      <!-- 간격 -->
    </p>

    <div class="p-4 gap-2 rounded-md">
      <!-- 사이징 -->
      <div class="h-btn-lg h-appbar h-input"></div>
    </div>
  </h1>
</div>
```

---

## 네이밍 규칙 요약

| 규칙       | 예시                                              |
| ---------- | ------------------------------------------------- |
| CSS 변수   | `--nds-button-radius`, `--nds-input-border-color` |
| CSS 클래스 | `nds-button`, `nds-modal__content`                |
| data-slot  | `data-slot="root"`, `data-slot="label"`           |
| data 속성  | `data-variant="solid"`, `data-size="lg"`          |
