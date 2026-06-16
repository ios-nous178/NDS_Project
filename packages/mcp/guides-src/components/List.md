---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=501-96
references:
  - label: Geniet List Guide — 4 Layouts
    url: https://www.figma.com/design/0LLw2nSq9AUhXww7pWFRlm/?node-id=3060-82
    caption: 지니어트 Library · ListGuide. Default / Avatar / Thumbnail(xl·h96) / Action 4 Layout + Usage·Composition·Do/Don't. 구조는 브랜드 무관 base 와 동일.
    brand: geniet
usagePolicy:
  useFor:
    - 텍스트+상태+날짜로 구성된 단순 데이터 (상담 내역·예약·알림·설정·검색 결과)
    - 10개 이상 항목의 수직 스크롤 탐색
    - 시간순 연속 정보 (알림 센터)
    - 동질적인 항목의 반복 배치 (멤버 목록, 옵션 목록)
    - 좌측 작은 썸네일 + 제목 + 메타 행 (음식·콘텐츠 검색 결과 · Thumbnail 레이아웃 size='xl')
  doNotUseFor:
    - 큰 이미지 중심의 그리드 시각 탐색 → Card (작은 좌측 썸네일+텍스트 한 줄 행은 List Thumbnail 레이아웃)
    - 2열 이상 그리드 비교 → Card 그리드
    - 컬럼별 비교가 핵심 → Table
    - 탭·필터·내비게이션 → Chip / Navigation
    - "장식용 (Decorative list) — Anti-pattern #7"
  limits:
    titleRequired: 1
    maxLeadingPerRow: 1
    maxTrailingStatusElements: 1
    minTouchTargetMobile: 48px
    densityPerList: 1
sizeMatrix:
  horizontalPadding: 16px (좌·우 동일)
  gapLeadingToContent: 12px
  gapContentToTrailing: 12px
  gapTitleToDescription: 4px
  gapDescriptionToMetadata: 2px
  minTouchTarget: 48px (모바일 필수)
  densityCompact: 40px height (size='sm') · PC only · 정보 밀도 우선 (설정·관리자)
  densityDefault: 56px height (size='md') · 표준 · 일반 목록·검색 결과·Action(Toggle/Checkbox)
  densityComfortable: 72px height (size='lg') · 여백 강조 · Avatar(48 원형)+Title+Description
  densityThumbnail: 96px height (size='xl') · 썸네일 강조 · 72×72 radius8 Thumbnail leading + Title/Description/Metadata (음식·콘텐츠)
  layouts: "4 Layout = Default(md · 텍스트+Chevron · h56) / Avatar(lg · 48 원형+이름+액션 · h72) / Thumbnail(xl · 72 사각+제목+메타 · h96) / Action(md · 텍스트+Toggle·Checkbox·Button · h56). Default·Action 은 같은 md 밀도이고 trailing 만 다르다 — Layout 은 (size + leading/trailing 슬롯)의 조합."
  paddingByDensity: "px16 / py12 / gap12 통일(sm 만 px12 py8 gap10). 높이는 min-height floor(sizing.listRow 40/56/72/96) — 짧은 행은 floor 높이, leading 이 더 크면 그만큼 자란다: lg=Avatar48+py24=72 · xl=Thumb72+py24=96 으로 floor 와 일치."
  typoTitle: Body 1 Bold 16px / LH 24px — var(--font-size-body-1) · Text/Strong/Default (지니어트 Figma 목업은 15px 로 보이나 List 는 브랜드 무관 base 표준 16px 유지 — 브랜드 타이포 차이가 필요하면 토큰 cascade 로)
  typoDescription: Body 3 Regular 14px / LH 20px — var(--font-size-body-3) · Text/Subtle/Default
  typoMetadata: Caption 2 Regular 12px / LH 16px — var(--font-size-caption-2) · Text/Muted/Default
  dividerInsetWithLeading: "padding(16) + Leading 폭 + gap(12) — 예: Avatar 36 → 64px 인셋"
  dividerInsetTextOnly: 16px (좌측 padding 만)
stateMatrix:
  default: BG var(--semantic-bg-surface-default) · Text Strong/Default · Border Normal/Default
  hover: BG var(--semantic-fill-neutral-subtle) · Border Normal/Default · ※ PC only (모바일 미지원)
  active: BG var(--semantic-bg-surface-subtle) · Text Strong/Default · Border Normal/Default
  selected: BG var(--semantic-bg-brand-subtle) · Text var(--semantic-text-brand-default) · Border var(--semantic-border-brand-default) 2px
  disabled: BG Surface/Default · Text var(--semantic-text-disabled-default) · Leading(Avatar 등) opacity 35%
  focus: BG Surface/Default · Border var(--semantic-border-focus-default) 2px
  note: 총 6 상태. 시멘틱 컬러 토큰만 사용 — raw hex/임의 색 금지.
