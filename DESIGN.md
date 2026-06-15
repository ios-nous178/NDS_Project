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
    900: "#111827"
    800: "#1F2937"
    700: "#374151"
    600: "#4E5462"
    500: "#6C7280"
    400: "#9CA2AE"
    300: "#D2D5D9"
    200: "#E6E7EB"
    100: "#F3F4F6"
    50: "#F8F9FB"
  # Bright Blue — Figma 아토믹 SSOT (구 Vivid Blue 에서 교체, 2026-05)
  blue:
    900: "#0F52A0"
    800: "#1B65BA"
    700: "#0E71CF"
    600: "#017EE4"
    500: "#2B96ED"
    400: "#47A5F0"
    300: "#67B5F2"
    200: "#91CAF6"
    100: "#E3F2FC"
    50: "#F1F8FD"
  magenta:
    900: "#910041"
    800: "#C30058"
    700: "#CE005A"
    600: "#D9005C"
    500: "#ED2E77"
    400: "#EF4384"
    300: "#F15890"
    200: "#F8B8CF"
    100: "#FCE3EC"
    50: "#FDF1F5"
  # Orange Red — Figma 아토믹 명칭 (현 코드에서는 `red` 로 유지)
  red:
    900: "#A01C00"
    800: "#CB2700"
    700: "#E33800"
    600: "#EA3C00"
    500: "#F13F00"
    400: "#FF4E0C"
    300: "#FF6B35"
    200: "#FF875D"
    100: "#FFA98C"
    50: "#FEE9E6"
  # Coral Red — Figma 아토믹 신규 팔레트 (2026-05)
  coralRed:
    900: "#7A0A0A"
    800: "#A01414"
    700: "#C42020"
    600: "#E83030"
    500: "#FF4141"
    400: "#FF7070"
    300: "#FF9A9A"
    200: "#FFCDCD"
    100: "#FFECEC"
    50: "#FFF5F5"
  green:
    900: "#002B1E"
    800: "#003F2E"
    700: "#005640"
    600: "#006B50"
    500: "#008260"
    400: "#00A07C"
    300: "#13BFA2"
    200: "#6FD2BD"
    100: "#AAE3D7"
    50: "#E5F7F4"
  # Amber — Figma 아토믹 신규 팔레트 (2026-05). Yellow 보다 따뜻한 황금톤.
  amber:
    900: "#FC8703"
    800: "#FD9B02"
    700: "#FEAF01"
    600: "#FFC400"
    500: "#FFD200"
    400: "#FFDC39"
    300: "#FFE673"
    200: "#FFF0AC"
    100: "#FFFAE5"
    50: "#FFFEF5"
  # Golden Yellow — Figma 아토믹 명칭 (현 코드에서는 `yellow` 로 유지)
  yellow:
    900: "#9B5000"
    800: "#C06800"
    700: "#E08200"
    600: "#FFA100"
    500: "#FFC303"
    400: "#FFCD27"
    300: "#FFD84F"
    200: "#FFE282"
    100: "#FFEDB3"
    50: "#FFFAE8"

