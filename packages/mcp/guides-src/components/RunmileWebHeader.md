---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://www.figma.com/design/g3ifA735EE6EKjeL4ZW2ax/?node-id=1058-13336
references: []
---

## summary

Runmile 데스크톱 PC 헤더 (height 80, bg white, border-bottom 1px gray300, content max-width 1440 / 좌우 80px). 로고(coral) + 좌측 GNB(대회 정보/커뮤니티, Bold 18) + 중앙 검색바(coral 2px border, rounded 100) + 우측 액션(아이콘 28 + 라벨 14). `loggedIn` 으로 우측 액션 분기: false=채팅/로그인, true=채팅(미읽음 badge)/마이페이지. 모바일/웹뷰는 RunmileAppBar. **HTML 목업은 `<nds-brand-header brand='runmile' surface='web'>` (BottomNav 와 동일한 brand wrapper 패턴 — BrandHeader 가이드). base nds-header 손수 조립 금지.**

## pitfalls

- 데스크톱 전용. 모바일/웹뷰 헤더는 `RunmileAppBar` (Figma 36:258) 사용.
- 로고는 base64 내장이 기본값 — `logoSrc` 안 줘도 coral #FF5B37 워드마크가 자동 렌더 (파일 호스팅 불필요). 자체 로고로 바꿀 때만 `logoSrc` 주입. `logoSrc=''` 처럼 빈 값을 명시하면 'Runmile' 텍스트 폴백.
- 우측 채팅 아이콘은 단일 말풍선(RunmileChattingIcon) — 바텀네비 채팅 탭의 이중 말풍선(RunmileChats)과 다름.
- 미읽음 badge 는 `loggedIn && chatUnreadCount > 0` 일 때만 노출 (99 초과 시 '99+').
- 색은 전부 data-brand="runmile" cascade 의 --semantic-* 토큰 — host 가 hex 로 덮지 말 것.

## recommended

- 로그인 전 (로고 생략 = base64 기본): `<RunmileWebHeader menuItems={[{key:'competition',label:'대회 정보',href:'/competitions'},{key:'community',label:'커뮤니티',href:'/community'}]} activeKey='competition' loggedIn={false} onSearch={...} />`
- 로그인 후: `<RunmileWebHeader menuItems={RUNMILE_GNB} activeKey='community' loggedIn chatUnreadCount={12} myPageHref='/my' profileSrc={avatarUrl} />` — 자체 로고로 바꾸려면 `logoSrc={...}` 추가.
- HTML 목업(vanilla): `<nds-brand-header brand='runmile' surface='web' active-key='race'>` — base nds-header + nds-header-menu-item 손수 조립 금지 (BrandHeader 가이드). 모바일 bar 는 surface='mobile'.
