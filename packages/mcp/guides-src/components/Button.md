---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8385
usagePolicy:
  useFor:
    - 화면의 대표 CTA, 명확한 실행 액션, 중요한 폼 제출
    - ArrowNext/ChevronRight 아이콘은 다음 단계로 이동하는 대표 CTA 1개
  doNotUseFor:
    - 반복 카드마다 붙는 장식성 화살표 CTA
    - 동일 위계 CTA 여러 개에 모두 우측 화살표 아이콘 부착
    - 단순 보조 이동/자세히 보기 링크에 습관적으로 화살표 사용
  limits:
    primarySolidPerScreen: 1
    arrowIconButtonPerViewport: 1
    repeatedListArrowButton: avoid
colorMatrix:
  primary/solid: var(--semantic-bg-brand-default) 배경 + var(--semantic-text-inverse-default) 텍스트 — 가장 중요한 CTA
  primary/outlined: 흰 배경 + var(--semantic-border-brand-default) 보더/텍스트 — 밝은 배경 위 보조 액션
  primary/soft: surface.brandSubtle 배경 + textRole.brand 텍스트 — 3차 액션 (Figma 라이브러리엔 별도 셀 없음). 색 값은 packages/tokens/src/brands/<brand>.semantic.ts 토큰 SSOT 참조.
  secondary/solid: var(--semantic-bg-brand-subtle) 배경 + var(--semantic-text-brand-default) 텍스트 — 카드/배경 위 강조 (default), hover=var(--semantic-fill-brand-hover)
  neutral/outlined: "흰 배경 + #D8D8D8 보더 + #383838 medium weight 텍스트 — 중립 액션. Figma는 M/S/XS 만 지원, disabled 없음"
  error/solid: error fill + 흰 텍스트 — 파괴 액션 한정
sizeMatrix:
  xl: height 52 / px 16 / py 14 / 16·24 bold / icon 20 / gap 8
  lg: height 48 / px 16 / py 12 / 16·24 bold / icon 20 / gap 8
  md: height 44 / px 24 / py 11 / 15·22 bold / icon 20 / gap 8
  sm: height 42 / px 16 / py 11 / 14·20 bold / icon 20 / gap 8
  xs: height 38 / px 16 / py 10 / 13·18 bold / icon 18 / gap 6
stateMatrix:
  primary/solid/disabled: "bg #9CA2AE cool-gray + 흰 텍스트."
  secondary/solid/disabled: "bg #E6E7EB + 텍스트 #9CA2AE."
  outlined_disabled: "흰 배경 + 보더 #9CA2AE + 텍스트 #9CA2AE."
  hover: primary=var(--semantic-fill-brand-hover) / secondary=var(--semantic-bg-brand-subtle) / outlined/neutral=var(--semantic-bg-surface-subtle)
matrixOverrides:
  cashwalk-biz:
    sizeMatrix:
      sm: height 40 (base 42 → 40) / 그 외 px/py/typography 는 base 동일
      xs: height 36 (base 38 → 36) / 그 외 px/py/typography 는 base 동일
    stateMatrix:
      primary/solid/disabled: "bg #DDDDDD (atomic Neutral/400) + text #FFFFFF (Figma 3098:1079)."
      secondary/solid/disabled: "bg #DDDDDD + text #FFFFFF — Solid/Primary disabled 와 같은 페어."
      outlined_disabled: "흰 배경 + 보더 #E7E7E7 + 텍스트 #BBB."
    dimensions:
      shape: default(radius 8 — 일반 admin 액션) · pill(radius full — 모달 확인/취소, BottomCTA, 격식 컨텍스트). 5종 스타일 × 2 shape × 5 size = 50 cell (Figma ButtonGuide SSOT).
      relatedComponents: TextButton(Large 38 / Medium 32), IconButton(48/44/40/32) — 별도 컴포넌트 가이드.
---

## summary

1차/2차 CTA. color × variant × size 매트릭스로 톤 결정 (Figma Library node 171:8385 기준).

## pitfalls