# ── Semantic Colors ─────────────────────────────────────────
# 시멘틱 컬러 토큰의 SSOT 는 `packages/tokens/src/semantic.ts` (Figma SemanticColorGuide
# 171:6675 의 1:1 미러). DESIGN.md 는 atomic palette(primitives) 와 비-컬러 토큰만
# 정의한다. 새 시멘틱 컬러를 추가/수정하려면 semantic.ts 를 직접 편집.
#
# 구 legacy `colors:` 블록 (primary/secondary/text/bg/border/icon × 의미별) 은
# role-based 시스템(`semantic.ts` 의 bg/text/icon/border/fill/button/input)으로
# 대체되어 제거되었다. cv 헬퍼(`packages/tokens/src/cssVar.ts`)도 새 그룹만
# 노출한다 (surface/textRole/iconRole/borderRole/button/fill/input).

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
  # 14개 type scale × 3개 weight(Bold/Medium/Regular) 매트릭스 (Figma 171:6676 가이드).
  # 스케일당 단일 default weight 는 두지 않음 — 사용처에서 weight 를 명시한다.
  typeScale:
    display-1:
      fontSize: 52px
      lineHeight: 74px
      letterSpacing: 0
    display-2:
      fontSize: 48px
      lineHeight: 62px
      letterSpacing: 0
    display-3:
      fontSize: 40px
      lineHeight: 52px
      letterSpacing: 0
    headline-1:
      fontSize: 36px
      lineHeight: 48px
      letterSpacing: 0
    headline-2:
      fontSize: 28px
      lineHeight: 38px
      letterSpacing: 0
    headline-3:
      fontSize: 24px
      lineHeight: 32px
      letterSpacing: 0
    headline-4:
      fontSize: 20px
      lineHeight: 28px
      letterSpacing: 0
    headline-5:
      fontSize: 18px
      lineHeight: 26px
      letterSpacing: 0
    body-1:
      fontSize: 16px
      lineHeight: 24px
      letterSpacing: 0
    body-2:
      fontSize: 15px
      lineHeight: 22px
      letterSpacing: 0
    body-3:
      fontSize: 14px
      lineHeight: 20px
      letterSpacing: 0
    caption-1:
      fontSize: 13px
      lineHeight: 18px
      letterSpacing: 0
    caption-2:
      fontSize: 12px
      lineHeight: 16px
      letterSpacing: 0
    label:
      fontSize: 11px
      lineHeight: 14px
      letterSpacing: 0
  # ── Input Typography 표준 (Figma 4247:1964 · 브랜드 무관) ───────────────
  # 입력 패밀리(Label·Input Value·Placeholder·Helper·Error)의 타이포를 브랜드와 무관하게
  # 통일하는 시멘틱 토큰. size+lineHeight 를 한 토큰으로 묶고(`--semantic-input-typography-
  # {role}` = `{size}px/{lh}px`), weight 는 분리 토큰(`--semantic-input-typography-{role}-
  # weight` → --font-weight-*)으로 적용한다. 값은 base typeScale 에서 파생하되 literal 로
  # 박아 브랜드 typeScale override 의 영향을 받지 않는다(= 브랜드 무관 보장). 컴포넌트는
  # cv.inputTypography.{role}.font(= font shorthand) 로 소비. 정의/emit 은 코드가 SSOT:
  # packages/tokens/scripts/generate-css.cjs(INPUT_TYPOGRAPHY) + cssVar.ts(cv.inputTypography).
  #   label  : 13/18 · Medium  (= typeScale.caption1 · 필수* 는 색만 status-error)
  #   value  : 15/22 · Regular (= typeScale.body2 · placeholder 동일, 색만 muted)
  #   helper : 13/18 · Regular (= typeScale.caption1 · error 동일, 색만 status-error)
  # + 제너릭 묶음 토큰 `--font-{scale}` = `{size}px/{lineHeight}px` (전 14 스케일) 도 함께
  #   emit — `font` shorthand 한 칸에 size/line-height 를 넣고 weight·family 를 분리 조합.

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

# ── Gap (Semantic — 요소 간 거리, 의도 기반) ──────────────
# 4pt grid · Figma SpacingGuide / Gap
gap:
  tight: 4px # Chip · Badge 그룹
  default: 10px # ★ 표준 컴포넌트 gap
  comfortable: 12px # 폼 필드 · 세그먼트
  loose: 16px # 컴포넌트 ↔ 컴포넌트
  wide: 24px # 큰 영역 ↔ 큰 영역
  label: 8px # ★ 입력 라벨 ↔ 컨트롤 (입력 계열 전체 + FormField top-label 공용 SSOT)

# ── Gap/Title (헤딩 ↔ 서브타이틀, 의도 기반) ──────────────
# Figma TitleGapGuide 859:5614 · 6 페이지 58건 실측 기반
# level 만 결정하면 헤딩 폰트와 함께 자동 적용되는 표준 간격
gap-title:
  h1: 12px # 36px Bold · Hero
  h2: 12px # 28px Bold · 큰 섹션 · 다이얼로그 헤더
  h3: 12px # 24px Bold · 페이지 헤더
  h4: 6px # 20px Bold · ★ 카드 헤딩 (가장 자주)
  h5: 8px # 18px Bold · ★ 서브 헤딩 (가장 자주)

