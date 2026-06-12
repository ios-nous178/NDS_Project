---
_htmlStatus: no-html-equivalent
figmaNodeUrl: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=77-2
references:
  - label: Geniet 데스크톱 홈 SSOT — 웹 PC 홈 풀 캡처
    image: references/geniet-web-home.png
    caption: Geniet 데스크톱 홈. 상단 Search Header(로고 + 검색 pill + 포인트/마이페이지/로그아웃 action) + Menu Header('음식 카테고리' 박스 + GNB 5탭 + 캐시리뷰/친구초대 CTA pill) 의 2단 구조. 본문은 헬시딜 배너 / 커뮤니티 BEST / 유저 리뷰 / 판매랭킹 / 매거진 / GenietFooter.
    brand: geniet
  - label: Geniet 데스크톱 — 리뷰 작성 모달 오버레이
    image: references/geniet-web-review-modal.png
    caption: Geniet 데스크톱 음식 리뷰 페이지 위에 리뷰 작성 모달이 떠 있는 상태. 배경에 GenietAppBar Menu Header(음식 카테고리/홈/커뮤니티 GNB + 카테고리 chip row + 리뷰쓰기 mint CTA) 가 보임. 모달 자체는 별도 Dialog 컴포넌트 — AppBar 와 함께 등장하는 전형적 패턴.
    brand: geniet
---

## summary

Geniet 브랜드 상단 헤더 (Figma 77:2 개편판). desktop = 2단(Search Header 54h + Menu Header 58h, 전체 172h) / mobile = 2단(Row1 50h + Row2 52h, 전체 102h) / webview variant. base Header 대신 Geniet 화면에서는 이걸 사용.

## pitfalls

- Geniet 화면이면 base `<Header>` 가 아니라 `<GenietAppBar>` 사용. 검색 pill, '음식 카테고리' 박스, login_area action button(icon 28 + 11px 라벨), CTA mint pill 같은 구조는 DS 가 들고있다 — 인라인 손코딩 금지.
- Search Header 우측은 `actionButtons` (icon+label vertical, 52×46). 단순 텍스트 link 면 `actionButtons` 가 잘못 — 이건 vertical 액션 버튼 슬롯. 예전 `authItems` / `mobileActions` 슬롯은 제거됨.
- Search Header 의 trendingKeywords 는 검색 pill 바로 옆 (gap 24). Menu Header 안에 두지 말 것 (이전 구조와 다름).
- Menu Header 우측 CTA 는 `ctaButtons` 에 tone='outline'(캐시리뷰) / 'tinted'(친구초대) / 'filled' 로 분류. 톤 임의 금지.
- Mobile 검색 placeholder 는 PC와 카피가 다름 — `mobileSearchPlaceholder` 별도 지정. (PC: '궁금한 음식 칼로리...' / Mobile: '음식명, 칼로리, 영양성분, 음식 리뷰 검색')
- Mobile Row1 우측 포인트 chip 은 `pointChip={{ amount: '34,300' }}` — gpoint 아이콘 기본, 텍스트 Medium 14. 사용자 아이콘은 `showUserIcon=true` (기본).
- variant='webview' 일 때 logo 무시 (안 보임). webviewTitle / onBack 만 의미.

## recommended

- Desktop: `<GenietAppBar variant='desktop' logo={...} gnbItems={...} activeKey='home' actionButtons={[{ key:'coupon', label:'쿠폰상점', icon:<GenietCouponIcon size={28} /> }, { key:'mypage', label:'마이페이지', icon:<GenietMypageIcon size={28} />, dividerBefore:true }, { key:'login', label:'로그인', icon:<GenietLoginIcon size={28} /> }]} searchPlaceholder='궁금한 음식 칼로리...' trendingKeywords={...} ctaButtons={[{ key:'cashreview', label:'캐시리뷰', icon:<GenietCashreviewIcon size={14} />, tone:'outline' }, { key:'invite', label:'친구초대 이벤트', icon:<GenietConfettiIcon size={14} />, tone:'tinted' }]} />`
- Mobile: `<GenietAppBar variant='mobile' logo={...} mobileSearchPlaceholder='음식명, 칼로리...' pointChip={{ amount:'34,300' }} />` — Row1 logo + 포인트/유저, Row2 햄버거 + 검색.
- Webview: `<GenietAppBar variant='webview' webviewTitle='건강 기록' onBack={...} />` — BackButton 자동.
- 카테고리 박스 라벨/링크 변경: `category={{ label: '카테고리', href: '/cat' }}`. 숨기려면 `category={false}`.
- GNB 5탭 기본: 홈 / 커뮤니티 / 헬시딜 / 음식 리뷰 / 기록 (Pretendard Bold 17).
- HTML 목업(vanilla): `<nds-brand-header brand='geniet' surface='mobile' active-key='home'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 웹뷰는 surface='webview'.