---

## summary

수직 정렬된 동질 항목의 컨테이너. <List variant='plain|card|divided'> + <ListItem leading title description metadata trailing onSelect />. Row Anatomy 3 zone: Leading(Optional · Avatar/Thumbnail/Icon/Checkbox/Radio) + Content(Required · Title 최소 1행) + Trailing(Optional · IconButton/Badge/Toggle/Chevron/TextButton, 항상 우측 정렬). 임의 스타일 변형 차단이 목적 — Card 와 달리 단순 hierarchy 를 유지.

정보 종류에 따라 **4가지 표준 Layout** 을 쓴다 (각 Layout = `size` 밀도 + leading/trailing 슬롯 조합):

- **Default** (`size='md'` · h56) — 메뉴·네비·설정 항목. 텍스트 + 우측 Chevron. leading 없음.
- **Avatar** (`size='lg'` · h72) — 사용자·친구 목록. 48 원형 Avatar leading + 이름 + (액션 텍스트/버튼 trailing).
- **Thumbnail** (`size='xl'` · h96) — 음식·콘텐츠. 72×72 radius8 썸네일 leading + 제목 + 메타(Title/Description/Metadata). trailing 없음.
- **Action** (`size='md'` · h56) — 설정 토글·체크박스. 텍스트 + 우측 Toggle·Checkbox·Button.

## pitfalls

