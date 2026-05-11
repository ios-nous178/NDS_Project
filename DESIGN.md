---
version: alpha
name: NudgeEAP
description: "EAP(Employee Assistance Program) 멘탈케어 플랫폼 디자인 시스템. 신뢰감 있는 블루 톤 기반, 접근성과 명확성을 우선하는 모바일 퍼스트 UI."

# ── Primitive Color Scales ──────────────────────────────────
primitives:
  neutral:
    1000: "#000000"
    900: "#111111"
    800: "#383838"
    700: "#666666"
    600: "#777777"
    500: "#999999"
    400: "#C7C7C7"
    300: "#D8D8D8"
    200: "#ECECEC"
    100: "#F5F5F5"
    50: "#FAFAFA"
    00: "#FFFFFF"
  coolGray:
    600: "#4E5462"
    500: "#6C7280"
    400: "#9CA2AE"
    300: "#D2D5D9"
    200: "#E6E7EB"
    100: "#F3F4F6"
    50: "#F8F9FB"
  blue:
    900: "#0046A0"
    800: "#0063BF"
    700: "#0074D0"
    600: "#0086E3"
    500: "#0094F0"
    400: "#1AA3F2"
    300: "#53B2F3"
    200: "#87C9F6"
    100: "#B6DDF9"
    50: "#E1F2FC"
    25: "#EAF6FD"
    10: "#F8FCFE"
  magenta:
    800: "#C30058"
    600: "#D9005C"
    500: "#ED2E77"
    300: "#F15890"
    200: "#F8B8CF"
    100: "#FCE3EC"
    50: "#FDF1F5"
  yellow:
    500: "#FFC303"
    400: "#FFCD27"
    300: "#FFD84F"
    200: "#FFE282"
    100: "#FFEDB3"
    50: "#FFFAE8"
  red:
    800: "#CB2700"
    700: "#E33800"
    500: "#F13F00"
    400: "#FF4E0C"
    200: "#FF875D"
    100: "#FFA98C"
    50: "#FEE9E6"
  green:
    500: "#008260"
    400: "#00A07C"
    300: "#13BFA2"
    200: "#6FD2BD"
    100: "#AAE3D7"
    50: "#E5F7F4"

# ── Semantic Colors ─────────────────────────────────────────
colors:
  primary:
    main: "#2B96ED" # 팔레트 blue 스케일 변경으로 디커플링
    hover: "#017EE4"
    pressed: "#1B65BA"
    lighter: "#91CAF6"
    bg: "#E3F2FC"
    bgLighter: "#F1F8FD"
    fg: "{neutral.00}" # primary 배경 위 텍스트 (NudgeEAP=흰색)
  secondary:
    sub: "{magenta.500}" # #ED2E77
    lighter: "{magenta.200}" # #F8B8CF
    bg: "{magenta.100}" # #FCE3EC
    bgLighter: "{magenta.50}" # #FDF1F5
  error:
    main: "{red.500}" # #F13F00
    bg: "{red.50}" # #FEE9E6
  caution:
    main: "{yellow.500}" # #FFC303
    text: "#FFA100" # yellow.600 제거됨, 값 직접 지정
    bg: "{yellow.50}" # #FFFAE8
  success:
    main: "{green.300}" # #13BFA2
    bg: "{green.50}" # #E5F7F4
  text:
    strong: "{neutral.1000}" # #000000
    normal: "{neutral.900}" # #111111
    default: "{neutral.800}" # #383838
    subtle: "{neutral.700}" # #666666
    disabled: "{neutral.500}" # #999999
    placeholder: "{neutral.500}" # #999999
    inverse: "{neutral.00}" # #FFFFFF
  bg:
    white: "{neutral.00}" # #FFFFFF
    light: "{neutral.50}" # #FAFAFA
    coolGray: "{coolGray.100}" # #F3F4F6
    coolGrayLighter: "{coolGray.50}" # #F8F9FB
    disabled: "{neutral.200}" # #ECECEC
    overlay: "rgba(0,0,0,0.5)"
  border:
    default: "{neutral.300}" # #D8D8D8
    light: "{neutral.200}" # #ECECEC
    focus: "#2B96ED" # 팔레트 디커플링
    disabled: "{neutral.200}" # #ECECEC
  icon:
    default: "{neutral.800}" # #383838
    subtle: "{neutral.500}" # #999999
    inverse: "{neutral.00}" # #FFFFFF

