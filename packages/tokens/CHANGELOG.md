# @nudge-design/tokens

## 0.0.4

### Patch Changes

- 3e8ac4c: 스토리북에만 살던 프로젝트 컴포넌트 보정값(--nds-\*)을 토큰 SSOT 로 회수
  - Trost/Geniet/Runmile/CashwalkBiz 의 칩·토글·바텀시트·카드·모달·인풋 테두리·푸터·페이지네이션 보정값이 이제 프로젝트 CSS(dist/{project}.css)에서 직접 나갑니다. 외부 프로젝트도 스토리북과 동일한 모습을 받습니다.
  - `--font-web` 별칭이 base 토큰에 추가됐습니다 (`var(--font-family-default)`).
  - Trost 의 `text-brand`(주황)·`border-brand`(#FFE600)·`text-inverse`(흰색)는 디자인 정의값으로 복원됐습니다 — 기존 스토리북 표시가 잘못된 값이었습니다.

- 6cf1c11: 캐포비 온보딩 목업 피드백 — DatePicker clear 겹침 수정 + Input error-message/full-width + 모달 pill 강제 + 가이드 보강
  - **DatePicker clear(×) 버그 수정** — `.nds-date-picker__clear` 의 `display:inline-flex` 가 `hidden` 속성을 덮어, 값이 없어도 × 가 떠 캘린더 아이콘과 겹쳤다. `:not([hidden])` 로 스코프 → 빈 값이면 × 숨고 캘린더 아이콘만(전 프로젝트).
  - **html `nds-input` 이 `error-message` 관측** — 기존엔 React `errorMessage` 만 있고 html 은 안 봐서 `error-message` 설정 시 조용히 실패했다. 이제 `error-message`(또는 `error`+`helper-text`)로 빨간 보더+인라인 에러가 뜬다(필드 검증 에러는 NoticeAlert 아님).
  - **`nds-input` flex-row 채움 robust** — root 에 `min-width:0` 추가(긴 값이 flex 행에서 넘치지 않게). 행 채움은 `full-width` 속성 사용(host=display:contents 라 CSS flex 무시).
  - **캐포비 모달 버튼 전부 pill 강제** — project-profiles `cashwalk-biz.modal.footerButtonShape="pill"` 데이터 선언 + validator `project-modal-footer-button-shape` 가 pill 누락 footer 버튼을 잡는다(보조 버튼에 shape 빠뜨려 각진 버튼 섞이는 재발 차단).
  - **가이드 보강**: 운영자 키워드(admin/백오피스) 영역 확답 하드스톱(claude-md), 온보딩 카드 패딩 48/내부 stretch(기본 16 override 필요 명시), NoticeAlert 필드에러 오용 금지, Modal 보조버튼 pill, Input 에러/full-width.

  검증: html nds-input error-message 테스트 + mockup-core pill validator 테스트 추가, DatePicker 빈값 clear 숨김 브라우저 재현 확인.

- 001e5e8: 외부 프로젝트(npm 소비) 정합 패치 — 3건:
  - **tokens**: 확장자 없는 `./css*` 서브패스에 `types` 조건 + `dist/css-stub.d.ts` 추가. TypeScript 6(새 Vite react-ts 템플릿 기본)에서 `import "@nudge-design/tokens/css"` 가 TS2882 로 깨지던 문제 해결.
  - **tokens/icons/react**: `sideEffects` 선언 추가 (tokens·icons `false`, react `["**/*.css"]`). 트리셰이킹이 살아나 소형 목업 기준 JS 번들 2,605 KB → 245 KB (gzip 625 → 75 KB).
  - **react**: `files: ["dist"]` 추가 — tarball 에 실리던 `src/`·`test/`·`.turbo/` 제거 (825 KB → 513 KB).

- 41bdf61: FormSection·Toggle 프로젝트 분기 → 토큰 슬롯 이전
  - **FormSection**: 캐포비 카드 radius 16 을 `[data-project]` 블록 → `components["form-section"].radius` 로 이전(`--nds-form-section-radius`, 컴포넌트는 이미 슬롯 소비 중).
  - **Toggle**: 캐포비 admin ON 트랙 초록 + 초록 트랙 위 라벨 흰색을 `[data-project]` 블록 → `components.toggle.trackActiveBg`/`labelActiveColor` 로 이전(`--nds-toggle-track-active-bg`/`--nds-toggle-label-active-color`). disabled 회색은 cascade 그대로 유지.

  렌더 동일(faithful refactor). 컴포넌트에서 `[data-project]` 색 분기 제거 — CLAUDE.md 슬롯 합성 패턴 적용.

- 665ca93: 지니어트 Alert·Section/Container 정합 — Figma Library 가이드
  - **Alert (1054:30)**: 인라인 NoticeAlert 컨테이너 radius 를 **Shape/MD 8**(base lg 12)로 — Alert 가이드·Radius 가이드 모두 8 명시. `--nds-notice-alert-radius` 슬롯 신설(기본 12, 타 프로젝트 유지). 5색 variant·아이콘 20×20·Body3 Medium 은 시멘틱/기본값으로 이미 정합.
  - **Section/Container (1385:13)**: Container PC max-width **1200→1280**(`--grid-content-pc`). side padding 40 = base minMargin, mobile 16 = base 라 그대로. Section 은 컴포넌트 아님(페이지 레이아웃 가이드) — 토큰화 대상은 grid 뿐.

- 135c86a: 지니어트 브랜드 컬러 갱신 — Figma Library 컬러/시멘틱 가이드 정합
  - 프로젝트 액션 색을 mint/500(#48C2C5) → **mint/600(#00A8AC)** 로 한 단계 깊게 조정. hover=mint/700(#008286), pressed=mint/800(#005A5C) 정식 램프 적용. bg/text/icon/border/fill/input-focus 의 project 슬롯과 chip 선택·toggle 활성도 함께 mint/600 으로 정렬.
  - atomic 팔레트를 50~900 풀 10-step 으로 확장(가이드 1:1). 그레이 램프를 표준 10-step 으로 리넘버(구 #BBBBBB 단계 제거, 900=#111111).
  - 상태 배경(success/error/info/caution)을 더 옅은 /50 톤으로 조정.
  - Solid Secondary 버튼을 옅은 mint subtle(#F2FAFA + project mint 텍스트)로 변경 — 구버전의 dark-inverse(#333) 패턴 폐기.

- 942bf66: 버튼 사이즈 프로젝트 오버라이드 + Mini 신규 — 지니어트 ButtonGuide(3047:1032)
  - **Mini(32) 사이즈 신규** — `sizing.button.mini = 32`(DESIGN.md SSOT). react·html Button 에 `size="mini"` 추가(px 12·Caption1·icon 16·gap 4). 전 프로젝트 사용 가능.
  - **버튼 높이 프로젝트 오버라이드** — `--nds-button-height-{size}` 슬롯으로 size별 높이를 프로젝트가 덮을 수 있게(react·html 미러). 미설정 프로젝트는 base `sizing.button` fallback 유지.
  - **지니어트**: S **42→40**, XS **38→36** (`button.heightSm/heightXs`). 나머지 size·타 프로젝트는 변화 없음.
  - 푸터/헤더는 토큰 구동이라 컬러 단계의 mint/600 업데이트가 이미 반영됨(별도 변경 없음).

- 051a2b4: 지니어트 Chip 치수 정합 — Badge&Chip 가이드(3058:84)

  Chip 치수를 `--nds-chip-*` 슬롯으로 토큰화(react·html 미러). 미설정 프로젝트는 기존 size(sm/md) 토큰값 fallback 유지 — 타 프로젝트 영향 없음.
  - 지니어트: 높이 **32px 고정**("다른 크기는 padding 조절"), padding **6/14**, **Medium(500) 13px** (구 Bold 14/h28). pill·선택색은 직전 커밋에서 반영 완료.
  - 신설 슬롯: `--nds-chip-height` / `-padding-x` / `-padding-y` / `-font-size` / `-line-height` / `-font-weight`.

- 375be74: 지니어트 Toggle·Tab·Pagination·Control 컴포넌트 정합 — Figma Library 가이드

  프로젝트 토큰 슬롯으로만 반영(컴포넌트 프로젝트 분기 없음, 타 프로젝트는 기존값 유지).
  - **Toggle/Control (171:9904)**: 토글 트랙 40×24 → **51×31**, 썸 27·여백 2·이동 20. checkcircle/radio **24×24** (off=gray, on=project mint). Radio 에 `--nds-radio-size` 슬롯 신설(기본 20px).
  - **Tab (3132:94585)**: Chip 스타일 active = **흑백 #111**(`--nds-tab-chip-selected-bg` → bg-inverse). Underline 은 tone=color 로 mint(시멘틱 자동).
  - **Pagination (3216:1930)**: active 페이지 = **흑백 #111** + radius 4 + cell 28, 화살표 아이콘 **24×24 gray/600**. Pagination 에 `--nds-pagination-arrow-size/-color` 슬롯 신설(기본 16px·subtle).

- e23b5d1: 지니어트 래디우스·칩 갱신 — Figma Library Radius/Badge&Chip 가이드 정합
  - **Radius (3134:2)**: Shape 시멘틱 스케일로 표준화 — 구 Geniet 고유 곡률(xs:4·sm:6·xl:18·2xl:23) → none:0·xs:2·sm:4·md:8·lg:12·xl:16·2xl:24·pill:9999. 컴포넌트 매핑도 가이드대로: Card 8→12(LG)·Modal 8→16(XL)·Bottom Sheet 18→16(XL).
  - **Badge & Chip (3058:84)**: Chip Selected 색을 가이드대로 환원 — Mint/50 bg + Mint/600 text(옅은 필터 칩). 직전 컬러 작업에서 mint/600 solid+흰 텍스트로 과교정했던 것을 바로잡음. (Chip 은 이미 Pill, Badge 는 시멘틱 슬롯 구동이라 토큰 변경 불필요.)
  - **Border (3135:2)**: 변경 없음 — width(0/1/2)·stroke(none/default/focus)는 base 와 동일, border 색은 컬러 단계에서 이미 반영됨.

- 37cdb34: 지니어트 Toast 배경/그림자 정합 — Toast 가이드(1330:2)
  - Toast 배경 = **Black(#111)/0.92**, 그림자 = **drop y8·blur24·18% black** (`--nds-toast-bg` / `--nds-toast-shadow` 슬롯).
  - 직전 Elevation 작업에서 토스트 그림자를 E1 Subtle(옅은 회색)로 잘못 둔 것을 전용 Toast 가이드 값으로 정정.
  - Modal(3079:1718)·Tooltip(1380:13)은 기존 토큰으로 이미 정합 — Modal radius 16(XL)·E3 그림자·confirm=project mint, Tooltip bg #333·white caption1·padding 14/16·radius 8. 변경 없음.

- 3b73446: 지니어트 타이포·엘리베이션·스페이싱 갱신 — Figma Library 가이드 정합
  - **Typography (3013:2)**: 14-step 스케일(Display 1~3 + Headline 1~5 + Body 1~3 + Caption 1~2 + Label)로 정렬. 구버전 Title/Subtitle best-fit 매핑(headline1=22 등) 폐기 → base 표준 램프와 동일(headline1=36/48). Display 티어(52/48/40) 신규 노출.
  - **Elevation (3031:6)**: 4-level E0~E3 — subtle `0 2px 6px rgba(221,221,221,.6)` / default `0 3px 15px rgba(0,0,0,.1)` / overlay `0 12px 32px rgba(0,0,0,.16)`. 토스트는 E1 Subtle.
  - **Spacing (3034:2)**: Gap(default 10→8, section 40 신규) · Inset(chip 8→6, button 14·section 32 신규) 시멘틱 토큰을 가이드 값으로 override.

- 268ebe4: 입력 라벨 간격 토큰 통일(`--semantic-gap-label` 8px) + AudioPlayer skip 아이콘 색 보정
  - 신규 토큰 **`--semantic-gap-label`(8px)** — 입력 계열 전체(Input·Textarea·Select·TagInput·TimePicker·PhoneInput·AmountInput·SearchInput·AddressPicker) + FormField top-label 의 라벨↔컨트롤 세로 간격 SSOT. 기존 12px/10px 혼재와 Select/TagInput/TimePicker 의 `gap 8 + margin 4` 계산식을 단일 토큰 참조로 통일 — 라벨이 입력을 더 바짝 끌어안도록 8px 로 좁힘. 라벨 폰트는 이미 caption1(13px)로 통일된 상태 유지. 프로젝트/인스턴스는 `--semantic-gap-label`(또는 컴포넌트별 `--nds-*-label-gap`) override 로 조정 가능.
  - AudioPlayer 좌우(skip) 버튼 아이콘 색: `iconRole.strong`(#383838, 거의 검정) → `iconRole.normal`(#666). 보조 컨트롤을 가운데 play(프로젝트)보다 디엠퍼사이즈.

  렌더 영향: 입력 라벨↔필드 간격이 소폭 좁아짐(12→8px), AudioPlayer skip 아이콘 외곽선이 부드러워짐. **공개 API 변경 없음.**

- eab0abc: 입력 타이포 통일 — 라벨·헬퍼 글자 크기를 한 기준으로 정렬

  입력 폼 계열(인풋·텍스트영역·셀렉트·폼필드·태그·전화·금액·검색·주소·채팅·날짜/기간 선택·시간선택·수량입력·자동완성)의 글자 크기를 **하나의 기준(Input Typography 표준, Figma 4247:1964)** 으로 맞췄습니다. 프로젝트와 무관하게 모든 프로젝트에 동일하게 적용됩니다.
  - **라벨**: 13px / 줄높이 18 · Medium (이전 14px에서 통일)
  - **입력값·placeholder**: 15px / 줄높이 22 · Regular (그대로 — 색만 placeholder가 흐리게)
  - **헬퍼·에러 안내문**: 13px / 줄높이 18 · Regular (이전 12px에서 통일, 같은 자리에서 색만 교체)

  글자 크기와 줄높이는 한 토큰으로 묶고 굵기는 따로 적용하도록 정리해서, 앞으로 입력 타이포를 조정할 때 토큰 한 곳만 바꾸면 전 입력 컴포넌트에 반영됩니다. 셀렉트·날짜/시간 선택의 **선택값(트리거) 텍스트도 15/22로 통일**했습니다 — 특히 캐시워크 비즈는 기존 14px 조밀 폰트 override를 걷어내고 표준 15/22로 정렬했습니다(날짜 트리거 14→15). 글자수 카운터도 같은 줄의 헬퍼와 크기를 맞춰 13으로 정렬했습니다(색만 흐리게).

  새 토큰: `--semantic-input-typography-{label,value,helper}`(크기+줄높이 묶음) + `-weight`(굵기 분리), 헬퍼 `cv.inputTypography`. 더불어 전 14개 타이포 스케일에 묶음 토큰 `--font-{scale}`(예: `--font-body-2: 15px/22px`)을 추가했습니다.

- 60db43c: List 썸네일 레이아웃(xl·h96) 추가 + 행 높이 정합, Card 지니어트 배치 가이드 반영

  **List**
  - 음식·콘텐츠용 **썸네일 레이아웃 `size='xl'`(72×72 썸네일 + 제목/메타 → 행 높이 96)** 추가.
  - 행 높이를 **밀도별 최소 높이(40/56/72/96)** 로 고정해 가이드·Figma 와 일치시켰습니다. 이전엔 여백 합산으로 높이가 떠서 기본 행이 56이 아닌 48로 보이거나 아바타 행이 72가 아닌 80으로 벌어지던 문제가 정리됩니다. (새 토큰 `sizing.listRow`)
  - 가이드를 4가지 표준 Layout(Default·Avatar·Thumbnail·Action)으로 정리하고, 상황별 어떤 Layout 을 쓸지·묶음 규칙(구분선·섹션 간격·빈 상태·로딩)을 보강했습니다.

  **Card**
  - 지니어트 카드 가이드(배치·크기 축 Horizontal/Vertical/Grid/Container)를 가이드에 반영했습니다. 기존 콘텐츠 축(List/Thumb/Cover)은 그대로 두고, 배치별 크기·radius·사용 케이스 매핑을 더했습니다.

  타이포·색 등 나머지 규격은 프로젝트와 무관한 기존 표준을 유지하며, 프로젝트별 Figma 가이드 노드는 한 가이드에 **references 로 누적**(프로젝트마다 추가)되도록 했습니다.

- f91ad95: 패키지를 Node-로더블 ESM 으로 전환 (번들러 없이도 동작):
  - 전 패키지 `"type": "module"` + tsc `module: NodeNext` 전환, 소스 상대 임포트에 `.js` 확장자 명시 (NodeNext 가 컴파일 타임에 강제).
  - exports 맵에 `default` 조건 추가 — Node ≥22 `require(esm)` 으로 CJS 소비도 동작.
  - 효과: Next.js SSR/RSC 를 `transpilePackages` 없이 사용 가능, Node 스크립트·tsx·vitest(외부화 모드)에서 직접 import 가능. Vite 목업 플로우는 동작·번들 크기 변화 없음 (실측 245 KB 유지).
  - icons 생성기(`scripts/generate.cjs`)가 barrels 에 `.js` specifier 를 emit 하도록 갱신. dist 는 per-file 산출 유지 — catalog/project-completeness/MCPB 패킹 등 dist 레이아웃 의존 툴링 영향 없음.

- bdfea38: Pagination boxed re-skin → 토큰 슬롯 + Tooltip 캐포비 rich-compact 분기 제거
  - **Pagination**: 캐포비 boxed 페이지네이션(테두리 박스·active 검정·boxed disabled)을 `[data-project]` cascade → 프로젝트 슬롯(`components.pagination`)으로 이전. base(다른 프로젝트)는 테두리 없는 투명 버튼(fallback). 렌더 동일.
  - **Tooltip**: 캐포비 리치-compact `[data-project]` 분기 제거 — 긴 본문(3줄+)은 가이드상 Modal/Notice 로 분리하므로 툴팁 전용 compact 타이포/여백 분기 불필요. 배경(#333)은 기존 `--nds-tooltip-bg` 슬롯 그대로.

- 31e9245: 빈 별 색 토큰화 — 별점 컴포넌트의 하드코딩 `#E0E0E0`(팔레트 밖 색) 제거

  ReviewCard·StarRating·MediaCard 가 각자 빈 별 색을 raw hex `#E0E0E0` 로 박고 있었음(3중 중복). 팔레트 내 최근접 그레이 `neutral[300]`(#D8D8D8)을 기본값으로 하는 `--nds-rating-star-empty` 슬롯을 신설(채움색 `--nds-rating-star` 와 대칭)하고 세 컴포넌트(react+html)가 이를 `style` 로 참조하도록 통일. 프로젝트가 빈 별 색을 override 할 수 있게 됨.

- 2b51ea7: 프로젝트 전용 위젯·로고 정리 + 프로젝트 띠 배너 일반화 (chrome 정리 후속)

  **BREAKING — 공개 API 제거**
  - `@nudge-design/react`: 트로스트 서비스 위젯 4종(`TrostEAPBanner`·`TrostSearchForm`·`TrostLoginSection`·`TrostAppDownloadButton`)과 프로젝트 전용 `NudgeEAPLogo` 컴포넌트를 제거했습니다. 모두 목업 전용이라 공개 react 패키지에서 빠집니다.
  - `@nudge-design/tokens`: 위 위젯에서만 쓰던 `trostEapBanner` 토큰을 제거했습니다.

  **대체 / 이관**
  - 트로스트 EAP 배너는 목업 셸 `nds-project-chrome` 의 **프로젝트 무관 `banner` 영역**으로 일반화됐습니다. 어느 프로젝트든 `PROJECT_DATA[project].banner = { strong, text, ctaPrefix?, ctaAccent?, ctaSuffix?, href }` 만 주입하면 데스크탑 헤더 상단에 띠 배너가 렌더되고, 색은 `--nds-project-banner-*` 슬롯으로 프로젝트별 override 가능합니다(컴포넌트에 프로젝트 분기 없음). (`@nudge-design/html`)
  - `NudgeEAPLogo` 의 6변종(koen/ko/en/en-dark/symbol) + DAIN 마크는 `@nudge-design/assets` SSOT 로 이관됐습니다. 로고는 `ProjectLogo` / 프로젝트 데이터로 쓰세요.

- 46d4d87: SelectedItemsPanel·TagInput 프로젝트 색/radius 분기 → 토큰 슬롯 이전

  캐포비 admin 의 색·radius `[data-project]` 분기를 프로젝트 슬롯으로 이전(렌더 동일). 삭제 글리프(원형 serchdelete `::before`)는 *요소 교체=구조적*이라 `[data-project]` 유지.
  - **SelectedItemsPanel**: 행 gray fill + radius 10 → `components["selected-item-row"].bg/radius` (`--nds-selected-item-row-bg/radius`).
  - **TagInput**: add 버튼 neutral 색(Secondary tone 부재) + stacked 태그 gray fill/radius → `components["tag-input"].addBg/addColor/stackedBg/stackedRadius`.

- 2d6463a: Snackbar 프로젝트 분기 → 토큰 슬롯 이전 (variant×project 합성 패턴 시작)

  캐포비 Snackbar 흰카드를 `[data-project]` cascade 블록에서 프로젝트 토큰 슬롯으로 이전. 렌더 결과는 동일(faithful refactor), 컴포넌트가 프로젝트를 모르게 됨.
  - 컴포넌트 root 가 3단 `var()` 체인으로 색을 합성: `--nds-snackbar-bg`(프로젝트 서피스 override) > `--nds-snackbar-variant-bg`(variant) > 기본. variant 룰은 `background` 직접 박기 대신 `--nds-snackbar-variant-bg` 슬롯만 set.
  - 캐포비 흰카드/그림자/큰 타이틀·아이콘/회색 닫기를 `cashwalk-biz.ts` `components.snackbar` 로 emit (`--nds-snackbar-bg/border/shadow/title-font-size/title-line-height/icon-size/close-color/close-opacity`). `[data-project]` 블록 제거.
  - variant 색 커스텀은 글로벌 `--semantic-bg-status-*` 그대로 — 프로젝트가 status 색 바꾸면 전 컴포넌트 cascade.

  (설계·원칙은 CLAUDE.md '색은 슬롯에 넣고 우선순위로 합성' 참조.)

- c995f79: 컴포넌트 리네임(BREAKING) 2건 + Button outline neutral 글자색 버그 수정 + TimePicker UI 개선
  - **BREAKING — `Tabs` → `Tab` 리네임.** react `Tabs`/`Tabs.Root/List/Trigger/Panel` → `Tab`/`Tab.Root/List/Trigger/Panel`, 타입 `TabsVariant/Size/Tone` → `TabVariant/Size/Tone`. html `<nds-tabs>` → `<nds-tab>`(클래스 `nds-tabs__*` → `nds-tab__*`), 캐포비 프로젝트 슬롯 `--nds-tabs-*` → `--nds-tab-*`. variant(line/chip/segment)·prop·동작은 그대로.
  - **BREAKING — `EmptyState` → `ResultState` 리네임.** 빈 상태(empty)뿐 아니라 결과 화면(success/error/info status)까지 포괄하도록 의미 확장에 맞춰 이름 변경. react `EmptyState` → `ResultState`, html `<nds-empty-state>` → `<nds-result-state>`. props·status·동작 동일.
  - **Button outline×neutral 글자색 버그 수정.** NudgeEAP/Trost 기본 테마에서 outline neutral 버튼의 텍스트가 흰색(#FFFFFF)이라 흰 배경 위에서 보이지 않던 문제를, 가이드 SSOT 값(#383838)으로 교정.
  - **TimePicker UI 개선.** 시/분 옵션 터치 타깃 확대(34→40px)·스크롤 스냅 정렬·컬럼 헤더 구분선·필드 hover 보더 등 웹/앱 공용 다듬기(토큰 기반, 동작 변화 없음).

  마이그레이션: `Tabs`/`EmptyState` import·태그를 `Tab`/`ResultState`(`nds-tab`/`nds-result-state`)로 교체하세요.

- a5f7eda: 트로스트 Button·Tab·Badge·Chip 컴포넌트를 새 Figma 가이드에 맞춰 정리했어요.
  - **버튼** — 트로스트 버튼 체계를 가이드대로 정돈했습니다. 검정 메인 버튼(Primary)·노랑 긍정 버튼(구독·확인)·옅은 블루 보조 버튼·흰색 외곽선 버튼을 각각 제대로 된 색으로 표현하고, Small 사이즈를 40px로, 보조(블루) 버튼 배경을 가이드값으로, 비활성 색을 조금 진한 회색(#D8D8D8)으로 맞췄습니다. (검정 메인 버튼은 `color="neutral"`, 노랑은 `color="primary"` — 자세한 매핑은 Button 가이드 참고.)
  - **탭** — 트로스트 탭의 '선택됨' 강조색이 노랑에서 **코발트 블루(포인트 컬러)**로 바뀌었습니다. 노랑은 글자·밑줄처럼 얇은 요소에서 잘 안 보여, 탭 강조는 포인트 블루로 분리했어요. Line·Chip·Segment 세 유형 모두 적용됩니다. (다른 프로젝트는 기존 강조색 그대로.)
  - **배지** — 배지에 **점(dot)**과 **숫자 카운터(count)** 유형을 추가했습니다. 기존 텍스트 배지(label)는 그대로 동작하고, 알림 표시용 작은 점(8×8)과 개수 표시용 원형 숫자 배지를 새로 쓸 수 있어요.
  - **칩** — 트로스트 선택 칩의 '선택됨' 모양이 진한 검정 채움에서 **노랑 테두리 + 옅은 노랑 배경 + 주황 글자** 강조로 바뀌었습니다(가이드 정합). 칩 높이는 30px.
  - 가이드(MCP)에 트로스트 Figma 노드와 위 내용이 함께 반영됐습니다.

- 27a44be: 트로스트 Card·List·Bottom Sheet·Alert(Notice)·Section/Container를 새 Figma 가이드에 맞춰 정리했어요. 모두 **기존 사용법·다른 프로젝트 화면은 그대로** 두고, 트로스트 가이드 값은 새 옵션이나 프로젝트 토큰으로만 더했습니다.
  - **카드(Card)** — PC/모바일 플랫폼별 크기(여백·모서리·제목 크기)와 강조 단계(Outline 테두리 / Elevated 그림자)를 고를 수 있게 했어요. 아이콘+제목+부제 헤더와 헤더↔본문 구분선도 켜고 끌 수 있습니다. 전부 새 옵션이라 켜야만 적용돼, 기존 카드는 그대로 보입니다.
  - **리스트(List)** — PC/모바일 × 레이아웃(기본·아바타·썸네일·액션·컴팩트·테이블) 9가지 조합을 정식 지원합니다. 조합별 행 높이, 행 사이 구분선 들여쓰기, PC 테이블(여러 컬럼+상태), 모바일 썸네일 액션 링크까지 가이드대로 맞췄어요. 기존 `size` 는 그대로 두고 새 `layout` 으로 자연스럽게 넘어갈 수 있습니다.
  - **바텀시트(Bottom Sheet)** — 트로스트 시트 모서리(20)·드래그 핸들(40×4)·하단 safe-area 를 가이드값으로 맞추고, Share·Info·List 3가지 구성 예시(전화 원형 버튼·강조 박스·CTA)를 포인트(코발트) 토큰으로 정리했어요. 드래그로 닫기·스냅포인트 같은 동작은 다음 단계로 분리했습니다.
  - **알림 박스(Alert/Notice)** — 주의(Caution) 배경을 회색에서 **옐로우**로 바로잡고(가이드·패턴 정합), 컨테이너 여백·간격·높이(1줄 52/2줄 72)·본문 굵기를 패턴 기준으로 정렬했어요. 트로스트는 Notice 를 중립 톤으로, 본문 글자색을 통일하고 모서리를 8 로 맞췄습니다(다른 프로젝트는 기존 그대로).
  - **섹션/컨테이너(Section/Container)** — 페이지 콘텐츠 폭 표준(모바일 360 / PC 1080 / 와이드 1200)을 `.nds-container--pc`·`.nds-container--wide` 로 추가하고, 가이드(패턴)를 트로스트 기준으로 새로 정리했습니다. 기본 컨테이너 동작은 그대로라 다른 프로젝트 화면은 영향이 없어요.
  - 가이드(MCP)에 위 내용과 트로스트 Figma 노드(Card 5123:136 · List 5169:118 · BottomSheet 5258:128 · Alert 5283:206 · Section/Container 5303:111)가 함께 반영됐습니다.

- 7405016: 트로스트 컬러·타이포 토큰을 새 Figma 가이드에 맞춰 정비했어요.
  - 본문/제목 글자색이 가이드 기준으로 한 단계 정돈됐고(강세 텍스트가 순검정 대신 진회색), 상태색(성공/오류/정보)과 노란 프로젝트 강조·테두리 톤이 가이드값으로 맞춰졌습니다.
  - 코발트(파랑) **포인트 컬러**가 정식 색 역할로 추가됐어요 — 배경/글자/아이콘/테두리/채움 어디서든 보조 강조색으로 쓸 수 있습니다.
  - 트로스트 타이포 일부 크기 보정(헤드라인4 20px, 라벨 11px).
  - Tailwind 프리셋: 트로스트 색 유틸리티가 풀 스케일로 바뀌었습니다(`trost-yellow-500` 등 숫자 단계, `trost-red/blue/green-*` 추가). 기존 `trost-yellow-primary`·`status-*` 클래스명은 사용하지 않습니다.

- 2effb30: 트로스트 컴포넌트 Figma 가이드 동기화 — Controls·Modal·Toast·Tooltip
  - **Controls(체크박스·라디오·토글)**: 트로스트 on(checked) 상태를 프로젝트 노랑 대신 다크(#333) 채움 + 흰 체크/점으로(노랑 위 가독성), 컨트롤 크기 24×24, 토글 트랙 50×30 (Controls 가이드 5158:108). 체크색은 새 토큰 슬롯(`--nds-checkbox-checked-bg/-checked-border/-check-color`, `--nds-radio-checked-color`)으로 분리 — 다른 프로젝트는 기존 `fill.brand` fallback 유지(무변화).
  - **Modal**: 확인 CTA 텍스트색을 `confirmCta.text` 로 정렬(노랑 위 흰 글씨 회귀 해소 — 트로스트 노랑+검은 글씨 자동). 비가역 액션용 `confirmTone="destructive"`(검정 Neutral CTA + 흰 텍스트) prop 추가. 트로스트 모달 상단 패딩 24(`--nds-modal-pad-top`). HTML(`<nds-modal>`)은 footer 가 consumer slot 이라 destructive 확정 = `<nds-button color="neutral">`.
  - **Toast**: 트로스트 그림자를 drop y8·blur24·18% 로(가이드 806:1277).
  - **Tooltip**: 기존 스펙이 이미 정합(가이드 806:1278) — figmaNodeUrl·문서만 갱신.
  - 컴포넌트 가이드 `figmaNodeUrl` 을 트로스트 라이브러리로 갱신 + Controls/Toast/Tooltip 스펙 보강.

- e94bac4: 트로스트 간격·모서리·그림자 토큰을 새 Figma 가이드에 맞췄어요.
  - **간격(Spacing)**: 기본 요소 간격이 8px로, 섹션 단위 간격(40)·버튼/섹션 안쪽 여백이 가이드 기준으로 정리됐고, 칩 안쪽 여백이 6px로 조정됐습니다.
  - **모서리(Radius)**: 의미 기반 단계가 재정비됐습니다 — 카드/버튼 기본 8, 인풋·칩 6, 모달 16, 바텀시트 24. 라운드가 전반적으로 한 톤 정돈됩니다.
  - **테두리 두께**: Hairline/Default 1 · Strong(포커스) 1.5 · Bold(강조/오류) 2 스케일 추가.
  - **그림자(Elevation)**: 6단계(E0~E5)의 더 자연스러운 2겹 그림자로 교체 — 카드·모달·다이얼로그까지 깊이 단계가 세분화됐습니다.

## 0.0.3

### Patch Changes

- a2ff1a0: 프로젝트 프로필(project-profiles) 신설 — 프로젝트별 의미/정책 차이를 한 파일의 데이터로 수렴.
  검정 CTA 매핑(캐포비 neutral · Geniet secondary), 금지 Button color, 모달 정책(confirm 검정 CTA·단일버튼 hug·세로스택 금지), 알림 컴포넌트 금지(캐포비 Toast), 어드민 Page Pattern System 적용 여부, slug 별칭(cashpobi 등)이 들어간다. 목업 validator 는 이제 프로젝트 slug 를 하드코딩하지 않고 프로필을 읽는다 — 새 프로젝트가 같은 정책을 선언하면 검증룰이 코드 수정 없이 그대로 적용된다.

  룰 id 일반화: 프로필 정책 룰 5종의 validator 룰 id 가 프로젝트 중립으로 바뀐다 —
  `cashwalk-biz-no-secondary`→`project-denied-button-color` · `cashwalk-biz-toast`→`project-banned-notification` · `cashwalk-biz-modal-primary-cta`→`project-modal-confirm-cta` · `cashwalk-biz-modal-single-button-fullwidth`→`project-modal-single-button-fullwidth` · `cashwalk-biz-modal-footer-stacked`→`project-modal-footer-stacked`. (캐포비 어드민 패턴 시스템 콘텐츠 룰 `cashwalk-biz-*` 는 유지.)

- e7a2978: 캐포비 admin input placeholder/helper 텍스트 색 정합 (Figma TextField 3447-467)
  - `input.placeholder` #DDD(Neutral400) → #BBB(Neutral500) — Figma 라이브러리 SSOT 정합 + 대비(a11y) 개선.
  - `input.helpertextDefault` #BBB(Neutral500) → #666(Neutral700 = text.subtle) — 기존 "가이드 미정의" 추정값 교정(Geniet 와 동일 톤). 전 캐포비 input 에 프로젝트 cascade 로 전파.

- 7a04a69: 약관동의 [필수] 자동 강조 · 캐포비 모달/팝업 검정 CTA 회귀(노랑) 정착 · 온보딩 풀폭 CTA 게이트

  세 가지 반복 피드백을 DS 근본에서 닫는다.
  - **약관동의 [필수] 강조 누락(반복)** — CheckboxGroup 이 `badge` 에 "필수" 가 들어있으면 `required` 를 따로 안 붙여도 자동으로 빨강+bold 강조하도록 했다(react/html 미러). 그동안 `required` opt-in 을 매번 누락해 회색으로 나오던 footgun 제거. 끄려면 `required={false}` 명시.
  - **캐포비 모달/팝업 버튼이 노랑(반복)** — 모달/팝업 confirm 버튼 색을 `[data-project="cashwalk-biz"]` CSS 캐스케이드 대신 신규 `--semantic-confirm-cta-*` 토큰으로 흐르게 바꿨다. 기존 캐스케이드는 `data-project` 속성을 쓰지 않는 standalone 목업(프로젝트 `:root` 교체식)에서 안 걸려 base 의 project 노랑이 새던 회귀의 원인이었다. 토큰은 목업·Storybook 양쪽에 적용되고, base 는 각 프로젝트 project 색을 참조하므로 캐포비만 검정(#111)으로 override 된다(타 프로젝트 무영향).
  - **온보딩 단일 CTA 가 좁게(반복)** — 온보딩 주 CTA(Primary solid)에 full-width 가 없으면 `validate_html_mockup` 이 `onboarding-cta-not-fullwidth` error 로 막는다. 작성자가 모달 단일버튼(우측 hug)과 혼동하던 회귀 차단. 가이드(pattern:cashwalk-biz-page-onboarding)도 명시 강화.

- 67741ea: Toast — Figma 가이드(1330:2) 정렬: 단일 다크 토스트로 정리

  Toast 디자인 가이드(Figma 1330:2)에 맞춰 컴포넌트를 **비차단형 단일 다크 메시지**로 재정의했다. 위치가 곧 형태다 — `top`(PC·상단 중앙·**pill**·패딩 16/32·body2) / `bottom`(모바일·하단·**rounded 24**·패딩 12/20·body3). 배경은 다크값(#212121·0.92) + 흰 텍스트, drop shadow(y8 blur12 18%) 추가.

  배경/그림자는 role-based 시멘틱 변수(Figma SSOT) 집합 밖이라 **`--nds-toast-bg` / `--nds-toast-shadow` 컴포넌트 토큰**으로 신설(base `nudge-eap` theme `components` 맵 → `:root` emit, 프로젝트 cascade 가능). styles 는 raw hex 없이 `var(--nds-toast-*)` 만 참조한다.

  **BREAKING**
  - **색 변형 제거** — `variant`(`success`/`error`/`warning`/`info`) 와 `ToastVariant` 타입을 삭제했다. Toast 는 단일 다크 스타일만 가진다. 심각한 오류·결정 요청은 Modal/Alert, 액션·닫기·프로젝트 카드(캐포비 흰 카드)는 Snackbar 로 라우팅. `error` 토스트의 `role=alert`/`aria-live=assertive` 도 함께 제거(모든 토스트 `role=status`·polite — 비차단형 일관).
  - **`top-right` position 제거** — `ToastPosition` 은 `top | bottom` 만 남는다(가이드 2-position 모델). 유일 소비처였던 캐포비 admin 은 이미 Toast 자체가 banned(Snackbar 만 사용).
  - **동시 1개 노출이 기본** — `maxCount` 기본값을 3 → **1** 로 변경(새 토스트가 기존을 즉시 대체). 스택이 필요하면 `maxCount` 를 올려 opt-in.

  기타: z-index 토큰 `toast` 1200 → **1500**(가이드 spec, Snackbar 와 공유). MCP 가이드(`component:Toast`)에 `figmaNodeUrl` 추가 + 단일 다크/2-position/1개 노출 모델로 갱신.

- 72d2018: Tooltip — Figma 가이드(1380:13) 규격 정렬

  Tooltip 을 디자인 가이드(Figma 1380:13) 스펙에 맞췄다. React/HTML 컴포넌트 구조·API·동작(hover·focus, show 200ms·hide 0ms, 4 position, 단일 노출)은 이미 부합해 변경 없이 **시각 규격(CSS·토큰)만** 정렬했다.
  - **단일 다크 톤 #333333** — 배경을 `surface.inverse`(#111) → `--nds-tooltip-bg`(#333333, **전 프로젝트 동일**)로. base `nudge-eap` theme 이 `:root` 로 emit. 기존 캐포비 전용 `tooltip.bg` 프로젝트 override 는 base 가 흡수해 **중복 제거**.
  - **본문** — Caption1 **Medium** 13/18(weight regular → medium), 흰 텍스트.
  - **패딩 14/16**(상하/좌우, 기존 8/12), radius 8 유지.
  - **꼬리 12×8 triangle** — 기존 8×8 rotate(45deg) 사각형 → border 로 그린 정삼각형(4 방향), 본체 외부 가운데에서 트리거 방향. 본체-트리거 8px 간격을 꼬리가 메운다.
  - **z-index** — `popup`(1100) → 신설 토큰 `tooltip`(**1400**, 모달·토스트 1500 보다 아래).

  MCP 가이드(`component:Tooltip`)에 `figmaNodeUrl` + 규격 갱신. 리치 본문(`<template slot="content">`)·캐포비 compact 타이포 override 는 유지.

## 0.0.2

### Patch Changes

- b887f41: Button Outlined/Primary 보더·텍스트를 전용 button-outlined 토큰으로 배선 + 캐포비 색 교정 (Figma ButtonGuide 3098:1179/1190).
  - **버그**: Button `primary.outlined` 가 `cv.borderRole.brand`/`cv.textRole.brand`(generic project 역할)을 직참조해, 전용 `--semantic-button-border-outlined-*`/`-text-project` 토큰을 무시하고 있었음. 그래서 캐포비 outline primary 가 project 노랑(#FFD200 보더 / #FEAF01 텍스트)으로 잘못 렌더됐고, geniet 도 의도값(#00A8AC) 대신 project(#48C2C5)로 렌더됨.
  - **수정(배선)**: react Button + html nds-button 의 `primary.outlined` enabled/hover/disabled 를 `cv.button.bgOutlined(/Hover/Disabled)` · `cv.button.textBrand` · `cv.button.borderOutlined(/Hover/Disabled)` 로 전환. 두 면 미러 동일.
  - **수정(캐포비 값)**: `buttonBorder.outlined.default`/`.hover` 와 `buttonText.project` 를 `yellow → neutral[900] #111` 로 교정. Figma: Outlined/Primary = 흰 bg + **검정(#111) 보더·텍스트**, hover 는 보더/텍스트 #111 유지 + bg 만 `#FFFEF5` 틴트. (bg·disabled 보더(#E7E7E7)는 기존값이 이미 정확.)
  - 결과: nudge/trost/runmile 무변화(전용 토큰이 이미 project색), geniet 은 의도값 #00A8AC 로 교정, **캐포비 outline primary = 검정(#111)**.
  - **추가 교정 — 캐포비 Solid/Neutral**: `buttonBg.secondary.default` `#000000 → neutral[900] #111` (Figma 3098:1095 = neutral/900, 순수 검정 아님). hover #333·disabled #DDD 은 기존값 일치.

- 501ff41: ⚠️ BREAKING — Button taxonomy 통일 (전 프로젝트).

  축 정리: `shape{default, pill}` × `variant{solid, soft, outlined}` × `color{primary, secondary, neutral}`.
  - **`assistive` → `neutral` 하드 rename** (alias 없음): 토큰 슬롯(`buttonBg/text/border.assistive` × 전 프로젝트 semantic), `cv.button` 멤버(`bgAssistive`→`bgNeutral` 등), CSS 변수 `--semantic-button-*-assistive-*` → `--semantic-button-*-neutral-*`, validator(html-validator·mockup-validator) 룰(`assistive-solid-cta`→`neutral-solid-cta`), MCP 가이드. → 외부 프로젝트에서 `<Button color="assistive">` / `--semantic-button-*-assistive-*` var 사용 시 **변경 필요**.
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
  - **styleMap `neutral.soft`** 를 "연한 회색 fill + 진한 텍스트"(surface.section + textRole.strong)로 변경 — 전 프로젝트 weak/neutral 에 적용(Weak/Neutral 패턴 정합). **react↔html `neutral.solid` drift 도 reconcile**(html 을 react 의 `cv.button.bgNeutral` 로 통일).
  - `secondary` tone 은 캐포비에서 옵션(Figma 미정의) — 하위호환용 검정값만 유지. 신규는 `color="neutral"`.
  - validator `neutral-solid-cta` 룰에 **캐포비 예외** 추가 — cashwalk-biz 는 neutral solid 가 #111 검정 CTA 라 정당(다른 프로젝트는 cool-gray 라 경고 유지).
  - **버그 수정 — neutral solid 글자색**: 기존엔 solid neutral 텍스트가 project 별 fill 명도와 안 맞아 밝은 fill 프로젝트(geniet #ECECEC / runmile #F2F4F6)에서 흰 글자가 안 보였음. 전용 `--semantic-button-text-neutral-solid` 토큰 신설(fill 명도 대비: 어두운 fill=흰 / 밝은 fill=어두운 글자) + styleMap neutral.solid 텍스트를 이걸로 전환. cashpobi #111→흰, geniet→#666, runmile→#4E5968.
  - **"캐포비 secondary 없음" 가드 3중**: (1) React Button `PROJECT_TONE_DENYLIST` dev console.warn, (2) validator 하드게이트 룰 `cashwalk-biz-no-secondary`, (3) MCP Button 가이드 pitfall. 캐포비 검정/회색 CTA 는 `color="neutral"`.

- 5973f82: 캐포비 어드민 `ConfirmTooltip` 신규 + 캐포비 `Tooltip` Figma 정합 (Figma 7dCJU5lNPfgcAjFPwbbLIu).

  **ConfirmTooltip (신규)** — 인라인 popconfirm. 흰 말풍선 + 제목/본문 + 1~2 액션 버튼(검정 secondary CTA) + 방향 tail.
  - `react`: `<ConfirmTooltip open title description actions={"dual"|"single"} placement confirmLabel cancelLabel bodyWidth onConfirm onCancel>{trigger}` — controlled.
  - `html`: `<nds-confirm-tooltip>` (light-DOM child = 트리거) + `nds-confirm-tooltip-confirm`/`nds-confirm-tooltip-cancel` 이벤트.
  - `styles`: `.nds-confirm-tooltip__*` 블록 — 색은 전부 semantic role 토큰(surface.default / textRole.strong·subtle / button.bgSecondary·textSecondary)이라 project cascade 로 해석. radius(10/6)·본문 폭(280)은 geometry.
  - Tooltip(다크 hover 안내)과 분리 — 사용자의 응답/결정이 필요한 가벼운 확인용. 차단형·긴 본문은 Modal/Popup.

  **Tooltip (캐포비 정합)** — 다른 프로젝트는 영향 없음.
  - `--nds-tooltip-bg` 슬롯 신설(미설정 시 `surface.inverse` fallback = 기존 동작). 캐포비만 project 토큰맵에서 `--semantic-fill-neutral-default`(#333)로 override — base inverse(#111)가 아닌 Figma 다크그레이.
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
