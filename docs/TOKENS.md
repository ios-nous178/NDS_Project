# Design Tokens

이 문서는 Figma Design Guide 페이지(`430:4212`)에서 추출한 디자인 토큰 정의서입니다.

Figma 원본: https://www.figma.com/design/4Q1kbp7e38CH8DXQPiEi0D?node-id=430-4212

---

# 1. Color Tokens

## 1-1. Neutral (회색 계열)

| 단계 | HEX       | CSS Variable             | 용도       |
| ---- | --------- | ------------------------ | ---------- |
| 1000 | `#000000` | `--neutral/1000`         | Pure black |
| 900  | `#111111` | `--neutral/900(black)`   |            |
| 800  | `#383838` | `--neutral/800(text,ic)` | Text, Icon |
| 700  | `#666666` | `--neutral/700`          |            |
| 600  | `#777777` | `--neutral/600`          |            |
| 500  | `#999999` | `--neutral/500`          | Disabled   |
| 400  | `#C7C7C7` | `--neutral/400`          |            |
| 300  | `#D8D8D8` | `--neutral/300`          |            |
| 200  | `#ECECEC` | `--neutral/200`          |            |
| 100  | `#F5F5F5` | `--neutral/100`          |            |
| 50   | `#FAFAFA` | `--neutral/50`           |            |
| 00   | `#FFFFFF` | `--neutral/00(white)`    | Pure white |

## 1-2. Cool Gray

| 단계 | HEX       | CSS Variable         | 용도       |
| ---- | --------- | -------------------- | ---------- |
| 600  | `#4E5462` |                      |            |
| 500  | `#6C7280` | `--cool_gray/500`    |            |
| 400  | `#9CA2AE` | `--cool_gray/400`    |            |
| 300  | `#D2D5D9` | `--cool_gray/300`    |            |
| 200  | `#E6E7EB` | `--cool_gray/200`    |            |
| 100  | `#F3F4F6` | `--cool_gray/100`    | BG         |
| 50   | `#F8F9FB` | `--cool_gray/50(bg)` | BG_lighter |

## 1-3. Primary / Blue (주 색상)

| 단계    | HEX           | CSS Variable           | 용도       |
| ------- | ------------- | ---------------------- | ---------- |
| 800     | `#1B65BA`     | `--palette/blue/800`   | Deep       |
| 600     | `#017EE4`     | `--palette/blue/600`   | Hover      |
| **500** | **`#2B96ED`** | **`--primary/main`**   | **Main**   |
| 400     | `#47A5F0`     | `--palette/blue/400`   |            |
| 300     | `#67B5F2`     | `--palette/blue/300`   |            |
| 200     | `#91CAF6`     | `--primary/lighter`    | Lighter    |
| 100     | `#E3F2FC`     | `--primary/bg`         | BG         |
| 50      | `#F1F8FD`     | `--primary/bg_lighter` | BG Lighter |

## 1-4. Secondary / Magenta (서브 색상)

| 단계    | HEX           | CSS Variable             | 용도       |
| ------- | ------------- | ------------------------ | ---------- |
| 800     | `#C30058`     | `--palette/magenta/800`  | Deep       |
| 600     | `#EA005F`     | `--palette/magenta/600`  |            |
| **500** | **`#ED2E77`** | **`--secondary/sub`**    | **Sub**    |
| 300     | `#F15890`     | `--palette/magenta/300`  |            |
| 200     | `#F8B8CF`     | `--secondary/lighter`    | Lighter    |
| 100     | `#FCE3EC`     | `--secondary/bg`         | BG         |
| 50      | `#FDF1F5`     | `--secondary/bg_lighter` | BG Lighter |

## 1-5. Yellow (Caution)

| 단계    | HEX           | CSS Variable                        | 용도        |
| ------- | ------------- | ----------------------------------- | ----------- |
| 600     | `#FFA100`     | `--palette/yellow/600(text)`        | Text        |
| **500** | **`#FFC303`** | **`--palette/yellow/500(caution)`** | **Caution** |
| 400     | `#FFC303`     | `--palette/yellow/400`              |             |
| 300     | `#FFD84F`     | `--palette/yellow/300`              |             |
| 200     | `#FFE282`     | `--palette/yellow/200`              |             |
| 100     | `#FFEDB3`     | `--palette/yellow/100`              |             |
| 50      | `#FFFAE8`     | `--palette/yellow/50(bg)`           | BG          |

