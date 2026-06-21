---
figmaNodeUrl: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=131-1769
references:
  - label: Geniet Card Guide — 4 Layouts (배치·크기)
    url: https://www.figma.com/design/0LLw2nSq9AUhXww7pWFRlm/?node-id=3056-125
    caption: 지니어트 Library · CardGuide. 배치/크기/radius 축의 Horizontal(328·r8) / Vertical(240×280·r12) / Grid(160×210·r8) / Container(440·r16+shadow, PC) 4 Layout. 콘텐츠 축(List/Thumb/Cover)과 직교 — 같이 읽는다. radius 스케일은 base sizeMatrix(8/10/12/14)와 다른 지니어트 단순화본(8/12/8/16).
    project: geniet
  - label: Trost Card Guide — Container card (platform · elevation · header)
    url: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5123-136
    caption: 트로스트 Container card. platform(pc=padding28·r16·title20·subtitle14 / mobile=padding20·r14·title17·subtitle13) + elevation(outline=보더 / elevated=shadow E2 + 보더 제거) + 헤더 행(리딩 아이콘 24px + 10px gap + title/subtitle 정보 컬럼, gap 2px) + 헤더↔본문 divider. point(인디고) 액센트 아이콘. 컴포넌트는 opt-in(platform/elevation/icon/showDivider) — 미지정 시 현행 렌더 그대로.
    project: trost
  - label: Runmile Card Guide — 이벤트 카드 (앱 레벨 composition)
    url: https://www.figma.com/design/MssCIDnDdAjStQXHclPNIc/?node-id=5117-130
    caption: '런마일 CardGuide. 표준 이벤트 카드(세로형 PC 280×432 / MO 159×343) = DS 프리미티브 composition (새 variant 아님). 썸네일(bg gray200 · radius 12 · 1:1 정사각) → 타이틀(18/15 Bold #221E1F · 2줄) → 메타 칩(=Badge · radius 4 · 12 Bold) → 날짜(calendar icon + 14/12 Medium gray800) · 주최(gray600) → 태그 칩(=Chip · 13 Medium gray900 · 흰 bg gray300 보더 · 최대 3). 3 ComponentSet: 표준 Card(5115:126) · competition card(5067:1828 가로형 622×138/296×138) · heart(5067:1819 좋아요 토글). 본문 ## runmile 섹션 참조.'
    project: runmile
usagePolicy:
  useFor:
    - 분류된 식품·콘텐츠 텍스트 나열 (List · 10개 이상 / 페이지)
    - 썸네일 + 보조 정보로 식별하는 식품/카테고리 카드 (Thumb)
    - 큰 이미지가 주인공인 식단/커뮤니티 4-up·2-up 그리드 (Cover)
    - 도메인 카드 (헬시딜 / 음식 검색 / 음식 리뷰 등) — Base variant + Composition 슬롯
    - 개별 오브젝트 선택·비교 (상담사 선택, 상품)
  doNotUseFor:
    - 단일 메시지 / 1회성 프로모션 → Banner
    - 텍스트+날짜+상태만의 단순 데이터 (상담 내역·예약·알림) → List Row
    - 컬럼별 비교가 핵심인 데이터 → Table
    - 시간순 연속 정보 (알림·채팅) → Feed / List
    - 탭·필터·내비게이션 역할 → Chip / Navigation
    - "주의/경고/안내 메시지 + bullet list + expand/collapse (예: '⚠ 섭취 주의사항') → Notice / Banner (caution tone) — Project soft bg + caution icon + expand/collapse 패턴은 Card 가 아님"
    - "관련 row 묶음을 외곽 보더로 포장한 컨테이너 (예: '루테인 포함 영양제 · 총 84개 제품') → Card 가 아니라 Section Card 별도 패턴 `get_guide({ topic: 'pattern:card-section' })`"
    - 장식용 — 동일 형식 반복이 아니면 Card 가 아님
  limits:
    variantUsageList: "사용 시점: 이미지 없이 텍스트와 메타데이터로 짧게 나열할 때 (분류별 식품 리스트). 트리거: 한 페이지에 10개 이상 노출될 때."
    variantUsageThumb: "사용 시점: 썸네일과 보조 정보를 함께 보여줘야 할 때 (식품 카드, 영양 코칭 가로형). 트리거: 콘텐츠 식별이 텍스트만으로 부족할 때."
    variantUsageCover: "사용 시점: 큰 이미지가 콘텐츠의 핵심일 때 (식단 사진 4-up 그리드, 커뮤니티 콘텐츠). 트리거: 그리드 형태로 시각적 임팩트가 필요할 때."
    titleRequired: 1
    variantsPerScreen: 1-2종
    variantsPerGrid: 1
    maxAvatarPerCard: 1
    maxBadgePerCard: 2
    maxStatusBadgePerCard: 1
    maxDescriptionLines: 3
    maxCoverDescriptionLines: 2
    maxMetadataItems: 2
    maxCtaButtonsInsideCard: 0
    maxNutritionTagsInComposition: 3
    radiusPerList: 1
