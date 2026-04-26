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
rounded:
  none: 0px
  xs: 6px
  sm: 4px
  md: 8px
  lg: 12px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 64px
  gutter: 20px
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