## 1-6. Red (Error)

| 단계    | HEX           | CSS Variable                   | 용도      |
| ------- | ------------- | ------------------------------ | --------- |
| **500** | **`#F13F00`** | **`--palette/red/500(error)`** | **Error** |
| 50      | `#FEE9E6`     | `--palette/red/50(bg)`         | BG        |

## 1-7. Green (Success)

| 단계    | HEX           | CSS Variable                       | 용도        |
| ------- | ------------- | ---------------------------------- | ----------- |
| 500     | `#00A07C`     | `--palette/green/500`              |             |
| 400     | `#00B08F`     | `--palette/green/400`              |             |
| **300** | **`#13BFA2`** | **`--palette/green/300(success)`** | **Success** |
| 200     | `#6FD2BD`     | `--palette/green/200`              |             |
| 100     | `#AAE3D7`     | `--palette/green/100`              |             |
| 50      | `#E5F7F4`     | `--palette/green/50(bg)`           | BG          |

## 1-8. Semantic Color 요약

| 역할          | Variable                        | HEX       |
| ------------- | ------------------------------- | --------- |
| Primary Main  | `--primary/main`                | `#2B96ED` |
| Primary Hover | `--palette/blue/600`            | `#017EE4` |
| Primary BG    | `--primary/bg`                  | `#E3F2FC` |
| Secondary Sub | `--secondary/sub`               | `#ED2E77` |
| Secondary BG  | `--secondary/bg`                | `#FCE3EC` |
| Error         | `--palette/red/500(error)`      | `#F13F00` |
| Error BG      | `--palette/red/50(bg)`          | `#FEE9E6` |
| Caution       | `--palette/yellow/500(caution)` | `#FFC303` |
| Caution BG    | `--palette/yellow/50(bg)`       | `#FFFAE8` |
| Success       | `--palette/green/300(success)`  | `#13BFA2` |
| Success BG    | `--palette/green/50(bg)`        | `#E5F7F4` |
| Text Default  | `--neutral/800(text,ic)`        | `#383838` |
| Text Disabled | `--neutral/500`                 | `#999999` |
| BG White      | `--neutral/00(white)`           | `#FFFFFF` |
| BG Light      | `--neutral/50`                  | `#FAFAFA` |

---

# 2. Typography Tokens

## 2-1. Font Family

| 플랫폼        | 폰트        |
| ------------- | ----------- |
| Web           | Pretendard  |
| Android / iOS | System Font |

## 2-2. Font Weight

Bold / Medium / Regular 내에서 유동적으로 사용

## 2-3. Type Scale

| Style      | Size | Line Height | Letter Spacing | Weight (실측) |
| ---------- | ---- | ----------- | -------------- | ------------- |
| Display    | 40px | 52px        | 0em            | Bold (700)    |
| Headline 1 | 36px | 48px        | 0em            | Bold (700)    |
| Headline 2 | 28px | 38px        | 0em            | Bold (700)    |
| Headline 3 | 24px | 32px        | 0em            | Bold (700)    |
| Headline 4 | 20px | 28px        | 0em            | Bold (700)    |
| Headline 5 | 18px | 26px        | 0em            | Bold (700)    |
| Body 1     | 16px | 24px        | 0em            | Medium (500)  |
| Body 2     | 15px | 22px        | 0em            | Medium (500)  |
| Body 3     | 14px | 20px        | 0em            | Regular (400) |
| Caption 1  | 13px | 18px        | 0em            | Regular (400) |
| Caption 2  | 12px | 18px        | 0em            | Regular (400) |
| Label      | 11px | 18px        | 0em            | Regular (400) |

> Figma 스타일명 패턴: `EAP/Headline 4`, `EAP/Body 1` 등

---

# 3. Spacing Tokens (실측)

Figma 팝업 가이드 섹션에서 spacing이 빨간색/보라색 표기로 명시되어 있음.

## 3-1. Base Scale (실측 종합)