sizeMatrix:
  anatomy.media: 썸네일 또는 커버 이미지. Thumb=정사각, Cover=4:3(PC)/1:1(Mobile). 단색 폴백 허용.
  anatomy.title: 카드 식별 핵심 라벨. 최대 2줄 + ellipsis. Body 2 ~ H4 / Bold.
  anatomy.meta: 수치·시간·단위 등 보조 정보. 1줄, ' · ' 구분자. Caption / Regular.
  anatomy.status: 상태 Badge. Success / Caution / Error 중 1개만.
  anatomy.action: 탭/이동 트리거. 카드 전체 클릭이 기본. 내부 CTA 버튼 사용하지 않음.
  anatomy.composition: (optional) 도메인 카드가 Base 위에 얹는 슬롯 — kcal chip · star rating · promotion badge · nutrition tag row.
  mobile.list: Width Fill · Padding 16/12 · Image — · Radius 8 · Title Body 3 Bold
  mobile.thumb: Width Fill · Padding 16/12 · Image 56×56 · Radius 10 · Title Body 3 Bold
  mobile.cover: Width Fill · Padding 16/12 · Image AR 1:1 · Radius 12 · Title Body 2 Bold
  pc.list: Width Fill · Padding 20/16 · Image — · Radius 10 · Title Body 2 Bold
  pc.thumb: Width Fill · Padding 24/20 · Image 72×72 · Radius 12 · Title Body 2 Bold
  pc.cover: Width Fill · Padding 0/16 · Image AR 4:3 · Radius 14 · Title H4 Bold
  geniLayoutHorizontal: "지니어트 배치형(Geniet Library) — 328×auto · radius 8 · padding 12 · 좌측 썸네일 행 카드. 음식 리스트·검색결과(Mobile). ≈ Thumb variant."
  geniLayoutVertical: "지니어트 배치형 — 240×280 · radius 12 · padding 0/12 · 상단 이미지 세로 카드. 추천·인기 카테고리 가로스크롤(Mobile). ≈ Cover variant."
  geniLayoutGrid: "지니어트 배치형 — 160×210 · radius 8 · padding 0/4 · 작은 그리드 카드. 카테고리 2·3열(Mobile). ≈ 작은 Cover."
  geniLayoutContainer: "지니어트 배치형 — 440×auto · radius 16 · padding 24 · shadow(E2) · PC 큰 카드(메인 콘텐츠·모달·Hero). Mobile=border / PC Container=shadow."
  geniLayoutNote: "위 4 Layout 은 '배치·크기·radius' 축으로 콘텐츠 축(List/Thumb/Cover)과 직교 — 함께 읽는다(Horizontal≈Thumb · Vertical/Grid≈Cover · Container=PC 큰 카드). radius 8/12/8/16 은 지니어트 Library 단순화본이라 base sizeMatrix(mobile 8/10/12 · pc 10/12/14)와 다름 — 한 스케일로 통일할지는 결정 필요."
  trostPlatformPc: "트로스트 Container card (platform='pc') — padding 28 · radius 16(radius[16]) · title 20(Headline 4) · subtitle 14(Body 3). PC 메인/모달 큰 카드."
  trostPlatformMobile: "트로스트 Container card (platform='mobile') — padding 20 · radius 14 · title 17 · subtitle 13(Caption 1). 모바일 화면."
  trostElevation: "트로스트 elevation — outline=현행(보더 1px, shadow 없음, 기본값) / elevated=box-shadow E2(shadow.e2) + 보더 제거. 한 화면 한 elevation 유지."
  trostHeaderRow: "트로스트 헤더 행 — 리딩 아이콘(24px, point/인디고 액센트) + 10px gap + 정보 컬럼(title 위 subtitle, gap 2px). icon prop 지정 시 활성. showHeader 로 아이콘 없이 컬럼만 묶기도 가능."
  trostBodyDivider: "트로스트 헤더/텍스트 ↔ 본문(children) 사이 hairline — showDivider prop. cta/footerText 위 divider(divider prop) 와 별개. 둘 다 1px cv.borderRole.subtle."
  runmileEventCard: "런마일 이벤트 카드 (Figma 5117:130) — 앱 레벨 composition, DS 새 variant 아님. 세로형 Card: PC 280×432 / MO 159×343. 썸네일 bg gray200 · radius 12(LG) · 1:1 정사각(PC 280×280 / MO 159×159). 슬롯: 썸네일 → 메타칩(Badge) → 타이틀 → 날짜·주최 → 태그칩(Chip). DS 매핑 = Card(Container) + Badge(메타칩) + Chip(태그)."
  runmileEventTypo: "런마일 이벤트 카드 타이포 — 타이틀 PC 18 / MO 15 Bold(#221E1F · 최대 2줄) · 날짜 PC 14 / MO 12 Medium gray800(+ calendar icon) · 주최 Medium gray600 · 메타칩 12/11 Bold · 태그칩 13 Medium gray900. 색·radius 세부는 Badge/Chip 가이드 SSOT 참조."
  runmileComponentSets: "런마일 Card 페이지 3 ComponentSet — ① 표준 Card(5115:126, 세로형) ② competition card(5067:1828, 대회 전용 가로형 PC 622×138 / MO 296×138 · date 인스턴스 + 상태 Badge + 대회명 16/14 Bold + 위치/날짜 + 내장 heart) ③ heart(5067:1819, 좋아요 토글 PC 30 / MO 28). competition card·heart 는 도메인 전용 — 표준 Card 와 별개 유지."
  cardGapMobile: 16px
  cardGapWebCMS: 24px
  elementGapTitleMeta: 4px
  footerSeparator: border-top 1px · padding-top 16px (Footer 슬롯 사용 시)
  typoMeta: Pretendard Caption 1 Regular 13px / LH 18px — var(--font-size-caption-1)
  compositionNote: Composition 슬롯은 Base variant 의 padding 안쪽에 위치. promotion badge 만 top-right absolute 허용.