# ── Inset (Semantic — 컨테이너 내부 여백, 사용처 기반) ────
# 4pt grid · Figma SpacingGuide / Inset
# Gap(요소 간 거리)과 명확히 구분. 카드 padding 은 `--inset-card`.
inset:
  chip: 8px # Chip · Badge 내부
  input: 12px # Input · 작은 컨테이너
  card: 16px # ★ 카드 표준 padding
  card-large: 20px # 큰 카드
  modal: 24px # Modal · 통계 박스

# ── Rounded / Radius (Policy Scale) ────────────────────────
# 공개 export는 승인된 UI radius 세트로 제한한다.
# 예외가 필요하면 ad-hoc radius 토큰을 추가하지 말고 컴포넌트 prop/CSS var로 처리한다.
rounded:
  sm: 4px # 소형 버튼·칩 모서리
  md: 8px # 기본 카드·컨테이너 (가장 많이 사용)
  lg: 12px # 중형 카드·패널
  pill: 9999px # 칩·토글·원형 요소

# ── Shape (Semantic — radius 정책 별칭) ────────────────────
shape:
  sm: 4px # 버튼·칩
  md: 8px # 기본 카드 (표준값)
  lg: 12px # 중형 패널·리스트
  pill: 9999px # 아바타·뱃지·토글

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
    xl: 52px
    lg: 48px
    md: 44px
    sm: 42px
    xs: 38px
    mini: 32px # 아주 작은 인박·압축 영역 (지니어트 ButtonGuide 3047:1032)
    field: 48px # 폼 옆 버튼 — 인풋 행 높이(input.default 48)와 맞춤
  tabs:
    line:
      mobile: 50px
      pc: 56px
    chip:
      mobile: 36px
      pc: 44px
    segment:
      pc: 56px
  appBar:
    height: 52px
  bottomBar:
    height: 56px
  input:
    default: 48px
    field: 48px # 폼 옆 버튼·input.default(48) 와 행 높이 정렬 (field=44 고아값 제거)
    compact: 40px # Admin/Settings 표준 (CashwalkBiz admin TextField) — 라벨 좌측 폼·dense table inline 편집
  fieldWidth: # 입력 필드 가로 너비 스케일 (TextInput·Dropdown·DateInput·Selection 공통, 컨테이너 안에서는 px 고정). full=100% 는 컴포넌트 prop 에서 처리. Figma InputGuide Field Width(3897-1578)
    xs: 120px # 코드·짧은 ID·숫자 (예: 사업자번호 토큰)
    sm: 200px # 단일 키워드 검색·Filter Dropdown·페이지네이션 옆 셀렉트
    md: 304px # 폼 내부 일반 입력 (이메일·이름·계정명) — default, 가장 흔함
    lg: 400px # 모달 내부 메인 입력·단독 검색바
    xl: 488px # 와이드 페이지 필터·상세 폼 강조

# ── Elevation ───────────────────────────────────────────────
elevation:
  shadow:
    0: "none"
    1: "0px 1px 4px rgba(0, 0, 0, 0.08)"
    2: "0px 4px 12px rgba(0, 0, 0, 0.10)"
    3: "0px 8px 24px rgba(0, 0, 0, 0.12)"
  zIndex:
    base: 0
    dropdown: 100
    sticky: 200
    appBar: 300
    modal: 1000
    popup: 1100
    tooltip: 1400
    toast: 1500

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

# Nudge Design System

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

Z-index 레이어: base(0) → dropdown(100) → sticky(200) → appBar(300) → modal(1000) → popup(1100) → tooltip(1400) → toast(1500)

## Shapes (Radius)

전반적으로 **약간 둥근(8px)** 형태를 기본으로 사용합니다. 부드러움과 전문성 사이의 균형점입니다.

### Primitive Radius (Figma · RadiusGuide)

| 토큰          | 값     | 용도                                |
| ------------- | ------ | ----------------------------------- |
| `radius.sm`   | 4px    | 소형 버튼·칩 모서리                 |
| `radius.md`   | 8px    | 기본 카드·컨테이너 (가장 많이 사용) |
| `radius.lg`   | 12px   | 중형 카드·패널                      |
| `radius.pill` | 9999px | 칩·토글·원형 요소                   |