- **라벨을 JS 로 갈아끼우지 말 것 (HTML 한정 함정)** — `nds-button` 은 실제 `<button>` 을 light DOM 에 렌더하므로 `el.textContent = '...'` / `el.innerHTML = '...'` 로 라벨을 바꾸면 컴포넌트가 렌더한 `<button>` 이 통째로 지워지고, host(display:contents)에 맨 텍스트만 남아 스타일·포인터(cursor)·클릭 동작이 전부 사라진다(회귀: 위저드 하단 '다음 단계'→'심사 신청' 라벨 교체로 버튼이 무스타일 텍스트가 됨). 단계별로 라벨이 달라야 하면 (1) 라벨 고정 nds-button 을 단계 수만큼 두고 show/hide 로 전환하거나 (2) host 자체를 새 nds-button 으로 교체하라. **라벨 텍스트만 노드 변이(textContent/innerHTML) 금지.**
- **HTML 한정** — `nds-button` 은 `leftIcon`/`rightIcon` slot **미구현** (nds-button.ts L20-21). `<nds-button><span slot='leftIcon'>...</span>텍스트</nds-button>` 패턴 금지 (slot 은 무시되고 span 이 children 으로 흘러 들어감). 아이콘이 필요하면 children 안에 SVG 와 텍스트를 직접 나열: `<nds-button><svg>...</svg>텍스트</nds-button>`. **아이콘↔텍스트 간격은 컴포넌트가 `.nds-button__label` 의 gap 으로 자동 적용**하므로 margin-right/padding 으로 직접 띄우지 말 것. JS 로 빈 span 에 innerHTML 인젝션 우회 절대 금지.
- **React 한정** — `<Button leftIcon={<svg/>}>...</Button>` / `rightIcon={<svg/>}` 사용. 빈 React Element 를 넘기고 ref 로 innerHTML 박는 패턴 금지.
- color='neutral' + variant='solid' 은 **brand 별로 다름** — base/NudgeEAP·Trost·Geniet·Runmile 은 cool-gray/light-gray fill 이라 disabled 처럼 보여 비권장(validator neutral-solid-cta 경고). **단 캐포비(cashwalk-biz)는 neutral solid = #111 검정 CTA(Figma Neutral tone)로 정당** — 캐포비 한정 예외(글자는 fill 명도 대비 자동: 검정 fill→흰글자).
- **캐포비(cashwalk-biz)는 Secondary tone 이 없음** — Figma ButtonGuide(3098:1032) tone = Primary + Neutral 둘뿐. 캐포비 검정/회색 CTA 는 반드시 `color="neutral"` (solid=검정 #111 / soft=회색 #F5F5F5 / outlined=라인). `color="secondary"` 사용 시 dev console 경고 + validator `brand-denied-button-color` 가 잡음. (secondary 는 다른 브랜드 전용 tone)
- Geniet 브랜드에서 variant='soft' 는 Figma 가이드(207:1853)에 없는 변형. 사용 시 dev console 에 경고가 나오며 디자인 인텐트가 어긋남 — Geniet 은 solid / outlined 만 사용.
- Geniet Solid/Secondary 는 옅은 mint subtle(#F2FAFA) 배경 + brand mint(#00A8AC) 텍스트 — 다른 브랜드 soft secondary 와 동일 패턴. (구버전의 #333 dark-inverse 패턴은 폐기됨.)
- primary 색은 화면당 가장 중요한 1개 액션에만 사용. 한 화면에 두 개 이상 primary 솔리드 = 위계 붕괴.
- 다른 페이지로 이동하는 CTA라고 해서 모든 Button에 화살표 아이콘을 붙이지 말 것. ArrowNext/ChevronRight 류 아이콘은 대표 전진 액션 1개에만 사용.
- 카드 리스트/섹션 리스트에서 반복되는 '자세히 보기 →' 버튼은 시각 소음이 큼. 반복 CTA는 아이콘 없이 텍스트만 쓰거나 카드 전체 클릭 패턴을 검토.
- Solid/Secondary 는 옅은 파랑 배경(#F1F8FD) + primary 텍스트로 그려진다. 'magenta'를 기대하면 안 됨.
- Outlined/Neutral 는 medium weight + 회색 보더. Outlined/Primary 와 weight·border 모두 다르므로 'color=neutral variant=outlined' 와 'color=primary variant=outlined' 를 임의로 바꿔치기하지 말 것.
- **아이콘 색 하드코딩 금지** — `<LockIcon color="var(--semantic-icon-inverse-default)" />` 처럼 inverse/brand 토큰을 박지 말 것. NudgeEAP/Trost(primary=흰 텍스트) 에서는 맞아 보이지만, 캐시워크 포 비즈니스(primary=검정 텍스트 on 노랑) 에서는 흰 아이콘이 노란 배경 위에 떠 보임. 항상 `color="currentColor"` 로 두어 Button 텍스트 색을 상속하게 한다.
- **shape='pill' 은 radius 만 바꿈** — color/variant/size 매트릭스와 직교. shape 만 다른 두 버튼을 한 화면에 섞으면 위계 혼란 — 컨텍스트별로 통일. brand 별 shape 사용 패턴은 get_guide({ topic:'component:Button', brand:'<slug>' }).preferredPatterns 참조.
- **풀폭(가로 FILL)은 `full-width` 속성 — CSS 클래스가 아니다.** `class="full"` 같은 임의 클래스나 host(`<nds-button>`, display:contents)에 건 `style="width:100%"` 는 안 먹는다(내부 `<button>` 까지 안 닿음). HTML=`<nds-button full-width>`, React=`<Button fullWidth>`. 온보딩/폼 Primary CTA 가 작게 hug 로 남던 회귀의 원인. **단 모달 푸터는 예외** — 캐포비 단일 버튼은 우측 hug pill 이라 full-width 금지(Modal 가이드 SSOT).
- **라벨 1줄 강제 — 두 줄 줄바꿈 금지** (전 브랜드 공통 룰). 라벨이 컨테이너 폭 부족으로 wrap 되면 버튼 높이가 깨지고 좌우 정렬·아이콘 베이스라인이 어긋남. 대응: (1) 라벨을 짧은 동사구로 (2) IconButton 또는 dropdown 으로 분리 (3) 컨테이너 width/grid 재설계. 절대 `white-space: normal` 로 강제 wrap 시키지 말 것 — DS 의 `white-space: nowrap` 이 의도된 가드. 텍스트가 길 수밖에 없으면 size 를 줄이지 말고 단어를 줄여라.

## recommended

- 1차 CTA: color='primary', variant='solid'
- 보조 액션 (밝은 배경 위): color='primary', variant='outlined'
- 보조 액션 (파란 카드 위 등): color='secondary', variant='solid' — 옅은 파랑 배경
- 중립 액션(취소/뒤로): color='neutral', variant='outlined'
- 파괴 액션: color='error', variant='solid'
- 회색 인상을 주려고 neutral/solid 를 쓰지 말 것 — disabled prop 이 정공법

## accessibility

- 터치 타겟 최소 44px — md(44)/lg(48)/xl(52) 권장. xs(38)/sm(42)는 보조 행에서만.
- Figma 의 'Hover / Focused' 셀은 한 상태로 합쳐져 있지만 코드에서는 :focus-visible 도 동일 hover 톤으로 노출됨 — 키보드 포커스링이 사라지지 않게 customizing 시 outline 토큰 유지.
- disabled 버튼에도 aria-disabled 가 자동 부착되도록 disabled prop 사용 (raw <button> 대체 금지).

## interactivePattern

버튼은 onClick 핸들러를 항상 부착. 목업에서도 라우팅 시뮬(toast/console.log)이라도 넣을 것.

## examples.do

```tsx
<Button color="primary" variant="solid" rightIcon={<ArrowNextIcon />}>상담 신청하기</Button>
<Button color="primary" variant="outlined">검사 시작하기</Button>
<Button color="neutral" variant="outlined">자세히 보기</Button>
```

## examples.dont

```tsx
<Button rightIcon={<ArrowNextIcon />}>상담 신청하기</Button>
<Button rightIcon={<ArrowNextIcon />}>검사 시작하기</Button>
<Button rightIcon={<ArrowNextIcon />}>자세히 보기</Button>
```

## examplesHtml.do

```html
<nds-button color="primary" variant="solid">상담 신청하기</nds-button>
<nds-button color="primary" variant="outlined">검사 시작하기</nds-button>
<nds-button color="neutral" variant="outlined">자세히 보기</nds-button>
```

## examplesHtml.dont

```html
<!-- raw <button> + className 흉내. nds-button 룰/토큰이 전혀 적용 안 됨 -->
<button class="nds-button" onclick="handle()">상담 신청하기</button>
<!-- 캐포비는 secondary tone 없음 — 검정/회색 CTA 는 color="neutral" 사용 -->
<nds-button color="secondary" variant="solid">저장</nds-button>
```