stateMatrix:
  default: Elevation 0(border 1px · neutral border 토큰) 또는 Elevation 1(box-shadow 토큰) 중 화면 단위로 택1. bg = white 또는 Surface 토큰. 두 elevation 을 동시에 걸지 않음.
  hover: Border 색 변경 또는 미세한 bg tint. Elevation 1 화면에서는 shadow 한 단계 강조 가능. border+shadow 동시 강화 금지.
  activeSelected: Border 2px Project Color 또는 Surface tint. Elevation 1 화면이라도 selected 표시는 색으로.
  pressed: transition 100ms — bg tint 또는 scale(0.99). shadow 깜빡임 금지.
  note: "[Figma 권위 룰] 같은 화면 안에서 카드마다 elevation 종류가 다르면 안 됨. 한 리스트 = 한 elevation."
---

## summary

**프로젝트 분기 (먼저 확인)**: 아래 "[Figma 권위 룰]" 다수는 Geniet 도메인 카드(식품·영양, figma 131:1769) 기준이다. **넛지EAP 서비스 카드는 규칙이 다르다 — `pattern:nudge-eap-card`(Figma 713:2) 를 따른다**: ① 내부 CTA 허용(카드 최하단 Primary CTA 1개 — 상담 예약·전문가·프로그램 카드. Geniet 의 'CTA 금지'·`maxCtaButtonsInsideCard:0` 은 NudgeEAP 에 적용 안 됨), ② shadow 전면 금지·border-only(Geniet 의 'Elevation 0 또는 1 택1' 과 달리 NudgeEAP 는 elevation 미사용), ③ border-radius 12px 고정. 컴포넌트는 양쪽을 모두 지원(Card.Cta/Card.Footer 슬롯 존재) — 차이는 프로젝트별 사용 규칙이다.

