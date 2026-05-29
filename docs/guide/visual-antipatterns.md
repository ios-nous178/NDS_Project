---
sidebar_position: 12
title: 시각 안티패턴
---

<!-- AUTO-GENERATED FILE. SSOT: packages/mcp/src/guides.ts (PATTERN_GUIDES['visual-antipatterns']). Run `pnpm generate:guide-docs` after editing the source. -->

# 시각 안티패턴

1차 목업에서 퀄리티를 떨어뜨리는 대표 시각 안티패턴. 외부 mockup 프로젝트에서는 `get_guide({ topic: "pattern:visual-antipatterns" })` MCP 호출로 동일 본문을 받습니다.
다크패턴(`dark-patterns`) 이 진입·뒤로가기·CTA 라벨 같은 **플로우·사용성** 차원을 다룬다면, 이 문서는 색·표면·타이포·아이콘·대시보드 톤 같은 **시각·스타일** 차원의 안티패턴을 다룹니다.

## 요약

1차 목업에서 퀄리티를 떨어뜨리는 대표 시각 안티패턴. 색·표면·타이포·아이콘·대시보드 톤 다섯 영역으로 묶었다. 플로우/사용성 차원은 별도 — get_guide(\{ topic: 'pattern:dark-patterns' \}) 참고.

## 규칙

### 색·강조

- **Tone-on-Tone Filled 금지** — 연한 primary/blue 배경 위에 같은 계열의 연한 filled tag/badge/box 를 반복하지 않는다. 같은 톤 위 같은 톤은 위계를 만들지 못하고 영역만 흐려진다.
- **Primary 컬러 역할 제한** — Primary 는 CTA · interactive · 핵심 highlight 중 한 가지 역할로만. 배경/CTA/태그/카드/포커스/hover 에 동시에 쓰면 무엇을 클릭해야 할지 신호가 사라진다.
- **로고 컬러 ≠ UI 액센트** — 브랜드 로고의 gradient/accent 색은 로고 표현 전용. 카드 배경, 배지, 버튼 컬러로 재사용하지 않는다.
- **Primary tint 반복 금지** — 한 섹션에서 primary tint 가 배경 · 라벨 · 아이콘 · 카드 surface 로 3회 이상 등장하면 neutral surface + 텍스트 위계로 낮춘다.
- **그라데이션 배경 금지** — linear / radial / conic gradient 배경 모두 사용 금지. 단색 토큰만 사용.
- **Section 구분, 색상 단독 금지** — 영역 구분은 1차 spacing(--semantic-gap-loose/wide) → 2차 Divider/Border → 마지막에 surface tone 순서로. 색만으로 나누면 색맹·저시력 사용자가 구조를 잃는다.

### 표면 (Card / Shadow)

- **Card Everything 금지** — 모든 정보 단위를 카드로 감싸지 않는다. 카드는 '독립된 정보 단위' 일 때만. 단순 group/section 은 spacing + h3 + Divider 로 위계를 만든다. 한 화면에 카드가 5개를 넘으면 80% 이상 안티패턴.
- **카드 안 카드 중첩 금지** — 카드 내부 영역 강조는 surface.section tone 한 단계 또는 inline Chip/Badge 로. nested Card 는 위계 표현 도구가 아니다.
- **장식용 그림자 금지** — 떠 있지 않아야 할 요소(인라인 리스트 · 일반 카드 · 기본 입력)에 elevation/shadow 적용 금지. Shadow 는 floating UI(Modal · Popup · Dropdown · BottomSheet) 와 'hover 시 floating 표현' 에만.
- **Shadow-heavy 레이아웃 금지** — 한 화면에 그림자 있는 요소가 3개를 넘으면 floating 의미가 사라진다. Border 또는 surface tone 으로 대체.

### 타이포그래피 위계

- **Bold 남발 금지** — Bold 텍스트는 화면당 1~2 곳에만. 5곳 이상이면 위계가 사라지고 모든 글자가 평등해진다. 본문은 Regular/Medium.
- **최상위 헤딩 중복 금지** — h1/h2 같은 큰 제목은 화면당 1개. 보조 섹션은 h3 이하로 내려야 페이지 안에서 '어디가 본론' 인지 보인다.
- **위계 불명 텍스트 금지** — 인접한 두 영역이 같은 fontSize × fontWeight 이면 위계가 무너진다. 헤딩과 본문의 시각적 차이를 항상 만든다.
- **폰트 웨이트 3개 이상 혼용 금지** — 한 화면에 2~3개 웨이트만. Display(Bold) · Body(Medium/Regular) · Caption(Regular) 정도가 표준.

