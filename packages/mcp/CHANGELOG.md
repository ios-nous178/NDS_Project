# @nudge-design/mcp

## 0.0.4

### Patch Changes

- aad9872: 영역 체계 3분화 — 서비스 / 어드민(b2b) / 백오피스(사내)
  - **어드민(외부 제공 b2b 어드민 서비스)**: 하드게이트 프로젝트만 지원 — `DS_ADMIN_PROJECTS = cashwalk-biz, nudge-eap`. 이 프로젝트들의 어드민은 antd 가 아니라 DS(html 워크플로우)로 만든다 (넛지EAP 는 전용 admin 토큰 없이 기존 DS 컴포넌트/토큰으로, 캐포비 전용 page-pattern/design-spec 게이트는 캐포비에만 유지). 게이트 밖 프로젝트의 어드민 요청은 차단되고 백오피스 전환/DS팀 편입 안내를 반환한다.
  - **백오피스(사내 어드민/CMS/운영툴)**: 기존 admin-cms(antd) 가이드를 중립화 — NudgeEAP 전용 문구(푸터 카피 등)를 `serviceName` 파라미터로 주입하는 공통 컨벤션으로 전환. 프로젝트 무관 전 서비스 기본 지원. topic/intent 는 `backoffice` 가 canonical, `admin-cms` 는 영구 별칭으로 유지(기존 외부 워크스페이스 호환).
  - **확답 우선 라우팅**: 운영자 화면 키워드(어드민/백오피스/CMS/운영툴 등)는 영역을 키워드로 추측하지 않고, get_setup/claude-md 가 가이드·셋업 본문 없이 확답 질문만 반환하는 하드스톱(`ambiguous-operator`)으로 동작 — `intent:'admin'`/`intent:'backoffice'` 명시 재호출로만 진행. 예외: 캐포비는 자체 admin DS 보유라 질문 없이 DS 경로 우회(기존 동작 보존).
  - 어드민(b2b) 셋업 시 `nudge.surface=admin` 마커를 기록해 validator 표면 룰과 자동 연동.

- 936ff60: BottomNav 추가 — 모바일 하단 탭 바 공식 primitive (프로젝트 무관)
  - **신규 `BottomNav`** — compound + 슬롯 API. `<BottomNav activeKey onChange>` 안에 `<BottomNav.Item itemKey label icon activeIcon href badge>`. 활성/비활성 아이콘 분리, 우상단 배지, 키보드/aria(role=tablist·aria-current) 지원.
  - **프로젝트를 모르는 컴포넌트** — 색·배경·보더·높이는 전부 `--nds-bottomnav-*` 슬롯으로 노출되고 프로젝트 토큰이 값만 덮는다. 프로젝트별 아이콘/라벨은 호출부가 주입한다. (프로젝트별 `{Project}BottomNav` 래퍼를 대체하는 공개 primitive — 래퍼 정리는 후속 chrome 통합에서.)
  - **3면 미러** — react(`BottomNav`) ↔ styles(`.nds-bottom-nav`) ↔ html(`<nds-bottom-nav>` / `<nds-bottom-nav-item>`). html 은 slot=icon / slot=active-icon 으로 아이콘 주입, active-key 변경 시 자식 active 자동 좌표화.
  - MCP 가이드 신설 + validator 가 새 태그(`nds-bottom-nav` / `nds-bottom-nav-item`)를 인식.

- 526c227: 프로젝트 로고 발견성 — admin/CMS 사이드바 로고를 컴포넌트로 (텍스트·수동 base64 우회 차단)

  배경: 프로젝트 로고는 `@nudge-design/assets` 에 5개 프로젝트 모두 data URI 로 내장돼 있고 `<nds-project-logo project>` / `<nds-sidebar project>` 가 자동 주입하는데, 이 easy-path 가 캐포비에만 표면화돼 있어 다른 프로젝트(예: 지니어트) 백오피스 CMS 사이드바에서 텍스트 placeholder→빌드 산출물 base64 추출이라는 우회가 반복됐다.
  - **ProjectLogo 가이드 일반화** — 캐포비 온보딩 중심 서술을 모든 프로젝트의 백오피스/CMS 사이드바·헤더·어드민 셸 로고 슬롯으로 확장. "antd 등 비-DS 화면이라 패키지 import 못 한다"는 오해를 명시 차단(`import { getProjectLogo }` / `<ProjectLogo>`).
  - **admin-shell 패턴** — 사이드바/톱바 로고 = `<nds-sidebar project>` 자동 주입(또는 `<nds-project-logo project>`). 텍스트 placeholder·색박스·빌드 산출물 base64 추출 금지 규칙 + avoid + metric 추가.
  - **get_project projectLogos 안내 보강** — snsLogos 수준으로: 컴포넌트 경로(`<nds-project-logo>` data URI 내장) + 목업/호스팅 이중 경로(getProjectLogo import).
  - **validator 신규 룰 `admin-sidebar-logo-not-component` (warn)** — admin 셸 사이드바·톱바에 텍스트 로고나 수동 base64 `<img>` 가 있고 `<nds-sidebar project>`/`<nds-project-logo>` 가 없으면 환기. 캐포비 온보딩 한정이던 text-logo 차단을 전 프로젝트 admin 셸로 일반화. 사이드바 아이콘(inline SVG)·계정 아바타는 오탐 제외(테스트 6건).

- c941e74: 캐포비 본인인증 패턴 가이드 신설 + 품질점수 감점 근거 세분화
  - **pattern:cashwalk-biz-verification 신설** — VerificationCodeInput 가이드가 참조하던 패턴이
    실제로 없어(404) AI 가 인증 폼을 즉흥 합성하던 공백을 채움. 정규 레시피 명문화: 코드 입력은
    `nds-verification-code-input`(일반 `nds-input` 금지), 전송/재전송은 full-width 검정 버튼 하나,
    남은시간 타이머는 앱 합성 인라인 요소, 확정은 하단 CTA(별도 "인증하기" 버튼 안 둠),
    에러는 비어있지 않은 message 의 `nds-notice-alert`, 성공 체크는 DS 아이콘(원·체크 같은 색의
    invisible hand-roll SVG 금지).
  - **score_mockup_quality 감점 근거 세분화** — 차원별 감점 사유에 발생 횟수 + 줄 위치(line a, b…)를
    붙이고 잦은 사유부터 정렬. 점수만 보고 "어디를 왜 깎였나" 모르던 문제(특히 SPA 누적집계)를
    줄 위치로 짚어줌.

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

- 869e02a: chrome 정리 — Sidebar 를 목업 전용 nds-project-chrome 으로 흡수 (Phase 3, BREAKING)

  프로젝트-aware admin 사이드바를 공개 react 면에서 걷어내고, 목업 전용 html 한 곳으로 모은다.
  (chrome 통합 플랜 Phase 3 — Phase 2/4 와 동일 방향.)
  - **react `Sidebar` 컴포넌트 제거(BREAKING)** — 프로젝트 로고·캐포비 admin 튜닝이 박힌 admin 셸이라
    공개 primitive 가 아니다. admin 사이드바 화면은 목업 전용 html `<nds-sidebar>` 로 만든다.
  - **html `<nds-sidebar>` 는 그대로 유지** — 코드만 standalone `nds-sidebar.ts` 에서 `nds-project-chrome`
    으로 흡수(병합). element 명·속성·UI·여닫기(collapse/서브메뉴 토글) 동작 모두 동일. `NdsSidebar` export
    도 유지(deep 모듈 경로만 이동). admin chrome 도 프로젝트 chrome 의 한 형태로 한 파일에 모임.
  - 가이드(`component:Sidebar`, `pattern:cashwalk-biz-admin-sidebar`)를 html 전용으로 재프레이밍 —
    제거된 react `<Sidebar>` ready-made/예시 정리. validator·목업 intake 는 `<nds-sidebar>` 그대로라 무변경.
  - 폐기 잔재 정리: orphan `cashwalk-biz-sidebar-example.ts` + 생성기 제거.

  대체: admin 사이드바 → `<nds-sidebar project="cashwalk-biz">` (또는 `pattern:cashwalk-biz-admin-sidebar`
  ready-made). 공개 react 에는 사이드바 primitive 를 두지 않는다(admin = 목업 html).

