---
sidebar_position: 10
title: 레이아웃 & 간격 (포터블 가이드)
---

# 레이아웃 & 간격 — 포터블 가이드

Nudge DS 토큰을 import 할 수 없는 환경(외부 SaaS, 일회성 랜딩, 디자이너 핸드오프, 다른 DS 위 보조 작업 등)에서도 **같은 룰**을 적용하기 위한 표준 px 표입니다.

- 원본 정의: `DESIGN.md` (`spacing` / `gap` / `inset` / `grid` / `sizing`)
- DS 토큰 가이드: `pattern:semantic-spacing`, `pattern:action-row`, `pattern:surface-layer`, `principles`
- 이 문서는 위 토큰을 raw px 로 풀어놓은 것 — **값과 의도가 정확히 동일**합니다. 토큰만 못 쓸 뿐, 룰은 바뀌지 않습니다.

---

## 0. 절대 규칙 (Hard Rules)

1. **4pt grid** — 모든 간격은 4의 배수에서 시작. 예외(6/10/14/18/28 등)는 아래 표에 등재된 값만 허용.
2. **임의 px 금지** — `5 / 7 / 9 / 11 / 13 / 15 / 17 / 19 / 21 / 22 / 25 / 26 / 30(레거시)` 같은 4pt 위반·미등재 값 사용 금지.
3. **Gap 자리에 Inset, Inset 자리에 Gap 금지** — `padding` 과 `gap/margin` 은 다른 표에서 값을 가져온다.
4. **한 의도 = 한 값** — 같은 화면 안에서 같은 의미의 간격은 같은 px 로. 카드들의 padding 이 16/18/20 으로 섞이면 무조건 위반.
5. **터치 타겟 ≥ 44px** — 모바일에서 클릭 가능한 컨트롤의 hit area 최소값.

---

## 1. Gap — 요소 간 거리 (의도 기반)

`flex-gap` / `grid-gap` / `margin` 으로 “두 요소 사이의 공간” 을 만들 때 사용합니다.

| 의도 | px | 사용처 | DS 토큰(참고) |
| --- | --- | --- | --- |
| tight | **4** | Chip · Badge · 인라인 라벨 그룹 | `--semantic-gap-tight` |
| default ★ | **10** | 표준 컴포넌트 gap (가장 자주) | `--semantic-gap-default` |
| comfortable | **12** | 폼 필드 · 세그먼트 · 라벨↔필드 | `--semantic-gap-comfortable` |
| loose | **16** | 컴포넌트 ↔ 컴포넌트 | `--semantic-gap-loose` |
| wide | **24** | 큰 영역 ↔ 큰 영역, 섹션 구분 | `--semantic-gap-wide` |

> 모호하면 표준값 **10px** 을 우선.

### Gap / Title — 헤딩 ↔ 서브타이틀 (Figma TitleGapGuide 실측)

| 헤딩 레벨 | 폰트 | px |
| --- | --- | --- |
| h1 (Hero, 36 Bold) | 36/44 | **12** |
| h2 (큰 섹션·다이얼로그, 28 Bold) | 28/36 | **12** |
| h3 (페이지 헤더, 24 Bold) | 24/32 | **12** |
| h4 ★ (카드 헤딩, 20 Bold) | 20/28 | **6** |
| h5 ★ (서브 헤딩, 18 Bold) | 18/26 | **8** |

---

## 2. Inset — 컨테이너 내부 여백 (사용처 기반)

`padding` 으로 “상자 안쪽 여백” 을 만들 때 사용합니다.

| 사용처 | px | 비고 | DS 토큰(참고) |
| --- | --- | --- | --- |
| Chip · Badge 내부 | **8** | 작은 인라인 컨테이너 | `--semantic-inset-chip` |
| Input · 작은 컨테이너 | **12** | 입력 필드 padding | `--semantic-inset-input` |
| Card ★ | **16** | 표준 카드 padding | `--semantic-inset-card` |
| Card Large | **20** | 큰 카드 · 강조 박스 | `--semantic-inset-card-large` |
| Modal · 통계 박스 | **24** | Modal Body, KPI Box | `--semantic-inset-modal` |

> 모호하면 카드 표준 **16px**.

### 비대칭 inset (예외적으로 허용되는 패턴)

| 컴포넌트 | top · sides · bottom |
| --- | --- |
| Popup Card 본문 | **28 · 16 · 16** (Figma 실측) |
| Modal Header | **16 · 20** (세로 16, 좌우 20) |
| Modal Footer (custom) | **12 · 20** |

---

