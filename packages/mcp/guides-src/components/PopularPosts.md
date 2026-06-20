---
figmaNodeUrl: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=148-68
sizeMatrix:
  containerWidth: 353px (PC 사이드바 폭 가정)
  containerPadding: 20px (--semantic-inset-card-large)
  containerRadius: 8px (--radius-md)
  containerBorder: 1px var(--semantic-border-subtle-default)
  gapBetweenSections: 16px (header ↔ tabs ↔ list) — gap-loose
  tabHeight: 32px (pill)
  tabPadding: 6px 12px
  tabRadius: pill (height/2 = 16px) — radius.pill 토큰
  tabGap: 8px
  tabFontActive: Body3 14/20 Bold
  tabFontInactive: Body3 14/20 Medium
  rowHeight: 32px (min) · py 6
  rowGap: 4px (rank ↔ title ↔ count)
  rankWidth: 21px (두 자리 고정폭)
  titleType: Body3 14/20 Regular · cv.textRole.strong · 한 줄 truncate
  countType: Body3 14/20 Medium · cv.textRole.statusError · whitespace-nowrap
  headerTitleType: Headline5 18/26 Bold · cv.textRole.strong
  moreType: Body3 14/20 Regular · cv.textRole.subtle + 16px chevron
stateMatrix:
  tabDefault: bg cv.surface.section · text cv.textRole.subtle · Medium
  tabHover: bg cv.surface.subtle · text cv.textRole.strong (PC only)
  tabActive: bg cv.surface.brandSubtle · text cv.textRole.brand · Bold
  rowDefault: static row (button 시멘틱은 onItemClick 있을 때만)
  rowHover: opacity 0.7 (button 일 때만, PC only)
  moreHover: text cv.textRole.strong
  note: 탭 active 톤은 시멘틱 토큰 참조이므로 프로젝트 theme(`projects/*.semantic.ts`)에 따라 자동 적용. 프로젝트별 raw 매핑은 토큰 파일이 SSOT.
usagePolicy:
  useFor:
    - PC 사이드바 커뮤니티 인기글 랭킹 (메인·카테고리·리스트 페이지 공통)
    - 기간/정렬 탭으로 전환되는 ranked Top-N 위젯
  doNotUseFor:
    - 모바일 화면 (별도 모듈로 분기 — 사이드바 폭 가정)
    - 11개 이상의 동일 리스트 (별도 페이지·모달로)
    - 이미지/썸네일 포함 카드형 리스트 → Card 또는 List + ListItem
    - 텍스트 검색 키워드 트렌드 → TrendingKeywords
  limits:
    maxItems: 10
    maxTabs: 5 권장 (스크롤 가능하지만 가독성 저하)
    countCap: 999 초과 시 자동 '+999' 캡
    rankWidth: 21px 고정 — 두 자리 zero-padded
---

## summary

사이드바용 커뮤니티 인기글 랭킹 모듈. Header(제목 + 더보기) + Tab(기간/정렬 pill 5개) + ranked row 리스트 의 3단 레이어. Row = Rank(Bold) + Title(truncate) + Count(red, `[N]` / 999 초과 `[+999]`). PC 사이드바 폭(≈353w) 가정 — 모바일은 별도 모듈로 분기.

## pitfalls

- Rank 는 컴포넌트 내부에서 두 자리 zero-padded 로 자동 변환 — `items` 에 별도 rank 필드 넘기지 말 것. 배열 순서가 곧 순위.
- Count 는 컴포넌트가 자동 포맷 (`[N]` / 999 초과 `[+999]`) — 외부에서 문자열로 가공해서 넘기지 말 것.
- 최대 10개 row 까지만 노출하는 것이 디자인 가이드. 초과분은 시각적으로는 잘리지 않지만, `onMoreClick` 으로 별도 페이지/모달로 분기할 것.
- Active 탭은 한 그룹에 하나만 — `activeTabKey` 단일 키 prop 사용. 자동으로 project-subtle pill + project text 톤 적용.
- 탭 active 톤은 프로젝트 시멘틱(`cv.surface.brandSubtle` + `cv.textRole.brand`)으로 자동 매핑 — raw hex 로 override 금지. 프로젝트별 실제 색은 `packages/tokens/src/projects/{geniet,nudge-eap,trost}.semantic.ts` SSOT 참조.
- Rank 색을 강조색(red/project 등)으로 변경 금지 — Rank 는 보조 정렬 지표일 뿐, Count(red) 와 시각 위계 충돌.
- Count 를 title 왼쪽에 두는 등 순서 변경 금지 — 항상 rank → title → count.
- Title 은 한 줄 truncate 고정 (CSS `text-overflow: ellipsis`). 두 줄 wrap 시 시각적 그리드 깨짐.
- `onMoreClick` 미지정 시 더보기 영역이 숨겨짐 — '더보기' 가 필요한 화면이면 콜백 필수.
- `tabs` 없이도 동작 (탭 없는 단일 랭킹) — 빈 배열/undefined 면 탭 영역 자체 숨김.

## recommended

- 기본 사이드바 (5탭 + 더보기 + 클릭): <PopularPosts tabs={tabs} activeTabKey={key} onTabChange={setKey} items={items} onMoreClick={goList} onItemClick={(item)=>nav(item.id)} />
- 탭 없는 단일 랭킹 (단일 기간): <PopularPosts items={items} onMoreClick={goList} />
- items 길이는 10 이하로 유지 — 11번째 row 부터는 별도 페이지/모달로 분기 (가이드 준수).

## accessibility

- 탭은 role='tab' + aria-selected, 그룹은 role='tablist' 자동 부여 — 외부에서 role 덮어쓰지 말 것.
- Row 클릭이 필요하면 onItemClick 사용 — 자동으로 <button> 으로 렌더되어 키보드 Enter/Space 인터랙션 보장.
- 더보기 버튼은 <button type='button'> — form 내부에 두어도 submit 안 됨.

## examplesHtml.do

```html
<nds-popular-posts module-title="요즘 인기 글" show-more
  tabs='[{"key":"day","label":"오늘"},{"key":"week","label":"이번 주"}]'
  active-tab="day"
  items='[{"id":"1","title":"불안 다스리는 법","count":1024}]'
  item-clickable></nds-popular-posts>
<script>el.addEventListener("nds-popular-item-click", e => navigate(`/post/${e.detail.item.id}`));</script>
```

## examplesHtml.dont

```html
<!-- active-tab 을 index 로 — key 가 정답 -->
<nds-popular-posts tabs='[...]' active-tab="0"></nds-popular-posts>
```