- 71111ac: 별점 렌더 통합 — ReviewCard·MediaCard 가 StarRating 을 재사용 (3중 중복 제거)

  ReviewCard·MediaCard 가 각자 별점 SVG 를 재구현하던 것을 StarRating 단일 구현으로 통합했습니다.
  - StarRating 에 `precision` prop 신설 — `"half"` 면 0.5 단위 반쪽 별 표시. 기본 `"full"`(정수 반올림), 인터랙티브 입력 모드는 항상 정수.
  - react: ReviewCard·MediaCard 가 `<StarRating precision="half">` 를 렌더(자체 renderStars 제거).
  - html: nds-star-rating·nds-review-card·nds-media-card 가 공유 `base/star-icons.ts` 헬퍼를 사용. nds-star-rating 에 `precision` attr 추가.
  - 채움/빈 별 색은 기존 `--nds-rating-star`/`--nds-rating-star-empty` 슬롯 그대로.
  - MediaCard 는 정수 반올림 → 반쪽 별 표시로 별점 정밀도가 올라갑니다(예: 4.5 → 4.5개로 표시).

- 9e3a6ad: CountdownTimer 컴포넌트 제거 (강등) · PriceTag 간격 보정
  - **CountdownTimer 제거 (BREAKING)** — 종료 시각 카운트다운은 DS 편입 기준(2+ 프로젝트 사용 / Figma 가이드 노드)을 충족하지 못하고, 실사용은 인증 코드 입력 레시피 한 곳뿐이라 **앱이 합성하는 인라인 타이머 패턴**으로 강등했습니다. react `CountdownTimer`, html `nds-countdown-timer` 제거. 인증 폼에서 남은시간 표시가 필요하면 코드 입력 우측에 앱이 직접 인라인 요소(예: `<span>03:00</span>`, 브랜드색)를 겹쳐 배치하세요 — `get_guide({ topic: 'component:VerificationCodeInput' })` 의 레시피 참고.
  - **PriceTag 간격 보정** — sm·lg 사이즈의 요소 간격이 좁아 보이던 문제를 보정(sm 4→6px, lg 10→12px, md는 유지). react·html 미러 동일 적용. 더불어 토큰값 gap 이 `var(--…)px` 로 깨져 lg 가 기본값으로 폴백되던 react 보간 버그를 함께 수정.

- 2b51ea7: 내부 정리: 제거된 `trostEapBanner` 토큰 이름을 primary-color-overload 검출 정규식에서 제거했습니다. 해당 CSS 변수는 실제로 emit 된 적이 없어 동작 변화는 없습니다.
- find_asset 한글 검색 보강 + figma 가이드 baseline 정리
  - `packages/mcp/asset-tags.ko.json`(id→한글 동의어) 사이드카를 SSOT 로 신설하고, build-asset-catalog 가 이 태그를 검색 토큰에 머지한다. 이제 "비빔밥·족발·김치·라면·돈까스·우울증·영양제" 같은 한글 질의로 프로젝트 이미지가 잡힌다(기존: 영문 id 만).
  - find_asset 카테고리 한글 alias 확장(한식/중식/일식/양식·영양제·약·상담·채팅·음료).
  - guide-figma-baseline waiver 에서 figmaNodeUrl 이 채워진 5건(DatePicker·Popup·Radio·Select·Textarea) 제거.

- 9fd3a10: 폼/입력 정리 — FieldActionRow·NotificationItem 제거(BREAKING) · 라벨 13px 통일 · FormField success · ContentViewer 안전강화

  ### 제거 (BREAKING)

  외부에서 import 중이면 빌드가 깨집니다.
  - **FieldActionRow** (`nds-field-action-row`): 인증행 전용 컴포넌트 — 이미 있는 `InputGroup`·`VerificationCodeInput`·`CountdownTimer` 와 기능이 겹쳐 제거했습니다. 인증 폼은 `FormField` + `InputGroup` + `VerificationCodeInput`(+ `CountdownTimer`) 합성으로 만드세요. 가이드/스토리에 새 레시피를 넣어 뒀습니다(`get_guide({ topic: 'component:VerificationCodeInput' })`).
  - **NotificationItem** (`nds-notification-item`): Figma 디자인 근거도 실사용처도 없는 선젬이라 제거했습니다. 알림 리스트는 `List` + `ListItem` 합성으로 표현하세요.

  ### 개선
  - **필드 라벨 글자 크기를 13px(caption1)로 통일** — 컨트롤마다 12~15px 로 제각각이던 라벨이 한 값으로 정렬됩니다. 같은 필드가 bare(`<Input label>`) 일 때와 `FormField` 로 감쌌을 때 13/14px 로 달라지던 문제가 사라집니다. (전 입력 컴포넌트 라벨 크기 미세 변경 — QA 시 참고)
  - **`FormField` 에 `success` 상태 추가** — 에러가 없을 때 "인증되었습니다" 같은 성공 헬퍼 텍스트를 success 톤으로 표시합니다(react `success` prop / html `success` 속성).
  - **`ContentViewer` 안전 처리 강화** — 허용 태그·속성·URL 스킴만 남기는 allowlist 방식으로 바꿨습니다(문자열 1차 제거 + 클라이언트 DOM allowlist). 신뢰할 수 없는 입력은 여전히 DOMPurify 사전 처리 권장.

- 45f4f23: 캐포비 admin 폼 입력 정합 — FormField 좌측 라벨 top 정렬 + Input size 정리 (BREAKING)

  **FormField `labelPosition="left"` 라벨 정렬 수정**
  - 좌측 라벨을 입력 세로 중앙으로 끌어내리던 보정 `padding-top`(default 10px / admin 12px)을 제거. 이제 Figma 대로 **라벨 시작점 = 입력 시작점(top 정렬)**. `align-items: flex-start` 한 자리로 처리돼 입력 높이(40/48 등)와 무관하게 라벨이 항상 컨트롤 상단에 붙음 — density/size 조합이 어긋나도 라벨이 처지지 않음.

  **Input `size="compact"` 제거 (BREAKING)**
  - `InputSize` 가 `"default" | "field" | "compact"` → `"default" | "field"` 로 좁혀짐. `compact`(40px)는 한때 "캐포비 admin TextField 표준"으로 문서화됐으나, admin 입력 표준은 프로젝트 토큰 정합(`fc223c7a`, cashwalk-biz `--nds-input-height` 40→48) 이후 **48px** 임. admin 폼은 `size` 미지정(캐포비 project :root 48 cascade) 또는 `field`(48) 를 사용. 기존 `size="compact"` 사용처는 size 속성을 제거하면 됨.
  - raw 토큰 `sizing.input.compact`(40)은 유지 — 컴포넌트 size API 에서만 제거.

  **html `nds-input` `field` 높이 parity 버그 수정**
  - html `SIZE_CONFIG` 의 `field` 가 44px 로 박혀 react/토큰(48px)과 어긋나 있던 react↔html mirror parity 버그를 수정 → **48px** 로 일치. `size="field"` 를 쓰던 html 소비처는 4px 커짐.

  **가이드/주석 정합**
  - FormField / Input / `cashwalk-biz-form-layout` 가이드와 프로젝트 토큰 주석에서 "admin = compact 40 / 48 로 두면 select 와 어긋남" 류의 stale 서술을 **admin = 48** 로 정정 (`cashwalk-biz-form-layout` 은 정반대로 48 을 경고하고 있었음). FormField 좌측 라벨 정렬도 "중앙" → "top(시작점 일치)" 으로 갱신.