## 3. Spacing 원시값 (참고 — 직접 쓰지 말 것)

위 Gap/Inset 표가 “어떤 px 를 써야 하는지” 를 결정합니다. 아래 표는 “허용된 px 목록” 일 뿐, **이 표에서 임의로 골라 쓰지 마세요**. (Gap/Inset 표에 없는 값은 컴포넌트가 자체적으로 쓰는 값입니다.)

```
0 · 1 · 2 · 4 · 6 · 7 · 8 · 10 · 11 · 12 · 13 · 14
16 · 18 · 20 · 24 · 28 · 32 · 36 · 40 · 48 · 64 · 80
```

---

## 4. Layout — 페이지 골격

### Grid

| 환경 | columns | 좌우 margin | gutter | 콘텐츠 max |
| --- | --- | --- | --- | --- |
| Mobile (360 기준) | 4 | **16** | 8 | 328 (= 360 − 16·2) |
| Desktop (1920 기준) | 12 | **360** (1200 이하에서 최소 **40**) | 24 | **1200** |

### 페이지 마진 룰

- 모바일: 좌우 **16px** 고정. iOS 375 에서도 16 유지(콘텐츠 자연 확장).
- 데스크톱: 콘텐츠 영역 max **1200px**, 좌우 자동 분배. 뷰포트가 1200 이하로 좁아지면 좌우 마진 최소 **40px** 까지만 줄임.

### 고정 높이

| 영역 | px |
| --- | --- |
| AppBar (상단) | **52** |
| BottomBar (하단 탭) | **56** |
| Tabs · Line (mobile / pc) | 50 / 56 |
| Tabs · Chip (mobile / pc) | 36 / 44 |
| Tabs · Segment (pc) | 56 |
| Input · default / field / compact | 48 / 44 / 40 |

---

## 5. Action Row — 한 줄에 여러 컨트롤이 놓일 때

헤더 우측 액션 row, 필터 바, 카드 footer 처럼 **이종 컴포넌트가 한 줄에 나란히** 놓이는 경우 height 를 한 bucket 으로 통일합니다. 1–2px 차이도 시각적으로 어긋나 보입니다.

| Bucket | px | 언제 |
| --- | --- | --- |
| 작은 | **38–42** | 정보 밀도 높은 어드민·표 상단 도구 모음 |
| 기본 ★ | **44** | 헤더 우측 액션 · 필터 바 · 카드 footer (Button.md / Input.field / Tabs.chip pc) |
| 큰 | **48** | AppBar 아래 큰 액션 row, Primary CTA 가 포함된 row |
| 강조 | **52** | Hero · 가장 큰 CTA |

**룰**

- 한 row 안의 모든 컨트롤은 같은 bucket. 4px 차이도 정렬 깨짐.
- row 안 컨트롤 간 gap 은 **8 / 12 / 16** 중 하나.
- `align-items: center` 만 사용. baseline 정렬 금지(아이콘+텍스트 혼합 row 에서 어긋남).
- `height: 40px` 같은 raw px 로 컴포넌트 자연 높이를 덮어쓰지 말 것 — line-height 가 어긋남.

---

## 6. Button · Input 사이즈 매트릭스

| Button size | height | px(좌우) | py | font | gap |
| --- | --- | --- | --- | --- | --- |
| xl | **52** | 16 | 14 | 16/24 Bold | 8 |
| lg | **48** | 16 | 12 | 16/24 Bold | 8 |
| md ★ | **44** | 24 | 11 | 15/22 Bold | 8 |
| sm | **42** | 16 | 11 | 14/20 Bold | 8 |
| xs | **38** | 16 | 10 | 13/18 Bold | 6 |
| field | **48** | 16 | 13 | (Input 매치) | 8 |

| Input | height | padding | label-gap | radius |
| --- | --- | --- | --- | --- |
| default | **48** | 16 · 13 | — | 8 |
| field | **44** | 16 · 11 | 8 | 8 |
| compact | **40** | 12 · 10 | — | 8 |

---

## 7. Surface Layer — 배경 위계

색이 아니라 **위계** 로 영역을 구분합니다. 색은 의미 전달용으로만.

| Layer | 역할 | 일반적 hex |
| --- | --- | --- |
| L0 surface | 기본 카드/박스 (Card, Info Box) | `#FFFFFF` |
| L1 page | body, 페이지 전체 배경 | `#F8F9FB` |
| L2 subtle | 비활성 영역, 표 헤더, 섹션 분리 | `#F1F3F6` 계열 |
| L3 notice | 의미 전달용 (주의/안내/하이라이트) | brand-subtle / status-* |