동일 형식이 반복되는 콘텐츠 묶음을 시각적으로 그룹화하는 컨테이너. 1회성 메시지/프로모션은 Card 가 아니라 Banner. Figma 헤더 제약 4종: 3 Variants · PC & Mobile (반응형) · Image Optional (이미지 없는 변형 허용) · Semantic Token (raw hex / 임의 색 금지). Variant 3종 (List / Thumb / Cover) — 시각 우선순위·정보 밀도가 다르며 한 화면에서 1-2종만 함께 사용. List = 이미지 없이 텍스트+메타데이터로 나열 (트리거: 한 페이지 10개 이상 / 분류별 식품 리스트), Thumb = 썸네일 + 보조 정보 가로형 (트리거: 콘텐츠 식별이 텍스트만으로 부족 / 식품 카드·영양 코칭), Cover = 큰 이미지가 콘텐츠의 핵심 (트리거: 그리드로 시각적 임팩트 필요 / 4-up·2-up 그리드·커뮤니티). 도메인 출처: 지니어트(Geniet) 칼로리계산기 허브 페이지의 식품 리스트·영양 토픽·커뮤니티 카드. Compound 슬롯(순서 고정, 모두 Optional): Card.Root / Thumbnail / Avatar / Chips / Title / Description / Metadata / Divider / Cta / FooterText. (legacy: Header / Body / Footer 도 유지). Flat API props: thumbnail, avatar, chips, title, description, metadata, divider, cta, footerText, children. Anatomy 슬롯 (Figma SSOT, 한 카드 안에서 동일 위치 = 항상 같은 의미): Media(썸네일/커버, Thumb=정사각·Cover=4:3·단색 폴백 허용) · Title(필수, 카드 식별 핵심 라벨, 최대 2줄 + ellipsis, Body 2~H4 Bold) · Meta(보조 정보, 1줄, ' · ' 구분자, Caption Regular) · Status(상태 Badge, Success/Caution/Error 중 1개만) · Action(탭/이동 트리거 — 카드 전체 클릭이 기본, 내부 CTA 버튼 X) · Composition(optional, 도메인 카드가 Base 위에 얹는 슬롯). 도메인 카드(헬시딜·식품 검색·커뮤니티·랭킹·리뷰·식단 추천 등)는 새 variant 를 만들지 말고 Base variant 위에 Composition 슬롯을 얹어 표현 — 슬롯 카탈로그 16종(kcal chip · star rating · promotion badge · nutrition tag row · like overlay · author meta · discount badge · strikethrough price · shipping chip · certification chip · ranking leading · macro nutrition bar · category banner header · friend social proof · trending count · forum meta row)은 `get_guide({ topic: 'pattern:card-composition' })` 에서 슬롯별 사용 룰·위치·한도·금지 조합을 확인. Section/Group Card(카드 안에 list rows 를 담는 컨테이너 — '루테인 포함 영양제 · 총 84개 제품' 같은 묶음)는 단일 Card 가 아닌 별도 패턴 — `get_guide({ topic: 'pattern:card-section' })` 참고.

**Trost Container card (Figma 5123:136) — platform · elevation · 헤더 행 (모두 opt-in, 미지정 시 현행 렌더 그대로).** 트로스트 컨테이너 카드는 다음 3 축을 추가한다(전부 additive — 기존 카드 사용에는 영향 없음): ① **platform** (`platform="pc"` = padding 28 · radius 16 · title 20 · subtitle 14 / `platform="mobile"` = padding 20 · radius 14 · title 17 · subtitle 13). 슬롯을 root 에 set 해 프로젝트 상속값을 이긴다. ② **elevation** (`elevation="outline"` 기본 = 보더, shadow 없음 / `elevation="elevated"` = box-shadow E2 + 보더 제거 — Geniet 와 마찬가지로 한 화면 한 elevation). ③ **헤더 행** — `icon` prop(24px 리딩 아이콘, point/인디고 액센트) 지정 시 `title`/`subtitle` 좌측에 아이콘 + 10px gap + 정보 컬럼(title 위 subtitle, gap 2px) 행으로 렌더. `showHeader` 로 아이콘 없이 컬럼만 묶기, `showIcon=false` 로 아이콘 숨김 가능. ④ **헤더↔본문 divider** — `showDivider` prop 으로 헤더/텍스트와 본문(children) 사이 1px hairline(cv.borderRole.subtle). cta/footerText 위 divider(`divider` prop) 와 별개. point 색은 `cv.iconRole.point`/`cv.textRole.point`/`cv.borderRole.point` — 비-point 프로젝트는 project 토큰으로 자동 폴백. HTML 미러: `<nds-card platform elevation>` + `<nds-card-header-row>` / `<nds-card-header-icon>` / `<nds-card-header-info>` / `<nds-card-divider>` 서브 엘리먼트.