- b192881: 가이드 공백 해소 — FormSection · SelectionButton MCP 컴포넌트 가이드 추가(둘 다 figmaNodeUrl 보유). 외부 목업 프로젝트가 `get_guide({ topic: 'component:FormSection' })` / `component:SelectionButton` 으로 사용 규칙·함정을 받을 수 있다.
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

- 45f4f23: 목업 워크플로우 개선 3종 (목업 세션 피드백 반영)
  - **검증 응답 토큰 절감** — `validate_html_mockup` 이 같은 룰(인라인 스타일 등)을 다수 보고할 때, 룰별 첫 5건 뒤(꼬리)는 `selector` 를 생략해 응답·컨텍스트 비대화를 막음(회고: inline-color 240건이 단일 응답을 점거하고 이후 턴마다 따라다님). 룰별 전체 카운트·line 은 `violationsByRule` 에 그대로 보존돼 정보 손실이 없고, 위반당 1행을 적재하는 telemetry(rule-stats) 카운트도 유지된다.
  - **모바일 viewport 보장** — `build_singlefile_html` 이 산출물 `<head>` 에 `<meta name="viewport">` 를 자동 주입(멱등 — 원본에 있으면 건드리지 않음). 누락 시 모바일이 데스크탑 폭으로 렌더돼 카드/다열 그리드가 짓눌리던 문제를 차단. 원본에 누락된 경우 `validate_html_mockup` 이 `missing-viewport-meta`(warn)로 환기.
  - **반응형 작성 가이드 보강** — 설계 원칙과 `pattern:container-section` 에 (1) 다열 그리드의 모바일 1열 fallback (2) "DOM 순서 = 시각 순서" — 랭킹을 위해 DOM 을 열 우선(1,6,2,7…)으로 깔지 말고 `grid-auto-flow:column` 사용 (3) viewport meta 필수 규칙을 추가. 목업 CLAUDE.md 템플릿에 "인라인 스타일 지양·클래스 우선" 하드룰 추가.

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

- 71111ac: 선젬 컴포넌트 3종 제거 — CallControlBar · TimeSlotPicker · OnlineIndicator (BREAKING)

  디자인 근거(Figma 가이드 노드)도 소비처도 없이 미리 만들어둔("선젬") 컴포넌트 3종을 정리했습니다. react/html export·styles·스토리·가이드·docs·카탈로그·baseline 전부 삭제.
  - **CallControlBar** (`nds-call-control-bar`): 통화 컨트롤 바 — 도메인 고정. 다시 필요하면 `IconButton` 합성으로 앱 레이어 레시피.
  - **TimeSlotPicker** (`nds-time-slot-picker`): 슬롯 선택 그리드 — 소비처 0. 자유 시각 입력은 `TimePicker` 사용.
  - **OnlineIndicator** (`nds-online-indicator`): presence 점 — 소비처 0. 진짜 Figma 노드가 생기면 그때 재편입(재현 5분, low-regret).

  **외부 소비자가 import 중이면 빌드가 깨집니다.**

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

- 6cf02a3: 도메인 카드 3종 제거 (BREAKING) + 2종 재분류
  - **제거**: `UserCard`, `CounselorCard`, `AppointmentCard` — react/html export·styles·가이드·스토리·docs·카탈로그 전부 삭제.
    - UserCard·CounselorCard: 순수 슬롯 배치라 `Card` 합성으로 대체하세요. UserCard = `Card.Avatar`+`Card.Title`+`Card.Subtitle`+`Card.Description`+`Card.Metadata`+`Card.Cta`. CounselorCard = `Card.stories` 의 CompoundCounselorCard 레시피.
    - AppointmentCard: 날짜 파생·status/mode 상태머신은 앱 로직 — 앱 레이어 컴포넌트로 옮기고 시각은 `Card` 합성.
    - **외부 소비자가 import 중이면 빌드가 깨집니다.** 위 Card 합성으로 마이그레이션하세요.
  - **재분류**: `MediaCard` 등 범용 프리미티브를 카탈로그상 `도메인` → `일반`/`데이터` 로 이동 (코드/API 무변경).

- 9cdb78a: 아이콘은 정적 npm 으로만 배포 — S3 런타임 fetch / 버전 surfacing 제거

  SVG 아이콘을 S3 로 옮기던 작업을 되돌렸습니다. 아이콘은 작고(수 KB) 트리셰이킹·타입세이프·오프라인 렌더링 이점이 커서 정적 `@nudge-design/icons` npm 패키지로 유지하는 게 맞습니다(런타임 S3 fetch 는 FOUC 만 생기고 얻는 게 없음). 무거운 raster 자산(로고/일러스트)만 S3 하이브리드를 유지합니다.
  - `@nudge-design/icons`: `./remote-url`·`./manifest.json` 서브패스 export 제거, 빌드에서 S3용 manifest 생성 단계 제거. 아이콘은 자체 npm 버전 트랙(additive → patch/minor bump)을 유지하되 `manifest.json`/S3 에 미러하지 않습니다.
  - MCP/목업 스탬프: 아이콘 버전(`icon_version` / ICON 세그먼트) surfacing 제거. DS·asset 버전 표기는 그대로입니다.
  - 퍼블리시 스크립트(`publish-assets-s3`)·버전 sync(`sync-mcpb-version`)·MCPB 번들에서 아이콘 S3 경로 제거(에셋 S3 는 유지).

- f0d2f21: 가로 스크롤 레일 유틸 `.nds-scroll-x` 신설 + 카드 장식 라인 금지 가이드
  - **`.nds-scroll-x` 공용 유틸 클래스** (`@nudge-design/styles` → `styles.css`): `overflow-x:auto` + 스크롤바 숨김(`scrollbar-width`/`::-webkit-scrollbar`/`-ms-overflow-style`)을 한 벌로. 손으로 짠 카드 레일·칩 row·가로 탭에 클래스 하나만 걸면 가로 스크롤바가 숨겨진다. (FilterBar·ChatInput·Tabs·PopularPosts·TimePicker 가 각자 재구현하던 관용구의 SSOT — 기존 5곳은 의도된 구현이라 그대로 두고 신규 코드만 이 유틸을 쓴다.)
  - **`pattern:scroll-rail` 가이드 신설**: 가로 스크롤 레일 레시피 — `.nds-scroll-x` + 호출부 `display:flex; gap` + 아이템 `flex-shrink:0`(찌그러짐 방지). `nds-card` 는 호스트가 `display:contents` 라 폭을 호스트가 아닌 카드 박스/래퍼에 줘야 함을 명시(`display:block !important` 핵 우회 금지).
  - **카드 장식 라인/accent 바 금지** (Card 가이드 pitfall + `pattern:visual-antipatterns` 표면 그룹): 상단 컬러 라인·좌측 accent 보더·`::before` 컬러 바로 카드를 장식하지 않는다. 카드가 가질 수 있는 선은 outlined 중립 1px 보더와 옵션 footer/divider hairline 뿐 — 컬러 accent 선은 DS Card 에 없다.

- 1c52a0e: 수집/로깅을 Supabase 단일 ingest 로 이전 + 목업 라운드·토큰 다이어트.
  - 텔레메트리(Tier2)·옵저버빌리티(Tier3)·사용량(usage) 전송이 전부 Supabase Edge Function `ingest` 한 곳으로 모입니다 (이전: 로컬 127.0.0.1 수집 서버 + Google Sheets webhook — 외부 머신에서 무증상 유실되던 경로 폐기). 원격 적재는 메타데이터만 — PRD/HTML 원문은 로컬에만 남고, 서버가 2차로 원문 필드를 drop 합니다.
  - `validate_html_mockup` 이 위반 0건 통과 시 DS 채택률 stats 를 자동 동봉합니다 — 별도 `withStats` 호출 라운드가 사라집니다.
  - `find_icon({ category })` 에 `offset` 페이징 추가.
  - 구버전 장문 CLAUDE.md 를 감지하면 슬림 템플릿 갱신을 안내합니다.

  (react 는 코드 변경 없음 — MCPB 외부 전파 트리거용 patch bump)