# ── Typography ──────────────────────────────────────────────
typography:
  fontFamily:
    web: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    system: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  fontWeight:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
  typeScale:
    display-1:
      fontSize: 52px
      lineHeight: 74px
      letterSpacing: 0
      fontWeight: 700
    display-2:
      fontSize: 48px
      lineHeight: 62px
      letterSpacing: 0
      fontWeight: 700
    display-3:
      fontSize: 40px
      lineHeight: 52px
      letterSpacing: 0
      fontWeight: 700
    headline-1:
      fontSize: 36px
      lineHeight: 48px
      letterSpacing: 0
      fontWeight: 700
    headline-2:
      fontSize: 28px
      lineHeight: 38px
      letterSpacing: 0
      fontWeight: 700
    headline-3:
      fontSize: 24px
      lineHeight: 32px
      letterSpacing: 0
      fontWeight: 700
    headline-4:
      fontSize: 20px
      lineHeight: 28px
      letterSpacing: 0
      fontWeight: 700
    headline-5:
      fontSize: 18px
      lineHeight: 26px
      letterSpacing: 0
      fontWeight: 700
    body-1:
      fontSize: 16px
      lineHeight: 24px
      letterSpacing: 0
      fontWeight: 500
    body-2:
      fontSize: 15px
      lineHeight: 22px
      letterSpacing: 0
      fontWeight: 500
    body-3:
      fontSize: 14px
      lineHeight: 20px
      letterSpacing: 0
      fontWeight: 400
    caption-1:
      fontSize: 13px
      lineHeight: 18px
      letterSpacing: 0
      fontWeight: 400
    caption-2:
      fontSize: 12px
      lineHeight: 16px
      letterSpacing: 0
      fontWeight: 400
    label:
      fontSize: 11px
      lineHeight: 14px
      letterSpacing: 0
      fontWeight: 400

# ── Spacing (Primitive Scale, 4pt grid) ────────────────────
# Figma · ┗ Grid / Border / Radius · SpacingGuide
# 31 Variables · 4pt Grid Base · Primitive / Gap / Padding / Grid
spacing:
  0: 0px # 간격 없음 (밀착)
  1: 1px # legacy
  2: 2px # 아이콘-텍스트 최소 간격
  4: 4px # 인라인 요소 간격
  6: 6px # 뱃지·칩 내부 여백
  7: 7px # legacy
  8: 8px # 카드 내부 수직 간격
  10: 10px # 리스트 아이템 내부 패딩
  11: 11px # legacy
  12: 12px # 섹션 내부 간격
  13: 13px # legacy
  14: 14px # 중첩 요소 여백
  16: 16px # 기본 레이아웃 여백
  18: 18px # 중대형 컴포넌트 패딩
  20: 20px # 섹션 간격 (중)
  24: 24px # PC 그리드 거터
  28: 28px # 큰 컴포넌트 내부 여백
  30: 30px # legacy
  32: 32px # 페이지 섹션 분리
  33: 33px # legacy
  36: 36px # 대형 섹션 상하 여백
  40: 40px # PC 최소 페이지 마진
  48: 48px # legacy / 추가 여백
  64: 64px # legacy / 큰 여백
  80: 80px # legacy / 페이지 단위 여백

# ── Gap (Semantic — 컴포넌트 간 간격) ──────────────────────
gap:
  xs: 4px # 최소 아이템 간격
  sm: 8px # 기본 아이템 간격
  md: 12px # 중형 컴포넌트 간격
  base: 16px # 표준 레이아웃 간격
  lg: 20px # 섹션 내부 간격
  xl: 24px # 대형 컴포넌트 간격

# ── Padding (Semantic — 컨테이너 내부 여백) ────────────────
padding:
  xs: 6px # 소형 뱃지·뱃지 내부 여백
  sm: 10px # 버튼·칩 내부 여백
  md: 16px # 카드·패널 기본 여백
  lg: 20px # 섹션·모달 내부 여백
  xl: 24px # 대형 컨테이너 여백