### Semantic Shape (의미체계 별칭)

| 토큰         | 값     | 용도             |
| ------------ | ------ | ---------------- |
| `shape.sm`   | 4px    | 버튼·칩          |
| `shape.md`   | 8px    | 기본 카드        |
| `shape.lg`   | 12px   | 중형 패널·리스트 |
| `shape.pill` | 9999px | 아바타·뱃지·토글 |

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

3가지 variant: **solid**(기본 CTA), **outlined**(보조 액션), **soft**(3차 액션).
6가지 사이즈: xl(56px) / lg(48px) / md(44px) / sm(42px) / xs(38px) / field(48px).
기본 radius 8px, solid는 primary fill + 흰색 텍스트.

### Input

1px 보더, surface 배경, 48px 높이. 에러/성공 상태 지원.
라벨, 헬퍼 텍스트, 아이콘 슬롯. password/search 변형 포함.

### Chip

pill 형태(9999px radius). outlined/filled/soft 3가지 variant, sm/md/lg 3가지 사이즈.
선택 상태에서 primary 색상 활성화.

### Modal

Modal은 사용자의 현재 흐름을 일시적으로 중단하고, 중요한 결정이나 즉각적인 응답이 필요한 정보를 전달하기 위한 오버레이 UI입니다. 출처: Figma · ┗ Modal ✔️ & Toast (171:9905).

- **Radius**: 8px (Figma 측정값, `shape.md` / `radius.md`)
- **카드 패딩(비대칭)**: top 28px / 좌우 16px / bottom 16px (Figma 실측). 본문 그룹(Image+Title+Description)과 버튼 그룹 사이 **24px** gap
- **그룹 내부 gap**: Image–Title–Description 사이 8px
- **오버레이**: 50% 딤 (`bg.overlay`)
- **그림자**: `shadow["3"]` / `elevationLevel.modal` (E3, `var(--shadow-3)`. 내부에 추가 그림자/보더 금지)
- **접근성**: 포커스 트랩, ESC 닫기, `role="dialog"` + `aria-modal` 기본 적용

#### Device 너비

PC와 모바일에서 다르게 사용합니다.

| 환경   | 너비      | `ModalContent.maxWidth` / `Modal.device` |
| ------ | --------- | ---------------------------------------- |
| PC     | **332px** | `maxWidth={332}` 또는 `device="pc"`      |
| Mobile | **294px** | `maxWidth={294}` 또는 `device="mobile"`  |

#### Type

디스크립션 + 버튼이 기본 구성이며 타이틀과 이미지는 선택적으로 사용합니다.

- `default`: 설명 + Cancel/OK 버튼
- `title`: Title 헤더 + 설명 + Cancel/OK 버튼
- `Image`: 64×64 이미지/아이콘 + Title + 설명 + Cancel/OK 버튼 (`Modal.Image` 슬롯)

#### Modal Buttons

버튼은 1~2개까지 사용하며, 텍스트가 뜻하는 중요도에 따라 디자인이 변경됩니다.

- **1 button**: 단일 Primary OK (full-width, 가장 중요한 단일 액션)
- **2 buttons**: Cancel (Outlined) + OK (Primary) 가로 분할
- **3 buttons (button type)**: Primary / Disabled / Outlined Cancel 조합 — 디자인 디스플레이용

### Card

슬롯 기반 구조: thumbnail, header, body, footer. 12px radius, 그림자 없이 보더 또는 배경 대비로 구분.

### Tabs

line/chip/segment 3가지 variant. 각 variant는 `mobile`/`pc` 사이즈로 분기. 슬라이딩 인디케이터 애니메이션.

### Toast

비차단형 단일 다크 알림(Figma 1330:2). 위치가 곧 형태 — `top`(PC·상단 중앙·pill·16/32) / `bottom`(모바일·하단·rounded 24·12/20). 색 변형 없음, 동시에 1개만 노출, 자동 사라짐(2~3초). Provider 패턴 + 명령형 API.

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