| Token        | Value | 사용처                                                                              |
| ------------ | ----- | ----------------------------------------------------------------------------------- |
| `spacing-2`  | 2px   | BottomBar 아이콘-텍스트 gap                                                         |
| `spacing-4`  | 4px   | 타이포그래피 라벨 내부 gap                                                          |
| `spacing-7`  | 7px   | BottomBar divider-content gap                                                       |
| `spacing-8`  | 8px   | Modal Title-Description gap, 버튼 간 gap, Color swatch gap                          |
| `spacing-10` | 10px  | BottomBar 좌우 내부 gap                                                             |
| `spacing-12` | 12px  | Button S/XS padding-y 근사, TextInput 내부 gap                                      |
| `spacing-16` | 16px  | Modal 좌우 padding, Modal 하단 padding, AppBar 좌우 padding, List item 좌측 padding |
| `spacing-20` | 20px  | TextInput 섹션 간 gap                                                               |
| `spacing-24` | 24px  | Modal text-button gap, Heading 섹션 gap                                             |
| `spacing-28` | 28px  | Modal 상단 padding                                                                  |
| `spacing-36` | 36px  | TextInput 블록 간 gap                                                               |
| `spacing-48` | 48px  | 헤더 캡션 간 gap                                                                    |
| `spacing-64` | 64px  | 페이지 섹션 padding, 섹션 간 gap                                                    |
| `spacing-80` | 80px  | 섹션 내 컬럼 간 gap                                                                 |

## 3-2. 주요 Spacing 패턴 (실측)

### Button 내부 Padding

| Size                   | padding-x | padding-y | Font Size | Line Height |
| ---------------------- | --------- | --------- | --------- | ----------- |
| Large (L, 48px)        | 16px      | 12px      | 16px      | 24px        |
| Medium (M, 44px)       | 16px      | 10px      | 15px      | 22px        |
| Small (S, 42px)        | 12px      | 11px      | 14px      | 20px        |
| Extra-Small (XS, 38px) | 12px      | 11px      | 13px      | 18px        |
| Field (48px)           | 16px      | 13px      | 15px      | 22px        |

### Modal 내부 Spacing

| 위치                    | 값    |
| ----------------------- | ----- |
| padding-top             | 28px  |
| padding-left/right      | 16px  |
| padding-bottom          | 16px  |
| title ↔ description gap | 8px   |
| text_info ↔ button gap  | 24px  |
| 버튼 간 gap (2-button)  | 8px   |
| 최대 가로 폭            | 300px |

### AppBar

| 속성                      | 값                           |
| ------------------------- | ---------------------------- |
| height                    | 52px                         |
| padding-left              | 16px                         |
| padding-right (첫 아이콘) | 16px                         |
| 아이콘 간 간격            | 40px (center-to-center)      |
| title font                | Headline 4 (20px/28px, Bold) |

### BottomBar