# ── Rounded / Radius (Primitive Scale) ─────────────────────
# Figma · RadiusGuide · 17 Variables · Primitive / Semantic Shape
rounded:
  none: 0px # 모서리 없음 (직각)
  radius2: 2px # 최소 곡률 (인풋·태그)
  sm: 4px # 소형 버튼·칩 모서리
  xs: 6px # 중소형 컴포넌트 모서리 (legacy 이름 유지)
  md: 8px # 기본 카드·컨테이너 (가장 많이 사용)
  lg: 12px # 중형 카드·패널
  radius16: 16px # 대형 카드·모달
  radius24: 24px # 바텀시트·오버레이
  full: 9999px # 완전 원형 (아바타·뱃지·FAB)
  pill: 9999px # 별칭: 칩·토글 (full 과 동일)

# ── Shape (Semantic — 컴포넌트 형태 별칭) ──────────────────
shape:
  none: 0px # 경계 없는 플랫 컴포넌트
  xs: 2px # 소형 인라인 요소
  sm: 4px # 버튼·칩
  md: 8px # 기본 카드 (표준값)
  lg: 12px # 중형 패널·리스트
  xl: 16px # 대형 모달·카드
  2xl: 24px # 바텀시트·오버레이
  full: 9999px # 아바타·뱃지·토글

# ── Border Width (Primitive Scale) ─────────────────────────
# Figma · BorderGuide · 6 Variables · Primitive / Semantic Stroke
borderWidth:
  none: 0px # 보더 없음
  default: 1px # 기본 보더 (라인·구분선·카드 테두리)
  focus: 2px # 강조 보더 (포커스 링용 원시값)

# ── Stroke (Semantic — 외곽선 의미체계) ────────────────────
stroke:
  none: 0px # 외곽선 없는 컴포넌트 (flat)
  default: 1px # 카드·인풋·리스트 구분선 (표준)
  focus: 2px # 접근성 포커스 링 (키보드 탐색)

# ── Grid ───────────────────────────────────────────────────
# Mobile: 360px(Android) 기준 4컬럼, 좌우 마진 16px, 컬럼 거터 8px.
#         콘텐츠 영역 328px (360-32). iOS(375px)는 마진 16px 유지, 콘텐츠 자연 확장.
# PC:     1920px 기준 12컬럼, 최대 콘텐츠 너비 1200px (좌우 360px 분배).
#         1200px 이하 뷰포트에서는 유동 적용, 좌우 마진 최소 40px 유지.
#         컬럼 거터 24px, 컬럼 묶음 사용 가능 (3+9, 6+6, 4+4+4, 3+6+3 등).
grid:
  mobile:
    columns: 4
    margin: 16px
    gutter: 8px
    contentWidth: 328px # 360 - 16*2
  desktop:
    columns: 12
    margin: 360px # 1920 기준 자동 분배 (1200px 이하에서는 최소 40px)
    minMargin: 40px # 뷰포트가 좁아질 때 좌우 마진 최소값
    gutter: 24px
    contentWidth: 1200px # 최대 max-width (1920 - 360*2)

# ── Sizing ──────────────────────────────────────────────────
sizing:
  icon:
    xs: 16px
    sm: 20px
    default: 24px
  button:
    xl: 56px
    lg: 48px
    md: 44px
    sm: 42px
    xs: 38px
    field: 48px
  tabs:
    line: 50px
    pill: 35px
    square: 36px
  appBar:
    height: 52px
  bottomBar:
    height: 56px
  input:
    default: 48px
    field: 44px

# ── Elevation ───────────────────────────────────────────────
elevation:
  shadow:
    sm: "0 1px 3px rgba(0,0,0,0.1)"
    md: "0 4px 12px rgba(0,0,0,0.15)"
    lg: "0 11px 15px -7px rgba(0,0,0,0.2)"
    up: "0 -4px 12px rgba(0,0,0,0.1)"
    none: "none"
  zIndex:
    base: 0
    dropdown: 100
    sticky: 200
    appBar: 300
    modal: 1000
    popup: 1100
    toast: 1200

# ── Motion ──────────────────────────────────────────────────
motion:
  duration:
    fast: 150ms
    default: 200ms
    slow: 300ms
  easing:
    default: ease
    easeOut: ease-out
  transition:
    default: "200ms ease"
    slow: "300ms ease"

