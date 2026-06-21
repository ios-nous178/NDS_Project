---
metrics:
  className: .nds-grid
  defaultColumns: 2
  allowedColumns: 2 · 3 · 4 · auto
  defaultGap: --semantic-gap-loose (16)
  mobileFallback: 1열 (data-cols="auto" 제외)
---

## summary

홈·마이페이지·갤러리·추천처럼 **콘텐츠 카드를 다열로 배치**하는 그리드는 raw `display:grid` 를 매번 손코딩하지 말고 레이아웃 프리미티브 **`.nds-grid` 클래스**로 만든다. `<div class="nds-grid" data-cols="3">` 안에 `<nds-card>`(또는 Card) 셀을 넣으면 토큰 간격·반응형 1열 fallback·min-width:0 깨짐방지가 한 번에 적용된다. 열 수·간격은 전부 data 속성/토큰으로 제어 — 컴포넌트(`<nds-grid>`)가 아니라 클래스다(Layout primitive 컨벤션, shell·container·section 과 동일). Card 본문 룰은 get_guide({ topic: 'component:Card' }) 와 함께 본다.

## rules

- **컨테이너 = `.nds-grid`**: `<div class="nds-grid" data-cols="N">`. N = `2`·`3`·`4`(기본 2). 태블릿(≤1023)에서 3·4열은 자동 2열, 모바일(<768)에서 1열로 collapse — `@media` 를 직접 쓸 필요 없다.
- **반응형이 핵심이면 `data-cols="auto"`**: 미디어쿼리 없이 컨테이너 폭에 맞춰 열 수가 auto-fill 된다. 셀 최소폭은 `style="--nds-grid-min: <Npx>"`(기본 160px, 4의 배수). 카드 개수가 가변이거나 폭이 유동적인 화면에 가장 견고하다.
- **간격은 토큰만**: 기본 `--semantic-gap-loose`(16). 넓히려면 `data-gap="wide"`(24), 좁히려면 `data-gap="tight"`(12). 그 외 값은 `style="--nds-grid-gap: var(--semantic-gap-*)"` 로 — raw px 금지(inline-spacing 위반).
- **셀 = 독립 정보 단위만 Card**: 카드 그리드의 셀은 `<nds-card>`/Card 가 표준. 카드 배경·보더·radius 는 Card 토큰 그대로(프로젝트가 토큰으로 흡수). 카드로 감쌀 만한 "독립 단위"가 아니면(단순 텍스트 행 나열) 그리드가 아니라 List/section 을 쓴다.
- **모바일 다열 유지가 필요하면(quick-action 류)**: 아이콘+짧은라벨 작은 셀은 모바일에서도 2~4열을 유지하는 게 보통 — 그건 이 패턴이 아니라 get_guide({ topic: 'pattern:quick-action-grid' }) 를 쓰거나, 꼭 `.nds-grid` 로 해야 하면 `style="--nds-grid-cols: 2"`(인라인 custom prop 이 모바일 미디어쿼리를 이겨 열 수 고정) 로 escape.
- **항목 폭/높이**: 트랙이 `minmax(0,1fr)` 라 긴 텍스트가 셀을 밀어 가로 스크롤을 내지 않는다. 카드 높이를 맞추려면 Card 에 고정 높이를 박지 말고 내용으로 자연스럽게 — 정렬이 필요하면 `align-items` 가 아니라 카드 내부 구조로.

## avoid

- ❌ `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">` 를 매번 손코딩 — `.nds-grid` 가 표준. raw px gap 은 inline-spacing 위반.
- ❌ 모바일 1열 fallback 누락 — `.nds-grid` 는 자동이지만, 직접 grid 를 짤 경우 안 두면 카드가 짓눌려 글자가 세로로 쪼개진다.
- ❌ 5칸 이상 고정 배치 — 2·3·4 또는 `auto`. 6개는 3×2, 8개는 4×2.
- ❌ 셀을 커스텀 `.card`/`.tile` div 로 재발명 — Card 셀이 표준(토큰 우회·"DS 채택률" 착시).
- ❌ Card 가 아닌 단순 행 나열을 그리드로 — 독립 단위가 아니면 List/section(get_guide({ topic: 'component:List' })).
- ❌ 카드 높이를 px 로 고정해 줄맞춤 — 내용 기반 + minmax. 고정 높이는 반응형에서 잘림/여백을 만든다.

## readyMade.note

콘텐츠 카드 3열 그리드 — `.nds-grid data-cols="3"`, 셀은 Card. 간격은 토큰(`data-gap`/`--nds-grid-gap`), 모바일 1열 자동. 가변 개수면 `data-cols="auto"` + `--nds-grid-min`.

## readyMade.html

```html
<!-- 콘텐츠 카드 3열 그리드 — 셀은 <nds-card>. 모바일 1열·태블릿 2열 자동. -->
<div class="nds-grid" data-cols="3" data-gap="wide">
  <nds-card><!-- 썸네일 + 제목 + 메타 --></nds-card>
  <nds-card>…</nds-card>
  <nds-card>…</nds-card>
  <nds-card>…</nds-card>
  <nds-card>…</nds-card>
  <nds-card>…</nds-card>
</div>

<!-- 개수 가변 / 폭 유동 — 미디어쿼리 없이 auto-fill (셀 최소 200px) -->
<div class="nds-grid" data-cols="auto" style="--nds-grid-min: 200px">
  <nds-card>…</nds-card>
  <!-- … -->
</div>
```
