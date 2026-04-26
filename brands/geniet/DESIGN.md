---
version: alpha
name: Geniet
description: "다이어트 정보, 식품 칼로리 검증, 건강식품 구매를 한곳에서. 캐시워크 연동 건강 관리 + 리워드 커머스 플랫폼. 틸(Teal) 컬러 기반 모바일 퍼스트 UI."
colors:
  primary: "#48C2C5"
  primary-light: "#7ED4D6"
  primary-bg: "#E4F6F7"
  primary-surface: "#ECF8F9"
  accent: "#00A8AC"
  surface: "#FFFFFF"
  surface-100: "#FAFAFA"
  surface-150: "#F5F5F5"
  surface-200: "#ECECEC"
  on-surface: "#111111"
  on-surface-dark: "#333333"
  on-surface-secondary: "#666666"
  on-surface-tertiary: "#777777"
  on-surface-disabled: "#999999"
  on-surface-muted: "#BBBBBB"
  on-surface-inverse: "#FFFFFF"
  border-default: "#ECECEC"
  border-medium: "#DDDDDD"
  border-strong: "#CCCCCC"
  error: "#FF3258"
  error-light: "#FF8192"
  error-bg: "#FFEBEE"
  success: "#55D695"
  success-dark: "#49CA89"
  success-bg: "#F1FBF6"
  caution: "#FFB700"
  caution-light: "#FFD54C"
  caution-bg: "#FFF8DF"
  info: "#1FA3F9"
  info-light: "#62BEFA"
  info-bg: "#E4F5FF"
  red-700: "#FF6177"
  red-800: "#FF3258"
  green-400: "#55D695"
  green-700: "#49CA89"
  blue-700: "#1FA3F9"
  purple-700: "#546EFD"
  purple-bg: "#E6EAFF"
  yellow-700: "#FFB700"
  badge-orange: "#F16D4D"
typography:
  headline-1:
    fontFamily: Noto Sans KR
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.14
  headline-2:
    fontFamily: Noto Sans KR
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.18
  headline-3:
    fontFamily: Noto Sans KR
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.2
  headline-4:
    fontFamily: Noto Sans KR
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.22
  headline-5:
    fontFamily: Noto Sans KR
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.23
  body-1:
    fontFamily: Noto Sans KR
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  body-2:
    fontFamily: Noto Sans KR
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.47
  body-3:
    fontFamily: Noto Sans KR
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
  caption-1:
    fontFamily: Noto Sans KR
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.38
  caption-2:
    fontFamily: Noto Sans KR
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Noto Sans KR
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.45
  micro:
    fontFamily: Noto Sans KR
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 18px
  2xl: 23px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 80px
  gutter: 16px
  gutter-wide: 20px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 16px
  button-primary-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.pill}"
    height: 48px
    padding: 16px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 16px
  card-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: 16px
  card-subtle:
    backgroundColor: "{colors.surface-150}"
    rounded: "{rounded.md}"
    padding: 16px
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 16px
  chip-idle:
    backgroundColor: "{colors.surface-150}"
    textColor: "{colors.on-surface-secondary}"
    rounded: "{rounded.pill}"
    height: 34px
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.pill}"
    height: 34px
  toast:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.md}"
    padding: 16px
  modal:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: 24px
  header:
    backgroundColor: "{colors.surface}"
    height: 50px
---

# Geniet Design System

## Overview

지니어트(Geniet)는 다이어트 정보, 식품 칼로리 검증, 건강식품 구매를 한곳에 모은 **건강 관리 + 리워드 커머스 플랫폼**입니다. 캐시워크(CashWalk)와 연동되어 걷기 리워드와 건강 기록을 통합합니다.

- **브랜드 톤**: 밝고 건강한 느낌의 틸(Teal) 컬러. 깔끔하고 데이터 중심적
- **타겟 사용자**: 다이어트/건강관리에 관심 있는 한국인 — 쉽고 직관적인 정보 전달
- **디자인 언어**: 미니멀하고 목적 지향적. 데이터 시각화 우선, 과도한 장식 배제
- **콘텐츠 언어**: 한국어 (`lang="ko"`). 간결한 정보 전달 위주
- **핵심 기능**: 건강 기록(혈압/체중/혈당/칼로리), 다이어트 리뷰, 건강식품 커머스, 캐시딜

