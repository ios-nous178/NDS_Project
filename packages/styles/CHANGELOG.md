# @nudge-design/styles

## 0.0.4

### Patch Changes

- 936ff60: BottomNav 추가 — 모바일 하단 탭 바 공식 primitive (프로젝트 무관)
  - **신규 `BottomNav`** — compound + 슬롯 API. `<BottomNav activeKey onChange>` 안에 `<BottomNav.Item itemKey label icon activeIcon href badge>`. 활성/비활성 아이콘 분리, 우상단 배지, 키보드/aria(role=tablist·aria-current) 지원.
  - **프로젝트를 모르는 컴포넌트** — 색·배경·보더·높이는 전부 `--nds-bottomnav-*` 슬롯으로 노출되고 프로젝트 토큰이 값만 덮는다. 프로젝트별 아이콘/라벨은 호출부가 주입한다. (프로젝트별 `{Project}BottomNav` 래퍼를 대체하는 공개 primitive — 래퍼 정리는 후속 chrome 통합에서.)
  - **3면 미러** — react(`BottomNav`) ↔ styles(`.nds-bottom-nav`) ↔ html(`<nds-bottom-nav>` / `<nds-bottom-nav-item>`). html 은 slot=icon / slot=active-icon 으로 아이콘 주입, active-key 변경 시 자식 active 자동 좌표화.
  - MCP 가이드 신설 + validator 가 새 태그(`nds-bottom-nav` / `nds-bottom-nav-item`)를 인식.

- 6cf1c11: 캐포비 온보딩 목업 피드백 — DatePicker clear 겹침 수정 + Input error-message/full-width + 모달 pill 강제 + 가이드 보강
  - **DatePicker clear(×) 버그 수정** — `.nds-date-picker__clear` 의 `display:inline-flex` 가 `hidden` 속성을 덮어, 값이 없어도 × 가 떠 캘린더 아이콘과 겹쳤다. `:not([hidden])` 로 스코프 → 빈 값이면 × 숨고 캘린더 아이콘만(전 프로젝트).
  - **html `nds-input` 이 `error-message` 관측** — 기존엔 React `errorMessage` 만 있고 html 은 안 봐서 `error-message` 설정 시 조용히 실패했다. 이제 `error-message`(또는 `error`+`helper-text`)로 빨간 보더+인라인 에러가 뜬다(필드 검증 에러는 NoticeAlert 아님).
  - **`nds-input` flex-row 채움 robust** — root 에 `min-width:0` 추가(긴 값이 flex 행에서 넘치지 않게). 행 채움은 `full-width` 속성 사용(host=display:contents 라 CSS flex 무시).
  - **캐포비 모달 버튼 전부 pill 강제** — project-profiles `cashwalk-biz.modal.footerButtonShape="pill"` 데이터 선언 + validator `project-modal-footer-button-shape` 가 pill 누락 footer 버튼을 잡는다(보조 버튼에 shape 빠뜨려 각진 버튼 섞이는 재발 차단).
  - **가이드 보강**: 운영자 키워드(admin/백오피스) 영역 확답 하드스톱(claude-md), 온보딩 카드 패딩 48/내부 stretch(기본 16 override 필요 명시), NoticeAlert 필드에러 오용 금지, Modal 보조버튼 pill, Input 에러/full-width.

  검증: html nds-input error-message 테스트 + mockup-core pill validator 테스트 추가, DatePicker 빈값 clear 숨김 브라우저 재현 확인.

- eb0ea32: chrome 정리 — PageHeader 강등 + 프로젝트 chrome 19개 제거 (BREAKING)

  공개 면(react/html)은 프로젝트를 모르는 primitive 만 두고, 프로젝트 조립은 목업 전용
  `nds-project-chrome` 으로 모으는 정리. (chrome 통합 플랜 Phase 2 + Phase 4. Sidebar 흡수는 Phase 3 로 분리 진행 중.)

  **제거(BREAKING)**
  - **`PageHeader` 컴포넌트 제거** → `pattern:page-header` 로 강등. 페이지 헤더는 단일 컴포넌트가
    아니라 `Heading`(`level="h2" as="h1"`) + Breadcrumb + actions + (선택)Tab 조립이다. (Figma 가이드
    노드 없는 thin wrapper — MultiStepForm 선례와 동일.) react/styles/html 3면 + 스토리 + 문서 제거,
    새 패턴 가이드 `pattern:page-header` 신설.
  - **프로젝트별 chrome 컴포넌트 19개 제거** — `{Trost,Geniet,NudgeEAP,CashwalkBiz,Runmile}` 의
    AppBar·BottomNav·Footer·WebHeader·DesktopHeader·UtilityHeader·TabNavigation. 이들은 base
    primitive(Header/Footer/BottomNav)를 프로젝트 로고·기본값으로 감싼 얇은 래퍼였고, 목업 엔진은
    이미 html `nds-project-chrome`(`<nds-project-header project="...">` 등)만 사용한다.
    - **유지**: `NudgeEAPLogo`, 트로스트 서비스 위젯(EAPBanner·SearchForm·LoginSection·AppDownloadButton),
      그리고 목업 전용 html `nds-project-chrome` 패밀리(전 프로젝트 header/footer/bottomnav 커버).

  **대체 경로**
  - 프로젝트 화면 chrome → 목업: `<nds-project-header|footer|bottom-nav project="...">` (MCP `component:ProjectHeader` 등).
  - 공개 primitive 가 필요하면 `Header` / `BottomNav` / `Footer` + 프로젝트 토큰.
  - 페이지 헤더 → `pattern:page-header`(Heading 조합).

  **알려진 한계(후속)**: (캐시워크)트로스트 앱 BottomNav 변형(`cashwalk-trost`)은 `nds-project-bottom-nav`
  미지원 — 필요 시 PROJECT_DATA 에 variant 추가 또는 `BottomNav` primitive 로 직접 조립.

- 88807ea: 색맵 중복 제거 — Badge·Chip·FAB·Header·ValidationChip 색을 styles CSS 로 단일화

  variant/color/state 별 색을 react `.tsx` 와 html `nds-*.ts` 양쪽 JS 에 손으로 복제하던 5개
  컴포넌트를, 색을 `styles/src/<C>.ts` 의 `[data-variant]`/`[data-color]`/`[data-state]` CSS
  룰(`--nds-*-bg/fg/border` 슬롯) 한 곳으로 모았다. 이제 react/html 은 data-attribute 만 set
  하고 색 토큰은 JS 에 두지 않는다(시각 출력 불변 — variant×color 토큰 1:1 보존 검증).
  - **Badge·ValidationChip**: styles 파일 신설(이전엔 styles 파일 없이 양쪽 JS 인라인).
  - **FAB·Header**: 기존 `--nds-*` 슬롯에 `[data-color]`/`[data-variant]` CSS 룰 추가.
  - **Chip**: 색맵 제거 + react 의 `<style>` 자체 주입 제거 → 다른 컴포넌트처럼 번들
    `styles.css` 를 쓴다(중복 CSS 사본 제거). Chip 단독 사용 시 `styles.css` import 필요
    (전 컴포넌트 공통 요건과 동일).

  react↔html 색 드리프트는 신설 게이트 `check-style-token-parity` 가 계속 감시한다.

- 7f8c3d0: FloatingCtaBanner — 아이콘 없을 때 좌우 패딩 보정

  leadingIcon 이 없는 배너에서 좌측 패딩이 아이콘 기준(작은 값)으로 남아 텍스트가 pill 모서리에 붙던 문제를 고쳤습니다. 루트에 `data-has-icon` 을 부여하고, 아이콘이 없으면 좌우 패딩을 대칭으로 넓힙니다(PC 28 / Mobile 20). 아이콘이 있는 배너의 패딩은 그대로입니다. react·html 미러 동일 적용.

- 36b178c: 입력 패밀리 타이포 통일 — 필드 15(body2) · 라벨 14(body3)

  입력 컴포넌트들의 "입력 텍스트(필드값)"와 "폼 라벨" 글자 크기가 컴포넌트마다 제각각이던 것을 토큰으로 통일했다. raw px 가 아니라 typeScale 토큰으로 맞췄으므로 프로젝트 cascade 가 그대로 작동한다(base = 필드 15 / 라벨 14, cashwalk-biz 는 자기 조밀 스케일로 필드 14 / 라벨 13 — 프로젝트 내부 일관성 유지).

  **필드(입력값) 텍스트 → body2 로 통일**
  - Select·MultiSelect: 트리거(선택값)·드롭다운 옵션·검색·빈상태 (구 body3) → body2
  - TagInput: stacked·inline 입력 (구 body3) → body2
  - VerificationCodeInput: 코드 입력 (구 body1 16px) → body2 — "큰 숫자"가 아니라 미정합이었음
  - PhoneInput: 국가 선택 드롭다운 옵션 → body2 (다이얼/번호 박스는 기존 body2 유지)
  - (이미 body2 였던 Input·Textarea·SearchInput·AmountInput·ChatInput 은 불변)

  **폼 라벨 → body3 로 통일 (구 caption1 13px 에서 상향)**

  Input·Textarea·Select·SearchInput·AmountInput·PhoneInput·TagInput·FormField(default density)·AddressPicker·TimePicker 의 `__label`. (admin density 라벨 16px, Autocomplete 14px 는 그대로.)

  **그 외 정리(같은 패스)**
  - FormField 카운터 caption1(13) → caption2(12) — 같은 footer 행 helper(12)와 정합
  - ChatInput 전송 버튼 아이콘색 raw `#fff` → `--semantic-icon-inverse-default` 토큰
  - AmountInput preset pill radius 생값 `9999px` → `radius.pill` 토큰
  - MultiSelect 선택수 카운트·PhoneInput 다이얼 박스에 누락된 line-height 보강

  시각 출력은 base 기준 필드 +0~1px / 라벨 +1px 수준의 정합 조정이며 API 변화는 없다.