- [Figma 권위 룰 #1] 리스트는 카드보다 단순 hierarchy 유지 — Row 에 카드 수준의 elevation/shadow/border 적용 금지.
- [Figma 권위 룰 #2] Trailing 요소는 항상 우측 정렬. Content 영역을 침범하는 레이아웃 금지.
- [Figma 권위 룰 #3] Divider 는 Content 시작 지점 기준 인셋 — Full-width divider 금지. Leading 있으면 padding(16) + Leading 폭 + gap(12) 만큼 좌측에서 띄움. Leading 없으면 padding(16) 만 인셋.
- [Figma 권위 룰 #4] 한 Row 에 Badge/Chip/Status 2개 이상 상태 요소 동시 배치 금지 — Trailing 슬롯엔 한 종류만.
- [Figma 권위 룰 #5] 카드형 리스트 남발 금지 — 각 Row 에 독립 card 스타일(radius + shadow) 적용 X. 그룹화가 필요하면 variant='card' 또는 'divided' 로.
- [Figma 권위 룰 #6] Random Padding 금지 — Spacing 규칙(아래 sizeMatrix) 외 임의 padding/margin 적용 X.
- [Figma 권위 룰 #7] Decorative List 금지 — 정보 전달 목적 없는 장식 요소를 Row 에 추가하지 말 것.
- [Figma 권위 룰 #8] 같은 리스트 내 Density·Layout 혼용 금지 — Compact(40)/Default(56)/Comfortable(72)/Thumbnail(96) 중 하나로, 그리고 같은 Layout(예: Thumbnail)로 통일. Default + Thumbnail 같은 혼용은 시각 혼란.
- [Figma 권위 룰 #9] 리스트 Row 안에 다른 컴포넌트(Card 등) 끼워넣기 금지 — List 는 동질 행의 단순 반복. 카드형 시각 탐색이 필요하면 Card 그리드로 분리.
- [Figma 권위 룰 #10] 한 Row 에 액션 버튼 2개 이상 금지 — 명확한 단일 액션. (Trailing 슬롯 1종 원칙 #4 의 연장.)
- Avatar/Thumbnail leading 은 정사각(1:1) 비율만 — 다른 비율 사용 금지. Thumbnail 은 72×72 radius8, Avatar 는 원형 48.
- Compact(40px)는 PC only — 모바일 Min Touch Target 48px 미달이므로 모바일에선 Default(56px) 이상.
- Title 은 Content 의 Required 요소 — Description/Metadata 만 있는 Row 금지. 최소 Title 한 줄.
- Avatar + Thumbnail 같은 Leading 슬롯 안에 2종 동시 배치 금지 — Leading 은 단일 식별자.
- Row 의 클릭은 ListItem 의 `onSelect` 사용 — raw <li onClick> 금지. onSelect 가 있으면 자동으로 button 역할 + 키보드 포커스 처리.
- 리스트 제목·"더 보기" 푸터·Pagination 은 `List` 의 `header`/`footer` 슬롯에 넣는다 — ListItem(Row)으로 위장하거나 리스트 밖 형제로 두지 말 것. header/footer 는 role=presentation 이라 리스트 항목 수에 안 잡힌다.

## recommended

- 헤더/푸터 슬롯: <List header={<span>리뷰 47</span>} footer={<Button fullWidth variant='outlined'>더 보기 (전체 47)</Button>}> — 리스트가 제목·더보기·Pagination 을 직접 소유. 리뷰 등 카드형 나열은 `pattern:review-list` 참조.

- 기본 사용: <List variant='divided'><ListItem leading={<Avatar/>} title='제목' description='설명' trailing={<ChevronRightIcon/>} onSelect={…} /></List>
- PC 설정 화면 (Compact 40): <List variant='plain'><ListItem size='sm' leading={<Icon/>} title='설정 항목' trailing={<Toggle/>} /></List> — 정보 밀도 우선.
- 검색 결과 (Default 56): <List variant='divided'><ListItem leading={<Avatar/>} title='이름' trailing={<ChevronRightIcon/>} onSelect={…} /></List>
- 프로필 목록 (Comfortable 72, Avatar+Title+Description): <List variant='divided'><ListItem size='lg' leading={<Avatar size='lg'/>} title='이름' description='역할 · 메타' trailing={<TextButton/>} onSelect={…} /></List>
- 음식·콘텐츠 (Thumbnail 96): <List variant='divided'><ListItem size='xl' leading={<썸네일 72×72 radius8/>} title='음식 이름' description='상세 설명 한 줄' metadata='320 kcal · 4.5 ★ · 리뷰 128' onSelect={…} /></List> — 좌측 72 썸네일 + Title/Description/Metadata. trailing 비움.
- 알림/일정 등 날짜 보조 정보: <ListItem leading={<Avatar/>} title='제목' description='설명' metadata='2026.05.20' trailing={<ChevronRightIcon/>} onSelect={…} /> — metadata 는 Caption 2/Muted 로 description 아래에 작게 표시.
- 그룹화: variant='card' (외곽 보더+radius) 또는 'divided' (Row 간 inset divider). Row 마다 개별 card 스타일은 금지(#5). 의미 그룹 사이는 Section Header(Body3 Medium · Text/Muted · 좌측 16 padding) + Gap/Section(40) 또는 분리 배경으로 끊는다.
- 상황 → Layout 매핑: 마이페이지·설정 메뉴·FAQ·약관 → Default / 친구·팔로워 목록 → Avatar / 음식 검색·식단·콘텐츠 → Thumbnail / 알림·다크모드 ON·OFF → Action(Toggle) / 관심사·필터 체크 → Action(Checkbox).
- 빈 상태 / 로딩: Empty 는 placeholder 이미지 + 안내 문구, Loading 은 Skeleton(Gray/100 BG) 으로 행 자리를 차지.

## accessibility

- onSelect 가 있는 ListItem 은 자동으로 button 시멘틱 + 키보드 Enter/Space 핸들링. raw <li onClick> 대체 금지.
- Disabled Row 는 aria-disabled 자동 + 키보드/마우스 인터랙션 비활성. 시각적으로도 Leading opacity 35%.
- Focus 는 2px border-focus 로 표시 — outline 제거 금지.
- Avatar Leading 의 <img> 에는 alt 필수 (장식이면 alt=''). Title 과 중복되는 alt 는 비우기.

## interactivePattern

ListItem 의 onSelect 로 인터랙티브화 — 자동으로 button role + 키보드 포커스. Trailing 슬롯 안에 별도 Button/IconButton 두면 그 핸들러에서 e.stopPropagation() 호출해 Row 전체 클릭과 분리. Hover 는 PC only (모바일 미지원) — 모바일에선 active(터치 시 BG Surface/Subtle) 로만 피드백.

## examplesHtml.do

```html
<nds-list>
  <nds-list-item interactive>설정 항목 1</nds-list-item>
  <nds-list-item interactive active>설정 항목 2</nds-list-item>
</nds-list>
<script>list.addEventListener("list-item-select", e => …);</script>
```

## examplesHtml.dont

```html
<!-- nds-list-item 가 아닌 raw <li> 를 직접 넣음 — 위계/사이즈가 깨짐 -->
<nds-list><li>설정 1</li></nds-list>
```