- 479bc02: Text 타이포 primitive 추가 + 공용 타이포 클래스 레이어 · ExpandableText·ContentViewer 정리 (BREAKING)

  ### 추가
  - **Text** (`nds-text`) — 타이포 primitive. `variant`(타입 스케일 14단)·`tone`(시맨틱 색 12종)·`weight`·`maxLines`·`as` 를 토큰에서만 받아 임의의 텍스트에 거는 얇은 컴포넌트입니다. Heading 의 body 짝 — "제목+설명 묶음"은 `Heading`, "한 덩이의 텍스트(본문·라벨·메타·캡션)"는 `Text` 를 쓰세요. `expandable` 로 길면 '더보기/접기' 토글이 됩니다.
    - 예: `<Text variant="body1" tone="normal" as="p">…</Text>` / `<Text variant="caption1" tone="subtle">메타</Text>` / `<Text expandable maxLines={3}>긴 설명…</Text>`
  - **공용 타이포 클래스 레이어** (`.nds-text-{scale}` / `.nds-text-tone-{role}` / `.nds-text-weight-{name}`) — DS 의 첫 공용 타이포 SSOT. 컴포넌트마다 `font-size`/`line-height` 를 인라인으로 박던 패턴을 대체합니다. 신규 디자인 토큰은 0개(기존 `typeScale`·`textRole`·`fontWeight` 재사용).

  ### 제거 (BREAKING)

  외부에서 import 중이면 빌드가 깨집니다.
  - **ExpandableText** (`nds-expandable-text`) → **`Text` 의 `expandable` 로 흡수**했습니다. `<ExpandableText lines={3}>…</ExpandableText>` 는 `<Text expandable maxLines={3}>…</Text>` 로 바꾸세요. 라벨(`expandLabel`/`collapseLabel`)·`hideCollapse`·제어(`expanded`/`onExpandedChange`) prop 은 그대로 옮겨옵니다.
  - **ContentViewer** (`nds-content-viewer`) → **`Article.Body` 로 통합**했습니다. sanitize 안전 렌더 로직은 그대로 살아있고, 공개 컴포넌트만 없앴습니다. `<ContentViewer html={…} />` 는 `<Article.Body html={…} />` 로, html 은 `<nds-article-body html="…">` 로 바꾸세요(위험태그 제거 + allowlist 동작 동일).

  ### 개선
  - **Heading** 이 새 공용 클래스 레이어를 소비하도록 이전 — 폰트 크기를 JS 인라인으로 박던 코드를 제거해 타이포 SSOT 를 하나로 모았습니다(시각 동작 동일).

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

- Updated dependencies [f4b8b47]
- Updated dependencies [82113f1]
- Updated dependencies [936ff60]
- Updated dependencies [3e8ac4c]
- Updated dependencies [6cf1c11]
- Updated dependencies [b192881]
- Updated dependencies [ee19f9a]
- Updated dependencies [eb0ea32]
- Updated dependencies [869e02a]
- Updated dependencies [1fba74b]
- Updated dependencies [4b74d9c]
- Updated dependencies [71111ac]
- Updated dependencies [001e5e8]
- Updated dependencies [9bdf86f]
- Updated dependencies [88807ea]
- Updated dependencies [9e3a6ad]
- Updated dependencies [27351df]
- Updated dependencies [7f8c3d0]
- Updated dependencies [9fd3a10]
- Updated dependencies [45f4f23]
- Updated dependencies [41bdf61]
- Updated dependencies [665ca93]
- Updated dependencies [912e3ce]
- Updated dependencies [135c86a]
- Updated dependencies [942bf66]
- Updated dependencies [051a2b4]
- Updated dependencies [375be74]
- Updated dependencies [5549360]
- Updated dependencies [a50fb91]
- Updated dependencies [91764fe]
- Updated dependencies [e23b5d1]
- Updated dependencies [37cdb34]
- Updated dependencies [3b73446]
- Updated dependencies [4ed845d]
- Updated dependencies [36b178c]
- Updated dependencies [9e3a6ad]
- Updated dependencies [268ebe4]
- Updated dependencies [eab0abc]
- Updated dependencies [6cf1c11]
- Updated dependencies [60db43c]
- Updated dependencies [f09304a]
- Updated dependencies [f91ad95]
- Updated dependencies [2b51ea7]
- Updated dependencies [8e3c764]
- Updated dependencies [bdfea38]
- Updated dependencies [71111ac]
- Updated dependencies [1a8ada6]
- Updated dependencies [31e9245]
- Updated dependencies [206ed62]
- Updated dependencies [2b51ea7]
- Updated dependencies [4ee00ac]
- Updated dependencies [6cf02a3]
- Updated dependencies [f4b75e1]
- Updated dependencies [9cdb78a]
- Updated dependencies [46d4d87]
- Updated dependencies [2d6463a]
- Updated dependencies [1c52a0e]
- Updated dependencies [c995f79]
- Updated dependencies [479bc02]
- Updated dependencies [a5f7eda]
- Updated dependencies [27a44be]
- Updated dependencies [7405016]
- Updated dependencies [2effb30]
- Updated dependencies [1d09bb3]
- Updated dependencies [1578e14]
- Updated dependencies [e94bac4]
  - @nudge-design/react@0.0.4
  - @nudge-design/assets@0.0.2
  - @nudge-design/tokens@0.0.4
  - @nudge-design/icons@0.0.2
  - @nudge-design/mockup-core@0.0.4

## 0.0.3

### Patch Changes

- b68ed61: Asset 사이즈를 Avatar 새 스케일에 정합

  Asset 의 size 프리셋을 Avatar(Figma 1337:8)와 동일 스케일로 맞췄다 — **md 40→48 · lg 48→64 · xl 64→96**(xs 24·sm 32 동일), Asset 전용 `2xl` 은 80→120 으로 상향(순서 유지). shape='rounded' 의 cornerRadius 도 고정 8px → **사이즈별 4/6/8/10/12(2xl 14)** 로 Avatar 와 동일하게(`--nds-asset-radius` 슬롯, 임의 px size 는 ~0.16 비율). 이제 같은 size·shape 에서 Asset 과 Avatar 가 시각적으로 일치한다. 프로덕션 소비처 없음(스토리만 사용) — 외부에서 Asset size 를 픽셀 의도로 쓰던 곳만 확인 필요.

- e69fcf9: Avatar Shape 3종 + 가이드 사이즈 정합 · 넛지EAP Card 규칙 패턴

  **Avatar (Figma 1337:8 정합)** — `shape` prop 신규(circle 기본 · rounded · square, 사이즈별 rounded radius 4/6/8/10/12) + 사이즈 스케일을 가이드 5종(24/32/48/64/96)에 맞춤. 키 API 는 유지(xs/sm/md/lg/xl)하되 픽셀값을 가이드에 정합 — **md 40→48 · lg 48→64 · xl 64→96 으로 변경**(xs 24·sm 32 동일). 이미지 부재 fallback 은 이니셜 **1자 Bold**(기존 2자→1자). AvatarGroup 도 동일 스케일·shape 전파(px/font 는 `avatarSizeConfig` 에서 파생해 중복 하드코딩 제거). 프로덕션 DS 컴포넌트는 Avatar 를 슬롯(ReactNode)으로 받으므로 사이즈 변경의 직접 영향 없음 — 앱에서 `size="md/lg/xl"` 를 픽셀 의도로 쓰던 곳은 새 스케일 확인 필요.

  **Card (Figma 713:2 — 넛지EAP CardRulesGuide)** — `pattern:nudge-eap-card` 신규: 넛지EAP 서비스 카드는 ① 내부 CTA 허용(4종: Full-width 48 / Compact 40 / Icon+Text 44 / Ghost), ② shadow 금지·border-only, ③ radius 12 고정. 기존 `component:Card` 가이드의 "[Figma 권위 룰]"(CTA 금지·Elevation 0/1)은 Geniet 도메인 기준임을 명시하는 프로젝트 분기 캐비엇 추가(컴포넌트는 Card.Cta/Footer 슬롯으로 양쪽 모두 지원 — 차이는 사용 규칙).