## pitfalls

- [Figma 권위 룰] Variant 혼용 금지 — 한 그리드 안에서 List/Thumb/Cover 를 섞으면 위계가 충돌. 한 화면에 1-2종만, 그리드 내부는 1종만.
- [Figma 권위 룰] Card 위에 별도 CTA 버튼 추가 금지 — Action 은 카드 전체 클릭이 기본. 카드 내부에 Solid/Outlined 버튼을 두면 카드 전체 클릭 영역과 충돌. 섹션 하단 '더보기' 같은 CTA 는 Card 가 아니라 Section 의 것.
- [Figma 권위 룰] Elevation 은 0(border) 또는 1(shadow) 중 택1 — border 1px 와 box-shadow 를 동시에 걸면 위반. 한 화면에서는 한 종류만 일관되게.
- [Figma 권위 룰] 임의 pastel/gradient/opacity 배경 금지 — White 또는 정의된 Surface 토큰 외 배경색 생성 불가. linear-gradient(), rgba 투명도, #E8F4FD 류 임의 hex 모두 차단.
- [Figma 권위 룰] Title 생략 금지 — 카드당 정확히 1개, 항상 가장 높은 시각적 위계. 최대 2줄 + ellipsis. Description/Metadata 가 Title 자리를 대신할 수 없음.
- [Figma 권위 룰] Status Badge 2개 이상 동시 노출 금지 — Success/Caution/Error 중 하나만 강조.
- [Figma 권위 룰] Cover 이미지 비율 임의 변경 금지 — 1:1 / 4:3 / 16:9 외 비율은 DS 에서 먼저 정의 후 사용.
- [Figma 권위 룰] Thumb 이미지 원형(circle) 금지 — Thumb 슬롯은 Radius 토큰 적용된 사각. 원형은 Avatar 슬롯 전용.
- [Figma 권위 룰] 한 리스트 내 Radius 토큰은 1종만 — 일부 카드만 Radius 가 다른 케이스는 위반.
- [Figma 권위 룰] Cover 본문 텍스트 3줄 이상 금지 — Cover 는 큰 이미지가 주, 본문은 짧게.
- [Figma 권위 룰] Meta 구분자는 ' · ' 통일 — '/', '|', '-', 줄바꿈 등 다른 구분자 금지. Caption / Regular 1줄.
- [Figma 권위 룰] Nested Card 금지 — Card 안에 또 다른 Card 삽입 X. 그룹은 Section / Divider 로 표현. bordered 박스를 카드처럼 흉내내는 것도 위반.
- [Figma 권위 룰] 광고/프로모션과 동일한 카드 스타일로 콘텐츠 카드 생성 금지 — Promo Card 는 별도 토큰 사용. 사용자 혼동 방지.
- Avatar + Thumbnail 동시 사용 불가 — 둘 중 하나만 (Avatar max 1개).
- Title 슬롯은 항상 Media 다음, 좌측 정렬 — 카드마다 다른 위치에 두면 안 됨.
- Thumb 이미지가 없을 때는 Project Soft 단색 폴백 사용 — 빈 회색 박스 / placeholder 이미지 금지.
- Decorative Card 금지 — 콘텐츠 위계가 없는 장식용 카드 생성 금지. 동일 형식 반복이 아니면 Banner/Section 사용.
- 카드 장식 라인/accent 바 금지 — 상단 컬러 라인(border-top accent), 좌측 accent 보더, ::before 컬러 바 등으로 카드를 장식하지 않는다. 카드가 가질 수 있는 선은 outlined variant 의 중립 1px 전체 보더와 옵션 footer/divider hairline(`border-top 1px subtle`) 뿐 — 컬러 accent 선은 DS Card 에 없다. 강조는 색이 아니라 Chip/Badge·텍스트 위계로, 영역 구분은 spacing/Divider 로. (`get_guide({ topic: 'pattern:visual-antipatterns' })` 표면 그룹 참고.)
- 그리드 카드 간격 임의 혼합(8/12/16/20px) 금지. Auto Layout: Mobile 16px, Web·CMS 24px.
- Card.Header / Card.Body / Card.Footer 는 styles.css 에 자체 padding 보유. 외곽에 padding 또 주면 이중 패딩.
- Card Overuse — 단순 텍스트+상태+날짜 목록(상담 내역·예약·알림)을 Card 로 감싸는 패턴. 정보 밀도 ↓, List Row 로 변경.
- 런마일 이벤트 카드는 Card 의 새 variant 가 아님 — Card(Container) + Badge(메타 칩) + Chip(태그)을 조합한 앱 레벨 composition. 새 variant/컴포넌트를 만들지 말고 프리미티브를 조합한다. 대회 정보는 표준 Card 가 아니라 competition card(가로형 · 별도 ComponentSet)를 쓴다.

