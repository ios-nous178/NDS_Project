---
sidebar_position: 3
title: 간격 및 사이징
---

# 간격 및 사이징 토큰

Nudge Design System의 간격(Spacing), 둥글기(Radius), 사이징(Sizing) 체계입니다. Figma 컴포넌트 레드라인 실측 기반으로 정의되었습니다.

```tsx
import { spacing, radius, sizing, borderWidth } from "@nudge-design/tokens";
```

---

## Spacing

컴포넌트 내부 패딩, 요소 간 간격(gap), 마진에 사용합니다.

| 토큰          | 값   | 주요 사용처                  |
| ------------- | ---- | ---------------------------- |
| `spacing[0]`  | 0px  | —                            |
| `spacing[1]`  | 1px  | 테두리                       |
| `spacing[2]`  | 2px  | Badge SM 패딩Y               |
| `spacing[4]`  | 4px  | Badge MD 패딩Y, 아이콘 gap   |
| `spacing[6]`  | 6px  | Badge SM 패딩X               |
| `spacing[7]`  | 7px  | —                            |
| `spacing[8]`  | 8px  | 버튼 gap, Badge MD 패딩X     |
| `spacing[10]` | 10px | 버튼 MD 패딩Y                |
| `spacing[11]` | 11px | 버튼 SM/XS 패딩Y             |
| `spacing[12]` | 12px | 버튼 LG 패딩Y, 라벨-필드 gap |
| `spacing[13]` | 13px | 버튼 Field 패딩Y             |
| `spacing[16]` | 16px | 버튼 패딩X, Modal Header     |
| `spacing[20]` | 20px | Modal Body 패딩, Root 패딩   |
| `spacing[24]` | 24px | Popup 내부 gap               |
| `spacing[28]` | 28px | Popup 상단 패딩              |
| `spacing[30]` | 30px | Popup Root 패딩              |
| `spacing[33]` | 33px | —                            |
| `spacing[36]` | 36px | —                            |
| `spacing[48]` | 48px | 큰 섹션 간격                 |
| `spacing[64]` | 64px | 페이지 섹션 간격             |
| `spacing[80]` | 80px | 최대 섹션 간격               |

---

## Border Radius

모서리 둥글기입니다.

| 토큰          | 값     | 용도                              |
| ------------- | ------ | --------------------------------- |
| `radius.sm`   | 4px    | Badge SM                          |
| `radius.md`   | 8px    | **기본값** — Button, Input, Popup |
| `radius.lg`   | 12px   | Modal                             |
| `radius.pill` | 9999px | Toggle track, 태그                |

---

## Border Width

| 토큰                  | 값  | 용도        |
| --------------------- | --- | ----------- |
| `borderWidth.none`    | 0px | 테두리 없음 |
| `borderWidth.default` | 1px | 기본 테두리 |

---

## Sizing

컴포넌트의 고정 높이 값입니다.

### 버튼

| 토큰                  | 값   | Button Size          |
| --------------------- | ---- | -------------------- |
| `sizing.button.lg`    | 48px | `size="lg"` (기본값) |
| `sizing.button.md`    | 44px | `size="md"`          |
| `sizing.button.sm`    | 42px | `size="sm"`          |
| `sizing.button.xs`    | 38px | `size="xs"`          |
| `sizing.button.field` | 48px | `size="field"`       |

### 레이아웃

| 토큰                      | 값   | 용도               |
| ------------------------- | ---- | ------------------ |
| `sizing.appBar.height`    | 52px | 상단 네비게이션 바 |
| `sizing.bottomBar.height` | 56px | 하단 탭 바         |
| `sizing.input.height`     | 48px | Input 필드 높이    |
| `sizing.icon.default`     | 24px | 기본 아이콘 크기   |

---

## 사용법

### 직접 참조

```tsx
import { spacing, radius, sizing } from "@nudge-design/tokens";

const cardStyle = {
  padding: spacing[16],
  borderRadius: radius.md,
  gap: spacing[8],
};
```

### Tailwind 프리셋 사용

```html
<div class="p-4 rounded-md gap-2">
  <!-- spacing[16] = p-4, radius.md = rounded-md, spacing[8] = gap-2 -->
</div>

<div class="h-btn-lg">
  <!-- sizing.button.lg = 48px -->
</div>
```

---

## 컴포넌트별 간격 매핑

### Button

| Size  | 높이 | 패딩X | 패딩Y |
| ----- | ---- | ----- | ----- |
| xl    | 56px | 16px  | 16px  |
| lg    | 48px | 16px  | 12px  |
| md    | 44px | 16px  | 10px  |
| sm    | 42px | 12px  | 11px  |
| xs    | 38px | 12px  | 11px  |
| field | 48px | 16px  | 13px  |

### Modal

| 영역            | 패딩        |
| --------------- | ----------- |
| Root            | 20px (전체) |
| Header          | 16px 20px   |
| Body            | 20px        |
| Footer (custom) | 12px 20px   |

### Popup

| 영역         | 값             |
| ------------ | -------------- |
| Root         | 30px (전체)    |
| Content      | 28px 16px 16px |
| TextInfo gap | 8px            |
| Content gap  | 24px           |
| Actions gap  | 8px            |
| 버튼 높이    | 44px           |