## Colors

틸(Teal) 기반 단일 브랜드 컬러에 데이터 시각화용 다색 팔레트를 더한 구성입니다. 건강 기록 차트에서 상태별 색상 구분이 핵심입니다.

- **Primary (#48C2C5)**: 틸. CTA, 활성 상태, 차트 메인 컬러. 건강함과 신선함
- **Accent (#00A8AC)**: 진한 틸. 페이지네이션, 보조 강조
- **Primary-bg (#E4F6F7)**: 연한 틸 배경. 선택된 항목, 하이라이트 영역
- **Error (#FF3258)**: 위험/높음 상태. 혈압 높음, 유효성 오류
- **Success (#55D695)**: 정상 상태. 혈압 정상, 완료
- **Info (#1FA3F9)**: 정보/낮음 상태. 혈압 낮음, 링크
- **Caution (#FFB700)**: 주의. 오렌지 하이라이트
- **Surface (#FFFFFF)**: 페이지 배경
- **On-surface (#111111)**: 본문 텍스트 (매우 진한 검정)

**건강 데이터 시각화 색상:**

- 혈압 높음: #FF6177 (Red) / 정상: #55D695 (Green) / 낮음: #1FA3F9 (Blue)
- 탄수화물: #1FA3F9 / 단백질: #FF627E / 지방: #00D67C
- 칼로리 양호: #00A8AC / 초과: #FF3258 / 부족: #1FA3F9

**중립 계열:** #111(Black) → #333 → #666 → #777 → #999 → #BBB → #CCC → #DDD → #ECE → #F5F → #FAF → #FFF

## Typography

Noto Sans KR을 메인 폰트로 사용합니다. 구글 폰트로 한국어 최적화되어 있으며, 데이터 밀도가 높은 화면에서의 가독성을 우선합니다.

- **Headlines**: Noto Sans KR Bold (700), 17~26px — 페이지/섹션 타이틀
- **Body**: Noto Sans KR Medium~Regular (400~500), 14~16px — 본문, 설명
- **Caption**: Noto Sans KR Regular (400), 12~13px — 보조 정보, 차트 라벨
- **Label/Micro**: Noto Sans KR Regular (400), 10~11px — 배지, 미세 텍스트

폰트 웨이트: Regular(400), Medium(500), Semibold(600), Bold(700), Black(900).
15px가 가장 높은 빈도로 사용되며, 13px가 그 다음으로 빈번합니다.

**특수 폰트:** JalnanOTF — 이벤트/프로모션용 디스플레이 폰트 (일반 UI에 사용 금지)

## Layout

모바일 퍼스트 설계. 최소 360px, 모바일 최대 500px 제약. 데스크톱은 1280px.

- **Base unit**: 4px (8px 증분)
- **Spacing scale**: 4 / 8 / 16 / 24 / 40 / 80px
- **Mobile gutter**: 16px
- **Wide gutter**: 20px
- **Mobile min-width**: 360px
- **Mobile max-width**: 500px (데스크톱에서도 모바일 레이아웃 유지 시)
- **Desktop width**: 1280px
- **Desktop max**: 1920px
- **Header height**: 50px (fixed/non-fixed 옵션)
- **반응형 브레이크포인트**: xs(360) / sm(640) / md(768) / lg(1024) / xl(1280)

## Elevation & Depth

플랫 디자인 기반. 모달/플로팅 요소에만 그림자를 사용합니다.

- **Subtle**: `0 0 6px rgba(0,0,0,0.04)` — 미세 구분
- **Light**: `0 1px 4px rgba(0,0,0,0.1)` — 카드
- **Float**: `0 2px 6px rgba(0,0,0,0.15)` — 플로팅 버튼
- **Card**: `0 3px 10px #DDD` — 카드 그림자
- **Modal**: `0 11px 15px -7px rgba(0,0,0,0.2), 0 9px 46px 8px rgba(0,0,0,0.12), 0 24px 38px 3px rgba(0,0,0,0.14)` — Material Design 스타일 모달
- **Top shadow**: `0 -2px 10px rgba(17,17,17,0.05)` — 하단 고정 요소 상단 그림자

Z-index: base(0) → float(10) → sticky(100) → overlay(5000) → modal(9999) → toast(10000)

## Shapes

**8px 라운드가 기본**. 건강 데이터 중심 UI답게 깔끔하고 기능적인 형태를 지향합니다.

- **xs (4px)**: 작은 배지, 미세 요소
- **sm (6px)**: 인풋, 작은 카드
- **md (8px)**: 버튼, 카드, 모달 — 가장 높은 빈도
- **lg (12px)**: 큰 카드, 이미지 래퍼
- **xl (18px)**: 바텀시트, 큰 모달
- **2xl (23px)**: 큰 pill 형태 요소
- **pill (9999px)**: 칩, 토글, 풀 라운드 버튼

## Components

### Button

Primary는 틸(#48C2C5) fill + 흰색 텍스트. Secondary는 흰색 배경 + 보더.
높이 48px, 8px radius 기본. pill 형태 CTA도 사용.
프로모션/커머스에서는 pill(9999px) 변형 사용.

### Card

기본: 흰색 배경 + 1px #ECECEC 보더 + 8px radius.
Subtle: #F5F5F5 배경, 보더 없음.
건강 기록 카드: 129x132px 고정 사이즈, 컬러 아이콘 + 수치 표시.
캐시딜 상품 카드: 140px 너비 그리드, 랭킹 배지(#F16D4D) 포함.

### Modal

Material Design 스타일 3중 그림자. 8px radius. 24px 내부 패딩.
오버레이: rgba(0,0,0,0.3) ~ rgba(17,17,17,0.4).
다양한 확인/취소 모달 (결제, 인증, 리뷰 등).

### Toast

다크 배경(#111) + 흰색 텍스트. 자동 소멸.
Z-index 10000 (최상위).

### Chart (건강 데이터)

Chart.js 기반. 틸(#48C2C5) 메인 + 연한 틸(#BAEBEC) 보더.
라벨: 13px Noto Sans KR, #999 회색.
상태별 색상 코딩: 높음(빨강) / 정상(초록) / 낮음(파랑).

### Header

50px 높이. 고정/비고정 옵션. 뒤로가기 버튼 + 타이틀 + 우측 액션.

### BottomSheet

하단에서 올라오는 ��로어. translateY 애니메이션.
18px 상단 radius.

### Skeleton Loading

react-loading-skeleton 기반. pulse 애니메이션.
콘텐츠 로딩 중 레이아웃 시프트 방지.

## Do's and Don'ts

- Do: 건강 데이터 차트에서 상태별 색상(빨강/초록/파랑)을 일관되게 사용하세요
- Do: 텍스트 색상은 #111(on-surface)을 기본으로, 보조는 #666 또는 #777을 사용하세요
- Do: 모바일 레이아웃은 360px 최소, 500px 최대를 유지하세요
- Do: 카드 구분은 1px #ECECEC 보더 또는 배경색 차이로 — 그림자는 모달에만
- Do: 스켈레톤 로딩을 적용하여 레이아웃 시프트를 방지하세요
- Don't: JalnanOTF 디스플레이 폰트를 일반 UI에 사용하지 마세요 — 이벤트/프로모션 전용
- Don't: 다크 모드를 적용하지 마세요 — 라이트 테마만 지원
- Don't: Primary(틸)와 Success(초록)를 같은 맥락에서 혼용하지 마세요 — 의미가 다릅니다
- Don't: 건강 기록 외 영역에서 빨강/초록/파랑 상태 색상을 임의로 사용하지 마세요
- Don't: 외부 아이콘 라이브러리 대신 자체 SVG 아이콘을 사용하세요
