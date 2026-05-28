---
sidebar_position: 2
title: 타이포그래피
---

# 타이포그래피 토큰

Nudge Design System의 타이포그래피 체계입니다. Figma Design Guide 실측 기반으로 정의되었습니다.

```tsx
import { typography } from "@nudge-design/tokens";
```

---

## 폰트 패밀리

| 토큰                | 값                                                                       | 용도             |
| ------------------- | ------------------------------------------------------------------------ | ---------------- |
| `fontFamily.web`    | `'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif` | 웹 기본          |
| `fontFamily.system` | `system-ui, -apple-system, BlinkMacSystemFont, sans-serif`               | 시스템 폰트 폴백 |

### Pretendard 설정

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
/>
```

---

## 폰트 굵기

| 토큰                 | 값    | 용도            |
| -------------------- | ----- | --------------- |
| `fontWeight.regular` | `400` | 본문 텍스트     |
| `fontWeight.medium`  | `500` | 보조 강조, 라벨 |
| `fontWeight.bold`    | `700` | 제목, CTA 버튼  |

---

## 타입 스케일

12단계 타입 스케일을 제공합니다.

| 토큰                  | 크기 | 줄높이 | 굵기    | 용도              |
| --------------------- | ---- | ------ | ------- | ----------------- |
| `typeScale.display`   | 40px | 52px   | Bold    | 히어로 타이틀     |
| `typeScale.headline1` | 36px | 48px   | Bold    | 페이지 타이틀     |
| `typeScale.headline2` | 28px | 38px   | Bold    | 섹션 타이틀       |
| `typeScale.headline3` | 24px | 32px   | Bold    | 카드 타이틀       |
| `typeScale.headline4` | 20px | 28px   | Bold    | 서브 타이틀       |
| `typeScale.headline5` | 18px | 26px   | Bold    | 소제목            |
| `typeScale.body1`     | 16px | 24px   | Medium  | 주요 본문         |
| `typeScale.body2`     | 15px | 22px   | Medium  | 기본 본문         |
| `typeScale.body3`     | 14px | 20px   | Regular | 보조 본문         |
| `typeScale.caption1`  | 13px | 18px   | Regular | 캡션, 도움 텍스트 |
| `typeScale.caption2`  | 12px | 18px   | Regular | 작은 캡션         |
| `typeScale.label`     | 11px | 18px   | Regular | 레이블, 배지      |

---

## 사용법

### 직접 참조

```tsx
import { typography } from "@nudge-design/tokens";

const titleStyle = {
  fontSize: typography.typeScale.headline3.fontSize, // 24
  lineHeight: `${typography.typeScale.headline3.lineHeight}px`, // 32px
  fontWeight: typography.typeScale.headline3.fontWeight, // 700
};
```

### 구조분해

```tsx
const { fontSize, lineHeight, fontWeight } = typography.typeScale.body1;
```

### Tailwind 프리셋 사용

`@nudge-design/tailwind-preset`을 설정하면 Tailwind 유틸리티로 사용할 수 있습니다.

```html
<h1 class="text-display font-bold">타이틀</h1>
<p class="text-body1 font-medium">본문</p>
<span class="text-caption1">캡션</span>
```

---

## 컴포넌트별 타이포 매핑

| 컴포넌트  | 요소        | 타입 스케일                 |
| --------- | ----------- | --------------------------- |
| Button XL | label       | 18px / Bold                 |
| Button LG | label       | 16px / Bold (body1)         |
| Button MD | label       | 15px / Bold (body2)         |
| Button SM | label       | 14px / Bold (body3)         |
| Button XS | label       | 13px / Bold (caption1)      |
| Input     | field       | 15px / Regular (body2)      |
| Input     | label       | 14px / Medium (body3)       |
| Input     | helper      | 13px / Regular (caption1)   |
| Modal     | title       | 18px / Bold (headline5)     |
| Modal     | body        | 15px / Regular (body2)      |
| Popup     | title       | 16px / Bold (body1)         |
| Popup     | description | 14px / Regular (body3)      |
| Badge MD  | label       | 13px / Semi-Bold (caption1) |
| Badge SM  | label       | 11px / Semi-Bold (label)    |