## recommended

- List variant — 이미지 없이 Title + Meta. 분류된 항목을 좁은 간격으로 노출, 시각 가중치 최저. <Card.Root variant='list'><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>
- Thumb variant — 좌측 정사각 썸네일 + 우측 Title/Meta. 카테고리/식품 목록의 기본 카드. <Card.Root variant='thumb'><Card.Thumbnail/><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>
- Cover variant — 상단 큰 이미지(1:1 또는 4:3) + 하단 Title/Meta. 4-up / 2-up 그리드용. <Card.Root variant='cover'><Card.Thumbnail aspect='1:1'/><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>
- Composition Patterns (도메인 카드) — Base variant 선택 후 Composition 슬롯을 얹는다. variant 를 새로 만들지 않음. 슬롯 16종 전체 카탈로그·위치·한도·금지 조합은 `get_guide({ topic: 'pattern:card-composition' })`.
- 도메인 카드 예시 매핑 (Figma SSOT) — 헬시딜 랭킹 카드 = Cover + Slot7(discount badge) + Slot8(strikethrough+sale price) + Slot2(star rating) + Slot9(shipping chip) + Slot10(certification chip). 음식 리뷰 카드 = Cover + Slot5(like overlay) + Slot6(author meta) + Slot2(star rating). 다이어트·혈당 추천 카드 = Cover + Slot13(category banner header) + Slot4(nutrition tag row) + Slot12(macro nutrition bar) + Slot14(friend social proof). 지금 뜨는 한식 = List + Slot11(ranking leading) + Slot1(kcal chip) + Slot15(trending count). 커뮤니티 게시글 = List + Slot16(forum meta row).
- Section/Group Card (카드 안에 list rows 묶음 — 예: '루테인 포함 영양제 · 총 84개 제품') — 단일 Card 의 variant 가 아니라 별도 컨테이너 패턴. 룰·메트릭은 `get_guide({ topic: 'pattern:card-section' })`.
- Action 패턴 — 카드 전체가 클릭 영역. <Card.Root clickable onClick={…}>. 내부에 Solid/Outlined CTA 버튼 두지 않음. 섹션 하단 '더보기' 는 Card 가 아니라 Section 의 CTA.
- Thumb 폴백 — 이미지가 없을 때 Project Soft 토큰 단색 배경(예: var(--semantic-brand-bg)) + 옵션 아이콘.
- 지니어트 배치 매핑 (Geniet CardGuide 3056-125) — 음식 검색·식단 리스트(Mobile) → Horizontal(328·r8) / 홈 인기·추천 가로스크롤 → Vertical(240×280·r12) / 카테고리 그리드 2·3열 → Grid(160×210·r8) / PC 메인·모달 → Container(440·r16) / Hero 강조 → Container + shadow(E2). Mobile 은 border, PC Container 만 shadow — 한 화면 한 elevation 유지(위 Figma 권위 룰).
- Trost Container card (Figma 5123:136) — 트로스트 PC/모바일 큰 카드는 `platform` + `elevation` + `icon`/`showDivider` 로 표현. PC: `<Card platform='pc' elevation='outline' icon={<Icon/>} title=… subtitle=… showDivider>본문</Card>` (padding 28·r16·title 20·subtitle 14). Hero/모달 강조는 `elevation='elevated'`(shadow E2 + 보더 제거). Mobile: `<Card platform='mobile' elevation='outline' …>` (padding 20·r14·title 17·subtitle 13, border 권장). 리딩 아이콘은 point/인디고(cv.iconRole.point) 액센트. HTML: `<nds-card platform='pc' elevation='elevated'><nds-card-header-row><nds-card-header-icon>…</nds-card-header-icon><nds-card-header-info><h3 class='nds-card__title'>…</h3><p class='nds-card__description'>…</p></nds-card-header-info></nds-card-header-row><nds-card-divider></nds-card-divider><nds-card-body>본문</nds-card-body></nds-card>`.
- 런마일 이벤트 카드 (Figma 5117:130) — 표준 Card 위에 도메인 정보를 얹는 **앱 레벨 composition**(새 variant 아님). 세로형 PC 280×432 / MO 159×343, 썸네일 1:1 정사각(radius 12). 구성: 썸네일 → 메타 칩(Badge, 거리·D-day) → 타이틀(18/15 Bold, 2줄) → 날짜(calendar icon + gray800)·주최(gray600) → 태그 칩(Chip, 최대 3). 예: `<Card variant='cover' clickable><Card.Thumbnail aspect='1:1'><img src='…' alt='' /></Card.Thumbnail><Card.Chips><Badge color='project' variant='soft'>5km 외 2개</Badge><Badge variant='outlined'>접수마감 D-60</Badge></Card.Chips><Card.Title>2026 댕댕이레이스</Card.Title><Card.Metadata>📅 25.12.30~25.12.31 · (주)러닝포인트</Card.Metadata><Card.Chips><Chip>#강아지</Chip><Chip>#댕댕런</Chip></Card.Chips></Card>`. 색·radius 세부(태그칩 등)는 Badge/Chip 가이드 SSOT. 대회 정보는 표준 Card 가 아니라 competition card(가로형) 사용.