# ── Components ──────────────────────────────────────────────
components:
  button-solid:
    backgroundColor: "{colors.primary.main}"
    textColor: "{colors.text.inverse}"
    rounded: "{rounded.md}"
    height: "{sizing.button.lg}"
    padding: 16px
  button-solid-hover:
    backgroundColor: "{colors.primary.hover}"
  button-outlined:
    backgroundColor: transparent
    textColor: "{colors.primary.main}"
    rounded: "{rounded.md}"
    height: "{sizing.button.lg}"
  button-soft:
    backgroundColor: "{colors.primary.bg}"
    textColor: "{colors.primary.main}"
    rounded: "{rounded.md}"
    height: "{sizing.button.lg}"
  input-default:
    backgroundColor: "{colors.bg.white}"
    textColor: "{colors.text.default}"
    rounded: "{rounded.md}"
    height: "{sizing.input.default}"
    padding: 16px
  chip-outlined:
    backgroundColor: transparent
    textColor: "{colors.text.default}"
    rounded: "{rounded.pill}"
    height: 36px
  chip-filled:
    backgroundColor: "{colors.primary.main}"
    textColor: "{colors.text.inverse}"
    rounded: "{rounded.pill}"
    height: 36px
  card-default:
    backgroundColor: "{colors.bg.white}"
    rounded: "{rounded.lg}"
    padding: 16px
  modal:
    backgroundColor: "{colors.bg.white}"
    rounded: "{rounded.lg}"
    padding: 24px
---

# NudgeEAP Design System

## Overview

NudgeEAP는 기업 임직원 대상 멘탈케어 플랫폼으로, **신뢰감**과 **접근성**을 핵심 가치로 삼는 모바일 퍼스트 UI를 지향합니다.

- **브랜드 톤**: 차분하고 전문적이면서도 친근한 블루 기반 팔레트
- **타겟 사용자**: 심리 상담이 처음인 직장인 — 진입 장벽을 낮추는 것이 최우선
- **디자인 언어**: 깔끔한 라인, 충분한 여백, 명확한 위계. 과도한 장식 배제
- **접근성**: WCAG AA 준수, 4.5:1 이상 텍스트 대비비, 최소 44px 터치 타겟

## Colors

블루 기반의 단색 팔레트에 마젠타 포인트를 더한 구성입니다. 상태 색상(에러/경고/성공)은 직관적으로 인식할 수 있는 범용 색상을 사용합니다.

