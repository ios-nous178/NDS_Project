---
version: alpha
name: Geniet
description: "다이어트 정보, 식품 칼로리 검증, 건강식품 구매를 한곳에서. 캐시워크 연동 건강 관리 + 리워드 커머스 플랫폼. 틸(Teal) 컬러 기반 모바일 퍼스트 UI."
note: |
  컬러 SSOT 는 Figma 지니어트-Dev / Colors (207:1484). 본 DESIGN.md 의 colors
  블록은 Figma 차트의 평탄 미러이며, 토큰 코드는 packages/tokens/src/brands/
  geniet.palette.ts / geniet.semantic.ts 에 정의된다.
colors:
  # Primary (Mint)
  primary: "#48C2C5"
  primary-light: "#7ED4D6"
  primary-surface: "#ECF8F9"
  accent: "#00A8AC"
  # Mint scale
  mint-100: "#ECF8F9"
  mint-400: "#7ED4D6"
  mint-500: "#48C2C5"
  mint-600: "#00A8AC"
  # Surface / Gray
  surface: "#FFFFFF"
  surface-100: "#FAFAFA"
  surface-150: "#F5F5F5"
  surface-200: "#ECECEC"
  gray-50: "#FAFAFA"
  gray-100: "#F5F5F5"
  gray-200: "#ECECEC"
  gray-300: "#DDDDDD"
  gray-400: "#CCCCCC"
  gray-500: "#BBBBBB"
  gray-600: "#999999"
  gray-700: "#777777"
  gray-800: "#666666"
  gray-900: "#333333"
  # Text
  on-surface: "#111111"
  on-surface-dark: "#333333"
  on-surface-secondary: "#666666"
  on-surface-tertiary: "#777777"
  on-surface-disabled: "#999999"
  on-surface-muted: "#BBBBBB"
  on-surface-inverse: "#FFFFFF"
  # Border
  border-default: "#ECECEC"
  border-medium: "#DDDDDD"
  border-strong: "#CCCCCC"
  # Status — error (Red)
  error: "#FF3258"
  error-light: "#FF8192"
  error-bg: "#FFEBEE"
  red-100: "#FFEBEE"
  red-400: "#FF8192"
  red-500: "#FF6177"
  red-600: "#FF3258"
  # Status — success (Green)
  success: "#49CA89"
  success-light: "#55D695"
  success-dark: "#18B264"
  success-bg: "#F1FBF6"
  green-100: "#F1FBF6"
  green-200: "#DBF8EA"
  green-300: "#80E9B4"
  green-400: "#55D695"
  green-500: "#49CA89"
  green-600: "#18B264"
  # Status — caution (Yellow)
  caution: "#FFB700"
  caution-light: "#FFD54C"
  caution-strong: "#FFA500"
  caution-bg: "#FFF8DF"
  yellow-100: "#FFF8DF"
  yellow-400: "#FFD54C"
  yellow-500: "#FFB700"
  yellow-600: "#FFA500"
  # Status — info (Blue)
  info: "#1FA3F9"
  info-light: "#62BEFA"
  info-bg: "#E4F5FF"
  blue-100: "#E4F5FF"
  blue-400: "#62BEFA"
  blue-500: "#1FA3F9"
  # Accent — purple
  purple-100: "#E6EAFF"
  purple-400: "#7A8EFF"
  purple-500: "#546EFD"
  purple-bg: "#E6EAFF"
  # Misc (legacy 커머스 랭킹 배지 — Figma 차트 외)
  badge-orange: "#F16D4D"
typography:
  # SSOT: Figma 지니어트-Dev / Typography (207:1735)
  # 시스템 폰트 기본 + 디자인 baseline = Pretendard
  title-1:
    fontFamily: Pretendard
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28px
    usage: "주요 페이지 타이틀"
  title-2:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: 700
    lineHeight: 26px
    usage: "카드 타이틀, 리스트 그룹명"
  subtitle-1:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    usage: "부제목, 강조 문장, 카드 내부 제목"
  subtitle-2:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    usage: "섹션 부제목, 설명문"
  body-1:
    fontFamily: Pretendard
    fontSize: 15px
    fontWeight: 400
    lineHeight: 22px
    usage: "리스트형 텍스트, 카드 내 본문 등"
  body-2:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    usage: "일반 본문, 설명 텍스트 (가장 기본 사이즈)"
  body-3:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    usage: "날짜, 단위, 부가 정보 등 작은 영역"
  caption:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    usage: "부가 텍스트, 캡션, 작은 설명"
  label:
    fontFamily: Pretendard
    fontSize: 11px
    fontWeight: 700
    lineHeight: 14px
    usage: "버튼 라벨, 입력필드 타이틀"
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

SSOT 는 **Figma 지니어트-Dev / Colors (207:1484)**. 명명 규칙은 `geniet/{category}/{color}/{level}` (예: `geniet/primary/mint/500`).

틸(Teal) 기반 단일 브랜드 컬러에 데이터 시각화용 다색 팔레트를 더한 구성입니다. 건강 기록 차트에서 상태별 색상 구분이 핵심입니다.

**Primary — Mint:**

- mint600 #00A8AC · mint500 #48C2C5 · mint400 #7ED4D6 · mint100 #ECF8F9

**Secondary (status & accent):**

