# @nudge-design/tokens

## 0.0.2

### Patch Changes

- b887f41: Button Outlined/Primary 보더·텍스트를 전용 button-outlined 토큰으로 배선 + 캐포비 색 교정 (Figma ButtonGuide 3098:1179/1190).
  - **버그**: Button `primary.outlined` 가 `cv.borderRole.brand`/`cv.textRole.brand`(generic brand 역할)을 직참조해, 전용 `--semantic-button-border-outlined-*`/`-text-brand` 토큰을 무시하고 있었음. 그래서 캐포비 outline primary 가 brand 노랑(#FFD200 보더 / #FEAF01 텍스트)으로 잘못 렌더됐고, geniet 도 의도값(#00A8AC) 대신 brand(#48C2C5)로 렌더됨.
  - **수정(배선)**: react Button + html nds-button 의 `primary.outlined` enabled/hover/disabled 를 `cv.button.bgOutlined(/Hover/Disabled)` · `cv.button.textBrand` · `cv.button.borderOutlined(/Hover/Disabled)` 로 전환. 두 면 미러 동일.
  - **수정(캐포비 값)**: `buttonBorder.outlined.default`/`.hover` 와 `buttonText.brand` 를 `yellow → neutral[900] #111` 로 교정. Figma: Outlined/Primary = 흰 bg + **검정(#111) 보더·텍스트**, hover 는 보더/텍스트 #111 유지 + bg 만 `#FFFEF5` 틴트. (bg·disabled 보더(#E7E7E7)는 기존값이 이미 정확.)
  - 결과: nudge/trost/runmile 무변화(전용 토큰이 이미 brand색), geniet 은 의도값 #00A8AC 로 교정, **캐포비 outline primary = 검정(#111)**.
  - **추가 교정 — 캐포비 Solid/Neutral**: `buttonBg.secondary.default` `#000000 → neutral[900] #111` (Figma 3098:1095 = neutral/900, 순수 검정 아님). hover #333·disabled #DDD 은 기존값 일치.

- 501ff41: ⚠️ BREAKING — Button taxonomy 통일 (전 브랜드).

  축 정리: `shape{default, pill}` × `variant{solid, soft, outlined}` × `color{primary, secondary, neutral}`.
  - **`assistive` → `neutral` 하드 rename** (alias 없음): 토큰 슬롯(`buttonBg/text/border.assistive` × 전 브랜드 semantic), `cv.button` 멤버(`bgAssistive`→`bgNeutral` 등), CSS 변수 `--semantic-button-*-assistive-*` → `--semantic-button-*-neutral-*`, validator(html-validator·mockup-validator) 룰(`assistive-solid-cta`→`neutral-solid-cta`), MCP 가이드. → 외부 프로젝트에서 `<Button color="assistive">` / `--semantic-button-*-assistive-*` var 사용 시 **변경 필요**.
  - **`outlined-sub` variant 제거** → `outlined` 로 흡수: react/html styleMap 의 3개 tone blocks·타입·`BUTTON_VARIANTS` 제거. 소비처(Trost AppBar·mockup-layout·stories) 는 `variant="outlined" color="secondary"` 로 마이그레이션(neutral 보더 유지). validator/guide/test enum 정리. → `<Button variant="outlined-sub">` 사용 시 **변경 필요**.
  - `color` prop 이름은 **유지**(Badge/Chip 등과 공유 prop — Button 만 tone 으로 바꾸면 API 엇갈림). tone 개념은 값(primary/secondary/neutral)으로 표현.
  - 시각 변화 없음(순수 rename/제거) — outlined-sub→outlined 흡수분만 weight medium→bold·text tone 미세 변화.

- b887f41: 캐포비 admin Input/Form 카탈로그 보강 — Figma 캐포비 Library InputGuide(3080:741) 정합.

  신규:
  - **FormSection** (`nds-form-section`) — 제목(Headline3 24 Bold) + 보더 카드(radius 16 cascade · border #EEE · 좌우 padding 24)로 여러 `FormField` 를 묶는 폼 그룹 컨테이너. 세로 리듬은 자식 `FormField density="admin"`(py-24) 이 만든다. react + styles + html 3면 미러. (Figma FormSection 3466:17405)
  - **SelectionButton** (`nds-selection-button`) — 단일 선택 버튼 standalone export. 그룹과 동일한 `nds-selection-button-group__item` 비주얼 공유(브랜드색 아웃라인 + selected 채움). `SelectionButtonGroup` 도 내부적으로 이 컴포넌트를 재사용하도록 정리. (Figma SelectionButton 3549:703)
  - **Field Width 스케일** — `sizing.fieldWidth` 토큰(xs 120 / sm 200 / md 304 / lg 400 / xl 488) 신설 + `fieldWidth` prop 을 `Input`·`Select` 에 추가(React `fieldWidth="md"` / HTML `field-width="md"`, full=100%). 인라인 width 대신 6단계 스케일로 통일. (Figma Field Width 3897:1578)

  문서:
  - MCP `cashwalk-biz-input` 가이드에 FormSection 컴포넌트·실제 `fieldWidth` prop·SelectionButton 단독·ActionChip 아이콘(slot/icon) 반영. figmaNodeUrl 을 InputGuide 루트(3080-741)로 갱신.
  - Storybook `FormSection` 스토리 + AllComponents 카탈로그(FormSection · SelectionButton · 아이콘 동반 ActionChip) 엔트리 추가.

  ActionChip 은 이미 `icon` prop(React)·`slot="icon"`(HTML)을 지원 — 예시/가이드에서 아이콘 사용을 명시적으로 노출. 더해서 14px 박스에서 얇은 스트로크 아이콘(InfoIcon 등)이 연하게 보이던 문제를 고침: `__icon` 색을 `iconRole.normal`(#666) → `iconRole.strong`(#333)으로, 슬롯 SVG 가 박스를 꽉 채우도록 `__icon > svg { width/height:100% }` 추가(HTML `slot="icon"` 로 넣은 find_icon SVG 도 안정 렌더).

- 501ff41: 캐포비 Figma "Neutral" tone 을 DS `neutral` 로 재매핑 + Weak/Outlined Neutral 색 정합 (Figma ButtonGuide 3098:1032).
  - **재매핑**: 기존엔 Figma "Neutral"(검정 #111 CTA)을 DS `secondary` 에 욱여넣었음(hack). 이제 **`color="neutral"` 이 캐포비 Neutral tone** — Figma 와 이름 일치.
    - Solid/Neutral = `neutral`+`solid` → bg #111/#333/#DDD · 흰 텍스트
    - Weak/Neutral = `neutral`+`soft` → bg #F5F5F5/#EEE/#FAFAFA · 텍스트 #111/#BBB
    - Outlined/Neutral = `neutral`+`outlined` → border #E7E7E7 · 텍스트 #111 · disabled #BBB
  - 캐포비 semantic 에 `buttonBg.neutral`·`buttonText.neutral`/`neutralDisabled` 추가(buttonBorder.neutral 은 기존 #E7E7E7).
  - **styleMap `neutral.soft`** 를 "연한 회색 fill + 진한 텍스트"(surface.section + textRole.strong)로 변경 — 전 브랜드 weak/neutral 에 적용(Weak/Neutral 패턴 정합). **react↔html `neutral.solid` drift 도 reconcile**(html 을 react 의 `cv.button.bgNeutral` 로 통일).
  - `secondary` tone 은 캐포비에서 옵션(Figma 미정의) — 하위호환용 검정값만 유지. 신규는 `color="neutral"`.
  - validator `neutral-solid-cta` 룰에 **캐포비 예외** 추가 — cashwalk-biz 는 neutral solid 가 #111 검정 CTA 라 정당(다른 브랜드는 cool-gray 라 경고 유지).
  - **버그 수정 — neutral solid 글자색**: 기존엔 solid neutral 텍스트가 brand 별 fill 명도와 안 맞아 밝은 fill 브랜드(geniet #ECECEC / runmile #F2F4F6)에서 흰 글자가 안 보였음. 전용 `--semantic-button-text-neutral-solid` 토큰 신설(fill 명도 대비: 어두운 fill=흰 / 밝은 fill=어두운 글자) + styleMap neutral.solid 텍스트를 이걸로 전환. cashpobi #111→흰, geniet→#666, runmile→#4E5968.
  - **"캐포비 secondary 없음" 가드 3중**: (1) React Button `BRAND_TONE_DENYLIST` dev console.warn, (2) validator 하드게이트 룰 `cashwalk-biz-no-secondary`, (3) MCP Button 가이드 pitfall. 캐포비 검정/회색 CTA 는 `color="neutral"`.

- 5973f82: 캐포비 어드민 `ConfirmTooltip` 신규 + 캐포비 `Tooltip` Figma 정합 (Figma 7dCJU5lNPfgcAjFPwbbLIu).

  **ConfirmTooltip (신규)** — 인라인 popconfirm. 흰 말풍선 + 제목/본문 + 1~2 액션 버튼(검정 secondary CTA) + 방향 tail.
  - `react`: `<ConfirmTooltip open title description actions={"dual"|"single"} placement confirmLabel cancelLabel bodyWidth onConfirm onCancel>{trigger}` — controlled.
  - `html`: `<nds-confirm-tooltip>` (light-DOM child = 트리거) + `nds-confirm-tooltip-confirm`/`nds-confirm-tooltip-cancel` 이벤트.
  - `styles`: `.nds-confirm-tooltip__*` 블록 — 색은 전부 semantic role 토큰(surface.default / textRole.strong·subtle / button.bgSecondary·textSecondary)이라 brand cascade 로 해석. radius(10/6)·본문 폭(280)은 geometry.
  - Tooltip(다크 hover 안내)과 분리 — 사용자의 응답/결정이 필요한 가벼운 확인용. 차단형·긴 본문은 Modal/Popup.

  **Tooltip (캐포비 정합)** — 다른 브랜드는 영향 없음.
  - `--nds-tooltip-bg` 슬롯 신설(미설정 시 `surface.inverse` fallback = 기존 동작). 캐포비만 brand 토큰맵에서 `--semantic-fill-neutral-default`(#333)로 override — base inverse(#111)가 아닌 Figma 다크그레이.
  - 캐포비 리치 본문(`[data-rich]`)을 Figma compact 스펙으로 정렬: padding 14/16, gap 6, 제목 13 Medium · 본문 12/18.

  MCP `COMPONENT_GUIDES.ConfirmTooltip` 등록 + Tooltip 가이드에 ConfirmTooltip 교차참조. Storybook 스토리 · AllComponents 카탈로그 · componentInventory 추가.

- 501ff41: `sizing.input.field` 44 → 48 정렬.

  기존 `field`(44)는 실사용처·Figma 근거 없는 고아 값이었고, `button.field`(48)와 이름은 같은데 높이가 달라 폼에서 버튼↔인풋이 4px 어긋나는 함정이었음. 이제 `field` = 폼 행 표준 높이(48)로 Button/Input 일관. (`input.field` 는 `default`(48)와 height 동일, labelGap 8 vs 12 만 차이. `input.compact`(40)·`fieldWidth` 는 유지.)

- fe39b07: 시멘틱 토큰 prefix 통일 — `--semantic-*` 가 색·여백을 모두 흡수.
  - **새 이름**: `--semantic-gap-{tight/default/comfortable/loose/wide}`, `--semantic-gap-title-{h1~h5}`, `--semantic-inset-{chip/input/card/card-large/modal}` 로 emit.
  - **옛 이름 호환**: `--gap-*`, `--gap-title-*`, `--inset-*` 는 `var(--semantic-...)` 의 deprecated alias 로 함께 emit. 외부 consumer 가 옛 이름을 그대로 사용해도 동작 (cascade 정상). 다음 major 에서 alias 제거 예정.
  - DS 내부 (`@nudge-design/react`, `@nudge-design/styles`, `@nudge-design/html`) 의 `var(--gap-*)` / `var(--inset-*)` 소비처 ~800 건 모두 `var(--semantic-...)` 로 마이그레이션. 외부 동작 동일.
  - MCP validator / guides 안내문도 새 prefix 로 갱신 (`pattern:semantic-spacing` 등).
  - 죽은 prefix `--eap-*` / `--color-semantic-*` 흔적도 함께 정리.

  prefix 의 의미가 명확해졌어요 — `--semantic-` 가 보이면 Figma 정합 SSOT, `--nds-` 가 보이면 DS 자체 컴포넌트 슬롯.

## 0.0.1

Initial release.
