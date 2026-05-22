---
"@nudge-eap/react": minor
"@nudge-eap/mcp": minor
---

`GenietAppBar` — Figma 77:2 (Geniet_TopHeader_Guide) 개편판 반영.

**Desktop (1920 × 172)**: 단일 MainBar+NavBar 구조에서 _Search Header(54h) + Menu Header(58h)_ 2단으로 재정렬.

- Search Header: logo(165×54) + search frame(pill 500 + 인기검색어 NEW chip, gap 24) + login_area(쿠폰상점·마이페이지·로그인 _header action button_ — icon 28 + Pretendard 11px label, 52×46 vertical).
- Menu Header: 음식 카테고리(160×58) + GNB(_홈/커뮤니티/헬시딜/음식 리뷰/기록_, Pretendard Bold 17, gap 20) + 우측 CTA pill(_캐시리뷰_ outline · _친구초대 이벤트_ tinted).

**Mobile (360 × 102)**: 단일 row + 검색·알림 액션 구조에서 _Row1(50h) + Row2(52h)_ 2단으로 변경.

- Row1: logo(97×32 mint) + outlined point chip(gpoint icon + amount) + user icon.
- Row2: hamburger 24 + search input(292×38, radius 8, gray fill).

**Props 변경**:

- 신규: `actionButtons: GenietAppBarAction[]` (login_area), `ctaButtons: GenietAppBarCta[]` (Menu Header 우측), `pointChip: GenietAppBarPointChip` (mobile Row1), `showUserIcon` / `onUserClick` / `onMobileMenuClick` / `mobileSearchPlaceholder` / `pcTopPadding` / `pcGap` / `pcSearchHeight` / `pcMenuHeight` / `searchWidth`.
- 제거: `authItems` (`actionButtons` 로 대체), `mobileActions` (mobile 구조가 고정), `mainBarPaddingY` / `navHeight`.

**MCP 가이드** (`COMPONENT_GUIDES.GenietAppBar`) 갱신 — 새 figmaNodeUrl(77:2), 새 props snippet, pitfall 7개.

**브랜드 fixture** (`apps/storybook/src/brand-fixtures.ts` geniet 블록) 갱신 — GNB items / auth items / searchBar 카피 / mobileHeight 102 / logo mobile height 32 등 새 spec 반영.