- Red: 600 #FF3258 · 500 #FF6177 · 400 #FF8192 · 100 #FFEBEE
- Yellow: 600 #FFA500 · 500 #FFB700 · 400 #FFD54C · 100 #FFF8DF
- Blue: 500 #1FA3F9 · 400 #62BEFA · 100 #E4F5FF
- Purple: 500 #546EFD · 400 #7A8EFF · 100 #E6EAFF
- Green: 600 #18B264 · 500 #49CA89 · 400 #55D695 · 300 #80E9B4 · 200 #DBF8EA · 100 #F1FBF6

**Grayscale (10 steps):**

- 900 #333333 · 800 #666666 · 700 #777777 · 600 #999999 · 500 #BBBBBB · 400 #CCCCCC · 300 #DDDDDD · 200 #ECECEC · 100 #F5F5F5 · 50 #FAFAFA

**Black & White:** #111111 (Black) / #FFFFFF (White)

**시멘틱 매핑:**

- **Primary (#48C2C5)**: 틸. CTA, 활성 상태, 차트 메인 컬러. 건강함과 신선함
- **Accent (#00A8AC)**: 진한 틸. 페이지네이션, 보조 강조, 호버
- **Primary-surface (#ECF8F9)**: 연한 틸 배경. 선택된 항목, 하이라이트 영역
- **Error (#FF3258)**: 위험/높음 상태. 혈압 높음, 유효성 오류
- **Success (#49CA89)**: 정상 상태. 혈압 정상, 완료
- **Info (#1FA3F9)**: 정보/낮음 상태. 혈압 낮음, 링크
- **Caution (#FFB700)**: 주의. 오렌지 하이라이트
- **Surface (#FFFFFF)**: 페이지 배경
- **On-surface (#111111)**: 본문 텍스트 (매우 진한 검정)

**건강 데이터 시각화 색상:**

- 혈압 높음: #FF6177 (Red·500) / 정상: #49CA89 (Green·500) / 낮음: #1FA3F9 (Blue·500)
- 칼로리 양호: #00A8AC (Mint·600) / 초과: #FF3258 (Red·600) / 부족: #1FA3F9 (Blue·500)

## Typography

SSOT 는 **Figma 지니어트-Dev / Typography (207:1735)**.

본 프로젝트에서는 **시스템 폰트를 기본**으로 사용하며, 디자인 시에는 **Pretendard** 폰트를 기준으로 작업합니다. 특별한 경우를 제외하고는 시스템 폰트 사용을 권장하며, 신규 폰트가 필요할 경우 팀 내 논의를 거쳐 추가합니다.

텍스트 스타일은 화면의 정보 위계를 명확하게 전달하기 위해 사용되며, 용도에 따라 **Title / Subtitle / Body / Caption / Label** 5개 카테고리로 구분됩니다. 각 스타일은 크기, 행간(line-height), 두께(weight)를 기준으로 정의됩니다.

| Style     | Size | line-height | Weight  | 사용 예시                                 |
| --------- | ---- | ----------- | ------- | ----------------------------------------- |
| Title1    | 22px | 28px        | Bold    | 주요 페이지 타이틀                        |
| Title2    | 18px | 26px        | Bold    | 카드 타이틀, 리스트 그룹명                |
| Subtitle1 | 16px | 24px        | Regular | 부제목, 강조 문장, 카드 내부 제목         |
| Subtitle2 | 14px | 20px        | Regular | 섹션 부제목, 설명문                       |
| Body1     | 15px | 22px        | Regular | 리스트형 텍스트, 카드 내 본문 등          |
| Body2     | 14px | 20px        | Regular | 일반 본문, 설명 텍스트 (가장 기본 사이즈) |
| Body3     | 13px | 18px        | Regular | 날짜, 단위, 부가 정보 등 작은 영역        |
| Caption   | 12px | 16px        | Regular | 부가 텍스트, 캡션, 작은 설명              |
| Label     | 11px | 14px        | Bold    | 버튼 라벨, 입력필드 타이틀                |

폰트 웨이트: Regular(400), Medium(500), SemiBold(600), Bold(700).

**특수 폰트:** JalnanOTF — 이벤트/프로모션용 디스플레이 폰트 (일반 UI에 사용 금지)

## Principles

SSOT 는 **Figma 지니어트-Dev / Principle (207:1610)**.

### (1) Platform

지니어트 앱은 **iOS / Android** 플랫폼을 지원합니다. 디자인 표준 가이드는 **iOS 375 / Android 360** 해상도를 기준으로 작성되며, iPhone SE 및 갤럭시 Z Fold 기기 대응을 위해 **320 가로 해상도**도 함께 고려하여 디자인합니다.

| 분류            | 기준 해상도 |
| --------------- | ----------- |
| iOS             | 375 × 812   |
| Android         | 360 × 640   |
| iOS_SE          | 320 × 568   |
| Z Fold 접힌화면 | 320 × 842   |

### (2) Unit

효율적인 커뮤니케이션을 위해 단위를 통일하여 사용합니다.

`1 = 1px (WEB) = 1dp (AOS) = 1px (iOS)`

### (3) Guide line

레이아웃 구성 시 유연한 그리드와 터치 영역 기준을 준수합니다.

- **Flexible**: 반응형 요소, 화면 크기에 따라 가변
- **Fixed**: 고정 값으로 유지되는 영역
- **Touch area**: 터치 가능한 최소 영역 — 모바일 표준 44 × 44

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
- **Float**: `0 2px 6px rgba(0,0,0,0.15)` — 플로팅 버튼
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
