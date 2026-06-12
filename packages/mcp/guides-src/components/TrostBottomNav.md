---
figmaNodeUrl: https://www.figma.com/design/H0UUl3maspMM2iaoRAsrf7/%ED%8A%B8%EB%A1%9C%EC%8A%A4%ED%8A%B8-Dev?node-id=5-1169
---

## summary

Trost BottomNav — 트로스트는 앱이 두 종류라 variant 로 분기. variant='trost'(기본): 트로스트 앱 5탭 (홈/심리상담/커뮤니티/멘탈케어/내공간 — Figma 5:1169). variant='cashwalk-trost': (캐시워크)트로스트 앱 5탭 (홈/사운드/내음악/커뮤니티/마이페이지 — Figma 5:1249·5:1306). 두 variant 모두 5탭 active/inactive 그래픽 분리, active 색은 브랜드색 아닌 검정. HTML 목업은 `<nds-brand-bottom-nav brand='trost'>` — 단, 기본 트로스트 variant 만 커버(cashwalk-trost 미지원).

## pitfalls

- variant 마다 label 매핑이 다름. trost: 홈/심리상담/커뮤니티/멘탈케어/내공간. cashwalk-trost: 홈/사운드/내음악/커뮤니티/마이페이지. 매핑 실패 시 각 variant 의 홈 아이콘으로 fallback.
- 두 앱 모두 '홈/커뮤니티' 탭이 있지만 그래픽이 다름 — 반드시 variant 로 구분. trost 커뮤니티=TrostCommunity(게시판), cashwalk-trost 커뮤니티=TrostMkTalk(말풍선+점).
- active 색 = --semantic-icon-strong-default. 다른 브랜드처럼 brand 색으로 칠하지 말 것 (Figma 정합).
- trost 앱 전용 그래픽 = Trost{Home,Counsel,Community,Mentalcare,My} (전부 stroke 1.5, Figma 5:1169). generic Home/Mentalcare/Mypage·NudgeEAP Counsel(점3개)·빈 말풍선 Comment 와 다름.
- cashwalk-trost 전용 그래픽 = TrostMk{Home,Sound,Mymusic,Talk,Mypage} (Figma 'Mk' 레이어, 5:1249·5:1306). 트로스트 앱 아이콘과 절대 혼용 금지.

## recommended

- 트로스트 앱: `<TrostBottomNav tabs={[{ key:'home', label:'홈', href:'/' }, ...]} activeTab='home' />` (variant 생략 = 'trost')
- (캐시워크)트로스트 앱: `<TrostBottomNav variant='cashwalk-trost' tabs={[{ key:'home', label:'홈', href:'/' }, { key:'sound', label:'사운드', ... }, ...]} />`
- HTML 목업(vanilla, 기본 트로스트 앱): `<nds-brand-bottom-nav brand='trost' active-key='home'>` — 제네릭 nds-footer-tab-bar 손수 조립 금지.
