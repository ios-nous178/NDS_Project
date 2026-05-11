---
version: alpha
name: NudgeEAP
description: "EAP(Employee Assistance Program) 멘탈케어 플랫폼 디자인 시스템. 신뢰감 있는 블루 톤 기반, 접근성과 명확성을 우선하는 모바일 퍼스트 UI."
colors:
  primary: "#2B96ED"
  primary-hover: "#017EE4"
  primary-pressed: "#1B65BA"
  primary-lighter: "#91CAF6"
  primary-bg: "#E3F2FC"
  primary-bg-lighter: "#F1F8FD"
  secondary: "#ED2E77"
  secondary-lighter: "#F8B8CF"
  secondary-bg: "#FCE3EC"
  error: "#F13F00"
  error-bg: "#FEE9E6"
  caution: "#FFC303"
  caution-text: "#FFA100"
  caution-bg: "#FFFAE8"
  success: "#13BFA2"
  success-bg: "#E5F7F4"
  surface: "#FFFFFF"
  surface-light: "#FAFAFA"
  surface-cool: "#F3F4F6"
  on-surface: "#383838"
  on-surface-subtle: "#666666"
  on-surface-disabled: "#999999"
  on-surface-inverse: "#FFFFFF"
  border-default: "#D8D8D8"
  border-light: "#ECECEC"
  # overlay는 rgba(0,0,0,0.5) — hex 6자리만 지원하므로 토큰에서 제외, Markdown body에 기술
typography:
  display:
    fontFamily: Pretendard
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.3
  headline-1:
    fontFamily: Pretendard
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.33
  headline-2:
    fontFamily: Pretendard
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.36
  headline-3:
    fontFamily: Pretendard
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.33
  headline-4:
    fontFamily: Pretendard
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
  headline-5:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.44
  body-1:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  body-2:
    fontFamily: Pretendard
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.47
  body-3:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
  caption-1:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.38
  caption-2:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Pretendard
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.64
# ── Radius (Figma · RadiusGuide, 17 Variables) ─────────────
rounded:
  none: 0px # 모서리 없음 (직각)
  radius2: 2px # 최소 곡률 (인풋·태그)
  sm: 4px # 소형 버튼·칩 모서리
  xs: 6px # 중소형 컴포넌트 모서리 (legacy 이름 유지)
  md: 8px # 기본 카드·컨테이너 (가장 많이 사용)
  lg: 12px # 중형 카드·패널
  radius16: 16px # 대형 카드·모달
  radius24: 24px # 바텀시트·오버레이
  full: 9999px # 완전 원형
  pill: 9999px # 별칭

# ── Shape (Semantic 별칭) ──────────────────────────────────
shape:
  none: 0px # 경계 없는 플랫 컴포넌트
  xs: 2px # 소형 인라인 요소
  sm: 4px # 버튼·칩
  md: 8px # 기본 카드 (표준값)
  lg: 12px # 중형 패널·리스트
  xl: 16px # 대형 모달·카드
  2xl: 24px # 바텀시트·오버레이
  full: 9999px # 아바타·뱃지·토글

# ── Spacing (Figma · SpacingGuide, 4pt grid) ──────────────
spacing:
  0: 0px # 간격 없음
  2: 2px # 아이콘-텍스트 최소 간격
  4: 4px # 인라인 요소 간격
  6: 6px # 뱃지·칩 내부 여백
  8: 8px # 카드 내부 수직 간격
  10: 10px # 리스트 아이템 내부 패딩
  12: 12px # 섹션 내부 간격
  14: 14px # 중첩 요소 여백
  16: 16px # 기본 레이아웃 여백
  18: 18px # 중대형 컴포넌트 패딩
  20: 20px # 섹션 간격 (중)
  24: 24px # PC 그리드 거터
  28: 28px # 큰 컴포넌트 내부 여백
  32: 32px # 페이지 섹션 분리
  36: 36px # 대형 섹션 상하 여백
  40: 40px # PC 최소 페이지 마진
  # legacy 별칭 (브랜드 컴포넌트에서 사용)
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 64px
  gutter: 20px

# ── Gap (Semantic — 컴포넌트 간 간격) ──────────────────────
gap:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 20px
  xl: 24px

# ── Padding (Semantic — 컨테이너 내부 여백) ────────────────
padding:
  xs: 6px
  sm: 10px
  md: 16px
  lg: 20px
  xl: 24px

# ── Border Width / Stroke (Figma · BorderGuide) ────────────
borderWidth:
  none: 0px # 보더 없음
  default: 1px # 기본 보더
  focus: 2px # 강조 보더 (포커스 링 원시값)