- 73eca2e: Badge `shape` prop 추가 (default | pill) — 캐포비 admin Badge 가이드 동기화 (Figma 3782-20558)
  - `shape="default"`(라운드 사각)=동적 상태값(충전·사용·적립·만료·취소), `shape="pill"`(완전 둥근)=정적 식별 태그(일반 계정·프리미엄·신규). 기본값 default 로 기존 동작 유지.
  - React `Badge`/HTML `<nds-badge shape>` 미러. 톤은 기존 ghost 변형으로 매핑(신규 토큰 없음).
  - MCP 가이드에 shape 정책·캐포비 ChipGuide 레퍼런스·동적/정적 혼용 금지 pitfall 추가.

- 07ce830: 캐포비 admin Modal 가이드 동기화 (Figma ModalGuide 3418-471)
  - 푸터 액션 버튼 크기 갱신: 높이 44px→48px, 폭 120px(single)/hug(dual)→**128px 고정**(Single·Dual 모두 우측 정렬 pill).
  - ④ Confirm + Slot 을 **두 개의 독립 슬롯**으로 가이드에 명문화 — slot a=severity(Notice info/caution/error) · slot b=BodyContent 컨트롤(ContentSlot/Input/Select/DatePicker). Variant Showcase 반영.

- 7a04a69: 캐포비 본인인증(휴대폰/이메일 → 인증번호) 플로우 구현 지원 — FieldActionRow action 옵션화 · CountdownTimer tone="project"

  캐포비 비밀번호 찾기 등 본인인증 화면(연락처 입력 → 별도 full-width 검정 [재전송] → 코드 입력 + 인라인 타이머 → 하단 [다음])을 DS 컴포넌트로 그대로 구현할 수 있게 두 군데 갭을 메웠다.
  - **FieldActionRow `action` 옵션화** — 이제 action 을 생략하면 "코드 입력 + 우측 타이머만"(인라인 버튼 없는 줄)을 렌더한다. 인증번호 전송/재전송이 별도 full-width 버튼이고 코드 입력엔 타이머만 두는 캐포비 레이아웃을 직접 만들 수 있다. (react/html 미러)
  - **CountdownTimer `tone="project"`** — 진행 중 타이머를 프로젝트 액센트색으로(캐포비 = 오렌지 #FD9B02, `text.project` 토큰). 인증 코드 입력의 오렌지 타이머를 정확히 재현한다. urgent(≤10초) 빨강은 tone 과 무관하게 우선. (react/html/styles 미러)
  - **가이드** — 온보딩 패턴에 "03c 본인 인증 Section" 추가, VerificationCodeInput 가이드에 캐포비 본인인증 레시피(별도 재전송 + 타이머만 코드 입력) 추가, FieldActionRow·CountdownTimer 가이드에 신규 옵션 반영.

- 7a04a69: 캐포비(cashwalk-biz)는 알림에 Snackbar 만 사용 — Toast 사용을 validator 가 차단

  캐포비 알림 SSOT 는 흰 카드 chrome·우측 상단 고정·상태 칩 아이콘·닫기 X 를 가진 Snackbar 인데, 이를 권고하는 가이드만 있고 검증룰이 없어 캐포비 목업에서 `<nds-toast>` 가 아무 위반 없이 통과하던 공백이 있었다. `validate_html_mockup` 에 `cashwalk-biz-toast` 룰(error)을 신설해, `data-project="cashwalk-biz"`(별칭 cashpobi 포함) 화면의 `<nds-toast>` 를 전면 차단하고 Snackbar 로 안내한다. Toast 컴포넌트 가이드(component:Toast)도 "캐포비는 Toast 미사용 — 예외 없음" 으로 문구를 강화했다. 다른 프로젝트의 Toast 사용은 영향 없음.

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

- d6e2deb: MultiSelect(다중 선택 드롭다운) 패널을 캐포비 어드민 Figma 실측(MultiSelectDropdown 4123-1406)에 맞춰 정리

  리포트/필터의 다중 선택 드롭다운 모양을 디자인 시안과 일치시킨다. 동작(초안 편집 → 적용)은 그대로, 패널의 시각 구조만 손봤다. (react/styles/html 미러)
  - **검색**: 테두리 없는 flush 입력 → **테두리 있는 인셋 검색창**(패널 상단 패딩 박스 + 하단 구분선).
  - **전체선택 행**: 배경을 옅은 회색(surface.subtle)으로 구분하고 라벨을 한 단계 큰 16/medium 으로(옵션 14 와 위계 분리).
  - **행 높이/여백**: 옵션·전체선택 행을 48→44h 정렬(좌우 16 / 상하 12).
  - **푸터**: 풀폭으로 양쪽에 꽉 차던 [취소][적용] → **우측 hug 정렬**. 색을 `secondary` → **`neutral`** 로(캐포비 검정 CTA 규칙 — 적용=검정 solid, 취소=outlined. secondary 는 캐포비 denylist 라 잠재 회귀였음).
  - **패널 폭**: 360 → 392px.
  - MCP `component:MultiSelect` 가이드에 패널 내부 구조·푸터 규칙을 고정하고 컴포넌트 SSOT Figma 노드(4123-1406)로 갱신.

- 7a04a69: 온보딩 멀티스텝 푸터(이전+제출) 지원 · 스텝퍼/수량스텝퍼 구분 또렷이
  - **온보딩 멀티스텝 푸터** — 가입 심사처럼 [이전 단계]+[제출]이 있는 멀티스텝 온보딩은 버튼을 카드 안이 아니라 **카드 아래 분리된 캔버스 푸터**(좌 [이전 단계] outlined hug + 우 [제출] primary solid hug)에 둔다. `validate_html_mockup` 의 `onboarding-cta-not-fullwidth`(단일 액션 CTA full-width 강제) 룰이 이전버튼 존재를 감지해 멀티스텝 제출의 hug 를 **면제**하도록 고쳤다(직전 릴리즈의 오탐 회귀 해소). 이전버튼이 카드 안에 있으면 `onboarding-back-button-inside-card` warn. 온보딩 가이드에 단일 액션 vs 멀티스텝 두 레이아웃을 명시.
  - **Stepper / NumberStepper 구분** — '지금 몇 단계인지 보여주는 진행 표시'는 `Stepper`(component:Stepper), '폼 안에서 숫자를 +/- 로 올리는 입력 칸'은 `NumberStepper`(component:NumberStepper). 이름이 비슷해 혼동되던 둘을 양쪽 가이드 summary 에 상호 결정 한 줄로 또렷이 했다.

- 31b219e: Pagination / PageSizeSelect 가이드에 동작·배치 규칙 보강 (Figma PaginationGuide 4118-1186)
  - `component:Pagination` 에 URL 쿼리 파라미터 동작(?page=N · ?page=N±1 · ?size=N&page=1)·노출 개수 변경 시 page=1 리셋·8페이지+ 생략(…) 압축·우하단 배치(FilterBar 정렬)·노출 개수는 PageSizeSelect 통일 규칙 추가.
  - `component:PageSizeSelect` 옵션 4종(10/30/50/100개씩 보기)·캐포비 152×48·page=1 리셋 명문화. 컴포넌트 코드 변경 없음(박스 cascade 는 이미 정합 — 가이드 전용).

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

- 409f10b: Tab↔Filter 결정 가이드를 컴포넌트 레벨로 끌어올림 (Figma DesignGuide/Tab 3544-206)
  - `component:Tabs` / `component:FilterBar` 가이드에 Tab vs Filter 역할 구분·결정 트리(Q1/Q2/Q3)·화면 배치 순서(타이틀→Tab→FilterBar→데이터)·Underline/Box 사용 구분을 추가. 기존엔 `pattern:cashwalk-biz-tab` 에만 있던 내용을 컴포넌트 가이드 사용자도 받도록.
  - 두 컴포넌트 가이드에 DesignGuide/Tab 레퍼런스 + 패턴 cross-ref 추가. (컴포넌트 코드 변경 없음 — 가이드 전용.)

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

- c0efbfa: ValidationChip 신규 + 폼 검증/합성 패턴 가이드 (넛지EAP InputFormGuide)

  넛지EAP Library 의 새 인풋 가이드(InputFormGuide 1399:124)에서 유일하게 DS 에 없던 **ValidationChip** 을 추가했다 — 입력 형식 요구사항 1개의 실시간 충족 신호(16px 체크 아이콘 + 12px 라벨). `state` 3종: `incomplete`(muted)·`complete`(Project Blue)·`error`(status-error). 아이콘·텍스트가 같은 색이라 root `color` 하나만 semantic 토큰으로 두고 SVG 는 `currentColor` 로 상속 → 5 프로젝트 cascade 자동 대응. react `<ValidationChip>` + html `<nds-validation-chip>` 3면 미러, Storybook 스토리·AllComponents 카탈로그 동시 등재.

  가이드(MCP): `component:ValidationChip` + 신규 `pattern:form-validation` — 회원가입 합성 3종(Input+ValidationChip 실시간 검증 · Input+Inline Button=FieldActionRow · Input+내장 password-toggle)과 Label/Helper/Error 규칙·검증 시점(onBlur/onSubmit/onChange)을 정리했다. 단일 필드 레이아웃은 기존 `pattern:nudge-eap-form-layout`, 컨트롤 선택은 `pattern:selection-controls` 로 위임.

- d6e2deb: 본인인증 UI 정리(FieldActionRow label · 인증코드 자간/placeholder) · 캐포비 모달 노랑 CTA 재발 가드

  목업 피드백에서 드러난 본인인증 화면 회귀 4건을 DS 근본에서 닫는다.
  - **FieldActionRow `label` 신설(react/styles/html 미러)** — 라벨이 필요한 인증 row(예: "휴대폰 번호" + [인증번호 받기])에서 라벨을 손으로 버튼과 같은 줄에 욱여넣어 버튼이 라벨 높이에 떠 어긋나던 회귀를 막는다. 이제 `label` 을 넘기면 라벨은 한 줄 위, 입력+버튼은 인라인으로 컴포넌트가 정렬한다.
  - **VerificationCodeInput 자간/placeholder** — 코드 값의 `letter-spacing` 을 0.08em → normal 로(단일 필드에서 숫자가 부자연스럽게 벌어져 어색하던 자간 수정). 기본 placeholder 도 "인증번호 6자리" → "인증번호 입력"(헬퍼가 이미 6자리를 안내해 중복 제거). (react/html/styles 미러)
  - **캐포비 모달/팝업 노랑(primary) CTA 재발 가드** — 색 캐스케이드는 이미 토큰으로 잡혔지만, 작성자가 모달 footer 버튼에 `color="primary"` 를 쓰거나 `color` 를 생략(Button 기본값이 primary)하면 여전히 노랑이 됐다(5회+ 재발의 진짜 원인). `validate_html_mockup` 에 `cashwalk-biz-modal-primary-cta`(error: 확인/팝업 모달 footer 의 primary/색생략 버튼 → 검정 neutral 요구, 대형 선택/데이터 모달은 면제) + `cashwalk-biz-modal-footer-stacked`(warn: 2버튼 세로 스택 금지 — 라벨 축약 방향) 룰을 추가하고, Modal·cta-group·FieldActionRow 가이드에 "모달 버튼 color 생략 금지(기본 노랑)·2버튼 가로 유지·전송 후 [재전송] 토글"을 명시했다.

- Updated dependencies [5771516]
- Updated dependencies [b68ed61]
- Updated dependencies [e69fcf9]
- Updated dependencies [a2ff1a0]
- Updated dependencies [73eca2e]
- Updated dependencies [e7a2978]
- Updated dependencies [07ce830]
- Updated dependencies [5771516]
- Updated dependencies [7a04a69]
- Updated dependencies [7a04a69]
- Updated dependencies [5771516]
- Updated dependencies [e7a2978]
- Updated dependencies [5771516]
- Updated dependencies [5771516]
- Updated dependencies [d6e2deb]
- Updated dependencies [9530a80]
- Updated dependencies [67741ea]
- Updated dependencies [72d2018]
- Updated dependencies [c0efbfa]
- Updated dependencies [d6e2deb]
  - @nudge-design/react@0.0.3
  - @nudge-design/tokens@0.0.3
  - @nudge-design/mockup-core@0.0.3
  - @nudge-design/icons@0.0.3
  - @nudge-design/assets@0.0.3

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

- 501ff41: ⚠️ BREAKING — Button taxonomy 통일 (전 프로젝트).

  축 정리: `shape{default, pill}` × `variant{solid, soft, outlined}` × `color{primary, secondary, neutral}`.
  - **`assistive` → `neutral` 하드 rename** (alias 없음): 토큰 슬롯(`buttonBg/text/border.assistive` × 전 프로젝트 semantic), `cv.button` 멤버(`bgAssistive`→`bgNeutral` 등), CSS 변수 `--semantic-button-*-assistive-*` → `--semantic-button-*-neutral-*`, validator(html-validator·mockup-validator) 룰(`assistive-solid-cta`→`neutral-solid-cta`), MCP 가이드. → 외부 프로젝트에서 `<Button color="assistive">` / `--semantic-button-*-assistive-*` var 사용 시 **변경 필요**.
  - **`outlined-sub` variant 제거** → `outlined` 로 흡수: react/html styleMap 의 3개 tone blocks·타입·`BUTTON_VARIANTS` 제거. 소비처(Trost AppBar·mockup-layout·stories) 는 `variant="outlined" color="secondary"` 로 마이그레이션(neutral 보더 유지). validator/guide/test enum 정리. → `<Button variant="outlined-sub">` 사용 시 **변경 필요**.
  - `color` prop 이름은 **유지**(Badge/Chip 등과 공유 prop — Button 만 tone 으로 바꾸면 API 엇갈림). tone 개념은 값(primary/secondary/neutral)으로 표현.
  - 시각 변화 없음(순수 rename/제거) — outlined-sub→outlined 흡수분만 weight medium→bold·text tone 미세 변화.

- eb9e899: 캐포비 어드민 리포트/타겟팅 화면용 컴포넌트 보강 — Figma 캐포비 Library(타겟팅 3001:18966 · 캠페인 만들기 3782:19709 · 인구통계별 리포트 3001:30014 · 광고별 리포트 3001:28554) 정합.

  신규 컴포넌트:
  - **MultiSelect** (`nds-multi-select`) — 검색 + 전체선택/해제 + 체크박스 리스트 + 취소/적용 푸터 + 빈 상태를 가진 다중 선택 필터 드롭다운. 일반 Select(단일·즉시 반영)와 달리 패널 안 초안을 편집하고 "적용" 시에만 반영. 리포트 상단 '광고 다중 선택' 필터용.
  - **AddButton** (`nds-add-button`) — 폼 안 "항목 추가"(지역/옵션/행) 유도 점선 affordance 버튼. `error` 로 빨간 실선 강조(인라인 메시지는 FormField 쪽). 일반 Button(CTA)과 의도 분리.
  - **PageSizeSelect** — "100개씩 보기" 행 수 선택 드롭다운(Pagination 짝). Select 재사용, HTML 은 nds-select 로 구성.

  기존 컴포넌트 보강:
  - **SegmentedControl** — `variant="solid"`(진한 Inverse fill + 흰 active) 추가. 리포트 노출/클릭 토글 정합.
  - **StatsTable** — 2단 그룹 슈퍼헤더(남성/여성 → 10대~60대 colspan) + `scroll`(가로 스크롤 컨테이너) + `stickyFirst`(좌측 라벨 열 고정) 지원.
  - **SelectionCard.Item** — title/description 외 리치 중첩 콘텐츠 슬롯(React `children` / HTML `slot="content"`) — Chip 행·bullet 리스트. 캠페인 목표 카드 정합.
  - **Input** — `maxLength` + `showCount`(HTML `maxlength` + `show-count`) 글자수 카운터(24/25), 초과 시 빨간색.

  MCP 가이드(get_guide)에 위 컴포넌트의 props·함정·Figma 노드 링크 추가/갱신.

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

- b887f41: 캐포비 admin `cashwalk-biz-tab` 패턴 가이드에 **Tab vs Filter 의사결정 가이드** 보강 — Figma 캐포비 Library(DesignGuide/Tab 3544:206) 정합.

  기존 Tab 카탈로그(Underline/Box 2 변형)에 더해, Tab 과 Filter 의 역할 구분을 가이드에 추가:
  - **역할 구분** — Tab = 상호 배타적 분류로 view 자체 전환(URL 경로 변경), Filter(FilterBar) = 현재 view 안에서 조건 점진적으로 좁히기(쿼리 파라미터 누적).
  - **결정 트리** — Q1 view 가 바뀌나→Tab / Q2 조건 누적→Filter / Q3 2–7개 단일선택→Radio·SelectionButtonGroup.
  - **화면 배치 순서** — 페이지 타이틀 → Tab → FilterBar → 데이터 영역.
  - **DO/Don't 안티패턴** — 큰 분류를 Filter 로·조건 좁히기를 Tab 으로 만들기 금지, Tab 중첩 금지, Underline·Box 혼용 금지, FilterBar CTA 1개 제한 등.

  컴포넌트(`Tabs` line/chip · `FilterBar`)·프로젝트 토큰 cascade 는 변경 없음 — 가이드(문서) 보강만.

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

- 2ae9ac5: Decision Log 누적 + get_guide 선택적 로딩(aspects) — "학습하는 DS" 파이프라인의 결정/스킬 단계 보강.
  - **Decision Log (`designDecisions.jsonl`)** — `save_design_spec` 이 `design-spec.json`(매번 덮어씀) 옆에 화면의 `decisions[]` + 노드별 `rationale` 을 한 줄씩 누적한다. 결정의 시간순 이력/메모리 소스(다음 단계 Memory Read 의 입력).
    - MCP 안(`saveDesignSpec`)에서 추출하므로 PTY·stream·외부 소비 프로젝트 모두 동일하게 적용.
    - 화면 정체성(project·surface·intent·name) 기준 dedup — 재저장/auto-fix 루프 중복 방지, 화면을 번갈아 저장해도 각 화면 기준 비교.
    - `ok` 를 dedup 해시에 포함 — 결정은 그대로인데 validation 이 false→true 로 바뀌면 새 행으로 남겨 '최종 승인 상태'를 기록(검증 전이 추적).
    - 최근 N행 상한(기본 200)으로 무한 증가/풀파일 비용 방지. 소비 프로젝트는 gitignore 권장.
    - 순수 코어(`buildDesignDecisionRow`) + IO(`appendDesignDecisionRow`/`readDesignDecisions`) 분리, best-effort(never throws).
  - **`get_guide({ aspects })`** — principles 가이드를 화면이 실제 필요한 측면(slice)만 골라 슬림하게 받는 친화적 파라미터. `DESIGN_PRINCIPLES` 가 이미 aspect별 top-level 키(projectTone/colors/typography/spacing/elevation/shapes/dos/donts/bannedPatterns)로 쪼개져 있어 데이터 재구조화 없이 `pickSections` 경로 재사용.
    - 별칭: `radius`→shapes, `color`→colors, `tone`→projectTone, `font`→typography, `shadow`→elevation, `dos-donts`→dos+donts+bannedPatterns 등. `sections` 와 병합 가능.
    - principles 토픽에만 적용(컴포넌트/패턴은 키 체계가 달라 무시 — 배치 누수·오인 에러 없음). 일부 aspect 만 오타면 `_unknownAspects` 마커로 알림, 전부 미지면 `validAspects` 동반 에러.
  - **`get_guide({ topic: 'principles' })` 학습된 원칙 승격(Decision Log → Principles)** — `<cwd>/designDecisions.jsonl` 에서 같은 프로젝트의 서로 다른 화면 N개(기본 3) 이상에서 반복된 결정/근거를 `_learnedPrinciples` 블록으로 끌어올려 principles 응답에 머지한다. "반복된 결정 → 프로젝트 관습" 을 자동 원칙화하는 단계.
    - project = 명시 인자 → `cwd` 의 `nudge.project` 마커 순으로 해석. cwd = 명시 인자 → MCP 프로세스 cwd(= `save_design_spec` 의 기본 기록 위치). 둘 다 best-effort — 파일 없음/임계 미만이면 응답 불변.
    - 화면별 최신 행으로 접어 재저장이 카운트를 부풀리지 않게 하고, ok=true 결정만 집계. count 내림차순 상한(기본 8). `aspects`/`sections` 슬라이스 뒤에 마커를 붙여 슬림 호출에도 항상 노출.
    - 순수 집계(`promoteDesignDecisions`)는 공용 코어(mockup-core)에 위치 — MCP·데스크탑·외부 소비 프로젝트가 동일 규칙 공유. `NUDGE_LEARNED_PRINCIPLES=0` opt-out, `NUDGE_PROMOTE_THRESHOLD` 로 임계 조정.
  - 결정 로그 read-side(타입·상수·`readDesignDecisions`·`promoteDesignDecisions`)를 공용 코어 `@nudge-design/mockup-core/tools/design-decisions` 로 단일화(데스크탑 Memory Read 와 SSOT 공유). mcp 는 re-export 로 API 호환 유지.
  - `save_design_spec` / `pattern:design-spec` 문서에 `designDecisions.jsonl` 부작용 명시. vitest 단위/통합 테스트 추가(design-spec 40 + guides 18).

- 543ef9c: 경량 DesignSpec(중간표현) 도입 — prompt → DesignSpec(JSON) → code.
  - 새 MCP 도구 2개:
    - `save_design_spec` — 경량 DesignSpec 을 카탈로그 기준으로 검증한 뒤 `<cwd>/design-spec.json` 으로 저장. `ok:false` 면 violations 를 고쳐 재저장(validate-before-code). 코드 작성 전에 사용자에게 보여주고 동의를 받는 soft 승인 게이트.
    - `validate_design_spec` — 파일 쓰기 없이 스펙만 검증(자기교정 루프용).
  - DesignSpec 은 *의도*만 담는다: 컴포넌트 트리(시멘틱 이름)·시멘틱 토큰 이름(hex 금지)·project/surface·결정 근거. 좌표·resolved 색·px·이미지는 담지 않는다 — 그건 코드→Figma `scene.json`(역방향 추출) 담당.
  - 컴포넌트 어휘는 `scene.ts` 의 `ndsTagToComponentName` 규칙을 공유(`Button` 또는 `nds-button` 둘 다 허용) — 정방향 spec ↔ 역방향 scene 을 컴포넌트 정체성으로 JOIN 가능(Phase 3 인스턴스 승격 대비).
  - 검증 룰: 시멘틱 토큰 only(raw hex/rgb → error, raw 팔레트 → warn), 카탈로그에 없는 토큰 → error, 프로젝트 실재 검사(silent base-blue 폴백 가드, html-validator 의 unknown-project-slug 와 동일 의미), 컴포넌트 존재(unknown → warn), prop enum 위반 → error.
  - `get_guide({ topic: 'pattern:design-spec' })` 추가 — 스펙 스키마·soft gate·언제 쓰는지 SSOT. CLAUDE.md html 템플릿에도 조건부 `§1-bis` 단계로 안내(단순 화면은 생략).
  - 카탈로그(tokenSet/componentNames/propAllowedValues/ndsAttrEnums + 프로젝트 셋)는 `configureDesignSpec` 으로 주입(configureHtmlValidator 패턴 미러). `validateDesignSpec` 는 순수 함수 — vitest 단위검증 20건.

- 8077540: 목업 런타임 미등록 회귀 수정 + 재발방지 가드.
  - **html 런타임 등록 누락 수정** — `define()` 은 하지만 `runtime.ts`(standalone 번들 side-effect 엔트리)에 import 되지 않아 단일파일 HTML 목업에서 미등록(빈 박스)이던 컴포넌트 10종을 등록: `nds-stepper`, `nds-pagination`, `nds-popup`, `nds-text-button`, `nds-coach-mark`, `nds-empty-state`, `nds-online-indicator`, `nds-snackbar`, `nds-snackbar-host`, `nds-sparkline`. 이 중 7종은 `index.ts` 배럴 export 도 함께 복원(react↔html parity).
  - **회귀 차단 lint 게이트 추가** — `define()` 하는 모든 컴포넌트가 `runtime.ts` 에 import 됐는지 검사하는 `check-runtime-registry` 를 `pnpm lint` 에 편입(`nds-stepper`/`nds-pagination` 회귀가 다시 안 나도록).
  - **목업 검증룰 2종 추가** — ① `nds-*` 호스트의 `textContent`/`innerText`/`innerHTML` 직접 대입(컴포넌트 내부 렌더가 지워짐) 감지, ② `<div role/onclick>` 로 파일업로드·페이지네이션·스텝퍼·검색을 자작한 경우 named warn.
  - **가이드 보강** — Stepper `variant=bar` + `StepItem.title` 문서화(+ Stepper vs MultiStepForm 결정 노트), Checkbox 전체선택의 `checked` 프로퍼티/`change` 이벤트 모델, cta-group 의 모달/팝업 푸터 pill·actionsLayout 규칙 교차참조.

- 25007ae: Input 비밀번호 표시/숨김 토글 내장 (auth/로그인 화면용).
  - `type="password"` 면 우측에 눈 아이콘 토글이 **자동** 노출 — 클릭 시 평문↔비밀 전환. 아이콘은 DS `eye`/`eye-off` 와 동일 path, `currentColor`(muted→hover strong) cascade.
  - `passwordToggle={false}` (HTML `password-toggle="false"`) 로 끌 수 있음. password 가 아닌 type 은 무시.
  - 접근성: 토글 버튼에 `aria-pressed` + "비밀번호 표시/숨기기" `aria-label`, `mousedown` preventDefault 로 입력 포커스 유지.
  - react `Input`(+ `InputPasswordToggle` compound) / html `<nds-input type="password">` 미러, `@nudge-design/styles` `.nds-input__password-toggle` 블록 추가.
  - 이전엔 suffix 슬롯에 eye 버튼 + type 상태를 매번 손조립해야 했음 → 내장으로 대체.

- 9f6dc9c: 목업 품질 점수화 — validate 결과에 차원별 0~100 `scores` 추가 (Eval D1).
  - `validate_html_mockup` / `build_singlefile_html`(validation) 응답에 `scores: { overall, dimensions }` 블록 추가. 위반 0/건수만이 아니라 **color / typography / spacing / layout / component / icon** 6개 차원의 0~100 점수와 overall(평균)을 함께 산출.
  - 결정적 환산: 기존 위반(`violationsByRule`)을 rule→차원 매핑 후 severity 가중(error −20 / warn −8 / info −3, 0 클램프)으로 점수화. 추가 모델 호출 0 · 순수함수(`computeScores`).
  - Kraft 의 코드기반 scorer(color-tokens/typography/layout/spacing/component-compliance/icon-usage)를 미러(animation 제외). 이후 self-correction 루프가 '위반 잔존' 대신 '점수<임계'로 트리거하도록 확장하는 토대.
  - 매핑 안 된 rule 은 점수에 반영하지 않음(보수적). validate 실행 실패 시 중립 만점(`NEUTRAL_SCORES`) 폴백.

- 4284604: 목업 작업 가이드에 기존 작업폴더 충돌 확인과 산출물 절대경로 보고를 강제한다.
  - 새 목업 요청에서 같은 기획으로 보이는 작업폴더가 명백히 보이면 기존 폴더를 수정하기 전에 v2 생성 여부를 묻도록 CLAUDE.md/AGENTS.md 템플릿과 visual-reference 패턴 가이드에 hard gate를 추가.
  - 목업 완료 응답에는 `dist/index.html` 상대경로만 쓰지 않고 최종 산출물 full 절대경로를 항상 포함하도록 완료 게이트와 셋업 안내를 보강.

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

- 24d2f0c: `pattern:consent` 가이드 신설 — 약관/개인정보 동의 화면을 전용 컴포넌트 대신 Checkbox(indeterminate) 조립 패턴으로 안내.

  전체동의(자식 비율로 indeterminate 파생)·필수/선택 구분·pre-tick 금지(개인정보보호법)·전체동의↔개별 의존 상태 등 동의 화면의 법적·state 함정을 PATTERN_GUIDES 에 박제. `get_guide({ topic: 'pattern:consent' })` 로 조회. ConsentChecklist 컴포넌트를 이 패턴으로 대체하기 위한 첫 단계(컴포넌트 삭제는 composite-trim 릴리즈에 합류 예정).

- 501ff41: 원칙 명문화 — **패턴(pattern:\*)의 모든 조각(잎)은 실재하는 nds-\* 컴포넌트로 그린다.**

  셀렉션/피커 모달처럼 여러 컴포넌트의 조립을 단일 컴포넌트로 안 빼고 패턴으로 두는 건 정상이지만, 그 잎(Modal·CheckboxTree·SelectedItemsPanel·SelectedItemRow·Button 등)이 전부 nds-_여야 한다. 대응 nds-_ 가 없어 raw `<div role=…>`·`<div onclick>` 로 잎을 흉내내면 재발명(avoidable-reinvention)으로 검증/점수(NDS%)에서 깎이고, 목업 에이전트가 그 자리를 억지로 고치려 thrash 한다. NDS% 는 '패턴이 한 개의 nds 태그인가'가 아니라 잎 nds 컴포넌트 수로 매겨지므로(레이아웃 div 는 분모 제외) 조립 자체는 감점이 아니다 — 빠진 잎이 있으면 패턴을 감싸지 말고 그 잎을 DS 에 신설하는 것이 해법.
  - MCP `DESIGN_PRINCIPLES.dos` 에 원칙 추가(get_guide 로 외부 목업 AI 에 전파).
  - `/ds-audit` 스킬에 점검 카테고리 8 "패턴 잎 커버리지" 추가(.claude SSOT + Codex 미러 재생성).

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
- Updated dependencies [d10a40f]
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
- Updated dependencies [eb9e899]
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
- Updated dependencies [26df7ba]
- Updated dependencies [6cd3190]
- Updated dependencies [26ba4d9]
- Updated dependencies [501ff41]
- Updated dependencies [5973f82]
- Updated dependencies [da7e96c]
- Updated dependencies [da1de6a]
- Updated dependencies [26df7ba]
- Updated dependencies [501ff41]
- Updated dependencies [25007ae]
- Updated dependencies
- Updated dependencies [b887f41]
- Updated dependencies [4263d5a]
- Updated dependencies [b887f41]
- Updated dependencies [2a4e6de]
- Updated dependencies [d77e956]
- Updated dependencies [fe39b07]
- Updated dependencies [8974351]
- Updated dependencies [2a4e6de]
- Updated dependencies [26df7ba]
- Updated dependencies [b887f41]
- Updated dependencies [d86906c]
- Updated dependencies [2a4e6de]
- Updated dependencies [6834bfd]
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
  - @nudge-design/react@0.0.2
  - @nudge-design/tokens@0.0.2
  - @nudge-design/mockup-core@0.0.2
  - @nudge-design/icons@0.0.2

## 0.0.1

Initial release.
