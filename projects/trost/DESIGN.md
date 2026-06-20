---
version: alpha
name: Trost
description: "한국 #1 온라인 심리 상담 플랫폼. 따뜻하고 안심되는 옐로우 시그니처 컬러와 차분한 톤으로, 심리 상담 진입 장벽을 낮추는 모바일 퍼스트 UI."
colors:
  primary: "#FFF42E"
  primary-light: "#FFF8B8"
  primary-fg: "#000000"
  primary-hover: "#FFE600"
  primary-pressed: "#E6D200"
  secondary: "#4968FF"
  secondary-light: "#A3B3FF"
  secondary-bg: "#EDF0FF"
  secondary-bg-lighter: "#F6F7FF"
  tertiary: "#F93E67"
  tertiary-light: "#FFC1CE"
  tertiary-bg: "#FEECF0"
  tertiary-bg-lighter: "#FFF5F7"
  error: "#FF4111"
  error-bg: "#FEE9E6"
  success: "#00BC78"
  success-bg: "#E6F9F2"
  caution: "#FF9D00"
  caution-bg: "#FFF8E6"
  info: "#2C91FF"
  info-bg: "#EBF4FF"
  surface: "#FFFFFF"
  surface-subtle: "#F4F5F7"
  surface-light: "#F6F6F6"
  surface-muted: "#F2F2F2"
  on-surface: "#333333"
  on-surface-secondary: "#606060"
  on-surface-tertiary: "#979797"
  on-surface-disabled: "#C7C7C7"
  on-surface-inverse: "#FFFFFF"
  border-default: "#E5E5E5"
  border-soft: "#F2F2F2"
  border-strong: "#D8D8D8"
  bg-footer: "#333333"
  bg-scrim: "#000000"
typography:
  headline-1:
    fontFamily: Pretendard Variable
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.46
  headline-2:
    fontFamily: Pretendard Variable
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.42
  headline-3:
    fontFamily: Pretendard Variable
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.36
  headline-4:
    fontFamily: Pretendard Variable
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.44
  body-1:
    fontFamily: Pretendard Variable
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-2:
    fontFamily: Pretendard Variable
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.47
  body-3:
    fontFamily: Pretendard Variable
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
  caption-1:
    fontFamily: Pretendard Variable
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.38
  caption-2:
    fontFamily: Pretendard Variable
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Pretendard Variable
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 20px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 80px
  gutter: 16px
  gutter-desktop: 20px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-fg}"
    rounded: "{rounded.pill}"
    height: 52px
    padding: 32px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-chip-idle:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    height: 38px
    padding: 14px
  button-chip-active:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.xl}"
    height: 38px
  card-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  card-subtle:
    backgroundColor: "{colors.surface-subtle}"
    rounded: "{rounded.lg}"
    padding: 16px
  card-info:
    backgroundColor: "{colors.secondary-bg}"
    rounded: "{rounded.lg}"
    padding: 16px
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 16px
  toast:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.lg}"
    padding: 16px
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 16px
---

# Trost Design System

## Overview

트로스트(Trost)는 한국 #1 온라인 심리 상담 플랫폼입니다. "위안"을 뜻하는 독일어에서 이름을 따왔으며, **따뜻하고 안심되는 경험**을 디자인의 핵심 가치로 삼습니다.

- **프로젝트 톤**: 따뜻하고 조용히 안심을 주는 톤. 비임상적이고 친근한 언어
- **타겟 사용자**: 심리 상담이 처음인 한국인 — 진입 장벽을 최소화
- **디자인 언어**: 깔끔하고 여백이 넉넉한 레이아웃. 그라디언트 없음. 최소한의 모션
- **콘텐츠 언어**: 한국어 우선 (`lang="ko"`). 정중한 `-요/-세요` 존칭 사용
- **문체**: 짧고 선언적인 문장. **볼드(700)**로 강조, 절대 ALL CAPS나 이모지 사용 안 함

## Colors

