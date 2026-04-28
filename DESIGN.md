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

# ── Spacing ─────────────────────────────────────────────────
spacing:
  0: 0px
  1: 1px
  2: 2px
  4: 4px
  6: 6px
  7: 7px
  8: 8px
  10: 10px
  11: 11px
  12: 12px
  13: 13px
  16: 16px
  20: 20px
  24: 24px
  28: 28px
  30: 30px
  33: 33px
  36: 36px
  48: 48px
  64: 64px
  80: 80px

# ── Rounded ─────────────────────────────────────────────────
rounded:
  none: 0px
  xs: 6px
  sm: 4px
  md: 8px
  lg: 12px
  pill: 9999px

# ── Border Width ────────────────────────────────────────────
borderWidth:
  none: 0px
  default: 1px

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

모바일 퍼스트로 설계하며, 8px 기반 스페이싱 스케일을 사용합니다.

- **Base unit**: 8px
- **Spacing scale**: 4 / 8 / 16 / 24 / 48 / 64px
- **Page gutter**: 20px (모바일 좌우 여백)
- **AppBar height**: 52px
- **BottomBar height**: 56px
- **Content max-width**: 제한 없음 (모바일 전폭 기준)

## Elevation & Depth

최소한의 그림자를 사용하며, 계층 구분은 주로 배경색 차이와 보더로 달성합니다.

- **sm**: `0 1px 3px rgba(0,0,0,0.1)` — 카드, 드롭다운
- **md**: `0 4px 12px rgba(0,0,0,0.15)` — Modal
- **lg**: `0 11px 15px -7px rgba(0,0,0,0.2)` — Popup
- **up**: `0 -4px 12px rgba(0,0,0,0.1)` — BottomSheet (상방 그림자)

Z-index 레이어: base(0) → dropdown(100) → sticky(200) → appBar(300) → modal(1000) → popup(1100) → toast(1200)

## Shapes

전반적으로 **약간 둥근(8px)** 형태를 기본으로 사용합니다. 부드러움과 전문성 사이의 균형점입니다.

- **sm (4px)**: 작은 요소, 인풋 내부 장식
- **md (8px)**: 버튼, 인풋, 모달 — 대부분의 컴포넌트 기본값
- **lg (12px)**: 카드, 바텀시트
- **pill (9999px)**: 칩, 토글, 풀 라운드 요소

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