**룰**

- 영역 구분은 spacing/border/text 위계로 먼저 해결. 색 배경으로만 구분 금지.
- 한 화면당 brand background 최대 1개. brand bg + brand chip + brand icon 동시 적용 금지(tone-on-tone).
- 모든 영역을 카드로 감싸지 말 것. 카드는 “독립된 정보 단위” 일 때만.

---

## 8. Radius · Border

| 종류 | px |
| --- | --- |
| Radius sm | 4 (Badge SM, 작은 칩) |
| Radius md ★ | 8 (Button, Input, 기본 카드) |
| Radius lg | 12 (큰 카드, 바텀시트) |
| Radius pill | 9999 (Chip, Toggle, Avatar) |
| Border default | 1px |
| Border focus | 2px |

> **둥근 + 각진 코너 한 뷰에서 섞지 말 것.**
> **그림자 + 보더 동시 적용 금지** (이중 계층).

---

## 9. 결정 트리 — “이 자리에 몇 px?”

```
질문: 지금 만드는 간격이 컨테이너 안쪽 여백인가, 두 요소 사이 거리인가?

├─ 안쪽 여백 (padding) → Inset 표 (§2)
│   ├─ Chip / Badge 안           → 8
│   ├─ Input · 작은 컨테이너     → 12
│   ├─ 기본 카드 ★              → 16
│   ├─ 큰 카드 / 강조 박스       → 20
│   └─ Modal / KPI 박스          → 24
│
└─ 두 요소 사이 (gap/margin) → Gap 표 (§1)
    ├─ Chip · Badge 그룹          → 4
    ├─ 컴포넌트 내부 표준 ★      → 10
    ├─ 폼 필드 / 라벨↔필드       → 12
    ├─ 컴포넌트 ↔ 컴포넌트       → 16
    └─ 큰 영역 ↔ 큰 영역          → 24
```

헤딩 ↔ 서브타이틀 간격은 위 트리가 아니라 **§1 Gap/Title 표** (h1/h2/h3 = 12, h4 = 6, h5 = 8) 를 따른다.

---

## 10. 자주 보이는 위반 (즉시 교정)

| 위반 | 교정 |
| --- | --- |
| `padding: 14px` (4pt 위반) | 12 또는 16 으로 라운드 |
| `gap: 18px` (4pt 위반) | 16 또는 20 |
| 카드들이 16/18/20 padding 으로 섞임 | 모두 16 (또는 모두 20) 으로 통일 |
| `<button style="height: 40px">` 를 row 에 끼움 | 같은 row 의 다른 컨트롤과 같은 bucket (44 또는 48) |
| 모든 안내 박스를 다른 pastel bg 로 깔기 | 의미 전달이 있는 1개만 색, 나머지는 surface-default |
| 모든 영역을 카드로 감쌈 | 단순 group/section 은 spacing + h3 + Divider |
| 화살표 아이콘이 “자세히 보기” 버튼마다 반복 | 화면당 1개의 대표 전진 CTA 에만 |
| 둥근 카드 안에 각진 박스 / 그 반대 | 한 뷰포트 안에서 라운드 정책 통일 |
| 보더 + 그림자 동시 적용 | 둘 중 하나만 |
| 다이얼로그 보조 버튼 “취소” | “닫기” |

---

## 11. CSS 변수로 옮길 때 (선택)

토큰이 없어도 프로젝트 루트에서 한 번만 선언해두면 본문은 동일한 API 로 쓸 수 있습니다.

```css
:root {
  /* gap */
  --semantic-gap-tight: 4px;
  --semantic-gap-default: 10px;
  --semantic-gap-comfortable: 12px;
  --semantic-gap-loose: 16px;
  --semantic-gap-wide: 24px;

  /* inset */
  --semantic-inset-chip: 8px;
  --semantic-inset-input: 12px;
  --semantic-inset-card: 16px;
  --semantic-inset-card-large: 20px;
  --semantic-inset-modal: 24px;

  /* layout */
  --appbar-h: 52px;
  --bottombar-h: 56px;
  --content-max: 1200px;
  --content-margin-mobile: 16px;
  --content-margin-desktop-min: 40px;

  /* shape */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 9999px;
}
```

이렇게 두면 본문 코드는 Nudge DS 와 동일하게 `padding: var(--semantic-inset-card)` / `gap: var(--semantic-gap-default)` 형태로 작성할 수 있고, 나중에 DS 로 옮길 때 변환 비용이 거의 없습니다.
