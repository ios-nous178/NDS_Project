---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5303-111
---

## summary

페이지를 구성하는 두 레이아웃 단위 — **Container = 가로(너비)**, **Section = 세로(블록)**. **Container** 는 컨텐츠를 viewport 너비 안에 가두고 좌우 padding 을 표준화하는 반응형 래퍼로, Layout primitive 컨벤션대로 web component 없이 **`nds-container` 클래스**로 제공한다(`<div class="nds-container">…</div>`). **Section** 은 페이지를 의미 단위 세로 블록으로 나누는 규칙으로, **컴포넌트화하지 않고 페이지 디자인 시 frame/`<section>` 으로 직접 그린다** — 아래 rules 를 따른다.

### "section" 세 가지 — 헷갈리지 말 것

이 가이드의 **Section = 페이지 레벨 세로 블록**(여기 rules 대상). DS 에는 같은 이름의 다른 두 개념이 있으니 구분한다.

| 이름                         | 정체                                       | 어디                                                            |
| ---------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| **Section (이 가이드)**      | 페이지 세로 블록 — 클래스/컴포넌트 아님    | `<section>` frame 직접 작성                                     |
| **`.nds-section` (어드민 카드)** | 본문 안 흰 카드 (head/body/title)          | `Layout.ts` `sectionStyles` — `<section class="nds-section">`   |
| **`FormSection`**            | 어드민 폼 그룹 카드 (React/HTML 컴포넌트)   | `get_guide({ topic: 'component:FormSection' })`                |

### Container 반응형 — base(전 프로젝트 공용) + Trost device-variant

base `.nds-container` 는 전 프로젝트 공용 디폴트 — **PC(≥1024) max 1200·좌우 40 / Tablet(768~1023) max 768·좌우 24 / Mobile(<768) 100%·좌우 16**, `margin-inline:auto` 가운데 정렬. Trost 앱 컨텐츠는 아래 **opt-in 모디파이어**로 device-variant 폭을 잡는다(base 는 그대로, 클래스 추가로만 적용 — 다른 프로젝트 영향 0).

| device-variant | 클래스                  | content max | inner h-padding |
| -------------- | ----------------------- | ----------- | --------------- |
| Mobile (<768)  | (모디파이어 자동 collapse) | 360 (≈100%) | 16              |
| PC (≥768)      | `.nds-container--pc`    | 1080        | 24              |
| PC-Wide        | `.nds-container--wide`  | 1200        | 24              |
| 런마일 PC      | `.nds-container--runmile` | 1280      | 80              |

- **PC-Wide(`--wide`)** 는 테이블·대시보드 등 가로 정보량이 많은 화면용. 일반 컨텐츠는 **PC(`--pc`, 1080)** 가 기본.
- h-padding 은 viewport 와 content 폭의 차를 양분한 값 — **h-padding = (viewport − content) / 2**. 모디파이어는 모바일(<768)에서 base 와 동일하게 100% / 좌우 16 으로 자동 collapse 한다.

#### 런마일 Section/Container (Figma 5070:2)

런마일 앱 컨텐츠는 **`.nds-container--runmile`** — 콘텐츠 max **1280** · 좌우 패딩 **PC 80 / Mobile 16**(자동 collapse). 세부 레이아웃 규칙:

- **2열 그리드** = **Main 888 + Side 332 + 컬럼 갭 60**(모바일은 1열 fallback 필수). 888/332/60 은 토큰이 아니라 페이지에서 직접 그린다.
- **카드 그리드 갭** = PC **24**(3열, Gap/Wide) / **16**(2열, Gap/2XL). 모바일 1열.
- **Section 타이틀 ↔ 콘텐츠** = **20**(PC, Gap/3XL) / **12**(Mobile, Gap/XL). **Section 간 구분** = **8**(Divider/여백, Gap/MD).
- **Section 타이틀 비주얼** = **4×22 프로젝트 액센트 바(BG/Brand `#FF5B37`) + 22 Bold 타이틀(Text/Strong `#221E1F`)**. (런마일 headline1 은 24 — 22 타이틀은 섹션 헤딩 한정.)
- **간격 라벨 매핑**(Figma → DS): Spacing/MD=8 · XL=12 · 2XL=16 · 3XL=20 · 4XL=24 — 전부 DS gap/spacing 스케일과 1:1. 임의 간격(13·17·25) 금지.

```html
<!-- Trost 앱: Section(세로 블록, BG 교차) 안에 Container(가로 폭 가둠) 1개 -->
<!-- Container BG = BG/Section/Default · Content BG = BG/Surface/Default(흰 카드, PC radius 16) -->
<section style="padding: 40px 0; background: var(--semantic-bg-section-default)">
  <div class="nds-container nds-container--pc">
    <div class="nds-section-surface" style="padding: 24px">…컨텐츠…</div>
  </div>
</section>
<section style="padding: 40px 0; background: var(--semantic-bg-section-default)">
  <div class="nds-container nds-container--wide">…테이블/대시보드…</div>
</section>
```

```html
<!-- 마케팅/홍보 페이지: 모디파이어 없이 base(1200) + 큰 Section padding(120/80/40) -->
<section style="padding: 120px 0; background: var(--semantic-bg-surface-default)">
  <div class="nds-container">…히어로…</div>
</section>
```

`.nds-section-surface` 는 가산 헬퍼 — `background: var(--semantic-bg-surface-default)` + `border-radius: 16px`(radius[16]). bg/radius 를 `.nds-container` 에 굽지 않으므로 흰 컨텐츠 카드가 필요할 때만 붙인다.

