---
version: alpha
name: Runmile
description: "러닝 대회 정보 + 커뮤니티 + 마이러닝 기록을 묶은 모바일 퍼스트 플랫폼. 오렌지(#FF5B37) 시그니처 + Toss 스타일 cool gray + Pretendard."
note: |
  컬러/타이포 SSOT 는 Figma 런마일 library
  (file udH9ME1HnHk4kbxR17Neig). 본 DESIGN.md 의 colors 블록은 Figma 차트의 평탄
  미러이며, 토큰 코드는 packages/tokens/src/projects/runmile.palette.ts /
  runmile.semantic.ts 에 정의된다.
colors:
  # Primary (Orange)
  primary: "#FF5B37"
  primary-light: "#FECDC1"
  primary-surface: "#FFF7F5"
  # Orange scale
  orange-100: "#FFF7F5"
  orange-200: "#FFF0ED"
  orange-300: "#FECDC1"
  orange-400: "#FF805C"
  orange-500: "#FF5B37"
  # Secondary
  secondary: "#007AFF"
  error: "#FF2428"
  error-surface: "#FFE9E9"
  # Grayscale (Toss-style cool gray)
  gray-100: "#F9FAFB"
  gray-200: "#F2F4F6"
  gray-300: "#E5E8EB"
  gray-400: "#D1D6DB"
  gray-500: "#B0B8C1"
  gray-600: "#919CAA"
  gray-700: "#6B7684"
  gray-800: "#4E5968"
  gray-900: "#333D4B"
  # Black & White
  black: "#221E1F"
  white: "#FFFFFF"
  # Aliases
  surface: "#FFFFFF"
  on-surface: "#221E1F"
  caution: null
  success: null
fontFamilies:
  - Pretendard Variable
  - Pretendard
---

# Runmile Design System

런마일은 러닝 대회 정보·신청·커뮤니티·마이러닝 기록을 묶은 모바일 퍼스트
플랫폼입니다. 오렌지(#FF5B37) 시그니처 + Toss 스타일 cool gray + Pretendard
폰트가 시각 정체성의 핵심입니다.

## SSOT

- Figma 런마일 library (file `udH9ME1HnHk4kbxR17Neig`)
  - Colors: node 60:1245
  - Typography: node 63:447
  - BottomNav: node 83:887
- 토큰 코드: `packages/tokens/src/projects/runmile.{palette,semantic}.ts`
- CSS emit: `packages/tokens/dist/runmile.css` (`@nudge-design/tokens/css/runmile`)

## Colors

### Primary (Orange)

| Token        | Hex       | 용도                                 |
| ------------ | --------- | ------------------------------------ |
| `orange/100` | `#FFF7F5` | project subtle bg, info bg             |
| `orange/200` | `#FFF0ED` | hover bg                             |
| `orange/300` | `#FECDC1` | disabled project                       |
| `orange/400` | `#FF805C` | 보조 강조                            |
| `orange/500` | `#FF5B37` | **project primary** — CTA, focus, link |

### Secondary

| Token      | Hex       | 용도      |
| ---------- | --------- | --------- |
| `blue/500` | `#007AFF` | info text |
| `red/500`  | `#FF2428` | error     |
| `red/200`  | `#FFE9E9` | error bg  |

### Grayscale (Toss-style cool gray)

| Token      | Hex       | 매핑                         |
| ---------- | --------- | ---------------------------- |
| `gray/100` | `#F9FAFB` | surface subtle               |
| `gray/200` | `#F2F4F6` | section bg, border subtle    |
| `gray/300` | `#E5E8EB` | border normal, divider       |
| `gray/400` | `#D1D6DB` | text disabled, input hover   |
| `gray/500` | `#B0B8C1` | text muted, placeholder      |
| `gray/600` | `#919CAA` | 보조                         |
| `gray/700` | `#6B7684` | text muted (secondary label) |
| `gray/800` | `#4E5968` | text subtle, icon normal     |
| `gray/900` | `#333D4B` | text normal                  |

### Black & White

- `black` `#221E1F` — text strong, BottomNav active icon (검정 톤은 순흑이 아닌 살짝 따뜻한 다크)
- `white` `#FFFFFF` — page bg, surface

## Typography

Pretendard Variable / Pretendard 기반.

| Style      | size / line-height | 매핑(`typeScale`)       |
| ---------- | ------------------ | ----------------------- |
| Heading    | 24 / 30            | `headline1`             |
| Title 1    | 20 / 24            | `headline2`             |
| Title 2    | 18 / 24            | `headline3`             |
| Subtitle 1 | 16 / 24            | `headline4`             |
| Subtitle 2 | 15 / 22            | `headline5`             |
| Subtitle 3 | 14 / 20            | `body1`                 |
| Body 1     | 13 / 18            | `body2` / `body3`       |
| Body 2     | 12 / 16            | `caption1` / `caption2` |
| Label      | 11 / 14            | `label`                 |

## Components

### BottomNav (Figma 83:887)

4탭 (홈 / 대회정보 / 커뮤니티 / 마이페이지).

- active: `--semantic-icon-strong-default` (#221E1F) — black filled icon
- inactive: `--semantic-text-muted-default` (gray500 #B0B8C1) — outline icon
- label: Pretendard 11/14 (active = SemiBold 600)
- 사용: `<RunmileBottomNav tabs={...} activeTab="tab-0" />`