- 6cf1c11: List 에 header/footer 슬롯 추가 + 리뷰 리스트 패턴/가이드 정비 (리뷰 화면 목업 피드백)
  - **List `header`/`footer` 슬롯 신설** (react/styles/html 3면) — 리스트가 섹션 제목·"더 보기" 버튼·Pagination 을 직접 소유. role=presentation 이라 리스트 항목 수에 안 잡힘. 카드/divided 변형에선 header↔첫 아이템, 마지막 아이템↔footer 사이 구분선 자동.
  - **신규 `pattern:review-list` 가이드** — 리뷰 나열 = `List`(header/footer) + `ReviewCard` 아이템. '도움돼요'는 ReviewCard `footer` 슬롯(카드 안), '더 보기'는 List `footer`(모바일=full-width Button / 어드민=Pagination, 맥락별).
  - **ReviewCard 가이드 보강** — '도움돼요/좋아요/신고'는 반드시 `footer` 슬롯에(카드 밖 형제 금지) do/dont 예시 추가. 목업에서 액션 버튼이 카드 밖으로 떨어지는 오용 재발 방지.
  - **List 가이드** — header/footer 슬롯 용법 추가.

  컴포넌트 동작 변화 없음(순수 추가). 기존 List 사용처 영향 없음.

- f09304a: 네이밍 정합 + 데이터 카테고리 재구성 + MultiStepForm 패턴 강등
  - **ChatComposer → ChatInput 리네임 (BREAKING)** — Inputs 컴포넌트 중 유일하게 `<Thing>Input` 규칙을 벗어난 동사-명사(`Composer`) outlier 를 정렬. 가장 큰 채팅 SDK(Stream Chat·Sendbird)의 실제 입력바 컴포넌트명과 일치하고, 도메인('Chat')을 범용 입력 프리미티브 이름에서 분리. react `ChatInput`, html `<nds-chat-input>`, CSS `.nds-chat-input`. 짝 컴포넌트 `ChatBubble` 은 그대로 유지(Chat\* family). **소비자가 `ChatComposer` / `<nds-chat-composer>` 를 쓰고 있으면 `ChatInput` / `<nds-chat-input>` 으로 변경하세요.**
  - **OrderSummaryCard → SummaryCard 리네임 + de-domain (BREAKING)** — '주문(Order)' 도메인 색을 뺀 범용 요약 카드(라벨:값 + 합계). react `SummaryCard`, html `<nds-summary-card>`, CSS `.nds-summary-card`. **`OrderSummaryCard` / `<nds-order-summary-card>` import 를 `SummaryCard` / `<nds-summary-card>` 로 변경하세요.**
  - **MultiStepForm 제거 → 다단계 폼 패턴으로 강등 (BREAKING)** — 진행 표시·단계 헤더·이전/다음 풋터만 그리고 단계별 검증·데이터 보관 같은 어려운 상태머신은 `canProceed` boolean 으로 떠넘기던 얇은 셸. 실사용 0·Figma 가이드 노드 없음으로 DS 편입 기준 미충족. react `MultiStepForm`·`useMultiStepForm`, html `<nds-multi-step-form>`, styles 제거. 다단계 흐름은 **Stepper + Heading + FormSection + cta-group** 조립으로 — `get_guide({ topic: 'pattern:multi-step-form' })` 의 하드 패턴(상태 소유·게이팅·값 보존·제출 계약 MUST 규칙)을 따르세요.
  - **데이터 카테고리 재구성 (카탈로그/스토리북 그룹 라벨만 — 코드/API 무변경)** — 카드·테이블 2종·차트·랭킹 리스트가 섞여 모호하던 단일 `데이터` 그룹을 업계 표준(Carbon/MUI/Ant)대로 분리: **데이터 표시**(DataTable·StatsTable·SummaryCard) · **데이터 시각화**(Chart + Sparkline — Sparkline 을 Display 에서 이동) · `TrendingKeywords` 는 쌍둥이 `PopularPosts` 옆 **도메인** 으로. 스토리북도 `Components/Data Display` · `Components/Data Visualization` 로 재그룹.
  - **갤러리 보강 (비파괴)** — AllComponents 의 Button 미리보기에 color×variant 전체 매트릭스 추가(`soft × neutral` 처럼 조합마다 색이 달라지는 케이스까지 노출), Badge 의 `default` / `pill` shape 대비 스토리를 gallery 태그로 승격해 모서리 모양 차이가 카탈로그에 보이도록.

- 8e3c764: NumericSpinner 신규 — `−` / 값 / `+` 정수 증감 입력
  - `−`/값/`+` 으로 작은 정수(수량·회차·세트 수·인원)를 키보드 없이 조정. 가운데 값은 직접 입력·위/아래 화살표 키도 지원하고, `min`/`max` 도달 시 해당 버튼이 자동 비활성화된다.
  - Props: `value` / `onValueChange` / `min` / `max` / `step`(기본 1) / `disabled` / `size`(medium·small). html 미러는 `<nds-numeric-spinner>` + `numeric-spinner-change` 이벤트.
  - 혼동 주의: `Stepper`(단계 진행 표시기)·`AmountInput`(금액·천단위 콤마)와 역할이 다르다. 큰 수/금액은 AmountInput 을 쓴다.
  - 색·치수는 전부 입력 계열 시멘틱 토큰 참조(raw hex 없음), 프로젝트 override 슬롯 `--nds-numeric-spinner-*` 제공.

- 206ed62: 컴포넌트 9종 제거 (BREAKING).

  다음 컴포넌트를 react/styles/html 3면과 MCP 카탈로그·가이드에서 모두 제거했습니다:
  - `ImageCropper` (`nds-image-cropper`)
  - `PinPad` (`nds-pin-pad`)
  - `SignaturePad` (`nds-signature-pad`)
  - `VoiceRecorder` (`nds-voice-recorder`)
  - `WaveformPlayer` (`nds-waveform-player`)
  - `CoachMark` (`nds-coach-mark`)
  - `Lightbox` (`nds-lightbox`)
  - `PullToRefresh` (`nds-pull-to-refresh`)
  - `ScoreGauge` (`nds-score-gauge`)

  영향:
  - `@nudge-design/react` — 위 컴포넌트 export 제거. (`GaugeLevel`·`CoachMarkPlacement` 등 동반 타입 포함)
  - `@nudge-design/html` — `nds-*` 커스텀 엘리먼트 정의·런타임 등록·배럴 export 제거.
  - `@nudge-design/styles` — 번들 `styles.css` 에서 해당 컴포넌트 스타일 제거.
  - `@nudge-design/mcp` — 카탈로그·컴포넌트 가이드에서 제거. `get_guide({ topic: 'component:<Name>' })` 가 더 이상 위 컴포넌트를 반환하지 않습니다.

  `viz-svg` 공유 헬퍼는 `Sparkline`/`CircularProgress` 가 계속 사용하므로 유지됩니다. `VerificationCodeInput`·`Tooltip`·`FormField`·`CircularProgress` 등 잔존 컴포넌트의 교차 안내 문구에서 제거된 컴포넌트 언급도 정리했습니다.

- f0d2f21: 가로 스크롤 레일 유틸 `.nds-scroll-x` 신설 + 카드 장식 라인 금지 가이드
  - **`.nds-scroll-x` 공용 유틸 클래스** (`@nudge-design/styles` → `styles.css`): `overflow-x:auto` + 스크롤바 숨김(`scrollbar-width`/`::-webkit-scrollbar`/`-ms-overflow-style`)을 한 벌로. 손으로 짠 카드 레일·칩 row·가로 탭에 클래스 하나만 걸면 가로 스크롤바가 숨겨진다. (FilterBar·ChatInput·Tabs·PopularPosts·TimePicker 가 각자 재구현하던 관용구의 SSOT — 기존 5곳은 의도된 구현이라 그대로 두고 신규 코드만 이 유틸을 쓴다.)
  - **`pattern:scroll-rail` 가이드 신설**: 가로 스크롤 레일 레시피 — `.nds-scroll-x` + 호출부 `display:flex; gap` + 아이템 `flex-shrink:0`(찌그러짐 방지). `nds-card` 는 호스트가 `display:contents` 라 폭을 호스트가 아닌 카드 박스/래퍼에 줘야 함을 명시(`display:block !important` 핵 우회 금지).
  - **카드 장식 라인/accent 바 금지** (Card 가이드 pitfall + `pattern:visual-antipatterns` 표면 그룹): 상단 컬러 라인·좌측 accent 보더·`::before` 컬러 바로 카드를 장식하지 않는다. 카드가 가질 수 있는 선은 outlined 중립 1px 보더와 옵션 footer/divider hairline 뿐 — 컬러 accent 선은 DS Card 에 없다.