## rules

- 컨텐츠는 항상 `nds-container`(+Trost 면 모디파이어) 안에 둔다 — Container 가 좌우 padding·max-width 를 viewport 별로 표준화한다. 같은 화면에서 Container 너비를 혼용하지 않는다.
- **Trost device-variant** — Mobile content 360 / h-padding 16 · **PC content 1080 / inner 24**(`--pc`) · **PC-Wide content 1200 / inner 24**(`--wide`). 임의 폭은 모디파이어로만 정한다.
- **Container BG vs Content BG** — Section(Container 가 사는 세로 블록)의 BG 는 **BG/Section/Default**(`--semantic-bg-section-default`), 그 위 흰 컨텐츠 카드는 **BG/Surface/Default**(`--semantic-bg-surface-default`) + content radius **Mobile 0 / PC 16**(`.nds-section-surface`, radius[16]). content 카드만 surface 흰색을 쓰고 바깥 Section 은 section 회색.
- **Section 세로(상하) padding** — **Mobile 20 / PC 40**(app-content 기준). `--semantic-inset-*`/spacing 스케일에서 선택. 좌우 여백은 Section 이 아니라 내부 Container 가 책임진다.
- **Section 안 item 간격(세로 stack)** — **Mobile 16 (Gap/Loose, `--semantic-gap-loose`) / PC 24 (Gap/Wide, `--semantic-gap-wide`)**.
- **Sub-section(섹션 안 하위 그룹) 간격** — **12 (Gap/Comfortable, `--semantic-gap-comfortable`)**. item 간격(16/24)보다 한 단계 좁혀 위계를 만든다.
- **두 archetype 구분** — 위 **app-content 스케일(세로 padding 20/40)** 과 **marketing-section 스케일(Large 120 / Medium 80 / Small 40, PC 기준·모바일 1/2)** 은 별개 archetype. 마케팅/홍보 랜딩은 120/80/40, 앱 화면 컨텐츠는 20/40 을 쓴다 — 한 화면에서 섞지 않는다.
- 인접 Section 은 **BG 교차로 분리** — White(`--semantic-bg-surface-default`) ↔ Section/Gray(`--semantic-bg-section-default`). 그림자·보더 대신 배경 교차로 시각적 블록 분리감을 준다.
- Section 1개 안에 Container 1개 — Container 로 너비를 가둔다.
- Section 헤딩 — 마케팅 Section Title **32 Bold + 하단 16 여백**, 헤딩↔본문 간격 **24** 권장.
- Section 끼리 직접 붙이지 않고 **padding 으로만 분리** — 사이에 margin 을 쓰지 않는다(margin collapse 방지).
- 다열(2열+) 그리드는 **좁은 화면에서 1열 fallback 필수** — `@media (max-width:768px)` 에서 `grid-template-columns:1fr`(또는 `flex-wrap`). 모바일에서 다열을 그대로 두면 카드가 짓눌려 글자가 세로로 쪼개진다.
- **시각 순서 = DOM 순서가 기본.** PC 2열(좌열 1–5 / 우열 6–10)을 만들려고 DOM 을 열 우선(1,6,2,7…)으로 까는 건 금지 — 모바일 1열에서 그 순서가 그대로 노출돼 랭킹이 뒤섞인다. DOM 은 읽기 순서(1,2,3…)대로 두고, 열 우선 배치는 `grid-auto-flow:column` + `grid-template-rows:repeat(N,auto)` 로 표현한다 — 그러면 모바일 1열에서도 DOM 순서(1,2,3…)가 유지된다.
- 모든 페이지 `<head>` 엔 `<meta name="viewport" content="width=device-width, initial-scale=1">` — 없으면 모바일이 데스크탑 폭으로 렌더돼 반응형(@media)이 전혀 안 먹는다(`build_singlefile_html` 은 산출물에 자동 주입하지만 원본에도 둔다).

## avoid

- **임의 Container 너비(970 · 1100 등) 사용** — device-variant(360 / 1080 / 1200)만 쓴다. 임의 폭은 viewport 별 정렬·h-padding 계산이 깨진다.
- Container 밖에 컨텐츠를 두는 것 — 좌우 정렬·max-width 가 깨진다. 항상 `nds-container` 안에.
- **bg/radius 를 `.nds-container` 에 직접 박는 것** — Container 는 투명 폭 래퍼다. 흰 카드 표면은 `.nds-section-surface`(또는 별도 wrapper)로만.
- Section 사이에 `margin` 사용 — padding 으로만 분리(margin collapse).
- 같은 화면에서 Container 너비 혼용(예: 한 섹션 1080, 다른 섹션 970).
- **app-content 스케일과 marketing 스케일 혼용** — 앱 화면 세로 padding 20/40 과 랜딩 120/80/40 을 한 화면에서 섞지 않는다.
- 모바일에서 PC padding(좌우 24/40)을 그대로 사용 — Container/모디파이어가 자동으로 16 으로 줄이므로 직접 좌우 padding 을 덧대지 않는다.
- 다열 그리드를 **모바일 fallback(@media 1열 / flex-wrap) 없이** 사용 — 좁은 화면에서 카드 짓눌림·가로 오버플로우.
- PC 다열을 위해 DOM 을 **열 우선(1,6,2,7…)으로 배열** — 모바일 1열에서 순서가 뒤섞인다(배치는 grid-auto-flow:column / CSS order 로, DOM 은 읽기 순서로).
- `<meta name="viewport">` 누락 — 모바일 스케일이 깨져 반응형이 전혀 안 먹는다.