| 속성                          | 값                        |
| ----------------------------- | ------------------------- |
| height                        | 56px                      |
| padding-top                   | 8px                       |
| padding-bottom                | 6px                       |
| padding-left/right (per item) | 33px                      |
| icon-label gap                | 2px                       |
| divider height                | 1px                       |
| label font                    | 11px, Regular             |
| active text color             | `--neutral/800` (#383838) |
| default text color            | `--neutral/700` (#666666) |

### TextInput

| 속성                   | 값                         |
| ---------------------- | -------------------------- |
| height                 | 48px                       |
| border                 | 1px solid                  |
| border-color (default) | `#D8D8D8` (neutral/300)    |
| border-color (focus)   | `--primary/main` (#2B96ED) |
| border-radius          | 8px                        |
| padding-left           | 16px                       |
| bg (editable)          | `#FFFFFF` (neutral/00)     |
| bg (readonly)          | `#FAFAFA` (neutral/50)     |
| placeholder color      | `--neutral/500` (#999999)  |
| text color             | `--neutral/800` (#383838)  |
| label font             | 14px, Medium               |
| input font             | 15px, Regular              |

### List Item

| 속성         | 값                        |
| ------------ | ------------------------- |
| bg           | white                     |
| padding-left | 16px                      |
| text font    | 14px, Regular             |
| text color   | `--neutral/500` (#999999) |

---

# 4. Sizing Tokens (실측)

## 4-1. Button Height

| Size             | Height |
| ---------------- | ------ |
| Large (L)        | 48px   |
| Medium (M)       | 44px   |
| Small (S)        | 42px   |
| Extra-Small (XS) | 38px   |
| Field            | 48px   |

## 4-2. Icon Size

| Size    | Value   |
| ------- | ------- |
| Default | 24 x 24 |

## 4-3. System Component Height

| Component | Height |
| --------- | ------ |
| AppBar    | 52px   |
| BottomBar | 56px   |
| TextInput | 48px   |

## 4-4. Border Radius (실측)

| 용도               | Value         | 근거                        |
| ------------------ | ------------- | --------------------------- |
| Button (전 사이즈) | 8px           | 전 variant 공통             |
| TextInput          | 8px           | default/focus/readonly 공통 |
| Modal              | 8px           | 팝업 컨테이너               |
| Toggle             | pill (15.5px) | 51x31 크기, 완전 원형 트랙  |
| Radio              | 12px (원형)   | 24x24, 완전 원형            |
| Checkbox           | 실측 불가     | 추가 확인 필요              |

> 결론: **8px이 기본 radius**로 거의 모든 컴포넌트에 적용됨.

## 4-5. Border Width

| 용도                      | Value |
| ------------------------- | ----- |
| Outlined Button           | 1px   |
| TextInput                 | 1px   |
| Divider (BottomBar 상단)  | 1px   |
| Divider (Typography 섹션) | 1px   |

---

# 5. Component Tokens (실측 보강)

---

## 5-1. Button (실측)

### Variant / State / Color

| Variant      | 설명                     |
| ------------ | ------------------------ |
| Solid        | 배경 채움                |
| Outlined     | 테두리만                 |
| Outlined_sub | 서브 테두리 (S 사이즈만) |

### 상세 스타일 (실측)

| 조건                       | bg                     | text-color                 | border                     |
| -------------------------- | ---------------------- | -------------------------- | -------------------------- |
| Solid + enabled + first    | `#2B96ED`              | white                      | none                       |
| Solid + disabled + first   | `--neutral/500` (#999) | white                      | none                       |
| Solid + enabled + second   | `#ED2E77`              | white                      | none                       |
| Outlined + enabled + first | white                  | `--primary/main` (#2B96ED) | 1px solid `--primary/main` |
| Outlined + disabled        | `--neutral/500` bg     | white                      | none                       |

### 전체 조합

| Variant      | Size                   | State                    | Color         |
| ------------ | ---------------------- | ------------------------ | ------------- |
| Solid        | L / M / S / XS / Field | enabled, hover, disabled | first, second |
| Outlined     | L / M / S / XS / Field | enabled, disabled        | first         |
| Outlined_sub | S                      | enabled                  | first         |

### Button Font 매핑 (실측)

| Size    | Font Size | Line Height | Weight                  |
| ------- | --------- | ----------- | ----------------------- |
| L (48)  | 16px      | 24px        | Bold (= Body 1 Bold)    |
| M (44)  | 15px      | 22px        | Bold (= Body 2 Bold)    |
| S (42)  | 14px      | 20px        | Bold (= Body 3 Bold)    |
| XS (38) | 13px      | 18px        | Bold (= Caption 1 Bold) |
| Field   | 15px      | 22px        | Bold (= Body 2 Bold)    |

## 5-2. AppBar (실측)

| 속성           | 값                                    |
| -------------- | ------------------------------------- |
| height         | 52px                                  |
| bg             | white                                 |
| title          | Headline 4 (20px/28px, Bold, #111111) |
| padding-left   | 16px                                  |
| icon 우측 시작 | right 16px                            |
| icon 간격      | 40px center-to-center                 |

| Variant | Right Area                        |
| ------- | --------------------------------- |
| main    | 3icons, 2icons, 1icon             |
| sub     | 3icons, 2icons, 1icon, none, text |

## 5-3. BottomBar (실측)

| 속성                | 값                               |
| ------------------- | -------------------------------- |
| height              | 56px                             |
| bg                  | white                            |
| divider             | 1px, `--neutral/200` (#ECECEC)   |
| icon size           | 24x24                            |
| label font          | 11px, Regular (Noto Sans CJK KR) |
| active label color  | `--neutral/800` (#383838)        |
| default label color | `--neutral/700` (#666666)        |

| Property 1 | Property 2      |
| ---------- | --------------- |
| 4fixed     | -               |
| 5fixed     | -               |
| element    | default, active |

## 5-4. Control (실측)

### Toggle

| 속성         | 값            |
| ------------ | ------------- |
| size         | 51 x 31       |
| track radius | pill (15.5px) |
| knob         | 원형          |
| state        | on, off       |

### Radio

| 속성  | 값      |
| ----- | ------- |
| size  | 24 x 24 |
| shape | 원형    |
| state | on, off |

## 5-5. Text Input (실측)

### State별 스타일

| State                  | bg                       | border-color     | text-color      | placeholder-color |
| ---------------------- | ------------------------ | ---------------- | --------------- | ----------------- |
| 입력 가능 (default)    | `#FFFFFF`                | `#D8D8D8`        | `--neutral/800` | `--neutral/500`   |
| 수정 불가 (readonly)   | `#FAFAFA`                | `#D8D8D8`        | `--neutral/500` | `--neutral/500`   |
| 입력 완료 (filled)     | `#FFFFFF`                | `#D8D8D8`        | `--neutral/800` | -                 |
| 입력 중 (typing/focus) | `#FFFFFF`                | `--primary/main` | `--neutral/800` | -                 |
| 선택 영역 (selection)  | `--primary/bg` (#E3F2FC) | -                | -               | -                 |

### 구조

| 속성                  | 값                             |
| --------------------- | ------------------------------ |
| height                | 48px                           |
| border-radius         | 8px                            |
| border-width          | 1px                            |
| padding-left          | 16px                           |
| label 위치            | input 상단 별도 영역           |
| label font            | 14px, Medium, `--neutral/800`  |
| input font            | 15px, Regular                  |
| clear 아이콘 (typing) | inputdelete, right 16px, 24x24 |

### input + Btn 조합

| 속성        | 값                  |
| ----------- | ------------------- |
| input 가로  | 260px               |
| button 위치 | input 우측 8px 간격 |
| button size | Field (48px height) |

## 5-6. Modal / Popup (실측)

### Custom Popup 가이드

- 화면 양옆 마진: **30px 고정**
- 가로 최대 넓이: **max-width 400px**
- 실측 팝업 너비: 300px

### Modal 내부 Spacing (Figma 레드라인 실측)

```
┌─────────────────────────────┐
│        28px (top)           │
│  ┌───────────────────────┐  │
│  │ Title (16px Bold)     │  │ 16px
│  │        8px gap        │  │ (left/right)
│  │ Desc (14px Regular)   │  │
│  └───────────────────────┘  │
│        24px gap             │
│  ┌───────────────────────┐  │
│  │ Button(s) h=44px      │  │
│  └───────────────────────┘  │
│        16px (bottom)        │
└─────────────────────────────┘
```

### Modal 유형

| 유형   | 구성                                            |
| ------ | ----------------------------------------------- |
| Type 1 | Title + Description + 2 Buttons (Cancel/Action) |
| Type 2 | Title + Description + 1 Button (Action)         |
| Type 3 | Description only + 2 Buttons                    |
| Type 4 | Description only + 1 Button (full-width)        |

### Modal 버튼 스타일

| 버튼        | bg                     | text             | width                 |
| ----------- | ---------------------- | ---------------- | --------------------- |
| Action      | `#2B96ED`              | white, 15px Bold | 130px 또는 full-width |
| Cancel      | `--neutral/500` (#999) | white, 15px Bold | 130px                 |
| 버튼 간 gap | 8px                    |                  |                       |

## 5-7. List (실측)

### list/header

| 속성         | 값                               |
| ------------ | -------------------------------- |
| bg           | white                            |
| padding-left | 16px                             |
| text         | 14px, Regular (Noto Sans CJK KR) |
| text color   | `#999999` (neutral/500)          |
| 수직 정렬    | center                           |

### list/text+icon

- header와 유사한 구조
- 우측에 아이콘(chevron 등) 배치
- 여러 변형 존재

## 5-8. Divider (실측)

| 속성                    | 값                        |
| ----------------------- | ------------------------- |
| height                  | 1px                       |
| color (Typography 섹션) | `--neutral/100` (#F5F5F5) |
| color (BottomBar)       | `--neutral/200` (#ECECEC) |

---

# 6. Icon Tokens

## 6-1. Naming Convention

```
ic-eap-{컴포넌트명}-{type}-{state}/{color}/{style}
```

Figma Component Name

```
[Icon/컴포넌트명] : 프로퍼티 [type-state/color/theme]
```

## 6-2. Properties

- state: default / active
- color: black, darkgray, gray, lightgray ...
- style: filled, outlined

## 6-3. Icon 목록 (56종)

| 카테고리      | 아이콘                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation    | chevron, arrow, navigate, hamburger, close, back                                                                                                           |
| Action        | search, refresh, edit, delete, share, download, link, drag                                                                                                 |
| Control       | control (checkbox/radio), toggle, star, thumb                                                                                                              |
| Media         | play, pause, skip, shuffle, repeat, sleepmode, mymusic, Videocamera, microphone, monitor                                                                   |
| Communication | telephone, comment, siren, info, report                                                                                                                    |
| Status        | eye, block, filter, badge                                                                                                                                  |
| Location      | locate, walk, pin, subway                                                                                                                                  |
| Utility       | setting, time, calendar, camera, bluetooth, web, inputdelete, addlist, center, decoration, facility, operator, recent, reward, test, testResult, Reacation |

---

# 7. Image Asset Tokens

## 7-1. Naming Convention

```
img_[컴포넌트명]
```

Slice 이름

```
img-[컴포넌트명]-type-state/color/style
```

## 7-2. Properties

- state: default / active (or selected)
- style: filled, outlined

## 7-3. 용도별 분류

| 용도        | type                                                        |
| ----------- | ----------------------------------------------------------- |
| 심리검사    | test (Psych, personality, depression, selfesteem, mbti ...) |
| 상담        | consult                                                     |
| 원형 이미지 | -                                                           |

스타일: 둥근 형태의 Flat Solid Style, EAP 컬러 팔레트 기반

---

# 8. 추가 확인 필요 사항

- [x] ~~Border Radius 토큰 체계~~ → **8px 기본**, Toggle은 pill, Radio는 원형
- [x] ~~Spacing 토큰 체계~~ → 섹션 3에 실측 정리 완료
- [ ] Shadow / Elevation 토큰 — Figma에서 shadow가 적용된 컴포넌트 미발견. 실제 프로젝트 코드에서 확인 필요
- [x] ~~Text Input 상세 variant~~ → Default / Readonly / Filled / Typing(Focus) 4가지 상태 확인
- [x] ~~Modal 상세 variant~~ → 4가지 유형 (Title+Desc+2Btn, Title+Desc+1Btn, Desc+2Btn, Desc+1Btn)
- [x] ~~List 상세 variant~~ → header / text+icon 확인
- [ ] Cool Gray 600 (`#4E5462`)의 CSS Variable 누락 여부 — Figma에서 변수 미등록 상태
- [ ] Yellow 400과 Yellow 500 동일 HEX (`#FFC303`) — 의도적인지 디자이너 확인 필요
- [ ] Checkbox 컴포넌트 — Icon/control에 포함되어 있으나 상세 실측 미완
- [ ] 실제 프로젝트 코드의 spacing과 Figma 실측값 일치 여부 검증 필요

---

# 9. 향후 보강 사항

- [ ] Shadow / Elevation 토큰 — 실제 프로젝트 코드에서 box-shadow 패턴 추출 후 토큰화
- [ ] Checkbox 컴포넌트 상세 실측 (size, border, check mark style, color)
- [ ] BottomSheet 컴포넌트 — Figma 내 다른 페이지에 존재할 수 있음
- [ ] Toast / Snackbar 컴포넌트 — 현재 Design Guide 페이지에 미포함
- [ ] Badge / Chip / Tag 컴포넌트
- [ ] Skeleton / Loading 상태 패턴
- [ ] Dark Mode 컬러 토큰 (필요 시)
- [ ] Motion / Animation 토큰 (transition duration, easing 등)
- [ ] Z-index 체계 정의 (Modal, Toast, BottomSheet 등 레이어 순서)
- [ ] Breakpoint 토큰 — WebView 환경 기준 반응형 분기점
- [ ] 실제 프로젝트 코드에서 사용 중인 spacing/color 값과 Figma 토큰 간 diff 분석