### 아이콘

- **아이콘 스타일 혼용 금지** — 같은 화면/그룹 안에 Line · Filled · Colorful 아이콘을 섞지 않는다. `@nudge-design/icons` 단일 셋만, 같은 그룹은 한 스타일로 통일.
- **장식용 헤딩 아이콘 금지** — 서브타이틀(h3/h4) · Form Label · 본문 텍스트 앞 장식 아이콘 금지. 일부 헤딩에만 아이콘이 붙으면 위계가 깨진다. 한 화면 헤딩 앞 아이콘 5개 이상은 자동 위반.
- **Color icon 본문 남용 금지** — multi-color/colorful 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger 등) 와 진입점 1~2개에만. 일반 UI 강조에는 monochrome currentColor 만 사용.

### 가짜 대시보드 톤

- **Fake Dashboard 금지** — 의미 없는 KPI 카드 / 메트릭 그리드 / 장식용 chart / 큰 일러스트 + gradient hero. EAP 도메인은 사용자 상태/액션을 직접 보여주는 것이 우선. Generic SaaS dashboard 톤 회피.
- **Pastel 카드 그리드 금지** — 카드마다 다른 pastel/tinted background 를 깔아 영역을 색으로 구분하지 않는다. 모든 bg 는 `--semantic-bg-*` 토큰 안에서 한정.

### 원칙 — 색보다 구조 먼저

- **강조는 색보다 구조 먼저** — 강조가 필요하면 색상보다 정보 우선순위 · spacing · typography weight · CTA 위치를 먼저 조정한다. 색은 마지막 수단.

## 피해야 할 패턴

### 색·강조

- 연한 블루 페이지 배경 + 연한 블루 Chip + 연한 블루 안내 박스 조합
- primary blue 를 배경 · 버튼 · 태그 · hover · focus · 카드 테두리 모두에 사용
- 로고 gradient/accent 를 카드 배경이나 배지 색으로 재사용
- 새 영역마다 같은 색 계열 배경을 깔아 모든 섹션이 강조처럼 보이는 구성
- linear/radial/conic gradient 배경
- 영역 구분을 spacing 없이 색상만으로 처리

### 표면 (Card / Shadow)

- 정보 단위가 아닌 단순 group/section 도 모두 카드로 감싸기
- 카드 안에 또 카드를 만들어 내부 강조 시도
- 일반 카드 · 인라인 리스트 · 기본 입력에 shadow 적용
- 한 화면에 floating panel(Modal/Drawer/Popup/Toast) 2개 이상 동시 노출

### 타이포그래피 위계

- 한 화면에 Bold 텍스트 5곳 이상
- 한 화면에 h1/h2 두 개 이상
- 헤딩과 본문이 같은 fontSize × fontWeight 로 위계 모호
- 한 화면에 폰트 웨이트 3개 이상 혼용

### 아이콘

- Line + Filled + Colorful 아이콘을 한 화면/그룹에 혼용
- 서브타이틀/Form Label/본문 앞 장식 아이콘 (일부에만 부착 → 위계 붕괴)
- multi-color 아이콘을 일반 UI 강조용으로 사용

### 가짜 대시보드 톤

- 사용자 의사결정에 안 쓰이는 장식용 KPI 카드/메트릭 그리드
- 데이터 인사이트 없이 장식 목적의 chart/graph
- 큰 일러스트 + 큰 카피 + gradient 배경 hero section
- 카드마다 다른 pastel background 로 영역을 색 구분

## Metrics

| Key | Value |
|---|---|
| `maxPrimaryRolesPerScreen` | 2 |
| `maxPrimaryTintSurfacesPerSection` | 1 |
| `logoColorAsUiAccent` | forbidden |
| `toneOnToneFilled` | forbidden |
| `gradientBackground` | forbidden |
| `sectionColorOnly` | forbidden |
| `maxCardsPerScreen` | 5 |
| `nestedCard` | forbidden |
| `decorativeShadow` | forbidden |
| `maxShadowedElementsPerScreen` | 3 |
| `maxFloatingPanelsConcurrent` | 1 |
| `maxBoldOccurrencesPerScreen` | 4 |
| `maxTopLevelHeadingsPerScreen` | 1 |
| `maxFontWeightsPerScreen` | 3 |
| `mixedIconStyles` | forbidden |
| `maxDecorativeIconsBeforeHeading` | 0 |
| `decorativeKpiGrid` | forbidden |
| `decorativeChart` | forbidden |
| `decorativeHero` | forbidden |