## accessibility

- clickable Card 는 <Card.Root clickable onClick> — 키보드 포커스/Enter 자동. raw <div onClick> 대체 금지.
- Cover 카드 이미지 위에 텍스트를 얹는 디자인이라면 Gradient Overlay 위에서 WCAG AA 대비비 확보 — 단, 이건 Banner 영역. Card 의 Cover 변형은 텍스트가 이미지 하단 별도 영역에 위치.
- 썸네일 <img> alt 필수 (장식이면 alt=''). 카드 제목과 중복되는 alt 는 비우기.
- Status Badge 는 색 + 텍스트 라벨 동시 노출 — 색맹 대응.

## interactivePattern

Card.Root 의 clickable + onClick 으로 인터랙티브화 — 카드 전체가 클릭 영역이고 내부에 별도 CTA 버튼을 두지 않는 것이 기본. Composition 슬롯의 promotion badge 처럼 시각만 강조하는 요소는 클릭 핸들러 없이 절대 위치만 잡고, 클릭은 Card.Root 가 받는다. Hover 피드백은 화면 elevation 정책에 맞춰 — Elevation 0 화면은 border 색 변경, Elevation 1 화면은 shadow 강조. 두 elevation 을 한 화면에서 섞지 않음.

## examplesHtml.do

```html
<nds-card variant="outlined" clickable>
  <nds-card-thumbnail ratio><img src="/cover.jpg" alt="" /></nds-card-thumbnail>
  <nds-card-body>
    <h3>제목</h3>
    <p>설명 텍스트</p>
  </nds-card-body>
</nds-card>
<script>card.addEventListener("card-click", () => navigate("/detail"));</script>
```

## examplesHtml.dont

```html
<!-- clickable 카드 내부에 또 다른 클릭 가능한 nds-button -> 중복 핸들러 -->
<nds-card clickable>
  <nds-card-body>제목</nds-card-body>
  <nds-button color="primary">자세히 보기</nds-button>
</nds-card>
<!-- raw <div class="nds-card"> 로 모양만 흉내. 키보드/포커스 룰 사라짐 -->
<div class="nds-card" onclick="…">…</div>
```
