---
title: "DESIGN.md 명세 (Google Stitch)"
sidebar_label: "DESIGN.md 명세"
description: "Google Stitch의 DESIGN.md 공식 문서 전체 번역 — 개요, 명세, 사용법, CLI, 린팅 규칙"
---

# DESIGN.md 명세 (Google Stitch 공식 문서)

> 이 문서는 [Google Stitch 공식 DESIGN.md 문서](https://app-companion-430619.appspot.com/docs/design-md/overview/index.html) 5개 페이지를 한글로 번역한 참고 자료입니다.

---

## 1. 개요 — DESIGN.md란 무엇인가?

`DESIGN.md`는 AI 에이전트가 일관된 사용자 인터페이스를 생성할 수 있도록 하는 **일반 텍스트 디자인 시스템 문서**입니다. 사람과 에이전트 모두가 읽고, 편집하고, 적용할 수 있는 일반 텍스트 디자인 시스템 문서입니다.

### 핵심 목적

이 문서는 `CLAUDE.md`와 `README.md`의 디자인 측면 대응물 역할을 합니다. README 파일이 프로젝트 개요를 문서화하고 CLAUDE.md 가 코딩 에이전트를 안내하는 반면, `DESIGN.md`는 **디자인 에이전트**에게 **프로젝트가 어떻게 보이고 느껴져야 하는지**를 지시합니다.

### 구조

모든 DESIGN.md는 두 개의 상호 보완적인 레이어로 구성됩니다:

1. **YAML 프론트매터** — 정밀한 명세(헥스 색상 값, 폰트 속성, 간격 측정값)를 담은 기계 판독 가능한 디자인 토큰
2. **마크다운 본문** — 토큰 선택의 이유를 설명하는 사람이 읽을 수 있는 디자인 근거

### 생성 방법

문서에서는 세 가지 접근 방식을 설명합니다:

- **에이전트 생성**: 미적 선호도를 설명하면, 에이전트가 토큰과 가이드라인을 생성합니다
- **브랜드 기반**: 기존 브랜딩 자료를 제공하면, 에이전트가 팔레트, 타이포그래피, 패턴을 추출합니다
- **직접 작성**: 고급 사용자가 마크다운과 YAML을 사용하여 DESIGN.md를 직접 작성할 수 있습니다

### 디자인 철학

이 명세는 유연성을 근본 원칙으로 수용합니다: "알 수 없는 섹션과 커스텀 토큰은 거부되지 않고 수용됩니다." 이를 통해 표준화된 어휘를 유지하면서도 도메인별 확장이 가능합니다.

### 실용적 이점

에이전트가 DESIGN.md를 읽으면, "에이전트가 생성하는 모든 화면이 동일한 시각적 규칙 — 여러분의 색상 팔레트, 타이포그래피, 컴포넌트 패턴 — 을 따릅니다."

---

## 2. 명세 — DESIGN.md 스펙

DESIGN.md 파일은 두 개의 레이어를 가집니다. **YAML 프론트매터**는 에이전트가 일관성을 적용하는 데 사용하는 정밀한 값인 기계 판독 가능한 디자인 토큰을 포함합니다. **마크다운 본문**은 `##` 섹션으로 구성된 사람이 읽을 수 있는 디자인 근거를 제공합니다. 산문에서는 체계적인 토큰 이름(예: `primary`)에 대응하는 서술적 색상 이름(예: "미드나잇 포레스트 그린")을 사용할 수 있습니다. 토큰이 규범적 값이며, 산문은 적용 방법에 대한 맥락을 제공합니다.

이 스펙은 **처방이 아닌 기반**입니다. 에이전트, 도구, 팀이 의존할 수 있는 공통 기반을 제공하면서도 도메인별 필요에 맞게 형식을 확장할 자유를 보존합니다.

### 디자인 토큰

DESIGN.md는 파일 시작 부분에 YAML 프론트매터로 디자인 토큰을 포함합니다. 프론트매터 블록은 정확히 `---`만 포함하는 줄로 시작하고 `---`만 포함하는 줄로 끝나야 합니다. 이 구분자 사이의 YAML 콘텐츠는 아래 정의된 스키마를 따릅니다.

토큰 시스템은 [W3C Design Token Format](https://www.designtokens.org/)에서 영감을 받았습니다. 토큰은 `tokens.json`, Figma 변수, Tailwind 테마 설정으로 쉽게 변환할 수 있습니다.

```yaml
---
version: alpha
name: Daylight Prestige
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
    padding: 12px
---
```

### 스키마

```
version: <string>          # 선택사항, 현재 버전: "alpha"
name: <string>
description: <string>      # 선택사항
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string | token reference>
```

`<scale-level>` 플레이스홀더는 크기 또는 간격 스케일에서 명명된 레벨을 나타냅니다. 일반적인 레벨 이름으로는 `xs`, `sm`, `md`, `lg`, `xl`, `full`이 있습니다. 어떤 서술적 문자열 키도 유효합니다.

### 토큰 타입

| 타입                | 형식                            | 예시               |
| ------------------- | ------------------------------- | ------------------ |
| **Color**           | `#` + 헥스 코드 (sRGB)          | `"#1A1C1E"`        |
| **Dimension**       | 숫자 + 단위 (`px`, `em`, `rem`) | `48px`, `-0.02em`  |
| **Token Reference** | `{path.to.token}`               | `{colors.primary}` |
| **Typography**      | 복합 객체                       | 아래 속성 참조     |

### 타이포그래피 속성

| 속성            | 타입                | 설명                                                                                                                            |
| --------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `fontFamily`    | string              | 폰트 패밀리 이름                                                                                                                |
| `fontSize`      | Dimension           | 폰트 크기                                                                                                                       |
| `fontWeight`    | number              | 숫자 가중치 (예: `400`, `700`). YAML에서 숫자와 따옴표 문자열은 동일합니다                                                      |
| `lineHeight`    | Dimension \| number | 디멘션(예: `24px`) 또는 단위 없는 승수(예: `1.6`). 단위 없는 값을 권장합니다                                                    |
| `letterSpacing` | Dimension           | 자간 조정                                                                                                                       |
| `fontFeature`   | string              | [`font-feature-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-feature-settings) 설정     |
| `fontVariation` | string              | [`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variation-settings) 설정 |

### 토큰 참조

토큰 참조는 중괄호로 감싸지며 YAML 트리의 다른 값에 대한 객체 경로를 포함합니다. 대부분의 토큰 그룹에서 참조는 그룹이 아닌 원시 값(예: `{colors.primary-60}`)을 가리켜야 합니다. `components` 섹션 내에서는 복합 값(예: `{typography.label-md}`)에 대한 참조가 허용됩니다.

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
```

### 섹션

모든 DESIGN.md는 동일한 구조를 따릅니다. 프로젝트와 관련 없는 섹션은 생략할 수 있지만, 포함된 섹션은 아래 나열된 순서대로 나타나야 합니다. 모든 섹션은 `##` 제목을 사용합니다. 문서 제목 용도의 선택적 `#` 제목이 나타날 수 있지만, 섹션으로 파싱되지 않습니다.

섹션 구조는 의도적으로 개방형입니다. 표준 섹션은 공유 어휘를 제공하며, 디자인 시스템은 이를 넘어 도메인별 섹션을 자유롭게 추가할 수 있습니다.

### 섹션 순서

| #   | 섹션              | 별칭             |
| --- | ----------------- | ---------------- |
| 1   | Overview          | Brand & Style    |
| 2   | Colors            |                  |
| 3   | Typography        |                  |
| 4   | Layout            | Layout & Spacing |
| 5   | Elevation & Depth | Elevation        |
| 6   | Shapes            |                  |
| 7   | Components        |                  |
| 8   | Do's and Don'ts   |                  |

### Overview (개요)

"Brand & Style"이라고도 합니다. 제품의 룩앤필에 대한 총체적 설명입니다. 이 섹션은 브랜드 개성, 타겟 오디언스, UI가 불러일으켜야 하는 감정적 반응을 정의합니다. 특정 규칙이나 토큰이 정의되지 않은 경우 기본 맥락으로 사용됩니다.

```
## Overview
차분하고 전문적인 헬스케어 스케줄링 플랫폼 인터페이스.
높은 대비와 넉넉한 터치 타겟을 갖춘 접근성 우선 디자인.
```

### Colors (색상)

디자인 시스템의 색상 팔레트를 정의합니다. 최소한 `primary` 팔레트가 정의되어야 합니다. 추가 팔레트는 자유롭게 이름을 붙일 수 있으며, 일반적인 관례는 `primary`, `secondary`, `tertiary`, `neutral`입니다.

```
## Colors
팔레트는 고대비 뉴트럴과 단일 액센트 색상에 기반합니다.
- **Primary (#1A1C1E):** 헤드라인과 핵심 텍스트를 위한 깊은 잉크 색상.
- **Secondary (#6C7278):** 테두리, 캡션, 메타데이터를 위한 세련된 슬레이트 색상.
- **Tertiary (#B8422E):** 인터랙션을 위한 유일한 드라이버.
- **Neutral (#F7F5F2):** 따뜻한 라임스톤 기반색.
```

**디자인 토큰:** 토큰 이름을 헥스 값에 매핑하는 `map<string, Color>`.

```yaml
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
```

### Typography (타이포그래피)

타이포그래피 레벨을 정의합니다. 대부분의 디자인 시스템은 9~15개의 레벨을 가지며, 각각 의미적 역할(headline, body, label)과 크기 변형(small, medium, large)이 있습니다.

```
## Typography
- **Headlines:** 기관적 목소리를 위한 Public Sans Semi-Bold.
- **Body:** 긴 텍스트 가독성을 위한 Public Sans Regular 16px.
- **Labels:** 기술 데이터와 메타데이터를 위한 Space Grotesk.
```

**디자인 토큰:** 토큰 이름을 타이포그래피 속성에 매핑하는 `map<string, Typography>`.

```yaml
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.1em
```

### Layout (레이아웃)

"Layout & Spacing"이라고도 합니다. 레이아웃과 간격 전략 — 그리드 모델, 간격 스케일, 격납 원칙 — 을 설명합니다.

```
## Layout
레이아웃은 모바일에서 Fluid Grid 모델을, 데스크톱에서 Fixed-Max-Width Grid(최대 1200px)를 따릅니다. 엄격한 8px 간격 스케일을 사용합니다.
```

**디자인 토큰:** 간격 스케일 식별자를 디멘션 또는 단위 없는 숫자(예: 컬럼 수나 비율)에 매핑하는 `map<string, Dimension | number>`.

```yaml
spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 24px
  margin: 32px
```

### Elevation & Depth (엘리베이션과 깊이)

"Elevation"이라고도 합니다. 시각적 계층이 어떻게 전달되는지 설명합니다. 그림자를 사용하는 디자인의 경우 그림자 속성을 정의합니다. 플랫 디자인의 경우 대안적 방법(테두리, 톤 레이어, 색상 대비)을 설명합니다.

```
## Elevation & Depth
깊이감은 강한 그림자보다는 톤 레이어를 통해 구현됩니다.
배경은 부드러운 오프화이트를 사용하고, 주요 콘텐츠는 순백색 카드 위에 배치됩니다.
```

### Shapes (형태)

시각적 요소의 형태 — 코너 반경, 엣지 처리, 전체적인 형태 언어 — 를 설명합니다.

```
## Shapes
모든 인터랙티브 요소는 최소 4px 코너 반경을 사용합니다.
현대적으로 느껴질 만큼 충분히 둥글고, 엔지니어링된 느낌을 줄 만큼 충분히 직선적입니다.
```

**디자인 토큰:** 스케일 레벨을 코너 반경에 매핑하는 `map<string, Dimension>`.

```yaml
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
```

### Components (컴포넌트)

컴포넌트 원자에 대한 스타일 가이드입니다. 스펙은 일반적인 컴포넌트 타입 — Buttons, Chips, Lists, Inputs, Checkboxes, Radio buttons, Tooltips — 을 정의하지만, 디자인 시스템은 도메인에 관련된 추가 컴포넌트를 정의하는 것이 권장됩니다.

```
## Components
- **Buttons**: 둥근 형태(8px), primary는 브랜드 블루 채우기, secondary는 아웃라인 사용
- **Inputs**: 1px 테두리, surface-variant 배경, 12px 패딩
- **Cards**: 엘리베이션 없음, 1px 아웃라인 테두리, 12px 코너 반경
```

**디자인 토큰:** 컴포넌트 식별자를 서브 토큰 속성 그룹에 매핑하는 `map<string, map<string, string>>`. 토큰 값은 리터럴 값이거나 이전에 정의된 토큰에 대한 참조일 수 있습니다.

**변형(Variants).** 컴포넌트는 다른 UI 상태(hover, active, pressed)에 대한 변형을 가질 수 있습니다. 변형은 관련 키 이름을 가진 별도의 컴포넌트 항목으로 정의됩니다.

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-70}"
```

#### 컴포넌트 속성 토큰

| 속성              | 타입       |
| ----------------- | ---------- |
| `backgroundColor` | Color      |
| `textColor`       | Color      |
| `typography`      | Typography |
| `rounded`         | Dimension  |
| `padding`         | Dimension  |
| `size`            | Dimension  |
| `height`          | Dimension  |
| `width`           | Dimension  |

### Do's and Don'ts (해야 할 것과 하지 말아야 할 것)

실용적인 가이드라인과 흔한 함정입니다. 생성 과정에서 가드레일 역할을 합니다.

```
## Do's and Don'ts
- Do: 화면당 가장 중요한 단일 액션에만 primary 색상을 사용하세요
- Don't: 동일 뷰에서 둥근 모서리와 직각 모서리를 혼용하지 마세요
- Do: WCAG AA 대비율(일반 텍스트 4.5:1)을 유지하세요
- Don't: 하나의 화면에서 두 개 이상의 폰트 가중치를 사용하지 마세요
```

### 알 수 없는 콘텐츠에 대한 소비자 동작

이 스펙은 확장 가능하도록 설계되었습니다. 소비자가 이 명세에서 정의되지 않은 콘텐츠를 만났을 때:

| 시나리오                          | 동작                                       | 예시                                |
| --------------------------------- | ------------------------------------------ | ----------------------------------- |
| 알 수 없는 섹션 제목              | 보존; 에러 발생 안 함                      | `## Iconography`                    |
| 알 수 없는 색상 토큰 이름         | 값이 유효하면 수용                         | `surface-container-high: '#ede7dd'` |
| 알 수 없는 타이포그래피 토큰 이름 | 유효한 타이포그래피로 수용                 | `telemetry-data`                    |
| 알 수 없는 간격 값                | 수용; 유효한 디멘션이 아니면 문자열로 저장 | `grid-columns: '5'`                 |
| 알 수 없는 컴포넌트 속성          | 경고와 함께 수용                           | `borderColor`                       |
| 중복 섹션 제목                    | 에러; 파일 거부                            | 두 개의 `## Colors` 제목            |

### 권장 토큰 이름

다음 이름들은 디자인 시스템 전반에서 일반적으로 사용됩니다. 필수는 아니지만, 일관성을 위한 가이드로 제공됩니다.

**Colors:** `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error`

**Typography:** `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`

**Rounded:** `none`, `sm`, `md`, `lg`, `xl`, `full`

---

## 3. 사용법 — 보기, 편집, 내보내기

Stitch UI에서 디자인 시스템을 다룹니다. 토큰을 확인하고, 값을 조정하고, 프로젝트와 함께 내보냅니다.

### 디자인 시스템 보기

**Design System** 패널을 열어 화면에 적용된 활성 디자인 시스템을 확인합니다. 패널에는 해석된 토큰 — 색상, 폰트, 둥근 정도, 간격, 컴포넌트 패턴 — 이 표시됩니다.

프로젝트에 여러 디자인 시스템이 있는 경우, 패널에는 현재 선택된 화면에 적용된 것이 표시됩니다.

### 기본 디자인 시스템 설정

프로젝트의 모든 향후 화면에 디자인 시스템을 적용하려면 프로젝트 기본값으로 선택합니다. 이 시점 이후에 생성된 새 화면은 자동으로 해당 토큰을 상속합니다.

기존 화면은 소급하여 업데이트되지 않습니다. 기존 화면을 맞추려면 디자인 시스템을 개별적으로 적용하세요.

### Design System 패널을 통한 편집

Design System 패널은 활성 디자인 시스템에 대한 직접 편집을 지원합니다. 여기서 변경한 내용은 구조화된 토큰과 `DESIGN.md` 요약 모두를 업데이트합니다.

편집 가능한 속성:

- **색상 팔레트**: primary, secondary, tertiary, neutral 기본 색상
- **타이포그래피**: headline, body, label 폰트 패밀리
- **둥근 정도**: 코너 반경 스케일

더 세밀한 변경(컴포넌트 가이드라인, do's and don'ts, 개요 내러티브)의 경우 `DESIGN.md` 마크다운을 직접 편집하세요.

### 프로젝트와 함께 내보내기

프로젝트를 내보내면 `DESIGN.md` 파일이 생성된 화면과 함께 zip 파일에 포함됩니다. 이를 통해 다운스트림 소비자(개발자, 다른 디자인 도구, 또는 다른 에이전트)에게 디자인 시스템의 이식 가능한 기록을 제공합니다.

내보낸 `DESIGN.md`는 독립 실행형 문서입니다. 유용하기 위해 Stitch에 의존하지 않습니다.

### Stitch 외부에서 작업하는 경우

`@google/design.md` CLI는 모든 DESIGN.md 파일을 공식 스펙에 대해 검증하고, WCAG 대비율을 확인하며, 토큰을 Tailwind 또는 W3C Design Token 형식으로 내보냅니다. Stitch에서 생성했든 직접 작성했든 모든 DESIGN.md에서 작동합니다.

---

## 4. CLI — CLI로 검증하기

`@google/design.md` CLI는 DESIGN.md 파일을 린팅, 비교(diff), 내보내기하는 도구를 제공하며, 에이전트 처리에 적합한 구조화된 JSON 출력을 생성합니다.

### 주요 기능

CLI는 DESIGN.md 명세에 대한 검증을 가능하게 하며, **8개의 린트 규칙**, 깨진 토큰 참조 감지, WCAG 대비율 확인, 여러 형식으로의 토큰 내보내기를 포함합니다.

### 설치 및 사용법

npm을 통한 설치:

```bash
npm install @google/design.md
```

또는 설치 없이 직접 실행:

```bash
npx @google/design.md lint DESIGN.md
```

명령어는 파일 경로 또는 stdin(`-` 사용)을 받으며, JSON이 기본 출력 형식입니다.

### 주요 명령어

#### Lint

구조적 정확성을 검증하고, 토큰 참조를 해석하며, 심각도 수준(warning, info, error)과 함께 결과를 보고합니다.

#### Diff

두 DESIGN.md 버전을 비교하여 추가, 제거, 수정된 토큰을 감지하고 error/warning 수의 회귀를 표시합니다.

#### Export

토큰을 Tailwind CSS 설정 객체 또는 W3C Design Tokens Format 호환 `tokens.json` 파일로 변환합니다.

#### Spec

DESIGN.md 형식 명세를 출력하며, 선택적으로 마크다운 또는 JSON 형식의 린팅 규칙을 포함합니다.

### 프로그래밍 방식 접근

린터는 TypeScript 라이브러리로도 사용 가능하며, 결과, 요약 통계, 해석된 디자인 시스템 상태, 생성된 Tailwind 설정에 프로그래밍 방식으로 접근하는 메서드를 노출합니다.

---

## 5. 린팅 규칙

`@google/design.md` 린터는 DESIGN.md 파일에 대해 **8개의 규칙**을 적용합니다. 각 규칙은 **error**(종료 코드 1), **warning**, 또는 **info** 심각도 수준의 결과를 생성합니다.

### broken-ref

**심각도:** error

`{path.to.token}`과 같은 토큰 참조가 정의된 토큰으로 해석되지 않는 경우와, 알 수 없는 컴포넌트 서브 토큰 속성을 식별합니다.

**트리거:**

- 컴포넌트가 존재하지 않는 토큰 경로를 참조
- 인식되지 않는 속성 이름 사용 (유효한 이름: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`)

**예시:** `error  components.button-primary  참조 {colors.accent}가 정의된 토큰으로 해석되지 않습니다.`

**수정:** 누락된 토큰을 정의하거나 참조 경로를 수정합니다.

### missing-primary

**심각도:** warning

색상은 존재하지만 `primary` 토큰이 없는 경우 경고하며, 이는 팔레트 제어를 제한합니다.

**트리거:** `colors` 섹션에 항목이 있지만 `primary`로 명명된 것이 없음

**예시:** `warning  colors  'primary' 색상이 정의되지 않았습니다. 에이전트가 주요 색상을 자동 생성합니다...`

**수정:** colors에 `primary` 항목을 추가합니다.

### contrast-ratio

**심각도:** warning

컴포넌트의 `backgroundColor`/`textColor` 쌍에 대해 WCAG AA 최소 4.5:1 대비율을 확인합니다.

**트리거:** 컴포넌트가 두 색상 모두 정의하고 비율이 4.5:1 미만

**예시:** `warning  components.card-dark  backgroundColor (#333333) 위의 textColor (#999999)의 대비율이 3.48:1입니다...`

**수정:** 4.5:1 최소값을 충족하도록 색상을 조정합니다.

### orphaned-tokens

**심각도:** warning

정의되었지만 컴포넌트에서 한 번도 참조되지 않는 색상 토큰을 식별합니다.

**트리거:** `colors`에 색상이 존재하지만 어떤 컴포넌트도 사용하지 않음 (최소 하나의 컴포넌트 필요)

**예시:** `warning  colors.tertiary  'tertiary'가 정의되었지만 참조되지 않습니다...`

**수정:** 컴포넌트에서 토큰을 참조하거나 제거합니다.

### missing-typography

**심각도:** warning

색상은 존재하지만 타이포그래피 토큰이 없어 에이전트가 기본값을 사용하게 될 때 경고합니다.

**트리거:** `colors`에 항목이 있고 `typography` 섹션이 비어있음

**예시:** `warning  typography  타이포그래피 토큰이 정의되지 않았습니다. 에이전트가 기본 폰트를 사용합니다...`

**수정:** `body-md`와 같은 타이포그래피 토큰을 추가합니다.

### section-order

**심각도:** warning

정규 순서를 적용합니다: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.

**트리거:** 인식된 섹션이 그 앞에 와야 할 섹션보다 먼저 나타남

**예시:** `warning  'Components' 섹션이 'Typography'보다 앞에 나타나며, 이는 순서에 맞지 않습니다...`

**수정:** 명세에 맞게 섹션 순서를 재배치합니다.

### missing-sections

**심각도:** info

다른 토큰이 존재하는 동안 선택적 섹션(`spacing`, `rounded`)이 없는 경우 알려줍니다.

**트리거:** `colors`가 정의되었지만 `spacing` 또는 `rounded`가 없음

**예시:** `info  spacing  'spacing' 섹션이 정의되지 않았습니다. 레이아웃 간격이 폴백됩니다...`

**수정:** 명시적 제어를 위해 `spacing` 또는 `rounded`를 추가합니다.

### token-summary

**심각도:** info

섹션별 토큰 수에 대한 정보성 요약입니다.

**예시:** `info  디자인 시스템이 4개의 색상, 3개의 타이포그래피 스케일, 2개의 라운딩 레벨을 정의합니다...`

---

### 규칙 요약 표

| 규칙               | 심각도  | 초점                                   |
| ------------------ | ------- | -------------------------------------- |
| broken-ref         | error   | 해석되지 않는 참조; 유효하지 않은 속성 |
| missing-primary    | warning | primary 토큰이 없는 색상               |
| contrast-ratio     | warning | WCAG AA 준수 (4.5:1)                   |
| orphaned-tokens    | warning | 사용되지 않는 색상 토큰                |
| missing-typography | warning | 타이포그래피 없는 색상                 |
| section-order      | warning | 정규 섹션 순서                         |
| missing-sections   | info    | 선택적 토큰 섹션 부재                  |
| token-summary      | info    | 토큰 수 보고                           |
