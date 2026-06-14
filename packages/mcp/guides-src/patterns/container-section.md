---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=1385-13
---

## summary

페이지를 구성하는 두 레이아웃 단위(Figma 1385:13) — **Container = 가로(너비)**, **Section = 세로(블록)**. **Container** 는 컨텐츠를 viewport 너비 안에 가두고 좌우 padding 을 표준화하는 반응형 래퍼로, Layout primitive 컨벤션대로 web component 없이 **`nds-container` 클래스**로 제공한다(`<div class="nds-container">…</div>`). 반응형 자동 — **PC(≥1024) max 1200·좌우 40 / Tablet(768~1023) max 768·좌우 24 / Mobile(<768) 100%·좌우 16**, `margin-inline:auto` 로 가운데 정렬. **Section** 은 페이지를 의미 단위 세로 블록으로 나누는 규칙으로, **컴포넌트화하지 않고 페이지 디자인 시 frame/`<section>` 으로 직접 그린다** — 아래 rules 를 따른다. 어드민 카드 `nds-section`(흰 카드 head/body)과는 다른 개념(페이지 레벨 블록).

```html
<!-- Section(세로 블록, BG 교차) 안에 Container(가로 폭 가둠) 1개 -->
<section style="padding: 120px 0; background: var(--semantic-bg-surface-default)">
  <div class="nds-container">…컨텐츠…</div>
</section>
<section style="padding: 120px 0; background: var(--semantic-bg-surface-subtle)">
  <div class="nds-container">…컨텐츠…</div>
</section>
```

## rules

- 컨텐츠는 항상 `nds-container` 안에 둔다 — Container 가 좌우 padding·max-width 를 viewport 별로 표준화한다(PC 1200/40 · Tablet 768/24 · Mobile 100%/16). 같은 화면에서 Container 너비를 혼용하지 않는다.
- Section 상하 padding — **Large 120 / Medium 80 / Small 40**(PC 기준, 모바일은 1/2 권장). Spacing 토큰에서 선택(`--semantic-inset-*`/spacing 스케일). 좌우 여백은 Section 이 아니라 내부 Container 가 책임진다.
- 인접 Section 은 **BG 교차로 분리** — White(`--semantic-bg-surface-default`) ↔ Gray 50(`--semantic-bg-surface-subtle`). 그림자·보더 대신 배경 교차로 시각적 블록 분리감을 준다.
- Section 1개 안에 Container 1개 — Container 로 너비를 가둔다.
- Section 헤딩 — Section Title **32 Bold + 하단 16 여백**, 헤딩↔본문 간격 **24** 권장.
- Section 끼리 직접 붙이지 않고 **padding 으로만 분리** — 사이에 margin 을 쓰지 않는다(margin collapse 방지).
- 다열(2열+) 그리드는 **좁은 화면에서 1열 fallback 필수** — `@media (max-width:768px)` 에서 `grid-template-columns:1fr`(또는 `flex-wrap`). 모바일에서 다열을 그대로 두면 카드가 짓눌려 글자가 세로로 쪼개진다.
- **시각 순서 = DOM 순서가 기본.** PC 2열(좌열 1–5 / 우열 6–10)을 만들려고 DOM 을 열 우선(1,6,2,7…)으로 까는 건 금지 — 모바일 1열에서 그 순서가 그대로 노출돼 랭킹이 뒤섞인다. DOM 은 읽기 순서(1,2,3…)대로 두고, 열 우선 배치는 `grid-auto-flow:column` + `grid-template-rows:repeat(N,auto)` 로 표현한다 — 그러면 모바일 1열에서도 DOM 순서(1,2,3…)가 유지된다.
- 모든 페이지 `<head>` 엔 `<meta name="viewport" content="width=device-width, initial-scale=1">` — 없으면 모바일이 데스크탑 폭으로 렌더돼 반응형(@media)이 전혀 안 먹는다(`build_singlefile_html` 은 산출물에 자동 주입하지만 원본에도 둔다).

## avoid

- Container 밖에 컨텐츠를 두는 것 — 좌우 정렬·max-width 가 깨진다. 항상 `nds-container` 안에.
- Section 사이에 `margin` 사용 — padding 으로만 분리(margin collapse).
- 같은 화면에서 Container 너비 혼용(예: 한 섹션 1200, 다른 섹션 960).
- 모바일에서 PC padding(좌우 40)을 그대로 사용 — Container 가 자동으로 16 으로 줄이므로 직접 좌우 padding 을 덧대지 않는다.
- 다열 그리드를 **모바일 fallback(@media 1열 / flex-wrap) 없이** 사용 — 좁은 화면에서 카드 짓눌림·가로 오버플로우.
- PC 다열을 위해 DOM 을 **열 우선(1,6,2,7…)으로 배열** — 모바일 1열에서 순서가 뒤섞인다(배치는 grid-auto-flow:column / CSS order 로, DOM 은 읽기 순서로).
- `<meta name="viewport">` 누락 — 모바일 스케일이 깨져 반응형이 전혀 안 먹는다.
