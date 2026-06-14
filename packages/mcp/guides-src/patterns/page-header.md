---
{}
---

## summary

페이지 단위 헤더(제목 + 뒤로가기 + 브레드크럼 + 액션 + 하단 탭)는 **DS 컴포넌트가 아니라 조립 패턴**이다. 칠하는 픽셀이 전부 이미 있는 조각(Heading / Breadcrumb / IconButton / Button / Tab)이고, 예전 `<PageHeader title subtitle onBack breadcrumb actions bottom>` 컨테이너는 그 조각을 한 줄로 감싸기만 한 thin wrapper 라 — Figma 가이드 노드 없음 + Heading 합성 셸이라 제거(강등)했다(MultiStepForm 선례와 동일). AppBar(글로벌 네비)와는 다르다 — 이건 **콘텐츠 영역 안의 페이지 제목 블록**이다. 아래 조립 계약을 따른다.

## rules

- ① 제목은 `Heading` 으로(MUST) — `Heading level="h2" as="h1"`. 시각 스케일은 h2, 시맨틱은 페이지 랜드마크 h1. 부제는 Heading 의 `description`. 폰트·제목↔부제 gap·색은 **Heading 이 SSOT** — 따로 박지 말 것. (제목을 FormSection.title 로 흉내내지 말 것 — 그건 폼 섹션 제목.)
- ② 구조는 위→아래 3행(MUST 순서) — **(선택)top row → main row → (선택)bottom row**:
  - **top row** (뒤로가기/브레드크럼 있을 때만): ← 뒤로가기(`IconButton`, 원형 32) + `Breadcrumb`. 화면 history 컨텍스트.
  - **main row** (space-between): 좌측 `Heading`(title + description) · 우측 액션 슬롯(`Button`/`IconButton`, pattern:cta-group 의 우측 hug).
  - **bottom row** (선택): `Tab`(탭형 페이지) 또는 `FilterBar`. 컨테이너 좌우 패딩을 상쇄해 풀블리드.
- ③ 간격·여백은 토큰으로(MUST) — 컨테이너 `gap: --semantic-gap-comfortable`, `padding: --semantic-inset-card-large --semantic-inset-modal`. raw px 금지.
- ④ 배경은 기본 투명(SHOULD) — 콘텐츠 위에 얹히는 제목 블록이라 기본 transparent. 흰 카드로 띄워야 하면 그 컨테이너에만 surface 토큰을 준다(브랜드 admin 합의 따름).
- ⑤ 하단 보더는 옵션(SHOULD) — 리스트/디테일 구분이 필요하면 `border-bottom: 1px var(--semantic-border-subtle-default)`. **캐포비 admin 은 끄는 게 규칙**(pattern:cashwalk-biz-page-* 참조).
- ⑥ 액션은 우측 정렬 한 행(MUST) — pattern:cta-group 을 따른다. 주 액션 1개 + 보조 0~2개. 액션 폭주 금지.
- ⑦ 접근성(MUST) — 페이지 제목은 문서에 h1 하나(Heading as="h1"). 뒤로가기는 `aria-label`. 탭은 Tab 의 role=tablist 그대로.
- ⑧ 컴포넌트 승격 기준(governance) — 다시 DS 컴포넌트로 만들려면 **2개 이상 브랜드의 실제 채택 + Figma 가이드 노드** 둘 다 충족해야 한다(예전 셸이 제거된 이유).

## avoid

- 진척/조각만 감싸고 어려운 건 없는 **thin wrapper 컴포넌트를 새로 만들기** — 직접 조립 대비 가치가 없어 제거된 안티패턴.
- 페이지 제목을 raw `<h1 style>` / `<div>` 로 — 타이포·시맨틱이 Heading 과 어긋난다. 항상 `Heading`.
- AppBar(글로벌 상단 네비)와 혼동 — AppBar 는 앱 셸 상단, 이건 콘텐츠 영역 안 페이지 제목.
- 액션을 좌측·중앙에 흩뿌리기 — 우측 한 행(cta-group).
- 색·간격 raw hex/px — semantic 토큰으로 5 브랜드 자동 대응.
- 캐포비 admin 에서 하단 보더 켜기 — admin 규칙 위반(pattern:cashwalk-biz-page-*).

## readyMade.note

페이지 헤더 조립 골격. 제목은 Heading(h2/as=h1), (선택)뒤로가기+Breadcrumb top row, 우측 actions, (선택)하단 Tab. 색·간격은 전부 토큰.

## readyMade.html

```html
<!-- 페이지 헤더 = 조립 패턴. 단일 컴포넌트 아님. -->
<header style="display:flex; flex-direction:column; gap:16px; padding:24px 20px">
  <!-- (선택) top row: 뒤로가기 + 브레드크럼 -->
  <div style="display:flex; align-items:center; gap:8px">
    <nds-icon-button aria-label="뒤로가기" size="small"></nds-icon-button>
    <nds-breadcrumb>
      <nds-breadcrumb-item href="/">홈</nds-breadcrumb-item>
      <nds-breadcrumb-item href="/list">목록</nds-breadcrumb-item>
    </nds-breadcrumb>
  </div>

  <!-- main row: 제목(Heading) + 우측 액션 -->
  <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px">
    <nds-heading level="h2" as="h1" title="주문 상세" description="주문 번호 #10293"></nds-heading>
    <div style="display:flex; gap:8px">
      <nds-button variant="outlined" color="neutral">취소</nds-button>
      <nds-button>저장</nds-button>
    </div>
  </div>

  <!-- (선택) bottom row: 탭 -->
  <nds-tab active-key="info" items='[{"key":"info","title":"정보"},{"key":"history","title":"이력"}]'></nds-tab>
</header>
```
