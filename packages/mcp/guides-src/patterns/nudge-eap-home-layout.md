---
examples:
  - verdict: good
    source: Figma 20:7250 NudgeEAP 고객 홈 (B2B 아모레퍼시픽)
    caption: 1920 + 1200 rail + WebHeader 80 + cream 히어로 812×400 + 3 blue-50 카드 + 24/32/16/8 radius 패밀리 + 채널톡 FAB.
metrics:
  viewport: desktop 1920px, content rail 1200px (gutter 360)
  pageBg: "#fff"
  sectionBg: "#FAFAFA"
  webHeaderHeight: 80px
  heroSize: "812×400 rounded-20 bg #FFEDD0"
  heroTitle: Bold 36 검정
  quickActionCard: "385×128 rounded-12 bg #F1F8FD padding 28×24 gap 23"
  sectionHeading: "Bold 28/38 + 더보기 Bold 18/26 #666"
  carouselCardStd: "240w rounded-16 bg #FAFAFA gap 24"
  carouselCardFeatured: "440w rounded-16 bg #FFF7E6 + GO pill #FFA411"
  letterCard: "385w + thumb 250h rounded-8 bg #EBEBEB"
  noticeList: "border #ECECEC rounded-8 pt-24 pb-16 px-24, 52px rows, divider #EEE"
  noticeBadgeNotice: "#DFF1FF / #007EE4 rounded-13 Bold 14"
  noticeBadgeEvent: "#FCE3EC / #ED2E77"
  bannerBrown: "#67544D + white pill CTA"
  bannerBlue: var(--semantic-bg-brand-default) + white pill CTA
  fabSize: 56×56 채널톡
  footerHeight: "1920×198 bg #F5F5F5"
  projectPrimary: var(--semantic-bg-brand-default)
  pinkAccent: "#ED2E77 (이벤트 한정)"
  maxPrimarySolidPerScreen: 1
  whitelabel: true (고객사 로고/명 + CMS 스트립 인사말)
  relatedPatterns: nudge-eap-form-layout, nudge-eap-landing-layout, cta-group
figmaNodeUrl: https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=20-7250
references:
  - label: NudgeEAP 고객 홈 SSOT — 홈 1404 (Figma 20:7250)
    image: references/nudge-eap-home-20-7250.png
    caption: NudgeEAP 고객사용 홈 페이지 SSOT 스크린샷 (desktop 1920, 1200 rail, B2B 화이트라벨).
    project: nudge-eap
---

## summary

NudgeEAP 고객사용(B2B EAP customer) 홈 페이지 레이아웃 — 'WebHeader 80 + CMS 스트립 + 1200 rail → cream 히어로 812×400 → blue-50 3카드 빠른 액션 → 캐러셀 (240w 표준 + 440w featured) → 주간레터 그리드 → 공지 list → 채널톡 FAB' 표준. Figma 20:7250 실측. 데스크탑 전용 1920w, B2B 화이트라벨.

## rules

- **뷰포트**: 데스크탑 1920px 풀폭, 본문 rail **1200px** (gutter 360). bg pure white.
- **WebHeader**: 80h, 좌측 고객사 로고 200×60, 센터 6 nav (`Bold 18/26 #111`), 우측 [로그인 #2b96ed]/[앱 다운로드 #F5F5F5 + blue]. notification/profile icon 없음.
- **CMS 스트립**: 헤더 아래 풀폭, bg `#FAFAFA`, `py-14 px-360`. 고객사 인사말 Medium 16/24 + 보조 Regular 14/20.
- **히어로 배너**: 단일 카드 **812×400 rounded-20 bg #FFEDD0 (cream)** — 마음치유 톤. 타이틀 36 Bold 검정 + 16/24 Regular + 우측 하단 'rolling' pagination chip. 우측엔 banner 선택 그리드 (w-364, gap 16-18).
- **3-카드 빠른 액션**: 히어로 아래 3개 가로 CTA 카드, **385×128 rounded-12 bg #F1F8FD (blue/50) padding 28×24 gap 23**. 내부: 20/28 Bold 타이틀 + 16/24 #666 보조 + 80px 일러스트. 라벨: 바로 상담하기 / 상담사 찾기 / 상담 센터 찾기.
- **섹션 헤딩**: **28/38 Bold 검정** + 우측 '더보기' (18/26 Bold #666 + ChevronRight). 검사/주간레터/회사소식 반복 적용.
- **심리검사 캐러셀**: h-280, 카드 rounded-16 gap 24. 표준 **240w bg #FAFAFA**, featured **440w bg #FFF7E6 + 'GO' 원형 pill (#FFA411)**. 양 끝 chevron 버튼 68×68 원형 border #D8D8D8. 좌우 white gradient fade.
- **주간레터 그리드**: 3 × 385w 카드, 썸네일 **250h rounded-8 bg #EBEBEB** + 타이틀 20/28 Medium. gap 24.
- **공지 list (회사소식)**: border `#ECECEC rounded-8` 카드, `pt-24 pb-16 px-24`. 52px 행, divider #EEE. 배지 공지 `#DFF1FF / #007EE4`, 이벤트 `#FCE3EC / #ED2E77` rounded-13 Bold 14.
- **보조 배너 띠**: 1200×110-120 풀폭. brown `#67544D` + white pill (생활상담), `var(--semantic-bg-brand-default)` + white pill (앱 다운로드).
- **채널톡 FAB**: 우측 하단 56×56 원형. desktop 이므로 BottomNav 없음.
- **Footer**: 1920×198 bg `#F5F5F5`. 주소/사업자번호/연락처 14/20 Regular #383838 + ISO 27001 로고 우측.
- **컬러 토큰**: page bg #fff, section bg #FAFAFA, primary card `var(--semantic-bg-brand-subtle)`, featured #FFF7E6, thumb #EBEBEB, project `var(--semantic-bg-brand-default)`, pink #ED2E77 (이벤트 한정).
- **B2B 화이트라벨**: 좌측 상단 로고가 고객사 (e.g. 아모레퍼시픽). NudgeEAP 자체 브랜딩은 footer 에만.

## avoid

- 모바일 BottomNav 추가 — 데스크탑 홈은 채널톡 FAB 만.
- Greeting/Notification icon 을 헤더 우측에 — NudgeEAP B2B 헤더는 [로그인][앱 다운로드] 페어.
- Pink `#ED2E77` 을 일반 강조에 — 이벤트 배지 한정.
- Hero 배경을 project blue 로 — cream/warm 톤 (`#FFEDD0`) 이 멘탈케어 시그니처.
- 3-카드 빠른 액션을 4개 이상으로 — 3개가 위계 한계.
- 심리검사 캐러셀 카드 색 다양화 — 표준 #FAFAFA + featured #FFF7E6 두 톤만.
- Banner strip 을 페이지 상단 추가 — hero 1개 + 중간 strip 1-2개가 한계.
- 한 페이지에 primary `var(--semantic-bg-brand-default)` solid CTA 2개 이상.