**옐로우 시그니처** — 트로스트의 핵심 아이덴티티. 따뜻함과 활기를 전달하는 밝은 노란색이 CTA와 핵심 인터랙션에 사용됩니다. 노란 배경 위에는 반드시 검은색 텍스트를 사용합니다.

- **Primary (#FFF42E)**: CTA 버튼, 활성 칩, 핵심 액션. 시그니처 옐로우
- **Secondary / Cobalt (#4968FF)**: 링크, 정보 강조, 보조 액션
- **Tertiary / Pink (#F93E67)**: 커뮤니티 좋아요, 감정 표현, 포인트 컬러
- **Error (#FF4111)**: 유효성 오류, 위기 알림
- **Success (#00BC78)**: 완료, 긍정 피드백
- **Caution (#FF9D00)**: 활성 서브탭, 주의 하이라이트
- **Surface (#FFFFFF)**: 앱/카드 배경
- **Surface-subtle (#F4F5F7)**: 쿨 그레이 기본 카드 배경, 칩 비활성 배경
- **On-surface (#333333)**: 본문 텍스트, 푸터 배경

**중립 계열**: Gray-800(#333) → Gray-700(#606060) → Gray-500(#979797) → Gray-400(#C7C7C7) → Gray-200(#E5E5E5) → Gray-150(#F2F2F2) → Gray-100(#F6F6F6) → White

## Typography

Pretendard Variable 가변 폰트를 전 구간에 사용합니다. 한글 최적화된 산세리프 폰트로, Apple SD Gothic Neo와 Malgun Gothic을 폴백으로 사용합니다.

- **Headlines**: Pretendard Bold (700), 18~26px — 섹션 타이틀, 페이지 헤더
- **Body**: Pretendard Regular (400), 14~16px — 본문, 설명 텍스트
- **Caption**: Pretendard Regular (400), 12~13px — 보조 정보, 메타데이터
- **Label**: Pretendard Medium (500), 12px — 태그, 분류 라벨

폰트 웨이트는 Regular(400), Medium(500), Semibold(600), Bold(700). 한 화면에 2~3개 웨이트 제한.
한국어 줄바꿈: `break-keep` + `whitespace-pre-line`으로 단어 단위 줄바꿈.

## Layout

모바일 퍼스트 설계. 데스크톱은 1080px 최대 너비 중앙 정렬.

- **Base unit**: 4px (4px 배수 체계)
- **Spacing scale**: 4 / 8 / 16 / 24 / 48 / 80px
- **Mobile gutter**: 16px
- **Desktop gutter**: 20px
- **Desktop max-width**: 1080px (중앙 정렬)
- **Desktop home grid**: 2컬럼 (`lg:grid-cols-2 lg:gap-x-6`)
- **Mobile**: 단일 컬럼 전폭
- **데스크톱 섹션 리듬**: 60~80px 상단 패딩
- **반응형 브레이크포인트**: `lg:` (~1024px)

## Elevation & Depth

최소한의 그림자를 사용합니다. 주로 inset 보더(hairline)와 배경색 차이로 계층을 구분합니다.

- **Hairline inset**: `inset 0 0 0 1px #E5E5E5` — 커뮤니티 패널, 카드 보더 대안
- **Toast**: `0 4px 16px rgba(0,0,0,0.15)` — 토스트 알림
- **Material**: `0 1px 1px rgba(0,0,0,0.24), 0 0 1px rgba(0,0,0,0.12)` — 결제 등 특수 UI

Z-index: content(0) → stickyHeader(50) → bottomSheet(100) → bottomFixedInput(200) → fullscreenBottomSheet(300) → toast(400)

## Shapes

전반적으로 **중간 라운드(8~12px)** 기본. 버튼은 **pill(9999px)** 형태가 시그니처.

- **sm (6px)**: 작은 요소, 뱃지
- **md (8px)**: 칩, 인풋, 일반 요소
- **lg (12px)**: 카드, 배너, 바텀시트
- **xl (20px)**: 필 형태 칩 (커뮤니티 탭)
- **pill (9999px)**: Primary 버튼 — 트로스트 시그니처

## Components

### Button (Primary)

**Pill 형태의 옐로우 CTA**가 트로스트의 시그니처. 검은색 텍스트 + 우측 쉐브론 아이콘 포함.

- Background: #FFF42E, Text: #000000, Radius: pill, Height: 52px, Font: 16px Bold
- 호버: #FFE600, 프레스: #E6D200

### Chip (Tab Button)

커뮤니티, 카테고리 탐색에 사용. 비활성은 쿨 그레이(#F4F5F7), 활성은 다크(#333) + 흰색 텍스트.

- Height: 38px, Padding: 10px/14px, Radius: 20px, Font: 14px

### Card

3가지 변형:

- **Default**: 흰색 배경 + 1px #E5E5E5 hairline 보더 + 12px radius
- **Subtle**: #F4F5F7 배경, 보더 없음
- **Info**: #EDF0FF(cobalt-100) 배경 — 앱 다운로드 배너 등

### BottomSheet

모바일 하단 드로어. 드래그 가능, 확장 가능. 12px 상단 radius.
헤더(타이틀 + 닫기 버튼) + 콘텐츠 + 푸터 구조.

### Modal

중앙 정렬 다이얼로그. 확인/취소 버튼. 백드롭 70% 스크림(#000000 70%).

### Toast

상단/하단 알림. 다크 배경(#333) + 흰색 텍스트. 자동 소멸. 12px radius.

### SoundPlayer

다크 배경 + 옐로우 액센트. 재생/일시정지 아이콘 전환. 플로팅 미니 플레이어 지원.

### Navigation

- **데스크톱**: Sticky 헤더 (로고 + 검색 pill + 5탭 내비 + 로그인)
- **모바일**: 고정 하단 내비바 + 고정 사운드 플레이어

## Content Voice

트로스트의 콘텐츠는 **따뜻하고 조용히 안심을 주는 톤**입니다. 임상적이거나 마케팅적으로 들리지 않아야 합니다.

### 언어 규칙

- **한국어 우선** (`lang="ko"`). 영문은 법률/푸터 보일러플레이트, 프로젝트명에만 사용
- **존칭**: 정중한 `-요/-세요` 존칭. "우리"보다 "여러분/당신"에게 말하는 톤
- **문체**: 짧고 선언적인 문장. 제목형 톤. 절대 마케팅 과장이나 감탄사 사용 안 함
- **강조**: **볼드(700)**로만. ALL CAPS, 이탤릭, 이모지 절대 사용 안 함
- **이모지**: 코드베이스에 이모지 문자 0개. UI 문자열에 유니코드 글리프 사용 안 함

### 콘텐츠 예시 (프로덕션 코드 발췌)

- 섹션 타이틀: **"마음이 단단해지는 하루 10분"**
- 섹션 타이틀: **"나를 위한 심리검사"**
- 배너: **"지금 들은 음원이 마음에 들었다면?"** / **"더 많은 수면/힐링 사운드를 트로스트 앱에서 들어보세요."**
- 탭: `명언` · `성경` · `실시간` / `주간` / `월간` / `댓글순` / `추천순`
- CTA: **"지금 바로 1:1 상담하기"**

### 숫자 및 줄바꿈

- 랭킹 번호: 제로패딩 (`01`, `02`, `03`...)
- 댓글 수: 브래킷 + 액센트 컬러 (`[12]`)
- 헤드라인 줄바꿈: `break-keep` + `whitespace-pre-line`으로 단어 단위 줄바꿈. `line-clamp-2`로 카드 타이틀 말줄임

## Motion

모션은 **최소한이고 절제**되어야 합니다. 트로스트의 UI는 차분함을 전달합니다.

### 허용되는 모션

- **fadeIn**: `opacity 0 → 1` — 유일한 키프레임 애니메이션
- **데스크톱 호버 리프트**: `lg:hover:-translate-y-3` + `transition-transform duration-300 ease-in-out` (전문가 칼럼 카드)
- **모바일 터치 피드백**: `active:bg-gray-cool-100` — 짧은 쿨 그레이 플래시. 축소/확대 없음
- **호버**: 텍스트 색상 어두워짐(`hover:text-gray-700`) 또는 opacity 변화. 드롭다운은 opacity + `pointer-events` 토글로 페이드인
- **바텀시트**: `translateY(100%) → translateY(0)` 슬라이드업

### 금지되는 모션

- bounce, spring, elastic 이징
- parallax 스크롤
- `backdrop-filter: blur()` — 코드베이스에 사용 없음
- scale down/up 프레스 피드백 ("press/shrink" 패턴 사용 안 함)
- 과도한 페이지 전환 애니메이션

## Iconography

트로스트는 **자체 SVG 스프라이트 시스템**을 사용합니다. 외부 아이콘 라이브러리는 사용하지 않습니다.

### 시스템

- `public/images/**/*.svg` → 빌드 시 `sprite.svg`로 컴파일 (`npm run sprite`)
- 런타임: `<SpriteIcon id="/images/.../foo.svg" width height />` React 컴포넌트
- 직접 `<img>` 대신 반드시 `SpriteIcon` 사용 (HTTP 요청 최소화, CLS 방지)

### 아이콘 스타일

- **유틸리티 아이콘**: 채워진(filled) 단색 글리프, 검정색, 20~30px. 예: `ic-search-black`, `ic-alarm-black`, `ic-chevron-*`
- **하트 아이콘**: 2상태 — `ic-heart-white`(아웃라인) → `ic-heart-red-solid`(채움)
- **쉐브론**: 표면 색상에 맞춰 검정/흰색/파랑/회색 변형 제공
- **멘탈 헬스 카테고리 아이콘**: 32~60px, 2톤/소프트 컬러 플랫 SVG (피치/크림/블루그레이)

### 일러스트레이션 (아이콘 아님)

- **3D 클레이메이션 스타일** WebP — 벨, 우편함, 전화기, 약병, 미니 캐릭터 등
- 소프트 플라스틱 렌더 질감, 2x/3x 해상도
- 홈 레벨에서 다른 앱의 이모지/플랫 아이콘 역할을 대체하는 핵심 프로젝트 에셋
- 예: `img-menu-counsel`, `img-menu-community`, `img-menu-map`, `img-bell-3-d`

### 금지

- Lucide, Heroicons, Material Icons, Font Awesome 등 외부 아이콘 라이브러리
- 이모지, 유니코드 글리프, 아이콘 폰트
- 직접 SVG 그리기 — 필요 시 `public/images/`에서 복사

## Do's and Don'ts

- Do: Primary(옐로우) 버튼은 pill 형태로, 항상 검은색 텍스트를 사용하세요
- Do: 한국어 줄바꿈에 `break-keep`을 적용하여 단어가 쪼개지지 않게 하세요
- Do: 카드 구분은 hairline 보더 또는 배경색 차이로 — 그림자는 최소한으로
- Do: 콘텐츠 언어는 따뜻하고 비임상적인 톤으로, 정중한 `-요/-세요` 존칭 사용
- Do: 히어로 이미지에는 70% 블랙 스크림을 적용하여 텍스트 가독성 확보
- Don't: 그라디언트를 코어 UI에 사용하지 마세요
- Don't: ALL CAPS, 이모지, 유니코드 글리프를 사용하지 마세요
- Don't: 과도한 모션(바운스, 스프링, 패럴랙스, backdrop-filter blur)을 사용하지 마세요
- Don't: 아이콘에 Lucide/Heroicons/FontAwesome 등 외부 아이콘 라이브러리를 사용하지 마세요 — 자체 SVG 스프라이트 시스템 사용
- Don't: Secondary(Cobalt)를 CTA 용도로 사용하지 마세요 — Primary(옐로우)가 CTA입니다