- 6cf1c11: 별점 입력 모드 발견성 개선 + 바텀네비 아이콘 색 누수 수정 (지니어트 목업 피드백)
  - **`nds-star-rating` 에 `interactive` 불리언 속성 추가** — 클릭 입력 모드를 켜는 명확한 토글. 기존엔 `on-change`(값 없는 플래그 속성)로만 켜져 "별점이 동작 안 함" 오해를 유발했음(레거시 `on-change` 도 계속 동작). `<nds-star-rating interactive>` → 클릭 시 골드 채움 + `star-rating-change` 이벤트. React 는 기존대로 `onValueChange`.
  - **바텀네비(tab-bar) 아이콘 색 누수 수정** — `.nds-footer[data-variant="tab-bar"]` 가 자기 `color` 를 안 박아 외부 페이지 `body{color}`(예: #333)가 `currentColor` SVG 아이콘으로 새어 비활성 아이콘이 검게 나오던 버그. chrome 자체 색 기준(inactive 토큰)을 박아 격리 — 모든 프로젝트 바텀네비에 적용.
  - StarRating 가이드: 입력 모드(`interactive`/`onValueChange`) do/dont 명확화 — 별을 nds-icon-button 으로 직접 만들지 말 것.

  검증: html 별점 interactive 테스트 추가(표시전용/입력 동작), mirror-parity baseline 에 `interactive` html-전용 속성 사유 기록.

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

- 2effb30: 트로스트 컴포넌트 Figma 가이드 동기화 — Controls·Modal·Toast·Tooltip
  - **Controls(체크박스·라디오·토글)**: 트로스트 on(checked) 상태를 프로젝트 노랑 대신 다크(#333) 채움 + 흰 체크/점으로(노랑 위 가독성), 컨트롤 크기 24×24, 토글 트랙 50×30 (Controls 가이드 5158:108). 체크색은 새 토큰 슬롯(`--nds-checkbox-checked-bg/-checked-border/-check-color`, `--nds-radio-checked-color`)으로 분리 — 다른 프로젝트는 기존 `fill.brand` fallback 유지(무변화).
  - **Modal**: 확인 CTA 텍스트색을 `confirmCta.text` 로 정렬(노랑 위 흰 글씨 회귀 해소 — 트로스트 노랑+검은 글씨 자동). 비가역 액션용 `confirmTone="destructive"`(검정 Neutral CTA + 흰 텍스트) prop 추가. 트로스트 모달 상단 패딩 24(`--nds-modal-pad-top`). HTML(`<nds-modal>`)은 footer 가 consumer slot 이라 destructive 확정 = `<nds-button color="neutral">`.
  - **Toast**: 트로스트 그림자를 drop y8·blur24·18% 로(가이드 806:1277).
  - **Tooltip**: 기존 스펙이 이미 정합(가이드 806:1278) — figmaNodeUrl·문서만 갱신.
  - 컴포넌트 가이드 `figmaNodeUrl` 을 트로스트 라이브러리로 갱신 + Controls/Toast/Tooltip 스펙 보강.

- Updated dependencies [3e8ac4c]
- Updated dependencies [6cf1c11]
- Updated dependencies [001e5e8]
- Updated dependencies [41bdf61]
- Updated dependencies [665ca93]
- Updated dependencies [135c86a]
- Updated dependencies [942bf66]
- Updated dependencies [051a2b4]
- Updated dependencies [375be74]
- Updated dependencies [e23b5d1]
- Updated dependencies [37cdb34]
- Updated dependencies [3b73446]
- Updated dependencies [268ebe4]
- Updated dependencies [eab0abc]
- Updated dependencies [60db43c]
- Updated dependencies [f91ad95]
- Updated dependencies [bdfea38]
- Updated dependencies [31e9245]
- Updated dependencies [2b51ea7]
- Updated dependencies [46d4d87]
- Updated dependencies [2d6463a]
- Updated dependencies [c995f79]
- Updated dependencies [a5f7eda]
- Updated dependencies [27a44be]
- Updated dependencies [7405016]
- Updated dependencies [2effb30]
- Updated dependencies [e94bac4]
  - @nudge-design/tokens@0.0.4

## 0.0.3

### Patch Changes

- b68ed61: Asset 사이즈를 Avatar 새 스케일에 정합

  Asset 의 size 프리셋을 Avatar(Figma 1337:8)와 동일 스케일로 맞췄다 — **md 40→48 · lg 48→64 · xl 64→96**(xs 24·sm 32 동일), Asset 전용 `2xl` 은 80→120 으로 상향(순서 유지). shape='rounded' 의 cornerRadius 도 고정 8px → **사이즈별 4/6/8/10/12(2xl 14)** 로 Avatar 와 동일하게(`--nds-asset-radius` 슬롯, 임의 px size 는 ~0.16 비율). 이제 같은 size·shape 에서 Asset 과 Avatar 가 시각적으로 일치한다. 프로덕션 소비처 없음(스토리만 사용) — 외부에서 Asset size 를 픽셀 의도로 쓰던 곳만 확인 필요.

- e69fcf9: Avatar Shape 3종 + 가이드 사이즈 정합 · 넛지EAP Card 규칙 패턴

  **Avatar (Figma 1337:8 정합)** — `shape` prop 신규(circle 기본 · rounded · square, 사이즈별 rounded radius 4/6/8/10/12) + 사이즈 스케일을 가이드 5종(24/32/48/64/96)에 맞춤. 키 API 는 유지(xs/sm/md/lg/xl)하되 픽셀값을 가이드에 정합 — **md 40→48 · lg 48→64 · xl 64→96 으로 변경**(xs 24·sm 32 동일). 이미지 부재 fallback 은 이니셜 **1자 Bold**(기존 2자→1자). AvatarGroup 도 동일 스케일·shape 전파(px/font 는 `avatarSizeConfig` 에서 파생해 중복 하드코딩 제거). 프로덕션 DS 컴포넌트는 Avatar 를 슬롯(ReactNode)으로 받으므로 사이즈 변경의 직접 영향 없음 — 앱에서 `size="md/lg/xl"` 를 픽셀 의도로 쓰던 곳은 새 스케일 확인 필요.

  **Card (Figma 713:2 — 넛지EAP CardRulesGuide)** — `pattern:nudge-eap-card` 신규: 넛지EAP 서비스 카드는 ① 내부 CTA 허용(4종: Full-width 48 / Compact 40 / Icon+Text 44 / Ghost), ② shadow 금지·border-only, ③ radius 12 고정. 기존 `component:Card` 가이드의 "[Figma 권위 룰]"(CTA 금지·Elevation 0/1)은 Geniet 도메인 기준임을 명시하는 프로젝트 분기 캐비엇 추가(컴포넌트는 Card.Cta/Footer 슬롯으로 양쪽 모두 지원 — 차이는 사용 규칙).

- 07ce830: 캐포비 admin Modal 가이드 동기화 (Figma ModalGuide 3418-471)
  - 푸터 액션 버튼 크기 갱신: 높이 44px→48px, 폭 120px(single)/hug(dual)→**128px 고정**(Single·Dual 모두 우측 정렬 pill).
  - ④ Confirm + Slot 을 **두 개의 독립 슬롯**으로 가이드에 명문화 — slot a=severity(Notice info/caution/error) · slot b=BodyContent 컨트롤(ContentSlot/Input/Select/DatePicker). Variant Showcase 반영.

- 5771516: Modal·Popup·ConfirmTooltip·TagInput: 캐포비 검정 CTA 를 secondary → neutral 토큰으로 통일

  캐포비(cashwalk-biz)는 Figma ButtonGuide 상 tone 이 Primary + Neutral 둘뿐이고 Secondary 가 없는데도, 모달/팝업/popconfirm 확정 버튼·TagInput 추가 버튼이 `button.bgSecondary` 를 참조하고 있었다. (TagInput 은 타 프로젝트 영향을 막기 위해 base 는 secondary 유지하고 `[data-project="cashwalk-biz"]` 게이트로만 neutral override.) 이 탓에 "캐포비엔 secondary 없음(neutral 사용)"이라는 `cashwalk-biz-no-secondary` 검증룰·Button 가이드와 모순돼, 작성자가 footer 버튼 색을 잘못(primary 노랑) 쓰는 오용의 원인이 됐다. confirm 을 `button.bgNeutral`(검정 #111)/`textNeutralSolid`(흰)/`bgNeutralHover` 로 바꿔 캐포비 전역 taxonomy 와 일치시킨다(시각은 동일한 검정, 색은 `[data-project="cashwalk-biz"]` cascade 로만 적용 — 타 프로젝트 무영향).

- 7a04a69: 캐포비 본인인증(휴대폰/이메일 → 인증번호) 플로우 구현 지원 — FieldActionRow action 옵션화 · CountdownTimer tone="project"

  캐포비 비밀번호 찾기 등 본인인증 화면(연락처 입력 → 별도 full-width 검정 [재전송] → 코드 입력 + 인라인 타이머 → 하단 [다음])을 DS 컴포넌트로 그대로 구현할 수 있게 두 군데 갭을 메웠다.
  - **FieldActionRow `action` 옵션화** — 이제 action 을 생략하면 "코드 입력 + 우측 타이머만"(인라인 버튼 없는 줄)을 렌더한다. 인증번호 전송/재전송이 별도 full-width 버튼이고 코드 입력엔 타이머만 두는 캐포비 레이아웃을 직접 만들 수 있다. (react/html 미러)
  - **CountdownTimer `tone="project"`** — 진행 중 타이머를 프로젝트 액센트색으로(캐포비 = 오렌지 #FD9B02, `text.project` 토큰). 인증 코드 입력의 오렌지 타이머를 정확히 재현한다. urgent(≤10초) 빨강은 tone 과 무관하게 우선. (react/html/styles 미러)
  - **가이드** — 온보딩 패턴에 "03c 본인 인증 Section" 추가, VerificationCodeInput 가이드에 캐포비 본인인증 레시피(별도 재전송 + 타이머만 코드 입력) 추가, FieldActionRow·CountdownTimer 가이드에 신규 옵션 반영.

- 7a04a69: 약관동의 [필수] 자동 강조 · 캐포비 모달/팝업 검정 CTA 회귀(노랑) 정착 · 온보딩 풀폭 CTA 게이트

  세 가지 반복 피드백을 DS 근본에서 닫는다.
  - **약관동의 [필수] 강조 누락(반복)** — CheckboxGroup 이 `badge` 에 "필수" 가 들어있으면 `required` 를 따로 안 붙여도 자동으로 빨강+bold 강조하도록 했다(react/html 미러). 그동안 `required` opt-in 을 매번 누락해 회색으로 나오던 footgun 제거. 끄려면 `required={false}` 명시.
  - **캐포비 모달/팝업 버튼이 노랑(반복)** — 모달/팝업 confirm 버튼 색을 `[data-project="cashwalk-biz"]` CSS 캐스케이드 대신 신규 `--semantic-confirm-cta-*` 토큰으로 흐르게 바꿨다. 기존 캐스케이드는 `data-project` 속성을 쓰지 않는 standalone 목업(프로젝트 `:root` 교체식)에서 안 걸려 base 의 project 노랑이 새던 회귀의 원인이었다. 토큰은 목업·Storybook 양쪽에 적용되고, base 는 각 프로젝트 project 색을 참조하므로 캐포비만 검정(#111)으로 override 된다(타 프로젝트 무영향).
  - **온보딩 단일 CTA 가 좁게(반복)** — 온보딩 주 CTA(Primary solid)에 full-width 가 없으면 `validate_html_mockup` 이 `onboarding-cta-not-fullwidth` error 로 막는다. 작성자가 모달 단일버튼(우측 hug)과 혼동하던 회귀 차단. 가이드(pattern:cashwalk-biz-page-onboarding)도 명시 강화.

- 9257d0a: Container/Section 레이아웃 가이드(Figma 1385:13) 반영

  페이지 구성 두 레이아웃 단위를 DS 에 반영했다. Layout primitive 컨벤션(web component 없이 클래스만)을 따른다.
  - **Container** — `nds-container` 클래스 신설(`packages/styles/src/Layout.ts`). 컨텐츠 가로 폭을 viewport 안에 가두는 반응형 래퍼: **PC(≥1024) max 1200·좌우 40 / Tablet(768~1023) max 768·좌우 24 / Mobile(<768) 100%·좌우 16**, `margin-inline:auto` 가운데 정렬. 기존 `grid.desktop.contentWidth`(1200)·spacing 토큰 사용, 신규 토큰 없음.
  - **Section** — 컴포넌트화하지 않고 **룰만**(Figma 지정: frame 으로 직접 그림). 상하 padding Large 120/Medium 80/Small 40, 인접 Section BG 교차(White ↔ Gray 50), Section 1개당 Container 1개, Section Title 32 Bold + 하단 16·헤딩↔본문 24, Section 간 margin 금지(padding 분리). MCP 패턴 가이드 `pattern:container-section` 로 문서화(figmaNodeUrl 포함).

  어드민 카드 `nds-section`(흰 카드)과는 다른 페이지-레벨 개념 — 이름 충돌 없음(Section 은 클래스 미생성).

- 5771516: FieldActionRow/VerificationCodeInput/CountdownTimer: 인증번호 입력 합성 정리
  - **타이머 겹침 수정**: FieldActionRow 의 우측 타이머가 입력값/placeholder 위로 겹치던 문제를, 타이머가 있을 때 필드 콘텐츠에 우측 공간을 자동 예약(`data-has-timer`)해 해소. 더는 입력에 수동 paddingRight 가 필요 없다(`--nds-far-timer-reserve` 로 조정 가능).
  - **박스 이중 스타일 제거**: FieldActionRow 의 범용 입력 스타일을 직접 자식 `> input` 으로 한정 — VerificationCodeInput/Input 같은 DS 컴포넌트가 자체 박스를 가질 때 테두리·패딩이 이중으로 얹히던 문제 해소.
  - **CountdownTimer 시간 볼드 제거**: 카운트다운 값을 bold → regular(tabular-nums 유지)로 — 불필요한 강조 제거. 필드 안 타이머는 '남은 시간' 라벨 없이 값(mm:ss)만 두는 것을 권장.

- e7a2978: 모든 텍스트 인풋의 placeholder/helper 색을 `cv.input.*` 토큰으로 통일 (드리프트 교정)
  - placeholder: FieldActionRow·PhoneInput·Header(검색)·ChatComposer·CheckboxTree(검색) 가 `cv.textRole.muted` → `cv.input.placeholder` 로. (runmile 등에서 실제 색 달랐음)
  - helper text: AddressPicker·FormField·PhoneInput·TimePicker·Textarea·ImageUpload·Select·SearchInput 이 `cv.textRole.subtle`/`muted` → `cv.input.helpertextDefault` 로. (base/geniet/runmile/trost 에서 canonical Input 헬퍼와 색 달랐음)
  - 이제 `--semantic-input-placeholder` / `--semantic-input-helpertext-*` 단일 토큰이 전 인풋을 제어. Checkbox/Radio(선택 컨트롤)는 범위 제외.

- 5771516: Modal: 닫기(X) 버튼을 타이틀 유무와 무관하게 항상 우측 정렬

  타이틀이 없는 모달에서 헤더 스페이서가 함께 렌더되지 않아, `justify-content: space-between` 의 단독 자식이 된 닫기 버튼이 좌측으로 떨어지던 회귀를 고친다. 닫기 버튼에 `margin-left: auto` 를 주어 타이틀이 있을 땐 no-op(타이틀 flex:1 이 공간을 차지), 없을 땐 우측으로 밀어낸다. react/html 공용 CSS 라 양쪽에 동시 반영. 타이틀 없는 closable 스토리(CashwalkBiz ⑤)로 고정.

- 5771516: Modal: 본문에 콘텐츠 슬롯(NoticeAlert/Input/Select/DatePicker)을 둘 때 간격 지원 (④ Confirm + Slot)

  `ModalBody` 가 단일 텍스트만 가정해 `display:flex` 가 없던 탓에, 설명 텍스트 + 콘텐츠 슬롯(인라인 알림/입력/드롭다운/날짜)을 함께 넣으면 둘이 간격 없이 붙던 문제를 고친다. 본문을 세로 스택(`flex-direction:column` + `gap`)으로 만들어 Figma ④ Confirm+Slot(3418-471)처럼 설명↔슬롯이 일정 간격으로 쌓이게 한다(캐포비 = 20px 평면 gap, base = `--semantic-gap-default`). 단일 텍스트 본문은 무영향, 슬롯은 full-width 로 늘어남.

- d6e2deb: MultiSelect(다중 선택 드롭다운) 패널을 캐포비 어드민 Figma 실측(MultiSelectDropdown 4123-1406)에 맞춰 정리

  리포트/필터의 다중 선택 드롭다운 모양을 디자인 시안과 일치시킨다. 동작(초안 편집 → 적용)은 그대로, 패널의 시각 구조만 손봤다. (react/styles/html 미러)
  - **검색**: 테두리 없는 flush 입력 → **테두리 있는 인셋 검색창**(패널 상단 패딩 박스 + 하단 구분선).
  - **전체선택 행**: 배경을 옅은 회색(surface.subtle)으로 구분하고 라벨을 한 단계 큰 16/medium 으로(옵션 14 와 위계 분리).
  - **행 높이/여백**: 옵션·전체선택 행을 48→44h 정렬(좌우 16 / 상하 12).
  - **푸터**: 풀폭으로 양쪽에 꽉 차던 [취소][적용] → **우측 hug 정렬**. 색을 `secondary` → **`neutral`** 로(캐포비 검정 CTA 규칙 — 적용=검정 solid, 취소=outlined. secondary 는 캐포비 denylist 라 잠재 회귀였음).
  - **패널 폭**: 360 → 392px.
  - MCP `component:MultiSelect` 가이드에 패널 내부 구조·푸터 규칙을 고정하고 컴포넌트 SSOT Figma 노드(4123-1406)로 갱신.

- d6e2deb: 캐포비 Pagination 박스형을 디자인가이드(PaginationGuide)에 정합

  캐포비 어드민 Pagination 디자인가이드(Figma 4118:1186)를 기준으로 `data-project="cashwalk-biz"` 박스형 캐스케이드를 다듬는다. markup/props 는 그대로라 다른 프로젝트(base pill 형)와 React/HTML 미러는 무영향 — CSS 토큰 정합 + 가이드 갱신만.
  - **radius 8 → 4** — 가이드가 명시한 PageItem radius(4) 로 맞춤(기존 `radius.md` → `radius.sm`).
  - **활성 페이지 font-weight bold → medium** — 가이드 Body3/Medium 과 일치(검정 배경+흰 텍스트로 이미 충분히 구분).
  - **boxed disabled 신설** — 끝에 도달한 Prev/Next 가 흐림(opacity 0.4)이 아니라 옅은 회색 박스(배경 `surface.subtle` + 회색 텍스트 `textRole.disabled`)로 표시. 가이드의 boxed disabled 의도 반영.
  - 활성 검정값/보더/텍스트 색은 가이드의 raw hex(#212121/#d4d4d4/#121212)가 캐포비 토큰에 정확히 매핑되지 않아 기존 시멘틱 토큰(`fill.neutral`/`borderRole.normal`/`textRole.normal`)을 유지(토큰-퍼스트).
  - **MCP 가이드** — `figmaNodeUrl` 을 신규 가이드 노드(4118:1186)로 갱신, "0건이면 숨김 · 1페이지면 Prev/Next disabled · 끝 도달 시 disabled" 동작 규칙을 pitfalls 에 추가.

- 9530a80: QuickMenu(신규): PC 우측 고정 퀵메뉴 컴포넌트

  PC 화면 우측에 고정(sticky/fixed)되어 자주 쓰는 전역 액션 2~4개(3개 권장)를 빠르게 노출하는 보조 navigation 컴포넌트를 추가했다. Container(width 120 · radius 12 · White · overlay shadow) + Header("QUICK MENU" Bold/project 색 + divider) + Menu Item × N(IconCircle 60 + 라벨) + 하단 TOP(맨 위로) 버튼 구조.
  - React `<QuickMenu items={[…]} fixed showTop onTopClick />` · HTML `<nds-quick-menu items='[…]' fixed>` 3면 미러.
  - 색은 전부 시멘틱 토큰 — 헤더는 `--semantic-text-brand-default`(project cascade)라 5개 프로젝트 색이 자동 적용. raw hex 없음.
  - `fixed` 속성으로 PC 우측 고정 위치(top 172 · right 40 · z 900) + 모바일/태블릿(<1024) 자동 숨김(하단 Tab Bar 로 대체).
  - 아이템 클릭 → `quick-menu-item`(detail.key) · TOP 클릭 → `quick-menu-top` 이벤트. icon 은 inline SVG(이름/이모지 아님).
  - MCP 가이드(`component:QuickMenu`) · Storybook 스토리 · AllComponents 카탈로그 등재.

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

- d6e2deb: 본인인증 UI 정리(FieldActionRow label · 인증코드 자간/placeholder) · 캐포비 모달 노랑 CTA 재발 가드

  목업 피드백에서 드러난 본인인증 화면 회귀 4건을 DS 근본에서 닫는다.
  - **FieldActionRow `label` 신설(react/styles/html 미러)** — 라벨이 필요한 인증 row(예: "휴대폰 번호" + [인증번호 받기])에서 라벨을 손으로 버튼과 같은 줄에 욱여넣어 버튼이 라벨 높이에 떠 어긋나던 회귀를 막는다. 이제 `label` 을 넘기면 라벨은 한 줄 위, 입력+버튼은 인라인으로 컴포넌트가 정렬한다.
  - **VerificationCodeInput 자간/placeholder** — 코드 값의 `letter-spacing` 을 0.08em → normal 로(단일 필드에서 숫자가 부자연스럽게 벌어져 어색하던 자간 수정). 기본 placeholder 도 "인증번호 6자리" → "인증번호 입력"(헬퍼가 이미 6자리를 안내해 중복 제거). (react/html/styles 미러)
  - **캐포비 모달/팝업 노랑(primary) CTA 재발 가드** — 색 캐스케이드는 이미 토큰으로 잡혔지만, 작성자가 모달 footer 버튼에 `color="primary"` 를 쓰거나 `color` 를 생략(Button 기본값이 primary)하면 여전히 노랑이 됐다(5회+ 재발의 진짜 원인). `validate_html_mockup` 에 `cashwalk-biz-modal-primary-cta`(error: 확인/팝업 모달 footer 의 primary/색생략 버튼 → 검정 neutral 요구, 대형 선택/데이터 모달은 면제) + `cashwalk-biz-modal-footer-stacked`(warn: 2버튼 세로 스택 금지 — 라벨 축약 방향) 룰을 추가하고, Modal·cta-group·FieldActionRow 가이드에 "모달 버튼 color 생략 금지(기본 노랑)·2버튼 가로 유지·전송 후 [재전송] 토글"을 명시했다.

- Updated dependencies [a2ff1a0]
- Updated dependencies [e7a2978]
- Updated dependencies [7a04a69]
- Updated dependencies [67741ea]
- Updated dependencies [72d2018]
  - @nudge-design/tokens@0.0.3

## 0.0.2

### Patch Changes

- b887f41: AddressSearch → **AddressPicker** 개명 (Picker 패밀리 정합) + 검색 버튼 검정 CTA.
  - **개명(Breaking)**: `AddressSearch` → `AddressPicker`, 태그 `nds-address-search` → `nds-address-picker`, 타입 `AddressSearchProps` → `AddressPickerProps`. 단순 검색창이 아니라 검색→결과선택→상세입력까지의 합성 picker 라서 Picker 패밀리(DatePicker/TimePicker…)와 이름을 맞춤. (도메인 이벤트 `address-query`/`address-search` 는 동작을 가리키므로 유지 — 소비자 리스너 무변경. `AddressResult`/`AddressValue` 타입도 유지.)
  - **검색 버튼 검정**: 검색 버튼을 `color="secondary"` 로 — 캐포비/지니어트는 시그니처 검정 CTA, 트로스트/런마일은 각 프로젝트 secondary 로 cascade(색 hex 미박음). react+html 미러.
  - MCP `COMPONENT_GUIDES.AddressPicker` 갱신(전체 플로우 명시 · SearchInput 혼동 경고 · 검정 버튼 cascade 주의).

  마이그레이션: `<nds-address-search>` → `<nds-address-picker>`, `import { AddressSearch }` → `import { AddressPicker }`.

- d10a40f: Toss TDS 식 통합 미디어 컴포넌트 `<Asset>` 추가.
  - **Frame** — `shape` (square/rounded/circle) × `size` (xs/sm/md/lg/xl/2xl 또는 임의 px) 프리셋으로 모양·크기 일관성 강제.
  - **Content** — discriminated union 으로 image / icon / initial / lottie / custom 다섯 종류를 동일 박스에서 표현. 이미지 로드 실패 시 alt 이니셜로 graceful degrade.
  - **Union** — `overlap` (음수 마진으로 AvatarGroup 식 겹침) + `acc` (우측 하단 status dot / count badge 슬롯).
  - `@nudge-design/styles` 의 `nds-asset` CSS 블록 추가 (`.nds-asset[data-shape="..."]` 가 radius 분기).
  - MCP `COMPONENT_GUIDES.Asset` 등록 — props 함정, Avatar 와의 시멘틱 분리(사람 한정 Avatar / 일반 미디어 Asset), examplesHtml.
  - Storybook 카탈로그 (`AllComponents.stories.tsx`) 에도 엔트리 추가.

  Avatar / AvatarGroup 는 그대로 유지 (사람 식별 시멘틱). Asset 은 그보다 일반적인 미디어 박스 — 카드 썸네일, 카테고리 시그니처, 상품 이미지, 채팅 첨부 등.

- b887f41: 캐포비 admin Input/Form 카탈로그 보강 — Figma 캐포비 Library InputGuide(3080:741) 정합.

  신규:
  - **FormSection** (`nds-form-section`) — 제목(Headline3 24 Bold) + 보더 카드(radius 16 cascade · border #EEE · 좌우 padding 24)로 여러 `FormField` 를 묶는 폼 그룹 컨테이너. 세로 리듬은 자식 `FormField density="admin"`(py-24) 이 만든다. react + styles + html 3면 미러. (Figma FormSection 3466:17405)
  - **SelectionButton** (`nds-selection-button`) — 단일 선택 버튼 standalone export. 그룹과 동일한 `nds-selection-button-group__item` 비주얼 공유(브랜드색 아웃라인 + selected 채움). `SelectionButtonGroup` 도 내부적으로 이 컴포넌트를 재사용하도록 정리. (Figma SelectionButton 3549:703)
  - **Field Width 스케일** — `sizing.fieldWidth` 토큰(xs 120 / sm 200 / md 304 / lg 400 / xl 488) 신설 + `fieldWidth` prop 을 `Input`·`Select` 에 추가(React `fieldWidth="md"` / HTML `field-width="md"`, full=100%). 인라인 width 대신 6단계 스케일로 통일. (Figma Field Width 3897:1578)

  문서:
  - MCP `cashwalk-biz-input` 가이드에 FormSection 컴포넌트·실제 `fieldWidth` prop·SelectionButton 단독·ActionChip 아이콘(slot/icon) 반영. figmaNodeUrl 을 InputGuide 루트(3080-741)로 갱신.
  - Storybook `FormSection` 스토리 + AllComponents 카탈로그(FormSection · SelectionButton · 아이콘 동반 ActionChip) 엔트리 추가.

  ActionChip 은 이미 `icon` prop(React)·`slot="icon"`(HTML)을 지원 — 예시/가이드에서 아이콘 사용을 명시적으로 노출. 더해서 14px 박스에서 얇은 스트로크 아이콘(InfoIcon 등)이 연하게 보이던 문제를 고침: `__icon` 색을 `iconRole.normal`(#666) → `iconRole.strong`(#333)으로, 슬롯 SVG 가 박스를 꽉 채우도록 `__icon > svg { width/height:100% }` 추가(HTML `slot="icon"` 로 넣은 find_icon SVG 도 안정 렌더).

- 26df7ba: 밝은 project(캐포비·트로스트 노랑) 채움 위 흰 글씨 → 검정으로 전면 교정 + 캐포비 토글 ON 초록.

  **문제**: project 채움(`surface.brand`/`fill.brand`) 위에 `text/icon-inverse`(흰색)를 얹은 컴포넌트들이, project 색이 밝은 노랑인 **캐포비(#FFD200)·트로스트(#FFF42E)** 에서 흰 글씨가 안 보였다.

  **해결 — 새 토큰 없이 기존 `--semantic-button-text-default` 재사용.** 이 토큰은 모든 프로젝트에서 이미 "project 채움 위 글씨"(= 프라이머리 버튼 글씨)를 정확히 들고 있다: 어두운 project(NudgeEAP·Geniet·Runmile) = 흰색, 노랑 project(캐포비·트로스트) = 검정. project 채움 + 흰 글씨 짝이던 컴포넌트의 글씨/아이콘 색을 `cv.button.textDefault`(`var(--semantic-button-text-default)`)로 교체 — 캐포비뿐 아니라 트로스트까지 자동 교정된다.

  **적용**(project 채움 위 흰 글씨/아이콘 → button-text-default): Checkbox·CheckboxTree·MultiSelect(체크표시), Calendar·DatePicker·TimePicker·TimeSlotPicker(선택), Stepper·Timeline(인디케이터), Tabs(color chip), Toggle(ON 라벨), ChatBubble, Popup·CoachMark·FAB·AudioPlayer·CounselorCard·FieldActionRow·Badge·Chip. react/styles/html 3면 모두.

  **캐포비 토글 ON = 초록**: 캐포비 admin 토글의 켜짐은 프로젝트 노랑이 아니라 초록(on/off 관습). `data-project="cashwalk-biz"` cascade 로 ON 트랙을 status-success 초록 + inner-label 흰색으로(다른 프로젝트 무영향).

  어두운 채움(`fill.neutral` #333 · `surface.inverse` #111) 위 흰 글씨는 정상이라 그대로 둠.

- 6cd3190: `CheckboxGroup` 범용화 — "전체선택 + 체크 리스트"를 한 컴포넌트로 (ConsentChecklist 흡수, antd Checkbox.Group 대응).
  - **데이터 모드(`items`)** 추가 — `value`/`onValueChange` 로 선택 관리 + `selectAll`(자식 선택 비율로 checked/indeterminate/unchecked **자동 파생**) + `badge`([필수]/[선택]/NEW 도메인 중립 슬롯)·`detail`(약관 전문 등 펼침) + `expandable`. 각 행은 `Checkbox` 를 재사용(지표 단일 소스).
  - **레이아웃 모드(`children`)** 기존 동작 그대로 — 직접 조립한 `<Checkbox>` 들을 vertical/horizontal + gap 배치. **하위호환**(기존 사용 안 깨짐).
  - **HTML 미러 `nds-checkbox-group` 신설** — 데이터/레이아웃 모드 + `nds-checkbox-group-change` 이벤트. (이전엔 React 전용·레이아웃 전용이라 HTML 목업에서 못 썼음 → 이제 로직이 양쪽 코드에.)
  - React 구현은 `Checkbox.tsx` 에서 `CheckboxGroup.tsx` 로 분리.

  약관 동의·다중 필터·설정 묶음을 이 한 컴포넌트로 조립한다(동의 화면 법적 규칙은 `pattern:consent`). 계층(시/도▸시군구)은 `CheckboxTree`, 닫힌 드롭다운+적용 필터는 `MultiSelect`. MCP `COMPONENT_GUIDES.CheckboxGroup` 추가 + `pattern:consent` 가 이 컴포넌트를 가리키게 갱신. Storybook 스토리(레이아웃/데이터/전체선택/동의/interaction) · AllComponents · componentInventory 추가.

  후속: ConsentChecklist 컴포넌트 실제 삭제는 composite-trim 릴리즈에 합류(이 컴포넌트로 대체됨).

- 26ba4d9: 계층 체크박스 트리 `CheckboxTree` 신설 + `Checkbox` 부분선택(indeterminate) 확장 — Figma 캐포비 Library 지역 선택 모달(3001:50785) 정합.

  신규 컴포넌트:
  - **CheckboxTree** (`nds-checkbox-tree`) — 검색 + 전체선택 + 계층(시/도 ▸ 시/군/구) 체크박스 트리. 부모는 하위 leaf 선택 비율에 따라 checked / indeterminate / unchecked 를 **자동** 표시하고, 부모 클릭은 하위 leaf 전체를 on/off. `value` 는 선택된 **leaf 값**만 담는다(부모는 파생). 검색 시 매치 부모 자동 펼침, 빈 결과 자동 빈 상태. 들여쓰기 `--nds-checkbox-tree-indent`(32px) × depth, 스크롤 높이 `--nds-checkbox-tree-max-height`.

  기존 컴포넌트 보강:
  - **Checkbox** — `indeterminate` prop 추가(HTML `indeterminate` attr). '일부 자식만 선택됨'(부모/전체선택 행)을 옐로우 마이너스로 표시. 네이티브 `input.indeterminate` 동기화 + `aria-checked="mixed"`. 클릭 시 네이티브와 동일하게 `checked=true` 로 전이.

  조립 메모:
  - "선택한 지역" 요약(오른쪽 패널)은 기존 **SelectedItemsPanel** + **RegionRow** 재사용 — CheckboxTree 는 좌측 트리(선택 상태)만 책임. 둘을 합치면 캐포비 지역 선택 모달 전체가 됨(별도 RegionPicker 컴포넌트 미신설).
  - 평면 다중선택은 MultiSelect, 즉시 단일선택은 Select — 역할 분리 유지.
  - MultiSelect 통합(공통 검색/전체선택 코어 추출)은 후속 작업으로 보류.

  MCP 가이드(get_guide)에 `COMPONENT_GUIDES.CheckboxTree` 추가 + `Checkbox` 가이드 indeterminate 갱신. Storybook 스토리(지역 선택 모달 데모 + interaction test) · AllComponents 카탈로그 · componentInventory 엔트리 추가.

- 501ff41: Chip · TagInput 의 제거(✕) 아이콘을 공유 SSOT 로 통일 — 중복 제거(시각 변화 없음).

  두 컴포넌트가 각각 같은 모양의 ✕ svg(라운드 캡 stroke 1.5)를 따로 그리고 있어, 공유 `RemoveIcon`(react `internal/RemoveIcon.tsx` · html `base/remove-icon.ts`) 하나로 모았다.
  - 글리프는 viewBox 14 로 통일하고 `vector-effect="non-scaling-stroke"` 로 스트로크를 1.5px 로 고정 — Chip(14px)·TagInput(10px) 어느 크기에서도 통일 전과 동일한 두께로 렌더(시각 회귀 0).
  - TagInput `__remove svg` 에 10px 사이즈 규칙 추가(공유 아이콘은 크기를 CSS 가 결정).
  - React/HTML 4개 사본 → 1개 SSOT.

  SelectedItemRow/RegionRow 의 '원형 배경 X' 는 리스트 행 삭제용 별개 어포던스라 의도적으로 통일 대상에서 제외.

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

- da7e96c: ConsentChecklist `전체 동의` 부분선택 indeterminate — CheckboxTree 전체선택과 동일 패턴으로 통일.
  - 일부 항목만 체크되면 `전체 동의` 박스가 옐로우 **마이너스(indeterminate)** 로 표시되고,
    클릭하면 전체 체크로 전이된다(기존엔 부분선택이 그냥 빈 체크로 보였음). native
    `input.indeterminate` + `aria-checked="mixed"` 동기화. react/styles(`nds-consent`)/html 3면 미러.
  - "전체선택 체크박스가 자식 선택 비율로 checked/indeterminate/unchecked 파생 + 클릭 시
    자식 전체 토글" 패턴을 CheckboxTree 와 ConsentChecklist 가 공유하게 정렬.
  - 개별 항목 박스는 그대로(checked/unchecked). MCP ConsentChecklist 가이드에 indeterminate
    명시 + 계층 선택은 CheckboxTree 로 안내. Storybook 부분선택 데모 + interaction test 추가.

  지표 마크업 물리적 1벌 추출(Checkbox/CheckboxTree/ConsentChecklist/MultiSelect 4중복)과
  MultiSelect 전용 스토리는 후속 작업.

- da1de6a: `DataTable` 펼침/접힘(트리) 자식 행 지원 추가 — 캐포비 날짜별/광고별 리포트처럼 상위 행을 펼쳐 하위(캠페인·광고) 행을 보는 표를 columns/data API 그대로 그릴 수 있다 (TanStack 식 `getSubRows` 방식).
  - `@nudge-design/react` — `getSubRows(row)` 로 자식 행 추출 시 [+]/[−] 토글 + depth 들여쓰기 자동. `expandedKeys`/`onExpandedChange`(controlled) · `defaultExpandedKeys`(uncontrolled) · `expanderColumnKey`(토글 컬럼, 기본 첫 컬럼). scroll·cards 모드 모두 지원.
  - `@nudge-design/html` — `<nds-data-table sub-rows-key="subRows" expander-column="date">` 속성으로 동일 동작. 펼침 상태는 인스턴스 내부 유지.
  - `@nudge-design/styles` — `nds-data-table__expander`/`__expand-cell`/`__expander-spacer` + depth 별 자식 행 배경.
  - ⚠️ 펼침 사용 시 `rowKey`/`row-key` 는 인덱스가 아닌 행 고유값(자식 포함 유일)이어야 함.
  - 표 하단 합계행이 같이 필요하면 `nds-stats-table`(`<tr class="is-summary">`)과 조합. MCP `COMPONENT_GUIDES.DataTable` + `cashwalk-biz-page-list` 패턴 갱신, Storybook 펼침 스토리 추가.
  - 펼침 토글/하위 행 마커는 캐포비 Figma 아이콘 그대로 — 부모 `[+]`/`[−]`(04ic/open·close), 자식 `↳` 분기 화살표. 색은 currentColor 토큰 cascade.
  - 기본 정렬을 **중앙**(헤더·셀 동일)으로, 셀 패딩을 **16px 고정(상하좌우)**으로 조정 — 행 높이는 내용에 따라 가변. 이미지/썸네일 등 큰 셀은 컬럼 `media` 플래그로 12px. 조밀한 표는 size='sm', 펼침 토글 컬럼은 좌측 고정.
  - 펼침 표는 `table-layout:fixed`(data-expandable)로 컬럼 너비를 헤더 기준 고정 — 행 펼침 시 헤더 정렬이 흔들리지 않음. expander 토글↔콘텐츠 gap 확대.

- b887f41: Footer — dark web variant 의 텍스트 색을 raw hex 대신 semantic 토큰으로 교체.

  `--nds-footer-color: #fff` → `cv.textRole.inverse`(`--semantic-text-inverse-default`). 배경(`cv.textRole.normal`)과 짝을 이루는 토큰 참조로 정리 — 시각 변화 없음, raw hex 위반 제거.

- 26df7ba: 입력 계열 컴포넌트(SearchInput·Autocomplete·PhoneInput·AddressPicker) 가 기본 Input 과 **동일한 `--nds-input-*` 토큰**을 쓰도록 통일 — 프로젝트별 인풋 외형이 따로 놀던 drift 제거.

  **문제**: Input/Select 는 필드 박스 치수를 `--nds-input-height` · `--nds-input-radius` · `--nds-input-padding-x` · `--nds-input-border-color` · `--nds-input-background` 슬롯으로 두어 프로젝트가 cascade 로 덮을 수 있는데(예: 캐포비 admin = height 40 / radius 4 / padding inset-input), Autocomplete·PhoneInput·AddressPicker 는 이 값들을 **리터럴로 하드코딩**(48 / radius 8)했고 SearchInput 은 `--nds-search-input-*` 자체 슬롯이 `--nds-input-*` 로 **fallback 하지 않아**, 같은 줄에 둔 인풋끼리 높이·라운드가 어긋났다(캐포비에서 검색 인풋만 커 보이는 회귀 등).

  **해결**: 네 컴포넌트의 필드 박스 height/radius/padding-x/border-color/background 를 전부 `var(--nds-input-*, <기본값>)` 으로 교체. SearchInput 은 자기 슬롯 → `--nds-input-*` → 리터럴 순으로 체인. 이제 한 곳(`--nds-input-*`)만 프로젝트가 덮으면 입력 계열 전부 따라온다 — 컴포넌트별 개별 수정 불필요.

  **focus 보더도 통일**: 네 컴포넌트의 focus 보더가 제각각 `borderRole.focus`/`borderRole.brand`(= 캐포비 노랑)였던 걸 Input 과 동일한 `cv.input.borderFocus`(`--semantic-input-border-focus`, 캐포비 #111 검정)로 통일 — 같은 줄 인풋끼리 focus 색이 노랑/검정 섞이던 불일치 제거.

- 25007ae: Input 비밀번호 표시/숨김 토글 내장 (auth/로그인 화면용).
  - `type="password"` 면 우측에 눈 아이콘 토글이 **자동** 노출 — 클릭 시 평문↔비밀 전환. 아이콘은 DS `eye`/`eye-off` 와 동일 path, `currentColor`(muted→hover strong) cascade.
  - `passwordToggle={false}` (HTML `password-toggle="false"`) 로 끌 수 있음. password 가 아닌 type 은 무시.
  - 접근성: 토글 버튼에 `aria-pressed` + "비밀번호 표시/숨기기" `aria-label`, `mousedown` preventDefault 로 입력 포커스 유지.
  - react `Input`(+ `InputPasswordToggle` compound) / html `<nds-input type="password">` 미러, `@nudge-design/styles` `.nds-input__password-toggle` 블록 추가.
  - 이전엔 suffix 슬롯에 eye 버튼 + type 상태를 매번 손조립해야 했음 → 내장으로 대체.

- b887f41: MultiSelect 내부를 DS 컴포넌트 조합으로 리팩터 (raw 재구현 제거).
  - 검색 = `SearchInput`(`nds-search-input`), 전체선택/옵션 = `Checkbox`(`nds-checkbox`, 전체선택은 indeterminate), 푸터 = `Button`(`nds-button`, 취소 outlined / 적용 secondary solid).
  - 이전엔 체크박스·검색·버튼을 MultiSelect 안에서 raw 로 다시 그려서 드리프트 발생 — 예: MultiSelect 체크박스는 18px/radius4 하드코딩이라 캐포비 Checkbox(15px/radius2)와 같은 화면에서 달라 보였음. 이제 Checkbox/Input/Button 의 토큰·project cascade·a11y 를 그대로 물려받아 자동 일관.
  - 전체선택이 부분 선택 상태에서 indeterminate 로 표시되는 UX 개선.
  - Public props/이벤트 변화 없음(`options`/`value`/`onValueChange` 등 동일). 내부 DOM·클래스만 변경 — `nds-multi-select__option-check`/`__option-label`/`__footer-button` 클래스 제거.

- 4263d5a: 캐포비 어드민 인라인 알림 컴포넌트 `NoticeAlert` 추가 (DS notice 패턴의 첫 구현체).
  - **5 variant** — info(중립 회색·아이콘 없음) / notice(블루·차분한 공지) / caution(옐로우 아이콘·회색 배경) / success(그린·완료) / error(레드 배경+레드 텍스트·조치 필요). 색은 semantic status 토큰(bg/text/icon) cascade — 임의 hex 없음.
  - **인라인 지속 메시지** — 폼·페이지 내부에 영구 노출. Toast(자동 사라짐)·Banner(전역 띠)·Modal(즉각 판단)·CrisisCallout(위기 안내)과 분리.
  - `@nudge-design/react` — `<NoticeAlert variant message icon />` (message/children, icon override·false 로 숨김, error 는 role=alert 자동).
  - `@nudge-design/html` — `<nds-notice-alert variant message hide-icon>` vanilla Web Component + runtime 등록.
  - `@nudge-design/styles` — `nds-notice-alert` CSS 블록 (height 48 · radius 12 · padding 12/16 · gap 10 · 좌측 status 아이콘 20×20). Figma SSOT node 3902:1212.
  - MCP `COMPONENT_GUIDES.NoticeAlert` 등록 — variant 의미·강조 예산·pitfalls·examplesHtml. Storybook 스토리 + AllComponents 카탈로그 + 인벤토리 엔트리.

- 26df7ba: Pagination — 캐포비(cashwalk-biz) 박스형 스타일 추가 (Figma 배너광고 리포트 3001:31310).
  - `<html data-project="cashwalk-biz">` cascade 만으로 각 페이지/화살표가 개별 보더 박스(white + Border/Normal #EEE, r8, 34h)로 렌더되고, 활성 페이지는 캐포비 시그니처 검정 채움(Fill/Neutral #333 + 흰 텍스트)이 된다.
  - markup/props/attribute 변경 없음 — base(NudgeEAP·Trost 등 다른 프로젝트)는 기존 borderless + project 채움 그대로. `:where()` 0-specificity 라 base 규칙 뒤에 추가.
  - Storybook `Project/캐포비 박스형` 스토리 + MCP `COMPONENT_GUIDES.Pagination` 함정·figmaNodeUrl 갱신.

- b887f41: PhoneInput 분리형 박스 레이아웃 + 자동 하이픈 (캐포비 Figma 3001:40209·3902 폼).
  - **레이아웃**: 국가코드 다이얼 + 구분선 + 번호 입력이 합쳐진 단일 필드 → **국가코드 드롭다운 박스 + 번호 입력 박스가 분리된 두 박스(gap)** 로 변경. 내부 구분선(`__divider`) 제거. 두 박스 모두 base Input 시멘틱 토큰(`--nds-input-height`=48 · `--nds-input-radius`=md · `--nds-input-border-color`/`-background`)을 상속 — Input 과 둥근 모서리·높이·project cascade 자동 일관.
  - **자동 하이픈**: 새 `autoFormat` prop(기본 on, html `auto-format` 속성). 화면에는 KR(+82) 모바일 3-4-4 하이픈을 자동 삽입하고 `value`/`onValueChange` 는 숫자만 다룸(예: `01012345678`). KR 외 국가는 규칙 미정의라 숫자 패스스루. `autoFormat={false}` 로 비활성.
  - focus/error 보더는 base Input 토큰(`input.borderFocus`/`input.borderError`)으로 각 박스에 적용.
  - MCP `COMPONENT_GUIDES.PhoneInput` 에 `figmaNodeUrl` + 레이아웃·하이픈 설명 갱신.

- 2a4e6de: Select 검색형(`searchable`) 추가 · FieldActionRow flat 전용 슬림화 · AddressPicker 검색버튼 DS Button 채택 — 목업 피드백 기반 DS 정리 3건.
  - **Select `searchable` (검색형, Ant `showSearch` 모델)** — 옵션이 많을 때 드롭다운 상단 검색 인풋으로 label 필터. 값은 **항상 options 중에서만** 선택된다(자유 입력 X — 그건 Autocomplete). `searchPlaceholder`(html `search-placeholder`) · `emptyMessage`(html `empty-message`) 추가. 검색 결과 0건 빈 상태, 키보드(검색 중 ArrowDown 으로 리스트 진입 · Enter 첫 매치 선택 · Escape 닫기), 검색어는 열 때마다 리셋. MultiSelect 의 검색 패턴과 일관. react/styles/html 3면 미러.
  - **FieldActionRow flat 전용 슬림화 (⚠️ breaking)** — 구 Compound API(`FieldActionRow.Root/.Row/.Field/.Timer/.Action/.Helper`) 제거. "전화·코드 인증 폼 1줄"(입력 + 액션 버튼 + 타이머 + 헬퍼) 전용 helper 로 스코프 명시. 기존 flat API(`field`/`action`/`actionTone`/`timer`/`timerExpired`/`error`/`helperText`/`success`/`slotProps`)는 그대로. 마이그레이션: 합성 대신 flat prop 으로 전달.
  - **AddressPicker 검색 버튼 — DS Button 채택** — native `<button>`(자체 `__btn` 스타일) 재발명을 제거하고 `Button size="field"`(html `<nds-button size="field">`)로 교체. 버튼 비주얼은 Button 토큰이 SSOT, AddressPicker 는 레이아웃(field-row 내 flex-shrink)만 책임. (참고: SearchInput 의 검색/클리어 버튼은 입력 내부 아이콘 어피던스라 별개 — 변경 없음.)

  MCP 가이드: Select(searchable 예시 + Select-vs-Autocomplete 구분) · Autocomplete(역방향 구분) · FieldActionRow(인증 폼 전용 스코프) 갱신. Storybook(Select `Searchable` 스토리 + 필터 interaction test, FieldActionRow Compound 스토리 제거) · docs(select/field-action-row) 동기화.

- d77e956: SelectionButtonGroup: 그룹 내 옵션을 기본 등폭으로 정렬

  '전체' / '특정 지역' 처럼 묶인 옵션의 라벨 길이가 달라도 너비가 들쭉날쭉하지 않도록,
  SelectionButtonGroup 의 옵션을 기본값에서도 가장 넓은 옵션 기준 등폭으로 렌더한다
  (inline-grid + grid-auto-columns:1fr). `fullWidth` 는 그룹을 콘텐츠에 hug 시킬지(false)
  컨테이너 100% 로 늘릴지(true)만 결정한다. react/html 공용 CSS(@nudge-design/styles) 변경이라
  두 표면에 동일 적용된다.

- fe39b07: 시멘틱 토큰 prefix 통일 — `--semantic-*` 가 색·여백을 모두 흡수.
  - **새 이름**: `--semantic-gap-{tight/default/comfortable/loose/wide}`, `--semantic-gap-title-{h1~h5}`, `--semantic-inset-{chip/input/card/card-large/modal}` 로 emit.
  - **옛 이름 호환**: `--gap-*`, `--gap-title-*`, `--inset-*` 는 `var(--semantic-...)` 의 deprecated alias 로 함께 emit. 외부 consumer 가 옛 이름을 그대로 사용해도 동작 (cascade 정상). 다음 major 에서 alias 제거 예정.
  - DS 내부 (`@nudge-design/react`, `@nudge-design/styles`, `@nudge-design/html`) 의 `var(--gap-*)` / `var(--inset-*)` 소비처 ~800 건 모두 `var(--semantic-...)` 로 마이그레이션. 외부 동작 동일.
  - MCP validator / guides 안내문도 새 prefix 로 갱신 (`pattern:semantic-spacing` 등).
  - 죽은 prefix `--eap-*` / `--color-semantic-*` 흔적도 함께 정리.

  prefix 의 의미가 명확해졌어요 — `--semantic-` 가 보이면 Figma 정합 SSOT, `--nds-` 가 보이면 DS 자체 컴포넌트 슬롯.

- 2a4e6de: Toast ↔ Snackbar 의미 재정리 — "인터랙션 있는 알림은 자동으로 사라지면 안 된다"를 기준으로 역할을 갈랐다.
  - **Toast = 인터랙션 없는 일시 메시지** 전용으로 축소. 자동으로 사라지므로 `action`(되돌리기/다시시도)·닫기 버튼·캐포비 흰 카드 chrome 을 제거했다. **`ToastData.action` 제거(breaking)** — `toast(msg, { action })` 를 쓰던 곳은 Snackbar 로 옮겨야 한다. 남은 책임: message + variant(default/success/error/warning/info) + 자동닫힘 + multi-stack.
  - **Snackbar = 액션/닫기가 있는 카드형 알림**으로 확장. 인라인(`<Snackbar>`, 부모가 표시 통제)에 더해 **`Snackbar.Provider` + `useSnackbar()`** 인프라를 신설 — 포지셔닝(top/bottom/top-right) · 자동닫힘 · 단일 교체(maxCount=1) · 스택을 DS 가 관리한다. HTML 미러로 **`<nds-snackbar-host>`** 매니저 신설(+ 누락돼 있던 `<nds-snackbar>` export 복구).
  - **캐포비 admin 흰 카드 알림(구 Toast) → Snackbar 로 이관.** Default/Success/Error/Warning/Info 5개 state 의 흰 카드 외형(흰 배경 + 그림자 + radius 8) · status 칩 아이콘(24) · 닫기 X · 우측 상단 고정 · 단일 교체를 `data-project="cashwalk-biz"` cascade + `project="cashwalk-biz"`(칩 아이콘 렌더)로 Snackbar 가 직접 렌더한다(이전엔 호스트 커스텀 렌더 필요). variant 색은 인라인 style 대신 CSS(`data-variant`)로 옮겨 프로젝트 카드 cascade 가 배경을 덮을 수 있게 했다.

  MCP 가이드(`COMPONENT_GUIDES.Toast`/`Snackbar`) 의미·캐포비 project spec(matrixOverrides) 을 Snackbar 로 이관, Storybook 스토리(Snackbar 에 Provider·캐포비·인터랙션 테스트 추가 / Toast 에서 action·캐포비 스토리 제거) · AllComponents 설명 · componentInventory 동기화.

- 26df7ba: Tabs 에 `variant="segment"` 추가하고 SegmentedControl 컴포넌트 폐기(흡수).
  - **Tabs variant='segment'**: 연결된 회색 트랙 위 균등 분할 단일선택(iOS 세그먼트). active = 흰색 떠오름(surface.default + shadow), tone='color' 면 프로젝트 채움. mobile(36) / pc(40, 아이콘 동반). react/styles/html 3면 미러.
  - **SegmentedControl 제거**: 컴포넌트(`SegmentedControl` / `nds-segmented`) · 스타일 · export · 스토리 · 카탈로그 · 인벤토리 · MCP 가이드 전부 삭제. 기존 SegmentedControl 사용처는 `Tabs variant="segment"` 로 마이그레이션(SegmentedControl 의 default/solid 중 default(흰 raised)만 흡수, solid 는 폐지).
  - AllComponents · Tabs 스토리에 segment(mobile/pc) 노출. MCP 가이드·인벤토리·검증룰 cross-ref 를 Tabs variant=segment 로 갱신.

- b887f41: TagInput 일반화 — 이메일 초대형(입력+추가버튼, 칩 아래)을 **기본**으로, 기존 인라인 토큰필드를 variant 로.
  - **`variant="stacked"` (신규 기본)** — 입력칸 + 우측 추가 버튼(입력 있을 때만 활성, 검정 neutral 채움) + 칩은 **아래** wrap(중립 회색 pill + 원형 X). 멤버/이메일 초대·수신자 패턴.
  - **`variant="inline"`** — 기존 동작(칩이 입력칸 안쪽 tokenfield).
  - **`prefix`** (기본 `""`) — `#` 강제 제거, 해시태그는 `prefix="#"` 로 opt-in. (저장값엔 prefix 미포함, 표시 시 부착.)
  - **`pattern`**(정규식)·**`validate`**(함수)·**`onInvalid`** / `nds-tag-invalid` 이벤트 — 이메일 등 형식 검증. 실패 시 추가 안 됨(입력 유지).
  - `addButtonLabel` 추가.
  - **치수/색 정합**: 입력칸·추가버튼이 Input 과 동일한 `--nds-input-height`/`--nds-input-radius`/`--nds-input-padding-x` 슬롯을 추종 → 캐포비 admin 40px/radius4, base 48/8 로 cascade(둘이 항상 flush). 입력칸 색은 input 시멘틱(`input.bg`·`borderDefault`·`borderFocus`·`borderError`·`placeholder`·`helpertext*`), 추가버튼 채움은 button 시멘틱(`button.bgSecondary`/`textSecondary` = 프로젝트 검정 CTA), 칩은 `surface.subtle`·`icon.disabled`. 전부 시멘틱 cascade(리터럴 0).
  - 추가버튼은 입력칸에 붙는 정사각 affordance라 IconButton(최대 36·고스트)/Button(40px 없음·radius8)으론 정렬이 깨져 인라인 유지 — 단 button 시멘틱 토큰으로 버튼 시스템과 일관.
  - 버그 수정: 한글 IME 조합 중 Enter 로 마지막 글자가 중복 입력되던 문제 — `isComposing`(keyCode 229) 가드로 조합 확정 전 Enter 무시.

  ⚠️ 동작 변경: 인자 없이 쓰던 기존 TagInput 은 이제 stacked + `#` 미부착으로 렌더됨. 해시태그식이 필요하면 `variant="inline" prefix="#"` 로 마이그레이션. (레포 내 사용처·스토리·MCP 가이드·AllComponents 모두 갱신.)

- d86906c: TimePicker 시/분 선택 컬럼의 스크롤바 UI 제거. 스크롤 기능(`overflow-y: auto`)은 유지하되 스크롤바만 숨김(`scrollbar-width: none` + `-ms-overflow-style: none` + `::-webkit-scrollbar { display: none }`) — 좁은 시간 선택 패널의 시각 정돈.
- 2a4e6de: `TitleBlock` → `TitleGroup` 로 이름 변경 (헤딩 + 서브타이틀 표준 블록).

  업계 표준(Atlassian/Primer/Polaris/Carbon 등)을 조사한 결과, 페이지 헤더 셸은 `PageHeader` 라는 이름이 거의 보편적이라 그대로 두고, 헤딩+서브타이틀을 묶는 타이포 유틸은 비표준 이름이던 `TitleBlock` 대신 "묶음" 의미가 명확하고 `Block`(레이아웃 스택)과의 혼동을 피하는 `TitleGroup` 으로 정리했습니다. props(`level`/`title`/`subtitle`)·동작·토큰 매핑은 동일합니다.

  **⚠️ Breaking — 외부 프로젝트 마이그레이션 필요:**
  - React: `import { TitleBlock }` → `import { TitleGroup }`. 타입 `TitleBlockProps`/`TitleBlockLevel` → `TitleGroupProps`/`TitleGroupLevel`.
  - HTML(웹컴포넌트): `<nds-title-block>` → `<nds-title-group>`. 클래스 `NdsTitleBlock` → `NdsTitleGroup`.
  - CSS 클래스: `.nds-title-block`(`__title`/`__subtitle`) → `.nds-title-group`. 직접 셀렉터를 타기팅한 커스텀 스타일이 있으면 같이 변경.

  `PageHeader` 는 변경 없음. `PageHeader`/`Card` 안에 `TitleGroup` 을 중첩하는 패턴은 그대로 정상입니다.

- 6834bfd: Toggle 라벨 내장 status 변형 + tone 추가 (어드민 리스트 노출 토글용).
  - `onLabel`/`offLabel`(HTML `on-label`/`off-label`) — 트랙 **안**에 on/off 텍스트(예: 노출/미노출). 주면 폭 auto + 큰 썸(30 / thumb 25, Figma 캐포비 3172:577). 켜짐=라벨 좌측, 꺼짐=라벨 우측.
  - `tone="project"`(기본) | `"success"` — 켜짐 트랙 색. success 는 초록(semantic status-success 토큰 = `iconRole.statusSuccess`), raw hex 없이 5 프로젝트 자동 대응.
  - react `Toggle` / html `<nds-toggle>` 미러, `@nudge-design/styles` `.nds-toggle__inner-label` + labeled/tone 규칙 추가. 기본 토글 동작·DOM 무변경(회귀 없음).

- b887f41: OtpInput → **VerificationCodeInput** 개명 + 단일 코드 필드로 책임 정리.
  - **개명(Breaking)**: `OtpInput` → `VerificationCodeInput`, 태그 `nds-otp-input` → `nds-verification-code-input`, 이벤트 `otp-change`/`otp-complete` → `code-change`/`code-complete`, 타입 `OtpInputProps` → `VerificationCodeInputProps`. "OTP"는 자리별 박스(= PinPad)를 연상시켜 단일 필드 컴포넌트엔 부적합 — "인증번호 입력 필드"임을 이름에 명시.
  - **단일 코드 필드로 한정**: 웹용 단일 박스(자리별 세그먼트는 이미 제거됨)에 더해 **내장 카운트다운/재전송도 제거**. 이 컴포넌트는 코드 입력 필드만 책임진다. 타이머·재전송·확인 버튼이 함께 있는 인증 폼은 **FieldActionRow** 로 합성한다(타이머는 FieldActionRow 가 필드 안에 렌더, 버튼은 액션 슬롯) — OtpInput 타이머 ↔ FieldActionRow 타이머 중복 제거.
  - **입력 토큰 정합**: resting border·placeholder 를 `cv.input.borderDefault`·`cv.input.placeholder` 로 통일(다른 input 계열과 동일 — 잠금으로 빠졌던 펜딩 해소).
  - Storybook: 타이머/내장 카운트다운 레시피 → `Recipe/인증 폼 (FieldActionRow 합성)` 으로 대체. MCP `VerificationCodeInput` 가이드 + html 테스트 갱신.

  마이그레이션: `<nds-otp-input>` → `<nds-verification-code-input>`, `import { OtpInput }` → `import { VerificationCodeInput }`, 이벤트 `otp-*` → `code-*`. 내장 타이머/재전송(`countdownSeconds`/`onResend`/`countdown-seconds`/`otp-resend`) 쓰던 곳은 `FieldActionRow` + `CountdownTimer` 합성으로 전환.

- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
- Updated dependencies [5973f82]
- Updated dependencies [501ff41]
- Updated dependencies [fe39b07]
  - @nudge-design/tokens@0.0.2

## 0.0.1

Initial release.
