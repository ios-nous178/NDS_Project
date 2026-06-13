---
metrics:
  preferredBuckets: 44 / 48 / 52 px
  defaultBucket: 44px (Button.md · Tab.chip pc · Input.field)
  maxHeightMixPerRow: 1
  gapBetweenItems: 8 / 12 / 16 px (--semantic-gap-component-*)
  verticalAlign: center
---

## summary

헤더 우측 액션 row · 필터 바 · 도구 모음처럼 *서로 다른 컴포넌트가 한 줄로 나란히 놓이는* 영역에서 높이를 어떻게 맞추는가. 빠지면 1-2px 어긋남이 row 전체를 시각적으로 불편하게 만든다. `sizing.button` / `sizing.tabs` / `sizing.input` 토큰의 단일 source of truth.

## rules

- 한 row 안의 모든 컴포넌트는 *동일한 height bucket* (44 / 48 / 52 중 하나) 으로 통일. 4px 차이도 정렬 깨짐.
- **기본 bucket = 44px** — Button.md(44) / Tab.chip(pc 44) / Input.field(44) 가 자연 매치. 헤더 우측 액션 row · 필터 바 · 카드 footer 의 표준.
- **큰 bucket = 48px** — Button.lg(48) / Button.field(48) / Input.default(48) / AppBar 아래 큰 액션 row. primary CTA 가 포함된 row 에 사용.
- **작은 bucket = 38-42px** — Button.sm(42) / Button.xs(38) / Tab.chip(mobile 36 — 38 에 가깝게 padding 조정). 정보 밀도 높은 어드민·표 상단 도구 모음에 사용.
- DS 컴포넌트의 height 는 `sizing.button.{size}` / `sizing.tabs.{type}.{viewport}` / `sizing.input.{kind}` 토큰이 단일 진실. **인라인 height 로 덮어쓰지 말 것** — 자연 높이가 다른 컴포넌트를 같은 px 로 강제하면 line-height 가 어긋난다.
- DateRangePicker / Toggle / Select 같이 sizing.* 토큰이 없는 컴포넌트는 size prop 으로 매치하거나, 같은 row 에서 padding 만 조정해 외형을 맞춘다. **임의 height: 40px 같은 raw px 금지** — 토큰에서 가장 가까운 bucket 으로 라운드.
- row 안 컴포넌트 간 gap 은 8 / 12 / 16 중 하나. var(--semantic-gap-component-tight) / var(--semantic-gap-component-default) / var(--semantic-gap-component-loose).
- row baseline 정렬: align-items: center (vertical center) 가 기본. text label 이 있는 컴포넌트와 icon-only 컴포넌트를 섞으면 baseline 정렬은 어긋남 — center 만 사용.

## avoid

- 한 row 안에 Button(44) + Tab(56) + Toggle(38) 처럼 다른 bucket 의 컴포넌트를 섞기
- `style={{ height: '40px' }}` 같은 raw px 로 컴포넌트 자연 높이를 덮어쓰기 — line-height 어긋남
- DateRangePicker 의 input 자연 높이가 40px 이라고 다른 컴포넌트도 height: 40 으로 강제하기 (toggle/tabs 가 깨짐)
- primary CTA 가 들어있는 row 에 작은 sm/xs Button 을 섞기 — 시각 위계 흐려짐
- row gap 을 14 / 18 / 20 같은 4pt grid 위반 값으로 설정
- row baseline 정렬을 align-items: baseline 으로 두기 — text + icon 혼합 row 에서 어긋남