stroke:
  none: 0px # flat
  default: 1px # 카드·인풋·리스트 구분선 (표준)
  focus: 2px # 접근성 포커스 링

# ── Grid ───────────────────────────────────────────────────
grid:
  mobile:
    columns: 4
    margin: 16px # 좌우 마진 고정
    gutter: 8px
    contentWidth: 328px # 360 - 16*2
  desktop:
    columns: 12
    margin: 360px # 1920 기준 자동 분배
    minMargin: 40px # 1200px 이하 뷰포트에서 최소 마진
    gutter: 24px
    contentWidth: 1200px # max-width
components:
  button-solid:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 16px
  button-solid-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outlined:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: 48px
  button-soft:
    backgroundColor: "{colors.primary-bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: 48px
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 16px
  chip-outlined:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    rounded: "{rounded.pill}"
    height: 36px
  chip-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.pill}"
    height: 36px
  card-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  modal:
    backgroundColor: "{colors.surface}"
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

- **Display/Headlines**: Pretendard Bold (700), 18~40px — 페이지 타이틀, 섹션 헤더
- **Body**: Pretendard Medium~Regular (400~500), 14~16px — 본문, 설명 텍스트
- **Caption/Label**: Pretendard Regular (400), 11~13px — 보조 정보, 메타데이터

폰트 웨이트는 Regular(400), Medium(500), Semibold(600), Bold(700) 네 단계를 사용합니다. 한 화면에 2~3개 웨이트만 사용하여 시각적 일관성을 유지하세요.

## Layout

모바일 퍼스트로 설계하며, **4pt 기반** 스페이싱 스케일을 사용합니다. 출처: Figma · ┗ Grid / Border / Radius.

- **Base unit**: 4px (8px 컴포넌트 권장)
- **Primitive Space**: 0 / 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 36 / 40px
- **Semantic Gap**: xs(4) · sm(8) · md(12) · base(16) · lg(20) · xl(24)
- **Semantic Padding**: xs(6) · sm(10) · md(16) · lg(20) · xl(24)
- **AppBar height**: 52px
- **BottomBar height**: 56px
- **Content max-width**: Mobile 328px / Desktop 1200px

### Grid System

| 속성        | Mobile          | Desktop                     |
| ----------- | --------------- | --------------------------- |
| 기준 뷰포트 | 360px (Android) | 1920px                      |
| 컬럼 수     | 4               | 12                          |
| 좌우 마진   | 16px            | 360px (≤1200px 시 min 40px) |
| 거터        | 8px             | 24px                        |
| 콘텐츠 너비 | 328px           | 1200px (max-width)          |

- **Mobile**: 360px(Android) 기준 4컬럼, 좌우 마진 16px 고정, 콘텐츠 영역 328px(360-32), 컬럼 거터 8px. iOS(375px)에서도 마진 16px 유지하며 콘텐츠 영역이 자연스럽게 확장됩니다.
- **Desktop**: 1920px 기준 12컬럼, 콘텐츠 최대 너비(`max-width`) 1200px으로 양쪽 360px씩 분배됩니다. 뷰포트가 1200px 이하로 줄어들면 콘텐츠 영역이 뷰포트 너비에 맞게 유동 적용되며, 이때 좌우 마진은 **40px을 최소값**으로 유지합니다. 컬럼 거터 24px, 컬럼은 묶어서 사용할 수 있습니다 (3+9 · 6+6 · 4+4+4 · 3+6+3 등).

## Elevation & Depth

최소한의 그림자를 사용하며, 계층 구분은 주로 배경색 차이와 보더로 달성합니다.

- **sm**: `0 1px 3px rgba(0,0,0,0.1)` — 카드, 드롭다운
- **md**: `0 4px 12px rgba(0,0,0,0.15)` — Modal
- **lg**: `0 11px 15px -7px rgba(0,0,0,0.2)` — Popup
- **up**: `0 -4px 12px rgba(0,0,0,0.1)` — BottomSheet (상방 그림자)

Z-index 레이어: base(0) → dropdown(100) → sticky(200) → appBar(300) → modal(1000) → popup(1100) → toast(1200)

## Shapes (Radius)

기본 형태는 **약간 둥근(8px)** 입니다 — 부드러움과 전문성 사이의 균형점. 전체 스케일은 Figma · RadiusGuide(17 Variables) 기준.

### Primitive Radius

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

### Semantic Shape

`shape.none(0)` · `shape.xs(2)` · `shape.sm(4)` · `shape.md(8)` · `shape.lg(12)` · `shape.xl(16)` · `shape.2xl(24)` · `shape.full(∞)`

## Border / Stroke

Figma · BorderGuide(6 Variables) 기준. 기본 1px 보더, 포커스 링은 2px.

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