- **Primary (#2B96ED)**: CTA, 활성 상태, 핵심 인터랙티브 요소. 신뢰와 안정의 블루
- **Secondary (#ED2E77)**: 마젠타 포인트. 프로모션, 감정 표현, 보조 강조
- **Error (#F13F00)**: 유효성 오류, 파괴적 액션
- **Caution (#FFC303)**: 주의 알림. 텍스트용은 (#FFA100)으로 명도 조정
- **Success (#13BFA2)**: 완료, 긍정 피드백
- **Surface (#FFFFFF)**: 페이지 배경, 카드 배경
- **On-surface (#383838)**: 본문 텍스트, 아이콘

## Typography

Pretendard 폰트 패밀리를 전 구간에 사용합니다. 한글/영문 모두 최적화된 가변 폰트로, 웹/앱 환경에서 일관된 렌더링을 보장합니다.

- **Display/Headlines**: Pretendard Bold (700), 18~52px — 페이지 타이틀, 섹션 헤더
- **Body**: Pretendard Medium~Regular (400~500), 14~16px — 본문, 설명 텍스트
- **Caption/Label**: Pretendard Regular (400), 11~13px — 보조 정보, 메타데이터

폰트 웨이트는 Regular(400), Medium(500), Semibold(600), Bold(700) 네 단계를 사용합니다. 한 화면에 2~3개 웨이트만 사용하여 시각적 일관성을 유지하세요.

## Layout

모바일 퍼스트로 설계하며, **4pt 그리드 기반** 스페이싱 스케일을 사용합니다.

- **Base unit**: 4px (8px 컴포넌트 권장)
- **Primitive Space**: 0 / 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 36 / 40px
- **AppBar height**: 52px
- **BottomBar height**: 56px

### Spacing Scale (Figma · SpacingGuide)

`spacing` 토큰은 **Primitive 16단계**로 구성되며, 의미 단위(Gap / Padding / Grid)는 그 위의 별도 의미체계 토큰으로 제공합니다.

| 토큰       | 값   | 용도                    |
| ---------- | ---- | ----------------------- |
| `space.0`  | 0px  | 간격 없음 (밀착)        |
| `space.2`  | 2px  | 아이콘-텍스트 최소 간격 |
| `space.4`  | 4px  | 인라인 요소 간격        |
| `space.6`  | 6px  | 뱃지·칩 내부 여백       |
| `space.8`  | 8px  | 카드 내부 수직 간격     |
| `space.10` | 10px | 리스트 아이템 내부 패딩 |
| `space.12` | 12px | 섹션 내부 간격          |
| `space.14` | 14px | 중첩 요소 여백          |
| `space.16` | 16px | 기본 레이아웃 여백      |
| `space.18` | 18px | 중대형 컴포넌트 패딩    |
| `space.20` | 20px | 섹션 간격 (중)          |
| `space.24` | 24px | PC 그리드 거터          |
| `space.28` | 28px | 큰 컴포넌트 내부 여백   |
| `space.32` | 32px | 페이지 섹션 분리        |
| `space.36` | 36px | 대형 섹션 상하 여백     |
| `space.40` | 40px | PC 최소 페이지 마진     |

#### Gap (컴포넌트 간 간격)

`xs(4)` · `sm(8)` · `md(12)` · `base(16)` · `lg(20)` · `xl(24)` — Flex/Grid `gap` 속성에 사용.

#### Padding (컨테이너 내부 여백)

`xs(6)` · `sm(10)` · `md(16)` · `lg(20)` · `xl(24)` — 카드·버튼·모달 내부 패딩에 사용.

### Grid System

| 속성        | Mobile          | Desktop                     |
| ----------- | --------------- | --------------------------- |
| 기준 뷰포트 | 360px (Android) | 1920px                      |
| 컬럼 수     | 4               | 12                          |
| 좌우 마진   | 16px            | 360px (≤1200px 시 min 40px) |
| 거터        | 8px             | 24px                        |
| 콘텐츠 너비 | 328px           | 1200px (max)                |

- **Mobile**: 기준 뷰포트 360px(Android), 4컬럼. 좌우 마진 16px 고정, 콘텐츠 328px(360-32), 컬럼 거터 8px. iOS(375px)에서도 마진 16px 유지하며 콘텐츠 영역이 자연스럽게 확장됩니다.
- **Desktop**: 1920px 기준 12컬럼, 콘텐츠 최대 너비(`max-width`) 1200px으로 양쪽 360px씩 분배. 뷰포트가 1200px 이하로 줄어들면 콘텐츠 영역은 뷰포트 너비에 맞게 유동 적용되며, 이때 좌우 마진은 **40px을 최소값**으로 유지합니다. 컬럼 거터 24px, 컬럼 너비는 콘텐츠 영역과 거터 수에 따라 자동 계산됩니다. 컬럼은 묶어서 사용할 수 있습니다 (3+9, 6+6, 4+4+4, 3+6+3 등).

## Elevation & Depth

최소한의 그림자를 사용하며, 계층 구분은 주로 배경색 차이와 보더로 달성합니다.

- **sm**: `0 1px 3px rgba(0,0,0,0.1)` — 카드, 드롭다운
- **md**: `0 4px 12px rgba(0,0,0,0.15)` — Modal
- **lg**: `0 11px 15px -7px rgba(0,0,0,0.2)` — Popup
- **up**: `0 -4px 12px rgba(0,0,0,0.1)` — BottomSheet (상방 그림자)

Z-index 레이어: base(0) → dropdown(100) → sticky(200) → appBar(300) → modal(1000) → popup(1100) → toast(1200)

## Shapes (Radius)

전반적으로 **약간 둥근(8px)** 형태를 기본으로 사용합니다. 부드러움과 전문성 사이의 균형점입니다.

### Primitive Radius (Figma · RadiusGuide)

| 토큰          | 값     | 용도                                |
| ------------- | ------ | ----------------------------------- |
| `radius.0`    | 0px    | 모서리 없음 (직각)                  |
| `radius.2`    | 2px    | 최소 곡률 (인풋·태그)               |
| `radius.4`    | 4px    | 소형 버튼·칩 모서리                 |
| `radius.6`    | 6px    | 중소형 컴포넌트 모서리              |
| `radius.8`    | 8px    | 기본 카드·컨테이너 (가장 많이 사용) |
| `radius.12`   | 12px   | 중형 카드·패널                      |
| `radius.16`   | 16px   | 대형 카드·모달                      |
| `radius.24`   | 24px   | 바텀시트·오버레이                   |
| `radius.full` | 9999px | 완전 원형 (아바타·뱃지·FAB)         |

### Semantic Shape (의미체계 별칭)

| 토큰         | 값     | 용도                    |
| ------------ | ------ | ----------------------- |
| `shape.none` | 0px    | 경계 없는 플랫 컴포넌트 |
| `shape.xs`   | 2px    | 소형 인라인 요소        |
| `shape.sm`   | 4px    | 버튼·칩                 |
| `shape.md`   | 8px    | 기본 카드 (표준값)      |
| `shape.lg`   | 12px   | 중형 패널·리스트        |
| `shape.xl`   | 16px   | 대형 모달·카드          |
| `shape.2xl`  | 24px   | 바텀시트·오버레이       |
| `shape.full` | 9999px | 아바타·뱃지·토글        |

## Border / Stroke (Figma · BorderGuide)

### Primitive Border Width

| 토큰                  | 값  | 용도                                |
| --------------------- | --- | ----------------------------------- |
| `borderWidth.none`    | 0px | 보더 없음                           |
| `borderWidth.default` | 1px | 기본 보더 (라인·구분선·카드 테두리) |
| `borderWidth.focus`   | 2px | 강조 보더 (포커스 링용 원시값)      |

### Semantic Stroke

| 토큰             | 값  | 용도                           |
| ---------------- | --- | ------------------------------ |
| `stroke.none`    | 0px | 외곽선 없는 컴포넌트 (flat)    |
| `stroke.default` | 1px | 카드·인풋·리스트 구분선 (표준) |
| `stroke.focus`   | 2px | 접근성 포커스 링 (키보드 탐색) |

## Components

### Button

4가지 variant: **solid**(기본 CTA), **outlined**(보조 액션), **soft**(3차 액션), **outlined-sub**(마젠타 보조).
6가지 사이즈: xl(56px) / lg(48px) / md(44px) / sm(42px) / xs(38px) / field(48px).
기본 radius 8px, solid는 primary fill + 흰색 텍스트.

### Input

1px 보더, surface 배경, 48px 높이. 에러/성공 상태 지원.
라벨, 헬퍼 텍스트, 아이콘 슬롯. password/search 변형 포함.

### Chip

pill 형태(9999px radius). outlined/filled/soft 3가지 variant, sm/md/lg 3가지 사이즈.
선택 상태에서 primary 색상 활성화.

### Modal

중앙 정렬 다이얼로그. 12px radius, 24px 패딩. 오버레이 50% 딤.
포커스 트랩, ESC 닫기, 접근성 준수.

### Card

슬롯 기반 구조: thumbnail, header, body, footer. 12px radius, 그림자 없이 보더 또는 배경 대비로 구분.

### Tabs

line/pill/square 3가지 variant. 슬라이딩 인디케이터 애니메이션.

### Toast

화면 상단 알림. success/error/warning/info 4가지 variant. Provider 패턴 + 명령형 API.

### BottomSheet

모바일 하단 드로어. 드래그 핸들, 상방 그림자. 풀스크린 확장 지원.

## Do's and Don'ts

- Do: Primary 색상은 화면당 가장 중요한 1개 액션에만 사용하세요
- Do: 텍스트 대비비 WCAG AA (4.5:1) 이상을 유지하세요
- Do: 터치 타겟은 최소 44px를 보장하세요
- Do: 8px 그리드에 맞춰 간격을 설정하세요
- Don't: 한 화면에 3개 이상의 폰트 웨이트를 혼용하지 마세요
- Don't: 둥근 코너와 각진 코너를 같은 뷰에서 섞지 마세요
- Don't: 그림자와 보더를 동시에 적용하여 이중 계층을 만들지 마세요
- Don't: Secondary(마젠타)를 CTA 용도로 사용하지 마세요 — Primary(블루)가 CTA입니다
